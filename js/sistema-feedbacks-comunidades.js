// ===== SISTEMA DE FEEDBACKS PARA COMUNIDADES =====
// Sistema opcional para que usuarios envíen feedback sobre las comunidades

class SistemaFeedbacksComunidades {
    constructor(comunidadSlug) {
        this.comunidadSlug = comunidadSlug;
        this.supabase = null;
        this.autorHash = null;
        this.init();
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
                console.error('Error inicializando Supabase para feedbacks:', error);
            }
        }
        
        // Obtener hash del usuario (mismo que el foro)
        this.autorHash = this.generarHashAutor();
        
        // Crear botón de feedback si no existe
        this.crearBotonFeedback();
    }
    
    generarHashAutor() {
        // Usar el mismo hash que el sistema de foro
        const stored = localStorage.getItem(`foro_hash_${this.comunidadSlug}`);
        if (stored) return stored;
        
        // Generar nuevo hash
        const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const hash = btoa(random).substring(0, 32);
        localStorage.setItem(`foro_hash_${this.comunidadSlug}`, hash);
        return hash;
    }
    
    crearBotonFeedback() {
        // Buscar si ya existe el botón
        if (document.getElementById('btn-feedback-comunidad')) return;
        
        // Crear botón flotante
        const boton = document.createElement('button');
        boton.id = 'btn-feedback-comunidad';
        boton.innerHTML = '<i class="fas fa-comment-dots"></i> Feedback';
        boton.className = 'btn-feedback-flotante';
        boton.onclick = () => this.mostrarModalFeedback();
        document.body.appendChild(boton);
        
        // Agregar estilos
        if (!document.getElementById('estilos-feedbacks-comunidades')) {
            const style = document.createElement('style');
            style.id = 'estilos-feedbacks-comunidades';
            style.textContent = `
                .btn-feedback-flotante {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 25px;
                    border-radius: 50px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                }
                .btn-feedback-flotante:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.5);
                }
                .modal-feedback {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 10000;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .modal-feedback.active {
                    display: flex;
                }
                .modal-feedback-content {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                .modal-feedback-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                }
                .modal-feedback-header h3 {
                    color: #374151;
                    margin: 0;
                }
                .cerrar-feedback {
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #6B7280;
                }
                .form-feedback-group {
                    margin-bottom: 20px;
                }
                .form-feedback-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: #374151;
                    font-weight: 600;
                }
                .form-feedback-group select,
                .form-feedback-group textarea,
                .form-feedback-group input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #E5E7EB;
                    border-radius: 10px;
                    font-family: inherit;
                    font-size: 1rem;
                }
                .form-feedback-group textarea {
                    min-height: 120px;
                    resize: vertical;
                }
                .form-feedback-checkbox {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .form-feedback-checkbox input {
                    width: auto;
                }
                .btn-feedback-enviar {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 30px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    font-size: 1rem;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    mostrarModalFeedback() {
        const modal = document.getElementById('modal-feedback-comunidad') || this.crearModal();
        modal.classList.add('active');
    }
    
    crearModal() {
        const modal = document.createElement('div');
        modal.id = 'modal-feedback-comunidad';
        modal.className = 'modal-feedback';
        modal.innerHTML = `
            <div class="modal-feedback-content">
                <div class="modal-feedback-header">
                    <h3>💜 Compartí tu Feedback</h3>
                    <button class="cerrar-feedback" onclick="window.feedbackComunidad?.cerrarModal()">&times;</button>
                </div>
                <form id="form-feedback-comunidad">
                    <div class="form-feedback-group">
                        <label>¿Qué tipo de feedback querés compartir? *</label>
                        <select id="feedback-tipo" required>
                            <option value="">Seleccionar...</option>
                            <option value="ayuda">💜 Me ayudó / Me está ayudando</option>
                            <option value="agradecimiento">🙏 Agradecimiento</option>
                            <option value="consejo">💡 Consejo o sugerencia</option>
                            <option value="sugerencia_comunidad">🌟 Sugerencia de nueva comunidad</option>
                            <option value="reporte_problema">⚠️ Reportar problema</option>
                            <option value="otro">💬 Otro</option>
                        </select>
                    </div>
                    <div class="form-feedback-group">
                        <label>Tu mensaje: *</label>
                        <textarea id="feedback-mensaje" placeholder="Compartí tus pensamientos... ¿Cómo te ayudó? ¿Qué mejorarías? ¿Tenías alguna sugerencia? Todo es bienvenido 💜" required></textarea>
                    </div>
                    <div class="form-feedback-group">
                        <label>¿Te ayudó esta comunidad? (Opcional)</label>
                        <div class="form-feedback-checkbox">
                            <input type="checkbox" id="feedback-ayudo">
                            <label for="feedback-ayudo" style="font-weight: normal;">Sí, me ayudó</label>
                        </div>
                    </div>
                    <div class="form-feedback-group">
                        <label>Calificación (Opcional)</label>
                        <select id="feedback-calificacion">
                            <option value="">No calificar</option>
                            <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
                            <option value="4">⭐⭐⭐⭐ Muy buena</option>
                            <option value="3">⭐⭐⭐ Buena</option>
                            <option value="2">⭐⭐ Regular</option>
                            <option value="1">⭐ Necesita mejorar</option>
                        </select>
                    </div>
                    <div style="margin-top: 25px;">
                        <button type="submit" class="btn-feedback-enviar">
                            <i class="fas fa-paper-plane"></i> Enviar Feedback
                        </button>
                    </div>
                </form>
                <p style="margin-top: 20px; text-align: center; color: #6B7280; font-size: 0.9rem;">
                    Tu feedback nos ayuda a mejorar. Gracias por tomarte el tiempo 💜
                </p>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Configurar submit
        document.getElementById('form-feedback-comunidad').addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarFeedback();
        });
        
        return modal;
    }
    
    cerrarModal() {
        const modal = document.getElementById('modal-feedback-comunidad');
        if (modal) modal.classList.remove('active');
    }
    
    async enviarFeedback() {
        const tipo = document.getElementById('feedback-tipo').value;
        const mensaje = document.getElementById('feedback-mensaje').value.trim();
        const ayudo = document.getElementById('feedback-ayudo').checked;
        const calificacion = document.getElementById('feedback-calificacion').value ? parseInt(document.getElementById('feedback-calificacion').value) : null;
        
        if (!tipo || !mensaje) {
            alert('⚠️ Por favor completá el tipo y el mensaje');
            return;
        }
        
        try {
            const feedbackData = {
                comunidad_slug: this.comunidadSlug,
                autor_hash: this.autorHash,
                tipo_feedback: tipo,
                mensaje: mensaje,
                ayudó: ayudo || null,
                calificacion: calificacion,
                estado: 'pendiente'
            };
            
            if (this.supabase) {
                const { error } = await this.supabase
                    .from('feedbacks_comunidades')
                    .insert([feedbackData]);
                
                if (error) throw error;
                
                alert('💜 ¡Gracias por tu feedback! Lo valoramos muchísimo.');
                this.cerrarModal();
                document.getElementById('form-feedback-comunidad').reset();
            } else {
                // Modo local (guardar en localStorage)
                const feedbacks = JSON.parse(localStorage.getItem(`feedbacks_${this.comunidadSlug}`) || '[]');
                feedbacks.push({
                    ...feedbackData,
                    id: 'local_' + Date.now(),
                    created_at: new Date().toISOString()
                });
                localStorage.setItem(`feedbacks_${this.comunidadSlug}`, JSON.stringify(feedbacks));
                
                alert('💜 ¡Gracias por tu feedback! (Guardado localmente - se enviará cuando Supabase esté configurado)');
                this.cerrarModal();
            }
        } catch (error) {
            console.error('Error enviando feedback:', error);
            alert('❌ Error al enviar feedback. Por favor intentá de nuevo.');
        }
    }
}

