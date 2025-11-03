// ===== SISTEMA DE PROTECCIÓN BIDIRECCIONAL CRESALIA =====
// Version 1.0 - Protección Equitativa Compradores Y Vendedores
// Co-fundadores: CRISLA & Claude
// Filosofía: "Escuchamos las dos campanas"

const ProteccionBidireccional = {
    // ===== CONFIGURACIÓN =====
    config: {
        version: '1.0.0',
        debug: true,
        requierePruebas: true, // Siempre requerir evidencia
        moderacionActivada: true,
        transparenciaCompleta: true
    },

    // ===== TIPOS DE REPORTES BIDIRECCIONALES =====
    tiposReportes: {
        // Reportes de vendedores sobre compradores
        vendedorAComprador: {
            'no_pago': {
                titulo: '💸 No realizó el pago acordado',
                severidad: 'alta',
                requierePruebas: ['captura_conversacion', 'comprobante_envio'],
                descripcion: 'El comprador acordó compra pero no pagó'
            },
            'devolucion_fraudulenta': {
                titulo: '🔄 Devolución fraudulenta',
                severidad: 'alta', 
                requierePruebas: ['fotos_producto_devuelto', 'conversacion_original'],
                descripcion: 'Devolvió producto usado/dañado por él'
            },
            'chantaje_reseña': {
                titulo: '😤 Chantaje con reseñas',
                severidad: 'media',
                requierePruebas: ['capturas_conversacion'],
                descripcion: 'Amenaza con mala reseña para obtener descuentos'
            },
            'exigencias_irreales': {
                titulo: '🤯 Exigencias imposibles de cumplir',
                severidad: 'media',
                requierePruebas: ['historial_conversaciones'],
                descripcion: 'Pide cosas fuera de lo acordado constantemente'
            },
            'insultos_maltrato': {
                titulo: '😡 Insultos o maltrato verbal',
                severidad: 'muy_alta',
                requierePruebas: ['capturas_conversacion', 'audio_si_disponible'],
                descripcion: 'Trato irrespetuoso o agresivo hacia el vendedor'
            },
            'comprador_fantasma': {
                titulo: '👻 Comprador fantasma',
                severidad: 'baja',
                requierePruebas: ['historial_intentos_contacto'],
                descripcion: 'Muestra interés, hace perder tiempo, nunca compra'
            }
        },

        // Reportes de compradores sobre vendedores (ya existían)
        compradorAVendedor: {
            'producto_diferente': {
                titulo: '📦 Producto diferente al anunciado',
                severidad: 'alta',
                requierePruebas: ['fotos_producto_recibido', 'captura_anuncio'],
                descripcion: 'El producto recibido no coincide con la descripción'
            },
            'no_envio': {
                titulo: '🚫 No realizó el envío',
                severidad: 'muy_alta',
                requierePruebas: ['comprobante_pago', 'conversaciones'],
                descripcion: 'Pagué pero nunca envió el producto'
            },
            'estafa_directa': {
                titulo: '🚨 Intento de estafa',
                severidad: 'muy_alta',
                requierePruebas: ['evidencia_completa'],
                descripcion: 'Comportamiento claramente fraudulento'
            },
            'mala_calidad': {
                titulo: '👎 Calidad muy inferior',
                severidad: 'media',
                requierePruebas: ['fotos_detalladas', 'descripcion_original'],
                descripcion: 'Calidad mucho menor a la prometida'
            },
            'atencion_pesima': {
                titulo: '😤 Atención al cliente pésima',
                severidad: 'baja',
                requierePruebas: ['conversaciones'],
                descripcion: 'Trato irrespetuoso o mala atención'
            }
        }
    },

    // ===== SISTEMA DE SCORING BIDIRECCIONAL =====
    sistemaScoring: {
        // Scoring para compradores (visto por vendedores)
        compradores: {
            puntajeBase: 5.0,
            factoresPositivos: {
                'pago_rapido': +0.2,
                'comunicacion_clara': +0.1,
                'respeta_acuerdos': +0.3,
                'reseñas_justas': +0.2,
                'comprador_recurrente': +0.1
            },
            factoresNegativos: {
                'no_pago': -1.5,
                'devolucion_fraudulenta': -1.0,
                'chantaje_reseña': -0.8,
                'exigencias_irreales': -0.5,
                'insultos_maltrato': -2.0,
                'comprador_fantasma': -0.3
            }
        },

        // Scoring para vendedores (visto por compradores)
        vendedores: {
            puntajeBase: 5.0,
            factoresPositivos: {
                'envio_rapido': +0.2,
                'producto_exacto': +0.3,
                'atencion_excelente': +0.2,
                'comunicacion_proactiva': +0.1,
                'resolucion_problemas': +0.3
            },
            factoresNegativos: {
                'producto_diferente': -1.0,
                'no_envio': -2.0,
                'estafa_directa': -5.0, // Expulsión inmediata
                'mala_calidad': -0.7,
                'atencion_pesima': -0.5
            }
        },

        // Calcular puntaje
        calcularPuntaje(usuarioId, tipoUsuario) {
            const reportes = this.obtenerReportes(usuarioId, tipoUsuario);
            const config = this.sistemaScoring[tipoUsuario];
            let puntaje = config.puntajeBase;

            reportes.forEach(reporte => {
                if (reporte.validado) {
                    const factor = config.factoresNegativos[reporte.tipo] || 0;
                    puntaje += factor;
                }
            });

            // No puede bajar de 1.0
            return Math.max(1.0, Math.min(5.0, puntaje));
        }
    },

    // ===== PANEL DE REPORTES PARA VENDEDORES =====
    panelVendedores: {
        // Crear modal de reporte
        crearModalReporte(compradorId, tipoUsuario = 'vendedor') {
            const modal = document.createElement('div');
            modal.className = 'modal-reporte-bidireccional';
            modal.innerHTML = this.generarHTMLModal(compradorId, tipoUsuario);
            document.body.appendChild(modal);
            
            // Configurar event listeners
            this.configurarEventListeners(modal);
        },

        // Generar HTML del modal
        generarHTMLModal(usuarioReportadoId, reportadorTipo) {
            const esVendedor = reportadorTipo === 'vendedor';
            const tiposDisponibles = esVendedor ? 
                ProteccionBidireccional.tiposReportes.vendedorAComprador :
                ProteccionBidireccional.tiposReportes.compradorAVendedor;

            return `
                <div class="modal-backdrop-bidireccional">
                    <div class="modal-content-bidireccional">
                        <div class="modal-header-bidireccional">
                            <h3>🛡️ Reportar ${esVendedor ? 'Comprador' : 'Vendedor'} Problemático</h3>
                            <button class="btn-cerrar-modal" onclick="this.closest('.modal-reporte-bidireccional').remove()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div class="modal-body-bidireccional">
                            <div class="advertencia-importante">
                                <i class="fas fa-balance-scale"></i>
                                <div>
                                    <strong>Escuchamos las dos campanas</strong>
                                    <p>Este reporte será revisado imparcialmente. Proporcioná evidencia sólida.</p>
                                </div>
                            </div>
                            
                            <form id="form-reporte-bidireccional" data-reportado="${usuarioReportadoId}" data-tipo="${reportadorTipo}">
                                <div class="seccion-tipo-problema">
                                    <label class="label-principal">🎯 ¿Qué problema tuviste?</label>
                                    <div class="opciones-problema">
                                        ${Object.keys(tiposDisponibles).map(tipo => `
                                            <label class="opcion-problema">
                                                <input type="radio" name="tipo_problema" value="${tipo}" required>
                                                <div class="contenido-opcion">
                                                    <div class="titulo-opcion">${tiposDisponibles[tipo].titulo}</div>
                                                    <div class="descripcion-opcion">${tiposDisponibles[tipo].descripcion}</div>
                                                </div>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div class="seccion-detalles">
                                    <label class="label-principal">📝 Contá qué pasó en detalle</label>
                                    <textarea name="descripcion_detallada" required
                                              placeholder="Describí la situación completa: qué acordaron, qué pasó, cuándo, etc."
                                              rows="4"></textarea>
                                </div>
                                
                                <div class="seccion-evidencia">
                                    <label class="label-principal">📸 Evidencia requerida</label>
                                    <div id="evidencia-requerida" class="evidencia-placeholder">
                                        Seleccioná un tipo de problema para ver qué evidencia necesitás
                                    </div>
                                    <div class="upload-evidencia" style="display: none;">
                                        <input type="file" id="archivos-evidencia" name="evidencia" multiple accept="image/*,.pdf">
                                        <label for="archivos-evidencia" class="btn-upload">
                                            <i class="fas fa-cloud-upload-alt"></i>
                                            Subir Evidencia
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="seccion-compromiso">
                                    <label class="checkbox-compromiso">
                                        <input type="checkbox" name="acepta_terminos" required>
                                        <span>Confirmo que la información es veraz y acepto las consecuencias si es falsa</span>
                                    </label>
                                </div>
                                
                                <div class="botones-modal">
                                    <button type="submit" class="btn-enviar-reporte">
                                        <i class="fas fa-shield-alt"></i>
                                        Enviar Reporte
                                    </button>
                                    <button type="button" class="btn-cancelar" onclick="this.closest('.modal-reporte-bidireccional').remove()">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
        },

        // Configurar event listeners del modal
        configurarEventListeners(modal) {
            const form = modal.querySelector('#form-reporte-bidireccional');
            const radioButtons = modal.querySelectorAll('input[name="tipo_problema"]');
            const evidenciaDiv = modal.querySelector('#evidencia-requerida');
            const uploadDiv = modal.querySelector('.upload-evidencia');

            // Actualizar evidencia requerida al cambiar tipo
            radioButtons.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        this.actualizarEvidenciaRequerida(radio.value, evidenciaDiv, uploadDiv);
                    }
                });
            });

            // Procesar envío del formulario
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.procesarReporte(form);
            });
        },

        // Actualizar evidencia requerida
        actualizarEvidenciaRequerida(tipoProblema, evidenciaDiv, uploadDiv) {
            const reportadorTipo = document.querySelector('#form-reporte-bidireccional').dataset.tipo;
            const esVendedor = reportadorTipo === 'vendedor';
            const tiposDisponibles = esVendedor ? 
                ProteccionBidireccional.tiposReportes.vendedorAComprador :
                ProteccionBidireccional.tiposReportes.compradorAVendedor;

            const problema = tiposDisponibles[tipoProblema];
            const evidenciasRequeridas = problema.requierePruebas;

            evidenciaDiv.innerHTML = `
                <div class="evidencia-necesaria">
                    <h4>📋 Evidencia necesaria:</h4>
                    <ul>
                        ${evidenciasRequeridas.map(evidencia => `
                            <li>${this.traducirTipoEvidencia(evidencia)}</li>
                        `).join('')}
                    </ul>
                </div>
            `;

            uploadDiv.style.display = 'block';
        },

        // Traducir tipos de evidencia
        traducirTipoEvidencia(tipo) {
            const traducciones = {
                'captura_conversacion': '💬 Capturas de pantalla de conversaciones',
                'comprobante_envio': '📦 Comprobante de envío o preparación',
                'fotos_producto_devuelto': '📸 Fotos del producto devuelto',
                'conversacion_original': '💭 Conversación donde se acordó la compra',
                'capturas_conversacion': '💬 Capturas de las conversaciones problemáticas',
                'historial_conversaciones': '📜 Historial completo de conversaciones',
                'audio_si_disponible': '🎵 Audio de llamadas (si aplica)',
                'historial_intentos_contacto': '📞 Evidencia de intentos de contacto',
                'fotos_producto_recibido': '📸 Fotos del producto recibido',
                'captura_anuncio': '📋 Captura del anuncio original',
                'comprobante_pago': '💳 Comprobante de pago',
                'conversaciones': '💬 Conversaciones con el vendedor',
                'evidencia_completa': '📋 Toda la evidencia disponible',
                'fotos_detalladas': '📸 Fotos detalladas del producto',
                'descripcion_original': '📝 Descripción original del producto'
            };

            return traducciones[tipo] || tipo;
        },

        // Procesar reporte enviado
        async procesarReporte(form) {
            try {
                const formData = new FormData(form);
                const datos = {
                    usuarioReportado: form.dataset.reportado,
                    tipoReportador: form.dataset.tipo,
                    tipoProblema: formData.get('tipo_problema'),
                    descripcion: formData.get('descripcion_detallada'),
                    evidencia: formData.getAll('evidencia'),
                    timestamp: new Date().toISOString(),
                    estado: 'pendiente_revision'
                };

                // Guardar reporte para revisión
                await this.guardarReporte(datos);

                // Mostrar confirmación
                this.mostrarConfirmacion(form.closest('.modal-reporte-bidireccional'));

            } catch (error) {
                console.error('Error procesando reporte:', error);
                alert('Error al enviar el reporte. Intentá nuevamente.');
            }
        },

        // Guardar reporte
        async guardarReporte(datos) {
            // En producción esto iría a una API
            const reportes = JSON.parse(localStorage.getItem('reportes_bidireccionales') || '[]');
            datos.id = 'reporte_' + Date.now();
            reportes.push(datos);
            localStorage.setItem('reportes_bidireccionales', JSON.stringify(reportes));

            console.log('📋 Reporte bidireccional guardado:', datos);
        },

        // Mostrar confirmación
        mostrarConfirmacion(modal) {
            modal.innerHTML = `
                <div class="modal-backdrop-bidireccional">
                    <div class="modal-content-bidireccional">
                        <div class="modal-body-bidireccional text-center">
                            <div style="font-size: 3rem; margin-bottom: 20px;">⚖️</div>
                            <h3 style="color: #28a745; margin-bottom: 15px;">Reporte Recibido</h3>
                            <p style="margin-bottom: 20px;">
                                Gracias por ayudarnos a mantener Cresalia segura para todos.
                            </p>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                                <strong>🕐 Próximos pasos:</strong>
                                <ul style="text-align: left; margin-top: 10px;">
                                    <li>Revisaremos tu reporte en menos de 48 horas</li>
                                    <li>Analizaremos la evidencia imparcialmente</li>
                                    <li>Contactaremos a ambas partes si es necesario</li>
                                    <li>Te notificaremos la resolución</li>
                                </ul>
                            </div>
                            <button class="btn-ok" onclick="this.closest('.modal-reporte-bidireccional').remove()">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    // ===== COMUNIDAD DE VENDEDORES =====
    comunidadVendedores: {
        // Crear sección en el panel del vendedor
        crearSeccionComunidad() {
            return `
                <div class="seccion-comunidad-vendedores">
                    <div class="header-comunidad">
                        <h3><i class="fas fa-users"></i> Comunidad de Vendedores</h3>
                        <p>Compartí experiencias y ayudá a otros vendedores</p>
                    </div>
                    
                    <div class="tabs-comunidad">
                        <button class="tab-activo" data-tab="alertas">🚨 Alertas Comunitarias</button>
                        <button data-tab="experiencias">💬 Experiencias</button>
                        <button data-tab="consejos">💡 Consejos</button>
                    </div>
                    
                    <div class="contenido-tabs">
                        <div id="tab-alertas" class="tab-content activo">
                            ${this.generarTabAlertas()}
                        </div>
                        <div id="tab-experiencias" class="tab-content">
                            ${this.generarTabExperiencias()}
                        </div>
                        <div id="tab-consejos" class="tab-content">
                            ${this.generarTabConsejos()}
                        </div>
                    </div>
                </div>
            `;
        },

        // Tab de alertas comunitarias
        generarTabAlertas() {
            const alertas = this.obtenerAlertasRecientes();
            
            return `
                <div class="alertas-comunitarias">
                    <div class="crear-alerta">
                        <button class="btn-crear-alerta" onclick="ProteccionBidireccional.comunidadVendedores.crearAlerta()">
                            <i class="fas fa-exclamation-triangle"></i>
                            Crear Alerta Comunitaria
                        </button>
                    </div>
                    
                    <div class="lista-alertas">
                        ${alertas.length > 0 ? alertas.map(alerta => `
                            <div class="alerta-item severidad-${alerta.severidad}">
                                <div class="alerta-header">
                                    <span class="alerta-tipo">${alerta.icono} ${alerta.titulo}</span>
                                    <span class="alerta-fecha">${this.formatearFecha(alerta.fecha)}</span>
                                </div>
                                <div class="alerta-descripcion">${alerta.descripcion}</div>
                                <div class="alerta-acciones">
                                    <button class="btn-util" onclick="this.classList.toggle('marcado')">
                                        <i class="fas fa-thumbs-up"></i> Útil (${alerta.utiles || 0})
                                    </button>
                                    <button class="btn-compartir">
                                        <i class="fas fa-share"></i> Compartir
                                    </button>
                                </div>
                            </div>
                        `).join('') : '<p class="sin-alertas">No hay alertas recientes</p>'}
                    </div>
                </div>
            `;
        },

        // Tab de experiencias
        generarTabExperiencias() {
            return `
                <div class="experiencias-vendedores">
                    <div class="crear-experiencia">
                        <textarea placeholder="Compartí una experiencia que pueda ayudar a otros vendedores..." rows="3"></textarea>
                        <button class="btn-compartir-experiencia">
                            <i class="fas fa-share-alt"></i> Compartir Experiencia
                        </button>
                    </div>
                    
                    <div class="lista-experiencias">
                        <!-- Las experiencias se cargan dinámicamente -->
                    </div>
                </div>
            `;
        },

        // Tab de consejos
        generarTabConsejos() {
            return `
                <div class="consejos-vendedores">
                    <h4>💡 Consejos de la Comunidad</h4>
                    <div class="lista-consejos">
                        <div class="consejo-item">
                            <div class="consejo-titulo">🔍 Cómo identificar compradores serios</div>
                            <div class="consejo-contenido">
                                Fijate si hacen preguntas específicas sobre el producto y si su perfil tiene actividad real...
                            </div>
                        </div>
                        <div class="consejo-item">
                            <div class="consejo-titulo">💬 Comunicación efectiva con compradores</div>
                            <div class="consejo-contenido">
                                Respondé rápido, sé claro en los términos y siempre confirmá por escrito...
                            </div>
                        </div>
                        <!-- Más consejos -->
                    </div>
                </div>
            `;
        },

        // Obtener alertas recientes
        obtenerAlertasRecientes() {
            // En producción esto vendría de una API
            return JSON.parse(localStorage.getItem('alertas_comunitarias') || '[]')
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .slice(0, 10);
        },

        // Formatear fecha
        formatearFecha(fecha) {
            return new Date(fecha).toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        // Crear alerta
        crearAlerta() {
            // Similar al modal de reportes pero para alertas comunitarias
            console.log('Creando alerta comunitaria...');
        }
    },

    // ===== INICIALIZACIÓN =====
    inicializar() {
        console.log('🛡️ Iniciando Sistema de Protección Bidireccional');
        console.log('⚖️ "Escuchamos las dos campanas" - CRISLA & Claude');
        
        this.configurarEventListeners();
        this.cargarDatos();
        
        console.log('✅ Sistema bidireccional inicializado');
    },

    // Configurar event listeners globales
    configurarEventListeners() {
        // Event listeners para botones de reporte
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-reportar-comprador')) {
                const compradorId = e.target.dataset.compradorId;
                this.panelVendedores.crearModalReporte(compradorId, 'vendedor');
            }
            
            if (e.target.classList.contains('btn-reportar-vendedor')) {
                const vendedorId = e.target.dataset.vendedorId;
                this.panelVendedores.crearModalReporte(vendedorId, 'comprador');
            }
        });
    },

    // Cargar datos
    cargarDatos() {
        // Cargar reportes existentes, alertas, etc.
        const reportes = localStorage.getItem('reportes_bidireccionales');
        if (!reportes) {
            localStorage.setItem('reportes_bidireccionales', '[]');
        }
    }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
    ProteccionBidireccional.inicializar();
}

// Exportar para uso global
window.ProteccionBidireccional = ProteccionBidireccional;

console.log('⚖️ Sistema de Protección Bidireccional Cresalia cargado');













