/**
 * Widget de Soporte para Usuarios Comunes (Compradores)
 * Sistema de soporte diferenciado para usuarios que compran en las tiendas
 */

class WidgetSoporteUsuarios {
    constructor() {
        this.isVisible = false;
        this.tipoUsuario = 'Usuario';
        this.init();
    }

    init() {
        this.createWidget();
        this.setupEventListeners();
        this.loadPreferences();
    }

    createWidget() {
        const widgetHTML = `
            <div id="soporte-usuarios-widget" class="soporte-widget" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: 'Poppins', sans-serif;
            ">
                <!-- Botón flotante -->
                <div id="soporte-toggle" class="soporte-toggle" style="
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #7C3AED, #EC4899);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <i class="fas fa-headset" style="color: white; font-size: 24px;"></i>
                    <div class="notification-badge" style="
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        background: #EF4444;
                        color: white;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        display: none;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: bold;
                    ">!</div>
                </div>

                <!-- Panel de soporte -->
                <div id="soporte-panel" class="soporte-panel" style="
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    width: 350px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                    border: 2px solid #F9A8D4;
                    padding: 0;
                    transform: translateY(20px) scale(0.8);
                    opacity: 0;
                    transition: all 0.3s ease;
                    display: none;
                ">
                    <!-- Header -->
                    <div class="soporte-header" style="
                        background: linear-gradient(135deg, #7C3AED, #EC4899);
                        color: white;
                        padding: 20px;
                        border-radius: 18px 18px 0 0;
                        text-align: center;
                        position: relative;
                    ">
                        <button onclick="widgetSoporte.close()" style="
                            position: absolute;
                            top: 15px;
                            right: 15px;
                            background: rgba(255, 255, 255, 0.2);
                            border: none;
                            color: white;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <i class="fas fa-times"></i>
                        </button>
                        <h3 style="margin: 0; font-size: 18px; font-weight: 600;">💜 Soporte Cresalia</h3>
                        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">¿Necesitas ayuda?</p>
                    </div>

                    <!-- Contenido -->
                    <div class="soporte-content" style="padding: 20px;">
                        <!-- Opciones rápidas -->
                        <div class="opciones-rapidas" style="display: grid; gap: 15px; margin-bottom: 20px;">
                            <button onclick="widgetSoporte.abrirTicketUsuario()" class="opcion-btn" style="
                                background: linear-gradient(135deg, #7C3AED, #EC4899);
                                color: white;
                                border: none;
                                padding: 15px;
                                border-radius: 12px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                font-size: 14px;
                                font-weight: 600;
                                transition: all 0.3s ease;
                            ">
                                <i class="fas fa-ticket-alt"></i>
                                <div style="text-align: left;">
                                    <div>Crear Consulta</div>
                                    <div style="font-size: 12px; opacity: 0.8;">Problema con mi compra</div>
                                </div>
                            </button>

                            <button onclick="widgetSoporte.mostrarFAQ()" class="opcion-btn" style="
                                background: linear-gradient(135deg, #10B981, #34D399);
                                color: white;
                                border: none;
                                padding: 15px;
                                border-radius: 12px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                font-size: 14px;
                                font-weight: 600;
                                transition: all 0.3s ease;
                            ">
                                <i class="fas fa-question-circle"></i>
                                <div style="text-align: left;">
                                    <div>Preguntas Frecuentes</div>
                                    <div style="font-size: 12px; opacity: 0.8;">Respuestas rápidas</div>
                                </div>
                            </button>

                            <button onclick="widgetSoporte.mostrarContacto()" class="opcion-btn" style="
                                background: linear-gradient(135deg, #F59E0B, #FBBF24);
                                color: white;
                                border: none;
                                padding: 15px;
                                border-radius: 12px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                gap: 12px;
                                font-size: 14px;
                                font-weight: 600;
                                transition: all 0.3s ease;
                            ">
                                <i class="fas fa-phone"></i>
                                <div style="text-align: left;">
                                    <div>Contacto Directo</div>
                                    <div style="font-size: 12px; opacity: 0.8;">WhatsApp y Email</div>
                                </div>
                            </button>
                        </div>

                        <!-- Información adicional -->
                        <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 15px; border-radius: 12px; border: 1px solid #F9A8D4;">
                            <p style="margin: 0; font-size: 13px; color: #6B7280; text-align: center;">
                                <i class="fas fa-shield-alt"></i> Soporte especializado para compradores
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    setupEventListeners() {
        const toggle = document.getElementById('soporte-toggle');
        const panel = document.getElementById('soporte-panel');

        toggle.addEventListener('click', () => {
            this.toggle();
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#soporte-usuarios-widget') && this.isVisible) {
                this.close();
            }
        });
    }

    toggle() {
        const panel = document.getElementById('soporte-panel');
        
        if (this.isVisible) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const panel = document.getElementById('soporte-panel');
        this.isVisible = true;
        
        panel.style.display = 'block';
        setTimeout(() => {
            panel.style.transform = 'translateY(0) scale(1)';
            panel.style.opacity = '1';
        }, 10);
    }

    close() {
        const panel = document.getElementById('soporte-panel');
        this.isVisible = false;
        
        panel.style.transform = 'translateY(20px) scale(0.8)';
        panel.style.opacity = '0';
        
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
    }

    abrirTicketUsuario() {
        this.close();
        
        const modal = `
            <div id="ticketUsuarioModal" class="modal" style="display: flex;">
                <div class="modal-content" style="max-width: 600px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #7C3AED, #EC4899); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                            <i class="fas fa-shopping-cart" style="font-size: 32px; color: white;"></i>
                        </div>
                        <h2 style="color: #7C3AED; margin-bottom: 10px;">🛒 Soporte de Compra</h2>
                        <p style="color: #6B7280;">¿Necesitas ayuda con tu compra?</p>
                    </div>
                    
                    <form id="ticketUsuarioForm" style="display: grid; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Tipo de Consulta</label>
                            <select id="tipoConsulta" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 10px; font-size: 14px;">
                                <option value="producto">🛍️ Problema con Producto</option>
                                <option value="pago">💳 Problema con Pago</option>
                                <option value="envio">🚚 Problema con Envío</option>
                                <option value="devolucion">↩️ Devolución/Cambio</option>
                                <option value="factura">🧾 Facturación</option>
                                <option value="cuenta">👤 Mi Cuenta</option>
                                <option value="navegacion">🌐 Problema de Navegación</option>
                                <option value="otro">📝 Otro</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Tu Nombre</label>
                            <input type="text" id="nombreUsuario" placeholder="Tu nombre completo" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 10px; font-size: 14px;" required>
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Email</label>
                            <input type="email" id="emailUsuario" placeholder="tu@email.com" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 10px; font-size: 14px;" required>
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Número de Pedido (si aplica)</label>
                            <input type="text" id="numeroPedido" placeholder="Ej: #12345" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 10px; font-size: 14px;">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Descripción del Problema</label>
                            <textarea id="descripcionUsuario" placeholder="Describe tu problema o consulta..." style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 10px; font-size: 14px; min-height: 120px; resize: vertical;" required></textarea>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 15px; border-radius: 10px; border: 2px solid #F9A8D4;">
                            <p style="margin: 0; font-size: 13px; color: #6B7280; text-align: center;">
                                <i class="fas fa-shield-alt"></i> Tu consulta será atendida por el equipo de soporte especializado en compras.
                            </p>
                        </div>
                    </form>
                    
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button onclick="widgetSoporte.cerrarTicketUsuario()" style="flex: 1; background: #6B7280; color: white; border: none; padding: 15px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button onclick="widgetSoporte.crearTicketUsuario()" style="flex: 2; background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; border: none; padding: 15px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-paper-plane"></i> Enviar Consulta
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
    }

    mostrarFAQ() {
        this.close();
        
        const faqModal = `
            <div id="faqModal" class="modal" style="display: flex;">
                <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #7C3AED; margin-bottom: 10px;">❓ Preguntas Frecuentes</h2>
                        <p style="color: #6B7280;">Respuestas rápidas a las consultas más comunes</p>
                    </div>
                    
                    <div style="display: grid; gap: 15px;">
                        <div class="faq-item" style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; border: 2px solid #F9A8D4;">
                            <h4 style="color: #7C3AED; margin: 0 0 10px 0;">🛍️ ¿Cómo puedo realizar una compra?</h4>
                            <p style="color: #6B7280; margin: 0; font-size: 14px;">Simplemente navega por los productos, agrega al carrito y procede al checkout. Aceptamos múltiples métodos de pago.</p>
                        </div>
                        
                        <div class="faq-item" style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; border: 2px solid #F9A8D4;">
                            <h4 style="color: #7C3AED; margin: 0 0 10px 0;">💳 ¿Qué métodos de pago aceptan?</h4>
                            <p style="color: #6B7280; margin: 0; font-size: 14px;">Aceptamos tarjetas de crédito/débito, PayPal, transferencias bancarias y otros métodos locales según tu región.</p>
                        </div>
                        
                        <div class="faq-item" style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; border: 2px solid #F9A8D4;">
                            <h4 style="color: #7C3AED; margin: 0 0 10px 0;">🚚 ¿Cuánto tardan los envíos?</h4>
                            <p style="color: #6B7280; margin: 0; font-size: 14px;">Los tiempos de envío varían según tu ubicación. Generalmente entre 3-7 días hábiles para envíos nacionales.</p>
                        </div>
                        
                        <div class="faq-item" style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; border: 2px solid #F9A8D4;">
                            <h4 style="color: #7C3AED; margin: 0 0 10px 0;">↩️ ¿Puedo devolver un producto?</h4>
                            <p style="color: #6B7280; margin: 0; font-size: 14px;">Sí, aceptamos devoluciones dentro de 30 días. El producto debe estar en condiciones originales.</p>
                        </div>
                        
                        <div class="faq-item" style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; border: 2px solid #F9A8D4;">
                            <h4 style="color: #7C3AED; margin: 0 0 10px 0;">🧾 ¿Cómo obtengo mi factura?</h4>
                            <p style="color: #6B7280; margin: 0; font-size: 14px;">Tu factura se envía automáticamente al email registrado. También puedes descargarla desde tu cuenta.</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button onclick="widgetSoporte.cerrarFAQ()" style="background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-times"></i> Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', faqModal);
    }

    mostrarContacto() {
        this.close();
        
        const contactoModal = `
            <div id="contactoUsuarioModal" class="modal" style="display: flex;">
                <div class="modal-content" style="max-width: 600px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10B981, #34D399); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                            <i class="fas fa-phone" style="font-size: 32px; color: white;"></i>
                        </div>
                        <h2 style="color: #10B981; margin-bottom: 10px;">📞 Contacto Directo</h2>
                        <p style="color: #6B7280;">Formas de contactarnos para compradores</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; text-align: center; border: 2px solid #F9A8D4;">
                            <i class="fas fa-envelope" style="font-size: 24px; color: #EC4899; margin-bottom: 10px;"></i>
                            <h4 style="color: #7C3AED; margin-bottom: 5px;">Email</h4>
                            <p style="color: #6B7280; font-size: 14px; margin: 0;">soporte@cresalia.com</p>
                            <button onclick="widgetSoporte.copiarEmailUsuario()" style="background: #7C3AED; color: white; border: none; padding: 8px 15px; border-radius: 8px; font-size: 12px; margin-top: 10px; cursor: pointer;">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; text-align: center; border: 2px solid #F9A8D4;">
                            <i class="fab fa-whatsapp" style="font-size: 24px; color: #EC4899; margin-bottom: 10px;"></i>
                            <h4 style="color: #7C3AED; margin-bottom: 5px;">WhatsApp</h4>
                            <p style="color: #6B7280; font-size: 14px; margin: 0;">+54 9 11 1234-5678</p>
                            <button onclick="widgetSoporte.abrirWhatsAppUsuario()" style="background: #25D366; color: white; border: none; padding: 8px 15px; border-radius: 8px; font-size: 12px; margin-top: 10px; cursor: pointer;">
                                <i class="fab fa-whatsapp"></i> Abrir
                            </button>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; border: 2px solid #F9A8D4;">
                        <h4 style="color: #7C3AED; margin-bottom: 15px;"><i class="fas fa-clock"></i> Horarios de Atención</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; color: #6B7280;">
                            <div><strong>Lunes a Viernes:</strong> 9:00 - 18:00</div>
                            <div><strong>Sábados:</strong> 10:00 - 14:00</div>
                            <div><strong>Domingos:</strong> Cerrado</div>
                            <div><strong>Emergencias:</strong> 24/7</div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button onclick="widgetSoporte.cerrarContactoUsuario()" style="background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-times"></i> Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', contactoModal);
    }

    crearTicketUsuario() {
        const tipoConsulta = document.getElementById('tipoConsulta').value;
        const nombre = document.getElementById('nombreUsuario').value;
        const email = document.getElementById('emailUsuario').value;
        const numeroPedido = document.getElementById('numeroPedido').value;
        const descripcion = document.getElementById('descripcionUsuario').value;
        
        if (!nombre || !email || !descripcion) {
            alert('⚠️ Por favor, completa todos los campos obligatorios.');
            return;
        }
        
        // Crear ticket de usuario
        const ticket = {
            id: 'USR-' + Date.now(),
            tipoUsuario: 'Usuario',
            tipoConsulta,
            nombre,
            email,
            numeroPedido: numeroPedido || 'No especificado',
            descripcion,
            tienda: window.location.hostname,
            estado: 'Abierto',
            fecha: new Date().toLocaleString(),
            timestamp: Date.now()
        };
        
        // Guardar en localStorage
        let tickets = JSON.parse(localStorage.getItem('cresalia_tickets') || '[]');
        tickets.push(ticket);
        localStorage.setItem('cresalia_tickets', JSON.stringify(tickets));
        
        console.log('🎫 Ticket de usuario creado:', ticket);
        
        // Notificar al sistema
        this.notificarNuevoTicketUsuario(ticket);
        
        alert('✅ ¡Consulta enviada! ID: ' + ticket.id + '. Te responderemos pronto.');
        this.cerrarTicketUsuario();
    }

    notificarNuevoTicketUsuario(ticket) {
        const notificacion = {
            tipo: 'nuevo_ticket_usuario',
            ticket: ticket,
            timestamp: Date.now(),
            leido: false
        };
        
        let notificaciones = JSON.parse(localStorage.getItem('cresalia_notificaciones') || '[]');
        notificaciones.push(notificacion);
        localStorage.setItem('cresalia_notificaciones', JSON.stringify(notificaciones));
    }

    // Funciones de cierre de modales
    cerrarTicketUsuario() {
        const modal = document.getElementById('ticketUsuarioModal');
        if (modal) modal.remove();
    }

    cerrarFAQ() {
        const modal = document.getElementById('faqModal');
        if (modal) modal.remove();
    }

    cerrarContactoUsuario() {
        const modal = document.getElementById('contactoUsuarioModal');
        if (modal) modal.remove();
    }

    copiarEmailUsuario() {
        navigator.clipboard.writeText('soporte@cresalia.com');
        alert('📧 Email copiado al portapapeles');
    }

    abrirWhatsAppUsuario() {
        const mensaje = encodeURIComponent('Hola! Necesito ayuda con una compra en Cresalia.');
        window.open(`https://wa.me/5491112345678?text=${mensaje}`, '_blank');
    }

    loadPreferences() {
        // Cargar preferencias del usuario si las hay
        const prefs = localStorage.getItem('cresalia_usuario_prefs');
        if (prefs) {
            const preferences = JSON.parse(prefs);
            // Aplicar preferencias si las hay
        }
    }

    savePreferences() {
        // Guardar preferencias del usuario
        const preferences = {
            ultimaInteraccion: Date.now(),
            tipoUsuario: this.tipoUsuario
        };
        localStorage.setItem('cresalia_usuario_prefs', JSON.stringify(preferences));
    }
}

// Inicializar el widget cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar en páginas de tienda (no en admin)
    if (!window.location.pathname.includes('/admin') && !window.location.pathname.includes('gestion-tiendas')) {
        window.widgetSoporte = new WidgetSoporteUsuarios();
    }
});























