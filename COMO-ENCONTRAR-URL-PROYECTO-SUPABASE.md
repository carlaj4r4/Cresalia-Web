# 🔍 Cómo Encontrar la URL de tu Proyecto en Supabase

## 🚨 El Problema

Solo ves el **Project ID** en Supabase Dashboard, pero necesitás la **URL completa** para configurarla en Vercel.

---

## ✅ Solución: Cómo Encontrar la URL

### Método 1: Desde Settings → API (Más Fácil)

1. Ve a **Supabase Dashboard** → Tu Proyecto
2. Click en **Settings** (⚙️) en el menú lateral
3. Click en **API** en el submenú
4. Buscá la sección **"Project URL"** o **"Config"**
5. Ahí verás:
   ```
   Project URL: https://TU_PROJECT_ID.supabase.co
   ```
6. **Copiá esa URL completa** (incluye `https://` y `.supabase.co`)

### Método 2: Construir la URL desde el Project ID

Si solo tenés el **Project ID** (por ejemplo: `zbomxayytvwjbdzbegcw`):

1. La URL será:
   ```
   https://TU_PROJECT_ID.supabase.co
   ```
2. Ejemplo:
   - Project ID: `zbomxayytvwjbdzbegcw`
   - URL: `https://zbomxayytvwjbdzbegcw.supabase.co`

### Método 3: Desde la URL del Dashboard

1. Cuando estás en Supabase Dashboard, mirá la URL del navegador
2. Debería ser algo como:
   ```
   https://app.supabase.com/project/zbomxayytvwjbdzbegcw
   ```
3. El **Project ID** es la parte después de `/project/`
4. Construí la URL: `https://TU_PROJECT_ID.supabase.co`

---

## 🔍 Verificar que la URL y la Key Coincidan

### Paso 1: Obtener la URL

- Ve a **Settings → API → Project URL**
- O construila desde el Project ID: `https://TU_PROJECT_ID.supabase.co`

### Paso 2: Obtener la Key

- Ve a **Settings → API → Project API keys**
- Copiá la key de **`service_role`** (secret) para `SUPABASE_SERVICE_ROLE_KEY`
- O la key de **`anon`** (public) para `SUPABASE_ANON_KEY`

### Paso 3: Verificar que Coincidan

**IMPORTANTE:** La URL y la key **DEBEN** ser del mismo proyecto.

- ✅ **Correcto:**
  - URL: `https://zbomxayytvwjbdzbegcw.supabase.co`
  - Key: Debe ser del proyecto `zbomxayytvwjbdzbegcw`

- ❌ **Incorrecto:**
  - URL: `https://proyecto1.supabase.co`
  - Key: Del proyecto `proyecto2` (diferente)

---

## 🔧 Configurar en Vercel

### Paso 1: Agregar Variables

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

2. Agregá estas variables:

   **`SUPABASE_URL`**
   - Value: `https://TU_PROJECT_ID.supabase.co`
   - Environment: ✅ Production, ✅ Preview

   **`SUPABASE_SERVICE_ROLE_KEY`** (recomendado)
   - Value: La key de `service_role` (secret)
   - Environment: ✅ Production, ✅ Preview
   - ⚠️ **NO** marques "Expose to Browser"

   O alternativamente:

   **`SUPABASE_ANON_KEY`**
   - Value: La key de `anon` (public)
   - Environment: ✅ Production, ✅ Preview
   - ⚠️ **NO** marques "Expose to Browser"

### Paso 2: Verificar

Después del deploy, los logs mostrarán:

```
🔍 [DEBUG] URL completa: https://TU_PROJECT_ID.supabase.co
🔍 [DEBUG] Project ID de URL: TU_PROJECT_ID
🔍 [DEBUG] Project ID de Key: TU_PROJECT_ID
```

Si los Project IDs **coinciden**, está bien. Si **no coinciden**, hay un problema.

---

## ⚠️ Si la URL y la Key No Coinciden

Si los logs muestran:

```
❌ ERROR CRÍTICO: La URL y la Key son de proyectos diferentes!
   - Project ID de URL: proyecto1
   - Project ID de Key: proyecto2
```

**Solución:**

1. Verificá en Supabase Dashboard:
   - ¿Qué proyecto estás usando?
   - ¿La key es de ese mismo proyecto?

2. Si tenés múltiples proyectos:
   - Asegurate de usar la URL y la key del **mismo proyecto**
   - No mezcles proyectos diferentes

3. Si regeneraste las keys:
   - Asegurate de usar la key **nueva** del mismo proyecto
   - La key antigua ya no funciona

---

## 🔐 Seguridad: No Exponer las Keys

**IMPORTANTE:** Recordá que una vez tuvimos que cambiar todo porque se expusieron las claves.

### ✅ Correcto (Servidor)

- `SUPABASE_URL` → Sin prefijo (solo servidor)
- `SUPABASE_SERVICE_ROLE_KEY` → Sin prefijo (solo servidor)
- `SUPABASE_ANON_KEY` → Sin prefijo (solo servidor)

### ❌ Incorrecto (Nunca Hacer)

- `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` → ❌ NUNCA (se expone en el cliente)
- `NEXT_PUBLIC_SUPABASE_URL` → ✅ OK (la URL es pública)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → ✅ OK (la anon key es pública por diseño)

### 📋 Regla General

- **SERVICE_ROLE_KEY**: ⚠️ **NUNCA** con `NEXT_PUBLIC_` (es secreta)
- **ANON_KEY**: ✅ Puede tener `NEXT_PUBLIC_` (es pública por diseño)
- **URL**: ✅ Puede tener `NEXT_PUBLIC_` (es pública)

---

## 🆘 Si Sigue Sin Funcionar

1. **Verificá que la URL y la key sean del mismo proyecto:**
   - Los logs ahora muestran los Project IDs
   - Deben coincidir

2. **Regenerá las keys:**
   - Ve a Supabase Dashboard → Settings → API
   - Click en "Reset" o "Regenerate" para la key que necesitás
   - ⚠️ Esto invalidará la key anterior

3. **Actualizá en Vercel:**
   - Copiá la nueva key (sin espacios)
   - Actualizá la variable en Vercel
   - Hacé un nuevo deploy

4. **Revisá los logs:**
   - Los logs ahora muestran si la URL y la key coinciden
   - Te dirán exactamente qué está mal

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
