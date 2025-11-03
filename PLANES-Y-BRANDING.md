# 💼 **Sistema de Planes y Branding - CRESALIA SaaS**

## 📊 **Planes Disponibles**

### **🌱 Plan BÁSICO (Gratis o bajo costo)**
- ✅ Hasta 10 productos/servicios
- ✅ 1 tienda online
- ✅ Hasta 50 reservas/mes
- ✅ Soporte por email (48hs)
- ⚠️ **Branding de CRESALIA visible** en:
  - Tickets/Comprobantes
  - Footer de la tienda
  - Emails de notificación
- 💰 **Precio:** Gratis o $5-10 USD/mes

---

### **⭐ Plan PRO**
- ✅ Productos/servicios ilimitados
- ✅ Hasta 3 tiendas
- ✅ Hasta 500 reservas/mes
- ✅ Soporte prioritario (24hs)
- ✅ Calendario de citas
- ✅ Estadísticas avanzadas
- ✅ **SIN branding de CRESALIA** en tickets
- ✅ Logo personalizado en comprobantes
- 💰 **Precio:** $25-35 USD/mes

---

### **🚀 Plan ENTERPRISE**
- ✅ TODO ilimitado
- ✅ Tiendas ilimitadas
- ✅ Reservas ilimitadas
- ✅ Soporte 24/7
- ✅ Dominio personalizado
- ✅ Email desde dominio propio
- ✅ **100% white-label** (sin menciones a CRESALIA)
- ✅ Plantillas completamente personalizadas
- ✅ Integración con CRM
- 💰 **Precio:** $99+ USD/mes

---

### **💎 Plan ENTERPRISE CUSTOM**
- ✅ Todo de Enterprise
- ✅ Desarrollo a medida
- ✅ Funcionalidades exclusivas
- ✅ Soporte dedicado
- ✅ Consultoría incluida
- 💰 **Precio:** Cotización personalizada

---

## 🎨 **Sistema de Branding Inteligente**

### **Cómo Funciona:**

El sistema detecta automáticamente el plan del cliente y ajusta el branding en consecuencia:

```javascript
const plan = tiendaActual.plan || 'basico';
const mostrarBrandingCRESALIA = !['pro', 'enterprise', 'enterprise_custom'].includes(plan);
```

### **En Plan BÁSICO:**
```
🎫 TICKET DE SERVICIO
   Nombre de la Tienda
   Powered by CRESALIA SaaS ← VISIBLE
━━━━━━━━━━━━━━━━━
Gestionado con CRESALIA SaaS | www.cresalia.com ← VISIBLE
```

### **En Plan PRO/ENTERPRISE:**
```
🎫 TICKET DE SERVICIO
   Nombre de la Tienda
━━━━━━━━━━━━━━━━━
(SIN menciones a CRESALIA)
```

---

## 📄 **Tipos de Documentos**

### **1. Ticket de Reserva (Ya implementado)**
- ✅ Formato tipo "recibo de caja"
- ✅ Tipografía monoespaciada
- ✅ Imprimible/Descargable como PDF
- ✅ Branding según plan

**Ubicación:** Función `generarHTMLTicket()` en `admin.html`

---

### **2. Comprobante de Pago (Futuro)**
- 📄 Formato más formal
- 💼 Con datos fiscales
- 🧾 Número de factura
- 📊 IVA desglosado

---

### **3. Email de Confirmación**
- 📧 HTML responsive
- 🎨 Colores de CRESALIA
- 📱 Optimizado para móviles
- 🔗 Link para gestionar reserva

**Ubicación:** `email-notifications.js` templates

---

## 🎯 **Implementación por Plan**

### **Plan BÁSICO:**
```javascript
{
    plan: 'basico',
    caracteristicas: {
        mostrarBranding: true,
        logoPersonalizado: false,
        colorPersonalizado: false,
        dominioPropio: false
    }
}
```

**Ticket muestra:**
- Logo de CRESALIA (si aplicable)
- "Powered by CRESALIA SaaS"
- Colores: Morado (#7C3AED) y Rosa (#EC4899)

---

### **Plan PRO:**
```javascript
{
    plan: 'pro',
    caracteristicas: {
        mostrarBranding: false,
        logoPersonalizado: true,
        colorPersonalizado: true,
        dominioPropio: false
    }
}
```

**Ticket muestra:**
- Logo del cliente (si lo sube)
- SIN "Powered by CRESALIA"
- Colores: Los que el cliente configure

---

### **Plan ENTERPRISE:**
```javascript
{
    plan: 'enterprise',
    caracteristicas: {
        mostrarBranding: false,
        logoPersonalizado: true,
        colorPersonalizado: true,
        dominioPropio: true,
        emailPropio: true,
        plantillasCustom: true
    }
}
```

**Ticket muestra:**
- Logo del cliente
- SIN menciones a CRESALIA en NINGÚN lado
- Plantilla completamente personalizada
- Email desde: `reservas@tienda-del-cliente.com`

---

## 💻 **Código de Ejemplo**

### **Generar Ticket con Branding Dinámico:**

```javascript
function generarTicket(reserva) {
    const tienda = obtenerTiendaActual();
    const plan = tienda.plan || 'basico';
    
    // Lógica de branding
    const branding = {
        basico: {
            logo: 'https://cresalia.com/logo.png',
            footer: 'Powered by CRESALIA SaaS',
            colores: { primario: '#7C3AED', secundario: '#EC4899' }
        },
        pro: {
            logo: tienda.logo || 'https://cresalia.com/logo.png',
            footer: '',
            colores: tienda.colores || { primario: '#000', secundario: '#666' }
        },
        enterprise: {
            logo: tienda.logo,
            footer: '',
            colores: tienda.colores,
            template: tienda.plantillaCustom
        }
    };
    
    return generarPDFConBranding(reserva, branding[plan]);
}
```

---

## 🎨 **Personalización Avanzada (Enterprise)**

### **Variables Dinámicas:**

```javascript
const ticketPersonalizado = {
    template: 'custom_luxury', // Plantilla personalizada
    branding: {
        logo: tienda.logo_url,
        colorPrimario: tienda.color_primario,
        colorSecundario: tienda.color_secundario,
        tipografia: tienda.fuente || 'Arial'
    },
    contenido: {
        titulo: 'COMPROBANTE DE RESERVA',
        mensajeFinal: tienda.mensaje_personalizado,
        footer: tienda.footer_personalizado
    },
    idioma: tienda.idioma_principal || 'es'
};
```

---

## 📊 **Tabla de Comparación**

| Característica | BÁSICO | PRO | ENTERPRISE |
|----------------|--------|-----|------------|
| Logo Personalizado | ❌ | ✅ | ✅ |
| Branding CRESALIA | ✅ Visible | ❌ Oculto | ❌ Oculto |
| Colores Custom | ❌ | ✅ | ✅ |
| Plantilla Custom | ❌ | ❌ | ✅ |
| Email Propio | ❌ | ❌ | ✅ |
| Dominio Propio | ❌ | ❌ | ✅ |

---

## 💰 **Estrategia de Monetización**

### **Gratis → PRO (Upselling):**

**Mensajes en Plan Básico:**
```
⭐ Mejora a PRO para quitar el branding de CRESALIA
⭐ Agrega tu logo personalizado - Upgrade a PRO
⭐ 500 reservas/mes con Plan PRO
```

### **PRO → ENTERPRISE:**

```
🚀 ¿Necesitas más de 3 tiendas? Upgrade a Enterprise
🚀 Email desde tu dominio - Solo en Enterprise
🚀 Plantillas 100% personalizadas
```

---

## 🔧 **Implementación Técnica**

### **Detectar Plan del Usuario:**

```javascript
const tienda = JSON.parse(localStorage.getItem('tienda_actual') || '{}');
const plan = tienda.plan || 'basico';

// En Supabase, tabla "tiendas":
// - plan: 'basico' | 'pro' | 'enterprise' | 'enterprise_custom'
```

### **Aplicar Branding:**

```javascript
if (plan === 'basico') {
    // Mostrar branding CRESALIA
    incluirLogoCRESALIA();
    incluirFooterCRESALIA();
} else if (plan === 'pro') {
    // Ocultar branding, usar logo del cliente
    incluirLogoCliente();
} else {
    // 100% white-label
    usarPlantillaPersonalizada();
}
```

---

## 📈 **Métricas de Éxito**

### **Indicadores para Upgrade:**

- **Límite de reservas alcanzado**
- **Más de 10 productos/servicios**
- **Múltiples sucursales**
- **Ticket promedio alto** (>$10,000)

### **Notificaciones Automáticas:**

```
⚠️ Has alcanzado 45/50 reservas este mes
💡 Upgrade a PRO para reservas ilimitadas
```

---

## 💜 **MENSAJE FINAL**

Este sistema de planes permite que CRESALIA sea **accesible para todos**:

- 🌱 **Emprendedores pequeños:** Plan Básico (ayudarlos a crecer)
- ⭐ **Negocios establecidos:** Plan PRO (profesionalismo)
- 🚀 **Empresas grandes:** Plan Enterprise (white-label completo)

**Todos ganan:**
- Clientes obtienen herramientas profesionales
- CRESALIA genera ingresos recurrentes
- El branding en plan básico trae más clientes

---

**¡Tu SaaS tiene todo para triunfar!** 🎉💜




















