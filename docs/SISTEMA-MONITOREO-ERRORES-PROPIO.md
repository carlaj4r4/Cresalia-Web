# 📊 Sistema Propio de Monitoreo de Errores - Cresalia

**Fecha:** 2025-01-27

---

## 🎯 **Propósito**

Sistema propio de monitoreo de errores como **fallback** cuando Bugsnag o Rollbar no estén disponibles o fallen. Envía alertas por email usando Brevo.

---

## 🔧 **Componentes**

### 1. **Frontend: `js/error-reporter.js`**
- Captura errores de JavaScript automáticamente
- Captura promesas rechazadas sin catch
- Clasifica errores por severidad (critical, high, medium, low)
- Limita la cantidad de errores reportados (anti-spam)
- Cache de errores para evitar duplicados

### 2. **Backend: `api/reportar-error.js`**
- Recibe errores del frontend
- Clasifica por severidad
- Envía emails vía Brevo para errores críticos/altos
- Formatea emails con HTML bonito

---

## ⚙️ **Configuración**

### Variables de Entorno (Vercel):

```env
BREVO_API_KEY=tu_api_key_de_brevo
ADMIN_EMAIL=cresalia25@gmail.com
```

### Clasificación de Severidad:

| Severidad | Descripción | Envía Email |
|-----------|-------------|-------------|
| **critical** | CORS, Network, Syntax | ✅ Sí |
| **high** | TypeError, ReferenceError | ✅ Sí |
| **medium** | Errores moderados | ❌ No (solo si se repite) |
| **low** | Errores menores | ❌ No |

---

## 📧 **Formato de Emails**

Los emails incluyen:
- 📋 Detalles del error (mensaje, stack trace)
- 📊 Información adicional (URL, User Agent, usuario)
- 🎨 Formato HTML bonito con estilos
- ⏰ Timestamp en hora Argentina

**Ejemplo de asunto:**
- `🚨 ERROR CRÍTICO - Cresalia`
- `⚠️ Error Importante - Cresalia`

---

## 🚀 **Uso**

### Automático:
El sistema se activa automáticamente cuando cargas `js/error-reporter.js` en tus páginas HTML:

```html
<script src="js/error-reporter.js"></script>
```

### Manual:
También podés reportar errores manualmente desde el código:

```javascript
// Reportar error manual
window.reportarError('Algo salió mal', 'high', {
    componente: 'checkout',
    usuario_id: 123
});
```

---

## 🛡️ **Protecciones Anti-Spam**

1. **Límite de errores por minuto:** Máximo 10 errores/minuto
2. **Cache de errores:** No reporta el mismo error dos veces en 5 minutos
3. **Clasificación:** Solo reporta errores críticos/altos automáticamente

---

## 📋 **Agregar a Páginas HTML**

Para activar el sistema en una página, agregá esto antes del cierre de `</body>`:

```html
<!-- Sistema de Monitoreo de Errores Propio -->
<script src="js/error-reporter.js"></script>
```

**Páginas recomendadas:**
- `index-cresalia.html` ✅
- `demo-buyer-interface.html` ✅
- `panel-master-cresalia.html` ✅
- `admin-cresalia.html` ✅
- Páginas de tiendas ✅
- Comunidades ✅

---

## 🔍 **Cómo Funciona**

### Flujo de un Error:

1. **Error ocurre** en el frontend
2. **Detectado** por `window.addEventListener('error')` o `unhandledrejection`
3. **Clasificado** por severidad
4. **Verificado** contra cache (no duplicados)
5. **Enviado** a `/api/reportar-error`
6. **Backend procesa** y determina si enviar email
7. **Email enviado** vía Brevo (si es crítico/alto)
8. **Respuesta** confirmada al frontend

---

## 📊 **Monitoreo**

### Ver errores reportados:
- Revisar emails en `cresalia25@gmail.com`
- Buscar emails con asunto que contenga "ERROR" o "Error"

### Logs en consola:
El sistema muestra mensajes en la consola:
- `✅ Sistema de monitoreo de errores propio cargado`
- `⚠️ No se pudo reportar el error: [detalles]`
- `✅ Email de alerta enviado exitosamente`

---

## 🔄 **Integración con Bugsnag/Rollbar**

Este sistema es un **fallback**. Si querés usar Bugsnag o Rollbar como principal:

1. **Configura Bugsnag/Rollbar** primero
2. **Mantén este sistema** como backup
3. Si Bugsnag/Rollbar fallan, este sistema seguirá funcionando

**Ejemplo de integración:**
```javascript
// En error-reporter.js, podrías agregar:
try {
    // Intentar reportar con Bugsnag
    Bugsnag.notify(new Error(errorData.message), {
        severity: errorData.severity,
        metadata: errorData.metadata
    });
} catch (e) {
    // Si falla, usar sistema propio
    reportError(errorData);
}
```

---

## ⚠️ **Limitaciones**

1. **No hay dashboard:** Solo emails, no hay panel web para ver errores
2. **Storage limitado:** No guarda errores en base de datos (por ahora)
3. **Solo email:** No tiene notificaciones push ni Slack/Discord

---

## 🚀 **Mejoras Futuras**

1. **Guardar en Supabase:** Crear tabla `errores_plataforma` para historial
2. **Dashboard web:** Panel para ver errores reportados
3. **Filtros y búsqueda:** Buscar errores por tipo, fecha, usuario
4. **Estadísticas:** Gráficos de errores por día/tipo/severidad

---

## 📝 **Notas**

- El sistema es **no intrusivo**: Solo reporta errores críticos/altos por email
- Los errores menores se registran en consola pero no se reportan
- El sistema está diseñado para no crear bucles infinitos (si el sistema de reporte falla, no reporta el error del reporte)

---

**Última actualización:** 2025-01-27  
**Mantenido por:** Equipo Cresalia 💜


