// ===== SISTEMA DE CATEGORÍAS PARA TIENDAS =====

// Categorías disponibles para que los clientes seleccionen
const categoriasDisponibles = {
    'tecnologia': {
        nombre: 'Tecnología',
        emoji: '📱',
        subcategorias: ['Smartphones', 'Laptops', 'Tablets', 'Accesorios', 'Audio', 'Gaming']
    },
    'moda': {
        nombre: 'Moda y Accesorios',
        emoji: '👗',
        subcategorias: ['Ropa', 'Calzado', 'Accesorios', 'Relojes', 'Bolsos', 'Joyería']
    },
    'hogar': {
        nombre: 'Hogar y Jardín',
        emoji: '🏠',
        subcategorias: ['Muebles', 'Decoración', 'Electrodomésticos', 'Cocina', 'Baño', 'Jardín']
    },
    'deportes': {
        nombre: 'Deportes y Fitness',
        emoji: '⚽',
        subcategorias: ['Fitness', 'Fútbol', 'Básquet', 'Running', 'Natación', 'Ciclismo']
    },
    'belleza': {
        nombre: 'Belleza y Cuidado',
        emoji: '💄',
        subcategorias: ['Maquillaje', 'Cuidado Facial', 'Cuidado Corporal', 'Cabello', 'Perfumes', 'Uñas']
    },
    'salud': {
        nombre: 'Salud y Bienestar',
        emoji: '💊',
        subcategorias: ['Suplementos', 'Cuidado Personal', 'Equipamiento Médico', 'Fitness', 'Bienestar Mental']
    },
    'alimentacion': {
        nombre: 'Alimentación',
        emoji: '🍎',
        subcategorias: ['Supermercado', 'Gourmet', 'Orgánico', 'Bebidas', 'Snacks', 'Suplementos']
    },
    'automotriz': {
        nombre: 'Automotriz',
        emoji: '🚗',
        subcategorias: ['Repuestos', 'Accesorios', 'Lubricantes', 'Neumáticos', 'Electrónica', 'Cuidado']
    },
    'libros': {
        nombre: 'Libros y Educación',
        emoji: '📚',
        subcategorias: ['Ficción', 'No Ficción', 'Educativos', 'Técnicos', 'Infantiles', 'Digitales']
    },
    'juguetes': {
        nombre: 'Juguetes y Niños',
        emoji: '🧸',
        subcategorias: ['Educativos', 'Electrónicos', 'Exterior', 'Bebés', 'Juegos de Mesa', 'Coleccionables']
    },
    'mascotas': {
        nombre: 'Mascotas',
        emoji: '🐕',
        subcategorias: ['Alimentación', 'Accesorios', 'Cuidado', 'Juguetes', 'Salud', 'Transporte']
    },
    'viajes': {
        nombre: 'Viajes y Turismo',
        emoji: '✈️',
        subcategorias: ['Equipaje', 'Accesorios de Viaje', 'Gadgets', 'Ropa de Viaje', 'Documentos', 'Seguros']
    },
    'arte': {
        nombre: 'Arte y Manualidades',
        emoji: '🎨',
        subcategorias: ['Pintura', 'Dibujo', 'Escultura', 'Textiles', 'Papelería', 'Herramientas']
    },
    'musica': {
        nombre: 'Música e Instrumentos',
        emoji: '🎵',
        subcategorias: ['Instrumentos', 'Audio', 'Partituras', 'Accesorios', 'Software', 'Merchandising']
    },
    'oficina': {
        nombre: 'Oficina y Negocios',
        emoji: '💼',
        subcategorias: ['Equipamiento', 'Papelería', 'Muebles', 'Tecnología', 'Servicios', 'Organización']
    },
    'herramientas': {
        nombre: 'Herramientas',
        emoji: '🔧',
        subcategorias: ['Eléctricas', 'Manuales', 'Jardinería', 'Automotriz', 'Medición', 'Seguridad']
    },
    'jardineria': {
        nombre: 'Jardinería',
        emoji: '🌱',
        subcategorias: ['Plantas', 'Semillas', 'Herramientas', 'Fertilizantes', 'Riego', 'Decoración']
    },
    'fotografia': {
        nombre: 'Fotografía',
        emoji: '📸',
        subcategorias: ['Cámaras', 'Lentes', 'Accesorios', 'Iluminación', 'Software', 'Impresión']
    },
    'gaming': {
        nombre: 'Gaming',
        emoji: '🎮',
        subcategorias: ['Consolas', 'Videojuegos', 'Accesorios', 'PC Gaming', 'Merchandising', 'Streaming']
    },
    'servicios': {
        nombre: 'Servicios',
        emoji: '🔧',
        subcategorias: ['Consultoría', 'Reparaciones', 'Mantenimiento', 'Instalación', 'Capacitación', 'Soporte']
    }
};

// Función para crear el selector de categorías en el admin de tiendas
function crearSelectorCategorias(containerId, categoriaSeleccionada = '') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const html = `
        <div class="categoria-selector">
            <label for="categoriaTienda" class="form-label">
                <i class="fas fa-tags"></i> Categoría Principal de tu Tienda
            </label>
            <select id="categoriaTienda" class="form-select" onchange="actualizarSubcategorias()">
                <option value="">Selecciona una categoría...</option>
                ${Object.entries(categoriasDisponibles).map(([key, categoria]) => 
                    `<option value="${key}" ${categoriaSeleccionada === key ? 'selected' : ''}>
                        ${categoria.emoji} ${categoria.nombre}
                    </option>`
                ).join('')}
            </select>
            
            <div id="subcategoriasContainer" class="mt-3" style="display: none;">
                <label for="subcategoriaTienda" class="form-label">
                    <i class="fas fa-list"></i> Subcategoría Específica
                </label>
                <select id="subcategoriaTienda" class="form-select">
                    <option value="">Selecciona una subcategoría...</option>
                </select>
            </div>
            
            <div class="categoria-info mt-3">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Importante:</strong> La categoría ayuda a los clientes a encontrar tus productos más fácilmente.
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Función para actualizar las subcategorías cuando se selecciona una categoría
function actualizarSubcategorias() {
    const categoriaSelect = document.getElementById('categoriaTienda');
    const subcategoriaSelect = document.getElementById('subcategoriaTienda');
    const subcategoriasContainer = document.getElementById('subcategoriasContainer');
    
    if (!categoriaSelect || !subcategoriaSelect || !subcategoriasContainer) return;
    
    const categoriaSeleccionada = categoriaSelect.value;
    
    if (categoriaSeleccionada && categoriasDisponibles[categoriaSeleccionada]) {
        const subcategorias = categoriasDisponibles[categoriaSeleccionada].subcategorias;
        
        subcategoriaSelect.innerHTML = '<option value="">Selecciona una subcategoría...</option>';
        subcategorias.forEach(subcategoria => {
            const option = document.createElement('option');
            option.value = subcategoria.toLowerCase().replace(/\s+/g, '-');
            option.textContent = subcategoria;
            subcategoriaSelect.appendChild(option);
        });
        
        subcategoriasContainer.style.display = 'block';
    } else {
        subcategoriasContainer.style.display = 'none';
        subcategoriaSelect.innerHTML = '<option value="">Selecciona una subcategoría...</option>';
    }
}

// Función para obtener la categoría seleccionada
function obtenerCategoriaSeleccionada() {
    const categoriaSelect = document.getElementById('categoriaTienda');
    const subcategoriaSelect = document.getElementById('subcategoriaTienda');
    
    if (!categoriaSelect) return null;
    
    const categoria = categoriaSelect.value;
    const subcategoria = subcategoriaSelect ? subcategoriaSelect.value : '';
    
    return {
        categoria: categoria,
        subcategoria: subcategoria,
        categoriaCompleta: categoria ? `${categoria}${subcategoria ? '-' + subcategoria : ''}` : ''
    };
}

// Función para guardar la categoría en localStorage
function guardarCategoriaTienda() {
    const categoriaData = obtenerCategoriaSeleccionada();
    if (categoriaData && categoriaData.categoria) {
        localStorage.setItem('categoria_tienda', JSON.stringify(categoriaData));
        mostrarNotificacionCategoria('Categoría guardada exitosamente', 'success');
        return true;
    } else {
        mostrarNotificacionCategoria('Por favor selecciona una categoría', 'warning');
        return false;
    }
}

// Función para cargar la categoría guardada
function cargarCategoriaTienda() {
    const categoriaGuardada = localStorage.getItem('categoria_tienda');
    if (categoriaGuardada) {
        try {
            const categoriaData = JSON.parse(categoriaGuardada);
            return categoriaData;
        } catch (e) {
            console.error('Error al cargar categoría:', e);
        }
    }
    return null;
}

// Función para mostrar notificaciones específicas de categorías
function mostrarNotificacionCategoria(mensaje, tipo = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `alert alert-${tipo} categoria-notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${mensaje}
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para validar que la categoría esté completa
function validarCategoriaCompleta() {
    const categoriaData = obtenerCategoriaSeleccionada();
    return categoriaData && categoriaData.categoria;
}

// Función para obtener todas las categorías disponibles (para uso en otros scripts)
function obtenerTodasLasCategorias() {
    return categoriasDisponibles;
}

// Función para obtener el nombre completo de una categoría
function obtenerNombreCategoria(codigo) {
    if (categoriasDisponibles[codigo]) {
        return categoriasDisponibles[codigo].nombre;
    }
    return codigo;
}

// Función para obtener el emoji de una categoría
function obtenerEmojiCategoria(codigo) {
    if (categoriasDisponibles[codigo]) {
        return categoriasDisponibles[codigo].emoji;
    }
    return '📦';
}

// CSS para las notificaciones
const categoriaCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .categoria-selector {
        background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
        border-radius: 15px;
        padding: 25px;
        border: 2px solid #F9A8D4;
        margin-bottom: 20px;
    }
    
    .categoria-selector label {
        font-weight: 600;
        color: var(--primary-purple);
        margin-bottom: 10px;
    }
    
    .categoria-selector .form-select {
        border: 2px solid #E5E7EB;
        border-radius: 10px;
        padding: 12px 15px;
        transition: all 0.3s ease;
    }
    
    .categoria-selector .form-select:focus {
        border-color: var(--primary-purple);
        box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.25);
    }
    
    .categoria-info .alert {
        border-radius: 10px;
        border: none;
        background: rgba(124, 58, 237, 0.1);
        color: var(--primary-purple);
    }
`;

// Inyectar CSS
if (!document.getElementById('categoria-css')) {
    const style = document.createElement('style');
    style.id = 'categoria-css';
    style.textContent = categoriaCSS;
    document.head.appendChild(style);
}























