// ===== SISTEMA DE FEEDBACKS GENERAL PARA TODAS LAS PÁGINAS =====
// Version 1.0 - Cresalia Web Platform
// Autor: Carla & Claude
// Descripción: Sistema de feedbacks general para cualquier página (no solo tiendas)

const SistemaFeedbacksGeneral = {
    // Configuración
    config: {
        paginaActual: window.location.pathname || 'index.html',
        tiposFeedback: [
            { valor: 'reclamo', texto: '😤 Reclamo', icono: 'fa-exclamation-triangle' },
            { valor: 'recomendacion', texto: '💡 Recomendación', icono: 'fa-lightbulb' },
            { valor: 'consejo', texto: '🎯 Consejo', icono: 'fa-bullseye' },
            { valor: 'agradecimiento', texto: '🙏 Agradecimiento', icono: 'fa-heart' },
            { valor: 'sugerencia', texto: '✨ Sugerencia', icono: 'fa-star' },
            { valor: 'problema', texto: '🐛 Reportar Problema', icono: 'fa-bug' },
            { valor: 'general', texto: '💭 Comentario General', icono: 'fa-comment' }
        ]
    },

    // Estado
    state: {
        supabase: null,
        modalAbierto: false
    },

    // ===== INICIALIZACIÓN =====
    async init() {
        try {
            // NO inicializar en páginas de tiendas - solo en index-cresalia.html y comunidades
            const isTiendaPage = window.location.pathname.includes('/tiendas/') && 
                                 !window.location.pathname.includes('/admin');
            
            if (isTiendaPage) {
                console.log('⚠️ Sistema de feedbacks general no se inicializa en páginas de tiendas');
                return;
            }
            
            // Verificar si Supabase está disponible
            let supabaseClient = null;

            if (typeof window.initSupabase === 'function') {
                try {
                    supabaseClient = window.initSupabase();
                } catch (initError) {
                    console.warn('⚠️ No se pudo inicializar Supabase desde initSupabase:', initError);
                }
            }

            if (!supabaseClient && typeof window.SUPABASE_CLIENT !== 'undefined' && window.SUPABASE_CLIENT && typeof window.SUPABASE_CLIENT.from === 'function') {
                supabaseClient = window.SUPABASE_CLIENT;
            }

            if (!supabaseClient && typeof supabase !== 'undefined' && supabase && typeof supabase.from === 'function') {
                supabaseClient = supabase;
            }

            if (supabaseClient && typeof supabaseClient.from === 'function') {
                this.state.supabase = supabaseClient;
            } else {
                console.warn('⚠️ Supabase no está disponible, usando localStorage como respaldo');
                this.state.supabase = null;
            }

            // Verificar si ya existe otro botón de feedback (evitar duplicados)
            if (document.getElementById('btnFeedbackFlotante') || document.getElementById('btn-feedback-comunidad')) {
                console.log('⚠️ Ya existe un botón de feedback, no se creará otro');
                return;
            }

            // Crear botón flotante si no existe
            this.crearBotonFlotante();
            console.log('✅ Sistema de Feedbacks General inicializado');
        } catch (error) {
            console.error('❌ Error inicializando sistema de feedbacks:', error);
        }
    },

    // ===== CREAR BOTÓN FLOTANTE =====
    crearBotonFlotante() {
        // Verificar si ya existe
        if (document.getElementById('btnFeedbackFlotante')) {
            return;
        }

        // Crear botón flotante
        const boton = document.createElement('button');
        boton.id = 'btnFeedbackFlotante';
        boton.innerHTML = '<i class="fas fa-comment-dots"></i>';
        boton.title = 'Dejar Feedback';
        boton.setAttribute('aria-label', 'Abrir formulario de feedback');
        
        // Estilos del botón (ajustado para no superponerse con Brevo)
        // Posición: más arriba y a la izquierda para no chocar con Brevo (que está en bottom-right)
        boton.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 90px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            z-index: 9996;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Ajuste responsive para móviles
        if (window.innerWidth <= 768) {
            boton.style.bottom = '85px';
            boton.style.right = '85px';
        }

        // Hover effect
        boton.addEventListener('mouseenter', () => {
            boton.style.transform = 'scale(1.1)';
            boton.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
        });

        boton.addEventListener('mouseleave', () => {
            boton.style.transform = 'scale(1)';
            boton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        });

        // Click handler
        boton.addEventListener('click', () => {
            this.abrirModal();
        });

        document.body.appendChild(boton);
    },

    // ===== ABRIR MODAL =====
    abrirModal() {
        if (this.state.modalAbierto) return;

        this.state.modalAbierto = true;
        this.crearModal();
    },

    // ===== CREAR MODAL =====
    crearModal() {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.id = 'feedbackModalOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        // Crear modal
        const modal = document.createElement('div');
        modal.id = 'feedbackModal';
        modal.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        `;

        // Contenido del modal
        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #667eea; font-size: 1.8rem;">
                    <i class="fas fa-comment-dots"></i> Dejar Feedback
                </h2>
                <button id="cerrarFeedbackModal" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #6B7280;
                    cursor: pointer;
                    padding: 5px 10px;
                ">×</button>
            </div>
            
            <p style="color: #6B7280; margin-bottom: 20px;">
                Tu opinión nos ayuda a mejorar Cresalia. Podés dejarnos un comentario, sugerencia, reportar un problema o simplemente agradecernos.
            </p>
            
            <form id="formFeedbackGeneral">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                        Tipo de Feedback
                    </label>
                    <select id="tipoFeedback" required style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #E5E7EB;
                        border-radius: 10px;
                        font-size: 1rem;
                        background: white;
                    ">
                        <option value="">Selecciona el tipo</option>
                        ${this.config.tiposFeedback.map(t => 
                            `<option value="${t.valor}">${t.texto}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                        Tu Email (opcional)
                    </label>
                    <input type="email" id="emailFeedback" placeholder="tu@email.com" style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #E5E7EB;
                        border-radius: 10px;
                        font-size: 1rem;
                    ">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                        Tu Mensaje
                    </label>
                    <textarea id="mensajeFeedback" required rows="5" placeholder="Cuéntanos qué piensas..." style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #E5E7EB;
                        border-radius: 10px;
                        font-size: 1rem;
                        resize: vertical;
                        font-family: inherit;
                    "></textarea>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                        ¿Cómo calificarías esta página? (opcional)
                    </label>
                    <div id="estrellasFeedback" style="font-size: 28px; color: #D1D5DB; cursor: pointer;">
                        ${Array(5).fill(0).map((_, i) => 
                            `<i class="far fa-star" data-rating="${i + 1}" style="margin-right: 5px; transition: all 0.2s;"></i>`
                        ).join('')}
                    </div>
                    <input type="hidden" id="puntuacionFeedback" value="">
                </div>
                
                <div id="feedbackError" style="
                    display: none;
                    background: #FEE2E2;
                    color: #DC2626;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                "></div>
                
                <div id="feedbackSuccess" style="
                    display: none;
                    background: #D1FAE5;
                    color: #065F46;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                "></div>
                
                <button type="submit" style="
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                ">
                    <i class="fas fa-paper-plane"></i> Enviar Feedback
                </button>
            </form>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Agregar animaciones CSS si no existen
        if (!document.getElementById('feedbackModalStyles')) {
            const style = document.createElement('style');
            style.id = 'feedbackModalStyles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                #feedbackModal button:hover {
                    opacity: 0.8;
                }
                #feedbackModal select:focus,
                #feedbackModal input:focus,
                #feedbackModal textarea:focus {
                    outline: none;
                    border-color: #667eea;
                }
            `;
            document.head.appendChild(style);
        }

        // Event listeners
        document.getElementById('cerrarFeedbackModal').addEventListener('click', () => {
            this.cerrarModal();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.cerrarModal();
            }
        });

        // Sistema de estrellas
        const estrellas = modal.querySelectorAll('#estrellasFeedback .fa-star');
        let rating = 0;
        
        estrellas.forEach((estrella, index) => {
            estrella.addEventListener('mouseenter', () => {
                this.resaltarEstrellas(estrellas, index + 1);
            });
            
            estrella.addEventListener('click', () => {
                rating = index + 1;
                document.getElementById('puntuacionFeedback').value = rating;
                this.resaltarEstrellas(estrellas, rating, true);
            });
        });

        document.getElementById('estrellasFeedback').addEventListener('mouseleave', () => {
            if (rating === 0) {
                this.resaltarEstrellas(estrellas, 0);
            } else {
                this.resaltarEstrellas(estrellas, rating, true);
            }
        });

        // Submit handler
        document.getElementById('formFeedbackGeneral').addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarFeedback();
        });
    },

    // ===== RESALTAR ESTRELLAS =====
    resaltarEstrellas(estrellas, cantidad, permanente = false) {
        estrellas.forEach((estrella, index) => {
            if (index < cantidad) {
                estrella.classList.remove('far');
                estrella.classList.add('fas');
                estrella.style.color = '#FBBF24';
            } else {
                estrella.classList.remove('fas');
                estrella.classList.add('far');
                estrella.style.color = '#D1D5DB';
            }
        });
    },

    // ===== ENVIAR FEEDBACK =====
    async enviarFeedback() {
        const form = document.getElementById('formFeedbackGeneral');
        const tipo = document.getElementById('tipoFeedback').value;
        const email = document.getElementById('emailFeedback').value || 'anonimo@cresalia.com';
        const mensaje = document.getElementById('mensajeFeedback').value;
        const puntuacion = document.getElementById('puntuacionFeedback').value || null;

        const errorDiv = document.getElementById('feedbackError');
        const successDiv = document.getElementById('feedbackSuccess');

        // Validación
        if (!tipo || !mensaje) {
            errorDiv.textContent = 'Por favor, completa todos los campos requeridos.';
            errorDiv.style.display = 'block';
            return;
        }

        // Deshabilitar botón
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        try {
            const feedbackData = {
                usuario_email: email,
                tipo_feedback: tipo,
                mensaje: mensaje,
                puntuacion: puntuacion ? parseInt(puntuacion) : null,
                pagina: this.config.paginaActual,
                fecha_feedback: new Date().toISOString()
            };

            // Intentar guardar en Supabase
            if (this.state.supabase) {
                const { data, error } = await this.state.supabase
                    .from('feedbacks_generales')
                    .insert([feedbackData])
                    .select();

                if (error) throw error;

                console.log('✅ Feedback guardado en Supabase:', data);
            } else {
                // Fallback a localStorage
                const feedbacks = JSON.parse(localStorage.getItem('feedbacks_generales') || '[]');
                feedbackData.id = Date.now();
                feedbacks.push(feedbackData);
                localStorage.setItem('feedbacks_generales', JSON.stringify(feedbacks));
                console.log('✅ Feedback guardado en localStorage (respaldo)');
            }

            // Mostrar éxito
            successDiv.textContent = '¡Gracias por tu feedback! 💜 Tu opinión es muy valiosa para nosotros.';
            successDiv.style.display = 'block';
            errorDiv.style.display = 'none';

            // Limpiar formulario
            form.reset();
            document.getElementById('puntuacionFeedback').value = '';
            this.resaltarEstrellas(document.querySelectorAll('#estrellasFeedback .fa-star'), 0);

            // Cerrar modal después de 2 segundos
            setTimeout(() => {
                this.cerrarModal();
            }, 2000);

        } catch (error) {
            console.error('❌ Error enviando feedback:', error);
            errorDiv.textContent = 'Hubo un error al enviar tu feedback. Por favor, intenta más tarde.';
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    },

    // ===== CERRAR MODAL =====
    cerrarModal() {
        const overlay = document.getElementById('feedbackModalOverlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                overlay.remove();
                this.state.modalAbierto = false;
            }, 300);
        }
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        SistemaFeedbacksGeneral.init();
    });
} else {
    SistemaFeedbacksGeneral.init();
}


