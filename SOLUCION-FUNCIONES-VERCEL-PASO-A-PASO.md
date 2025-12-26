# 🔧 Solución Paso a Paso: Funciones No Aparecen en Vercel

## ⚠️ PROBLEMA ACTUAL
- Framework Preset está en "Other" ✅ (esto está bien)
- No aparecen funciones en la pestaña "Functions"
- No aparecen cron jobs

## 🎯 SOLUCIÓN PASO A PASO

### **PASO 1: Cambiar Framework Preset a "No Framework"**

1. Ve a **Vercel Dashboard** → Tu proyecto
2. Click en **Settings** (Configuración)
3. En el menú izquierdo, click en **General**
4. Busca la sección **"Framework Preset"**
5. Click en **"Edit"** o el botón de editar
6. **Selecciona "No Framework"** (NO "Other")
7. Click en **"Save"**
8. Esto forzará un nuevo deployment automáticamente

### **PASO 2: Verificar Build Settings**

1. En **Settings**, click en **"Build & Development Settings"**
2. Verifica que:
   - **Build Command:** Esté **VACÍO** o `echo "No build needed"`
   - **Output Directory:** Esté **VACÍO**
   - **Install Command:** `npm install` (o vacío si no hay dependencias)
3. Si algo está mal, cámbialo y guarda

### **PASO 3: Esperar el Nuevo Deployment**

1. Ve a la pestaña **"Deployments"**
2. Deberías ver un nuevo deployment iniciándose (por el cambio del Framework Preset)
3. Espera a que termine (estado "Ready" en verde)

### **PASO 4: Verificar Functions**

1. Click en el deployment más reciente (el que acaba de terminar)
2. En la parte superior, busca la pestaña **"Functions"**
3. Deberías ver **11 funciones** listadas:
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

### **PASO 5: Si Aún No Aparecen - Forzar Detección**

Si después de cambiar a "No Framework" aún no aparecen:

#### Opción A: Desconectar y Reconectar el Proyecto

1. Ve a **Settings** → **General**
2. Scroll hasta abajo
3. Busca **"Disconnect"** o **"Unlink"**
4. Click en desconectar (esto NO borra el proyecto, solo la conexión con GitHub)
5. Luego click en **"Connect Git Repository"**
6. Selecciona tu repositorio de GitHub nuevamente
7. Esto forzará una detección completa desde cero

#### Opción B: Crear un Deployment Manual

1. En la terminal, ejecuta:
```bash
cd "c:\Users\carla\Cresalia-Web"
git commit --allow-empty -m "Force deploy - detect functions"
git push origin main
```

2. Esto creará un nuevo deployment que debería detectar las funciones

### **PASO 6: Verificar que los Archivos Estén en GitHub**

1. Ve a tu repositorio en GitHub: `https://github.com/carlaj4r4/Cresalia-Web`
2. Navega a la carpeta `api/`
3. Verifica que haya **11 archivos .js**:
   - ✅ admin.js
   - ✅ ai-chat.js
   - ✅ celebraciones.js
   - ✅ comunidades-api.js
   - ✅ enviar-email-brevo.js
   - ✅ enviar-push-notification.js
   - ✅ jobs.js
   - ✅ mantenimiento.js
   - ✅ mercadopago-preference.js
   - ✅ support.js
   - ✅ webhook-mercadopago.js

### **PASO 7: Probar Endpoints para Generar Logs**

Abre estas URLs en tu navegador para generar logs y forzar la detección:

1. `https://cresalia-web.vercel.app/api/mantenimiento`
2. `https://cresalia-web.vercel.app/api/support`
3. `https://cresalia-web.vercel.app/api/celebraciones?tipo=cumpleanos&action=consent&email=test@test.com`

Luego:
1. Ve a **Deployments** → Último deployment
2. Click en **"Runtime Logs"**
3. Deberías ver las ejecuciones de las funciones

## 🔍 VERIFICACIÓN FINAL

### Checklist:

- [ ] Framework Preset está en **"No Framework"** (NO "Other")
- [ ] Build Command está **vacío**
- [ ] Output Directory está **vacío**
- [ ] Los 11 archivos están en `api/` en GitHub
- [ ] El último deployment está en estado **"Ready"**
- [ ] Revisaste la pestaña **"Functions"** en el deployment
- [ ] Probaste los endpoints y aparecen en Runtime Logs

## 💡 DIFERENCIA ENTRE "Other" Y "No Framework"

- **"Other"**: Vercel intenta detectar automáticamente el framework, pero puede no detectar funciones serverless
- **"No Framework"**: Vercel NO intenta detectar framework, pero SÍ detecta automáticamente funciones en `api/`

**Por eso es importante usar "No Framework" en lugar de "Other".**

## 🚨 SI NADA FUNCIONA

Si después de todos estos pasos aún no aparecen las funciones:

1. **Verifica que no haya un `.vercelignore`** que esté excluyendo la carpeta `api/`
2. **Contacta soporte de Vercel** con esta información:
   - Framework Preset: "No Framework"
   - Build Command: vacío
   - Output Directory: vacío
   - 11 archivos en carpeta `api/`
   - Funciones no aparecen en la pestaña "Functions"

## 📝 NOTA IMPORTANTE

Vercel detecta automáticamente las funciones serverless cuando:
- ✅ El Framework Preset es **"No Framework"**
- ✅ Los archivos están en la carpeta `api/` en la raíz del proyecto
- ✅ Los archivos exportan: `module.exports = async (req, res) => {}`
- ✅ No hay errores de sintaxis
- ✅ El proyecto está conectado correctamente a GitHub
