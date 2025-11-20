/**
 * 📧 Widget de Chat de Email - Brevo (Sendinblue)
 * Integración del chat de email de Brevo para contacto directo
 */

(function() {
    'use strict';

    // Configuración de Brevo Chat
    const BREVO_CHAT_CONFIG = {
        enabled: true,
        // ID del chat de Brevo (se obtiene desde el panel de Brevo)
        chatId: window.BREVO_CHAT_ID || process.env.BREVO_CHAT_ID || null,
        // Email de contacto por defecto
        defaultEmail: 'cresalia25@gmail.com',
        // Posición del widget
        position: 'bottom-right',
        // Estilos personalizados
        styles: {
            primaryColor: '#7C3AED',
            backgroundColor: '#FFFFFF',
            textColor: '#1F2937'
        }
    };

    // Verificar si Brevo Chat está configurado
    // Si no hay CHAT_ID, se usará el widget alternativo de contacto

    // Función para inicializar el widget de Brevo
    function inicializarBrevoChat() {
        if (!BREVO_CHAT_CONFIG.enabled || !BREVO_CHAT_CONFIG.chatId) {
            return;
        }

        try {
            // Cargar el script de Brevo Chat
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://conversations-widget.brevo.com/${BREVO_CHAT_CONFIG.chatId}/script.js`;
            script.async = true;
            script.defer = true;
            
            script.onload = function() {
                console.log('✅ Widget de Brevo Chat cargado correctamente');
                
                // Aplicar estilos personalizados si están disponibles
                if (window.BrevoConversations) {
                    aplicarEstilosPersonalizados();
                }
            };

            script.onerror = function() {
                console.warn('⚠️ No se pudo cargar el widget de Brevo Chat. Verificá que el CHAT_ID sea correcto.');
            };

            document.head.appendChild(script);
        } catch (error) {
            console.warn('⚠️ Error al cargar el widget de Brevo Chat:', error.message);
        }
    }

    // Función para aplicar estilos personalizados
    function aplicarEstilosPersonalizados() {
        const styles = BREVO_CHAT_CONFIG.styles;
        
        // Crear estilos personalizados para el widget
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos personalizados para el widget de Brevo Chat */
            .brevo-conversations-widget {
                --brevo-primary-color: ${styles.primaryColor} !important;
                --brevo-background-color: ${styles.backgroundColor} !important;
                --brevo-text-color: ${styles.textColor} !important;
            }
            
            /* Botón del widget */
            .brevo-conversations-widget-button {
                background: linear-gradient(135deg, ${styles.primaryColor}, #EC4899) !important;
                border-radius: 50% !important;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4) !important;
                transition: all 0.3s ease !important;
            }
            
            .brevo-conversations-widget-button:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6) !important;
            }
            
            /* Panel del chat */
            .brevo-conversations-widget-panel {
                border-radius: 12px !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Función alternativa: Widget de contacto por email simple
    function crearWidgetContactoSimple() {
        const widget = document.createElement('div');
        widget.id = 'brevo-contact-widget';
        widget.className = 'brevo-contact-widget';
        widget.innerHTML = `
            <button class="brevo-contact-button" onclick="abrirFormularioContacto()" title="Contactanos por email">
                <i class="fas fa-envelope"></i>
                <span>Contacto</span>
            </button>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .brevo-contact-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .brevo-contact-button {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 12px 24px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            }
            
            .brevo-contact-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6);
            }
            
            .brevo-contact-button i {
                font-size: 1.2rem;
            }
            
            @media (max-width: 768px) {
                .brevo-contact-widget {
                    bottom: 15px;
                    right: 15px;
                }
                
                .brevo-contact-button {
                    padding: 10px 20px;
                    font-size: 0.9rem;
                }
                
                .brevo-contact-button span {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(widget);
    }

    // Función para abrir el formulario de contacto
    window.abrirFormularioContacto = function() {
        const email = BREVO_CHAT_CONFIG.defaultEmail;
        const subject = encodeURIComponent('Consulta desde Cresalia');
        const body = encodeURIComponent('Hola,\n\nMe gustaría contactarme con el equipo de Cresalia.\n\nGracias.');
        
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (BREVO_CHAT_CONFIG.chatId) {
                inicializarBrevoChat();
            } else {
                // Si no hay CHAT_ID, usar widget simple de contacto
                crearWidgetContactoSimple();
            }
        });
    } else {
        if (BREVO_CHAT_CONFIG.chatId) {
            inicializarBrevoChat();
        } else {
            crearWidgetContactoSimple();
        }
    }
})();

