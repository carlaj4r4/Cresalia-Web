# 🚀 DEPLOY AHORA MISMO - PASO A PASO

## ⚡ **SI NO APARECE EL DEPLOY AUTOMÁTICO**

### **PASO 1: IR A VERCEL**

1. Abre tu navegador
2. Ve a: **https://vercel.com**
3. Inicia sesión con tu cuenta

---

### **PASO 2: VERIFICAR SI TIENES EL PROYECTO**

#### **Opción A: Si YA tienes el proyecto en Vercel:**

1. En el Dashboard, busca **"Cresalia-Web"** o el nombre de tu proyecto
2. Si lo encuentras:
   - Haz clic en el proyecto
   - Ve a la pestaña **"Deployments"**
   - Haz clic en **"..."** (tres puntos) → **"Redeploy"**
   - O haz clic en el botón **"Deploy"** si aparece

#### **Opción B: Si NO tienes el proyecto (crearlo nuevo):**

1. En el Dashboard, haz clic en **"Add New..."** → **"Project"**
2. Si te pide conectar GitHub:
   - Haz clic en **"Connect GitHub"** o **"Adjust GitHub App Permissions"**
   - Autoriza a Vercel a acceder a tus repositorios
   - Selecciona los repositorios que quieres conectar

3. **Importar el repositorio:**
   - Busca **"Cresalia-Web"** en la lista
   - Haz clic en **"Import"**

4. **Configurar el proyecto:**
   - **Framework Preset:** Selecciona **"Other"** o **"Static"**
   - **Root Directory:** Deja `./` (raíz)
   - **Build Command:** Déjalo **VACÍO**
   - **Output Directory:** Déjalo **VACÍO** o pon `./`
   - **Install Command:** Déjalo **VACÍO**

5. **⚠️ IMPORTANTE: Configurar Variables de Entorno ANTES de hacer deploy:**
   - Haz clic en **"Environment Variables"** o ve a **Settings → Environment Variables**
   - Agrega estas variables:

   ```
   SUPABASE_URL = https://zbomxayytvwjbdzbegcw.supabase.co
   SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpib214YXl5dHZ3amJkemJlZ2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODczMDMsImV4cCI6MjA3NzY2MzMwM30.ZYpckr8rPaN1vAemdjHxPSe6QvF6R1Ylic6JoNKnsBA
   SUPABASE_SERVICE_ROLE_KEY = tu_service_role_key_aqui
   ```

   **⚠️ IMPORTANTE:**
   - Marca todas como **"Production"**, **"Preview"** y **"Development"**
   - Reemplaza `tu_service_role_key_aqui` con tu clave real de Supabase

6. **Hacer Deploy:**
   - Haz clic en el botón **"Deploy"**
   - Espera 1-2 minutos
   - Verás el progreso: "Building" → "Ready"

---

### **PASO 3: VERIFICAR EL DEPLOY**

1. Una vez que veas **"Ready"** en verde:
   - Haz clic en el deploy
   - Verás la URL de tu sitio (ej: `https://cresalia-web.vercel.app`)

2. **Abrir el sitio:**
   - Haz clic en la URL o cópiala
   - Abre en una nueva pestaña
   - Verifica que todo funcione

---

## 🔍 **SI NO VES EL BOTÓN "DEPLOY"**

### **Verificar conexión con GitHub:**

1. Ve a **Settings → Git** en tu proyecto de Vercel
2. Verifica que esté conectado a: `carlaj4r4/Cresalia-Web`
3. Si no está conectado:
   - Haz clic en **"Connect Git Repository"**
   - Selecciona **"Cresalia-Web"**
   - Autoriza si es necesario

### **Reconectar el repositorio:**

1. Ve a **Settings → Git**
2. Haz clic en **"Disconnect"**
3. Luego **"Connect Git Repository"** de nuevo
4. Selecciona **"Cresalia-Web"**
5. Esto debería activar el deploy automático

---

## 🆘 **SI NADA FUNCIONA - DEPLOY DESDE CLI**

Si no puedes hacer deploy desde el Dashboard, usa la terminal:

```bash
# 1. Instalar Vercel CLI (solo una vez)
npm install -g vercel

# 2. Iniciar sesión
vercel login

# 3. Hacer deploy
vercel --prod
```

Esto te pedirá:
- ¿Cuál es el directorio de tu proyecto? → Presiona Enter (raíz)
- ¿Quieres sobrescribir la configuración? → No
- ¿Quieres asociar con un proyecto existente? → Si tienes uno, sí

---

## ✅ **CHECKLIST FINAL**

- [ ] Proyecto creado o encontrado en Vercel
- [ ] Repositorio conectado a GitHub
- [ ] Variables de entorno configuradas
- [ ] Deploy iniciado (manual o automático)
- [ ] Deploy completado con status "Ready"
- [ ] Sitio funciona en la URL de Vercel

---

## 🎉 **¡LISTO!**

Una vez que el deploy esté completo, tu sitio estará disponible en:
- `https://tu-proyecto.vercel.app`
- O en tu dominio personalizado si lo configuraste

**💡 Tip:** Si ves una versión antigua, limpia el cache del navegador con `Ctrl + Shift + R`





