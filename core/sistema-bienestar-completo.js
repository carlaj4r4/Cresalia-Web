/**
 * 🌸 SISTEMA DE BIENESTAR COMPLETO - CRESALIA
 * Inicializa y conecta todos los componentes del sistema de bienestar emocional
 * Integra con el sistema de respaldo emocional existente
 * Soporte completo multi-idioma
 */

class SistemaBienestarCompleto {
    constructor(tenantConfig) {
        this.tenant = tenantConfig.tenant || { slug: 'default' };
        this.plan = tenantConfig.plan || 'free';
        this.metrics = tenantConfig.metrics || {};
        
        // Detectar idioma automáticamente
        this.idioma = this.obtenerIdiomaPreferido() || 'es';
        
        // Componentes del sistema
        this.recursosBienestar = null;
        this.integracionBienestar = null;
        this.sistemaApoyo = null;
        this.diarioEmocional = null;
        
        // Estado del sistema
        this.inicializado = false;
        
        console.log('🌸 Inicializando Sistema de Bienestar Completo');
        console.log(`🌍 Idioma detectado: ${this.idioma}`);
        console.log(`🏪 Tenant: ${this.tenant.slug}`);
        console.log(`📋 Plan: ${this.plan}`);
    }

    // ==================== INICIALIZACIÓN ====================
    
    async init() {
        try {
            console.log('🚀 Iniciando componentes del sistema de bienestar...');
            
            // 1. Cargar recursos multi-idioma
            await this.cargarRecursosMultiIdioma();
            
            // 2. Inicializar recursos de bienestar
            await this.inicializarRecursosBienestar();
            
            // 3. Inicializar integración
            await this.inicializarIntegracion();
            
            // 4. Conectar con sistemas existentes
            await this.conectarConSistemasExistentes();
            
            // 5. Crear interfaz unificada
            this.crearInterfazUnificada();
            
            // 6. Configurar eventos globales
            this.configurarEventosGlobales();
            
            this.inicializado = true;
            console.log('✅ Sistema de Bienestar Completo inicializado correctamente');
            
            // Mostrar notificación de bienvenida
            this.mostrarNotificacionBienvenida();
            
        } catch (error) {
            console.error('❌ Error inicializando sistema de bienestar:', error);
            this.mostrarErrorInicializacion(error);
        }
    }

    // Cargar recursos multi-idioma
    async cargarRecursosMultiIdioma() {
        // Los recursos ya están disponibles globalmente
        console.log('📚 Recursos multi-idioma cargados');
    }

    // Inicializar recursos de bienestar
    async inicializarRecursosBienestar() {
        if (typeof RecursosBienestarEmocional !== 'undefined') {
            this.recursosBienestar = new RecursosBienestarEmocional(this.tenant.slug, this.idioma);
            console.log('🌸 Recursos de bienestar inicializados');
        }
    }

    // Inicializar integración
    async inicializarIntegracion() {
        if (typeof IntegracionBienestar !== 'undefined') {
            this.integracionBienestar = new IntegracionBienestar(this.tenant.slug, this.idioma);
            console.log('🔗 Integración de bienestar inicializada');
        }
    }

    // Conectar con sistemas existentes
    async conectarConSistemasExistentes() {
        // Conectar con sistema de apoyo existente
        if (window.apoyoEmprendedor) {
            this.sistemaApoyo = window.apoyoEmprendedor;
            this.extenderSistemaApoyoExistente();
            console.log('💜 Sistema de apoyo conectado');
        }
        
        // Conectar con diario emocional existente
        if (window.diarioEmocional) {
            this.diarioEmocional = window.diarioEmocional;
            this.extenderDiarioEmocionalExistente();
            console.log('📖 Diario emocional conectado');
        }
    }

    // ==================== EXTENSIONES DE SISTEMAS EXISTENTES ====================
    
    extenderSistemaApoyoExistente() {
        // Agregar botón de recursos de bienestar al sistema de apoyo
        const originalCrearWidgetApoyo = this.sistemaApoyo.crearWidgetApoyo;
        
        this.sistemaApoyo.crearWidgetApoyo = () => {
            originalCrearWidgetApoyo.call(this.sistemaApoyo);
            this.agregarBotonRecursosBienestar();
        };
        
        // Si el widget ya existe, agregar el botón
        if (document.getElementById('apoyo-emprendedor-widget')) {
            this.agregarBotonRecursosBienestar();
        }
    }

    agregarBotonRecursosBienestar() {
        // Crear botón de recursos de bienestar
        const botonBienestar = document.createElement('button');
        botonBienestar.className = 'apoyo-bienestar-toggle';
        botonBienestar.innerHTML = `
            <i class="fas fa-heart"></i>
            <span class="bienestar-pulse"></span>
        `;
        botonBienestar.title = this.obtenerMensaje('bienvenida');
        botonBienestar.onclick = () => this.mostrarPanelBienestar();
        
        // Posicionar al lado del botón de apoyo existente
        const widgetApoyo = document.getElementById('apoyo-emprendedor-widget');
        if (widgetApoyo) {
            widgetApoyo.appendChild(botonBienestar);
        }
        
        // Agregar estilos específicos
        this.agregarEstilosBotonBienestar();
    }

    extenderDiarioEmocionalExistente() {
        // El diario emocional ya se extiende automáticamente a través de la integración
        console.log('📖 Diario emocional extendido con recursos de bienestar');
    }

    // ==================== INTERFAZ UNIFICADA ====================
    
    crearInterfazUnificada() {
        // Crear selector de idioma
        this.crearSelectorIdioma();
        
        // Crear panel de acceso rápido
        this.crearPanelAccesoRapido();
    }

    crearSelectorIdioma() {
        // VERIFICAR si ya existe un selector para evitar duplicados
        const selectorExistente = document.getElementById('idioma-bienestar');
        if (selectorExistente) {
            console.log('🌍 Selector de idioma ya existe, actualizando en lugar de duplicar');
            // Solo actualizar el valor seleccionado
            selectorExistente.value = this.idioma;
            return;
        }
        
        // Verificar si ya existe el contenedor
        const contenedorExistente = document.querySelector('.selector-idioma-bienestar');
        if (contenedorExistente) {
            console.log('🌍 Contenedor de selector ya existe, removiendo duplicado');
            contenedorExistente.remove();
        }
        
        const selector = document.createElement('div');
        selector.className = 'selector-idioma-bienestar';
        selector.innerHTML = `
            <select id="idioma-bienestar" onchange="sistemaBienestarCompleto.cambiarIdioma(this.value)">
                <option value="es" ${this.idioma === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
                <option value="en" ${this.idioma === 'en' ? 'selected' : ''}>🇺🇸 English</option>
                <option value="pt" ${this.idioma === 'pt' ? 'selected' : ''}>🇧🇷 Português</option>
                <option value="fr" ${this.idioma === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
                <option value="de" ${this.idioma === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
                <option value="it" ${this.idioma === 'it' ? 'selected' : ''}>🇮🇹 Italiano</option>
            </select>
        `;
        
        // Agregar al header o donde sea apropiado
        const header = document.querySelector('header') || document.body;
        header.appendChild(selector);
        
        console.log('🌍 Selector de idioma único creado');
    }

    crearPanelAccesoRapido() {
        // VERIFICAR si ya existe un panel para evitar duplicados
        const panelExistente = document.querySelector('.panel-acceso-rapido-bienestar');
        if (panelExistente) {
            console.log('🌸 Panel de acceso rápido ya existe, evitando duplicado');
            return;
        }
        
        const panel = document.createElement('div');
        panel.className = 'panel-acceso-rapido-bienestar collapsed';
        panel.id = 'panelBienestarWidget';
        panel.innerHTML = `
            <div class="widget-toggle-btn" onclick="window.toggleWidgetBienestar()">
                <i class="fas fa-heart"></i>
                <span class="widget-label">Bienestar</span>
            </div>
            <div class="acceso-rapido-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="margin: 0;">🌸 Recursos de Bienestar</h4>
                    <button onclick="window.toggleWidgetBienestar()" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 1.2rem; padding: 4px;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="acceso-rapido-botones">
                    <button onclick="sistemaBienestarCompleto.abrirRecurso('respiracion')" class="btn-acceso-rapido">
                        <i class="fas fa-lungs"></i>
                        ${this.obtenerMensaje('respiracion').titulo}
                    </button>
                    <button onclick="sistemaBienestarCompleto.abrirRecurso('consejos')" class="btn-acceso-rapido">
                        <i class="fas fa-lightbulb"></i>
                        ${this.obtenerMensaje('consejos').titulo}
                    </button>
                    <button onclick="sistemaBienestarCompleto.abrirRecurso('meditacion')" class="btn-acceso-rapido">
                        <i class="fas fa-leaf"></i>
                        Meditación
                    </button>
                    <button onclick="sistemaBienestarCompleto.abrirRecurso('musica')" class="btn-acceso-rapido">
                        <i class="fas fa-music"></i>
                        Música
                    </button>
                </div>
            </div>
        `;
        
        // Agregar al final de la página
        document.body.appendChild(panel);
        
        // Crear función global para toggle
        window.toggleWidgetBienestar = function() {
            panel.classList.toggle('collapsed');
            const isCollapsed = panel.classList.contains('collapsed');
            localStorage.setItem('widget-bienestar-collapsed', isCollapsed);
            console.log(isCollapsed ? '🔽 Widget minimizado' : '🔼 Widget expandido');
        };
        
        // Restaurar estado guardado
        const savedState = localStorage.getItem('widget-bienestar-collapsed');
        if (savedState === 'false') {
            panel.classList.remove('collapsed');
        }
        
        console.log('🌸 Panel de acceso rápido único creado (colapsable)');
    }

    // ==================== FUNCIONES PÚBLICAS ====================
    
    mostrarPanelBienestar() {
        if (this.recursosBienestar) {
            this.recursosBienestar.mostrarPanelRecursos();
        }
    }

    abrirRecurso(tipo) {
        if (this.integracionBienestar) {
            this.integracionBienestar.abrirRecursoBienestar(tipo);
        }
    }

    cambiarIdioma(nuevoIdioma) {
        if (cambiarIdioma(nuevoIdioma)) {
            this.idioma = nuevoIdioma;
            
            // Recargar componentes
            if (this.recursosBienestar) {
                this.recursosBienestar.idioma = nuevoIdioma;
                this.recursosBienestar.cargarRecursos();
            }
            
            if (this.integracionBienestar) {
                this.integracionBienestar.idioma = nuevoIdioma;
                this.integracionBienestar.init();
            }
            
            // Actualizar interfaz
            this.actualizarInterfazPorIdioma();
            
            this.mostrarNotificacion(`🌍 Idioma cambiado a ${nuevoIdioma.toUpperCase()}`, 'success');
        }
    }

    actualizarInterfazPorIdioma() {
        // Actualizar textos de la interfaz según el idioma actual
        const mensajes = this.obtenerMensaje();
        
        // Actualizar títulos y textos
        document.querySelectorAll('[data-texto-id]').forEach(elemento => {
            const textoId = elemento.dataset.textoId;
            if (mensajes[textoId]) {
                elemento.textContent = mensajes[textoId];
            }
        });
    }

    // ==================== UTILIDADES ====================
    
    obtenerMensaje(seccion = null) {
        // Obtener mensajes según el idioma
        const mensajes = {
            es: {
                bienvenida: "Bienvenido/a a tu espacio de bienestar",
                respiracion: {
                    titulo: "Técnicas de Respiración",
                    descripcion: "Ejercicios simples para calmar la mente"
                },
                consejos: {
                    titulo: "Consejos de Bienestar",
                    descripcion: "Pequeños cambios para mejorar tu día"
                },
                mensajes: {
                    bienvenida: "¡Tu espacio de bienestar está listo!",
                    aliento: [
                        "Recordá que sos capaz de lograr todo lo que te propongas",
                        "Cada día es una nueva oportunidad de crecer",
                        "Tu bienestar mental es tan importante como tu éxito comercial",
                        "Tomate un momento para respirar y centrarte"
                    ]
                }
            },
            en: {
                bienvenida: "Welcome to your wellness space",
                respiracion: {
                    titulo: "Breathing Techniques",
                    descripcion: "Simple exercises to calm the mind"
                },
                consejos: {
                    titulo: "Wellness Tips",
                    descripcion: "Small changes to improve your day"
                },
                mensajes: {
                    bienvenida: "Your wellness space is ready!",
                    aliento: [
                        "Remember you're capable of achieving anything you set your mind to",
                        "Each day is a new opportunity to grow",
                        "Your mental wellness is as important as your commercial success",
                        "Take a moment to breathe and center yourself"
                    ]
                }
            }
        };
        
        const recursos = mensajes[this.idioma] || mensajes.es;
        return seccion ? recursos[seccion] : recursos;
    }

    obtenerIdiomaPreferido() {
        // Detectar idioma del navegador o usar guardado
        const idiomaGuardado = localStorage.getItem('cresalia-language') || localStorage.getItem('idioma_preferido');
        if (idiomaGuardado) return idiomaGuardado;
        
        const idiomaNavegador = navigator.language || navigator.userLanguage;
        if (idiomaNavegador.startsWith('es')) return 'es';
        if (idiomaNavegador.startsWith('en')) return 'en';
        if (idiomaNavegador.startsWith('pt')) return 'pt';
        
        return 'es'; // Por defecto español
    }

    mostrarNotificacionBienvenida() {
        const mensajes = this.obtenerMensaje('mensajes');
        const mensaje = mensajes.bienvenida || 'Bienvenido/a a tu espacio de bienestar';
        
        this.mostrarNotificacion(`🌸 ${mensaje}`, 'success');
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const notif = document.createElement('div');
        notif.className = `sistema-bienestar-notificacion ${tipo}`;
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

    mostrarErrorInicializacion(error) {
        this.mostrarNotificacion('❌ Error cargando recursos de bienestar', 'error');
        console.error('Error detallado:', error);
    }

    // ==================== EVENTOS GLOBALES ====================
    
    configurarEventosGlobales() {
        // Evento para mostrar recursos cuando el usuario esté estresado
        document.addEventListener('keydown', (e) => {
            // Atajo de teclado para acceso rápido: Ctrl + Alt + B
            if (e.ctrlKey && e.altKey && e.key === 'b') {
                e.preventDefault();
                this.mostrarPanelBienestar();
            }
        });
        
        // Detectar cuando el usuario está en una página de error o problema
        this.detectarEstresUsuario();
    }

    detectarEstresUsuario() {
        // Monitorear eventos que podrían indicar estrés
        let clicksRapidos = 0;
        let ultimoClick = 0;
        
        document.addEventListener('click', (e) => {
            const ahora = Date.now();
            if (ahora - ultimoClick < 500) {
                clicksRapidos++;
                if (clicksRapidos >= 5) {
                    this.mostrarSugerenciaBienestar();
                    clicksRapidos = 0;
                }
            } else {
                clicksRapidos = 0;
            }
            ultimoClick = ahora;
        });
    }

    mostrarSugerenciaBienestar() {
        const mensajes = this.obtenerMensaje('mensajes');
        const mensaje = mensajes.aliento[Math.floor(Math.random() * mensajes.aliento.length)];
        
        const sugerencia = document.createElement('div');
        sugerencia.className = 'sugerencia-bienestar';
        sugerencia.innerHTML = `
            <div class="sugerencia-content">
                <i class="fas fa-heart"></i>
                <p>${mensaje}</p>
                <button onclick="sistemaBienestarCompleto.mostrarPanelBienestar(); this.closest('.sugerencia-bienestar').remove()">
                    Ver Recursos
                </button>
                <button onclick="this.closest('.sugerencia-bienestar').remove()" class="btn-cerrar-sugerencia">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(sugerencia);
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (sugerencia.parentElement) {
                sugerencia.remove();
            }
        }, 10000);
    }

    // ==================== ESTILOS ====================
    
    agregarEstilosBotonBienestar() {
        const styles = document.createElement('style');
        styles.textContent = `
            .apoyo-bienestar-toggle {
                position: fixed;
                bottom: 100px;
                left: 24px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #F59E0B, #FCD34D);
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
                transition: all 0.3s ease;
                position: relative;
                z-index: 9997;
                animation: pulse-bienestar 3s infinite;
            }

            @keyframes pulse-bienestar {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .apoyo-bienestar-toggle:hover {
                transform: scale(1.15);
                box-shadow: 0 6px 30px rgba(245, 158, 11, 0.6);
            }

            .bienestar-pulse {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(245, 158, 11, 0.4);
                transform: translate(-50%, -50%);
                animation: pulse-ring-bienestar 3s infinite;
            }

            @keyframes pulse-ring-bienestar {
                0% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1.5);
                    opacity: 0;
                }
            }

            .selector-idioma-bienestar {
                position: fixed;
                top: 24px;
                right: 24px;
                z-index: 9999;
            }

            .selector-idioma-bienestar select {
                background: white;
                border: 2px solid #E5E7EB;
                border-radius: 12px;
                padding: 8px 16px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .selector-idioma-bienestar select:hover {
                border-color: #EC4899;
            }

            .panel-acceso-rapido-bienestar {
                position: fixed;
                bottom: 80px;
                right: 15px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                z-index: 9998;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Widget minimizado (solo botón) - MÁS PEQUEÑO Y DISCRETO */
            .panel-acceso-rapido-bienestar.collapsed {
                width: 45px;
                height: 45px;
                padding: 0;
                border-radius: 50%;
                box-shadow: 0 2px 12px rgba(236, 72, 153, 0.2);
                background: linear-gradient(135deg, #EC4899, #F9A8D4);
                opacity: 0.85;
                transition: all 0.3s ease;
            }
            
            .panel-acceso-rapido-bienestar.collapsed:hover {
                opacity: 1;
                transform: scale(1.05);
                box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
            }
            
            .panel-acceso-rapido-bienestar.collapsed .acceso-rapido-content {
                display: none;
            }
            
            .panel-acceso-rapido-bienestar.collapsed .widget-toggle-btn {
                display: flex;
            }
            
            /* Widget expandido - MÁS COMPACTO */
            .panel-acceso-rapido-bienestar:not(.collapsed) {
                width: 180px;
                padding: 12px;
                max-height: 280px;
                overflow-y: auto;
            }
            
            .panel-acceso-rapido-bienestar:not(.collapsed) .widget-toggle-btn {
                display: none;
            }
            
            .panel-acceso-rapido-bienestar:not(.collapsed) .acceso-rapido-content {
                display: block;
            }
            
            /* Botón de toggle (cuando está minimizado) */
            .widget-toggle-btn {
                display: none;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 4px;
                width: 60px;
                height: 60px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .widget-toggle-btn i {
                font-size: 20px;
            }
            
            .widget-label {
                font-size: 9px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .panel-acceso-rapido-bienestar.collapsed:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 30px rgba(236, 72, 153, 0.5);
            }

            .acceso-rapido-content h4 {
                margin: 0 0 12px 0;
                color: #1F2937;
                font-size: 14px;
                text-align: left;
            }

            .acceso-rapido-botones {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .btn-acceso-rapido {
                background: linear-gradient(135deg, #EC4899, #F9A8D4);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 6px 8px;
                font-size: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 4px;
                text-align: left;
            }

            .btn-acceso-rapido:hover {
                background: linear-gradient(135deg, #F9A8D4, #EC4899);
                transform: translateX(-2px) scale(1.02);
                box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
            }

            .btn-acceso-rapido i {
                color: white;
                font-size: 11px;
            }

            .sistema-bienestar-notificacion {
                position: fixed;
                bottom: 24px;
                left: 24px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                z-index: 10002;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }

            .sistema-bienestar-notificacion.show {
                transform: translateY(0);
                opacity: 1;
            }

            .notif-content {
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .sistema-bienestar-notificacion.success {
                border-left: 4px solid #10B981;
            }

            .sistema-bienestar-notificacion.success i {
                color: #10B981;
            }

            .sugerencia-bienestar {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                z-index: 10003;
                max-width: 400px;
                animation: scaleIn 0.3s ease;
            }

            .sugerencia-content {
                padding: 24px;
                text-align: center;
                position: relative;
            }

            .sugerencia-content i {
                font-size: 48px;
                color: #EC4899;
                margin-bottom: 16px;
            }

            .sugerencia-content p {
                margin: 0 0 20px 0;
                color: #374151;
                line-height: 1.6;
            }

            .sugerencia-content button {
                background: linear-gradient(135deg, #EC4899, #F472B6);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                font-weight: 600;
                cursor: pointer;
                margin: 0 8px;
            }

            .btn-cerrar-sugerencia {
                position: absolute;
                top: 12px;
                right: 12px;
                background: #F3F4F6;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                color: #6B7280;
            }

            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            @media (max-width: 768px) {
                .apoyo-bienestar-toggle {
                    bottom: 120px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                /* Widget optimizado para móviles - MÁS DISCRETO */
                .panel-acceso-rapido-bienestar {
                    bottom: 70px !important;
                    right: 10px !important;
                }
                
                .panel-acceso-rapido-bienestar.collapsed {
                    width: 40px !important;
                    height: 40px !important;
                    opacity: 0.7 !important;
                }
                
                .panel-acceso-rapido-bienestar:not(.collapsed) {
                    width: 160px !important;
                    padding: 10px !important;
                    bottom: 70px !important;
                    max-height: 240px !important;
                }
                
                .widget-toggle-btn i {
                    font-size: 16px !important;
                }
                
                .widget-label {
                    font-size: 7px !important;
                }
                
                .btn-acceso-rapido {
                    padding: 5px 6px !important;
                    font-size: 9px !important;
                }
                
                .acceso-rapido-content h4 {
                    font-size: 11px !important;
                }
                
                .btn-acceso-rapido {
                    font-size: 10px !important;
                    padding: 6px 8px !important;
                }

                .selector-idioma-bienestar {
                    top: 12px;
                    right: 12px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// ==================== FUNCIÓN GLOBAL DE INICIALIZACIÓN ====================

window.initSistemaBienestarCompleto = function(tenantConfig) {
    // Solo inicializar si es un plan que califica para bienestar
    const planesBienestar = ['free', 'basic', 'pro', 'enterprise'];
    
    if (planesBienestar.includes(tenantConfig.plan.toLowerCase())) {
        window.sistemaBienestarCompleto = new SistemaBienestarCompleto(tenantConfig);
        window.sistemaBienestarCompleto.init();
        
        console.log('🌸 Sistema de Bienestar Completo iniciado para:', tenantConfig.tenant.slug);
        return window.sistemaBienestarCompleto;
    } else {
        console.log('💼 Plan no califica para recursos de bienestar:', tenantConfig.plan);
        return null;
    }
};

// ==================== INICIALIZACIÓN AUTOMÁTICA ====================

// Inicializar automáticamente si hay configuración de tenant disponible
document.addEventListener('DOMContentLoaded', () => {
    // Buscar configuración de tenant en el DOM o variables globales
    let tenantConfig = null;
    
    // Intentar obtener desde variables globales
    if (window.tenantConfig) {
        tenantConfig = window.tenantConfig;
    } else if (window.currentTenant) {
        tenantConfig = {
            tenant: window.currentTenant,
            plan: 'free', // Default
            metrics: {}
        };
    }
    
    // Si encontramos configuración, inicializar
    if (tenantConfig) {
        setTimeout(() => {
            window.initSistemaBienestarCompleto(tenantConfig);
        }, 1000); // Esperar un poco para que otros sistemas se carguen
    }
});

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SistemaBienestarCompleto };
}

// Hacer disponible globalmente
window.SistemaBienestarCompleto = SistemaBienestarCompleto;









