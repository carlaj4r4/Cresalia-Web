/**
 * Sistema de Mensajes Motivacionales y Apoyo Emocional - Cresalia-Web
 * Detecta el rendimiento de la tienda y ofrece mensajes de aliento personalizados
 */

class MotivationalAnalytics {
    constructor(storeAnalytics) {
        this.storeAnalytics = storeAnalytics;
        this.performanceLevels = {
            EXCELLENT: 'excellent',
            GOOD: 'good',
            REGULAR: 'regular',
            LOW: 'low',
            CRITICAL: 'critical'
        };
        this.currentLanguage = 'es';
        this.messages = this.initializeMessages();
        this.currentPerformance = null;
        this.lastMessageShown = null;
    }

    // ===== GESTIÓN DE IDIOMAS =====
    getCurrentLanguage() {
        // Intentar detectar desde el sistema de i18n
        if (window.i18n && window.i18n.currentLanguage) {
            return window.i18n.currentLanguage;
        }
        
        // Intentar detectar desde localStorage
        const stored = localStorage.getItem('cresalia_language');
        if (stored) {
            return stored;
        }
        
        // Detectar desde el navegador
        const browserLang = navigator.language.split('-')[0];
        const supportedLangs = ['es', 'en', 'pt', 'fr', 'de', 'it'];
        
        return supportedLangs.includes(browserLang) ? browserLang : 'es';
    }

    setLanguage(language) {
        this.currentLanguage = language;
        this.messages = this.initializeMessages();
        this.updateMotivationalDisplay();
    }

    // ===== INICIALIZACIÓN DE MENSAJES =====
    initializeMessages() {
        const lang = this.getCurrentLanguage();
        
        return {
            [this.performanceLevels.EXCELLENT]: {
                title: getMotivationalTranslation(lang, 'excellent', 'title'),
                message: getMotivationalTranslation(lang, 'excellent', 'message'),
                color: "#10B981",
                icon: "fas fa-rocket",
                suggestions: getMotivationalTranslation(lang, 'excellent', 'suggestions'),
                emotionalSupport: false
            },
            [this.performanceLevels.GOOD]: {
                title: getMotivationalTranslation(lang, 'good', 'title'),
                message: getMotivationalTranslation(lang, 'good', 'message'),
                color: "#3B82F6",
                icon: "fas fa-thumbs-up",
                suggestions: getMotivationalTranslation(lang, 'good', 'suggestions'),
                emotionalSupport: false
            },
            [this.performanceLevels.REGULAR]: {
                title: getMotivationalTranslation(lang, 'regular', 'title'),
                message: getMotivationalTranslation(lang, 'regular', 'message'),
                color: "#F59E0B",
                icon: "fas fa-heart",
                suggestions: getMotivationalTranslation(lang, 'regular', 'suggestions'),
                emotionalSupport: true,
                emotionalMessage: getMotivationalTranslation(lang, 'regular', 'emotionalMessage')
            },
            [this.performanceLevels.LOW]: {
                title: getMotivationalTranslation(lang, 'low', 'title'),
                message: getMotivationalTranslation(lang, 'low', 'message'),
                color: "#EF4444",
                icon: "fas fa-seedling",
                suggestions: getMotivationalTranslation(lang, 'low', 'suggestions'),
                emotionalSupport: true,
                emotionalMessage: getMotivationalTranslation(lang, 'low', 'emotionalMessage')
            },
            [this.performanceLevels.CRITICAL]: {
                title: getMotivationalTranslation(lang, 'critical', 'title'),
                message: getMotivationalTranslation(lang, 'critical', 'message'),
                color: "#EC4899",
                icon: "fas fa-hands-helping",
                suggestions: getMotivationalTranslation(lang, 'critical', 'suggestions'),
                emotionalSupport: true,
                emotionalMessage: getMotivationalTranslation(lang, 'critical', 'emotionalMessage')
            }
        };
    }

    // ===== ANÁLISIS DE RENDIMIENTO =====
    analyzePerformance() {
        if (!this.storeAnalytics || !this.storeAnalytics.initialized) {
            return this.performanceLevels.REGULAR;
        }

        const metrics = this.calculatePerformanceMetrics();
        return this.determinePerformanceLevel(metrics);
    }

    calculatePerformanceMetrics() {
        const sales = this.storeAnalytics.getTotalSales();
        const customers = this.storeAnalytics.getTotalCustomers();
        const orders = this.storeAnalytics.getTotalOrders();
        const responseRate = parseFloat(this.storeAnalytics.getResponseRate());
        const visits = this.storeAnalytics.getTotalVisits();
        const productViews = this.storeAnalytics.getTotalProductViews();

        // Calcular scores individuales
        const salesScore = this.calculateSalesScore(sales);
        const customerScore = this.calculateCustomerScore(customers);
        const engagementScore = this.calculateEngagementScore(responseRate, visits, productViews);
        const conversionScore = this.calculateConversionScore(orders, visits);

        return {
            sales: salesScore,
            customers: customerScore,
            engagement: engagementScore,
            conversion: conversionScore,
            overall: (salesScore + customerScore + engagementScore + conversionScore) / 4
        };
    }

    calculateSalesScore(sales) {
        if (sales >= 10000) return 100;
        if (sales >= 5000) return 80;
        if (sales >= 2000) return 60;
        if (sales >= 1000) return 40;
        if (sales >= 500) return 20;
        return 10;
    }

    calculateCustomerScore(customers) {
        if (customers >= 200) return 100;
        if (customers >= 100) return 80;
        if (customers >= 50) return 60;
        if (customers >= 20) return 40;
        if (customers >= 10) return 20;
        return 10;
    }

    calculateEngagementScore(responseRate, visits, productViews) {
        const responseScore = Math.min(responseRate * 2, 100); // Max 100
        const visitScore = Math.min(visits / 50, 100); // 5000 visits = 100
        const viewScore = Math.min(productViews / 100, 100); // 10000 views = 100
        
        return (responseScore + visitScore + viewScore) / 3;
    }

    calculateConversionScore(orders, visits) {
        if (visits === 0) return 0;
        const conversionRate = (orders / visits) * 100;
        return Math.min(conversionRate * 10, 100); // 10% conversion = 100
    }

    determinePerformanceLevel(metrics) {
        const overall = metrics.overall;
        
        if (overall >= 80) return this.performanceLevels.EXCELLENT;
        if (overall >= 60) return this.performanceLevels.GOOD;
        if (overall >= 40) return this.performanceLevels.REGULAR;
        if (overall >= 20) return this.performanceLevels.LOW;
        return this.performanceLevels.CRITICAL;
    }

    // ===== GENERACIÓN DE MENSAJES =====
    generateMotivationalMessage() {
        const performance = this.analyzePerformance();
        const messageData = this.messages[performance];
        
        if (!messageData) {
            return this.getDefaultMessage();
        }

        // Evitar mostrar el mismo mensaje consecutivamente
        if (this.lastMessageShown === performance) {
            return this.getVariationMessage(performance);
        }

        this.lastMessageShown = performance;
        this.currentPerformance = performance;

        return {
            ...messageData,
            performance: performance,
            timestamp: new Date().toISOString()
        };
    }

    getVariationMessage(performance) {
        const variations = {
            [this.performanceLevels.EXCELLENT]: [
                {
                    title: "¡Eres una estrella! ⭐",
                    message: "Sigue brillando, tu tienda es un ejemplo de éxito. ¡Eres inspiración para otros emprendedores!",
                    color: "#10B981",
                    icon: "fas fa-star"
                },
                {
                    title: "¡Increíble trabajo! 🎉",
                    message: "Tu dedicación y esfuerzo se están viendo reflejados en estos resultados. ¡Sigue así!",
                    color: "#10B981",
                    icon: "fas fa-trophy"
                }
            ],
            [this.performanceLevels.GOOD]: [
                {
                    title: "¡Vas por buen camino! 🛤️",
                    message: "Tu constancia está dando frutos. ¡Mantén el ritmo y verás aún mejores resultados!",
                    color: "#3B82F6",
                    icon: "fas fa-road"
                }
            ],
            [this.performanceLevels.REGULAR]: [
                {
                    title: "Cada día es una oportunidad 🌅",
                    message: "Los emprendedores exitosos no se rinden en los momentos difíciles. ¡Tú puedes superar esto!",
                    color: "#F59E0B",
                    icon: "fas fa-sun"
                }
            ],
            [this.performanceLevels.LOW]: [
                {
                    title: "Los obstáculos son escalones 🪜",
                    message: "Cada dificultad te está preparando para el éxito. ¡Confía en tu proceso!",
                    color: "#EF4444",
                    icon: "fas fa-ladder"
                }
            ],
            [this.performanceLevels.CRITICAL]: [
                {
                    title: "No estás sola en esto 🤝",
                    message: "Recuerda: detrás de cada gran éxito hay una historia de perseverancia. ¡Estamos aquí para apoyarte!",
                    color: "#EC4899",
                    icon: "fas fa-heart"
                }
            ]
        };

        const performanceVariations = variations[performance] || [];
        if (performanceVariations.length === 0) {
            return this.getDefaultMessage();
        }

        const randomVariation = performanceVariations[Math.floor(Math.random() * performanceVariations.length)];
        return {
            ...this.messages[performance],
            ...randomVariation,
            performance: performance,
            timestamp: new Date().toISOString()
        };
    }

    getDefaultMessage() {
        return {
            title: "Sigue adelante 💜",
            message: "Cada día es una nueva oportunidad para crecer. ¡Tú puedes lograrlo!",
            color: "#7C3AED",
            icon: "fas fa-heart",
            performance: this.performanceLevels.REGULAR,
            emotionalSupport: true,
            emotionalMessage: "¿Cómo te sientes hoy? Recuerda que es normal tener altibajos en el emprendimiento. Puedes acceder a tu diario emocional o dejarme un mensaje si necesitas apoyo."
        };
    }

    // ===== MENSAJES ESPECÍFICOS POR MÉTRICA =====
    generateMetricSpecificMessage(metricType, value, trend) {
        const messages = {
            sales: {
                high: "¡Tus ventas están excelentes! 🎉",
                medium: "Tus ventas van bien, pero hay margen de mejora 💪",
                low: "Las ventas pueden mejorar, pero no te desanimes 🌱"
            },
            customers: {
                high: "¡Tienes una base de clientes increíble! 👥",
                medium: "Tu base de clientes está creciendo constantemente 📈",
                low: "Es momento de enfocarse en atraer más clientes 🎯"
            },
            engagement: {
                high: "¡Tu engagement es fantástico! 💬",
                medium: "Tu comunicación con clientes va bien 💜",
                low: "Podrías mejorar la comunicación con tus clientes 🤝"
            }
        };

        const metricMessages = messages[metricType];
        if (!metricMessages) return null;

        let level = 'medium';
        if (trend === 'up' && value > 70) level = 'high';
        if (trend === 'down' || value < 30) level = 'low';

        return metricMessages[level];
    }

    // ===== SUGERENCIAS PERSONALIZADAS =====
    generatePersonalizedSuggestions() {
        const performance = this.currentPerformance || this.analyzePerformance();
        const metrics = this.calculatePerformanceMetrics();
        
        const suggestions = [];

        // Sugerencias basadas en métricas específicas
        if (metrics.sales < 40) {
            suggestions.push({
                type: 'sales',
                title: 'Mejora tus ventas',
                message: 'Considera hacer una promoción especial o revisar tus precios',
                action: 'Crear oferta especial',
                icon: 'fas fa-tag'
            });
        }

        if (metrics.engagement < 40) {
            suggestions.push({
                type: 'engagement',
                title: 'Mejora tu comunicación',
                message: 'Responde más rápido a los mensajes y sé más proactiva',
                action: 'Revisar mensajes',
                icon: 'fas fa-comments'
            });
        }

        if (metrics.customers < 40) {
            suggestions.push({
                type: 'customers',
                title: 'Atrae más clientes',
                message: 'Considera hacer marketing en redes sociales o crear contenido',
                action: 'Crear campaña',
                icon: 'fas fa-bullhorn'
            });
        }

        // Sugerencias basadas en rendimiento general
        if (performance === this.performanceLevels.CRITICAL) {
            suggestions.push({
                type: 'support',
                title: 'Busca apoyo',
                message: 'No tienes que enfrentar esto sola. Puedes acceder a tu diario emocional o dejarme un mensaje',
                action: 'Buscar apoyo',
                icon: 'fas fa-heart'
            });
        }

        return suggestions;
    }

    // ===== INTEGRACIÓN CON DIARIO EMOCIONAL =====
    generateEmotionalSupportMessage() {
        const performance = this.currentPerformance || this.analyzePerformance();
        
        if (!this.messages[performance].emotionalSupport) {
            return null;
        }

        return {
            title: "¿Cómo te sientes? 💜",
            message: this.messages[performance].emotionalMessage,
            actions: [
                {
                    text: "Abrir Diario Emocional",
                    action: "openEmotionalDiary",
                    icon: "fas fa-book-heart",
                    color: "#EC4899"
                },
                {
                    text: "Dejar Mensaje a Carla",
                    action: "showResourceSelector",
                    icon: "fas fa-envelope",
                    color: "#7C3AED"
                }
            ]
        };
    }

    // ===== ACTUALIZACIÓN DE UI =====
    updateMotivationalDisplay() {
        const message = this.generateMotivationalMessage();
        this.displayMotivationalMessage(message);
        
        const emotionalSupport = this.generateEmotionalSupportMessage();
        if (emotionalSupport) {
            this.displayEmotionalSupport(emotionalSupport);
        }

        const suggestions = this.generatePersonalizedSuggestions();
        this.displaySuggestions(suggestions);
    }

    displayMotivationalMessage(message) {
        const container = document.getElementById('motivationalMessage');
        if (!container) return;

        const html = `
            <div class="motivational-card" style="border-left: 4px solid ${message.color}">
                <div class="motivational-header">
                    <div class="motivational-icon" style="color: ${message.color}">
                        <i class="${message.icon}"></i>
                    </div>
                    <div class="motivational-content">
                        <h3 class="motivational-title">${message.title}</h3>
                        <p class="motivational-message">${message.message}</p>
                    </div>
                </div>
                ${message.suggestions ? `
                    <div class="motivational-suggestions">
                        <h4>Sugerencias:</h4>
                        <ul>
                            ${message.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        container.innerHTML = html;
    }

    displayEmotionalSupport(support) {
        const container = document.getElementById('emotionalSupport');
        if (!container) return;

        const html = `
            <div class="emotional-support-card">
                <div class="emotional-support-header">
                    <div class="emotional-support-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="emotional-support-content">
                        <h3 class="emotional-support-title">${support.title}</h3>
                        <p class="emotional-support-message">${support.message}</p>
                    </div>
                </div>
                <div class="emotional-support-actions">
                    ${support.actions.map(action => `
                        <button class="emotional-support-btn" 
                                style="background: ${action.color}"
                                onclick="handleEmotionalSupportAction('${action.action}')">
                            <i class="${action.icon}"></i>
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    displaySuggestions(suggestions) {
        const container = document.getElementById('personalizedSuggestions');
        if (!container) return;

        if (suggestions.length === 0) {
            container.innerHTML = '<p class="no-suggestions">¡Todo va bien! No hay sugerencias específicas en este momento.</p>';
            return;
        }

        const html = `
            <div class="suggestions-grid">
                ${suggestions.map(suggestion => `
                    <div class="suggestion-card">
                        <div class="suggestion-icon">
                            <i class="${suggestion.icon}"></i>
                        </div>
                        <div class="suggestion-content">
                            <h4 class="suggestion-title">${suggestion.title}</h4>
                            <p class="suggestion-message">${suggestion.message}</p>
                            <button class="suggestion-action" onclick="handleSuggestionAction('${suggestion.action}')">
                                ${suggestion.action}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;
    }

    // ===== MANEJO DE ACCIONES =====
    handleEmotionalSupportAction(action) {
        switch (action) {
            case 'openEmotionalDiary':
                this.openEmotionalDiary();
                break;
            case 'showResourceSelector':
                this.showResourceSelector();
                break;
            case 'sendMessageToCarla':
                this.sendMessageToCarla();
                break;
            case 'viewSupportResources':
                this.viewSupportResources();
                break;
        }
    }

    openEmotionalDiary() {
        // Abrir diario emocional
        window.open('../../carla-respaldo-emocional.html', '_blank');
        this.showNotification('Diario emocional abierto', 'success');
    }

    showResourceSelector() {
        // Mostrar selector de recursos
        const modal = this.createResourceSelectorModal();
        document.body.appendChild(modal);
    }

    sendMessageToCarla() {
        // Abrir formulario para enviar mensaje a Carla
        const modal = this.createMessageModal();
        document.body.appendChild(modal);
    }

    viewSupportResources() {
        // Mostrar recursos de apoyo
        const modal = this.createResourcesModal();
        document.body.appendChild(modal);
    }

    createMessageModal() {
        const lang = this.getCurrentLanguage();
        const modal = document.createElement('div');
        modal.className = 'message-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>💜 ${getMotivationalTranslation(lang, 'ui', 'sendMessage')}</h3>
                <p>Cuéntame cómo te sientes o qué necesitas. Te responderé lo antes posible.</p>
                <form id="messageForm">
                    <div class="form-group">
                        <label for="messageText">${getMotivationalTranslation(lang, 'ui', 'yourMessage')}</label>
                        <textarea id="messageText" rows="4" placeholder="${getMotivationalTranslation(lang, 'ui', 'messagePlaceholder')}" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="messageEmail">${getMotivationalTranslation(lang, 'ui', 'yourEmail')}</label>
                        <input type="email" id="messageEmail" placeholder="${getMotivationalTranslation(lang, 'ui', 'emailPlaceholder')}">
                    </div>
                    <div class="modal-actions">
                        <button type="button" onclick="this.parentElement.parentElement.parentElement.remove()">${getMotivationalTranslation(lang, 'ui', 'cancel')}</button>
                        <button type="submit">${getMotivationalTranslation(lang, 'ui', 'send')}</button>
                    </div>
                </form>
            </div>
        `;
        
        // Agregar evento al formulario
        modal.querySelector('#messageForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage(modal);
        });
        
        return modal;
    }
    
    sendMessage(modal) {
        const messageText = modal.querySelector('#messageText').value;
        const messageEmail = modal.querySelector('#messageEmail').value;
        
        // Aquí podrías integrar con un servicio de email o base de datos
        // Por ahora, simulamos el envío
        const lang = this.getCurrentLanguage();
        this.showNotification(getMotivationalTranslation(lang, 'ui', 'messageSent'), 'success');
        modal.remove();
        
        // Opcional: guardar en localStorage para referencia
        const messages = JSON.parse(localStorage.getItem('messages_to_carla') || '[]');
        messages.push({
            message: messageText,
            email: messageEmail,
            timestamp: new Date().toISOString(),
            tenant: this.storeAnalytics?.tenantSlug || 'unknown'
        });
        localStorage.setItem('messages_to_carla', JSON.stringify(messages));
    }

    createResourceSelectorModal() {
        const lang = this.getCurrentLanguage();
        const modal = document.createElement('div');
        modal.className = 'resource-selector-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>💜 ${getMotivationalTranslation(lang, 'ui', 'whatDoYouNeed')}</h3>
                <p>${getMotivationalTranslation(lang, 'ui', 'chooseOption')}</p>
                <div class="resource-options">
                    <div class="resource-option" onclick="handleResourceSelection('message')">
                        <i class="fas fa-envelope"></i>
                        <span>${getMotivationalTranslation(lang, 'ui', 'sendMessage')}</span>
                    </div>
                    <div class="resource-option" onclick="handleResourceSelection('resources')">
                        <i class="fas fa-heart"></i>
                        <span>${getMotivationalTranslation(lang, 'ui', 'viewResources')}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" onclick="this.parentElement.parentElement.parentElement.remove()">${getMotivationalTranslation(lang, 'ui', 'cancel')}</button>
                </div>
            </div>
        `;
        return modal;
    }

    createResourcesModal() {
        const modal = document.createElement('div');
        modal.className = 'resources-modal';
        modal.innerHTML = `
            <div class="modal-content resources-modal-content">
                <div class="modal-header">
                    <h3>💜 Recursos de Apoyo</h3>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="resource-selector">
                        <h4>¿Qué tipo de apoyo necesitas?</h4>
                        <div class="resource-options">
                            <div class="resource-option" onclick="showResourceType('breathing')">
                                <i class="fas fa-lungs"></i>
                                <span>Ejercicios de Respiración</span>
                            </div>
                            <div class="resource-option" onclick="showResourceType('advice')">
                                <i class="fas fa-lightbulb"></i>
                                <span>Consejos Prácticos</span>
                            </div>
                            <div class="resource-option" onclick="showResourceType('exercises')">
                                <i class="fas fa-dumbbell"></i>
                                <span>Ejercicios de Motivación</span>
                            </div>
                            <div class="resource-option" onclick="showResourceType('quotes')">
                                <i class="fas fa-quote-left"></i>
                                <span>Frases Motivacionales</span>
                            </div>
                        </div>
                    </div>
                    <div id="resourceContent" class="resources-container">
                        <!-- Se cargará dinámicamente -->
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    showNotification(message, type) {
        if (window.elegantNotifications) {
            window.elegantNotifications.show(message, type);
        } else {
            alert(message);
        }
    }

    // ===== ACTUALIZACIÓN AUTOMÁTICA =====
    startAutoUpdate(interval = 300000) { // 5 minutos
        setInterval(() => {
            this.updateMotivationalDisplay();
        }, interval);
    }

    // ===== INICIALIZACIÓN =====
    initialize() {
        this.updateMotivationalDisplay();
        this.startAutoUpdate();
        console.log('💜 Sistema motivacional inicializado');
    }
}

// ===== FUNCIONES GLOBALES =====
function handleEmotionalSupportAction(action) {
    if (window.motivationalAnalytics) {
        window.motivationalAnalytics.handleEmotionalSupportAction(action);
    }
}

function handleSuggestionAction(action) {
    if (window.motivationalAnalytics) {
        window.motivationalAnalytics.handleSuggestionAction(action);
    }
}

function handleResourceSelection(option) {
    if (window.motivationalAnalytics) {
        // Cerrar modal actual
        const modal = document.querySelector('.resource-selector-modal');
        if (modal) modal.remove();
        
        // Mostrar opción seleccionada
        if (option === 'message') {
            window.motivationalAnalytics.sendMessageToCarla();
        } else if (option === 'resources') {
            window.motivationalAnalytics.viewSupportResources();
        }
    }
}

function showResourceType(type) {
    if (window.emotionalResources) {
        const container = document.getElementById('resourceContent');
        if (!container) return;
        
        // Limpiar contenido anterior
        container.innerHTML = '';
        
        // Mostrar recursos según el tipo
        switch (type) {
            case 'breathing':
                window.emotionalResources.displayBreathingExercises();
                break;
            case 'advice':
                window.emotionalResources.displayAdvice();
                break;
            case 'exercises':
                window.emotionalResources.displayMotivationExercises();
                break;
            case 'quotes':
                window.emotionalResources.displayQuotes();
                break;
        }
        
        // Mover el contenido al modal
        const content = document.getElementById('breathingExercises') || 
                       document.getElementById('adviceSection') || 
                       document.getElementById('motivationExercises') || 
                       document.getElementById('quotesSection');
        
        if (content) {
            container.appendChild(content);
        }
    }
}

// ===== INSTANCIA GLOBAL =====
window.motivationalAnalytics = null;

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que el sistema de analytics esté listo
    setTimeout(() => {
        if (window.storeAnalytics) {
            window.motivationalAnalytics = new MotivationalAnalytics(window.storeAnalytics);
            window.motivationalAnalytics.initialize();
        }
    }, 2000);
});

// ===== EXPORTACIÓN PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MotivationalAnalytics;
}
