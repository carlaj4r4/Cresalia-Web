# 🎯 Solución Directa: Funciones No Aparecen en Vercel

## ⚠️ PROBLEMA
Las funciones y cron jobs no aparecen en la pestaña "Functions" ni "Cron Jobs" de Vercel.

## 🔍 DIAGNÓSTICO RÁPIDO

### ¿Las funciones están funcionando aunque no aparezcan?

**Prueba estos endpoints:**
1. Abre: `https://cresalia-web.vercel.app/api/mantenimiento`
2. Abre: `https://cresalia-web.vercel.app/api/support`

**Si responden correctamente:**
- ✅ Las funciones **SÍ están funcionando**
- ❌ Solo que Vercel no las está listando en la UI
- 💡 Esto es un problema de visualización, no de funcionalidad

**Si dan error 404:**
- ❌ Las funciones NO están siendo detectadas
- Necesitas seguir los pasos siguientes

## 🚀 SOLUCIÓN PASO A PASO (OBLIGATORIO)

### **PASO 1: Cambiar Framework Preset (CRÍTICO)**

1. Ve a: **Vercel Dashboard** → Tu proyecto → **Settings**
2. En el menú izquierdo, click en **"General"**
3. Busca **"Framework Preset"**
4. **DEBE decir "No Framework"** (NO "Other")
5. Si dice "Other":
   - Click en **"Edit"** o el lápiz
   - Selecciona **"No Framework"** del dropdown
   - Click en **"Save"**
   - Esto iniciará un nuevo deployment automáticamente

### **PASO 2: Verificar Build Settings**

1. En **Settings**, click en **"Build & Development Settings"**
2. Verifica:
   - **Build Command:** DEBE estar **VACÍO** (no debe decir nada)
   - **Output Directory:** DEBE estar **VACÍO** (no debe decir nada)
   - **Install Command:** Puede ser `npm install` o vacío
3. Si Build Command o Output Directory tienen algo, bórralo y guarda

### **PASO 3: Esperar Deployment**

1. Ve a **Deployments**
2. Deberías ver un nuevo deployment iniciándose
3. Espera a que termine (estado "Ready" en verde)
4. Esto puede tomar 2-5 minutos

### **PASO 4: Verificar Functions**

1. Click en el deployment más reciente
2. Busca la pestaña **"Functions"** en la parte superior
3. Deberías ver **11 funciones** listadas

### **PASO 5: Si Aún No Aparecen - Desconectar y Reconectar**

1. Ve a **Settings** → **General**
2. Scroll hasta abajo
3. Busca **"Disconnect Git Repository"** o **"Unlink"**
4. Click en desconectar (esto NO borra el proyecto, solo la conexión)
5. Luego click en **"Connect Git Repository"**
6. Selecciona: `carlaj4r4/Cresalia-Web`
7. Selecciona rama: `main`
8. Esto forzará una detección completa desde cero

## 🔧 VERIFICACIÓN ALTERNATIVA

### Verificar que las funciones funcionan (aunque no aparezcan)

1. Abre estas URLs en tu navegador:
   - `https://cresalia-web.vercel.app/api/mantenimiento`
   - `https://cresalia-web.vercel.app/api/support`
   - `https://cresalia-web.vercel.app/api/celebraciones?tipo=cumpleanos&action=consent&email=test@test.com`

2. Si responden con JSON (no error 404):
   - ✅ Las funciones **SÍ están funcionando**
   - El problema es solo visual en el dashboard

3. Ve a **Deployments** → Último deployment → **"Runtime Logs"**
   - Deberías ver logs de las ejecuciones
   - Si ves logs, las funciones están funcionando ✅

## 📋 CHECKLIST OBLIGATORIO

Antes de reportar que no funciona, verifica:

- [ ] Framework Preset está en **"No Framework"** (NO "Other")
- [ ] Build Command está **completamente vacío**
- [ ] Output Directory está **completamente vacío**
- [ ] Los 11 archivos están en `api/` en GitHub
- [ ] El último deployment está en estado **"Ready"**
- [ ] Probaste los endpoints y responden (no dan 404)
- [ ] Revisaste Runtime Logs y aparecen ejecuciones
- [ ] Intentaste desconectar y reconectar el proyecto

## 💡 NOTA IMPORTANTE

**Las funciones pueden estar funcionando aunque no aparezcan en la UI.**

Vercel a veces tiene problemas mostrando las funciones en la pestaña "Functions", pero si:
- Los endpoints responden correctamente
- Aparecen logs en Runtime Logs
- No dan error 404

**Entonces las funciones SÍ están funcionando** y el problema es solo visual.

## 🚨 SI NADA FUNCIONA

Si después de todos estos pasos:
- Los endpoints dan 404
- No aparecen logs en Runtime Logs
- Las funciones no funcionan

Entonces contacta soporte de Vercel con:
- Framework Preset: "No Framework"
- Build Command: vacío
- Output Directory: vacío
- 11 archivos en carpeta `api/`
- Los endpoints dan 404
- No aparecen funciones en la pestaña "Functions"
