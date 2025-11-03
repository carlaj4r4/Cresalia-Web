// ===== SISTEMA DE NOTIFICACIONES COMPACTAS =====
// Notificaciones más pequeñas y de menor duración

// Configuración de notificaciones compactas
const NOTIFICACIONES_CONFIG = {
    duracion: 3000, // 3 segundos (más corto)
    posicion: 'top-right',
    maxWidth: '300px',
    fontSize: '13px',
    padding: '12px 16px',
    borderRadius: '8px',
    zIndex: 9999
};

// Función para mostrar notificación compacta
function mostrarNotificacionCompacta(mensaje, tipo = 'info') {
    // Remover notificaciones existentes
    const notificacionesExistentes = document.querySelectorAll('.notificacion-compacta');
    notificacionesExistentes.forEach(notif => notif.remove());
    
    // Crear contenedor si no existe
    let contenedor = document.getElementById('notificaciones-container');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'notificaciones-container';
        contenedor.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: ${NOTIFICACIONES_CONFIG.zIndex};
            pointer-events: none;
        `;
        document.body.appendChild(contenedor);
    }
    
    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-compacta';
    
    // Configurar colores según tipo
    let colores = {
        success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb', icon: '✅' },
        error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb', icon: '❌' },
        warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7', icon: '⚠️' },
        info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb', icon: 'ℹ️' }
    };
    
    const configColor = colores[tipo] || colores.info;
    
    notificacion.style.cssText = `
        background: ${configColor.bg};
        color: ${configColor.color};
        border: 1px solid ${configColor.border};
        padding: ${NOTIFICACIONES_CONFIG.padding};
        border-radius: ${NOTIFICACIONES_CONFIG.borderRadius};
        font-size: ${NOTIFICACIONES_CONFIG.fontSize};
        max-width: ${NOTIFICACIONES_CONFIG.maxWidth};
        margin-bottom: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        animation: slideInCompact 0.3s ease-out;
        pointer-events: auto;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 500;
        line-height: 1.4;
    `;
    
    notificacion.innerHTML = `
        <span style="font-size: 16px;">${configColor.icon}</span>
        <span style="flex: 1;">${mensaje}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: ${configColor.color}; font-size: 18px; cursor: pointer; padding: 0; margin-left: 8px; opacity: 0.7; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">×</button>
    `;
    
    // Agregar al contenedor
    contenedor.appendChild(notificacion);
    
    // Auto-remover después del tiempo configurado
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.style.animation = 'slideOutCompact 0.3s ease-in forwards';
            setTimeout(() => notificacion.remove(), 300);
        }
    }, NOTIFICACIONES_CONFIG.duracion);
    
    // Click para cerrar
    notificacion.addEventListener('click', () => {
        notificacion.style.animation = 'slideOutCompact 0.3s ease-in forwards';
        setTimeout(() => notificacion.remove(), 300);
    });
}

// Agregar estilos CSS para animaciones
const estilosNotificaciones = document.createElement('style');
estilosNotificaciones.textContent = `
    @keyframes slideInCompact {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutCompact {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notificacion-compacta {
        transition: all 0.3s ease;
    }
    
    .notificacion-compacta:hover {
        transform: translateX(-5px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }
`;

document.head.appendChild(estilosNotificaciones);

// Función para mostrar múltiples notificaciones
function mostrarNotificacionesCompactas(notificaciones) {
    notificaciones.forEach((notif, index) => {
        setTimeout(() => {
            mostrarNotificacionCompacta(notif.mensaje, notif.tipo);
        }, index * 200); // Espaciar 200ms entre cada una
    });
}

// Función para limpiar todas las notificaciones
function limpiarNotificacionesCompactas() {
    const contenedor = document.getElementById('notificaciones-container');
    if (contenedor) {
        contenedor.remove();
    }
}

// Reemplazar la función global mostrarNotificacion si existe
if (typeof mostrarNotificacion === 'function') {
    window.mostrarNotificacionOriginal = mostrarNotificacion;
}

// Función principal que reemplaza mostrarNotificacion
window.mostrarNotificacion = function(mensaje, tipo = 'info') {
    mostrarNotificacionCompacta(mensaje, tipo);
};

// Exportar funciones para uso global
window.notificacionesCompactas = {
    mostrar: mostrarNotificacionCompacta,
    mostrarMultiples: mostrarNotificacionesCompactas,
    limpiar: limpiarNotificacionesCompactas,
    config: NOTIFICACIONES_CONFIG
};

console.log('🔔 Sistema de notificaciones compactas cargado correctamente');











