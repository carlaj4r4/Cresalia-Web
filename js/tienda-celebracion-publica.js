/**
 * 🎉 Sistema de Celebración para Página Pública de Tienda
 * Muestra banner de celebración con colores personalizados cuando la tienda está de cumpleaños/aniversario
 */

(function() {
    'use strict';

    const banner = document.getElementById('celebracionBannerTienda');
    const heroSection = document.getElementById('heroSectionTienda');
    if (!banner || !heroSection) return;

    const DEFAULT_COLORS = {
        cumpleanos_fundador: { fondo: '#EC4899', texto: '#FFFFFF', acento: '#7C3AED' },
        aniversario_negocio: { fondo: '#0EA5E9', texto: '#FFFFFF', acento: '#10B981' },
        aniversario_cresalia: { fondo: '#7C3AED', texto: '#FFFFFF', acento: '#EC4899' }
    };

    document.addEventListener('DOMContentLoaded', () => {
        try {
            inicializarCelebracionPublica();
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
        const tipoNegocio = (info.tipoNegocio || 'tienda').toLowerCase();

        return { slug, email, nombre, tipoNegocio };
    }

    async function inicializarCelebracionPublica() {
        const { slug, email, nombre, tipoNegocio } = obtenerIdentificadoresTienda();

        if (!slug && !email) return;

        const baseUrl = window.location.protocol === 'file:' 
            ? 'https://cresalia-web.vercel.app' 
            : '';

        const params = new URLSearchParams({ tipo: tipoNegocio === 'servicio' ? 'servicio' : 'tienda' });
        if (slug) params.append('slug', slug);
        if (email) params.append('email', email);

        try {
            const respuesta = await fetch(`${baseUrl}/api/celebraciones?tipo=aniversario&action=celebracion&${params.toString()}`);
            if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
            const data = await respuesta.json();
            
            if (data && Array.isArray(data.celebraciones) && data.celebraciones.length > 0) {
                procesarCelebracionPublica(data.celebraciones[0], { nombre, tipoNegocio });
            }
        } catch (error) {
            console.warn('Celebración Cresalia - no se pudo obtener datos:', error.message);
        }
    }

    function procesarCelebracionPublica(celebracion, contexto) {
        const colores = obtenerColores(celebracion);
        const titulo = (celebracion.titulo || '¡Celebramos con [nombre]!').replace('[nombre]', contexto.nombre);
        const mensaje = celebracion.mensaje || 'Estamos de celebración. ¡Sumate a festejar con nosotros!';
        const icono = celebracion.icono || '🎉';

        // Aplicar colores al hero section
        if (colores.fondo) {
            heroSection.style.background = crearFondo(colores);
            heroSection.style.color = colores.texto || '#FFFFFF';
        }

        // Mostrar banner de celebración
        banner.style.display = 'block';
        banner.style.background = crearFondo(colores);
        banner.style.color = colores.texto || '#FFFFFF';
        banner.style.padding = '2rem';
        banner.style.textAlign = 'center';
        banner.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        banner.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${icono}</div>
                <h2 style="margin-bottom: 1rem; font-size: 2rem; font-weight: 700;">${titulo}</h2>
                <p style="font-size: 1.2rem; opacity: 0.95;">${mensaje}</p>
                ${celebracion.combosDestacados && celebracion.combosDestacados.length > 0 
                    ? `<div style="margin-top: 1.5rem;">
                        <p style="font-size: 1rem; opacity: 0.9;">🎁 Combos especiales disponibles</p>
                      </div>`
                    : ''}
            </div>
        `;

        // Animación suave
        banner.style.animation = 'slideInUp 0.8s ease-out';
    }

    function obtenerColores(celebracion) {
        const tipo = celebracion.tipo || 'cumpleanos_fundador';
        const colores = celebracion.colores || {};
        const defaults = DEFAULT_COLORS[tipo] || DEFAULT_COLORS.cumpleanos_fundador;

        return {
            fondo: colores.fondo || defaults.fondo,
            texto: colores.texto || defaults.texto,
            acento: colores.acento || defaults.acento
        };
    }

    function crearFondo(colores) {
        if (colores.gradientePersonalizado) {
            return colores.gradientePersonalizado;
        }
        return `linear-gradient(135deg, ${colores.fondo || '#7C3AED'} 0%, ${colores.acento || '#EC4899'} 100%)`;
    }
})();


