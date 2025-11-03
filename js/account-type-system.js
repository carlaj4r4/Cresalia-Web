// ===== CRESALIA ACCOUNT TYPE SYSTEM =====
// Sistema de tipos de cuenta: Comprador, Vendedor, Ambos

class AccountTypeSystem {
    constructor() {
        this.accountTypes = {
            COMPRADOR: 'comprador',
            VENDEDOR: 'vendedor', 
            AMBOS: 'ambos'
        };
        
        this.currentUserType = this.getCurrentUserType();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.detectUserTypeFromActivity();
    }

    // ===== GESTIÓN DE TIPOS DE CUENTA =====
    getCurrentUserType() {
        return localStorage.getItem('userAccountType') || null;
    }

    setCurrentUserType(type) {
        localStorage.setItem('userAccountType', type);
        this.currentUserType = type;
        this.updateUI();
    }

    getUserType() {
        return this.currentUserType;
    }

    // ===== DETECCIÓN AUTOMÁTICA =====
    detectUserTypeFromActivity() {
        if (this.currentUserType) return; // Ya tiene tipo asignado

        // Detectar si es vendedor por actividad
        const hasProducts = localStorage.getItem('userProducts') || '[]';
        const hasOrders = localStorage.getItem('userOrders') || '[]';
        
        const products = JSON.parse(hasProducts);
        const orders = JSON.parse(hasOrders);

        if (products.length > 0 && orders.length > 0) {
            this.setCurrentUserType(this.accountTypes.AMBOS);
        } else if (products.length > 0) {
            this.setCurrentUserType(this.accountTypes.VENDEDOR);
        } else if (orders.length > 0) {
            this.setCurrentUserType(this.accountTypes.COMPRADOR);
        }
    }

    // ===== INTERFAZ DE SELECCIÓN =====
    showAccountTypeSelector() {
        if (this.currentUserType) return; // Ya tiene tipo

        const modalHTML = `
            <div id="accountTypeModal" class="account-type-modal">
                <div class="account-type-card">
                    <div class="account-type-header">
                        <h2>🎯 ¿Cómo quieres usar Cresalia?</h2>
                        <p>Selecciona el tipo de cuenta que mejor se adapte a ti</p>
                    </div>
                    
                    <div class="account-type-options">
                        <div class="account-option" data-type="comprador">
                            <div class="option-icon">
                                <i class="fas fa-shopping-cart"></i>
                            </div>
                            <h3>🛒 Solo Comprar</h3>
                            <p>Perfecto si solo quieres comprar productos de otras tiendas</p>
                            <ul>
                                <li>✅ Historial de pedidos</li>
                                <li>✅ Lista de deseos</li>
                                <li>✅ Seguimiento de envíos</li>
                                <li>✅ Cupones y descuentos</li>
                            </ul>
                        </div>
                        
                        <div class="account-option" data-type="vendedor">
                            <div class="option-icon">
                                <i class="fas fa-store"></i>
                            </div>
                            <h3>🏪 Solo Vender</h3>
                            <p>Ideal para crear tu propia tienda online</p>
                            <ul>
                                <li>✅ Panel de administración</li>
                                <li>✅ Gestión de productos</li>
                                <li>✅ Historial de ventas</li>
                                <li>✅ Analytics y estadísticas</li>
                            </ul>
                        </div>
                        
                        <div class="account-option" data-type="ambos">
                            <div class="option-icon">
                                <i class="fas fa-exchange-alt"></i>
                            </div>
                            <h3>🔄 Comprar y Vender</h3>
                            <p>Lo mejor de ambos mundos</p>
                            <ul>
                                <li>✅ Todo lo anterior</li>
                                <li>✅ Cuenta unificada</li>
                                <li>✅ Gestión completa</li>
                                <li>✅ Máxima flexibilidad</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="account-type-footer">
                        <p><small>Puedes cambiar esto más tarde en tu perfil</small></p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        const modal = document.getElementById('accountTypeModal');
        const options = modal.querySelectorAll('.account-option');

        options.forEach(option => {
            option.addEventListener('click', () => {
                const type = option.dataset.type;
                this.selectAccountType(type);
            });

            option.addEventListener('mouseenter', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                // No permitir cerrar sin seleccionar
                this.showNotification('Por favor selecciona un tipo de cuenta', 'warning');
            }
        });
    }

    selectAccountType(type) {
        this.setCurrentUserType(type);
        this.initializeUserExperience(type);
        this.closeModal();
        this.showNotification(`Cuenta configurada como: ${this.getTypeDisplayName(type)}`, 'success');
    }

    getTypeDisplayName(type) {
        const names = {
            'comprador': '🛒 Comprador',
            'vendedor': '🏪 Vendedor',
            'ambos': '🔄 Ambos'
        };
        return names[type] || type;
    }

    initializeUserExperience(type) {
        switch (type) {
            case this.accountTypes.COMPRADOR:
                this.initializeBuyerExperience();
                break;
            case this.accountTypes.VENDEDOR:
                this.initializeSellerExperience();
                break;
            case this.accountTypes.AMBOS:
                this.initializeBothExperience();
                break;
        }
    }

    initializeBuyerExperience() {
        // Mostrar elementos para compradores
        this.showBuyerElements();
        this.hideSellerElements();
        
        // Configurar navegación
        this.setupBuyerNavigation();
    }

    initializeSellerExperience() {
        // Mostrar elementos para vendedores
        this.showSellerElements();
        this.hideBuyerElements();
        
        // Configurar navegación
        this.setupSellerNavigation();
    }

    initializeBothExperience() {
        // Mostrar todos los elementos
        this.showBuyerElements();
        this.showSellerElements();
        
        // Configurar navegación completa
        this.setupBothNavigation();
    }

    // ===== GESTIÓN DE UI =====
    showBuyerElements() {
        const buyerElements = document.querySelectorAll('.buyer-only, .comprador-only');
        buyerElements.forEach(el => el.style.display = 'block');
    }

    hideBuyerElements() {
        const buyerElements = document.querySelectorAll('.buyer-only, .comprador-only');
        buyerElements.forEach(el => el.style.display = 'none');
    }

    showSellerElements() {
        const sellerElements = document.querySelectorAll('.seller-only, .vendedor-only');
        sellerElements.forEach(el => el.style.display = 'block');
    }

    hideSellerElements() {
        const sellerElements = document.querySelectorAll('.seller-only, .vendedor-only');
        sellerElements.forEach(el => el.style.display = 'none');
    }

    setupBuyerNavigation() {
        // Configurar navegación para compradores
        const nav = document.querySelector('.main-nav');
        if (nav) {
            nav.innerHTML = `
                <a href="#productos" class="nav-link">🛍️ Productos</a>
                <a href="#pedidos" class="nav-link">📦 Mis Pedidos</a>
                <a href="#deseos" class="nav-link">❤️ Lista de Deseos</a>
                <a href="#perfil" class="nav-link">👤 Mi Perfil</a>
            `;
        }
    }

    setupSellerNavigation() {
        // Configurar navegación para vendedores
        const nav = document.querySelector('.main-nav');
        if (nav) {
            nav.innerHTML = `
                <a href="#admin" class="nav-link">⚙️ Panel Admin</a>
                <a href="#productos" class="nav-link">📦 Mis Productos</a>
                <a href="#ventas" class="nav-link">💰 Ventas</a>
                <a href="#estadisticas" class="nav-link">📊 Estadísticas</a>
            `;
        }
    }

    setupBothNavigation() {
        // Configurar navegación completa
        const nav = document.querySelector('.main-nav');
        if (nav) {
            nav.innerHTML = `
                <a href="#productos" class="nav-link">🛍️ Comprar</a>
                <a href="#admin" class="nav-link">⚙️ Mi Tienda</a>
                <a href="#pedidos" class="nav-link">📦 Pedidos</a>
                <a href="#ventas" class="nav-link">💰 Ventas</a>
                <a href="#perfil" class="nav-link">👤 Perfil</a>
            `;
        }
    }

    // ===== HISTORIALES ESPECÍFICOS =====
    getHistoryForUserType() {
        const type = this.getUserType();
        
        switch (type) {
            case this.accountTypes.COMPRADOR:
                return this.getBuyerHistory();
            case this.accountTypes.VENDEDOR:
                return this.getSellerHistory();
            case this.accountTypes.AMBOS:
                return this.getBothHistory();
            default:
                return null;
        }
    }

    async getBuyerHistory() {
        try {
            if (window.storeBackend) {
                const ordenes = await window.storeBackend.getOrdenesUsuario();
                return {
                    tipo: 'comprador',
                    historial: ordenes,
                    titulo: '🛒 Historial de Pedidos'
                };
            }
        } catch (error) {
            console.error('Error obteniendo historial de comprador:', error);
        }
        return null;
    }

    async getSellerHistory() {
        try {
            if (window.adminBackend) {
                const ventas = await window.adminBackend.getEstadisticas();
                return {
                    tipo: 'vendedor',
                    historial: ventas,
                    titulo: '💰 Historial de Ventas'
                };
            }
        } catch (error) {
            console.error('Error obteniendo historial de vendedor:', error);
        }
        return null;
    }

    async getBothHistory() {
        try {
            const [buyerHistory, sellerHistory] = await Promise.all([
                this.getBuyerHistory(),
                this.getSellerHistory()
            ]);
            
            return {
                tipo: 'ambos',
                comprador: buyerHistory,
                vendedor: sellerHistory,
                titulo: '🔄 Historial Completo'
            };
        } catch (error) {
            console.error('Error obteniendo historial completo:', error);
        }
        return null;
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Detectar cambios en el tipo de usuario
        window.addEventListener('storage', (e) => {
            if (e.key === 'userAccountType') {
                this.currentUserType = e.newValue;
                this.updateUI();
            }
        });
    }

    updateUI() {
        if (this.currentUserType) {
            this.initializeUserExperience(this.currentUserType);
        }
    }

    closeModal() {
        const modal = document.getElementById('accountTypeModal');
        if (modal) {
            modal.remove();
        }
    }

    // ===== NOTIFICACIONES =====
    showNotification(message, type = 'info') {
        if (window.elegantNotifications) {
            window.elegantNotifications.show(message, type);
        } else {
            alert(message);
        }
    }

    // ===== MÉTODOS PÚBLICOS =====
    changeAccountType(newType) {
        this.setCurrentUserType(newType);
        this.showNotification(`Tipo de cuenta cambiado a: ${this.getTypeDisplayName(newType)}`, 'success');
    }

    resetAccountType() {
        localStorage.removeItem('userAccountType');
        this.currentUserType = null;
        this.showAccountTypeSelector();
    }
}

// ===== INSTANCIA GLOBAL =====
window.accountTypeSystem = new AccountTypeSystem();

// ===== ESTILOS CSS =====
const accountTypeStyles = `
    <style>
        .account-type-modal {
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

        .account-type-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .account-type-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .account-type-header h2 {
            color: #1F2937;
            margin-bottom: 10px;
        }

        .account-type-header p {
            color: #6B7280;
        }

        .account-type-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .account-option {
            border: 2px solid #E5E7EB;
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }

        .account-option:hover,
        .account-option.selected {
            border-color: #7C3AED;
            background: #F8FAFF;
            transform: translateY(-2px);
        }

        .option-icon {
            font-size: 48px;
            color: #7C3AED;
            margin-bottom: 15px;
        }

        .account-option h3 {
            color: #1F2937;
            margin-bottom: 10px;
        }

        .account-option p {
            color: #6B7280;
            margin-bottom: 15px;
        }

        .account-option ul {
            text-align: left;
            color: #4B5563;
            font-size: 14px;
        }

        .account-option li {
            margin-bottom: 5px;
        }

        .account-type-footer {
            text-align: center;
            color: #9CA3AF;
        }

        .buyer-only, .comprador-only {
            display: none;
        }

        .seller-only, .vendedor-only {
            display: none;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', accountTypeStyles);

console.log('✅ Account Type System cargado');























