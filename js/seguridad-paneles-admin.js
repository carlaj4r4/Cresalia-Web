// ===== SISTEMA DE SEGURIDAD PARA PANELES ADMINISTRATIVOS - CRESALIA =====
// Protección contra ataques y acceso no autorizado

class SeguridadPanelesAdmin {
    constructor() {
        this.config = {
            sessionTimeout: 30 * 60 * 1000, // 30 minutos
            maxLoginAttempts: 5,
            lockoutDuration: 15 * 60 * 1000, // 15 minutos
            maxRequestsPerMinute: 30,
            enableCSRF: true,
            enableRateLimiting: true,
            logSecurityEvents: true
        };
        
        this.state = {
            isAuthenticated: false,
            loginAttempts: 0,
            lastLoginAttempt: 0,
            sessionStartTime: null,
            requestCount: 0,
            lastRequestTime: Date.now(),
            csrfToken: null
        };
        
        this.init();
    }
    
    init() {
        // Verificar autenticación al cargar
        this.verificarAutenticacion();
        
        // Configurar timeout de sesión
        this.configurarTimeoutSesion();
        
        // Configurar rate limiting
        if (this.config.enableRateLimiting) {
            this.configurarRateLimiting();
        }
        
        // Generar token CSRF
        if (this.config.enableCSRF) {
            this.generarCSRFToken();
        }
        
        // Monitorear actividad
        this.monitorearActividad();
        
        // Proteger contra navegación atrás
        this.protegerNavegacionAtras();
    }
    
    // ===== VERIFICACIÓN DE AUTENTICACIÓN =====
    verificarAutenticacion() {
        // Paneles que requieren autenticación específica
        const panelesEspeciales = [
            'panel-moderacion-foro-comunidades',
            'panel-moderacion-chat-seguro',
            'panel-auditoria',
            'panel-comunidad-vendedores',
            'panel-comunidad-compradores',
            'panel-master-cresalia'
        ];
        
        const esPanelEspecial = panelesEspeciales.some(panel => 
            window.location.pathname.includes(panel) || 
            window.location.href.includes(panel)
        );
        
        // Si es un panel especial, verificar autenticación de admin/master
        if (esPanelEspecial) {
            const sessionData = this.obtenerSesion();
            const esAdmin = this.verificarEsAdmin();
            
            if (!sessionData || !sessionData.authenticated || !esAdmin) {
                // Para paneles especiales, redirigir a login de admin/master
                this.redirigirALoginAdmin();
                return false;
            }
        } else {
            // Para otros paneles, verificar sesión normal
            const sessionData = this.obtenerSesion();
            
            if (!sessionData || !sessionData.authenticated) {
                this.redirigirALogin();
                return false;
            }
        }
        
        // Verificar expiración de sesión
        const sessionData = this.obtenerSesion();
        const tiempoTranscurrido = Date.now() - sessionData.timestamp;
        if (tiempoTranscurrido > this.config.sessionTimeout) {
            this.cerrarSesion();
            this.redirigirALogin();
            return false;
        }
        
        this.state.isAuthenticated = true;
        this.state.sessionStartTime = sessionData.timestamp;
        
        return true;
    }
    
    verificarEsAdmin() {
        // Verificar si el usuario es admin/master
        const userData = localStorage.getItem('cresalia_user_data');
        const adminSession = localStorage.getItem('adminSession');
        
        if (adminSession) {
            try {
                const session = JSON.parse(adminSession);
                return session.authenticated && (session.role === 'admin' || session.role === 'master');
            } catch (e) {
                return false;
            }
        }
        
        if (userData) {
            try {
                const user = JSON.parse(userData);
                return user.tipo === 'admin' || user.tipo === 'master' || user.role === 'admin' || user.role === 'master';
            } catch (e) {
                return false;
            }
        }
        
        return false;
    }
    
    redirigirALoginAdmin() {
        // Guardar la URL actual para redirigir después del login
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectAfterLogin', currentUrl);
        
        // Redirigir a login de admin/master
        window.location.href = 'admin-cresalia.html';
    }
    
    obtenerSesion() {
        try {
            const sessionStr = localStorage.getItem('adminSession');
            if (!sessionStr) return null;
            return JSON.parse(sessionStr);
        } catch (error) {
            console.error('Error obteniendo sesión:', error);
            return null;
        }
    }
    
    redirigirALogin() {
        // Verificar si estamos en un panel de emergencias
        const esPanelEmergencias = window.location.pathname.includes('panel-crear-campana') || 
                                   window.location.pathname.includes('panel-verificacion');
        
        if (esPanelEmergencias) {
            // Para paneles de emergencias, mostrar mensaje de verificación requerida
            this.mostrarMensajeVerificacionEmergencias();
            return;
        }
        
        // Guardar la URL actual para redirigir después del login
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectAfterLogin', currentUrl);
        
        // Redirigir a página de login
        window.location.href = 'admin-cresalia.html';
    }
    
    mostrarMensajeVerificacionEmergencias() {
        // Ocultar el contenido principal
        const container = document.querySelector('.container-main');
        if (container) {
            container.style.display = 'none';
        }
        
        // Crear mensaje de verificación requerida
        const mensajeHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 20px;">
                <div style="background: white; border-radius: 20px; padding: 40px; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                    <h1 style="color: #EF4444; margin-bottom: 20px; font-size: 2rem;">Verificación Requerida</h1>
                    
                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 10px; margin-bottom: 25px; text-align: left;">
                        <p style="color: #92400E; margin: 0; line-height: 1.8; font-size: 1rem;">
                            <strong>Disculpas por la inconveniencia.</strong>
                        </p>
                        <p style="color: #92400E; margin: 10px 0 0 0; line-height: 1.8; font-size: 1rem;">
                            Los paneles de <strong>Cresalia Solidaria Emergencias</strong> requieren verificación de identidad por seguridad. 
                            Esto es necesario porque:
                        </p>
                        <ul style="color: #92400E; margin: 15px 0 0 20px; line-height: 1.8; font-size: 0.95rem;">
                            <li>🚨 Las campañas de emergencia afectan a personas en situaciones críticas</li>
                            <li>🛡️ Necesitamos prevenir fraudes y campañas falsas</li>
                            <li>✅ Solo personal autorizado puede crear y verificar campañas</li>
                            <li>💜 Protegemos tanto a donantes como a beneficiarios</li>
                        </ul>
                    </div>
                    
                    <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 20px; border-radius: 10px; margin-bottom: 25px; text-align: left;">
                        <p style="color: #065F46; margin: 0; line-height: 1.8; font-size: 1rem;">
                            <strong>¿Necesitás crear o verificar una campaña?</strong>
                        </p>
                        <p style="color: #065F46; margin: 10px 0 0 0; line-height: 1.8; font-size: 0.95rem;">
                            Por favor, contactá a <strong>CRISLA</strong> para obtener acceso autorizado. 
                            Este proceso de verificación nos ayuda a mantener la integridad del sistema y proteger a todos.
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 30px;">
                        <a href="index.html" style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 20px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            <i class="fas fa-arrow-left"></i> Volver a Emergencias
                        </a>
                        <a href="../index-cresalia.html" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 20px rgba(102, 126, 234, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            <i class="fas fa-home"></i> Ir a Cresalia
                        </a>
                    </div>
                    
                    <p style="color: #6B7280; margin-top: 30px; font-size: 0.9rem; line-height: 1.6;">
                        <i class="fas fa-shield-alt"></i> 
                        <strong>Gracias por tu comprensión.</strong> Esta verificación es parte de nuestro compromiso con la transparencia y seguridad en situaciones de emergencia.
                    </p>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', mensajeHTML);
    }
    
    cerrarSesion() {
        localStorage.removeItem('adminSession');
        this.state.isAuthenticated = false;
        this.state.sessionStartTime = null;
        this.logSecurityEvent('logout', 'Sesión cerrada');
    }
    
    // ===== CONFIGURACIÓN DE TIMEOUT DE SESIÓN =====
    configurarTimeoutSesion() {
        // Extender sesión en actividad
        document.addEventListener('mousemove', () => this.extenderSesion());
        document.addEventListener('keypress', () => this.extenderSesion());
        document.addEventListener('click', () => this.extenderSesion());
        
        // Verificar sesión periódicamente
        setInterval(() => {
            if (!this.verificarAutenticacion()) {
                this.cerrarSesion();
                alert('⚠️ Tu sesión ha expirado. Por favor, iniciá sesión nuevamente.');
                this.redirigirALogin();
            }
        }, 60000); // Verificar cada minuto
    }
    
    extenderSesion() {
        const sessionData = this.obtenerSesion();
        if (sessionData) {
            sessionData.timestamp = Date.now();
            localStorage.setItem('adminSession', JSON.stringify(sessionData));
        }
    }
    
    // ===== RATE LIMITING =====
    configurarRateLimiting() {
        const originalFetch = window.fetch;
        const self = this;
        
        window.fetch = async function(...args) {
            // Verificar rate limit
            if (!self.verificarRateLimit()) {
                console.warn('⚠️ Rate limit excedido. Esperá un momento.');
                throw new Error('Rate limit excedido. Demasiadas solicitudes.');
            }
            
            return originalFetch.apply(this, args);
        };
    }
    
    verificarRateLimit() {
        const ahora = Date.now();
        const tiempoTranscurrido = ahora - this.state.lastRequestTime;
        
        // Resetear contador si pasó un minuto
        if (tiempoTranscurrido > 60000) {
            this.state.requestCount = 0;
            this.state.lastRequestTime = ahora;
        }
        
        // Incrementar contador
        this.state.requestCount++;
        
        // Verificar límite
        if (this.state.requestCount > this.config.maxRequestsPerMinute) {
            this.logSecurityEvent('rate_limit_exceeded', `Excedido: ${this.state.requestCount} solicitudes`);
            return false;
        }
        
        this.state.lastRequestTime = ahora;
        return true;
    }
    
    // ===== CSRF PROTECTION =====
    generarCSRFToken() {
        const token = this.generarTokenAleatorio();
        this.state.csrfToken = token;
        sessionStorage.setItem('csrfToken', token);
        return token;
    }
    
    obtenerCSRFToken() {
        return this.state.csrfToken || sessionStorage.getItem('csrfToken');
    }
    
    verificarCSRFToken(token) {
        const tokenGuardado = this.obtenerCSRFToken();
        return token === tokenGuardado;
    }
    
    generarTokenAleatorio() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // ===== VALIDACIÓN DE ENTRADA EN FORMULARIOS =====
    validarFormulario(formId) {
        const form = document.getElementById(formId);
        if (!form) return { valido: false, error: 'Formulario no encontrado' };
        
        // Validar todos los campos
        const campos = form.querySelectorAll('input, textarea, select');
        const errores = [];
        
        campos.forEach(campo => {
            if (campo.required && !campo.value.trim()) {
                errores.push(`El campo ${campo.name || campo.id} es requerido`);
            }
            
            // Validar con sistema de seguridad si está disponible
            if (typeof window.seguridadValidacion !== 'undefined' && campo.value) {
                // Detectar ataques
                const deteccion = window.seguridadValidacion.detectarAtaques(campo.value);
                if (deteccion.detectado) {
                    errores.push(`Intento de ataque detectado en ${campo.name || campo.id}`);
                    this.logSecurityEvent('attack_detected', {
                        campo: campo.name || campo.id,
                        tipos: deteccion.tipos
                    });
                }
            }
        });
        
        if (errores.length > 0) {
            return { valido: false, errores: errores };
        }
        
        // Validar CSRF token
        if (this.config.enableCSRF) {
            const csrfInput = form.querySelector('input[name="csrf_token"]');
            if (csrfInput && !this.verificarCSRFToken(csrfInput.value)) {
                errores.push('Token CSRF inválido');
                return { valido: false, errores: errores };
            }
        }
        
        return { valido: true, errores: [] };
    }
    
    // ===== PROTECCIÓN CONTRA LOGIN BRUTE FORCE =====
    verificarIntentosLogin() {
        const ahora = Date.now();
        const tiempoTranscurrido = ahora - this.state.lastLoginAttempt;
        
        // Resetear contador si pasó el tiempo de bloqueo
        if (tiempoTranscurrido > this.config.lockoutDuration) {
            this.state.loginAttempts = 0;
        }
        
        // Verificar si está bloqueado
        if (this.state.loginAttempts >= this.config.maxLoginAttempts) {
            const tiempoRestante = Math.ceil((this.config.lockoutDuration - tiempoTranscurrido) / 1000 / 60);
            return {
                permitido: false,
                mensaje: `Demasiados intentos fallidos. Esperá ${tiempoRestante} minutos.`
            };
        }
        
        return { permitido: true, mensaje: null };
    }
    
    registrarIntentoLogin(exitoso) {
        if (exitoso) {
            this.state.loginAttempts = 0;
            this.state.lastLoginAttempt = 0;
        } else {
            this.state.loginAttempts++;
            this.state.lastLoginAttempt = Date.now();
            this.logSecurityEvent('login_failed', `Intentos: ${this.state.loginAttempts}`);
        }
    }
    
    // ===== MONITOREO DE ACTIVIDAD =====
    monitorearActividad() {
        // Monitorear cambios en localStorage/sessionStorage
        const originalSetItem = Storage.prototype.setItem;
        const self = this;
        
        Storage.prototype.setItem = function(key, value) {
            // Verificar si es un cambio sospechoso
            if (key.includes('admin') || key.includes('session')) {
                self.logSecurityEvent('storage_change', { key, value: value.substring(0, 50) });
            }
            originalSetItem.call(this, key, value);
        };
        
        // Monitorear intentos de acceso a DevTools
        let devtools = { open: false };
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                devtools.open = true;
                self.logSecurityEvent('devtools_opened', 'Intento de acceso a DevTools');
            }
        });
        
        setInterval(() => {
            devtools.open = false;
            console.log(element);
            if (devtools.open) {
                self.logSecurityEvent('devtools_opened', 'DevTools abierto');
            }
        }, 1000);
    }
    
    // ===== PROTECCIÓN CONTRA NAVEGACIÓN ATRÁS =====
    protegerNavegacionAtras() {
        // Prevenir que alguien vea datos sensibles al usar "atrás"
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                // Página cargada desde cache
                this.verificarAutenticacion();
            }
        });
        
        // Limpiar cache al salir
        window.addEventListener('beforeunload', () => {
            // No limpiar sesión, solo cache
        });
    }
    
    // ===== LOGGING DE EVENTOS DE SEGURIDAD =====
    logSecurityEvent(tipo, datos) {
        if (!this.config.logSecurityEvents) return;
        
        const evento = {
            tipo: tipo,
            timestamp: new Date().toISOString(),
            datos: datos,
            url: window.location.href,
            userAgent: navigator.userAgent.substring(0, 100)
        };
        
        // Guardar en localStorage (en producción, enviar a servidor)
        try {
            const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
            logs.push(evento);
            
            // Mantener solo los últimos 100 logs
            if (logs.length > 100) {
                logs.shift();
            }
            
            localStorage.setItem('securityLogs', JSON.stringify(logs));
        } catch (error) {
            console.error('Error guardando log de seguridad:', error);
        }
        
        // También loguear en consola (solo en desarrollo)
        if (tipo === 'attack_detected' || tipo === 'rate_limit_exceeded') {
            console.warn('🚨 Evento de seguridad:', evento);
        }
    }
    
    // ===== OBTENER LOGS DE SEGURIDAD =====
    obtenerLogsSeguridad() {
        try {
            return JSON.parse(localStorage.getItem('securityLogs') || '[]');
        } catch (error) {
            return [];
        }
    }
    
    // ===== VALIDAR Y SANITIZAR DATOS ANTES DE ENVIAR =====
    prepararDatosParaEnvio(datos) {
        // Validar con sistema de seguridad
        if (typeof window.seguridadValidacion !== 'undefined') {
            const datosLimpios = window.seguridadValidacion.limpiarObjeto(datos);
            
            // Agregar CSRF token
            if (this.config.enableCSRF) {
                datosLimpios.csrf_token = this.obtenerCSRFToken();
            }
            
            return datosLimpios;
        }
        
        return datos;
    }
}

// Exportar instancia global
if (typeof window !== 'undefined') {
    window.SeguridadPanelesAdmin = SeguridadPanelesAdmin;
    
    // Inicializar automáticamente si estamos en un panel admin
    if (window.location.pathname.includes('panel-') || window.location.pathname.includes('admin-')) {
        window.seguridadAdmin = new SeguridadPanelesAdmin();
    }
}

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SeguridadPanelesAdmin;
}



