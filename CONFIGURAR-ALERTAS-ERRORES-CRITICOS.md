# 🚨 Configurar Alertas de Errores Críticos

## ✅ **¿Qué se Activa Automáticamente?**

El sistema ahora detecta **errores críticos** automáticamente y muestra:

1. ✅ **Notificaciones Push del Navegador** (inmediatas, gratis)
2. ⚠️ **Alertas por Email** (opcional, requiere EmailJS)

---

## 🔔 **Notificaciones Push (Ya Funciona)**

Las notificaciones push del navegador **YA ESTÁN ACTIVAS** y funcionan automáticamente.

**Qué hacen:**
- Se muestran cuando ocurre un error crítico (pagos, autenticación, etc.)
- Aparecen como una notificación del sistema
- Funcionan incluso si no estás en la página (si tienes el navegador abierto)

**Cómo activar:**
- La primera vez que haya un error crítico, el navegador te pedirá permisos
- Click en "Permitir" para recibir notificaciones

---

## 📧 **Alertas por Email (Opcional)**

Para recibir emails cuando hay errores críticos, necesitas configurar EmailJS.

### **Paso 1: Configurar EmailJS (si aún no lo tienes)**

1. Ve a **https://www.emailjs.com/**
2. Crea una cuenta gratuita (200 emails/mes gratis)
3. Conecta tu Gmail
4. Crea un template para alertas de errores

### **Paso 2: Crear Template de Alerta en EmailJS**

1. En EmailJS, ve a **"Email Templates"**
2. Click en **"Create New Template"**
3. Configura:
   - **Template Name:** `Alerta de Error Crítico`
   - **Template ID:** `template_alerta_error`

4. **Subject (Asunto):**
```
🚨 ERROR CRÍTICO - Cresalia: {{error_type}}
```

5. **Content (Contenido HTML):**
```html
<h2>🚨 Error Crítico Detectado</h2>

<p><strong>Tipo:</strong> {{error_type}}</p>
<p><strong>Mensaje:</strong> {{error_message}}</p>
<p><strong>URL:</strong> {{error_url}}</p>
<p><strong>Fecha:</strong> {{error_timestamp}}</p>

<h3>Stack Trace:</h3>
<pre>{{error_stack}}</pre>

<hr>
<p><strong>Total de errores:</strong> {{total_errores}}</p>
<p><strong>Errores críticos:</strong> {{errores_criticos}}</p>

<p style="color: #666; font-size: 12px;">
Este email fue enviado automáticamente por el sistema de monitoreo de Cresalia.
</p>
```

6. **Variables a usar:**
```
{{to_email}}           - Email del destinatario
{{error_message}}      - Mensaje del error
{{error_type}}         - Tipo de error
{{error_url}}          - URL donde ocurrió
{{error_timestamp}}    - Fecha y hora
{{error_stack}}        - Stack trace
{{total_errores}}      - Total de errores
{{errores_criticos}}   - Total de errores críticos
```

### **Paso 3: Configurar en el Código**

**Opción A: Si ya tienes EmailJS configurado**

Solo necesitas asegurarte de que el template `template_alerta_error` existe.

**Opción B: Si no tienes EmailJS configurado**

1. Ve a `email-notifications.js`
2. Agrega el template de alerta a `EMAIL_CONFIG`:

```javascript
const EMAIL_CONFIG = {
    serviceID: 'TU_SERVICE_ID',
    publicKey: 'TU_PUBLIC_KEY',
    templates: {
        reservaCliente: 'template_reserva_cliente',
        reservaProveedor: 'template_reserva_proveedor',
        cancelacion: 'template_cancelacion',
        alertaError: 'template_alerta_error' // ← Agregar esto
    }
};
```

3. Luego, edita `js/monitoreo-errores-gratuito.js` y en la función `enviarAlertaEmail`, descomenta/agrega:

```javascript
await emailjs.send(
    EMAIL_CONFIG.serviceID,
    EMAIL_CONFIG.templates.alertaError,
    templateParams
);
```

### **Paso 4: Configurar Email de Destino**

En la consola del navegador:

```javascript
configurarEmailAlerta('tu-email@gmail.com')
```

O edita `js/monitoreo-errores-gratuito.js` directamente:

```javascript
this.configAlertas = {
    enabled: true,
    email: 'tu-email@gmail.com', // ← Cambiar aquí
    erroresCriticosParaAlerta: 5, // Alertar si hay 5+ errores críticos en 1 hora
    // ...
};
```

---

## 🔍 **Qué se Considera Error Crítico?**

El sistema detecta automáticamente errores críticos buscando estas palabras clave:

- **Pagos:** `payment`, `pago`, `mercado pago`, `subscription`, `suscripcion`
- **Autenticación:** `auth`, `authentication`, `login`, `logout`, `session`
- **Base de datos:** `database`, `supabase`, `rlp`, `row level security`
- **Red:** `network`, `fetch failed`, `connection`, `timeout`
- **Seguridad:** `security`, `seguridad`, `critical`, `crítico`

**Si un error contiene alguna de estas palabras, se considera crítico.**

---

## 📊 **Cómo Ver Errores Críticos**

### **Desde la Consola:**

```javascript
// Ver errores críticos recientes
verErroresCriticos()

// Ver todos los errores (incluye críticos marcados)
verErrores()

// Contar errores críticos por día
contarErroresCriticosPorDia()
```

### **Exportar Errores Críticos:**

Los errores críticos se incluyen en el export normal, pero están marcados con `esCritico: true`.

```javascript
exportarErrores()
```

---

## ⚙️ **Configuración Avanzada**

### **Cambiar Número de Errores para Alertar:**

Por defecto, se envía un email si hay **5+ errores críticos en 1 hora**.

Para cambiar esto, edita `js/monitoreo-errores-gratuito.js`:

```javascript
this.configAlertas = {
    erroresCriticosParaAlerta: 3, // Cambiar de 5 a 3
    intervaloAlerta: 30 * 60 * 1000, // Cambiar de 1 hora a 30 minutos
    // ...
};
```

### **Desactivar Notificaciones Push:**

```javascript
this.configAlertas = {
    notificacionesPush: false, // Desactivar
    // ...
};
```

### **Agregar Más Palabras Clave Críticas:**

```javascript
this.palabrasClaveCriticas = [
    'payment', 'pago', // ... existentes
    'tu nueva palabra clave' // ← Agregar aquí
];
```

---

## 🧪 **Probar el Sistema**

### **Test 1: Verificar Notificaciones Push**

1. Abre cualquier página con el monitoreo activo
2. En la consola, ejecuta:
```javascript
// Simular un error crítico
throw new Error('Payment processing failed')
```

3. Deberías ver:
   - Una notificación push del navegador
   - Un mensaje en consola: `🚨 ERROR CRÍTICO registrado`

### **Test 2: Verificar Detección de Errores Críticos**

```javascript
// Ver errores críticos
verErroresCriticos()

// Ver estadísticas
contarErroresCriticosPorDia()
```

---

## 📋 **Checklist de Configuración**

- [ ] Notificaciones push: Funcionan automáticamente (verificar permisos)
- [ ] EmailJS: Cuenta creada (opcional)
- [ ] EmailJS: Template `template_alerta_error` creado (opcional)
- [ ] EmailJS: Configurado en `email-notifications.js` (opcional)
- [ ] Email de destino configurado: `configurarEmailAlerta('tu-email@gmail.com')`
- [ ] Probado con error simulado

---

## 💡 **Recomendación**

**Para empezar:**
1. ✅ **Activa las notificaciones push** (ya funcionan)
2. ⏳ **Configura EmailJS después** (cuando tengas tiempo)

**Las notificaciones push son suficientes para detectar errores críticos inmediatamente.** Los emails son útiles para tener un historial o cuando no estás en la computadora.

---

## 🆘 **Solución de Problemas**

### **No recibo notificaciones push:**
- Verifica que el navegador tenga permisos (F12 → Console → `Notification.permission`)
- Si dice "denied", ve a Configuración del navegador y permite notificaciones para tu sitio

### **No recibo emails:**
- Verifica que EmailJS esté configurado correctamente
- Verifica que el template `template_alerta_error` exista
- Verifica tu cuota de emails en EmailJS (200/mes gratis)
- Revisa la consola para ver si hay errores

### **Demasiadas alertas:**
- Aumenta `erroresCriticosParaAlerta` (de 5 a 10)
- Aumenta `intervaloAlerta` (de 1 hora a 2 horas)

---

**¡El sistema ya está activo y funcionando! Solo necesitas permitir las notificaciones del navegador.** 💜

