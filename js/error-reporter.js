// ===== SISTEMA PROPIO DE MONITOREO DE ERRORES =====
// Fallback cuando Bugsnag/Rollbar no estén disponibles
// Envía alertas por email vía Brevo

const ERROR_REPORTER_CONFIG = {
    apiEndpoint: '/api/enviar-email-brevo', // Usar endpoint de Brevo directamente
    enabled: true,
    // Solo reportar errores críticos y altos automáticamente
    reportOnLevel: ['critical', 'high'],
    // Cache de errores para evitar spam
    errorCache: new Map(),
    cacheTimeout: 5 * 60 * 1000, // 5 minutos
    maxErrorsPerMinute: 10,
    adminEmail: 'cresalia25@gmail.com' // Email de destino para errores
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
    
    // Determinar severidad y configurar email
    const severity = errorData.severity || 'medium';
    const severityConfig = {
        'critical': { subject: '🚨 ERROR CRÍTICO - Cresalia', priority: 'urgent' },
        'high': { subject: '⚠️ Error Importante - Cresalia', priority: 'high' },
        'medium': { subject: 'ℹ️ Error Moderado - Cresalia', priority: 'normal' },
        'low': { subject: '📝 Error Menor - Cresalia', priority: 'low' }
    }[severity] || { subject: '📝 Error - Cresalia', priority: 'normal' };
    
    // Solo enviar email para errores críticos y altos
    if (severity !== 'critical' && severity !== 'high') {
        return; // No enviar email para errores menores
    }
    
    // Construir HTML del email
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .error-box { background: white; padding: 15px; border-left: 4px solid #ef4444; margin: 15px 0; border-radius: 5px; }
        .metadata { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border: 1px solid #e5e7eb; }
        .label { font-weight: bold; color: #667eea; }
        .footer { background: #1f2937; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        pre { background: #1f2937; color: #10b981; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${severityConfig.subject}</h1>
        <p>Error detectado en Cresalia</p>
    </div>
    <div class="content">
        <div class="error-box">
            <h2>📋 Detalles del Error</h2>
            <p><span class="label">Mensaje:</span> ${(errorData.message || 'Unknown error').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            <p><span class="label">Severidad:</span> ${severity.toUpperCase()}</p>
            ${errorData.stack ? `<p><span class="label">Stack Trace:</span></p><pre>${errorData.stack.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>` : ''}
        </div>
        <div class="metadata">
            <h3>📊 Información Adicional</h3>
            <p><span class="label">URL:</span> ${window.location.href}</p>
            <p><span class="label">User Agent:</span> ${navigator.userAgent}</p>
            <p><span class="label">Usuario:</span> ${userData?.email || userData?.nombre || 'Anónimo'}</p>
            <p><span class="label">Fecha:</span> ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
            ${errorData.filename ? `<p><span class="label">Archivo:</span> ${errorData.filename}:${errorData.lineno || '?'}:${errorData.colno || '?'}</p>` : ''}
        </div>
    </div>
    <div class="footer">
        <p>Este es un email automático del sistema de monitoreo de Cresalia</p>
    </div>
</body>
</html>
    `;
    
    // Enviar email usando el endpoint de Brevo
    fetch(ERROR_REPORTER_CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: ERROR_REPORTER_CONFIG.adminEmail,
            to_name: 'Cresalia Admin',
            subject: severityConfig.subject,
            html_content: emailBody
        })
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



