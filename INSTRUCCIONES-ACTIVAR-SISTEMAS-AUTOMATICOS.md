# 🚀 INSTRUCCIONES: Activar Sistemas Automáticos - Cresalia

**Para:** Mi querida co-fundadora Crisla 💜  
**Fecha:** Enero 2025  
**Estado:** ✅ Listo para activar

---

## 📋 PASOS PARA ACTIVAR

### **PASO 1: Ejecutar SQL en Supabase** ⚠️ IMPORTANTE

1. Ir a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Seleccionar tu proyecto
3. Ir a **"SQL Editor"** (menú lateral)
4. Click en **"New query"**
5. Abrir el archivo `supabase-intentos-renovacion.sql`
6. Copiar **TODO** el contenido
7. Pegar en el editor de Supabase
8. Click en **"Run"** (o `Ctrl+Enter`)
9. Verificar que no haya errores

**✅ Verificar que funcionó:**
- Ir a **"Table Editor"** (menú lateral)
- Deberías ver la tabla: `intentos_renovacion`

---

### **PASO 2: Cargar Scripts en las Páginas Principales** ✅ COMPLETADO

**Estado:** ✅ **Los scripts ya están agregados automáticamente**

Los siguientes archivos ya tienen los scripts cargados:
- ✅ `index-cresalia.html`
- ✅ `admin-cresalia.html`
- ✅ `tiendas/ejemplo-tienda/admin.html`

#### En `index-cresalia.html`:

```html
<!-- Sistemas Automáticos -->
<script src="js/sistema-renovacion-automatica.js"></script>
<script src="js/sistema-limites-plan.js"></script>
<script src="js/sistema-suspension-automatica.js"></script>
<script src="js/integracion-sistemas-automaticos.js"></script>
```

#### En `tiendas/ejemplo-tienda/admin.html`:

Agregar antes del cierre de `</body>`:

```html
<!-- Sistemas Automáticos -->
<script src="../../js/sistema-renovacion-automatica.js"></script>
<script src="../../js/sistema-limites-plan.js"></script>
<script src="../../js/sistema-suspension-automatica.js"></script>
<script src="../../js/integracion-sistemas-automaticos.js"></script>
```

---

### **PASO 3: Configurar Webhooks en Mercado Pago** (Cuando tengas las credenciales)

**Cuando Mercado Pago te apruebe (después de los 2 días):**

1. Entra a tu cuenta de Mercado Pago
2. Ve a **"Desarrolladores"** → **"Webhooks"**
3. Haz clic en **"Crear Webhook"**
4. **URL del Webhook:**
   ```
   https://tu-dominio.vercel.app/api/webhooks/mercadopago
   ```
   (Reemplazar `tu-dominio` con tu dominio real)

5. **Eventos a Escuchar:**
   - ✅ `payment.created`
   - ✅ `payment.updated`
   - ✅ `payment.approved`
   - ✅ `payment.rejected`

6. Guarda la configuración

**📝 Nota:** Si aún no tienes el dominio, puedes configurarlo después. Los sistemas funcionarán igual, solo que las renovaciones automáticas esperarán a que configures los webhooks.

---

### **PASO 4: Verificar que Todo Funcione**

Abrir la consola del navegador (F12) y ejecutar:

```javascript
verificarEstadoSistemasAutomaticos();
```

Debería retornar:
```javascript
{
    renovacion: true,
    limites: true,
    suspension: true,
    supabase: true
}
```

---

## 🎯 ¿QUÉ HACE CADA SISTEMA?

### **1. Sistema de Renovación Automática**

**Qué hace:**
- ✅ Verifica cada hora las suscripciones próximas a vencer
- ✅ Crea automáticamente un link de pago 3 días antes del vencimiento
- ✅ Notifica al usuario por email
- ✅ Cuando el usuario paga, renueva automáticamente la suscripción

**Cuándo se activa:**
- 3 días antes del vencimiento de la suscripción

---

### **2. Sistema de Límites por Plan**

**Qué hace:**
- ✅ Verifica antes de agregar cada producto
- ✅ Verifica antes de crear cada orden
- ✅ Bloquea automáticamente si se excede el límite
- ✅ Muestra alertas cuando se acerca al límite
- ✅ Sugiere actualizar plan

**Cuándo se activa:**
- Cada vez que intentas agregar un producto
- Cada vez que intentas crear una orden
- Cada vez que intentas agregar un usuario

---

### **3. Sistema de Suspensión Automática**

**Qué hace:**
- ✅ Período de gracia de 7 días después del vencimiento
- ✅ Intenta renovar automáticamente 3 veces durante el período de gracia
- ✅ Si fallan los 3 intentos, suspende automáticamente
- ✅ Bloquea funcionalidades de la tienda suspendida
- ✅ Reactiva automáticamente cuando el usuario paga

**Cuándo se activa:**
- Cuando una suscripción está vencida
- Después de 7 días de vencimiento sin pago
- Cuando el usuario paga después de estar suspendido

---

## 🔧 CONFIGURACIÓN OPCIONAL

### Cambiar Período de Gracia

En `js/sistema-suspension-automatica.js`, línea 9:

```javascript
periodoGracia: 7, // Cambiar a los días que quieras (ej: 10)
```

### Cambiar Días Antes de Renovación

En `js/sistema-renovacion-automatica.js`, línea 7:

```javascript
diasAntesRenovacion: 3, // Cambiar a los días que quieras (ej: 5)
```

### Cambiar Intentos Máximos

En `js/sistema-suspension-automatica.js`, línea 11:

```javascript
intentosMaximos: 3, // Cambiar a la cantidad que quieras (ej: 5)
```

---

## ⚠️ IMPORTANTE

### **Antes de Activar en Producción:**

1. ✅ Ejecutar SQL en Supabase
2. ✅ Cargar scripts en las páginas
3. ✅ Verificar que no haya errores en consola
4. ✅ Probar con una suscripción de prueba
5. ✅ Configurar webhooks en Mercado Pago (cuando tengas credenciales)

### **Cuando Configures Webhooks:**

- La URL debe ser accesible públicamente
- Debe usar HTTPS (Vercel lo proporciona automáticamente)
- Debe responder rápidamente (< 5 segundos)

---

## 📊 VERIFICAR QUE FUNCIONA

### 1. Verificar Renovación Automática:

```javascript
// En consola del navegador
sistemaRenovacionAutomatica.verificarSuscripcionesPorVencer();
```

### 2. Verificar Límites:

```javascript
// Verificar si puede agregar producto
sistemaLimitesPlan.puedeAgregarProducto('ID_DE_TU_TIENDA');
```

### 3. Verificar Suspensión:

```javascript
// Verificar suscripciones vencidas
sistemaSuspensionAutomatica.verificarSuscripcionesVencidas();
```

---

## 💜 RESUMEN

**Una vez activado:**
- ✅ Renovaciones se procesan automáticamente
- ✅ Límites se verifican automáticamente
- ✅ Suspensiones se aplican automáticamente
- ✅ Todo funciona sin intervención manual

**No necesitas hacer nada más.** 🎉

---

## 🆘 SI ALGO NO FUNCIONA

1. **Verificar consola del navegador** (F12) para ver errores
2. **Verificar que Supabase esté configurado** correctamente
3. **Verificar que las tablas existan** en Supabase
4. **Revisar los logs** en Vercel (si estás en producción)

---

*Instrucciones creadas con amor por Claude para Cresalia* 💜

