// ===== SISTEMA DE MAPAS CRESALIA =====
// Sistema de mapas para ubicaciones de tiendas y puntos de retiro

console.log('🗺️ Iniciando sistema de mapas...');

// ===== CONFIGURACIÓN DE MAPAS =====
const MAPAS_CONFIG = {
    // Configuración por defecto (Argentina)
    defaultLocation: {
        lat: -34.6037,
        lng: -58.3816,
        zoom: 13
    },
    
    // Estilos de mapa
    mapStyles: {
        light: {
            name: 'Mapa Claro',
            style: 'mapbox://styles/mapbox/light-v10'
        },
        dark: {
            name: 'Mapa Oscuro', 
            style: 'mapbox://styles/mapbox/dark-v10'
        },
        satellite: {
            name: 'Satélite',
            style: 'mapbox://styles/mapbox/satellite-v9'
        }
    }
};

// ===== SISTEMA DE UBICACIONES =====
const SISTEMA_UBICACIONES = {
    // Función para mostrar mapa de ubicaciones
    mostrarMapaUbicaciones: function() {
        console.log('🗺️ Mostrando mapa de ubicaciones...');
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; 
            background: rgba(0,0,0,0.8) !important; z-index: 999999 !important; display: flex !important; 
            align-items: center !important; justify-content: center !important; padding: 20px !important;
        `;
        
        modal.className = 'modal';
        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto;">
                <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #374151;">🗺️ Ubicaciones y Mapas</h3>
                    <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 20px;">
                    ${this.generarInterfazMapas()}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('✅ Modal de mapa de ubicaciones agregado al DOM');
        
        // Forzar visibilidad
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        console.log('✅ Modal de mapa de ubicaciones forzado a ser visible');
    },
    
    // Generar interfaz de mapas
    generarInterfazMapas: function() {
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- Configuración de Ubicación -->
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
                    <h4 style="margin: 0 0 15px 0; color: #374151;">📍 Configurar Ubicación</h4>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Nombre del Lugar:</label>
                        <input type="text" id="nombreUbicacion" placeholder="Ej: Mi Tienda Principal" 
                               style="width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Dirección:</label>
                        <input type="text" id="direccionUbicacion" placeholder="Ej: Av. Corrientes 1234, CABA" 
                               style="width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Tipo de Ubicación:</label>
                        <select id="tipoUbicacion" style="width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px;">
                            <option value="tienda">🏪 Tienda Física</option>
                            <option value="almacen">📦 Almacén</option>
                            <option value="oficina">🏢 Oficina</option>
                            <option value="punto_retiro">📍 Punto de Retiro</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Horarios:</label>
                        <textarea id="horariosUbicacion" placeholder="Lunes a Viernes: 9:00-18:00&#10;Sábados: 9:00-13:00" 
                                  style="width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px; min-height: 80px;"></textarea>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Contacto:</label>
                        <input type="text" id="contactoUbicacion" placeholder="Teléfono o WhatsApp" 
                               style="width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    
                    <button onclick="sistemaUbicaciones.guardarUbicacion()" 
                            style="width: 100%; background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-map-marker-alt"></i> Guardar Ubicación
                    </button>
                </div>
                
                <!-- Mapa Interactivo -->
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px;">
                    <h4 style="margin: 0 0 15px 0; color: #374151;">🗺️ Mapa Interactivo</h4>
                    
                    <div id="mapaContainer" style="width: 100%; height: 300px; background: #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280;">
                        <div style="text-align: center;">
                            <i class="fas fa-map" style="font-size: 2rem; margin-bottom: 10px;"></i>
                            <p>Mapa se cargará aquí</p>
                            <small>Integración con Google Maps o Mapbox</small>
                        </div>
                    </div>
                    
                    <div style="margin-top: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Buscar Dirección:</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="buscarDireccion" placeholder="Buscar dirección..." 
                                   style="flex: 1; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px;">
                            <button onclick="sistemaUbicaciones.buscarDireccion()" 
                                    style="background: #3b82f6; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer;">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Lista de Ubicaciones Guardadas -->
            <div style="margin-top: 30px;">
                <h4 style="color: #374151; margin-bottom: 20px;">📍 Mis Ubicaciones</h4>
                ${this.generarListaUbicaciones()}
            </div>
        `;
    },
    
    // Generar lista de ubicaciones
    generarListaUbicaciones: function() {
        const ubicaciones = JSON.parse(localStorage.getItem('ubicaciones_tienda') || '[]');
        
        if (ubicaciones.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-map-marker-alt" style="font-size: 3rem; margin-bottom: 15px; color: #d1d5db;"></i>
                    <h4 style="margin: 0 0 10px 0;">No hay ubicaciones registradas</h4>
                    <p style="margin: 0;">Agrega tu primera ubicación para que los clientes puedan encontrarte.</p>
                </div>
            `;
        }
        
        return `
            <div style="display: grid; gap: 15px;">
                ${ubicaciones.map(ubicacion => `
                    <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #10B981; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <div>
                                <h6 style="margin: 0 0 5px 0; color: #374151;">${ubicacion.nombre}</h6>
                                <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">${ubicacion.direccion}</p>
                            </div>
                            <div style="display: flex; gap: 5px;">
                                <button onclick="sistemaUbicaciones.editarUbicacion(${ubicacion.id})" 
                                        style="background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="sistemaUbicaciones.eliminarUbicacion(${ubicacion.id})" 
                                        style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <span style="background: #e5e7eb; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                                ${this.getTipoIcono(ubicacion.tipo)} ${ubicacion.tipo}
                            </span>
                            ${ubicacion.horarios ? `<span style="background: #f0f9ff; color: #0c4a6e; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">🕒 ${ubicacion.horarios}</span>` : ''}
                            ${ubicacion.contacto ? `<span style="background: #f0fdf4; color: #15803d; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">📞 ${ubicacion.contacto}</span>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // Obtener ícono del tipo
    getTipoIcono: function(tipo) {
        const iconos = {
            'tienda': '🏪',
            'almacen': '📦',
            'oficina': '🏢',
            'punto_retiro': '📍'
        };
        return iconos[tipo] || '📍';
    },
    
    // Guardar ubicación
    guardarUbicacion: function() {
        const nombre = document.getElementById('nombreUbicacion').value.trim();
        const direccion = document.getElementById('direccionUbicacion').value.trim();
        const tipo = document.getElementById('tipoUbicacion').value;
        const horarios = document.getElementById('horariosUbicacion').value.trim();
        const contacto = document.getElementById('contactoUbicacion').value.trim();
        
        if (!nombre || !direccion) {
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('⚠️ Por favor completa nombre y dirección', 'warning');
            } else {
                alert('⚠️ Por favor completa nombre y dirección');
            }
            return;
        }
        
        const ubicacion = {
            id: Date.now(),
            nombre,
            direccion,
            tipo,
            horarios,
            contacto,
            fecha: new Date().toLocaleDateString()
        };
        
        const ubicaciones = JSON.parse(localStorage.getItem('ubicaciones_tienda') || '[]');
        ubicaciones.push(ubicacion);
        localStorage.setItem('ubicaciones_tienda', JSON.stringify(ubicaciones));
        
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('✅ Ubicación guardada exitosamente', 'success');
        } else {
            alert('✅ Ubicación guardada exitosamente');
        }
        
        // Recargar la lista
        this.mostrarMapaUbicaciones();
    },
    
    // Buscar dirección
    buscarDireccion: function() {
        const direccion = document.getElementById('buscarDireccion').value.trim();
        if (!direccion) return;
        
        // Aquí se integraría con Google Maps API o Mapbox
        console.log('🔍 Buscando dirección:', direccion);
        
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('🔍 Buscando dirección...', 'info');
        }
    },
    
    // Editar ubicación
    editarUbicacion: function(id) {
        console.log('✏️ Editando ubicación:', id);
        // Implementar edición
    },
    
    // Eliminar ubicación
    eliminarUbicacion: function(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
            const ubicaciones = JSON.parse(localStorage.getItem('ubicaciones_tienda') || '[]');
            const nuevasUbicaciones = ubicaciones.filter(u => u.id !== id);
            localStorage.setItem('ubicaciones_tienda', JSON.stringify(nuevasUbicaciones));
            
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('✅ Ubicación eliminada', 'success');
            }
            
            // Recargar la lista
            this.mostrarMapaUbicaciones();
        }
    }
};

// ===== FUNCIONES GLOBALES =====
window.sistemaUbicaciones = SISTEMA_UBICACIONES;
window.mostrarMapaUbicaciones = SISTEMA_UBICACIONES.mostrarMapaUbicaciones.bind(SISTEMA_UBICACIONES);

// Asegurar que las funciones estén disponibles inmediatamente
if (typeof window.mostrarMapaUbicaciones !== 'function') {
    window.mostrarMapaUbicaciones = function() {
        console.log('🗺️ [FALLBACK] Mostrando mapa de ubicaciones...');
        SISTEMA_UBICACIONES.mostrarMapaUbicaciones();
    };
}

console.log('🗺️ Sistema de mapas cargado correctamente');

