// ===== SISTEMA DE PUNTOS Y RECOMPENSAS =====
// Programa de fidelización para compradores

const SistemaPuntosComprador = {
    
    /**
     * Obtener puntos del comprador actual
     */
    async obtenerMisPuntos() {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                return { error: 'Supabase no disponible' };
            }
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                return { error: 'Usuario no autenticado' };
            }
            
            // Obtener comprador_id
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) {
                return { error: 'Comprador no encontrado' };
            }
            
            // Obtener puntos usando función SQL
            const { data, error } = await supabase.rpc('obtener_puntos_comprador', {
                p_comprador_id: comprador.id
            });
            
            if (error) {
                console.error('Error obteniendo puntos:', error);
                return { error: error.message };
            }
            
            if (!data || data.length === 0) {
                // Crear registro inicial
                return {
                    puntos_totales: 0,
                    puntos_disponibles: 0,
                    puntos_canjeados: 0,
                    nivel: 'Bronce',
                    proximo_nivel: 'Plata',
                    puntos_para_proximo_nivel: 1000
                };
            }
            
            return data[0];
            
        } catch (error) {
            console.error('Error en obtenerMisPuntos:', error);
            return { error: 'Error inesperado' };
        }
    },
    
    /**
     * Obtener historial de puntos
     */
    async obtenerHistorialPuntos(limite = 20) {
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
            
            const { data: historial, error } = await supabase
                .from('puntos_historial')
                .select('*')
                .eq('comprador_id', comprador.id)
                .order('created_at', { ascending: false })
                .limit(limite);
            
            if (error) {
                console.error('Error obteniendo historial:', error);
                return [];
            }
            
            return historial || [];
            
        } catch (error) {
            console.error('Error en obtenerHistorialPuntos:', error);
            return [];
        }
    },
    
    /**
     * Canjear puntos por descuento
     */
    async canjearPuntos(puntosACanjear) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                return { exito: false, mensaje: 'Error de conexión' };
            }
            
            // Validar mínimo
            if (puntosACanjear < 100) {
                return { exito: false, mensaje: 'Mínimo 100 puntos para canjear' };
            }
            
            // Validar que sea múltiplo de 100
            if (puntosACanjear % 100 !== 0) {
                return { exito: false, mensaje: 'Debe ser múltiplo de 100 puntos' };
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
            
            // Llamar a función de canje
            const { data, error } = await supabase.rpc('canjear_puntos_descuento', {
                p_comprador_id: comprador.id,
                p_puntos_a_canjear: puntosACanjear
            });
            
            if (error) {
                console.error('Error canjeando puntos:', error);
                return { exito: false, mensaje: error.message };
            }
            
            if (!data || data.length === 0) {
                return { exito: false, mensaje: 'Error al procesar canje' };
            }
            
            const resultado = data[0];
            
            if (!resultado.exito) {
                return { exito: false, mensaje: resultado.mensaje };
            }
            
            return {
                exito: true,
                mensaje: resultado.mensaje,
                codigo_canje: resultado.codigo_canje,
                descuento: parseFloat(resultado.descuento)
            };
            
        } catch (error) {
            console.error('Error en canjearPuntos:', error);
            return { exito: false, mensaje: 'Error inesperado' };
        }
    },
    
    /**
     * Agregar puntos automáticamente después de una compra
     * (Se llama desde el webhook o después de confirmar pago)
     */
    async agregarPuntosPorCompra(compraId, montoCompra, tablaCompra = 'compras') {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return false;
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;
            
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) return false;
            
            // Llamar a función SQL
            const { data, error } = await supabase.rpc('agregar_puntos_compra', {
                p_comprador_id: comprador.id,
                p_monto_compra: montoCompra,
                p_compra_id: compraId,
                p_tabla_compra: tablaCompra
            });
            
            if (error) {
                console.error('Error agregando puntos:', error);
                return false;
            }
            
            return true;
            
        } catch (error) {
            console.error('Error en agregarPuntosPorCompra:', error);
            return false;
        }
    },
    
    /**
     * Mostrar panel de puntos
     */
    async mostrarPanelPuntos(containerId) {
        try {
            const puntos = await this.obtenerMisPuntos();
            const historial = await this.obtenerHistorialPuntos(10);
            
            if (puntos.error) {
                this.renderizarError(containerId, puntos.error);
                return;
            }
            
            this.renderizarPanel(containerId, puntos, historial);
            
        } catch (error) {
            console.error('Error en mostrarPanelPuntos:', error);
        }
    },
    
    /**
     * Renderizar panel de puntos
     */
    renderizarPanel(containerId, puntos, historial) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const nivelInfo = this.obtenerInfoNivel(puntos.nivel);
        const descuentoDisponible = Math.floor(puntos.puntos_disponibles / 100) * 10; // 100 puntos = $10
        
        const html = `
            <div class="panel-puntos-container" style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 64px; margin-bottom: 15px;">${nivelInfo.icono}</div>
                    <h2 style="margin: 0 0 10px 0; color: #1F2937; font-size: 28px;">
                        ${puntos.nivel} - ${puntos.puntos_disponibles} Puntos
                    </h2>
                    <p style="margin: 0; color: #6B7280; font-size: 16px;">
                        Podés canjear hasta $${descuentoDisponible} de descuento
                    </p>
                </div>
                
                <!-- Estadísticas -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div style="background: #F0F9FF; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 32px; font-weight: 700; color: #3B82F6; margin-bottom: 5px;">
                            ${puntos.puntos_disponibles}
                        </div>
                        <div style="color: #1E40AF; font-size: 14px; font-weight: 600;">Disponibles</div>
                    </div>
                    <div style="background: #F0FDF4; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 32px; font-weight: 700; color: #10B981; margin-bottom: 5px;">
                            ${puntos.puntos_totales}
                        </div>
                        <div style="color: #059669; font-size: 14px; font-weight: 600;">Totales</div>
                    </div>
                    <div style="background: #FEF3C7; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 32px; font-weight: 700; color: #F59E0B; margin-bottom: 5px;">
                            ${puntos.puntos_canjeados}
                        </div>
                        <div style="color: #92400E; font-size: 14px; font-weight: 600;">Canjeados</div>
                    </div>
                </div>
                
                <!-- Progreso al siguiente nivel -->
                ${puntos.puntos_para_proximo_nivel > 0 ? `
                    <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #374151; font-weight: 600;">Próximo nivel: ${puntos.proximo_nivel}</span>
                            <span style="color: #6B7280; font-size: 14px;">Faltan ${puntos.puntos_para_proximo_nivel} puntos</span>
                        </div>
                        <div style="background: #E5E7EB; height: 12px; border-radius: 6px; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #7C3AED, #EC4899); height: 100%; width: ${this.calcularPorcentajeProgreso(puntos.puntos_disponibles, puntos.nivel)}%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                ` : `
                    <div style="background: linear-gradient(135deg, #FCD34D, #F59E0B); padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center; color: white;">
                        <div style="font-size: 24px; margin-bottom: 5px;">🏆</div>
                        <div style="font-weight: 700; font-size: 18px;">¡Nivel Máximo Alcanzado!</div>
                    </div>
                `}
                
                <!-- Canjear puntos -->
                ${puntos.puntos_disponibles >= 100 ? `
                    <div style="background: #EEF2FF; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 2px solid #7C3AED;">
                        <h3 style="margin: 0 0 15px 0; color: #4338CA;">
                            <i class="fas fa-gift"></i> Canjear Puntos
                        </h3>
                        <p style="margin: 0 0 20px 0; color: #4B5563; font-size: 14px;">
                            100 puntos = $10 de descuento. Mínimo 100 puntos.
                        </p>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            ${[100, 200, 500, 1000].filter(p => p <= puntos.puntos_disponibles).map(puntosOpcion => `
                                <button onclick="SistemaPuntosComprador.canjearPuntosRapido(${puntosOpcion})" 
                                        style="background: white; border: 2px solid #7C3AED; color: #7C3AED; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;"
                                        onmouseover="this.style.background='#7C3AED'; this.style.color='white';"
                                        onmouseout="this.style.background='white'; this.style.color='#7C3AED';">
                                    ${puntosOpcion} pts = $${puntosOpcion / 10}
                                </button>
                            `).join('')}
                        </div>
                        <div style="margin-top: 15px;">
                            <input type="number" id="puntos-custom-input" 
                                   placeholder="Cantidad personalizada (múltiplo de 100)" 
                                   min="100" step="100" max="${puntos.puntos_disponibles}"
                                   style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 14px; margin-bottom: 10px;">
                            <button onclick="SistemaPuntosComprador.canjearPuntosCustom()" 
                                    style="width: 100%; background: #7C3AED; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                                <i class="fas fa-gift"></i> Canjear Puntos Personalizados
                            </button>
                        </div>
                    </div>
                ` : `
                    <div style="background: #FEF3C7; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
                        <p style="margin: 0; color: #92400E;">
                            <i class="fas fa-info-circle"></i> Necesitás al menos 100 puntos para canjear. 
                            Seguí comprando para ganar más puntos.
                        </p>
                    </div>
                `}
                
                <!-- Historial -->
                <div>
                    <h3 style="margin: 0 0 20px 0; color: #1F2937;">
                        <i class="fas fa-history"></i> Historial de Puntos
                    </h3>
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${historial.length === 0 ? `
                            <p style="text-align: center; color: #6B7280; padding: 40px;">
                                Aún no tenés historial de puntos
                            </p>
                        ` : historial.map(item => this.renderizarItemHistorial(item)).join('')}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    /**
     * Renderizar item de historial
     */
    renderizarItemHistorial(item) {
        const esGanado = item.tipo === 'ganado';
        const color = esGanado ? '#10B981' : '#EF4444';
        const icono = esGanado ? '➕' : '➖';
        const signo = esGanado ? '+' : '';
        
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #E5E7EB;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                        <span style="font-size: 20px;">${icono}</span>
                        <span style="font-weight: 600; color: ${color};">
                            ${signo}${item.puntos} puntos
                        </span>
                    </div>
                    <p style="margin: 0; color: #6B7280; font-size: 14px;">
                        ${item.descripcion}
                    </p>
                </div>
                <div style="text-align: right; color: #9CA3AF; font-size: 12px;">
                    ${new Date(item.created_at).toLocaleDateString('es-AR')}
                </div>
            </div>
        `;
    },
    
    /**
     * Canjear puntos rápido (desde botón)
     */
    async canjearPuntosRapido(puntos) {
        const resultado = await this.canjearPuntos(puntos);
        
        if (resultado.exito) {
            alert(`✅ ${resultado.mensaje}\n\nCódigo de canje: ${resultado.codigo_canje}\n\nDescuento: $${resultado.descuento}\n\nUsá este código en tu próxima compra.`);
            
            // Recargar panel
            const container = document.getElementById('panel-puntos');
            if (container) {
                this.mostrarPanelPuntos('panel-puntos');
            }
        } else {
            alert(`❌ ${resultado.mensaje}`);
        }
    },
    
    /**
     * Canjear puntos personalizados
     */
    async canjearPuntosCustom() {
        const input = document.getElementById('puntos-custom-input');
        if (!input) return;
        
        const puntos = parseInt(input.value);
        if (isNaN(puntos) || puntos < 100) {
            alert('❌ Mínimo 100 puntos y debe ser múltiplo de 100');
            return;
        }
        
        if (puntos % 100 !== 0) {
            alert('❌ Debe ser múltiplo de 100 puntos');
            return;
        }
        
        await this.canjearPuntosRapido(puntos);
        input.value = '';
    },
    
    /**
     * Obtener información del nivel
     */
    obtenerInfoNivel(nivel) {
        const niveles = {
            'Bronce': { icono: '🥉', color: '#CD7F32' },
            'Plata': { icono: '🥈', color: '#C0C0C0' },
            'Oro': { icono: '🥇', color: '#FFD700' },
            'Platino': { icono: '💎', color: '#E5E4E2' }
        };
        
        return niveles[nivel] || niveles['Bronce'];
    },
    
    /**
     * Calcular porcentaje de progreso
     */
    calcularPorcentajeProgreso(puntos, nivel) {
        const niveles = {
            'Bronce': { actual: 0, siguiente: 1000 },
            'Plata': { actual: 1000, siguiente: 5000 },
            'Oro': { actual: 5000, siguiente: 10000 },
            'Platino': { actual: 10000, siguiente: 10000 }
        };
        
        const info = niveles[nivel] || niveles['Bronce'];
        const rango = info.siguiente - info.actual;
        const progreso = puntos - info.actual;
        
        return Math.min(100, Math.max(0, (progreso / rango) * 100));
    },
    
    /**
     * Renderizar error
     */
    renderizarError(containerId, mensaje) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div style="background: #FEE2E2; padding: 20px; border-radius: 12px; text-align: center; color: #991B1B;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                <p style="margin: 0; font-weight: 600;">${mensaje}</p>
            </div>
        `;
    }
};

// Hacer disponible globalmente
window.SistemaPuntosComprador = SistemaPuntosComprador;
