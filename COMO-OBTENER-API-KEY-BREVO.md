# 🔑 Cómo Obtener tu API KEY de Brevo desde Vercel

## Opción A: Desde Vercel Dashboard (Más Fácil)

### PASO 1: Ir a Vercel

1. Abrir: https://vercel.com
2. Login con tu cuenta
3. Click en tu proyecto **Cresalia-Web**

### PASO 2: Ir a Settings

1. Click en **"Settings"** (arriba)
2. En el menú lateral, click en **"Environment Variables"**

### PASO 3: Buscar BREVO_API_KEY

1. Buscar en la lista: `BREVO_API_KEY`
2. Verás algo así:
   ```
   BREVO_API_KEY
   xkeysib-******************** (Production)
   ```

### PASO 4: Ver el Valor (Si es tu proyecto)

**Opción 1: Si podés editar**
1. Click en los 3 puntos `...` al lado de `BREVO_API_KEY`
2. Click en **"Edit"**
3. Se mostrará el valor completo
4. **COPIAR** ese valor

**Opción 2: Si no podés ver**
1. Ir a tu correo de registro de Brevo
2. Buscar email de "API Key Created"
3. Ahí está la key completa

---

## Opción B: Desde Brevo Directamente

### PASO 1: Ir a Brevo

1. Abrir: https://app.brevo.com
2. Login con tu cuenta

### PASO 2: Ir a API Keys

1. Click en tu nombre (arriba derecha)
2. Click en **"SMTP & API"**
3. Click en pestaña **"API Keys"**

### PASO 3: Ver o Crear

**Si ya tenés una key:**
1. Verás la lista de keys
2. Si dice "Hidden", necesitás crear una nueva (las keys solo se muestran 1 vez)

**Crear una nueva key:**
1. Click en **"Generate a new API key"**
2. Name: `Cresalia Edge Function`
3. Click **"Generate"**
4. **COPIAR INMEDIATAMENTE** (solo se muestra 1 vez)

---

## 📝 Guardar la API Key

Una vez que tengas la key, **cópiala** y guardála temporalmente en un lugar seguro.

**Formato de la key:**
```
xkeysib-[LONG_STRING_OF_CHARACTERS]-[MORE_CHARACTERS]
```

(Empieza con `xkeysib-` seguido de una cadena MUY larga de letras y números)

---

## 🔐 También Necesitás

### BREVO_SENDER_EMAIL

**¿Qué email usás para enviar en Brevo?**

Opciones comunes:
- `alertas@cresalia.com`
- `noreply@cresalia.com`
- `info@cresalia.com`

Este email **debe estar verificado** en Brevo.

**Cómo verificar:**
1. Ir a Brevo → Senders & IP
2. Ver qué emails tenés verificados
3. Usar uno de esos

---

## 🎯 Próximo Paso

Una vez que tengas:
- ✅ `BREVO_API_KEY` (copiada)
- ✅ `BREVO_SENDER_EMAIL` (identificado)

**Ir a Supabase** para configurar los secrets y deployar la función.

---

## 🆘 Si No Podés Obtener la Key

**Si no aparece en Vercel y no podés verla en Brevo:**

1. Crear una **nueva API Key** en Brevo (es gratis)
2. Usarla para la Edge Function
3. Actualizarla en Vercel también (opcional)

---

💜 Cuando tengas la key, avisame y te ayudo a configurar Supabase!
