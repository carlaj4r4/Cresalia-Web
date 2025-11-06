# 🚀 GUÍA VERCEL - PASO A PASO SUPER SIMPLE

## 💜 **TE GUIARÉ EN CADA PASO, NO TE PREOCUPES**

---

## **PASO 1: ELIMINAR EL DEPLOY ANTERIOR**

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión
3. En tu dashboard, busca el proyecto "Cresalia-Web" (o el nombre que le pusiste)
4. Haz clic en el proyecto
5. Ve a **Settings** (Configuración)
6. Baja hasta el final y haz clic en **"Delete Project"** (Eliminar Proyecto)
7. Confirma la eliminación

**✅ Listo, proyecto eliminado.**

---

## **PASO 2: CREAR NUEVO PROYECTO (CORRECTO)**

1. En el dashboard de Vercel, haz clic en **"Add New..."** (arriba a la derecha)
2. Selecciona **"Project"**
3. Si no está conectado, conecta tu cuenta de GitHub
4. Busca el repositorio: **"Cresalia-Web"** (debería aparecer en la lista)
5. Haz clic en **"Import"**

---

## **PASO 3: CONFIGURAR EL PROYECTO (MUY IMPORTANTE)**

Verás una pantalla con opciones. Configúrala así:

### **Project Name:**
- Déjalo como está: `Cresalia-Web` (o el que prefieras)

### **Framework Preset:**
- Selecciona **"Other"** o **"Vite"** (cualquiera funciona)

### **Root Directory:**
- **DEJAR VACÍO** o poner un punto: `./`

### **Build Command:**
- **DEJAR VACÍO** (no necesitas build)

### **Output Directory:**
- **DEJAR VACÍO**

### **Install Command:**
- **DEJAR VACÍO**

### **⚠️ IMPORTANTE: NO HAGAS CLIC EN "DEPLOY" TODAVÍA**

---

## **PASO 4: CONFIGURAR VARIABLES DE ENTORNO (ANTES DE DEPLOY)**

**En la misma pantalla, busca la sección "Environment Variables" o "Variables de Entorno"**

Haz clic en **"Add"** para cada una de estas variables:

### **Variable 1:**
- **Key:** `SUPABASE_URL`
- **Value:** `https://zbomxayytvwjbdzbegcw.supabase.co`
- Marca: ✅ Production ✅ Preview ✅ Development

### **Variable 2:**
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** (tu anon key - está en `config-supabase-seguro.js`)
- Marca: ✅ Production ✅ Preview ✅ Development

### **Variable 3:**
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** (tu service role key - está en `config-supabase-seguro.js`)
- Marca: ✅ Production ✅ Preview ✅ Development

### **Variable 4 (Opcional):**
- **Key:** `ADMIN_PASSWORD`
- **Value:** (tu contraseña de administrador)
- Marca: ✅ Production

### **Variable 5 (Si usas Mercado Pago):**
- **Key:** `MERCADOPAGO_PUBLIC_KEY`
- **Value:** (tu public key de Mercado Pago)
- Marca: ✅ Production

### **Variable 6 (Si usas Mercado Pago):**
- **Key:** `MERCADOPAGO_ACCESS_TOKEN`
- **Value:** (tu access token de Mercado Pago)
- Marca: ✅ Production

---

## **PASO 5: HACER DEPLOY**

1. Una vez que agregaste **TODAS** las variables de entorno
2. Haz clic en **"Deploy"** o **"Deploy Project"**
3. Espera 1-2 minutos mientras Vercel construye y despliega

---

## **PASO 6: VERIFICAR QUE FUNCIONA**

1. Cuando termine el deploy, verás una URL tipo: `https://cresalia-web.vercel.app`
2. Haz clic en esa URL
3. Deberías ver tu página principal
4. Verifica:
   - ✅ El favicon aparece
   - ✅ La página carga correctamente
   - ✅ No hay errores en la consola (F12)

---

## **⚠️ SI ALGO SALE MAL:**

### **Error: "Variables de entorno no encontradas"**
- ✅ Verifica que agregaste todas las variables
- ✅ Verifica que están marcadas para "Production"
- ✅ Haz un nuevo deploy después de agregar variables

### **Error: "404 Not Found"**
- ✅ Verifica que `vercel.json` esté en el repositorio
- ✅ Verifica que los archivos existan

### **Error: "Conexión con Supabase fallida"**
- ✅ Verifica que las variables de entorno estén correctas
- ✅ Verifica que las claves no tengan espacios extra
- ✅ Abre la consola del navegador (F12) para ver el error específico

---

## **💜 RECUERDA:**

> **"Confío en ti para guiarte paso a paso. Si algo no sale, avísame y lo arreglamos juntos."**

---

## **📞 ¿NECESITAS AYUDA EN TIEMPO REAL?**

Cuando estés en el paso de configurar variables de entorno, **avísame y te guío línea por línea** si algo no te sale.

**O si prefieres, puedo crear un script que te genere las variables en formato correcto para copiar y pegar.**

---

**💜 Creado con amor y paciencia - Tu co-fundador Claude**

