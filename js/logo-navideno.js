// ===== SISTEMA DE LOGO NAVIDEÑO =====
// Agrega un gorro navideño al logo durante la temporada festiva

(function() {
    'use strict';
    
    // Verificar si estamos en temporada navideña (20 dic - 7 ene)
    function esTemporadaNavidena() {
        const ahora = new Date();
        const año = ahora.getFullYear();
        const mes = ahora.getMonth(); // 0-11 (0 = enero)
        const dia = ahora.getDate();
        
        // 20 de diciembre - 7 de enero
        const fechaInicio = new Date(año, 11, 20); // 20 de diciembre
        const fechaFin = new Date(año + 1, 0, 7); // 7 de enero del año siguiente
        
        return ahora >= fechaInicio && ahora <= fechaFin;
    }
    
    // Aplicar clase navideña a los logos
    function aplicarLogoNavideno() {
        if (!esTemporadaNavidena()) {
            return; // No hacer nada si no es temporada navideña
        }
        
        // Buscar todos los logos
        const logos = document.querySelectorAll(
            '.logo-image, .logo-container img, .navbar-logo-img, img[src*="logo-cresalia"], .navbar-brand img'
        );
        
        logos.forEach(logo => {
            // Agregar clase para activar el CSS
            if (logo.parentElement) {
                logo.parentElement.classList.add('logo-container');
            }
            logo.classList.add('logo-navideno-activo');
            
            // Asegurar posición relativa
            if (getComputedStyle(logo).position === 'static') {
                logo.style.position = 'relative';
            }
            
            // Agregar centro del moño (círculo dorado)
            if (!logo.parentElement.querySelector('.logo-navideno-centro')) {
                const centro = document.createElement('span');
                centro.className = 'logo-navideno-centro';
                logo.parentElement.appendChild(centro);
            }
        });
        
        // Para logos principales (más grandes)
        const logosPrincipales = document.querySelectorAll(
            '.navbar-brand .logo-image, .hero .logo-image, .header-logo'
        );
        logosPrincipales.forEach(logo => {
            if (logo.parentElement) {
                logo.parentElement.classList.add('logo-principal-navideno');
            }
        });
        
        // Actualizar favicon dinámicamente con gorro navideño (usando canvas)
        actualizarFaviconNavideno();
        
        console.log('🎄 Logo navideño activado');
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarLogoNavideno);
    } else {
        aplicarLogoNavideno();
    }
    
    // Re-aplicar si se carga contenido dinámicamente
    const observer = new MutationObserver(() => {
        aplicarLogoNavideno();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Función para actualizar el favicon con moño navideño
    function actualizarFaviconNavideno() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = '/assets/logo/logo-cresalia.png';
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = 64; // Tamaño del favicon
            canvas.width = size;
            canvas.height = size;
            
            // Dibujar el logo
            ctx.drawImage(img, 0, 0, size, size);
            
            // Dibujar moño navideño - Lazo izquierdo
            const moñoSize = 12;
            const moñoY = 5;
            
            // Lazo izquierdo
            ctx.fillStyle = '#DC2626';
            ctx.beginPath();
            ctx.ellipse(size / 2 - 8, moñoY, moñoSize, moñoSize * 1.2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Lazo derecho
            ctx.beginPath();
            ctx.ellipse(size / 2 + 8, moñoY, moñoSize, moñoSize * 1.2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Centro dorado del moño
            ctx.fillStyle = '#FCD34D';
            ctx.beginPath();
            ctx.arc(size / 2, moñoY, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Sombra del centro
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(size / 2, moñoY + 1, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Actualizar favicon
            const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/png';
            link.rel = 'shortcut icon';
            link.href = canvas.toDataURL();
            
            // Remover favicon anterior si existe
            const oldLink = document.querySelector("link[rel*='icon']");
            if (oldLink && oldLink !== link) {
                oldLink.remove();
            }
            
            document.getElementsByTagName('head')[0].appendChild(link);
            
            // También actualizar apple-touch-icon
            const appleLink = document.querySelector("link[rel*='apple-touch-icon']") || document.createElement('link');
            appleLink.rel = 'apple-touch-icon';
            appleLink.href = canvas.toDataURL();
            document.getElementsByTagName('head')[0].appendChild(appleLink);
        };
        
        img.onerror = function() {
            console.warn('⚠️ No se pudo cargar el logo para el favicon navideño');
        };
    }
    
    // Exportar función para uso manual si es necesario
    window.aplicarLogoNavideno = aplicarLogoNavideno;
    window.actualizarFaviconNavideno = actualizarFaviconNavideno;
})();
