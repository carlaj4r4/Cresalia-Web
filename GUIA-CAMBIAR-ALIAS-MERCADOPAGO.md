# 🔒 Guía: Cambiar el Alias (Statement Descriptor) en Mercado Pago

## 🎯 ¿Qué es el Alias?

El **alias** (Statement Descriptor) es lo que aparece en el estado de cuenta del cliente cuando paga. Es lo que **protege tu anonimato**.

**Ejemplo:**
- ❌ Sin alias: "CARLA GARCIA - CRESALIA" (expone tu nombre real)
- ✅ Con alias: "CRESALIA" (protege tu anonimato)

---

## 📋 Paso a Paso para Cambiar el Alias

### Paso 1: Acceder a Configuración

1. **Iniciá sesión en Mercado Pago:**
   - https://www.mercadopago.com.ar/
   - Ingresá con tu cuenta

2. **Accedé a Configuración:**
   - Menú lateral → **"Tu negocio"** → **"Configuración"**
   - O: **"Tu negocio"** → **"Pagos"** → **"Configuración"**

### Paso 2: Buscar "Descripción en Estado de Cuenta"

El alias puede aparecer con diferentes nombres:

- **"Descripción en estado de cuenta"** (más común)
- **"Statement Descriptor"**
- **"Alias comercial"**
- **"Descripción comercial"**
- **"Nombre en estado de cuenta"**
- **"Descripción para el comprador"**

**Dónde buscarlo:**
- En la sección **"Pagos"** o **"Configuración de pagos"**
- En la sección **"Información comercial"**
- En la sección **"Datos de tu negocio"**

### Paso 3: Configurar el Alias

1. **Escribí tu alias:**
   - Ejemplo: **"CRESALIA"**
   - **Límites:**
     - Máximo 22 caracteres
     - Solo letras, números y espacios
     - No caracteres especiales (@, #, $, %, etc.)

2. **Ejemplos seguros:**
   - ✅ `CRESALIA`
   - ✅ `CRESALIA TECH`
   - ✅ `CRESALIA SAAS`
   - ✅ `CRESALIA PLATFORM`

3. **Ejemplos que NO debés usar:**
   - ❌ `CARLA GARCIA` (expone tu nombre real)
   - ❌ `CARLA G. - CRESALIA` (expone tu nombre real)
   - ❌ `CRESALIA - CARLA` (expone tu nombre real)

### Paso 4: Guardar los Cambios

1. **Hacé clic en "Guardar" o "Aplicar"**
2. **Esperá a que se guarde** (puede tardar unos minutos)
3. **Verificá que se haya guardado** (deberías ver un mensaje de confirmación)

### Paso 5: Verificar que Funcione

1. **Hacé un pago de prueba:**
   - Usá una tarjeta de prueba
   - Completá el pago

2. **Verificá en tu estado de cuenta:**
   - Revisá tu estado de cuenta de tarjeta
   - Deberías ver el alias (ej: "CRESALIA")
   - Si aparece tu nombre real, el alias no está configurado correctamente

---

## ⏰ Tiempo de Actualización

### ¿Cuándo se aplica el cambio?

- **Tiempo estimado**: Hasta 24 horas
- **Pagos nuevos**: Usarán el nuevo alias inmediatamente
- **Pagos anteriores**: Mantendrán el alias anterior

### ⚠️ Importante

- **No es instantáneo**: Los cambios pueden tardar hasta 24 horas
- **Verificación**: Hacé un pago de prueba para verificar que funcione
- **Paciencia**: Si no aparece inmediatamente, esperá hasta 24 horas

---

## 🔍 Si No Encontrás la Opción

### Opción 1: Buscar en "Desarrolladores"

1. **Menú lateral** → **"Desarrolladores"** → **"Configuración"**
2. Buscá **"Statement Descriptor"** o **"Alias"**

### Opción 2: Contactar a Mercado Pago

1. **Soporte de Mercado Pago:**
   - https://www.mercadopago.com.ar/developers/es/support
   - Explicá que querés cambiar el "Statement Descriptor" o "Alias comercial"

### Opción 3: Configurarlo en el Código

El alias también se puede configurar en el código (en `api/mercadopago-preference.js`):

```javascript
statement_descriptor: 'Cresalia'  // 🔒 Protege tu anonimato
```

**Nota**: Esto funciona, pero es mejor configurarlo también en Mercado Pago para que sea consistente.

---

## ✅ Checklist Final

- [ ] Alias configurado en Mercado Pago
- [ ] Alias no incluye tu nombre real
- [ ] Alias tiene menos de 22 caracteres
- [ ] Alias solo tiene letras, números y espacios
- [ ] Cambios guardados en Mercado Pago
- [ ] Pago de prueba realizado
- [ ] Verificado que aparece el alias en el estado de cuenta

---

## 🆘 ¿Necesitás Ayuda?

Si no encontrás la opción:

1. **Buscá en diferentes secciones:**
   - "Tu negocio" → "Configuración"
   - "Tu negocio" → "Pagos" → "Configuración"
   - "Desarrolladores" → "Configuración"

2. **Contactá a Mercado Pago:**
   - Soporte: https://www.mercadopago.com.ar/developers/es/support
   - Explicá que querés cambiar el "Statement Descriptor"

3. **Usá el código como alternativa:**
   - El alias se puede configurar en `api/mercadopago-preference.js`
   - Aunque es mejor configurarlo también en Mercado Pago

---

¡Éxitos configurando tu alias! 💜


