/**
 * ═══════════════════════════════════════════════════════════════
 * 💜 SISTEMA DE COMUNIDAD LIBERTAD EMOCIONAL - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Comunidad para sanar rompimientos y dependencia emocional
 * - Sistema de advertencias (3 warnings)
 * - Ocultar/bloquear publicaciones
 * - Advertencias de contenido sensible
 * - Recursos de sanación
 * 
 * Creado con amor por Claude & Carla para Cresalia
 * ═══════════════════════════════════════════════════════════════
 */

class LibertadEmocional {
    constructor() {
        this.usuarioActual = this.obtenerUsuarioActual();
        this.contenidoSensibleVisible = false;
        this.publicacionesOcultas = this.cargarPublicacionesOcultas();
        this.publicacionesBloqueadas = this.cargarPublicacionesBloqueadas();
        this.warnings = this.cargarWarnings();
        this.init();
    }

    init() {
        console.log('💜 Inicializando Comunidad Libertad Emocional...');
        this.verificarAdvertencias();
        this.cargarPublicaciones();
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
     * Cargar publicaciones ocultas
     */
    cargarPublicacionesOcultas() {
        return JSON.parse(localStorage.getItem('libertad_publicaciones_ocultas') || '[]');
    }

    /**
     * Cargar publicaciones bloqueadas
     */
    cargarPublicacionesBloqueadas() {
        return JSON.parse(localStorage.getItem('libertad_publicaciones_bloqueadas') || '[]');
    }

    /**
     * Cargar warnings del usuario
     */
    cargarWarnings() {
        return JSON.parse(localStorage.getItem('libertad_warnings') || '[]');
    }

    /**
     * Guardar warnings
     */
    guardarWarnings() {
        localStorage.setItem('libertad_warnings', JSON.stringify(this.warnings));
    }

    /**
     * Agregar warning a una publicación
     */
    agregarWarning(publicacionId, motivo) {
        if (!this.warnings.find(w => w.publicacion_id === publicacionId)) {
            this.warnings.push({
                publicacion_id: publicacionId,
                motivo,
                fecha: new Date().toISOString(),
                count: 1
            });
        } else {
            const warning = this.warnings.find(w => w.publicacion_id === publicacionId);
            warning.count += 1;
            warning.motivo = motivo;
            warning.fecha = new Date().toISOString();
        }
        this.guardarWarnings();

        const warning = this.warnings.find(w => w.publicacion_id === publicacionId);
        if (warning.count >= 3) {
            this.bloquearPublicacion(publicacionId);
            this.mostrarNotificacion('⚠️ Esta publicación ha sido bloqueada automáticamente después de 3 advertencias.', 'warning');
        } else {
            this.mostrarNotificacion(`⚠️ Advertencia ${warning.count}/3 registrada.`, 'warning');
        }
    }

    /**
     * Ocultar publicación
     */
    ocultarPublicacion(publicacionId) {
        if (!this.publicacionesOcultas.includes(publicacionId)) {
            this.publicacionesOcultas.push(publicacionId);
            localStorage.setItem('libertad_publicaciones_ocultas', JSON.stringify(this.publicacionesOcultas));
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
            localStorage.setItem('libertad_publicaciones_bloqueadas', JSON.stringify(this.publicacionesBloqueadas));
            this.cargarPublicaciones();
            this.mostrarNotificacion('🚫 Publicación bloqueada', 'info');
        }
    }

    /**
     * Verificar advertencias para contenido sensible
     */
    verificarAdvertencias() {
        const advertencia = document.getElementById('advertencia-contenido');
        const contenido = document.getElementById('contenido-principal');
        
        if (!advertencia || !contenido) return;

        const aceptadoHoy = localStorage.getItem('libertad_contenido_sensible_aceptado');
        const fechaAceptacion = localStorage.getItem('libertad_contenido_sensible_fecha');
        const hoy = new Date().toDateString();

        if (aceptadoHoy === 'true' && fechaAceptacion === hoy) {
            advertencia.style.display = 'none';
            contenido.style.display = 'block';
            this.contenidoSensibleVisible = true;
        } else {
            advertencia.style.display = 'block';
            contenido.style.display = 'none';
            this.contenidoSensibleVisible = false;
        }
    }

    /**
     * Continuar con contenido sensible
     */
    continuarContenidoSensible() {
        localStorage.setItem('libertad_contenido_sensible_aceptado', 'true');
        localStorage.setItem('libertad_contenido_sensible_fecha', new Date().toDateString());
        
        document.getElementById('advertencia-contenido').style.display = 'none';
        document.getElementById('contenido-principal').style.display = 'block';
        this.contenidoSensibleVisible = true;
        
        this.cargarPublicaciones();
    }

    /**
     * Saltar contenido sensible
     */
    saltarContenidoSensible() {
        this.mostrarNotificacion('💜 Entendido. Podés volver cuando te sientas mejor.', 'info');
        window.location.href = '/comunidades/desahogo-libre/';
    }

    /**
     * Mostrar tab
     */
    mostrarTab(tabId) {
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
        } else if (tabId === 'rompimientos') {
            this.cargarPublicacionesPorCategoria('rompimientos');
        } else if (tabId === 'dependencia') {
            this.cargarPublicacionesPorCategoria('dependencia');
        }
    }

    /**
     * Cargar publicaciones del foro
     */
    async cargarPublicaciones() {
        const lista = document.getElementById('publicaciones-lista');
        if (!lista) return;

        try {
            const response = await fetch('/api/libertad-emocional?tipo=publicaciones');
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
            const response = await fetch(`/api/libertad-emocional?tipo=publicaciones&categoria=${categoria}`);
            if (response.ok) {
                const publicaciones = await response.json();
                this.renderizarPublicaciones(publicaciones, lista);
            } else {
                const publicaciones = JSON.parse(localStorage.getItem('libertad_publicaciones') || '[]')
                    .filter(pub => pub.categoria === categoria);
                this.renderizarPublicaciones(publicaciones, lista);
            }
        } catch (error) {
            const publicaciones = JSON.parse(localStorage.getItem('libertad_publicaciones') || '[]')
                .filter(pub => pub.categoria === categoria);
            this.renderizarPublicaciones(publicaciones, lista);
        }
    }

    /**
     * Cargar publicaciones desde localStorage
     */
    cargarPublicacionesLocal() {
        const publicaciones = JSON.parse(localStorage.getItem('libertad_publicaciones') || '[]');
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

        // Filtrar publicaciones ocultas y bloqueadas
        const publicacionesFiltradas = publicaciones.filter(pub => 
            !this.publicacionesOcultas.includes(pub.id) && 
            !this.publicacionesBloqueadas.includes(pub.id)
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
            const warningCount = warning ? warning.count : 0;
            
            return `
                <div class="publicacion-card">
                    <div class="publicacion-header">
                        <div class="publicacion-autor">
                            <i class="fas fa-user-circle"></i>
                            <span>${pub.autor || 'Anónimo'}</span>
                        </div>
                        <div class="publicacion-fecha">
                            ${this.formatearFecha(pub.fecha || pub.created_at)}
                        </div>
                    </div>
                    <div class="publicacion-contenido">
                        <h3>${pub.titulo}</h3>
                        <p>${pub.contenido}</p>
                        ${pub.es_sensible ? '<span class="badge-sensible">⚠️ Contenido Sensible</span>' : ''}
                        ${warningCount > 0 ? `<span class="badge-sensible">⚠️ ${warningCount}/3 Advertencias</span>` : ''}
                    </div>
                    <div class="publicacion-acciones">
                        <button onclick="libertadEmocional.verComentarios('${pub.id}')">
                            <i class="fas fa-comments"></i> Comentarios (${pub.comentarios || 0})
                        </button>
                        <button onclick="libertadEmocional.advertirPublicacion('${pub.id}')">
                            <i class="fas fa-exclamation-triangle"></i> Advertir
                        </button>
                        <button onclick="libertadEmocional.ocultarPublicacion('${pub.id}')">
                            <i class="fas fa-eye-slash"></i> Ocultar
                        </button>
                        ${warningCount >= 2 ? `<button onclick="libertadEmocional.bloquearPublicacion('${pub.id}')" style="color: #EF4444;">
                            <i class="fas fa-ban"></i> Bloquear
                        </button>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Advertir publicación
     */
    advertirPublicacion(publicacionId) {
        const motivo = prompt('¿Cuál es el motivo de la advertencia? (opcional)');
        this.agregarWarning(publicacionId, motivo || 'Sin motivo especificado');
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
        if (!this.contenidoSensibleVisible) {
            this.mostrarNotificacion('⚠️ Por favor aceptá ver el contenido sensible primero', 'warning');
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
                    <form id="form-publicacion">
                        <div class="form-group">
                            <label>Título</label>
                            <input type="text" id="pub-titulo" required>
                        </div>
                        <div class="form-group">
                            <label>Contenido</label>
                            <textarea id="pub-contenido" rows="6" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="pub-sensible">
                                Esta publicación contiene contenido sensible
                            </label>
                        </div>
                        <div class="form-group">
                            <label>Categoría</label>
                            <select id="pub-categoria">
                                <option value="general">General</option>
                                <option value="rompimientos">Rompimientos</option>
                                <option value="dependencia">Dependencia Emocional</option>
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
        const esSensible = document.getElementById('pub-sensible').checked;
        const categoria = document.getElementById('pub-categoria').value;

        const publicacion = {
            id: 'pub-' + Date.now(),
            titulo,
            contenido,
            autor: this.usuarioActual.nombre,
            email: this.usuarioActual.email,
            fecha: new Date().toISOString(),
            es_sensible: esSensible,
            categoria,
            comentarios: 0
        };

        try {
            const response = await fetch('/api/libertad-emocional?tipo=publicaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publicacion)
            });

            if (!response.ok) {
                throw new Error('Error en API');
            }
        } catch (error) {
            const publicaciones = JSON.parse(localStorage.getItem('libertad_publicaciones') || '[]');
            publicaciones.push(publicacion);
            localStorage.setItem('libertad_publicaciones', JSON.stringify(publicaciones));
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
            'sanacion': {
                titulo: 'Proceso de Sanación',
                contenido: `
                    <h3><i class="fas fa-heart"></i> Proceso de Sanación</h3>
                    <div class="recurso-contenido">
                        <h4>Etapas del Duelo</h4>
                        <ul>
                            <li><strong>Negación:</strong> No puedo creer que esto haya pasado</li>
                            <li><strong>Ira:</strong> ¿Por qué a mí? Esto no es justo</li>
                            <li><strong>Negociación:</strong> Si hago X, tal vez vuelva</li>
                            <li><strong>Depresión:</strong> Nada tiene sentido, estoy triste</li>
                            <li><strong>Aceptación:</strong> Esto pasó, y puedo seguir adelante</li>
                        </ul>
                        <p><strong>Recordá:</strong> No hay un tiempo "correcto" para sanar. Cada proceso es único.</p>
                    </div>
                `
            },
            'independencia': {
                titulo: 'Construir Independencia Emocional',
                contenido: `
                    <h3><i class="fas fa-user"></i> Construir Independencia Emocional</h3>
                    <div class="recurso-contenido">
                        <h4>Pasos para la Independencia</h4>
                        <ul>
                            <li><strong>Conocete a vos mismo/a:</strong> ¿Qué te gusta? ¿Qué querés?</li>
                            <li><strong>Establecé límites:</strong> Aprendé a decir "no"</li>
                            <li><strong>Desarrollá hobbies:</strong> Encontrá actividades que disfrutes solo/a</li>
                            <li><strong>Construí autoestima:</strong> Recordá tus logros y fortalezas</li>
                            <li><strong>Practicá la soledad:</strong> Aprendé a estar bien contigo mismo/a</li>
                        </ul>
                        <p><strong>Recordá:</strong> La independencia emocional no significa no necesitar a nadie, sino no depender de una sola persona para tu felicidad.</p>
                    </div>
                `
            },
            'relaciones': {
                titulo: 'Relaciones Saludables',
                contenido: `
                    <h3><i class="fas fa-users"></i> Relaciones Saludables</h3>
                    <div class="recurso-contenido">
                        <h4>Señales de Relaciones Tóxicas</h4>
                        <ul>
                            <li>Control excesivo</li>
                            <li>Manipulación emocional</li>
                            <li>Falta de respeto</li>
                            <li>Aislamiento de amigos y familia</li>
                            <li>Celos extremos</li>
                        </ul>
                        <h4>Señales de Relaciones Saludables</h4>
                        <ul>
                            <li>Respeto mutuo</li>
                            <li>Comunicación abierta</li>
                            <li>Apoyo mutuo</li>
                            <li>Espacio personal</li>
                            <li>Confianza</li>
                        </ul>
                        <p><strong>Recordá:</strong> Merecés una relación que te haga sentir seguro/a, respetado/a y amado/a.</p>
                    </div>
                `
            },
            'autocuidado': {
                titulo: 'Autocuidado Durante la Sanación',
                contenido: `
                    <h3><i class="fas fa-spa"></i> Autocuidado Durante la Sanación</h3>
                    <div class="recurso-contenido">
                        <h4>Estrategias de Autocuidado</h4>
                        <ul>
                            <li><strong>Rutina:</strong> Mantené una rutina diaria</li>
                            <li><strong>Ejercicio:</strong> Movete, aunque sea caminar</li>
                            <li><strong>Alimentación:</strong> Comé bien, tu cuerpo lo necesita</li>
                            <li><strong>Sueño:</strong> Descansá lo suficiente</li>
                            <li><strong>Terapia:</strong> Considerá buscar ayuda profesional</li>
                            <li><strong>Red de apoyo:</strong> Conectate con amigos y familia</li>
                        </ul>
                        <p><strong>Recordá:</strong> Cuidarte no es egoísta, es necesario para sanar.</p>
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
            'error': '#EF4444',
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
let libertadEmocional;
document.addEventListener('DOMContentLoaded', () => {
    libertadEmocional = new LibertadEmocional();
});

