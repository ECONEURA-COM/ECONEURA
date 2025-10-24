# Changelog

Todos los cambios notables en ECONEURA serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-10-22

### 🚀 Added

#### Backend
- **Azure Key Vault Integration** con Managed Identity para gestión segura de secretos
- **Async Server Startup** con `initializeSecrets()` y `getSecret()`
- **Fallback a Environment Variables** si Key Vault no disponible (desarrollo local)
- **Winston Logger** con logs estructurados en JSON
- **Health Endpoint Mejorado** (`/api/health`) con métricas de sistema
- **Vitest Testing Framework** con 20+ tests unitarios y 70% coverage
- **CORS actualizado** con soporte para `econeura.com` y `www.econeura.com`
- **Helmet Security** middleware para protección contra ataques comunes
- **Express Rate Limiting** (preparado, configuración pendiente)

#### Frontend
- **Production Hostname Detection** explícito para `econeura.com` y `www.econeura.com` en `useChat.ts`
- **Environment Variable Support** para `VITE_API_URL` override

#### Infraestructura
- **Node.js 20 LTS** en Azure App Service (upgrade desde v18.17.1)
- **Kudu SSH Deployment Method** documentado como método confiable
- **Deployment Center** configurado con GitHub ECONEURAmax repo

#### Documentación
- **README.md Backend** profesional con badges, troubleshooting y API docs
- **ADR 001:** Migración a Azure Cloud
- **ADR 002:** Azure Key Vault para Gestión de Secretos
- **ADR 003:** Upgrade a Node.js 20 LTS
- **PLAN_AUTOMATIZADO_100.md** con roadmap detallado al 100%

#### Seguridad
- **Pre-commit Hooks** con Gitleaks para detectar secretos
- **.gitignore Expandido** con 20+ patrones para secrets y logs
- **SANITIZAR_TODO.ps1** script para redactar secretos en archivos
- **11 Archivos Sanitizados** (DEPLOYMENT_SUCCESS.md y otros)
- **3 Archivos Eliminados** con secrets expuestos

### 🔧 Changed
- **Backend Entry Point** (`server.js`) refactorizado para startup asíncrono
- **Package.json Backend** actualizado con `engines: node >= 20.0.0`
- **CORS Origin List** actualizado con dominio custom econeura.com
- **Health Check Response** ahora incluye versión Node.js, uptime, memory

### 🐛 Fixed
- **503 Service Unavailable** en econeura.com (causado por Node.js v18 + incompatibilidad deps)
- **CORS Policy Errors** desde econeura.com hacia backend Azure
- **MODULE_NOT_FOUND** para `async/forEach` y otros (npm install con Node 20)
- **EBADENGINE Warnings** en npm install (15+ warnings eliminadas)
- **Frontend API URL Detection** fallando en custom domain (hard-coded detección agregada)
- **Chat Connection Error** port 3002 localhost (frontend no detectaba producción)

### 🗑️ Removed
- **Old Backup Files** (.OLD.ps1, _BACKUP_*, _TEMP_*)
- **Obsolete Scripts** duplicados y sin uso
- **Secrets Expuestos** en archivos MD (sanitizados o eliminados)

### 🔒 Security
- **0 Secretos en Git** confirmado por Gitleaks audit
- **Managed Identity** elimina necesidad de credenciales en código
- **Key Vault** como fuente única de verdad para secretos
- **Pre-commit Hooks** bloquean commits con secrets

---

## [1.0.0] - 2025-10-15

### 🚀 Added

#### Backend
- Express.js server con soporte para 60 agentes especializados
- OpenAI API integration (gpt-4o, claude-sonnet-4.5)
- PostgreSQL integration con Drizzle ORM
- CORS configurado para Azure Static Web Apps
- Environment variables con dotenv
- Basic error handling middleware
- Chat endpoint `/api/invoke/:assistantId`
- Health check endpoint `/api/health`

#### Frontend
- React 18 + Vite 5 + TypeScript
- Chat interface con streaming support
- 10 NEURAs especializados (CEO, Marketing, Finance, Legal, etc.)
- Zustand state management
- Tailwind CSS styling
- Dark mode support
- Responsive design

#### Infraestructura
- Azure Static Web Apps deployment (frontend)
- Azure App Service Linux (backend)
- GitHub Actions CI/CD
- Cloudflare DNS management

### 🐛 Fixed
- Initial deployment issues
- CORS configuration
- Environment variables setup

---

## [0.1.0] - 2025-10-01

### 🚀 Added
- Initial project setup
- Monorepo structure con PNPM
- Basic frontend scaffold
- Basic backend scaffold
- ESLint + Prettier config
- TypeScript configuration

---

## Formato de Versiones

- **Major (X.0.0):** Breaking changes, arquitectura significativa
- **Minor (0.X.0):** Nuevas features, backwards compatible
- **Patch (0.0.X):** Bug fixes, mejoras menores

---

## Tipos de Cambios

- `Added` - Nuevas features
- `Changed` - Cambios en funcionalidad existente
- `Deprecated` - Features que serán removidas
- `Removed` - Features removidas
- `Fixed` - Bug fixes
- `Security` - Vulnerabilidades y fixes de seguridad

---

**Próxima versión:** 2.1.0 (estimada Noviembre 2025)  
**Roadmap:** Tests E2E, OpenTelemetry, Rate Limiting avanzado, Database migrations
