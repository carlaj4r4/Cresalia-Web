// ===== OPTIMIZADOR DE ANIMACIONES =====
// Reduce las animaciones para mejorar el rendimiento

console.log('🎬 Iniciando optimizador de animaciones...');

// Configuración de optimización - REDUCIDA
const OPTIMIZACION_ANIMACIONES = {
    reducirAnimaciones: true, // ACTIVADO
    animacionesPermitidas: 20, // Límite bajo
    duracionReducida: 100, // Duración muy corta
    easingSimplificado: 'ease-out'
};

// Función para optimizar animaciones CSS
function optimizarAnimacionesCSS() {
    console.log('🎨 Optimizando animaciones CSS...');
    
    // Crear estilos optimizados
    const estilosOptimizados = document.createElement('style');
    estilosOptimizados.id = 'animaciones-optimizadas';
    estilosOptimizados.textContent = `
        /* Animaciones optimizadas - duración reducida */
        .fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down {
            animation-duration: ${OPTIMIZACION_ANIMACIONES.duracionReducida}ms !important;
            animation-timing-function: ${OPTIMIZACION_ANIMACIONES.easingSimplificado} !important;
        }
        
        /* Reducir animaciones de hover */
        .btn, .action-card, .stat-card {
            transition-duration: 150ms !important;
        }
        
        /* Optimizar animaciones de modales */
        .modal {
            animation-duration: 200ms !important;
        }
        
        /* Reducir animaciones del widget de bienestar */
        #bienestarWidget {
            transition-duration: 150ms !important;
        }
        
        /* Optimizar animaciones de botones */
        button, .btn {
            transition: all 150ms ease-out !important;
        }
        
        /* Desactivar animaciones complejas en dispositivos lentos */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    
    // Agregar estilos al head
    document.head.appendChild(estilosOptimizados);
    console.log('✅ Animaciones CSS optimizadas');
}

// Función para limitar animaciones activas
function limitarAnimacionesActivas() {
    console.log('🔢 Limitando animaciones activas...');
    
    let animacionesActivas = 0;
    const maxAnimaciones = OPTIMIZACION_ANIMACIONES.animacionesPermitidas;
    
    // Observador para controlar animaciones
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const element = mutation.target;
                
                // Si el elemento tiene animación
                if (element.style.animation || element.style.transition) {
                    animacionesActivas++;
                    
                    // Si excede el límite, reducir animaciones
                    if (animacionesActivas > maxAnimaciones) {
                        element.style.animation = 'none';
                        element.style.transition = 'none';
                        console.log(`⚠️ Animación limitada en elemento:`, element);
                    }
                }
            }
        });
    });
    
    // Observar cambios en el DOM
    observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['style']
    });
    
    console.log(`✅ Límite de animaciones establecido: ${maxAnimaciones}`);
}

// Función para optimizar animaciones existentes
function optimizarAnimacionesExistentes() {
    console.log('🔧 Optimizando animaciones existentes...');
    
    // Buscar elementos con animaciones
    const elementosConAnimaciones = document.querySelectorAll('[class*="fade-in"], [class*="slide-in"], [class*="bounce"], [class*="pulse"]');
    
    elementosConAnimaciones.forEach((elemento, index) => {
        // Reducir delay de animaciones
        if (index > 20) { // Solo los primeros 20 elementos mantienen delay
            elemento.style.animationDelay = '0ms';
        } else {
            elemento.style.animationDelay = `${index * 50}ms`; // Delay reducido
        }
        
        // Reducir duración
        elemento.style.animationDuration = `${OPTIMIZACION_ANIMACIONES.duracionReducida}ms`;
    });
    
    console.log(`✅ ${elementosConAnimaciones.length} animaciones optimizadas`);
}

// Función para detectar dispositivos lentos
function detectarDispositivoLento() {
    console.log('📱 Detectando rendimiento del dispositivo...');
    
    // Detectar características del dispositivo
    const esDispositivoLento = (
        navigator.hardwareConcurrency < 4 || // Menos de 4 cores
        navigator.deviceMemory < 4 || // Menos de 4GB RAM
        window.innerWidth < 768 // Pantalla pequeña
    );
    
    if (esDispositivoLento) {
        console.log('⚠️ Dispositivo lento detectado - aplicando optimizaciones extremas');
        
        // Desactivar animaciones complejas
        const estilosExtremos = document.createElement('style');
        estilosExtremos.textContent = `
            * {
                animation-duration: 100ms !important;
                transition-duration: 100ms !important;
            }
            
            .fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(estilosExtremos);
        
        OPTIMIZACION_ANIMACIONES.animacionesPermitidas = 20; // Reducir aún más
    }
    
    return esDispositivoLento;
}

// Función para optimizar rendimiento en tiempo real
function monitorearRendimiento() {
    console.log('📊 Iniciando monitoreo de rendimiento...');
    
    let frameCount = 0;
    let lastTime = performance.now();
    
    function contarFrames() {
        frameCount++;
        const currentTime = performance.now();
        
        // Cada segundo, verificar FPS
        if (currentTime - lastTime >= 1000) {
            const fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
            
            // Si FPS es muy bajo, reducir animaciones
            if (fps < 30) {
                console.log(`⚠️ FPS bajo detectado: ${fps} - reduciendo animaciones`);
                
                // Desactivar animaciones adicionales
                const elementos = document.querySelectorAll('[style*="animation"]');
                elementos.forEach((el, index) => {
                    if (index > 10) { // Solo mantener las primeras 10 animaciones
                        el.style.animation = 'none';
                    }
                });
            }
        }
        
        requestAnimationFrame(contarFrames);
    }
    
    requestAnimationFrame(contarFrames);
}

// Función principal de optimización - REDUCIDA
function aplicarOptimizacionesAnimaciones() {
    console.log('🚀 [OPTIMIZACIÓN REDUCIDA] Aplicando animaciones reducidas...');
    
    // 1. Detectar dispositivo lento
    const esLento = detectarDispositivoLento();
    
    // 2. Optimizar CSS
    optimizarAnimacionesCSS();
    
    // 3. Optimizar animaciones existentes
    optimizarAnimacionesExistentes();
    
    // 4. Limitar animaciones activas
    limitarAnimacionesActivas();
    
    // 5. Monitorear rendimiento
    if (esLento) {
        monitorearRendimiento();
    }
    
    console.log('✅ Optimizaciones de animaciones aplicadas');
}

// Función para restaurar animaciones (si es necesario)
function restaurarAnimaciones() {
    console.log('🔄 Restaurando animaciones...');
    
    const estilosOptimizados = document.getElementById('animaciones-optimizadas');
    if (estilosOptimizados) {
        estilosOptimizados.remove();
    }
    
    // Restaurar delays originales
    const elementos = document.querySelectorAll('[class*="fade-in"], [class*="slide-in"]');
    elementos.forEach((elemento, index) => {
        elemento.style.animationDelay = `${index * 100}ms`;
        elemento.style.animationDuration = '500ms';
    });
    
    console.log('✅ Animaciones restauradas');
}

// Aplicar optimizaciones automáticamente
if (OPTIMIZACION_ANIMACIONES.reducirAnimaciones) {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarOptimizacionesAnimaciones);
    } else {
        aplicarOptimizacionesAnimaciones();
    }
}

// Exportar funciones para uso manual
window.optimizadorAnimaciones = {
    aplicar: aplicarOptimizacionesAnimaciones,
    restaurar: restaurarAnimaciones,
    config: OPTIMIZACION_ANIMACIONES
};

console.log('🎬 Optimizador de animaciones cargado correctamente');

