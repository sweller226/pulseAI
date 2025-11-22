#ifndef LANDMARK_CONVERTER_HPP
#define LANDMARK_CONVERTER_HPP

#include <vector>
#include "flask_client.hpp"

// Convert 478 MediaPipe landmarks to 68 iBUG format for PyFaceAU
class LandmarkConverter {
public:
    // MediaPipe FaceMesh to iBUG 68-point mapping
    // Based on MediaPipe FaceMesh topology: https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png
    static std::vector<Point2D> convertTo68Points(const std::vector<Point2D>& mediapipe_landmarks) {
        if (mediapipe_landmarks.size() < 478) {
            return {}; // Invalid input
        }
        
        std::vector<Point2D> ibug_68;
        ibug_68.reserve(68);
        
        // Jawline (17 points: indices 0-16)
        // MediaPipe face contour indices
        static const int jawline_indices[] = {
            152, 234, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150
        };
        for (int idx : jawline_indices) {
            ibug_68.push_back(mediapipe_landmarks[idx]);
        }
        
        // Right eyebrow (5 points: indices 17-21)
        static const int right_eyebrow_indices[] = {46, 53, 52, 65, 55};
        for (int idx : right_eyebrow_indices) {
            ibug_68.push_back(mediapipe_landmarks[idx]);
        }
        
        // Left eyebrow (5 points: indices 22-26)
        static const int left_eyebrow_indices[] = {285, 295, 282, 283, 276};
        for (int idx : left_eyebrow_indices) {
            ibug_68.push_back(mediapipe_landmarks[idx]);
        }
        
        // Nose bridge (4 points: indices 27-30)
        static const int nose_bridge_indices[] = {168, 6, 197, 195};
        for (int idx : nose_bridge_indices) {
            ibug_68.push_back(mediapipe_landmarks[idx]);
        }
        
        // Nose base (5 points: indices 31-35)
        static const int nose_base_indices[] = {5, 4, 1, 2, 164};
        for (int idx : nose_base_indices) {
            ibug_68.push_back(mediapipe_landmarks[idx]);
        }
        
        // Right eye (6 points: indices 36-41)
        static const int right_eye_indices[] = {33, 160, 158, 133, 153, 144};
        for (int idx : right_eye_indices) {
            ibug_68.push_back(mediapipe_landmarks[idx]);
        }
        
        // Left eye (6 points: indices 42-47)
        static const int left_eye_indices[] = {362, 385, 387, 263, 373, 380};
        for (int idx : left_eye_indices) {
            ibug_68.push_back(mediapipe_landmarks[idx]);
        }
        
        // Outer mouth (12 points: indices 48-59)
        static const int outer_mouth_indices[] = {61, 40, 37, 0, 267, 270, 291, 321, 314, 17, 84, 91};
        for (int idx : outer_mouth_indices) {
            ibug_68.push_back(mediapipe_landmarks[idx]);
        }
        
        // Inner mouth (8 points: indices 60-67)
        static const int inner_mouth_indices[] = {78, 81, 13, 311, 308, 324, 318, 88};
        for (int idx : inner_mouth_indices) {
            ibug_68.push_back(mediapipe_landmarks[idx]);
        }
        
        return ibug_68;
    }
};

#endif // LANDMARK_CONVERTER_HPP
