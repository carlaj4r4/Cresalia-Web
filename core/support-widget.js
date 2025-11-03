// ===== WIDGET DE SOPORTE CRESALIA =====
// Para clientes que pagan - Acceso desde su panel admin

class CresaliaSupportWidget {
    constructor(config) {
        this.config = config;
        this.tenant = config.tenant;
        this.plan = config.plan;
        this.isOpen = false;
        this.unreadCount = 0;
        this.tickets = [];
    }

    // Inicializar widget
    init() {
        console.log(`🎧 Inicializando soporte para ${this.tenant.nombre} (Plan: ${this.plan})`);
        this.createWidget();
        this.loadUnreadTickets();
        this.setupRealTimeUpdates();
    }

    // Crear widget flotante
    createWidget() {
        const widget = document.createElement('div');
        widget.id = 'cresalia-support-widget';
        widget.innerHTML = `
            <!-- Botón flotante -->
            <button id="support-toggle" class="support-toggle">
                <i class="fas fa-headset"></i>
                <span class="support-badge" id="support-badge" style="display: none;">0</span>
            </button>

            <!-- Panel de soporte -->
            <div id="support-panel" class="support-panel" style="display: none;">
                <!-- Header -->
                <div class="support-header">
                    <div class="support-header-content">
                        <div class="support-avatar">
                            <img src="../../assets/cresalia/logo.png" alt="Cresalia">
                            <span class="status-dot online"></span>
                        </div>
                        <div class="support-info">
                            <h3>Soporte Cresalia</h3>
                            <p class="support-plan">
                                <i class="fas fa-crown"></i>
                                Plan ${this.plan}
                            </p>
                        </div>
                    </div>
                    <div class="support-actions">
                        <button class="btn-icon" onclick="supportWidget.minimize()">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="btn-icon" onclick="supportWidget.close()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="support-tabs">
                    <button class="support-tab active" data-tab="chat">
                        <i class="fas fa-comments"></i>
                        Chat en Vivo
                    </button>
                    <button class="support-tab" data-tab="tickets">
                        <i class="fas fa-ticket-alt"></i>
                        Mis Tickets
                        <span class="tab-badge" id="tickets-badge" style="display: none;">0</span>
                    </button>
                    <button class="support-tab" data-tab="help">
                        <i class="fas fa-question-circle"></i>
                        Ayuda
                    </button>
                </div>

                <!-- Contenido de tabs -->
                <div class="support-content">
                    <!-- Chat en Vivo -->
                    <div class="support-tab-content active" id="tab-chat">
                        ${this.renderChatTab()}
                    </div>

                    <!-- Mis Tickets -->
                    <div class="support-tab-content" id="tab-tickets">
                        ${this.renderTicketsTab()}
                    </div>

                    <!-- Centro de Ayuda -->
                    <div class="support-tab-content" id="tab-help">
                        ${this.renderHelpTab()}
                    </div>
                </div>
            </div>

            ${this.getStyles()}
        `;

        document.body.appendChild(widget);
        this.setupEventListeners();
    }

    // Tab de Chat en Vivo
    renderChatTab() {
        const responseTime = this.plan === 'pro' || this.plan === 'enterprise' 
            ? '~2 min' 
            : this.plan === 'basic' 
            ? '~5 min' 
            : '~15 min';

        return `
            <div class="chat-container">
                <!-- Status -->
                <div class="chat-status">
                    <div class="status-indicator">
                        <span class="status-dot online"></span>
                        <span>Nuestro equipo está disponible</span>
                    </div>
                    <div class="response-time">
                        <i class="fas fa-clock"></i>
                        Tiempo de respuesta: ${responseTime}
                    </div>
                </div>

                <!-- Mensajes -->
                <div class="chat-messages" id="chat-messages">
                    <div class="chat-message bot-message">
                        <div class="message-avatar">
                            <img src="../../assets/cresalia/logo.png" alt="Soporte">
                        </div>
                        <div class="message-content">
                            <div class="message-bubble">
                                ¡Hola! 👋 Soy parte del equipo de soporte de Cresalia.<br><br>
                                ¿En qué podemos ayudarte hoy?
                            </div>
                            <div class="message-time">${this.getCurrentTime()}</div>
                        </div>
                    </div>
                </div>

                <!-- Respuestas rápidas -->
                <div class="quick-replies" id="quick-replies">
                    <button class="quick-reply" onclick="supportWidget.sendQuickReply('Tengo un problema técnico')">
                        🐛 Problema técnico
                    </button>
                    <button class="quick-reply" onclick="supportWidget.sendQuickReply('Pregunta sobre facturación')">
                        💳 Facturación
                    </button>
                    <button class="quick-reply" onclick="supportWidget.sendQuickReply('Quiero actualizar mi plan')">
                        ⬆️ Cambiar plan
                    </button>
                    <button class="quick-reply" onclick="supportWidget.sendQuickReply('Otra consulta')">
                        💬 Otra consulta
                    </button>
                </div>

                <!-- Input -->
                <div class="chat-input-container">
                    <button class="btn-attach">
                        <i class="fas fa-paperclip"></i>
                    </button>
                    <input 
                        type="text" 
                        id="chat-input" 
                        class="chat-input" 
                        placeholder="Escribe tu mensaje..."
                        maxlength="500"
                    >
                    <button class="btn-send" onclick="supportWidget.sendMessage()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Tab de Tickets
    renderTicketsTab() {
        return `
            <div class="tickets-container">
                <!-- Botón crear ticket -->
                <button class="btn-create-ticket" onclick="supportWidget.showCreateTicket()">
                    <i class="fas fa-plus-circle"></i>
                    Crear Nuevo Ticket
                </button>

                <!-- Lista de tickets -->
                <div class="tickets-list" id="tickets-list">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h4>No tienes tickets abiertos</h4>
                        <p>Cuando tengas alguna consulta, créala aquí y la atenderemos pronto.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Tab de Ayuda
    renderHelpTab() {
        return `
            <div class="help-container">
                <div class="help-search">
                    <i class="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Buscar en el centro de ayuda..."
                        id="help-search"
                    >
                </div>

                <div class="help-sections">
                    <!-- Primeros Pasos -->
                    <div class="help-section">
                        <h4><i class="fas fa-rocket"></i> Primeros Pasos</h4>
                        <ul class="help-links">
                            <li><a href="#" onclick="supportWidget.openArticle('setup')">
                                Configurar tu tienda
                            </a></li>
                            <li><a href="#" onclick="supportWidget.openArticle('products')">
                                Agregar productos
                            </a></li>
                            <li><a href="#" onclick="supportWidget.openArticle('customization')">
                                Personalizar diseño
                            </a></li>
                        </ul>
                    </div>

                    <!-- Funcionalidades -->
                    <div class="help-section">
                        <h4><i class="fas fa-star"></i> Funcionalidades</h4>
                        <ul class="help-links">
                            <li><a href="#" onclick="supportWidget.openArticle('multilang')">
                                Configurar multi-idioma
                            </a></li>
                            <li><a href="#" onclick="supportWidget.openArticle('chatbot')">
                                Activar chatbot IA (Pro+)
                            </a></li>
                            <li><a href="#" onclick="supportWidget.openArticle('payments')">
                                Configurar pagos
                            </a></li>
                        </ul>
                    </div>

                    <!-- Facturación -->
                    <div class="help-section">
                        <h4><i class="fas fa-credit-card"></i> Facturación</h4>
                        <ul class="help-links">
                            <li><a href="#" onclick="supportWidget.openArticle('upgrade')">
                                Cambiar de plan
                            </a></li>
                            <li><a href="#" onclick="supportWidget.openArticle('billing')">
                                Ver historial de pagos
                            </a></li>
                            <li><a href="#" onclick="supportWidget.openArticle('cancel')">
                                Cancelar suscripción
                            </a></li>
                        </ul>
                    </div>

                    <!-- Soporte prioritario -->
                    ${this.plan === 'pro' || this.plan === 'enterprise' ? `
                    <div class="help-section priority-support">
                        <h4><i class="fas fa-bolt"></i> Soporte Prioritario</h4>
                        <p>Como cliente ${this.plan.toUpperCase()}, tienes acceso a:</p>
                        <ul class="priority-features">
                            <li><i class="fas fa-check"></i> Respuesta en menos de 2 horas</li>
                            <li><i class="fas fa-check"></i> Chat en vivo 24/7</li>
                            <li><i class="fas fa-check"></i> Videollamadas con soporte</li>
                            ${this.plan === 'enterprise' ? '<li><i class="fas fa-check"></i> Account Manager dedicado</li>' : ''}
                        </ul>
                    </div>
                    ` : ''}
                </div>

                <!-- Contacto directo -->
                <div class="direct-contact">
                    <h4>¿Necesitas ayuda personalizada?</h4>
                    <div class="contact-methods">
                        <a href="mailto:soporte@cresalia.com" class="contact-btn">
                            <i class="fas fa-envelope"></i>
                            soporte@cresalia.com
                        </a>
                        ${this.plan !== 'free' ? `
                        <a href="https://wa.me/51999999999" class="contact-btn" target="_blank">
                            <i class="fab fa-whatsapp"></i>
                            WhatsApp
                        </a>
                        ` : ''}
                        ${this.plan === 'enterprise' ? `
                        <a href="tel:+51999999999" class="contact-btn">
                            <i class="fas fa-phone"></i>
                            Llamar ahora
                        </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Event listeners
    setupEventListeners() {
        // Toggle widget
        document.getElementById('support-toggle').addEventListener('click', () => {
            this.toggle();
        });

        // Tabs
        document.querySelectorAll('.support-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Chat input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    // Toggle widget
    toggle() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('support-panel');
        panel.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            this.markAsRead();
        }
    }

    // Cerrar widget
    close() {
        this.isOpen = false;
        document.getElementById('support-panel').style.display = 'none';
    }

    // Minimizar widget
    minimize() {
        this.close();
    }

    // Cambiar tab
    switchTab(tabName) {
        // Tabs
        document.querySelectorAll('.support-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Content
        document.querySelectorAll('.support-tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');
    }

    // Enviar mensaje
    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Agregar mensaje del usuario
        this.addMessage(message, 'user');
        input.value = '';

        // Simular respuesta (en producción, conectar con API real)
        setTimeout(() => {
            this.addMessage(
                'Gracias por tu mensaje. Un agente de soporte responderá en breve. ' +
                'Mientras tanto, puedes ver nuestro centro de ayuda en la pestaña "Ayuda".',
                'bot'
            );
        }, 1500);

        // En producción: enviar a API
        // await fetch('/api/support/message', { ... });
    }

    // Respuesta rápida
    sendQuickReply(text) {
        const input = document.getElementById('chat-input');
        input.value = text;
        this.sendMessage();
    }

    // Agregar mensaje al chat
    addMessage(text, type) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        messageDiv.innerHTML = `
            ${type === 'bot' ? `
            <div class="message-avatar">
                <img src="../../assets/cresalia/logo.png" alt="Soporte">
            </div>
            ` : ''}
            <div class="message-content">
                <div class="message-bubble">${text}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
            ${type === 'user' ? `
            <div class="message-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            ` : ''}
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Crear nuevo ticket
    showCreateTicket() {
        // Mostrar modal para crear ticket
        alert('Funcionalidad de crear ticket - próximamente');
    }

    // Abrir artículo de ayuda
    openArticle(articleId) {
        alert(`Abriendo artículo: ${articleId}`);
    }

    // Cargar tickets no leídos
    async loadUnreadTickets() {
        // En producción, cargar desde API
        // const response = await fetch(`/api/${this.tenant.slug}/support/unread`);
        // const data = await response.json();
        // this.unreadCount = data.count;
        
        // Por ahora, simulado
        this.unreadCount = 0;
        this.updateBadge();
    }

    // Actualizar badge
    updateBadge() {
        const badge = document.getElementById('support-badge');
        if (this.unreadCount > 0) {
            badge.textContent = this.unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    // Marcar como leído
    markAsRead() {
        this.unreadCount = 0;
        this.updateBadge();
    }

    // Setup actualizaciones en tiempo real
    setupRealTimeUpdates() {
        // En producción, conectar con WebSocket
        // const ws = new WebSocket(`wss://api.cresalia.com/support/${this.tenant.slug}`);
        // ws.onmessage = (event) => { ... };
    }

    // Obtener hora actual
    getCurrentTime() {
        return new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    // Estilos del widget
    getStyles() {
        return `
        <style>
            /* Widget Container */
            #cresalia-support-widget {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9999;
                font-family: var(--font-primary, 'Poppins', sans-serif);
            }

            /* Toggle Button */
            .support-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
                transition: all 0.3s ease;
                position: relative;
            }

            .support-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(124, 58, 237, 0.6);
            }

            .support-badge {
                position: absolute;
                top: -4px;
                right: -4px;
                background: #EC4899;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 700;
                box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            /* Support Panel */
            .support-panel {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 420px;
                height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Header */
            .support-header {
                padding: 20px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .support-header-content {
                display: flex;
                gap: 12px;
                align-items: center;
            }

            .support-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: white;
                padding: 4px;
                position: relative;
            }

            .support-avatar img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: cover;
            }

            .status-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid white;
                position: absolute;
                bottom: 0;
                right: 0;
            }

            .status-dot.online {
                background: #10B981;
            }

            .support-info h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .support-plan {
                margin: 4px 0 0 0;
                font-size: 12px;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .support-actions {
                display: flex;
                gap: 8px;
            }

            .btn-icon {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .btn-icon:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            /* Tabs */
            .support-tabs {
                display: flex;
                background: #F9FAFB;
                border-bottom: 2px solid #E5E7EB;
            }

            .support-tab {
                flex: 1;
                padding: 14px 12px;
                border: none;
                background: transparent;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                color: #6B7280;
                transition: all 0.2s;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }

            .support-tab.active {
                color: #7C3AED;
                background: white;
            }

            .support-tab.active::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                right: 0;
                height: 2px;
                background: #7C3AED;
            }

            .tab-badge {
                background: #EC4899;
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                font-size: 11px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* Content */
            .support-content {
                flex: 1;
                overflow: hidden;
                position: relative;
            }

            .support-tab-content {
                display: none;
                height: 100%;
                overflow-y: auto;
            }

            .support-tab-content.active {
                display: block;
            }

            /* Chat Tab */
            .chat-container {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .chat-status {
                padding: 16px;
                background: #F0FDF4;
                border-bottom: 1px solid #E5E7EB;
            }

            .status-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: #065F46;
                margin-bottom: 6px;
            }

            .response-time {
                font-size: 12px;
                color: #6B7280;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .chat-message {
                display: flex;
                gap: 12px;
                animation: fadeIn 0.3s ease;
            }

            .user-message {
                flex-direction: row-reverse;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .message-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .message-avatar i {
                font-size: 32px;
                color: #7C3AED;
            }

            .message-content {
                max-width: 70%;
            }

            .message-bubble {
                padding: 12px 16px;
                border-radius: 16px;
                line-height: 1.5;
                font-size: 14px;
            }

            .bot-message .message-bubble {
                background: #F3F4F6;
                color: #1F2937;
            }

            .user-message .message-bubble {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
            }

            .message-time {
                font-size: 11px;
                color: #9CA3AF;
                margin-top: 4px;
                padding: 0 8px;
            }

            /* Quick Replies */
            .quick-replies {
                padding: 12px 16px;
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                border-top: 1px solid #E5E7EB;
            }

            .quick-reply {
                padding: 8px 14px;
                background: white;
                border: 1.5px solid #E5E7EB;
                border-radius: 20px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
                color: #4B5563;
            }

            .quick-reply:hover {
                border-color: #7C3AED;
                color: #7C3AED;
                background: #F5F3FF;
            }

            /* Chat Input */
            .chat-input-container {
                padding: 16px;
                border-top: 1px solid #E5E7EB;
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .btn-attach, .btn-send {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .btn-attach {
                background: transparent;
                color: #6B7280;
            }

            .btn-attach:hover {
                background: #F3F4F6;
            }

            .btn-send {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
            }

            .btn-send:hover {
                transform: scale(1.05);
            }

            .chat-input {
                flex: 1;
                padding: 10px 16px;
                border: 2px solid #E5E7EB;
                border-radius: 10px;
                font-size: 14px;
                font-family: inherit;
                transition: border-color 0.2s;
            }

            .chat-input:focus {
                outline: none;
                border-color: #7C3AED;
            }

            /* Tickets Tab */
            .tickets-container {
                padding: 20px;
            }

            .btn-create-ticket {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-bottom: 20px;
                transition: transform 0.2s;
            }

            .btn-create-ticket:hover {
                transform: translateY(-2px);
            }

            .empty-state {
                text-align: center;
                padding: 60px 20px;
                color: #6B7280;
            }

            .empty-state i {
                font-size: 64px;
                color: #D1D5DB;
                margin-bottom: 16px;
            }

            .empty-state h4 {
                margin: 0 0 8px 0;
                color: #374151;
            }

            .empty-state p {
                margin: 0;
                font-size: 14px;
            }

            /* Help Tab */
            .help-container {
                padding: 20px;
            }

            .help-search {
                position: relative;
                margin-bottom: 24px;
            }

            .help-search i {
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #9CA3AF;
            }

            .help-search input {
                width: 100%;
                padding: 12px 16px 12px 44px;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                font-size: 14px;
                font-family: inherit;
            }

            .help-search input:focus {
                outline: none;
                border-color: #7C3AED;
            }

            .help-section {
                margin-bottom: 24px;
                padding: 20px;
                background: #F9FAFB;
                border-radius: 12px;
            }

            .help-section h4 {
                margin: 0 0 16px 0;
                color: #1F2937;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .help-section h4 i {
                color: #7C3AED;
            }

            .help-links {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .help-links li {
                margin-bottom: 10px;
            }

            .help-links a {
                color: #4B5563;
                text-decoration: none;
                font-size: 14px;
                transition: color 0.2s;
                display: block;
                padding: 6px 0;
            }

            .help-links a:hover {
                color: #7C3AED;
            }

            .priority-support {
                background: linear-gradient(135deg, #F5F3FF, #FAF5FF);
                border: 2px solid #DDD6FE;
            }

            .priority-features {
                list-style: none;
                padding: 0;
                margin: 12px 0 0 0;
            }

            .priority-features li {
                padding: 8px 0;
                color: #4B5563;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .priority-features i {
                color: #10B981;
            }

            .direct-contact {
                margin-top: 24px;
                padding: 20px;
                background: #F9FAFB;
                border-radius: 12px;
            }

            .direct-contact h4 {
                margin: 0 0 16px 0;
                color: #1F2937;
                font-size: 15px;
            }

            .contact-methods {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .contact-btn {
                padding: 12px 16px;
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 10px;
                text-decoration: none;
                color: #4B5563;
                font-size: 14px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.2s;
            }

            .contact-btn:hover {
                border-color: #7C3AED;
                color: #7C3AED;
                background: #F5F3FF;
            }

            .contact-btn i {
                font-size: 18px;
            }

            /* Responsive */
            @media (max-width: 480px) {
                .support-panel {
                    width: 100vw;
                    height: 100vh;
                    bottom: 0;
                    right: 0;
                    border-radius: 0;
                }
            }
        </style>
        `;
    }
}

// Función global para inicializar
window.initCresaliaSupport = function(tenantConfig) {
    window.supportWidget = new CresaliaSupportWidget(tenantConfig);
    window.supportWidget.init();
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CresaliaSupportWidget };
}


