// ===== SISTEMA DE FORO PARA COMUNIDADES CRESALIA =====
// Sistema completo de posts y comentarios con anonimato garantizado

class SistemaForoComunidades {
    constructor(comunidadSlug) {
        this.comunidadSlug = comunidadSlug;
        this.supabase = null;
        this.autorHash = null; // Hash del usuario actual para anonimato
        this.autorAlias = null; // Alias elegido por el usuario
        
        this.init();
    }
    
    async init() {
        // Inicializar Supabase si está disponible
        if (typeof window.supabase !== 'undefined') {
            try {
                // Cargar configuración
                const config = window.SUPABASE_CONFIG || {};
                
                if (config.url && config.anonKey && !config.anonKey.includes('REEMPLAZA')) {
                    this.supabase = window.supabase.createClient(
                        config.url,
                        config.anonKey,
                        { auth: config.auth || {} }
                    );
                    console.log('✅ Foro: Supabase inicializado');
                } else {
                    console.warn('⚠️ Foro: Supabase no configurado, usando modo local');
                }
            } catch (error) {
                console.error('❌ Foro: Error al inicializar Supabase', error);
            }
        }
        
        // Inicializar hash de autor (anonimato)
        this.autorHash = this.generarHashAutor();
        
        // Cargar alias guardado
        this.autorAlias = this.obtenerAliasGuardado();
        
        // Cargar posts al inicializar
        this.cargarPosts();
        
        // Configurar listeners
        this.configurarEventListeners();
        
        // Inicializar sistema de feedbacks
        if (typeof SistemaFeedbacksComunidades !== 'undefined') {
            window.feedbackComunidad = new SistemaFeedbacksComunidades(this.comunidadSlug);
        }
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
        // Botón crear post
        const btnCrearPost = document.getElementById('btn-crear-post');
        if (btnCrearPost) {
            btnCrearPost.addEventListener('click', () => this.mostrarFormularioPost());
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
    }
    
    mostrarFormularioPost() {
        const modal = document.getElementById('modal-crear-post');
        if (modal) {
            modal.style.display = 'flex';
            
            // Si no tiene alias, pedirlo primero
            if (!this.autorAlias) {
                this.pedirAlias();
            }
        }
    }
    
    ocultarFormularioPost() {
        const modal = document.getElementById('modal-crear-post');
        if (modal) {
            modal.style.display = 'none';
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
            estado: 'publicado'
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
                
                // Limpiar formulario
                tituloInput.value = '';
                contenidoInput.value = '';
            } else {
                // Modo local (sin backend)
                const posts = JSON.parse(localStorage.getItem(`posts_${this.comunidadSlug}`) || '[]');
                const nuevoPost = {
                    id: 'local_' + Date.now(),
                    ...postData,
                    created_at: new Date().toISOString(),
                    num_comentarios: 0,
                    num_reacciones: 0
                };
                posts.unshift(nuevoPost);
                localStorage.setItem(`posts_${this.comunidadSlug}`, JSON.stringify(posts));
                
                this.mostrarMensaje('Post creado exitosamente (modo local)', 'success');
                this.cargarPosts();
                this.ocultarFormularioPost();
                
                tituloInput.value = '';
                contenidoInput.value = '';
            }
        } catch (error) {
            console.error('❌ Error al crear post:', error);
            this.mostrarMensaje('Error al crear el post. Por favor intentá de nuevo.', 'error');
        }
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
                // Modo local
                posts = JSON.parse(localStorage.getItem(`posts_${this.comunidadSlug}`) || '[]')
                    .filter(p => p.estado === 'publicado')
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
        const fecha = new Date(post.created_at).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
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
        
        return `
            <div class="post" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-autor">
                        <strong>${this.escapeHtml(post.autor_alias || 'Anónimo')}${badgeVerificado}</strong>
                        <span class="post-fecha">${fecha}</span>
                    </div>
                    <div class="post-acciones">
                        ${botonesAutor}
                    </div>
                </div>
                ${post.titulo ? `<h3 class="post-titulo">${this.escapeHtml(post.titulo)}</h3>` : ''}
                <div class="post-contenido">${this.formatearTexto(post.contenido)}</div>
                <div class="post-footer">
                    <button class="btn-comentar" onclick="foroComunidad.mostrarFormularioComentario('${post.id}')">
                        <i class="fas fa-comment"></i> Comentar (${post.num_comentarios || 0})
                    </button>
                    <button class="btn-reaccionar" onclick="foroComunidad.reaccionarPost('${post.id}')">
                        <i class="fas fa-heart"></i> Apoyo (${post.num_reacciones || 0})
                    </button>
                </div>
                <div class="comentarios-container" id="comentarios-${post.id}">
                    <!-- Comentarios se cargarán aquí -->
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
        // TODO: Implementar edición
        alert('La edición de posts estará disponible próximamente.');
    }
    
    async editarComentario(comentarioId) {
        // TODO: Implementar edición
        alert('La edición de comentarios estará disponible próximamente.');
    }
    
    async reaccionarPost(postId) {
        // TODO: Implementar reacciones
        this.mostrarMensaje('💜 Gracias por tu apoyo', 'success');
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
            // Cargar TODOS los posts del usuario (incluyendo pausados, ocultos, etc.)
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
            const container = document.getElementById('mi-historial-foro-lista');
            if (container) {
                container.innerHTML = `
                    <div class="sin-posts">
                        <p>Error al cargar tu historial. Por favor, intenta nuevamente.</p>
                    </div>
                `;
            }
        }
    }
    
    // ===== MOSTRAR MI HISTORIAL =====
    mostrarMiHistorial(posts) {
        const container = document.getElementById('mi-historial-foro-lista');
        if (!container) return;
        
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
    
    // ===== EDITAR POST =====
    async editarPost(postId) {
        alert('💡 La funcionalidad de editar posts estará disponible próximamente. Gracias por tu paciencia.');
    }
    
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

