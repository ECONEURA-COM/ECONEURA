# INVESTIGACIÓN EXHAUSTIVA - 503 ERROR AZURE BACKEND

**Fecha**: 2025-10-24T14:50:00Z
**Problema**: Backend Azure retorna 503 persistente
**Backend local**: ✅ Funciona perfectamente (200 OK)

---

## 🔍 POSIBLES CAUSAS DEL 503

### CAUSA 1: Módulos faltantes en deployment
**Descripción**: `server.js` requiere módulos que no están desplegados en Azure

**Módulos requeridos por server.js:**
1. `./api/health` - ✅ Existe en local
2. `./api/auth/login` - ✅ Existe en local
3. `./api/chats` - ✅ Existe en local
4. `./api/webhooks` - ✅ Existe en local
5. `./api/finops` - ✅ Existe en local
6. `./api/agents` - ✅ Existe en local
7. `./api/proposals` - ✅ Existe en local
8. `./auth-simple` - ✅ Existe en local
9. `./middleware/rateLimiter` - ✅ Creado recientemente
10. `./db` - ✅ Existe en local
11. `./services/cache.service` - ✅ Existe en local
12. `./prompts/neura-*` (10 archivos) - ✅ Existen en local

**Probabilidad**: 🟡 Media
**Verificación**: Revisar logs de deployment en Azure
**Solución**: Asegurar que todos los archivos se despliegan correctamente

---

### CAUSA 2: Deployment no se ejecutó correctamente
**Descripción**: GitHub Actions ejecutó pero no desplegó código a Azure

**Síntomas**:
- Workflows muestran ✅ verde en GitHub
- Pero código en Azure es versión antigua
- Logs de Azure muestran deployment fallido

**Probabilidad**: 🔴 Alta
**Verificación**: Ver logs de Kudu en Azure
**Solución**: Forzar redeploy con `az webapp deployment source sync`

---

### CAUSA 3: App Service corrupto
**Descripción**: App Service tiene deployment corrupto irreparable

**Síntomas**:
- Múltiples intentos de deployment fallan
- Logs muestran errores de rsync o file system
- Reiniciar no resuelve el problema

**Probabilidad**: 🔴 Alta (basado en logs anteriores)
**Verificación**: Ver logs de deployment
**Solución**: Recrear App Service limpio

---

### CAUSA 4: Variables de entorno no cargadas
**Descripción**: Azure no carga variables de entorno correctamente

**Variables requeridas**:
- `OPENAI_API_KEY` - ✅ Configurada en Azure
- `DATABASE_URL` - ✅ Configurada en Azure
- `REDIS_URL` - ✅ Configurada en Azure
- `JWT_SECRET` - ✅ Configurada en Azure
- `NODE_ENV` - ✅ Configurada en Azure
- `PORT` - ✅ Configurada en Azure (8080)

**Probabilidad**: 🟢 Baja (ya verificamos que están configuradas)
**Verificación**: `az webapp config appsettings list`
**Solución**: Ya verificado - variables OK

---

### CAUSA 5: Puerto incorrecto
**Descripción**: Azure espera puerto 8080 pero app usa otro

**Verificación en server.js:**
```javascript
const PORT = process.env.PORT || 8080; // Azure usa 8080 por defecto
```

**Probabilidad**: 🟢 Baja (código correcto)
**Verificación**: Logs de Azure
**Solución**: Puerto correcto en código

---

### CAUSA 6: node_modules no desplegados
**Descripción**: Azure no instaló dependencias correctamente

**Dependencias críticas**:
- express
- cors
- helmet
- compression
- express-rate-limit
- openai
- pg
- redis
- dotenv

**Probabilidad**: 🟡 Media
**Verificación**: Ver logs de npm install en Azure
**Solución**: Verificar package.json y forzar npm install en deployment

---

### CAUSA 7: Timeout en startup
**Descripción**: App tarda demasiado en iniciar y Azure marca como fallida

**Elementos que pueden causar timeout**:
- Conexión a PostgreSQL (si falla)
- Conexión a Redis (si falla)
- Carga de prompts (10 archivos)
- Inicialización de OpenAI

**Probabilidad**: 🟡 Media
**Verificación**: Logs de startup en Azure
**Solución**: Verificar que DB y Redis están accesibles

---

### CAUSA 8: Errores de sintaxis en archivos desplegados
**Descripción**: Archivos se corrompieron en deployment (encoding, line endings)

**Síntomas**:
- SyntaxError en logs de Azure
- Archivos con caracteres especiales mal codificados
- BOM (Byte Order Mark) en archivos

**Probabilidad**: 🟡 Media (tuvimos problemas de encoding antes)
**Verificación**: Ver logs de Node.js en Azure
**Solución**: Verificar encoding de archivos críticos

---

### CAUSA 9: Workflow despliega directorio incorrecto
**Descripción**: Workflow despliega raíz en lugar de `backend/`

**Verificación en workflow:**
```yaml
- name: npm install, build, and test
  run: |
    cd backend
    npm install
```

**Probabilidad**: 🟢 Baja (workflow correcto)
**Verificación**: Ver estructura de deployment en Azure
**Solución**: Workflow ya está correcto

---

### CAUSA 10: Azure App Service requiere recreación
**Descripción**: Múltiples deployments fallidos corrompieron el App Service

**Síntomas conocidos**:
- 503 persistente después de múltiples intentos
- Logs históricos muestran errores de rsync
- Reiniciar no resuelve

**Probabilidad**: 🔴 MUY ALTA (basado en historial)
**Verificación**: Verificar logs históricos
**Solución**: Eliminar y recrear App Service limpio

---

## 📊 DIAGNÓSTICO COMPLETADO - CAUSA RAÍZ CONFIRMADA

### ✅ CAUSA RAÍZ IDENTIFICADA:
```
Error: Cannot find module './middleware/rateLimiter'
Require stack: ['/home/site/wwwroot/server.js']
```

**PROBLEMA CONFIRMADO**: El directorio `middleware/` NO se está desplegando en Azure

**EVIDENCIA**:
1. ✅ Local funciona: `backend/middleware/rateLimiter.js` existe y funciona
2. ✅ GitHub tiene el archivo: Subido en commits anteriores
3. ❌ Azure NO tiene el directorio: Logs muestran MODULE_NOT_FOUND
4. ❌ Deployment corrupto: Errores de rsync con rutas Windows (`routes\invoke.js`)

**CAUSA SECUNDARIA**:
```
rsync: [generator] recv_generator: failed to stat "/home/site/wwwroot/routes\invoke.js": Invalid argument (22)
```
Rutas con backslash `\` en Linux causan errores de deployment

---

## 📊 DIAGNÓSTICO PRIORIZADO

### ✅ PRIORIDAD 1 COMPLETADA: Logs de Azure analizados
**Resultado**: Causa raíz identificada - MODULE_NOT_FOUND en middleware/rateLimiter
**Tiempo**: 2 minutos
**Riesgo**: 🟢 Ninguno

### PRIORIDAD 2: Forzar redeploy (no destructivo)
```powershell
az webapp deployment source sync --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic
az webapp restart --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic
Start-Sleep -Seconds 60
Invoke-WebRequest -Uri "https://econeura-backend-v2.azurewebsites.net/api/health" -UseBasicParsing
```
**Tiempo**: 3 minutos
**Riesgo**: 🟢 Ninguno

### PRIORIDAD 3: Ver configuración de deployment source (no destructivo)
```powershell
az webapp deployment source show --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic
```
**Tiempo**: 1 minuto
**Riesgo**: 🟢 Ninguno

### PRIORIDAD 4: Recrear App Service (DESTRUCTIVO - ÚLTIMO RECURSO)
```powershell
# SOLO SI TODO LO ANTERIOR FALLA
az webapp delete --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic
az webapp create --resource-group appsvc_linux_northeurope_basic --plan econeura-plan --name econeura-backend-v2 --runtime "NODE:20-lts"
# Reconfigurar variables y deployment source
```
**Tiempo**: 15 minutos
**Riesgo**: 🔴 Alto - requiere reconfiguración completa

---

## 🎯 PLAN DE ACCIÓN RECOMENDADO

### PASO 1: Diagnóstico no destructivo (5 minutos)
1. Ver logs de Azure
2. Forzar redeploy
3. Verificar deployment source
4. Testear backend

### PASO 2: Si falla, investigar deployment (10 minutos)
1. Ver GitHub Actions logs completos
2. Verificar que archivos se subieron
3. Verificar que build completó
4. Verificar que deploy ejecutó

### PASO 3: Si falla, considerar recrear App Service (15 minutos)
1. Backup de configuración actual
2. Eliminar App Service
3. Crear nuevo limpio
4. Configurar variables
5. Conectar GitHub
6. Testear

---

## 📝 PRÓXIMA ACCIÓN RECOMENDADA

**EJECUTAR PRIORIDAD 1**: Ver logs de Azure para identificar causa exacta

```powershell
az webapp log tail --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic
```

**Este comando es NO DESTRUCTIVO y nos dará la causa raíz real del 503.**

---

**Conclusión**: NO cambiar estrategia destructivamente. Primero diagnosticar exhaustivamente con comandos no destructivos.

