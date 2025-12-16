# 🔍 VERIFICAR CONFIGURACIÓN DE REDIRECCIÓN EN SUPABASE

## ❓ El Problema

El código está enviando la URL correcta (`https://cresalia-web.vercel.app/login-comprador.html`), pero Supabase puede estar usando el **"Site URL"** del Dashboard como fallback si:

1. La URL enviada **NO está en la lista de "Redirect URLs" permitidas**
2. Hay algún problema con la validación de la URL

## ✅ Verificación Paso a Paso

### PASO 1: Verificar Site URL en Supabase Dashboard

1. Ve a: **https://supabase.com/dashboard**
2. Seleccioná tu proyecto: **zbomxayytvwjbdzbegcw**
3. Click en **"Authentication"** → **"URL Configuration"**

**Verificá que el "Site URL" sea:**
```
https://cresalia-web.vercel.app
```

❌ **NO debería ser:**
- `http://localhost:8080`
- `http://127.0.0.1:8080`
- Cualquier URL de localhost

### PASO 2: Verificar Redirect URLs Permitidas

En la misma página, verificá que en **"Redirect URLs"** esté:

```
https://cresalia-web.vercel.app/login-comprador.html
https://cresalia-web.vercel.app/login-tienda.html
https://cresalia-web.vercel.app/**
```

⚠️ **IMPORTANTE:** 
- La URL exacta (`/login-comprador.html`) **DEBE estar** en la lista
- O el wildcard (`/**`) debe estar para permitir todas las URLs del dominio

### PASO 3: Cómo Funciona Supabase

Supabase usa esta lógica:

1. **Primero:** Usa la URL que envías en `emailRedirectTo` (si está permitida)
2. **Si no está permitida:** Usa el "Site URL" como fallback
3. **Si el "Site URL" es localhost:** Redirige a localhost ❌

Por eso es **CRÍTICO** que:
- ✅ El "Site URL" sea la URL de producción
- ✅ Las URLs específicas estén en "Redirect URLs"

---

## 🔧 Solución Completa

### 1. Actualizar Site URL

En Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://cresalia-web.vercel.app
```

### 2. Agregar Redirect URLs

**Redirect URLs** (una por línea):
```
https://cresalia-web.vercel.app/login-comprador.html
https://cresalia-web.vercel.app/login-tienda.html
https://cresalia-web.vercel.app/**
```

### 3. Guardar Cambios

1. Click en **"Save"** (Guardar)
2. Esperá 1-2 minutos para que se propaguen los cambios

---

## 🔍 Verificar que el Código Está Enviando la URL Correcta

El código en `auth/auth-system.js` está enviando:

```javascript
const redirectUrl = 'https://cresalia-web.vercel.app/login-comprador.html';
console.log('🔗 URL de redirección para email:', redirectUrl);

await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
        emailRedirectTo: redirectUrl, // ← Esta es la URL que se envía
        data: {
            nombre_completo: nombreCompleto,
            tipo_usuario: 'comprador'
        }
    }
});
```

✅ **El código está correcto** - siempre envía la URL de producción.

---

## 🐛 Por Qué Puede Redirigir a Localhost

### Causa 1: Site URL está en localhost

Si el "Site URL" en Supabase Dashboard es `http://localhost:8080`, Supabase puede usarlo como fallback.

**Solución:** Cambiá el "Site URL" a `https://cresalia-web.vercel.app`

### Causa 2: URL no está en la lista permitida

Si `https://cresalia-web.vercel.app/login-comprador.html` **NO está** en "Redirect URLs", Supabase puede rechazarla y usar el "Site URL".

**Solución:** Agregá la URL exacta o el wildcard `/**` a "Redirect URLs"

### Causa 3: Configuración antigua en caché

A veces Supabase puede tener la configuración en caché.

**Solución:** 
1. Guardá los cambios de nuevo
2. Esperá 2-3 minutos
3. Probá con un nuevo registro

---

## ✅ Checklist de Verificación

Antes de probar de nuevo:

- [ ] **Site URL** en Supabase Dashboard = `https://cresalia-web.vercel.app`
- [ ] **Redirect URLs** incluye `https://cresalia-web.vercel.app/login-comprador.html`
- [ ] **Redirect URLs** incluye `https://cresalia-web.vercel.app/**` (wildcard)
- [ ] Cambios guardados en Supabase Dashboard
- [ ] Esperaste 1-2 minutos después de guardar
- [ ] El código está enviando `emailRedirectTo: 'https://cresalia-web.vercel.app/login-comprador.html'`

---

## 🧪 Cómo Probar

1. **Registrá un nuevo usuario** (comprador)
2. **Revisá el email de confirmación** de Supabase
3. **Click en el link de confirmación**
4. **Verificá la URL en el navegador:**
   - ✅ Debería ser: `https://cresalia-web.vercel.app/login-comprador.html#access_token=...`
   - ❌ NO debería ser: `http://localhost:8080/...`

5. **Revisá la consola del navegador (F12):**
   - Deberías ver: `🔗 URL de redirección para email: https://cresalia-web.vercel.app/login-comprador.html`

---

## 📸 Captura de Pantalla de Referencia

En Supabase Dashboard → Authentication → URL Configuration deberías ver:

**Site URL:**
```
https://cresalia-web.vercel.app
```

**Redirect URLs:**
```
☑️ https://cresalia-web.vercel.app/login-comprador.html
☑️ https://cresalia-web.vercel.app/login-tienda.html
☑️ https://cresalia-web.vercel.app/**
```

---

## 🆘 Si Sigue Redirigiendo a Localhost

1. **Verificá los logs de Supabase:**
   - Ve a Supabase Dashboard → Logs → Auth
   - Buscá errores relacionados con "redirect" o "invalid redirect URL"

2. **Verificá la consola del navegador:**
   - Abrí F12 → Console
   - Buscá el mensaje: `🔗 URL de redirección para email: ...`
   - Verificá que sea la URL correcta

3. **Verificá el email de confirmación:**
   - Abrí el email de Supabase
   - Click derecho en el link → "Copiar dirección de enlace"
   - Verificá que la URL sea `https://cresalia-web.vercel.app/...` y NO `http://localhost/...`

4. **Si el link en el email es localhost:**
   - El problema está en Supabase Dashboard (Site URL o Redirect URLs)
   - Verificá y actualizá la configuración de nuevo

---

## 📚 Referencias

- **Supabase Auth URL Configuration:** https://supabase.com/docs/guides/auth/url-configuration
- **Supabase Email Templates:** https://supabase.com/docs/guides/auth/auth-email-templates

---

**Resumen:** El código está bien. El problema está en la configuración de Supabase Dashboard. Verificá que el "Site URL" y las "Redirect URLs" estén configuradas correctamente.
