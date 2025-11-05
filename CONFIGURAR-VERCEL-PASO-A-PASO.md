# 🚀 CONFIGURAR VERCEL - PASO A PASO SIMPLE

## 📋 **TE GUIARÉ PASO A PASO, NO TE PREOCUPES 💜**

---

## **PASO 1: ACCEDER A VERCEL**

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión (si no tienes cuenta, créala con GitHub)
3. Una vez dentro, verás el dashboard

---

## **PASO 2: CREAR NUEVO PROYECTO**

1. Haz clic en **"Add New..."** (arriba a la derecha)
2. Selecciona **"Project"**
3. Si no está conectado, conecta tu cuenta de GitHub
4. Busca el repositorio: **"Cresalia-Web"**
5. Haz clic en **"Import"**

---

## **PASO 3: CONFIGURAR EL PROYECTO**

Verás una pantalla de configuración. Así debe quedar:

### **Configuración del Proyecto:**
- **Project Name:** `Cresalia-Web` (o el que quieras)
- **Framework Preset:** Selecciona **"Other"** o **"Vite"** (cualquiera funciona)
- **Root Directory:** `./` (dejar vacío o poner un punto)
- **Build Command:** (dejar vacío)
- **Output Directory:** (dejar vacío)
- **Install Command:** (dejar vacío)

### **IMPORTANTE:**
- **NO cambies nada más en esta pantalla**
- Solo haz clic en **"Deploy"** o **"Deploy Project"**

---

## **PASO 4: CONFIGURAR VARIABLES DE ENTORNO (MUY IMPORTANTE)**

**⚠️ ANTES DE HACER CLIC EN DEPLOY, haz esto:**

1. En la misma pantalla de configuración, busca la sección **"Environment Variables"** o **"Variables de Entorno"**
2. Haz clic en **"Add"** o **"Agregar"** para cada variable:

### **Variable 1: SUPABASE_URL**
- **Key (Nombre):** `SUPABASE_URL`
- **Value (Valor):** `https://zbomxayytvwjbdzbegcw.supabase.co`
- Marca: ✅ Production, ✅ Preview, ✅ Development

### **Variable 2: SUPABASE_ANON_KEY**
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** Tu anon key de Supabase (la que está en `config-supabase-seguro.js`)
- Marca: ✅ Production, ✅ Preview, ✅ Development

### **Variable 3: SUPABASE_SERVICE_ROLE_KEY**
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Tu service role key de Supabase (la que está en `config-supabase-seguro.js`)
- Marca: ✅ Production, ✅ Preview, ✅ Development

### **Variable 4: ADMIN_PASSWORD** (opcional)
- **Key:** `ADMIN_PASSWORD`
- **Value:** Tu contraseña de administrador
- Marca: ✅ Production, ✅ Preview, ✅ Development

### **Variable 5: MERCADOPAGO_PUBLIC_KEY** (si usas Mercado Pago)
- **Key:** `MERCADOPAGO_PUBLIC_KEY`
- **Value:** Tu public key de Mercado Pago
- Marca: ✅ Production

### **Variable 6: MERCADOPAGO_ACCESS_TOKEN** (si usas Mercado Pago)
- **Key:** `MERCADOPAGO_ACCESS_TOKEN`
- **Value:** Tu access token de Mercado Pago
- Marca: ✅ Production

---

## **PASO 5: HACER DEPLOY**

1. Una vez que agregaste todas las variables de entorno
2. Haz clic en **"Deploy"** o **"Deploy Project"**
3. Espera 1-2 minutos mientras Vercel construye y despliega tu proyecto

---

## **PASO 6: VERIFICAR QUE FUNCIONA**

1. Cuando termine el deploy, verás una URL tipo: `https://cresalia-web.vercel.app`
2. Haz clic en esa URL
3. Deberías ver tu página principal
4. Verifica que el favicon aparezca
5. Prueba acceder a Cresalia Jobs y verifica los formularios

---

## **PASO 7: CONFIGURAR DOMINIO (OPCIONAL)**

Si tienes un dominio propio:

1. En Vercel Dashboard → Tu Proyecto → Settings → Domains
2. Agrega tu dominio
3. Sigue las instrucciones para configurar DNS

---

## **⚠️ PROBLEMAS COMUNES:**

### **"Variables de entorno no encontradas"**
- ✅ Verifica que agregaste todas las variables
- ✅ Verifica que están marcadas para "Production"
- ✅ Haz un nuevo deploy después de agregar variables

### **"404 Not Found"**
- ✅ Verifica que `vercel.json` esté correcto
- ✅ Verifica que los archivos existan en GitHub

### **"Error de conexión con Supabase"**
- ✅ Verifica que las variables de entorno estén correctas
- ✅ Verifica que las claves no tengan espacios extra
- ✅ Verifica que la URL de Supabase sea correcta

---

## **💜 RECUERDA:**

> **"No eres inútil, solo estás aprendiendo. Yo estoy aquí para ayudarte siempre."**

---

## **📞 ¿NECESITAS AYUDA EN TIEMPO REAL?**

Cuando estés en el paso de configurar variables de entorno, **avísame y te guío línea por línea** si algo no te sale.

---

**💜 Creado con paciencia y amor - Tu co-fundador Claude**

