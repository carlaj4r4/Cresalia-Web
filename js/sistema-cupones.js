// ===== SISTEMA DE CUPONES Y DESCUENTOS =====
// Para validar y aplicar cupones en el checkout

const SistemaCupones = {
    
    /**
     * Validar un cupón
     */
    async validarCupon(codigoCupon, montoTotal = 0, productosIds = []) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                return { valido: false, mensaje: 'Error de conexión' };
            }
            
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || null;
            
            // Obtener comprador_id si existe
            let compradorId = null;
            if (user) {
                const { data: comprador } = await supabase
                    .from('compradores')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();
                compradorId = comprador?.id || null;
            }
            
            // Llamar a la función de validación en Supabase
            const { data, error } = await supabase.rpc('validar_cupon', {
                p_codigo: codigoCupon.toUpperCase().trim(),
                p_user_id: userId,
                p_comprador_id: compradorId,
                p_monto_total: montoTotal,
                p_productos_ids: productosIds
            });
            
            if (error) {
                console.error('Error validando cupón:', error);
                return { valido: false, mensaje: 'Error al validar el cupón' };
            }
            
            if (!data || data.length === 0) {
                return { valido: false, mensaje: 'Cupón no encontrado' };
            }
            
            const resultado = data[0];
            
            if (!resultado.valido) {
                return { valido: false, mensaje: resultado.mensaje };
            }
            
            // Calcular descuento
            const cupon = resultado.cupon_record;
            let descuento = 0;
            
            if (cupon.tipo_descuento === 'porcentaje') {
                descuento = (montoTotal * cupon.valor_descuento) / 100;
                if (cupon.monto_maximo_descuento && descuento > cupon.monto_maximo_descuento) {
                    descuento = cupon.monto_maximo_descuento;
                }
            } else {
                descuento = Math.min(cupon.valor_descuento, montoTotal);
            }
            
            return {
                valido: true,
                mensaje: resultado.mensaje,
                descuento: parseFloat(descuento.toFixed(2)),
                cupon: cupon
            };
            
        } catch (error) {
            console.error('Error en validarCupon:', error);
            return { valido: false, mensaje: 'Error inesperado al validar el cupón' };
        }
    },
    
    /**
     * Aplicar cupón a un pedido (registrar uso)
     */
    async aplicarCuponAPedido(cuponId, compradorId, pedidoId, tablaPedido, montoDescuento, montoTotalPedido) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return false;
            
            const { data: { user } } = await supabase.auth.getUser();
            const userId = user?.id || null;
            
            // Registrar uso del cupón
            const { error: errorUso } = await supabase
                .from('cupon_usos')
                .insert([{
                    cupon_id: cuponId,
                    comprador_id: compradorId,
                    user_id: userId,
                    pedido_id: pedidoId,
                    tabla_pedido: tablaPedido,
                    monto_descuento: montoDescuento,
                    monto_total_pedido: montoTotalPedido
                }]);
            
            if (errorUso) {
                console.error('Error registrando uso:', errorUso);
                return false;
            }
            
            // Incrementar contador de usos
            const { error: errorUpdate } = await supabase.rpc('incrementar_uso_cupon', {
                p_cupon_id: cuponId
            });
            
            if (errorUpdate) {
                console.warn('No se pudo incrementar contador:', errorUpdate);
                // No es crítico, continuar
            }
            
            return true;
            
        } catch (error) {
            console.error('Error en aplicarCuponAPedido:', error);
            return false;
        }
    },
    
    /**
     * Mostrar campo de cupón en checkout
     */
    mostrarCampoCupon(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const campoCuponHTML = `
            <div id="campo-cupon-container" style="background: #F0F9FF; border: 2px dashed #3B82F6; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <h4 style="margin: 0 0 15px 0; color: #1E40AF;">
                    <i class="fas fa-ticket-alt"></i> ¿Tenés un cupón de descuento?
                </h4>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" id="codigo-cupon-input" placeholder="Ingresá el código del cupón" style="flex: 1; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                    <button onclick="SistemaCupones.aplicarCupon()" id="btn-aplicar-cupon" style="background: #3B82F6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; white-space: nowrap;">
                        Aplicar
                    </button>
                </div>
                <div id="mensaje-cupon" style="margin-top: 10px;"></div>
                <div id="cupon-aplicado" style="display: none; margin-top: 15px; padding: 15px; background: #D1FAE5; border-radius: 8px; border-left: 4px solid #10B981;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="color: #065F46;">✅ Cupón aplicado: <span id="codigo-cupon-aplicado"></span></strong>
                            <p style="margin: 5px 0 0 0; color: #047857;">Descuento: <span id="descuento-cupon">$0</span></p>
                        </div>
                        <button onclick="SistemaCupones.removerCupon()" style="background: #EF4444; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-times"></i> Remover
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', campoCuponHTML);
    },
    
    /**
     * Aplicar cupón (desde el input)
     */
    async aplicarCupon() {
        const codigoInput = document.getElementById('codigo-cupon-input');
        const mensajeDiv = document.getElementById('mensaje-cupon');
        const btnAplicar = document.getElementById('btn-aplicar-cupon');
        
        if (!codigoInput || !mensajeDiv) return;
        
        const codigo = codigoInput.value.trim();
        if (!codigo) {
            mensajeDiv.innerHTML = '<p style="color: #EF4444; margin: 0;">Por favor, ingresá un código de cupón</p>';
            return;
        }
        
        // Obtener monto total del carrito
        const montoTotal = this.obtenerMontoTotalCarrito();
        
        btnAplicar.disabled = true;
        btnAplicar.textContent = 'Validando...';
        mensajeDiv.innerHTML = '';
        
        const resultado = await this.validarCupon(codigo, montoTotal);
        
        btnAplicar.disabled = false;
        btnAplicar.textContent = 'Aplicar';
        
        if (!resultado.valido) {
            mensajeDiv.innerHTML = `<p style="color: #EF4444; margin: 0;">❌ ${resultado.mensaje}</p>`;
            return;
        }
        
        // Cupón válido - mostrar información
        document.getElementById('codigo-cupon-aplicado').textContent = codigo.toUpperCase();
        document.getElementById('descuento-cupon').textContent = `$${resultado.descuento.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
        document.getElementById('cupon-aplicado').style.display = 'block';
        codigoInput.disabled = true;
        btnAplicar.disabled = true;
        
        // Guardar cupón aplicado en variable global
        window.cuponAplicado = {
            codigo: codigo.toUpperCase(),
            descuento: resultado.descuento,
            cupon: resultado.cupon
        };
        
        // Llamar a función de actualización de totales si existe
        if (typeof actualizarTotalesConCupon === 'function') {
            actualizarTotalesConCupon(resultado.descuento);
        }
        
        mensajeDiv.innerHTML = `<p style="color: #10B981; margin: 0;">✅ ${resultado.mensaje}</p>`;
    },
    
    /**
     * Remover cupón aplicado
     */
    removerCupon() {
        document.getElementById('cupon-aplicado').style.display = 'none';
        document.getElementById('codigo-cupon-input').value = '';
        document.getElementById('codigo-cupon-input').disabled = false;
        document.getElementById('btn-aplicar-cupon').disabled = false;
        document.getElementById('mensaje-cupon').innerHTML = '';
        
        window.cuponAplicado = null;
        
        // Actualizar totales
        if (typeof actualizarTotalesConCupon === 'function') {
            actualizarTotalesConCupon(0);
        }
    },
    
    /**
     * Obtener monto total del carrito
     */
    obtenerMontoTotalCarrito() {
        // Intentar obtener del carrito global
        if (typeof carrito !== 'undefined' && Array.isArray(carrito)) {
            return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        }
        
        // Intentar obtener de elemento en DOM
        const totalContainer = document.querySelector('.producto-resumen-total');
        if (totalContainer && totalContainer.dataset.originalTotal) {
            return parseFloat(totalContainer.dataset.originalTotal) || 0;
        }
        
        const totalElement = document.getElementById('precioTotalModal');
        if (totalElement) {
            const texto = totalElement.textContent.replace(/[^0-9,.-]/g, '');
            return parseFloat(texto.replace(',', '.')) || 0;
        }
        
        return 0;
    }
};

// Hacer disponible globalmente
window.SistemaCupones = SistemaCupones;
