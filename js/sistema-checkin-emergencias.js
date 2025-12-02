// ===== SISTEMA DE CHECK-IN AUTOMÁTICO DE EMERGENCIAS =====
// Pregunta automáticamente "¿Estás bien?" después de desastres naturales
// Co-fundadores: Crisla & Claude

class SistemaCheckinEmergencias {
    constructor() {
        this.supabase = null;
        this.usuarioHash = null;
        this.campanaActiva = null;
        this.ubicacionUsuario = null;
        this.estaEnZonaAfectada = false;
        this.init();
    }
    
    async init() {
        // Inicializar Supabase
        if (typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
            try {
                const config = window.SUPABASE_CONFIG;
                if (config.url && config.anonKey && !config.anonKey.includes('REEMPLAZA')) {
                    this.supabase = window.supabase.createClient(config.url, config.anonKey);
                    console.log('✅ Sistema Check-in Emergencias: Supabase inicializado');
                }
            } catch (error) {
                console.error('❌ Error inicializando Supabase:', error);
            }
        }
        
        // Generar hash de usuario
        this.usuarioHash = this.generarHashUsuario();
        
        // Solicitar permiso de ubicación (SOLO para detectar desastres naturales)
        // Lo hacemos al inicio para que el usuario ya tenga el permiso cuando se necesite
        if (navigator.geolocation && Notification.permission !== 'denied') {
            // Solo solicitar si no se ha pedido antes o si fue denegado
            const ubicacionPermitida = localStorage.getItem('cresalia_ubicacion_permitida');
            if (!ubicacionPermitida) {
                // Mostrar mensaje explicativo antes de solicitar
                console.log('📍 Sistema Check-in: Se solicitará permiso de ubicación para detectar desastres naturales en tu zona');
                // No solicitamos inmediatamente, lo hacemos cuando se necesita
            }
        }
        
        // Verificar si hay campañas activas y si ya hizo check-in
        await this.verificarCampanasActivas();
    }
    
    generarHashUsuario() {
        let hash = localStorage.getItem('cresalia_checkin_hash');
        if (!hash) {
            const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
            hash = btoa(random).substring(0, 32);
            localStorage.setItem('cresalia_checkin_hash', hash);
        }
        return hash;
    }
    
    // ===== VERIFICAR CAMPAÑAS ACTIVAS =====
    async verificarCampanasActivas() {
        if (!this.supabase) return;
        
        try {
            // Buscar campañas activas y verificadas
            const { data: campanas, error } = await this.supabase
                .from('campañas_emergencia')
                .select('*')
                .eq('estado', 'activa')
                .eq('verificada', true)
                .order('fecha_desastre', { ascending: false })
                .limit(1);
            
            if (error) throw error;
            
            if (campanas && campanas.length > 0) {
                this.campanaActiva = campanas[0];
                
                // Verificar si ya hizo check-in para esta campaña
                const yaHizoCheckin = await this.verificarCheckinExistente(this.campanaActiva.id);
                
                if (!yaHizoCheckin) {
                    // Esperar un poco para que la página cargue
                    setTimeout(() => {
                        // Mostrar modal de consentimiento previo para verificar ubicación
                        this.mostrarModalConsentimiento();
                    }, 3000); // 3 segundos después de cargar la página
                }
            }
        } catch (error) {
            // Solo mostrar error en consola si es crítico, no bloquear la ejecución
            if (error.message && !error.message.includes('network') && !error.message.includes('timeout')) {
                console.error('Error verificando campañas:', error);
            } else {
                console.warn('⚠️ No se pudo verificar campañas activas (puede ser un problema de conexión):', error.message || error);
            }
        }
    }
    
    // ===== VERIFICAR SI YA HIZO CHECK-IN =====
    async verificarCheckinExistente(campanaId) {
        if (!this.supabase) return false;
        
        try {
            const { data, error } = await this.supabase
                .from('checkin_emergencias')
                .select('id')
                .eq('campaña_id', campanaId)
                .eq('usuario_hash', this.usuarioHash)
                .limit(1);
            
            if (error) throw error;
            
            return data && data.length > 0;
        } catch (error) {
            console.error('Error verificando check-in:', error);
            return false;
        }
    }
    
    // ===== CALCULAR DISTANCIA ENTRE DOS PUNTOS (Fórmula de Haversine) =====
    calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radio de la Tierra en kilómetros
        const dLat = this.gradosARadianes(lat2 - lat1);
        const dLon = this.gradosARadianes(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.gradosARadianes(lat1)) * Math.cos(this.gradosARadianes(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en kilómetros
    }
    
    gradosARadianes(grados) {
        return grados * (Math.PI / 180);
    }
    
    // ===== VERIFICAR SI ESTÁ EN ZONA AFECTADA =====
    async verificarSiEstaEnZona(ubicacionUsuario, campana) {
        if (!ubicacionUsuario || !campana) return false;
        
        // Si la campaña tiene coordenadas específicas
        if (campana.latitud && campana.longitud) {
            const distancia = this.calcularDistancia(
                ubicacionUsuario.latitud,
                ubicacionUsuario.longitud,
                campana.latitud,
                campana.longitud
            );
            
            // Radio de afectación (por defecto 50km, o el especificado en la campaña)
            const radioAfectacion = campana.radio_afectacion_km || 50;
            
            return distancia <= radioAfectacion;
        }
        
        // Si no hay coordenadas, asumimos que está en zona si aceptó verificar
        // (mejor mostrar el modal para estar seguros)
        return true;
    }
    
    // ===== MOSTRAR MODAL DE CONSENTIMIENTO PREVIO =====
    mostrarModalConsentimiento() {
        // Evitar mostrar múltiples modales
        if (document.getElementById('modal-consentimiento-ubicacion')) return;
        
        if (!this.campanaActiva) return;
        
        const iconosDesastres = {
            'inundacion': '🌊',
            'incendio': '🔥',
            'terremoto': '🌍',
            'tornado': '🌪️',
            'tormenta': '⛈️',
            'otro_desastre': '🚨'
        };
        
        const nombresDesastres = {
            'inundacion': 'Inundación',
            'incendio': 'Incendio',
            'terremoto': 'Terremoto',
            'tornado': 'Tornado',
            'tormenta': 'Tormenta',
            'otro_desastre': 'Desastre Natural'
        };
        
        const icono = iconosDesastres[this.campanaActiva.tipo_desastre] || '🚨';
        const nombre = nombresDesastres[this.campanaActiva.tipo_desastre] || 'Desastre Natural';
        
        const modal = document.createElement('div');
        modal.id = 'modal-consentimiento-ubicacion';
        modal.className = 'modal-consentimiento-ubicacion';
        modal.innerHTML = `
            <div class="modal-consentimiento-content">
                <div class="modal-consentimiento-header">
                    <div>
                        <h2>${icono} ${this.escapeHtml(this.campanaActiva.titulo)}</h2>
                        <p class="modal-consentimiento-subtitle">${nombre} en ${this.escapeHtml(this.campanaActiva.ubicacion)}</p>
                    </div>
                </div>
                
                <div class="modal-consentimiento-body">
                    <div class="mensaje-consentimiento">
                        <p>🚨 <strong>Hay una emergencia en ${this.escapeHtml(this.campanaActiva.ubicacion)}.</strong></p>
                        <p>¿Querés que verifiquemos si estás cerca para ayudarte?</p>
                        <p style="font-size: 0.9rem; color: #6B7280; margin-top: 15px;">
                            💜 Solo usaremos tu ubicación para verificar si estás en la zona afectada y poder ayudarte mejor. 
                            Tu privacidad está protegida.
                        </p>
                    </div>
                    
                    <div class="consentimiento-options">
                        <button class="btn-consentimiento aceptar" onclick="window.checkinEmergencias?.aceptarVerificacionUbicacion()">
                            <i class="fas fa-check-circle"></i>
                            <strong>Sí, verificar</strong>
                            <small>Verificaré si estoy en la zona</small>
                        </button>
                        
                        <button class="btn-consentimiento rechazar" onclick="window.checkinEmergencias?.rechazarVerificacionUbicacion()">
                            <i class="fas fa-times-circle"></i>
                            <strong>No, gracias</strong>
                            <small>Prefiero hacer check-in manualmente</small>
                        </button>
                        
                        <button class="btn-consentimiento ya-hice" onclick="window.checkinEmergencias?.yaHiceCheckin()">
                            <i class="fas fa-check"></i>
                            <strong>Ya hice check-in</strong>
                            <small>Ya confirmé que estoy bien</small>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Agregar estilos si no existen
        this.agregarEstilosConsentimiento();
        
        // Mostrar modal con animación
        setTimeout(() => {
            modal.classList.add('active');
        }, 100);
    }
    
    // ===== ACEPTAR VERIFICACIÓN DE UBICACIÓN =====
    async aceptarVerificacionUbicacion() {
        // Cerrar modal de consentimiento
        this.cerrarModalConsentimiento();
        
        // Solicitar ubicación
        try {
            this.ubicacionUsuario = await this.solicitarUbicacion();
            
            if (this.ubicacionUsuario) {
                // Verificar si está en zona afectada
                this.estaEnZonaAfectada = await this.verificarSiEstaEnZona(
                    this.ubicacionUsuario,
                    this.campanaActiva
                );
                
                // Guardar ubicación en localStorage y Supabase
                this.guardarUbicacionUsuario(this.ubicacionUsuario);
                
                // Guardar que permitió ubicación
                localStorage.setItem('cresalia_ubicacion_permitida', 'true');
                
                // Mostrar modal de check-in (más urgente si está en zona)
                setTimeout(() => {
                    this.mostrarModalCheckin();
                }, 500);
            } else {
                // Si no se pudo obtener ubicación, mostrar modal genérico
                setTimeout(() => {
                    this.mostrarModalCheckin();
                }, 500);
            }
        } catch (error) {
            console.warn('Error obteniendo ubicación:', error);
            // Continuar con modal genérico
            setTimeout(() => {
                this.mostrarModalCheckin();
            }, 500);
        }
    }
    
    // ===== RECHAZAR VERIFICACIÓN DE UBICACIÓN =====
    rechazarVerificacionUbicacion() {
        // Cerrar modal de consentimiento
        this.cerrarModalConsentimiento();
        
        // Guardar preferencia
        localStorage.setItem('cresalia_ubicacion_permitida', 'false');
        
        // Mostrar modal genérico (menos intrusivo)
        setTimeout(() => {
            this.mostrarModalCheckin();
        }, 500);
    }
    
    // ===== YA HICE CHECK-IN =====
    yaHiceCheckin() {
        // Cerrar modal de consentimiento
        this.cerrarModalConsentimiento();
        
        // No mostrar nada más
    }
    
    // ===== CERRAR MODAL DE CONSENTIMIENTO =====
    cerrarModalConsentimiento() {
        const modal = document.getElementById('modal-consentimiento-ubicacion');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
    
    // ===== MOSTRAR MODAL DE CHECK-IN =====
    mostrarModalCheckin() {
        // Evitar mostrar múltiples modales
        if (document.getElementById('modal-checkin-emergencia')) return;
        
        if (!this.campanaActiva) return;
        
        const modal = document.createElement('div');
        modal.id = 'modal-checkin-emergencia';
        modal.className = `modal-checkin-emergencia ${this.estaEnZonaAfectada ? 'urgente' : ''}`;
        modal.innerHTML = this.renderizarModal();
        document.body.appendChild(modal);
        
        // Agregar estilos si no existen
        this.agregarEstilos();
        
        // Mostrar modal con animación
        setTimeout(() => {
            modal.classList.add('active');
        }, 100);
        
        // Agregar event listeners
        this.agregarEventListeners();
    }
    
    renderizarModal() {
        const iconosDesastres = {
            'inundacion': '🌊',
            'incendio': '🔥',
            'terremoto': '🌍',
            'tornado': '🌪️',
            'tormenta': '⛈️',
            'otro_desastre': '🚨'
        };
        
        const nombresDesastres = {
            'inundacion': 'Inundación',
            'incendio': 'Incendio',
            'terremoto': 'Terremoto',
            'tornado': 'Tornado',
            'tormenta': 'Tormenta',
            'otro_desastre': 'Desastre Natural'
        };
        
        const icono = iconosDesastres[this.campanaActiva.tipo_desastre] || '🚨';
        const nombre = nombresDesastres[this.campanaActiva.tipo_desastre] || 'Desastre Natural';
        
        return `
            <div class="modal-checkin-content">
                <div class="modal-checkin-header">
                    <div>
                        <h2>💜 ${icono} ${this.escapeHtml(this.campanaActiva.titulo)}</h2>
                        <p class="modal-checkin-subtitle">${nombre} en ${this.escapeHtml(this.campanaActiva.ubicacion)}</p>
                    </div>
                    <button class="cerrar-checkin" onclick="window.checkinEmergencias?.cerrarModal()">&times;</button>
                </div>
                
                <div class="modal-checkin-body">
                    <div class="mensaje-crisla ${this.estaEnZonaAfectada ? 'zona-afectada' : ''}">
                        ${this.estaEnZonaAfectada ? `
                            <div style="background: #FEF2F2; border: 2px solid #EF4444; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                                <p style="color: #DC2626; font-weight: 600; margin: 0;">
                                    ⚠️ <strong>Estás en la zona afectada.</strong> Por favor, confirmá que estás bien.
                                </p>
                            </div>
                        ` : ''}
                        <p>💜 <strong>Hola, querido usuario.</strong> Sé que puede ser difícil, pero necesito saber si estás bien.</p>
                        <p>Si necesitás ayuda, estoy acá. Tu comunidad está acá. No estás solo/a.</p>
                        <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; margin-top: 15px; border-radius: 5px; font-size: 0.9rem; color: #1E40AF;">
                            <p style="margin: 0;"><strong>📌 Importante:</strong> Por ahora, Cresalia no puede ofrecer recursos directamente. Todo depende de la solidaridad de nuestra comunidad. Te redirigiremos a las comunidades correspondientes donde podrás encontrar apoyo y ayuda.</p>
                        </div>
                        <p style="font-size: 0.85rem; color: #6B7280; margin-top: 10px;">- Crisla 💜</p>
                    </div>
                    
                    <div class="form-checkin">
                        <div class="checkin-options">
                            <button class="btn-checkin-option" data-estado="bien" onclick="window.checkinEmergencias?.seleccionarEstado('bien')">
                                <i class="fas fa-check-circle"></i>
                                <strong>Estoy bien</strong>
                                <small>No necesito ayuda</small>
                            </button>
                            
                            <button class="btn-checkin-option" data-estado="necesita_ayuda" onclick="window.checkinEmergencias?.seleccionarEstado('necesita_ayuda')">
                                <i class="fas fa-hand-holding-heart"></i>
                                <strong>Necesito ayuda</strong>
                                <small>Pero no es urgente</small>
                            </button>
                            
                            <button class="btn-checkin-option urgente" data-estado="ayuda_urgente" onclick="window.checkinEmergencias?.seleccionarEstado('ayuda_urgente')">
                                <i class="fas fa-exclamation-triangle"></i>
                                <strong>Necesito ayuda urgente</strong>
                                <small>Es una emergencia</small>
                            </button>
                            
                            <button class="btn-checkin-option" data-estado="conozco_personas" onclick="window.checkinEmergencias?.seleccionarEstado('conozco_personas')">
                                <i class="fas fa-users"></i>
                                <strong>Conozco personas que no están bien</strong>
                                <small>Necesitan ayuda</small>
                            </button>
                        </div>
                        
                        <div id="detallesAyuda" style="display: none; margin-top: 20px;">
                            <div class="form-group">
                                <label>¿Qué tipo de ayuda necesitás? *</label>
                                <div class="ayuda-options">
                                    <label class="checkbox-option">
                                        <input type="checkbox" value="alimentos" name="tipo_ayuda">
                                        <span>🍞 Alimentos</span>
                                    </label>
                                    <label class="checkbox-option">
                                        <input type="checkbox" value="agua" name="tipo_ayuda">
                                        <span>💧 Agua</span>
                                    </label>
                                    <label class="checkbox-option">
                                        <input type="checkbox" value="refugio" name="tipo_ayuda">
                                        <span>🏠 Refugio</span>
                                    </label>
                                    <label class="checkbox-option">
                                        <input type="checkbox" value="medicamentos" name="tipo_ayuda">
                                        <span>💊 Medicamentos</span>
                                    </label>
                                    <label class="checkbox-option">
                                        <input type="checkbox" value="ropa" name="tipo_ayuda">
                                        <span>👕 Ropa</span>
                                    </label>
                                    <label class="checkbox-option">
                                        <input type="checkbox" value="comunicacion" name="tipo_ayuda">
                                        <span>📱 Comunicación</span>
                                    </label>
                                    <label class="checkbox-option">
                                        <input type="checkbox" value="otro" name="tipo_ayuda">
                                        <span>💬 Otro</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Descripción de tu situación (opcional)</label>
                                <textarea id="descripcionSituacion" placeholder="Contanos brevemente cómo estás y qué necesitás..." rows="4"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="quiereContacto">
                                    Quiero que me contacten para recibir ayuda
                                </label>
                            </div>
                            
                            <div id="datosContacto" style="display: none;">
                                <div class="form-group">
                                    <label>Email (opcional)</label>
                                    <input type="email" id="emailContacto" placeholder="tu@email.com">
                                </div>
                                <div class="form-group">
                                    <label>Teléfono (opcional)</label>
                                    <input type="tel" id="telefonoContacto" placeholder="+54 9 11 1234-5678">
                                </div>
                            </div>
                            
                            <button class="btn-enviar-checkin" onclick="window.checkinEmergencias?.enviarCheckin()">
                                <i class="fas fa-heart"></i> Enviar Check-in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    seleccionarEstado(estado) {
        // Remover selección anterior
        document.querySelectorAll('.btn-checkin-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Marcar como seleccionado
        const btn = document.querySelector(`[data-estado="${estado}"]`);
        if (btn) btn.classList.add('selected');
        
        // Mostrar detalles si necesita ayuda o conoce personas
        const detallesAyuda = document.getElementById('detallesAyuda');
        if (estado === 'necesita_ayuda' || estado === 'ayuda_urgente' || estado === 'conozco_personas') {
            detallesAyuda.style.display = 'block';
            // Actualizar label según estado
            const labelAyuda = detallesAyuda.querySelector('label');
            if (labelAyuda) {
                if (estado === 'conozco_personas') {
                    labelAyuda.textContent = '¿Qué tipo de ayuda necesitan? *';
                } else {
                    labelAyuda.textContent = '¿Qué tipo de ayuda necesitás? *';
                }
            }
        } else {
            // Si está bien, enviar directamente y redirigir
            this.enviarCheckin(estado);
        }
        
        // Mostrar campos de contacto si quiere contacto
        const quiereContacto = document.getElementById('quiereContacto');
        const datosContacto = document.getElementById('datosContacto');
        quiereContacto.addEventListener('change', (e) => {
            datosContacto.style.display = e.target.checked ? 'block' : 'none';
        });
    }
    
    async enviarCheckin(estado = null) {
        if (!this.campanaActiva) return;
        
        // Obtener estado seleccionado
        if (!estado) {
            const btnSelected = document.querySelector('.btn-checkin-option.selected');
            if (!btnSelected) {
                alert('Por favor, seleccioná tu estado');
                return;
            }
            estado = btnSelected.dataset.estado;
        }
        
        // Si está bien, enviar directamente y redirigir
        if (estado === 'bien') {
            await this.guardarCheckin({
                estado: 'bien',
                tipo_ayuda_necesaria: [],
                descripcion_situacion: null,
                quiere_contacto: false
            });
            // Redirigir a comunidad de emergencias
            this.redirigirAComunidadEmergencias('bien');
            return;
        }
        
        // Si conoce personas que no están bien
        if (estado === 'conozco_personas') {
            const tiposAyuda = Array.from(document.querySelectorAll('input[name="tipo_ayuda"]:checked'))
                .map(input => input.value);
            
            if (tiposAyuda.length === 0) {
                alert('Por favor, seleccioná al menos un tipo de ayuda');
                return;
            }
            
            await this.guardarCheckin({
                estado: 'conozco_personas',
                tipo_ayuda_necesaria: tiposAyuda,
                descripcion_situacion: document.getElementById('descripcionSituacion').value || null,
                quiere_contacto: false
            });
            
            // Redirigir a comunidad de emergencias
            this.redirigirAComunidadEmergencias('conozco_personas');
            return;
        }
        
        // Si necesita ayuda, obtener detalles
        const tiposAyuda = Array.from(document.querySelectorAll('input[name="tipo_ayuda"]:checked'))
            .map(input => input.value);
        
        if (tiposAyuda.length === 0 && (estado === 'necesita_ayuda' || estado === 'ayuda_urgente')) {
            alert('Por favor, seleccioná al menos un tipo de ayuda');
            return;
        }
        
        const datos = {
            estado: estado,
            tipo_ayuda_necesaria: tiposAyuda,
            descripcion_situacion: document.getElementById('descripcionSituacion').value || null,
            quiere_contacto: document.getElementById('quiereContacto').checked || false,
            email_contacto: document.getElementById('emailContacto')?.value || null,
            telefono_contacto: document.getElementById('telefonoContacto')?.value || null
        };
        
        // Si proporcionó email, guardarlo también en la ubicación
        if (datos.email_contacto && this.ubicacionUsuario) {
            await this.guardarUbicacionUsuario(this.ubicacionUsuario, datos.email_contacto);
        }
        
        await this.guardarCheckin(datos);
        
        // Redirigir a comunidad de emergencias
        this.redirigirAComunidadEmergencias(estado);
    }
    
    // ===== SOLICITAR PERMISO DE UBICACIÓN =====
    async solicitarUbicacion() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                console.warn('Geolocalización no disponible en este navegador');
                resolve(null);
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude,
                        precision: position.coords.accuracy
                    });
                },
                (error) => {
                    console.warn('Error obteniendo ubicación:', error.message);
                    // No es crítico, continuamos sin ubicación
                    resolve(null);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutos
                }
            );
        });
    }
    
    async guardarCheckin(datos) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con Supabase');
            return;
        }
        
        try {
            // Usar ubicación ya obtenida (si se obtuvo en el consentimiento previo)
            let ubicacionUsuario = this.ubicacionUsuario;
            
            // Si no se obtuvo antes, intentar obtenerla ahora (fallback)
            if (!ubicacionUsuario) {
                try {
                    ubicacionUsuario = await this.solicitarUbicacion();
                } catch (error) {
                    console.warn('No se pudo obtener ubicación:', error);
                }
            }
            
            const checkinData = {
                campaña_id: this.campanaActiva.id,
                usuario_hash: this.usuarioHash,
                estado: datos.estado,
                tipo_ayuda_necesaria: datos.tipo_ayuda_necesaria || [],
                descripcion_situacion: datos.descripcion_situacion,
                quiere_contacto: datos.quiere_contacto || false,
                email_contacto: datos.email_contacto || null,
                telefono_contacto: datos.telefono_contacto || null,
                ubicacion_usuario: ubicacionUsuario ? {
                    latitud: ubicacionUsuario.latitud,
                    longitud: ubicacionUsuario.longitud,
                    precision: ubicacionUsuario.precision
                } : null
            };
            
            const { data, error } = await this.supabase
                .from('checkin_emergencias')
                .insert([checkinData])
                .select();
            
            if (error) throw error;
            
            // Mostrar mensaje de agradecimiento
            this.mostrarAgradecimiento(datos.estado);
            
            // Cerrar modal después de 3 segundos
            setTimeout(() => {
                this.cerrarModal();
            }, 3000);
            
            return data[0];
        } catch (error) {
            console.error('Error guardando check-in:', error);
            this.mostrarError('Error al guardar check-in: ' + error.message);
        }
    }
    
    // ===== REDIRIGIR A COMUNIDAD DE EMERGENCIAS =====
    redirigirAComunidadEmergencias(estado) {
        const baseUrl = window.location.origin;
        let url = `${baseUrl}/cresalia-solidario-emergencias/index.html`;
        
        // Agregar parámetros según estado
        const params = new URLSearchParams();
        if (estado === 'bien') {
            params.append('estado', 'bien');
            params.append('mensaje', 'gracias');
        } else if (estado === 'conozco_personas') {
            params.append('estado', 'conozco_personas');
            params.append('ayuda', 'si');
        } else if (estado === 'necesita_ayuda' || estado === 'ayuda_urgente') {
            params.append('estado', estado);
            params.append('ayuda', 'si');
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = url;
        }, 2000);
    }
    
    mostrarAgradecimiento(estado) {
        const modal = document.getElementById('modal-checkin-emergencia');
        if (!modal) return;
        
        let mensaje = '';
        let mensajeRedireccion = '';
        
        if (estado === 'bien') {
            mensaje = '💜 Me alegra saber que estás bien. Cuidate mucho.';
            mensajeRedireccion = 'Te redirigiremos a la comunidad de emergencias por si querés ayudar a otros.';
        } else if (estado === 'necesita_ayuda' || estado === 'ayuda_urgente') {
            mensaje = '💜 Tu mensaje fue recibido. Te redirigiremos a la comunidad de emergencias donde podrás encontrar ayuda.';
            mensajeRedireccion = 'La comunidad está esperando para ayudarte. No estás solo/a.';
        } else if (estado === 'conozco_personas') {
            mensaje = '💜 Gracias por tu solidaridad. Te redirigiremos a la comunidad de emergencias.';
            mensajeRedireccion = 'Allí podrás encontrar recursos y apoyo para ayudar a quienes lo necesitan.';
        }
        
        modal.querySelector('.modal-checkin-body').innerHTML = `
            <div class="agradecimiento-checkin">
                <div class="icono-grande">💜</div>
                <h3>Gracias por tu respuesta</h3>
                <p>${mensaje}</p>
                ${mensajeRedireccion ? `<p style="margin-top: 15px; color: #6B7280; font-size: 0.9rem;">${mensajeRedireccion}</p>` : ''}
            </div>
        `;
    }
    
    cerrarModal() {
        const modal = document.getElementById('modal-checkin-emergencia');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
    
    agregarEventListeners() {
        // Cerrar al hacer click fuera del modal
        const modal = document.getElementById('modal-checkin-emergencia');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.cerrarModal();
                }
            });
        }
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal?.classList.contains('active')) {
                this.cerrarModal();
            }
        });
    }
    
    agregarEstilos() {
        if (document.getElementById('estilos-checkin-emergencias')) return;
        
        const style = document.createElement('style');
        style.id = 'estilos-checkin-emergencias';
        style.textContent = `
            .modal-checkin-emergencia {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 99999;
                align-items: center;
                justify-content: center;
                padding: 20px;
                backdrop-filter: blur(5px);
            }
            .modal-checkin-emergencia.active {
                display: flex;
            }
            .modal-checkin-content {
                background: white;
                border-radius: 20px;
                padding: 30px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .modal-checkin-header {
                display: flex;
                justify-content: space-between;
                align-items: start;
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 2px solid #E5E7EB;
            }
            .modal-checkin-header h2 {
                color: #EF4444;
                margin: 0;
                font-size: 1.5rem;
            }
            .modal-checkin-subtitle {
                color: #6B7280;
                margin: 5px 0 0 0;
                font-size: 0.9rem;
            }
            .cerrar-checkin {
                background: #F3F4F6;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #6B7280;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                line-height: 1;
            }
            .cerrar-checkin:hover {
                background: #E5E7EB;
                color: #374151;
                transform: scale(1.1);
            }
            .mensaje-crisla {
                background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
                border-left: 4px solid #EF4444;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 25px;
            }
            .mensaje-crisla p {
                margin: 0 0 10px 0;
                color: #374151;
                line-height: 1.6;
            }
            .mensaje-crisla p:last-child {
                margin-bottom: 0;
            }
            .mensaje-crisla.zona-afectada {
                border-left: 5px solid #EF4444;
                background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
            }
            .modal-checkin-emergencia.urgente .modal-checkin-content {
                border: 3px solid #EF4444;
                box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
            }
            .checkin-options {
                display: grid;
                gap: 15px;
            }
            .btn-checkin-option {
                background: white;
                border: 3px solid #E5E7EB;
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            .btn-checkin-option i {
                font-size: 2rem;
                color: #6B7280;
            }
            .btn-checkin-option strong {
                font-size: 1.1rem;
                color: #374151;
            }
            .btn-checkin-option small {
                color: #6B7280;
                font-size: 0.85rem;
            }
            .btn-checkin-option:hover {
                border-color: #667eea;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
            }
            .btn-checkin-option.selected {
                border-color: #667eea;
                background: #F3F4F6;
            }
            .btn-checkin-option.urgente {
                border-color: #EF4444;
            }
            .btn-checkin-option.urgente:hover {
                border-color: #DC2626;
                box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
            }
            .btn-checkin-option.urgente.selected {
                border-color: #DC2626;
                background: #FEF2F2;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 10px;
                font-weight: 600;
                color: #374151;
            }
            .ayuda-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
            }
            .checkbox-option {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px;
                border: 2px solid #E5E7EB;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .checkbox-option:hover {
                border-color: #667eea;
                background: #F3F4F6;
            }
            .checkbox-option input:checked + span {
                color: #667eea;
                font-weight: 600;
            }
            .checkbox-option input[type="checkbox"] {
                width: auto;
                cursor: pointer;
            }
            .form-group textarea,
            .form-group input[type="email"],
            .form-group input[type="tel"] {
                width: 100%;
                padding: 12px;
                border: 2px solid #E5E7EB;
                border-radius: 8px;
                font-family: inherit;
                font-size: 1rem;
            }
            .form-group textarea:focus,
            .form-group input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            .btn-enviar-checkin {
                width: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 15px;
                border-radius: 10px;
                font-weight: 600;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s;
                margin-top: 20px;
            }
            .btn-enviar-checkin:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }
            .agradecimiento-checkin {
                text-align: center;
                padding: 40px 20px;
            }
            .icono-grande {
                font-size: 4rem;
                margin-bottom: 20px;
            }
            .agradecimiento-checkin h3 {
                color: #667eea;
                margin-bottom: 15px;
            }
            .agradecimiento-checkin p {
                color: #6B7280;
                font-size: 1.1rem;
                line-height: 1.6;
            }
        `;
        document.head.appendChild(style);
    }
    
    agregarEstilosConsentimiento() {
        if (document.getElementById('estilos-consentimiento-ubicacion')) return;
        
        const style = document.createElement('style');
        style.id = 'estilos-consentimiento-ubicacion';
        style.textContent = `
            .modal-consentimiento-ubicacion {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 99998;
                align-items: center;
                justify-content: center;
                padding: 20px;
                backdrop-filter: blur(5px);
            }
            .modal-consentimiento-ubicacion.active {
                display: flex;
            }
            .modal-consentimiento-content {
                background: white;
                border-radius: 20px;
                padding: 30px;
                max-width: 550px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease;
            }
            .modal-consentimiento-header {
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 2px solid #E5E7EB;
            }
            .modal-consentimiento-header h2 {
                color: #EF4444;
                margin: 0;
                font-size: 1.5rem;
            }
            .modal-consentimiento-subtitle {
                color: #6B7280;
                margin: 5px 0 0 0;
                font-size: 0.9rem;
            }
            .mensaje-consentimiento {
                background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
                border-left: 4px solid #EF4444;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 25px;
            }
            .mensaje-consentimiento p {
                margin: 0 0 10px 0;
                color: #374151;
                line-height: 1.6;
            }
            .mensaje-consentimiento p:last-child {
                margin-bottom: 0;
            }
            .consentimiento-options {
                display: grid;
                gap: 15px;
            }
            .btn-consentimiento {
                background: white;
                border: 3px solid #E5E7EB;
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            .btn-consentimiento i {
                font-size: 2rem;
            }
            .btn-consentimiento strong {
                font-size: 1.1rem;
                color: #374151;
            }
            .btn-consentimiento small {
                color: #6B7280;
                font-size: 0.85rem;
            }
            .btn-consentimiento.aceptar {
                border-color: #10B981;
            }
            .btn-consentimiento.aceptar i {
                color: #10B981;
            }
            .btn-consentimiento.aceptar:hover {
                background: #F0FDF4;
                border-color: #10B981;
                transform: translateY(-2px);
            }
            .btn-consentimiento.rechazar {
                border-color: #6B7280;
            }
            .btn-consentimiento.rechazar i {
                color: #6B7280;
            }
            .btn-consentimiento.rechazar:hover {
                background: #F9FAFB;
                border-color: #6B7280;
            }
            .btn-consentimiento.ya-hice {
                border-color: #3B82F6;
            }
            .btn-consentimiento.ya-hice i {
                color: #3B82F6;
            }
            .btn-consentimiento.ya-hice:hover {
                background: #EFF6FF;
                border-color: #3B82F6;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== GUARDAR UBICACIÓN DEL USUARIO =====
    async guardarUbicacionUsuario(ubicacion, email = null) {
        if (!ubicacion || !this.supabase) return;
        
        try {
            // Guardar en localStorage
            const ubicacionData = {
                latitud: ubicacion.latitud,
                longitud: ubicacion.longitud,
                precision: ubicacion.precision,
                fecha: new Date().toISOString(),
                email: email || null
            };
            localStorage.setItem('cresalia_ubicacion_usuario', JSON.stringify(ubicacionData));
            
            // Intentar guardar en Supabase (si hay tabla)
            try {
                const { error } = await this.supabase
                    .from('ubicaciones_usuarios_emergencias')
                    .upsert([{
                        usuario_hash: this.usuarioHash,
                        latitud: ubicacion.latitud,
                        longitud: ubicacion.longitud,
                        precision_metros: ubicacion.precision,
                        email: email || null,
                        ultima_actualizacion: new Date().toISOString(),
                        permite_emails_emergencia: true
                    }], {
                        onConflict: 'usuario_hash'
                    });
                
                if (error) {
                    // Si la tabla no existe, solo guardar en localStorage
                    console.log('ℹ️ Tabla de ubicaciones no disponible, guardado solo en localStorage');
                }
            } catch (error) {
                // Si falla, no es crítico, ya está guardado en localStorage
                console.log('ℹ️ No se pudo guardar ubicación en Supabase, guardado en localStorage');
            }
        } catch (error) {
            console.warn('Error guardando ubicación:', error);
        }
    }
    
    // ===== UTILIDADES =====
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    mostrarError(mensaje) {
        alert('Error: ' + mensaje);
    }
}

// Inicializar automáticamente
if (typeof window !== 'undefined') {
    window.checkinEmergencias = new SistemaCheckinEmergencias();
}

