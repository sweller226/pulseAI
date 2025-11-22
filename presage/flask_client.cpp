#include "flask_client.hpp"
#include "vendor/nlohmann/json.hpp"
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <iostream>

using json = nlohmann::json;

FlaskClient::FlaskClient(const std::string& host, int port) 
    : host_(host), port_(port), socket_fd_(-1) {
}

FlaskClient::~FlaskClient() {
    disconnect();
}

bool FlaskClient::connect() {
    socket_fd_ = socket(AF_INET, SOCK_STREAM, 0);
    if (socket_fd_ < 0) {
        std::cerr << "Failed to create socket\n";
        return false;
    }
    
    struct sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(port_);
    inet_pton(AF_INET, host_.c_str(), &server_addr.sin_addr);
    
    if (::connect(socket_fd_, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        std::cerr << "Failed to connect to Flask backend at " << host_ << ":" << port_ << "\n";
        close(socket_fd_);
        socket_fd_ = -1;
        return false;
    }
    
    std::cout << "Connected to Flask backend at " << host_ << ":" << port_ << "!\n";
    return true;
}

void FlaskClient::disconnect() {
    if (socket_fd_ >= 0) {
        close(socket_fd_);
        socket_fd_ = -1;
    }
}

bool FlaskClient::isConnected() const {
    return socket_fd_ >= 0;
}

bool FlaskClient::sendVitals(int pulse, int breathing, int64_t timestamp) {
    if (!isConnected()) {
        std::cerr << "Not connected to Flask, skipping send\n";
        return false;
    }
    
    json vitals = {
        {"pulse", pulse},
        {"breathing", breathing},
        {"timestamp", timestamp}
    };
    
    std::string message = vitals.dump() + "\n";
    std::cout << "Sending to Flask: " << message;
    
    ssize_t sent = send(socket_fd_, message.c_str(), message.length(), 0);
    
    if (sent < 0) {
        std::cerr << "Failed to send vitals to Flask\n";
        return false;
    }
    
    return true;
}

bool FlaskClient::sendDetailedVitals(const DetailedVitals& vitals) {
    if (!isConnected()) {
        std::cerr << "Not connected to Flask, skipping send\n";
        return false;
    }
    
    json data = {
        {"pulse_rate", vitals.pulse_rate},
        {"pulse_confidence", vitals.pulse_confidence},
        {"breathing_rate", vitals.breathing_rate},
        {"breathing_confidence", vitals.breathing_confidence},
        {"talking", vitals.talking},
        {"timestamp", vitals.timestamp}
    };
    
    std::string message = data.dump() + "\n";
    std::cout << "Sending detailed vitals to Flask\n";
    
    ssize_t sent = send(socket_fd_, message.c_str(), message.length(), 0);
    
    if (sent < 0) {
        std::cerr << "Failed to send detailed vitals to Flask\n";
        return false;
    }
    
    return true;
}

