// ========================================
// SISTEMA DE PRODUCTOS - MODALES Y FUNCIONES
// ========================================

// Funciones para mostrar/ocultar modal de producto
function mostrarFormularioProducto() {
    const modal = document.getElementById('modalProducto');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        // Limpiar formulario
        const form = document.getElementById('formProducto');
        if (form) form.reset();
        console.log('✅ Modal de producto abierto');
    } else {
        console.error('❌ Modal de producto no encontrado');
        mostrarNotificacion('Error: Modal no encontrado', 'error');
    }
}

function cerrarModalProducto() {
    const modal = document.getElementById('modalProducto');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        const form = document.getElementById('formProducto');
        if (form) form.reset();
    }
}

function guardarProducto(event) {
    event.preventDefault();
    
    const tiendaActual = JSON.parse(localStorage.getItem('tienda_actual') || '{}');
    const tiendaId = tiendaActual.id || 'demo';
    
    const producto = {
        id: 'prod-' + Date.now(),
        nombre: document.getElementById('productoNombre').value,
        descripcion: document.getElementById('productoDescripcion').value || '',
        precio: parseFloat(document.getElementById('productoPrecio').value),
        categoria: document.getElementById('productoCategoria').value,
        stock: parseInt(document.getElementById('productoStock').value) || 0,
        imagen: document.getElementById('productoImagen').value || '',
        destacado: document.getElementById('productoDestacado').checked,
        oferta: document.getElementById('productoOferta').checked,
        nuevo: document.getElementById('productoNuevo').checked,
        fecha_creacion: new Date().toISOString()
    };
    
    // Guardar en localStorage
    let productos = JSON.parse(localStorage.getItem('productos_' + tiendaId) || '[]');
    productos.push(producto);
    localStorage.setItem('productos_' + tiendaId, JSON.stringify(productos));
    
    // Guardar categorías únicas
    guardarCategoriaUnica(producto.categoria);
    
    mostrarNotificacion('✅ Producto agregado correctamente', 'success');
    cerrarModalProducto();
    
    console.log('✅ Producto guardado:', producto);
    console.log('📦 Total productos:', productos.length);
}

function guardarCategoriaUnica(nombreCategoria) {
    if (!nombreCategoria) return;
    
    let categorias = JSON.parse(localStorage.getItem('categorias_tienda') || '[]');
    
    // Verificar si ya existe
    const existe = categorias.some(cat => cat.nombre === nombreCategoria);
    
    if (!existe) {
        const iconos = {
            'tecnologia': 'fas fa-laptop',
            'electronica': 'fas fa-mobile-alt',
            'hogar': 'fas fa-home',
            'moda': 'fas fa-tshirt',
            'belleza': 'fas fa-spa',
            'deportes': 'fas fa-dumbbell',
            'juguetes': 'fas fa-puzzle-piece',
            'libros': 'fas fa-book',
            'alimentos': 'fas fa-utensils',
            'mascotas': 'fas fa-paw',
            'jardin': 'fas fa-leaf',
            'oficina': 'fas fa-briefcase',
            'otro': 'fas fa-box'
        };
        
        categorias.push({
            nombre: nombreCategoria.charAt(0).toUpperCase() + nombreCategoria.slice(1),
            icono: iconos[nombreCategoria] || 'fas fa-box',
            descripcion: 'Ver productos'
        });
        
        localStorage.setItem('categorias_tienda', JSON.stringify(categorias));
        console.log('✅ Categoría guardada:', nombreCategoria);
    }
}

// Hacer funciones globales
window.mostrarFormularioProducto = mostrarFormularioProducto;
window.cerrarModalProducto = cerrarModalProducto;
window.guardarProducto = guardarProducto;

console.log('✅ Sistema de productos cargado');



















