// ===== PROTECCIÓN DEVTOOLS - CRESALIA =====
// Bloquea herramientas de desarrollador pero permite acciones normales

class ProteccionDevTools {
    constructor() {
        this.devToolsAbierto = false;
        this.init();
    }

    init() {
        // Detectar DevTools
        this.detectarDevTools();
        
        // Bloquear atajos de teclado de DevTools
        this.bloquearAtajosDevTools();
        
        // Permitir menú contextual selectivo
        this.configurarMenuContextual();
        
        // Detectar intentos de inspeccionar
        this.detectarInspeccion();
    }

    // Detectar si DevTools está abierto
    detectarDevTools() {
        const deteccion = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                if (!this.devToolsAbierto) {
                    this.devToolsAbierto = true;
                    this.manejarDevToolsAbierto();
                }
            } else {
                this.devToolsAbierto = false;
            }
        };

        // Revisar cada 500ms
        setInterval(deteccion, 500);

        // También detectar por tamaño de ventana
        window.addEventListener('resize', deteccion);
    }

    // Bloquear atajos de teclado
    bloquearAtajosDevTools() {
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                this.mostrarAdvertencia();
                return false;
            }

            // Ctrl+Shift+I (Inspect)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.mostrarAdvertencia();
                return false;
            }

            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                this.mostrarAdvertencia();
                return false;
            }

            // Ctrl+Shift+C (Selector)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.mostrarAdvertencia();
                return false;
            }

            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.mostrarAdvertencia();
                return false;
            }
        });
    }

    // Menu contextual selectivo
    configurarMenuContextual() {
        document.addEventListener('contextmenu', (e) => {
            // Permitir en inputs y textareas (para pegar)
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return true; // Permitir
            }

            // Permitir en links (para "abrir en nueva pestaña")
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return true; // Permitir
            }

            // Permitir en imágenes (para "abrir imagen en nueva pestaña")
            if (e.target.tagName === 'IMG') {
                return true; // Permitir
            }

            // Bloquear en todo lo demás (evita "Inspeccionar")
            e.preventDefault();
            
            // Mostrar menú personalizado amigable
            this.mostrarMenuPersonalizado(e);
            return false;
        });
    }

    // Menú personalizado (sin "Inspeccionar")
    mostrarMenuPersonalizado(e) {
        // Remover menú anterior si existe
        document.querySelector('.menu-contextual-custom')?.remove();

        const menu = document.createElement('div');
        menu.className = 'menu-contextual-custom';
        menu.style.left = `${e.pageX}px`;
        menu.style.top = `${e.pageY}px`;

        const elemento = e.target;
        const esLink = elemento.tagName === 'A' || elemento.closest('a');
        const esImagen = elemento.tagName === 'IMG';

        menu.innerHTML = `
            ${esLink ? `
                <div class="menu-item" onclick="window.open('${elemento.href}', '_blank')">
                    <i class="fas fa-external-link-alt"></i>
                    Abrir en nueva pestaña
                </div>
            ` : ''}
            
            ${esImagen ? `
                <div class="menu-item" onclick="window.open('${elemento.src}', '_blank')">
                    <i class="fas fa-image"></i>
                    Abrir imagen en nueva pestaña
                </div>
            ` : ''}
            
            <div class="menu-item" onclick="window.location.reload()">
                <i class="fas fa-redo"></i>
                Recargar página
            </div>
            
            <div class="menu-item" onclick="window.print()">
                <i class="fas fa-print"></i>
                Imprimir
            </div>
            
            <div class="menu-divider"></div>
            
            <div class="menu-item-info">
                <i class="fas fa-shield-alt"></i>
                Sitio protegido por Cresalia
            </div>
        `;

        document.body.appendChild(menu);

        // Cerrar al hacer clic fuera
        const cerrarMenu = (event) => {
            if (!menu.contains(event.target)) {
                menu.remove();
                document.removeEventListener('click', cerrarMenu);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', cerrarMenu);
        }, 10);
    }

    // Detectar inspección
    detectarInspeccion() {
        // Detectar console.log
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: () => {
                this.manejarDevToolsAbierto();
            }
        });

        // Revisar periódicamente
        setInterval(() => {
            console.log(element);
            console.clear();
        }, 1000);
    }

    // Manejar cuando DevTools está abierto
    manejarDevToolsAbierto() {
        // Mostrar overlay de advertencia
        if (document.querySelector('.devtools-warning')) return;

        const warning = document.createElement('div');
        warning.className = 'devtools-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <div class="warning-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h2>🔐 Protección Activada</h2>
                <p>Esta plataforma está protegida.</p>
                <p>Las herramientas de desarrollador están deshabilitadas por seguridad.</p>
                <p class="warning-footer">Cresalia - Seguridad para emprendedores 💜</p>
            </div>
        `;

        document.body.appendChild(warning);

        // Cerrar DevTools forzosamente (opcional, puede ser molesto)
        // window.close(); // NO recomendado
    }

    // Advertencia amigable
    mostrarAdvertencia() {
        const notif = document.createElement('div');
        notif.className = 'proteccion-notificacion';
        notif.innerHTML = `
            <i class="fas fa-shield-alt"></i>
            Herramientas de desarrollador deshabilitadas por seguridad
        `;
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // Estilos
    getStyles() {
        return `
        <style>
            /* Menú contextual personalizado */
            .menu-contextual-custom {
                position: absolute;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                padding: 8px;
                min-width: 200px;
                z-index: 10000;
                animation: menuAppear 0.2s ease;
            }

            @keyframes menuAppear {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .menu-item {
                padding: 12px 16px;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 14px;
                color: #1F2937;
                transition: all 0.2s;
            }

            .menu-item:hover {
                background: #F3F4F6;
            }

            .menu-item i {
                color: #7C3AED;
                width: 16px;
            }

            .menu-divider {
                height: 1px;
                background: #E5E7EB;
                margin: 8px 0;
            }

            .menu-item-info {
                padding: 12px 16px;
                font-size: 12px;
                color: #9CA3AF;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* Advertencia DevTools */
            .devtools-warning {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                animation: fadeIn 0.3s ease;
            }

            .warning-content {
                background: white;
                border-radius: 24px;
                padding: 48px;
                text-align: center;
                max-width: 500px;
            }

            .warning-icon {
                font-size: 80px;
                color: #7C3AED;
                margin-bottom: 24px;
            }

            .warning-content h2 {
                font-size: 28px;
                color: #1F2937;
                margin-bottom: 16px;
            }

            .warning-content p {
                color: #6B7280;
                font-size: 16px;
                margin-bottom: 12px;
                line-height: 1.6;
            }

            .warning-footer {
                margin-top: 24px;
                font-size: 14px;
                color: #7C3AED;
                font-weight: 600;
            }

            /* Notificación de protección */
            .proteccion-notificacion {
                position: fixed;
                top: 24px;
                right: 24px;
                background: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                border-left: 4px solid #7C3AED;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .proteccion-notificacion.show {
                transform: translateX(0);
                opacity: 1;
            }

            .proteccion-notificacion i {
                color: #7C3AED;
                font-size: 20px;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        </style>
        `;
    }
}

// Inicializar automáticamente
document.addEventListener('DOMContentLoaded', () => {
    window.proteccionDevTools = new ProteccionDevTools();
    
    // Agregar estilos
    const styles = document.createElement('div');
    styles.innerHTML = window.proteccionDevTools.getStyles();
    document.head.appendChild(styles);
});

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProteccionDevTools };
}


