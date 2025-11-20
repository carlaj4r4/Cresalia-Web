# 🔧 Solución de Errores de Webhook

## ✅ Sistema de Webhook Implementado

**Ya está implementado:**
- ✅ Archivo: `api/webhook-mercadopago.js`
- ✅ Configurado en `vercel.json`
- ✅ URL: `https://tu-dominio.vercel.app/webhook-mercadopago`

---

## 🔍 Verificación del Webhook

### ✅ URL Correcta en Mercado Pago

**La URL debe ser:**
```
https://tu-dominio.vercel.app/webhook-mercadopago
```

**Importante:**
- ✅ Debe ser **HTTPS** (no HTTP)
- ✅ No debe tener barra final (no `/webhook-mercadopago/`)
- ✅ Debe ser accesible públicamente (Vercel ya lo hace)

---

## ❌ Errores Comunes y Soluciones

### 1. **Error 404 (No encontrado)**

**Causa:**
- ⚠️ URL incorrecta en Mercado Pago
- ⚠️ Rewrite no configurado correctamente

**Solución:**
- ✅ Verificá que la URL sea exactamente: `https://tu-dominio.vercel.app/webhook-mercadopago`
- ✅ Verificá que `vercel.json` tenga el rewrite configurado (ya está ✅)

---

### 2. **Error 500 (Error interno)**

**Causa:**
- ⚠️ `MERCADOPAGO_ACCESS_TOKEN` no configurado en Vercel
- ⚠️ Error en el código del webhook

**Solución:**
1. Verificá que `MERCADOPAGO_ACCESS_TOKEN` esté en Vercel Environment Variables
2. Verificá que sea el token de **producción** (no test)
3. Revisá los logs de Vercel para ver el error exacto

**Cómo ver logs:**
- Vercel Dashboard → Tu proyecto → **Functions** → **Logs**
- Ahí verás el error exacto

---

### 3. **Error de Timeout**

**Causa:**
- ⚠️ El webhook tarda mucho en responder
- ⚠️ Mercado Pago espera respuesta en menos de 10 segundos

**Solución:**
- ✅ El webhook debe responder rápido (< 5 segundos)
- ✅ Si necesitás procesar mucho, hacelo en background (después de responder)

---

### 4. **Error de Validación**

**Causa:**
- ⚠️ Mercado Pago no puede validar el webhook
- ⚠️ Headers faltantes o incorrectos

**Solución:**
- ✅ Verificá que el webhook tenga CORS configurado (ya está ✅)
- ✅ Verificá que acepte headers de Mercado Pago (ya está ✅)

---

## 🔍 Cómo Diagnosticar el Error

### ✅ Pasos para Ver el Error Exacto

**1. Ver logs en Vercel:**
- Vercel Dashboard → Tu proyecto → **Functions** → **Logs**
- Buscá requests a `/webhook-mercadopago`
- Verás el error exacto

**2. Probar el webhook manualmente:**
- Usá un tool como Postman o curl
- Enviá un POST request a `https://tu-dominio.vercel.app/webhook-mercadopago`
- Verás la respuesta

**3. Verificar en Mercado Pago:**
- Mercado Pago Dashboard → **Webhooks** → **Logs**
- Verás si Mercado Pago está enviando los webhooks
- Verás qué respuesta está recibiendo

---

## 📋 Checklist de Verificación

### ✅ Antes de Reportar un Error

- [ ] URL en Mercado Pago: `https://tu-dominio.vercel.app/webhook-mercadopago`
- [ ] URL es HTTPS (no HTTP)
- [ ] URL no tiene barra final
- [ ] `MERCADOPAGO_ACCESS_TOKEN` está configurado en Vercel
- [ ] `MERCADOPAGO_ACCESS_TOKEN` es de producción (no test)
- [ ] Revisaste los logs de Vercel
- [ ] Revisaste los logs de Mercado Pago

---

## 🛠️ Sobre el SDK de Mercado Pago

### ✅ Explicación

**SDK (Software Development Kit):**
- ✅ Es una **biblioteca** que simplifica el uso de la API de Mercado Pago
- ✅ Te permite usar funciones en JavaScript sin hacer requests HTTP manualmente
- ✅ Maneja automáticamente autenticación, URLs, formatos, etc.

**Para qué sirve:**
- ✅ Crear preferencias de pago (más fácil)
- ✅ Consultar pagos (obtener detalles)
- ✅ Procesar pagos (manejar diferentes métodos)
- ✅ Gestionar suscripciones

**¿Necesitás el SDK?**
- ⚠️ **No es obligatorio** (podés usar la API directamente)
- ✅ Ya estás usando la API directamente (en `api/mercadopago-preference.js`)
- ✅ Para webhooks, **no necesitás el SDK** (ya está implementado)
- ✅ Podés usarlo si querés simplificar, pero no es necesario

**Conclusión:**
- ✅ Ya estás usando la API directamente (está bien)
- ✅ El SDK es opcional (podés usarlo si querés simplificar)
- ✅ Para webhooks, ya está implementado (no necesitás el SDK)

---

## 💡 Próximos Pasos

### ✅ Para Solucionar el Error

**1. Compartí el error exacto:**
- ✅ Copiá el error completo de los logs de Vercel
- ✅ O del dashboard de Mercado Pago
- ✅ Así puedo ayudarte mejor

**2. Verificá la configuración:**
- ✅ URL correcta en Mercado Pago
- ✅ Token configurado en Vercel
- ✅ Rewrite configurado en vercel.json (ya está ✅)

**3. Probá manualmente:**
- ✅ Usá Postman o curl para probar el webhook
- ✅ Verás si funciona fuera de Mercado Pago

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
- ✅ Para webhooks, ya está implementado

**Próximos pasos:**
1. ✅ Compartí el error exacto (de los logs)
2. ✅ Verificá la configuración
3. ✅ Probá manualmente si querés

---

**Comisión actualizada a 6.17%. Webhook implementado. Necesito ver el error exacto para ayudarte mejor.** 💜

---

¡Éxitos con Cresalia! 💜

