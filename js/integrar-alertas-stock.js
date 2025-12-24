// ===== INTEGRACIÓN DE ALERTAS DE STOCK =====
// Helper para agregar botones de alerta en productos

/**
 * Agregar botón de alerta de stock a un producto
 * @param {number|string} productoId - ID del producto
 * @param {string} tiendaId - ID de la tienda
 * @param {number} stockActual - Stock actual del producto
 * @param {string} containerId - ID del contenedor donde agregar el botón
 */
async function agregarBotonAlertaStock(productoId, tiendaId, stockActual, containerId) {
    try {
        if (!window.SistemaNotificacionesStock) {
            console.warn('⚠️ Sistema de notificaciones de stock no disponible');
            return;
        }
        
        const container = document.getElementById(containerId);
        if (!container) {
            // Crear contenedor si no existe
            const productoCard = document.querySelector(`[data-producto-id="${productoId}"]`);
            if (productoCard) {
                const nuevoContainer = document.createElement('div');
                nuevoContainer.id = `alerta-stock-${productoId}`;
                productoCard.appendChild(nuevoContainer);
                await window.SistemaNotificacionesStock.renderizarBotonAlerta(
                    productoId,
                    tiendaId,
                    stockActual,
                    `alerta-stock-${productoId}`
                );
            }
            return;
        }
        
        await window.SistemaNotificacionesStock.renderizarBotonAlerta(
            productoId,
            tiendaId,
            stockActual,
            containerId
        );
        
    } catch (error) {
        console.error('Error agregando botón de alerta:', error);
    }
}

/**
 * Verificar y notificar cambios de stock (llamar cuando se actualiza stock)
 * @param {number|string} productoId - ID del producto
 * @param {string} tiendaId - ID de la tienda
 * @param {number} stockNuevo - Nuevo stock del producto
 */
async function verificarCambioStock(productoId, tiendaId, stockNuevo) {
    try {
        if (!window.SistemaNotificacionesStock) {
            return;
        }
        
        await window.SistemaNotificacionesStock.verificarYNotificar(
            productoId,
            tiendaId,
            stockNuevo
        );
        
    } catch (error) {
        console.error('Error verificando cambio de stock:', error);
    }
}

// Hacer disponible globalmente
window.agregarBotonAlertaStock = agregarBotonAlertaStock;
window.verificarCambioStock = verificarCambioStock;

// Auto-inicializar en productos sin stock
document.addEventListener('DOMContentLoaded', async () => {
    // Esperar un poco para que todo cargue
    setTimeout(async () => {
        // Buscar productos sin stock y agregar botones de alerta
        const productosSinStock = document.querySelectorAll('[data-stock="0"], .sin-stock, [data-producto-stock="0"]');
        
        productosSinStock.forEach(async (elemento) => {
            const productoId = elemento.getAttribute('data-producto-id') || 
                              elemento.closest('[data-producto-id]')?.getAttribute('data-producto-id');
            const tiendaId = elemento.getAttribute('data-tienda-id') || 
                            elemento.closest('[data-tienda-id]')?.getAttribute('data-tienda-id');
            
            if (productoId && tiendaId) {
                const containerId = `alerta-stock-${productoId}`;
                if (!document.getElementById(containerId)) {
                    // Crear contenedor
                    const container = document.createElement('div');
                    container.id = containerId;
                    elemento.appendChild(container);
                }
                
                await agregarBotonAlertaStock(productoId, tiendaId, 0, containerId);
            }
        });
    }, 1000);
});
