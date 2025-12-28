// ===== PROTECCIÓN AVANZADA DEVTOOLS - CRESALIA =====
// Sistema mejorado de protección contra herramientas de desarrollador

class ProteccionDevToolsAvanzada {
    constructor() {
        // DESACTIVAR PROTECCIÓN EN LOCALHOST PARA DESARROLLO
        this.esLocalhost = this.detectarLocalhost();
        
        if (this.esLocalhost) {
            console.log('🔓 Protección DevTools DESACTIVADA (localhost detectado)');
            return; // No inicializar protección en localhost
        }
        
        this.devToolsAbierto = false;
        this.attempts = 0;
        this.maxAttempts = 3;
        this.blocked = false;
        this.init();
    }

    // Detectar si estamos en localhost
    detectarLocalhost() {
        if (typeof window === 'undefined') return false;
        
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        // Detectar localhost, 127.0.0.1, o cualquier IP local
        return hostname === 'localhost' || 
               hostname === '127.0.0.1' || 
               hostname.startsWith('192.168.') ||
               hostname.startsWith('10.') ||
               hostname.startsWith('172.') ||
               protocol === 'file:'; // También desactivar en file://
    }

    init() {
        // Si estamos en localhost, no hacer nada
        if (this.esLocalhost) return;
        
        // Múltiples métodos de detección
        this.detectarDevToolsMultiples();
        this.bloquearAtajosCompletos();
        this.detectarInspeccionAvanzada();
        this.monitoreoContinuo();
        
        // Mensaje de advertencia
        this.mostrarAdvertenciaInicial();
    }

    // Detección múltiple de DevTools
    detectarDevToolsMultiples() {
        // Método 1: Diferencia de tamaño de ventana
        const deteccion1 = () => {
            const threshold = 160;
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            
            if (widthDiff > threshold || heightDiff > threshold) {
                this.manejarDevToolsDetectado('Método 1: Diferencia de ventana');
            }
        };

        // Método 2: Console.log con timing
        let start = performance.now();
        console.log('%c', '');
        console.clear();
        let end = performance.now();
        
        if (end - start > 100) {
            this.manejarDevToolsDetectado('Método 2: Console timing');
        }

        // Método 3: Debugger statement
        try {
            const devtools = {
                open: false,
                orientation: null
            };
            setInterval(() => {
                if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
                    if (!devtools.open) {
                        devtools.open = true;
                        this.manejarDevToolsDetectado('Método 3: Debugger statement');
                    }
                } else {
                    devtools.open = false;
                }
            }, 500);
        } catch (e) {}

        // Ejecutar detecciones
        setInterval(deteccion1, 500);
        window.addEventListener('resize', deteccion1);
    }

    // Bloqueo completo de atajos
    bloquearAtajosCompletos() {
        // No bloquear en localhost
        if (this.esLocalhost) return;
        
        document.addEventListener('keydown', (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                e.stopPropagation();
                this.intentoAcceso('F12');
                return false;
            }

            // Ctrl+Shift+I (DevTools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                e.stopPropagation();
                this.intentoAcceso('Ctrl+Shift+I');
                return false;
            }

            // Ctrl+Shift+J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                e.stopPropagation();
                this.intentoAcceso('Ctrl+Shift+J');
                return false;
            }

            // Ctrl+Shift+C (Element Inspector)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                e.stopPropagation();
                this.intentoAcceso('Ctrl+Shift+C');
                return false;
            }

            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'U') {
                e.preventDefault();
                e.stopPropagation();
                this.intentoAcceso('Ctrl+U');
                return false;
            }

            // Ctrl+Shift+K (Console en Firefox)
            if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                e.preventDefault();
                e.stopPropagation();
                this.intentoAcceso('Ctrl+Shift+K');
                return false;
            }

            // Ctrl+Shift+E (Network en Firefox)
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                e.stopPropagation();
                this.intentoAcceso('Ctrl+Shift+E');
                return false;
            }
        });

        // Bloquear clic derecho en elementos específicos
        document.addEventListener('contextmenu', (e) => {
            // Permitir solo en elementos específicos
            const allowedElements = ['img', 'a', 'button'];
            const target = e.target;
            
            if (!allowedElements.includes(target.tagName.toLowerCase()) && 
                !target.closest('.allow-context-menu')) {
                
                // Mostrar menú contextual personalizado
                e.preventDefault();
                this.mostrarMenuContextualPersonalizado(e);
                return false;
            }
        });
    }

    // Menu contextual personalizado
    mostrarMenuContextualPersonalizado(e) {
        // Crear menú personalizado
        const menu = document.createElement('div');
        menu.className = 'menu-contextual-cresalia';
        menu.innerHTML = `
            <div class="menu-item" onclick="window.open(window.location.href, '_blank')">
                <i class="fas fa-external-link-alt"></i> Ver en nueva ventana
            </div>
            <div class="menu-item" onclick="window.open(window.location.href, '_blank')">
                <i class="fas fa-plus"></i> Ver en nueva pestaña
            </div>
            <div class="menu-item" onclick="location.reload()">
                <i class="fas fa-sync-alt"></i> Recargar
            </div>
        `;

        // Estilos del menú
        menu.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            background: linear-gradient(135deg, #7C3AED, #EC4899);
            color: white;
            border-radius: 10px;
            padding: 10px 0;
            box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3);
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            min-width: 200px;
        `;

        // Estilos de los items
        const style = document.createElement('style');
        style.textContent = `
            .menu-contextual-cresalia .menu-item {
                padding: 12px 20px;
                cursor: pointer;
                transition: background 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .menu-contextual-cresalia .menu-item:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .menu-contextual-cresalia .menu-item i {
                width: 16px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(menu);

        // Remover menú al hacer clic fuera
        setTimeout(() => {
            document.addEventListener('click', () => {
                menu.remove();
                style.remove();
            }, { once: true });
        }, 100);
    }

    // Detección avanzada de inspección
    detectarInspeccionAvanzada() {
        // Detectar selección de elementos
        document.addEventListener('selectstart', (e) => {
            if (e.target.tagName === 'BODY' || e.target.closest('body')) {
                e.preventDefault();
                return false;
            }
        });

        // Detectar intentos de inspección por consola
        let devtools = false;
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
                if (!devtools) {
                    devtools = true;
                    this.manejarDevToolsDetectado('Detección avanzada');
                }
            } else {
                devtools = false;
            }
        }, 1000);
    }

    // Monitoreo continuo
    monitoreoContinuo() {
        // Verificar cada segundo
        setInterval(() => {
            // Método de detección por función
            const start = Date.now();
            debugger;
            const end = Date.now();
            
            if (end - start > 100) {
                this.manejarDevToolsDetectado('Monitoreo continuo');
            }
        }, 1000);
    }

    // Manejar intento de acceso
    intentoAcceso(method) {
        this.attempts++;
        
        if (this.attempts >= this.maxAttempts) {
            this.bloquearPagina();
        } else {
            this.mostrarAdvertencia(`Acceso denegado (${this.attempts}/${this.maxAttempts})`);
        }
    }

    // Manejar DevTools detectado
    manejarDevToolsDetectado(method) {
        if (this.blocked) return;
        
        this.attempts++;
        
        if (this.attempts >= this.maxAttempts) {
            this.bloquearPagina();
        } else {
            this.mostrarAdvertencia(`Herramientas de desarrollador detectadas (${this.attempts}/${this.maxAttempts})`);
        }
    }

    // Bloquear página completamente
    bloquearPagina() {
        // NO bloquear en panel de comunidad de vendedores
        if (window.location.pathname.includes('panel-comunidad-vendedores') ||
            window.location.href.includes('panel-comunidad-vendedores')) {
            console.log('🛡️ Protección DevTools: Panel de comunidad excluido del bloqueo');
            return; // No bloquear este panel
        }
        
        this.blocked = true;
        
        // Crear overlay de bloqueo
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1F2937, #374151);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            font-family: 'Poppins', sans-serif;
        `;

        overlay.innerHTML = `
            <div style="text-align: center; max-width: 600px; padding: 40px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                <h1 style="font-size: 2.5rem; margin-bottom: 20px; color: #EC4899;">Acceso Denegado</h1>
                <p style="font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9;">
                    Esta página está protegida contra herramientas de desarrollador.
                </p>
                <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid #EF4444; border-radius: 15px; padding: 20px; margin-bottom: 30px;">
                    <p style="margin: 0; color: #FCA5A5;">
                        <strong>Razón:</strong> Se detectaron múltiples intentos de acceso a herramientas de desarrollador.
                    </p>
                </div>
                <button onclick="location.reload()" style="
                    background: linear-gradient(135deg, #7C3AED, #EC4899);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    Recargar Página
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Bloquear todas las interacciones
        document.body.style.pointerEvents = 'none';
        overlay.style.pointerEvents = 'auto';

        // Log del bloqueo
        if (typeof logSecurityEvent === 'function') {
            logSecurityEvent('PAGE_BLOCKED_DEVELOPER_TOOLS', 'Página bloqueada por intentos de acceso a DevTools');
        }
    }

    // Mostrar advertencia
    mostrarAdvertencia(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #EF4444, #DC2626);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
            z-index: 10000;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2rem;">⚠️</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Mostrar advertencia inicial (SILENCIOSO - Solo para administradores)
    mostrarAdvertenciaInicial() {
        // Solo mostrar en páginas de administración
        if (window.location.pathname.includes('admin') || 
            window.location.pathname.includes('panel') ||
            window.location.pathname.includes('master')) {
            setTimeout(() => {
                this.mostrarAdvertencia('Página protegida - Herramientas de desarrollador bloqueadas');
            }, 1000);
        }
    }
}

// Auto-inicializar
if (typeof window !== 'undefined') {
    window.ProteccionDevToolsAvanzada = ProteccionDevToolsAvanzada;
}























