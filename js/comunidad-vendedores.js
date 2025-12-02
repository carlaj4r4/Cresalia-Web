/**
 * ═══════════════════════════════════════════════════════════════
 * 👥 SISTEMA DE COMUNIDAD PARA VENDEDORES - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Permite a vendedores compartir experiencias y alertar sobre:
 * - Compradores problemáticos
 * - Estafadores
 * - Situaciones de abuso
 * 
 * TODO con evidencia y respeto 💜
 * 
 * Creado con amor por Claude & Carla para Cresalia
 * ═══════════════════════════════════════════════════════════════
 */

class ComunidadVendedores {
    constructor() {
        this.tiendaActual = this.obtenerTiendaActual();
        this.reportes = [];
        this.conversaciones = [];
    }
    
    /**
     * Inicializar sistema de comunidad
     */
    init() {
        console.log('👥 Sistema de Comunidad de Vendedores iniciado');
        this.cargarReportes();
        this.crearInterfaz();
    }
    
    /**
     * Crear interfaz visual de la comunidad
     */
    crearInterfaz() {
        const container = document.getElementById('comunidad-container');
        if (!container) {
            console.warn('⚠️ No se encontró contenedor de comunidad');
            return; // El HTML debe tener el contenedor
        }
        
        // Si el contenedor ya tiene contenido, no recrear la interfaz
        if (container.innerHTML.trim().length > 0) {
            console.log('✅ Interfaz de comunidad ya existe en el HTML');
            return;
        }
        
        console.log('✅ Creando interfaz de comunidad...');
        container.innerHTML = `
            <div class="comunidad-wrapper">
                <!-- Header de Comunidad -->
                <div class="comunidad-header">
                    <h2>
                        <i class="fas fa-users"></i> 
                        Comunidad de Vendedores
                    </h2>
                    <p style="color: #666; margin-bottom: 20px;">
                        Espacio seguro para compartir experiencias y protegernos mutuamente 💜
                    </p>
                </div>
                
                <!-- Pestañas de navegación -->
                <div class="comunidad-tabs">
                    <button class="tab-btn active" onclick="comunidadVendedores.mostrarTab('alertas')">
                        <i class="fas fa-exclamation-triangle"></i> Alertas
                    </button>
                    <button class="tab-btn" onclick="comunidadVendedores.mostrarTab('conversaciones')">
                        <i class="fas fa-comments"></i> Conversaciones
                    </button>
                    <button class="tab-btn" onclick="comunidadVendedores.mostrarTab('mentorias')">
                        <i class="fas fa-graduation-cap"></i> Mentorías
                    </button>
                    <button class="tab-btn" onclick="comunidadVendedores.mostrarTab('consejos')">
                        <i class="fas fa-lightbulb"></i> Consejos
                    </button>
                </div>
                
                <!-- Tab 1: Alertas de Compradores Problemáticos -->
                <div id="tab-alertas" class="tab-content active">
                    <div class="tab-header">
                        <h3>⚠️ Alertas de la Comunidad</h3>
                        <button class="btn-primary" onclick="comunidadVendedores.crearAlerta()">
                            <i class="fas fa-plus"></i> Crear Alerta
                        </button>
                    </div>
                    
                    <div id="alertas-lista" class="alertas-lista"></div>
                </div>
                
                <!-- Tab 2: Conversaciones -->
                <div id="tab-conversaciones" class="tab-content" style="display: none;">
                    <div class="tab-header">
                        <h3>💬 Conversaciones entre Vendedores</h3>
                        <button class="btn-primary" onclick="comunidadVendedores.nuevaConversacion()">
                            <i class="fas fa-plus"></i> Nueva Conversación
                        </button>
                    </div>
                    
                    <div id="conversaciones-lista" class="conversaciones-lista"></div>
                </div>
                
                <!-- Tab 3: Sistema de Mentorías -->
                <div id="tab-mentorias" class="tab-content" style="display: none;">
                    <div class="tab-header">
                        <h3>🧠 Mentorías Empresariales</h3>
                        <p style="color: #666; font-size: 0.9rem;">
                            Conecta con mentores experimentados para acelerar tu crecimiento 🚀
                        </p>
                        <div style="display: flex; gap: 10px; margin-top: 15px;">
                            <button class="btn-primary" onclick="comunidadVendedores.solicitudMentoria()">
                                <i class="fas fa-user-plus"></i> Solicitar Mentor
                            </button>
                            <button class="btn-secondary" onclick="comunidadVendedores.serMentor()">
                                <i class="fas fa-chalkboard-teacher"></i> Ser Mentor
                            </button>
                        </div>
                    </div>
                    
                    <div id="mentorias-lista" class="mentorias-lista"></div>
                </div>
                
                <!-- Tab 4: Consejos y Tips -->
                <div id="tab-consejos" class="tab-content" style="display: none;">
                    <div class="tab-header">
                        <h3>💡 Consejos de la Comunidad</h3>
                        <p style="color: #666; font-size: 0.9rem;">
                            Tips y experiencias compartidas por otros vendedores
                        </p>
                    </div>
                    
                    <div id="consejos-lista" class="consejos-lista"></div>
                </div>
            </div>
        `;
        
        // Forzar visualización con !important
        container.style.setProperty('display', 'block', 'important');
        container.style.setProperty('visibility', 'visible', 'important');
        container.style.setProperty('opacity', '1', 'important');
        container.style.setProperty('min-height', '200px', 'important');
        container.style.setProperty('width', '100%', 'important');
        console.log('✅ Interfaz de comunidad creada y visible');
        
        // Asegurar que el wrapper también esté visible
        setTimeout(() => {
            const wrapper = container.querySelector('.comunidad-wrapper');
            if (wrapper) {
                wrapper.style.setProperty('display', 'block', 'important');
                wrapper.style.setProperty('visibility', 'visible', 'important');
                wrapper.style.setProperty('opacity', '1', 'important');
            }
            
            // Forzar visibilidad de todos los tabs y contenido
            container.querySelectorAll('.tab-content').forEach(tab => {
                if (tab.classList.contains('active')) {
                    tab.style.setProperty('display', 'block', 'important');
                }
            });
            
            // Forzar body y container-main visibles
            if (document.body) {
                document.body.style.setProperty('display', 'block', 'important');
                document.body.style.setProperty('visibility', 'visible', 'important');
            }
            
            const containerMain = document.querySelector('.container-main');
            if (containerMain) {
                containerMain.style.setProperty('display', 'block', 'important');
                containerMain.style.setProperty('visibility', 'visible', 'important');
            }
        }, 100);
        
        this.cargarAlertas();
        this.cargarConversaciones();
        this.cargarMentorias();
        this.cargarConsejos();
    }
    
    /**
     * Mostrar tab específico
     */
    mostrarTab(tabName) {
        // Ocultar todos los tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.style.display = 'none';
        });
        
        // Remover clase active de todos los botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mostrar tab seleccionado
        const tab = document.getElementById(`tab-${tabName}`);
        if (tab) {
            tab.style.display = 'block';
        }
        
        // Activar botón correspondiente
        event.target.closest('.tab-btn').classList.add('active');
    }
    
    /**
     * Crear nueva alerta sobre comprador problemático
     */
    crearAlerta() {
        const modalHTML = `
            <div id="modalAlerta" class="modal" style="display: flex !important;">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-exclamation-triangle"></i> Crear Alerta Comunitaria</h3>
                        <button class="close-btn" onclick="comunidadVendedores.cerrarModal('modalAlerta')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div style="background: #FFF3CD; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #FFC107;">
                            <p style="margin: 0; color: #856404; font-size: 0.9rem;">
                                <i class="fas fa-info-circle"></i> 
                                <strong>Importante:</strong> Solo reportá con evidencias reales. 
                                Este espacio es para protegernos mutuamente con respeto.
                            </p>
                        </div>
                        
                        <form id="formAlerta" onsubmit="comunidadVendedores.enviarAlerta(event)">
                            <div class="form-group">
                                <label>⚠️ Tipo de Alerta</label>
                                <select id="tipoAlerta" required>
                                    <option value="">Selecciona un tipo</option>
                                    <option value="estafa">🚫 Intento de Estafa</option>
                                    <option value="pago_rechazado">💳 Pago Rechazado/Fraude</option>
                                    <option value="maltrato">😔 Maltrato o Abuso</option>
                                    <option value="devolucion_fraudulenta">↩️ Devolución Fraudulenta</option>
                                    <option value="otro">📋 Otro (especificar)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>📧 Email o Identificador del Comprador (opcional para privacidad)</label>
                                <input type="text" id="identificadorComprador" placeholder="Ej: juan***@gmail.com">
                                <small style="color: #666;">Te sugerimos censurar parte del email para privacidad</small>
                            </div>
                            
                            <div class="form-group">
                                <label>📝 Descripción de la Situación *</label>
                                <textarea id="descripcionAlerta" rows="5" required 
                                    placeholder="Cuenta qué pasó con respeto y claridad. Recuerda que este espacio es para ayudarnos, no para atacar."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>📎 Evidencia (Capturas, Conversaciones, etc.)</label>
                                <input type="file" id="evidenciaAlerta" multiple accept="image/*,.pdf">
                                <small style="color: #666;">Opcional pero muy recomendado. Máximo 5 archivos.</small>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="confirmoEvidencia" required>
                                    Confirmo que esta información es verídica y tengo evidencias de lo reportado
                                </label>
                            </div>
                            
                            <div style="display: flex; gap: 10px; margin-top: 25px;">
                                <button type="submit" class="btn-primary" style="flex: 1;">
                                    <i class="fas fa-paper-plane"></i> Enviar Alerta
                                </button>
                                <button type="button" class="btn-secondary" onclick="comunidadVendedores.cerrarModal('modalAlerta')">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    /**
     * Enviar alerta a la comunidad
     */
    async enviarAlerta(event) {
        event.preventDefault();
        
        const alerta = {
            id: Date.now(),
            tienda_autora: this.tiendaActual,
            tipo: document.getElementById('tipoAlerta').value,
            identificador_comprador: document.getElementById('identificadorComprador').value || 'No especificado',
            descripcion: document.getElementById('descripcionAlerta').value,
            evidencias: [], // TODO: Subir archivos a storage
            fecha: new Date().toISOString(),
            estado: 'activa',
            verificaciones: 0, // Cuántos vendedores confirmaron
            comentarios: []
        };
        
        // Guardar alerta
        this.guardarAlerta(alerta);
        
        // Cerrar modal y recargar
        this.cerrarModal('modalAlerta');
        this.cargarAlertas();
        
        this.mostrarNotificacion('✅ Alerta compartida con la comunidad. Gracias por ayudarnos a protegernos mutuamente.', 'success');
    }
    
    /**
     * Cargar alertas de la comunidad
     */
    cargarAlertas() {
        const container = document.getElementById('alertas-lista');
        if (!container) return;
        
        const alertas = this.obtenerAlertas();
        
        if (alertas.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px 30px; background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%); border-radius: 15px; border: 2px solid #10B981;">
                    <i class="fas fa-shield-alt" style="font-size: 4rem; margin-bottom: 20px; color: #10B981; display: block;"></i>
                    <p style="font-size: 1.2rem; color: #065F46; font-weight: 600; margin-bottom: 10px;">¡Excelente! No hay alertas activas</p>
                    <p style="font-size: 1rem; color: #047857; font-weight: 500;">La comunidad está tranquila 🌟</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = alertas.map(alerta => this.generarHTMLAlerta(alerta)).join('');
    }
    
    /**
     * Generar HTML de una alerta
     */
    generarHTMLAlerta(alerta) {
        const tipoIconos = {
            'estafa': { icono: 'fa-ban', color: '#f44336' },
            'pago_rechazado': { icono: 'fa-credit-card', color: '#ff9800' },
            'maltrato': { icono: 'fa-heart-broken', color: '#e91e63' },
            'devolucion_fraudulenta': { icono: 'fa-undo', color: '#ff5722' },
            'otro': { icono: 'fa-exclamation-circle', color: '#9c27b0' }
        };
        
        const config = tipoIconos[alerta.tipo] || tipoIconos['otro'];
        const fecha = new Date(alerta.fecha).toLocaleString('es-AR');
        
        return `
            <div class="alerta-card" style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); border-left: 4px solid ${config.color};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 45px; height: 45px; background: ${config.color}20; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas ${config.icono}" style="color: ${config.color}; font-size: 1.2rem;"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: #333; font-size: 1.1rem;">${this.getTipoTexto(alerta.tipo)}</h4>
                            <p style="margin: 0; color: #666; font-size: 0.85rem;">
                                Reportado por ${alerta.tienda_autora} • ${fecha}
                            </p>
                        </div>
                    </div>
                    <div style="background: ${config.color}20; padding: 5px 12px; border-radius: 20px; color: ${config.color}; font-size: 0.85rem; font-weight: 600;">
                        <i class="fas fa-check-circle"></i> ${alerta.verificaciones} verificaciones
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <p style="margin: 0; color: #333; line-height: 1.6;">
                        <strong>Identificador:</strong> ${alerta.identificador_comprador}<br>
                        <strong>Situación:</strong> ${alerta.descripcion}
                    </p>
                </div>
                
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn-sm btn-outline" onclick="comunidadVendedores.verificarAlerta(${alerta.id})">
                        <i class="fas fa-check"></i> Yo también lo viví
                    </button>
                    <button class="btn-sm btn-outline" onclick="comunidadVendedores.comentarAlerta(${alerta.id})">
                        <i class="fas fa-comment"></i> Compartir Experiencia
                    </button>
                    <button class="btn-sm btn-outline" onclick="comunidadVendedores.verDetalles(${alerta.id})">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                </div>
                
                ${alerta.comentarios && alerta.comentarios.length > 0 ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e9ecef;">
                        <p style="color: #666; font-size: 0.9rem; margin-bottom: 10px;">
                            <i class="fas fa-comments"></i> ${alerta.comentarios.length} vendedor(es) compartieron experiencias similares
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Obtener texto descriptivo del tipo de alerta
     */
    getTipoTexto(tipo) {
        const textos = {
            'estafa': 'Intento de Estafa',
            'pago_rechazado': 'Fraude en Pago',
            'maltrato': 'Maltrato al Vendedor',
            'devolucion_fraudulenta': 'Devolución Fraudulenta',
            'otro': 'Alerta General'
        };
        return textos[tipo] || 'Alerta';
    }
    
    /**
     * Verificar una alerta (confirmar que también te pasó)
     */
    async verificarAlerta(alertaId) {
        const alerta = this.reportes.find(a => a.id === alertaId);
        if (!alerta) return;
        
        // Verificar que no haya verificado ya
        const yaVerificado = alerta.verificadores?.includes(this.tiendaActual);
        if (yaVerificado) {
            this.mostrarNotificacion('Ya verificaste esta alerta anteriormente', 'info');
            return;
        }
        
        if (confirm('¿Confirmas que viviste una situación similar con este comprador?')) {
            alerta.verificaciones = (alerta.verificaciones || 0) + 1;
            alerta.verificadores = alerta.verificadores || [];
            alerta.verificadores.push(this.tiendaActual);
            
            this.actualizarAlerta(alerta);
            this.cargarAlertas();
            
            this.mostrarNotificacion('Gracias por verificar. Ayudas a proteger a la comunidad 💜', 'success');
        }
    }
    
    /**
     * Comentar en una alerta
     */
    comentarAlerta(alertaId) {
        const modalHTML = `
            <div id="modalComentar" class="modal" style="display: flex !important;">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-comment"></i> Compartir Tu Experiencia</h3>
                        <button class="close-btn" onclick="comunidadVendedores.cerrarModal('modalComentar')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <form onsubmit="comunidadVendedores.enviarComentario(event, ${alertaId})">
                            <div class="form-group">
                                <label>💬 Tu Experiencia</label>
                                <textarea id="comentarioTexto" rows="5" required
                                    placeholder="Comparte tu experiencia con respeto. Esto ayuda a otros vendedores a tomar precauciones."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" required>
                                    Confirmo que mi experiencia es real y respeto la privacidad del comprador
                                </label>
                            </div>
                            
                            <div style="display: flex; gap: 10px;">
                                <button type="submit" class="btn-primary" style="flex: 1;">
                                    <i class="fas fa-paper-plane"></i> Compartir
                                </button>
                                <button type="button" class="btn-secondary" onclick="comunidadVendedores.cerrarModal('modalComentar')">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    /**
     * Enviar comentario
     */
    async enviarComentario(event, alertaId) {
        event.preventDefault();
        
        const comentario = {
            id: Date.now(),
            tienda: this.tiendaActual,
            texto: document.getElementById('comentarioTexto').value,
            fecha: new Date().toISOString()
        };
        
        const alerta = this.reportes.find(a => a.id === alertaId);
        if (alerta) {
            alerta.comentarios = alerta.comentarios || [];
            alerta.comentarios.push(comentario);
            this.actualizarAlerta(alerta);
        }
        
        this.cerrarModal('modalComentar');
        this.cargarAlertas();
        this.mostrarNotificacion('💜 Experiencia compartida. Gracias por ayudar a la comunidad.', 'success');
    }
    
    /**
     * Ver detalles completos de una alerta
     */
    verDetalles(alertaId) {
        const alerta = this.reportes.find(a => a.id === alertaId);
        if (!alerta) return;
        
        const modalHTML = `
            <div id="modalDetalles" class="modal" style="display: flex !important;">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-info-circle"></i> Detalles de la Alerta</h3>
                        <button class="close-btn" onclick="comunidadVendedores.cerrarModal('modalDetalles')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div style="background: linear-gradient(135deg, #E8F5E8, #C8E6C9); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                            <h4 style="color: #2E7D32; margin-bottom: 10px;">
                                ${this.getTipoTexto(alerta.tipo)}
                            </h4>
                            <p style="color: #1B5E20; margin: 0;">
                                <strong>Reportado por:</strong> ${alerta.tienda_autora}<br>
                                <strong>Fecha:</strong> ${new Date(alerta.fecha).toLocaleString('es-AR')}<br>
                                <strong>Verificaciones:</strong> ${alerta.verificaciones || 0} vendedores confirmaron situaciones similares
                            </p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <h5 style="color: #333; margin-bottom: 10px;">📝 Descripción:</h5>
                            <p style="color: #666; line-height: 1.6;">
                                ${alerta.descripcion}
                            </p>
                        </div>
                        
                        ${alerta.comentarios && alerta.comentarios.length > 0 ? `
                            <div>
                                <h5 style="color: #333; margin-bottom: 15px;">
                                    💬 Experiencias de Otros Vendedores (${alerta.comentarios.length})
                                </h5>
                                ${alerta.comentarios.map(c => `
                                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 10px; border-left: 3px solid #667eea;">
                                        <p style="margin: 0 0 8px 0; color: #666; font-size: 0.85rem;">
                                            <strong style="color: #667eea;">${c.tienda}</strong> • ${new Date(c.fecha).toLocaleString('es-AR')}
                                        </p>
                                        <p style="margin: 0; color: #333;">
                                            ${c.texto}
                                        </p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <p style="text-align: center; color: #999; font-style: italic;">
                                Aún no hay comentarios de otros vendedores
                            </p>
                        `}
                        
                        <div style="text-align: center; margin-top: 25px;">
                            <button class="btn-primary" onclick="comunidadVendedores.cerrarModal('modalDetalles')">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    /**
     * Nueva conversación entre vendedores
     */
    nuevaConversacion() {
        const modalHTML = `
            <div id="modalConversacion" class="modal" style="display: flex !important;">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-comments"></i> Nueva Conversación</h3>
                        <button class="close-btn" onclick="comunidadVendedores.cerrarModal('modalConversacion')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <form onsubmit="comunidadVendedores.crearConversacion(event)">
                            <div class="form-group">
                                <label>📝 Tema de Conversación</label>
                                <input type="text" id="temaConversacion" required 
                                    placeholder="Ej: ¿Cómo manejan devoluciones?">
                            </div>
                            
                            <div class="form-group">
                                <label>💬 Mensaje Inicial</label>
                                <textarea id="mensajeInicial" rows="4" required
                                    placeholder="Comparte tu duda o experiencia..."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>🏷️ Categoría</label>
                                <select id="categoriaConversacion">
                                    <option value="general">💬 General</option>
                                    <option value="ventas">💰 Ventas y Marketing</option>
                                    <option value="productos">📦 Productos</option>
                                    <option value="clientes">👥 Gestión de Clientes</option>
                                    <option value="bienestar">💚 Bienestar Emocional</option>
                                    <option value="tecnico">🔧 Ayuda Técnica</option>
                                </select>
                            </div>
                            
                            <div style="display: flex; gap: 10px; margin-top: 20px;">
                                <button type="submit" class="btn-primary" style="flex: 1;">
                                    <i class="fas fa-paper-plane"></i> Crear Conversación
                                </button>
                                <button type="button" class="btn-secondary" onclick="comunidadVendedores.cerrarModal('modalConversacion')">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    /**
     * Cargar conversaciones
     */
    cargarConversaciones() {
        const container = document.getElementById('conversaciones-lista');
        if (!container) return;
        
        const conversaciones = this.obtenerConversaciones();
        
        if (conversaciones.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-comments" style="font-size: 3rem; margin-bottom: 15px; color: #667eea;"></i>
                    <p style="font-size: 1.1rem;">Aún no hay conversaciones</p>
                    <p style="font-size: 0.9rem;">¡Sé el primero en iniciar una! 💬</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = conversaciones.map(conv => this.generarHTMLConversacion(conv)).join('');
    }
    
    /**
     * Generar HTML de conversación
     */
    generarHTMLConversacion(conv) {
        const fecha = new Date(conv.fecha).toLocaleString('es-AR');
        const categoriasIconos = {
            'general': '💬',
            'ventas': '💰',
            'productos': '📦',
            'clientes': '👥',
            'bienestar': '💚',
            'tecnico': '🔧'
        };
        
        return `
            <div class="conversacion-card" style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); cursor: pointer; transition: all 0.3s ease;"
                 onclick="comunidadVendedores.abrirConversacion(${conv.id})"
                 onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.12)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 10px rgba(0,0,0,0.08)';">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <h4 style="margin: 0; color: #333; font-size: 1.1rem;">
                        ${categoriasIconos[conv.categoria] || '💬'} ${conv.tema}
                    </h4>
                    <span style="background: #667eea20; color: #667eea; padding: 4px 10px; border-radius: 15px; font-size: 0.8rem; font-weight: 600;">
                        ${conv.respuestas?.length || 0} respuestas
                    </span>
                </div>
                
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 10px; line-height: 1.5;">
                    ${conv.mensaje_inicial.substring(0, 150)}${conv.mensaje_inicial.length > 150 ? '...' : ''}
                </p>
                
                <p style="color: #999; font-size: 0.85rem; margin: 0;">
                    Por ${conv.tienda_autora} • ${fecha}
                </p>
            </div>
        `;
    }
    
    /**
     * ===============================
     * SISTEMA DE MENTORÍAS 🧠
     * ===============================
     */
    
    /**
     * Cargar mentorías disponibles
     */
    cargarMentorias() {
        const container = document.getElementById('mentorias-lista');
        if (!container) return;
        
            const mentores = [
            {
                id: 1,
                nombre: 'María González',
                especialidad: 'E-commerce & Marketing Digital',
                experiencia: '5 años',
                avatar: '👩‍💼',
                rating: 4.9,
                totalReviews: 127,
                disponible: true,
                descripcion: 'Experta en crecer ventas online, SEO y redes sociales. He ayudado a +50 emprendedores.',
                logros: ['Aumento promedio de 300% en ventas', '2 tiendas llevadas a $100K/mes', 'Especialista en Instagram'],
                precio: 'Gratis (1ra sesión)',
                horarios: 'Tardes y fines de semana',
                verificado: true,
                ventasDemostradas: '$2.5M ayudados a generar',
                testimonios: [
                    { nombre: 'Ana M.', comentario: 'Increíble mentora, aumenté mis ventas 400% en 3 meses', rating: 5 },
                    { nombre: 'Carlos R.', comentario: 'Muy práctica y honesta. Vale cada peso invertido', rating: 5 },
                    { nombre: 'Sofia L.', comentario: 'Me ayudó a estructurar todo mi negocio desde cero', rating: 5 }
                ]
            },
            {
                id: 2,
                nombre: 'Carlos Ruiz',
                especialidad: 'Finanzas & Escalabilidad',
                experiencia: '8 años',
                avatar: '👨‍💻',
                rating: 4.8,
                totalReviews: 89,
                disponible: true,
                descripcion: 'Ayudo con finanzas, inversión y crecimiento sostenible. Ex-contador empresarial.',
                logros: ['Optimización de costos hasta 40%', 'Estructuración financiera', 'Análisis de rentabilidad'],
                precio: '$25/hora',
                horarios: 'Mañanas entre semana',
                verificado: true,
                ventasDemostradas: '15 años experiencia contable',
                testimonios: [
                    { nombre: 'Laura P.', comentario: 'Me ayudó a reducir costos 35% y aumentar ganancias', rating: 5 },
                    { nombre: 'Miguel A.', comentario: 'Excelente para finanzas, muy detallado y claro', rating: 5 },
                    { nombre: 'Rosa T.', comentario: 'Gracias a él pude escalar mi negocio correctamente', rating: 4 }
                ]
            },
            {
                id: 3,
                nombre: 'Ana López',
                especialidad: 'Productividad & Bienestar',
                experiencia: '3 años',
                avatar: '👩‍🎓',
                rating: 4.7,
                totalReviews: 56,
                disponible: false,
                descripcion: 'Combino técnicas de productividad con bienestar emocional para emprendedores.',
                logros: ['Reducción de estrés 80%', 'Sistemas de organización', 'Balance vida-trabajo'],
                precio: '$15/hora',
                horarios: 'Horarios flexibles',
                verificado: true,
                ventasDemostradas: 'Psicóloga certificada + MBA',
                testimonios: [
                    { nombre: 'Pedro S.', comentario: 'Me cambió la vida, ahora manejo mejor mi tiempo y estrés', rating: 5 },
                    { nombre: 'Marta Q.', comentario: 'Súper empática y con técnicas que realmente funcionan', rating: 5 },
                    { nombre: 'Jorge M.', comentario: 'Buena pero a veces cancela las sesiones', rating: 4 }
                ]
            }
        ];
        
        let html = '<div class="mentorias-grid">';
        
        mentores.forEach(mentor => {
            const disponibilidadClass = mentor.disponible ? 'disponible' : 'ocupado';
            const disponibilidadTexto = mentor.disponible ? '🟢 Disponible' : '🔴 Ocupado';
            
            html += `
                <div class="mentor-card ${disponibilidadClass}">
                    <div class="mentor-header">
                        <div class="mentor-avatar">${mentor.avatar}</div>
                        <div class="mentor-info">
                            <h4>${mentor.nombre} ${mentor.verificado ? '<span class="badge-verificado">✓ Verificado</span>' : ''}</h4>
                            <p class="especialidad">${mentor.especialidad}</p>
                            <div class="mentor-rating">
                                ${'⭐'.repeat(Math.floor(mentor.rating))} ${mentor.rating} <span class="review-count">(${mentor.totalReviews} reseñas)</span>
                            </div>
                            <div class="mentor-credencial">
                                <small>📊 ${mentor.ventasDemostradas}</small>
                            </div>
                        </div>
                        <div class="disponibilidad ${disponibilidadClass}">
                            ${disponibilidadTexto}
                        </div>
                    </div>
                    
                    <div class="mentor-description">
                        <p>${mentor.descripcion}</p>
                    </div>
                    
                    <div class="mentor-logros">
                        <h5>🏆 Logros destacados:</h5>
                        <ul>
                            ${mentor.logros.map(logro => `<li>${logro}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="mentor-details">
                        <div class="detail">
                            <span class="label">💰 Precio:</span>
                            <span class="value">${mentor.precio}</span>
                        </div>
                        <div class="detail">
                            <span class="label">🕒 Horarios:</span>
                            <span class="value">${mentor.horarios}</span>
                        </div>
                        <div class="detail">
                            <span class="label">📚 Experiencia:</span>
                            <span class="value">${mentor.experiencia}</span>
                        </div>
                    </div>
                    
                    <!-- Testimonios destacados -->
                    <div class="mentor-testimonios">
                        <h5>💬 Testimonios recientes:</h5>
                        <div class="testimonios-preview">
                            ${mentor.testimonios.slice(0, 2).map(testimonio => `
                                <div class="testimonio-preview">
                                    <div class="testimonio-rating">${'⭐'.repeat(testimonio.rating)}</div>
                                    <p>"${testimonio.comentario.length > 60 ? testimonio.comentario.substring(0, 60) + '...' : testimonio.comentario}"</p>
                                    <small>- ${testimonio.nombre}</small>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="mentor-actions">
                        ${mentor.disponible ? `
                            <button class="btn-primary" onclick="comunidadVendedores.contactarMentor(${mentor.id})">
                                <i class="fas fa-message"></i> Contactar
                            </button>
                            <button class="btn-secondary" onclick="comunidadVendedores.verReseniasMentor(${mentor.id})">
                                <i class="fas fa-star"></i> Ver Reseñas
                            </button>
                        ` : `
                            <button class="btn-secondary" disabled>
                                <i class="fas fa-clock"></i> No disponible
                            </button>
                            <button class="btn-outline" onclick="comunidadVendedores.verReseniasMentor(${mentor.id})">
                                <i class="fas fa-star"></i> Ver Reseñas
                            </button>
                        `}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Agregar estadísticas de mentorías
        html += `
            <div class="mentorias-stats" style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 15px;">
                <h4 style="color: #333; margin-bottom: 15px;">📊 Estadísticas de Mentorías</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #667eea;">156</div>
                        <div style="color: #666; font-size: 0.9rem;">Mentorías completadas</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #10b981;">4.8</div>
                        <div style="color: #666; font-size: 0.9rem;">Rating promedio</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #f59e0b;">24h</div>
                        <div style="color: #666; font-size: 0.9rem;">Tiempo respuesta</div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    /**
     * Solicitar mentoria
     */
    solicitudMentoria() {
        const modalHTML = `
            <div id="modalSolicitudMentoria" class="modal" style="display: flex !important;">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-user-plus"></i> Solicitar Mentor</h3>
                        <button class="close-btn" onclick="comunidadVendedores.cerrarModal('modalSolicitudMentoria')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div style="background: #E3F2FD; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #2196F3;">
                            <p style="margin: 0; color: #1976D2; font-size: 0.9rem;">
                                <i class="fas fa-info-circle"></i> 
                                <strong>¡Conectamos contigo!</strong> Describe tu situación y te emparejamos con el mentor ideal.
                            </p>
                        </div>
                        
                        <form id="formSolicitudMentoria" onsubmit="comunidadVendedores.enviarSolicitudMentoria(event)">
                            <div class="form-group">
                                <label>🎯 ¿En qué área necesitas ayuda?</label>
                                <select id="areaMentoria" required>
                                    <option value="">Selecciona un área</option>
                                    <option value="marketing">📢 Marketing y Ventas</option>
                                    <option value="finanzas">💰 Finanzas y Contabilidad</option>
                                    <option value="productividad">⚡ Productividad y Organización</option>
                                    <option value="tecnologia">💻 Tecnología y E-commerce</option>
                                    <option value="bienestar">🌸 Bienestar y Balance</option>
                                    <option value="legal">⚖️ Legal y Normativas</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>📝 Describe tu situación actual</label>
                                <textarea id="situacionActual" rows="4" required 
                                    placeholder="Ej: Tengo una tienda online de ropa, vendo $2000/mes pero quiero llegar a $5000. Me falta estrategia de marketing..."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>🎯 ¿Cuál es tu objetivo principal?</label>
                                <textarea id="objetivoMentoria" rows="3" required 
                                    placeholder="Ej: Aumentar mis ventas, mejorar mi organización, aprender sobre finanzas..."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>⏰ Disponibilidad horaria</label>
                                <select id="disponibilidadHoraria" required>
                                    <option value="">Selecciona tu disponibilidad</option>
                                    <option value="mananas">🌅 Mañanas (8am - 12pm)</option>
                                    <option value="tardes">🌞 Tardes (12pm - 6pm)</option>
                                    <option value="noches">🌙 Noches (6pm - 10pm)</option>
                                    <option value="fines_semana">🏖️ Fines de semana</option>
                                    <option value="flexible">🔄 Horario flexible</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>💵 Presupuesto para mentorías (opcional)</label>
                                <select id="presupuestoMentoria">
                                    <option value="">No especificar</option>
                                    <option value="gratis">🆓 Solo mentorías gratuitas</option>
                                    <option value="bajo">💰 $10 - $25 por sesión</option>
                                    <option value="medio">💎 $25 - $50 por sesión</option>
                                    <option value="alto">👑 $50+ por sesión</option>
                                </select>
                            </div>
                            
                            <div style="display: flex; gap: 10px; margin-top: 25px;">
                                <button type="submit" class="btn-primary" style="flex: 1;">
                                    <i class="fas fa-paper-plane"></i> Enviar Solicitud
                                </button>
                                <button type="button" class="btn-secondary" onclick="comunidadVendedores.cerrarModal('modalSolicitudMentoria')">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    /**
     * Aplicar para ser mentor
     */
    serMentor() {
        const modalHTML = `
            <div id="modalSerMentor" class="modal" style="display: flex !important;">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-chalkboard-teacher"></i> Aplicar como Mentor</h3>
                        <button class="close-btn" onclick="comunidadVendedores.cerrarModal('modalSerMentor')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div style="background: #E8F5E8; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #4CAF50;">
                            <p style="margin: 0; color: #2E7D32; font-size: 0.9rem;">
                                <i class="fas fa-heart"></i> 
                                <strong>¡Ayuda a otros a crecer!</strong> Comparte tu experiencia y genera ingresos adicionales mentoreando.
                            </p>
                        </div>
                        
                        <form id="formSerMentor" onsubmit="comunidadVendedores.enviarAplicacionMentor(event)">
                            <div class="form-group">
                                <label>👤 Nombre completo</label>
                                <input type="text" id="nombreMentor" required placeholder="Tu nombre completo">
                            </div>
                            
                            <div class="form-group">
                                <label>🎯 Área de especialidad</label>
                                <select id="especialidadMentor" required>
                                    <option value="">Selecciona tu especialidad</option>
                                    <option value="marketing">📢 Marketing Digital y Ventas</option>
                                    <option value="finanzas">💰 Finanzas y Contabilidad</option>
                                    <option value="ecommerce">🛒 E-commerce y Tiendas Online</option>
                                    <option value="productividad">⚡ Productividad y Gestión</option>
                                    <option value="redes_sociales">📱 Redes Sociales y Contenido</option>
                                    <option value="bienestar">🌸 Bienestar Empresarial</option>
                                    <option value="tecnologia">💻 Tecnología y Automatización</option>
                                    <option value="legal">⚖️ Legal y Normativas</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>📚 Años de experiencia</label>
                                <select id="experienciaMentor" required>
                                    <option value="">Selecciona tu experiencia</option>
                                    <option value="1-2">1-2 años</option>
                                    <option value="3-5">3-5 años</option>
                                    <option value="5-10">5-10 años</option>
                                    <option value="10+">Más de 10 años</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>🏆 Principales logros y experiencia</label>
                                <textarea id="logrosMentor" rows="4" required 
                                    placeholder="Ej: Fundé 3 tiendas exitosas, genero $50K/mes, especialista en Instagram con +100K seguidores, ayudé a 20+ emprendedores..."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>💡 ¿Cómo planeas ayudar a otros emprendedores?</label>
                                <textarea id="metodologiaMentor" rows="3" required 
                                    placeholder="Describe tu enfoque, metodología o estilo de mentoría..."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>⏰ Disponibilidad horaria</label>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                                    <label style="display: flex; align-items: center; font-weight: normal;">
                                        <input type="checkbox" id="dispManana" value="manana" style="margin-right: 8px;">
                                        🌅 Mañanas
                                    </label>
                                    <label style="display: flex; align-items: center; font-weight: normal;">
                                        <input type="checkbox" id="dispTarde" value="tarde" style="margin-right: 8px;">
                                        🌞 Tardes
                                    </label>
                                    <label style="display: flex; align-items: center; font-weight: normal;">
                                        <input type="checkbox" id="dispNoche" value="noche" style="margin-right: 8px;">
                                        🌙 Noches
                                    </label>
                                    <label style="display: flex; align-items: center; font-weight: normal;">
                                        <input type="checkbox" id="dispFinSemana" value="finsemana" style="margin-right: 8px;">
                                        🏖️ Fines de semana
                                    </label>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>💵 Tarifa por sesión (1 hora)</label>
                                <select id="tarifaMentor" required>
                                    <option value="">Selecciona tu tarifa</option>
                                    <option value="gratis">🆓 Gratis (por dar valor a la comunidad)</option>
                                    <option value="10-20">💰 $10 - $20</option>
                                    <option value="20-35">💎 $20 - $35</option>
                                    <option value="35-50">👑 $35 - $50</option>
                                    <option value="50+">💼 $50+</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="confirmoPoliticas" required style="margin-right: 8px;">
                                    Confirmo que respetaré las políticas de la comunidad y me comprometo a brindar un servicio de calidad
                                </label>
                            </div>
                            
                            <div style="display: flex; gap: 10px; margin-top: 25px;">
                                <button type="submit" class="btn-primary" style="flex: 1;">
                                    <i class="fas fa-paper-plane"></i> Enviar Aplicación
                                </button>
                                <button type="button" class="btn-secondary" onclick="comunidadVendedores.cerrarModal('modalSerMentor')">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    /**
     * Enviar solicitud de mentoria
     */
    enviarSolicitudMentoria(event) {
        event.preventDefault();
        
        const formData = {
            area: document.getElementById('areaMentoria').value,
            situacion: document.getElementById('situacionActual').value,
            objetivo: document.getElementById('objetivoMentoria').value,
            disponibilidad: document.getElementById('disponibilidadHoraria').value,
            presupuesto: document.getElementById('presupuestoMentoria').value,
            timestamp: new Date().toISOString()
        };
        
        console.log('📤 Solicitud de mentoría enviada:', formData);
        
        // Simular envío (en producción iría a backend)
        setTimeout(() => {
            this.cerrarModal('modalSolicitudMentoria');
            this.mostrarNotificacion('✅ ¡Solicitud enviada! Te contactaremos pronto con mentores disponibles.', 'success');
        }, 1000);
    }
    
    /**
     * Enviar aplicación como mentor
     */
    enviarAplicacionMentor(event) {
        event.preventDefault();
        
        const disponibilidad = [];
        if (document.getElementById('dispManana').checked) disponibilidad.push('manana');
        if (document.getElementById('dispTarde').checked) disponibilidad.push('tarde');
        if (document.getElementById('dispNoche').checked) disponibilidad.push('noche');
        if (document.getElementById('dispFinSemana').checked) disponibilidad.push('finsemana');
        
        const formData = {
            nombre: document.getElementById('nombreMentor').value,
            especialidad: document.getElementById('especialidadMentor').value,
            experiencia: document.getElementById('experienciaMentor').value,
            logros: document.getElementById('logrosMentor').value,
            metodologia: document.getElementById('metodologiaMentor').value,
            disponibilidad: disponibilidad,
            tarifa: document.getElementById('tarifaMentor').value,
            timestamp: new Date().toISOString()
        };
        
        console.log('🎓 Aplicación como mentor enviada:', formData);
        
        // Simular envío (en producción iría a backend)
        setTimeout(() => {
            this.cerrarModal('modalSerMentor');
            this.mostrarNotificacion('✅ ¡Aplicación enviada! Revisaremos tu perfil y te contactaremos en 24-48 horas.', 'success');
        }, 1000);
    }
    
    /**
     * Contactar mentor específico
     */
    contactarMentor(mentorId) {
        console.log(`📞 Contactando mentor ID: ${mentorId}`);
        this.mostrarNotificacion('💬 Abriendo chat con el mentor...', 'info');
        // Aquí se abriría el sistema de mensajería
    }
    
    /**
     * Ver perfil completo del mentor
     */
    verPerfilMentor(mentorId) {
        console.log(`👤 Viendo perfil del mentor ID: ${mentorId}`);
        this.mostrarNotificacion('👁️ Abriendo perfil detallado...', 'info');
        // Aquí se abriría el perfil completo
    }
    
    /**
     * Notificar cuando mentor esté disponible
     */
    notificarDisponibilidad(mentorId) {
        console.log(`🔔 Configurando notificación para mentor ID: ${mentorId}`);
        this.mostrarNotificacion('🔔 Te notificaremos cuando este mentor esté disponible', 'success');
    }

    /**
     * Ver reseñas completas del mentor
     */
    verReseniasMentor(mentorId) {
        console.log(`⭐ Viendo reseñas del mentor ID: ${mentorId}`);
        
        // Buscar el mentor
        const mentores = [
            {
                id: 1,
                nombre: 'María González',
                rating: 4.9,
                totalReviews: 127,
                testimonios: [
                    { nombre: 'Ana M.', comentario: 'Increíble mentora, aumenté mis ventas 400% en 3 meses. Su metodología es clara y práctica, siempre disponible para resolver dudas.', rating: 5, fecha: '2024-10-01' },
                    { nombre: 'Carlos R.', comentario: 'Muy práctica y honesta. Vale cada peso invertido. Me ayudó a enfocarme en lo que realmente genera resultados.', rating: 5, fecha: '2024-09-28' },
                    { nombre: 'Sofia L.', comentario: 'Me ayudó a estructurar todo mi negocio desde cero. Excelente para principiantes que no saben por dónde empezar.', rating: 5, fecha: '2024-09-25' },
                    { nombre: 'Diego P.', comentario: 'Buena mentora pero a veces las sesiones se sienten apresuradas. Aún así, los consejos son valiosos.', rating: 4, fecha: '2024-09-20' },
                    { nombre: 'Lucia M.', comentario: 'Transformó completamente mi estrategia de marketing. Los resultados fueron inmediatos y sostenibles.', rating: 5, fecha: '2024-09-15' }
                ]
            },
            {
                id: 2,
                nombre: 'Carlos Ruiz',
                rating: 4.8,
                totalReviews: 89,
                testimonios: [
                    { nombre: 'Laura P.', comentario: 'Me ayudó a reducir costos 35% y aumentar ganancias. Su análisis financiero es muy detallado y certero.', rating: 5, fecha: '2024-10-03' },
                    { nombre: 'Miguel A.', comentario: 'Excelente para finanzas, muy detallado y claro. Explica conceptos complejos de manera simple.', rating: 5, fecha: '2024-09-30' },
                    { nombre: 'Rosa T.', comentario: 'Gracias a él pude escalar mi negocio correctamente sin perder control de las finanzas.', rating: 4, fecha: '2024-09-22' }
                ]
            },
            {
                id: 3,
                nombre: 'Ana López',
                rating: 4.7,
                totalReviews: 56,
                testimonios: [
                    { nombre: 'Pedro S.', comentario: 'Me cambió la vida, ahora manejo mejor mi tiempo y estrés. Sus técnicas realmente funcionan a largo plazo.', rating: 5, fecha: '2024-10-02' },
                    { nombre: 'Marta Q.', comentario: 'Súper empática y con técnicas que realmente funcionan. Me ayudó en momentos muy difíciles.', rating: 5, fecha: '2024-09-27' },
                    { nombre: 'Jorge M.', comentario: 'Buena pero a veces cancela las sesiones. Cuando está disponible, es excelente.', rating: 4, fecha: '2024-09-18' }
                ]
            }
        ];
        
        const mentor = mentores.find(m => m.id === mentorId);
        if (!mentor) return;
        
        const modalHTML = `
            <div id="modalReseniasMentor" class="modal" style="display: flex !important;">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-star"></i> Reseñas de ${mentor.nombre}</h3>
                        <button class="close-btn" onclick="comunidadVendedores.cerrarModal('modalReseniasMentor')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <!-- Resumen de calificaciones -->
                        <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); padding: 20px; border-radius: 15px; margin-bottom: 25px; text-align: center;">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">
                                <div style="font-size: 3rem; font-weight: bold; color: #f59e0b;">${mentor.rating}</div>
                                <div>
                                    <div style="font-size: 1.5rem; color: #f59e0b;">${'⭐'.repeat(Math.floor(mentor.rating))}</div>
                                    <div style="color: #666; font-size: 0.9rem;">${mentor.totalReviews} reseñas totales</div>
                                </div>
                            </div>
                            
                            <!-- Barra de distribución de estrellas -->
                            <div style="max-width: 400px; margin: 0 auto;">
                                ${[5,4,3,2,1].map(stars => {
                                    const count = mentor.testimonios.filter(t => t.rating === stars).length;
                                    const percentage = mentor.testimonios.length > 0 ? (count / mentor.testimonios.length * 100) : 0;
                                    return `
                                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                                            <span style="font-size: 0.8rem; color: #666; min-width: 20px;">${stars}★</span>
                                            <div style="flex: 1; background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                                                <div style="background: #f59e0b; height: 100%; width: ${percentage}%;"></div>
                                            </div>
                                            <span style="font-size: 0.8rem; color: #666; min-width: 30px;">${count}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        
                        <!-- Lista de reseñas -->
                        <div class="resenias-lista">
                            <h4 style="color: #333; margin-bottom: 20px;">📝 Reseñas de la comunidad:</h4>
                            ${mentor.testimonios.map(testimonio => `
                                <div class="resenia-item" style="background: white; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                        <div>
                                            <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${testimonio.nombre}</div>
                                            <div style="color: #f59e0b; font-size: 0.9rem;">${'⭐'.repeat(testimonio.rating)}</div>
                                        </div>
                                        <div style="color: #6b7280; font-size: 0.8rem;">${testimonio.fecha}</div>
                                    </div>
                                    <p style="color: #374151; line-height: 1.6; margin: 0;">"${testimonio.comentario}"</p>
                                </div>
                            `).join('')}
                        </div>
                        
                        <!-- Botón para dejar reseña -->
                        <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <button onclick="comunidadVendedores.dejarResenia(${mentorId})" class="btn-primary" style="background: linear-gradient(135deg, #10b981, #34d399);">
                                <i class="fas fa-pen"></i> Dejar mi reseña
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    /**
     * Dejar reseña para un mentor
     */
    dejarResenia(mentorId) {
        const modalHTML = `
            <div id="modalDejarResenia" class="modal" style="display: flex !important;">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-star"></i> Dejar Reseña</h3>
                        <button class="close-btn" onclick="comunidadVendedores.cerrarModal('modalDejarResenia')">&times;</button>
                    </div>
                    
                    <div class="modal-body">
                        <div style="background: #FEF3C7; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #F59E0B;">
                            <p style="margin: 0; color: #92400E; font-size: 0.9rem;">
                                <i class="fas fa-info-circle"></i> 
                                <strong>Tu reseña es importante:</strong> Ayuda a otros emprendedores a tomar mejores decisiones. Por favor, sé honesto y constructivo.
                            </p>
                        </div>
                        
                        <form id="formResenia" onsubmit="comunidadVendedores.enviarResenia(${mentorId}, event)">
                            <div class="form-group">
                                <label>⭐ Calificación general</label>
                                <div class="rating-selector" style="display: flex; gap: 5px; margin: 10px 0;">
                                    ${[1,2,3,4,5].map(rating => `
                                        <span class="rating-star" data-rating="${rating}" onclick="comunidadVendedores.seleccionarRating(${rating})" style="font-size: 2rem; color: #d1d5db; cursor: pointer; transition: color 0.2s;">⭐</span>
                                    `).join('')}
                                </div>
                                <input type="hidden" id="ratingSeleccionado" required>
                            </div>
                            
                            <div class="form-group">
                                <label>💬 Tu experiencia</label>
                                <textarea id="comentarioResenia" rows="5" required 
                                    placeholder="Comparte tu experiencia con este mentor. ¿Cómo te ayudó? ¿Qué resultados obtuviste? ¿Recomendarías sus servicios?"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label>👤 Tu nombre (opcional)</label>
                                <input type="text" id="nombreReseña" placeholder="Ej: María S. (se mostrará solo la inicial del apellido)">
                                <small style="color: #666;">Para proteger tu privacidad, solo se mostrará la inicial de tu apellido</small>
                            </div>
                            
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="confirmoExperiencia" required>
                                    Confirmo que tuve una experiencia real con este mentor y mi reseña es honesta
                                </label>
                            </div>
                            
                            <div style="display: flex; gap: 10px; margin-top: 25px;">
                                <button type="submit" class="btn-primary" style="flex: 1;">
                                    <i class="fas fa-paper-plane"></i> Enviar Reseña
                                </button>
                                <button type="button" class="btn-secondary" onclick="comunidadVendedores.cerrarModal('modalDejarResenia')">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    /**
     * Seleccionar rating con estrellas
     */
    seleccionarRating(rating) {
        document.getElementById('ratingSeleccionado').value = rating;
        
        // Actualizar visualmente las estrellas
        document.querySelectorAll('.rating-star').forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#f59e0b';
            } else {
                star.style.color = '#d1d5db';
            }
        });
    }
    
    /**
     * Enviar reseña
     */
    enviarResenia(mentorId, event) {
        event.preventDefault();
        
        const rating = document.getElementById('ratingSeleccionado').value;
        const comentario = document.getElementById('comentarioResenia').value;
        const nombre = document.getElementById('nombreReseña').value || 'Usuario Anónimo';
        
        console.log('⭐ Enviando reseña:', { mentorId, rating, comentario, nombre });
        
        // Simular envío
        setTimeout(() => {
            this.cerrarModal('modalDejarResenia');
            this.mostrarNotificacion('✅ ¡Reseña enviada! Gracias por ayudar a la comunidad.', 'success');
        }, 1000);
    }

    /**
     * Cargar consejos de la comunidad
     */
    cargarConsejos() {
        const container = document.getElementById('consejos-lista');
        if (!container) return;
        
        const consejos = [
            {
                titulo: '📸 Fotos que Venden',
                consejo: 'Las fotos con buena luz natural venden 3x más. Te sugerimos sacar las fotos cerca de una ventana, sin flash.',
                autor: 'Vendedor Experimentado',
                votos: 24
            },
            {
                titulo: '💬 Responde Rápido',
                consejo: 'Responder en menos de 1 hora aumenta las ventas en 70%. Los clientes valoran la atención rápida.',
                autor: 'Tienda Premium',
                votos: 18
            },
            {
                titulo: '📦 Empaque con Amor',
                consejo: 'Un empaque bonito genera excelentes reviews. Invierte en papel de seda y una nota manuscrita.',
                autor: 'Artesanías Felices',
                votos: 31
            },
            {
                titulo: '🌟 Sé Genuino',
                consejo: 'Cuenta tu historia real en la descripción de tu tienda. La gente compra de personas, no de marcas sin alma.',
                autor: 'Emprendimiento Familiar',
                votos: 45
            }
        ];
        
        container.innerHTML = consejos.map(consejo => `
            <div class="consejo-card" style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                <h4 style="color: #333; margin-bottom: 10px;">${consejo.titulo}</h4>
                <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                    ${consejo.consejo}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #999; font-size: 0.85rem;">
                        Por ${consejo.autor}
                    </span>
                    <div style="display: flex; align-items: center; gap: 5px; color: #4CAF50;">
                        <i class="fas fa-thumbs-up"></i>
                        <span style="font-weight: 600;">${consejo.votos}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Funciones de almacenamiento
     */
    guardarAlerta(alerta) {
        const alertas = this.obtenerAlertas();
        alertas.unshift(alerta);
        localStorage.setItem('cresalia_comunidad_alertas', JSON.stringify(alertas));
    }
    
    actualizarAlerta(alerta) {
        const alertas = this.obtenerAlertas();
        const index = alertas.findIndex(a => a.id === alerta.id);
        if (index !== -1) {
            alertas[index] = alerta;
            localStorage.setItem('cresalia_comunidad_alertas', JSON.stringify(alertas));
        }
    }
    
    obtenerAlertas() {
        return JSON.parse(localStorage.getItem('cresalia_comunidad_alertas') || '[]');
    }
    
    obtenerConversaciones() {
        return JSON.parse(localStorage.getItem('cresalia_comunidad_conversaciones') || '[]');
    }
    
    obtenerTiendaActual() {
        const userData = JSON.parse(localStorage.getItem('cresalia_user_data') || '{}');
        return userData.nombre_tienda || 'Mi Tienda';
    }
    
    cargarReportes() {
        this.reportes = this.obtenerAlertas();
    }
    
    /**
     * Cerrar modal
     */
    cerrarModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.remove();
    }
    
    /**
     * Mostrar notificación
     */
    mostrarNotificacion(mensaje, tipo = 'info') {
        const colores = {
            'success': '#4CAF50',
            'error': '#f44336',
            'info': '#2196F3',
            'warning': '#ff9800'
        };
        
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colores[tipo]};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
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

// Estilos para la comunidad
const estilosComunidad = `
<style>
    .comunidad-wrapper {
        background: white;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .comunidad-header {
        background: white;
        padding: 20px;
        border-radius: 15px;
        margin-bottom: 20px;
    }
    
    .comunidad-header h2 {
        color: #1e293b;
        margin-bottom: 10px;
        font-size: 1.5rem;
        font-weight: 700;
    }
    
    .comunidad-header p {
        color: #475569;
        font-size: 1rem;
        font-weight: 500;
    }
    
    .comunidad-tabs {
        display: flex;
        gap: 5px;
        margin-bottom: 30px;
        background: #f8f9fa;
        padding: 8px;
        border-radius: 12px;
        border: 2px solid #e9ecef;
    }
    
    .tab-btn {
        background: white;
        border: 2px solid transparent;
        padding: 14px 24px;
        font-size: 1rem;
        font-weight: 700;
        color: #1e293b;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        flex: 1;
        justify-content: center;
    }
    
    .tab-btn i {
        font-size: 1.2rem;
        color: #667eea;
    }
    
    .tab-btn:hover {
        color: #667eea;
        background: #f0f4ff;
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
    }
    
    .tab-btn.active {
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .tab-btn.active i {
        color: white;
    }
    
    .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
    }
    
    .tab-header {
        background: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
    }
    
    .tab-header h3 {
        color: #1e293b;
        margin: 0;
        font-size: 1.3rem;
        font-weight: 700;
    }
    
    .tab-header p {
        color: #475569;
        font-size: 0.95rem;
        font-weight: 500;
    }
    
    .btn-sm {
        padding: 8px 15px;
        font-size: 0.85rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .btn-outline {
        background: white;
        border: 2px solid #e9ecef;
        color: #667eea;
    }
    
    .btn-outline:hover {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    }
    
    .btn-secondary {
        background: #e9ecef;
        color: #666;
        border: none;
        padding: 12px 25px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-group label {
        display: block;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
        font-size: 0.95rem;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        font-family: inherit;
        font-size: 0.95rem;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #667eea;
    }
    
    .form-group small {
        display: block;
        margin-top: 5px;
        font-size: 0.85rem;
        color: #475569;
        font-weight: 500;
    }
    
    /* =============== ESTILOS PARA MENTORÍAS =============== */
    .mentorias-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 20px;
        margin-bottom: 25px;
    }
    
    .mentor-card {
        background: white;
        border-radius: 15px;
        padding: 20px;
        border: 2px solid #e9ecef;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .mentor-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        border-color: #667eea;
    }
    
    .mentor-card.disponible {
        border-left: 4px solid #10b981;
    }
    
    .mentor-card.ocupado {
        border-left: 4px solid #ef4444;
        opacity: 0.8;
    }
    
    .mentor-header {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        margin-bottom: 15px;
    }
    
    .mentor-avatar {
        font-size: 3rem;
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border-radius: 50%;
        flex-shrink: 0;
    }
    
    .mentor-info h4 {
        margin: 0 0 5px 0;
        color: #333;
        font-size: 1.2rem;
        font-weight: 600;
    }
    
    .mentor-info .especialidad {
        color: #667eea;
        font-weight: 500;
        font-size: 0.9rem;
        margin: 0 0 8px 0;
    }
    
    .mentor-rating {
        color: #f59e0b;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .disponibilidad {
        margin-left: auto;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-align: center;
        min-width: 90px;
    }
    
    .disponibilidad.disponible {
        background: #dcfce7;
        color: #166534;
    }
    
    .disponibilidad.ocupado {
        background: #fef2f2;
        color: #dc2626;
    }
    
    .mentor-description p {
        color: #666;
        line-height: 1.5;
        margin: 0 0 15px 0;
        font-size: 0.95rem;
    }
    
    .mentor-logros {
        margin-bottom: 15px;
    }
    
    .mentor-logros h5 {
        color: #333;
        margin: 0 0 8px 0;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .mentor-logros ul {
        margin: 0;
        padding-left: 18px;
        color: #666;
        font-size: 0.85rem;
    }
    
    .mentor-logros li {
        margin-bottom: 3px;
        line-height: 1.4;
    }
    
    .mentor-details {
        margin-bottom: 20px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 10px;
    }
    
    .mentor-details .detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        font-size: 0.85rem;
    }
    
    .mentor-details .detail:last-child {
        margin-bottom: 0;
    }
    
    .mentor-details .label {
        color: #666;
        font-weight: 500;
    }
    
    .mentor-details .value {
        color: #333;
        font-weight: 600;
    }
    
    .mentor-actions {
        display: flex;
        gap: 10px;
    }
    
    .mentor-actions button {
        flex: 1;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
    }
    
            .mentor-actions button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            /* =============== ESTILOS SISTEMA DE VALORACIÓN =============== */
            .badge-verificado {
                background: #10b981;
                color: white;
                font-size: 0.7rem;
                padding: 2px 6px;
                border-radius: 12px;
                font-weight: 600;
                margin-left: 6px;
            }
            
            .review-count {
                color: #6b7280;
                font-size: 0.8rem;
                font-weight: normal;
            }
            
            .mentor-credencial {
                margin-top: 5px;
            }
            
            .mentor-credencial small {
                color: #059669;
                font-weight: 600;
                font-size: 0.75rem;
            }
            
            .mentor-testimonios {
                margin-bottom: 15px;
                padding: 12px;
                background: #f9fafb;
                border-radius: 10px;
                border-left: 3px solid #10b981;
            }
            
            .mentor-testimonios h5 {
                color: #333;
                margin: 0 0 10px 0;
                font-size: 0.85rem;
                font-weight: 600;
            }
            
            .testimonios-preview {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .testimonio-preview {
                background: white;
                padding: 8px;
                border-radius: 8px;
                border-left: 2px solid #10b981;
            }
            
            .testimonio-preview .testimonio-rating {
                color: #f59e0b;
                font-size: 0.7rem;
                margin-bottom: 4px;
            }
            
            .testimonio-preview p {
                margin: 0 0 4px 0;
                font-size: 0.8rem;
                color: #374151;
                line-height: 1.4;
            }
            
            .testimonio-preview small {
                color: #6b7280;
                font-size: 0.7rem;
                font-style: italic;
            }
            
            /* Estilos para modales de reseñas */
            .resenias-lista {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .resenia-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
            }
            
            .rating-star:hover {
                transform: scale(1.1);
            }
            
            /* Responsive para testimonios */
            @media (max-width: 768px) {
                .mentor-card {
                    margin-bottom: 20px;
                }
                
                .mentor-testimonios {
                    padding: 10px;
                }
                
                .testimonio-preview p {
                    font-size: 0.75rem;
                }
                
                .badge-verificado {
                    font-size: 0.6rem;
                    padding: 1px 4px;
                }
            }
            /* =============== FIN SISTEMA DE VALORACIÓN =============== */
    
    .modal {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0,0,0,0.7) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 999999 !important;
    }
    
    .modal-content {
        background: white;
        border-radius: 20px;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 30px;
        border-bottom: 2px solid #f0f0f0;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #333;
        font-size: 1.4rem;
    }
    
    .modal-body {
        padding: 25px 30px;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 1.8rem;
        color: #999;
        cursor: pointer;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .close-btn:hover {
        background: #f44336;
        color: white;
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @media (max-width: 768px) {
        .comunidad-wrapper {
            padding: 15px;
        }
        
        .comunidad-tabs {
            flex-wrap: wrap;
            gap: 5px !important;
        }
        
        .tab-btn {
            font-size: 0.9rem;
            padding: 12px 16px;
            flex: 1 1 calc(50% - 5px);
            min-width: calc(50% - 5px);
        }
        
        .modal-content {
            width: 95% !important;
            margin: 10px !important;
            padding: 0 !important;
        }
        
        .modal-header {
            padding: 15px 20px !important;
        }
        
        .modal-body {
            padding: 15px 20px !important;
        }
    }
</style>
`;

// Insertar estilos SOLO si document.head existe
if (document.head) {
    const styleElement = document.createElement('style');
    styleElement.textContent = estilosComunidad;
    document.head.appendChild(styleElement);
    console.log('✅ Estilos de comunidad insertados correctamente en <head>');
} else {
    // Esperar a que el head esté disponible
    const observer = new MutationObserver((mutations, obs) => {
        if (document.head) {
            const styleElement = document.createElement('style');
            styleElement.textContent = estilosComunidad;
            document.head.appendChild(styleElement);
            console.log('✅ Estilos de comunidad insertados (retry)');
            obs.disconnect();
        }
    });
    observer.observe(document.documentElement, { childList: true });
}

// Instancia global
const comunidadVendedores = new ComunidadVendedores();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComunidadVendedores;
}


