// ===== WISHLIST / FAVORITOS - CRESALIA =====
// Sistema de lista de deseos con persistencia

class WishlistManager {
    constructor(tenantSlug) {
        this.tenantSlug = tenantSlug;
        this.listas = this.cargarWishlist();
        // Mantener compatibilidad con versión anterior
        if (Array.isArray(this.listas)) {
            this.listas = {
                favoritos: this.listas
            };
        }
        // Asegurar que existen las listas principales
        if (!this.listas.favoritos) {
            this.listas.favoritos = [];
        }
        if (!this.listas.servicios) {
            this.listas.servicios = [];
            this.listas.servicios.nombre = 'Servicios';
            this.listas.servicios.tipo = 'servicios';
            this.listas.servicios.limite = 100; // Límite de 100 servicios
        }
        if (!this.listas.tiendas) {
            this.listas.tiendas = [];
            this.listas.tiendas.nombre = 'Tiendas';
            this.listas.tiendas.tipo = 'tiendas';
        }
        this.initUI();
    }

    // Cargar wishlist del localStorage (ahora soporta múltiples listas)
    cargarWishlist() {
        const stored = localStorage.getItem(`wishlist_${this.tenantSlug}`);
        if (!stored) return { favoritos: [] };
        
        try {
            const parsed = JSON.parse(stored);
            // Si es array (versión antigua), convertir a objeto
            if (Array.isArray(parsed)) {
                return { favoritos: parsed };
            }
            return parsed;
        } catch (e) {
            return { favoritos: [] };
        }
    }

    // Guardar wishlist (ahora soporta múltiples listas)
    guardarWishlist() {
        localStorage.setItem(`wishlist_${this.tenantSlug}`, JSON.stringify(this.listas));
        this.actualizarContador();
        
        // Si está logueado, sincronizar con backend
        if (window.usuario && window.usuario.id) {
            this.sincronizarConBackend();
        }
    }

    // Obtener wishlist principal (para compatibilidad)
    get wishlist() {
        return this.listas.favoritos || [];
    }

    // Agregar producto/servicio/tienda a wishlist
    async agregar(producto, listaEspecifica = null) {
        // Verificar si ya está en alguna lista
        if (this.estaEnWishlist(producto.id)) {
            this.mostrarNotificacion('Ya está en tu lista de deseos', 'info');
            return false;
        }

        // Detectar tipo y tienda
        const tiendaNombre = producto.tienda_nombre || producto.tenant_nombre || producto.store_name || null;
        const tiendaId = producto.tienda_id || producto.tenant_id || producto.store_id || null;
        const esServicio = producto.tipo === 'servicio' || producto.es_servicio || producto.categoria === 'servicio' || false;
        const esTienda = producto.tipo === 'tienda' || producto.es_tienda || false;

        // Determinar lista automáticamente según el tipo
        if (!listaEspecifica) {
            if (esServicio) {
                listaEspecifica = 'servicios';
            } else if (esTienda) {
                listaEspecifica = 'tiendas';
            } else if (tiendaNombre) {
                // Si es producto de una tienda, preguntar si quiere lista específica
                const crearListaTienda = await this.preguntarCrearListaTienda(tiendaNombre, false);
                if (crearListaTienda) {
                    listaEspecifica = this.crearListaTienda(tiendaNombre, tiendaId, false);
                } else {
                    listaEspecifica = 'favoritos';
                }
            } else {
                listaEspecifica = 'favoritos';
            }
        }

        // Verificar límite de servicios (100)
        if (listaEspecifica === 'servicios') {
            const serviciosActuales = Array.isArray(this.listas.servicios) ? this.listas.servicios.length : 0;
            if (serviciosActuales >= 100) {
                // Mostrar recordatorio de antigüedad
                const liberarEspacio = await this.mostrarRecordatorioAntiguedad('servicios');
                if (!liberarEspacio) {
                    this.mostrarNotificacion('❌ Has alcanzado el límite de 100 servicios. Libera espacio eliminando servicios antiguos.', 'error');
                    return false;
                }
            }
        }

        // Agregar a la lista correspondiente
        const item = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen_principal || producto.imagen,
            agregado_at: new Date().toISOString(),
            tienda_nombre: tiendaNombre,
            tienda_id: tiendaId,
            tipo: esServicio ? 'servicio' : esTienda ? 'tienda' : 'producto'
        };

        if (!this.listas[listaEspecifica]) {
            this.listas[listaEspecifica] = [];
        }

        this.listas[listaEspecifica].push(item);
        this.guardarWishlist();
        
        const nombreLista = this.listas[listaEspecifica].nombre || 
                           (listaEspecifica === 'servicios' ? 'Servicios' : 
                            listaEspecifica === 'tiendas' ? 'Tiendas' : 
                            listaEspecifica === 'favoritos' ? 'Favoritos' : listaEspecifica);
        
        this.mostrarNotificacion(`💜 ¡Agregado a ${nombreLista}!`, 'success');
        
        // Animación del botón
        this.animarBoton(producto.id);
        
        return true;
    }

    // Mostrar recordatorio de antigüedad para liberar espacio
    mostrarRecordatorioAntiguedad(tipoLista) {
        return new Promise((resolve) => {
            const lista = this.listas[tipoLista];
            if (!Array.isArray(lista) || lista.length === 0) {
                resolve(false);
                return;
            }

            // Ordenar por antigüedad (más antiguos primero)
            const itemsOrdenados = [...lista].sort((a, b) => {
                return new Date(a.agregado_at) - new Date(b.agregado_at);
            });

            // Obtener los 5 más antiguos
            const masAntiguos = itemsOrdenados.slice(0, 5);
            const diasAntiguedad = masAntiguos.map(item => {
                const fecha = new Date(item.agregado_at);
                const ahora = new Date();
                return Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));
            });

            const modal = document.createElement('div');
            modal.className = 'wishlist-modal-overlay';
            modal.innerHTML = `
                <div class="wishlist-modal wishlist-recordatorio">
                    <div class="wishlist-modal-header">
                        <h3><i class="fas fa-exclamation-triangle" style="color: #F59E0B;"></i> Límite alcanzado</h3>
                        <button class="wishlist-modal-close" onclick="this.closest('.wishlist-modal-overlay').remove(); this.closest('.wishlist-modal-overlay').dataset.respuesta='cancelar';">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="wishlist-modal-body">
                        <p>Has alcanzado el límite de <strong>100 servicios</strong> en tu lista.</p>
                        <p class="wishlist-modal-hint">Puedes liberar espacio eliminando servicios antiguos:</p>
                        <div class="wishlist-antiguos-list">
                            ${masAntiguos.map((item, index) => `
                                <div class="wishlist-antiguo-item">
                                    <div class="antiguo-info">
                                        <strong>${item.nombre}</strong>
                                        <span class="antiguo-fecha">Agregado hace ${diasAntiguedad[index]} día${diasAntiguedad[index] > 1 ? 's' : ''}</span>
                                    </div>
                                    <button class="btn-eliminar-antiguo" onclick="window.wishlistManager.quitar(${item.id}); this.closest('.wishlist-modal-overlay').dataset.eliminado='si'; this.closest('.wishlist-antiguo-item').remove();">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="wishlist-modal-actions">
                        <button class="btn-wishlist-si" onclick="this.closest('.wishlist-modal-overlay').dataset.respuesta='continuar'; this.closest('.wishlist-modal-overlay').remove();">
                            <i class="fas fa-check"></i> Continuar sin agregar
                        </button>
                    </div>
                </div>
            `;

            // Agregar estilos específicos para recordatorio
            const styles = document.createElement('style');
            styles.textContent += `
                .wishlist-recordatorio {
                    max-width: 500px;
                }
                .wishlist-antiguos-list {
                    margin-top: 16px;
                    max-height: 300px;
                    overflow-y: auto;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 12px;
                }
                .wishlist-antiguo-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    background: #F9FAFB;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    transition: all 0.2s;
                }
                .wishlist-antiguo-item:hover {
                    background: #F3F4F6;
                }
                .antiguo-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .antiguo-info strong {
                    color: #1F2937;
                    font-size: 14px;
                }
                .antiguo-fecha {
                    color: #6B7280;
                    font-size: 12px;
                }
                .btn-eliminar-antiguo {
                    background: #FEE2E2;
                    border: none;
                    color: #EF4444;
                    padding: 8px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-eliminar-antiguo:hover {
                    background: #FECACA;
                    transform: scale(1.05);
                }
            `;
            document.head.appendChild(styles);

            document.body.appendChild(modal);

            // Esperar respuesta
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('.wishlist-modal-close')) {
                    resolve(false);
                    modal.remove();
                    styles.remove();
                }
            });

            // Verificar si se eliminó algo
            const checkResponse = setInterval(() => {
                if (modal.dataset.respuesta) {
                    clearInterval(checkResponse);
                    resolve(modal.dataset.respuesta === 'continuar' || modal.dataset.eliminado === 'si');
                    modal.remove();
                    styles.remove();
                }
            }, 100);
        });
    }

    // Preguntar al usuario si quiere crear lista de tienda
    preguntarCrearListaTienda(tiendaNombre, esServicio) {
        return new Promise((resolve) => {
            const tipo = esServicio ? 'servicio' : 'tienda';
            const modal = document.createElement('div');
            modal.className = 'wishlist-modal-overlay';
            modal.innerHTML = `
                <div class="wishlist-modal">
                    <div class="wishlist-modal-header">
                        <h3><i class="fas fa-heart"></i> ¿Crear lista de ${tipo}?</h3>
                        <button class="wishlist-modal-close" onclick="this.closest('.wishlist-modal-overlay').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="wishlist-modal-body">
                        <p>¿Quieres crear una lista exclusiva para <strong>${tiendaNombre}</strong>?</p>
                        <p class="wishlist-modal-hint">Así podrás organizar mejor tus productos favoritos por ${tipo}.</p>
                    </div>
                    <div class="wishlist-modal-actions">
                        <button class="btn-wishlist-si" onclick="this.closest('.wishlist-modal-overlay').dataset.respuesta='si'; this.closest('.wishlist-modal-overlay').remove();">
                            <i class="fas fa-check"></i> Sí, crear lista
                        </button>
                        <button class="btn-wishlist-no" onclick="this.closest('.wishlist-modal-overlay').dataset.respuesta='no'; this.closest('.wishlist-modal-overlay').remove();">
                            <i class="fas fa-times"></i> No, solo favoritos
                        </button>
                    </div>
                </div>
            `;

            // Estilos del modal
            const styles = document.createElement('style');
            styles.textContent = `
                .wishlist-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .wishlist-modal {
                    background: white;
                    border-radius: 20px;
                    padding: 0;
                    max-width: 450px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: slideUp 0.3s ease;
                }
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .wishlist-modal-header {
                    padding: 24px;
                    border-bottom: 1px solid #E5E7EB;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .wishlist-modal-header h3 {
                    margin: 0;
                    color: #1F2937;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .wishlist-modal-header h3 i {
                    color: #EC4899;
                }
                .wishlist-modal-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #6B7280;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                .wishlist-modal-close:hover {
                    background: #F3F4F6;
                    color: #1F2937;
                }
                .wishlist-modal-body {
                    padding: 24px;
                }
                .wishlist-modal-body p {
                    margin: 0 0 12px 0;
                    color: #4B5563;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .wishlist-modal-body strong {
                    color: #7C3AED;
                    font-weight: 600;
                }
                .wishlist-modal-hint {
                    font-size: 14px;
                    color: #6B7280;
                    font-style: italic;
                }
                .wishlist-modal-actions {
                    padding: 0 24px 24px;
                    display: flex;
                    gap: 12px;
                }
                .btn-wishlist-si, .btn-wishlist-no {
                    flex: 1;
                    padding: 14px 20px;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .btn-wishlist-si {
                    background: linear-gradient(135deg, #7C3AED, #EC4899);
                    color: white;
                    box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
                }
                .btn-wishlist-si:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px rgba(124, 58, 237, 0.4);
                }
                .btn-wishlist-no {
                    background: #F3F4F6;
                    color: #6B7280;
                }
                .btn-wishlist-no:hover {
                    background: #E5E7EB;
                    color: #1F2937;
                }
            `;
            document.head.appendChild(styles);

            document.body.appendChild(modal);

            // Esperar respuesta
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.closest('.wishlist-modal-close')) {
                    resolve(false);
                    modal.remove();
                }
            });

            // Escuchar respuesta de los botones
            const checkResponse = setInterval(() => {
                if (modal.dataset.respuesta) {
                    clearInterval(checkResponse);
                    resolve(modal.dataset.respuesta === 'si');
                    modal.remove();
                    styles.remove();
                }
            }, 100);
        });
    }

    // Crear lista específica de tienda
    crearListaTienda(tiendaNombre, tiendaId, esServicio) {
        const listaId = `tienda_${tiendaId || tiendaNombre.toLowerCase().replace(/\s+/g, '_')}`;
        
        if (!this.listas[listaId]) {
            this.listas[listaId] = [];
            this.listas[listaId].nombre = tiendaNombre;
            this.listas[listaId].tipo = esServicio ? 'servicio' : 'tienda';
            this.listas[listaId].tienda_id = tiendaId;
            this.listas[listaId].creada_at = new Date().toISOString();
            this.guardarWishlist();
            this.mostrarNotificacion(`✨ Lista "${tiendaNombre}" creada automáticamente`, 'success');
        }
        
        return listaId;
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

    // Verificar si producto está en alguna lista
    estaEnWishlist(productoId) {
        return Object.values(this.listas).some(lista => 
            Array.isArray(lista) && lista.some(item => item.id === productoId)
        );
    }

    // Obtener todas las listas (priorizando servicios, tiendas y favoritos)
    obtenerListas() {
        const listasOrdenadas = [];
        const listasPersonalizadas = [];

        // Primero agregar listas principales en orden específico
        const listasPrincipales = ['servicios', 'tiendas', 'favoritos'];
        listasPrincipales.forEach(listaId => {
            if (this.listas[listaId]) {
                const items = Array.isArray(this.listas[listaId]) ? this.listas[listaId] : [];
                listasOrdenadas.push({
                    id: listaId,
                    nombre: this.listas[listaId].nombre || 
                           (listaId === 'servicios' ? 'Servicios' : 
                            listaId === 'tiendas' ? 'Tiendas' : 'Favoritos'),
                    items: items,
                    tipo: this.listas[listaId].tipo || listaId,
                    tienda_id: this.listas[listaId].tienda_id || null,
                    limite: this.listas[listaId].limite || null,
                    contador: `${items.length}${this.listas[listaId].limite ? ` / ${this.listas[listaId].limite}` : ''}`
                });
            }
        });

        // Luego agregar listas personalizadas (por tienda)
        Object.keys(this.listas).forEach(listaId => {
            if (!listasPrincipales.includes(listaId)) {
                const items = Array.isArray(this.listas[listaId]) ? this.listas[listaId] : [];
                if (items.length > 0 || this.listas[listaId].nombre) {
                    listasPersonalizadas.push({
                        id: listaId,
                        nombre: this.listas[listaId].nombre || listaId,
                        items: items,
                        tipo: this.listas[listaId].tipo || 'tienda',
                        tienda_id: this.listas[listaId].tienda_id || null
                    });
                }
            }
        });

        return [...listasOrdenadas, ...listasPersonalizadas];
    }

    // Toggle (agregar o quitar) - ahora es async
    async toggle(producto) {
        if (this.estaEnWishlist(producto.id)) {
            return this.quitar(producto.id);
        } else {
            return await this.agregar(producto);
        }
    }

    // Obtener todos los items (de todas las listas o de una específica)
    obtenerTodos(listaId = null) {
        if (listaId) {
            return Array.isArray(this.listas[listaId]) ? this.listas[listaId] : [];
        }
        // Obtener todos los items de todas las listas
        const todosLosItems = [];
        Object.values(this.listas).forEach(lista => {
            if (Array.isArray(lista)) {
                todosLosItems.push(...lista);
            }
        });
        return todosLosItems;
    }

    // Contar items (en todas las listas o en una específica)
    contar(listaId = null) {
        if (listaId) {
            return Array.isArray(this.listas[listaId]) ? this.listas[listaId].length : 0;
        }
        // Contar todos los items en todas las listas
        return Object.values(this.listas).reduce((total, lista) => {
            return total + (Array.isArray(lista) ? lista.length : 0);
        }, 0);
    }

    // Vaciar wishlist (puede ser una lista específica o todas)
    vaciar(listaId = null) {
        const mensaje = listaId 
            ? `¿Estás seguro de que quieres vaciar la lista "${this.listas[listaId]?.nombre || listaId}"?`
            : '¿Estás seguro de que quieres vaciar todas tus listas de deseos?';
        
        if (confirm(mensaje)) {
            if (listaId) {
                if (this.listas[listaId]) {
                    this.listas[listaId] = [];
                    this.guardarWishlist();
                    this.mostrarNotificacion(`Lista "${this.listas[listaId]?.nombre || listaId}" vaciada`, 'info');
                }
            } else {
                // Vaciar todas las listas
                Object.keys(this.listas).forEach(key => {
                    if (Array.isArray(this.listas[key])) {
                        this.listas[key] = [];
                    }
                });
                this.guardarWishlist();
                this.mostrarNotificacion('Todas las listas vaciadas', 'info');
            }
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

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await this.toggle(producto);
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

    // Crear página de wishlist (ahora con múltiples listas)
    crearPaginaWishlist() {
        const page = document.createElement('div');
        page.className = 'wishlist-page';
        
        const todasLasListas = this.obtenerListas();
        const totalItems = this.contar();
        
        page.innerHTML = `
            <div class="wishlist-header">
                <h1>
                    <i class="fas fa-heart" style="color: #EC4899;"></i>
                    Mis Listas de Deseos
                </h1>
                <p>Guardaste ${totalItems} productos especiales en ${todasLasListas.length} lista${todasLasListas.length > 1 ? 's' : ''} 💜</p>
            </div>

            ${totalItems === 0 ? `
                <div class="wishlist-empty">
                    <i class="far fa-heart"></i>
                    <h2>Tu lista está vacía</h2>
                    <p>Guarda tus productos favoritos para comprarlos después</p>
                    <button class="btn-seguir-comprando" onclick="window.location.href='/'">
                        Explorar productos
                    </button>
                </div>
            ` : `
                ${todasLasListas.length > 1 ? `
                    <div class="wishlist-tabs">
                        ${todasLasListas.map(lista => `
                            <button class="wishlist-tab ${lista.id === 'favoritos' ? 'active' : ''}" 
                                    onclick="window.wishlistManager.mostrarLista('${lista.id}')"
                                    data-lista-id="${lista.id}">
                                <i class="fas fa-${lista.tipo === 'servicio' ? 'briefcase' : lista.tipo === 'tienda' ? 'store' : 'heart'}"></i>
                                ${lista.nombre}
                                <span class="wishlist-tab-count">${lista.items.length}</span>
                            </button>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="wishlist-actions">
                    <button class="btn-vaciar" onclick="window.wishlistManager.vaciar()">
                        <i class="fas fa-trash"></i>
                        Vaciar todas las listas
                    </button>
                </div>

                <div class="wishlist-lists-container">
                    ${todasLasListas.map(lista => `
                        <div class="wishlist-list" data-lista-id="${lista.id}" style="${lista.id === 'favoritos' || todasLasListas.length === 1 ? '' : 'display: none;'}">
                            ${lista.items.length > 0 ? `
                                <div class="wishlist-list-header">
                                    <h3>
                                        <i class="fas fa-${lista.tipo === 'servicios' ? 'briefcase' : lista.tipo === 'tiendas' ? 'store' : lista.tipo === 'servicio' ? 'tools' : 'heart'}"></i>
                                        ${lista.nombre}
                                        <span class="wishlist-list-count">${lista.contador || lista.items.length} ${lista.tipo === 'servicios' ? 'servicio' : lista.tipo === 'tiendas' ? 'tienda' : 'producto'}${lista.items.length !== 1 ? 's' : ''}</span>
                                        ${lista.limite ? `<span class="wishlist-limit-badge" style="background: ${lista.items.length >= lista.limite ? '#FEE2E2' : '#DBEAFE'}; color: ${lista.items.length >= lista.limite ? '#EF4444' : '#2563EB'}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-left: 8px;">
                                            Límite: ${lista.limite}
                                        </span>` : ''}
                                    </h3>
                                    ${lista.id !== 'favoritos' ? `
                                        <button class="btn-vaciar-lista" onclick="window.wishlistManager.vaciar('${lista.id}')">
                                            <i class="fas fa-trash"></i> Vaciar esta lista
                                        </button>
                                    ` : ''}
                                </div>
                                <div class="wishlist-grid">
                                    ${this.renderItems(lista.items)}
                                </div>
                            ` : `
                                <div class="wishlist-list-empty">
                                    <i class="far fa-heart"></i>
                                    <p>Esta lista está vacía</p>
                                </div>
                            `}
                        </div>
                    `).join('')}
                </div>
            `}

            ${this.getStyles()}
        `;

        return page;
    }

    // Mostrar lista específica
    mostrarLista(listaId) {
        // Actualizar tabs
        document.querySelectorAll('.wishlist-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.listaId === listaId);
        });
        
        // Mostrar/ocultar listas
        document.querySelectorAll('.wishlist-list').forEach(lista => {
            lista.style.display = lista.dataset.listaId === listaId ? '' : 'none';
        });
    }

    // Render items (ahora acepta lista específica)
    renderItems(items = null) {
        const itemsToRender = items || this.wishlist;
        return itemsToRender.map(item => `
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

    // Sincronizar con backend (si está logueado) - ahora sincroniza todas las listas
    async sincronizarConBackend() {
        if (!window.usuario || !window.usuario.id) return;

        try {
            // Obtener todos los items de todas las listas
            const todosLosItems = [];
            Object.values(this.listas).forEach(lista => {
                if (Array.isArray(lista)) {
                    todosLosItems.push(...lista.map(item => item.id));
                }
            });

            await fetch(`/api/wishlist/${this.tenantSlug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.usuario.token}`
                },
                body: JSON.stringify({
                    cliente_id: window.usuario.id,
                    items: [...new Set(todosLosItems)], // Eliminar duplicados
                    listas: this.listas // Enviar estructura completa de listas
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

            /* Tabs para múltiples listas */
            .wishlist-tabs {
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
                flex-wrap: wrap;
                border-bottom: 2px solid #E5E7EB;
                padding-bottom: 12px;
            }

            .wishlist-tab {
                padding: 12px 20px;
                background: #F3F4F6;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 14px;
                color: #6B7280;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .wishlist-tab:hover {
                background: #E5E7EB;
                color: #1F2937;
            }

            .wishlist-tab.active {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                color: white;
                box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
            }

            .wishlist-tab i {
                font-size: 16px;
            }

            .wishlist-tab-count {
                background: rgba(255, 255, 255, 0.3);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                margin-left: 4px;
            }

            .wishlist-tab.active .wishlist-tab-count {
                background: rgba(255, 255, 255, 0.4);
            }

            /* Lista específica */
            .wishlist-list {
                margin-bottom: 32px;
            }

            .wishlist-list-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 16px;
                border-bottom: 2px solid #E5E7EB;
            }

            .wishlist-list-header h3 {
                margin: 0;
                font-size: 22px;
                color: #1F2937;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .wishlist-list-header h3 i {
                color: #7C3AED;
            }

            .wishlist-list-count {
                font-size: 14px;
                color: #6B7280;
                font-weight: 400;
                margin-left: 8px;
            }

            .btn-vaciar-lista {
                padding: 8px 16px;
                background: #FEE2E2;
                color: #EF4444;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 13px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s;
            }

            .btn-vaciar-lista:hover {
                background: #FECACA;
                transform: translateY(-1px);
            }

            .wishlist-list-empty {
                text-align: center;
                padding: 60px 20px;
                background: #F9FAFB;
                border-radius: 16px;
                color: #6B7280;
            }

            .wishlist-list-empty i {
                font-size: 48px;
                margin-bottom: 16px;
                opacity: 0.3;
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

                .wishlist-tabs {
                    overflow-x: auto;
                    flex-wrap: nowrap;
                    padding-bottom: 8px;
                }

                .wishlist-tab {
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .wishlist-list-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                }

                .btn-vaciar-lista {
                    width: 100%;
                    justify-content: center;
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


