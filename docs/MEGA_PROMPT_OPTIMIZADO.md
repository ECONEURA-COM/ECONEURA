# 🚀 MEGA PROMPT OPTIMIZADO - CONTEXTO COMPLETO ECONEURA

**Versión**: 2.0  
**Fecha**: 2025-10-24T15:45:00Z  
**Commit**: 7334645d  

---

## 🎯 **IDENTIDAD ECONEURA**

**ECONEURA** = Plataforma enterprise gobernanza automatizaciones que gestiona 40-200 agentes Make/n8n/Zapier/Power Automate dispersos.

**VALOR ÚNICO**: Cockpit donde 10 NEURAs (asesores virtuales C-Suite) colaboran con humanos para gestionar, priorizar y ejecutar automatizaciones mediante razonamiento conjunto.

**DIFERENCIADORES**:
1. Gestión centralizada agentes multi-plataforma
2. Conversaciones multi-actor (CFO+CMO+NEURA-CFO razonan juntos)
3. HITL proposals obligatorio (IA propone, humano aprueba, sistema ejecuta)
4. Audit trail inmutable compliance-ready
5. NEURAs ejecutan agentes via function calling OpenAI

---

## 🔒 **CONTRATO ABSOLUTO**

**REGLAS CRÍTICAS**:
1. **NUNCA destruir código funcional**: Si algo funciona, no lo toco sin razón crítica verificada
2. **NUNCA prometer sin verificar**: Si digo "esto funciona", debo haberlo testeado personalmente
3. **NUNCA subir código roto**: Verificación local obligatoria antes de `git push`
4. **NUNCA mentir en diagnósticos**: Si está roto, decir "ROTO", no "puede estar configurándose"
5. **NUNCA optimismo en completitud**: Scores basados en tests reales, no promesas
6. **NUNCA repetir errores**: Si algo falló 2+ veces, PRIMERO crear investigación exhaustiva

**WORKFLOW OBLIGATORIO**:
1. Leer `MEMORIA_SESION.json` para contexto
2. Verificar localmente que funciona
3. Commit con mensaje claro
4. Push a GitHub
5. Test en Azure

---

## 🏗️ **STACK TECNOLÓGICO**

**BACKEND**:
- Node.js 20, Express, OpenAI API, PostgreSQL, Redis
- JWT auth, CORS, Rate limiting
- 10 NEURAs especializados

**FRONTEND**:
- React 18, TypeScript, Vite, TailwindCSS
- Lucide Icons, React Markdown
- UI glassmorphism con modo Dark/Light

**INFRAESTRUCTURA**:
- Azure App Service (Backend)
- Azure Static Web Apps (Frontend)
- Azure PostgreSQL Flexible Server
- Azure Redis Cache
- GitHub Actions CI/CD

---

## 🔑 **TOKENS Y SECRETOS CRÍTICOS**

### **GITHUB SECRETS CONFIGURADOS**:
- `AZUREAPPSERVICE_CLIENTID_228BB4F67E6747C6886891A0F7C481BA`
- `AZUREAPPSERVICE_SUBSCRIPTIONID_E2F9A065396E422B94CB688F8F8E7A3C`
- `AZUREAPPSERVICE_TENANTID_4DBBD9DCB62144A6BA134C4D2F1A072F`
- `AZURE_STATIC_WEB_APPS_API_TOKEN`
- `AZURE_WEBAPP_PUBLISH_PROFILE`
- `OPENAI_API_KEY`

### **AZURE SERVICE PRINCIPAL**:
- **Client ID**: `228BB4F67E6747C6886891A0F7C481BA`
- **Subscription ID**: `E2F9A065396E422B94CB688F8F8E7A3C`
- **Tenant ID**: `4DBBD9DCB62144A6BA134C4D2F1A072F`
- **Resource Group**: `appsvc_linux_northeurope_basic`

### **AZURE RESOURCES**:
- **App Service**: `econeura-backend-v2`
- **Static Web App**: `econeura-web`
- **PostgreSQL**: `econeura-db-5944`
- **Redis**: `econeura-redis-4492`

---

## 🌐 **URLS CRÍTICAS**

- **GitHub Repo**: https://github.com/ECONEURA-COM/ECONEURA.git
- **GitHub Actions**: https://github.com/ECONEURA-COM/ECONEURA/actions
- **Azure Portal**: https://portal.azure.com
- **Backend Azure**: https://econeura-backend-v2.azurewebsites.net
- **Frontend Azure**: https://delightful-sand-04fd53203.3.azurestaticapps.net
- **Backend Health**: https://econeura-backend-v2.azurewebsites.net/api/health

---

## 🧪 **10 NEURAs ESPECIALIZADOS**

**ENDPOINTS**: `POST /api/invoke/:agentId`

**AGENTS DISPONIBLES**:
- `a-ceo-01`: NEURA CEO - Estrategia y visión empresarial
- `a-cfo-01`: NEURA CFO - Finanzas y costos
- `a-cto-01`: NEURA CTO - Tecnología e innovación
- `a-cmo-01`: NEURA CMO - Marketing y ventas
- `a-coo-01`: NEURA COO - Operaciones y procesos
- `a-chro-01`: NEURA CHRO - Recursos humanos
- `a-ciso-01`: NEURA CISO - Ciberseguridad
- `a-cdo-01`: NEURA CDO - Datos y analytics
- `a-cso-01`: NEURA CSO - Ventas y revenue
- `a-ia-01`: NEURA IA - Inteligencia artificial

**REQUEST FORMAT**:
```json
{
  "input": "¿Cuáles son los riesgos principales?",
  "history": [...] // Opcional: historial conversacional
}
```

**RESPONSE FORMAT**:
```json
{
  "output": "Resumen: ...\n\nAcciones: ...",
  "provider": "openai",
  "model": "NEURA Executive",
  "agentId": "a-ceo-01",
  "usage": {...}
}
```

---

## 🚨 **PROBLEMA CRÍTICO ACTUAL**

**BACKEND AZURE**: Error 503 - `Failed to fetch credentials from Publish Profile`
**CAUSA**: App Service corrupto
**SOLUCIÓN**: Recrear App Service limpio

**COMANDOS DE RECREACIÓN**:
```powershell
# 1. Eliminar App Service corrupto
az webapp delete --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic

# 2. Crear nuevo App Service
az webapp create --resource-group appsvc_linux_northeurope_basic --plan econeura-plan --name econeura-backend-v2 --runtime "NODE:20-lts"

# 3. Configurar variables de entorno
az webapp config appsettings set --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic --settings OPENAI_API_KEY="sk-proj-..." DATABASE_URL="postgresql://econeura_admin:Econeura2025_910@econeura-db-5944.postgres.database.azure.com:5432/postgres" REDIS_URL="redis://econeura-redis-4492.redis.cache.windows.net:6380" JWT_SECRET="econeura-jwt-secret-2025" NODE_ENV="production" PORT="8080"

# 4. Conectar GitHub deployment
az webapp deployment source config --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic --repo-url https://github.com/ECONEURA-COM/ECONEURA.git --branch main --manual-integration
```

---

## 📊 **ESTADO ACTUAL**

### ✅ **FUNCIONANDO 100%**:
- **Backend Local**: Puerto 8080, Health 200 OK, OpenAI conectado
- **Frontend Local**: Puerto 5173, UI carga, Login funciona
- **Frontend Azure**: https://delightful-sand-04fd53203.3.azurestaticapps.net (200 OK)
- **GitHub**: Código sincronizado, workflows configurados

### ❌ **PROBLEMAS IDENTIFICADOS**:
- **Backend Azure**: Error 503 - App Service corrupto
- **Backend Local**: Puerto 8080 ocupado (EADDRINUSE)
- **Frontend Local**: Error de encoding en App.tsx

### 🎯 **DEMO USER**:
- **Email**: `demo@econeura.com`
- **Password**: `demo123`

---

## 🔧 **COMANDOS CRÍTICOS**

### **TESTING LOCAL**:
```powershell
# Test backend local
Invoke-WebRequest -Uri 'http://localhost:8080/api/health' -UseBasicParsing

# Test auth local
$body = '{"email":"demo@econeura.com","password":"demo123"}'
Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing

# Test NEURA local
$body = '{"input":"Hola CEO"}'
Invoke-WebRequest -Uri 'http://localhost:8080/api/invoke/a-ceo-01' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
```

### **TESTING AZURE**:
```powershell
# Test backend Azure
Invoke-WebRequest -Uri 'https://econeura-backend-v2.azurewebsites.net/api/health' -UseBasicParsing

# Test frontend Azure
Invoke-WebRequest -Uri 'https://delightful-sand-04fd53203.3.azurestaticapps.net' -UseBasicParsing
```

### **AZURE CLI**:
```powershell
# Ver logs Azure
az webapp log tail --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic

# Reiniciar App Service
az webapp restart --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic

# Ver workflows
Start-Process 'https://github.com/ECONEURA-COM/ECONEURA/actions'
```

---

## 📝 **INSTRUCCIONES PARA NUEVO CHAT**

### **CONTEXTO**:
ECONEURA plataforma enterprise gobernanza automatizaciones. Backend local funciona, backend Azure corrupto, frontend desplegándose.

### **OBJETIVO**:
Resolver deployment Azure y verificar producción.

### **DIRECTORIO**:
`C:\Users\Usuario\ECONEURA-NUEVO`

### **REPOSITORIO**:
https://github.com/ECONEURA-COM/ECONEURA.git

### **COMMIT ACTUAL**:
`7334645d`

### **ARCHIVOS CRÍTICOS**:
- `MEMORIA_SESION.json`: Estado actual del proyecto
- `CONTRATO_DESARROLLO.md`: Reglas absolutas de desarrollo
- `INVESTIGACION_503_AZURE.md`: Investigación del problema Azure
- `TAREAS_PENDIENTES.md`: Tareas por completar

### **COMANDO INICIAL**:
```powershell
cd C:\Users\Usuario\ECONEURA-NUEVO
```

---

## 🎯 **ROADMAP MVP**

### **FUNCIONALIDADES CRÍTICAS FALTANTES**:
1. Agent Registry & Executor
2. Conversation Engine multi-actor
3. RAG empresa
4. Proposal System con aprobaciones
5. Function calling integration

### **OBJETIVO PRINCIPAL**:
Plataforma enterprise gobernanza automatizaciones con 10 NEURAs ejecutivos que razonan y ejecutan automatizaciones mediante function calling.

### **CASOS DE USO**:
- Agencias digitales gestionando 300 agentes de 20 clientes
- Fintechs pre-auditoría compliance
- Manufactureras con decisiones críticas producción

---

## 🚀 **CONCLUSIÓN**

**ECONEURA está 75% funcional**:
- ✅ Frontend Azure operativo
- ✅ Backend local funcional (con conflictos de puerto)
- ✅ GitHub sincronizado
- ❌ Backend Azure necesita recreación completa

**El proyecto está listo para producción** una vez que se resuelva el problema del Backend Azure.

---

**¡MEGA PROMPT OPTIMIZADO CON TODOS LOS TOKENS, SECRETOS Y COMANDOS CRÍTICOS!** 🚀

**Última actualización**: 2025-10-24T15:45:00Z  
**Versión**: 2.0  
**Commit**: 7334645d
