// ===== PROTECCIÓN DE DATOS SENSIBLES - CRESALIA =====
// Sistema completo de protección contra robo de identidad y tarjetas

class ProteccionDatosSensibles {
    constructor() {
        this.sensitiveFields = ['tarjeta', 'card', 'cvv', 'cvc', 'expira', 'expiry', 'fecha', 'cedula', 'dni', 'passport', 'ssn', 'password', 'contraseña'];
        this.maskedElements = [];
        this.init();
    }

    init() {
        // NO inicializar protección en panel de comunidad de vendedores
        if (window.location.pathname.includes('panel-comunidad-vendedores') ||
            window.location.href.includes('panel-comunidad-vendedores')) {
            console.log('🛡️ Protección datos sensibles: DESHABILITADA para panel de comunidad');
            return; // No interferir con este panel
        }
        
        this.enmascararDatosSensibles();
        this.protegerCamposFormulario();
        this.prevenirCapturaPantalla();
        this.protegerClipboard();
        this.validarEntradaSegura();
        this.monitorearIntentoRobo();
        this.ocultarDatosConsola();
    }

    // Enmascarar datos sensibles visibles
    enmascararDatosSensibles() {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('*').forEach(element => {
                const text = element.textContent || '';
                const lowerText = text.toLowerCase();
                
                // Detectar números de tarjeta (16 dígitos)
                const cardPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
                if (cardPattern.test(text) && !element.closest('.allow-display')) {
                    element.textContent = text.replace(cardPattern, (match) => {
                        return '**** **** **** ' + match.slice(-4);
                    });
                }
                
                // Detectar CVV/CVC
                const cvvPattern = /\b(CVV|CVC)[\s:]*\d{3,4}\b/gi;
                if (cvvPattern.test(text) && !element.closest('.allow-display')) {
                    element.textContent = text.replace(cvvPattern, (match) => {
                        return match.replace(/\d{3,4}/, '***');
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // Proteger campos de formulario
    protegerCamposFormulario() {
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('input, textarea').forEach(field => {
                const fieldName = (field.name || field.id || field.placeholder || '').toLowerCase();
                
                // Detectar campos sensibles
                if (this.sensitiveFields.some(sensitive => fieldName.includes(sensitive))) {
                    // Campo de tarjeta de crédito
                    if (fieldName.includes('tarjeta') || fieldName.includes('card')) {
                        this.configurarCampoTarjeta(field);
                    }
                    
                    // Campo CVV/CVC
                    if (fieldName.includes('cvv') || fieldName.includes('cvc')) {
                        this.configurarCampoCVV(field);
                    }
                    
                    // Campo de contraseña
                    if (field.type === 'password' || fieldName.includes('password') || fieldName.includes('contraseña')) {
                        this.configurarCampoPassword(field);
                    }
                    
                    // Prevenir autocompletado malicioso
                    field.setAttribute('autocomplete', 'off');
                    field.setAttribute('autocorrect', 'off');
                    field.setAttribute('autocapitalize', 'off');
                    field.setAttribute('spellcheck', 'false');
                }
            });
        });
    }

    // Configurar campo de tarjeta
    configurarCampoTarjeta(field) {
        // Máximo 16 dígitos
        field.maxLength = 19; // 16 dígitos + 3 espacios
        field.setAttribute('inputmode', 'numeric');
        field.setAttribute('pattern', '[0-9\s]{13,19}');
        
        field.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            
            // Formatear con espacios cada 4 dígitos
            let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formatted;
            
            // Validar tarjeta en tiempo real
            this.validarTarjeta(value);
        });
        
        field.addEventListener('blur', () => {
            if (field.value) {
                const digits = field.value.replace(/\D/g, '');
                if (digits.length >= 13 && digits.length <= 19) {
                    field.value = '**** **** **** ' + digits.slice(-4);
                }
            }
        });
        
        field.addEventListener('focus', () => {
            const digits = field.value.replace(/\D/g, '');
            if (digits.length > 0) {
                let formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
                field.value = formatted;
            }
        });
    }

    // Configurar campo CVV
    configurarCampoCVV(field) {
        field.maxLength = 4;
        field.setAttribute('inputmode', 'numeric');
        field.setAttribute('pattern', '[0-9]{3,4}');
        
        field.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
        
        field.addEventListener('blur', () => {
            if (field.value) {
                field.value = '***';
                setTimeout(() => {
                    if (document.activeElement !== field) {
                        field.type = 'password';
                    }
                }, 100);
            }
        });
    }

    // Configurar campo de contraseña
    configurarCampoPassword(field) {
        field.setAttribute('autocomplete', 'new-password');
        
        // Prevenir keylogging visual
        field.addEventListener('focus', () => {
            field.setAttribute('data-focused', 'true');
        });
        
        field.addEventListener('blur', () => {
            field.removeAttribute('data-focused');
        });
    }

    // Validar tarjeta con algoritmo de Luhn
    validarTarjeta(cardNumber) {
        if (!cardNumber || cardNumber.length < 13) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    // Prevenir captura de pantalla
    prevenirCapturaPantalla() {
        // Bloquear print screen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                this.mostrarAdvertencia('Captura de pantalla bloqueada por seguridad');
                return false;
            }
        });
        
        // Detectar intentos de screenshot - EXCLUIR PANEL DE COMUNIDAD
        document.addEventListener('visibilitychange', () => {
            // NO bloquear en panel de comunidad de vendedores
            if (window.location.pathname.includes('panel-comunidad-vendedores') ||
                window.location.href.includes('panel-comunidad-vendedores')) {
                return; // No registrar ni bloquear en este panel
            }
            
            if (document.hidden) {
                // Página oculta - posible screenshot (solo en otras páginas)
                this.logSeguridad('POSSIBLE_SCREENSHOT_ATTEMPT', 'Página oculta detectada');
            }
        });
        
        // Ocultar contenido al hacer right-click en campos sensibles
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.sensitive-data, input[type="password"], input[name*="card"], input[name*="cvv"]')) {
                e.preventDefault();
                this.mostrarAdvertencia('Menú contextual bloqueado en campos sensibles');
                return false;
            }
        });
    }

    // Proteger clipboard
    protegerClipboard() {
        document.addEventListener('copy', (e) => {
            const selection = window.getSelection().toString();
            
            // Detectar datos sensibles en clipboard
            const sensitivePatterns = [
                /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Tarjeta
                /\b\d{3,4}\b/, // CVV
                /\b\d{9,}\b/ // Números largos (posible tarjeta sin formato)
            ];
            
            if (sensitivePatterns.some(pattern => pattern.test(selection))) {
                e.preventDefault();
                this.mostrarAdvertencia('No se permite copiar datos sensibles');
                return false;
            }
        });
        
        document.addEventListener('cut', (e) => {
            const selection = window.getSelection().toString();
            
            if (this.sensitiveFields.some(field => selection.toLowerCase().includes(field))) {
                e.preventDefault();
                this.mostrarAdvertencia('No se permite cortar datos sensibles');
                return false;
            }
        });
    }

    // Validar entrada segura
    validarEntradaSegura() {
        document.addEventListener('input', (e) => {
            const field = e.target;
            const value = field.value || '';
            
            // Detectar scripts maliciosos
            if (/<script|javascript:|onerror=|onload=/i.test(value)) {
                field.value = value.replace(/<script|javascript:|onerror=|onload=/gi, '');
                this.mostrarAdvertencia('Código malicioso detectado y removido');
            }
            
            // Sanitizar HTML
            if (field.tagName === 'TEXTAREA' || field.tagName === 'INPUT') {
                const sanitized = this.sanitizarHTML(value);
                if (sanitized !== value) {
                    field.value = sanitized;
                }
            }
        });
    }

    // Sanitizar HTML
    sanitizarHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Monitorear intentos de robo
    monitorearIntentoRobo() {
        // Detectar herramientas de desarrollador abiertas durante ingreso de datos sensibles
        let devToolsOpen = false;
        setInterval(() => {
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            
            if (widthDiff > 160 || heightDiff > 160) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    
                    // Verificar si hay campos sensibles activos
                    const activeField = document.activeElement;
                    if (activeField && this.sensitiveFields.some(field => 
                        (activeField.name || activeField.id || '').toLowerCase().includes(field)
                    )) {
                        this.logSeguridad('SECURITY_ALERT', 'DevTools abierto durante ingreso de datos sensibles');
                        this.mostrarAdvertencia('Por seguridad, cierra las herramientas de desarrollador');
                    }
                }
            } else {
                devToolsOpen = false;
            }
        }, 1000);
    }

    // Ocultar datos en consola
    ocultarDatosConsola() {
        // NO sobrescribir console.log en panel de comunidad de vendedores
        if (window.location.pathname.includes('panel-comunidad-vendedores') ||
            window.location.href.includes('panel-comunidad-vendedores')) {
            console.log('🛡️ Protección datos sensibles: Console.log NO sobrescrito en panel de comunidad');
            return; // No interferir con este panel
        }
        
        // Sobrescribir console.log para filtrar datos sensibles
        const originalLog = console.log;
        console.log = function(...args) {
            const filtered = args.map(arg => {
                if (typeof arg === 'string') {
                    // Ocultar números de tarjeta
                    arg = arg.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '**** **** **** ****');
                    // Ocultar CVV
                    arg = arg.replace(/\b(CVV|CVC)[\s:]*\d{3,4}\b/gi, '$1: ***');
                }
                return arg;
            });
            originalLog.apply(console, filtered);
        };
    }

    // Log de seguridad
    logSeguridad(evento, descripcion) {
        if (typeof logSecurityEvent === 'function') {
            logSecurityEvent(evento, descripcion);
        }
        
        // Enviar a servidor si existe (solo en servidor real)
        if (typeof fetch !== 'undefined' && window.location.protocol !== 'file:') {
            try {
                fetch('/api/security/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        evento,
                        descripcion,
                        timestamp: new Date().toISOString(),
                        url: window.location.href,
                        userAgent: navigator.userAgent
                    })
                }).catch(() => {}); // Ignorar errores silenciosamente
            } catch (e) {}
        }
    }

    // Mostrar advertencia
    mostrarAdvertencia(mensaje) {
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
            z-index: 99999;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2rem;">🔒</span>
                <span>${mensaje}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Auto-inicializar
if (typeof window !== 'undefined') {
    window.ProteccionDatosSensibles = ProteccionDatosSensibles;
    document.addEventListener('DOMContentLoaded', () => {
        new ProteccionDatosSensibles();
    });
}

