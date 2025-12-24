// ===== SISTEMA DE MÉTRICAS AVANZADAS PARA COMPRADORES =====
// Categorías más compradas, gastadas y vistas

const SistemaMetricasComprador = {
    
    /**
     * Obtener métricas del comprador
     */
    async obtenerMetricas() {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                return null;
            }
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return null;
            }
            
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) {
                return null;
            }
            
            // Llamar a función SQL
            const { data, error } = await supabase.rpc('obtener_metricas_comprador', {
                p_comprador_id: comprador.id
            });
            
            if (error) {
                console.error('Error obteniendo métricas:', error);
                return null;
            }
            
            if (!data || data.length === 0) {
                return this.getMetricasVacio();
            }
            
            return data[0];
            
        } catch (error) {
            console.error('Error en obtenerMetricas:', error);
            return null;
        }
    },
    
    /**
     * Registrar vista de categoría
     */
    async registrarVistaCategoria(categoria, tipo = 'producto') {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return;
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) return;
            
            // Llamar a función SQL
            await supabase.rpc('registrar_vista_categoria', {
                p_comprador_id: comprador.id,
                p_categoria: categoria,
                p_tipo: tipo
            });
            
        } catch (error) {
            console.error('Error registrando vista de categoría:', error);
        }
    },
    
    /**
     * Obtener métricas vacías (default)
     */
    getMetricasVacio() {
        return {
            total_compras: 0,
            total_gastado: 0,
            promedio_compra: 0,
            total_productos_comprados: 0,
            total_servicios_contratados: 0,
            categorias_mas_compradas: [],
            categorias_mas_gastadas: [],
            categorias_mas_vistas: [],
            ultima_compra: null
        };
    },
    
    /**
     * Mostrar panel de métricas
     */
    async mostrarPanelMetricas(containerId) {
        try {
            const metricas = await this.obtenerMetricas();
            const container = document.getElementById(containerId);
            if (!container) return;
            
            if (!metricas) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #6B7280;">
                        <i class="fas fa-chart-line" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                        <p style="margin: 0;">No hay métricas disponibles aún</p>
                    </div>
                `;
                return;
            }
            
            const html = `
                <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 20px 0; color: #1F2937; font-size: 24px;">
                        <i class="fas fa-chart-bar"></i> Mis Métricas
                    </h3>
                    
                    <!-- Métricas Generales -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px;">
                            <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">${metricas.total_compras}</div>
                            <div style="font-size: 14px; opacity: 0.9;">Total Compras</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 20px; border-radius: 12px;">
                            <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">$${metricas.total_gastado.toLocaleString('es-AR', {minimumFractionDigits: 2})}</div>
                            <div style="font-size: 14px; opacity: 0.9;">Total Gastado</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 20px; border-radius: 12px;">
                            <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">$${metricas.promedio_compra.toLocaleString('es-AR', {minimumFractionDigits: 2})}</div>
                            <div style="font-size: 14px; opacity: 0.9;">Promedio por Compra</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #43e97b, #38f9d7); color: white; padding: 20px; border-radius: 12px;">
                            <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">${metricas.total_productos_comprados + metricas.total_servicios_contratados}</div>
                            <div style="font-size: 14px; opacity: 0.9;">Items Comprados</div>
                        </div>
                    </div>
                    
                    <!-- Categorías Más Compradas -->
                    ${this.renderizarCategorias(
                        'Categorías Más Compradas',
                        'fas fa-shopping-bag',
                        metricas.categorias_mas_compradas || [],
                        'cantidad',
                        '#667eea'
                    )}
                    
                    <!-- Categorías Más Gastadas -->
                    ${this.renderizarCategorias(
                        'Categorías Más Gastadas',
                        'fas fa-dollar-sign',
                        metricas.categorias_mas_gastadas || [],
                        'monto',
                        '#f5576c'
                    )}
                    
                    <!-- Categorías Más Vistas -->
                    ${this.renderizarCategorias(
                        'Categorías Más Vistas',
                        'fas fa-eye',
                        metricas.categorias_mas_vistas || [],
                        'vistas',
                        '#4facfe'
                    )}
                </div>
            `;
            
            container.innerHTML = html;
            
        } catch (error) {
            console.error('Error mostrando panel de métricas:', error);
        }
    },
    
    /**
     * Renderizar lista de categorías
     */
    renderizarCategorias(titulo, icono, categorias, tipoMetrica, color) {
        if (!categorias || categorias.length === 0) {
            return `
                <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid ${color};">
                    <h4 style="margin: 0 0 10px 0; color: #1F2937; display: flex; align-items: center; gap: 10px;">
                        <i class="${icono}" style="color: ${color};"></i> ${titulo}
                    </h4>
                    <p style="margin: 0; color: #6B7280; font-size: 14px;">Aún no hay datos disponibles</p>
                </div>
            `;
        }
        
        const items = categorias.map((cat, index) => {
            let valor = '';
            let unidad = '';
            
            if (tipoMetrica === 'cantidad') {
                valor = cat.cantidad || 0;
                unidad = 'compras';
            } else if (tipoMetrica === 'monto') {
                valor = `$${parseFloat(cat.monto || 0).toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
                unidad = '';
            } else if (tipoMetrica === 'vistas') {
                valor = cat.vistas || 0;
                unidad = 'vistas';
            }
            
            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: ${index % 2 === 0 ? '#FFFFFF' : '#F8FAFC'}; border-radius: 8px; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                        <div style="width: 40px; height: 40px; background: ${color}20; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: ${color}; font-weight: 700;">
                            ${index + 1}
                        </div>
                        <div>
                            <div style="font-weight: 600; color: #1F2937; margin-bottom: 2px;">${cat.categoria || 'Sin categoría'}</div>
                            <div style="font-size: 12px; color: #6B7280;">${cat.tipo || 'producto'}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 700; color: ${color}; font-size: 18px;">${valor}</div>
                        ${unidad ? `<div style="font-size: 11px; color: #9CA3AF;">${unidad}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid ${color};">
                <h4 style="margin: 0 0 15px 0; color: #1F2937; display: flex; align-items: center; gap: 10px;">
                    <i class="${icono}" style="color: ${color};"></i> ${titulo}
                </h4>
                <div>
                    ${items}
                </div>
            </div>
        `;
    },
    
    /**
     * Forzar actualización de métricas
     */
    async actualizarMetricas() {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return;
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) return;
            
            // Llamar a función SQL para actualizar
            const { error } = await supabase.rpc('actualizar_metricas_comprador', {
                p_comprador_id: comprador.id
            });
            
            if (error) {
                console.error('Error actualizando métricas:', error);
            } else {
                console.log('✅ Métricas actualizadas correctamente');
            }
            
        } catch (error) {
            console.error('Error en actualizarMetricas:', error);
        }
    }
};

// Hacer disponible globalmente
window.SistemaMetricasComprador = SistemaMetricasComprador;

// Auto-registrar vistas de categorías cuando se navega
document.addEventListener('DOMContentLoaded', () => {
    // Detectar cuando se ve una categoría en la URL o en la página
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria') || 
                     document.querySelector('[data-categoria]')?.getAttribute('data-categoria');
    
    if (categoria && window.SistemaMetricasComprador) {
        window.SistemaMetricasComprador.registrarVistaCategoria(categoria, 'producto');
    }
});
