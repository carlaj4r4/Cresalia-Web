// ===== SISTEMA DE CHECK-IN AUTOMÁTICO DE EMERGENCIAS =====
// Pregunta automáticamente "¿Estás bien?" después de desastres naturales
// Co-fundadores: Crisla & Claude

class SistemaCheckinEmergencias {
    constructor() {
        this.supabase = null;
        this.usuarioHash = null;
        this.campanaActiva = null;
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
                        this.mostrarModalCheckin();
                    }, 3000); // 3 segundos después de cargar la página
                }
            }
        } catch (error) {
            console.error('Error verificando campañas:', error);
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
    
    // ===== MOSTRAR MODAL DE CHECK-IN =====
    mostrarModalCheckin() {
        // Evitar mostrar múltiples modales
        if (document.getElementById('modal-checkin-emergencia')) return;
        
        if (!this.campanaActiva) return;
        
        const modal = document.createElement('div');
        modal.id = 'modal-checkin-emergencia';
        modal.className = 'modal-checkin-emergencia';
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
                    <div class="mensaje-crisla">
                        <p>💜 <strong>Hola, querido usuario.</strong> Sé que puede ser difícil, pero necesito saber si estás bien.</p>
                        <p>Si necesitás ayuda, estoy acá. Tu comunidad está acá. No estás solo/a.</p>
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
        
        // Mostrar detalles si necesita ayuda
        const detallesAyuda = document.getElementById('detallesAyuda');
        if (estado === 'necesita_ayuda' || estado === 'ayuda_urgente') {
            detallesAyuda.style.display = 'block';
        } else {
            // Si está bien, enviar directamente
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
        
        // Si está bien, enviar directamente
        if (estado === 'bien') {
            await this.guardarCheckin({
                estado: 'bien',
                tipo_ayuda_necesaria: [],
                descripcion_situacion: null,
                quiere_contacto: false
            });
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
        
        await this.guardarCheckin(datos);
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
            // Solicitar ubicación (SOLO para detectar desastres naturales en tu zona)
            let ubicacionUsuario = null;
            try {
                ubicacionUsuario = await this.solicitarUbicacion();
            } catch (error) {
                console.warn('No se pudo obtener ubicación:', error);
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
    
    mostrarAgradecimiento(estado) {
        const modal = document.getElementById('modal-checkin-emergencia');
        if (!modal) return;
        
        let mensaje = '';
        if (estado === 'bien') {
            mensaje = '💜 Me alegra saber que estás bien. Cuidate mucho.';
        } else if (estado === 'necesita_ayuda' || estado === 'ayuda_urgente') {
            mensaje = '💜 Tu mensaje fue recibido. Te contactaremos pronto. No estás solo/a.';
        }
        
        modal.querySelector('.modal-checkin-body').innerHTML = `
            <div class="agradecimiento-checkin">
                <div class="icono-grande">💜</div>
                <h3>Gracias por tu respuesta</h3>
                <p>${mensaje}</p>
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

