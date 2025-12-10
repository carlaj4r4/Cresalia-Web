// ===== SISTEMA DE MAPAS CRESALIA =====
// Sistema de mapas para ubicaciones de tiendas y puntos de retiro con Mapbox

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
            style: 'mapbox://styles/mapbox/light-v11'
        },
        dark: {
            name: 'Mapa Oscuro', 
            style: 'mapbox://styles/mapbox/dark-v11'
        },
        satellite: {
            name: 'Satélite',
            style: 'mapbox://styles/mapbox/satellite-v9'
        }
    }
};

// Variables globales para el mapa
let mapaMapbox = null;
let marcadorMapbox = null;
let coordenadasActuales = { lat: MAPAS_CONFIG.defaultLocation.lat, lng: MAPAS_CONFIG.defaultLocation.lng };

// ===== CARGAR SDK DE MAPBOX =====
function cargarSDKMapbox() {
    return new Promise((resolve, reject) => {
        // Verificar si ya está cargado
        if (typeof mapboxgl !== 'undefined') {
            console.log('✅ Mapbox GL JS ya está cargado');
            resolve();
            return;
        }

        // Cargar CSS
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Cargar JS
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        script.onload = () => {
            console.log('✅ Mapbox GL JS cargado correctamente');
            resolve();
        };
        script.onerror = () => {
            console.error('❌ Error cargando Mapbox GL JS');
            reject(new Error('No se pudo cargar Mapbox GL JS'));
        };
        document.head.appendChild(script);
    });
}

// ===== SISTEMA DE UBICACIONES =====
const SISTEMA_UBICACIONES = {
    // Función para mostrar mapa de ubicaciones
    mostrarMapaUbicaciones: async function() {
        console.log('🗺️ Mostrando mapa de ubicaciones...');
        
        // Cargar SDK de Mapbox primero
        try {
            await cargarSDKMapbox();
        } catch (error) {
            console.warn('⚠️ No se pudo cargar Mapbox, usando modo básico:', error);
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-ubicaciones';
        modal.style.cssText = `
            position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; 
            background: rgba(0,0,0,0.8) !important; z-index: 999999 !important; display: flex !important; 
            align-items: center !important; justify-content: center !important; padding: 20px !important;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; max-width: 1200px; width: 100%; max-height: 90vh; overflow-y: auto;">
                <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #374151;">🗺️ Ubicaciones y Mapas</h3>
                    <button onclick="this.closest('.modal-ubicaciones').remove(); if(mapaMapbox) { mapaMapbox.remove(); mapaMapbox = null; marcadorMapbox = null; }" 
                            style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
                </div>
                <div style="padding: 20px;">
                    ${this.generarInterfazMapas()}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('✅ Modal de mapa de ubicaciones agregado al DOM');
        
        // Inicializar mapa después de un pequeño delay para que el DOM esté listo
        setTimeout(() => {
            this.inicializarMapaMapbox();
        }, 300);
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
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Estilo de Mapa:</label>
                        <select id="estiloMapa" onchange="sistemaUbicaciones.cambiarEstiloMapa(this.value)" 
                                style="width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px;">
                            <option value="light">🗺️ Mapa Claro</option>
                            <option value="dark">🌙 Mapa Oscuro</option>
                            <option value="satellite">🛰️ Satélite</option>
                        </select>
                    </div>
                    
                    <div id="mapaContainer" style="width: 100%; height: 400px; background: #e5e7eb; border-radius: 8px; position: relative; overflow: hidden;">
                        <div id="mapaLoading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #6b7280; z-index: 1;">
                            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 10px;"></i>
                            <p>Cargando mapa...</p>
                        </div>
                    </div>
                    
                    <div style="margin-top: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Buscar Dirección:</label>
                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="buscarDireccion" placeholder="Ej: Av. Corrientes 1234, Buenos Aires" 
                                   onkeypress="if(event.key === 'Enter') sistemaUbicaciones.buscarDireccion()"
                                   style="flex: 1; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px;">
                            <button onclick="sistemaUbicaciones.buscarDireccion()" 
                                    style="background: #3b82f6; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                <i class="fas fa-search"></i> Buscar
                            </button>
                        </div>
                    </div>
                    
                    <div id="coordenadasInfo" style="margin-top: 10px; padding: 10px; background: #f0f9ff; border-radius: 8px; font-size: 0.9rem; color: #0c4a6e; display: none;">
                        <strong>📍 Coordenadas:</strong> <span id="coordenadasTexto">-</span>
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
            coordenadas: coordenadasActuales, // Guardar coordenadas del mapa
            fecha: new Date().toLocaleDateString()
        };
        
        const ubicaciones = JSON.parse(localStorage.getItem('ubicaciones_tienda') || '[]');
        ubicaciones.push(ubicacion);
        localStorage.setItem('ubicaciones_tienda', JSON.stringify(ubicaciones));
        
        // También guardar en Supabase si está disponible
        if (typeof window.supabase !== 'undefined') {
            this.guardarUbicacionSupabase(ubicacion);
        }
        
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('✅ Ubicación guardada exitosamente', 'success');
        } else {
            alert('✅ Ubicación guardada exitosamente');
        }
        
        // Limpiar formulario
        document.getElementById('nombreUbicacion').value = '';
        document.getElementById('direccionUbicacion').value = '';
        document.getElementById('horariosUbicacion').value = '';
        document.getElementById('contactoUbicacion').value = '';
        
        // Recargar la lista
        setTimeout(() => {
            this.mostrarMapaUbicaciones();
        }, 500);
    },

    // Guardar ubicación en Supabase
    guardarUbicacionSupabase: async function(ubicacion) {
        try {
            if (!window.supabase) return;

            const { data, error } = await window.supabase
                .from('ubicaciones_tiendas')
                .insert([{
                    tienda_id: window.TIENDA_ACTUAL?.slug || 'demo-store',
                    nombre: ubicacion.nombre,
                    direccion: ubicacion.direccion,
                    tipo: ubicacion.tipo,
                    horarios: ubicacion.horarios,
                    contacto: ubicacion.contacto,
                    latitud: ubicacion.coordenadas.lat,
                    longitud: ubicacion.coordenadas.lng,
                    created_at: new Date().toISOString()
                }]);

            if (error) {
                console.warn('⚠️ Error guardando en Supabase:', error);
            } else {
                console.log('✅ Ubicación guardada en Supabase');
            }
        } catch (error) {
            console.warn('⚠️ Error en guardarUbicacionSupabase:', error);
        }
    },
    
    // Inicializar mapa de Mapbox
    inicializarMapaMapbox: function() {
        const container = document.getElementById('mapaContainer');
        if (!container) {
            console.warn('⚠️ Contenedor del mapa no encontrado');
            return;
        }

        // Obtener token de Mapbox
        const token = (window.MAPBOX_CONFIG && window.MAPBOX_CONFIG.accessToken) 
            || window.__MAPBOX_ACCESS_TOKEN__ 
            || (typeof process !== 'undefined' && process.env && process.env.MAPBOX_ACCESS_TOKEN);

        if (!token) {
            console.warn('⚠️ MAPBOX_ACCESS_TOKEN no configurado. El mapa funcionará en modo limitado.');
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6b7280; text-align: center; padding: 20px;">
                    <div>
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px; color: #f59e0b;"></i>
                        <p><strong>Mapbox no configurado</strong></p>
                        <p style="font-size: 0.9rem;">Configura MAPBOX_ACCESS_TOKEN en Vercel para usar mapas interactivos.</p>
                    </div>
                </div>
            `;
            return;
        }

        if (typeof mapboxgl === 'undefined') {
            console.warn('⚠️ Mapbox GL JS no está cargado');
            return;
        }

        try {
            mapboxgl.accessToken = token;

            // Obtener coordenadas guardadas o usar las por defecto
            const ubicaciones = JSON.parse(localStorage.getItem('ubicaciones_tienda') || '[]');
            let lat = MAPAS_CONFIG.defaultLocation.lat;
            let lng = MAPAS_CONFIG.defaultLocation.lng;

            if (ubicaciones.length > 0 && ubicaciones[0].coordenadas) {
                lat = ubicaciones[0].coordenadas.lat;
                lng = ubicaciones[0].coordenadas.lng;
            }

            coordenadasActuales = { lat, lng };

            // Crear el mapa
            mapaMapbox = new mapboxgl.Map({
                container: 'mapaContainer',
                style: MAPAS_CONFIG.mapStyles.light.style,
                center: [lng, lat],
                zoom: MAPAS_CONFIG.defaultLocation.zoom
            });

            // Ocultar loading
            const loading = document.getElementById('mapaLoading');
            if (loading) loading.style.display = 'none';

            // Agregar controles de navegación
            mapaMapbox.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Crear marcador arrastrable
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.cssText = `
                background-color: #ef4444;
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                cursor: move;
            `;

            marcadorMapbox = new mapboxgl.Marker({ 
                element: el, 
                draggable: true 
            })
                .setLngLat([lng, lat])
                .addTo(mapaMapbox);

            // Actualizar coordenadas al arrastrar
            marcadorMapbox.on('dragend', () => {
                const lngLat = marcadorMapbox.getLngLat();
                coordenadasActuales = { lat: lngLat.lat, lng: lngLat.lng };
                this.actualizarCoordenadas(lngLat.lat, lngLat.lng);
                
                // Hacer reverse geocoding para obtener la dirección
                this.reverseGeocode(lngLat.lat, lngLat.lng);
            });

            // Actualizar coordenadas al hacer clic en el mapa
            mapaMapbox.on('click', (e) => {
                const { lng, lat } = e.lngLat;
                coordenadasActuales = { lat, lng };
                marcadorMapbox.setLngLat([lng, lat]);
                this.actualizarCoordenadas(lat, lng);
                this.reverseGeocode(lat, lng);
            });

            // Mostrar coordenadas iniciales
            this.actualizarCoordenadas(lat, lng);

            console.log('✅ Mapa de Mapbox inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando mapa de Mapbox:', error);
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ef4444; text-align: center; padding: 20px;">
                    <div>
                        <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                        <p><strong>Error al cargar el mapa</strong></p>
                        <p style="font-size: 0.9rem;">${error.message}</p>
                    </div>
                </div>
            `;
        }
    },

    // Actualizar coordenadas en la UI
    actualizarCoordenadas: function(lat, lng) {
        const info = document.getElementById('coordenadasInfo');
        const texto = document.getElementById('coordenadasTexto');
        if (info && texto) {
            texto.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            info.style.display = 'block';
        }
    },

    // Cambiar estilo del mapa
    cambiarEstiloMapa: function(estilo) {
        if (!mapaMapbox) return;
        
        const estiloMapa = MAPAS_CONFIG.mapStyles[estilo];
        if (estiloMapa) {
            mapaMapbox.setStyle(estiloMapa.style);
        }
    },

    // Reverse geocoding (coordenadas a dirección)
    reverseGeocode: async function(lat, lng) {
        const token = (window.MAPBOX_CONFIG && window.MAPBOX_CONFIG.accessToken) 
            || window.__MAPBOX_ACCESS_TOKEN__;
        
        if (!token) return;

        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&language=es&limit=1`
            );
            
            if (!response.ok) return;
            
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const direccion = data.features[0].place_name;
                const inputDireccion = document.getElementById('direccionUbicacion');
                if (inputDireccion) {
                    inputDireccion.value = direccion;
                }
            }
        } catch (error) {
            console.warn('⚠️ Error en reverse geocoding:', error);
        }
    },

    // Buscar dirección (geocoding)
    buscarDireccion: async function() {
        const direccion = document.getElementById('buscarDireccion').value.trim();
        if (!direccion) {
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('⚠️ Por favor ingresa una dirección', 'warning');
            }
            return;
        }

        const token = (window.MAPBOX_CONFIG && window.MAPBOX_CONFIG.accessToken) 
            || window.__MAPBOX_ACCESS_TOKEN__;

        if (!token) {
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('⚠️ Mapbox no está configurado', 'warning');
            }
            return;
        }

        if (!mapaMapbox || !marcadorMapbox) {
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('⚠️ El mapa no está inicializado', 'warning');
            }
            return;
        }

        try {
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('🔍 Buscando dirección...', 'info');
            }

            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(direccion)}.json?access_token=${token}&country=ar&language=es&limit=1`
            );

            if (!response.ok) {
                throw new Error('Error en la búsqueda');
            }

            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                const placeName = data.features[0].place_name;

                // Centrar mapa y mover marcador
                mapaMapbox.flyTo({
                    center: [lng, lat],
                    zoom: 15,
                    essential: true
                });

                marcadorMapbox.setLngLat([lng, lat]);
                coordenadasActuales = { lat, lng };

                // Actualizar dirección en el formulario
                const inputDireccion = document.getElementById('direccionUbicacion');
                if (inputDireccion) {
                    inputDireccion.value = placeName;
                }

                this.actualizarCoordenadas(lat, lng);

                if (typeof mostrarNotificacion === 'function') {
                    mostrarNotificacion('✅ Dirección encontrada', 'success');
                }
            } else {
                if (typeof mostrarNotificacion === 'function') {
                    mostrarNotificacion('⚠️ No se encontró la dirección', 'warning');
                }
            }
        } catch (error) {
            console.error('❌ Error buscando dirección:', error);
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('❌ Error al buscar la dirección', 'error');
            }
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

