// ===== SISTEMA DE UBICACIÓN - CRESALIA =====
// Para que cada tienda agregue su ubicación física

class SistemaUbicacion {
    constructor(tenantSlug) {
        this.tenantSlug = tenantSlug;
        this.ubicacion = this.cargarUbicacion();
        this.mapa = null;
        this.marcador = null;
    }

    // Cargar ubicación guardada
    cargarUbicacion() {
        const stored = localStorage.getItem(`${this.tenantSlug}_ubicacion`);
        return stored ? JSON.parse(stored) : null;
    }

    // Guardar ubicación
    guardarUbicacion(ubicacion) {
        localStorage.setItem(`${this.tenantSlug}_ubicacion`, JSON.stringify(ubicacion));
        this.ubicacion = ubicacion;

        // Sincronizar con backend
        this.sincronizarConBackend();
    }

    // Formulario para agregar ubicación (para admin)
    crearFormularioUbicacion() {
        const form = document.createElement('div');
        form.className = 'ubicacion-form-container';
        form.innerHTML = `
            <div class="ubicacion-form">
                <div class="form-header">
                    <h2>
                        <i class="fas fa-map-marker-alt"></i>
                        Ubicación de Tu Tienda
                    </h2>
                    <p>Ayudá a tus clientes a encontrarte</p>
                </div>

                <div class="form-body">
                    <!-- Dirección completa -->
                    <div class="form-group">
                        <label for="ubicacion-direccion">
                            <i class="fas fa-home"></i>
                            Dirección Completa *
                        </label>
                        <input 
                            type="text" 
                            id="ubicacion-direccion"
                            class="form-input"
                            placeholder="Ej: Av. Corrientes 1234"
                            value="${this.ubicacion?.direccion || ''}"
                        >
                    </div>

                    <!-- Ciudad -->
                    <div class="form-group">
                        <label for="ubicacion-ciudad">
                            <i class="fas fa-city"></i>
                            Ciudad *
                        </label>
                        <input 
                            type="text" 
                            id="ubicacion-ciudad"
                            class="form-input"
                            placeholder="Ej: Buenos Aires"
                            value="${this.ubicacion?.ciudad || ''}"
                        >
                    </div>

                    <!-- Provincia/Estado -->
                    <div class="form-group">
                        <label for="ubicacion-provincia">
                            <i class="fas fa-map"></i>
                            Provincia/Estado
                        </label>
                        <input 
                            type="text" 
                            id="ubicacion-provincia"
                            class="form-input"
                            placeholder="Ej: CABA"
                            value="${this.ubicacion?.provincia || ''}"
                        >
                    </div>

                    <!-- Código Postal -->
                    <div class="form-group">
                        <label for="ubicacion-cp">
                            <i class="fas fa-envelope"></i>
                            Código Postal
                        </label>
                        <input 
                            type="text" 
                            id="ubicacion-cp"
                            class="form-input"
                            placeholder="Ej: C1043"
                            value="${this.ubicacion?.codigoPostal || ''}"
                        >
                    </div>

                    <!-- País -->
                    <div class="form-group">
                        <label for="ubicacion-pais">
                            <i class="fas fa-globe-americas"></i>
                            País
                        </label>
                        <select id="ubicacion-pais" class="form-select">
                            <option value="AR" ${this.ubicacion?.pais === 'AR' ? 'selected' : ''}>Argentina 🇦🇷</option>
                            <option value="CL" ${this.ubicacion?.pais === 'CL' ? 'selected' : ''}>Chile 🇨🇱</option>
                            <option value="UY" ${this.ubicacion?.pais === 'UY' ? 'selected' : ''}>Uruguay 🇺🇾</option>
                            <option value="PY" ${this.ubicacion?.pais === 'PY' ? 'selected' : ''}>Paraguay 🇵🇾</option>
                            <option value="BO" ${this.ubicacion?.pais === 'BO' ? 'selected' : ''}>Bolivia 🇧🇴</option>
                            <option value="PE" ${this.ubicacion?.pais === 'PE' ? 'selected' : ''}>Perú 🇵🇪</option>
                            <option value="CO" ${this.ubicacion?.pais === 'CO' ? 'selected' : ''}>Colombia 🇨🇴</option>
                            <option value="EC" ${this.ubicacion?.pais === 'EC' ? 'selected' : ''}>Ecuador 🇪🇨</option>
                            <option value="MX" ${this.ubicacion?.pais === 'MX' ? 'selected' : ''}>México 🇲🇽</option>
                            <option value="ES" ${this.ubicacion?.pais === 'ES' ? 'selected' : ''}>España 🇪🇸</option>
                        </select>
                    </div>

                    <!-- Teléfono -->
                    <div class="form-group">
                        <label for="ubicacion-telefono">
                            <i class="fas fa-phone"></i>
                            Teléfono de Contacto
                        </label>
                        <input 
                            type="tel" 
                            id="ubicacion-telefono"
                            class="form-input"
                            placeholder="Ej: +54 9 11 1234-5678"
                            value="${this.ubicacion?.telefono || ''}"
                        >
                    </div>

                    <!-- Horarios -->
                    <div class="form-group">
                        <label for="ubicacion-horarios">
                            <i class="fas fa-clock"></i>
                            Horarios de Atención
                        </label>
                        <textarea 
                            id="ubicacion-horarios"
                            class="form-textarea"
                            rows="3"
                            placeholder="Ej: Lun a Vie 9:00 - 18:00&#10;Sábados 10:00 - 14:00"
                        >${this.ubicacion?.horarios || ''}</textarea>
                    </div>

                    <!-- Instrucciones adicionales -->
                    <div class="form-group">
                        <label for="ubicacion-instrucciones">
                            <i class="fas fa-info-circle"></i>
                            Instrucciones para Llegar (Opcional)
                        </label>
                        <textarea 
                            id="ubicacion-instrucciones"
                            class="form-textarea"
                            rows="3"
                            placeholder="Ej: Entrar por la puerta lateral, timbre 3B"
                        >${this.ubicacion?.instrucciones || ''}</textarea>
                    </div>

                    <!-- Mapa interactivo -->
                    <div class="form-group">
                        <label>
                            <i class="fas fa-map"></i>
                            Ubicá tu tienda en el mapa
                        </label>
                        <div id="mapa-container" class="mapa-container">
                            <div id="mapa" class="mapa"></div>
                        </div>
                        <p class="form-help">
                            💡 Hacé clic en el mapa o buscá tu dirección
                        </p>
                    </div>

                    <!-- Buscador de dirección -->
                    <div class="form-group">
                        <label>
                            <i class="fas fa-search"></i>
                            Buscar Dirección
                        </label>
                        <div class="buscar-direccion">
                            <input 
                                type="text" 
                                id="buscar-direccion-input"
                                class="form-input"
                                placeholder="Buscar dirección en el mapa..."
                            >
                            <button 
                                class="btn-buscar-direccion"
                                onclick="window.ubicacionManager.buscarDireccion()"
                            >
                                <i class="fas fa-search"></i>
                                Buscar
                            </button>
                        </div>
                    </div>

                    <!-- Opciones de visibilidad -->
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input 
                                type="checkbox" 
                                id="ubicacion-mostrar"
                                ${this.ubicacion?.mostrar !== false ? 'checked' : ''}
                            >
                            <span>
                                <i class="fas fa-eye"></i>
                                Mostrar ubicación en mi tienda
                            </span>
                        </label>
                        <p class="form-help">
                            Si está marcado, los clientes verán tu ubicación y mapa
                        </p>
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input 
                                type="checkbox" 
                                id="ubicacion-retiro"
                                ${this.ubicacion?.permitirRetiro ? 'checked' : ''}
                            >
                            <span>
                                <i class="fas fa-store"></i>
                                Permitir retiro en tienda
                            </span>
                        </label>
                        <p class="form-help">
                            Los clientes podrán elegir retirar en tu local
                        </p>
                    </div>
                </div>

                <div class="form-footer">
                    <button 
                        class="btn-guardar-ubicacion"
                        onclick="window.ubicacionManager.guardarFormulario()"
                    >
                        <i class="fas fa-save"></i>
                        Guardar Ubicación
                    </button>
                </div>
            </div>

            ${this.getStyles()}
        `;

        // Inicializar mapa después de insertar en DOM
        setTimeout(() => {
            this.inicializarMapa();
        }, 100);

        return form;
    }

    // Inicializar mapa (Google Maps o OpenStreetMap)
    inicializarMapa() {
        const mapaDiv = document.getElementById('mapa');
        if (!mapaDiv) return;

        // Coordenadas por defecto (Buenos Aires)
        const latDefault = this.ubicacion?.lat || -34.6037;
        const lngDefault = this.ubicacion?.lng || -58.3816;

        // Usar Leaflet (OpenStreetMap - gratis)
        if (typeof L !== 'undefined') {
            this.mapa = L.map('mapa').setView([latDefault, lngDefault], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.mapa);

            this.marcador = L.marker([latDefault, lngDefault], {
                draggable: true
            }).addTo(this.mapa);

            // Actualizar coordenadas al arrastrar
            this.marcador.on('dragend', (e) => {
                const pos = e.target.getLatLng();
                this.ubicacion = {
                    ...this.ubicacion,
                    lat: pos.lat,
                    lng: pos.lng
                };
            });

            // Agregar marcador al hacer clic
            this.mapa.on('click', (e) => {
                const pos = e.latlng;
                if (this.marcador) {
                    this.marcador.setLatLng(pos);
                }
                this.ubicacion = {
                    ...this.ubicacion,
                    lat: pos.lat,
                    lng: pos.lng
                };
            });
        } else {
            // Fallback: mostrar instrucción para agregar Leaflet
            mapaDiv.innerHTML = `
                <div class="mapa-fallback">
                    <i class="fas fa-map-marked-alt"></i>
                    <p>Para usar el mapa, agregá Leaflet en tu HTML:</p>
                    <code>&lt;link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" /&gt;</code>
                    <code>&lt;script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"&gt;&lt;/script&gt;</code>
                </div>
            `;
        }
    }

    // Buscar dirección en el mapa
    async buscarDireccion() {
        const input = document.getElementById('buscar-direccion-input');
        const direccion = input.value;

        if (!direccion) {
            alert('Por favor ingresá una dirección para buscar');
            return;
        }

        try {
            // Usar Nominatim (OpenStreetMap geocoding - gratis)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`
            );
            const results = await response.json();

            if (results.length > 0) {
                const { lat, lon, display_name } = results[0];
                
                // Centrar mapa
                if (this.mapa) {
                    this.mapa.setView([lat, lon], 15);
                    if (this.marcador) {
                        this.marcador.setLatLng([lat, lon]);
                    }
                }

                // Guardar coordenadas
                this.ubicacion = {
                    ...this.ubicacion,
                    lat: parseFloat(lat),
                    lng: parseFloat(lon)
                };

                this.mostrarNotificacion('✅ Ubicación encontrada: ' + display_name, 'success');
            } else {
                this.mostrarNotificacion('No se encontró la dirección. Intentá con otra búsqueda.', 'warning');
            }
        } catch (error) {
            console.error('Error buscando dirección:', error);
            this.mostrarNotificacion('Error al buscar dirección', 'error');
        }
    }

    // Guardar formulario
    guardarFormulario() {
        const ubicacion = {
            direccion: document.getElementById('ubicacion-direccion').value,
            ciudad: document.getElementById('ubicacion-ciudad').value,
            provincia: document.getElementById('ubicacion-provincia').value,
            codigoPostal: document.getElementById('ubicacion-cp').value,
            pais: document.getElementById('ubicacion-pais').value,
            telefono: document.getElementById('ubicacion-telefono').value,
            horarios: document.getElementById('ubicacion-horarios').value,
            instrucciones: document.getElementById('ubicacion-instrucciones').value,
            mostrar: document.getElementById('ubicacion-mostrar').checked,
            permitirRetiro: document.getElementById('ubicacion-retiro').checked,
            lat: this.ubicacion?.lat || null,
            lng: this.ubicacion?.lng || null
        };

        // Validar campos requeridos
        if (!ubicacion.direccion || !ubicacion.ciudad) {
            this.mostrarNotificacion('Por favor completá dirección y ciudad', 'error');
            return;
        }

        this.guardarUbicacion(ubicacion);
        this.mostrarNotificacion('💜 Ubicación guardada exitosamente', 'success');
    }

    // Widget de ubicación para mostrar en la tienda (para clientes)
    crearWidgetUbicacion() {
        if (!this.ubicacion || !this.ubicacion.mostrar) {
            return null;
        }

        const widget = document.createElement('div');
        widget.className = 'ubicacion-widget';
        widget.innerHTML = `
            <div class="widget-header">
                <h3>
                    <i class="fas fa-map-marker-alt"></i>
                    Nuestra Ubicación
                </h3>
            </div>

            <div class="widget-body">
                <!-- Dirección -->
                <div class="ubicacion-info">
                    <div class="info-item">
                        <i class="fas fa-home"></i>
                        <div>
                            <strong>${this.ubicacion.direccion}</strong><br>
                            ${this.ubicacion.ciudad}${this.ubicacion.provincia ? ', ' + this.ubicacion.provincia : ''}
                            ${this.ubicacion.codigoPostal ? ' (' + this.ubicacion.codigoPostal + ')' : ''}
                        </div>
                    </div>

                    ${this.ubicacion.telefono ? `
                        <div class="info-item">
                            <i class="fas fa-phone"></i>
                            <div>
                                <a href="tel:${this.ubicacion.telefono}">${this.ubicacion.telefono}</a>
                            </div>
                        </div>
                    ` : ''}

                    ${this.ubicacion.horarios ? `
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <pre>${this.ubicacion.horarios}</pre>
                            </div>
                        </div>
                    ` : ''}

                    ${this.ubicacion.instrucciones ? `
                        <div class="info-item">
                            <i class="fas fa-info-circle"></i>
                            <div>
                                <em>${this.ubicacion.instrucciones}</em>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Mapa pequeño -->
                ${this.ubicacion.lat && this.ubicacion.lng ? `
                    <div class="ubicacion-mapa-mini" id="mapa-mini"></div>
                    <div class="ubicacion-actions">
                        <a 
                            href="https://www.google.com/maps/search/?api=1&query=${this.ubicacion.lat},${this.ubicacion.lng}"
                            target="_blank"
                            class="btn-como-llegar"
                        >
                            <i class="fas fa-directions"></i>
                            Cómo llegar
                        </a>
                        ${this.ubicacion.permitirRetiro ? `
                            <span class="badge-retiro">
                                <i class="fas fa-store"></i>
                                Retiro en tienda
                            </span>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        // Inicializar mapa mini después
        if (this.ubicacion.lat && this.ubicacion.lng) {
            setTimeout(() => this.inicializarMapaMini(), 100);
        }

        return widget;
    }

    // Mapa mini para mostrar en la tienda
    inicializarMapaMini() {
        const mapaMini = document.getElementById('mapa-mini');
        if (!mapaMini || typeof L === 'undefined') return;

        const mapa = L.map('mapa-mini', {
            scrollWheelZoom: false,
            dragging: false,
            zoomControl: false
        }).setView([this.ubicacion.lat, this.ubicacion.lng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(mapa);

        L.marker([this.ubicacion.lat, this.ubicacion.lng]).addTo(mapa);
    }

    // Sincronizar con backend
    async sincronizarConBackend() {
        if (!window.usuario?.token) return;

        try {
            await fetch(`/api/ubicacion/${this.tenantSlug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.usuario.token}`
                },
                body: JSON.stringify(this.ubicacion)
            });
        } catch (error) {
            console.error('Error sincronizando ubicación:', error);
        }
    }

    // Notificaciones
    mostrarNotificacion(mensaje, tipo = 'info') {
        const notif = document.createElement('div');
        notif.className = `ubicacion-notificacion ${tipo}`;
        notif.textContent = mensaje;
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // Estilos
    getStyles() {
        return `
        <style>
            .ubicacion-form-container {
                max-width: 900px;
                margin: 0 auto;
                padding: 20px;
            }

            .ubicacion-form {
                background: white;
                border-radius: 20px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                overflow: hidden;
            }

            .form-header {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                padding: 32px;
                text-align: center;
            }

            .form-header h2 {
                font-size: 28px;
                margin: 0 0 8px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }

            .form-header p {
                margin: 0;
                opacity: 0.95;
            }

            .form-body {
                padding: 32px;
            }

            .form-group {
                margin-bottom: 24px;
            }

            .form-group label {
                display: block;
                font-weight: 600;
                color: #1F2937;
                margin-bottom: 8px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .form-group label i {
                color: #7C3AED;
            }

            .form-input, .form-select, .form-textarea {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #E5E7EB;
                border-radius: 10px;
                font-size: 14px;
                font-family: inherit;
                transition: all 0.2s;
            }

            .form-input:focus, .form-select:focus, .form-textarea:focus {
                outline: none;
                border-color: #7C3AED;
                box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
            }

            .form-textarea {
                resize: vertical;
                font-family: inherit;
            }

            .form-help {
                font-size: 13px;
                color: #6B7280;
                margin-top: 6px;
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                padding: 12px;
                background: #F9FAFB;
                border-radius: 10px;
                transition: all 0.2s;
            }

            .checkbox-label:hover {
                background: #F3F4F6;
            }

            .checkbox-label input[type="checkbox"] {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .checkbox-label span {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                color: #1F2937;
            }

            /* Mapa */
            .mapa-container {
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid #E5E7EB;
                margin-top: 8px;
            }

            .mapa {
                width: 100%;
                height: 400px;
            }

            .mapa-fallback {
                padding: 40px;
                text-align: center;
                background: #F9FAFB;
            }

            .mapa-fallback i {
                font-size: 48px;
                color: #7C3AED;
                margin-bottom: 16px;
            }

            .mapa-fallback code {
                display: block;
                background: #1F2937;
                color: #10B981;
                padding: 12px;
                border-radius: 8px;
                margin: 8px 0;
                font-size: 12px;
                text-align: left;
                overflow-x: auto;
            }

            /* Buscador */
            .buscar-direccion {
                display: flex;
                gap: 12px;
            }

            .btn-buscar-direccion {
                padding: 12px 24px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s;
                white-space: nowrap;
            }

            .btn-buscar-direccion:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            }

            /* Footer */
            .form-footer {
                padding: 24px 32px;
                background: #F9FAFB;
                border-top: 2px solid #E5E7EB;
            }

            .btn-guardar-ubicacion {
                width: 100%;
                padding: 16px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.3s;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            }

            .btn-guardar-ubicacion:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
            }

            /* Widget para clientes */
            .ubicacion-widget {
                background: white;
                border-radius: 16px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                overflow: hidden;
                margin: 32px 0;
            }

            .widget-header {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                padding: 20px;
            }

            .widget-header h3 {
                margin: 0;
                font-size: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .widget-body {
                padding: 24px;
            }

            .ubicacion-info {
                margin-bottom: 20px;
            }

            .info-item {
                display: flex;
                gap: 14px;
                margin-bottom: 16px;
                padding: 12px;
                background: #F9FAFB;
                border-radius: 10px;
            }

            .info-item i {
                color: #7C3AED;
                font-size: 20px;
                flex-shrink: 0;
                margin-top: 2px;
            }

            .info-item strong {
                color: #1F2937;
            }

            .info-item a {
                color: #7C3AED;
                text-decoration: none;
                font-weight: 600;
            }

            .info-item pre {
                margin: 0;
                font-family: inherit;
                white-space: pre-wrap;
                color: #6B7280;
            }

            .ubicacion-mapa-mini {
                width: 100%;
                height: 250px;
                border-radius: 12px;
                overflow: hidden;
                margin-bottom: 16px;
            }

            .ubicacion-actions {
                display: flex;
                gap: 12px;
                align-items: center;
                flex-wrap: wrap;
            }

            .btn-como-llegar {
                flex: 1;
                padding: 14px 24px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.3s;
            }

            .btn-como-llegar:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            }

            .badge-retiro {
                padding: 10px 20px;
                background: #D1FAE5;
                color: #065F46;
                border-radius: 50px;
                font-weight: 600;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            /* Notificación */
            .ubicacion-notificacion {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                z-index: 10000;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 400px;
            }

            .ubicacion-notificacion.show {
                transform: translateY(0);
                opacity: 1;
            }

            .ubicacion-notificacion.success {
                border-left: 4px solid #10B981;
            }

            .ubicacion-notificacion.error {
                border-left: 4px solid #EF4444;
            }

            .ubicacion-notificacion.warning {
                border-left: 4px solid #F59E0B;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .form-body {
                    padding: 20px;
                }

                .buscar-direccion {
                    flex-direction: column;
                }

                .btn-buscar-direccion {
                    width: 100%;
                    justify-content: center;
                }

                .mapa {
                    height: 300px;
                }

                .ubicacion-actions {
                    flex-direction: column;
                }

                .btn-como-llegar {
                    width: 100%;
                }
            }
        </style>
        `;
    }
}

// Inicializar globalmente
window.initUbicacion = function(tenantSlug) {
    window.ubicacionManager = new SistemaUbicacion(tenantSlug);
    return window.ubicacionManager;
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SistemaUbicacion };
}


