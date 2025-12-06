/**
 * ═══════════════════════════════════════════════════════════════
 * 💭 SISTEMA DE COMUNIDAD DESAHOGO LIBRE - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Comunidad sin etiquetas para expresar el dolor sin categorías
 * - Sin categorías obligatorias
 * - Sistema de advertencias (3 warnings)
 * - Ocultar/bloquear publicaciones
 * - Recursos opcionales
 * 
 * Creado con amor por Claude & Carla para Cresalia
 * ═══════════════════════════════════════════════════════════════
 */

class DesahogoLibre {
    constructor() {
        this.usuarioActual = this.obtenerUsuarioActual();
        this.publicacionesOcultas = this.cargarPublicacionesOcultas();
        this.publicacionesBloqueadas = this.cargarPublicacionesBloqueadas();
        this.warnings = this.cargarWarnings();
        this.init();
    }

    init() {
        console.log('💭 Inicializando Comunidad Desahogo Libre...');
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
        return JSON.parse(localStorage.getItem('desahogo_publicaciones_ocultas') || '[]');
    }

    /**
     * Cargar publicaciones bloqueadas
     */
    cargarPublicacionesBloqueadas() {
        return JSON.parse(localStorage.getItem('desahogo_publicaciones_bloqueadas') || '[]');
    }

    /**
     * Cargar warnings del usuario
     */
    cargarWarnings() {
        return JSON.parse(localStorage.getItem('desahogo_warnings') || '[]');
    }

    /**
     * Guardar warnings
     */
    guardarWarnings() {
        localStorage.setItem('desahogo_warnings', JSON.stringify(this.warnings));
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
            localStorage.setItem('desahogo_publicaciones_ocultas', JSON.stringify(this.publicacionesOcultas));
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
            localStorage.setItem('desahogo_publicaciones_bloqueadas', JSON.stringify(this.publicacionesBloqueadas));
            this.cargarPublicaciones();
            this.mostrarNotificacion('🚫 Publicación bloqueada', 'info');
        }
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
        }
    }

    /**
     * Cargar publicaciones del foro
     */
    async cargarPublicaciones() {
        const lista = document.getElementById('publicaciones-lista');
        if (!lista) return;

        try {
            const response = await fetch('/api/desahogo-libre?tipo=publicaciones');
            if (response.ok) {
                const publicaciones = await response.json();
                this.renderizarPublicaciones(publicaciones);
            } else {
                this.cargarPublicacionesLocal();
            }
        } catch (error) {
            console.warn('⚠️ Error al cargar publicaciones, usando localStorage:', error);
            this.cargarPublicacionesLocal();
        }
    }

    /**
     * Cargar publicaciones desde localStorage
     */
    cargarPublicacionesLocal() {
        const publicaciones = JSON.parse(localStorage.getItem('desahogo_publicaciones') || '[]');
        this.renderizarPublicaciones(publicaciones);
    }

    /**
     * Renderizar publicaciones
     */
    renderizarPublicaciones(publicaciones) {
        const lista = document.getElementById('publicaciones-lista');
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
                        ${pub.titulo ? `<h3>${pub.titulo}</h3>` : ''}
                        <p>${pub.contenido}</p>
                        ${warningCount > 0 ? `<span class="badge-sensible">⚠️ ${warningCount}/3 Advertencias</span>` : ''}
                    </div>
                    <div class="publicacion-acciones">
                        <button onclick="desahogoLibre.verComentarios('${pub.id}')">
                            <i class="fas fa-comments"></i> Comentarios (${pub.comentarios || 0})
                        </button>
                        <button onclick="desahogoLibre.advertirPublicacion('${pub.id}')">
                            <i class="fas fa-exclamation-triangle"></i> Advertir
                        </button>
                        <button onclick="desahogoLibre.ocultarPublicacion('${pub.id}')">
                            <i class="fas fa-eye-slash"></i> Ocultar
                        </button>
                        ${warningCount >= 2 ? `<button onclick="desahogoLibre.bloquearPublicacion('${pub.id}')" style="color: #EF4444;">
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
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-plus"></i> Desahogarme</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="form-publicacion">
                        <div class="form-group">
                            <label>Título (opcional)</label>
                            <input type="text" id="pub-titulo" placeholder="Si querés, podés poner un título...">
                        </div>
                        <div class="form-group">
                            <label>Lo que necesitás expresar</label>
                            <textarea id="pub-contenido" rows="8" required 
                                placeholder="Escribí lo que necesitás desahogar. No hay reglas, no hay categorías. Solo vos y tus palabras."></textarea>
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
        const titulo = document.getElementById('pub-titulo').value.trim();
        const contenido = document.getElementById('pub-contenido').value.trim();

        if (!contenido) {
            this.mostrarNotificacion('⚠️ Por favor escribí algo para desahogarte', 'warning');
            return;
        }

        const publicacion = {
            id: 'pub-' + Date.now(),
            titulo: titulo || null,
            contenido,
            autor: this.usuarioActual.nombre,
            email: this.usuarioActual.email,
            fecha: new Date().toISOString(),
            comentarios: 0
        };

        try {
            const response = await fetch('/api/desahogo-libre?tipo=publicaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publicacion)
            });

            if (!response.ok) {
                throw new Error('Error en API');
            }
        } catch (error) {
            const publicaciones = JSON.parse(localStorage.getItem('desahogo_publicaciones') || '[]');
            publicaciones.push(publicacion);
            localStorage.setItem('desahogo_publicaciones', JSON.stringify(publicaciones));
        }

        this.mostrarNotificacion('✅ Publicación creada. Gracias por compartir.', 'success');
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
            'identificar': {
                titulo: 'Identificar Emociones (Opcional)',
                contenido: `
                    <h3><i class="fas fa-lightbulb"></i> Identificar Emociones</h3>
                    <div class="recurso-contenido">
                        <p>Si querés, podés explorar qué sentís. No es obligatorio, pero a veces ponerle nombre a lo que sentimos puede ayudar.</p>
                        <h4>Emociones Comunes</h4>
                        <ul>
                            <li><strong>Tristeza:</strong> Sensación de vacío, llanto, desánimo</li>
                            <li><strong>Ansiedad:</strong> Preocupación constante, nerviosismo, miedo</li>
                            <li><strong>Ira:</strong> Enojo, frustración, irritabilidad</li>
                            <li><strong>Miedo:</strong> Temor, inseguridad, pánico</li>
                            <li><strong>Vergüenza:</strong> Sentirse expuesto, humillado</li>
                            <li><strong>Culpa:</strong> Sentirse responsable de algo negativo</li>
                        </ul>
                        <p><strong>Recordá:</strong> Todas las emociones son válidas. No hay emociones "buenas" o "malas".</p>
                    </div>
                `
            },
            'apoyo': {
                titulo: 'Buscar Apoyo',
                contenido: `
                    <h3><i class="fas fa-hands-helping"></i> Buscar Apoyo</h3>
                    <div class="recurso-contenido">
                        <p>Si sentís que necesitás ayuda profesional, no estás sola. Hay recursos disponibles.</p>
                        <h4>Líneas de Ayuda</h4>
                        <ul>
                            <li><strong>Línea de Prevención del Suicidio:</strong> 135 (Argentina)</li>
                            <li><strong>Línea de Salud Mental:</strong> 0800-222-1002</li>
                        </ul>
                        <h4>Buscá Ayuda Profesional</h4>
                        <ul>
                            <li>Psicólogos y terapeutas en tu zona</li>
                            <li>Centros de salud mental públicos</li>
                            <li>Grupos de apoyo</li>
                        </ul>
                        <p><strong>Recordá:</strong> Buscar ayuda es un acto de valentía, no de debilidad.</p>
                    </div>
                `
            },
            'autocuidado': {
                titulo: 'Autocuidado',
                contenido: `
                    <h3><i class="fas fa-spa"></i> Autocuidado</h3>
                    <div class="recurso-contenido">
                        <p>Ideas simples para cuidarte cuando todo parece demasiado.</p>
                        <h4>Actividades de Autocuidado</h4>
                        <ul>
                            <li><strong>Respiración:</strong> Tomate 5 minutos para respirar profundamente</li>
                            <li><strong>Agua:</strong> Tomá un vaso de agua, date una ducha</li>
                            <li><strong>Movimiento:</strong> Caminá aunque sea 10 minutos</li>
                            <li><strong>Descanso:</strong> Permitite descansar sin culpa</li>
                            <li><strong>Algo que te guste:</strong> Hacé algo pequeño que te traiga alegría</li>
                        </ul>
                        <p><strong>Recordá:</strong> El autocuidado no es egoísta, es necesario.</p>
                    </div>
                `
            },
            'comunidades': {
                titulo: 'Otras Comunidades',
                contenido: `
                    <h3><i class="fas fa-users"></i> Otras Comunidades</h3>
                    <div class="recurso-contenido">
                        <p>Si después de desahogarte querés explorar comunidades más específicas, podés visitar:</p>
                        <ul>
                            <li><strong>Libertad Emocional:</strong> Para rompimientos y dependencia emocional</li>
                            <li><strong>Maternidad:</strong> Para embarazadas y futuras madres</li>
                            <li><strong>Burnout:</strong> Para agotamiento y estrés laboral</li>
                        </ul>
                        <p><strong>Recordá:</strong> No tenés que encajar en ninguna categoría. Estás bien como estás.</p>
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
let desahogoLibre;
document.addEventListener('DOMContentLoaded', () => {
    desahogoLibre = new DesahogoLibre();
});



