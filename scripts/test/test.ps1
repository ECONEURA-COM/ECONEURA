# Test Script
Write-Host "Testing ECONEURA..." -ForegroundColor Green

# Test Backend
Write-Host "Testing Backend..." -ForegroundColor Yellow
cd backend
npm test
cd ..

# Test Frontend
Write-Host "Testing Frontend..." -ForegroundColor Yellow
cd frontend
npm test
cd ..

Write-Host "Tests completed!" -ForegroundColor Green
