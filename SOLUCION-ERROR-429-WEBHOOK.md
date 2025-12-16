# 🔧 Solución: Error 429 (Too Many Requests) en Webhook de MercadoPago

## 🚨 El Problema

MercadoPago está recibiendo un error **429 - Too Many Requests** cuando intenta enviar notificaciones al webhook. Esto puede pasar por:

1. **El webhook responde muy lento** - MercadoPago espera respuesta rápida
2. **Vercel tiene límites de rate limiting** en el plan Hobby
3. **El webhook no maneja todos los tipos** de notificaciones
4. **MercadoPago envía muchas notificaciones** de prueba

## ✅ Solución Implementada

### Cambios Realizados:

1. **Respuesta Inmediata (200 OK)**
   - El webhook ahora responde **inmediatamente** con 200 OK
   - El procesamiento se hace de forma **asíncrona** después
   - Esto evita timeouts y errores 429

2. **Manejo de Todos los Tipos de Webhook**
   - `payment` - Pagos
   - `merchant_order` - Órdenes
   - `mp-connect` / `application.authorized` - Autorizaciones de aplicación
   - Cualquier otro tipo (solo loguea, no falla)

3. **Manejo de Errores 429 de MercadoPago**
   - Si MercadoPago devuelve 429 al consultar un pago, espera 2 segundos y reintenta
   - Evita fallos en cascada

4. **Procesamiento Asíncrono**
   - Usa `setImmediate()` para procesar después de responder
   - No bloquea la respuesta al webhook

---

## 🔍 Cómo Funciona Ahora

```
1. MercadoPago envía webhook
   ↓
2. Webhook responde INMEDIATAMENTE con 200 OK
   ↓
3. Procesa la notificación de forma asíncrona
   ↓
4. Loguea resultados (éxito o error)
```

**Ventaja:** MercadoPago recibe confirmación rápida y no reintenta innecesariamente.

---

## 📋 Verificar que Funciona

### 1. Probar el Webhook Manualmente

```bash
curl -X POST https://tu-dominio.vercel.app/api/webhook-mercadopago \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {"id": "123456"}
  }'
```

Deberías recibir inmediatamente:
```json
{
  "success": true,
  "message": "Webhook recibido correctamente",
  "received_at": "2024-12-14T..."
}
```

### 2. Verificar en MercadoPago

1. Ve a **MercadoPago** → **Desarrolladores** → **Webhooks**
2. Buscá tu webhook configurado
3. Debería mostrar **"Última notificación: exitosa"**
4. Si hay errores, verás los detalles

### 3. Revisar Logs de Vercel

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Deployments** → Último deploy → **Functions**
2. Buscá `/api/webhook-mercadopago`
3. Deberías ver logs como:
   - `🔔 Webhook recibido: payment 123456`
   - `✅ Pago procesado correctamente: 123456`

---

## ⚠️ Si Sigue Dando 429

### Posibles Causas:

1. **MercadoPago está enviando demasiadas notificaciones de prueba**
   - Solución: Desactivá las notificaciones de prueba en MercadoPago
   - O configurá el webhook solo para producción

2. **Vercel Hobby tiene límites muy estrictos**
   - Solución: Considerá actualizar a Vercel Pro ($20/mes)
   - O mover el webhook a otro servicio (Railway, Render)

3. **El webhook está tardando mucho en procesar**
   - Solución: Ya está implementada (procesamiento asíncrono)
   - Verificá que no haya operaciones bloqueantes

### Solución Temporal:

Si necesitás una solución rápida, podés:

1. **Configurar el webhook con retry más largo** en MercadoPago
2. **Usar un servicio de cola** (como Upstash Redis, gratis)
3. **Procesar webhooks en batch** en lugar de uno por uno

---

## 🔔 Configuración Recomendada en MercadoPago

1. **URL del Webhook:**
   ```
   https://tu-dominio.vercel.app/api/webhook-mercadopago
   ```

2. **Eventos a Escuchar:**
   - ✅ `payment` (pagos)
   - ✅ `merchant_order` (órdenes)
   - ❌ `mp-connect` (opcional, solo si usás MP Connect)

3. **Configuración de Reintentos:**
   - Intentos: 3
   - Intervalo: 5 minutos
   - Timeout: 30 segundos

---

## 📊 Monitoreo

### Señales de que Funciona Bien:

- ✅ Webhook responde en < 1 segundo
- ✅ Logs muestran "Webhook recibido correctamente"
- ✅ No hay errores 429 en los logs de Vercel
- ✅ MercadoPago muestra "Última notificación: exitosa"

### Señales de Problemas:

- ❌ Errores 429 frecuentes
- ❌ Webhook tarda > 5 segundos en responder
- ❌ MercadoPago muestra "Última notificación: fallida"
- ❌ Logs muestran muchos errores

---

## 🆘 Si Necesitás Ayuda

1. Revisá los logs de Vercel para ver qué está pasando
2. Verificá que la URL del webhook esté correcta en MercadoPago
3. Probá el webhook manualmente con curl
4. Verificá que las variables de entorno estén configuradas

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
