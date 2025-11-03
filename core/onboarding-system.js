// ===== SISTEMA DE ONBOARDING - CRESALIA =====
// Tutorial interactivo para nuevos usuarios

class OnboardingCresalia {
    constructor(tenantConfig) {
        this.tenant = tenantConfig.tenant;
        this.plan = tenantConfig.plan;
        this.currentStep = 0;
        this.completed = this.loadProgress();
        this.steps = this.getSteps();
    }

    // Verificar si debe mostrar onboarding
    shouldShow() {
        const onboardingCompleted = localStorage.getItem(`onboarding_completed_${this.tenant.slug}`);
        return !onboardingCompleted;
    }

    // Inicializar
    init() {
        if (!this.shouldShow()) {
            console.log('✅ Onboarding ya completado');
            return;
        }

        console.log('🎓 Iniciando onboarding...');
        this.showOnboarding();
    }

    // Obtener pasos según plan
    getSteps() {
        const baseSteps = [
            {
                id: 'bienvenida',
                titulo: '¡Bienvenido a Cresalia!',
                descripcion: 'Estás a 5 pasos de tener tu tienda online completa',
                icono: '🎉',
                target: null,
                content: this.getBienvenidaContent()
            },
            {
                id: 'logo',
                titulo: 'Personaliza tu marca',
                descripcion: 'Sube tu logo y elige tus colores',
                icono: '🎨',
                target: '#configuracion-diseño',
                content: this.getLogoContent()
            },
            {
                id: 'producto',
                titulo: 'Agrega tu primer producto',
                descripcion: 'Es más fácil de lo que piensas',
                icono: '📦',
                target: '#seccion-productos',
                content: this.getProductoContent()
            },
            {
                id: 'pago',
                titulo: 'Configura métodos de pago',
                descripcion: 'Para que puedas recibir dinero',
                icono: '💳',
                target: '#configuracion-pagos',
                content: this.getPagoContent()
            }
        ];

        // Agregar paso de chatbot solo para Pro+
        if (['pro', 'enterprise'].includes(this.plan.toLowerCase())) {
            baseSteps.push({
                id: 'chatbot',
                titulo: 'Activa tu Chatbot IA',
                descripcion: 'Tu asistente virtual está incluido 🤖',
                icono: '🤖',
                target: '#configuracion-chatbot',
                content: this.getChatbotContent()
            });
        }

        baseSteps.push({
            id: 'final',
            titulo: '¡Todo listo!',
            descripcion: 'Tu tienda está configurada',
            icono: '🚀',
            target: null,
            content: this.getFinalContent()
        });

        return baseSteps;
    }

    // Mostrar onboarding
    showOnboarding() {
        const overlay = document.createElement('div');
        overlay.id = 'onboarding-overlay';
        overlay.innerHTML = `
            <div class="onboarding-container">
                <!-- Progress bar -->
                <div class="onboarding-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">
                        Paso <span id="current-step">1</span> de <span id="total-steps">${this.steps.length}</span>
                    </div>
                </div>

                <!-- Content -->
                <div class="onboarding-content" id="onboarding-content">
                    <!-- Se llenará dinámicamente -->
                </div>

                <!-- Navigation -->
                <div class="onboarding-nav">
                    <button class="btn-onboarding btn-skip" onclick="onboarding.skip()">
                        Omitir tutorial
                    </button>
                    <div class="nav-buttons">
                        <button class="btn-onboarding btn-back" id="btn-back" onclick="onboarding.prev()" style="display: none;">
                            <i class="fas fa-arrow-left"></i>
                            Anterior
                        </button>
                        <button class="btn-onboarding btn-next" id="btn-next" onclick="onboarding.next()">
                            Siguiente
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            ${this.getStyles()}
        `;

        document.body.appendChild(overlay);
        this.renderStep();
    }

    // Renderizar paso actual
    renderStep() {
        const step = this.steps[this.currentStep];
        const content = document.getElementById('onboarding-content');
        
        content.innerHTML = `
            <div class="step-content animate-fade-in">
                <div class="step-icon">${step.icono}</div>
                <h2 class="step-title">${step.titulo}</h2>
                <p class="step-description">${step.descripcion}</p>
                <div class="step-body">
                    ${step.content}
                </div>
            </div>
        `;

        // Actualizar progress
        const progress = ((this.currentStep + 1) / this.steps.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('current-step').textContent = this.currentStep + 1;

        // Botones
        document.getElementById('btn-back').style.display = this.currentStep > 0 ? 'flex' : 'none';
        document.getElementById('btn-next').innerHTML = 
            this.currentStep === this.steps.length - 1 
                ? '<i class="fas fa-check"></i> Finalizar'
                : 'Siguiente <i class="fas fa-arrow-right"></i>';

        // Highlight elemento si existe
        if (step.target) {
            this.highlightElement(step.target);
        }
    }

    // Siguiente paso
    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.saveProgress();
            this.renderStep();
        } else {
            this.complete();
        }
    }

    // Paso anterior
    prev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderStep();
        }
    }

    // Omitir
    skip() {
        if (confirm('¿Seguro que quieres omitir el tutorial? Siempre puedes verlo después desde Ayuda.')) {
            this.complete();
        }
    }

    // Completar onboarding
    complete() {
        localStorage.setItem(`onboarding_completed_${this.tenant.slug}`, 'true');
        document.getElementById('onboarding-overlay').remove();
        
        // Mostrar mensaje de éxito
        this.showSuccessMessage();
    }

    // Mensaje de éxito
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-toast';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <strong>¡Tutorial completado!</strong>
                <p>Tu tienda está lista para vender 🚀</p>
            </div>
            <style>
                .success-toast {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    background: linear-gradient(135deg, #10B981, #34D399);
                    color: white;
                    padding: 20px 24px;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
                    display: flex;
                    gap: 14px;
                    align-items: center;
                    z-index: 10000;
                    animation: slideInRight 0.4s ease;
                }
                .success-toast i {
                    font-size: 28px;
                }
                .success-toast strong {
                    display: block;
                    font-size: 16px;
                }
                .success-toast p {
                    margin: 4px 0 0 0;
                    opacity: 0.95;
                    font-size: 14px;
                }
            </style>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => message.remove(), 300);
        }, 4000);
    }

    // Contenido de cada paso
    getBienvenidaContent() {
        return `
            <div class="bienvenida-content">
                <div class="bienvenida-emoji">🌟</div>
                <p class="bienvenida-texto">
                    ¡Felicitaciones por dar el primer paso! En solo 5 minutos 
                    tendrás tu tienda online completa y lista para vender.
                </p>
                
                <div class="feature-highlights">
                    <div class="highlight-item">
                        <i class="fas fa-check-circle"></i>
                        <span>Fácil y rápido</span>
                    </div>
                    <div class="highlight-item">
                        <i class="fas fa-check-circle"></i>
                        <span>Sin conocimientos técnicos</span>
                    </div>
                    <div class="highlight-item">
                        <i class="fas fa-check-circle"></i>
                        <span>Asistencia en cada paso</span>
                    </div>
                </div>

                ${this.plan === 'free' || this.plan === 'basic' ? `
                <div class="apoyo-especial">
                    <div class="apoyo-icono">💜</div>
                    <p>
                        <strong>Tu Espacio de Apoyo está activado</strong><br>
                        Como emprendedor, tendrás acceso a nuestro sistema de apoyo 
                        emocional y empresarial. Porque sabemos que empezar puede ser difícil.
                    </p>
                </div>
                ` : ''}
            </div>
        `;
    }

    getLogoContent() {
        return `
            <div class="tutorial-content">
                <p class="tutorial-texto">
                    Tu logo y colores son la cara de tu negocio. Vamos a personalizarlos:
                </p>
                
                <div class="tutorial-steps">
                    <div class="tutorial-step">
                        <span class="step-number">1</span>
                        <span class="step-text">Ve a <strong>Configuración → Diseño</strong></span>
                    </div>
                    <div class="tutorial-step">
                        <span class="step-number">2</span>
                        <span class="step-text">Sube tu logo (PNG, 500x500px mínimo)</span>
                    </div>
                    <div class="tutorial-step">
                        <span class="step-number">3</span>
                        <span class="step-text">Elige tus colores favoritos</span>
                    </div>
                </div>

                <div class="tip-box">
                    <i class="fas fa-lightbulb"></i>
                    <div>
                        <strong>Tip:</strong> Usa colores que representen tu marca. 
                        Pueden ser los mismos de tu logo o complementarios.
                    </div>
                </div>
            </div>
        `;
    }

    getProductoContent() {
        return `
            <div class="tutorial-content">
                <p class="tutorial-texto">
                    Tu primer producto es el más especial. Vamos a agregarlo:
                </p>
                
                <div class="tutorial-steps">
                    <div class="tutorial-step">
                        <span class="step-number">1</span>
                        <span class="step-text">Ve a <strong>Productos → Agregar Nuevo</strong></span>
                    </div>
                    <div class="tutorial-step">
                        <span class="step-number">2</span>
                        <span class="step-text">Sube una foto clara del producto</span>
                    </div>
                    <div class="tutorial-step">
                        <span class="step-number">3</span>
                        <span class="step-text">Escribe nombre, descripción y precio</span>
                    </div>
                    <div class="tutorial-step">
                        <span class="step-number">4</span>
                        <span class="step-text">Define stock disponible</span>
                    </div>
                </div>

                <div class="tip-box">
                    <i class="fas fa-camera"></i>
                    <div>
                        <strong>Tip:</strong> Usa fotos con buena iluminación. 
                        No necesitas cámara profesional, tu celular es suficiente.
                    </div>
                </div>
            </div>
        `;
    }

    getPagoContent() {
        return `
            <div class="tutorial-content">
                <p class="tutorial-texto">
                    Configura cómo recibirás pagos de tus clientes:
                </p>
                
                <div class="payment-options">
                    <div class="payment-option">
                        <i class="fas fa-credit-card"></i>
                        <strong>Pago Online</strong>
                        <p>Mercado Pago, Stripe, PayPal</p>
                    </div>
                    <div class="payment-option">
                        <i class="fas fa-money-bill-wave"></i>
                        <strong>Efectivo</strong>
                        <p>Contra entrega</p>
                    </div>
                </div>

                <div class="tip-box">
                    <i class="fas fa-star"></i>
                    <div>
                        <strong>Recomendación:</strong> Activa ambos métodos. 
                        En LatAm muchos clientes prefieren pagar en efectivo.
                    </div>
                </div>
            </div>
        `;
    }

    getChatbotContent() {
        return `
            <div class="tutorial-content">
                <div class="feature-unlock">
                    <i class="fas fa-crown"></i>
                    <p>¡Has desbloqueado el Chatbot IA!</p>
                </div>

                <p class="tutorial-texto">
                    Como cliente ${this.plan.toUpperCase()}, tienes acceso al Chatbot IA. 
                    Vamos a configurarlo:
                </p>
                
                <div class="tutorial-steps">
                    <div class="tutorial-step">
                        <span class="step-number">1</span>
                        <span class="step-text">Ve a <strong>Configuración → Chatbot IA</strong></span>
                    </div>
                    <div class="tutorial-step">
                        <span class="step-number">2</span>
                        <span class="step-text">Dale un nombre a tu bot (ej: "Ana", "Asistente")</span>
                    </div>
                    <div class="tutorial-step">
                        <span class="step-number">3</span>
                        <span class="step-text">Escribe un mensaje de bienvenida</span>
                    </div>
                    <div class="tutorial-step">
                        <span class="step-number">4</span>
                        <span class="step-text">Agrega información sobre tu negocio</span>
                    </div>
                </div>

                <div class="tip-box" style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3);">
                    <i class="fas fa-robot"></i>
                    <div>
                        <strong>¡Increíble!</strong> Tu chatbot responderá automáticamente 
                        a preguntas sobre productos, envíos y pagos. Ahorra tiempo y vende más.
                    </div>
                </div>
            </div>
        `;
    }

    getFinalContent() {
        return `
            <div class="final-content">
                <div class="final-emoji">🎉</div>
                <h2 style="font-size: 28px; margin-bottom: 16px;">¡Felicitaciones!</h2>
                <p style="font-size: 16px; color: #6B7280; margin-bottom: 32px;">
                    Tu tienda está lista para recibir tus primeros clientes
                </p>

                <div class="next-steps">
                    <h4>Próximos pasos sugeridos:</h4>
                    <div class="next-step-card">
                        <i class="fas fa-share-alt"></i>
                        <div>
                            <strong>Comparte tu tienda</strong>
                            <p>En redes sociales, WhatsApp, con amigos</p>
                        </div>
                    </div>
                    <div class="next-step-card">
                        <i class="fas fa-camera"></i>
                        <div>
                            <strong>Agrega más productos</strong>
                            <p>Mientras más opciones, más ventas</p>
                        </div>
                    </div>
                    <div class="next-step-card">
                        <i class="fas fa-tag"></i>
                        <div>
                            <strong>Crea un cupón de lanzamiento</strong>
                            <p>10-20% descuento para primeros clientes</p>
                        </div>
                    </div>
                </div>

                ${this.plan === 'free' || this.plan === 'basic' ? `
                <div class="apoyo-reminder">
                    <i class="fas fa-heart"></i>
                    <p>
                        Recuerda: Tu <strong>Espacio de Apoyo</strong> 💜 está disponible 
                        cuando lo necesites. Botón rosa en la esquina inferior izquierda.
                    </p>
                </div>
                ` : ''}

                <div class="share-section">
                    <h4>Comparte tu tienda:</h4>
                    <div class="share-url">
                        <input type="text" value="https://cresalia.com/${this.tenant.slug}" readonly id="share-url">
                        <button class="btn-copy" onclick="copyShareUrl()">
                            <i class="fas fa-copy"></i>
                            Copiar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Highlight elemento
    highlightElement(selector) {
        // Remover highlights previos
        document.querySelectorAll('.onboarding-highlight').forEach(el => {
            el.classList.remove('onboarding-highlight');
        });

        // Agregar nuevo highlight
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('onboarding-highlight');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Guardar progreso
    saveProgress() {
        localStorage.setItem(`onboarding_step_${this.tenant.slug}`, this.currentStep);
    }

    // Cargar progreso
    loadProgress() {
        const saved = localStorage.getItem(`onboarding_step_${this.tenant.slug}`);
        return saved ? parseInt(saved) : 0;
    }

    // Estilos
    getStyles() {
        return `
        <style>
            #onboarding-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(30, 27, 75, 0.95);
                backdrop-filter: blur(8px);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .onboarding-container {
                background: white;
                border-radius: 24px;
                width: 90%;
                max-width: 700px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            .onboarding-progress {
                padding: 24px 32px;
                border-bottom: 1px solid #F3F4F6;
            }

            .progress-bar {
                height: 6px;
                background: #E5E7EB;
                border-radius: 50px;
                overflow: hidden;
                margin-bottom: 12px;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #7C3AED, #EC4899);
                transition: width 0.4s ease;
                border-radius: 50px;
            }

            .progress-text {
                text-align: center;
                font-size: 14px;
                color: #6B7280;
                font-weight: 500;
            }

            .onboarding-content {
                flex: 1;
                padding: 40px;
                overflow-y: auto;
            }

            .step-content {
                text-align: center;
                max-width: 560px;
                margin: 0 auto;
            }

            .step-icon {
                font-size: 80px;
                margin-bottom: 24px;
                animation: float 3s ease-in-out infinite;
            }

            .step-title {
                font-size: 32px;
                font-weight: 800;
                color: #1F2937;
                margin-bottom: 12px;
            }

            .step-description {
                font-size: 18px;
                color: #6B7280;
                margin-bottom: 32px;
            }

            .step-body {
                text-align: left;
            }

            .tutorial-steps {
                margin: 24px 0;
            }

            .tutorial-step {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                background: #F9FAFB;
                border-radius: 12px;
                margin-bottom: 12px;
            }

            .step-number {
                width: 36px;
                height: 36px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                flex-shrink: 0;
            }

            .step-text {
                color: #374151;
                font-size: 15px;
                line-height: 1.5;
            }

            .tip-box {
                background: linear-gradient(135deg, #FEF3C7, #FDE68A);
                padding: 16px;
                border-radius: 12px;
                display: flex;
                gap: 12px;
                margin-top: 24px;
                border-left: 4px solid #F59E0B;
            }

            .tip-box i {
                color: #D97706;
                font-size: 20px;
                flex-shrink: 0;
            }

            .tip-box strong {
                display: block;
                color: #92400E;
                margin-bottom: 4px;
            }

            .tip-box div {
                color: #78350F;
                font-size: 14px;
                line-height: 1.6;
            }

            .onboarding-nav {
                padding: 24px 32px;
                border-top: 1px solid #F3F4F6;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .nav-buttons {
                display: flex;
                gap: 12px;
            }

            .btn-onboarding {
                padding: 12px 24px;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .btn-skip {
                background: transparent;
                color: #9CA3AF;
            }

            .btn-skip:hover {
                color: #6B7280;
            }

            .btn-back {
                background: #F3F4F6;
                color: #374151;
            }

            .btn-back:hover {
                background: #E5E7EB;
            }

            .btn-next {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            }

            .btn-next:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
            }

            /* Apoyo Especial */
            .apoyo-especial {
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                padding: 20px;
                border-radius: 16px;
                margin-top: 24px;
                text-align: center;
                border: 2px solid #FBCFE8;
            }

            .apoyo-icono {
                font-size: 48px;
                margin-bottom: 12px;
            }

            .apoyo-especial p {
                color: #831843;
                font-size: 14px;
                line-height: 1.6;
                margin: 0;
            }

            .apoyo-especial strong {
                color: #BE185D;
            }

            /* Highlight */
            .onboarding-highlight {
                position: relative;
                z-index: 100000;
                box-shadow: 0 0 0 4px #7C3AED, 0 0 0 8px rgba(124, 58, 237, 0.3) !important;
                animation: highlight-pulse 2s infinite;
            }

            @keyframes highlight-pulse {
                0%, 100% { box-shadow: 0 0 0 4px #7C3AED, 0 0 0 8px rgba(124, 58, 237, 0.3); }
                50% { box-shadow: 0 0 0 4px #7C3AED, 0 0 0 12px rgba(124, 58, 237, 0.5); }
            }

            /* Final */
            .final-emoji {
                font-size: 100px;
                margin-bottom: 20px;
                animation: tada 1s ease;
            }

            @keyframes tada {
                0%, 100% { transform: scale(1) rotate(0deg); }
                10%, 20% { transform: scale(0.9) rotate(-3deg); }
                30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
                40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
            }

            .share-url {
                display: flex;
                gap: 8px;
                margin-top: 12px;
            }

            .share-url input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #E5E7EB;
                border-radius: 10px;
                font-size: 14px;
                font-family: monospace;
            }

            .btn-copy {
                padding: 12px 20px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            @media (max-width: 768px) {
                .onboarding-container {
                    width: 100%;
                    height: 100%;
                    max-height: 100vh;
                    border-radius: 0;
                }

                .step-title {
                    font-size: 24px;
                }
            }
        </style>
        `;
    }
}

// Función para copiar URL
function copyShareUrl() {
    const input = document.getElementById('share-url');
    input.select();
    document.execCommand('copy');
    
    const btn = event.target.closest('.btn-copy');
    btn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
    }, 2000);
}

// Función global para inicializar
window.initOnboarding = function(tenantConfig) {
    window.onboarding = new OnboardingCresalia(tenantConfig);
    
    // Iniciar después de 2 segundos (dar tiempo a que cargue la página)
    setTimeout(() => {
        onboarding.init();
    }, 2000);
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OnboardingCresalia };
}


