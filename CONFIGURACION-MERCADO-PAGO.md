# 🏦 Configuración de Mercado Pago para FRIOCAS

## 📋 Requisitos Previos

1. **Cuenta de Mercado Pago**: Registrarse en [mercadopago.com.ar](https://mercadopago.com.ar)
2. **Cuenta verificada**: Completar la verificación de identidad
3. **Datos bancarios**: Configurar cuenta bancaria para recibir pagos

## 🔧 Pasos para Configurar

### 1. Obtener Credenciales de API

1. Inicia sesión en tu cuenta de Mercado Pago
2. Ve a **Desarrolladores** > **Tus integraciones**
3. Crea una nueva aplicación o usa la existente
4. Copia las siguientes credenciales:
   - **Public Key** (Clave Pública)
   - **Access Token** (Token de Acceso)

### 2. Configurar el Código

En el archivo `script-friocas.js`, busca la sección:

```javascript
const MERCADO_PAGO_CONFIG = {
    publicKey: 'TEST-12345678-1234-1234-1234-123456789012', // REEMPLAZAR
    accessToken: 'TEST-1234567890123456789012345678901234567890-123456-1234567890123456789012345678901234567890', // REEMPLAZAR
    preferenceId: null
};
```

**Reemplaza con tus credenciales reales:**

```javascript
const MERCADO_PAGO_CONFIG = {
    publicKey: 'APP-12345678-1234-1234-1234-123456789012', // Tu clave pública real
    accessToken: 'APP-1234567890123456789012345678901234567890-123456-1234567890123456789012345678901234567890', // Tu token de acceso real
    preferenceId: null
};
```

### 3. Configurar URLs de Retorno

En las funciones `crearPreferenciaProducto` y `crearPreferenciaCarrito`, actualiza las URLs:

```javascript
back_urls: {
    success: 'https://tu-dominio.com/success.html',
    failure: 'https://tu-dominio.com/failure.html',
    pending: 'https://tu-dominio.com/pending.html'
},
notification_url: 'https://tu-dominio.com/webhook-mercadopago'
```

**Reemplaza `tu-dominio.com` con tu dominio real.**

### 4. Configurar Webhook (Opcional)

Para recibir notificaciones automáticas de pagos:

1. Crea un archivo `webhook-mercadopago.php` en tu servidor
2. Configura la URL en Mercado Pago: `https://tu-dominio.com/webhook-mercadopago`
3. El webhook recibirá notificaciones de cambios de estado de pago

## 🧪 Modo de Prueba vs Producción

### Modo de Prueba (Sandbox)
- Usa credenciales que empiecen con `TEST-`
- Los pagos son simulados
- Perfecto para pruebas

### Modo de Producción
- Usa credenciales que empiecen con `APP-`
- Los pagos son reales
- Solo usar cuando esté listo para producción

## 💳 Métodos de Pago Soportados

Mercado Pago soporta automáticamente:

- ✅ **Tarjetas de crédito y débito** (Visa, Mastercard, American Express, etc.)
- ✅ **Transferencias bancarias** (CBU/CVU)
- ✅ **Pago en efectivo** (PagoFácil, RapiPago, Boleto Bancario)
- ✅ **Billeteras digitales** (MODO, Ualá, etc.)
- ✅ **Cuotas sin interés** (configurable)

## 📊 Comisiones

- **Tarjetas de crédito**: 3.99% + IVA
- **Tarjetas de débito**: 2.99% + IVA
- **Transferencias**: 1.99% + IVA
- **Efectivo**: 3.99% + IVA

## 🔒 Seguridad

- ✅ **PCI DSS Compliant**: Cumple estándares de seguridad
- ✅ **Encriptación SSL**: Todos los datos están encriptados
- ✅ **Fraude Protection**: Protección automática contra fraudes
- ✅ **Compliance**: Cumple regulaciones argentinas

## 📱 Funcionalidades Implementadas

### Para Clientes:
- ✅ **Checkout integrado** con Mercado Pago
- ✅ **Múltiples métodos** de pago
- ✅ **Páginas de respuesta** (éxito, fallo, pendiente)
- ✅ **Notificaciones** automáticas
- ✅ **Facturación automática** después del pago

### Para FRIOCAS:
- ✅ **Procesamiento automático** de pagos
- ✅ **Notificaciones** de estado de pago
- ✅ **Historial** de transacciones
- ✅ **Reportes** de ventas
- ✅ **Gestión** de reembolsos

## 🚀 Próximos Pasos

1. **Configurar credenciales** reales
2. **Probar en modo sandbox** primero
3. **Configurar webhook** para notificaciones
4. **Activar modo producción** cuando esté listo
5. **Configurar notificaciones** por email/SMS

## 📞 Soporte

- **Mercado Pago**: [developers.mercadopago.com](https://developers.mercadopago.com)
- **Documentación**: [mercadopago.com.ar/developers](https://mercadopago.com.ar/developers)
- **Soporte técnico**: [mercadopago.com.ar/ayuda](https://mercadopago.com.ar/ayuda)

## ⚠️ Notas Importantes

1. **Nunca compartas** tus credenciales de acceso
2. **Usa HTTPS** en producción
3. **Prueba exhaustivamente** antes de activar
4. **Mantén actualizado** el SDK de Mercado Pago
5. **Monitorea** las transacciones regularmente

---

**¡FRIOCAS ahora está listo para procesar pagos reales con Mercado Pago!** 🎉

