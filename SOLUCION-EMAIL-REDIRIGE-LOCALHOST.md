# 🔧 SOLUCIÓN: EMAIL SIGUE REDIRIGIENDO A LOCALHOST

## ✅ Configuración Verificada

Tu configuración en Supabase Dashboard está correcta:
- ✅ **Site URL:** `https://cresalia-web.vercel.app`
- ✅ **Redirect URLs:** Incluye las URLs necesarias

Pero el email **sigue redirigiendo a localhost**. Esto puede ser por:

---

## 🔍 Causa Más Probable: Email Template

Los **Email Templates** de Supabase pueden tener hardcodeado `localhost` o usar una variable de template que apunta a localhost.

### PASO 1: Verificar Email Templates

1. Ve a Supabase Dashboard → **Authentication** → **Email Templates**
2. Click en **"Confirm signup"** (Confirmar registro)
3. Revisá el contenido del template

### PASO 2: Buscar Referencias a Localhost

En el template, buscá:
- `http://localhost`
- `127.0.0.1`
- `{{ .SiteURL }}` (si está configurado mal)
- Cualquier URL que no sea `https://cresalia-web.vercel.app`

### PASO 3: Usar Variable de Template Correcta

Supabase tiene estas variables de template disponibles:
- `{{ .SiteURL }}` - Usa el "Site URL" configurado
- `{{ .RedirectTo }}` - Usa la URL que envías en `emailRedirectTo`

**El template debería usar:**
```
{{ .RedirectTo }}
```

O si querés usar el Site URL:
```
{{ .SiteURL }}/login-comprador.html
```

**NO debería tener:**
```
http://localhost:8080/login-comprador.html
```

---

## 🔧 Solución: Actualizar Email Template

### Template Correcto para "Confirm signup"

```html
<h2>Confirma tu email</h2>

<p>Hacé click en el siguiente link para confirmar tu cuenta:</p>

<p><a href="{{ .ConfirmationURL }}">Confirmar email</a></p>

<p>O copiá y pegá este link en tu navegador:</p>
<p>{{ .ConfirmationURL }}</p>
```

**IMPORTANTE:** Usá `{{ .ConfirmationURL }}` - esta variable **automáticamente** incluye:
- La URL de redirección que envías en `emailRedirectTo`
- O el Site URL si no enviaste una
- El token de confirmación

**NO hardcodees ninguna URL** en el template.

---

## 🔍 Otra Causa Posible: Caché de Supabase

A veces Supabase puede tener la configuración en caché.

### Solución:

1. **Guardá los cambios de nuevo** en URL Configuration
2. **Esperá 3-5 minutos** (no solo 1-2)
3. **Probá con un nuevo registro** (no uses un email que ya registraste)

---

## 🧪 Cómo Verificar el Problema

### 1. Revisar el Email Recibido

1. Registrá un nuevo usuario
2. Abrí el email de confirmación de Supabase
3. **Click derecho** en el link → **"Copiar dirección de enlace"**
4. Pegalo en un editor de texto
5. Verificá la URL:
   - ✅ Debería ser: `https://cresalia-web.vercel.app/login-comprador.html?token=...`
   - ❌ NO debería ser: `http://localhost:8080/...`

### 2. Revisar la Consola del Navegador

1. Abrí la consola (F12) antes de registrar
2. Buscá el mensaje: `🔗 URL de redirección para email: ...`
3. Verificá que sea: `https://cresalia-web.vercel.app/login-comprador.html`

### 3. Verificar Logs de Supabase

1. Ve a Supabase Dashboard → **Logs** → **Auth**
2. Buscá eventos de "signup" recientes
3. Revisá si hay errores relacionados con "redirect" o "invalid redirect URL"

---

## 📋 Checklist Completo

- [ ] Site URL = `https://cresalia-web.vercel.app` ✅
- [ ] Redirect URLs incluyen las URLs necesarias ✅
- [ ] **Email Template NO tiene localhost hardcodeado** ⚠️ VERIFICAR
- [ ] **Email Template usa `{{ .ConfirmationURL }}` o `{{ .RedirectTo }}`** ⚠️ VERIFICAR
- [ ] Cambios guardados en Supabase Dashboard
- [ ] Esperaste 3-5 minutos después de guardar
- [ ] Probaste con un **nuevo registro** (no email existente)

---

## 🆘 Si Nada Funciona

### Opción 1: Verificar Variable de Template

En el Email Template, asegurate de usar:

```html
<a href="{{ .ConfirmationURL }}">Confirmar email</a>
```

**NO uses:**
```html
<a href="http://localhost:8080/login-comprador.html?token={{ .Token }}">Confirmar</a>
```

### Opción 2: Verificar que el Código Envíe la URL

En la consola del navegador, cuando registres un usuario, deberías ver:

```
🔗 URL de redirección para email: https://cresalia-web.vercel.app/login-comprador.html
```

Si ves otra URL, el problema está en el código (pero ya verificamos que está bien).

### Opción 3: Contactar Soporte de Supabase

Si después de verificar todo sigue redirigiendo a localhost:
1. Ve a Supabase Dashboard → **Support**
2. Explicá el problema
3. Mencioná que el Site URL y Redirect URLs están correctos
4. Pedí que verifiquen si hay alguna configuración oculta o caché

---

## 📸 Qué Buscar en el Email Template

En Supabase Dashboard → Authentication → Email Templates → "Confirm signup":

**✅ CORRECTO:**
```html
<a href="{{ .ConfirmationURL }}">Confirmar</a>
```

**❌ INCORRECTO:**
```html
<a href="http://localhost:8080/login-comprador.html?token={{ .Token }}">Confirmar</a>
<a href="{{ .SiteURL }}/login-comprador.html?token={{ .Token }}">Confirmar</a>
<!-- Si .SiteURL está mal configurado -->
```

---

**Resumen:** Tu configuración de URLs está bien. El problema probablemente está en el **Email Template** que tiene localhost hardcodeado o está usando una variable incorrecta. Verificá el template y usá `{{ .ConfirmationURL }}`.
