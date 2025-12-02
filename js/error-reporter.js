// ===== SISTEMA PROPIO DE MONITOREO DE ERRORES =====
// Fallback cuando Bugsnag/Rollbar no estén disponibles
// Envía alertas por email vía Brevo

const ERROR_REPORTER_CONFIG = {
    apiEndpoint: '/api/reportar-error',
    enabled: true,
    // Solo reportar errores críticos y altos automáticamente
    reportOnLevel: ['critical', 'high'],
    // Cache de errores para evitar spam
    errorCache: new Map(),
    cacheTimeout: 5 * 60 * 1000, // 5 minutos
    maxErrorsPerMinute: 10
};

// Contador de errores por minuto
let errorCount = 0;
let errorCountReset = Date.now();

// ===== DETECTAR Y REPORTAR ERRORES =====

// Capturar errores de JavaScript
window.addEventListener('error', (event) => {
    if (!ERROR_REPORTER_CONFIG.enabled) return;
    
    // Resetear contador si pasó un minuto
    if (Date.now() - errorCountReset > 60000) {
        errorCount = 0;
        errorCountReset = Date.now();
    }
    
    // Limitar cantidad de errores
    if (errorCount >= ERROR_REPORTER_CONFIG.maxErrorsPerMinute) {
        console.warn('⚠️ Demasiados errores en el último minuto. Pausando reportes.');
        return;
    }
    
    errorCount++;
    
    // Determinar severidad
    let severity = 'medium';
    if (event.error) {
        // Errores críticos: CORS, Network, Syntax
        if (event.message.includes('CORS') || 
            event.message.includes('Network') || 
            event.message.includes('SyntaxError') ||
            event.message.includes('Failed to fetch')) {
            severity = 'critical';
        }
        // Errores altos: TypeError, ReferenceError
        else if (event.message.includes('TypeError') || 
                 event.message.includes('ReferenceError') ||
                 event.message.includes('Cannot read')) {
            severity = 'high';
        }
    }
    
    // Solo reportar errores críticos y altos
    if (!ERROR_REPORTER_CONFIG.reportOnLevel.includes(severity)) {
        return;
    }
    
    // Verificar si ya reportamos este error recientemente
    const errorKey = `${event.message}_${event.filename}_${event.lineno}`;
    const lastReported = ERROR_REPORTER_CONFIG.errorCache.get(errorKey);
    
    if (lastReported && (Date.now() - lastReported < ERROR_REPORTER_CONFIG.cacheTimeout)) {
        // Ya reportamos este error recientemente, saltarlo
        return;
    }
    
    // Marcar como reportado
    ERROR_REPORTER_CONFIG.errorCache.set(errorKey, Date.now());
    
    // Reportar error
    reportError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        severity: severity
    });
});

// Capturar promesas rechazadas sin catch
window.addEventListener('unhandledrejection', (event) => {
    if (!ERROR_REPORTER_CONFIG.enabled) return;
    
    // Resetear contador si pasó un minuto
    if (Date.now() - errorCountReset > 60000) {
        errorCount = 0;
        errorCountReset = Date.now();
    }
    
    if (errorCount >= ERROR_REPORTER_CONFIG.maxErrorsPerMinute) {
        return;
    }
    
    errorCount++;
    
    // Determinar severidad
    let severity = 'medium';
    const reason = event.reason?.message || event.reason?.toString() || 'Unknown error';
    
    if (reason.includes('Failed to fetch') || 
        reason.includes('Network') ||
        reason.includes('CORS')) {
        severity = 'critical';
    } else if (reason.includes('401') || reason.includes('403') || reason.includes('500')) {
        severity = 'high';
    }
    
    if (!ERROR_REPORTER_CONFIG.reportOnLevel.includes(severity)) {
        return;
    }
    
    const errorKey = `unhandled_${reason}`;
    const lastReported = ERROR_REPORTER_CONFIG.errorCache.get(errorKey);
    
    if (lastReported && (Date.now() - lastReported < ERROR_REPORTER_CONFIG.cacheTimeout)) {
        return;
    }
    
    ERROR_REPORTER_CONFIG.errorCache.set(errorKey, Date.now());
    
    reportError({
        message: `Unhandled Promise Rejection: ${reason}`,
        stack: event.reason?.stack,
        severity: severity,
        type: 'unhandledrejection'
    });
});

// ===== FUNCIÓN PARA REPORTAR ERRORES =====
function reportError(errorData) {
    // Obtener información del usuario (si está disponible)
    let userData = null;
    try {
        const sessionData = localStorage.getItem('cresalia_user_data');
        if (sessionData) {
            userData = JSON.parse(sessionData);
        }
    } catch (e) {
        // Ignorar errores al leer localStorage
    }
    
    // Preparar datos para enviar
    const payload = {
        error: {
            message: errorData.message || 'Unknown error',
            stack: errorData.stack || null,
            filename: errorData.filename || null,
            lineno: errorData.lineno || null,
            colno: errorData.colno || null,
            type: errorData.type || 'error'
        },
        url: window.location.href,
        userAgent: navigator.userAgent,
        user: userData,
        severity: errorData.severity || 'medium',
        metadata: {
            timestamp: new Date().toISOString(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            platform: navigator.platform,
            language: navigator.language
        }
    };
    
    // Enviar al endpoint (usar fetch con manejo de errores)
    fetch(ERROR_REPORTER_CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).catch(err => {
        // Si falla el reporte, no hacer nada (no queremos crear un bucle infinito)
        console.warn('⚠️ No se pudo reportar el error:', err);
    });
}

// ===== FUNCIÓN PARA REPORTAR ERRORES MANUALMENTE =====
window.reportarError = function(message, severity = 'medium', metadata = {}) {
    if (!ERROR_REPORTER_CONFIG.enabled) {
        console.warn('⚠️ Sistema de reporte de errores deshabilitado');
        return;
    }
    
    reportError({
        message: message,
        severity: severity,
        metadata: metadata,
        type: 'manual'
    });
};

// ===== LIMPIAR CACHE PERIÓDICAMENTE =====
setInterval(() => {
    const now = Date.now();
    for (const [key, timestamp] of ERROR_REPORTER_CONFIG.errorCache.entries()) {
        if (now - timestamp > ERROR_REPORTER_CONFIG.cacheTimeout) {
            ERROR_REPORTER_CONFIG.errorCache.delete(key);
        }
    }
}, 60000); // Cada minuto

console.log('✅ Sistema de monitoreo de errores propio cargado');



