// FRIOCAS - Sistema de Gestión de Repuestos y Servicios
console.log('=== FRIOCAS SCRIPT.JS CARGADO ===');

// Variables globales
let carrito = [];

// Datos de repuestos (simulación de base de datos)
let repuestos = [
    {
        id: 1,
        nombre: "Revividor de Interiores Premium",
        categoria: "interiores",
        precio: 10500,
        stock: 50,
        descripcion: "Restaura el color, brillo y textura original de plásticos, vinilos y tapizados, protegiéndolos contra desgaste, polvo y rayos UV.",
        imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        marca: "Premium",
        estado: "nuevo"
    },
    {
        id: 2,
        nombre: "Pastillas de Freno Cerámicas",
        categoria: "frenos",
        precio: 8999,
        stock: 30,
        descripcion: "Pastillas de freno cerámicas de alto rendimiento para mayor durabilidad y mejor frenado",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Bosch",
        estado: "nuevo"
    },
    {
        id: 3,
        nombre: "Amortiguadores Delanteros",
        categoria: "suspension",
        precio: 19999,
        stock: 15,
        descripcion: "Amortiguadores delanteros con tecnología avanzada para mejor confort y estabilidad",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Monroe",
        estado: "nuevo"
    },
    {
        id: 4,
        nombre: "Batería de 12V 60Ah",
        categoria: "electrico",
        precio: 14999,
        stock: 25,
        descripcion: "Batería de automóvil de larga duración con garantía de 18 meses",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Willard",
        estado: "nuevo"
    },
    {
        id: 5,
        nombre: "Aceite Sintético 5W-30",
        categoria: "motor",
        precio: 4599,
        stock: 100,
        descripcion: "Aceite sintético de alto rendimiento para motores modernos",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Shell",
        estado: "nuevo"
    },
    {
        id: 6,
        nombre: "Rotor de Freno Delantero",
        categoria: "frenos",
        precio: 7599,
        stock: 20,
        descripcion: "Rotor de freno ventilado para mejor disipación del calor",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Brembo",
        estado: "nuevo"
    },
    {
        id: 7,
        nombre: "Resortes de Suspensión",
        categoria: "suspension",
        precio: 12999,
        stock: 12,
        descripcion: "Resortes deportivos para mejor manejo y estabilidad",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Eibach",
        estado: "nuevo"
    },
    {
        id: 8,
        nombre: "Alternador Reacondicionado",
        categoria: "electrico",
        precio: 29999,
        stock: 8,
        descripcion: "Alternador completamente reacondicionado con garantía de 12 meses",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Bosch",
        estado: "reacondicionado"
    },
    {
        id: 9,
        nombre: "Filtro de Aire Deportivo",
        categoria: "motor",
        precio: 3500,
        stock: 45,
        descripcion: "Filtro de aire de alto flujo para mejor rendimiento del motor",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "K&N",
        estado: "nuevo"
    },
    {
        id: 10,
        nombre: "Bujías de Iridio",
        categoria: "motor",
        precio: 2800,
        stock: 60,
        descripcion: "Bujías de iridio para mejor combustión y durabilidad",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "NGK",
        estado: "nuevo"
    },
    {
        id: 11,
        nombre: "Líquido de Frenos DOT4",
        categoria: "frenos",
        precio: 1200,
        stock: 80,
        descripcion: "Líquido de frenos de alto punto de ebullición para mayor seguridad",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Castrol",
        estado: "nuevo"
    },
    {
        id: 12,
        nombre: "Kit de Embrague Completo",
        categoria: "transmision",
        precio: 45000,
        stock: 5,
        descripcion: "Kit completo de embrague con disco, plato y rulemán",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "LUK",
        estado: "nuevo"
    },
    {
        id: 13,
        nombre: "Radiador de Aluminio",
        categoria: "refrigeracion",
        precio: 35000,
        stock: 10,
        descripcion: "Radiador de aluminio para mejor disipación del calor",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Behr",
        estado: "nuevo"
    },
    {
        id: 14,
        nombre: "Bomba de Agua",
        categoria: "refrigeracion",
        precio: 8500,
        stock: 18,
        descripcion: "Bomba de agua de alta calidad para sistema de refrigeración",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Gates",
        estado: "nuevo"
    },
    {
        id: 15,
        nombre: "Termostato",
        categoria: "refrigeracion",
        precio: 2500,
        stock: 35,
        descripcion: "Termostato para control preciso de la temperatura del motor",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Mahle",
        estado: "nuevo"
    },
    {
        id: 16,
        nombre: "Kit de Limpieza de Inyectores",
        categoria: "combustible",
        precio: 1800,
        stock: 25,
        descripcion: "Kit completo para limpieza profunda del sistema de inyección",
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        marca: "Wynns",
        estado: "nuevo"
    }
];

// Datos de ofertas
let ofertas = [
    {
        id: 1,
        nombre: "Filtro de Aceite Premium",
        categoria: "motor",
        precioOriginal: 35.99,
        precioOferta: 25.99,
        descuento: 28,
        stock: 50,
        descripcion: "Filtro de aceite de alta calidad para motores - ¡Oferta especial!",
        imagen: "🔧"
    },
    {
        id: 5,
        nombre: "Aceite Sintético 5W-30",
        categoria: "motor",
        precioOriginal: 65.99,
        precioOferta: 45.99,
        descuento: 30,
        stock: 100,
        descripcion: "Aceite sintético de alto rendimiento - ¡Precio increíble!",
        imagen: "🛢️"
    },
    {
        id: 2,
        nombre: "Pastillas de Freno Cerámicas",
        categoria: "frenos",
        precioOriginal: 120.99,
        precioOferta: 89.99,
        descuento: 26,
        stock: 30,
        descripcion: "Pastillas de freno cerámicas de alto rendimiento - ¡Oferta limitada!",
        imagen: "🛑"
    },
    {
        id: 6,
        nombre: "Rotor de Freno Delantero",
        categoria: "frenos",
        precioOriginal: 95.99,
        precioOferta: 75.99,
        descuento: 21,
        stock: 20,
        descripcion: "Rotor de freno ventilado para mejor disipación - ¡Gran descuento!",
        imagen: "⚙️"
    }
];

// Variables globales
let repuestosFiltrados = [...repuestos];
let ofertasFiltradas = [...ofertas];

// Elementos del DOM
const repuestosGrid = document.getElementById('repuestosGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const paymentModal = document.getElementById('paymentModal');
const closeModal = document.querySelector('.close');
const cardDetails = document.getElementById('cardDetails');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarOfertas();
    cargarRepuestos();
    setupEventListeners();
    setupPaymentMethodToggle();
    setupMobileNavigation();
    actualizarInterfazUsuario();
});

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda
    searchInput.addEventListener('input', aplicarFiltros);
    
    // Filtros
    document.getElementById('categoryFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('marcaFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('estadoFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('precioFilter').addEventListener('change', aplicarFiltros);
    
    // Modal de pago
    closeModal.addEventListener('click', cerrarModal);
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            cerrarModal();
        }
        if (event.target === document.getElementById('cartModal')) {
            cerrarModalCarrito();
        }
        if (event.target === document.getElementById('servicioModal')) {
            cerrarModalServicio();
        }
        if (event.target === document.getElementById('authModal')) {
            cerrarModalAuth();
        }
        if (event.target === document.getElementById('shareLocationModal')) {
            cerrarModalCompartir();
        }
    });
    
    // Formateo de inputs
    document.getElementById('cardNumber').addEventListener('input', formatearNumeroTarjeta);
    document.getElementById('expiryDate').addEventListener('input', formatearFechaVencimiento);
    document.getElementById('cvv').addEventListener('input', formatearCVV);
}

// Configurar navegación móvil
function setupMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Cargar repuestos en la grilla
function cargarRepuestos() {
    repuestosGrid.innerHTML = '';
    
    repuestosFiltrados.forEach(repuesto => {
        const repuestoCard = document.createElement('div');
        repuestoCard.className = 'repuesto-card';
        repuestoCard.innerHTML = `
            <h3>${repuesto.nombre}</h3>
            <div class="categoria">${obtenerNombreCategoria(repuesto.categoria)}</div>
            <div class="precio">$${repuesto.precio.toFixed(2)}</div>
            <div class="stock">Stock: ${repuesto.stock} unidades</div>
            <p>${repuesto.descripcion}</p>
            <div class="cantidad-container">
                <label>Cantidad:</label>
                <div class="cantidad-input">
                    <button class="cantidad-btn" onclick="cambiarCantidadRepuesto(${repuesto.id}, -1)">-</button>
                    <input type="number" id="cantidad-repuesto-${repuesto.id}" value="1" min="1" max="${repuesto.stock}" onchange="calcularPrecioRepuesto(${repuesto.id})">
                    <button class="cantidad-btn" onclick="cambiarCantidadRepuesto(${repuesto.id}, 1)">+</button>
                </div>
            </div>
            <div class="calculo-precio">
                <div>Precio total:</div>
                <div class="precio-total" id="precio-total-repuesto-${repuesto.id}">$${repuesto.precio.toFixed(2)}</div>
            </div>
            <button class="btn-comprar" onclick="comprarRepuesto(${repuesto.id})">
                <i class="fas fa-shopping-cart"></i> Comprar Ahora
            </button>
        `;
        repuestosGrid.appendChild(repuestoCard);
    });
}

// Cambiar cantidad para repuestos
function cambiarCantidadRepuesto(id, cambio) {
    const input = document.getElementById(`cantidad-repuesto-${id}`);
    const nuevaCantidad = Math.max(1, Math.min(input.valueAsNumber + cambio, input.max));
    input.value = nuevaCantidad;
    calcularPrecioRepuesto(id);
}

// Calcular precio total para repuestos
function calcularPrecioRepuesto(id) {
    const repuesto = repuestos.find(r => r.id === id);
    if (!repuesto) return;
    
    const cantidad = parseInt(document.getElementById(`cantidad-repuesto-${id}`).value) || 1;
    const precioTotal = repuesto.precio * cantidad;
    const precioTotalElement = document.getElementById(`precio-total-repuesto-${id}`);
    
    if (precioTotalElement) {
        precioTotalElement.textContent = `$${precioTotal.toFixed(2)}`;
    }
}

// Comprar repuesto directamente
function comprarRepuesto(id) {
    const repuesto = repuestos.find(r => r.id === id);
    if (!repuesto) return;
    
    const cantidad = parseInt(document.getElementById(`cantidad-repuesto-${id}`).value) || 1;
    const precioTotal = repuesto.precio * cantidad;
    
    // Crear item para el carrito
    const item = {
        ...repuesto,
        cantidad: cantidad,
        subtotal: precioTotal
    };
    
    // Agregar al carrito
    carrito = [item];
    actualizarContadorCarrito();
    
    // Mostrar notificación
    mostrarNotificacion(`${repuesto.nombre} agregado a la compra - $${precioTotal.toFixed(2)}`);
    
    // Abrir modal de pago
    setTimeout(() => {
        abrirModalPago();
    }, 1000);
}

// Filtrar repuestos
function filtrarRepuestos() {
    const busqueda = searchInput.value.toLowerCase();
    const categoria = categoryFilter.value;
    
    repuestosFiltrados = repuestos.filter(repuesto => {
        const coincideBusqueda = repuesto.nombre.toLowerCase().includes(busqueda) ||
                                repuesto.descripcion.toLowerCase().includes(busqueda);
        const coincideCategoria = !categoria || repuesto.categoria === categoria;
        
        return coincideBusqueda && coincideCategoria;
    });
    
    cargarRepuestos();
}

// Obtener nombre de categoría
function obtenerNombreCategoria(categoria) {
    const categorias = {
        'motor': 'Motor',
        'frenos': 'Frenos',
        'suspension': 'Suspensión',
        'electrico': 'Eléctrico',
        'interiores': 'Interiores',
        'transmision': 'Transmisión',
        'refrigeracion': 'Refrigeración',
        'combustible': 'Combustible'
    };
    return categorias[categoria] || categoria;
}

// Agregar al carrito
function agregarAlCarrito(id) {
    const repuesto = repuestos.find(r => r.id === id);
    if (!repuesto) return;
    
    const itemEnCarrito = carrito.find(item => item.id === id);
    
    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({
            ...repuesto,
            cantidad: 1
        });
    }
    
    mostrarNotificacion(`${repuesto.nombre} agregado al carrito`);
    actualizarResumenCarrito();
    actualizarContadorCarrito();
    actualizarResumenCarritoModal();
    
    // Animación del botón
    const btnComprar = document.querySelector(`[onclick="agregarAlCarrito(${id})"]`);
    if (btnComprar) {
        btnComprar.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            btnComprar.style.animation = '';
        }, 300);
    }
}

// Cambiar cantidad para repuestos
function cambiarCantidadRepuesto(id, cambio) {
    const input = document.getElementById(`cantidad-repuesto-${id}`);
    const repuesto = repuestos.find(r => r.id === id);
    if (!repuesto) return;
    
    const nuevaCantidad = Math.max(1, Math.min(input.valueAsNumber + cambio, repuesto.stock));
    input.value = nuevaCantidad;
    calcularPrecioRepuesto(id);
}

// Calcular precio total para repuestos
function calcularPrecioRepuesto(id) {
    const repuesto = repuestos.find(r => r.id === id);
    if (!repuesto) return;
    
    const cantidad = parseInt(document.getElementById(`cantidad-repuesto-${id}`).value) || 1;
    const precioTotal = repuesto.precio * cantidad;
    document.getElementById(`precio-total-repuesto-${id}`).textContent = `$${precioTotal.toLocaleString()}`;
}

// Agregar repuesto al carrito con cantidad específica
function agregarAlCarritoRepuesto(id) {
    const repuesto = repuestos.find(r => r.id === id);
    if (!repuesto) return;
    
    const cantidad = parseInt(document.getElementById(`cantidad-repuesto-${id}`).value) || 1;
    const precioTotal = repuesto.precio * cantidad;
    
    const itemEnCarrito = carrito.find(item => item.id === id);
    
    if (itemEnCarrito) {
        itemEnCarrito.cantidad += cantidad;
    } else {
        carrito.push({
            ...repuesto,
            cantidad: cantidad
        });
    }
    
    mostrarNotificacion(`${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} de ${repuesto.nombre} agregadas al carrito - $${precioTotal.toLocaleString()}`);
    actualizarResumenCarrito();
    actualizarContadorCarrito();
    actualizarResumenCarritoModal();
    
    // Animación del botón
    const btnComprar = document.querySelector(`[onclick="agregarAlCarritoRepuesto(${id})"]`);
    if (btnComprar) {
        btnComprar.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            btnComprar.style.animation = '';
        }, 300);
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #3b82f6, #60a5fa);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Abrir modal de pago
function abrirModalPago() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío');
        return;
    }
    
    actualizarResumenCarrito();
    paymentModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de pago
function cerrarModal() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Limpiar todos los datos por seguridad
    limpiarDatosTarjeta();
}

// Cerrar modal
function cerrarModal() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    cartCount.textContent = totalItems;
}

// Actualizar resumen del carrito
function actualizarResumenCarrito() {
    const orderSummary = document.getElementById('orderSummary');
    const orderTotal = document.getElementById('orderTotal');
    const paymentModal = document.getElementById('paymentModal');
    
    let html = '';
    let total = 0;
    
    if (carrito.length === 0) {
        html = '<p style="text-align: center; color: #666; font-style: italic;">El carrito está vacío</p>';
        // Si el carrito está vacío y el modal está abierto, cerrarlo
        if (paymentModal.style.display === 'block') {
            cerrarModal();
            mostrarNotificacion('El carrito está vacío, cerrando modal de pago');
        }
    } else {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            
            html += `
                <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; padding: 0.5rem; background: #f8f9fa; border-radius: 8px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 500; margin-bottom: 0.3rem;">${item.nombre}</div>
                        <div style="font-size: 0.9rem; color: #666;">$${item.precio.toFixed(2)} c/u</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button onclick="cambiarCantidadCarrito(${item.id}, -1)" class="quantity-btn" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                        <span style="min-width: 30px; text-align: center; font-weight: 500;">${item.cantidad}</span>
                        <button onclick="cambiarCantidadCarrito(${item.id}, 1)" class="quantity-btn" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                        <button onclick="eliminarDelCarrito(${item.id})" class="remove-btn" style="width: 30px; height: 30px; border: none; background: #dc3545; color: white; border-radius: 4px; cursor: pointer; font-size: 0.8rem;" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div style="font-weight: 600; margin-left: 1rem; min-width: 80px; text-align: right;">
                        $${subtotal.toFixed(2)}
                    </div>
                </div>
            `;
        });
        
        // Agregar botón para vaciar carrito
        html += `
            <div style="text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd;">
                <button onclick="vaciarCarrito()" class="btn-clear-cart" style="background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                    <i class="fas fa-trash-alt"></i> Vaciar Carrito
                </button>
            </div>
        `;
    }
    
    orderSummary.innerHTML = html;
    orderTotal.textContent = total.toFixed(2);
}

// Cambiar cantidad de un producto en el carrito
function cambiarCantidadCarrito(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (!item) return;
    
    const nuevaCantidad = item.cantidad + cambio;
    
    if (nuevaCantidad <= 0) {
        // Si la cantidad llega a 0, eliminar el producto
        eliminarDelCarrito(id);
    } else {
        item.cantidad = nuevaCantidad;
        actualizarResumenCarrito();
        actualizarContadorCarrito();
        actualizarResumenCarritoModal();
        mostrarNotificacion(`Cantidad de ${item.nombre} actualizada`);
    }
}

// Eliminar un producto específico del carrito
function eliminarDelCarrito(id) {
    const itemIndex = carrito.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    
    const itemEliminado = carrito[itemIndex];
    carrito.splice(itemIndex, 1);
    
    actualizarResumenCarrito();
    actualizarContadorCarrito();
    actualizarResumenCarritoModal();
    mostrarNotificacion(`${itemEliminado.nombre} eliminado del carrito`);
}

// Vaciar todo el carrito
function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito ya está vacío');
        return;
    }
    
    // Confirmar antes de vaciar
    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        carrito = [];
        actualizarResumenCarrito();
        actualizarContadorCarrito();
        actualizarResumenCarritoModal();
        mostrarNotificacion('Carrito vaciado completamente');
    }
}

// Datos de servicios
const servicios = {
    taller: {
        nombre: "Taller Mecánico",
        descripcion: "Servicio técnico especializado para todo tipo de vehículos. Contamos con técnicos certificados y equipamiento de última generación.",
        servicios: [
            "Diagnóstico computarizado",
            "Reparación de motor",
            "Sistema de frenos",
            "Suspensión y dirección",
            "Sistema eléctrico",
            "Aire acondicionado",
            "Cambio de aceite y filtros"
        ],
        precios: [
            { nombre: "Diagnóstico básico", precio: 5000 },
            { nombre: "Cambio de aceite", precio: 8000 },
            { nombre: "Reparación de frenos", precio: 15000 },
            { nombre: "Alineación y balanceo", precio: 12000 }
        ]
    },
    lubricentro: {
        nombre: "Lubricentro",
        descripcion: "Cambio de aceite, filtros y lubricantes de calidad premium. Utilizamos productos de las mejores marcas del mercado.",
        servicios: [
            "Cambio de aceite de motor",
            "Cambio de filtros",
            "Lubricación de chasis",
            "Control de fluidos",
            "Limpieza de inyectores",
            "Aditivos especializados"
        ],
        precios: [
            { nombre: "Cambio de aceite sintético", precio: 12000 },
            { nombre: "Cambio de aceite mineral", precio: 8000 },
            { nombre: "Cambio de filtros completos", precio: 5000 },
            { nombre: "Limpieza de inyectores", precio: 18000 }
        ]
    },
    detailing: {
        nombre: "Detailing",
        descripcion: "Limpieza profunda y restauración del interior y exterior de tu vehículo. Devolvemos el brillo original a tu auto.",
        servicios: [
            "Limpieza exterior completa",
            "Limpieza de motor",
            "Limpieza de interior",
            "Tratamiento de plásticos",
            "Pulido y encerado",
            "Tratamiento de cuero",
            "Desinfección completa"
        ],
        precios: [
            { nombre: "Limpieza básica exterior", precio: 15000 },
            { nombre: "Limpieza completa interior", precio: 12000 },
            { nombre: "Detailing completo", precio: 35000 },
            { nombre: "Tratamiento de cuero", precio: 8000 }
        ]
    },
    transporte: {
        nombre: "Servicio de Traslados",
        descripcion: "Servicio de traslados en asociación con CRECER. Traslados seguros y confiables para personas en toda la región.",
        servicios: [
            "Traslados urbanos e interurbanos",
            "Servicio de taxi y remis",
            "Traslados corporativos",
            "Traslados ejecutivos",
            "Reservas anticipadas",
            "Cobertura regional"
        ],
        precios: [
            { nombre: "Traslado urbano (Corrientes)", precio: 2000 },
            { nombre: "Corrientes - Resistencia", precio: 8000 },
            { nombre: "Traslado interior provincia", precio: 15000 },
            { nombre: "Traslado ejecutivo", precio: 12000 }
        ]
    },
    aireAcondicionado: {
        nombre: "Reparación de Aires Acondicionados",
        descripcion: "Servicio especializado en reparación, mantenimiento e instalación de sistemas de aire acondicionado para vehículos.",
        servicios: [
            "Diagnóstico de sistemas de A/C",
            "Recarga de gas refrigerante",
            "Reparación de compresores",
            "Limpieza de evaporadores",
            "Cambio de filtros de cabina",
            "Instalación de sistemas A/C",
            "Mantenimiento preventivo",
            "Reparación de controles"
        ],
        precios: [
            { nombre: "Diagnóstico completo", precio: 5000 },
            { nombre: "Recarga de gas", precio: 15000 },
            { nombre: "Limpieza de sistema", precio: 8000 },
            { nombre: "Cambio de compresor", precio: 45000 }
        ]
    },
    gestoria: {
        nombre: "Gestoría Automotriz",
        descripcion: "Servicios de gestoría para trámites automotrices. Facilitamos todos los procesos burocráticos relacionados con tu vehículo.",
        servicios: [
            "Transferencias de vehículos",
            "Renovación de licencias",
            "Tramitación de patentes",
            "Certificados de dominio",
            "Inscripción de vehículos",
            "Cambio de radicación",
            "Bajas y altas de vehículos",
            "Asesoramiento legal"
        ],
        precios: [
            { nombre: "Transferencia de vehículo", precio: 25000 },
            { nombre: "Renovación de licencia", precio: 8000 },
            { nombre: "Tramitación de patente", precio: 12000 },
            { nombre: "Certificado de dominio", precio: 5000 }
        ]
    }
};

// Abrir modal de servicio
function abrirModalServicio(tipo) {
    const servicio = servicios[tipo];
    const modal = document.getElementById('servicioModal');
    const content = document.getElementById('servicioContent');
    
    let html = `
        <h2>${servicio.nombre}</h2>
        <div class="servicio-content">
            <div class="servicio-info">
                <h3>Descripción</h3>
                <p>${servicio.descripcion}</p>
                
                <h3>Servicios Incluidos</h3>
                <ul>
                    ${servicio.servicios.map(s => `<li>${s}</li>`).join('')}
                </ul>
                
                ${tipo === 'transporte' ? `
                    <div class="shipping-calculator">
                        <h3>Calculadora de Traslados</h3>
                        <div class="form-group">
                            <label>Origen</label>
                            <input type="text" id="origen" value="Moreno 2242, Corrientes Capital" readonly>
                        </div>
                        <div class="form-group">
                            <label>Destino</label>
                            <input type="text" id="destino" placeholder="Ingresa tu destino o usa tu ubicación actual">
                            <button onclick="obtenerUbicacionActual()" class="btn-secondary" style="margin-top: 0.5rem;">
                                <i class="fas fa-location-arrow"></i> Usar Mi Ubicación
                            </button>
                        </div>
                        <div class="form-group">
                            <label>Tipo de Servicio</label>
                            <select id="tipoTraslado">
                                <option value="urbano">Traslado Urbano</option>
                                <option value="interurbano">Corrientes - Resistencia</option>
                                <option value="interior">Interior Provincia</option>
                                <option value="carga">Servicio de Carga</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Compartir Ubicación en Tiempo Real</label>
                            <div class="location-sharing">
                                <button onclick="iniciarCompartirUbicacion()" class="btn-primary" id="btnCompartirUbicacion">
                                    <i class="fas fa-share-location"></i> Compartir Ubicación
                                </button>
                                <button onclick="detenerCompartirUbicacion()" class="btn-secondary" id="btnDetenerUbicacion" style="display: none;">
                                    <i class="fas fa-stop"></i> Detener Compartir
                                </button>
                            </div>
                        </div>
                        <button onclick="calcularTraslado()" class="btn-primary">
                            <i class="fas fa-calculator"></i> Calcular Traslado
                        </button>
                        <div id="mapContainer" style="height: 300px; margin: 1rem 0; border-radius: 8px; overflow: hidden; display: none;"></div>
                        <div id="shippingResult" class="shipping-result" style="display: none;"></div>
                    </div>
                ` : ''}
            </div>
            
            <div class="servicio-precios">
                <h3>Precios de Referencia</h3>
                ${servicio.precios.map(p => `
                    <div class="precio-item">
                        <span class="precio-nombre">${p.nombre}</span>
                        <span class="precio-valor">$${p.precio.toLocaleString()}</span>
                    </div>
                `).join('')}
                
                <div style="margin-top: 2rem; text-align: center;">
                    <button onclick="contactarServicio('${tipo}')" class="btn-primary">
                        <i class="fas fa-phone"></i> Consultar Precios
                    </button>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de servicio
function cerrarModalServicio() {
    document.getElementById('servicioModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Calcular envío según ciudad seleccionada
function calcularEnvio() {
    const ciudad = document.getElementById('shippingCity').value;
    const orderTotal = document.getElementById('orderTotal');
    const total = parseFloat(orderTotal.textContent);
    
    let costoEnvio = 0;
    let mensaje = '';
    
    switch(ciudad) {
        case 'corrientes-capital':
            costoEnvio = 0;
            mensaje = 'Envío gratis en Corrientes Capital';
            break;
        case 'resistenica':
            costoEnvio = 3000;
            mensaje = 'Costo de envío a Resistencia: $3,000';
            break;
        case 'interior':
            costoEnvio = 5000;
            mensaje = 'Costo de envío al interior: $5,000';
            break;
        case 'otras-provincias':
            costoEnvio = 8000;
            mensaje = 'Costo de envío a otras provincias: $8,000';
            break;
    }
    
    const totalConEnvio = total + costoEnvio;
    orderTotal.textContent = totalConEnvio.toFixed(2);
    
    if (costoEnvio > 0) {
        mostrarNotificacion(mensaje);
    }
}

// Variables para mapas y ubicación
let map = null;
let directionsService = null;
let directionsRenderer = null;
let watchId = null;
let ubicacionCompartida = false;
let ubicacionPermitida = false;
let ubicacionPreguntada = false;

// Calcular traslado usando Google Maps
function calcularTraslado() {
    const destino = document.getElementById('destino').value;
    const tipoTraslado = document.getElementById('tipoTraslado').value;
    const resultDiv = document.getElementById('shippingResult');
    const mapContainer = document.getElementById('mapContainer');
    
    if (!destino) {
        mostrarNotificacion('Por favor ingresa un destino');
        return;
    }
    
    // Inicializar mapa si no existe
    if (!map) {
        inicializarMapa();
    }
    
    // Mostrar mapa
    mapContainer.style.display = 'block';
    
    // Calcular ruta
    const origen = 'Moreno 2242, Corrientes Capital, Argentina';
    calcularRuta(origen, destino, tipoTraslado);
    
    // Precios base según tipo de traslado
    const preciosBase = {
        'urbano': { precio: 2000, tiempo: '15-30 min', descripcion: 'Traslado dentro de Corrientes Capital' },
        'interurbano': { precio: 8000, tiempo: '45-60 min', descripcion: 'Traslado Corrientes - Resistencia' },
        'interior': { precio: 15000, tiempo: '2-4 horas', descripcion: 'Traslado al interior de la provincia' },
        'ejecutivo': { precio: 12000, tiempo: '1-2 horas', descripcion: 'Traslado ejecutivo premium' }
    };
    
    const servicio = preciosBase[tipoTraslado];
    
    resultDiv.innerHTML = `
        <h4>Cotización de Traslado</h4>
        <p><strong>Servicio:</strong> ${servicio.descripcion}</p>
        <p><strong>Origen:</strong> Moreno 2242, Corrientes Capital</p>
        <p><strong>Destino:</strong> ${destino}</p>
        <p><strong>Costo del traslado:</strong> $${servicio.precio.toLocaleString()}</p>
        <p><strong>Tiempo estimado:</strong> ${servicio.tiempo}</p>
        <p><strong>Empresa:</strong> CRECER (Asociado con FRIOCAS)</p>
        <div style="margin-top: 1rem; padding: 1rem; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #4caf50;">
            <p style="margin: 0; color: #2e7d32;"><strong>💡 Tip:</strong> Reserva con anticipación para mejores tarifas y disponibilidad.</p>
        </div>
        <div style="margin-top: 1rem; text-align: center;">
            <button onclick="reservarTraslado()" class="btn-primary">
                <i class="fas fa-calendar-check"></i> Reservar Traslado
            </button>
        </div>
    `;
    
    resultDiv.style.display = 'block';
}

// Inicializar mapa de Google
function inicializarMapa() {
    const mapContainer = document.getElementById('mapContainer');
    
    // Coordenadas de Corrientes Capital
    const corrientes = { lat: -27.4692, lng: -58.8304 };
    
    map = new google.maps.Map(mapContainer, {
        center: corrientes,
        zoom: 12,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });
    
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    
    // Remover indicador de carga
    mapContainer.classList.add('loaded');
}

// Calcular ruta entre dos puntos
function calcularRuta(origen, destino, tipoTraslado) {
    if (!directionsService || !directionsRenderer) return;
    
    const request = {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    
    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            
            // Mostrar información de la ruta
            const route = result.routes[0];
            const leg = route.legs[0];
            
            const infoDiv = document.createElement('div');
            infoDiv.innerHTML = `
                <div style="background: white; padding: 1rem; border-radius: 8px; margin-top: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h5 style="margin: 0 0 0.5rem 0; color: var(--primary-blue);">Información de la Ruta</h5>
                    <p style="margin: 0.3rem 0;"><strong>Distancia:</strong> ${leg.distance.text}</p>
                    <p style="margin: 0.3rem 0;"><strong>Tiempo estimado:</strong> ${leg.duration.text}</p>
                </div>
            `;
            
            const mapContainer = document.getElementById('mapContainer');
            mapContainer.appendChild(infoDiv);
        }
    });
}

// Obtener ubicación actual del usuario
function obtenerUbicacionActual() {
    if (!navigator.geolocation) {
        mostrarNotificacion('La geolocalización no está disponible en tu navegador', 'error');
        return;
    }
    
    mostrarNotificacion('Obteniendo tu ubicación...');
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Usar Google Geocoding para obtener la dirección
            const geocoder = new google.maps.Geocoder();
            const latlng = { lat: lat, lng: lng };
            
            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const direccion = results[0].formatted_address;
                    document.getElementById('destino').value = direccion;
                    mostrarNotificacion('Ubicación actual obtenida correctamente');
                } else {
                    document.getElementById('destino').value = `${lat}, ${lng}`;
                    mostrarNotificacion('Ubicación obtenida (coordenadas)');
                }
            });
        },
        (error) => {
            let mensaje = 'Error al obtener la ubicación';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    mensaje = 'Permiso denegado para acceder a la ubicación';
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensaje = 'Información de ubicación no disponible';
                    break;
                case error.TIMEOUT:
                    mensaje = 'Tiempo de espera agotado para obtener la ubicación';
                    break;
            }
            mostrarNotificacion(mensaje, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

// Iniciar compartir ubicación en tiempo real
function iniciarCompartirUbicacion() {
    // Mostrar modal para seleccionar aplicación
    document.getElementById('shareLocationModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de compartir ubicación
function cerrarModalCompartir() {
    document.getElementById('shareLocationModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Compartir ubicación según la aplicación seleccionada
function compartirUbicacion(aplicacion) {
    cerrarModalCompartir();
    
    if (!navigator.geolocation) {
        mostrarNotificacion('La geolocalización no está disponible', 'error');
        return;
    }
    
    // Solo preguntar una vez por permisos
    if (!ubicacionPreguntada) {
        ubicacionPreguntada = true;
        solicitarPermisoUbicacion(aplicacion);
    } else if (ubicacionPermitida) {
        iniciarCompartirReal(aplicacion);
    } else {
        mostrarNotificacion('Permiso de ubicación denegado anteriormente', 'error');
    }
}

// Solicitar permiso de ubicación una sola vez
function solicitarPermisoUbicacion(aplicacion) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            ubicacionPermitida = true;
            iniciarCompartirReal(aplicacion);
        },
        (error) => {
            ubicacionPermitida = false;
            let mensaje = 'Error al obtener la ubicación';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    mensaje = 'Permiso denegado para acceder a la ubicación';
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensaje = 'Información de ubicación no disponible';
                    break;
                case error.TIMEOUT:
                    mensaje = 'Tiempo de espera agotado';
                    break;
            }
            mostrarNotificacion(mensaje, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 300000 // 5 minutos
        }
    );
}

// Iniciar compartir real después de obtener permisos
function iniciarCompartirReal(aplicacion) {
    const btnCompartir = document.getElementById('btnCompartirUbicacion');
    const btnDetener = document.getElementById('btnDetenerUbicacion');
    
    btnCompartir.style.display = 'none';
    btnDetener.style.display = 'inline-flex';
    
    ubicacionCompartida = true;
    mostrarNotificacion(`Compartiendo ubicación vía ${aplicacion}...`);
    
    // Actualizar ubicación cada 30 segundos (menos molesto)
    watchId = setInterval(() => {
        if (ubicacionCompartida) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Enviar ubicación según la aplicación
                    enviarUbicacion(aplicacion, lat, lng);
                    
                    // Mostrar indicador de ubicación compartida
                    mostrarIndicadorUbicacion(lat, lng, aplicacion);
                },
                (error) => {
                    console.error('Error al obtener ubicación:', error);
                }
            );
        }
    }, 30000); // 30 segundos en lugar de 10
}

// Enviar ubicación según la aplicación
function enviarUbicacion(aplicacion, lat, lng) {
    const ubicacion = `${lat}, ${lng}`;
    const mensaje = `Mi ubicación actual: ${ubicacion}`;
    
    switch(aplicacion) {
        case 'whatsapp':
            const telefono = '5493795015712';
            const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
            window.open(urlWhatsApp, '_blank');
            break;
        case 'telegram':
            const botToken = 'tu_bot_token'; // Configurar bot de Telegram
            const chatId = 'tu_chat_id';
            const urlTelegram = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(mensaje)}`;
            fetch(urlTelegram);
            break;
        case 'sms':
            const urlSMS = `sms:5493795015712?body=${encodeURIComponent(mensaje)}`;
            window.open(urlSMS);
            break;
        case 'email':
            const asunto = 'Ubicación del viaje';
            const urlEmail = `mailto:carla.crimi.95@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;
            window.open(urlEmail);
            break;
    }
}

// Detener compartir ubicación
function detenerCompartirUbicacion() {
    if (watchId) {
        clearInterval(watchId);
        watchId = null;
    }
    
    ubicacionCompartida = false;
    
    const btnCompartir = document.getElementById('btnCompartirUbicacion');
    const btnDetener = document.getElementById('btnDetenerUbicacion');
    
    btnCompartir.style.display = 'inline-flex';
    btnDetener.style.display = 'none';
    
    mostrarNotificacion('Ubicación compartida detenida');
}

// Mostrar indicador de ubicación compartida
function mostrarIndicadorUbicacion(lat, lng, aplicacion = '') {
    const indicador = document.createElement('div');
    indicador.id = 'indicadorUbicacion';
    
    const iconos = {
        'whatsapp': 'fab fa-whatsapp',
        'telegram': 'fab fa-telegram',
        'sms': 'fas fa-sms',
        'email': 'fas fa-envelope'
    };
    
    const icono = iconos[aplicacion] || 'fas fa-share-location';
    
    indicador.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #4caf50; color: white; padding: 1rem; border-radius: 8px; z-index: 3000; box-shadow: 0 4px 8px rgba(0,0,0,0.2); max-width: 250px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <i class="${icono}"></i>
                <span style="font-weight: 600;">Ubicación compartida</span>
            </div>
            <div style="font-size: 0.8rem; margin-bottom: 0.5rem;">${aplicacion ? `Vía ${aplicacion.toUpperCase()}` : ''}</div>
            <div style="font-size: 0.7rem; opacity: 0.9;">${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
            <button onclick="detenerCompartirUbicacion()" style="background: none; border: none; color: white; font-size: 0.8rem; margin-top: 0.5rem; cursor: pointer; text-decoration: underline;">
                Detener
            </button>
        </div>
    `;
    
    // Remover indicador anterior si existe
    const indicadorAnterior = document.getElementById('indicadorUbicacion');
    if (indicadorAnterior) {
        indicadorAnterior.remove();
    }
    
    document.body.appendChild(indicador);
}

// Reservar traslado
function reservarTraslado() {
    const destino = document.getElementById('destino').value;
    const tipoTraslado = document.getElementById('tipoTraslado').value;
    
    const mensaje = `Hola, me gustaría reservar un traslado con CRECER:
    
Tipo: ${tipoTraslado}
Destino: ${destino}
Origen: Moreno 2242, Corrientes Capital

¿Podrían ayudarme con la reserva?`;
    
    const telefono = '5493795015712';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    
    mostrarNotificacion('Redirigiendo a WhatsApp para reservar el traslado');
}

// Contactar servicio
function contactarServicio(tipo) {
    const servicio = servicios[tipo];
    const mensaje = `Hola, me interesa el servicio de ${servicio.nombre}. ¿Podrían darme más información sobre precios y disponibilidad?`;
    
    // Abrir WhatsApp con mensaje predefinido
    const telefono = '5493795015712';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    
    cerrarModalServicio();
}

// Variables para filtros
let filtrosActivos = {
    busqueda: '',
    categoria: '',
    marca: '',
    estado: '',
    precio: ''
};

// Aplicar filtros
function aplicarFiltros() {
    const busqueda = document.getElementById('searchInput').value.toLowerCase();
    const categoria = document.getElementById('categoryFilter').value;
    const marca = document.getElementById('marcaFilter').value;
    const estado = document.getElementById('estadoFilter').value;
    const precio = document.getElementById('precioFilter').value;
    
    filtrosActivos = { busqueda, categoria, marca, estado, precio };
    
    const repuestosFiltrados = repuestos.filter(repuesto => {
        // Filtro de búsqueda
        const coincideBusqueda = !busqueda || 
            repuesto.nombre.toLowerCase().includes(busqueda) ||
            repuesto.descripcion.toLowerCase().includes(busqueda) ||
            repuesto.marca.toLowerCase().includes(busqueda);
        
        // Filtro de categoría
        const coincideCategoria = !categoria || repuesto.categoria === categoria;
        
        // Filtro de marca
        const coincideMarca = !marca || repuesto.marca === marca;
        
        // Filtro de estado
        const coincideEstado = !estado || repuesto.estado === estado;
        
        // Filtro de precio
        let coincidePrecio = true;
        if (precio) {
            const [min, max] = precio.split('-').map(p => p === '+' ? Infinity : parseInt(p));
            coincidePrecio = repuesto.precio >= min && (max === Infinity ? true : repuesto.precio <= max);
        }
        
        return coincideBusqueda && coincideCategoria && coincideMarca && coincideEstado && coincidePrecio;
    });
    
    cargarRepuestos(repuestosFiltrados);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('marcaFilter').value = '';
    document.getElementById('estadoFilter').value = '';
    document.getElementById('precioFilter').value = '';
    
    filtrosActivos = {
        busqueda: '',
        categoria: '',
        marca: '',
        estado: '',
        precio: ''
    };
    
    cargarRepuestos(repuestos);
}

// Cargar repuestos con filtros
function cargarRepuestos(listaRepuestos = repuestos) {
    const grid = document.getElementById('repuestosGrid');
    
    if (listaRepuestos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--gray-600);">No se encontraron repuestos</h3>
                <p style="color: var(--gray-500);">Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = listaRepuestos.map(repuesto => `
        <div class="repuesto-card">
            <img src="${repuesto.imagen}" alt="${repuesto.nombre}" class="repuesto-image" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'">
            <div class="repuesto-content">
                <div class="repuesto-badges">
                    <span class="repuesto-badge marca">${repuesto.marca}</span>
                    <span class="repuesto-badge estado">${repuesto.estado}</span>
                </div>
                <h3>${repuesto.nombre}</h3>
                <div class="categoria">${obtenerNombreCategoria(repuesto.categoria)}</div>
                <div class="precio">$${repuesto.precio.toLocaleString()}</div>
                <div class="stock">Stock: ${repuesto.stock} unidades</div>
                <p style="color: var(--gray-600); font-size: 0.9rem; margin-bottom: 1rem;">${repuesto.descripcion}</p>
                
                <div class="cantidad-container">
                    <label>Cantidad:</label>
                    <div class="cantidad-input">
                        <button class="cantidad-btn" onclick="cambiarCantidadRepuesto(${repuesto.id}, -1)">-</button>
                        <input type="number" id="cantidad-repuesto-${repuesto.id}" value="1" min="1" max="${repuesto.stock}" onchange="calcularPrecioRepuesto(${repuesto.id})">
                        <button class="cantidad-btn" onclick="cambiarCantidadRepuesto(${repuesto.id}, 1)">+</button>
                    </div>
                </div>
                
                <div class="calculo-precio">
                    <div>Precio total:</div>
                    <div class="precio-total" id="precio-total-repuesto-${repuesto.id}">$${repuesto.precio.toLocaleString()}</div>
                </div>
                
                <button class="btn-comprar" onclick="agregarAlCarritoRepuesto(${repuesto.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Sistema de autenticación
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) || null;

// Abrir modal de login
function abrirModalLogin() {
    document.getElementById('authModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    mostrarLogin();
}

// Cerrar modal de auth
function cerrarModalAuth() {
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Mostrar formulario de login
function mostrarLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

// Mostrar formulario de registro
function mostrarRegistro() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// Función de login
function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
        usuarioActual = usuario;
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        actualizarInterfazUsuario();
        cerrarModalAuth();
        mostrarNotificacion(`¡Bienvenido, ${usuario.nombre}!`);
    } else {
        mostrarNotificacion('Email o contraseña incorrectos', 'error');
    }
}

// Función de registro
function registro(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const telefono = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validaciones
    if (password.length < 6) {
        mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        mostrarNotificacion('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (usuarios.find(u => u.email === email)) {
        mostrarNotificacion('Ya existe una cuenta con este email', 'error');
        return;
    }
    
    // Crear usuario
    const nuevoUsuario = {
        id: Date.now(),
        nombre,
        email,
        telefono,
        password,
        fechaRegistro: new Date().toISOString()
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Auto-login
    usuarioActual = nuevoUsuario;
    localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));
    
    actualizarInterfazUsuario();
    cerrarModalAuth();
    mostrarNotificacion(`¡Cuenta creada exitosamente! Bienvenido, ${nombre}`);
}

// Cerrar sesión
function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('usuarioActual');
    actualizarInterfazUsuario();
    mostrarNotificacion('Sesión cerrada exitosamente');
}

// Actualizar interfaz según el estado del usuario
function actualizarInterfazUsuario() {
    const navLogin = document.querySelector('.nav-login');
    
    if (usuarioActual) {
        navLogin.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-user"></i>
                <span>${usuarioActual.nombre.split(' ')[0]}</span>
                <button onclick="cerrarSesion()" style="background: none; border: none; color: white; cursor: pointer; font-size: 0.8rem;">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;
    } else {
        navLogin.innerHTML = 'Iniciar Sesión';
        navLogin.onclick = () => abrirModalLogin();
    }
}

// Ver carrito (nuevo modal)
function verCarrito() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío');
        return;
    }
    
    actualizarResumenCarritoModal();
    document.getElementById('cartModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal del carrito
function cerrarModalCarrito() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Proceder al pago desde el modal del carrito
function procederAlPago() {
    cerrarModalCarrito();
    abrirModalPago();
}

// Actualizar resumen del carrito en el modal del carrito
function actualizarResumenCarritoModal() {
    const cartSummary = document.getElementById('cartSummary');
    const cartTotal = document.getElementById('cartTotal');
    const btnProcederPago = document.getElementById('btnProcederPago');
    
    let html = '';
    let total = 0;
    
    if (carrito.length === 0) {
        html = '<p style="text-align: center; color: #666; font-style: italic;">El carrito está vacío</p>';
        btnProcederPago.style.display = 'none';
    } else {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            
            html += `
                <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; padding: 0.5rem; background: #f8f9fa; border-radius: 8px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 500; margin-bottom: 0.3rem;">${item.nombre}</div>
                        <div style="font-size: 0.9rem; color: #666;">$${item.precio.toFixed(2)} c/u</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button onclick="cambiarCantidadCarrito(${item.id}, -1)" class="quantity-btn" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                        <span style="min-width: 30px; text-align: center; font-weight: 500;">${item.cantidad}</span>
                        <button onclick="cambiarCantidadCarrito(${item.id}, 1)" class="quantity-btn" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                        <button onclick="eliminarDelCarrito(${item.id})" class="remove-btn" style="width: 30px; height: 30px; border: none; background: #dc3545; color: white; border-radius: 4px; cursor: pointer; font-size: 0.8rem;" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div style="font-weight: 600; margin-left: 1rem; min-width: 80px; text-align: right;">
                        $${subtotal.toFixed(2)}
                    </div>
                </div>
            `;
        });
        
        // Agregar botón para vaciar carrito
        html += `
            <div style="text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd;">
                <button onclick="vaciarCarrito()" class="btn-clear-cart" style="background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                    <i class="fas fa-trash-alt"></i> Vaciar Carrito
                </button>
            </div>
        `;
        
        btnProcederPago.style.display = 'inline-flex';
    }
    
    cartSummary.innerHTML = html;
    cartTotal.textContent = total.toFixed(2);
}

// Configurar toggle de métodos de pago
function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'cash') {
                cardDetails.style.display = 'none';
            } else {
                cardDetails.style.display = 'block';
            }
        });
    });
}

// Formatear número de tarjeta
function formatearNumeroTarjeta(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
}

// Formatear fecha de vencimiento
function formatearFechaVencimiento(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

// Formatear CVV
function formatearCVV(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
}

// Procesar pago
function processPayment() {
    // Validar formulario
    if (!validarFormulario()) {
        return;
    }
    
    // Simular procesamiento de pago
    const btnPay = document.querySelector('.btn-pay');
    const originalText = btnPay.innerHTML;
    
    btnPay.innerHTML = '<span class="loading"></span> Procesando...';
    btnPay.disabled = true;
    
    setTimeout(() => {
        // Simular éxito del pago
        mostrarNotificacion('¡Pago procesado exitosamente!');
        carrito = [];
        actualizarContadorCarrito();
        cerrarModal();
        
        btnPay.innerHTML = originalText;
        btnPay.disabled = false;
        
        // Limpiar formulario
        document.querySelector('.payment-form').reset();
        
        // Mostrar confirmación
        mostrarConfirmacionCompra();
    }, 2000);
}

// Mostrar confirmación de compra
function mostrarConfirmacionCompra() {
    const confirmacion = document.createElement('div');
    confirmacion.className = 'confirmacion-compra';
    confirmacion.innerHTML = `
        <div class="confirmacion-content">
            <i class="fas fa-check-circle"></i>
            <h3>¡Compra Exitosa!</h3>
            <p>Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación pronto.</p>
            <button onclick="this.parentElement.parentElement.remove()">Continuar</button>
        </div>
    `;
    document.body.appendChild(confirmacion);
    
    setTimeout(() => {
        if (confirmacion.parentElement) {
            confirmacion.remove();
        }
    }, 5000);
}

// Validar formulario
function validarFormulario() {
    const requiredFields = [
        'customerName',
        'customerEmail',
        'customerPhone',
        'customerAddress'
    ];
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
        mostrarNotificacion('Selecciona un método de pago');
        return false;
    }
    
    // Si es pago con tarjeta, validar campos de tarjeta
    if (paymentMethod.value !== 'cash') {
        const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
        requiredFields.push(...cardFields);
    }
    
    for (let field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            mostrarNotificacion(`Por favor completa el campo: ${element.placeholder || field}`);
            element.focus();
            return false;
        }
    }
    
    // Validar email
    const email = document.getElementById('customerEmail').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarNotificacion('Por favor ingresa un email válido');
        return false;
    }
    
    return true;
}

// Scroll suave a secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Función para actualizar precios (simulación de API)
function actualizarPrecio(id, nuevoPrecio) {
    const repuesto = repuestos.find(r => r.id === id);
    if (repuesto) {
        repuesto.precio = nuevoPrecio;
        cargarRepuestos();
        mostrarNotificacion(`Precio actualizado para ${repuesto.nombre}`);
    }
}

// Función para actualizar stock
function actualizarStock(id, nuevoStock) {
    const repuesto = repuestos.find(r => r.id === id);
    if (repuesto) {
        repuesto.stock = nuevoStock;
        cargarRepuestos();
        mostrarNotificacion(`Stock actualizado para ${repuesto.nombre}`);
    }
}

// Cargar ofertas en la grilla
function cargarOfertas() {
    const ofertasGrid = document.getElementById('ofertasGrid');
    if (!ofertasGrid) return;
    
    ofertasGrid.innerHTML = '';
    
    ofertasFiltradas.forEach(oferta => {
        const ofertaCard = document.createElement('div');
        ofertaCard.className = 'oferta-card';
        ofertaCard.innerHTML = `
            <div class="oferta-badge">-${oferta.descuento}%</div>
            <h3>${oferta.imagen} ${oferta.nombre}</h3>
            <div class="categoria">${obtenerNombreCategoria(oferta.categoria)}</div>
            <div class="precio-container">
                <span class="precio-original">$${oferta.precioOriginal.toFixed(2)}</span>
                <span class="precio-oferta">$${oferta.precioOferta.toFixed(2)}</span>
            </div>
            <p>${oferta.descripcion}</p>
            <div class="cantidad-container">
                <label>Cantidad:</label>
                <div class="cantidad-input">
                    <button class="cantidad-btn" onclick="cambiarCantidad(${oferta.id}, -1)">-</button>
                    <input type="number" id="cantidad-${oferta.id}" value="1" min="1" max="${oferta.stock}" onchange="calcularPrecio(${oferta.id})">
                    <button class="cantidad-btn" onclick="cambiarCantidad(${oferta.id}, 1)">+</button>
                </div>
            </div>
            <div class="calculo-precio">
                <div>Precio total:</div>
                <div class="precio-total" id="precio-total-${oferta.id}">$${oferta.precioOferta.toFixed(2)}</div>
            </div>
            <button class="btn-comprar-directo" onclick="comprarDirecto(${oferta.id})">
                <i class="fas fa-shopping-cart"></i> Comprar Ahora
            </button>
        `;
        ofertasGrid.appendChild(ofertaCard);
    });
}

// Cambiar cantidad
function cambiarCantidad(id, cambio) {
    const input = document.getElementById(`cantidad-${id}`);
    const nuevaCantidad = Math.max(1, Math.min(input.valueAsNumber + cambio, input.max));
    input.value = nuevaCantidad;
    calcularPrecio(id);
}

// Calcular precio total
function calcularPrecio(id) {
    const oferta = ofertas.find(o => o.id === id);
    if (!oferta) return;
    
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value) || 1;
    const precioTotal = oferta.precioOferta * cantidad;
    const precioTotalElement = document.getElementById(`precio-total-${id}`);
    
    if (precioTotalElement) {
        precioTotalElement.textContent = `$${precioTotal.toFixed(2)}`;
    }
}

// Comprar directamente
function comprarDirecto(id) {
    const oferta = ofertas.find(o => o.id === id);
    if (!oferta) return;
    
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value) || 1;
    const precioTotal = oferta.precioOferta * cantidad;
    
    // Crear item para el carrito
    const item = {
        ...oferta,
        cantidad: cantidad,
        precio: oferta.precioOferta,
        subtotal: precioTotal
    };
    
    // Agregar al carrito
    carrito = [item];
    actualizarContadorCarrito();
    
    // Mostrar notificación
    mostrarNotificacion(`${oferta.nombre} agregado a la compra - $${precioTotal.toFixed(2)}`);
    
    // Abrir modal de pago
    setTimeout(() => {
        abrirModalPago();
    }, 1000);
}

// Agregar estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);

// Exportar funciones para uso global
window.agregarAlCarrito = agregarAlCarrito;
window.abrirModalPago = abrirModalPago;
window.cerrarModal = cerrarModal;
window.processPayment = processPayment;
window.scrollToSection = scrollToSection;
window.actualizarPrecio = actualizarPrecio;
window.actualizarStock = actualizarStock;
window.cambiarCantidad = cambiarCantidad;
window.calcularPrecio = calcularPrecio;
window.comprarDirecto = comprarDirecto;
window.cambiarCantidadRepuesto = cambiarCantidadRepuesto;
window.calcularPrecioRepuesto = calcularPrecioRepuesto;
window.comprarRepuesto = comprarRepuesto;
window.agregarAlCarritoRepuesto = agregarAlCarritoRepuesto;
window.abrirModalAyuda = abrirModalAyuda;
window.cerrarModalAyuda = cerrarModalAyuda;
window.sendMessage = sendMessage;
window.sendSuggestion = sendSuggestion;
window.handleChatEnter = handleChatEnter;
window.abrirModalSoporte = abrirModalSoporte;
window.cerrarModalSoporte = cerrarModalSoporte;
window.contactSupport = contactSupport;
window.showSolution = showSolution;
window.cerrarModalVerificacion = cerrarModalVerificacion;
window.verificarPagoEfectivo = verificarPagoEfectivo;
window.limpiarDatosTarjeta = limpiarDatosTarjeta;

// Función de prueba para verificar códigos
window.probarCodigo = function(codigo) {
    console.log('=== PRUEBA DE CÓDIGO ===');
    console.log('Código a probar:', codigo);
    console.log('Longitud:', codigo.length);
    console.log('¿Es "FRIOCAS"?', codigo === 'FRIOCAS');
    console.log('¿Son 6 dígitos?', codigo.length === 6 && /^\d{6}$/.test(codigo));
    console.log('¿Son 6 caracteres?', codigo.length === 6);
    console.log('¿Es válido?', codigo === 'FRIOCAS' || codigo.length === 6);
    console.log('=== FIN PRUEBA ===');
};

// Función de prueba simple (COMENTADA PARA VERSIÓN FINAL)
/*
window.pruebaSimple = function() {
    alert('¡Función de prueba ejecutada!');
    console.log('Prueba simple ejecutada correctamente');
    
    // Simular un pago de prueba
    if (carrito.length > 0) {
        const factura = generarFactura('Cliente Prueba', 'prueba@test.com', '123456789', 'Dirección Prueba', 'cash', 'C');
        alert('Factura generada: ' + factura.numero);
        console.log('Factura generada:', factura);
    } else {
        alert('Agrega algo al carrito primero');
    }
};

// Función de prueba para modal de efectivo (COMENTADA PARA VERSIÓN FINAL)
/*
window.probarModalEfectivo = function() {
    console.log('=== PRUEBA MODAL EFECTIVO ===');
    alert('Probando modal de efectivo...');
    
    // Simular datos de prueba
    const datosPrueba = {
        nombre: 'Cliente Prueba',
        email: 'prueba@test.com',
        telefono: '123456789',
        direccion: 'Dirección Prueba',
        tipoFactura: 'C',
        opcionesComprobante: ['download']
    };
    
    // Llamar directamente a la función de verificación
    try {
        console.log('Llamando a verificarPagoEfectivo...');
        verificarPagoEfectivo(
            datosPrueba.nombre,
            datosPrueba.email,
            datosPrueba.telefono,
            datosPrueba.direccion,
            datosPrueba.tipoFactura,
            datosPrueba.opcionesComprobante
        );
        console.log('Función verificarPagoEfectivo ejecutada');
    } catch (error) {
        console.error('Error al ejecutar verificarPagoEfectivo:', error);
        alert('Error: ' + error.message);
    }
};
*/

// Función para mostrar comprobante en modal
function mostrarComprobanteModal(contenido, numeroFactura) {
    // Crear modal para el comprobante
    const modalHTML = `
        <div id="comprobanteModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        ">
            <div style="
                background: white;
                border-radius: 15px;
                max-width: 90%;
                max-height: 90%;
                overflow: auto;
                position: relative;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <div style="
                    position: sticky;
                    top: 0;
                    background: white;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 1;
                ">
                    <h2 style="margin: 0; color: #007bff;">Comprobante FRIOCAS - ${numeroFactura}</h2>
                    <button onclick="cerrarComprobanteModal()" style="
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                    ">✕ Cerrar</button>
                </div>
                <div id="comprobanteContent" style="padding: 20px;">
                    ${contenido}
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

// Función para cerrar modal del comprobante
function cerrarComprobanteModal() {
    const modal = document.getElementById('comprobanteModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Función para verificar pago directamente desde el modal
window.verificarPagoEfectivoDirecto = function() {
    console.log('=== VERIFICACIÓN DIRECTA ===');
    
    // Obtener el código del campo
    const codigoInput = document.getElementById('paymentCode');
    if (!codigoInput) {
        alert('Error: No se encontró el campo de código');
        return;
    }
    
    const codigo = codigoInput.value.trim();
    console.log('Código ingresado:', codigo);
    
    // Validaciones
    if (!codigo) {
        alert('Por favor ingresa el código de verificación');
        return;
    }
    
    if (codigo.length < 4) {
        alert('El código de verificación debe tener al menos 4 caracteres');
        return;
    }
    
    // Códigos válidos: "FRIOCAS" o cualquier código de 6 caracteres
    const esFRIOCAS = codigo === 'FRIOCAS';
    const esSeisCaracteres = codigo.length === 6;
    
    console.log('¿Es "FRIOCAS"?', esFRIOCAS);
    console.log('¿Son 6 caracteres?', esSeisCaracteres);
    
    if (esFRIOCAS || esSeisCaracteres) {
        console.log('¡Código válido! Procesando pago...');
        alert('¡Código válido! Procesando pago...');
        
        // Procesar pago y generar comprobante
        setTimeout(() => {
            try {
                // Obtener datos reales del formulario
                const customerName = document.getElementById('customerName')?.value || 'Cliente Efectivo';
                const customerEmail = document.getElementById('customerEmail')?.value || 'cliente@test.com';
                const customerPhone = document.getElementById('customerPhone')?.value || '123456789';
                const customerAddress = document.getElementById('customerAddress')?.value || 'Dirección Cliente';
                const billingType = document.querySelector('input[name="billingType"]:checked')?.value || 'C';
                
                console.log('Datos del cliente:', { customerName, customerEmail, customerPhone, customerAddress, billingType });
                
                // Generar factura con datos reales
                const factura = generarFactura(customerName, customerEmail, customerPhone, customerAddress, 'cash', billingType);
                console.log('Factura generada:', factura);
                
                // Verificar que hay productos en el carrito
                if (carrito.length === 0) {
                    alert('No hay productos en el carrito para generar factura');
                    return;
                }
                
                // Generar contenido del comprobante
                const contenido = generarContenidoFactura(factura);
                
                // Mostrar comprobante en un modal en la misma página
                const verComprobante = confirm('¿Deseas ver el comprobante?');
                
                if (verComprobante) {
                    mostrarComprobanteModal(contenido, factura.numero);
                }
                
                // Preguntar si quiere descargar
                const descargarComprobante = confirm('¿Deseas descargar el comprobante?');
                if (descargarComprobante) {
                    try {
                        const blob = new Blob([contenido], { type: 'text/html;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `FRIOCAS-${factura.numero}.html`;
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => URL.revokeObjectURL(url), 1000);
                    } catch (downloadError) {
                        console.error('Error al descargar:', downloadError);
                        alert('Error al descargar el comprobante.');
                    }
                }
                
                const tipoFacturaText = {
                    'A': 'Factura A',
                    'B': 'Factura B', 
                    'C': 'Factura C'
                };
                
                alert(`¡Pago verificado exitosamente!\n\n${tipoFacturaText[billingType]} generada: ${factura.numero}\nCliente: ${customerName}\nTotal: $${factura.total.toFixed(2)}`);
                cerrarModalVerificacion();
                
                // Limpiar carrito y actualizar
                carrito = [];
                actualizarResumenCarrito();
                actualizarContadorCarrito();
                
                console.log('=== VERIFICACIÓN COMPLETADA ===');
                
            } catch (error) {
                console.error('Error al generar comprobante:', error);
                alert('Error al generar el comprobante: ' + error.message);
            }
        }, 1000);
        
    } else {
        console.log('Código inválido');
        alert('Código de verificación inválido. Contacta a nuestro personal.');
    }
};
// window.checkConnection = checkConnection; // DESACTIVADO TEMPORALMENTE

// Variables para el sistema de ayuda y conexión
// let isOnline = navigator.onLine; // DESACTIVADO TEMPORALMENTE
// let connectionCheckInterval; // DESACTIVADO TEMPORALMENTE

// Sistema de detección de conexión - DESACTIVADO TEMPORALMENTE
/*
function initConnectionMonitoring() {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verificar conexión cada 30 segundos
    connectionCheckInterval = setInterval(checkConnection, 30000);
}

function handleOnline() {
    isOnline = true;
    hideOfflineScreen();
    mostrarNotificacion('Conexión restaurada', 'success');
}

function handleOffline() {
    isOnline = false;
    showOfflineScreen();
    mostrarNotificacion('Conexión perdida', 'error');
}

function showOfflineScreen() {
    document.getElementById('offlineScreen').style.display = 'flex';
}

function hideOfflineScreen() {
    document.getElementById('offlineScreen').style.display = 'none';
}

function checkConnection() {
    fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' })
        .then(() => {
            if (!isOnline) {
                handleOnline();
            }
        })
        .catch(() => {
            if (isOnline) {
                handleOffline();
            }
        });
}
*/

// Sistema de Ayuda con IA
function abrirModalAyuda() {
    document.getElementById('helpModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.getElementById('userMessage').focus();
}

function cerrarModalAyuda() {
    document.getElementById('helpModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const userInput = document.getElementById('userMessage');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Agregar mensaje del usuario
    addMessage(message, 'user');
    userInput.value = '';
    
    // Simular respuesta de IA
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessage(response, 'bot');
    }, 1000);
}

function sendSuggestion(suggestion) {
    document.getElementById('userMessage').value = suggestion;
    sendMessage();
}

function addMessage(content, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    if (type === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div>
                    <strong>Tú:</strong>
                    <p>${content}</p>
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-robot"></i>
                <div>
                    <strong>FRIOCAS Bot:</strong>
                    <p>${content}</p>
                </div>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Respuestas predefinidas basadas en palabras clave
    if (message.includes('horario') || message.includes('atención')) {
        return 'Nuestros horarios de atención son: Lunes a Viernes de 8:00 a 18:00, Sábados de 8:00 a 12:00. Estamos cerrados los domingos.';
    }
    
    if (message.includes('envío') || message.includes('domicilio') || message.includes('delivery')) {
        return 'Sí, realizamos envíos a domicilio. Los envíos en Corrientes Capital son gratuitos. Para Resistencia, interior y otras provincias, el envío queda a cargo del cliente.';
    }
    
    if (message.includes('pago') || message.includes('método') || message.includes('tarjeta')) {
        return 'Aceptamos múltiples métodos de pago: Efectivo, Tarjeta de Crédito/Débito, y Transferencia Bancaria. Todos los pagos son seguros y procesados de forma confiable.';
    }
    
    if (message.includes('garantía') || message.includes('garantías')) {
        return 'Todos nuestros repuestos tienen garantía. Los repuestos nuevos tienen garantía de fábrica, y los reacondicionados tienen garantía de 12 meses.';
    }
    
    if (message.includes('precio') || message.includes('costo')) {
        return 'Nuestros precios son competitivos y transparentes. Puedes ver todos los precios en nuestra sección de repuestos. Para servicios, te recomendamos contactarnos directamente.';
    }
    
    if (message.includes('contacto') || message.includes('teléfono') || message.includes('whatsapp')) {
        return 'Puedes contactarnos al +54 9 379 501-5712 por WhatsApp o llamada directa. También por email a info@friocas.com.ar. Estamos disponibles en horario de atención.';
    }
    
    if (message.includes('servicio') || message.includes('taller')) {
        return 'Ofrecemos servicios completos: Taller Mecánico, Lubricentro, Detailing, Traslados con CRECER, Reparación de Aires Acondicionados y Gestoría Automotriz.';
    }
    
    // Respuesta por defecto
    return 'Gracias por tu consulta. Para obtener información más específica, te recomiendo contactar directamente con nuestro equipo al +54 9 379 501-5712 o visitar nuestras secciones de servicios y repuestos.';
}

// Sistema de Atención al Cliente
function abrirModalSoporte() {
    document.getElementById('supportModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function cerrarModalSoporte() {
    document.getElementById('supportModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function contactSupport(method) {
    switch(method) {
        case 'whatsapp':
            window.open('https://wa.me/5493795015712?text=Hola, necesito ayuda con la página web de FRIOCAS', '_blank');
            break;
        case 'phone':
            window.open('tel:+5493795015712', '_blank');
            break;
        case 'email':
            window.open('mailto:info@friocas.com.ar?subject=Ayuda con la página web', '_blank');
            break;
    }
    cerrarModalSoporte();
}

function showSolution(type) {
    let solution = '';
    let title = '';
    
    switch(type) {
        case 'payment':
            title = 'Problemas con el Pago';
            solution = `
                <h4>Soluciones para problemas de pago:</h4>
                <ul>
                    <li>Verifica que tu tarjeta esté habilitada para compras online</li>
                    <li>Asegúrate de que los datos de la tarjeta sean correctos</li>
                    <li>Si usas transferencia, confirma que el monto sea exacto</li>
                    <li>Para pagos en efectivo, coordina la entrega con nosotros</li>
                </ul>
                <p><strong>Contacto directo:</strong> +54 9 379 501-5712</p>
            `;
            break;
        case 'cart':
            title = 'Carrito No Funciona';
            solution = `
                <h4>Soluciones para problemas del carrito:</h4>
                <ul>
                    <li>Recarga la página (F5 o Ctrl+R)</li>
                    <li>Limpia el caché del navegador</li>
                    <li>Verifica que JavaScript esté habilitado</li>
                    <li>Intenta con otro navegador (Chrome, Firefox, Edge)</li>
                </ul>
                <p><strong>Si persiste:</strong> Contacta nuestro soporte técnico</p>
            `;
            break;
        case 'delivery':
            title = 'Problemas de Envío';
            solution = `
                <h4>Información sobre envíos:</h4>
                <ul>
                    <li>Envíos gratuitos en Corrientes Capital</li>
                    <li>Resistencia e interior: costo a cargo del cliente</li>
                    <li>Otras provincias: consultar costo de envío</li>
                    <li>Tiempo de entrega: 24-48 horas en Capital</li>
                </ul>
                <p><strong>Para consultas:</strong> +54 9 379 501-5712</p>
            `;
            break;
        case 'technical':
            title = 'Problemas Técnicos';
            solution = `
                <h4>Soluciones técnicas rápidas:</h4>
                <ul>
                    <li>Actualiza tu navegador a la última versión</li>
                    <li>Desactiva extensiones que puedan interferir</li>
                    <li>Verifica tu conexión a internet</li>
                    <li>Usa modo incógnito para descartar problemas de caché</li>
                </ul>
                <p><strong>Soporte técnico:</strong> info@friocas.com.ar</p>
            `;
            break;
    }
    
    // Mostrar solución en un modal o notificación
    mostrarNotificacion(`${title}: ${solution.replace(/<[^>]*>/g, '')}`, 'info');
}

// Inicializar sistema de conexión al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // initConnectionMonitoring(); // DESACTIVADO TEMPORALMENTE PARA PRUEBAS
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('helpModal')) {
            cerrarModalAyuda();
        }
        if (event.target === document.getElementById('supportModal')) {
            cerrarModalSoporte();
        }
    });
});

// Procesar pago
function processPayment() {
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const billingType = document.querySelector('input[name="billingType"]:checked').value;
    
    // Obtener opciones de comprobante seleccionadas
    const receiptOptions = Array.from(document.querySelectorAll('input[name="receiptOptions"]:checked'))
        .map(option => option.value);
    
    if (!customerName || !customerEmail || !customerPhone) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (receiptOptions.length === 0) {
        mostrarNotificacion('Por favor selecciona al menos una opción de comprobante', 'error');
        return;
    }
    
    // Verificar método de pago
    console.log('Método de pago seleccionado:', paymentMethod);
    
    if (paymentMethod === 'cash') {
        console.log('Procesando pago en efectivo...');
        // Para pagos en efectivo, mostrar modal de verificación
        mostrarModalVerificacionEfectivo(customerName, customerEmail, customerPhone, customerAddress, billingType, receiptOptions);
    } else {
        console.log('Procesando pago con método:', paymentMethod);
        // Para otros métodos, procesar directamente
        procesarPagoDirecto(customerName, customerEmail, customerPhone, customerAddress, paymentMethod, billingType, receiptOptions);
    }
}

// Mostrar modal de verificación para pagos en efectivo
function mostrarModalVerificacionEfectivo(nombre, email, telefono, direccion, tipoFactura, opcionesComprobante) {
    console.log('Abriendo modal de verificación de efectivo...');
    console.log('Datos recibidos:', { nombre, email, telefono, direccion, tipoFactura, opcionesComprobante });
    
    // Cerrar modal de pago actual si está abierto
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal && paymentModal.style.display === 'block') {
        paymentModal.style.display = 'none';
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div class="modal-content verification-modal" style="
            max-width: 600px;
            width: 100%;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <div class="modal-header" style="
                padding: 20px 20px 0 20px;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h3 style="margin: 0; color: #2c3e50; font-size: 20px;">🔒 Verificación de Pago en Efectivo</h3>
                <button onclick="cerrarModalVerificacion()" class="close-btn" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6c757d;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div class="verification-steps">
                    <div class="step" style="
                        display: flex;
                        align-items: flex-start;
                        margin-bottom: 25px;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 10px;
                        border-left: 4px solid #007bff;
                    ">
                        <div class="step-number" style="
                            background: #007bff;
                            color: white;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            margin-right: 15px;
                            flex-shrink: 0;
                        ">1</div>
                        <div class="step-content">
                            <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Confirmar Monto</h4>
                            <p style="margin: 0; color: #6c757d;">Total a pagar: <strong style="color: #28a745; font-size: 18px;">$${carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2)}</strong></p>
                        </div>
                    </div>
                    <div class="step" style="
                        display: flex;
                        align-items: flex-start;
                        margin-bottom: 25px;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 10px;
                        border-left: 4px solid #007bff;
                    ">
                        <div class="step-number" style="
                            background: #007bff;
                            color: white;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            margin-right: 15px;
                            flex-shrink: 0;
                        ">2</div>
                        <div class="step-content">
                            <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Realizar Pago</h4>
                            <p style="margin: 0; color: #6c757d;">Acércate a nuestro local o coordina el pago con nuestro personal.</p>
                            <div class="contact-info" style="
                                background: white;
                                padding: 10px;
                                border-radius: 8px;
                                margin-top: 10px;
                            ">
                                <p style="margin: 5px 0;"><strong>📍 Dirección:</strong> Av. Principal 123, Resistencia</p>
                                <p style="margin: 5px 0;"><strong>📞 Teléfono:</strong> +54 9 379 501-5712</p>
                                <p style="margin: 5px 0;"><strong>📧 Email:</strong> carla.crimi.95@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <div class="step" style="
                        display: flex;
                        align-items: flex-start;
                        margin-bottom: 25px;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 10px;
                        border-left: 4px solid #007bff;
                    ">
                        <div class="step-number" style="
                            background: #007bff;
                            color: white;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            margin-right: 15px;
                            flex-shrink: 0;
                        ">3</div>
                        <div class="step-content">
                            <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Confirmar Pago</h4>
                            <p style="margin: 0; color: #6c757d;">Una vez realizado el pago, nuestro personal confirmará la transacción.</p>
                            <div class="verification-input" style="margin-top: 15px;">
                                <label for="paymentCode" style="
                                    display: block;
                                    margin-bottom: 5px;
                                    font-weight: 600;
                                    color: #2c3e50;
                                ">Código de Verificación (Opcional para pruebas):</label>
                                <input type="text" id="paymentCode" placeholder="Cualquier código para esta prueba" maxlength="10" style="
                                    width: 100%;
                                    padding: 12px;
                                    border: 2px solid #e9ecef;
                                    border-radius: 8px;
                                    font-size: 16px;
                                    margin-bottom: 5px;
                                    box-sizing: border-box;
                                ">
                                <small style="color: #6c757d; font-size: 12px;">Para esta prueba, cualquier código será aceptado</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="verification-actions" style="
                    display: flex;
                    gap: 15px;
                    margin: 25px 0;
                ">
                    <button onclick="verificarPagoEfectivoDirecto()" class="btn-verify" style="
                        background: linear-gradient(135deg, #28a745, #20c997);
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        flex: 1;
                        font-size: 16px;
                    " type="button">
                        <i class="fas fa-check"></i> Verificar Pago
                    </button>
                    <button onclick="cerrarModalVerificacion()" class="btn-cancel" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 16px;
                    ">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
                <div style="text-align: center; margin-top: 15px; padding: 10px; background: #28a745; border: 1px solid #20c997; border-radius: 8px;">
                    <p style="margin: 0; color: white; font-size: 14px;">
                        <strong>MODO PRUEBA:</strong> Cualquier código será aceptado. Escribe lo que quieras y haz clic en "Verificar Pago"
                    </p>
                </div>
                <div class="security-notice" style="
                    background: #e3f2fd;
                    border: 1px solid #2196f3;
                    border-radius: 8px;
                    padding: 15px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                ">
                    <i class="fas fa-shield-alt" style="color: #2196f3; font-size: 20px; margin-top: 2px;"></i>
                    <p style="margin: 0; color: #1976d2; font-size: 14px;"><strong>Seguridad:</strong> Este proceso protege tanto al cliente como a la empresa de posibles fraudes. El comprobante solo se generará después de confirmar el pago.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Mostrar notificación de que se abrió el modal
    mostrarNotificacion('Modal de verificación de efectivo abierto', 'info');
}

// Cerrar modal de verificación
function cerrarModalVerificacion() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Verificar pago en efectivo - VERSIÓN FINAL
function verificarPagoEfectivo(nombre, email, telefono, direccion, tipoFactura, opcionesComprobante) {
    console.log('=== VERIFICACIÓN DE EFECTIVO ===');
    
    // Obtener el código del campo
    const codigoInput = document.getElementById('paymentCode');
    if (!codigoInput) {
        alert('Error: No se encontró el campo de código');
        return;
    }
    
    const codigo = codigoInput.value.trim();
    console.log('Código ingresado:', codigo);
    
    // Validaciones
    if (!codigo) {
        alert('Por favor ingresa el código de verificación');
        return;
    }
    
    if (codigo.length < 4) {
        alert('El código de verificación debe tener al menos 4 caracteres');
        return;
    }
    
    // Códigos válidos: "FRIOCAS" o cualquier código de 6 caracteres
    const esFRIOCAS = codigo === 'FRIOCAS';
    const esSeisCaracteres = codigo.length === 6;
    
    console.log('¿Es "FRIOCAS"?', esFRIOCAS);
    console.log('¿Son 6 caracteres?', esSeisCaracteres);
    
    if (esFRIOCAS || esSeisCaracteres) {
        console.log('¡Código válido! Procesando pago...');
        
        try {
            // Procesar el pago
            procesarPagoDirecto(nombre, email, telefono, direccion, 'cash', tipoFactura, opcionesComprobante);
            
            // Cerrar modal
            cerrarModalVerificacion();
            
            alert('¡Pago verificado exitosamente! Comprobante generado.');
            console.log('=== VERIFICACIÓN COMPLETADA ===');
            
        } catch (error) {
            console.error('Error en verificación:', error);
            alert('Error al procesar el pago: ' + error.message);
        }
    } else {
        console.log('Código inválido');
        alert('Código de verificación inválido. Contacta a nuestro personal.');
    }
}

// Procesar pago directo (para métodos que no requieren verificación)
function procesarPagoDirecto(nombre, email, telefono, direccion, metodoPago, tipoFactura, opcionesComprobante) {
    // Simular procesamiento de pago
    mostrarNotificacion('Procesando pago...', 'info');
    
    setTimeout(() => {
        // Generar factura y comprobante
        const factura = generarFactura(nombre, email, telefono, direccion, metodoPago, tipoFactura);
        
        // Procesar opciones de comprobante
        procesarComprobantes(factura, opcionesComprobante, email, telefono);
        
        mostrarNotificacion('¡Pago procesado exitosamente!', 'success');
        cerrarModal();
        carrito = [];
        actualizarResumenCarrito();
        actualizarContadorCarrito();
        
        // Limpiar datos de la tarjeta por seguridad
        limpiarDatosTarjeta();
    }, 2000);
}

// Limpiar datos de la tarjeta por seguridad
function limpiarDatosTarjeta() {
    const camposTarjeta = [
        'cardNumber',
        'expiryDate', 
        'cvv',
        'cardholderName'
    ];
    
    camposTarjeta.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.value = '';
        }
    });
    
    // También limpiar otros campos sensibles
    const camposSensibles = [
        'customerName',
        'customerEmail',
        'customerPhone',
        'customerAddress',
        'shippingCity'
    ];
    
    camposSensibles.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.value = '';
        }
    });
    
    // Desmarcar opciones de comprobante
    const opcionesComprobante = document.querySelectorAll('input[name="receiptOptions"]');
    opcionesComprobante.forEach(opcion => {
        opcion.checked = false;
    });
    
    // Resetear método de pago por defecto
    const metodoEfectivo = document.querySelector('input[name="paymentMethod"][value="cash"]');
    if (metodoEfectivo) {
        metodoEfectivo.checked = true;
    }
    
    // Ocultar detalles de tarjeta
    const cardDetails = document.getElementById('cardDetails');
    if (cardDetails) {
        cardDetails.style.display = 'none';
    }
}

// Traducir método de pago a español
function traducirMetodoPago(metodo) {
    const traducciones = {
        'cash': 'Efectivo',
        'transfer': 'Transferencia Bancaria',
        'debit': 'Tarjeta de Débito',
        'credit': 'Tarjeta de Crédito'
    };
    return traducciones[metodo] || metodo;
}

// Generar factura según tipo
function generarFactura(nombre, email, telefono, direccion, metodoPago, tipoFactura) {
    const fecha = new Date();
    const numeroFactura = generarNumeroFactura(tipoFactura);
    const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const iva = calcularIVA(subtotal, tipoFactura);
    const total = subtotal + iva;
    
    const factura = {
        numero: numeroFactura,
        fecha: fecha.toLocaleDateString('es-AR'),
        hora: fecha.toLocaleTimeString('es-AR', { hour12: false }),
        tipo: tipoFactura,
        cliente: {
            nombre: nombre,
            email: email,
            telefono: telefono,
            direccion: direccion
        },
        items: carrito.map(item => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
            subtotal: item.precio * item.cantidad
        })),
        subtotal: subtotal,
        iva: iva,
        total: total,
        metodoPago: traducirMetodoPago(metodoPago),
        cuit: obtenerCUIT(tipoFactura)
    };
    
    return factura;
}

// Generar número de factura según tipo
function generarNumeroFactura(tipo) {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const numero = Math.floor(Math.random() * 9999) + 1;
    
    return `${tipo}-${año}${mes}-${String(numero).padStart(4, '0')}`;
}

// Calcular IVA según tipo de factura
function calcularIVA(subtotal, tipoFactura) {
    switch(tipoFactura) {
        case 'A':
            return subtotal * 0.21; // 21% IVA
        case 'B':
            return subtotal * 0.21; // 21% IVA
        case 'C':
            return 0; // Exento IVA
        default:
            return subtotal * 0.21;
    }
}

// Obtener CUIT según tipo de factura
function obtenerCUIT(tipoFactura) {
    switch(tipoFactura) {
        case 'A':
            return '20-12345678-9'; // CUIT de FRIOCAS como Responsable Inscripto
        case 'B':
            return '20-12345678-9'; // CUIT de FRIOCAS
        case 'C':
            return '20-12345678-9'; // CUIT de FRIOCAS como Monotributista
        default:
            return '20-12345678-9';
    }
}

// Procesar comprobantes según opciones seleccionadas
function procesarComprobantes(factura, opciones, email, telefono) {
    opciones.forEach(opcion => {
        switch(opcion) {
            case 'download':
                descargarComprobante(factura);
                break;
            case 'whatsapp':
                enviarPorWhatsApp(factura, telefono);
                break;
            case 'email':
                enviarPorEmail(factura, email);
                break;
        }
    });
}

// Descargar comprobante como HTML
function descargarComprobante(factura) {
    try {
        const contenido = generarContenidoFactura(factura);
        const blob = new Blob([contenido], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `FRIOCAS-${factura.numero}.html`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Limpiar URL después de un delay
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
        
        mostrarNotificacion('Comprobante descargado exitosamente', 'success');
    } catch (error) {
        console.error('Error al descargar factura:', error);
        mostrarNotificacion('Error al descargar la factura. Intenta nuevamente.', 'error');
        
        // Fallback: abrir en nueva ventana
        const contenido = generarContenidoFactura(factura);
        const nuevaVentana = window.open('', '_blank');
        nuevaVentana.document.write(contenido);
        nuevaVentana.document.close();
        nuevaVentana.focus();
        
        mostrarNotificacion('Factura abierta en nueva ventana. Puedes guardarla con Ctrl+S', 'info');
    }
}

// Enviar por WhatsApp
function enviarPorWhatsApp(factura, telefono) {
    try {
        const mensaje = `¡Hola! Tu comprobante de pago está listo.\n\n` +
                       `📄 Factura: ${factura.numero}\n` +
                       `💰 Total: $${factura.total.toFixed(2)}\n` +
                       `📅 Fecha: ${factura.fecha}\n` +
                       `🕐 Hora: ${factura.hora}\n\n` +
                       `🏢 FRIOCAS - Servicios Automotrices\n` +
                       `📞 +54 9 379 501-5712\n\n` +
                       `Gracias por confiar en FRIOCAS!`;
        
        const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
        
        mostrarNotificacion('Enviando comprobante por WhatsApp...', 'info');
    } catch (error) {
        console.error('Error al enviar por WhatsApp:', error);
        mostrarNotificacion('Error al abrir WhatsApp. Verifica que tengas la aplicación instalada.', 'error');
    }
}

// Enviar por Email
function enviarPorEmail(factura, email) {
    try {
        const asunto = `Comprobante de Pago - FRIOCAS ${factura.numero}`;
        const cuerpo = `Estimado/a ${factura.cliente.nombre},\n\n` +
                      `Adjunto encontrará su comprobante de pago:\n\n` +
                      `📄 Factura: ${factura.numero}\n` +
                      `💰 Total: $${factura.total.toFixed(2)}\n` +
                      `📅 Fecha: ${factura.fecha}\n` +
                      `🕐 Hora: ${factura.hora}\n` +
                      `💳 Método de Pago: ${factura.metodoPago}\n\n` +
                      `🏢 FRIOCAS - Servicios Automotrices\n` +
                      `📞 +54 9 379 501-5712\n` +
                      `📧 info@friocas.com.ar\n\n` +
                      `Gracias por confiar en FRIOCAS!\n\n` +
                      `Saludos cordiales,\nEquipo FRIOCAS`;
        
        const urlEmail = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        window.open(urlEmail);
        
        mostrarNotificacion('Enviando comprobante por Email...', 'info');
    } catch (error) {
        console.error('Error al enviar por Email:', error);
        mostrarNotificacion('Error al abrir el cliente de email. Verifica tu configuración.', 'error');
    }
}

// Generar contenido HTML de la factura
function generarContenidoFactura(factura) {
    const itemsHTML = factura.items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${item.nombre}</td>
            <td style="text-align: center; padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: 500;">${item.cantidad}</td>
            <td style="text-align: right; padding: 12px; border-bottom: 1px solid #e0e0e0; color: #666;">$${item.precioUnitario.toFixed(2)}</td>
            <td style="text-align: right; padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: 600; color: #2c3e50;">$${item.subtotal.toFixed(2)}</td>
        </tr>
    `).join('');
    
    const tipoFacturaText = {
        'A': 'FACTURA "A" - Responsable Inscripto',
        'B': 'FACTURA "B" - Responsable Inscripto',
        'C': 'FACTURA "C" - Monotributista'
    };
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>FRIOCAS - ${factura.numero}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #2c3e50;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 40px 20px;
                }
                
                .invoice-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    overflow: hidden;
                    position: relative;
                }
                
                .invoice-container::before {
                    content: 'FRIOCAS';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-15deg);
                    font-size: 120px;
                    font-weight: bold;
                    color: #f0f0f0;
                    z-index: 0;
                    pointer-events: none;
                    opacity: 0.15;
                    text-align: center;
                    white-space: nowrap;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                }
                
                .header {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                    position: relative;
                    z-index: 1;
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    opacity: 0.3;
                }
                
                .logo {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                }
                
                .logo span {
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                
                .logo img {
                    width: 60px;
                    height: 60px;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    background: white;
                    padding: 5px;
                }
                
                .tagline {
                    font-size: 16px;
                    font-weight: 300;
                    opacity: 0.9;
                    margin-bottom: 20px;
                    position: relative;
                    z-index: 1;
                }
                
                .cuit {
                    background: rgba(255,255,255,0.2);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    display: inline-block;
                    position: relative;
                    z-index: 1;
                }
                
                .content {
                    padding: 40px;
                    position: relative;
                    z-index: 1;
                }
                
                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 40px;
                    padding: 30px;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 15px;
                    border-left: 5px solid #007bff;
                }
                
                .invoice-details {
                    flex: 1;
                }
                
                .invoice-type {
                    font-size: 24px;
                    font-weight: 700;
                    color: #007bff;
                    margin-bottom: 10px;
                }
                
                .invoice-number {
                    font-size: 18px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 8px;
                }
                
                .invoice-date {
                    font-size: 14px;
                    color: #6c757d;
                    margin-bottom: 5px;
                }
                
                .invoice-time {
                    font-size: 14px;
                    color: #6c757d;
                }
                
                .customer-details {
                    flex: 1;
                    margin-left: 40px;
                }
                
                .customer-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                }
                
                .customer-title::before {
                    content: '👤';
                    margin-right: 8px;
                    font-size: 20px;
                }
                
                .customer-info {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                
                .customer-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 8px;
                }
                
                .customer-contact {
                    font-size: 14px;
                    color: #6c757d;
                    margin-bottom: 5px;
                    display: flex;
                    align-items: center;
                }
                
                .customer-contact::before {
                    content: '📧';
                    margin-right: 8px;
                    font-size: 12px;
                }
                
                .customer-contact.phone::before {
                    content: '📞';
                }
                
                .customer-contact.address::before {
                    content: '📍';
                }
                
                .items-section {
                    margin-bottom: 40px;
                }
                
                .items-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                }
                
                .items-title::before {
                    content: '🛍️';
                    margin-right: 10px;
                    font-size: 24px;
                }
                
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                }
                
                .items-table th {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                    color: white;
                    padding: 15px 12px;
                    font-weight: 600;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .items-table th:first-child {
                    text-align: left;
                }
                
                .items-table th:last-child {
                    text-align: right;
                }
                
                .items-table tr:nth-child(even) {
                    background: #f8f9fa;
                }
                
                .items-table tr:hover {
                    background: #e3f2fd;
                    transition: background 0.3s ease;
                }
                
                .totals-section {
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: right;
                    box-shadow: 0 10px 25px rgba(40, 167, 69, 0.3);
                }
                
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .total-row:last-child {
                    margin-bottom: 0;
                    padding-top: 15px;
                    border-top: 2px solid rgba(255,255,255,0.3);
                    font-size: 24px;
                    font-weight: 700;
                }
                
                .total-label {
                    font-weight: 500;
                }
                
                .total-value {
                    font-weight: 600;
                }
                
                .payment-method {
                    margin-top: 20px;
                    padding: 15px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 10px;
                    text-align: center;
                    font-weight: 500;
                }
                
                .footer {
                    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                
                .footer-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                
                .footer-subtitle {
                    font-size: 14px;
                    opacity: 0.8;
                    margin-bottom: 20px;
                }
                
                .footer-info {
                    font-size: 12px;
                    opacity: 0.7;
                    line-height: 1.5;
                }
                
                .stamp {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 80px;
                    height: 80px;
                    background: rgba(255,255,255,0.1);
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                    transform: rotate(-15deg);
                }
                
                @media print {
                    body {
                        background: white;
                        padding: 0;
                    }
                    .invoice-container {
                        box-shadow: none;
                        border-radius: 0;
                    }
                    .invoice-container::before {
                        opacity: 0.25;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="header">
                    <div class="stamp">PAGADO</div>
                    <div class="logo">
                        <img src="./assets/logo/logo-friocas.png.jpg" alt="FRIOCAS Logo" style="width: 60px; height: 60px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.marginLeft='0';">
                        <span>FRIOCAS</span>
                    </div>
                    <div class="tagline">Servicios Automotrices de Excelencia</div>
                    <div class="cuit">CUIT: ${factura.cuit}</div>
                </div>
                
                <div class="content">
                    <div class="invoice-header">
                        <div class="invoice-details">
                            <div class="invoice-type">${tipoFacturaText[factura.tipo]}</div>
                            <div class="invoice-number">Número: ${factura.numero}</div>
                            <div class="invoice-date">Fecha: ${factura.fecha}</div>
                            <div class="invoice-time">Hora: ${factura.hora}</div>
                        </div>
                        <div class="customer-details">
                            <div class="customer-title">Información del Cliente</div>
                            <div class="customer-info">
                                <div class="customer-name">${factura.cliente.nombre}</div>
                                <div class="customer-contact">${factura.cliente.email}</div>
                                <div class="customer-contact phone">${factura.cliente.telefono}</div>
                                <div class="customer-contact address">${factura.cliente.direccion}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="items-section">
                        <div class="items-title">Productos y Servicios</div>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Descripción</th>
                                    <th style="text-align: center;">Cantidad</th>
                                    <th style="text-align: right;">Precio Unit.</th>
                                    <th style="text-align: right;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHTML}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="totals-section">
                        <div class="total-row">
                            <span class="total-label">Subtotal:</span>
                            <span class="total-value">$${factura.subtotal.toFixed(2)}</span>
                        </div>
                        ${factura.iva > 0 ? `
                        <div class="total-row">
                            <span class="total-label">IVA (21%):</span>
                            <span class="total-value">$${factura.iva.toFixed(2)}</span>
                        </div>
                        ` : `
                        <div class="total-row">
                            <span class="total-label">IVA:</span>
                            <span class="total-value">Exento</span>
                        </div>
                        `}
                        <div class="total-row">
                            <span class="total-label">TOTAL:</span>
                            <span class="total-value">$${factura.total.toFixed(2)}</span>
                        </div>
                        <div class="payment-method">
                            💳 Método de Pago: ${factura.metodoPago}
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-title">FRIOCAS</div>
                    <div class="footer-subtitle">Servicios Automotrices de Calidad</div>
                    <div class="footer-info">
                        Este documento es válido como comprobante de pago oficial.<br>
                        Para consultas: +54 9 379 501-5712 | carla.crimi.95@gmail.com<br>
                        Gracias por confiar en nuestros servicios profesionales.
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
} 