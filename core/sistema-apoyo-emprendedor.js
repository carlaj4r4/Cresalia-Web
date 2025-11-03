// ===== SISTEMA DE APOYO PARA EMPRENDEDORES - CRESALIA =====
// "Porque sabemos que emprender es difícil, pero no estás solo"
// Solo para planes Free y Basic

class SistemaApoyoEmprendedor {
    constructor(tenantConfig) {
        this.tenant = tenantConfig.tenant;
        this.plan = tenantConfig.plan;
        this.metrics = tenantConfig.metrics || {};
        this.isAnonymous = localStorage.getItem(`apoyo_anonimo_${this.tenant.slug}`) === 'true';
        this.checkInHistory = this.loadHistory();
    }

    // Verificar si el usuario califica para apoyo
    calificaParaApoyo() {
        // Solo Free y Basic
        return ['free', 'basic'].includes(this.plan.toLowerCase());
    }

    // Inicializar sistema
    init() {
        if (!this.calificaParaApoyo()) {
            console.log('💼 Sistema de apoyo no disponible para este plan');
            return;
        }

        console.log('💜 Sistema de Apoyo para Emprendedores activado');
        this.crearWidgetApoyo();
        this.verificarCheckIn();
        this.analizarSituacion();
    }

    // Crear widget de apoyo
    crearWidgetApoyo() {
        const widget = document.createElement('div');
        widget.id = 'apoyo-emprendedor-widget';
        widget.innerHTML = `
            <!-- Botón flotante especial (diferente al de soporte) -->
            <button id="apoyo-toggle" class="apoyo-toggle" title="Espacio de Apoyo">
                <i class="fas fa-heart"></i>
                <span class="apoyo-pulse"></span>
            </button>

            <!-- Panel de apoyo -->
            <div id="apoyo-panel" class="apoyo-panel" style="display: none;">
                <!-- Header cálido -->
                <div class="apoyo-header">
                    <div class="apoyo-header-content">
                        <div class="apoyo-icon">
                            💜
                        </div>
                        <div class="apoyo-info">
                            <h3>Tu Espacio de Apoyo</h3>
                            <p>Porque emprender es un viaje, y no estás solo</p>
                        </div>
                    </div>
                    <div class="apoyo-actions">
                        <button class="btn-icon-light" onclick="apoyoEmprendedor.close()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Contenido principal -->
                <div class="apoyo-content" id="apoyo-content">
                    ${this.renderContenidoPrincipal()}
                </div>
            </div>

            ${this.getStyles()}
        `;

        document.body.appendChild(widget);
        this.setupEventListeners();
    }

    // Contenido principal
    renderContenidoPrincipal() {
        // Si es primera vez, mostrar bienvenida
        if (this.checkInHistory.length === 0) {
            return this.renderBienvenida();
        }

        // Si ya tiene historial, mostrar check-in
        return this.renderCheckIn();
    }

    // Bienvenida
    renderBienvenida() {
        return `
            <div class="apoyo-bienvenida">
                <div class="apoyo-emoji">🌱</div>
                <h2>¡Hola, emprendedor!</h2>
                <p class="apoyo-texto-principal">
                    Sabemos que empezar un negocio puede ser abrumador. 
                    Hay días buenos y días difíciles. Momentos de ilusión 
                    y momentos de duda.
                </p>
                <p class="apoyo-texto-secundario">
                    Este es tu espacio seguro. Aquí puedes compartir cómo 
                    te sientes, recibir apoyo y acceder a recursos que te 
                    ayudarán en tu camino.
                </p>

                <!-- Opción de anonimato -->
                <div class="apoyo-anonimato">
                    <label class="apoyo-checkbox">
                        <input type="checkbox" id="usar-anonimo" ${this.isAnonymous ? 'checked' : ''}>
                        <span>Prefiero mantener mi identidad anónima</span>
                    </label>
                    <p class="apoyo-nota">
                        <i class="fas fa-shield-alt"></i>
                        Tus respuestas son privadas y solo se usan para ayudarte mejor
                    </p>
                </div>

                <button class="btn-apoyo-primary" onclick="apoyoEmprendedor.empezar()">
                    <i class="fas fa-hand-holding-heart"></i>
                    Comenzar
                </button>
            </div>
        `;
    }

    // Check-in regular
    renderCheckIn() {
        const ultimoCheckIn = this.checkInHistory[this.checkInHistory.length - 1];
        const diasDesdeUltimo = ultimoCheckIn ? 
            Math.floor((Date.now() - new Date(ultimoCheckIn.fecha)) / (1000 * 60 * 60 * 24)) : 
            999;

        return `
            <div class="apoyo-checkin">
                <div class="apoyo-greeting">
                    <div class="apoyo-emoji">👋</div>
                    <h3>${this.isAnonymous ? '¡Hola, emprendedor!' : `¡Hola, ${this.tenant.nombre}!`}</h3>
                    ${diasDesdeUltimo < 7 ? 
                        '<p class="apoyo-welcome-back">Nos alegra verte de nuevo</p>' : 
                        '<p class="apoyo-welcome-back">Ha pasado un tiempo, ¿cómo has estado?</p>'}
                </div>

                <!-- Pregunta principal -->
                <div class="apoyo-pregunta">
                    <h4>¿Cómo te sientes hoy con tu negocio?</h4>
                    <div class="apoyo-emociones">
                        <button class="emocion-btn" onclick="apoyoEmprendedor.seleccionarEmocion('excelente', '🚀')">
                            <span class="emocion-emoji">🚀</span>
                            <span class="emocion-texto">¡Excelente!</span>
                        </button>
                        <button class="emocion-btn" onclick="apoyoEmprendedor.seleccionarEmocion('bien', '😊')">
                            <span class="emocion-emoji">😊</span>
                            <span class="emocion-texto">Bien</span>
                        </button>
                        <button class="emocion-btn" onclick="apoyoEmprendedor.seleccionarEmocion('regular', '😐')">
                            <span class="emocion-emoji">😐</span>
                            <span class="emocion-texto">Regular</span>
                        </button>
                        <button class="emocion-btn" onclick="apoyoEmprendedor.seleccionarEmocion('dificil', '😔')">
                            <span class="emocion-emoji">😔</span>
                            <span class="emocion-texto">Difícil</span>
                        </button>
                        <button class="emocion-btn" onclick="apoyoEmprendedor.seleccionarEmocion('abrumado', '😰')">
                            <span class="emocion-emoji">😰</span>
                            <span class="emocion-texto">Abrumado</span>
                        </button>
                    </div>
                </div>

                <!-- Métricas del negocio -->
                ${this.renderMetricas()}

                <!-- Acceso a recursos -->
                <div class="apoyo-recursos-rapidos">
                    <h4>Recursos para ti:</h4>
                    <div class="recursos-grid">
                        <button class="recurso-card" onclick="apoyoEmprendedor.verRecurso('motivacion')">
                            <i class="fas fa-fire"></i>
                            <span>Motivación</span>
                        </button>
                        <button class="recurso-card" onclick="apoyoEmprendedor.verRecurso('comunidad')">
                            <i class="fas fa-users"></i>
                            <span>Comunidad</span>
                        </button>
                        <button class="recurso-card" onclick="apoyoEmprendedor.verRecurso('consejos')">
                            <i class="fas fa-lightbulb"></i>
                            <span>Consejos</span>
                        </button>
                        <button class="recurso-card" onclick="apoyoEmprendedor.verRecurso('historias')">
                            <i class="fas fa-book-open"></i>
                            <span>Historias</span>
                        </button>
                    </div>
                </div>

                <!-- Botón para enviar mensaje -->
                <div class="enviar-mensaje-section">
                    <button class="btn-enviar-mensaje" onclick="apoyoEmprendedor.abrirFormularioMensaje()">
                        <i class="fas fa-comment-dots"></i>
                        ¿Necesitas compartir algo más? Escríbenos
                    </button>
                </div>
            </div>
        `;
    }

    // Renderizar métricas con análisis empático
    renderMetricas() {
        const ventas = this.metrics.ventas_mes || 0;
        const productos = this.metrics.total_productos || 0;
        const visitas = this.metrics.visitas_mes || 0;

        let mensaje = '';
        let icono = '';
        let consejos = [];

        // Análisis empático según métricas
        if (ventas === 0 && productos < 5) {
            icono = '🌱';
            mensaje = 'Estás en el inicio de tu camino';
            consejos = [
                'Es normal no tener ventas al principio',
                'Agrega al menos 10 productos para empezar',
                'Comparte tu tienda en redes sociales',
                'Sé paciente, todo negocio toma tiempo'
            ];
        } else if (ventas === 0 && productos >= 5) {
            icono = '🌿';
            mensaje = 'Tienes productos, ahora falta visibilidad';
            consejos = [
                '¡Tus productos se ven bien!',
                'Comparte tu tienda con amigos y familia',
                'Publica en redes sociales 3 veces por semana',
                'Considera ofrecer un descuento de lanzamiento',
                'La primera venta es la más difícil, ¡sigue adelante!'
            ];
        } else if (ventas > 0 && ventas < 5) {
            icono = '🌻';
            mensaje = '¡Tuviste tus primeras ventas! 🎉';
            consejos = [
                '¡Felicitaciones! Ya eres oficialmente un emprendedor',
                'Pide feedback a tus clientes',
                'Ofrece excelente servicio para que recomienden',
                'Cada venta es un paso adelante'
            ];
        } else if (ventas >= 5 && ventas < 20) {
            icono = '🌳';
            mensaje = '¡Tu negocio está creciendo!';
            consejos = [
                'Estás en buen camino',
                'Analiza qué productos se venden más',
                'Considera expandir esas categorías',
                'Implementa un sistema de reviews'
            ];
        } else {
            icono = '🚀';
            mensaje = '¡Tu negocio despega!';
            consejos = [
                '¡Increíble progreso!',
                'Considera actualizar a plan Pro para chatbot IA',
                'Automatiza procesos para escalar',
                'Piensa en contratar ayuda'
            ];
        }

        return `
            <div class="apoyo-situacion">
                <div class="situacion-header">
                    <span class="situacion-icono">${icono}</span>
                    <h4>${mensaje}</h4>
                </div>

                <div class="metricas-resumen">
                    <div class="metrica-item">
                        <span class="metrica-numero">${ventas}</span>
                        <span class="metrica-label">Ventas este mes</span>
                    </div>
                    <div class="metrica-item">
                        <span class="metrica-numero">${productos}</span>
                        <span class="metrica-label">Productos</span>
                    </div>
                    <div class="metrica-item">
                        <span class="metrica-numero">${visitas}</span>
                        <span class="metrica-label">Visitas</span>
                    </div>
                </div>

                ${consejos.length > 0 ? `
                <div class="consejos-personalizados">
                    <h5><i class="fas fa-compass"></i> Próximos pasos sugeridos:</h5>
                    <ul class="consejos-lista">
                        ${consejos.map(consejo => `
                            <li><i class="fas fa-check-circle"></i> ${consejo}</li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `;
    }

    // Empezar (primera vez)
    empezar() {
        const usarAnonimo = document.getElementById('usar-anonimo').checked;
        localStorage.setItem(`apoyo_anonimo_${this.tenant.slug}`, usarAnonimo);
        this.isAnonymous = usarAnonimo;

        // Guardar que ya empezó
        this.checkInHistory.push({
            fecha: new Date().toISOString(),
            tipo: 'inicio'
        });
        this.saveHistory();

        // Mostrar check-in
        document.getElementById('apoyo-content').innerHTML = this.renderCheckIn();
    }

    // Seleccionar emoción
    async seleccionarEmocion(emocion, emoji) {
        // Guardar check-in
        this.checkInHistory.push({
            fecha: new Date().toISOString(),
            tipo: 'checkin',
            emocion: emocion,
            metricas: this.metrics
        });
        this.saveHistory();

        // Mostrar respuesta empática
        document.getElementById('apoyo-content').innerHTML = this.renderRespuestaEmocional(emocion, emoji);

        // Enviar a backend (anónimo o no)
        await this.enviarCheckIn(emocion);
    }

    // Respuesta emocional personalizada
    renderRespuestaEmocional(emocion, emoji) {
        let mensaje = '';
        let recursos = [];
        let color = '';

        switch(emocion) {
            case 'excelente':
                color = '#10B981';
                mensaje = `¡Qué alegría! ${emoji} Es hermoso ver cuando las cosas funcionan. Disfruta este momento y celebra tus logros, grandes o pequeños.`;
                recursos = [
                    { titulo: 'Comparte tu éxito', icono: '📣', accion: 'compartir' },
                    { titulo: 'Ayuda a otros emprendedores', icono: '🤝', accion: 'comunidad' },
                    { titulo: 'Escala tu negocio', icono: '📈', accion: 'escalar' }
                ];
                break;

            case 'bien':
                color = '#3B82F6';
                mensaje = `Está bien sentirse simplemente... bien ${emoji}. No siempre tiene que ser extraordinario. La consistencia es la clave del éxito.`;
                recursos = [
                    { titulo: 'Mejora continua', icono: '📊', accion: 'mejorar' },
                    { titulo: 'Nuevas ideas', icono: '💡', accion: 'ideas' },
                    { titulo: 'Networking', icono: '🌐', accion: 'networking' }
                ];
                break;

            case 'regular':
                color = '#F59E0B';
                mensaje = `Entendemos que hay altibajos ${emoji}. Emprender es una montaña rusa. Lo importante es seguir adelante, un día a la vez.`;
                recursos = [
                    { titulo: 'Consejos prácticos', icono: '🎯', accion: 'consejos' },
                    { titulo: 'Hablar con otros', icono: '💬', accion: 'comunidad' },
                    { titulo: 'Replantear estrategia', icono: '🔄', accion: 'estrategia' }
                ];
                break;

            case 'dificil':
                color = '#EF4444';
                mensaje = `Sentimos que estés pasando por un momento difícil ${emoji}. Pero recuerda: los momentos más duros son los que más nos enseñan. No estás solo.`;
                recursos = [
                    { titulo: 'Habla con alguien (gratis)', icono: '🤗', accion: 'apoyo-personal' },
                    { titulo: 'Historias inspiradoras', icono: '⭐', accion: 'historias' },
                    { titulo: 'Análisis de tu situación', icono: '🔍', accion: 'analisis' },
                    { titulo: 'Recursos de emergencia', icono: '🆘', accion: 'emergencia' }
                ];
                break;

            case 'abrumado':
                color = '#8B5CF6';
                mensaje = `Respiremos juntos ${emoji}. Cuando todo parece demasiado, hay que dar un paso atrás. Vamos a simplificar las cosas y enfocarnos en lo esencial.`;
                recursos = [
                    { titulo: '🧘 Toma un respiro', icono: '🌸', accion: 'respiro' },
                    { titulo: 'Prioriza tareas', icono: '📝', accion: 'priorizar' },
                    { titulo: 'Habla con mentor', icono: '👥', accion: 'mentor' },
                    { titulo: 'Divide y vencerás', icono: '✂️', accion: 'dividir' }
                ];
                break;
        }

        return `
            <div class="apoyo-respuesta" style="--apoyo-color: ${color}">
                <div class="respuesta-emoji">${emoji}</div>
                
                <div class="respuesta-mensaje">
                    <p>${mensaje}</p>
                </div>

                <div class="respuesta-recursos">
                    <h4>¿Qué te gustaría hacer?</h4>
                    <div class="recursos-lista">
                        ${recursos.map(recurso => `
                            <button class="recurso-btn" onclick="apoyoEmprendedor.abrirRecurso('${recurso.accion}')">
                                <span class="recurso-icono">${recurso.icono}</span>
                                <span class="recurso-titulo">${recurso.titulo}</span>
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Mensaje especial para momentos difíciles -->
                ${(emocion === 'dificil' || emocion === 'abrumado') ? `
                <div class="mensaje-especial">
                    <i class="fas fa-heart"></i>
                    <p>
                        <strong>Recuerda:</strong> Todos los grandes emprendedores pasaron 
                        por momentos así. No es fracaso, es aprendizaje. 
                        Estamos aquí para apoyarte. 💜
                    </p>
                    <button class="btn-apoyo-secondary" onclick="apoyoEmprendedor.abrirFormularioMensaje()">
                        <i class="fas fa-comment-dots"></i>
                        Enviar mensaje al equipo de apoyo
                    </button>
                </div>
                ` : ''}

                <button class="btn-apoyo-ghost" onclick="apoyoEmprendedor.volverInicio()">
                    <i class="fas fa-arrow-left"></i>
                    Volver
                </button>
            </div>
        `;
    }

    // Abrir recurso específico
    abrirRecurso(tipo) {
        const recursos = {
            'apoyo-personal': {
                titulo: 'Apoyo Personal',
                contenido: `
                    <h3>Habla con Alguien que Entiende</h3>
                    <p>Como parte de Cresalia, tienes acceso a:</p>
                    <ul class="apoyo-lista-recursos">
                        <li><i class="fas fa-comments"></i> <strong>Chat privado con nuestro equipo</strong></li>
                        <li><i class="fas fa-phone"></i> <strong>Llamada de 15 minutos (sin costo)</strong></li>
                        <li><i class="fas fa-envelope"></i> <strong>Email personalizado</strong></li>
                    </ul>
                    <p class="recurso-nota">No estás solo. Entendemos por lo que pasas porque también fuimos emprendedores.</p>
                    <button class="btn-apoyo-primary" onclick="apoyoEmprendedor.solicitarLlamada()">
                        <i class="fas fa-phone"></i>
                        Solicitar Llamada
                    </button>
                `,
                emoji: '🤗'
            },
            'historias': {
                titulo: 'Historias de Otros Emprendedores',
                contenido: `
                    <div class="historias-lista">
                        <div class="historia-item">
                            <div class="historia-header">
                                <span class="historia-autor">María, tienda de ropa</span>
                                <span class="historia-badge">Free → Pro</span>
                            </div>
                            <p>"Los primeros 3 meses tuve 0 ventas. Lloré varias veces pensando en rendirme. Hoy vendo $5,000/mes. La clave fue no rendirme."</p>
                        </div>
                        
                        <div class="historia-item">
                            <div class="historia-header">
                                <span class="historia-autor">Carlos, productos tech</span>
                                <span class="historia-badge">Basic</span>
                            </div>
                            <p>"Invertí todos mis ahorros ($500) y los primeros meses fueron terror. Pero confié en mi producto. Hoy tengo 50 clientes fieles."</p>
                        </div>

                        <div class="historia-item">
                            <div class="historia-header">
                                <span class="historia-autor">Ana, artesanías</span>
                                <span class="historia-badge">Free</span>
                            </div>
                            <p>"Mi familia decía que era locura. Empecé vendiendo a amigas. 6 meses después, ellas me compraban a MÍ. Creé mi propio empleo."</p>
                        </div>
                    </div>
                    <p class="recurso-cta">
                        <strong>¿Quieres compartir tu historia?</strong><br>
                        Ayuda a inspirar a otros emprendedores como tú.
                    </p>
                    <button class="btn-apoyo-secondary" onclick="apoyoEmprendedor.compartirHistoria()">
                        <i class="fas fa-pen"></i>
                        Compartir Mi Historia
                    </button>
                `,
                emoji: '⭐'
            },
            'comunidad': {
                titulo: 'Comunidad de Emprendedores',
                contenido: `
                    <h3>Conecta con Otros como Tú</h3>
                    <p>Únete a nuestra comunidad de emprendedores que usan Cresalia:</p>
                    
                    <div class="comunidad-opciones">
                        <a href="#" class="comunidad-btn" target="_blank">
                            <i class="fab fa-telegram"></i>
                            <div>
                                <strong>Grupo de Telegram</strong>
                                <span>1,234 emprendedores</span>
                            </div>
                        </a>
                        
                        <a href="#" class="comunidad-btn" target="_blank">
                            <i class="fab fa-discord"></i>
                            <div>
                                <strong>Discord Cresalia</strong>
                                <span>Eventos semanales</span>
                            </div>
                        </a>
                        
                        <a href="#" class="comunidad-btn" target="_blank">
                            <i class="fab fa-facebook"></i>
                            <div>
                                <strong>Grupo de Facebook</strong>
                                <span>Apoyo 24/7</span>
                            </div>
                        </a>
                    </div>

                    <div class="comunidad-beneficios">
                        <h5>En la comunidad puedes:</h5>
                        <ul>
                            <li>Hacer preguntas y recibir ayuda</li>
                            <li>Compartir tus logros y fracasos</li>
                            <li>Encontrar colaboradores</li>
                            <li>Participar en sesiones de mentoría</li>
                            <li>Hacer networking con otros</li>
                        </ul>
                    </div>
                `,
                emoji: '🤝'
            },
            'motivacion': {
                titulo: 'Impulso Motivacional',
                contenido: this.getContenidoMotivacional(),
                emoji: '🔥'
            },
            'consejos': {
                titulo: 'Consejos Prácticos',
                contenido: this.getConsejosPracticos(),
                emoji: '💡'
            }
        };

        const recurso = recursos[tipo] || recursos['motivacion'];

        document.getElementById('apoyo-content').innerHTML = `
            <div class="apoyo-recurso-detalle">
                <div class="recurso-header">
                    <span class="recurso-emoji-grande">${recurso.emoji}</span>
                    <h2>${recurso.titulo}</h2>
                </div>
                
                <div class="recurso-contenido">
                    ${recurso.contenido}
                </div>

                <button class="btn-apoyo-ghost" onclick="apoyoEmprendedor.volverInicio()">
                    <i class="fas fa-arrow-left"></i>
                    Volver
                </button>
            </div>
        `;
    }

    // Contenido motivacional
    getContenidoMotivacional() {
        const frases = [
            {
                frase: "El éxito es la suma de pequeños esfuerzos repetidos día tras día",
                autor: "Robert Collier"
            },
            {
                frase: "No importa qué tan lento vayas, siempre y cuando no te detengas",
                autor: "Confucio"
            },
            {
                frase: "El fracaso es simplemente la oportunidad de comenzar de nuevo, esta vez de forma más inteligente",
                autor: "Henry Ford"
            },
            {
                frase: "Emprendedor: alguien que trabaja 80 horas a la semana para evitar trabajar 40 horas para otro",
                autor: "Anónimo"
            }
        ];

        const fraseDelDia = frases[Math.floor(Math.random() * frases.length)];

        return `
            <div class="motivacion-contenido">
                <div class="frase-del-dia">
                    <i class="fas fa-quote-left"></i>
                    <p class="frase-texto">"${fraseDelDia.frase}"</p>
                    <p class="frase-autor">— ${fraseDelDia.autor}</p>
                </div>

                <div class="recordatorios">
                    <h4>Recordatorios importantes:</h4>
                    <div class="recordatorio-card">
                        <span class="recordatorio-icono">🌱</span>
                        <div>
                            <strong>Todo negocio empieza pequeño</strong>
                            <p>Amazon empezó vendiendo libros desde un garaje. Tú también estás construyendo algo grande.</p>
                        </div>
                    </div>

                    <div class="recordatorio-card">
                        <span class="recordatorio-icono">💪</span>
                        <div>
                            <strong>El "no" de hoy puede ser el "sí" de mañana</strong>
                            <p>Cada rechazo te acerca más a tu cliente ideal. Sigue intentando.</p>
                        </div>
                    </div>

                    <div class="recordatorio-card">
                        <span class="recordatorio-icono">📈</span>
                        <div>
                            <strong>El progreso no siempre es lineal</strong>
                            <p>Habrá retrocesos. Pero la tendencia general es hacia arriba si persistes.</p>
                        </div>
                    </div>

                    <div class="recordatorio-card">
                        <span class="recordatorio-icono">❤️</span>
                        <div>
                            <strong>Cuida tu salud mental</strong>
                            <p>Un emprendedor agotado no puede construir un negocio exitoso. Descansa cuando lo necesites.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Consejos prácticos según situación
    getConsejosPracticos() {
        const ventas = this.metrics.ventas_mes || 0;
        
        let consejos = [];

        if (ventas === 0) {
            consejos = [
                {
                    titulo: 'Primeras Ventas: Plan de Acción',
                    pasos: [
                        'Comparte tu tienda en 3 grupos de Facebook/WhatsApp',
                        'Ofrece 20% descuento a primeros 5 clientes',
                        'Pide a amigos que compartan (¡no comprar, solo compartir!)',
                        'Publica 1 producto al día en Instagram Stories',
                        'Contacta 10 clientes potenciales directamente'
                    ]
                },
                {
                    titulo: 'Optimiza tu Tienda',
                    pasos: [
                        'Fotos de calidad (usa celular con buena luz)',
                        'Descripciones claras y honestas',
                        'Precios competitivos (investiga competencia)',
                        'Método de pago fácil',
                        'Responde rápido a consultas'
                    ]
                }
            ];
        } else {
            consejos = [
                {
                    titulo: 'Escala tus Ventas',
                    pasos: [
                        'Analiza tu producto más vendido',
                        'Crea variaciones de ese producto',
                        'Pide reviews a clientes satisfechos',
                        'Implementa programa de referidos',
                        'Considera anuncios pagos (Facebook $5/día)'
                    ]
                },
                {
                    titulo: 'Fideliza Clientes',
                    pasos: [
                        'Envía email de agradecimiento post-compra',
                        'Ofrece cupón de descuento para próxima compra',
                        'Pide feedback (¿qué mejorarías?)',
                        'Crea lista de email marketing',
                        'Sorprende con detalles (nota escrita a mano)'
                    ]
                }
            ];
        }

        return `
            <div class="consejos-contenido">
                ${consejos.map((consejo, index) => `
                    <div class="consejo-seccion">
                        <h4><span class="numero-consejo">${index + 1}</span> ${consejo.titulo}</h4>
                        <ul class="pasos-lista">
                            ${consejo.pasos.map(paso => `
                                <li>
                                    <i class="fas fa-check"></i>
                                    ${paso}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}

                <div class="consejo-extra">
                    <i class="fas fa-lightbulb"></i>
                    <p><strong>Tip Pro:</strong> Implementa 1-2 de estos consejos por semana. No intentes todo a la vez. La consistencia vence a la intensidad.</p>
                </div>
            </div>
        `;
    }

    // Abrir formulario de mensaje
    async abrirFormularioMensaje() {
        document.getElementById('apoyo-content').innerHTML = this.renderFormularioMensaje();
    }

    // Renderizar formulario de mensaje
    renderFormularioMensaje() {
        const ultimaEmocion = this.checkInHistory.length > 0 ? 
            this.checkInHistory[this.checkInHistory.length - 1].emocion : null;

        return `
            <div class="mensaje-form-container">
                <div class="mensaje-header">
                    <div class="mensaje-icono">💬</div>
                    <h3>Comparte cómo te sientes</h3>
                    <p>Tu mensaje llegará directamente a nuestro equipo de apoyo</p>
                </div>

                <form id="form-mensaje-apoyo" class="mensaje-form">
                    <!-- Selección de emoción (requerido) -->
                    <div class="form-group">
                        <label>¿Cómo te sientes?</label>
                        <div class="emociones-pequeñas">
                            <button type="button" class="emocion-btn-pequeño ${ultimaEmocion === 'excelente' ? 'selected' : ''}" data-emocion="excelente">
                                🚀 Excelente
                            </button>
                            <button type="button" class="emocion-btn-pequeño ${ultimaEmocion === 'bien' ? 'selected' : ''}" data-emocion="bien">
                                😊 Bien
                            </button>
                            <button type="button" class="emocion-btn-pequeño ${ultimaEmocion === 'regular' ? 'selected' : ''}" data-emocion="regular">
                                😐 Regular
                            </button>
                            <button type="button" class="emocion-btn-pequeño ${ultimaEmocion === 'dificil' ? 'selected' : ''}" data-emocion="dificil">
                                😔 Difícil
                            </button>
                            <button type="button" class="emocion-btn-pequeño ${ultimaEmocion === 'abrumado' ? 'selected' : ''}" data-emocion="abrumado">
                                😰 Abrumado
                            </button>
                        </div>
                        <input type="hidden" id="emocion-seleccionada" required>
                    </div>

                    <!-- Mensaje -->
                    <div class="form-group">
                        <label>Cuéntanos qué está pasando</label>
                        <textarea 
                            id="mensaje-texto"
                            class="mensaje-textarea"
                            placeholder="Escribe aquí con total confianza... Puede ser una duda, un miedo, una frustración o simplemente algo que necesites compartir."
                            rows="6"
                            maxlength="1000"
                            required
                        ></textarea>
                        <div class="char-count">
                            <span id="char-count">0</span>/1000
                        </div>
                    </div>

                    <!-- Privacidad -->
                    <div class="privacidad-info">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <strong>100% Privado y Confidencial</strong>
                            <p>Solo tú ${this.isAnonymous ? '' : 'y nuestro equipo de apoyo pueden'} ver este mensaje. 
                            Nadie más tiene acceso.</p>
                        </div>
                    </div>

                    <!-- Opción de contacto (opcional) -->
                    ${!this.isAnonymous ? `
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="permitir-contacto">
                            Me gustaría que me contacten para hablar más (opcional)
                        </label>
                    </div>
                    ` : ''}

                    <!-- Botones -->
                    <div class="form-buttons">
                        <button type="button" class="btn-apoyo-ghost" onclick="apoyoEmprendedor.volverInicio()">
                            Cancelar
                        </button>
                        <button type="submit" class="btn-apoyo-primary">
                            <i class="fas fa-paper-plane"></i>
                            Enviar Mensaje
                        </button>
                    </div>
                </form>
            </div>

            <style>
                .mensaje-form-container {
                    max-width: 100%;
                }

                .mensaje-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .mensaje-icono {
                    font-size: 64px;
                    margin-bottom: 16px;
                }

                .mensaje-header h3 {
                    font-size: 24px;
                    color: #1F2937;
                    margin-bottom: 8px;
                }

                .mensaje-header p {
                    color: #6B7280;
                    font-size: 14px;
                }

                .mensaje-form {
                    background: #F9FAFB;
                    padding: 24px;
                    border-radius: 16px;
                }

                .form-group {
                    margin-bottom: 24px;
                }

                .form-group label {
                    display: block;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 12px;
                    font-size: 14px;
                }

                .emociones-pequeñas {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 8px;
                }

                .emocion-btn-pequeño {
                    padding: 10px;
                    background: white;
                    border: 2px solid #E5E7EB;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 13px;
                    font-weight: 500;
                    color: #4B5563;
                }

                .emocion-btn-pequeño:hover {
                    border-color: #EC4899;
                    background: #FDF2F8;
                }

                .emocion-btn-pequeño.selected {
                    border-color: #EC4899;
                    background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                    color: #BE185D;
                    font-weight: 600;
                }

                .mensaje-textarea {
                    width: 100%;
                    padding: 14px;
                    border: 2px solid #E5E7EB;
                    border-radius: 12px;
                    font-family: inherit;
                    font-size: 14px;
                    line-height: 1.6;
                    resize: vertical;
                    transition: border-color 0.2s;
                }

                .mensaje-textarea:focus {
                    outline: none;
                    border-color: #EC4899;
                }

                .char-count {
                    text-align: right;
                    font-size: 12px;
                    color: #9CA3AF;
                    margin-top: 6px;
                }

                .privacidad-info {
                    background: linear-gradient(135deg, #FEF3C7, #FDE68A);
                    padding: 14px;
                    border-radius: 12px;
                    display: flex;
                    gap: 12px;
                    margin-bottom: 20px;
                    border-left: 4px solid #F59E0B;
                }

                .privacidad-info i {
                    color: #D97706;
                    font-size: 20px;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .privacidad-info strong {
                    display: block;
                    color: #92400E;
                    font-size: 13px;
                    margin-bottom: 4px;
                }

                .privacidad-info p {
                    color: #78350F;
                    font-size: 12px;
                    line-height: 1.5;
                    margin: 0;
                }

                .form-buttons {
                    display: flex;
                    gap: 12px;
                    margin-top: 24px;
                }

                .form-buttons button {
                    flex: 1;
                }
            </style>
        `;
    }

    // Enviar mensaje de apoyo
    async enviarMensaje(emocion, mensaje, permitirContacto) {
        try {
            const response = await fetch(`/api/${this.tenant.slug}/apoyo/mensaje`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emocion: emocion,
                    mensaje: mensaje,
                    metricas: this.metrics,
                    anonimo: this.isAnonymous,
                    permitir_contacto: permitirContacto,
                    timestamp: new Date().toISOString()
                })
            });

            const data = await response.json();

            if (data.success) {
                // Mostrar confirmación
                this.mostrarConfirmacionMensaje(data.urgencia, data.recursos_sugeridos);
            }
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            alert('Hubo un error. Por favor intenta de nuevo.');
        }
    }

    // Confirmación después de enviar mensaje
    mostrarConfirmacionMensaje(urgencia, recursos) {
        let mensaje = '';
        let siguientesPasos = '';

        if (urgencia === 'critica' || urgencia === 'alta') {
            mensaje = '💜 Tu mensaje ha sido recibido y está marcado como prioritario. Te responderemos personalmente muy pronto.';
            siguientesPasos = `
                <div class="urgencia-alta">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Entendemos que estás pasando por un momento difícil. 
                    No estás solo. Te responderemos en las próximas 2-4 horas.</p>
                    
                    <p><strong>Mientras tanto:</strong></p>
                    <ul>
                        <li>Toma un respiro profundo</li>
                        <li>Recuerda por qué empezaste</li>
                        <li>Revisa recursos de apoyo inmediato</li>
                    </ul>
                    
                    <button class="btn-apoyo-secondary" onclick="apoyoEmprendedor.verRecurso('motivacion')">
                        <i class="fas fa-fire"></i>
                        Ver Recursos de Apoyo
                    </button>
                </div>
            `;
        } else {
            mensaje = '✅ Mensaje recibido. Hemos identificado algunos recursos que podrían ayudarte mientras te respondemos.';
            siguientesPasos = `
                <div class="recursos-automaticos">
                    <h4>Recursos sugeridos para ti:</h4>
                    <div class="recursos-sugeridos">
                        ${recursos.map(r => `
                            <button class="recurso-sugerido" onclick="apoyoEmprendedor.verRecurso('${r.tipo}')">
                                <span class="recurso-icono">${r.icono}</span>
                                <div>
                                    <strong>${r.titulo}</strong>
                                    <p>${r.descripcion}</p>
                                </div>
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        `).join('')}
                    </div>
                    <p class="tiempo-respuesta">
                        <i class="fas fa-clock"></i>
                        Te responderemos personalmente en 24-48 horas.
                    </p>
                </div>
            `;
        }

        document.getElementById('apoyo-content').innerHTML = `
            <div class="confirmacion-mensaje">
                <div class="confirmacion-icono">
                    ${urgencia === 'critica' || urgencia === 'alta' ? '💜' : '✅'}
                </div>
                <h3>Mensaje Enviado</h3>
                <p class="confirmacion-texto">${mensaje}</p>
                
                ${siguientesPasos}
                
                <button class="btn-apoyo-ghost" onclick="apoyoEmprendedor.volverInicio()" style="margin-top: 24px;">
                    <i class="fas fa-arrow-left"></i>
                    Volver
                </button>
            </div>
        `;
    }

    // Enviar check-in a backend
    async enviarCheckIn(emocion) {
        try {
            await fetch(`/api/${this.tenant.slug}/apoyo/checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emocion: emocion,
                    metricas: this.metrics,
                    anonimo: this.isAnonymous,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('Error enviando check-in:', error);
        }
    }

    // Event listeners
    setupEventListeners() {
        document.getElementById('apoyo-toggle').addEventListener('click', () => {
            this.toggle();
        });

        // Delegación de eventos para formularios dinámicos
        document.addEventListener('click', (e) => {
            // Selección de emoción en formulario
            if (e.target.closest('.emocion-btn-pequeño')) {
                const btn = e.target.closest('.emocion-btn-pequeño');
                const emocion = btn.dataset.emocion;
                
                // Remover selected de todos
                document.querySelectorAll('.emocion-btn-pequeño').forEach(b => {
                    b.classList.remove('selected');
                });
                
                // Marcar como seleccionado
                btn.classList.add('selected');
                document.getElementById('emocion-seleccionada').value = emocion;
            }
        });

        // Input de textarea - contar caracteres
        document.addEventListener('input', (e) => {
            if (e.target.id === 'mensaje-texto') {
                const count = e.target.value.length;
                const charCount = document.getElementById('char-count');
                if (charCount) {
                    charCount.textContent = count;
                }
            }
        });

        // Submit del formulario
        document.addEventListener('submit', async (e) => {
            if (e.target.id === 'form-mensaje-apoyo') {
                e.preventDefault();
                
                const emocion = document.getElementById('emocion-seleccionada').value;
                const mensaje = document.getElementById('mensaje-texto').value.trim();
                const permitirContacto = document.getElementById('permitir-contacto')?.checked || false;

                if (!emocion) {
                    alert('Por favor selecciona cómo te sientes');
                    return;
                }

                if (!mensaje) {
                    alert('Por favor escribe tu mensaje');
                    return;
                }

                // Enviar mensaje
                await this.enviarMensaje(emocion, mensaje, permitirContacto);
            }
        });
    }

    // Toggle panel
    toggle() {
        const panel = document.getElementById('apoyo-panel');
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'flex';
    }

    // Cerrar
    close() {
        document.getElementById('apoyo-panel').style.display = 'none';
    }

    // Volver al inicio
    volverInicio() {
        document.getElementById('apoyo-content').innerHTML = this.renderCheckIn();
    }

    // Verificar si necesita check-in
    verificarCheckIn() {
        const ultimoCheckIn = this.checkInHistory[this.checkInHistory.length - 1];
        
        if (!ultimoCheckIn) return;

        const diasDesdeUltimo = Math.floor((Date.now() - new Date(ultimoCheckIn.fecha)) / (1000 * 60 * 60 * 24));
        
        // Mostrar recordatorio cada 7 días
        if (diasDesdeUltimo >= 7) {
            this.mostrarRecordatorioCheckIn();
        }
    }

    // Mostrar recordatorio
    mostrarRecordatorioCheckIn() {
        setTimeout(() => {
            const badge = document.createElement('div');
            badge.className = 'apoyo-recordatorio-badge';
            badge.textContent = '💜';
            document.getElementById('apoyo-toggle').appendChild(badge);
        }, 5000);
    }

    // Analizar situación del negocio
    analizarSituacion() {
        const ventas = this.metrics.ventas_mes || 0;
        const productos = this.metrics.total_productos || 0;
        const diasActivo = this.metrics.dias_activo || 0;

        // Si lleva más de 30 días sin ventas, ofrecer ayuda proactiva
        if (diasActivo > 30 && ventas === 0 && productos > 0) {
            setTimeout(() => {
                this.ofrecerAyudaProactiva();
            }, 10000); // Después de 10 segundos
        }
    }

    // Ofrecer ayuda proactiva
    ofrecerAyudaProactiva() {
        // Mostrar notificación suave
        const notif = document.createElement('div');
        notif.className = 'apoyo-notificacion';
        notif.innerHTML = `
            <div class="notif-content">
                <span class="notif-icono">💜</span>
                <div class="notif-texto">
                    <strong>¿Necesitas apoyo?</strong>
                    <p>Notamos que aún no has tenido ventas. ¿Te gustaría hablar con alguien?</p>
                </div>
                <button class="notif-btn" onclick="apoyoEmprendedor.toggle(); this.parentElement.parentElement.remove();">
                    Ver
                </button>
            </div>
        `;

        document.body.appendChild(notif);

        // Auto-desaparecer en 10 segundos
        setTimeout(() => {
            if (notif.parentElement) {
                notif.classList.add('fade-out');
                setTimeout(() => notif.remove(), 300);
            }
        }, 10000);
    }

    // Persistencia
    loadHistory() {
        const saved = localStorage.getItem(`apoyo_history_${this.tenant.slug}`);
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory() {
        localStorage.setItem(`apoyo_history_${this.tenant.slug}`, JSON.stringify(this.checkInHistory));
    }

    // Estilos
    getStyles() {
        return `
        <style>
            /* Widget de Apoyo - Diferente al de soporte */
            #apoyo-emprendedor-widget {
                position: fixed;
                bottom: 24px;
                left: 24px;  /* Lado IZQUIERDO (soporte está a la derecha) */
                z-index: 9998;
                font-family: var(--font-primary, 'Poppins', sans-serif);
            }

            .apoyo-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #EC4899, #F9A8D4);
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(236, 72, 153, 0.4);
                transition: all 0.3s ease;
                position: relative;
                animation: heartbeat 2s infinite;
            }

            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                10% { transform: scale(1.1); }
                20% { transform: scale(1); }
                30% { transform: scale(1.1); }
                40% { transform: scale(1); }
            }

            .apoyo-toggle:hover {
                transform: scale(1.15);
                box-shadow: 0 6px 30px rgba(236, 72, 153, 0.6);
            }

            .apoyo-pulse {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(236, 72, 153, 0.4);
                transform: translate(-50%, -50%);
                animation: pulse-ring 2s infinite;
            }

            @keyframes pulse-ring {
                0% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1.5);
                    opacity: 0;
                }
            }

            .apoyo-recordatorio-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                font-size: 20px;
                animation: bounce 1s infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }

            /* Panel de apoyo */
            .apoyo-panel {
                position: absolute;
                bottom: 80px;
                left: 0;
                width: 420px;
                max-height: 650px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(236, 72, 153, 0.25);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: slideUpLeft 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            @keyframes slideUpLeft {
                from {
                    opacity: 0;
                    transform: translateY(30px) translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) translateX(0);
                }
            }

            /* Header cálido */
            .apoyo-header {
                padding: 24px;
                background: linear-gradient(135deg, #EC4899, #F9A8D4);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .apoyo-header-content {
                display: flex;
                gap: 14px;
                align-items: center;
            }

            .apoyo-icon {
                font-size: 36px;
                animation: float 3s ease-in-out infinite;
            }

            .apoyo-info h3 {
                margin: 0 0 4px 0;
                font-size: 18px;
                font-weight: 600;
            }

            .apoyo-info p {
                margin: 0;
                font-size: 13px;
                opacity: 0.95;
            }

            .btn-icon-light {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
            }

            .btn-icon-light:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            /* Contenido */
            .apoyo-content {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
            }

            /* Bienvenida */
            .apoyo-bienvenida {
                text-align: center;
            }

            .apoyo-emoji {
                font-size: 64px;
                margin-bottom: 20px;
                animation: float 3s ease-in-out infinite;
            }

            .apoyo-bienvenida h2 {
                font-size: 26px;
                color: #1F2937;
                margin-bottom: 16px;
            }

            .apoyo-texto-principal {
                font-size: 16px;
                line-height: 1.7;
                color: #4B5563;
                margin-bottom: 16px;
            }

            .apoyo-texto-secundario {
                font-size: 14px;
                line-height: 1.6;
                color: #6B7280;
                margin-bottom: 24px;
            }

            .apoyo-anonimato {
                background: #FEF3C7;
                padding: 16px;
                border-radius: 12px;
                margin-bottom: 24px;
                text-align: left;
            }

            .apoyo-checkbox {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                font-size: 14px;
                color: #92400E;
                font-weight: 500;
            }

            .apoyo-checkbox input {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .apoyo-nota {
                margin: 12px 0 0 0;
                font-size: 12px;
                color: #B45309;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            /* Botones de apoyo */
            .btn-apoyo-primary, .btn-apoyo-secondary, .btn-apoyo-ghost {
                width: 100%;
                padding: 14px 24px;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                border: none;
            }

            .btn-apoyo-primary {
                background: linear-gradient(135deg, #EC4899, #F9A8D4);
                color: white;
                box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
            }

            .btn-apoyo-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
            }

            .btn-apoyo-secondary {
                background: white;
                color: #EC4899;
                border: 2px solid #EC4899;
            }

            .btn-apoyo-secondary:hover {
                background: #EC4899;
                color: white;
            }

            .btn-apoyo-ghost {
                background: transparent;
                color: #6B7280;
            }

            .btn-apoyo-ghost:hover {
                background: #F3F4F6;
            }

            /* Emociones */
            .apoyo-pregunta {
                margin-bottom: 24px;
            }

            .apoyo-pregunta h4 {
                font-size: 16px;
                color: #374151;
                margin-bottom: 16px;
                text-align: center;
            }

            .apoyo-emociones {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }

            .emocion-btn {
                padding: 16px 12px;
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .emocion-btn:hover {
                border-color: #EC4899;
                background: #FDF2F8;
                transform: translateY(-2px);
            }

            .emocion-emoji {
                font-size: 32px;
            }

            .emocion-texto {
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }

            /* Respuesta emocional */
            .apoyo-respuesta {
                text-align: center;
            }

            .respuesta-emoji {
                font-size: 64px;
                margin-bottom: 20px;
                animation: scaleIn 0.5s ease;
            }

            .respuesta-mensaje {
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                padding: 20px;
                border-radius: 16px;
                margin-bottom: 24px;
                border-left: 4px solid var(--apoyo-color, #EC4899);
            }

            .respuesta-mensaje p {
                font-size: 15px;
                line-height: 1.7;
                color: #374151;
                margin: 0;
            }

            /* Recursos */
            .respuesta-recursos h4 {
                font-size: 16px;
                color: #374151;
                margin-bottom: 16px;
                text-align: left;
            }

            .recursos-lista {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 20px;
            }

            .recurso-btn {
                padding: 14px 16px;
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                text-align: left;
            }

            .recurso-btn:hover {
                border-color: #EC4899;
                background: #FDF2F8;
                transform: translateX(4px);
            }

            .recurso-icono {
                font-size: 24px;
            }

            .recurso-titulo {
                flex: 1;
                font-weight: 500;
                color: #374151;
            }

            .recurso-btn i {
                color: #EC4899;
                font-size: 14px;
            }

            /* Mensaje especial */
            .mensaje-especial {
                background: linear-gradient(135deg, #FEF3C7, #FDE68A);
                padding: 20px;
                border-radius: 16px;
                margin: 24px 0;
                border-left: 4px solid #F59E0B;
            }

            .mensaje-especial i {
                color: #EC4899;
                font-size: 20px;
                margin-bottom: 12px;
            }

            .mensaje-especial p {
                font-size: 14px;
                line-height: 1.7;
                color: #78350F;
                margin-bottom: 16px;
            }

            /* Notificación proactiva */
            .apoyo-notificacion {
                position: fixed;
                top: 24px;
                left: 24px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(236, 72, 153, 0.3);
                padding: 20px;
                max-width: 360px;
                z-index: 9999;
                animation: slideInLeft 0.5s ease;
            }

            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .notif-content {
                display: flex;
                gap: 14px;
                align-items: flex-start;
            }

            .notif-icono {
                font-size: 32px;
            }

            .notif-texto strong {
                display: block;
                font-size: 16px;
                color: #1F2937;
                margin-bottom: 4px;
            }

            .notif-texto p {
                font-size: 14px;
                color: #6B7280;
                margin: 0;
                line-height: 1.5;
            }

            .notif-btn {
                background: linear-gradient(135deg, #EC4899, #F9A8D4);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                white-space: nowrap;
                transition: transform 0.2s;
            }

            .notif-btn:hover {
                transform: scale(1.05);
            }

            /* Métricas */
            .metricas-resumen {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin: 20px 0;
            }

            .metrica-item {
                text-align: center;
                padding: 16px;
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                border-radius: 12px;
                border: 2px solid #FBCFE8;
            }

            .metrica-numero {
                display: block;
                font-size: 28px;
                font-weight: 700;
                color: #EC4899;
                margin-bottom: 4px;
            }

            .metrica-label {
                display: block;
                font-size: 12px;
                color: #9CA3AF;
            }

            /* Consejos personalizados */
            .consejos-personalizados {
                background: white;
                padding: 20px;
                border-radius: 12px;
                margin-top: 20px;
                border: 2px solid #E5E7EB;
            }

            .consejos-personalizados h5 {
                font-size: 14px;
                color: #374151;
                margin: 0 0 12px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .consejos-personalizados h5 i {
                color: #EC4899;
            }

            .consejos-lista {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .consejos-lista li {
                padding: 10px 0;
                font-size: 14px;
                color: #4B5563;
                display: flex;
                align-items: flex-start;
                gap: 10px;
                line-height: 1.5;
            }

            .consejos-lista li i {
                color: #10B981;
                margin-top: 2px;
                flex-shrink: 0;
            }

            /* Botón enviar mensaje */
            .enviar-mensaje-section {
                margin-top: 24px;
                padding-top: 24px;
                border-top: 2px dashed #E5E7EB;
            }

            .btn-enviar-mensaje {
                width: 100%;
                padding: 16px;
                background: linear-gradient(135deg, #A78BFA, #DDD6FE);
                border: 2px dashed #7C3AED;
                border-radius: 12px;
                color: #4C1D95;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .btn-enviar-mensaje:hover {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                transform: translateY(-2px);
            }

            /* Recursos sugeridos */
            .recursos-sugeridos {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin: 16px 0;
            }

            .recurso-sugerido {
                padding: 16px;
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 12px;
                text-align: left;
            }

            .recurso-sugerido:hover {
                border-color: #7C3AED;
                background: #F5F3FF;
                transform: translateX(4px);
            }

            .recurso-sugerido .recurso-icono {
                font-size: 24px;
            }

            .recurso-sugerido strong {
                display: block;
                color: #1F2937;
                margin-bottom: 4px;
                font-size: 14px;
            }

            .recurso-sugerido p {
                color: #6B7280;
                font-size: 12px;
                margin: 0;
            }

            .recurso-sugerido i {
                color: #7C3AED;
                margin-left: auto;
            }

            .tiempo-respuesta {
                text-align: center;
                margin-top: 16px;
                padding: 12px;
                background: #F0FDF4;
                border-radius: 8px;
                color: #065F46;
                font-size: 13px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .urgencia-alta {
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                padding: 20px;
                border-radius: 12px;
                border-left: 4px solid #EC4899;
                margin: 20px 0;
            }

            .urgencia-alta i {
                color: #EC4899;
                font-size: 24px;
                margin-bottom: 12px;
            }

            .urgencia-alta p {
                color: #831843;
                line-height: 1.7;
                margin-bottom: 16px;
            }

            .urgencia-alta ul {
                margin: 12px 0;
                padding-left: 24px;
                color: #831843;
            }

            .urgencia-alta li {
                margin-bottom: 8px;
            }

            .confirmacion-icono {
                font-size: 80px;
                margin-bottom: 20px;
                animation: scaleIn 0.5s ease;
            }

            /* Responsive */
            @media (max-width: 480px) {
                #apoyo-emprendedor-widget {
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 100px;
                }

                .apoyo-panel {
                    width: 95vw;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .emociones-pequeñas {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        </style>
        `;
    }
}

// Función global para inicializar
window.initApoyoEmprendedor = function(tenantConfig) {
    // Solo si es Free o Basic
    if (['free', 'basic'].includes(tenantConfig.plan.toLowerCase())) {
        window.apoyoEmprendedor = new SistemaApoyoEmprendedor(tenantConfig);
        window.apoyoEmprendedor.init();
    }
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SistemaApoyoEmprendedor };
}

