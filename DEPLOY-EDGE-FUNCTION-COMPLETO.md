# 🚀 Deploy Completo de Edge Function (Sin CLI)

## 📋 Checklist Antes de Empezar

- ✅ Git pusheado (ya está ✓)
- ⏳ API KEY de Brevo (obtener desde Vercel o Brevo)
- ⏳ Email sender verificado en Brevo
- ⏳ Acceso a Supabase Dashboard

---

## 🎯 PASO 1: Obtener API KEY de Brevo

### Método A: Desde Vercel (Recomendado)

1. Ir a https://vercel.com
2. Proyecto → Settings → Environment Variables
3. Buscar `BREVO_API_KEY`
4. Click en `...` → Edit
5. **COPIAR** el valor completo

### Método B: Desde Brevo

1. Ir a https://app.brevo.com
2. Account → SMTP & API → API Keys
3. Crear nueva: "Cresalia Edge Function"
4. **COPIAR INMEDIATAMENTE** (solo se muestra 1 vez)

---

## 🎯 PASO 2: Ir a Supabase

### Proyecto de Comunidades

1. Ir a https://supabase.com/dashboard
2. Click en proyecto **"Cresalia Comunidades"**
3. Menú lateral → **"Edge Functions"**
4. Click en **"Open Editor"** (o "Deploy a new function" → "Via Editor")

---

## 🎯 PASO 3: Crear la Función

### En el popup que aparece:

1. **Function name**: `enviar-emails-alerta`
2. **NO cambies nada más**
3. Click **"Create function"**

---

## 🎯 PASO 4: Copiar el Código

### En tu proyecto local:

1. Abrir archivo: `CODIGO-COMPLETO-EDGE-FUNCTION.txt`
2. Seleccionar TODO: `Ctrl + A`
3. Copiar: `Ctrl + C`

### En el editor de Supabase:

1. **Borrar** el código de ejemplo que aparece (Ctrl + A, luego Delete)
2. **Pegar** el código copiado: `Ctrl + V`
3. Verificar que empieza con: `import { serve }`

---

## 🎯 PASO 5: Deploy

1. Click en botón **"Deploy"** (arriba derecha)
2. **ESPERAR** 30-60 segundos
3. Debe decir: "Deployed successfully" ✅

---

## 🎯 PASO 6: Configurar Secrets (MUY IMPORTANTE)

### En Supabase:

1. Menú lateral → **"Secrets"** (está debajo de "Functions")
2. Click **"Add Secret"**

### Secret 1: BREVO_API_KEY

1. **Name**: `BREVO_API_KEY`
2. **Value**: (pegar la API key que copiaste de Vercel/Brevo)
3. Click **"Save"**

### Secret 2: BREVO_SENDER_EMAIL

1. Click **"Add Secret"** de nuevo
2. **Name**: `BREVO_SENDER_EMAIL`
3. **Value**: `alertas@cresalia.com` (o el email verificado que uses)
4. Click **"Save"**

---

## 🎯 PASO 7: Verificar

### En Edge Functions:

1. Deberías ver: `enviar-emails-alerta`
2. Status: **"Deployed"** con círculo verde ✅

### Probar:

1. Ir a Panel Master
2. Crear una alerta de prueba
3. Verificar que se envía

---

## 🔄 REPETIR para Proyecto de Tiendas

Si también querés el sistema en el proyecto de tiendas:

1. Cambiar a proyecto **"Cresalia"** (tiendas)
2. Repetir PASO 2 al PASO 6
3. Usar las **mismas** API KEY y email

---

## ✅ Checklist Final

- ✅ Edge Function deployada en Supabase Comunidades
- ✅ Secrets configurados (BREVO_API_KEY y BREVO_SENDER_EMAIL)
- ✅ Status: "Deployed" verde
- ✅ SQL instalado en ambos proyectos
- ✅ Scripts incluidos en HTML

---

## 🎉 ¡Listo!

Ahora cuando crees una alerta:
1. Se guarda en la base de datos
2. La Edge Function se activa automáticamente
3. Busca usuarios en el radio
4. Les envía emails profesionales
5. Registra todo en `alertas_emails_enviados`

---

## 🐛 Troubleshooting

### Error: "BREVO_API_KEY no configurada"
- Verificar que configuraste los secrets en PASO 6
- Verificar que el nombre sea exactamente `BREVO_API_KEY` (mayúsculas)

### Error: "Function not found"
- Verificar que el nombre sea `enviar-emails-alerta` (sin espacios)
- Refrescar la página

### No se envían emails
- Verificar que la API KEY sea válida en Brevo
- Verificar que el sender email esté verificado en Brevo
- Ver logs en Supabase: Edge Functions → enviar-emails-alerta → Logs

---

💜 ¿Necesitás ayuda con algún paso específico?
