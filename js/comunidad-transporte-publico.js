// ===== COMUNIDAD: TRANSPORTE PÚBLICO =====
// Alertas sobre colectivos, trenes, subtes, aumentos, cambios de recorridos, cortes, tardanzas
// Co-fundadores: Carla & Claude

class ComunidadTransportePublico {
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
                    console.log('✅ Transporte Público: Supabase inicializado');
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
        await this.cargarAlertas();
        await this.cargarEstadisticas();
        await this.cargarProvincias();
        
        // Configurar formulario
        this.configurarFormulario();
    }
    
    generarHashUsuario() {
        let hash = localStorage.getItem('cresalia_transporte_hash');
        if (!hash) {
            const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
            hash = btoa(random).substring(0, 32);
            localStorage.setItem('cresalia_transporte_hash', hash);
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
                    } else if (tabId === 'estadisticas') {
                        this.cargarEstadisticas();
                    }
                }
            });
        });
    }
    
    // ===== CARGAR ALERTAS =====
    async cargarAlertas() {
        const tipo = document.getElementById('filtro-tipo')?.value || '';
        const transporte = document.getElementById('filtro-transporte')?.value || '';
        const provincia = document.getElementById('filtro-provincia')?.value || '';
        
        try {
            let alertas = [];
            
            if (this.supabase) {
                // Cargar desde Supabase
                let query = this.supabase
                    .from('alertas_transporte_publico')
                    .select('*')
                    .in('estado', ['activa', 'resuelta'])
                    .order('fecha_reporte', { ascending: false })
                    .limit(100);
                
                if (tipo) query = query.eq('tipo_alerta', tipo);
                if (transporte) query = query.eq('medio_transporte', transporte);
                if (provincia) query = query.eq('provincia', provincia);
                
                const { data, error } = await query;
                if (error) throw error;
                alertas = data || [];
            } else {
                // Modo local - cargar desde localStorage
                const alertasKey = 'alertas_transporte_publico';
                const alertasGuardadas = localStorage.getItem(alertasKey);
                
                if (alertasGuardadas) {
                    alertas = JSON.parse(alertasGuardadas)
                        .filter(a => a.estado === 'activa' || a.estado === 'resuelta')
                        .sort((a, b) => new Date(b.fecha_reporte || b.created_at) - new Date(a.fecha_reporte || a.created_at));
                    
                    // Aplicar filtros
                    if (tipo) alertas = alertas.filter(a => a.tipo_alerta === tipo);
                    if (transporte) alertas = alertas.filter(a => a.medio_transporte === transporte);
                    if (provincia) alertas = alertas.filter(a => a.provincia === provincia);
                }
            }
            
            this.mostrarAlertas(alertas);
        } catch (error) {
            console.error('Error cargando alertas:', error);
            this.mostrarError('Error al cargar alertas. Por favor, intenta nuevamente.');
        }
    }
    
    mostrarAlertas(alertas) {
        const container = document.getElementById('alertas-lista');
        if (!container) return;
        
        if (!alertas || alertas.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-info-circle"></i>
                    <p>No hay alertas en este momento.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = alertas.map(a => {
            const iconos = {
                'aumento': '💰',
                'cambio-recorrido': '🔄',
                'corte': '🚫',
                'tardanza': '⏰',
                'ruta-no-funciona': '❌',
                'otro': 'ℹ️'
            };
            
            const transportes = {
                'colectivo': '🚌',
                'tren': '🚂',
                'subte': '🚇',
                'trolebus': '🚎',
                'otro': '🚗'
            };
            
            const fecha = new Date(a.fecha_reporte || a.created_at).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const esMio = a.reportado_por_hash === this.usuarioHash;
            
            return `
                <div class="alert-card" data-id="${a.id}">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; flex-wrap: wrap;">
                        <div>
                            <span class="badge-alert badge-${a.tipo_alerta || 'otro'}">
                                ${iconos[a.tipo_alerta] || 'ℹ️'} ${this.escapeHtml((a.tipo_alerta || 'otro').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))}
                            </span>
                            <span class="badge-alert" style="background: #3b82f6; color: white;">
                                ${transportes[a.medio_transporte] || '🚗'} ${this.escapeHtml((a.medio_transporte || 'otro').charAt(0).toUpperCase() + (a.medio_transporte || 'otro').slice(1))}
                            </span>
                            ${a.estado === 'resuelta' ? '<span class="badge-resuelto">✅ Resuelta</span>' : ''}
                            ${a.verificado ? '<span class="badge-verificado">✓ Verificado</span>' : ''}
                        </div>
                        <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                    </div>
                    
                    ${a.linea_ruta ? `
                        <div style="margin-bottom: 10px;">
                            <p style="color: #374151; font-weight: 600; margin: 0;">
                                <i class="fas fa-route"></i> ${this.escapeHtml(a.linea_ruta)}
                            </p>
                        </div>
                    ` : ''}
                    
                    <div style="margin-bottom: 15px;">
                        <p style="color: #374151; font-weight: 600; margin-bottom: 5px;">
                            📍 ${this.escapeHtml(a.ciudad || '')}, ${this.escapeHtml(a.provincia || '')}
                        </p>
                        ${a.direccion ? `
                            <p style="color: #6b7280; font-size: 0.9rem; margin: 0;">
                                <i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(a.direccion)}
                            </p>
                        ` : ''}
                    </div>
                    
                    <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
                        <p style="color: #374151; margin: 0; line-height: 1.6;">${this.escapeHtml(a.descripcion || a.contenido || '')}</p>
                    </div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                        ${esMio ? `
                            <button onclick="editarAlertaTransporte(${a.id})" class="btn-secondary" style="font-size: 0.85rem; padding: 6px 12px;">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button onclick="borrarAlertaTransporte(${a.id})" class="btn-danger" style="font-size: 0.85rem; padding: 6px 12px;">
                                <i class="fas fa-trash"></i> Borrar
                            </button>
                        ` : ''}
                        
                        ${a.estado !== 'resuelta' ? `
                            <button onclick="marcarComoResuelta(${a.id})" class="btn-success" style="font-size: 0.85rem; padding: 6px 12px;">
                                <i class="fas fa-check"></i> Marcar como Resuelta
                            </button>
                        ` : `
                            <span style="color: #10b981; font-weight: 600; font-size: 0.9rem;">
                                <i class="fas fa-check-circle"></i> Ya está funcionando
                            </span>
                        `}
                        
                        <button onclick="verificarAlerta(${a.id})" class="btn-secondary" style="font-size: 0.85rem; padding: 6px 12px; background: #8b5cf6; color: white;">
                            <i class="fas fa-check-double"></i> Verificar
                        </button>
                        
                        ${a.ciudad && a.provincia ? `
                            <div style="margin-left: auto;">
                                <a href="https://moovitapp.com/?q=${encodeURIComponent(a.ciudad + ', ' + a.provincia)}" target="_blank" class="sugerencia-link" style="font-size: 0.85rem; padding: 6px 12px;">
                                    <i class="fas fa-external-link-alt"></i> Buscar en Moovit
                                </a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // ===== ACTUALIZAR ESTADO DE ALERTA =====
    async actualizarEstadoAlerta(alertaId, nuevoEstado) {
        if (!this.supabase) {
            // Modo local
            const alertasKey = 'alertas_transporte_publico';
            const alertas = JSON.parse(localStorage.getItem(alertasKey) || '[]');
            const alerta = alertas.find(a => a.id == alertaId);
            if (alerta) {
                alerta.estado = nuevoEstado;
                alerta.fecha_resolucion = nuevoEstado === 'resuelta' ? new Date().toISOString() : null;
                localStorage.setItem(alertasKey, JSON.stringify(alertas));
                this.mostrarExito('✅ Estado de la alerta actualizado correctamente.');
                await this.cargarAlertas();
            }
            return;
        }
        
        try {
            const { error } = await this.supabase
                .from('alertas_transporte_publico')
                .update({ 
                    estado: nuevoEstado,
                    fecha_resolucion: nuevoEstado === 'resuelta' ? new Date().toISOString() : null
                })
                .eq('id', alertaId);
            
            if (error) throw error;
            
            // Registrar resolución en sistema de insignias
            if (nuevoEstado === 'resuelta' && window.sistemaInsignias && typeof window.sistemaInsignias.registrarResolucion === 'function') {
                window.sistemaInsignias.registrarResolucion('transporte');
            }
            
            this.mostrarExito('✅ Estado de la alerta actualizado correctamente.');
            await this.cargarAlertas();
            await this.cargarEstadisticas();
        } catch (error) {
            console.error('Error actualizando estado:', error);
            this.mostrarError('Error al actualizar el estado. Por favor, intenta nuevamente.');
        }
    }
    
    // ===== VERIFICAR ALERTA =====
    async verificarAlerta(alertaId) {
        if (!this.supabase) {
            // Modo local
            const alertasKey = 'alertas_transporte_publico';
            const alertas = JSON.parse(localStorage.getItem(alertasKey) || '[]');
            const alerta = alertas.find(a => a.id == alertaId);
            if (alerta) {
                alerta.verificado = !alerta.verificado;
                alerta.verificaciones = (alerta.verificaciones || 0) + 1;
                localStorage.setItem(alertasKey, JSON.stringify(alertas));
                this.mostrarExito('✅ Alerta verificada.');
                await this.cargarAlertas();
            }
            return;
        }
        
        try {
            // Obtener alerta actual
            const { data: alerta, error: fetchError } = await this.supabase
                .from('alertas_transporte_publico')
                .select('verificaciones')
                .eq('id', alertaId)
                .single();
            
            if (fetchError) throw fetchError;
            
            // Incrementar verificaciones
            const { error } = await this.supabase
                .from('alertas_transporte_publico')
                .update({ 
                    verificaciones: (alerta.verificaciones || 0) + 1,
                    verificado: (alerta.verificaciones || 0) >= 2 // Verificado si tiene 2+ verificaciones
                })
                .eq('id', alertaId);
            
            if (error) throw error;
            
            // Registrar verificación en sistema de insignias
            if (window.sistemaInsignias && typeof window.sistemaInsignias.registrarVerificacion === 'function') {
                window.sistemaInsignias.registrarVerificacion('transporte');
            }
            
            this.mostrarExito('✅ Alerta verificada. Gracias por ayudar a la comunidad.');
            await this.cargarAlertas();
        } catch (error) {
            console.error('Error verificando alerta:', error);
            this.mostrarError('Error al verificar la alerta. Por favor, intenta nuevamente.');
        }
    }
    
    // ===== CARGAR ESTADÍSTICAS =====
    async cargarEstadisticas() {
        try {
            let alertas = [];
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('alertas_transporte_publico')
                    .select('*')
                    .in('estado', ['activa', 'resuelta']);
                
                if (error) throw error;
                alertas = data || [];
            } else {
                const alertasKey = 'alertas_transporte_publico';
                const alertasGuardadas = localStorage.getItem(alertasKey);
                if (alertasGuardadas) {
                    alertas = JSON.parse(alertasGuardadas)
                        .filter(a => a.estado === 'activa' || a.estado === 'resuelta');
                }
            }
            
            const hoy = new Date().toDateString();
            const alertasHoy = alertas.filter(a => {
                const fecha = new Date(a.fecha_reporte || a.created_at);
                return fecha.toDateString() === hoy;
            });
            
            // Calcular zona más afectada
            const zonas = {};
            alertas.forEach(a => {
                const zona = `${a.ciudad || ''}, ${a.provincia || ''}`;
                if (zona.trim() !== ',') {
                    zonas[zona] = (zonas[zona] || 0) + 1;
                }
            });
            const zonaMasAfectada = Object.entries(zonas).sort((a, b) => b[1] - a[1])[0]?.[0]?.split(',')[0] || 'N/A';
            
            // Calcular transporte más reportado
            const transportes = {};
            alertas.forEach(a => {
                if (a.medio_transporte) {
                    transportes[a.medio_transporte] = (transportes[a.medio_transporte] || 0) + 1;
                }
            });
            const transporteMasReportado = Object.entries(transportes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
            
            document.getElementById('total-alertas').textContent = alertas.length;
            document.getElementById('alertas-hoy').textContent = alertasHoy.length;
            document.getElementById('zona-mas-afectada').textContent = zonaMasAfectada;
            document.getElementById('transporte-mas-reportado').textContent = transporteMasReportado.charAt(0).toUpperCase() + transporteMasReportado.slice(1);
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    }
    
    // ===== CARGAR PROVINCIAS =====
    async cargarProvincias() {
        try {
            let alertas = [];
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('alertas_transporte_publico')
                    .select('provincia')
                    .in('estado', ['activa', 'resuelta']);
                
                if (error) throw error;
                alertas = data || [];
            } else {
                const alertasKey = 'alertas_transporte_publico';
                const alertasGuardadas = localStorage.getItem(alertasKey);
                if (alertasGuardadas) {
                    alertas = JSON.parse(alertasGuardadas)
                        .filter(a => a.estado === 'activa' || a.estado === 'resuelta');
                }
            }
            
            const provinciasUnicas = [...new Set(alertas.map(a => a.provincia).filter(Boolean))].sort();
            
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
        const form = document.getElementById('form-reportar-alerta');
        if (!form) return;
        
        // Cargar email guardado si existe
        const emailGuardado = localStorage.getItem('cresalia_user_email') || localStorage.getItem('cresalia_transporte_email');
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
                localStorage.setItem('cresalia_transporte_email', email);
                
                // Actualizar email en sistema de notificaciones
                if (window.notificacionesTransporte) {
                    window.notificacionesTransporte.emailUsuario = email;
                }
            }
            
            const datos = {
                tipo_alerta: document.getElementById('tipo-alerta').value,
                medio_transporte: document.getElementById('medio-transporte').value,
                linea_ruta: document.getElementById('linea-ruta').value || null,
                ciudad: document.getElementById('ciudad').value,
                provincia: document.getElementById('provincia').value,
                direccion: document.getElementById('direccion').value || null,
                descripcion: document.getElementById('descripcion').value,
                reportado_por_hash: this.usuarioHash
            };
            
            try {
                const resultado = await this.reportarAlerta(datos);
                form.reset();
                
                // Restaurar email guardado
                if (emailInput && emailGuardado) {
                    emailInput.value = emailGuardado;
                }
                
                // Registrar en sistema de insignias
                if (window.sistemaInsignias && typeof window.sistemaInsignias.registrarReporte === 'function') {
                    window.sistemaInsignias.registrarReporte('transporte', resultado.id);
                }
                
                this.mostrarExito('✅ Alerta enviada correctamente. Gracias por ayudar a la comunidad.');
                await this.cargarAlertas();
                await this.cargarEstadisticas();
            } catch (error) {
                console.error('Error reportando alerta:', error);
                this.mostrarError('Error al enviar alerta: ' + error.message);
            }
        });
    }
    
    // ===== REPORTAR ALERTA =====
    async reportarAlerta(datos) {
        try {
            // Intentar obtener coordenadas si hay ubicación disponible
            let latitud = null;
            let longitud = null;
            
            if ('geolocation' in navigator) {
                try {
                    const position = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: false,
                            timeout: 5000,
                            maximumAge: 300000
                        });
                    });
                    latitud = position.coords.latitude;
                    longitud = position.coords.longitude;
                } catch (error) {
                    // Ignorar error, usar solo ciudad/provincia
                }
            }
            
            const alertaData = {
                tipo_alerta: datos.tipo_alerta,
                medio_transporte: datos.medio_transporte,
                linea_ruta: datos.linea_ruta,
                ciudad: datos.ciudad,
                provincia: datos.provincia,
                direccion: datos.direccion,
                descripcion: datos.descripcion,
                reportado_por_hash: datos.reportado_por_hash,
                estado: 'activa',
                verificado: false,
                verificaciones: 0,
                latitud: latitud,
                longitud: longitud
            };
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('alertas_transporte_publico')
                    .insert([alertaData])
                    .select();
                
                if (error) throw error;
                
                // Notificar a usuarios cercanos
                if (window.notificacionesTransporte) {
                    setTimeout(() => {
                        window.notificacionesTransporte.verificarAlertaEspecifica(data[0]);
                    }, 1000);
                }
                
                return data[0];
            } else {
                // Modo local
                const alertasKey = 'alertas_transporte_publico';
                const alertas = JSON.parse(localStorage.getItem(alertasKey) || '[]');
                const nuevaAlerta = {
                    id: 'local_' + Date.now(),
                    ...alertaData,
                    fecha_reporte: new Date().toISOString(),
                    created_at: new Date().toISOString()
                };
                alertas.unshift(nuevaAlerta);
                localStorage.setItem(alertasKey, JSON.stringify(alertas));
                
                // Notificar a usuarios cercanos
                if (window.notificacionesTransporte) {
                    setTimeout(() => {
                        window.notificacionesTransporte.verificarAlertaEspecifica(nuevaAlerta);
                    }, 1000);
                }
                
                return nuevaAlerta;
            }
        } catch (error) {
            console.error('Error reportando alerta:', error);
            throw error;
        }
    }
    
    // ===== BUSCAR POR ZONA =====
    async buscarPorZona() {
        const ciudad = document.getElementById('buscar-ciudad')?.value.trim() || '';
        const provincia = document.getElementById('buscar-provincia')?.value.trim() || '';
        
        if (!ciudad && !provincia) {
            this.mostrarError('Por favor, ingresá al menos una ciudad o provincia.');
            return;
        }
        
        try {
            let alertas = [];
            
            if (this.supabase) {
                let query = this.supabase
                    .from('alertas_transporte_publico')
                    .select('*')
                    .in('estado', ['activa', 'resuelta'])
                    .order('fecha_reporte', { ascending: false });
                
                if (ciudad) query = query.ilike('ciudad', `%${ciudad}%`);
                if (provincia) query = query.ilike('provincia', `%${provincia}%`);
                
                const { data, error } = await query;
                if (error) throw error;
                alertas = data || [];
            } else {
                const alertasKey = 'alertas_transporte_publico';
                const alertasGuardadas = localStorage.getItem(alertasKey);
                if (alertasGuardadas) {
                    alertas = JSON.parse(alertasGuardadas)
                        .filter(a => {
                            if (a.estado !== 'activa' && a.estado !== 'resuelta') return false;
                            if (ciudad && !a.ciudad?.toLowerCase().includes(ciudad.toLowerCase())) return false;
                            if (provincia && !a.provincia?.toLowerCase().includes(provincia.toLowerCase())) return false;
                            return true;
                        })
                        .sort((a, b) => new Date(b.fecha_reporte || b.created_at) - new Date(a.fecha_reporte || a.created_at));
                }
            }
            
            this.mostrarResultadosBusqueda(alertas, ciudad, provincia);
        } catch (error) {
            console.error('Error buscando por zona:', error);
            this.mostrarError('Error al buscar. Por favor, intenta nuevamente.');
        }
    }
    
    mostrarResultadosBusqueda(alertas, ciudad, provincia) {
        const container = document.getElementById('resultados-zona');
        if (!container) return;
        
        if (!alertas || alertas.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>No se encontraron alertas para "${ciudad || provincia}".</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #374151;">Resultados: ${alertas.length} alerta(s) encontrada(s)</h3>
            </div>
            ${this.mostrarAlertasHTML(alertas)}
        `;
    }
    
    mostrarAlertasHTML(alertas) {
        return alertas.map(a => {
            const iconos = {
                'aumento': '💰',
                'cambio-recorrido': '🔄',
                'corte': '🚫',
                'tardanza': '⏰',
                'ruta-no-funciona': '❌',
                'otro': 'ℹ️'
            };
            
            const transportes = {
                'colectivo': '🚌',
                'tren': '🚂',
                'subte': '🚇',
                'trolebus': '🚎',
                'otro': '🚗'
            };
            
            const fecha = new Date(a.fecha_reporte || a.created_at).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="alert-card" style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div>
                            <span class="badge-alert badge-${a.tipo_alerta || 'otro'}">
                                ${iconos[a.tipo_alerta] || 'ℹ️'} ${this.escapeHtml((a.tipo_alerta || 'otro').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))}
                            </span>
                            <span class="badge-alert" style="background: #3b82f6; color: white;">
                                ${transportes[a.medio_transporte] || '🚗'} ${this.escapeHtml((a.medio_transporte || 'otro').charAt(0).toUpperCase() + (a.medio_transporte || 'otro').slice(1))}
                            </span>
                            ${a.estado === 'resuelta' ? '<span class="badge-resuelto">✅ Resuelta</span>' : ''}
                        </div>
                        <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                    </div>
                    ${a.linea_ruta ? `<p style="color: #374151; font-weight: 600; margin-bottom: 10px;"><i class="fas fa-route"></i> ${this.escapeHtml(a.linea_ruta)}</p>` : ''}
                    <p style="color: #374151; margin-bottom: 10px;"><i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(a.ciudad || '')}, ${this.escapeHtml(a.provincia || '')}</p>
                    <p style="color: #4B5563; line-height: 1.6;">${this.escapeHtml(a.descripcion || a.contenido || '')}</p>
                </div>
            `;
        }).join('');
    }
    
    // ===== BUSCAR PARA RESOLVER =====
    async buscarParaResolver() {
        const linea = document.getElementById('buscar-resolver-linea')?.value.trim() || '';
        const zona = document.getElementById('buscar-resolver-zona')?.value.trim() || '';
        
        if (!linea && !zona) {
            this.mostrarError('Por favor, ingresá al menos una línea o zona.');
            return;
        }
        
        try {
            let alertas = [];
            
            if (this.supabase) {
                let query = this.supabase
                    .from('alertas_transporte_publico')
                    .select('*')
                    .eq('estado', 'activa')
                    .order('fecha_reporte', { ascending: false });
                
                if (linea) query = query.ilike('linea_ruta', `%${linea}%`);
                if (zona) {
                    query = query.or(`ciudad.ilike.%${zona}%,provincia.ilike.%${zona}%`);
                }
                
                const { data, error } = await query;
                if (error) throw error;
                alertas = data || [];
            } else {
                const alertasKey = 'alertas_transporte_publico';
                const alertasGuardadas = localStorage.getItem(alertasKey);
                if (alertasGuardadas) {
                    alertas = JSON.parse(alertasGuardadas)
                        .filter(a => {
                            if (a.estado !== 'activa') return false;
                            if (linea && !a.linea_ruta?.toLowerCase().includes(linea.toLowerCase())) return false;
                            if (zona && !a.ciudad?.toLowerCase().includes(zona.toLowerCase()) && !a.provincia?.toLowerCase().includes(zona.toLowerCase())) return false;
                            return true;
                        })
                        .sort((a, b) => new Date(b.fecha_reporte || b.created_at) - new Date(a.fecha_reporte || a.created_at));
                }
            }
            
            this.mostrarResultadosResolver(alertas);
        } catch (error) {
            console.error('Error buscando para resolver:', error);
            this.mostrarError('Error al buscar. Por favor, intenta nuevamente.');
        }
    }
    
    mostrarResultadosResolver(alertas) {
        const container = document.getElementById('resultados-resolver');
        if (!container) return;
        
        if (!alertas || alertas.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>No se encontraron alertas activas para marcar como resueltas.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #374151;">Seleccioná la alerta que querés marcar como resuelta:</h3>
            </div>
            ${alertas.map(a => {
                const fecha = new Date(a.fecha_reporte || a.created_at).toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                return `
                    <div class="alert-card" style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                            <div>
                                <p style="color: #374151; font-weight: 600; margin: 0;">
                                    ${a.linea_ruta ? `<i class="fas fa-route"></i> ${this.escapeHtml(a.linea_ruta)}` : 'Sin línea especificada'}
                                </p>
                                <p style="color: #6b7280; font-size: 0.9rem; margin: 5px 0 0 0;">
                                    <i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(a.ciudad || '')}, ${this.escapeHtml(a.provincia || '')}
                                </p>
                            </div>
                            <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                        </div>
                        <p style="color: #4B5563; line-height: 1.6; margin-bottom: 15px;">${this.escapeHtml(a.descripcion || a.contenido || '')}</p>
                        <button onclick="marcarComoResuelta(${a.id})" class="btn-success" style="width: 100%;">
                            <i class="fas fa-check"></i> Marcar como Resuelta / Ya está Funcionando
                        </button>
                    </div>
                `;
            }).join('')}
        `;
    }
    
    // ===== CARGAR MI HISTORIAL =====
    async cargarMiHistorial() {
        try {
            let alertas = [];
            
            if (this.supabase && this.usuarioHash) {
                const { data, error } = await this.supabase
                    .from('alertas_transporte_publico')
                    .select('*')
                    .eq('reportado_por_hash', this.usuarioHash)
                    .order('fecha_reporte', { ascending: false });
                
                if (error) throw error;
                alertas = data || [];
            } else {
                // Modo local
                const alertasKey = 'alertas_transporte_publico';
                const alertasGuardadas = localStorage.getItem(alertasKey);
                if (alertasGuardadas) {
                    alertas = JSON.parse(alertasGuardadas)
                        .filter(a => a.reportado_por_hash === this.usuarioHash)
                        .sort((a, b) => new Date(b.fecha_reporte || b.created_at) - new Date(a.fecha_reporte || a.created_at));
                }
            }
            
            this.mostrarMiHistorial(alertas);
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
    
    mostrarMiHistorial(alertas) {
        const container = document.getElementById('mi-historial-lista');
        if (!container) return;
        
        // Agregar panel de insignias al inicio
        let htmlInsignias = '';
        if (window.sistemaInsignias && typeof window.sistemaInsignias.crearPanelInsignias === 'function') {
            htmlInsignias = window.sistemaInsignias.crearPanelInsignias();
        }
        
        if (!alertas || alertas.length === 0) {
            container.innerHTML = htmlInsignias + `
                <div class="empty-state">
                    <i class="fas fa-info-circle"></i>
                    <p>No has reportado ninguna alerta aún.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = htmlInsignias + alertas.map(a => {
            const fecha = new Date(a.fecha_reporte || a.created_at).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="alert-card" style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div>
                            <span class="badge-alert badge-${a.tipo_alerta || 'otro'}">
                                ${this.escapeHtml((a.tipo_alerta || 'otro').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()))}
                            </span>
                            ${a.estado === 'resuelta' ? '<span class="badge-resuelto">✅ Resuelta</span>' : '<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem;">Activa</span>'}
                        </div>
                        <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                    </div>
                    ${a.linea_ruta ? `<p style="color: #374151; font-weight: 600; margin-bottom: 10px;"><i class="fas fa-route"></i> ${this.escapeHtml(a.linea_ruta)}</p>` : ''}
                    <p style="color: #374151; margin-bottom: 10px;"><i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(a.ciudad || '')}, ${this.escapeHtml(a.provincia || '')}</p>
                    <p style="color: #4B5563; line-height: 1.6; margin-bottom: 15px;">${this.escapeHtml(a.descripcion || a.contenido || '')}</p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button onclick="editarAlertaTransporte(${a.id})" class="btn-secondary">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="borrarAlertaTransporte(${a.id})" class="btn-danger">
                            <i class="fas fa-trash"></i> Borrar
                        </button>
                        ${a.estado !== 'resuelta' ? `
                            <button onclick="marcarComoResuelta(${a.id})" class="btn-success">
                                <i class="fas fa-check"></i> Marcar como Resuelta
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // ===== EDITAR ALERTA =====
    async editarAlerta(alertaId) {
        try {
            let alerta = null;
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('alertas_transporte_publico')
                    .select('*')
                    .eq('id', alertaId)
                    .single();
                
                if (error) throw error;
                alerta = data;
            } else {
                const alertasKey = 'alertas_transporte_publico';
                const alertas = JSON.parse(localStorage.getItem(alertasKey) || '[]');
                alerta = alertas.find(a => a.id == alertaId);
            }
            
            if (!alerta) {
                this.mostrarError('Alerta no encontrada.');
                return;
            }
            
            // Verificar que sea del usuario
            if (alerta.reportado_por_hash !== this.usuarioHash) {
                this.mostrarError('Solo podés editar tus propias alertas.');
                return;
            }
            
            // Mostrar modal de edición
            this.mostrarModalEdicion(alerta);
        } catch (error) {
            console.error('Error editando alerta:', error);
            this.mostrarError('Error al editar la alerta. Por favor, intenta nuevamente.');
        }
    }
    
    mostrarModalEdicion(alerta) {
        // Crear modal de edición
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>✏️ Editar Alerta</h3>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="form-editar-alerta">
                        <div class="form-group">
                            <label>Tipo de Alerta</label>
                            <select id="edit-tipo-alerta">
                                <option value="aumento" ${alerta.tipo_alerta === 'aumento' ? 'selected' : ''}>💰 Aumento de Tarifa</option>
                                <option value="cambio-recorrido" ${alerta.tipo_alerta === 'cambio-recorrido' ? 'selected' : ''}>🔄 Cambio de Recorrido</option>
                                <option value="corte" ${alerta.tipo_alerta === 'corte' ? 'selected' : ''}>🚫 Corte de Servicio</option>
                                <option value="tardanza" ${alerta.tipo_alerta === 'tardanza' ? 'selected' : ''}>⏰ Tardanza / Demora</option>
                                <option value="ruta-no-funciona" ${alerta.tipo_alerta === 'ruta-no-funciona' ? 'selected' : ''}>❌ Ruta No Funciona</option>
                                <option value="otro" ${alerta.tipo_alerta === 'otro' ? 'selected' : ''}>ℹ️ Otro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Medio de Transporte</label>
                            <select id="edit-medio-transporte">
                                <option value="colectivo" ${alerta.medio_transporte === 'colectivo' ? 'selected' : ''}>🚌 Colectivo</option>
                                <option value="tren" ${alerta.medio_transporte === 'tren' ? 'selected' : ''}>🚂 Tren</option>
                                <option value="subte" ${alerta.medio_transporte === 'subte' ? 'selected' : ''}>🚇 Subte / Metro</option>
                                <option value="trolebus" ${alerta.medio_transporte === 'trolebus' ? 'selected' : ''}>🚎 Trolebús</option>
                                <option value="otro" ${alerta.medio_transporte === 'otro' ? 'selected' : ''}>🚗 Otro</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Línea / Ruta</label>
                            <input type="text" id="edit-linea-ruta" value="${this.escapeHtml(alerta.linea_ruta || '')}" placeholder="Ej: Línea 60">
                        </div>
                        <div class="form-group">
                            <label>Ciudad</label>
                            <input type="text" id="edit-ciudad" value="${this.escapeHtml(alerta.ciudad || '')}" required>
                        </div>
                        <div class="form-group">
                            <label>Provincia</label>
                            <input type="text" id="edit-provincia" value="${this.escapeHtml(alerta.provincia || '')}" required>
                        </div>
                        <div class="form-group">
                            <label>Zona específica (opcional)</label>
                            <input type="text" id="edit-direccion" value="${this.escapeHtml(alerta.direccion || '')}" placeholder="Estación o zona">
                        </div>
                        <div class="form-group">
                            <label>Descripción</label>
                            <textarea id="edit-descripcion" rows="4" required>${this.escapeHtml(alerta.descripcion || alerta.contenido || '')}</textarea>
                        </div>
                        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                            <button type="submit" class="btn-primary">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Configurar submit
        document.getElementById('form-editar-alerta').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.guardarEdicion(alerta.id);
            modal.remove();
        });
    }
    
    async guardarEdicion(alertaId) {
        const datos = {
            tipo_alerta: document.getElementById('edit-tipo-alerta').value,
            medio_transporte: document.getElementById('edit-medio-transporte').value,
            linea_ruta: document.getElementById('edit-linea-ruta').value || null,
            ciudad: document.getElementById('edit-ciudad').value,
            provincia: document.getElementById('edit-provincia').value,
            direccion: document.getElementById('edit-direccion').value || null,
            descripcion: document.getElementById('edit-descripcion').value
        };
        
        try {
            if (this.supabase) {
                const { error } = await this.supabase
                    .from('alertas_transporte_publico')
                    .update(datos)
                    .eq('id', alertaId)
                    .eq('reportado_por_hash', this.usuarioHash);
                
                if (error) throw error;
            } else {
                // Modo local
                const alertasKey = 'alertas_transporte_publico';
                const alertas = JSON.parse(localStorage.getItem(alertasKey) || '[]');
                const alerta = alertas.find(a => a.id == alertaId);
                if (alerta && alerta.reportado_por_hash === this.usuarioHash) {
                    Object.assign(alerta, datos);
                    localStorage.setItem(alertasKey, JSON.stringify(alertas));
                }
            }
            
            this.mostrarExito('✅ Alerta actualizada correctamente.');
            await this.cargarAlertas();
            await this.cargarMiHistorial();
        } catch (error) {
            console.error('Error guardando edición:', error);
            this.mostrarError('Error al guardar los cambios. Por favor, intenta nuevamente.');
        }
    }
    
    // ===== BORRAR ALERTA =====
    async borrarAlerta(alertaId) {
        if (!confirm('¿Estás seguro de que querés borrar esta alerta?')) {
            return;
        }
        
        try {
            if (this.supabase) {
                const { error } = await this.supabase
                    .from('alertas_transporte_publico')
                    .update({ estado: 'eliminada' })
                    .eq('id', alertaId)
                    .eq('reportado_por_hash', this.usuarioHash);
                
                if (error) throw error;
            } else {
                // Modo local
                const alertasKey = 'alertas_transporte_publico';
                const alertas = JSON.parse(localStorage.getItem(alertasKey) || '[]');
                const alerta = alertas.find(a => a.id == alertaId);
                if (alerta && alerta.reportado_por_hash === this.usuarioHash) {
                    alerta.estado = 'eliminada';
                    localStorage.setItem(alertasKey, JSON.stringify(alertas));
                }
            }
            
            this.mostrarExito('✅ Alerta borrada correctamente.');
            await this.cargarAlertas();
            await this.cargarMiHistorial();
        } catch (error) {
            console.error('Error borrando alerta:', error);
            this.mostrarError('Error al borrar la alerta. Por favor, intenta nuevamente.');
        }
    }
    
    // ===== HELPERS =====
    mostrarExito(mensaje) {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, 'success');
        } else {
            alert(mensaje);
        }
    }
    
    mostrarError(mensaje) {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, 'error');
        } else {
            alert(mensaje);
        }
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Funciones globales
window.editarAlertaTransporte = function(alertaId) {
    if (window.comunidadTransporte) {
        window.comunidadTransporte.editarAlerta(alertaId);
    }
};

window.borrarAlertaTransporte = function(alertaId) {
    if (window.comunidadTransporte) {
        window.comunidadTransporte.borrarAlerta(alertaId);
    }
};

window.marcarComoResuelta = function(alertaId) {
    if (window.comunidadTransporte) {
        window.comunidadTransporte.actualizarEstadoAlerta(alertaId, 'resuelta');
    }
};

window.verificarAlerta = function(alertaId) {
    if (window.comunidadTransporte) {
        window.comunidadTransporte.verificarAlerta(alertaId);
    }
};

