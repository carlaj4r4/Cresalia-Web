# 🔑 Aclaración: Formatos de Keys en Supabase

## 🚨 El Problema

Supabase tiene **DOS formatos diferentes** de keys, y esto puede ser confuso:

1. **Keys Modernas (Publishable)**: Empiezan con `sb_`
2. **Keys Legacy (JWT)**: Empiezan con `eyJ`

---

## 📍 Dónde Están las Keys

### Sección 1: "Project API keys" (Publishable)

**Ubicación:** Supabase Dashboard → Settings → API → **"Project API keys"**

**Formato:**
- ✅ Empiezan con `sb_`
- ✅ Son las keys **modernas** de Supabase
- ✅ Ejemplo: `sb_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Keys disponibles:**
- `anon` `public` → Para `SUPABASE_ANON_KEY`
- `service_role` `secret` → Para `SUPABASE_SERVICE_ROLE_KEY`

### Sección 2: "Legacy keys"

**Ubicación:** Supabase Dashboard → Settings → API → **"Legacy keys"**

**Formato:**
- ✅ Empiezan con `eyJhbGciOi...` (formato JWT)
- ✅ Son las keys **legacy** (antiguas)
- ✅ Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Keys disponibles:**
- `anon` → Para `SUPABASE_ANON_KEY`
- `service_role` → Para `SUPABASE_SERVICE_ROLE_KEY`

---

## ✅ Qué Keys Usar

### Ambas Funcionan

**Ambos formatos deberían funcionar** con el código actualizado:

- ✅ **Keys modernas (`sb_`)**: Funcionan con `createClient` estándar
- ✅ **Keys legacy (`eyJ`)**: También funcionan con `createClient` estándar

### Recomendación

1. **Primero probá con las keys modernas (`sb_`)** de "Project API keys"
   - Son las keys actuales de Supabase
   - Están en la sección principal

2. **Si no funcionan, probá con las keys legacy (`eyJ`)** de "Legacy keys"
   - Son las keys antiguas pero aún funcionan
   - Pueden ser necesarias en algunos casos

---

## 🔧 Cómo Configurar

### Paso 1: Elegir las Keys

**Opción A: Keys Modernas (Recomendado)**
1. Ve a **Settings → API → "Project API keys"**
2. Para `SUPABASE_SERVICE_ROLE_KEY`: Copiá la key de `service_role` (empieza con `sb_`)
3. Para `SUPABASE_ANON_KEY`: Copiá la key de `anon` (empieza con `sb_`)

**Opción B: Keys Legacy (Si las modernas no funcionan)**
1. Ve a **Settings → API → "Legacy keys"**
2. Para `SUPABASE_SERVICE_ROLE_KEY`: Copiá la key de `service_role` (empieza con `eyJ`)
3. Para `SUPABASE_ANON_KEY`: Copiá la key de `anon` (empieza con `eyJ`)

### Paso 2: Configurar en Vercel

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

2. Agregá:

   **`SUPABASE_URL`**
   - Value: `https://TU_PROJECT_ID.supabase.co`
   - Environment: ✅ Production

   **`SUPABASE_SERVICE_ROLE_KEY`**
   - Value: La key (puede ser `sb_...` o `eyJ...`)
   - Environment: ✅ Production
   - ⚠️ **NO** marques "Expose to Browser"

3. Guardá y hacé un nuevo deploy

### Paso 3: Verificar en los Logs

Después del deploy, los logs mostrarán:

```
🔍 [DEBUG] Key empieza con: sb_xxxx o eyJhb...
🔍 [DEBUG] Key formato Moderno (sb_): true/false
🔍 [DEBUG] Key formato Legacy JWT (eyJ): true/false
```

Esto te dirá qué formato de key estás usando.

---

## 🔍 Identificar el Formato

### Key Moderna (`sb_`)

- ✅ Empieza con `sb_`
- ✅ Está en "Project API keys"
- ✅ Ejemplo: `sb_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Key Legacy (`eyJ`)

- ✅ Empieza con `eyJhbGciOi...`
- ✅ Está en "Legacy keys"
- ✅ Formato JWT (3 partes separadas por puntos)
- ✅ Ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...`

---

## ⚠️ Problemas Comunes

### Problema 1: "Invalid API key" con keys modernas

**Solución:**
- Probá con las keys legacy (`eyJ`) de "Legacy keys"
- Algunos proyectos pueden necesitar las keys legacy

### Problema 2: "Invalid API key" con keys legacy

**Solución:**
- Probá con las keys modernas (`sb_`) de "Project API keys"
- Verificá que la key no tenga espacios

### Problema 3: No sé cuál usar

**Solución:**
- **Empezá con las keys modernas (`sb_`)** de "Project API keys"
- Si no funcionan, probá con las keys legacy (`eyJ`) de "Legacy keys"
- El código ahora soporta ambos formatos

---

## 📋 Resumen

- ✅ **Keys modernas (`sb_`)**: En "Project API keys" - **Probar primero**
- ✅ **Keys legacy (`eyJ`)**: En "Legacy keys" - **Probar si las modernas no funcionan**
- ✅ **Ambas funcionan**: El código ahora soporta ambos formatos
- ✅ **Los logs te dirán**: Qué formato de key estás usando

---

## 🆘 Si Sigue Sin Funcionar

1. **Verificá que la URL y la key sean del mismo proyecto**
   - Los logs mostrarán los Project IDs
   - Deben coincidir

2. **Probá con ambas secciones de keys**
   - Primero "Project API keys" (modernas)
   - Luego "Legacy keys" (legacy)

3. **Verificá que no haya espacios**
   - Copiá la key en un editor de texto
   - Eliminá espacios al inicio/final

4. **Hacé un nuevo deploy**
   - Las variables solo se aplican en nuevos deploys

5. **Revisá los logs**
   - Te dirán exactamente qué formato de key estás usando
   - Y si hay algún problema

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
