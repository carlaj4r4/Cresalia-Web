# 💳 GUÍA DE INTEGRACIÓN PAYPAL BUSINESS PARA CRESALIA

## 📋 PASOS PARA CONFIGURAR PAYPAL

### 1. **Crear Cuenta PayPal Business**
1. Ve a: https://www.paypal.com/business
2. Crea una cuenta de PayPal Business
3. Completa la verificación de identidad
4. Vincula tu cuenta bancaria (opcional, pero recomendado)

---

### 2. **Obtener Credenciales de API**

#### Para Sandbox (Pruebas):
1. Ve a: https://developer.paypal.com/
2. Inicia sesión con tu cuenta PayPal Business
3. Ve a **Dashboard** → **My Apps & Credentials**
4. Clic en **Create App**
5. Nombre: "Cresalia - Sandbox"
6. Selecciona **Sandbox** como ambiente
7. Copia el **Client ID** y **Client Secret**

#### Para Producción (Real):
1. En el mismo dashboard, clic en **Create App**
2. Nombre: "Cresalia - Production"
3. Selecciona **Live** como ambiente
4. Copia el **Client ID** y **Client Secret**

---

### 3. **Configurar Variables de Entorno en Vercel**

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega estas variables:

```
PAYPAL_CLIENT_ID=TU_CLIENT_ID_AQUI
PAYPAL_CLIENT_SECRET=TU_CLIENT_SECRET_AQUI
```

**⚠️ IMPORTANTE**: 
- `PAYPAL_CLIENT_SECRET` debe estar marcado como **sensitive** (no se muestra en logs)
- Solo agrega `PAYPAL_CLIENT_ID` como `NEXT_PUBLIC_PAYPAL_CLIENT_ID` si quieres exponerlo en el cliente
- El `PAYPAL_CLIENT_SECRET` **NUNCA** debe estar en el cliente, solo en el servidor

---

### 4. **Usar PayPal en Cresalia Jobs**

#### Para Publicaciones Básicas (AR$ 1,000):
- **Usar**: Mercado Pago (mejor para Argentina, menos comisiones)
- **Razón**: PayPal cobra 3.49% + $0.49, que es muy alto para AR$ 1,000

#### Para Publicaciones Destacadas (AR$ 2,000+):
- **Usar**: Mercado Pago o PayPal
- **PayPal**: Solo si el empleador quiere pagar con PayPal (opción)

#### Para Pagos Internacionales:
- **Usar**: PayPal (mejor para pagos desde otros países)

---

### 5. **Configurar Links de Pago Manuales (Opción Actual)**

Si ya tienes links de pago y códigos QR de PayPal:

#### Para Suscripciones del E-commerce:
- Puedes usar los links directos que ya tienes
- O integrar el botón de PayPal usando `js/paypal-integration.js`

#### Para Cresalia Jobs:
- Actualmente usa Mercado Pago (AR$ 1,000 / AR$ 2,000)
- **Recomendación**: Mantener Mercado Pago como principal
- Agregar PayPal como opción alternativa para pagos internacionales

---

## 🔧 CÓDIGO DE INTEGRACIÓN

### En tu HTML:
```html
<!-- PayPal SDK -->
<script src="https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID&currency=USD"></script>

<!-- Configuración PayPal -->
<script src="config-paypal.js"></script>

<!-- Integración PayPal -->
<script src="js/paypal-integration.js"></script>
```

### Crear Botón de Pago:
```javascript
// Ejemplo para Cresalia Jobs
const contenedor = document.getElementById('paypal-button-container');

PayPalIntegration.crearBotonPayPal(
    'paypal-button-container',
    'Publicación de Oferta - Cresalia Jobs',
    1.00, // $1 USD (≈ AR$ 1,000)
    `cresalia_jobs_${ofertaId}_${Date.now()}`,
    (detalles, data) => {
        // Pago exitoso
        console.log('✅ Pago completado:', detalles);
        // Redirigir a página de éxito
        window.location.href = '/cresalia-jobs/index.html?pago=exitoso';
    },
    (error) => {
        // Error en el pago
        console.error('❌ Error en pago:', error);
        alert('Error al procesar el pago. Por favor, intentá de nuevo.');
    }
);
```

---

## 💰 COMISIONES Y COSTOS

### PayPal:
- **Comisión**: 3.49% + $0.49 USD por transacción
- **Para AR$ 1,000**: ≈ AR$ 507.45 (muy alto)
- **Para AR$ 2,000**: ≈ AR$ 1,014.90 (más razonable)

### Mercado Pago:
- **Comisión**: 2.9% + $0.20 USD por transacción
- **Para AR$ 1,000**: ≈ AR$ 429 (mejor)
- **Para AR$ 2,000**: ≈ AR$ 858 (mejor)

**Conclusión**: Para Argentina, **Mercado Pago es mejor**. Usa PayPal solo para pagos internacionales.

---

## 📝 NOTAS IMPORTANTES

1. **Seguridad**: 
   - `PAYPAL_CLIENT_SECRET` **NUNCA** debe estar en el código del cliente
   - Solo se usa en el backend para verificar pagos

2. **Pruebas**:
   - Usa el ambiente **Sandbox** para probar
   - Usa tarjetas de prueba de PayPal

3. **Webhooks**:
   - Configura webhooks en PayPal para recibir notificaciones de pagos
   - URL: `https://tu-dominio.com/api/paypal/webhook`

4. **Moneda**:
   - PayPal usa USD como base
   - Convierte AR$ a USD antes de crear la orden
   - Tipo de cambio: Usar API de tipo de cambio o fijo

---

## 🎯 RECOMENDACIÓN FINAL

### Para Suscripciones del E-commerce:
- ✅ Usa los **links de pago** que ya tienes (funciona bien)
- ✅ O integra el botón de PayPal para mejor UX

### Para Cresalia Jobs:
- ✅ **Principal**: Mercado Pago (AR$ 1,000 / AR$ 2,000)
- ✅ **Alternativa**: PayPal (solo para pagos internacionales o si el empleador lo prefiere)
- ✅ **Mínimo PayPal**: AR$ 2,000 (para que sea rentable)

---

**Creado por**: Crisla & Claude 💜
**Fecha**: Enero 2025









