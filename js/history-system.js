// ===== CRESALIA HISTORY SYSTEM =====
// Sistema completo de historiales conectado al backend

class HistorySystem {
    constructor() {
        this.currentUserType = null;
        this.histories = {
            pedidos: [],
            ventas: [],
            emocional: [],
            sesiones: []
        };
        this.init();
    }

    init() {
        this.detectUserType();
        this.loadHistories();
        this.setupEventListeners();
    }

    // ===== DETECCIÓN DE TIPO DE USUARIO =====
    detectUserType() {
        if (window.accountTypeSystem) {
            this.currentUserType = window.accountTypeSystem.getUserType();
        }
        return this.currentUserType;
    }

    // ===== CARGA DE HISTORIALES =====
    async loadHistories() {
        await this.loadOrderHistory();
        await this.loadSalesHistory();
        await this.loadEmotionalHistory();
        await this.loadSessionHistory();
    }

    // ===== HISTORIAL DE PEDIDOS (COMPRADORES) =====
    async loadOrderHistory() {
        try {
            // Buscar órdenes del usuario en localStorage como fallback
            const ordenesSaved = localStorage.getItem('historial_pedidos_usuario') || '[]';
            this.histories.pedidos = JSON.parse(ordenesSaved);
            
            // Si existe el backend, intentar usarlo
            if (window.storeBackend && typeof window.storeBackend.getOrdenesUsuario === 'function') {
                const ordenes = await window.storeBackend.getOrdenesUsuario();
                this.histories.pedidos = ordenes || this.histories.pedidos;
            }
            
            console.log('📦 Historial de pedidos cargado:', this.histories.pedidos.length);
        } catch (error) {
            console.error('Error cargando historial de pedidos:', error);
            // Fallback a array vacío para no romper la aplicación
            this.histories.pedidos = [];
        }
    }

    async getOrderHistory() {
        if (this.histories.pedidos.length === 0) {
            await this.loadOrderHistory();
        }
        return this.histories.pedidos;
    }

    // ===== HISTORIAL DE VENTAS (VENDEDORES) =====
    async loadSalesHistory() {
        try {
            if (window.adminBackend) {
                const ventas = await window.adminBackend.getEstadisticas();
                this.histories.ventas = ventas || [];
                console.log('💰 Historial de ventas cargado:', this.histories.ventas.length);
            }
        } catch (error) {
            console.error('Error cargando historial de ventas:', error);
        }
    }

    async getSalesHistory() {
        if (this.histories.ventas.length === 0) {
            await this.loadSalesHistory();
        }
        return this.histories.ventas;
    }

    // ===== HISTORIAL EMOCIONAL =====
    async loadEmotionalHistory() {
        try {
            const emotionalData = localStorage.getItem('emotionalHistory');
            this.histories.emocional = emotionalData ? JSON.parse(emotionalData) : [];
            console.log('💜 Historial emocional cargado:', this.histories.emocional.length);
        } catch (error) {
            console.error('Error cargando historial emocional:', error);
        }
    }

    async getEmotionalHistory() {
        if (this.histories.emocional.length === 0) {
            await this.loadEmotionalHistory();
        }
        return this.histories.emocional;
    }

    // ===== HISTORIAL DE SESIONES =====
    async loadSessionHistory() {
        try {
            const sessionData = localStorage.getItem('sessionHistory');
            this.histories.sesiones = sessionData ? JSON.parse(sessionData) : [];
            console.log('🔒 Historial de sesiones cargado:', this.histories.sesiones.length);
        } catch (error) {
            console.error('Error cargando historial de sesiones:', error);
        }
    }

    async getSessionHistory() {
        if (this.histories.sesiones.length === 0) {
            await this.loadSessionHistory();
        }
        return this.histories.sesiones;
    }

    // ===== AGREGAR NUEVOS REGISTROS =====
    addOrder(orderData) {
        const order = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...orderData
        };
        
        this.histories.pedidos.unshift(order);
        this.saveOrderHistory();
        
        // Notificar a Crisla's Support
        this.notifyCrislaSupport('new_order', order);
    }

    addSale(saleData) {
        const sale = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...saleData
        };
        
        this.histories.ventas.unshift(sale);
        this.saveSalesHistory();
        
        // Notificar a Crisla's Support
        this.notifyCrislaSupport('new_sale', sale);
    }

    addEmotionalEntry(emotionalData) {
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...emotionalData
        };
        
        this.histories.emocional.unshift(entry);
        this.saveEmotionalHistory();
        
        // Notificar a Crisla's Support
        this.notifyCrislaSupport('emotional_entry', entry);
    }

    addSession(sessionData) {
        const session = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...sessionData
        };
        
        this.histories.sesiones.unshift(session);
        this.saveSessionHistory();
    }

    // ===== GUARDAR HISTORIALES =====
    saveOrderHistory() {
        localStorage.setItem('orderHistory', JSON.stringify(this.histories.pedidos));
    }

    saveSalesHistory() {
        localStorage.setItem('salesHistory', JSON.stringify(this.histories.ventas));
    }

    saveEmotionalHistory() {
        localStorage.setItem('emotionalHistory', JSON.stringify(this.histories.emocional));
    }

    saveSessionHistory() {
        localStorage.setItem('sessionHistory', JSON.stringify(this.histories.sesiones));
    }

    // ===== INTERFAZ DE HISTORIALES =====
    showHistoryModal(type = 'auto') {
        const historyType = type === 'auto' ? this.detectUserType() : type;
        
        const modalHTML = `
            <div id="historyModal" class="history-modal">
                <div class="history-card">
                    <div class="history-header">
                        <h2>📊 Historial Completo</h2>
                        <button onclick="historySystem.closeModal()" class="close-btn">&times;</button>
                    </div>
                    
                    <div class="history-tabs">
                        <button class="tab-btn active" data-tab="pedidos">🛒 Pedidos</button>
                        <button class="tab-btn" data-tab="ventas">💰 Ventas</button>
                        <button class="tab-btn" data-tab="emocional">💜 Emocional</button>
                        <button class="tab-btn" data-tab="sesiones">🔒 Sesiones</button>
                    </div>
                    
                    <div class="history-content">
                        <div id="pedidos-tab" class="tab-content active">
                            ${this.renderOrderHistory()}
                        </div>
                        
                        <div id="ventas-tab" class="tab-content">
                            ${this.renderSalesHistory()}
                        </div>
                        
                        <div id="emocional-tab" class="tab-content">
                            ${this.renderEmotionalHistory()}
                        </div>
                        
                        <div id="sesiones-tab" class="tab-content">
                            ${this.renderSessionHistory()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupHistoryModalEvents();
    }

    renderOrderHistory() {
        if (this.histories.pedidos.length === 0) {
            return '<div class="empty-state">No tienes pedidos registrados</div>';
        }

        return `
            <div class="history-list">
                ${this.histories.pedidos.map(order => `
                    <div class="history-item">
                        <div class="item-header">
                            <span class="item-id">#${order.id}</span>
                            <span class="item-date">${new Date(order.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div class="item-content">
                            <h4>${order.productos?.length || 0} productos</h4>
                            <p>Total: $${order.total || 0}</p>
                            <span class="status ${order.estado || 'pendiente'}">${order.estado || 'Pendiente'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSalesHistory() {
        if (this.histories.ventas.length === 0) {
            return '<div class="empty-state">No tienes ventas registradas</div>';
        }

        return `
            <div class="history-list">
                ${this.histories.ventas.map(sale => `
                    <div class="history-item">
                        <div class="item-header">
                            <span class="item-id">#${sale.id}</span>
                            <span class="item-date">${new Date(sale.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div class="item-content">
                            <h4>${sale.producto || 'Producto'}</h4>
                            <p>Cantidad: ${sale.cantidad || 1}</p>
                            <span class="amount">$${sale.total || 0}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmotionalHistory() {
        if (this.histories.emocional.length === 0) {
            return '<div class="empty-state">No tienes entradas emocionales</div>';
        }

        return `
            <div class="history-list">
                ${this.histories.emocional.map(entry => `
                    <div class="history-item emotional">
                        <div class="item-header">
                            <span class="item-mood">${entry.emocion || '😊'}</span>
                            <span class="item-date">${new Date(entry.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div class="item-content">
                            <h4>${entry.titulo || 'Entrada emocional'}</h4>
                            <p>${entry.descripcion || ''}</p>
                            <span class="mood-level ${entry.nivel || 'neutral'}">${entry.nivel || 'Neutral'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSessionHistory() {
        if (this.histories.sesiones.length === 0) {
            return '<div class="empty-state">No hay sesiones registradas</div>';
        }

        return `
            <div class="history-list">
                ${this.histories.sesiones.map(session => `
                    <div class="history-item session">
                        <div class="item-header">
                            <span class="item-action">${session.accion || 'Acción'}</span>
                            <span class="item-date">${new Date(session.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div class="item-content">
                            <h4>${session.detalle || ''}</h4>
                            <p>IP: ${session.ip || 'N/A'}</p>
                            <span class="status ${session.resultado || 'success'}">${session.resultado || 'Exitoso'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Detectar nuevos pedidos
        document.addEventListener('orderCreated', (e) => {
            this.addOrder(e.detail);
        });

        // Detectar nuevas ventas
        document.addEventListener('saleCreated', (e) => {
            this.addSale(e.detail);
        });

        // Detectar entradas emocionales
        document.addEventListener('emotionalEntry', (e) => {
            this.addEmotionalEntry(e.detail);
        });

        // Detectar sesiones
        document.addEventListener('sessionEvent', (e) => {
            this.addSession(e.detail);
        });
    }

    setupHistoryModalEvents() {
        const modal = document.getElementById('historyModal');
        const tabs = modal.querySelectorAll('.tab-btn');
        const contents = modal.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                // Remover active de todos
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Agregar active al seleccionado
                tab.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });
    }

    // ===== NOTIFICACIÓN A CRISLA'S SUPPORT =====
    notifyCrislaSupport(eventType, data) {
        // Enviar notificación al sistema de soporte de Crisla
        const notification = {
            type: eventType,
            data: data,
            timestamp: new Date().toISOString(),
            user: this.getCurrentUser()
        };

        // Guardar en localStorage para que Crisla lo vea
        const notifications = JSON.parse(localStorage.getItem('crislaNotifications') || '[]');
        notifications.unshift(notification);
        
        // Mantener solo las últimas 100 notificaciones
        if (notifications.length > 100) {
            notifications.splice(100);
        }
        
        localStorage.setItem('crislaNotifications', JSON.stringify(notifications));
        
        console.log('📢 Notificación enviada a Crisla\'s Support:', eventType);
    }

    getCurrentUser() {
        return {
            id: localStorage.getItem('userId') || 'anonymous',
            type: this.currentUserType,
            email: localStorage.getItem('userEmail') || 'N/A'
        };
    }

    // ===== MÉTODOS PÚBLICOS =====
    closeModal() {
        const modal = document.getElementById('historyModal');
        if (modal) {
            modal.remove();
        }
    }

    getCompleteHistory() {
        return {
            userType: this.currentUserType,
            pedidos: this.histories.pedidos,
            ventas: this.histories.ventas,
            emocional: this.histories.emocional,
            sesiones: this.histories.sesiones
        };
    }

    clearHistory(type = 'all') {
        if (type === 'all') {
            this.histories = { pedidos: [], ventas: [], emocional: [], sesiones: [] };
            localStorage.removeItem('orderHistory');
            localStorage.removeItem('salesHistory');
            localStorage.removeItem('emotionalHistory');
            localStorage.removeItem('sessionHistory');
        } else {
            this.histories[type] = [];
            localStorage.removeItem(`${type}History`);
        }
        
        this.showNotification(`Historial ${type} limpiado`, 'success');
    }
}

// ===== INSTANCIA GLOBAL =====
window.historySystem = new HistorySystem();

// ===== ESTILOS CSS =====
const historyStyles = `
    <style>
        .history-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .history-card {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 900px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #E5E7EB;
        }

        .history-header h2 {
            color: #1F2937;
            margin: 0;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6B7280;
        }

        .history-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .tab-btn {
            padding: 10px 20px;
            border: 2px solid #E5E7EB;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .tab-btn.active {
            border-color: #7C3AED;
            background: #7C3AED;
            color: white;
        }

        .history-content {
            flex: 1;
            overflow-y: auto;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .history-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .history-item {
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 15px;
            transition: all 0.3s;
        }

        .history-item:hover {
            border-color: #7C3AED;
            background: #F8FAFF;
        }

        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .item-id {
            font-weight: 600;
            color: #7C3AED;
        }

        .item-date {
            color: #6B7280;
            font-size: 14px;
        }

        .item-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .item-content h4 {
            margin: 0 0 5px 0;
            color: #1F2937;
        }

        .item-content p {
            margin: 0;
            color: #6B7280;
            font-size: 14px;
        }

        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }

        .status.pendiente {
            background: #FEF3C7;
            color: #92400E;
        }

        .status.entregado {
            background: #D1FAE5;
            color: #065F46;
        }

        .status.cancelado {
            background: #FEE2E2;
            color: #991B1B;
        }

        .amount {
            font-weight: 600;
            color: #059669;
        }

        .empty-state {
            text-align: center;
            color: #6B7280;
            padding: 40px;
            font-style: italic;
        }

        .emotional .item-mood {
            font-size: 24px;
        }

        .mood-level {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }

        .mood-level.feliz {
            background: #D1FAE5;
            color: #065F46;
        }

        .mood-level.triste {
            background: #FEE2E2;
            color: #991B1B;
        }

        .mood-level.neutral {
            background: #F3F4F6;
            color: #374151;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', historyStyles);

console.log('✅ History System cargado');










