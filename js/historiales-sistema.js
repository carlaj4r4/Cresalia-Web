// ===== SISTEMA DE HISTORIALES CRESALIA =====
// Historial de ventas para vendedores e historial de compras para compradores

console.log('📊 Iniciando sistema de historiales...');

// ===== HISTORIAL DE VENTAS (VENDEDORES) =====
const HISTORIAL_VENTAS = {
    // Función para mostrar historial de ventas
    mostrar: function() {
        console.log('📈 Mostrando historial de ventas...');
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; 
            background: rgba(0,0,0,0.8) !important; z-index: 999999 !important; display: flex !important; 
            align-items: center !important; justify-content: center !important; padding: 20px !important;
        `;
        
        // Obtener historial de ventas
        const ventas = JSON.parse(localStorage.getItem('historial_ventas') || '[]');
        
        modal.className = 'modal';
        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto;">
                <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #374151;">📊 Historial de Ventas</h3>
                    <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 20px;">
                    ${this.generarEstadisticas(ventas)}
                    <div style="margin-top: 30px;">
                        <h4 style="color: #374151; margin-bottom: 20px;">📋 Lista de Ventas</h4>
                        ${this.generarListaVentas(ventas)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('✅ Modal de historial de ventas agregado al DOM');
        
        // Forzar visibilidad
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        console.log('✅ Modal de historial de ventas forzado a ser visible');
    },
    
    // Generar estadísticas
    generarEstadisticas: function(ventas) {
        const totalVentas = ventas.length;
        const totalIngresos = ventas.reduce((sum, venta) => sum + (venta.precio || 0), 0);
        const ventasEsteMes = ventas.filter(v => {
            const fecha = new Date(v.fecha);
            const ahora = new Date();
            return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        }).length;
        
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; border-left: 4px solid #0ea5e9;">
                    <h5 style="margin: 0 0 10px 0; color: #0c4a6e;">Total de Ventas</h5>
                    <p style="margin: 0; font-size: 2rem; font-weight: bold; color: #0c4a6e;">${totalVentas}</p>
                </div>
                <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; border-left: 4px solid #22c55e;">
                    <h5 style="margin: 0 0 10px 0; color: #15803d;">Ingresos Totales</h5>
                    <p style="margin: 0; font-size: 2rem; font-weight: bold; color: #15803d;">$${totalIngresos.toFixed(2)}</p>
                </div>
                <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
                    <h5 style="margin: 0 0 10px 0; color: #92400e;">Ventas Este Mes</h5>
                    <p style="margin: 0; font-size: 2rem; font-weight: bold; color: #92400e;">${ventasEsteMes}</p>
                </div>
            </div>
        `;
    },
    
    // Generar lista de ventas
    generarListaVentas: function(ventas) {
        if (ventas.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 15px; color: #d1d5db;"></i>
                    <h4 style="margin: 0 0 10px 0;">No hay ventas registradas</h4>
                    <p style="margin: 0;">Tus ventas aparecerán aquí cuando los clientes compren tus productos.</p>
                </div>
            `;
        }
        
        return `
            <div style="max-height: 400px; overflow-y: auto;">
                ${ventas.map(venta => `
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #22c55e;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <div>
                                <h6 style="margin: 0 0 5px 0; color: #374151;">${venta.producto || 'Producto'}</h6>
                                <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">Cliente: ${venta.cliente || 'Cliente'}</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="margin: 0; font-weight: bold; color: #22c55e;">$${venta.precio || 0}</p>
                                <p style="margin: 0; color: #6b7280; font-size: 0.8rem;">${venta.fecha || new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        ${venta.detalles ? `<p style="margin: 0; color: #4b5563; font-size: 0.9rem;">${venta.detalles}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // Agregar nueva venta
    agregarVenta: function(venta) {
        const ventas = JSON.parse(localStorage.getItem('historial_ventas') || '[]');
        ventas.unshift({
            id: Date.now(),
            fecha: new Date().toLocaleDateString(),
            ...venta
        });
        localStorage.setItem('historial_ventas', JSON.stringify(ventas));
        console.log('✅ Venta agregada al historial');
    }
};

// ===== HISTORIAL DE COMPRAS (COMPRADORES) =====
const HISTORIAL_COMPRAS = {
    // Función para mostrar historial de compras
    mostrar: function() {
        console.log('🛒 Mostrando historial de compras...');
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; 
            background: rgba(0,0,0,0.8) !important; z-index: 999999 !important; display: flex !important; 
            align-items: center !important; justify-content: center !important; padding: 20px !important;
        `;
        
        // Obtener historial de compras
        const compras = JSON.parse(localStorage.getItem('historial_compras') || '[]');
        
        modal.className = 'modal';
        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto;">
                <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #374151;">🛒 Mis Compras</h3>
                    <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 20px;">
                    ${this.generarEstadisticas(compras)}
                    <div style="margin-top: 30px;">
                        <h4 style="color: #374151; margin-bottom: 20px;">📋 Lista de Compras</h4>
                        ${this.generarListaCompras(compras)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('✅ Modal de historial de ventas agregado al DOM');
        
        // Forzar visibilidad
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        console.log('✅ Modal de historial de ventas forzado a ser visible');
    },
    
    // Generar estadísticas
    generarEstadisticas: function(compras) {
        const totalCompras = compras.length;
        const totalGastado = compras.reduce((sum, compra) => sum + (compra.precio || 0), 0);
        const comprasEsteMes = compras.filter(c => {
            const fecha = new Date(c.fecha);
            const ahora = new Date();
            return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        }).length;
        
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; border-left: 4px solid #0ea5e9;">
                    <h5 style="margin: 0 0 10px 0; color: #0c4a6e;">Total de Compras</h5>
                    <p style="margin: 0; font-size: 2rem; font-weight: bold; color: #0c4a6e;">${totalCompras}</p>
                </div>
                <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; border-left: 4px solid #22c55e;">
                    <h5 style="margin: 0 0 10px 0; color: #15803d;">Total Gastado</h5>
                    <p style="margin: 0; font-size: 2rem; font-weight: bold; color: #15803d;">$${totalGastado.toFixed(2)}</p>
                </div>
                <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
                    <h5 style="margin: 0 0 10px 0; color: #92400e;">Compras Este Mes</h5>
                    <p style="margin: 0; font-size: 2rem; font-weight: bold; color: #92400e;">${comprasEsteMes}</p>
                </div>
            </div>
        `;
    },
    
    // Generar lista de compras
    generarListaCompras: function(compras) {
        if (compras.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 15px; color: #d1d5db;"></i>
                    <h4 style="margin: 0 0 10px 0;">No hay compras registradas</h4>
                    <p style="margin: 0;">Tus compras aparecerán aquí cuando compres productos.</p>
                </div>
            `;
        }
        
        return `
            <div style="max-height: 400px; overflow-y: auto;">
                ${compras.map(compra => `
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #8B5CF6;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <div>
                                <h6 style="margin: 0 0 5px 0; color: #374151;">${compra.producto || 'Producto'}</h6>
                                <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">Tienda: ${compra.tienda || 'Tienda'}</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="margin: 0; font-weight: bold; color: #8B5CF6;">$${compra.precio || 0}</p>
                                <p style="margin: 0; color: #6b7280; font-size: 0.8rem;">${compra.fecha || new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <span style="background: ${this.getStatusColor(compra.estado)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                                ${compra.estado || 'Completado'}
                            </span>
                            ${compra.tracking ? `<span style="background: #e5e7eb; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">📦 ${compra.tracking}</span>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // Obtener color del estado
    getStatusColor: function(estado) {
        const colores = {
            'Completado': '#22c55e',
            'En Proceso': '#f59e0b',
            'Enviado': '#3b82f6',
            'Cancelado': '#ef4444',
            'Pendiente': '#6b7280'
        };
        return colores[estado] || '#6b7280';
    },
    
    // Agregar nueva compra
    agregarCompra: function(compra) {
        const compras = JSON.parse(localStorage.getItem('historial_compras') || '[]');
        compras.unshift({
            id: Date.now(),
            fecha: new Date().toLocaleDateString(),
            estado: 'Completado',
            ...compra
        });
        localStorage.setItem('historial_compras', JSON.stringify(compras));
        console.log('✅ Compra agregada al historial');
    }
};

// ===== FUNCIONES GLOBALES =====
window.mostrarHistorialVentas = HISTORIAL_VENTAS.mostrar.bind(HISTORIAL_VENTAS);
window.mostrarHistorialCompras = HISTORIAL_COMPRAS.mostrar.bind(HISTORIAL_COMPRAS);

// Asegurar que las funciones estén disponibles inmediatamente
if (typeof window.mostrarHistorialVentas !== 'function') {
    window.mostrarHistorialVentas = function() {
        console.log('📈 [FALLBACK] Mostrando historial de ventas...');
        HISTORIAL_VENTAS.mostrar();
    };
}

// ===== DATOS DE EJEMPLO =====
// Función para agregar datos de ejemplo (solo para testing)
function agregarDatosEjemplo() {
    // Datos de ejemplo para vendedores
    const ventasEjemplo = [
        {
            producto: 'Producto Premium',
            cliente: 'María González',
            precio: 150.00,
            detalles: 'Venta realizada con descuento del 10%'
        },
        {
            producto: 'Servicio Consultoría',
            cliente: 'Carlos López',
            precio: 300.00,
            detalles: 'Consulta de 2 horas'
        }
    ];
    
    // Datos de ejemplo para compradores
    const comprasEjemplo = [
        {
            producto: 'Producto Premium',
            tienda: 'Tienda Ejemplo',
            precio: 150.00,
            estado: 'Completado'
        },
        {
            producto: 'Servicio Consultoría',
            tienda: 'Consultores Pro',
            precio: 300.00,
            estado: 'Enviado',
            tracking: 'TRK123456789'
        }
    ];
    
    ventasEjemplo.forEach(venta => HISTORIAL_VENTAS.agregarVenta(venta));
    comprasEjemplo.forEach(compra => HISTORIAL_COMPRAS.agregarCompra(compra));
    
    console.log('📊 Datos de ejemplo agregados');
}

// Hacer función de ejemplo global
window.agregarDatosEjemplo = agregarDatosEjemplo;

console.log('📊 Sistema de historiales cargado correctamente');
