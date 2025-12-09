// ===== COMUNIDAD: ALERTAS DE SERVICIOS PÚBLICOS =====
// Reportes de cortes de luz, agua, gas
// Co-fundadores: Carla & Claude

class ComunidadAlertasServiciosPublicos {
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
                    console.log('✅ Alertas Servicios Públicos: Supabase inicializado');
                }
            } catch (error) {
                console.error('❌ Error inicializando Supabase:', error);
            }
        }
        
        // Generar hash de usuario
        this.usuarioHash = this.generarHashUsuario();
        
        // Configurar tabs
        this.configurarTabs();
        
        // Cargar contenido inicial
        await this.cargarReportes();
        await this.cargarEstadisticas();
        await this.cargarProvincias();
        
        // Configurar formulario
        this.configurarFormulario();
    }
    
    generarHashUsuario() {
        let hash = localStorage.getItem('cresalia_alertas_servicios_hash');
        if (!hash) {
            const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
            hash = btoa(random).substring(0, 32);
            localStorage.setItem('cresalia_alertas_servicios_hash', hash);
        }
        return hash;
    }
    
    configurarTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                
                tab.classList.add('active');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                    
                    // Cargar contenido específico del tab
                    if (tabId === 'mi-historial') {
                        this.cargarMiHistorial();
                    }
                }
            });
        });
    }
    
    // ===== CARGAR REPORTES =====
    async cargarReportes() {
        if (!this.supabase) return;
        
        const servicio = document.getElementById('filtro-servicio')?.value || '';
        const provincia = document.getElementById('filtro-provincia')?.value || '';
        
        try {
            let query = this.supabase
                .from('alertas_servicios_publicos')
                .select('*')
                .in('estado', ['no-solucionado', 'en-curso', 'resuelto'])
                .order('fecha_reporte', { ascending: false })
                .limit(100);
            
            if (servicio) {
                query = query.eq('tipo_servicio', servicio);
            }
            if (provincia) {
                query = query.eq('provincia', provincia);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            this.mostrarReportes(data || []);
        } catch (error) {
            console.error('Error cargando reportes:', error);
            document.getElementById('reportes-lista').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar reportes. Por favor, intenta nuevamente.</p>
                </div>
            `;
        }
    }
    
    mostrarReportes(reportes) {
        const container = document.getElementById('reportes-lista');
        
        if (!reportes || reportes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-info-circle"></i>
                    <p>No hay reportes activos en este momento.</p>
                    <p style="margin-top: 10px; font-size: 0.9rem;">Sé el primero en reportar un corte en tu zona.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = reportes.map(reporte => {
            const iconos = {
                'luz': '⚡',
                'agua': '💧',
                'gas': '🔥',
                'otro': '⚙️'
            };
            
            const colores = {
                'luz': '#fbbf24',
                'agua': '#3b82f6',
                'gas': '#ef4444',
                'otro': '#6b7280'
            };
            
            const urgenciaBadges = {
                'urgente': '<span class="badge-urgente">🚨 Urgente</span>',
                'moderado': '<span class="badge-moderado">⚠️ Moderado</span>',
                'leve': '<span class="badge-leve">📋 Leve</span>'
            };
            
            const fecha = new Date(reporte.fecha_reporte).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="service-card">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div>
                            <span class="badge-service" style="background: ${colores[reporte.tipo_servicio]}; color: white;">
                                ${iconos[reporte.tipo_servicio]} ${this.escapeHtml(reporte.tipo_servicio.charAt(0).toUpperCase() + reporte.tipo_servicio.slice(1))}
                            </span>
                            ${urgenciaBadges[reporte.urgencia] || ''}
                        </div>
                        <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <p style="color: #374151; font-weight: 600; margin-bottom: 5px;">
                            📍 ${this.escapeHtml(reporte.ciudad)}, ${this.escapeHtml(reporte.provincia)}
                        </p>
                        ${reporte.direccion ? `<p style="color: #6b7280; font-size: 0.9rem; margin: 0;">${this.escapeHtml(reporte.direccion)}</p>` : ''}
                    </div>
                    
                    <div style="background: #f9fafb; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <p style="color: #374151; margin: 0; line-height: 1.6;">${this.escapeHtml(reporte.descripcion)}</p>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                        <div style="display: flex; gap: 10px; font-size: 0.85rem; color: #6b7280;">
                            <span><i class="fas fa-users"></i> ${reporte.num_reportes || 1} reporte(s)</span>
                        </div>
                        <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                            <select class="estado-select" data-reporte-id="${reporte.id}" style="padding: 6px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.85rem; cursor: pointer; background: white;">
                                <option value="no-solucionado" ${reporte.estado === 'no-solucionado' ? 'selected' : ''}>❌ No Solucionado</option>
                                <option value="en-curso" ${reporte.estado === 'en-curso' ? 'selected' : ''}>🔄 En Curso</option>
                                <option value="resuelto" ${reporte.estado === 'resuelto' ? 'selected' : ''}>✅ Resuelto</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Agregar listeners para cambiar estado
        container.querySelectorAll('.estado-select').forEach(select => {
            select.addEventListener('change', async (e) => {
                const reporteId = e.target.dataset.reporteId;
                const nuevoEstado = e.target.value;
                await this.actualizarEstadoReporte(reporteId, nuevoEstado);
            });
        });
    }
    
    // ===== ACTUALIZAR ESTADO DE REPORTE =====
    async actualizarEstadoReporte(reporteId, nuevoEstado) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con la base de datos');
            return;
        }
        
        try {
            const { error } = await this.supabase
                .from('alertas_servicios_publicos')
                .update({ 
                    estado: nuevoEstado,
                    fecha_resolucion: nuevoEstado === 'resuelto' ? new Date().toISOString() : null
                })
                .eq('id', reporteId);
            
            if (error) throw error;
            
            this.mostrarExito('✅ Estado del reporte actualizado correctamente.');
            await this.cargarReportes();
        } catch (error) {
            console.error('Error actualizando estado:', error);
            this.mostrarError('Error al actualizar el estado. Por favor, intenta nuevamente.');
        }
    }
    
    // ===== CARGAR ESTADÍSTICAS =====
    async cargarEstadisticas() {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('alertas_servicios_publicos')
                .select('*')
                .eq('estado', 'activo');
            
            if (error) throw error;
            
            const reportes = data || [];
            const hoy = new Date().toDateString();
            const reportesHoy = reportes.filter(r => new Date(r.fecha_reporte).toDateString() === hoy);
            
            // Calcular zona más afectada
            const zonas = {};
            reportes.forEach(r => {
                const zona = `${r.ciudad}, ${r.provincia}`;
                zonas[zona] = (zonas[zona] || 0) + 1;
            });
            const zonaMasAfectada = Object.entries(zonas).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
            
            // Calcular servicio más reportado
            const servicios = {};
            reportes.forEach(r => {
                servicios[r.tipo_servicio] = (servicios[r.tipo_servicio] || 0) + 1;
            });
            const servicioMasReportado = Object.entries(servicios).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
            
            document.getElementById('total-reportes').textContent = reportes.length;
            document.getElementById('reportes-hoy').textContent = reportesHoy.length;
            document.getElementById('zona-mas-afectada').textContent = zonaMasAfectada.split(',')[0] || '-';
            document.getElementById('servicio-mas-reportado').textContent = servicioMasReportado.charAt(0).toUpperCase() + servicioMasReportado.slice(1) || '-';
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    }
    
    // ===== CARGAR PROVINCIAS =====
    async cargarProvincias() {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('alertas_servicios_publicos')
                .select('provincia')
                .eq('estado', 'activo');
            
            if (error) throw error;
            
            const provinciasUnicas = [...new Set((data || []).map(r => r.provincia).filter(Boolean))].sort();
            
            const select = document.getElementById('filtro-provincia');
            if (select) {
                select.innerHTML = '<option value="">Todas las provincias</option>' +
                    provinciasUnicas.map(p => `<option value="${this.escapeHtml(p)}">${this.escapeHtml(p)}</option>`).join('');
            }
        } catch (error) {
            console.error('Error cargando provincias:', error);
        }
    }
    
    // ===== CONFIGURAR FORMULARIO =====
    configurarFormulario() {
        const form = document.getElementById('form-reportar-corte');
        if (!form) return;
        
        // Cargar email guardado si existe
        const emailGuardado = localStorage.getItem('cresalia_user_email') || localStorage.getItem('cresalia_servicios_email');
        if (emailGuardado) {
            const emailInput = document.getElementById('email-notificaciones');
            if (emailInput) {
                emailInput.value = emailGuardado;
            }
        }
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Guardar email si se ingresó
            const emailInput = document.getElementById('email-notificaciones');
            if (emailInput && emailInput.value.trim()) {
                const email = emailInput.value.trim();
                localStorage.setItem('cresalia_user_email', email);
                localStorage.setItem('cresalia_servicios_email', email);
                
                // Actualizar email en sistema de notificaciones
                if (window.notificacionesServicios) {
                    window.notificacionesServicios.emailUsuario = email;
                }
            }
            
            const datos = {
                tipo_servicio: document.getElementById('tipo-servicio').value,
                urgencia: document.getElementById('urgencia').value,
                ciudad: document.getElementById('ciudad').value,
                provincia: document.getElementById('provincia').value,
                direccion: document.getElementById('direccion').value || null,
                descripcion: document.getElementById('descripcion').value,
                reportado_por_hash: this.usuarioHash
            };
            
            try {
                const resultado = await this.reportarCorte(datos);
                form.reset();
                
                // Restaurar email guardado
                if (emailInput && emailGuardado) {
                    emailInput.value = emailGuardado;
                }
                
                // Registrar en sistema de insignias
                if (window.sistemaInsignias && typeof window.sistemaInsignias.registrarReporte === 'function') {
                    window.sistemaInsignias.registrarReporte('servicios', resultado.id);
                }
                
                this.mostrarExito('✅ Reporte enviado correctamente. Gracias por ayudar a la comunidad.');
                await this.cargarReportes();
                await this.cargarEstadisticas();
            } catch (error) {
                console.error('Error reportando corte:', error);
                this.mostrarError('Error al enviar reporte: ' + error.message);
            }
        });
    }
    
    // ===== REPORTAR CORTE =====
    async reportarCorte(datos) {
        if (!this.supabase) {
            throw new Error('No hay conexión con Supabase');
        }
        
        try {
            const { data, error } = await this.supabase
                .from('alertas_servicios_publicos')
                .insert([{
                    tipo_servicio: datos.tipo_servicio,
                    urgencia: datos.urgencia,
                    ciudad: datos.ciudad,
                    provincia: datos.provincia,
                    direccion: datos.direccion,
                    descripcion: datos.descripcion,
                    reportado_por_hash: datos.reportado_por_hash,
                    estado: 'no-solucionado',
                    num_reportes: 1
                }])
                .select();
            
            if (error) throw error;
            
            return data[0];
        } catch (error) {
            console.error('Error reportando corte:', error);
            throw error;
        }
    }
    
    // ===== REPORTAR TRABAJADORES EN ZONA =====
    async reportarTrabajadores(datos) {
        if (!this.supabase) {
            throw new Error('No hay conexión con Supabase');
        }
        
        try {
            const { data, error } = await this.supabase
                .from('trabajadores_servicios_publicos')
                .insert([{
                    tipo_servicio: datos.tipo_servicio,
                    ciudad: datos.ciudad,
                    provincia: datos.provincia,
                    direccion: datos.direccion,
                    descripcion: datos.descripcion,
                    reportado_por_hash: this.usuarioHash,
                    estado: 'activo',
                    necesita_ayuda: true
                }])
                .select();
            
            if (error) throw error;
            
            this.mostrarExito('✅ Trabajadores reportados. La comunidad puede ver dónde están trabajando. Si alguien está cerca y quiere ofrecer apoyo solidario de forma voluntaria, puede hacerlo.');
            await this.cargarTrabajadores();
            return data[0];
        } catch (error) {
            console.error('Error reportando trabajadores:', error);
            throw error;
        }
    }
    
    // ===== CARGAR TRABAJADORES =====
    async cargarTrabajadores() {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('trabajadores_servicios_publicos')
                .select('*')
                .eq('estado', 'activo')
                .order('fecha_reporte', { ascending: false })
                .limit(50);
            
            if (error) throw error;
            
            this.mostrarTrabajadores(data || []);
        } catch (error) {
            console.error('Error cargando trabajadores:', error);
        }
    }
    
    mostrarTrabajadores(trabajadores) {
        const container = document.getElementById('trabajadores-lista');
        if (!container) return;
        
        if (!trabajadores || trabajadores.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-info-circle"></i>
                    <p>No hay trabajadores reportados en este momento.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = trabajadores.map(t => {
            const iconos = {
                'luz': '⚡',
                'agua': '💧',
                'gas': '🔥',
                'otro': '⚙️'
            };
            
            const fecha = new Date(t.fecha_reporte).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="service-card">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div>
                            <span class="badge-service" style="background: #3b82f6; color: white;">
                                ${iconos[t.tipo_servicio]} ${this.escapeHtml(t.tipo_servicio.charAt(0).toUpperCase() + t.tipo_servicio.slice(1))}
                            </span>
                            ${t.necesita_ayuda ? '<span class="badge-urgente">🤲 Necesita Ayuda</span>' : ''}
                        </div>
                        <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <p style="color: #374151; font-weight: 600; margin-bottom: 5px;">
                            📍 ${this.escapeHtml(t.ciudad)}, ${this.escapeHtml(t.provincia)}
                        </p>
                        ${t.direccion ? `
                            <div style="background: #fef3c7; padding: 10px; border-radius: 8px; border-left: 3px solid #f59e0b; margin-top: 8px;">
                                <p style="color: #374151; font-size: 0.9rem; margin: 0;">
                                    <i class="fas fa-map-marker-alt"></i> <strong>Zona:</strong> ${this.escapeHtml(this.sanitizarDireccion(t.direccion))}
                                </p>
                                <p style="color: #6b7280; font-size: 0.75rem; margin: 5px 0 0 0; font-style: italic;">
                                    (Zona general por seguridad de los trabajadores)
                                </p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
                        <p style="color: #374151; margin: 0; line-height: 1.6;">${this.escapeHtml(t.descripcion)}</p>
                    </div>
                    
                    ${t.necesita_ayuda ? `
                        <div style="background: #f0fdf4; padding: 15px; border-radius: 10px; margin-top: 15px; border-left: 4px solid #10b981;">
                            <p style="margin: 0 0 10px 0; color: #374151; font-size: 0.9rem; font-style: italic;">
                                Si estás cerca y quieres ofrecer apoyo solidario de forma voluntaria:
                            </p>
                            <button onclick="ofrecerAyudaTrabajadores(${t.id})" class="btn-primary" style="width: 100%;">
                                <i class="fas fa-hand-holding-heart"></i> Ofrecer Apoyo Solidario (Opcional)
                            </button>
                            <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 0.8rem; text-align: center; font-style: italic;">
                                Completamente voluntario. Sin obligación.
                            </p>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
    
    // ===== CONFIGURAR FORMULARIO TRABAJADORES =====
    configurarFormularioTrabajadores() {
        const form = document.getElementById('form-trabajadores-zona');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const datos = {
                tipo_servicio: document.getElementById('trabajadores-servicio').value,
                ciudad: document.getElementById('trabajadores-ciudad').value,
                provincia: document.getElementById('trabajadores-provincia').value,
                direccion: document.getElementById('trabajadores-direccion').value || null,
                descripcion: document.getElementById('trabajadores-descripcion').value
            };
            
            try {
                await this.reportarTrabajadores(datos);
                form.reset();
                this.mostrarExito('✅ Trabajadores reportados. Gracias por ayudar a la comunidad.');
            } catch (error) {
                console.error('Error reportando trabajadores:', error);
                this.mostrarError('Error al enviar reporte: ' + error.message);
            }
        });
    }
    
    // ===== HELPERS =====
    mostrarExito(mensaje) {
        alert(mensaje); // Mejorar después con notificaciones
    }
    
    mostrarError(mensaje) {
        alert(mensaje); // Mejorar después con notificaciones
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Sanitizar dirección para proteger a trabajadores (eliminar detalles muy específicos)
    sanitizarDireccion(direccion) {
        if (!direccion) return '';
        
        let sanitizada = direccion.trim();
        
        // Remover números de dirección específicos (ej: "1234", "567")
        sanitizada = sanitizada.replace(/\b\d{3,}\b/g, '');
        
        // Remover números de casa/departamento (ej: "dto 5", "casa 23")
        sanitizada = sanitizada.replace(/\b(dto|departamento|casa|apt|apartamento)\s*\d+/gi, '');
        
        // Remover referencias muy específicas (ej: "entre calles X e Y")
        sanitizada = sanitizada.replace(/\bentre\s+[^y]+\s+y\s+[^\s]+/gi, '');
        
        // Limpiar espacios múltiples
        sanitizada = sanitizada.replace(/\s+/g, ' ').trim();
        
        // Si queda muy corto o vacío después de limpiar, usar "zona general"
        if (sanitizada.length < 5) {
            return 'Zona general';
        }
        
        // Si la dirección es muy específica (muchas palabras), acortarla
        const palabras = sanitizada.split(/\s+/);
        if (palabras.length > 4) {
            // Tomar solo las primeras palabras y agregar "zona general"
            sanitizada = palabras.slice(0, 3).join(' ') + ' (zona general)';
        } else if (!sanitizada.toLowerCase().includes('zona') && !sanitizada.toLowerCase().includes('cerca')) {
            // Si no menciona "zona" o "cerca", agregar indicador de generalidad
            sanitizada = sanitizada + ' (zona)';
        }
        
        return sanitizada || 'Zona general';
    }
    
    // ===== CARGAR MI HISTORIAL =====
    async cargarMiHistorial() {
        if (!this.supabase || !this.usuarioHash) {
            const container = document.getElementById('mi-historial-lista');
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>No se pudo cargar tu historial. Por favor, recarga la página.</p>
                    </div>
                `;
            }
            return;
        }
        
        try {
            const { data, error } = await this.supabase
                .from('alertas_servicios_publicos')
                .select('*')
                .eq('reportado_por_hash', this.usuarioHash)
                .order('fecha_reporte', { ascending: false });
            
            if (error) throw error;
            
            this.mostrarMiHistorial(data || []);
        } catch (error) {
            console.error('Error cargando historial:', error);
            const container = document.getElementById('mi-historial-lista');
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error al cargar tu historial. Por favor, intenta nuevamente.</p>
                    </div>
                `;
            }
        }
    }
    
    // ===== MOSTRAR MI HISTORIAL =====
    mostrarMiHistorial(reportes) {
        const container = document.getElementById('mi-historial-lista');
        if (!container) return;
        
        // Agregar panel de insignias al inicio
        let htmlInsignias = '';
        if (window.sistemaInsignias && typeof window.sistemaInsignias.crearPanelInsignias === 'function') {
            htmlInsignias = window.sistemaInsignias.crearPanelInsignias();
        }
        
        if (!reportes || reportes.length === 0) {
            container.innerHTML = htmlInsignias + `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No has creado ningún reporte aún.</p>
                    <p style="margin-top: 10px; font-size: 0.9rem;">Puedes crear tu primer reporte en la pestaña "Reportar Corte".</p>
                </div>
            `;
            return;
        }
        
        const iconos = {
            'luz': '⚡',
            'agua': '💧',
            'gas': '🔥',
            'otro': '⚙️'
        };
        
        const estadosBadges = {
            'no-solucionado': '<span style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">❌ No Solucionado</span>',
            'en-curso': '<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">🔄 En Curso</span>',
            'resuelto': '<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">✅ Resuelto</span>',
            'cerrado': '<span style="background: #6b7280; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">🔒 Cerrado</span>'
        };
        
        container.innerHTML = htmlInsignias + reportes.map(reporte => {
            const fecha = new Date(reporte.fecha_reporte).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="service-card" style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <span style="background: #059669; color: white; padding: 6px 12px; border-radius: 8px; font-size: 0.9rem;">
                                ${iconos[reporte.tipo_servicio]} ${this.escapeHtml(reporte.tipo_servicio.charAt(0).toUpperCase() + reporte.tipo_servicio.slice(1))}
                            </span>
                            ${estadosBadges[reporte.estado] || estadosBadges['no-solucionado']}
                        </div>
                        <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <p style="color: #374151; font-weight: 600; margin-bottom: 5px;">
                            📍 ${this.escapeHtml(reporte.ciudad)}, ${this.escapeHtml(reporte.provincia)}
                        </p>
                        ${reporte.direccion ? `<p style="color: #6b7280; font-size: 0.9rem; margin: 0;">${this.escapeHtml(reporte.direccion)}</p>` : ''}
                    </div>
                    
                    <div style="background: #f9fafb; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <p style="color: #374151; margin: 0; line-height: 1.6;">${this.escapeHtml(reporte.descripcion)}</p>
                    </div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                        <button onclick="editarReporte(${reporte.id})" class="btn-primary" style="background: #8b5cf6; flex: 1; min-width: 100px;">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="pausarReporte(${reporte.id})" class="btn-primary" style="background: #f59e0b; flex: 1; min-width: 100px;">
                            <i class="fas fa-pause"></i> Pausar
                        </button>
                        <button onclick="eliminarReporte(${reporte.id})" class="btn-primary" style="background: #ef4444; flex: 1; min-width: 100px;">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // ===== BUSCAR POR ZONA =====
    async buscarPorZona(ciudad, provincia) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con la base de datos');
            return;
        }
        
        try {
            let query = this.supabase
                .from('alertas_servicios_publicos')
                .select('*')
                .in('estado', ['no-solucionado', 'en-curso', 'resuelto']);
            
            if (ciudad) {
                query = query.ilike('ciudad', `%${ciudad}%`);
            }
            if (provincia) {
                query = query.ilike('provincia', `%${provincia}%`);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            this.mostrarResultadosZona(data || [], ciudad, provincia);
        } catch (error) {
            console.error('Error buscando por zona:', error);
            this.mostrarError('Error al buscar en esta zona. Por favor, intenta nuevamente.');
        }
    }
    
    // ===== MOSTRAR RESULTADOS POR ZONA =====
    mostrarResultadosZona(reportes, ciudad, provincia) {
        const container = document.getElementById('resultados-zona');
        if (!container) return;
        
        if (!reportes || reportes.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>No se encontraron reportes en esta zona.</p>
                </div>
            `;
            return;
        }
        
        // Agrupar por ciudad/provincia
        const agrupados = {};
        reportes.forEach(r => {
            const clave = `${r.ciudad}, ${r.provincia}`;
            if (!agrupados[clave]) {
                agrupados[clave] = {
                    ciudad: r.ciudad,
                    provincia: r.provincia,
                    reportes: [],
                    estadisticas: {
                        total: 0,
                        noSolucionado: 0,
                        enCurso: 0,
                        resuelto: 0
                    }
                };
            }
            agrupados[clave].reportes.push(r);
            agrupados[clave].estadisticas.total++;
            agrupados[clave].estadisticas[r.estado] = (agrupados[clave].estadisticas[r.estado] || 0) + 1;
        });
        
        container.innerHTML = Object.values(agrupados).map(grupo => {
            const frecuencia = grupo.estadisticas.total;
            const frecuenciaTexto = frecuencia === 1 ? '1 reporte' : `${frecuencia} reportes`;
            
            return `
                <div class="service-card" style="margin-bottom: 20px;">
                    <h3 style="color: #374151; margin-bottom: 15px;">
                        📍 ${this.escapeHtml(grupo.ciudad)}, ${this.escapeHtml(grupo.provincia)}
                    </h3>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; font-weight: bold; color: #059669;">${grupo.estadisticas.total}</div>
                                <div style="font-size: 0.85rem; color: #6b7280;">Total: ${frecuenciaTexto}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #ef4444;">${grupo.estadisticas.noSolucionado || 0}</div>
                                <div style="font-size: 0.85rem; color: #6b7280;">❌ No Solucionado</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #f59e0b;">${grupo.estadisticas.enCurso || 0}</div>
                                <div style="font-size: 0.85rem; color: #6b7280;">🔄 En Curso</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: #10b981;">${grupo.estadisticas.resuelto || 0}</div>
                                <div style="font-size: 0.85rem; color: #6b7280;">✅ Resuelto</div>
                            </div>
                        </div>
                    </div>
                    
                    <details style="margin-top: 15px;">
                        <summary style="cursor: pointer; color: #059669; font-weight: 600; padding: 10px; background: #f0fdf4; border-radius: 8px;">
                            Ver reportes de esta zona (${grupo.reportes.length})
                        </summary>
                        <div style="margin-top: 15px;">
                            ${grupo.reportes.map(r => {
                                const fecha = new Date(r.fecha_reporte).toLocaleString('es-AR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                                
                                const estadoBadge = {
                                    'no-solucionado': '<span style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">❌ No Solucionado</span>',
                                    'en-curso': '<span style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">🔄 En Curso</span>',
                                    'resuelto': '<span style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">✅ Resuelto</span>'
                                }[r.estado] || '';
                                
                                return `
                                    <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid #059669;">
                                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
                                            <span style="color: #6b7280; font-size: 0.85rem;">${fecha}</span>
                                            ${estadoBadge}
                                        </div>
                                        <p style="color: #374151; margin: 0; font-size: 0.9rem; line-height: 1.5;">${this.escapeHtml(r.descripcion)}</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </details>
                </div>
            `;
        }).join('');
    }
    
    // ===== EDITAR REPORTE =====
    async editarReporte(reporteId) {
        // Implementar modal de edición
        alert('💡 La funcionalidad de editar reportes estará disponible próximamente. Gracias por tu paciencia.');
    }
    
    // ===== PAUSAR REPORTE =====
    async pausarReporte(reporteId) {
        if (!confirm('¿Deseas pausar este reporte? Podrás reactivarlo después desde tu historial.')) {
            return;
        }
        
        if (!this.supabase) {
            this.mostrarError('No hay conexión con la base de datos');
            return;
        }
        
        try {
            const { error } = await this.supabase
                .from('alertas_servicios_publicos')
                .update({ estado: 'cerrado' })
                .eq('id', reporteId)
                .eq('reportado_por_hash', this.usuarioHash);
            
            if (error) throw error;
            
            this.mostrarExito('✅ Reporte pausado correctamente.');
            await this.cargarMiHistorial();
            await this.cargarReportes();
        } catch (error) {
            console.error('Error pausando reporte:', error);
            this.mostrarError('Error al pausar el reporte. Por favor, intenta nuevamente.');
        }
    }
    
    // ===== ELIMINAR REPORTE =====
    async eliminarReporte(reporteId) {
        if (!confirm('¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.')) {
            return;
        }
        
        if (!this.supabase) {
            this.mostrarError('No hay conexión con la base de datos');
            return;
        }
        
        try {
            const { error } = await this.supabase
                .from('alertas_servicios_publicos')
                .delete()
                .eq('id', reporteId)
                .eq('reportado_por_hash', this.usuarioHash);
            
            if (error) throw error;
            
            this.mostrarExito('✅ Reporte eliminado correctamente.');
            await this.cargarMiHistorial();
            await this.cargarReportes();
        } catch (error) {
            console.error('Error eliminando reporte:', error);
            this.mostrarError('Error al eliminar el reporte. Por favor, intenta nuevamente.');
        }
    }
}

// Funciones globales
window.ofrecerAyudaTrabajadores = function(trabajadorId) {
    if (window.comunidadAlertasServicios) {
        alert('💜 Gracias por tu solidaridad. Próximamente podrás coordinar el apoyo solidario de forma voluntaria. Todo es opcional y sin obligación.');
    }
};

window.editarReporte = function(reporteId) {
    if (window.comunidadAlertasServicios) {
        window.comunidadAlertasServicios.editarReporte(reporteId);
    }
};

window.pausarReporte = function(reporteId) {
    if (window.comunidadAlertasServicios) {
        window.comunidadAlertasServicios.pausarReporte(reporteId);
    }
};

window.eliminarReporte = function(reporteId) {
    if (window.comunidadAlertasServicios) {
        window.comunidadAlertasServicios.eliminarReporte(reporteId);
    }
};

window.buscarPorZona = function() {
    if (window.comunidadAlertasServicios) {
        const ciudad = document.getElementById('buscar-ciudad')?.value || '';
        const provincia = document.getElementById('buscar-provincia')?.value || '';
        window.comunidadAlertasServicios.buscarPorZona(ciudad, provincia);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.comunidadAlertasServicios = new ComunidadAlertasServiciosPublicos();
});

// Función global para recargar reportes
window.cargarReportes = function() {
    if (window.comunidadAlertasServicios) {
        window.comunidadAlertasServicios.cargarReportes();
    }
};

