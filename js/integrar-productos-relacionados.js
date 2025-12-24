// ===== INTEGRACIÓN DE PRODUCTOS RELACIONADOS =====
// Función helper para mostrar productos relacionados automáticamente

/**
 * Mostrar productos relacionados cuando se ve un producto
 * @param {number|string} productoId - ID del producto actual
 * @param {string} tipo - 'producto' o 'servicio'
 * @param {string} containerId - ID del contenedor donde mostrar
 * @param {Object} opciones - Opciones adicionales
 */
async function mostrarProductosRelacionados(productoId, tipo = 'producto', containerId = 'productos-relacionados', opciones = {}) {
    try {
        if (!window.SistemaProductosRelacionados) {
            console.warn('⚠️ Sistema de productos relacionados no disponible');
            return;
        }
        
        // Obtener producto actual
        const supabase = await esperarInitSupabase();
        if (!supabase) {
            console.warn('⚠️ Supabase no disponible');
            return;
        }
        
        const tabla = tipo === 'producto' ? 'productos' : 'servicios';
        const { data: productoActual, error } = await supabase
            .from(tabla)
            .select('*')
            .eq('id', productoId)
            .single();
        
        if (error || !productoActual) {
            console.error('Error obteniendo producto:', error);
            return;
        }
        
        // Obtener ubicación del usuario (opcional)
        let ubicacionUsuario = null;
        if (opciones.usarUbicacion !== false) {
            ubicacionUsuario = await window.SistemaProductosRelacionados.obtenerUbicacionUsuario();
        }
        
        // Obtener productos relacionados
        const productosRelacionados = await window.SistemaProductosRelacionados.obtenerProductosRelacionados(
            productoActual,
            {
                tipo,
                filtroPrecio: opciones.filtroPrecio || 'similar',
                filtroDistancia: opciones.filtroDistancia || 'similar',
                limite: opciones.limite || 6,
                ubicacionUsuario
            }
        );
        
        // Renderizar
        window.SistemaProductosRelacionados.renderizarProductosRelacionados(
            productosRelacionados,
            containerId,
            {
                tipo,
                titulo: opciones.titulo || (tipo === 'producto' ? 'Productos Relacionados' : 'Servicios Relacionados')
            }
        );
        
    } catch (error) {
        console.error('Error en mostrarProductosRelacionados:', error);
    }
}

/**
 * Agregar botón de comparar a un producto
 */
function agregarBotonComparar(productoId, tiendaId, containerId) {
    try {
        if (!window.SistemaComparadorProductos) {
            return;
        }
        
        const container = document.getElementById(containerId);
        if (!container) {
            // Crear contenedor si no existe
            const productoCard = document.querySelector(`[data-producto-id="${productoId}"]`);
            if (productoCard) {
                const nuevoContainer = document.createElement('div');
                nuevoContainer.id = `comparar-producto-${productoId}`;
                productoCard.appendChild(nuevoContainer);
                window.SistemaComparadorProductos.renderizarBotonComparar(
                    productoId,
                    tiendaId,
                    `comparar-producto-${productoId}`
                );
            }
            return;
        }
        
        window.SistemaComparadorProductos.renderizarBotonComparar(
            productoId,
            tiendaId,
            containerId
        );
        
    } catch (error) {
        console.error('Error agregando botón de comparar:', error);
    }
}

/**
 * Mostrar productos similares cuando se ve un producto
 */
async function mostrarProductosSimilares(productoId, tipo = 'producto', containerId = 'productos-similares', opciones = {}) {
    try {
        if (!window.SistemaProductosRelacionados) {
            console.warn('⚠️ Sistema de productos relacionados no disponible');
            return;
        }
        
        const supabase = await esperarInitSupabase();
        if (!supabase) {
            console.warn('⚠️ Supabase no disponible');
            return;
        }
        
        const tabla = tipo === 'producto' ? 'productos' : 'servicios';
        const { data: productoActual, error } = await supabase
            .from(tabla)
            .select('*')
            .eq('id', productoId)
            .single();
        
        if (error || !productoActual) {
            console.error('Error obteniendo producto:', error);
            return;
        }
        
        // Renderizar productos similares
        await window.SistemaProductosRelacionados.renderizarProductosSimilares(
            productoActual,
            containerId,
            {
                tipo,
                titulo: opciones.titulo || 'Productos Similares',
                limite: opciones.limite || 6
            }
        );
        
    } catch (error) {
        console.error('Error en mostrarProductosSimilares:', error);
    }
}

// Hacer disponible globalmente
window.mostrarProductosRelacionados = mostrarProductosRelacionados;
window.mostrarProductosSimilares = mostrarProductosSimilares;
window.agregarBotonComparar = agregarBotonComparar;
