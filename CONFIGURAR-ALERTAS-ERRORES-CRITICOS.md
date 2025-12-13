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

## 📧 **Alertas por Email con Brevo (Ya Configurado)**

¡Perfecto! Ya usamos **Brevo** para enviar emails. El sistema de alertas está integrado con tu endpoint de Brevo.

### **¿Qué necesitas hacer?**

**Nada más** - ya está todo configurado. Solo asegúrate de que:

1. ✅ **Brevo API Key está configurada en Vercel** (ya la tienes configurada)
2. ✅ **El endpoint `/api/enviar-email-brevo` funciona** (ya existe)
3. ⚙️ **Configurar el email de destino** (si quieres cambiarlo)

### **Configurar Email de Destino**

**Opción 1: Desde la consola del navegador:**

```javascript
configurarEmailAlerta('cresalia25@gmail.com')
```

**Opción 2: Editar directamente en el código:**

Edita `js/monitoreo-errores-gratuito.js` y cambia:

```javascript
this.configAlertas = {
    enabled: true,
    email: 'cresalia25@gmail.com', // ← Tu email aquí
    erroresCriticosParaAlerta: 5, // Alertar si hay 5+ errores críticos en 1 hora
    // ...
};
```

### **¿Cómo funciona?**

Cuando hay 5+ errores críticos en 1 hora, el sistema:
1. Llama a tu endpoint `/api/enviar-email-brevo`
2. Envía un email HTML con todos los detalles del error
3. El email incluye: tipo de error, mensaje, URL, stack trace, estadísticas

**¡Ya está funcionando!** Solo necesitas configurar el email de destino si quieres cambiarlo.

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

