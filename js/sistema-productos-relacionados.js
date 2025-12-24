// ===== SISTEMA DE PRODUCTOS/SERVICIOS RELACIONADOS =====
// Muestra productos similares con filtros de precio y distancia

const SistemaProductosRelacionados = {
    
    /**
     * Obtener productos similares (misma categoría, características similares)
     */
    async obtenerProductosSimilares(productoActual, opciones = {}) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                return this.obtenerProductosSimilaresLocal(productoActual, opciones);
            }
            
            const {
                tipo = 'producto',
                limite = 6
            } = opciones;
            
            const tabla = tipo === 'producto' ? 'productos' : 'servicios';
            
            // Buscar productos de la misma categoría
            let query = supabase
                .from(tabla)
                .select('*')
                .eq('activo', true)
                .neq('id', productoActual.id);
            
            // Filtrar por categoría
            if (productoActual.categoria) {
                query = query.eq('categoria', productoActual.categoria);
            }
            
            // Excluir misma tienda para mostrar opciones
            if (productoActual.tienda_id) {
                query = query.neq('tienda_id', productoActual.tienda_id);
            }
            
            const { data: productos, error } = await query.limit(limite * 2); // Obtener más para filtrar mejor
            
            if (error) {
                console.error('Error obteniendo productos similares:', error);
                return [];
            }
            
            if (!productos || productos.length === 0) {
                return [];
            }
            
            // Calcular similitud basada en:
            // 1. Categoría (máxima prioridad)
            // 2. Precio similar (±30%)
            // 3. Nombre/descripción similar
            const productosConSimilitud = productos.map(producto => {
                let score = 0;
                
                // Misma categoría = +50 puntos
                if (producto.categoria === productoActual.categoria) {
                    score += 50;
                }
                
                // Precio similar (±30%) = +30 puntos
                const precioActual = parseFloat(productoActual.precio) || 0;
                const precio = parseFloat(producto.precio) || 0;
                const diferencia = Math.abs(precio - precioActual) / precioActual;
                if (diferencia <= 0.3) {
                    score += 30;
                }
                
                // Nombre similar = +20 puntos
                const nombreActual = (productoActual.nombre || '').toLowerCase();
                const nombre = (producto.nombre || '').toLowerCase();
                const palabrasActual = nombreActual.split(' ');
                const palabras = nombre.split(' ');
                const palabrasComunes = palabrasActual.filter(p => palabras.includes(p)).length;
                if (palabrasComunes > 0) {
                    score += 20 * (palabrasComunes / Math.max(palabrasActual.length, palabras.length));
                }
                
                return { ...producto, similitud: score };
            });
            
            // Ordenar por similitud y limitar
            return productosConSimilitud
                .sort((a, b) => b.similitud - a.similitud)
                .slice(0, limite);
            
        } catch (error) {
            console.error('Error en obtenerProductosSimilares:', error);
            return [];
        }
    },
    
    /**
     * Obtener productos relacionados
     * @param {Object} productoActual - Producto o servicio actual
     * @param {Object} opciones - Opciones de filtrado
     * @param {string} opciones.tipo - 'producto' o 'servicio'
     * @param {string} opciones.filtroPrecio - 'mas_bajo', 'mas_alto', 'similar'
     * @param {string} opciones.filtroDistancia - 'mas_cerca', 'mas_lejos', 'similar'
     * @param {number} opciones.limite - Cantidad de resultados (default: 6)
     * @param {Object} opciones.ubicacionUsuario - { lat, lng } para calcular distancia
     */
    async obtenerProductosRelacionados(productoActual, opciones = {}) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                console.warn('⚠️ Supabase no disponible, usando modo local');
                return this.obtenerProductosRelacionadosLocal(productoActual, opciones);
            }
            
            const {
                tipo = 'producto',
                filtroPrecio = 'similar',
                filtroDistancia = 'similar',
                limite = 6,
                ubicacionUsuario = null
            } = opciones;
            
            // Obtener todos los productos/servicios de la misma categoría
            const tabla = tipo === 'producto' ? 'productos' : 'servicios';
            let query = supabase
                .from(tabla)
                .select('*')
                .eq('activo', true)
                .neq('id', productoActual.id);
            
            // Filtrar por categoría si existe
            if (productoActual.categoria) {
                query = query.eq('categoria', productoActual.categoria);
            }
            
            // Filtrar por tienda si queremos excluir la misma tienda
            if (productoActual.tienda_id) {
                query = query.neq('tienda_id', productoActual.tienda_id);
            }
            
            const { data: productos, error } = await query;
            
            if (error) {
                console.error('Error obteniendo productos relacionados:', error);
                return [];
            }
            
            if (!productos || productos.length === 0) {
                return [];
            }
            
            // Aplicar filtros
            let productosFiltrados = [...productos];
            
            // Filtro de precio
            productosFiltrados = this.aplicarFiltroPrecio(productosFiltrados, productoActual, filtroPrecio);
            
            // Filtro de distancia (si hay ubicación)
            if (ubicacionUsuario && productoActual.ubicacion) {
                productosFiltrados = await this.aplicarFiltroDistancia(
                    productosFiltrados, 
                    productoActual, 
                    ubicacionUsuario, 
                    filtroDistancia
                );
            }
            
            // Ordenar y limitar
            return productosFiltrados.slice(0, limite);
            
        } catch (error) {
            console.error('Error en obtenerProductosRelacionados:', error);
            return [];
        }
    },
    
    /**
     * Aplicar filtro de precio
     */
    aplicarFiltroPrecio(productos, productoActual, filtro) {
        const precioActual = parseFloat(productoActual.precio) || 0;
        
        switch (filtro) {
            case 'mas_bajo':
                return productos
                    .filter(p => parseFloat(p.precio) < precioActual)
                    .sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio)); // Más bajo primero
                    
            case 'mas_alto':
                return productos
                    .filter(p => parseFloat(p.precio) > precioActual)
                    .sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio)); // Más alto primero
                    
            case 'similar':
            default:
                // Productos con precio similar (±20%)
                const margen = precioActual * 0.2;
                return productos
                    .filter(p => {
                        const precio = parseFloat(p.precio);
                        return precio >= (precioActual - margen) && precio <= (precioActual + margen);
                    })
                    .sort((a, b) => {
                        const diffA = Math.abs(parseFloat(a.precio) - precioActual);
                        const diffB = Math.abs(parseFloat(b.precio) - precioActual);
                        return diffA - diffB; // Más similar primero
                    });
        }
    },
    
    /**
     * Aplicar filtro de distancia
     */
    async aplicarFiltroDistancia(productos, productoActual, ubicacionUsuario, filtro) {
        try {
            // Calcular distancia del producto actual
            const distanciaActual = this.calcularDistancia(
                ubicacionUsuario,
                productoActual.ubicacion
            );
            
            // Calcular distancias para todos los productos
            const productosConDistancia = await Promise.all(
                productos.map(async (producto) => {
                    let ubicacion = producto.ubicacion;
                    
                    // Si no tiene ubicación, intentar obtenerla de la tienda
                    if (!ubicacion && producto.tienda_id) {
                        ubicacion = await this.obtenerUbicacionTienda(producto.tienda_id);
                    }
                    
                    if (!ubicacion) {
                        return { ...producto, distancia: Infinity };
                    }
                    
                    const distancia = this.calcularDistancia(ubicacionUsuario, ubicacion);
                    return { ...producto, distancia, ubicacion };
                })
            );
            
            // Aplicar filtro
            switch (filtro) {
                case 'mas_cerca':
                    return productosConDistancia
                        .filter(p => p.distancia < distanciaActual)
                        .sort((a, b) => a.distancia - b.distancia);
                        
                case 'mas_lejos':
                    return productosConDistancia
                        .filter(p => p.distancia > distanciaActual)
                        .sort((a, b) => b.distancia - a.distancia);
                        
                case 'similar':
                default:
                    // Productos con distancia similar (±5km)
                    const margen = 5; // km
                    return productosConDistancia
                        .filter(p => {
                            return p.distancia >= (distanciaActual - margen) && 
                                   p.distancia <= (distanciaActual + margen);
                        })
                        .sort((a, b) => {
                            const diffA = Math.abs(a.distancia - distanciaActual);
                            const diffB = Math.abs(b.distancia - distanciaActual);
                            return diffA - diffB;
                        });
            }
        } catch (error) {
            console.error('Error aplicando filtro de distancia:', error);
            return productos; // Retornar sin filtrar si hay error
        }
    },
    
    /**
     * Calcular distancia entre dos puntos (fórmula de Haversine)
     */
    calcularDistancia(ubicacion1, ubicacion2) {
        if (!ubicacion1 || !ubicacion2) return Infinity;
        
        const lat1 = parseFloat(ubicacion1.lat || ubicacion1.latitude);
        const lng1 = parseFloat(ubicacion1.lng || ubicacion1.longitude);
        const lat2 = parseFloat(ubicacion2.lat || ubicacion2.latitude);
        const lng2 = parseFloat(ubicacion2.lng || ubicacion2.longitude);
        
        if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
            return Infinity;
        }
        
        const R = 6371; // Radio de la Tierra en km
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distancia = R * c;
        
        return distancia;
    },
    
    /**
     * Convertir grados a radianes
     */
    toRad(grados) {
        return grados * (Math.PI / 180);
    },
    
    /**
     * Obtener ubicación de una tienda
     */
    async obtenerUbicacionTienda(tiendaId) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return null;
            
            const { data: tienda } = await supabase
                .from('tiendas')
                .select('ubicacion, configuracion')
                .eq('id', tiendaId)
                .single();
            
            if (tienda?.ubicacion) {
                return tienda.ubicacion;
            }
            
            // Intentar desde configuración
            if (tienda?.configuracion?.ubicacion) {
                return tienda.configuracion.ubicacion;
            }
            
            return null;
        } catch (error) {
            console.error('Error obteniendo ubicación de tienda:', error);
            return null;
        }
    },
    
    /**
     * Obtener ubicación del usuario (geolocalización)
     */
    async obtenerUbicacionUsuario() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn('⚠️ Geolocalización no disponible');
                resolve(null);
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn('Error obteniendo ubicación:', error);
                    resolve(null);
                },
                { timeout: 5000, enableHighAccuracy: false }
            );
        });
    },
    
    /**
     * Renderizar productos relacionados
     */
    renderizarProductosRelacionados(productos, containerId, opciones = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('❌ Contenedor no encontrado:', containerId);
            return;
        }
        
        if (!productos || productos.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6B7280;">
                    <i class="fas fa-info-circle" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>No hay productos relacionados disponibles</p>
                </div>
            `;
            return;
        }
        
        const tipo = opciones.tipo || 'producto';
        const titulo = opciones.titulo || (tipo === 'producto' ? 'Productos Relacionados' : 'Servicios Relacionados');
        
        const html = `
            <div class="productos-relacionados-container" style="margin: 40px 0;">
                <h3 style="margin: 0 0 25px 0; color: #1F2937; font-size: 24px; font-weight: 700;">
                    <i class="fas fa-${tipo === 'producto' ? 'box' : 'concierge-bell'}"></i> ${titulo}
                </h3>
                
                <div class="productos-relacionados-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
                    ${productos.map(producto => this.renderizarProductoCard(producto, tipo)).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    /**
     * Renderizar card de producto/servicio
     */
    renderizarProductoCard(producto, tipo) {
        const precio = parseFloat(producto.precio) || 0;
        const precioFormateado = precio.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        });
        
        const imagen = producto.imagen_url || producto.imagen || '/assets/placeholder-producto.png';
        const nombre = producto.nombre || 'Sin nombre';
        const descripcion = (producto.descripcion || '').substring(0, 100);
        const distancia = producto.distancia !== undefined && producto.distancia !== Infinity 
            ? `${producto.distancia.toFixed(1)} km` 
            : '';
        
        return `
            <div class="producto-relacionado-card" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; cursor: pointer;" 
                 onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
                 onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'"
                 onclick="SistemaProductosRelacionados.abrirDetalleProducto(${producto.id}, '${tipo}')">
                <div style="position: relative; width: 100%; padding-top: 75%; background: #F3F4F6; overflow: hidden;">
                    <img src="${imagen}" alt="${nombre}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" 
                         onerror="this.src='/assets/placeholder-producto.png'">
                    ${producto.distancia ? `
                        <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px;">
                            <i class="fas fa-map-marker-alt"></i> ${distancia}
                        </div>
                    ` : ''}
                </div>
                <div style="padding: 15px;">
                    <h4 style="margin: 0 0 8px 0; color: #1F2937; font-size: 16px; font-weight: 600; line-height: 1.3;">
                        ${nombre}
                    </h4>
                    ${descripcion ? `
                        <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 13px; line-height: 1.4;">
                            ${descripcion}${producto.descripcion && producto.descripcion.length > 100 ? '...' : ''}
                        </p>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                        <span style="font-size: 20px; font-weight: 700; color: #7C3AED;">
                            ${precioFormateado}
                        </span>
                        <button style="background: #7C3AED; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            Ver más
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Abrir detalle de producto
     */
    abrirDetalleProducto(id, tipo) {
        // Redirigir o abrir modal según la implementación
        if (tipo === 'producto') {
            window.location.href = `#producto-${id}`;
        } else {
            window.location.href = `#servicio-${id}`;
        }
        
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('producto-relacionado-click', {
            detail: { id, tipo }
        }));
    },
    
    /**
     * Modo local (sin Supabase)
     */
    obtenerProductosRelacionadosLocal(productoActual, opciones) {
        // Implementación básica con localStorage
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        return productos
            .filter(p => p.id !== productoActual.id && p.activo)
            .slice(0, opciones.limite || 6);
    },
    
    /**
     * Modo local para productos similares
     */
    obtenerProductosSimilaresLocal(productoActual, opciones) {
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        return productos
            .filter(p => {
                if (p.id === productoActual.id || !p.activo) return false;
                if (productoActual.categoria && p.categoria === productoActual.categoria) return true;
                return false;
            })
            .slice(0, opciones.limite || 6);
    },
    
    /**
     * Renderizar sección de productos similares
     */
    async renderizarProductosSimilares(productoActual, containerId, opciones = {}) {
        try {
            const tipo = opciones.tipo || 'producto';
            const productosSimilares = await this.obtenerProductosSimilares(productoActual, {
                tipo,
                limite: opciones.limite || 6
            });
            
            if (productosSimilares.length === 0) {
                return; // No mostrar si no hay productos similares
            }
            
            this.renderizarProductosRelacionados(
                productosSimilares,
                containerId,
                {
                    tipo,
                    titulo: opciones.titulo || 'Productos Similares'
                }
            );
        } catch (error) {
            console.error('Error renderizando productos similares:', error);
        }
    }
};

// Hacer disponible globalmente
window.SistemaProductosRelacionados = SistemaProductosRelacionados;
