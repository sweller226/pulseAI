#ifndef FLASK_CLIENT_HPP
#define FLASK_CLIENT_HPP

#include <string>
#include <vector>

struct Point2D {
    float x;
    float y;
};

struct DetailedVitals {
    // Core metrics
    int pulse_rate;
    float pulse_confidence;
    int breathing_rate;
    float breathing_confidence;
    
    // Face data
    bool talking;
    
    int64_t timestamp;
};

class FlaskClient {
public:
    FlaskClient(const std::string& host, int port);
    ~FlaskClient();
    
    bool connect();
    void disconnect();
    bool isConnected() const;
    bool sendVitals(int pulse, int breathing, int64_t timestamp);
    bool sendDetailedVitals(const DetailedVitals& vitals);
    
private:
    std::string host_;
    int port_;
    int socket_fd_;
};

#endif // FLASK_CLIENT_HPP
