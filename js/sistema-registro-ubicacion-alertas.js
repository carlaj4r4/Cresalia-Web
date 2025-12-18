/**
 * 📍 Sistema de Registro de Ubicación para Alertas
 * Permite a los usuarios registrar su ubicación para recibir alertas de emergencia
 */

class SistemaRegistroUbicacionAlertas {
    constructor() {
        this.ubicacionActual = null;
        this.consentimientoDado = false;
        this.init();
    }

    async init() {
        console.log('📍 Inicializando sistema de registro de ubicación...');
        
        // Verificar si ya dio consentimiento
        const consentimiento = localStorage.getItem('alertas_ubicacion_consentimiento');
        if (consentimiento === 'true') {
            this.consentimientoDado = true;
            await this.obtenerYRegistrarUbicacion();
        } else {
            this.mostrarModalConsentimiento();
        }
    }

    mostrarModalConsentimiento() {
        // Verificar si ya se mostró hoy
        const ultimoRechazo = localStorage.getItem('alertas_ubicacion_ultimo_rechazo');
        if (ultimoRechazo) {
            const horasDesdeRechazo = (Date.now() - parseInt(ultimoRechazo)) / (1000 * 60 * 60);
            if (horasDesdeRechazo < 24) {
                console.log('📍 Usuario rechazó recientemente. No molestar.');
                return;
            }
        }

        const modal = document.createElement('div');
        modal.id = 'modal-consentimiento-ubicacion';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            animation: fadeIn 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 16px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            ">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 16px;
                        font-size: 40px;
                    ">📍</div>
                    <h2 style="
                        font-size: 24px;
                        font-weight: 600;
                        color: #1a202c;
                        margin: 0 0 8px;
                    ">Recibe Alertas de Emergencia</h2>
                    <p style="
                        color: #718096;
                        font-size: 14px;
                        margin: 0;
                    ">Te notificaremos solo en situaciones críticas</p>
                </div>

                <div style="
                    background: #f7fafc;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 24px;
                ">
                    <div style="margin-bottom: 16px;">
                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            margin-bottom: 8px;
                        ">
                            <span style="
                                font-size: 24px;
                                width: 32px;
                                text-align: center;
                            ">🚨</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #2d3748; font-size: 14px;">
                                    Desastres Naturales
                                </div>
                                <div style="color: #718096; font-size: 12px;">
                                    Inundaciones, incendios, terremotos
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            margin-bottom: 8px;
                        ">
                            <span style="
                                font-size: 24px;
                                width: 32px;
                                text-align: center;
                            ">⚠️</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #2d3748; font-size: 14px;">
                                    Cortes de Servicios
                                </div>
                                <div style="color: #718096; font-size: 12px;">
                                    Agua, luz, gas (solo si estás cerca)
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 12px;
                        ">
                            <span style="
                                font-size: 24px;
                                width: 32px;
                                text-align: center;
                            ">💜</span>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #2d3748; font-size: 14px;">
                                    Solidaridad Comunitaria
                                </div>
                                <div style="color: #718096; font-size: 12px;">
                                    Ayuda a tu comunidad en momentos críticos
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="
                    background: #fff5f5;
                    border-left: 4px solid #f56565;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                ">
                    <p style="
                        color: #c53030;
                        font-size: 12px;
                        margin: 0;
                        line-height: 1.6;
                    ">
                        🔒 <strong>Tu privacidad es importante:</strong> Tu ubicación se guarda de forma segura 
                        y solo se usa para enviarte alertas relevantes. Puedes revocar el permiso en cualquier momento.
                    </p>
                </div>

                <div style="
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                ">
                    <button id="btn-aceptar-ubicacion" style="
                        flex: 1;
                        min-width: 140px;
                        padding: 14px 24px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        font-size: 15px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">
                        Activar Alertas
                    </button>
                    <button id="btn-rechazar-ubicacion" style="
                        flex: 1;
                        min-width: 140px;
                        padding: 14px 24px;
                        background: #e2e8f0;
                        color: #4a5568;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        font-size: 15px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">
                        Ahora No
                    </button>
                </div>

                <p style="
                    text-align: center;
                    color: #a0aec0;
                    font-size: 11px;
                    margin: 16px 0 0;
                ">
                    Puedes cambiar esta configuración en cualquier momento
                </p>
            </div>

            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                #btn-aceptar-ubicacion:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                }
                #btn-rechazar-ubicacion:hover {
                    background: #cbd5e0;
                }
            </style>
        `;

        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('btn-aceptar-ubicacion').addEventListener('click', () => {
            this.aceptarConsentimiento();
            modal.remove();
        });

        document.getElementById('btn-rechazar-ubicacion').addEventListener('click', () => {
            this.rechazarConsentimiento();
            modal.remove();
        });
    }

    async aceptarConsentimiento() {
        localStorage.setItem('alertas_ubicacion_consentimiento', 'true');
        this.consentimientoDado = true;
        
        if (typeof elegantNotifications !== 'undefined') {
            elegantNotifications.show('📍 ¡Gracias! Ahora recibirás alertas de emergencia', 'success');
        }
        
        await this.obtenerYRegistrarUbicacion();
    }

    rechazarConsentimiento() {
        localStorage.setItem('alertas_ubicacion_ultimo_rechazo', Date.now().toString());
        
        if (typeof elegantNotifications !== 'undefined') {
            elegantNotifications.show('Puedes activar las alertas en cualquier momento desde Configuración', 'info');
        }
    }

    async obtenerYRegistrarUbicacion() {
        if (!navigator.geolocation) {
            console.error('❌ Geolocalización no soportada');
            return;
        }

        try {
            const position = await this.obtenerUbicacion();
            this.ubicacionActual = {
                latitud: position.coords.latitude,
                longitud: position.coords.longitude
            };

            console.log('📍 Ubicación obtenida:', this.ubicacionActual);

            // Registrar en Supabase
            await this.registrarEnSupabase();

        } catch (error) {
            console.error('❌ Error obteniendo ubicación:', error);
            
            if (error.code === error.PERMISSION_DENIED) {
                if (typeof elegantNotifications !== 'undefined') {
                    elegantNotifications.show(
                        'Permiso denegado. Ve a Configuración del navegador para habilitarlo',
                        'error'
                    );
                }
            }
        }
    }

    obtenerUbicacion() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutos
            });
        });
    }

    async registrarEnSupabase() {
        if (!window.supabaseClient) {
            console.error('❌ Supabase no está inicializado');
            return;
        }

        try {
            // Obtener email del usuario
            const { data: { user } } = await supabaseClient.auth.getUser();
            
            let email, usuarioId, usuarioHash;

            if (user) {
                email = user.email;
                usuarioId = user.id;
            } else {
                // Usuario anónimo - pedir email
                email = await this.pedirEmail();
                if (!email) return;
                
                usuarioHash = this.generarHash(email);
            }

            // Llamar a función RPC de Supabase
            const { data, error } = await supabaseClient.rpc('registrar_ubicacion_usuario', {
                p_email: email,
                p_latitud: this.ubicacionActual.latitud,
                p_longitud: this.ubicacionActual.longitud,
                p_usuario_id: usuarioId || null,
                p_usuario_hash: usuarioHash || null,
                p_radio_alertas_km: 10
            });

            if (error) throw error;

            console.log('✅ Ubicación registrada en Supabase:', data);
            
            if (typeof elegantNotifications !== 'undefined') {
                elegantNotifications.show(
                    '✅ Listo! Te notificaremos sobre emergencias cercanas',
                    'success'
                );
            }

        } catch (error) {
            console.error('❌ Error registrando ubicación:', error);
        }
    }

    async pedirEmail() {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
            `;

            modal.innerHTML = `
                <div style="
                    background: white;
                    border-radius: 16px;
                    padding: 32px;
                    max-width: 400px;
                    width: 90%;
                ">
                    <h3 style="margin: 0 0 16px; font-size: 20px; color: #1a202c;">
                        📧 Email para Alertas
                    </h3>
                    <p style="color: #718096; font-size: 14px; margin: 0 0 20px;">
                        ¿A qué email quieres recibir las alertas de emergencia?
                    </p>
                    <input type="email" id="input-email-alertas" placeholder="tu@email.com" style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #e2e8f0;
                        border-radius: 8px;
                        font-size: 15px;
                        margin-bottom: 16px;
                        box-sizing: border-box;
                    ">
                    <div style="display: flex; gap: 12px;">
                        <button id="btn-confirmar-email" style="
                            flex: 1;
                            padding: 12px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                        ">Confirmar</button>
                        <button id="btn-cancelar-email" style="
                            flex: 1;
                            padding: 12px;
                            background: #e2e8f0;
                            color: #4a5568;
                            border: none;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                        ">Cancelar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const input = document.getElementById('input-email-alertas');
            input.focus();

            document.getElementById('btn-confirmar-email').addEventListener('click', () => {
                const email = input.value.trim();
                if (this.validarEmail(email)) {
                    modal.remove();
                    resolve(email);
                } else {
                    alert('Por favor, ingresa un email válido');
                }
            });

            document.getElementById('btn-cancelar-email').addEventListener('click', () => {
                modal.remove();
                resolve(null);
            });
        });
    }

    validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    generarHash(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'user_' + Math.abs(hash).toString(36);
    }

    // Método público para revocar consentimiento
    revocarConsentimiento() {
        localStorage.removeItem('alertas_ubicacion_consentimiento');
        this.consentimientoDado = false;
        
        if (typeof elegantNotifications !== 'undefined') {
            elegantNotifications.show('Consentimiento revocado. Ya no recibirás alertas automáticas', 'info');
        }
    }

    // Método público para actualizar ubicación manualmente
    async actualizarUbicacion() {
        if (!this.consentimientoDado) {
            this.mostrarModalConsentimiento();
            return;
        }
        
        await this.obtenerYRegistrarUbicacion();
    }
}

// Inicializar automáticamente
if (typeof window !== 'undefined') {
    window.sistemaUbicacionAlertas = new SistemaRegistroUbicacionAlertas();
    console.log('✅ Sistema de ubicación para alertas cargado');
}
