// ===== CENTRO DE AYUDA INTERACTIVO - WIDGET FLOTANTE =====
// Versión: 1.0
// Responsive y optimizado para móviles
// Autor: Equipo Cresalia

class CentroAyudaWidget {
    constructor() {
        this.isOpen = false;
        this.currentView = 'home'; // home, search, faq, guia, contacto
        this.searchQuery = '';
        this.faqs = this.loadFAQs();
        this.guias = this.loadGuias();
        this.categorias = this.loadCategorias();
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
    }

    // Cargar FAQs desde documentación
    loadFAQs() {
        return [
            {
                id: 1,
                categoria: 'general',
                pregunta: '¿Qué es Cresalia?',
                respuesta: 'Cresalia es una plataforma SaaS de comercio electrónico que te permite crear y gestionar tu propia tienda online sin conocimientos técnicos.',
                tags: ['general', 'inicio']
            },
            {
                id: 2,
                categoria: 'tienda',
                pregunta: '¿Cómo creo mi tienda?',
                respuesta: '1. Ve a la página de registro\n2. Completa el formulario con tu información\n3. Haz clic en "Crear Mi Negocio"\n4. ¡Listo! Ya tienes tu tienda',
                tags: ['crear', 'tienda', 'registro']
            },
            {
                id: 3,
                categoria: 'productos',
                pregunta: '¿Cómo agrego un producto?',
                respuesta: '1. Ve a tu panel → "Productos" → "Agregar Producto"\n2. Completa la información (nombre, descripción, precio, etc.)\n3. Sube imágenes (máximo 5)\n4. Configura stock y categoría\n5. Haz clic en "Guardar"',
                tags: ['productos', 'agregar', 'inventario']
            },
            {
                id: 4,
                categoria: 'pagos',
                pregunta: '¿Hay comisiones en las ventas?',
                respuesta: 'No, Cresalia NO cobra comisiones en tus ventas. Solo pagas tu suscripción mensual. Mercado Pago sí cobra sus propias comisiones (6.17% aproximadamente).',
                tags: ['pagos', 'comisiones', 'ventas']
            },
            {
                id: 5,
                categoria: 'pagos',
                pregunta: '¿Cómo configuro Mercado Pago?',
                respuesta: '1. Crea una cuenta en Mercado Pago\n2. Completa la verificación de identidad\n3. Obtén tus credenciales (Access Token y Public Key)\n4. En tu panel de Cresalia, ve a "Configuración" → "Pagos"\n5. Ingresa tus credenciales y guarda',
                tags: ['pagos', 'mercadopago', 'configurar']
            },
            {
                id: 6,
                categoria: 'productos',
                pregunta: '¿Cuántos productos puedo agregar?',
                respuesta: 'Plan Free: 50 productos\nPlan Basic: 500 productos\nPlan Pro: Productos ilimitados\nPlan Enterprise: Productos ilimitados',
                tags: ['productos', 'limites', 'planes']
            },
            {
                id: 7,
                categoria: 'pedidos',
                pregunta: '¿Cómo gestiono mis pedidos?',
                respuesta: 'Ve a tu panel → "Pedidos". Allí puedes ver todos los pedidos, cambiar su estado (pendiente, procesando, enviado, completado) y gestionar el envío.',
                tags: ['pedidos', 'gestionar', 'ordenes']
            },
            {
                id: 8,
                categoria: 'personalizacion',
                pregunta: '¿Puedo personalizar los colores de mi tienda?',
                respuesta: 'Sí, puedes personalizar completamente los colores de tu tienda desde tu panel → "Personalización" → "Colores". Puedes elegir colores primarios, secundarios y de acento.',
                tags: ['personalizacion', 'colores', 'diseño']
            },
            {
                id: 9,
                categoria: 'comunidades',
                pregunta: '¿Qué son las comunidades?',
                respuesta: 'Las comunidades son espacios donde puedes conectar con otros vendedores y compradores, compartir experiencias, hacer preguntas y recibir apoyo de la comunidad.',
                tags: ['comunidades', 'social', 'red']
            },
            {
                id: 10,
                categoria: 'soporte',
                pregunta: '¿Cómo contacto soporte?',
                respuesta: 'Puedes contactarnos:\n- Email: cresalia25@gmail.com\n- Centro de Ayuda: Busca en el centro de ayuda interactivo\n- Comunidad: Publica en la comunidad de vendedores',
                tags: ['soporte', 'contacto', 'ayuda']
            }
        ];
    }

    // Cargar guías paso a paso
    loadGuias() {
        return [
            {
                id: 1,
                titulo: 'Crear Mi Primera Tienda',
                categoria: 'tienda',
                tiempo: '5 minutos',
                pasos: [
                    { numero: 1, titulo: 'Acceder al Registro', contenido: 'Ve a la página de registro o haz clic en "Crear Mi Negocio" en la página principal.' },
                    { numero: 2, titulo: 'Completar el Formulario', contenido: 'Completa: Tipo de Negocio, Nombre, Email, Contraseña, Teléfono y Descripción.' },
                    { numero: 3, titulo: 'Confirmar Registro', contenido: 'Haz clic en "Crear Mi Negocio" y serás redirigido a tu panel de administración.' }
                ]
            },
            {
                id: 2,
                titulo: 'Agregar Productos',
                categoria: 'productos',
                tiempo: '3 minutos',
                pasos: [
                    { numero: 1, titulo: 'Ir a Productos', contenido: 'En tu panel, busca "Productos" o "Catálogo" y haz clic en "Agregar Producto".' },
                    { numero: 2, titulo: 'Completar Información', contenido: 'Completa: Nombre, Descripción, Precio, Categoría, Imágenes y Stock.' },
                    { numero: 3, titulo: 'Guardar y Publicar', contenido: 'Revisa la información y haz clic en "Guardar Producto". El producto aparecerá en tu tienda pública.' }
                ]
            },
            {
                id: 3,
                titulo: 'Configurar Pagos',
                categoria: 'pagos',
                tiempo: '10 minutos',
                pasos: [
                    { numero: 1, titulo: 'Integrar Mercado Pago', contenido: 'Ve a "Pagos" → "Mercado Pago" en tu panel.' },
                    { numero: 2, titulo: 'Obtener Credenciales', contenido: 'Crea una cuenta en Mercado Pago y obtén tus credenciales (Access Token y Public Key).' },
                    { numero: 3, titulo: 'Configurar en Cresalia', contenido: 'Ingresa tus credenciales en tu panel de Cresalia y guarda los cambios.' }
                ]
            }
        ];
    }

    // Cargar categorías
    loadCategorias() {
        return [
            { id: 'general', nombre: 'General', icono: '❓' },
            { id: 'tienda', nombre: 'Mi Tienda', icono: '🏪' },
            { id: 'productos', nombre: 'Productos', icono: '📦' },
            { id: 'pagos', nombre: 'Pagos', icono: '💳' },
            { id: 'pedidos', nombre: 'Pedidos', icono: '📊' },
            { id: 'personalizacion', nombre: 'Personalización', icono: '🎨' },
            { id: 'comunidades', nombre: 'Comunidades', icono: '💜' },
            { id: 'soporte', nombre: 'Soporte', icono: '🆘' }
        ];
    }

    // Crear widget flotante
    createWidget() {
        const widgetHTML = `
            <!-- Botón flotante -->
            <button id="centroAyudaBtn" class="centro-ayuda-btn" aria-label="Abrir centro de ayuda">
                <i class="fas fa-question-circle"></i>
                <span class="centro-ayuda-badge">?</span>
            </button>

            <!-- Panel del centro de ayuda -->
            <div id="centroAyudaPanel" class="centro-ayuda-panel">
                <div class="centro-ayuda-header">
                    <h3>
                        <i class="fas fa-life-ring"></i>
                        Centro de Ayuda
                    </h3>
                    <button class="centro-ayuda-close" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="centro-ayuda-content" id="centroAyudaContent">
                    <!-- Contenido dinámico -->
                </div>
            </div>

            <!-- Overlay -->
            <div id="centroAyudaOverlay" class="centro-ayuda-overlay"></div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    // Adjuntar event listeners
    attachEventListeners() {
        const btn = document.getElementById('centroAyudaBtn');
        const closeBtn = document.querySelector('.centro-ayuda-close');
        const overlay = document.getElementById('centroAyudaOverlay');

        btn?.addEventListener('click', () => this.toggle());
        closeBtn?.addEventListener('click', () => this.close());
        overlay?.addEventListener('click', () => this.close());

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    // Toggle widget
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    // Abrir widget
    open() {
        this.isOpen = true;
        document.getElementById('centroAyudaPanel')?.classList.add('active');
        document.getElementById('centroAyudaOverlay')?.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.showHome();
    }

    // Cerrar widget
    close() {
        this.isOpen = false;
        document.getElementById('centroAyudaPanel')?.classList.remove('active');
        document.getElementById('centroAyudaOverlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Mostrar vista home
    showHome() {
        const content = document.getElementById('centroAyudaContent');
        if (!content) return;

        content.innerHTML = `
            <!-- Búsqueda -->
            <div class="centro-ayuda-search">
                <input 
                    type="text" 
                    id="centroAyudaSearchInput" 
                    placeholder="🔍 Buscar ayuda..." 
                    autocomplete="off"
                >
                <button class="centro-ayuda-search-btn" onclick="centroAyuda.performSearch()">
                    <i class="fas fa-search"></i>
                </button>
            </div>

            <!-- Categorías -->
            <div class="centro-ayuda-categorias">
                <h4>📚 Categorías</h4>
                <div class="categorias-grid">
                    ${this.categorias.map(cat => `
                        <button 
                            class="categoria-card" 
                            onclick="centroAyuda.showCategory('${cat.id}')"
                        >
                            <span class="categoria-icono">${cat.icono}</span>
                            <span class="categoria-nombre">${cat.nombre}</span>
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- FAQs Populares -->
            <div class="centro-ayuda-faqs-populares">
                <h4>⭐ Preguntas Frecuentes</h4>
                <div class="faqs-list">
                    ${this.faqs.slice(0, 5).map(faq => `
                        <button 
                            class="faq-item-preview" 
                            onclick="centroAyuda.showFAQ(${faq.id})"
                        >
                            <span>${faq.pregunta}</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Guías -->
            <div class="centro-ayuda-guias">
                <h4>📖 Guías Rápidas</h4>
                <div class="guias-list">
                    ${this.guias.map(guia => `
                        <button 
                            class="guia-card" 
                            onclick="centroAyuda.showGuia(${guia.id})"
                        >
                            <div class="guia-header">
                                <span class="guia-titulo">${guia.titulo}</span>
                                <span class="guia-tiempo">⏱️ ${guia.tiempo}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Contacto -->
            <div class="centro-ayuda-contacto">
                <p>💬 ¿No encontraste lo que buscabas?</p>
                <button class="btn-contacto" onclick="centroAyuda.showContacto()">
                    <i class="fas fa-envelope"></i>
                    Contactar Soporte
                </button>
            </div>
        `;

        // Setup búsqueda
        const searchInput = document.getElementById('centroAyudaSearchInput');
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        searchInput?.addEventListener('input', (e) => {
            if (e.target.value.length > 2) {
                this.performSearch();
            }
        });

        this.currentView = 'home';
    }

    // Realizar búsqueda
    performSearch() {
        const input = document.getElementById('centroAyudaSearchInput');
        const query = input?.value.toLowerCase().trim() || '';

        if (!query) {
            this.showHome();
            return;
        }

        this.searchQuery = query;
        const results = this.search(query);
        this.showSearchResults(results, query);
    }

    // Buscar en FAQs y guías
    search(query) {
        const results = {
            faqs: [],
            guias: []
        };

        // Buscar en FAQs
        this.faqs.forEach(faq => {
            const match = 
                faq.pregunta.toLowerCase().includes(query) ||
                faq.respuesta.toLowerCase().includes(query) ||
                faq.tags.some(tag => tag.includes(query));

            if (match) {
                results.faqs.push(faq);
            }
        });

        // Buscar en guías
        this.guias.forEach(guia => {
            const match = 
                guia.titulo.toLowerCase().includes(query) ||
                guia.categoria.toLowerCase().includes(query);

            if (match) {
                results.guias.push(guia);
            }
        });

        return results;
    }

    // Mostrar resultados de búsqueda
    showSearchResults(results, query) {
        const content = document.getElementById('centroAyudaContent');
        if (!content) return;

        const hasResults = results.faqs.length > 0 || results.guias.length > 0;

        content.innerHTML = `
            <div class="centro-ayuda-search-results">
                <button class="btn-back" onclick="centroAyuda.showHome()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                
                <h4>🔍 Resultados para: "${query}"</h4>

                ${!hasResults ? `
                    <div class="no-results">
                        <p>😔 No encontramos resultados para "${query}"</p>
                        <button class="btn-contacto" onclick="centroAyuda.showContacto()">
                            <i class="fas fa-envelope"></i>
                            Contactar Soporte
                        </button>
                    </div>
                ` : ''}

                ${results.faqs.length > 0 ? `
                    <div class="results-section">
                        <h5>❓ Preguntas Frecuentes</h5>
                        ${results.faqs.map(faq => `
                            <button 
                                class="result-item" 
                                onclick="centroAyuda.showFAQ(${faq.id})"
                            >
                                <span>${faq.pregunta}</span>
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        `).join('')}
                    </div>
                ` : ''}

                ${results.guias.length > 0 ? `
                    <div class="results-section">
                        <h5>📖 Guías</h5>
                        ${results.guias.map(guia => `
                            <button 
                                class="result-item" 
                                onclick="centroAyuda.showGuia(${guia.id})"
                            >
                                <span>${guia.titulo}</span>
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        this.currentView = 'search';
    }

    // Mostrar categoría
    showCategory(categoriaId) {
        const faqs = this.faqs.filter(faq => faq.categoria === categoriaId);
        const categoria = this.categorias.find(c => c.id === categoriaId);

        const content = document.getElementById('centroAyudaContent');
        if (!content) return;

        content.innerHTML = `
            <div class="centro-ayuda-category">
                <button class="btn-back" onclick="centroAyuda.showHome()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                
                <h4>${categoria?.icono} ${categoria?.nombre}</h4>
                
                ${faqs.length === 0 ? `
                    <p>No hay preguntas en esta categoría aún.</p>
                ` : `
                    <div class="faqs-list">
                        ${faqs.map(faq => `
                            <button 
                                class="faq-item-preview" 
                                onclick="centroAyuda.showFAQ(${faq.id})"
                            >
                                <span>${faq.pregunta}</span>
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        `).join('')}
                    </div>
                `}
            </div>
        `;

        this.currentView = 'category';
    }

    // Mostrar FAQ individual
    showFAQ(faqId) {
        const faq = this.faqs.find(f => f.id === faqId);
        if (!faq) return;

        const content = document.getElementById('centroAyudaContent');
        if (!content) return;

        content.innerHTML = `
            <div class="centro-ayuda-faq-detail">
                <button class="btn-back" onclick="centroAyuda.showHome()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                
                <h4>${faq.pregunta}</h4>
                <div class="faq-answer">
                    ${faq.respuesta.split('\n').map(line => `<p>${line}</p>`).join('')}
                </div>
                
                <div class="faq-helpful">
                    <p>¿Te resultó útil esta respuesta?</p>
                    <div class="helpful-buttons">
                        <button class="btn-helpful" onclick="centroAyuda.markHelpful(${faqId}, true)">
                            <i class="fas fa-thumbs-up"></i> Sí
                        </button>
                        <button class="btn-helpful" onclick="centroAyuda.markHelpful(${faqId}, false)">
                            <i class="fas fa-thumbs-down"></i> No
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.currentView = 'faq';
    }

    // Mostrar guía paso a paso
    showGuia(guiaId) {
        const guia = this.guias.find(g => g.id === guiaId);
        if (!guia) return;

        const content = document.getElementById('centroAyudaContent');
        if (!content) return;

        let currentStep = 0;

        const renderStep = (stepIndex) => {
            const step = guia.pasos[stepIndex];
            if (!step) return;

            content.innerHTML = `
                <div class="centro-ayuda-guia">
                    <button class="btn-back" onclick="centroAyuda.showHome()">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                    
                    <div class="guia-header">
                        <h4>${guia.titulo}</h4>
                        <span class="guia-progress">Paso ${stepIndex + 1} de ${guia.pasos.length}</span>
                    </div>
                    
                    <div class="guia-progress-bar">
                        <div class="guia-progress-fill" style="width: ${((stepIndex + 1) / guia.pasos.length) * 100}%"></div>
                    </div>
                    
                    <div class="guia-step">
                        <h5>Paso ${step.numero}: ${step.titulo}</h5>
                        <p>${step.contenido}</p>
                    </div>
                    
                    <div class="guia-navigation">
                        ${stepIndex > 0 ? `
                            <button class="btn-guia-nav" onclick="centroAyudaGuiaSteps[${guiaId}].previous()">
                                <i class="fas fa-arrow-left"></i> Anterior
                            </button>
                        ` : ''}
                        ${stepIndex < guia.pasos.length - 1 ? `
                            <button class="btn-guia-nav btn-primary" onclick="centroAyudaGuiaSteps[${guiaId}].next()">
                                Siguiente <i class="fas fa-arrow-right"></i>
                            </button>
                        ` : `
                            <button class="btn-guia-nav btn-primary" onclick="centroAyuda.showHome()">
                                <i class="fas fa-check"></i> Completar
                            </button>
                        `}
                    </div>
                </div>
            `;
        };

        // Guardar funciones de navegación
        if (!window.centroAyudaGuiaSteps) {
            window.centroAyudaGuiaSteps = {};
        }
        window.centroAyudaGuiaSteps[guiaId] = {
            currentStep: 0,
            next: () => {
                if (currentStep < guia.pasos.length - 1) {
                    currentStep++;
                    renderStep(currentStep);
                }
            },
            previous: () => {
                if (currentStep > 0) {
                    currentStep--;
                    renderStep(currentStep);
                }
            }
        };

        renderStep(0);
        this.currentView = 'guia';
    }

    // Mostrar formulario de contacto
    showContacto() {
        const content = document.getElementById('centroAyudaContent');
        if (!content) return;

        content.innerHTML = `
            <div class="centro-ayuda-contacto-form">
                <button class="btn-back" onclick="centroAyuda.showHome()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                
                <h4>💬 Contactar Soporte</h4>
                
                <form id="contactoForm" onsubmit="centroAyuda.submitContacto(event)">
                    <div class="form-group">
                        <label>Asunto</label>
                        <input type="text" name="asunto" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Categoría</label>
                        <select name="categoria" required>
                            <option value="">Selecciona una categoría</option>
                            <option value="tecnico">Problema Técnico</option>
                            <option value="facturacion">Facturación</option>
                            <option value="funcionalidad">Funcionalidad</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea name="descripcion" rows="5" required></textarea>
                    </div>
                    
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-paper-plane"></i>
                        Enviar
                    </button>
                </form>
                
                <div class="contacto-alternativo">
                    <p>O contáctanos directamente:</p>
                    <a href="mailto:cresalia25@gmail.com" class="btn-email">
                        <i class="fas fa-envelope"></i>
                        cresalia25@gmail.com
                    </a>
                </div>
            </div>
        `;

        this.currentView = 'contacto';
    }

    // Enviar formulario de contacto
    async submitContacto(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        const data = {
            asunto: formData.get('asunto'),
            categoria: formData.get('categoria'),
            descripcion: formData.get('descripcion')
        };

        // Aquí puedes integrar con tu API de soporte
        // Por ahora, solo mostramos un mensaje
        alert('✅ Gracias por contactarnos. Te responderemos en menos de 24 horas.\n\nEmail: cresalia25@gmail.com');
        this.showHome();
    }

    // Marcar FAQ como útil/no útil
    markHelpful(faqId, helpful) {
        // Aquí puedes guardar el feedback en tu base de datos
        const message = helpful ? '👍 Gracias por tu feedback' : '👎 Lamentamos que no te haya sido útil. ¿Quieres contactar soporte?';
        alert(message);
        
        if (!helpful) {
            setTimeout(() => {
                this.showContacto();
            }, 1000);
        }
    }
}

// Inicializar cuando el DOM esté listo
let centroAyuda;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        centroAyuda = new CentroAyudaWidget();
        window.centroAyuda = centroAyuda;
    });
} else {
    centroAyuda = new CentroAyudaWidget();
    window.centroAyuda = centroAyuda;
}

