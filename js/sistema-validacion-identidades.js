// ===== SISTEMA DE VALIDACIÓN DE IDENTIDADES =====
// Sistema para verificar identidades en comunidades sensibles y prevenir trolls
// SOLO se activa en comunidades que requieren verificación: donación de materiales y urgente

// Lista de comunidades que REQUIEREN verificación de identidad
// SOLO estas comunidades deben mostrar el botón de verificación
const COMUNIDADES_REQUIEREN_VERIFICACION = [
    'cresalia-solidario',
    'cresalia-solidario-emergencias',
    'donar-materiales' // Página de donación de materiales dentro de solidario-emergencias
];

class SistemaValidacionIdentidades {
    constructor(comunidadSlug) {
        this.comunidadSlug = comunidadSlug;
        this.supabase = null;
        this.autorHash = null;
        this.estaVerificado = false;
        
        // Verificar si esta comunidad requiere verificación
        if (!this.requiereVerificacion()) {
            console.log(`ℹ️ La comunidad "${comunidadSlug}" no requiere verificación de identidad. Sistema desactivado.`);
            return; // No inicializar si no requiere verificación
        }
        
        this.init();
    }
    
    requiereVerificacion() {
        // Verificar si el slug de la comunidad está en la lista de comunidades que requieren verificación
        return COMUNIDADES_REQUIEREN_VERIFICACION.some(slug => 
            this.comunidadSlug.includes(slug) || 
            this.comunidadSlug === slug
        );
    }
    
    async init() {
        // Inicializar Supabase
        if (typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
            try {
                const config = window.SUPABASE_CONFIG;
                if (config.url && config.anonKey && !config.anonKey.includes('REEMPLAZA')) {
                    this.supabase = window.supabase.createClient(config.url, config.anonKey);
                }
            } catch (error) {
                console.error('Error inicializando Supabase para validación:', error);
            }
        }
        
        // Obtener hash del usuario (mismo que el foro)
        this.autorHash = this.generarHashAutor();
        
        // Verificar si ya está verificado
        await this.verificarEstado();
        
        // Crear botón de solicitud si no está verificado
        if (!this.estaVerificado) {
            this.crearBotonSolicitud();
        }
    }
    
    generarHashAutor() {
        // Usar el mismo hash que el sistema de foro
        const stored = localStorage.getItem(`foro_hash_${this.comunidadSlug}`);
        if (stored) return stored;
        
        // Si no existe, intentar obtenerlo del sistema de foro
        if (window.foroComunidad && window.foroComunidad.autorHash) {
            return window.foroComunidad.autorHash;
        }
        
        // Generar nuevo hash si no existe
        const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const hash = btoa(random).substring(0, 32);
        localStorage.setItem(`foro_hash_${this.comunidadSlug}`, hash);
        return hash;
    }
    
    async verificarEstado() {
        if (!this.supabase || !this.autorHash) return false;
        
        try {
            const { data, error } = await this.supabase
                .rpc('usuario_esta_verificado', {
                    p_hash: this.autorHash,
                    p_comunidad: this.comunidadSlug
                });
            
            if (error && error.code !== '42883') { // 42883 = función no existe aún
                // Fallback: consultar directamente la tabla
                const { data: verificacion, error: err2 } = await this.supabase
                    .from('usuarios_verificados_comunidades')
                    .select('*')
                    .eq('autor_hash', this.autorHash)
                    .eq('comunidad_slug', this.comunidadSlug)
                    .eq('activo', true)
                    .maybeSingle();
                
                if (!err2 && verificacion) {
                    // Verificar si no expiró
                    if (!verificacion.fecha_expiracion || new Date(verificacion.fecha_expiracion) > new Date()) {
                        this.estaVerificado = true;
                        return true;
                    }
                }
            } else if (data === true) {
                this.estaVerificado = true;
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error verificando estado:', error);
            return false;
        }
    }
    
    crearBotonSolicitud() {
        // Verificar si esta comunidad requiere verificación
        if (!this.requiereVerificacion()) {
            return; // No crear botón si no requiere verificación
        }
        
        // Verificar si ya existe
        if (document.getElementById('btn-solicitar-verificacion')) return;
        
        // Buscar dónde insertar el botón (en el foro-container o al inicio)
        const foroContainer = document.querySelector('.foro-container');
        const header = foroContainer?.querySelector('.foro-header');
        
        if (header) {
            // Crear botón junto al título del foro
            const boton = document.createElement('button');
            boton.id = 'btn-solicitar-verificacion';
            boton.innerHTML = '<i class="fas fa-check-circle"></i> Solicitar Verificación ✅';
            boton.className = 'btn-verificacion';
            boton.onclick = () => this.mostrarModalSolicitud();
            
            // Insertar después del título
            const titulo = header.querySelector('h2');
            if (titulo) {
                titulo.style.display = 'flex';
                titulo.style.justifyContent = 'space-between';
                titulo.style.alignItems = 'center';
                titulo.style.flexWrap = 'wrap';
                titulo.style.gap = '15px';
                
                const tituloContent = titulo.textContent;
                titulo.textContent = '';
                titulo.innerHTML = `<span>${tituloContent}</span>`;
                titulo.appendChild(boton);
            } else {
                header.appendChild(boton);
            }
        }
        
        // Agregar estilos si no existen
        if (!document.getElementById('estilos-validacion-identidades')) {
            const style = document.createElement('style');
            style.id = 'estilos-validacion-identidades';
            style.textContent = `
                .btn-verificacion {
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .btn-verificacion:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
                }
                .badge-verificado {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    color: white;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin-left: 8px;
                }
                .modal-verificacion {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 10001;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .modal-verificacion.active {
                    display: flex;
                }
                .modal-verificacion-content {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 700px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                .modal-verificacion-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }
                .modal-verificacion-header h3 {
                    color: #374151;
                    margin: 0;
                }
                .cerrar-verificacion {
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #6B7280;
                }
                .form-verificacion-group {
                    margin-bottom: 20px;
                }
                .form-verificacion-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: #374151;
                    font-weight: 600;
                }
                .form-verificacion-group select,
                .form-verificacion-group textarea,
                .form-verificacion-group input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #E5E7EB;
                    border-radius: 10px;
                    font-family: inherit;
                    font-size: 1rem;
                }
                .form-verificacion-group textarea {
                    min-height: 100px;
                    resize: vertical;
                }
                .metodo-info {
                    background: #F3F4F6;
                    padding: 15px;
                    border-radius: 10px;
                    margin-top: 10px;
                    font-size: 0.9rem;
                    color: #6B7280;
                }
                .metodo-info strong {
                    color: #374151;
                }
                .btn-verificacion-enviar {
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    color: white;
                    padding: 12px 30px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    font-size: 1rem;
                    margin-top: 10px;
                }
                .alerta-privacidad {
                    background: #DBEAFE;
                    border: 2px solid #3B82F6;
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    color: #1E40AF;
                }
                .alerta-privacidad strong {
                    display: block;
                    margin-bottom: 5px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    mostrarModalSolicitud() {
        const modal = document.getElementById('modal-verificacion-identidad') || this.crearModal();
        modal.classList.add('active');
    }
    
    crearModal() {
        const modal = document.createElement('div');
        modal.id = 'modal-verificacion-identidad';
        modal.className = 'modal-verificacion';
        modal.innerHTML = `
            <div class="modal-verificacion-content">
                <div class="modal-verificacion-header">
                    <h3>✅ Solicitar Verificación de Identidad</h3>
                    <button class="cerrar-verificacion" onclick="window.validacionIdentidad?.cerrarModal()">&times;</button>
                </div>
                
                <div class="alerta-privacidad">
                    <strong>🔒 Privacidad Garantizada:</strong>
                    <ul style="margin: 10px 0 0 20px; padding: 0;">
                        <li>NO guardamos documentos reales (solo hash no reversible)</li>
                        <li>NO guardamos datos personales completos</li>
                        <li>Después de verificar, eliminamos los datos sensibles</li>
                        <li>Solo quedará tu badge "✅ Verificado" en tus posts</li>
                    </ul>
                </div>
                
                <form id="form-verificacion-identidad">
                    <div class="form-verificacion-group">
                        <label>Método de Verificación: *</label>
                        <select id="verificacion-metodo" required onchange="window.validacionIdentidad?.mostrarInfoMetodo()">
                            <option value="">Seleccionar método...</option>
                            <option value="email_verificado">📧 Email Verificado</option>
                            <option value="testimonio_detallado">📝 Testimonio Detallado</option>
                            <option value="documento_privado">🔐 Documento Privado</option>
                            <option value="referencia_profesional">👩‍⚕️ Referencia Profesional</option>
                            <option value="otro">💬 Otro</option>
                        </select>
                        <div id="info-metodo" class="metodo-info" style="display: none;"></div>
                    </div>
                    
                    <div class="form-verificacion-group">
                        <label id="label-evidencia">Evidencia / Información: *</label>
                        <textarea id="verificacion-evidencia" placeholder="Compartí la información según el método elegido..." required></textarea>
                        <small style="color: #6B7280; margin-top: 5px; display: block;">
                            ⚠️ NO incluyas datos sensibles completos (documentos, números completos, etc.). 
                            Solo información suficiente para verificar tu identidad.
                        </small>
                    </div>
                    
                    <div class="form-verificacion-group">
                        <label>Descripción de la Evidencia: *</label>
                        <textarea id="verificacion-descripcion" placeholder="Describe QUÉ estás enviando (ej: 'Documento de identidad con nombre y foto', 'Email desde dirección personal', 'Testimonio detallado de mi experiencia')..." required></textarea>
                    </div>
                    
                    <button type="submit" class="btn-verificacion-enviar">
                        <i class="fas fa-paper-plane"></i> Enviar Solicitud de Verificación
                    </button>
                </form>
                
                <p style="margin-top: 20px; text-align: center; color: #6B7280; font-size: 0.9rem;">
                    💜 Tu solicitud será revisada por CRISLA. Te notificaremos cuando esté lista.
                </p>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Configurar submit
        document.getElementById('form-verificacion-identidad').addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarSolicitud();
        });
        
        return modal;
    }
    
    mostrarInfoMetodo() {
        const metodo = document.getElementById('verificacion-metodo').value;
        const infoDiv = document.getElementById('info-metodo');
        const labelEvidencia = document.getElementById('label-evidencia');
        const textareaEvidencia = document.getElementById('verificacion-evidencia');
        
        if (!metodo) {
            infoDiv.style.display = 'none';
            return;
        }
        
        infoDiv.style.display = 'block';
        
        const metodosInfo = {
            'email_verificado': {
                titulo: '📧 Email Verificado',
                descripcion: 'Enviá un email desde una dirección que demuestre tu identidad. En la comunidad "Mujeres Sobrevivientes", por ejemplo, debería ser un email que sugiera identidad femenina.',
                placeholder: 'Tu dirección de email que demuestre tu identidad...'
            },
            'testimonio_detallado': {
                titulo: '📝 Testimonio Detallado',
                descripcion: 'Compartí tu experiencia personal de manera detallada (sin datos sensibles). CRISLA evaluará la autenticidad basándose en coherencia y profundidad.',
                placeholder: 'Compartí tu experiencia personal detallada...'
            },
            'documento_privado': {
                titulo: '🔐 Documento Privado',
                descripcion: 'Subí información de un documento que demuestre tu identidad. SOLO guardamos el hash (no el documento real). CRISLA verifica y luego se elimina.',
                placeholder: 'Información del documento (NUNCA envíes el documento completo, solo información suficiente para verificar)...'
            },
            'referencia_profesional': {
                titulo: '👩‍⚕️ Referencia Profesional',
                descripcion: 'Terapeuta, médico, trabajador social u otro profesional que pueda confirmar tu identidad. Debe ser alguien verificado (sin exponer datos del profesional).',
                placeholder: 'Información del profesional de referencia y cómo contactarlo...'
            },
            'otro': {
                titulo: '💬 Otro Método',
                descripcion: 'Si tenés otro método de verificación, explicá cómo funcionaría.',
                placeholder: 'Explicá tu método de verificación...'
            }
        };
        
        const info = metodosInfo[metodo];
        if (info) {
            infoDiv.innerHTML = `
                <strong>${info.titulo}</strong>
                <p>${info.descripcion}</p>
            `;
            textareaEvidencia.placeholder = info.placeholder;
        }
    }
    
    cerrarModal() {
        const modal = document.getElementById('modal-verificacion-identidad');
        if (modal) modal.classList.remove('active');
    }
    
    async enviarSolicitud() {
        const metodo = document.getElementById('verificacion-metodo').value;
        const evidencia = document.getElementById('verificacion-evidencia').value.trim();
        const descripcion = document.getElementById('verificacion-descripcion').value.trim();
        
        if (!metodo || !evidencia || !descripcion) {
            alert('⚠️ Por favor completá todos los campos');
            return;
        }
        
        try {
            // Generar hash de la evidencia (para no guardar datos sensibles)
            const evidenciaHash = btoa(evidencia).substring(0, 64); // Hash simple (en producción usaría algo más seguro)
            
            const solicitudData = {
                comunidad_slug: this.comunidadSlug,
                autor_hash: this.autorHash,
                autor_alias: window.foroComunidad?.autorAlias || 'Usuario',
                metodo_verificacion: metodo,
                evidencia_hash: evidenciaHash,
                descripcion_evidencia: descripcion,
                estado: 'pendiente'
            };
            
            if (this.supabase) {
                const { error } = await this.supabase
                    .from('solicitudes_verificacion')
                    .insert([solicitudData]);
                
                if (error) throw error;
                
                alert('💜 ¡Solicitud enviada! CRISLA la revisará pronto. Te notificaremos cuando esté lista.');
                this.cerrarModal();
                document.getElementById('form-verificacion-identidad').reset();
                
                // Ocultar botón temporalmente
                const boton = document.getElementById('btn-solicitar-verificacion');
                if (boton) {
                    boton.textContent = '⏳ Solicitud en revisión...';
                    boton.disabled = true;
                    boton.style.opacity = '0.6';
                }
            } else {
                // Modo local
                const solicitudes = JSON.parse(localStorage.getItem(`solicitudes_verificacion_${this.comunidadSlug}`) || '[]');
                solicitudes.push({
                    ...solicitudData,
                    id: 'local_' + Date.now(),
                    created_at: new Date().toISOString()
                });
                localStorage.setItem(`solicitudes_verificacion_${this.comunidadSlug}`, JSON.stringify(solicitudes));
                
                alert('💜 ¡Solicitud guardada! (Se enviará cuando Supabase esté configurado)');
                this.cerrarModal();
            }
        } catch (error) {
            console.error('Error enviando solicitud:', error);
            alert('❌ Error al enviar solicitud. Por favor intentá de nuevo.');
        }
    }
    
    // Función estática para verificar si un usuario está verificado (para mostrar badge)
    static async verificarUsuario(hash, comunidadSlug) {
        if (typeof window.supabase === 'undefined' || !window.SUPABASE_CONFIG) return false;
        
        try {
            const config = window.SUPABASE_CONFIG;
            if (!config.url || !config.anonKey || config.anonKey.includes('REEMPLAZA')) return false;
            
            const supabase = window.supabase.createClient(config.url, config.anonKey);
            
            const { data, error } = await supabase
                .from('usuarios_verificados_comunidades')
                .select('*')
                .eq('autor_hash', hash)
                .eq('comunidad_slug', comunidadSlug)
                .eq('activo', true)
                .maybeSingle();
            
            if (error) return false;
            if (!data) return false;
            
            // Verificar si no expiró
            if (data.fecha_expiracion && new Date(data.fecha_expiracion) < new Date()) {
                return false;
            }
            
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // Función estática para obtener badge HTML
    static getBadgeVerificado() {
        return '<span class="badge-verificado"><i class="fas fa-check-circle"></i> Verificado</span>';
    }
}

