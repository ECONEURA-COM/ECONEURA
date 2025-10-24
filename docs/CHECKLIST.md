# CHECKLIST DE VERIFICACIÓN ECONEURA

## ✅ ANTES DE git push

### Backend
- [ ] Backend funciona localmente: `cd backend && npm start`
- [ ] Health endpoint responde: `http://localhost:8080/api/health`
- [ ] Auth endpoint genera token: `http://localhost:8080/api/auth/login`
- [ ] NEURA responde correctamente: `http://localhost:8080/api/invoke/a-ceo-01`
- [ ] No hay errores en console
- [ ] No hay warnings críticos

### Frontend
- [ ] Frontend funciona localmente: `cd frontend && npm run dev`
- [ ] UI carga sin errores: `http://localhost:5173`
- [ ] Login funciona con demo@econeura.com
- [ ] Chat con NEURAs funciona
- [ ] Build funciona: `npm run build`
- [ ] No hay errores TypeScript

### Seguridad
- [ ] `.env` está en `.gitignore`
- [ ] No hay API keys en código
- [ ] No hay passwords en código
- [ ] No hay secrets en archivos
- [ ] `.gitignore` está actualizado
- [ ] Ejecutar: `git status` y verificar que no hay archivos sensibles

### Calidad
- [ ] No hay `console.log` de debugging
- [ ] Commit message es descriptivo: `feat|fix|docs: descripción`
- [ ] Tests pasan: `npm test` (si aplica)
- [ ] Linter pasa: `npm run lint` (si aplica)
- [ ] No hay archivos temporales sin usar

---

## ✅ ANTES DE deployment Azure

### Workflows
- [ ] Workflows están en `.github/workflows/`
- [ ] Workflows usan `actions@v4` (no v3)
- [ ] Workflows tienen cache para `node_modules`
- [ ] Node version especificada: `20.x`
- [ ] Paths correctos: `backend/**` y `frontend/**`
- [ ] Triggers correctos: `on: push: branches: [main]`

### Secrets GitHub
- [ ] `AZUREAPPSERVICE_CLIENTID_*` configurado
- [ ] `AZUREAPPSERVICE_TENANTID_*` configurado
- [ ] `AZUREAPPSERVICE_SUBSCRIPTIONID_*` configurado
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` configurado
- [ ] `OPENAI_API_KEY` configurado
- [ ] Verificar en: Settings > Secrets and variables > Actions

### Variables Azure
- [ ] `OPENAI_API_KEY` en App Service
- [ ] `DATABASE_URL` en App Service
- [ ] `REDIS_URL` en App Service
- [ ] `JWT_SECRET` en App Service
- [ ] `NODE_ENV=production` en App Service
- [ ] Verificar: `az webapp config appsettings list --name econeura-backend-v2`

### Configuración Azure
- [ ] App Service creado: `econeura-backend-v2`
- [ ] Static Web App creado: `econeura-web` o `delightful-sand-*`
- [ ] PostgreSQL creado: `econeura-db-5944`
- [ ] Redis creado: `econeura-redis-4492`
- [ ] Firewall PostgreSQL permite Azure Services
- [ ] GitHub conectado a Azure: `az webapp deployment source show`

---

## ✅ DESPUÉS DE deployment

### Workflows GitHub Actions
- [ ] Workflows ejecutados sin errores
- [ ] Build job completado: ✅ verde
- [ ] Deploy job completado: ✅ verde
- [ ] No hay errores en logs de Actions
- [ ] Verificar: https://github.com/ECONEURA-COM/ECONEURA/actions

### Backend Azure
- [ ] Backend responde: `https://econeura-backend-v2.azurewebsites.net/api/health`
- [ ] Status code: 200 OK (no 503, no 500)
- [ ] Health check retorna JSON válido
- [ ] Auth funciona: `/api/auth/login`
- [ ] NEURAs responden: `/api/invoke/a-ceo-01`
- [ ] No hay errores en logs Azure
- [ ] Variables de entorno cargadas correctamente

### Frontend Azure
- [ ] Frontend carga: `https://delightful-sand-04fd53203.3.azurestaticapps.net`
- [ ] Status code: 200 OK
- [ ] UI renderiza correctamente
- [ ] Login funciona con demo@econeura.com
- [ ] Chat con NEURAs funciona
- [ ] No hay errores en console del navegador

### Integración completa
- [ ] Frontend se conecta a backend Azure (no localhost)
- [ ] Login genera token válido
- [ ] Chat envía mensajes al backend
- [ ] NEURAs responden desde backend Azure
- [ ] No hay errores CORS
- [ ] Latencia aceptable (<3 segundos)

---

## ✅ ANTES DE decir "ECONEURA funciona 100%"

### Tests funcionales obligatorios
- [ ] **Test 1**: Health check backend Azure → 200 OK
- [ ] **Test 2**: Auth login backend Azure → token generado
- [ ] **Test 3**: NEURA CEO Azure → respuesta de OpenAI
- [ ] **Test 4**: Frontend Azure carga → UI visible
- [ ] **Test 5**: Login desde frontend Azure → token recibido
- [ ] **Test 6**: Chat desde frontend Azure → NEURA responde
- [ ] **Test 7**: Webhooks funcionan → respuesta OK
- [ ] **Test 8**: Agent Registry funciona → CRUD OK
- [ ] **Test 9**: Proposals funcionan → HITL OK
- [ ] **Test 10**: Audit trail funciona → logs OK

### Evidencia verificable
- [ ] Tengo outputs de todos los tests
- [ ] Tengo screenshots de UI funcionando
- [ ] Tengo logs de backend sin errores
- [ ] Actualicé `MEMORIA_SESION.json` con evidencia
- [ ] Puedo reproducir todos los tests
- [ ] Usuario puede reproducir todos los tests

### Documentación actualizada
- [ ] README.md refleja estado real
- [ ] MEMORIA_SESION.json actualizada
- [ ] URLs en README son correctas
- [ ] Instrucciones de deployment son correctas
- [ ] Changelog actualizado con versión actual

---

## 🚨 RED FLAGS (DETENER Y PEDIR AYUDA)

**Si veo estas señales, debo detenerme y pedir ayuda:**

- 🚨 El mismo comando falla 3+ veces
- 🚨 Llevo >30 minutos sin progreso medible
- 🚨 Estoy rompiendo código que funcionaba
- 🚨 No entiendo la causa raíz de un error
- 🚨 Los logs muestran errores que no comprendo
- 🚨 Estoy creando más problemas que resolviendo
- 🚨 El usuario está perdiendo tiempo por mi ineficiencia
- 🚨 Necesito credenciales que no tengo
- 🚨 La solución requiere decisión de negocio
- 🚨 Estoy improvisando sin plan claro

---

## 📊 MÉTRICAS DE ÉXITO DE SESIÓN

**Al final de cada sesión, calcular:**

```json
{
  "score_eficiencia": {
    "tareas_completadas": X,
    "tareas_planeadas": Y,
    "ratio_completitud": "X/Y = Z%",
    "comandos_exitosos": A,
    "comandos_totales": B,
    "ratio_exito": "A/B = C%",
    "tiempo_productivo": "D%",
    "problemas_resueltos": E,
    "problemas_creados": F,
    "score_final": "(C% * 0.4) + (Z% * 0.4) + (D% * 0.2)"
  }
}
```

**Objetivo**: Score final >75%

---

**Última actualización**: 2025-10-24
**Versión**: 1.0

