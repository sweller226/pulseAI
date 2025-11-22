#pragma once

#include <opencv2/opencv.hpp>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <iostream>
#include <vector>
#include <cstring>

class PythonVideoReceiver {
public:
    PythonVideoReceiver(int port = 8081) 
        : port_(port), server_fd_(-1), client_fd_(-1), running_(false) {}
    
    ~PythonVideoReceiver() {
        stop();
    }
    
    bool start() {
        // Create socket
        server_fd_ = socket(AF_INET, SOCK_STREAM, 0);
        if (server_fd_ < 0) {
            std::cerr << "Failed to create socket" << std::endl;
            return false;
        }
        
        // Set socket options
        int opt = 1;
        if (setsockopt(server_fd_, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0) {
            std::cerr << "Failed to set socket options" << std::endl;
            close(server_fd_);
            return false;
        }
        
        // Bind to port
        sockaddr_in address{};
        address.sin_family = AF_INET;
        address.sin_addr.s_addr = INADDR_ANY;
        address.sin_port = htons(port_);
        
        if (bind(server_fd_, (sockaddr*)&address, sizeof(address)) < 0) {
            std::cerr << "Failed to bind to port " << port_ << std::endl;
            close(server_fd_);
            return false;
        }
        
        // Listen for connections
        if (listen(server_fd_, 1) < 0) {
            std::cerr << "Failed to listen on port " << port_ << std::endl;
            close(server_fd_);
            return false;
        }
        
        std::cout << "Waiting for Python video stream on port " << port_ << "..." << std::endl;
        
        // Accept connection
        sockaddr_in client_address{};
        socklen_t client_len = sizeof(client_address);
        client_fd_ = accept(server_fd_, (sockaddr*)&client_address, &client_len);
        
        if (client_fd_ < 0) {
            std::cerr << "Failed to accept connection" << std::endl;
            close(server_fd_);
            return false;
        }
        
        std::cout << "Python video stream connected from " 
                  << inet_ntoa(client_address.sin_addr) << std::endl;
        
        running_ = true;
        return true;
    }
    
    bool receiveFrame(cv::Mat& frame) {
        if (!running_ || client_fd_ < 0) {
            return false;
        }
        
        // Read frame size (4 bytes, big-endian)
        uint32_t frame_size = 0;
        if (recv(client_fd_, &frame_size, 4, MSG_WAITALL) != 4) {
            std::cerr << "Failed to receive frame size" << std::endl;
            return false;
        }
        
        // Convert from big-endian to host byte order
        frame_size = ntohl(frame_size);
        
        if (frame_size == 0 || frame_size > 10000000) { // Sanity check: max 10MB
            std::cerr << "Invalid frame size: " << frame_size << std::endl;
            return false;
        }
        
        // Read JPEG data
        std::vector<uint8_t> jpeg_data(frame_size);
        size_t total_received = 0;
        
        while (total_received < frame_size) {
            ssize_t received = recv(client_fd_, 
                                   jpeg_data.data() + total_received, 
                                   frame_size - total_received, 
                                   0);
            if (received <= 0) {
                std::cerr << "Failed to receive frame data" << std::endl;
                return false;
            }
            total_received += received;
        }
        
        // Decode JPEG
        frame = cv::imdecode(jpeg_data, cv::IMREAD_COLOR);
        
        if (frame.empty()) {
            std::cerr << "Failed to decode JPEG frame" << std::endl;
            return false;
        }
        
        return true;
    }
    
    void stop() {
        running_ = false;
        if (client_fd_ >= 0) {
            close(client_fd_);
            client_fd_ = -1;
        }
        if (server_fd_ >= 0) {
            close(server_fd_);
            server_fd_ = -1;
        }
    }
    
    bool isRunning() const { return running_; }

private:
    int port_;
    int server_fd_;
    int client_fd_;
    bool running_;
};
