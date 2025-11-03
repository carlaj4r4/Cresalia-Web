/**
 * 🔗 INTEGRACIÓN BIENESTAR - CRESALIA
 * Conecta los recursos de bienestar con el sistema de respaldo emocional existente
 * Interconecta con el panel de Carla para mensajes y recursos
 */

class IntegracionBienestar {
    constructor(tenantSlug, idioma = 'es') {
        this.tenantSlug = tenantSlug;
        this.idioma = idioma;
        this.sistemaApoyo = null;
        this.recursosBienestar = null;
        this.diarioEmocional = null;
        
        this.init();
    }

    async init() {
        console.log('🔗 Inicializando Integración de Bienestar');
        
        // Cargar recursos de bienestar
        if (typeof RecursosBienestarEmocional !== 'undefined') {
            this.recursosBienestar = new RecursosBienestarEmocional(this.tenantSlug, this.idioma);
        }
        
        // Conectar con sistema de apoyo existente
        this.conectarConSistemaApoyo();
        
        // Conectar con diario emocional
        this.conectarConDiarioEmocional();
        
        console.log('✅ Integración de Bienestar completada');
    }

    // ==================== CONEXIÓN CON SISTEMA DE APOYO ====================
    
    conectarConSistemaApoyo() {
        // Extender el sistema de apoyo existente
        if (window.apoyoEmprendedor) {
            this.sistemaApoyo = window.apoyoEmprendedor;
            this.extenderSistemaApoyo();
        }
    }

    extenderSistemaApoyo() {
        // Agregar recursos de bienestar a las opciones de respuesta emocional
        const originalRenderRespuestaEmocional = this.sistemaApoyo.renderRespuestaEmocional;
        
        this.sistemaApoyo.renderRespuestaEmocional = (emocion, emoji) => {
            let respuesta = originalRenderRespuestaEmocional.call(this.sistemaApoyo, emocion, emoji);
            
            // Agregar recursos de bienestar según la emoción
            const recursosBienestar = this.getRecursosParaEmocion(emocion);
            
            if (recursosBienestar.length > 0) {
                const recursosHTML = recursosBienestar.map(recurso => `
                    <button class="recurso-btn" onclick="integracionBienestar.abrirRecursoBienestar('${recurso.tipo}')">
                        <span class="recurso-icono">${recurso.icono}</span>
                        <span class="recurso-titulo">${recurso.titulo}</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                `).join('');
                
                // Insertar antes del botón "Volver"
                respuesta = respuesta.replace(
                    '<button class="btn-apoyo-ghost" onclick="apoyoEmprendedor.volverInicio()">',
                    recursosHTML + '<button class="btn-apoyo-ghost" onclick="apoyoEmprendedor.volverInicio()">'
                );
            }
            
            return respuesta;
        };
    }

    // Obtener recursos específicos para cada emoción
    getRecursosParaEmocion(emocion) {
        const recursos = {
            'abrumado': [
                { tipo: 'respiracion', titulo: '🧘 Técnicas de Respiración', icono: '🌸' },
                { tipo: 'meditacion', titulo: '🍃 Meditación Guiada', icono: '🧘' },
                { tipo: 'musica', titulo: '🎵 Música Relajante', icono: '🎶' }
            ],
            'dificil': [
                { tipo: 'respiracion', titulo: '💨 Respiración Calmante', icono: '🌬️' },
                { tipo: 'consejos', titulo: '💡 Consejos de Bienestar', icono: '✨' },
                { tipo: 'ejercicios', titulo: '🏃 Ejercicios Físicos', icono: '💪' }
            ],
            'regular': [
                { tipo: 'consejos', titulo: '🌟 Tips de Motivación', icono: '⭐' },
                { tipo: 'musica', titulo: '🎼 Música Energizante', icono: '🎵' },
                { tipo: 'ejercicios', titulo: '🤸 Ejercicios Suaves', icono: '🌱' }
            ],
            'bien': [
                { tipo: 'consejos', titulo: '📈 Mantener el Momentum', icono: '🚀' },
                { tipo: 'ejercicios', titulo: '💃 Ejercicios Activos', icono: '⚡' },
                { tipo: 'meditacion', titulo: '🧘 Meditación Gratitud', icono: '🙏' }
            ],
            'excelente': [
                { tipo: 'consejos', titulo: '🎯 Aprovechar el Momento', icono: '💫' },
                { tipo: 'ejercicios', titulo: '🏆 Ejercicios de Celebración', icono: '🎉' },
                { tipo: 'musica', titulo: '🎊 Música de Celebración', icono: '🎵' }
            ]
        };

        return recursos[emocion] || [];
    }

    // ==================== CONEXIÓN CON DIARIO EMOCIONAL ====================
    
    conectarConDiarioEmocional() {
        // Extender el diario emocional con recursos de bienestar
        if (window.diarioEmocional) {
            this.diarioEmocional = window.diarioEmocional;
            this.extenderDiarioEmocional();
        }
    }

    extenderDiarioEmocional() {
        // Agregar botón de recursos de bienestar al diario
        const originalCrearDiario = this.diarioEmocional.crearDiario;
        
        this.diarioEmocional.crearDiario = () => {
            const diario = originalCrearDiario.call(this.diarioEmocional);
            
            // Agregar sección de recursos de bienestar
            const recursosSection = document.createElement('div');
            recursosSection.innerHTML = `
                <div class="recursos-bienestar-section">
                    <h3>
                        <i class="fas fa-heart"></i>
                        Recursos de Bienestar
                    </h3>
                    <div class="recursos-bienestar-grid">
                        <button class="recurso-bienestar-card" onclick="integracionBienestar.abrirRecursoBienestar('respiracion')">
                            <i class="fas fa-lungs"></i>
                            <span>Respiración</span>
                            <small>Técnicas calmantes</small>
                        </button>
                        <button class="recurso-bienestar-card" onclick="integracionBienestar.abrirRecursoBienestar('consejos')">
                            <i class="fas fa-lightbulb"></i>
                            <span>Consejos</span>
                            <small>Tips de bienestar</small>
                        </button>
                        <button class="recurso-bienestar-card" onclick="integracionBienestar.abrirRecursoBienestar('meditacion')">
                            <i class="fas fa-leaf"></i>
                            <span>Meditación</span>
                            <small>Relajación guiada</small>
                        </button>
                        <button class="recurso-bienestar-card" onclick="integracionBienestar.abrirRecursoBienestar('musica')">
                            <i class="fas fa-music"></i>
                            <span>Música</span>
                            <small>Sonidos relajantes</small>
                        </button>
                    </div>
                </div>
            `;
            
            // Insertar después de las estadísticas emocionales
            const statsSection = diario.querySelector('.estadisticas-emocionales');
            if (statsSection) {
                statsSection.insertAdjacentElement('afterend', recursosSection);
            }
            
            return diario;
        };
    }

    // ==================== FUNCIONES DE RECURSOS ====================
    
    abrirRecursoBienestar(tipo) {
        if (!this.recursosBienestar) {
            console.error('Recursos de bienestar no cargados');
            return;
        }

        switch(tipo) {
            case 'respiracion':
                this.recursosBienestar.mostrarPanelRecursos();
                break;
            case 'consejos':
                this.mostrarConsejosBienestar();
                break;
            case 'meditacion':
                this.mostrarMeditaciones();
                break;
            case 'musica':
                this.mostrarMusicaRelajante();
                break;
            case 'ejercicios':
                this.mostrarEjerciciosFisicos();
                break;
            default:
                this.recursosBienestar.mostrarPanelRecursos();
        }
    }

    // Mostrar consejos de bienestar
    mostrarConsejosBienestar() {
        const modal = document.createElement('div');
        modal.className = 'modal-consejos-bienestar';
        modal.innerHTML = `
            <div class="consejos-content">
                <div class="consejos-header">
                    <h2>
                        <i class="fas fa-lightbulb"></i>
                        Consejos de Bienestar
                    </h2>
                    <button class="btn-cerrar" onclick="this.closest('.modal-consejos-bienestar').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="consejos-body">
                    <div class="consejos-nav">
                        <button class="consejo-nav-btn active" data-categoria="estres">
                            <i class="fas fa-heart-pulse"></i>
                            Manejo del Estrés
                        </button>
                        <button class="consejo-nav-btn" data-categoria="energia">
                            <i class="fas fa-battery-full"></i>
                            Energía
                        </button>
                        <button class="consejo-nav-btn" data-categoria="mental">
                            <i class="fas fa-brain"></i>
                            Salud Mental
                        </button>
                    </div>

                    <div class="consejos-contenido" id="consejos-contenido">
                        ${this.renderConsejosCategoria('estres')}
                    </div>
                </div>
            </div>

            ${this.getStylesConsejos()}
        `;

        document.body.appendChild(modal);
        this.setupConsejosEventListeners(modal);
    }

    renderConsejosCategoria(categoria) {
        const consejos = {
            estres: [
                "Tomá pausas de 5 minutos cada hora de trabajo",
                "Practicá respiración profunda 3 veces al día",
                "Escribí 3 cosas por las que estés agradecido/a",
                "Salí a caminar aunque sea 10 minutos",
                "Limitá noticias negativas a 30 minutos por día",
                "Hacé estiramientos simples cada 2 horas",
                "Tomá agua regularmente durante el día",
                "Desconectá del trabajo al menos 1 hora antes de dormir"
            ],
            energia: [
                "Empezá el día con un objetivo pequeño y alcanzable",
                "Celebrá cada logro, por pequeño que sea",
                "Recordá por qué empezaste tu negocio",
                "Conectá con otros emprendedores regularmente",
                "Visualizá tu éxito todos los días",
                "Hacé ejercicio aunque sea 15 minutos",
                "Comé alimentos nutritivos y energizantes",
                "Dormí 7-8 horas por noche"
            ],
            mental: [
                "Hablá con alguien sobre cómo te sentís",
                "Practicá la autocompasión y el amor propio",
                "Separá tu valor personal de tus ventas",
                "Recordá que todos los emprendedores pasan por esto",
                "Buscá ayuda profesional si lo necesitás",
                "Practicá mindfulness o meditación",
                "Escribí en un diario tus pensamientos y emociones",
                "Rodéate de personas positivas y comprensivas"
            ]
        };

        const consejosLista = consejos[categoria] || consejos.estres;
        
        return `
            <div class="categoria-consejos">
                <h3>${this.getTituloCategoria(categoria)}</h3>
                <div class="consejos-lista">
                    ${consejosLista.map((consejo, index) => `
                        <div class="consejo-item">
                            <span class="consejo-numero">${index + 1}</span>
                            <p class="consejo-texto">${consejo}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="consejo-extra">
                    <i class="fas fa-star"></i>
                    <p><strong>Tip:</strong> Implementá 1-2 consejos por semana. La consistencia es más importante que la intensidad.</p>
                </div>
            </div>
        `;
    }

    getTituloCategoria(categoria) {
        const titulos = {
            estres: "Manejo del Estrés",
            energia: "Energía y Motivación", 
            mental: "Salud Mental"
        };
        return titulos[categoria] || "Consejos";
    }

    // Mostrar meditaciones
    mostrarMeditaciones() {
        const modal = document.createElement('div');
        modal.className = 'modal-meditaciones';
        modal.innerHTML = `
            <div class="meditaciones-content">
                <div class="meditaciones-header">
                    <h2>
                        <i class="fas fa-leaf"></i>
                        Meditaciones Guiadas
                    </h2>
                    <button class="btn-cerrar" onclick="this.closest('.modal-meditaciones').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="meditaciones-body">
                    <div class="meditacion-grid">
                        <div class="meditacion-card" onclick="integracionBienestar.iniciarMeditacion('respiración')">
                            <div class="meditacion-icon">🌬️</div>
                            <h4>Meditación de Respiración</h4>
                            <p>5 minutos • Principiante</p>
                            <span class="meditacion-desc">Enfocá tu atención en la respiración para calmar la mente</span>
                        </div>

                        <div class="meditacion-card" onclick="integracionBienestar.iniciarMeditacion('gratitud')">
                            <div class="meditacion-icon">🙏</div>
                            <h4>Meditación de Gratitud</h4>
                            <p>10 minutos • Intermedio</p>
                            <span class="meditacion-desc">Reflexioná sobre las cosas buenas de tu vida</span>
                        </div>

                        <div class="meditacion-card" onclick="integracionBienestar.iniciarMeditacion('cuerpo')">
                            <div class="meditacion-icon">🧘</div>
                            <h4>Escaneo Corporal</h4>
                            <p>15 minutos • Avanzado</p>
                            <span class="meditacion-desc">Relajá cada parte de tu cuerpo progresivamente</span>
                        </div>

                        <div class="meditacion-card" onclick="integracionBienestar.iniciarMeditacion('amor')">
                            <div class="meditacion-icon">💜</div>
                            <h4>Meditación de Amor</h4>
                            <p>12 minutos • Intermedio</p>
                            <span class="meditacion-desc">Cultivá amor y compasión hacia vos mismo y otros</span>
                        </div>
                    </div>
                </div>
            </div>

            ${this.getStylesMeditaciones()}
        `;

        document.body.appendChild(modal);
    }

    // Iniciar meditación
    iniciarMeditacion(tipo) {
        // Cerrar modal de meditaciones
        document.querySelector('.modal-meditaciones')?.remove();
        
        // Mostrar reproductor de meditación
        const modal = document.createElement('div');
        modal.className = 'modal-meditacion-activa';
        modal.innerHTML = `
            <div class="meditacion-activa-content">
                <div class="meditacion-header">
                    <h3>Meditación de ${tipo}</h3>
                    <button class="btn-cerrar" onclick="this.closest('.modal-meditacion-activa').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="meditacion-player">
                    <div class="meditacion-visual">
                        <div class="meditacion-circulo" id="meditacion-circulo">
                            <div class="meditacion-punto"></div>
                        </div>
                    </div>

                    <div class="meditacion-controles">
                        <button class="btn-play-meditacion" onclick="integracionBienestar.playMeditacion()">
                            <i class="fas fa-play"></i>
                        </button>
                        <div class="meditacion-tiempo">
                            <span class="tiempo-actual">0:00</span>
                            <span class="tiempo-total">10:00</span>
                        </div>
                    </div>

                    <div class="meditacion-instrucciones">
                        <p id="instruccion-actual">Preparate para comenzar la meditación...</p>
                    </div>
                </div>
            </div>

            ${this.getStylesMeditacionActiva()}
        `;

        document.body.appendChild(modal);
    }

    // ==================== EVENT LISTENERS ====================
    
    setupConsejosEventListeners(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.closest('.consejo-nav-btn')) {
                const btn = e.target.closest('.consejo-nav-btn');
                const categoria = btn.dataset.categoria;
                
                // Actualizar navegación
                modal.querySelectorAll('.consejo-nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Actualizar contenido
                const contenido = document.getElementById('consejos-contenido');
                contenido.innerHTML = this.renderConsejosCategoria(categoria);
            }
        });
    }

    // ==================== ESTILOS ====================
    
    getStylesConsejos() {
        return `
        <style>
            .modal-consejos-bienestar {
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

            .consejos-content {
                background: white;
                border-radius: 24px;
                max-width: 800px;
                width: 95%;
                max-height: 90vh;
                overflow: hidden;
                animation: slideInUp 0.4s ease;
            }

            .consejos-header {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                padding: 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .consejos-body {
                display: flex;
                height: 600px;
            }

            .consejos-nav {
                width: 200px;
                background: #F9FAFB;
                padding: 24px;
                border-right: 2px solid #E5E7EB;
            }

            .consejo-nav-btn {
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

            .consejo-nav-btn:hover {
                border-color: #7C3AED;
                background: #F5F3FF;
            }

            .consejo-nav-btn.active {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border-color: transparent;
            }

            .consejos-contenido {
                flex: 1;
                padding: 24px;
                overflow-y: auto;
            }

            .categoria-consejos h3 {
                color: #1F2937;
                margin-bottom: 24px;
                font-size: 24px;
            }

            .consejos-lista {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-bottom: 32px;
            }

            .consejo-item {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                padding: 20px;
                background: #F9FAFB;
                border-radius: 12px;
                border-left: 4px solid #7C3AED;
            }

            .consejo-numero {
                background: #7C3AED;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                flex-shrink: 0;
            }

            .consejo-texto {
                margin: 0;
                color: #374151;
                line-height: 1.6;
                font-size: 15px;
            }

            .consejo-extra {
                background: linear-gradient(135deg, #FEF3C7, #FDE68A);
                padding: 20px;
                border-radius: 12px;
                border-left: 4px solid #F59E0B;
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }

            .consejo-extra i {
                color: #F59E0B;
                font-size: 20px;
                margin-top: 2px;
            }

            .consejo-extra p {
                margin: 0;
                color: #78350F;
                font-size: 14px;
                line-height: 1.6;
            }

            /* Recursos de bienestar en diario */
            .recursos-bienestar-section {
                margin: 40px 0;
                padding: 32px;
                background: linear-gradient(135deg, #FDF2F8, #F5F3FF);
                border-radius: 20px;
                border: 2px solid #F3E8FF;
            }

            .recursos-bienestar-section h3 {
                color: #1F2937;
                margin-bottom: 24px;
                font-size: 24px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .recursos-bienestar-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            }

            .recurso-bienestar-card {
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 16px;
                padding: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }

            .recurso-bienestar-card:hover {
                border-color: #EC4899;
                transform: translateY(-4px);
                box-shadow: 0 8px 32px rgba(236, 72, 153, 0.2);
            }

            .recurso-bienestar-card i {
                font-size: 48px;
                color: #EC4899;
                margin-bottom: 12px;
                display: block;
            }

            .recurso-bienestar-card span {
                display: block;
                font-size: 18px;
                font-weight: 600;
                color: #1F2937;
                margin-bottom: 8px;
            }

            .recurso-bienestar-card small {
                color: #6B7280;
                font-size: 14px;
            }

            @media (max-width: 768px) {
                .consejos-body {
                    flex-direction: column;
                    height: auto;
                }

                .consejos-nav {
                    width: 100%;
                    border-right: none;
                    border-bottom: 2px solid #E5E7EB;
                }

                .recursos-bienestar-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        </style>
        `;
    }

    getStylesMeditaciones() {
        return `
        <style>
            .modal-meditaciones {
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

            .meditaciones-content {
                background: white;
                border-radius: 24px;
                max-width: 900px;
                width: 95%;
                max-height: 90vh;
                overflow: hidden;
                animation: slideInUp 0.4s ease;
            }

            .meditaciones-header {
                background: linear-gradient(135deg, #10B981, #34D399);
                color: white;
                padding: 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .meditaciones-body {
                padding: 32px;
            }

            .meditacion-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
            }

            .meditacion-card {
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 16px;
                padding: 28px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
                position: relative;
                overflow: hidden;
            }

            .meditacion-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
                transition: left 0.5s;
            }

            .meditacion-card:hover::before {
                left: 100%;
            }

            .meditacion-card:hover {
                border-color: #10B981;
                transform: translateY(-4px);
                box-shadow: 0 8px 32px rgba(16, 185, 129, 0.2);
            }

            .meditacion-icon {
                font-size: 64px;
                margin-bottom: 16px;
                animation: float 3s ease-in-out infinite;
            }

            .meditacion-card h4 {
                color: #1F2937;
                margin-bottom: 8px;
                font-size: 20px;
            }

            .meditacion-card p {
                color: #10B981;
                font-weight: 600;
                margin-bottom: 12px;
                font-size: 14px;
            }

            .meditacion-desc {
                color: #6B7280;
                font-size: 14px;
                line-height: 1.6;
            }

            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
        </style>
        `;
    }

    getStylesMeditacionActiva() {
        return `
        <style>
            .modal-meditacion-activa {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #1F2937, #374151);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                animation: fadeIn 0.3s ease;
            }

            .meditacion-activa-content {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border-radius: 24px;
                max-width: 600px;
                width: 95%;
                max-height: 90vh;
                overflow: hidden;
                animation: scaleIn 0.4s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .meditacion-header {
                color: white;
                padding: 24px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .meditacion-player {
                padding: 40px;
                text-align: center;
                color: white;
            }

            .meditacion-visual {
                margin-bottom: 40px;
            }

            .meditacion-circulo {
                width: 200px;
                height: 200px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                animation: pulse 2s infinite;
            }

            .meditacion-punto {
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                animation: breathe 4s infinite;
            }

            .meditacion-controles {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 24px;
                margin-bottom: 32px;
            }

            .btn-play-meditacion {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid white;
                color: white;
                font-size: 24px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-play-meditacion:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .meditacion-tiempo {
                display: flex;
                flex-direction: column;
                gap: 4px;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.8);
            }

            .meditacion-instrucciones {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
            }

            .meditacion-instrucciones p {
                margin: 0;
                font-size: 16px;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.9);
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
            }

            @keyframes breathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.5); }
            }
        </style>
        `;
    }
}

// Función global para inicializar integración
window.initIntegracionBienestar = function(tenantSlug, idioma = 'es') {
    window.integracionBienestar = new IntegracionBienestar(tenantSlug, idioma);
    return window.integracionBienestar;
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IntegracionBienestar };
}























