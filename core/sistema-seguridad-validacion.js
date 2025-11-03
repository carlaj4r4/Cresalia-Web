// ===== SISTEMA DE SEGURIDAD Y VALIDACIÓN - CRESALIA =====
// KYC, Detección de Fraude, Validación de Operaciones

class SistemaSeguridad {
    constructor() {
        this.nivelRiesgo = {
            BAJO: 'bajo',
            MEDIO: 'medio',
            ALTO: 'alto',
            CRÍTICO: 'critico'
        };
    }

    // ===== 1. VERIFICACIÓN DE IDENTIDAD (KYC) =====

    async verificarTenant(tenantData) {
        const verificaciones = {
            identidad: await this.verificarIdentidad(tenantData),
            email: await this.verificarEmail(tenantData.email),
            telefono: await this.verificarTelefono(tenantData.telefono),
            documentos: await this.verificarDocumentos(tenantData),
            mercadoPago: await this.verificarCuentaMercadoPago(tenantData.mp_credentials),
            negocio: await this.verificarLegitimidadNegocio(tenantData)
        };

        const scoreTotal = this.calcularScoreConfianza(verificaciones);
        const nivelRiesgo = this.determinarNivelRiesgo(scoreTotal);

        return {
            aprobado: scoreTotal >= 60, // Mínimo 60/100 para aprobar
            score: scoreTotal,
            nivelRiesgo,
            verificaciones,
            requiereRevisionManual: scoreTotal < 80,
            mensaje: this.getMensajeAprobacion(scoreTotal, verificaciones)
        };
    }

    // Verificar identidad (DNI/CUIT)
    async verificarIdentidad(tenantData) {
        const checks = {
            tieneDocumento: !!tenantData.documento,
            documentoValido: this.validarFormatoDocumento(tenantData.documento),
            nombreCoincide: this.verificarNombreDocumento(tenantData),
            edadMinima: this.verificarEdadMinima(tenantData.fecha_nacimiento)
        };

        // Score: 0-25 puntos
        let score = 0;
        if (checks.tieneDocumento) score += 5;
        if (checks.documentoValido) score += 10;
        if (checks.nombreCoincide) score += 5;
        if (checks.edadMinima) score += 5;

        return {
            aprobado: score >= 20,
            score,
            checks,
            requerido: ['tieneDocumento', 'documentoValido', 'edadMinima']
        };
    }

    // Validar formato de documento
    validarFormatoDocumento(doc) {
        if (!doc) return false;

        // DNI Argentina: 8 dígitos
        const dniRegex = /^\d{8}$/;
        // CUIT Argentina: 11 dígitos (formato XX-XXXXXXXX-X)
        const cuitRegex = /^\d{2}-?\d{8}-?\d{1}$/;

        return dniRegex.test(doc) || cuitRegex.test(doc);
    }

    // Verificar edad mínima (18 años)
    verificarEdadMinima(fechaNacimiento) {
        if (!fechaNacimiento) return false;
        
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        const edad = Math.floor((hoy - nacimiento) / (365.25 * 24 * 60 * 60 * 1000));
        
        return edad >= 18;
    }

    // ===== 2. VERIFICACIÓN DE EMAIL =====

    async verificarEmail(email) {
        const checks = {
            formatoValido: this.validarFormatoEmail(email),
            dominioValido: await this.verificarDominioEmail(email),
            noEsDisposable: !this.esEmailDisposable(email),
            verificadoPorUsuario: false // Se marca cuando hace clic en link
        };

        let score = 0;
        if (checks.formatoValido) score += 5;
        if (checks.dominioValido) score += 5;
        if (checks.noEsDisposable) score += 5;

        return {
            aprobado: score >= 10,
            score: score,
            checks,
            requiereVerificacion: true
        };
    }

    validarFormatoEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Lista de emails descartables (temporales)
    esEmailDisposable(email) {
        const dominiosDescartables = [
            'tempmail.com', 'guerrillamail.com', '10minutemail.com',
            'mailinator.com', 'throwaway.email', 'temp-mail.org'
        ];
        
        const dominio = email.split('@')[1]?.toLowerCase();
        return dominiosDescartables.includes(dominio);
    }

    // ===== 3. VERIFICACIÓN DE MERCADOPAGO =====

    async verificarCuentaMercadoPago(credentials) {
        if (!credentials || !credentials.access_token) {
            return {
                aprobado: false,
                score: 0,
                error: 'No se proporcionaron credenciales de MercadoPago'
            };
        }

        try {
            // Hacer request de prueba a MP API
            const response = await fetch('https://api.mercadopago.com/v1/account/credentials', {
                headers: {
                    'Authorization': `Bearer ${credentials.access_token}`
                }
            });

            if (!response.ok) {
                return {
                    aprobado: false,
                    score: 0,
                    error: 'Credenciales de MercadoPago inválidas'
                };
            }

            const accountInfo = await response.json();

            // Verificar que la cuenta esté activa y verificada
            const checks = {
                credencialesValidas: true,
                cuentaActiva: accountInfo.active || true,
                cuentaVerificada: accountInfo.verification_status === 'verified',
                tipoVendedor: accountInfo.seller_type !== 'fraud' // MP marca cuentas fraudulentas
            };

            let score = 0;
            if (checks.credencialesValidas) score += 10;
            if (checks.cuentaActiva) score += 5;
            if (checks.cuentaVerificada) score += 10;
            if (checks.tipoVendedor) score += 5;

            return {
                aprobado: score >= 20,
                score,
                checks,
                accountInfo: {
                    id: accountInfo.id,
                    email: accountInfo.email,
                    country: accountInfo.country_id
                }
            };

        } catch (error) {
            return {
                aprobado: false,
                score: 0,
                error: 'Error al verificar MercadoPago: ' + error.message
            };
        }
    }

    // ===== 4. DETECCIÓN DE FRAUDE =====

    async detectarFraude(tenantData, ordenData) {
        const indicadores = {
            // Análisis del tenant
            tenantNuevo: this.esTenantNuevo(tenantData),
            tenantConHistorial: this.tieneHistorialPositivo(tenantData),
            
            // Análisis de la orden
            montoSospechoso: this.esMontoSospechoso(ordenData),
            patronCompraInusual: this.esPatronInusual(ordenData, tenantData),
            velocidadTransacciones: this.velocidadSospechosa(tenantData),
            
            // Análisis de cliente comprador
            ipSospechosa: await this.verificarIP(ordenData.ip_cliente),
            emailSospechoso: this.esEmailDisposable(ordenData.email_cliente),
            
            // Comparación con base de fraudes conocidos
            enListaNegra: await this.verificarListaNegra(tenantData, ordenData)
        };

        const scoreRiesgo = this.calcularScoreRiesgo(indicadores);
        const accion = this.determinarAccion(scoreRiesgo);

        return {
            riesgo: scoreRiesgo,
            nivel: this.getNivelRiesgo(scoreRiesgo),
            indicadores,
            accion, // 'aprobar', 'revisar', 'rechazar', 'bloquear'
            requiereRevisionManual: scoreRiesgo >= 60,
            mensaje: this.getMensajeRiesgo(scoreRiesgo, indicadores)
        };
    }

    // Monto sospechoso (muy alto para tenant nuevo)
    esMontoSospechoso(ordenData) {
        const monto = ordenData.total;
        
        // Órdenes mayores a $50,000 en tenant nuevo son sospechosas
        if (monto > 50000 && this.esTenantNuevo(ordenData.tenant)) {
            return true;
        }

        // Órdenes mayores a $200,000 siempre se revisan
        if (monto > 200000) {
            return true;
        }

        return false;
    }

    // Patrón de compra inusual
    esPatronInusual(ordenData, tenantData) {
        // Muchos productos del mismo tipo
        if (ordenData.items.length > 50) return true;
        
        // Compra de productos muy diferentes al historial
        // (esto requiere ML, por ahora solo checks básicos)
        
        return false;
    }

    // Velocidad sospechosa de transacciones
    velocidadSospechosa(tenantData) {
        // Más de 10 órdenes en 1 hora = sospechoso
        const ordenesUltimaHora = this.contarOrdenesRecientes(tenantData.id, 1);
        return ordenesUltimaHora > 10;
    }

    // ===== 5. VALIDACIÓN DE TARJETAS =====

    validarTarjeta(numeroTarjeta) {
        // Algoritmo de Luhn (estándar de la industria)
        const numero = numeroTarjeta.replace(/\s/g, '');
        
        if (!/^\d+$/.test(numero)) {
            return {
                valida: false,
                error: 'Tarjeta contiene caracteres no numéricos'
            };
        }

        if (numero.length < 13 || numero.length > 19) {
            return {
                valida: false,
                error: 'Longitud de tarjeta inválida'
            };
        }

        // Algoritmo de Luhn
        let suma = 0;
        let alternado = false;

        for (let i = numero.length - 1; i >= 0; i--) {
            let digito = parseInt(numero.charAt(i));

            if (alternado) {
                digito *= 2;
                if (digito > 9) digito -= 9;
            }

            suma += digito;
            alternado = !alternado;
        }

        const luhnValido = (suma % 10) === 0;

        return {
            valida: luhnValido,
            tipo: this.detectarTipoTarjeta(numero),
            numero: this.enmascararTarjeta(numero),
            error: luhnValido ? null : 'Número de tarjeta inválido'
        };
    }

    // Detectar tipo de tarjeta
    detectarTipoTarjeta(numero) {
        const patrones = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5)/,
            diners: /^3(?:0[0-5]|[68])/,
            jcb: /^(?:2131|1800|35)/,
            cabal: /^(60420[1-9]|6042[1-9][0-9]|6043[0-9]{2}|604400)/,
            naranja: /^(589562)/
        };

        for (const [tipo, patron] of Object.entries(patrones)) {
            if (patron.test(numero)) {
                return tipo;
            }
        }

        return 'desconocida';
    }

    // Enmascarar tarjeta (XXXX XXXX XXXX 1234)
    enmascararTarjeta(numero) {
        const ultimos4 = numero.slice(-4);
        return `**** **** **** ${ultimos4}`;
    }

    // ===== 6. VERIFICACIÓN DE CUENTA BANCARIA =====

    async verificarCuentaBancaria(cbu, titular) {
        // CBU Argentina: 22 dígitos
        if (!/^\d{22}$/.test(cbu)) {
            return {
                valida: false,
                error: 'CBU debe tener 22 dígitos'
            };
        }

        // Verificar dígitos verificadores
        const cbuValido = this.validarCBU(cbu);

        if (!cbuValido) {
            return {
                valida: false,
                error: 'CBU inválido (dígitos verificadores incorrectos)'
            };
        }

        // Verificar titular (opcional, requiere integración bancaria)
        const titularCoincide = await this.verificarTitularCBU(cbu, titular);

        return {
            valida: true,
            banco: this.identificarBancoCBU(cbu),
            titular: titularCoincide ? titular : 'No verificado',
            advertencia: titularCoincide ? null : 'Titular no verificado'
        };
    }

    // Validar CBU con dígitos verificadores
    validarCBU(cbu) {
        // Algoritmo de validación CBU Argentina
        const bloque1 = cbu.substring(0, 8);
        const bloque2 = cbu.substring(8, 22);

        // Validar primer bloque
        const digitoVerif1 = parseInt(cbu.charAt(7));
        const suma1 = 
            parseInt(cbu.charAt(0)) * 7 +
            parseInt(cbu.charAt(1)) * 1 +
            parseInt(cbu.charAt(2)) * 3 +
            parseInt(cbu.charAt(3)) * 9 +
            parseInt(cbu.charAt(4)) * 7 +
            parseInt(cbu.charAt(5)) * 1 +
            parseInt(cbu.charAt(6)) * 3;
        const digitoCalculado1 = (10 - (suma1 % 10)) % 10;

        if (digitoVerif1 !== digitoCalculado1) return false;

        // Validar segundo bloque
        const digitoVerif2 = parseInt(cbu.charAt(21));
        const suma2 = 
            parseInt(cbu.charAt(8)) * 3 +
            parseInt(cbu.charAt(9)) * 9 +
            parseInt(cbu.charAt(10)) * 7 +
            parseInt(cbu.charAt(11)) * 1 +
            parseInt(cbu.charAt(12)) * 3 +
            parseInt(cbu.charAt(13)) * 9 +
            parseInt(cbu.charAt(14)) * 7 +
            parseInt(cbu.charAt(15)) * 1 +
            parseInt(cbu.charAt(16)) * 3 +
            parseInt(cbu.charAt(17)) * 9 +
            parseInt(cbu.charAt(18)) * 7 +
            parseInt(cbu.charAt(19)) * 1 +
            parseInt(cbu.charAt(20)) * 3;
        const digitoCalculado2 = (10 - (suma2 % 10)) % 10;

        return digitoVerif2 === digitoCalculado2;
    }

    // ===== 7. MONITOREO DE ACTIVIDAD SOSPECHOSA =====

    async monitorearActividad(tenantId) {
        const ventanaHoras = 24;
        const actividad = await this.obtenerActividad(tenantId, ventanaHoras);

        const banderas = {
            // Actividad
            muchasOrdenesRapido: actividad.ordenes > 50, // Más de 50 órdenes en 24h
            productosExcesivos: actividad.productosAgregados > 100,
            cambiosConfiguracion: actividad.cambiosConfig > 20,
            
            // Financiero
            montoExcesivo: actividad.montoTotal > 500000, // $500K en 24h
            devolucionesExcesivas: actividad.tasaDevolucion > 0.5, // 50%+ devuelven
            
            // Comportamiento
            loginsDiferentesIP: actividad.ipsUnicas > 10,
            intentosFallidosLogin: actividad.intentosFallidos > 5,
            
            // Reportes
            reportadoPorUsuarios: actividad.reportes > 3
        };

        const scoreRiesgo = Object.values(banderas).filter(v => v).length * 10;

        return {
            riesgo: scoreRiesgo,
            nivel: this.getNivelRiesgo(scoreRiesgo),
            banderas,
            accion: this.determinarAccionMonitoreo(scoreRiesgo, banderas),
            requiereRevision: scoreRiesgo >= 30
        };
    }

    // ===== 8. SISTEMA DE REPORTES =====

    async procesarReporte(reporteData) {
        const {
            tenant_id,
            reportado_por,
            tipo, // 'fraude', 'producto_falso', 'no_envia', 'estafa'
            descripcion,
            evidencia
        } = reporteData;

        // Guardar reporte
        const reporte = {
            id: Date.now(),
            tenant_id,
            reportado_por,
            tipo,
            descripcion,
            evidencia,
            estado: 'pendiente',
            prioridad: this.calcularPrioridadReporte(tipo),
            creado_at: new Date().toISOString()
        };

        // Verificar si es el tercer reporte
        const reportesPrevios = await this.contarReportes(tenant_id);

        if (reportesPrevios >= 2) {
            // Tercer reporte = suspensión automática
            await this.suspenderTenant(tenant_id, 'Múltiples reportes');
            await this.notificarCarla({
                urgencia: 'CRÍTICA',
                mensaje: `Tenant ${tenant_id} suspendido automáticamente (3+ reportes)`,
                reporte
            });
        } else if (reportesPrevios === 1) {
            // Segundo reporte = advertencia
            await this.advertirTenant(tenant_id);
            await this.notificarCarla({
                urgencia: 'ALTA',
                mensaje: `Tenant ${tenant_id} tiene 2 reportes. Revisar.`,
                reporte
            });
        } else {
            // Primer reporte = investigar
            await this.notificarCarla({
                urgencia: 'MEDIA',
                mensaje: `Nuevo reporte contra tenant ${tenant_id}`,
                reporte
            });
        }

        return reporte;
    }

    // ===== 9. VALIDACIÓN DE OPERACIONES EN TIEMPO REAL =====

    async validarOperacion(operacionData) {
        const {
            tenant_id,
            tipo, // 'venta', 'reembolso', 'cambio_config'
            monto,
            datos
        } = operacionData;

        // 1. Verificar que tenant esté activo
        const tenantActivo = await this.verificarTenantActivo(tenant_id);
        if (!tenantActivo) {
            return {
                permitir: false,
                razon: 'Cuenta suspendida o inactiva',
                codigo: 'TENANT_INACTIVO'
            };
        }

        // 2. Verificar límites según plan
        const limites = await this.verificarLimites(tenant_id, operacionData);
        if (!limites.dentroLimites) {
            return {
                permitir: false,
                razon: limites.razon,
                codigo: 'LIMITE_EXCEDIDO',
                sugerencia: 'Actualizar a plan superior'
            };
        }

        // 3. Análisis de riesgo de la operación
        const riesgo = await this.analizarRiesgoOperacion(operacionData);
        
        if (riesgo.nivel === this.nivelRiesgo.CRÍTICO) {
            // Bloquear automáticamente
            await this.bloquearOperacion(operacionData);
            await this.notificarCarla({
                urgencia: 'CRÍTICA',
                mensaje: `Operación bloqueada - Riesgo CRÍTICO`,
                tenant_id,
                operacion: operacionData,
                riesgo
            });

            return {
                permitir: false,
                razon: 'Operación de alto riesgo bloqueada',
                codigo: 'RIESGO_CRITICO'
            };
        }

        if (riesgo.nivel === this.nivelRiesgo.ALTO) {
            // Requiere revisión manual (Carla decide)
            await this.marcarParaRevision(operacionData);
            await this.notificarCarla({
                urgencia: 'ALTA',
                mensaje: `Operación requiere tu aprobación`,
                tenant_id,
                operacion: operacionData,
                riesgo
            });

            return {
                permitir: false,
                razon: 'Operación en revisión manual',
                codigo: 'EN_REVISION',
                mensaje: 'Tu operación está siendo revisada por seguridad. Te notificaremos pronto.'
            };
        }

        // Riesgo bajo/medio = permitir
        return {
            permitir: true,
            riesgo: riesgo.nivel,
            mensaje: 'Operación aprobada'
        };
    }

    // ===== 10. SISTEMA DE PUNTUACIÓN DE CONFIANZA =====

    async calcularScoreConfianza(tenant_id) {
        const metricas = await this.obtenerMetricas(tenant_id);

        const factores = {
            // Tiempo activo (más tiempo = más confianza)
            antiguedad: this.scorePorAntiguedad(metricas.dias_activo),
            
            // Volumen (más ventas exitosas = más confianza)
            ventasExitosas: this.scorePorVentas(metricas.ventas_exitosas),
            
            // Satisfacción (clientes felices = confianza)
            satisfaccionClientes: this.scorePorSatisfaccion(metricas.rating_promedio),
            
            // Financiero (buen historial de pagos)
            pagosPuntuales: this.scorePorPagos(metricas.pagos_puntuales),
            
            // Comportamiento
            sinReportes: metricas.reportes === 0 ? 20 : 0,
            sinDevoluciones: metricas.tasa_devolucion < 0.1 ? 15 : 0,
            
            // Engagement
            perfilCompleto: metricas.perfil_completo ? 10 : 0,
            productosActivos: Math.min(metricas.productos_activos * 0.5, 10)
        };

        const scoreTotal = Object.values(factores).reduce((a, b) => a + b, 0);

        return {
            score: scoreTotal,
            nivel: this.getNivelConfianza(scoreTotal),
            factores,
            recomendaciones: this.getRecomendaciones(factores)
        };
    }

    getNivelConfianza(score) {
        if (score >= 90) return 'EXCELENTE';
        if (score >= 70) return 'BUENO';
        if (score >= 50) return 'ACEPTABLE';
        if (score >= 30) return 'BAJO';
        return 'MUY BAJO';
    }

    // ===== 11. LISTA NEGRA / WHITELIST =====

    async verificarListaNegra(tenantData, ordenData) {
        const checks = {
            emailEnListaNegra: await this.verificarEmailListaNegra(tenantData.email),
            ipEnListaNegra: await this.verificarIPListaNegra(ordenData?.ip_cliente),
            documentoEnListaNegra: await this.verificarDocumentoListaNegra(tenantData.documento),
            cuentaMPBloqueada: await this.verificarMPBloqueado(tenantData.mp_account_id)
        };

        return Object.values(checks).some(v => v === true);
    }

    // ===== 12. ACCIONES AUTOMÁTICAS =====

    async suspenderTenant(tenant_id, razon) {
        // Actualizar en base de datos
        await fetch(`/api/admin/tenants/${tenant_id}/suspender`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                razon,
                suspendido_at: new Date().toISOString(),
                suspendido_por: 'sistema_automatico'
            })
        });

        // Enviar email al tenant
        await this.enviarEmailSuspension(tenant_id, razon);

        // Log de auditoría
        await this.registrarLog({
            tipo: 'suspension',
            tenant_id,
            razon,
            timestamp: new Date().toISOString()
        });
    }

    async advertirTenant(tenant_id) {
        await this.enviarEmailAdvertencia(tenant_id);
        
        await this.registrarLog({
            tipo: 'advertencia',
            tenant_id,
            timestamp: new Date().toISOString()
        });
    }

    // ===== 13. PANEL DE SEGURIDAD PARA CARLA =====

    crearPanelSeguridad() {
        const panel = document.createElement('div');
        panel.className = 'panel-seguridad';
        panel.innerHTML = `
            <div class="seguridad-container">
                <div class="seguridad-header">
                    <h1>
                        <i class="fas fa-shield-alt"></i>
                        Centro de Seguridad
                    </h1>
                    <p>Monitoreo y protección en tiempo real</p>
                </div>

                <!-- Alertas activas -->
                <div class="alertas-criticas" id="alertas-criticas">
                    <!-- Se llenan dinámicamente -->
                </div>

                <!-- Métricas de seguridad -->
                <div class="metricas-seguridad">
                    <div class="metrica-card">
                        <div class="metrica-icono rojo">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="metrica-info">
                            <h3 id="operaciones-bloqueadas">0</h3>
                            <p>Operaciones Bloqueadas (Hoy)</p>
                        </div>
                    </div>

                    <div class="metrica-card">
                        <div class="metrica-icono amarillo">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="metrica-info">
                            <h3 id="en-revision">0</h3>
                            <p>En Revisión Manual</p>
                        </div>
                    </div>

                    <div class="metrica-card">
                        <div class="metrica-icono verde">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="metrica-info">
                            <h3 id="operaciones-seguras">0</h3>
                            <p>Operaciones Seguras</p>
                        </div>
                    </div>

                    <div class="metrica-card">
                        <div class="metrica-icono azul">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="metrica-info">
                            <h3 id="tenants-verificados">0</h3>
                            <p>Tenants Verificados</p>
                        </div>
                    </div>
                </div>

                <!-- Operaciones pendientes de revisión -->
                <div class="operaciones-revision">
                    <h2>
                        <i class="fas fa-clipboard-list"></i>
                        Requieren Tu Revisión
                    </h2>
                    <div id="lista-revision">
                        <!-- Se llena dinámicamente -->
                    </div>
                </div>

                <!-- Tenants sospechosos -->
                <div class="tenants-sospechosos">
                    <h2>
                        <i class="fas fa-user-shield"></i>
                        Monitoreo de Tenants
                    </h2>
                    <div id="lista-tenants-sospechosos">
                        <!-- Se llena dinámicamente -->
                    </div>
                </div>

                <!-- Reportes de usuarios -->
                <div class="reportes-usuarios">
                    <h2>
                        <i class="fas fa-flag"></i>
                        Reportes de Usuarios
                    </h2>
                    <div id="lista-reportes">
                        <!-- Se llena dinámicamente -->
                    </div>
                </div>
            </div>

            ${this.getStylesPanelSeguridad()}
        `;

        return panel;
    }

    // ===== 14. NOTIFICACIONES A CARLA =====

    async notificarCarla(notificacion) {
        const { urgencia, mensaje, tenant_id, operacion, riesgo } = notificacion;

        // 1. Guardar en base de datos
        await fetch('/api/admin/notificaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                urgencia,
                mensaje,
                tenant_id,
                datos: { operacion, riesgo },
                leida: false,
                creada_at: new Date().toISOString()
            })
        });

        // 2. Email a Carla (si es crítico)
        if (urgencia === 'CRÍTICA') {
            await this.enviarEmailCarla({
                asunto: `🚨 ALERTA CRÍTICA: ${mensaje}`,
                cuerpo: this.formatearAlertaEmail(notificacion)
            });
        }

        // 3. Push notification (si está activado)
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🔔 Cresalia Seguridad', {
                body: mensaje,
                icon: '/assets/logo.png',
                badge: '/assets/logo.png',
                tag: `seguridad-${tenant_id}`,
                requireInteraction: urgencia === 'CRÍTICA'
            });
        }

        // 4. WhatsApp (si es crítico y configurado)
        if (urgencia === 'CRÍTICA' && process.env.CARLA_WHATSAPP) {
            await this.enviarWhatsAppCarla(mensaje);
        }
    }

    // ===== 15. HELPERS =====

    calcularScoreRiesgo(indicadores) {
        let score = 0;
        
        if (indicadores.tenantNuevo) score += 10;
        if (!indicadores.tenantConHistorial) score += 15;
        if (indicadores.montoSospechoso) score += 25;
        if (indicadores.patronCompraInusual) score += 20;
        if (indicadores.velocidadTransacciones) score += 25;
        if (indicadores.ipSospechosa) score += 15;
        if (indicadores.emailSospechoso) score += 10;
        if (indicadores.enListaNegra) score += 100; // Auto-bloqueo

        return score;
    }

    getNivelRiesgo(score) {
        if (score >= 80) return this.nivelRiesgo.CRÍTICO;
        if (score >= 60) return this.nivelRiesgo.ALTO;
        if (score >= 30) return this.nivelRiesgo.MEDIO;
        return this.nivelRiesgo.BAJO;
    }

    determinarAccion(scoreRiesgo) {
        if (scoreRiesgo >= 80) return 'bloquear';
        if (scoreRiesgo >= 60) return 'revisar_manual';
        if (scoreRiesgo >= 30) return 'monitorear';
        return 'aprobar';
    }

    // Estilos del panel
    getStylesPanelSeguridad() {
        return `
        <style>
            .panel-seguridad {
                max-width: 1400px;
                margin: 0 auto;
                padding: 40px 20px;
            }

            .seguridad-header {
                background: linear-gradient(135deg, #EF4444, #F87171);
                color: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                margin-bottom: 32px;
                box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
            }

            .seguridad-header h1 {
                font-size: 36px;
                margin: 0 0 12px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
            }

            .alertas-criticas {
                margin-bottom: 32px;
            }

            .alerta-item {
                background: #FEE2E2;
                border-left: 4px solid #EF4444;
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .metricas-seguridad {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 24px;
                margin-bottom: 40px;
            }

            .metrica-card {
                background: white;
                border-radius: 16px;
                padding: 24px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                display: flex;
                gap: 20px;
                align-items: center;
            }

            .metrica-icono {
                width: 64px;
                height: 64px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                color: white;
            }

            .metrica-icono.rojo {
                background: linear-gradient(135deg, #EF4444, #F87171);
            }

            .metrica-icono.amarillo {
                background: linear-gradient(135deg, #F59E0B, #FCD34D);
            }

            .metrica-icono.verde {
                background: linear-gradient(135deg, #10B981, #34D399);
            }

            .metrica-icono.azul {
                background: linear-gradient(135deg, #3B82F6, #60A5FA);
            }

            .metrica-info h3 {
                font-size: 32px;
                font-weight: 800;
                margin: 0 0 4px 0;
                color: #1F2937;
            }

            .metrica-info p {
                margin: 0;
                color: #6B7280;
                font-size: 14px;
            }
        </style>
        `;
    }
}

// Inicializar globalmente
window.initSistemaSeguridad = function() {
    window.sistemaSeguridad = new SistemaSeguridad();
    return window.sistemaSeguridad;
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SistemaSeguridad };
}


