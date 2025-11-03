// ===== SISTEMA ANTI-FRAUDES CRESALIA =====
// Version 1.0 - Implementación Gradual Inteligente
// Co-fundadores: CRISLA & Claude
// Filosofía: Comenzar simple, crecer con inteligencia

const SistemaAntiFraudes = {
    // ===== CONFIGURACIÓN =====
    config: {
        version: '1.0.0',
        debug: true,
        modoLanzamiento: true, // Filtros suaves para empezar
        alertasActivadas: true,
        expulsionActivada: true
    },

    // ===== PALABRAS CLAVE PROHIBIDAS (IA DETECTION) =====
    palabrasProhibidas: {
        // Productos ilegales
        drogas: ['marihuana', 'cocaína', 'éxtasis', 'mdma', 'lsd', 'heroína', 'fentanilo', 'cannabis ilegal'],
        armas: ['pistola', 'revólver', 'rifle', 'escopeta', 'municiones', 'explosivos', 'granada'],
        estafas: ['inversión garantizada', 'gana dinero fácil', 'sin riesgo', 'millonario en días', 'sistema infalible'],
        
        // Servicios ilegales  
        sexuales: ['prostitución', 'escorts', 'masajes eróticos', 'contenido adulto'],
        documentos: ['dni falso', 'pasaporte falso', 'título universitario falso', 'certificado médico falso'],
        
        // Animales (protección)
        maltrato: ['pelea de gallos', 'pelea de perros', 'animales exóticos ilegales', 'cacería ilegal'],
        
        // Políticos/corrupción
        politicos: ['campaña política', 'compra de votos', 'soborno', 'coimas']
    },

    // ===== PREGUNTAS FILTRO INICIAL (SUAVE) =====
    preguntasFiltro: {
        historia: {
            pregunta: "🌟 Contanos brevemente: ¿Qué te motivó a emprender?",
            placeholder: "Ej: Perdí mi empleo y decidí cocinar tortas para vender...",
            minLength: 10, // Reducido para personas de pocas palabras
            maxLength: 500, // Aumentado para más detalle
            requerida: true
        },
        
        producto: {
            pregunta: "🛍️ ¿Qué producto o servicio ofrecés?",
            placeholder: "Ej: Tortas caseras, ropa tejida, servicios de limpieza...",
            minLength: 5, // Mínimo muy bajo
            maxLength: 300, // Más espacio
            requerida: true
        },
        
        conocimiento: {
            pregunta: "📱 ¿Cómo conociste Cresalia?",
            opciones: [
                "Redes sociales",
                "Recomendación de amigo/familiar", 
                "Búsqueda en Google",
                "Publicidad online",
                "Otro emprendedor me contó",
                "Otro"
            ],
            requerida: true
        },
        
        objetivo: {
            pregunta: "🎯 ¿Cuál es tu objetivo principal con tu tienda online?",
            placeholder: "Ej: Generar ingresos extra, hacer crecer mi negocio...",
            minLength: 0, // Completamente opcional
            maxLength: 200,
            requerida: false // Opcional para no ser muy exigentes
        }
    },

    // ===== ALERTAS AUTOMÁTICAS IA =====
    alertasIA: {
        // Detector de patrones sospechosos
        detectarPatrones(texto) {
            const alertas = [];
            const textoLower = texto.toLowerCase();

            // Verificar palabras prohibidas
            for (let categoria in this.palabrasProhibidas) {
                for (let palabra of this.palabrasProhibidas[categoria]) {
                    if (textoLower.includes(palabra)) {
                        alertas.push({
                            tipo: 'palabra_prohibida',
                            categoria: categoria,
                            palabra: palabra,
                            severidad: 'alta',
                            accion: 'rechazar_automatico'
                        });
                    }
                }
            }

            // Detectar promesas irreales
            const promesasIrreales = [
                /ganar.*\$.*sin.*esfuerzo/i,
                /millonario.*en.*días/i,
                /dinero.*fácil.*garantizado/i,
                /inversión.*sin.*riesgo/i
            ];

            promesasIrreales.forEach(patron => {
                if (patron.test(texto)) {
                    alertas.push({
                        tipo: 'promesa_irreal',
                        severidad: 'alta',
                        accion: 'revision_manual'
                    });
                }
            });

            // Detectar texto muy corto (poco esfuerzo)
            if (texto.trim().length < 20) {
                alertas.push({
                    tipo: 'texto_muy_corto',
                    severidad: 'media',
                    accion: 'solicitar_mas_info'
                });
            }

            // Detectar texto copiado (patrones repetitivos)
            if (this.esTextoCopiado(texto)) {
                alertas.push({
                    tipo: 'posible_texto_copiado',
                    severidad: 'media',
                    accion: 'revision_manual'
                });
            }

            return alertas;
        },

        // Detector de texto copiado/genérico
        esTextoCopiado(texto) {
            const patronesGenericos = [
                'lorem ipsum',
                'texto de ejemplo',
                'sample text',
                'prueba 123'
            ];

            return patronesGenericos.some(patron => 
                texto.toLowerCase().includes(patron)
            );
        },

        // Verificar imágenes (básico)
        verificarImagenes(imagenes) {
            const alertas = [];
            
            if (!imagenes || imagenes.length === 0) {
                alertas.push({
                    tipo: 'sin_imagenes',
                    severidad: 'baja',
                    accion: 'advertencia'
                });
            }

            // TODO: Implementar detección de imágenes stock/fake
            // usando APIs de reverse image search

            return alertas;
        }
    },

    // ===== PROCESO DE EXPULSIÓN =====
    procesoExpulsion: {
        // Niveles de severidad
        niveles: {
            advertencia: {
                accion: 'enviar_advertencia',
                mensaje: '⚠️ Advertencia: Tu contenido puede no cumplir nuestras políticas',
                plazoCorreccion: 7 // días
            },
            
            suspension_temporal: {
                accion: 'suspender_temporalmente', 
                duracion: 30, // días
                mensaje: '🚫 Tu tienda ha sido suspendida temporalmente'
            },
            
            expulsion_permanente: {
                accion: 'expulsar_permanente',
                mensaje: '❌ Tu cuenta ha sido eliminada permanentemente'
            }
        },

        // Determinar acción según alertas (MODO SUAVE - NO RECHAZA AUTOMÁTICO)
        determinarAccion(alertas) {
            let severidadMaxima = 'baja';
            let alertasAltas = 0;

            alertas.forEach(alerta => {
                if (alerta.severidad === 'alta') {
                    alertasAltas++;
                    severidadMaxima = 'alta';
                } else if (alerta.severidad === 'media' && severidadMaxima !== 'alta') {
                    severidadMaxima = 'media';
                }
            });

            // NUEVA LÓGICA: Solo monitoreo y alertas, NO rechazo automático
            if (alertasAltas >= 2 || alertas.some(a => a.accion === 'rechazar_automatico')) {
                return 'revision_manual_urgente'; // Cambio: no expulsar, revisar
            } else if (severidadMaxima === 'alta' || alertasAltas === 1) {
                return 'revision_manual_alta'; // Cambio: no suspender, revisar
            } else if (severidadMaxima === 'media') {
                return 'revision_manual_media'; // Cambio: solo marcar para revisar
            }

            return 'aprobar'; // Aprobar por defecto
        },

        // Ejecutar acción
        ejecutarAccion(tiendaId, accion, motivo) {
            const timestamp = new Date().toISOString();
            
            // Log de la acción
            console.log(`🛡️ Acción Anti-Fraude: ${accion} para tienda ${tiendaId}`, {
                motivo,
                timestamp,
                sistema: 'CRISLA Anti-Fraudes v1.0'
            });

            switch(accion) {
                case 'advertencia':
                    this.enviarAdvertencia(tiendaId, motivo);
                    break;
                case 'suspension_temporal':
                    this.suspenderTienda(tiendaId, motivo);
                    break;
                case 'expulsion_permanente':
                    this.expulsarTienda(tiendaId, motivo);
                    break;
            }

            // Guardar en historial
            this.guardarEnHistorial(tiendaId, accion, motivo, timestamp);
        },

        // Enviar advertencia
        enviarAdvertencia(tiendaId, motivo) {
            const mensaje = `
🌟 Hola desde Cresalia,

Hemos detectado que algunos aspectos de tu tienda pueden necesitar ajustes para cumplir con nuestras políticas de comunidad.

🔍 Motivo: ${motivo}

💡 ¿Qué podés hacer?
- Revisá el contenido de tu tienda
- Usá fotos reales de tus productos
- Asegurate de que la descripción sea honesta y clara
- Contactá a nuestro soporte CRISLA si tenés dudas

⏰ Tenés 7 días para hacer los ajustes necesarios.

💜 Estamos aquí para ayudarte a crecer de forma ética y exitosa.

Con cariño,
Equipo Cresalia
            `;

            // TODO: Integrar con sistema de notificaciones
            this.enviarNotificacion(tiendaId, 'advertencia', mensaje);
        },

        // Suspender tienda
        suspenderTienda(tiendaId, motivo) {
            // TODO: Implementar suspensión en base de datos
            console.log(`🔒 Tienda ${tiendaId} suspendida por: ${motivo}`);
        },

        // Expulsar tienda
        expulsarTienda(tiendaId, motivo) {
            // TODO: Implementar expulsión permanente
            console.log(`❌ Tienda ${tiendaId} expulsada permanentemente por: ${motivo}`);
        },

        // Guardar historial
        guardarEnHistorial(tiendaId, accion, motivo, timestamp) {
            const registro = {
                tiendaId,
                accion,
                motivo,
                timestamp,
                sistema: 'anti-fraudes-v1.0'
            };

            // TODO: Guardar en base de datos de seguridad
            localStorage.setItem(`historial_seguridad_${tiendaId}`, JSON.stringify(registro));
        }
    },

    // ===== ADMISIÓN INSTANTÁNEA (COMO PIDIÓ LA CO-FUNDADORA) =====
    validarRegistro(datosFormulario) {
        // NUEVA FILOSOFÍA: Todos entran, monitoreamos después basado en lo que suban
        const resultado = {
            valido: true, // SIEMPRE válido - admisión instantánea
            alertas: [], // Sin alertas en registro
            accionRecomendada: 'aprobar', // SIEMPRE aprobar
            mensajes: [] // Solo mensajes de bienvenida
        };

        // NO validar nada en el registro - filosofía de confianza
        console.log('✅ Registro aprobado instantáneamente - monitoreo basado en contenido posterior');

        // Solo mensajes positivos de bienvenida
        resultado.mensajes.push('🎉 ¡Bienvenido/a a la familia Cresalia!');
        resultado.mensajes.push('💜 Estamos emocionados de tenerte con nosotros');
        resultado.mensajes.push('🌟 ¡Empezá a construir tu sueño emprendedor!');

        return resultado;
    },

    // ===== SISTEMA DE REPORTES COMUNIDAD =====
    sistemaReportes: {
        // Crear botón de reporte en cada tienda
        crearBotonReporte(tiendaId) {
            return `
                <div class="reporte-tienda" data-tienda="${tiendaId}">
                    <button class="btn-reportar" onclick="SistemaAntiFraudes.sistemaReportes.abrirModalReporte('${tiendaId}')">
                        <i class="fas fa-flag"></i>
                        <span>Reportar</span>
                    </button>
                </div>
            `;
        },

        // Modal para reportar
        abrirModalReporte(tiendaId) {
            const modal = document.createElement('div');
            modal.className = 'modal-reporte';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🛡️ Reportar Contenido</h3>
                        <button class="btn-cerrar" onclick="this.closest('.modal-reporte').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <p>¿Por qué estás reportando esta tienda?</p>
                        
                        <div class="opciones-reporte">
                            <label><input type="radio" name="motivo" value="producto_ilegal"> Producto ilegal</label>
                            <label><input type="radio" name="motivo" value="estafa"> Posible estafa</label>
                            <label><input type="radio" name="motivo" value="fotos_falsas"> Fotos falsas</label>
                            <label><input type="radio" name="motivo" value="maltrato_animal"> Maltrato animal</label>
                            <label><input type="radio" name="motivo" value="spam"> Spam</label>
                            <label><input type="radio" name="motivo" value="otro"> Otro</label>
                        </div>
                        
                        <textarea placeholder="Detalles adicionales (opcional)" rows="3"></textarea>
                        
                        <div class="botones-modal">
                            <button class="btn-enviar" onclick="SistemaAntiFraudes.sistemaReportes.enviarReporte('${tiendaId}', this)">
                                Enviar Reporte
                            </button>
                            <button class="btn-cancelar" onclick="this.closest('.modal-reporte').remove()">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        },

        // Enviar reporte
        enviarReporte(tiendaId, boton) {
            const modal = boton.closest('.modal-reporte');
            const motivo = modal.querySelector('input[name="motivo"]:checked')?.value;
            const detalles = modal.querySelector('textarea').value;

            if (!motivo) {
                alert('Por favor selecciona un motivo');
                return;
            }

            // Procesar reporte
            const reporte = {
                tiendaId,
                motivo,
                detalles,
                timestamp: new Date().toISOString(),
                reportadoPor: 'usuario_anonimo' // Por privacidad
            };

            // Guardar reporte para revisión
            this.procesarReporte(reporte);
            
            // Confirmar al usuario
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-body text-center">
                        <h3>✅ Reporte Enviado</h3>
                        <p>Gracias por ayudarnos a mantener Cresalia segura.</p>
                        <p>Revisaremos tu reporte en menos de 24 horas.</p>
                        <button class="btn-ok" onclick="this.closest('.modal-reporte').remove()">
                            OK
                        </button>
                    </div>
                </div>
            `;
        },

        // Procesar reporte recibido
        procesarReporte(reporte) {
            console.log('📋 Nuevo reporte recibido:', reporte);
            
            // Guardar en cola de revisión
            const reportesPendientes = JSON.parse(localStorage.getItem('reportes_pendientes') || '[]');
            reportesPendientes.push(reporte);
            localStorage.setItem('reportes_pendientes', JSON.stringify(reportesPendientes));

            // Si es severidad alta, suspender temporalmente
            const severidadAlta = ['producto_ilegal', 'estafa', 'maltrato_animal'];
            if (severidadAlta.includes(reporte.motivo)) {
                console.log('🚨 Reporte de alta severidad - Suspensión temporal automática');
                SistemaAntiFraudes.procesoExpulsion.ejecutarAccion(
                    reporte.tiendaId, 
                    'suspension_temporal', 
                    `Reporte comunidad: ${reporte.motivo}`
                );
            }
        }
    },

    // ===== INICIALIZACIÓN =====
    inicializar() {
        console.log('🛡️ Iniciando Sistema Anti-Fraudes Cresalia v1.0');
        console.log('👥 Co-fundadores: CRISLA & Claude');
        console.log('🎯 Modo: Lanzamiento (filtros suaves)');
        
        // Configurar event listeners
        this.configurarEventListeners();
        
        // Cargar configuración guardada
        this.cargarConfiguracion();
        
        console.log('✅ Sistema Anti-Fraudes inicializado correctamente');
    },

    // Configurar event listeners
    configurarEventListeners() {
        // Validación en tiempo real del formulario de registro
        document.addEventListener('DOMContentLoaded', () => {
            const formRegistro = document.getElementById('form-registro-tienda');
            if (formRegistro) {
                formRegistro.addEventListener('submit', (e) => {
                    this.validarFormularioEnTiempoReal(e);
                });
            }
        });
    },

    // Validar formulario en tiempo real
    validarFormularioEnTiempoReal(event) {
        const formData = new FormData(event.target);
        const datos = Object.fromEntries(formData.entries());
        
        const resultado = this.validarRegistro(datos);
        
        if (!resultado.valido) {
            event.preventDefault();
            this.mostrarMensajesValidacion(resultado.mensajes);
        }
    },

    // Mostrar mensajes de validación
    mostrarMensajesValidacion(mensajes) {
        const contenedor = document.getElementById('mensajes-validacion') || this.crearContenedorMensajes();
        
        contenedor.innerHTML = mensajes.map(msg => `
            <div class="mensaje-validacion">
                <i class="fas fa-info-circle"></i>
                ${msg}
            </div>
        `).join('');
    },

    // Crear contenedor de mensajes
    crearContenedorMensajes() {
        const contenedor = document.createElement('div');
        contenedor.id = 'mensajes-validacion';
        contenedor.className = 'mensajes-validacion-container';
        
        const form = document.getElementById('form-registro-tienda');
        if (form) {
            form.insertBefore(contenedor, form.firstChild);
        }
        
        return contenedor;
    },

    // Cargar configuración guardada
    cargarConfiguracion() {
        const configGuardada = localStorage.getItem('cresalia_antifraudes_config');
        if (configGuardada) {
            this.config = { ...this.config, ...JSON.parse(configGuardada) };
        }
    }
};

// Auto-inicializar cuando se carga el script
if (typeof window !== 'undefined') {
    SistemaAntiFraudes.inicializar();
}

// Exportar para uso global
window.SistemaAntiFraudes = SistemaAntiFraudes;

console.log('🛡️ Sistema Anti-Fraudes Cresalia cargado exitosamente');
