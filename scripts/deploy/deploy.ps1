# Deploy Script
Write-Host "Deploying ECONEURA..." -ForegroundColor Green

# Deploy to Azure
Write-Host "Deploying to Azure..." -ForegroundColor Yellow
az webapp deployment source config --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic --repo-url https://github.com/ECONEURA-COM/ECONEURA.git --branch main --manual-integration

Write-Host "Deploy completed!" -ForegroundColor Green
