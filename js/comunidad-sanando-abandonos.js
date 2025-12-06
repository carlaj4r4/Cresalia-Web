/**
 * ═══════════════════════════════════════════════════════════════
 * 💙 SISTEMA DE COMUNIDAD SANANDO ABANDONOS - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Comunidad para procesar el abandono y encontrar sanación
 * - Sistema de advertencias ESTRICTO (2 warnings)
 * - Ocultar/bloquear publicaciones
 * - Advertencias de contenido sensible
 * - Secciones separadas: "Fui abandonado/a" y "Abandoné"
 * - Recursos de sanación
 * 
 * NOTA: Reencuentros NO implementados por seguridad.
 * Estructura preparada para futuro si los usuarios lo solicitan.
 * 
 * Creado con amor por Claude & Carla para Cresalia
 * ═══════════════════════════════════════════════════════════════
 */

class SanandoAbandonos {
    constructor() {
        this.usuarioActual = this.obtenerUsuarioActual();
        this.contenidoSensibleVisible = false;
        this.publicacionesOcultas = this.cargarPublicacionesOcultas();
        this.publicacionesBloqueadas = this.cargarPublicacionesBloqueadas();
        this.warnings = this.cargarWarnings();
        this.MAX_WARNINGS = 2; // Más estricto que otras comunidades
        this.init();
    }

    init() {
        console.log('💙 Inicializando Comunidad Sanando Abandonos...');
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
        return JSON.parse(localStorage.getItem('abandonos_publicaciones_ocultas') || '[]');
    }

    /**
     * Cargar publicaciones bloqueadas
     */
    cargarPublicacionesBloqueadas() {
        return JSON.parse(localStorage.getItem('abandonos_publicaciones_bloqueadas') || '[]');
    }

    /**
     * Cargar warnings del usuario
     */
    cargarWarnings() {
        return JSON.parse(localStorage.getItem('abandonos_warnings') || '[]');
    }

    /**
     * Guardar warnings
     */
    guardarWarnings() {
        localStorage.setItem('abandonos_warnings', JSON.stringify(this.warnings));
    }

    /**
     * Agregar warning a una publicación (2 warnings máximo)
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
        if (warning.count >= this.MAX_WARNINGS) {
            this.bloquearPublicacion(publicacionId);
            this.mostrarNotificacion(`⚠️ Esta publicación ha sido bloqueada automáticamente después de ${this.MAX_WARNINGS} advertencias.`, 'warning');
        } else {
            this.mostrarNotificacion(`⚠️ Advertencia ${warning.count}/${this.MAX_WARNINGS} registrada.`, 'warning');
        }
    }

    /**
     * Ocultar publicación
     */
    ocultarPublicacion(publicacionId) {
        if (!this.publicacionesOcultas.includes(publicacionId)) {
            this.publicacionesOcultas.push(publicacionId);
            localStorage.setItem('abandonos_publicaciones_ocultas', JSON.stringify(this.publicacionesOcultas));
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
            localStorage.setItem('abandonos_publicaciones_bloqueadas', JSON.stringify(this.publicacionesBloqueadas));
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

        const aceptadoHoy = localStorage.getItem('abandonos_contenido_sensible_aceptado');
        const fechaAceptacion = localStorage.getItem('abandonos_contenido_sensible_fecha');
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
        localStorage.setItem('abandonos_contenido_sensible_aceptado', 'true');
        localStorage.setItem('abandonos_contenido_sensible_fecha', new Date().toDateString());
        
        document.getElementById('advertencia-contenido').style.display = 'none';
        document.getElementById('contenido-principal').style.display = 'block';
        this.contenidoSensibleVisible = true;
        
        this.cargarPublicaciones();
    }

    /**
     * Saltar contenido sensible
     */
    saltarContenidoSensible() {
        this.mostrarNotificacion('💙 Entendido. Podés volver cuando te sientas mejor.', 'info');
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
        } else if (tabId === 'fui-abandonado') {
            this.cargarPublicacionesPorCategoria('fui-abandonado');
        } else if (tabId === 'abandone') {
            this.cargarPublicacionesPorCategoria('abandone');
        }
    }

    /**
     * Cargar publicaciones del foro
     */
    async cargarPublicaciones() {
        const lista = document.getElementById('publicaciones-lista');
        if (!lista) return;

        try {
            const response = await fetch('/api/sanando-abandonos?tipo=publicaciones');
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
            const response = await fetch(`/api/sanando-abandonos?tipo=publicaciones&categoria=${categoria}`);
            if (response.ok) {
                const publicaciones = await response.json();
                this.renderizarPublicaciones(publicaciones, lista);
            } else {
                const publicaciones = JSON.parse(localStorage.getItem('abandonos_publicaciones') || '[]')
                    .filter(pub => pub.categoria === categoria);
                this.renderizarPublicaciones(publicaciones, lista);
            }
        } catch (error) {
            const publicaciones = JSON.parse(localStorage.getItem('abandonos_publicaciones') || '[]')
                .filter(pub => pub.categoria === categoria);
            this.renderizarPublicaciones(publicaciones, lista);
        }
    }

    /**
     * Cargar publicaciones desde localStorage
     */
    cargarPublicacionesLocal() {
        const publicaciones = JSON.parse(localStorage.getItem('abandonos_publicaciones') || '[]');
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
                        ${warningCount > 0 ? `<span class="badge-sensible">⚠️ ${warningCount}/${this.MAX_WARNINGS} Advertencias</span>` : ''}
                    </div>
                    <div class="publicacion-acciones">
                        <button onclick="sanandoAbandonos.verComentarios('${pub.id}')">
                            <i class="fas fa-comments"></i> Comentarios (${pub.comentarios || 0})
                        </button>
                        <button onclick="sanandoAbandonos.advertirPublicacion('${pub.id}')">
                            <i class="fas fa-exclamation-triangle"></i> Advertir
                        </button>
                        <button onclick="sanandoAbandonos.ocultarPublicacion('${pub.id}')">
                            <i class="fas fa-eye-slash"></i> Ocultar
                        </button>
                        ${warningCount >= 1 ? `<button onclick="sanandoAbandonos.bloquearPublicacion('${pub.id}')" style="color: #EF4444;">
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
                            <select id="pub-categoria" required>
                                <option value="">Seleccioná una opción</option>
                                <option value="general">General</option>
                                <option value="fui-abandonado">Fui Abandonado/a</option>
                                <option value="abandone">Abandoné</option>
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
            es_sensible: esSensible,
            categoria,
            comentarios: 0
        };

        try {
            const response = await fetch('/api/sanando-abandonos?tipo=publicaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publicacion)
            });

            if (!response.ok) {
                throw new Error('Error en API');
            }
        } catch (error) {
            const publicaciones = JSON.parse(localStorage.getItem('abandonos_publicaciones') || '[]');
            publicaciones.push(publicacion);
            localStorage.setItem('abandonos_publicaciones', JSON.stringify(publicaciones));
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
            'procesar': {
                titulo: 'Procesar el Abandono',
                contenido: `
                    <h3><i class="fas fa-heart"></i> Procesar el Abandono</h3>
                    <div class="recurso-contenido">
                        <h4>Etapas del Duelo por Abandono</h4>
                        <ul>
                            <li><strong>Negación:</strong> No puedo creer que me hayan abandonado</li>
                            <li><strong>Ira:</strong> ¿Por qué me abandonaron? Esto no es justo</li>
                            <li><strong>Negociación:</strong> Si hago X, tal vez vuelvan</li>
                            <li><strong>Depresión:</strong> Me siento vacío/a, sin valor</li>
                            <li><strong>Aceptación:</strong> Fui abandonado/a, pero puedo seguir adelante</li>
                        </ul>
                        <h4>Cómo Avanzar</h4>
                        <ul>
                            <li>Permitite sentir todas las emociones sin juzgarte</li>
                            <li>Buscá apoyo en personas de confianza</li>
                            <li>Considerá terapia profesional si el dolor es muy intenso</li>
                            <li>Recordá que el abandono no define tu valor</li>
                            <li>Enfocate en reconstruir tu vida paso a paso</li>
                        </ul>
                        <p><strong>Recordá:</strong> El abandono no es tu culpa. Merecés amor y respeto.</p>
                    </div>
                `
            },
            'culpa': {
                titulo: 'Manejar la Culpa',
                contenido: `
                    <h3><i class="fas fa-balance-scale"></i> Manejar la Culpa</h3>
                    <div class="recurso-contenido">
                        <h4>Si Abandonaste y Sentís Culpa</h4>
                        <ul>
                            <li><strong>Reconocé tus emociones:</strong> La culpa es válida, pero no tiene que definirte</li>
                            <li><strong>Entendé tus razones:</strong> A veces abandonar es necesario para tu bienestar</li>
                            <li><strong>Perdonate:</strong> Aprendé a perdonarte a vos mismo/a</li>
                            <li><strong>No te castigues:</strong> El autocastigo no ayuda a nadie</li>
                            <li><strong>Buscá ayuda:</strong> Si la culpa es muy intensa, considerá terapia</li>
                        </ul>
                        <h4>Proceso de Perdón Propio</h4>
                        <ul>
                            <li>Reconocé lo que pasó sin justificarte ni castigarte</li>
                            <li>Entendé que todos cometemos errores</li>
                            <li>Aprendé de la experiencia</li>
                            <li>Permitite seguir adelante</li>
                            <li>Si es posible y seguro, podés disculparte (pero no es obligatorio)</li>
                        </ul>
                        <p><strong>Recordá:</strong> Sentir culpa no te hace una mala persona. Lo que hacés con esa culpa es lo que importa.</p>
                    </div>
                `
            },
            'autoestima': {
                titulo: 'Reconstruir Autoestima',
                contenido: `
                    <h3><i class="fas fa-star"></i> Reconstruir Autoestima</h3>
                    <div class="recurso-contenido">
                        <h4>Después del Abandono</h4>
                        <ul>
                            <li><strong>Recordá tu valor:</strong> El abandono no define quién sos</li>
                            <li><strong>Celebrá tus logros:</strong> Anotá tus logros, por pequeños que sean</li>
                            <li><strong>Practicá autocompasión:</strong> Sé amable contigo mismo/a</li>
                            <li><strong>Rodéate de apoyo:</strong> Conectate con personas que te valoren</li>
                            <li><strong>Desarrollá hobbies:</strong> Encontrá actividades que disfrutes</li>
                        </ul>
                        <h4>Estrategias Prácticas</h4>
                        <ul>
                            <li>Escribí una lista de tus fortalezas</li>
                            <li>Hacé algo que te haga sentir bien cada día</li>
                            <li>Practicá afirmaciones positivas</li>
                            <li>Evitá compararte con otros</li>
                            <li>Recordá que tu valor no depende de que otros te elijan</li>
                        </ul>
                        <p><strong>Recordá:</strong> Tu autoestima es tuya. Nadie puede quitártela, solo vos podés reconstruirla.</p>
                    </div>
                `
            },
            'perdon': {
                titulo: 'Perdón y Cierre',
                contenido: `
                    <h3><i class="fas fa-dove"></i> Perdón y Cierre</h3>
                    <div class="recurso-contenido">
                        <h4>Proceso de Perdón</h4>
                        <ul>
                            <li><strong>El perdón no significa olvidar:</strong> Podés perdonar sin olvidar</li>
                            <li><strong>El perdón es para vos:</strong> Perdonar te libera, no a la otra persona</li>
                            <li><strong>No requiere reencuentro:</strong> Podés perdonar sin volver a ver a la persona</li>
                            <li><strong>Es un proceso:</strong> No tiene que ser inmediato</li>
                            <li><strong>No es obligatorio:</strong> Si no podés perdonar aún, está bien</li>
                        </ul>
                        <h4>Cerrar Ciclos</h4>
                        <ul>
                            <li>Escribí una carta (no la envíes, es para vos)</li>
                            <li>Ritual de cierre simbólico (quemar, enterrar, etc.)</li>
                            <li>Hablá con un terapeuta o persona de confianza</li>
                            <li>Enfocate en el presente y futuro, no en el pasado</li>
                            <li>Recordá que cerrar un ciclo no significa que no duela</li>
                        </ul>
                        <h4>Sin Reencuentro</h4>
                        <p>El cierre no requiere reencuentro. Podés cerrar ciclos sin volver a ver a la persona. 
                        Tu sanación es lo más importante, y a veces el reencuentro puede reabrir heridas.</p>
                        <p><strong>Recordá:</strong> El perdón y el cierre son para vos, no para la otra persona. 
                        Tu bienestar es la prioridad.</p>
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
let sanandoAbandonos;
document.addEventListener('DOMContentLoaded', () => {
    sanandoAbandonos = new SanandoAbandonos();
});



