/**
 * ═══════════════════════════════════════════════════════════════
 * 💚 SISTEMA DE COMUNIDAD LIBERTAD ECONÓMICA - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Comunidad para romper cadenas económicas y construir independencia
 * - Sistema de advertencias ESTRICTO (2 warnings)
 * - Ocultar/bloquear publicaciones
 * - Advertencias de contenido sensible
 * - Secciones: Identificar Violencia, Planificar Salida, Recursos
 * - Anonimato garantizado
 * 
 * Creado con amor por Claude & Carla para Cresalia
 * ═══════════════════════════════════════════════════════════════
 */

class LibertadEconomica {
    constructor() {
        this.usuarioActual = this.obtenerUsuarioActual();
        this.contenidoSensibleVisible = false;
        this.publicacionesOcultas = this.cargarPublicacionesOcultas();
        this.publicacionesBloqueadas = this.cargarPublicacionesBloqueadas();
        this.warnings = this.cargarWarnings();
        this.MAX_WARNINGS = 2; // Sistema estricto
        this.init();
    }

    init() {
        console.log('💚 Inicializando Comunidad Libertad Económica...');
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
        return JSON.parse(localStorage.getItem('economica_publicaciones_ocultas') || '[]');
    }

    /**
     * Cargar publicaciones bloqueadas
     */
    cargarPublicacionesBloqueadas() {
        return JSON.parse(localStorage.getItem('economica_publicaciones_bloqueadas') || '[]');
    }

    /**
     * Cargar warnings del usuario
     */
    cargarWarnings() {
        return JSON.parse(localStorage.getItem('economica_warnings') || '[]');
    }

    /**
     * Guardar warnings
     */
    guardarWarnings() {
        localStorage.setItem('economica_warnings', JSON.stringify(this.warnings));
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
            localStorage.setItem('economica_publicaciones_ocultas', JSON.stringify(this.publicacionesOcultas));
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
            localStorage.setItem('economica_publicaciones_bloqueadas', JSON.stringify(this.publicacionesBloqueadas));
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

        const aceptadoHoy = localStorage.getItem('economica_contenido_sensible_aceptado');
        const fechaAceptacion = localStorage.getItem('economica_contenido_sensible_fecha');
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
        localStorage.setItem('economica_contenido_sensible_aceptado', 'true');
        localStorage.setItem('economica_contenido_sensible_fecha', new Date().toDateString());
        
        document.getElementById('advertencia-contenido').style.display = 'none';
        document.getElementById('contenido-principal').style.display = 'block';
        this.contenidoSensibleVisible = true;
        
        this.cargarPublicaciones();
    }

    /**
     * Saltar contenido sensible
     */
    saltarContenidoSensible() {
        this.mostrarNotificacion('💚 Entendido. Podés volver cuando te sientas mejor.', 'info');
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
        } else if (tabId === 'identificar') {
            this.cargarPublicacionesPorCategoria('identificar');
        } else if (tabId === 'planificar') {
            this.cargarPublicacionesPorCategoria('planificar');
        }
    }

    /**
     * Cargar publicaciones del foro
     */
    async cargarPublicaciones() {
        const lista = document.getElementById('publicaciones-lista');
        if (!lista) return;

        try {
            const response = await fetch('/api/libertad-economica?tipo=publicaciones');
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
            const response = await fetch(`/api/libertad-economica?tipo=publicaciones&categoria=${categoria}`);
            if (response.ok) {
                const publicaciones = await response.json();
                this.renderizarPublicaciones(publicaciones, lista);
            } else {
                const publicaciones = JSON.parse(localStorage.getItem('economica_publicaciones') || '[]')
                    .filter(pub => pub.categoria === categoria);
                this.renderizarPublicaciones(publicaciones, lista);
            }
        } catch (error) {
            const publicaciones = JSON.parse(localStorage.getItem('economica_publicaciones') || '[]')
                .filter(pub => pub.categoria === categoria);
            this.renderizarPublicaciones(publicaciones, lista);
        }
    }

    /**
     * Cargar publicaciones desde localStorage
     */
    cargarPublicacionesLocal() {
        const publicaciones = JSON.parse(localStorage.getItem('economica_publicaciones') || '[]');
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
                        <button onclick="libertadEconomica.verComentarios('${pub.id}')">
                            <i class="fas fa-comments"></i> Comentarios (${pub.comentarios || 0})
                        </button>
                        <button onclick="libertadEconomica.advertirPublicacion('${pub.id}')">
                            <i class="fas fa-exclamation-triangle"></i> Advertir
                        </button>
                        <button onclick="libertadEconomica.ocultarPublicacion('${pub.id}')">
                            <i class="fas fa-eye-slash"></i> Ocultar
                        </button>
                        ${warningCount >= 1 ? `<button onclick="libertadEconomica.bloquearPublicacion('${pub.id}')" style="color: #EF4444;">
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
                                <option value="identificar">Identificar Violencia</option>
                                <option value="planificar">Planificar Salida</option>
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
            const response = await fetch('/api/libertad-economica?tipo=publicaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publicacion)
            });

            if (!response.ok) {
                throw new Error('Error en API');
            }
        } catch (error) {
            const publicaciones = JSON.parse(localStorage.getItem('economica_publicaciones') || '[]');
            publicaciones.push(publicacion);
            localStorage.setItem('economica_publicaciones', JSON.stringify(publicaciones));
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
            'señales': {
                titulo: 'Señales de Violencia Económica',
                contenido: `
                    <h3><i class="fas fa-exclamation-triangle"></i> Señales de Violencia Económica</h3>
                    <div class="recurso-contenido">
                        <h4>Señales Comunes</h4>
                        <ul>
                            <li><strong>Control del dinero:</strong> Tu pareja controla todo el dinero y no te permite acceso</li>
                            <li><strong>Prohibición de trabajar:</strong> Te prohíbe trabajar o estudiar</li>
                            <li><strong>Quitar tus ingresos:</strong> Te quita tu sueldo o te obliga a entregarlo</li>
                            <li><strong>Sin acceso a cuentas:</strong> No tenés acceso a cuentas bancarias o tarjetas</li>
                            <li><strong>Rendición de cuentas:</strong> Tenés que justificar cada gasto</li>
                            <li><strong>Aislamiento financiero:</strong> Te aísla de familiares o amigos que podrían ayudarte</li>
                            <li><strong>Deudas a tu nombre:</strong> Genera deudas a tu nombre sin tu consentimiento</li>
                            <li><strong>Sin documentos:</strong> Te quita documentos importantes (DNI, pasaporte, etc.)</li>
                        </ul>
                        <h4>Impacto Emocional</h4>
                        <ul>
                            <li>Sentimiento de dependencia total</li>
                            <li>Baja autoestima</li>
                            <li>Miedo constante</li>
                            <li>Aislamiento social</li>
                            <li>Pérdida de autonomía</li>
                        </ul>
                        <p><strong>Recordá:</strong> La violencia económica es una forma de violencia doméstica. No es tu culpa.</p>
                    </div>
                `
            },
            'planificacion': {
                titulo: 'Planificación Financiera para la Salida',
                contenido: `
                    <h3><i class="fas fa-clipboard-list"></i> Planificación Financiera para la Salida</h3>
                    <div class="recurso-contenido">
                        <h4>Pasos para Planificar</h4>
                        <ul>
                            <li><strong>Documentá todo:</strong> Guardá copias de documentos importantes en un lugar seguro</li>
                            <li><strong>Ahorro secreto:</strong> Si podés, ahorrá pequeñas cantidades en un lugar seguro</li>
                            <li><strong>Cuenta propia:</strong> Si es posible, abrí una cuenta bancaria a tu nombre</li>
                            <li><strong>Red de apoyo:</strong> Identificá personas de confianza que puedan ayudarte</li>
                            <li><strong>Plan de emergencia:</strong> Tené un plan de dónde ir si necesitás salir rápido</li>
                            <li><strong>Documentos:</strong> Asegurate de tener acceso a documentos importantes</li>
                        </ul>
                        <h4>Recursos Financieros</h4>
                        <ul>
                            <li>Programas de ayuda gubernamental</li>
                            <li>Organizaciones de apoyo a víctimas</li>
                            <li>Asesoramiento financiero gratuito</li>
                            <li>Programas de empleo</li>
                        </ul>
                        <p><strong>Recordá:</strong> Planificar tu salida es crucial para tu seguridad. No tenés que hacerlo sola/o.</p>
                    </div>
                `
            },
            'legal': {
                titulo: 'Recursos Legales',
                contenido: `
                    <h3><i class="fas fa-gavel"></i> Recursos Legales</h3>
                    <div class="recurso-contenido">
                        <h4>Derechos que Tenés</h4>
                        <ul>
                            <li><strong>Derecho a la propiedad:</strong> Tenés derecho a tus bienes y recursos</li>
                            <li><strong>Derecho al trabajo:</strong> Nadie puede prohibirte trabajar</li>
                            <li><strong>Derecho a la educación:</strong> Tenés derecho a estudiar</li>
                            <li><strong>Derecho a la independencia:</strong> Tenés derecho a tomar tus propias decisiones financieras</li>
                        </ul>
                        <h4>Recursos Legales Disponibles</h4>
                        <ul>
                            <li><strong>Línea 144:</strong> Línea nacional de atención a víctimas de violencia</li>
                            <li><strong>Defensorías:</strong> Defensorías del pueblo y de la mujer</li>
                            <li><strong>Asesoramiento legal gratuito:</strong> En centros de atención a víctimas</li>
                            <li><strong>Denuncias:</strong> Podés denunciar violencia económica</li>
                        </ul>
                        <h4>Documentos Importantes</h4>
                        <ul>
                            <li>DNI o documento de identidad</li>
                            <li>Partidas de nacimiento (tuya y de hijos/as si los hay)</li>
                            <li>Documentos de propiedad</li>
                            <li>Comprobantes de ingresos</li>
                            <li>Documentos bancarios</li>
                        </ul>
                        <p><strong>Recordá:</strong> Tenés derechos. Buscá ayuda legal si la necesitás.</p>
                    </div>
                `
            },
            'emergencia': {
                titulo: 'Líneas de Emergencia',
                contenido: `
                    <h3><i class="fas fa-phone-alt"></i> Líneas de Emergencia</h3>
                    <div class="recurso-contenido">
                        <h4>Líneas de Ayuda en Argentina</h4>
                        <ul>
                            <li><strong>Línea 144:</strong> Línea nacional de atención a víctimas de violencia de género (24/7)</li>
                            <li><strong>911:</strong> Emergencias</li>
                            <li><strong>137:</strong> Línea de atención a víctimas de violencia familiar</li>
                        </ul>
                        <h4>Si Estás en Peligro Inmediato</h4>
                        <ul>
                            <li>Llamá al 911</li>
                            <li>Salí de la situación si es seguro hacerlo</li>
                            <li>Buscá un lugar seguro</li>
                            <li>Contactá a alguien de confianza</li>
                        </ul>
                        <h4>Organizaciones de Apoyo</h4>
                        <ul>
                            <li>Centros de atención a víctimas de violencia</li>
                            <li>Organizaciones de mujeres</li>
                            <li>Refugios temporales</li>
                            <li>Programas de apoyo económico</li>
                        </ul>
                        <p><strong>Recordá:</strong> Tu seguridad es lo más importante. No dudes en pedir ayuda.</p>
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
let libertadEconomica;
document.addEventListener('DOMContentLoaded', () => {
    libertadEconomica = new LibertadEconomica();
});



