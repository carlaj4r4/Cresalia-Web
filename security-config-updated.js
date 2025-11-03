// ===== CONFIGURACIÓN DE SEGURIDAD ACTUALIZADA - CRESALIA =====
// Solo el super admin (tú) tiene accesos secretos

const SECURITY_CONFIG = {
    // ==================== SUPER ADMIN (SOLO TÚ) ====================
    superAdminHotkey: {
        keys: ['Control', 'Alt', 'Shift', 'S'],  // Ctrl + Alt + Shift + S
        action: 'openSuperAdmin'
    },
    superAdminCode: 'CRESALIA_MASTER_2025',
    
    // ==================== ACCESOS NORMALES ====================
    // Los clientes admins NO tienen accesos secretos
    // Deben usar las URLs normales:
    // - cresalia.com/admin (para admins de tienda)
    // - cresalia.com/super-admin (solo tú)
    
    tenantAdminUrl: '/admin',           // URL pública para admins de tienda
    superAdminUrl: '/super-admin',      // URL secreta solo para ti
    
    // ==================== PROTECCIÓN ====================
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000,    // 15 minutos
    sessionTimeout: 30 * 60 * 1000,     // 30 minutos
    
    // ==================== LOGGING ====================
    enableSecurityLogs: true,
    logFile: 'security.log'
};

// ===== FUNCIÓN PARA DETECTAR SUPER ADMIN HOTKEY =====
function setupSuperAdminAccess() {
    const keysPressed = new Set();
    
    document.addEventListener('keydown', (e) => {
        keysPressed.add(e.key);
        
        // Verificar si se presionó la combinación correcta
        const requiredKeys = SECURITY_CONFIG.superAdminHotkey.keys;
        const allKeysPressed = requiredKeys.every(key => {
            // Normalizar nombres de teclas
            if (key === 'Control') return e.ctrlKey;
            if (key === 'Alt') return e.altKey;
            if (key === 'Shift') return e.shiftKey;
            return keysPressed.has(key);
        });
        
        if (allKeysPressed) {
            e.preventDefault();
            console.log('🔐 Super Admin hotkey detectado');
            showSuperAdminAccess();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keysPressed.delete(e.key);
    });
}

// ===== MOSTRAR MODAL DE ACCESO SUPER ADMIN =====
function showSuperAdminAccess() {
    // Verificar si ya existe el modal
    if (document.getElementById('super-admin-access-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'super-admin-access-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content super-admin-modal">
            <div class="modal-header">
                <h2>🔐 Acceso Super Administrador</h2>
                <p>Solo el dueño de Cresalia tiene acceso</p>
            </div>
            
            <form id="super-admin-form" class="super-admin-form">
                <div class="input-group">
                    <i class="fas fa-key"></i>
                    <input 
                        type="password" 
                        id="super-admin-code" 
                        class="input-cresalia"
                        placeholder="Código Maestro"
                        required
                        autofocus
                    >
                </div>
                
                <div class="button-group">
                    <button type="submit" class="btn-cresalia btn-primary">
                        <i class="fas fa-unlock"></i>
                        Acceder
                    </button>
                    <button type="button" class="btn-cresalia btn-ghost" onclick="closeSuperAdminModal()">
                        Cancelar
                    </button>
                </div>
            </form>
            
            <div class="modal-footer">
                <p class="warning-text">
                    <i class="fas fa-shield-alt"></i>
                    Este acceso está protegido y monitoreado
                </p>
            </div>
        </div>
        
        <style>
            .super-admin-modal {
                max-width: 450px;
                padding: 40px;
                text-align: center;
            }
            
            .super-admin-modal .modal-header h2 {
                background: var(--gradient-primary);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 8px;
            }
            
            .super-admin-modal .modal-header p {
                color: var(--cresalia-gray);
                font-size: 14px;
                margin-bottom: 32px;
            }
            
            .super-admin-form {
                margin-bottom: 24px;
            }
            
            .button-group {
                display: flex;
                gap: 12px;
                margin-top: 24px;
            }
            
            .button-group .btn-cresalia {
                flex: 1;
            }
            
            .warning-text {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                color: var(--cresalia-gray);
                font-size: 12px;
                padding: 12px;
                background: rgba(124, 58, 237, 0.05);
                border-radius: var(--radius-md);
            }
            
            .warning-text i {
                color: var(--cresalia-accent);
            }
        </style>
    `;
    
    document.body.appendChild(modal);
    
    // Evento de submit
    document.getElementById('super-admin-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleSuperAdminAccess();
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeSuperAdminModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// ===== MANEJAR ACCESO SUPER ADMIN =====
function handleSuperAdminAccess() {
    const code = document.getElementById('super-admin-code').value;
    
    if (code === SECURITY_CONFIG.superAdminCode) {
        // Acceso concedido
        logSecurityEvent('SUPER_ADMIN_ACCESS_GRANTED', 'Acceso super admin exitoso');
        
        // Guardar sesión
        sessionStorage.setItem('cresalia_super_admin', 'true');
        sessionStorage.setItem('cresalia_super_admin_time', Date.now());
        
        // Redirigir a super admin panel
        window.location.href = SECURITY_CONFIG.superAdminUrl;
    } else {
        // Acceso denegado
        logSecurityEvent('SUPER_ADMIN_ACCESS_DENIED', 'Código incorrecto');
        
        const input = document.getElementById('super-admin-code');
        input.value = '';
        input.classList.add('error-shake');
        
        // Mostrar error
        showError('Código incorrecto. Este intento ha sido registrado.');
        
        setTimeout(() => {
            input.classList.remove('error-shake');
        }, 500);
    }
}

// ===== CERRAR MODAL =====
function closeSuperAdminModal() {
    const modal = document.getElementById('super-admin-access-modal');
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => modal.remove(), 300);
    }
}

// ===== VERIFICAR SESIÓN SUPER ADMIN =====
function isSuperAdminAuthenticated() {
    const isAuth = sessionStorage.getItem('cresalia_super_admin');
    const authTime = parseInt(sessionStorage.getItem('cresalia_super_admin_time'));
    
    if (!isAuth || !authTime) return false;
    
    // Verificar si la sesión expiró
    const now = Date.now();
    const elapsed = now - authTime;
    
    if (elapsed > SECURITY_CONFIG.sessionTimeout) {
        // Sesión expirada
        sessionStorage.removeItem('cresalia_super_admin');
        sessionStorage.removeItem('cresalia_super_admin_time');
        return false;
    }
    
    return true;
}

// ===== PROTEGER PÁGINA SUPER ADMIN =====
function protectSuperAdminPage() {
    // Solo ejecutar en páginas de super admin
    if (!window.location.pathname.includes('super-admin')) return;
    
    if (!isSuperAdminAuthenticated()) {
        // Redirigir al home
        alert('⛔ Acceso denegado. Debes ser super administrador.');
        logSecurityEvent('SUPER_ADMIN_PAGE_ACCESS_DENIED', 'Intento de acceso sin autenticación');
        window.location.href = '/';
    }
}

// ===== LOGGING DE SEGURIDAD =====
function logSecurityEvent(event, details) {
    if (!SECURITY_CONFIG.enableSecurityLogs) return;
    
    const log = {
        timestamp: new Date().toISOString(),
        event: event,
        details: details,
        ip: 'unknown', // En producción, obtener IP real
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    console.log('🔒 Security Event:', log);
    
    // En producción, enviar al backend
    // fetch('/api/security-logs', {
    //     method: 'POST',
    //     body: JSON.stringify(log)
    // });
}

// ===== MOSTRAR ERROR =====
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.add('fade-out');
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Sistema de seguridad Cresalia cargado');
    console.log('ℹ️ Los accesos secretos están deshabilitados para clientes');
    console.log('ℹ️ Solo el super admin tiene hotkey: Ctrl + Alt + Shift + S');
    
    // Setup super admin hotkey
    setupSuperAdminAccess();
    
    // Proteger páginas super admin
    protectSuperAdminPage();
});

// ===== CSS ADICIONAL =====
const securityStyles = `
<style>
    .error-shake {
        animation: shake 0.5s;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #EF4444, #F87171);
        color: white;
        padding: 16px 24px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    }
    
    .error-notification i {
        font-size: 20px;
    }
    
    .fade-out {
        animation: fadeOut 0.3s ease forwards;
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
</style>
`;

// Insertar estilos
document.head.insertAdjacentHTML('beforeend', securityStyles);

// Exportar funciones principales
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SECURITY_CONFIG,
        isSuperAdminAuthenticated,
        protectSuperAdminPage,
        logSecurityEvent
    };
}


