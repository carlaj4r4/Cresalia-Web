# 🚀 DEPLOY MANUAL EN VERCEL - PASO A PASO

## ⚠️ **SI EL DEPLOY NO SE INICIÓ AUTOMÁTICAMENTE**

### **OPCIÓN 1: DEPLOY DESDE VERCEL DASHBOARD**

1. **Ve a Vercel Dashboard:**
   - Abre [vercel.com](https://vercel.com)
   - Inicia sesión

2. **Busca tu proyecto:**
   - Haz clic en tu proyecto "Cresalia-Web" (o el nombre que tenga)

3. **Haz deploy manual:**
   - Ve a la pestaña **"Deployments"**
   - Haz clic en el botón **"..."** (tres puntos) en la parte superior
   - Selecciona **"Redeploy"**
   - O haz clic en **"Deploy"** si hay un botón disponible

4. **Si no aparece el proyecto:**
   - Haz clic en **"Add New..."** → **"Project"**
   - Conecta tu repositorio de GitHub
   - Selecciona "Cresalia-Web"
   - Configura el proyecto (ver abajo)

---

### **OPCIÓN 2: CONECTAR REPOSITORIO NUEVO**

Si el proyecto no está conectado:

1. **En Vercel Dashboard:**
   - Haz clic en **"Add New..."** → **"Project"**

2. **Importar desde GitHub:**
   - Selecciona **"Import Git Repository"**
   - Busca "Cresalia-Web" o "Cresalia-Web" en la lista
   - Si no aparece, haz clic en **"Adjust GitHub App Permissions"** y autoriza

3. **Configurar el proyecto:**
   - **Framework Preset:** Other (o Static)
   - **Root Directory:** `./` (raíz)
   - **Build Command:** (dejar vacío)
   - **Output Directory:** `./` (raíz)
   - **Install Command:** (dejar vacío)

4. **Configurar Variables de Entorno:**
   - Antes de hacer deploy, ve a **Settings → Environment Variables**
   - Agrega las variables (ver abajo)

5. **Hacer Deploy:**
   - Haz clic en **"Deploy"**

---

### **OPCIÓN 3: DEPLOY DESDE CLI (Terminal)**

Si prefieres usar la terminal:

```bash
# 1. Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# 2. Iniciar sesión
vercel login

# 3. Hacer deploy
vercel --prod
```

---

## 🔧 **CONFIGURACIÓN NECESARIA**

### **Variables de Entorno (OBLIGATORIO):**

En Vercel → Settings → Environment Variables, agrega:

```
SUPABASE_URL=https://zbomxayytvwjbdzbegcw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpib214YXl5dHZ3amJkemJlZ2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODczMDMsImV4cCI6MjA3NzY2MzMwM30.ZYpckr8rPaN1vAemdjHxPSe6QvF6R1Ylic6JoNKnsBA
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

**⚠️ IMPORTANTE:**
- Marca todas como **"Production"**, **"Preview"** y **"Development"**
- Reemplaza `tu_service_role_key_aqui` con tu clave real de Supabase

---

## 🔍 **VERIFICAR ESTADO DEL DEPLOY**

1. Ve a **Deployments** en Vercel
2. Busca el último deploy
3. Si está en "Building" o "Queued", espera
4. Si está en "Error", haz clic y revisa los logs
5. Si está en "Ready", ¡tu sitio está en producción!

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Problema: "No se puede conectar al repositorio"**
- Verifica que el repositorio sea público o que Vercel tenga acceso
- Ve a GitHub → Settings → Applications → Vercel y verifica permisos

### **Problema: "Build Failed"**
- Revisa los logs en Vercel
- Verifica que no haya errores de sintaxis
- Asegúrate de que `vercel.json` esté correcto

### **Problema: "Variables de entorno no encontradas"**
- Ve a Settings → Environment Variables
- Agrega todas las variables necesarias
- Haz un nuevo deploy después de agregarlas

---

## ✅ **CHECKLIST FINAL**

- [ ] Repositorio conectado a Vercel
- [ ] Variables de entorno configuradas
- [ ] Deploy iniciado (manual o automático)
- [ ] Deploy completado con status "Ready"
- [ ] Sitio funciona correctamente en la URL de Vercel

---

## 🎉 **¡LISTO!**

Una vez que el deploy esté completo, tu sitio estará disponible en:
- `https://tu-proyecto.vercel.app`
- O en tu dominio personalizado si lo configuraste

