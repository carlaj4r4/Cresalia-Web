// ===== CRESALIA AUTH SYSTEM =====
// Sistema de autenticación completo para el admin panel

class AuthSystem {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.currentTenant = null;
        this.token = null;
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.setupEventListeners();
    }

    // ===== VERIFICACIÓN DE SESIÓN =====
    checkExistingSession() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        const tenantData = localStorage.getItem('tenantData');

        if (token && userData && tenantData) {
            this.token = token;
            this.currentUser = JSON.parse(userData);
            this.currentTenant = JSON.parse(tenantData);
            this.isAuthenticated = true;
            
            // Verificar si el token sigue siendo válido
            this.verifyToken();
        } else {
            this.showLoginForm();
        }
    }

    async verifyToken() {
        if (!this.token) return false;

        try {
            const response = await fetch('http://localhost:3001/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.isAuthenticated = true;
                this.showAdminPanel();
                return true;
            } else {
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Error verificando token:', error);
            this.logout();
            return false;
        }
    }

    // ===== LOGIN =====
    async login(email, password, tenant = null) {
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Tenant-Slug': tenant || 'demo-store'
                },
                body: JSON.stringify({ email, password, tenant })
            });

            const data = await response.json();
            
            if (data.success) {
                this.token = data.token;
                this.currentUser = data.user;
                this.currentTenant = {
                    id: data.user.tenant_id,
                    slug: data.user.tenant_slug
                };
                this.isAuthenticated = true;

                // Guardar en localStorage
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('userData', JSON.stringify(this.currentUser));
                localStorage.setItem('tenantData', JSON.stringify(this.currentTenant));

                this.showAdminPanel();
                this.showNotification('Login exitoso', 'success');
                return true;
            } else {
                this.showNotification(data.message || 'Credenciales inválidas', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error en login:', error);
            this.showNotification('Error de conexión', 'error');
            return false;
        }
    }

    // ===== LOGOUT =====
    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.currentTenant = null;
        this.token = null;

        // Limpiar localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tenantData');

        this.showLoginForm();
        this.showNotification('Sesión cerrada', 'info');
    }

    // ===== REGISTRO =====
    async register(tenantData) {
        try {
            const response = await fetch('http://localhost:3001/api/tenants/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tenantData)
            });

            const data = await response.json();
            
            if (data.success) {
                this.showNotification('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
                return true;
            } else {
                this.showNotification(data.message || 'Error en el registro', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error en registro:', error);
            this.showNotification('Error de conexión', 'error');
            return false;
        }
    }

    // ===== UI MANAGEMENT =====
    showLoginForm() {
        // Ocultar panel de admin
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) adminPanel.style.display = 'none';

        // Mostrar formulario de login
        const loginFormContainer = document.getElementById('loginForm');
        if (loginFormContainer) {
            loginFormContainer.style.display = 'block';
        } else {
            this.createLoginForm();
        }
    }

    showAdminPanel() {
        // Ocultar formulario de login
        const loginFormContainer = document.getElementById('loginForm');
        if (loginFormContainer) loginFormContainer.style.display = 'none';

        // Mostrar panel de admin
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'block';
            this.updateUserInfo();
        }
    }

    createLoginForm() {
        const loginHTML = `
            <div id="loginForm" class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <img src="assets/logo/logo-cresalia.png" alt="Cresalia" class="login-logo">
                        <h2>Panel de Administración</h2>
                        <p>Inicia sesión para gestionar tu tienda</p>
                    </div>
                    
                    <form id="loginFormElement" class="login-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="tenant">Tienda (opcional)</label>
                            <input type="text" id="tenant" name="tenant" placeholder="demo-store">
                        </div>
                        
                        <button type="submit" class="btn-login">Iniciar Sesión</button>
                    </form>
                    
                    <div class="login-footer">
                        <p>¿No tienes cuenta? <a href="#" id="showRegister">Regístrate aquí</a></p>
                    </div>
                </div>
                
                <!-- Formulario de Registro -->
                <div id="registerForm" class="login-card" style="display: none;">
                    <div class="login-header">
                        <h2>Crear Nueva Tienda</h2>
                        <p>Registra tu tienda en Cresalia</p>
                    </div>
                    
                    <form id="registerFormElement" class="login-form">
                        <div class="form-group">
                            <label for="regSlug">Slug de la tienda</label>
                            <input type="text" id="regSlug" name="slug" required placeholder="mi-tienda">
                        </div>
                        
                        <div class="form-group">
                            <label for="regNombre">Nombre de la empresa</label>
                            <input type="text" id="regNombre" name="nombre_empresa" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="regEmail">Email de contacto</label>
                            <input type="email" id="regEmail" name="email_contacto" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="regTelefono">Teléfono</label>
                            <input type="tel" id="regTelefono" name="telefono">
                        </div>
                        
                        <div class="form-group">
                            <label for="regPassword">Contraseña</label>
                            <input type="password" id="regPassword" name="password" required>
                        </div>
                        
                        <button type="submit" class="btn-register">Crear Tienda</button>
                    </form>
                    
                    <div class="login-footer">
                        <p>¿Ya tienes cuenta? <a href="#" id="showLogin">Inicia sesión</a></p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('afterbegin', loginHTML);
        this.setupFormEventListeners();
    }

    setupFormEventListeners() {
        // Login form
        const loginFormElement = document.getElementById('loginFormElement');
        if (loginFormElement) {
            loginFormElement.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(loginFormElement);
                const email = formData.get('email');
                const password = formData.get('password');
                const tenant = formData.get('tenant');
                
                await this.login(email, password, tenant);
            });
        }

        // Register form
        const registerFormElement = document.getElementById('registerFormElement');
        if (registerFormElement) {
            registerFormElement.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(registerFormElement);
                const tenantData = Object.fromEntries(formData);

                await this.register(tenantData);
            });
        }

        // Toggle between login and register
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        const loginFormToggle = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                if (loginFormToggle) loginFormToggle.style.display = 'none';
                if (registerForm) registerForm.style.display = 'block';
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                if (loginFormToggle) loginFormToggle.style.display = 'block';
                if (registerForm) registerForm.style.display = 'none';
            });
        }
    }

    updateUserInfo() {
        if (this.currentUser) {
            const userInfo = document.getElementById('userInfo');
            if (userInfo) {
                userInfo.innerHTML = `
                    <span class="user-name">${this.currentUser.nombre}</span>
                    <span class="user-tenant">${this.currentTenant.slug}</span>
                    <button onclick="authSystem.logout()" class="btn-logout">Cerrar Sesión</button>
                `;
            }
        }
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Auto-logout después de inactividad
        let inactivityTimer;
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (this.isAuthenticated) {
                    this.showNotification('Sesión expirada por inactividad', 'warning');
                    this.logout();
                }
            }, 30 * 60 * 1000); // 30 minutos
        };

        document.addEventListener('mousedown', resetTimer);
        document.addEventListener('keypress', resetTimer);
        document.addEventListener('scroll', resetTimer);
        document.addEventListener('touchstart', resetTimer);

        resetTimer();
    }

    // ===== NOTIFICACIONES =====
    showNotification(message, type = 'info') {
        if (window.elegantNotifications) {
            window.elegantNotifications.show(message, type);
        } else {
            alert(message);
        }
    }

    // ===== GETTERS =====
    getToken() {
        return this.token;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getCurrentTenant() {
        return this.currentTenant;
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }
}

// ===== INSTANCIA GLOBAL =====
window.authSystem = new AuthSystem();

// ===== ESTILOS CSS =====
const authStyles = `
    <style>
        .login-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .login-card {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            width: 100%;
            max-width: 400px;
        }

        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .login-logo {
            width: 60px;
            height: 60px;
            margin-bottom: 20px;
        }

        .login-header h2 {
            color: #1F2937;
            margin-bottom: 10px;
        }

        .login-header p {
            color: #6B7280;
            font-size: 14px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #374151;
            font-weight: 500;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #E5E7EB;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        .form-group input:focus {
            outline: none;
            border-color: #7C3AED;
        }

        .btn-login, .btn-register {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #7C3AED, #EC4899);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .btn-login:hover, .btn-register:hover {
            transform: translateY(-2px);
        }

        .login-footer {
            text-align: center;
            margin-top: 20px;
        }

        .login-footer a {
            color: #7C3AED;
            text-decoration: none;
            font-weight: 600;
        }

        .login-footer a:hover {
            text-decoration: underline;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .user-name {
            font-weight: 600;
            color: #1F2937;
        }

        .user-tenant {
            background: #F3F4F6;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: #6B7280;
        }

        .btn-logout {
            background: #EF4444;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
        }

        .btn-logout:hover {
            background: #DC2626;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', authStyles);

console.log('✅ Auth System cargado');










