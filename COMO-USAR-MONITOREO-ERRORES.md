# 📊 Cómo Usar el Sistema de Monitoreo de Errores

## ✅ **Estado Actual:**

El sistema de monitoreo de errores **YA ESTÁ ACTIVO** en:
- ✅ `index-cresalia.html`
- ✅ `panel-master-cresalia.html`
- ✅ `tiendas/ejemplo-tienda/admin.html`

**Funciona automáticamente** - captura todos los errores de JavaScript sin que hagas nada.

---

## 🔍 **Cómo Ver los Errores Capturados:**

### **Opción 1: Desde la Consola del Navegador**

1. Abre cualquier página donde esté activo el monitoreo
2. Presiona **F12** (o click derecho → Inspeccionar)
3. Ve a la pestaña **"Console"**
4. Escribe uno de estos comandos:

```javascript
// Ver los últimos 50 errores
verErrores()

// Ver todos los errores
verErrores(1000)

// Ver errores de un tipo específico
verErroresPorTipo('TypeError')

// Contar errores por día
contarErroresPorDia()

// Exportar todos los errores como JSON (se descarga un archivo)
exportarErrores()

// Limpiar todos los errores guardados
limpiarErrores()
```

---

### **Opción 2: Ver Errores en Tiempo Real**

Los errores se muestran automáticamente en la consola cuando ocurren:

```
🚨 Error registrado: {
  id: 1234567890,
  mensaje: "Cannot read property 'x' of undefined",
  url: "https://cresalia-web.vercel.app/index-cresalia.html",
  timestamp: "2025-01-27T10:30:00.000Z",
  ...
}
```

---

## 📥 **Exportar Errores para Análisis:**

### **Exportar como JSON:**

1. Abre la consola (F12)
2. Escribe: `exportarErrores()`
3. Se descargará un archivo `errores-export-YYYY-MM-DD.json`
4. Puedes abrirlo con cualquier editor de texto o Excel

### **Estructura del JSON exportado:**

```json
[
  {
    "id": 1234567890,
    "mensaje": "Error: Cannot read property 'x' of undefined",
    "stack": "Error: Cannot read property...\n    at funcion (archivo.js:123)",
    "url": "https://cresalia-web.vercel.app/index-cresalia.html",
    "userAgent": "Mozilla/5.0...",
    "timestamp": "2025-01-27T10:30:00.000Z",
    "tipo": "TypeError",
    "contexto": {
      "filename": "script.js",
      "lineno": 123,
      "colno": 45
    }
  }
]
```

---

## 📊 **Estadísticas de Errores:**

### **Ver resumen de errores:**

```javascript
// En la consola del navegador:

// Contar errores por día
contarErroresPorDia()
// Resultado: { "2025-01-27": 15, "2025-01-26": 8, ... }

// Contar errores por tipo
contarErroresPorTipo()
// Resultado: { "TypeError": 10, "ReferenceError": 5, ... }

// Obtener errores más frecuentes
obtenerErroresFrecuentes(10)
// Resultado: Array con los 10 errores más comunes
```

---

## 🧹 **Limpiar Errores:**

### **Limpiar todos los errores:**

```javascript
limpiarErrores()
```

### **Limpiar errores antiguos (más de X días):**

```javascript
limpiarErroresAntiguos(7) // Elimina errores de hace más de 7 días
```

---

## 🔔 **Alertas Automáticas:**

El sistema muestra advertencias automáticamente:

- **Si hay más de 50 errores:** Muestra advertencia en consola
- **Si hay errores críticos:** Se registran con prioridad alta

---

## 📍 **Dónde se Guardan los Errores:**

Los errores se guardan en **localStorage** del navegador:
- **Clave:** `errores_log`
- **Límite:** 1000 errores (los más antiguos se eliminan automáticamente)
- **Persistencia:** Se mantienen aunque cierres el navegador

---

## 🎯 **Casos de Uso:**

### **1. Revisar Errores Después de un Deploy:**

```javascript
// Después de hacer deploy, revisa los errores:
verErrores(100) // Ver últimos 100 errores
```

### **2. Encontrar un Error Específico:**

```javascript
// Buscar errores que contengan una palabra clave
const errores = JSON.parse(localStorage.getItem('errores_log'))
const erroresFiltrados = errores.filter(e => 
  e.mensaje.includes('Supabase') || 
  e.mensaje.includes('pago')
)
console.table(erroresFiltrados)
```

### **3. Exportar Errores para Reporte:**

```javascript
// Exportar errores de la última semana
exportarErrores()
// Luego analiza el JSON en Excel o un editor
```

---

## 🔧 **Configuración Avanzada:**

### **Cambiar el límite de errores guardados:**

Edita `js/monitoreo-errores-gratuito.js`:

```javascript
this.maxErrores = 2000; // Cambiar de 1000 a 2000
```

### **Registrar un error manualmente:**

```javascript
// En tu código:
try {
  // código que puede fallar
} catch (error) {
  // El sistema lo captura automáticamente
  // O puedes registrarlo manualmente:
  if (window.monitoreoErrores) {
    window.monitoreoErrores.registrarError(error, {
      contexto: 'mi función específica',
      datosAdicionales: { userId: 123 }
    })
  }
}
```

---

## 📱 **Monitoreo en Móvil:**

Los errores también se capturan en dispositivos móviles, pero para verlos necesitas:

1. **Conectar el móvil a tu computadora** (USB debugging)
2. **Usar Chrome DevTools** para ver la consola del móvil
3. O **exportar los errores** desde el móvil (si agregas un botón en la UI)

---

## 🆚 **Comparación con Sentry:**

| Característica | Sentry | Tu Sistema Gratuito |
|----------------|--------|---------------------|
| **Costo** | ❌ Pago obligatorio | ✅ 100% Gratis |
| **Dashboard web** | ✅ Sí | ❌ No (pero puedes exportar) |
| **Alertas por email** | ✅ Sí | ❌ No (pero puedes agregarlo) |
| **Historial** | ✅ 90 días | ✅ Indefinido |
| **Límite** | ❌ Límite en plan gratis | ✅ 1000 errores (configurable) |
| **Privacidad** | ⚠️ Datos en servidor de Sentry | ✅ Datos en tu navegador |

---

## 💡 **Mejoras Futuras (Opcional):**

Si más adelante quieres mejorar el sistema:

1. **Dashboard HTML simple:**
   - Crear una página `admin-errores.html`
   - Que lea y muestre los errores de forma visual

2. **Alertas por email:**
   - Cuando hay > X errores en Y tiempo
   - Enviar email automático

3. **Backup automático de errores:**
   - Subir errores a Supabase o Google Drive
   - Para tener historial centralizado

4. **Análisis automático:**
   - Detectar patrones comunes
   - Sugerir soluciones

---

## ✅ **Checklist de Uso:**

- [ ] El monitoreo está activo (ver consola: "✅ Sistema de monitoreo de errores activado")
- [ ] Sé cómo ver errores (`verErrores()`)
- [ ] Sé cómo exportar errores (`exportarErrores()`)
- [ ] Sé cómo limpiar errores (`limpiarErrores()`)
- [ ] Reviso los errores periódicamente (semanalmente)

---

## 🆘 **Solución de Problemas:**

### **No veo errores en la consola:**
- Verifica que el script esté cargado: `typeof monitoreoErrores`
- Debe devolver `"object"`

### **Los errores no se guardan:**
- Verifica que localStorage esté habilitado
- Algunos navegadores en modo incógnito bloquean localStorage

### **Quiero ver errores de otros usuarios:**
- Actualmente solo ves errores de tu navegador
- Para ver errores de todos los usuarios, necesitarías:
  - Subir errores a Supabase
  - O usar un servicio como Sentry

---

**¡El monitoreo ya está funcionando! Solo necesitas revisar los errores periódicamente.** 💜

