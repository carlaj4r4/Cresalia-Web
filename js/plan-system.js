// ===== SISTEMA DE PLANES CRESALIA =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

const PLANES_CONFIG = {
    free: {
        nombre: 'Gratis',
        precio: 0,
        limite_productos: 50,
        limite_ordenes_mes: 100,
        limite_usuarios: 10,
        caracteristicas: [
            'Hasta 50 productos',
            'Hasta 100 órdenes por mes',
            'Hasta 10 usuarios',
            'Soporte por email',
            'Tema básico',
            'Subdominio gratuito (mitienda.cresalia.com)',
            'FAQ editable (preguntas personalizables)',
            'Chatbot Cresalia IA (compartido)',
            'Redes sociales básicas',
            'Soporte básico (FAQ + email)'
        ],
        no_incluye: [
            'Chatbot IA personalizado',
            'Dominio personalizado',
            'Analytics avanzados',
            'Soporte prioritario',
            'Temas premium',
            'FAQ ilimitado',
            'Integraciones avanzadas'
        ],
        chatbot_config: {
            tipo: 'cresalia_compartido',
            nombre: 'Cresalia Bot',
            personalizable: false,
            respuestas_custom: false
        },
        faq_config: {
            tipo: 'basico_editable',
            preguntas_custom: true,
            respuestas_custom: true,
            max_preguntas: 15
        },
        support_config: {
            tipo: 'basico',
            chat_directo: false,
            ticket_system: true,
            respuesta_automatica: true
        }
    },
    basic: {
        nombre: 'Básico',
        precio: 29,
        limite_productos: 200,
        limite_ordenes_mes: 500,
        limite_usuarios: 50,
        carrito_por_tienda: true, // Carrito por tienda habilitado
        caracteristicas: [
            'Hasta 200 productos',
            'Hasta 500 órdenes por mes',
            'Hasta 50 usuarios',
            'Soporte prioritario',
            'Temas premium',
            'Analytics básicos',
            'Subdominio gratuito',
            'Integración con redes sociales',
            'Carrito por tienda (activar/desactivar)'
        ],
        no_incluye: [
            'Chatbot IA',
            'Dominio personalizado',
            'Analytics avanzados',
            'API personalizada',
            'Soporte 24/7'
        ]
    },
    starter: {
        nombre: 'Starter',
        precio: 49,
        limite_productos: 500,
        limite_ordenes_mes: 1000,
        limite_usuarios: 100,
        carrito_por_tienda: true, // Carrito por tienda habilitado
        caracteristicas: [
            'Hasta 500 productos',
            'Hasta 1000 órdenes por mes',
            'Hasta 100 usuarios',
            'Chatbot Cresalia IA (compartido)',
            'FAQ básico + algunas personalizaciones',
            'Soporte mejorado',
            'Temas premium',
            'Analytics básicos',
            'Subdominio gratuito',
            'Redes sociales avanzadas',
            'Carrito por tienda (activar/desactivar)'
        ],
        no_incluye: [
            'Chatbot IA personalizado',
            'Dominio personalizado',
            'Analytics avanzados',
            'Soporte prioritario',
            'FAQ completamente personalizable',
            'API personalizada'
        ],
        chatbot_config: {
            tipo: 'cresalia_compartido',
            nombre: 'Cresalia Bot',
            personalizable: false,
            respuestas_custom: false
        },
        faq_config: {
            tipo: 'basico_plus',
            preguntas_custom: true,
            respuestas_custom: true,
            max_preguntas: 25
        },
        support_config: {
            tipo: 'mejorado',
            chat_directo: true,
            ticket_system: true,
            respuesta_automatica: true
        }
    },
    pro: {
        nombre: 'Pro',
        precio: 79,
        limite_productos: 1000,
        limite_ordenes_mes: 2000,
        limite_usuarios: 200,
        carrito_por_tienda: true, // Carrito por tienda habilitado
        caracteristicas: [
            'Hasta 1000 productos',
            'Hasta 2000 órdenes por mes',
            'Hasta 200 usuarios',
            'Chatbot IA personalizable',
            'FAQ completamente personalizable',
            'Soporte personalizado (preguntas y respuestas custom)',
            'Dominio personalizado',
            'Analytics avanzados',
            'Soporte 24/7',
            'Temas premium ilimitados',
            'API personalizada',
            'Integraciones avanzadas',
            'Redes sociales ilimitadas',
            'Carrito por tienda (activar/desactivar)'
        ],
        no_incluye: [
            'White label',
            'Soporte dedicado',
            'Customizaciones avanzadas'
        ],
        chatbot_config: {
            tipo: 'personalizado',
            nombre: 'Custom Bot',
            personalizable: true,
            respuestas_custom: true
        },
        faq_config: {
            tipo: 'avanzado',
            preguntas_custom: true,
            respuestas_custom: true,
            max_preguntas: 100
        },
        support_config: {
            tipo: 'personalizado',
            chat_directo: true,
            ticket_system: true,
            respuesta_automatica: true,
            preguntas_custom: true,
            respuestas_custom: true
        }
    },
    enterprise_custom: {
        nombre: 'Enterprise Custom',
        precio: 199,
        limite_productos: -1, // Ilimitado
        limite_ordenes_mes: -1, // Ilimitado
        limite_usuarios: -1, // Ilimitado
        carrito_por_tienda: true, // Carrito por tienda habilitado
        caracteristicas: [
            'Productos ilimitados',
            'Órdenes ilimitadas',
            'Usuarios ilimitados',
            'Chatbot IA completamente personalizable',
            'FAQ completamente personalizable',
            'Soporte completamente personalizado (preguntas y respuestas custom)',
            'Dominio personalizado',
            'Analytics completos',
            'Soporte dedicado 24/7',
            'White label completo',
            'API personalizada',
            'Customizaciones avanzadas',
            'SLA garantizado',
            'Migración asistida',
            'Redes sociales ilimitadas y personalizables',
            'Carrito por tienda (activar/desactivar)'
        ],
        no_incluye: [],
        chatbot_config: {
            tipo: 'enterprise_personalizado',
            nombre: 'Enterprise Bot',
            personalizable: true,
            respuestas_custom: true,
            integraciones_avanzadas: true
        },
        faq_config: {
            tipo: 'enterprise',
            preguntas_custom: true,
            respuestas_custom: true,
            max_preguntas: -1, // Ilimitado
            categorias_custom: true
        },
        support_config: {
            tipo: 'enterprise',
            chat_directo: true,
            ticket_system: true,
            respuesta_automatica: true,
            preguntas_custom: true,
            respuestas_custom: true,
            soporte_dedicado: true
        }
    }
};

class PlanSystem {
    constructor() {
        this.currentPlan = 'free';
        this.usage = {
            productos: 0,
            ordenes_mes: 0,
            usuarios: 0
        };
    }

    // Obtener configuración de un plan
    getPlan(planName) {
        return PLANES_CONFIG[planName] || PLANES_CONFIG.free;
    }

    // Verificar si una funcionalidad está disponible en el plan actual
    isFeatureAvailable(feature) {
        const plan = this.getPlan(this.currentPlan);
        
        switch (feature) {
            case 'chatbot_ia':
                return ['pro', 'enterprise'].includes(this.currentPlan);
            case 'dominio_personalizado':
                return ['pro', 'enterprise'].includes(this.currentPlan);
            case 'analytics_avanzados':
                return ['pro', 'enterprise'].includes(this.currentPlan);
            case 'soporte_24_7':
                return ['pro', 'enterprise'].includes(this.currentPlan);
            case 'api_personalizada':
                return ['pro', 'enterprise'].includes(this.currentPlan);
            case 'white_label':
                return this.currentPlan === 'enterprise';
            case 'soporte_dedicado':
                return this.currentPlan === 'enterprise';
            case 'customizaciones_avanzadas':
                return this.currentPlan === 'enterprise';
            default:
                return true;
        }
    }

    // Verificar límites
    checkLimit(limitType, currentValue = null) {
        const plan = this.getPlan(this.currentPlan);
        const limit = plan[`limite_${limitType}`];
        
        if (limit === -1) return { allowed: true, remaining: -1 }; // Ilimitado
        
        const current = currentValue !== null ? currentValue : this.usage[limitType];
        const remaining = Math.max(0, limit - current);
        
        return {
            allowed: remaining > 0,
            remaining: remaining,
            limit: limit,
            current: current
        };
    }

    // Verificar si se puede agregar un producto
    canAddProduct() {
        return this.checkLimit('productos');
    }

    // Verificar si se puede crear una orden
    canCreateOrder() {
        return this.checkLimit('ordenes_mes');
    }

    // Verificar si se puede agregar un usuario
    canAddUser() {
        return this.checkLimit('usuarios');
    }

    // Mostrar notificación de límite alcanzado
    showLimitNotification(limitType, action = 'realizar esta acción') {
        const plan = this.getPlan(this.currentPlan);
        const limit = plan[`limite_${limitType}`];
        
        if (limit === -1) return; // Ilimitado
        
        const limitText = this.getLimitText(limitType);
        
        elegantNotifications.warning(
            `Has alcanzado el límite de ${limitText} de tu plan ${plan.nombre}. Para ${action}, considera actualizar tu plan.`,
            'Límite Alcanzado'
        );
    }

    // Obtener texto del límite
    getLimitText(limitType) {
        const texts = {
            productos: 'productos',
            ordenes_mes: 'órdenes por mes',
            usuarios: 'usuarios'
        };
        return texts[limitType] || limitType;
    }

    // Mostrar modal de actualización de plan
    showUpgradeModal(feature = null) {
        const modal = this.createUpgradeModal(feature);
        document.body.appendChild(modal);
        
        // Mostrar modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // Crear modal de actualización
    createUpgradeModal(feature = null) {
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal-overlay';
        
        const currentPlan = this.getPlan(this.currentPlan);
        const recommendedPlan = this.getRecommendedPlan(feature);
        
        modal.innerHTML = `
            <div class="upgrade-modal">
                <div class="upgrade-modal-header">
                    <h3>🚀 Actualiza tu Plan</h3>
                    <button class="upgrade-modal-close" onclick="this.closest('.upgrade-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="upgrade-modal-content">
                    <div class="current-plan">
                        <h4>Plan Actual: ${currentPlan.nombre}</h4>
                        <p>Precio: ${currentPlan.precio === 0 ? 'Gratis' : '$' + currentPlan.precio + '/mes'}</p>
                    </div>
                    
                    <div class="recommended-plan">
                        <h4>Plan Recomendado: ${recommendedPlan.nombre}</h4>
                        <p>Precio: $${recommendedPlan.precio}/mes</p>
                        <ul class="plan-features">
                            ${recommendedPlan.caracteristicas.map(feature => `<li>✅ ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="upgrade-actions">
                        <button class="btn-upgrade" onclick="planSystem.upgradeToPlan('${recommendedPlan.nombre.toLowerCase()}')">
                            <i class="fas fa-rocket"></i> Actualizar a ${recommendedPlan.nombre}
                        </button>
                        <button class="btn-cancel" onclick="this.closest('.upgrade-modal-overlay').remove()">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }

    // Obtener plan recomendado según la funcionalidad
    getRecommendedPlan(feature) {
        switch (feature) {
            case 'chatbot_ia':
            case 'dominio_personalizado':
            case 'analytics_avanzados':
                return PLANES_CONFIG.pro;
            case 'white_label':
            case 'soporte_dedicado':
                return PLANES_CONFIG.enterprise;
            default:
                return PLANES_CONFIG.basic;
        }
    }

    // Actualizar a un plan específico
    upgradeToPlan(planName) {
        if (!PLANES_CONFIG[planName]) {
            elegantNotifications.error('Plan no válido', 'Error');
            return;
        }
        
        // Aquí se conectaría con el sistema de pagos
        elegantNotifications.info(
            `Redirigiendo al sistema de pagos para actualizar a ${PLANES_CONFIG[planName].nombre}...`,
            'Actualizando Plan'
        );
        
        // Simular redirección a sistema de pagos
        setTimeout(() => {
            window.open(`/pagos/upgrade?plan=${planName}`, '_blank');
        }, 2000);
    }

    // Actualizar uso actual
    updateUsage(usage) {
        this.usage = { ...this.usage, ...usage };
    }

    // Obtener estadísticas de uso
    getUsageStats() {
        const plan = this.getPlan(this.currentPlan);
        const stats = {};
        
        Object.keys(this.usage).forEach(key => {
            const limit = plan[`limite_${key}`];
            stats[key] = {
                current: this.usage[key],
                limit: limit,
                percentage: limit === -1 ? 0 : (this.usage[key] / limit) * 100,
                remaining: limit === -1 ? -1 : Math.max(0, limit - this.usage[key])
            };
        });
        
        return stats;
    }
}

// Instancia global
const planSystem = new PlanSystem();

// Estilos para el modal de actualización
const upgradeModalStyles = `
<style>
.upgrade-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.upgrade-modal-overlay.show {
    opacity: 1;
}

.upgrade-modal {
    background: white;
    border-radius: 20px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.upgrade-modal-overlay.show .upgrade-modal {
    transform: scale(1);
}

.upgrade-modal-header {
    padding: 24px 24px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.upgrade-modal-header h3 {
    margin: 0;
    color: #1F2937;
    font-size: 24px;
    font-weight: 700;
}

.upgrade-modal-close {
    background: none;
    border: none;
    font-size: 20px;
    color: #9CA3AF;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.upgrade-modal-close:hover {
    background: #F3F4F6;
    color: #6B7280;
}

.upgrade-modal-content {
    padding: 24px;
}

.current-plan, .recommended-plan {
    margin-bottom: 24px;
    padding: 20px;
    border-radius: 12px;
    border: 2px solid #E5E7EB;
}

.recommended-plan {
    border-color: #7C3AED;
    background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
}

.current-plan h4, .recommended-plan h4 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
}

.current-plan p, .recommended-plan p {
    margin: 0 0 16px 0;
    color: #6B7280;
    font-size: 16px;
}

.plan-features {
    list-style: none;
    padding: 0;
    margin: 0;
}

.plan-features li {
    padding: 4px 0;
    font-size: 14px;
    color: #374151;
}

.upgrade-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
}

.btn-upgrade {
    background: linear-gradient(135deg, #7C3AED, #A78BFA);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-upgrade:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);
}

.btn-cancel {
    background: #F3F4F6;
    color: #6B7280;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-cancel:hover {
    background: #E5E7EB;
    color: #374151;
}
</style>
`;

// Agregar estilos al head
document.head.insertAdjacentHTML('beforeend', upgradeModalStyles);

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PlanSystem, PLANES_CONFIG };
}

