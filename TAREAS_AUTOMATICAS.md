# TAREAS AUTOMÁTICAS ECONEURA

## 🔄 RITUAL DE INICIO (OBLIGATORIO - 4 MINUTOS)

### 1. LEER ARCHIVOS DE CONTEXTO (1 minuto)
```powershell
# Ejecutar al inicio de cada sesión:
Get-Content "CONTRATO_DESARROLLO.md" | Select-Object -First 50
Get-Content "MEMORIA_SESION.json"
Get-Content "TAREAS_PENDIENTES.md"
```

**Como IA debo:**
- [ ] Leer `CONTRATO_DESARROLLO.md` completo
- [ ] Leer `MEMORIA_SESION.json` completo
- [ ] Leer `TAREAS_PENDIENTES.md`
- [ ] Entender el estado actual antes de actuar

### 2. VERIFICAR ESTADO ACTUAL (2 minutos)
```powershell
# Backend local
cd C:\Users\Usuario\ECONEURA-NUEVO\backend
npm start
# Verificar que inicia sin errores

# Frontend local
cd C:\Users\Usuario\ECONEURA-NUEVO\frontend
npm run dev
# Verificar que inicia sin errores

# Git status
cd C:\Users\Usuario\ECONEURA-NUEVO
git status
```

**Como IA debo:**
- [ ] Verificar que backend local funciona
- [ ] Verificar que frontend local funciona
- [ ] Verificar que Git está sincronizado
- [ ] Verificar que no hay archivos sin commitear

### 3. CREAR PLAN DE SESIÓN (1 minuto)

**Como IA debo:**
- [ ] Identificar tarea principal de la sesión
- [ ] Identificar dependencias
- [ ] Identificar riesgos
- [ ] Estimar tiempo total
- [ ] Actualizar `TAREAS_PENDIENTES.md`

---

## 🚀 DURANTE LA SESIÓN (OPERACIÓN CONTINUA)

### CADA VEZ QUE EJECUTO UN COMANDO

**Proceso obligatorio:**
1. **Explicar**: Por qué es necesario (1 línea)
2. **Ejecutar**: El comando
3. **Verificar**: El resultado
4. **Actualizar**: `MEMORIA_SESION.json` si hay cambio de estado
5. **Documentar**: Si algo falló

**Ejemplo:**
```markdown
**Comando**: `npm start`
**Por qué**: Verificar que backend local funciona antes de subir a GitHub
**Resultado esperado**: Server started on port 8080
**Verificación**: Test health endpoint
**Si falla**: Diagnosticar logs, no repetir el mismo comando
```

### CADA VEZ QUE COMPLETO UNA TAREA

**Proceso obligatorio:**
1. **Marcar**: Como completada en `TAREAS_PENDIENTES.md`
2. **Evidenciar**: Actualizar `MEMORIA_SESION.json` con evidencia verificable
3. **Checkpoint**: `git add . && git commit -m "..."`
4. **Verificar**: Que no rompí nada (tests, health checks)

### CADA VEZ QUE ENCUENTRO UN PROBLEMA

**Proceso obligatorio:**
1. **Diagnosticar**: Usar herramientas (logs, grep, read_file) para entender causa raíz
2. **Documentar**: Agregar a `MEMORIA_SESION.json` > `problemas_conocidos`
3. **Intentar solución**: Una vez con estrategia clara
4. **Si falla 2 veces**: Cambiar de estrategia completamente o pedir ayuda al usuario
5. **Nunca**: Repetir el mismo comando fallido 3+ veces

---

## 📊 ACTUALIZACIÓN DE MEMORIA (CONTINUA)

### Después de cada acción exitosa:

**Actualizar `MEMORIA_SESION.json`:**
```json
{
  "meta": {
    "ultima_actualizacion": "TIMESTAMP_ACTUAL"
  },
  "estado_funcional": {
    "componente_afectado": {
      "status": "nuevo_estado",
      "verificado": "TIMESTAMP",
      "evidencia": "descripción_verificable"
    }
  }
}
```

### Después de cada commit:

**Actualizar commit_actual:**
```json
{
  "meta": {
    "commit_actual": "NUEVO_COMMIT_HASH"
  }
}
```

---

## 🏁 RITUAL DE CIERRE (OBLIGATORIO - 5 MINUTOS)

### 1. ACTUALIZAR MEMORIA COMPLETA (2 minutos)

```powershell
# Actualizar MEMORIA_SESION.json con todos los cambios
# Actualizar historial_sesiones con logros y problemas
# Actualizar proximas_acciones para próxima sesión
```

**Como IA debo:**
- [ ] Actualizar `estado_funcional` con estado final
- [ ] Agregar entrada a `historial_sesiones`
- [ ] Actualizar `proximas_acciones` con tareas pendientes
- [ ] Actualizar `metricas_eficiencia`

### 2. CREAR RESUMEN DE SESIÓN (1 minuto)

**Template de resumen:**
```markdown
## RESUMEN SESIÓN [NÚMERO]

**Fecha**: [FECHA]
**Duración**: [TIEMPO]

### QUÉ FUNCIONABA AL INICIO
- Backend local: [ESTADO]
- Frontend local: [ESTADO]
- Azure: [ESTADO]

### QUÉ SE HIZO
- [LOGRO 1]
- [LOGRO 2]
- [LOGRO 3]

### QUÉ FUNCIONA AHORA
- Backend local: [ESTADO]
- Frontend local: [ESTADO]
- Azure: [ESTADO]

### QUÉ QUEDÓ PENDIENTE
- [TAREA 1]
- [TAREA 2]

### PROBLEMAS ENCONTRADOS
- [PROBLEMA 1]: [SOLUCIÓN]
- [PROBLEMA 2]: [SOLUCIÓN]

### APRENDIZAJES
- [APRENDIZAJE 1]
- [APRENDIZAJE 2]
```

### 3. GUARDAR EVIDENCIAS (1 minuto)

**Como IA debo:**
- [ ] Documentar evidencias de tests exitosos
- [ ] Guardar outputs de comandos críticos
- [ ] Documentar commits con mensajes claros
- [ ] Crear lista de archivos modificados

### 4. PREPARAR PRÓXIMA SESIÓN (1 minuto)

**Como IA debo:**
- [ ] Actualizar `TAREAS_PENDIENTES.md` con prioridades
- [ ] Documentar bloqueadores conocidos
- [ ] Dejar comandos preparados para próxima sesión
- [ ] Commit final de la sesión con resumen

---

## ✅ CHECKLIST DE CALIDAD (USAR ANTES DE ACCIONES CRÍTICAS)

### ANTES DE `git push`
- [ ] Backend funciona localmente (`npm start` OK)
- [ ] Frontend funciona localmente (`npm run dev` OK)
- [ ] No hay secrets en archivos (verificar `.env` en `.gitignore`)
- [ ] No hay `console.log` de debugging
- [ ] Commit message es descriptivo
- [ ] Verificar `git status` limpio

### ANTES DE deployment Azure
- [ ] Workflows están configurados correctamente
- [ ] Secrets están en GitHub Settings
- [ ] Variables de entorno en Azure App Service
- [ ] Health endpoint responde localmente
- [ ] Build funciona sin errores (`npm run build`)
- [ ] Dependencies están en `package.json`

### ANTES DE decir "esto funciona"
- [ ] Lo testé personalmente con comandos verificables
- [ ] Tengo evidencia (output, screenshot, log)
- [ ] Funciona en ambiente target (local o Azure)
- [ ] No hay errores en console/logs
- [ ] Actualicé `MEMORIA_SESION.json` con evidencia

---

## 🎯 MÉTRICAS DE EFICIENCIA (MEDIR CADA SESIÓN)

**Actualizar en `MEMORIA_SESION.json` > `metricas_eficiencia`:**

```json
{
  "tiempo_sesion": "X horas",
  "comandos_ejecutados": X,
  "comandos_exitosos": X,
  "comandos_fallidos": X,
  "ratio_exito": "X%",
  "commits_creados": X,
  "archivos_modificados": X,
  "archivos_subidos": X,
  "problemas_resueltos": X,
  "problemas_creados": X,
  "tiempo_productivo": "X%",
  "tiempo_diagnostico": "X%",
  "tiempo_perdido": "X%"
}
```

**Objetivo de eficiencia:**
- Ratio de éxito de comandos: >80%
- Tiempo productivo: >70%
- Problemas resueltos vs creados: ratio >2:1
- Comandos por tarea completada: <10

---

## 🔧 HERRAMIENTAS Y COMANDOS ESENCIALES

### Diagnóstico de problemas
```powershell
# Ver logs Azure en tiempo real
az webapp log tail --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic

# Ver estado de recursos Azure
az webapp show --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic --query "state"

# Ver workflows GitHub
Start-Process 'https://github.com/ECONEURA-COM/ECONEURA/actions'

# Ver deployment source Azure
az webapp deployment source show --name econeura-backend-v2 --resource-group appsvc_linux_northeurope_basic
```

### Testing completo local
```powershell
# Backend
cd C:\Users\Usuario\ECONEURA-NUEVO\backend
npm start
# En otra terminal:
Invoke-WebRequest -Uri "http://localhost:8080/api/health" -UseBasicParsing
$body = '{"email":"demo@econeura.com","password":"demo123"}'; Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$body = '{"input":"Hola CEO"}'; Invoke-WebRequest -Uri "http://localhost:8080/api/invoke/a-ceo-01" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing

# Frontend
cd C:\Users\Usuario\ECONEURA-NUEVO\frontend
npm run dev
# Abrir http://localhost:5173 en navegador
```

### Deployment a GitHub y Azure
```powershell
# Proceso completo
cd C:\Users\Usuario\ECONEURA-NUEVO
git status
git add .
git commit -m "feat: descripción clara"
git push origin main
# Esperar 3 minutos
# Verificar workflows en GitHub Actions
# Testear Azure endpoints
```

---

## 📝 FORMATO DE RESPUESTAS ÓPTIMAS

### Estructura de respuesta eficiente:

```markdown
## [TÍTULO DE LA ACCIÓN]

### ⚡ ANÁLISIS:
[1-2 líneas explicando qué se va a hacer y por qué]

### ⚡ COMANDO 1: [Nombre descriptivo]
```powershell
[comando]
```
**Por qué**: [explicación de 1 línea]
**Resultado esperado**: [qué esperar]

### ⚡ COMANDO 2: [Nombre descriptivo]
```powershell
[comando]
```
**Por qué**: [explicación de 1 línea]
**Resultado esperado**: [qué esperar]

### ⚡ VERIFICACIÓN:
```powershell
[comando de verificación]
```
**Evidencia de éxito**: [cómo saber que funcionó]
```

**Máximo 5 comandos por respuesta salvo excepciones justificadas.**

---

## 🔄 CICLO DE MEJORA CONTINUA

### Después de cada problema resuelto:

1. **Documentar en `MEMORIA_SESION.json`**:
   ```json
   {
     "problemas_conocidos": [{
       "problema": "descripción",
       "causa": "causa raíz",
       "solucion": "solución verificada",
       "estado": "resuelto",
       "fecha": "2025-10-24"
     }]
   }
   ```

2. **Actualizar `CONTRATO_DESARROLLO.md`** si:
   - Se descubre un nuevo anti-patrón crítico
   - Se descubre un nuevo patrón de excelencia
   - Se aprende una lección importante

3. **Crear test de regresión** si es posible:
   - Comando que verifica que el problema no vuelve
   - Agregar a `comandos_verificacion` en `MEMORIA_SESION.json`

---

## 🎯 OBJETIVOS DE CADA SESIÓN

**Mínimo aceptable:**
- 1 tarea completada y verificada
- 0 código funcional destruido
- 1 actualización de `MEMORIA_SESION.json`
- 1 commit con mensaje claro

**Objetivo ideal:**
- 3-5 tareas completadas y verificadas
- 0 problemas nuevos creados
- 5+ actualizaciones de `MEMORIA_SESION.json`
- 3+ commits con mensajes claros
- Evidencia verificable de cada logro

**Excelencia:**
- 10+ tareas completadas
- 2+ problemas históricos resueltos
- Sistema mejorado (nuevos tests, mejor documentación)
- Usuario puede reproducir resultados fácilmente
- Código production-ready desplegado y funcionando

---

## 🚨 CUANDO PEDIR AYUDA AL USUARIO

**Debo pedir ayuda cuando:**
1. Un comando falla 2 veces con la misma estrategia
2. No tengo acceso a credenciales necesarias
3. El problema requiere decisión de negocio
4. El tiempo estimado supera 30 minutos sin progreso
5. No estoy seguro de la causa raíz de un problema

**No debo pedir ayuda cuando:**
1. Puedo diagnosticar con herramientas disponibles
2. Puedo leer archivos para entender el problema
3. Puedo testear localmente para verificar
4. Tengo acceso a documentación o logs
5. Es un problema técnico que puedo resolver

---

## 📚 RECURSOS Y DOCUMENTACIÓN

**Enlaces útiles:**
- GitHub Repo: https://github.com/ECONEURA-COM/ECONEURA.git
- GitHub Actions: https://github.com/ECONEURA-COM/ECONEURA/actions
- Azure Portal: https://portal.azure.com
- Backend Prod: https://econeura-backend-v2.azurewebsites.net
- Frontend Prod: https://delightful-sand-04fd53203.3.azurestaticapps.net

**Documentación técnica:**
- Azure CLI: https://learn.microsoft.com/en-us/cli/azure/
- GitHub Actions: https://docs.github.com/en/actions
- OpenAI API: https://platform.openai.com/docs
- React: https://react.dev
- Node.js: https://nodejs.org/docs

---

## 🔄 ACTUALIZACIÓN DE ESTE ARCHIVO

**Este archivo se actualiza cuando:**
1. Se descubre un nuevo ritual eficiente
2. Se descubre un nuevo anti-patrón
3. Cambia el flujo de trabajo fundamental
4. Se aprende una lección importante

**Última actualización**: 2025-10-24
**Versión**: 1.0

