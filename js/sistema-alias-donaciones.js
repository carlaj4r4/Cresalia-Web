// ===== SISTEMA DE ALIAS/CVU/CBU PARA DONACIONES =====
// Sistema reutilizable para que usuarios/organizaciones agreguen su info de pago
// y puedan recibir donaciones directamente (sin usar cuenta de Cresalia)
// Co-fundadores: Carla & Claude

class SistemaAliasDonaciones {
    constructor(config) {
        this.config = {
            tipoEntidad: config.tipoEntidad || 'usuario', // 'usuario', 'organizacion', 'refugio', etc.
            entidadId: config.entidadId || null,
            entidadNombre: config.entidadNombre || 'Usuario',
            entidadHash: config.entidadHash || null,
            supabase: config.supabase || null,
            ...config
        };
        
        this.usuarioHash = this.generarHashUsuario();
        this.metodosPago = [];
        
        if (config.supabase) {
            this.supabase = config.supabase;
        } else if (typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
            try {
                const supabaseConfig = window.SUPABASE_CONFIG;
                if (supabaseConfig.url && supabaseConfig.anonKey && !supabaseConfig.anonKey.includes('REEMPLAZA')) {
                    this.supabase = window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
                }
            } catch (error) {
                console.error('❌ Error inicializando Supabase:', error);
            }
        }
    }
    
    generarHashUsuario() {
        if (this.config.entidadHash) {
            return this.config.entidadHash;
        }
        
        let hash = localStorage.getItem(`cresalia_donaciones_${this.config.tipoEntidad}_hash`);
        if (!hash) {
            const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
            hash = btoa(random).substring(0, 32);
            localStorage.setItem(`cresalia_donaciones_${this.config.tipoEntidad}_hash`, hash);
        }
        return hash;
    }
    
    // ===== CARGAR MÉTODOS DE PAGO =====
    async cargarMetodosPago() {
        if (!this.supabase) {
            console.error('❌ Supabase no inicializado');
            return [];
        }
        
        try {
            const { data, error } = await this.supabase
                .from('metodos_pago_donaciones')
                .select('*')
                .eq('entidad_hash', this.usuarioHash)
                .eq('estado', 'activo')
                .order('fecha_creacion', { ascending: false });
            
            if (error) throw error;
            
            this.metodosPago = data || [];
            return this.metodosPago;
        } catch (error) {
            console.error('Error cargando métodos de pago:', error);
            return [];
        }
    }
    
    // ===== AGREGAR MÉTODO DE PAGO =====
    async agregarMetodoPago(datos) {
        if (!this.supabase) {
            throw new Error('Supabase no inicializado');
        }
        
        // Validar datos
        if (!datos.metodoTipo || !datos.metodoValor || !datos.titularNombre) {
            throw new Error('Faltan datos obligatorios');
        }
        
        const metodoPago = {
            tipo_entidad: this.config.tipoEntidad,
            entidad_id: this.config.entidadId || this.usuarioHash,
            entidad_nombre: this.config.entidadNombre,
            entidad_hash: this.usuarioHash,
            metodo_tipo: datos.metodoTipo, // 'alias', 'cvu', 'cbu'
            metodo_valor: datos.metodoValor.trim(),
            titular_nombre: datos.titularNombre.trim(),
            banco: datos.banco?.trim() || null,
            verificado: false,
            estado: 'activo',
            fecha_creacion: new Date().toISOString()
        };
        
        try {
            const { data, error } = await this.supabase
                .from('metodos_pago_donaciones')
                .insert([metodoPago])
                .select();
            
            if (error) throw error;
            
            await this.cargarMetodosPago();
            return data[0];
        } catch (error) {
            console.error('Error agregando método de pago:', error);
            throw error;
        }
    }
    
    // ===== OBTENER MÉTODOS DE PAGO DE UNA ENTIDAD (para mostrar a donantes) =====
    async obtenerMetodosPagoEntidad(entidadHash) {
        if (!this.supabase) {
            return [];
        }
        
        try {
            const { data, error } = await this.supabase
                .from('metodos_pago_donaciones')
                .select('*')
                .eq('entidad_hash', entidadHash)
                .eq('estado', 'activo')
                .order('fecha_creacion', { ascending: false });
            
            if (error) throw error;
            
            return data || [];
        } catch (error) {
            console.error('Error obteniendo métodos de pago:', error);
            return [];
        }
    }
    
    // ===== CREAR HTML PARA MOSTRAR INFO DE DONACIÓN =====
    crearHTMLDonacion(metodosPago, entidadNombre) {
        if (!metodosPago || metodosPago.length === 0) {
            return `
                <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; text-align: center; color: #6b7280;">
                    <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p style="margin: 0;">No hay métodos de pago configurados aún.</p>
                </div>
            `;
        }
        
        const nombre = entidadNombre || 'Esta entidad';
        const metodosHTML = metodosPago.map(metodo => {
            const tipoNombre = this.getTipoNombre(metodo.metodo_tipo);
            const bancoInfo = metodo.banco ? `<br><small style="color: #6b7280;">Banco: ${this.escapeHtml(metodo.banco)}</small>` : '';
            
            return `
                <div style="background: white; border: 2px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
                    <h4 style="color: #059669; margin-bottom: 10px;">
                        <i class="fas fa-${metodo.metodo_tipo === 'alias' ? 'tag' : 'university'}"></i> ${tipoNombre}
                    </h4>
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                        <strong style="font-size: 1.2rem; color: #059669;">${this.escapeHtml(metodo.metodo_valor)}</strong>
                        ${bancoInfo}
                    </div>
                    <p style="margin: 0; color: #6b7280;">
                        <i class="fas fa-user"></i> Titular: <strong>${this.escapeHtml(metodo.titular_nombre)}</strong>
                    </p>
                    ${metodo.verificado ? '<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.8rem; margin-top: 10px; display: inline-block;"><i class="fas fa-check-circle"></i> Verificado</span>' : ''}
                </div>
            `;
        }).join('');
        
        return `
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1)); border-left: 4px solid #10b981; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="color: #059669; margin-bottom: 15px;">
                    <i class="fas fa-heart"></i> Cómo Ayudar a ${nombre}
                </h3>
                <p style="color: #374151; margin-bottom: 20px; line-height: 1.7;">
                    Puedes ayudar económicamente enviando una transferencia a través de los siguientes métodos. 
                    <strong>Toda la ayuda va directamente a ${nombre}.</strong> Cresalia no cobra comisiones ni procesa estos pagos.
                </p>
                ${metodosHTML}
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #10b981;">
                    <p style="margin: 0; color: #374151; font-size: 0.9rem;">
                        <strong>💜 Importante:</strong> Los pagos se realizan directamente a ${nombre}. 
                        Cresalia solo facilita la conexión y no tiene acceso a tu dinero ni cobra comisiones.
                    </p>
                </div>
            </div>
        `;
    }
    
    getTipoNombre(tipo) {
        const tipos = {
            'alias': 'Alias',
            'cvu': 'CVU',
            'cbu': 'CBU'
        };
        return tipos[tipo] || tipo.toUpperCase();
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ===== CREAR FORMULARIO PARA AGREGAR MÉTODO DE PAGO =====
    crearFormularioAgregar(containerId, onSuccess) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 15px; padding: 30px;">
                <h3 style="color: #374151; margin-bottom: 20px;">
                    <i class="fas fa-plus-circle"></i> Agregar Método de Pago para Donaciones
                </h3>
                
                <form id="form-agregar-metodo-pago">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                            Tipo de Método *
                        </label>
                        <select id="metodo-tipo" required style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                            <option value="">Selecciona un tipo</option>
                            <option value="alias">Alias</option>
                            <option value="cvu">CVU</option>
                            <option value="cbu">CBU</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                            Valor (Alias/CVU/CBU) *
                        </label>
                        <input type="text" id="metodo-valor" required 
                               placeholder="Ej: alias.mi.alias o 0000003100000000000001"
                               style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                            Nombre del Titular *
                        </label>
                        <input type="text" id="titular-nombre" required 
                               placeholder="Nombre completo del titular de la cuenta"
                               style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">
                            Banco (Opcional)
                        </label>
                        <input type="text" id="banco" 
                               placeholder="Ej: Banco de la Nación Argentina"
                               style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem;">
                    </div>
                    
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #374151; font-size: 0.9rem; line-height: 1.6;">
                            <strong>⚠️ Importante:</strong> Esta información será visible públicamente para que otros puedan ayudarte. 
                            Asegúrate de que los datos sean correctos.
                        </p>
                    </div>
                    
                    <button type="submit" class="btn-primary" id="btn-submit-metodo-pago" 
                            style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 30px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 1rem;">
                        <i class="fas fa-check"></i> Agregar Método de Pago
                    </button>
                </form>
            </div>
        `;
        
        const form = document.getElementById('form-agregar-metodo-pago');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.procesarAgregarMetodoPago(onSuccess);
            });
        }
    }
    
    async procesarAgregarMetodoPago(onSuccess) {
        const btn = document.getElementById('btn-submit-metodo-pago');
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        
        try {
            const datos = {
                metodoTipo: document.getElementById('metodo-tipo').value,
                metodoValor: document.getElementById('metodo-valor').value.trim(),
                titularNombre: document.getElementById('titular-nombre').value.trim(),
                banco: document.getElementById('banco').value.trim() || null
            };
            
            await this.agregarMetodoPago(datos);
            
            if (onSuccess) {
                onSuccess();
            }
            
            btn.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                document.getElementById('form-agregar-metodo-pago').reset();
            }, 2000);
            
        } catch (error) {
            console.error('Error agregando método de pago:', error);
            alert('Error al agregar el método de pago. Por favor, intenta de nuevo.');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.SistemaAliasDonaciones = SistemaAliasDonaciones;
}

