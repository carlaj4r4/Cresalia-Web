// ===== SISTEMA DE SOPORTE INTEGRADO - CRESALIA =====
// Sistema que conecta cuentas FREE y STARTER con Chatbot IA y Soporte

console.log('🤖 Inicializando sistema de soporte integrado Cresalia...');

class SistemaSoporteIntegrado {
    constructor() {
        this.currentPlan = 'free';
        this.tipoConsulta = '';
        this.chatbotActivo = false;
        this.soporteActivo = false;
        this.cargarConfiguracion();
        this.inicializarSistema();
    }

    // ===== CARGAR CONFIGURACIÓN =====
    cargarConfiguracion() {
        const planData = localStorage.getItem('cresalia_current_plan') || 'free';
        this.currentPlan = planData;
        console.log(`📋 Plan detectado: ${this.currentPlan}`);
    }

    // ===== INICIALIZAR SISTEMA =====
    inicializarSistema() {
        this.crearInterfazSoporte();
        this.configurarChatbotCresalia();
        this.configurarDerivacionSoporte();
    }

    // ===== CREAR INTERFAZ DE SOPORTE =====
    crearInterfazSoporte() {
        const soporteHTML = `
            <div id="soporte-integrado-container" class="soporte-integrado-container">
                <div class="soporte-header">
                    <h3>🆘 Centro de Ayuda Cresalia</h3>
                    <p>Estamos aquí para ayudarte</p>
                </div>
                
                <div class="soporte-opciones">
                    <div class="opcion-chatbot" onclick="sistemaSoporteIntegrado.abrirChatbot()">
                        <div class="opcion-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="opcion-content">
                            <h4>Chatbot IA Cresalia</h4>
                            <p>Responde dudas sobre productos, promociones y combos</p>
                            <span class="badge-disponible">Disponible 24/7</span>
                        </div>
                    </div>
                    
                    <div class="opcion-soporte" onclick="sistemaSoporteIntegrado.abrirSoporte()">
                        <div class="opcion-icon">
                            <i class="fas fa-headset"></i>
                        </div>
                        <div class="opcion-content">
                            <h4>Soporte Humano</h4>
                            <p>Para problemas de entrega, errores de tienda</p>
                            <span class="badge-limitado">Horario comercial</span>
                        </div>
                    </div>
                </div>
                
                <div class="soporte-footer">
                    <button class="btn-cerrar-soporte" onclick="sistemaSoporteIntegrado.cerrarSoporte()">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                </div>
            </div>
            
            <div id="soporte-trigger" class="soporte-trigger" onclick="sistemaSoporteIntegrado.toggleSoporte()">
                <i class="fas fa-question-circle"></i>
                <span class="soporte-texto">Ayuda</span>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', soporteHTML);
    }

    // ===== CONFIGURAR CHATBOT CRESALIA =====
    configurarChatbotCresalia() {
        this.chatbotCresalia = {
            nombre: 'Cresalia Bot',
            avatar: 'assets/logo/logo-cresalia.png',
            saludo: '¡Hola! Soy Cresalia Bot, tu asistente virtual. ¿En qué puedo ayudarte?',
            respuestas: {
                'productos': 'Tenemos una gran variedad de productos disponibles. Puedes navegar por las categorías o usar el buscador para encontrar lo que necesitas. ¿Hay algún producto específico que te interese?',
                'promociones': '¡Excelente! Tenemos promociones especiales y descuentos disponibles. Revisa la sección "Ofertas" para ver todas las promociones activas. ¿Te interesa alguna categoría en particular?',
                'combos': 'Nuestros combos ofrecen excelentes descuentos al comprar varios productos juntos. Los encuentras en la sección de combos con ahorros de hasta 30%. ¿Quieres ver los combos disponibles?',
                'precios': 'Los precios están claramente indicados en cada producto. También tenemos promociones especiales y combos con descuentos. ¿Necesitas información sobre algún producto específico?',
                'envio': 'Ofrecemos envíos a todo el país con diferentes opciones de entrega. Los tiempos varían según tu ubicación. ¿Te gustaría calcular el costo de envío?',
                'pago': 'Aceptamos múltiples formas de pago: tarjetas de crédito, débito, PayPal y transferencias bancarias. Todos los pagos son seguros y procesados de forma segura.',
                'garantia': 'Todos nuestros productos tienen garantía. Los términos específicos varían según el producto. ¿Necesitas información sobre la garantía de algún producto en particular?',
                'devolucion': 'Aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar en condiciones originales. ¿Necesitas ayuda con una devolución?',
                'cuenta': 'Para gestionar tu cuenta, puedes acceder a "Mi Cuenta" en el menú. Ahí podrás ver tu historial de compras, datos personales y más. ¿Necesitas ayuda con algo específico?',
                'default': 'No estoy seguro de cómo ayudarte con eso específicamente. ¿Podrías ser más específico? También puedes contactar con nuestro soporte humano para consultas más complejas.'
            }
        };
    }

    // ===== CONFIGURAR DERIVACIÓN DE SOPORTE =====
    configurarDerivacionSoporte() {
        this.derivacionSoporte = {
            consultasChatbot: [
                'productos', 'promociones', 'combos', 'precios', 
                'garantia', 'devolucion', 'cuenta', 'pago', 'envio'
            ],
            consultasSoporte: [
                'entrega', 'error', 'problema', 'no llego', 'dañado',
                'incorrecto', 'cancelar', 'reembolso', 'reclamo'
            ],
            mediosComunicacion: {
                whatsapp: 'Chat directo por WhatsApp',
                email: 'Correo electrónico',
                telefono: 'Llamada telefónica',
                ticket: 'Sistema de tickets'
            }
        };
    }

    // ===== TOGGLE SOPORTE =====
    toggleSoporte() {
        const container = document.getElementById('soporte-integrado-container');
        const trigger = document.getElementById('soporte-trigger');
        
        if (container.classList.contains('open')) {
            this.cerrarSoporte();
        } else {
            this.abrirSoporte();
        }
    }

    // ===== ABRIR SOPORTE =====
    abrirSoporte() {
        const container = document.getElementById('soporte-integrado-container');
        const trigger = document.getElementById('soporte-trigger');
        
        container.classList.add('open');
        trigger.style.display = 'none';
        
        // Aplicar estilos mobile forzados
        setTimeout(() => this.aplicarEstilosMobile(), 100);
        
        console.log('🆘 Centro de ayuda abierto');
    }

    // ===== CERRAR SOPORTE =====
    cerrarSoporte() {
        const container = document.getElementById('soporte-integrado-container');
        const trigger = document.getElementById('soporte-trigger');
        
        container.classList.remove('open');
        trigger.style.display = 'flex';
        
        console.log('❌ Centro de ayuda cerrado');
    }

    // ===== ABRIR CHATBOT =====
    abrirChatbot() {
        this.cerrarSoporte();
        
        // Verificar si ya existe el chatbot
        if (!document.getElementById('chatbot-cresalia-container')) {
            this.crearChatbotCresalia();
        }
        
        // Mostrar el chatbot
        const chatbot = document.getElementById('chatbot-cresalia-container');
        if (chatbot) {
            chatbot.classList.add('open');
            // Aplicar estilos mobile forzados
            setTimeout(() => this.aplicarEstilosMobile(), 100);
        }
        
        this.chatbotActivo = true;
        console.log('🤖 Chatbot Cresalia activado');
    }

    // ===== APLICAR ESTILOS MOBILE FORZADOS =====
    aplicarEstilosMobile() {
        if (window.innerWidth <= 768) {
            const chatbot = document.getElementById('chatbot-cresalia-container');
            const soporte = document.getElementById('soporte-integrado-container');
            
            if (chatbot) {
                chatbot.style.position = 'fixed';
                chatbot.style.top = '0';
                chatbot.style.left = '0';
                chatbot.style.right = '0';
                chatbot.style.bottom = '0';
                chatbot.style.width = '100vw';
                chatbot.style.height = '100vh';
                chatbot.style.borderRadius = '0';
                chatbot.style.zIndex = '10001';
                chatbot.style.transform = 'none';
                chatbot.style.margin = '0';
                chatbot.style.padding = '0';
            }
            
            if (soporte) {
                soporte.style.position = 'fixed';
                soporte.style.top = '0';
                soporte.style.left = '0';
                soporte.style.right = '0';
                soporte.style.bottom = '0';
                soporte.style.width = '100vw';
                soporte.style.height = '100vh';
                soporte.style.borderRadius = '0';
                soporte.style.zIndex = '10000';
                soporte.style.transform = 'none';
                soporte.style.margin = '0';
                soporte.style.padding = '0';
            }
            
            console.log('📱 Estilos mobile aplicados forzadamente');
        }
    }

    // ===== CREAR CHATBOT CRESALIA =====
    crearChatbotCresalia() {
        const chatbotHTML = `
            <div id="chatbot-cresalia-container" class="chatbot-cresalia-container">
                <div class="chatbot-cresalia-header">
                    <div class="chatbot-cresalia-info">
                        <img src="${this.chatbotCresalia.avatar}" alt="${this.chatbotCresalia.nombre}" class="chatbot-cresalia-avatar">
                        <div class="chatbot-cresalia-details">
                            <h4>${this.chatbotCresalia.nombre}</h4>
                            <span class="chatbot-cresalia-status">En línea</span>
                        </div>
                    </div>
                    <div class="chatbot-cresalia-controls">
                        <button class="btn-escalar" onclick="sistemaSoporteIntegrado.escalarASoporte()" title="Escalar a Soporte">
                            <i class="fas fa-user-headset"></i>
                        </button>
                        <button class="btn-minimize" onclick="sistemaSoporteIntegrado.cerrarChatbot()" title="Minimizar">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>
                
                <div class="chatbot-cresalia-body">
                    <div class="chatbot-cresalia-messages" id="chatbot-cresalia-messages">
                        <div class="message bot-message">
                            <img src="${this.chatbotCresalia.avatar}" alt="${this.chatbotCresalia.nombre}" class="message-avatar">
                            <div class="message-content">
                                <p>${this.chatbotCresalia.saludo}</p>
                                <span class="message-time">${new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chatbot-cresalia-input">
                        <input type="text" id="chatbot-cresalia-input-field" placeholder="Escribe tu consulta..." 
                               onkeypress="if(event.key==='Enter') sistemaSoporteIntegrado.enviarMensajeChatbot()">
                        <button class="btn-send" onclick="sistemaSoporteIntegrado.enviarMensajeChatbot()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                
                <div class="chatbot-cresalia-suggestions" id="chatbot-cresalia-suggestions">
                    <button class="suggestion-btn" onclick="sistemaSoporteIntegrado.enviarSugerenciaChatbot('productos')">
                        Ver productos
                    </button>
                    <button class="suggestion-btn" onclick="sistemaSoporteIntegrado.enviarSugerenciaChatbot('promociones')">
                        Promociones
                    </button>
                    <button class="suggestion-btn" onclick="sistemaSoporteIntegrado.enviarSugerenciaChatbot('combos')">
                        Combos
                    </button>
                    <button class="suggestion-btn" onclick="sistemaSoporteIntegrado.enviarSugerenciaChatbot('envio')">
                        Envíos
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // ===== ENVIAR MENSAJE AL CHATBOT =====
    enviarMensajeChatbot() {
        const input = document.getElementById('chatbot-cresalia-input-field');
        const mensaje = input.value.trim();
        
        if (!mensaje) return;
        
        // Agregar mensaje del usuario
        this.agregarMensajeChatbot(mensaje, 'user');
        input.value = '';
        
        // Determinar tipo de consulta
        this.tipoConsulta = this.determinarTipoConsulta(mensaje);
        
        // Procesar mensaje y generar respuesta
        setTimeout(() => {
            const respuesta = this.procesarMensajeChatbot(mensaje);
            this.agregarMensajeChatbot(respuesta, 'bot');
        }, 1000);
    }

    // ===== DETERMINAR TIPO DE CONSULTA =====
    determinarTipoConsulta(mensaje) {
        const mensajeLower = mensaje.toLowerCase();
        
        // Verificar si es consulta para soporte humano
        for (const palabra of this.derivacionSoporte.consultasSoporte) {
            if (mensajeLower.includes(palabra)) {
                return 'soporte_humano';
            }
        }
        
        // Verificar si es consulta para chatbot
        for (const palabra of this.derivacionSoporte.consultasChatbot) {
            if (mensajeLower.includes(palabra)) {
                return 'chatbot';
            }
        }
        
        return 'general';
    }

    // ===== PROCESAR MENSAJE DEL CHATBOT =====
    procesarMensajeChatbot(mensaje) {
        const mensajeLower = mensaje.toLowerCase();
        
        // Si es consulta para soporte humano, derivar
        if (this.tipoConsulta === 'soporte_humano') {
            return this.derivarASoporte(mensaje);
        }
        
        // Buscar respuesta específica en chatbot
        for (const [palabra, respuesta] of Object.entries(this.chatbotCresalia.respuestas)) {
            if (mensajeLower.includes(palabra)) {
                return respuesta;
            }
        }
        
        // Respuesta por defecto
        return this.chatbotCresalia.respuestas.default;
    }

    // ===== DERIVAR A SOPORTE =====
    derivarASoporte(mensaje) {
        return `Entiendo que tienes un problema específico. Te voy a conectar con nuestro equipo de soporte humano que podrá ayudarte mejor con esta situación. ¿Prefieres contactar por WhatsApp, email, teléfono o sistema de tickets?`;
    }

    // ===== ESCALAR A SOPORTE =====
    escalarASoporte() {
        this.cerrarChatbot();
        this.abrirSoporteHumano();
    }

    // ===== ABRIR SOPORTE HUMANO =====
    abrirSoporteHumano() {
        const modal = this.crearModalSoporteHumano();
        document.body.appendChild(modal);
    }

    // ===== CREAR MODAL SOPORTE HUMANO =====
    crearModalSoporteHumano() {
        const modal = document.createElement('div');
        modal.className = 'modal-soporte-humano';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>👥 Soporte Humano</h3>
                    <button class="btn-cerrar" onclick="this.closest('.modal-soporte-humano').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="soporte-info">
                        <p>Para problemas de entrega, errores de tienda o consultas complejas, nuestro equipo humano está aquí para ayudarte.</p>
                    </div>
                    
                    <div class="medios-comunicacion">
                        <h4>Elige tu medio de comunicación preferido:</h4>
                        <div class="medios-grid">
                            <div class="medio-item" onclick="sistemaSoporteIntegrado.contactarSoporte('whatsapp')">
                                <i class="fab fa-whatsapp"></i>
                                <span>WhatsApp</span>
                            </div>
                            <div class="medio-item" onclick="sistemaSoporteIntegrado.contactarSoporte('email')">
                                <i class="fas fa-envelope"></i>
                                <span>Email</span>
                            </div>
                            <div class="medio-item" onclick="sistemaSoporteIntegrado.contactarSoporte('telefono')">
                                <i class="fas fa-phone"></i>
                                <span>Teléfono</span>
                            </div>
                            <div class="medio-item" onclick="sistemaSoporteIntegrado.contactarSoporte('ticket')">
                                <i class="fas fa-ticket-alt"></i>
                                <span>Sistema de Tickets</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    // ===== CONTACTAR SOPORTE =====
    contactarSoporte(medio) {
        // Aquí se implementaría la lógica específica para cada medio
        console.log(`📞 Contactando soporte por: ${medio}`);
        
        // Por ahora, mostrar información de contacto
        const infoContacto = {
            whatsapp: 'Contacta por WhatsApp: +1 234 567 8900',
            email: 'Envía un email a: soporte@cresalia.com',
            telefono: 'Llama al: +1 234 567 8900',
            ticket: 'Crea un ticket en nuestro sistema'
        };
        
        alert(infoContacto[medio]);
        
        // Cerrar modal
        document.querySelector('.modal-soporte-humano')?.remove();
    }

    // ===== FUNCIONES AUXILIARES =====
    enviarSugerenciaChatbot(tipo) {
        const mensaje = `Quiero información sobre ${tipo}`;
        this.agregarMensajeChatbot(mensaje, 'user');
        
        setTimeout(() => {
            const respuesta = this.procesarMensajeChatbot(mensaje);
            this.agregarMensajeChatbot(respuesta, 'bot');
        }, 1000);
    }

    agregarMensajeChatbot(contenido, tipo) {
        const messagesContainer = document.getElementById('chatbot-cresalia-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${tipo}-message`;
        
        if (tipo === 'bot') {
            messageElement.innerHTML = `
                <img src="${this.chatbotCresalia.avatar}" alt="${this.chatbotCresalia.nombre}" class="message-avatar">
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
    }

    cerrarChatbot() {
        const chatbot = document.getElementById('chatbot-cresalia-container');
        if (chatbot) {
            chatbot.classList.remove('open');
        }
        this.chatbotActivo = false;
    }
}

// ===== INICIALIZAR SISTEMA =====
let sistemaSoporteIntegrado;
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar para planes FREE y STARTER
    const planActual = localStorage.getItem('cresalia_current_plan') || 'free';
    
    if (planActual === 'free' || planActual === 'starter') {
        sistemaSoporteIntegrado = new SistemaSoporteIntegrado();
        console.log('✅ Sistema de soporte integrado activado para plan:', planActual);
    }
});

// ===== EXPORTAR PARA USO GLOBAL =====
window.sistemaSoporteIntegrado = sistemaSoporteIntegrado;
