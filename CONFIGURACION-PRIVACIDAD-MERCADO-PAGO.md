# 🔒 CONFIGURACIÓN DE PRIVACIDAD - MERCADO PAGO

**Para:** Mi querida co-fundadora Carla 💜  
**Fecha:** Diciembre 2024  
**Objetivo:** Asegurar que solo se muestre "Cresalia" en los pagos, sin exponer datos personales

---

## ✅ **LO QUE SE CONFIGURÓ:**

### 1. **Statement Descriptor**
En todas las preferencias de Mercado Pago, se configuró:
```javascript
statement_descriptor: 'Cresalia'
```
**Resultado:** Los clientes verán "Cresalia" en su resumen de cuenta, NO tu nombre personal.

---

### 2. **Datos del Payer (Pagador)**
Se modificó para incluir solo el email (necesario para verificación):
```javascript
payer: {
    // Solo email para verificación interna
    email: datosUsuario.email
    // NO se incluye 'name' con datos personales
}
```

---

### 3. **Metadata Limpia**
Se eliminaron datos personales de los metadatos:
```javascript
metadata: {
    plan: planId,
    plataforma: 'cresalia',
    tipo: 'suscripcion'
    // NO incluir: usuario_email, usuario_nombre, etc.
}
```

---

### 4. **External Reference**
Se cambió para usar solo identificadores genéricos:
```javascript
external_reference: `cresalia_${planId}_${Date.now()}`
// En lugar de: `${datosUsuario.email}_${planId}_${Date.now()}`
```

---

## 📝 **ARCHIVOS MODIFICADOS:**

1. ✅ `js/mercado-pago-integration.js`
   - Agregado `statement_descriptor: 'Cresalia'`
   - Eliminado `name` del payer
   - Limpiado metadata

2. ✅ `js/payment-system.js`
   - Agregado `statement_descriptor: 'Cresalia'`
   - Eliminado `name` del payer
   - Agregado metadata limpio

3. ✅ `js/sistema-cresalia-jobs.js`
   - Configuración de privacidad implementada
   - Función `obtenerConfigMercadoPagoPrivada()` creada

---

## 🎯 **LO QUE VERÁN TUS CLIENTES:**

✅ **En su resumen de cuenta de Mercado Pago:**
- Nombre: "Cresalia" (NO tu nombre personal)
- Descripción: "Suscripción Cresalia - [Plan]" o "Publicación de Oferta - Cresalia Jobs"

✅ **En su tarjeta de crédito/débito:**
- Descripción: "Cresalia" (máximo 22 caracteres)

✅ **NO verán:**
- ❌ Tu nombre completo
- ❌ Tu apellido
- ❌ Tu DNI
- ❌ Tu dirección personal
- ❌ Cualquier dato personal tuyo

---

## ⚠️ **IMPORTANTE:**

### **Lo que Mercado Pago necesita internamente:**
- ✅ Verificación de identidad (para cumplir con la ley)
- ✅ Email para comunicación
- ✅ Datos de facturación (si aplica)

### **Lo que NO se muestra públicamente:**
- ❌ Tu nombre personal
- ❌ Tu DNI
- ❌ Tu dirección personal
- ❌ Datos personales en metadata

---

## 🔧 **CONFIGURACIÓN EN TU CUENTA BUSINESS:**

Cuando crees tu cuenta Business de Mercado Pago, asegurate de:

1. **Nombre comercial:** "Cresalia" o "Cresalia Tech"
2. **Razón social:** Puede ser tu nombre legal para facturación, pero no se mostrará públicamente
3. **Alias:** Configurá un alias genérico (ej: "cresalia.pagos")
4. **Email comercial:** contacto@cresalia.com (si tenés dominio)

---

## 💡 **NOTAS ADICIONALES:**

- El `statement_descriptor` tiene un máximo de 22 caracteres
- Algunos bancos pueden mostrar información adicional, pero Mercado Pago solo enviará "Cresalia"
- Los datos de verificación son internos de Mercado Pago y no se muestran a clientes
- AFIP necesita saber quién factura, pero esa información es privada y no se muestra en los pagos

---

## ✅ **VERIFICACIÓN:**

Para verificar que funciona correctamente:

1. Crear una preferencia de pago en modo sandbox
2. Revisar que el `statement_descriptor` sea "Cresalia"
3. Verificar que no haya datos personales en metadata
4. Probar un pago y revisar cómo aparece en el resumen

---

**Mi querida co-fundadora, tu privacidad está protegida. Solo se mostrará "Cresalia" en los pagos.** 💜

---

*Carla & Claude - Diciembre 2024*

