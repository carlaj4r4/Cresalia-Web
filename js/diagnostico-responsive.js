// ===== DIAGNÓSTICO RESPONSIVE CRESALIA =====
// Script para verificar que el responsive esté funcionando correctamente

console.log('📱 Iniciando diagnóstico responsive...');

// Función para diagnosticar el estado responsive
function diagnosticarResponsive() {
    // Validar que body exista
    if (!document.body) {
        console.warn('⚠️ document.body no está disponible aún');
        return null;
    }
    
    const containerMain = document.querySelector('.container-main');
    
    const diagnosticos = {
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
        },
        body: {
            width: document.body.offsetWidth || 0,
            height: document.body.offsetHeight || 0,
            padding: window.getComputedStyle(document.body).padding || '0',
            margin: window.getComputedStyle(document.body).margin || '0'
        },
        container: {
            main: containerMain,
            mainWidth: containerMain?.offsetWidth || 0,
            mainMaxWidth: containerMain ? window.getComputedStyle(containerMain).maxWidth : 'N/A'
        },
        responsive: {
            isMobile: window.innerWidth <= 480,
            isTablet: window.innerWidth > 480 && window.innerWidth <= 768,
            isDesktop: window.innerWidth > 768
        }
    };
    
    console.log('📊 DIAGNÓSTICO RESPONSIVE:', diagnosticos);
    
    // Mostrar notificación con el diagnóstico
    const mensaje = `
        📱 RESPONSIVE DIAGNÓSTICO:
        
        🖥️ Pantalla: ${diagnosticos.viewport.width}x${diagnosticos.viewport.height}
        📦 Body: ${diagnosticos.body.width}px ancho
        🏠 Container: ${diagnosticos.container.mainWidth || 'No encontrado'}px
        
        📱 Dispositivo: ${diagnosticos.responsive.isMobile ? 'Móvil' : diagnosticos.responsive.isTablet ? 'Tablet' : 'Desktop'}
        
        ${diagnosticos.viewport.width <= 768 ? '✅ Debería usar layout móvil' : '🖥️ Debería usar layout desktop'}
    `;
    
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion(mensaje, 'info');
    } else {
        alert(mensaje);
    }
    
    return diagnosticos;
}

// Función para forzar recarga sin cache
function forzarRecargaSinCache() {
    console.log('🔄 Forzando recarga sin cache...');
    
    // Limpiar localStorage de cache
    const cacheKeys = Object.keys(localStorage).filter(key => key.includes('cache'));
    cacheKeys.forEach(key => localStorage.removeItem(key));
    
    // Recargar sin cache
    window.location.reload(true);
}

// Función para verificar media queries
function verificarMediaQueries() {
    const mediaQueries = [
        window.matchMedia('(max-width: 768px)'),
        window.matchMedia('(max-width: 480px)'),
        window.matchMedia('(min-width: 769px)')
    ];
    
    const resultados = mediaQueries.map(mq => ({
        query: mq.media,
        matches: mq.matches
    }));
    
    console.log('🎯 MEDIA QUERIES:', resultados);
    
    const activa = resultados.find(r => r.matches);
    if (activa) {
        console.log(`✅ Media query activa: ${activa.query}`);
        // NO llamar mostrarNotificacion aquí para evitar errores cuando body no existe
    }
    
    return resultados;
}

// Función para aplicar estilos de emergencia si no funcionan
function aplicarEstilosEmergencia() {
    console.log('🚨 Aplicando estilos de emergencia...');
    
    const style = document.createElement('style');
    style.id = 'emergencia-responsive';
    style.innerHTML = `
        /* ESTILOS DE EMERGENCIA RESPONSIVE */
        @media (max-width: 768px) {
            body {
                padding: 10px !important;
                margin: 0 !important;
                width: 100vw !important;
                min-width: 100vw !important;
                overflow-x: hidden !important;
            }
            
            .container-main {
                max-width: 100% !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            .header {
                padding: 20px 15px !important;
                margin-bottom: 15px !important;
            }
            
            .card {
                padding: 20px 15px !important;
                margin-bottom: 15px !important;
            }
            
            .grid-2-columns {
                display: block !important;
                gap: 15px !important;
            }
        }
        
        @media (max-width: 480px) {
            body {
                padding: 5px !important;
            }
            
            .header {
                padding: 15px 10px !important;
            }
            
            .card {
                padding: 15px 10px !important;
            }
            
            .btn {
                padding: 6px 10px !important;
                font-size: 0.8rem !important;
                width: 100% !important;
                margin: 3px 0 !important;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('🚨 Estilos de emergencia aplicados', 'warning');
    } else {
        alert('🚨 Estilos de emergencia aplicados');
    }
}

// Hacer funciones globales
window.diagnosticarResponsive = diagnosticarResponsive;
window.forzarRecargaSinCache = forzarRecargaSinCache;
window.verificarMediaQueries = verificarMediaQueries;
window.aplicarEstilosEmergencia = aplicarEstilosEmergencia;

// Auto-diagnóstico al cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Diagnóstico responsive cargado');
    
    // Ejecutar diagnóstico después de un pequeño delay
    setTimeout(() => {
        diagnosticarResponsive();
        verificarMediaQueries();
    }, 1000);
});

console.log('📱 Diagnóstico responsive listo. Usa: diagnosticarResponsive(), verificarMediaQueries(), aplicarEstilosEmergencia()');











