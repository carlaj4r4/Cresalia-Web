// ===== SISTEMA DE FORO PARA COMUNIDADES CRESALIA =====
// Sistema completo de posts y comentarios con anonimato garantizado

class SistemaForoComunidades {
    constructor(comunidadSlug) {
        this.comunidadSlug = comunidadSlug;
        this.supabase = null;
        this.autorHash = null; // Hash del usuario actual para anonimato
        this.autorAlias = null; // Alias elegido por el usuario
        
        // Comunidades de ayuda que requieren ubicación y buscan ONGs/campañas
        this.comunidadesAyuda = [
            'cresalia-solidario',
            'cresalia-solidario-emergencias',
            'cresalia-animales'
        ];
        
        this.esComunidadAyuda = this.comunidadesAyuda.includes(comunidadSlug);
        
        // Sistema de registro de chats para seguridad
        // IMPORTANTE: Guardamos TODOS los registros (sin límite)
        // Esto permite revisar cualquier problema que pueda surgir
        // 
        // ¿Dónde se guardan?
        // 1. localStorage: En el navegador del usuario (siempre funciona)
        // 2. Supabase: En la nube (solo si está configurado)
        //
        // ¿Cómo revisarlos?
        // Desde la consola: window.foroComunidad.mostrarRegistrosChats()
        // O presioná Ctrl+Shift+R para mostrar el botón oculto
        // Ver: COMO-REVISAR-REGISTROS-CHATS.md para más detalles
        this.registroChats = JSON.parse(localStorage.getItem(`registro_chats_${comunidadSlug}`) || '[]');
        
        // Cargar registros desde Supabase si está disponible (se hace en init)
        
        this.init();
    }
    
    async init() {
        // Inicializar Supabase si está disponible
        if (typeof window.supabase !== 'undefined') {
            try {
                // Intentar usar initSupabase primero
                if (typeof window.initSupabase === 'function') {
                    const client = window.initSupabase();
                    if (client && typeof client.from === 'function') {
                        this.supabase = client;
                        console.log('✅ Foro: Supabase inicializado desde initSupabase');
                    }
                }
                
                // Si no funcionó, intentar con configuración directa
                if (!this.supabase) {
                    const config = window.SUPABASE_CONFIG || {};
                    
                    if (config.url && config.anonKey && !config.anonKey.includes('REEMPLAZA') && !config.anonKey.includes('PEGA_AQUI')) {
                        this.supabase = window.supabase.createClient(
                            config.url,
                            config.anonKey,
                            { auth: config.auth || {} }
                        );
                        console.log('✅ Foro: Supabase inicializado desde config');
                    } else {
                        console.warn('⚠️ Foro: Supabase no configurado, usando modo local (localStorage)');
                    }
                }
            } catch (error) {
                console.error('❌ Foro: Error al inicializar Supabase', error);
                console.warn('⚠️ Foro: Continuando en modo local (localStorage)');
            }
        } else {
            console.warn('⚠️ Foro: Supabase SDK no disponible, usando modo local (localStorage)');
        }
        
        // Inicializar hash de autor (anonimato)
        this.autorHash = this.generarHashAutor();
        
        // Cargar alias guardado
        this.autorAlias = this.obtenerAliasGuardado();
        
        // Si es comunidad de ayuda, mostrar búsqueda de ONGs en lugar de posts
        if (this.esComunidadAyuda) {
            // Mostrar interfaz de búsqueda de ONGs
            this.mostrarInterfazBusquedaONGs();
        } else {
            // Cargar posts normalmente
            this.cargarPosts();
        }
        
        // Configurar listeners
        this.configurarEventListeners();
        
        // Inicializar sistema de feedbacks
        if (typeof SistemaFeedbacksComunidades !== 'undefined') {
            window.feedbackComunidad = new SistemaFeedbacksComunidades(this.comunidadSlug);
        }
        
        // Inicializar sistema de logros si está disponible
        if (typeof SistemaLogros !== 'undefined' && typeof window.initSistemaLogros === 'function') {
            // Configurar logros para comunidades
            const tenantConfig = {
                tenant: { slug: this.comunidadSlug, nombre: this.comunidadSlug },
                plan: 'comunidad',
                metrics: this.obtenerMetricasComunidad()
            };
            window.initSistemaLogros(tenantConfig);
        }
        
        // Cargar historiales adicionales para comunidades de solidario
        const comunidadesConHistoriales = ['cresalia-solidario', 'cresalia-solidario-emergencias'];
        if (comunidadesConHistoriales.includes(this.comunidadSlug)) {
            setTimeout(() => {
                this.cargarHistorialPersonasAyudadas();
                this.cargarHistorialPublicacionesCerradas();
            }, 2000);
        }
        
        // Cargar registros de chats desde Supabase si está disponible
        if (this.esComunidadAyuda && this.supabase) {
            this.cargarRegistrosChatsDesdeSupabase();
        }
    }
    
    // Cargar registros de chats desde Supabase
    async cargarRegistrosChatsDesdeSupabase() {
        if (!this.supabase || !this.autorHash) return;
        
        try {
            // Intentar cargar desde Supabase
            // Nota: Esto requiere una tabla 'registro_chats_comunidades' en Supabase
            // Por ahora, solo usamos localStorage pero dejamos preparado para Supabase
            const { data, error } = await this.supabase
                .from('registro_chats_comunidades')
                .select('*')
                .eq('usuario_hash', this.autorHash)
                .eq('comunidad_slug', this.comunidadSlug)
                .order('fecha', { ascending: false });
            
            if (!error && data) {
                // Combinar con registros locales (evitar duplicados)
                const idsExistentes = new Set(this.registroChats.map(r => r.id));
                data.forEach(registro => {
                    if (!idsExistentes.has(registro.id)) {
                        this.registroChats.push(registro);
                    }
                });
                
                // Guardar combinado en localStorage
                this.guardarRegistrosChats();
            }
        } catch (error) {
            // Si la tabla no existe, no es problema, seguimos con localStorage
            console.log('ℹ️ Tabla de registro_chats_comunidades no disponible, usando solo localStorage');
        }
    }
    
    // Obtener métricas de la comunidad para el sistema de logros
    obtenerMetricasComunidad() {
        // Obtener métricas desde localStorage o Supabase
        const postsKey = `posts_${this.comunidadSlug}`;
        const posts = JSON.parse(localStorage.getItem(postsKey) || '[]');
        const misPosts = posts.filter(p => p.autor_hash === this.autorHash);
        
        return {
            total_posts: misPosts.length,
            total_comentarios: misPosts.reduce((sum, p) => sum + (p.num_comentarios || 0), 0),
            total_reacciones: misPosts.reduce((sum, p) => sum + (p.num_reacciones || 0), 0),
            tiene_posts: misPosts.length > 0,
            primer_post: misPosts.length > 0
        };
    }
    
    // Generar hash único para anonimato (no reversible)
    generarHashAutor() {
        // Intentar obtener hash guardado o generar uno nuevo
        let hash = localStorage.getItem(`foro_hash_${this.comunidadSlug}`);
        
        if (!hash) {
            // Generar hash único basado en timestamp y random
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            const browser = navigator.userAgent.substring(0, 50);
            
            // Crear string único y generar hash simple
            const data = `${timestamp}_${random}_${browser}`;
            
            // Hash simple (en producción usar algo más robusto como SHA-256)
            let hashValue = 0;
            for (let i = 0; i < data.length; i++) {
                const char = data.charCodeAt(i);
                hashValue = ((hashValue << 5) - hashValue) + char;
                hashValue = hashValue & hashValue; // Convertir a 32bit
            }
            
            hash = Math.abs(hashValue).toString(36);
            localStorage.setItem(`foro_hash_${this.comunidadSlug}`, hash);
        }
        
        return hash;
    }
    
    obtenerAliasGuardado() {
        return localStorage.getItem(`foro_alias_${this.comunidadSlug}`) || null;
    }
    
    guardarAlias(alias) {
        this.autorAlias = alias;
        localStorage.setItem(`foro_alias_${this.comunidadSlug}`, alias);
    }
    
    configurarEventListeners() {
        // Botón crear post - con múltiples intentos y fallback onclick
        const btnCrearPost = document.getElementById('btn-crear-post');
        if (btnCrearPost) {
            // Remover listeners previos para evitar duplicados
            const newBtn = btnCrearPost.cloneNode(true);
            btnCrearPost.parentNode.replaceChild(newBtn, btnCrearPost);
            
            // Agregar evento click
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.mostrarFormularioPost();
            });
            
            // Fallback: onclick directo
            newBtn.setAttribute('onclick', `window.foroComunidad && window.foroComunidad.mostrarFormularioPost(); return false;`);
            console.log('✅ Event listener configurado para btn-crear-post');
        } else {
            console.warn('⚠️ No se encontró btn-crear-post, reintentando...');
            // Reintentar después de un delay
            setTimeout(() => this.configurarEventListeners(), 500);
        }
        
        // Formulario de post
        const formPost = document.getElementById('form-crear-post');
        if (formPost) {
            formPost.addEventListener('submit', (e) => {
                e.preventDefault();
                this.crearPost();
            });
        }
        
        // Cerrar formulario
        const cerrarForm = document.getElementById('cerrar-form-post');
        if (cerrarForm) {
            cerrarForm.addEventListener('click', () => this.ocultarFormularioPost());
        }
        
        // Agregar filtros de búsqueda si es comunidad de ayuda
        if (this.esComunidadAyuda) {
            this.agregarFiltrosBusqueda();
            
            // Agregar botón para revisar registros de chats (solo visible para desarrollo/admin)
            // Puedes acceder desde la consola: window.foroComunidad.mostrarRegistrosChats()
            // O agregar un botón oculto que puedas activar cuando necesites
            this.agregarBotonRevisarRegistros();
        }
        
        // Conectar tab "Mi Historial" si existe
        this.conectarTabHistorial();
    }
    
    // Agregar botón oculto para revisar registros (solo para ti)
    agregarBotonRevisarRegistros() {
        // Crear botón oculto que puedas activar cuando necesites revisar
        // Por defecto está oculto, pero puedes hacerlo visible desde la consola
        const botonHTML = `
            <button id="btn-revisar-registros-chats" onclick="if(window.foroComunidad) window.foroComunidad.mostrarRegistrosChats()" 
                    style="position: fixed; bottom: 20px; left: 20px; background: #6B7280; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; z-index: 9998; display: none; opacity: 0.7;"
                    title="Revisar registros de chats (solo para revisión)">
                <i class="fas fa-clipboard-list"></i> Registros
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', botonHTML);
        
        // Hacerlo visible si presionas Ctrl+Shift+R (solo para ti)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                const boton = document.getElementById('btn-revisar-registros-chats');
                if (boton) {
                    boton.style.display = boton.style.display === 'none' ? 'block' : 'none';
                }
            }
        });
    }
    
    // Mostrar interfaz de búsqueda de ONGs
    mostrarInterfazBusquedaONGs() {
        const container = document.getElementById('posts-container');
        if (!container) return;
        
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #6B7280;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🤝</div>
                <h2 style="color: #374151; margin-bottom: 15px;">Buscar ONGs y Campañas Solidarias</h2>
                <p style="font-size: 1.1rem; line-height: 1.8; max-width: 600px; margin: 0 auto 30px;">
                    En esta comunidad, conectamos personas con <strong>organizaciones y campañas verificadas</strong> 
                    que trabajan en diferentes zonas. Usá los filtros arriba para encontrar ayuda cerca de tu ubicación.
                </p>
                <p style="font-size: 0.95rem; color: #9CA3AF;">
                    <i class="fas fa-shield-alt"></i> Todas las organizaciones están verificadas y consolidadas.
                </p>
            </div>
        `;
    }
    
    // Agregar filtros de búsqueda por ubicación para ONGs/Campañas
    agregarFiltrosBusqueda() {
        const container = document.getElementById('posts-container');
        if (!container) return;
        
        // Verificar si ya existen los filtros
        if (document.getElementById('filtros-ubicacion')) return;
        
        const filtrosHTML = `
            <div id="filtros-ubicacion" style="background: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-left: 4px solid #10B981; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="color: #047857; margin: 0 0 10px 0; font-size: 1.1rem;">
                        <i class="fas fa-hands-helping"></i> Buscar ONGs y Campañas Solidarias
                    </h3>
                    <p style="color: #065F46; margin: 0; line-height: 1.6; font-size: 0.95rem;">
                        Buscá organizaciones y campañas consolidadas que trabajen en tu zona. 
                        Estas organizaciones están verificadas y tienen experiencia en ayudar a quienes lo necesitan.
                    </p>
                </div>
                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 1.2rem;">
                    <i class="fas fa-filter"></i> Filtrar por ubicación
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">
                    <div>
                        <label for="filtro-pais" style="display: block; margin-bottom: 5px; color: #6B7280; font-size: 0.9rem; font-weight: 600;">País</label>
                        <select id="filtro-pais" style="width: 100%; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                            <option value="">Todos los países</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Chile">Chile</option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Brasil">Brasil</option>
                        </select>
                    </div>
                    <div>
                        <label for="filtro-provincia" style="display: block; margin-bottom: 5px; color: #6B7280; font-size: 0.9rem; font-weight: 600;">Provincia/Estado</label>
                        <input type="text" id="filtro-provincia" placeholder="Ej: Buenos Aires" style="width: 100%; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                    </div>
                    <div>
                        <label for="filtro-zona" style="display: block; margin-bottom: 5px; color: #6B7280; font-size: 0.9rem; font-weight: 600;">Zona/Barrio</label>
                        <input type="text" id="filtro-zona" placeholder="Ej: Zona Norte" style="width: 100%; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="if(window.foroComunidad) window.foroComunidad.buscarONGsCampañas()" style="background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-search"></i> Buscar ONGs/Campañas
                    </button>
                    <button onclick="if(window.foroComunidad) window.foroComunidad.limpiarFiltros()" style="background: #E5E7EB; color: #374151; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-times"></i> Limpiar
                    </button>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforebegin', filtrosHTML);
    }
    
    // Buscar ONGs y Campañas por ubicación
    async buscarONGsCampañas() {
        const filtroPais = document.getElementById('filtro-pais')?.value || '';
        const filtroProvincia = document.getElementById('filtro-provincia')?.value.toLowerCase() || '';
        const filtroZona = document.getElementById('filtro-zona')?.value.toLowerCase() || '';
        
        const container = document.getElementById('posts-container');
        if (container) {
            container.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spinner" style="border: 4px solid #F3F4F6; border-top: 4px solid #10B981; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div><p>Cargando ONGs y campañas...</p></div>';
        }
        
        try {
            let ongsCampañas = [];
            
            // Buscar en campañas de emergencia
            if (this.supabase) {
                try {
                    // Buscar campañas verificadas
                    const { data: campanas, error } = await this.supabase
                        .from('campañas_emergencia')
                        .select('*')
                        .eq('estado', 'activa')
                        .eq('verificada', true);
                    
                    if (!error && campanas) {
                        ongsCampañas = campanas.map(c => {
                            // Parsear ubicación si existe
                            let ubicacion = {};
                            if (c.ubicacion) {
                                try {
                                    ubicacion = typeof c.ubicacion === 'string' ? JSON.parse(c.ubicacion) : c.ubicacion;
                                } catch (e) {
                                    // Si no se puede parsear, usar campos directos
                                    ubicacion = {
                                        pais: c.pais || '',
                                        provincia: c.provincia || '',
                                        zona: c.zona || c.ubicacion_zona || ''
                                    };
                                }
                            } else {
                                // Intentar obtener de campos directos
                                ubicacion = {
                                    pais: c.pais || '',
                                    provincia: c.provincia || '',
                                    zona: c.zona || c.ubicacion_zona || ''
                                };
                            }
                            
                            return {
                                ...c,
                                tipo: 'campaña',
                                nombre: c.titulo || 'Campaña de Emergencia',
                                organizacion: c.organizacion_responsable || c.organizacion || 'Organización Verificada',
                                ubicacion: ubicacion,
                                descripcion: c.descripcion || c.detalles || '',
                                necesidades: Array.isArray(c.necesidades) ? c.necesidades : (c.necesidades ? [c.necesidades] : [])
                            };
                        });
                    }
                } catch (error) {
                    console.warn('Error buscando campañas en Supabase:', error);
                }
            }
            
            // También buscar en localStorage (modo local)
            try {
                const campanasLocal = JSON.parse(localStorage.getItem('campañas_emergencia') || '[]')
                    .filter(c => c.estado === 'activa' && c.verificada === true);
                
                const campanasLocalFormateadas = campanasLocal.map(c => {
                    let ubicacion = {};
                    if (c.ubicacion) {
                        try {
                            ubicacion = typeof c.ubicacion === 'string' ? JSON.parse(c.ubicacion) : c.ubicacion;
                        } catch (e) {
                            ubicacion = {
                                pais: c.pais || '',
                                provincia: c.provincia || '',
                                zona: c.zona || ''
                            };
                        }
                    } else {
                        ubicacion = {
                            pais: c.pais || '',
                            provincia: c.provincia || '',
                            zona: c.zona || ''
                        };
                    }
                    
                    return {
                        ...c,
                        tipo: 'campaña',
                        nombre: c.titulo || 'Campaña de Emergencia',
                        organizacion: c.organizacion_responsable || c.organizacion || 'Organización Verificada',
                        ubicacion: ubicacion,
                        descripcion: c.descripcion || c.detalles || '',
                        necesidades: Array.isArray(c.necesidades) ? c.necesidades : (c.necesidades ? [c.necesidades] : [])
                    };
                });
                
                // Combinar resultados (evitar duplicados)
                const idsExistentes = new Set(ongsCampañas.map(c => c.id));
                campanasLocalFormateadas.forEach(c => {
                    if (!idsExistentes.has(c.id)) {
                        ongsCampañas.push(c);
                    }
                });
            } catch (error) {
                console.warn('Error buscando campañas en localStorage:', error);
            }
            
            // Filtrar por ubicación
            const filtradas = ongsCampañas.filter(item => {
                const ubicacion = item.ubicacion || {};
                const pais = (ubicacion.pais || '').toLowerCase();
                const provincia = (ubicacion.provincia || '').toLowerCase();
                const zona = (ubicacion.zona || '').toLowerCase();
                
                const coincidePais = !filtroPais || pais.includes(filtroPais.toLowerCase());
                const coincideProvincia = !filtroProvincia || provincia.includes(filtroProvincia);
                const coincideZona = !filtroZona || zona.includes(filtroZona);
                
                return coincidePais && coincideProvincia && coincideZona;
            });
            
            this.mostrarONGsCampañas(filtradas);
        } catch (error) {
            console.error('Error buscando ONGs/Campañas:', error);
            const container = document.getElementById('posts-container');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #6B7280;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px; color: #EF4444;"></i>
                        <p style="font-size: 1.1rem;">Error al buscar ONGs y campañas.</p>
                        <p>Por favor, intenta nuevamente.</p>
                    </div>
                `;
            }
        }
    }
    
    // Mostrar ONGs y Campañas encontradas
    mostrarONGsCampañas(ongsCampañas) {
        const container = document.getElementById('posts-container');
        if (!container) return;
        
        if (ongsCampañas.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #6B7280;">
                    <i class="fas fa-search" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3 style="color: #374151; margin-bottom: 10px;">No se encontraron ONGs o campañas</h3>
                    <p>No hay organizaciones o campañas activas en esa ubicación en este momento.</p>
                    <p style="margin-top: 15px; font-size: 0.9rem;">Intentá con otros criterios de búsqueda o revisá más tarde.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = ongsCampañas.map(item => {
            const ubicacion = item.ubicacion ? (typeof item.ubicacion === 'string' ? JSON.parse(item.ubicacion) : item.ubicacion) : {};
            const esCampaña = item.tipo === 'campaña';
            
            return `
                <div class="ong-campana-card" style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-left: 4px solid ${esCampaña ? '#EF4444' : '#10B981'};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <h3 style="color: #374151; margin: 0 0 5px 0; font-size: 1.3rem;">
                                ${esCampaña ? '🚨' : '🤝'} ${this.escapeHtml(item.nombre || 'Organización')}
                            </h3>
                            <p style="color: #6B7280; margin: 0; font-size: 0.95rem;">
                                <strong>Organización:</strong> ${this.escapeHtml(item.organizacion || 'Verificada')}
                            </p>
                            ${item.verificada ? `
                                <span style="background: #10B981; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem; margin-top: 5px; display: inline-block;">
                                    <i class="fas fa-check-circle"></i> Verificada
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${item.descripcion ? `
                        <div style="background: #F9FAFB; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                            <p style="color: #374151; margin: 0; line-height: 1.6;">${this.escapeHtml(item.descripcion)}</p>
                        </div>
                    ` : ''}
                    
                    <div style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-left: 4px solid #10B981; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <i class="fas fa-map-marker-alt" style="color: #10B981; font-size: 1.2rem;"></i>
                            <div>
                                <strong style="color: #047857;">📍 Ubicación de trabajo:</strong>
                                <p style="color: #065F46; margin: 5px 0 0 0;">
                                    ${ubicacion.zona ? this.escapeHtml(ubicacion.zona) + ', ' : ''}
                                    ${ubicacion.provincia ? this.escapeHtml(ubicacion.provincia) + ', ' : ''}
                                    ${ubicacion.pais ? this.escapeHtml(ubicacion.pais) : 'No especificada'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    ${item.necesidades && Array.isArray(item.necesidades) && item.necesidades.length > 0 ? `
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #374151;">Necesidades:</strong>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                                ${item.necesidades.map(n => `
                                    <span style="background: #F3F4F6; color: #374151; padding: 5px 12px; border-radius: 15px; font-size: 0.85rem;">
                                        ${this.escapeHtml(n)}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap;">
                        <button onclick="if(window.foroComunidad) window.foroComunidad.contactarONG('${item.id || item.titulo}', '${this.escapeHtml(item.organizacion || item.nombre)}', '${item.tipo || 'campaña'}')" style="background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; flex: 1; min-width: 150px;">
                            <i class="fas fa-comments"></i> Contactar ONG
                        </button>
                        ${esCampaña ? `
                            <button onclick="window.location.href='donar-materiales.html?campana=${item.id}'" style="background: linear-gradient(135deg, #EF4444, #DC2626); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; flex: 1; min-width: 150px;">
                                <i class="fas fa-heart"></i> Ver Campaña
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Aplicar filtros de búsqueda (para posts normales, no ONGs)
    aplicarFiltros() {
        const filtroPais = document.getElementById('filtro-pais')?.value.toLowerCase() || '';
        const filtroProvincia = document.getElementById('filtro-provincia')?.value.toLowerCase() || '';
        const filtroZona = document.getElementById('filtro-zona')?.value.toLowerCase() || '';
        
        const posts = document.querySelectorAll('.post');
        let visibleCount = 0;
        
        posts.forEach(post => {
            const pais = (post.getAttribute('data-pais') || '').toLowerCase();
            const provincia = (post.getAttribute('data-provincia') || '').toLowerCase();
            const zona = (post.getAttribute('data-zona') || '').toLowerCase();
            
            const coincidePais = !filtroPais || pais.includes(filtroPais);
            const coincideProvincia = !filtroProvincia || provincia.includes(filtroProvincia);
            const coincideZona = !filtroZona || zona.includes(filtroZona);
            
            if (coincidePais && coincideProvincia && coincideZona) {
                post.style.display = 'block';
                visibleCount++;
            } else {
                post.style.display = 'none';
            }
        });
        
        // Mostrar mensaje si no hay resultados
        const container = document.getElementById('posts-container');
        let mensajeNoResultados = document.getElementById('mensaje-no-resultados');
        
        if (visibleCount === 0) {
            if (!mensajeNoResultados) {
                mensajeNoResultados = document.createElement('div');
                mensajeNoResultados.id = 'mensaje-no-resultados';
                mensajeNoResultados.style.cssText = 'text-align: center; padding: 40px; color: #6B7280;';
                mensajeNoResultados.innerHTML = `
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p style="font-size: 1.1rem;">No se encontraron posts con esos filtros.</p>
                    <p>Intentá con otros criterios de búsqueda.</p>
                `;
                container.appendChild(mensajeNoResultados);
            }
        } else {
            if (mensajeNoResultados) {
                mensajeNoResultados.remove();
            }
        }
    }
    
    // Contactar ONG (con verificación de edad y registro)
    contactarONG(ongId, nombreONG, tipo) {
        // Verificar edad primero
        this.verificarEdadParaContactar(() => {
            this.abrirChatONG(ongId, nombreONG, tipo);
        });
    }
    
    // Verificar edad del usuario
    verificarEdadParaContactar(callback) {
        // Verificar si ya se verificó la edad en esta sesión
        const edadVerificada = sessionStorage.getItem(`edad_verificada_${this.comunidadSlug}`);
        
        if (edadVerificada === 'true') {
            callback();
            return;
        }
        
        // Mostrar modal de verificación de edad
        const modalEdadHTML = `
            <div id="modal-verificar-edad" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 20px;">
                <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                    <h2 style="color: #374151; margin-bottom: 20px; font-size: 1.8rem;">Verificación de Edad</h2>
                    
                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 10px; margin-bottom: 25px; text-align: left;">
                        <p style="color: #92400E; margin: 0; line-height: 1.8; font-size: 1rem;">
                            Para contactar ONGs y organizaciones, necesitamos confirmar que sos mayor de edad (18 años o más).
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <label for="fecha-nacimiento" style="display: block; margin-bottom: 10px; color: #374151; font-weight: 600; text-align: left;">Fecha de nacimiento:</label>
                        <input type="date" id="fecha-nacimiento" max="${new Date().toISOString().split('T')[0]}" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button onclick="if(window.foroComunidad) window.foroComunidad.validarEdad()" style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 20px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            <i class="fas fa-check"></i> Verificar
                        </button>
                        <button onclick="document.getElementById('modal-verificar-edad').remove()" style="background: #E5E7EB; color: #374151; padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalEdadHTML);
        
        // Guardar callback para ejecutar después de verificar
        this.callbackDespuesEdad = callback;
    }
    
    // Validar edad del usuario
    validarEdad() {
        const fechaInput = document.getElementById('fecha-nacimiento');
        if (!fechaInput || !fechaInput.value) {
            alert('Por favor, ingresá tu fecha de nacimiento.');
            return;
        }
        
        const fechaNacimiento = new Date(fechaInput.value);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        
        const edadReal = mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate()) ? edad - 1 : edad;
        
        if (edadReal < 18) {
            alert('⚠️ Lo sentimos, debés ser mayor de 18 años para contactar ONGs y organizaciones.');
            document.getElementById('modal-verificar-edad').remove();
            return;
        }
        
        // Guardar verificación en sesión
        sessionStorage.setItem(`edad_verificada_${this.comunidadSlug}`, 'true');
        
        // Cerrar modal y ejecutar callback
        document.getElementById('modal-verificar-edad').remove();
        
        if (this.callbackDespuesEdad) {
            this.callbackDespuesEdad();
            this.callbackDespuesEdad = null;
        }
    }
    
    // Abrir chat con ONG (con registro)
    abrirChatONG(ongId, nombreONG, tipo) {
        // Registrar inicio de chat
        this.registrarChat({
            ongId: ongId,
            nombreONG: nombreONG,
            tipo: tipo,
            accion: 'inicio_chat',
            timestamp: new Date().toISOString(),
            usuarioHash: this.autorHash
        });
        
        // Mostrar advertencias adaptadas para ONGs
        const advertenciasHTML = `
            <div id="modal-advertencias-chat-ong" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 20px;">
                <div style="background: white; border-radius: 20px; padding: 40px; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: left;">
                    <div style="font-size: 3rem; margin-bottom: 20px; text-align: center;">🤝</div>
                    <h2 style="color: #10B981; margin-bottom: 20px; font-size: 1.8rem; text-align: center;">Contactar con ${this.escapeHtml(nombreONG)}</h2>
                    
                    <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                        <h4 style="color: #065F46; margin: 0 0 10px 0; font-size: 1rem;">
                            <i class="fas fa-info-circle"></i> Sobre esta organización:
                        </h4>
                        <p style="color: #065F46; margin: 0; line-height: 1.8; font-size: 0.95rem;">
                            Esta es una organización verificada y consolidada. Sin embargo, siempre es importante:
                        </p>
                        <ul style="color: #065F46; margin: 10px 0 0 20px; line-height: 1.8; font-size: 0.95rem;">
                            <li>Verificar la identidad de la organización</li>
                            <li>No compartir información personal sensible</li>
                            <li>Coordinar encuentros en lugares públicos</li>
                            <li>Informar a alguien de confianza sobre el contacto</li>
                        </ul>
                    </div>
                    
                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                        <h4 style="color: #92400E; margin: 0 0 10px 0; font-size: 1rem;">
                            <i class="fas fa-info-circle"></i> Sobre pagos y comisiones:
                        </h4>
                        <p style="color: #92400E; margin: 0; line-height: 1.8; font-size: 0.95rem;">
                            <strong>Cresalia NO se encarga de los pagos ni recibe comisiones</strong> (a menos que alguien quiera donar, pero no es obligación). 
                            Solo ofrecemos este espacio para conectar personas con organizaciones verificadas. Los acuerdos y pagos se realizan directamente entre las partes.
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                        <button onclick="document.getElementById('modal-advertencias-chat-ong').remove(); if(window.foroComunidad) window.foroComunidad.iniciarChatONG('${ongId}', '${this.escapeHtml(nombreONG)}')" style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 20px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            <i class="fas fa-check"></i> Entiendo, continuar
                        </button>
                        <button onclick="document.getElementById('modal-advertencias-chat-ong').remove()" style="background: #E5E7EB; color: #374151; padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', advertenciasHTML);
    }
    
    // Registrar actividad de chat (para seguridad)
    // IMPORTANTE: Guardamos TODOS los registros para poder revisar problemas
    async registrarChat(datos) {
        const registro = {
            id: `chat_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            ...datos,
            comunidad: this.comunidadSlug,
            fecha: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        this.registroChats.push(registro);
        
        // Guardar en localStorage (SIN límite - guardamos todo para revisión)
        this.guardarRegistrosChats();
        
        // También intentar guardar en Supabase si está disponible
        if (this.supabase) {
            try {
                // Intentar guardar en Supabase
                const { error } = await this.supabase
                    .from('registro_chats_comunidades')
                    .insert([{
                        id: registro.id,
                        usuario_hash: this.autorHash,
                        comunidad_slug: this.comunidadSlug,
                        ong_id: registro.ongId || null,
                        nombre_ong: registro.nombreONG || null,
                        tipo: registro.tipo || null,
                        accion: registro.accion || null,
                        mensaje_preview: registro.mensaje || null,
                        fecha: registro.fecha,
                        metadata: JSON.stringify(registro)
                    }]);
                
                if (error) {
                    // Si falla, solo loguear - no es crítico, tenemos localStorage
                    console.warn('⚠️ No se pudo guardar registro en Supabase (puede que la tabla no exista):', error);
                } else {
                    console.log('✅ Registro guardado en Supabase');
                }
            } catch (error) {
                // Si la tabla no existe, no es problema
                console.log('ℹ️ Tabla registro_chats_comunidades no disponible, usando solo localStorage');
            }
        }
        
        console.log('📝 Registro de chat guardado:', registro);
    }
    
    // Guardar registros en localStorage
    guardarRegistrosChats() {
        try {
            localStorage.setItem(`registro_chats_${this.comunidadSlug}`, JSON.stringify(this.registroChats));
        } catch (error) {
            // Si localStorage está lleno, intentar limpiar registros muy antiguos (más de 1 año)
            if (error.name === 'QuotaExceededError') {
                const unAñoAtras = Date.now() - (365 * 24 * 60 * 60 * 1000);
                this.registroChats = this.registroChats.filter(r => {
                    const fechaRegistro = new Date(r.fecha || r.timestamp).getTime();
                    return fechaRegistro > unAñoAtras;
                });
                
                try {
                    localStorage.setItem(`registro_chats_${this.comunidadSlug}`, JSON.stringify(this.registroChats));
                    console.warn('⚠️ Se limpiaron registros antiguos (>1 año) por falta de espacio');
                } catch (e) {
                    console.error('❌ Error crítico: No se puede guardar registros de chat', e);
                }
            }
        }
    }
    
    // Método para que puedas revisar los registros de chats
    // Puedes llamarlo desde la consola: window.foroComunidad.mostrarRegistrosChats()
    mostrarRegistrosChats() {
        if (this.registroChats.length === 0) {
            alert('No hay registros de chats aún.');
            return;
        }
        
        // Crear modal para mostrar registros
        const modalHTML = `
            <div id="modal-registros-chats" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 20px;">
                <div style="background: white; border-radius: 20px; padding: 30px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #E5E7EB; padding-bottom: 15px;">
                        <h2 style="color: #374151; margin: 0; font-size: 1.8rem;">
                            <i class="fas fa-clipboard-list"></i> Registros de Chats
                        </h2>
                        <button onclick="document.getElementById('modal-registros-chats').remove()" style="background: #E5E7EB; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-size: 20px; color: #374151;">&times;</button>
                    </div>
                    
                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                        <p style="color: #92400E; margin: 0; line-height: 1.6; font-size: 0.95rem;">
                            <strong>Total de registros:</strong> ${this.registroChats.length}<br>
                            <strong>Comunidad:</strong> ${this.comunidadSlug}<br>
                            <strong>Estos registros se guardan para seguridad y revisión.</strong>
                        </p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <button onclick="if(window.foroComunidad) window.foroComunidad.exportarRegistrosChats()" style="background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; margin-right: 10px;">
                            <i class="fas fa-download"></i> Exportar a JSON
                        </button>
                        <button onclick="if(window.foroComunidad) window.foroComunidad.limpiarRegistrosChats()" style="background: #EF4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-trash"></i> Limpiar Registros
                        </button>
                    </div>
                    
                    <div style="max-height: 500px; overflow-y: auto;">
                        ${this.registroChats.map((registro, index) => {
                            const fecha = new Date(registro.fecha || registro.timestamp).toLocaleString('es-AR');
                            const accionIconos = {
                                'inicio_chat': '💬',
                                'chat_iniciado': '💬',
                                'mensaje_enviado': '📤',
                                'contacto_ong': '🤝'
                            };
                            
                            return `
                                <div style="background: #F9FAFB; border-left: 4px solid #10B981; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px; flex-wrap: wrap; gap: 10px;">
                                        <div>
                                            <strong style="color: #374151; font-size: 1.1rem;">
                                                ${accionIconos[registro.accion] || '📝'} ${this.escapeHtml(registro.accion || 'Acción')}
                                            </strong>
                                            ${registro.nombreONG ? `
                                                <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 0.95rem;">
                                                    <strong>ONG:</strong> ${this.escapeHtml(registro.nombreONG)}
                                                </p>
                                            ` : ''}
                                        </div>
                                        <span style="color: #9CA3AF; font-size: 0.85rem;">${fecha}</span>
                                    </div>
                                    
                                    ${registro.mensaje ? `
                                        <div style="background: white; padding: 10px; border-radius: 8px; margin-top: 10px;">
                                            <p style="color: #374151; margin: 0; font-size: 0.9rem;">
                                                <strong>Mensaje:</strong> ${this.escapeHtml(registro.mensaje)}
                                            </p>
                                        </div>
                                    ` : ''}
                                    
                                    <div style="margin-top: 10px; font-size: 0.8rem; color: #9CA3AF;">
                                        <strong>ID:</strong> ${registro.id || 'N/A'} | 
                                        <strong>Tipo:</strong> ${registro.tipo || 'N/A'}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Exportar registros a JSON para revisión
    exportarRegistrosChats() {
        const datos = {
            comunidad: this.comunidadSlug,
            fecha_exportacion: new Date().toISOString(),
            total_registros: this.registroChats.length,
            registros: this.registroChats
        };
        
        const json = JSON.stringify(datos, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registros_chats_${this.comunidadSlug}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`✅ Registros exportados. Total: ${this.registroChats.length} registros.`);
    }
    
    // Limpiar registros (con confirmación)
    limpiarRegistrosChats() {
        if (!confirm(`¿Estás seguro de que querés eliminar TODOS los ${this.registroChats.length} registros de chats?\n\nEsta acción no se puede deshacer.`)) {
            return;
        }
        
        this.registroChats = [];
        this.guardarRegistrosChats();
        
        // También limpiar en Supabase si está disponible
        if (this.supabase && this.autorHash) {
            this.supabase
                .from('registro_chats_comunidades')
                .delete()
                .eq('usuario_hash', this.autorHash)
                .eq('comunidad_slug', this.comunidadSlug)
                .then(() => {
                    console.log('✅ Registros eliminados de Supabase');
                })
                .catch(error => {
                    console.warn('⚠️ No se pudieron eliminar registros de Supabase:', error);
                });
        }
        
        alert('✅ Registros eliminados.');
        document.getElementById('modal-registros-chats')?.remove();
    }
    
    // Iniciar chat con ONG
    iniciarChatONG(ongId, nombreONG) {
        // Registrar inicio de chat
        this.registrarChat({
            ongId: ongId,
            nombreONG: nombreONG,
            accion: 'chat_iniciado',
            timestamp: new Date().toISOString(),
            usuarioHash: this.autorHash
        });
        
        const chatHTML = `
            <div id="chat-ong-${ongId}" style="position: fixed; bottom: 20px; right: 20px; width: 400px; max-height: 600px; background: white; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; display: flex; flex-direction: column;">
                <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 20px; border-radius: 15px 15px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0; font-size: 1.2rem;">🤝 ${this.escapeHtml(nombreONG)}</h3>
                        <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.9;">
                            <i class="fas fa-lock"></i> Mensaje privado
                        </p>
                    </div>
                    <button onclick="document.getElementById('chat-ong-${ongId}').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 18px;">&times;</button>
                </div>
                <div id="mensajes-chat-ong-${ongId}" style="flex: 1; padding: 20px; overflow-y: auto; max-height: 400px; background: #F9FAFB;">
                    <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <p style="margin: 0; color: #065F46; font-size: 0.9rem; line-height: 1.6;">
                            <strong>🔒 Conversación PRIVADA con ${this.escapeHtml(nombreONG)}.</strong> 
                            Los mensajes solo los verán tú y la organización. Esta conversación queda registrada por seguridad.
                        </p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
                        <p style="margin: 0; color: #374151;">Hola, me gustaría coordinar con ustedes para ayudar en su zona.</p>
                        <span style="font-size: 0.75rem; color: #9CA3AF; margin-top: 5px; display: block;">${new Date().toLocaleTimeString('es-AR')}</span>
                    </div>
                </div>
                <div style="padding: 15px; border-top: 1px solid #E5E7EB; display: flex; gap: 10px;">
                    <input type="text" id="input-mensaje-ong-${ongId}" placeholder="Escribe tu mensaje..." style="flex: 1; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 0.95rem;" onkeypress="if(event.key === 'Enter' && window.foroComunidad) window.foroComunidad.enviarMensajeONG('${ongId}', '${this.escapeHtml(nombreONG)}')">
                    <button onclick="if(window.foroComunidad) window.foroComunidad.enviarMensajeONG('${ongId}', '${this.escapeHtml(nombreONG)}')" style="background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        
        // Focus en el input
        setTimeout(() => {
            const input = document.getElementById(`input-mensaje-ong-${ongId}`);
            if (input) input.focus();
        }, 100);
    }
    
    // Enviar mensaje a ONG (con registro)
    enviarMensajeONG(ongId, nombreONG) {
        const input = document.getElementById(`input-mensaje-ong-${ongId}`);
        const mensajesContainer = document.getElementById(`mensajes-chat-ong-${ongId}`);
        
        if (!input || !input.value.trim() || !mensajesContainer) return;
        
        const mensaje = input.value.trim();
        const hora = new Date().toLocaleTimeString('es-AR');
        
        // Registrar mensaje enviado
        this.registrarChat({
            ongId: ongId,
            nombreONG: nombreONG,
            accion: 'mensaje_enviado',
            mensaje: mensaje.substring(0, 100), // Solo primeros 100 caracteres para registro
            timestamp: new Date().toISOString(),
            usuarioHash: this.autorHash
        });
        
        // Mostrar mensaje localmente
        const mensajeHTML = `
            <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px; margin-left: 20px;">
                <p style="margin: 0; color: #374151;">${this.escapeHtml(mensaje)}</p>
                <span style="font-size: 0.75rem; color: #9CA3AF; margin-top: 5px; display: block;">${hora}</span>
            </div>
        `;
        
        mensajesContainer.insertAdjacentHTML('beforeend', mensajeHTML);
        input.value = '';
        
        // Scroll al final
        mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
        
        // TODO: Integrar con sistema de mensajería PRIVADA de Cresalia
        // Este mensaje debe enviarse PRIVADAMENTE a la ONG
        console.log(`💬 Mensaje PRIVADO enviado a ONG ${nombreONG} (${ongId}):`, mensaje);
    }
    
    // Limpiar filtros
    limpiarFiltros() {
        const filtroPais = document.getElementById('filtro-pais');
        const filtroProvincia = document.getElementById('filtro-provincia');
        const filtroZona = document.getElementById('filtro-zona');
        
        if (filtroPais) filtroPais.value = '';
        if (filtroProvincia) filtroProvincia.value = '';
        if (filtroZona) filtroZona.value = '';
        
        // Si hay posts, mostrarlos todos
        const posts = document.querySelectorAll('.post');
        posts.forEach(post => {
            post.style.display = 'block';
        });
        
        // Si hay cards de ONGs, recargar todas
        const ongCards = document.querySelectorAll('.ong-campana-card');
        if (ongCards.length > 0) {
            // Recargar búsqueda sin filtros
            this.buscarONGsCampañas();
        }
        
        const mensajeNoResultados = document.getElementById('mensaje-no-resultados');
        if (mensajeNoResultados) {
            mensajeNoResultados.remove();
        }
    }
    
    // Abrir chat de ubicación con advertencias de seguridad
    abrirChatUbicacion(postId, autorAlias) {
        // Mostrar advertencias de seguridad primero
        const advertenciasHTML = `
            <div id="modal-advertencias-chat" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 20px;">
                <div style="background: white; border-radius: 20px; padding: 40px; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: left;">
                    <div style="font-size: 3rem; margin-bottom: 20px; text-align: center;">🛡️</div>
                    <h2 style="color: #EF4444; margin-bottom: 20px; font-size: 1.8rem; text-align: center;">Advertencias de Seguridad</h2>
                    
                    <div style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                        <h4 style="color: #991B1B; margin: 0 0 15px 0; font-size: 1.1rem;">
                            <i class="fas fa-exclamation-triangle"></i> Importante sobre tu seguridad:
                        </h4>
                        <ul style="color: #991B1B; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 0.95rem;">
                            <li><strong>NO compartas tu dirección exacta</strong> en el chat</li>
                            <li><strong>NO compartas tu nombre completo</strong> ni datos personales sensibles</li>
                            <li>Usá solo información general (zona, barrio, puntos de referencia públicos)</li>
                            <li>Quedate en lugares públicos para encuentros</li>
                            <li>Informá a alguien de confianza si vas a encontrarte con alguien</li>
                        </ul>
                    </div>
                    
                    <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                        <h4 style="color: #065F46; margin: 0 0 10px 0; font-size: 1rem;">
                            <i class="fas fa-info-circle"></i> Sobre pagos y comisiones:
                        </h4>
                        <p style="color: #065F46; margin: 0; line-height: 1.8; font-size: 0.95rem;">
                            <strong>Cresalia NO se encarga de los pagos ni recibe comisiones</strong> (a menos que alguien quiera donar, pero no es obligación). 
                            Solo ofrecemos este espacio para conectar personas. Los acuerdos y pagos se realizan directamente entre las partes.
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                        <button onclick="document.getElementById('modal-advertencias-chat').remove(); if(window.foroComunidad) window.foroComunidad.iniciarChatUbicacion('${postId}', '${this.escapeHtml(autorAlias)}')" style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 20px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            <i class="fas fa-check"></i> Entiendo, continuar
                        </button>
                        <button onclick="document.getElementById('modal-advertencias-chat').remove()" style="background: #E5E7EB; color: #374151; padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600;">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', advertenciasHTML);
    }
    
    // Iniciar chat de ubicación (MENSAJERÍA PRIVADA)
    iniciarChatUbicacion(postId, autorAlias) {
        // Este es un chat PRIVADO de mensajería entre dos personas
        // NO se publica nada en el foro, es comunicación directa y privada
        // Aquí se integraría con el sistema de chat existente de Cresalia para mensajería en tiempo real
        
        const chatHTML = `
            <div id="chat-ubicacion-${postId}" style="position: fixed; bottom: 20px; right: 20px; width: 400px; max-height: 600px; background: white; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; display: flex; flex-direction: column;">
                <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 20px; border-radius: 15px 15px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0; font-size: 1.2rem;">💬 Mensaje privado a ${this.escapeHtml(autorAlias)}</h3>
                        <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.9;">
                            <i class="fas fa-lock"></i> Conversación privada
                        </p>
                    </div>
                    <button onclick="document.getElementById('chat-ubicacion-${postId}').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 18px;">&times;</button>
                </div>
                <div id="mensajes-chat-${postId}" style="flex: 1; padding: 20px; overflow-y: auto; max-height: 400px; background: #F9FAFB;">
                    <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <p style="margin: 0; color: #065F46; font-size: 0.9rem; line-height: 1.6;">
                            <strong>🔒 Esta es una conversación PRIVADA.</strong> Los mensajes solo los verán tú y ${this.escapeHtml(autorAlias)}. 
                            <strong>NO compartas dirección exacta ni nombre completo.</strong> Solo información general para coordinar.
                        </p>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
                        <p style="margin: 0; color: #374151;">Hola, estoy cerca de tu zona. ¿Podemos coordinar por mensaje privado?</p>
                        <span style="font-size: 0.75rem; color: #9CA3AF; margin-top: 5px; display: block;">${new Date().toLocaleTimeString('es-AR')}</span>
                    </div>
                </div>
                <div style="padding: 15px; border-top: 1px solid #E5E7EB; display: flex; gap: 10px;">
                    <input type="text" id="input-mensaje-${postId}" placeholder="Escribe tu mensaje privado..." style="flex: 1; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 0.95rem;" onkeypress="if(event.key === 'Enter' && window.foroComunidad) window.foroComunidad.enviarMensajeChat('${postId}')">
                    <button onclick="if(window.foroComunidad) window.foroComunidad.enviarMensajeChat('${postId}')" style="background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        
        // Focus en el input
        setTimeout(() => {
            const input = document.getElementById(`input-mensaje-${postId}`);
            if (input) input.focus();
        }, 100);
        
        // TODO: Integrar con sistema de mensajería real de Cresalia
        // Los mensajes deben ser PRIVADOS y solo visibles para los dos participantes
        console.log(`💬 Iniciando chat privado con ${autorAlias} para post ${postId}`);
    }
    
    // Enviar mensaje en el chat PRIVADO
    enviarMensajeChat(postId) {
        const input = document.getElementById(`input-mensaje-${postId}`);
        const mensajesContainer = document.getElementById(`mensajes-chat-${postId}`);
        
        if (!input || !input.value.trim() || !mensajesContainer) return;
        
        const mensaje = input.value.trim();
        const hora = new Date().toLocaleTimeString('es-AR');
        
        // Mostrar mensaje localmente (solo para UI)
        const mensajeHTML = `
            <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px; margin-left: 20px;">
                <p style="margin: 0; color: #374151;">${this.escapeHtml(mensaje)}</p>
                <span style="font-size: 0.75rem; color: #9CA3AF; margin-top: 5px; display: block;">${hora}</span>
            </div>
        `;
        
        mensajesContainer.insertAdjacentHTML('beforeend', mensajeHTML);
        input.value = '';
        
        // Scroll al final
        mensajesContainer.scrollTop = mensajesContainer.scrollHeight;
        
        // TODO: Integrar con sistema de mensajería PRIVADA de Cresalia
        // Este mensaje debe enviarse PRIVADAMENTE al otro usuario, NO publicarse en el foro
        // Debe usar el sistema de chat/mensajería existente de Cresalia
        console.log(`💬 Mensaje PRIVADO enviado para post ${postId}:`, mensaje);
        
        // Aquí debería llamarse a una función del sistema de mensajería real:
        // if (typeof SistemaMensajeria !== 'undefined') {
        //     SistemaMensajeria.enviarMensajePrivado(postId, mensaje, this.autorHash);
        // }
    }
    
    conectarTabHistorial() {
        // Buscar todos los tabs con data-tab="mi-historial"
        document.querySelectorAll('[data-tab="mi-historial"]').forEach(tab => {
            tab.addEventListener('click', () => {
                // Esperar un poco para que el tab se active
                setTimeout(() => {
                    // Buscar contenedor del historial (puede tener diferentes IDs)
                    const container = document.getElementById('mi-historial-foro-lista') || 
                                     document.getElementById('mi-historial-lista');
                    
                    if (container) {
                        // Crear contenedor si no existe
                        if (!container.querySelector('.historial-foro-container')) {
                            container.innerHTML = `
                                <div class="historial-foro-container">
                                    <div class="info-box" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1)); border-left-color: #8b5cf6; margin-bottom: 20px;">
                                        <h3 style="color: #7c3aed;">📝 Mis Posts en el Foro</h3>
                                        <p style="margin: 0; line-height: 1.8;">
                                            Aquí podés ver todos tus posts, editarlos, pausarlos o eliminarlos.
                                        </p>
                                    </div>
                                    <div id="mi-historial-foro-lista" style="margin-top: 20px;">
                                        <div class="empty-state">
                                            <i class="fas fa-spinner fa-spin"></i>
                                            <p>Cargando tu historial...</p>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        
                        // Cargar historial
                        this.cargarMiHistorial();
                    }
                }, 100);
            });
        });
    }
    
    // Verificar si la comunidad permite crear posts
    puedeCrearPost() {
        // Comunidades de emergencias y solidario solo permiten agradecer cuando se complete el monto
        const comunidadesRestringidas = ['cresalia-solidario', 'cresalia-solidario-emergencias'];
        
        if (comunidadesRestringidas.includes(this.comunidadSlug)) {
            // Solo permitir si hay una campaña completada para agradecer
            return this.tieneCampañaCompletadaParaAgradecer();
        }
        
        return true; // Otras comunidades permiten crear posts normalmente
    }
    
    // Verificar si hay campaña completada para agradecer
    tieneCampañaCompletadaParaAgradecer() {
        // Verificar en localStorage o Supabase si hay campañas completadas
        // donde el usuario aún no haya agradecido
        try {
            const campañasCompletadas = JSON.parse(localStorage.getItem(`campañas_completadas_${this.comunidadSlug}`) || '[]');
            const yaAgradecidas = JSON.parse(localStorage.getItem(`campañas_agradecidas_${this.autorHash}`) || '[]');
            
            // Verificar si hay alguna campaña completada sin agradecer
            return campañasCompletadas.some(c => !yaAgradecidas.includes(c.id));
        } catch (e) {
            return false;
        }
    }
    
    mostrarFormularioPost() {
        // Verificar restricciones de escritura
        if (!this.puedeCrearPost()) {
            this.mostrarMensajeRestriccionEscritura();
            return;
        }
        
        const modal = document.getElementById('modal-crear-post');
        if (modal) {
            // Aplicar estilos inline con !important para sobrescribir CSS
            modal.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0,0,0,0.7) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 10000 !important;
                opacity: 1 !important;
                visibility: visible !important;
            `;
            
            // Asegurar que el modal-content también esté visible
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.cssText = `
                    background: white !important;
                    border-radius: 20px !important;
                    padding: 30px !important;
                    max-width: 700px !important;
                    width: 90% !important;
                    max-height: 90vh !important;
                    overflow-y: auto !important;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
                    position: relative !important;
                    z-index: 10001 !important;
                `;
            }
            
            // Remover clases que puedan ocultar el modal
            modal.classList.remove('hidden');
            modal.classList.add('show');
            
            // Si no tiene alias, pedirlo primero
            if (!this.autorAlias) {
                this.pedirAlias();
            }
            
            console.log('✅ Modal de crear post mostrado');
        } else {
            console.error('❌ No se encontró el modal modal-crear-post');
            // Intentar crear el modal si no existe
            this.crearModalSiNoExiste();
        }
    }
    
    crearModalSiNoExiste() {
        // Crear el modal si no existe en el HTML
        const modalHTML = `
            <div id="modal-crear-post" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>💜 Crear Nuevo Post</h3>
                        <button class="close-btn" id="cerrar-form-post" onclick="if(window.foroComunidad) window.foroComunidad.ocultarFormularioPost()">&times;</button>
                    </div>
                    <form id="form-crear-post">
                        <div class="form-group">
                            <label for="autor-alias">Tu nombre o alias (opcional)</label>
                            <input type="text" id="autor-alias" placeholder="Ej: Anónimo, María, etc.">
                        </div>
                        <div class="form-group">
                            <label for="post-titulo">Título (opcional)</label>
                            <input type="text" id="post-titulo" placeholder="Un título breve para tu post">
                        </div>
                        <div class="form-group">
                            <label for="post-contenido">Contenido *</label>
                            <textarea id="post-contenido" rows="8" required placeholder="Comparte tu experiencia, pregunta o reflexión..."></textarea>
                        </div>
                        ${this.esComunidadAyuda ? `
                        <!-- Campos de ubicación para comunidades de ayuda -->
                        <div style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-left: 4px solid #10B981; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h4 style="color: #047857; margin: 0 0 15px 0; font-size: 1.1rem;">
                                <i class="fas fa-map-marker-alt"></i> Ubicación (para facilitar la ayuda)
                            </h4>
                            <div class="form-group">
                                <label for="post-pais">País *</label>
                                <select id="post-pais" required style="width: 100%; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                                    <option value="">Seleccionar país...</option>
                                    <option value="Argentina">Argentina</option>
                                    <option value="Uruguay">Uruguay</option>
                                    <option value="Chile">Chile</option>
                                    <option value="Paraguay">Paraguay</option>
                                    <option value="Brasil">Brasil</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="post-provincia">Provincia/Estado *</label>
                                <input type="text" id="post-provincia" required placeholder="Ej: Buenos Aires, Córdoba, etc." style="width: 100%; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                            </div>
                            <div class="form-group">
                                <label for="post-zona">Zona/Barrio (no dirección exacta) *</label>
                                <input type="text" id="post-zona" required placeholder="Ej: Zona Norte, Centro, Barrio X, etc." style="width: 100%; padding: 10px; border: 2px solid #E5E7EB; border-radius: 8px; font-size: 1rem;">
                                <small style="color: #6B7280; font-size: 0.85rem; display: block; margin-top: 5px;">
                                    <i class="fas fa-shield-alt"></i> Por seguridad, no incluyas dirección exacta. Solo zona o barrio general.
                                </small>
                            </div>
                        </div>
                        
                        <!-- Aclaración sobre pagos y comisiones -->
                        <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #F59E0B; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h4 style="color: #92400E; margin: 0 0 10px 0; font-size: 1rem;">
                                <i class="fas fa-info-circle"></i> Importante sobre pagos y comisiones
                            </h4>
                            <p style="color: #92400E; margin: 0; line-height: 1.8; font-size: 0.95rem;">
                                <strong>Cresalia NO se encarga de los pagos ni recibe comisiones</strong> (a menos que alguien quiera donar, pero no es obligación). 
                                Solo ofrecemos este espacio para conectar personas. Los acuerdos y pagos se realizan directamente entre las partes.
                            </p>
                        </div>
                        ` : ''}
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <button type="submit" class="btn-primary" style="flex: 1;">
                                <i class="fas fa-paper-plane"></i> Publicar
                            </button>
                            <button type="button" class="btn-secondary" onclick="if(window.foroComunidad) window.foroComunidad.ocultarFormularioPost()">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Configurar el formulario
        const formPost = document.getElementById('form-crear-post');
        if (formPost) {
            formPost.addEventListener('submit', (e) => {
                e.preventDefault();
                this.crearPost();
            });
        }
        
        // Mostrar el modal después de crearlo
        setTimeout(() => {
            this.mostrarFormularioPost();
        }, 100);
    }
    
    mostrarMensajeRestriccionEscritura() {
        const mensajeHTML = `
            <div id="modal-restriccion-escritura" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 20px;">
                <div style="background: white; border-radius: 20px; padding: 40px; max-width: 600px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                    <h2 style="color: #EF4444; margin-bottom: 20px; font-size: 1.8rem;">Escritura Restringida</h2>
                    
                    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 10px; margin-bottom: 25px; text-align: left;">
                        <p style="color: #92400E; margin: 0; line-height: 1.8; font-size: 1rem;">
                            <strong>Esta comunidad tiene restricciones de escritura.</strong>
                        </p>
                        <p style="color: #92400E; margin: 10px 0 0 0; line-height: 1.8; font-size: 1rem;">
                            En <strong>Cresalia Solidario</strong> y <strong>Cresalia Solidario Emergencias</strong>, 
                            solo podés escribir para <strong>agradecer</strong> una vez que una campaña haya alcanzado su monto objetivo.
                        </p>
                        <p style="color: #92400E; margin: 10px 0 0 0; line-height: 1.8; font-size: 0.95rem;">
                            Esto ayuda a mantener el foco en las campañas activas y prevenir spam.
                        </p>
                    </div>
                    
                    <button onclick="document.getElementById('modal-restriccion-escritura').remove()" style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 20px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <i class="fas fa-check"></i> Entendido
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', mensajeHTML);
    }
    
    ocultarFormularioPost() {
        const modal = document.getElementById('modal-crear-post');
        if (modal) {
            modal.style.display = 'none';
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.classList.remove('show');
            modal.classList.add('hidden');
            
            // Limpiar formulario
            const form = document.getElementById('form-crear-post');
            if (form) {
                form.reset();
            }
        }
    }
    
    pedirAlias() {
        const aliasInput = document.getElementById('autor-alias');
        if (aliasInput) {
            aliasInput.value = this.autorAlias || '';
            aliasInput.focus();
        }
    }
    
    // Verificar si el usuario está baneado
    async verificarBan() {
        if (!this.supabase) return false; // Sin Supabase = no hay ban
        
        try {
            const { data, error } = await this.supabase
                .from('usuarios_baneados_foro')
                .select('*')
                .eq('autor_hash', this.autorHash)
                .eq('estado', 'activo')
                .or(`comunidad_slug.is.null,comunidad_slug.eq.${this.comunidadSlug}`)
                .single();
            
            if (error && error.code !== 'PGRST116') { // PGRST116 = no encontrado (OK)
                console.error('Error verificando ban:', error);
                return false;
            }
            
            if (data) {
                // Verificar si el ban aún está activo
                if (!data.fecha_desbaneo || new Date(data.fecha_desbaneo) > new Date()) {
                    return data; // Usuario está baneado
                }
            }
            
            return false; // No está baneado
        } catch (error) {
            console.error('Error en verificarBan:', error);
            return false;
        }
    }
    
    async crearPost() {
        // Verificar si está baneado
        const banInfo = await this.verificarBan();
        if (banInfo) {
            alert(`⚠️ No podés publicar en esta comunidad.\n\nMotivo: ${banInfo.motivo}\n\nSi creés que esto es un error, contactá a CRISLA.`);
            return;
        }
        
        const tituloInput = document.getElementById('post-titulo');
        const contenidoInput = document.getElementById('post-contenido');
        const aliasInput = document.getElementById('autor-alias');
        
        if (!tituloInput || !contenidoInput || !aliasInput) {
            alert('Error: Formulario no encontrado');
            return;
        }
        
        const titulo = tituloInput.value.trim();
        const contenido = contenidoInput.value.trim();
        const alias = aliasInput.value.trim() || 'Anónimo';
        
        // Obtener datos de ubicación si es comunidad de ayuda
        let ubicacion = null;
        if (this.esComunidadAyuda) {
            const paisInput = document.getElementById('post-pais');
            const provinciaInput = document.getElementById('post-provincia');
            const zonaInput = document.getElementById('post-zona');
            
            if (!paisInput || !provinciaInput || !zonaInput) {
                alert('Error: Campos de ubicación no encontrados');
                return;
            }
            
            const pais = paisInput.value.trim();
            const provincia = provinciaInput.value.trim();
            const zona = zonaInput.value.trim();
            
            if (!pais || !provincia || !zona) {
                alert('Por favor, completá todos los campos de ubicación.');
                return;
            }
            
            ubicacion = {
                pais: pais,
                provincia: provincia,
                zona: zona
            };
        }
        
        if (!contenido || contenido.length < 10) {
            alert('Por favor, escribí al menos 10 caracteres en tu mensaje.');
            return;
        }
        
        // Guardar alias
        this.guardarAlias(alias);
        
        // Crear post
        const postData = {
            comunidad_slug: this.comunidadSlug,
            autor_hash: this.autorHash,
            autor_alias: alias,
            titulo: titulo || null,
            contenido: contenido,
            estado: 'publicado',
            ubicacion: ubicacion ? JSON.stringify(ubicacion) : null
        };
        
        try {
            if (this.supabase) {
                // Con Supabase
                const { data, error } = await this.supabase
                    .from('posts_comunidades')
                    .insert([postData])
                    .select()
                    .single();
                
                if (error) throw error;
                
                console.log('✅ Post creado:', data);
                this.mostrarMensaje('Post creado exitosamente', 'success');
                this.cargarPosts();
                this.ocultarFormularioPost();
                
                // Mostrar mensaje de espera después de crear el post
                setTimeout(() => {
                    this.mostrarMensajeEsperaInicial();
                }, 500);
                
                // Limpiar formulario
                tituloInput.value = '';
                contenidoInput.value = '';
            } else {
                // Modo local (sin backend) - guardar en localStorage
                const postsKey = `posts_${this.comunidadSlug}`;
                const posts = JSON.parse(localStorage.getItem(postsKey) || '[]');
                const nuevoPost = {
                    id: 'local_' + Date.now(),
                    ...postData,
                    created_at: new Date().toISOString(),
                    fecha: new Date().toISOString(), // Duplicar para compatibilidad
                    num_comentarios: 0,
                    num_reacciones: 0,
                    reacciones: {
                        apoyo: 0,
                        entristece: 0,
                        me_identifico: 0,
                        gracias: 0
                    },
                    estado: 'publicado' // Asegurar que tenga estado
                };
                posts.unshift(nuevoPost);
                localStorage.setItem(postsKey, JSON.stringify(posts));
                console.log(`✅ Post guardado en localStorage (${postsKey}):`, nuevoPost);
                
                this.mostrarMensaje('Post creado exitosamente (modo local)', 'success');
                this.cargarPosts();
                this.ocultarFormularioPost();
                
                // Mostrar mensaje de espera después de crear el post
                setTimeout(() => {
                    this.mostrarMensajeEsperaInicial();
                }, 500);
                
                tituloInput.value = '';
                contenidoInput.value = '';
            }
        } catch (error) {
            console.error('❌ Error al crear post:', error);
            this.mostrarMensaje('Error al crear el post. Por favor intentá de nuevo.', 'error');
        }
    }
    
    // Mostrar mensaje de espera inicial después de crear un post
    mostrarMensajeEsperaInicial() {
        const mensajeHTML = `
            <div id="mensaje-espera-inicial" style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #F59E0B; padding: 20px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 400px; z-index: 10001; animation: slideInRight 0.5s ease;">
                <div style="display: flex; align-items: start; gap: 15px;">
                    <div style="font-size: 2rem;">⏳</div>
                    <div style="flex: 1;">
                        <h4 style="color: #92400E; margin: 0 0 10px 0; font-size: 1.1rem;">
                            <i class="fas fa-clock"></i> Tu post fue publicado
                        </h4>
                        <p style="color: #92400E; margin: 0 0 10px 0; line-height: 1.6; font-size: 0.9rem;">
                            <strong>Queremos ayudar a todos, pero no podemos con el tiempo.</strong> 
                            Por favor, tené paciencia. Intentamos responder lo más pronto posible.
                        </p>
                        <p style="color: #92400E; margin: 0; line-height: 1.6; font-size: 0.9rem;">
                            <strong>Si pasan 7 días sin respuesta:</strong> Contactá a 
                            <strong>CRISLA</strong> o escribinos a nuestro correo.
                        </p>
                    </div>
                    <button onclick="document.getElementById('mensaje-espera-inicial').remove()" style="background: none; border: none; font-size: 20px; color: #92400E; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">&times;</button>
                </div>
                <style>
                    @keyframes slideInRight {
                        from {
                            transform: translateX(400px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                </style>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', mensajeHTML);
        
        // Auto-cerrar después de 15 segundos
        setTimeout(() => {
            const mensaje = document.getElementById('mensaje-espera-inicial');
            if (mensaje) {
                mensaje.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => mensaje.remove(), 500);
            }
        }, 15000);
    }
    
    async cargarPosts() {
        const container = document.getElementById('posts-container');
        if (!container) return;
        
        container.innerHTML = '<div class="cargando">💜 Cargando posts...</div>';
        
        try {
            let posts = [];
            
            if (this.supabase) {
                // Cargar desde Supabase
                const { data, error } = await this.supabase
                    .from('posts_comunidades')
                    .select('*')
                    .eq('comunidad_slug', this.comunidadSlug)
                    .eq('estado', 'publicado')
                    .order('created_at', { ascending: false })
                    .limit(50);
                
                if (error) throw error;
                posts = data || [];
            } else {
                // Modo local - cargar desde localStorage
                const postsKey = `posts_${this.comunidadSlug}`;
                const postsGuardados = localStorage.getItem(postsKey);
                
                if (postsGuardados) {
                    try {
                        posts = JSON.parse(postsGuardados)
                            .filter(p => p.estado === 'publicado' || p.estado === undefined) // Incluir posts sin estado definido
                            .sort((a, b) => {
                                const fechaA = new Date(a.created_at || a.fecha || 0);
                                const fechaB = new Date(b.created_at || b.fecha || 0);
                                return fechaB - fechaA; // Más recientes primero
                            });
                        console.log(`✅ Foro: Cargados ${posts.length} posts desde localStorage para ${this.comunidadSlug}`);
                    } catch (error) {
                        console.error('❌ Error parseando posts desde localStorage:', error);
                        posts = [];
                    }
                } else {
                    console.log(`ℹ️ Foro: No hay posts guardados en localStorage para ${this.comunidadSlug}`);
                    posts = [];
                }
            }
            
            if (posts.length === 0) {
                container.innerHTML = `
                    <div class="sin-posts">
                        <h3>💜 Aún no hay posts en esta comunidad</h3>
                        <p>Sé el/la primero/a en compartir tu experiencia. Tu voz importa.</p>
                        <button class="btn btn-primary" onclick="foroComunidad.mostrarFormularioPost()">
                            <i class="fas fa-plus"></i> Crear Primer Post
                        </button>
                    </div>
                `;
                return;
            }
            
            // Renderizar posts
            // Renderizar posts con verificación (async)
            const postsHTML = await Promise.all(posts.map(async post => await this.renderizarPost(post)));
            container.innerHTML = postsHTML.join('');
            
            // Cargar comentarios para cada post
            posts.forEach(post => {
                this.cargarComentarios(post.id);
            });
            
            // Configurar botones de comentarios
            this.configurarBotonesComentarios();
            
        } catch (error) {
            console.error('❌ Error al cargar posts:', error);
            container.innerHTML = '<div class="error">Error al cargar los posts. Por favor recargá la página.</div>';
        }
    }
    
    async renderizarPost(post) {
        // Verificar si estamos en panel de verificación
        const esPanelVerificacion = window.location.pathname.includes('panel-verificacion') || 
                                     window.location.pathname.includes('panel-crear-campana');
        
        // Registrar que el usuario vio este post (esto también detecta si es admin)
        this.registrarPostVisto(post.id);
        
        // Verificar si fue leído por admin (para paneles de verificación)
        const fueLeidoPorAdmin = this.esPostLeidoPorAdmin(post.id);
        
        const fecha = new Date(post.created_at).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Verificar si el post tiene más de 7 días sin respuesta
        const fechaCreacion = new Date(post.created_at);
        const ahora = new Date();
        const diasSinRespuesta = (ahora - fechaCreacion) / (1000 * 60 * 60 * 24);
        const necesitaMensajeEspera = diasSinRespuesta >= 7 && (post.num_comentarios || 0) === 0;
        
        const esAutor = post.autor_hash === this.autorHash;
        const botonesAutor = esAutor ? `
            <button class="btn-editar" onclick="foroComunidad.editarPost('${post.id}')" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-borrar" onclick="foroComunidad.borrarPost('${post.id}')" title="Borrar">
                <i class="fas fa-trash"></i>
            </button>
        ` : '';
        
        // Verificar si el usuario está verificado
        let badgeVerificado = '';
        if (typeof SistemaValidacionIdentidades !== 'undefined') {
            const estaVerificado = await SistemaValidacionIdentidades.verificarUsuario(post.autor_hash, this.comunidadSlug);
            if (estaVerificado) {
                badgeVerificado = SistemaValidacionIdentidades.getBadgeVerificado();
            }
        }
        
        // Mensaje de espera si es necesario
        const mensajeEspera = necesitaMensajeEspera ? this.obtenerMensajeEspera() : '';
        
        // Parsear ubicación si existe
        let ubicacionInfo = null;
        if (post.ubicacion) {
            try {
                ubicacionInfo = typeof post.ubicacion === 'string' ? JSON.parse(post.ubicacion) : post.ubicacion;
            } catch (e) {
                console.warn('Error parseando ubicación:', e);
            }
        }
        
        // El botón "Estoy cerca" ya no se usa para posts individuales
        // Ahora se usa para contactar ONGs desde la búsqueda de ONGs/Campañas
        const botonEstoyCerca = ''; // Removido - ahora se usa contactarONG()
        
        // Información de ubicación
        const infoUbicacion = this.esComunidadAyuda && ubicacionInfo ? `
            <div style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-left: 4px solid #10B981; padding: 15px; border-radius: 10px; margin: 15px 0; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-map-marker-alt" style="color: #10B981; font-size: 1.5rem;"></i>
                <div>
                    <strong style="color: #047857;">📍 Ubicación:</strong>
                    <span style="color: #374151; margin-left: 5px;">
                        ${this.escapeHtml(ubicacionInfo.zona)}, ${this.escapeHtml(ubicacionInfo.provincia)}, ${this.escapeHtml(ubicacionInfo.pais)}
                    </span>
                </div>
            </div>
        ` : '';
        
        // Badge de "leído por admin" - mostrar para:
        // 1. Admins en paneles de verificación
        // 2. Autores de los posts (para que sepan si su post fue revisado)
        const esAutor = post.autor_hash === this.autorHash;
        const mostrarBadgeLeido = esPanelVerificacion || esAutor;
        
        let badgeLeidoAdmin = '';
        if (mostrarBadgeLeido) {
            if (fueLeidoPorAdmin) {
                badgeLeidoAdmin = '<span style="background: #10B981; color: white; padding: 4px 10px; border-radius: 15px; font-size: 0.75rem; margin-left: 8px; font-weight: 600;" title="Tu post ha sido revisado por un administrador"><i class="fas fa-check-circle"></i> Revisado</span>';
            } else {
                badgeLeidoAdmin = '<span style="background: #F59E0B; color: white; padding: 4px 10px; border-radius: 15px; font-size: 0.75rem; margin-left: 8px; font-weight: 600;" title="Tu post aún no ha sido revisado por un administrador"><i class="fas fa-clock"></i> Pendiente</span>';
            }
        }
        
        return `
            <div class="post" data-post-id="${post.id}" data-pais="${ubicacionInfo ? this.escapeHtml(ubicacionInfo.pais) : ''}" data-provincia="${ubicacionInfo ? this.escapeHtml(ubicacionInfo.provincia) : ''}" data-zona="${ubicacionInfo ? this.escapeHtml(ubicacionInfo.zona) : ''}">
                <div class="post-header">
                    <div class="post-autor">
                        <strong>${this.escapeHtml(post.autor_alias || 'Anónimo')}${badgeVerificado}${badgeLeidoAdmin}</strong>
                        <span class="post-fecha">${fecha}</span>
                    </div>
                    <div class="post-acciones">
                        ${botonesAutor}
                    </div>
                </div>
                ${post.titulo ? `<h3 class="post-titulo">${this.escapeHtml(post.titulo)}</h3>` : ''}
                <div class="post-contenido">${this.formatearTexto(post.contenido)}</div>
                ${infoUbicacion}
                ${mensajeEspera}
                <div class="post-footer">
                    <button class="btn-comentar" onclick="foroComunidad.mostrarFormularioComentario('${post.id}')">
                        <i class="fas fa-comment"></i> Comentar (${post.num_comentarios || 0})
                    </button>
                    ${botonEstoyCerca}
                    <div class="reacciones-container" style="display: inline-flex; gap: 5px; align-items: center;">
                        <button class="btn-reaccionar" onclick="foroComunidad.mostrarMenuReacciones('${post.id}')" title="Reaccionar">
                            <i class="fas fa-smile"></i> Reaccionar
                        </button>
                        <div class="reacciones-contadores" style="display: inline-flex; gap: 8px; margin-left: 5px; flex-wrap: wrap;">
                            ${(post.reacciones?.apoyo || 0) > 0 ? `<span style="color: #EF4444; font-size: 0.85rem;"><i class="fas fa-heart"></i> ${post.reacciones.apoyo}</span>` : ''}
                            ${(post.reacciones?.entristece || 0) > 0 ? `<span style="color: #3B82F6; font-size: 0.85rem;"><i class="fas fa-sad-tear"></i> ${post.reacciones.entristece}</span>` : ''}
                            ${(post.reacciones?.me_identifico || 0) > 0 ? `<span style="color: #8B5CF6; font-size: 0.85rem;"><i class="fas fa-hand-paper"></i> ${post.reacciones.me_identifico}</span>` : ''}
                            ${(post.reacciones?.gracias || 0) > 0 ? `<span style="color: #10B981; font-size: 0.85rem;"><i class="fas fa-hands-clapping"></i> ${post.reacciones.gracias}</span>` : ''}
                            ${(post.reacciones?.felicidades || 0) > 0 ? `<span style="color: #F59E0B; font-size: 0.85rem;">🎉 ${post.reacciones.felicidades}</span>` : ''}
                            ${(post.reacciones?.rezo || 0) > 0 ? `<span style="color: #8B5CF6; font-size: 0.85rem;">🙏 ${post.reacciones.rezo}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="comentarios-container" id="comentarios-${post.id}">
                    <!-- Comentarios se cargarán aquí -->
                </div>
            </div>
        `;
    }
    
    // Obtener mensaje de espera
    obtenerMensajeEspera() {
        return `
            <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #F59E0B; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
                <div style="display: flex; align-items: start; gap: 15px;">
                    <div style="font-size: 2rem;">⏳</div>
                    <div style="flex: 1;">
                        <h4 style="color: #92400E; margin: 0 0 10px 0; font-size: 1.1rem;">
                            <i class="fas fa-clock"></i> Mensaje de Espera
                        </h4>
                        <p style="color: #92400E; margin: 0 0 10px 0; line-height: 1.8; font-size: 0.95rem;">
                            <strong>Queremos ayudar a todos, pero no podemos con el tiempo.</strong> 
                            Por favor, tené paciencia. Intentamos responder lo más pronto posible.
                        </p>
                        <p style="color: #92400E; margin: 0; line-height: 1.8; font-size: 0.95rem;">
                            <strong>Si han pasado más de 7 días sin respuesta:</strong> Por favor, contactá a 
                            <strong>CRISLA</strong> o escribinos a nuestro correo. Estamos trabajando para atender todas las solicitudes.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    
    async cargarComentarios(postId) {
        const container = document.getElementById(`comentarios-${postId}`);
        if (!container) return;
        
        try {
            let comentarios = [];
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('comentarios_comunidades')
                    .select('*')
                    .eq('post_id', postId)
                    .eq('estado', 'publicado')
                    .is('comentario_padre_id', null) // Solo comentarios principales
                    .order('created_at', { ascending: true });
                
                if (error) throw error;
                comentarios = data || [];
            } else {
                // Modo local
                comentarios = JSON.parse(localStorage.getItem(`comentarios_${this.comunidadSlug}`) || '[]')
                    .filter(c => c.post_id === postId && c.estado === 'publicado' && !c.comentario_padre_id)
                    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            }
            
            if (comentarios.length === 0) {
                container.innerHTML = '';
                return;
            }
            
            container.innerHTML = `
                <div class="comentarios-list">
                    ${comentarios.map(c => this.renderizarComentario(c)).join('')}
                </div>
            `;
            
        } catch (error) {
            console.error('❌ Error al cargar comentarios:', error);
        }
    }
    
    renderizarComentario(comentario) {
        const fecha = new Date(comentario.created_at).toLocaleDateString('es-AR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const esAutor = comentario.autor_hash === this.autorHash;
        const botonesAutor = esAutor ? `
            <button class="btn-editar-comentario" onclick="foroComunidad.editarComentario('${comentario.id}')" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-borrar-comentario" onclick="foroComunidad.borrarComentario('${comentario.id}')" title="Borrar">
                <i class="fas fa-trash"></i>
            </button>
        ` : '';
        
        return `
            <div class="comentario" data-comentario-id="${comentario.id}">
                <div class="comentario-header">
                    <strong>${this.escapeHtml(comentario.autor_alias || 'Anónimo')}</strong>
                    <span class="comentario-fecha">${fecha}</span>
                    ${botonesAutor}
                </div>
                <div class="comentario-contenido">${this.formatearTexto(comentario.contenido)}</div>
            </div>
        `;
    }
    
    mostrarFormularioComentario(postId) {
        if (!this.autorAlias) {
            this.pedirAlias();
            return;
        }
        
        const container = document.getElementById(`comentarios-${postId}`);
        if (!container) return;
        
        // Verificar si ya existe un formulario
        let formContainer = container.querySelector('.form-comentar');
        if (formContainer) {
            formContainer.style.display = 'block';
            return;
        }
        
        // Crear formulario
        formContainer = document.createElement('div');
        formContainer.className = 'form-comentar';
        formContainer.innerHTML = `
            <textarea id="comentario-${postId}" placeholder="Escribí tu comentario de apoyo..." rows="3"></textarea>
            <div class="form-comentar-botones">
                <button class="btn btn-primary" onclick="foroComunidad.crearComentario('${postId}')">
                    <i class="fas fa-paper-plane"></i> Comentar
                </button>
                <button class="btn btn-secondary" onclick="this.closest('.form-comentar').style.display='none'">
                    Cancelar
                </button>
            </div>
        `;
        
        container.appendChild(formContainer);
    }
    
    async crearComentario(postId) {
        // Verificar si está baneado
        const banInfo = await this.verificarBan();
        if (banInfo) {
            alert(`⚠️ No podés comentar en esta comunidad.\n\nMotivo: ${banInfo.motivo}\n\nSi creés que esto es un error, contactá a CRISLA.`);
            return;
        }
        
        const textarea = document.getElementById(`comentario-${postId}`);
        if (!textarea) return;
        
        const contenido = textarea.value.trim();
        if (!contenido || contenido.length < 3) {
            alert('Por favor, escribí al menos 3 caracteres.');
            return;
        }
        
        const comentarioData = {
            post_id: postId,
            autor_hash: this.autorHash,
            autor_alias: this.autorAlias || 'Anónimo',
            contenido: contenido,
            estado: 'publicado'
        };
        
        try {
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('comentarios_comunidades')
                    .insert([comentarioData])
                    .select()
                    .single();
                
                if (error) throw error;
                
                this.mostrarMensaje('Comentario publicado', 'success');
                
                // Notificar al autor del post sobre el nuevo comentario
                this.notificarNuevoComentario(postId, data);
                
                this.cargarComentarios(postId);
                textarea.value = '';
            } else {
                // Modo local
                const comentarios = JSON.parse(localStorage.getItem(`comentarios_${this.comunidadSlug}`) || '[]');
                const nuevoComentario = {
                    id: 'local_' + Date.now(),
                    ...comentarioData,
                    created_at: new Date().toISOString()
                };
                comentarios.push(nuevoComentario);
                localStorage.setItem(`comentarios_${this.comunidadSlug}`, JSON.stringify(comentarios));
                
                this.mostrarMensaje('Comentario publicado (modo local)', 'success');
                this.cargarComentarios(postId);
                textarea.value = '';
            }
        } catch (error) {
            console.error('❌ Error al crear comentario:', error);
            this.mostrarMensaje('Error al publicar el comentario.', 'error');
        }
    }
    
    async borrarPost(postId) {
        if (!confirm('¿Estás seguro/a de que querés borrar este post? Esta acción no se puede deshacer.')) {
            return;
        }
        
        try {
            if (this.supabase) {
                const { error } = await this.supabase
                    .from('posts_comunidades')
                    .update({ estado: 'eliminado', deleted_at: new Date().toISOString() })
                    .eq('id', postId)
                    .eq('autor_hash', this.autorHash);
                
                if (error) throw error;
            } else {
                // Modo local
                const posts = JSON.parse(localStorage.getItem(`posts_${this.comunidadSlug}`) || '[]');
                const index = posts.findIndex(p => p.id === postId && p.autor_hash === this.autorHash);
                if (index !== -1) {
                    posts[index].estado = 'eliminado';
                    posts[index].deleted_at = new Date().toISOString();
                    localStorage.setItem(`posts_${this.comunidadSlug}`, JSON.stringify(posts));
                }
            }
            
            this.cargarPosts();
            this.mostrarMensaje('Post borrado', 'success');
        } catch (error) {
            console.error('❌ Error al borrar post:', error);
            this.mostrarMensaje('Error al borrar el post.', 'error');
        }
    }
    
    async borrarComentario(comentarioId) {
        if (!confirm('¿Borrar este comentario?')) return;
        
        try {
            if (this.supabase) {
                const { error } = await this.supabase
                    .from('comentarios_comunidades')
                    .update({ estado: 'eliminado', deleted_at: new Date().toISOString() })
                    .eq('id', comentarioId)
                    .eq('autor_hash', this.autorHash);
                
                if (error) throw error;
            } else {
                // Modo local
                const comentarios = JSON.parse(localStorage.getItem(`comentarios_${this.comunidadSlug}`) || '[]');
                const index = comentarios.findIndex(c => c.id === comentarioId && c.autor_hash === this.autorHash);
                if (index !== -1) {
                    comentarios[index].estado = 'eliminado';
                    comentarios[index].deleted_at = new Date().toISOString();
                    localStorage.setItem(`comentarios_${this.comunidadSlug}`, JSON.stringify(comentarios));
                }
            }
            
            // Recargar comentarios
            const comentario = document.querySelector(`[data-comentario-id="${comentarioId}"]`);
            if (comentario) {
                const post = comentario.closest('.post');
                if (post) {
                    const postId = post.dataset.postId;
                    this.cargarComentarios(postId);
                }
            }
            
            this.mostrarMensaje('Comentario borrado', 'success');
        } catch (error) {
            console.error('❌ Error al borrar comentario:', error);
            this.mostrarMensaje('Error al borrar el comentario.', 'error');
        }
    }
    
    async editarPost(postId) {
        try {
            // Obtener el post actual
            let post = null;
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('posts_comunidades')
                    .select('*')
                    .eq('id', postId)
                    .eq('autor_hash', this.autorHash)
                    .single();
                
                if (error) throw error;
                post = data;
            } else {
                // Modo local
                const posts = JSON.parse(localStorage.getItem(`posts_${this.comunidadSlug}`) || '[]');
                post = posts.find(p => p.id === postId && p.autor_hash === this.autorHash);
            }
            
            if (!post) {
                this.mostrarMensaje('No se encontró el post o no tenés permiso para editarlo.', 'error');
                return;
            }
            
            // Crear modal de edición con estilos mejorados
            const modalHTML = `
                <div id="modal-editar-post" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease;">
                    <div style="background: white; border-radius: 20px; padding: 0; max-width: 700px; width: 90%; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.3s ease; display: flex; flex-direction: column;">
                        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 25px 30px; display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                                <i class="fas fa-edit"></i> Editar Post
                            </h3>
                            <button onclick="document.getElementById('modal-editar-post').remove()" style="background: rgba(255,255,255,0.2); border: none; width: 35px; height: 35px; border-radius: 50%; color: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <form id="form-editar-post" style="padding: 30px; flex: 1; overflow-y: auto;">
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #374151; font-size: 1rem;">
                                    <i class="fas fa-heading" style="color: #8b5cf6; margin-right: 8px;"></i>
                                    Título (opcional)
                                </label>
                                <input type="text" id="edit-post-titulo" value="${this.escapeHtml(post.titulo || '')}" style="width: 100%; padding: 15px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 1rem; font-family: inherit; transition: all 0.3s;" onfocus="this.style.borderColor='#8b5cf6'; this.style.boxShadow='0 0 0 3px rgba(139,92,246,0.1)'" onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
                                <small style="display: block; margin-top: 8px; color: #6b7280; font-size: 0.875rem;">
                                    <i class="fas fa-info-circle"></i> Un título ayuda a que otros encuentren tu post más fácilmente.
                                </small>
                            </div>
                            <div style="margin-bottom: 25px;">
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #374151; font-size: 1rem;">
                                    <i class="fas fa-align-left" style="color: #8b5cf6; margin-right: 8px;"></i>
                                    Contenido
                                </label>
                                <textarea id="edit-post-contenido" rows="10" required style="width: 100%; padding: 15px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 1rem; resize: vertical; font-family: inherit; transition: all 0.3s; line-height: 1.6;" onfocus="this.style.borderColor='#8b5cf6'; this.style.boxShadow='0 0 0 3px rgba(139,92,246,0.1)'" onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">${this.escapeHtml(post.contenido)}</textarea>
                                <small style="display: block; margin-top: 8px; color: #6b7280; font-size: 0.875rem;">
                                    <i class="fas fa-info-circle"></i> Mínimo 10 caracteres. Podés editar tu post las veces que necesites.
                                </small>
                            </div>
                            <div style="display: flex; gap: 12px; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f3f4f6;">
                                <button type="submit" style="flex: 1; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; border: none; padding: 14px 28px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(139,92,246,0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(139,92,246,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(139,92,246,0.3)'">
                                    <i class="fas fa-save"></i> Guardar Cambios
                                </button>
                                <button type="button" onclick="document.getElementById('modal-editar-post').remove()" style="background: #f3f4f6; color: #374151; border: none; padding: 14px 28px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { 
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    #modal-editar-post input:focus,
                    #modal-editar-post textarea:focus {
                        outline: none;
                    }
                    @media (max-width: 768px) {
                        #modal-editar-post > div {
                            width: 95% !important;
                            max-height: 95vh !important;
                        }
                        #modal-editar-post form {
                            padding: 20px !important;
                        }
                        #modal-editar-post .form-actions {
                            flex-direction: column !important;
                        }
                        #modal-editar-post button {
                            width: 100% !important;
                        }
                    }
                </style>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Manejar envío del formulario
            document.getElementById('form-editar-post').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const titulo = document.getElementById('edit-post-titulo').value.trim();
                const contenido = document.getElementById('edit-post-contenido').value.trim();
                
                if (!contenido || contenido.length < 10) {
                    alert('Por favor, escribí al menos 10 caracteres en tu mensaje.');
                    return;
                }
                
                try {
                    if (this.supabase) {
                        const { error } = await this.supabase
                            .from('posts_comunidades')
                            .update({
                                titulo: titulo || null,
                                contenido: contenido,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', postId)
                            .eq('autor_hash', this.autorHash);
                        
                        if (error) throw error;
                    } else {
                        // Modo local
                        const posts = JSON.parse(localStorage.getItem(`posts_${this.comunidadSlug}`) || '[]');
                        const index = posts.findIndex(p => p.id === postId && p.autor_hash === this.autorHash);
                        if (index !== -1) {
                            posts[index].titulo = titulo || null;
                            posts[index].contenido = contenido;
                            posts[index].updated_at = new Date().toISOString();
                            localStorage.setItem(`posts_${this.comunidadSlug}`, JSON.stringify(posts));
                        }
                    }
                    
                    this.mostrarMensaje('✅ Post editado correctamente.', 'success');
                    document.getElementById('modal-editar-post').remove();
                    this.cargarPosts();
                    if (document.getElementById('mi-historial-foro-lista')) {
                        this.cargarMiHistorial();
                    }
                } catch (error) {
                    console.error('Error editando post:', error);
                    this.mostrarMensaje('Error al editar el post. Por favor, intentá de nuevo.', 'error');
                }
            });
            
        } catch (error) {
            console.error('Error al editar post:', error);
            this.mostrarMensaje('Error al cargar el post para editar.', 'error');
        }
    }
    
    async editarComentario(comentarioId) {
        try {
            // Obtener el comentario actual
            let comentario = null;
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('comentarios_comunidades')
                    .select('*')
                    .eq('id', comentarioId)
                    .eq('autor_hash', this.autorHash)
                    .single();
                
                if (error) throw error;
                comentario = data;
            } else {
                // Modo local
                const comentarios = JSON.parse(localStorage.getItem(`comentarios_${this.comunidadSlug}`) || '[]');
                comentario = comentarios.find(c => c.id === comentarioId && c.autor_hash === this.autorHash);
            }
            
            if (!comentario) {
                this.mostrarMensaje('No se encontró el comentario o no tenés permiso para editarlo.', 'error');
                return;
            }
            
            // Obtener el post padre para recargar comentarios después
            const postId = comentario.post_id;
            
            // Crear modal de edición con estilos mejorados
            const modalHTML = `
                <div id="modal-editar-comentario" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s ease;">
                    <div style="background: white; border-radius: 20px; padding: 0; max-width: 600px; width: 90%; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.3s ease; display: flex; flex-direction: column;">
                        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 25px 30px; display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                                <i class="fas fa-edit"></i> Editar Comentario
                            </h3>
                            <button onclick="document.getElementById('modal-editar-comentario').remove()" style="background: rgba(255,255,255,0.2); border: none; width: 35px; height: 35px; border-radius: 50%; color: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <form id="form-editar-comentario" style="padding: 30px; flex: 1; overflow-y: auto;">
                            <div style="margin-bottom: 25px;">
                                <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #374151; font-size: 1rem;">
                                    <i class="fas fa-comment-dots" style="color: #8b5cf6; margin-right: 8px;"></i>
                                    Contenido del Comentario
                                </label>
                                <textarea id="edit-comentario-contenido" rows="8" required style="width: 100%; padding: 15px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 1rem; resize: vertical; font-family: inherit; transition: all 0.3s; line-height: 1.6;" onfocus="this.style.borderColor='#8b5cf6'; this.style.boxShadow='0 0 0 3px rgba(139,92,246,0.1)'" onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">${this.escapeHtml(comentario.contenido)}</textarea>
                                <small style="display: block; margin-top: 8px; color: #6b7280; font-size: 0.875rem;">
                                    <i class="fas fa-info-circle"></i> Podés editar tu comentario las veces que necesites.
                                </small>
                            </div>
                            <div style="display: flex; gap: 12px; margin-top: 30px; padding-top: 20px; border-top: 2px solid #f3f4f6;">
                                <button type="submit" style="flex: 1; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; border: none; padding: 14px 28px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(139,92,246,0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(139,92,246,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(139,92,246,0.3)'">
                                    <i class="fas fa-save"></i> Guardar Cambios
                                </button>
                                <button type="button" onclick="document.getElementById('modal-editar-comentario').remove()" style="background: #f3f4f6; color: #374151; border: none; padding: 14px 28px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: all 0.3s;" onmouseover="this.style.background='#e5e7eb'" onmouseout="this.style.background='#f3f4f6'">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <style>
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { 
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    #modal-editar-comentario textarea:focus {
                        outline: none;
                    }
                    @media (max-width: 768px) {
                        #modal-editar-comentario > div {
                            width: 95% !important;
                            max-height: 95vh !important;
                        }
                        #modal-editar-comentario form {
                            padding: 20px !important;
                        }
                        #modal-editar-comentario .form-actions {
                            flex-direction: column !important;
                        }
                        #modal-editar-comentario button {
                            width: 100% !important;
                        }
                    }
                </style>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Manejar envío del formulario
            document.getElementById('form-editar-comentario').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const contenido = document.getElementById('edit-comentario-contenido').value.trim();
                
                if (!contenido || contenido.length < 3) {
                    alert('Por favor, escribí al menos 3 caracteres.');
                    return;
                }
                
                try {
                    if (this.supabase) {
                        const { error } = await this.supabase
                            .from('comentarios_comunidades')
                            .update({
                                contenido: contenido,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', comentarioId)
                            .eq('autor_hash', this.autorHash);
                        
                        if (error) throw error;
                    } else {
                        // Modo local
                        const comentarios = JSON.parse(localStorage.getItem(`comentarios_${this.comunidadSlug}`) || '[]');
                        const index = comentarios.findIndex(c => c.id === comentarioId && c.autor_hash === this.autorHash);
                        if (index !== -1) {
                            comentarios[index].contenido = contenido;
                            comentarios[index].updated_at = new Date().toISOString();
                            localStorage.setItem(`comentarios_${this.comunidadSlug}`, JSON.stringify(comentarios));
                        }
                    }
                    
                    this.mostrarMensaje('✅ Comentario editado correctamente.', 'success');
                    document.getElementById('modal-editar-comentario').remove();
                    this.cargarComentarios(postId);
                } catch (error) {
                    console.error('Error editando comentario:', error);
                    this.mostrarMensaje('Error al editar el comentario. Por favor, intentá de nuevo.', 'error');
                }
            });
            
        } catch (error) {
            console.error('Error al editar comentario:', error);
            this.mostrarMensaje('Error al cargar el comentario para editar.', 'error');
        }
    }
    
    // Obtener un post por ID
    async obtenerPost(postId) {
        try {
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('posts_comunidades')
                    .select('*')
                    .eq('id', postId)
                    .single();
                
                if (error) throw error;
                return data;
            } else {
                const postsKey = `posts_${this.comunidadSlug}`;
                const posts = JSON.parse(localStorage.getItem(postsKey) || '[]');
                return posts.find(p => p.id === postId) || null;
            }
        } catch (error) {
            console.error('Error obteniendo post:', error);
            return null;
        }
    }
    
    // Verificar si un post tiene avances
    verificarAvancesPost(post) {
        if (!post) return false;
        
        // Verificar si hay comentarios de CRISLA o administradores
        // Verificar si el estado cambió (de pendiente a en_proceso, etc.)
        // Verificar si hay actualizaciones recientes
        const estadosConAvance = ['en_proceso', 'revisado', 'completado', 'resuelto'];
        if (estadosConAvance.includes(post.estado)) {
            return true;
        }
        
        // Verificar si hay comentarios recientes (menos de 7 días)
        if (post.ultima_actividad) {
            const ultimaActividad = new Date(post.ultima_actividad);
            const ahora = new Date();
            const diasDiferencia = (ahora - ultimaActividad) / (1000 * 60 * 60 * 24);
            if (diasDiferencia <= 7 && post.num_comentarios > 0) {
                return true;
            }
        }
        
        // Verificar si hay actualizaciones en el contenido (metadata)
        if (post.metadata && post.metadata.actualizaciones && post.metadata.actualizaciones.length > 0) {
            return true;
        }
        
        return false;
    }
    
    // Mostrar menú de reacciones
    async mostrarMenuReacciones(postId) {
        // Eliminar menú existente si hay
        const menuExistente = document.getElementById(`menu-reacciones-${postId}`);
        if (menuExistente) {
            menuExistente.remove();
            return;
        }
        
        // Crear menú de reacciones
        const menu = document.createElement('div');
        menu.id = `menu-reacciones-${postId}`;
        menu.style.cssText = `
            position: absolute;
            background: white;
            border-radius: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            padding: 10px;
            display: flex;
            gap: 10px;
            z-index: 10000;
            border: 2px solid #E5E7EB;
        `;
        
        // Obtener el post para verificar si hay avances
        const post = await this.obtenerPost(postId);
        const tieneAvances = this.verificarAvancesPost(post);
        
        const reacciones = [
            { tipo: 'apoyo', icono: '❤️', texto: 'Apoyo', color: '#EF4444' },
            { tipo: 'entristece', icono: '😢', texto: 'Me entristece', color: '#3B82F6' },
            { tipo: 'me_identifico', icono: '✋', texto: 'Me identifico', color: '#8B5CF6' },
            { tipo: 'gracias', icono: '👏', texto: 'Gracias', color: '#10B981' },
            // Reacciones especiales según avances
            ...(tieneAvances ? [
                { tipo: 'felicidades', icono: '🎉', texto: '¡Felicidades!', color: '#F59E0B' }
            ] : [
                { tipo: 'rezo', icono: '🙏', texto: 'Rezo por ti', color: '#8B5CF6' }
            ])
        ];
        
        reacciones.forEach(reaccion => {
            const boton = document.createElement('button');
            boton.style.cssText = `
                background: transparent;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s;
            `;
            boton.innerHTML = reaccion.icono;
            boton.title = reaccion.texto;
            boton.onmouseover = () => {
                boton.style.transform = 'scale(1.3)';
                boton.style.background = '#F3F4F6';
            };
            boton.onmouseout = () => {
                boton.style.transform = 'scale(1)';
                boton.style.background = 'transparent';
            };
            boton.onclick = () => {
                this.reaccionarPost(postId, reaccion.tipo);
                menu.remove();
            };
            menu.appendChild(boton);
        });
        
        // Posicionar el menú cerca del botón
        const botonReaccion = document.querySelector(`[onclick*="mostrarMenuReacciones('${postId}')"]`);
        if (botonReaccion) {
            const rect = botonReaccion.getBoundingClientRect();
            menu.style.position = 'fixed';
            menu.style.top = (rect.top - 60) + 'px';
            menu.style.left = rect.left + 'px';
        }
        
        document.body.appendChild(menu);
        
        // Cerrar al hacer click fuera
        setTimeout(() => {
            const cerrarMenu = (e) => {
                if (!menu.contains(e.target) && e.target !== botonReaccion) {
                    menu.remove();
                    document.removeEventListener('click', cerrarMenu);
                }
            };
            setTimeout(() => {
                document.addEventListener('click', cerrarMenu);
            }, 100);
        }, 10);
    }
    
    async reaccionarPost(postId, tipoReaccion = 'apoyo') {
        try {
            // Obtener post actual
            let post = null;
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('posts_comunidades')
                    .select('reacciones, num_reacciones')
                    .eq('id', postId)
                    .single();
                
                if (error) throw error;
                post = data;
            } else {
                // Modo local
                const postsKey = `posts_${this.comunidadSlug}`;
                const posts = JSON.parse(localStorage.getItem(postsKey) || '[]');
                post = posts.find(p => p.id === postId);
            }
            
            if (!post) {
                this.mostrarMensaje('Post no encontrado', 'error');
                return;
            }
            
            // Inicializar objeto de reacciones si no existe
            if (!post.reacciones || typeof post.reacciones !== 'object') {
                post.reacciones = {
                    apoyo: 0,
                    entristece: 0,
                    me_identifico: 0,
                    gracias: 0,
                    felicidades: 0,
                    rezo: 0
                };
            }
            
            // Incrementar reacción específica
            post.reacciones[tipoReaccion] = (post.reacciones[tipoReaccion] || 0) + 1;
            
            // Calcular total de reacciones
            const totalReacciones = Object.values(post.reacciones).reduce((sum, val) => sum + (val || 0), 0);
            
            const mensajes = {
                'apoyo': '💜 Gracias por tu apoyo',
                'entristece': '💙 Entendemos tu sentimiento',
                'me_identifico': '💜 Me alegra que te identifiques',
                'gracias': '💚 Gracias por compartir',
                'felicidades': '🎉 ¡Qué alegría saber que hay avances!',
                'rezo': '🙏 Tu apoyo espiritual es muy valioso'
            };
            
            if (this.supabase) {
                const { error } = await this.supabase
                    .from('posts_comunidades')
                    .update({ 
                        reacciones: post.reacciones,
                        num_reacciones: totalReacciones
                    })
                    .eq('id', postId);
                
                if (error) throw error;
            } else {
                // Modo local
                const postsKey = `posts_${this.comunidadSlug}`;
                const posts = JSON.parse(localStorage.getItem(postsKey) || '[]');
                const postIndex = posts.findIndex(p => p.id === postId);
                if (postIndex !== -1) {
                    posts[postIndex].reacciones = post.reacciones;
                    posts[postIndex].num_reacciones = totalReacciones;
                    localStorage.setItem(postsKey, JSON.stringify(posts));
                }
            }
            
            // Recargar posts para actualizar UI
            await this.cargarPosts();
            
            this.mostrarMensaje(mensajes[tipoReaccion] || '💜 Gracias', 'success');
        } catch (error) {
            console.error('Error reaccionando al post:', error);
            this.mostrarMensaje('Error al reaccionar. Por favor, intenta nuevamente.', 'error');
        }
    }
    
    configurarBotonesComentarios() {
        // Los botones ya están configurados en el HTML renderizado
    }
    
    // Notificar nuevo comentario
    async notificarNuevoComentario(postId, comentarioData) {
        try {
            // Obtener información del post
            const post = await this.supabase
                .from('posts_comunidades')
                .select('autor_hash, autor_alias, titulo')
                .eq('id', postId)
                .single();
            
            if (!post.data) return;
            
            // Solo notificar si el comentario NO es del autor del post
            if (post.data.autor_hash === this.autorHash) return;
            
            // Verificar si el usuario tiene notificaciones habilitadas
            const notificacionesHabilitadas = localStorage.getItem(`notificaciones_comentarios_${this.comunidadSlug}`) !== 'false';
            
            if (notificacionesHabilitadas && 'Notification' in window && Notification.permission === 'granted') {
                const tituloPost = post.data.titulo || 'tu post';
                const autorComentario = comentarioData.autor_alias || 'Alguien';
                
                const notificacion = new Notification(`💬 Nuevo comentario en ${tituloPost}`, {
                    body: `${autorComentario} comentó: ${comentarioData.contenido.substring(0, 50)}...`,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: `comentario-${postId}-${comentarioData.id}`,
                    requireInteraction: false,
                    silent: false
                });
                
                notificacion.onclick = () => {
                    window.focus();
                    // Scroll al post
                    const postEl = document.querySelector(`[data-post-id="${postId}"]`);
                    if (postEl) {
                        postEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    notificacion.close();
                };
                
                // Auto-cerrar después de 5 segundos
                setTimeout(() => {
                    notificacion.close();
                }, 5000);
            }
        } catch (error) {
            console.error('Error notificando comentario:', error);
        }
    }
    
    // Utilidades
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatearTexto(texto) {
        // Convertir saltos de línea a <br>
        let html = this.escapeHtml(texto);
        html = html.replace(/\n/g, '<br>');
        return html;
    }
    
    mostrarMensaje(mensaje, tipo = 'info') {
        // Crear o actualizar mensaje
        let mensajeEl = document.getElementById('mensaje-foro');
        if (!mensajeEl) {
            mensajeEl = document.createElement('div');
            mensajeEl.id = 'mensaje-foro';
            mensajeEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(mensajeEl);
        }
        
        mensajeEl.textContent = mensaje;
        mensajeEl.style.backgroundColor = tipo === 'success' ? '#10B981' : tipo === 'error' ? '#EF4444' : '#667eea';
        mensajeEl.style.display = 'block';
        
        setTimeout(() => {
            mensajeEl.style.display = 'none';
        }, 3000);
    }
    
    // ===== CARGAR MI HISTORIAL =====
    async cargarMiHistorial() {
        if (!this.supabase || !this.autorHash) {
            const container = document.getElementById('mi-historial-foro-lista');
            if (container) {
                container.innerHTML = `
                    <div class="sin-posts">
                        <p>No se pudo cargar tu historial. Por favor, recarga la página.</p>
                    </div>
                `;
            }
            return;
        }
        
        try {
            // Cargar TODOS los posts del usuario (incluyendo pausados, ocultos, cerrados, etc.)
            const { data, error } = await this.supabase
                .from('posts_comunidades')
                .select('*')
                .eq('comunidad_slug', this.comunidadSlug)
                .eq('autor_hash', this.autorHash)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            this.mostrarMiHistorial(data || []);
        } catch (error) {
            console.error('Error cargando historial:', error);
            const container = document.getElementById('mi-historial-foro-lista') || 
                             document.getElementById('mi-historial-lista');
            if (container) {
                container.innerHTML = `
                    <div class="sin-posts" style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444; margin-bottom: 15px;"></i>
                        <p style="color: #6b7280;">Error al cargar tu historial. Por favor, intenta nuevamente.</p>
                    </div>
                `;
            }
        }
    }
    
    // ===== CARGAR HISTORIAL DE PERSONAS AYUDADAS =====
    async cargarHistorialPersonasAyudadas() {
        // Solo para comunidades de solidario y emergencias
        const comunidadesConAyuda = ['cresalia-solidario', 'cresalia-solidario-emergencias'];
        if (!comunidadesConAyuda.includes(this.comunidadSlug)) {
            return;
        }
        
        if (!this.supabase || !this.autorHash) {
            return;
        }
        
        try {
            // Buscar donaciones realizadas por el usuario
            // Esto requiere una tabla de donaciones o relacionar con campañas
            const { data: donaciones, error } = await this.supabase
                .from('donaciones_campanas')
                .select(`
                    *,
                    campanas:campana_id (
                        id,
                        titulo,
                        monto_objetivo,
                        monto_recaudado,
                        estado
                    )
                `)
                .eq('donante_hash', this.autorHash)
                .order('created_at', { ascending: false });
            
            if (error && error.code !== 'PGRST116') { // PGRST116 = tabla no existe
                console.warn('Tabla de donaciones no encontrada, usando modo local');
            }
            
            // Si no hay tabla, usar localStorage
            const donacionesLocales = JSON.parse(localStorage.getItem(`donaciones_${this.autorHash}`) || '[]');
            this.mostrarHistorialPersonasAyudadas(donaciones || donacionesLocales);
        } catch (error) {
            console.error('Error cargando historial de personas ayudadas:', error);
            // Intentar con localStorage
            const donacionesLocales = JSON.parse(localStorage.getItem(`donaciones_${this.autorHash}`) || '[]');
            this.mostrarHistorialPersonasAyudadas(donacionesLocales);
        }
    }
    
    // ===== MOSTRAR HISTORIAL DE PERSONAS AYUDADAS =====
    mostrarHistorialPersonasAyudadas(donaciones) {
        const container = document.getElementById('historial-personas-ayudadas');
        if (!container) {
            // Intentar crear el contenedor si no existe
            const historialContainer = document.getElementById('mi-historial-foro-lista');
            if (historialContainer) {
                const nuevoContainer = document.createElement('div');
                nuevoContainer.id = 'historial-personas-ayudadas';
                historialContainer.parentNode.insertBefore(nuevoContainer, historialContainer.nextSibling);
            } else {
                return;
            }
        }
        
        if (!donaciones || donaciones.length === 0) {
            container.innerHTML = `
                <div class="sin-posts" style="text-align: center; padding: 40px;">
                    <h3>💜 Aún no has ayudado a nadie</h3>
                    <p>Cuando hagas una donación, aparecerá aquí.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = donaciones.map(donacion => {
            const fecha = new Date(donacion.created_at || donacion.fecha).toLocaleString('es-AR');
            const campana = donacion.campanas || donacion.campana || {};
            
            return `
                <div class="post-card" style="margin-bottom: 20px; background: linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%); padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-left: 4px solid #10B981;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <h3 style="color: #374151; margin: 0 0 5px 0;">
                                <i class="fas fa-heart" style="color: #10B981;"></i> 
                                ${this.escapeHtml(campana.titulo || 'Campaña de ayuda')}
                            </h3>
                            <span style="background: #10B981; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">
                                ✅ Ayuda proporcionada
                            </span>
                        </div>
                        <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                    </div>
                    
                    <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="color: #374151; font-weight: 600;">Monto donado:</span>
                            <span style="color: #10B981; font-size: 1.2rem; font-weight: 700;">$${parseFloat(donacion.monto || 0).toLocaleString('es-AR', {minimumFractionDigits: 2})}</span>
                        </div>
                        ${campana.monto_objetivo ? `
                            <div style="background: #E5E7EB; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 10px;">
                                <div style="background: #10B981; height: 100%; width: ${Math.min(100, (campana.monto_recaudado || 0) / campana.monto_objetivo * 100)}%; transition: width 0.3s;"></div>
                            </div>
                            <p style="color: #6b7280; font-size: 0.85rem; margin-top: 5px; text-align: right;">
                                ${((campana.monto_recaudado || 0) / campana.monto_objetivo * 100).toFixed(1)}% del objetivo alcanzado
                            </p>
                        ` : ''}
                    </div>
                    
                    ${donacion.mensaje ? `
                        <div style="background: #F9FAFB; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                            <p style="color: #374151; margin: 0; line-height: 1.6; font-style: italic;">
                                "${this.escapeHtml(donacion.mensaje)}"
                            </p>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
    
    // ===== CARGAR HISTORIAL DE PUBLICACIONES CERRADAS =====
    async cargarHistorialPublicacionesCerradas() {
        if (!this.supabase || !this.autorHash) {
            return;
        }
        
        try {
            // Cargar posts cerrados/completados
            const { data, error } = await this.supabase
                .from('posts_comunidades')
                .select('*')
                .eq('comunidad_slug', this.comunidadSlug)
                .eq('autor_hash', this.autorHash)
                .in('estado', ['cerrado', 'completado', 'finalizado'])
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            this.mostrarHistorialPublicacionesCerradas(data || []);
        } catch (error) {
            console.error('Error cargando publicaciones cerradas:', error);
            // Intentar con localStorage
            const postsKey = `posts_${this.comunidadSlug}`;
            const todosLosPosts = JSON.parse(localStorage.getItem(postsKey) || '[]');
            const postsCerrados = todosLosPosts.filter(p => 
                p.autor_hash === this.autorHash && 
                ['cerrado', 'completado', 'finalizado'].includes(p.estado)
            );
            this.mostrarHistorialPublicacionesCerradas(postsCerrados);
        }
    }
    
    // ===== MOSTRAR HISTORIAL DE PUBLICACIONES CERRADAS =====
    mostrarHistorialPublicacionesCerradas(posts) {
        const container = document.getElementById('historial-publicaciones-cerradas');
        if (!container) {
            // Intentar crear el contenedor si no existe
            const historialContainer = document.getElementById('mi-historial-foro-lista');
            if (historialContainer) {
                const nuevoContainer = document.createElement('div');
                nuevoContainer.id = 'historial-publicaciones-cerradas';
                historialContainer.parentNode.insertBefore(nuevoContainer, historialContainer.nextSibling);
            } else {
                return;
            }
        }
        
        if (!posts || posts.length === 0) {
            container.innerHTML = `
                <div class="sin-posts" style="text-align: center; padding: 40px;">
                    <h3>📋 No hay publicaciones cerradas</h3>
                    <p>Las publicaciones completadas o cerradas aparecerán aquí.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = posts.map(post => {
            const fecha = new Date(post.created_at).toLocaleString('es-AR');
            const fechaCierre = post.fecha_cierre ? new Date(post.fecha_cierre).toLocaleString('es-AR') : 'N/A';
            
            return `
                <div class="post-card" style="margin-bottom: 20px; background: linear-gradient(135deg, #FEF3C7 0%, #FFFFFF 100%); padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-left: 4px solid #F59E0B; opacity: 0.9;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            ${post.titulo ? `<h3 style="color: #374151; margin: 0 0 5px 0;">${this.escapeHtml(post.titulo)}</h3>` : ''}
                            <span style="background: #F59E0B; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">
                                ${post.estado === 'completado' ? '✅ Completado' : post.estado === 'finalizado' ? '🏁 Finalizado' : '🔒 Cerrado'}
                            </span>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: #6b7280; font-size: 0.85rem;">Creado: ${fecha}</div>
                            <div style="color: #6b7280; font-size: 0.85rem;">Cerrado: ${fechaCierre}</div>
                        </div>
                    </div>
                    
                    <div style="background: #F9FAFB; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <p style="color: #374151; margin: 0; line-height: 1.6;">${this.escapeHtml(post.contenido.substring(0, 200))}${post.contenido.length > 200 ? '...' : ''}</p>
                    </div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.85rem; color: #6b7280;">
                        <span><i class="fas fa-comments"></i> ${post.num_comentarios || 0} comentarios</span>
                        <span><i class="fas fa-heart"></i> ${post.num_reacciones || 0} reacciones</span>
                        ${post.motivo_cierre ? `<span><i class="fas fa-info-circle"></i> ${this.escapeHtml(post.motivo_cierre)}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // ===== MOSTRAR MI HISTORIAL =====
    mostrarMiHistorial(posts) {
        // Buscar contenedor (puede tener diferentes IDs según la comunidad)
        const container = document.getElementById('mi-historial-foro-lista') || 
                         document.getElementById('mi-historial-lista');
        if (!container) {
            console.warn('⚠️ Contenedor de historial no encontrado');
            return;
        }
        
        if (!posts || posts.length === 0) {
            container.innerHTML = `
                <div class="sin-posts">
                    <h3>💜 No has creado ningún post aún</h3>
                    <p>Puedes crear tu primer post usando el botón "Crear Post" arriba.</p>
                </div>
            `;
            return;
        }
        
        const estadosBadges = {
            'publicado': '<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">✅ Publicado</span>',
            'pausado': '<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">⏸️ Pausado</span>',
            'oculto': '<span style="background: #6b7280; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">🔒 Oculto</span>',
            'eliminado': '<span style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">🗑️ Eliminado</span>',
            'moderado': '<span style="background: #dc2626; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">⚠️ Moderado</span>'
        };
        
        container.innerHTML = posts.map(post => {
            const fecha = new Date(post.created_at).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="post-card" style="margin-bottom: 20px; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            ${post.titulo ? `<h3 style="color: #374151; margin: 0 0 5px 0;">${this.escapeHtml(post.titulo)}</h3>` : ''}
                            ${estadosBadges[post.estado] || estadosBadges['publicado']}
                        </div>
                        <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <p style="color: #374151; margin: 0; line-height: 1.6;">${this.escapeHtml(post.contenido.substring(0, 200))}${post.contenido.length > 200 ? '...' : ''}</p>
                    </div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; font-size: 0.85rem; color: #6b7280; margin-bottom: 15px;">
                        <span><i class="fas fa-comments"></i> ${post.num_comentarios || 0} comentarios</span>
                        <span><i class="fas fa-heart"></i> ${post.num_reacciones || 0} reacciones</span>
                    </div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                        <button onclick="editarPostForo('${post.id}')" class="btn-primary" style="background: #8b5cf6; flex: 1; min-width: 100px; padding: 8px 16px; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="pausarPostForo('${post.id}')" class="btn-primary" style="background: #f59e0b; flex: 1; min-width: 100px; padding: 8px 16px; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-pause"></i> ${post.estado === 'pausado' ? 'Reactivar' : 'Pausar'}
                        </button>
                        <button onclick="eliminarPostForo('${post.id}')" class="btn-primary" style="background: #ef4444; flex: 1; min-width: 100px; padding: 8px 16px; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // ===== EDITAR POST (desde historial) =====
    // Esta función ya está implementada arriba, pero se mantiene aquí para compatibilidad
    
    // ===== PAUSAR/REACTIVAR POST =====
    async pausarPost(postId) {
        if (!this.supabase) {
            this.mostrarMensaje('No hay conexión con la base de datos', 'error');
            return;
        }
        
        try {
            // Obtener estado actual
            const { data: post, error: fetchError } = await this.supabase
                .from('posts_comunidades')
                .select('estado')
                .eq('id', postId)
                .eq('autor_hash', this.autorHash)
                .single();
            
            if (fetchError) throw fetchError;
            
            const nuevoEstado = post.estado === 'pausado' ? 'publicado' : 'pausado';
            
            const { error } = await this.supabase
                .from('posts_comunidades')
                .update({ estado: nuevoEstado })
                .eq('id', postId)
                .eq('autor_hash', this.autorHash);
            
            if (error) throw error;
            
            this.mostrarMensaje(nuevoEstado === 'pausado' ? '✅ Post pausado correctamente.' : '✅ Post reactivado correctamente.', 'success');
            await this.cargarMiHistorial();
        } catch (error) {
            console.error('Error pausando post:', error);
            this.mostrarMensaje('Error al pausar/reactivar el post. Por favor, intenta nuevamente.', 'error');
        }
    }
    
    // ===== ELIMINAR POST =====
    async eliminarPost(postId) {
        if (!confirm('¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer.')) {
            return;
        }
        
        if (!this.supabase) {
            this.mostrarMensaje('No hay conexión con la base de datos', 'error');
            return;
        }
        
        try {
            const { error } = await this.supabase
                .from('posts_comunidades')
                .delete()
                .eq('id', postId)
                .eq('autor_hash', this.autorHash);
            
            if (error) throw error;
            
            this.mostrarMensaje('✅ Post eliminado correctamente.', 'success');
            await this.cargarMiHistorial();
            await this.cargarPosts(); // Recargar también la lista principal
        } catch (error) {
            console.error('Error eliminando post:', error);
            this.mostrarMensaje('Error al eliminar el post. Por favor, intenta nuevamente.', 'error');
        }
    }
    
    // ===== REGISTRAR POSTS VISTOS =====
    registrarPostVisto(postId) {
        // Registrar vista normal del usuario
        if (this.autorHash) {
            const key = `posts_vistos_${this.comunidadSlug}_${this.autorHash}`;
            let postsVistos = JSON.parse(localStorage.getItem(key) || '[]');
            
            if (!postsVistos.includes(postId)) {
                postsVistos.push(postId);
                // Mantener solo los últimos 100
                if (postsVistos.length > 100) {
                    postsVistos = postsVistos.slice(-100);
                }
                localStorage.setItem(key, JSON.stringify(postsVistos));
            }
        }
        
        // Detectar si estamos en un panel de verificación (admin)
        const esPanelVerificacion = window.location.pathname.includes('panel-verificacion') || 
                                     window.location.pathname.includes('panel-crear-campana');
        
        if (esPanelVerificacion) {
            // Verificar si hay sesión de admin
            const sessionData = localStorage.getItem('adminSession');
            if (sessionData) {
                try {
                    const session = JSON.parse(sessionData);
                    if (session.authenticated) {
                        // Registrar que un admin vio este post
                        this.registrarPostLeidoPorAdmin(postId);
                    }
                } catch (e) {
                    console.error('Error verificando sesión admin:', e);
                }
            }
        }
    }
    
    // ===== REGISTRAR POST LEÍDO POR ADMIN =====
    registrarPostLeidoPorAdmin(postId) {
        const key = `posts_leidos_admin_${this.comunidadSlug}`;
        let postsLeidos = JSON.parse(localStorage.getItem(key) || '[]');
        
        const registro = {
            postId: postId,
            fecha: new Date().toISOString(),
            adminHash: this.obtenerHashAdmin() || 'admin'
        };
        
        // Verificar si ya está registrado
        const yaRegistrado = postsLeidos.some(r => r.postId === postId);
        if (!yaRegistrado) {
            postsLeidos.push(registro);
            // Mantener solo los últimos 500 registros
            if (postsLeidos.length > 500) {
                postsLeidos = postsLeidos.slice(-500);
            }
            localStorage.setItem(key, JSON.stringify(postsLeidos));
            
            // Intentar guardar en Supabase si está disponible
            this.guardarPostLeidoEnSupabase(registro);
        }
    }
    
    // ===== OBTENER HASH DEL ADMIN =====
    obtenerHashAdmin() {
        try {
            const sessionData = localStorage.getItem('adminSession');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                // Crear un hash simple del email o ID del admin
                if (session.email || session.userId) {
                    return this.crearHashSimple(session.email || session.userId);
                }
            }
        } catch (e) {
            console.error('Error obteniendo hash admin:', e);
        }
        return null;
    }
    
    // ===== CREAR HASH SIMPLE =====
    crearHashSimple(texto) {
        let hash = 0;
        for (let i = 0; i < texto.length; i++) {
            const char = texto.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a entero de 32 bits
        }
        return Math.abs(hash).toString(16);
    }
    
    // ===== GUARDAR POST LEÍDO EN SUPABASE =====
    async guardarPostLeidoEnSupabase(registro) {
        if (!this.supabase) return;
        
        try {
            // Intentar guardar en una tabla de posts leídos (si existe)
            const { error } = await this.supabase
                .from('posts_leidos_admin')
                .insert([{
                    post_id: registro.postId,
                    comunidad_slug: this.comunidadSlug,
                    admin_hash: registro.adminHash,
                    fecha: registro.fecha,
                    created_at: registro.fecha
                }])
                .select();
            
            if (error && error.code !== 'PGRST116') { // PGRST116 = tabla no existe
                console.log('ℹ️ No se pudo guardar en Supabase (tabla puede no existir):', error.message);
            }
        } catch (e) {
            // Silenciar errores - es opcional
        }
    }
    
    // ===== VERIFICAR SI POST FUE LEÍDO POR ADMIN =====
    esPostLeidoPorAdmin(postId) {
        const key = `posts_leidos_admin_${this.comunidadSlug}`;
        const postsLeidos = JSON.parse(localStorage.getItem(key) || '[]');
        return postsLeidos.some(r => r.postId === postId);
    }
    
    // ===== CAMBIAR TAB DEL HISTORIAL =====
    cambiarTabHistorial(tab) {
        // Ocultar todos los contenidos
        document.querySelectorAll('.contenido-tab-historial').forEach(div => {
            div.style.display = 'none';
        });
        
        // Desactivar todos los botones
        document.querySelectorAll('.tab-historial').forEach(btn => {
            btn.style.background = '#e5e7eb';
            btn.style.color = '#374151';
        });
        
        // Mostrar el contenido seleccionado
        const contenido = document.getElementById(`contenido-${tab}`);
        if (contenido) {
            contenido.style.display = 'block';
        }
        
        // Activar el botón seleccionado
        const boton = document.querySelector(`[data-tab-historial="${tab}"]`);
        if (boton) {
            boton.style.background = '#8b5cf6';
            boton.style.color = 'white';
        }
        
        // Cargar contenido si es necesario
        if (tab === 'vistos') {
            this.cargarPostsVistos();
        } else if (tab === 'respuestas') {
            this.cargarPostsConRespuestas();
        }
    }
    
    // ===== CARGAR POSTS VISTOS =====
    async cargarPostsVistos() {
        if (!this.autorHash) return;
        
        const container = document.getElementById('posts-vistos-lista');
        if (!container) return;
        
        const key = `posts_vistos_${this.comunidadSlug}_${this.autorHash}`;
        const postsVistosIds = JSON.parse(localStorage.getItem(key) || '[]');
        
        if (postsVistosIds.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-info-circle"></i>
                    <p>Los posts que veas aparecerán aquí</p>
                </div>
            `;
            return;
        }
        
        try {
            let posts = [];
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('posts_comunidades')
                    .select('*')
                    .in('id', postsVistosIds)
                    .eq('comunidad_slug', this.comunidadSlug)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                posts = data || [];
            } else {
                const postsKey = `posts_${this.comunidadSlug}`;
                const allPosts = JSON.parse(localStorage.getItem(postsKey) || '[]');
                posts = allPosts.filter(p => postsVistosIds.includes(p.id))
                    .sort((a, b) => new Date(b.created_at || b.fecha) - new Date(a.created_at || a.fecha));
            }
            
            if (posts.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-info-circle"></i>
                        <p>No hay posts vistos aún</p>
                    </div>
                `;
                return;
            }
            
            const postsHTML = await Promise.all(posts.map(async post => await this.renderizarPost(post)));
            container.innerHTML = postsHTML.join('');
            
            // Cargar comentarios
            posts.forEach(post => {
                this.cargarComentarios(post.id);
            });
        } catch (error) {
            console.error('Error cargando posts vistos:', error);
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar posts vistos</p>
                </div>
            `;
        }
    }
    
    // ===== CARGAR POSTS CON RESPUESTAS =====
    async cargarPostsConRespuestas() {
        if (!this.autorHash) return;
        
        const container = document.getElementById('posts-respuestas-lista');
        if (!container) return;
        
        try {
            let postsConRespuestas = [];
            
            if (this.supabase) {
                // Obtener comentarios del usuario
                const { data: comentarios, error: comentariosError } = await this.supabase
                    .from('comentarios_comunidades')
                    .select('post_id')
                    .eq('autor_hash', this.autorHash)
                    .eq('comunidad_slug', this.comunidadSlug);
                
                if (comentariosError) throw comentariosError;
                
                const postIds = [...new Set(comentarios.map(c => c.post_id))];
                
                if (postIds.length > 0) {
                    const { data: posts, error: postsError } = await this.supabase
                        .from('posts_comunidades')
                        .select('*')
                        .in('id', postIds)
                        .eq('comunidad_slug', this.comunidadSlug)
                        .order('created_at', { ascending: false });
                    
                    if (postsError) throw postsError;
                    postsConRespuestas = posts || [];
                }
            } else {
                // Modo local
                const comentariosKey = `comentarios_${this.comunidadSlug}`;
                const allComentarios = JSON.parse(localStorage.getItem(comentariosKey) || '[]');
                const misComentarios = allComentarios.filter(c => c.autor_hash === this.autorHash);
                const postIds = [...new Set(misComentarios.map(c => c.post_id))];
                
                if (postIds.length > 0) {
                    const postsKey = `posts_${this.comunidadSlug}`;
                    const allPosts = JSON.parse(localStorage.getItem(postsKey) || '[]');
                    postsConRespuestas = allPosts.filter(p => postIds.includes(p.id))
                        .sort((a, b) => new Date(b.created_at || b.fecha) - new Date(a.created_at || a.fecha));
                }
            }
            
            if (postsConRespuestas.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-info-circle"></i>
                        <p>Los posts donde hayas comentado aparecerán aquí</p>
                    </div>
                `;
                return;
            }
            
            const postsHTML = await Promise.all(postsConRespuestas.map(async post => await this.renderizarPost(post)));
            container.innerHTML = postsHTML.join('');
            
            // Cargar comentarios
            postsConRespuestas.forEach(post => {
                this.cargarComentarios(post.id);
            });
        } catch (error) {
            console.error('Error cargando posts con respuestas:', error);
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar posts con respuestas</p>
                </div>
            `;
        }
    }
}

// Funciones globales para historial
window.editarPostForo = function(postId) {
    if (window.foroComunidad) {
        window.foroComunidad.editarPost(postId);
    }
};

window.pausarPostForo = function(postId) {
    if (window.foroComunidad) {
        window.foroComunidad.pausarPost(postId);
    }
};

window.eliminarPostForo = function(postId) {
    if (window.foroComunidad) {
        window.foroComunidad.eliminarPost(postId);
    }
};

// Hacer disponible globalmente
window.SistemaForoComunidades = SistemaForoComunidades;

