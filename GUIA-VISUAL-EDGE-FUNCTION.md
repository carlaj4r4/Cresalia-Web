# 📸 GUÍA VISUAL: Crear Edge Function Paso a Paso

## 🎯 SIN CLI - Todo Desde el Navegador

---

## ✅ PASO 1: Abrir el Editor

**Dónde estás ahora:**
- Ves 3 opciones: "Via Editor", "AI Assistant", "Via CLI"

**Qué hacer:**
1. Click en el botón **"Open Editor"** (primer cuadro, el que dice "Via Editor")

---

## ✅ PASO 2: Crear la Función

**Se abrirá un popup/modal:**

1. **Function name** (nombre de la función):
   ```
   enviar-emails-alerta
   ```
   
2. **NO CAMBIES NADA MÁS**
   - Runtime: Se configura automáticamente (Deno)
   - Todo lo demás: por defecto

3. Click en **"Create function"** o **"Continue"**

---

## ✅ PASO 3: Borrar el Código de Ejemplo

**Se abrirá el editor con código de ejemplo:**

1. **SELECCIONAR TODO** el código que aparece
   - Windows: `Ctrl + A`
   
2. **BORRAR TODO**
   - Presionar `Delete` o `Backspace`

Ahora tenés el editor vacío ✅

---

## ✅ PASO 4: Copiar el Código Nuevo

1. **Abrir el archivo**: `CODIGO-COMPLETO-EDGE-FUNCTION.txt` (está en tu proyecto)

2. **Seleccionar TODO** el contenido:
   - Windows: `Ctrl + A`

3. **Copiar**:
   - Windows: `Ctrl + C`

---

## ✅ PASO 5: Pegar en el Editor de Supabase

1. **Ir al editor de Supabase** (el que dejaste vacío en PASO 3)

2. **Pegar**:
   - Windows: `Ctrl + V`

3. **Verificar** que se copió todo:
   - Debe empezar con: `import { serve } from...`
   - Debe terminar con: `await supabase.from('alertas_emails_enviados').insert(registros)`
   - Debe tener como 280 líneas aproximadamente

---

## ✅ PASO 6: Guardar y Deploy

**En el editor de Supabase:**

1. Buscar botón **"Deploy"** o **"Save"** (arriba a la derecha)

2. Click en **"Deploy"**

3. **ESPERAR** (puede tardar 30-60 segundos)
   - Verás un spinner/loading
   - Luego dirá "Deployed successfully" ✅

---

## ✅ PASO 7: Configurar Secrets (Variables de Entorno)

**IMPORTANTE**: Sin esto, los emails NO se enviarán.

1. **Ir a la barra lateral izquierda**

2. Click en **"Secrets"** (está debajo de "Functions")

3. **Agregar 2 secrets:**

### Secret 1: BREVO_API_KEY

1. Click en **"Add Secret"** o **"New Secret"**
2. **Name**: `BREVO_API_KEY`
3. **Value**: Tu API key de Brevo (copia desde Vercel o desde Brevo)
4. Click en **"Save"**

### Secret 2: BREVO_SENDER_EMAIL

1. Click en **"Add Secret"** o **"New Secret"**
2. **Name**: `BREVO_SENDER_EMAIL`
3. **Value**: `alertas@cresalia.com` (o el email que uses en Brevo)
4. Click en **"Save"**

---

## ✅ PASO 8: Verificar que Funciona

### Opción A: Ver en el Dashboard

1. Ir a **Edge Functions** (barra lateral)
2. Deberías ver: `enviar-emails-alerta`
3. Status: **"Deployed"** con un círculo verde ✅

### Opción B: Probar Creando una Alerta

1. Ir a tu Panel Master
2. Crear una alerta de prueba
3. Ver en logs si se enviaron emails

---

## 🐛 ¿No Funciona?

### Error: "BREVO_API_KEY no configurada"

**Solución**: Volver al PASO 7 y configurar los secrets.

### Error: "Function not found"

**Solución**: 
1. Verificar que el nombre sea exactamente: `enviar-emails-alerta`
2. Sin espacios, sin mayúsculas

### El deploy no termina nunca

**Solución**:
1. Refrescar la página (F5)
2. Verificar en Edge Functions si apareció la función

---

## 📋 Checklist Final

Antes de probar, verificá que:

- ✅ Función creada: `enviar-emails-alerta`
- ✅ Estado: "Deployed" (verde)
- ✅ Secret 1: `BREVO_API_KEY` configurado
- ✅ Secret 2: `BREVO_SENDER_EMAIL` configurado
- ✅ SQL instalado en ambos proyectos Supabase

---

## 🎉 ¡Listo!

Ahora cuando crees una alerta:
1. Se guardará en la base de datos
2. La Edge Function se activará automáticamente
3. Buscará usuarios cercanos
4. Les enviará emails con Brevo
5. Registrará los envíos en `alertas_emails_enviados`

---

## 💜 ¿Dónde Estás Ahora?

Si estás viendo esta guía, probablemente estés en el **PASO 1**.

👉 **Siguiente**: Click en **"Open Editor"** en la pantalla de Edge Functions.

---

## 🆘 ¿Necesitás Ayuda?

Si algo no funciona o no entendés algún paso, decime:
- ¿En qué paso estás?
- ¿Qué pantalla ves?
- ¿Qué error te aparece?

Y te ayudo a solucionarlo 😊💜
