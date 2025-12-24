// ===== SISTEMA DE NOTIFICACIONES DE STOCK =====
// Notifica cuando productos agotados vuelven a tener stock

const SistemaNotificacionesStock = {
    
    /**
     * Registrar alerta de stock para un producto
     */
    async registrarAlertaStock(productoId, tiendaId, stockActual = 0) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                return { exito: false, mensaje: 'Error de conexión' };
            }
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { exito: false, mensaje: 'Usuario no autenticado' };
            }
            
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) {
                return { exito: false, mensaje: 'Comprador no encontrado' };
            }
            
            // Llamar a función SQL
            const { data, error } = await supabase.rpc('registrar_alerta_stock', {
                p_comprador_id: comprador.id,
                p_producto_id: productoId,
                p_tienda_id: tiendaId,
                p_stock_actual: stockActual
            });
            
            if (error) {
                console.error('Error registrando alerta:', error);
                return { exito: false, mensaje: error.message };
            }
            
            if (!data || data.length === 0) {
                return { exito: false, mensaje: 'Error al procesar' };
            }
            
            const resultado = data[0];
            
            if (!resultado.exito) {
                return { exito: false, mensaje: resultado.mensaje };
            }
            
            return {
                exito: true,
                mensaje: resultado.mensaje,
                alerta_id: resultado.alerta_id
            };
            
        } catch (error) {
            console.error('Error en registrarAlertaStock:', error);
            return { exito: false, mensaje: 'Error inesperado' };
        }
    },
    
    /**
     * Obtener alertas activas del comprador
     */
    async obtenerMisAlertas() {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return [];
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];
            
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) return [];
            
            // Llamar a función SQL
            const { data, error } = await supabase.rpc('obtener_alertas_stock_comprador', {
                p_comprador_id: comprador.id
            });
            
            if (error) {
                console.error('Error obteniendo alertas:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('Error en obtenerMisAlertas:', error);
            return [];
        }
    },
    
    /**
     * Cancelar alerta de stock
     */
    async cancelarAlerta(productoId, tiendaId) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                return { exito: false, mensaje: 'Error de conexión' };
            }
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { exito: false, mensaje: 'Usuario no autenticado' };
            }
            
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) {
                return { exito: false, mensaje: 'Comprador no encontrado' };
            }
            
            // Llamar a función SQL
            const { data, error } = await supabase.rpc('cancelar_alerta_stock', {
                p_comprador_id: comprador.id,
                p_producto_id: productoId,
                p_tienda_id: tiendaId
            });
            
            if (error) {
                console.error('Error cancelando alerta:', error);
                return { exito: false, mensaje: error.message };
            }
            
            return { exito: true, mensaje: 'Alerta cancelada correctamente' };
            
        } catch (error) {
            console.error('Error en cancelarAlerta:', error);
            return { exito: false, mensaje: 'Error inesperado' };
        }
    },
    
    /**
     * Verificar si un producto tiene alerta activa
     */
    async tieneAlertaActiva(productoId, tiendaId) {
        try {
            const alertas = await this.obtenerMisAlertas();
            return alertas.some(a => a.producto_id === productoId && a.tienda_id === tiendaId);
        } catch (error) {
            console.error('Error verificando alerta:', error);
            return false;
        }
    },
    
    /**
     * Mostrar botón de alerta en producto
     */
    async renderizarBotonAlerta(productoId, tiendaId, stockActual, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const tieneAlerta = await this.tieneAlertaActiva(productoId, tiendaId);
        const sinStock = stockActual === 0 || stockActual === null;
        
        if (!sinStock && !tieneAlerta) {
            // No mostrar si tiene stock y no tiene alerta
            container.innerHTML = '';
            return;
        }
        
        if (tieneAlerta) {
            // Botón para cancelar alerta
            container.innerHTML = `
                <button onclick="SistemaNotificacionesStock.cancelarAlertaUI(${productoId}, '${tiendaId}')" 
                        style="background: #10B981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 10px; transition: all 0.2s;"
                        onmouseover="this.style.background='#059669'"
                        onmouseout="this.style.background='#10B981'">
                    <i class="fas fa-bell-slash"></i> Cancelar Alerta de Stock
                </button>
            `;
        } else if (sinStock) {
            // Botón para activar alerta
            container.innerHTML = `
                <button onclick="SistemaNotificacionesStock.activarAlertaUI(${productoId}, '${tiendaId}', ${stockActual})" 
                        style="background: #F59E0B; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; margin-top: 10px; transition: all 0.2s;"
                        onmouseover="this.style.background='#D97706'"
                        onmouseout="this.style.background='#F59E0B'">
                    <i class="fas fa-bell"></i> Avisame cuando haya stock
                </button>
            `;
        }
    },
    
    /**
     * Activar alerta (UI)
     */
    async activarAlertaUI(productoId, tiendaId, stockActual) {
        const resultado = await this.registrarAlertaStock(productoId, tiendaId, stockActual);
        
        if (resultado.exito) {
            // Mostrar notificación
            if (window.elegantNotifications) {
                window.elegantNotifications.show('✅ ' + resultado.mensaje, 'success');
            } else {
                alert('✅ ' + resultado.mensaje);
            }
            
            // Actualizar botón
            const container = document.getElementById(`alerta-stock-${productoId}`);
            if (container) {
                await this.renderizarBotonAlerta(productoId, tiendaId, stockActual, `alerta-stock-${productoId}`);
            }
        } else {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('❌ ' + resultado.mensaje, 'error');
            } else {
                alert('❌ ' + resultado.mensaje);
            }
        }
    },
    
    /**
     * Cancelar alerta (UI)
     */
    async cancelarAlertaUI(productoId, tiendaId) {
        if (!confirm('¿Estás seguro de que querés cancelar la alerta de stock?')) {
            return;
        }
        
        const resultado = await this.cancelarAlerta(productoId, tiendaId);
        
        if (resultado.exito) {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('✅ ' + resultado.mensaje, 'success');
            } else {
                alert('✅ ' + resultado.mensaje);
            }
            
            // Actualizar botón
            const container = document.getElementById(`alerta-stock-${productoId}`);
            if (container) {
                await this.renderizarBotonAlerta(productoId, tiendaId, 0, `alerta-stock-${productoId}`);
            }
        } else {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('❌ ' + resultado.mensaje, 'error');
            } else {
                alert('❌ ' + resultado.mensaje);
            }
        }
    },
    
    /**
     * Verificar y enviar notificaciones (se llama desde el backend cuando cambia el stock)
     */
    async verificarYNotificar(productoId, tiendaId, stockNuevo) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return;
            
            // Llamar a función SQL que verifica cambios
            const { data, error } = await supabase.rpc('verificar_cambios_stock', {
                p_producto_id: productoId,
                p_tienda_id: tiendaId,
                p_stock_nuevo: stockNuevo
            });
            
            if (error) {
                console.error('Error verificando stock:', error);
                return;
            }
            
            // Si hay alertas activadas, enviar notificaciones push
            if (data && data > 0) {
                await this.enviarNotificacionesPush(productoId, tiendaId);
            }
            
        } catch (error) {
            console.error('Error en verificarYNotificar:', error);
        }
    },
    
    /**
     * Enviar notificaciones push cuando hay stock
     */
    async enviarNotificacionesPush(productoId, tiendaId) {
        try {
            // Obtener información del producto
            const supabase = await esperarInitSupabase();
            if (!supabase) return;
            
            const { data: producto } = await supabase
                .from('productos')
                .select('nombre, imagen_url, imagen_principal')
                .eq('id', productoId)
                .eq('tienda_id', tiendaId)
                .single();
            
            if (!producto) return;
            
            // Verificar permisos de notificación
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('📦 ¡Producto disponible!', {
                    body: `${producto.nombre} ya está disponible nuevamente`,
                    icon: producto.imagen_url || producto.imagen_principal || '/assets/logo/logo-cresalia.png',
                    badge: '/assets/logo/logo-cresalia.png',
                    tag: `stock-${productoId}`,
                    requireInteraction: false
                });
            }
            
            // También mostrar notificación en la página si está abierta
            if (window.elegantNotifications) {
                window.elegantNotifications.show(
                    `📦 ¡${producto.nombre} ya está disponible!`,
                    'success',
                    5000
                );
            }
            
        } catch (error) {
            console.error('Error enviando notificación push:', error);
        }
    },
    
    /**
     * Mostrar panel de alertas activas
     */
    async mostrarPanelAlertas(containerId) {
        try {
            const alertas = await this.obtenerMisAlertas();
            const container = document.getElementById(containerId);
            if (!container) return;
            
            if (alertas.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #6B7280;">
                        <i class="fas fa-bell-slash" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                        <p style="margin: 0;">No tenés alertas de stock activas</p>
                    </div>
                `;
                return;
            }
            
            const html = `
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 20px 0; color: #1F2937;">
                        <i class="fas fa-bell"></i> Mis Alertas de Stock (${alertas.length})
                    </h3>
                    <div style="display: grid; gap: 15px;">
                        ${alertas.map(alerta => `
                            <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; border-left: 4px solid #F59E0B; display: flex; gap: 15px; align-items: center;">
                                ${alerta.producto_imagen ? `
                                    <img src="${alerta.producto_imagen}" alt="${alerta.producto_nombre}" 
                                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                                ` : `
                                    <div style="width: 60px; height: 60px; background: #E5E7EB; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-box" style="font-size: 24px; color: #9CA3AF;"></i>
                                    </div>
                                `}
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 5px 0; color: #1F2937; font-size: 16px;">
                                        ${alerta.producto_nombre}
                                    </h4>
                                    <p style="margin: 0; color: #6B7280; font-size: 13px;">
                                        Registrado: ${new Date(alerta.fecha_registro).toLocaleDateString('es-AR')}
                                    </p>
                                </div>
                                <button onclick="SistemaNotificacionesStock.cancelarAlertaUI(${alerta.producto_id}, '${alerta.tienda_id}')" 
                                        style="background: #EF4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; white-space: nowrap;">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
            
        } catch (error) {
            console.error('Error mostrando panel de alertas:', error);
        }
    }
};

// Hacer disponible globalmente
window.SistemaNotificacionesStock = SistemaNotificacionesStock;
