// ===== ANIMACIÓN FESTIVA DE FIN DE AÑO =====
// Se desactiva automáticamente después del 7 de enero

(function() {
    'use strict';
    
    // Configuración - Fecha de expiración (7 de enero del año siguiente)
    const FECHA_EXPIRACION = new Date(new Date().getFullYear() + 1, 0, 7); // 7 de enero
    const FECHA_INICIO = new Date(new Date().getFullYear(), 11, 20); // 20 de diciembre
    
    // Verificar si estamos en temporada festiva
    const ahora = new Date();
    if (ahora < FECHA_INICIO || ahora > FECHA_EXPIRACION) {
        return; // No mostrar si no estamos en temporada festiva
    }
    
    // Verificar si el usuario ya cerró la animación en esta sesión
    if (sessionStorage.getItem('animacionFiestasCerrada') === 'true') {
        return;
    }
    
    // Crear el componente festivo
    function crearAnimacionFiestas() {
        const overlay = document.createElement('div');
        overlay.id = 'animacion-fiestas-overlay';
        overlay.innerHTML = `
            <div class="animacion-fiestas-container">
                <div class="animacion-fiestas-content">
                    <button class="cerrar-animacion-fiestas" onclick="cerrarAnimacionFiestas()" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="animacion-fiestas-header">
                        <div class="estrellas-animadas">
                            <span class="estrella">⭐</span>
                            <span class="estrella">✨</span>
                            <span class="estrella">🌟</span>
                            <span class="estrella">⭐</span>
                            <span class="estrella">✨</span>
                        </div>
                        <h1 class="titulo-fiestas">¡Felices Fiestas!</h1>
                        <div class="estrellas-animadas">
                            <span class="estrella">⭐</span>
                            <span class="estrella">✨</span>
                            <span class="estrella">🌟</span>
                            <span class="estrella">⭐</span>
                            <span class="estrella">✨</span>
                        </div>
                    </div>
                    
                    <div class="animacion-fiestas-mensaje">
                        <p class="mensaje-principal">
                            No importa cómo fue tu año, cada experiencia fue un paso hacia adelante.
                        </p>
                        <p class="mensaje-secundario">
                            Te esperan cosas increíbles, años increíbles llenos de oportunidades y crecimiento.
                        </p>
                        <p class="mensaje-terciario">
                            Desde Cresalia, te deseamos un 2025 lleno de éxitos, aprendizaje y momentos especiales. 🌟
                        </p>
                    </div>
                    
                    <div class="animacion-fiestas-footer">
                        <div class="confetti-container">
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                            <div class="confetti"></div>
                        </div>
                        <button class="btn-continuar" onclick="cerrarAnimacionFiestas()">
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Animar entrada
        setTimeout(() => {
            overlay.classList.add('mostrar');
        }, 100);
        
        // Auto-cerrar después de 8 segundos si no se cierra manualmente
        setTimeout(() => {
            if (document.getElementById('animacion-fiestas-overlay')) {
                cerrarAnimacionFiestas();
            }
        }, 8000);
    }
    
    // Función para cerrar la animación
    window.cerrarAnimacionFiestas = function() {
        const overlay = document.getElementById('animacion-fiestas-overlay');
        if (overlay) {
            overlay.classList.add('ocultar');
            sessionStorage.setItem('animacionFiestasCerrada', 'true');
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }
    };
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', crearAnimacionFiestas);
    } else {
        crearAnimacionFiestas();
    }
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('animacion-fiestas-overlay')) {
            cerrarAnimacionFiestas();
        }
    });
})();
