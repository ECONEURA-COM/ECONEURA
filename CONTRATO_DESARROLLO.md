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
7. **NUNCA repetir errores**: Si algo falló 2 veces, cambiar de estrategia inmediatamente
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

