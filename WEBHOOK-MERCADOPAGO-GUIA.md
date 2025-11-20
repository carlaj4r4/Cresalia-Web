# 🔔 Guía: Webhook de Mercado Pago

## ✅ Estado del Sistema

### ✅ Webhook Implementado

**Ya tenés el webhook implementado:**
- ✅ Archivo: `api/webhook-mercadopago.js`
- ✅ Configurado en `vercel.json` como rewrite
- ✅ URL: `/webhook-mercadopago` → `/api/webhook-mercadopago.js`

**URL completa para Mercado Pago:**
```
https://tu-dominio.vercel.app/webhook-mercadopago
```
o
```
https://tu-dominio.vercel.app/api/webhook-mercadopago
```

---

## 🔧 Configuración en Mercado Pago

### ✅ URL del Webhook

**En Mercado Pago:**
1. Ir a **Configuración** → **Webhooks**
2. Agregar nueva URL: `https://tu-dominio.vercel.app/webhook-mercadopago`
3. Seleccionar eventos: `payment` y `merchant_order`
4. Guardar

**Importante:**
- ✅ La URL debe ser **HTTPS** (no HTTP)
- ✅ Debe ser **accesible públicamente** (Vercel ya lo hace)
- ✅ No debe tener barras finales (ej: `/webhook-mercadopago` no `/webhook-mercadopago/`)

---

## ❌ Errores Comunes

### 1. **Error 404 (No encontrado)**

**Causas posibles:**
- ⚠️ URL incorrecta en Mercado Pago
- ⚠️ Rewrite no configurado en Vercel
- ⚠️ Archivo no existe

**Solución:**
- ✅ Verificá que la URL sea: `https://tu-dominio.vercel.app/webhook-mercadopago`
- ✅ Verificá que `vercel.json` tenga el rewrite configurado
- ✅ Verificá que el archivo `api/webhook-mercadopago.js` existe

---

### 2. **Error 500 (Error interno)**

**Causas posibles:**
- ⚠️ `MERCADOPAGO_ACCESS_TOKEN` no configurado en Vercel
- ⚠️ Error en el código del webhook
- ⚠️ Error conectando con Supabase

**Solución:**
- ✅ Verificá que `MERCADOPAGO_ACCESS_TOKEN` esté en Vercel Environment Variables
- ✅ Revisá los logs de Vercel para ver el error exacto
- ✅ Verificá que Supabase esté configurado (opcional)

---

### 3. **Error de Timeout**

**Causas posibles:**
- ⚠️ El webhook tarda mucho en responder
- ⚠️ Mercado Pago espera respuesta en menos de 10 segundos

**Solución:**
- ✅ El webhook debe responder rápido (< 5 segundos)
- ✅ Si necesitás procesar mucho, hacelo en background (después de responder)

---

## 📋 Verificación del Webhook

### ✅ Cómo Verificar que Funciona

**1. Probar localmente (con ngrok o similar):**
```bash
# Instalar ngrok
npm install -g ngrok

# Exponer tu servidor local
ngrok http 3000

# Usar la URL de ngrok en Mercado Pago (temporal)
```

**2. Ver logs en Vercel:**
- ✅ Ir a Vercel Dashboard → Tu proyecto → Functions → Logs
- ✅ Ver si el webhook está recibiendo requests
- ✅ Ver si hay errores

**3. Probar con webhook de prueba de Mercado Pago:**
- ✅ Mercado Pago tiene una opción para enviar webhooks de prueba
- ✅ Usala para verificar que funciona

---

## 🛠️ Qué es el SDK de Mercado Pago

### ✅ Explicación

**SDK (Software Development Kit):**
- ✅ Es una **biblioteca** que simplifica el uso de la API de Mercado Pago
- ✅ Te permite usar funciones en JavaScript sin hacer requests HTTP manualmente
- ✅ Maneja automáticamente autenticación, URLs, formatos, etc.

**Para qué sirve:**
- ✅ **Crear preferencias de pago** (más fácil que hacerlo manualmente)
- ✅ **Consultar pagos** (obtener detalles de un pago)
- ✅ **Procesar pagos** (manejar diferentes métodos de pago)
- ✅ **Gestionar suscripciones** (si usas suscripciones)

**Ejemplo:**
```javascript
// Sin SDK (complejo)
const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(preference)
});

// Con SDK (simple)
const preference = await mercadopago.preferences.create({
  items: [...],
  payer: {...}
});
```

**¿Necesitás el SDK?**
- ⚠️ **No es obligatorio** (podés usar la API directamente)
- ✅ **Es útil** si querés simplificar tu código
- ✅ **Ya estás usando la API directamente** (en `api/mercadopago-preference.js`)

**Conclusión:**
- ✅ Ya estás usando la API directamente (está bien)
- ✅ El SDK es opcional (podés usarlo si querés simplificar)
- ✅ Para webhooks, no necesitás el SDK (ya está implementado)

---

## 🎯 Solución al Error

### ✅ Pasos para Solucionar

**1. Verificar URL en Mercado Pago:**
- ✅ Debe ser: `https://tu-dominio.vercel.app/webhook-mercadopago`
- ✅ Sin barra final
- ✅ HTTPS (no HTTP)

**2. Verificar configuración en Vercel:**
- ✅ `vercel.json` tiene el rewrite configurado ✅
- ✅ El archivo `api/webhook-mercadopago.js` existe ✅

**3. Verificar variables de entorno:**
- ✅ `MERCADOPAGO_ACCESS_TOKEN` está configurado en Vercel
- ✅ Variables de Supabase (opcional)

**4. Ver logs de Vercel:**
- ✅ Ir a Vercel Dashboard → Tu proyecto → Functions → Logs
- ✅ Ver qué error está apareciendo exactamente

**5. Probar el webhook:**
- ✅ Usar webhook de prueba de Mercado Pago
- ✅ O hacer un pago de prueba

---

## 📝 Actualización de Comisión

### ✅ Comisión Corregida: 6.17%

**Archivos actualizados:**
- ✅ `js/mercado-pago-integration.js` - Actualizado a 6.17%
- ✅ `tiendas/ejemplo-tienda/admin-final.html` - Actualizado a 6.17%

**Cambios:**
- ✅ Porcentaje: 6.17% (antes 6.9%)
- ✅ Para $1000: $61.70 (antes $69.00)

---

## 💜 Mi Mensaje

### ✅ No Te Preocupes

**Sobre el error:**
- ⚠️ Es normal tener errores al configurar webhooks
- ✅ Podemos solucionarlo juntos
- ✅ Necesito ver el error exacto para ayudarte mejor

**Sobre el SDK:**
- ✅ No es obligatorio
- ✅ Ya estás usando la API directamente (está bien)
- ✅ Podés usarlo si querés simplificar, pero no es necesario

**Próximos pasos:**
1. ✅ Verificá la URL en Mercado Pago
2. ✅ Revisá los logs de Vercel para ver el error exacto
3. ✅ Compartí el error exacto y te ayudo a solucionarlo

---

**Comisión actualizada a 6.17%. Webhook implementado. Necesito ver el error exacto para ayudarte mejor.** 💜

---

¡Éxitos con Cresalia! 💜

