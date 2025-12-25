/**
 * Sistema de Tema Festivo Temporal para Cresalia
 * Se activa automáticamente del 20 de diciembre al 7 de enero
 */

(function() {
    'use strict';

    /**
     * Verifica si estamos en temporada festiva
     * Temporada: 20 de diciembre - 7 de enero
     */
    function esTemporadaFestiva() {
        const ahora = new Date();
        const mes = ahora.getMonth(); // 0-11 (diciembre = 11, enero = 0)
        const dia = ahora.getDate();
        
        // Del 20 de diciembre (mes 11, día 20) al 31 de diciembre
        if (mes === 11 && dia >= 20) {
            return true;
        }
        
        // Del 1 de enero (mes 0, día 1) al 7 de enero
        if (mes === 0 && dia <= 7) {
            return true;
        }
        
        return false;
    }

    /**
     * Permite forzar la activación del tema festivo (útil para testing)
     * Puede forzarse agregando ?festivo=true en la URL
     */
    function debeForzarFestivo() {
        const params = new URLSearchParams(window.location.search);
        return params.get('festivo') === 'true' || 
               localStorage.getItem('cresalia-festivo-forzar') === 'true';
    }

    /**
     * Aplica el tema festivo inyectando el CSS
     */
    function aplicarTemaFestivo() {
        // Verificar si ya se aplicó
        if (document.getElementById('tema-festivo-css')) {
            return;
        }

        // Determinar la ruta correcta según la ubicación de la página
        // Para comunidades: ../../css/tema-festivo-temporada.css
        // Para páginas principales: css/tema-festivo-temporada.css
        let cssPath = 'css/tema-festivo-temporada.css';
        
        // Detectar si estamos en una comunidad (buscar scripts que usen rutas ../../)
        const scripts = document.querySelectorAll('script[src]');
        for (let script of scripts) {
            const src = script.getAttribute('src');
            if (src && src.includes('../../')) {
                cssPath = '../../css/tema-festivo-temporada.css';
                break;
            }
        }
        
        // También verificar si ya hay algún link CSS con rutas relativas de comunidades
        const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
        for (let link of existingLinks) {
            const href = link.getAttribute('href');
            if (href && (href.includes('../../css/') || href.includes('../../../css/'))) {
                cssPath = '../../css/tema-festivo-temporada.css';
                break;
            }
        }

        // Crear link al CSS festivo
        const link = document.createElement('link');
        link.id = 'tema-festivo-css';
        link.rel = 'stylesheet';
        link.href = cssPath;
        link.type = 'text/css';
        
        // Agregar al head
        document.head.appendChild(link);
        
        // Agregar clase al body para referencia CSS adicional si es necesario
        document.body.classList.add('tema-festivo-activo');
        
        console.log('🎄✨ Tema festivo activado - Felices fiestas!');
    }

    /**
     * Remueve el tema festivo (si está forzado y se quiere desactivar)
     */
    function removerTemaFestivo() {
        const link = document.getElementById('tema-festivo-css');
        if (link) {
            link.remove();
        }
        document.body.classList.remove('tema-festivo-activo');
        console.log('🎄 Tema festivo desactivado');
    }

    /**
     * Inicializa el sistema de tema festivo
     */
    function inicializarTemaFestivo() {
        // Verificar si debemos aplicar el tema
        if (esTemporadaFestiva() || debeForzarFestivo()) {
            aplicarTemaFestivo();
        } else {
            // Si no es temporada, remover si está activo (por si quedó forzado)
            removerTemaFestivo();
        }
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarTemaFestivo);
    } else {
        // DOM ya está listo
        inicializarTemaFestivo();
    }

    // Exponer funciones globalmente para control manual si es necesario
    window.CresaliaTemaFestivo = {
        aplicar: aplicarTemaFestivo,
        remover: removerTemaFestivo,
        esTemporada: esTemporadaFestiva,
        forzar: function() {
            localStorage.setItem('cresalia-festivo-forzar', 'true');
            aplicarTemaFestivo();
        },
        desactivarForzado: function() {
            localStorage.removeItem('cresalia-festivo-forzar');
            if (!esTemporadaFestiva()) {
                removerTemaFestivo();
            }
        },
        // Función helper para obtener la ruta correcta del CSS
        obtenerRutaCSS: function() {
            let cssPath = 'css/tema-festivo-temporada.css';
            const scripts = document.querySelectorAll('script[src]');
            for (let script of scripts) {
                const src = script.getAttribute('src');
                if (src && src.includes('../../')) {
                    cssPath = '../../css/tema-festivo-temporada.css';
                    break;
                }
            }
            return cssPath;
        }
    };

})();