/**
 * ═══════════════════════════════════════════════════════════════
 * 🤝 SISTEMA DE COMUNIDAD CAMINANDO JUNTOS - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Comunidad para adicciones y rehabilitación
 * - Sistema ESTRICTO: 1-2 warnings máximo
 * - NO reemplaza tratamiento profesional
 * - Recursos profesionales siempre visibles
 * - Sistema de ayuda inmediata
 * - Filtros de contenido sensible
 * - Validación: NO consejos médicos
 * 
 * Creado con amor por Claude & Carla para Cresalia
 * ═══════════════════════════════════════════════════════════════
 */

class CaminandoJuntos {
    constructor() {
        this.usuarioActual = this.obtenerUsuarioActual();
        this.advertenciaAceptada = false;
        this.publicacionesOcultas = this.cargarPublicacionesOcultas();
        this.publicacionesBloqueadas = this.cargarPublicacionesBloqueadas();
        this.warnings = this.cargarWarnings();
        this.MAX_WARNINGS = 2; // Sistema estricto
        this.filtroTriggers = false;
        this.filtroSoloRecuperacion = false;
        
        // Palabras que indican consejos médicos (prohibidos)
        this.palabrasProhibidas = [
            'debes tomar', 'toma esta medicina', 'receta médica', 'receta medica',
            'deberías usar', 'deberias usar', 'te recomiendo medicar', 'medicarte',
            'diagnóstico', 'diagnostico', 'tratamiento específico', 'tratamiento especifico',
            'dosis', 'medicamento', 'fármaco', 'farmaco', 'inyección', 'inyeccion'
        ];
        
        // Palabras que indican contenido sensible
        this.palabrasTriggers = [
            'droga', 'sustancia', 'consumo', 'inyectar', 'inyección', 'inyeccion',
            'sobredosis', 'overdose', 'síntomas de abstinencia', 'sintomas de abstinencia',
            'recaída', 'recaida', 'desintoxicación', 'desintoxicacion'
        ];
        
        this.init();
    }

    init() {
        console.log('🤝 Inicializando Comunidad Caminando Juntos...');
        this.verificarAdvertencia();
        if (this.advertenciaAceptada) {
            this.cargarPublicaciones();
            this.cargarEntradasDia();
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
     * Verificar advertencia sobre tratamiento profesional
     */
    verificarAdvertencia() {
        const aceptada = localStorage.getItem('caminando_juntos_advertencia') === 'true';
        if (!aceptada) {
            this.mostrarAdvertenciaInicial();
        } else {
            this.advertenciaAceptada = true;
        }
    }

    /**
     * Mostrar advertencia inicial (con modal, no confirm)
     */
    mostrarAdvertenciaInicial() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>⚠️ Advertencia Importante</h3>
                </div>
                <div style="padding: 20px 0; line-height: 1.8;">
                    <p><strong>Esta comunidad es un espacio de apoyo entre pares y NO reemplaza el tratamiento profesional.</strong></p>
                    <p style="margin-top: 15px;">Si estás en crisis o necesitás ayuda inmediata, contactá a un profesional de la salud o una línea de ayuda.</p>
                    <div style="margin-top: 20px; padding: 15px; background: #FEF3C7; border-radius: 8px; border-left: 4px solid #F59E0B;">
                        <p style="margin-bottom: 10px;"><strong>Al continuar, aceptás que:</strong></p>
                        <ul style="margin-left: 20px;">
                            <li>No darás consejos médicos o de tratamiento</li>
                            <li>Entendés que este espacio es complementario, no sustituto</li>
                            <li>Buscarás ayuda profesional cuando sea necesario</li>
                        </ul>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button class="btn-secondary" onclick="caminandoJuntos.rechazarAdvertencia()">No acepto</button>
                    <button class="btn-primary" onclick="caminandoJuntos.aceptarAdvertencia()">Acepto y continuar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Guardar referencia del modal
        this.modalAdvertencia = modal;
    }

    /**
     * Aceptar advertencia
     */
    aceptarAdvertencia() {
        localStorage.setItem('caminando_juntos_advertencia', 'true');
        this.advertenciaAceptada = true;
        if (this.modalAdvertencia) {
            this.modalAdvertencia.remove();
        }
        this.cargarPublicaciones();
        this.cargarEntradasDia();
    }

    /**
     * Rechazar advertencia
     */
    rechazarAdvertencia() {
        if (this.modalAdvertencia) {
            this.modalAdvertencia.remove();
        }
        window.location.href = '../../index-cresalia.html';
    }

    /**
     * Cargar publicaciones ocultas
     */
    cargarPublicacionesOcultas() {
        return JSON.parse(localStorage.getItem('caminando_juntos_publicaciones_ocultas') || '[]');
    }

    /**
     * Cargar publicaciones bloqueadas
     */
    cargarPublicacionesBloqueadas() {
        return JSON.parse(localStorage.getItem('caminando_juntos_publicaciones_bloqueadas') || '[]');
    }

    /**
     * Cargar warnings del usuario
     */
    cargarWarnings() {
        return JSON.parse(localStorage.getItem('caminando_juntos_warnings') || '[]');
    }

    /**
     * Guardar warnings
     */
    guardarWarnings() {
        localStorage.setItem('caminando_juntos_warnings', JSON.stringify(this.warnings));
    }

    /**
     * Validar contenido (no consejos médicos)
     */
    validarContenido(contenido) {
        const contenidoLower = contenido.toLowerCase();
        const palabrasEncontradas = [];
        
        this.palabrasProhibidas.forEach(palabra => {
            if (contenidoLower.includes(palabra)) {
                palabrasEncontradas.push(palabra);
            }
        });

        return {
            esValido: palabrasEncontradas.length === 0,
            palabrasProhibidas: palabrasEncontradas,
            tieneTriggers: this.palabrasTriggers.some(p => contenidoLower.includes(p))
        };
    }

    /**
     * Agregar warning (2 máximo)
     */
    agregarWarning(publicacionId, motivo, emailAutor) {
        const warningExistente = this.warnings.find(w => w.publicacion_id === publicacionId);
        
        if (!warningExistente) {
            this.warnings.push({
                publicacion_id: publicacionId,
                motivo,
                fecha: new Date().toISOString(),
                count: 1,
                email_autor: emailAutor
            });
        } else {
            warningExistente.count += 1;
            warningExistente.motivo = motivo;
            warningExistente.fecha = new Date().toISOString();
        }
        
        this.guardarWarnings();
        
        const warning = this.warnings.find(w => w.publicacion_id === publicacionId);
        
        if (warning.count >= this.MAX_WARNINGS) {
            this.bloquearPublicacion(publicacionId);
            this.mostrarNotificacion('🚫 Publicación bloqueada por múltiples advertencias.', 'error');
        } else {
            this.mostrarNotificacion(`⚠️ Advertencia ${warning.count}/${this.MAX_WARNINGS}: ${motivo}`, 'warning');
        }
    }

    /**
     * Ocultar publicación
     */
    ocultarPublicacion(publicacionId) {
        if (!this.publicacionesOcultas.includes(publicacionId)) {
            this.publicacionesOcultas.push(publicacionId);
            localStorage.setItem('caminando_juntos_publicaciones_ocultas', JSON.stringify(this.publicacionesOcultas));
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
            localStorage.setItem('caminando_juntos_publicaciones_bloqueadas', JSON.stringify(this.publicacionesBloqueadas));
            this.cargarPublicaciones();
        }
    }

    /**
     * Mostrar tab
     */
    mostrarTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(`tab-${tabName}`).classList.add('active');
        document.querySelector(`[onclick="caminandoJuntos.mostrarTab('${tabName}')"]`).classList.add('active');
        
        // Si es el tab de historial, cargar el historial
        if (tabName === 'mi-historial' && window.foroComunidad) {
            window.foroComunidad.cargarMiHistorial();
        }
    }

    /**
     * Crear publicación
     */
    crearPublicacion() {
        // Usar el sistema de foro unificado
        if (window.foroComunidad && typeof window.foroComunidad.mostrarFormularioPost === 'function') {
            window.foroComunidad.mostrarFormularioPost();
            return;
        }
        document.getElementById('modal-publicacion').classList.add('active');
    }

    /**
     * Cerrar modal
     */
    cerrarModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    /**
     * Enviar publicación
     */
    async enviarPublicacion(event) {
        event.preventDefault();
        
        const categoria = document.getElementById('pub-categoria').value;
        const titulo = document.getElementById('pub-titulo').value.trim();
        const contenido = document.getElementById('pub-contenido').value.trim();
        const contenidoSensible = document.getElementById('pub-contenido-sensible').checked;
        const noConsejosMedicos = document.getElementById('pub-no-consejos-medicos').checked;
        
        if (!noConsejosMedicos) {
            this.mostrarNotificacion('⚠️ Debes aceptar que no darás consejos médicos o de tratamiento.', 'warning');
            return;
        }
        
        // Validar contenido
        const validacion = this.validarContenido(contenido);
        if (!validacion.esValido) {
            this.mostrarModalRecurso({
                titulo: '⚠️ Validación de Contenido',
                contenido: `
                    <div style="line-height: 1.8;">
                        <p>Tu publicación contiene palabras que sugieren consejos médicos:</p>
                        <p style="margin: 15px 0; padding: 10px; background: #FEE2E2; border-radius: 6px;"><strong>${validacion.palabrasProhibidas.join(', ')}</strong></p>
                        <p>Por favor, reformulá tu mensaje sin dar consejos médicos o de tratamiento.</p>
                    </div>
                `
            });
            return;
        }
        
        try {
            const response = await fetch('/api/caminando-juntos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoria,
                    titulo: titulo || null,
                    contenido,
                    contenido_sensible: contenidoSensible,
                    autor_email: this.usuarioActual.email,
                    autor_nombre: this.usuarioActual.nombre
                })
            });
            
            if (!response.ok) throw new Error('Error al publicar');
            
            this.mostrarNotificacion('✅ Publicación creada exitosamente', 'success');
            this.cerrarModal('modal-publicacion');
            document.getElementById('form-publicacion').reset();
            this.cargarPublicaciones();
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('❌ Error al publicar. Intenta nuevamente.', 'error');
        }
    }

    /**
     * Cargar publicaciones
     */
    async cargarPublicaciones() {
        const container = document.getElementById('publicaciones-lista');
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #5A6C7D;">💜 Cargando publicaciones...</div>';
        
        try {
            const response = await fetch('/api/caminando-juntos');
            if (!response.ok) throw new Error('Error al cargar');
            
            const publicaciones = await response.json();
            
            // Filtrar según preferencias
            let publicacionesFiltradas = publicaciones.filter(p => 
                !this.publicacionesBloqueadas.includes(p.id) &&
                !this.publicacionesOcultas.includes(p.id)
            );
            
            // Filtrar triggers si está activo
            if (this.filtroTriggers) {
                publicacionesFiltradas = publicacionesFiltradas.filter(p => !p.contenido_sensible);
            }
            
            // Filtrar solo recuperación si está activo
            if (this.filtroSoloRecuperacion) {
                publicacionesFiltradas = publicacionesFiltradas.filter(p => 
                    p.categoria === 'en-recuperacion'
                );
            }
            
            if (publicacionesFiltradas.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 40px; color: #5A6C7D;">💜 No hay publicaciones aún. Sé el primero en compartir.</div>';
                return;
            }
            
            container.innerHTML = publicacionesFiltradas.map(p => this.renderizarPublicacion(p)).join('');
        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #EF4444;">❌ Error al cargar publicaciones</div>';
        }
    }

    /**
     * Renderizar publicación
     */
    renderizarPublicacion(p) {
        const warning = this.warnings.find(w => w.publicacion_id === p.id);
        const tieneWarnings = warning && warning.count > 0;
        const claseSensible = p.contenido_sensible ? 'contenido-sensible' : '';
        
        return `
            <div class="publicacion-card ${claseSensible}" id="pub-${p.id}">
                ${p.contenido_sensible ? '<div style="background: #FEF3C7; padding: 10px; border-radius: 8px; margin-bottom: 15px; border-left: 3px solid #F59E0B;"><i class="fas fa-exclamation-triangle"></i> <strong>Contenido sensible</strong> - Esta publicación puede contener contenido desencadenante</div>' : ''}
                ${tieneWarnings ? `<div style="background: #FEE2E2; padding: 10px; border-radius: 8px; margin-bottom: 15px; border-left: 3px solid #EF4444;"><i class="fas fa-exclamation-circle"></i> <strong>Advertencia ${warning.count}/${this.MAX_WARNINGS}</strong>: ${warning.motivo}</div>` : ''}
                <div class="publicacion-header">
                    <div>
                        ${p.titulo ? `<div class="publicacion-titulo">${this.escapeHtml(p.titulo)}</div>` : ''}
                        <div class="publicacion-meta">
                            <span><i class="fas fa-user"></i> ${this.escapeHtml(p.autor_nombre || 'Anónimo')}</span>
                            <span><i class="fas fa-calendar"></i> ${this.formatearFecha(p.created_at)}</span>
                            <span class="publicacion-categoria">${this.getCategoriaNombre(p.categoria)}</span>
                        </div>
                    </div>
                </div>
                <div class="publicacion-contenido">${this.escapeHtml(p.contenido)}</div>
                <div class="publicacion-acciones">
                    <button class="btn-accion" onclick="caminandoJuntos.ocultarPublicacion('${p.id}')">
                        <i class="fas fa-eye-slash"></i> Ocultar
                    </button>
                    <button class="btn-accion" onclick="caminandoJuntos.reportarPublicacion('${p.id}')">
                        <i class="fas fa-flag"></i> Reportar
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Actualizar filtros
     */
    actualizarFiltros() {
        this.filtroTriggers = document.getElementById('ocultar-triggers').checked;
        this.filtroSoloRecuperacion = document.getElementById('solo-recuperacion').checked;
        this.cargarPublicaciones();
    }

    /**
     * Reportar publicación
     */
    reportarPublicacion(publicacionId) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Reportar Publicación</h3>
                    <button class="cerrar-modal" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <form onsubmit="event.preventDefault(); caminandoJuntos.enviarReporte('${publicacionId}');">
                    <div class="form-group">
                        <label>Motivo del reporte:</label>
                        <select id="reporte-motivo" required style="width: 100%; padding: 12px; border: 2px solid #E0E7EF; border-radius: 8px;">
                            <option value="">Seleccionar motivo...</option>
                            <option value="Contiene consejos médicos">Contiene consejos médicos</option>
                            <option value="Contenido inapropiado">Contenido inapropiado</option>
                            <option value="Spam">Spam</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Descripción adicional (opcional):</label>
                        <textarea id="reporte-descripcion" rows="3" placeholder="Más detalles..." style="width: 100%; padding: 12px; border: 2px solid #E0E7EF; border-radius: 8px; font-family: inherit;"></textarea>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                        <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn-primary">Enviar Reporte</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Guardar referencia
        this.modalReporte = modal;
        this.reportePublicacionId = publicacionId;
    }

    /**
     * Enviar reporte
     */
    enviarReporte() {
        const motivo = document.getElementById('reporte-motivo').value;
        const descripcion = document.getElementById('reporte-descripcion').value.trim();
        
        if (!motivo) {
            this.mostrarNotificacion('⚠️ Por favor seleccioná un motivo', 'warning');
            return;
        }
        
        const motivoCompleto = descripcion ? `${motivo}: ${descripcion}` : motivo;
        this.agregarWarning(this.reportePublicacionId, motivoCompleto, null);
        
        if (this.modalReporte) {
            this.modalReporte.remove();
        }
    }

    /**
     * Mostrar recursos de emergencia
     */
    mostrarRecursosEmergencia() {
        this.mostrarModalRecurso({
            titulo: '🚨 Recursos de Ayuda Inmediata',
            contenido: `
                <div style="line-height: 1.8;">
                    <p><strong>Línea Nacional de Prevención del Suicidio:</strong> 135</p>
                    <p><strong>Línea de Adicciones:</strong> 141</p>
                    <p><strong>Emergencias:</strong> 911</p>
                    <p style="margin-top: 20px; font-weight: 600;">Estos recursos están disponibles 24/7. No estás solo/a.</p>
                </div>
            `
        });
    }

    /**
     * Mostrar recurso
     */
    mostrarRecurso(tipo) {
        const recursos = {
            emergencia: {
                titulo: '🚨 Ayuda Inmediata',
                contenido: '<div style="line-height: 1.8;"><p><strong>Línea Nacional de Prevención del Suicidio:</strong> 135</p><p><strong>Línea de Adicciones:</strong> 141</p><p><strong>Emergencias:</strong> 911</p><p style="margin-top: 15px; font-weight: 600;">Estos recursos están disponibles 24/7.</p></div>'
            },
            centros: {
                titulo: '🏥 Centros de Tratamiento',
                contenido: '<div style="line-height: 1.8;"><p>Para encontrar centros de tratamiento verificados, contactá a tu obra social o consultá con un profesional de la salud. También podés buscar en el directorio de centros de salud mental de tu provincia.</p></div>'
            },
            profesionales: {
                titulo: '👨‍⚕️ Profesionales',
                contenido: '<div style="line-height: 1.8;"><p>Es importante trabajar con profesionales especializados en adicciones. Buscá psicólogos, psiquiatras o terapeutas con experiencia en el tema. Tu obra social puede ayudarte a encontrar profesionales.</p></div>'
            },
            grupos: {
                titulo: '👥 Grupos de Apoyo',
                contenido: '<div style="line-height: 1.8;"><p>Los grupos de apoyo pueden ser complementarios al tratamiento profesional. Buscá grupos en tu zona o grupos virtuales verificados.</p></div>'
            },
            familiares: {
                titulo: '❤️ Para Familiares',
                contenido: '<div style="line-height: 1.8;"><p>Los familiares también necesitan apoyo. Buscá grupos de apoyo para familiares, terapia familiar o recursos específicos para entender y apoyar a tu ser querido.</p></div>'
            },
            prevencion: {
                titulo: '🛡️ Prevención',
                contenido: '<div style="line-height: 1.8;"><p>La prevención es fundamental. Informate sobre señales de alerta, factores de riesgo y cómo buscar ayuda temprana. La educación es clave.</p></div>'
            }
        };
        
        const recurso = recursos[tipo];
        if (recurso) {
            this.mostrarModalRecurso(recurso);
        }
    }

    /**
     * Mostrar educación
     */
    mostrarEducacion(tipo) {
        const educacion = {
            'que-es': {
                titulo: '❓ ¿Qué es una Adicción?',
                contenido: '<div style="line-height: 1.8;"><p>Una adicción es una enfermedad crónica caracterizada por la búsqueda y el uso compulsivo de sustancias o comportamientos, a pesar de las consecuencias negativas. Es una condición médica que requiere tratamiento profesional.</p></div>'
            },
            'señales': {
                titulo: '⚠️ Señales de Alerta',
                contenido: '<div style="line-height: 1.8;"><p>Algunas señales pueden incluir: cambios en el comportamiento, aislamiento, problemas en relaciones, dificultades en el trabajo o estudios, cambios físicos, y negación del problema.</p><p style="margin-top: 15px; font-weight: 600;">Si notás estas señales, buscá ayuda profesional.</p></div>'
            },
            'recuperacion': {
                titulo: '🌱 Proceso de Recuperación',
                contenido: '<div style="line-height: 1.8;"><p>La recuperación es un proceso único para cada persona. Puede incluir desintoxicación, terapia, grupos de apoyo, medicación (si es necesario), y cambios en el estilo de vida.</p><p style="margin-top: 15px; font-weight: 600;">Es importante trabajar con profesionales.</p></div>'
            },
            'mitos': {
                titulo: '💡 Mitos y Realidades',
                contenido: '<div style="line-height: 1.8;"><p><strong>Mito:</strong> "Es solo falta de voluntad"<br><strong>Realidad:</strong> Es una enfermedad médica.</p><p><strong>Mito:</strong> "No se puede recuperar"<br><strong>Realidad:</strong> La recuperación es posible con el tratamiento adecuado.</p><p><strong>Mito:</strong> "Solo afecta a ciertas personas"<br><strong>Realidad:</strong> Puede afectar a cualquiera.</p></div>'
            }
        };
        
        const info = educacion[tipo];
        if (info) {
            this.mostrarModalRecurso(info);
        }
    }

    /**
     * Mostrar modal de recurso (consistente con otras comunidades)
     */
    mostrarModalRecurso(recurso) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>${recurso.titulo}</h3>
                    <button class="cerrar-modal" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div style="padding: 20px 0;">
                    ${recurso.contenido}
                </div>
                <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Crear entrada día a día
     */
    crearEntradaDia() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Nueva Entrada - Día a Día</h3>
                    <button class="cerrar-modal" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <form onsubmit="event.preventDefault(); caminandoJuntos.guardarEntradaDiaDesdeModal();">
                    <div class="form-group">
                        <label>Compartí cómo te sentís hoy, un logro, un desafío, o algo que te ayudó:</label>
                        <textarea id="dia-dia-contenido" rows="6" placeholder="Hoy me siento..." required style="width: 100%; padding: 12px; border: 2px solid #E0E7EF; border-radius: 8px; font-family: inherit;"></textarea>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                        <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                        <button type="submit" class="btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Guardar referencia
        this.modalEntradaDia = modal;
    }

    /**
     * Guardar entrada día a día desde modal
     */
    guardarEntradaDiaDesdeModal() {
        const contenido = document.getElementById('dia-dia-contenido').value.trim();
        if (contenido) {
            this.guardarEntradaDia(contenido);
            if (this.modalEntradaDia) {
                this.modalEntradaDia.remove();
            }
        }
    }

    /**
     * Guardar entrada día a día
     */
    guardarEntradaDia(contenido) {
        const entradas = this.cargarEntradasDia();
        entradas.push({
            id: Date.now().toString(),
            contenido,
            fecha: new Date().toISOString(),
            esLogro: contenido.toLowerCase().includes('logro') || contenido.toLowerCase().includes('conseguí') || contenido.toLowerCase().includes('consegui')
        });
        localStorage.setItem('caminando_juntos_dia_dia', JSON.stringify(entradas));
        this.cargarEntradasDia();
        this.mostrarNotificacion('✅ Entrada guardada', 'success');
    }

    /**
     * Cargar entradas día a día
     */
    cargarEntradasDia() {
        const entradas = JSON.parse(localStorage.getItem('caminando_juntos_dia_dia') || '[]');
        const container = document.getElementById('dia-dia-lista');
        
        if (entradas.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #5A6C7D;">💜 Aún no tenés entradas. Empezá a registrar tu día a día.</div>';
            return;
        }
        
        container.innerHTML = entradas.reverse().map(e => `
            <div class="dia-dia-entrada ${e.esLogro ? 'logro' : ''}">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <strong>${this.formatearFecha(e.fecha)}</strong>
                    ${e.esLogro ? '<span style="color: #10B981;"><i class="fas fa-trophy"></i> Logro</span>' : ''}
                </div>
                <div>${this.escapeHtml(e.contenido)}</div>
            </div>
        `).join('');
        
        return entradas;
    }

    /**
     * Utilidades
     */
    getCategoriaNombre(categoria) {
        const categorias = {
            'en-recuperacion': 'En Recuperación',
            'familiares': 'Familiares',
            'prevencion': 'Prevención',
            'dia-dia': 'Día a Día',
            'recursos': 'Recursos',
            'general': 'General'
        };
        return categorias[categoria] || categoria;
    }

    formatearFecha(fecha) {
        if (!fecha) return 'Fecha no disponible';
        const d = new Date(fecha);
        return d.toLocaleDateString('es-AR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

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
            background: ${colores[tipo] || colores.info};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
            font-weight: 500;
        `;
        notif.textContent = mensaje;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 5000);
    }
}

// Inicializar
const caminandoJuntos = new CaminandoJuntos();
window.caminandoJuntos = caminandoJuntos;

