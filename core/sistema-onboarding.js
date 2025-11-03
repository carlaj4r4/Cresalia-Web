// ===== SISTEMA DE ONBOARDING Y GUÍAS - CRESALIA =====
// Guías interactivas para clientes que recién empiezan

class SistemaOnboarding {
    constructor(tenantSlug, userRole) {
        this.tenantSlug = tenantSlug;
        this.userRole = userRole; // 'admin_tenant' o 'cliente'
        this.currentStep = 0;
        this.tourActive = false;
        this.init();
    }

    init() {
        // Verificar si es primera vez
        const hasSeenTour = localStorage.getItem(`${this.tenantSlug}_tour_completed`);
        
        if (!hasSeenTour && this.userRole === 'admin_tenant') {
            // Mostrar bienvenida después de 2 segundos
            setTimeout(() => this.mostrarBienvenida(), 2000);
        }

        // Agregar botón de ayuda flotante
        this.agregarBotonAyuda();
    }

    // Bienvenida inicial
    mostrarBienvenida() {
        const modal = document.createElement('div');
        modal.className = 'onboarding-bienvenida';
        modal.innerHTML = `
            <div class="onboarding-modal">
                <div class="onboarding-header">
                    <h1>💜 ¡Bienvenido/a a Tu Tienda!</h1>
                    <p>Vamos a configurar todo juntos, paso a paso</p>
                </div>

                <div class="onboarding-content">
                    <div class="onboarding-icon">
                        <i class="fas fa-rocket"></i>
                    </div>

                    <h2>¿Es tu primera vez?</h2>
                    <p>No te preocupes, te vamos a guiar en cada paso.</p>

                    <div class="onboarding-features">
                        <div class="feature-item">
                            <i class="fas fa-box"></i>
                            <span>Agregar productos</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-palette"></i>
                            <span>Personalizar colores</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-credit-card"></i>
                            <span>Configurar pagos</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-truck"></i>
                            <span>Métodos de envío</span>
                        </div>
                    </div>

                    <p class="onboarding-time">
                        ⏱️ Tiempo estimado: 15-20 minutos
                    </p>
                </div>

                <div class="onboarding-actions">
                    <button class="btn-omitir" onclick="window.onboardingManager.omitirTour()">
                        Explorar por mi cuenta
                    </button>
                    <button class="btn-empezar" onclick="window.onboardingManager.empezarTour()">
                        ✨ Empezar guía
                    </button>
                </div>
            </div>
            ${this.getStyles()}
        `;

        document.body.appendChild(modal);
    }

    // Empezar tour guiado
    empezarTour() {
        document.querySelector('.onboarding-bienvenida')?.remove();
        this.tourActive = true;
        this.currentStep = 0;
        this.mostrarPaso(0);
    }

    // Omitir tour
    omitirTour() {
        document.querySelector('.onboarding-bienvenida')?.remove();
        this.mostrarTooltip('Podés ver la guía en cualquier momento haciendo clic en el botón de ayuda 💜', 5000);
    }

    // Pasos del tour
    getSteps() {
        return [
            {
                target: '#btn-agregar-producto',
                title: '1️⃣ Agregá tu primer producto',
                content: 'Empecemos agregando un producto a tu tienda. Hacé clic acá.',
                position: 'bottom',
                highlightPadding: 10
            },
            {
                target: '#menu-configuracion',
                title: '2️⃣ Personalizá tu tienda',
                content: 'Acá podés cambiar colores, logo y toda la apariencia de tu tienda.',
                position: 'right',
                highlightPadding: 10
            },
            {
                target: '#menu-pagos',
                title: '3️⃣ Configurá métodos de pago',
                content: 'Muy importante: configurá cómo querés cobrar (MercadoPago, transferencia, etc.)',
                position: 'right',
                highlightPadding: 10
            },
            {
                target: '#menu-envios',
                title: '4️⃣ Métodos de envío',
                content: '¿Cómo vas a enviar tus productos? Configuralo acá.',
                position: 'right',
                highlightPadding: 10
            },
            {
                target: '#vista-previa',
                title: '5️⃣ Vista previa de tu tienda',
                content: 'En cualquier momento podés ver cómo se ve tu tienda para los clientes.',
                position: 'left',
                highlightPadding: 10
            },
            {
                target: '.btn-ayuda-flotante',
                title: '🎉 ¡Listo!',
                content: 'Si necesitás ayuda en cualquier momento, hacé clic acá. ¡Éxitos! 💜',
                position: 'left',
                highlightPadding: 10
            }
        ];
    }

    // Mostrar paso específico
    mostrarPaso(stepIndex) {
        const steps = this.getSteps();
        if (stepIndex >= steps.length) {
            this.completarTour();
            return;
        }

        const step = steps[stepIndex];
        const targetElement = document.querySelector(step.target);

        if (!targetElement) {
            // Si el elemento no existe, pasar al siguiente
            this.mostrarPaso(stepIndex + 1);
            return;
        }

        // Crear overlay
        this.crearOverlay(targetElement, step);

        // Crear tooltip
        this.crearTooltipGuiado(targetElement, step, stepIndex);
    }

    // Crear overlay (oscurece todo excepto el elemento)
    crearOverlay(targetElement, step) {
        // Remover overlay anterior
        document.querySelector('.onboarding-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.className = 'onboarding-overlay';

        // Obtener posición del elemento
        const rect = targetElement.getBoundingClientRect();
        const padding = step.highlightPadding || 10;

        overlay.style.cssText = `
            --highlight-top: ${rect.top - padding}px;
            --highlight-left: ${rect.left - padding}px;
            --highlight-width: ${rect.width + padding * 2}px;
            --highlight-height: ${rect.height + padding * 2}px;
        `;

        document.body.appendChild(overlay);
    }

    // Crear tooltip guiado
    crearTooltipGuiado(targetElement, step, stepIndex) {
        // Remover tooltip anterior
        document.querySelector('.onboarding-tooltip')?.remove();

        const tooltip = document.createElement('div');
        tooltip.className = 'onboarding-tooltip';

        const steps = this.getSteps();
        const isLastStep = stepIndex === steps.length - 1;

        tooltip.innerHTML = `
            <div class="tooltip-header">
                <h3>${step.title}</h3>
                <button class="btn-cerrar-tour" onclick="window.onboardingManager.cerrarTour()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="tooltip-content">
                <p>${step.content}</p>
            </div>
            <div class="tooltip-footer">
                <div class="tooltip-progress">
                    ${stepIndex + 1} de ${steps.length}
                </div>
                <div class="tooltip-actions">
                    ${stepIndex > 0 ? `
                        <button class="btn-anterior" onclick="window.onboardingManager.pasoAnterior()">
                            Anterior
                        </button>
                    ` : ''}
                    <button class="btn-siguiente" onclick="window.onboardingManager.pasoSiguiente()">
                        ${isLastStep ? '¡Entendido! 💜' : 'Siguiente'}
                    </button>
                </div>
            </div>
        `;

        // Posicionar tooltip
        document.body.appendChild(tooltip);
        this.posicionarTooltip(tooltip, targetElement, step.position);
    }

    // Posicionar tooltip relativo al elemento
    posicionarTooltip(tooltip, targetElement, position) {
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top, left;

        switch(position) {
            case 'bottom':
                top = rect.bottom + 20;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'top':
                top = rect.top - tooltipRect.height - 20;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.left - tooltipRect.width - 20;
                break;
            case 'right':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.right + 20;
                break;
            default:
                top = rect.bottom + 20;
                left = rect.left;
        }

        // Ajustar si se sale de la pantalla
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) top = 10;

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }

    // Navegación del tour
    pasoSiguiente() {
        this.currentStep++;
        this.mostrarPaso(this.currentStep);
    }

    pasoAnterior() {
        this.currentStep--;
        this.mostrarPaso(this.currentStep);
    }

    cerrarTour() {
        document.querySelector('.onboarding-overlay')?.remove();
        document.querySelector('.onboarding-tooltip')?.remove();
        this.tourActive = false;
        this.mostrarTooltip('Podés retomar la guía cuando quieras 💜', 3000);
    }

    completarTour() {
        document.querySelector('.onboarding-overlay')?.remove();
        document.querySelector('.onboarding-tooltip')?.remove();
        this.tourActive = false;

        // Marcar como completado
        localStorage.setItem(`${this.tenantSlug}_tour_completed`, 'true');

        // Celebración
        this.mostrarCelebracion();
    }

    // Celebración al completar
    mostrarCelebracion() {
        const celebracion = document.createElement('div');
        celebracion.className = 'onboarding-celebracion';
        celebracion.innerHTML = `
            <div class="celebracion-content">
                <div class="celebracion-emoji">🎉</div>
                <h2>¡Felicitaciones!</h2>
                <p>Ya conocés lo básico de tu tienda</p>
                <p class="celebracion-mensaje">
                    Ahora a vender mucho 💜
                </p>
                <button class="btn-empezar-vender" onclick="this.parentElement.parentElement.remove()">
                    ¡A vender!
                </button>
            </div>
        `;

        document.body.appendChild(celebracion);

        // Auto-remover después de 5 segundos
        setTimeout(() => celebracion.remove(), 5000);
    }

    // Botón de ayuda flotante
    agregarBotonAyuda() {
        const existente = document.querySelector('.btn-ayuda-flotante');
        if (existente) return;

        const btn = document.createElement('button');
        btn.className = 'btn-ayuda-flotante';
        btn.innerHTML = `
            <i class="fas fa-question-circle"></i>
            <span>Ayuda</span>
        `;

        btn.addEventListener('click', () => this.mostrarMenuAyuda());

        document.body.appendChild(btn);
    }

    // Menú de ayuda
    mostrarMenuAyuda() {
        const menu = document.createElement('div');
        menu.className = 'menu-ayuda';
        menu.innerHTML = `
            <div class="menu-ayuda-content">
                <h3>💜 ¿En qué te ayudo?</h3>

                <button class="menu-ayuda-item" onclick="window.onboardingManager.reiniciarTour()">
                    <i class="fas fa-route"></i>
                    Ver guía completa de nuevo
                </button>

                <button class="menu-ayuda-item" onclick="window.onboardingManager.mostrarTips()">
                    <i class="fas fa-lightbulb"></i>
                    Tips rápidos
                </button>

                <button class="menu-ayuda-item" onclick="window.onboardingManager.mostrarVideos()">
                    <i class="fas fa-video"></i>
                    Videos tutoriales
                </button>

                <button class="menu-ayuda-item" onclick="window.onboardingManager.mostrarFAQ()">
                    <i class="fas fa-question"></i>
                    Preguntas frecuentes
                </button>

                <button class="menu-ayuda-item" onclick="window.onboardingManager.contactarSoporte()">
                    <i class="fas fa-headset"></i>
                    Contactar soporte 💜
                </button>

                <button class="menu-ayuda-cerrar" onclick="this.parentElement.parentElement.remove()">
                    Cerrar
                </button>
            </div>
        `;

        // Cerrar al hacer clic fuera
        menu.addEventListener('click', (e) => {
            if (e.target === menu) menu.remove();
        });

        document.body.appendChild(menu);
    }

    // Reiniciar tour
    reiniciarTour() {
        document.querySelector('.menu-ayuda')?.remove();
        localStorage.removeItem(`${this.tenantSlug}_tour_completed`);
        this.empezarTour();
    }

    // Tips rápidos
    mostrarTips() {
        document.querySelector('.menu-ayuda')?.remove();
        
        const tips = document.createElement('div');
        tips.className = 'tips-rapidos';
        tips.innerHTML = `
            <div class="tips-content">
                <h2>💡 Tips Rápidos</h2>

                <div class="tip-item">
                    <div class="tip-icon">📸</div>
                    <div class="tip-text">
                        <h4>Fotos de calidad</h4>
                        <p>Usá fotos claras y con buena luz. Los productos con buenas fotos venden 3x más.</p>
                    </div>
                </div>

                <div class="tip-item">
                    <div class="tip-icon">💰</div>
                    <div class="tip-text">
                        <h4>Precios competitivos</h4>
                        <p>Investigá cuánto cobran otros. No seas el más caro ni el más barato.</p>
                    </div>
                </div>

                <div class="tip-item">
                    <div class="tip-icon">📝</div>
                    <div class="tip-text">
                        <h4>Descripciones completas</h4>
                        <p>Contá todo: medidas, materiales, colores disponibles. Más info = más ventas.</p>
                    </div>
                </div>

                <div class="tip-item">
                    <div class="tip-icon">🚀</div>
                    <div class="tip-text">
                        <h4>Promocioná en redes</h4>
                        <p>Compartí tu tienda en Facebook, Instagram, WhatsApp. El marketing es clave.</p>
                    </div>
                </div>

                <div class="tip-item">
                    <div class="tip-icon">💜</div>
                    <div class="tip-text">
                        <h4>Respondé rápido</h4>
                        <p>Los clientes valoran la atención. Respondé sus preguntas en menos de 24hs.</p>
                    </div>
                </div>

                <button class="btn-cerrar-tips" onclick="this.parentElement.parentElement.remove()">
                    Entendido
                </button>
            </div>
        `;

        document.body.appendChild(tips);
    }

    // Videos tutoriales
    mostrarVideos() {
        document.querySelector('.menu-ayuda')?.remove();
        
        const videos = document.createElement('div');
        videos.className = 'videos-tutoriales';
        videos.innerHTML = `
            <div class="videos-content">
                <h2>🎥 Videos Tutoriales</h2>

                <div class="video-item">
                    <div class="video-thumbnail">
                        <i class="fas fa-play-circle"></i>
                        <span>5:20</span>
                    </div>
                    <div class="video-info">
                        <h4>Cómo agregar tu primer producto</h4>
                        <p>Paso a paso para subir productos con fotos y descripciones.</p>
                    </div>
                </div>

                <div class="video-item">
                    <div class="video-thumbnail">
                        <i class="fas fa-play-circle"></i>
                        <span>3:45</span>
                    </div>
                    <div class="video-info">
                        <h4>Personalizar colores de tu tienda</h4>
                        <p>Hacé que tu tienda refleje tu marca.</p>
                    </div>
                </div>

                <div class="video-item">
                    <div class="video-thumbnail">
                        <i class="fas fa-play-circle"></i>
                        <span>7:10</span>
                    </div>
                    <div class="video-info">
                        <h4>Configurar MercadoPago</h4>
                        <p>Conectá tu cuenta para empezar a cobrar.</p>
                    </div>
                </div>

                <p class="videos-nota">
                    💜 Más videos próximamente
                </p>

                <button class="btn-cerrar-videos" onclick="this.parentElement.parentElement.remove()">
                    Cerrar
                </button>
            </div>
        `;

        document.body.appendChild(videos);
    }

    // FAQ
    mostrarFAQ() {
        document.querySelector('.menu-ayuda')?.remove();
        window.location.href = '/faq'; // Redirigir a página de FAQ
    }

    // Contactar soporte
    contactarSoporte() {
        document.querySelector('.menu-ayuda')?.remove();
        // Abrir widget de soporte o chat
        if (window.supportWidget) {
            window.supportWidget.open();
        } else {
            window.location.href = '/soporte';
        }
    }

    // Tooltip simple
    mostrarTooltip(mensaje, duracion = 3000) {
        const tooltip = document.createElement('div');
        tooltip.className = 'simple-tooltip';
        tooltip.textContent = mensaje;
        document.body.appendChild(tooltip);

        setTimeout(() => tooltip.classList.add('show'), 10);
        setTimeout(() => {
            tooltip.classList.remove('show');
            setTimeout(() => tooltip.remove(), 300);
        }, duracion);
    }

    // Estilos
    getStyles() {
        return `
        <style>
            /* Bienvenida */
            .onboarding-bienvenida {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .onboarding-modal {
                background: white;
                border-radius: 24px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.4s ease;
            }

            .onboarding-header {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                padding: 40px 32px;
                text-align: center;
                border-radius: 24px 24px 0 0;
            }

            .onboarding-header h1 {
                font-size: 32px;
                margin: 0 0 12px 0;
            }

            .onboarding-header p {
                opacity: 0.95;
                font-size: 16px;
                margin: 0;
            }

            .onboarding-content {
                padding: 40px 32px;
                text-align: center;
            }

            .onboarding-icon {
                font-size: 80px;
                margin-bottom: 24px;
                animation: bounce 2s infinite;
            }

            .onboarding-content h2 {
                font-size: 24px;
                color: #1F2937;
                margin-bottom: 12px;
            }

            .onboarding-features {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                margin: 32px 0;
            }

            .feature-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 20px;
                background: #F9FAFB;
                border-radius: 12px;
                transition: all 0.2s;
            }

            .feature-item:hover {
                background: #F3F4F6;
                transform: translateY(-2px);
            }

            .feature-item i {
                font-size: 32px;
                color: #7C3AED;
            }

            .onboarding-time {
                color: #6B7280;
                font-size: 14px;
                margin-top: 24px;
            }

            .onboarding-actions {
                display: flex;
                gap: 12px;
                padding: 24px 32px;
                border-top: 2px solid #F3F4F6;
            }

            .btn-omitir, .btn-empezar {
                flex: 1;
                padding: 16px 24px;
                border-radius: 12px;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
            }

            .btn-omitir {
                background: #F3F4F6;
                color: #6B7280;
            }

            .btn-empezar {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            }

            .btn-empezar:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
            }

            /* Overlay del tour */
            .onboarding-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 9998;
                pointer-events: none;
                box-shadow: 
                    0 0 0 9999px rgba(0, 0, 0, 0.75),
                    inset 0 0 0 var(--highlight-height) transparent;
                clip-path: polygon(
                    0 0,
                    100% 0,
                    100% var(--highlight-top),
                    var(--highlight-left) var(--highlight-top),
                    var(--highlight-left) calc(var(--highlight-top) + var(--highlight-height)),
                    calc(var(--highlight-left) + var(--highlight-width)) calc(var(--highlight-top) + var(--highlight-height)),
                    calc(var(--highlight-left) + var(--highlight-width)) var(--highlight-top),
                    100% var(--highlight-top),
                    100% 100%,
                    0 100%
                );
            }

            /* Tooltip del tour */
            .onboarding-tooltip {
                position: fixed;
                background: white;
                border-radius: 16px;
                padding: 0;
                max-width: 400px;
                box-shadow: 0 12px 40px rgba(0,0,0,0.3);
                z-index: 9999;
                animation: tooltipAppear 0.3s ease;
            }

            .tooltip-header {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                padding: 20px;
                border-radius: 16px 16px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .tooltip-header h3 {
                margin: 0;
                font-size: 18px;
            }

            .btn-cerrar-tour {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-cerrar-tour:hover {
                background: rgba(255,255,255,0.3);
            }

            .tooltip-content {
                padding: 20px;
            }

            .tooltip-content p {
                margin: 0;
                color: #374151;
                line-height: 1.6;
            }

            .tooltip-footer {
                padding: 16px 20px;
                border-top: 2px solid #F3F4F6;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .tooltip-progress {
                color: #6B7280;
                font-size: 14px;
                font-weight: 600;
            }

            .tooltip-actions {
                display: flex;
                gap: 8px;
            }

            .btn-anterior, .btn-siguiente {
                padding: 10px 20px;
                border-radius: 8px;
                border: none;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-anterior {
                background: #F3F4F6;
                color: #6B7280;
            }

            .btn-siguiente {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
            }

            .btn-siguiente:hover {
                transform: translateY(-1px);
            }

            /* Botón de ayuda flotante */
            .btn-ayuda-flotante {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 16px 24px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
                z-index: 9997;
                transition: all 0.3s ease;
            }

            .btn-ayuda-flotante:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 32px rgba(124, 58, 237, 0.5);
            }

            .btn-ayuda-flotante i {
                font-size: 20px;
            }

            /* Menú de ayuda */
            .menu-ayuda {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn 0.2s ease;
            }

            .menu-ayuda-content {
                background: white;
                border-radius: 20px;
                padding: 32px;
                max-width: 400px;
                width: 90%;
            }

            .menu-ayuda-content h3 {
                text-align: center;
                margin: 0 0 24px 0;
                font-size: 24px;
            }

            .menu-ayuda-item {
                width: 100%;
                padding: 16px 20px;
                background: #F9FAFB;
                border: none;
                border-radius: 12px;
                margin-bottom: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 15px;
                font-weight: 500;
                color: #374151;
                transition: all 0.2s;
            }

            .menu-ayuda-item:hover {
                background: #F3F4F6;
                transform: translateX(4px);
            }

            .menu-ayuda-item i {
                color: #7C3AED;
                font-size: 20px;
            }

            .menu-ayuda-cerrar {
                width: 100%;
                padding: 14px;
                background: transparent;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                margin-top: 16px;
                cursor: pointer;
                font-weight: 600;
                color: #6B7280;
                transition: all 0.2s;
            }

            .menu-ayuda-cerrar:hover {
                border-color: #7C3AED;
                color: #7C3AED;
            }

            /* Celebración */
            .onboarding-celebracion {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .celebracion-content {
                background: white;
                border-radius: 24px;
                padding: 48px;
                text-align: center;
                max-width: 500px;
            }

            .celebracion-emoji {
                font-size: 100px;
                margin-bottom: 24px;
                animation: bounce 1s infinite;
            }

            .celebracion-content h2 {
                font-size: 32px;
                color: #1F2937;
                margin-bottom: 16px;
            }

            .celebracion-mensaje {
                color: #7C3AED;
                font-size: 18px;
                font-weight: 600;
                margin: 24px 0;
            }

            .btn-empezar-vender {
                padding: 16px 40px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 18px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
                transition: all 0.3s;
            }

            .btn-empezar-vender:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 32px rgba(124, 58, 237, 0.5);
            }

            /* Tips rápidos, Videos, etc */
            .tips-rapidos, .videos-tutoriales {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.2s ease;
            }

            .tips-content, .videos-content {
                background: white;
                border-radius: 24px;
                padding: 40px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }

            .tip-item, .video-item {
                display: flex;
                gap: 16px;
                padding: 20px;
                background: #F9FAFB;
                border-radius: 12px;
                margin-bottom: 16px;
            }

            .tip-icon {
                font-size: 32px;
                flex-shrink: 0;
            }

            .tip-text h4 {
                margin: 0 0 8px 0;
                color: #1F2937;
            }

            .tip-text p {
                margin: 0;
                color: #6B7280;
                line-height: 1.5;
            }

            /* Simple tooltip */
            .simple-tooltip {
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: #1F2937;
                color: white;
                padding: 14px 24px;
                border-radius: 12px;
                font-weight: 500;
                z-index: 10001;
                opacity: 0;
                transition: all 0.3s ease;
            }

            .simple-tooltip.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }

            /* Animations */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes tooltipAppear {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .onboarding-features {
                    grid-template-columns: 1fr;
                }

                .onboarding-actions {
                    flex-direction: column;
                }

                .btn-ayuda-flotante span {
                    display: none;
                }

                .btn-ayuda-flotante {
                    width: 56px;
                    height: 56px;
                    padding: 0;
                    justify-content: center;
                }
            }
        </style>
        `;
    }
}

// Inicializar globalmente
window.initOnboarding = function(tenantSlug, userRole) {
    window.onboardingManager = new SistemaOnboarding(tenantSlug, userRole);
    return window.onboardingManager;
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SistemaOnboarding };
}


