// ===== SISTEMA DE FAQ PERSONALIZABLE POR TENANT =====
// Cada tienda puede crear sus propias preguntas frecuentes

class FAQSystem {
    constructor(tenantConfig) {
        this.tenant = tenantConfig.tenant;
        this.plan = tenantConfig.plan;
        this.faqs = [];
        this.searchIndex = [];
    }

    // Inicializar sistema de FAQ
    async init() {
        await this.loadFAQs();
        this.createFAQSection();
        this.setupSearch();
        console.log(`❓ Sistema FAQ inicializado para ${this.tenant.nombre}`);
    }

    // Cargar FAQs desde API
    async loadFAQs() {
        try {
            const response = await fetch(`/api/${this.tenant.slug}/faqs`);
            const data = await response.json();
            this.faqs = data.faqs || [];
            this.buildSearchIndex();
        } catch (error) {
            console.error('Error cargando FAQs:', error);
            this.faqs = this.getDefaultFAQs();
        }
    }

    // FAQs por defecto (hasta que el tenant cree las suyas)
    getDefaultFAQs() {
        return [
            {
                id: 1,
                categoria: 'Pedidos',
                pregunta: '¿Cómo realizo un pedido?',
                respuesta: 'Para realizar un pedido, simplemente navega por nuestros productos, agrega los que desees al carrito y completa el proceso de pago. Recibirás una confirmación por email.',
                tags: ['pedido', 'comprar', 'orden'],
                visitas: 0
            },
            {
                id: 2,
                categoria: 'Envíos',
                pregunta: '¿Cuánto tarda el envío?',
                respuesta: `Los envíos demoran entre 3-5 días hábiles. ${this.tenant.envio_gratis_desde > 0 ? `¡Envío gratis en compras mayores a $${this.tenant.envio_gratis_desde}!` : ''}`,
                tags: ['envío', 'entrega', 'tiempo'],
                visitas: 0
            },
            {
                id: 3,
                categoria: 'Pagos',
                pregunta: '¿Qué métodos de pago aceptan?',
                respuesta: `Aceptamos ${this.tenant.permite_pagos_online ? 'tarjetas de crédito/débito' : ''} ${this.tenant.permite_pagos_efectivo ? 'y pago en efectivo contra entrega' : ''}.`,
                tags: ['pago', 'tarjeta', 'efectivo'],
                visitas: 0
            },
            {
                id: 4,
                categoria: 'Devoluciones',
                pregunta: '¿Puedo devolver un producto?',
                respuesta: 'Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar en perfecto estado y con su empaque original.',
                tags: ['devolver', 'cambio', 'garantía'],
                visitas: 0
            },
            {
                id: 5,
                categoria: 'Cuenta',
                pregunta: '¿Cómo creo una cuenta?',
                respuesta: 'Haz clic en "Mi Cuenta" en la parte superior y selecciona "Registrarse". Solo necesitas tu email y una contraseña.',
                tags: ['cuenta', 'registro', 'crear'],
                visitas: 0
            }
        ];
    }

    // Crear sección de FAQ en la página
    createFAQSection() {
        const faqHTML = `
            <section class="faq-section" id="faq">
                <div class="container">
                    <div class="faq-header">
                        <span class="faq-label">Preguntas Frecuentes</span>
                        <h2>¿Tienes alguna duda?</h2>
                        <p>Encuentra respuestas rápidas a las preguntas más comunes</p>
                    </div>

                    <!-- Buscador de FAQs -->
                    <div class="faq-search-box">
                        <i class="fas fa-search"></i>
                        <input 
                            type="text" 
                            id="faq-search" 
                            class="faq-search-input"
                            placeholder="Busca tu pregunta aquí..."
                        >
                    </div>

                    <!-- Categorías -->
                    <div class="faq-categories" id="faq-categories">
                        ${this.renderCategories()}
                    </div>

                    <!-- Lista de FAQs -->
                    <div class="faq-list" id="faq-list">
                        ${this.renderFAQs()}
                    </div>

                    <!-- No encontrado -->
                    <div class="faq-not-found" id="faq-not-found" style="display: none;">
                        <i class="fas fa-question-circle"></i>
                        <h3>¿No encontraste lo que buscabas?</h3>
                        <p>Nuestro equipo está aquí para ayudarte</p>
                        <div class="faq-help-buttons">
                            ${this.plan === 'pro' || this.plan === 'enterprise' ? `
                            <button class="btn-cresalia btn-primary" onclick="openChatbot()">
                                <i class="fas fa-robot"></i>
                                Hablar con Chatbot IA
                            </button>
                            ` : ''}
                            <button class="btn-cresalia btn-secondary" onclick="supportWidget.toggle()">
                                <i class="fas fa-headset"></i>
                                Contactar Soporte
                            </button>
                        </div>
                    </div>
                </div>

                ${this.getStyles()}
            </section>
        `;

        // Insertar en la página (antes del footer)
        const footer = document.querySelector('footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', faqHTML);
        } else {
            document.body.insertAdjacentHTML('beforeend', faqHTML);
        }
    }

    // Renderizar categorías
    renderCategories() {
        const categorias = [...new Set(this.faqs.map(faq => faq.categoria))];
        
        return `
            <button class="faq-category active" data-category="all">
                Todas
            </button>
            ${categorias.map(cat => `
                <button class="faq-category" data-category="${cat}">
                    ${cat}
                </button>
            `).join('')}
        `;
    }

    // Renderizar FAQs
    renderFAQs(filtro = null) {
        let faqsFiltrados = this.faqs;

        if (filtro) {
            faqsFiltrados = this.faqs.filter(faq => 
                faq.categoria === filtro ||
                faq.pregunta.toLowerCase().includes(filtro.toLowerCase()) ||
                faq.respuesta.toLowerCase().includes(filtro.toLowerCase()) ||
                faq.tags.some(tag => tag.includes(filtro.toLowerCase()))
            );
        }

        if (faqsFiltrados.length === 0) {
            return '';
        }

        return faqsFiltrados.map((faq, index) => `
            <div class="faq-item animate-fade-in delay-${Math.min(index, 5)}00">
                <div class="faq-question" onclick="faqSystem.toggleFAQ(${faq.id})">
                    <h4>${faq.pregunta}</h4>
                    <i class="fas fa-chevron-down faq-icon"></i>
                </div>
                <div class="faq-answer" id="faq-answer-${faq.id}">
                    <p>${faq.respuesta}</p>
                    <div class="faq-helpful">
                        <span>¿Te resultó útil?</span>
                        <button onclick="faqSystem.markHelpful(${faq.id}, true)" class="btn-helpful">
                            <i class="fas fa-thumbs-up"></i> Sí
                        </button>
                        <button onclick="faqSystem.markHelpful(${faq.id}, false)" class="btn-helpful">
                            <i class="fas fa-thumbs-down"></i> No
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Setup búsqueda
    setupSearch() {
        const searchInput = document.getElementById('faq-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            this.search(query);
        });

        // Categorías
        document.querySelectorAll('.faq-category').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
                
                // Actualizar active
                document.querySelectorAll('.faq-category').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    // Buscar FAQs
    search(query) {
        const faqList = document.getElementById('faq-list');
        const notFound = document.getElementById('faq-not-found');

        if (query.length === 0) {
            faqList.innerHTML = this.renderFAQs();
            notFound.style.display = 'none';
            return;
        }

        const results = this.faqs.filter(faq =>
            faq.pregunta.toLowerCase().includes(query.toLowerCase()) ||
            faq.respuesta.toLowerCase().includes(query.toLowerCase()) ||
            faq.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );

        if (results.length > 0) {
            faqList.innerHTML = results.map((faq, index) => `
                <div class="faq-item animate-fade-in">
                    <div class="faq-question" onclick="faqSystem.toggleFAQ(${faq.id})">
                        <h4>${this.highlightQuery(faq.pregunta, query)}</h4>
                        <i class="fas fa-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer" id="faq-answer-${faq.id}">
                        <p>${this.highlightQuery(faq.respuesta, query)}</p>
                        <div class="faq-helpful">
                            <span>¿Te resultó útil?</span>
                            <button onclick="faqSystem.markHelpful(${faq.id}, true)" class="btn-helpful">
                                <i class="fas fa-thumbs-up"></i> Sí
                            </button>
                            <button onclick="faqSystem.markHelpful(${faq.id}, false)" class="btn-helpful">
                                <i class="fas fa-thumbs-down"></i> No
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            notFound.style.display = 'none';
        } else {
            faqList.innerHTML = '';
            notFound.style.display = 'block';
        }
    }

    // Resaltar búsqueda
    highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Filtrar por categoría
    filterByCategory(category) {
        const faqList = document.getElementById('faq-list');
        
        if (category === 'all') {
            faqList.innerHTML = this.renderFAQs();
        } else {
            const filtered = this.faqs.filter(faq => faq.categoria === category);
            faqList.innerHTML = filtered.map((faq, index) => `
                <div class="faq-item animate-fade-in">
                    <div class="faq-question" onclick="faqSystem.toggleFAQ(${faq.id})">
                        <h4>${faq.pregunta}</h4>
                        <i class="fas fa-chevron-down faq-icon"></i>
                    </div>
                    <div class="faq-answer" id="faq-answer-${faq.id}">
                        <p>${faq.respuesta}</p>
                        <div class="faq-helpful">
                            <span>¿Te resultó útil?</span>
                            <button onclick="faqSystem.markHelpful(${faq.id}, true)" class="btn-helpful">
                                <i class="fas fa-thumbs-up"></i> Sí
                            </button>
                            <button onclick="faqSystem.markHelpful(${faq.id}, false)" class="btn-helpful">
                                <i class="fas fa-thumbs-down"></i> No
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Toggle FAQ
    toggleFAQ(id) {
        const answer = document.getElementById(`faq-answer-${id}`);
        const question = answer.previousElementSibling;
        const icon = question.querySelector('.faq-icon');

        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        } else {
            // Cerrar otros
            document.querySelectorAll('.faq-answer').forEach(a => {
                a.style.display = 'none';
            });
            document.querySelectorAll('.faq-icon').forEach(i => {
                i.style.transform = 'rotate(0deg)';
            });

            // Abrir este
            answer.style.display = 'block';
            icon.style.transform = 'rotate(180deg)';

            // Registrar vista
            this.trackView(id);
        }
    }

    // Marcar como útil
    markHelpful(id, helpful) {
        // En producción, enviar a API
        console.log(`FAQ ${id} marcado como ${helpful ? 'útil' : 'no útil'}`);

        // Mostrar mensaje
        const answer = document.getElementById(`faq-answer-${id}`);
        const helpfulDiv = answer.querySelector('.faq-helpful');
        
        helpfulDiv.innerHTML = `
            <span class="helpful-message">
                <i class="fas fa-check-circle"></i>
                ¡Gracias por tu feedback!
            </span>
        `;

        // Si marcó como NO útil, sugerir más ayuda
        if (!helpful) {
            setTimeout(() => {
                helpfulDiv.innerHTML += `
                    <div class="need-more-help">
                        <p>¿Necesitas más ayuda?</p>
                        ${this.plan === 'pro' || this.plan === 'enterprise' ? `
                        <button class="btn-cresalia btn-primary btn-sm" onclick="openChatbot()">
                            <i class="fas fa-robot"></i>
                            Chatbot IA
                        </button>
                        ` : ''}
                        <button class="btn-cresalia btn-secondary btn-sm" onclick="supportWidget.toggle()">
                            <i class="fas fa-headset"></i>
                            Soporte
                        </button>
                    </div>
                `;
            }, 1000);
        }
    }

    // Registrar vista
    async trackView(id) {
        // En producción, enviar a API
        // await fetch(`/api/${this.tenant.slug}/faqs/${id}/view`, { method: 'POST' });
    }

    // Construir índice de búsqueda
    buildSearchIndex() {
        this.searchIndex = this.faqs.map(faq => ({
            id: faq.id,
            searchText: `${faq.pregunta} ${faq.respuesta} ${faq.tags.join(' ')}`.toLowerCase()
        }));
    }

    // Estilos
    getStyles() {
        return `
        <style>
            .faq-section {
                padding: 100px 0;
                background: linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 100%);
            }

            .faq-header {
                text-align: center;
                margin-bottom: 60px;
            }

            .faq-label {
                color: var(--cresalia-primary, #7C3AED);
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 2px;
                display: block;
                margin-bottom: 12px;
            }

            .faq-header h2 {
                font-size: 42px;
                font-weight: 700;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 16px;
            }

            .faq-header p {
                font-size: 18px;
                color: #6B7280;
            }

            /* Buscador */
            .faq-search-box {
                max-width: 600px;
                margin: 0 auto 40px;
                position: relative;
            }

            .faq-search-box i {
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                color: #7C3AED;
                font-size: 20px;
            }

            .faq-search-input {
                width: 100%;
                padding: 18px 20px 18px 56px;
                border: 2px solid #E5E7EB;
                border-radius: 16px;
                font-size: 16px;
                font-family: inherit;
                transition: all 0.3s ease;
                background: white;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.08);
            }

            .faq-search-input:focus {
                outline: none;
                border-color: #7C3AED;
                box-shadow: 0 4px 20px rgba(124, 58, 237, 0.15);
            }

            .faq-search-input::placeholder {
                color: #9CA3AF;
            }

            /* Categorías */
            .faq-categories {
                display: flex;
                gap: 12px;
                margin-bottom: 40px;
                flex-wrap: wrap;
                justify-content: center;
            }

            .faq-category {
                padding: 10px 24px;
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 24px;
                font-size: 14px;
                font-weight: 500;
                color: #4B5563;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .faq-category:hover {
                border-color: #7C3AED;
                color: #7C3AED;
                background: #F5F3FF;
            }

            .faq-category.active {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border-color: transparent;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            }

            /* Lista de FAQs */
            .faq-list {
                max-width: 800px;
                margin: 0 auto;
            }

            .faq-item {
                background: white;
                border-radius: 16px;
                margin-bottom: 16px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                transition: all 0.3s ease;
            }

            .faq-item:hover {
                box-shadow: 0 8px 24px rgba(124, 58, 237, 0.12);
                transform: translateY(-2px);
            }

            .faq-question {
                padding: 24px 28px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 20px;
            }

            .faq-question h4 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1F2937;
            }

            .faq-question h4 mark {
                background: #FDE68A;
                padding: 2px 4px;
                border-radius: 4px;
            }

            .faq-icon {
                color: #7C3AED;
                font-size: 20px;
                transition: transform 0.3s ease;
            }

            .faq-answer {
                display: none;
                padding: 0 28px 24px;
                animation: fadeIn 0.3s ease;
            }

            .faq-answer p {
                color: #4B5563;
                line-height: 1.7;
                margin-bottom: 20px;
            }

            .faq-answer p mark {
                background: #FDE68A;
                padding: 2px 4px;
                border-radius: 4px;
            }

            .faq-helpful {
                padding-top: 16px;
                border-top: 1px solid #E5E7EB;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .faq-helpful span {
                font-size: 14px;
                color: #6B7280;
            }

            .btn-helpful {
                padding: 6px 14px;
                background: #F3F4F6;
                border: 1px solid #E5E7EB;
                border-radius: 8px;
                font-size: 13px;
                color: #4B5563;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .btn-helpful:hover {
                background: #7C3AED;
                color: white;
                border-color: #7C3AED;
            }

            .helpful-message {
                color: #10B981;
                font-size: 14px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .need-more-help {
                margin-top: 12px;
                padding: 16px;
                background: #F9FAFB;
                border-radius: 12px;
            }

            .need-more-help p {
                margin: 0 0 12px 0;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }

            .btn-sm {
                padding: 8px 16px;
                font-size: 13px;
            }

            /* No encontrado */
            .faq-not-found {
                text-align: center;
                padding: 60px 20px;
                max-width: 600px;
                margin: 0 auto;
            }

            .faq-not-found i {
                font-size: 64px;
                color: #DDD6FE;
                margin-bottom: 20px;
            }

            .faq-not-found h3 {
                font-size: 24px;
                color: #1F2937;
                margin-bottom: 12px;
            }

            .faq-not-found p {
                color: #6B7280;
                margin-bottom: 32px;
            }

            .faq-help-buttons {
                display: flex;
                gap: 12px;
                justify-content: center;
                flex-wrap: wrap;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .faq-header h2 {
                    font-size: 32px;
                }

                .faq-question {
                    padding: 20px;
                }

                .faq-question h4 {
                    font-size: 16px;
                }

                .faq-answer {
                    padding: 0 20px 20px;
                }
            }
        </style>
        `;
    }
}

// Función global para inicializar
window.initFAQSystem = function(tenantConfig) {
    window.faqSystem = new FAQSystem(tenantConfig);
    window.faqSystem.init();
};

// Función para abrir chatbot (si está disponible)
window.openChatbot = function() {
    if (window.chatbotIA && window.chatbotIA.isOpen === false) {
        window.chatbotIA.toggleChatbot();
    } else {
        alert('Chatbot IA próximamente');
    }
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FAQSystem };
}


