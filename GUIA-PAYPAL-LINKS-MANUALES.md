# 🔗 GUÍA: USAR LINKS DE PAYPAL MANUALES EN CRESALIA JOBS

## 📋 LO QUE NECESITAS

### **1. Links de PayPal que ya tienes:**
- ✅ Suscripciones del e-commerce (Basic, Pro, Enterprise)
- ✅ Estos ya están funcionando

### **2. Links nuevos que necesitas crear:**
- 🔄 Publicación Básica Cresalia Jobs: **$1 USD**
- 🔄 Publicación Destacada Cresalia Jobs: **$2 USD**

---

## 🎯 CÓMO USAR LOS LINKS (Sin API)

### **En la página de Cresalia Jobs:**

Cuando un empleador quiere publicar una oferta:

1. **Mostrar opciones de pago:**
   - Si es de **Argentina**: Botón "Pagar con Mercado Pago" (AR$ 1,000 / AR$ 2,000)
   - Si es de **otro país**: Botones "Pagar con PayPal" ($1 / $2 USD)

2. **Para PayPal (links manuales):**
   ```html
   <!-- Botón para Publicación Básica -->
   <a href="TU_LINK_PAYPAL_BASICA" target="_blank" class="btn-paypal">
       <i class="fab fa-paypal"></i> Pagar $1 USD - Publicación Básica
   </a>
   
   <!-- Botón para Publicación Destacada -->
   <a href="TU_LINK_PAYPAL_DESTACADA" target="_blank" class="btn-paypal">
       <i class="fab fa-paypal"></i> Pagar $2 USD - Publicación Destacada
   </a>
   ```

3. **Después del pago:**
   - El usuario debe regresar a la página
   - O puedes pedirle que te envíe el comprobante
   - Tú activas manualmente la publicación

---

## 🔧 IMPLEMENTACIÓN SIMPLE

### **Opción A: Links Directos** (Más simple)

```html
<div class="opciones-pago">
    <h3>Elegir tipo de publicación</h3>
    
    <!-- Argentina -->
    <div class="pago-argentina">
        <h4>🇦🇷 Para Argentina</h4>
        <button onclick="pagarConMercadoPago('basica')">
            Publicación Básica - AR$ 1,000
        </button>
        <button onclick="pagarConMercadoPago('destacada')">
            Publicación Destacada - AR$ 2,000
        </button>
    </div>
    
    <!-- Otros países -->
    <div class="pago-internacional">
        <h4>🌍 Para otros países</h4>
        <a href="TU_LINK_PAYPAL_BASICA" target="_blank" class="btn-paypal">
            💳 Pagar $1 USD - Básica
        </a>
        <a href="TU_LINK_PAYPAL_DESTACADA" target="_blank" class="btn-paypal">
            💳 Pagar $2 USD - Destacada
        </a>
    </div>
</div>
```

### **Opción B: Códigos QR** (Más profesional)

```html
<div class="pago-qr">
    <h4>Escanea el código QR para pagar</h4>
    <img src="TU_QR_PAYPAL_BASICA" alt="QR Pago Básica">
    <p>Publicación Básica - $1 USD</p>
    
    <img src="TU_QR_PAYPAL_DESTACADA" alt="QR Pago Destacada">
    <p>Publicación Destacada - $2 USD</p>
</div>
```

---

## ⚠️ LIMITACIONES DE LINKS MANUALES

### **Lo que NO puedes hacer automáticamente:**
- ❌ Activar la publicación automáticamente al pagar
- ❌ Verificar si el pago se completó
- ❌ Notificar al usuario cuando se active

### **Lo que SÍ puedes hacer:**
- ✅ Mostrar los links/códigos QR
- ✅ El usuario paga directamente
- ✅ PayPal te notifica por email
- ✅ Tú activas manualmente la publicación

---

## 💡 MEJORA FUTURA: API DE PAYPAL

### **Cuando tengas tiempo, crea API keys:**

**Ventajas:**
- ✅ Todo automático
- ✅ Mejor experiencia
- ✅ Verificación automática

**Pasos:**
1. Ve a: https://developer.paypal.com/
2. Crea una aplicación
3. Obtén Client ID y Client Secret
4. Configura en Vercel
5. Usa el código que ya está listo (`js/paypal-integration.js`)

**Pero por ahora, los links funcionan perfectamente!** ✅

---

## 📝 RESUMEN

### **Para Argentina:**
- ✅ Mercado Pago (AR$ 1,000 / AR$ 2,000)
- ✅ Integración automática (ya está lista)

### **Para otros países:**
- ✅ PayPal con links manuales ($1 / $2 USD)
- ✅ Funciona perfectamente
- ✅ No necesitas API keys (por ahora)

### **Cuando quieras mejorar:**
- ✅ Crea API keys de PayPal
- ✅ Integración automática
- ✅ Mejor experiencia

---

**💜 Los links manuales son perfectos para empezar. Cuando tengas tiempo, podemos integrar la API!**

---

**Creado por**: Crisla & Claude 💜
**Fecha**: Enero 2025






