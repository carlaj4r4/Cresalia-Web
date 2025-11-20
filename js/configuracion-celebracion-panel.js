/**
 * 🎉 PANEL DE CONFIGURACIÓN DE CELEBRACIONES
 * Permite a las tiendas configurar colores, mensajes y duración del banner de celebración
 */

(function() {
    'use strict';

    const CONFIG_SECTION_ID = 'configuracion-celebraciones';
    let configSection = null;

    function obtenerIdentificadoresTienda() {
        const configCompleta = JSON.parse(localStorage.getItem('configuracion_tienda_completa') || '{}');
        const tiendaActual = JSON.parse(localStorage.getItem('tienda_actual') || '{}');
        const info = configCompleta.informacionTienda || {};

        return {
            slug: info.slug || tiendaActual.slug || tiendaActual.subdomain || 'demo-store',
            email: (info.email || tiendaActual.email || '').toLowerCase(),
            nombre: info.nombre || tiendaActual.nombre_tienda || 'Tu tienda',
            id: info.id || tiendaActual.id || null,
            tipoNegocio: (info.tipoNegocio || 'tienda').toLowerCase()
        };
    }

    async function cargarConfiguracionActual() {
        const { slug, email, tipoNegocio } = obtenerIdentificadoresTienda();
        if (!slug && !email) return null;

        try {
            const baseUrl = window.location.protocol === 'file:' 
                ? 'https://cresalia-web.vercel.app' 
                : '';
            
            const params = new URLSearchParams({ tipo: tipoNegocio === 'servicio' ? 'servicio' : 'tienda' });
            if (slug) params.append('slug', slug);
            if (email) params.append('email', email);

            const respuesta = await fetch(`${baseUrl}/api/aniversarios-celebracion?${params.toString()}`);
            if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
            const data = await respuesta.json();

            return data.configuracion || null;
        } catch (error) {
            console.warn('No se pudo cargar configuración:', error.message);
            return null;
        }
    }

    async function guardarConfiguracion(config) {
        const { slug, email, tipoNegocio } = obtenerIdentificadoresTienda();
        if (!slug && !email) return { success: false, message: 'No se pudo identificar la tienda' };

        try {
            const baseUrl = window.location.protocol === 'file:' 
                ? 'https://cresalia-web.vercel.app' 
                : '';

            const respuesta = await fetch(`${baseUrl}/api/aniversarios-configuracion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: tipoNegocio === 'servicio' ? 'servicio' : 'tienda',
                    slug,
                    email,
                    ...config
                })
            });

            if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
            const data = await respuesta.json();
            return data;
        } catch (error) {
            console.error('Error guardando configuración:', error);
            return { success: false, message: error.message };
        }
    }

    function crearPanelConfiguracion() {
        if (configSection) return configSection;

        const section = document.createElement('div');
        section.id = CONFIG_SECTION_ID;
        section.className = 'content-section';
        section.innerHTML = `
            <div class="content-header">
                <h1>🎉 Configuración de Celebraciones</h1>
                <p>Personalizá los colores, mensajes y duración de tu banner de celebración</p>
            </div>

            <div class="card">
                <h3>Configuración del Banner</h3>
                <p style="color: #6B7280; margin-bottom: 1.5rem;">
                    Configurá cómo querés que se vea tu banner durante cumpleaños, aniversarios y celebraciones especiales.
                </p>

                <form id="formConfigCelebracion">
                    <div class="form-group">
                        <label for="duracionDias">Duración del Banner (días)</label>
                        <input type="number" id="duracionDias" class="form-control" min="1" max="30" value="1" required>
                        <small style="color: #6B7280;">
                            ¿Cuántos días querés mostrar el banner? Máximo 30 días. 
                            <strong>Nota:</strong> El aniversario de Cresalia siempre será solo 1 día (no configurable).
                        </small>
                    </div>

                    <div class="form-group">
                        <label for="tipoCelebracion">Tipo de Celebración</label>
                        <select id="tipoCelebracion" class="form-control" required>
                            <option value="cumpleanos_fundador">Cumpleaños del Fundador</option>
                            <option value="aniversario_negocio">Aniversario del Negocio</option>
                        </select>
                        <small style="color: #6B7280;">
                            El aniversario de Cresalia no es personalizable (colores fijos de marca).
                        </small>
                    </div>

                    <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Colores Personalizados</h4>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="colorFondo">Color de Fondo</label>
                            <input type="color" id="colorFondo" class="form-control" value="#7C3AED" style="height: 50px;">
                            <input type="text" id="colorFondoHex" class="form-control" value="#7C3AED" placeholder="#7C3AED" style="margin-top: 0.5rem;">
                        </div>

                        <div class="form-group">
                            <label for="colorTexto">Color del Texto</label>
                            <input type="color" id="colorTexto" class="form-control" value="#FFFFFF" style="height: 50px;">
                            <input type="text" id="colorTextoHex" class="form-control" value="#FFFFFF" placeholder="#FFFFFF" style="margin-top: 0.5rem;">
                        </div>

                        <div class="form-group">
                            <label for="colorAcento">Color de Acento</label>
                            <input type="color" id="colorAcento" class="form-control" value="#EC4899" style="height: 50px;">
                            <input type="text" id="colorAcentoHex" class="form-control" value="#EC4899" placeholder="#EC4899" style="margin-top: 0.5rem;">
                        </div>

                        <div class="form-group">
                            <label for="estiloBanner">Estilo del Banner</label>
                            <select id="estiloBanner" class="form-control">
                                <option value="solido">Sólido</option>
                                <option value="degradado" selected>Degradado</option>
                                <option value="con_imagen">Con Imagen</option>
                            </select>
                        </div>
                    </div>

                    <h4 style="margin-top: 2rem; margin-bottom: 1rem;">Mensajes Personalizados</h4>

                    <div class="form-group">
                        <label for="mensajeBienvenida">Mensaje de Bienvenida</label>
                        <textarea id="mensajeBienvenida" class="form-control" rows="3" placeholder="¡Felicidades y bienvenido, [nombre]! 🎂"></textarea>
                        <small style="color: #6B7280;">Usá [nombre] para que se reemplace automáticamente por el nombre de tu tienda.</small>
                    </div>

                    <div class="form-group">
                        <label for="mensajeSubtitulo">Subtítulo / Mensaje Secundario</label>
                        <textarea id="mensajeSubtitulo" class="form-control" rows="2" placeholder="Sabemos que sos una persona luchadora e increíble. Hoy merecés un descanso lleno de cosas lindas."></textarea>
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="aplicarEnTienda" checked>
                            Aplicar colores en la página pública de la tienda
                        </label>
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="aplicarEnPortada" checked>
                            Aplicar colores en la portada de Cresalia
                        </label>
                    </div>

                    <div class="alert alert-info" style="margin-top: 1.5rem;">
                        <strong>💡 Tip:</strong> Los colores personalizados se aplicarán automáticamente durante el mes de tu celebración. 
                        También podés usarlos en el sistema de bienestar emocional.
                    </div>

                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar Configuración
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="cargarConfiguracionCelebracion()">
                            <i class="fas fa-sync"></i> Cargar Configuración Actual
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="previewBannerCelebracion()">
                            <i class="fas fa-eye"></i> Vista Previa
                        </button>
                    </div>

                    <div id="feedbackConfigCelebracion" style="margin-top: 1rem;"></div>
                </form>
            </div>
        `;

        configSection = section;
        configurarEventosFormulario();
        return section;
    }

    function configurarEventosFormulario() {
        const form = document.getElementById('formConfigCelebracion');
        if (!form) return;

        // Sincronizar color picker con input de texto
        ['colorFondo', 'colorTexto', 'colorAcento'].forEach(id => {
            const picker = document.getElementById(id);
            const hexInput = document.getElementById(id + 'Hex');
            if (picker && hexInput) {
                picker.addEventListener('input', () => {
                    hexInput.value = picker.value;
                });
                hexInput.addEventListener('input', () => {
                    if (/^#[0-9A-F]{6}$/i.test(hexInput.value)) {
                        picker.value = hexInput.value;
                    }
                });
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarConfiguracionCelebracion();
        });
    }

    async function guardarConfiguracionCelebracion() {
        const feedback = document.getElementById('feedbackConfigCelebracion');
        if (feedback) {
            feedback.innerHTML = '<div class="alert alert-info">Guardando configuración...</div>';
        }

        const config = {
            tipo_celebracion: document.getElementById('tipoCelebracion').value,
            duracion_dias: parseInt(document.getElementById('duracionDias').value) || 1,
            color_fondo: document.getElementById('colorFondo').value,
            color_texto: document.getElementById('colorTexto').value,
            color_acento: document.getElementById('colorAcento').value,
            estilo_banner: document.getElementById('estiloBanner').value,
            mensaje_bienvenida: document.getElementById('mensajeBienvenida').value,
            mensaje_subtitulo: document.getElementById('mensajeSubtitulo').value,
            aplicar_en_tienda: document.getElementById('aplicarEnTienda').checked,
            aplicar_en_portada: document.getElementById('aplicarEnPortada').checked
        };

        const resultado = await guardarConfiguracion(config);

        if (feedback) {
            if (resultado.success) {
                feedback.innerHTML = '<div class="alert alert-success">✅ Configuración guardada correctamente!</div>';
            } else {
                feedback.innerHTML = `<div class="alert alert-danger">❌ Error: ${resultado.message || 'No se pudo guardar la configuración'}</div>`;
            }
        }
    }

    async function cargarConfiguracionCelebracion() {
        const config = await cargarConfiguracionActual();
        if (!config) {
            alert('No se encontró configuración guardada. Usá los valores por defecto o creá una nueva.');
            return;
        }

        if (document.getElementById('tipoCelebracion')) {
            document.getElementById('tipoCelebracion').value = config.tipo_celebracion || 'cumpleanos_fundador';
        }
        if (document.getElementById('duracionDias')) {
            document.getElementById('duracionDias').value = config.duracion_dias || 1;
        }
        if (document.getElementById('colorFondo')) {
            document.getElementById('colorFondo').value = config.color_fondo || '#7C3AED';
            document.getElementById('colorFondoHex').value = config.color_fondo || '#7C3AED';
        }
        if (document.getElementById('colorTexto')) {
            document.getElementById('colorTexto').value = config.color_texto || '#FFFFFF';
            document.getElementById('colorTextoHex').value = config.color_texto || '#FFFFFF';
        }
        if (document.getElementById('colorAcento')) {
            document.getElementById('colorAcento').value = config.color_acento || '#EC4899';
            document.getElementById('colorAcentoHex').value = config.color_acento || '#EC4899';
        }
        if (document.getElementById('estiloBanner')) {
            document.getElementById('estiloBanner').value = config.estilo_banner || 'degradado';
        }
        if (document.getElementById('mensajeBienvenida')) {
            document.getElementById('mensajeBienvenida').value = config.mensaje_bienvenida || '';
        }
        if (document.getElementById('mensajeSubtitulo')) {
            document.getElementById('mensajeSubtitulo').value = config.mensaje_subtitulo || '';
        }
        if (document.getElementById('aplicarEnTienda')) {
            document.getElementById('aplicarEnTienda').checked = config.aplicar_en_tienda !== false;
        }
        if (document.getElementById('aplicarEnPortada')) {
            document.getElementById('aplicarEnPortada').checked = config.aplicar_en_portada !== false;
        }

        alert('✅ Configuración cargada correctamente!');
    }

    function previewBannerCelebracion() {
        const colorFondo = document.getElementById('colorFondo').value;
        const colorTexto = document.getElementById('colorTexto').value;
        const colorAcento = document.getElementById('colorAcento').value;
        const estilo = document.getElementById('estiloBanner').value;
        const mensaje = document.getElementById('mensajeBienvenida').value || '¡Felicidades y bienvenido, [nombre]! 🎂';

        const preview = window.open('', 'previewBanner', 'width=800,height=600');
        preview.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Vista Previa - Banner de Celebración</title>
                <style>
                    body {
                        margin: 0;
                        padding: 40px;
                        font-family: 'Inter', sans-serif;
                        background: #F3F4F6;
                    }
                    .banner-preview {
                        background: ${estilo === 'degradado' ? `linear-gradient(135deg, ${colorFondo} 0%, ${colorAcento} 100%)` : colorFondo};
                        color: ${colorTexto};
                        padding: 60px 40px;
                        border-radius: 16px;
                        text-align: center;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    }
                    .banner-preview h2 {
                        font-size: 2rem;
                        margin-bottom: 1rem;
                    }
                    .banner-preview p {
                        font-size: 1.1rem;
                        opacity: 0.9;
                    }
                </style>
            </head>
            <body>
                <div class="banner-preview">
                    <h2>${mensaje.replace('[nombre]', 'Tu Tienda')}</h2>
                    <p>Sabemos que sos una persona luchadora e increíble. Hoy merecés un descanso lleno de cosas lindas.</p>
                </div>
            </body>
            </html>
        `);
    }

    // Exponer funciones globalmente
    window.cargarConfiguracionCelebracion = cargarConfiguracionCelebracion;
    window.previewBannerCelebracion = previewBannerCelebracion;

    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', () => {
        // Solo crear el panel si estamos en el admin de la tienda
        if (document.querySelector('.admin-container')) {
            crearPanelConfiguracion();
        }
    });

    // Exportar para uso en otros scripts
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { crearPanelConfiguracion, cargarConfiguracionCelebracion, guardarConfiguracionCelebracion };
    }
})();

