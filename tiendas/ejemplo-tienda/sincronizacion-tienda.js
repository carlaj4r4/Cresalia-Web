/**
 * 🔗 SISTEMA DE SINCRONIZACIÓN TIENDA
 * Sincroniza datos entre admin.html e index.html
 * Permite que los cambios en el panel admin se reflejen en la tienda pública
 */

console.log('🔗 Inicializando sistema de sincronización de tienda...');

class SincronizacionTienda {
    constructor() {
        this.claves = {
            nombreTienda: 'tienda_nombre',
            descripcion: 'tienda_descripcion',
            logo: 'tienda_logo',
            colores: 'tienda_colores',
            configuracion: 'tienda_configuracion'
        };
        
        this.init();
    }
    
    init() {
        console.log('🔄 Inicializando sincronización...');
        
        // Cargar configuración existente
        this.cargarConfiguracion();
        
        // Si estamos en admin.html, cargar nombre en header
        if (this.esAdmin()) {
            this.actualizarHeaderAdmin();
        }
        
        // Si estamos en index.html, cargar nombre en la tienda
        if (this.esTiendaPublica()) {
            this.actualizarTiendaPublica();
        }
        
        console.log('✅ Sincronización inicializada');
    }
    
    // ==================== DETECCIÓN DE PÁGINA ====================
    
    esAdmin() {
        return window.location.pathname.includes('admin.html');
    }
    
    esTiendaPublica() {
        return window.location.pathname.includes('index.html') || 
               window.location.pathname.endsWith('/');
    }
    
    // ==================== CARGAR CONFIGURACIÓN ====================
    
    cargarConfiguracion() {
        // Intentar cargar desde múltiples fuentes
        let config = {};
        
        // 1. Desde localStorage específico de tienda
        const configGuardada = localStorage.getItem(this.claves.configuracion);
        if (configGuardada) {
            try {
                config = JSON.parse(configGuardada);
                console.log('📦 Configuración cargada desde localStorage:', config);
            } catch (error) {
                console.warn('⚠️ Error parseando configuración:', error);
            }
        }
        
        // 2. Desde datos de usuario de Cresalia (SOLO si no hay configuración guardada)
        if (!config.nombreTienda) {
            const userData = localStorage.getItem('cresalia_user_data');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    if (user.nombre_tienda) {
                        config.nombreTienda = user.nombre_tienda;
                        console.log('👤 Nombre de tienda desde usuario (primera vez):', user.nombre_tienda);
                    }
                } catch (error) {
                    console.warn('⚠️ Error parseando user data:', error);
                }
            }
        } else {
            console.log('✅ Usando nombre guardado en configuración:', config.nombreTienda);
        }
        
        // 3. Valores por defecto si no hay nada
        if (!config.nombreTienda) {
            config.nombreTienda = 'Mi Tienda';
        }
        
        this.config = config;
        return config;
    }
    
    // ==================== GUARDAR CONFIGURACIÓN ====================
    
    guardarConfiguracion(config) {
        console.log('💾 Guardando configuración de tienda:', config);
        
        // Actualizar objeto interno
        this.config = { ...this.config, ...config };
        
        // Guardar en localStorage
        localStorage.setItem(this.claves.configuracion, JSON.stringify(this.config));
        
        // También guardar nombre específicamente para compatibilidad
        if (config.nombreTienda) {
            localStorage.setItem(this.claves.nombreTienda, config.nombreTienda);
            
            // Actualizar en user_data también
            const userData = localStorage.getItem('cresalia_user_data');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    user.nombre_tienda = config.nombreTienda;
                    localStorage.setItem('cresalia_user_data', JSON.stringify(user));
                    console.log('✅ User data actualizado con nuevo nombre');
                } catch (error) {
                    console.warn('⚠️ Error actualizando user data:', error);
                }
            }
        }
        
        console.log('✅ Configuración guardada exitosamente');
        
        // Actualizar interfaz inmediatamente
        if (this.esAdmin()) {
            this.actualizarHeaderAdmin();
        } else if (this.esTiendaPublica()) {
            this.actualizarTiendaPublica();
        }
    }
    
    // ==================== ACTUALIZAR ADMIN ====================
    
    actualizarHeaderAdmin() {
        console.log('🔄 Actualizando header de admin...');
        
        const nombreTienda = this.config.nombreTienda || 'Mi Tienda';
        
        // Actualizar título de la página
        const pageTitle = document.querySelector('title');
        if (pageTitle) {
            pageTitle.textContent = `${nombreTienda} - Panel de Administración`;
        }
        
        // Actualizar header si existe
        const adminHeader = document.querySelector('.admin-header h1');
        if (adminHeader) {
            adminHeader.innerHTML = `<i class="fas fa-store"></i> ${nombreTienda} - Admin`;
        }
        
        console.log('✅ Header admin actualizado con:', nombreTienda);
    }
    
    // ==================== ACTUALIZAR TIENDA PÚBLICA ====================
    
    actualizarTiendaPublica() {
        console.log('🔄 Actualizando tienda pública...');
        
        const nombreTienda = this.config.nombreTienda || 'Mi Tienda';
        const descripcion = this.config.descripcion || 'Tu tienda de confianza para productos de calidad.';
        
        // 1. Actualizar título de la página
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = `${nombreTienda} - Productos de Calidad`;
            console.log('✅ Título de página actualizado');
        }
        
        // 2. Actualizar hero section
        const heroNombre = document.getElementById('heroTiendaNombre');
        if (heroNombre) {
            heroNombre.textContent = `¡Bienvenidos a ${nombreTienda}!`;
            console.log('✅ Hero nombre actualizado');
        }
        
        const heroDescripcion = document.getElementById('heroTiendaDescripcion');
        if (heroDescripcion) {
            heroDescripcion.textContent = descripcion;
            console.log('✅ Hero descripción actualizada');
        }
        
        // 3. Actualizar footer - nombre de tienda
        const footerNombre = document.getElementById('footerTiendaNombre');
        if (footerNombre) {
            footerNombre.textContent = nombreTienda;
            console.log('✅ Footer nombre actualizado');
        }
        
        // 4. Actualizar footer - descripción
        const footerDescripcion = document.getElementById('footerTiendaDescripcion');
        if (footerDescripcion) {
            footerDescripcion.textContent = descripcion;
            console.log('✅ Footer descripción actualizada');
        }
        
        // 5. Actualizar footer - copyright
        const footerCopyright = document.getElementById('footerCopyright');
        if (footerCopyright) {
            footerCopyright.textContent = nombreTienda;
            console.log('✅ Footer copyright actualizado');
        }
        
        console.log('✅ Tienda pública actualizada completamente con:', nombreTienda);
    }
    
    // ==================== FUNCIONES PÚBLICAS ====================
    
    cambiarNombreTienda(nuevoNombre) {
        if (!nuevoNombre || nuevoNombre.trim() === '') {
            console.error('❌ Nombre de tienda no puede estar vacío');
            return false;
        }
        
        console.log('📝 Cambiando nombre de tienda a:', nuevoNombre);
        
        this.guardarConfiguracion({ nombreTienda: nuevoNombre });
        
        // Mostrar notificación si existe la función
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(`✅ Nombre de tienda actualizado a: ${nuevoNombre}`, 'success');
        }
        
        return true;
    }
    
    obtenerNombreTienda() {
        return this.config.nombreTienda || 'Mi Tienda';
    }
}

// ==================== CREAR MODAL DE CONFIGURACIÓN ====================

window.abrirConfiguracionTienda = function() {
    console.log('⚙️ Abriendo configuración de tienda...');
    
    const sinc = window.sincronizacionTienda || new SincronizacionTienda();
    const nombreActual = sinc.obtenerNombreTienda();
    
    // Remover modal existente
    const modalExistente = document.getElementById('modalConfigTienda');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'modalConfigTienda';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999; animation: fadeIn 0.3s;';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 24px; max-width: 700px; width: 95%; max-height: 90vh; overflow-y: auto;">
            <div style="background: linear-gradient(135deg, #667EEA, #764BA2); color: white; padding: 32px; text-align: center; position: relative;">
                <button onclick="document.getElementById('modalConfigTienda').remove()" style="position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.2); border: none; width: 40px; height: 40px; border-radius: 50%; color: white; font-size: 20px; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
                <div style="font-size: 64px; margin-bottom: 16px;">⚙️</div>
                <h2 style="margin: 0 0 12px 0; font-size: 2rem; font-weight: 800;">Configuración de Tienda</h2>
                <p style="margin: 0; opacity: 0.95;">Personaliza tu tienda online</p>
            </div>
            
            <div style="padding: 32px;">
                <form id="formConfigTienda" onsubmit="guardarConfiguracionTienda(event); return false;">
                    
                    <!-- Nombre de la Tienda -->
                    <div style="margin-bottom: 28px;">
                        <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #374151; font-size: 1rem;">
                            <i class="fas fa-store" style="color: #667EEA; margin-right: 8px;"></i>
                            Nombre de tu Tienda
                        </label>
                        <input 
                            type="text" 
                            id="inputNombreTienda" 
                            value="${nombreActual}"
                            placeholder="Ej: TechStore Argentina"
                            required
                            style="width: 100%; padding: 14px 16px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 1rem; transition: all 0.3s;"
                            onfocus="this.style.borderColor='#667EEA'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                            onblur="this.style.borderColor='#E5E7EB'; this.style.boxShadow='none'"
                        >
                        <small style="display: block; margin-top: 8px; color: #6B7280; font-style: italic;">
                            Este nombre aparecerá en tu tienda pública y en el panel admin
                        </small>
                    </div>
                    
                    <!-- Descripción -->
                    <div style="margin-bottom: 28px;">
                        <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #374151; font-size: 1rem;">
                            <i class="fas fa-align-left" style="color: #764BA2; margin-right: 8px;"></i>
                            Descripción de tu Tienda
                        </label>
                        <textarea 
                            id="inputDescripcionTienda"
                            rows="3"
                            placeholder="Describe tu tienda y lo que ofreces..."
                            style="width: 100%; padding: 14px 16px; border: 2px solid #E5E7EB; border-radius: 12px; font-size: 1rem; resize: vertical; font-family: inherit; transition: all 0.3s;"
                            onfocus="this.style.borderColor='#764BA2'; this.style.boxShadow='0 0 0 3px rgba(118, 75, 162, 0.1)'"
                            onblur="this.style.borderColor='#E5E7EB'; this.style.boxShadow='none'"
                        >${sinc.config.descripcion || ''}</textarea>
                    </div>
                    
                    <!-- Botones -->
                    <div style="display: flex; gap: 12px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
                        <button 
                            type="button" 
                            onclick="document.getElementById('modalConfigTienda').remove()"
                            style="flex: 1; background: #F3F4F6; color: #374151; border: none; padding: 16px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s;"
                            onmouseover="this.style.background='#E5E7EB'"
                            onmouseout="this.style.background='#F3F4F6'"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            style="flex: 2; background: linear-gradient(135deg, #667EEA, #764BA2); color: white; border: none; padding: 16px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.3)'"
                        >
                            <i class="fas fa-save"></i> Guardar Cambios
                        </button>
                    </div>
                    
                    <div style="margin-top: 24px; padding: 16px; background: #F0F9FF; border-left: 4px solid #3B82F6; border-radius: 8px;">
                        <p style="margin: 0; color: #1E3A8A; font-size: 0.9rem; line-height: 1.6;">
                            <i class="fas fa-info-circle" style="margin-right: 8px;"></i>
                            <strong>Sincronización automática:</strong> Los cambios se aplicarán inmediatamente en tu tienda pública y panel admin.
                        </p>
                    </div>
                    
                </form>
            </div>
        </div>
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        </style>
    `;
    
    document.body.appendChild(modal);
    
    // Focus en el campo de nombre
    setTimeout(() => {
        const input = document.getElementById('inputNombreTienda');
        if (input) {
            input.focus();
            input.select();
        }
    }, 100);
};

// Función para guardar la configuración
window.guardarConfiguracionTienda = function(event) {
    event.preventDefault();
    console.log('💾 Guardando configuración de tienda...');
    
    const nombreTienda = document.getElementById('inputNombreTienda').value.trim();
    const descripcion = document.getElementById('inputDescripcionTienda').value.trim();
    
    if (!nombreTienda) {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('❌ El nombre de la tienda es requerido', 'error');
        }
        return;
    }
    
    // Usar el sistema de sincronización
    const sinc = window.sincronizacionTienda || new SincronizacionTienda();
    
    // Guardar configuración
    sinc.guardarConfiguracion({
        nombreTienda: nombreTienda,
        descripcion: descripcion
    });
    
    // Cerrar modal
    document.getElementById('modalConfigTienda').remove();
    
    // Mostrar confirmación
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('✅ Configuración guardada. Recargá la página para ver los cambios.', 'success');
    }
    
    console.log('✅ Configuración guardada correctamente');
    
    // Aplicar cambios inmediatamente SIN recargar
    console.log('🔄 Aplicando cambios inmediatamente...');
    
    // Actualizar nombre en el header del admin
    const adminHeader = document.querySelector('.admin-header h1');
    if (adminHeader) {
        adminHeader.innerHTML = `<i class="fas fa-store"></i> ${nombreTienda} - Admin`;
        console.log('✅ Header actualizado en vivo');
    }
    
    // Actualizar título de la página
    document.title = `${nombreTienda} - Panel de Administración`;
    
    console.log('✅ Cambios aplicados sin necesidad de recargar');
    
    // Opcional: Sugerir recarga solo si quieren ver cambios en index.html
    setTimeout(() => {
        if (confirm('✅ Configuración guardada.\n\n¿Querés recargar para asegurar que todo esté sincronizado?')) {
            location.reload();
        } else {
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('💡 Tip: Abrí index.html para ver el nombre actualizado en la tienda pública', 'info');
            }
        }
    }, 500);
};

// ==================== INICIALIZACIÓN AUTOMÁTICA ====================

// Crear instancia global
window.sincronizacionTienda = new SincronizacionTienda();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SincronizacionTienda };
}

console.log('✅ Sistema de sincronización de tienda cargado');
console.log('📝 Nombre actual de tienda:', window.sincronizacionTienda.obtenerNombreTienda());
console.log('💡 Para cambiar configuración, usa: abrirConfiguracionTienda()');

