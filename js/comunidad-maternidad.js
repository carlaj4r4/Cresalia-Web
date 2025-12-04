/**
 * ═══════════════════════════════════════════════════════════════
 * 🤰 SISTEMA DE COMUNIDAD MATERNIDAD - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Comunidad única para embarazadas y futuras madres
 * - Sistema de diarios personal
 * - Advertencias para contenido sensible
 * - Foro por trimestres
 * - Recursos confiables
 * 
 * Creado con amor por Claude & Carla para Cresalia
 * ═══════════════════════════════════════════════════════════════
 */

class ComunidadMaternidad {
    constructor() {
        this.usuarioActual = this.obtenerUsuarioActual();
        this.contenidoSensibleVisible = false;
        this.init();
    }

    init() {
        console.log('🤰 Inicializando Comunidad Maternidad...');
        this.cargarPublicaciones();
        this.cargarDiario();
        this.verificarAdvertencias();
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
     * Mostrar tab
     */
    mostrarTab(tabId) {
        // Ocultar todos los tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar tab seleccionado
        const tab = document.getElementById(`tab-${tabId}`);
        const btn = event?.target.closest('.tab-btn') || document.querySelector(`[onclick*="'${tabId}'"]`);
        
        if (tab) tab.classList.add('active');
        if (btn) btn.classList.add('active');

        // Cargar contenido según el tab
        if (tabId === 'foro') {
            this.cargarPublicaciones();
        } else if (tabId === 'diario') {
            this.cargarDiario();
        } else if (tabId === 'futuras-madres') {
            this.verificarAdvertencias();
        }
    }

    /**
     * Cargar publicaciones del foro
     */
    async cargarPublicaciones() {
        const lista = document.getElementById('publicaciones-lista');
        if (!lista) return;

        try {
            // Intentar cargar desde API
            const response = await fetch('/api/maternidad?tipo=publicaciones');
            if (response.ok) {
                const publicaciones = await response.json();
                this.renderizarPublicaciones(publicaciones);
            } else {
                // Fallback: cargar desde localStorage
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
        const publicaciones = JSON.parse(localStorage.getItem('maternidad_publicaciones') || '[]');
        this.renderizarPublicaciones(publicaciones);
    }

    /**
     * Renderizar publicaciones
     */
    renderizarPublicaciones(publicaciones) {
        const lista = document.getElementById('publicaciones-lista');
        if (!lista) return;

        if (publicaciones.length === 0) {
            lista.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #64748B;">
                    <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>No hay publicaciones aún. ¡Sé la primera en compartir!</p>
                </div>
            `;
            return;
        }

        lista.innerHTML = publicaciones.map(pub => `
            <div class="publicacion-card">
                <div class="publicacion-header">
                    <div class="publicacion-autor">
                        <i class="fas fa-user-circle"></i>
                        <span>${pub.autor || 'Anónima'}</span>
                    </div>
                    <div class="publicacion-fecha">
                        ${this.formatearFecha(pub.fecha)}
                    </div>
                </div>
                <div class="publicacion-contenido">
                    <h3>${pub.titulo}</h3>
                    <p>${pub.contenido}</p>
                    ${pub.es_sensible ? '<span class="badge-sensible">⚠️ Contenido Sensible</span>' : ''}
                </div>
                <div class="publicacion-acciones">
                    <button onclick="comunidadMaternidad.verComentarios('${pub.id}')">
                        <i class="fas fa-comments"></i> Comentarios (${pub.comentarios || 0})
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Crear nueva publicación
     */
    crearPublicacion() {
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
                                <option value="primer-trimestre">Primer Trimestre</option>
                                <option value="segundo-trimestre">Segundo Trimestre</option>
                                <option value="tercer-trimestre">Tercer Trimestre</option>
                                <option value="parto">Parto</option>
                                <option value="postparto">Postparto</option>
                                <option value="futuras-madres">Futuras Madres</option>
                                <option value="dificultad-concebir">Dificultad para Concebir</option>
                                <option value="aborto-espontaneo">Aborto Espontáneo</option>
                                <option value="abortos">Abortos en General</option>
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
            // Intentar guardar en API
            const response = await fetch('/api/maternidad-publicaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(publicacion)
            });

            if (!response.ok) {
                throw new Error('Error en API');
            }
        } catch (error) {
            // Fallback: guardar en localStorage
            const publicaciones = JSON.parse(localStorage.getItem('maternidad_publicaciones') || '[]');
            publicaciones.push(publicacion);
            localStorage.setItem('maternidad_publicaciones', JSON.stringify(publicaciones));
        }

        this.mostrarNotificacion('✅ Publicación creada exitosamente', 'success');
        document.querySelector('.modal').remove();
        this.cargarPublicaciones();
    }

    /**
     * Abrir diario
     */
    abrirDiario() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3><i class="fas fa-book"></i> Mi Diario Personal</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="form-diario">
                        <div class="form-group">
                            <label>¿Cómo te sentís hoy?</label>
                            <div class="emociones-grid">
                                <button type="button" class="emocion-btn" data-emocion="feliz">
                                    <div style="font-size: 2rem;">😊</div>
                                    <div>Feliz</div>
                                </button>
                                <button type="button" class="emocion-btn" data-emocion="cansada">
                                    <div style="font-size: 2rem;">😴</div>
                                    <div>Cansada</div>
                                </button>
                                <button type="button" class="emocion-btn" data-emocion="ansiosa">
                                    <div style="font-size: 2rem;">😰</div>
                                    <div>Ansiosa</div>
                                </button>
                                <button type="button" class="emocion-btn" data-emocion="emocionada">
                                    <div style="font-size: 2rem;">🥰</div>
                                    <div>Emocionada</div>
                                </button>
                                <button type="button" class="emocion-btn" data-emocion="preocupada">
                                    <div style="font-size: 2rem;">😟</div>
                                    <div>Preocupada</div>
                                </button>
                            </div>
                            <input type="hidden" id="diario-emocion" required>
                        </div>
                        <div class="form-group">
                            <label>Síntomas del día</label>
                            <textarea id="diario-sintomas" rows="3" 
                                placeholder="Náuseas, cansancio, movimientos del bebé, etc."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Notas del día</label>
                            <textarea id="diario-notas" rows="4" 
                                placeholder="Cómo te sentiste, qué pasó, reflexiones..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Semana de embarazo (opcional)</label>
                            <input type="number" id="diario-semana" min="1" max="42">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-save"></i> Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Manejar selección de emoción
        modal.querySelectorAll('.emocion-btn').forEach(btn => {
            btn.onclick = () => {
                modal.querySelectorAll('.emocion-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('diario-emocion').value = btn.dataset.emocion;
            };
        });

        document.getElementById('form-diario').onsubmit = (e) => {
            e.preventDefault();
            this.guardarDiario();
        };
    }

    /**
     * Guardar entrada del diario
     */
    async guardarDiario() {
        const emocion = document.getElementById('diario-emocion').value;
        const sintomas = document.getElementById('diario-sintomas').value;
        const notas = document.getElementById('diario-notas').value;
        const semana = document.getElementById('diario-semana').value;

        const entrada = {
            id: 'diario-' + Date.now(),
            fecha: new Date().toISOString(),
            emocion,
            sintomas,
            notas,
            semana: semana || null,
            email: this.usuarioActual.email
        };

        try {
            // Intentar guardar en API
            const response = await fetch('/api/maternidad?tipo=diario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entrada)
            });

            if (!response.ok) {
                throw new Error('Error en API');
            }
        } catch (error) {
            // Fallback: guardar en localStorage
            const diarios = JSON.parse(localStorage.getItem('maternidad_diario') || '[]');
            diarios.push(entrada);
            localStorage.setItem('maternidad_diario', JSON.stringify(diarios));
        }

        this.mostrarNotificacion('✅ Entrada guardada en tu diario', 'success');
        document.querySelector('.modal').remove();
        this.cargarDiario();
    }

    /**
     * Cargar diario
     */
    async cargarDiario() {
        const lista = document.getElementById('diario-lista');
        if (!lista) return;

        try {
            const response = await fetch(`/api/maternidad?tipo=diario&email=${this.usuarioActual.email}`);
            if (response.ok) {
                const entradas = await response.json();
                this.renderizarDiario(entradas);
            } else {
                this.cargarDiarioLocal();
            }
        } catch (error) {
            this.cargarDiarioLocal();
        }
    }

    /**
     * Cargar diario desde localStorage
     */
    cargarDiarioLocal() {
        const entradas = JSON.parse(localStorage.getItem('maternidad_diario') || '[]')
            .filter(e => e.email === this.usuarioActual.email);
        this.renderizarDiario(entradas);
    }

    /**
     * Renderizar diario
     */
    renderizarDiario(entradas) {
        const lista = document.getElementById('diario-lista');
        if (!lista) return;

        if (entradas.length === 0) {
            lista.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #64748B;">
                    <i class="fas fa-book" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>No hay entradas aún. ¡Empezá a registrar tu embarazo!</p>
                </div>
            `;
            return;
        }

        lista.innerHTML = entradas.reverse().map(entrada => `
            <div class="diario-entrada">
                <div class="diario-header">
                    <div class="diario-fecha">${this.formatearFecha(entrada.fecha)}</div>
                    <div class="diario-emocion">${this.getEmojiEmocion(entrada.emocion)}</div>
                </div>
                ${entrada.semana ? `<div class="diario-semana">Semana ${entrada.semana}</div>` : ''}
                ${entrada.sintomas ? `<div class="diario-sintomas"><strong>Síntomas:</strong> ${entrada.sintomas}</div>` : ''}
                ${entrada.notas ? `<div class="diario-notas">${entrada.notas}</div>` : ''}
            </div>
        `).join('');
    }

    /**
     * Verificar advertencias para contenido sensible
     */
    verificarAdvertencias() {
        const advertencia = document.getElementById('advertencia-futuras-madres');
        const contenido = document.getElementById('contenido-futuras-madres');
        
        if (!advertencia || !contenido) return;

        // Verificar si el usuario ya aceptó ver contenido sensible hoy
        const aceptadoHoy = localStorage.getItem('maternidad_contenido_sensible_aceptado');
        const fechaAceptacion = localStorage.getItem('maternidad_contenido_sensible_fecha');
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
        localStorage.setItem('maternidad_contenido_sensible_aceptado', 'true');
        localStorage.setItem('maternidad_contenido_sensible_fecha', new Date().toDateString());
        
        document.getElementById('advertencia-futuras-madres').style.display = 'none';
        document.getElementById('contenido-futuras-madres').style.display = 'block';
        this.contenidoSensibleVisible = true;
        
        this.cargarPublicacionesFuturasMadres();
    }

    /**
     * Saltar contenido sensible
     */
    saltarContenidoSensible() {
        this.mostrarNotificacion('💜 Entendido. Podés volver cuando te sientas mejor.', 'info');
        this.mostrarTab('foro');
    }

    /**
     * Cargar publicaciones de futuras madres
     */
    cargarPublicacionesFuturasMadres() {
        // Similar a cargarPublicaciones pero filtrado por categoría
        console.log('Cargando publicaciones de futuras madres...');
    }

    /**
     * Mostrar trimestre
     */
    mostrarTrimestre(numero) {
        const trimestres = {
            1: {
                titulo: '1️⃣ Primer Trimestre (Semanas 1-12)',
                icono: '🤰',
                contenido: `
                    <div style="line-height: 1.8; color: #374151;">
                        <h4 style="color: #F48FB1; margin-bottom: 20px;">💜 Primer Trimestre: Los primeros cambios</h4>
                        
                        <div style="background: #F3F4F6; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                            <h5 style="color: #92400E; margin-bottom: 15px;">📅 Desarrollo del bebé</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li><strong>Semanas 1-4:</strong> Fertilización e implantación. El embrión comienza a formarse.</li>
                                <li><strong>Semanas 5-8:</strong> Se forman el corazón, cerebro y órganos principales. El embrión mide aproximadamente 1.5 cm.</li>
                                <li><strong>Semanas 9-12:</strong> El embrión se convierte en feto. Se forman las extremidades, dedos y características faciales.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #FEF3C7; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #F59E0B;">
                            <h5 style="color: #92400E; margin-bottom: 15px;">💡 Síntomas comunes</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li><strong>Náuseas y vómitos:</strong> Muy comunes, especialmente por la mañana. Comé pequeñas porciones varias veces al día.</li>
                                <li><strong>Cansancio extremo:</strong> Es normal sentirse muy cansada. Descansá cuando lo necesites.</li>
                                <li><strong>Senos sensibles:</strong> Pueden estar hinchados y doloridos.</li>
                                <li><strong>Cambios de humor:</strong> Los cambios hormonales pueden causar altibajos emocionales.</li>
                                <li><strong>Ganas frecuentes de orinar:</strong> El útero en crecimiento presiona la vejiga.</li>
                                <li><strong>Antojos o aversiones alimentarias:</strong> Es normal tener antojos o rechazar ciertos alimentos.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #ECFDF5; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #10B981;">
                            <h5 style="color: #047857; margin-bottom: 15px;">✅ Cuidados importantes</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li>Tomá ácido fólico diariamente (400-800 mcg según indicación médica).</li>
                                <li>Asistí a tu primera cita prenatal.</li>
                                <li>Evitá alcohol, tabaco y drogas completamente.</li>
                                <li>Limitá la cafeína (máximo 200mg por día).</li>
                                <li>Comé alimentos nutritivos, aunque tengas náuseas.</li>
                                <li>Descansá lo suficiente.</li>
                                <li>Mantenete hidratada.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #FDF2F8; padding: 20px; border-radius: 12px; border-left: 4px solid #EC4899;">
                            <h5 style="color: #BE185D; margin-bottom: 15px;">⚠️ Cuándo consultar al médico</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li>Sangrado vaginal (cualquier cantidad).</li>
                                <li>Dolor abdominal intenso o cólicos fuertes.</li>
                                <li>Vómitos persistentes que no te permiten retener líquidos.</li>
                                <li>Fiebre superior a 38°C.</li>
                                <li>Dolor al orinar o necesidad urgente de orinar.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #EFF6FF; padding: 20px; border-radius: 12px; margin-top: 20px; border-left: 4px solid #3B82F6;">
                            <p style="color: #6B7280; margin: 0;"><strong>💜 Recordá:</strong> Cada embarazo es único. Si algo te preocupa, siempre es mejor consultar con tu médico. No hay preguntas tontas cuando se trata de tu salud y la de tu bebé.</p>
                        </div>
                    </div>
                `
            },
            2: {
                titulo: '2️⃣ Segundo Trimestre (Semanas 13-27)',
                icono: '🤰',
                contenido: `
                    <div style="line-height: 1.8; color: #374151;">
                        <h4 style="color: #F48FB1; margin-bottom: 20px;">💜 Segundo Trimestre: La "luna de miel" del embarazo</h4>
                        
                        <div style="background: #F3F4F6; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                            <h5 style="color: #92400E; margin-bottom: 15px;">📅 Desarrollo del bebé</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li><strong>Semanas 13-16:</strong> El bebé puede chuparse el pulgar. Los órganos están funcionando. Mide aproximadamente 10-12 cm.</li>
                                <li><strong>Semanas 17-20:</strong> Podés empezar a sentir los movimientos del bebé. Se desarrollan las uñas y el cabello. Mide aproximadamente 20-25 cm.</li>
                                <li><strong>Semanas 21-27:</strong> El bebé puede oír sonidos. Se desarrollan los sentidos. Mide aproximadamente 30-35 cm y pesa alrededor de 1 kg.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #FEF3C7; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #F59E0B;">
                            <h5 style="color: #92400E; margin-bottom: 15px;">💡 Síntomas comunes</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li><strong>Movimientos del bebé:</strong> Empezarás a sentir pataditas y movimientos (generalmente entre las semanas 18-22).</li>
                                <li><strong>Barriga visible:</strong> Tu barriga comenzará a notarse claramente.</li>
                                <li><strong>Mayor energía:</strong> Muchas mujeres se sienten con más energía que en el primer trimestre.</li>
                                <li><strong>Dolor de espalda:</strong> El peso adicional puede causar molestias en la espalda.</li>
                                <li><strong>Congestión nasal:</strong> Los cambios hormonales pueden causar congestión.</li>
                                <li><strong>Calambres en las piernas:</strong> Pueden ocurrir, especialmente por la noche.</li>
                                <li><strong>Acidez estomacal:</strong> El útero en crecimiento presiona el estómago.</li>
                                <li><strong>Estrías:</strong> Pueden aparecer en el abdomen, senos y muslos.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #ECFDF5; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #10B981;">
                            <h5 style="color: #047857; margin-bottom: 15px;">✅ Cuidados importantes</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li>Continuá tomando vitaminas prenatales.</li>
                                <li>Asistí a todas tus citas prenatales (generalmente cada 4 semanas).</li>
                                <li>Realizá ejercicio moderado (caminar, natación, yoga prenatal).</li>
                                <li>Mantené una alimentación balanceada y nutritiva.</li>
                                <li>Hidratate bien (al menos 8-10 vasos de agua al día).</li>
                                <li>Usá crema hidratante para prevenir o reducir estrías.</li>
                                <li>Dormí de lado (preferiblemente del lado izquierdo) para mejorar la circulación.</li>
                                <li>Usá ropa cómoda y zapatos con buen soporte.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #FDF2F8; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #EC4899;">
                            <h5 style="color: #BE185D; margin-bottom: 15px;">📋 Pruebas y exámenes comunes</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li><strong>Ecografía morfológica:</strong> Generalmente entre las semanas 18-22, para verificar el desarrollo del bebé.</li>
                                <li><strong>Análisis de sangre:</strong> Para detectar posibles problemas.</li>
                                <li><strong>Prueba de glucosa:</strong> Para detectar diabetes gestacional (generalmente entre las semanas 24-28).</li>
                                <li><strong>Medición del útero:</strong> En cada cita para verificar el crecimiento.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #EFF6FF; padding: 20px; border-radius: 12px; border-left: 4px solid #3B82F6;">
                            <h5 style="color: #1E40AF; margin-bottom: 15px;">⚠️ Cuándo consultar al médico</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li>Si no sentís movimientos del bebé después de la semana 24.</li>
                                <li>Sangrado vaginal.</li>
                                <li>Dolor abdominal intenso.</li>
                                <li>Contracciones regulares antes de la semana 37.</li>
                                <li>Pérdida de líquido amniótico.</li>
                                <li>Dolor de cabeza intenso o visión borrosa.</li>
                                <li>Hinchazón excesiva en manos, pies o cara.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #FDF2F8; padding: 20px; border-radius: 12px; margin-top: 20px; border-left: 4px solid #EC4899;">
                            <p style="color: #6B7280; margin: 0;"><strong>💜 Recordá:</strong> Este trimestre suele ser el más cómodo. Aprovechá para preparar cosas para el bebé, descansar y disfrutar de sentir los movimientos de tu bebé.</p>
                        </div>
                    </div>
                `
            },
            3: {
                titulo: '3️⃣ Tercer Trimestre (Semanas 28-40+)',
                icono: '🤰',
                contenido: `
                    <div style="line-height: 1.8; color: #374151;">
                        <h4 style="color: #F48FB1; margin-bottom: 20px;">💜 Tercer Trimestre: La recta final</h4>
                        
                        <div style="background: #F3F4F6; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                            <h5 style="color: #92400E; margin-bottom: 15px;">📅 Desarrollo del bebé</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li><strong>Semanas 28-32:</strong> El bebé abre y cierra los ojos. Los pulmones están casi desarrollados. Mide aproximadamente 40 cm y pesa alrededor de 1.5-2 kg.</li>
                                <li><strong>Semanas 33-36:</strong> El bebé aumenta de peso rápidamente. Se desarrolla el sistema inmunológico. Mide aproximadamente 45-50 cm y pesa alrededor de 2.5-3 kg.</li>
                                <li><strong>Semanas 37-40+:</strong> El bebé está listo para nacer. Se considera a término a partir de la semana 37. Mide aproximadamente 50 cm y pesa alrededor de 3-3.5 kg.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #FEF3C7; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #F59E0B;">
                            <h5 style="color: #92400E; margin-bottom: 15px;">💡 Síntomas comunes</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li><strong>Movimientos más fuertes:</strong> Los movimientos del bebé serán más notorios y a veces incómodos.</li>
                                <li><strong>Falta de aire:</strong> El útero presiona el diafragma, dificultando la respiración.</li>
                                <li><strong>Dificultad para dormir:</strong> Encontrar una posición cómoda puede ser difícil.</li>
                                <li><strong>Micción frecuente:</strong> El bebé presiona la vejiga.</li>
                                <li><strong>Dolor de espalda y cadera:</strong> El peso adicional y los cambios posturales causan molestias.</li>
                                <li><strong>Hinchazón:</strong> En pies, tobillos y manos (normal, pero consultá si es excesiva).</li>
                                <li><strong>Contracciones de Braxton Hicks:</strong> Contracciones de práctica, irregulares e indoloras.</li>
                                <li><strong>Acidez y digestión lenta:</strong> El útero presiona el estómago.</li>
                                <li><strong>Ansiedad y emoción:</strong> Sentimientos mezclados sobre el parto y la maternidad.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #ECFDF5; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #10B981;">
                            <h5 style="color: #047857; margin-bottom: 15px;">✅ Cuidados importantes</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li>Continuá tomando vitaminas prenatales.</li>
                                <li>Asistí a citas prenatales más frecuentes (cada 2 semanas desde la semana 28, semanal desde la semana 36).</li>
                                <li>Contá los movimientos del bebé diariamente (método de conteo de patadas).</li>
                                <li>Prepará tu bolsa para el hospital.</li>
                                <li>Dormí de lado (preferiblemente izquierdo) con una almohada entre las piernas.</li>
                                <li>Hacé ejercicios de Kegel para fortalecer el suelo pélvico.</li>
                                <li>Mantené una alimentación nutritiva, pero en porciones más pequeñas y frecuentes.</li>
                                <li>Descansá cuando lo necesites, no te exijas demasiado.</li>
                                <li>Prepará tu plan de parto (si lo deseas) y hablalo con tu médico.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #FDF2F8; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #EC4899;">
                            <h5 style="color: #BE185D; margin-bottom: 15px;">📋 Pruebas y preparación</h5>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li><strong>Ecografía del tercer trimestre:</strong> Para verificar posición del bebé y crecimiento.</li>
                                <li><strong>Cultivo vaginal:</strong> Para detectar estreptococo del grupo B (generalmente entre semanas 35-37).</li>
                                <li><strong>Monitoreo de movimientos:</strong> Contar patadas diariamente.</li>
                                <li><strong>Preparación para el parto:</strong> Clases de preparación al parto (si las deseas).</li>
                                <li><strong>Preparación del hogar:</strong> Organizar la habitación del bebé, comprar artículos necesarios.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #EFF6FF; padding: 20px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #3B82F6;">
                            <h5 style="color: #1E40AF; margin-bottom: 15px;">⚠️ Señales de parto</h5>
                            <p style="color: #6B7280; margin-bottom: 10px;"><strong>Señales de que el parto puede estar cerca:</strong></p>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li><strong>Contracciones regulares:</strong> Que se vuelven más frecuentes, largas e intensas.</li>
                                <li><strong>Ruptura de membranas:</strong> Pérdida de líquido amniótico (puede ser un goteo o un chorro).</li>
                                <li><strong>Tapón mucoso:</strong> Secreción espesa con sangre (puede ocurrir días antes del parto).</li>
                                <li><strong>Encajamiento:</strong> El bebé "baja" y se siente menos presión en el diafragma.</li>
                            </ul>
                            <p style="color: #6B7280; margin-top: 15px;"><strong>Cuándo ir al hospital:</strong></p>
                            <ul style="margin-left: 20px; color: #6B7280;">
                                <li>Contracciones cada 5 minutos durante 1 hora (si es tu primer bebé).</li>
                                <li>Ruptura de membranas (aunque no tengas contracciones).</li>
                                <li>Sangrado rojo brillante (no solo manchado).</li>
                                <li>No sentís movimientos del bebé.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #FDF2F8; padding: 20px; border-radius: 12px; margin-top: 20px; border-left: 4px solid #EC4899;">
                            <p style="color: #6B7280; margin: 0;"><strong>💜 Recordá:</strong> Estás en la recta final. Es normal sentirse ansiosa, emocionada y cansada. Confiá en tu cuerpo y en tu capacidad. Estás haciendo algo increíble. ¡Pronto conocerás a tu bebé!</p>
                        </div>
                    </div>
                `
            }
        };

        const trimestre = trimestres[numero];
        if (!trimestre) {
            this.mostrarNotificacion('Trimestre no encontrado', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;';
        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 20px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.3s ease;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; border-bottom: 2px solid #E5E7EB;">
                    <h3 style="margin: 0; color: #F48FB1; font-size: 1.5rem;">${trimestre.icono} ${trimestre.titulo}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 2rem; color: #6B7280; cursor: pointer; padding: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: 30px;">
                    <style>
                        @keyframes slideUp {
                            from { transform: translateY(50px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                        .close-btn:hover { color: #374151; transform: rotate(90deg); }
                    </style>
                    ${trimestre.contenido}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Cerrar modal al hacer click fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Mostrar recurso
     */
    mostrarRecurso(tipo) {
        const recursos = {
            'medico': {
                titulo: 'Información Médica',
                icono: 'fas fa-stethoscope',
                contenido: `
                    <h3><i class="fas fa-stethoscope"></i> Información Médica</h3>
                    <div class="recurso-contenido">
                        <h4>Cuándo Consultar al Médico</h4>
                        <ul>
                            <li><strong>Sangrado vaginal:</strong> Cualquier sangrado durante el embarazo requiere atención médica inmediata.</li>
                            <li><strong>Dolor abdominal intenso:</strong> Dolor persistente o cólicos fuertes.</li>
                            <li><strong>Pérdida de líquido:</strong> Si sospechás que perdés líquido amniótico.</li>
                            <li><strong>Disminución de movimientos del bebé:</strong> Si notás que el bebé se mueve menos de lo habitual.</li>
                            <li><strong>Fiebre alta:</strong> Temperatura superior a 38°C.</li>
                            <li><strong>Dolor de cabeza intenso:</strong> Especialmente si viene acompañado de visión borrosa.</li>
                            <li><strong>Vómitos persistentes:</strong> Si no podés retener líquidos.</li>
                        </ul>
                        
                        <h4>Síntomas Importantes</h4>
                        <ul>
                            <li><strong>Náuseas y vómitos:</strong> Comunes en el primer trimestre, pero consultá si son muy intensos.</li>
                            <li><strong>Cansancio:</strong> Normal durante el embarazo, pero si es extremo, consultá.</li>
                            <li><strong>Dolor de espalda:</strong> Común, pero si es muy intenso, puede requerir atención.</li>
                            <li><strong>Hinchazón:</strong> Normal en pies y manos, pero si es excesiva, consultá.</li>
                        </ul>
                        
                        <h4>Cuidados Básicos</h4>
                        <ul>
                            <li>Asistí a todas tus citas prenatales.</li>
                            <li>Tomá ácido fólico y vitaminas prenatales según indicación médica.</li>
                            <li>Evitá alcohol, tabaco y drogas.</li>
                            <li>Descansá lo suficiente.</li>
                            <li>Mantené una alimentación saludable.</li>
                        </ul>
                        
                        <p><strong>Recordá:</strong> Siempre consultá con tu médico ante cualquier duda o síntoma que te preocupe.</p>
                    </div>
                `
            },
            'alimentacion': {
                titulo: 'Alimentación Durante el Embarazo',
                icono: 'fas fa-utensils',
                contenido: `
                    <h3><i class="fas fa-utensils"></i> Alimentación Durante el Embarazo</h3>
                    <div class="recurso-contenido">
                        <h4>Qué Comer</h4>
                        <ul>
                            <li><strong>Frutas y verduras:</strong> Al menos 5 porciones al día, ricas en vitaminas y fibra.</li>
                            <li><strong>Proteínas:</strong> Carnes magras, pescado (evitar pescados con alto contenido de mercurio), huevos, legumbres.</li>
                            <li><strong>Carbohidratos complejos:</strong> Pan integral, arroz integral, pasta integral, avena.</li>
                            <li><strong>Lácteos:</strong> Leche, yogur, queso (pasteurizados) para calcio y proteínas.</li>
                            <li><strong>Grasas saludables:</strong> Aguacate, nueces, aceite de oliva.</li>
                            <li><strong>Hierro:</strong> Carnes rojas, espinacas, lentejas, para prevenir anemia.</li>
                        </ul>
                        
                        <h4>Alimentos a Evitar</h4>
                        <ul>
                            <li><strong>Pescados con alto contenido de mercurio:</strong> Atún, pez espada, tiburón.</li>
                            <li><strong>Carne cruda o poco cocida:</strong> Puede contener bacterias peligrosas.</li>
                            <li><strong>Huevos crudos:</strong> Evitar mayonesa casera, tiramisú, etc.</li>
                            <li><strong>Lácteos no pasteurizados:</strong> Pueden contener listeria.</li>
                            <li><strong>Alcohol:</strong> Completamente prohibido durante el embarazo.</li>
                            <li><strong>Cafeína:</strong> Limitar a 200mg por día (1-2 tazas de café).</li>
                            <li><strong>Alimentos procesados:</strong> Limitar consumo de alimentos ultraprocesados.</li>
                        </ul>
                        
                        <h4>Nutrición Específica</h4>
                        <ul>
                            <li><strong>Ácido fólico:</strong> Esencial para prevenir defectos del tubo neural. Tomar suplementos según indicación médica.</li>
                            <li><strong>Hierro:</strong> Importante para prevenir anemia. Comer alimentos ricos en hierro y tomar suplementos si el médico lo indica.</li>
                            <li><strong>Calcio:</strong> Necesario para el desarrollo de los huesos del bebé. Consumir lácteos y vegetales de hoja verde.</li>
                            <li><strong>Omega-3:</strong> Importante para el desarrollo del cerebro del bebé. Pescados bajos en mercurio, nueces, semillas de chía.</li>
                        </ul>
                        
                        <p><strong>Consejo:</strong> Comé pequeñas porciones varias veces al día para evitar náuseas y mantener niveles de energía estables.</p>
                    </div>
                `
            },
            'ejercicio': {
                titulo: 'Ejercicio Seguro Durante el Embarazo',
                icono: 'fas fa-running',
                contenido: `
                    <h3><i class="fas fa-running"></i> Ejercicio Seguro Durante el Embarazo</h3>
                    <div class="recurso-contenido">
                        <h4>Ejercicios Recomendados</h4>
                        <ul>
                            <li><strong>Caminar:</strong> Ejercicio suave y seguro durante todo el embarazo.</li>
                            <li><strong>Natación:</strong> Excelente ejercicio de bajo impacto, alivia la presión sobre las articulaciones.</li>
                            <li><strong>Yoga prenatal:</strong> Ayuda con flexibilidad, equilibrio y relajación.</li>
                            <li><strong>Pilates:</strong> Fortalece el core y mejora la postura (adaptado para embarazo).</li>
                            <li><strong>Bicicleta estática:</strong> Ejercicio cardiovascular seguro (evitar bicicleta al aire libre por riesgo de caídas).</li>
                            <li><strong>Estiramientos suaves:</strong> Ayudan a mantener flexibilidad y reducir tensión.</li>
                        </ul>
                        
                        <h4>Actividades a Evitar</h4>
                        <ul>
                            <li><strong>Deportes de contacto:</strong> Fútbol, básquet, artes marciales.</li>
                            <li><strong>Deportes con riesgo de caídas:</strong> Esquí, equitación, escalada.</li>
                            <li><strong>Ejercicios de alto impacto:</strong> Correr intensamente (si no lo hacías antes), saltar.</li>
                            <li><strong>Buceo:</strong> Puede causar problemas de descompresión.</li>
                            <li><strong>Ejercicios en posición supina:</strong> Después del primer trimestre, evitar acostarse boca arriba.</li>
                            <li><strong>Ejercicios en ambientes calurosos:</strong> Evitar saunas, baños muy calientes.</li>
                        </ul>
                        
                        <h4>Preparación Física</h4>
                        <ul>
                            <li><strong>Calentamiento:</strong> Siempre calentá antes de hacer ejercicio.</li>
                            <li><strong>Hidratación:</strong> Bebé agua antes, durante y después del ejercicio.</li>
                            <li><strong>Escuchá tu cuerpo:</strong> Si te sentís cansada o con dolor, detenete.</li>
                            <li><strong>Ropa cómoda:</strong> Usá ropa que te permita moverte libremente.</li>
                            <li><strong>Zapatos adecuados:</strong> Zapatos con buen soporte para evitar lesiones.</li>
                        </ul>
                        
                        <h4>Beneficios del Ejercicio</h4>
                        <ul>
                            <li>Mejora el estado de ánimo y reduce el estrés.</li>
                            <li>Ayuda a mantener un peso saludable.</li>
                            <li>Fortalece músculos y mejora la resistencia.</li>
                            <li>Puede ayudar a reducir dolores de espalda.</li>
                            <li>Prepara el cuerpo para el parto.</li>
                            <li>Puede ayudar a dormir mejor.</li>
                        </ul>
                        
                        <p><strong>Importante:</strong> Siempre consultá con tu médico antes de comenzar o continuar cualquier rutina de ejercicio durante el embarazo.</p>
                    </div>
                `
            },
            'emocional': {
                titulo: 'Preparación Emocional',
                icono: 'fas fa-heart',
                contenido: `
                    <h3><i class="fas fa-heart"></i> Preparación Emocional</h3>
                    <div class="recurso-contenido">
                        <h4>Gestión de Emociones</h4>
                        <ul>
                            <li><strong>Es normal tener emociones intensas:</strong> Los cambios hormonales pueden causar altibajos emocionales.</li>
                            <li><strong>Compartí tus sentimientos:</strong> Hablá con tu pareja, familia, amigos o un profesional.</li>
                            <li><strong>Escribí un diario:</strong> Puede ayudar a procesar tus emociones y pensamientos.</li>
                            <li><strong>Practicá la autocompasión:</strong> Sé amable contigo misma, no te juzgues por tus emociones.</li>
                            <li><strong>Buscá apoyo:</strong> No tenés que pasar por esto sola, buscá grupos de apoyo o comunidades.</li>
                        </ul>
                        
                        <h4>Manejo de Ansiedad</h4>
                        <ul>
                            <li><strong>Respiración profunda:</strong> Practicá técnicas de respiración para calmar la ansiedad.</li>
                            <li><strong>Meditación o mindfulness:</strong> Puede ayudar a reducir el estrés y la ansiedad.</li>
                            <li><strong>Ejercicio regular:</strong> El ejercicio libera endorfinas que mejoran el estado de ánimo.</li>
                            <li><strong>Rutinas:</strong> Mantener rutinas puede dar sensación de control y estabilidad.</li>
                            <li><strong>Información confiable:</strong> Buscá información de fuentes confiables, pero no te sobrecargues.</li>
                        </ul>
                        
                        <h4>Miedos Comunes</h4>
                        <ul>
                            <li><strong>Miedo al parto:</strong> Es normal tener miedo. Informate sobre el proceso y hablá con tu médico.</li>
                            <li><strong>Miedo a ser buena madre:</strong> Es normal tener dudas. Confiá en vos misma y buscá apoyo.</li>
                            <li><strong>Miedo a los cambios:</strong> El embarazo trae muchos cambios, es normal sentirse abrumada.</li>
                            <li><strong>Miedo por la salud del bebé:</strong> Es normal preocuparse. Seguí las indicaciones médicas y confiá en el proceso.</li>
                        </ul>
                        
                        <h4>Preparación Mental</h4>
                        <ul>
                            <li><strong>Visualización positiva:</strong> Visualizá un parto positivo y un bebé saludable.</li>
                            <li><strong>Educación:</strong> Informate sobre el embarazo, parto y postparto para sentirte más preparada.</li>
                            <li><strong>Comunicación:</strong> Hablá con tu pareja sobre tus expectativas y miedos.</li>
                            <li><strong>Planificación:</strong> Planificá lo que puedas (preparación del hogar, ropa del bebé, etc.).</li>
                            <li><strong>Flexibilidad:</strong> Recordá que no todo saldrá como lo planeaste, y está bien.</li>
                        </ul>
                        
                        <h4>Señales de Alerta</h4>
                        <p>Si experimentás alguno de estos síntomas, considerá buscar ayuda profesional:</p>
                        <ul>
                            <li>Tristeza persistente que no mejora.</li>
                            <li>Ansiedad extrema que interfiere con tu vida diaria.</li>
                            <li>Pensamientos de hacerte daño a ti misma o al bebé.</li>
                            <li>Dificultad para dormir o comer.</li>
                            <li>Sentimientos de desesperanza o desesperación.</li>
                        </ul>
                        
                        <p><strong>Recordá:</strong> Buscar ayuda profesional no es una debilidad, es una fortaleza. Tu bienestar emocional es tan importante como tu salud física.</p>
                    </div>
                `
            }
        };

        const recurso = recursos[tipo];
        if (!recurso) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;';
        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 20px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp 0.3s ease;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; border-bottom: 2px solid #E5E7EB;">
                    <h3 style="margin: 0; color: #F48FB1; font-size: 1.5rem;"><i class="${recurso.icono}"></i> ${recurso.titulo}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 2rem; color: #6B7280; cursor: pointer; padding: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="padding: 30px;">
                    <style>
                        @keyframes slideUp {
                            from { transform: translateY(50px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                        .recurso-contenido h3 { color: #F48FB1; margin-bottom: 20px; font-size: 1.3rem; }
                        .recurso-contenido h4 { color: #374151; margin-top: 24px; margin-bottom: 12px; font-size: 1.1rem; border-left: 4px solid #F48FB1; padding-left: 12px; }
                        .recurso-contenido ul { margin-left: 20px; margin-bottom: 16px; }
                        .recurso-contenido li { color: #6B7280; line-height: 1.8; margin-bottom: 8px; }
                        .recurso-contenido strong { color: #374151; }
                        .recurso-contenido p { color: #6B7280; line-height: 1.8; margin-top: 16px; }
                        .close-btn:hover { color: #374151; transform: rotate(90deg); }
                    </style>
                    ${recurso.contenido}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Cerrar modal al hacer click fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Ver comentarios
     */
    verComentarios(publicacionId) {
        this.mostrarNotificacion('Abriendo comentarios...', 'info');
        // Implementar lógica para ver comentarios
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
     * Obtener emoji de emoción
     */
    getEmojiEmocion(emocion) {
        const emojis = {
            'feliz': '😊',
            'cansada': '😴',
            'ansiosa': '😰',
            'emocionada': '🥰',
            'preocupada': '😟'
        };
        return emojis[emocion] || '😐';
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
let comunidadMaternidad;
document.addEventListener('DOMContentLoaded', () => {
    comunidadMaternidad = new ComunidadMaternidad();
});

