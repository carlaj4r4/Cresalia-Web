# 💳 Guía Completa: Mercado Pago CheckoutAPI + Protección de Anonimato

## 🎯 ¿Qué es CheckoutAPI?

CheckoutAPI es la solución de Mercado Pago para **múltiples métodos de pago**. Permite:
- ✅ Tarjetas de crédito y débito
- ✅ Efectivo (Rapipago, Pago Fácil)
- ✅ Transferencias bancarias
- ✅ Dinero en cuenta de Mercado Pago
- ✅ Pagos en cuotas

---

## 🔐 Paso 1: Obtener tus Credenciales de Mercado Pago

### 1.1 Acceder a tu Panel de Mercado Pago

1. **Iniciá sesión:**
   - Andá a: https://www.mercadopago.com.ar/
   - Ingresá con tu cuenta

2. **Accedé a Credenciales:**
   - En el menú lateral, buscá **"Desarrolladores"** o **"Tu negocio"**
   - Hacé clic en **"Credenciales"** o **"Tus integraciones"**
   - Vas a ver dos secciones:
     - **Credenciales de prueba (Sandbox)**: Para testear
     - **Credenciales de producción**: Para recibir pagos reales

### 1.2 Anotar tus Credenciales

Necesitás estas dos claves:

1. **Public Key** (Clave Pública):
   - Empieza con `APP_USR-...` (producción)
   - Empieza con `TEST-...` (sandbox)
   - Se usa en el frontend (es segura de compartir)

2. **Access Token** (Token de Acceso):
   - Empieza con `APP_USR-...` (producción)
   - Empieza con `TEST-...` (sandbox)
   - ⚠️ **ES SECRETA** - Solo se usa en el backend
   - **NUNCA** la compartas públicamente

---

## 🔒 Paso 2: Proteger tu Anonimato con Alias

### 2.1 ¿Qué es el Alias/Statement Descriptor?

El **Statement Descriptor** (o alias) es la descripción que aparece en el estado de cuenta del cliente. Es lo que protege tu anonimato.

**Ejemplo:**
- ❌ Sin alias: "CARLA GARCIA - CRESALIA"
- ✅ Con alias: "CRESALIA" o "CRESALIA TECH"

### 2.2 Configurar el Alias en Mercado Pago

1. **En tu Panel de Mercado Pago:**
   - Andá a **"Tu negocio"** → **"Configuración"**
   - Buscá **"Descripción en estado de cuenta"** o **"Statement Descriptor"**
   - Configurá un alias que **NO incluya tu nombre real**
   - Ejemplos seguros:
     - `CRESALIA`
     - `CRESALIA TECH`
     - `CRESALIA SAAS`
     - `CRESALIA PLATFORM`

2. **Límites del Alias:**
   - Máximo 22 caracteres
   - Solo letras, números y espacios
   - No puede contener caracteres especiales

### 2.3 Usar el Alias en el Código

El alias se configura en el endpoint `api/mercadopago-preference.js`:

```javascript
statement_descriptor: 'Cresalia',  // 🔒 Protege tu anonimato
```

**Recomendación:**
- Usá un alias genérico como "Cresalia" o "Cresalia Tech"
- **NO** uses tu nombre real
- **NO** uses información personal

---

## 🚀 Paso 3: Configurar en Vercel

### 3.1 Agregar Variables de Entorno

1. **Abrí tu proyecto en Vercel:**
   - Andá a: https://vercel.com/
   - Ingresá con tu cuenta
   - Seleccioná tu proyecto **"cresalia-web"**

2. **Accedé a Variables de Entorno:**
   - En el menú del proyecto, hacé clic en **"Settings"**
   - En el menú lateral, buscá **"Environment Variables"**
   - Hacé clic en **"Add New"**

3. **Agregá las siguientes variables:**

   **Para Producción:**
   ```
   MERCADOPAGO_PUBLIC_KEY = APP_USR-tu-clave-publica-aqui
   MERCADOPAGO_ACCESS_TOKEN = APP_USR-tu-access-token-aqui
   ```

   **Para Preview/Development (opcional, usar credenciales de sandbox):**
   ```
   MERCADOPAGO_PUBLIC_KEY = TEST-tu-clave-publica-sandbox
   MERCADOPAGO_ACCESS_TOKEN = TEST-tu-access-token-sandbox
   ```

4. **Seleccioná los entornos:**
   - Para **MERCADOPAGO_PUBLIC_KEY**: Marcá **Production**, **Preview**, y **Development**
   - Para **MERCADOPAGO_ACCESS_TOKEN**: Marcá **Production**, **Preview**, y **Development**

5. **Guardá los cambios:**
   - Hacé clic en **"Save"**
   - Esperá a que se guarden (puede tardar unos segundos)

### 3.2 Verificar que las Variables Estén Configuradas

1. **En Vercel:**
   - Volvé a **"Settings" → "Environment Variables"**
   - Deberías ver tus variables listadas
   - Si no aparecen, esperá unos minutos y recargá la página

2. **Verificar en el código:**
   - Las variables se cargan automáticamente en `js/inject-env-vars.js`
   - Se exponen como `window.__MERCADOPAGO_PUBLIC_KEY__` y `window.__MERCADOPAGO_ACCESS_TOKEN__`

---

## 🔄 Paso 4: Re-deployar el Proyecto

1. **Hacé un nuevo deploy:**
   - Volvé a la pestaña **"Deployments"**
   - Hacé clic en los **"..."** (tres puntos) del último deploy
   - Seleccioná **"Redeploy"**
   - O simplemente hacé un nuevo commit en GitHub y se deployará automáticamente

2. **Verificar que funcione:**
   - Después del deploy, probá crear una preferencia de pago
   - Verificá que no aparezcan errores en los logs de Vercel

---

## 🧪 Paso 5: Probar con CheckoutAPI

### 5.1 Crear una Preferencia de Pago

**Desde el frontend (JavaScript):**

```javascript
async function crearPreferenciaPago() {
    const items = [
        {
            title: 'Plan Básico - Cresalia',
            description: 'Suscripción mensual al plan básico',
            quantity: 1,
            unit_price: 29.99,
            currency_id: 'ARS'
        }
    ];
    
    const payer = {
        name: 'Cliente',
        surname: 'Demo',
        email: 'cliente@ejemplo.com'
    };
    
    const back_urls = {
        success: 'https://cresalia-web.vercel.app/pago-exitoso',
        failure: 'https://cresalia-web.vercel.app/pago-fallido',
        pending: 'https://cresalia-web.vercel.app/pago-pendiente'
    };
    
    const response = await fetch('/api/mercadopago-preference', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items,
            payer,
            back_urls,
            external_reference: `pago_${Date.now()}`,
            statement_descriptor: 'Cresalia'  // 🔒 Alias para proteger anonimato
        })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Redirigir al checkout de Mercado Pago
        window.location.href = data.init_point;
    } else {
        console.error('Error:', data.message);
    }
}
```

### 5.2 Probar con Tarjetas de Prueba

**En modo Sandbox (TEST):**

- **Visa**: `4509 9535 6623 3704`
- **Mastercard**: `5031 7557 3453 0604`
- **CVV**: Cualquier 3 dígitos (ej: `123`)
- **Fecha**: Cualquier fecha futura (ej: `12/25`)
- **Nombre**: Cualquier nombre
- **DNI**: Cualquier número (ej: `12345678`)

**Estado de los pagos:**
- **Aprobado**: Usá el CVV `123`
- **Rechazado**: Usá el CVV `000`
- **Pendiente**: Usá el CVV `999`

---

## 🔔 Paso 6: Configurar Webhooks (Opcional)

Los webhooks permiten que Mercado Pago te notifique cuando un pago se completa.

### 6.1 Crear Endpoint de Webhook

Ya existe en: `api/webhook-mercadopago.js`

### 6.2 Configurar en Mercado Pago

1. **En tu Panel de Mercado Pago:**
   - Andá a **"Desarrolladores"** → **"Webhooks"**
   - Agregá la URL: `https://cresalia-web.vercel.app/api/webhook-mercadopago`
   - Seleccioná los eventos que querés recibir:
     - `payment`
     - `merchant_order`

---

## 🔒 Paso 7: Protección de Anonimato - Checklist

### ✅ Checklist de Seguridad

- [ ] **Alias configurado en Mercado Pago**: No incluye tu nombre real
- [ ] **Statement Descriptor**: Usa un alias genérico (ej: "Cresalia")
- [ ] **Access Token**: Solo en Vercel (variables de entorno), nunca en GitHub
- [ ] **Public Key**: Puede estar en el frontend (es segura)
- [ ] **Datos del pagador**: No se almacenan datos sensibles innecesarios
- [ ] **Webhooks**: Verificá que las notificaciones sean de Mercado Pago (firma)

### 🛡️ Mejores Prácticas

1. **No uses tu nombre real en el alias:**
   - ❌ "CARLA GARCIA"
   - ✅ "CRESALIA"

2. **No almacenes datos sensibles:**
   - ❌ DNI completo
   - ❌ Dirección completa
   - ✅ Solo email y nombre (mínimo necesario)

3. **Verificá los webhooks:**
   - Siempre validá que las notificaciones vengan de Mercado Pago
   - Usá la firma de webhook para verificar autenticidad

---

## 📊 Paso 8: Verificar que Funcione

### 8.1 Probar en Modo Sandbox

1. **Usá credenciales de prueba:**
   - Configurá `MERCADOPAGO_ACCESS_TOKEN` con un token que empiece con `TEST-...`
   - Hacé un deploy
   - Probá crear una preferencia de pago

2. **Verificar el flujo:**
   - Crear preferencia → Redirigir a checkout → Pagar con tarjeta de prueba → Verificar que el pago se procese

### 8.2 Probar en Producción

1. **Usá credenciales de producción:**
   - Configurá `MERCADOPAGO_ACCESS_TOKEN` con un token que empiece con `APP_USR-...`
   - Hacé un deploy
   - Probá con un pago real pequeño (ej: $10)

2. **Verificar el flujo:**
   - Crear preferencia → Redirigir a checkout → Pagar con tarjeta real → Verificar que el pago se procese → Verificar que el dinero llegue a tu cuenta

---

## ❓ Preguntas Frecuentes

### ¿Cómo sé si mi Access Token está activo?

- Probá crear una preferencia de pago
- Si recibís un error `401 Unauthorized`, el token no es válido
- Si recibís un error `400 Bad Request`, el token es válido pero hay un problema con los datos

### ¿Puedo usar el mismo Access Token en desarrollo y producción?

- **No**. Usá credenciales de prueba (TEST) para desarrollo
- Usá credenciales de producción (APP_USR) solo en producción

### ¿Cómo cambio el alias/statement descriptor?

- Configurálo en el endpoint `api/mercadopago-preference.js`:
  ```javascript
  statement_descriptor: 'TuAliasAqui'
  ```
- También podés configurarlo en el panel de Mercado Pago

### ¿Qué pasa si no configuro el alias?

- Mercado Pago usará el nombre de tu cuenta por defecto
- Esto puede exponer tu identidad real
- **Siempre configurá un alias genérico**

---

## 🎉 ¡Listo!

Una vez que hayas configurado todo:

1. ✅ Las credenciales están en Vercel (variables de entorno)
2. ✅ El alias está configurado para proteger tu anonimato
3. ✅ El endpoint `api/mercadopago-preference.js` está listo
4. ✅ Los webhooks están configurados (opcional)
5. ✅ Podés aceptar múltiples métodos de pago

**Los usuarios podrán pagar con:**
- 💳 Tarjetas de crédito y débito
- 💵 Efectivo (Rapipago, Pago Fácil)
- 🏦 Transferencias bancarias
- 📱 Dinero en cuenta de Mercado Pago
- 📅 Pagos en cuotas

---

## 🆘 ¿Necesitás Ayuda?

Si tenés problemas:

1. **Verificá las credenciales:**
   - ¿Están correctas?
   - ¿Están configuradas en Vercel?
   - ¿Hiciste un nuevo deploy después de configurarlas?

2. **Revisá los logs:**
   - En Vercel: **"Deployments"** → **"Functions"** → **"Logs"**
   - Buscá errores relacionados con Mercado Pago

3. **Verificá el alias:**
   - ¿Está configurado en el código?
   - ¿Tiene menos de 22 caracteres?
   - ¿No incluye caracteres especiales?

---

¡Éxitos con tus pagos! 💜


