// ===== SISTEMA CRESALIA SOLIDARIO - EMERGENCIAS =====
// Sistema de donaciones de materiales para desastres naturales verificados
// Co-fundadores: Crisla & Claude

class SistemaCresaliaSolidarioEmergencias {
    constructor() {
        this.supabase = null;
        this.usuarioHash = null;
        this.init();
    }
    
    async init() {
        // Inicializar Supabase
        if (typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
            try {
                const config = window.SUPABASE_CONFIG;
                if (config.url && config.anonKey && !config.anonKey.includes('REEMPLAZA')) {
                    this.supabase = window.supabase.createClient(config.url, config.anonKey);
                    console.log('✅ Cresalia Solidario Emergencias: Supabase inicializado');
                }
            } catch (error) {
                console.error('❌ Error inicializando Supabase:', error);
            }
        }
        
        // Generar hash de usuario
        this.usuarioHash = this.generarHashUsuario();
    }
    
    generarHashUsuario() {
        let hash = localStorage.getItem('cresalia_solidario_emergencias_hash');
        if (!hash) {
            const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
            hash = btoa(random).substring(0, 32);
            localStorage.setItem('cresalia_solidario_emergencias_hash', hash);
        }
        return hash;
    }
    
    // ===== CARGAR CAMPAÑAS ACTIVAS =====
    async cargarCampanas() {
        const container = document.getElementById('campanasContainer');
        if (!container) return;
        
        try {
            container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Cargando campañas...</p></div>';
            
            let campanas = [];
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('campañas_emergencia')
                    .select('*')
                    .eq('estado', 'activa')
                    .eq('verificada', true)
                    .order('fecha_desastre', { ascending: false });
                
                if (error) throw error;
                campanas = data || [];
            } else {
                // Modo local
                campanas = JSON.parse(localStorage.getItem('campañas_emergencia') || '[]')
                    .filter(c => c.estado === 'activa' && c.verificada === true);
            }
            
            if (campanas.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-heart"></i>
                        <h3>No hay campañas activas en este momento</h3>
                        <p>Las campañas de emergencia solo aparecen cuando hay desastres naturales verificados.</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = campanas.map(campana => this.renderizarCampana(campana)).join('');
        } catch (error) {
            console.error('Error cargando campañas:', error);
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error cargando campañas</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
    
    renderizarCampana(campana) {
        const iconosDesastres = {
            'inundacion': '🌊',
            'incendio': '🔥',
            'terremoto': '🌍',
            'tornado': '🌪️',
            'tormenta': '⛈️',
            'otro_desastre': '🚨'
        };
        
        const nombresDesastres = {
            'inundacion': 'Inundación',
            'incendio': 'Incendio',
            'terremoto': 'Terremoto',
            'tornado': 'Tornado',
            'tormenta': 'Tormenta',
            'otro_desastre': 'Otro Desastre'
        };
        
        const icono = iconosDesastres[campana.tipo_desastre] || '🚨';
        const nombre = nombresDesastres[campana.tipo_desastre] || 'Desastre Natural';
        
        const necesidades = Array.isArray(campana.necesidades) ? campana.necesidades : [];
        const prioritarias = Array.isArray(campana.necesidades_prioritarias) ? campana.necesidades_prioritarias : [];
        
        const fechaDesastre = new Date(campana.fecha_desastre).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let necesidadesHTML = '';
        if (necesidades.length > 0) {
            necesidadesHTML = `
                <div class="campana-necesidades">
                    <strong style="color: #374151;">Necesidades:</strong>
                    <div class="necesidades-tags">
                        ${necesidades.map(n => {
                            const esPrioritaria = prioritarias.includes(n);
                            return `<span class="necesidad-tag ${esPrioritaria ? 'prioritaria' : ''}">${n}${esPrioritaria ? ' ⚠️' : ''}</span>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        let sangreHTML = '';
        if (campana.necesita_sangre) {
            const tiposSangre = Array.isArray(campana.tipo_sangre_requerido) ? campana.tipo_sangre_requerido : [];
            sangreHTML = `
                <div class="campana-sangre">
                    <strong>🩸 Se necesitan donaciones de sangre</strong>
                    ${tiposSangre.length > 0 ? `<p>Tipos requeridos: ${tiposSangre.join(', ')}</p>` : ''}
                    ${campana.hospital_contacto ? `<p>Contacto: ${this.escapeHtml(campana.hospital_contacto)}</p>` : ''}
                </div>
            `;
        }
        
        return `
            <div class="campana-card activa">
                <div class="campana-header">
                    <div>
                        <div class="campana-titulo">${icono} ${this.escapeHtml(campana.titulo)}</div>
                        <span class="campana-tipo">${nombre}</span>
                        ${campana.verificada ? '<span class="verificada-badge">✓ Verificada</span>' : ''}
                    </div>
                </div>
                
                <div class="campana-ubicacion">
                    <i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(campana.ubicacion)}
                </div>
                
                <div class="campana-fecha">
                    <i class="fas fa-calendar"></i> ${fechaDesastre}
                </div>
                
                <div class="campana-descripcion" style="margin-bottom: 15px; color: #374151; line-height: 1.6;">
                    ${this.escapeHtml(campana.descripcion)}
                </div>
                
                ${necesidadesHTML}
                
                ${sangreHTML}
                
                <button class="btn-donar" onclick="donarACampana('${campana.id}')">
                    <i class="fas fa-heart"></i> Donar Ahora
                </button>
            </div>
        `;
    }
    
    // ===== CARGAR ESTADÍSTICAS =====
    async cargarEstadisticas() {
        try {
            if (!this.supabase) {
                document.getElementById('campanasActivas').textContent = '-';
                document.getElementById('totalDonaciones').textContent = '-';
                document.getElementById('totalDonantes').textContent = '-';
                return;
            }
            
            // Campañas activas
            const { data: campanas, error: errorCampanas } = await this.supabase
                .from('campañas_emergencia')
                .select('id')
                .eq('estado', 'activa')
                .eq('verificada', true);
            
            if (!errorCampanas) {
                document.getElementById('campanasActivas').textContent = campanas?.length || 0;
            }
            
            // Total donaciones
            const { data: donaciones, error: errorDonaciones } = await this.supabase
                .from('donaciones_materiales')
                .select('id')
                .in('estado', ['confirmada', 'entregada', 'recibida']);
            
            if (!errorDonaciones) {
                document.getElementById('totalDonaciones').textContent = donaciones?.length || 0;
            }
            
            // Total donantes únicos
            const { data: donantes, error: errorDonantes } = await this.supabase
                .from('donaciones_materiales')
                .select('donante_email')
                .in('estado', ['confirmada', 'entregada', 'recibida']);
            
            if (!errorDonantes && donantes) {
                const donantesUnicos = new Set(donantes.map(d => d.donante_email));
                document.getElementById('totalDonantes').textContent = donantesUnicos.size;
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    }
    
    // ===== DONAR MATERIALES =====
    async donarMateriales(campanaId, datos) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con Supabase');
            return;
        }
        
        try {
            const donacionData = {
                campaña_id: campanaId,
                donante_nombre: datos.nombre,
                donante_email: datos.email,
                donante_telefono: datos.telefono || null,
                donante_ubicacion: datos.ubicacion || null,
                donante_anonimo: datos.anonimo || false,
                tipo_donacion: datos.tipo_donacion,
                productos_donados: datos.productos || [],
                descripcion: datos.descripcion || null,
                tipo_sangre: datos.tipo_sangre || null,
                fecha_donacion_sangre: datos.fecha_donacion_sangre || null,
                hospital_destino: datos.hospital_destino || null,
                metodo_entrega: datos.metodo_entrega || 'llevar_personalmente',
                punto_acopio: datos.punto_acopio || null,
                estado: 'pendiente'
            };
            
            const { data, error } = await this.supabase
                .from('donaciones_materiales')
                .insert([donacionData])
                .select();
            
            if (error) throw error;
            
            // Actualizar estadísticas de la campaña
            await this.actualizarEstadisticasCampana(campanaId);
            
            this.mostrarExito('✅ Donación registrada correctamente. Te contactaremos pronto.');
            return data[0];
        } catch (error) {
            console.error('Error registrando donación:', error);
            this.mostrarError('Error al registrar donación: ' + error.message);
            throw error;
        }
    }
    
    // ===== ACTUALIZAR ESTADÍSTICAS DE CAMPAÑA =====
    async actualizarEstadisticasCampana(campanaId) {
        if (!this.supabase) return;
        
        try {
            const { data: donaciones, error } = await this.supabase
                .from('donaciones_materiales')
                .select('donante_email')
                .eq('campaña_id', campanaId)
                .in('estado', ['confirmada', 'entregada', 'recibida']);
            
            if (!error && donaciones) {
                const totalDonaciones = donaciones.length;
                const donantesUnicos = new Set(donaciones.map(d => d.donante_email));
                const totalDonantes = donantesUnicos.size;
                
                await this.supabase
                    .from('campañas_emergencia')
                    .update({
                        total_donaciones: totalDonaciones,
                        total_donantes: totalDonantes
                    })
                    .eq('id', campanaId);
            }
        } catch (error) {
            console.error('Error actualizando estadísticas:', error);
        }
    }
    
    // ===== CREAR CAMPAÑA (SOLO PARA ADMINISTRADORES) =====
    async crearCampana(datos) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con Supabase');
            return;
        }
        
        try {
            const campanaData = {
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                tipo_desastre: datos.tipo_desastre,
                ubicacion: datos.ubicacion,
                fecha_desastre: datos.fecha_desastre,
                fuente_verificacion: datos.fuente_verificacion,
                evidencias_verificacion: datos.evidencias_verificacion || [],
                necesidades: datos.necesidades || [],
                necesidades_prioritarias: datos.necesidades_prioritarias || [],
                necesita_sangre: datos.necesita_sangre || false,
                tipo_sangre_requerido: datos.tipo_sangre_requerido || [],
                hospital_contacto: datos.hospital_contacto || null,
                fecha_limite: datos.fecha_limite || null,
                verificada: false, // Por defecto, necesita verificación manual
                estado: 'pendiente' // Esperando verificación
            };
            
            const { data, error } = await this.supabase
                .from('campañas_emergencia')
                .insert([campanaData])
                .select();
            
            if (error) throw error;
            
            this.mostrarExito('✅ Campaña creada. Verificá la campaña para activarla.');
            return data[0];
        } catch (error) {
            console.error('Error creando campaña:', error);
            this.mostrarError('Error al crear campaña: ' + error.message);
            throw error;
        }
    }
    
    // ===== VERIFICAR CAMPAÑA (SOLO PARA ADMINISTRADORES) =====
    async verificarCampana(campanaId, aprobar = true, razonRechazo = null) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con Supabase');
            return;
        }
        
        try {
            const updateData = {
                verificada: aprobar,
                fecha_verificacion: aprobar ? new Date().toISOString() : null,
                estado: aprobar ? 'activa' : 'rechazada',
                razon_rechazo: razonRechazo || null
            };
            
            const { data, error } = await this.supabase
                .from('campañas_emergencia')
                .update(updateData)
                .eq('id', campanaId)
                .select();
            
            if (error) throw error;
            
            this.mostrarExito(aprobar ? '✅ Campaña verificada y activada' : '❌ Campaña rechazada');
            return data[0];
        } catch (error) {
            console.error('Error verificando campaña:', error);
            this.mostrarError('Error al verificar campaña: ' + error.message);
            throw error;
        }
    }
    
    // ===== UTILIDADES =====
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    mostrarExito(mensaje) {
        // Crear notificación de éxito
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
        `;
        notification.textContent = mensaje;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    mostrarError(mensaje) {
        // Crear notificación de error
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #EF4444;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
        `;
        notification.textContent = mensaje;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

