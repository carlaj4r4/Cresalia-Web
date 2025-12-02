# 📊 Guía de Sentry y Monitoreo Básico - Cresalia

**Versión:** 1.0  
**Fecha:** 2025-01-27

---

## 🎯 ¿Qué es Sentry?

**Sentry** es una plataforma de monitoreo de errores que:
- Detecta errores en tiempo real
- Te envía alertas por email cuando algo falla
- Muestra el stack trace completo del error
- Te dice qué usuario tuvo el problema
- Te muestra en qué navegador/dispositivo ocurrió

**Es GRATIS** hasta 5,000 eventos/mes (suficiente para empezar).

---

## 🚀 Configuración Básica (15 minutos)

### Paso 1: Crear Cuenta en Sentry

1. Ve a [https://sentry.io/signup/](https://sentry.io/signup/)
2. Crea una cuenta (puedes usar tu email de Cresalia)
3. Selecciona "JavaScript" como plataforma
4. Selecciona "Browser" como framework

### Paso 2: Obtener tu DSN (Data Source Name)

1. En Sentry, ve a **Settings** → **Projects** → **Tu Proyecto**
2. Copia tu **DSN** (se ve así: `https://abc123@o123456.ingest.sentry.io/123456`)

### Paso 3: Configurar en Vercel

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega:
   - **Nombre:** `SENTRY_DSN`
   - **Valor:** Tu DSN de Sentry
   - **Environment:** Production, Preview, Development

### Paso 4: Instalar Sentry en el Código

Crea un archivo `js/sentry-monitoring.js`:

```javascript
// ===== SENTRY MONITOREO BÁSICO =====
// Detecta errores automáticamente y los reporta a Sentry

(function() {
    // Solo cargar si SENTRY_DSN está configurado
    const SENTRY_DSN = window.SENTRY_DSN || null;
    
    if (!SENTRY_DSN) {
        console.log('⚠️ Sentry no configurado. Los errores no se reportarán.');
        return;
    }
    
    // Cargar script de Sentry
    const script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/7.75.0/bundle.min.js';
    script.integrity = 'sha384-0h2Xy8X13V7h3kzX4XqJlc0L3/5Fb5j3IQC5K2GR4FDkLBV8QvQz9vK2F8Lvf3Y';
    script.crossOrigin = 'anonymous';
    script.onload = function() {
        // Inicializar Sentry
        Sentry.init({
            dsn: SENTRY_DSN,
            environment: window.location.hostname.includes('vercel.app') ? 'production' : 'development',
            tracesSampleRate: 0.1, // 10% de las transacciones (para no exceder el límite gratis)
            beforeSend(event, hint) {
                // Filtrar errores que no queremos reportar
                if (event.exception) {
                    const error = hint.originalException || hint.syntheticException;
                    const errorMessage = error?.message || '';
                    
                    // No reportar errores de:
                    // - Extensiones del navegador
                    if (errorMessage.includes('chrome-extension://') || 
                        errorMessage.includes('moz-extension://')) {
                        return null;
                    }
                    
                    // - Scripts bloqueados por CSP
                    if (errorMessage.includes('Content Security Policy')) {
                        return null;
                    }
                }
                
                return event;
            }
        });
        
        // Agregar contexto del usuario (si está logueado)
        if (window.usuarioActual) {
            Sentry.setUser({
                email: window.usuarioActual.email,
                id: window.usuarioActual.id
            });
        }
        
        console.log('✅ Sentry inicializado correctamente');
    };
    
    document.head.appendChild(script);
})();
```

### Paso 5: Agregar a tus páginas HTML

Agrega esto antes del `</body>` en tus páginas principales:

```html
<!-- Monitoreo de Errores con Sentry -->
<script>
    // Inyectar DSN desde Vercel (si está configurado)
    window.SENTRY_DSN = '{{SENTRY_DSN}}'; // Vercel lo reemplazará automáticamente
</script>
<script src="js/sentry-monitoring.js"></script>
```

---

## 📊 ¿Qué Verás en Sentry?

### Dashboard Principal

Cuando entres a Sentry, verás:

1. **Issues (Problemas)**
   - Lista de todos los errores
   - Cuántas veces ocurrió cada error
   - Última vez que ocurrió
   - Estado (Resuelto, Sin resolver, Ignorado)

2. **Performance (Rendimiento)**
   - Tiempo de carga de páginas
   - Queries lentas
   - Transacciones lentas

3. **Releases (Versiones)**
   - Versiones de tu código
   - Qué errores se introdujeron en cada versión

---

## 🔔 Alertas por Email

### Configurar Alertas

1. En Sentry, ve a **Alerts** → **Create Alert Rule**
2. Configura:
   - **When:** "An issue is created" (cuando se crea un problema)
   - **If:** "The event count is greater than 0" (si hay al menos 1 error)
   - **Then:** Enviar email a `cresalia25@gmail.com`

### Tipos de Alertas Útiles

1. **Error Crítico**
   - Cuando un error ocurre más de 10 veces en 1 hora
   - Te alerta inmediatamente

2. **Error Nuevo**
   - Cuando aparece un error que nunca habías visto
   - Te ayuda a detectar problemas nuevos

3. **Error Frecuente**
   - Cuando un error ocurre más de 50 veces en 1 día
   - Te indica problemas que afectan a muchos usuarios

---

## 🎯 Monitoreo Básico Recomendado

### 1. Errores de JavaScript

Sentry detecta automáticamente:
- Errores de sintaxis
- Errores de runtime
- Errores de promesas rechazadas
- Errores de async/await

### 2. Errores de API

Para monitorear errores de API, agrega esto en tus endpoints:

```javascript
// En tus API endpoints (ej: api/mercadopago-preference.js)
try {
    // Tu código...
} catch (error) {
    // Reportar a Sentry
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(error, {
            tags: {
                endpoint: '/api/mercadopago-preference',
                method: req.method
            },
            extra: {
                body: req.body,
                headers: req.headers
            }
        });
    }
    
    // Tu manejo de error normal...
    return res.status(500).json({ error: error.message });
}
```

### 3. Errores de Supabase

Para monitorear errores de Supabase:

```javascript
const { data, error } = await supabase
    .from('tabla')
    .select('*');

if (error) {
    // Reportar a Sentry
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(error, {
            tags: {
                service: 'supabase',
                table: 'tabla',
                operation: 'select'
            },
            extra: {
                error_code: error.code,
                error_message: error.message
            }
        });
    }
    
    console.error('Error de Supabase:', error);
}
```

---

## 📈 Métricas Básicas

### ¿Qué Monitorear?

1. **Tasa de Errores**
   - % de requests que fallan
   - Objetivo: < 1%

2. **Tiempo de Respuesta**
   - Tiempo promedio de carga
   - Objetivo: < 2 segundos

3. **Errores por Endpoint**
   - Qué endpoints fallan más
   - Priorizar arreglos

4. **Errores por Usuario**
   - Qué usuarios tienen más problemas
   - Contactarlos para ayudar

---

## 💡 Mejores Prácticas

### 1. No Reportar Todo

No reportes:
- Errores de extensiones del navegador
- Errores de scripts bloqueados por CSP
- Errores esperados (ej: validación de formularios)

### 2. Agregar Contexto

Siempre agrega contexto útil:
```javascript
Sentry.captureException(error, {
    tags: {
        feature: 'pagos',
        user_type: 'vendedor'
    },
    extra: {
        tenant_id: tenantId,
        order_id: orderId
    }
});
```

### 3. Agrupar Errores Similares

Sentry agrupa automáticamente errores similares, pero puedes ayudar:
```javascript
Sentry.captureException(error, {
    fingerprint: ['pago-mercadopago', error.code] // Agrupa por código de error
});
```

---

## 🆓 Plan Gratuito de Sentry

**Límites del plan gratuito:**
- ✅ 5,000 eventos/mes
- ✅ 10,000 transacciones/mes
- ✅ 1 proyecto
- ✅ Alertas por email
- ✅ 7 días de retención de datos

**Para Cresalia al inicio:**
- Esto es más que suficiente
- Si creces mucho, puedes actualizar después

---

## 🚀 Implementación Rápida (30 minutos)

### Opción 1: Solo Frontend (Más Rápido)

1. Crea cuenta en Sentry (5 min)
2. Obtén tu DSN (2 min)
3. Agrega `js/sentry-monitoring.js` (10 min)
4. Agrega el script a `index-cresalia.html` (3 min)
5. Prueba generando un error (5 min)

**Total:** ~25 minutos

### Opción 2: Frontend + Backend (Más Completo)

1. Todo lo de Opción 1 (25 min)
2. Agregar Sentry a endpoints críticos (20 min)
3. Configurar alertas (5 min)

**Total:** ~50 minutos

---

## 📞 Soporte

Si tienes problemas:
- **Documentación de Sentry:** [https://docs.sentry.io/](https://docs.sentry.io/)
- **Email de Cresalia:** cresalia25@gmail.com

---

## ✅ Checklist de Implementación

- [ ] Crear cuenta en Sentry
- [ ] Obtener DSN
- [ ] Configurar DSN en Vercel
- [ ] Crear `js/sentry-monitoring.js`
- [ ] Agregar script a páginas principales
- [ ] Configurar alertas por email
- [ ] Probar generando un error
- [ ] Verificar que los errores aparecen en Sentry

---

**Última actualización:** 2025-01-27  
**Mantenido por:** Equipo Cresalia 💜