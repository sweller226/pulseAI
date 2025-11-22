// hello_vitals.cpp
// SmartSpectra Hello Vitals - Main Application

#include <smartspectra/container/foreground_container.hpp>
#include <smartspectra/container/settings.hpp>
#include <smartspectra/gui/opencv_hud.hpp>
#include <physiology/modules/messages/metrics.h>
#include <physiology/modules/messages/status.h>
#include <glog/logging.h>
#include <opencv2/opencv.hpp>
#include <iostream>
#include "config.hpp"
#include "flask_client.hpp"
#include "landmark_converter.hpp"

using namespace presage::smartspectra;

int main(int argc, char** argv) {
    // Initialize logging
    google::InitGoogleLogging(argv[0]);
    FLAGS_alsologtostderr = true;

    // Load API key
    std::string api_key = Config::loadApiKey();
    if (api_key.empty()) {
        std::cerr << "Failed to load PRESAGE_API_KEY from .env file!" << std::endl;
        std::cout << "Get your API key from: https://physiology.presagetech.com\n";
        return 1;
    }

    std::cout << "Starting SmartSpectra Hello Vitals...\n";
    std::cout << "WSL will listen on: tcp://0.0.0.0:8081\n";
    std::cout << "Video can come from:\n";
    std::cout << "  1. FFmpeg: ffmpeg -f dshow -i video=\"Integrated Webcam\" -vf scale=1280:720 -f mpegts tcp://" 
              << Config::WSL_IP << ":8081\n";
    std::cout << "  2. Python: python main.py --gui --stream-to-wsl\n\n";
    
    // Connect to Flask backend
    FlaskClient flask_client(Config::FLASK_HOST, Config::FLASK_PORT);
    flask_client.connect();

    try {
        // --- Create settings ---
        container::settings::Settings<
            container::settings::OperationMode::Continuous,
            container::settings::IntegrationMode::Rest
        > settings;

        // --- Configure to use TCP video stream ---
        settings.video_source.device_index = -1; // Don't use local camera
        settings.video_source.input_video_path = Config::VIDEO_STREAM_URL; // tcp://0.0.0.0:8081
        settings.video_source.resolution_selection_mode = video_source::ResolutionSelectionMode::Auto;
        settings.video_source.capture_width_px = Config::VIDEO_WIDTH;
        settings.video_source.capture_height_px = Config::VIDEO_HEIGHT;
        settings.video_source.auto_lock = true;

        // Basic settings
        settings.headless = true;  // Disable SmartSpectra's default window
        settings.enable_edge_metrics = true;  // Enable edge metrics for detailed data
        settings.enable_dense_facemesh_points = true;  // Enable face landmarks
        settings.verbosity_level = 1;

        // Continuous mode buffer
        settings.continuous.preprocessed_data_buffer_duration_s = 0.5;

        // API key for REST
        settings.integration.api_key = api_key;

        // Create container and HUD
        auto container = std::make_unique<container::CpuContinuousRestForegroundContainer>(settings);
        auto hud = std::make_unique<gui::OpenCvHud>(10, 0, 1260, 400);
        
        // Store detailed vitals data
        DetailedVitals detailed_vitals = {};

        // --- Set up callbacks ---
        auto status = container->SetOnCoreMetricsOutput(
            [&hud, &flask_client, &detailed_vitals](const presage::physiology::MetricsBuffer& metrics, int64_t timestamp) {
                // Access pulse data from rate array
                if (metrics.has_pulse() && metrics.pulse().rate_size() > 0) {
                    detailed_vitals.pulse_rate = static_cast<int>(metrics.pulse().rate(0).value());
                    detailed_vitals.pulse_confidence = metrics.pulse().rate(0).confidence();
                }
                
                // Access breathing data from rate array
                if (metrics.has_breathing() && metrics.breathing().rate_size() > 0) {
                    detailed_vitals.breathing_rate = static_cast<int>(metrics.breathing().rate(0).value());
                    detailed_vitals.breathing_confidence = metrics.breathing().rate(0).confidence();
                }
                
                // Access face data
                if (metrics.has_face()) {
                    if (metrics.face().talking_size() > 0) {
                        detailed_vitals.talking = metrics.face().talking(0).detected();
                    }
                }
                
                detailed_vitals.timestamp = timestamp;

                // Only send if values are valid
                if (detailed_vitals.pulse_rate > 0 && detailed_vitals.breathing_rate > 0) {
                    std::cout << "Core Vitals - Pulse: " << detailed_vitals.pulse_rate 
                              << " BPM (conf: " << detailed_vitals.pulse_confidence 
                              << "), Breathing: " << detailed_vitals.breathing_rate 
                              << " BPM (conf: " << detailed_vitals.breathing_confidence << ")\n";
                    
                    // Send detailed vitals to Flask backend
                    flask_client.sendDetailedVitals(detailed_vitals);
                }
                
                hud->UpdateWithNewMetrics(metrics);
                return absl::OkStatus();
            }
        );
        if (!status.ok()) {
            std::cerr << "Failed to set metrics callback: " << status.message() << "\n";
            return 1;
        }
        
        // Set up edge metrics callback for real-time face landmarks only
        // Store all 478 landmarks temporarily for conversion
        std::vector<Point2D> all_landmarks;
        
        status = container->SetOnEdgeMetricsOutput(
            [&all_landmarks](const presage::physiology::Metrics& metrics, int64_t timestamp) {
                // Access face landmarks (only thing available in edge metrics for face)
                if (metrics.has_face() && !metrics.face().landmarks().empty()) {
                    const auto& latest_landmarks = *metrics.face().landmarks().rbegin();
                    
                    // Store all 478 MediaPipe landmarks
                    all_landmarks.clear();
                    for (int i = 0; i < latest_landmarks.value_size(); ++i) {
                        const auto& point = latest_landmarks.value(i);
                        all_landmarks.push_back({point.x(), point.y()});
                    }
                }
                
                return absl::OkStatus();
            }
        );
        if (!status.ok()) {
            std::cerr << "Failed to set edge metrics callback: " << status.message() << "\n";
            return 1;
        }

        status = container->SetOnVideoOutput(
            [&hud, &detailed_vitals, &all_landmarks](cv::Mat& frame, int64_t timestamp) {
                if (auto render_status = hud->Render(frame); !render_status.ok()) {
                    std::cerr << "HUD render failed: " << render_status.message() << "\n";
                }
                
                // Add custom overlay with detailed metrics on the LEFT side
                int y_offset = 30;
                int line_height = 25;
                int x_position = 10; // Left side of the frame
                
                // Talking detection
                std::string talk_text = detailed_vitals.talking ? "Talking: YES" : "Talking: NO";
                cv::putText(frame, talk_text, cv::Point(x_position, y_offset), 
                           cv::FONT_HERSHEY_SIMPLEX, 0.6, cv::Scalar(255, 255, 0), 2);
                y_offset += line_height;
                
                // Landmark count and visualization (all 478 MediaPipe points)
                std::string landmarks_text = "Landmarks: " + std::to_string(all_landmarks.size());
                cv::putText(frame, landmarks_text, cv::Point(x_position, y_offset), 
                           cv::FONT_HERSHEY_SIMPLEX, 0.6, cv::Scalar(255, 255, 0), 2);
                
                // Draw all 478 facial landmarks on HUD - coordinates are already in pixels!
                if (!all_landmarks.empty()) {
                    for (const auto& landmark : all_landmarks) {
                        int x = static_cast<int>(landmark.x);
                        int y = static_cast<int>(landmark.y);
                        if (x >= 0 && x < frame.cols && y >= 0 && y < frame.rows) {
                            cv::circle(frame, cv::Point(x, y), 2, cv::Scalar(0, 255, 255), -1);
                        }
                    }
                }
                
                cv::imshow("SmartSpectra Hello Vitals", frame);

                char key = cv::waitKey(1) & 0xFF;
                if (key == 'q' || key == 27) {
                    return absl::CancelledError("User quit");
                }
                return absl::OkStatus();
            }
        );
        if (!status.ok()) {
            std::cerr << "Failed to set video callback: " << status.message() << "\n";
            return 1;
        }

        status = container->SetOnStatusChange(
            [](presage::physiology::StatusValue imaging_status) {
                std::cout << "Imaging/processing status: " << presage::physiology::GetStatusDescription(imaging_status.value()) << "\n";
                return absl::OkStatus();
            }
        );
        if (!status.ok()) {
            std::cerr << "Failed to set status callback: " << status.message() << "\n";
            return 1;
        }

        std::cout << "Initializing container...\n";
        if (auto init_status = container->Initialize(); !init_status.ok()) {
            std::cerr << "Failed to initialize container: " << init_status.message() << "\n";
            return 1;
        }

        std::cout << "Ready! Press 'q' to quit.\n";
        if (auto status = container->Run(); !status.ok()) {
            std::cerr << "Processing failed: " << status.message() << "\n";
            return 1;
        }

        cv::destroyAllWindows();
        std::cout << "Done!\n";
        return 0;

    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << "\n";
        return 1;
    }
}
