// ===== PÁGINAS PERSONALIZABLES - CRESALIA =====
// Sistema para que cada tenant cree páginas a pedido

class PaginasPersonalizables {
    constructor(tenantSlug) {
        this.tenantSlug = tenantSlug;
        this.paginas = [];
    }

    // Crear nueva página
    async crearPagina(datos) {
        const {
            titulo,
            slug,
            contenido,
            tipo = 'custom', // custom, about, terms, privacy, faq
            visible = true,
            en_menu = true,
            orden = 0,
            meta_descripcion = '',
            meta_keywords = ''
        } = datos;

        const pagina = {
            tenant_id: this.tenantSlug,
            titulo,
            slug: this.generarSlug(slug || titulo),
            contenido,
            tipo,
            visible,
            en_menu,
            orden,
            meta_descripcion,
            meta_keywords,
            creada_at: new Date().toISOString(),
            actualizada_at: new Date().toISOString()
        };

        // Guardar en backend
        const response = await fetch(`/api/paginas/${this.tenantSlug}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.usuario?.token}`
            },
            body: JSON.stringify(pagina)
        });

        if (!response.ok) {
            throw new Error('Error al crear página');
        }

        const nuevaPagina = await response.json();
        this.paginas.push(nuevaPagina);
        
        return nuevaPagina;
    }

    // Editor de páginas (para admin)
    crearEditor() {
        const editor = document.createElement('div');
        editor.className = 'editor-paginas';
        editor.innerHTML = `
            <div class="editor-container">
                <div class="editor-header">
                    <h2>
                        <i class="fas fa-file-alt"></i>
                        Crear Nueva Página
                    </h2>
                    <p>Crea páginas personalizadas para tu tienda</p>
                </div>

                <div class="editor-form">
                    <!-- Título -->
                    <div class="form-group">
                        <label for="pagina-titulo">
                            Título de la Página *
                        </label>
                        <input 
                            type="text" 
                            id="pagina-titulo"
                            class="form-input"
                            placeholder="Ej: Sobre Nosotros, Política de Envíos..."
                            required
                        >
                    </div>

                    <!-- Slug (URL) -->
                    <div class="form-group">
                        <label for="pagina-slug">
                            URL de la Página
                            <span class="help-text">Se genera automáticamente del título</span>
                        </label>
                        <div class="url-preview">
                            <span class="url-base">tutienda.com/</span>
                            <input 
                                type="text" 
                                id="pagina-slug"
                                class="form-input-inline"
                                placeholder="sobre-nosotros"
                            >
                        </div>
                    </div>

                    <!-- Tipo de página -->
                    <div class="form-group">
                        <label for="pagina-tipo">Tipo de Página</label>
                        <select id="pagina-tipo" class="form-select">
                            <option value="custom">Página Personalizada</option>
                            <option value="about">Sobre Nosotros</option>
                            <option value="terms">Términos y Condiciones</option>
                            <option value="privacy">Política de Privacidad</option>
                            <option value="shipping">Política de Envíos</option>
                            <option value="returns">Devoluciones</option>
                            <option value="faq">Preguntas Frecuentes</option>
                        </select>
                    </div>

                    <!-- Editor de contenido -->
                    <div class="form-group">
                        <label for="pagina-contenido">
                            Contenido *
                        </label>
                        <div class="editor-toolbar">
                            <button type="button" class="toolbar-btn" onclick="window.formatearTexto('bold')">
                                <i class="fas fa-bold"></i>
                            </button>
                            <button type="button" class="toolbar-btn" onclick="window.formatearTexto('italic')">
                                <i class="fas fa-italic"></i>
                            </button>
                            <button type="button" class="toolbar-btn" onclick="window.formatearTexto('heading')">
                                <i class="fas fa-heading"></i>
                            </button>
                            <button type="button" class="toolbar-btn" onclick="window.formatearTexto('ul')">
                                <i class="fas fa-list-ul"></i>
                            </button>
                            <button type="button" class="toolbar-btn" onclick="window.formatearTexto('link')">
                                <i class="fas fa-link"></i>
                            </button>
                            <button type="button" class="toolbar-btn" onclick="window.formatearTexto('image')">
                                <i class="fas fa-image"></i>
                            </button>
                        </div>
                        <textarea 
                            id="pagina-contenido"
                            class="form-textarea"
                            rows="15"
                            placeholder="Escribe el contenido de tu página aquí...

Puedes usar formato simple:

**Negrita**
*Cursiva*
# Título
- Lista
[Link](url)
![Imagen](url)"
                            required
                        ></textarea>
                        <div class="preview-toggle">
                            <button type="button" class="btn-preview" onclick="window.togglePreview()">
                                <i class="fas fa-eye"></i>
                                Vista Previa
                            </button>
                        </div>
                        <div id="contenido-preview" class="contenido-preview" style="display: none;"></div>
                    </div>

                    <!-- SEO -->
                    <div class="form-section-divider">
                        <i class="fas fa-search"></i>
                        SEO & Meta Tags
                    </div>

                    <div class="form-group">
                        <label for="pagina-meta-desc">
                            Meta Descripción
                            <span class="help-text">Aparece en Google. Máx 160 caracteres</span>
                        </label>
                        <textarea 
                            id="pagina-meta-desc"
                            class="form-textarea"
                            rows="2"
                            maxlength="160"
                            placeholder="Descripción breve para buscadores..."
                        ></textarea>
                        <div class="char-count">
                            <span id="meta-desc-count">0</span>/160
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="pagina-keywords">
                            Palabras Clave
                            <span class="help-text">Separadas por comas</span>
                        </label>
                        <input 
                            type="text" 
                            id="pagina-keywords"
                            class="form-input"
                            placeholder="palabra1, palabra2, palabra3"
                        >
                    </div>

                    <!-- Visibilidad -->
                    <div class="form-section-divider">
                        <i class="fas fa-eye"></i>
                        Visibilidad
                    </div>

                    <div class="form-checks">
                        <label class="checkbox-label">
                            <input type="checkbox" id="pagina-visible" checked>
                            <span>Página visible (publicada)</span>
                        </label>

                        <label class="checkbox-label">
                            <input type="checkbox" id="pagina-menu" checked>
                            <span>Mostrar en menú de navegación</span>
                        </label>
                    </div>

                    <!-- Botones -->
                    <div class="form-actions">
                        <button type="button" class="btn-cancelar" onclick="window.cerrarEditor()">
                            Cancelar
                        </button>
                        <button type="button" class="btn-guardar-borrador" onclick="window.guardarBorrador()">
                            <i class="fas fa-save"></i>
                            Guardar Borrador
                        </button>
                        <button type="button" class="btn-publicar" onclick="window.publicarPagina()">
                            <i class="fas fa-check"></i>
                            Publicar Página
                        </button>
                    </div>
                </div>
            </div>

            ${this.getStyles()}
        `;

        this.setupEditorListeners(editor);
        return editor;
    }

    // Generar slug
    generarSlug(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Renderizar página
    renderizarPagina(pagina) {
        // Convertir markdown simple a HTML
        let html = pagina.contenido;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Negrita
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Cursiva
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Imágenes
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

        // Listas
        html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Párrafos
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';

        return `
            <article class="pagina-custom">
                <header class="pagina-header">
                    <h1>${pagina.titulo}</h1>
                    ${pagina.meta_descripcion ? `
                        <p class="pagina-subtitle">${pagina.meta_descripcion}</p>
                    ` : ''}
                </header>

                <div class="pagina-contenido">
                    ${html}
                </div>

                <footer class="pagina-footer">
                    <p>Última actualización: ${new Date(pagina.actualizada_at).toLocaleDateString()}</p>
                </footer>
            </article>
        `;
    }

    // Templates predefinidos
    getTemplate(tipo) {
        const templates = {
            about: `# Sobre Nosotros

## Nuestra Historia

[Cuenta aquí la historia de tu emprendimiento]

## Nuestra Misión

[Describe tu misión y valores]

## ¿Por qué elegirnos?

- **Calidad**: Descripción
- **Compromiso**: Descripción
- **Atención**: Descripción`,

            terms: `# Términos y Condiciones

## 1. Aceptación de los Términos

Al usar este sitio, aceptás estos términos y condiciones.

## 2. Productos y Servicios

[Describe tus productos/servicios]

## 3. Precios y Pagos

[Políticas de precios]

## 4. Envíos

[Políticas de envío]`,

            privacy: `# Política de Privacidad

## Información que Recopilamos

Recopilamos la información que nos proporcionás al:
- Crear una cuenta
- Realizar una compra
- Contactarnos

## Uso de la Información

Usamos tu información para:
- Procesar pedidos
- Mejorar nuestro servicio
- Comunicarnos contigo

## Seguridad

Protegemos tu información con [medidas de seguridad].`,

            shipping: `# Política de Envíos

## Zonas de Envío

Realizamos envíos a:
- [Zona 1]: Descripción
- [Zona 2]: Descripción

## Costos de Envío

- [Método 1]: Costo y tiempo
- [Método 2]: Costo y tiempo

## Seguimiento

Recibirás un código de seguimiento por email.`,

            returns: `# Política de Devoluciones

## Devoluciones

Aceptamos devoluciones dentro de [X] días.

## Condiciones

- Producto sin usar
- Embalaje original
- Comprobante de compra

## Proceso

1. Contactanos
2. Envianos el producto
3. Reembolso o cambio`,

            faq: `# Preguntas Frecuentes

## ¿Cómo hago un pedido?

[Respuesta]

## ¿Cuánto tarda el envío?

[Respuesta]

## ¿Aceptan devoluciones?

[Respuesta]

## ¿Cómo puedo contactarlos?

[Respuesta]`
        };

        return templates[tipo] || '';
    }

    // Setup listeners
    setupEditorListeners(editor) {
        // Auto-generar slug del título
        const tituloInput = editor.querySelector('#pagina-titulo');
        const slugInput = editor.querySelector('#pagina-slug');

        tituloInput?.addEventListener('input', (e) => {
            if (!slugInput.value) {
                slugInput.value = this.generarSlug(e.target.value);
            }
        });

        // Contador de caracteres
        const metaDescInput = editor.querySelector('#pagina-meta-desc');
        const countSpan = editor.querySelector('#meta-desc-count');

        metaDescInput?.addEventListener('input', (e) => {
            countSpan.textContent = e.target.value.length;
        });

        // Cambiar template según tipo
        const tipoSelect = editor.querySelector('#pagina-tipo');
        const contenidoTextarea = editor.querySelector('#pagina-contenido');

        tipoSelect?.addEventListener('change', (e) => {
            if (e.target.value !== 'custom' && !contenidoTextarea.value) {
                contenidoTextarea.value = this.getTemplate(e.target.value);
            }
        });
    }

    // Estilos
    getStyles() {
        return `
        <style>
            .editor-paginas {
                padding: 40px 20px;
                max-width: 1000px;
                margin: 0 auto;
            }

            .editor-container {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
            }

            .editor-header {
                margin-bottom: 40px;
                text-align: center;
            }

            .editor-header h2 {
                font-size: 32px;
                color: #1F2937;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }

            .editor-header p {
                color: #6B7280;
                font-size: 16px;
            }

            .form-group {
                margin-bottom: 24px;
            }

            .form-group label {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
                font-size: 14px;
            }

            .help-text {
                font-weight: 400;
                color: #9CA3AF;
                font-size: 13px;
                margin-left: 8px;
            }

            .form-input, .form-select, .form-textarea {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #E5E7EB;
                border-radius: 8px;
                font-size: 14px;
                font-family: inherit;
                transition: border-color 0.2s;
            }

            .form-input:focus, .form-select:focus, .form-textarea:focus {
                outline: none;
                border-color: #7C3AED;
            }

            .url-preview {
                display: flex;
                align-items: center;
                gap: 0;
                background: #F9FAFB;
                border-radius: 8px;
                padding: 4px 8px;
            }

            .url-base {
                color: #9CA3AF;
                font-size: 14px;
            }

            .form-input-inline {
                border: none;
                background: transparent;
                padding: 8px;
                font-weight: 600;
                color: #7C3AED;
            }

            .form-input-inline:focus {
                outline: none;
            }

            .editor-toolbar {
                display: flex;
                gap: 8px;
                padding: 12px;
                background: #F9FAFB;
                border: 2px solid #E5E7EB;
                border-bottom: none;
                border-radius: 8px 8px 0 0;
            }

            .toolbar-btn {
                width: 36px;
                height: 36px;
                border: none;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                color: #6B7280;
                transition: all 0.2s;
            }

            .toolbar-btn:hover {
                background: #E5E7EB;
                color: #1F2937;
            }

            .form-textarea {
                border-radius: 0 0 8px 8px;
                font-family: 'Courier New', monospace;
                resize: vertical;
            }

            .preview-toggle {
                margin-top: 12px;
            }

            .btn-preview {
                padding: 8px 16px;
                background: #F3F4F6;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                color: #6B7280;
                font-weight: 600;
                transition: all 0.2s;
            }

            .btn-preview:hover {
                background: #E5E7EB;
            }

            .contenido-preview {
                margin-top: 16px;
                padding: 24px;
                background: #F9FAFB;
                border-radius: 8px;
                border: 2px solid #E5E7EB;
            }

            .char-count {
                text-align: right;
                font-size: 13px;
                color: #9CA3AF;
                margin-top: 4px;
            }

            .form-section-divider {
                margin: 32px 0 24px 0;
                padding: 12px 0;
                border-top: 2px solid #E5E7EB;
                font-weight: 700;
                color: #7C3AED;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .form-checks {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                padding: 12px;
                background: #F9FAFB;
                border-radius: 8px;
                transition: background 0.2s;
            }

            .checkbox-label:hover {
                background: #F3F4F6;
            }

            .checkbox-label input[type="checkbox"] {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .form-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 32px;
                padding-top: 24px;
                border-top: 2px solid #E5E7EB;
            }

            .btn-cancelar, .btn-guardar-borrador, .btn-publicar {
                padding: 14px 28px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
                font-size: 15px;
            }

            .btn-cancelar {
                background: #F3F4F6;
                color: #6B7280;
            }

            .btn-guardar-borrador {
                background: #DBEAFE;
                color: #1E40AF;
            }

            .btn-publicar {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            }

            .btn-publicar:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
            }

            /* Página renderizada */
            .pagina-custom {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
            }

            .pagina-header {
                margin-bottom: 48px;
                text-align: center;
            }

            .pagina-header h1 {
                font-size: 42px;
                color: #1F2937;
                margin-bottom: 16px;
            }

            .pagina-subtitle {
                font-size: 18px;
                color: #6B7280;
            }

            .pagina-contenido {
                line-height: 1.8;
                font-size: 16px;
                color: #374151;
            }

            .pagina-contenido h2 {
                font-size: 32px;
                margin-top: 48px;
                margin-bottom: 24px;
                color: #1F2937;
            }

            .pagina-contenido h3 {
                font-size: 24px;
                margin-top: 32px;
                margin-bottom: 16px;
                color: #1F2937;
            }

            .pagina-contenido p {
                margin-bottom: 16px;
            }

            .pagina-contenido ul {
                margin: 24px 0;
                padding-left: 24px;
            }

            .pagina-contenido li {
                margin-bottom: 12px;
            }

            .pagina-contenido a {
                color: #7C3AED;
                text-decoration: none;
                border-bottom: 2px solid #A78BFA;
                transition: all 0.2s;
            }

            .pagina-contenido a:hover {
                border-bottom-color: #7C3AED;
            }

            .pagina-contenido img {
                max-width: 100%;
                border-radius: 12px;
                margin: 24px 0;
            }

            .pagina-footer {
                margin-top: 64px;
                padding-top: 24px;
                border-top: 2px solid #E5E7EB;
                text-align: center;
                color: #9CA3AF;
                font-size: 14px;
            }

            @media (max-width: 768px) {
                .editor-container {
                    padding: 24px;
                }

                .form-actions {
                    flex-direction: column;
                }

                .btn-cancelar, .btn-guardar-borrador, .btn-publicar {
                    width: 100%;
                }
            }
        </style>
        `;
    }
}

// Funciones globales
window.initPaginasPersonalizables = function(tenantSlug) {
    window.paginasManager = new PaginasPersonalizables(tenantSlug);
    return window.paginasManager;
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PaginasPersonalizables };
}


