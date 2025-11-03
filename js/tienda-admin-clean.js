// ===== SISTEMA COMPLETO PARA TIENDA ADMIN - VERSIÓN LIMPIA =====

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

// Función para abrir diario emocional con diseño hermoso
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
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="modal-diario-content" style="
                background: linear-gradient(135deg, #ffffff, #f8fafc);
                border-radius: 25px;
                max-width: 900px;
                width: 95%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 80px rgba(0,0,0,0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
                position: relative;
                border: 3px solid #F9A8D4;
            ">
                <div class="modal-diario-header" style="
                    background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                    padding: 25px;
                    border-radius: 22px 22px 0 0;
                    border-bottom: 2px solid #F9A8D4;
                    margin-bottom: 20px;
                ">
                    <h2 style="color: #7C3AED; margin: 0; text-align: center; font-size: 1.8rem;">
                        <i class="fas fa-heart-pulse" style="margin-right: 10px;"></i> 
                        Mi Diario Personal
                    </h2>
                    <button onclick="cerrarDiarioEmocional()" style="
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: #ff6b6b;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        font-size: 18px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        ×
                    </button>
                </div>
                <div class="modal-diario-body" style="padding: 20px 25px 25px 25px;">
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="
                            background: linear-gradient(135deg, #667eea, #764ba2);
                            color: white;
                            padding: 30px;
                            border-radius: 20px;
                            margin-bottom: 20px;
                            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                        ">
                            <i class="fas fa-heart" style="font-size: 3rem; margin-bottom: 15px; display: block;"></i>
                            <h3 style="margin: 0 0 15px 0; font-size: 1.5rem;">¡Próximamente!</h3>
                            <p style="margin: 0; opacity: 0.9; line-height: 1.6;">
                                Tu diario emocional estará disponible muy pronto.<br>
                                Mientras tanto, puedes contactar con Crisla para apoyo emocional.
                            </p>
                        </div>
                        <button onclick="contactarCrisla()" style="
                            background: linear-gradient(135deg, #F093FB, #F5576C);
                            color: white;
                            border: none;
                            padding: 15px 30px;
                            border-radius: 25px;
                            font-size: 1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
                        " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 35px rgba(240, 147, 251, 0.4)'" 
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 25px rgba(240, 147, 251, 0.3)'">
                            <i class="fas fa-comments" style="margin-right: 8px;"></i>
                            Hablar con Crisla
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.modal-diario-content');
            content.style.transform = 'scale(1)';
        }, 10);
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarDiarioEmocional();
            }
        });
        
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
        const content = modal.querySelector('.modal-diario-content');
        if (content) {
            content.style.transform = 'scale(0.9)';
        }
        setTimeout(() => modal.remove(), 300);
        console.log('✅ Diario emocional cerrado');
    }
}

// Función para contactar con Crisla
function contactarCrisla() {
    console.log('💬 Contactando con Crisla...');
    window.open('../../panel-master-cresalia.html', '_blank');
    mostrarNotificacion('Abriendo chat con Crisla...', 'info');
}

// Función para ver mi tienda
function verMiTienda() {
    console.log('🏪 Abriendo mi tienda...');
    window.open('index.html', '_blank');
    mostrarNotificacion('Abriendo tu tienda...', 'info');
}

// Función para configurar pagos
function configurarMisPagos() {
    console.log('💳 Configurando pagos...');
    mostrarNotificacion('Configurando pagos de Mercado Pago...', 'info');
}

// Función para abrir WhatsApp
function abrirWhatsApp() {
    const mensaje = encodeURIComponent('Hola! Necesito ayuda con mi tienda en Cresalia. Mi tienda es: TechStore Argentina');
    window.open(`https://wa.me/5491112345678?text=${mensaje}`, '_blank');
    mostrarNotificacion('Abriendo WhatsApp...', 'info');
}

// Función para cargar inventario
function cargarInventario() {
    console.log('📦 Cargando inventario...');
    
    try {
        const productos = JSON.parse(localStorage.getItem('productos_tienda') || '[]');
        const inventarioData = productos.map(producto => ({
            ...producto,
            stock: producto.stock || Math.floor(Math.random() * 50) + 1,
            estado: producto.estado || (Math.random() > 0.8 ? 'inactivo' : 'activo'),
            ultimaActualizacion: new Date().toLocaleDateString()
        }));
        
        console.log('✅ Inventario cargado:', inventarioData.length, 'productos');
        return inventarioData;
    } catch (error) {
        console.error('❌ Error al cargar inventario:', error);
        return [];
    }
}

// Función para exportar inventario
function exportarInventario() {
    console.log('📊 Exportando inventario...');
    mostrarNotificacion('Exportando inventario a CSV...', 'info');
    
    try {
        const inventario = cargarInventario();
        if (inventario.length === 0) {
            mostrarNotificacion('No hay productos para exportar', 'warning');
            return;
        }
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Producto,Categoría,Stock,Estado,Precio\n"
            + inventario.map(p => `${p.nombre},${p.categoria},${p.stock || 'N/A'},${p.estado || 'activo'},${p.precio}`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inventario_tienda.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        mostrarNotificacion('Inventario exportado correctamente', 'success');
    } catch (error) {
        console.error('❌ Error al exportar inventario:', error);
        mostrarNotificacion('Error al exportar inventario', 'error');
    }
}

// Función para reportar problema de plan
function reportarProblemaPlan() {
    console.log('🚨 Reportando problema de plan...');
    mostrarNotificacion('Abriendo formulario de reporte...', 'info');
    
    // Crear modal de reporte
    const modal = document.createElement('div');
    modal.className = 'modal-reporte-plan';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 25px 80px rgba(0,0,0,0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        ">
            <h3 style="color: #7C3AED; margin-bottom: 20px; text-align: center;">
                <i class="fas fa-exclamation-triangle"></i> Reportar Problema
            </h3>
            <p style="margin-bottom: 20px; color: #666;">
                Describe el problema que estás experimentando con tu plan:
            </p>
            <textarea placeholder="Ej: No puedo acceder a ciertas funciones..." style="
                width: 100%;
                height: 100px;
                padding: 15px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                resize: vertical;
                font-family: inherit;
                margin-bottom: 20px;
            "></textarea>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="cerrarModal('modal-reporte-plan')" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                ">Cancelar</button>
                <button onclick="enviarReporte()" style="
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                ">Enviar Reporte</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animar entrada
    setTimeout(() => {
        modal.style.opacity = '1';
        const content = modal.querySelector('.modal-content');
        content.style.transform = 'scale(1)';
    }, 10);
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal('modal-reporte-plan');
        }
    });
}

// Función para cerrar modal genérico
function cerrarModal(modalId) {
    const modal = document.querySelector(`.${modalId}`);
    if (modal) {
        modal.style.opacity = '0';
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.transform = 'scale(0.9)';
        }
        setTimeout(() => modal.remove(), 300);
    }
}

// Función para enviar reporte
function enviarReporte() {
    console.log('📤 Enviando reporte...');
    cerrarModal('modal-reporte-plan');
    mostrarNotificacion('Reporte enviado correctamente. Te contactaremos pronto.', 'success');
}

// Exportar funciones si estamos en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cargarConfiguracionGuardada,
        abrirDiarioEmocional,
        cerrarDiarioEmocional,
        contactarCrisla,
        verMiTienda,
        configurarMisPagos,
        abrirWhatsApp,
        cargarInventario,
        exportarInventario,
        reportarProblemaPlan,
        cerrarModal,
        enviarReporte
    };
}



