// ===== SISTEMA DE MANTENIMIENTO =====
// Verifica si la plataforma está en mantenimiento y redirige si es necesario

const MANTENIMIENTO_CONFIG = {
    apiEndpoint: '/api/mantenimiento/estado',
    paginaMantenimiento: '/mantenimiento.html',
    verificarCada: 60000, // 1 minuto
    excluirRutas: [
        '/mantenimiento.html',
        '/api/',
        '/assets/',
        '/css/',
        '/js/',
        '/icons/'
    ]
};

// ===== VERIFICAR SI ESTAMOS EN UNA RUTA EXCLUIDA =====
function esRutaExcluida(ruta) {
    return MANTENIMIENTO_CONFIG.excluirRutas.some(excluida => 
        ruta.startsWith(excluida)
    );
}

// ===== VERIFICAR ESTADO DE MANTENIMIENTO =====
async function verificarMantenimiento() {
    // Si estamos en la página de mantenimiento, no verificar
    if (window.location.pathname === MANTENIMIENTO_CONFIG.paginaMantenimiento || 
        window.location.pathname.includes('/mantenimiento.html')) {
        return;
    }
    
    // Si estamos en una ruta excluida, no verificar
    if (esRutaExcluida(window.location.pathname)) {
        return;
    }
    
    try {
        const response = await fetch(MANTENIMIENTO_CONFIG.apiEndpoint);
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.activo) {
                // Mantenimiento activo, redirigir
                console.log('🛠️ Mantenimiento activo, redirigiendo...');
                window.location.href = MANTENIMIENTO_CONFIG.paginaMantenimiento;
            }
        }
    } catch (error) {
        // Si falla la verificación, continuar normalmente
        // No queremos bloquear el sitio si hay un error de red
        console.warn('⚠️ No se pudo verificar el estado de mantenimiento:', error);
    }
}

// ===== INICIALIZAR VERIFICACIÓN =====
function inicializarVerificacionMantenimiento() {
    // Verificar inmediatamente
    verificarMantenimiento();
    
    // Verificar periódicamente
    setInterval(verificarMantenimiento, MANTENIMIENTO_CONFIG.verificarCada);
}

// ===== INICIALIZAR AL CARGAR LA PÁGINA =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarVerificacionMantenimiento);
} else {
    inicializarVerificacionMantenimiento();
}

// Exportar para uso manual si es necesario
window.verificarMantenimiento = verificarMantenimiento;

console.log('✅ Sistema de verificación de mantenimiento cargado');



