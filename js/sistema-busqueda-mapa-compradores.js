// ===== SISTEMA DE BÚSQUEDA POR MAPA/UBICACIÓN PARA COMPRADORES =====
// Permite buscar productos/tiendas por ubicación en un mapa interactivo

const SistemaBusquedaMapaCompradores = {
    mapa: null,
    marcadores: [],
    ubicacionUsuario: null,
    radioBusqueda: 10, // km por defecto
    
    /**
     * Inicializar sistema de búsqueda por mapa
     */
    async inicializar() {
        try {
            // Cargar SDK de Mapbox
            await this.cargarMapbox();
            
            // Obtener ubicación del usuario
            await this.obtenerUbicacionUsuario();
            
            console.log('✅ Sistema de búsqueda por mapa inicializado');
        } catch (error) {
            console.error('Error inicializando sistema de mapa:', error);
        }
    },
    
    /**
     * Cargar SDK de Mapbox
     */
    async cargarMapbox() {
        return new Promise((resolve, reject) => {
            if (typeof mapboxgl !== 'undefined') {
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
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Error cargando Mapbox'));
            document.head.appendChild(script);
        });
    },
    
    /**
     * Obtener ubicación del usuario
     */
    async obtenerUbicacionUsuario() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                console.warn('⚠️ Geolocalización no disponible');
                // Usar ubicación por defecto (Buenos Aires)
                this.ubicacionUsuario = { lat: -34.6037, lng: -58.3816 };
                resolve(this.ubicacionUsuario);
                return;
            }
            
            // Verificar si ya hay una ubicación guardada reciente (menos de 1 hora)
            const ubicacionGuardada = localStorage.getItem('cresalia_ubicacion_usuario');
            if (ubicacionGuardada) {
                try {
                    const ubicacion = JSON.parse(ubicacionGuardada);
                    const fechaGuardada = new Date(ubicacion.fecha);
                    const ahora = new Date();
                    const horasTranscurridas = (ahora - fechaGuardada) / (1000 * 60 * 60);
                    
                    // Si la ubicación tiene menos de 1 hora, usarla (evita solicitar permiso de nuevo)
                    if (horasTranscurridas < 1) {
                        this.ubicacionUsuario = {
                            lat: ubicacion.latitud || ubicacion.lat,
                            lng: ubicacion.longitud || ubicacion.lng
                        };
                        console.log('✅ Ubicación cargada desde cache (evita solicitar permiso de nuevo):', this.ubicacionUsuario);
                        resolve(this.ubicacionUsuario);
                        return;
                    }
                } catch (error) {
                    console.log('⚠️ Error cargando ubicación guardada:', error);
                }
            }
            
            // Verificar si ya se concedió permiso anteriormente
            const consentimiento = localStorage.getItem('cresalia_geolocalizacion_consentimiento');
            if (consentimiento === 'denegado' || consentimiento === 'denied') {
                console.log('ℹ️ Usuario denegó permiso de ubicación anteriormente, usando ubicación por defecto');
                this.ubicacionUsuario = { lat: -34.6037, lng: -58.3816 };
                resolve(this.ubicacionUsuario);
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.ubicacionUsuario = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('✅ Ubicación del usuario obtenida:', this.ubicacionUsuario);
                    
                    // Guardar ubicación para reutilizar
                    const ubicacion = {
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude,
                        fecha: new Date().toISOString()
                    };
                    localStorage.setItem('cresalia_ubicacion_usuario', JSON.stringify(ubicacion));
                    
                    resolve(this.ubicacionUsuario);
                },
                (error) => {
                    console.warn('⚠️ Error obteniendo ubicación:', error);
                    // Si el usuario deniega, guardar para no volver a pedir
                    if (error.code === error.PERMISSION_DENIED) {
                        localStorage.setItem('cresalia_geolocalizacion_consentimiento', 'denegado');
                    }
                    // Usar ubicación por defecto
                    this.ubicacionUsuario = { lat: -34.6037, lng: -58.3816 };
                    resolve(this.ubicacionUsuario);
                },
                { timeout: 5000, enableHighAccuracy: false }
            );
        });
    },
    
    /**
     * Mostrar panel de búsqueda por mapa
     */
    async mostrarPanelMapa() {
        try {
            await this.inicializar();
            
            const modalHTML = `
                <div id="modal-busqueda-mapa" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto;">
                    <div style="background: white; border-radius: 20px; max-width: 1400px; width: 100%; max-height: 90vh; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3); display: flex; flex-direction: column;">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 25px; border-radius: 20px 20px 0 0; position: sticky; top: 0; z-index: 10;">
                            <button onclick="cerrarModalBusquedaMapa()" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); border: none; color: white; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-times"></i>
                            </button>
                            <h2 style="margin: 0; font-size: 24px; display: flex; align-items: center; gap: 10px;">
                                <i class="fas fa-map-marked-alt"></i> Búsqueda por Ubicación
                            </h2>
                            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">
                                Buscá productos y tiendas cerca de tu ubicación
                            </p>
                        </div>
                        
                        <!-- Contenido -->
                        <div style="display: grid; grid-template-columns: 350px 1fr; gap: 0; flex: 1; overflow: hidden;">
                            <!-- Panel lateral -->
                            <div style="background: #F8FAFC; padding: 20px; overflow-y: auto; border-right: 1px solid #E5E7EB;">
                                <!-- Búsqueda -->
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1F2937;">
                                        <i class="fas fa-search"></i> Buscar dirección
                                    </label>
                                    <div style="display: flex; gap: 8px;">
                                        <input type="text" id="buscar-direccion-mapa" placeholder="Ej: Av. Corrientes 1234, CABA" 
                                               style="flex: 1; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px;">
                                        <button onclick="SistemaBusquedaMapaCompradores.buscarDireccion()" 
                                                style="background: #3B82F6; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                                            <i class="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Radio de búsqueda -->
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1F2937;">
                                        <i class="fas fa-circle-notch"></i> Radio de búsqueda
                                    </label>
                                    <input type="range" id="radio-busqueda" min="1" max="50" value="${this.radioBusqueda}" 
                                           oninput="document.getElementById('radio-valor').textContent = this.value + ' km'; SistemaBusquedaMapaCompradores.actualizarRadio(this.value);"
                                           style="width: 100%;">
                                    <div style="text-align: center; margin-top: 5px; color: #6B7280; font-size: 14px;">
                                        <span id="radio-valor">${this.radioBusqueda} km</span>
                                    </div>
                                </div>
                                
                                <!-- Filtros -->
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1F2937;">
                                        <i class="fas fa-filter"></i> Filtros
                                    </label>
                                    <select id="filtro-categoria-mapa" style="width: 100%; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px; margin-bottom: 10px;">
                                        <option value="">Todas las categorías</option>
                                    </select>
                                    <select id="filtro-tipo-mapa" style="width: 100%; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px;">
                                        <option value="productos">Productos</option>
                                        <option value="servicios">Servicios</option>
                                        <option value="tiendas">Tiendas</option>
                                    </select>
                                </div>
                                
                                <!-- Botón buscar -->
                                <button onclick="SistemaBusquedaMapaCompradores.buscarEnMapa()" 
                                        style="width: 100%; background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; margin-bottom: 20px;">
                                    <i class="fas fa-search"></i> Buscar en Mapa
                                </button>
                                
                                <!-- Resultados -->
                                <div>
                                    <h4 style="margin: 0 0 15px 0; color: #1F2937; font-size: 16px;">
                                        <i class="fas fa-list"></i> Resultados (<span id="contador-resultados-mapa">0</span>)
                                    </h4>
                                    <div id="resultados-mapa" style="display: flex; flex-direction: column; gap: 10px;">
                                        <p style="color: #6B7280; text-align: center; padding: 20px;">
                                            Hacé clic en "Buscar en Mapa" para ver resultados
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Mapa -->
                            <div style="position: relative;">
                                <div id="mapa-busqueda-compradores" style="width: 100%; height: 100%; min-height: 600px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Remover modal existente
            const modalExistente = document.getElementById('modal-busqueda-mapa');
            if (modalExistente) {
                modalExistente.remove();
            }
            
            // Agregar modal
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Inicializar mapa después de un delay
            setTimeout(() => {
                this.inicializarMapa();
            }, 300);
            
            // Cargar categorías
            await this.cargarCategorias();
            
            // Event listeners
            const modal = document.getElementById('modal-busqueda-mapa');
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cerrarModalBusquedaMapa();
                }
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && document.getElementById('modal-busqueda-mapa')) {
                    cerrarModalBusquedaMapa();
                }
            });
            
        } catch (error) {
            console.error('Error mostrando panel de mapa:', error);
            alert('❌ Error al cargar el mapa. Verificá que Mapbox esté configurado.');
        }
    },
    
    /**
     * Inicializar mapa
     */
    async inicializarMapa() {
        try {
            // Obtener token de Mapbox
            const token = window.MAPBOX_CONFIG?.accessToken || 
                        (await fetch('/config-mapbox.js').then(r => r.text()).catch(() => null));
            
            if (!token || !token.includes('pk.')) {
                console.warn('⚠️ MAPBOX_ACCESS_TOKEN no configurado');
                document.getElementById('mapa-busqueda-compradores').innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #F3F4F6; color: #6B7280; flex-direction: column; gap: 10px;">
                        <i class="fas fa-map" style="font-size: 48px;"></i>
                        <p>Mapbox no está configurado. Configurá MAPBOX_ACCESS_TOKEN en las variables de entorno.</p>
                    </div>
                `;
                return;
            }
            
            mapboxgl.accessToken = token.replace(/.*accessToken['"]?\s*[:=]\s*['"]([^'"]+)['"].*/, '$1') || token;
            
            // Crear mapa
            this.mapa = new mapboxgl.Map({
                container: 'mapa-busqueda-compradores',
                style: 'mapbox://styles/mapbox/light-v11',
                center: [this.ubicacionUsuario.lng, this.ubicacionUsuario.lat],
                zoom: 13
            });
            
            // Agregar control de navegación
            this.mapa.addControl(new mapboxgl.NavigationControl());
            
            // Agregar marcador de usuario
            new mapboxgl.Marker({ color: '#3B82F6' })
                .setLngLat([this.ubicacionUsuario.lng, this.ubicacionUsuario.lat])
                .setPopup(new mapboxgl.Popup().setHTML('<strong>Tu ubicación</strong>'))
                .addTo(this.mapa);
            
            // Agregar círculo de radio
            this.actualizarRadio(this.radioBusqueda);
            
            console.log('✅ Mapa inicializado');
            
        } catch (error) {
            console.error('Error inicializando mapa:', error);
        }
    },
    
    /**
     * Actualizar radio de búsqueda
     */
    actualizarRadio(radio) {
        this.radioBusqueda = parseFloat(radio);
        
        if (!this.mapa) return;
        
        // Remover círculo anterior si existe
        if (this.mapa.getLayer('radio-circulo')) {
            this.mapa.removeLayer('radio-circulo');
            this.mapa.removeSource('radio-circulo');
        }
        
        // Crear círculo
        const circle = this.crearCirculo(this.ubicacionUsuario, this.radioBusqueda);
        
        this.mapa.addSource('radio-circulo', {
            type: 'geojson',
            data: circle
        });
        
        this.mapa.addLayer({
            id: 'radio-circulo',
            type: 'fill',
            source: 'radio-circulo',
            paint: {
                'fill-color': '#3B82F6',
                'fill-opacity': 0.1
            }
        });
        
        this.mapa.addLayer({
            id: 'radio-circulo-borde',
            type: 'line',
            source: 'radio-circulo',
            paint: {
                'line-color': '#3B82F6',
                'line-width': 2
            }
        });
    },
    
    /**
     * Crear círculo GeoJSON
     */
    crearCirculo(centro, radioKm) {
        const puntos = 64;
        const puntosArray = [];
        
        for (let i = 0; i < puntos; i++) {
            const angulo = (i * 360) / puntos;
            const punto = this.calcularPuntoEnCirculo(centro, radioKm, angulo);
            puntosArray.push([punto.lng, punto.lat]);
        }
        
        puntosArray.push(puntosArray[0]); // Cerrar el círculo
        
        return {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [puntosArray]
            }
        };
    },
    
    /**
     * Calcular punto en círculo
     */
    calcularPuntoEnCirculo(centro, radioKm, angulo) {
        const R = 6371; // Radio de la Tierra en km
        const anguloRad = (angulo * Math.PI) / 180;
        const latRad = (centro.lat * Math.PI) / 180;
        const lngRad = (centro.lng * Math.PI) / 180;
        
        const lat = Math.asin(
            Math.sin(latRad) * Math.cos(radioKm / R) +
            Math.cos(latRad) * Math.sin(radioKm / R) * Math.cos(anguloRad)
        );
        
        const lng = lngRad + Math.atan2(
            Math.sin(anguloRad) * Math.sin(radioKm / R) * Math.cos(latRad),
            Math.cos(radioKm / R) - Math.sin(latRad) * Math.sin(lat)
        );
        
        return {
            lat: (lat * 180) / Math.PI,
            lng: (lng * 180) / Math.PI
        };
    },
    
    /**
     * Buscar dirección
     */
    async buscarDireccion() {
        const direccion = document.getElementById('buscar-direccion-mapa').value.trim();
        if (!direccion) return;
        
        try {
            const token = mapboxgl.accessToken;
            if (!token) {
                alert('⚠️ Mapbox no está configurado');
                return;
            }
            
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(direccion)}.json?access_token=${token}&country=ar&language=es&limit=1`
            );
            
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                this.ubicacionUsuario = { lat, lng };
                
                // Centrar mapa
                if (this.mapa) {
                    this.mapa.setCenter([lng, lat]);
                    this.mapa.setZoom(14);
                    
                    // Actualizar círculo
                    this.actualizarRadio(this.radioBusqueda);
                }
                
                if (window.elegantNotifications) {
                    window.elegantNotifications.show('✅ Ubicación actualizada', 'success');
                }
            } else {
                alert('❌ No se encontró la dirección');
            }
        } catch (error) {
            console.error('Error buscando dirección:', error);
            alert('❌ Error al buscar la dirección');
        }
    },
    
    /**
     * Buscar en mapa
     */
    async buscarEnMapa() {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                alert('❌ Error de conexión');
                return;
            }
            
            const tipo = document.getElementById('filtro-tipo-mapa').value;
            const categoria = document.getElementById('filtro-categoria-mapa').value;
            
            // Limpiar marcadores anteriores
            this.limpiarMarcadores();
            
            let resultados = [];
            
            if (tipo === 'tiendas') {
                // Buscar tiendas
                let query = supabase.from('tiendas').select('*').eq('activo', true);
                const { data, error } = await query;
                
                if (!error && data) {
                    resultados = data.map(tienda => ({
                        id: tienda.id,
                        nombre: tienda.nombre,
                        tipo: 'tienda',
                        lat: tienda.lat || null,
                        lng: tienda.lng || null,
                        direccion: tienda.direccion || '',
                        telefono: tienda.telefono || '',
                        imagen: tienda.logo_url || ''
                    }));
                }
            } else {
                // Buscar productos o servicios
                const tabla = tipo === 'productos' ? 'productos' : 'servicios';
                let query = supabase.from(tabla).select('*, tiendas(nombre, lat, lng, direccion)').eq('activo', true);
                
                if (categoria) {
                    query = query.eq('categoria', categoria);
                }
                
                const { data, error } = await query;
                
                if (!error && data) {
                    resultados = data.map(item => ({
                        id: item.id,
                        nombre: item.nombre,
                        tipo: tipo.slice(0, -1), // 'producto' o 'servicio'
                        precio: item.precio,
                        categoria: item.categoria,
                        lat: item.tiendas?.lat || null,
                        lng: item.tiendas?.lng || null,
                        direccion: item.tiendas?.direccion || '',
                        tienda: item.tiendas?.nombre || '',
                        imagen: item.imagen_url || item.imagen_principal || ''
                    }));
                }
            }
            
            // Filtrar por distancia
            const resultadosFiltrados = resultados
                .filter(item => item.lat && item.lng)
                .map(item => {
                    const distancia = this.calcularDistancia(this.ubicacionUsuario, { lat: item.lat, lng: item.lng });
                    return { ...item, distancia };
                })
                .filter(item => item.distancia <= this.radioBusqueda)
                .sort((a, b) => a.distancia - b.distancia);
            
            // Mostrar en mapa
            this.mostrarResultadosEnMapa(resultadosFiltrados);
            
            // Mostrar lista
            this.mostrarResultadosLista(resultadosFiltrados);
            
        } catch (error) {
            console.error('Error buscando en mapa:', error);
            alert('❌ Error al buscar');
        }
    },
    
    /**
     * Calcular distancia (Haversine)
     */
    calcularDistancia(ubicacion1, ubicacion2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = ((ubicacion2.lat - ubicacion1.lat) * Math.PI) / 180;
        const dLng = ((ubicacion2.lng - ubicacion1.lng) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos((ubicacion1.lat * Math.PI) / 180) * Math.cos((ubicacion2.lat * Math.PI) / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },
    
    /**
     * Mostrar resultados en mapa
     */
    mostrarResultadosEnMapa(resultados) {
        if (!this.mapa) return;
        
        resultados.forEach((resultado, index) => {
            const color = resultado.tipo === 'tienda' ? '#10B981' : 
                         resultado.tipo === 'producto' ? '#3B82F6' : '#8B5CF6';
            
            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(this.generarPopupHTML(resultado));
            
            const marcador = new mapboxgl.Marker({ color })
                .setLngLat([resultado.lng, resultado.lat])
                .setPopup(popup)
                .addTo(this.mapa);
            
            this.marcadores.push(marcador);
        });
        
        // Ajustar vista si hay resultados
        if (resultados.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            resultados.forEach(r => bounds.extend([r.lng, r.lat]));
            this.mapa.fitBounds(bounds, { padding: 50 });
        }
    },
    
    /**
     * Generar HTML del popup
     */
    generarPopupHTML(resultado) {
        return `
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #1F2937;">${resultado.nombre}</h4>
                ${resultado.precio ? `<p style="margin: 0 0 8px 0; color: #8B5CF6; font-weight: 700; font-size: 18px;">$${resultado.precio.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>` : ''}
                ${resultado.tienda ? `<p style="margin: 0 0 8px 0; color: #6B7280; font-size: 13px;"><i class="fas fa-store"></i> ${resultado.tienda}</p>` : ''}
                <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 12px;"><i class="fas fa-map-marker-alt"></i> ${resultado.distancia.toFixed(1)} km</p>
                ${resultado.direccion ? `<p style="margin: 0; color: #9CA3AF; font-size: 11px;">${resultado.direccion}</p>` : ''}
            </div>
        `;
    },
    
    /**
     * Mostrar resultados en lista
     */
    mostrarResultadosLista(resultados) {
        const container = document.getElementById('resultados-mapa');
        const contador = document.getElementById('contador-resultados-mapa');
        
        if (contador) {
            contador.textContent = resultados.length;
        }
        
        if (resultados.length === 0) {
            container.innerHTML = `
                <p style="color: #6B7280; text-align: center; padding: 20px;">
                    No se encontraron resultados en el radio seleccionado
                </p>
            `;
            return;
        }
        
        container.innerHTML = resultados.map((resultado, index) => `
            <div onclick="SistemaBusquedaMapaCompradores.centrarEnMarcador(${index})" 
                 style="background: white; padding: 15px; border-radius: 12px; border: 2px solid #E5E7EB; cursor: pointer; transition: all 0.2s;"
                 onmouseover="this.style.borderColor='#3B82F6'; this.style.transform='translateX(5px)'"
                 onmouseout="this.style.borderColor='#E5E7EB'; this.style.transform='translateX(0)'">
                <div style="display: flex; gap: 12px; align-items: start;">
                    ${resultado.imagen ? `
                        <img src="${resultado.imagen}" alt="${resultado.nombre}" 
                             style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    ` : `
                        <div style="width: 60px; height: 60px; background: #E5E7EB; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-${resultado.tipo === 'tienda' ? 'store' : resultado.tipo === 'producto' ? 'box' : 'tools'}" style="font-size: 24px; color: #9CA3AF;"></i>
                        </div>
                    `}
                    <div style="flex: 1;">
                        <h5 style="margin: 0 0 5px 0; font-size: 14px; font-weight: 600; color: #1F2937;">${resultado.nombre}</h5>
                        ${resultado.precio ? `<p style="margin: 0 0 5px 0; color: #8B5CF6; font-weight: 700;">$${resultado.precio.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>` : ''}
                        ${resultado.tienda ? `<p style="margin: 0 0 5px 0; color: #6B7280; font-size: 12px;"><i class="fas fa-store"></i> ${resultado.tienda}</p>` : ''}
                        <p style="margin: 0; color: #9CA3AF; font-size: 11px;"><i class="fas fa-map-marker-alt"></i> ${resultado.distancia.toFixed(1)} km</p>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    /**
     * Centrar en marcador
     */
    centrarEnMarcador(index) {
        if (this.marcadores[index] && this.mapa) {
            const lngLat = this.marcadores[index].getLngLat();
            this.mapa.flyTo({
                center: [lngLat.lng, lngLat.lat],
                zoom: 15
            });
            this.marcadores[index].togglePopup();
        }
    },
    
    /**
     * Limpiar marcadores
     */
    limpiarMarcadores() {
        this.marcadores.forEach(marcador => marcador.remove());
        this.marcadores = [];
    },
    
    /**
     * Cargar categorías
     */
    async cargarCategorias() {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return;
            
            const { data } = await supabase
                .from('categorias')
                .select('nombre')
                .order('nombre');
            
            const select = document.getElementById('filtro-categoria-mapa');
            if (select && data) {
                data.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.nombre;
                    option.textContent = cat.nombre;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error cargando categorías:', error);
        }
    }
};

// Hacer disponible globalmente
window.SistemaBusquedaMapaCompradores = SistemaBusquedaMapaCompradores;

// Función para cerrar modal
function cerrarModalBusquedaMapa() {
    const modal = document.getElementById('modal-busqueda-mapa');
    if (modal) {
        // Limpiar mapa
        if (window.SistemaBusquedaMapaCompradores.mapa) {
            window.SistemaBusquedaMapaCompradores.mapa.remove();
            window.SistemaBusquedaMapaCompradores.mapa = null;
        }
        window.SistemaBusquedaMapaCompradores.limpiarMarcadores();
        modal.remove();
    }
}

window.cerrarModalBusquedaMapa = cerrarModalBusquedaMapa;
