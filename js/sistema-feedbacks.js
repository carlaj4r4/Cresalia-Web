// ===== SISTEMA DE FEEDBACKS PARA TIENDAS =====
// Version 1.0 - Cresalia Web Platform
// Autor: Carla & Claude
// Descripción: Sistema completo de feedbacks para tiendas con calificaciones, comentarios y estadísticas

const FeedbackSystem = {
    // Configuración
    config: {
        apiUrl: window.location.hostname === 'localhost' 
            ? 'http://localhost:3001/api' 
            : 'https://cresalia-backend.vercel.app/api',
        tiendaId: 'ejemplo-tienda', // Se actualiza dinámicamente
        maxFeedbacksPorPagina: 10
    },

    // Estado
    state: {
        feedbacks: [],
        stats: null,
        paginaActual: 1,
        cargando: false
    },

    // ===== INICIALIZACIÓN =====
    init(tiendaId) {
        console.log('🔄 Inicializando Sistema de Feedbacks...');
        this.config.tiendaId = tiendaId || 'ejemplo-tienda';
        this.cargarFeedbacks();
    },

    // ===== CARGAR FEEDBACKS =====
    async cargarFeedbacks(pagina = 1) {
        try {
            this.state.cargando = true;
            this.mostrarLoading();

            // Usar directamente datos locales para evitar problemas de CORS
            console.log('📋 Cargando feedbacks desde datos locales (evitando CORS)');
            this.cargarFeedbacksLocal(pagina);

        } catch (error) {
            console.error('❌ Error cargando feedbacks:', error);
            this.mostrarError('Error al cargar los feedbacks. Por favor, intenta más tarde.');
            this.ocultarLoading();
        } finally {
            this.state.cargando = false;
        }
    },

    // ===== CARGAR FEEDBACKS DESDE LOCALSTORAGE =====
    cargarFeedbacksLocal(pagina = 1) {
        try {
            const key = `feedbacks_${this.config.tiendaId}`;
            const feedbacksGuardados = JSON.parse(localStorage.getItem(key) || '[]');
            
            // Generar feedbacks de ejemplo si no hay ninguno
            if (feedbacksGuardados.length === 0) {
                this.generarFeedbacksEjemplo();
                const feedbacksEjemplo = JSON.parse(localStorage.getItem(key) || '[]');
                this.state.feedbacks = feedbacksEjemplo;
            } else {
                this.state.feedbacks = feedbacksGuardados;
            }

            // Calcular estadísticas
            this.calcularStats();

            this.renderizarFeedbacks();
            this.renderizarEstadisticas();
            this.ocultarLoading();

            console.log('✅ Feedbacks cargados desde localStorage:', this.state.feedbacks.length);

        } catch (error) {
            console.error('❌ Error cargando feedbacks locales:', error);
            this.mostrarError('Error al cargar feedbacks locales.');
            this.ocultarLoading();
        }
    },

    // ===== GENERAR FEEDBACKS DE EJEMPLO =====
    generarFeedbacksEjemplo() {
        const feedbacksEjemplo = [
            {
                id: 1,
                nombre: 'María González',
                email: 'maria@email.com',
                rating: 5,
                comentario: 'Excelente servicio y productos de muy buena calidad. Los recomiendo totalmente.',
                fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                aprobado: true,
                util: 8
            },
            {
                id: 2,
                nombre: 'Carlos Rodríguez',
                email: 'carlos@email.com',
                rating: 4,
                comentario: 'Muy buena atención al cliente y entrega rápida. Volveré a comprar.',
                fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                aprobado: true,
                util: 5
            },
            {
                id: 3,
                nombre: 'Ana Martínez',
                email: 'ana@email.com',
                rating: 5,
                comentario: 'Productos de excelente calidad y precios muy competitivos. ¡Los recomiendo!',
                fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                aprobado: true,
                util: 12
            }
        ];

        const key = `feedbacks_${this.config.tiendaId}`;
        localStorage.setItem(key, JSON.stringify(feedbacksEjemplo));
        console.log('✅ Feedbacks de ejemplo generados');
    },

    // ===== CALCULAR ESTADÍSTICAS =====
    calcularStats() {
        const feedbacks = this.state.feedbacks.filter(f => f.aprobado);
        
        if (feedbacks.length === 0) {
            this.state.stats = {
                total: 0,
                promedio: 0,
                distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                totalUtil: 0
            };
            return;
        }

        const suma = feedbacks.reduce((acc, f) => acc + (f.rating || f.calificacion || 5), 0);
        const promedio = (suma / feedbacks.length).toFixed(1);
        
        const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        feedbacks.forEach(f => distribucion[f.rating || f.calificacion || 5]++);
        
        const totalUtil = feedbacks.reduce((acc, f) => acc + (f.util || 0), 0);

        this.state.stats = {
            total: feedbacks.length,
            promedio: parseFloat(promedio),
            distribucion,
            totalUtil
        };
    },

    // ===== ENVIAR FEEDBACK =====
    async enviarFeedback(formData) {
        try {
            const response = await fetch(
                `${this.config.apiUrl}/tiendas/${this.config.tiendaId}/feedbacks`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al enviar feedback');
            }

            const result = await response.json();
            console.log('✅ Feedback enviado correctamente');
            
            this.mostrarExito('¡Gracias por tu feedback! Será revisado antes de publicarse.');
            this.cerrarModalFeedback();
            
            // Recargar feedbacks después de 2 segundos
            setTimeout(() => this.cargarFeedbacks(), 2000);

            return result;

        } catch (error) {
            console.error('❌ Error enviando feedback:', error);
            this.mostrarError(error.message || 'Error al enviar el feedback. Por favor, intenta más tarde.');
            throw error;
        }
    },

    // ===== MARCAR COMO ÚTIL =====
    async marcarComoUtil(feedbackId) {
        try {
            const response = await fetch(
                `${this.config.apiUrl}/tiendas/${this.config.tiendaId}/feedbacks/${feedbackId}/util`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error al marcar como útil');
            }

            console.log('✅ Feedback marcado como útil');
            this.mostrarExito('¡Gracias por tu opinión!');
            
            // Actualizar contador en el DOM
            const utilBtn = document.querySelector(`[data-feedback-id="${feedbackId}"] .util-btn`);
            if (utilBtn) {
                const contador = utilBtn.querySelector('.util-count');
                if (contador) {
                    const count = parseInt(contador.textContent) || 0;
                    contador.textContent = count + 1;
                }
            }

        } catch (error) {
            console.error('❌ Error marcando como útil:', error);
            this.mostrarError('Error al procesar tu solicitud.');
        }
    },

    // ===== RENDERIZAR FEEDBACKS =====
    renderizarFeedbacks() {
        const container = document.getElementById('feedbacksContainer');
        if (!container) {
            console.warn('⚠️ Contenedor de feedbacks no encontrado');
            return;
        }

        if (this.state.feedbacks.length === 0) {
            container.innerHTML = `
                <div class="no-feedbacks">
                    <i class="fas fa-comments fa-3x mb-3" style="color: #E5E7EB;"></i>
                    <p>Aún no hay opiniones sobre esta tienda.</p>
                    <p class="text-muted">¡Sé el primero en compartir tu experiencia!</p>
                </div>
            `;
            return;
        }

        const feedbacksHTML = this.state.feedbacks.map(feedback => this.renderizarFeedback(feedback)).join('');
        container.innerHTML = feedbacksHTML;
    },

    // ===== RENDERIZAR UN FEEDBACK =====
    renderizarFeedback(feedback) {
        const fecha = new Date(feedback.fecha_creacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const estrellas = this.renderizarEstrellas(feedback.calificacion || feedback.rating || 5);
        const verificado = feedback.verificado ? '<i class="fas fa-check-circle text-success ms-2" title="Compra verificada"></i>' : '';

        return `
            <div class="feedback-card" data-feedback-id="${feedback.id}">
                <div class="feedback-header">
                    <div class="feedback-user-info">
                        <div class="feedback-avatar">
                            ${(feedback.usuario_nombre || feedback.nombre || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h5 class="feedback-user-name">${this.escapeHtml(feedback.usuario_nombre || feedback.nombre || 'Usuario')}${verificado}</h5>
                            <div class="feedback-rating">${estrellas}</div>
                        </div>
                    </div>
                    <div class="feedback-date">
                        <i class="fas fa-calendar-alt me-1"></i>${fecha}
                    </div>
                </div>
                
                ${(feedback.comentario || feedback.comentario_texto) ? `
                    <div class="feedback-comment">
                        <p>${this.escapeHtml(feedback.comentario || feedback.comentario_texto || 'Sin comentario')}</p>
                    </div>
                ` : ''}
                
                ${feedback.respuesta_tienda ? `
                    <div class="feedback-response">
                        <div class="response-header">
                            <i class="fas fa-store me-2"></i>
                            <strong>Respuesta de la tienda</strong>
                        </div>
                        <p>${this.escapeHtml(feedback.respuesta_tienda)}</p>
                        ${feedback.fecha_respuesta ? `
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>
                                ${new Date(feedback.fecha_respuesta).toLocaleDateString('es-ES')}
                            </small>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="feedback-footer">
                    <button class="util-btn" onclick="FeedbackSystem.marcarComoUtil(${feedback.id})">
                        <i class="fas fa-thumbs-up me-1"></i>
                        Útil <span class="util-count">(${feedback.util_count || 0})</span>
                    </button>
                </div>
            </div>
        `;
    },

    // ===== RENDERIZAR ESTADÍSTICAS =====
    renderizarEstadisticas() {
        const statsContainer = document.getElementById('feedbackStats');
        if (!statsContainer || !this.state.stats) {
            return;
        }

        const stats = this.state.stats;
        const promedio = parseFloat(stats.promedio_calificacion) || 0;
        const total = parseInt(stats.total_feedbacks) || 0;

        const estrellas = this.renderizarEstrellas(Math.round(promedio));

        statsContainer.innerHTML = `
            <div class="feedback-stats-card">
                <div class="stats-overview">
                    <div class="stats-rating-large">
                        <div class="rating-number">${promedio.toFixed(1)}</div>
                        <div class="rating-stars">${estrellas}</div>
                        <div class="rating-count">${total} ${total === 1 ? 'opinión' : 'opiniones'}</div>
                    </div>
                    
                    <div class="stats-breakdown">
                        ${this.renderizarBarraEstadistica(5, stats.total_5_estrellas || 0, total)}
                        ${this.renderizarBarraEstadistica(4, stats.total_4_estrellas || 0, total)}
                        ${this.renderizarBarraEstadistica(3, stats.total_3_estrellas || 0, total)}
                        ${this.renderizarBarraEstadistica(2, stats.total_2_estrellas || 0, total)}
                        ${this.renderizarBarraEstadistica(1, stats.total_1_estrella || 0, total)}
                    </div>
                </div>
                
                <div class="stats-actions">
                    <button class="btn btn-primary btn-escribir-feedback" onclick="FeedbackSystem.abrirModalFeedback()">
                        <i class="fas fa-pen me-2"></i>Escribir una opinión
                    </button>
                </div>
            </div>
        `;
    },

    // ===== RENDERIZAR BARRA DE ESTADÍSTICA =====
    renderizarBarraEstadistica(estrellas, cantidad, total) {
        const porcentaje = total > 0 ? (cantidad / total * 100).toFixed(0) : 0;
        
        return `
            <div class="stat-bar-row">
                <span class="stat-label">${estrellas} ⭐</span>
                <div class="stat-bar">
                    <div class="stat-bar-fill" style="width: ${porcentaje}%"></div>
                </div>
                <span class="stat-value">${cantidad}</span>
            </div>
        `;
    },

    // ===== RENDERIZAR ESTRELLAS =====
    renderizarEstrellas(calificacion) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= calificacion) {
                html += '<i class="fas fa-star text-warning"></i>';
            } else {
                html += '<i class="far fa-star text-warning"></i>';
            }
        }
        return html;
    },

    // ===== ABRIR MODAL FEEDBACK =====
    abrirModalFeedback() {
        const modal = document.getElementById('feedbackModal');
        if (!modal) {
            console.error('❌ Modal de feedback no encontrado');
            return;
        }
        
        // Resetear formulario
        const form = document.getElementById('feedbackForm');
        if (form) {
            form.reset();
            this.actualizarEstrellasSelecionadas(0);
        }
        
        modal.style.display = 'flex';
    },

    // ===== CERRAR MODAL FEEDBACK =====
    cerrarModalFeedback() {
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // ===== MANEJAR SELECCIÓN DE ESTRELLAS =====
    seleccionarEstrellas(calificacion) {
        const input = document.getElementById('feedbackRating');
        if (input) {
            input.value = calificacion;
        }
        this.actualizarEstrellasSelecionadas(calificacion);
    },

    actualizarEstrellasSelecionadas(calificacion) {
        const estrellas = document.querySelectorAll('.rating-star');
        estrellas.forEach((estrella, index) => {
            if (index < calificacion) {
                estrella.classList.remove('far');
                estrella.classList.add('fas');
            } else {
                estrella.classList.remove('fas');
                estrella.classList.add('far');
            }
        });
    },

    // ===== MANEJAR ENVÍO DE FORMULARIO =====
    async handleSubmitFeedback(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = {
            usuario_nombre: form.nombre.value.trim(),
            usuario_email: form.email?.value?.trim() || '',
            calificacion: parseInt(form.rating.value),
            comentario: form.comentario.value.trim()
        };

        // Validaciones
        if (!formData.usuario_nombre) {
            this.mostrarError('Por favor, ingresa tu nombre');
            return;
        }

        if (!formData.calificacion || formData.calificacion < 1 || formData.calificacion > 5) {
            this.mostrarError('Por favor, selecciona una calificación');
            return;
        }

        try {
            await this.enviarFeedback(formData);
        } catch (error) {
            // Error ya manejado en enviarFeedback
        }
    },

    // ===== UTILIDADES =====
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    mostrarLoading() {
        const container = document.getElementById('feedbacksContainer');
        if (container) {
            container.innerHTML = `
                <div class="feedback-loading">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-3">Cargando opiniones...</p>
                </div>
            `;
        }
    },

    ocultarLoading() {
        // Loading se reemplaza con el contenido real
    },

    mostrarExito(mensaje) {
        this.mostrarNotificacion(mensaje, 'success');
    },

    mostrarError(mensaje) {
        this.mostrarNotificacion(mensaje, 'error');
    },

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Usar sistema de notificaciones elegantes si existe
        if (typeof mostrarNotificacionElegante === 'function') {
            mostrarNotificacionElegante(mensaje, tipo);
            return;
        }

        // Fallback a alert
        alert(mensaje);
    }
};

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', function() {
    // Detectar tienda actual desde la URL o config
    const pathParts = window.location.pathname.split('/');
    const tiendaIndex = pathParts.indexOf('tiendas');
    const tiendaId = tiendaIndex >= 0 && pathParts[tiendaIndex + 1] 
        ? pathParts[tiendaIndex + 1] 
        : 'ejemplo-tienda';

    // Inicializar si hay contenedor de feedbacks
    if (document.getElementById('feedbacksContainer')) {
        FeedbackSystem.init(tiendaId);
    }
});

// Exportar para uso global
window.FeedbackSystem = FeedbackSystem;

console.log('✅ Sistema de Feedbacks cargado correctamente');

