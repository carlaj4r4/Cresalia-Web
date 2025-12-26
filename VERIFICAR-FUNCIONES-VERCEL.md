# 🔍 Verificación Completa: Funciones en Vercel

## ⚠️ PROBLEMA
Las funciones serverless no aparecen en la pestaña "Functions" de Vercel, ni los cron jobs.

## ✅ VERIFICACIONES NECESARIAS

### 1. Verificar que los archivos estén en GitHub

Ve a: `https://github.com/carlaj4r4/Cresalia-Web/tree/main/api`

Debes ver **11 archivos .js**:
- [ ] admin.js
- [ ] ai-chat.js
- [ ] celebraciones.js
- [ ] comunidades-api.js
- [ ] enviar-email-brevo.js
- [ ] enviar-push-notification.js
- [ ] jobs.js
- [ ] mantenimiento.js
- [ ] mercadopago-preference.js
- [ ] support.js
- [ ] webhook-mercadopago.js

### 2. Verificar Framework Preset en Vercel Dashboard

**Ruta:** Settings → General → Framework Preset

**DEBE estar en:** "No Framework" (NO "Other")

**Si está en "Other":**
1. Click en "Edit"
2. Selecciona "No Framework"
3. Guarda
4. Esto iniciará un nuevo deployment

### 3. Verificar Build Settings

**Ruta:** Settings → Build & Development Settings

- **Build Command:** DEBE estar **VACÍO**
- **Output Directory:** DEBE estar **VACÍO**
- **Install Command:** Puede ser `npm install` o vacío

### 4. Verificar que el Deployment esté en "Ready"

**Ruta:** Deployments → Último deployment

- Estado debe ser **"Ready"** (verde)
- Si está en "Building" o "Error", espera o revisa los logs

### 5. Verificar Functions Tab

**Ruta:** Deployments → Último deployment → Pestaña "Functions"

**Si NO aparece la pestaña "Functions":**
- El deployment puede no haber detectado funciones
- Necesitas cambiar el Framework Preset a "No Framework"

### 6. Probar Endpoints Manualmente

Abre estas URLs en tu navegador para generar logs:

1. `https://cresalia-web.vercel.app/api/mantenimiento`
2. `https://cresalia-web.vercel.app/api/support`
3. `https://cresalia-web.vercel.app/api/celebraciones?tipo=cumpleanos&action=consent&email=test@test.com`

Luego:
- Ve a Deployments → Último deployment → "Runtime Logs"
- Deberías ver las ejecuciones de las funciones

## 🔧 SOLUCIÓN ALTERNATIVA: Desconectar y Reconectar

Si nada funciona, intenta esto:

1. **Settings** → **General** → Scroll hasta abajo
2. Busca **"Disconnect"** o **"Unlink Git Repository"**
3. Click en desconectar (esto NO borra el proyecto)
4. Luego click en **"Connect Git Repository"**
5. Selecciona tu repositorio: `carlaj4r4/Cresalia-Web`
6. Selecciona la rama: `main`
7. Esto forzará una detección completa desde cero

## 📋 CHECKLIST FINAL

- [ ] Los 11 archivos están en `api/` en GitHub
- [ ] Framework Preset está en **"No Framework"**
- [ ] Build Command está **vacío**
- [ ] Output Directory está **vacío**
- [ ] El último deployment está en estado **"Ready"**
- [ ] Revisaste la pestaña **"Functions"** en el deployment
- [ ] Probaste los endpoints y aparecen en Runtime Logs
- [ ] Intentaste desconectar y reconectar el proyecto

## 🚨 SI AÚN NO FUNCIONA

Si después de todos estos pasos aún no aparecen las funciones:

1. **Verifica que no haya un `.vercelignore`** que esté excluyendo la carpeta `api/`
2. **Verifica que los archivos tengan el formato correcto:**
   - Deben exportar: `module.exports = async (req, res) => {}`
   - Deben estar en la carpeta `api/` en la raíz del proyecto
3. **Contacta soporte de Vercel** con esta información:
   - Framework Preset: "No Framework"
   - Build Command: vacío
   - Output Directory: vacío
   - 11 archivos en carpeta `api/`
   - Funciones no aparecen en la pestaña "Functions"
   - Los endpoints funcionan (aparecen en Runtime Logs) pero no se listan

## 💡 NOTA IMPORTANTE

**Las funciones PUEDEN estar funcionando** aunque no aparezcan en la pestaña "Functions". Si los endpoints responden correctamente y aparecen en Runtime Logs, las funciones están funcionando, solo que Vercel no las está listando en la UI.

Para verificar si funcionan:
1. Prueba los endpoints manualmente
2. Revisa Runtime Logs
3. Si aparecen logs, las funciones están funcionando ✅
