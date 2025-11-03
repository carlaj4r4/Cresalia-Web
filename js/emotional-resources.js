/**
 * Recursos de Apoyo Emocional - Cresalia-Web
 * Recursos reales de respiración, consejos y ejercicios para emprendedoras
 */

class EmotionalResources {
    constructor() {
        this.resources = this.initializeResources();
        this.currentLanguage = 'es';
    }

    // ===== INICIALIZACIÓN DE RECURSOS =====
    initializeResources() {
        return {
            breathing: {
                es: {
                    title: "Ejercicios de Respiración",
                    description: "Técnicas de respiración para calmar la ansiedad y el estrés",
                    exercises: [
                        {
                            name: "Respiración 4-7-8",
                            description: "Técnica para reducir el estrés y conciliar el sueño",
                            steps: [
                                "Inhala por la nariz durante 4 segundos",
                                "Mantén la respiración durante 7 segundos",
                                "Exhala por la boca durante 8 segundos",
                                "Repite 4 veces"
                            ],
                            duration: "2-3 minutos",
                            benefits: "Reduce ansiedad, mejora el sueño, calma la mente"
                        },
                        {
                            name: "Respiración Diafragmática",
                            description: "Respiración profunda para relajar el cuerpo",
                            steps: [
                                "Coloca una mano en el pecho y otra en el abdomen",
                                "Inhala lentamente por la nariz, llenando el abdomen",
                                "Siente cómo se eleva tu mano del abdomen",
                                "Exhala lentamente por la boca",
                                "Repite 10 veces"
                            ],
                            duration: "5 minutos",
                            benefits: "Reduce tensión, mejora oxigenación, relaja músculos"
                        },
                        {
                            name: "Respiración de Caja",
                            description: "Técnica para mantener la calma en momentos difíciles",
                            steps: [
                                "Inhala por la nariz durante 4 segundos",
                                "Mantén la respiración durante 4 segundos",
                                "Exhala por la boca durante 4 segundos",
                                "Mantén sin aire durante 4 segundos",
                                "Repite 5-10 veces"
                            ],
                            duration: "3-5 minutos",
                            benefits: "Controla el pánico, mejora concentración, reduce estrés"
                        }
                    ]
                },
                en: {
                    title: "Breathing Exercises",
                    description: "Breathing techniques to calm anxiety and stress",
                    exercises: [
                        {
                            name: "4-7-8 Breathing",
                            description: "Technique to reduce stress and improve sleep",
                            steps: [
                                "Inhale through your nose for 4 seconds",
                                "Hold your breath for 7 seconds",
                                "Exhale through your mouth for 8 seconds",
                                "Repeat 4 times"
                            ],
                            duration: "2-3 minutes",
                            benefits: "Reduces anxiety, improves sleep, calms the mind"
                        },
                        {
                            name: "Diaphragmatic Breathing",
                            description: "Deep breathing to relax the body",
                            steps: [
                                "Place one hand on your chest and one on your abdomen",
                                "Inhale slowly through your nose, filling your abdomen",
                                "Feel your abdominal hand rise",
                                "Exhale slowly through your mouth",
                                "Repeat 10 times"
                            ],
                            duration: "5 minutes",
                            benefits: "Reduces tension, improves oxygenation, relaxes muscles"
                        },
                        {
                            name: "Box Breathing",
                            description: "Technique to stay calm in difficult moments",
                            steps: [
                                "Inhale through your nose for 4 seconds",
                                "Hold your breath for 4 seconds",
                                "Exhale through your mouth for 4 seconds",
                                "Hold without air for 4 seconds",
                                "Repeat 5-10 times"
                            ],
                            duration: "3-5 minutes",
                            benefits: "Controls panic, improves concentration, reduces stress"
                        }
                    ]
                },
                pt: {
                    title: "Exercícios de Respiração",
                    description: "Técnicas de respiração para acalmar ansiedade e estresse",
                    exercises: [
                        {
                            name: "Respiração 4-7-8",
                            description: "Técnica para reduzir estresse e melhorar o sono",
                            steps: [
                                "Inale pelo nariz por 4 segundos",
                                "Segure a respiração por 7 segundos",
                                "Exale pela boca por 8 segundos",
                                "Repita 4 vezes"
                            ],
                            duration: "2-3 minutos",
                            benefits: "Reduz ansiedade, melhora o sono, acalma a mente"
                        }
                    ]
                },
                fr: {
                    title: "Exercices de Respiration",
                    description: "Techniques de respiration pour calmer l'anxiété et le stress",
                    exercises: [
                        {
                            name: "Respiration 4-7-8",
                            description: "Technique pour réduire le stress et améliorer le sommeil",
                            steps: [
                                "Inspirez par le nez pendant 4 secondes",
                                "Retenez votre souffle pendant 7 secondes",
                                "Expirez par la bouche pendant 8 secondes",
                                "Répétez 4 fois"
                            ],
                            duration: "2-3 minutes",
                            benefits: "Réduit l'anxiété, améliore le sommeil, calme l'esprit"
                        }
                    ]
                },
                de: {
                    title: "Atemübungen",
                    description: "Atemtechniken zur Beruhigung von Angst und Stress",
                    exercises: [
                        {
                            name: "4-7-8 Atmung",
                            description: "Technik zur Stressreduktion und Schlafverbesserung",
                            steps: [
                                "Atmen Sie 4 Sekunden durch die Nase ein",
                                "Halten Sie den Atem 7 Sekunden an",
                                "Atmen Sie 8 Sekunden durch den Mund aus",
                                "Wiederholen Sie 4 Mal"
                            ],
                            duration: "2-3 Minuten",
                            benefits: "Reduziert Angst, verbessert Schlaf, beruhigt den Geist"
                        }
                    ]
                },
                it: {
                    title: "Esercizi di Respirazione",
                    description: "Tecniche di respirazione per calmare ansia e stress",
                    exercises: [
                        {
                            name: "Respirazione 4-7-8",
                            description: "Tecnica per ridurre lo stress e migliorare il sonno",
                            steps: [
                                "Inspirare dal naso per 4 secondi",
                                "Trattenere il respiro per 7 secondi",
                                "Espirare dalla bocca per 8 secondi",
                                "Ripetere 4 volte"
                            ],
                            duration: "2-3 minuti",
                            benefits: "Riduce l'ansia, migliora il sonno, calma la mente"
                        }
                    ]
                }
            },
            advice: {
                es: {
                    title: "Consejos para Emprendedoras",
                    description: "Consejos prácticos para manejar el estrés y la ansiedad del emprendimiento",
                    tips: [
                        {
                            category: "Gestión del Tiempo",
                            title: "Planifica tu día",
                            content: "Dedica 10 minutos cada mañana a planificar tu día. Prioriza las tareas más importantes y sé realista con lo que puedes lograr.",
                            icon: "fas fa-clock"
                        },
                        {
                            category: "Autocuidado",
                            title: "Toma descansos",
                            content: "Trabajar sin parar no es productivo. Toma descansos de 5-10 minutos cada hora para recargar energías.",
                            icon: "fas fa-coffee"
                        },
                        {
                            category: "Mentalidad",
                            title: "Celebra los pequeños logros",
                            content: "No esperes a los grandes éxitos. Celebra cada pequeña victoria, cada cliente nuevo, cada venta. ¡Cada paso cuenta!",
                            icon: "fas fa-trophy"
                        },
                        {
                            category: "Red de Apoyo",
                            title: "No estás sola",
                            content: "Busca apoyo en otros emprendedores, únete a grupos, comparte tus experiencias. La comunidad es poderosa.",
                            icon: "fas fa-users"
                        },
                        {
                            category: "Aprendizaje",
                            title: "Los errores son oportunidades",
                            content: "Cada error es una lección. No te castigues por los fracasos, úsalos para crecer y mejorar.",
                            icon: "fas fa-lightbulb"
                        },
                        {
                            category: "Persistencia",
                            title: "La consistencia es clave",
                            content: "Es mejor hacer poco cada día que mucho de vez en cuando. La consistencia construye hábitos exitosos.",
                            icon: "fas fa-calendar-check"
                        }
                    ]
                },
                en: {
                    title: "Advice for Entrepreneurs",
                    description: "Practical tips to manage stress and anxiety in entrepreneurship",
                    tips: [
                        {
                            category: "Time Management",
                            title: "Plan your day",
                            content: "Spend 10 minutes each morning planning your day. Prioritize the most important tasks and be realistic about what you can achieve.",
                            icon: "fas fa-clock"
                        },
                        {
                            category: "Self-care",
                            title: "Take breaks",
                            content: "Working non-stop is not productive. Take 5-10 minute breaks every hour to recharge your energy.",
                            icon: "fas fa-coffee"
                        },
                        {
                            category: "Mindset",
                            title: "Celebrate small wins",
                            content: "Don't wait for big successes. Celebrate every small victory, every new customer, every sale. Every step counts!",
                            icon: "fas fa-trophy"
                        }
                    ]
                },
                pt: {
                    title: "Conselhos para Empreendedoras",
                    description: "Dicas práticas para gerenciar estresse e ansiedade no empreendedorismo",
                    tips: [
                        {
                            category: "Gestão de Tempo",
                            title: "Planeje seu dia",
                            content: "Dedique 10 minutos todas as manhãs para planejar seu dia. Priorize as tarefas mais importantes e seja realista com o que pode alcançar.",
                            icon: "fas fa-clock"
                        }
                    ]
                },
                fr: {
                    title: "Conseils pour Entrepreneures",
                    description: "Conseils pratiques pour gérer le stress et l'anxiété dans l'entrepreneuriat",
                    tips: [
                        {
                            category: "Gestion du Temps",
                            title: "Planifiez votre journée",
                            content: "Consacrez 10 minutes chaque matin à planifier votre journée. Priorisez les tâches les plus importantes et soyez réaliste sur ce que vous pouvez accomplir.",
                            icon: "fas fa-clock"
                        }
                    ]
                },
                de: {
                    title: "Ratschläge für Unternehmerinnen",
                    description: "Praktische Tipps zur Bewältigung von Stress und Angst im Unternehmertum",
                    tips: [
                        {
                            category: "Zeitmanagement",
                            title: "Planen Sie Ihren Tag",
                            content: "Verbringen Sie jeden Morgen 10 Minuten mit der Tagesplanung. Priorisieren Sie die wichtigsten Aufgaben und seien Sie realistisch bei dem, was Sie erreichen können.",
                            icon: "fas fa-clock"
                        }
                    ]
                },
                it: {
                    title: "Consigli per Imprenditrici",
                    description: "Suggerimenti pratici per gestire stress e ansia nell'imprenditoria",
                    tips: [
                        {
                            category: "Gestione del Tempo",
                            title: "Pianifica la tua giornata",
                            content: "Dedica 10 minuti ogni mattina a pianificare la tua giornata. Dai priorità ai compiti più importanti e sii realistica su ciò che puoi raggiungere.",
                            icon: "fas fa-clock"
                        }
                    ]
                }
            },
            exercises: {
                es: {
                    title: "Ejercicios de Motivación",
                    description: "Ejercicios prácticos para mantener la motivación y la positividad",
                    activities: [
                        {
                            name: "Gratitud Diaria",
                            description: "Escribe 3 cosas por las que estás agradecida hoy",
                            steps: [
                                "Toma un momento cada mañana o noche",
                                "Escribe 3 cosas específicas por las que estás agradecida",
                                "Pueden ser grandes o pequeñas",
                                "Reflexiona sobre cómo te hacen sentir"
                            ],
                            duration: "5 minutos",
                            frequency: "Diario",
                            benefits: "Mejora el estado de ánimo, reduce el estrés, aumenta la positividad"
                        },
                        {
                            name: "Visualización de Éxito",
                            description: "Imagina tu negocio exitoso en el futuro",
                            steps: [
                                "Cierra los ojos y relájate",
                                "Imagina tu negocio en 1 año, exitoso y próspero",
                                "Visualiza los detalles: clientes felices, ventas crecientes",
                                "Siente la emoción del éxito",
                                "Abre los ojos y anota 3 acciones para llegar ahí"
                            ],
                            duration: "10 minutos",
                            frequency: "Semanal",
                            benefits: "Aumenta la motivación, clarifica objetivos, reduce la ansiedad"
                        },
                        {
                            name: "Afirmaciones Positivas",
                            description: "Repite frases positivas sobre ti y tu negocio",
                            steps: [
                                "Elige 3-5 afirmaciones positivas",
                                "Repítelas en voz alta cada mañana",
                                "Ejemplos: 'Soy una emprendedora exitosa', 'Mi negocio crece cada día'",
                                "Créelas mientras las dices",
                                "Visualiza el éxito mientras las repites"
                            ],
                            duration: "3 minutos",
                            frequency: "Diario",
                            benefits: "Refuerza la confianza, cambia patrones negativos, aumenta la autoestima"
                        }
                    ]
                },
                en: {
                    title: "Motivation Exercises",
                    description: "Practical exercises to maintain motivation and positivity",
                    activities: [
                        {
                            name: "Daily Gratitude",
                            description: "Write 3 things you're grateful for today",
                            steps: [
                                "Take a moment each morning or evening",
                                "Write 3 specific things you're grateful for",
                                "They can be big or small",
                                "Reflect on how they make you feel"
                            ],
                            duration: "5 minutes",
                            frequency: "Daily",
                            benefits: "Improves mood, reduces stress, increases positivity"
                        }
                    ]
                },
                pt: {
                    title: "Exercícios de Motivação",
                    description: "Exercícios práticos para manter motivação e positividade",
                    activities: [
                        {
                            name: "Gratidão Diária",
                            description: "Escreva 3 coisas pelas quais você é grata hoje",
                            steps: [
                                "Reserve um momento todas as manhãs ou noites",
                                "Escreva 3 coisas específicas pelas quais você é grata",
                                "Podem ser grandes ou pequenas",
                                "Reflita sobre como elas te fazem sentir"
                            ],
                            duration: "5 minutos",
                            frequency: "Diário",
                            benefits: "Melhora o humor, reduz estresse, aumenta positividade"
                        }
                    ]
                },
                fr: {
                    title: "Exercices de Motivation",
                    description: "Exercices pratiques pour maintenir la motivation et la positivité",
                    activities: [
                        {
                            name: "Gratitude Quotidienne",
                            description: "Écrivez 3 choses pour lesquelles vous êtes reconnaissante aujourd'hui",
                            steps: [
                                "Prenez un moment chaque matin ou soir",
                                "Écrivez 3 choses spécifiques pour lesquelles vous êtes reconnaissante",
                                "Elles peuvent être grandes ou petites",
                                "Réfléchissez à la façon dont elles vous font sentir"
                            ],
                            duration: "5 minutes",
                            frequency: "Quotidien",
                            benefits: "Améliore l'humeur, réduit le stress, augmente la positivité"
                        }
                    ]
                },
                de: {
                    title: "Motivationsübungen",
                    description: "Praktische Übungen zur Aufrechterhaltung von Motivation und Positivität",
                    activities: [
                        {
                            name: "Tägliche Dankbarkeit",
                            description: "Schreiben Sie 3 Dinge auf, für die Sie heute dankbar sind",
                            steps: [
                                "Nehmen Sie sich jeden Morgen oder Abend einen Moment Zeit",
                                "Schreiben Sie 3 spezifische Dinge auf, für die Sie dankbar sind",
                                "Sie können groß oder klein sein",
                                "Denken Sie darüber nach, wie sie Sie fühlen lassen"
                            ],
                            duration: "5 Minuten",
                            frequency: "Täglich",
                            benefits: "Verbessert die Stimmung, reduziert Stress, steigert Positivität"
                        }
                    ]
                },
                it: {
                    title: "Esercizi di Motivazione",
                    description: "Esercizi pratici per mantenere motivazione e positività",
                    activities: [
                        {
                            name: "Gratitudine Giornaliera",
                            description: "Scrivi 3 cose per cui sei grata oggi",
                            steps: [
                                "Prenditi un momento ogni mattina o sera",
                                "Scrivi 3 cose specifiche per cui sei grata",
                                "Possono essere grandi o piccole",
                                "Rifletti su come ti fanno sentire"
                            ],
                            duration: "5 minuti",
                            frequency: "Giornaliero",
                            benefits: "Migliora l'umore, riduce lo stress, aumenta la positività"
                        }
                    ]
                }
            },
            quotes: {
                es: {
                    title: "Frases Motivacionales",
                    description: "Frases inspiradoras para momentos difíciles",
                    quotes: [
                        {
                            text: "El éxito no es final, el fracaso no es fatal: es el valor de continuar lo que cuenta.",
                            author: "Winston Churchill",
                            category: "Persistencia"
                        },
                        {
                            text: "Cada experto fue una vez un principiante. Cada profesional fue una vez un aficionado.",
                            author: "Helen Hayes",
                            category: "Crecimiento"
                        },
                        {
                            text: "La única forma de hacer un gran trabajo es amar lo que haces.",
                            author: "Steve Jobs",
                            category: "Pasión"
                        },
                        {
                            text: "No cuentes los días, haz que los días cuenten.",
                            author: "Muhammad Ali",
                            category: "Productividad"
                        },
                        {
                            text: "El futuro pertenece a quienes creen en la belleza de sus sueños.",
                            author: "Eleanor Roosevelt",
                            category: "Sueños"
                        }
                    ]
                },
                en: {
                    title: "Motivational Quotes",
                    description: "Inspiring quotes for difficult moments",
                    quotes: [
                        {
                            text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                            author: "Winston Churchill",
                            category: "Persistence"
                        },
                        {
                            text: "Every expert was once a beginner. Every professional was once an amateur.",
                            author: "Helen Hayes",
                            category: "Growth"
                        }
                    ]
                },
                pt: {
                    title: "Frases Motivacionais",
                    description: "Frases inspiradoras para momentos difíceis",
                    quotes: [
                        {
                            text: "O sucesso não é final, o fracasso não é fatal: é a coragem de continuar que conta.",
                            author: "Winston Churchill",
                            category: "Persistência"
                        }
                    ]
                },
                fr: {
                    title: "Citations Motivantes",
                    description: "Citations inspirantes pour les moments difficiles",
                    quotes: [
                        {
                            text: "Le succès n'est pas final, l'échec n'est pas fatal: c'est le courage de continuer qui compte.",
                            author: "Winston Churchill",
                            category: "Persistance"
                        }
                    ]
                },
                de: {
                    title: "Motivationssprüche",
                    description: "Inspirierende Sprüche für schwierige Momente",
                    quotes: [
                        {
                            text: "Erfolg ist nicht endgültig, Scheitern ist nicht tödlich: Es ist der Mut weiterzumachen, der zählt.",
                            author: "Winston Churchill",
                            category: "Beharrlichkeit"
                        }
                    ]
                },
                it: {
                    title: "Citazioni Motivazionali",
                    description: "Citazioni ispiratrici per momenti difficili",
                    quotes: [
                        {
                            text: "Il successo non è finale, il fallimento non è fatale: è il coraggio di continuare che conta.",
                            author: "Winston Churchill",
                            category: "Persistenza"
                        }
                    ]
                }
            }
        };
    }

    // ===== GESTIÓN DE IDIOMAS =====
    setLanguage(language) {
        this.currentLanguage = language;
        this.updateDisplay();
    }

    getCurrentLanguage() {
        return this.currentLanguage || 'es';
    }

    // ===== OBTENER RECURSOS =====
    getBreathingExercises() {
        const lang = this.getCurrentLanguage();
        return this.resources.breathing[lang] || this.resources.breathing.es;
    }

    getAdvice() {
        const lang = this.getCurrentLanguage();
        return this.resources.advice[lang] || this.resources.advice.es;
    }

    getMotivationExercises() {
        const lang = this.getCurrentLanguage();
        return this.resources.exercises[lang] || this.resources.exercises.es;
    }

    getQuotes() {
        const lang = this.getCurrentLanguage();
        return this.resources.quotes[lang] || this.resources.quotes.es;
    }

    // ===== GENERAR RECURSOS ALEATORIOS =====
    getRandomQuote() {
        const quotes = this.getQuotes();
        const randomIndex = Math.floor(Math.random() * quotes.quotes.length);
        return quotes.quotes[randomIndex];
    }

    getRandomBreathingExercise() {
        const exercises = this.getBreathingExercises();
        const randomIndex = Math.floor(Math.random() * exercises.exercises.length);
        return exercises.exercises[randomIndex];
    }

    getRandomAdvice() {
        const advice = this.getAdvice();
        const randomIndex = Math.floor(Math.random() * advice.tips.length);
        return advice.tips[randomIndex];
    }

    // ===== MOSTRAR RECURSOS =====
    displayResources() {
        this.displayBreathingExercises();
        this.displayAdvice();
        this.displayMotivationExercises();
        this.displayQuotes();
    }

    displayBreathingExercises() {
        const container = document.getElementById('breathingExercises');
        if (!container) return;

        const exercises = this.getBreathingExercises();
        const html = `
            <div class="resource-section">
                <h3>${exercises.title}</h3>
                <p>${exercises.description}</p>
                <div class="exercises-grid">
                    ${exercises.exercises.map(exercise => `
                        <div class="exercise-card">
                            <div class="exercise-header">
                                <h4>${exercise.name}</h4>
                                <div class="exercise-meta">
                                    <span class="duration">⏱️ ${exercise.duration}</span>
                                </div>
                            </div>
                            <p class="exercise-description">${exercise.description}</p>
                            <div class="exercise-steps">
                                <h5>Pasos:</h5>
                                <ol>
                                    ${exercise.steps.map(step => `<li>${step}</li>`).join('')}
                                </ol>
                            </div>
                            <div class="exercise-benefits">
                                <strong>Beneficios:</strong> ${exercise.benefits}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    displayAdvice() {
        const container = document.getElementById('adviceSection');
        if (!container) return;

        const advice = this.getAdvice();
        const html = `
            <div class="resource-section">
                <h3>${advice.title}</h3>
                <p>${advice.description}</p>
                <div class="advice-grid">
                    ${advice.tips.map(tip => `
                        <div class="advice-card">
                            <div class="advice-icon">
                                <i class="${tip.icon}"></i>
                            </div>
                            <div class="advice-content">
                                <div class="advice-category">${tip.category}</div>
                                <h4>${tip.title}</h4>
                                <p>${tip.content}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    displayMotivationExercises() {
        const container = document.getElementById('motivationExercises');
        if (!container) return;

        const exercises = this.getMotivationExercises();
        const html = `
            <div class="resource-section">
                <h3>${exercises.title}</h3>
                <p>${exercises.description}</p>
                <div class="exercises-grid">
                    ${exercises.activities.map(activity => `
                        <div class="exercise-card">
                            <div class="exercise-header">
                                <h4>${activity.name}</h4>
                                <div class="exercise-meta">
                                    <span class="duration">⏱️ ${activity.duration}</span>
                                    <span class="frequency">📅 ${activity.frequency}</span>
                                </div>
                            </div>
                            <p class="exercise-description">${activity.description}</p>
                            <div class="exercise-steps">
                                <h5>Pasos:</h5>
                                <ol>
                                    ${activity.steps.map(step => `<li>${step}</li>`).join('')}
                                </ol>
                            </div>
                            <div class="exercise-benefits">
                                <strong>Beneficios:</strong> ${activity.benefits}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    displayQuotes() {
        const container = document.getElementById('quotesSection');
        if (!container) return;

        const quotes = this.getQuotes();
        const html = `
            <div class="resource-section">
                <h3>${quotes.title}</h3>
                <p>${quotes.description}</p>
                <div class="quotes-grid">
                    ${quotes.quotes.map(quote => `
                        <div class="quote-card">
                            <div class="quote-text">"${quote.text}"</div>
                            <div class="quote-author">- ${quote.author}</div>
                            <div class="quote-category">${quote.category}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // ===== RECURSOS RÁPIDOS =====
    getQuickResource() {
        const random = Math.random();
        if (random < 0.33) {
            return {
                type: 'quote',
                data: this.getRandomQuote()
            };
        } else if (random < 0.66) {
            return {
                type: 'breathing',
                data: this.getRandomBreathingExercise()
            };
        } else {
            return {
                type: 'advice',
                data: this.getRandomAdvice()
            };
        }
    }

    displayQuickResource() {
        const container = document.getElementById('quickResource');
        if (!container) return;

        const resource = this.getQuickResource();
        let html = '';

        if (resource.type === 'quote') {
            html = `
                <div class="quick-resource-card quote">
                    <div class="resource-icon">💬</div>
                    <div class="resource-content">
                        <h4>Frase del Día</h4>
                        <p>"${resource.data.text}"</p>
                        <div class="resource-author">- ${resource.data.author}</div>
                    </div>
                </div>
            `;
        } else if (resource.type === 'breathing') {
            html = `
                <div class="quick-resource-card breathing">
                    <div class="resource-icon">🌬️</div>
                    <div class="resource-content">
                        <h4>Ejercicio de Respiración</h4>
                        <p><strong>${resource.data.name}</strong></p>
                        <p>${resource.data.description}</p>
                        <div class="resource-duration">⏱️ ${resource.data.duration}</div>
                    </div>
                </div>
            `;
        } else {
            html = `
                <div class="quick-resource-card advice">
                    <div class="resource-icon">💡</div>
                    <div class="resource-content">
                        <h4>Consejo del Día</h4>
                        <p><strong>${resource.data.title}</strong></p>
                        <p>${resource.data.content}</p>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // ===== ACTUALIZACIÓN DE DISPLAY =====
    updateDisplay() {
        this.displayResources();
        this.displayQuickResource();
    }

    // ===== INICIALIZACIÓN =====
    initialize() {
        // Detectar idioma actual
        const currentLang = this.detectCurrentLanguage();
        this.setLanguage(currentLang);
        
        // Mostrar recursos
        this.displayResources();
        this.displayQuickResource();
        
        console.log('💜 Recursos emocionales inicializados');
    }

    detectCurrentLanguage() {
        // Intentar detectar desde el sistema de i18n
        if (window.i18n && window.i18n.currentLanguage) {
            return window.i18n.currentLanguage;
        }
        
        // Intentar detectar desde localStorage
        const stored = localStorage.getItem('cresalia_language');
        if (stored) {
            return stored;
        }
        
        // Detectar desde el navegador
        const browserLang = navigator.language.split('-')[0];
        const supportedLangs = ['es', 'en', 'pt', 'fr', 'de', 'it'];
        
        return supportedLangs.includes(browserLang) ? browserLang : 'es';
    }
}

// ===== INSTANCIA GLOBAL =====
window.emotionalResources = new EmotionalResources();

// ===== INICIALIZACIÓN AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', function() {
    window.emotionalResources.initialize();
});

// ===== EXPORTACIÓN PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmotionalResources;
}
