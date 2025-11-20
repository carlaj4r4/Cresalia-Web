# 🔗 GUÍA: Webhooks Automatizados - Cresalia

## 🎯 ¿Qué son los Webhooks?

Los **webhooks** son notificaciones automáticas que Mercado Pago envía a tu servidor cuando ocurre un evento importante, como:
- ✅ Pago aprobado
- ❌ Pago rechazado
- ⏳ Pago pendiente
- 🔄 Renovación de suscripción

**En lugar de tener que verificar manualmente**, Mercado Pago te **notifica automáticamente** cuando algo pasa.

---

## 📋 ¿Cómo Funcionan?

### Flujo Básico:

```
1. Cliente paga en Mercado Pago
   ↓
2. Mercado Pago procesa el pago
   ↓
3. Mercado Pago envía webhook a tu servidor
   ↓
4. Tu servidor procesa el webhook
   ↓
5. Tu sistema se actualiza automáticamente
```

---

## 🚀 Configuración en Mercado Pago

### Paso 1: Ir a Configuración de Webhooks

1. Entra a tu cuenta de Mercado Pago
2. Ve a **"Desarrolladores"** → **"Webhooks"**
3. Haz clic en **"Crear Webhook"**

### Paso 2: Configurar el Webhook

**URL del Webhook:**
```
https://tu-dominio.com/api/webhooks/mercadopago
```

**Eventos a Escuchar:**
- ✅ `payment.created` - Cuando se crea un pago
- ✅ `payment.updated` - Cuando se actualiza un pago
- ✅ `payment.approved` - Cuando se aprueba un pago
- ✅ `payment.rejected` - Cuando se rechaza un pago

### Paso 3: Guardar y Probar

1. Guarda la configuración
2. Mercado Pago te dará una **URL de prueba**
3. Prueba enviando un pago de prueba

---

## 💻 Implementación en el Código

### 1. Endpoint para Recibir Webhooks

Ya está implementado en `backend/server-multitenancy.js`:

```javascript
// Endpoint para recibir webhooks de Mercado Pago
app.post('/api/webhooks/mercadopago', async (req, res) => {
    try {
        const { type, action, data } = req.body;
        
        // Validar firma del webhook (importante para seguridad)
        const signature = req.headers['x-signature'];
        if (!validarFirmaWebhook(signature, req.body)) {
            return res.status(401).json({ error: 'Firma inválida' });
        }
        
        // Procesar según el tipo de evento
        if (type === 'payment' && action === 'payment.updated') {
            const paymentId = data.id;
            await procesarWebhookPago(paymentId);
        }
        
        // Responder inmediatamente a Mercado Pago
        res.status(200).json({ received: true });
        
    } catch (error) {
        console.error('Error procesando webhook:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});
```

### 2. Procesar el Webhook

```javascript
async function procesarWebhookPago(paymentId) {
    try {
        // Obtener información del pago de Mercado Pago
        const payment = await obtenerPagoDeMercadoPago(paymentId);
        
        // Verificar el estado del pago
        if (payment.status === 'approved') {
            // Pago exitoso
            await procesarPagoExitoso(payment);
        } else if (payment.status === 'rejected') {
            // Pago rechazado
            await procesarPagoRechazado(payment);
        }
        
    } catch (error) {
        console.error('Error procesando pago:', error);
    }
}
```

### 3. Integrar con Sistema de Renovación

El sistema de renovación automática se conecta con los webhooks:

```javascript
// En sistema-renovacion-automatica.js
async procesarPagoExitoso(paymentId, subscriptionId) {
    // Cuando el webhook notifica que el pago fue exitoso
    // El sistema de renovación actualiza la suscripción automáticamente
    await actualizarSuscripcion(subscriptionId);
    await reactivarTienda(subscriptionId);
}
```

---

## 🔒 Seguridad de Webhooks

### Validar Firma del Webhook

Mercado Pago envía una firma con cada webhook. **Siempre debes validarla**:

```javascript
function validarFirmaWebhook(signature, body) {
    // Obtener tu secret key de Mercado Pago
    const secretKey = process.env.MERCADOPAGO_SECRET_KEY;
    
    // Crear hash del body
    const hash = crypto
        .createHmac('sha256', secretKey)
        .update(JSON.stringify(body))
        .digest('hex');
    
    // Comparar con la firma recibida
    return hash === signature;
}
```

---

## 🔄 Automatización Completa

### 1. Renovación Automática

Cuando llega el webhook de pago exitoso:
- ✅ El sistema renueva la suscripción automáticamente
- ✅ Actualiza la fecha de vencimiento (+30 días)
- ✅ Reactiva la tienda si estaba suspendida
- ✅ Notifica al usuario por email

### 2. Suspensión Automática

Cuando llega el webhook de pago rechazado:
- ❌ El sistema registra el intento fallido
- ⏰ Después de X intentos, suspende automáticamente
- 📧 Notifica al usuario

### 3. Límites Automáticos

El sistema verifica límites automáticamente:
- 📊 Contador de productos/órdenes
- 🚫 Bloquea si se excede el límite
- 💡 Sugiere actualizar plan

---

## 📝 Configuración en Vercel (Producción)

### 1. Configurar Variable de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```
MERCADOPAGO_WEBHOOK_SECRET=tu_secret_key_aqui
```

### 2. Configurar URL del Webhook en Mercado Pago

```
https://tu-proyecto.vercel.app/api/webhooks/mercadopago
```

### 3. Probar en Producción

1. Haz un pago de prueba
2. Verifica que el webhook llegue
3. Revisa los logs en Vercel

---

## ✅ Ventajas de los Webhooks

### Sin Webhooks (Manual):
- ❌ Tienes que verificar manualmente cada pago
- ❌ Renovaciones no se procesan automáticamente
- ❌ Suspensiones tardan en aplicarse
- ❌ Mucho trabajo manual

### Con Webhooks (Automático):
- ✅ Todo se procesa automáticamente
- ✅ Renovaciones instantáneas
- ✅ Suspensiones automáticas
- ✅ Sin trabajo manual

---

## 🎯 Resumen

**Webhooks = Notificaciones Automáticas de Mercado Pago**

1. **Configurar** en Mercado Pago Dashboard
2. **Implementar** endpoint en tu servidor
3. **Validar** la firma del webhook
4. **Procesar** el evento automáticamente
5. **Disfrutar** de la automatización completa

---

## 💜 Nota Final

Una vez configurados los webhooks, **todo funciona automáticamente**:
- ✅ Renovaciones
- ✅ Suspensiones
- ✅ Notificaciones
- ✅ Actualizaciones de estado

**No necesitas hacer nada manualmente.** 🎉

---

*Guía creada por Claude para Cresalia - Enero 2025*





