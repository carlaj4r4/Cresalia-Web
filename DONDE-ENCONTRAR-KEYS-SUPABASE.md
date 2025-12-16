# 🔑 Dónde Encontrar las Keys Correctas en Supabase

## 🚨 Aclaración Importante

**TODAS las keys modernas de Supabase empiezan con `eyJhbGciOi...`** (formato JWT).

No solo las keys "Legacy" empiezan así. Las keys modernas también.

---

## 📍 Dónde Están las Keys

### Sección 1: "Project API keys" (MODERNAS - ✅ USAR ESTAS)

**Ubicación:** Supabase Dashboard → Settings → API → **"Project API keys"**

Aquí encontrarás:

1. **`anon` `public`** (para `SUPABASE_ANON_KEY`)
   - ✅ Empieza con `eyJhbGciOi...`
   - ✅ Formato JWT válido
   - ✅ Longitud: ~200-250 caracteres
   - ✅ Es pública (puede usarse en cliente)

2. **`service_role` `secret`** (para `SUPABASE_SERVICE_ROLE_KEY`)
   - ✅ Empieza con `eyJhbGciOi...`
   - ✅ Formato JWT válido
   - ✅ Longitud: ~200-250 caracteres
   - ⚠️ Es secreta (solo servidor)

### Sección 2: "Legacy keys" (ANTIGUAS - ⚠️ Solo si es necesario)

**Ubicación:** Supabase Dashboard → Settings → API → **"Legacy keys"**

- ⚠️ Keys antiguas (pueden tener formato diferente)
- ⚠️ Solo usar si las modernas no funcionan
- ⚠️ Pueden tener formato diferente o requerir configuración especial

---

## ✅ Qué Keys Usar

### Para Servidor (Vercel API endpoints)

**Recomendado:**
- `SUPABASE_SERVICE_ROLE_KEY` → Key de **`service_role`** de "Project API keys"
- ✅ Empieza con `eyJhbGciOi...`
- ✅ Formato JWT válido

**Alternativa:**
- `SUPABASE_ANON_KEY` → Key de **`anon`** de "Project API keys"
- ✅ Empieza con `eyJhbGciOi...`
- ✅ Formato JWT válido

### ⚠️ NO Usar Legacy Keys

A menos que sea absolutamente necesario, **NO uses las keys de "Legacy keys"**.

Las keys modernas de "Project API keys" son las correctas y empiezan con `eyJhbGciOi...`.

---

## 🔍 Cómo Identificar si es la Key Correcta

### ✅ Key Correcta (Project API keys)

- ✅ Está en la sección **"Project API keys"**
- ✅ Empieza con `eyJhbGciOi...`
- ✅ Tiene 3 partes separadas por puntos (formato JWT)
- ✅ Longitud: ~200-250 caracteres
- ✅ Tiene label "public" (anon) o "secret" (service_role)

### ⚠️ Key Legacy

- ⚠️ Está en la sección **"Legacy keys"**
- ⚠️ Puede tener formato diferente
- ⚠️ Puede no empezar con `eyJ`
- ⚠️ Solo usar si las modernas no funcionan

---

## 📋 Pasos para Configurar

### Paso 1: Encontrar las Keys Correctas

1. Ve a **Supabase Dashboard** → Tu Proyecto → **Settings** → **API**

2. Buscá la sección **"Project API keys"** (NO "Legacy keys")

3. Para `SUPABASE_SERVICE_ROLE_KEY`:
   - Buscá la fila con **`service_role`** y label **`secret`**
   - Click en el ícono de copiar o "Reveal"
   - Copiá la key completa

4. Para `SUPABASE_ANON_KEY` (alternativa):
   - Buscá la fila con **`anon`** y label **`public`**
   - Click en el ícono de copiar
   - Copiá la key completa

### Paso 2: Verificar el Formato

La key debe:
- ✅ Empezar con `eyJhbGciOi...`
- ✅ Tener 3 partes separadas por puntos
- ✅ Tener ~200-250 caracteres
- ✅ **NO** tener espacios al inicio o final

### Paso 3: Configurar en Vercel

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

2. Agregá o editá:

   **`SUPABASE_URL`**
   - Value: `https://TU_PROJECT_ID.supabase.co`
   - Environment: ✅ Production, ✅ Preview

   **`SUPABASE_SERVICE_ROLE_KEY`**
   - Value: La key de `service_role` (de "Project API keys")
   - Environment: ✅ Production, ✅ Preview
   - ⚠️ **NO** marques "Expose to Browser"

3. Guardá y hacé un nuevo deploy

---

## 🚨 Problema Actual: URL No Detectada

Si los logs muestran:

```
hasUrl: false
```

**Causas posibles:**

1. **La variable no está configurada en Vercel**
   - Verificá que exista `SUPABASE_URL` en Vercel
   - Asegurate de que esté en **Production**

2. **La variable tiene otro nombre**
   - Debe llamarse exactamente: `SUPABASE_URL`
   - Sin `NEXT_PUBLIC_` para variables de servidor

3. **No hiciste deploy después de agregar la variable**
   - Las variables solo se aplican en nuevos deploys
   - Hacé un nuevo deploy después de agregar/cambiar variables

---

## 🔧 Solución para el Error Actual

### Paso 1: Verificar Variables en Vercel

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

2. Verificá que existan estas variables:
   - ✅ `SUPABASE_URL` (sin `NEXT_PUBLIC_`)
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` (sin `NEXT_PUBLIC_`)

3. Si no existen, agregalas:
   - `SUPABASE_URL` → `https://TU_PROJECT_ID.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` → Key de `service_role` de "Project API keys"

### Paso 2: Verificar que Estén en Production

- Asegurate de que las variables estén marcadas para **Production**
- (Preview y Development son opcionales)

### Paso 3: Hacer un Nuevo Deploy

- Push a GitHub o redeploy manual
- Las variables solo se aplican en nuevos deploys

### Paso 4: Revisar los Logs

Después del deploy, los logs deberían mostrar:

```
🔍 [DEBUG] Variables encontradas: {
  hasUrl: true,
  urlLength: 40,
  ...
}
```

Si sigue mostrando `hasUrl: false`, la variable no está configurada correctamente en Vercel.

---

## 📝 Resumen

- ✅ **Usá las keys de "Project API keys"** (NO Legacy)
- ✅ **Todas las keys modernas empiezan con `eyJhbGciOi...`**
- ✅ **`service_role`** para `SUPABASE_SERVICE_ROLE_KEY`
- ✅ **`anon`** para `SUPABASE_ANON_KEY`
- ✅ **Verificá que `SUPABASE_URL` esté configurada en Vercel**
- ✅ **Hacé un nuevo deploy después de cambiar variables**

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
