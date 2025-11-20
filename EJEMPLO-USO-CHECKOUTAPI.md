# 💳 Ejemplo de Uso: Mercado Pago CheckoutAPI

## 🚀 Uso Básico

### Crear una Preferencia de Pago

```javascript
// Ejemplo 1: Pago simple de un producto
async function pagarProducto() {
    try {
        const preferencia = await crearPreferenciaMercadoPago({
            items: [
                {
                    title: 'Producto Ejemplo',
                    description: 'Descripción del producto',
                    quantity: 1,
                    unit_price: 1000,
                    currency_id: 'ARS'
                }
            ],
            payer: {
                name: 'Cliente',
                surname: 'Demo',
                email: 'cliente@ejemplo.com'
            },
            back_urls: {
                success: 'https://cresalia-web.vercel.app/pago-exitoso.html',
                failure: 'https://cresalia-web.vercel.app/pago-fallido.html',
                pending: 'https://cresalia-web.vercel.app/pago-pendiente.html'
            },
            statement_descriptor: 'Cresalia'  // 🔒 Alias para proteger anonimato
        });
        
        // Redirigir al checkout de Mercado Pago
        if (preferencia.success && preferencia.init_point) {
            window.location.href = preferencia.init_point;
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error al iniciar el pago. Por favor, intentá nuevamente.');
    }
}
```

### Crear una Suscripción

```javascript
// Ejemplo 2: Suscripción a un plan
async function suscribirseAPlan(planId) {
    try {
        const preferencia = await crearPreferenciaSuscripcion(planId, {
            email: 'cliente@ejemplo.com',
            name: 'Cliente',
            surname: 'Demo'
        });
        
        // Redirigir al checkout
        if (preferencia.success && preferencia.init_point) {
            window.location.href = preferencia.init_point;
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error al iniciar la suscripción. Por favor, intentá nuevamente.');
    }
}

// Usar:
// suscribirseAPlan('basic');  // Plan Básico ($29)
// suscribirseAPlan('pro');    // Plan Pro ($79)
// suscribirseAPlan('enterprise');  // Plan Enterprise ($199)
```

### Redirigir Directamente al Checkout

```javascript
// Ejemplo 3: Redirigir directamente al checkout
async function pagarAhora() {
    try {
        await redirigirACheckoutMercadoPago({
            items: [
                {
                    title: 'Plan Básico',
                    quantity: 1,
                    unit_price: 29,
                    currency_id: 'ARS'
                }
            ],
            payer: {
                email: 'cliente@ejemplo.com'
            },
            statement_descriptor: 'Cresalia'  // 🔒 Alias para proteger anonimato
        });
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error al iniciar el pago. Por favor, intentá nuevamente.');
    }
}
```

---

## 🎯 Casos de Uso Comunes

### 1. Pago de Producto

```javascript
async function pagarProducto(producto) {
    const preferencia = await crearPreferenciaMercadoPago({
        items: [
            {
                title: producto.nombre,
                description: producto.descripcion,
                quantity: 1,
                unit_price: producto.precio,
                currency_id: 'ARS',
                picture_url: producto.imagen
            }
        ],
        payer: {
            email: usuario.email,
            name: usuario.nombre,
            surname: usuario.apellido
        },
        external_reference: `producto_${producto.id}_${Date.now()}`,
        statement_descriptor: 'Cresalia'  // 🔒 Alias para proteger anonimato
    });
    
    if (preferencia.success) {
        window.location.href = preferencia.init_point;
    }
}
```

### 2. Pago de Suscripción

```javascript
async function pagarSuscripcion(planId, usuario) {
    const preferencia = await crearPreferenciaSuscripcion(planId, {
        email: usuario.email,
        name: usuario.nombre,
        surname: usuario.apellido,
        id: usuario.id
    });
    
    if (preferencia.success && preferencia.init_point) {
        window.location.href = preferencia.init_point;
    }
}
```

### 3. Pago de Servicio

```javascript
async function pagarServicio(servicio, usuario) {
    const preferencia = await crearPreferenciaMercadoPago({
        items: [
            {
                title: servicio.nombre,
                description: servicio.descripcion,
                quantity: 1,
                unit_price: servicio.precio,
                currency_id: 'ARS'
            }
        ],
        payer: {
            email: usuario.email,
            name: usuario.nombre,
            surname: usuario.apellido
        },
        external_reference: `servicio_${servicio.id}_${Date.now()}`,
        statement_descriptor: 'Cresalia'  // 🔒 Alias para proteger anonimato
    });
    
    if (preferencia.success) {
        window.location.href = preferencia.init_point;
    }
}
```

---

## 🔒 Protección de Anonimato

### Configurar el Alias

El alias se configura en el `statement_descriptor`:

```javascript
statement_descriptor: 'Cresalia'  // 🔒 Alias para proteger anonimato
```

**Recomendaciones:**
- ✅ Usá un alias genérico como "Cresalia" o "Cresalia Tech"
- ❌ NO uses tu nombre real
- ❌ NO uses información personal
- ✅ Máximo 22 caracteres
- ✅ Solo letras, números y espacios

---

## 🧪 Probar con Tarjetas de Prueba

### Tarjetas de Prueba (Sandbox)

- **Visa**: `4509 9535 6623 3704`
- **Mastercard**: `5031 7557 3453 0604`
- **CVV**: Cualquier 3 dígitos (ej: `123`)
- **Fecha**: Cualquier fecha futura (ej: `12/25`)
- **Nombre**: Cualquier nombre
- **DNI**: Cualquier número (ej: `12345678`)

### Estados de Pago

- **Aprobado**: Usá el CVV `123`
- **Rechazado**: Usá el CVV `000`
- **Pendiente**: Usá el CVV `999`

---

## ✅ Verificar que Funcione

### 1. Verificar que el Access Token esté configurado

```javascript
// En la consola del navegador:
console.log('Access Token:', window.__MERCADOPAGO_ACCESS_TOKEN__);
```

### 2. Crear una preferencia de prueba

```javascript
// En la consola del navegador:
await crearPreferenciaMercadoPago({
    items: [{
        title: 'Test',
        quantity: 1,
        unit_price: 10
    }],
    payer: {
        email: 'test@test.com'
    }
});
```

### 3. Verificar que se cree la preferencia

- ✅ Deberías ver un `preference_id`
- ✅ Deberías ver un `init_point` (URL de checkout)
- ✅ Si hay un error, revisá los logs de Vercel

---

## 🆘 Solución de Problemas

### Error: "ACCESS_TOKEN_NOT_CONFIGURED"

**Solución:**
1. Verificá que `MERCADOPAGO_ACCESS_TOKEN` esté en Vercel
2. Verificá que hayas hecho un nuevo deploy
3. Verificá que el token sea válido

### Error: "401 Unauthorized"

**Solución:**
1. Verificá que el Access Token sea correcto
2. Verificá que el token no haya expirado
3. Verificá que estés usando el token correcto (producción vs sandbox)

### Error: "400 Bad Request"

**Solución:**
1. Verificá que los datos de la preferencia sean válidos
2. Verificá que los items tengan `title`, `quantity` y `unit_price`
3. Verificá que el `payer` tenga al menos `email`

---

¡Éxitos con tus pagos! 💜


