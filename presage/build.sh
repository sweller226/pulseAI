#!/bin/bash
# Build script for hello_vitals

echo -e "\033[0;32mBuilding hello_vitals...\033[0m"

# Clean build directory if it exists
if [ -d "build" ]; then
    rm -rf build
    echo -e "\033[0;33mCleaned old build directory\033[0m"
fi

# Configure CMake
cmake -B build
if [ $? -ne 0 ]; then
    echo -e "\033[0;31mCMake configuration failed!\033[0m"
    exit 1
fi

# Build the project
cmake --build build
if [ $? -ne 0 ]; then
    echo -e "\033[0;31mBuild failed!\033[0m"
    exit 1
fi

echo -e "\033[0;32mBuild successful! Executable: build/hello_vitals\033[0m"

# Copy the curl library to the build directory if needed
if [ -f "lib/curl-8.17.0_2-win64-mingw/bin/libcurl-x64.dll" ]; then
    cp "lib/curl-8.17.0_2-win64-mingw/bin/libcurl-x64.dll" "build/" 2>/dev/null
    echo -e "\033[0;36mCopied libcurl-x64.dll to build directory\033[0m"
fi
