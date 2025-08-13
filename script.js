// FRIOCAS - Sistema de Gestión de Repuestos y Servicios
console.log('=== FRIOCAS SCRIPT.JS CARGADO ===');

// Variables globales
let carrito = [];

// Datos de servicios (simulación de base de datos)
let serviciosData = {
    taller: {
        nombre: "Taller Mecánico",
        descripcion: "Servicios de reparación y mantenimiento automotriz",
        estado: "active",
        precioBase: 5000,
        servicios: [
            { nombre: "Cambio de Aceite", precio: 3500 },
            { nombre: "Frenos", precio: 8000 },
            { nombre: "Suspensión", precio: 12000 }
        ]
    },
    aire: {
        nombre: "Reparación de Aires Acondicionados",
        descripcion: "Reparación y mantenimiento de sistemas de aire acondicionado",
        estado: "active",
        precioBase: 8000,
        servicios: [
            { nombre: "Recarga de Gas", precio: 5000 },
            { nombre: "Limpieza de Evaporador", precio: 4500 },
            { nombre: "Reparación de Compresor", precio: 15000 }
        ]
    },
    lubricentro: {
        nombre: "Lubricentro",
        descripcion: "Cambio de aceite y lubricantes",
        estado: "active",
        precioBase: 2500,
        servicios: [
            { nombre: "Aceite Sintético", precio: 4500 },
            { nombre: "Aceite Mineral", precio: 3200 },
            { nombre: "Cambio de Filtros", precio: 2800 }
        ]
    },
    detailing: {
        nombre: "Detailing",
        descripcion: "Limpieza y embellecimiento de vehículos",
        estado: "active",
        precioBase: 6000,
        servicios: [
            { nombre: "Lavado Completo", precio: 3500 },
            { nombre: "Encerado", precio: 4000 },
            { nombre: "Limpieza de Interiores", precio: 5500 }
        ]
    },
    traslados: {
        nombre: "Traslados (CRECER)",
        descripcion: "Servicio de transporte con empresa CRECER",
        estado: "active",
        precioBase: 2000,
        servicios: [
            { nombre: "Hasta 5 km", precio: 2000 },
            { nombre: "5-10 km", precio: 3500 },
            { nombre: "10+ km", precio: 5000 }
        ]
    },
    gestoria: {
        nombre: "Gestión Automotriz",
        descripcion: "Trámites y documentación automotriz",
        estado: "active",
        precioBase: 3500,
        servicios: [
            { nombre: "Transferencia", precio: 8000 },
            { nombre: "Inscripción", precio: 6500 },
            { nombre: "Certificado", precio: 2500 }
        ]
    }
};

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
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop"
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
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop"
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
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop"
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
        imagen: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop"
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
    
    // Configurar actualización de dirección en tiempo real
    setTimeout(() => {
        actualizarDireccionDisplay();
    }, 100);
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
    
    grid.innerHTML = listaRepuestos.map(repuesto => {
        // Verificar si tiene múltiples imágenes
        const tieneMultiplesImagenes = repuesto.imagenes && repuesto.imagenes.length > 1;
        const imagenes = repuesto.imagenes || [repuesto.imagen];
        
        return `
        <div class="repuesto-card">
            <div class="repuesto-image-container">
                <img src="${repuesto.imagen}" alt="${repuesto.nombre}" class="repuesto-image" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'">
                ${tieneMultiplesImagenes ? `
                    <div class="image-gallery-controls">
                        <button class="gallery-btn prev" onclick="cambiarImagenProducto(${repuesto.id}, -1)">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div class="image-counter">1/${imagenes.length}</div>
                        <button class="gallery-btn next" onclick="cambiarImagenProducto(${repuesto.id}, 1)">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="image-dots">
                        ${imagenes.map((_, index) => `
                            <span class="dot ${index === 0 ? 'active' : ''}" onclick="mostrarImagenProducto(${repuesto.id}, ${index})"></span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
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
    `}).join('');
}

// Variables para la galería de imágenes
let imagenActualProducto = {};
let imagenActualOferta = {};

// Función para cambiar imagen del producto
function cambiarImagenProducto(productoId, direccion) {
    const producto = repuestos.find(p => p.id === productoId);
    if (!producto) return;
    
    const imagenes = producto.imagenes || [producto.imagen];
    if (!imagenActualProducto[productoId]) {
        imagenActualProducto[productoId] = 0;
    }
    
    imagenActualProducto[productoId] += direccion;
    
    if (imagenActualProducto[productoId] >= imagenes.length) {
        imagenActualProducto[productoId] = 0;
    } else if (imagenActualProducto[productoId] < 0) {
        imagenActualProducto[productoId] = imagenes.length - 1;
    }
    
    mostrarImagenProducto(productoId, imagenActualProducto[productoId]);
}

// Función para mostrar imagen específica del producto
function mostrarImagenProducto(productoId, indice) {
    const producto = repuestos.find(p => p.id === productoId);
    if (!producto) return;
    
    const imagenes = producto.imagenes || [producto.imagen];
    if (indice < 0 || indice >= imagenes.length) return;
    
    imagenActualProducto[productoId] = indice;
    
    // Actualizar imagen
    const card = document.querySelector(`[onclick*="cambiarImagenProducto(${productoId}"]`).closest('.repuesto-card');
    const img = card.querySelector('.repuesto-image');
    img.src = imagenes[indice];
    
    // Actualizar contador
    const counter = card.querySelector('.image-counter');
    if (counter) {
        counter.textContent = `${indice + 1}/${imagenes.length}`;
    }
    
    // Actualizar dots
    const dots = card.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === indice);
    });
}

// Función para cambiar imagen de la oferta
function cambiarImagenOferta(ofertaId, direccion) {
    const oferta = ofertas.find(o => o.id === ofertaId);
    if (!oferta) return;
    
    const imagenes = oferta.imagenes || [oferta.imagen];
    if (!imagenActualOferta[ofertaId]) {
        imagenActualOferta[ofertaId] = 0;
    }
    
    imagenActualOferta[ofertaId] += direccion;
    
    if (imagenActualOferta[ofertaId] >= imagenes.length) {
        imagenActualOferta[ofertaId] = 0;
    } else if (imagenActualOferta[ofertaId] < 0) {
        imagenActualOferta[ofertaId] = imagenes.length - 1;
    }
    
    mostrarImagenOferta(ofertaId, imagenActualOferta[ofertaId]);
}

// Función para mostrar imagen específica de la oferta
function mostrarImagenOferta(ofertaId, indice) {
    const oferta = ofertas.find(o => o.id === ofertaId);
    if (!oferta) return;
    
    const imagenes = oferta.imagenes || [oferta.imagen];
    if (indice < 0 || indice >= imagenes.length) return;
    
    imagenActualOferta[ofertaId] = indice;
    
    // Actualizar imagen
    const card = document.querySelector(`[onclick*="cambiarImagenOferta(${ofertaId}"]`).closest('.oferta-card');
    const img = card.querySelector('.oferta-image');
    img.src = imagenes[indice];
    
    // Actualizar contador
    const counter = card.querySelector('.image-counter');
    if (counter) {
        counter.textContent = `${indice + 1}/${imagenes.length}`;
    }
    
    // Actualizar dots
    const dots = card.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === indice);
    });
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
    const transferDetails = document.getElementById('transferDetails');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'cash') {
                cardDetails.style.display = 'none';
                transferDetails.style.display = 'none';
            } else if (this.value === 'transfer') {
                cardDetails.style.display = 'none';
                transferDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'block';
                transferDetails.style.display = 'none';
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
        // Verificar si tiene múltiples imágenes
        const tieneMultiplesImagenes = oferta.imagenes && oferta.imagenes.length > 1;
        const imagenes = oferta.imagenes || [oferta.imagen];
        
        const ofertaCard = document.createElement('div');
        ofertaCard.className = 'oferta-card';
        ofertaCard.innerHTML = `
            <div class="oferta-badge">-${oferta.descuento}%</div>
            <div class="oferta-image-container">
                <img src="${oferta.imagen}" alt="${oferta.nombre}" class="oferta-image" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'">
                ${tieneMultiplesImagenes ? `
                    <div class="image-gallery-controls">
                        <button class="gallery-btn prev" onclick="cambiarImagenOferta(${oferta.id}, -1)">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div class="image-counter">1/${imagenes.length}</div>
                        <button class="gallery-btn next" onclick="cambiarImagenOferta(${oferta.id}, 1)">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    <div class="image-dots">
                        ${imagenes.map((_, index) => `
                            <span class="dot ${index === 0 ? 'active' : ''}" onclick="mostrarImagenOferta(${oferta.id}, ${index})"></span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <h3>${oferta.nombre}</h3>
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

// Función para abrir chat de soporte
function abrirChatSoporte() {
    document.getElementById('supportChat').style.display = 'flex';
    document.getElementById('supportChatInput').focus();
}

// Función para cerrar chat de soporte
function cerrarChatSoporte() {
    document.getElementById('supportChat').style.display = 'none';
}

// Función para enviar mensaje en el chat
function enviarMensajeChat() {
    const input = document.getElementById('supportChatInput');
    const message = input.value.trim();
    
    if (message) {
        // Agregar mensaje del usuario
        agregarMensajeChat(message, 'user');
        input.value = '';
        
        // Simular respuesta del bot
        setTimeout(() => {
            const respuesta = generarRespuestaChat(message);
            agregarMensajeChat(respuesta, 'bot');
        }, 1000);
    }
}

// Hacer la función global para que funcione desde el HTML
window.enviarMensajeChat = enviarMensajeChat;

// Función para agregar mensaje al chat
function agregarMensajeChat(texto, tipo) {
    const chatMessages = document.getElementById('supportChatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}`;
    
    const icon = tipo === 'user' ? 'fas fa-user' : 'fas fa-robot';
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="${icon}"></i>
            <p>${texto}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para generar respuestas del chat
function generarRespuestaChat(mensaje) {
    const mensajeLower = mensaje.toLowerCase();
    
    if (mensajeLower.includes('pago') || mensajeLower.includes('pagar')) {
        return 'Para problemas de pago, puedes contactarnos directamente al +54 9 379 501-5712 o por WhatsApp. También puedes intentar con otro método de pago. ⏰ <strong>Atención:</strong> Solo en horario comercial (Lunes a Viernes 8:00-12:00 y 16:00-20:00, Sábados 8:00-12:00).';
    } else if (mensajeLower.includes('carrito') || mensajeLower.includes('compra')) {
        return 'Si tienes problemas con el carrito, intenta refrescar la página o limpiar el carrito y volver a agregar los productos. Si persiste, contacta nuestro soporte técnico. ⏰ <strong>Atención:</strong> Solo en horario comercial.';
    } else if (mensajeLower.includes('envío') || mensajeLower.includes('entrega') || mensajeLower.includes('envio')) {
        return 'Los envíos a Resistencia, interior u otras provincias quedan a cargo del comprador. ⏰ <strong>Envíos:</strong> Solo en horario comercial (Lunes a Viernes 8:00-12:00 y 16:00-20:00, Sábados 8:00-12:00). Para más información, contacta al +54 9 379 501-5712.';
    } else if (mensajeLower.includes('producto') || mensajeLower.includes('repuesto')) {
        return 'Si tienes dudas sobre productos, puedes ver nuestro catálogo completo o contactarnos para consultas específicas. ⏰ <strong>Atención:</strong> Solo en horario comercial.';
    } else if (mensajeLower.includes('servicio') || mensajeLower.includes('taller')) {
        return 'Ofrecemos servicios de taller mecánico, lubricentro, detailing, traslados y gestoría. ⏰ <strong>Servicios:</strong> Solo en horario comercial (Lunes a Viernes 8:00-12:00 y 16:00-20:00, Sábados 8:00-12:00). Contacta al +54 9 379 501-5712 para más información.';
    } else if (mensajeLower.includes('horario') || mensajeLower.includes('hora') || mensajeLower.includes('cuando')) {
        return '⏰ <strong>Horario de Atención:</strong><br>• Lunes a Viernes: 8:00 - 12:00 y 16:00 - 20:00<br>• Sábados: 8:00 - 12:00<br>• Domingos: Cerrado<br><br>Los envíos y servicios solo se realizan en horario comercial.';
    } else if (mensajeLower.includes('domingo') || mensajeLower.includes('fin de semana')) {
        return '⏰ <strong>Importante:</strong> Los domingos estamos cerrados. No se realizan envíos ni servicios en domingo. Para urgencias, contacta al +54 9 379 501-5712 y te responderemos el lunes.';
    } else {
        return 'Gracias por tu consulta. Para atención personalizada, contacta al +54 9 379 501-5712 o por WhatsApp. ⏰ <strong>Atención:</strong> Solo en horario comercial (Lunes a Viernes 8:00-12:00 y 16:00-20:00, Sábados 8:00-12:00). Estamos aquí para ayudarte.';
    }
}

// Guardar datos fiscales de la empresa
function guardarDatosEmpresa() {
    const cuit = document.getElementById('cuitEmpresa').value;
    const razonSocial = document.getElementById('razonSocial').value;
    const condicionFiscal = document.getElementById('condicionFiscal').value;
    const domicilioFiscal = document.getElementById('domicilioFiscal').value;
    
    if (!cuit || !razonSocial || !domicilioFiscal) {
        mostrarNotificacion('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Validar formato de CUIT
    const cuitRegex = /^[0-9]{2}-[0-9]{8}-[0-9]{1}$/;
    if (!cuitRegex.test(cuit)) {
        mostrarNotificacion('El CUIT debe tener el formato XX-XXXXXXXX-X', 'error');
        return;
    }
    
    // Guardar en localStorage
    localStorage.setItem('cuitEmpresa', cuit);
    localStorage.setItem('razonSocial', razonSocial);
    localStorage.setItem('condicionFiscal', condicionFiscal);
    localStorage.setItem('domicilioFiscal', domicilioFiscal);
    
    mostrarNotificacion('Datos fiscales guardados exitosamente', 'success');
}

// Guardar datos bancarios de la empresa
function guardarDatosBancarios() {
    const banco = document.getElementById('bancoEmpresa').value;
    const tipoCuenta = document.getElementById('tipoCuenta').value;
    const numeroCuenta = document.getElementById('numeroCuenta').value;
    const cbu = document.getElementById('cbuEmpresa').value;
    const alias = document.getElementById('aliasEmpresa').value;
    
    if (!banco || !tipoCuenta || !numeroCuenta || !cbu || !alias) {
        mostrarNotificacion('Por favor completa todos los campos bancarios', 'error');
        return;
    }
    
    // Guardar en localStorage
    localStorage.setItem('bancoEmpresa', banco);
    localStorage.setItem('tipoCuenta', tipoCuenta);
    localStorage.setItem('numeroCuenta', numeroCuenta);
    localStorage.setItem('cbuEmpresa', cbu);
    localStorage.setItem('aliasEmpresa', alias);
    
    mostrarNotificacion('Datos bancarios guardados exitosamente', 'success');
}

// Cargar datos de empresa al abrir la sección
function cargarDatosEmpresa() {
    const cuit = localStorage.getItem('cuitEmpresa') || '';
    const razonSocial = localStorage.getItem('razonSocial') || 'FRIOCAS - Servicios Automotrices';
    const condicionFiscal = localStorage.getItem('condicionFiscal') || 'RI';
    const domicilioFiscal = localStorage.getItem('domicilioFiscal') || 'Moreno 2242, Corrientes Capital';
    
    const banco = localStorage.getItem('bancoEmpresa') || 'Banco de la Nación Argentina';
    const tipoCuenta = localStorage.getItem('tipoCuenta') || 'Cuenta Corriente';
    const numeroCuenta = localStorage.getItem('numeroCuenta') || '1234567890';
    const cbu = localStorage.getItem('cbuEmpresa') || '0110123456789012345678';
    const alias = localStorage.getItem('aliasEmpresa') || 'FRIOCAS.AUTOS';
    
    // Llenar campos
    if (document.getElementById('cuitEmpresa')) document.getElementById('cuitEmpresa').value = cuit;
    if (document.getElementById('razonSocial')) document.getElementById('razonSocial').value = razonSocial;
    if (document.getElementById('condicionFiscal')) document.getElementById('condicionFiscal').value = condicionFiscal;
    if (document.getElementById('domicilioFiscal')) document.getElementById('domicilioFiscal').value = domicilioFiscal;
    
    if (document.getElementById('bancoEmpresa')) document.getElementById('bancoEmpresa').value = banco;
    if (document.getElementById('tipoCuenta')) document.getElementById('tipoCuenta').value = tipoCuenta;
    if (document.getElementById('numeroCuenta')) document.getElementById('numeroCuenta').value = numeroCuenta;
    if (document.getElementById('cbuEmpresa')) document.getElementById('cbuEmpresa').value = cbu;
    if (document.getElementById('aliasEmpresa')) document.getElementById('aliasEmpresa').value = alias;
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

// Función para capitalizar texto
function capitalizarTexto(texto) {
    if (!texto) return '';
    
    return texto.toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}

// Función para capitalizar nombres y direcciones automáticamente
function configurarCapitalizacion() {
    // Capitalizar nombre del cliente
    const customerNameInput = document.getElementById('customerName');
    if (customerNameInput) {
        customerNameInput.addEventListener('blur', function() {
            this.value = capitalizarTexto(this.value);
        });
    }
    
    // Capitalizar dirección del cliente
    const customerAddressInput = document.getElementById('customerAddress');
    if (customerAddressInput) {
        customerAddressInput.addEventListener('blur', function() {
            this.value = capitalizarTexto(this.value);
        });
    }
    
    // Capitalizar nombre del titular de la tarjeta
    const cardholderNameInput = document.getElementById('cardholderName');
    if (cardholderNameInput) {
        cardholderNameInput.addEventListener('blur', function() {
            this.value = capitalizarTexto(this.value);
        });
    }
}

// Sistema de acceso secreto al admin
let adminAccessAttempts = 0;
let adminAccessSequence = '';

// Función para verificar acceso secreto al admin
function verificarAccesoSecretoAdmin(event) {
    // Secuencia secreta: presionar Ctrl + Alt + A
    if (event.ctrlKey && event.altKey && event.key === 'a') {
        mostrarBotónAdmin();
        return;
    }
    
    // Secuencia alternativa: escribir "admin" en cualquier lugar
    adminAccessSequence += event.key.toLowerCase();
    
    // Verificar si la secuencia contiene "admin"
    if (adminAccessSequence.includes('admin')) {
        mostrarBotónAdmin();
        adminAccessSequence = ''; // Resetear secuencia
        return;
    }
    
    // Limpiar secuencia si es muy larga
    if (adminAccessSequence.length > 10) {
        adminAccessSequence = adminAccessSequence.slice(-5);
    }
}

// Función para mostrar el botón de admin
function mostrarBotónAdmin() {
    const adminButton = document.getElementById('adminButton');
    if (adminButton) {
        adminButton.style.display = 'flex';
        mostrarNotificacion('Acceso administrativo habilitado', 'success');
        
        // Ocultar después de 30 segundos de inactividad
        setTimeout(() => {
            if (!document.getElementById('adminModal') || document.getElementById('adminModal').style.display === 'none') {
                adminButton.style.display = 'none';
                mostrarNotificacion('Acceso administrativo deshabilitado por seguridad', 'info');
            }
        }, 30000);
    }
}

// Inicializar sistema de conexión al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // initConnectionMonitoring(); // DESACTIVADO TEMPORALMENTE PARA PRUEBAS
    
    // Configurar capitalización automática
    configurarCapitalizacion();
    
    // Configurar acceso secreto al admin
    document.addEventListener('keydown', verificarAccesoSecretoAdmin);
    
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

// Verificar tarjeta de crédito/débito
function verificarTarjeta() {
    // Verificar que el modal de pago esté abierto
    const paymentModal = document.getElementById('paymentModal');
    if (!paymentModal || paymentModal.style.display !== 'block') {
        console.error('Modal de pago no está abierto');
        mostrarNotificacion('Error: Modal de pago no disponible', 'error');
        return false;
    }
    
    const cardNumberElement = document.getElementById('cardNumber');
    const cardNameElement = document.getElementById('cardholderName');
    const cardExpiryElement = document.getElementById('expiryDate');
    const cardCVVElement = document.getElementById('cvv');
    
    // Verificar que los elementos existan
    if (!cardNumberElement || !cardNameElement || !cardExpiryElement || !cardCVVElement) {
        console.error('Elementos de tarjeta no encontrados');
        mostrarNotificacion('Error: Formulario de tarjeta no disponible', 'error');
        return false;
    }
    
    const cardNumber = cardNumberElement.value.replace(/\s/g, '');
    const cardName = cardNameElement.value;
    const cardExpiry = cardExpiryElement.value;
    const cardCVV = cardCVVElement.value;
    
    if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
        mostrarNotificacion('Por favor completa todos los datos de la tarjeta', 'error');
        return false;
    }
    
    // Validar número de tarjeta (algoritmo de Luhn)
    if (!validarAlgoritmoLuhn(cardNumber)) {
        mostrarNotificacion('Número de tarjeta inválido', 'error');
        return false;
    }
    
    // Validar fecha de expiración
    if (!validarFechaExpiracion(cardExpiry)) {
        mostrarNotificacion('Fecha de expiración inválida', 'error');
        return false;
    }
    
    // Validar CVV
    if (!validarCVV(cardNumber, cardCVV)) {
        mostrarNotificacion('CVV inválido', 'error');
        return false;
    }
    
    // Simular verificación con banco
    const resultado = simularVerificacionBanco(cardNumber, cardName);
    return resultado;
}

// Algoritmo de Luhn para validar números de tarjeta
function validarAlgoritmoLuhn(numero) {
    let suma = 0;
    let esPar = false;
    
    for (let i = numero.length - 1; i >= 0; i--) {
        let digito = parseInt(numero[i]);
        
        if (esPar) {
            digito *= 2;
            if (digito > 9) {
                digito -= 9;
            }
        }
        
        suma += digito;
        esPar = !esPar;
    }
    
    return suma % 10 === 0;
}

// Validar fecha de expiración
function validarFechaExpiracion(expiry) {
    const [mes, año] = expiry.split('/');
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear() % 100;
    const mesActual = fechaActual.getMonth() + 1;
    
    const mesExp = parseInt(mes);
    const añoExp = parseInt(año);
    
    if (añoExp < añoActual || (añoExp === añoActual && mesExp < mesActual)) {
        return false;
    }
    
    return mesExp >= 1 && mesExp <= 12;
}

// Validar CVV según tipo de tarjeta
function validarCVV(numero, cvv) {
    const cvvLength = cvv.length;
    
    // Visa, Mastercard, Discover: 3 dígitos
    if (numero.startsWith('4') || numero.startsWith('5') || numero.startsWith('6')) {
        return cvvLength === 3;
    }
    
    // American Express: 4 dígitos
    if (numero.startsWith('3')) {
        return cvvLength === 4;
    }
    
    return cvvLength >= 3 && cvvLength <= 4;
}

// Simular verificación con banco
function simularVerificacionBanco(numero, nombre) {
    // Tarjetas de prueba que simulan ser válidas
    const tarjetasValidas = [
        '4111111111111111', // Visa
        '5555555555554444', // Mastercard
        '378282246310005',  // American Express
        '6011111111111117', // Discover
        '4000000000000002', // Visa (declinada)
        '4000000000009995'  // Visa (fondos insuficientes)
    ];
    
    // Verificación inmediata (sin delay para evitar problemas)
    if (tarjetasValidas.includes(numero)) {
        if (numero === '4000000000000002') {
            mostrarNotificacion('Tarjeta declinada por el banco', 'error');
            return false;
        } else if (numero === '4000000000009995') {
            mostrarNotificacion('Fondos insuficientes', 'error');
            return false;
        } else {
            mostrarNotificacion('Tarjeta verificada exitosamente', 'success');
            return true;
        }
    } else {
        mostrarNotificacion('Tarjeta no reconocida. Usa una tarjeta de prueba válida', 'error');
        return false;
    }
}

// Función para mostrar información de tarjetas de prueba
function mostrarTarjetasPrueba() {
    const info = `
📋 <strong>TARJETAS DE PRUEBA DISPONIBLES:</strong>

💳 <strong>Visa (Válida):</strong>
• Número: 4111111111111111
• Fecha: 12/25
• CVV: 123

💳 <strong>Mastercard (Válida):</strong>
• Número: 5555555555554444
• Fecha: 12/25
• CVV: 123

💳 <strong>American Express (Válida):</strong>
• Número: 378282246310005
• Fecha: 12/25
• CVV: 1234

💳 <strong>Visa (Declinada):</strong>
• Número: 4000000000000002
• Fecha: 12/25
• CVV: 123

💳 <strong>Visa (Fondos Insuficientes):</strong>
• Número: 4000000000009995
• Fecha: 12/25
• CVV: 123
    `;
    
    mostrarNotificacion(info, 'info');
}

// Hacer la función global
window.mostrarTarjetasPrueba = mostrarTarjetasPrueba;

// Procesar pago
function processPayment() {
    // Verificar que el modal de pago esté abierto
    const paymentModal = document.getElementById('paymentModal');
    if (!paymentModal || paymentModal.style.display !== 'block') {
        console.error('Modal de pago no está abierto');
        mostrarNotificacion('Error: Modal de pago no disponible', 'error');
        return;
    }
    
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
    } else if (paymentMethod === 'credit' || paymentMethod === 'debit') {
        // Verificar que el modal de pago esté abierto y los campos de tarjeta estén visibles
        const cardDetails = document.getElementById('cardDetails');
        if (!cardDetails || cardDetails.style.display === 'none') {
            mostrarNotificacion('Por favor selecciona un método de pago con tarjeta y completa los datos', 'error');
            return;
        }
        
        // Verificar tarjeta antes de procesar
        if (!verificarTarjeta()) {
            return;
        }
        console.log('Procesando pago con tarjeta...');
        procesarPagoDirecto(customerName, customerEmail, customerPhone, customerAddress, paymentMethod, billingType, receiptOptions);
    } else {
        console.log('Procesando pago con método:', paymentMethod);
        // Para otros métodos, procesar directamente
        procesarPagoDirecto(customerName, customerEmail, customerPhone, customerAddress, paymentMethod, billingType, receiptOptions);
    }
}

// Función para actualizar dirección en tiempo real
function actualizarDireccionDisplay() {
    const addressInput = document.getElementById('customerAddress');
    const addressDisplay = document.getElementById('customerAddressDisplay');
    
    if (addressInput && addressDisplay) {
        addressInput.addEventListener('input', function() {
            addressDisplay.textContent = this.value || 'Ingresa tu dirección en el formulario';
        });
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
                                <p style="margin: 5px 0;"><strong>📍 Dirección:</strong> <span id="customerAddressDisplay">Ingresa tu dirección en el formulario</span></p>
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
            
            // Enviar notificaciones por email
            enviarNotificacionEfectivo(nombre, email, telefono, direccion, tipoFactura);
            
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

// Enviar notificaciones por email para pagos en efectivo
function enviarNotificacionEfectivo(nombre, email, telefono, direccion, tipoFactura) {
    try {
        // Email al cliente
        const asuntoCliente = `Pago en Efectivo Confirmado - FRIOCAS`;
        const cuerpoCliente = `Estimado/a ${nombre},\n\n` +
                             `Su pago en efectivo ha sido confirmado exitosamente:\n\n` +
                             `👤 Cliente: ${nombre}\n` +
                             `📧 Email: ${email}\n` +
                             `📞 Teléfono: ${telefono}\n` +
                             `📍 Dirección: ${direccion}\n` +
                             `💳 Método de Pago: Efectivo\n` +
                             `📅 Fecha: ${new Date().toLocaleDateString()}\n` +
                             `🕐 Hora: ${new Date().toLocaleTimeString()}\n\n` +
                             `🏢 FRIOCAS - Servicios Automotrices\n` +
                             `📞 +54 9 379 501-5712\n\n` +
                             `Gracias por confiar en FRIOCAS!\n\n` +
                             `Saludos cordiales,\nEquipo FRIOCAS`;
        
        const mailtoCliente = `mailto:${email}?subject=${encodeURIComponent(asuntoCliente)}&body=${encodeURIComponent(cuerpoCliente)}`;
        
        // Email a la empresa
        const asuntoEmpresa = `Pago en Efectivo Recibido - FRIOCAS`;
        const cuerpoEmpresa = `Se ha recibido un pago en efectivo:\n\n` +
                             `👤 Cliente: ${nombre}\n` +
                             `📧 Email: ${email}\n` +
                             `📞 Teléfono: ${telefono}\n` +
                             `📍 Dirección: ${direccion}\n` +
                             `💳 Método de Pago: Efectivo\n` +
                             `📅 Fecha: ${new Date().toLocaleDateString()}\n` +
                             `🕐 Hora: ${new Date().toLocaleTimeString()}\n\n` +
                             `🏢 FRIOCAS - Servicios Automotrices\n` +
                             `📞 +54 9 379 501-5712\n\n` +
                             `⚠️ IMPORTANTE: Verificar la recepción del pago en efectivo.`;
        
        const mailtoEmpresa = `mailto:info@friocas.com.ar?subject=${encodeURIComponent(asuntoEmpresa)}&body=${encodeURIComponent(cuerpoEmpresa)}`;
        
        // Abrir emails en ventanas separadas
        setTimeout(() => {
            window.open(mailtoCliente, '_blank');
        }, 1000);
        
        setTimeout(() => {
            window.open(mailtoEmpresa, '_blank');
        }, 2000);
        
        console.log('Notificaciones por email enviadas al cliente y a la empresa');
        
    } catch (error) {
        console.error('Error al enviar notificaciones de efectivo:', error);
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
    // Obtener CUIT desde localStorage o usar valor por defecto
    const cuitEmpresa = localStorage.getItem('cuitEmpresa') || '20-12345678-9';
    
    switch(tipoFactura) {
        case 'A':
            return cuitEmpresa; // CUIT de FRIOCAS como Responsable Inscripto
        case 'B':
            return cuitEmpresa; // CUIT de FRIOCAS
        case 'C':
            return cuitEmpresa; // CUIT de FRIOCAS como Monotributista
        default:
            return cuitEmpresa;
    }
}

// Procesar comprobantes según opciones seleccionadas
function procesarComprobantes(factura, opciones, email, telefono) {
    if (opciones.length === 0) {
        // Si no hay opciones seleccionadas, descargar por defecto
        descargarComprobante(factura);
        return;
    }
    
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
        
        // Generar el contenido HTML de la factura
        const contenidoFactura = generarContenidoFactura(factura);
        
        // Crear un blob con el contenido HTML
        const blob = new Blob([contenidoFactura], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Crear un enlace temporal para descargar la factura
        const link = document.createElement('a');
        link.href = url;
        link.download = `FRIOCAS_${factura.numero}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Crear un enlace para abrir el cliente de email con archivo adjunto
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        
        // Mostrar instrucciones al usuario
        mostrarNotificacion('Factura descargada. Abriendo cliente de email...', 'info');
        
        // Abrir el cliente de email
        setTimeout(() => {
            window.open(mailtoLink);
            mostrarNotificacion('Adjunta el archivo FRIOCAS_' + factura.numero + '.html que se descargó.', 'success');
        }, 1000);
        
        // Enviar copia a la empresa
        enviarCopiaEmpresa(factura);
        
        // Limpiar el URL del blob
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (error) {
        console.error('Error al enviar por Email:', error);
        mostrarNotificacion('Error al procesar el envío por email. Intenta descargar la factura manualmente.', 'error');
    }
}

// Enviar copia a la empresa
function enviarCopiaEmpresa(factura) {
    try {
        const asuntoEmpresa = `Nueva Venta - FRIOCAS ${factura.numero}`;
        const cuerpoEmpresa = `Se ha realizado una nueva venta:\n\n` +
                             `📄 Factura: ${factura.numero}\n` +
                             `👤 Cliente: ${factura.cliente.nombre}\n` +
                             `📧 Email: ${factura.cliente.email}\n` +
                             `📞 Teléfono: ${factura.cliente.telefono}\n` +
                             `💰 Total: $${factura.total.toFixed(2)}\n` +
                             `💳 Método de Pago: ${factura.metodoPago}\n` +
                             `📅 Fecha: ${factura.fecha}\n` +
                             `🕐 Hora: ${factura.hora}\n\n` +
                             `🏢 FRIOCAS - Servicios Automotrices\n` +
                             `📞 +54 9 379 501-5712`;
        
        const mailtoEmpresa = `mailto:info@friocas.com.ar?subject=${encodeURIComponent(asuntoEmpresa)}&body=${encodeURIComponent(cuerpoEmpresa)}`;
        
        // Abrir email para la empresa en nueva ventana
        setTimeout(() => {
            window.open(mailtoEmpresa, '_blank');
        }, 1500);
        
    } catch (error) {
        console.error('Error al enviar copia a la empresa:', error);
    }
}

// Generar contenido HTML de la factura
function generarContenidoFactura(factura) {
    const itemsHTML = factura.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; font-size: 14px;">${item.nombre}</td>
            <td style="text-align: center; padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: 500; font-size: 14px;">${item.cantidad}</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 14px;">$${item.precioUnitario.toFixed(2)}</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #e0e0e0; font-weight: 600; color: #2c3e50; font-size: 14px;">$${item.subtotal.toFixed(2)}</td>
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
                    padding: 20px 10px;
                }
                
                .invoice-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                    overflow: hidden;
                    position: relative;
                }
                
                .invoice-container::before {
                    content: 'FRIOCAS';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-15deg);
                    font-size: 80px;
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
                    padding: 25px;
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
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 6px;
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }
                
                .logo span {
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                
                .logo img {
                    width: 45px;
                    height: 45px;
                    border-radius: 8px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                    background: white;
                    padding: 4px;
                }
                
                .tagline {
                    font-size: 14px;
                    font-weight: 300;
                    opacity: 0.9;
                    margin-bottom: 15px;
                    position: relative;
                    z-index: 1;
                }
                
                .cuit {
                    background: rgba(255,255,255,0.2);
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: 500;
                    display: inline-block;
                    position: relative;
                    z-index: 1;
                }
                
                .content {
                    padding: 25px;
                    position: relative;
                    z-index: 1;
                }
                
                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 25px;
                    padding: 20px;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 12px;
                    border-left: 4px solid #007bff;
                }
                
                .invoice-details {
                    flex: 1;
                }
                
                .invoice-type {
                    font-size: 20px;
                    font-weight: 700;
                    color: #007bff;
                    margin-bottom: 8px;
                }
                
                .invoice-number {
                    font-size: 16px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 6px;
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
                    margin-bottom: 25px;
                }
                
                .items-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                }
                
                .items-title::before {
                    content: '🛍️';
                    margin-right: 8px;
                    font-size: 20px;
                }
                
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }
                
                .items-table th {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                    color: white;
                    padding: 12px 10px;
                    font-weight: 600;
                    font-size: 13px;
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
                    padding: 20px;
                    text-align: center;
                }
                
                .footer-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .footer-subtitle {
                    font-size: 13px;
                    opacity: 0.8;
                    margin-bottom: 15px;
                }
                
                .footer-info {
                    font-size: 12px;
                    opacity: 0.7;
                    line-height: 1.5;
                }
                
                .stamp {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 60px;
                    height: 60px;
                    background: rgba(255,255,255,0.1);
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
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
                        <img src="./assets/Imagen de WhatsApp 2025-08-07 a las 17.57.01_44e6f86e.jpg" alt="FRIOCAS Logo" style="width: 45px; height: 45px; border-radius: 8px; object-fit: cover; box-shadow: 0 3px 10px rgba(0,0,0,0.2);" onerror="this.style.display='none'; this.nextElementSibling.style.marginLeft='0';">
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

// ===== SISTEMA DE ADMINISTRACIÓN =====

// Credenciales de administrador (en producción deberían estar en un servidor)
const ADMIN_CREDENTIALS = {
    username: 'friocas_admin',
    password: 'FRIOCAS2025!'
};

// Variables para el panel de administración
let isAdminLoggedIn = false;

// Función para cargar datos guardados
function cargarDatosGuardados() {
    // Cargar productos guardados
    const productosGuardados = localStorage.getItem('friocas_productos');
    if (productosGuardados) {
        adminProducts = JSON.parse(productosGuardados);
        repuestos = [...adminProducts]; // Sincronizar con la lista principal
    } else {
        adminProducts = [...repuestos]; // Usar datos por defecto
    }
    
    // Cargar ofertas guardadas
    const ofertasGuardadas = localStorage.getItem('friocas_ofertas');
    if (ofertasGuardadas) {
        adminOffers = JSON.parse(ofertasGuardadas);
        ofertas = [...adminOffers]; // Sincronizar con la lista principal
    } else {
        adminOffers = [...ofertas]; // Usar datos por defecto
    }
    
    // Cargar servicios guardados
    const serviciosGuardados = localStorage.getItem('friocas_servicios');
    if (serviciosGuardados) {
        serviciosData = JSON.parse(serviciosGuardados);
    }
    
    console.log('Datos cargados:', {
        productos: adminProducts.length,
        ofertas: adminOffers.length,
        servicios: Object.keys(serviciosData).length
    });
}

// Función para guardar datos
function guardarDatos() {
    console.log('Guardando datos...');
    console.log('Productos a guardar:', adminProducts.length);
    console.log('Ofertas a guardar:', adminOffers.length);
    console.log('Servicios a guardar:', Object.keys(serviciosData).length);
    
    try {
        localStorage.setItem('friocas_productos', JSON.stringify(adminProducts));
        localStorage.setItem('friocas_ofertas', JSON.stringify(adminOffers));
        localStorage.setItem('friocas_servicios', JSON.stringify(serviciosData));
        
        console.log('Datos guardados exitosamente en localStorage');
    } catch (error) {
        console.error('Error al guardar datos:', error);
        mostrarNotificacion('Error al guardar datos: ' + error.message, 'error');
    }
}

// Cargar datos al iniciar
cargarDatosGuardados();

// Función para inicializar datos por primera vez
function inicializarDatosPorPrimeraVez() {
    const productos = localStorage.getItem('friocas_productos');
    const ofertas = localStorage.getItem('friocas_ofertas');
    const servicios = localStorage.getItem('friocas_servicios');
    
    // Si no hay datos guardados, guardar los datos por defecto
    if (!productos || !ofertas || !servicios) {
        console.log('Inicializando datos por primera vez...');
        guardarDatos();
        mostrarNotificacion('Datos inicializados correctamente.', 'success');
    }
    
    // Actualizar servicios en la página principal después de cargar
    setTimeout(() => {
        actualizarServiciosEnPaginaPrincipal();
        cargarServiciosEnVista();
    }, 100);
}

// Inicializar datos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarDatosPorPrimeraVez();
});

// Función para abrir el modal de administración
function abrirModalAdmin() {
    const modal = document.getElementById('adminModal');
    modal.style.display = 'block';
    
    // Mostrar login si no está autenticado
    if (!isAdminLoggedIn) {
        mostrarLoginAdmin();
    } else {
        mostrarPanelAdmin();
    }
}

// Función para cerrar el modal de administración
function cerrarModalAdmin() {
    const modal = document.getElementById('adminModal');
    modal.style.display = 'none';
    
    // Limpiar formularios
    limpiarFormulariosAdmin();
}

// Función para mostrar el login de administrador
function mostrarLoginAdmin() {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

// Función para mostrar el panel de administración
function mostrarPanelAdmin() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    // Mostrar dashboard por defecto
    mostrarSeccion('dashboard');
    
    // Configurar eventos de formularios
    configurarEventosAdmin();
    
    // Actualizar estadísticas del dashboard
    actualizarDashboard();
    
    // Actualizar configuración para mostrar estado de datos
    actualizarConfiguracion();
}

// Función para refrescar la página principal
function refrescarPaginaPrincipal() {
    // Recargar los datos en las listas principales
    cargarDatosGuardados();
    
    // Actualizar servicios en la página principal
    actualizarServiciosEnPaginaPrincipal();
    
    // Si estamos en la página principal, actualizar las vistas
    if (typeof mostrarRepuestos === 'function') {
        mostrarRepuestos();
    }
    if (typeof mostrarOfertas === 'function') {
        mostrarOfertas();
    }
    
    mostrarNotificacion('Página principal actualizada con los nuevos datos.', 'success');
}

// Función para login de administrador
function loginAdmin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isAdminLoggedIn = true;
        mostrarPanelAdmin();
        
        // Limpiar campos de login
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
        
        // Mostrar mensaje de éxito
        mostrarNotificacion('¡Acceso exitoso! Panel de administración cargado.', 'success');
    } else {
        mostrarNotificacion('Credenciales incorrectas. Intenta nuevamente.', 'error');
        document.getElementById('adminPassword').value = '';
    }
}

// Función para logout de administrador
function logoutAdmin() {
    isAdminLoggedIn = false;
    mostrarLoginAdmin();
    limpiarFormulariosAdmin();
    mostrarNotificacion('Sesión cerrada exitosamente.', 'info');
}

// Función para configurar eventos del panel de administración
function configurarEventosAdmin() {
    // Evento para vista previa de imagen de producto
    document.getElementById('productImage').addEventListener('change', function(e) {
        mostrarVistaPrevia(e.target, 'productImagePreview');
    });
    
    // Evento para vista previa de imagen de oferta
    document.getElementById('offerImage').addEventListener('change', function(e) {
        mostrarVistaPrevia(e.target, 'offerImagePreview');
    });
    
    // Evento para formulario de producto
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarNuevoProducto();
    });
    
    // Evento para formulario de oferta
    document.getElementById('addOfferForm').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarNuevaOferta();
    });
    
    // Eventos para búsqueda y filtros
    document.getElementById('buscarProductos').addEventListener('input', function(e) {
        filtrarProductos(e.target.value);
    });
    
    document.getElementById('filtrarCategoria').addEventListener('change', function(e) {
        filtrarProductosPorCategoria(e.target.value);
    });
    
    document.getElementById('buscarOfertas').addEventListener('input', function(e) {
        filtrarOfertas(e.target.value);
    });
}

// Función para mostrar secciones del panel
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('.admin-content');
    secciones.forEach(s => s.classList.remove('active'));
    
    // Mostrar la sección seleccionada
    document.getElementById(seccion).classList.add('active');
    
    // Actualizar navegación
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Cargar contenido específico de la sección
    switch(seccion) {
        case 'dashboard':
            actualizarDashboard();
            break;
        case 'productos':
            cargarProductosActuales();
            break;
        case 'ofertas':
            cargarOfertasActuales();
            break;
        case 'servicios':
            // Cargar servicios en la vista
            cargarServiciosEnVista();
            break;
        case 'configuracion':
            actualizarConfiguracion();
            break;
        case 'empresa':
            cargarDatosEmpresa();
            break;
        case 'estadisticas':
            // Las estadísticas son placeholders por ahora
            break;
    }
}

// Función para actualizar dashboard
function actualizarDashboard() {
    document.getElementById('totalProductos').textContent = adminProducts.length;
    document.getElementById('totalOfertas').textContent = adminOffers.length;
    document.getElementById('ventasHoy').textContent = Math.floor(Math.random() * 50) + 10; // Simulado
    document.getElementById('totalClientes').textContent = Math.floor(Math.random() * 200) + 50; // Simulado
}

// Función para alternar formularios
function toggleFormulario(tipo) {
    const formulario = document.getElementById(`formulario${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    if (formulario.style.display === 'none') {
        formulario.style.display = 'block';
        // Limpiar formulario
        let formId;
        if (tipo === 'producto') {
            formId = 'addProductForm';
        } else if (tipo === 'oferta') {
            formId = 'addOfferForm';
        } else {
            formId = `add${tipo.charAt(0).toUpperCase() + tipo.slice(1)}Form`;
        }
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
        
        let previewId;
        if (tipo === 'producto') {
            previewId = 'productImagePreview';
        } else if (tipo === 'oferta') {
            previewId = 'offerImagePreview';
        } else {
            previewId = `${tipo}ImagePreview`;
        }
        const preview = document.getElementById(previewId);
        if (preview) {
            preview.innerHTML = '';
        }
        resetearFormulario(tipo);
    } else {
        formulario.style.display = 'none';
    }
}

// Función para cancelar edición
function cancelarEdicion(tipo) {
    const formulario = document.getElementById(`formulario${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    formulario.style.display = 'none';
    let formId;
    if (tipo === 'producto') {
        formId = 'addProductForm';
    } else if (tipo === 'oferta') {
        formId = 'addOfferForm';
    } else {
        formId = `add${tipo.charAt(0).toUpperCase() + tipo.slice(1)}Form`;
    }
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
    
    let previewId;
    if (tipo === 'producto') {
        previewId = 'productImagePreview';
    } else if (tipo === 'oferta') {
        previewId = 'offerImagePreview';
    } else {
        previewId = `${tipo}ImagePreview`;
    }
    const preview = document.getElementById(previewId);
    if (preview) {
        preview.innerHTML = '';
    }
    resetearFormulario(tipo);
}

// Función para resetear formularios
function resetearFormulario(tipo) {
    let formId;
    if (tipo === 'producto') {
        formId = 'addProductForm';
    } else if (tipo === 'oferta') {
        formId = 'addOfferForm';
    } else {
        formId = `add${tipo.charAt(0).toUpperCase() + tipo.slice(1)}Form`;
    }
    const submitBtn = document.querySelector(`#${formId} button[type="submit"]`);
    if (submitBtn) {
        submitBtn.innerHTML = `<i class="fas fa-save"></i> Guardar ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        submitBtn.onclick = function(e) {
            e.preventDefault();
            if (tipo === 'producto') {
                agregarNuevoProducto();
            } else if (tipo === 'oferta') {
                agregarNuevaOferta();
            }
        };
    }
}

// Función para filtrar productos
function filtrarProductos(busqueda) {
    const productos = adminProducts.filter(producto => 
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );
    mostrarProductosFiltrados(productos);
}

// Función para filtrar productos por categoría
function filtrarProductosPorCategoria(categoria) {
    if (!categoria) {
        cargarProductosActuales();
        return;
    }
    const productos = adminProducts.filter(producto => producto.categoria === categoria);
    mostrarProductosFiltrados(productos);
}

// Función para mostrar productos filtrados
function mostrarProductosFiltrados(productos) {
    const container = document.getElementById('currentProductsList');
    container.innerHTML = '';
    
    if (productos.length === 0) {
        container.innerHTML = '<p class="no-results">No se encontraron productos</p>';
        return;
    }
    
    productos.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <div class="product-info">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=60&fit=crop'">
                <div class="product-details">
                    <div class="product-name">${producto.nombre}</div>
                    <div class="product-price">$${producto.precio.toLocaleString()}</div>
                    <div class="product-stock">Stock: ${producto.stock} | ${producto.categoria}</div>
                </div>
            </div>
            <div class="product-actions">
                <button onclick="editarProducto(${producto.id})" class="btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="eliminarProducto(${producto.id})" class="btn-delete">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Función para filtrar ofertas
function filtrarOfertas(busqueda) {
    const ofertas = adminOffers.filter(oferta => 
        oferta.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    mostrarOfertasFiltradas(ofertas);
}

// Función para mostrar ofertas filtradas
function mostrarOfertasFiltradas(ofertas) {
    const container = document.getElementById('currentOffersList');
    container.innerHTML = '';
    
    if (ofertas.length === 0) {
        container.innerHTML = '<p class="no-results">No se encontraron ofertas</p>';
        return;
    }
    
    ofertas.forEach(oferta => {
        const item = document.createElement('div');
        item.className = 'offer-item';
        item.innerHTML = `
            <div class="offer-info">
                <img src="${oferta.imagen}" alt="${oferta.nombre}" class="offer-image" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=60&fit=crop'">
                <div class="offer-details">
                    <div class="offer-name">${oferta.nombre}</div>
                    <div class="offer-price">$${(oferta.precioDescuento || 0).toLocaleString()} <span style="text-decoration: line-through; color: #999;">$${(oferta.precioOriginal || 0).toLocaleString()}</span></div>
                    <div class="offer-stock">Stock: ${oferta.stock || 0} | -${oferta.descuento || 0}%</div>
                </div>
            </div>
            <div class="offer-actions">
                <button onclick="editarOferta(${oferta.id})" class="btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="eliminarOferta(${oferta.id})" class="btn-delete">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Los datos de servicios ahora están definidos al principio del archivo

// Función para editar servicio
function editarServicio(tipo) {
    mostrarNotificacion(`Función de edición de servicio ${tipo} en desarrollo.`, 'info');
}

// Función para editar servicio específico
function editarServicioEspecifico(tipo) {
    const servicio = serviciosData[tipo];
    if (!servicio) {
        mostrarNotificacion('Servicio no encontrado.', 'error');
        return;
    }

    // Crear modal de edición
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2><i class="fas fa-edit"></i> Editar ${servicio.nombre}</h2>
            
            <form id="editServiceForm" class="admin-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre del Servicio</label>
                        <input type="text" id="editServiceName" value="${servicio.nombre}" required>
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select id="editServiceStatus" required>
                            <option value="active" ${servicio.estado === 'active' ? 'selected' : ''}>Activo</option>
                            <option value="inactive" ${servicio.estado === 'inactive' ? 'selected' : ''}>Inactivo</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea id="editServiceDescription" rows="3" required>${servicio.descripcion}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Precio Base ($)</label>
                    <input type="number" id="editServiceBasePrice" value="${servicio.precioBase}" min="0" step="0.01" required>
                </div>
                
                <div class="service-prices-edit">
                    <h4>Servicios Específicos</h4>
                    <div id="editServicePrices">
                        ${servicio.servicios.map((serv, index) => `
                            <div class="price-edit-item">
                                <input type="text" value="${serv.nombre}" placeholder="Nombre del servicio" class="service-name-input">
                                <input type="number" value="${serv.precio}" placeholder="Precio" class="service-price-input" min="0" step="0.01">
                                <button type="button" onclick="eliminarServicioEspecifico(this)" class="btn btn-sm btn-danger">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" onclick="agregarServicioEspecifico()" class="btn btn-secondary">
                        <i class="fas fa-plus"></i> Agregar Servicio
                    </button>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                    <button type="button" onclick="this.closest('.modal').remove()" class="btn btn-secondary">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Configurar evento del formulario
    document.getElementById('editServiceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarCambiosServicio(tipo);
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Función para agregar servicio específico en el formulario
function agregarServicioEspecifico() {
    const container = document.getElementById('editServicePrices');
    const newItem = document.createElement('div');
    newItem.className = 'price-edit-item';
    newItem.innerHTML = `
        <input type="text" placeholder="Nombre del servicio" class="service-name-input">
        <input type="number" placeholder="Precio" class="service-price-input" min="0" step="0.01">
        <button type="button" onclick="eliminarServicioEspecifico(this)" class="btn btn-sm btn-danger">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(newItem);
}

// Función para eliminar servicio específico del formulario
function eliminarServicioEspecifico(button) {
    button.closest('.price-edit-item').remove();
}

// Función para guardar cambios del servicio
function guardarCambiosServicio(tipo) {
    const nombre = document.getElementById('editServiceName').value;
    const descripcion = document.getElementById('editServiceDescription').value;
    const estado = document.getElementById('editServiceStatus').value;
    const precioBase = parseFloat(document.getElementById('editServiceBasePrice').value);

    // Recopilar servicios específicos
    const servicios = [];
    const priceItems = document.querySelectorAll('.price-edit-item');
    priceItems.forEach(item => {
        const nombreServicio = item.querySelector('.service-name-input').value;
        const precio = parseFloat(item.querySelector('.service-price-input').value);
        if (nombreServicio && precio) {
            servicios.push({ nombre: nombreServicio, precio: precio });
        }
    });

    // Actualizar datos
    serviciosData[tipo] = {
        nombre: nombre,
        descripcion: descripcion,
        estado: estado,
        precioBase: precioBase,
        servicios: servicios
    };

    // Guardar datos
    guardarDatos();
    
    // Actualizar vista
    actualizarVistaServicio(tipo);
    
    // Cerrar modal
    document.querySelector('.modal').remove();
    
    mostrarNotificacion('Servicio actualizado exitosamente.', 'success');
}

// Función para actualizar vista del servicio
function actualizarVistaServicio(tipo) {
    const servicio = serviciosData[tipo];
    if (!servicio) return;

    // Actualizar información básica
    const detailsContainer = document.getElementById(`${tipo}-details`);
    if (detailsContainer) {
        const infoDiv = detailsContainer.querySelector('.service-info');
        infoDiv.innerHTML = `
            <p><strong>Descripción:</strong> ${servicio.descripcion}</p>
            <p><strong>Estado:</strong> <span class="status-${servicio.estado}">${servicio.estado === 'active' ? 'Activo' : 'Inactivo'}</span></p>
            <p><strong>Precio Base:</strong> $<span id="${tipo}-precio">${servicio.precioBase.toLocaleString()}</span></p>
        `;

        // Actualizar lista de precios
        const pricesDiv = detailsContainer.querySelector('.price-list');
        if (pricesDiv) {
            pricesDiv.innerHTML = servicio.servicios.map(serv => `
                <div class="price-item">
                    <span>${serv.nombre}</span>
                    <span>$${serv.precio.toLocaleString()}</span>
                </div>
            `).join('');
        }
    }
}

// Función para cargar todos los servicios en la vista
function cargarServiciosEnVista() {
    Object.keys(serviciosData).forEach(tipo => {
        actualizarVistaServicio(tipo);
    });
}

// Función para actualizar servicios en la página principal
function actualizarServiciosEnPaginaPrincipal() {
    // Actualizar el objeto servicios que se usa en la página principal
    if (typeof servicios !== 'undefined') {
        Object.keys(serviciosData).forEach(tipo => {
            if (serviciosData[tipo]) {
                servicios[tipo] = {
                    ...servicios[tipo],
                    descripcion: serviciosData[tipo].descripcion,
                    precio: serviciosData[tipo].precioBase,
                    servicios: serviciosData[tipo].servicios
                };
            }
        });
    }
}

// Función para actualizar configuración
function actualizarConfiguracion() {
    const ahora = new Date();
    document.getElementById('ultimoAcceso').textContent = ahora.toLocaleString('es-AR');
    document.getElementById('ultimoRespaldo').textContent = ahora.toLocaleString('es-AR');
    
    // Verificar estado de datos guardados
    const productos = localStorage.getItem('friocas_productos');
    const ofertas = localStorage.getItem('friocas_ofertas');
    const servicios = localStorage.getItem('friocas_servicios');
    
    let statusText = '';
    if (productos && ofertas && servicios) {
        const numProductos = JSON.parse(productos).length;
        const numOfertas = JSON.parse(ofertas).length;
        statusText = `✅ Datos guardados (${numProductos} productos, ${numOfertas} ofertas)`;
    } else {
        statusText = '⚠️ Datos por defecto (no guardados)';
    }
    
    document.getElementById('datosGuardadosStatus').textContent = statusText;
}

// Función para cambiar contraseña
function cambiarPassword() {
    const nuevaPassword = prompt('Ingresa la nueva contraseña:');
    if (nuevaPassword && nuevaPassword.length >= 6) {
        ADMIN_CREDENTIALS.password = nuevaPassword;
        mostrarNotificacion('Contraseña actualizada exitosamente.', 'success');
    } else if (nuevaPassword) {
        mostrarNotificacion('La contraseña debe tener al menos 6 caracteres.', 'error');
    }
}

// Función para exportar datos
function exportarDatos() {
    const datos = {
        productos: adminProducts,
        ofertas: adminOffers,
        fecha: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `friocas_datos_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostrarNotificacion('Datos exportados exitosamente.', 'success');
}

// Función para importar datos
function importarDatos() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const datos = JSON.parse(e.target.result);
                    if (datos.productos) {
                        adminProducts = datos.productos;
                        repuestos = [...datos.productos];
                    }
                    if (datos.ofertas) {
                        adminOffers = datos.ofertas;
                        ofertas = [...datos.ofertas];
                    }
                    if (datos.servicios) {
                        serviciosData = datos.servicios;
                    }
                    
                    // Guardar datos importados
                    guardarDatos();
                    
                    mostrarNotificacion('Datos importados exitosamente.', 'success');
                    actualizarDashboard();
                    cargarProductosActuales();
                    cargarOfertasActuales();
                } catch (error) {
                    mostrarNotificacion('Error al importar datos. Verifica el formato del archivo.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Función para limpiar todos los datos guardados
function limpiarDatosGuardados() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos guardados? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('friocas_productos');
        localStorage.removeItem('friocas_ofertas');
        localStorage.removeItem('friocas_servicios');
        
        // Recargar datos por defecto
        cargarDatosGuardados();
        
        mostrarNotificacion('Todos los datos han sido eliminados. Se han restaurado los valores por defecto.', 'info');
        
        // Actualizar vistas
        actualizarDashboard();
        cargarProductosActuales();
        cargarOfertasActuales();
    }
}

// Función para verificar datos guardados
function verificarDatosGuardados() {
    const productos = localStorage.getItem('friocas_productos');
    const ofertas = localStorage.getItem('friocas_ofertas');
    const servicios = localStorage.getItem('friocas_servicios');
    
    console.log('=== DATOS GUARDADOS ===');
    console.log('Productos:', productos ? JSON.parse(productos).length : 'No guardados');
    console.log('Ofertas:', ofertas ? JSON.parse(ofertas).length : 'No guardadas');
    console.log('Servicios:', servicios ? 'Guardados' : 'No guardados');
    console.log('========================');
    
    // Verificar servicios específicos
    if (servicios) {
        const serviciosData = JSON.parse(servicios);
        console.log('Servicios disponibles:', Object.keys(serviciosData));
        Object.keys(serviciosData).forEach(tipo => {
            console.log(`${tipo}: ${serviciosData[tipo].servicios.length} servicios específicos`);
        });
    }
    
    mostrarNotificacion(`Productos: ${productos ? JSON.parse(productos).length : 0}, Ofertas: ${ofertas ? JSON.parse(ofertas).length : 0}, Servicios: ${servicios ? Object.keys(JSON.parse(servicios)).length : 0}`, 'info');
}

// Función para verificar servicios específicos
function verificarServicios() {
    console.log('=== SERVICIOS ACTUALES ===');
    console.log('serviciosData:', serviciosData);
    console.log('Servicios en página principal:', typeof servicios !== 'undefined' ? servicios : 'No definido');
    console.log('==========================');
    
    // Forzar actualización de servicios
    cargarServiciosEnVista();
    actualizarServiciosEnPaginaPrincipal();
    
    mostrarNotificacion(`Servicios cargados: ${Object.keys(serviciosData).length}`, 'info');
}

// Función para reinicializar servicios
function reinicializarServicios() {
    // Recargar datos guardados
    cargarDatosGuardados();
    
    // Actualizar vistas
    cargarServiciosEnVista();
    actualizarServiciosEnPaginaPrincipal();
    
    mostrarNotificacion('Servicios reinicializados correctamente.', 'success');
}

// Función para probar el sistema completo
function probarSistema() {
    console.log('=== PRUEBA DEL SISTEMA ===');
    
    // Verificar variables globales
    console.log('adminProducts:', adminProducts ? adminProducts.length : 'No definido');
    console.log('adminOffers:', adminOffers ? adminOffers.length : 'No definido');
    console.log('serviciosData:', serviciosData ? Object.keys(serviciosData).length : 'No definido');
    
    // Verificar localStorage
    const productos = localStorage.getItem('friocas_productos');
    const ofertas = localStorage.getItem('friocas_ofertas');
    const servicios = localStorage.getItem('friocas_servicios');
    
    console.log('localStorage productos:', productos ? JSON.parse(productos).length : 'No guardado');
    console.log('localStorage ofertas:', ofertas ? JSON.parse(ofertas).length : 'No guardado');
    console.log('localStorage servicios:', servicios ? 'Guardado' : 'No guardado');
    
    // Verificar funciones
    console.log('Función guardarDatos:', typeof guardarDatos);
    console.log('Función cargarDatosGuardados:', typeof cargarDatosGuardados);
    console.log('Función eliminarProducto:', typeof eliminarProducto);
    console.log('Función eliminarOferta:', typeof eliminarOferta);
    
    mostrarNotificacion('Prueba del sistema completada. Revisa la consola.', 'info');
}

// Función para reinicializar completamente el sistema
function reinicializarSistemaCompleto() {
    console.log('=== REINICIALIZACIÓN COMPLETA ===');
    
    // Limpiar localStorage
    localStorage.removeItem('friocas_productos');
    localStorage.removeItem('friocas_ofertas');
    localStorage.removeItem('friocas_servicios');
    
    // Recargar datos por defecto
    cargarDatosGuardados();
    
    // Actualizar todas las vistas
    actualizarDashboard();
    cargarProductosActuales();
    cargarOfertasActuales();
    cargarServiciosEnVista();
    actualizarServiciosEnPaginaPrincipal();
    
    console.log('Sistema reinicializado completamente');
    mostrarNotificacion('Sistema reinicializado completamente. Todos los datos han sido restaurados.', 'success');
}

// Función para mostrar vista previa de imagen
function mostrarVistaPrevia(input, previewId) {
    const preview = document.getElementById(previewId);
    const files = input.files;
    
    if (files.length > 0) {
        preview.innerHTML = '';
        
        // Mostrar todas las imágenes seleccionadas
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.style.cssText = 'display: inline-block; margin: 5px; position: relative;';
                imgContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Vista previa ${index + 1}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;">
                    <div style="position: absolute; top: -5px; right: -5px; background: #007bff; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">
                        ${index + 1}
                    </div>
                `;
                preview.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        });
    } else {
        preview.innerHTML = '';
    }
}

// Función para agregar nuevo producto
function agregarNuevoProducto() {
    const formData = new FormData(document.getElementById('addProductForm'));
    const imageFiles = document.getElementById('productImage').files;
    
    if (imageFiles.length === 0) {
        mostrarNotificacion('Por favor selecciona al menos una imagen para el producto.', 'error');
        return;
    }
    
    // Convertir todas las imágenes a base64
    const imagePromises = Array.from(imageFiles).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    });
    
    Promise.all(imagePromises).then(images => {
        const nuevoProducto = {
            id: adminProducts.length + 1,
            nombre: document.getElementById('productName').value,
            categoria: document.getElementById('productCategory').value,
            precio: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            descripcion: document.getElementById('productDescription').value,
            imagen: images[0], // Primera imagen como principal
            imagenes: images, // Todas las imágenes
            marca: document.getElementById('productBrand').value,
            estado: document.getElementById('productStatus').value
        };
        
        // Agregar a la lista de administración
        adminProducts.push(nuevoProducto);
        
        // Actualizar la lista principal
        repuestos.push(nuevoProducto);
        
        // Guardar datos
        guardarDatos();
        
        // Actualizar la vista
        cargarProductosActuales();
        limpiarFormularioProducto();
        
        mostrarNotificacion(`Producto agregado exitosamente con ${images.length} imagen(es).`, 'success');
    });
}

// Función para agregar nueva oferta
function agregarNuevaOferta() {
    const imageFiles = document.getElementById('offerImage').files;
    
    if (imageFiles.length === 0) {
        mostrarNotificacion('Por favor selecciona al menos una imagen para la oferta.', 'error');
        return;
    }
    
    // Convertir todas las imágenes a base64
    const imagePromises = Array.from(imageFiles).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    });
    
    Promise.all(imagePromises).then(images => {
        const nuevaOferta = {
            id: adminOffers.length + 1,
            nombre: document.getElementById('offerName').value,
            precioOriginal: parseFloat(document.getElementById('offerOriginalPrice').value),
            precioDescuento: parseFloat(document.getElementById('offerDiscountedPrice').value),
            stock: parseInt(document.getElementById('offerStock').value),
            descripcion: document.getElementById('offerDescription').value,
            imagen: images[0], // Primera imagen como principal
            imagenes: images, // Todas las imágenes
            descuento: Math.round(((parseFloat(document.getElementById('offerOriginalPrice').value) - parseFloat(document.getElementById('offerDiscountedPrice').value)) / parseFloat(document.getElementById('offerOriginalPrice').value)) * 100)
        };
        
        // Agregar a la lista de administración
        adminOffers.push(nuevaOferta);
        
        // Actualizar la lista principal
        ofertas.push(nuevaOferta);
        
        // Guardar datos
        guardarDatos();
        
        // Actualizar la vista
        cargarOfertasActuales();
        limpiarFormularioOferta();
        
        mostrarNotificacion(`Oferta agregada exitosamente con ${images.length} imagen(es).`, 'success');
    });
}

// Función para cargar productos actuales
function cargarProductosActuales() {
    const container = document.getElementById('currentProductsList');
    container.innerHTML = '';
    
    adminProducts.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <div class="product-info">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=60&fit=crop'">
                <div class="product-details">
                    <div class="product-name">${producto.nombre}</div>
                    <div class="product-price">$${producto.precio.toLocaleString()}</div>
                    <div class="product-stock">Stock: ${producto.stock} | ${producto.categoria}</div>
                </div>
            </div>
            <div class="product-actions">
                <button onclick="editarProducto(${producto.id})" class="btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="eliminarProducto(${producto.id})" class="btn-delete">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Función para cargar ofertas actuales
function cargarOfertasActuales() {
    const container = document.getElementById('currentOffersList');
    container.innerHTML = '';
    
    adminOffers.forEach(oferta => {
        const item = document.createElement('div');
        item.className = 'offer-item';
        item.innerHTML = `
            <div class="offer-info">
                <img src="${oferta.imagen}" alt="${oferta.nombre}" class="offer-image" onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=60&fit=crop'">
                <div class="offer-details">
                    <div class="offer-name">${oferta.nombre}</div>
                    <div class="offer-price">$${(oferta.precioDescuento || 0).toLocaleString()} <span style="text-decoration: line-through; color: #999;">$${(oferta.precioOriginal || 0).toLocaleString()}</span></div>
                    <div class="offer-stock">Stock: ${oferta.stock || 0} | -${oferta.descuento || 0}%</div>
                </div>
            </div>
            <div class="offer-actions">
                <button onclick="editarOferta(${oferta.id})" class="btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="eliminarOferta(${oferta.id})" class="btn-delete">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Función para editar producto
function editarProducto(id) {
    const producto = adminProducts.find(p => p.id === id);
    if (producto) {
        // Llenar formulario con datos del producto
        document.getElementById('productName').value = producto.nombre;
        document.getElementById('productCategory').value = producto.categoria;
        document.getElementById('productPrice').value = producto.precio;
        document.getElementById('productStock').value = producto.stock;
        document.getElementById('productDescription').value = producto.descripcion;
        document.getElementById('productBrand').value = producto.marca;
        document.getElementById('productStatus').value = producto.estado;
        
        // Mostrar imagen actual
        document.getElementById('productImagePreview').innerHTML = `<img src="${producto.imagen}" alt="Imagen actual">`;
        
        // Cambiar texto del botón
        const submitBtn = document.querySelector('#addProductForm button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Producto';
        submitBtn.onclick = function(e) {
            e.preventDefault();
            actualizarProducto(id);
        };
        
        mostrarNotificacion('Modo edición activado. Completa los cambios y guarda.', 'info');
    }
}

// Función para actualizar producto
function actualizarProducto(id) {
    const index = adminProducts.findIndex(p => p.id === id);
    if (index !== -1) {
        const imageFile = document.getElementById('productImage').files[0];
        
        if (imageFile) {
            // Nueva imagen seleccionada
            const reader = new FileReader();
            reader.onload = function(e) {
                actualizarDatosProducto(index, e.target.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            // Mantener imagen actual
            actualizarDatosProducto(index, adminProducts[index].imagen);
        }
    }
}

// Función auxiliar para actualizar datos del producto
function actualizarDatosProducto(index, imagen) {
    adminProducts[index] = {
        ...adminProducts[index],
        nombre: document.getElementById('productName').value,
        categoria: document.getElementById('productCategory').value,
        precio: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        descripcion: document.getElementById('productDescription').value,
        imagen: imagen,
        marca: document.getElementById('productBrand').value,
        estado: document.getElementById('productStatus').value
    };
    
    // Actualizar también en la lista principal
    const mainIndex = repuestos.findIndex(p => p.id === adminProducts[index].id);
    if (mainIndex !== -1) {
        repuestos[mainIndex] = adminProducts[index];
    }
    
    // Guardar datos
    guardarDatos();
    
    cargarProductosActuales();
    limpiarFormularioProducto();
    resetearFormularioProducto();
    
    mostrarNotificacion('Producto actualizado exitosamente.', 'success');
}

// Función para eliminar producto
function eliminarProducto(id) {
    console.log('Intentando eliminar producto con ID:', id);
    console.log('Productos antes de eliminar:', adminProducts.length);
    
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        const index = adminProducts.findIndex(p => p.id === id);
        console.log('Índice encontrado en adminProducts:', index);
        
        if (index !== -1) {
            adminProducts.splice(index, 1);
            console.log('Producto eliminado de adminProducts');
            
            // Eliminar también de la lista principal
            const mainIndex = repuestos.findIndex(p => p.id === id);
            console.log('Índice encontrado en repuestos:', mainIndex);
            
            if (mainIndex !== -1) {
                repuestos.splice(mainIndex, 1);
                console.log('Producto eliminado de repuestos');
            }
            
            // Guardar datos
            guardarDatos();
            console.log('Datos guardados después de eliminar');
            
            cargarProductosActuales();
            mostrarNotificacion('Producto eliminado exitosamente.', 'success');
        } else {
            console.error('No se encontró el producto con ID:', id);
            mostrarNotificacion('Error: No se encontró el producto para eliminar.', 'error');
        }
    }
}

// Función para editar oferta
function editarOferta(id) {
    const oferta = adminOffers.find(o => o.id === id);
    if (oferta) {
        // Llenar formulario con datos de la oferta
        document.getElementById('offerName').value = oferta.nombre;
        document.getElementById('offerOriginalPrice').value = oferta.precioOriginal;
        document.getElementById('offerDiscountedPrice').value = oferta.precioDescuento;
        document.getElementById('offerStock').value = oferta.stock;
        document.getElementById('offerDescription').value = oferta.descripcion;
        
        // Mostrar imagen actual
        document.getElementById('offerImagePreview').innerHTML = `<img src="${oferta.imagen}" alt="Imagen actual">`;
        
        // Cambiar texto del botón
        const submitBtn = document.querySelector('#addOfferForm button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Oferta';
        submitBtn.onclick = function(e) {
            e.preventDefault();
            actualizarOferta(id);
        };
        
        mostrarNotificacion('Modo edición activado. Completa los cambios y guarda.', 'info');
    }
}

// Función para actualizar oferta
function actualizarOferta(id) {
    const index = adminOffers.findIndex(o => o.id === id);
    if (index !== -1) {
        const imageFile = document.getElementById('offerImage').files[0];
        
        if (imageFile) {
            // Nueva imagen seleccionada
            const reader = new FileReader();
            reader.onload = function(e) {
                actualizarDatosOferta(index, e.target.result);
            };
            reader.readAsDataURL(imageFile);
        } else {
            // Mantener imagen actual
            actualizarDatosOferta(index, adminOffers[index].imagen);
        }
    }
}

// Función auxiliar para actualizar datos de la oferta
function actualizarDatosOferta(index, imagen) {
    const precioOriginal = parseFloat(document.getElementById('offerOriginalPrice').value);
    const precioDescuento = parseFloat(document.getElementById('offerDiscountedPrice').value);
    
    adminOffers[index] = {
        ...adminOffers[index],
        nombre: document.getElementById('offerName').value,
        precioOriginal: precioOriginal,
        precioDescuento: precioDescuento,
        stock: parseInt(document.getElementById('offerStock').value),
        descripcion: document.getElementById('offerDescription').value,
        imagen: imagen,
        descuento: Math.round(((precioOriginal - precioDescuento) / precioOriginal) * 100)
    };
    
    // Actualizar también en la lista principal
    const mainIndex = ofertas.findIndex(o => o.id === adminOffers[index].id);
    if (mainIndex !== -1) {
        ofertas[mainIndex] = adminOffers[index];
    }
    
    // Guardar datos
    guardarDatos();
    
    cargarOfertasActuales();
    limpiarFormularioOferta();
    resetearFormularioOferta();
    
    mostrarNotificacion('Oferta actualizada exitosamente.', 'success');
}

// Función para eliminar oferta
function eliminarOferta(id) {
    console.log('Intentando eliminar oferta con ID:', id);
    console.log('Ofertas antes de eliminar:', adminOffers.length);
    
    if (confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
        const index = adminOffers.findIndex(o => o.id === id);
        console.log('Índice encontrado en adminOffers:', index);
        
        if (index !== -1) {
            adminOffers.splice(index, 1);
            console.log('Oferta eliminada de adminOffers');
            
            // Eliminar también de la lista principal
            const mainIndex = ofertas.findIndex(o => o.id === id);
            console.log('Índice encontrado en ofertas:', mainIndex);
            
            if (mainIndex !== -1) {
                ofertas.splice(mainIndex, 1);
                console.log('Oferta eliminada de ofertas');
            }
            
            // Guardar datos
            guardarDatos();
            console.log('Datos guardados después de eliminar oferta');
            
            cargarOfertasActuales();
            mostrarNotificacion('Oferta eliminada exitosamente.', 'success');
        } else {
            console.error('No se encontró la oferta con ID:', id);
            mostrarNotificacion('Error: No se encontró la oferta para eliminar.', 'error');
        }
    }
}

// Función para limpiar formularios de administración
function limpiarFormulariosAdmin() {
    limpiarFormularioProducto();
    limpiarFormularioOferta();
}

// Función para limpiar formulario de producto
function limpiarFormularioProducto() {
    document.getElementById('addProductForm').reset();
    document.getElementById('productImagePreview').innerHTML = '';
    resetearFormularioProducto();
}

// Función para limpiar formulario de oferta
function limpiarFormularioOferta() {
    document.getElementById('addOfferForm').reset();
    document.getElementById('offerImagePreview').innerHTML = '';
    resetearFormularioOferta();
}

// Función para resetear formulario de producto
function resetearFormularioProducto() {
    const submitBtn = document.querySelector('#addProductForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Producto';
    submitBtn.onclick = function(e) {
        e.preventDefault();
        agregarNuevoProducto();
    };
}

// Función para resetear formulario de oferta
function resetearFormularioOferta() {
    const submitBtn = document.querySelector('#addOfferForm button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Oferta';
    submitBtn.onclick = function(e) {
        e.preventDefault();
        agregarNuevaOferta();
    };
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${mensaje}</span>
    `;
    
    // Agregar estilos
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#28a745' : tipo === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos CSS para las notificaciones
const notificacionStyles = document.createElement('style');
notificacionStyles.textContent = `
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
document.head.appendChild(notificacionStyles);

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
    const adminModal = document.getElementById('adminModal');
    if (event.target === adminModal) {
        cerrarModalAdmin();
    }
});

// Permitir Enter para login
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('adminModal').style.display === 'block') {
        if (document.getElementById('adminLogin').style.display !== 'none') {
            loginAdmin();
        }
    }
});