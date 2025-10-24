# CONTRATO DE DESARROLLO ECONEURA

## 🎯 IDENTIDAD DEL PROYECTO

**ECONEURA** es una plataforma enterprise de gobernanza de automatizaciones que gestiona 40-200 agentes Make/n8n/Zapier/Power Automate dispersos.

**VALOR ÚNICO**: Cockpit donde 10 NEURAs (asesores virtuales C-Suite) colaboran con humanos de departamento para gestionar, priorizar y ejecutar automatizaciones mediante razonamiento conjunto.

**DIFERENCIADORES ÚNICOS**:
1. Gestión centralizada agentes multi-plataforma (Make+n8n+Zapier agnóstico)
2. Conversaciones multi-actor (CFO+CMO+NEURA-CFO razonan juntos)
3. HITL proposals obligatorio (IA propone, humano aprueba, sistema ejecuta)
4. Audit trail inmutable compliance-ready
5. NEURAs ejecutan agentes via function calling OpenAI

**NO ES**: No es un chat genérico, no es un clon de ChatGPT, no compite con IA conversacional.

---

## 🔒 REGLAS ABSOLUTAS (NUNCA ROMPER)

1. **NUNCA destruir código funcional**: Si algo funciona, no lo toco sin razón crítica verificada
2. **NUNCA prometer sin verificar**: Si digo "esto funciona", debo haberlo testeado personalmente
3. **NUNCA subir código roto**: Verificación local obligatoria antes de `git push`
4. **NUNCA mentir en diagnósticos**: Si está roto, decir "ROTO", no "puede estar configurándose"
5. **NUNCA optimismo en completitud**: Scores basados en tests reales, no promesas
6. **NUNCA comandos sin explicación**: Cada comando debe tener un propósito claro explicado
7. **NUNCA repetir errores**: Si algo falló 2 veces, PRIMERO crear investigación exhaustiva de causas probables (documento INVESTIGACION_*.md), listar todas las causas posibles con probabilidades, diagnosticar con herramientas NO DESTRUCTIVAS, y solo después proponer estrategia no destructiva. NUNCA cambiar estrategia destructivamente sin investigación previa.
8. **NUNCA trabajar sin contexto**: Leer `MEMORIA_SESION.json` antes de actuar
9. **NUNCA asumir sin comprobar**: Verificar con herramientas (logs, grep, read_file), no adivinar
10. **NUNCA bloquear al usuario**: Si algo toma >5 minutos, dar comandos manuales

---

## 📋 FLUJO DE TRABAJO OBLIGATORIO

### FASE 1: ANÁLISIS (2-5 minutos)
- Leer `CONTRATO_DESARROLLO.md` (este archivo)
- Leer `MEMORIA_SESION.json` (estado actual)
- Leer `TAREAS_PENDIENTES.md` (qué está en progreso)
- Entender el contexto completo antes de actuar

### FASE 2: PLANIFICACIÓN (1-3 minutos)
- Crear plan de acción con pasos específicos
- Identificar comandos necesarios
- Identificar puntos de verificación
- Estimar tiempo y riesgo

### FASE 3: VERIFICACIÓN LOCAL (OBLIGATORIA)
- **Si es backend**: `cd backend && npm start` + test endpoints
- **Si es frontend**: `cd frontend && npm run dev` + test UI
- **Si es deployment**: verificar que workflows están correctos
- **Si es configuración**: verificar que variables están definidas

### FASE 4: EJECUCIÓN (CON CHECKPOINTS)
- Ejecutar comandos uno a uno
- Verificar resultado de cada comando
- Si algo falla, diagnosticar antes de continuar
- Actualizar `MEMORIA_SESION.json` con cada paso

### FASE 5: VALIDACIÓN (OBLIGATORIA)
- Testear que lo prometido funciona
- Ejecutar comandos de verificación
- Guardar evidencia de que funciona
- Actualizar documentación

---

## 🔍 METODOLOGÍA DE INVESTIGACIÓN (SI ALGO FALLA 2+ VECES)

### PASO 1: CREAR DOCUMENTO DE INVESTIGACIÓN
**Crear archivo**: `INVESTIGACION_[PROBLEMA].md`

**Contenido obligatorio**:
1. **Descripción del problema**: Qué falla exactamente
2. **Estado funcional**: Qué funciona y qué no
3. **Historial de intentos**: Qué se intentó y falló
4. **Lista de causas probables**: Mínimo 5-10 causas con:
   - Descripción de la causa
   - Probabilidad (Alta 🔴, Media 🟡, Baja 🟢)
   - Síntomas observables
   - Comandos de verificación NO DESTRUCTIVOS
   - Solución propuesta si se confirma
5. **Plan de acción priorizado**: Comenzar por comandos NO DESTRUCTIVOS

### PASO 2: DIAGNOSTICAR CON HERRAMIENTAS NO DESTRUCTIVAS
**Comandos permitidos (seguros)**:
- Ver logs: `az webapp log tail`
- Ver configuración: `az webapp config show`
- Ver deployment source: `az webapp deployment source show`
- Leer archivos: `read_file`, `grep`
- Ver estado: `az webapp show`
- Listar archivos: `list_dir`

**Comandos PROHIBIDOS en esta fase**:
- ❌ `az webapp delete` (destructivo)
- ❌ `git reset --hard` (destructivo)
- ❌ Modificar archivos sin backup
- ❌ Cambiar configuraciones críticas

### PASO 3: IDENTIFICAR CAUSA RAÍZ
**Evidencia requerida**:
- Logs que muestran el error exacto
- Archivos que muestran la configuración
- Tests que muestran qué falla
- Comparación local vs Azure

### PASO 4: PROPONER SOLUCIÓN NO DESTRUCTIVA
**Jerarquía de soluciones**:
1. 🟢 **Seguras**: Reiniciar, refrescar cache, forzar redeploy
2. 🟡 **Reversibles**: Cambiar configuración (guardando backup)
3. 🟠 **Con precaución**: Modificar código (con git commit)
4. 🔴 **Último recurso**: Recrear recursos (con plan completo)

### PASO 5: EJECUTAR SOLUCIÓN CON CHECKPOINTS
- Ejecutar paso a paso
- Verificar después de cada paso
- Documentar resultados
- Si falla, volver a PASO 1

### PASO 6: ACTUALIZAR INVESTIGACIÓN
- Documentar qué funcionó
- Documentar qué no funcionó
- Actualizar `MEMORIA_SESION.json` con aprendizaje
- Agregar a `problemas_conocidos` si se resolvió

---

## ❌ ANTI-PATRONES (QUÉ NUNCA HACER)

- ❌ Dar 10+ comandos sin explicación clara
- ❌ Prometer "debería funcionar" sin testear
- ❌ Repetir el mismo comando fallido 3 veces
- ❌ Ignorar errores en logs
- ❌ Asumir que variables están configuradas
- ❌ Subir código sin verificar `.gitignore`
- ❌ Destruir workflows que funcionan
- ❌ Crear archivos temporales y no limpiarlos
- ❌ Dar comandos que requieren interacción humana en CI/CD
- ❌ Usar placeholders en comandos críticos
- ❌ Dar comandos con sintaxis incorrecta (--yes, --manual-integration false)
- ❌ Asumir que recursos existen sin verificar (plans, apps, etc.)
- ❌ Dar comandos sin verificar sintaxis en documentación oficial

---

## 📝 METODOLOGÍA PARA COMANDOS MANUALES

### REGLAS PARA DAR COMANDOS AL USUARIO:

#### 1. VERIFICAR SINTAXIS ANTES DE DAR COMANDO
- **NUNCA** asumir sintaxis de comandos Azure CLI/Git
- **SIEMPRE** verificar flags válidos (no `--yes`, no `--manual-integration false`)
- **SIEMPRE** verificar que recursos existen antes de usarlos (plans, apps)
- **NUNCA** inventar sintaxis sin verificar documentación

#### 2. COMANDOS EJECUTABLES SIN MODIFICACIONES
- **NUNCA** usar placeholders: `[VALOR]`, `YOUR_KEY`, `<valor>`
- **SIEMPRE** usar valores reales cuando los tengo
- **SIEMPRE** indicar si necesito información del usuario con `[RESULTADO_DE_COMANDO_ANTERIOR]`
- **NUNCA** comandos que requieren input interactivo

#### 3. ESTRUCTURA ÓPTIMA DE COMANDOS
```markdown
### COMANDO X: [Nombre descriptivo]
```powershell
[comando exacto sin placeholders]
```
**Por qué**: [1 línea explicando necesidad]
**Resultado esperado**: [output esperado]
**Si falla**: [qué hacer]
```

#### 4. SECUENCIA DE COMANDOS
- **Máximo 5 comandos** por respuesta
- **Numerar** secuencialmente (COMANDO 1, 2, 3...)
- **Indicar dependencias**: "Ejecutar después de COMANDO X"
- **Incluir verificaciones**: Después de comandos críticos

#### 5. COMANDOS CON VARIABLES/VALORES DINÁMICOS
- **PRIMERO**: Comando para obtener el valor
- **SEGUNDO**: Comando que usa el valor con `[RESULTADO]` claramente marcado
- **NUNCA**: Adivinar valores de recursos que pueden no existir

#### 6. MANEJO DE ERRORES EN COMANDOS
- **SIEMPRE**: Indicar qué error es esperado vs inesperado
- **SIEMPRE**: Dar solución alternativa si comando falla
- **NUNCA**: Dar el mismo comando fallido sin diagnosticar

### EJEMPLO DE COMANDOS ÓPTIMOS:

**MAL (lo que NO hacer)**:
```powershell
az webapp create --plan [TU_PLAN] --name app --runtime "NODE:20-lts" --yes
```
❌ Placeholder `[TU_PLAN]`
❌ Flag `--yes` no existe
❌ No verifico que el plan existe

**BIEN (lo que SÍ hacer)**:
```powershell
# COMANDO 1: Listar planes disponibles
az appservice plan list --resource-group appsvc_linux_northeurope_basic --output table

# COMANDO 2: Crear App Service con plan existente
# Usar el nombre del plan que aparece en COMANDO 1
az webapp create --resource-group appsvc_linux_northeurope_basic --plan [NOMBRE_DEL_PLAN_DE_COMANDO_1] --name econeura-backend-v2 --runtime "NODE:20-lts"
```
✅ Primero obtengo el valor
✅ Indico claramente de dónde viene el valor
✅ Sintaxis correcta verificada

---

## ✅ PATRONES DE EXCELENCIA

- ✅ Máximo 3-5 comandos por respuesta
- ✅ Cada comando con explicación de 1-2 líneas
- ✅ Verificar localmente antes de sugerir `git push`
- ✅ Actualizar `MEMORIA_SESION.json` después de cambios
- ✅ Diagnosticar con herramientas antes de asumir
- ✅ Crear checkpoints con `git commit` frecuentes
- ✅ Documentar problemas en `MEMORIA_SESION.json`
- ✅ Usar checklist antes de acciones críticas
- ✅ Evidencia verificable de cada logro
- ✅ Cambiar estrategia si algo falla 2 veces

---

## 🎯 OBJETIVOS DE CALIDAD

- **Eficiencia**: Máximo 5 comandos para lograr un objetivo
- **Precisión**: 100% de comandos ejecutables sin correcciones
- **Verificabilidad**: Cada logro con evidencia testeable
- **Honestidad**: Diagnósticos precisos sin optimismo
- **Aprendizaje**: No repetir errores documentados

---

## 📚 STACK TECNOLÓGICO

**Backend**:
- Node.js 20
- Express
- OpenAI API (gpt-4o-mini)
- PostgreSQL Flexible Server
- Redis Cache
- JWT auth

**Frontend**:
- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide Icons

**Infraestructura**:
- Azure App Service (Backend)
- Azure Static Web Apps (Frontend)
- Azure PostgreSQL
- Azure Redis
- GitHub Actions (CI/CD)

---

## 🔄 ACTUALIZACIÓN DE ESTE CONTRATO

Este contrato se actualiza cuando:
1. Se descubre un nuevo anti-patrón crítico
2. Se descubre un nuevo patrón de excelencia
3. Cambia la arquitectura fundamental del proyecto
4. Se aprende una lección importante de un error

**Última actualización**: 2025-10-24
**Versión**: 1.0

