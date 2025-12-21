// ===== SISTEMA DE MÚLTIPLES DIRECCIONES =====
// Para que los compradores puedan gestionar varias direcciones de envío

const SistemaDireccionesMultiples = {
    
    /**
     * Cargar direcciones del comprador
     */
    async cargarDirecciones() {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return [];
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];
            
            // Obtener comprador_id
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) return [];
            
            // Cargar direcciones
            const { data: direcciones, error } = await supabase
                .from('direcciones_compradores')
                .select('*')
                .eq('comprador_id', comprador.id)
                .eq('activa', true)
                .order('es_principal', { ascending: false })
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error cargando direcciones:', error);
                return [];
            }
            
            return direcciones || [];
            
        } catch (error) {
            console.error('Error en cargarDirecciones:', error);
            return [];
        }
    },
    
    /**
     * Mostrar modal para gestionar direcciones
     */
    async mostrarGestionDirecciones() {
        const direcciones = await this.cargarDirecciones();
        
        const modalHTML = `
            <div id="modal-direcciones" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto;">
                <div style="background: white; border-radius: 20px; max-width: 700px; width: 100%; max-height: 90vh; position: relative;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 25px; border-radius: 20px 20px 0 0;">
                        <button onclick="document.getElementById('modal-direcciones').remove()" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); border: none; color: white; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-size: 18px;">
                            <i class="fas fa-times"></i>
                        </button>
                        <h2 style="margin: 0; font-size: 24px;">
                            <i class="fas fa-map-marker-alt"></i> Mis Direcciones
                        </h2>
                    </div>
                    
                    <!-- Contenido -->
                    <div style="padding: 30px; max-height: calc(90vh - 180px); overflow-y: auto;">
                        <!-- Lista de Direcciones -->
                        <div id="lista-direcciones" style="margin-bottom: 30px;">
                            ${direcciones.length === 0 ? `
                                <div style="text-align: center; padding: 40px 20px;">
                                    <i class="fas fa-map-marker-alt" style="font-size: 48px; color: #D1D5DB; margin-bottom: 15px;"></i>
                                    <p style="color: #6B7280;">No tienes direcciones guardadas</p>
                                </div>
                            ` : direcciones.map(dir => this.generarCardDireccion(dir)).join('')}
                        </div>
                        
                        <!-- Botón Agregar Nueva -->
                        <button onclick="SistemaDireccionesMultiples.mostrarFormularioNuevaDireccion()" style="width: 100%; background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 600; font-size: 16px; cursor: pointer;">
                            <i class="fas fa-plus"></i> Agregar Nueva Dirección
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },
    
    /**
     * Generar card HTML para una dirección
     */
    generarCardDireccion(direccion) {
        return `
            <div id="direccion-${direccion.id}" style="background: #F8FAFC; border-radius: 12px; padding: 20px; margin-bottom: 15px; border: ${direccion.es_principal ? '2px solid #10B981' : '2px solid #E5E7EB'};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        ${direccion.es_principal ? `
                            <span style="background: #10B981; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-bottom: 10px; display: inline-block;">
                                <i class="fas fa-star"></i> Principal
                            </span>
                        ` : ''}
                        <h3 style="margin: 0 0 10px 0; color: #1F2937; font-size: 18px;">
                            <i class="fas fa-${direccion.alias === 'Casa' ? 'home' : direccion.alias === 'Trabajo' ? 'briefcase' : 'map-marker-alt'}"></i> ${direccion.alias}
                        </h3>
                        <p style="margin: 0 0 5px 0; color: #4B5563; line-height: 1.6;">
                            ${direccion.direccion_completa}
                        </p>
                        <p style="margin: 0; color: #6B7280; font-size: 14px;">
                            ${direccion.ciudad}, ${direccion.provincia}${direccion.codigo_postal ? ` - CP: ${direccion.codigo_postal}` : ''}
                        </p>
                        ${direccion.nombre_destinatario ? `
                            <p style="margin: 10px 0 0 0; color: #6B7280; font-size: 14px;">
                                <i class="fas fa-user"></i> ${direccion.nombre_destinatario}
                            </p>
                        ` : ''}
                        ${direccion.telefono_contacto ? `
                            <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">
                                <i class="fas fa-phone"></i> ${direccion.telefono_contacto}
                            </p>
                        ` : ''}
                    </div>
                    <div style="display: flex; gap: 5px; flex-direction: column;">
                        ${!direccion.es_principal ? `
                            <button onclick="SistemaDireccionesMultiples.marcarComoPrincipal(${direccion.id})" style="background: #10B981; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                                <i class="fas fa-star"></i> Principal
                            </button>
                        ` : ''}
                        <button onclick="SistemaDireccionesMultiples.editarDireccion(${direccion.id})" style="background: #3B82F6; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="SistemaDireccionesMultiples.eliminarDireccion(${direccion.id})" style="background: #EF4444; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Mostrar formulario para nueva dirección
     */
    mostrarFormularioNuevaDireccion(direccionExistente = null) {
        const esEdicion = direccionExistente !== null;
        
        const modalHTML = `
            <div id="modal-form-direccion" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10001; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="background: white; border-radius: 20px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;">
                    <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 25px; border-radius: 20px 20px 0 0;">
                        <button onclick="document.getElementById('modal-form-direccion').remove()" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); border: none; color: white; width: 35px; height: 35px; border-radius: 50%; cursor: pointer;">
                            <i class="fas fa-times"></i>
                        </button>
                        <h2 style="margin: 0; font-size: 24px;">
                            <i class="fas fa-${esEdicion ? 'edit' : 'plus'}"></i> ${esEdicion ? 'Editar' : 'Nueva'} Dirección
                        </h2>
                    </div>
                    
                    <form id="form-direccion" style="padding: 30px;">
                        <input type="hidden" id="direccion-id-edit" value="${direccionExistente?.id || ''}">
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-tag"></i> Alias (ej: Casa, Trabajo)
                            </label>
                            <input type="text" id="direccion-alias" value="${direccionExistente?.alias || ''}" placeholder="Casa" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-user"></i> Nombre del Destinatario
                            </label>
                            <input type="text" id="direccion-nombre" value="${direccionExistente?.nombre_destinatario || ''}" placeholder="Juan Pérez" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-phone"></i> Teléfono de Contacto
                            </label>
                            <input type="tel" id="direccion-telefono" value="${direccionExistente?.telefono_contacto || ''}" placeholder="+54 9 11 1234-5678" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-map-marker-alt"></i> Dirección Completa <span style="color: #EF4444;">*</span>
                            </label>
                            <input type="text" id="direccion-completa" value="${direccionExistente?.direccion_completa || ''}" placeholder="Av. Corrientes 1234" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Ciudad <span style="color: #EF4444;">*</span></label>
                                <input type="text" id="direccion-ciudad" value="${direccionExistente?.ciudad || ''}" placeholder="Ciudad" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Provincia <span style="color: #EF4444;">*</span></label>
                                <input type="text" id="direccion-provincia" value="${direccionExistente?.provincia || ''}" placeholder="Buenos Aires" required style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-mail-bulk"></i> Código Postal
                            </label>
                            <input type="text" id="direccion-cp" value="${direccionExistente?.codigo_postal || ''}" placeholder="C1043AAX" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                                <i class="fas fa-info-circle"></i> Referencias (opcional)
                            </label>
                            <textarea id="direccion-referencias" placeholder="Portón verde, entre X y Y..." style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem; min-height: 80px; resize: vertical;">${direccionExistente?.referencias || ''}</textarea>
                        </div>
                        
                        ${!direccionExistente?.es_principal ? `
                            <div style="margin-bottom: 20px;">
                                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                    <input type="checkbox" id="direccion-principal" ${direccionExistente?.es_principal ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                                    <span style="font-weight: 600; color: #374151;">Marcar como dirección principal</span>
                                </label>
                            </div>
                        ` : ''}
                        
                        <div style="display: flex; gap: 15px;">
                            <button type="button" onclick="document.getElementById('modal-form-direccion').remove()" style="flex: 1; background: #6B7280; color: white; border: none; padding: 15px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                                Cancelar
                            </button>
                            <button type="submit" style="flex: 1; background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 15px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                                <i class="fas fa-save"></i> Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Manejar submit
        document.getElementById('form-direccion').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.guardarDireccion(direccionExistente?.id);
        });
    },
    
    /**
     * Guardar dirección (nueva o editar)
     */
    async guardarDireccion(direccionId = null) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) {
                alert('❌ Error: No se pudo conectar a Supabase');
                return;
            }
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('❌ Debes estar logueado');
                return;
            }
            
            // Obtener comprador_id
            const { data: comprador } = await supabase
                .from('compradores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (!comprador) {
                alert('❌ No se encontró tu perfil');
                return;
            }
            
            const datosDireccion = {
                comprador_id: comprador.id,
                alias: document.getElementById('direccion-alias').value.trim(),
                nombre_destinatario: document.getElementById('direccion-nombre').value.trim() || null,
                telefono_contacto: document.getElementById('direccion-telefono').value.trim() || null,
                direccion_completa: document.getElementById('direccion-completa').value.trim(),
                ciudad: document.getElementById('direccion-ciudad').value.trim(),
                provincia: document.getElementById('direccion-provincia').value.trim(),
                codigo_postal: document.getElementById('direccion-cp').value.trim() || null,
                referencias: document.getElementById('direccion-referencias').value.trim() || null,
                pais: 'Argentina',
                es_principal: document.getElementById('direccion-principal')?.checked || false,
                activa: true
            };
            
            let resultado;
            if (direccionId) {
                // Actualizar
                resultado = await supabase
                    .from('direcciones_compradores')
                    .update(datosDireccion)
                    .eq('id', direccionId);
            } else {
                // Insertar
                resultado = await supabase
                    .from('direcciones_compradores')
                    .insert([datosDireccion]);
            }
            
            if (resultado.error) {
                console.error('Error:', resultado.error);
                alert('❌ Error al guardar: ' + resultado.error.message);
                return;
            }
            
            alert('✅ Dirección guardada correctamente');
            document.getElementById('modal-form-direccion').remove();
            
            // Recargar lista
            const modalExistente = document.getElementById('modal-direcciones');
            if (modalExistente) {
                modalExistente.remove();
                await this.mostrarGestionDirecciones();
            }
            
        } catch (error) {
            console.error('Error guardando dirección:', error);
            alert('❌ Error inesperado: ' + error.message);
        }
    },
    
    /**
     * Marcar dirección como principal
     */
    async marcarComoPrincipal(direccionId) {
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
            
            // Primero desmarcar todas las demás como principales
            await supabase
                .from('direcciones_compradores')
                .update({ es_principal: false })
                .eq('comprador_id', comprador.id);
            
            // Marcar esta como principal
            const { error } = await supabase
                .from('direcciones_compradores')
                .update({ es_principal: true })
                .eq('id', direccionId);
            
            if (error) {
                alert('❌ Error: ' + error.message);
                return;
            }
            
            // Recargar lista
            const modalExistente = document.getElementById('modal-direcciones');
            if (modalExistente) {
                modalExistente.remove();
                await this.mostrarGestionDirecciones();
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error inesperado');
        }
    },
    
    /**
     * Editar dirección
     */
    async editarDireccion(direccionId) {
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return;
            
            const { data: direccion, error } = await supabase
                .from('direcciones_compradores')
                .select('*')
                .eq('id', direccionId)
                .single();
            
            if (error || !direccion) {
                alert('❌ Error al cargar la dirección');
                return;
            }
            
            this.mostrarFormularioNuevaDireccion(direccion);
            
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error inesperado');
        }
    },
    
    /**
     * Eliminar dirección
     */
    async eliminarDireccion(direccionId) {
        if (!confirm('¿Estás seguro de que querés eliminar esta dirección?')) {
            return;
        }
        
        try {
            const supabase = await esperarInitSupabase();
            if (!supabase) return;
            
            // Marcar como inactiva en lugar de eliminar (soft delete)
            const { error } = await supabase
                .from('direcciones_compradores')
                .update({ activa: false })
                .eq('id', direccionId);
            
            if (error) {
                alert('❌ Error: ' + error.message);
                return;
            }
            
            // Recargar lista
            const modalExistente = document.getElementById('modal-direcciones');
            if (modalExistente) {
                modalExistente.remove();
                await this.mostrarGestionDirecciones();
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error inesperado');
        }
    }
};

// Hacer disponible globalmente
window.SistemaDireccionesMultiples = SistemaDireccionesMultiples;
