// ===== SISTEMA DE CHATBOT PERSONALIZABLE - CRESALIA =====
// Sistema de chatbot que se adapta según el plan del cliente

console.log('🤖 Inicializando sistema de chatbot personalizable...');

class ChatbotPersonalizable {
    constructor() {
        this.currentPlan = 'free';
        this.configuracion = {};
        this.mensajes = [];
        this.isOpen = false;
        this.cargarConfiguracion();
        this.inicializarChatbot();
    }

    // ===== CARGAR CONFIGURACIÓN =====
    cargarConfiguracion() {
        const planData = localStorage.getItem('cresalia_current_plan') || 'free';
        this.currentPlan = planData;
        
        const configData = localStorage.getItem(`cresalia_chatbot_${this.currentPlan}`);
        if (configData) {
            this.configuracion = JSON.parse(configData);
        } else {
            this.inicializarConfiguracionBasica();
        }
    }

    // ===== INICIALIZAR CONFIGURACIÓN BÁSICA =====
    inicializarConfiguracionBasica() {
        const planConfig = PLANES_CONFIG[this.currentPlan];
        
        if (!planConfig || !planConfig.chatbot_config) {
            console.error('❌ Configuración de chatbot no encontrada para el plan:', this.currentPlan);
            return;
        }

        const chatbotConfig = planConfig.chatbot_config;

        if (chatbotConfig.tipo === 'cresalia_compartido') {
            this.configuracion = {
                nombre: 'Cresalia Bot',
                saludo: '¡Hola! Soy Cresalia Bot, tu asistente virtual. ¿En qué puedo ayudarte hoy?',
                avatar: 'assets/img/cresalia-bot.png',
                personalizable: false,
                respuestas_custom: false,
                respuestas: this.obtenerRespuestasCresalia()
            };
        } else if (chatbotConfig.tipo === 'personalizado') {
            this.configuracion = {
                nombre: 'Mi Asistente',
                saludo: '¡Hola! Soy tu asistente personalizado. ¿En qué puedo ayudarte?',
                avatar: 'assets/img/bot-personalizado.png',
                personalizable: true,
                respuestas_custom: true,
                respuestas: this.obtenerRespuestasPersonalizadas()
            };
        } else if (chatbotConfig.tipo === 'enterprise_personalizado') {
            this.configuracion = {
                nombre: 'Enterprise Assistant',
                saludo: '¡Hola! Soy tu asistente empresarial avanzado. ¿Cómo puedo asistirte hoy?',
                avatar: 'assets/img/bot-enterprise.png',
                personalizable: true,
                respuestas_custom: true,
                integraciones_avanzadas: true,
                respuestas: this.obtenerRespuestasEnterprise()
            };
        }
    }

    // ===== OBTENER RESPUESTAS CRESALIA (COMPARTIDO) =====
    obtenerRespuestasCresalia() {
        return {
            'hola': '¡Hola! Soy Cresalia Bot. Puedo ayudarte con información sobre productos, pedidos y soporte.',
            'productos': 'Tenemos una gran variedad de productos. Puedes usar el buscador para encontrar lo que necesitas.',
            'precio': 'Los precios están disponibles en cada producto. ¿Hay algún producto específico que te interese?',
            'envio': 'Ofrecemos envíos a todo el país. Los tiempos y costos varían según la ubicación.',
            'devolucion': 'Aceptamos devoluciones dentro de los 30 días. Contacta con soporte para más información.',
            'soporte': 'Para soporte técnico, puedes contactar a nuestro equipo por email o usar el sistema de tickets.',
            'horario': 'Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00.',
            'pago': 'Aceptamos tarjetas de crédito, débito, PayPal y transferencias bancarias.',
            'default': 'Lo siento, no entiendo tu consulta. Puedes escribir "ayuda" para ver las opciones disponibles.'
        };
    }

    // ===== OBTENER RESPUESTAS PERSONALIZADAS =====
    obtenerRespuestasPersonalizadas() {
        return {
            'hola': '¡Hola! Soy tu asistente personalizado. ¿En qué puedo ayudarte hoy?',
            'productos': 'Aquí puedes encontrar todos nuestros productos. ¿Hay algo específico que buscas?',
            'precio': 'Los precios están claramente indicados en cada producto. ¿Necesitas información sobre algún producto en particular?',
            'envio': 'Realizamos envíos a todo el país. Los tiempos dependen de tu ubicación.',
            'devolucion': 'Tienes 30 días para devolver cualquier producto que no te satisfaga.',
            'soporte': 'Estoy aquí para ayudarte. Si necesitas asistencia adicional, puedes contactar a nuestro equipo.',
            'horario': 'Estamos disponibles de lunes a viernes de 9:00 a 18:00.',
            'pago': 'Aceptamos múltiples formas de pago para tu comodidad.',
            'default': 'No estoy seguro de cómo ayudarte con eso. ¿Podrías reformular tu pregunta?'
        };
    }

    // ===== OBTENER RESPUESTAS ENTERPRISE =====
    obtenerRespuestasEnterprise() {
        return {
            'hola': '¡Hola! Soy tu asistente empresarial avanzado. Tengo acceso a toda la información de la empresa.',
            'productos': 'Como cliente enterprise, tienes acceso a nuestro catálogo completo. ¿Necesitas información específica?',
            'precio': 'Los precios enterprise incluyen descuentos especiales. ¿Te gustaría conocer nuestras tarifas corporativas?',
            'envio': 'Ofrecemos envíos prioritarios y seguimiento en tiempo real para clientes enterprise.',
            'devolucion': 'Como cliente enterprise, tienes políticas de devolución extendidas y soporte dedicado.',
            'soporte': 'Tienes acceso a soporte dedicado 24/7. ¿Necesitas conectar con un especialista?',
            'horario': 'El soporte enterprise está disponible 24/7 para nuestros clientes corporativos.',
            'pago': 'Ofrecemos condiciones de pago especiales para empresas, incluyendo facturación corporativa.',
            'api': 'Tienes acceso completo a nuestra API enterprise para integraciones avanzadas.',
            'default': 'Como asistente enterprise, puedo ayudarte con consultas avanzadas. ¿Podrías ser más específico?'
        };
    }

    // ===== INICIALIZAR CHATBOT =====
    inicializarChatbot() {
        this.crearInterfazChatbot();
        this.cargarMensajes();
    }

    // ===== CREAR INTERFAZ DEL CHATBOT =====
    crearInterfazChatbot() {
        const chatbotHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <div class="chatbot-header">
                    <div class="chatbot-info">
                        <img src="${this.configuracion.avatar}" alt="${this.configuracion.nombre}" class="chatbot-avatar">
                        <div class="chatbot-details">
                            <h4>${this.configuracion.nombre}</h4>
                            <span class="chatbot-status">En línea</span>
                        </div>
                    </div>
                    <div class="chatbot-controls">
                        ${this.configuracion.personalizable ? `
                            <button class="btn-config" onclick="chatbotPersonalizable.configurarChatbot()" title="Configurar">
                                <i class="fas fa-cog"></i>
                            </button>
                        ` : ''}
                        <button class="btn-minimize" onclick="chatbotPersonalizable.toggleChat()" title="Minimizar">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="chatbot-body">
                    <div class="chatbot-messages" id="chatbot-messages">
                        <div class="message bot-message">
                            <img src="${this.configuracion.avatar}" alt="${this.configuracion.nombre}" class="message-avatar">
                            <div class="message-content">
                                <p>${this.configuracion.saludo}</p>
                                <span class="message-time">${new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chatbot-input">
                        <input type="text" id="chatbot-input-field" placeholder="Escribe tu mensaje..." 
                               onkeypress="if(event.key==='Enter') chatbotPersonalizable.enviarMensaje()">
                        <button class="btn-send" onclick="chatbotPersonalizable.enviarMensaje()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                
                <div class="chatbot-suggestions" id="chatbot-suggestions">
                    <button class="suggestion-btn" onclick="chatbotPersonalizable.enviarSugerencia('productos')">
                        Ver productos
                    </button>
                    <button class="suggestion-btn" onclick="chatbotPersonalizable.enviarSugerencia('precio')">
                        Consultar precios
                    </button>
                    <button class="suggestion-btn" onclick="chatbotPersonalizable.enviarSugerencia('soporte')">
                        Contactar soporte
                    </button>
                </div>
            </div>
            
            <div id="chatbot-trigger" class="chatbot-trigger" onclick="chatbotPersonalizable.toggleChat()">
                <i class="fas fa-robot"></i>
                <span class="notification-badge" id="chatbot-notification" style="display: none;">1</span>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // ===== TOGGLE CHAT =====
    toggleChat() {
        const container = document.getElementById('chatbot-container');
        const trigger = document.getElementById('chatbot-trigger');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            container.classList.add('open');
            trigger.style.display = 'none';
            document.getElementById('chatbot-input-field').focus();
        } else {
            container.classList.remove('open');
            trigger.style.display = 'flex';
        }
    }

    // ===== ENVIAR MENSAJE =====
    enviarMensaje() {
        const input = document.getElementById('chatbot-input-field');
        const mensaje = input.value.trim();
        
        if (!mensaje) return;
        
        // Agregar mensaje del usuario
        this.agregarMensaje(mensaje, 'user');
        input.value = '';
        
        // Procesar mensaje y generar respuesta
        setTimeout(() => {
            const respuesta = this.procesarMensaje(mensaje);
            this.agregarMensaje(respuesta, 'bot');
        }, 1000);
    }

    // ===== ENVIAR SUGERENCIA =====
    enviarSugerencia(tipo) {
        const mensaje = this.obtenerMensajeSugerencia(tipo);
        this.agregarMensaje(mensaje, 'user');
        
        setTimeout(() => {
            const respuesta = this.procesarMensaje(mensaje);
            this.agregarMensaje(respuesta, 'bot');
        }, 1000);
    }

    // ===== OBTENER MENSAJE DE SUGERENCIA =====
    obtenerMensajeSugerencia(tipo) {
        const sugerencias = {
            'productos': 'Quiero ver los productos disponibles',
            'precio': '¿Cuáles son los precios?',
            'soporte': 'Necesito ayuda con soporte'
        };
        return sugerencias[tipo] || tipo;
    }

    // ===== PROCESAR MENSAJE =====
    procesarMensaje(mensaje) {
        const mensajeLower = mensaje.toLowerCase();
        
        // Buscar respuesta específica
        for (const [palabra, respuesta] of Object.entries(this.configuracion.respuestas)) {
            if (mensajeLower.includes(palabra)) {
                return respuesta;
            }
        }
        
        // Respuesta por defecto
        return this.configuracion.respuestas.default || 'Lo siento, no entiendo tu consulta. ¿Podrías ser más específico?';
    }

    // ===== AGREGAR MENSAJE =====
    agregarMensaje(contenido, tipo) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${tipo}-message`;
        
        if (tipo === 'bot') {
            messageElement.innerHTML = `
                <img src="${this.configuracion.avatar}" alt="${this.configuracion.nombre}" class="message-avatar">
                <div class="message-content">
                    <p>${contenido}</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${contenido}</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Guardar mensaje
        this.mensajes.push({
            contenido,
            tipo,
            timestamp: new Date().toISOString()
        });
        
        this.guardarMensajes();
    }

    // ===== CARGAR MENSAJES =====
    cargarMensajes() {
        const mensajesData = localStorage.getItem(`cresalia_chatbot_mensajes_${this.currentPlan}`);
        if (mensajesData) {
            this.mensajes = JSON.parse(mensajesData);
            this.mostrarMensajesCargados();
        }
    }

    // ===== MOSTRAR MENSAJES CARGADOS =====
    mostrarMensajesCargados() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;
        
        // Limpiar mensajes actuales (excepto el saludo)
        const saludo = messagesContainer.querySelector('.bot-message');
        messagesContainer.innerHTML = '';
        if (saludo) {
            messagesContainer.appendChild(saludo);
        }
        
        // Mostrar mensajes guardados
        this.mensajes.forEach(mensaje => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${mensaje.tipo}-message`;
            
            if (mensaje.tipo === 'bot') {
                messageElement.innerHTML = `
                    <img src="${this.configuracion.avatar}" alt="${this.configuracion.nombre}" class="message-avatar">
                    <div class="message-content">
                        <p>${mensaje.contenido}</p>
                        <span class="message-time">${new Date(mensaje.timestamp).toLocaleTimeString()}</span>
                    </div>
                `;
            } else {
                messageElement.innerHTML = `
                    <div class="message-content">
                        <p>${mensaje.contenido}</p>
                        <span class="message-time">${new Date(mensaje.timestamp).toLocaleTimeString()}</span>
                    </div>
                `;
            }
            
            messagesContainer.appendChild(messageElement);
        });
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ===== GUARDAR MENSAJES =====
    guardarMensajes() {
        localStorage.setItem(`cresalia_chatbot_mensajes_${this.currentPlan}`, JSON.stringify(this.mensajes));
    }

    // ===== CONFIGURAR CHATBOT =====
    configurarChatbot() {
        if (!this.configuracion.personalizable) {
            alert('Tu plan actual no permite personalizar el chatbot. Actualiza tu plan para acceder a esta funcionalidad.');
            return;
        }

        const modal = this.crearModalConfiguracion();
        document.body.appendChild(modal);
    }

    // ===== CREAR MODAL DE CONFIGURACIÓN =====
    crearModalConfiguracion() {
        const modal = document.createElement('div');
        modal.className = 'modal-chatbot-config';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🤖 Configurar Chatbot</h3>
                    <button class="btn-cerrar" onclick="this.closest('.modal-chatbot-config').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="config-section">
                        <h4>Información Básica</h4>
                        <div class="form-group">
                            <label>Nombre del Bot:</label>
                            <input type="text" id="chatbot-nombre" value="${this.configuracion.nombre}">
                        </div>
                        <div class="form-group">
                            <label>Mensaje de Saludo:</label>
                            <textarea id="chatbot-saludo">${this.configuracion.saludo}</textarea>
                        </div>
                    </div>
                    
                    <div class="config-section">
                        <h4>Respuestas Personalizadas</h4>
                        <div id="respuestas-container">
                            ${this.generarEditorRespuestas()}
                        </div>
                        <button class="btn-agregar-respuesta" onclick="chatbotPersonalizable.agregarRespuesta()">
                            + Agregar Respuesta
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-guardar" onclick="chatbotPersonalizable.guardarConfiguracion()">
                        Guardar Configuración
                    </button>
                    <button class="btn-cancelar" onclick="this.closest('.modal-chatbot-config').remove()">
                        Cancelar
                    </button>
                </div>
            </div>
        `;
        return modal;
    }

    // ===== GENERAR EDITOR DE RESPUESTAS =====
    generarEditorRespuestas() {
        return Object.entries(this.configuracion.respuestas).map(([palabra, respuesta]) => `
            <div class="respuesta-item">
                <div class="form-group">
                    <label>Palabra clave:</label>
                    <input type="text" value="${palabra}" onchange="chatbotPersonalizable.actualizarRespuesta('${palabra}', 'palabra', this.value)">
                </div>
                <div class="form-group">
                    <label>Respuesta:</label>
                    <textarea onchange="chatbotPersonalizable.actualizarRespuesta('${palabra}', 'respuesta', this.value)">${respuesta}</textarea>
                </div>
                ${palabra !== 'default' ? `
                    <button class="btn-eliminar" onclick="chatbotPersonalizable.eliminarRespuesta('${palabra}')">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        `).join('');
    }

    // ===== ACTUALIZAR RESPUESTA =====
    actualizarRespuesta(palabraOriginal, campo, nuevoValor) {
        if (campo === 'palabra') {
            // Cambiar la clave
            const respuesta = this.configuracion.respuestas[palabraOriginal];
            delete this.configuracion.respuestas[palabraOriginal];
            this.configuracion.respuestas[nuevoValor] = respuesta;
        } else {
            // Cambiar la respuesta
            this.configuracion.respuestas[palabraOriginal] = nuevoValor;
        }
    }

    // ===== AGREGAR RESPUESTA =====
    agregarRespuesta() {
        const palabra = prompt('Palabra clave:');
        const respuesta = prompt('Respuesta:');
        
        if (palabra && respuesta) {
            this.configuracion.respuestas[palabra] = respuesta;
            this.regenerarEditorRespuestas();
        }
    }

    // ===== ELIMINAR RESPUESTA =====
    eliminarRespuesta(palabra) {
        if (confirm(`¿Estás seguro de que quieres eliminar la respuesta para "${palabra}"?`)) {
            delete this.configuracion.respuestas[palabra];
            this.regenerarEditorRespuestas();
        }
    }

    // ===== REGENERAR EDITOR =====
    regenerarEditorRespuestas() {
        const container = document.getElementById('respuestas-container');
        if (container) {
            container.innerHTML = this.generarEditorRespuestas();
        }
    }

    // ===== GUARDAR CONFIGURACIÓN =====
    guardarConfiguracion() {
        // Actualizar configuración con los valores del modal
        this.configuracion.nombre = document.getElementById('chatbot-nombre').value;
        this.configuracion.saludo = document.getElementById('chatbot-saludo').value;
        
        // Guardar en localStorage
        localStorage.setItem(`cresalia_chatbot_${this.currentPlan}`, JSON.stringify(this.configuracion));
        
        // Actualizar interfaz
        this.actualizarInterfaz();
        
        // Cerrar modal
        document.querySelector('.modal-chatbot-config')?.remove();
        
        // Notificar
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('Configuración del chatbot guardada', 'success');
        }
    }

    // ===== ACTUALIZAR INTERFAZ =====
    actualizarInterfaz() {
        const nombre = document.querySelector('.chatbot-details h4');
        const saludo = document.querySelector('.bot-message .message-content p');
        
        if (nombre) nombre.textContent = this.configuracion.nombre;
        if (saludo) saludo.textContent = this.configuracion.saludo;
    }
}

// ===== INICIALIZAR CHATBOT =====
let chatbotPersonalizable;
document.addEventListener('DOMContentLoaded', function() {
    chatbotPersonalizable = new ChatbotPersonalizable();
});

// ===== EXPORTAR PARA USO GLOBAL =====
window.chatbotPersonalizable = chatbotPersonalizable;






















