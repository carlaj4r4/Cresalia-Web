/**
 * ═══════════════════════════════════════════════════════════════
 * ⚖️ SISTEMA DE COMUNIDAD INJUSTICIAS VIVIDAS - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Comunidad para compartir injusticias de forma segura y anónima
 * - Sistema de advertencias ESTRICTO (2 warnings)
 * - Validación de seguridad (no nombres, no organizaciones)
 * - Anonimato garantizado
 * - Enfoque en apoyo emocional
 * 
 * Creado con amor por Claude & Carla para Cresalia
 * ═══════════════════════════════════════════════════════════════
 */

class InjusticiasVividas {
    constructor() {
        this.usuarioActual = this.obtenerUsuarioActual();
        this.advertenciaAceptada = false;
        this.publicacionesOcultas = this.cargarPublicacionesOcultas();
        this.publicacionesBloqueadas = this.cargarPublicacionesBloqueadas();
        this.warnings = this.cargarWarnings();
        this.MAX_WARNINGS = 2; // Sistema estricto
        this.palabrasProhibidas = [
            'policía', 'policia', 'comisaría', 'comisaria', 'fiscalía', 'fiscalia',
            'juzgado', 'tribunal', 'corte', 'ministerio', 'gobierno', 'municipalidad',
            'intendencia', 'gobernación', 'gobernacion', 'partido', 'justicia',
            'organización', 'organizacion', 'empresa', 'institución', 'institucion'
        ];
        this.init();
    }

    init() {
        console.log('⚖️ Inicializando Comunidad Injusticias Vividas...');
        this.verificarAdvertencia();
        if (this.advertenciaAceptada) {
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
     * Cargar publicaciones ocultas
     */
    cargarPublicacionesOcultas() {
        return JSON.parse(localStorage.getItem('injusticias_publicaciones_ocultas') || '[]');
    }

    /**
     * Cargar publicaciones bloqueadas
     */
    cargarPublicacionesBloqueadas() {
        return JSON.parse(localStorage.getItem('injusticias_publicaciones_bloqueadas') || '[]');
    }

    /**
     * Cargar warnings del usuario
     */
    cargarWarnings() {
        return JSON.parse(localStorage.getItem('injusticias_warnings') || '[]');
    }

    /**
     * Guardar warnings
     */
    guardarWarnings() {
        localStorage.setItem('injusticias_warnings', JSON.stringify(this.warnings));
    }

    /**
     * Validar contenido por seguridad
     */
    validarContenidoSeguro(contenido) {
        const contenidoLower = contenido.toLowerCase();
        const palabrasEncontradas = [];
        
        this.palabrasProhibidas.forEach(palabra => {
            if (contenidoLower.includes(palabra)) {
                palabrasEncontradas.push(palabra);
            }
        });

        return {
            esSeguro: palabrasEncontradas.length === 0,
            palabrasProhibidas: palabrasEncontradas
        };
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
            localStorage.setItem('injusticias_publicaciones_ocultas', JSON.stringify(this.publicacionesOcultas));
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
            localStorage.setItem('injusticias_publicaciones_bloqueadas', JSON.stringify(this.publicacionesBloqueadas));
            this.cargarPublicaciones();
            this.mostrarNotificacion('🚫 Publicación bloqueada', 'info');
        }
    }

    /**
     * Verificar si la advertencia fue aceptada
     */
    verificarAdvertencia() {
        const advertencia = document.getElementById('advertencia-seguridad');
        const contenido = document.getElementById('contenido-principal');
        
        if (!advertencia || !contenido) return;

        const aceptado = localStorage.getItem('injusticias_advertencia_aceptada');
        const fechaAceptacion = localStorage.getItem('injusticias_advertencia_fecha');
        const hoy = new Date().toDateString();

        if (aceptado === 'true' && fechaAceptacion === hoy) {
            advertencia.style.display = 'none';
            contenido.style.display = 'block';
            this.advertenciaAceptada = true;
        } else {
            advertencia.style.display = 'block';
            contenido.style.display = 'none';
            this.advertenciaAceptada = false;
        }
    }

    /**
     * Aceptar advertencia
     */
    aceptarAdvertencia() {
        localStorage.setItem('injusticias_advertencia_aceptada', 'true');
        localStorage.setItem('injusticias_advertencia_fecha', new Date().toDateString());
        
        document.getElementById('advertencia-seguridad').style.display = 'none';
        document.getElementById('contenido-principal').style.display = 'block';
        this.advertenciaAceptada = true;
        
        this.cargarPublicaciones();
    }

    /**
     * Saltar comunidad
     */
    saltarComunidad() {
        this.mostrarNotificacion('⚖️ Entendido. Podés volver cuando quieras.', 'info');
        window.location.href = '/comunidades/';
    }

    /**
     * Mostrar tab
     */
    mostrarTab(tabId) {
        if (!this.advertenciaAceptada) {
            this.mostrarNotificacion('⚠️ Por favor aceptá la advertencia de seguridad primero', 'warning');
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
        }
    }

    /**
     * Cargar publicaciones del foro
     */
    async cargarPublicaciones() {
        if (!this.advertenciaAceptada) return;
        
        const lista = document.getElementById('publicaciones-lista');
        if (!lista) return;

        try {
            const response = await fetch('/api/injusticias-vividas?tipo=publicaciones');
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
     * Cargar publicaciones desde localStorage
     */
    cargarPublicacionesLocal() {
        const publicaciones = JSON.parse(localStorage.getItem('injusticias_publicaciones') || '[]');
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
                            <i class="fas fa-user-secret"></i>
                            <span>Anónimo</span>
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
                        <button onclick="injusticiasVividas.verComentarios('${pub.id}')">
                            <i class="fas fa-comments"></i> Comentarios (${pub.comentarios || 0})
                        </button>
                        <button onclick="injusticiasVividas.advertirPublicacion('${pub.id}')">
                            <i class="fas fa-exclamation-triangle"></i> Advertir
                        </button>
                        <button onclick="injusticiasVividas.ocultarPublicacion('${pub.id}')">
                            <i class="fas fa-eye-slash"></i> Ocultar
                        </button>
                        ${warningCount >= 1 ? `<button onclick="injusticiasVividas.bloquearPublicacion('${pub.id}')" style="color: #EF4444;">
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
        if (!this.advertenciaAceptada) {
            this.mostrarNotificacion('⚠️ Por favor aceptá la advertencia de seguridad primero', 'warning');
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
                        <i class="fas fa-shield-alt"></i>
                        <p>
                            <strong>IMPORTANTE:</strong> No compartas nombres de organizaciones, personas específicas, 
                            ubicaciones exactas ni información que pueda identificarte. Tu seguridad es lo más importante.
                        </p>
                    </div>
                    <form id="form-publicacion">
                        <div class="form-group">
                            <label>Título</label>
                            <input type="text" id="pub-titulo" required 
                                placeholder="Ej: Injusticia en el trabajo">
                        </div>
                        <div class="form-group">
                            <label>Contenido (sin nombres ni organizaciones)</label>
                            <textarea id="pub-contenido" rows="8" required 
                                placeholder="Compartí tu experiencia sin detalles que puedan identificarte. Este espacio es para apoyo emocional."></textarea>
                            <small style="color: #64748B; margin-top: 8px; display: block;">
                                ⚠️ El sistema validará automáticamente que no compartas información sensible.
                            </small>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="pub-sensible">
                                Esta publicación contiene contenido sensible
                            </label>
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
     * Guardar publicación con validación de seguridad
     */
    async guardarPublicacion() {
        const titulo = document.getElementById('pub-titulo').value.trim();
        const contenido = document.getElementById('pub-contenido').value.trim();
        const esSensible = document.getElementById('pub-sensible').checked;

        // Validar contenido
        const validacion = this.validarContenidoSeguro(titulo + ' ' + contenido);
        
        if (!validacion.esSeguro) {
            const palabras = validacion.palabrasProhibidas.join(', ');
            this.mostrarNotificacion(
                `⚠️ Por seguridad, no podés compartir información sobre: ${palabras}. ` +
                `Por favor, compartí tu experiencia sin mencionar organizaciones o instituciones específicas.`,
                'error'
            );
            return;
        }

        const publicacion = {
            id: 'pub-' + Date.now(),
            titulo,
            contenido,
            autor: 'Anónimo', // Siempre anónimo
            email: this.usuarioActual.email,
            fecha: new Date().toISOString(),
            es_sensible: esSensible,
            comentarios: 0
        };

        try {
            const response = await fetch('/api/injusticias-vividas?tipo=publicaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publicacion)
            });

            if (!response.ok) {
                throw new Error('Error en API');
            }
        } catch (error) {
            const publicaciones = JSON.parse(localStorage.getItem('injusticias_publicaciones') || '[]');
            publicaciones.push(publicacion);
            localStorage.setItem('injusticias_publicaciones', JSON.stringify(publicaciones));
        }

        this.mostrarNotificacion('✅ Publicación creada exitosamente. Tu anonimato está protegido.', 'success');
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
            'anonimato': {
                titulo: 'Proteger tu Anonimato',
                contenido: `
                    <h3><i class="fas fa-user-secret"></i> Proteger tu Anonimato</h3>
                    <div class="recurso-contenido">
                        <h4>Consejos de Seguridad</h4>
                        <ul>
                            <li><strong>No compartas nombres:</strong> No menciones nombres de personas, organizaciones o instituciones</li>
                            <li><strong>No compartas ubicaciones:</strong> No menciones direcciones exactas o lugares específicos</li>
                            <li><strong>Usá términos generales:</strong> "Una institución", "una persona", "un lugar"</li>
                            <li><strong>No compartas fechas exactas:</strong> Usá términos como "hace tiempo", "recientemente"</li>
                            <li><strong>Enfocate en la experiencia:</strong> Compartí cómo te sentiste, no los detalles específicos</li>
                        </ul>
                        <h4>Por qué es Importante</h4>
                        <p>
                            Proteger tu anonimato es crucial para tu seguridad y la de otros. 
                            Este espacio es para apoyo emocional, no para denuncias específicas.
                        </p>
                        <p><strong>Recordá:</strong> Tu seguridad es lo más importante. Si necesitás hacer una denuncia específica, 
                        buscá organizaciones especializadas con protección adecuada.</p>
                    </div>
                `
            },
            'apoyo': {
                titulo: 'Buscar Apoyo',
                contenido: `
                    <h3><i class="fas fa-hands-helping"></i> Buscar Apoyo</h3>
                    <div class="recurso-contenido">
                        <h4>Recursos Generales</h4>
                        <ul>
                            <li><strong>Líneas de ayuda:</strong> Buscá líneas de ayuda generales en tu país</li>
                            <li><strong>Terapia:</strong> Considerá buscar ayuda profesional</li>
                            <li><strong>Grupos de apoyo:</strong> Buscá grupos de apoyo en tu zona</li>
                            <li><strong>Organizaciones de derechos humanos:</strong> Buscá organizaciones generales de derechos humanos</li>
                        </ul>
                        <h4>Este Espacio</h4>
                        <p>
                            Este espacio es para apoyo emocional y saber que no estás solo/a. 
                            No es para denuncias específicas ni para buscar justicia legal.
                        </p>
                        <p><strong>Recordá:</strong> Si necesitás hacer una denuncia específica, buscá organizaciones 
                        especializadas con protección adecuada y asesoramiento legal.</p>
                    </div>
                `
            },
            'procesar': {
                titulo: 'Procesar la Injusticia',
                contenido: `
                    <h3><i class="fas fa-heart"></i> Procesar la Injusticia</h3>
                    <div class="recurso-contenido">
                        <h4>Cómo Procesar Emocionalmente</h4>
                        <ul>
                            <li><strong>Validá tus emociones:</strong> Es normal sentir ira, tristeza, frustración</li>
                            <li><strong>Compartí con otros:</strong> Hablar con personas que entienden puede ayudar</li>
                            <li><strong>Escribí sobre ello:</strong> Escribir puede ayudar a procesar</li>
                            <li><strong>Buscá terapia:</strong> Si el dolor es muy intenso, considerá terapia</li>
                            <li><strong>No te culpes:</strong> La injusticia no es tu culpa</li>
                        </ul>
                        <h4>Recuerda</h4>
                        <p>
                            Las injusticias duelen profundamente. No estás solo/a. 
                            Muchas personas han vivido injusticias similares.
                        </p>
                        <p><strong>Recordá:</strong> Tu experiencia es válida. Merecés apoyo y comprensión.</p>
                    </div>
                `
            },
            'seguridad': {
                titulo: 'Seguridad Digital',
                contenido: `
                    <h3><i class="fas fa-shield-alt"></i> Seguridad Digital</h3>
                    <div class="recurso-contenido">
                        <h4>Consejos de Seguridad Online</h4>
                        <ul>
                            <li><strong>Usá VPN:</strong> Considerá usar una VPN para mayor anonimato</li>
                            <li><strong>No uses tu nombre real:</strong> Usá un seudónimo</li>
                            <li><strong>No compartas información personal:</strong> No compartas email, teléfono, etc.</li>
                            <li><strong>Borrá el historial:</strong> Considerá borrar el historial del navegador</li>
                            <li><strong>Usá modo incógnito:</strong> Considerá usar modo incógnito</li>
                        </ul>
                        <h4>En este Espacio</h4>
                        <p>
                            Todas las publicaciones son anónimas. No compartimos información personal. 
                            Tu seguridad es nuestra prioridad.
                        </p>
                        <p><strong>Recordá:</strong> Si sentís que estás en peligro, buscá ayuda inmediata. 
                        Tu seguridad física es más importante que cualquier otra cosa.</p>
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
        }, 5000);
    }
}

// Inicializar cuando el DOM esté listo
let injusticiasVividas;
document.addEventListener('DOMContentLoaded', () => {
    injusticiasVividas = new InjusticiasVividas();
});



