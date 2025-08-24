// ===== SISTEMA DE SEGURIDAD FRIOCAS =====
// Versión: 1.2
// Autor: Sistema de Seguridad FRIOCAS
// Fecha: 2024

// Configuración de seguridad
const SECURITY_CONFIG = {
    // Acceso oculto al panel de administración
    adminHotkey: 'Ctrl+Alt+A',
    
    // Configuración de sesiones
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    maxLoginAttempts: 3,
    lockoutDuration: 15 * 60 * 1000, // 15 minutos
    
    // Configuración de tokens
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 horas
    
    // Configuración de auditoría
    logSecurityEvents: true,
    
    // Configuración de protección
    enableRateLimiting: true,
    maxRequestsPerMinute: 60,
    
    // Configuración de Carla
    carlaAccessCode: 'FRIOCAS2024CARLA',
    carlaHotkey: 'Ctrl+Alt+C'
};

// Variables de seguridad
let securityState = {
    isAuthenticated: false,
    currentUser: null,
    loginAttempts: 0,
    lastLoginAttempt: 0,
    sessionStartTime: null,
    securityToken: null,
    requestCount: 0,
    lastRequestTime: Date.now(),
    securityLog: []
};

// ===== FUNCIONES DE AUTENTICACIÓN =====

// Función para verificar credenciales de administrador
function verifyAdminCredentials(username, password) {
    // Credenciales seguras (en producción usar hash + salt)
    const validCredentials = {
        'admin': 'FRIOCAS2024ADMIN',
        'carla': 'FRIOCAS2024CARLA',
        'soporte': 'FRIOCAS2024SOPORTE'
    };
    
    return validCredentials[username] === password;
}

// Función para generar token de seguridad
function generateSecurityToken() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const userAgent = navigator.userAgent;
    
    // Crear token único
    const tokenData = `${timestamp}-${random}-${userAgent}`;
    const token = btoa(tokenData).replace(/[^a-zA-Z0-9]/g, '');
    
    return token;
}

// Función para validar token
function validateSecurityToken(token) {
    if (!token || !securityState.securityToken) {
        return false;
    }
    
    return token === securityState.securityToken;
}

// Función para iniciar sesión segura
function secureLogin(username, password) {
    console.log('🔐 Intentando login con:', { username, password: password ? '***' : 'undefined' });
    
    // Verificar si está bloqueado
    if (isAccountLocked()) {
        console.log('🔒 Cuenta bloqueada, intentos:', securityState.loginAttempts);
        logSecurityEvent('LOGIN_BLOCKED', `Cuenta bloqueada por múltiples intentos fallidos`);
        return { success: false, message: 'Cuenta temporalmente bloqueada. Intente en 15 minutos.' };
    }
    
    // Verificar credenciales
    const isValid = verifyAdminCredentials(username, password);
    console.log('🔍 Verificación de credenciales:', { username, isValid });
    
    if (!isValid) {
        securityState.loginAttempts++;
        securityState.lastLoginAttempt = Date.now();
        
        console.log('❌ Login fallido, intentos:', securityState.loginAttempts);
        logSecurityEvent('LOGIN_FAILED', `Intento fallido para usuario: ${username}`);
        
        if (securityState.loginAttempts >= SECURITY_CONFIG.maxLoginAttempts) {
            logSecurityEvent('ACCOUNT_LOCKED', `Cuenta bloqueada para usuario: ${username}`);
        }
        
        return { success: false, message: 'Credenciales incorrectas' };
    }
    
    // Login exitoso
    securityState.isAuthenticated = true;
    securityState.currentUser = username;
    securityState.sessionStartTime = Date.now();
    securityState.securityToken = generateSecurityToken();
    securityState.loginAttempts = 0;
    
    // Guardar en localStorage de forma segura
    const sessionData = {
        user: username,
        token: securityState.securityToken,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
    };
    
    localStorage.setItem('friocas_session', btoa(JSON.stringify(sessionData)));
    
    logSecurityEvent('LOGIN_SUCCESS', `Sesión iniciada para usuario: ${username}`);
    
    return { success: true, message: 'Sesión iniciada correctamente' };
}

// Función para cerrar sesión segura
function secureLogout() {
    const user = securityState.currentUser;
    
    securityState.isAuthenticated = false;
    securityState.currentUser = null;
    securityState.sessionStartTime = null;
    securityState.securityToken = null;
    
    // Limpiar localStorage
    localStorage.removeItem('friocas_session');
    
    logSecurityEvent('LOGOUT', `Sesión cerrada para usuario: ${user}`);
    
    // Redirigir a página principal
    window.location.href = 'index-friocas-productos.html';
}

// ===== FUNCIONES DE PROTECCIÓN =====

// Función para verificar si la cuenta está bloqueada
function isAccountLocked() {
    if (securityState.loginAttempts >= SECURITY_CONFIG.maxLoginAttempts) {
        const timeSinceLastAttempt = Date.now() - securityState.lastLoginAttempt;
        return timeSinceLastAttempt < SECURITY_CONFIG.lockoutDuration;
    }
    return false;
}

// Función para verificar sesión activa
function checkActiveSession() {
    const sessionData = localStorage.getItem('friocas_session');
    
    if (!sessionData) {
        return false;
    }
    
    try {
        const session = JSON.parse(atob(sessionData));
        const currentTime = Date.now();
        
        // Verificar expiración
        if (currentTime - session.timestamp > SECURITY_CONFIG.tokenExpiry) {
            localStorage.removeItem('friocas_session');
            return false;
        }
        
        // Verificar user agent
        if (session.userAgent !== navigator.userAgent) {
            logSecurityEvent('SESSION_HIJACK_ATTEMPT', 'User agent no coincide');
            localStorage.removeItem('friocas_session');
            return false;
        }
        
        // Restaurar sesión
        securityState.isAuthenticated = true;
        securityState.currentUser = session.user;
        securityState.securityToken = session.token;
        securityState.sessionStartTime = session.timestamp;
        
        return true;
    } catch (error) {
        logSecurityEvent('SESSION_ERROR', 'Error al verificar sesión');
        localStorage.removeItem('friocas_session');
        return false;
    }
}

// Función para verificar timeout de sesión
function checkSessionTimeout() {
    if (!securityState.sessionStartTime) {
        return false;
    }
    
    const currentTime = Date.now();
    const sessionAge = currentTime - securityState.sessionStartTime;
    
    if (sessionAge > SECURITY_CONFIG.sessionTimeout) {
        logSecurityEvent('SESSION_TIMEOUT', 'Sesión expirada por inactividad');
        secureLogout();
        return true;
    }
    
    return false;
}

// Función para rate limiting
function checkRateLimit() {
    if (!SECURITY_CONFIG.enableRateLimiting) {
        return true;
    }
    
    const currentTime = Date.now();
    const timeWindow = 60 * 1000; // 1 minuto
    
    if (currentTime - securityState.lastRequestTime > timeWindow) {
        securityState.requestCount = 1;
        securityState.lastRequestTime = currentTime;
        return true;
    }
    
    securityState.requestCount++;
    
    if (securityState.requestCount > SECURITY_CONFIG.maxRequestsPerMinute) {
        logSecurityEvent('RATE_LIMIT_EXCEEDED', 'Demasiadas solicitudes');
        return false;
    }
    
    return true;
}

// ===== FUNCIONES DE AUDITORÍA =====

// Función para registrar eventos de seguridad
function logSecurityEvent(eventType, details) {
    if (!SECURITY_CONFIG.logSecurityEvents) {
        return;
    }
    
    const event = {
        timestamp: new Date().toISOString(),
        eventType: eventType,
        details: details,
        user: securityState.currentUser || 'anonymous',
        ip: 'client-side',
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    securityState.securityLog.push(event);
    
    // Mantener solo los últimos 100 eventos
    if (securityState.securityLog.length > 100) {
        securityState.securityLog.shift();
    }
    
    // Guardar en localStorage
    localStorage.setItem('friocas_security_log', JSON.stringify(securityState.securityLog));
    
    console.log(`🔒 [SECURITY] ${eventType}: ${details}`);
}

// Función para obtener log de seguridad
function getSecurityLog() {
    return securityState.securityLog;
}

// Función para limpiar estado de bloqueo (para debugging)
function clearSecurityLockout() {
    securityState.loginAttempts = 0;
    securityState.lastLoginAttempt = 0;
    console.log('🔓 Estado de bloqueo limpiado');
    logSecurityEvent('LOCKOUT_CLEARED', 'Estado de bloqueo limpiado manualmente');
}

// ===== FUNCIONES DE PROTECCIÓN DE PÁGINAS =====

// Función para proteger página de administración
function protectAdminPage() {
    if (!checkActiveSession()) {
        window.location.href = 'index-friocas-productos.html';
        return false;
    }
    
    if (checkSessionTimeout()) {
        return false;
    }
    
    if (!checkRateLimit()) {
        alert('Demasiadas solicitudes. Intente más tarde.');
        return false;
    }
    
    return true;
}

// Función para proteger página de soporte de Carla
function protectCarlaPage() {
    const accessCode = prompt('Ingrese el código de acceso para soporte:');
    
    if (accessCode !== SECURITY_CONFIG.carlaAccessCode) {
        logSecurityEvent('CARLA_ACCESS_DENIED', 'Código de acceso incorrecto');
        alert('Código de acceso incorrecto');
        window.location.href = 'index-friocas-productos.html';
        return false;
    }
    
    logSecurityEvent('CARLA_ACCESS_GRANTED', 'Acceso concedido a soporte');
    return true;
}

// ===== FUNCIONES DE ACCESO OCULTO =====

// Función para configurar hotkeys
function setupSecurityHotkeys() {
    document.addEventListener('keydown', function(event) {
        // Acceso oculto al panel de administración (Ctrl + Alt + A)
        if (event.ctrlKey && event.altKey && event.key === 'A') {
            event.preventDefault();
            console.log('🔐 Hotkey Ctrl+Alt+A detectado - Abriendo modal de administración');
            showAdminAccessModal();
        }
        
        // Acceso oculto al soporte de Carla (Ctrl + Alt + C)
        if (event.ctrlKey && event.altKey && event.key === 'C') {
            event.preventDefault();
            console.log('🎧 Hotkey Ctrl+Alt+C detectado - Abriendo modal de soporte');
            showCarlaAccessModal();
        }
    });
    
    console.log('🔒 Hotkeys de seguridad configurados');
}

// Función para mostrar modal de acceso administrativo
function showAdminAccessModal() {
    console.log('🔐 Creando modal de acceso administrativo...');
    const modal = document.createElement('div');
    modal.className = 'security-modal';
    modal.innerHTML = `
        <div class="security-modal-content">
            <div class="security-modal-header">
                <h3>🔒 Acceso Administrativo</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="security-close-btn">&times;</button>
            </div>
            <div class="security-modal-body">
                <form id="adminLoginForm" onsubmit="handleAdminLogin(event)">
                    <div class="security-input-group">
                        <label for="adminUsername">Usuario:</label>
                        <input type="text" id="adminUsername" required>
                    </div>
                    <div class="security-input-group">
                        <label for="adminPassword">Contraseña:</label>
                        <input type="password" id="adminPassword" required>
                    </div>
                    <button type="submit" class="security-btn">Acceder</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('🔐 Modal de administración agregado al DOM');
    
    // Agregar estilos
    const style = document.createElement('style');
    style.textContent = `
        .security-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .security-modal-content {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .security-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        .security-close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        .security-input-group {
            margin-bottom: 1rem;
        }
        .security-input-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }
        .security-input-group input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
        }
        .security-btn {
            width: 100%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

// Función para manejar login administrativo
function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    const result = secureLogin(username, password);
    
    if (result.success) {
        alert('Acceso concedido');
        window.location.href = 'admin-friocas.html';
    } else {
        alert(result.message);
    }
}

// Función para mostrar modal de acceso de Carla
function showCarlaAccessModal() {
    const modal = document.createElement('div');
    modal.className = 'security-modal';
    modal.innerHTML = `
        <div class="security-modal-content">
            <div class="security-modal-header">
                <h3>🎧 Soporte de Carla</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="security-close-btn">&times;</button>
            </div>
            <div class="security-modal-body">
                <p>Ingrese el código de acceso para el soporte:</p>
                <form id="carlaAccessForm" onsubmit="handleCarlaAccess(event)">
                    <div class="security-input-group">
                        <input type="password" id="carlaAccessCode" placeholder="Código de acceso" required>
                    </div>
                    <button type="submit" class="security-btn">Acceder al Soporte</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Función para manejar acceso de Carla
function handleCarlaAccess(event) {
    event.preventDefault();
    
    const accessCode = document.getElementById('carlaAccessCode').value;
    
    if (accessCode === SECURITY_CONFIG.carlaAccessCode) {
        logSecurityEvent('CARLA_ACCESS_GRANTED', 'Acceso concedido a soporte');
        alert('Acceso concedido al soporte');
        window.location.href = 'soporte-carla.html';
    } else {
        logSecurityEvent('CARLA_ACCESS_DENIED', 'Código de acceso incorrecto');
        alert('Código de acceso incorrecto');
    }
}

// ===== FUNCIONES DE PROTECCIÓN CONTRA ATAQUES =====

// Función para detectar herramientas de desarrollador
function detectDevTools() {
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                logSecurityEvent('DEVTOOLS_OPENED', 'Herramientas de desarrollador detectadas');
                alert('⚠️ Advertencia de seguridad: Herramientas de desarrollador detectadas');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
}

// Función para proteger contra inspección de código
function protectCodeInspection() {
    // Deshabilitar clic derecho
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        logSecurityEvent('RIGHT_CLICK_BLOCKED', 'Clic derecho bloqueado');
    });
    
    // Deshabilitar teclas de inspección
    document.addEventListener('keydown', function(event) {
        // F12
        if (event.key === 'F12') {
            event.preventDefault();
            logSecurityEvent('F12_BLOCKED', 'Tecla F12 bloqueada');
        }
        
        // Ctrl+Shift+I
        if (event.ctrlKey && event.shiftKey && event.key === 'I') {
            event.preventDefault();
            logSecurityEvent('CTRL_SHIFT_I_BLOCKED', 'Ctrl+Shift+I bloqueado');
        }
        
        // Ctrl+Shift+C
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
            event.preventDefault();
            logSecurityEvent('CTRL_SHIFT_C_BLOCKED', 'Ctrl+Shift+C bloqueado');
        }
        
        // Ctrl+U
        if (event.ctrlKey && event.key === 'u') {
            event.preventDefault();
            logSecurityEvent('CTRL_U_BLOCKED', 'Ctrl+U bloqueado');
        }
    });
}

// ===== INICIALIZACIÓN DEL SISTEMA =====

// Función para inicializar sistema de seguridad
function initializeSecuritySystem() {
    console.log('🔒 Inicializando sistema de seguridad FRIOCAS...');
    
    // Configurar hotkeys
    setupSecurityHotkeys();
    
    // Proteger contra inspección
    protectCodeInspection();
    
    // Detectar herramientas de desarrollador
    detectDevTools();
    
    // Verificar sesión existente
    checkActiveSession();
    
    // Configurar timeout de sesión
    setInterval(checkSessionTimeout, 60000); // Verificar cada minuto
    
    logSecurityEvent('SYSTEM_INITIALIZED', 'Sistema de seguridad inicializado');
    
    console.log('✅ Sistema de seguridad FRIOCAS inicializado');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSecuritySystem);
} else {
    initializeSecuritySystem();
}

// ===== FUNCIONES DE PROTECCIÓN DE PÁGINAS =====

// Función para proteger página de administración
function protectAdminPage() {
    console.log('🔒 Verificando acceso al panel de administración...');
    
    // Verificar si hay una sesión activa
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
        try {
            const sessionData = JSON.parse(adminSession);
            const now = Date.now();
            
            if (now - sessionData.timestamp < SECURITY_CONFIG.sessionTimeout) {
                console.log('✅ Sesión de administrador válida');
                logSecurityEvent('ADMIN_ACCESS_GRANTED', 'Acceso concedido al panel de administración');
                return true;
            } else {
                console.log('⏰ Sesión de administrador expirada');
                localStorage.removeItem('adminSession');
                logSecurityEvent('ADMIN_SESSION_EXPIRED', 'Sesión de administrador expirada');
            }
        } catch (error) {
            console.error('❌ Error verificando sesión de administrador:', error);
            localStorage.removeItem('adminSession');
        }
    }
    
    console.log('🔐 No hay sesión de administrador válida');
    logSecurityEvent('ADMIN_ACCESS_DENIED', 'Acceso denegado al panel de administración');
    return false;
}

// Función para proteger página de Carla
function protectCarlaPage() {
    console.log('🔒 Verificando acceso al sistema de Carla...');
    
    // Verificar si hay una sesión activa de Carla
    const carlaSession = localStorage.getItem('carlaSession');
    if (carlaSession) {
        try {
            const sessionData = JSON.parse(carlaSession);
            const now = Date.now();
            
            if (now - sessionData.timestamp < SECURITY_CONFIG.sessionTimeout) {
                console.log('✅ Sesión de Carla válida');
                logSecurityEvent('CARLA_ACCESS_GRANTED', 'Acceso concedido al sistema de Carla');
                return true;
            } else {
                console.log('⏰ Sesión de Carla expirada');
                localStorage.removeItem('carlaSession');
                logSecurityEvent('CARLA_SESSION_EXPIRED', 'Sesión de Carla expirada');
            }
        } catch (error) {
            console.error('❌ Error verificando sesión de Carla:', error);
            localStorage.removeItem('carlaSession');
        }
    }
    
    console.log('🔐 No hay sesión de Carla válida');
    logSecurityEvent('CARLA_ACCESS_DENIED', 'Acceso denegado al sistema de Carla');
    return false;
}

// ===== EXPORTAR FUNCIONES GLOBALES =====

// Hacer funciones disponibles globalmente
window.FRIOCAS_SECURITY = {
    secureLogin,
    secureLogout,
    protectAdminPage,
    protectCarlaPage,
    getSecurityLog,
    checkActiveSession,
    isAccountLocked,
    logSecurityEvent,
    clearSecurityLockout
};
