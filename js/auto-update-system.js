// ===== SISTEMA DE ACTUALIZACIÓN AUTOMÁTICA =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

class AutoUpdateSystem {
    constructor() {
        this.config = {
            tenant_id: null,
            update_interval: 30000, // 30 segundos
            enabled: true
        };
        this.lastUpdate = {
            productos: null,
            ofertas: null,
            faq: null,
            soporte: null
        };
        this.init();
    }

    init() {
        this.loadConfig();
        this.startAutoUpdate();
    }

    // Cargar configuración
    loadConfig() {
        if (typeof TIENDA_CONFIG !== 'undefined') {
            this.config.tenant_id = TIENDA_CONFIG.slug;
        }
    }

    // Iniciar actualización automática
    startAutoUpdate() {
        if (!this.config.enabled || !this.config.tenant_id) return;

        // Actualizar inmediatamente
        this.checkForUpdates();

        // Configurar intervalo de actualización
        setInterval(() => {
            this.checkForUpdates();
        }, this.config.update_interval);

        console.log('🔄 Sistema de actualización automática iniciado');
    }

    // Verificar actualizaciones
    async checkForUpdates() {
        if (!this.config.tenant_id) return;

        try {
            // Verificar productos
            await this.checkProductUpdates();
            
            // Verificar ofertas
            await this.checkOfferUpdates();
            
            // Verificar FAQ
            await this.checkFAQUpdates();
            
            // Verificar soporte
            await this.checkSupportUpdates();
            
        } catch (error) {
            console.error('Error en actualización automática:', error);
        }
    }

    // Verificar actualizaciones de productos
    async checkProductUpdates() {
        try {
            const response = await fetch(`/api/${this.config.tenant_id}/productos?limite=1`);
            if (response.ok) {
                const productos = await response.json();
                if (productos.length > 0) {
                    const lastProduct = productos[0];
                    const lastUpdate = new Date(lastProduct.created_at || lastProduct.updated_at);
                    
                    if (!this.lastUpdate.productos || lastUpdate > this.lastUpdate.productos) {
                        this.lastUpdate.productos = lastUpdate;
                        this.notifyUpdate('productos', 'Nuevos productos disponibles');
                        this.updateChatbotKnowledge('productos');
                    }
                }
            }
        } catch (error) {
            console.error('Error verificando productos:', error);
        }
    }

    // Verificar actualizaciones de ofertas
    async checkOfferUpdates() {
        try {
            const response = await fetch(`/api/${this.config.tenant_id}/ofertas`);
            if (response.ok) {
                const ofertas = await response.json();
                if (ofertas.length > 0) {
                    const lastOffer = ofertas[0];
                    const lastUpdate = new Date(lastOffer.created_at);
                    
                    if (!this.lastUpdate.ofertas || lastUpdate > this.lastUpdate.ofertas) {
                        this.lastUpdate.ofertas = lastUpdate;
                        this.notifyUpdate('ofertas', 'Nueva oferta disponible');
                        this.updateChatbotKnowledge('ofertas');
                    }
                }
            }
        } catch (error) {
            console.error('Error verificando ofertas:', error);
        }
    }

    // Verificar actualizaciones de FAQ
    async checkFAQUpdates() {
        try {
            const response = await fetch(`/api/${this.config.tenant_id}/faq`);
            if (response.ok) {
                const faq = await response.json();
                if (faq.length > 0) {
                    const lastFAQ = faq[0];
                    const lastUpdate = new Date(lastFAQ.created_at);
                    
                    if (!this.lastUpdate.faq || lastUpdate > this.lastUpdate.faq) {
                        this.lastUpdate.faq = lastUpdate;
                        this.notifyUpdate('faq', 'FAQ actualizado');
                        this.updateChatbotKnowledge('faq');
                    }
                }
            }
        } catch (error) {
            console.error('Error verificando FAQ:', error);
        }
    }

    // Verificar actualizaciones de soporte
    async checkSupportUpdates() {
        try {
            const response = await fetch(`/api/${this.config.tenant_id}/soporte`);
            if (response.ok) {
                const soporte = await response.json();
                if (soporte.length > 0) {
                    const lastSupport = soporte[0];
                    const lastUpdate = new Date(lastSupport.created_at);
                    
                    if (!this.lastUpdate.soporte || lastUpdate > this.lastUpdate.soporte) {
                        this.lastUpdate.soporte = lastUpdate;
                        this.notifyUpdate('soporte', 'Soporte técnico actualizado');
                        this.updateChatbotKnowledge('soporte');
                    }
                }
            }
        } catch (error) {
            console.error('Error verificando soporte:', error);
        }
    }

    // Notificar actualización
    notifyUpdate(type, message) {
        console.log(`🔄 ${message} (${type})`);
        
        // Mostrar notificación elegante si está disponible
        if (typeof elegantNotifications !== 'undefined') {
            elegantNotifications.info(message, 'Actualización Automática');
        }
    }

    // Actualizar conocimiento del chatbot
    updateChatbotKnowledge(type) {
        if (typeof dynamicChatbot !== 'undefined') {
            dynamicChatbot.updateKnowledge();
            console.log(`🤖 Conocimiento del chatbot actualizado: ${type}`);
        }
    }

    // Forzar actualización manual
    async forceUpdate() {
        console.log('🔄 Forzando actualización manual...');
        
        if (typeof dynamicChatbot !== 'undefined') {
            await dynamicChatbot.updateKnowledge();
        }
        
        // Notificar actualización
        if (typeof elegantNotifications !== 'undefined') {
            elegantNotifications.success('Actualización completada', 'Sistema');
        }
    }

    // Configurar sistema
    configure(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        if (newConfig.tenant_id) {
            this.config.tenant_id = newConfig.tenant_id;
        }
        
        if (newConfig.update_interval) {
            this.config.update_interval = newConfig.update_interval;
        }
        
        if (newConfig.enabled !== undefined) {
            this.config.enabled = newConfig.enabled;
        }
        
        console.log('⚙️ Sistema de actualización automática configurado');
    }

    // Obtener estadísticas
    getStats() {
        return {
            tenant_id: this.config.tenant_id,
            enabled: this.config.enabled,
            update_interval: this.config.update_interval,
            last_updates: this.lastUpdate,
            next_update: new Date(Date.now() + this.config.update_interval)
        };
    }
}

// Instancia global
const autoUpdate = new AutoUpdateSystem();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoUpdateSystem;
}























