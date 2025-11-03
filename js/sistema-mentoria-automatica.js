// ===== SISTEMA DE MENTORÍA AUTOMÁTICA - CRESALIA =====
// Sistema que conecta automáticamente a vendedores exitosos con quienes necesitan ayuda

class SistemaMentoriaAutomatica {
    constructor() {
        this.mentores = [];
        this.mentorados = [];
        this.conexiones = [];
        this.chats = new Map();
        this.inicializar();
    }
    
    inicializar() {
        console.log('🎯 Sistema de Mentoría Automática inicializado');
        this.cargarDatos();
        this.configurarEventos();
        this.analizarRendimiento();
    }
    
    cargarDatos() {
        // Cargar mentores (vendedores exitosos)
        this.mentores = JSON.parse(localStorage.getItem('mentores_cresalia') || '[]');
        
        // Cargar mentorados (vendedores que necesitan ayuda)
        this.mentorados = JSON.parse(localStorage.getItem('mentorados_cresalia') || '[]');
        
        // Cargar conexiones existentes
        this.conexiones = JSON.parse(localStorage.getItem('conexiones_mentoria') || '[]');
    }
    
    configurarEventos() {
        // Eventos de análisis de rendimiento
        window.addEventListener('venta:registrada', (e) => this.analizarVenta(e.detail));
        window.addEventListener('mentoria:solicitar', (e) => this.solicitarMentoria(e.detail));
        window.addEventListener('mentoria:aceptar', (e) => this.aceptarMentoria(e.detail));
    }
    
    analizarRendimiento() {
        // Analizar rendimiento de todos los vendedores
        const vendedores = JSON.parse(localStorage.getItem('vendedores_cresalia') || '[]');
        
        vendedores.forEach(vendedor => {
            const rendimiento = this.calcularRendimiento(vendedor);
            
            if (rendimiento.promedioVentas > 1000 && rendimiento.tendencia > 0.2) {
                // Vendedor exitoso - candidato a mentor
                this.registrarMentor(vendedor, rendimiento);
            } else if (rendimiento.promedioVentas < 300 && rendimiento.tendencia < -0.1) {
                // Vendedor que necesita ayuda - candidato a mentorado
                this.registrarMentorado(vendedor, rendimiento);
            }
        });
        
        // Crear conexiones automáticas
        this.crearConexionesAutomaticas();
    }
    
    calcularRendimiento(vendedor) {
        const ventas = vendedor.ventas || [];
        const ultimos3Meses = ventas.filter(v => {
            const fechaVenta = new Date(v.fecha);
            const hace3Meses = new Date();
            hace3Meses.setMonth(hace3Meses.getMonth() - 3);
            return fechaVenta >= hace3Meses;
        });
        
        const promedioVentas = ultimos3Meses.reduce((sum, v) => sum + v.monto, 0) / ultimos3Meses.length || 0;
        
        // Calcular tendencia (comparar últimos 2 meses con los 2 anteriores)
        const ultimos2Meses = ultimos3Meses.filter(v => {
            const fechaVenta = new Date(v.fecha);
            const hace2Meses = new Date();
            hace2Meses.setMonth(hace2Meses.getMonth() - 2);
            return fechaVenta >= hace2Meses;
        });
        
        const anteriores2Meses = ultimos3Meses.filter(v => {
            const fechaVenta = new Date(v.fecha);
            const hace2Meses = new Date();
            hace2Meses.setMonth(hace2Meses.getMonth() - 2);
            const hace3Meses = new Date();
            hace3Meses.setMonth(hace3Meses.getMonth() - 3);
            return fechaVenta >= hace3Meses && fechaVenta < hace2Meses;
        });
        
        const promedioUltimos2 = ultimos2Meses.reduce((sum, v) => sum + v.monto, 0) / ultimos2Meses.length || 0;
        const promedioAnteriores2 = anteriores2Meses.reduce((sum, v) => sum + v.monto, 0) / anteriores2Meses.length || 0;
        
        const tendencia = promedioAnteriores2 > 0 ? (promedioUltimos2 - promedioAnteriores2) / promedioAnteriores2 : 0;
        
        return {
            promedioVentas,
            tendencia,
            totalVentas: ultimos3Meses.length,
            categoria: vendedor.categoria || 'general'
        };
    }
    
    registrarMentor(vendedor, rendimiento) {
        const mentor = {
            id: vendedor.id,
            nombre: vendedor.nombre,
            email: vendedor.email,
            categoria: vendedor.categoria,
            rendimiento: rendimiento,
            tarifaHora: vendedor.tarifaMentoria || 0,
            disponibilidad: vendedor.disponibilidadMentoria || 'flexible',
            especialidades: vendedor.especialidades || [],
            rating: vendedor.ratingMentor || 0,
            fechaRegistro: new Date().toISOString()
        };
        
        // Verificar si ya existe
        const existe = this.mentores.find(m => m.id === vendedor.id);
        if (!existe) {
            this.mentores.push(mentor);
            this.guardarDatos();
            console.log(`🎯 Mentor registrado: ${mentor.nombre}`);
        }
    }
    
    registrarMentorado(vendedor, rendimiento) {
        const mentorado = {
            id: vendedor.id,
            nombre: vendedor.nombre,
            email: vendedor.email,
            categoria: vendedor.categoria,
            rendimiento: rendimiento,
            presupuestoMaximo: vendedor.presupuestoMentoria || 0,
            objetivos: vendedor.objetivosMentoria || [],
            disponibilidad: vendedor.disponibilidadMentoria || 'flexible',
            fechaRegistro: new Date().toISOString()
        };
        
        // Verificar si ya existe
        const existe = this.mentorados.find(m => m.id === vendedor.id);
        if (!existe) {
            this.mentorados.push(mentorado);
            this.guardarDatos();
            console.log(`🎯 Mentorado registrado: ${mentorado.nombre}`);
        }
    }
    
    crearConexionesAutomaticas() {
        this.mentorados.forEach(mentorado => {
            // Buscar mentores compatibles
            const mentoresCompatibles = this.mentores.filter(mentor => {
                return mentor.categoria === mentorado.categoria &&
                       mentor.tarifaHora <= mentorado.presupuestoMaximo &&
                       mentor.disponibilidad === mentorado.disponibilidad &&
                       !this.conexionExiste(mentor.id, mentorado.id) &&
                       !this.solicitudPendiente(mentor.id, mentorado.id);
            });
            
            if (mentoresCompatibles.length > 0) {
                // Seleccionar el mejor mentor (mayor rating)
                const mejorMentor = mentoresCompatibles.reduce((mejor, actual) => 
                    actual.rating > mejor.rating ? actual : mejor
                );
                
                // Crear solicitud silenciosa (no notificar aún)
                this.crearSolicitudSilenciosa(mejorMentor, mentorado);
            }
        });
    }
    
    crearSolicitudSilenciosa(mentor, mentorado) {
        const solicitud = {
            id: `solicitud_${Date.now()}`,
            mentorId: mentor.id,
            mentoradoId: mentorado.id,
            mentorNombre: mentor.nombre,
            mentoradoNombre: mentorado.nombre,
            categoria: mentor.categoria,
            tarifaHora: mentor.tarifaHora,
            estado: 'silenciosa',
            fechaCreacion: new Date().toISOString(),
            mentorAcepto: false,
            mentoradoAcepto: false,
            chatId: `chat_${mentor.id}_${mentorado.id}`
        };
        
        this.conexiones.push(solicitud);
        this.guardarDatos();
        
        // NO notificar aún - solo mostrar en panel de administración
        console.log(`🎯 Solicitud silenciosa creada: ${mentor.nombre} -> ${mentorado.nombre}`);
        
        // Mostrar pregunta discreta en la UI
        this.mostrarPreguntaDiscreta(solicitud);
    }
    
    crearConexion(mentor, mentorado) {
        const conexion = {
            id: `conexion_${Date.now()}`,
            mentorId: mentor.id,
            mentoradoId: mentorado.id,
            mentorNombre: mentor.nombre,
            mentoradoNombre: mentorado.nombre,
            categoria: mentor.categoria,
            tarifaHora: mentor.tarifaHora,
            estado: 'activa',
            fechaCreacion: new Date().toISOString(),
            chatId: `chat_${mentor.id}_${mentorado.id}`
        };
        
        this.conexiones.push(conexion);
        this.guardarDatos();
        
        // Notificar a ambos solo cuando ambos acepten
        this.notificarConexionAceptada(conexion);
        
        console.log(`🎯 Conexión activa creada: ${mentor.nombre} -> ${mentorado.nombre}`);
    }
    
    mostrarPreguntaDiscreta(solicitud) {
        // Mostrar pregunta discreta al mentor
        this.mostrarPreguntaMentor(solicitud);
        
        // Mostrar pregunta discreta al mentorado
        this.mostrarPreguntaMentorado(solicitud);
    }
    
    mostrarPreguntaMentor(solicitud) {
        const modal = document.createElement('div');
        modal.id = `pregunta_mentor_${solicitud.id}`;
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 16px; max-width: 500px; width: 90%; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 20px;">🎯</div>
                <h3 style="margin: 0 0 15px; color: #1e293b;">¿Te gustaría ayudar a otros emprendedores?</h3>
                <p style="color: #6B7280; margin: 0 0 20px;">
                    Hemos detectado que podrías ser un excelente mentor en <strong>${solicitud.categoria}</strong>.
                    <br><br>
                    <strong>¿Te interesaría compartir tu experiencia?</strong>
                </p>
                
                <div style="background: #F0FDF4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #065F46; font-size: 0.9rem;">
                        <strong>💡 Beneficios:</strong><br>
                        • Ayudar a otros emprendedores<br>
                        • Generar ingresos adicionales<br>
                        • Expandir tu red de contactos
                    </p>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="sistemaMentoria.responderPreguntaMentor('${solicitud.id}', false)" style="padding: 12px 25px; background: #6B7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        No, gracias
                    </button>
                    <button onclick="sistemaMentoria.responderPreguntaMentor('${solicitud.id}', true)" style="padding: 12px 25px; background: #10B981; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Sí, me interesa
                    </button>
                </div>
                
                <p style="color: #9CA3AF; font-size: 0.8rem; margin: 15px 0 0;">
                    Tu respuesta es completamente privada
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    mostrarPreguntaMentorado(solicitud) {
        const modal = document.createElement('div');
        modal.id = `pregunta_mentorado_${solicitud.id}`;
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 16px; max-width: 500px; width: 90%; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 20px;">🎓</div>
                <h3 style="margin: 0 0 15px; color: #1e293b;">¿Te gustaría recibir mentoría?</h3>
                <p style="color: #6B7280; margin: 0 0 20px;">
                    Hemos detectado que podrías beneficiarte de la experiencia de otros emprendedores en <strong>${solicitud.categoria}</strong>.
                    <br><br>
                    <strong>¿Te interesaría recibir ayuda y consejos?</strong>
                </p>
                
                <div style="background: #FFFBEB; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #92400E; font-size: 0.9rem;">
                        <strong>💡 Beneficios:</strong><br>
                        • Aprender de emprendedores exitosos<br>
                        • Mejorar tus ventas y estrategias<br>
                        • Crecer más rápido en tu negocio
                    </p>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="sistemaMentoria.responderPreguntaMentorado('${solicitud.id}', false)" style="padding: 12px 25px; background: #6B7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        No, gracias
                    </button>
                    <button onclick="sistemaMentoria.responderPreguntaMentorado('${solicitud.id}', true)" style="padding: 12px 25px; background: #F59E0B; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Sí, me interesa
                    </button>
                </div>
                
                <p style="color: #9CA3AF; font-size: 0.8rem; margin: 15px 0 0;">
                    Tu respuesta es completamente privada
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    responderPreguntaMentor(solicitudId, acepta) {
        const solicitud = this.conexiones.find(c => c.id === solicitudId);
        if (solicitud) {
            solicitud.mentorAcepto = acepta;
            this.guardarDatos();
            
            // Cerrar modal
            const modal = document.getElementById(`pregunta_mentor_${solicitudId}`);
            if (modal) modal.remove();
            
            // Verificar si ambos aceptaron
            this.verificarAceptacionCompleta(solicitud);
        }
    }
    
    responderPreguntaMentorado(solicitudId, acepta) {
        const solicitud = this.conexiones.find(c => c.id === solicitudId);
        if (solicitud) {
            solicitud.mentoradoAcepto = acepta;
            this.guardarDatos();
            
            // Cerrar modal
            const modal = document.getElementById(`pregunta_mentorado_${solicitudId}`);
            if (modal) modal.remove();
            
            // Verificar si ambos aceptaron
            this.verificarAceptacionCompleta(solicitud);
        }
    }
    
    verificarAceptacionCompleta(solicitud) {
        if (solicitud.mentorAcepto && solicitud.mentoradoAcepto) {
            // Ambos aceptaron - crear conexión activa
            solicitud.estado = 'activa';
            this.guardarDatos();
            
            // Crear chat
            this.crearChat(solicitud);
            
            // Notificar a ambos
            this.notificarConexionAceptada(solicitud);
            
            console.log(`🎯 Conexión aceptada por ambos: ${solicitud.mentorNombre} -> ${solicitud.mentoradoNombre}`);
        } else if (solicitud.mentorAcepto === false || solicitud.mentoradoAcepto === false) {
            // Al menos uno rechazó - cancelar solicitud
            solicitud.estado = 'rechazada';
            this.guardarDatos();
            
            console.log(`🎯 Solicitud rechazada: ${solicitud.mentorNombre} -> ${solicitud.mentoradoNombre}`);
        }
    }
    
    notificarConexionAceptada(conexion) {
        // Notificar al mentor
        this.enviarNotificacion(conexion.mentorId, {
            tipo: 'mentoria_aceptada',
            titulo: '¡Conexión de Mentoría Establecida!',
            mensaje: `Ahora puedes ayudar a ${conexion.mentoradoNombre} en ${conexion.categoria}`,
            conexionId: conexion.id
        });
        
        // Notificar al mentorado
        this.enviarNotificacion(conexion.mentoradoId, {
            tipo: 'mentoria_aceptada',
            titulo: '¡Mentoría Disponible!',
            mensaje: `${conexion.mentorNombre} está listo para ayudarte`,
            conexionId: conexion.id
        });
    }
    
    notificarConexion(conexion) {
        // Función obsoleta - no se usa en el sistema silencioso
        console.log('Función obsoleta - usar notificarConexionAceptada');
    }
    
    enviarNotificacion(usuarioId, notificacion) {
        // Implementar notificación (email, push, etc.)
        console.log(`📧 Notificación enviada a ${usuarioId}:`, notificacion);
        
        // Guardar en localStorage para mostrar en la UI
        const notificaciones = JSON.parse(localStorage.getItem(`notificaciones_${usuarioId}`) || '[]');
        notificaciones.push({
            ...notificacion,
            fecha: new Date().toISOString(),
            leida: false
        });
        localStorage.setItem(`notificaciones_${usuarioId}`, JSON.stringify(notificaciones));
    }
    
    aceptarMentoria(conexionId) {
        const conexion = this.conexiones.find(c => c.id === conexionId);
        if (conexion) {
            conexion.estado = 'activa';
            conexion.fechaAceptacion = new Date().toISOString();
            this.guardarDatos();
            
            // Crear chat entre mentor y mentorado
            this.crearChat(conexion);
            
            console.log(`🎯 Mentoría aceptada: ${conexion.mentorNombre} -> ${conexion.mentoradoNombre}`);
        }
    }
    
    crearChat(conexion) {
        const chat = {
            id: conexion.chatId,
            mentorId: conexion.mentorId,
            mentoradoId: conexion.mentoradoId,
            mensajes: [],
            fechaCreacion: new Date().toISOString(),
            activo: true
        };
        
        this.chats.set(conexion.chatId, chat);
        
        // Agregar mensaje de bienvenida
        this.enviarMensaje(conexion.chatId, 'sistema', '¡Conexión establecida! Pueden comenzar a comunicarse.');
    }
    
    enviarMensaje(chatId, remitenteId, mensaje) {
        const chat = this.chats.get(chatId);
        if (chat) {
            const mensajeObj = {
                id: `msg_${Date.now()}`,
                remitenteId,
                mensaje,
                fecha: new Date().toISOString(),
                leido: false
            };
            
            chat.mensajes.push(mensajeObj);
            this.guardarDatos();
            
            // Notificar al destinatario
            const destinatarioId = remitenteId === chat.mentorId ? chat.mentoradoId : chat.mentorId;
            this.enviarNotificacion(destinatarioId, {
                tipo: 'mensaje_mentoria',
                titulo: 'Nuevo Mensaje de Mentoría',
                mensaje: mensaje.substring(0, 50) + '...',
                chatId
            });
        }
    }
    
    obtenerChat(chatId) {
        return this.chats.get(chatId);
    }
    
    obtenerConexiones(usuarioId) {
        return this.conexiones.filter(c => c.mentorId === usuarioId || c.mentoradoId === usuarioId);
    }
    
    conexionExiste(mentorId, mentoradoId) {
        return this.conexiones.some(c => 
            (c.mentorId === mentorId && c.mentoradoId === mentoradoId) ||
            (c.mentorId === mentoradoId && c.mentoradoId === mentorId)
        );
    }
    
    solicitudPendiente(mentorId, mentoradoId) {
        return this.conexiones.some(c => 
            ((c.mentorId === mentorId && c.mentoradoId === mentoradoId) ||
             (c.mentorId === mentoradoId && c.mentoradoId === mentorId)) &&
            (c.estado === 'silenciosa' || c.estado === 'pendiente')
        );
    }
    
    guardarDatos() {
        localStorage.setItem('mentores_cresalia', JSON.stringify(this.mentores));
        localStorage.setItem('mentorados_cresalia', JSON.stringify(this.mentorados));
        localStorage.setItem('conexiones_mentoria', JSON.stringify(this.conexiones));
    }
    
    // Métodos para la UI
    mostrarPanelMentoria() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 16px; max-width: 900px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <h3 style="margin: 0; color: #1e293b;">🎯 Sistema de Mentoría Automática</h3>
                    <button onclick="cerrarModalSeguro(this)" style="background: #6B7280; color: white; border: none; padding: 8px 12px; border-radius: 50%; cursor: pointer; font-size: 18px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                        ×
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <!-- Mentores -->
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h4 style="color: #10B981; margin: 0;">👨‍🏫 Mentores Disponibles</h4>
                            <button onclick="sistemaMentoria.registrarComoMentor()" style="background: #10B981; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">
                                <i class="fas fa-plus"></i> Ofrecer Mentoría
                            </button>
                        </div>
                        <div id="listaMentores" style="max-height: 300px; overflow-y: auto;">
                            ${this.mentores.length > 0 ? this.mentores.map(mentor => `
                                <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 15px; margin-bottom: 10px; cursor: pointer;" onclick="sistemaMentoria.verDetalleMentor(${mentor.id})">
                                    <div style="font-weight: 600; color: #065F46;">${mentor.nombre}</div>
                                    <div style="font-size: 0.9rem; color: #6B7280;">${mentor.categoria}</div>
                                    <div style="font-size: 0.8rem; color: #059669;">$${mentor.tarifaHora}/hora</div>
                                    <div style="margin-top: 8px;">
                                        <button onclick="event.stopPropagation(); sistemaMentoria.contactarMentor(${mentor.id})" style="background: #10B981; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                                            <i class="fas fa-envelope"></i> Contactar
                                        </button>
                                    </div>
                                </div>
                            `).join('') : '<p style="color: #6B7280; text-align: center; padding: 20px;">No hay mentores registrados aún. ¡Sé el primero!</p>'}
                        </div>
                    </div>
                    
                    <!-- Mentorados -->
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h4 style="color: #F59E0B; margin: 0;">🎓 Buscando Mentoría</h4>
                            <button onclick="sistemaMentoria.registrarComoMentorado()" style="background: #F59E0B; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">
                                <i class="fas fa-search"></i> Buscar Mentoría
                            </button>
                        </div>
                        <div id="listaMentorados" style="max-height: 300px; overflow-y: auto;">
                            ${this.mentorados.length > 0 ? this.mentorados.map(mentorado => `
                                <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius:  8px; padding: 15px; margin-bottom: 10px; cursor: pointer;" onclick="sistemaMentoria.verDetalleMentorado(${mentorado.id})">
                                    <div style="font-weight: 600; color: #92400E;">${mentorado.nombre}</div>
                                    <div style="font-size: 0.9rem; color: #6B7280;">${mentorado.categoria}</div>
                                    <div style="font-size: 0.8rem; color: #D97706;">Presupuesto: $${mentorado.presupuestoMaximo}</div>
                                    <div style="margin-top: 8px;">
                                        <button onclick="event.stopPropagation(); sistemaMentoria.contactarMentorado(${mentorado.id})" style="background: #F59E0B; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
                                            <i class="fas fa-handshake"></i> Ofrecer Ayuda
                                        </button>
                                    </div>
                                </div>
                            `).join('') : '<p style="color: #6B7280; text-align: center; padding: 20px;">No hay personas buscando mentoría aún.</p>'}
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; padding: 20px; background: #EFF6FF; border-radius: 8px;">
                    <h4 style="color: #1E40AF; margin-bottom: 10px;">📊 Estadísticas del Sistema</h4>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; color: #10B981;">${this.mentores.length}</div>
                            <div style="color: #6B7280;">Mentores</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; color: #F59E0B;">${this.mentorados.length}</div>
                            <div style="color: #6B7280;">Mentorados</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; color: #8B5CF6;">${this.conexiones.filter(c => c.estado === 'activa').length}</div>
                            <div style="color: #6B7280;">Conexiones Activas</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; color: #EC4899;">${this.conexiones.filter(c => c.estado === 'silenciosa').length}</div>
                            <div style="color: #6B7280;">Solicitudes Silenciosas</div>
                        </div>
                    </div>
                </div>
                
                <!-- Solicitudes Silenciosas -->
                ${this.conexiones.filter(c => c.estado === 'silenciosa').length > 0 ? `
                    <div style="margin-top: 20px; padding: 20px; background: #FDF2F8; border-radius: 8px;">
                        <h4 style="color: #EC4899; margin-bottom: 15px;">🔍 Solicitudes Silenciosas Pendientes</h4>
                        <div style="max-height: 200px; overflow-y: auto;">
                            ${this.conexiones.filter(c => c.estado === 'silenciosa').map(solicitud => `
                                <div style="background: white; border: 1px solid #FBCFE8; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong style="color: #BE185D;">${solicitud.mentorNombre}</strong> → 
                                            <strong style="color: #BE185D;">${solicitud.mentoradoNombre}</strong>
                                            <div style="font-size: 0.9rem; color: #6B7280;">${solicitud.categoria} - $${solicitud.tarifaHora}/hora</div>
                                        </div>
                                        <div style="display: flex; gap: 10px;">
                                            <span style="background: ${solicitud.mentorAcepto === true ? '#D1FAE5' : solicitud.mentorAcepto === false ? '#FEE2E2' : '#FEF3C7'}; color: ${solicitud.mentorAcepto === true ? '#065F46' : solicitud.mentorAcepto === false ? '#991B1B' : '#92400E'}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                                                Mentor: ${solicitud.mentorAcepto === true ? '✅' : solicitud.mentorAcepto === false ? '❌' : '⏳'}
                                            </span>
                                            <span style="background: ${solicitud.mentoradoAcepto === true ? '#D1FAE5' : solicitud.mentoradoAcepto === false ? '#FEE2E2' : '#FEF3C7'}; color: ${solicitud.mentoradoAcepto === true ? '#065F46' : solicitud.mentoradoAcepto === false ? '#991B1B' : '#92400E'}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
                                                Mentorado: ${solicitud.mentoradoAcepto === true ? '✅' : solicitud.mentoradoAcepto === false ? '❌' : '⏳'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar al hacer click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Inicializar sistema
const sistemaMentoria = new SistemaMentoriaAutomatica();

// Función global para mostrar panel
function mostrarPanelMentoria() {
    sistemaMentoria.mostrarPanelMentoria();
}

// Métodos públicos para los botones
SistemaMentoriaAutomatica.prototype.registrarComoMentor = function() {
    const nombre = prompt('¿Cuál es tu nombre?');
    const categoria = prompt('¿En qué categoría puedes ayudar? (ej: Marketing, Ventas, Productos, etc.)');
    const tarifa = parseFloat(prompt('¿Cuál es tu tarifa por hora? (pon 0 si es gratis)')) || 0;
    
    if (nombre && categoria) {
        const nuevoMentor = {
            id: Date.now(),
            nombre: nombre,
            categoria: categoria,
            tarifaHora: tarifa,
            disponibilidad: 'flexible',
            rating: 0,
            fechaRegistro: new Date().toISOString()
        };
        this.mentores.push(nuevoMentor);
        this.guardarDatos();
        alert('✅ ¡Te has registrado como mentor!');
        this.mostrarPanelMentoria();
    }
};

SistemaMentoriaAutomatica.prototype.registrarComoMentorado = function() {
    const nombre = prompt('¿Cuál es tu nombre?');
    const categoria = prompt('¿En qué categoría necesitas ayuda? (ej: Marketing, Ventas, Productos, etc.)');
    const presupuesto = parseFloat(prompt('¿Cuál es tu presupuesto máximo por hora? (pon 0 si buscas gratis)')) || 0;
    
    if (nombre && categoria) {
        const nuevoMentorado = {
            id: Date.now(),
            nombre: nombre,
            categoria: categoria,
            presupuestoMaximo: presupuesto,
            disponibilidad: 'flexible',
            fechaRegistro: new Date().toISOString()
        };
        this.mentorados.push(nuevoMentorado);
        this.guardarDatos();
        alert('✅ ¡Te has registrado buscando mentoría!');
        this.mostrarPanelMentoria();
    }
};

SistemaMentoriaAutomatica.prototype.contactarMentor = function(id) {
    const mentor = this.mentores.find(m => m.id === id);
    if (mentor) {
        alert(`📧 Contactando a ${mentor.nombre}\n\nCategoría: ${mentor.categoria}\nTarifa: $${mentor.tarifaHora}/hora\n\nEnvíanos un mensaje desde tu panel para conectar.`);
    }
};

SistemaMentoriaAutomatica.prototype.contactarMentorado = function(id) {
    const mentorado = this.mentorados.find(m => m.id === id);
    if (mentorado) {
        alert(`🤝 Contactando a ${mentorado.nombre}\n\nCategoría: ${mentorado.categoria}\nPresupuesto: $${mentorado.presupuestoMaximo}/hora\n\nEnvíanos un mensaje desde tu panel para ofrecer tu ayuda.`);
    }
};

SistemaMentoriaAutomatica.prototype.verDetalleMentor = function(id) {
    const mentor = this.mentores.find(m => m.id === id);
    if (mentor) {
        alert(`👨‍🏫 ${mentor.nombre}\n\nCategoría: ${mentor.categoria}\nTarifa: $${mentor.tarifaHora}/hora\nDisponibilidad: ${mentor.disponibilidad}\nRating: ${mentor.rating}/5 ⭐`);
    }
};

SistemaMentoriaAutomatica.prototype.verDetalleMentorado = function(id) {
    const mentorado = this.mentorados.find(m => m.id === id);
    if (mentorado) {
        alert(`🎓 ${mentorado.nombre}\n\nCategoría: ${mentorado.categoria}\nPresupuesto: $${mentorado.presupuestoMaximo}/hora\nDisponibilidad: ${mentorado.disponibilidad}`);
    }
};
