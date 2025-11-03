/**
 * 🌸 RECURSOS DE BIENESTAR EMOCIONAL - CRESALIA
 * Sistema de respiración, consejos y bienestar para emprendedores
 * Integrado con el sistema de respaldo emocional existente
 * Soporte multi-idioma (ES, EN, PT, FR, DE, IT)
 */

class RecursosBienestarEmocional {
    constructor(tenantSlug, idioma = 'es') {
        this.tenantSlug = tenantSlug;
        this.idioma = idioma;
        this.recursosCargados = false;
        this.audioContext = null;
        this.audioActual = null;
        
        // Inicializar recursos
        this.init();
    }

    // Inicializar sistema
    async init() {
        console.log('🌸 Inicializando Recursos de Bienestar Emocional');
        await this.cargarRecursos();
        this.recursosCargados = true;
    }

    // Cargar recursos según idioma
    async cargarRecursos() {
        this.recursos = {
            respiracion: this.getRecursosRespiracion(),
            consejos: this.getConsejosBienestar(),
            meditacion: this.getMeditaciones(),
            ejercicios: this.getEjercicios(),
            musica: this.getMusicaRelajante()
        };
    }

    // ==================== RECURSOS DE RESPIRACIÓN ====================
    
    getRecursosRespiracion() {
        const textos = {
            es: {
                titulo: "Técnicas de Respiración",
                descripcion: "Ejercicios simples para calmar la mente y reducir el estrés",
                ejercicios: [
                    {
                        nombre: "Respiración 4-7-8",
                        descripcion: "Técnica para reducir ansiedad y estrés",
                        instrucciones: [
                            "Inhalá por la nariz contando hasta 4",
                            "Mantené el aire contando hasta 7", 
                            "Exhalá por la boca contando hasta 8",
                            "Repetí 4 veces"
                        ],
                        duracion: "4 minutos",
                        beneficios: "Reduce ansiedad, mejora el sueño, calma la mente"
                    },
                    {
                        nombre: "Respiración Cuadrada",
                        descripcion: "Técnica para centrar la atención",
                        instrucciones: [
                            "Inhalá por 4 segundos",
                            "Mantené por 4 segundos",
                            "Exhalá por 4 segundos", 
                            "Esperá por 4 segundos",
                            "Repetí el ciclo"
                        ],
                        duracion: "5 minutos",
                        beneficios: "Mejora concentración, reduce estrés, equilibra emociones"
                    },
                    {
                        nombre: "Respiración de Coherencia",
                        descripcion: "Sincroniza corazón y respiración",
                        instrucciones: [
                            "Respirá lenta y profundamente",
                            "6 respiraciones por minuto",
                            "5 segundos inhalar, 5 exhalar",
                            "Mantené ritmo constante"
                        ],
                        duracion: "10 minutos",
                        beneficios: "Reduce cortisol, mejora estado de ánimo, aumenta energía"
                    }
                ]
            },
            en: {
                titulo: "Breathing Techniques",
                descripcion: "Simple exercises to calm the mind and reduce stress",
                ejercicios: [
                    {
                        nombre: "4-7-8 Breathing",
                        descripcion: "Technique to reduce anxiety and stress",
                        instrucciones: [
                            "Inhale through nose counting to 4",
                            "Hold breath counting to 7",
                            "Exhale through mouth counting to 8", 
                            "Repeat 4 times"
                        ],
                        duracion: "4 minutes",
                        beneficios: "Reduces anxiety, improves sleep, calms mind"
                    }
                ]
            },
            pt: {
                titulo: "Técnicas de Respiração",
                descripcion: "Exercícios simples para acalmar a mente e reduzir o estresse",
                ejercicios: [
                    {
                        nombre: "Respiração 4-7-8",
                        descripcion: "Técnica para reduzir ansiedade e estresse",
                        instrucciones: [
                            "Inale pelo nariz contando até 4",
                            "Segure o ar contando até 7",
                            "Exale pela boca contando até 8",
                            "Repita 4 vezes"
                        ],
                        duracion: "4 minutos",
                        beneficios: "Reduz ansiedade, melhora o sono, acalma a mente"
                    }
                ]
            },
            fr: {
                titulo: "Techniques de Respiration",
                descripcion: "Exercices simples pour calmer l'esprit et réduire le stress",
                ejercicios: [
                    {
                        nombre: "Respiration 4-7-8",
                        descripcion: "Technique pour réduire l'anxiété et le stress",
                        instrucciones: [
                            "Inspirez par le nez en comptant jusqu'à 4",
                            "Retenez l'air en comptant jusqu'à 7",
                            "Expirez par la bouche en comptant jusqu'à 8",
                            "Répétez 4 fois"
                        ],
                        duracion: "4 minutes",
                        beneficios: "Réduit l'anxiété, améliore le sommeil, calme l'esprit"
                    }
                ]
            },
            de: {
                titulo: "Atemtechniken",
                descripcion: "Einfache Übungen, um den Geist zu beruhigen und Stress zu reduzieren",
                ejercicios: [
                    {
                        nombre: "4-7-8 Atmung",
                        descripcion: "Technik zur Reduzierung von Angst und Stress",
                        instrucciones: [
                            "Durch die Nase einatmen und bis 4 zählen",
                            "Luft anhalten und bis 7 zählen",
                            "Durch den Mund ausatmen und bis 8 zählen",
                            "4 mal wiederholen"
                        ],
                        duracion: "4 Minuten",
                        beneficios: "Reduziert Angst, verbessert Schlaf, beruhigt Geist"
                    }
                ]
            },
            it: {
                titulo: "Tecniche di Respirazione",
                descripcion: "Esercizi semplici per calmare la mente e ridurre lo stress",
                ejercicios: [
                    {
                        nombre: "Respirazione 4-7-8",
                        descripcion: "Tecnica per ridurre ansia e stress",
                        instrucciones: [
                            "Inspirare dal naso contando fino a 4",
                            "Trattenere il respiro contando fino a 7",
                            "Espirare dalla bocca contando fino a 8",
                            "Ripetere 4 volte"
                        ],
                        duracion: "4 minuti",
                        beneficios: "Riduce ansia, migliora sonno, calma mente"
                    }
                ]
            }
        };

        return textos[this.idioma] || textos.es;
    }

    // ==================== CONSEJOS DE BIENESTAR ====================
    
    getConsejosBienestar() {
        const textos = {
            es: {
                titulo: "Consejos de Bienestar",
                descripcion: "Pequeños cambios para mejorar tu día a día",
                categorias: [
                    {
                        nombre: "Manejo del Estrés",
                        consejos: [
                            "Tomá pausas de 5 minutos cada hora",
                            "Practicá respiración profunda 3 veces al día",
                            "Escribí 3 cosas por las que estés agradecido/a",
                            "Salí a caminar aunque sea 10 minutos",
                            "Limitá noticias negativas a 30 min/día"
                        ]
                    },
                    {
                        nombre: "Energía y Motivación",
                        consejos: [
                            "Empezá el día con un objetivo pequeño",
                            "Celebrá cada logro, por pequeño que sea",
                            "Recordá por qué empezaste tu negocio",
                            "Conectá con otros emprendedores",
                            "Visualizá tu éxito todos los días"
                        ]
                    },
                    {
                        nombre: "Salud Mental",
                        consejos: [
                            "Hablá con alguien sobre cómo te sentís",
                            "Practicá la autocompasión",
                            "Separá tu valor personal de tus ventas",
                            "Recordá que todos los emprendedores pasan por esto",
                            "Buscá ayuda profesional si lo necesitás"
                        ]
                    }
                ]
            },
            en: {
                titulo: "Wellness Tips",
                descripcion: "Small changes to improve your daily life",
                categorias: [
                    {
                        nombre: "Stress Management",
                        consejos: [
                            "Take 5-minute breaks every hour",
                            "Practice deep breathing 3 times a day",
                            "Write 3 things you're grateful for",
                            "Go for a walk even if just 10 minutes",
                            "Limit negative news to 30 min/day"
                        ]
                    }
                ]
            }
        };

        return textos[this.idioma] || textos.es;
    }

    // ==================== MEDITACIONES ====================
    
    getMeditaciones() {
        const textos = {
            es: {
                titulo: "Meditaciones Guiadas",
                descripcion: "Sesiones de meditación para emprendedores",
                sesiones: [
                    {
                        nombre: "Meditación Matutina",
                        duracion: "10 minutos",
                        descripcion: "Comienza tu día con claridad y propósito",
                        audio: null // Placeholder para futuras implementaciones
                    },
                    {
                        nombre: "Meditación para el Estrés",
                        duracion: "15 minutos", 
                        descripcion: "Alivia la tensión y recupera la calma",
                        audio: null
                    },
                    {
                        nombre: "Visualización de Éxito",
                        duracion: "20 minutos",
                        descripcion: "Imagina y materializa tus objetivos",
                        audio: null
                    }
                ]
            },
            en: {
                titulo: "Guided Meditations",
                descripcion: "Meditation sessions for entrepreneurs",
                sesiones: [
                    {
                        nombre: "Morning Meditation",
                        duracion: "10 minutes",
                        descripcion: "Start your day with clarity and purpose",
                        audio: null
                    }
                ]
            }
        };

        return textos[this.idioma] || textos.es;
    }

    // ==================== EJERCICIOS ====================
    
    getEjercicios() {
        const textos = {
            es: {
                titulo: "Ejercicios de Relajación",
                descripcion: "Movimientos suaves para liberar tensión",
                ejercicios: [
                    {
                        nombre: "Estiramiento de Cuello",
                        duracion: "5 minutos",
                        descripcion: "Libera tensión del cuello y hombros"
                    },
                    {
                        nombre: "Respiración con Movimiento",
                        duracion: "8 minutos", 
                        descripcion: "Combina respiración con movimientos suaves"
                    }
                ]
            },
            en: {
                titulo: "Relaxation Exercises",
                descripcion: "Gentle movements to release tension",
                ejercicios: [
                    {
                        nombre: "Neck Stretch",
                        duracion: "5 minutes",
                        descripcion: "Release neck and shoulder tension"
                    }
                ]
            }
        };

        return textos[this.idioma] || textos.es;
    }

    // ==================== MÚSICA RELAJANTE ====================
    
    getMusicaRelajante() {
        const textos = {
            es: {
                titulo: "Música Relajante",
                descripcion: "Sonidos para concentración y relajación",
                categorias: [
                    {
                        nombre: "Sonidos de la Naturaleza",
                        descripcion: "Lluvia, océano, bosque",
                        audio: null
                    },
                    {
                        nombre: "Música Instrumental",
                        descripcion: "Melodías suaves para concentración",
                        audio: null
                    },
                    {
                        nombre: "Frecuencias Binaurales",
                        descripcion: "Sonidos para estados específicos",
                        audio: null
                    }
                ]
            },
            en: {
                titulo: "Relaxing Music",
                descripcion: "Sounds for concentration and relaxation",
                categorias: [
                    {
                        nombre: "Nature Sounds",
                        descripcion: "Rain, ocean, forest",
                        audio: null
                    }
                ]
            }
        };

        return textos[this.idioma] || textos.es;
    }

    // ==================== INTERFAZ DE RECURSOS ====================
    
    mostrarPanelRecursos() {
        const modal = document.createElement('div');
        modal.className = 'modal-recursos-bienestar';
        modal.innerHTML = `
            <div class="recursos-content">
                <div class="recursos-header">
                    <h2>
                        <i class="fas fa-heart"></i>
                        ${this.recursos.respiracion.titulo}
                    </h2>
                    <button class="btn-cerrar" onclick="this.closest('.modal-recursos-bienestar').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="recursos-body">
                    <div class="recursos-nav">
                        <button class="nav-btn active" data-seccion="respiracion">
                            <i class="fas fa-lungs"></i>
                            ${this.recursos.respiracion.titulo}
                        </button>
                        <button class="nav-btn" data-seccion="consejos">
                            <i class="fas fa-lightbulb"></i>
                            ${this.recursos.consejos.titulo}
                        </button>
                        <button class="nav-btn" data-seccion="meditacion">
                            <i class="fas fa-leaf"></i>
                            Meditación
                        </button>
                    </div>

                    <div class="recursos-contenido" id="recursos-contenido">
                        ${this.renderSeccionRespiracion()}
                    </div>
                </div>
            </div>

            ${this.getStyles()}
        `;

        document.body.appendChild(modal);
        this.setupEventListeners(modal);
    }

    // Renderizar sección de respiración
    renderSeccionRespiracion() {
        const recursos = this.recursos.respiracion;
        
        return `
            <div class="seccion-respiracion">
                <div class="seccion-header">
                    <h3>${recursos.titulo}</h3>
                    <p>${recursos.descripcion}</p>
                </div>

                <div class="ejercicios-grid">
                    ${recursos.ejercicios.map((ejercicio, index) => `
                        <div class="ejercicio-card" data-ejercicio="${index}">
                            <div class="ejercicio-header">
                                <h4>${ejercicio.nombre}</h4>
                                <span class="duracion">${ejercicio.duracion}</span>
                            </div>
                            <p class="ejercicio-descripcion">${ejercicio.descripcion}</p>
                            <div class="ejercicio-beneficios">
                                <i class="fas fa-star"></i>
                                <span>${ejercicio.beneficios}</span>
                            </div>
                            <button class="btn-ejercicio" onclick="recursosBienestar.iniciarEjercicio(${index})">
                                <i class="fas fa-play"></i>
                                Comenzar
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Iniciar ejercicio de respiración
    iniciarEjercicio(indexEjercicio) {
        const ejercicio = this.recursos.respiracion.ejercicios[indexEjercicio];
        
        const modal = document.createElement('div');
        modal.className = 'modal-ejercicio-respiracion';
        modal.innerHTML = `
            <div class="ejercicio-content">
                <div class="ejercicio-header">
                    <h3>${ejercicio.nombre}</h3>
                    <button class="btn-cerrar" onclick="this.closest('.modal-ejercicio-respiracion').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="ejercicio-body">
                    <div class="instrucciones">
                        <h4>Instrucciones:</h4>
                        <ol>
                            ${ejercicio.instrucciones.map(instruccion => `
                                <li>${instruccion}</li>
                            `).join('')}
                        </ol>
                    </div>

                    <div class="visualizador-respiracion" id="visualizador-respiracion">
                        <div class="circulo-respiracion" id="circulo-respiracion">
                            <div class="circulo-interno">
                                <span class="estado-respiracion">Preparate</span>
                                <span class="contador-respiracion">0</span>
                            </div>
                        </div>
                    </div>

                    <div class="controles-ejercicio">
                        <button class="btn-iniciar" onclick="recursosBienestar.comenzarRespiracion(${indexEjercicio})">
                            <i class="fas fa-play"></i>
                            Iniciar
                        </button>
                        <button class="btn-pausar" onclick="recursosBienestar.pausarRespiracion()" style="display: none;">
                            <i class="fas fa-pause"></i>
                            Pausar
                        </button>
                        <button class="btn-detener" onclick="recursosBienestar.detenerRespiracion()">
                            <i class="fas fa-stop"></i>
                            Detener
                        </button>
                    </div>

                    <div class="progreso-ejercicio">
                        <div class="barra-progreso">
                            <div class="progreso-fill" id="progreso-fill"></div>
                        </div>
                        <span class="tiempo-restante" id="tiempo-restante">${ejercicio.duracion}</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Comenzar ejercicio de respiración
    comenzarRespiracion(indexEjercicio) {
        const ejercicio = this.recursos.respiracion.ejercicios[indexEjercicio];
        const circulo = document.getElementById('circulo-respiracion');
        const estado = document.querySelector('.estado-respiracion');
        const contador = document.querySelector('.contador-respiracion');
        const btnIniciar = document.querySelector('.btn-iniciar');
        const btnPausar = document.querySelector('.btn-pausar');

        // Configurar según el tipo de ejercicio
        let configuracion;
        if (ejercicio.nombre.includes('4-7-8')) {
            configuracion = { inhalar: 4, mantener: 7, exhalar: 8, pausa: 0 };
        } else if (ejercicio.nombre.includes('Cuadrada')) {
            configuracion = { inhalar: 4, mantener: 4, exhalar: 4, pausa: 4 };
        } else {
            configuracion = { inhalar: 5, mantener: 0, exhalar: 5, pausa: 0 };
        }

        this.configuracionActual = configuracion;
        this.ejercicioActivo = true;
        this.faseActual = 'inhalar';
        this.contadorActual = 0;

        btnIniciar.style.display = 'none';
        btnPausar.style.display = 'inline-flex';

        this.iniciarCicloRespiracion();
    }

    // Ciclo de respiración
    iniciarCicloRespiracion() {
        if (!this.ejercicioActivo) return;

        const circulo = document.getElementById('circulo-respiracion');
        const estado = document.querySelector('.estado-respiracion');
        const contador = document.querySelector('.contador-respiracion');
        const config = this.configuracionActual;

        // Actualizar estado visual
        switch(this.faseActual) {
            case 'inhalar':
                estado.textContent = 'Inhalá';
                circulo.style.background = 'linear-gradient(135deg, #10B981, #34D399)';
                break;
            case 'mantener':
                estado.textContent = 'Mantené';
                circulo.style.background = 'linear-gradient(135deg, #F59E0B, #FCD34D)';
                break;
            case 'exhalar':
                estado.textContent = 'Exhalá';
                circulo.style.background = 'linear-gradient(135deg, #EF4444, #F87171)';
                break;
            case 'pausa':
                estado.textContent = 'Pausa';
                circulo.style.background = 'linear-gradient(135deg, #6B7280, #9CA3AF)';
                break;
        }

        contador.textContent = config[this.faseActual] - this.contadorActual;

        // Animación del círculo
        const escala = 1 + (this.contadorActual / config[this.faseActual]) * 0.5;
        circulo.style.transform = `scale(${escala})`;

        this.contadorActual++;

        // Verificar si terminó la fase
        if (this.contadorActual >= config[this.faseActual]) {
            this.contadorActual = 0;
            
            // Siguiente fase
            const fases = ['inhalar', 'mantener', 'exhalar', 'pausa'];
            const indiceActual = fases.indexOf(this.faseActual);
            
            if (indiceActual < fases.length - 1) {
                this.faseActual = fases[indiceActual + 1];
            } else {
                this.faseActual = 'inhalar'; // Reiniciar ciclo
            }
        }

        // Continuar ciclo
        setTimeout(() => {
            if (this.ejercicioActivo) {
                this.iniciarCicloRespiracion();
            }
        }, 1000);
    }

    // Pausar respiración
    pausarRespiracion() {
        this.ejercicioActivo = false;
        document.querySelector('.btn-iniciar').style.display = 'inline-flex';
        document.querySelector('.btn-pausar').style.display = 'none';
        document.querySelector('.estado-respiracion').textContent = 'Pausado';
    }

    // Detener respiración
    detenerRespiracion() {
        this.ejercicioActivo = false;
        document.querySelector('.modal-ejercicio-respiracion').remove();
        
        // Mostrar mensaje de finalización
        this.mostrarNotificacion('🌸 ¡Excelente! Te sentís más relajado/a', 'success');
    }

    // ==================== RENDERIZADO DE SECCIONES ====================
    
    renderSeccionConsejos() {
        const recursos = this.recursos.consejos;
        
        return `
            <div class="seccion-consejos">
                <div class="seccion-header">
                    <h3>${recursos.titulo}</h3>
                    <p>${recursos.descripcion}</p>
                </div>

                <div class="consejos-grid">
                    ${recursos.categorias.map((categoria, index) => `
                        <div class="categoria-card">
                            <div class="categoria-header">
                                <h4>${categoria.nombre}</h4>
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <ul class="lista-consejos">
                                ${categoria.consejos.map(consejo => `
                                    <li>${consejo}</li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderSeccionMeditacion() {
        const recursos = this.recursos.meditacion;
        
        return `
            <div class="seccion-meditacion">
                <div class="seccion-header">
                    <h3>${recursos.titulo}</h3>
                    <p>${recursos.descripcion}</p>
                </div>

                <div class="meditaciones-grid">
                    ${recursos.sesiones.map((sesion, index) => `
                        <div class="meditacion-card">
                            <div class="meditacion-header">
                                <h4>${sesion.nombre}</h4>
                                <span class="duracion">${sesion.duracion}</span>
                            </div>
                            <p class="meditacion-descripcion">${sesion.descripcion}</p>
                            <button class="btn-meditacion" onclick="recursosBienestar.iniciarMeditacion(${index})">
                                <i class="fas fa-play"></i>
                                Comenzar
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ==================== FUNCIONES DE MEDITACIÓN ====================
    
    iniciarMeditacion(indexSesion) {
        const sesion = this.recursos.meditacion.sesiones[indexSesion];
        
        const modal = document.createElement('div');
        modal.className = 'modal-meditacion';
        modal.innerHTML = `
            <div class="meditacion-content">
                <div class="meditacion-header">
                    <h3>${sesion.nombre}</h3>
                    <button class="btn-cerrar" onclick="this.closest('.modal-meditacion').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="meditacion-body">
                    <div class="instrucciones-meditacion">
                        <h4>Preparate para meditar:</h4>
                        <ol>
                            <li>Encontrá una posición cómoda</li>
                            <li>Cerrá los ojos suavemente</li>
                            <li>Relajá tu cuerpo</li>
                            <li>Enfocá tu atención en tu respiración</li>
                        </ol>
                    </div>

                    <div class="visualizador-meditacion">
                        <div class="circulo-meditacion">
                            <i class="fas fa-leaf"></i>
                            <span class="estado-meditacion">Preparate</span>
                        </div>
                    </div>

                    <div class="controles-meditacion">
                        <button class="btn-iniciar-meditacion" onclick="recursosBienestar.comenzarMeditacion()">
                            <i class="fas fa-play"></i>
                            Iniciar Meditación
                        </button>
                        <button class="btn-detener-meditacion" onclick="recursosBienestar.detenerMeditacion()">
                            <i class="fas fa-stop"></i>
                            Detener
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    comenzarMeditacion() {
        // Simulación de meditación guiada
        const circulo = document.querySelector('.circulo-meditacion');
        const estado = document.querySelector('.estado-meditacion');
        const btnIniciar = document.querySelector('.btn-iniciar-meditacion');
        
        btnIniciar.style.display = 'none';
        
        const frases = [
            "Respirá profundamente...",
            "Sentí cómo se relaja tu cuerpo...",
            "Dejá ir todas las tensiones...",
            "Enfocá tu mente en el presente...",
            "Sentí la calma en tu interior..."
        ];

        let indice = 0;
        const intervalo = setInterval(() => {
            if (indice < frases.length) {
                estado.textContent = frases[indice];
                circulo.style.background = `linear-gradient(135deg, #10B981, #34D399)`;
                indice++;
            } else {
                clearInterval(intervalo);
                this.finalizarMeditacion();
            }
        }, 3000);
        
        this.intervaloMeditacion = intervalo;
    }

    detenerMeditacion() {
        if (this.intervaloMeditacion) {
            clearInterval(this.intervaloMeditacion);
        }
        document.querySelector('.modal-meditacion').remove();
    }

    finalizarMeditacion() {
        document.querySelector('.modal-meditacion').remove();
        this.mostrarNotificacion('🌸 ¡Excelente! Tu mente está más tranquila', 'success');
    }

    // ==================== EVENT LISTENERS ====================
    
    setupEventListeners(modal) {
        // Navegación entre secciones
        modal.addEventListener('click', (e) => {
            if (e.target.closest('.nav-btn')) {
                const btn = e.target.closest('.nav-btn');
                const seccion = btn.dataset.seccion;
                
                // Actualizar navegación
                modal.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Actualizar contenido
                const contenido = document.getElementById('recursos-contenido');
                switch(seccion) {
                    case 'respiracion':
                        contenido.innerHTML = this.renderSeccionRespiracion();
                        break;
                    case 'consejos':
                        contenido.innerHTML = this.renderSeccionConsejos();
                        break;
                    case 'meditacion':
                        contenido.innerHTML = this.renderSeccionMeditacion();
                        break;
                }
            }
        });

        // Conectar con sistema de progreso empresarial del dashboard
        this.conectarConProgresoEmpresarial(modal);
    }

    // ==================== CONEXIÓN CON PROGRESO EMPRESARIAL ====================
    
    conectarConProgresoEmpresarial(modal) {
        // Agregar botón de progreso empresarial en el header del modal
        const recursosHeader = modal.querySelector('.recursos-header');
        if (recursosHeader) {
            const botonProgreso = document.createElement('button');
            botonProgreso.className = 'btn-progreso-empresarial';
            botonProgreso.innerHTML = `
                <i class="fas fa-chart-line"></i>
                Mi Progreso Empresarial
            `;
            botonProgreso.style.cssText = `
                background: linear-gradient(135deg, #667EEA, #764BA2);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                margin-left: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                font-size: 14px;
            `;
            
            botonProgreso.addEventListener('click', () => {
                // Cerrar modal de recursos
                modal.remove();
                
                // Llamar a la función de progreso empresarial del dashboard
                setTimeout(() => {
                    if (window.verMiProgresoCorregido) {
                        window.verMiProgresoCorregido();
                    } else {
                        this.mostrarNotificacion('⚠️ Sistema de progreso no disponible', 'error');
                    }
                }, 100);
            });

            // Agregar el botón al header
            recursosHeader.appendChild(botonProgreso);
        }

        // También agregar un botón en la sección de consejos
        setTimeout(() => {
            const seccionConsejos = modal.querySelector('.seccion-consejos');
            if (seccionConsejos && !seccionConsejos.querySelector('.btn-progreso-empresarial')) {
                const botonProgresoSeccion = document.createElement('button');
                botonProgresoSeccion.className = 'btn-progreso-empresarial';
                botonProgresoSeccion.innerHTML = `
                    <i class="fas fa-chart-line"></i>
                    Ver Mi Progreso Empresarial
                `;
                botonProgresoSeccion.style.cssText = `
                    background: linear-gradient(135deg, #667EEA, #764BA2);
                    color: white;
                    border: none;
                    padding: 15px 25px;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    margin: 20px 0;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                `;
                
                botonProgresoSeccion.addEventListener('click', () => {
                    // Cerrar modal de recursos
                    modal.remove();
                    
                    // Llamar a la función de progreso empresarial del dashboard
                    setTimeout(() => {
                        if (window.verMiProgresoCorregido) {
                            window.verMiProgresoCorregido();
                        } else {
                            this.mostrarNotificacion('⚠️ Sistema de progreso no disponible', 'error');
                        }
                    }, 100);
                });

                seccionConsejos.appendChild(botonProgresoSeccion);
            }
        }, 500);
    }

    // ==================== UTILIDADES ====================
    
    mostrarNotificacion(mensaje, tipo = 'info') {
        const notif = document.createElement('div');
        notif.className = `bienestar-notificacion ${tipo}`;
        notif.innerHTML = `
            <div class="notif-content">
                <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${mensaje}</span>
            </div>
        `;
        
        document.body.appendChild(notif);
        
        setTimeout(() => notif.classList.add('show'), 100);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // ==================== ESTILOS ====================
    
    getStyles() {
        return `
        <style>
            /* Modal de recursos */
            .modal-recursos-bienestar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .recursos-content {
                background: white;
                border-radius: 24px;
                max-width: 900px;
                width: 95%;
                max-height: 90vh;
                overflow: hidden;
                animation: slideInUp 0.4s ease;
            }

            .recursos-header {
                background: linear-gradient(135deg, #EC4899, #F472B6);
                color: white;
                padding: 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .recursos-header h2 {
                margin: 0;
                font-size: 24px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .recursos-body {
                display: flex;
                height: 600px;
            }

            .recursos-nav {
                width: 250px;
                background: #F9FAFB;
                padding: 24px;
                border-right: 2px solid #E5E7EB;
            }

            .nav-btn {
                width: 100%;
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                text-align: left;
            }

            .nav-btn:hover {
                border-color: #EC4899;
                background: #FDF2F8;
            }

            .nav-btn.active {
                background: linear-gradient(135deg, #EC4899, #F472B6);
                color: white;
                border-color: transparent;
            }

            .recursos-contenido {
                flex: 1;
                padding: 24px;
                overflow-y: auto;
            }

            /* Ejercicios de respiración */
            .ejercicios-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 24px;
            }

            .ejercicio-card {
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 16px;
                padding: 24px;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .ejercicio-card:hover {
                border-color: #EC4899;
                transform: translateY(-4px);
                box-shadow: 0 8px 32px rgba(236, 72, 153, 0.2);
            }

            .ejercicio-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12px;
            }

            .ejercicio-header h4 {
                margin: 0;
                color: #1F2937;
                font-size: 18px;
            }

            .duracion {
                background: #EC4899;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }

            .ejercicio-descripcion {
                color: #6B7280;
                margin-bottom: 16px;
                line-height: 1.6;
            }

            .ejercicio-beneficios {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 20px;
                padding: 12px;
                background: #F0FDF4;
                border-radius: 8px;
                border-left: 4px solid #10B981;
            }

            .ejercicio-beneficios i {
                color: #10B981;
            }

            .ejercicio-beneficios span {
                font-size: 14px;
                color: #065F46;
            }

            .btn-ejercicio {
                width: 100%;
                background: linear-gradient(135deg, #EC4899, #F472B6);
                color: white;
                border: none;
                border-radius: 12px;
                padding: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .btn-ejercicio:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
            }

            /* Modal de ejercicio */
            .modal-ejercicio-respiracion {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                animation: fadeIn 0.3s ease;
            }

            .ejercicio-content {
                background: white;
                border-radius: 24px;
                max-width: 600px;
                width: 95%;
                max-height: 90vh;
                overflow: hidden;
                animation: scaleIn 0.4s ease;
            }

            .visualizador-respiracion {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 300px;
                margin: 32px 0;
            }

            .circulo-respiracion {
                width: 200px;
                height: 200px;
                border-radius: 50%;
                background: linear-gradient(135deg, #EC4899, #F472B6);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 1s ease;
                box-shadow: 0 0 40px rgba(236, 72, 153, 0.3);
            }

            .circulo-interno {
                text-align: center;
                color: white;
            }

            .estado-respiracion {
                display: block;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .contador-respiracion {
                display: block;
                font-size: 48px;
                font-weight: 700;
            }

            .controles-ejercicio {
                display: flex;
                gap: 12px;
                justify-content: center;
                margin: 24px 0;
            }

            .controles-ejercicio button {
                padding: 12px 24px;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .btn-iniciar {
                background: linear-gradient(135deg, #10B981, #34D399);
                color: white;
            }

            .btn-pausar {
                background: linear-gradient(135deg, #F59E0B, #FCD34D);
                color: white;
            }

            .btn-detener {
                background: linear-gradient(135deg, #EF4444, #F87171);
                color: white;
            }

            .progreso-ejercicio {
                margin-top: 24px;
            }

            .barra-progreso {
                width: 100%;
                height: 8px;
                background: #E5E7EB;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .progreso-fill {
                height: 100%;
                background: linear-gradient(135deg, #EC4899, #F472B6);
                border-radius: 4px;
                transition: width 1s ease;
                width: 0%;
            }

            .tiempo-restante {
                text-align: center;
                display: block;
                color: #6B7280;
                font-size: 14px;
            }

            /* Notificaciones */
            .bienestar-notificacion {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                z-index: 10002;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .bienestar-notificacion.show {
                transform: translateY(0);
                opacity: 1;
            }

            .notif-content {
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .bienestar-notificacion.success {
                border-left: 4px solid #10B981;
            }

            .bienestar-notificacion.success i {
                color: #10B981;
            }

            /* Animaciones */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes sparkle {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.2); }
            }

            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            /* Sección de consejos */
            .consejos-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 25px;
                margin-top: 25px;
            }

            .categoria-card {
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                border: 2px solid transparent;
                border-radius: 20px;
                padding: 30px;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            
            .categoria-card:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #7C3AED, #EC4899, #F59E0B);
                background-size: 200% 100%;
                animation: gradientShift 3s ease infinite;
            }

            .categoria-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                border-color: rgba(124, 58, 237, 0.2);
            }

            .categoria-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }

            .categoria-header h4 {
                margin: 0;
                color: #1F2937;
                font-size: 1.3rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .categoria-header i {
                background: linear-gradient(135deg, #7C3AED, #EC4899);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 1.4rem;
            }

            .lista-consejos {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .lista-consejos li {
                padding: 15px 0;
                border-bottom: 1px solid rgba(229, 231, 235, 0.5);
                color: #4B5563;
                line-height: 1.7;
                position: relative;
                padding-left: 35px;
                font-size: 0.95rem;
                transition: all 0.3s ease;
            }

            .lista-consejos li:last-child {
                border-bottom: none;
            }

            .lista-consejos li:before {
                content: "✨";
                position: absolute;
                left: 0;
                top: 15px;
                font-size: 1.2rem;
                animation: sparkle 2s ease-in-out infinite;
            }
            
            .lista-consejos li:hover {
                color: #1F2937;
                transform: translateX(5px);
            }

            /* Sección de meditación */
            .meditaciones-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 24px;
            }

            .meditacion-card {
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 16px;
                padding: 24px;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .meditacion-card:hover {
                border-color: #10B981;
                transform: translateY(-4px);
                box-shadow: 0 8px 32px rgba(16, 185, 129, 0.2);
            }

            .meditacion-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12px;
            }

            .meditacion-header h4 {
                margin: 0;
                color: #1F2937;
                font-size: 18px;
            }

            .meditacion-descripcion {
                color: #6B7280;
                margin-bottom: 20px;
                line-height: 1.6;
            }

            .btn-meditacion {
                width: 100%;
                background: linear-gradient(135deg, #10B981, #34D399);
                color: white;
                border: none;
                border-radius: 12px;
                padding: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .btn-meditacion:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
            }

            /* Modal de meditación */
            .modal-meditacion {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                animation: fadeIn 0.3s ease;
            }

            .meditacion-content {
                background: white;
                border-radius: 24px;
                max-width: 600px;
                width: 95%;
                max-height: 90vh;
                overflow: hidden;
                animation: scaleIn 0.4s ease;
            }

            .instrucciones-meditacion {
                background: #F0FDF4;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 24px;
                border-left: 4px solid #10B981;
            }

            .instrucciones-meditacion h4 {
                margin: 0 0 12px 0;
                color: #065F46;
            }

            .instrucciones-meditacion ol {
                margin: 0;
                padding-left: 20px;
                color: #374151;
            }

            .instrucciones-meditacion li {
                margin-bottom: 8px;
                line-height: 1.6;
            }

            .visualizador-meditacion {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 200px;
                margin: 32px 0;
            }

            .circulo-meditacion {
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: linear-gradient(135deg, #10B981, #34D399);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: all 1s ease;
                box-shadow: 0 0 40px rgba(16, 185, 129, 0.3);
                color: white;
                text-align: center;
            }

            .circulo-meditacion i {
                font-size: 32px;
                margin-bottom: 8px;
            }

            .estado-meditacion {
                font-size: 16px;
                font-weight: 600;
            }

            .controles-meditacion {
                display: flex;
                gap: 12px;
                justify-content: center;
                margin: 24px 0;
            }

            .controles-meditacion button {
                padding: 12px 24px;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .btn-iniciar-meditacion {
                background: linear-gradient(135deg, #10B981, #34D399);
                color: white;
            }

            .btn-detener-meditacion {
                background: linear-gradient(135deg, #EF4444, #F87171);
                color: white;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .recursos-body {
                    flex-direction: column;
                    height: auto;
                }

                .recursos-nav {
                    width: 100%;
                    border-right: none;
                    border-bottom: 2px solid #E5E7EB;
                }

                .ejercicios-grid,
                .consejos-grid,
                .meditaciones-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
        `;
    }
}

// Función global para inicializar
window.initRecursosBienestar = function(tenantSlug, idioma = 'es') {
    window.recursosBienestar = new RecursosBienestarEmocional(tenantSlug, idioma);
    return window.recursosBienestar;
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RecursosBienestarEmocional };
}









