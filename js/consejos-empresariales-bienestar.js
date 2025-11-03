// ===== SISTEMA DE CONSEJOS EMPRESARIALES Y BIENESTAR =====
// Música, consejos y bienestar emocional para emprendedores

console.log('💜 Iniciando sistema de consejos empresariales y bienestar...');

// ===== MÚSICA PARA EMPRENDEDORES =====
const MUSICA_BIENESTAR = {
    motivacional: [
        {
            titulo: "🎵 Energía Matutina",
            descripcion: "Para empezar el día con energía",
            playlist: [
                "Eye of the Tiger - Survivor",
                "Stronger - Kanye West", 
                "Hall of Fame - The Script",
                "Believer - Imagine Dragons",
                "Fight Song - Rachel Platten"
            ],
            duracion: "25 min"
        },
        {
            titulo: "🎵 Concentración Profunda",
            descripcion: "Para trabajar con máxima concentración",
            playlist: [
                "Lofi Hip Hop Radio",
                "Focus Music - Alpha Waves",
                "Binaural Beats for Concentration",
                "Ambient Study Music",
                "Classical Music for Focus"
            ],
            duracion: "60 min"
        },
        {
            titulo: "🎵 Relajación Post-Trabajo",
            descripcion: "Para desconectar y relajarse",
            playlist: [
                "Weightless - Marconi Union",
                "Rain Sounds for Relaxation",
                "Meditation Music - Zen",
                "Nature Sounds - Ocean",
                "Piano Relaxation Music"
            ],
            duracion: "30 min"
        },
        {
            titulo: "🎵 Música para Ansiedad",
            descripcion: "Sonidos que calman la mente y reducen el estrés",
            playlist: [
                "Binaural Beats - Alpha Waves",
                "432 Hz - Healing Frequency",
                "White Noise - Ocean Waves",
                "Piano Meditativo - Ludovico Einaudi",
                "Sonidos de Lluvia - 10 Horas"
            ],
            duracion: "45 min"
        },
        {
            titulo: "🎵 Música para Dormir",
            descripcion: "Para descansar y recuperar energías",
            playlist: [
                "Sleep Music - Delta Waves",
                "Piano Nocturno - Chopin",
                "Sonidos de Bosque - Noche",
                "Música de Cuna - Instrumental",
                "Meditación Guiada - Sueño Profundo"
            ],
            duracion: "60 min"
        }
    ],
    
    argentina: [
        {
            titulo: "🎵 Folklore Motivacional",
            descripcion: "Música argentina para emprendedores",
            playlist: [
                "Zamba de mi Esperanza - Mercedes Sosa",
                "Gracias a la Vida - Violeta Parra",
                "Alfonsina y el Mar - Mercedes Sosa",
                "Volver - Carlos Gardel",
                "Cambalache - Enrique Santos Discépolo"
            ],
            duracion: "35 min"
        },
        {
            titulo: "🎵 Rock Nacional Empresarial",
            descripcion: "Rock argentino para motivarse",
            playlist: [
                "Soda Stereo - De Música Ligera",
                "Los Fabulosos Cadillacs - Matador",
                "Charly García - No Voy en Tren",
                "Fito Páez - 11 y 6",
                "Gustavo Cerati - Te Para Tres"
            ],
            duracion: "40 min"
        }
    ],
    
    latinoamericana: [
        {
            titulo: "🎵 Música Latinoamericana Motivacional",
            descripcion: "Música que inspira a emprendedores de toda Latinoamérica",
            playlist: [
                "La Vida es un Carnaval - Celia Cruz",
                "Baila Baila Baila - Ozuna",
                "Despacito - Luis Fonsi",
                "Mi Gente - J Balvin",
                "Vivir Mi Vida - Marc Anthony"
            ],
            duracion: "30 min"
        },
        {
            titulo: "🎵 Éxitos Empresariales Latinoamericanos",
            descripcion: "Canciones que hablan de superación y éxito",
            playlist: [
                "No Me Arrepiento de Este Amor - Gilda",
                "El Amor Después del Amor - Fito Páez",
                "Soy - Jairo",
                "Volver - Carlos Gardel",
                "Gracias a la Vida - Violeta Parra"
            ],
            duracion: "35 min"
        }
    ]
};

// ===== CONSEJOS EMPRESARIALES =====
const CONSEJOS_EMPRESARIALES = {
    crecimiento: [
        {
            titulo: "📈 Cómo Duplicar tus Ventas",
            consejo: "Enfócate en tus 3 productos más vendidos. Mejora su presentación, agrega testimonios reales y ofrécelos en paquetes. Los clientes compran más cuando ven valor agregado.",
            categoria: "Ventas",
            dificultad: "Intermedio"
        },
        {
            titulo: "💬 El Poder del WhatsApp Business",
            consejo: "Usa WhatsApp Business para crear catálogos, enviar promociones y atender consultas. Es GRATIS y tus clientes ya lo usan. ¡Aprovecha esta herramienta!",
            categoria: "Marketing",
            dificultad: "Fácil"
        },
        {
            titulo: "📱 Instagram: Tu Vitrina Digital",
            consejo: "Publica 1 foto de producto al día, usa hashtags locales (#corrientes, #emprendimiento), responde todos los comentarios y comparte historias de tu proceso de trabajo.",
            categoria: "Redes Sociales",
            dificultad: "Fácil"
        },
        {
            titulo: "🎯 Nicho Específico = Más Ventas",
            consejo: "En lugar de vender 'ropa', vende 'ropa para mujeres profesionales de 25-35 años'. Un nicho específico atrae clientes más comprometidos y dispuestos a pagar más.",
            categoria: "Estrategia",
            dificultad: "Intermedio"
        },
        {
            titulo: "💰 Precios que Venden",
            consejo: "En lugar de $1000, vende a $999. Los precios que terminan en 9 se perciben como más baratos. También ofrece 3 opciones: básica, estándar y premium.",
            categoria: "Precios",
            dificultad: "Fácil"
        }
    ],
    
    bienestar: [
        {
            titulo: "🧘‍♀️ Respiración para el Estrés",
            consejo: "Cuando sientas ansiedad: inhala 4 segundos, mantén 4 segundos, exhala 4 segundos. Repite 5 veces. Esta técnica reduce el cortisol (hormona del estrés) inmediatamente.",
            categoria: "Bienestar",
            dificultad: "Fácil"
        },
        {
            titulo: "⏰ La Regla del 90-20",
            consejo: "Trabaja 90 minutos intensos, descansa 20 minutos. Tu cerebro funciona mejor en ciclos. Durante el descanso: camina, bebe agua o escucha música relajante.",
            categoria: "Productividad",
            dificultad: "Fácil"
        },
        {
            titulo: "🌅 Rutina Matutina de Éxito",
            consejo: "Despierta 1 hora antes de lo normal. Dedica 20 min a meditar/reflexionar, 20 min a ejercicio ligero, 20 min a planificar el día. Tu productividad se triplicará.",
            categoria: "Hábitos",
            dificultad: "Intermedio"
        },
        {
            titulo: "💪 Fortalece tu Mentalidad",
            consejo: "Escribe 3 logros diarios, por pequeños que sean. Tu cerebro necesita recordar éxitos para mantener la motivación. La gratitud es el combustible del emprendedor.",
            categoria: "Mentalidad",
            dificultad: "Fácil"
        },
        {
            titulo: "🤝 Red de Apoyo Emocional",
            consejo: "Conecta con otros emprendedores. El emprendimiento puede ser solitario. Únete a grupos de WhatsApp, Facebook o eventos locales. Juntos somos más fuertes.",
            categoria: "Comunidad",
            dificultad: "Fácil"
        }
    ],
    
    saludMental: [
        {
            titulo: "🧘‍♀️ Técnica 4-7-8 para Ansiedad",
            consejo: "Inhala 4 segundos, mantén 7 segundos, exhala 8 segundos. Repite 4 veces. Esta técnica activa el sistema nervioso parasimpático y reduce la ansiedad inmediatamente.",
            categoria: "Salud Mental",
            dificultad: "Fácil"
        },
        {
            titulo: "🌅 Rutina Matutina Anti-Estrés",
            consejo: "Despierta 30 min antes. Dedica 10 min a estiramientos suaves, 10 min a respiración profunda, 10 min a planificar el día. Tu mente estará más clara y tranquila.",
            categoria: "Bienestar",
            dificultad: "Fácil"
        },
        {
            titulo: "📝 Diario de Gratitud Emocional",
            consejo: "Escribe 3 cosas por las que estés agradecido cada día. La gratitud reduce el cortisol (hormona del estrés) y aumenta la serotonina (hormona de la felicidad).",
            categoria: "Salud Mental",
            dificultad: "Fácil"
        },
        {
            titulo: "🚶‍♀️ Caminata Terapéutica",
            consejo: "Camina 20 minutos al día, preferiblemente en la naturaleza. El movimiento libera endorfinas y el contacto con la naturaleza reduce el estrés y la ansiedad.",
            categoria: "Ejercicio",
            dificultad: "Fácil"
        },
        {
            titulo: "💤 Higiene del Sueño Emocional",
            consejo: "Duerme 7-8 horas, sin pantallas 1 hora antes de dormir. El sueño reparador es fundamental para la salud mental. Un emprendedor descansado toma mejores decisiones.",
            categoria: "Salud Mental",
            dificultad: "Intermedio"
        },
        {
            titulo: "🎵 Música Terapéutica",
            consejo: "Escucha música a 60 BPM (latidos por minuto) para relajarte. La música lenta sincroniza tu ritmo cardíaco y reduce la ansiedad. Usa auriculares para mejor efecto.",
            categoria: "Terapia",
            dificultad: "Fácil"
        },
        {
            titulo: "🤗 Auto-Abrazo Diario",
            consejo: "Dáte un abrazo fuerte por 20 segundos cada día. Esto libera oxitocina (hormona del amor) y reduce el cortisol. Es una técnica de auto-cuidado muy poderosa.",
            categoria: "Auto-Cuidado",
            dificultad: "Fácil"
        },
        {
            titulo: "🌱 Técnica de Grounding",
            consejo: "Cuando sientas ansiedad, nombra 5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas. Esto te conecta con el presente y calma la mente.",
            categoria: "Salud Mental",
            dificultad: "Fácil"
        }
    ],
    
    argentinos: [
        {
            titulo: "🇦🇷 Aprovecha el Turismo Argentino",
            consejo: "Argentina recibe millones de turistas. Crea productos/servicios para visitantes: souvenirs, tours gastronómicos, artesanías locales. El turismo es tu mercado natural.",
            categoria: "Oportunidad Nacional",
            dificultad: "Intermedio"
        },
        {
            titulo: "🏪 Ferias y Eventos Locales",
            consejo: "Participa en ferias de emprendedores, eventos del municipio, fiestas patronales. Son oportunidades GRATUITAS para mostrar tu producto y hacer networking.",
            categoria: "Marketing Local",
            dificultad: "Fácil"
        },
        {
            titulo: "🤝 Red de Emprendedores Argentinos",
            consejo: "Conecta con otros emprendedores de tu ciudad y provincia. Intercambien clientes, colaboren en eventos, se apoyen mutuamente. La unión hace la fuerza.",
            categoria: "Networking",
            dificultad: "Fácil"
        }
    ]
};

// ===== CONSEJOS DE CRECIMIENTO DE VENTAS =====
const CONSEJOS_VENTAS = {
    digital: [
        {
            titulo: "📸 Fotos que Venden",
            consejo: "Usa luz natural, fondo limpio, diferentes ángulos. Una foto profesional puede aumentar tus ventas un 40%. Invierte en buenas fotos, es tu mejor marketing.",
            accion: "Tomar 5 fotos profesionales de tu producto estrella"
        },
        {
            titulo: "📝 Historias que Conectan",
            consejo: "Cuenta la historia detrás de tu producto: por qué lo creaste, qué problema resuelve, cómo lo haces. Las personas compran emociones, no productos.",
            accion: "Escribir la historia de tu emprendimiento en 3 párrafos"
        },
        {
            titulo: "⭐ Testimonios Reales",
            consejo: "Pide a tus clientes satisfechos que te dejen reseñas con fotos. Un testimonio con foto vale 10 veces más que una reseña sin imagen.",
            accion: "Contactar a 3 clientes satisfechos para pedir testimonios"
        }
    ],
    
    presencial: [
        {
            titulo: "🗣️ Venta Personal Efectiva",
            consejo: "Escucha más de lo que hablas. Haz preguntas sobre sus necesidades, no sobre tu producto. Vende la solución, no las características.",
            accion: "Practicar hacer 3 preguntas antes de presentar tu producto"
        },
        {
            titulo: "🎁 Muestras Gratuitas",
            consejo: "Ofrece muestras pequeñas gratis. La gente compra más cuando puede probar primero. Es una inversión que se paga sola.",
            accion: "Preparar 10 muestras pequeñas para regalar"
        },
        {
            titulo: "📞 Seguimiento Post-Venta",
            consejo: "Llama a tus clientes 3 días después de la compra. Pregunta cómo les fue, si necesitan algo más. El 70% de las ventas vienen de clientes existentes.",
            accion: "Crear lista de clientes para hacer seguimiento"
        }
    ]
};

// ===== FUNCIONES PARA MOSTRAR CONSEJOS =====

// Función para mostrar música de bienestar
function mostrarMusicaBienestar() {
    console.log('🎵 Mostrando música de bienestar...');
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); z-index: 99999; display: flex; 
        align-items: center; justify-content: center; padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 15px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #374151;">🎵 Música para Emprendedores</h3>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div style="padding: 20px;">
                <div style="display: grid; gap: 20px;">
                    ${MUSICA_BIENESTAR.motivacional.map(playlist => `
                        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid #8b5cf6;">
                            <h4 style="margin: 0 0 10px 0; color: #374151;">${playlist.titulo}</h4>
                            <p style="margin: 0 0 15px 0; color: #6b7280;">${playlist.descripcion} - ${playlist.duracion}</p>
                            <div style="background: white; padding: 15px; border-radius: 8px;">
                                <h5 style="margin: 0 0 10px 0; color: #374151;">🎶 Playlist:</h5>
                                <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                                    ${playlist.playlist.map(cancion => `<li style="margin-bottom: 5px;">${cancion}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                    
                    <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 10px 0; color: #374151;">🇦🇷 Música Argentina</h4>
                        <p style="margin: 0 0 15px 0; color: #6b7280;">Para conectar con tu identidad argentina</p>
                        ${MUSICA_BIENESTAR.argentina.map(playlist => `
                            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="margin: 0 0 10px 0; color: #374151;">${playlist.titulo}</h5>
                                <p style="margin: 0 0 10px 0; color: #6b7280;">${playlist.descripcion} - ${playlist.duracion}</p>
                                <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                                    ${playlist.playlist.map(cancion => `<li style="margin-bottom: 5px;">${cancion}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; border-left: 4px solid #22c55e;">
                        <h4 style="margin: 0 0 10px 0; color: #374151;">🌎 Música Latinoamericana</h4>
                        <p style="margin: 0 0 15px 0; color: #6b7280;">Para conectar con emprendedores de toda Latinoamérica</p>
                        ${MUSICA_BIENESTAR.latinoamericana.map(playlist => `
                            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="margin: 0 0 10px 0; color: #374151;">${playlist.titulo}</h5>
                                <p style="margin: 0 0 10px 0; color: #6b7280;">${playlist.descripcion} - ${playlist.duracion}</p>
                                <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                                    ${playlist.playlist.map(cancion => `<li style="margin-bottom: 5px;">${cancion}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Función para mostrar consejos empresariales
function mostrarConsejosEmpresariales() {
    console.log('💼 Mostrando consejos empresariales...');
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); z-index: 99999; display: flex; 
        align-items: center; justify-content: center; padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 15px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #374151;">💼 Consejos Empresariales</h3>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div style="padding: 20px;">
                <div style="display: grid; gap: 20px;">
                    <!-- Consejos de Crecimiento -->
                    <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; border-left: 4px solid #0ea5e9;">
                        <h4 style="margin: 0 0 15px 0; color: #374151;">📈 Crecimiento de Ventas</h4>
                        ${CONSEJOS_EMPRESARIALES.crecimiento.map(consejo => `
                            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="margin: 0 0 8px 0; color: #374151;">${consejo.titulo}</h5>
                                <p style="margin: 0 0 8px 0; color: #4b5563;">${consejo.consejo}</p>
                                <div style="display: flex; gap: 10px; margin-top: 10px;">
                                    <span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${consejo.categoria}</span>
                                    <span style="background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${consejo.dificultad}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Consejos de Bienestar -->
                    <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; border-left: 4px solid #22c55e;">
                        <h4 style="margin: 0 0 15px 0; color: #374151;">💜 Bienestar Emocional</h4>
                        ${CONSEJOS_EMPRESARIALES.bienestar.map(consejo => `
                            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="margin: 0 0 8px 0; color: #374151;">${consejo.titulo}</h5>
                                <p style="margin: 0 0 8px 0; color: #4b5563;">${consejo.consejo}</p>
                                <div style="display: flex; gap: 10px; margin-top: 10px;">
                                    <span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${consejo.categoria}</span>
                                    <span style="background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${consejo.dificultad}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Consejos de Salud Mental -->
                    <div style="background: #fef2f2; padding: 20px; border-radius: 10px; border-left: 4px solid #ef4444;">
                        <h4 style="margin: 0 0 15px 0; color: #374151;">🧠 Salud Mental para Emprendedores</h4>
                        ${CONSEJOS_EMPRESARIALES.saludMental.map(consejo => `
                            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="margin: 0 0 8px 0; color: #374151;">${consejo.titulo}</h5>
                                <p style="margin: 0 0 8px 0; color: #4b5563;">${consejo.consejo}</p>
                                <div style="display: flex; gap: 10px; margin-top: 10px;">
                                    <span style="background: #fef2f2; color: #dc2626; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${consejo.categoria}</span>
                                    <span style="background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${consejo.dificultad}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Consejos Argentinos -->
                    <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
                        <h4 style="margin: 0 0 15px 0; color: #374151;">🇦🇷 Oportunidades Argentinas</h4>
                        ${CONSEJOS_EMPRESARIALES.argentinos.map(consejo => `
                            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="margin: 0 0 8px 0; color: #374151;">${consejo.titulo}</h5>
                                <p style="margin: 0 0 8px 0; color: #4b5563;">${consejo.consejo}</p>
                                <div style="display: flex; gap: 10px; margin-top: 10px;">
                                    <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${consejo.categoria}</span>
                                    <span style="background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${consejo.dificultad}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Función para mostrar consejos de ventas
function mostrarConsejosVentas() {
    console.log('💰 Mostrando consejos de ventas...');
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); z-index: 99999; display: flex; 
        align-items: center; justify-content: center; padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 15px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #374151;">💰 Cómo Hacer Crecer tus Ventas</h3>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div style="padding: 20px;">
                <div style="display: grid; gap: 20px;">
                    <!-- Ventas Digitales -->
                    <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; border-left: 4px solid #0ea5e9;">
                        <h4 style="margin: 0 0 15px 0; color: #374151;">📱 Ventas Digitales</h4>
                        ${CONSEJOS_VENTAS.digital.map(consejo => `
                            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="margin: 0 0 8px 0; color: #374151;">${consejo.titulo}</h5>
                                <p style="margin: 0 0 10px 0; color: #4b5563;">${consejo.consejo}</p>
                                <div style="background: #f8fafc; padding: 10px; border-radius: 6px; border-left: 3px solid #0ea5e9;">
                                    <strong style="color: #374151;">🎯 Acción:</strong> <span style="color: #4b5563;">${consejo.accion}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Ventas Presenciales -->
                    <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; border-left: 4px solid #22c55e;">
                        <h4 style="margin: 0 0 15px 0; color: #374151;">🤝 Ventas Presenciales</h4>
                        ${CONSEJOS_VENTAS.presencial.map(consejo => `
                            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                <h5 style="margin: 0 0 8px 0; color: #374151;">${consejo.titulo}</h5>
                                <p style="margin: 0 0 10px 0; color: #4b5563;">${consejo.consejo}</p>
                                <div style="background: #f8fafc; padding: 10px; border-radius: 6px; border-left: 3px solid #22c55e;">
                                    <strong style="color: #374151;">🎯 Acción:</strong> <span style="color: #4b5563;">${consejo.accion}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Hacer las funciones disponibles globalmente
window.mostrarMusicaBienestar = mostrarMusicaBienestar;
window.mostrarConsejosEmpresariales = mostrarConsejosEmpresariales;
window.mostrarConsejosVentas = mostrarConsejosVentas;

console.log('💜 Sistema de consejos empresariales y bienestar cargado correctamente');
