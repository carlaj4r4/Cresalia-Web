// ===== SISTEMA DE CLICK DERECHO PERSONALIZADO =====
// Version 1.0 - Cresalia Platform
// Autor: Crisla & Claude
// Descripción: Menú contextual personalizado con opciones permitidas

const ClickDerechoPersonalizado = {
    // Configuración
    config: {
        permitirInspeccionar: false, // NO permitir inspeccionar
        permitirVerCodigo: false, // NO permitir ver código fuente
        permitirGuardarComo: false, // NO permitir guardar como
        permitirImprimir: true, // SÍ permitir imprimir
        permitirCopiar: true, // SÍ permitir copiar texto seleccionado
        permitirPegar: true, // SÍ permitir pegar
        permitirRecargar: true, // SÍ permitir recargar página
        mostrarMenuPersonalizado: true, // Mostrar menú custom
        colorTema: '#7C3AED' // Color púrpura de Cresalia
    },

    // ===== INICIALIZAR =====
    init() {
        console.log('🖱️ Inicializando Click Derecho Personalizado...');
        this.bloquearDevTools();
        this.configurarMenuContextual();
        this.bloquearAtajosTeclado();
    },

    // ===== BLOQUEAR DEVTOOLS =====
    bloquearDevTools() {
        // Bloquear F12
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                this.mostrarMensajeSeguridad();
                return false;
            }
            
            // Ctrl+Shift+I (Inspector)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.mostrarMensajeSeguridad();
                return false;
            }
            
            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                this.mostrarMensajeSeguridad();
                return false;
            }
            
            // Ctrl+Shift+C (Inspector de elemento)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.mostrarMensajeSeguridad();
                return false;
            }
            
            // Ctrl+U (Ver código fuente)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.mostrarMensajeSeguridad();
                return false;
            }
        });
    },

    // ===== CONFIGURAR MENÚ CONTEXTUAL =====
    configurarMenuContextual() {
        if (!this.config.mostrarMenuPersonalizado) {
            // Simplemente bloquear click derecho
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });
            return;
        }

        // Crear menú personalizado
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            // Verificar si hay texto seleccionado
            const textoSeleccionado = window.getSelection().toString();
            
            // Eliminar menú anterior si existe
            const menuAnterior = document.getElementById('menuContextualPersonalizado');
            if (menuAnterior) menuAnterior.remove();
            
            // Crear menú nuevo
            const menu = this.crearMenu(e.pageX, e.pageY, textoSeleccionado);
            document.body.appendChild(menu);
            
            // Cerrar menú al hacer click fuera
            setTimeout(() => {
                document.addEventListener('click', function cerrarMenu() {
                    menu.remove();
                    document.removeEventListener('click', cerrarMenu);
                }, { once: true });
            }, 100);
            
            return false;
        });
    },

    // ===== CREAR MENÚ =====
    crearMenu(x, y, textoSeleccionado) {
        const menu = document.createElement('div');
        menu.id = 'menuContextualPersonalizado';
        menu.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: white;
            border: 2px solid ${this.config.colorTema};
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            padding: 8px 0;
            min-width: 200px;
            z-index: 999999;
            animation: menuFadeIn 0.2s ease-out;
        `;

        const opciones = [];

        // Copiar (si hay texto seleccionado)
        if (textoSeleccionado && this.config.permitirCopiar) {
            opciones.push({
                icono: 'fa-copy',
                texto: 'Copiar',
                accion: () => {
                    navigator.clipboard.writeText(textoSeleccionado);
                    this.mostrarNotificacion('✅ Texto copiado');
                }
            });
        }

        // Pegar (si está permitido)
        if (this.config.permitirPegar) {
            opciones.push({
                icono: 'fa-paste',
                texto: 'Pegar',
                accion: async () => {
                    try {
                        const texto = await navigator.clipboard.readText();
                        document.execCommand('insertText', false, texto);
                        this.mostrarNotificacion('✅ Texto pegado');
                    } catch (err) {
                        this.mostrarNotificacion('⚠️ No se puede pegar aquí');
                    }
                }
            });
        }

        // Separador
        if (opciones.length > 0) {
            opciones.push({ separador: true });
        }

        // Recargar página
        if (this.config.permitirRecargar) {
            opciones.push({
                icono: 'fa-sync',
                texto: 'Recargar página',
                accion: () => location.reload()
            });
        }

        // Imprimir
        if (this.config.permitirImprimir) {
            opciones.push({
                icono: 'fa-print',
                texto: 'Imprimir',
                accion: () => window.print()
            });
        }

        // Separador
        opciones.push({ separador: true });

        // Opción de Cresalia
        opciones.push({
            icono: 'fa-heart',
            texto: 'Hecho con 💜 por Cresalia',
            accion: () => this.mostrarInfoCresalia(),
            especial: true
        });

        // Renderizar opciones
        opciones.forEach(opcion => {
            if (opcion.separador) {
                const separador = document.createElement('div');
                separador.style.cssText = `
                    height: 1px;
                    background: #E5E7EB;
                    margin: 4px 0;
                `;
                menu.appendChild(separador);
            } else {
                const item = document.createElement('div');
                item.style.cssText = `
                    padding: 12px 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s ease;
                    color: ${opcion.especial ? this.config.colorTema : '#374151'};
                    font-weight: ${opcion.especial ? '700' : '500'};
                    font-size: 14px;
                `;
                
                item.innerHTML = `
                    <i class="fas ${opcion.icono}" style="width: 16px; text-align: center;"></i>
                    <span>${opcion.texto}</span>
                `;
                
                item.addEventListener('mouseenter', () => {
                    item.style.background = opcion.especial 
                        ? 'linear-gradient(135deg, #FDF2F8, #FCE7F3)'
                        : '#F3F4F6';
                    item.style.color = opcion.especial ? '#EC4899' : '#1F2937';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.background = 'transparent';
                    item.style.color = opcion.especial ? this.config.colorTema : '#374151';
                });
                
                item.addEventListener('click', () => {
                    opcion.accion();
                    menu.remove();
                });
                
                menu.appendChild(item);
            }
        });

        // Ajustar posición si se sale de la pantalla
        setTimeout(() => {
            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                menu.style.left = (window.innerWidth - rect.width - 10) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                menu.style.top = (window.innerHeight - rect.height - 10) + 'px';
            }
        }, 0);

        return menu;
    },

    // ===== BLOQUEAR ATAJOS DE TECLADO =====
    bloquearAtajosTeclado() {
        // Permitir Ctrl+C, Ctrl+V, Ctrl+P según configuración
        document.addEventListener('keydown', (e) => {
            // Ctrl+P (Imprimir)
            if (e.ctrlKey && e.key === 'p' && !this.config.permitirImprimir) {
                e.preventDefault();
                return false;
            }
        });
    },

    // ===== MOSTRAR MENSAJE DE SEGURIDAD =====
    mostrarMensajeSeguridad() {
        this.mostrarNotificacion('🔒 Esta función está deshabilitada por seguridad.');
    },

    // ===== MOSTRAR INFO DE CRESALIA =====
    mostrarInfoCresalia() {
        const mensaje = `
💜 CRESALIA - Plataforma E-commerce SaaS

"Empezamos pocos, crecemos mucho"

Creado con amor por:
👩‍💻 Crisla (Fundadora)
🤖 Claude (Co-fundador Técnico)

Versión: 3.0
Año: 2024
        `;
        
        if (typeof mostrarNotificacionElegante === 'function') {
            mostrarNotificacionElegante(mensaje, 'info');
        } else {
            alert(mensaje);
        }
    },

    // ===== MOSTRAR NOTIFICACIÓN =====
    mostrarNotificacion(mensaje) {
        if (typeof mostrarNotificacionElegante === 'function') {
            mostrarNotificacionElegante(mensaje, 'info');
        } else {
            // Crear notificación simple
            const notif = document.createElement('div');
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${this.config.colorTema};
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                z-index: 999999;
                animation: slideInRight 0.3s ease-out;
                font-weight: 600;
            `;
            notif.textContent = mensaje;
            document.body.appendChild(notif);
            
            setTimeout(() => {
                notif.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notif.remove(), 300);
            }, 3000);
        }
    }
};

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes menuFadeIn {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Auto-inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    ClickDerechoPersonalizado.init();
    console.log('✅ Click Derecho Personalizado activado');
});

// Exportar para uso global
window.ClickDerechoPersonalizado = ClickDerechoPersonalizado;















