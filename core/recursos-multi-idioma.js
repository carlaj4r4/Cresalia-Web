/**
 * 🌍 RECURSOS MULTI-IDIOMA - CRESALIA
 * Contenido de bienestar emocional en 6 idiomas
 * ES, EN, PT, FR, DE, IT
 */

const RECURSOS_MULTI_IDIOMA = {
    // ==================== ESPAÑOL ====================
    es: {
        respiracion: {
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
                }
            ]
        },
        consejos: {
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
                }
            ]
        },
        meditacion: {
            titulo: "Meditaciones Guiadas",
            descripcion: "Relajación y mindfulness para emprendedores",
            tipos: [
                {
                    nombre: "Meditación de Respiración",
                    duracion: "5 minutos",
                    nivel: "Principiante",
                    descripcion: "Enfocá tu atención en la respiración para calmar la mente"
                },
                {
                    nombre: "Meditación de Gratitud",
                    duracion: "10 minutos",
                    nivel: "Intermedio",
                    descripcion: "Reflexioná sobre las cosas buenas de tu vida"
                }
            ]
        },
        musica: {
            titulo: "Música Relajante",
            descripcion: "Sonidos para calmar la mente y reducir el estrés",
            generos: [
                {
                    nombre: "Sonidos de Naturaleza",
                    descripcion: "Lluvia, olas, pájaros cantando"
                },
                {
                    nombre: "Música Instrumental",
                    descripcion: "Piano, guitarra, cuencos tibetanos"
                }
            ]
        },
        mensajes: {
            bienvenida: "Bienvenido/a a tu espacio de bienestar",
            motivacion: [
                "Sos más fuerte de lo que pensás",
                "Cada día es una nueva oportunidad",
                "Tu progreso no se mide solo en ventas",
                "Está bien tener días difíciles",
                "No estás solo/a en este viaje"
            ],
            aliento: [
                "Respirá profundo, todo va a estar bien",
                "Tomá un momento para vos mismo/a",
                "Recordá por qué empezaste",
                "Cada esfuerzo cuenta",
                "Merecés descansar y cuidarte"
            ]
        }
    },

    // ==================== ENGLISH ====================
    en: {
        respiracion: {
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
                },
                {
                    nombre: "Box Breathing",
                    descripcion: "Technique to center attention",
                    instrucciones: [
                        "Inhale for 4 seconds",
                        "Hold for 4 seconds",
                        "Exhale for 4 seconds",
                        "Wait for 4 seconds",
                        "Repeat the cycle"
                    ],
                    duracion: "5 minutes",
                    beneficios: "Improves concentration, reduces stress, balances emotions"
                }
            ]
        },
        consejos: {
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
                },
                {
                    nombre: "Energy & Motivation",
                    consejos: [
                        "Start the day with a small goal",
                        "Celebrate every achievement, no matter how small",
                        "Remember why you started your business",
                        "Connect with other entrepreneurs",
                        "Visualize your success every day"
                    ]
                }
            ]
        },
        meditacion: {
            titulo: "Guided Meditations",
            descripcion: "Relaxation and mindfulness for entrepreneurs",
            tipos: [
                {
                    nombre: "Breathing Meditation",
                    duracion: "5 minutes",
                    nivel: "Beginner",
                    descripcion: "Focus your attention on breathing to calm the mind"
                },
                {
                    nombre: "Gratitude Meditation",
                    duracion: "10 minutes",
                    nivel: "Intermediate",
                    descripcion: "Reflect on the good things in your life"
                }
            ]
        },
        musica: {
            titulo: "Relaxing Music",
            descripcion: "Sounds to calm the mind and reduce stress",
            generos: [
                {
                    nombre: "Nature Sounds",
                    descripcion: "Rain, waves, birds singing"
                },
                {
                    nombre: "Instrumental Music",
                    descripcion: "Piano, guitar, Tibetan bowls"
                }
            ]
        },
        mensajes: {
            bienvenida: "Welcome to your wellness space",
            motivacion: [
                "You are stronger than you think",
                "Each day is a new opportunity",
                "Your progress isn't measured only in sales",
                "It's okay to have difficult days",
                "You're not alone on this journey"
            ],
            aliento: [
                "Breathe deeply, everything will be okay",
                "Take a moment for yourself",
                "Remember why you started",
                "Every effort counts",
                "You deserve to rest and take care of yourself"
            ]
        }
    },

    // ==================== PORTUGUÊS ====================
    pt: {
        respiracion: {
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
                },
                {
                    nombre: "Respiração Quadrada",
                    descripcion: "Técnica para centralizar a atenção",
                    instrucciones: [
                        "Inale por 4 segundos",
                        "Segure por 4 segundos",
                        "Exale por 4 segundos",
                        "Aguarde por 4 segundos",
                        "Repita o ciclo"
                    ],
                    duracion: "5 minutos",
                    beneficios: "Melhora concentração, reduz estresse, equilibra emoções"
                }
            ]
        },
        consejos: {
            titulo: "Dicas de Bem-estar",
            descripcion: "Pequenas mudanças para melhorar seu dia a dia",
            categorias: [
                {
                    nombre: "Gerenciamento de Estresse",
                    consejos: [
                        "Faça pausas de 5 minutos a cada hora",
                        "Pratique respiração profunda 3 vezes ao dia",
                        "Escreva 3 coisas pelas quais você é grato",
                        "Caminhe mesmo que sejam apenas 10 minutos",
                        "Limite notícias negativas a 30 min/dia"
                    ]
                },
                {
                    nombre: "Energia e Motivação",
                    consejos: [
                        "Comece o dia com um objetivo pequeno",
                        "Celebre cada conquista, por menor que seja",
                        "Lembre-se do porquê começou seu negócio",
                        "Conecte-se com outros empreendedores",
                        "Visualize seu sucesso todos os dias"
                    ]
                }
            ]
        },
        meditacion: {
            titulo: "Meditações Guiadas",
            descripcion: "Relaxamento e mindfulness para empreendedores",
            tipos: [
                {
                    nombre: "Meditação de Respiração",
                    duracion: "5 minutos",
                    nivel: "Iniciante",
                    descripcion: "Foque sua atenção na respiração para acalmar a mente"
                },
                {
                    nombre: "Meditação de Gratidão",
                    duracion: "10 minutos",
                    nivel: "Intermediário",
                    descripcion: "Reflita sobre as coisas boas da sua vida"
                }
            ]
        },
        musica: {
            titulo: "Música Relaxante",
            descripcion: "Sons para acalmar a mente e reduzir o estresse",
            generos: [
                {
                    nombre: "Sons da Natureza",
                    descripcion: "Chuva, ondas, pássaros cantando"
                },
                {
                    nombre: "Música Instrumental",
                    descripcion: "Piano, guitarra, tigelas tibetanas"
                }
            ]
        },
        mensajes: {
            bienvenida: "Bem-vindo ao seu espaço de bem-estar",
            motivacion: [
                "Você é mais forte do que pensa",
                "Cada dia é uma nova oportunidade",
                "Seu progresso não é medido apenas em vendas",
                "Está tudo bem ter dias difíceis",
                "Você não está sozinho nesta jornada"
            ],
            aliento: [
                "Respire fundo, tudo vai ficar bem",
                "Reserve um momento para você",
                "Lembre-se do porquê começou",
                "Cada esforço conta",
                "Você merece descansar e se cuidar"
            ]
        }
    },

    // ==================== FRANÇAIS ====================
    fr: {
        respiracion: {
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
                },
                {
                    nombre: "Respiration Carrée",
                    descripcion: "Technique pour centrer l'attention",
                    instrucciones: [
                        "Inspirez pendant 4 secondes",
                        "Retenez pendant 4 secondes",
                        "Expirez pendant 4 secondes",
                        "Attendez 4 secondes",
                        "Répétez le cycle"
                    ],
                    duracion: "5 minutes",
                    beneficios: "Améliore la concentration, réduit le stress, équilibre les émotions"
                }
            ]
        },
        consejos: {
            titulo: "Conseils de Bien-être",
            descripcion: "Petits changements pour améliorer votre quotidien",
            categorias: [
                {
                    nombre: "Gestion du Stress",
                    consejos: [
                        "Prenez des pauses de 5 minutes chaque heure",
                        "Pratiquez la respiration profonde 3 fois par jour",
                        "Écrivez 3 choses pour lesquelles vous êtes reconnaissant",
                        "Sortez marcher même si c'est juste 10 minutes",
                        "Limitez les nouvelles négatives à 30 min/jour"
                    ]
                },
                {
                    nombre: "Énergie et Motivation",
                    consejos: [
                        "Commencez la journée avec un petit objectif",
                        "Célébrez chaque réussite, aussi petite soit-elle",
                        "Rappelez-vous pourquoi vous avez créé votre entreprise",
                        "Connectez-vous avec d'autres entrepreneurs",
                        "Visualisez votre succès chaque jour"
                    ]
                }
            ]
        },
        meditacion: {
            titulo: "Méditations Guidées",
            descripcion: "Relaxation et pleine conscience pour entrepreneurs",
            tipos: [
                {
                    nombre: "Méditation de Respiration",
                    duracion: "5 minutes",
                    nivel: "Débutant",
                    descripcion: "Concentrez votre attention sur la respiration pour calmer l'esprit"
                },
                {
                    nombre: "Méditation de Gratitude",
                    duracion: "10 minutes",
                    nivel: "Intermédiaire",
                    descripcion: "Réfléchissez aux bonnes choses de votre vie"
                }
            ]
        },
        musica: {
            titulo: "Musique Relaxante",
            descripcion: "Sons pour calmer l'esprit et réduire le stress",
            generos: [
                {
                    nombre: "Sons de la Nature",
                    descripcion: "Pluie, vagues, chants d'oiseaux"
                },
                {
                    nombre: "Musique Instrumentale",
                    descripcion: "Piano, guitare, bols tibétains"
                }
            ]
        },
        mensajes: {
            bienvenida: "Bienvenue dans votre espace de bien-être",
            motivacion: [
                "Vous êtes plus fort que vous ne le pensez",
                "Chaque jour est une nouvelle opportunité",
                "Votre progrès ne se mesure pas seulement en ventes",
                "C'est normal d'avoir des jours difficiles",
                "Vous n'êtes pas seul dans ce voyage"
            ],
            aliento: [
                "Respirez profondément, tout ira bien",
                "Prenez un moment pour vous",
                "Rappelez-vous pourquoi vous avez commencé",
                "Chaque effort compte",
                "Vous méritez de vous reposer et de prendre soin de vous"
            ]
        }
    },

    // ==================== DEUTSCH ====================
    de: {
        respiracion: {
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
                },
                {
                    nombre: "Quadratische Atmung",
                    descripcion: "Technik zur Zentrierung der Aufmerksamkeit",
                    instrucciones: [
                        "4 Sekunden einatmen",
                        "4 Sekunden halten",
                        "4 Sekunden ausatmen",
                        "4 Sekunden warten",
                        "Zyklus wiederholen"
                    ],
                    duracion: "5 Minuten",
                    beneficios: "Verbessert Konzentration, reduziert Stress, balanciert Emotionen"
                }
            ]
        },
        consejos: {
            titulo: "Wellness-Tipps",
            descripcion: "Kleine Veränderungen, um Ihren Alltag zu verbessern",
            categorias: [
                {
                    nombre: "Stressmanagement",
                    consejos: [
                        "Machen Sie alle 5 Minuten 5-Minuten-Pausen",
                        "Praktizieren Sie 3-mal täglich tiefes Atmen",
                        "Schreiben Sie 3 Dinge auf, für die Sie dankbar sind",
                        "Gehen Sie spazieren, auch wenn es nur 10 Minuten sind",
                        "Begrenzen Sie negative Nachrichten auf 30 Min/Tag"
                    ]
                },
                {
                    nombre: "Energie und Motivation",
                    consejos: [
                        "Beginnen Sie den Tag mit einem kleinen Ziel",
                        "Feiern Sie jede Errungenschaft, egal wie klein",
                        "Erinnern Sie sich daran, warum Sie Ihr Unternehmen gegründet haben",
                        "Verbinden Sie sich mit anderen Unternehmern",
                        "Visualisieren Sie täglich Ihren Erfolg"
                    ]
                }
            ]
        },
        meditacion: {
            titulo: "Geführte Meditationen",
            descripcion: "Entspannung und Achtsamkeit für Unternehmer",
            tipos: [
                {
                    nombre: "Atemmeditation",
                    duracion: "5 Minuten",
                    nivel: "Anfänger",
                    descripcion: "Konzentrieren Sie Ihre Aufmerksamkeit auf den Atem, um den Geist zu beruhigen"
                },
                {
                    nombre: "Dankbarkeitsmeditation",
                    duracion: "10 Minuten",
                    nivel: "Mittelstufe",
                    descripcion: "Reflektieren Sie über die guten Dinge in Ihrem Leben"
                }
            ]
        },
        musica: {
            titulo: "Entspannungsmusik",
            descripcion: "Klänge, um den Geist zu beruhigen und Stress zu reduzieren",
            generos: [
                {
                    nombre: "Naturgeräusche",
                    descripcion: "Regen, Wellen, Vogelgesang"
                },
                {
                    nombre: "Instrumentalmusik",
                    descripcion: "Klavier, Gitarre, tibetische Schalen"
                }
            ]
        },
        mensajes: {
            bienvenida: "Willkommen in Ihrem Wellness-Raum",
            motivacion: [
                "Sie sind stärker, als Sie denken",
                "Jeder Tag ist eine neue Gelegenheit",
                "Ihr Fortschritt wird nicht nur an Verkäufen gemessen",
                "Es ist in Ordnung, schwierige Tage zu haben",
                "Sie sind nicht allein auf dieser Reise"
            ],
            aliento: [
                "Atmen Sie tief durch, alles wird gut",
                "Nehmen Sie sich einen Moment für sich",
                "Erinnern Sie sich daran, warum Sie angefangen haben",
                "Jede Anstrengung zählt",
                "Sie verdienen es, sich auszuruhen und sich um sich zu kümmern"
            ]
        }
    },

    // ==================== ITALIANO ====================
    it: {
        respiracion: {
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
                },
                {
                    nombre: "Respirazione Quadrata",
                    descripcion: "Tecnica per centrare l'attenzione",
                    instrucciones: [
                        "Inspirare per 4 secondi",
                        "Trattenere per 4 secondi",
                        "Espirare per 4 secondi",
                        "Aspettare 4 secondi",
                        "Ripetere il ciclo"
                    ],
                    duracion: "5 minuti",
                    beneficios: "Migliora concentrazione, riduce stress, bilancia emozioni"
                }
            ]
        },
        consejos: {
            titulo: "Consigli di Benessere",
            descripcion: "Piccoli cambiamenti per migliorare la tua giornata",
            categorias: [
                {
                    nombre: "Gestione dello Stress",
                    consejos: [
                        "Fai pause di 5 minuti ogni ora",
                        "Pratica respirazione profonda 3 volte al giorno",
                        "Scrivi 3 cose per cui sei grato",
                        "Fai una passeggiata anche solo per 10 minuti",
                        "Limita le notizie negative a 30 min/giorno"
                    ]
                },
                {
                    nombre: "Energia e Motivazione",
                    consejos: [
                        "Inizia la giornata con un obiettivo piccolo",
                        "Celebra ogni risultato, per quanto piccolo",
                        "Ricorda perché hai iniziato la tua attività",
                        "Connettiti con altri imprenditori",
                        "Visualizza il tuo successo ogni giorno"
                    ]
                }
            ]
        },
        meditacion: {
            titulo: "Meditazioni Guidate",
            descripcion: "Rilassamento e mindfulness per imprenditori",
            tipos: [
                {
                    nombre: "Meditazione del Respiro",
                    duracion: "5 minuti",
                    nivel: "Principiante",
                    descripcion: "Concentra la tua attenzione sul respiro per calmare la mente"
                },
                {
                    nombre: "Meditazione della Gratitudine",
                    duracion: "10 minuti",
                    nivel: "Intermedio",
                    descripcion: "Rifletti sulle cose buone della tua vita"
                }
            ]
        },
        musica: {
            titulo: "Musica Rilassante",
            descripcion: "Suoni per calmare la mente e ridurre lo stress",
            generos: [
                {
                    nombre: "Suoni della Natura",
                    descripcion: "Pioggia, onde, canti di uccelli"
                },
                {
                    nombre: "Musica Strumentale",
                    descripcion: "Pianoforte, chitarra, ciotole tibetane"
                }
            ]
        },
        mensajes: {
            bienvenida: "Benvenuto nel tuo spazio di benessere",
            motivacion: [
                "Sei più forte di quanto pensi",
                "Ogni giorno è una nuova opportunità",
                "I tuoi progressi non si misurano solo nelle vendite",
                "È normale avere giorni difficili",
                "Non sei solo in questo viaggio"
            ],
            aliento: [
                "Respira profondamente, tutto andrà bene",
                "Prenditi un momento per te",
                "Ricorda perché hai iniziato",
                "Ogni sforzo conta",
                "Meriti di riposare e prenderti cura di te"
            ]
        }
    }
};

// Función para obtener recursos según idioma
function obtenerRecursosPorIdioma(idioma) {
    return RECURSOS_MULTI_IDIOMA[idioma] || RECURSOS_MULTI_IDIOMA.es;
}

// Función para detectar idioma del navegador
function detectarIdiomaNavegador() {
    const idioma = navigator.language || navigator.userLanguage;
    
    // Mapear códigos de idioma a nuestros idiomas soportados
    const idiomasSoportados = {
        'es': 'es', 'es-AR': 'es', 'es-MX': 'es', 'es-ES': 'es',
        'en': 'en', 'en-US': 'en', 'en-GB': 'en', 'en-CA': 'en',
        'pt': 'pt', 'pt-BR': 'pt', 'pt-PT': 'pt',
        'fr': 'fr', 'fr-FR': 'fr', 'fr-CA': 'fr',
        'de': 'de', 'de-DE': 'de', 'de-AT': 'de', 'de-CH': 'de',
        'it': 'it', 'it-IT': 'it', 'it-CH': 'it'
    };
    
    // Obtener código base del idioma (ej: 'es' de 'es-AR')
    const codigoBase = idioma.split('-')[0];
    
    return idiomasSoportados[idioma] || idiomasSoportados[codigoBase] || 'es';
}

// Función para cambiar idioma dinámicamente
function cambiarIdioma(idioma) {
    if (RECURSOS_MULTI_IDIOMA[idioma]) {
        // Guardar preferencia del usuario
        localStorage.setItem('cresalia_idioma_bienestar', idioma);
        
        // Recargar recursos si ya están inicializados
        if (window.recursosBienestar) {
            window.recursosBienestar.idioma = idioma;
            window.recursosBienestar.cargarRecursos();
        }
        
        if (window.integracionBienestar) {
            window.integracionBienestar.idioma = idioma;
            window.integracionBienestar.init();
        }
        
        return true;
    }
    return false;
}

// Función para obtener idioma guardado o detectado
function obtenerIdiomaPreferido() {
    const idiomaGuardado = localStorage.getItem('cresalia_idioma_bienestar');
    return idiomaGuardado || detectarIdiomaNavegador();
}

// Exportar funciones y recursos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RECURSOS_MULTI_IDIOMA,
        obtenerRecursosPorIdioma,
        detectarIdiomaNavegador,
        cambiarIdioma,
        obtenerIdiomaPreferido
    };
} else {
    // Para uso en navegador
    window.RECURSOS_MULTI_IDIOMA = RECURSOS_MULTI_IDIOMA;
    window.obtenerRecursosPorIdioma = obtenerRecursosPorIdioma;
    window.detectarIdiomaNavegador = detectarIdiomaNavegador;
    window.cambiarIdioma = cambiarIdioma;
    window.obtenerIdiomaPreferido = obtenerIdiomaPreferido;
}























