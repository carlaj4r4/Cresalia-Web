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
        // En el navegador solo usamos window.BREVO_CHAT_ID (process.env no existe en el navegador)
        // CHAT_ID por defecto (del código oficial que compartiste)
        chatId: (typeof window !== 'undefined' && window.BREVO_CHAT_ID) ? window.BREVO_CHAT_ID : '690dfda549b4965c230fab76',
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

    // Función para inicializar el widget de Brevo (usando el código oficial)
    function inicializarBrevoChat() {
        if (!BREVO_CHAT_CONFIG.enabled || !BREVO_CHAT_CONFIG.chatId) {
            return;
        }

        try {
            // Verificar si ya está cargado
            if (window.BrevoConversationsID) {
                console.log('⚠️ Widget de Brevo ya está cargado');
                return;
            }
            
            // Usar el código oficial de Brevo Conversations (formato exacto del panel)
            const chatId = BREVO_CHAT_CONFIG.chatId;
            
            // Usar el código oficial exacto de Brevo (formato del panel)
            const scriptCode = `
                (function(d, w, c) {
                    w.BrevoConversationsID = '${chatId}';
                    w[c] = w[c] || function() {
                        (w[c].q = w[c].q || []).push(arguments);
                    };
                    var s = d.createElement('script');
                    s.async = true;
                    s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
                    if (d.head) d.head.appendChild(s);
                })(document, window, 'BrevoConversations');
            `;
            
            // Crear y ejecutar el script
            const script = document.createElement('script');
            script.textContent = scriptCode;
            
            if (document.head) {
                document.head.appendChild(script);
                console.log('✅ Script de Brevo Conversations inyectado correctamente');
            } else {
                document.addEventListener('DOMContentLoaded', function() {
                    document.head.appendChild(script);
                    console.log('✅ Script de Brevo Conversations inyectado después de DOMContentLoaded');
                });
            }
            
            console.log('📧 Inicializando widget oficial de Brevo Conversations con ID:', chatId);
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
            
            /* Botón del widget con logo personalizado */
            .brevo-conversations-widget-button {
                background: linear-gradient(135deg, ${styles.primaryColor}, #EC4899) !important;
                border-radius: 50% !important;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4) !important;
                transition: all 0.3s ease !important;
                background-image: url('/assets/logo/logo-cresalia.png') !important;
                background-size: 60% !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
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
            
            /* Logo en el header del panel de chat */
            .brevo-conversations-widget-panel header::before {
                content: '';
                display: inline-block;
                width: 32px;
                height: 32px;
                background-image: url('/assets/logo/logo-cresalia.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                margin-right: 10px;
                vertical-align: middle;
            }
        `;
        document.head.appendChild(style);
    }

    // Función alternativa: Widget de contacto por email simple
    function crearWidgetContactoSimple() {
        // Verificar si ya existe
        if (document.getElementById('brevo-contact-widget')) {
            console.log('⚠️ Widget de contacto Brevo ya existe');
            return;
        }
        
        console.log('📧 Creando widget de contacto simple');
        
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
                right: 100px;
                z-index: 7999;
            }
            
            /* Ajuste para que no se superponga con chatbots (que están en right: 20px) */
            /* Los chatbots tienen z-index: 10000, así que este estará debajo */
            
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
            
            /* Ajuste responsive para móviles */
            @media (max-width: 768px) {
                .brevo-contact-widget {
                    bottom: 15px;
                    right: 90px;
                    z-index: 7998;
                }
                
                .brevo-contact-button {
                    padding: 10px 20px;
                    font-size: 0.9rem;
                }
                
                .brevo-contact-button span {
                    display: none;
                }
            }
            
            /* Ajuste cuando hay muchos widgets flotantes */
            @media (min-width: 769px) {
                /* En desktop, si hay chatbot visible, ajustar posición */
                body:has(.chatbot-ia-container) .brevo-contact-widget {
                    right: 110px;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(widget);
        
        console.log('✅ Widget de contacto simple creado correctamente');
    }

    // Función para abrir el formulario de contacto
    window.abrirFormularioContacto = function() {
        const email = BREVO_CHAT_CONFIG.defaultEmail;
        const subject = encodeURIComponent('Consulta desde Cresalia');
        const body = encodeURIComponent('Hola,\n\nMe gustaría contactarme con el equipo de Cresalia.\n\nGracias.');
        
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    // Inicializar cuando el DOM esté listo
    function inicializarWidget() {
        // Esperar a que el body exista
        if (!document.body) {
            setTimeout(inicializarWidget, 100);
            return;
        }
        
        // Verificar si estamos en una página donde NO debe aparecer (paneles admin específicos)
        const pathname = window.location.pathname;
        const href = window.location.href;
        
        // Páginas de admin que NO deben mostrar el widget (paneles internos de tienda)
        // PERO permitir en admin-final.html ya que el usuario lo pidió
        const isAdminPanel = pathname.includes('/admin-arreglado.html') ||
                            pathname.includes('/admin-bienestar.html') ||
                            (pathname.includes('/admin') && 
                             !pathname.includes('panel-comunidad') && 
                             !pathname.includes('admin-final.html'));
        
        // NO mostrar en algunos paneles admin de tiendas (pero SÍ en admin-final.html y paneles de comunidad)
        if (isAdminPanel) {
            console.log('⚠️ Panel admin específico, no se muestra widget Brevo:', pathname);
            return;
        }
        
        // Verificar si estamos en una página de tienda pública (sin /admin)
        const isTiendaPage = pathname.includes('/tiendas/') && !pathname.includes('/admin');
        const isIndexCresalia = pathname.includes('index-cresalia.html') || 
                                pathname === '/' ||
                                pathname === '/index-cresalia.html' ||
                                pathname.endsWith('/index-cresalia.html');
        const isComunidad = pathname.includes('/comunidades/');
        const isPanelComunidad = pathname.includes('panel-comunidad-vendedores.html') ||
                                 pathname.includes('panel-comunidad-compradores.html');
        
        console.log('🔍 Verificando widget Brevo:', {
            pathname: pathname,
            href: href,
            isTiendaPage,
            isIndexCresalia,
            isComunidad,
            isPanelComunidad,
            isAdminPanel,
            chatId: BREVO_CHAT_CONFIG.chatId ? '✅ Configurado' : '❌ No configurado',
            enabled: BREVO_CHAT_CONFIG.enabled
        });
        
        // NO mostrar en comunidades específicas (pero SÍ en paneles de comunidad)
        if (isComunidad && !isPanelComunidad) {
            console.log('⚠️ Comunidad específica, no se muestra widget Brevo');
            return;
        }
        
        // Mostrar en TODAS las páginas públicas (index, tiendas, etc.)
        // excepto en páginas de admin y comunidades
        console.log('✅ Página válida para mostrar widget Brevo');
        
        // SIEMPRE mostrar el widget (simple si no hay CHAT_ID, oficial si hay CHAT_ID)
        if (BREVO_CHAT_CONFIG.chatId && BREVO_CHAT_CONFIG.enabled) {
            console.log('📧 Inicializando widget Brevo OFICIAL con CHAT_ID:', BREVO_CHAT_CONFIG.chatId);
            console.log('ℹ️ El widget oficial de Brevo se configurará según tu panel de Brevo');
            
            // Eliminar widget simple si existe (para evitar duplicados)
            const widgetSimpleExistente = document.getElementById('brevo-contact-widget');
            if (widgetSimpleExistente) {
                widgetSimpleExistente.remove();
                console.log('🗑️ Widget simple eliminado (el oficial está activo)');
            }
            
            // Aplicar estilos personalizados antes de inicializar
            aplicarEstilosPersonalizados();
            
            inicializarBrevoChat();
            
            // Verificar después de un tiempo si el widget oficial se cargó
            setTimeout(() => {
                // Verificar si el widget oficial se cargó correctamente
                const widgetOficial = document.querySelector('.brevo-conversations-widget') || 
                                     document.querySelector('[data-brevo-conversations]') ||
                                     document.querySelector('iframe[src*="brevo"]') ||
                                     window.BrevoConversations;
                
                if (!widgetOficial && !document.getElementById('brevo-contact-widget')) {
                    console.log('⚠️ Widget oficial de Brevo no apareció, creando widget simple como respaldo');
                    crearWidgetContactoSimple();
                } else if (widgetOficial) {
                    console.log('✅ Widget oficial de Brevo cargado correctamente');
                }
            }, 5000); // Esperar 5 segundos para que el widget oficial se cargue
        } else {
            console.log('📧 No hay CHAT_ID configurado, usando widget SIMPLE de contacto');
            // Si no hay CHAT_ID, usar widget simple de contacto (siempre visible)
            crearWidgetContactoSimple();
        }
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarWidget);
    } else {
        // Si ya está cargado, esperar un poco para asegurar que todo esté listo
        setTimeout(inicializarWidget, 100);
    }
})();

