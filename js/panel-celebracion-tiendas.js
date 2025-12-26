(function () {
    const banner = document.getElementById('celebracionBanner');
    if (!banner) return;

    const HIDE_KEY_PREFIX = 'cresalia_celebracion_oculta_hasta';

    const DEFAULT_COLORS = {
        cumpleanos_fundador: { fondo: '#EC4899', texto: '#FFFFFF', acento: '#7C3AED' },
        aniversario_negocio: { fondo: '#0EA5E9', texto: '#FFFFFF', acento: '#10B981' },
        aniversario_cresalia: { fondo: '#7C3AED', texto: '#FFFFFF', acento: '#EC4899' }
    };

    document.addEventListener('DOMContentLoaded', () => {
        try {
            inicializarBannerCelebracion();
        } catch (error) {
            console.warn('Celebración Cresalia - error inicializando:', error);
        }
    });

    function obtenerIdentificadoresTienda() {
        const configCompleta = JSON.parse(localStorage.getItem('configuracion_tienda_completa') || '{}');
        const tiendaActual = JSON.parse(localStorage.getItem('tienda_actual') || '{}');
        const info = configCompleta.informacionTienda || {};

        const slug = info.slug || tiendaActual.slug || tiendaActual.subdomain || 'demo-store';
        const email = (info.email || tiendaActual.email || '').toLowerCase();
        const nombre = info.nombre || tiendaActual.nombre_tienda || 'Tu tienda';
        const id = info.id || tiendaActual.id || null;
        const tipoNegocio = (info.tipoNegocio || 'tienda').toLowerCase();

        return { slug, email, nombre, id, tipoNegocio };
    }

    function yaEstaOculto(slug) {
        const clave = `${HIDE_KEY_PREFIX}_${slug}`;
        const ocultoHasta = localStorage.getItem(clave);
        if (!ocultoHasta) return false;
        return new Date(ocultoHasta) > new Date();
    }

    function guardarOculto(slug, dias) {
        const clave = `${HIDE_KEY_PREFIX}_${slug}`;
        const hasta = new Date();
        hasta.setDate(hasta.getDate() + dias);
        localStorage.setItem(clave, hasta.toISOString());
    }

    async function inicializarBannerCelebracion() {
        const { slug, email, nombre, tipoNegocio } = obtenerIdentificadoresTienda();

        if (!slug && !email) return;
        if (yaEstaOculto(slug)) return;

        const params = new URLSearchParams({ tipo: tipoNegocio === 'servicio' ? 'servicio' : 'tienda' });
        if (slug) params.append('slug', slug);
        if (email) params.append('email', email);

        const baseUrl = (window.location.protocol === 'file:') ? 'https://cresalia-web.vercel.app' : '';

        try {
            const respuesta = await fetch(`${baseUrl}/api/celebraciones?tipo=aniversario&action=celebracion&${params.toString()}`);
            if (!respuesta.ok) {
                // Silenciar error 404 (API no implementada aún)
                if (respuesta.status === 404) {
                    return;
                }
                const texto = await respuesta.text().catch(() => '');
                console.warn('Celebración Cresalia - respuesta no OK:', respuesta.status, texto);
                return;
            }
            const data = await respuesta.json().catch(() => null);
            if (!data) {
                console.warn('Celebración Cresalia - respuesta vacía');
                return;
            }
            procesarRespuestaCelebracion(data, { slug, nombre, tipoNegocio });
        } catch (error) {
            console.warn('Celebración Cresalia - no se pudo obtener datos:', error.message);
        }
    }

    function procesarRespuestaCelebracion(data, contexto) {
        if (!data || !Array.isArray(data.celebraciones) || data.celebraciones.length === 0) {
            return;
        }

        const celebracion = data.celebraciones[0];
        const colores = obtenerColores(celebracion);
        const titulo = (celebracion.titulo || '¡Felicidades y bienvenido, [nombre]!').replace('[nombre]', contexto.nombre);
        const subtitulo = celebracion.subtitulo || 'Sabemos que sos una persona luchadora e increíble. Hoy merecés un descanso lleno de cosas lindas.';
        const mensaje = celebracion.mensaje || 'Respirá, las cosas buenas van a llegar. Estamos acá para acompañarte.';
        const icono = celebracion.icono || '🎉';

        banner.style.display = 'block';
        banner.style.background = crearFondo(colores);
        banner.style.color = colores.texto || '#FFFFFF';
        banner.innerHTML = crearContenidoHTML({ icono, titulo, subtitulo, mensaje, celebracion });

        if (colores.texto) {
            banner.querySelectorAll('.celebracion-actions button.secondary').forEach(btn => {
                btn.style.color = colores.texto;
            });
        }

        configurarAccionesBanner(banner, celebracion, colores, contexto.slug);
        aplicarColoresBienestar(data.bienestar);
    }

    function obtenerColores(celebracion) {
        const tipo = celebracion.tipo || 'cumpleanos_fundador';
        const colores = celebracion.colores || {};
        const defaults = DEFAULT_COLORS[tipo] || DEFAULT_COLORS.cumpleanos_fundador;

        return {
            fondo: colores.fondo || defaults.fondo,
            texto: colores.texto || defaults.texto,
            acento: colores.acento || defaults.acento,
            secundario: colores.secundario || defaults.acento
        };
    }

    function crearFondo(colores) {
        if (colores.gradientePersonalizado) {
            return colores.gradientePersonalizado;
        }
        return `linear-gradient(135deg, ${colores.fondo || '#7C3AED'} 0%, ${colores.acento || '#EC4899'} 100%)`;
    }

    function crearContenidoHTML({ icono, titulo, subtitulo, mensaje, celebracion }) {
        const combosHTML = crearBloqueCombos(celebracion.combosDestacados || []);
        const metricasHTML = crearBloqueMetricas(celebracion.metricas || []);

        return `
            <button class="celebracion-close" data-action="ocultar-hoy" title="Ocultar por hoy">
                <i class="fas fa-times"></i>
            </button>
            <div class="celebracion-header">
                <div class="celebracion-badge">${icono} ${celebracion.etiqueta || 'Celebración Cresalia'}</div>
                <h2>${titulo}</h2>
                <p>${subtitulo}</p>
                <p style="margin-top:0.75rem;">${mensaje}</p>
            </div>
            ${combosHTML}
            ${metricasHTML}
            <div class="celebracion-actions">
                <button class="secondary" data-action="ideas-promos"><i class="fas fa-lightbulb"></i> Ver ideas para nuevas promos</button>
                <button class="secondary" data-action="mentorías"><i class="fas fa-hands-helping"></i> Buscar mentorías</button>
                <button class="secondary" data-action="bienestar"><i class="fas fa-heart"></i> Necesito un respiro</button>
                <button class="link" data-action="ocultar-hoy">Ocultar por hoy</button>
                <button class="link" data-action="ocultar-15">No mostrar por 15 días</button>
            </div>
        `;
    }

    function crearBloqueCombos(combos) {
        if (!Array.isArray(combos) || combos.length === 0) return '';

        const primeros = combos.slice(0, 2).map(combo => `
            <div class="celebracion-metrica-card">
                <span>${combo.titulo || 'Combo especial'}</span>
                <small>${combo.descripcion || 'Promoción especial por tu celebración.'}</small>
            </div>
        `).join('');

        if (!primeros) return '';
        return `<div class="celebracion-metricas">${primeros}</div>`;
    }

    function crearBloqueMetricas(metricas) {
        if (!Array.isArray(metricas) || metricas.length === 0) return '';
        const items = metricas.map(item => `
            <div class="celebracion-metrica-card">
                <span>${item.valor || '—'}</span>
                <small>${item.label || ''}</small>
            </div>
        `).join('');
        return `<div class="celebracion-metricas">${items}</div>`;
    }

    function configurarAccionesBanner(contenedor, celebracion, colores, slug) {
        contenedor.querySelectorAll('[data-action="ideas-promos"]').forEach(btn => {
            btn.addEventListener('click', () => {
                mostrarIdeasPromos(celebracion);
            });
        });

        contenedor.querySelectorAll('[data-action="mentorías"]').forEach(btn => {
            btn.addEventListener('click', abrirMentorias);
        });

        contenedor.querySelectorAll('[data-action="bienestar"]').forEach(btn => {
            mostrarSistemaBienestar();
        });

        contenedor.querySelectorAll('[data-action="ocultar-hoy"]').forEach(btn => {
            btn.addEventListener('click', () => {
                guardarOculto(slug, 1);
                cerrarBannerCelebracion();
            });
        });

        contenedor.querySelectorAll('[data-action="ocultar-15"]').forEach(btn => {
            btn.addEventListener('click', () => {
                guardarOculto(slug, 15);
                cerrarBannerCelebracion();
            });
        });
    }

    function cerrarBannerCelebracion() {
        banner.style.display = 'none';
    }

    function mostrarIdeasPromos(celebracion) {
        const mensaje = celebracion?.mensajeIdeas || 'Estamos preparando un laboratorio de ideas para potenciar tus promociones. Mientras tanto, podés visitar la Comunidad de Vendedores para inspiración inmediata.';
        alert(mensaje);
    }

    function abrirMentorias() {
        window.open('../../panel-comunidad-vendedores.html', '_blank');
    }

    function aplicarColoresBienestar(bienestar) {
        if (!bienestar || !bienestar.colores) return;
        const widget = document.getElementById('widgetBienestar');
        if (widget) {
            widget.style.background = `linear-gradient(135deg, ${bienestar.colores.color_principal || '#EC4899'}, ${bienestar.colores.color_secundario || '#F9A8D4'})`;
            widget.querySelectorAll('button').forEach(btn => {
                btn.style.color = bienestar.colores.color_principal || '#EC4899';
            });
        }
    }
})();


