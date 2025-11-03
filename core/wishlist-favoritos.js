// ===== WISHLIST / FAVORITOS - CRESALIA =====
// Sistema de lista de deseos con persistencia

class WishlistManager {
    constructor(tenantSlug) {
        this.tenantSlug = tenantSlug;
        this.wishlist = this.cargarWishlist();
        this.initUI();
    }

    // Cargar wishlist del localStorage
    cargarWishlist() {
        const stored = localStorage.getItem(`wishlist_${this.tenantSlug}`);
        return stored ? JSON.parse(stored) : [];
    }

    // Guardar wishlist
    guardarWishlist() {
        localStorage.setItem(`wishlist_${this.tenantSlug}`, JSON.stringify(this.wishlist));
        this.actualizarContador();
        
        // Si está logueado, sincronizar con backend
        if (window.usuario && window.usuario.id) {
            this.sincronizarConBackend();
        }
    }

    // Agregar producto a wishlist
    agregar(producto) {
        // Verificar si ya está
        if (this.estaEnWishlist(producto.id)) {
            this.mostrarNotificacion('Ya está en tu lista de deseos', 'info');
            return false;
        }

        this.wishlist.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen_principal,
            agregado_at: new Date().toISOString()
        });

        this.guardarWishlist();
        this.mostrarNotificacion('💜 ¡Agregado a tu lista de deseos!', 'success');
        
        // Animación del botón
        this.animarBoton(producto.id);
        
        return true;
    }

    // Quitar producto de wishlist
    quitar(productoId) {
        const index = this.wishlist.findIndex(item => item.id === productoId);
        
        if (index === -1) return false;

        const producto = this.wishlist[index];
        this.wishlist.splice(index, 1);
        this.guardarWishlist();
        
        this.mostrarNotificacion(`${producto.nombre} eliminado de tu lista`, 'info');
        this.actualizarBotones();
        
        return true;
    }

    // Verificar si producto está en wishlist
    estaEnWishlist(productoId) {
        return this.wishlist.some(item => item.id === productoId);
    }

    // Toggle (agregar o quitar)
    toggle(producto) {
        if (this.estaEnWishlist(producto.id)) {
            return this.quitar(producto.id);
        } else {
            return this.agregar(producto);
        }
    }

    // Obtener todos los items
    obtenerTodos() {
        return this.wishlist;
    }

    // Contar items
    contar() {
        return this.wishlist.length;
    }

    // Vaciar wishlist
    vaciar() {
        if (confirm('¿Estás seguro de que quieres vaciar tu lista de deseos?')) {
            this.wishlist = [];
            this.guardarWishlist();
            this.mostrarNotificacion('Lista de deseos vaciada', 'info');
            return true;
        }
        return false;
    }

    // Init UI
    initUI() {
        this.actualizarContador();
        this.actualizarBotones();
    }

    // Actualizar contador en header
    actualizarContador() {
        const contador = document.getElementById('wishlist-count');
        if (contador) {
            const count = this.contar();
            contador.textContent = count;
            contador.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Actualizar estado de todos los botones
    actualizarBotones() {
        document.querySelectorAll('.btn-wishlist').forEach(btn => {
            const productoId = parseInt(btn.dataset.productoId);
            const enWishlist = this.estaEnWishlist(productoId);
            
            btn.classList.toggle('active', enWishlist);
            btn.querySelector('i').className = enWishlist ? 'fas fa-heart' : 'far fa-heart';
            btn.title = enWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos';
        });
    }

    // Crear botón de wishlist
    crearBoton(producto, opciones = {}) {
        const { size = 'normal', texto = false } = opciones;
        const enWishlist = this.estaEnWishlist(producto.id);

        const btn = document.createElement('button');
        btn.className = `btn-wishlist ${size} ${enWishlist ? 'active' : ''}`;
        btn.dataset.productoId = producto.id;
        btn.title = enWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos';
        
        btn.innerHTML = `
            <i class="${enWishlist ? 'fas' : 'far'} fa-heart"></i>
            ${texto ? `<span>${enWishlist ? 'En favoritos' : 'Agregar a favoritos'}</span>` : ''}
        `;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle(producto);
        });

        return btn;
    }

    // Animación del botón
    animarBoton(productoId) {
        const btn = document.querySelector(`.btn-wishlist[data-producto-id="${productoId}"]`);
        if (btn) {
            btn.classList.add('animate-heart');
            setTimeout(() => {
                btn.classList.remove('animate-heart');
                this.actualizarBotones();
            }, 600);
        }
    }

    // Crear página de wishlist
    crearPaginaWishlist() {
        const page = document.createElement('div');
        page.className = 'wishlist-page';
        
        page.innerHTML = `
            <div class="wishlist-header">
                <h1>
                    <i class="fas fa-heart" style="color: #EC4899;"></i>
                    Mi Lista de Deseos
                </h1>
                <p>Guardaste ${this.contar()} productos especiales 💜</p>
            </div>

            ${this.contar() === 0 ? `
                <div class="wishlist-empty">
                    <i class="far fa-heart"></i>
                    <h2>Tu lista está vacía</h2>
                    <p>Guarda tus productos favoritos para comprarlos después</p>
                    <button class="btn-seguir-comprando" onclick="window.location.href='/'">
                        Explorar productos
                    </button>
                </div>
            ` : `
                <div class="wishlist-actions">
                    <button class="btn-vaciar" onclick="window.wishlistManager.vaciar()">
                        <i class="fas fa-trash"></i>
                        Vaciar lista
                    </button>
                </div>

                <div class="wishlist-grid" id="wishlist-items">
                    ${this.renderItems()}
                </div>
            `}

            ${this.getStyles()}
        `;

        return page;
    }

    // Render items
    renderItems() {
        return this.wishlist.map(item => `
            <div class="wishlist-item" data-item-id="${item.id}">
                <button class="btn-quitar" onclick="window.wishlistManager.quitar(${item.id})">
                    <i class="fas fa-times"></i>
                </button>

                ${item.imagen ? `
                    <img src="${item.imagen}" alt="${item.nombre}" class="item-imagen">
                ` : `
                    <div class="item-imagen-placeholder">
                        <i class="fas fa-box"></i>
                    </div>
                `}

                <div class="item-info">
                    <h3 class="item-nombre">${item.nombre}</h3>
                    <div class="item-precio">$${item.precio.toLocaleString()}</div>
                    <div class="item-agregado">
                        Agregado ${this.formatearFecha(item.agregado_at)}
                    </div>
                </div>

                <div class="item-actions">
                    <button class="btn-agregar-carrito" onclick="window.agregarAlCarrito(${item.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al carrito
                    </button>
                    <button class="btn-ver-producto" onclick="window.verProducto(${item.id})">
                        Ver producto
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Formatear fecha
    formatearFecha(isoString) {
        const fecha = new Date(isoString);
        const ahora = new Date();
        const diffDias = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));

        if (diffDias === 0) return 'hoy';
        if (diffDias === 1) return 'ayer';
        if (diffDias < 7) return `hace ${diffDias} días`;
        if (diffDias < 30) return `hace ${Math.floor(diffDias / 7)} semanas`;
        return fecha.toLocaleDateString();
    }

    // Sincronizar con backend (si está logueado)
    async sincronizarConBackend() {
        if (!window.usuario || !window.usuario.id) return;

        try {
            await fetch(`/api/wishlist/${this.tenantSlug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.usuario.token}`
                },
                body: JSON.stringify({
                    cliente_id: window.usuario.id,
                    items: this.wishlist.map(item => item.id)
                })
            });
        } catch (error) {
            console.log('No se pudo sincronizar wishlist:', error);
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo = 'info') {
        const notif = document.createElement('div');
        notif.className = `wishlist-notification ${tipo}`;
        notif.textContent = mensaje;
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add('show'), 10);
        
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // Estilos
    getStyles() {
        return `
        <style>
            /* Botón wishlist */
            .btn-wishlist {
                background: white;
                border: 2px solid #E5E7EB;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #9CA3AF;
                position: relative;
                overflow: hidden;
            }

            .btn-wishlist:hover {
                border-color: #EC4899;
                color: #EC4899;
                transform: scale(1.1);
            }

            .btn-wishlist.active {
                background: linear-gradient(135deg, #EC4899, #F472B6);
                border-color: #EC4899;
                color: white;
            }

            .btn-wishlist.animate-heart {
                animation: heartbeat 0.6s ease;
            }

            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                25% { transform: scale(1.3); }
                50% { transform: scale(1.1); }
                75% { transform: scale(1.25); }
            }

            /* Página wishlist */
            .wishlist-page {
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
            }

            .wishlist-header {
                text-align: center;
                margin-bottom: 48px;
            }

            .wishlist-header h1 {
                font-size: 42px;
                margin-bottom: 12px;
                color: #1F2937;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
            }

            .wishlist-header p {
                font-size: 18px;
                color: #6B7280;
            }

            /* Empty state */
            .wishlist-empty {
                text-align: center;
                padding: 80px 20px;
                background: linear-gradient(135deg, #F5F3FF, #FFFFFF);
                border-radius: 24px;
            }

            .wishlist-empty i {
                font-size: 80px;
                color: #EC4899;
                margin-bottom: 24px;
                opacity: 0.3;
            }

            .wishlist-empty h2 {
                font-size: 28px;
                color: #1F2937;
                margin-bottom: 12px;
            }

            .wishlist-empty p {
                font-size: 16px;
                color: #6B7280;
                margin-bottom: 32px;
            }

            .btn-seguir-comprando {
                padding: 16px 32px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border: none;
                border-radius: 50px;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
            }

            .btn-seguir-comprando:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 24px rgba(124, 58, 237, 0.4);
            }

            /* Actions */
            .wishlist-actions {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 24px;
            }

            .btn-vaciar {
                padding: 10px 20px;
                background: #FEE2E2;
                color: #EF4444;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
            }

            .btn-vaciar:hover {
                background: #FEE2E2;
                transform: translateY(-1px);
            }

            /* Grid de items */
            .wishlist-grid {
                display: grid;
                gap: 24px;
            }

            .wishlist-item {
                background: white;
                border-radius: 16px;
                padding: 24px;
                display: grid;
                grid-template-columns: auto 120px 1fr auto;
                gap: 24px;
                align-items: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                transition: all 0.3s ease;
                position: relative;
            }

            .wishlist-item:hover {
                box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                transform: translateY(-2px);
            }

            .btn-quitar {
                position: absolute;
                top: 16px;
                right: 16px;
                background: #FEE2E2;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                color: #EF4444;
                transition: all 0.2s;
            }

            .btn-quitar:hover {
                background: #FEE2E2;
                transform: scale(1.1);
            }

            .item-imagen, .item-imagen-placeholder {
                width: 120px;
                height: 120px;
                border-radius: 12px;
                object-fit: cover;
            }

            .item-imagen-placeholder {
                background: #F3F4F6;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #9CA3AF;
                font-size: 40px;
            }

            .item-info {
                flex: 1;
            }

            .item-nombre {
                font-size: 20px;
                font-weight: 700;
                color: #1F2937;
                margin-bottom: 8px;
            }

            .item-precio {
                font-size: 24px;
                font-weight: 800;
                color: #7C3AED;
                margin-bottom: 8px;
            }

            .item-agregado {
                font-size: 14px;
                color: #9CA3AF;
            }

            .item-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .btn-agregar-carrito, .btn-ver-producto {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 8px;
                justify-content: center;
                white-space: nowrap;
            }

            .btn-agregar-carrito {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
            }

            .btn-ver-producto {
                background: #F3F4F6;
                color: #6B7280;
            }

            .btn-agregar-carrito:hover, .btn-ver-producto:hover {
                transform: translateY(-1px);
            }

            /* Notificación */
            .wishlist-notification {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                z-index: 10000;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .wishlist-notification.show {
                transform: translateY(0);
                opacity: 1;
            }

            .wishlist-notification.success {
                border-left: 4px solid #10B981;
            }

            .wishlist-notification.info {
                border-left: 4px solid #3B82F6;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .wishlist-item {
                    grid-template-columns: 1fr;
                    text-align: center;
                }

                .item-imagen, .item-imagen-placeholder {
                    margin: 0 auto;
                }

                .item-actions {
                    width: 100%;
                }

                .btn-agregar-carrito, .btn-ver-producto {
                    width: 100%;
                }
            }
        </style>
        `;
    }
}

// Inicializar globalmente
window.initWishlist = function(tenantSlug) {
    window.wishlistManager = new WishlistManager(tenantSlug);
    return window.wishlistManager;
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WishlistManager };
}


