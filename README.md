# ECONEURA - Plataforma Enterprise de Gobernanza de Automatizaciones

## 🎯 Descripción
ECONEURA es una plataforma enterprise que gestiona 40-200 agentes Make/n8n/Zapier/Power Automate dispersos mediante 10 NEURAs especializados.

## 🚀 Quick Start

### Desarrollo Local
`ash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run dev
`

### Docker
`ash
# Producción
docker-compose up

# Desarrollo
docker-compose -f docker-compose.dev.yml up
`

## 📁 Estructura
- ackend/ - Backend Node.js
- rontend/ - Frontend React
- docs/ - Documentación
- config/ - Configuración
- 	ests/ - Testing
- scripts/ - Scripts de automatización

## 🔧 Scripts
- scripts/build/build.ps1 - Build del proyecto
- scripts/deploy/deploy.ps1 - Deploy a Azure
- scripts/test/test.ps1 - Ejecutar tests

## 🌐 URLs
- **Backend Local**: http://localhost:8080
- **Frontend Local**: http://localhost:5173
- **Backend Azure**: https://econeura-backend-v2.azurewebsites.net
- **Frontend Azure**: https://delightful-sand-04fd53203.3.azurestaticapps.net
