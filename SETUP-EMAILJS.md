# 📧 **Guía de Configuración: EmailJS - Sistema de Notificaciones**

> ⚠️ **NOTA:** Este servicio **NO se está usando actualmente**. Cresalia usa **Brevo** para el envío de emails. Esta guía se mantiene solo como documentación de referencia.

## 📋 **¿Qué es EmailJS?**

EmailJS es un servicio **GRATUITO** que permite enviar emails desde tu aplicación web **sin necesidad de un servidor backend**.

### **Características:**
- ✅ **Gratis** hasta 200 emails/mes
- ✅ Sin backend necesario
- ✅ Fácil de configurar
- ✅ Plantillas personalizables
- ✅ Múltiples proveedores (Gmail, Outlook, etc.)

---

## 🚀 **CONFIGURACIÓN PASO A PASO**

### **PASO 1: Crear Cuenta en EmailJS**

1. Ve a: **https://www.emailjs.com/**
2. Click en **"Sign Up" (Registrarse)**
3. Completa:
   - Email: `cresalia25@gmail.com` (NOTA: Este servicio NO se está usando actualmente, se usa Brevo)
   - Contraseña: (crea una segura)
4. Verifica tu email
5. ¡Listo! Ya tienes cuenta

---

### **PASO 2: Conectar tu Email (Gmail)**

1. En el dashboard de EmailJS, ve a **"Email Services"**
2. Click en **"Add New Service"**
3. Selecciona **"Gmail"**
4. Te pedirá conectar tu cuenta de Gmail
5. Autoriza EmailJS
6. **Copia el "Service ID"** (ej: `service_abc123`)
7. Guárdalo - lo necesitaremos

---

### **PASO 3: Crear Plantillas de Email**

#### **Template 1: Confirmación para el Cliente**

1. Ve a **"Email Templates"**
2. Click en **"Create New Template"**
3. Completa:
   - **Template Name:** `Confirmación de Reserva - Cliente`
   - **Template ID:** `template_reserva_cliente`

4. **Subject (Asunto):**
```
🎉 Reserva Confirmada - {{servicio_nombre}}
```

5. **Content (Contenido):**
Copia el HTML de `TEMPLATE_EMAIL_CLIENTE` del archivo `email-notifications.js` (líneas 170-220)

6. **Variables a usar:**
```
{{to_name}}           - Nombre del cliente
{{from_name}}         - Nombre de la tienda
{{servicio_nombre}}   - Nombre del servicio
{{fecha}}             - Fecha de la reserva
{{hora}}              - Hora de la reserva
{{duracion}}          - Duración
{{precio}}            - Precio
{{numero_reserva}}    - Número de reserva
{{notas}}             - Notas adicionales
{{tienda_email}}      - Email del proveedor
{{tienda_telefono}}   - Teléfono del proveedor
{{tienda_direccion}}  - Dirección del proveedor
```

7. Click en **"Save"**

---

#### **Template 2: Notificación para el Proveedor**

1. Click en **"Create New Template"**
2. Completa:
   - **Template Name:** `Nueva Reserva - Proveedor`
   - **Template ID:** `template_reserva_proveedor`

3. **Subject:**
```
🔔 Nueva Reserva: {{servicio_nombre}} - {{cliente_nombre}}
```

4. **Content:**
Copia el HTML de `TEMPLATE_EMAIL_PROVEEDOR` del archivo `email-notifications.js` (líneas 222-270)

5. **Variables adicionales:**
```
{{cliente_nombre}}    - Nombre del cliente
{{cliente_email}}     - Email del cliente
{{cliente_telefono}}  - Teléfono del cliente
```

6. Click en **"Save"**

---

#### **Template 3: Cancelación (Opcional)**

1. **Template ID:** `template_cancelacion`
2. **Subject:**
```
❌ Reserva Cancelada - {{servicio_nombre}}
```

3. **Content:**
```html
Hola {{to_name}},

Tu reserva ha sido cancelada:

Número de Reserva: {{numero_reserva}}
Servicio: {{servicio_nombre}}
Fecha: {{fecha}}
Hora: {{hora}}

Motivo: {{motivo}}

Si deseas reprogramar, contáctanos a {{tienda_email}}

Gracias por tu comprensión,
{{from_name}}
```

---

### **PASO 4: Obtener tu Public Key**

1. Ve a **"Account" → "General"**
2. Busca **"Public Key"**
3. **Copia el valor** (ej: `gH9x_AbCdEfGhIjKl`)
4. Guárdalo

---

### **PASO 5: Configurar en CRESALIA**

1. Abre el archivo: `email-notifications.js`
2. Busca las líneas 17-23:

```javascript
const EMAIL_CONFIG = {
    serviceID: 'TU_SERVICE_ID',     // ← Pega tu Service ID aquí
    publicKey: 'TU_PUBLIC_KEY',      // ← Pega tu Public Key aquí
    templates: {
        reservaCliente: 'template_reserva_cliente',
        reservaProveedor: 'template_reserva_proveedor',
        cancelacion: 'template_cancelacion'
    }
};
```

3. Reemplaza:
   - `TU_SERVICE_ID` con el Service ID que copiaste (Paso 2)
   - `TU_PUBLIC_KEY` con el Public Key que copiaste (Paso 4)

4. **Ejemplo:**
```javascript
const EMAIL_CONFIG = {
    serviceID: 'service_abc123',
    publicKey: 'gH9x_AbCdEfGhIjKl',
    templates: {
        reservaCliente: 'template_reserva_cliente',
        reservaProveedor: 'template_reserva_proveedor',
        cancelacion: 'template_cancelacion'
    }
};
```

5. Guarda el archivo

---

## 🧪 **PROBAR EL SISTEMA**

### **Test 1: Verificar Carga**

1. Abre el panel de admin
2. Abre la consola (F12)
3. Deberías ver:
```
✅ EmailJS inicializado
```

Si dice:
```
ℹ️ EmailJS no configurado - emails deshabilitados
```
Significa que aún no has configurado las credenciales en `email-notifications.js`

---

### **Test 2: Probar Envío de Email**

1. Ve a **"Historial de Reservas"**
2. Click en **"Agregar Reserva de Prueba"**
3. Deberías ver:
```
✅ Reserva creada y emails enviados
```

4. **Revisa tu email** (el que configuraste en EmailJS)
5. Deberías recibir **2 emails**:
   - Uno como "cliente" (confirmación)
   - Uno como "proveedor" (notificación)

---

### **Test 3: Ver Logs**

En la consola verás:
```
✅ Email de confirmación enviado al cliente: juan@ejemplo.com
✅ Notificación enviada al proveedor: tu-email@gmail.com
✅ Reserva guardada en Supabase
```

---

## 💰 **PLANES DE EMAILJS**

### **Plan Gratuito (FREE):**
- ✅ 200 emails/mes
- ✅ 2 servicios de email
- ✅ Plantillas ilimitadas
- ✅ Perfecto para empezar

### **Plan Personal ($15/mes):**
- ✅ 10,000 emails/mes
- ✅ Sin branding de EmailJS
- ✅ 5 servicios de email

### **Plan Pro ($35/mes):**
- ✅ 50,000 emails/mes
- ✅ 10 servicios de email
- ✅ Soporte prioritario

**Recomendación:** Comienza con el plan gratuito. Cuando tengas 200+ reservas/mes, habrás ganado suficiente para pagar el plan Personal.

---

## 🔧 **PERSONALIZACIÓN AVANZADA**

### **Cambiar el Remitente:**

Por defecto, los emails se envían desde tu email configurado. Para personalizarlo:

1. En EmailJS, ve a **"Email Services"**
2. Click en tu servicio
3. Configura:
   - **From Name:** `CRESALIA Reservas`
   - **From Email:** `reservas@cresalia.com` (si tienes dominio)

---

### **Agregar Logo de CRESALIA:**

En las plantillas de email, agrega:
```html
<div class="header">
    <img src="https://tu-servidor.com/logo-cresalia.png" alt="CRESALIA" style="width: 150px;">
    <h1>¡Reserva Confirmada!</h1>
</div>
```

---

### **Personalizar para Planes:**

#### **Plan BÁSICO:**
- Logo de CRESALIA
- "Powered by CRESALIA SaaS"

#### **Plan PRO:**
- Logo del proveedor
- Colores personalizados
- Sin branding de CRESALIA

#### **Plan ENTERPRISE:**
- Email desde dominio del cliente
- Plantillas 100% personalizadas
- Sin menciones a CRESALIA

---

## 🚨 **TROUBLESHOOTING**

### **Problema: "EmailJS no está cargado"**
**Solución:** Verifica que `email-notifications.js` esté incluido en `admin.html`

### **Problema: "Emails no se envían"**
**Soluciones:**
1. Verifica tu Service ID y Public Key
2. Revisa que los templates existan
3. Verifica tu cuota de emails (200/mes gratis)
4. Revisa la consola para ver errores específicos

### **Problema: "Email va a spam"**
**Soluciones:**
1. Verifica tu cuenta de Gmail
2. Configura SPF/DKIM (avanzado)
3. Usa un dominio personalizado
4. Pide a los clientes agregar tu email a contactos

---

## 📊 **MÉTRICAS Y MONITOREO**

EmailJS te permite ver:
- 📈 Emails enviados (dashboard)
- ✅ Tasa de entrega
- ❌ Emails fallidos
- 📊 Uso de cuota mensual

---

## 🎯 **PRÓXIMOS PASOS**

1. ✅ Crea tu cuenta en EmailJS
2. ✅ Conecta tu Gmail
3. ✅ Crea los 2 templates (cliente y proveedor)
4. ✅ Copia las credenciales a `email-notifications.js`
5. ✅ Prueba con "Agregar Reserva de Prueba"
6. ✅ Verifica que lleguen los emails
7. 🚀 ¡Lanza CRESALIA con notificaciones automáticas!

---

## ❤️ **MENSAJE DE CRISLA**

Este sistema hará que tu SaaS sea **mucho más profesional**:
- Los clientes recibirán confirmaciones instantáneas
- Los proveedores nunca perderán una reserva
- Todo automático, sin intervención manual

**Una vez configurado, ¡nunca tendrás que pensarlo de nuevo!** 🎉

---

**¿Necesitas ayuda configurando EmailJS? Házmelo saber** 💜




















