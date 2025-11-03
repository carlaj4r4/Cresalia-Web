// ===== SISTEMA DE RESPALDO EMOCIONAL PARA EMPRENDEDORES =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

class EmotionalSupportSystem {
    constructor() {
        this.isOpen = false;
        this.currentEmotion = null;
        this.messages = [];
        this.config = {
            activo: false,
            plan: 'free', // free, basic, pro, enterprise
            tenant_id: null
        };
        this.init();
    }

    init() {
        this.loadConfig();
        this.checkAvailability();
        if (this.config.activo) {
            this.createWidget();
            this.bindEvents();
        }
    }

    // Cargar configuración
    loadConfig() {
        // Obtener configuración desde el plan de la tienda
        if (typeof planSystem !== 'undefined') {
            this.config.plan = planSystem.currentPlan;
            this.config.activo = ['free', 'basic'].includes(this.config.plan);
        }

        // Obtener tenant_id si está disponible
        if (typeof TIENDA_CONFIG !== 'undefined') {
            this.config.tenant_id = TIENDA_CONFIG.slug;
        }
    }

    // Verificar disponibilidad
    checkAvailability() {
        // Solo disponible para planes Free y Basic
        if (!['free', 'basic'].includes(this.config.plan)) {
            console.log('ℹ️ Respaldo emocional solo disponible para planes Free y Basic');
            return;
        }

        this.config.activo = true;
        console.log('💜 Sistema de respaldo emocional activado');
    }

    // Crear widget flotante
    createWidget() {
        const widgetHTML = `
            <div class="emotional-support-widget" id="emotionalSupportWidget">
                <button class="emotional-support-toggle" onclick="emotionalSupport.toggle()">
                    <div class="emotional-support-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="emotional-support-text">
                        <span>Apoyo Emocional</span>
                    </div>
                </button>
                
                <div class="emotional-support-modal" id="emotionalSupportModal">
                    <div class="emotional-support-header">
                        <div class="emotional-support-header-content">
                            <div class="emotional-support-avatar">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="emotional-support-header-info">
                                <h3>Tu Espacio de Apoyo</h3>
                                <span class="emotional-support-status">Confidencial y Privado</span>
                            </div>
                        </div>
                        <button class="emotional-support-close" onclick="emotionalSupport.toggle()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="emotional-support-content" id="emotionalSupportContent">
                        <!-- Contenido dinámico -->
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        this.loadInitialContent();
    }

    // Cargar contenido inicial
    loadInitialContent() {
        const content = document.getElementById('emotionalSupportContent');
        if (!content) return;

        content.innerHTML = `
            <div class="emotional-support-welcome">
                <div class="welcome-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h4>¿Cómo te sientes hoy?</h4>
                <p>Este es tu espacio seguro para compartir cómo te sientes con tu emprendimiento</p>
                
                <div class="emotion-selector">
                    <button class="emotion-btn" data-emotion="excelente" onclick="emotionalSupport.selectEmotion('excelente')">
                        <i class="fas fa-rocket"></i>
                        <span>🚀 Excelente</span>
                    </button>
                    <button class="emotion-btn" data-emotion="bien" onclick="emotionalSupport.selectEmotion('bien')">
                        <i class="fas fa-smile"></i>
                        <span>😊 Bien</span>
                    </button>
                    <button class="emotion-btn" data-emotion="regular" onclick="emotionalSupport.selectEmotion('regular')">
                        <i class="fas fa-meh"></i>
                        <span>😐 Regular</span>
                    </button>
                    <button class="emotion-btn" data-emotion="dificil" onclick="emotionalSupport.selectEmotion('dificil')">
                        <i class="fas fa-frown"></i>
                        <span>😔 Difícil</span>
                    </button>
                    <button class="emotion-btn" data-emotion="abrumado" onclick="emotionalSupport.selectEmotion('abrumado')">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>😰 Abrumado</span>
                    </button>
                </div>
                
                <div class="emotional-support-info">
                    <p><i class="fas fa-shield-alt"></i> 100% Privado y Confidencial</p>
                    <p><i class="fas fa-user-secret"></i> Puedes elegir ser anónimo</p>
                    <p><i class="fas fa-clock"></i> Respuesta personalizada de Carla</p>
                </div>
            </div>
        `;
    }

    // Vincular eventos
    bindEvents() {
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggle();
            }
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            const widget = document.getElementById('emotionalSupportWidget');
            if (widget && this.isOpen && !widget.contains(e.target)) {
                this.toggle();
            }
        });
    }

    // Alternar widget
    toggle() {
        this.isOpen = !this.isOpen;
        const modal = document.getElementById('emotionalSupportModal');
        
        if (modal) {
            if (this.isOpen) {
                modal.classList.add('active');
            } else {
                modal.classList.remove('active');
            }
        }
    }

    // Seleccionar emoción
    selectEmotion(emotion) {
        this.currentEmotion = emotion;
        this.showMessageForm(emotion);
    }

    // Mostrar formulario de mensaje
    showMessageForm(emotion) {
        const content = document.getElementById('emotionalSupportContent');
        if (!content) return;

        const emotionData = this.getEmotionData(emotion);
        
        content.innerHTML = `
            <div class="emotional-support-message-form">
                <div class="selected-emotion">
                    <div class="emotion-icon ${emotion}">
                        <i class="${emotionData.icon}"></i>
                    </div>
                    <h4>${emotionData.title}</h4>
                    <p>${emotionData.description}</p>
                </div>
                
                <div class="message-form">
                    <label for="emotionalMessage">Cuéntanos qué está pasando:</label>
                    <textarea id="emotionalMessage" rows="4" placeholder="Comparte cómo te sientes, qué te preocupa, o qué necesitas..."></textarea>
                    
                    <div class="privacy-options">
                        <label class="privacy-option">
                            <input type="checkbox" id="allowAnonymous" checked>
                            <span class="checkmark"></span>
                            <span>Prefiero ser anónimo</span>
                        </label>
                        
                        <label class="privacy-option">
                            <input type="checkbox" id="allowContact">
                            <span class="checkmark"></span>
                            <span>Pueden contactarme para seguimiento</span>
                        </label>
                    </div>
                    
                    <div class="message-actions">
                        <button class="btn-cancel" onclick="emotionalSupport.cancelMessage()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button class="btn-send" onclick="emotionalSupport.sendMessage()">
                            <i class="fas fa-heart"></i> Enviar Mensaje
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Obtener datos de la emoción
    getEmotionData(emotion) {
        const emotions = {
            excelente: {
                icon: 'fas fa-rocket',
                title: '🚀 ¡Excelente!',
                description: 'Me alegra que las cosas vayan tan bien'
            },
            bien: {
                icon: 'fas fa-smile',
                title: '😊 Bien',
                description: 'Es bueno saber que te sientes bien'
            },
            regular: {
                icon: 'fas fa-meh',
                title: '😐 Regular',
                description: 'Entiendo, a veces las cosas no salen como esperamos'
            },
            dificil: {
                icon: 'fas fa-frown',
                title: '😔 Difícil',
                description: 'Los momentos difíciles son parte del proceso'
            },
            abrumado: {
                icon: 'fas fa-exclamation-triangle',
                title: '😰 Abrumado',
                description: 'Respira, estás en el lugar correcto para recibir apoyo'
            }
        };
        
        return emotions[emotion] || emotions.regular;
    }

    // Cancelar mensaje
    cancelMessage() {
        this.currentEmotion = null;
        this.loadInitialContent();
    }

    // Enviar mensaje
    async sendMessage() {
        const message = document.getElementById('emotionalMessage').value.trim();
        const allowAnonymous = document.getElementById('allowAnonymous').checked;
        const allowContact = document.getElementById('allowContact').checked;

        if (!message) {
            elegantNotifications.warning('Por favor escribe un mensaje', 'Mensaje Requerido');
            return;
        }

        try {
            // Mostrar indicador de envío
            elegantNotifications.info('Enviando tu mensaje...', 'Procesando');

            // Enviar al backend
            const response = await fetch('/api/apoyo/mensaje', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tenant_id: this.config.tenant_id,
                    emocion: this.currentEmotion,
                    mensaje: message,
                    anonimo: allowAnonymous,
                    permitir_contacto: allowContact
                })
            });

            if (response.ok) {
                const result = await response.json();
                this.showConfirmation(result);
                elegantNotifications.success('Mensaje enviado exitosamente', 'Apoyo Emocional');
            } else {
                throw new Error('Error al enviar el mensaje');
            }
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            elegantNotifications.error('Error al enviar el mensaje. Inténtalo de nuevo.', 'Error');
        }
    }

    // Mostrar confirmación
    showConfirmation(result) {
        const content = document.getElementById('emotionalSupportContent');
        if (!content) return;

        const urgencyData = this.getUrgencyData(result.urgencia);
        
        content.innerHTML = `
            <div class="emotional-support-confirmation">
                <div class="confirmation-icon ${result.urgencia}">
                    <i class="${urgencyData.icon}"></i>
                </div>
                <h4>💜 Mensaje Enviado</h4>
                <p>Tu mensaje ha sido marcado como <strong>${urgencyData.title}</strong></p>
                <p>Te responderemos en <strong>${urgencyData.tiempo_respuesta}</strong></p>
                
                <div class="confirmation-message">
                    <p>${urgencyData.mensaje_confirmacion}</p>
                </div>
                
                <div class="suggested-resources">
                    <h5>Recursos sugeridos:</h5>
                    <div class="resources-grid">
                        ${result.recursos_sugeridos.map(recurso => `
                            <div class="resource-card">
                                <i class="${recurso.icono}"></i>
                                <span>${recurso.titulo}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="confirmation-actions">
                    <button class="btn-close" onclick="emotionalSupport.toggle()">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                    <button class="btn-new-message" onclick="emotionalSupport.loadInitialContent()">
                        <i class="fas fa-plus"></i> Nuevo Mensaje
                    </button>
                </div>
            </div>
        `;
    }

    // Obtener datos de urgencia
    getUrgencyData(urgencia) {
        const urgencies = {
            critica: {
                icon: 'fas fa-exclamation-triangle',
                title: 'URGENCIA CRÍTICA',
                tiempo_respuesta: '2-4 horas',
                mensaje_confirmacion: 'Tu mensaje es muy importante para nosotros. Te responderemos lo antes posible.'
            },
            alta: {
                icon: 'fas fa-exclamation-circle',
                title: 'URGENCIA ALTA',
                tiempo_respuesta: '4-8 horas',
                mensaje_confirmacion: 'Entendemos que necesitas apoyo. Te responderemos pronto.'
            },
            media: {
                icon: 'fas fa-clock',
                title: 'URGENCIA MEDIA',
                tiempo_respuesta: '24 horas',
                mensaje_confirmacion: 'Gracias por compartir. Te responderemos durante el día.'
            },
            baja: {
                icon: 'fas fa-heart',
                title: 'URGENCIA BAJA',
                tiempo_respuesta: '48 horas',
                mensaje_confirmacion: '¡Qué bueno que compartas tus logros! Te responderemos pronto.'
            }
        };
        
        return urgencies[urgencia] || urgencies.media;
    }
}

// Instancia global
const emotionalSupport = new EmotionalSupportSystem();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmotionalSupportSystem;
}























