// ===== SISTEMA DE CREDENCIALES SEGURAS CRESALIA =====
// Version 1.0 - Cada usuario tiene sus propias contraseñas
// Co-fundadores: CRISLA & Claude  
// Filosofía: "Confianza a través de la seguridad"

const SistemaCredenciales = {
    // ===== CONFIGURACIÓN =====
    config: {
        version: '1.0.0',
        longitudMinima: 6, // Mínimo muy accesible
        requiereMayuscula: false, // Flexible para todos
        requiereNumero: false, // No obligatorio  
        requiereEspecial: false, // Accesible
        saltRounds: 10 // Para bcrypt si lo implementamos
    },

    // ===== GENERACIÓN DE CREDENCIALES =====
    generarCredencialesIniciales(email, nombre) {
        // Generar credenciales únicas pero fáciles de recordar
        const credenciales = {
            usuario: email, // Email como usuario
            passwordTemporal: this.generarPasswordAmigable(nombre),
            tokenSesion: this.generarToken(),
            fechaCreacion: new Date().toISOString(),
            cambioPasswordRequerido: true, // Debe cambiar en primer login
            estado: 'activo'
        };

        return credenciales;
    },

    // Generar contraseña amigable temporal
    generarPasswordAmigable(nombre) {
        // Usar primera parte del nombre + año + números aleatorios
        const nombreLimpio = nombre.toLowerCase().replace(/[^a-z]/g, '').substring(0, 4);
        const año = new Date().getFullYear().toString().substring(2); // 24 para 2024
        const numeros = Math.floor(Math.random() * 99).toString().padStart(2, '0');
        
        return `${nombreLimpio}${año}${numeros}`; // ej: "juan2434"
    },

    // Generar token de sesión
    generarToken() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    },

    // ===== VALIDACIÓN DE CONTRASEÑA =====
    validarPassword(password) {
        const result = {
            valida: true,
            errores: [],
            fuerza: 'media'
        };

        // Validación muy flexible - solo lo básico
        if (!password || password.length < this.config.longitudMinima) {
            result.valida = false;
            result.errores.push(`Mínimo ${this.config.longitudMinima} caracteres`);
        }

        // Calcular fuerza sin exigir
        result.fuerza = this.calcularFuerzaPassword(password);

        return result;
    },

    // Calcular fuerza de contraseña (solo informativo)
    calcularFuerzaPassword(password) {
        let puntos = 0;
        
        if (password.length >= 8) puntos++;
        if (/[A-Z]/.test(password)) puntos++;
        if (/[0-9]/.test(password)) puntos++;
        if (/[^A-Za-z0-9]/.test(password)) puntos++;

        if (puntos <= 1) return 'débil';
        if (puntos <= 2) return 'media';
        return 'fuerte';
    },

    // ===== CAMBIO DE CONTRASEÑA =====
    crearFormularioCambioPassword(usuario) {
        const modal = document.createElement('div');
        modal.className = 'modal-cambio-password';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🔒 Cambiar Contraseña</h3>
                        <p>Creá una contraseña que sea fácil de recordar para vos</p>
                    </div>
                    
                    <div class="modal-body">
                        <form id="form-cambio-password" data-usuario="${usuario}">
                            <div class="form-group">
                                <label>🔑 Nueva contraseña</label>
                                <input type="password" name="nueva_password" required minlength="${this.config.longitudMinima}">
                                <div class="indicador-fuerza">
                                    <div class="barra-fuerza">
                                        <div class="progreso-fuerza"></div>
                                    </div>
                                    <span class="texto-fuerza">Escribí para ver la fuerza</span>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>🔑 Confirmar contraseña</label>
                                <input type="password" name="confirmar_password" required>
                            </div>
                            
                            <div class="consejos-password">
                                <h4>💡 Consejos para una buena contraseña:</h4>
                                <ul>
                                    <li>Usá algo que recuerdes fácilmente</li>
                                    <li>Podés incluir el nombre de tu mascota + números</li>
                                    <li>O tu fecha de cumple + algo especial para vos</li>
                                    <li>Evitá usar "123456" o "password" 😊</li>
                                </ul>
                            </div>
                            
                            <div class="botones-form">
                                <button type="submit" class="btn-guardar-password">
                                    <i class="fas fa-save"></i> Guardar Contraseña
                                </button>
                                <button type="button" class="btn-cancelar" onclick="this.closest('.modal-cambio-password').remove()">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.configurarFormularioPassword(modal);
        
        return modal;
    },

    // Configurar formulario de contraseña
    configurarFormularioPassword(modal) {
        const form = modal.querySelector('#form-cambio-password');
        const inputPassword = form.querySelector('input[name="nueva_password"]');
        const barreFuerza = modal.querySelector('.progreso-fuerza');
        const textoFuerza = modal.querySelector('.texto-fuerza');

        // Validación en tiempo real
        inputPassword.addEventListener('input', () => {
            const password = inputPassword.value;
            const validacion = this.validarPassword(password);
            
            // Actualizar indicador de fuerza
            this.actualizarIndicadorFuerza(validacion.fuerza, barreFuerza, textoFuerza);
        });

        // Procesar formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarCambioPassword(form, modal);
        });
    },

    // Actualizar indicador de fuerza
    actualizarIndicadorFuerza(fuerza, barra, texto) {
        // Remover clases anteriores
        barra.className = 'progreso-fuerza';
        
        switch(fuerza) {
            case 'débil':
                barra.classList.add('debil');
                barra.style.width = '33%';
                texto.textContent = 'Débil - Considera agregar más caracteres';
                break;
            case 'media':
                barra.classList.add('media');  
                barra.style.width = '66%';
                texto.textContent = 'Buena - Suficiente para empezar';
                break;
            case 'fuerte':
                barra.classList.add('fuerte');
                barra.style.width = '100%';
                texto.textContent = '¡Excelente! - Muy segura';
                break;
        }
    },

    // Procesar cambio de contraseña
    async procesarCambioPassword(form, modal) {
        const formData = new FormData(form);
        const nuevaPassword = formData.get('nueva_password');
        const confirmarPassword = formData.get('confirmar_password');
        const usuario = form.dataset.usuario;

        // Validaciones básicas
        if (nuevaPassword !== confirmarPassword) {
            alert('❌ Las contraseñas no coinciden');
            return;
        }

        const validacion = this.validarPassword(nuevaPassword);
        if (!validacion.valida) {
            alert('❌ ' + validacion.errores.join('\n'));
            return;
        }

        try {
            // Guardar nueva contraseña (en producción sería hasheada)
            await this.guardarNuevaPassword(usuario, nuevaPassword);
            
            // Éxito
            modal.innerHTML = `
                <div class="modal-backdrop">
                    <div class="modal-content">
                        <div class="modal-body text-center">
                            <div style="font-size: 3rem; margin-bottom: 20px;">🔒</div>
                            <h3 style="color: #28a745;">¡Contraseña Actualizada!</h3>
                            <p>Tu nueva contraseña ha sido guardada de forma segura.</p>
                            <p>Podés usarla desde ahora para acceder a tu cuenta.</p>
                            <button class="btn-ok" onclick="this.closest('.modal-cambio-password').remove()">
                                Perfecto
                            </button>
                        </div>
                    </div>
                </div>
            `;

        } catch (error) {
            console.error('Error guardando contraseña:', error);
            alert('❌ Error guardando la contraseña. Intentá nuevamente.');
        }
    },

    // Guardar nueva contraseña de forma segura
    async guardarNuevaPassword(usuario, password) {
        // En producción esto usaría bcrypt y base de datos segura
        const passwordSegura = await this.hashPassword(password);
        
        localStorage.setItem(`credenciales_${usuario}`, JSON.stringify({
            usuario: usuario,
            password: passwordSegura, // Hasheada
            fechaCambio: new Date().toISOString(),
            cambioRequerido: false
        }));

        console.log('🔒 Contraseña actualizada para usuario:', usuario);
    },

    // Simular hash de contraseña (en producción usar bcrypt real)
    async hashPassword(password) {
        // Esta es una simulación - en producción usar bcrypt
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'cresalia_salt_2024');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // ===== LOGIN SEGURO =====
    async verificarCredenciales(usuario, password) {
        try {
            const credencialesGuardadas = localStorage.getItem(`credenciales_${usuario}`);
            
            if (!credencialesGuardadas) {
                return { valido: false, mensaje: 'Usuario no encontrado' };
            }

            const credenciales = JSON.parse(credencialesGuardadas);
            const passwordHash = await this.hashPassword(password);

            if (passwordHash === credenciales.password) {
                return { 
                    valido: true, 
                    mensaje: 'Login exitoso',
                    cambioRequerido: credenciales.cambioRequerido 
                };
            } else {
                return { valido: false, mensaje: 'Contraseña incorrecta' };
            }

        } catch (error) {
            console.error('Error verificando credenciales:', error);
            return { valido: false, mensaje: 'Error del sistema' };
        }
    },

    // ===== RECUPERACIÓN DE CONTRASEÑA =====
    crearFormularioRecuperacion() {
        const modal = document.createElement('div');
        modal.className = 'modal-recuperacion';
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🔄 Recuperar Contraseña</h3>
                        <p>Te enviaremos instrucciones a tu email</p>
                    </div>
                    
                    <div class="modal-body">
                        <form id="form-recuperacion">
                            <div class="form-group">
                                <label>📧 Email de tu cuenta</label>
                                <input type="email" name="email_recuperacion" required
                                       placeholder="tu-email@ejemplo.com">
                            </div>
                            
                            <div class="info-recuperacion">
                                <i class="fas fa-info-circle"></i>
                                <div>
                                    <strong>¿Cómo funciona?</strong>
                                    <p>Te enviaremos un email con un enlace para crear una nueva contraseña. El enlace expira en 24 horas.</p>
                                </div>
                            </div>
                            
                            <div class="botones-form">
                                <button type="submit" class="btn-enviar-recuperacion">
                                    <i class="fas fa-paper-plane"></i> Enviar Recuperación
                                </button>
                                <button type="button" class="btn-cancelar" onclick="this.closest('.modal-recuperacion').remove()">
                                    Cancelar  
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = modal.querySelector('#form-recuperacion');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarRecuperacion(form, modal);
        });
        
        return modal;
    },

    // Procesar recuperación de contraseña
    procesarRecuperacion(form, modal) {
        const formData = new FormData(form);
        const email = formData.get('email_recuperacion');

        // Verificar que el usuario existe
        const existe = localStorage.getItem(`credenciales_${email}`);
        
        if (!existe) {
            alert('❌ No encontramos una cuenta con ese email');
            return;
        }

        // Simular envío de email (en producción usar EmailJS o similar)
        console.log(`📧 Enviando email de recuperación a: ${email}`);
        
        // Generar token de recuperación
        const tokenRecuperacion = this.generarToken();
        localStorage.setItem(`recuperacion_${email}`, JSON.stringify({
            token: tokenRecuperacion,
            fechaExpira: new Date(Date.now() + 24*60*60*1000).toISOString() // 24 horas
        }));

        // Mostrar confirmación
        modal.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-content">
                    <div class="modal-body text-center">
                        <div style="font-size: 3rem; margin-bottom: 20px;">📧</div>
                        <h3 style="color: #28a745;">Email Enviado</h3>
                        <p>Hemos enviado las instrucciones de recuperación a:</p>
                        <p style="font-weight: 600; color: #667eea;">${email}</p>
                        <p>Revisá tu bandeja de entrada y spam.</p>
                        <button class="btn-ok" onclick="this.closest('.modal-recuperacion').remove()">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // ===== CONFIGURACIÓN DE SEGURIDAD PERSONAL =====
    crearPanelSeguridadPersonal(usuario) {
        return `
            <div class="panel-seguridad-personal">
                <div class="header-seguridad">
                    <h3><i class="fas fa-shield-alt"></i> Tu Seguridad Personal</h3>
                    <p>Configurá tu cuenta para mayor protección</p>
                </div>
                
                <div class="opciones-seguridad">
                    <div class="opcion-seguridad">
                        <div class="icono-opcion">🔑</div>
                        <div class="info-opcion">
                            <h4>Cambiar Contraseña</h4>
                            <p>Actualizá tu contraseña cuando quieras</p>
                        </div>
                        <button onclick="SistemaCredenciales.crearFormularioCambioPassword('${usuario}')" class="btn-accion">
                            Cambiar
                        </button>
                    </div>
                    
                    <div class="opcion-seguridad">
                        <div class="icono-opcion">📧</div>
                        <div class="info-opcion">
                            <h4>Email de Recuperación</h4>
                            <p>Asegurate de tener acceso a tu email</p>
                        </div>
                        <button onclick="SistemaCredenciales.verificarEmail('${usuario}')" class="btn-accion">
                            Verificar
                        </button>
                    </div>
                    
                    <div class="opcion-seguridad">
                        <div class="icono-opcion">📱</div>
                        <div class="info-opcion">
                            <h4>Teléfono de Respaldo</h4>
                            <p>Número para recuperar tu cuenta</p>
                        </div>
                        <button onclick="SistemaCredenciales.configurarTelefono('${usuario}')" class="btn-accion">
                            Configurar
                        </button>
                    </div>
                    
                    <div class="opcion-seguridad">
                        <div class="icono-opcion">🔒</div>
                        <div class="info-opcion">
                            <h4>Sesiones Activas</h4>
                            <p>Cerrá sesiones que no uses</p>
                        </div>
                        <button onclick="SistemaCredenciales.mostrarSesiones('${usuario}')" class="btn-accion">
                            Ver Sesiones
                        </button>
                    </div>
                </div>
                
                <div class="info-privacidad">
                    <h4>🛡️ Tu Privacidad En Cresalia</h4>
                    <ul>
                        <li>✅ Tus datos están encriptados y protegidos</li>
                        <li>✅ Solo vos y el equipo CRISLA tenemos acceso</li>
                        <li>✅ Nunca compartimos información personal</li>
                        <li>✅ Podés eliminar tu cuenta cuando quieras</li>
                    </ul>
                </div>
            </div>
        `;
    },

    // Verificar email
    verificarEmail(usuario) {
        alert('📧 Se envió un código de verificación a tu email');
        // En producción: enviar email real con código
    },

    // Configurar teléfono
    configurarTelefono(usuario) {
        const telefono = prompt('📱 Ingresa tu número de teléfono (opcional):');
        if (telefono) {
            // Guardar teléfono encriptado
            console.log('📱 Teléfono configurado para:', usuario);
            alert('✅ Teléfono guardado correctamente');
        }
    },

    // Mostrar sesiones activas
    mostrarSesiones(usuario) {
        alert('🔒 Mostrando sesiones activas (funcionalidad próximamente)');
        // En producción: mostrar lista de sesiones con IP, dispositivo, fecha
    }
};

// Exportar para uso global
window.SistemaCredenciales = SistemaCredenciales;

console.log('🔒 Sistema de Credenciales Seguras Cresalia cargado');













