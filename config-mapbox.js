// ===== CONFIGURACIÓN DE MAPBOX =====
// Lee el token de acceso desde variables de entorno o inyección en window

(function() {
    'use strict';

    const resolveToken = () => {
        if (typeof window !== 'undefined') {
            if (window.MAPBOX_ACCESS_TOKEN) {
                return window.MAPBOX_ACCESS_TOKEN;
            }
            if (window.__MAPBOX_ACCESS_TOKEN__) {
                return window.__MAPBOX_ACCESS_TOKEN__;
            }
            if (window.__ENV__ && window.__ENV__.MAPBOX_ACCESS_TOKEN) {
                return window.__ENV__.MAPBOX_ACCESS_TOKEN;
            }
        }

        if (typeof process !== 'undefined' && process.env) {
            if (process.env.MAPBOX_ACCESS_TOKEN) {
                return process.env.MAPBOX_ACCESS_TOKEN;
            }
            if (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
                return process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
            }
        }

        return null;
    };

    const MAPBOX_CONFIG = {
        accessToken: resolveToken(),
        defaultStyle: 'mapbox://styles/mapbox/light-v11'
    };

    if (!MAPBOX_CONFIG.accessToken) {
        console.warn('⚠️ MAPBOX_ACCESS_TOKEN no está configurado. Los mapas avanzados estarán limitados.');
    }

    if (typeof window !== 'undefined') {
        window.MAPBOX_CONFIG = MAPBOX_CONFIG;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MAPBOX_CONFIG;
    }
})();



