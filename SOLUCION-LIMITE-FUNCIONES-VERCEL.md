# 🔧 Solución: Límite de 12 Funciones Serverless en Vercel Hobby

## 🚨 El Problema

Vercel Hobby plan tiene un límite de **12 funciones serverless** por deployment. Si tenés más de 12 archivos en la carpeta `api/`, el deploy fallará.

## ✅ Solución Aplicada

He eliminado el archivo redundante `api/mercadopago/crear-preferencia.js` que solo redirigía al endpoint principal. Ahora tenés exactamente **12 funciones**:

1. `api/admin.js`
2. `api/aniversarios.js`
3. `api/comunidades-api.js`
4. `api/cumpleanos.js`
5. `api/enviar-email-brevo.js`
6. `api/historias-corazon.js`
7. `api/jobs.js`
8. `api/mantenimiento.js`
9. `api/mercadopago-preference.js`
10. `api/reportar-error.js`
11. `api/reportes.js`
12. `api/webhook-mercadopago.js`

## 📋 Si Necesitás Más Funciones en el Futuro

### Opción 1: Combinar Funciones Relacionadas

Podés combinar funciones relacionadas en un solo archivo usando rutas:

```javascript
// api/mercadopago.js (combina crear-preferencia y webhook)
module.exports = async (req, res) => {
    const { pathname } = new URL(req.url);
    
    if (pathname === '/api/mercadopago/preferencia' || pathname === '/api/mercadopago-preference') {
        // Lógica de crear preferencia
    } else if (pathname === '/api/mercadopago/webhook' || pathname === '/api/webhook-mercadopago') {
        // Lógica de webhook
    }
};
```

### Opción 2: Usar Vercel Pro Plan

- **Costo:** $20/mes
- **Límite:** Funciones ilimitadas
- **Ventajas:** Más funciones, mejor rendimiento, soporte prioritario

### Opción 3: Mover Algunas Funciones a Otro Servicio

Podés mover funciones menos críticas a otro servicio gratuito como:
- Railway (gratis con crédito)
- Render (gratis)
- Fly.io (gratis)

---

## ✅ Estado Actual

- ✅ **12 funciones** (dentro del límite)
- ✅ Deploy debería funcionar ahora
- ✅ Todas las funciones esenciales están incluidas

---

## 🔔 Sobre el Webhook de MercadoPago

**Sí, solo necesitás configurarlo en MercadoPago:**

1. Ve a **MercadoPago** → **Desarrolladores** → **Webhooks**
2. Agrega la URL:
   ```
   https://tu-dominio.vercel.app/api/webhook-mercadopago
   ```
3. Selecciona eventos: `payment` y `merchant_order`
4. Guarda

El endpoint ya está creado y funcionando. Solo necesitás decirle a MercadoPago dónde enviar las notificaciones.

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
