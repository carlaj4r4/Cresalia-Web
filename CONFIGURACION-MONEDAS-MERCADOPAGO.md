# 💱 CONFIGURACIÓN DE MONEDAS - MERCADO PAGO

## ⚠️ IMPORTANTE: Monedas y Cuentas de Mercado Pago

### 📋 ¿Qué pasa si alguien paga en dólares?

**Respuesta corta**: **NO**, el pago en dólares **NO funcionará** si tu cuenta de Mercado Pago no tiene habilitada esa moneda.

### 🔍 Cómo funciona Mercado Pago con monedas:

1. **ARS (Pesos Argentinos)**:
   - ✅ Funciona por defecto en todas las cuentas de Mercado Pago Argentina
   - ✅ No requiere configuración adicional

2. **USD (Dólares)**:
   - ⚠️ **Requiere habilitación manual** en tu cuenta de Mercado Pago
   - ⚠️ Debes activar "Recibir pagos en dólares" en la configuración de tu cuenta
   - ❌ Si no está habilitado, el pago **fallará** o **no se procesará**

3. **Otras monedas**:
   - Similar a USD, requieren habilitación previa

### 🛠️ Configuración Actual en Cresalia:

**Moneda por defecto**: `ARS` (Pesos Argentinos)

```javascript
// En mercado-pago-integration.js
currency: 'ARS',  // Solo acepta pesos argentinos por ahora
```

### ✅ Recomendaciones:

1. **Por ahora, mantener solo ARS**:
   - ✅ Funciona inmediatamente
   - ✅ No requiere configuración adicional
   - ✅ Compatible con todas las cuentas de Mercado Pago Argentina

2. **Si quieres aceptar USD en el futuro**:
   - Habilitar "Recibir pagos en dólares" en tu cuenta de Mercado Pago
   - Actualizar la configuración en `mercado-pago-integration.js`:
     ```javascript
     currency: 'USD',  // O permitir ambas: ['ARS', 'USD']
     ```

3. **Validación de moneda**:
   - El sistema actualmente solo permite ARS
   - Si intentas procesar un pago en USD sin tenerlo habilitado, Mercado Pago rechazará el pago

### 🔒 Seguridad:

- ✅ La moneda se valida antes de crear la preferencia
- ✅ Si la cuenta no soporta la moneda, Mercado Pago devuelve un error
- ✅ El usuario verá un mensaje claro de error

### 📝 Nota Importante:

**Si alguien intenta pagar en dólares y tu cuenta no lo tiene habilitado:**
- ❌ El pago **NO se procesará**
- ❌ Mercado Pago devolverá un error
- ✅ El usuario verá un mensaje de error claro
- ✅ **NO se perderá dinero** - simplemente no se procesará el pago

**Recomendación**: Mantener solo ARS hasta que habilites USD en tu cuenta de Mercado Pago.

