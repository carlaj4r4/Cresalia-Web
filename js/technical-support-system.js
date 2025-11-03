// ===== SISTEMA DE SOPORTE TÉCNICO PERSONALIZABLE =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

class TechnicalSupportSystem {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.config = {
            nombre: 'Soporte Técnico',
            avatar: 'fas fa-headset',
            color_primario: '#3B82F6',
            color_secundario: '#60A5FA',
            horarios: {
                lunes_viernes: '9:00 - 18:00',
                sabados: '10:00 - 14:00',
                domingos: 'Cerrado'
            },
            contacto: {
                telefono: '+54 11 1234-5678',
                email: 'soporte@cresalia.com',
                whatsapp: '+54 11 1234-5678'
            },
            activo: true
        };
        this.init();
    }

    init() {
        this.loadConfig();
        this.createSupportWidget();
        this.bindEvents();
    }

    // Cargar configuración
    loadConfig() {
        // Cargar configuración personalizada si existe
        const savedConfig = localStorage.getItem('support_config');
        if (savedConfig) {
            this.config = { ...this.config, ...JSON.parse(savedConfig) };
        }

        // Obtener configuración de la tienda si está disponible
        if (typeof TIENDA_CONFIG !== 'undefined') {
            this.config.contacto = {
                telefono: TIENDA_CONFIG.contacto.telefono,
                email: TIENDA_CONFIG.contacto.email,
                whatsapp: TIENDA_CONFIG.contacto.whatsapp
            };
        }
    }

    // Crear widget de soporte
    createSupportWidget() {
        const widgetHTML = `
            <div class="technical-support-widget" id="technicalSupportWidget">
                <button class="technical-support-toggle" onclick="technicalSupport.toggle()">
                    <div class="technical-support-icon">
                        <i class="${this.config.avatar}"></i>
                    </div>
                    <div class="technical-support-text">
                        <span>${this.config.nombre}</span>
                    </div>
                </button>
                
                <div class="technical-support-modal" id="technicalSupportModal">
                    <div class="technical-support-header">
                        <div class="technical-support-header-content">
                            <div class="technical-support-avatar" style="background: linear-gradient(135deg, ${this.config.color_primario}, ${this.config.color_secundario});">
                                <i class="${this.config.avatar}"></i>
                            </div>
                            <div class="technical-support-header-info">
                                <h3>${this.config.nombre}</h3>
                                <span class="technical-support-status">En línea</span>
                            </div>
                        </div>
                        <button class="technical-support-close" onclick="technicalSupport.toggle()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="technical-support-content" id="technicalSupportContent">
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
        const content = document.getElementById('technicalSupportContent');
        if (!content) return;

        content.innerHTML = `
            <div class="technical-support-welcome">
                <div class="welcome-icon">
                    <i class="${this.config.avatar}"></i>
                </div>
                <h4>¿En qué podemos ayudarte?</h4>
                <p>Nuestro equipo de soporte está aquí para resolver tus dudas técnicas</p>
                
                <div class="support-options">
                    <button class="support-option" onclick="technicalSupport.showContactOptions()">
                        <i class="fas fa-phone"></i>
                        <span>Contacto Directo</span>
                    </button>
                    <button class="support-option" onclick="technicalSupport.showFAQ()">
                        <i class="fas fa-question-circle"></i>
                        <span>Preguntas Frecuentes</span>
                    </button>
                    <button class="support-option" onclick="technicalSupport.showTicketForm()">
                        <i class="fas fa-ticket-alt"></i>
                        <span>Crear Ticket</span>
                    </button>
                    <button class="support-option" onclick="technicalSupport.showLiveChat()">
                        <i class="fas fa-comments"></i>
                        <span>Chat en Vivo</span>
                    </button>
                </div>
                
                <div class="support-info">
                    <div class="support-hours">
                        <h5><i class="fas fa-clock"></i> Horarios de Atención</h5>
                        <p>Lunes a Viernes: ${this.config.horarios.lunes_viernes}</p>
                        <p>Sábados: ${this.config.horarios.sabados}</p>
                        <p>Domingos: ${this.config.horarios.domingos}</p>
                    </div>
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
            const widget = document.getElementById('technicalSupportWidget');
            if (widget && this.isOpen && !widget.contains(e.target)) {
                this.toggle();
            }
        });
    }

    // Alternar widget
    toggle() {
        this.isOpen = !this.isOpen;
        const modal = document.getElementById('technicalSupportModal');
        
        if (modal) {
            if (this.isOpen) {
                modal.classList.add('active');
            } else {
                modal.classList.remove('active');
            }
        }
    }

    // Mostrar opciones de contacto
    showContactOptions() {
        const content = document.getElementById('technicalSupportContent');
        if (!content) return;

        content.innerHTML = `
            <div class="contact-options">
                <h4><i class="fas fa-phone"></i> Opciones de Contacto</h4>
                
                <div class="contact-methods">
                    <div class="contact-method" onclick="technicalSupport.contactPhone()">
                        <div class="contact-icon phone">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="contact-info">
                            <h5>Llamar Ahora</h5>
                            <p>${this.config.contacto.telefono}</p>
                        </div>
                    </div>
                    
                    <div class="contact-method" onclick="technicalSupport.contactWhatsApp()">
                        <div class="contact-icon whatsapp">
                            <i class="fab fa-whatsapp"></i>
                        </div>
                        <div class="contact-info">
                            <h5>WhatsApp</h5>
                            <p>${this.config.contacto.whatsapp}</p>
                        </div>
                    </div>
                    
                    <div class="contact-method" onclick="technicalSupport.contactEmail()">
                        <div class="contact-icon email">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="contact-info">
                            <h5>Email</h5>
                            <p>${this.config.contacto.email}</p>
                        </div>
                    </div>
                </div>
                
                <div class="contact-actions">
                    <button class="btn-back" onclick="technicalSupport.loadInitialContent()">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
            </div>
        `;
    }

    // Mostrar FAQ
    showFAQ() {
        const content = document.getElementById('technicalSupportContent');
        if (!content) return;

        const faqs = this.getFAQs();

        content.innerHTML = `
            <div class="faq-section">
                <h4><i class="fas fa-question-circle"></i> Preguntas Frecuentes</h4>
                
                <div class="faq-list">
                    ${faqs.map((faq, index) => `
                        <div class="faq-item">
                            <button class="faq-question" onclick="technicalSupport.toggleFAQ(${index})">
                                <span>${faq.pregunta}</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="faq-answer" id="faq-answer-${index}">
                                <p>${faq.respuesta}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="faq-actions">
                    <button class="btn-back" onclick="technicalSupport.loadInitialContent()">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
            </div>
        `;
    }

    // Obtener FAQs
    getFAQs() {
        return [
            {
                pregunta: '¿Cómo agrego productos a mi tienda?',
                respuesta: 'Ve al panel de administración, sección "Productos", y haz clic en "Agregar Producto". Completa la información y sube las imágenes.'
            },
            {
                pregunta: '¿Cómo configuro los métodos de pago?',
                respuesta: 'En el panel de administración, ve a "Configuración de Pagos" y conecta tu cuenta de Mercado Pago o configura pagos en efectivo.'
            },
            {
                pregunta: '¿Cómo personalizo el diseño de mi tienda?',
                respuesta: 'Ve a "Configuración General" en tu panel de admin. Allí puedes cambiar colores, logo, y configurar el diseño de tu tienda.'
            },
            {
                pregunta: '¿Cómo veo las estadísticas de mi tienda?',
                respuesta: 'En el panel de administración, sección "Estadísticas", puedes ver ventas, visitas, productos más vendidos y más métricas.'
            },
            {
                pregunta: '¿Cómo contacto soporte técnico?',
                respuesta: 'Puedes contactarnos por teléfono, WhatsApp, email o crear un ticket de soporte desde este mismo chat.'
            }
        ];
    }

    // Alternar FAQ
    toggleFAQ(index) {
        const answer = document.getElementById(`faq-answer-${index}`);
        const question = answer.previousElementSibling;
        const icon = question.querySelector('i');

        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        } else {
            // Cerrar otros FAQs
            document.querySelectorAll('.faq-answer').forEach(faq => {
                faq.style.display = 'none';
            });
            document.querySelectorAll('.faq-question i').forEach(icon => {
                icon.style.transform = 'rotate(0deg)';
            });

            // Abrir este FAQ
            answer.style.display = 'block';
            icon.style.transform = 'rotate(180deg)';
        }
    }

    // Mostrar formulario de ticket
    showTicketForm() {
        const content = document.getElementById('technicalSupportContent');
        if (!content) return;

        content.innerHTML = `
            <div class="ticket-form">
                <h4><i class="fas fa-ticket-alt"></i> Crear Ticket de Soporte</h4>
                
                <form id="supportTicketForm" onsubmit="technicalSupport.submitTicket(event)">
                    <div class="form-group">
                        <label for="ticketSubject">Asunto</label>
                        <input type="text" id="ticketSubject" required placeholder="Describe brevemente tu problema">
                    </div>
                    
                    <div class="form-group">
                        <label for="ticketCategory">Categoría</label>
                        <select id="ticketCategory" required>
                            <option value="">Selecciona una categoría</option>
                            <option value="tecnico">Problema Técnico</option>
                            <option value="pagos">Problema con Pagos</option>
                            <option value="productos">Gestión de Productos</option>
                            <option value="diseno">Personalización</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="ticketPriority">Prioridad</label>
                        <select id="ticketPriority" required>
                            <option value="baja">Baja - Puede esperar</option>
                            <option value="media" selected>Media - Normal</option>
                            <option value="alta">Alta - Urgente</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="ticketMessage">Descripción del problema</label>
                        <textarea id="ticketMessage" rows="4" required placeholder="Describe detalladamente el problema que estás experimentando..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="ticketEmail">Tu email</label>
                        <input type="email" id="ticketEmail" required placeholder="tu@email.com">
                    </div>
                    
                    <div class="ticket-actions">
                        <button type="button" class="btn-cancel" onclick="technicalSupport.loadInitialContent()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="submit" class="btn-submit">
                            <i class="fas fa-paper-plane"></i> Enviar Ticket
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    // Mostrar chat en vivo
    showLiveChat() {
        const content = document.getElementById('technicalSupportContent');
        if (!content) return;

        content.innerHTML = `
            <div class="live-chat">
                <h4><i class="fas fa-comments"></i> Chat en Vivo</h4>
                
                <div class="chat-status">
                    <div class="status-indicator online">
                        <i class="fas fa-circle"></i>
                        <span>En línea</span>
                    </div>
                    <p>Tiempo de respuesta promedio: 2-5 minutos</p>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="chat-message bot-message">
                        <div class="message-avatar">
                            <i class="${this.config.avatar}"></i>
                        </div>
                        <div class="message-content">
                            <div class="message-text">¡Hola! Soy tu asistente de soporte técnico. ¿En qué puedo ayudarte hoy?</div>
                            <div class="message-time">${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    </div>
                </div>
                
                <div class="chat-input">
                    <div class="input-container">
                        <input type="text" id="chatInput" placeholder="Escribe tu mensaje..." onkeypress="technicalSupport.handleChatKeyPress(event)">
                        <button onclick="technicalSupport.sendChatMessage()" class="send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                
                <div class="chat-actions">
                    <button class="btn-back" onclick="technicalSupport.loadInitialContent()">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
            </div>
        `;
    }

    // Manejar tecla Enter en chat
    handleChatKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendChatMessage();
        }
    }

    // Enviar mensaje de chat
    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Agregar mensaje del usuario
        this.addChatMessage(message, 'user');
        input.value = '';

        // Simular respuesta del soporte
        setTimeout(() => {
            this.simulateSupportResponse(message);
        }, 1000 + Math.random() * 2000);
    }

    // Agregar mensaje al chat
    addChatMessage(text, type) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;

        if (type === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div class="message-avatar user-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="${this.config.avatar}"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Simular respuesta del soporte
    simulateSupportResponse(userMessage) {
        const responses = [
            'Entiendo tu consulta. Déjame ayudarte con eso.',
            'Perfecto, veo el problema. Te voy a guiar paso a paso.',
            'Esa es una excelente pregunta. Te explico cómo solucionarlo.',
            'No te preocupes, es un problema común. Te ayudo a resolverlo.',
            'Gracias por contactarnos. Vamos a solucionar esto juntos.'
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        this.addChatMessage(response, 'bot');
    }

    // Enviar ticket
    async submitTicket(event) {
        event.preventDefault();

        const ticketData = {
            asunto: document.getElementById('ticketSubject').value,
            categoria: document.getElementById('ticketCategory').value,
            prioridad: document.getElementById('ticketPriority').value,
            mensaje: document.getElementById('ticketMessage').value,
            email: document.getElementById('ticketEmail').value
        };

        try {
            elegantNotifications.info('Enviando ticket de soporte...', 'Procesando');

            const response = await fetch('/api/soporte/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticketData)
            });

            if (response.ok) {
                elegantNotifications.success('Ticket creado exitosamente. Te contactaremos pronto.', 'Soporte Técnico');
                this.loadInitialContent();
            } else {
                throw new Error('Error al crear el ticket');
            }
        } catch (error) {
            console.error('Error creando ticket:', error);
            elegantNotifications.error('Error al crear el ticket. Inténtalo de nuevo.', 'Error');
        }
    }

    // Métodos de contacto
    contactPhone() {
        window.open(`tel:${this.config.contacto.telefono}`);
    }

    contactWhatsApp() {
        window.open(`https://wa.me/${this.config.contacto.whatsapp.replace(/[^0-9]/g, '')}?text=Hola, necesito ayuda técnica con mi tienda`);
    }

    contactEmail() {
        window.open(`mailto:${this.config.contacto.email}?subject=Soporte Técnico - Consulta`);
    }

    // Configurar soporte
    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem('support_config', JSON.stringify(this.config));
        this.updateUI();
    }

    // Actualizar interfaz
    updateUI() {
        const widget = document.getElementById('technicalSupportWidget');
        if (widget) {
            widget.remove();
            this.createSupportWidget();
        }
    }
}

// Instancia global
const technicalSupport = new TechnicalSupportSystem();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechnicalSupportSystem;
}























