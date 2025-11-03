// ===== SISTEMA DE LOGROS Y GAMIFICACIÓN - CRESALIA =====
// Para mantener motivados a los emprendedores

class SistemaLogros {
    constructor(tenantConfig) {
        this.tenant = tenantConfig.tenant;
        this.plan = tenantConfig.plan;
        this.metrics = tenantConfig.metrics || {};
        this.logros = this.cargarLogros();
        this.nivel = this.calcularNivel();
        this.xp = this.calcularXP();
    }

    // Definir todos los logros
    getLogrosDefinidos() {
        return [
            // Nivel 🌱 SEMILLA
            {
                id: 'tienda_creada',
                titulo: 'Primera Tienda Creada',
                descripcion: '¡Diste el primer paso!',
                icono: '🏪',
                xp: 50,
                nivel: 'semilla',
                condicion: () => true // Siempre desbloqueado
            },
            {
                id: 'logo_subido',
                titulo: 'Logo Personalizado',
                descripcion: 'Tu marca tiene identidad',
                icono: '🎨',
                xp: 30,
                nivel: 'semilla',
                condicion: () => this.metrics.tiene_logo
            },
            {
                id: 'primer_producto',
                titulo: 'Primer Producto',
                descripcion: 'El comienzo de tu catálogo',
                icono: '📦',
                xp: 100,
                nivel: 'semilla',
                condicion: () => (this.metrics.total_productos || 0) >= 1
            },
            {
                id: 'colores_personalizados',
                titulo: 'Colores de Marca',
                descripcion: 'Tu tienda luce única',
                icono: '🎨',
                xp: 30,
                nivel: 'semilla',
                condicion: () => this.metrics.colores_personalizados
            },

            // Nivel 🌿 BROTE
            {
                id: 'cinco_productos',
                titulo: '5 Productos',
                descripcion: 'Tu catálogo crece',
                icono: '📦',
                xp: 100,
                nivel: 'brote',
                condicion: () => (this.metrics.total_productos || 0) >= 5
            },
            {
                id: 'primera_venta',
                titulo: '¡Primera Venta!',
                descripcion: '🎉 ¡Eres oficialmente un emprendedor!',
                icono: '💰',
                xp: 500,
                nivel: 'brote',
                condicion: () => (this.metrics.ventas_totales || 0) >= 1
            },
            {
                id: 'historia_agregada',
                titulo: 'Historia Publicada',
                descripcion: 'Compartiste tu propósito',
                icono: '📖',
                xp: 50,
                nivel: 'brote',
                condicion: () => this.metrics.tiene_historia
            },

            // Nivel 🌳 ÁRBOL
            {
                id: 'diez_productos',
                titulo: '10 Productos',
                descripcion: 'Catálogo sólido',
                icono: '📦',
                xp: 150,
                nivel: 'arbol',
                condicion: () => (this.metrics.total_productos || 0) >= 10
            },
            {
                id: 'cinco_ventas',
                titulo: '5 Ventas',
                descripcion: 'Momentum ganado',
                icono: '🛒',
                xp: 300,
                nivel: 'arbol',
                condicion: () => (this.metrics.ventas_totales || 0) >= 5
            },
            {
                id: 'cien_visitas',
                titulo: '100 Visitas',
                descripcion: 'Tu tienda atrae interés',
                icono: '👥',
                xp: 200,
                nivel: 'arbol',
                condicion: () => (this.metrics.visitas_totales || 0) >= 100
            },
            {
                id: 'primer_review',
                titulo: 'Primera Reseña',
                descripcion: 'Cliente satisfecho',
                icono: '⭐',
                xp: 150,
                nivel: 'arbol',
                condicion: () => (this.metrics.total_reviews || 0) >= 1
            },

            // Nivel 🚀 COHETE
            {
                id: 'cincuenta_productos',
                titulo: '50 Productos',
                descripcion: 'Catálogo profesional',
                icono: '📦',
                xp: 300,
                nivel: 'cohete',
                condicion: () => (this.metrics.total_productos || 0) >= 50
            },
            {
                id: 'veinte_ventas',
                titulo: '20 Ventas',
                descripcion: 'Negocio establecido',
                icono: '💎',
                xp: 500,
                nivel: 'cohete',
                condicion: () => (this.metrics.ventas_totales || 0) >= 20
            },
            {
                id: 'mil_dolares',
                titulo: '$1,000 en Ventas',
                descripcion: 'Hito financiero',
                icono: '💰',
                xp: 1000,
                nivel: 'cohete',
                condicion: () => (this.metrics.ingresos_totales || 0) >= 1000
            },
            {
                id: 'upgrade_pro',
                titulo: 'Upgrade a Pro',
                descripcion: 'Inviertes en tu negocio',
                icono: '⬆️',
                xp: 500,
                nivel: 'cohete',
                condicion: () => ['pro', 'enterprise'].includes(this.plan)
            },

            // Logros Especiales
            {
                id: 'emprendedor_resiliente',
                titulo: 'Emprendedor Resiliente',
                descripcion: 'Superaste un momento difícil',
                icono: '💪',
                xp: 200,
                nivel: 'especial',
                condicion: () => this.metrics.supero_momento_dificil
            },
            {
                id: 'ayudo_otro',
                titulo: 'Paga Hacia Adelante',
                descripcion: 'Ayudaste a otro emprendedor',
                icono: '🤝',
                xp: 150,
                nivel: 'especial',
                condicion: () => this.metrics.ayudo_otro_emprendedor
            }
        ];
    }

    // Calcular logros desbloqueados
    cargarLogros() {
        const definidos = this.getLogrosDefinidos();
        const desbloqueados = [];
        const bloqueados = [];

        definidos.forEach(logro => {
            if (logro.condicion()) {
                // Verificar si ya fue notificado
                const yaVisto = localStorage.getItem(`logro_${logro.id}_${this.tenant.slug}`);
                logro.desbloqueado = true;
                logro.nuevo = !yaVisto;
                desbloqueados.push(logro);
            } else {
                logro.desbloqueado = false;
                bloqueados.push(logro);
            }
        });

        return { desbloqueados, bloqueados };
    }

    // Calcular XP total
    calcularXP() {
        return this.logros.desbloqueados.reduce((total, logro) => total + logro.xp, 0);
    }

    // Calcular nivel
    calcularNivel() {
        const xp = this.calcularXP();

        if (xp < 200) return { nombre: 'Semilla', icono: '🌱', color: '#10B981', siguiente: 200 };
        if (xp < 1000) return { nombre: 'Brote', icono: '🌿', color: '#3B82F6', siguiente: 1000 };
        if (xp < 2500) return { nombre: 'Árbol', icono: '🌳', color: '#7C3AED', siguiente: 2500 };
        return { nombre: 'Cohete', icono: '🚀', color: '#EC4899', siguiente: null };
    }

    // Mostrar notificación de nuevo logro
    mostrarNuevoLogro(logro) {
        const notif = document.createElement('div');
        notif.className = 'logro-notificacion';
        notif.innerHTML = `
            <div class="logro-notif-content">
                <div class="logro-notif-icon">${logro.icono}</div>
                <div class="logro-notif-info">
                    <div class="logro-notif-badge">¡Logro Desbloqueado!</div>
                    <div class="logro-notif-titulo">${logro.titulo}</div>
                    <div class="logro-notif-xp">+${logro.xp} XP</div>
                </div>
            </div>

            <style>
                .logro-notificacion {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    background: linear-gradient(135deg, #7C3AED, #A78BFA);
                    color: white;
                    padding: 20px;
                    border-radius: 16px;
                    box-shadow: 0 12px 40px rgba(124, 58, 237, 0.4);
                    z-index: 10001;
                    animation: slideInBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                @keyframes slideInBounce {
                    from {
                        opacity: 0;
                        transform: translateX(400px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .logro-notif-content {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                }

                .logro-notif-icon {
                    font-size: 48px;
                    animation: tada 1s ease;
                }

                .logro-notif-badge {
                    background: rgba(255, 255, 255, 0.3);
                    padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    display: inline-block;
                    margin-bottom: 6px;
                }

                .logro-notif-titulo {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }

                .logro-notif-xp {
                    font-size: 14px;
                    opacity: 0.9;
                    font-weight: 600;
                }

                @keyframes tada {
                    0%, 100% { transform: scale(1) rotate(0deg); }
                    10%, 20% { transform: scale(0.9) rotate(-3deg); }
                    30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
                    40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
                }
            </style>
        `;

        document.body.appendChild(notif);

        // Marcar como visto
        localStorage.setItem(`logro_${logro.id}_${this.tenant.slug}`, 'true');

        // Auto-remove después de 5 segundos
        setTimeout(() => {
            notif.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 5000);
    }

    // Verificar nuevos logros
    verificarNuevosLogros() {
        this.logros.desbloqueados
            .filter(logro => logro.nuevo)
            .forEach(logro => {
                this.mostrarNuevoLogro(logro);
            });
    }

    // Crear panel de logros
    crearPanelLogros() {
        const panel = document.createElement('div');
        panel.id = 'panel-logros';
        panel.className = 'panel-logros-overlay';
        panel.style.display = 'none';

        panel.innerHTML = `
            <div class="panel-logros-container">
                <!-- Header -->
                <div class="panel-logros-header">
                    <h2>
                        <i class="fas fa-trophy"></i>
                        Tus Logros
                    </h2>
                    <button class="btn-cerrar-logros" onclick="cerrarPanelLogros()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Nivel actual -->
                <div class="nivel-actual">
                    <div class="nivel-icon" style="color: ${this.nivel.color};">
                        ${this.nivel.icono}
                    </div>
                    <div class="nivel-info">
                        <div class="nivel-nombre">Nivel: ${this.nivel.nombre}</div>
                        <div class="nivel-xp">${this.xp} XP${this.nivel.siguiente ? ` / ${this.nivel.siguiente}` : ' (Máximo)'}</div>
                        ${this.nivel.siguiente ? `
                        <div class="nivel-progress-bar">
                            <div class="nivel-progress-fill" style="width: ${(this.xp / this.nivel.siguiente) * 100}%; background: ${this.nivel.color};"></div>
                        </div>
                        <div class="nivel-siguiente">
                            Próximo nivel: ${this.getSiguienteNivel().icono} ${this.getSiguienteNivel().nombre}
                        </div>
                        ` : `
                        <div class="nivel-maximo">¡Nivel Máximo Alcanzado! 🎉</div>
                        `}
                    </div>
                </div>

                <!-- Logros desbloqueados -->
                <div class="logros-seccion">
                    <h3>
                        <i class="fas fa-check-circle" style="color: #10B981;"></i>
                        Desbloqueados (${this.logros.desbloqueados.length})
                    </h3>
                    <div class="logros-grid">
                        ${this.logros.desbloqueados.map(logro => `
                            <div class="logro-card desbloqueado">
                                <div class="logro-icono">${logro.icono}</div>
                                <div class="logro-titulo">${logro.titulo}</div>
                                <div class="logro-descripcion">${logro.descripcion}</div>
                                <div class="logro-xp">+${logro.xp} XP</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Logros bloqueados -->
                <div class="logros-seccion">
                    <h3>
                        <i class="fas fa-lock" style="color: #9CA3AF;"></i>
                        Por Desbloquear (${this.logros.bloqueados.length})
                    </h3>
                    <div class="logros-grid">
                        ${this.logros.bloqueados.slice(0, 6).map(logro => `
                            <div class="logro-card bloqueado">
                                <div class="logro-icono">🔒</div>
                                <div class="logro-titulo">${logro.titulo}</div>
                                <div class="logro-descripcion">${logro.descripcion}</div>
                                <div class="logro-xp">+${logro.xp} XP</div>
                                <div class="logro-hint">${this.getHint(logro)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            ${this.getStyles()}
        `;

        document.body.appendChild(panel);
    }

    // Obtener hint para logro bloqueado
    getHint(logro) {
        const hints = {
            'primer_producto': 'Agrega tu primer producto',
            'primera_venta': 'Sigue promocionando tu tienda',
            'cinco_productos': `Agregar ${5 - (this.metrics.total_productos || 0)} productos más`,
            'diez_productos': `Agregar ${10 - (this.metrics.total_productos || 0)} productos más`,
            'cinco_ventas': `${5 - (this.metrics.ventas_totales || 0)} ventas más`,
            'cien_visitas': `${100 - (this.metrics.visitas_totales || 0)} visitas más`
        };

        return hints[logro.id] || 'Sigue trabajando en tu tienda';
    }

    // Siguiente nivel
    getSiguienteNivel() {
        const niveles = [
            { nombre: 'Semilla', icono: '🌱', xp: 0 },
            { nombre: 'Brote', icono: '🌿', xp: 200 },
            { nombre: 'Árbol', icono: '🌳', xp: 1000 },
            { nombre: 'Cohete', icono: '🚀', xp: 2500 }
        ];

        return niveles.find(n => n.xp > this.xp) || niveles[niveles.length - 1];
    }

    // Mostrar panel
    mostrarPanel() {
        document.getElementById('panel-logros').style.display = 'flex';
    }

    // Crear badge de nivel (para navbar)
    crearBadgeNivel() {
        const badge = document.createElement('div');
        badge.className = 'nivel-badge';
        badge.onclick = () => this.mostrarPanel();
        badge.innerHTML = `
            <div class="badge-nivel-content">
                <span class="badge-nivel-icon">${this.nivel.icono}</span>
                <span class="badge-nivel-texto">Nivel ${this.nivel.nombre}</span>
                <span class="badge-nivel-xp">${this.xp} XP</span>
            </div>

            <style>
                .nivel-badge {
                    background: linear-gradient(135deg, ${this.nivel.color}, rgba(255,255,255,0.2));
                    padding: 8px 16px;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .nivel-badge:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .badge-nivel-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: white;
                }

                .badge-nivel-icon {
                    font-size: 18px;
                }

                .badge-nivel-texto {
                    font-weight: 600;
                    font-size: 13px;
                }

                .badge-nivel-xp {
                    font-size: 12px;
                    opacity: 0.9;
                }
            </style>
        `;

        return badge;
    }

    // Estilos del panel
    getStyles() {
        return `
        <style>
            .panel-logros-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(30, 27, 75, 0.95);
                backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .panel-logros-container {
                background: white;
                border-radius: 24px;
                width: 90%;
                max-width: 900px;
                max-height: 85vh;
                overflow-y: auto;
                animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            .panel-logros-header {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                padding: 24px 32px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 1;
            }

            .panel-logros-header h2 {
                margin: 0;
                font-size: 28px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .btn-cerrar-logros {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                transition: background 0.2s;
            }

            .btn-cerrar-logros:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .nivel-actual {
                padding: 32px;
                background: linear-gradient(135deg, #F9FAFB, #FFFFFF);
                display: flex;
                gap: 24px;
                align-items: center;
                border-bottom: 2px solid #E5E7EB;
            }

            .nivel-icon {
                font-size: 80px;
                animation: float 3s ease-in-out infinite;
            }

            .nivel-info {
                flex: 1;
            }

            .nivel-nombre {
                font-size: 28px;
                font-weight: 800;
                color: #1F2937;
                margin-bottom: 8px;
            }

            .nivel-xp {
                font-size: 16px;
                color: #6B7280;
                margin-bottom: 12px;
            }

            .nivel-progress-bar {
                height: 12px;
                background: #E5E7EB;
                border-radius: 50px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .nivel-progress-fill {
                height: 100%;
                border-radius: 50px;
                transition: width 0.5s ease;
            }

            .nivel-siguiente {
                font-size: 14px;
                color: #9CA3AF;
            }

            .nivel-maximo {
                font-size: 18px;
                font-weight: 700;
                background: linear-gradient(135deg, #EC4899, #F9A8D4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .logros-seccion {
                padding: 32px;
            }

            .logros-seccion h3 {
                font-size: 20px;
                font-weight: 700;
                color: #1F2937;
                margin-bottom: 24px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .logros-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 16px;
            }

            .logro-card {
                padding: 20px;
                border-radius: 16px;
                text-align: center;
                transition: all 0.3s ease;
            }

            .logro-card.desbloqueado {
                background: linear-gradient(135deg, #F5F3FF, #FFFFFF);
                border: 2px solid #DDD6FE;
            }

            .logro-card.desbloqueado:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2);
                border-color: #A78BFA;
            }

            .logro-card.bloqueado {
                background: #F9FAFB;
                border: 2px solid #E5E7EB;
                opacity: 0.6;
            }

            .logro-icono {
                font-size: 48px;
                margin-bottom: 12px;
            }

            .logro-titulo {
                font-size: 15px;
                font-weight: 700;
                color: #1F2937;
                margin-bottom: 6px;
            }

            .logro-descripcion {
                font-size: 13px;
                color: #6B7280;
                margin-bottom: 10px;
                line-height: 1.4;
            }

            .logro-xp {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                padding: 4px 12px;
                border-radius: 50px;
                font-size: 12px;
                font-weight: 700;
                display: inline-block;
            }

            .logro-hint {
                margin-top: 10px;
                font-size: 12px;
                color: #9CA3AF;
                font-style: italic;
            }

            @media (max-width: 768px) {
                .logros-grid {
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                }

                .nivel-actual {
                    flex-direction: column;
                    text-align: center;
                }
            }
        </style>
        `;

        document.body.appendChild(panel);
    }

    // Inicializar
    init() {
        this.crearPanelLogros();
        this.verificarNuevosLogros();

        // Agregar badge al navbar
        const navbar = document.querySelector('.admin-header-right') || document.querySelector('.navbar-nav');
        if (navbar) {
            navbar.appendChild(this.crearBadgeNivel());
        }

        console.log(`🏆 Sistema de logros inicializado - Nivel: ${this.nivel.nombre} (${this.xp} XP)`);
    }
}

// Función global
window.mostrarPanelLogros = function() {
    document.getElementById('panel-logros').style.display = 'flex';
};

window.cerrarPanelLogros = function() {
    document.getElementById('panel-logros').style.display = 'none';
};

window.initSistemaLogros = function(tenantConfig) {
    window.logrosSystem = new SistemaLogros(tenantConfig);
    window.logrosSystem.init();
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SistemaLogros };
}


