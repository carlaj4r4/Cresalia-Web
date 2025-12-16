# 🔧 Solución: Problema con Keys Legacy de Supabase

## 🚨 El Problema

Estás viendo el error "Invalid API key" aunque:
- ✅ Copiaste la key exactamente como aparece en Supabase
- ✅ Probaste con keys de "publishable" y "legacy"
- ✅ La key tiene el formato correcto (empieza con `eyJhbGciOi...`)

## 🔍 Diagnóstico

Supabase tiene diferentes tipos de keys:

### 1. **Keys Publishable (anon public)**
- Ubicación: Supabase Dashboard → Settings → API → **"Project API keys"** → `anon` `public`
- Formato: JWT (empieza con `eyJhbGciOi...`)
- Uso: Para cliente (frontend)
- Longitud: ~200-250 caracteres

### 2. **Keys Service Role (secret)**
- Ubicación: Supabase Dashboard → Settings → API → **"Project API keys"** → `service_role` `secret`
- Formato: JWT (empieza con `eyJhbGciOi...`)
- Uso: Para servidor (backend) - **MÁS PERMISOS**
- Longitud: ~200-250 caracteres

### 3. **Keys Legacy**
- Ubicación: Supabase Dashboard → Settings → API → **"Legacy keys"**
- Formato: Puede ser diferente
- Uso: Para compatibilidad con versiones antiguas
- ⚠️ **Puede tener formato diferente o requerir configuración especial**

---

## ✅ Solución Paso a Paso

### Paso 1: Identificar qué Key Necesitás

Para **servidor (Vercel API endpoints)**, necesitás:
- ✅ **`SUPABASE_SERVICE_ROLE_KEY`** (recomendado) - Tiene más permisos
- O **`SUPABASE_ANON_KEY`** (alternativa) - Menos permisos, puede tener problemas con RLS

### Paso 2: Obtener la Key Correcta

1. Ve a **Supabase Dashboard** → Tu Proyecto → **Settings** → **API**

2. **Si usás SERVICE_ROLE_KEY:**
   - Buscá la sección **"Project API keys"**
   - Copiá la key de **`service_role`** (marcada como `secret`)
   - ⚠️ **NO** uses la key de "Legacy keys" a menos que sea absolutamente necesario

3. **Si usás ANON_KEY:**
   - Buscá la sección **"Project API keys"**
   - Copiá la key de **`anon`** (marcada como `public`)
   - ⚠️ **NO** uses la key de "Legacy keys"

### Paso 3: Verificar el Formato

La key debe:
- ✅ Empezar con `eyJhbGciOi...` (formato JWT)
- ✅ Tener 3 partes separadas por puntos (`.`)
- ✅ Tener ~200-250 caracteres de longitud
- ✅ **NO** tener espacios al inicio o final

### Paso 4: Si Tenés que Usar Legacy Keys

Si **solo** tenés acceso a Legacy keys:

1. **Verificá el formato:**
   - Legacy keys pueden tener formato diferente
   - Pueden ser más cortas o más largas
   - Pueden no empezar con `eyJ`

2. **Configurá en Vercel:**
   - Agregá la key legacy como `SUPABASE_SERVICE_ROLE_KEY`
   - O como `SUPABASE_ANON_KEY` si es la única opción

3. **Verificá en los logs:**
   - Los logs ahora detectan si es formato legacy
   - Te dirán si hay problemas con el formato

---

## 🔍 Verificar que la Key Funciona

### Opción 1: Desde los Logs de Vercel

Después del deploy, los logs mostrarán:

```
🔍 [DEBUG] Key formato JWT válido: true/false
🔍 [DEBUG] Key formato Legacy: true/false
🔍 [DEBUG] Usando SERVICE_ROLE_KEY: true/false
```

### Opción 2: Probar Manualmente

Podés probar la key directamente con curl:

```bash
# Reemplazá con tu URL y key
curl -H "apikey: TU_KEY_AQUI" \
     -H "Authorization: Bearer TU_KEY_AQUI" \
     "https://TU_PROYECTO.supabase.co/rest/v1/historias_corazon_cresalia?select=id&limit=1"
```

Si funciona, deberías recibir JSON. Si no, recibirás un error.

---

## ⚠️ Problemas Comunes

### Problema 1: Key de Otro Proyecto

**Síntoma:** Key tiene formato correcto pero Supabase dice "Invalid API key"

**Solución:**
- Verificá que la `SUPABASE_URL` y la key sean del **mismo proyecto**
- La URL debe ser: `https://TU_PROYECTO.supabase.co`
- La key debe ser del mismo proyecto

### Problema 2: Key Legacy con Formato Diferente

**Síntoma:** Key no tiene formato JWT (no empieza con `eyJ`)

**Solución:**
- Los logs ahora detectan keys legacy
- El código intentará usar la key de todas formas
- Si sigue fallando, puede que necesites regenerar las keys en Supabase

### Problema 3: Key Revocada o Regenerada

**Síntoma:** Key funcionaba antes pero ahora no

**Solución:**
- Si regeneraste las keys en Supabase, la antigua ya no funciona
- Copiá la nueva key desde Supabase Dashboard
- Actualizá en Vercel
- Hacé un nuevo deploy

### Problema 4: Key con Espacios o Caracteres Extra

**Síntoma:** Key parece correcta pero no funciona

**Solución:**
- Copiá la key en un editor de texto
- Eliminá cualquier espacio al inicio o final
- Verificá que no tenga saltos de línea
- Pegala en Vercel sin espacios

---

## 📋 Checklist de Verificación

Antes de reportar el problema, verificá:

- [ ] La key es de la sección **"Project API keys"** (no Legacy)
- [ ] Si usás SERVICE_ROLE_KEY, es la key de `service_role` (secret)
- [ ] Si usás ANON_KEY, es la key de `anon` (public)
- [ ] La key empieza con `eyJhbGciOi...` (formato JWT)
- [ ] La key tiene ~200-250 caracteres
- [ ] La key **NO** tiene espacios al inicio o final
- [ ] La `SUPABASE_URL` y la key son del **mismo proyecto**
- [ ] La variable está en **Production** en Vercel
- [ ] Hiciste un **nuevo deploy** después de agregar/cambiar la variable
- [ ] Revisaste los logs de Vercel para ver el diagnóstico detallado

---

## 🆘 Si Sigue Sin Funcionar

1. **Regenerá las keys en Supabase:**
   - Ve a Supabase Dashboard → Settings → API
   - Click en "Reset" o "Regenerate" para la key que necesitás
   - ⚠️ Esto invalidará la key anterior

2. **Copiá la nueva key:**
   - Copiala exactamente como aparece
   - Sin espacios

3. **Actualizá en Vercel:**
   - Vercel Dashboard → Settings → Environment Variables
   - Editá la variable
   - Pegá la nueva key
   - Guardá

4. **Hacé un nuevo deploy:**
   - Push a GitHub o redeploy manual
   - Esperá a que termine

5. **Revisá los logs:**
   - Los logs ahora tienen diagnóstico detallado
   - Te dirán exactamente qué está mal

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
