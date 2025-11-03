// ===== FUNCIONES DE ARREGLOS PARA TIENDA ADMIN =====

// Función para cargar configuración guardada
function cargarConfiguracionGuardada() {
    try {
        console.log('📋 Cargando configuración guardada...');
        const config = localStorage.getItem('configuracion_tienda');
        if (config) {
            const configData = JSON.parse(config);
            console.log('✅ Configuración cargada:', configData);
            return configData;
        } else {
            console.log('ℹ️ No hay configuración guardada');
            return {};
        }
    } catch (error) {
        console.error('❌ Error al cargar configuración:', error);
        return {};
    }
}

// Función simplificada para abrir diario emocional
function abrirDiarioEmocional() {
    console.log('💜 Abriendo diario emocional...');
    
    try {
        const modal = document.createElement('div');
        modal.className = 'modal-diario-emocional';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            opacity: 0;
            animation: modalSlideIn 0.3s ease-out forwards;
        `;
        
        modal.innerHTML = `
            <div class="modal-diario-content" style="
                background: white;
                border-radius: 20px;
                width: 90%;
                max-width: 800px;
                height: 80%;
                max-height: 600px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                transform: scale(0.8) translateY(-50px);
                animation: modalSlideIn 0.3s ease-out forwards;
            ">
                <div class="modal-diario-header" style="
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 80px;
                ">
                    <h3 style="margin: 0; font-size: 1.5rem; font-weight: 600;">📖 Mi Diario Emocional</h3>
                    <button class="btn-cerrar" onclick="cerrarDiarioEmocional()" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 2rem;
                        cursor: pointer;
                        padding: 0;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    ">×</button>
                </div>
                <div class="modal-diario-body" style="
                    height: calc(100% - 80px);
                    overflow-y: auto;
                    padding: 20px;
                ">
                    <p style="text-align: center; color: #666; margin-top: 50px;">
                        El diario emocional está siendo configurado.<br>
                        Pronto estará disponible para ti.
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Agregar estilos de animación
        if (!document.querySelector('#estilos-modal-diario')) {
            const style = document.createElement('style');
            style.id = 'estilos-modal-diario';
            style.textContent = `
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                .btn-cerrar:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }
            `;
            document.head.appendChild(style);
        }
        
    } catch (error) {
        console.error('❌ Error al abrir diario emocional:', error);
        mostrarNotificacion('Error al abrir el diario emocional', 'error');
    }
}

// Función para cerrar diario emocional
function cerrarDiarioEmocional() {
    console.log('🔒 Cerrando diario emocional...');
    const modal = document.querySelector('.modal-diario-emocional');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
        console.log('✅ Diario emocional cerrado');
    }
}

// Función para contactar con Crisla
function contactarCrisla() {
    console.log('💬 Contactando con Crisla...');
    window.open('../../panel-master-cresalia.html', '_blank');
}

// Función para ver mi tienda
function verMiTienda() {
    console.log('🏪 Abriendo mi tienda...');
    window.open('index.html', '_blank');
}

// Exportar funciones si estamos en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cargarConfiguracionGuardada,
        abrirDiarioEmocional,
        cerrarDiarioEmocional,
        contactarCrisla,
        verMiTienda
    };
}



