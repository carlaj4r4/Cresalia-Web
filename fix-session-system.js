// ===== SCRIPT DE MIGRACIÓN DE SESIONES - CRESALIA =====
// Este script migra del sistema de sesiones duplicado al sistema unificado

console.log('🔄 Iniciando migración del sistema de sesiones...');

// Función para migrar sesión existente
function migrarSesionAdmin() {
    const adminSession = localStorage.getItem('adminSession');
    const cresaliaSession = localStorage.getItem('cresalia_session');
    
    if (adminSession && !cresaliaSession) {
        try {
            const sessionData = JSON.parse(adminSession);
            console.log('📦 Migrando sesión de adminSession a cresalia_session');
            
            // Crear sesión unificada
            const unifiedSession = {
                user: {
                    id: 1,
                    nombre: sessionData.user || 'Administrador Cresalia',
                    email: 'admin@cresalia.com',
                    rol: 'admin'
                },
                token: 'admin-token-' + Date.now(),
                timestamp: sessionData.timestamp || Date.now(),
                userAgent: navigator.userAgent
            };
            
            // Guardar sesión unificada
            localStorage.setItem('cresalia_session', btoa(JSON.stringify(unifiedSession)));
            
            // Limpiar sesión antigua
            localStorage.removeItem('adminSession');
            
            console.log('✅ Sesión migrada exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error migrando sesión:', error);
            return false;
        }
    }
    
    return false;
}

// Función para verificar sesión unificada
function verificarSesionUnificada() {
    const sessionData = localStorage.getItem('cresalia_session');
    
    if (sessionData) {
        try {
            const session = JSON.parse(atob(sessionData));
            const now = Date.now();
            const sessionAge = now - session.timestamp;
            const sessionTimeout = 30 * 60 * 1000; // 30 minutos
            
            console.log('🔍 Verificación de sesión unificada:');
            console.log('   - Edad de sesión:', Math.round(sessionAge / 1000 / 60), 'minutos');
            console.log('   - Timeout:', Math.round(sessionTimeout / 1000 / 60), 'minutos');
            console.log('   - Usuario:', session.user?.nombre || 'Unknown');
            
            if (sessionAge < sessionTimeout) {
                console.log('✅ Sesión válida');
                return true;
            } else {
                console.log('⏰ Sesión expirada');
                localStorage.removeItem('cresalia_session');
                return false;
            }
        } catch (error) {
            console.error('❌ Error verificando sesión:', error);
            localStorage.removeItem('friocas_session');
            return false;
        }
    }
    
    console.log('🔐 No hay sesión');
    return false;
}

// Función para crear sesión de administrador
function crearSesionAdmin() {
    const sessionData = {
        user: {
            id: 1,
            nombre: 'Administrador Cresalia',
            email: 'admin@cresalia.com',
            rol: 'admin'
        },
        token: 'admin-token-' + Date.now(),
        timestamp: Date.now(),
        userAgent: navigator.userAgent
    };
    
    localStorage.setItem('cresalia_session', btoa(JSON.stringify(sessionData)));
    console.log('✅ Sesión de administrador creada');
    return true;
}

// Función para cerrar sesión unificada
function cerrarSesionUnificada() {
    localStorage.removeItem('cresalia_session');
    localStorage.removeItem('adminSession'); // Limpiar también la antigua por si acaso
    console.log('🚪 Sesión cerrada');
}

// Ejecutar migración al cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando sistema de sesiones unificado...');
    
    // Migrar sesión existente si es necesario
    migrarSesionAdmin();
    
    // Verificar estado actual
    verificarSesionUnificada();
});

// Exportar funciones para uso global
window.migrarSesionAdmin = migrarSesionAdmin;
window.verificarSesionUnificada = verificarSesionUnificada;
window.crearSesionAdmin = crearSesionAdmin;
window.cerrarSesionUnificada = cerrarSesionUnificada;
