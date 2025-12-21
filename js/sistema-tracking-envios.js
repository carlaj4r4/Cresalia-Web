// ===== SISTEMA DE TRACKING DE ENVÍOS =====
// Para que los compradores puedan ver el estado de sus pedidos

const SistemaTrackingEnvios = {
    
    /**
     * Cargar historial de pedidos del comprador
     */
    async cargarMisPedidos() {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                console.error('❌ Supabase no disponible');
                return [];
            }
            
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                return [];
            }
            
            // Obtener comprador_id
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) {
                return [];
            }
            
            // Cargar pedidos desde tabla compras (más completa)
            const { data: compras, error } = await supabase
                .from('compras')
                .select('*')
                .eq('comprador_id', comprador.id)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error cargando compras:', error);
                return [];
            }
            
            return compras || [];
            
        } catch (error) {
            console.error('Error en cargarMisPedidos:', error);
            return [];
        }
    },
    
    /**
     * Mostrar modal de tracking para un pedido
     */
    async mostrarTrackingPedido(pedidoId, numeroOrden) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return;
            
            // Cargar datos del pedido
            const { data: pedido, error } = await supabase
                .from('compras')
                .select('*')
                .eq('id', pedidoId)
                .single();
            
            if (error || !pedido) {
                alert('❌ Error al cargar el pedido');
                return;
            }
            
            // Mapear estado a icono y color
            const estadosInfo = this.obtenerInfoEstado(pedido.estado);
            
            // Construir HTML del modal
            const modalHTML = `
                <div id="modal-tracking-envio" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">
                    <div style="background: white; border-radius: 20px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 25px; border-radius: 20px 20px 0 0;">
                            <button onclick="document.getElementById('modal-tracking-envio').remove()" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); border: none; color: white; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-size: 18px;">
                                <i class="fas fa-times"></i>
                            </button>
                            <h2 style="margin: 0 0 10px 0; font-size: 24px;">
                                <i class="fas fa-shipping-fast"></i> Seguimiento de Pedido
                            </h2>
                            <p style="margin: 0; opacity: 0.9; font-size: 16px;">Orden: ${numeroOrden || pedido.numero_orden}</p>
                        </div>
                        
                        <!-- Contenido -->
                        <div style="padding: 30px;">
                            <!-- Estado Actual -->
                            <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: ${estadosInfo.colorFondo}; border-radius: 15px;">
                                <div style="font-size: 48px; margin-bottom: 10px;">${estadosInfo.icono}</div>
                                <h3 style="margin: 0 0 5px 0; color: ${estadosInfo.colorTexto};">${estadosInfo.estado}</h3>
                                <p style="margin: 0; color: ${estadosInfo.colorTexto}; opacity: 0.8; font-size: 14px;">${estadosInfo.descripcion}</p>
                            </div>
                            
                            <!-- Información de Envío -->
                            ${pedido.numero_seguimiento ? `
                                <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 15px 0; color: #1F2937;">
                                        <i class="fas fa-barcode"></i> Información de Envío
                                    </h4>
                                    <div style="display: grid; gap: 10px;">
                                        <div>
                                            <strong style="color: #4B5563;">Número de Seguimiento:</strong>
                                            <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 18px; color: #1F2937;">${pedido.numero_seguimiento}</p>
                                        </div>
                                        ${pedido.empresa_envio ? `
                                            <div>
                                                <strong style="color: #4B5563;">Empresa de Envío:</strong>
                                                <p style="margin: 5px 0 0 0; color: #1F2937;">${pedido.empresa_envio}</p>
                                            </div>
                                        ` : ''}
                                        ${pedido.tracking_url ? `
                                            <div>
                                                <a href="${pedido.tracking_url}" target="_blank" style="display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; margin-top: 10px;">
                                                    <i class="fas fa-external-link-alt"></i> Rastrear en sitio de envío
                                                </a>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <!-- Historial de Tracking -->
                            ${pedido.historial_tracking && pedido.historial_tracking.length > 0 ? `
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 20px 0; color: #1F2937;">
                                        <i class="fas fa-history"></i> Historial
                                    </h4>
                                    <div style="position: relative; padding-left: 30px;">
                                        ${this.generarHistorialHTML(pedido.historial_tracking)}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <!-- Fechas Importantes -->
                            <div style="background: #F0F9FF; padding: 20px; border-radius: 12px; border-left: 4px solid #3B82F6;">
                                <h4 style="margin: 0 0 15px 0; color: #1E40AF;">
                                    <i class="fas fa-calendar"></i> Fechas
                                </h4>
                                <div style="display: grid; gap: 10px;">
                                    <div>
                                        <strong style="color: #1E3A8A;">Fecha del Pedido:</strong>
                                        <p style="margin: 5px 0 0 0; color: #1E40AF;">${new Date(pedido.created_at).toLocaleString('es-AR')}</p>
                                    </div>
                                    ${pedido.fecha_estimada_entrega ? `
                                        <div>
                                            <strong style="color: #1E3A8A;">Fecha Estimada de Entrega:</strong>
                                            <p style="margin: 5px 0 0 0; color: #1E40AF;">${new Date(pedido.fecha_estimada_entrega).toLocaleDateString('es-AR')}</p>
                                        </div>
                                    ` : ''}
                                    ${pedido.fecha_real_entrega ? `
                                        <div>
                                            <strong style="color: #1E3A8A;">Fecha de Entrega:</strong>
                                            <p style="margin: 5px 0 0 0; color: #10B981;">${new Date(pedido.fecha_real_entrega).toLocaleString('es-AR')}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <!-- Dirección de Entrega -->
                            ${pedido.direccion_envio ? `
                                <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; margin-top: 20px;">
                                    <h4 style="margin: 0 0 15px 0; color: #1F2937;">
                                        <i class="fas fa-map-marker-alt"></i> Dirección de Entrega
                                    </h4>
                                    <p style="margin: 0; color: #4B5563; line-height: 1.6;">
                                        ${this.formatearDireccion(pedido.direccion_envio)}
                                    </p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            // Agregar al DOM
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
        } catch (error) {
            console.error('Error en mostrarTrackingPedido:', error);
            alert('❌ Error al mostrar el seguimiento');
        }
    },
    
    /**
     * Obtener información del estado (icono, color, descripción)
     */
    obtenerInfoEstado(estado) {
        const estados = {
            'pendiente': {
                estado: 'Pendiente de Pago',
                icono: '⏳',
                colorFondo: '#FEF3C7',
                colorTexto: '#92400E',
                descripcion: 'Esperando confirmación de pago'
            },
            'confirmada': {
                estado: 'Confirmado',
                icono: '✅',
                colorFondo: '#D1FAE5',
                colorTexto: '#065F46',
                descripcion: 'Pago confirmado, preparando tu pedido'
            },
            'preparando': {
                estado: 'Preparando',
                icono: '📦',
                colorFondo: '#DBEAFE',
                colorTexto: '#1E40AF',
                descripcion: 'Tu pedido está siendo preparado'
            },
            'enviada': {
                estado: 'En Camino',
                icono: '🚚',
                colorFondo: '#E0E7FF',
                colorTexto: '#3730A3',
                descripcion: 'Tu pedido está en camino'
            },
            'en_transito': {
                estado: 'En Tránsito',
                icono: '🚛',
                colorFondo: '#E0E7FF',
                colorTexto: '#3730A3',
                descripcion: 'En transporte hacia tu ciudad'
            },
            'entregada': {
                estado: 'Entregado',
                icono: '🎉',
                colorFondo: '#D1FAE5',
                colorTexto: '#065F46',
                descripcion: '¡Tu pedido ha sido entregado!'
            },
            'cancelada': {
                estado: 'Cancelado',
                icono: '❌',
                colorFondo: '#FEE2E2',
                colorTexto: '#991B1B',
                descripcion: 'Este pedido fue cancelado'
            }
        };
        
        return estados[estado] || {
            estado: estado || 'Desconocido',
            icono: '❓',
            colorFondo: '#F3F4F6',
            colorTexto: '#374151',
            descripcion: 'Estado del pedido'
        };
    },
    
    /**
     * Generar HTML del historial de tracking
     */
    generarHistorialHTML(historial) {
        if (!historial || !Array.isArray(historial)) return '';
        
        // Ordenar por fecha (más reciente primero)
        const historialOrdenado = [...historial].reverse();
        
        return historialOrdenado.map((item, index) => {
            const estadoInfo = this.obtenerInfoEstado(item.estado);
            return `
                <div style="position: relative; padding-bottom: 30px; padding-left: 40px;">
                    ${index < historialOrdenado.length - 1 ? `
                        <div style="position: absolute; left: 8px; top: 30px; bottom: -10px; width: 2px; background: #E5E7EB;"></div>
                    ` : ''}
                    <div style="position: absolute; left: 0; top: 5px; width: 18px; height: 18px; border-radius: 50%; background: ${estadoInfo.colorFondo}; border: 3px solid ${estadoInfo.colorTexto};"></div>
                    <div>
                        <strong style="color: #1F2937; font-size: 16px;">${estadoInfo.estado}</strong>
                        ${item.mensaje ? `<p style="margin: 5px 0; color: #6B7280; font-size: 14px;">${item.mensaje}</p>` : ''}
                        ${item.ubicacion ? `<p style="margin: 5px 0; color: #9CA3AF; font-size: 13px;"><i class="fas fa-map-marker-alt"></i> ${item.ubicacion}</p>` : ''}
                        <p style="margin: 5px 0 0 0; color: #9CA3AF; font-size: 12px;">${new Date(item.fecha).toLocaleString('es-AR')}</p>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    /**
     * Formatear dirección JSONB a texto
     */
    formatearDireccion(direccion) {
        if (typeof direccion === 'string') {
            try {
                direccion = JSON.parse(direccion);
            } catch (e) {
                return direccion;
            }
        }
        
        if (typeof direccion === 'object' && direccion !== null) {
            const partes = [];
            if (direccion.calle) partes.push(direccion.calle);
            if (direccion.ciudad) partes.push(direccion.ciudad);
            if (direccion.provincia) partes.push(direccion.provincia);
            if (direccion.codigo_postal) partes.push(`CP: ${direccion.codigo_postal}`);
            
            return partes.join(', ') || 'Dirección no disponible';
        }
        
        return 'Dirección no disponible';
    }
};

// Hacer disponible globalmente
window.SistemaTrackingEnvios = SistemaTrackingEnvios;
