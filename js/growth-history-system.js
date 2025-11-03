// ===== SISTEMA DE HISTORIAL DE CRECIMIENTO =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

class GrowthHistorySystem {
    constructor() {
        this.historyData = {
            personal: [],
            empresarial: [],
            emocional: []
        };
        this.config = {
            tenant_id: null,
            plan: 'free'
        };
        this.init();
    }

    init() {
        this.loadConfig();
        this.loadHistoryData();
        this.createGrowthWidget();
    }

    // Cargar configuración
    loadConfig() {
        if (typeof TIENDA_CONFIG !== 'undefined') {
            this.config.tenant_id = TIENDA_CONFIG.slug;
        }
        
        if (typeof planSystem !== 'undefined') {
            this.config.plan = planSystem.currentPlan;
        }
    }

    // Cargar datos de historial
    loadHistoryData() {
        // Cargar desde localStorage o backend
        const savedData = localStorage.getItem(`growth_history_${this.config.tenant_id}`);
        if (savedData) {
            this.historyData = JSON.parse(savedData);
        } else {
            this.initializeDefaultData();
        }
    }

    // Inicializar datos por defecto
    initializeDefaultData() {
        const now = new Date();
        
        // Historial personal
        this.historyData.personal = [
            {
                id: 1,
                fecha: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                tipo: 'logro',
                titulo: 'Primer día en Cresalia',
                descripcion: 'Comenzaste tu viaje como emprendedor',
                emocion: 'emocionado',
                impacto: 'alto'
            },
            {
                id: 2,
                fecha: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                tipo: 'aprendizaje',
                titulo: 'Aprendiste sobre marketing digital',
                descripcion: 'Completaste el curso básico de marketing',
                emocion: 'satisfecho',
                impacto: 'medio'
            },
            {
                id: 3,
                fecha: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                tipo: 'desafio',
                titulo: 'Superaste el miedo a vender',
                descripcion: 'Enviaste tu primera propuesta comercial',
                emocion: 'orgulloso',
                impacto: 'alto'
            }
        ];

        // Historial empresarial
        this.historyData.empresarial = [
            {
                id: 1,
                fecha: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                tipo: 'hito',
                titulo: 'Primer producto agregado',
                descripcion: 'Subiste tu primer producto a la tienda',
                metricas: { productos: 1 },
                impacto: 'alto'
            },
            {
                id: 2,
                fecha: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                tipo: 'venta',
                titulo: 'Primera venta realizada',
                descripcion: '¡Tu primera venta! Un momento histórico',
                metricas: { ventas: 1, ingresos: 50 },
                impacto: 'alto'
            },
            {
                id: 3,
                fecha: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                tipo: 'crecimiento',
                titulo: 'Alcanzaste 10 productos',
                descripcion: 'Tu catálogo está creciendo',
                metricas: { productos: 10 },
                impacto: 'medio'
            }
        ];

        // Historial emocional
        this.historyData.emocional = [
            {
                id: 1,
                fecha: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
                emocion: 'nervioso',
                nivel: 7,
                descripcion: 'Primer día, muchos nervios pero mucha ilusión',
                contexto: 'inicio'
            },
            {
                id: 2,
                fecha: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                emocion: 'frustrado',
                nivel: 6,
                descripcion: 'Las ventas no llegaban, sentía que algo estaba mal',
                contexto: 'dificultad'
            },
            {
                id: 3,
                fecha: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
                emocion: 'esperanzado',
                nivel: 8,
                descripcion: 'Después de recibir apoyo, me siento más confiado',
                contexto: 'apoyo'
            }
        ];

        this.saveHistoryData();
    }

    // Guardar datos de historial
    saveHistoryData() {
        localStorage.setItem(`growth_history_${this.config.tenant_id}`, JSON.stringify(this.historyData));
    }

    // Crear widget de crecimiento
    createGrowthWidget() {
        const widgetHTML = `
            <div class="growth-history-widget" id="growthHistoryWidget">
                <button class="growth-history-toggle" onclick="growthHistory.toggle()">
                    <div class="growth-history-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="growth-history-text">
                        <span>📈 Mi Crecimiento</span>
                    </div>
                </button>
                
                <div class="growth-history-modal" id="growthHistoryModal">
                    <div class="growth-history-header">
                        <div class="growth-history-header-content">
                            <div class="growth-history-avatar">
                                <i class="fas fa-seedling"></i>
                            </div>
                            <div class="growth-history-header-info">
                                <h3>Tu Historia de Crecimiento</h3>
                                <span class="growth-history-status">Personal y Empresarial</span>
                            </div>
                        </div>
                        <button class="growth-history-close" onclick="growthHistory.toggle()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="growth-history-content" id="growthHistoryContent">
                        <!-- Contenido dinámico -->
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        this.loadInitialContent();
    }

    // Cargar contenido inicial
    loadInitialContent() {
        const content = document.getElementById('growthHistoryContent');
        if (!content) return;

        const stats = this.calculateStats();

        content.innerHTML = `
            <div class="growth-history-welcome">
                <div class="welcome-icon">
                    <i class="fas fa-seedling"></i>
                </div>
                <h4>Tu Viaje de Crecimiento</h4>
                <p>Ve cómo has evolucionado personal y empresarialmente</p>
                
                <div class="growth-stats">
                    <div class="growth-stat-card">
                        <div class="stat-icon personal">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="stat-info">
                            <h5>Personal</h5>
                            <span class="stat-number">${stats.personal.logros}</span>
                            <span class="stat-label">Logros</span>
                        </div>
                    </div>
                    
                    <div class="growth-stat-card">
                        <div class="stat-icon empresarial">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="stat-info">
                            <h5>Empresarial</h5>
                            <span class="stat-number">${stats.empresarial.ventas}</span>
                            <span class="stat-label">Ventas</span>
                        </div>
                    </div>
                    
                    <div class="growth-stat-card">
                        <div class="stat-icon emocional">
                            <i class="fas fa-heart"></i>
                        </div>
                        <div class="stat-info">
                            <h5>Emocional</h5>
                            <span class="stat-number">${stats.emocional.promedio}</span>
                            <span class="stat-label">Bienestar</span>
                        </div>
                    </div>
                </div>
                
                <div class="growth-actions">
                    <button class="growth-action-btn" onclick="growthHistory.showPersonalHistory()">
                        <i class="fas fa-user"></i>
                        Crecimiento Personal
                    </button>
                    <button class="growth-action-btn" onclick="growthHistory.showBusinessHistory()">
                        <i class="fas fa-building"></i>
                        Crecimiento Empresarial
                    </button>
                    <button class="growth-action-btn" onclick="growthHistory.showEmotionalHistory()">
                        <i class="fas fa-heart"></i>
                        Evolución Emocional
                    </button>
                    <button class="growth-action-btn" onclick="growthHistory.addNewMilestone()">
                        <i class="fas fa-plus"></i>
                        Agregar Hito
                    </button>
                </div>
            </div>
        `;
    }

    // Calcular estadísticas
    calculateStats() {
        const stats = {
            personal: {
                logros: this.historyData.personal.filter(h => h.tipo === 'logro').length,
                aprendizajes: this.historyData.personal.filter(h => h.tipo === 'aprendizaje').length,
                desafios: this.historyData.personal.filter(h => h.tipo === 'desafio').length
            },
            empresarial: {
                ventas: this.historyData.empresarial.filter(h => h.tipo === 'venta').length,
                hitos: this.historyData.empresarial.filter(h => h.tipo === 'hito').length,
                crecimiento: this.historyData.empresarial.filter(h => h.tipo === 'crecimiento').length
            },
            emocional: {
                promedio: Math.round(
                    this.historyData.emocional.reduce((sum, h) => sum + h.nivel, 0) / 
                    this.historyData.emocional.length
                ) || 0
            }
        };

        return stats;
    }

    // Mostrar historial personal
    showPersonalHistory() {
        const content = document.getElementById('growthHistoryContent');
        if (!content) return;

        content.innerHTML = `
            <div class="growth-history-section">
                <div class="section-header">
                    <h4><i class="fas fa-user"></i> Crecimiento Personal</h4>
                    <button class="btn-back" onclick="growthHistory.loadInitialContent()">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
                
                <div class="history-timeline">
                    ${this.historyData.personal.map(item => `
                        <div class="timeline-item ${item.tipo}">
                            <div class="timeline-marker">
                                <i class="fas fa-${this.getIconForType(item.tipo)}"></i>
                            </div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    <h5>${item.titulo}</h5>
                                    <span class="timeline-date">${this.formatDate(item.fecha)}</span>
                                </div>
                                <p>${item.descripcion}</p>
                                <div class="timeline-meta">
                                    <span class="emotion-badge ${item.emocion}">${item.emocion}</span>
                                    <span class="impact-badge ${item.impacto}">${item.impacto}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Mostrar historial empresarial
    showBusinessHistory() {
        const content = document.getElementById('growthHistoryContent');
        if (!content) return;

        content.innerHTML = `
            <div class="growth-history-section">
                <div class="section-header">
                    <h4><i class="fas fa-building"></i> Crecimiento Empresarial</h4>
                    <button class="btn-back" onclick="growthHistory.loadInitialContent()">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
                
                <div class="history-timeline">
                    ${this.historyData.empresarial.map(item => `
                        <div class="timeline-item ${item.tipo}">
                            <div class="timeline-marker">
                                <i class="fas fa-${this.getIconForType(item.tipo)}"></i>
                            </div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    <h5>${item.titulo}</h5>
                                    <span class="timeline-date">${this.formatDate(item.fecha)}</span>
                                </div>
                                <p>${item.descripcion}</p>
                                ${item.metricas ? `
                                    <div class="timeline-metrics">
                                        ${Object.entries(item.metricas).map(([key, value]) => `
                                            <span class="metric-badge">${key}: ${value}</span>
                                        `).join('')}
                                    </div>
                                ` : ''}
                                <div class="timeline-meta">
                                    <span class="impact-badge ${item.impacto}">${item.impacto}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Mostrar historial emocional
    showEmotionalHistory() {
        const content = document.getElementById('growthHistoryContent');
        if (!content) return;

        content.innerHTML = `
            <div class="growth-history-section">
                <div class="section-header">
                    <h4><i class="fas fa-heart"></i> Evolución Emocional</h4>
                    <button class="btn-back" onclick="growthHistory.loadInitialContent()">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
                
                <div class="emotional-chart">
                    <canvas id="emotionalChart" width="400" height="200"></canvas>
                </div>
                
                <div class="history-timeline">
                    ${this.historyData.emocional.map(item => `
                        <div class="timeline-item emocional">
                            <div class="timeline-marker">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    <h5>${item.emocion}</h5>
                                    <span class="timeline-date">${this.formatDate(item.fecha)}</span>
                                </div>
                                <p>${item.descripcion}</p>
                                <div class="timeline-meta">
                                    <span class="emotion-level">Nivel: ${item.nivel}/10</span>
                                    <span class="context-badge">${item.contexto}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Agregar nuevo hito
    addNewMilestone() {
        const content = document.getElementById('growthHistoryContent');
        if (!content) return;

        content.innerHTML = `
            <div class="add-milestone-section">
                <div class="section-header">
                    <h4><i class="fas fa-plus"></i> Agregar Nuevo Hito</h4>
                    <button class="btn-back" onclick="growthHistory.loadInitialContent()">
                        <i class="fas fa-arrow-left"></i> Volver
                    </button>
                </div>
                
                <form id="milestoneForm" onsubmit="growthHistory.saveMilestone(event)">
                    <div class="form-group">
                        <label for="milestoneType">Tipo de Hito</label>
                        <select id="milestoneType" required>
                            <option value="">Selecciona el tipo</option>
                            <option value="personal">Personal</option>
                            <option value="empresarial">Empresarial</option>
                            <option value="emocional">Emocional</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="milestoneTitle">Título</label>
                        <input type="text" id="milestoneTitle" required placeholder="Ej: Primera venta del mes">
                    </div>
                    
                    <div class="form-group">
                        <label for="milestoneDescription">Descripción</label>
                        <textarea id="milestoneDescription" rows="3" required placeholder="Describe qué pasó y cómo te sentiste..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="milestoneEmotion">Emoción</label>
                        <select id="milestoneEmotion">
                            <option value="feliz">Feliz</option>
                            <option value="orgulloso">Orgulloso</option>
                            <option value="satisfecho">Satisfecho</option>
                            <option value="emocionado">Emocionado</option>
                            <option value="esperanzado">Esperanzado</option>
                            <option value="nervioso">Nervioso</option>
                            <option value="frustrado">Frustrado</option>
                            <option value="preocupado">Preocupado</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="milestoneImpact">Impacto</label>
                        <select id="milestoneImpact" required>
                            <option value="alto">Alto</option>
                            <option value="medio">Medio</option>
                            <option value="bajo">Bajo</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-cancel" onclick="growthHistory.loadInitialContent()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="submit" class="btn-save">
                            <i class="fas fa-save"></i> Guardar Hito
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    // Guardar nuevo hito
    saveMilestone(event) {
        event.preventDefault();
        
        const type = document.getElementById('milestoneType').value;
        const title = document.getElementById('milestoneTitle').value;
        const description = document.getElementById('milestoneDescription').value;
        const emotion = document.getElementById('milestoneEmotion').value;
        const impact = document.getElementById('milestoneImpact').value;
        
        const newMilestone = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            titulo: title,
            descripcion: description,
            emocion: emotion,
            impacto: impact,
            tipo: type === 'personal' ? 'logro' : type === 'empresarial' ? 'hito' : 'emocional'
        };
        
        if (type === 'personal') {
            this.historyData.personal.unshift(newMilestone);
        } else if (type === 'empresarial') {
            this.historyData.empresarial.unshift(newMilestone);
        } else if (type === 'emocional') {
            this.historyData.emocional.unshift({
                ...newMilestone,
                nivel: this.getEmotionLevel(emotion),
                contexto: 'logro'
            });
        }
        
        this.saveHistoryData();
        this.loadInitialContent();
        
        if (typeof elegantNotifications !== 'undefined') {
            elegantNotifications.success('Hito guardado exitosamente', 'Crecimiento');
        }
    }

    // Obtener nivel de emoción
    getEmotionLevel(emotion) {
        const levels = {
            'feliz': 9,
            'orgulloso': 8,
            'satisfecho': 7,
            'emocionado': 8,
            'esperanzado': 7,
            'nervioso': 5,
            'frustrado': 4,
            'preocupado': 4
        };
        return levels[emotion] || 5;
    }

    // Obtener icono por tipo
    getIconForType(type) {
        const icons = {
            'logro': 'trophy',
            'aprendizaje': 'graduation-cap',
            'desafio': 'mountain',
            'hito': 'flag-checkered',
            'venta': 'dollar-sign',
            'crecimiento': 'chart-line',
            'emocional': 'heart'
        };
        return icons[type] || 'star';
    }

    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    // Alternar widget
    toggle() {
        const modal = document.getElementById('growthHistoryModal');
        if (modal) {
            modal.classList.toggle('active');
        }
    }

    // Vincular eventos
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('growthHistoryModal');
                if (modal && modal.classList.contains('active')) {
                    this.toggle();
                }
            }
        });
    }
}

// Instancia global
const growthHistory = new GrowthHistorySystem();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GrowthHistorySystem;
}























