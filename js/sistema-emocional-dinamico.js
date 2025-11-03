// ===== SISTEMA EMOCIONAL DINÁMICO CRESALIA =====
// Sistema que cambia logo y colores según el estado de ánimo del cliente

class SistemaEmocionalDinamico {
    constructor() {
        this.estadosAnimo = {};
        this.configuracion = {};
        this.animaciones = {};
        this.inicializar();
    }

    // Inicializar sistema emocional
    inicializar() {
        console.log('💜 Inicializando Sistema Emocional Dinámico...');
        
        // Configurar estados de ánimo
        this.configurarEstadosAnimo();
        
        // Configurar animaciones
        this.configurarAnimaciones();
        
        // Configurar colores dinámicos
        this.configurarColoresDinamicos();
        
        // Detectar estado de ánimo del usuario
        this.detectarEstadoAnimo();
        
        console.log('✅ Sistema Emocional Dinámico inicializado');
    }

    // Configurar estados de ánimo
    configurarEstadosAnimo() {
        this.estadosAnimo = {
            feliz: {
                nombre: 'Feliz',
                emoji: '😊',
                colores: {
                    primario: '#10B981', // Verde
                    secundario: '#34D399', // Verde claro
                    acento: '#F59E0B', // Amarillo
                    texto: '#065F46' // Verde oscuro
                },
                animacion: 'bounce',
                mensaje: '¡Qué alegría verte tan feliz! 💚'
            },
            triste: {
                nombre: 'Triste',
                emoji: '😢',
                colores: {
                    primario: '#3B82F6', // Azul
                    secundario: '#60A5FA', // Azul claro
                    acento: '#93C5FD', // Azul muy claro
                    texto: '#1E40AF' // Azul oscuro
                },
                animacion: 'fade',
                mensaje: 'Estamos aquí para apoyarte 💙'
            },
            enojado: {
                nombre: 'Enojado',
                emoji: '😠',
                colores: {
                    primario: '#EF4444', // Rojo
                    secundario: '#F87171', // Rojo claro
                    acento: '#FCA5A5', // Rojo muy claro
                    texto: '#991B1B' // Rojo oscuro
                },
                animacion: 'shake',
                mensaje: 'Respira profundo, todo pasará ❤️'
            },
            ansioso: {
                nombre: 'Ansioso',
                emoji: '😰',
                colores: {
                    primario: '#8B5CF6', // Púrpura
                    secundario: '#A78BFA', // Púrpura claro
                    acento: '#C4B5FD', // Púrpura muy claro
                    texto: '#5B21B6' // Púrpura oscuro
                },
                animacion: 'pulse',
                mensaje: 'Todo va a estar bien 💜'
            },
            tranquilo: {
                nombre: 'Tranquilo',
                emoji: '😌',
                colores: {
                    primario: '#06B6D4', // Cian
                    secundario: '#22D3EE', // Cian claro
                    acento: '#67E8F9', // Cian muy claro
                    texto: '#0E7490' // Cian oscuro
                },
                animacion: 'float',
                mensaje: 'Qué paz transmites 💙'
            },
            emocionado: {
                nombre: 'Emocionado',
                emoji: '🤩',
                colores: {
                    primario: '#F59E0B', // Amarillo
                    secundario: '#FBBF24', // Amarillo claro
                    acento: '#FDE047', // Amarillo muy claro
                    texto: '#92400E' // Amarillo oscuro
                },
                animacion: 'sparkle',
                mensaje: '¡Tu energía es contagiosa! ⭐'
            },
            amoroso: {
                nombre: 'Amoroso',
                emoji: '🥰',
                colores: {
                    primario: '#EC4899', // Rosa
                    secundario: '#F472B6', // Rosa claro
                    acento: '#F9A8D4', // Rosa muy claro
                    texto: '#BE185D' // Rosa oscuro
                },
                animacion: 'heartbeat',
                mensaje: 'El amor que sientes es hermoso 💖'
            },
            neutral: {
                nombre: 'Neutral',
                emoji: '😐',
                colores: {
                    primario: '#6B7280', // Gris
                    secundario: '#9CA3AF', // Gris claro
                    acento: '#D1D5DB', // Gris muy claro
                    texto: '#374151' // Gris oscuro
                },
                animacion: 'none',
                mensaje: 'Estamos aquí contigo 🤍'
            }
        };
    }

    // Configurar animaciones
    configurarAnimaciones() {
        this.animaciones = {
            bounce: {
                nombre: 'Rebote',
                css: `
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-10px); }
                        60% { transform: translateY(-5px); }
                    }
                `,
                aplicacion: 'animation: bounce 2s infinite;'
            },
            fade: {
                nombre: 'Desvanecimiento',
                css: `
                    @keyframes fade {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.7; }
                    }
                `,
                aplicacion: 'animation: fade 3s infinite;'
            },
            shake: {
                nombre: 'Sacudida',
                css: `
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                        20%, 40%, 60%, 80% { transform: translateX(2px); }
                    }
                `,
                aplicacion: 'animation: shake 0.5s infinite;'
            },
            pulse: {
                nombre: 'Pulso',
                css: `
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                `,
                aplicacion: 'animation: pulse 2s infinite;'
            },
            float: {
                nombre: 'Flotación',
                css: `
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-8px); }
                    }
                `,
                aplicacion: 'animation: float 3s infinite;'
            },
            sparkle: {
                nombre: 'Brillo',
                css: `
                    @keyframes sparkle {
                        0%, 100% { transform: scale(1) rotate(0deg); }
                        25% { transform: scale(1.1) rotate(5deg); }
                        75% { transform: scale(1.1) rotate(-5deg); }
                    }
                `,
                aplicacion: 'animation: sparkle 1.5s infinite;'
            },
            heartbeat: {
                nombre: 'Latido',
                css: `
                    @keyframes heartbeat {
                        0%, 100% { transform: scale(1); }
                        25% { transform: scale(1.1); }
                        50% { transform: scale(1); }
                        75% { transform: scale(1.05); }
                    }
                `,
                aplicacion: 'animation: heartbeat 1.2s infinite;'
            }
        };
    }

    // Configurar colores dinámicos
    configurarColoresDinamicos() {
        this.coloresDinamicos = {
            // Variables CSS que cambiarán dinámicamente
            variables: [
                '--color-primario-emocional',
                '--color-secundario-emocional',
                '--color-acento-emocional',
                '--color-texto-emocional'
            ],
            // Elementos que cambiarán de color
            elementos: [
                '.logo-cresalia',
                '.navbar',
                '.btn-primary',
                '.text-primary',
                '.bg-primary',
                '.border-primary',
                'h1, h2, h3, h4, h5, h6',
                '.dashboard-card',
                '.modal-header'
            ]
        };
    }

    // Detectar estado de ánimo del usuario
    detectarEstadoAnimo() {
        // Verificar si el sistema de bienestar emocional está habilitado
        const bienestarHabilitado = localStorage.getItem('configuracionBienestar');
        if (!bienestarHabilitado || JSON.parse(bienestarHabilitado).activo !== true) {
            console.log('💜 Sistema de bienestar emocional deshabilitado');
            return;
        }

        // Verificar si hay un estado de ánimo guardado
        const estadoGuardado = localStorage.getItem('estadoAnimoUsuario');
        if (estadoGuardado) {
            this.aplicarEstadoAnimo(JSON.parse(estadoGuardado));
            return;
        }

        // Si no hay estado guardado, usar neutral por defecto
        this.aplicarEstadoAnimo('neutral');
    }

    // Aplicar estado de ánimo
    aplicarEstadoAnimo(estado) {
        const configuracion = this.estadosAnimo[estado];
        if (!configuracion) {
            console.warn('⚠️ Estado de ánimo no encontrado:', estado);
            return;
        }

        console.log(`💜 Aplicando estado de ánimo: ${configuracion.nombre} ${configuracion.emoji}`);

        // Aplicar colores
        this.aplicarColores(configuracion.colores);

        // Aplicar animación al logo
        this.aplicarAnimacionLogo(configuracion.animacion);

        // Mostrar mensaje emocional
        this.mostrarMensajeEmocional(configuracion.mensaje);

        // Guardar estado
        localStorage.setItem('estadoAnimoUsuario', JSON.stringify(estado));
    }

    // Aplicar colores dinámicos
    aplicarColores(colores) {
        const root = document.documentElement;
        
        // Aplicar variables CSS
        root.style.setProperty('--color-primario-emocional', colores.primario);
        root.style.setProperty('--color-secundario-emocional', colores.secundario);
        root.style.setProperty('--color-acento-emocional', colores.acento);
        root.style.setProperty('--color-texto-emocional', colores.texto);

        // Aplicar estilos dinámicos
        this.aplicarEstilosDinamicos(colores);
    }

    // Aplicar estilos dinámicos
    aplicarEstilosDinamicos(colores) {
        let estilosExistentes = document.getElementById('estilos-emocionales');
        
        if (!estilosExistentes) {
            estilosExistentes = document.createElement('style');
            estilosExistentes.id = 'estilos-emocionales';
            document.head.appendChild(estilosExistentes);
        }
        
        const css = `
            /* Estilos emocionales dinámicos */
            .logo-cresalia {
                color: var(--color-primario-emocional) !important;
                transition: all 0.5s ease;
            }
            
            .navbar {
                background: linear-gradient(135deg, var(--color-primario-emocional), var(--color-secundario-emocional)) !important;
                transition: all 0.5s ease;
            }
            
            .btn-primary {
                background-color: var(--color-primario-emocional) !important;
                border-color: var(--color-primario-emocional) !important;
                transition: all 0.5s ease;
            }
            
            .btn-primary:hover {
                background-color: var(--color-secundario-emocional) !important;
                border-color: var(--color-secundario-emocional) !important;
            }
            
            .text-primary {
                color: var(--color-primario-emocional) !important;
                transition: all 0.5s ease;
            }
            
            .bg-primary {
                background-color: var(--color-primario-emocional) !important;
                transition: all 0.5s ease;
            }
            
            .border-primary {
                border-color: var(--color-primario-emocional) !important;
                transition: all 0.5s ease;
            }
            
            h1, h2, h3, h4, h5, h6 {
                color: var(--color-texto-emocional) !important;
                transition: all 0.5s ease;
            }
            
            .dashboard-card {
                border-left: 4px solid var(--color-primario-emocional) !important;
                transition: all 0.5s ease;
            }
            
            .modal-header {
                background: linear-gradient(135deg, var(--color-primario-emocional), var(--color-secundario-emocional)) !important;
                color: white !important;
                transition: all 0.5s ease;
            }
            
            /* Animaciones emocionales */
            .logo-cresalia.emocional {
                animation: var(--animacion-emocional);
            }
        `;
        
        estilosExistentes.textContent = css;
    }

    // Aplicar animación al logo
    aplicarAnimacionLogo(animacion) {
        const logo = document.querySelector('.logo-cresalia');
        if (!logo) return;

        // Remover animaciones anteriores
        logo.classList.remove('emocional');
        Object.keys(this.animaciones).forEach(anim => {
            logo.style.animation = '';
        });

        if (animacion === 'none') return;

        // Aplicar nueva animación
        const animacionConfig = this.animaciones[animacion];
        if (animacionConfig) {
            // Agregar CSS de animación
            this.agregarAnimacionCSS(animacionConfig);
            
            // Aplicar animación al logo
            logo.classList.add('emocional');
            logo.style.animation = animacionConfig.aplicacion;
            
            // Guardar animación en variable CSS
            document.documentElement.style.setProperty('--animacion-emocional', animacionConfig.aplicacion);
        }
    }

    // Agregar CSS de animación
    agregarAnimacionCSS(animacionConfig) {
        let estilosAnimacion = document.getElementById('animaciones-emocionales');
        
        if (!estilosAnimacion) {
            estilosAnimacion = document.createElement('style');
            estilosAnimacion.id = 'animaciones-emocionales';
            document.head.appendChild(estilosAnimacion);
        }
        
        estilosAnimacion.textContent = animacionConfig.css;
    }

    // Mostrar mensaje emocional
    mostrarMensajeEmocional(mensaje) {
        // Crear notificación emocional
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-emocional';
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--color-primario-emocional), var(--color-secundario-emocional));
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999999;
            font-weight: 500;
            max-width: 300px;
            animation: slideInRight 0.5s ease;
        `;
        
        notificacion.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2em;">💜</span>
                <span>${mensaje}</span>
            </div>
        `;
        
        document.body.appendChild(notificacion);
        
        // Auto-remover después de 4 segundos
        setTimeout(() => {
            notificacion.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 500);
        }, 4000);
    }

    // Cambiar estado de ánimo manualmente
    cambiarEstadoAnimo(estado) {
        this.aplicarEstadoAnimo(estado);
    }

    // Obtener estado actual
    obtenerEstadoActual() {
        const estadoGuardado = localStorage.getItem('estadoAnimoUsuario');
        return estadoGuardado ? JSON.parse(estadoGuardado) : 'neutral';
    }

    // Deshabilitar sistema emocional
    deshabilitarSistemaEmocional() {
        // Remover estilos emocionales
        const estilosEmocionales = document.getElementById('estilos-emocionales');
        if (estilosEmocionales) {
            estilosEmocionales.remove();
        }

        // Remover animaciones emocionales
        const animacionesEmocionales = document.getElementById('animaciones-emocionales');
        if (animacionesEmocionales) {
            animacionesEmocionales.remove();
        }

        // Limpiar localStorage
        localStorage.removeItem('estadoAnimoUsuario');

        // Restaurar colores por defecto
        this.restaurarColoresPorDefecto();

        console.log('💜 Sistema emocional deshabilitado');
    }

    // Restaurar colores por defecto
    restaurarColoresPorDefecto() {
        const root = document.documentElement;
        
        // Restaurar variables CSS por defecto
        root.style.setProperty('--color-primario-emocional', '#667eea');
        root.style.setProperty('--color-secundario-emocional', '#764ba2');
        root.style.setProperty('--color-acento-emocional', '#a855f7');
        root.style.setProperty('--color-texto-emocional', '#1e293b');

        // Remover animación del logo
        const logo = document.querySelector('.logo-cresalia');
        if (logo) {
            logo.classList.remove('emocional');
            logo.style.animation = '';
        }
    }

    // Mostrar selector de estado de ánimo
    mostrarSelectorEstadoAnimo() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.8) !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <h3 style="color: #667eea; margin-bottom: 20px; text-align: center;">💜 ¿Cómo te sientes hoy?</h3>
                <p style="text-align: center; color: #666; margin-bottom: 30px;">Cresalia se adaptará a tu estado de ánimo</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    ${Object.keys(this.estadosAnimo).map(estado => {
                        const config = this.estadosAnimo[estado];
                        return `
                            <div style="
                                background: linear-gradient(135deg, ${config.colores.primario}, ${config.colores.secundario});
                                color: white;
                                padding: 20px;
                                border-radius: 12px;
                                text-align: center;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                border: 2px solid transparent;
                            " onclick="cambiarEstadoAnimo('${estado}'); cerrarModal(this)" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                <div style="font-size: 2em; margin-bottom: 10px;">${config.emoji}</div>
                                <h4 style="margin: 0; font-size: 1rem;">${config.nombre}</h4>
                                <p style="margin: 5px 0 0 0; font-size: 0.8rem; opacity: 0.9;">${config.mensaje}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div style="text-align: center;">
                    <button onclick="cerrarModal(this)" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Agregar CSS de animaciones
    agregarCSSAnimaciones() {
        const css = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        
        let estilos = document.getElementById('animaciones-notificaciones');
        if (!estilos) {
            estilos = document.createElement('style');
            estilos.id = 'animaciones-notificaciones';
            document.head.appendChild(estilos);
        }
        
        estilos.textContent = css;
    }
}

// Inicializar sistema globalmente
window.sistemaEmocional = new SistemaEmocionalDinamico();

// Funciones globales
window.cambiarEstadoAnimo = function(estado) {
    window.sistemaEmocional.cambiarEstadoAnimo(estado);
};

window.mostrarSelectorEstadoAnimo = function() {
    window.sistemaEmocional.mostrarSelectorEstadoAnimo();
};

window.obtenerEstadoAnimo = function() {
    return window.sistemaEmocional.obtenerEstadoActual();
};

window.deshabilitarSistemaEmocional = function() {
    window.sistemaEmocional.deshabilitarSistemaEmocional();
};

// Agregar CSS de animaciones
window.sistemaEmocional.agregarCSSAnimaciones();

console.log('✅ Sistema Emocional Dinámico cargado correctamente');
