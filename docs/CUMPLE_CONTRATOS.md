# 🔒 CUMPLE CONTRATOS - COMANDO DE VERIFICACIÓN

**Propósito**: Este archivo se ejecuta automáticamente cuando el usuario dice "CUMPLE CONTRATOS"

---

## ✅ RITUAL OBLIGATORIO AL RECIBIR "CUMPLE CONTRATOS"

### PASO 1: LEER ARCHIVOS DE CONTEXTO (OBLIGATORIO)
```markdown
- [ ] Leo CONTRATO_DESARROLLO.md completo
- [ ] Leo MEMORIA_SESION.json completo
- [ ] Leo TAREAS_PENDIENTES.md completo
- [ ] Leo INVESTIGACION_*.md si existe
- [ ] Entiendo el estado actual antes de responder
```

### PASO 2: VERIFICAR CUMPLIMIENTO DE REGLAS ABSOLUTAS
```markdown
- [ ] ¿Estoy destruyendo código funcional? → ❌ PROHIBIDO
- [ ] ¿Estoy prometiendo sin verificar? → ❌ PROHIBIDO
- [ ] ¿Estoy subiendo código sin testear local? → ❌ PROHIBIDO
- [ ] ¿Estoy mintiendo en diagnósticos? → ❌ PROHIBIDO
- [ ] ¿Estoy siendo optimista sin evidencia? → ❌ PROHIBIDO
- [ ] ¿Estoy dando comandos sin explicación? → ❌ PROHIBIDO
- [ ] ¿Estoy repitiendo errores? → ❌ PROHIBIDO
- [ ] ¿Estoy trabajando sin contexto? → ❌ PROHIBIDO
- [ ] ¿Estoy asumiendo sin comprobar? → ❌ PROHIBIDO
- [ ] ¿Estoy bloqueando al usuario? → ❌ PROHIBIDO
```

### PASO 3: VERIFICAR CALIDAD DE COMANDOS
```markdown
- [ ] ¿Mis comandos tienen sintaxis correcta verificada?
- [ ] ¿Mis comandos NO tienen placeholders?
- [ ] ¿Mis comandos son ejecutables sin modificaciones?
- [ ] ¿Tengo máximo 5 comandos por respuesta?
- [ ] ¿Cada comando tiene explicación de 1 línea?
- [ ] ¿Verifiqué que recursos existen antes de usarlos?
- [ ] ¿Incluí comando de verificación al final?
```

### PASO 4: VERIFICAR METODOLOGÍA DE INVESTIGACIÓN
```markdown
- [ ] Si algo falló 2+ veces, ¿creé INVESTIGACION_*.md?
- [ ] ¿Listé causas probables con probabilidades?
- [ ] ¿Usé comandos NO DESTRUCTIVOS primero?
- [ ] ¿Propuse soluciones jerarquizadas por riesgo?
- [ ] ¿Identifiqué causa raíz con evidencia de logs?
```

### PASO 5: ACTUALIZAR MEMORIA
```markdown
- [ ] ¿Actualicé MEMORIA_SESION.json con último estado?
- [ ] ¿Documenté problemas encontrados?
- [ ] ¿Marqué tareas completadas?
- [ ] ¿Guardé evidencias verificables?
```

---

## 📊 RESPUESTA ESTÁNDAR AL "CUMPLE CONTRATOS"

### Template de respuesta:

```markdown
## ✅ CUMPLIENDO CONTRATOS

### 📋 VERIFICACIÓN COMPLETADA:
- ✅ CONTRATO_DESARROLLO.md leído
- ✅ MEMORIA_SESION.json leído
- ✅ TAREAS_PENDIENTES.md leído
- ✅ Reglas absolutas verificadas
- ✅ Calidad de comandos verificada
- ✅ Metodología de investigación aplicada

### 🎯 ESTADO ACTUAL:
[Resumen de 2-3 líneas del estado actual basado en MEMORIA_SESION.json]

### ⚡ PRÓXIMA ACCIÓN RECOMENDADA:
[1 acción concreta con comando verificado]

### COMANDO:
```powershell
[comando sin placeholders, sintaxis verificada]
```
**Por qué**: [explicación]
**Resultado esperado**: [output]
```

---

## 🔄 CICLO DE MEJORA CONTINUA

### Después de cada "CUMPLE CONTRATOS":
1. Leer contexto completo (4 archivos)
2. Verificar cumplimiento de 10 reglas
3. Verificar calidad de comandos
4. Responder con comandos verificados
5. Actualizar memoria si hay cambios

---

## 🚨 SI NO PUEDO CUMPLIR CONTRATOS

**Si al leer CONTRATO_DESARROLLO.md identifico que estoy violando alguna regla:**

```markdown
⚠️ **ALERTA DE INCUMPLIMIENTO**

**Regla violada**: [Número y descripción]
**Cómo la violé**: [Explicación honesta]
**Corrección**: [Qué voy a hacer diferente]

**Solicito permiso para**:
[Acción que requiere aprobación porque rompe regla]
```

---

## 📚 ARCHIVOS QUE DEBO LEER SIEMPRE

1. **CONTRATO_DESARROLLO.md** (reglas absolutas)
2. **MEMORIA_SESION.json** (estado actual)
3. **TAREAS_PENDIENTES.md** (tareas en progreso)
4. **INVESTIGACION_*.md** (si existe, investigaciones activas)
5. **CHECKLIST.md** (antes de acciones críticas)

---

## ⚡ COMANDOS DE AUTO-VERIFICACIÓN

### Verificar que archivos existen:
```powershell
cd C:\Users\Usuario\ECONEURA-NUEVO
Get-ChildItem | Where-Object {$_.Name -like "*.md"} | Select-Object Name
```

### Verificar último commit:
```powershell
git log --oneline -1
```

### Verificar estado Git:
```powershell
git status --short
```

### Verificar backend local:
```powershell
cd backend
npm start
# Verificar que inicia sin errores
```

---

## 🎯 OBJETIVOS AL CUMPLIR CONTRATOS

**Cada vez que digo "CUMPLE CONTRATOS" debo:**
1. Leer contexto completo en <2 minutos
2. Verificar cumplimiento de 10 reglas
3. Dar máximo 3-5 comandos verificados
4. Incluir verificación de éxito
5. Actualizar memoria si hay cambios importantes

**Resultado esperado:**
- ✅ Usuario tiene comandos ejecutables
- ✅ Comandos tienen sintaxis correcta
- ✅ Sin placeholders ni valores inventados
- ✅ Con explicación clara y concisa
- ✅ Con verificación de éxito incluida

---

**Última actualización**: 2025-10-24
**Versión**: 1.0

**Este archivo es mi checklist automático al recibir "CUMPLE CONTRATOS".**

