// ===== SISTEMA DE BIENESTAR EMOCIONAL OPCIONAL =====
// Permite a los usuarios activar/desactivar el sistema de bienestar

console.log('💜 Iniciando sistema de bienestar emocional opcional...');

// ===== CONFIGURACIÓN DE BIENESTAR =====
const CONFIGURACION_BIENESTAR = {
    // Función para verificar si el bienestar está activado
    estaActivo: function() {
        const config = JSON.parse(localStorage.getItem('configuracionBienestar') || '{}');
        return config.activo !== false; // Por defecto está activo
    },
    
    // Función para activar/desactivar el bienestar
    toggleBienestar: function(activo) {
        const config = {
            activo: activo,
            fechaCambio: new Date().toISOString(),
            usuario: localStorage.getItem('cresalia_user_data') ? JSON.parse(localStorage.getItem('cresalia_user_data')).email : 'usuario'
        };
        
        localStorage.setItem('configuracionBienestar', JSON.stringify(config));
        
        if (activo) {
            console.log('✅ Sistema de bienestar emocional activado');
            this.mostrarNotificacion('💜 Sistema de bienestar emocional activado', 'success');
        } else {
            console.log('❌ Sistema de bienestar emocional desactivado');
            this.mostrarNotificacion('Sistema de bienestar emocional desactivado', 'info');
        }
        
        // Recargar la página para aplicar cambios
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    },
    
    // Función para mostrar configuración de bienestar
    mostrarConfiguracionBienestar: function() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; 
            background: rgba(0,0,0,0.8) !important; z-index: 999999 !important; display: flex !important; 
            align-items: center !important; justify-content: center !important; padding: 20px !important;
        `;
        
        const estaActivo = this.estaActivo();
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">
                <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #374151;">💜 Configuración de Bienestar Emocional</h3>
                    <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 20px;">
                    <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 15px 0; color: #374151;">¿Qué es el Sistema de Bienestar Emocional?</h4>
                        <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
                            Es un sistema único que te ayuda a mantener tu equilibrio emocional mientras emprendes. 
                            Incluye música relajante, consejos de salud mental, técnicas de relajación y recursos 
                            para tu bienestar personal y empresarial.
                        </p>
                        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e;">
                            <h5 style="margin: 0 0 10px 0; color: #155724;">✨ Características incluidas:</h5>
                            <ul style="margin: 0; padding-left: 20px; color: #155724;">
                                <li>🎵 Música relajante y motivacional</li>
                                <li>🧠 Consejos de salud mental para emprendedores</li>
                                <li>🧘‍♀️ Técnicas de relajación y meditación</li>
                                <li>💪 Consejos para crecer en ventas</li>
                                <li>🌱 Recursos de bienestar personal</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="background: ${estaActivo ? '#e8f5e8' : '#fef2f2'}; padding: 20px; border-radius: 10px; border-left: 4px solid ${estaActivo ? '#22c55e' : '#ef4444'}; margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                            <div style="width: 50px; height: 50px; background: ${estaActivo ? '#22c55e' : '#ef4444'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                                ${estaActivo ? '💜' : '💔'}
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0; color: #374151;">Estado Actual: ${estaActivo ? 'Activo' : 'Inactivo'}</h4>
                                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 0.9rem;">
                                    ${estaActivo ? 'El sistema de bienestar está funcionando' : 'El sistema de bienestar está desactivado'}
                                </p>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 10px;">
                            <button onclick="configuracionBienestar.toggleBienestar(true)" 
                                    style="background: #22c55e; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; ${estaActivo ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
                                    ${estaActivo ? 'disabled' : ''}>
                                <i class="fas fa-heart"></i> Activar Bienestar
                            </button>
                            <button onclick="configuracionBienestar.toggleBienestar(false)" 
                                    style="background: #ef4444; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; ${!estaActivo ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
                                    ${!estaActivo ? 'disabled' : ''}>
                                <i class="fas fa-heart-broken"></i> Desactivar Bienestar
                            </button>
                        </div>
                    </div>
                    
                    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        <h5 style="color: #92400e; margin-bottom: 10px;">💡 Nota Importante</h5>
                        <p style="color: #92400e; margin: 0; font-size: 0.9rem;">
                            Puedes activar o desactivar el sistema de bienestar en cualquier momento. 
                            Los cambios se aplicarán inmediatamente y podrás volver a activarlo cuando lo desees.
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('✅ Modal de configuración de bienestar agregado al DOM');
        
        // Forzar visibilidad
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        console.log('✅ Modal de configuración de bienestar forzado a ser visible');
    },
    
    // Función para mostrar notificación
    mostrarNotificacion: function(mensaje, tipo) {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, tipo);
        } else {
            console.log(`${tipo.toUpperCase()}: ${mensaje}`);
        }
    },
    
    // Función para inicializar el sistema
    inicializar: function() {
        console.log('💜 Inicializando sistema de bienestar opcional...');
        
        // Verificar si el bienestar está activo
        if (this.estaActivo()) {
            console.log('✅ Sistema de bienestar emocional activo');
        } else {
            console.log('❌ Sistema de bienestar emocional desactivado');
        }
    }
};

// ===== FUNCIONES GLOBALES =====
window.configuracionBienestar = CONFIGURACION_BIENESTAR;
window.mostrarConfiguracionBienestar = CONFIGURACION_BIENESTAR.mostrarConfiguracionBienestar.bind(CONFIGURACION_BIENESTAR);

// Asegurar que las funciones estén disponibles inmediatamente
if (typeof window.mostrarConfiguracionBienestar !== 'function') {
    window.mostrarConfiguracionBienestar = function() {
        console.log('💜 [FALLBACK] Mostrando configuración de bienestar...');
        CONFIGURACION_BIENESTAR.mostrarConfiguracionBienestar();
    };
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    CONFIGURACION_BIENESTAR.inicializar();
});

console.log('💜 Sistema de bienestar emocional opcional cargado correctamente');

