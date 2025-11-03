// ===== SISTEMA DE CHATBOT IA PERSONALIZABLE =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

class ChatbotIASystem {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.config = {
            nombre: 'Cresalia AI',
            avatar: 'fas fa-brain',
            color_primario: '#7C3AED',
            color_secundario: '#A78BFA',
            tono: 'amigable', // amigable, profesional, casual
            mensaje_bienvenida: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?',
            activo: false
        };
        this.knowledgeBase = [];
        this.init();
    }

    init() {
        this.loadConfig();
        this.createChatbotHTML();
        this.bindEvents();
        this.loadKnowledgeBase();
    }

    // Cargar configuración del chatbot
    loadConfig() {
        // Obtener configuración desde el plan de la tienda
        if (typeof planSystem !== 'undefined') {
            this.config.activo = planSystem.isFeatureAvailable('chatbot_ia');
        }

        // Cargar configuración personalizada si existe
        const savedConfig = localStorage.getItem('chatbot_config');
        if (savedConfig) {
            this.config = { ...this.config, ...JSON.parse(savedConfig) };
        }
    }

    // Crear HTML del chatbot
    createChatbotHTML() {
        if (!this.config.activo) return;

        const chatbotHTML = `
            <div class="chatbot-ia-container" id="chatbotIAContainer">
                <button class="chatbot-ia-toggle" onclick="chatbotIA.toggle()">
                    <div class="chatbot-ia-toggle-content">
                        <i class="${this.config.avatar}"></i>
                        <span class="chatbot-ia-toggle-text">${this.config.nombre}</span>
                    </div>
                </button>
                
                <div class="chatbot-ia-modal" id="chatbotIAModal">
                    <div class="chatbot-ia-header">
                        <div class="chatbot-ia-header-content">
                            <div class="chatbot-ia-avatar" style="background: linear-gradient(135deg, ${this.config.color_primario}, ${this.config.color_secundario});">
                                <i class="${this.config.avatar}"></i>
                            </div>
                            <div class="chatbot-ia-header-info">
                                <h3>${this.config.nombre}</h3>
                                <span class="chatbot-ia-status">Asistente Inteligente</span>
                            </div>
                        </div>
                        <button class="chatbot-ia-close" onclick="chatbotIA.toggle()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chatbot-ia-messages" id="chatbotIAMessages">
                        <div class="chatbot-ia-message bot-message">
                            <div class="message-avatar" style="background: linear-gradient(135deg, ${this.config.color_primario}, ${this.config.color_secundario});">
                                <i class="${this.config.avatar}"></i>
                            </div>
                            <div class="message-content">
                                <div class="message-text">${this.config.mensaje_bienvenida}</div>
                                <div class="message-time">${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chatbot-ia-input">
                        <div class="input-container">
                            <input type="text" id="chatbotIAInput" placeholder="Escribe tu consulta..." onkeypress="chatbotIA.handleKeyPress(event)">
                            <button onclick="chatbotIA.sendMessage()" class="send-btn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
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
            const container = document.getElementById('chatbotIAContainer');
            if (container && this.isOpen && !container.contains(e.target)) {
                this.toggle();
            }
        });
    }

    // Cargar base de conocimiento
    loadKnowledgeBase() {
        // Base de conocimiento por defecto
        this.knowledgeBase = [
            {
                pregunta: '¿Qué productos tienen?',
                respuesta: 'Tenemos una amplia variedad de productos. Puedes explorar nuestro catálogo completo en la sección de productos.',
                categoria: 'productos'
            },
            {
                pregunta: '¿Cuáles son los métodos de pago?',
                respuesta: 'Aceptamos múltiples métodos de pago: tarjetas de crédito/débito, transferencias bancarias, efectivo y cuotas sin interés.',
                categoria: 'pagos'
            },
            {
                pregunta: '¿Hacen envíos?',
                respuesta: 'Sí, realizamos envíos a todo el país. El costo y tiempo de entrega dependen de tu ubicación.',
                categoria: 'envios'
            },
            {
                pregunta: '¿Cuáles son los horarios de atención?',
                respuesta: 'Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00, y sábados de 10:00 a 14:00.',
                categoria: 'horarios'
            },
            {
                pregunta: '¿Tienen garantía?',
                respuesta: 'Todos nuestros productos incluyen garantía de calidad y satisfacción del cliente.',
                categoria: 'garantia'
            }
        ];

        // Cargar base de conocimiento personalizada si existe
        const customKB = localStorage.getItem('chatbot_knowledge_base');
        if (customKB) {
            this.knowledgeBase = [...this.knowledgeBase, ...JSON.parse(customKB)];
        }
    }

    // Alternar chatbot
    toggle() {
        this.isOpen = !this.isOpen;
        const modal = document.getElementById('chatbotIAModal');
        
        if (modal) {
            if (this.isOpen) {
                modal.classList.add('active');
                document.getElementById('chatbotIAInput').focus();
            } else {
                modal.classList.remove('active');
            }
        }
    }

    // Manejar tecla Enter
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    // Enviar mensaje
    sendMessage() {
        const input = document.getElementById('chatbotIAInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Agregar mensaje del usuario
        this.addMessage(message, 'user');
        input.value = '';

        // Mostrar indicador de escritura
        this.showTypingIndicator();

        // Procesar mensaje
        setTimeout(() => {
            this.processMessage(message);
        }, 1000 + Math.random() * 1000); // Simular tiempo de procesamiento
    }

    // Agregar mensaje al chat
    addMessage(text, type) {
        const messagesContainer = document.getElementById('chatbotIAMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-ia-message ${type}-message`;

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
                <div class="message-avatar" style="background: linear-gradient(135deg, ${this.config.color_primario}, ${this.config.color_secundario});">
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

    // Mostrar indicador de escritura
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotIAMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-ia-message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar" style="background: linear-gradient(135deg, ${this.config.color_primario}, ${this.config.color_secundario});">
                <i class="${this.config.avatar}"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Remover después de un tiempo
        setTimeout(() => {
            if (typingDiv.parentNode) {
                typingDiv.remove();
            }
        }, 3000);
    }

    // Procesar mensaje
    processMessage(message) {
        const response = this.generateResponse(message);
        this.addMessage(response, 'bot');
    }

    // Generar respuesta
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Buscar en la base de conocimiento
        for (const item of this.knowledgeBase) {
            if (lowerMessage.includes(item.pregunta.toLowerCase()) || 
                this.calculateSimilarity(lowerMessage, item.pregunta.toLowerCase()) > 0.6) {
                return this.formatResponse(item.respuesta);
            }
        }

        // Respuestas por palabras clave
        if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuanto')) {
            return this.formatResponse('Los precios varían según el producto. Puedes ver todos los precios en nuestro catálogo de productos.');
        }

        if (lowerMessage.includes('contacto') || lowerMessage.includes('telefono') || lowerMessage.includes('email')) {
            return this.formatResponse('Puedes contactarnos a través de nuestro teléfono, email o WhatsApp. Los datos de contacto están en la sección de contacto.');
        }

        if (lowerMessage.includes('ubicacion') || lowerMessage.includes('direccion') || lowerMessage.includes('donde')) {
            return this.formatResponse('Nuestra ubicación está disponible en el mapa de contacto. También realizamos envíos a todo el país.');
        }

        // Respuesta por defecto
        const defaultResponses = [
            'Entiendo tu consulta. ¿Podrías ser más específico para poder ayudarte mejor?',
            'Esa es una buena pregunta. Te recomiendo revisar nuestra sección de productos o contactarnos directamente.',
            'Gracias por tu consulta. ¿Hay algo específico sobre nuestros productos o servicios que te gustaría saber?',
            'Estoy aquí para ayudarte. ¿Podrías contarme más detalles sobre lo que necesitas?'
        ];

        return this.formatResponse(defaultResponses[Math.floor(Math.random() * defaultResponses.length)]);
    }

    // Formatear respuesta según el tono
    formatResponse(response) {
        switch (this.config.tono) {
            case 'profesional':
                return response;
            case 'casual':
                return response.replace(/\./g, ' 😊').replace(/!/g, ' 🎉');
            case 'amigable':
            default:
                return response;
        }
    }

    // Calcular similitud entre textos (algoritmo simple)
    calculateSimilarity(text1, text2) {
        const words1 = text1.split(' ');
        const words2 = text2.split(' ');
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length / Math.max(words1.length, words2.length);
    }

    // Configurar chatbot
    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem('chatbot_config', JSON.stringify(this.config));
        
        // Actualizar UI si está activo
        if (this.config.activo) {
            this.updateUI();
        }
    }

    // Actualizar interfaz
    updateUI() {
        const container = document.getElementById('chatbotIAContainer');
        if (container) {
            container.remove();
            this.createChatbotHTML();
        }
    }

    // Agregar conocimiento personalizado
    addKnowledge(pregunta, respuesta, categoria = 'general') {
        this.knowledgeBase.push({ pregunta, respuesta, categoria });
        
        // Guardar en localStorage
        const customKB = this.knowledgeBase.filter(item => item.categoria !== 'general');
        localStorage.setItem('chatbot_knowledge_base', JSON.stringify(customKB));
    }

    // Obtener estadísticas del chatbot
    getStats() {
        return {
            total_messages: this.messages.length,
            knowledge_base_size: this.knowledgeBase.length,
            is_active: this.config.activo,
            plan_required: 'Pro o Enterprise'
        };
    }
}

// Instancia global
const chatbotIA = new ChatbotIASystem();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotIASystem;
}























