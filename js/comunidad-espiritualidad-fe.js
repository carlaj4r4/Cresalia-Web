/**
 * ═══════════════════════════════════════════════════════════════
 * ✨ SISTEMA DE COMUNIDAD ESPIRITUALIDAD Y FE - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Comunidad para todas las creencias y búsquedas espirituales
 * - Sistema ULTRA ESTRICTO: 1 warning = BAN PERMANENTE
 * - Respeto obligatorio
 * - No se permite hacer sentir inferior a nadie
 * - No se puede obligar a cambiar religión
 * - Debates respetuosos permitidos
 * 
 * Creado con amor por Claude & Carla para Cresalia
 * ═══════════════════════════════════════════════════════════════
 */

class EspiritualidadFe {
    constructor() {
        this.usuarioActual = this.obtenerUsuarioActual();
        this.reglasAceptadas = false;
        this.publicacionesOcultas = this.cargarPublicacionesOcultas();
        this.publicacionesBloqueadas = this.cargarPublicacionesBloqueadas();
        this.warnings = this.cargarWarnings();
        this.usuariosBaneados = this.cargarUsuariosBaneados();
        this.MAX_WARNINGS = 1; // 1 warning = BAN PERMANENTE
        this.init();
    }

    init() {
        console.log('✨ Inicializando Comunidad Espiritualidad y Fe...');
        this.verificarReglas();
        if (this.reglasAceptadas) {
            this.cargarPublicaciones();
        }
    }

    /**
     * Obtener usuario actual
     */
    obtenerUsuarioActual() {
        const email = localStorage.getItem('usuario_email') || 'usuario@ejemplo.com';
        const nombre = localStorage.getItem('usuario_nombre') || 'Usuario';
        return { email, nombre };
    }

    /**
     * Verificar si el usuario está baneado
     */
    verificarBaneo() {
        return this.usuariosBaneados.includes(this.usuarioActual.email);
    }

    /**
     * Cargar usuarios baneados
     */
    cargarUsuariosBaneados() {
        return JSON.parse(localStorage.getItem('espiritualidad_usuarios_baneados') || '[]');
    }

    /**
     * Banear usuario permanentemente
     */
    banearUsuario(email) {
        if (!this.usuariosBaneados.includes(email)) {
            this.usuariosBaneados.push(email);
            localStorage.setItem('espiritualidad_usuarios_baneados', JSON.stringify(this.usuariosBaneados));
        }
    }

    /**
     * Cargar publicaciones ocultas
     */
    cargarPublicacionesOcultas() {
        return JSON.parse(localStorage.getItem('espiritualidad_publicaciones_ocultas') || '[]');
    }

    /**
     * Cargar publicaciones bloqueadas
     */
    cargarPublicacionesBloqueadas() {
        return JSON.parse(localStorage.getItem('espiritualidad_publicaciones_bloqueadas') || '[]');
    }

    /**
     * Cargar warnings del usuario
     */
    cargarWarnings() {
        return JSON.parse(localStorage.getItem('espiritualidad_warnings') || '[]');
    }

    /**
     * Guardar warnings
     */
    guardarWarnings() {
        localStorage.setItem('espiritualidad_warnings', JSON.stringify(this.warnings));
    }

    /**
     * Agregar warning a una publicación (1 warning = BAN PERMANENTE)
     */
    agregarWarning(publicacionId, motivo, emailAutor) {
        if (!this.warnings.find(w => w.publicacion_id === publicacionId)) {
            this.warnings.push({
                publicacion_id: publicacionId,
                motivo,
                fecha: new Date().toISOString(),
                count: 1,
                email_autor: emailAutor
            });
        } else {
            const warning = this.warnings.find(w => w.publicacion_id === publicacionId);
            warning.count += 1;
            warning.motivo = motivo;
            warning.fecha = new Date().toISOString();
        }
        this.guardarWarnings();

        // 1 WARNING = BAN PERMANENTE
        if (emailAutor) {
            this.banearUsuario(emailAutor);
            this.bloquearPublicacion(publicacionId);
            this.mostrarNotificacion('🚫 Usuario baneado permanentemente por falta de respeto. La publicación ha sido bloqueada.', 'error');
        } else {
            this.bloquearPublicacion(publicacionId);
            this.mostrarNotificacion('🚫 Publicación bloqueada por falta de respeto.', 'error');
        }
    }

    /**
     * Ocultar publicación
     */
    ocultarPublicacion(publicacionId) {
        if (!this.publicacionesOcultas.includes(publicacionId)) {
            this.publicacionesOcultas.push(publicacionId);
            localStorage.setItem('espiritualidad_publicaciones_ocultas', JSON.stringify(this.publicacionesOcultas));
            this.cargarPublicaciones();
            this.mostrarNotificacion('✅ Publicación ocultada', 'success');
        }
    }

    /**
     * Bloquear publicación
     */
    bloquearPublicacion(publicacionId) {
        if (!this.publicacionesBloqueadas.includes(publicacionId)) {
            this.publicacionesBloqueadas.push(publicacionId);
            localStorage.setItem('espiritualidad_publicaciones_bloqueadas', JSON.stringify(this.publicacionesBloqueadas));
            this.cargarPublicaciones();
        }
    }

    /**
     * Verificar si las reglas fueron aceptadas
     */
    verificarReglas() {
        const advertencia = document.getElementById('advertencia-respeto');
        const contenido = document.getElementById('contenido-principal');
        
        if (!advertencia || !contenido) return;

        // Verificar si está baneado
        if (this.verificarBaneo()) {
            advertencia.innerHTML = `
                <h3>🚫 Acceso Denegado</h3>
                <p style="color: #DC2626; font-weight: 600;">
                    Has sido baneado permanentemente de esta comunidad por falta de respeto.
                </p>
                <p>
                    El respeto es fundamental en este espacio. No hay segunda oportunidad.
                </p>
            `;
            contenido.style.display = 'none';
            return;
        }

        const aceptado = localStorage.getItem('espiritualidad_reglas_aceptadas');
        const fechaAceptacion = localStorage.getItem('espiritualidad_reglas_fecha');
        const hoy = new Date().toDateString();

        if (aceptado === 'true' && fechaAceptacion === hoy) {
            advertencia.style.display = 'none';
            contenido.style.display = 'block';
            this.reglasAceptadas = true;
        } else {
            advertencia.style.display = 'block';
            contenido.style.display = 'none';
            this.reglasAceptadas = false;
        }
    }

    /**
     * Aceptar reglas
     */
    aceptarReglas() {
        localStorage.setItem('espiritualidad_reglas_aceptadas', 'true');
        localStorage.setItem('espiritualidad_reglas_fecha', new Date().toDateString());
        
        document.getElementById('advertencia-respeto').style.display = 'none';
        document.getElementById('contenido-principal').style.display = 'block';
        this.reglasAceptadas = true;
        
        this.cargarPublicaciones();
    }

    /**
     * Saltar comunidad
     */
    saltarComunidad() {
        this.mostrarNotificacion('✨ Entendido. Podés volver cuando quieras.', 'info');
        window.location.href = '/comunidades/';
    }

    /**
     * Mostrar tab
     */
    mostrarTab(tabId) {
        if (!this.reglasAceptadas) {
            this.mostrarNotificacion('⚠️ Por favor aceptá las reglas primero', 'warning');
            return;
        }

        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const tab = document.getElementById(`tab-${tabId}`);
        const btn = event?.target.closest('.tab-btn') || document.querySelector(`[onclick*="'${tabId}'"]`);
        
        if (tab) tab.classList.add('active');
        if (btn) btn.classList.add('active');

        if (tabId === 'foro') {
            this.cargarPublicaciones();
        } else if (tabId === 'mi-historial' && window.foroComunidad) {
            window.foroComunidad.cargarMiHistorial();
        } else if (tabId === 'oracion') {
            this.cargarPublicacionesPorCategoria('oracion');
        } else if (tabId === 'debates') {
            this.cargarPublicacionesPorCategoria('debates');
        }
    }

    /**
     * Cargar publicaciones del foro
     */
    async cargarPublicaciones() {
        if (!this.reglasAceptadas) return;
        
        const lista = document.getElementById('publicaciones-lista');
        if (!lista) return;

        try {
            const response = await fetch('/api/espiritualidad-fe?tipo=publicaciones');
            if (response.ok) {
                const publicaciones = await response.json();
                this.renderizarPublicaciones(publicaciones, lista);
            } else {
                this.cargarPublicacionesLocal();
            }
        } catch (error) {
            console.warn('⚠️ Error al cargar publicaciones, usando localStorage:', error);
            this.cargarPublicacionesLocal();
        }
    }

    /**
     * Cargar publicaciones por categoría
     */
    async cargarPublicacionesPorCategoria(categoria) {
        const lista = document.getElementById(`${categoria}-lista`);
        if (!lista) return;

        try {
            const response = await fetch(`/api/espiritualidad-fe?tipo=publicaciones&categoria=${categoria}`);
            if (response.ok) {
                const publicaciones = await response.json();
                this.renderizarPublicaciones(publicaciones, lista);
            } else {
                const publicaciones = JSON.parse(localStorage.getItem('espiritualidad_publicaciones') || '[]')
                    .filter(pub => pub.categoria === categoria);
                this.renderizarPublicaciones(publicaciones, lista);
            }
        } catch (error) {
            const publicaciones = JSON.parse(localStorage.getItem('espiritualidad_publicaciones') || '[]')
                .filter(pub => pub.categoria === categoria);
            this.renderizarPublicaciones(publicaciones, lista);
        }
    }

    /**
     * Cargar publicaciones desde localStorage
     */
    cargarPublicacionesLocal() {
        const publicaciones = JSON.parse(localStorage.getItem('espiritualidad_publicaciones') || '[]');
        const lista = document.getElementById('publicaciones-lista');
        if (lista) {
            this.renderizarPublicaciones(publicaciones, lista);
        }
    }

    /**
     * Renderizar publicaciones
     */
    renderizarPublicaciones(publicaciones, lista) {
        if (!lista) return;

        // Filtrar publicaciones ocultas, bloqueadas y de usuarios baneados
        const publicacionesFiltradas = publicaciones.filter(pub => 
            !this.publicacionesOcultas.includes(pub.id) && 
            !this.publicacionesBloqueadas.includes(pub.id) &&
            !this.usuariosBaneados.includes(pub.email)
        );

        if (publicacionesFiltradas.length === 0) {
            lista.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #64748B;">
                    <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>No hay publicaciones visibles. Podés crear una nueva publicación.</p>
                </div>
            `;
            return;
        }

        lista.innerHTML = publicacionesFiltradas.map(pub => {
            const warning = this.warnings.find(w => w.publicacion_id === pub.id);
            const tieneWarning = warning && warning.count >= 1;
            const estaBaneado = this.usuariosBaneados.includes(pub.email);
            
            return `
                <div class="publicacion-card">
                    <div class="publicacion-header">
                        <div class="publicacion-autor">
                            <i class="fas fa-user-circle"></i>
                            <span>${pub.autor || 'Anónimo'}</span>
                            ${estaBaneado ? '<span class="badge-ban">🚫 BANEADO</span>' : ''}
                        </div>
                        <div class="publicacion-fecha">
                            ${this.formatearFecha(pub.fecha || pub.created_at)}
                        </div>
                    </div>
                    <div class="publicacion-contenido">
                        <h3>${pub.titulo}</h3>
                        <p>${pub.contenido}</p>
                        ${tieneWarning ? '<span class="badge-ban">⚠️ FALTA DE RESPETO - BAN PERMANENTE</span>' : ''}
                    </div>
                    <div class="publicacion-acciones">
                        <button onclick="espiritualidadFe.verComentarios('${pub.id}')">
                            <i class="fas fa-comments"></i> Comentarios (${pub.comentarios || 0})
                        </button>
                        <button onclick="espiritualidadFe.reportarFaltaRespeto('${pub.id}', '${pub.email}')" style="color: #DC2626;">
                            <i class="fas fa-exclamation-triangle"></i> Reportar Falta de Respeto
                        </button>
                        <button onclick="espiritualidadFe.ocultarPublicacion('${pub.id}')">
                            <i class="fas fa-eye-slash"></i> Ocultar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Reportar falta de respeto (1 warning = BAN PERMANENTE)
     */
    reportarFaltaRespeto(publicacionId, emailAutor) {
        const confirmacion = confirm(
            '⚠️ ADVERTENCIA: Reportar falta de respeto resultará en BAN PERMANENTE para el autor.\n\n' +
            '¿Estás seguro/a de que esta publicación contiene falta de respeto?\n\n' +
            'Recordá: El respeto es fundamental. 1 falta de respeto = ban permanente.'
        );

        if (!confirmacion) return;

        const motivo = prompt('¿Cuál es el motivo de la falta de respeto? (obligatorio)');
        if (!motivo || motivo.trim() === '') {
            this.mostrarNotificacion('⚠️ Por favor especificá el motivo', 'warning');
            return;
        }

        this.agregarWarning(publicacionId, motivo.trim(), emailAutor);
    }

    /**
     * Crear nueva publicación
     */
    crearPublicacion() {
        // Usar el sistema de foro unificado
        if (window.foroComunidad && typeof window.foroComunidad.mostrarFormularioPost === 'function') {
            window.foroComunidad.mostrarFormularioPost();
            return;
        }
        if (!this.reglasAceptadas) {
            this.mostrarNotificacion('⚠️ Por favor aceptá las reglas primero', 'warning');
            return;
        }

        if (this.verificarBaneo()) {
            this.mostrarNotificacion('🚫 Has sido baneado permanentemente de esta comunidad', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-plus"></i> Nueva Publicación</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="info-box" style="margin-bottom: 24px;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p><strong>Recordá:</strong> El respeto es obligatorio. 1 falta de respeto = ban permanente.</p>
                    </div>
                    <form id="form-publicacion">
                        <div class="form-group">
                            <label>Título</label>
                            <input type="text" id="pub-titulo" required>
                        </div>
                        <div class="form-group">
                            <label>Contenido</label>
                            <textarea id="pub-contenido" rows="6" required 
                                placeholder="Compartí tu fe, tu búsqueda espiritual o tu experiencia. Recordá: respeto obligatorio."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Categoría</label>
                            <select id="pub-categoria" required>
                                <option value="">Seleccioná una opción</option>
                                <option value="general">General</option>
                                <option value="oracion">Oración y Meditación</option>
                                <option value="debates">Debates Respetuosos</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-paper-plane"></i> Publicar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('form-publicacion').onsubmit = (e) => {
            e.preventDefault();
            this.guardarPublicacion();
        };
    }

    /**
     * Guardar publicación
     */
    async guardarPublicacion() {
        const titulo = document.getElementById('pub-titulo').value;
        const contenido = document.getElementById('pub-contenido').value;
        const categoria = document.getElementById('pub-categoria').value;

        if (!categoria) {
            this.mostrarNotificacion('⚠️ Por favor seleccioná una categoría', 'warning');
            return;
        }

        const publicacion = {
            id: 'pub-' + Date.now(),
            titulo,
            contenido,
            autor: this.usuarioActual.nombre,
            email: this.usuarioActual.email,
            fecha: new Date().toISOString(),
            categoria,
            comentarios: 0
        };

        try {
            const response = await fetch('/api/espiritualidad-fe?tipo=publicaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publicacion)
            });

            if (!response.ok) {
                throw new Error('Error en API');
            }
        } catch (error) {
            const publicaciones = JSON.parse(localStorage.getItem('espiritualidad_publicaciones') || '[]');
            publicaciones.push(publicacion);
            localStorage.setItem('espiritualidad_publicaciones', JSON.stringify(publicaciones));
        }

        this.mostrarNotificacion('✅ Publicación creada exitosamente', 'success');
        document.querySelector('.modal').remove();
        this.cargarPublicaciones();
    }

    /**
     * Ver comentarios
     */
    verComentarios(publicacionId) {
        this.mostrarNotificacion('Abriendo comentarios...', 'info');
        // Implementar lógica para ver comentarios
    }

    /**
     * Mostrar recurso
     */
    mostrarRecurso(tipo) {
        const recursos = {
            'diversidad': {
                titulo: 'Diversidad Religiosa',
                contenido: `
                    <h3><i class="fas fa-globe"></i> Diversidad Religiosa</h3>
                    <div class="recurso-contenido">
                        <h4>Respeto a Todas las Creencias</h4>
                        <p>En este espacio, todas las religiones y creencias son bienvenidas:</p>
                        <ul>
                            <li>Cristianismo (todas las denominaciones)</li>
                            <li>Islam</li>
                            <li>Judaísmo</li>
                            <li>Budismo</li>
                            <li>Hinduismo</li>
                            <li>Espiritualidad sin religión</li>
                            <li>Agnosticismo</li>
                            <li>Ateísmo respetuoso</li>
                            <li>Cualquier otra creencia o búsqueda espiritual</li>
                        </ul>
                        <p><strong>Recordá:</strong> Cada uno cree en lo que le hace bien. El respeto es fundamental.</p>
                    </div>
                `
            },
            'practicas': {
                titulo: 'Prácticas Espirituales',
                contenido: `
                    <h3><i class="fas fa-spa"></i> Prácticas Espirituales</h3>
                    <div class="recurso-contenido">
                        <h4>Diferentes Formas de Practicar</h4>
                        <ul>
                            <li><strong>Oración:</strong> Comunicación con lo divino según tu creencia</li>
                            <li><strong>Meditación:</strong> Práctica de atención plena y conexión interior</li>
                            <li><strong>Lectura de textos sagrados:</strong> Estudio y reflexión</li>
                            <li><strong>Rituales:</strong> Prácticas ceremoniales según tu tradición</li>
                            <li><strong>Servicio:</strong> Ayudar a otros como práctica espiritual</li>
                            <li><strong>Naturaleza:</strong> Conexión con la naturaleza como práctica espiritual</li>
                        </ul>
                        <p><strong>Recordá:</strong> No hay una forma "correcta" de practicar. Lo que te hace bien es válido.</p>
                    </div>
                `
            },
            'respeto': {
                titulo: 'Respeto Interreligioso',
                contenido: `
                    <h3><i class="fas fa-handshake"></i> Respeto Interreligioso</h3>
                    <div class="recurso-contenido">
                        <h4>Cómo Respetar Otras Creencias</h4>
                        <ul>
                            <li><strong>No juzgar:</strong> No juzgues las creencias de otros</li>
                            <li><strong>No imponer:</strong> No intentes cambiar la religión de nadie</li>
                            <li><strong>Escuchar:</strong> Escuchá con respeto las experiencias de otros</li>
                            <li><strong>Aprender:</strong> Aprendé sobre otras creencias sin prejuicios</li>
                            <li><strong>Debatir respetuosamente:</strong> Podés debatir ideas, pero siempre con respeto</li>
                            <li><strong>No hacer sentir inferior:</strong> Nadie es superior o inferior por sus creencias</li>
                        </ul>
                        <h4>Lo que NO está permitido</h4>
                        <ul>
                            <li>Hacer sentir inferior a alguien por sus creencias</li>
                            <li>Obligar a cambiar religión o forma de pensar</li>
                            <li>Faltas de respeto o insultos</li>
                            <li>Proselitismo agresivo</li>
                        </ul>
                        <p><strong>Recordá:</strong> 1 falta de respeto = ban permanente. El respeto es obligatorio.</p>
                    </div>
                `
            },
            'busqueda': {
                titulo: 'Búsqueda Espiritual',
                contenido: `
                    <h3><i class="fas fa-compass"></i> Búsqueda Espiritual</h3>
                    <div class="recurso-contenido">
                        <h4>Para Quienes Están en Búsqueda</h4>
                        <p>Si estás buscando tu camino espiritual, este espacio es para vos:</p>
                        <ul>
                            <li>Podés explorar diferentes creencias sin compromiso</li>
                            <li>Podés hacer preguntas con respeto</li>
                            <li>Podés compartir tus dudas y búsquedas</li>
                            <li>Podés encontrar apoyo de personas que entienden</li>
                        </ul>
                        <h4>Consejos para la Búsqueda</h4>
                        <ul>
                            <li>Tomate tu tiempo, no hay prisa</li>
                            <li>Explorá diferentes perspectivas</li>
                            <li>Escuchá tu corazón y tu intuición</li>
                            <li>No te sientas presionado/a a elegir</li>
                            <li>Recordá que la búsqueda es un proceso</li>
                        </ul>
                        <p><strong>Recordá:</strong> Tu búsqueda es válida. No tenés que encajar en ninguna categoría.</p>
                    </div>
                `
            }
        };

        const recurso = recursos[tipo];
        if (!recurso) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>${recurso.titulo}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${recurso.contenido}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * Formatear fecha
     */
    formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    /**
     * Mostrar notificación
     */
    mostrarNotificacion(mensaje, tipo = 'info') {
        const colores = {
            'success': '#10B981',
            'error': '#DC2626',
            'info': '#3B82F6',
            'warning': '#F59E0B'
        };

        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colores[tipo]};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
        `;
        notif.textContent = mensaje;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }
}

// Inicializar cuando el DOM esté listo
let espiritualidadFe;
document.addEventListener('DOMContentLoaded', () => {
    espiritualidadFe = new EspiritualidadFe();
});



