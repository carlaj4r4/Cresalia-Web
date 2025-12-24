// ===== SISTEMA DE COMPARACIÓN DE PRODUCTOS =====
// Permite comparar 2-3 productos lado a lado

const SistemaComparadorProductos = {
    maxProductos: 3, // Máximo de productos a comparar
    
    /**
     * Obtener productos en comparador
     */
    obtenerProductosComparar() {
        try {
            const productos = localStorage.getItem('productos_comparar');
            return productos ? JSON.parse(productos) : [];
        } catch (error) {
            console.error('Error obteniendo productos a comparar:', error);
            return [];
        }
    },
    
    /**
     * Guardar productos en comparador
     */
    guardarProductosComparar(productos) {
        try {
            localStorage.setItem('productos_comparar', JSON.stringify(productos));
        } catch (error) {
            console.error('Error guardando productos a comparar:', error);
        }
    },
    
    /**
     * Agregar producto al comparador
     */
    async agregarProducto(productoId, tiendaId) {
        try {
            const productos = this.obtenerProductosComparar();
            
            // Verificar si ya está agregado
            if (productos.some(p => p.id === productoId && p.tienda_id === tiendaId)) {
                return {
                    exito: false,
                    mensaje: 'Este producto ya está en el comparador'
                };
            }
            
            // Verificar límite
            if (productos.length >= this.maxProductos) {
                return {
                    exito: false,
                    mensaje: `Podés comparar máximo ${this.maxProductos} productos. Eliminá uno primero.`
                };
            }
            
            // Obtener datos completos del producto
            const supabase = await esperarInitSupabase();
            let productoCompleto = null;
            
            if (supabase) {
                const { data, error } = await supabase
                    .from('productos')
                    .select('*')
                    .eq('id', productoId)
                    .eq('tienda_id', tiendaId)
                    .single();
                
                if (!error && data) {
                    productoCompleto = data;
                }
            }
            
            // Si no se pudo obtener de Supabase, usar datos básicos
            if (!productoCompleto) {
                productoCompleto = {
                    id: productoId,
                    tienda_id: tiendaId,
                    nombre: `Producto ${productoId}`,
                    precio: 0,
                    categoria: 'Sin categoría',
                    stock: 0
                };
            }
            
            // Agregar producto
            productos.push({
                id: productoCompleto.id,
                tienda_id: productoCompleto.tienda_id || tiendaId,
                nombre: productoCompleto.nombre,
                precio: parseFloat(productoCompleto.precio) || 0,
                precio_anterior: parseFloat(productoCompleto.precio_anterior) || null,
                categoria: productoCompleto.categoria || 'Sin categoría',
                descripcion: productoCompleto.descripcion || '',
                descripcion_larga: productoCompleto.descripcion_larga || '',
                stock: parseInt(productoCompleto.stock) || 0,
                imagen_url: productoCompleto.imagen_url || productoCompleto.imagen_principal || '',
                sku: productoCompleto.sku || '',
                caracteristicas: productoCompleto.caracteristicas || {},
                especificaciones: productoCompleto.especificaciones || {},
                destacado: productoCompleto.destacado || false,
                nuevo: productoCompleto.nuevo || false
            });
            
            this.guardarProductosComparar(productos);
            
            return {
                exito: true,
                mensaje: 'Producto agregado al comparador',
                cantidad: productos.length
            };
            
        } catch (error) {
            console.error('Error agregando producto al comparador:', error);
            return {
                exito: false,
                mensaje: 'Error al agregar producto'
            };
        }
    },
    
    /**
     * Eliminar producto del comparador
     */
    eliminarProducto(productoId, tiendaId) {
        try {
            const productos = this.obtenerProductosComparar();
            const filtrados = productos.filter(
                p => !(p.id === productoId && p.tienda_id === tiendaId)
            );
            
            this.guardarProductosComparar(filtrados);
            
            return {
                exito: true,
                mensaje: 'Producto eliminado del comparador',
                cantidad: filtrados.length
            };
            
        } catch (error) {
            console.error('Error eliminando producto del comparador:', error);
            return {
                exito: false,
                mensaje: 'Error al eliminar producto'
            };
        }
    },
    
    /**
     * Verificar si un producto está en el comparador
     */
    estaEnComparador(productoId, tiendaId) {
        const productos = this.obtenerProductosComparar();
        return productos.some(p => p.id === productoId && p.tienda_id === tiendaId);
    },
    
    /**
     * Obtener cantidad de productos en comparador
     */
    obtenerCantidad() {
        return this.obtenerProductosComparar().length;
    },
    
    /**
     * Renderizar botón de comparar
     */
    renderizarBotonComparar(productoId, tiendaId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const estaAgregado = this.estaEnComparador(productoId, tiendaId);
        const cantidad = this.obtenerCantidad();
        
        if (estaAgregado) {
            container.innerHTML = `
                <button onclick="SistemaComparadorProductos.eliminarProductoUI(${productoId}, '${tiendaId}')" 
                        style="background: #EF4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 10px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;"
                        onmouseover="this.style.background='#DC2626'"
                        onmouseout="this.style.background='#EF4444'">
                    <i class="fas fa-times"></i> Quitar de Comparar
                </button>
            `;
        } else {
            const disabled = cantidad >= this.maxProductos;
            container.innerHTML = `
                <button onclick="SistemaComparadorProductos.agregarProductoUI(${productoId}, '${tiendaId}')" 
                        ${disabled ? 'disabled' : ''}
                        style="background: ${disabled ? '#9CA3AF' : '#3B82F6'}; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: ${disabled ? 'not-allowed' : 'pointer'}; font-weight: 600; width: 100%; margin-top: 10px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;"
                        ${!disabled ? `onmouseover="this.style.background='#2563EB'" onmouseout="this.style.background='#3B82F6'"` : ''}>
                    <i class="fas fa-balance-scale"></i> ${disabled ? `Máximo ${this.maxProductos} productos` : 'Agregar a Comparar'}
                </button>
            `;
        }
    },
    
    /**
     * Agregar producto (UI)
     */
    async agregarProductoUI(productoId, tiendaId) {
        const resultado = await this.agregarProducto(productoId, tiendaId);
        
        if (resultado.exito) {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('✅ ' + resultado.mensaje + ` (${resultado.cantidad}/${this.maxProductos})`, 'success');
            } else {
                alert('✅ ' + resultado.mensaje);
            }
            
            // Actualizar botón
            const container = document.getElementById(`comparar-producto-${productoId}`);
            if (container) {
                this.renderizarBotonComparar(productoId, tiendaId, `comparar-producto-${productoId}`);
            }
            
            // Actualizar contador en header
            this.actualizarContador();
        } else {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('❌ ' + resultado.mensaje, 'error');
            } else {
                alert('❌ ' + resultado.mensaje);
            }
        }
    },
    
    /**
     * Eliminar producto (UI)
     */
    eliminarProductoUI(productoId, tiendaId) {
        const resultado = this.eliminarProducto(productoId, tiendaId);
        
        if (resultado.exito) {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('✅ ' + resultado.mensaje, 'success');
            } else {
                alert('✅ ' + resultado.mensaje);
            }
            
            // Actualizar botón
            const container = document.getElementById(`comparar-producto-${productoId}`);
            if (container) {
                this.renderizarBotonComparar(productoId, tiendaId, `comparar-producto-${productoId}`);
            }
            
            // Actualizar contador
            this.actualizarContador();
        }
    },
    
    /**
     * Actualizar contador en header
     */
    actualizarContador() {
        const cantidad = this.obtenerCantidad();
        const contador = document.getElementById('contador-comparador');
        if (contador) {
            contador.textContent = cantidad;
            contador.style.display = cantidad > 0 ? 'inline-block' : 'none';
        }
    },
    
    /**
     * Mostrar panel de comparación
     */
    mostrarPanelComparacion() {
        const productos = this.obtenerProductosComparar();
        
        if (productos.length < 2) {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('⚠️ Necesitás al menos 2 productos para comparar', 'warning');
            } else {
                alert('⚠️ Necesitás al menos 2 productos para comparar');
            }
            return;
        }
        
        const modalHTML = `
            <div id="modal-comparador-productos" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto;">
                <div style="background: white; border-radius: 20px; max-width: 1400px; width: 100%; max-height: 90vh; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 25px; border-radius: 20px 20px 0 0; position: sticky; top: 0; z-index: 10;">
                        <button onclick="cerrarModalComparador()" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); border: none; color: white; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-times"></i>
                        </button>
                        <h2 style="margin: 0; font-size: 24px; display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-balance-scale"></i> Comparar Productos
                        </h2>
                        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">
                            Compará características, precios y especificaciones lado a lado
                        </p>
                    </div>
                    
                    <!-- Contenido -->
                    <div style="padding: 30px; overflow-x: auto;">
                        ${this.renderizarComparacion(productos)}
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal existente
        const modalExistente = document.getElementById('modal-comparador-productos');
        if (modalExistente) {
            modalExistente.remove();
        }
        
        // Agregar modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Event listeners
        const modal = document.getElementById('modal-comparador-productos');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModalComparador();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('modal-comparador-productos')) {
                cerrarModalComparador();
            }
        });
    },
    
    /**
     * Renderizar tabla de comparación
     */
    renderizarComparacion(productos) {
        // Obtener todas las características únicas
        const todasCaracteristicas = new Set();
        const todasEspecificaciones = new Set();
        
        productos.forEach(producto => {
            if (producto.caracteristicas && typeof producto.caracteristicas === 'object') {
                Object.keys(producto.caracteristicas).forEach(key => todasCaracteristicas.add(key));
            }
            if (producto.especificaciones && typeof producto.especificaciones === 'object') {
                Object.keys(producto.especificaciones).forEach(key => todasEspecificaciones.add(key));
            }
        });
        
        const caracteristicasArray = Array.from(todasCaracteristicas);
        const especificacionesArray = Array.from(todasEspecificaciones);
        
        // Calcular ancho de columnas
        const anchoColumna = `${100 / (productos.length + 1)}%`;
        
        let html = `
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; min-width: 800px;">
                    <thead>
                        <tr>
                            <th style="width: 200px; padding: 15px; text-align: left; background: #F8FAFC; border-bottom: 2px solid #E5E7EB; position: sticky; left: 0; z-index: 5;">
                                <strong>Característica</strong>
                            </th>
                            ${productos.map((producto, index) => `
                                <th style="width: ${anchoColumna}; padding: 15px; text-align: center; background: #F8FAFC; border-bottom: 2px solid #E5E7EB; vertical-align: top;">
                                    <div style="position: relative;">
                                        <button onclick="SistemaComparadorProductos.eliminarProductoUI(${producto.id}, '${producto.tienda_id}'); cerrarModalComparador(); setTimeout(() => SistemaComparadorProductos.mostrarPanelComparacion(), 100);" 
                                                style="position: absolute; top: -5px; right: -5px; background: #EF4444; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-times"></i>
                                        </button>
                                        ${producto.imagen_url ? `
                                            <img src="${producto.imagen_url}" alt="${producto.nombre}" 
                                                 style="width: 120px; height: 120px; object-fit: cover; border-radius: 12px; margin-bottom: 10px;">
                                        ` : `
                                            <div style="width: 120px; height: 120px; background: #E5E7EB; border-radius: 12px; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                                <i class="fas fa-image" style="font-size: 32px; color: #9CA3AF;"></i>
                                            </div>
                                        `}
                                        <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #1F2937; font-weight: 600;">
                                            ${producto.nombre}
                                        </h3>
                                        <div style="color: #8B5CF6; font-size: 20px; font-weight: 700; margin: 10px 0;">
                                            $${producto.precio.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                                        </div>
                                        ${producto.precio_anterior ? `
                                            <div style="color: #9CA3AF; font-size: 14px; text-decoration: line-through;">
                                                $${producto.precio_anterior.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                                            </div>
                                        ` : ''}
                                    </div>
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Precio -->
                        <tr style="background: #F8FAFC;">
                            <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; position: sticky; left: 0; background: #F8FAFC;">
                                Precio
                            </td>
                            ${productos.map(producto => `
                                <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">
                                    <div style="color: #8B5CF6; font-weight: 700; font-size: 18px;">
                                        $${producto.precio.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                                    </div>
                                    ${producto.precio_anterior ? `
                                        <div style="color: #9CA3AF; font-size: 12px; text-decoration: line-through; margin-top: 4px;">
                                            $${producto.precio_anterior.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                                        </div>
                                    ` : ''}
                                </td>
                            `).join('')}
                        </tr>
                        
                        <!-- Categoría -->
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; position: sticky; left: 0; background: white;">
                                Categoría
                            </td>
                            ${productos.map(producto => `
                                <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">
                                    ${producto.categoria}
                                </td>
                            `).join('')}
                        </tr>
                        
                        <!-- Stock -->
                        <tr style="background: #F8FAFC;">
                            <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; position: sticky; left: 0; background: #F8FAFC;">
                                Stock Disponible
                            </td>
                            ${productos.map(producto => `
                                <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">
                                    <span style="padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 14px; 
                                        background: ${producto.stock > 0 ? '#D1FAE5' : '#FEE2E2'}; 
                                        color: ${producto.stock > 0 ? '#065F46' : '#991B1B'};">
                                        ${producto.stock > 0 ? `${producto.stock} unidades` : 'Sin stock'}
                                    </span>
                                </td>
                            `).join('')}
                        </tr>
                        
                        <!-- SKU -->
                        ${productos.some(p => p.sku) ? `
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; position: sticky; left: 0; background: white;">
                                    SKU
                                </td>
                                ${productos.map(producto => `
                                    <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center; font-family: monospace; font-size: 13px;">
                                        ${producto.sku || '-'}
                                    </td>
                                `).join('')}
                            </tr>
                        ` : ''}
                        
                        <!-- Descripción -->
                        ${productos.some(p => p.descripcion) ? `
                            <tr style="background: #F8FAFC;">
                                <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; position: sticky; left: 0; background: #F8FAFC; vertical-align: top;">
                                    Descripción
                                </td>
                                ${productos.map(producto => `
                                    <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: left; font-size: 14px; max-width: 300px;">
                                        ${producto.descripcion || '-'}
                                    </td>
                                `).join('')}
                            </tr>
                        ` : ''}
                        
                        <!-- Características -->
                        ${caracteristicasArray.length > 0 ? caracteristicasArray.map(caracteristica => `
                            <tr>
                                <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; position: sticky; left: 0; background: white;">
                                    ${caracteristica}
                                </td>
                                ${productos.map(producto => {
                                    const valor = producto.caracteristicas && producto.caracteristicas[caracteristica];
                                    return `
                                        <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">
                                            ${valor || '-'}
                                        </td>
                                    `;
                                }).join('')}
                            </tr>
                        `).join('') : ''}
                        
                        <!-- Especificaciones -->
                        ${especificacionesArray.length > 0 ? especificacionesArray.map(especificacion => `
                            <tr style="background: #F8FAFC;">
                                <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; position: sticky; left: 0; background: #F8FAFC;">
                                    ${especificacion}
                                </td>
                                ${productos.map(producto => {
                                    const valor = producto.especificaciones && producto.especificaciones[especificacion];
                                    return `
                                        <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">
                                            ${valor || '-'}
                                        </td>
                                    `;
                                }).join('')}
                            </tr>
                        `).join('') : ''}
                        
                        <!-- Acciones -->
                        <tr style="background: #F8FAFC;">
                            <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; font-weight: 600; position: sticky; left: 0; background: #F8FAFC;">
                                Acciones
                            </td>
                            ${productos.map(producto => `
                                <td style="padding: 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">
                                    <button onclick="abrirDetalleProducto(${producto.id}, '${producto.tienda_id}')" 
                                            style="background: #3B82F6; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; width: 100%; margin-bottom: 5px;"
                                            onmouseover="this.style.background='#2563EB'"
                                            onmouseout="this.style.background='#3B82F6'">
                                        <i class="fas fa-eye"></i> Ver Detalle
                                    </button>
                                    <button onclick="agregarAlCarrito(${producto.id}, '${producto.tienda_id}', 1)" 
                                            style="background: #10B981; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; width: 100%;"
                                            onmouseover="this.style.background='#059669'"
                                            onmouseout="this.style.background='#10B981'">
                                        <i class="fas fa-cart-plus"></i> Agregar al Carrito
                                    </button>
                                </td>
                            `).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        
        return html;
    }
};

// Hacer disponible globalmente
window.SistemaComparadorProductos = SistemaComparadorProductos;

// Función para cerrar modal
function cerrarModalComparador() {
    const modal = document.getElementById('modal-comparador-productos');
    if (modal) {
        modal.remove();
    }
}

window.cerrarModalComparador = cerrarModalComparador;

// Actualizar contador al cargar
document.addEventListener('DOMContentLoaded', () => {
    if (window.SistemaComparadorProductos) {
        window.SistemaComparadorProductos.actualizarContador();
    }
});
