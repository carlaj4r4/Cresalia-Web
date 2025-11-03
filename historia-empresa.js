// ===== SECCIÓN "NUESTRA HISTORIA" - CRESALIA =====

class HistoriaEmpresa {
    constructor(tenantConfig) {
        this.config = tenantConfig;
    }

    // Crear sección de historia
    crearSeccionHistoria() {
        if (!this.config.historia_empresa && !this.config.mision && !this.config.vision) {
            return ''; // No mostrar si no hay contenido
        }

        const colorPrimario = this.config.color_primario || '#667eea';
        const colorSecundario = this.config.color_secundario || '#764ba2';

        const html = `
            <section class="historia-empresa-section" id="nuestra-historia">
                <div class="container">
                    <!-- Título principal -->
                    <div class="historia-header">
                        <span class="historia-label" style="color: ${colorPrimario};">
                            ${i18n ? i18n.t('historia.conocenos') : 'Conócenos'}
                        </span>
                        <h2 class="historia-titulo" data-i18n="historia.titulo">
                            Nuestra Historia
                        </h2>
                        ${this.config.eslogan ? `
                            <p class="historia-eslogan">
                                "${this.config.eslogan}"
                            </p>
                        ` : ''}
                    </div>

                    <!-- Video de presentación (si existe) -->
                    ${this.config.video_presentacion_url ? `
                        <div class="historia-video">
                            <div class="video-container">
                                <iframe 
                                    src="${this.config.video_presentacion_url}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Historia principal -->
                    ${this.config.historia_empresa ? `
                        <div class="historia-contenido">
                            <div class="historia-texto">
                                ${this.formatearTexto(this.config.historia_empresa)}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Misión, Visión y Valores -->
                    <div class="historia-mvv">
                        ${this.config.mision ? `
                            <div class="mvv-card" style="border-top: 3px solid ${colorPrimario};">
                                <div class="mvv-icon" style="background: ${colorPrimario}20; color: ${colorPrimario};">
                                    <i class="fas fa-bullseye"></i>
                                </div>
                                <h3 class="mvv-titulo" data-i18n="historia.mision">Misión</h3>
                                <p class="mvv-texto">${this.config.mision}</p>
                            </div>
                        ` : ''}

                        ${this.config.vision ? `
                            <div class="mvv-card" style="border-top: 3px solid ${colorSecundario};">
                                <div class="mvv-icon" style="background: ${colorSecundario}20; color: ${colorSecundario};">
                                    <i class="fas fa-eye"></i>
                                </div>
                                <h3 class="mvv-titulo" data-i18n="historia.vision">Visión</h3>
                                <p class="mvv-texto">${this.config.vision}</p>
                            </div>
                        ` : ''}

                        ${this.config.valores ? `
                            <div class="mvv-card" style="border-top: 3px solid ${colorPrimario};">
                                <div class="mvv-icon" style="background: ${colorPrimario}20; color: ${colorPrimario};">
                                    <i class="fas fa-star"></i>
                                </div>
                                <h3 class="mvv-titulo" data-i18n="historia.valores">Valores</h3>
                                <div class="mvv-texto">
                                    ${this.formatearValores(this.config.valores)}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Banner de llamada a la acción -->
                    <div class="historia-cta" style="background: linear-gradient(135deg, ${colorPrimario}, ${colorSecundario});">
                        <h3>¿Listo para comenzar?</h3>
                        <p>Descubre todos nuestros productos y servicios</p>
                        <button class="btn-cta" onclick="scrollToProductos()" style="background: white; color: ${colorPrimario};">
                            Ver Productos
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </section>

            <style>
                .historia-empresa-section {
                    padding: 80px 0;
                    background: linear-gradient(180deg, #ffffff 0%, #f5f7fa 100%);
                }

                .historia-header {
                    text-align: center;
                    max-width: 800px;
                    margin: 0 auto 60px;
                }

                .historia-label {
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    display: block;
                    margin-bottom: 12px;
                }

                .historia-titulo {
                    font-size: 42px;
                    font-weight: 700;
                    color: #2c3e50;
                    margin-bottom: 20px;
                    line-height: 1.2;
                }

                .historia-eslogan {
                    font-size: 20px;
                    color: #7f8c8d;
                    font-style: italic;
                    margin-top: 20px;
                }

                .historia-video {
                    margin: 60px 0;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                }

                .video-container {
                    position: relative;
                    padding-bottom: 56.25%; /* 16:9 */
                    height: 0;
                    overflow: hidden;
                }

                .video-container iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .historia-contenido {
                    max-width: 900px;
                    margin: 0 auto 60px;
                }

                .historia-texto {
                    font-size: 18px;
                    line-height: 1.8;
                    color: #34495e;
                    text-align: justify;
                }

                .historia-texto p {
                    margin-bottom: 20px;
                }

                .historia-mvv {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 30px;
                    margin: 60px 0;
                }

                .mvv-card {
                    background: white;
                    padding: 40px 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .mvv-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                }

                .mvv-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                .mvv-titulo {
                    font-size: 24px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 16px;
                }

                .mvv-texto {
                    font-size: 16px;
                    line-height: 1.7;
                    color: #5a6c7d;
                }

                .mvv-texto ul {
                    list-style: none;
                    padding: 0;
                }

                .mvv-texto li {
                    padding: 8px 0;
                    padding-left: 28px;
                    position: relative;
                }

                .mvv-texto li:before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: ${colorPrimario};
                    font-weight: bold;
                    font-size: 18px;
                }

                .historia-cta {
                    margin: 80px auto 0;
                    padding: 60px 40px;
                    border-radius: 20px;
                    text-align: center;
                    color: white;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                }

                .historia-cta h3 {
                    font-size: 32px;
                    margin-bottom: 12px;
                    font-weight: 700;
                }

                .historia-cta p {
                    font-size: 18px;
                    margin-bottom: 30px;
                    opacity: 0.95;
                }

                .btn-cta {
                    padding: 16px 40px;
                    border: none;
                    border-radius: 50px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }

                .btn-cta:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                }

                .btn-cta i {
                    margin-left: 8px;
                    transition: transform 0.3s ease;
                }

                .btn-cta:hover i {
                    transform: translateX(5px);
                }

                @media (max-width: 768px) {
                    .historia-titulo {
                        font-size: 32px;
                    }

                    .historia-texto {
                        font-size: 16px;
                    }

                    .historia-mvv {
                        grid-template-columns: 1fr;
                    }

                    .historia-cta {
                        padding: 40px 20px;
                    }

                    .historia-cta h3 {
                        font-size: 24px;
                    }
                }
            </style>
        `;

        return html;
    }

    // Formatear texto con párrafos
    formatearTexto(texto) {
        if (!texto) return '';
        
        return texto
            .split('\n\n')
            .filter(p => p.trim())
            .map(p => `<p>${p.trim()}</p>`)
            .join('');
    }

    // Formatear valores como lista
    formatearValores(valores) {
        if (!valores) return '';

        // Si viene separado por comas o saltos de línea
        const items = valores.includes('\n') ? 
            valores.split('\n') : 
            valores.split(',');

        return `
            <ul>
                ${items
                    .filter(item => item.trim())
                    .map(item => `<li>${item.trim()}</li>`)
                    .join('')}
            </ul>
        `;
    }

    // Insertar en la página
    insertarEnPagina(posicion = 'after-productos') {
        const html = this.crearSeccionHistoria();
        if (!html) return;

        // Buscar el elemento de referencia
        let referencia;
        if (posicion === 'after-productos') {
            referencia = document.getElementById('productos') || 
                         document.querySelector('.productos-section');
        } else if (posicion === 'before-footer') {
            referencia = document.querySelector('footer');
        }

        if (referencia) {
            if (posicion === 'after-productos') {
                referencia.insertAdjacentHTML('afterend', html);
            } else if (posicion === 'before-footer') {
                referencia.insertAdjacentHTML('beforebegin', html);
            }
        } else {
            // Si no se encuentra referencia, agregar al final del body
            document.body.insertAdjacentHTML('beforeend', html);
        }
    }
}

// Función helper para scroll a productos
function scrollToProductos() {
    const productosSection = document.getElementById('productos') || 
                            document.querySelector('.productos-section');
    if (productosSection) {
        productosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HistoriaEmpresa };
}


