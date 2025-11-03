// ===== SISTEMA DE SEGURIDAD REFORZADA - CRESALIA =====
// Capas adicionales de protección para tu SaaS

class SecurityEnhanced {
    constructor() {
        this.maxLoginAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutos
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
        
        this.loginAttempts = this.getLoginAttempts();
        this.lastActivity = Date.now();
        
        this.iniciarMonitoreo();
    }
    
    // ===== PROTECCIÓN CONTRA FUERZA BRUTA =====
    getLoginAttempts() {
        const attempts = localStorage.getItem('login_attempts');
        return attempts ? JSON.parse(attempts) : {};
    }
    
    saveLoginAttempts() {
        localStorage.setItem('login_attempts', JSON.stringify(this.loginAttempts));
    }
    
    verificarBloqueoPorIP() {
        // Simular IP (en producción, obtenerla del servidor)
        const userIP = 'local';
        const attempts = this.loginAttempts[userIP];
        
        if (!attempts) return { bloqueado: false };
        
        const ahora = Date.now();
        const tiempoDesdeUltimoIntento = ahora - attempts.ultimoIntento;
        
        // Si está bloqueado y aún no pasó el tiempo
        if (attempts.bloqueado && tiempoDesdeUltimoIntento < this.lockoutTime) {
            const tiempoRestante = Math.ceil((this.lockoutTime - tiempoDesdeUltimoIntento) / 60000);
            return {
                bloqueado: true,
                mensaje: `Demasiados intentos fallidos. Intenta en ${tiempoRestante} minutos.`
            };
        }
        
        // Si pasó el tiempo, desbloquear
        if (tiempoDesdeUltimoIntento >= this.lockoutTime) {
            this.loginAttempts[userIP] = { intentos: 0, bloqueado: false };
            this.saveLoginAttempts();
        }
        
        return { bloqueado: false };
    }
    
    registrarIntentoFallido() {
        const userIP = 'local';
        
        if (!this.loginAttempts[userIP]) {
            this.loginAttempts[userIP] = { intentos: 0, bloqueado: false };
        }
        
        this.loginAttempts[userIP].intentos++;
        this.loginAttempts[userIP].ultimoIntento = Date.now();
        
        if (this.loginAttempts[userIP].intentos >= this.maxLoginAttempts) {
            this.loginAttempts[userIP].bloqueado = true;
            console.log('🚨 Usuario bloqueado por intentos fallidos');
        }
        
        this.saveLoginAttempts();
        
        return {
            intentosRestantes: this.maxLoginAttempts - this.loginAttempts[userIP].intentos
        };
    }
    
    resetearIntentos() {
        const userIP = 'local';
        this.loginAttempts[userIP] = { intentos: 0, bloqueado: false };
        this.saveLoginAttempts();
    }
    
    // ===== PROTECCIÓN DE SESIÓN =====
    iniciarMonitoreo() {
        // Monitorear actividad del usuario
        const eventos = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        
        eventos.forEach(evento => {
            document.addEventListener(evento, () => {
                this.lastActivity = Date.now();
            }, { passive: true });
        });
        
        // Verificar sesión cada minuto
        setInterval(() => {
            this.verificarSesionActiva();
        }, 60000);
    }
    
    verificarSesionActiva() {
        const tiempoInactivo = Date.now() - this.lastActivity;
        
        if (tiempoInactivo >= this.sessionTimeout) {
            console.log('⏰ Sesión expirada por inactividad');
            this.cerrarSesionPorInactividad();
        }
    }
    
    async cerrarSesionPorInactividad() {
        await logoutCliente();
        alert('Tu sesión ha expirado por inactividad. Por favor inicia sesión nuevamente.');
        window.location.href = 'login-tienda.html';
    }
    
    // ===== ENCRIPTACIÓN DE DATOS SENSIBLES =====
    encriptarDatos(datos, clave) {
        // Encriptación simple con XOR (en producción usar AES)
        const datosStr = JSON.stringify(datos);
        let resultado = '';
        
        for (let i = 0; i < datosStr.length; i++) {
            resultado += String.fromCharCode(datosStr.charCodeAt(i) ^ clave.charCodeAt(i % clave.length));
        }
        
        return btoa(resultado); // Base64
    }
    
    desencriptarDatos(datosEncriptados, clave) {
        try {
            const decoded = atob(datosEncriptados);
            let resultado = '';
            
            for (let i = 0; i < decoded.length; i++) {
                resultado += String.fromCharCode(decoded.charCodeAt(i) ^ clave.charCodeAt(i % clave.length));
            }
            
            return JSON.parse(resultado);
        } catch (error) {
            console.error('Error desencriptando datos:', error);
            return null;
        }
    }
    
    // ===== VALIDACIÓN DE ENTRADA =====
    sanitizarInput(input) {
        // Eliminar caracteres potencialmente peligrosos
        return input
            .replace(/[<>]/g, '') // Prevenir XSS
            .replace(/[;'"]/g, '') // Prevenir SQL injection
            .trim();
    }
    
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    validarPassword(password) {
        // Requisitos mínimos
        const requisitos = {
            minLength: password.length >= 8,
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const cumplidos = Object.values(requisitos).filter(Boolean).length;
        
        return {
            valido: requisitos.minLength && cumplidos >= 3,
            fortaleza: cumplidos <= 2 ? 'débil' : cumplidos === 3 ? 'media' : 'fuerte',
            requisitos: requisitos
        };
    }
    
    // ===== DETECCIÓN DE ACTIVIDAD SOSPECHOSA =====
    registrarEvento(tipo, detalles) {
        const eventos = JSON.parse(localStorage.getItem('security_events') || '[]');
        
        const evento = {
            tipo: tipo,
            timestamp: new Date().toISOString(),
            detalles: detalles,
            userAgent: navigator.userAgent
        };
        
        eventos.push(evento);
        
        // Mantener solo los últimos 100 eventos
        if (eventos.length > 100) {
            eventos.shift();
        }
        
        localStorage.setItem('security_events', JSON.stringify(eventos));
        
        // Analizar si hay actividad sospechosa
        this.analizarActividadSospechosa(eventos);
    }
    
    analizarActividadSospechosa(eventos) {
        const eventosRecientes = eventos.filter(e => {
            const hace5min = Date.now() - (5 * 60 * 1000);
            return new Date(e.timestamp).getTime() > hace5min;
        });
        
        // Si hay más de 20 eventos en 5 minutos
        if (eventosRecientes.length > 20) {
            console.warn('⚠️ Actividad sospechosa detectada');
            this.registrarEvento('actividad_sospechosa', {
                eventos_5min: eventosRecientes.length
            });
        }
    }
    
    // ===== VERIFICACIÓN DE INTEGRIDAD =====
    verificarIntegridadDatos() {
        console.log('🔍 Verificando integridad de datos...');
        
        const checksums = {
            configuracion: this.calcularChecksum(localStorage.getItem('configuracion_tienda')),
            productos: this.calcularChecksum(localStorage.getItem('productos_techstore')),
            ofertas: this.calcularChecksum(localStorage.getItem('ofertas_techstore'))
        };
        
        // Guardar checksums
        localStorage.setItem('data_checksums', JSON.stringify(checksums));
        
        return checksums;
    }
    
    calcularChecksum(data) {
        if (!data) return null;
        
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    }
}

// Inicializar sistema de seguridad
const securityEnhanced = new SecurityEnhanced();

// Funciones globales
function crearBackupSeguro() {
    return backupSystem.crearBackupCompleto();
}

function verificarSeguridadLogin(email, password) {
    // 1. Verificar bloqueo
    const bloqueo = securityEnhanced.verificarBloqueoPorIP();
    if (bloqueo.bloqueado) {
        return { permitido: false, mensaje: bloqueo.mensaje };
    }
    
    // 2. Validar email
    if (!securityEnhanced.validarEmail(email)) {
        return { permitido: false, mensaje: 'Email inválido' };
    }
    
    // 3. Sanitizar inputs
    email = securityEnhanced.sanitizarInput(email);
    
    return { permitido: true, email: email };
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecurityEnhanced, securityEnhanced };
}




















