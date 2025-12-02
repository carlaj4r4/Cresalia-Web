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
        if (typeof Sentry !== 'undefined') {
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
        }
    };
    
    script.onerror = function() {
        console.warn('⚠️ No se pudo cargar Sentry. Verificá tu conexión a internet.');
    };
    
    document.head.appendChild(script);
})();


