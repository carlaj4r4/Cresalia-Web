# 🔍 Cómo Obtener la URL de Supabase

## ❓ **El Problema:**
Solo ves el **Project ID** en Supabase, pero necesitas la **URL completa**.

---

## ✅ **Solución: La URL se Construye con el Project ID**

La URL de Supabase tiene este formato:
```
https://[TU-PROJECT-ID].supabase.co
```

### **Ejemplo:**
Si tu Project ID es: `zbomxayytvwjbdzbegcw`  
Tu URL será: `https://zbomxayytvwjbdzbegcw.supabase.co`

---

## 📍 **Dónde Encontrar el Project ID:**

### **Opción 1: En Supabase Dashboard**

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. En la sección **"Project API keys"**, verás:
   - **Project URL**: `https://[project-id].supabase.co` ← **ESTA ES LA QUE NECESITAS**
   - **Project ID**: `[project-id]` ← Este es solo el ID

**La URL completa ya está ahí!** Solo copia la que dice "Project URL".

---

### **Opción 2: Si Solo Ves el Project ID**

Si solo ves el Project ID (por ejemplo: `zbomxayytvwjbdzbegcw`), construye la URL así:

1. Toma tu Project ID
2. Agrégale `https://` al inicio
3. Agrégale `.supabase.co` al final

**Ejemplo:**
- Project ID: `zbomxayytvwjbdzbegcw`
- URL: `https://zbomxayytvwjbdzbegcw.supabase.co`

---

### **Opción 3: Buscar en tu Código**

Ya tienes la URL configurada en tu código! Déjame buscarla...

En el archivo `auth/supabase-config.js` debería estar tu URL. Si la encuentro, te la digo.

---

## 🔍 **Verificar que la URL es Correcta:**

La URL debe:
- ✅ Empezar con `https://`
- ✅ Contener tu Project ID
- ✅ Terminar con `.supabase.co`
- ✅ Ejemplo: `https://zbomxayytvwjbdzbegcw.supabase.co`

---

## 📸 **Dónde Está en Supabase Dashboard:**

```
Supabase Dashboard
│
├── Tu Proyecto
│   └── Settings
│       └── API
│           └── Project API keys
│               ├── Project URL ← 🎯 AQUÍ (ejemplo: https://xxx.supabase.co)
│               ├── Project ID ← Solo el ID
│               ├── anon public ← Esta es la anon key
│               └── service_role ← Esta es la service_role key (la que necesitas para el backup)
```

---

## 💡 **Si No Encuentras la URL:**

1. **Mira en tu código:**
   - Abre `auth/supabase-config.js`
   - Busca la línea que dice `url: 'https://...'`
   - Esa es tu URL!

2. **O construye la URL:**
   - Toma tu Project ID
   - Agrégale: `https://` + Project ID + `.supabase.co`

---

## ✅ **Resumen:**

**Para el secret `SUPABASE_URL` en GitHub:**
- Usa: `https://[tu-project-id].supabase.co`
- Ejemplo: `https://zbomxayytvwjbdzbegcw.supabase.co`

**Para el secret `SUPABASE_SERVICE_KEY`:**
- Usa la **service_role** key (la clave muy larga)
- Se encuentra en: Settings → API → Project API keys → service_role

---

¿Cuál es tu Project ID? Con eso puedo decirte exactamente cuál es tu URL! 💜

