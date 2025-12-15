# 🔧 Configuración de Endpoints de MercadoPago - CRESALIA

## ✅ Endpoints Disponibles

Ya tenés estos endpoints creados en la carpeta `api/`:

### 1. Crear Preferencia de Pago
- **Archivo:** `api/mercadopago-preference.js`
- **Ruta:** `/api/mercadopago-preference`

### 2. Webhook de Notificaciones
- **Archivo:** `api/webhook-mercadopago.js`
- **Ruta:** `/api/webhook-mercadopago`

---

## 🔐 Variables de Entorno en Vercel

### Variables para el Servidor (SIN prefijo `NEXT_PUBLIC_`)

Estas variables **NO** deben tener el prefijo porque son privadas:

1. **`MERCADOPAGO_ACCESS_TOKEN`**
   - Tu token de acceso privado de MercadoPago
   - Se usa solo en los endpoints de API (servidor)
   - **NUNCA** se expone en el cliente

2. **`MERCADOPAGO_WEBHOOK_SECRET`** (opcional, para verificar webhooks)
   - Secret para verificar que los webhooks vienen de MercadoPago
   - Opcional pero recomendado para producción

### Variables para el Cliente (CON prefijo `NEXT_PUBLIC_`)

Esta variable **SÍ** debe tener el prefijo porque es pública:

1. **`NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`**
   - Tu clave pública de MercadoPago
   - Segura de exponer en el navegador
   - Se usa para inicializar el SDK de MercadoPago

---

## 📋 Cómo Configurar en Vercel

### Paso 1: Agregar Variables de Entorno

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

2. Agrega estas variables:

   **Para el Servidor (SIN prefijo):**
   ```
   MERCADOPAGO_ACCESS_TOKEN = tu_access_token_aqui
   ```

   **Para el Cliente (CON prefijo):**
   ```
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY = tu_public_key_aqui
   ```

3. Selecciona los entornos:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (opcional)

4. Haz un nuevo **Deploy**

### Paso 2: Configurar Webhook en MercadoPago

1. Ve a tu cuenta de MercadoPago → **Desarrolladores** → **Webhooks**

2. Agrega una nueva URL de webhook:
   ```
   https://tu-dominio.vercel.app/api/webhook-mercadopago
   ```

3. Selecciona los eventos:
   - ✅ `payment` (pagos)
   - ✅ `merchant_order` (órdenes)

4. Guarda la configuración

---

## 🧪 Probar los Endpoints

### Probar Crear Preferencia

```bash
curl -X POST https://tu-dominio.vercel.app/api/mercadopago-preference \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "Test",
        "quantity": 1,
        "unit_price": 100,
        "currency_id": "ARS"
      }
    ],
    "payer": {
      "email": "test@example.com"
    }
  }'
```

### Verificar que el Webhook Funciona

1. Realizá un pago de prueba en MercadoPago
2. MercadoPago enviará una notificación al webhook
3. Revisá los logs de Vercel para ver si se recibió

---

## 🔍 Verificar que Funciona

### En el Cliente (Navegador)

1. Abrí la consola del navegador (F12)
2. Intentá crear una preferencia de pago
3. Deberías ver:
   - ✅ `💰 Creando preferencia de pago para plan: ...`
   - ✅ `✅ Preferencia creada: ...`

### En el Servidor (Vercel Logs)

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Deployments** → Click en el último deploy → **Functions**
2. Buscá los logs de `/api/mercadopago-preference`
3. Deberías ver:
   - ✅ `✅ Preferencia de pago creada correctamente`

---

## ⚠️ Troubleshooting

### Error: "ACCESS_TOKEN_NOT_CONFIGURED"

**Problema:** La variable `MERCADOPAGO_ACCESS_TOKEN` no está configurada.

**Solución:**
1. Verificá que agregaste la variable en Vercel (SIN prefijo `NEXT_PUBLIC_`)
2. Verificá que seleccionaste el entorno correcto (Production)
3. Hacé un nuevo deploy después de agregar la variable

### Error: "MERCADOPAGO_PUBLIC_KEY no está configurada"

**Problema:** La variable `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` no está configurada.

**Solución:**
1. Verificá que agregaste la variable en Vercel (CON prefijo `NEXT_PUBLIC_`)
2. Verificá que seleccionaste el entorno correcto
3. Hacé un nuevo deploy

### El webhook no recibe notificaciones

**Problema:** MercadoPago no está enviando notificaciones.

**Solución:**
1. Verificá que la URL del webhook esté correcta en MercadoPago
2. Verificá que los eventos estén seleccionados (`payment`, `merchant_order`)
3. Revisá los logs de Vercel para ver si hay errores
4. Probá con un pago de prueba

---

## 📚 Recursos

- [Documentación de MercadoPago - Checkout API](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/landing)
- [Documentación de MercadoPago - Webhooks](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
