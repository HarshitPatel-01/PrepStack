#!/bin/bash
# PrepStack Docker Sandbox Setup Script
# Run this once after installing Docker Desktop

echo "===== PrepStack Docker Sandbox Setup ====="
echo ""

# Step 1: Check Docker is running
echo "[1/3] Checking Docker..."
docker info > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "ERROR: Docker is not running. Please start Docker Desktop first."
  exit 1
fi
echo "      Docker is running ✓"
echo ""

# Step 2: Build the Docker image
echo "[2/3] Building prepstack-runner image..."
docker build -t prepstack-runner -f docker/Dockerfile.cpp .
if [ $? -ne 0 ]; then
  echo "ERROR: Docker build failed."
  exit 1
fi
echo "      Image built successfully ✓"
echo ""

# Step 3: Test the image
echo "[3/3] Testing sandbox with Hello World..."
echo '#include<iostream>
using namespace std;
int main(){ cout << "Sandbox OK" << endl; return 0; }' > /tmp/test_hello.cpp

docker run --rm \
  --memory=128m \
  --cpus=0.5 \
  --network=none \
  --pids-limit=64 \
  -v /tmp:/sandbox \
  prepstack-runner \
  sh -c "g++ /sandbox/test_hello.cpp -o /sandbox/test_hello && /sandbox/test_hello"

rm -f /tmp/test_hello.cpp /tmp/test_hello

echo ""
echo "===== Setup Complete! ====="
echo "Your PrepStack Docker sandbox is ready."
echo "The server will now automatically use Docker for secure code execution."
