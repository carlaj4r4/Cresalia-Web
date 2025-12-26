# 🔧 Solución Definitiva: Funciones No Aparecen en Vercel

## ✅ Cambios Realizados

1. ✅ Corregido error de sintaxis en `webhook-mercadopago.js`
2. ✅ Eliminada configuración inválida de runtime en `vercel.json`
3. ✅ Agregado `engines.node` en `package.json`
4. ✅ Verificadas todas las funciones (11/11 correctas)

## 🎯 Pasos CRÍTICOS en Vercel Dashboard

### 1. Framework Preset (MÁS IMPORTANTE) ⚠️

**Ruta:** Vercel Dashboard → Tu Proyecto → **Settings** → **General** → **Framework Preset**

**DEBE estar en:**
- ✅ **"Other"** o
- ✅ **"No Framework"**

**NO debe estar en:**
- ❌ "Next.js"
- ❌ "React"
- ❌ "Vue"
- ❌ Cualquier otro framework

**Si está en un framework específico:**
1. Haz clic en "Edit"
2. Selecciona **"Other"**
3. Guarda los cambios
4. Esto forzará un nuevo deployment

### 2. Build Settings

**Ruta:** Settings → **Build & Development Settings**

- **Build Command:** (dejar **vacío**)
- **Output Directory:** (dejar **vacío**)
- **Install Command:** `npm install` (si hay dependencias) o vacío

### 3. Verificar Deployment

1. Ve a **Deployments** → Último deployment
2. Estado debe ser **"Ready"** (verde)
3. Haz clic en la pestaña **"Functions"**
4. Deberías ver **11 funciones**

## 🔍 Si Aún No Aparecen

### Opción A: Verificar que los archivos estén en GitHub

1. Ve a tu repositorio en GitHub
2. Navega a la carpeta `api/`
3. Debe haber **11 archivos .js**:
   - admin.js
   - ai-chat.js
   - celebraciones.js
   - comunidades-api.js
   - enviar-email-brevo.js
   - enviar-push-notification.js
   - jobs.js
   - mantenimiento.js
   - mercadopago-preference.js
   - support.js
   - webhook-mercadopago.js

### Opción B: Probar endpoints manualmente

Abre estas URLs para generar logs:

1. `https://cresalia-web.vercel.app/api/mantenimiento`
2. `https://cresalia-web.vercel.app/api/support`
3. `https://cresalia-web.vercel.app/api/celebraciones?tipo=cumpleanos&action=consent&email=test@test.com`

Luego ve a **Runtime Logs** - deberías ver las ejecuciones.

### Opción C: Desconectar y Reconectar el Proyecto

1. Ve a Settings → **General** → Scroll hasta abajo
2. Haz clic en **"Disconnect"** (esto NO borra el proyecto)
3. Luego **"Connect"** nuevamente con GitHub
4. Esto forzará una detección completa

## 📋 Checklist Final

- [ ] Framework Preset está en **"Other"**
- [ ] Build Command está **vacío**
- [ ] Output Directory está **vacío**
- [ ] Los 11 archivos están en `api/` en GitHub
- [ ] El último deployment está en estado **"Ready"**
- [ ] Revisaste la pestaña **"Functions"** en el deployment

## 💡 Nota Importante

Vercel detecta automáticamente las funciones serverless en la carpeta `api/` cuando:
- ✅ El Framework Preset es "Other" o "No Framework"
- ✅ Los archivos exportan correctamente: `module.exports = async (req, res) => {}`
- ✅ No hay errores de sintaxis
- ✅ Los archivos están en la raíz del proyecto (no en subcarpetas)

Si todo esto está correcto y aún no aparecen, puede ser un problema temporal de Vercel. Espera unos minutos y vuelve a revisar.
