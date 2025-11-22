#include "config.hpp"
#include <fstream>
#include <string>

std::string Config::loadApiKey() {
    // Try current directory first, then parent directory
    std::ifstream file(".env");
    if (!file.is_open()) {
        file.open("../.env");
    }

    if (!file.is_open()) {
        return "";
    }

    std::string line;
    while (std::getline(file, line)) {
        if (line.find("PRESAGE_API_KEY=") == 0) {
            size_t start = line.find("\"") + 1;
            size_t end = line.rfind("\"");
            return line.substr(start, end - start);
        }
    }
    return "";
}
