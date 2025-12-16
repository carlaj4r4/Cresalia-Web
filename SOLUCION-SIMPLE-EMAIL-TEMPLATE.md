# 🔧 SOLUCIÓN SIMPLE: Arreglar Email Template

## 📋 Lo que veo en tu template

Tu template actual tiene:
```html
<h2> Por favor confirma tu registro </h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>{{ .RedirectTo }}
```

## ⚠️ El Problema

Hay un `{{ .RedirectTo }}` al final que **NO debería estar ahí**. Eso puede estar causando problemas.

## ✅ Solución Simple

### PASO 1: Ir al Template

1. Supabase Dashboard → **Authentication** → **Email Templates**
2. Click en **"Confirm sign up"**

### PASO 2: Cambiar el Body

**BORRÁ todo el contenido del Body** y pegá esto:

```html
<h2>Por favor confirma tu registro</h2>
<p>Hacé click en el siguiente link para confirmar tu cuenta:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar mi email</a></p>
<p>O copiá y pegá este link en tu navegador:</p>
<p>{{ .ConfirmationURL }}</p>
```

### PASO 3: Dejar el Subject como está

El Subject está bien:
```
Hola. Te damos la bienvenida a Cresalia. Por favor confirma tu registro.
```

### PASO 4: Guardar

1. Click en **"Save"** (o "Guardar")
2. Listo ✅

---

## 🔍 Qué Cambió

**ANTES:**
```html
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>{{ .RedirectTo }}
```
❌ Tenía `{{ .RedirectTo }}` al final (eso está mal)

**AHORA:**
```html
<p><a href="{{ .ConfirmationURL }}">Confirmar mi email</a></p>
```
✅ Solo usa `{{ .ConfirmationURL }}` (esto está bien)

---

## ✅ Después de Cambiar

1. **Guardá el template**
2. **Registrá un nuevo usuario** (usá un email nuevo, no uno que ya usaste)
3. **Revisá el email** que te llega
4. **Click en el link** - debería redirigir a `https://cresalia-web.vercel.app/login-comprador.html`

---

## 🆘 Si Sigue Sin Funcionar

Si después de cambiar el template **sigue redirigiendo a localhost**:

1. **Esperá 5 minutos** después de guardar (a veces tarda en actualizarse)
2. **Probá con un email completamente nuevo** (no uno que ya registraste antes)
3. **Verificá que el Site URL** en "URL Configuration" sea `https://cresalia-web.vercel.app`

---

**Resumen:** Solo necesitás borrar el `{{ .RedirectTo }}` del final del template y dejar solo `{{ .ConfirmationURL }}`. Eso es todo.
