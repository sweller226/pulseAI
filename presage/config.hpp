#ifndef CONFIG_HPP
#define CONFIG_HPP

#include <string>

class Config {
public:
    static std::string loadApiKey();
    
    // Flask backend config
    static constexpr const char* FLASK_HOST = "172.26.64.1";
    static constexpr int FLASK_PORT = 5555;
    
    // Video stream config
    static constexpr const char* VIDEO_STREAM_URL = "tcp://0.0.0.0:8081?listen=1";
    static constexpr int VIDEO_WIDTH = 1280;
    static constexpr int VIDEO_HEIGHT = 720;
    
    // WSL IP for instructions
    static constexpr const char* WSL_IP = "172.26.68.19";
};

#endif // CONFIG_HPP
