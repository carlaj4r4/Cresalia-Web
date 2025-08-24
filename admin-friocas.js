// ===== CONFIGURACIÓN DE ADMINISTRADOR =====
const ADMIN_CONFIG = {
    password: 'FRIOCAS2024ADMIN',
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    maxLoginAttempts: 3,
    backupInterval: 30 * 60 * 1000, // 30 minutos
    maxBackups: 10 // Mantener últimos 10 backups
};

// Función para cambiar contraseña fácilmente
function cambiarContraseñaAdmin(nuevaContraseña) {
    ADMIN_CONFIG.password = nuevaContraseña;
    console.log('🔑 Nueva contraseña configurada:', nuevaContraseña);
    mostrarNotificacion('🔑 Contraseña actualizada', 'success');
}

// ===== VARIABLES GLOBALES =====
let loginAttempts = 0;
let sessionStartTime = null;
let sessionTimer = null;
let backupTimer = null;
let activeUsers = 0;
let userActivityLog = [];
let notificationQueue = [];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Panel de Administración FRIOCAS...');
    
    // Asegurar que el login esté visible por defecto
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginScreen) loginScreen.style.display = 'flex';
    if (adminPanel) adminPanel.style.display = 'none';
    
    // Verificar si ya hay una sesión activa
    const adminSession = localStorage.getItem('adminSession');
    
    if (adminSession) {
        try {
            const sessionData = JSON.parse(adminSession);
            const now = Date.now();
            
            if (now - sessionData.timestamp < ADMIN_CONFIG.sessionTimeout) {
                // Sesión válida, mostrar panel
                console.log('✅ Sesión válida encontrada - Iniciando panel');
                iniciarSesion();
            } else {
                // Sesión expirada, limpiar
                console.log('⏰ Sesión expirada - Limpiando datos');
                localStorage.removeItem('adminSession');
            }
        } catch (error) {
            // Error al parsear sesión, limpiar
            console.log('❌ Error en sesión - Limpiando datos');
            localStorage.removeItem('adminSession');
        }
    } else {
        console.log('🔐 No hay sesión activa - Mostrando login');
    }
    
    // Configurar eventos
    configurarEventos();
    
    console.log('✅ Panel de Administración inicializado');
    console.log('🔐 Contraseña de administrador:', ADMIN_CONFIG.password);
    
    // Mostrar contraseña en la consola para debug
    console.log('🔑 CONTRASEÑA ACTUAL:', ADMIN_CONFIG.password);
    console.log('💡 Para acceder usa:', ADMIN_CONFIG.password);
    
    inicializarSistemaAtencion();
});

// ===== CONFIGURACIÓN DE EVENTOS =====
function configurarEventos() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', manejarLogin);
    }
    
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            mostrarSeccion(section);
        });
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', cerrarSesion);
    }
    
    // Payment form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', guardarConfiguracionPagos);
    }
}

// ===== MANEJO DE LOGIN =====
function manejarLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const expectedPassword = ADMIN_CONFIG.password;
    
    console.log('🔐 Intento de login:');
    console.log('Contraseña ingresada:', password);
    console.log('Contraseña esperada:', expectedPassword);
    console.log('¿Coinciden?', password === expectedPassword);
    
    // Limpiar espacios en blanco
    const cleanPassword = password.trim();
    
    if (cleanPassword === expectedPassword) {
        // Login exitoso
        loginAttempts = 0;
        iniciarSesion();
        mostrarNotificacion('✅ Acceso concedido', 'success');
        console.log('🔓 Login exitoso');
    } else {
        // Login fallido
        loginAttempts++;
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
        
        console.log('❌ Login fallido - Intento:', loginAttempts);
        
        if (loginAttempts >= ADMIN_CONFIG.maxLoginAttempts) {
            mostrarNotificacion('❌ Demasiados intentos fallidos. Intenta más tarde.', 'error');
            document.getElementById('loginForm').style.display = 'none';
            setTimeout(() => {
                document.getElementById('loginForm').style.display = 'block';
                loginAttempts = 0;
            }, 30000); // 30 segundos
        } else {
            mostrarNotificacion(`❌ Contraseña incorrecta. Intentos restantes: ${ADMIN_CONFIG.maxLoginAttempts - loginAttempts}`, 'error');
        }
    }
}

function iniciarSesion() {
    // Ocultar pantalla de login
    document.getElementById('loginScreen').style.display = 'none';
    
    // Mostrar panel de administración
    document.getElementById('adminPanel').style.display = 'block';
    
    // Guardar sesión
    const sessionData = {
        timestamp: Date.now(),
        user: 'Administrador FRIOCAS'
    };
    localStorage.setItem('adminSession', JSON.stringify(sessionData));
    
    // Iniciar timer de sesión
    iniciarTimerSesion();
    
    // Inicializar sistemas avanzados
    inicializarSistemasAvanzados();
    
    // Cargar datos del dashboard
    cargarDashboard();
    
    // Agregar notificación de bienvenida
    agregarNotificacion(
        'Bienvenido al Panel de Administración',
        'Sistemas de monitoreo y backup automático activados',
        'success',
        'normal'
    );
    
    console.log('🔓 Sesión iniciada correctamente');
}

function cerrarSesion() {
    // Limpiar sesión
    localStorage.removeItem('adminSession');
    
    // Detener timer
    if (sessionTimer) {
        clearInterval(sessionTimer);
    }
    
    // Mostrar pantalla de login
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    
    // Limpiar formulario
    document.getElementById('password').value = '';
    
    console.log('🔒 Sesión cerrada');
}

function iniciarTimerSesion() {
    sessionStartTime = Date.now();
    
    sessionTimer = setInterval(() => {
        const elapsed = Date.now() - sessionStartTime;
        
        if (elapsed >= ADMIN_CONFIG.sessionTimeout) {
            mostrarNotificacion('⏰ Sesión expirada por inactividad', 'warning');
            cerrarSesion();
        }
    }, 60000); // Verificar cada minuto
}

// ===== NAVEGACIÓN =====
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('.content-section');
    secciones.forEach(seccion => {
        seccion.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const seccionActiva = document.getElementById(seccionId);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
    }
    
    // Actualizar botones de navegación
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === seccionId) {
            btn.classList.add('active');
        }
    });
    
    // Cargar contenido específico de la sección
    switch (seccionId) {
        case 'dashboard':
            cargarDashboard();
            break;
        case 'productos':
            cargarProductos();
            break;
        case 'servicios':
            cargarServicios();
            break;
        case 'pagos':
            cargarConfiguracionPagos();
            break;
        case 'configuracion':
            cargarConfiguracionGeneral();
            break;
        case 'ofertas':
            cargarOfertas();
            break;
        case 'atencion':
            cargarAtencionCliente();
            break;
        case 'estadisticas':
            cargarEstadisticas();
            break;
    }
}

// ===== DASHBOARD =====
function cargarDashboard() {
    console.log('📊 Cargando dashboard...');
    
    // Actualizar estadísticas
    actualizarEstadisticasDashboard();
    
    // Reiniciar timer de sesión
    sessionStartTime = Date.now();
}

function actualizarEstadisticasDashboard() {
    // Aquí se cargarían las estadísticas reales desde una base de datos
    // Por ahora usamos datos de ejemplo
    
    const stats = {
        productos: 33,
        categorias: 5,
        ventasHoy: 0,
        clientesNuevos: 0
    };
    
    // Actualizar contadores en el dashboard
    document.querySelector('.stat-card:nth-child(1) .stat-info h3').textContent = stats.productos;
    document.querySelector('.stat-card:nth-child(2) .stat-info h3').textContent = stats.categorias;
    document.querySelector('.stat-card:nth-child(3) .stat-info h3').textContent = stats.ventasHoy;
    document.querySelector('.stat-card:nth-child(4) .stat-info h3').textContent = stats.clientesNuevos;
}

// ===== CONFIGURACIÓN DE PAGOS =====
function cargarConfiguracionPagos() {
    console.log('💳 Cargando configuración de pagos...');
    
    const paymentConfig = document.querySelector('#pagos .payment-config');
    if (!paymentConfig) {
        console.error('❌ No se encontró el contenedor de configuración de pagos');
        return;
    }
    
    // Cargar configuración guardada
    const config = JSON.parse(localStorage.getItem('paymentConfig') || '{}');
    
    paymentConfig.innerHTML = `
        <div class="payment-config">
            <div class="config-card">
                <div class="config-header">
                    <h3><i class="fas fa-credit-card"></i> Configuración de Métodos de Pago</h3>
                    <p>Configura los datos bancarios para recibir transferencias y pagos</p>
                </div>
                
                <form id="paymentForm" class="config-form">
                    <div class="payment-methods">
                        <h4>Métodos de Pago Disponibles</h4>
                        
                        <div class="method-tabs">
                            <button type="button" class="method-tab active" data-method="transfer">
                                <i class="fas fa-university"></i> Transferencia Bancaria
                            </button>
                            <button type="button" class="method-tab" data-method="alias">
                                <i class="fas fa-tag"></i> Alias/CVU
                            </button>
                            <button type="button" class="method-tab" data-method="cbu">
                                <i class="fas fa-hashtag"></i> CBU
                            </button>
                        </div>
                        
                        <div class="method-content">
                            <!-- Transferencia Bancaria -->
                            <div class="method-panel active" id="transfer-panel">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="banco">Banco:</label>
                                        <select id="banco" name="banco" required>
                                            <option value="">Seleccionar banco</option>
                                            <option value="Banco de la Nación Argentina" ${config.banco === 'Banco de la Nación Argentina' ? 'selected' : ''}>Banco de la Nación Argentina</option>
                                            <option value="Banco de la Provincia de Buenos Aires" ${config.banco === 'Banco de la Provincia de Buenos Aires' ? 'selected' : ''}>Banco de la Provincia de Buenos Aires</option>
                                            <option value="Banco Santander" ${config.banco === 'Banco Santander' ? 'selected' : ''}>Banco Santander</option>
                                            <option value="Banco Galicia" ${config.banco === 'Banco Galicia' ? 'selected' : ''}>Banco Galicia</option>
                                            <option value="BBVA" ${config.banco === 'BBVA' ? 'selected' : ''}>BBVA</option>
                                            <option value="HSBC" ${config.banco === 'HSBC' ? 'selected' : ''}>HSBC</option>
                                            <option value="Banco Macro" ${config.banco === 'Banco Macro' ? 'selected' : ''}>Banco Macro</option>
                                            <option value="Banco Itaú" ${config.banco === 'Banco Itaú' ? 'selected' : ''}>Banco Itaú</option>
                                            <option value="Banco Supervielle" ${config.banco === 'Banco Supervielle' ? 'selected' : ''}>Banco Supervielle</option>
                                            <option value="Banco Credicoop" ${config.banco === 'Banco Credicoop' ? 'selected' : ''}>Banco Credicoop</option>
                                            <option value="Otro" ${config.banco === 'Otro' ? 'selected' : ''}>Otro</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="titular">Titular de la Cuenta:</label>
                                        <input type="text" id="titular" name="titular" value="${config.titular || ''}" placeholder="Nombre y Apellido del titular" required>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="tipoCuenta">Tipo de Cuenta:</label>
                                        <select id="tipoCuenta" name="tipoCuenta" required>
                                            <option value="">Seleccionar tipo</option>
                                            <option value="Cuenta Corriente" ${config.tipoCuenta === 'Cuenta Corriente' ? 'selected' : ''}>Cuenta Corriente</option>
                                            <option value="Caja de Ahorro" ${config.tipoCuenta === 'Caja de Ahorro' ? 'selected' : ''}>Caja de Ahorro</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="numeroCuenta">Número de Cuenta:</label>
                                        <input type="text" id="numeroCuenta" name="numeroCuenta" value="${config.numeroCuenta || ''}" placeholder="Número de cuenta" required>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="cbu">CBU:</label>
                                    <input type="text" id="cbu" name="cbu" value="${config.cbu || ''}" placeholder="0000000000000000000000" maxlength="22" pattern="[0-9]{22}" required>
                                    <small class="form-help">El CBU debe tener exactamente 22 dígitos numéricos</small>
                                </div>
                            </div>
                            
                            <!-- Alias/CVU -->
                            <div class="method-panel" id="alias-panel">
                                <div class="form-group">
                                    <label for="alias">Alias:</label>
                                    <input type="text" id="alias" name="alias" value="${config.alias || ''}" placeholder="Ej: FRIOCAS.AUTO" maxlength="6" pattern="[A-Z0-9.]{6}">
                                    <small class="form-help">El alias debe tener exactamente 6 caracteres (letras, números y puntos)</small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="cvu">CVU:</label>
                                    <input type="text" id="cvu" name="cvu" value="${config.cvu || ''}" placeholder="0000000000000000000000" maxlength="22" pattern="[0-9]{22}">
                                    <small class="form-help">El CVU debe tener exactamente 22 dígitos numéricos</small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="titularAlias">Titular:</label>
                                    <input type="text" id="titularAlias" name="titularAlias" value="${config.titularAlias || ''}" placeholder="Nombre y Apellido del titular">
                                </div>
                            </div>
                            
                            <!-- CBU -->
                            <div class="method-panel" id="cbu-panel">
                                <div class="form-group">
                                    <label for="cbuDirecto">CBU:</label>
                                    <input type="text" id="cbuDirecto" name="cbuDirecto" value="${config.cbuDirecto || ''}" placeholder="0000000000000000000000" maxlength="22" pattern="[0-9]{22}">
                                    <small class="form-help">El CBU debe tener exactamente 22 dígitos numéricos</small>
                                </div>
                                
                                <div class="form-group">
                                    <label for="bancoCbu">Banco:</label>
                                    <input type="text" id="bancoCbu" name="bancoCbu" value="${config.bancoCbu || ''}" placeholder="Nombre del banco">
                                </div>
                                
                                <div class="form-group">
                                    <label for="titularCbu">Titular:</label>
                                    <input type="text" id="titularCbu" name="titularCbu" value="${config.titularCbu || ''}" placeholder="Nombre y Apellido del titular">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="payment-settings">
                        <h4>Configuración Adicional</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="emailPagos">Email para Notificaciones:</label>
                                <input type="email" id="emailPagos" name="emailPagos" value="${config.emailPagos || ''}" placeholder="email@friocas.com">
                            </div>
                            
                            <div class="form-group">
                                <label for="telefonoPagos">Teléfono para Notificaciones:</label>
                                <input type="tel" id="telefonoPagos" name="telefonoPagos" value="${config.telefonoPagos || ''}" placeholder="+54 9 11 1234-5678">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="mensajeTransferencia">Mensaje para Transferencias:</label>
                            <textarea id="mensajeTransferencia" name="mensajeTransferencia" rows="3" placeholder="Mensaje que aparecerá en las transferencias...">${config.mensajeTransferencia || 'Pago FRIOCAS - Productos Automotrices'}</textarea>
                        </div>
                    </div>
                    
                    <div class="config-actions">
                        <button type="button" class="btn-test" onclick="probarConfiguracion()">
                            <i class="fas fa-vial"></i> Probar Configuración
                        </button>
                        <button type="submit" class="save-btn">
                            <i class="fas fa-save"></i> Guardar Configuración
                        </button>
                    </div>
                </form>
            </div>
            
            <div class="config-preview">
                <div class="preview-card">
                    <h4><i class="fas fa-eye"></i> Vista Previa</h4>
                    <div id="configPreview">
                        <p class="preview-placeholder">Configura los datos para ver la vista previa</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Configurar eventos de las pestañas
    configurarEventosPagos();
    
    // Actualizar vista previa
    actualizarVistaPrevia();
}

function configurarEventosPagos() {
    // Eventos de pestañas
    const methodTabs = document.querySelectorAll('.method-tab');
    
    methodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover activo de todas las pestañas
            methodTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.method-panel').forEach(p => p.classList.remove('active'));
            
            // Activar pestaña seleccionada
            tab.classList.add('active');
            const method = tab.getAttribute('data-method');
            document.getElementById(`${method}-panel`).classList.add('active');
            
            // Actualizar campos requeridos
            actualizarCamposRequeridos(method);
        });
    });
    
    // Eventos de validación en tiempo real
    const inputs = document.querySelectorAll('#paymentForm input, #paymentForm select, #paymentForm textarea');
    inputs.forEach(input => {
        input.addEventListener('input', actualizarVistaPrevia);
        input.addEventListener('change', validarCampo);
    });
    
    // Evento del formulario
    const form = document.getElementById('paymentForm');
    if (form) {
        form.addEventListener('submit', guardarConfiguracionPagos);
    }
    
    // Configurar campos requeridos inicialmente
    actualizarCamposRequeridos('transferencia');
}

function actualizarCamposRequeridos(metodo) {
    // Remover required de todos los campos
    const todosLosCampos = [
        'banco', 'titular', 'tipoCuenta', 'numeroCuenta', 'cbu',
        'alias', 'cvu', 'titularAlias',
        'cbuDirecto', 'bancoCbu', 'titularCbu'
    ];
    
    todosLosCampos.forEach(campo => {
        const input = document.getElementById(campo);
        if (input) {
            input.removeAttribute('required');
        }
    });
    
    // Agregar required según el método
    let camposRequeridos = [];
    
    if (metodo === 'transferencia') {
        camposRequeridos = ['banco', 'titular', 'tipoCuenta', 'numeroCuenta', 'cbu'];
    } else if (metodo === 'alias') {
        camposRequeridos = ['alias', 'cvu', 'titularAlias'];
    } else if (metodo === 'cbu') {
        camposRequeridos = ['cbuDirecto', 'bancoCbu', 'titularCbu'];
    }
    
    camposRequeridos.forEach(campo => {
        const input = document.getElementById(campo);
        if (input) {
            input.setAttribute('required', 'required');
        }
    });
    
    console.log(`🔧 Campos requeridos actualizados para método: ${metodo}`);
}

function validarCampo(event) {
    const input = event.target;
    const value = input.value;
    
    // Remover clases de validación previas
    input.classList.remove('valid', 'invalid');
    
    // Validaciones específicas
    if (input.id === 'cbu' || input.id === 'cvu' || input.id === 'cbuDirecto') {
        if (value.length === 22 && /^\d{22}$/.test(value)) {
            input.classList.add('valid');
        } else if (value.length > 0) {
            input.classList.add('invalid');
        }
    }
    
    if (input.id === 'alias') {
        if (value.length === 6 && /^[A-Z0-9.]{6}$/.test(value)) {
            input.classList.add('valid');
        } else if (value.length > 0) {
            input.classList.add('invalid');
        }
    }
    
    if (input.type === 'email' && value) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            input.classList.add('valid');
        } else {
            input.classList.add('invalid');
        }
    }
}

function actualizarVistaPrevia() {
    const preview = document.getElementById('configPreview');
    if (!preview) return;
    
    const formData = new FormData(document.getElementById('paymentForm'));
    const config = Object.fromEntries(formData.entries());
    
    let previewHTML = '';
    
    // Determinar método activo
    const activeTab = document.querySelector('.method-tab.active');
    const method = activeTab ? activeTab.getAttribute('data-method') : 'transfer';
    
    switch (method) {
        case 'transfer':
            if (config.banco && config.titular && config.cbu) {
                previewHTML = `
                    <div class="preview-item">
                        <strong>Banco:</strong> ${config.banco}
                    </div>
                    <div class="preview-item">
                        <strong>Titular:</strong> ${config.titular}
                    </div>
                    <div class="preview-item">
                        <strong>CBU:</strong> <code>${config.cbu}</code>
                    </div>
                    <div class="preview-item">
                        <strong>Tipo:</strong> ${config.tipoCuenta || 'No especificado'}
                    </div>
                `;
            }
            break;
            
        case 'alias':
            if (config.alias && config.cvu && config.titularAlias) {
                previewHTML = `
                    <div class="preview-item">
                        <strong>Alias:</strong> <code>${config.alias}</code>
                    </div>
                    <div class="preview-item">
                        <strong>CVU:</strong> <code>${config.cvu}</code>
                    </div>
                    <div class="preview-item">
                        <strong>Titular:</strong> ${config.titularAlias}
                    </div>
                `;
            }
            break;
            
        case 'cbu':
            if (config.cbuDirecto && config.bancoCbu && config.titularCbu) {
                previewHTML = `
                    <div class="preview-item">
                        <strong>CBU:</strong> <code>${config.cbuDirecto}</code>
                    </div>
                    <div class="preview-item">
                        <strong>Banco:</strong> ${config.bancoCbu}
                    </div>
                    <div class="preview-item">
                        <strong>Titular:</strong> ${config.titularCbu}
                    </div>
                `;
            }
            break;
    }
    
    if (config.mensajeTransferencia) {
        previewHTML += `
            <div class="preview-item">
                <strong>Mensaje:</strong> "${config.mensajeTransferencia}"
            </div>
        `;
    }
    
    if (previewHTML) {
        preview.innerHTML = previewHTML;
    } else {
        preview.innerHTML = '<p class="preview-placeholder">Configura los datos para ver la vista previa</p>';
    }
}

function probarConfiguracion() {
    const formData = new FormData(document.getElementById('paymentForm'));
    const config = Object.fromEntries(formData.entries());
    
    // Validar que haya al menos un método configurado
    let metodoConfigurado = false;
    
    if (config.banco && config.titular && config.cbu) {
        metodoConfigurado = true;
    } else if (config.alias && config.cvu && config.titularAlias) {
        metodoConfigurado = true;
    } else if (config.cbuDirecto && config.bancoCbu && config.titularCbu) {
        metodoConfigurado = true;
    }
    
    if (!metodoConfigurado) {
        mostrarNotificacion('❌ Debes configurar al menos un método de pago completo', 'error');
        return;
    }
    
    // Simular prueba de configuración
    mostrarNotificacion('🔍 Probando configuración...', 'info');
    
    setTimeout(() => {
        mostrarNotificacion('✅ Configuración válida - Los datos están correctos', 'success');
    }, 2000);
}

function guardarConfiguracionPagos(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const config = Object.fromEntries(formData.entries());
    
    // Validar que haya al menos un método configurado
    let metodoConfigurado = false;
    
    if (config.banco && config.titular && config.cbu) {
        metodoConfigurado = true;
    } else if (config.alias && config.cvu && config.titularAlias) {
        metodoConfigurado = true;
    } else if (config.cbuDirecto && config.bancoCbu && config.titularCbu) {
        metodoConfigurado = true;
    }
    
    if (!metodoConfigurado) {
        mostrarNotificacion('❌ Debes configurar al menos un método de pago completo', 'error');
        return;
    }
    
    // Agregar timestamp
    config.timestamp = Date.now();
    
    // Guardar en localStorage
    localStorage.setItem('paymentConfig', JSON.stringify(config));
    
    mostrarNotificacion('✅ Configuración de pagos guardada correctamente', 'success');
    
    console.log('💾 Configuración de pagos guardada:', config);
}

// ===== CONFIGURACIÓN GENERAL =====
function cargarConfiguracionGeneral() {
    console.log('⚙️ Cargando configuración general...');
    
    const configGeneralGrid = document.getElementById('configGeneralGrid');
    if (!configGeneralGrid) return;
    
    // Cargar configuración guardada
    const config = JSON.parse(localStorage.getItem('friocasConfig') || '{}');
    
    configGeneralGrid.innerHTML = `
        <!-- Información de Contacto -->
        <div class="config-general-card">
            <div class="config-general-header">
                <i class="fas fa-map-marker-alt"></i>
                <h3>Información de Contacto</h3>
            </div>
            <div class="config-general-content">
                <form id="contactoForm" class="config-general-form">
                    <div class="form-group">
                        <label for="nombreEmpresa">Nombre de la Empresa:</label>
                        <input type="text" id="nombreEmpresa" name="nombreEmpresa" value="${config.nombreEmpresa || 'FRIOCAS'}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="direccion">Dirección:</label>
                        <textarea id="direccion" name="direccion" rows="3" placeholder="Dirección completa de la empresa...">${config.direccion || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="telefono">Teléfono:</label>
                        <input type="tel" id="telefono" name="telefono" value="${config.telefono || ''}" placeholder="+54 9 3794 XXXXXX">
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" value="${config.email || ''}" placeholder="info@friocas.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="horarios">Horarios de Atención:</label>
                        <input type="text" id="horarios" name="horarios" value="${config.horarios || ''}" placeholder="Lunes a Viernes 8:00 - 18:00">
                    </div>
                    
                    <div class="config-general-actions">
                        <button type="submit" class="save-btn">
                            <i class="fas fa-save"></i> Guardar Información
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Gestión de Servicios -->
        <div class="config-general-card">
            <div class="config-general-header">
                <i class="fas fa-tools"></i>
                <h3>Gestión de Servicios</h3>
            </div>
            <div class="config-general-content">
                <div class="servicios-lista" id="serviciosLista">
                    <!-- Los servicios se cargarán dinámicamente -->
                </div>
                
                <div class="config-general-actions">
                    <button type="button" class="add-btn" onclick="mostrarFormularioServicio()">
                        <i class="fas fa-plus"></i> Agregar Servicio
                    </button>
                </div>
            </div>
        </div>

        <!-- Gestión de Categorías -->
        <div class="config-general-card">
            <div class="config-general-header">
                <i class="fas fa-tags"></i>
                <h3>Gestión de Categorías</h3>
            </div>
            <div class="config-general-content">
                <div class="categorias-lista" id="categoriasLista">
                    <!-- Las categorías se cargarán dinámicamente -->
                </div>
                
                <div class="config-general-actions">
                    <button type="button" class="add-btn" onclick="mostrarFormularioCategoria()">
                        <i class="fas fa-plus"></i> Agregar Categoría
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Configurar eventos
    configurarEventosConfiguracion();
    
    // Cargar datos
    cargarServicios();
    cargarCategorias();
}

function configurarEventosConfiguracion() {
    // Formulario de contacto
    const contactoForm = document.getElementById('contactoForm');
    if (contactoForm) {
        contactoForm.addEventListener('submit', guardarInformacionContacto);
    }
}

function guardarInformacionContacto(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const config = Object.fromEntries(formData.entries());
    
    // Agregar timestamp
    config.timestamp = Date.now();
    
    // Guardar en localStorage
    localStorage.setItem('friocasConfig', JSON.stringify(config));
    
    mostrarNotificacion('✅ Información de contacto guardada correctamente', 'success');
    console.log('💾 Información de contacto guardada:', config);
}

function cargarServicios() {
    let servicios = JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]');
    const serviciosLista = document.getElementById('serviciosLista');
    
    if (!serviciosLista) return;
    
    // Si no hay servicios guardados, cargar los servicios por defecto
    if (servicios.length === 0) {
        console.log('🔧 Cargando servicios por defecto...');
        
        // Servicios por defecto de la página principal (datos-productos.js)
        servicios = [
            // Aire Acondicionado
            { id: 'ac1', nombre: 'Instalación de Aire Acondicionado', categoria: 'aireAcondicionado', precio: 150000, descripcion: 'Instalación completa de sistema de aire acondicionado' },
            { id: 'ac2', nombre: 'Mantenimiento de Aire Acondicionado', categoria: 'aireAcondicionado', precio: 25000, descripcion: 'Limpieza y recarga de gas refrigerante' },
            
            // Taller
            { id: 'ta1', nombre: 'Cambio de Aceite', categoria: 'taller', precio: 18000, descripcion: 'Cambio de aceite y filtro incluido' },
            { id: 'ta2', nombre: 'Alineación y Balanceo', categoria: 'taller', precio: 22000, descripcion: 'Alineación de dirección y balanceo de ruedas' },
            { id: 'ta3', nombre: 'Diagnóstico Computarizado', categoria: 'taller', precio: 15000, descripcion: 'Diagnóstico completo del vehículo' },
            
            // Lubricentro
            { id: 'lu1', nombre: 'Cambio de Aceite Express', categoria: 'lubricentro', precio: 15000, descripcion: 'Cambio rápido de aceite y filtros' },
            { id: 'lu2', nombre: 'Cambio de Filtros', categoria: 'lubricentro', precio: 8000, descripcion: 'Cambio de filtros de aire, aceite y combustible' },
            
            // Detailing
            { id: 'de1', nombre: 'Lavado Completo', categoria: 'detailing', precio: 8000, descripcion: 'Lavado exterior e interior completo' },
            { id: 'de2', nombre: 'Pulido y Encerado', categoria: 'detailing', precio: 15000, descripcion: 'Pulido profesional y encerado' },
            
            // Gestoría
            { id: 'ge1', nombre: 'Transferencia de Vehículo', categoria: 'gestoria', precio: 30000, descripcion: 'Tramitación de transferencia de dominio' },
            { id: 'ge2', nombre: 'Renovación de Licencia', categoria: 'gestoria', precio: 15000, descripcion: 'Renovación de licencia de conducir' },
            
            // Transporte
            { id: 'tr1', nombre: 'Traslado Local Corrientes', categoria: 'transporte', precio: 15000, descripcion: 'Traslado de pasajeros dentro de Corrientes Capital' },
            { id: 'tr2', nombre: 'Traslado Interior Corrientes', categoria: 'transporte', precio: 25000, descripcion: 'Traslado de pasajeros al interior de la provincia de Corrientes' }
        ];
        
        // Guardar servicios por defecto
        localStorage.setItem('serviciosFRIOCAS', JSON.stringify(servicios));
        console.log('💾 Servicios por defecto cargados:', servicios.length);
    }
    
    // Renderizar servicios
    serviciosLista.innerHTML = servicios.map((servicio, index) => `
        <div class="servicio-item">
            <div class="servicio-header">
                <span class="servicio-nombre">${servicio.nombre}</span>
                <span class="servicio-precio">$${parseInt(servicio.precio).toLocaleString('es-AR')}</span>
            </div>
            <div class="servicio-descripcion">${servicio.descripcion}</div>
            <div class="servicio-categoria">
                <span class="categoria-tag">${servicio.categoria || 'General'}</span>
            </div>
            <div class="servicio-acciones">
                <button class="btn-categoria" onclick="editarServicio(${index})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-categoria btn-eliminar" onclick="eliminarServicio(${index})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function cargarCategorias() {
    const categorias = JSON.parse(localStorage.getItem('categoriasFRIOCAS') || '[]');
    const categoriasLista = document.getElementById('categoriasLista');
    
    if (!categoriasLista) return;
    
    if (categorias.length === 0) {
        categoriasLista.innerHTML = `
            <div class="categoria-item" style="text-align: center; color: var(--gray-500);">
                <i class="fas fa-tags" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>No hay categorías configuradas</p>
                <p style="font-size: 0.9rem;">Agrega tu primera categoría para comenzar</p>
            </div>
        `;
    } else {
        categoriasLista.innerHTML = categorias.map((categoria, index) => `
            <div class="categoria-item">
                <img src="${categoria.imagen || 'assets/placeholder-categoria.jpg'}" alt="${categoria.nombre}" class="categoria-imagen">
                <div class="categoria-info">
                    <div class="categoria-nombre">${categoria.nombre}</div>
                    <div class="categoria-descripcion">${categoria.descripcion}</div>
                </div>
                <div class="categoria-acciones">
                    <button class="btn-categoria" onclick="editarCategoria(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-categoria btn-eliminar" onclick="eliminarCategoria(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function mostrarFormularioServicio(servicioIndex = null) {
    const servicio = servicioIndex !== null ? 
        JSON.parse(localStorage.getItem('serviciosFRIOCAS'))[servicioIndex] : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal-producto-overlay';
    modal.innerHTML = `
        <div class="modal-producto">
            <div class="modal-producto-header">
                <h3>${servicio ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h3>
                <button onclick="cerrarModalProducto()" class="cerrar-modal">&times;</button>
            </div>
            <div class="modal-producto-content">
                <form id="formularioServicio" class="formulario-producto">
                    <div class="form-group">
                        <label for="nombreServicio">Nombre del Servicio:</label>
                        <input type="text" id="nombreServicio" name="nombre" value="${servicio ? servicio.nombre : ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="precioServicio">Precio ($):</label>
                        <input type="number" id="precioServicio" name="precio" value="${servicio ? servicio.precio : ''}" min="0" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="descripcionServicio">Descripción:</label>
                        <textarea id="descripcionServicio" name="descripcion" rows="3" placeholder="Descripción del servicio...">${servicio ? servicio.descripcion : ''}</textarea>
                    </div>
                    
                    <div class="botones-accion">
                        <button type="button" onclick="cerrarModalProducto()" class="btn-cancelar">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="submit" class="btn-guardar">
                            <i class="fas fa-save"></i> ${servicio ? 'Actualizar' : 'Guardar'} Servicio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar evento del formulario
    document.getElementById('formularioServicio').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarServicio(servicioIndex);
    });
    
    // Mostrar modal con animación
    setTimeout(() => modal.classList.add('active'), 10);
}

function guardarServicio(servicioIndex = null) {
    const formData = new FormData(document.getElementById('formularioServicio'));
    const servicio = {
        nombre: formData.get('nombre'),
        precio: parseFloat(formData.get('precio')),
        descripcion: formData.get('descripcion'),
        fechaCreacion: new Date().toISOString()
    };
    
    // Obtener servicios existentes
    const servicios = JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]');
    
    if (servicioIndex !== null) {
        // Editar servicio existente
        servicios[servicioIndex] = { ...servicios[servicioIndex], ...servicio };
        mostrarNotificacion('✅ Servicio actualizado correctamente', 'success');
    } else {
        // Agregar nuevo servicio
        servicios.push(servicio);
        mostrarNotificacion('✅ Servicio agregado correctamente', 'success');
    }
    
    // Guardar en localStorage
    localStorage.setItem('serviciosFRIOCAS', JSON.stringify(servicios));
    
    // Cerrar modal y recargar lista
    cerrarModalProducto();
    cargarServicios();
}

function editarServicio(index) {
    mostrarFormularioServicio(index);
}

function eliminarServicio(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
        const servicios = JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]');
        servicios.splice(index, 1);
        localStorage.setItem('serviciosFRIOCAS', JSON.stringify(servicios));
        mostrarNotificacion('✅ Servicio eliminado correctamente', 'success');
        cargarServicios();
    }
}

function mostrarFormularioCategoria(categoriaIndex = null) {
    const categoria = categoriaIndex !== null ? 
        JSON.parse(localStorage.getItem('categoriasFRIOCAS'))[categoriaIndex] : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal-producto-overlay';
    modal.innerHTML = `
        <div class="modal-producto">
            <div class="modal-producto-header">
                <h3>${categoria ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</h3>
                <button onclick="cerrarModalProducto()" class="cerrar-modal">&times;</button>
            </div>
            <div class="modal-producto-content">
                <form id="formularioCategoria" class="formulario-producto">
                    <div class="form-group">
                        <label for="nombreCategoria">Nombre de la Categoría:</label>
                        <input type="text" id="nombreCategoria" name="nombre" value="${categoria ? categoria.nombre : ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="descripcionCategoria">Descripción:</label>
                        <textarea id="descripcionCategoria" name="descripcion" rows="3" placeholder="Descripción de la categoría...">${categoria ? categoria.descripcion : ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="imagenCategoria">URL de la Imagen:</label>
                        <input type="url" id="imagenCategoria" name="imagen" value="${categoria ? categoria.imagen : ''}" placeholder="https://ejemplo.com/imagen-categoria.jpg">
                    </div>
                    
                    <div class="botones-accion">
                        <button type="button" onclick="cerrarModalProducto()" class="btn-cancelar">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="submit" class="btn-guardar">
                            <i class="fas fa-save"></i> ${categoria ? 'Actualizar' : 'Guardar'} Categoría
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar evento del formulario
    document.getElementById('formularioCategoria').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarCategoria(categoriaIndex);
    });
    
    // Mostrar modal con animación
    setTimeout(() => modal.classList.add('active'), 10);
}

function guardarCategoria(categoriaIndex = null) {
    const formData = new FormData(document.getElementById('formularioCategoria'));
    const categoria = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        imagen: formData.get('imagen'),
        fechaCreacion: new Date().toISOString()
    };
    
    // Obtener categorías existentes
    const categorias = JSON.parse(localStorage.getItem('categoriasFRIOCAS') || '[]');
    
    if (categoriaIndex !== null) {
        // Editar categoría existente
        categorias[categoriaIndex] = { ...categorias[categoriaIndex], ...categoria };
        mostrarNotificacion('✅ Categoría actualizada correctamente', 'success');
    } else {
        // Agregar nueva categoría
        categorias.push(categoria);
        mostrarNotificacion('✅ Categoría agregada correctamente', 'success');
    }
    
    // Guardar en localStorage
    localStorage.setItem('categoriasFRIOCAS', JSON.stringify(categorias));
    
    // Cerrar modal y recargar lista
    cerrarModalProducto();
    cargarCategorias();
}

function editarCategoria(index) {
    mostrarFormularioCategoria(index);
}

function eliminarCategoria(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        const categorias = JSON.parse(localStorage.getItem('categoriasFRIOCAS') || '[]');
        categorias.splice(index, 1);
        localStorage.setItem('categoriasFRIOCAS', JSON.stringify(categorias));
        mostrarNotificacion('✅ Categoría eliminada correctamente', 'success');
        cargarCategorias();
    }
}

// ===== GESTIÓN DE PRODUCTOS =====
function cargarProductos() {
    console.log('📦 Cargando productos...');
    
    const productosGrid = document.getElementById('productosGrid');
    if (!productosGrid) return;
    
    // Cargar productos guardados
    let productos = JSON.parse(localStorage.getItem('productosFRIOCAS') || '[]');
    
    // Si no hay productos guardados, cargar los productos por defecto de la página principal
    if (productos.length === 0) {
        console.log('📦 Cargando productos por defecto de la página principal...');
        
        // Productos por defecto hardcodeados de script-friocas.js
        productos = [
            // Limpiadores
            { id: 1, nombre: 'Bug Remover', categoria: 'limpiadores', precio: 8500, descripcion: 'Removedor profesional de insectos y suciedad del parabrisas', imagen: 'assets/productos/Limpiadores/Bug Remover.jpg', stock: 15, marca: 'Professional Care' },
            { id: 2, nombre: 'Alcaline Wheels', categoria: 'limpiadores', precio: 12000, descripcion: 'Limpiador alcalino especial para llantas y ruedas', imagen: 'assets/productos/Limpiadores/Alcaline Wheels.jpg', stock: 25, marca: 'Wheel Care' },
            { id: 3, nombre: 'Iron Warning', categoria: 'limpiadores', precio: 15000, descripcion: 'Removedor de óxido y manchas de hierro en pintura', imagen: 'assets/productos/Limpiadores/Iron Warning.jpg', stock: 12, marca: 'Iron Defense' },
            { id: 4, nombre: 'CTRL Z', categoria: 'limpiadores', precio: 9500, descripcion: 'Limpiador desengrasante de alto poder para motores', imagen: 'assets/productos/Limpiadores/CTRL Z.jpg', stock: 18, marca: 'Engine Care' },
            { id: 5, nombre: 'All Clean', categoria: 'limpiadores', precio: 11000, descripcion: 'Limpiador multiuso para interior y exterior del vehículo', imagen: 'assets/productos/Limpiadores/All Clean.jpg', stock: 20, marca: 'Universal Clean' },
            { id: 6, nombre: 'Inferno Gel', categoria: 'limpiadores', precio: 13500, descripcion: 'Gel limpiador de alta temperatura para motores', imagen: 'assets/productos/Limpiadores/Inferno Gel.jpg', stock: 10, marca: 'Hot Clean' },
            { id: 7, nombre: 'Clean Vision', categoria: 'limpiadores', precio: 8000, descripcion: 'Limpiador especial para vidrios y espejos', imagen: 'assets/productos/Limpiadores/Clean Vision.jpg', stock: 22, marca: 'Glass Care' },
            
            // Shampoo
            { id: 8, nombre: 'ICE Shampoo', categoria: 'shampoo', precio: 12500, descripcion: 'Shampoo con efecto hielo para acabado brillante', imagen: 'assets/productos/shampoo/ICE.jpg', stock: 15, marca: 'Ice Effect' },
            { id: 9, nombre: 'Energy Shampoo', categoria: 'shampoo', precio: 13500, descripcion: 'Shampoo energizante con protección UV', imagen: 'assets/productos/shampoo/Energy.jpg', stock: 18, marca: 'Energy Boost' },
            { id: 10, nombre: 'Pure Foam', categoria: 'shampoo', precio: 14500, descripcion: 'Shampoo de espuma pura para lavado suave', imagen: 'assets/productos/shampoo/Pure Foam.jpg', stock: 12, marca: 'Pure Care' },
            { id: 11, nombre: 'Banana Shampoo', categoria: 'shampoo', precio: 15500, descripcion: 'Shampoo con extracto de banana para brillo natural', imagen: 'assets/productos/shampoo/Banana.jpg', stock: 14, marca: 'Natural Glow' },
            { id: 12, nombre: 'Hyper Black', categoria: 'shampoo', precio: 13000, descripcion: 'Shampoo especial para vehículos negros', imagen: 'assets/productos/shampoo/Hyper Black.jpg', stock: 16, marca: 'Black Magic' },
            { id: 13, nombre: 'Elite Shampoo', categoria: 'shampoo', precio: 14000, descripcion: 'Shampoo premium para acabado profesional', imagen: 'assets/productos/shampoo/Elite.jpg', stock: 10, marca: 'Elite Care' },
            { id: 14, nombre: 'DIP CLUB', categoria: 'shampoo', precio: 16000, descripcion: 'Shampoo exclusivo para vehículos de alta gama', imagen: 'assets/productos/shampoo/DIP CLUB.jpg', stock: 8, marca: 'VIP Care' },
            
            // Ceras Líquidas
            { id: 15, nombre: 'Extreme Detail', categoria: 'ceras', precio: 18000, descripcion: 'Cera líquida de alta duración para acabado extremo', imagen: 'assets/productos/Ceras líquidas/Extreme Detail.jpg', stock: 12, marca: 'Extreme Care' },
            { id: 16, nombre: 'Illusion Wax', categoria: 'ceras', precio: 16500, descripcion: 'Cera líquida con efecto espejo para acabado perfecto', imagen: 'assets/productos/Ceras líquidas/Illusion Wax.jpg', stock: 15, marca: 'Illusion Pro' },
            { id: 17, nombre: 'Lava Crush', categoria: 'ceras', precio: 17500, descripcion: 'Cera líquida de alta temperatura para protección máxima', imagen: 'assets/productos/Ceras líquidas/Lava Crush.jpg', stock: 10, marca: 'Lava Shield' },
            { id: 18, nombre: 'Seal It All', categoria: 'ceras', precio: 16000, descripcion: 'Sellador líquido de larga duración para protección total', imagen: 'assets/productos/Ceras líquidas/Seal It All.jpg', stock: 18, marca: 'Seal Pro' },
            { id: 19, nombre: 'The Boss', categoria: 'ceras', precio: 19000, descripcion: 'Cera líquida premium para acabado profesional', imagen: 'assets/productos/Ceras líquidas/The Boss.jpg', stock: 8, marca: 'Boss Premium' },
            
            // Iluminación
            { id: 20, nombre: 'Cree Led Mi2', categoria: 'iluminacion', precio: 25000, descripcion: 'Kit de iluminación LED Cree de alta potencia', imagen: 'assets/productos/iluminacion/Cree Led Mi2.jpg', stock: 6, marca: 'Cree Lighting' },
            
            // Revividores de Interiores
            { id: 21, nombre: 'Illusion Wax Interior', categoria: 'revividores', precio: 14000, descripcion: 'Revividor de interiores con efecto espejo', imagen: 'assets/productos/Revividores de interiores/Illusion Wax.jpg', stock: 12, marca: 'Illusion Interior' },
            { id: 22, nombre: 'Lava Crush Interior', categoria: 'revividores', precio: 15000, descripcion: 'Revividor de interiores de alta duración', imagen: 'assets/productos/Revividores de interiores/Lava Crush.jpg', stock: 10, marca: 'Lava Interior' }
        ];
        
        // Guardar productos por defecto
        localStorage.setItem('productosFRIOCAS', JSON.stringify(productos));
        console.log('💾 Productos por defecto cargados:', productos.length);
    }
    
    // Mostrar lista de productos
    renderizarListaProductos(productos);
}

function renderizarListaProductos(productos) {
    const productosGrid = document.getElementById('productosGrid');
    
    productosGrid.innerHTML = `
        <div class="productos-lista">
            <div class="productos-header">
                <h3>Productos Activos (${productos.length})</h3>
                <button class="add-btn" onclick="mostrarFormularioProducto()">
                    <i class="fas fa-plus"></i>
                    Agregar Producto
                </button>
            </div>
            <div class="productos-table">
                <table>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productos.map((producto, index) => `
                            <tr>
                                <td>
                                    <img src="${producto.imagen || 'assets/placeholder-producto.jpg'}" alt="${producto.nombre}" class="producto-thumb">
                                </td>
                                <td>${producto.nombre}</td>
                                <td>${producto.categoria}</td>
                                <td>
                                    <span class="precio-actual">$${producto.precio}</span>
                                    <button class="btn-editar-precio" onclick="editarPrecio(${index})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                                <td>
                                    <span class="stock-actual">${producto.stock}</span>
                                    <button class="btn-editar-stock" onclick="editarStock(${index})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                                <td>
                                    <button class="btn-accion" onclick="editarProducto(${index})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-accion btn-eliminar" onclick="eliminarProducto(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function mostrarFormularioProducto(productoIndex = null) {
    const producto = productoIndex !== null ? 
        JSON.parse(localStorage.getItem('productosFRIOCAS'))[productoIndex] : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal-producto-overlay';
    modal.innerHTML = `
        <div class="modal-producto">
            <div class="modal-producto-header">
                <h3>${producto ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
                <button onclick="cerrarModalProducto()" class="cerrar-modal">&times;</button>
            </div>
            <div class="modal-producto-content">
                <form id="formularioProducto" class="formulario-producto">
                    <div class="form-group">
                        <label for="nombreProducto">Nombre del Producto:</label>
                        <input type="text" id="nombreProducto" name="nombre" value="${producto ? producto.nombre : ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="categoriaProducto">Categoría:</label>
                        <select id="categoriaProducto" name="categoria" required>
                            <option value="">Seleccionar categoría</option>
                            <option value="Limpiadores" ${producto && producto.categoria === 'Limpiadores' ? 'selected' : ''}>Limpiadores</option>
                            <option value="Shampoo" ${producto && producto.categoria === 'Shampoo' ? 'selected' : ''}>Shampoo</option>
                            <option value="Ceras" ${producto && producto.categoria === 'Ceras' ? 'selected' : ''}>Ceras</option>
                            <option value="Iluminación" ${producto && producto.categoria === 'Iluminación' ? 'selected' : ''}>Iluminación</option>
                            <option value="Revividores" ${producto && producto.categoria === 'Revividores' ? 'selected' : ''}>Revividores</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="precioProducto">Precio ($):</label>
                        <input type="number" id="precioProducto" name="precio" value="${producto ? producto.precio : ''}" min="0" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="stockProducto">Stock Disponible:</label>
                        <input type="number" id="stockProducto" name="stock" value="${producto ? producto.stock : ''}" min="0" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="descripcionProducto">Descripción:</label>
                        <textarea id="descripcionProducto" name="descripcion" rows="3" placeholder="Descripción del producto...">${producto ? producto.descripcion : ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="imagenProducto">URL de la Imagen:</label>
                        <input type="url" id="imagenProducto" name="imagen" value="${producto ? producto.imagen : ''}" placeholder="https://ejemplo.com/imagen.jpg">
                    </div>
                    
                    <div class="botones-accion">
                        <button type="button" onclick="cerrarModalProducto()" class="btn-cancelar">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="submit" class="btn-guardar">
                            <i class="fas fa-save"></i> ${producto ? 'Actualizar' : 'Guardar'} Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar evento del formulario
    document.getElementById('formularioProducto').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarProducto(productoIndex);
    });
    
    // Mostrar modal con animación
    setTimeout(() => modal.classList.add('active'), 10);
}

function cerrarModalProducto() {
    const modal = document.querySelector('.modal-producto-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function guardarProducto(productoIndex = null) {
    const formData = new FormData(document.getElementById('formularioProducto'));
    const producto = {
        nombre: formData.get('nombre'),
        categoria: formData.get('categoria'),
        precio: parseFloat(formData.get('precio')),
        stock: parseInt(formData.get('stock')),
        descripcion: formData.get('descripcion'),
        imagen: formData.get('imagen'),
        fechaCreacion: new Date().toISOString()
    };
    
    // Obtener productos existentes
    const productos = JSON.parse(localStorage.getItem('productosFRIOCAS') || '[]');
    
    if (productoIndex !== null) {
        // Editar producto existente
        productos[productoIndex] = { ...productos[productoIndex], ...producto };
        mostrarNotificacion('✅ Producto actualizado correctamente', 'success');
    } else {
        // Agregar nuevo producto
        productos.push(producto);
        mostrarNotificacion('✅ Producto agregado correctamente', 'success');
    }
    
    // Guardar en localStorage
    localStorage.setItem('productosFRIOCAS', JSON.stringify(productos));
    
    // Cerrar modal y recargar lista
    cerrarModalProducto();
    cargarProductos();
}

function editarProducto(index) {
    mostrarFormularioProducto(index);
}

function eliminarProducto(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        const productos = JSON.parse(localStorage.getItem('productosFRIOCAS') || '[]');
        productos.splice(index, 1);
        localStorage.setItem('productosFRIOCAS', JSON.stringify(productos));
        mostrarNotificacion('✅ Producto eliminado correctamente', 'success');
        cargarProductos();
    }
}

function editarPrecio(index) {
    const productos = JSON.parse(localStorage.getItem('productosFRIOCAS') || '[]');
    const producto = productos[index];
    
    const nuevoPrecio = prompt(`Editar precio de "${producto.nombre}":`, producto.precio);
    
    if (nuevoPrecio !== null && !isNaN(nuevoPrecio)) {
        productos[index].precio = parseFloat(nuevoPrecio);
        localStorage.setItem('productosFRIOCAS', JSON.stringify(productos));
        mostrarNotificacion('✅ Precio actualizado correctamente', 'success');
        cargarProductos();
    }
}

function editarStock(index) {
    const productos = JSON.parse(localStorage.getItem('productosFRIOCAS') || '[]');
    const producto = productos[index];
    
    const nuevoStock = prompt(`Editar stock de "${producto.nombre}":`, producto.stock);
    
    if (nuevoStock !== null && !isNaN(nuevoStock)) {
        productos[index].stock = parseInt(nuevoStock);
        localStorage.setItem('productosFRIOCAS', JSON.stringify(productos));
        mostrarNotificacion('✅ Stock actualizado correctamente', 'success');
        cargarProductos();
    }
}

// ===== GESTIÓN DE OFERTAS =====
function cargarOfertas() {
    console.log('🏷️ Cargando ofertas...');
    
    const ofertasGrid = document.getElementById('ofertasGrid');
    if (!ofertasGrid) return;
    
    ofertasGrid.innerHTML = `
        <div class="ofertas-placeholder">
            <i class="fas fa-tags"></i>
            <h3>Ofertas y Combos</h3>
            <p>Aquí podrás crear ofertas especiales y combos de productos</p>
            <button class="add-btn" onclick="mostrarFormularioOferta()">
                <i class="fas fa-plus"></i>
                Crear Primera Oferta
            </button>
        </div>
    `;
}

function mostrarFormularioOferta() {
    // Aquí se mostraría un modal con el formulario de oferta
    mostrarNotificacion('🔧 Función en desarrollo - Formulario de ofertas', 'info');
}

// ===== ESTADÍSTICAS =====
function cargarEstadisticas() {
    console.log('📊 Cargando estadísticas...');
    
    const periodo = document.getElementById('periodoEstadisticas')?.value || 'semana';
    
    // Generar datos de ejemplo para las estadísticas
    const estadisticas = generarEstadisticasEjemplo(periodo);
    
    // Actualizar tarjetas de resumen
    actualizarTarjetasEstadisticas(estadisticas);
    
    // Actualizar gráficos
    actualizarGraficosEstadisticas(estadisticas);
    
    // Actualizar listas de detalles
    actualizarDetallesEstadisticas(estadisticas);
}

function generarEstadisticasEjemplo(periodo) {
    const ahora = new Date();
    let fechaInicio;
    
    switch(periodo) {
        case 'hoy':
            fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
            break;
        case 'semana':
            fechaInicio = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'mes':
            fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
            break;
        case 'año':
            fechaInicio = new Date(ahora.getFullYear(), 0, 1);
            break;
        default:
            fechaInicio = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    // Generar datos de ventas
    const ventasPorDia = [];
    const fechaActual = new Date(fechaInicio);
    while (fechaActual <= ahora) {
        ventasPorDia.push({
            fecha: new Date(fechaActual),
            ventas: Math.floor(Math.random() * 20) + 5,
            ingresos: Math.floor(Math.random() * 50000) + 10000
        });
        fechaActual.setDate(fechaActual.getDate() + 1);
    }
    
    // Generar productos más vendidos
    const productosVendidos = [
        { nombre: 'Lavado Exterior Completo', ventas: 45, porcentaje: 25 },
        { nombre: 'Limpieza de Interior', ventas: 38, porcentaje: 21 },
        { nombre: 'Lavado Premium', ventas: 32, porcentaje: 18 },
        { nombre: 'Pulido y Encerado', ventas: 28, porcentaje: 16 },
        { nombre: 'Limpieza de Motor', ventas: 22, porcentaje: 12 },
        { nombre: 'Otros Servicios', ventas: 15, porcentaje: 8 }
    ];
    
    // Generar transacciones recientes
    const transacciones = [
        { id: 'TXN-001', cliente: 'María González', monto: 25000, fecha: new Date(ahora.getTime() - 2 * 60 * 60 * 1000), estado: 'completada' },
        { id: 'TXN-002', cliente: 'Carlos López', monto: 18000, fecha: new Date(ahora.getTime() - 4 * 60 * 60 * 1000), estado: 'completada' },
        { id: 'TXN-003', cliente: 'Ana Martínez', monto: 32000, fecha: new Date(ahora.getTime() - 6 * 60 * 60 * 1000), estado: 'pendiente' },
        { id: 'TXN-004', cliente: 'Roberto Silva', monto: 15000, fecha: new Date(ahora.getTime() - 8 * 60 * 60 * 1000), estado: 'completada' },
        { id: 'TXN-005', cliente: 'Laura Fernández', monto: 28000, fecha: new Date(ahora.getTime() - 10 * 60 * 60 * 1000), estado: 'completada' }
    ];
    
    // Generar actividad reciente
    const actividad = [
        { tipo: 'venta', descripcion: 'Nueva venta registrada', fecha: new Date(ahora.getTime() - 30 * 60 * 1000) },
        { tipo: 'cliente', descripcion: 'Cliente nuevo registrado', fecha: new Date(ahora.getTime() - 45 * 60 * 1000) },
        { tipo: 'servicio', descripcion: 'Servicio completado', fecha: new Date(ahora.getTime() - 60 * 60 * 1000) },
        { tipo: 'pago', descripcion: 'Pago procesado', fecha: new Date(ahora.getTime() - 90 * 60 * 1000) },
        { tipo: 'reserva', descripcion: 'Nueva reserva creada', fecha: new Date(ahora.getTime() - 120 * 60 * 1000) }
    ];
    
    // Calcular totales
    const totalVentas = ventasPorDia.reduce((sum, dia) => sum + dia.ventas, 0);
    const totalIngresos = ventasPorDia.reduce((sum, dia) => sum + dia.ingresos, 0);
    const clientesNuevos = Math.floor(Math.random() * 15) + 5;
    const satisfaccion = Math.floor(Math.random() * 20) + 80; // 80-100%
    
    return {
        periodo,
        totalVentas,
        totalIngresos,
        clientesNuevos,
        satisfaccion,
        ventasPorDia,
        productosVendidos,
        transacciones,
        actividad
    };
}

function actualizarTarjetasEstadisticas(estadisticas) {
    // Actualizar tarjetas de resumen
    const totalVentasEl = document.getElementById('totalVentas');
    const ingresosTotalesEl = document.getElementById('ingresosTotales');
    const clientesNuevosEl = document.getElementById('clientesNuevos');
    const satisfaccionEl = document.getElementById('satisfaccion');
    
    if (totalVentasEl) totalVentasEl.textContent = estadisticas.totalVentas;
    if (ingresosTotalesEl) ingresosTotalesEl.textContent = `$${estadisticas.totalIngresos.toLocaleString('es-AR')}`;
    if (clientesNuevosEl) clientesNuevosEl.textContent = estadisticas.clientesNuevos;
    if (satisfaccionEl) satisfaccionEl.textContent = `${estadisticas.satisfaccion}%`;
}

function actualizarGraficosEstadisticas(estadisticas) {
    // Gráfico de ventas por día
    const ventasChart = document.getElementById('ventasChart');
    if (ventasChart) {
        ventasChart.innerHTML = `
            <div class="chart-bars">
                ${estadisticas.ventasPorDia.map(dia => `
                    <div class="chart-bar">
                        <div class="bar" style="height: ${(dia.ventas / Math.max(...estadisticas.ventasPorDia.map(d => d.ventas))) * 100}%"></div>
                        <span class="bar-label">${dia.fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}</span>
                        <span class="bar-value">${dia.ventas}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Gráfico de productos más vendidos
    const productosChart = document.getElementById('productosChart');
    if (productosChart) {
        productosChart.innerHTML = `
            <div class="chart-pie">
                ${estadisticas.productosVendidos.map(producto => `
                    <div class="pie-segment" style="--percentage: ${producto.porcentaje}%">
                        <span class="segment-label">${producto.nombre}</span>
                        <span class="segment-value">${producto.ventas} ventas</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function actualizarDetallesEstadisticas(estadisticas) {
    // Lista de transacciones
    const transaccionesList = document.getElementById('transaccionesList');
    if (transaccionesList) {
        transaccionesList.innerHTML = estadisticas.transacciones.map(txn => `
            <div class="transaction-item ${txn.estado}">
                <div class="transaction-info">
                    <h4>${txn.id}</h4>
                    <p>${txn.cliente}</p>
                </div>
                <div class="transaction-meta">
                    <span class="transaction-amount">$${txn.monto.toLocaleString('es-AR')}</span>
                    <span class="transaction-date">${txn.fecha.toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span class="transaction-status ${txn.estado}">${txn.estado}</span>
                </div>
            </div>
        `).join('');
    }
    
    // Lista de actividad
    const actividadList = document.getElementById('actividadList');
    if (actividadList) {
        actividadList.innerHTML = estadisticas.actividad.map(act => `
            <div class="activity-item ${act.tipo}">
                <div class="activity-icon">
                    <i class="fas fa-${getActivityIcon(act.tipo)}"></i>
                </div>
                <div class="activity-content">
                    <p>${act.descripcion}</p>
                    <span class="activity-time">${calcularTiempoTranscurrido(act.fecha)}</span>
                </div>
            </div>
        `).join('');
    }
}

function getActivityIcon(tipo) {
    const icons = {
        venta: 'shopping-cart',
        cliente: 'user-plus',
        servicio: 'check-circle',
        pago: 'credit-card',
        reserva: 'calendar-plus'
    };
    return icons[tipo] || 'info-circle';
}

// ===== UTILIDADES =====
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <span>${mensaje}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notificacion-cerrar">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Agregar estilos
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#10B981' : tipo === 'error' ? '#EF4444' : tipo === 'warning' ? '#F59E0B' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 5000);
    
    console.log(`📢 Notificación: ${mensaje}`);
}

// ===== ESTILOS CSS DINÁMICOS =====
const estilosDinamicos = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .productos-placeholder, .ofertas-placeholder {
        text-align: center;
        padding: 4rem 2rem;
        background: var(--white);
        border-radius: 15px;
        box-shadow: var(--shadow-md);
        border: 2px dashed var(--gray-300);
    }
    
    .productos-placeholder i, .ofertas-placeholder i {
        font-size: 4rem;
        color: var(--gray-400);
        margin-bottom: 1rem;
    }
    
    .productos-placeholder h3, .ofertas-placeholder h3 {
        color: var(--gray-700);
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .productos-placeholder p, .ofertas-placeholder p {
        color: var(--gray-600);
        margin-bottom: 2rem;
    }
`;

// Agregar estilos al head
const styleSheet = document.createElement('style');
styleSheet.textContent = estilosDinamicos;
document.head.appendChild(styleSheet);

// ===== PROTECCIÓN DE PÁGINA =====
// Prevenir acceso directo al panel sin login
if (window.location.pathname.includes('admin-friocas.html')) {
    // Verificar si hay sesión válida
    const adminSession = localStorage.getItem('adminSession');
    
    if (!adminSession) {
        // No hay sesión, pero permitir acceso al login
        console.log('🔐 No hay sesión activa - Mostrando pantalla de login');
    } else {
        // Verificar si la sesión es válida
        try {
            const sessionData = JSON.parse(adminSession);
            const now = Date.now();
            
            if (now - sessionData.timestamp >= ADMIN_CONFIG.sessionTimeout) {
                // Sesión expirada, limpiar y permitir login
                localStorage.removeItem('adminSession');
                console.log('⏰ Sesión expirada - Mostrando pantalla de login');
            } else {
                // Sesión válida, permitir acceso
                console.log('✅ Sesión válida - Acceso permitido');
            }
        } catch (error) {
            // Error al parsear sesión, limpiar y permitir login
            localStorage.removeItem('adminSession');
            console.log('❌ Error en sesión - Mostrando pantalla de login');
        }
    }
}

console.log('🎯 Panel de Administración FRIOCAS - Listo para usar');
console.log('🔐 Contraseña de administrador:', ADMIN_CONFIG.password);

// ===== FUNCIÓN DE DEPURACIÓN =====
function debugAdminPanel() {
    console.log('🔍 === DEPURACIÓN DEL PANEL DE ADMINISTRACIÓN ===');
    
    // Verificar elementos del DOM
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    const loginForm = document.getElementById('loginForm');
    
    console.log('📋 Elementos del DOM:');
    console.log('- loginScreen:', loginScreen ? '✅ Encontrado' : '❌ No encontrado');
    console.log('- adminPanel:', adminPanel ? '✅ Encontrado' : '❌ No encontrado');
    console.log('- loginForm:', loginForm ? '✅ Encontrado' : '❌ No encontrado');
    
    if (loginScreen) {
        console.log('- loginScreen display:', window.getComputedStyle(loginScreen).display);
    }
    
    if (adminPanel) {
        console.log('- adminPanel display:', window.getComputedStyle(adminPanel).display);
    }
    
    // Verificar sesión
    const adminSession = localStorage.getItem('adminSession');
    console.log('🔐 Estado de sesión:', adminSession ? '✅ Activa' : '❌ Inactiva');
    
    if (adminSession) {
        try {
            const sessionData = JSON.parse(adminSession);
            const now = Date.now();
            const elapsed = now - sessionData.timestamp;
            const remaining = ADMIN_CONFIG.sessionTimeout - elapsed;
            
            console.log('- Tiempo transcurrido:', Math.round(elapsed / 1000 / 60), 'minutos');
            console.log('- Tiempo restante:', Math.round(remaining / 1000 / 60), 'minutos');
            console.log('- Sesión válida:', remaining > 0 ? '✅ Sí' : '❌ No');
        } catch (error) {
            console.log('- Error al parsear sesión:', error.message);
        }
    }
    
    console.log('🔍 === FIN DE DEPURACIÓN ===');
}

// ===== FUNCIÓN PARA LIMPIAR SESIÓN =====
function limpiarSesionAdmin() {
    console.log('🧹 Limpiando sesión de administrador...');
    localStorage.removeItem('adminSession');
    
    // Asegurar que el login esté visible
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginScreen) loginScreen.style.display = 'flex';
    if (adminPanel) adminPanel.style.display = 'none';
    
    // Limpiar formulario
    const passwordInput = document.getElementById('password');
    if (passwordInput) passwordInput.value = '';
    
    console.log('✅ Sesión limpiada - Login visible');
}

// Ejecutar depuración después de 2 segundos
setTimeout(debugAdminPanel, 2000);

// Limpiar sesión al cargar (para debugging)
// limpiarSesionAdmin();

// ===== FUNCIONES DE CONFIGURACIÓN DE PAGOS =====
function guardarConfiguracionPagos(event) {
    event.preventDefault();
    console.log('💾 Guardando configuración de pagos...');
    
    const form = event.target;
    const formData = new FormData(form);
    const config = Object.fromEntries(formData.entries());
    
    // Determinar qué método de pago está activo
    const metodoActivo = document.querySelector('.method-tab.active')?.getAttribute('data-method') || 'transferencia';
    
    // Validar campos según el método activo
    let camposRequeridos = [];
    let camposVacios = [];
    
    if (metodoActivo === 'transferencia') {
        camposRequeridos = ['banco', 'titular', 'tipoCuenta', 'numeroCuenta', 'cbu'];
    } else if (metodoActivo === 'alias') {
        camposRequeridos = ['alias', 'cvu', 'titularAlias'];
    } else if (metodoActivo === 'cbu') {
        camposRequeridos = ['cbuDirecto', 'bancoCbu', 'titularCbu'];
    }
    
    camposVacios = camposRequeridos.filter(campo => !config[campo] || config[campo].trim() === '');
    
    if (camposVacios.length > 0) {
        mostrarNotificacion(`❌ Faltan campos requeridos para ${metodoActivo}: ${camposVacios.join(', ')}`, 'error');
        return;
    }
    
    // Validar formato de CBU (transferencia)
    if (config.cbu && !/^\d{22}$/.test(config.cbu)) {
        mostrarNotificacion('❌ El CBU debe tener exactamente 22 dígitos numéricos', 'error');
        return;
    }
    
    // Validar formato de Alias si está presente
    if (config.alias && !/^[A-Z0-9.]{6}$/.test(config.alias)) {
        mostrarNotificacion('❌ El Alias debe tener exactamente 6 caracteres (letras, números y puntos)', 'error');
        return;
    }
    
    // Validar formato de CVU si está presente
    if (config.cvu && !/^\d{22}$/.test(config.cvu)) {
        mostrarNotificacion('❌ El CVU debe tener exactamente 22 dígitos numéricos', 'error');
        return;
    }
    
    // Validar formato de CBU Directo si está presente
    if (config.cbuDirecto && !/^\d{22}$/.test(config.cbuDirecto)) {
        mostrarNotificacion('❌ El CBU Directo debe tener exactamente 22 dígitos numéricos', 'error');
        return;
    }
    
    // Guardar en localStorage
    localStorage.setItem('paymentConfig', JSON.stringify(config));
    
    mostrarNotificacion('✅ Configuración de pagos guardada correctamente', 'success');
    
    // Actualizar vista previa
    actualizarVistaPrevia();
    
    console.log('💾 Configuración guardada:', config);
}

function probarConfiguracion() {
    console.log('🧪 Probando configuración de pagos...');
    
    const config = JSON.parse(localStorage.getItem('paymentConfig') || '{}');
    
    if (!config.cbu && !config.alias) {
        mostrarNotificacion('❌ No hay configuración de pagos para probar', 'error');
        return;
    }
    
    // Simular prueba de configuración
    mostrarNotificacion('🧪 Probando configuración...', 'info');
    
    setTimeout(() => {
        if (config.cbu) {
            mostrarNotificacion('✅ CBU válido: ' + config.cbu.substring(0, 8) + '...', 'success');
        }
        if (config.alias) {
            mostrarNotificacion('✅ Alias válido: ' + config.alias, 'success');
        }
        if (config.cvu) {
            mostrarNotificacion('✅ CVU válido: ' + config.cvu.substring(0, 8) + '...', 'success');
        }
    }, 1000);
}

function actualizarVistaPrevia() {
    const preview = document.getElementById('configPreview');
    if (!preview) return;
    
    const form = document.getElementById('paymentForm');
    if (!form) {
        preview.innerHTML = '<p class="preview-placeholder">Formulario no encontrado</p>';
        return;
    }
    
    const formData = new FormData(form);
    const config = Object.fromEntries(formData.entries());
    
    // Verificar si hay datos
    const tieneDatos = Object.values(config).some(value => value && value.trim() !== '');
    
    if (!tieneDatos) {
        preview.innerHTML = '<p class="preview-placeholder">Configura los datos para ver la vista previa</p>';
        return;
    }
    
    let previewHTML = '<div class="preview-content">';
    
    // Mostrar datos de transferencia bancaria
    if (config.banco || config.titular || config.tipoCuenta || config.numeroCuenta || config.cbu) {
        previewHTML += '<h5 style="color: var(--gray-700); margin-bottom: 0.5rem;">🏦 Transferencia Bancaria</h5>';
        
        if (config.banco) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Banco:</span>
                <span class="preview-value">${config.banco}</span>
            </div>`;
        }
        
        if (config.titular) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Titular:</span>
                <span class="preview-value">${config.titular}</span>
            </div>`;
        }
        
        if (config.tipoCuenta) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Tipo de Cuenta:</span>
                <span class="preview-value">${config.tipoCuenta}</span>
            </div>`;
        }
        
        if (config.numeroCuenta) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Número de Cuenta:</span>
                <span class="preview-value">${config.numeroCuenta}</span>
            </div>`;
        }
        
        if (config.cbu) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">CBU:</span>
                <span class="preview-value">${config.cbu}</span>
            </div>`;
        }
    }
    
    // Mostrar datos de Alias/CVU
    if (config.alias || config.cvu || config.titularAlias) {
        previewHTML += '<h5 style="color: var(--gray-700); margin: 1rem 0 0.5rem 0;">🏷️ Alias/CVU</h5>';
        
        if (config.alias) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Alias:</span>
                <span class="preview-value">${config.alias}</span>
            </div>`;
        }
        
        if (config.cvu) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">CVU:</span>
                <span class="preview-value">${config.cvu}</span>
            </div>`;
        }
        
        if (config.titularAlias) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Titular:</span>
                <span class="preview-value">${config.titularAlias}</span>
            </div>`;
        }
    }
    
    // Mostrar datos de CBU directo
    if (config.cbuDirecto || config.bancoCbu || config.titularCbu) {
        previewHTML += '<h5 style="color: var(--gray-700); margin: 1rem 0 0.5rem 0;">🔢 CBU Directo</h5>';
        
        if (config.cbuDirecto) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">CBU:</span>
                <span class="preview-value">${config.cbuDirecto}</span>
            </div>`;
        }
        
        if (config.bancoCbu) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Banco:</span>
                <span class="preview-value">${config.bancoCbu}</span>
            </div>`;
        }
        
        if (config.titularCbu) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Titular:</span>
                <span class="preview-value">${config.titularCbu}</span>
            </div>`;
        }
    }
    
    // Mostrar configuración adicional
    if (config.emailPagos || config.telefonoPagos || config.mensajeTransferencia) {
        previewHTML += '<h5 style="color: var(--gray-700); margin: 1rem 0 0.5rem 0;">⚙️ Configuración Adicional</h5>';
        
        if (config.emailPagos) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Email:</span>
                <span class="preview-value">${config.emailPagos}</span>
            </div>`;
        }
        
        if (config.telefonoPagos) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Teléfono:</span>
                <span class="preview-value">${config.telefonoPagos}</span>
            </div>`;
        }
        
        if (config.mensajeTransferencia) {
            previewHTML += `<div class="preview-item">
                <span class="preview-label">Mensaje:</span>
                <span class="preview-value">${config.mensajeTransferencia}</span>
            </div>`;
        }
    }
    
    previewHTML += '</div>';
    preview.innerHTML = previewHTML;
}

// ===== SINCRONIZACIÓN CON PÁGINA PRINCIPAL =====
function sincronizarConPaginaPrincipal() {
    console.log('🔄 Sincronizando datos con la página principal...');
    
    try {
        // Sincronizar productos con la página principal
        const productos = JSON.parse(localStorage.getItem('productosFRIOCAS') || '[]');
        if (productos.length > 0) {
            // Guardar en la clave que usa la página principal
            localStorage.setItem('PRODUCTOS_DATA', JSON.stringify(productos));
            console.log('✅ Productos sincronizados con página principal:', productos.length);
        }
        
        // Sincronizar configuración de empresa
        const configEmpresa = JSON.parse(localStorage.getItem('friocasConfig') || '{}');
        if (Object.keys(configEmpresa).length > 0) {
            // Guardar en la clave que usa la página principal
            localStorage.setItem('CONFIG_EMPRESA', JSON.stringify(configEmpresa));
            console.log('✅ Configuración de empresa sincronizada con página principal');
        }
        
        // Sincronizar configuración de pagos
        const configPagos = JSON.parse(localStorage.getItem('paymentConfig') || '{}');
        if (Object.keys(configPagos).length > 0) {
            localStorage.setItem('PAYMENT_CONFIG', JSON.stringify(configPagos));
            console.log('✅ Configuración de pagos sincronizada con página principal');
        }
        
        // Forzar recarga de la página principal si está abierta
        if (window.opener && !window.opener.closed) {
            try {
                window.opener.location.reload();
                console.log('🔄 Página principal recargada automáticamente');
            } catch (error) {
                console.log('⚠️ No se pudo recargar la página principal automáticamente');
            }
        }
        
        mostrarNotificacion('🔄 Datos sincronizados correctamente con la página principal', 'success');
        
    } catch (error) {
        console.error('❌ Error en sincronización:', error);
        mostrarNotificacion('❌ Error al sincronizar datos', 'error');
    }
}

// Sincronizar automáticamente cada vez que se guarde algo
function guardarYSincronizar(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
    sincronizarConPaginaPrincipal();
}

// Función para exportar datos
function exportarDatos() {
    const datosCompletos = {
        productos: JSON.parse(localStorage.getItem('productosFRIOCAS') || '[]'),
        servicios: JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]'),
        categorias: JSON.parse(localStorage.getItem('categoriasFRIOCAS') || '[]'),
        configEmpresa: JSON.parse(localStorage.getItem('friocasConfig') || '{}'),
        configPagos: JSON.parse(localStorage.getItem('paymentConfig') || '{}'),
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(datosCompletos, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `friocas-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    mostrarNotificacion('📦 Datos exportados correctamente', 'success');
}

// Función para importar datos
function importarDatos(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const datos = JSON.parse(e.target.result);
            
            // Validar estructura
            if (datos.productos) localStorage.setItem('productosFRIOCAS', JSON.stringify(datos.productos));
            if (datos.servicios) localStorage.setItem('serviciosFRIOCAS', JSON.stringify(datos.servicios));
            if (datos.categorias) localStorage.setItem('categoriasFRIOCAS', JSON.stringify(datos.categorias));
            if (datos.configEmpresa) localStorage.setItem('friocasConfig', JSON.stringify(datos.configEmpresa));
            if (datos.configPagos) localStorage.setItem('paymentConfig', JSON.stringify(datos.configPagos));
            
            mostrarNotificacion('📥 Datos importados correctamente', 'success');
            
            // Recargar las secciones
            cargarProductos();
            cargarServicios();
            cargarCategorias();
            cargarConfiguracionGeneral();
            cargarConfiguracionPagos();
            
        } catch (error) {
            mostrarNotificacion('❌ Error al importar datos: archivo inválido', 'error');
        }
    };
    reader.readAsText(file);
}

// ===== SISTEMA DE MONITOREO Y NOTIFICACIONES =====

// Monitoreo de usuarios activos
function iniciarMonitoreoUsuarios() {
    console.log('👥 Iniciando monitoreo de usuarios activos...');
    
    // Simular usuarios activos (en una implementación real, esto vendría de un servidor)
    setInterval(() => {
        // Simular actividad de usuarios
        const nuevosUsuarios = Math.floor(Math.random() * 5) + 1; // 1-5 usuarios nuevos
        activeUsers = Math.max(0, activeUsers + nuevosUsuarios - Math.floor(Math.random() * 3));
        
        // Registrar actividad
        registrarActividadUsuario('navegacion', `Usuarios activos: ${activeUsers}`);
        
        // Actualizar dashboard si está visible
        actualizarEstadisticasDashboard();
        
    }, 30000); // Cada 30 segundos
}

function registrarActividadUsuario(tipo, descripcion) {
    const actividad = {
        timestamp: new Date().toISOString(),
        tipo: tipo,
        descripcion: descripcion,
        usuariosActivos: activeUsers
    };
    
    userActivityLog.push(actividad);
    
    // Mantener solo las últimas 100 actividades
    if (userActivityLog.length > 100) {
        userActivityLog = userActivityLog.slice(-100);
    }
    
    // Guardar en localStorage
    localStorage.setItem('userActivityLog', JSON.stringify(userActivityLog));
    
    console.log('📊 Actividad registrada:', actividad);
}

// Sistema de notificaciones
function agregarNotificacion(titulo, mensaje, tipo = 'info', prioridad = 'normal') {
    const notificacion = {
        id: Date.now(),
        titulo: titulo,
        mensaje: mensaje,
        tipo: tipo,
        prioridad: prioridad,
        timestamp: new Date().toISOString(),
        leida: false
    };
    
    notificationQueue.push(notificacion);
    
    // Mantener solo las últimas 50 notificaciones
    if (notificationQueue.length > 50) {
        notificationQueue = notificationQueue.slice(-50);
    }
    
    // Guardar en localStorage
    localStorage.setItem('notificationQueue', JSON.stringify(notificationQueue));
    
    // Mostrar notificación inmediata si es de alta prioridad
    if (prioridad === 'alta') {
        mostrarNotificacionInmediata(notificacion);
    }
    
    // Actualizar contador de notificaciones
    actualizarContadorNotificaciones();
    
    console.log('🔔 Notificación agregada:', notificacion);
}

function mostrarNotificacionInmediata(notificacion) {
    const iconos = {
        info: 'fas fa-info-circle',
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle',
        alta: 'fas fa-bell'
    };
    
    const colores = {
        info: '#3B82F6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        alta: '#DC2626'
    };
    
    const notificacionHTML = `
        <div class="notificacion-inmediata" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-left: 4px solid ${colores[notificacion.tipo]};
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 350px;
            animation: slideInRight 0.3s ease;
        ">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <i class="${iconos[notificacion.tipo]}" style="color: ${colores[notificacion.tipo]};"></i>
                <strong style="color: #374151;">${notificacion.titulo}</strong>
            </div>
            <p style="color: #6B7280; margin: 0; font-size: 0.9rem;">${notificacion.mensaje}</p>
            <div style="font-size: 0.8rem; color: #9CA3AF; margin-top: 0.5rem;">
                ${new Date(notificacion.timestamp).toLocaleTimeString('es-AR')}
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', notificacionHTML);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        const elemento = document.querySelector('.notificacion-inmediata');
        if (elemento) {
            elemento.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => elemento.remove(), 300);
        }
    }, 5000);
}

function actualizarContadorNotificaciones() {
    const notificacionesNoLeidas = notificationQueue.filter(n => !n.leida).length;
    
    // Actualizar badge en el dashboard si existe
    const badge = document.getElementById('notificacionesBadge');
    if (badge) {
        badge.textContent = notificacionesNoLeidas;
        badge.style.display = notificacionesNoLeidas > 0 ? 'block' : 'none';
    }
}

// Backup automático
function iniciarBackupAutomatico() {
    console.log('💾 Iniciando sistema de backup automático...');
    
    backupTimer = setInterval(() => {
        realizarBackupAutomatico();
    }, ADMIN_CONFIG.backupInterval);
    
    // Realizar primer backup inmediatamente
    realizarBackupAutomatico();
}

function realizarBackupAutomatico() {
    console.log('💾 Realizando backup automático...');
    
    const datosCompletos = {
        productos: JSON.parse(localStorage.getItem('productosFRIOCAS') || '[]'),
        servicios: JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]'),
        categorias: JSON.parse(localStorage.getItem('categoriasFRIOCAS') || '[]'),
        configEmpresa: JSON.parse(localStorage.getItem('friocasConfig') || '{}'),
        configPagos: JSON.parse(localStorage.getItem('paymentConfig') || '{}'),
        userActivityLog: userActivityLog,
        notificationQueue: notificationQueue,
        timestamp: new Date().toISOString(),
        tipo: 'automatico',
        version: '1.3',
        descripcion: 'Backup automático del sistema FRIOCAS'
    };
    
    // Obtener backups existentes
    const backups = JSON.parse(localStorage.getItem('backupsAutomaticos') || '[]');
    
    // Agregar nuevo backup
    backups.push(datosCompletos);
    
    // Mantener solo los últimos N backups
    if (backups.length > ADMIN_CONFIG.maxBackups) {
        backups.splice(0, backups.length - ADMIN_CONFIG.maxBackups);
    }
    
    // Guardar backups
    localStorage.setItem('backupsAutomaticos', JSON.stringify(backups));
    
    // Actualizar último backup en localStorage para mostrar en dashboard
    localStorage.setItem('ultimoBackup', JSON.stringify({
        timestamp: datosCompletos.timestamp,
        totalBackups: backups.length,
        tipo: 'automatico'
    }));
    
    // Agregar notificación
    agregarNotificacion(
        '💾 Backup Automático Completado',
        `Se guardó una copia de seguridad automática. Total de backups: ${backups.length}`,
        'success',
        'normal'
    );
    
    // Actualizar dashboard si está visible
    actualizarEstadisticasDashboard();
    
    console.log('✅ Backup automático completado. Total de backups:', backups.length);
    return backups.length;
}

function restaurarDesdeBackup(index) {
    const backups = JSON.parse(localStorage.getItem('backupsAutomaticos') || '[]');
    
    if (index >= 0 && index < backups.length) {
        const backup = backups[index];
        
        // Restaurar datos
        if (backup.productos) localStorage.setItem('productosFRIOCAS', JSON.stringify(backup.productos));
        if (backup.servicios) localStorage.setItem('serviciosFRIOCAS', JSON.stringify(backup.servicios));
        if (backup.categorias) localStorage.setItem('categoriasFRIOCAS', JSON.stringify(backup.categorias));
        if (backup.configEmpresa) localStorage.setItem('friocasConfig', JSON.stringify(backup.configEmpresa));
        if (backup.configPagos) localStorage.setItem('paymentConfig', JSON.stringify(backup.configPagos));
        
        mostrarNotificacion('✅ Datos restaurados desde backup', 'success');
        
        // Recargar secciones
        cargarProductos();
        cargarServicios();
        cargarCategorias();
        cargarConfiguracionGeneral();
        cargarConfiguracionPagos();
        
            console.log('🔄 Datos restaurados desde backup:', backup.timestamp);
}

// Función para mostrar historial de backups
function mostrarHistorialBackups() {
    const backups = JSON.parse(localStorage.getItem('backupsAutomaticos') || '[]');
    
    const modal = document.createElement('div');
    modal.className = 'modal-monitoreo';
    modal.innerHTML = `
        <div class="modal-content-monitoreo">
            <div class="modal-header-monitoreo">
                <h3><i class="fas fa-history"></i> Historial de Backups</h3>
                <button onclick="this.closest('.modal-monitoreo').remove()" class="cerrar-modal">&times;</button>
            </div>
            
            <div class="modal-body-monitoreo">
                <div class="backup-stats">
                    <div class="stat-backup">
                        <h4>💾 Total de Backups</h4>
                        <div class="stat-valor">${backups.length}</div>
                    </div>
                    
                    <div class="stat-backup">
                        <h4>🕒 Último Backup</h4>
                        <div class="stat-valor">${backups.length > 0 ? new Date(backups[backups.length - 1].timestamp).toLocaleString('es-AR') : 'N/A'}</div>
                    </div>
                    
                    <div class="stat-backup">
                        <h4>⚙️ Próximo Backup</h4>
                        <div class="stat-valor">${calcularProximoBackup()}</div>
                    </div>
                </div>
                
                <div class="backup-actions">
                    <button class="btn-backup" onclick="realizarBackupAutomatico()">
                        <i class="fas fa-save"></i> Crear Backup Manual
                    </button>
                    <button class="btn-backup" onclick="exportarTodosLosBackups()">
                        <i class="fas fa-download"></i> Exportar Todos
                    </button>
                    <button class="btn-backup btn-danger" onclick="limpiarBackupsAntiguos()">
                        <i class="fas fa-trash"></i> Limpiar Antiguos
                    </button>
                </div>
                
                <div class="backup-lista">
                    <h4>📋 Lista de Backups</h4>
                    <div class="backup-items">
                        ${backups.length === 0 ? '<p class="no-backups">No hay backups disponibles</p>' : 
                        backups.slice().reverse().map((backup, index) => `
                            <div class="backup-item">
                                <div class="backup-info">
                                    <div class="backup-header">
                                        <strong>Backup #${backups.length - index}</strong>
                                        <span class="backup-tipo ${backup.tipo}">${backup.tipo === 'automatico' ? '🔄 Automático' : '👤 Manual'}</span>
                                    </div>
                                    <div class="backup-details">
                                        <span class="backup-fecha">${new Date(backup.timestamp).toLocaleString('es-AR')}</span>
                                        <span class="backup-version">v${backup.version || '1.0'}</span>
                                    </div>
                                    <div class="backup-stats-mini">
                                        <span>📦 ${backup.productos?.length || 0} productos</span>
                                        <span>🔧 ${backup.servicios?.length || 0} servicios</span>
                                        <span>📊 ${backup.userActivityLog?.length || 0} actividades</span>
                                    </div>
                                </div>
                                <div class="backup-actions-mini">
                                    <button class="btn-restore" onclick="restaurarDesdeBackup(${backups.length - 1 - index})" title="Restaurar desde este backup">
                                        <i class="fas fa-undo"></i>
                                    </button>
                                    <button class="btn-download" onclick="descargarBackup(${backups.length - 1 - index})" title="Descargar este backup">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function calcularProximoBackup() {
    const ultimoBackup = JSON.parse(localStorage.getItem('ultimoBackup') || '{}');
    if (!ultimoBackup.timestamp) return 'N/A';
    
    const ultimo = new Date(ultimoBackup.timestamp);
    const proximo = new Date(ultimo.getTime() + ADMIN_CONFIG.backupInterval);
    const ahora = new Date();
    
    const diferencia = proximo - ahora;
    if (diferencia <= 0) return 'Pronto';
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    return `${minutos} min`;
}

function descargarBackup(index) {
    const backups = JSON.parse(localStorage.getItem('backupsAutomaticos') || '[]');
    
    if (index >= 0 && index < backups.length) {
        const backup = backups[index];
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `friocas-backup-${new Date(backup.timestamp).toISOString().split('T')[0]}-${index + 1}.json`;
        link.click();
        
        mostrarNotificacion('📥 Backup descargado correctamente', 'success');
    }
}

function exportarTodosLosBackups() {
    const backups = JSON.parse(localStorage.getItem('backupsAutomaticos') || '[]');
    const dataStr = JSON.stringify(backups, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `friocas-todos-los-backups-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    mostrarNotificacion('📦 Todos los backups exportados', 'success');
}

function limpiarBackupsAntiguos() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los backups excepto los últimos 3?')) {
        const backups = JSON.parse(localStorage.getItem('backupsAutomaticos') || '[]');
        const backupsMantenidos = backups.slice(-3);
        
        localStorage.setItem('backupsAutomaticos', JSON.stringify(backupsMantenidos));
        
        mostrarNotificacion('🗑️ Backups antiguos eliminados. Se mantuvieron los últimos 3.', 'success');
        
        // Cerrar modal y volver a abrir
        document.querySelector('.modal-monitoreo').remove();
        setTimeout(() => mostrarHistorialBackups(), 100);
    }
}
}

// Función para mostrar panel de monitoreo
function mostrarPanelMonitoreo() {
    const modal = document.createElement('div');
    modal.className = 'modal-monitoreo';
    modal.innerHTML = `
        <div class="modal-content-monitoreo">
            <div class="modal-header-monitoreo">
                <h3><i class="fas fa-chart-line"></i> Panel de Monitoreo</h3>
                <button onclick="this.closest('.modal-monitoreo').remove()" class="cerrar-modal">&times;</button>
            </div>
            
            <div class="modal-body-monitoreo">
                <div class="monitoreo-stats">
                    <div class="stat-monitoreo">
                        <h4>👥 Usuarios Activos</h4>
                        <div class="stat-valor">${activeUsers}</div>
                    </div>
                    
                    <div class="stat-monitoreo">
                        <h4>🔔 Notificaciones</h4>
                        <div class="stat-valor">${notificationQueue.filter(n => !n.leida).length}</div>
                    </div>
                    
                    <div class="stat-monitoreo">
                        <h4>💾 Backups</h4>
                        <div class="stat-valor">${JSON.parse(localStorage.getItem('backupsAutomaticos') || '[]').length}</div>
                    </div>
                </div>
                
                <div class="monitoreo-secciones">
                    <div class="seccion-monitoreo">
                        <h4>📊 Actividad Reciente</h4>
                        <div class="actividad-lista">
                            ${userActivityLog.slice(-10).reverse().map(actividad => `
                                <div class="actividad-item">
                                    <div class="actividad-tiempo">${new Date(actividad.timestamp).toLocaleTimeString('es-AR')}</div>
                                    <div class="actividad-descripcion">${actividad.descripcion}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="seccion-monitoreo">
                        <h4>🔔 Notificaciones Recientes</h4>
                        <div class="notificaciones-lista">
                            ${notificationQueue.slice(-5).reverse().map(notif => `
                                <div class="notificacion-item ${notif.leida ? 'leida' : 'no-leida'}">
                                    <div class="notificacion-header">
                                        <strong>${notif.titulo}</strong>
                                        <span class="notificacion-tiempo">${new Date(notif.timestamp).toLocaleTimeString('es-AR')}</span>
                                    </div>
                                    <div class="notificacion-mensaje">${notif.mensaje}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Inicializar sistemas cuando se inicia sesión
function inicializarSistemasAvanzados() {
    iniciarMonitoreoUsuarios();
    iniciarBackupAutomatico();
    
    // Cargar datos guardados
    userActivityLog = JSON.parse(localStorage.getItem('userActivityLog') || '[]');
    notificationQueue = JSON.parse(localStorage.getItem('notificationQueue') || '[]');
    
    console.log('🚀 Sistemas avanzados inicializados');
}

// Función para probar notificaciones
function probarNotificacion() {
    const tipos = ['info', 'success', 'warning', 'error', 'alta'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    
    const mensajes = [
        {
            titulo: 'Nuevo Cliente Registrado',
            mensaje: 'Un nuevo cliente se registró en la página web'
        },
        {
            titulo: 'Producto Agotado',
            mensaje: 'El producto "Bug Remover" se ha agotado'
        },
        {
            titulo: 'Venta Realizada',
            mensaje: 'Se completó una venta por $25,000'
        },
        {
            titulo: 'Backup Completado',
            mensaje: 'Se realizó un backup automático exitoso'
        },
        {
            titulo: 'Alerta de Sistema',
            mensaje: 'Se detectó actividad inusual en el sistema'
        }
    ];
    
    const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
    
    agregarNotificacion(
        mensaje.titulo,
        mensaje.mensaje,
        tipo,
        tipo === 'alta' ? 'alta' : 'normal'
    );
    
    mostrarNotificacion('🔔 Notificación de prueba enviada', 'success');
}

// Función para mostrar opciones de restauración
function mostrarOpcionesRestauracion() {
    const modal = document.createElement('div');
    modal.className = 'modal-monitoreo';
    modal.innerHTML = `
        <div class="modal-content-monitoreo">
            <div class="modal-header-monitoreo">
                <h3><i class="fas fa-undo"></i> Restaurar Sistema</h3>
                <button onclick="this.closest('.modal-monitoreo').remove()" class="cerrar-modal">&times;</button>
            </div>
            
            <div class="modal-body-monitoreo">
                <div class="restore-warning">
                    <div class="warning-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h4>⚠️ Advertencia Importante</h4>
                    <p>Restaurar el sistema desde un backup eliminará todos los cambios realizados después de esa fecha. Esta acción no se puede deshacer.</p>
                </div>
                
                <div class="restore-options">
                    <h4>🔄 Opciones de Restauración</h4>
                    
                    <div class="restore-option">
                        <h5>📦 Restaurar desde Backup</h5>
                        <p>Selecciona un backup específico para restaurar el sistema a ese punto en el tiempo.</p>
                        <button class="btn-backup" onclick="mostrarHistorialBackups()">
                            <i class="fas fa-history"></i> Ver Backups Disponibles
                        </button>
                    </div>
                    
                    <div class="restore-option">
                        <h5>📁 Restaurar desde Archivo</h5>
                        <p>Importa un archivo de backup guardado previamente.</p>
                        <input type="file" id="restoreFile" style="display: none;" accept=".json" onchange="restaurarDesdeArchivo(event)">
                        <button class="btn-backup" onclick="document.getElementById('restoreFile').click()">
                            <i class="fas fa-upload"></i> Seleccionar Archivo
                        </button>
                    </div>
                    
                    <div class="restore-option">
                        <h5>🔄 Restaurar Configuración por Defecto</h5>
                        <p>Restaura solo la configuración básica del sistema a los valores originales.</p>
                        <button class="btn-backup btn-danger" onclick="restaurarConfiguracionPorDefecto()">
                            <i class="fas fa-undo"></i> Restaurar Configuración
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function restaurarDesdeArchivo(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (confirm('¿Estás seguro de que quieres restaurar el sistema desde este archivo? Esta acción no se puede deshacer.')) {
                // Restaurar datos
                if (backup.productos) localStorage.setItem('productosFRIOCAS', JSON.stringify(backup.productos));
                if (backup.servicios) localStorage.setItem('serviciosFRIOCAS', JSON.stringify(backup.servicios));
                if (backup.categorias) localStorage.setItem('categoriasFRIOCAS', JSON.stringify(backup.categorias));
                if (backup.configEmpresa) localStorage.setItem('friocasConfig', JSON.stringify(backup.configEmpresa));
                if (backup.configPagos) localStorage.setItem('paymentConfig', JSON.stringify(backup.configPagos));
                
                mostrarNotificacion('✅ Sistema restaurado desde archivo', 'success');
                
                // Recargar secciones
                cargarProductos();
                cargarServicios();
                cargarCategorias();
                cargarConfiguracionGeneral();
                cargarConfiguracionPagos();
                
                // Cerrar modal
                document.querySelector('.modal-monitoreo').remove();
            }
        } catch (error) {
            mostrarNotificacion('❌ Error al restaurar: archivo inválido', 'error');
        }
    };
    reader.readAsText(file);
}

function restaurarConfiguracionPorDefecto() {
    if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto? Esto solo afectará la configuración básica.')) {
        // Restaurar configuración por defecto
        const configPorDefecto = {
            nombre: 'FRIOCAS',
            telefono: '+5493795015712',
            email: 'info@friocas.com.ar',
            direccion: 'Moreno 2242, Corrientes Capital, Argentina',
            horarios: 'Lunes a Viernes: 8:00 - 12:00 y 16:00 - 20:00'
        };
        
        localStorage.setItem('friocasConfig', JSON.stringify(configPorDefecto));
        
        mostrarNotificacion('✅ Configuración restaurada por defecto', 'success');
        
        // Recargar configuración
        cargarConfiguracionGeneral();
        
        // Cerrar modal
        document.querySelector('.modal-monitoreo').remove();
    }
}

// Función para configurar backup
function configurarBackup() {
    const modal = document.createElement('div');
    modal.className = 'modal-monitoreo';
    modal.innerHTML = `
        <div class="modal-content-monitoreo">
            <div class="modal-header-monitoreo">
                <h3><i class="fas fa-cog"></i> Configurar Backup</h3>
                <button onclick="this.closest('.modal-monitoreo').remove()" class="cerrar-modal">&times;</button>
            </div>
            
            <div class="modal-body-monitoreo">
                <div class="backup-config">
                    <h4>⚙️ Configuración Actual</h4>
                    
                    <div class="config-item">
                        <label>Intervalo de Backup Automático:</label>
                        <select id="backupInterval" onchange="cambiarIntervaloBackup()">
                            <option value="15" ${ADMIN_CONFIG.backupInterval === 15 * 60 * 1000 ? 'selected' : ''}>15 minutos</option>
                            <option value="30" ${ADMIN_CONFIG.backupInterval === 30 * 60 * 1000 ? 'selected' : ''}>30 minutos</option>
                            <option value="60" ${ADMIN_CONFIG.backupInterval === 60 * 60 * 1000 ? 'selected' : ''}>1 hora</option>
                            <option value="120" ${ADMIN_CONFIG.backupInterval === 120 * 60 * 1000 ? 'selected' : ''}>2 horas</option>
                        </select>
                    </div>
                    
                    <div class="config-item">
                        <label>Máximo de Backups a Mantener:</label>
                        <select id="maxBackups" onchange="cambiarMaxBackups()">
                            <option value="5" ${ADMIN_CONFIG.maxBackups === 5 ? 'selected' : ''}>5 backups</option>
                            <option value="10" ${ADMIN_CONFIG.maxBackups === 10 ? 'selected' : ''}>10 backups</option>
                            <option value="20" ${ADMIN_CONFIG.maxBackups === 20 ? 'selected' : ''}>20 backups</option>
                            <option value="50" ${ADMIN_CONFIG.maxBackups === 50 ? 'selected' : ''}>50 backups</option>
                        </select>
                    </div>
                    
                    <div class="config-info">
                        <h5>📊 Información del Sistema</h5>
                        <p><strong>Backup automático:</strong> ${ADMIN_CONFIG.backupInterval === 0 ? 'Desactivado' : 'Activado'}</p>
                        <p><strong>Próximo backup:</strong> ${calcularProximoBackup()}</p>
                        <p><strong>Backups almacenados:</strong> ${JSON.parse(localStorage.getItem('backupsAutomaticos') || '[]').length}</p>
                        <p><strong>Espacio utilizado:</strong> ${calcularEspacioBackups()}</p>
                    </div>
                    
                    <div class="config-actions">
                        <button class="btn-backup" onclick="realizarBackupAutomatico()">
                            <i class="fas fa-save"></i> Crear Backup Ahora
                        </button>
                        <button class="btn-backup btn-danger" onclick="limpiarTodosLosBackups()">
                            <i class="fas fa-trash"></i> Limpiar Todos los Backups
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function cambiarIntervaloBackup() {
    const intervalo = parseInt(document.getElementById('backupInterval').value);
    ADMIN_CONFIG.backupInterval = intervalo * 60 * 1000;
    
    // Reiniciar timer de backup
    if (backupTimer) {
        clearInterval(backupTimer);
    }
    
    backupTimer = setInterval(() => {
        realizarBackupAutomatico();
    }, ADMIN_CONFIG.backupInterval);
    
    mostrarNotificacion('✅ Intervalo de backup actualizado', 'success');
}

function cambiarMaxBackups() {
    const maxBackups = parseInt(document.getElementById('maxBackups').value);
    ADMIN_CONFIG.maxBackups = maxBackups;
    
    // Limpiar backups excedentes
    const backups = JSON.parse(localStorage.getItem('backupsAutomaticos') || '[]');
    if (backups.length > maxBackups) {
        const backupsMantenidos = backups.slice(-maxBackups);
        localStorage.setItem('backupsAutomaticos', JSON.stringify(backupsMantenidos));
    }
    
    mostrarNotificacion('✅ Máximo de backups actualizado', 'success');
}

function calcularEspacioBackups() {
    const backups = JSON.parse(localStorage.getItem('backupsAutomaticos') || '[]');
    const dataSize = JSON.stringify(backups).length;
    const sizeKB = (dataSize / 1024).toFixed(2);
    return `${sizeKB} KB`;
}

function limpiarTodosLosBackups() {
    if (confirm('¿Estás seguro de que quieres eliminar TODOS los backups? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('backupsAutomaticos');
        localStorage.removeItem('ultimoBackup');
        
        mostrarNotificacion('🗑️ Todos los backups eliminados', 'success');
        
        // Cerrar modal y volver a abrir
        document.querySelector('.modal-monitoreo').remove();
        setTimeout(() => configurarBackup(), 100);
    }
}

// ===== SISTEMA DE ATENCIÓN AL CLIENTE =====

// Variables globales para atención al cliente
let ticketsSoporte = [];
let chatEnVivo = [];
let agentesDisponibles = [];

// Cargar sección de atención al cliente
function cargarAtencionCliente() {
    console.log('🛠️ Cargando sistema de atención al cliente...');
    
    const atencionGrid = document.getElementById('atencionGrid');
    if (!atencionGrid) return;
    
    // Cargar tickets guardados
    ticketsSoporte = JSON.parse(localStorage.getItem('ticketsSoporte') || '[]');
    chatEnVivo = JSON.parse(localStorage.getItem('chatEnVivo') || '[]');
    
    atencionGrid.innerHTML = `
        <div class="atencion-dashboard">
            <!-- Estadísticas de Atención -->
            <div class="atencion-stats">
                <div class="stat-atencion">
                    <div class="stat-icon-atencion">
                        <i class="fas fa-ticket-alt"></i>
                    </div>
                    <div class="stat-info-atencion">
                        <h3>${ticketsSoporte.length}</h3>
                        <p>Total Tickets</p>
                    </div>
                </div>
                
                <div class="stat-atencion">
                    <div class="stat-icon-atencion urgent">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="stat-info-atencion">
                        <h3>${ticketsSoporte.filter(t => t.prioridad === 'alta').length}</h3>
                        <p>Urgentes</p>
                    </div>
                </div>
                
                <div class="stat-atencion">
                    <div class="stat-icon-atencion pending">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-info-atencion">
                        <h3>${ticketsSoporte.filter(t => t.estado === 'pendiente').length}</h3>
                        <p>Pendientes</p>
                    </div>
                </div>
                
                <div class="stat-atencion">
                    <div class="stat-icon-atencion resolved">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-info-atencion">
                        <h3>${ticketsSoporte.filter(t => t.estado === 'resuelto').length}</h3>
                        <p>Resueltos</p>
                    </div>
                </div>
            </div>
            
            <!-- Filtros y Búsqueda -->
            <div class="atencion-filtros">
                <div class="filtros-grupo">
                    <select id="filtroEstado" onchange="filtrarTickets()">
                        <option value="">Todos los estados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="resuelto">Resueltos</option>
                        <option value="cerrado">Cerrados</option>
                    </select>
                    
                    <select id="filtroPrioridad" onchange="filtrarTickets()">
                        <option value="">Todas las prioridades</option>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="urgente">Urgente</option>
                    </select>
                    
                    <select id="filtroCategoria" onchange="filtrarTickets()">
                        <option value="">Todas las categorías</option>
                        <option value="tecnico">Problema Técnico</option>
                        <option value="facturacion">Facturación</option>
                        <option value="producto">Producto</option>
                        <option value="pago">Pago</option>
                        <option value="general">Consulta General</option>
                    </select>
                </div>
                
                <div class="busqueda-grupo">
                    <input type="text" id="busquedaTickets" placeholder="Buscar tickets..." onkeyup="filtrarTickets()">
                    <button class="btn-buscar" onclick="filtrarTickets()">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            
            <!-- Lista de Tickets -->
            <div class="tickets-container">
                <div class="tickets-header">
                    <h3>Tickets de Soporte</h3>
                    <div class="tickets-acciones">
                        <button class="btn-refresh" onclick="cargarTickets()">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn-export" onclick="exportarTickets()">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
                
                <div class="tickets-lista" id="ticketsLista">
                    ${renderizarTickets(ticketsSoporte)}
                </div>
            </div>
            
            <!-- Chat en Vivo -->
            <div class="chat-vivo-container">
                <div class="chat-header">
                    <h3><i class="fas fa-comments"></i> Chat en Vivo</h3>
                    <span class="chat-status online">En línea</span>
                </div>
                
                <div class="chat-sessions" id="chatSessions">
                    ${renderizarChatSessions(chatEnVivo)}
                </div>
            </div>
        </div>
    `;
}

// Renderizar tickets
function renderizarTickets(tickets) {
    if (tickets.length === 0) {
        return `
            <div class="no-tickets">
                <i class="fas fa-inbox"></i>
                <h4>No hay tickets de soporte</h4>
                <p>Los tickets de los clientes aparecerán aquí</p>
            </div>
        `;
    }
    
    return tickets.map(ticket => `
        <div class="ticket-item ${ticket.prioridad || 'baja'} ${ticket.estado || 'pendiente'}" onclick="abrirTicket(${ticket.id || 0})">
            <div class="ticket-header">
                <div class="ticket-info">
                    <h4>#${ticket.id || 'N/A'} - ${ticket.titulo || 'Sin título'}</h4>
                    <span class="ticket-cliente">${ticket.cliente || 'Cliente no especificado'}</span>
                </div>
                <div class="ticket-meta">
                    <span class="ticket-prioridad ${ticket.prioridad || 'baja'}">${(ticket.prioridad || 'baja').toUpperCase()}</span>
                    <span class="ticket-estado ${ticket.estado || 'pendiente'}">${(ticket.estado || 'pendiente').replace('_', ' ')}</span>
                </div>
            </div>
            
            <div class="ticket-details">
                <p class="ticket-descripcion">${ticket.descripcion ? ticket.descripcion.substring(0, 100) + (ticket.descripcion.length > 100 ? '...' : '') : 'Sin descripción'}</p>
                <div class="ticket-footer">
                    <span class="ticket-categoria">
                        <i class="fas fa-tag"></i> ${ticket.categoria || 'Sin categoría'}
                    </span>
                    <span class="ticket-fecha">
                        <i class="fas fa-calendar"></i> ${ticket.fecha ? new Date(ticket.fecha).toLocaleDateString('es-AR') : 'Fecha no disponible'}
                    </span>
                    <span class="ticket-tiempo">
                        <i class="fas fa-clock"></i> ${ticket.fecha ? calcularTiempoTranscurrido(ticket.fecha) : 'Tiempo no disponible'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// Renderizar sesiones de chat
function renderizarChatSessions(sessions) {
    if (sessions.length === 0) {
        return `
            <div class="no-chat">
                <i class="fas fa-comments"></i>
                <h4>No hay chats activos</h4>
                <p>Los chats en vivo aparecerán aquí</p>
            </div>
        `;
    }
    
    return sessions.map(session => `
        <div class="chat-session ${session.estado || 'activo'}" onclick="abrirChat(${session.id || 0})">
            <div class="chat-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="chat-info">
                <h4>${session.cliente || 'Cliente no especificado'}</h4>
                <p>${session.ultimoMensaje || 'Sin mensajes'}</p>
            </div>
            <div class="chat-meta">
                <span class="chat-tiempo">${session.ultimaActividad ? calcularTiempoTranscurrido(session.ultimaActividad) : 'Tiempo no disponible'}</span>
                ${session.mensajesNoLeidos > 0 ? `<span class="chat-notificacion">${session.mensajesNoLeidos}</span>` : ''}
            </div>
        </div>
    `).join('');
}

// Mostrar formulario de ticket
function mostrarFormularioTicket(ticketId = null) {
    const ticket = ticketId ? ticketsSoporte.find(t => t.id === ticketId) : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal-ticket-overlay';
    modal.innerHTML = `
        <div class="modal-ticket">
            <div class="modal-ticket-header">
                <h3>${ticket ? 'Editar Ticket' : 'Nuevo Ticket de Soporte'}</h3>
                <button onclick="cerrarModalTicket()" class="cerrar-modal">&times;</button>
            </div>
            
            <div class="modal-ticket-content">
                <form id="formularioTicket" class="formulario-ticket">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tituloTicket">Título del Problema:</label>
                            <input type="text" id="tituloTicket" name="titulo" value="${ticket ? ticket.titulo : ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="clienteTicket">Cliente:</label>
                            <input type="text" id="clienteTicket" name="cliente" value="${ticket ? ticket.cliente : ''}" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="categoriaTicket">Categoría:</label>
                            <select id="categoriaTicket" name="categoria" required>
                                <option value="">Seleccionar categoría</option>
                                <option value="tecnico" ${ticket && ticket.categoria === 'tecnico' ? 'selected' : ''}>Problema Técnico</option>
                                <option value="facturacion" ${ticket && ticket.categoria === 'facturacion' ? 'selected' : ''}>Facturación</option>
                                <option value="producto" ${ticket && ticket.categoria === 'producto' ? 'selected' : ''}>Producto</option>
                                <option value="pago" ${ticket && ticket.categoria === 'pago' ? 'selected' : ''}>Pago</option>
                                <option value="general" ${ticket && ticket.categoria === 'general' ? 'selected' : ''}>Consulta General</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="prioridadTicket">Prioridad:</label>
                            <select id="prioridadTicket" name="prioridad" required>
                                <option value="">Seleccionar prioridad</option>
                                <option value="baja" ${ticket && ticket.prioridad === 'baja' ? 'selected' : ''}>Baja</option>
                                <option value="media" ${ticket && ticket.prioridad === 'media' ? 'selected' : ''}>Media</option>
                                <option value="alta" ${ticket && ticket.prioridad === 'alta' ? 'selected' : ''}>Alta</option>
                                <option value="urgente" ${ticket && ticket.prioridad === 'urgente' ? 'selected' : ''}>Urgente</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="descripcionTicket">Descripción del Problema:</label>
                        <textarea id="descripcionTicket" name="descripcion" rows="4" placeholder="Describe detalladamente el problema...">${ticket ? ticket.descripcion : ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="contactoTicket">Información de Contacto:</label>
                        <input type="text" id="contactoTicket" name="contacto" value="${ticket ? ticket.contacto : ''}" placeholder="Email, teléfono, WhatsApp...">
                    </div>
                    
                    <div class="botones-accion">
                        <button type="button" onclick="cerrarModalTicket()" class="btn-cancelar">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="submit" class="btn-guardar">
                            <i class="fas fa-save"></i> ${ticket ? 'Actualizar' : 'Crear'} Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar evento del formulario
    document.getElementById('formularioTicket').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarTicket(ticketId);
    });
    
    // Mostrar modal con animación
    setTimeout(() => modal.classList.add('active'), 10);
}

// Guardar ticket
function guardarTicket(ticketId = null) {
    const formData = new FormData(document.getElementById('formularioTicket'));
    
    const ticket = {
        id: ticketId || Date.now(),
        titulo: formData.get('titulo'),
        cliente: formData.get('cliente'),
        categoria: formData.get('categoria'),
        prioridad: formData.get('prioridad'),
        descripcion: formData.get('descripcion'),
        contacto: formData.get('contacto'),
        estado: ticketId ? ticketsSoporte.find(t => t.id === ticketId).estado : 'pendiente',
        fecha: ticketId ? ticketsSoporte.find(t => t.id === ticketId).fecha : new Date().toISOString(),
        ultimaActualizacion: new Date().toISOString(),
        respuestas: ticketId ? ticketsSoporte.find(t => t.id === ticketId).respuestas : [],
        asignadoA: ticketId ? ticketsSoporte.find(t => t.id === ticketId).asignadoA : null
    };
    
    if (ticketId) {
        // Editar ticket existente
        const index = ticketsSoporte.findIndex(t => t.id === ticketId);
        ticketsSoporte[index] = ticket;
        mostrarNotificacion('✅ Ticket actualizado correctamente', 'success');
    } else {
        // Crear nuevo ticket
        ticketsSoporte.push(ticket);
        mostrarNotificacion('✅ Ticket creado correctamente', 'success');
        
        // Agregar notificación de alta prioridad si es urgente
        if (ticket.prioridad === 'urgente') {
            agregarNotificacion(
                '🚨 Ticket Urgente Creado',
                `Ticket #${ticket.id} - ${ticket.titulo} requiere atención inmediata`,
                'error',
                'alta'
            );
        }
    }
    
    // Guardar en localStorage
    localStorage.setItem('ticketsSoporte', JSON.stringify(ticketsSoporte));
    
    // Cerrar modal y recargar
    cerrarModalTicket();
    cargarAtencionCliente();
}

// Abrir ticket para ver detalles
function abrirTicket(ticketId) {
    const ticket = ticketsSoporte.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-ticket-overlay';
    modal.innerHTML = `
        <div class="modal-ticket-detalle">
            <div class="modal-ticket-header">
                <h3>Ticket #${ticket.id} - ${ticket.titulo}</h3>
                <button onclick="cerrarModalTicket()" class="cerrar-modal">&times;</button>
            </div>
            
            <div class="modal-ticket-content">
                <div class="ticket-info-completa">
                    <div class="ticket-meta-info">
                        <div class="meta-item">
                            <strong>Cliente:</strong> ${ticket.cliente}
                        </div>
                        <div class="meta-item">
                            <strong>Categoría:</strong> ${ticket.categoria}
                        </div>
                        <div class="meta-item">
                            <strong>Prioridad:</strong> 
                            <span class="prioridad-badge ${ticket.prioridad}">${ticket.prioridad.toUpperCase()}</span>
                        </div>
                        <div class="meta-item">
                            <strong>Estado:</strong> 
                            <span class="estado-badge ${ticket.estado}">${ticket.estado.replace('_', ' ')}</span>
                        </div>
                        <div class="meta-item">
                            <strong>Fecha:</strong> ${new Date(ticket.fecha).toLocaleString('es-AR')}
                        </div>
                        <div class="meta-item">
                            <strong>Contacto:</strong> ${ticket.contacto || 'No especificado'}
                        </div>
                    </div>
                    
                    <div class="ticket-descripcion-completa">
                        <h4>Descripción del Problema:</h4>
                        <p>${ticket.descripcion}</p>
                    </div>
                    
                    <div class="ticket-acciones">
                        <button class="btn-accion" onclick="cambiarEstadoTicket(${ticket.id})">
                            <i class="fas fa-edit"></i> Cambiar Estado
                        </button>
                        <button class="btn-accion" onclick="agregarRespuesta(${ticket.id})">
                            <i class="fas fa-reply"></i> Agregar Respuesta
                        </button>
                        <button class="btn-accion" onclick="asignarTicket(${ticket.id})">
                            <i class="fas fa-user"></i> Asignar
                        </button>
                    </div>
                    
                    <div class="ticket-respuestas">
                        <h4>Respuestas (${ticket.respuestas.length})</h4>
                        ${ticket.respuestas.length === 0 ? 
                            '<p class="no-respuestas">No hay respuestas aún</p>' :
                            ticket.respuestas.map(respuesta => `
                                <div class="respuesta-item">
                                    <div class="respuesta-header">
                                        <strong>${respuesta.autor}</strong>
                                        <span>${new Date(respuesta.fecha).toLocaleString('es-AR')}</span>
                                    </div>
                                    <p>${respuesta.mensaje}</p>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

// Funciones auxiliares
function calcularTiempoTranscurrido(fecha) {
    const ahora = new Date();
    const fechaTicket = new Date(fecha);
    const diferencia = ahora - fechaTicket;
    
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (dias > 0) return `${dias}d`;
    if (horas > 0) return `${horas}h`;
    if (minutos > 0) return `${minutos}m`;
    return 'Ahora';
}

function filtrarTickets() {
    const estado = document.getElementById('filtroEstado').value;
    const prioridad = document.getElementById('filtroPrioridad').value;
    const categoria = document.getElementById('filtroCategoria').value;
    const busqueda = document.getElementById('busquedaTickets').value.toLowerCase();
    
    let ticketsFiltrados = ticketsSoporte;
    
    if (estado) ticketsFiltrados = ticketsFiltrados.filter(t => t.estado === estado);
    if (prioridad) ticketsFiltrados = ticketsFiltrados.filter(t => t.prioridad === prioridad);
    if (categoria) ticketsFiltrados = ticketsFiltrados.filter(t => t.categoria === categoria);
    if (busqueda) {
        ticketsFiltrados = ticketsFiltrados.filter(t => 
            t.titulo.toLowerCase().includes(busqueda) ||
            t.cliente.toLowerCase().includes(busqueda) ||
            t.descripcion.toLowerCase().includes(busqueda)
        );
    }
    
    document.getElementById('ticketsLista').innerHTML = renderizarTickets(ticketsFiltrados);
}

function cerrarModalTicket() {
    const modal = document.querySelector('.modal-ticket-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function exportarTickets() {
    const dataStr = JSON.stringify(ticketsSoporte, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `tickets-soporte-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    mostrarNotificacion('📦 Tickets exportados correctamente', 'success');
}

// Cambiar estado de ticket
function cambiarEstadoTicket(ticketId) {
    const ticket = ticketsSoporte.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const estados = ['pendiente', 'en_proceso', 'resuelto', 'cerrado'];
    const estadoActual = estados.indexOf(ticket.estado);
    const nuevoEstado = estados[(estadoActual + 1) % estados.length];
    
    ticket.estado = nuevoEstado;
    ticket.ultimaActualizacion = new Date().toISOString();
    
    // Guardar cambios
    localStorage.setItem('ticketsSoporte', JSON.stringify(ticketsSoporte));
    
    // Notificación
    mostrarNotificacion(`✅ Ticket #${ticketId} marcado como ${nuevoEstado.replace('_', ' ')}`, 'success');
    
    // Recargar vista
    cerrarModalTicket();
    cargarAtencionCliente();
}

// Agregar respuesta a ticket
function agregarRespuesta(ticketId) {
    const ticket = ticketsSoporte.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const respuesta = prompt('Escribe tu respuesta al cliente:');
    if (!respuesta || respuesta.trim() === '') return;
    
    const nuevaRespuesta = {
        id: Date.now(),
        autor: 'FRIOCAS - Soporte',
        mensaje: respuesta.trim(),
        fecha: new Date().toISOString(),
        tipo: 'respuesta'
    };
    
    ticket.respuestas.push(nuevaRespuesta);
    ticket.ultimaActualizacion = new Date().toISOString();
    
    // Si es la primera respuesta, cambiar estado a "en_proceso"
    if (ticket.respuestas.length === 1) {
        ticket.estado = 'en_proceso';
    }
    
    // Guardar cambios
    localStorage.setItem('ticketsSoporte', JSON.stringify(ticketsSoporte));
    
    // Notificación
    mostrarNotificacion(`✅ Respuesta agregada al ticket #${ticketId}`, 'success');
    
    // Recargar vista
    cerrarModalTicket();
    cargarAtencionCliente();
}

// Asignar ticket
function asignarTicket(ticketId) {
    const ticket = ticketsSoporte.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const agentes = ['Carla (FRIOCAS)', 'Soporte Técnico', 'Administración'];
    const agenteActual = ticket.asignadoA || 'Sin asignar';
    const indexActual = agentes.indexOf(agenteActual);
    const nuevoAgente = agentes[(indexActual + 1) % agentes.length];
    
    ticket.asignadoA = nuevoAgente;
    ticket.ultimaActualizacion = new Date().toISOString();
    
    // Guardar cambios
    localStorage.setItem('ticketsSoporte', JSON.stringify(ticketsSoporte));
    
    // Notificación
    mostrarNotificacion(`✅ Ticket #${ticketId} asignado a ${nuevoAgente}`, 'success');
    
    // Recargar vista
    cerrarModalTicket();
    cargarAtencionCliente();
}

// Abrir chat en vivo
function abrirChat(sessionId) {
    const session = chatEnVivo.find(s => s.id === sessionId);
    if (!session) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-chat-overlay';
    modal.innerHTML = `
        <div class="modal-chat">
            <div class="modal-chat-header">
                <h3>Chat con ${session.cliente}</h3>
                <button onclick="cerrarModalChat()" class="cerrar-modal">&times;</button>
            </div>
            
            <div class="modal-chat-content">
                <div class="chat-messages" id="chatMessages">
                    ${session.mensajes.map(mensaje => `
                        <div class="mensaje ${mensaje.tipo}">
                            <div class="mensaje-header">
                                <strong>${mensaje.autor}</strong>
                                <span>${new Date(mensaje.fecha).toLocaleTimeString('es-AR')}</span>
                            </div>
                            <p>${mensaje.texto}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="chat-input">
                    <input type="text" id="mensajeChat" placeholder="Escribe tu respuesta..." onkeypress="enviarMensajeChat(event, ${sessionId})">
                    <button onclick="enviarMensajeChat(null, ${sessionId})">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Marcar mensajes como leídos
    session.mensajesNoLeidos = 0;
    localStorage.setItem('chatEnVivo', JSON.stringify(chatEnVivo));
}

// Enviar mensaje en chat
function enviarMensajeChat(event, sessionId) {
    if (event && event.key !== 'Enter') return;
    
    const input = document.getElementById('mensajeChat');
    const mensaje = input.value.trim();
    
    if (!mensaje) return;
    
    const session = chatEnVivo.find(s => s.id === sessionId);
    if (!session) return;
    
    const nuevoMensaje = {
        id: Date.now(),
        autor: 'FRIOCAS - Soporte',
        texto: mensaje,
        fecha: new Date().toISOString(),
        tipo: 'agente'
    };
    
    session.mensajes.push(nuevoMensaje);
    session.ultimaActividad = new Date().toISOString();
    session.ultimoMensaje = mensaje;
    
    // Guardar cambios
    localStorage.setItem('chatEnVivo', JSON.stringify(chatEnVivo));
    
    // Limpiar input
    input.value = '';
    
    // Agregar mensaje a la vista
    const chatMessages = document.getElementById('chatMessages');
    const mensajeHTML = `
        <div class="mensaje agente">
            <div class="mensaje-header">
                <strong>FRIOCAS - Soporte</strong>
                <span>${new Date().toLocaleTimeString('es-AR')}</span>
            </div>
            <p>${mensaje}</p>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', mensajeHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Cerrar modal de chat
function cerrarModalChat() {
    const modal = document.querySelector('.modal-chat-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Simular nuevos tickets (para testing)
function simularNuevoTicket() {
    const categorias = ['tecnico', 'facturacion', 'producto', 'pago', 'general'];
    const prioridades = ['baja', 'media', 'alta', 'urgente'];
    const clientes = ['Juan Pérez', 'María González', 'Carlos López', 'Ana Martínez', 'Roberto Silva'];
    
    const ticket = {
        id: Date.now(),
        titulo: 'Problema con el pago',
        cliente: clientes[Math.floor(Math.random() * clientes.length)],
        categoria: categorias[Math.floor(Math.random() * categorias.length)],
        prioridad: prioridades[Math.floor(Math.random() * prioridades.length)],
        descripcion: 'No puedo completar el pago con mi tarjeta de crédito. Me aparece un error.',
        contacto: 'juan@email.com',
        estado: 'pendiente',
        fecha: new Date().toISOString(),
        ultimaActualizacion: new Date().toISOString(),
        respuestas: [],
        asignadoA: null
    };
    
    ticketsSoporte.push(ticket);
    localStorage.setItem('ticketsSoporte', JSON.stringify(ticketsSoporte));
    
    // Notificación si es urgente
    if (ticket.prioridad === 'urgente') {
        agregarNotificacion(
            '🚨 Nuevo Ticket Urgente',
            `Ticket #${ticket.id} - ${ticket.titulo} requiere atención inmediata`,
            'error',
            'alta'
        );
    }
    
    mostrarNotificacion('🎫 Nuevo ticket simulado creado', 'success');
    cargarAtencionCliente();
}

// Simular chat en vivo (para testing)
function simularChatEnVivo() {
    const clientes = ['María García', 'Luis Rodríguez', 'Carmen Fernández'];
    const cliente = clientes[Math.floor(Math.random() * clientes.length)];
    
    const session = {
        id: Date.now(),
        cliente: cliente,
        estado: 'activo',
        fechaInicio: new Date().toISOString(),
        ultimaActividad: new Date().toISOString(),
        ultimoMensaje: 'Hola, necesito ayuda con mi pedido',
        mensajesNoLeidos: 1,
        mensajes: [
            {
                id: 1,
                autor: cliente,
                texto: 'Hola, necesito ayuda con mi pedido',
                fecha: new Date().toISOString(),
                tipo: 'cliente'
            }
        ]
    };
    
    chatEnVivo.push(session);
    localStorage.setItem('chatEnVivo', JSON.stringify(chatEnVivo));
    
    mostrarNotificacion('💬 Nuevo chat en vivo simulado', 'success');
    cargarAtencionCliente();
}

// Agregar botones de simulación al dashboard
function agregarBotonesSimulacion() {
    const dashboardActions = document.querySelector('.dashboard-actions');
    if (dashboardActions) {
        const simulacionCard = document.createElement('div');
        simulacionCard.className = 'action-card';
        simulacionCard.innerHTML = `
            <h3>🧪 Simulación de Atención al Cliente</h3>
            <div class="action-buttons">
                <button class="action-btn" onclick="simularNuevoTicket()">
                    <i class="fas fa-ticket-alt"></i>
                    Simular Ticket
                </button>
                <button class="action-btn" onclick="simularChatEnVivo()">
                    <i class="fas fa-comments"></i>
                    Simular Chat
                </button>
            </div>
        `;
        dashboardActions.appendChild(simulacionCard);
    }
}

// Inicializar sistema de atención al cliente
function inicializarSistemaAtencion() {
    console.log('🛠️ Inicializando sistema de atención al cliente...');
    
    // Cargar datos guardados
    ticketsSoporte = JSON.parse(localStorage.getItem('ticketsSoporte') || '[]');
    chatEnVivo = JSON.parse(localStorage.getItem('chatEnVivo') || '[]');
    
    // Agregar botones de simulación al dashboard
    agregarBotonesSimulacion();
    
    console.log('✅ Sistema de atención al cliente inicializado');
}

// ===== GESTIÓN DE SERVICIOS =====
function cargarServicios() {
    console.log('🔧 Cargando servicios...');
    
    const serviciosGrid = document.getElementById('serviciosGrid');
    if (!serviciosGrid) return;
    
    // Cargar servicios guardados
    let servicios = JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]');
    
    // Si no hay servicios guardados, cargar los servicios por defecto de la página principal
    if (servicios.length === 0) {
        console.log('🔧 Cargando servicios por defecto de la página principal...');
        
        // Servicios por defecto hardcodeados de script-friocas.js
        servicios = [
            {
                id: 'servicio-completo',
                nombre: 'Servicio Completo',
                descripcion: 'Lavado completo del vehículo incluyendo interior, exterior, motor y llantas',
                precio: 25000,
                duracion: '2-3 horas',
                icono: 'fas fa-car',
                incluye: [
                    'Lavado exterior completo',
                    'Limpieza de interior',
                    'Limpieza de motor',
                    'Limpieza de llantas',
                    'Aplicación de cera',
                    'Acondicionador de neumáticos'
                ]
            },
            {
                id: 'servicio-interior',
                nombre: 'Servicio de Interior',
                descripcion: 'Limpieza profunda del interior del vehículo',
                precio: 15000,
                duracion: '1-2 horas',
                icono: 'fas fa-couch',
                incluye: [
                    'Aspirado completo',
                    'Limpieza de asientos',
                    'Limpieza de tablero',
                    'Limpieza de vidrios internos',
                    'Desodorización',
                    'Acondicionador de plásticos'
                ]
            },
            {
                id: 'servicio-exterior',
                nombre: 'Servicio de Exterior',
                descripcion: 'Lavado y cuidado del exterior del vehículo',
                precio: 12000,
                duracion: '1-1.5 horas',
                icono: 'fas fa-car-side',
                incluye: [
                    'Lavado exterior',
                    'Limpieza de llantas',
                    'Aplicación de cera',
                    'Acondicionador de neumáticos',
                    'Secado manual'
                ]
            },
            {
                id: 'servicio-motor',
                nombre: 'Limpieza de Motor',
                descripcion: 'Limpieza especializada del compartimento del motor',
                precio: 8000,
                duracion: '45-60 minutos',
                icono: 'fas fa-cog',
                incluye: [
                    'Limpieza del motor',
                    'Desengrasado',
                    'Protección anticorrosiva',
                    'Secado completo'
                ]
            },
            {
                id: 'servicio-llantas',
                nombre: 'Servicio de Llantas',
                descripcion: 'Limpieza y cuidado especializado de llantas',
                precio: 6000,
                duracion: '30-45 minutos',
                icono: 'fas fa-circle',
                incluye: [
                    'Limpieza profunda de llantas',
                    'Remoción de óxido',
                    'Acondicionador de neumáticos',
                    'Protección UV'
                ]
            },
            {
                id: 'servicio-gestoria',
                nombre: 'Servicio de Gestoría',
                descripcion: 'Tramitación de documentación vehicular',
                precio: 35000,
                duracion: '1-3 días',
                icono: 'fas fa-file-alt',
                incluye: [
                    'Transferencia de dominio',
                    'Renovación de licencia',
                    'Tramitación de multas',
                    'Asesoramiento legal'
                ]
            },
            {
                id: 'servicio-traslado',
                nombre: 'Servicio de Traslado',
                descripcion: 'Traslado del vehículo desde y hacia el taller',
                precio: 5000,
                duracion: '30-60 minutos',
                icono: 'fas fa-truck',
                incluye: [
                    'Recogida del vehículo',
                    'Traslado seguro',
                    'Entrega en domicilio',
                    'Seguro de transporte'
                ]
            }
        ];
        
        // Guardar servicios por defecto
        localStorage.setItem('serviciosFRIOCAS', JSON.stringify(servicios));
        console.log('💾 Servicios por defecto cargados:', servicios.length);
    }
    
    // Mostrar lista de servicios
    renderizarListaServicios(servicios);
}

function renderizarListaServicios(servicios) {
    const serviciosGrid = document.getElementById('serviciosGrid');
    
    serviciosGrid.innerHTML = `
        <div class="servicios-lista">
            <div class="servicios-header">
                <h3>Servicios Activos (${servicios.length})</h3>
                <button class="add-btn" onclick="mostrarFormularioServicio()">
                    <i class="fas fa-plus"></i>
                    Agregar Servicio
                </button>
            </div>
            <div class="servicios-table">
                <table>
                    <thead>
                        <tr>
                            <th>Icono</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Duración</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${servicios.map((servicio, index) => `
                            <tr>
                                <td>
                                    <i class="${servicio.icono}" style="font-size: 1.5rem; color: var(--primary-blue);"></i>
                                </td>
                                <td>${servicio.nombre}</td>
                                <td>${servicio.descripcion}</td>
                                <td>
                                    <span class="precio-actual">$${servicio.precio.toLocaleString()}</span>
                                    <button class="btn-editar-precio" onclick="editarPrecioServicio(${index})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                                <td>${servicio.duracion}</td>
                                <td>
                                    <button class="btn-accion" onclick="editarServicio(${index})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-accion btn-eliminar" onclick="eliminarServicio(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function mostrarFormularioServicio(servicioIndex = null) {
    const servicio = servicioIndex !== null ? 
        JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]')[servicioIndex] : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${servicio ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
                <button onclick="cerrarModalServicio()" class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="formularioServicio">
                    <div class="form-group">
                        <label for="nombreServicio">Nombre del Servicio:</label>
                        <input type="text" id="nombreServicio" name="nombre" value="${servicio ? servicio.nombre : ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="descripcionServicio">Descripción:</label>
                        <textarea id="descripcionServicio" name="descripcion" rows="3" required>${servicio ? servicio.descripcion : ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="precioServicio">Precio:</label>
                        <input type="number" id="precioServicio" name="precio" value="${servicio ? servicio.precio : ''}" min="0" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="duracionServicio">Duración:</label>
                        <input type="text" id="duracionServicio" name="duracion" value="${servicio ? servicio.duracion : ''}" placeholder="ej: 2-3 horas" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="iconoServicio">Icono (Font Awesome):</label>
                        <input type="text" id="iconoServicio" name="icono" value="${servicio ? servicio.icono : 'fas fa-tools'}" placeholder="fas fa-tools" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="incluyeServicio">Servicios Incluidos (uno por línea):</label>
                        <textarea id="incluyeServicio" name="incluye" rows="5" placeholder="Lavado exterior completo&#10;Limpieza de interior&#10;Aplicación de cera">${servicio ? servicio.incluye.join('\n') : ''}</textarea>
                    </div>
                    
                    <div class="botones-accion">
                        <button type="button" onclick="cerrarModalServicio()" class="btn-cancelar">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                        <button type="submit" class="btn-guardar">
                            <i class="fas fa-save"></i> ${servicio ? 'Actualizar' : 'Guardar'} Servicio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar evento del formulario
    document.getElementById('formularioServicio').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarServicio(servicioIndex);
    });
    
    // Mostrar modal con animación
    setTimeout(() => modal.classList.add('active'), 10);
}

function guardarServicio(servicioIndex = null) {
    const formData = new FormData(document.getElementById('formularioServicio'));
    const servicio = {
        id: servicioIndex !== null ? 
            JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]')[servicioIndex].id : 
            'servicio-' + Date.now(),
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: parseInt(formData.get('precio')),
        duracion: formData.get('duracion'),
        icono: formData.get('icono'),
        incluye: formData.get('incluye').split('\n').filter(item => item.trim() !== ''),
        fechaCreacion: new Date().toISOString()
    };
    
    // Obtener servicios existentes
    const servicios = JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]');
    
    if (servicioIndex !== null) {
        // Editar servicio existente
        servicios[servicioIndex] = { ...servicios[servicioIndex], ...servicio };
        mostrarNotificacion('✅ Servicio actualizado correctamente', 'success');
    } else {
        // Agregar nuevo servicio
        servicios.push(servicio);
        mostrarNotificacion('✅ Servicio agregado correctamente', 'success');
    }
    
    // Guardar en localStorage
    localStorage.setItem('serviciosFRIOCAS', JSON.stringify(servicios));
    
    // Cerrar modal y recargar lista
    cerrarModalServicio();
    cargarServicios();
}

function editarServicio(index) {
    mostrarFormularioServicio(index);
}

function eliminarServicio(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
        const servicios = JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]');
        servicios.splice(index, 1);
        localStorage.setItem('serviciosFRIOCAS', JSON.stringify(servicios));
        mostrarNotificacion('✅ Servicio eliminado correctamente', 'success');
        cargarServicios();
    }
}

function editarPrecioServicio(index) {
    const servicios = JSON.parse(localStorage.getItem('serviciosFRIOCAS') || '[]');
    const servicio = servicios[index];
    
    const nuevoPrecio = prompt(`Editar precio para "${servicio.nombre}":`, servicio.precio);
    
    if (nuevoPrecio !== null && !isNaN(nuevoPrecio)) {
        servicios[index].precio = parseInt(nuevoPrecio);
        localStorage.setItem('serviciosFRIOCAS', JSON.stringify(servicios));
        mostrarNotificacion('✅ Precio actualizado correctamente', 'success');
        cargarServicios();
    }
}

function cerrarModalServicio() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}
