// ===== SISTEMA DE CHATBOT DINÁMICO =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

class DynamicChatbotSystem {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.config = {
            nombre: 'Cresalia AI',
            avatar: 'fas fa-brain',
            color_primario: '#7C3AED',
            color_secundario: '#A78BFA',
            tono: 'amigable',
            mensaje_bienvenida: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?',
            activo: false
        };
        this.dynamicKnowledge = {
            productos: [],
            ofertas: [],
            faq: [],
            soporte: []
        };
        this.tenant_id = null;
        this.init();
    }

    init() {
        this.loadConfig();
        this.loadTenantData();
        this.createChatbotHTML();
        this.bindEvents();
        this.loadDynamicKnowledge();
    }

    // Cargar configuración
    loadConfig() {
        if (typeof planSystem !== 'undefined') {
            this.config.activo = planSystem.isFeatureAvailable('chatbot_ia');
        }

        const savedConfig = localStorage.getItem('chatbot_config');
        if (savedConfig) {
            this.config = { ...this.config, ...JSON.parse(savedConfig) };
        }
    }

    // Cargar datos del tenant
    loadTenantData() {
        if (typeof TIENDA_CONFIG !== 'undefined') {
            this.tenant_id = TIENDA_CONFIG.slug;
            this.config.nombre = `${TIENDA_CONFIG.nombre} AI`;
        }
    }

    // Cargar conocimiento dinámico
    async loadDynamicKnowledge() {
        if (!this.tenant_id) return;

        try {
            // Cargar productos
            await this.loadProducts();
            
            // Cargar ofertas
            await this.loadOffers();
            
            // Cargar FAQ
            await this.loadFAQ();
            
            // Cargar soporte técnico
            await this.loadSupport();
            
            console.log('🤖 Conocimiento dinámico cargado para:', this.tenant_id);
        } catch (error) {
            console.error('Error cargando conocimiento dinámico:', error);
        }
    }

    // Cargar productos desde la API
    async loadProducts() {
        try {
            const response = await fetch(`/api/${this.tenant_id}/productos`);
            if (response.ok) {
                const productos = await response.json();
                this.dynamicKnowledge.productos = productos;
                console.log(`📦 ${productos.length} productos cargados`);
            }
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    }

    // Cargar ofertas y combos
    async loadOffers() {
        try {
            const response = await fetch(`/api/${this.tenant_id}/ofertas`);
            if (response.ok) {
                const ofertas = await response.json();
                this.dynamicKnowledge.ofertas = ofertas;
                console.log(`🎯 ${ofertas.length} ofertas cargadas`);
            }
        } catch (error) {
            console.error('Error cargando ofertas:', error);
            // Ofertas por defecto si no hay API
            this.dynamicKnowledge.ofertas = [
                {
                    id: 1,
                    titulo: 'Oferta Especial',
                    descripcion: 'Descuento del 20% en productos seleccionados',
                    descuento: 20,
                    activa: true
                }
            ];
        }
    }

    // Cargar FAQ personalizado
    async loadFAQ() {
        try {
            const response = await fetch(`/api/${this.tenant_id}/faq`);
            if (response.ok) {
                const faq = await response.json();
                this.dynamicKnowledge.faq = faq;
                console.log(`❓ ${faq.length} preguntas FAQ cargadas`);
            }
        } catch (error) {
            console.error('Error cargando FAQ:', error);
            // FAQ por defecto
            this.dynamicKnowledge.faq = [
                {
                    pregunta: '¿Cuáles son los métodos de pago?',
                    respuesta: 'Aceptamos Mercado Pago, transferencia bancaria y pagos en efectivo.'
                },
                {
                    pregunta: '¿Hacen envíos?',
                    respuesta: 'Sí, realizamos envíos a todo el país. El costo depende de la ubicación.'
                },
                {
                    pregunta: '¿Cuánto tiempo tarda el envío?',
                    respuesta: 'Los envíos tardan entre 3 a 7 días hábiles dependiendo de la zona.'
                }
            ];
        }
    }

    // Cargar soporte técnico
    async loadSupport() {
        try {
            const response = await fetch(`/api/${this.tenant_id}/soporte`);
            if (response.ok) {
                const soporte = await response.json();
                this.dynamicKnowledge.soporte = soporte;
                console.log(`🎧 ${soporte.length} temas de soporte cargados`);
            }
        } catch (error) {
            console.error('Error cargando soporte:', error);
            // Soporte por defecto
            this.dynamicKnowledge.soporte = [
                {
                    tema: 'Problemas de pago',
                    solucion: 'Si tienes problemas con el pago, contacta a nuestro soporte técnico.'
                },
                {
                    tema: 'Problemas de envío',
                    solucion: 'Para consultas sobre envíos, revisa el estado de tu pedido en tu cuenta.'
                }
            ];
        }
    }

    // Crear HTML del chatbot
    createChatbotHTML() {
        if (!this.config.activo) return;

        const chatbotHTML = `
            <div class="chatbot-ia-container" id="chatbotIAContainer">
                <button class="chatbot-ia-toggle" onclick="dynamicChatbot.toggle()">
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
                        <button class="chatbot-ia-close" onclick="dynamicChatbot.toggle()">
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
                            <input type="text" id="chatbotIAInput" placeholder="Escribe tu consulta..." onkeypress="dynamicChatbot.handleKeyPress(event)">
                            <button onclick="dynamicChatbot.sendMessage()" class="send-btn">
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
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.toggle();
            }
        });

        document.addEventListener('click', (e) => {
            const container = document.getElementById('chatbotIAContainer');
            if (container && this.isOpen && !container.contains(e.target)) {
                this.toggle();
            }
        });
    }

    // Alternar chatbot
    toggle() {
        this.isOpen = !this.isOpen;
        const modal = document.getElementById('chatbotIAModal');
        
        if (modal) {
            if (this.isOpen) {
                modal.classList.add('active');
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

        this.addMessage(message, 'user');
        input.value = '';

        // Mostrar indicador de escritura
        this.showTypingIndicator();

        // Procesar mensaje después de un delay
        setTimeout(() => {
            this.processMessage(message);
        }, 1000 + Math.random() * 2000);
    }

    // Agregar mensaje
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

        setTimeout(() => {
            if (typingDiv.parentNode) {
                typingDiv.remove();
            }
        }, 3000);
    }

    // Procesar mensaje
    processMessage(message) {
        const response = this.generateDynamicResponse(message);
        this.addMessage(response, 'bot');
    }

    // Generar respuesta dinámica
    generateDynamicResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Buscar productos específicos
        const productResponse = this.searchProducts(lowerMessage);
        if (productResponse) return productResponse;

        // Buscar ofertas
        const offerResponse = this.searchOffers(lowerMessage);
        if (offerResponse) return offerResponse;

        // Buscar en FAQ
        const faqResponse = this.searchFAQ(lowerMessage);
        if (faqResponse) return faqResponse;

        // Buscar soporte técnico
        const supportResponse = this.searchSupport(lowerMessage);
        if (supportResponse) return supportResponse;

        // Respuestas por palabras clave
        return this.generateKeywordResponse(lowerMessage);
    }

    // Buscar productos
    searchProducts(message) {
        for (const producto of this.dynamicKnowledge.productos) {
            if (message.includes(producto.nombre.toLowerCase()) || 
                message.includes(producto.categoria?.toLowerCase()) ||
                this.calculateSimilarity(message, producto.nombre.toLowerCase()) > 0.6) {
                
                return `Tenemos ${producto.nombre} disponible por $${producto.precio}. ${producto.descripcion || 'Producto de calidad garantizada.'}`;
            }
        }
        return null;
    }

    // Buscar ofertas
    searchOffers(message) {
        if (message.includes('oferta') || message.includes('descuento') || message.includes('promoción')) {
            const ofertasActivas = this.dynamicKnowledge.ofertas.filter(o => o.activa);
            if (ofertasActivas.length > 0) {
                const oferta = ofertasActivas[0];
                return `¡Tenemos una oferta especial! ${oferta.titulo}: ${oferta.descripcion}. Aprovecha el ${oferta.descuento}% de descuento.`;
            }
        }
        return null;
    }

    // Buscar en FAQ
    searchFAQ(message) {
        for (const item of this.dynamicKnowledge.faq) {
            if (this.calculateSimilarity(message, item.pregunta.toLowerCase()) > 0.5) {
                return item.respuesta;
            }
        }
        return null;
    }

    // Buscar soporte técnico
    searchSupport(message) {
        for (const item of this.dynamicKnowledge.soporte) {
            if (message.includes(item.tema.toLowerCase())) {
                return item.solucion;
            }
        }
        return null;
    }

    // Generar respuesta por palabras clave
    generateKeywordResponse(message) {
        if (message.includes('precio') || message.includes('costo') || message.includes('cuanto')) {
            return `Los precios varían según el producto. Tenemos ${this.dynamicKnowledge.productos.length} productos disponibles. ¿Te interesa algún producto específico?`;
        }

        if (message.includes('contacto') || message.includes('telefono') || message.includes('email')) {
            return 'Puedes contactarnos a través de nuestro teléfono, email o WhatsApp. Los datos de contacto están en la sección de contacto.';
        }

        if (message.includes('ubicacion') || message.includes('direccion') || message.includes('donde')) {
            return 'Nuestra ubicación está disponible en el mapa de contacto. También realizamos envíos a todo el país.';
        }

        if (message.includes('envio') || message.includes('entrega')) {
            return 'Realizamos envíos a todo el país. El costo y tiempo de entrega dependen de tu ubicación. ¿Desde dónde nos escribes?';
        }

        // Respuesta por defecto
        const defaultResponses = [
            'Entiendo tu consulta. ¿Podrías ser más específico para poder ayudarte mejor?',
            'Esa es una buena pregunta. Te recomiendo revisar nuestro catálogo de productos.',
            'Gracias por tu consulta. ¿Hay algo específico sobre nuestros productos que te gustaría saber?',
            'Estoy aquí para ayudarte. ¿Podrías contarme más detalles sobre lo que necesitas?'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Calcular similitud entre textos
    calculateSimilarity(text1, text2) {
        const words1 = text1.split(' ');
        const words2 = text2.split(' ');
        const commonWords = words1.filter(word => words2.includes(word));
        return commonWords.length / Math.max(words1.length, words2.length);
    }

    // Actualizar conocimiento dinámico
    async updateKnowledge() {
        await this.loadDynamicKnowledge();
        console.log('🤖 Conocimiento dinámico actualizado');
    }

    // Configurar chatbot
    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem('chatbot_config', JSON.stringify(this.config));
        
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

    // Obtener estadísticas
    getStats() {
        return {
            total_messages: this.messages.length,
            productos_cargados: this.dynamicKnowledge.productos.length,
            ofertas_cargadas: this.dynamicKnowledge.ofertas.length,
            faq_cargadas: this.dynamicKnowledge.faq.length,
            soporte_cargado: this.dynamicKnowledge.soporte.length,
            is_active: this.config.activo,
            tenant_id: this.tenant_id
        };
    }
}

// Instancia global
const dynamicChatbot = new DynamicChatbotSystem();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicChatbotSystem;
}























