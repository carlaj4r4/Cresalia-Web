// ===== DIARIO EMOCIONAL - CRESALIA =====
// Espacio seguro para que emprendedores procesen sus emociones
// Con amor de Crisla 💜

class DiarioEmocional {
    constructor(tenantSlug) {
        this.tenantSlug = tenantSlug;
        this.entradas = this.cargarEntradas();
    }

    // Cargar entradas del localStorage
    cargarEntradas() {
        const stored = localStorage.getItem(`${this.tenantSlug}_diario_emocional`);
        return stored ? JSON.parse(stored) : [];
    }

    // Guardar entradas
    guardarEntradas() {
        localStorage.setItem(`${this.tenantSlug}_diario_emocional`, JSON.stringify(this.entradas));
    }

    // Crear interfaz completa del diario
    crearDiario() {
        const diario = document.createElement('div');
        diario.className = 'diario-emocional-container';
        diario.innerHTML = `
            <div class="diario-wrapper">
                <!-- Header cálido -->
            <div class="diario-header">
                <div class="header-glow"></div>
                <h1>
                    <i class="fas fa-heart-pulse"></i>
                    Tu Espacio Seguro
                </h1>
                <p class="diario-subtitle">
                    Un lugar para procesar tus emociones, sin juicios, con amor 💜
                </p>
                <p class="diario-firma">— Crisla</p>
                <div class="header-decoration">
                    <div class="decoration-line"></div>
                    <div class="decoration-heart">💜</div>
                    <div class="decoration-line"></div>
                </div>
            </div>

                <!-- Botón de desahogo prominente -->
                <div class="boton-desahogo-container">
                    <div class="btn-desahogo-wrapper">
                        <div class="btn-desahogo-glow"></div>
                        <button class="btn-desahogo-principal" onclick="window.diarioEmocional.mostrarDesahogo()">
                            <div class="btn-desahogo-icon">
                                <i class="fas fa-hands-helping"></i>
                                <div class="icon-pulse"></div>
                            </div>
                            <div class="btn-desahogo-text">
                                <h3>¿Necesitás Desahogarte?</h3>
                                <p>Estoy acá para vos 💜</p>
                                <div class="btn-subtitle">Un espacio seguro para expresar lo que sentís</div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Opciones rápidas -->
                <div class="opciones-rapidas">
                    <div class="opcion-card-wrapper">
                        <button class="opcion-card" onclick="window.diarioEmocional.abrirDiario()">
                            <div class="opcion-icon">
                                <i class="fas fa-book"></i>
                                <div class="opcion-glow"></div>
                            </div>
                            <div class="opcion-content">
                                <h4>Mi Diario</h4>
                                <p>Leé y escribí en tu diario personal</p>
                                <div class="opcion-stats">
                                    <span class="entradas-count">${this.entradas.length} entradas</span>
                                    <div class="progress-dots">
                                        ${this.entradas.length > 0 ? '●'.repeat(Math.min(this.entradas.length, 5)) : '○'.repeat(5)}
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>

                    <div class="opcion-card-wrapper">
                        <button class="opcion-card" onclick="window.diarioEmocional.mostrarFuentesAliento()">
                            <div class="opcion-icon">
                                <i class="fas fa-sun"></i>
                                <div class="opcion-glow"></div>
                            </div>
                            <div class="opcion-content">
                                <h4>Fuentes de Aliento</h4>
                                <p>Mensajes inspiradores para tu día</p>
                                <div class="opcion-stats">
                                    <span class="resource-tag">☀️ Siempre disponibles</span>
                                </div>
                            </div>
                        </button>
                    </div>

                    <div class="opcion-card-wrapper">
                        <button class="opcion-card" onclick="window.diarioEmocional.verLogros()">
                            <div class="opcion-icon">
                                <i class="fas fa-trophy"></i>
                                <div class="opcion-glow"></div>
                            </div>
                            <div class="opcion-content">
                                <h4>Mis Logros</h4>
                                <p>Celebrá tu progreso y crecimiento</p>
                                <div class="opcion-stats">
                                    <span class="progress-tag">🏆 Tu evolución</span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Estadísticas emocionales -->
                <div class="estadisticas-emocionales">
                    <h3>Tu Viaje Emocional</h3>
                    <div class="stats-grid" id="stats-emocionales">
                        ${this.renderEstadisticas()}
                    </div>
                </div>

                <!-- Entradas recientes -->
                <div class="entradas-recientes">
                    <div class="entradas-header">
                        <h3>
                            <i class="fas fa-book-open"></i>
                            Tu Historia Personal
                        </h3>
                        <div class="entradas-decoration">
                            <div class="decoration-line"></div>
                            <i class="fas fa-heart"></i>
                            <div class="decoration-line"></div>
                        </div>
                        <button class="btn-nueva-entrada" onclick="window.diarioEmocional.nuevaEntrada()">
                            <i class="fas fa-pen"></i>
                            <span>Nueva Entrada</span>
                        </button>
                    </div>
                    <div id="lista-entradas">
                        ${this.renderEntradasRecientes()}
                    </div>
                </div>
            </div>

            ${this.getStyles()}
        `;

        return diario;
    }

    // Modal de desahogo
    mostrarDesahogo() {
        const modal = document.createElement('div');
        modal.className = 'modal-desahogo';
        modal.innerHTML = `
            <div class="modal-desahogo-content">
                <div class="modal-header">
                    <h2>💜 Estoy Acá Para Vos</h2>
                    <button class="btn-cerrar" onclick="this.closest('.modal-desahogo').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="modal-body">
                    <p class="mensaje-calido">
                        Sé que a veces es difícil. Sé que hay días donde querés rendirte.
                        <strong>Y está bien sentirse así.</strong>
                    </p>

                    <p class="mensaje-calido">
                        Elegí lo que necesitás ahora:
                    </p>

                    <div class="opciones-desahogo">
                        <!-- Opción 1: Fuentes de aliento -->
                        <button class="opcion-desahogo fuentes" onclick="window.diarioEmocional.mostrarFuentesAliento(); this.closest('.modal-desahogo').remove();">
                            <div class="opcion-icon">
                                <i class="fas fa-sun"></i>
                            </div>
                            <div class="opcion-content">
                                <h4>Ver Fuentes de Aliento</h4>
                                <p>Mensajes que te van a levantar el ánimo</p>
                            </div>
                            <i class="fas fa-arrow-right opcion-arrow"></i>
                        </button>

                        <!-- Opción 2: Escribir a Crisla -->
                        <button class="opcion-desahogo mensaje" onclick="window.diarioEmocional.escribirACrisla(); this.closest('.modal-desahogo').remove();">
                            <div class="opcion-icon">
                                <i class="fas fa-envelope-open-text"></i>
                            </div>
                            <div class="opcion-content">
                                <h4>Hablar con Crisla</h4>
                                <p>Dejame un mensaje. Te voy a responder personalmente 💜</p>
                            </div>
                            <i class="fas fa-arrow-right opcion-arrow"></i>
                        </button>

                        <!-- Opción 3: Escribir en diario -->
                        <button class="opcion-desahogo diario" onclick="window.diarioEmocional.nuevaEntrada(); this.closest('.modal-desahogo').remove();">
                            <div class="opcion-icon">
                                <i class="fas fa-book-open"></i>
                            </div>
                            <div class="opcion-content">
                                <h4>Escribir en Mi Diario</h4>
                                <p>Procesa tus emociones en un espacio privado</p>
                            </div>
                            <i class="fas fa-arrow-right opcion-arrow"></i>
                        </button>

                        <!-- Opción 4: Recursos de crisis -->
                        <button class="opcion-desahogo crisis" onclick="window.diarioEmocional.mostrarRecursosCrisis(); this.closest('.modal-desahogo').remove();">
                            <div class="opcion-icon">
                                <i class="fas fa-life-ring"></i>
                            </div>
                            <div class="opcion-content">
                                <h4>Necesito Ayuda Urgente</h4>
                                <p>Si estás en crisis, tenemos recursos inmediatos</p>
                            </div>
                            <i class="fas fa-arrow-right opcion-arrow"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Fuentes de aliento
    mostrarFuentesAliento() {
        const modal = document.createElement('div');
        modal.className = 'modal-fuentes-aliento';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="fuentes-content" style="
                background: white;
                border-radius: 20px;
                max-width: 800px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 25px 80px rgba(0,0,0,0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            ">
                <div class="fuentes-header">
                    <h2>
                        <i class="fas fa-sun"></i>
                        Fuentes de Aliento
                    </h2>
                    <button class="btn-cerrar" onclick="this.closest('.modal-fuentes-aliento').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="fuentes-body">
                    ${this.getFuentesAliento().map((fuente, index) => `
                        <div class="fuente-item" style="animation-delay: ${index * 0.1}s">
                            <div class="fuente-emoji">${fuente.emoji}</div>
                            <div class="fuente-texto">
                                <p class="fuente-mensaje">"${fuente.mensaje}"</p>
                                <p class="fuente-autor">— ${fuente.autor}</p>
                            </div>
                        </div>
                    `).join('')}

                    <div class="fuente-crisla">
                        <h3>💜 Mensaje de Crisla Para Vos:</h3>
                        <p class="mensaje-crisla">
                            ${this.getMensajeCrislaPersonalizado()}
                        </p>
                    </div>

                    <button class="btn-necesito-mas" onclick="window.diarioEmocional.escribirACrisla(); this.closest('.modal-fuentes-aliento').remove();">
                        Necesito hablar con alguien
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animación de apertura
        setTimeout(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.fuentes-content');
            if (content) {
                content.style.transform = 'scale(1)';
            }
        }, 10);
        
        // Cerrar al hacer click fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModalFuentesAliento();
            }
        });
    }
    
    // Función para cerrar modal de fuentes de aliento
    cerrarModalFuentesAliento() {
        const modal = document.querySelector('.modal-fuentes-aliento');
        if (modal) {
            modal.style.opacity = '0';
            const content = modal.querySelector('.fuentes-content');
            if (content) {
                content.style.transform = 'scale(0.9)';
            }
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Fuentes de aliento (colección)
    getFuentesAliento() {
        return [
            {
                emoji: '🌱',
                mensaje: 'Los árboles más fuertes crecen en los vientos más duros.',
                autor: 'Proverbio'
            },
            {
                emoji: '🌅',
                mensaje: 'Cada día es una nueva oportunidad. Hoy puede ser EL día.',
                autor: 'Crisla'
            },
            {
                emoji: '💪',
                mensaje: 'No te rendiste ayer. No te rindas hoy. Mañana vas a agradecer no haberte rendido.',
                autor: 'Crisla'
            },
            {
                emoji: '⭐',
                mensaje: 'Tu negocio empezó con un sueño. Ese sueño todavía está ahí, esperándote.',
                autor: 'Crisla'
            },
            {
                emoji: '🎯',
                mensaje: 'No importa qué tan lento vayas, mientras no te detengas.',
                autor: 'Confucio'
            },
            {
                emoji: '🌈',
                mensaje: 'Después de la tormenta, siempre viene el arcoíris. Tu arcoíris está cerca.',
                autor: 'Crisla'
            },
            {
                emoji: '💜',
                mensaje: 'No estás solo/a. Hay una comunidad que cree en vos. Yo creo en vos.',
                autor: 'Crisla'
            },
            {
                emoji: '🚀',
                mensaje: 'Los cohetes no despegan sin resistencia. Tu resistencia te está preparando para despegar.',
                autor: 'Crisla'
            }
        ];
    }

    // Mensaje personalizado de Crisla según métricas
    getMensajeCrislaPersonalizado() {
        const mensajes = [
            "Mirá todo lo que ya lograste: creaste tu tienda, subiste productos, estás construyendo algo tuyo. Eso ya es un triunfo increíble. Y yo estoy acá, siempre. 💜",
            
            "Cada día es una oportunidad para crecer. ¿Qué tal si probamos algo nuevo hoy? Tal vez una foto diferente, una descripción más atractiva, o compartir tu tienda en redes sociales. ¡Las posibilidades son infinitas! 💜",
            
            "¿Sabías que la mayoría de negocios exitosos tardaron tiempo en despegar? No sos la excepción, sos parte de una historia de éxito que está escribiéndose. Tu momento está cerca. 💜",
            
            "Tu valor como persona NO depende de métricas. Sos valioso/a por intentar, por soñar, por no rendirte. Eso ya te hace especial y único/a. 💜",
            
            "Cuando sientas que no podés más, recordá POR QUÉ empezaste. Ese motivo todavía está ahí, y es más fuerte que cualquier desafío. Tu pasión es tu superpoder. 💜",
            
            "Hoy es un día perfecto para planificar el crecimiento. ¿Qué tal si pensamos en nuevas estrategias? Tal vez colaboraciones, descuentos especiales, o contenido que conecte con tu audiencia. ¡Vamos a crear magia juntos! 💜",
            
            "Cada emprendedor exitoso tuvo días como este. La diferencia está en que no se rindieron. Vos tampoco te vas a rendir. Y yo estoy acá para acompañarte en cada paso. 💜",
            
            "¿Qué tal si convertimos este momento en una oportunidad de aprendizaje? Podemos revisar qué funciona mejor, explorar nuevas ideas, o conectar con otros emprendedores. ¡El crecimiento está en el proceso! 💜"
        ];

        return mensajes[Math.floor(Math.random() * mensajes.length)];
    }

    // Recomendaciones de crecimiento positivas
    getRecomendacionesCrecimiento() {
        const recomendaciones = [
            {
                titulo: "💡 Ideas para Crecer",
                sugerencias: [
                    "Creá contenido en redes sociales mostrando tu proceso de trabajo",
                    "Organizá descuentos especiales para fechas importantes",
                    "Colaborá con otros emprendedores para hacer intercambios",
                    "Mejorá las fotos de tus productos con mejor iluminación",
                    "Creá historias detrás de cada producto que vendés"
                ]
            },
            {
                titulo: "🚀 Estrategias de Expansión",
                sugerencias: [
                    "Explorá nuevas plataformas para vender (marketplaces, redes sociales)",
                    "Creá un blog con consejos relacionados a tu nicho",
                    "Organizá eventos virtuales o presenciales",
                    "Desarrollá productos complementarios",
                    "Creá un programa de referidos para clientes satisfechos"
                ]
            },
            {
                titulo: "🌟 Conexión con Clientes",
                sugerencias: [
                    "Creá una newsletter con novedades y consejos útiles",
                    "Implementá un sistema de reseñas y testimonios",
                    "Organizá sorteos y concursos para aumentar engagement",
                    "Creá tutoriales o guías relacionadas con tus productos",
                    "Desarrollá una comunidad en redes sociales"
                ]
            },
            {
                titulo: "🎯 Optimización de Tienda",
                sugerencias: [
                    "Mejorá las descripciones de productos con palabras clave",
                    "Organizá mejor la navegación de tu tienda",
                    "Implementá un sistema de búsqueda más eficiente",
                    "Creá categorías más específicas para tus productos",
                    "Optimizá los tiempos de carga de tu sitio"
                ]
            },
            {
                titulo: "💪 Desarrollo Personal",
                sugerencias: [
                    "Tomá cursos online sobre marketing digital",
                    "Conectá con otros emprendedores en tu área",
                    "Leé libros sobre negocios y emprendimiento",
                    "Practicá networking en eventos del sector",
                    "Mantené un diario de aprendizaje y reflexiones"
                ]
            }
        ];

        return recomendaciones[Math.floor(Math.random() * recomendaciones.length)];
    }

    // Mensaje motivacional específico para métricas
    getMensajeMotivacionalMetricas() {
        const mensajes = [
            {
                titulo: "📈 Oportunidades de Crecimiento",
                mensaje: "Cada métrica es una oportunidad para aprender y mejorar. ¿Qué tal si probamos una nueva estrategia esta semana?",
                accion: "Explorar nuevas ideas"
            },
            {
                titulo: "🎯 Enfoque en el Progreso",
                mensaje: "El crecimiento no es lineal, es un proceso. Cada paso que das te acerca más a tus objetivos.",
                accion: "Celebrar pequeños logros"
            },
            {
                titulo: "🌟 Innovación Constante",
                mensaje: "Los negocios más exitosos se reinventan constantemente. ¿Qué innovación podrías implementar hoy?",
                accion: "Probar algo nuevo"
            },
            {
                titulo: "🤝 Construcción de Comunidad",
                mensaje: "Tu comunidad de clientes es tu mayor activo. ¿Cómo podrías conectar mejor con ellos?",
                accion: "Fortalecer conexiones"
            },
            {
                titulo: "💡 Aprendizaje Continuo",
                mensaje: "Cada desafío es una oportunidad de aprendizaje. ¿Qué habilidad nueva te gustaría desarrollar?",
                accion: "Invertir en crecimiento"
            }
        ];

        return mensajes[Math.floor(Math.random() * mensajes.length)];
    }

    // Mostrar recomendaciones de crecimiento
    mostrarRecomendaciones() {
        const recomendacion = this.getRecomendacionesCrecimiento();
        const mensajeMotivacional = this.getMensajeMotivacionalMetricas();
        
        const modal = document.createElement('div');
        modal.className = 'modal-recomendaciones';
        modal.innerHTML = `
            <div class="recomendaciones-content">
                <div class="recomendaciones-header">
                    <h2>
                        <i class="fas fa-rocket"></i>
                        ${recomendacion.titulo}
                    </h2>
                    <button class="btn-cerrar" onclick="this.closest('.modal-recomendaciones').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="recomendaciones-body">
                    <div class="mensaje-motivacional">
                        <h3>${mensajeMotivacional.titulo}</h3>
                        <p>${mensajeMotivacional.mensaje}</p>
                        <div class="accion-destacada">
                            <i class="fas fa-star"></i>
                            ${mensajeMotivacional.accion}
                        </div>
                    </div>

                    <div class="lista-sugerencias">
                        <h4>💡 Sugerencias Prácticas:</h4>
                        <ul>
                            ${recomendacion.sugerencias.map(sugerencia => 
                                `<li><i class="fas fa-check-circle"></i> ${sugerencia}</li>`
                            ).join('')}
                        </ul>
                    </div>

                    <div class="recomendaciones-footer">
                        <p class="mensaje-crisla">
                            <i class="fas fa-heart"></i>
                            Recordá: cada paso que das te acerca más a tus objetivos. ¡Vos podés! 💜
                            <br><strong>— Crisla</strong>
                        </p>
                        <button class="btn-nuevas-ideas" onclick="window.diarioEmocional.mostrarRecomendaciones()">
                            <i class="fas fa-refresh"></i>
                            Ver Más Ideas
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Escribir a Crisla
    escribirACrisla() {
        const modal = document.createElement('div');
        modal.className = 'modal-escribir-crisla';
        modal.innerHTML = `
            <div class="crisla-content">
                <div class="crisla-header">
                    <div class="crisla-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="crisla-intro">
                        <h2>Crisla</h2>
                        <p class="crisla-estado">
                            <span class="status-dot"></span>
                            Acá para vos, siempre 💜
                        </p>
                    </div>
                    <button class="btn-cerrar" onclick="this.closest('.modal-escribir-crisla').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="crisla-body">
                    <div class="mensaje-bienvenida">
                        <p>Hola 💜</p>
                        <p>Soy Crisla. Estoy acá para escucharte.</p>
                        <p>Todo lo que me cuentes es <strong>confidencial</strong> y <strong>sin juicios</strong>.</p>
                        <p>Contame qué está pasando...</p>
                    </div>

                    <!-- Selector de estado emocional -->
                    <div class="selector-emocion">
                        <label>¿Cómo te sentís ahora?</label>
                        <div class="emociones-grid">
                            <button class="emocion-btn" data-emocion="critico" onclick="window.diarioEmocional.seleccionarEmocion('critico', this)">
                                <span class="emocion-emoji">😭</span>
                                <span class="emocion-label">Crítico</span>
                            </button>
                            <button class="emocion-btn" data-emocion="muy-mal" onclick="window.diarioEmocional.seleccionarEmocion('muy-mal', this)">
                                <span class="emocion-emoji">😢</span>
                                <span class="emocion-label">Muy mal</span>
                            </button>
                            <button class="emocion-btn" data-emocion="ansioso" onclick="window.diarioEmocional.seleccionarEmocion('ansioso', this)">
                                <span class="emocion-emoji">😰</span>
                                <span class="emocion-label">Ansioso</span>
                            </button>
                            <button class="emocion-btn" data-emocion="frustrado" onclick="window.diarioEmocional.seleccionarEmocion('frustrado', this)">
                                <span class="emocion-emoji">😤</span>
                                <span class="emocion-label">Frustrado</span>
                            </button>
                            <button class="emocion-btn" data-emocion="cansado" onclick="window.diarioEmocional.seleccionarEmocion('cansado', this)">
                                <span class="emocion-emoji">😔</span>
                                <span class="emocion-label">Cansado</span>
                            </button>
                            <button class="emocion-btn" data-emocion="confundido" onclick="window.diarioEmocional.seleccionarEmocion('confundido', this)">
                                <span class="emocion-emoji">🤔</span>
                                <span class="emocion-label">Confundido</span>
                            </button>
                        </div>
                    </div>

                    <!-- Área de texto -->
                    <div class="mensaje-area">
                        <label for="mensaje-crisla">
                            Contame qué está pasando:
                        </label>
                        <textarea 
                            id="mensaje-crisla"
                            class="mensaje-textarea"
                            rows="8"
                            placeholder="Escribí acá... No te juzgo, no te apuro. Tomate tu tiempo. 💜"
                        ></textarea>
                        <div class="char-count">
                            <span id="mensaje-count">0</span> caracteres
                        </div>
                    </div>

                    <!-- Contexto adicional (opcional) -->
                    <div class="contexto-adicional">
                        <details>
                            <summary>Información adicional (opcional)</summary>
                            <div class="contexto-fields">
                                <label>
                                    <input type="checkbox" id="contexto-ventas">
                                    Quiero mejorar mis estrategias de crecimiento
                                </label>
                                <label>
                                    <input type="checkbox" id="contexto-economico">
                                    Problema económico personal
                                </label>
                                <label>
                                    <input type="checkbox" id="contexto-tecnico">
                                    Problema técnico con la tienda
                                </label>
                                <label>
                                    <input type="checkbox" id="contexto-personal">
                                    Problema personal/familiar
                                </label>
                            </div>
                        </details>
                    </div>

                    <!-- Privacidad -->
                    <div class="privacidad-info">
                        <i class="fas fa-lock"></i>
                        <p>
                            Tus mensajes son <strong>privados</strong>. 
                            Solo Crisla los ve. 
                            Nunca se comparten. 💜
                        </p>
                    </div>

                    <!-- Botones -->
                    <div class="modal-actions">
                        <button class="btn-cancelar" onclick="this.closest('.modal-escribir-crisla').remove()">
                            Cancelar
                        </button>
                        <button class="btn-enviar-crisla" onclick="window.diarioEmocional.enviarMensajeCrisla()">
                            <i class="fas fa-paper-plane"></i>
                            Enviar a Crisla
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Event listener para contador
        const textarea = modal.querySelector('#mensaje-crisla');
        const countSpan = modal.querySelector('#mensaje-count');
        textarea.addEventListener('input', (e) => {
            countSpan.textContent = e.target.value.length;
        });

        document.body.appendChild(modal);
    }

    // Seleccionar emoción
    seleccionarEmocion(emocion, btn) {
        // Quitar selección previa
        document.querySelectorAll('.emocion-btn').forEach(b => b.classList.remove('selected'));
        // Marcar nueva
        btn.classList.add('selected');
        // Guardar
        this.emocionSeleccionada = emocion;
    }

    // Enviar mensaje a Crisla
    async enviarMensajeCrisla() {
        const mensaje = document.getElementById('mensaje-crisla').value;
        const emocion = this.emocionSeleccionada;

        if (!mensaje.trim()) {
            alert('Por favor escribí algo. Estoy acá para escucharte 💜');
            return;
        }

        const contexto = {
            ventas: document.getElementById('contexto-ventas')?.checked,
            economico: document.getElementById('contexto-economico')?.checked,
            tecnico: document.getElementById('contexto-tecnico')?.checked,
            personal: document.getElementById('contexto-personal')?.checked
        };

        // Crear el mensaje para Crisla
        const mensajeCrisla = {
            id: Date.now(),
            tenant_id: this.tenantSlug || 'cliente_general',
            fecha: new Date().toISOString(),
            emocion: emocion || 'no-especificada',
            mensaje: mensaje.trim(),
            contexto,
            tipo: 'apoyo_emocional',
            estado: 'pendiente',
            prioridad: emocion === 'critico' ? 'alta' : 'normal',
            desde: 'diario_emocional'
        };

        // Guardar en localStorage para que aparezca en el panel de Crisla
        const mensajesExistentes = JSON.parse(localStorage.getItem('cresalia_mensajes_apoyo') || '[]');
        mensajesExistentes.push(mensajeCrisla);
        localStorage.setItem('cresalia_mensajes_apoyo', JSON.stringify(mensajesExistentes));

        // Cerrar modal
        document.querySelector('.modal-escribir-crisla')?.remove();
        
        // Mostrar confirmación
        this.mostrarConfirmacionMensaje({
            mensaje: "Tu mensaje fue enviado a Crisla",
            respuesta: "Te voy a responder personalmente en las próximas horas 💜"
        });

        // Notificar a Crisla si el panel está abierto
        this.notificarNuevoMensaje(mensajeCrisla);
    }

    // Notificar nuevo mensaje a Crisla
    notificarNuevoMensaje(mensaje) {
        // Crear notificación
        const notificacion = {
            id: Date.now(),
            tipo: 'nuevo_mensaje_apoyo',
            titulo: '💜 Nuevo Mensaje de Apoyo',
            mensaje: `Mensaje de ${mensaje.tenant_id}: ${mensaje.mensaje.substring(0, 50)}...`,
            prioridad: mensaje.prioridad,
            fecha: new Date().toISOString(),
            datos: mensaje
        };

        // Guardar notificación
        const notificacionesExistentes = JSON.parse(localStorage.getItem('crisla_notificaciones') || '[]');
        notificacionesExistentes.push(notificacion);
        localStorage.setItem('crisla_notificaciones', JSON.stringify(notificacionesExistentes));

        // Mostrar notificación visual si el panel está abierto
        if (window.crislaPanelAbierto) {
            this.mostrarNotificacionVisual(notificacion);
        }
    }

    // Mostrar notificación visual
    mostrarNotificacionVisual(notificacion) {
        const notificationEl = document.createElement('div');
        notificationEl.className = 'notificacion-crisla';
        notificationEl.innerHTML = `
            <div class="notificacion-content">
                <div class="notificacion-icon">💜</div>
                <div class="notificacion-text">
                    <strong>${notificacion.titulo}</strong>
                    <p>${notificacion.mensaje}</p>
                </div>
                <button class="notificacion-cerrar" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Agregar estilos si no existen
        if (!document.querySelector('#notificaciones-crisla-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notificaciones-crisla-styles';
            styles.textContent = `
                .notificacion-crisla {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #7C3AED, #EC4899);
                    color: white;
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3);
                    z-index: 10001;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 400px;
                }

                .notificacion-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .notificacion-icon {
                    font-size: 24px;
                }

                .notificacion-text {
                    flex: 1;
                }

                .notificacion-text strong {
                    display: block;
                    margin-bottom: 5px;
                }

                .notificacion-text p {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 14px;
                }

                .notificacion-cerrar {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                }

                .notificacion-cerrar:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notificationEl);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notificationEl.parentElement) {
                notificationEl.remove();
            }
        }, 5000);
    }

    // Confirmación de mensaje enviado
    mostrarConfirmacionMensaje(data) {
        const modal = document.createElement('div');
        modal.className = 'modal-confirmacion';
        modal.innerHTML = `
            <div class="confirmacion-content">
                <div class="confirmacion-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Mensaje Recibido 💜</h2>
                <p>Crisla recibió tu mensaje y va a responderte pronto.</p>
                
                ${data.urgencia === 'critica' ? `
                    <div class="urgencia-critica-nota">
                        <i class="fas fa-heart"></i>
                        <p><strong>Nota especial</strong>: Vi que estás pasando un momento muy difícil. 
                        Voy a responderte <strong>hoy mismo</strong>. 
                        No estás solo/a. 💜</p>
                    </div>
                ` : ''}

                <div class="recursos-inmediatos">
                    <p>Mientras esperás, estos recursos pueden ayudarte:</p>
                    <ul>
                        ${data.recursos.map(r => `<li><a href="${r.url}" target="_blank">${r.titulo}</a></li>`).join('')}
                    </ul>
                </div>

                <button class="btn-entendido" onclick="this.closest('.modal-confirmacion').remove()">
                    Entendido 💜
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Nueva entrada en diario
    nuevaEntrada() {
        const modal = document.createElement('div');
        modal.className = 'modal-nueva-entrada';
        modal.innerHTML = `
            <div class="entrada-content">
                <div class="entrada-header">
                    <h2>
                        <i class="fas fa-book-open"></i>
                        Nueva Entrada en Tu Diario
                    </h2>
                    <button class="btn-cerrar" onclick="this.closest('.modal-nueva-entrada').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="entrada-body">
                    <div class="entrada-fecha">
                        <i class="fas fa-calendar"></i>
                        ${new Date().toLocaleDateString('es-AR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>

                    <!-- Estado de ánimo -->
                    <div class="entrada-humor">
                        <label>¿Cómo te sentís hoy?</label>
                        <div class="humor-selector">
                            <button class="humor-btn" data-humor="1" onclick="window.diarioEmocional.seleccionarHumor(1, this)">😭</button>
                            <button class="humor-btn" data-humor="2" onclick="window.diarioEmocional.seleccionarHumor(2, this)">😢</button>
                            <button class="humor-btn" data-humor="3" onclick="window.diarioEmocional.seleccionarHumor(3, this)">😐</button>
                            <button class="humor-btn" data-humor="4" onclick="window.diarioEmocional.seleccionarHumor(4, this)">🙂</button>
                            <button class="humor-btn" data-humor="5" onclick="window.diarioEmocional.seleccionarHumor(5, this)">😊</button>
                        </div>
                    </div>

                    <!-- Área de escritura -->
                    <div class="entrada-escritura">
                        <label>Escribí lo que sentís:</label>
                        <textarea 
                            id="entrada-texto"
                            class="entrada-textarea"
                            rows="12"
                            placeholder="Este es tu espacio seguro. Escribí lo que quieras, sin miedo..."
                        ></textarea>
                    </div>

                    <!-- Reflexión guiada (opcional) -->
                    <details class="reflexion-guiada">
                        <summary>💡 Guía de reflexión (opcional)</summary>
                        <div class="preguntas-guia">
                            <div class="guia-header">
                                <div class="guia-icon">
                                    <i class="fas fa-lightbulb"></i>
                                </div>
                                <div class="guia-title">
                                    <h4>Preguntas que pueden inspirarte</h4>
                                    <p>No tenés que responder todas, elegí las que te resuenen 💜</p>
                                </div>
                            </div>
                            <div class="preguntas-grid">
                                <div class="pregunta-item">
                                    <div class="pregunta-icon">🌟</div>
                                    <div class="pregunta-text">¿Qué pasó hoy que te hizo sentir así?</div>
                                </div>
                                <div class="pregunta-item">
                                    <div class="pregunta-icon">📚</div>
                                    <div class="pregunta-text">¿Qué aprendiste hoy?</div>
                                </div>
                                <div class="pregunta-item">
                                    <div class="pregunta-icon">🙏</div>
                                    <div class="pregunta-text">¿Por qué cosa estás agradecido/a hoy?</div>
                                </div>
                                <div class="pregunta-item">
                                    <div class="pregunta-icon">🚀</div>
                                    <div class="pregunta-text">¿Qué vas a hacer diferente mañana?</div>
                                </div>
                                <div class="pregunta-item">
                                    <div class="pregunta-icon">💝</div>
                                    <div class="pregunta-text">¿Qué necesitás para sentirte mejor?</div>
                                </div>
                            </div>
                        </div>
                    </details>

                    <!-- Botones -->
                    <div class="entrada-actions">
                        <button class="btn-cancelar" onclick="this.closest('.modal-nueva-entrada').remove()">
                            Cancelar
                        </button>
                        <button class="btn-guardar-entrada" onclick="window.diarioEmocional.guardarEntrada()">
                            <i class="fas fa-save"></i>
                            Guardar Entrada
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Seleccionar humor
    seleccionarHumor(nivel, btn) {
        document.querySelectorAll('.humor-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.humorSeleccionado = nivel;
    }

    // Guardar entrada
    guardarEntrada() {
        const texto = document.getElementById('entrada-texto').value;
        const humor = this.humorSeleccionado;

        if (!texto.trim()) {
            alert('Escribí algo primero 💜');
            return;
        }

        const entrada = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            humor: humor || 3,
            texto,
            palabras: texto.split(/\s+/).length
        };

        this.entradas.unshift(entrada); // Agregar al principio
        this.guardarEntradas();

        // Cerrar modal
        document.querySelector('.modal-nueva-entrada')?.remove();

        // Confirmación
        this.mostrarNotificacion('💜 Entrada guardada en tu diario', 'success');

        // Actualizar interfaz
        this.actualizarInterfaz();
    }

    // Ver logros
    verLogros() {
        // Crear modal de logros
        const modal = document.createElement('div');
        modal.className = 'modal-logros';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="logros-content" style="
                background: white;
                border-radius: 20px;
                max-width: 700px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 25px 80px rgba(0,0,0,0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
                padding: 25px;
            ">
                <div class="logros-header" style="text-align: center; margin-bottom: 25px;">
                    <h2 style="color: #7C3AED; margin: 0 0 10px 0;">
                        <i class="fas fa-trophy"></i>
                        Tus Logros
                    </h2>
                    <p style="color: #6B7280; margin: 0;">Celebremos juntos tus éxitos 💜</p>
                </div>
                
                <div class="logros-grid" style="display: grid; gap: 15px;">
                    <div class="logro-item" style="
                        background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                        border: 2px solid #F9A8D4;
                        border-radius: 15px;
                        padding: 20px;
                        text-align: center;
                    ">
                        <div style="font-size: 48px; margin-bottom: 10px;">🎯</div>
                        <h4 style="color: #7C3AED; margin: 0 0 8px 0;">Primer Producto</h4>
                        <p style="color: #6B7280; margin: 0; font-size: 14px;">Subiste tu primer producto</p>
                        <div style="margin-top: 10px;">
                            <span style="background: #10B981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                                ✅ Completado
                            </span>
                        </div>
                    </div>
                    
                    <div class="logro-item" style="
                        background: linear-gradient(135deg, #FEF3C7, #FDE68A);
                        border: 2px solid #F59E0B;
                        border-radius: 15px;
                        padding: 20px;
                        text-align: center;
                    ">
                        <div style="font-size: 48px; margin-bottom: 10px;">💜</div>
                        <h4 style="color: #7C3AED; margin: 0 0 8px 0;">Primera Entrada</h4>
                        <p style="color: #6B7280; margin: 0; font-size: 14px;">Escribiste en tu diario emocional</p>
                        <div style="margin-top: 10px;">
                            <span style="background: #10B981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                                ✅ Completado
                            </span>
                        </div>
                    </div>
                    
                    <div class="logro-item" style="
                        background: linear-gradient(135deg, #E0F2FE, #B3E5FC);
                        border: 2px solid #0EA5E9;
                        border-radius: 15px;
                        padding: 20px;
                        text-align: center;
                    ">
                        <div style="font-size: 48px; margin-bottom: 10px;">🚀</div>
                        <h4 style="color: #7C3AED; margin: 0 0 8px 0;">Emprendedor Activo</h4>
                        <p style="color: #6B7280; margin: 0; font-size: 14px;">Usaste tu espacio personal por 7 días</p>
                        <div style="margin-top: 10px;">
                            <span style="background: #6B7280; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                                🔄 En progreso
                            </span>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                    <button onclick="cerrarModalLogros()" style="
                        background: #7C3AED;
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-check"></i> Entendido
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animación de apertura
        setTimeout(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.logros-content');
            if (content) {
                content.style.transform = 'scale(1)';
            }
        }, 10);
        
        // Cerrar al hacer click fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModalLogros();
            }
        });
    }
    
    // Función para cerrar modal de logros
    cerrarModalLogros() {
        const modal = document.querySelector('.modal-logros');
        if (modal) {
            modal.style.opacity = '0';
            const content = modal.querySelector('.logros-content');
            if (content) {
                content.style.transform = 'scale(0.9)';
            }
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Recursos de crisis
    mostrarRecursosCrisis() {
        const modal = document.createElement('div');
        modal.className = 'modal-crisis';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        modal.innerHTML = `
            <div class="crisis-content" style="
                background: white;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 25px 80px rgba(0,0,0,0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            ">
                <div class="crisis-header">
                    <i class="fas fa-life-ring"></i>
                    <h2>Recursos de Ayuda Inmediata</h2>
                </div>

                <div class="crisis-body">
                    <div class="crisis-importante">
                        <p><strong>Si estás en crisis:</strong></p>
                    </div>

                    <div class="recursos-urgentes">
                        <div class="recurso-item urgente">
                            <i class="fas fa-phone"></i>
                            <div>
                                <h4>Centro de Salud Mental (Argentina)</h4>
                                <p class="telefono">135 (línea gratuita 24/7)</p>
                            </div>
                        </div>

                        <div class="recurso-item urgente">
                            <i class="fas fa-phone"></i>
                            <div>
                                <h4>Emergencias de Salud Mental</h4>
                                <p class="telefono">(011) 5275-1135 / 0800-999-0091</p>
                            </div>
                        </div>

                        <div class="recurso-item">
                            <i class="fas fa-hospital"></i>
                            <div>
                                <h4>Hospital Más Cercano</h4>
                                <p>Guardia de salud mental disponible 24/7</p>
                            </div>
                        </div>
                    </div>

                    <div class="crisis-nota">
                        <p>💜 <strong>Crisla también está acá</strong>. 
                        Escribime y te voy a responder lo más rápido posible.
                        Pero si es urgente, por favor llamá a los números de arriba primero.</p>
                    </div>

                    <button class="btn-escribir-crisla-crisis" onclick="window.diarioEmocional.escribirACrisla(); this.closest('.modal-crisis').remove();">
                        <i class="fas fa-envelope"></i>
                        Escribir a Crisla
                    </button>

                    <button class="btn-cerrar-crisis" onclick="this.closest('.modal-crisis').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animación de apertura
        setTimeout(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.crisis-content');
            if (content) {
                content.style.transform = 'scale(1)';
            }
        }, 10);
        
        // Cerrar al hacer click fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModalCrisis();
            }
        });
    }
    
    // Función para cerrar modal de crisis
    cerrarModalCrisis() {
        const modal = document.querySelector('.modal-crisis');
        if (modal) {
            modal.style.opacity = '0';
            const content = modal.querySelector('.crisis-content');
            if (content) {
                content.style.transform = 'scale(0.9)';
            }
            setTimeout(() => modal.remove(), 300);
        }
    }

    // Render estadísticas emocionales
    renderEstadisticas() {
        if (this.entradas.length === 0) {
            return '<p class="no-entradas">Aún no tenés entradas en tu diario</p>';
        }

        const humorPromedio = this.calcularHumorPromedio();
        const diasConsecutivos = this.calcularRachaEscritura();
        const palabrasTotales = this.entradas.reduce((sum, e) => sum + (e.palabras || 0), 0);

        return `
            <div class="stat-item">
                <div class="stat-icon">
                    <i class="fas fa-smile"></i>
                </div>
                <div class="stat-info">
                    <h4>${this.getEmojiHumor(humorPromedio)}</h4>
                    <p>Estado promedio</p>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon">
                    <i class="fas fa-fire"></i>
                </div>
                <div class="stat-info">
                    <h4>${diasConsecutivos} días</h4>
                    <p>Racha de escritura</p>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon">
                    <i class="fas fa-book"></i>
                </div>
                <div class="stat-info">
                    <h4>${this.entradas.length}</h4>
                    <p>Entradas totales</p>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon">
                    <i class="fas fa-pen"></i>
                </div>
                <div class="stat-info">
                    <h4>${palabrasTotales}</h4>
                    <p>Palabras escritas</p>
                </div>
            </div>

            <!-- Sección de recomendaciones de crecimiento -->
            <div class="recomendaciones-crecimiento">
                <button class="btn-recomendaciones" onclick="window.diarioEmocional.mostrarRecomendaciones()">
                    <i class="fas fa-lightbulb"></i>
                    Ideas para Crecer
                </button>
            </div>
        `;
    }

    // Render entradas recientes
    renderEntradasRecientes() {
        if (this.entradas.length === 0) {
            return `
                <div class="primera-entrada">
                    <div class="primera-entrada-glow"></div>
                    <div class="primera-entrada-content">
                        <div class="primera-entrada-icon">
                            <i class="fas fa-feather"></i>
                            <div class="icon-sparkle">✨</div>
                        </div>
                        <h4>¡Empezá tu diario hoy!</h4>
                        <p>Escribí tu primera entrada y comenzá este hermoso viaje de autoconocimiento y crecimiento personal.</p>
                        <div class="primera-entrada-benefits">
                            <div class="benefit-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Procesá tus emociones</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Encontrá claridad</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-check-circle"></i>
                                <span>Celebrá tus logros</span>
                            </div>
                        </div>
                        <button class="btn-primera-entrada" onclick="window.diarioEmocional.nuevaEntrada()">
                            <i class="fas fa-pen"></i>
                            <span>Escribir Primera Entrada</span>
                            <div class="btn-sparkle">💜</div>
                        </button>
                    </div>
                </div>
            `;
        }

        return this.entradas.slice(0, 5).map(entrada => `
            <div class="entrada-preview" onclick="window.diarioEmocional.verEntrada(${entrada.id})">
                <div class="entrada-preview-header">
                    <span class="entrada-humor">${this.getEmojiHumor(entrada.humor)}</span>
                    <span class="entrada-fecha">${this.formatearFecha(entrada.fecha)}</span>
                </div>
                <p class="entrada-preview-texto">
                    ${entrada.texto.substring(0, 150)}${entrada.texto.length > 150 ? '...' : ''}
                </p>
            </div>
        `).join('');
    }

    // Helpers
    calcularHumorPromedio() {
        if (this.entradas.length === 0) return 3;
        const suma = this.entradas.reduce((sum, e) => sum + (e.humor || 3), 0);
        return Math.round(suma / this.entradas.length);
    }

    getEmojiHumor(nivel) {
        const emojis = ['😭', '😢', '😐', '🙂', '😊'];
        return emojis[nivel - 1] || '😐';
    }

    formatearFecha(isoString) {
        const fecha = new Date(isoString);
        const ahora = new Date();
        const diffDias = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));

        if (diffDias === 0) return 'Hoy';
        if (diffDias === 1) return 'Ayer';
        if (diffDias < 7) return `Hace ${diffDias} días`;
        return fecha.toLocaleDateString();
    }

    calcularRachaEscritura() {
        // Calcular días consecutivos escribiendo
        let racha = 0;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        for (let i = 0; i < this.entradas.length; i++) {
            const fechaEntrada = new Date(this.entradas[i].fecha);
            fechaEntrada.setHours(0, 0, 0, 0);
            
            const diffDias = Math.floor((hoy - fechaEntrada) / (1000 * 60 * 60 * 24));
            
            if (diffDias === racha) {
                racha++;
            } else {
                break;
            }
        }

        return racha;
    }

    // Notificación
    mostrarNotificacion(mensaje, tipo = 'info') {
        const notif = document.createElement('div');
        notif.className = `diario-notificacion ${tipo}`;
        notif.textContent = mensaje;
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    actualizarInterfaz() {
        document.getElementById('stats-emocionales').innerHTML = this.renderEstadisticas();
        document.getElementById('lista-entradas').innerHTML = this.renderEntradasRecientes();
    }

    // Obtener métricas del tenant (para contexto)
    async obtenerMetricasTenant() {
        try {
            const response = await fetch(`/api/stats/${this.tenantSlug}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error obteniendo métricas:', error);
        }
        return null;
    }

    // Estilos
    getStyles() {
        return `
        <style>
            /* Contenedor principal */
            .diario-emocional-container {
                min-height: 100vh;
                background: linear-gradient(135deg, #FDF2F8, #F5F3FF);
                padding: 40px 20px;
            }

            .diario-wrapper {
                max-width: 1000px;
                margin: 0 auto;
            }

            /* Header */
            .diario-header {
                text-align: center;
                margin-bottom: 48px;
                animation: fadeIn 0.6s ease;
            }

            .diario-header h1 {
                font-size: 42px;
                color: #1F2937;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
            }

            .diario-header h1 i {
                color: #EC4899;
                animation: pulse 2s infinite;
            }

            .diario-subtitle {
                font-size: 18px;
                color: #6B7280;
                margin-bottom: 8px;
            }

            .diario-firma {
                font-size: 16px;
                color: #7C3AED;
                font-weight: 600;
                font-style: italic;
            }

            /* Botón de desahogo principal */
            .boton-desahogo-container {
                margin-bottom: 40px;
                animation: slideInLeft 0.8s ease;
            }

            .btn-desahogo-principal {
                width: 100%;
                background: linear-gradient(135deg, #EC4899, #F472B6);
                border: none;
                border-radius: 20px;
                padding: 32px;
                display: flex;
                align-items: center;
                gap: 24px;
                cursor: pointer;
                box-shadow: 0 8px 32px rgba(236, 72, 153, 0.4);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .btn-desahogo-principal::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                transition: left 0.5s;
            }

            .btn-desahogo-principal:hover::before {
                left: 100%;
            }

            .btn-desahogo-principal:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 48px rgba(236, 72, 153, 0.5);
            }

            .btn-desahogo-icon {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .btn-desahogo-icon i {
                font-size: 40px;
                color: white;
            }

            .btn-desahogo-text {
                text-align: left;
                color: white;
            }

            .btn-desahogo-text h3 {
                font-size: 28px;
                margin: 0 0 8px 0;
            }

            .btn-desahogo-text p {
                font-size: 16px;
                margin: 0;
                opacity: 0.95;
            }

            /* Opciones rápidas */
            .opciones-rapidas {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
            }

            .opcion-card {
                background: white;
                border: none;
                border-radius: 16px;
                padding: 28px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                text-align: center;
            }

            .opcion-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 12px 32px rgba(124, 58, 237, 0.2);
            }

            .opcion-card i {
                font-size: 48px;
                color: #7C3AED;
                margin-bottom: 16px;
                display: block;
            }

            .opcion-card span {
                display: block;
                font-size: 18px;
                font-weight: 700;
                color: #1F2937;
                margin-bottom: 8px;
            }

            .opcion-card small {
                color: #6B7280;
                font-size: 14px;
            }

            /* Modal de desahogo */
            .modal-desahogo {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .modal-desahogo-content {
                background: white;
                border-radius: 24px;
                max-width: 700px;
                width: 95%;
                max-height: 90vh;
                overflow-y: auto;
            }

            .modal-header {
                background: linear-gradient(135deg, #EC4899, #F472B6);
                color: white;
                padding: 32px;
                border-radius: 24px 24px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-header h2 {
                margin: 0;
                font-size: 28px;
            }

            .btn-cerrar {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-cerrar:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .modal-body {
                padding: 40px;
            }

            .mensaje-calido {
                font-size: 16px;
                line-height: 1.8;
                color: #374151;
                margin-bottom: 20px;
                text-align: center;
            }

            /* Opciones de desahogo */
            .opciones-desahogo {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-top: 32px;
            }

            .opcion-desahogo {
                background: #F9FAFB;
                border: 2px solid #E5E7EB;
                border-radius: 16px;
                padding: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 20px;
                text-align: left;
            }

            .opcion-desahogo:hover {
                border-color: #7C3AED;
                background: #F5F3FF;
                transform: translateX(8px);
            }

            .opcion-desahogo.fuentes:hover {
                border-color: #F59E0B;
                background: #FEF3C7;
            }

            .opcion-desahogo.mensaje:hover {
                border-color: #EC4899;
                background: #FCE7F3;
            }

            .opcion-desahogo.crisis:hover {
                border-color: #EF4444;
                background: #FEE2E2;
            }

            .opcion-icon {
                width: 64px;
                height: 64px;
                background: white;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .opcion-desahogo.fuentes .opcion-icon {
                background: linear-gradient(135deg, #F59E0B, #FCD34D);
            }

            .opcion-desahogo.mensaje .opcion-icon {
                background: linear-gradient(135deg, #EC4899, #F472B6);
            }

            .opcion-desahogo.crisis .opcion-icon {
                background: linear-gradient(135deg, #EF4444, #F87171);
            }

            .opcion-icon i {
                font-size: 32px;
                color: white;
            }

            .opcion-content {
                flex: 1;
            }

            .opcion-content h4 {
                font-size: 18px;
                margin: 0 0 8px 0;
                color: #1F2937;
            }

            .opcion-content p {
                margin: 0;
                color: #6B7280;
                font-size: 14px;
            }

            .opcion-arrow {
                color: #9CA3AF;
                font-size: 20px;
                transition: all 0.3s;
            }

            .opcion-desahogo:hover .opcion-arrow {
                transform: translateX(4px);
                color: #1F2937;
            }

            /* Selector de emociones */
            .selector-emocion {
                margin: 24px 0;
            }

            .selector-emocion label {
                display: block;
                font-weight: 600;
                color: #1F2937;
                margin-bottom: 12px;
            }

            .emociones-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
            }

            .emocion-btn {
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                padding: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }

            .emocion-btn:hover {
                border-color: #7C3AED;
                transform: translateY(-2px);
            }

            .emocion-btn.selected {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                border-color: transparent;
                color: white;
            }

            .emocion-emoji {
                font-size: 32px;
            }

            .emocion-label {
                font-size: 13px;
                font-weight: 600;
            }

            .emocion-btn.selected .emocion-label {
                color: white;
            }

            /* Área de mensaje */
            .mensaje-area {
                margin: 24px 0;
            }

            .mensaje-textarea {
                width: 100%;
                padding: 16px;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                font-family: inherit;
                font-size: 15px;
                line-height: 1.6;
                resize: vertical;
                transition: all 0.2s;
            }

            .mensaje-textarea:focus {
                outline: none;
                border-color: #7C3AED;
                box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
            }

            /* Notificación */
            .diario-notificacion {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                z-index: 10001;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .diario-notificacion.show {
                transform: translateY(0);
                opacity: 1;
            }

            .diario-notificacion.success {
                border-left: 4px solid #10B981;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .emociones-grid {
                    grid-template-columns: repeat(2, 1fr);
                }

                .opcion-desahogo {
                    flex-direction: column;
                    text-align: center;
                }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-40px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            /* Estilos para recomendaciones de crecimiento */
            .recomendaciones-crecimiento {
                margin-top: 30px;
                text-align: center;
            }

            .btn-recomendaciones {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
            }

            .btn-recomendaciones:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
                background: linear-gradient(135deg, #EC4899, #7C3AED);
            }

            .btn-recomendaciones i {
                margin-right: 8px;
            }

            /* Modal de recomendaciones */
            .modal-recomendaciones {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }

            .recomendaciones-content {
                background: white;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease-out;
            }

            .recomendaciones-header {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                color: white;
                padding: 25px 30px;
                border-radius: 20px 20px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .recomendaciones-header h2 {
                margin: 0;
                font-size: 24px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .btn-cerrar {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.3s ease;
            }

            .btn-cerrar:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .recomendaciones-body {
                padding: 30px;
            }

            .mensaje-motivacional {
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                padding: 25px;
                border-radius: 15px;
                margin-bottom: 25px;
                border: 2px solid #F9A8D4;
            }

            .mensaje-motivacional h3 {
                color: #7C3AED;
                margin: 0 0 15px 0;
                font-size: 20px;
            }

            .mensaje-motivacional p {
                color: #374151;
                margin: 0 0 15px 0;
                font-size: 16px;
                line-height: 1.6;
            }

            .accion-destacada {
                background: #7C3AED;
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                font-size: 14px;
            }

            .lista-sugerencias h4 {
                color: #1F2937;
                margin: 0 0 20px 0;
                font-size: 18px;
            }

            .lista-sugerencias ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .lista-sugerencias li {
                background: #F9FAFB;
                margin: 10px 0;
                padding: 15px 20px;
                border-radius: 12px;
                border-left: 4px solid #7C3AED;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: all 0.3s ease;
            }

            .lista-sugerencias li:hover {
                background: #F3F4F6;
                transform: translateX(5px);
            }

            .lista-sugerencias li i {
                color: #10B981;
                font-size: 16px;
            }

            .recomendaciones-footer {
                margin-top: 30px;
                padding-top: 25px;
                border-top: 2px solid #E5E7EB;
                text-align: center;
            }

            .mensaje-crisla {
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 20px;
                color: #374151;
                font-style: italic;
                border: 2px solid #F9A8D4;
            }

            .mensaje-crisla strong {
                color: #7C3AED;
            }

            .btn-nuevas-ideas {
                background: transparent;
                color: #7C3AED;
                border: 2px solid #7C3AED;
                padding: 12px 25px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-nuevas-ideas:hover {
                background: #7C3AED;
                color: white;
                transform: translateY(-2px);
            }

            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            /* Nuevos estilos mejorados */
            
            /* Header mejorado */
            .diario-header {
                position: relative;
                overflow: hidden;
            }

            .header-glow {
                position: absolute;
                top: -50%;
                left: 50%;
                transform: translateX(-50%);
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
                animation: headerGlow 3s ease-in-out infinite alternate;
            }

            .header-decoration {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
            }

            .decoration-line {
                width: 50px;
                height: 2px;
                background: linear-gradient(90deg, transparent, #EC4899, transparent);
            }

            .decoration-heart {
                font-size: 20px;
                animation: heartBeat 2s ease-in-out infinite;
            }

            /* Botón de desahogo mejorado */
            .btn-desahogo-wrapper {
                position: relative;
                display: inline-block;
            }

            .btn-desahogo-glow {
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                background: linear-gradient(45deg, #7C3AED, #EC4899, #7C3AED);
                border-radius: 25px;
                opacity: 0.3;
                filter: blur(15px);
                animation: desahogoGlow 2s ease-in-out infinite alternate;
            }

            .btn-desahogo-principal {
                position: relative;
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                border: none;
                border-radius: 20px;
                padding: 30px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);
                display: flex;
                align-items: center;
                gap: 25px;
                min-width: 400px;
                max-width: 500px;
                margin: 0 auto;
            }

            .btn-desahogo-principal:hover {
                transform: translateY(-5px) scale(1.02);
                box-shadow: 0 15px 35px rgba(124, 58, 237, 0.4);
            }

            .btn-desahogo-icon {
                position: relative;
                font-size: 3rem;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                backdrop-filter: blur(10px);
            }

            .icon-pulse {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                animation: iconPulse 2s ease-in-out infinite;
            }

            .btn-desahogo-text h3 {
                margin: 0 0 8px 0;
                font-size: 1.5rem;
                font-weight: 700;
            }

            .btn-desahogo-text p {
                margin: 0 0 8px 0;
                font-size: 1.1rem;
                opacity: 0.9;
            }

            .btn-subtitle {
                font-size: 0.9rem;
                opacity: 0.8;
                font-style: italic;
            }

            /* Opciones rápidas mejoradas */
            .opcion-card-wrapper {
                position: relative;
                display: inline-block;
            }

            .opcion-card {
                background: white;
                border: 2px solid #F3F4F6;
                border-radius: 20px;
                padding: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                display: flex;
                align-items: center;
                gap: 20px;
                min-height: 120px;
                width: 100%;
                text-align: left;
            }

            .opcion-card:hover {
                transform: translateY(-8px);
                border-color: #EC4899;
                box-shadow: 0 12px 30px rgba(236, 72, 153, 0.2);
            }

            .opcion-icon {
                position: relative;
                font-size: 2.5rem;
                color: #7C3AED;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                border-radius: 50%;
                flex-shrink: 0;
            }

            .opcion-glow {
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #7C3AED, #EC4899);
                border-radius: 50%;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .opcion-card:hover .opcion-glow {
                opacity: 0.1;
                filter: blur(10px);
            }

            .opcion-content {
                flex: 1;
            }

            .opcion-content h4 {
                margin: 0 0 8px 0;
                font-size: 1.2rem;
                font-weight: 600;
                color: #1F2937;
            }

            .opcion-content p {
                margin: 0 0 12px 0;
                color: #6B7280;
                font-size: 0.95rem;
                line-height: 1.4;
            }

            .opcion-stats {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
            }

            .entradas-count, .resource-tag, .progress-tag {
                background: linear-gradient(135deg, #F3F4F6, #E5E7EB);
                color: #374151;
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 500;
            }

            .progress-dots {
                font-size: 0.8rem;
                color: #EC4899;
            }

            /* Entradas recientes mejoradas */
            .entradas-header {
                text-align: center;
                margin-bottom: 30px;
                position: relative;
            }

            .entradas-header h3 {
                font-size: 1.8rem;
                color: #1F2937;
                margin: 0 0 15px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }

            .entradas-decoration {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin-bottom: 20px;
            }

            .entradas-decoration .decoration-line {
                width: 40px;
                height: 2px;
                background: linear-gradient(90deg, transparent, #7C3AED, transparent);
            }

            .btn-nueva-entrada {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                margin: 0 auto;
                box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
            }

            .btn-nueva-entrada:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
            }

            /* Primera entrada mejorada */
            .primera-entrada {
                position: relative;
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                border: 2px solid #F9A8D4;
                border-radius: 25px;
                padding: 40px;
                text-align: center;
                margin: 20px 0;
                overflow: hidden;
            }

            .primera-entrada-glow {
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
                animation: primeraEntradaGlow 3s ease-in-out infinite alternate;
            }

            .primera-entrada-content {
                position: relative;
                z-index: 2;
            }

            .primera-entrada-icon {
                position: relative;
                font-size: 4rem;
                color: #7C3AED;
                margin-bottom: 25px;
                display: inline-block;
            }

            .icon-sparkle {
                position: absolute;
                top: -10px;
                right: -10px;
                font-size: 1.5rem;
                animation: sparkle 2s ease-in-out infinite;
            }

            .primera-entrada h4 {
                font-size: 1.8rem;
                color: #1F2937;
                margin: 0 0 15px 0;
                font-weight: 700;
            }

            .primera-entrada p {
                font-size: 1.1rem;
                color: #6B7280;
                margin: 0 0 30px 0;
                line-height: 1.6;
                max-width: 500px;
                margin-left: auto;
                margin-right: auto;
            }

            .primera-entrada-benefits {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin: 30px 0;
                flex-wrap: wrap;
            }

            .benefit-item {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(255, 255, 255, 0.7);
                padding: 10px 20px;
                border-radius: 20px;
                font-weight: 500;
                color: #374151;
            }

            .benefit-item i {
                color: #10B981;
                font-size: 1.1rem;
            }

            .btn-primera-entrada {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                color: white;
                border: none;
                padding: 18px 35px;
                border-radius: 30px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 0 auto;
                box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
                position: relative;
                overflow: hidden;
            }

            .btn-primera-entrada:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 30px rgba(124, 58, 237, 0.5);
            }

            .btn-sparkle {
                position: absolute;
                top: 50%;
                right: 15px;
                transform: translateY(-50%);
                font-size: 1.2rem;
                animation: btnSparkle 1.5s ease-in-out infinite;
            }

            /* Animaciones */
            @keyframes headerGlow {
                0% { opacity: 0.3; transform: translateX(-50%) scale(1); }
                100% { opacity: 0.6; transform: translateX(-50%) scale(1.1); }
            }

            @keyframes heartBeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            @keyframes desahogoGlow {
                0% { opacity: 0.2; transform: scale(1); }
                100% { opacity: 0.4; transform: scale(1.05); }
            }

            @keyframes iconPulse {
                0% { transform: scale(1); opacity: 0.5; }
                100% { transform: scale(1.2); opacity: 0; }
            }

            @keyframes primeraEntradaGlow {
                0% { opacity: 0.1; transform: scale(1); }
                100% { opacity: 0.3; transform: scale(1.1); }
            }

            @keyframes sparkle {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.3); }
            }

            @keyframes btnSparkle {
                0%, 100% { opacity: 1; transform: translateY(-50%) rotate(0deg); }
                50% { opacity: 0.7; transform: translateY(-50%) rotate(180deg); }
            }

            /* Modal de escribir a Crisla */
            .modal-escribir-crisla {
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
                backdrop-filter: blur(5px);
            }

            .crisla-content {
                background: white;
                border-radius: 20px;
                max-width: 700px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease-out;
            }

            .crisla-header {
                background: linear-gradient(135deg, #EC4899, #F9A8D4);
                color: white;
                padding: 25px 30px;
                border-radius: 20px 20px 0 0;
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .crisla-avatar {
                font-size: 48px;
                opacity: 0.9;
            }

            .crisla-intro h2 {
                margin: 0 0 8px 0;
                font-size: 28px;
                font-weight: 700;
            }

            .crisla-estado {
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 16px;
                opacity: 0.9;
            }

            .status-dot {
                width: 10px;
                height: 10px;
                background: #10B981;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            .crisla-body {
                padding: 30px;
            }

            .mensaje-bienvenida {
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                padding: 25px;
                border-radius: 15px;
                margin-bottom: 25px;
                border: 2px solid #F9A8D4;
            }

            .mensaje-bienvenida p {
                margin: 0 0 10px 0;
                color: #7C3AED;
                font-size: 16px;
            }

            .mensaje-bienvenida p:last-child {
                margin-bottom: 0;
                font-weight: 600;
            }

            .selector-emocion {
                margin-bottom: 25px;
            }

            .selector-emocion label {
                display: block;
                margin-bottom: 15px;
                font-weight: 600;
                color: #1F2937;
            }

            .emociones-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 15px;
            }

            .emocion-btn {
                background: #F3F4F6;
                border: 2px solid #E5E7EB;
                border-radius: 15px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                text-align: center;
            }

            .emocion-btn:hover {
                background: #E5E7EB;
                transform: translateY(-2px);
            }

            .emocion-btn.selected {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                border-color: #7C3AED;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
            }

            .emocion-emoji {
                font-size: 24px;
            }

            .emocion-label {
                font-size: 14px;
                font-weight: 500;
            }

            .mensaje-area {
                margin-bottom: 25px;
            }

            .mensaje-area label {
                display: block;
                margin-bottom: 10px;
                font-weight: 600;
                color: #1F2937;
            }

            .mensaje-textarea {
                width: 100%;
                min-height: 150px;
                padding: 20px;
                border: 2px solid #E5E7EB;
                border-radius: 15px;
                font-size: 16px;
                line-height: 1.6;
                resize: vertical;
                transition: border-color 0.3s ease;
                font-family: inherit;
            }

            .mensaje-textarea:focus {
                outline: none;
                border-color: #7C3AED;
                box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
            }

            .char-count {
                text-align: right;
                margin-top: 8px;
                font-size: 14px;
                color: #6B7280;
            }

            .contexto-adicional {
                margin-bottom: 25px;
            }

            .contexto-adicional summary {
                cursor: pointer;
                font-weight: 600;
                color: #7C3AED;
                padding: 10px;
                border-radius: 10px;
                background: #FDF2F8;
                transition: background 0.3s ease;
            }

            .contexto-adicional summary:hover {
                background: #FCE7F3;
            }

            .contexto-fields {
                margin-top: 15px;
                padding: 15px;
                background: #F9FAFB;
                border-radius: 10px;
            }

            .contexto-fields label {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                font-size: 14px;
            }

            .contexto-fields label:last-child {
                margin-bottom: 0;
            }

            .privacidad-info {
                background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 25px;
                border: 2px solid #BBF7D0;
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .privacidad-info i {
                color: #059669;
                font-size: 20px;
            }

            .privacidad-info p {
                margin: 0;
                color: #065F46;
                font-size: 14px;
            }

            .modal-actions {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                padding-top: 20px;
                border-top: 2px solid #E5E7EB;
            }

            .btn-enviar-crisla {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
            }

            .btn-enviar-crisla:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
            }

            /* Modal de nueva entrada */
            .modal-nueva-entrada {
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
                backdrop-filter: blur(5px);
            }

            .entrada-content {
                background: white;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease-out;
            }

            .entrada-header {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                color: white;
                padding: 25px 30px;
                border-radius: 20px 20px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .entrada-header h2 {
                margin: 0;
                font-size: 24px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .entrada-body {
                padding: 30px;
            }

            .entrada-fecha {
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                padding: 15px 20px;
                border-radius: 15px;
                margin-bottom: 25px;
                border: 2px solid #F9A8D4;
                display: flex;
                align-items: center;
                gap: 10px;
                color: #7C3AED;
                font-weight: 500;
            }

            .entrada-humor {
                margin-bottom: 25px;
            }

            .entrada-humor label {
                display: block;
                margin-bottom: 15px;
                font-weight: 600;
                color: #1F2937;
            }

            .humor-selector {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .humor-btn {
                background: #F3F4F6;
                border: 2px solid #E5E7EB;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .humor-btn:hover {
                background: #E5E7EB;
                transform: scale(1.1);
            }

            .humor-btn.selected {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                border-color: #7C3AED;
                transform: scale(1.1);
                box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
            }

            .entrada-texto {
                margin-bottom: 25px;
            }

            .entrada-texto label {
                display: block;
                margin-bottom: 10px;
                font-weight: 600;
                color: #1F2937;
            }

            .entrada-texto textarea {
                width: 100%;
                min-height: 250px;
                padding: 25px;
                border: 3px solid #E5E7EB;
                border-radius: 20px;
                font-size: 16px;
                line-height: 1.7;
                resize: vertical;
                transition: all 0.3s ease;
                font-family: 'Poppins', sans-serif;
                background: linear-gradient(135deg, #FEFEFE, #F8FAFC);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                position: relative;
                overflow: hidden;
            }

            .entrada-texto textarea::placeholder {
                color: #9CA3AF;
                font-style: italic;
                font-weight: 400;
            }

            .entrada-texto textarea:focus {
                outline: none;
                border-color: #7C3AED;
                box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1), 0 8px 30px rgba(124, 58, 237, 0.15);
                background: linear-gradient(135deg, #FFFFFF, #FAFBFC);
                transform: translateY(-2px);
            }

            .entrada-texto textarea:hover {
                border-color: #D1D5DB;
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
            }

            /* Guía de reflexión mejorada */
            .reflexion-guiada {
                margin-bottom: 25px;
            }

            .reflexion-guiada summary {
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                border: 2px solid #F9A8D4;
                border-radius: 15px;
                padding: 18px 25px;
                cursor: pointer;
                font-weight: 600;
                color: #7C3AED;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 16px;
            }

            .reflexion-guiada summary:hover {
                background: linear-gradient(135deg, #FCE7F3, #F9A8D4);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
            }

            .reflexion-guiada[open] summary {
                border-radius: 15px 15px 0 0;
                border-bottom: none;
            }

            .preguntas-guia {
                background: linear-gradient(135deg, #F0F9FF, #E0F2FE);
                border: 2px solid #BAE6FD;
                border-top: none;
                border-radius: 0 0 15px 15px;
                padding: 25px;
                animation: slideDown 0.3s ease-out;
            }

            .guia-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #BAE6FD;
            }

            .guia-icon {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                color: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
                animation: pulse 2s infinite;
            }

            .guia-title h4 {
                margin: 0 0 5px 0;
                color: #0F172A;
                font-size: 18px;
                font-weight: 700;
            }

            .guia-title p {
                margin: 0;
                color: #475569;
                font-size: 14px;
                font-style: italic;
            }

            .preguntas-grid {
                display: grid;
                gap: 15px;
            }

            .pregunta-item {
                background: white;
                border: 2px solid #E2E8F0;
                border-radius: 12px;
                padding: 18px;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .pregunta-item:hover {
                border-color: #7C3AED;
                background: linear-gradient(135deg, #FEFEFE, #F8FAFC);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);
            }

            .pregunta-icon {
                font-size: 24px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
                border-radius: 50%;
                flex-shrink: 0;
            }

            .pregunta-text {
                color: #374151;
                font-size: 15px;
                font-weight: 500;
                line-height: 1.4;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            .entrada-actions {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                padding-top: 20px;
                border-top: 2px solid #E5E7EB;
            }

            .btn-cancelar {
                background: #6B7280;
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-cancelar:hover {
                background: #4B5563;
                transform: translateY(-2px);
            }

            .btn-guardar-entrada {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
            }

            .btn-guardar-entrada:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
            }

            /* Responsive */
            @media (max-width: 768px) {
                .btn-desahogo-principal {
                    flex-direction: column;
                    text-align: center;
                    min-width: auto;
                    max-width: 100%;
                }

                .primera-entrada-benefits {
                    flex-direction: column;
                    align-items: center;
                }

                .opcion-card {
                    flex-direction: column;
                    text-align: center;
                    min-height: auto;
                }

                .opcion-icon {
                    width: 60px;
                    height: 60px;
                    font-size: 2rem;
                }

                .entrada-content {
                    width: 95%;
                    margin: 20px;
                }

                .humor-selector {
                    gap: 10px;
                }

                .humor-btn {
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }

                .entrada-actions {
                    flex-direction: column;
                }
            }
        </style>
        `;
    }
}

// Inicializar globalmente
window.initDiarioEmocional = function(tenantSlug) {
    window.diarioEmocional = new DiarioEmocional(tenantSlug);
    return window.diarioEmocional;
};

// Funciones globales para cerrar modales
function cerrarModalFuentesAliento() {
    const modal = document.querySelector('.modal-fuentes-aliento');
    if (modal) {
        modal.style.opacity = '0';
        const content = modal.querySelector('.fuentes-content');
        if (content) {
            content.style.transform = 'scale(0.9)';
        }
        setTimeout(() => modal.remove(), 300);
    }
}

function cerrarModalCrisis() {
    const modal = document.querySelector('.modal-crisis');
    if (modal) {
        modal.style.opacity = '0';
        const content = modal.querySelector('.crisis-content');
        if (content) {
            content.style.transform = 'scale(0.9)';
        }
        setTimeout(() => modal.remove(), 300);
    }
}

function cerrarModalLogros() {
    const modal = document.querySelector('.modal-logros');
    if (modal) {
        modal.style.opacity = '0';
        const content = modal.querySelector('.logros-content');
        if (content) {
            content.style.transform = 'scale(0.9)';
        }
        setTimeout(() => modal.remove(), 300);
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DiarioEmocional };
}


