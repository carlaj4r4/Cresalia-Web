// ==================== CONFIGURACIÓN DE TIENDA ====================

// Configuración específica de la tienda
const TIENDA_CONFIG = {
    slug: '{{SLUG_TIENDA}}',
    nombre: '{{NOMBRE_TIENDA}}',
    descripcion: '{{DESCRIPCION_TIENDA}}',
    contacto: {
        email: '{{EMAIL_TIENDA}}',
        telefono: '{{TELEFONO_TIENDA}}',
        whatsapp: '{{WHATSAPP_TIENDA}}'
    },
    ubicacion: {
        direccion: '{{DIRECCION_TIENDA}}',
        ciudad: '{{CIUDAD_TIENDA}}',
        pais: '{{PAIS_TIENDA}}',
        coordenadas: {
            lat: '{{LATITUD_TIENDA}}',
            lng: '{{LONGITUD_TIENDA}}'
        }
    },
    envios: {
        costo: '{{COSTO_ENVIO}}',
        gratis_desde: '{{ENVIO_GRATIS_DESDE}}'
    },
    pagos: {
        online: '{{PERMITE_PAGOS_ONLINE}}',
        efectivo: '{{PERMITE_PAGOS_EFECTIVO}}'
    },
    colores: {
        primario: '{{COLOR_PRIMARIO}}',
        secundario: '{{COLOR_SECUNDARIO}}',
        acento: '{{COLOR_ACENTO}}'
    }
};

// ==================== INICIALIZACIÓN DE LA TIENDA ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏪 Inicializando tienda:', TIENDA_CONFIG.nombre);
    
    // Aplicar colores personalizados
    aplicarColoresTienda();
    
    // Cargar productos de la tienda
    cargarProductosTienda();
    
    // Inicializar mapa de la tienda
    inicializarMapaTienda();
    
    // Configurar carrito específico de la tienda
    configurarCarritoTienda();
    
    // Inicializar chatbot IA si está disponible
    inicializarChatbotIA();
    
    // Inicializar chatbot dinámico
    inicializarChatbotDinamico();
    
    // Inicializar sistema de respaldo emocional
    inicializarRespaldoEmocional();
    
    // Inicializar sistema de soporte técnico
    inicializarSoporteTecnico();
    
    // Inicializar sistema de historial de crecimiento
    inicializarHistorialCrecimiento();
    
    // Inicializar sistema de actualización automática
    inicializarActualizacionAutomatica();
});

// ==================== FUNCIONES DE LA TIENDA ====================

function aplicarColoresTienda() {
    const root = document.documentElement;
    root.style.setProperty('--primary-purple', TIENDA_CONFIG.colores.primario);
    root.style.setProperty('--secondary-purple', TIENDA_CONFIG.colores.secundario);
    root.style.setProperty('--pink-accent', TIENDA_CONFIG.colores.acento);
}

async function cargarProductosTienda() {
    try {
        const response = await fetch(`/api/${TIENDA_CONFIG.slug}/productos`);
        const productos = await response.json();
        
        const productosGrid = document.getElementById('productosGrid');
        if (productosGrid && productos.length > 0) {
            productosGrid.innerHTML = productos.map(producto => `
                <div class="producto-card">
                    <div class="producto-imagen">
                        <img src="${producto.imagen_principal}" alt="${producto.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f1f5f9%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22>${producto.nombre}</text></svg>'">
                        <div class="producto-overlay">
                            <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.id}')">
                                <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                            </button>
                        </div>
                    </div>
                    <div class="producto-info">
                        <h4>${producto.nombre}</h4>
                        <p>${producto.descripcion}</p>
                        <div class="producto-precio">
                            <span class="precio-actual">$${producto.precio.toLocaleString()}</span>
                            ${producto.precio_anterior ? `<span class="precio-anterior">$${producto.precio_anterior.toLocaleString()}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        } else if (productosGrid) {
            productosGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-box fa-3x text-muted mb-3"></i>
                    <h4>Próximamente</h4>
                    <p class="text-muted">Los productos de esta tienda aparecerán aquí pronto</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function inicializarMapaTienda() {
    const mapaContainer = document.getElementById('mapa-tienda');
    if (mapaContainer && TIENDA_CONFIG.ubicacion.coordenadas.lat) {
        // Aquí se inicializaría Google Maps con las coordenadas de la tienda
        console.log('🗺️ Mapa de la tienda inicializado:', TIENDA_CONFIG.ubicacion);
    }
}

function configurarCarritoTienda() {
    // Configurar carrito específico para esta tienda
    window.carrito = window.carrito || [];
    window.tiendaActual = TIENDA_CONFIG.slug;
}

function inicializarChatbotIA() {
    // Verificar si el plan permite chatbot IA
    if (typeof planSystem !== 'undefined' && planSystem.isFeatureAvailable('chatbot_ia')) {
        // Configurar chatbot con datos de la tienda
        if (typeof chatbotIA !== 'undefined') {
            chatbotIA.configure({
                nombre: `${TIENDA_CONFIG.nombre} AI`,
                color_primario: TIENDA_CONFIG.colores.primario,
                color_secundario: TIENDA_CONFIG.colores.secundario,
                mensaje_bienvenida: `¡Hola! Soy el asistente virtual de ${TIENDA_CONFIG.nombre}. ¿En qué puedo ayudarte?`,
                activo: true
            });
            
            // Agregar conocimiento específico de la tienda
            chatbotIA.addKnowledge(
                '¿Cuál es el nombre de esta tienda?',
                `Esta es ${TIENDA_CONFIG.nombre}. ${TIENDA_CONFIG.descripcion}`,
                'tienda'
            );
            
            chatbotIA.addKnowledge(
                '¿Cómo puedo contactar la tienda?',
                `Puedes contactarnos al teléfono ${TIENDA_CONFIG.contacto.telefono}, WhatsApp ${TIENDA_CONFIG.contacto.whatsapp} o email ${TIENDA_CONFIG.contacto.email}`,
                'contacto'
            );
            
            if (TIENDA_CONFIG.ubicacion.direccion) {
                chatbotIA.addKnowledge(
                    '¿Dónde están ubicados?',
                    `Estamos ubicados en ${TIENDA_CONFIG.ubicacion.direccion}, ${TIENDA_CONFIG.ubicacion.ciudad}, ${TIENDA_CONFIG.ubicacion.pais}`,
                    'ubicacion'
                );
            }
            
            console.log('🤖 Chatbot IA inicializado para la tienda');
        }
    } else {
        console.log('ℹ️ Chatbot IA no disponible en el plan actual');
    }
}

function inicializarChatbotDinamico() {
    // El chatbot dinámico está disponible para todos los planes
    if (typeof dynamicChatbot !== 'undefined') {
        // Configurar chatbot dinámico para la tienda
        dynamicChatbot.config.tenant_id = TIENDA_CONFIG.slug;
        dynamicChatbot.config.nombre = `${TIENDA_CONFIG.nombre} AI`;
        dynamicChatbot.config.activo = true;
        
        // Cargar conocimiento dinámico
        dynamicChatbot.loadDynamicKnowledge();
        
        console.log('🤖 Chatbot dinámico inicializado para la tienda');
    }
}

function inicializarRespaldoEmocional() {
    // Verificar si el plan permite respaldo emocional (solo Free y Basic)
    if (typeof planSystem !== 'undefined' && ['free', 'basic'].includes(planSystem.currentPlan)) {
        // Configurar sistema de respaldo emocional
        if (typeof emotionalSupport !== 'undefined') {
            emotionalSupport.config.tenant_id = TIENDA_CONFIG.slug;
            emotionalSupport.config.plan = planSystem.currentPlan;
            emotionalSupport.config.activo = true;
            
            console.log('💜 Sistema de respaldo emocional activado para la tienda');
        }
    } else {
        console.log('ℹ️ Respaldo emocional solo disponible para planes Free y Basic');
    }
}

function inicializarSoporteTecnico() {
    // El soporte técnico está disponible para todos los planes
    if (typeof technicalSupport !== 'undefined') {
        // Configurar soporte técnico personalizado para la tienda
        const configPersonalizada = {
            nombre: `${TIENDA_CONFIG.nombre} - Soporte`,
            contacto: {
                telefono: TIENDA_CONFIG.contacto.telefono,
                email: TIENDA_CONFIG.contacto.email,
                whatsapp: TIENDA_CONFIG.contacto.whatsapp
            }
        };
        
        technicalSupport.configure(configPersonalizada);
        console.log('🎧 Sistema de soporte técnico personalizado activado');
    }
}

function inicializarHistorialCrecimiento() {
    // El historial de crecimiento está disponible para todos los planes
    if (typeof growthHistory !== 'undefined') {
        // Configurar historial de crecimiento para la tienda
        growthHistory.config.tenant_id = TIENDA_CONFIG.slug;
        growthHistory.config.plan = planSystem.currentPlan;
        
        console.log('📈 Sistema de historial de crecimiento activado');
    }
}

function inicializarActualizacionAutomatica() {
    // El sistema de actualización automática está disponible para todos los planes
    if (typeof autoUpdate !== 'undefined') {
        // Configurar actualización automática para la tienda
        autoUpdate.config.tenant_id = TIENDA_CONFIG.slug;
        autoUpdate.config.enabled = true;
        
        console.log('🔄 Sistema de actualización automática activado');
    }
}

function agregarAlCarrito(productoId) {
    // Lógica específica para agregar productos al carrito de esta tienda
    console.log('🛒 Agregando producto al carrito:', productoId);
    // Implementar lógica de carrito específica de la tienda
}

function obtenerRuta() {
    if (TIENDA_CONFIG.ubicacion.coordenadas.lat) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${TIENDA_CONFIG.ubicacion.coordenadas.lat},${TIENDA_CONFIG.ubicacion.coordenadas.lng}`;
        window.open(url, '_blank');
    } else {
        alert('Dirección no disponible para obtener ruta');
    }
}

// ==================== INTEGRACIÓN CON CRESALIA ====================

// Función para conectar con el sistema principal de Cresalia
function conectarConCresalia() {
    // Enviar datos de la tienda al sistema principal
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            type: 'TIENDA_LOADED',
            data: TIENDA_CONFIG
        }, '*');
    }
}

// Llamar cuando la tienda esté completamente cargada
window.addEventListener('load', conectarConCresalia);
