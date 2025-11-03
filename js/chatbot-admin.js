// ===== PANEL DE ADMINISTRACIÓN DEL CHATBOT IA =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

class ChatbotAdmin {
    constructor() {
        this.config = {
            nombre: 'Cresalia AI',
            avatar: 'fas fa-brain',
            color_primario: '#7C3AED',
            color_secundario: '#A78BFA',
            tono: 'amigable',
            mensaje_bienvenida: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?',
            activo: false
        };
        this.knowledgeBase = [];
        this.init();
    }

    init() {
        this.loadConfig();
        this.createAdminPanel();
        this.bindEvents();
    }

    // Cargar configuración
    loadConfig() {
        const savedConfig = localStorage.getItem('chatbot_config');
        if (savedConfig) {
            this.config = { ...this.config, ...JSON.parse(savedConfig) };
        }

        const savedKB = localStorage.getItem('chatbot_knowledge_base');
        if (savedKB) {
            this.knowledgeBase = JSON.parse(savedKB);
        }
    }

    // Crear panel de administración
    createAdminPanel() {
        const panelHTML = `
            <div class="chatbot-admin-panel" id="chatbotAdminPanel" style="display: none;">
                <div class="chatbot-admin-header">
                    <h3><i class="fas fa-robot"></i> Configuración del Chatbot IA</h3>
                    <button class="chatbot-admin-close" onclick="chatbotAdmin.close()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chatbot-admin-content">
                    <!-- Configuración Básica -->
                    <div class="admin-section">
                        <h4><i class="fas fa-cog"></i> Configuración Básica</h4>
                        
                        <div class="form-group">
                            <label for="chatbotNombre">Nombre del Chatbot</label>
                            <input type="text" id="chatbotNombre" value="${this.config.nombre}" placeholder="Ej: Mi Asistente Virtual">
                        </div>
                        
                        <div class="form-group">
                            <label for="chatbotAvatar">Icono del Avatar</label>
                            <select id="chatbotAvatar">
                                <option value="fas fa-brain" ${this.config.avatar === 'fas fa-brain' ? 'selected' : ''}>🧠 Cerebro</option>
                                <option value="fas fa-robot" ${this.config.avatar === 'fas fa-robot' ? 'selected' : ''}>🤖 Robot</option>
                                <option value="fas fa-comments" ${this.config.avatar === 'fas fa-comments' ? 'selected' : ''}>💬 Chat</option>
                                <option value="fas fa-magic" ${this.config.avatar === 'fas fa-magic' ? 'selected' : ''}>✨ Magia</option>
                                <option value="fas fa-star" ${this.config.avatar === 'fas fa-star' ? 'selected' : ''}>⭐ Estrella</option>
                                <option value="fas fa-heart" ${this.config.avatar === 'fas fa-heart' ? 'selected' : ''}>❤️ Corazón</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="chatbotTono">Tono de Conversación</label>
                            <select id="chatbotTono">
                                <option value="amigable" ${this.config.tono === 'amigable' ? 'selected' : ''}>Amigable y Cercano</option>
                                <option value="profesional" ${this.config.tono === 'profesional' ? 'selected' : ''}>Profesional y Formal</option>
                                <option value="casual" ${this.config.tono === 'casual' ? 'selected' : ''}>Casual y Relajado</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="chatbotBienvenida">Mensaje de Bienvenida</label>
                            <textarea id="chatbotBienvenida" rows="3" placeholder="Mensaje que aparecerá cuando alguien abra el chat">${this.config.mensaje_bienvenida}</textarea>
                        </div>
                    </div>
                    
                    <!-- Colores -->
                    <div class="admin-section">
                        <h4><i class="fas fa-palette"></i> Personalización de Colores</h4>
                        
                        <div class="color-group">
                            <div class="form-group">
                                <label for="chatbotColorPrimario">Color Primario</label>
                                <div class="color-input-group">
                                    <input type="color" id="chatbotColorPrimario" value="${this.config.color_primario}">
                                    <input type="text" id="chatbotColorPrimarioText" value="${this.config.color_primario}" placeholder="#7C3AED">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="chatbotColorSecundario">Color Secundario</label>
                                <div class="color-input-group">
                                    <input type="color" id="chatbotColorSecundario" value="${this.config.color_secundario}">
                                    <input type="text" id="chatbotColorSecundarioText" value="${this.config.color_secundario}" placeholder="#A78BFA">
                                </div>
                            </div>
                        </div>
                        
                        <div class="color-preview">
                            <div class="preview-chatbot" style="background: linear-gradient(135deg, ${this.config.color_primario}, ${this.config.color_secundario});">
                                <i class="${this.config.avatar}"></i>
                                <span>${this.config.nombre}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Base de Conocimiento -->
                    <div class="admin-section">
                        <h4><i class="fas fa-brain"></i> Base de Conocimiento</h4>
                        <p class="section-description">Agrega preguntas y respuestas personalizadas para tu tienda</p>
                        
                        <div class="knowledge-form">
                            <div class="form-group">
                                <label for="nuevaPregunta">Pregunta</label>
                                <input type="text" id="nuevaPregunta" placeholder="¿Cuáles son sus horarios de atención?">
                            </div>
                            
                            <div class="form-group">
                                <label for="nuevaRespuesta">Respuesta</label>
                                <textarea id="nuevaRespuesta" rows="3" placeholder="Nuestros horarios son de lunes a viernes de 9:00 a 18:00..."></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label for="nuevaCategoria">Categoría</label>
                                <select id="nuevaCategoria">
                                    <option value="general">General</option>
                                    <option value="productos">Productos</option>
                                    <option value="pagos">Pagos</option>
                                    <option value="envios">Envíos</option>
                                    <option value="horarios">Horarios</option>
                                    <option value="garantia">Garantía</option>
                                    <option value="contacto">Contacto</option>
                                </select>
                            </div>
                            
                            <button class="btn-add-knowledge" onclick="chatbotAdmin.addKnowledge()">
                                <i class="fas fa-plus"></i> Agregar Conocimiento
                            </button>
                        </div>
                        
                        <div class="knowledge-list">
                            <h5>Conocimiento Actual</h5>
                            <div id="knowledgeItems">
                                ${this.renderKnowledgeItems()}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Acciones -->
                    <div class="admin-actions">
                        <button class="btn-save" onclick="chatbotAdmin.save()">
                            <i class="fas fa-save"></i> Guardar Configuración
                        </button>
                        <button class="btn-test" onclick="chatbotAdmin.test()">
                            <i class="fas fa-play"></i> Probar Chatbot
                        </button>
                        <button class="btn-reset" onclick="chatbotAdmin.reset()">
                            <i class="fas fa-undo"></i> Restaurar por Defecto
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', panelHTML);
    }

    // Renderizar items de conocimiento
    renderKnowledgeItems() {
        if (this.knowledgeBase.length === 0) {
            return '<p class="no-knowledge">No hay conocimiento personalizado agregado.</p>';
        }

        return this.knowledgeBase.map((item, index) => `
            <div class="knowledge-item">
                <div class="knowledge-content">
                    <div class="knowledge-question">
                        <strong>P:</strong> ${item.pregunta}
                    </div>
                    <div class="knowledge-answer">
                        <strong>R:</strong> ${item.respuesta}
                    </div>
                    <div class="knowledge-category">
                        <span class="category-badge">${item.categoria}</span>
                    </div>
                </div>
                <div class="knowledge-actions">
                    <button class="btn-edit" onclick="chatbotAdmin.editKnowledge(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="chatbotAdmin.deleteKnowledge(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Vincular eventos
    bindEvents() {
        // Sincronizar inputs de color
        document.addEventListener('input', (e) => {
            if (e.target.id === 'chatbotColorPrimario') {
                document.getElementById('chatbotColorPrimarioText').value = e.target.value;
                this.updatePreview();
            } else if (e.target.id === 'chatbotColorPrimarioText') {
                document.getElementById('chatbotColorPrimario').value = e.target.value;
                this.updatePreview();
            } else if (e.target.id === 'chatbotColorSecundario') {
                document.getElementById('chatbotColorSecundarioText').value = e.target.value;
                this.updatePreview();
            } else if (e.target.id === 'chatbotColorSecundarioText') {
                document.getElementById('chatbotColorSecundario').value = e.target.value;
                this.updatePreview();
            }
        });

        // Actualizar preview en tiempo real
        document.addEventListener('input', (e) => {
            if (e.target.id.startsWith('chatbot')) {
                this.updatePreview();
            }
        });
    }

    // Actualizar preview
    updatePreview() {
        const nombre = document.getElementById('chatbotNombre').value || this.config.nombre;
        const avatar = document.getElementById('chatbotAvatar').value || this.config.avatar;
        const colorPrimario = document.getElementById('chatbotColorPrimario').value || this.config.color_primario;
        const colorSecundario = document.getElementById('chatbotColorSecundario').value || this.config.color_secundario;

        const preview = document.querySelector('.preview-chatbot');
        if (preview) {
            preview.style.background = `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`;
            preview.innerHTML = `<i class="${avatar}"></i><span>${nombre}</span>`;
        }
    }

    // Mostrar panel
    show() {
        const panel = document.getElementById('chatbotAdminPanel');
        if (panel) {
            panel.style.display = 'block';
            setTimeout(() => {
                panel.classList.add('show');
            }, 10);
        }
    }

    // Cerrar panel
    close() {
        const panel = document.getElementById('chatbotAdminPanel');
        if (panel) {
            panel.classList.remove('show');
            setTimeout(() => {
                panel.style.display = 'none';
            }, 300);
        }
    }

    // Agregar conocimiento
    addKnowledge() {
        const pregunta = document.getElementById('nuevaPregunta').value.trim();
        const respuesta = document.getElementById('nuevaRespuesta').value.trim();
        const categoria = document.getElementById('nuevaCategoria').value;

        if (!pregunta || !respuesta) {
            elegantNotifications.warning('Por favor completa todos los campos', 'Campos Requeridos');
            return;
        }

        this.knowledgeBase.push({ pregunta, respuesta, categoria });
        this.updateKnowledgeList();

        // Limpiar formulario
        document.getElementById('nuevaPregunta').value = '';
        document.getElementById('nuevaRespuesta').value = '';
        document.getElementById('nuevaCategoria').value = 'general';

        elegantNotifications.success('Conocimiento agregado exitosamente', 'Base de Conocimiento');
    }

    // Editar conocimiento
    editKnowledge(index) {
        const item = this.knowledgeBase[index];
        
        document.getElementById('nuevaPregunta').value = item.pregunta;
        document.getElementById('nuevaRespuesta').value = item.respuesta;
        document.getElementById('nuevaCategoria').value = item.categoria;

        // Eliminar el item actual
        this.deleteKnowledge(index);
    }

    // Eliminar conocimiento
    deleteKnowledge(index) {
        this.knowledgeBase.splice(index, 1);
        this.updateKnowledgeList();
        elegantNotifications.info('Conocimiento eliminado', 'Base de Conocimiento');
    }

    // Actualizar lista de conocimiento
    updateKnowledgeList() {
        const container = document.getElementById('knowledgeItems');
        if (container) {
            container.innerHTML = this.renderKnowledgeItems();
        }
    }

    // Guardar configuración
    save() {
        // Recopilar datos del formulario
        this.config = {
            nombre: document.getElementById('chatbotNombre').value,
            avatar: document.getElementById('chatbotAvatar').value,
            color_primario: document.getElementById('chatbotColorPrimario').value,
            color_secundario: document.getElementById('chatbotColorSecundario').value,
            tono: document.getElementById('chatbotTono').value,
            mensaje_bienvenida: document.getElementById('chatbotBienvenida').value,
            activo: true
        };

        // Guardar en localStorage
        localStorage.setItem('chatbot_config', JSON.stringify(this.config));
        localStorage.setItem('chatbot_knowledge_base', JSON.stringify(this.knowledgeBase));

        // Actualizar chatbot si existe
        if (typeof chatbotIA !== 'undefined') {
            chatbotIA.configure(this.config);
            chatbotIA.knowledgeBase = [...this.knowledgeBase];
        }

        elegantNotifications.success('Configuración del chatbot guardada exitosamente', 'Chatbot IA');
        this.close();
    }

    // Probar chatbot
    test() {
        this.save();
        
        // Mostrar chatbot si no está visible
        if (typeof chatbotIA !== 'undefined') {
            if (!chatbotIA.isOpen) {
                chatbotIA.toggle();
            }
        }

        elegantNotifications.info('Chatbot actualizado. Puedes probarlo ahora.', 'Prueba del Chatbot');
    }

    // Restaurar por defecto
    reset() {
        if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto? Se perderán todos los cambios.')) {
            this.config = {
                nombre: 'Cresalia AI',
                avatar: 'fas fa-brain',
                color_primario: '#7C3AED',
                color_secundario: '#A78BFA',
                tono: 'amigable',
                mensaje_bienvenida: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?',
                activo: false
            };
            
            this.knowledgeBase = [];
            
            // Limpiar localStorage
            localStorage.removeItem('chatbot_config');
            localStorage.removeItem('chatbot_knowledge_base');
            
            // Recargar panel
            document.getElementById('chatbotAdminPanel').remove();
            this.createAdminPanel();
            
            elegantNotifications.success('Configuración restaurada por defecto', 'Chatbot IA');
        }
    }
}

// Instancia global
const chatbotAdmin = new ChatbotAdmin();

// Función para mostrar el panel de administración
function mostrarConfiguracionChatbot() {
    // Verificar si el plan permite chatbot IA
    if (typeof planSystem !== 'undefined' && !planSystem.isFeatureAvailable('chatbot_ia')) {
        planSystem.showUpgradeModal('chatbot_ia');
        return;
    }
    
    chatbotAdmin.show();
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotAdmin;
}























