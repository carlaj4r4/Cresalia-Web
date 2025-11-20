# 🔔 Guía: Cambiar la URL de Webhooks en Mercado Pago

## 🎯 ¿Qué es un Webhook?

Un **webhook** es una URL donde Mercado Pago envía notificaciones cuando se completa un pago. Es como un "teléfono" que Mercado Pago usa para avisarte cuando pasa algo.

**Ejemplo de URL:**
```
https://cresalia-web.vercel.app/api/webhook-mercadopago
```

---

## 📋 Paso a Paso para Cambiar la URL

### Paso 1: Acceder a Webhooks

1. **Iniciá sesión en Mercado Pago:**
   - https://www.mercadopago.com.ar/
   - Ingresá con tu cuenta

2. **Accedé a Webhooks:**
   - Menú lateral → **"Desarrolladores"** → **"Webhooks"**
   - O: **"Desarrolladores"** → **"Notificaciones"** → **"Webhooks"**

### Paso 2: Ver tus Webhooks Actuales

Vas a ver una lista de webhooks configurados:

- **URL actual**: La URL que está configurada ahora
- **Eventos**: Qué eventos está escuchando (ej: `payment`, `merchant_order`)
- **Estado**: Si está activo o inactivo

### Paso 3: Editar o Crear Webhook

**Si ya tenés un webhook:**

1. **Hacé clic en "Editar" o "Modificar"** (al lado del webhook)
2. **Cambiá la URL** por la nueva
3. **Verificá los eventos** que querés recibir:
   - ☑ `payment` (pagos)
   - ☑ `merchant_order` (órdenes)
4. **Guardá los cambios**

**Si no tenés un webhook:**

1. **Hacé clic en "Crear Webhook" o "Agregar Webhook"**
2. **Configurá:**
   - **URL**: `https://cresalia-web.vercel.app/api/webhook-mercadopago`
   - **Eventos**: Seleccioná `payment` y `merchant_order`
3. **Guardá**

### Paso 4: Verificar que Funcione

1. **Mercado Pago verificará la URL:**
   - Enviará una notificación de prueba
   - Verificará que tu servidor responda correctamente

2. **Si hay un error:**
   - Verificá que la URL sea correcta
   - Verificá que el endpoint esté funcionando
   - Verificá que el endpoint responda con `200 OK`

---

## 🔄 ¿Cuándo Cambiar la URL?

### Casos Comunes:

1. **Cambiaste de dominio:**
   - Ejemplo: De `cresalia-web.vercel.app` a `cresalia.com`
   - Solución: Actualizá la URL en Mercado Pago

2. **Cambiaste de servidor:**
   - Ejemplo: De Vercel a otro servidor
   - Solución: Actualizá la URL en Mercado Pago

3. **Querés usar un endpoint diferente:**
   - Ejemplo: De `/api/webhook-mercadopago` a `/api/pagos/notificaciones`
   - Solución: Actualizá la URL en Mercado Pago

---

## ⚠️ Importante

### Limitaciones:

- **Una URL por vez**: Solo podés tener una URL activa para cada tipo de evento
- **Verificación**: Mercado Pago verificará que la URL responda correctamente
- **Tiempo de actualización**: Los cambios pueden tardar unos minutos en aplicarse

### Seguridad:

- **HTTPS obligatorio**: La URL debe usar HTTPS (no HTTP)
- **Verificación de firma**: El webhook verifica que las notificaciones vengan de Mercado Pago
- **No compartas la URL**: Mantené la URL privada

---

## 🧪 Probar el Webhook

### Opción 1: Pago de Prueba

1. **Hacé un pago de prueba:**
   - Usá una tarjeta de prueba
   - Completá el pago

2. **Verificá los logs:**
   - En Vercel: **"Deployments"** → **"Functions"** → **"Logs"**
   - Buscá notificaciones de webhook

### Opción 2: Notificación de Prueba desde Mercado Pago

1. **En el panel de Mercado Pago:**
   - **"Desarrolladores"** → **"Webhooks"**
   - Buscá tu webhook
   - Hacé clic en **"Enviar notificación de prueba"** o **"Test"**

2. **Verificá que llegue:**
   - Revisá los logs de Vercel
   - Deberías ver una notificación de prueba

---

## ✅ Checklist Final

- [ ] URL configurada en Mercado Pago
- [ ] URL usa HTTPS (no HTTP)
- [ ] Eventos seleccionados (`payment`, `merchant_order`)
- [ ] Webhook activo
- [ ] Endpoint funcionando (`api/webhook-mercadopago.js`)
- [ ] Probado con un pago de prueba
- [ ] Verificado en los logs de Vercel

---

## 🆘 ¿Necesitás Ayuda?

Si tenés problemas:

1. **Verificá la URL:**
   - ¿Es correcta?
   - ¿Usa HTTPS?
   - ¿El endpoint existe?

2. **Revisá los logs:**
   - En Vercel: **"Deployments"** → **"Functions"** → **"Logs"**
   - Buscá errores relacionados con webhooks

3. **Contactá a Mercado Pago:**
   - Soporte: https://www.mercadopago.com.ar/developers/es/support
   - Explicá que tenés problemas con los webhooks

---

¡Éxitos configurando tus webhooks! 💜


