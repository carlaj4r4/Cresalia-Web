// ===== SISTEMA DE MONITOREO DE ERRORES 100% GRATUITO =====
// Alternativa a Sentry - Guarda errores en localStorage y permite exportar

class MonitoreoErrores {
    constructor() {
        this.maxErrores = 1000; // Máximo de errores guardados
        this.errores = this.cargarErrores();
        
        // Configuración de alertas
        this.configAlertas = {
            enabled: true,
            email: 'cresalia25@gmail.com', // Email para alertas críticas
            erroresCriticosParaAlerta: 5, // Alertar si hay 5+ errores críticos en 1 hora
            intervaloAlerta: 60 * 60 * 1000, // 1 hora en ms
            notificacionesPush: true // Notificaciones del navegador
        };
        
        // Errores críticos (palabras clave que indican errores importantes)
        this.palabrasClaveCriticas = [
            'payment', 'pago', 'mercado pago', 'subscription', 'suscripcion',
            'auth', 'authentication', 'login', 'logout', 'session',
            'database', 'supabase', 'rlp', 'row level security',
            'network', 'fetch failed', 'connection', 'timeout',
            'critical', 'crítico', 'security', 'seguridad'
        ];
        
        this.erroresCriticos = [];
        this.ultimaAlertaEmail = null;
        
        this.solicitarPermisosNotificaciones();
        this.configurarErrorHandling();
        console.log('✅ Sistema de monitoreo de errores activado (gratuito)');
    }
    
    // Solicitar permisos para notificaciones push
    solicitarPermisosNotificaciones() {
        if (!this.configAlertas.notificacionesPush) return;
        
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('✅ Permisos de notificaciones concedidos');
                }
            });
        }
    }
    
    cargarErrores() {
        try {
            const guardados = localStorage.getItem('errores_log');
            return guardados ? JSON.parse(guardados) : [];
        } catch (e) {
            return [];
        }
    }
    
    guardarErrores() {
        try {
            // Mantener solo los últimos N errores
            if (this.errores.length > this.maxErrores) {
                this.errores = this.errores.slice(-this.maxErrores);
            }
            localStorage.setItem('errores_log', JSON.stringify(this.errores));
        } catch (e) {
            console.error('Error guardando errores:', e);
        }
    }
    
    // Detectar si un error es crítico
    esErrorCritico(errorInfo) {
        const textoCompleto = (
            errorInfo.mensaje + ' ' + 
            errorInfo.stack + ' ' + 
            errorInfo.url + ' ' +
            (errorInfo.contexto ? JSON.stringify(errorInfo.contexto) : '')
        ).toLowerCase();
        
        return this.palabrasClaveCriticas.some(palabra => 
            textoCompleto.includes(palabra.toLowerCase())
        );
    }
    
    // Mostrar notificación push del navegador
    mostrarNotificacionPush(errorInfo) {
        if (!this.configAlertas.notificacionesPush) return;
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        
        try {
            const notificacion = new Notification('🚨 Error Crítico - Cresalia', {
                body: errorInfo.mensaje.substring(0, 100) + (errorInfo.mensaje.length > 100 ? '...' : ''),
                icon: '/assets/logo/logo-cresalia.png',
                badge: '/assets/logo/logo-cresalia.png',
                tag: `error-${errorInfo.id}`,
                requireInteraction: true,
                timestamp: Date.now()
            });
            
            // Cerrar después de 10 segundos
            setTimeout(() => notificacion.close(), 10000);
            
            // Click en notificación abre la consola
            notificacion.onclick = () => {
                window.focus();
                notificacion.close();
            };
        } catch (e) {
            console.warn('Error mostrando notificación:', e);
        }
    }
    
    // Enviar alerta por email usando Brevo API
    async enviarAlertaEmail(errorInfo) {
        // Verificar límite de alertas por hora
        const ahora = Date.now();
        if (this.ultimaAlertaEmail && (ahora - this.ultimaAlertaEmail) < this.configAlertas.intervaloAlerta) {
            return; // Ya se envió una alerta recientemente
        }
        
        try {
            // Preparar contenido HTML del email
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                        .error-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; border-radius: 4px; }
                        .error-stack { background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; overflow-x: auto; max-height: 300px; overflow-y: auto; }
                        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
                        .stat { text-align: center; }
                        .stat-value { font-size: 24px; font-weight: bold; color: #dc2626; }
                        .stat-label { font-size: 12px; color: #6b7280; }
                        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🚨 Error Crítico Detectado</h1>
                            <p>Cresalia - Sistema de Monitoreo</p>
                        </div>
                        <div class="content">
                            <div class="error-box">
                                <h2>${errorInfo.tipo || 'Error'}</h2>
                                <p><strong>Mensaje:</strong> ${errorInfo.mensaje}</p>
                                <p><strong>URL:</strong> <a href="${errorInfo.url}">${errorInfo.url}</a></p>
                                <p><strong>Fecha:</strong> ${new Date(errorInfo.timestamp).toLocaleString('es-ES')}</p>
                            </div>
                            
                            <div class="stats">
                                <div class="stat">
                                    <div class="stat-value">${this.errores.length}</div>
                                    <div class="stat-label">Total de Errores</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-value">${this.erroresCriticos.length}</div>
                                    <div class="stat-label">Errores Críticos</div>
                                </div>
                            </div>
                            
                            ${errorInfo.stack ? `
                            <h3>Stack Trace:</h3>
                            <div class="error-stack">${errorInfo.stack.substring(0, 1000).replace(/\n/g, '<br>')}</div>
                            ` : ''}
                            
                            <p style="margin-top: 20px;">
                                <strong>User Agent:</strong><br>
                                <small>${errorInfo.userAgent}</small>
                            </p>
                            
                            <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                Este email fue enviado automáticamente por el sistema de monitoreo de Cresalia.<br>
                                Para revisar todos los errores, abre la consola del navegador y ejecuta: <code>verErrores()</code>
                            </p>
                        </div>
                        <div class="footer">
                            <p>Cresalia - Plataforma para emprendedores</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
            
            // Enviar email usando el endpoint de Brevo
            const response = await fetch('/api/enviar-email-brevo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: this.configAlertas.email,
                    to_name: 'Equipo Cresalia',
                    subject: `🚨 Error Crítico: ${errorInfo.tipo || 'Error'} - ${errorInfo.mensaje.substring(0, 50)}`,
                    html_content: htmlContent,
                    text_content: `Error Crítico Detectado\n\nTipo: ${errorInfo.tipo}\nMensaje: ${errorInfo.mensaje}\nURL: ${errorInfo.url}\nFecha: ${errorInfo.timestamp}\n\nTotal de errores: ${this.errores.length}\nErrores críticos: ${this.erroresCriticos.length}`
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
                console.warn('⚠️ Error enviando alerta por email:', errorData.error || 'Error desconocido');
                return;
            }
            
            const result = await response.json();
            console.log('✅ Alerta de error crítico enviada por email:', result.message);
            this.ultimaAlertaEmail = ahora;
            
        } catch (e) {
            console.warn('⚠️ Error enviando alerta por email:', e);
        }
    }
    
    registrarError(error, contexto = {}) {
        const errorInfo = {
            id: Date.now() + Math.random(),
            mensaje: error.message || String(error),
            stack: error.stack || '',
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            contexto: contexto,
            tipo: error.name || 'Error',
            esCritico: false
        };
        
        // Detectar si es crítico
        errorInfo.esCritico = this.esErrorCritico(errorInfo);
        
        this.errores.push(errorInfo);
        this.guardarErrores();
        
        // Si es crítico, agregar a lista de críticos y alertar
        if (errorInfo.esCritico) {
            this.erroresCriticos.push(errorInfo);
            
            // Mantener solo los últimos 100 críticos
            if (this.erroresCriticos.length > 100) {
                this.erroresCriticos = this.erroresCriticos.slice(-100);
            }
            
            // Mostrar notificación push inmediata
            this.mostrarNotificacionPush(errorInfo);
            
            // Verificar si debemos enviar alerta por email
            const erroresCriticosUltimaHora = this.erroresCriticos.filter(e => {
                const tiempoError = new Date(e.timestamp).getTime();
                const unaHoraAtras = Date.now() - this.configAlertas.intervaloAlerta;
                return tiempoError > unaHoraAtras;
            });
            
            if (erroresCriticosUltimaHora.length >= this.configAlertas.erroresCriticosParaAlerta) {
                this.enviarAlertaEmail(errorInfo);
            }
        }
        
        // Mostrar en consola
        if (errorInfo.esCritico) {
            console.error('🚨 ERROR CRÍTICO registrado:', errorInfo);
        } else {
            console.error('⚠️ Error registrado:', errorInfo);
        }
        
        // Si hay más de 50 errores, mostrar advertencia
        if (this.errores.length > 50) {
            console.warn('⚠️ Tienes muchos errores registrados. Considera revisarlos.');
        }
    }
    
    configurarErrorHandling() {
        // Capturar errores globales de JavaScript
        window.addEventListener('error', (event) => {
            this.registrarError(event.error || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
        
        // Capturar promesas rechazadas
        window.addEventListener('unhandledrejection', (event) => {
            this.registrarError(event.reason, {
                tipo: 'Unhandled Promise Rejection'
            });
        });
        
        // Override console.error para capturar también
        const originalError = console.error;
        console.error = (...args) => {
            originalError.apply(console, args);
            // Solo registrar si parece un error real
            if (args[0] && typeof args[0] === 'object' && args[0].message) {
                this.registrarError(args[0], { fuente: 'console.error' });
            }
        };
    }
    
    // Obtener errores recientes
    obtenerErroresRecientes(limite = 50) {
        return this.errores.slice(-limite).reverse();
    }
    
    // Obtener errores por tipo
    obtenerErroresPorTipo(tipo) {
        return this.errores.filter(e => e.tipo === tipo);
    }
    
    // Contar errores por día
    contarErroresPorDia() {
        const porDia = {};
        this.errores.forEach(error => {
            const dia = error.timestamp.split('T')[0];
            porDia[dia] = (porDia[dia] || 0) + 1;
        });
        return porDia;
    }
    
    // Exportar errores como JSON
    exportarErrores() {
        const datos = {
            exportado: new Date().toISOString(),
            total: this.errores.length,
            errores: this.errores,
            resumen: {
                porTipo: {},
                porDia: this.contarErroresPorDia()
            }
        };
        
        // Contar por tipo
        this.errores.forEach(e => {
            datos.resumen.porTipo[e.tipo] = (datos.resumen.porTipo[e.tipo] || 0) + 1;
        });
        
        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `errores-cresalia-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Errores exportados');
    }
    
    // Limpiar errores antiguos (más de 30 días)
    limpiarErroresAntiguos() {
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);
        
        this.errores = this.errores.filter(e => {
            return new Date(e.timestamp) > hace30Dias;
        });
        this.guardarErrores();
        console.log('✅ Errores antiguos limpiados');
    }
    
    // Limpiar todos los errores
    limpiarTodos() {
        this.errores = [];
        this.erroresCriticos = [];
        this.guardarErrores();
        console.log('✅ Todos los errores eliminados');
    }
    
    // Obtener errores críticos
    obtenerErroresCriticos(limite = 50) {
        return this.erroresCriticos.slice(-limite).reverse();
    }
    
    // Contar errores críticos por día
    contarErroresCriticosPorDia() {
        const porDia = {};
        this.erroresCriticos.forEach(error => {
            const dia = error.timestamp.split('T')[0];
            porDia[dia] = (porDia[dia] || 0) + 1;
        });
        return porDia;
    }
    
    // Configurar email para alertas
    configurarEmailAlerta(email) {
        this.configAlertas.email = email;
        console.log('✅ Email de alertas configurado:', email);
    }
}

// Inicializar globalmente
window.monitoreoErrores = new MonitoreoErrores();

// Función global para registrar errores manualmente
window.registrarError = (error, contexto) => {
    window.monitoreoErrores.registrarError(error, contexto);
};

// Exportar funciones útiles
window.verErrores = () => {
    return window.monitoreoErrores.obtenerErroresRecientes(50);
};

window.exportarErrores = () => {
    window.monitoreoErrores.exportarErrores();
};

window.verErroresCriticos = () => {
    return window.monitoreoErrores.obtenerErroresCriticos(50);
};

window.configurarEmailAlerta = (email) => {
    window.monitoreoErrores.configurarEmailAlerta(email);
};

