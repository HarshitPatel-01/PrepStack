# PrepStack Docker Sandbox Setup
# Run this in PowerShell after installing Docker Desktop

Write-Host "===== PrepStack Docker Sandbox Setup =====" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Docker is running
Write-Host "[1/3] Checking Docker..." -ForegroundColor Yellow
$dockerCheck = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}
Write-Host "      Docker is running " -ForegroundColor Green -NoNewline
Write-Host "OK" -ForegroundColor Green
Write-Host ""

# Step 2: Build the Docker image
Write-Host "[2/3] Building prepstack-runner image..." -ForegroundColor Yellow
docker build -t prepstack-runner -f docker\Dockerfile.cpp .
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker image build failed." -ForegroundColor Red
    exit 1
}
Write-Host "      Image built successfully OK" -ForegroundColor Green
Write-Host ""

# Step 3: Quick sanity test
Write-Host "[3/3] Testing sandbox..." -ForegroundColor Yellow
$testCode = '#include<iostream>' + [Environment]::NewLine + 'using namespace std;' + [Environment]::NewLine + 'int main(){ cout << "Sandbox OK" << endl; return 0; }'
$testCode | Out-File -FilePath "$env:TEMP\test_sandbox.cpp" -Encoding ASCII

$result = docker run --rm `
    --memory=128m `
    --cpus=0.5 `
    --network=none `
    --pids-limit=64 `
    -v "${env:TEMP}:/sandbox" `
    prepstack-runner `
    sh -c "g++ /sandbox/test_sandbox.cpp -o /sandbox/test_sandbox_out && /sandbox/test_sandbox_out"

if ($result -eq "Sandbox OK") {
    Write-Host "      Sandbox test passed OK" -ForegroundColor Green
} else {
    Write-Host "      WARNING: Test result: $result" -ForegroundColor Yellow
}

Remove-Item "$env:TEMP\test_sandbox.cpp" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "===== Setup Complete! =====" -ForegroundColor Cyan
Write-Host "Your PrepStack Docker sandbox is ready." -ForegroundColor White
Write-Host "The server will now automatically use Docker for secure code execution." -ForegroundColor White
