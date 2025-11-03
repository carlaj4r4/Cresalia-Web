// ===== PANEL DE MONITOREO DE SEGURIDAD - CRESALIA =====
// Sistema para que la co-fundadora pueda ver todas las alertas de seguridad

class PanelMonitoreoSeguridad {
    constructor() {
        this.alertas = [];
        this.crearPanel();
        this.inicializarMonitoreo();
    }

    crearPanel() {
        // SOLO MOSTRAR EL CANDADO EN PÁGINAS PERSONALES DE LA FUNDADORA
        // Verificar si estamos en una página específica de la fundadora
        const urlActual = window.location.href.toLowerCase();
        const pathActual = window.location.pathname.toLowerCase();
        
        // Solo páginas personales de la fundadora (super admin)
        const esPaginaFundadora = pathActual.includes('panel-master-cresalia') ||
                                 urlActual.includes('panel-master-cresalia') ||
                                 pathActual.includes('admin-cresalia') ||
                                 urlActual.includes('admin-cresalia');
        
        // NO mostrar en ninguna otra página (incluye admin-final de vendedores)
        if (!esPaginaFundadora) {
            return; // No crear el candado
        }
        
        console.log('🔒 Panel de monitoreo visible - Página de administrador detectada');
        
        // Crear botón flotante para abrir el panel
        const botonFlotante = document.createElement('div');
        botonFlotante.id = 'boton-seguridad-cresalia';
        botonFlotante.innerHTML = '🔒';
        botonFlotante.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #EF4444, #DC2626);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10000;
            font-size: 20px;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
            transition: transform 0.3s ease;
        `;
        
        botonFlotante.addEventListener('mouseenter', () => {
            botonFlotante.style.transform = 'scale(1.1)';
        });
        
        botonFlotante.addEventListener('mouseleave', () => {
            botonFlotante.style.transform = 'scale(1)';
        });
        
        botonFlotante.addEventListener('click', () => {
            this.mostrarPanel();
        });
        
        if (document.body) {
            document.body.appendChild(botonFlotante);
        }
    }

    mostrarPanel() {
        // Crear overlay del panel
        const overlay = document.createElement('div');
        overlay.id = 'panel-seguridad-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Crear panel principal
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h2 style="color: #1F2937; margin: 0; display: flex; align-items: center; gap: 10px;">
                    🔒 Panel de Monitoreo de Seguridad
                </h2>
                <button id="cerrar-panel-seguridad" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #666;
                    cursor: pointer;
                    padding: 5px;
                ">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                    <button id="btn-todas-alertas" class="btn-seguridad active">Todas las Alertas</button>
                    <button id="btn-devtools" class="btn-seguridad">DevTools</button>
                    <button id="btn-datos-sensibles" class="btn-seguridad">Datos Sensibles</button>
                    <button id="btn-intentos-robo" class="btn-seguridad">Intentos de Robo</button>
                </div>
            </div>
            
            <div id="contenido-alertas" style="min-height: 400px;">
                <div style="text-align: center; color: #666; padding: 40px;">
                    <i class="fas fa-shield-alt" style="font-size: 48px; margin-bottom: 15px; color: #10B981;"></i>
                    <p>No hay alertas de seguridad registradas</p>
                    <p style="font-size: 14px; margin-top: 10px;">El sistema está monitoreando activamente</p>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="color: #666; font-size: 14px;">
                        <span id="contador-alertas">0 alertas</span> • 
                        <span id="ultima-actualizacion">Última actualización: ${new Date().toLocaleTimeString()}</span>
                    </div>
                    <button id="limpiar-alertas" style="
                        background: #EF4444;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Limpiar Alertas</button>
                </div>
            </div>
        `;

        // Estilos para los botones
        const style = document.createElement('style');
        style.textContent = `
            .btn-seguridad {
                padding: 8px 16px;
                border: 1px solid #D1D5DB;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            .btn-seguridad:hover {
                background: #F3F4F6;
            }
            .btn-seguridad.active {
                background: #7C3AED;
                color: white;
                border-color: #7C3AED;
            }
            .alerta-item {
                background: #F8FAFC;
                border-left: 4px solid #EF4444;
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 6px;
            }
            .alerta-item.warning {
                border-left-color: #F59E0B;
            }
            .alerta-item.info {
                border-left-color: #3B82F6;
            }
            .alerta-item.success {
                border-left-color: #10B981;
            }
            .alerta-titulo {
                font-weight: 600;
                color: #1F2937;
                margin-bottom: 5px;
            }
            .alerta-descripcion {
                color: #6B7280;
                font-size: 14px;
                margin-bottom: 5px;
            }
            .alerta-tiempo {
                color: #9CA3AF;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);

        overlay.appendChild(panel);
        if (document.body) {
            document.body.appendChild(overlay);
        }

        // Event listeners
        document.getElementById('cerrar-panel-seguridad').addEventListener('click', () => {
            overlay.remove();
            style.remove();
        });

        document.getElementById('limpiar-alertas').addEventListener('click', () => {
            this.alertas = [];
            this.actualizarContenido();
        });

        // Filtros
        document.querySelectorAll('.btn-seguridad').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-seguridad').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filtrarAlertas(e.target.id.replace('btn-', ''));
            });
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                style.remove();
            }
        });

        this.actualizarContenido();
    }

    agregarAlerta(tipo, titulo, descripcion, detalles = {}) {
        const alerta = {
            id: Date.now(),
            tipo,
            titulo,
            descripcion,
            detalles,
            timestamp: new Date()
        };
        
        this.alertas.unshift(alerta); // Agregar al inicio
        
        // Mantener solo las últimas 100 alertas
        if (this.alertas.length > 100) {
            this.alertas = this.alertas.slice(0, 100);
        }
        
        // Actualizar contador en el botón
        this.actualizarContador();
        
        // Mostrar notificación si el panel no está abierto
        if (!document.getElementById('panel-seguridad-overlay')) {
            this.mostrarNotificacion(titulo, tipo);
        }
    }

    actualizarContenido() {
        const contenido = document.getElementById('contenido-alertas');
        if (!contenido) return;

        if (this.alertas.length === 0) {
            contenido.innerHTML = `
                <div style="text-align: center; color: #666; padding: 40px;">
                    <i class="fas fa-shield-alt" style="font-size: 48px; margin-bottom: 15px; color: #10B981;"></i>
                    <p>No hay alertas de seguridad registradas</p>
                    <p style="font-size: 14px; margin-top: 10px;">El sistema está monitoreando activamente</p>
                </div>
            `;
        } else {
            const alertasHTML = this.alertas.map(alerta => `
                <div class="alerta-item ${alerta.tipo}">
                    <div class="alerta-titulo">${alerta.titulo}</div>
                    <div class="alerta-descripcion">${alerta.descripcion}</div>
                    <div class="alerta-tiempo">${alerta.timestamp.toLocaleString()}</div>
                </div>
            `).join('');
            
            contenido.innerHTML = alertasHTML;
        }
        
        this.actualizarContador();
    }

    filtrarAlertas(filtro) {
        const contenido = document.getElementById('contenido-alertas');
        if (!contenido) return;

        let alertasFiltradas = this.alertas;
        
        if (filtro === 'devtools') {
            alertasFiltradas = this.alertas.filter(a => 
                a.titulo.toLowerCase().includes('devtools') || 
                a.titulo.toLowerCase().includes('herramientas')
            );
        } else if (filtro === 'datos-sensibles') {
            alertasFiltradas = this.alertas.filter(a => 
                a.titulo.toLowerCase().includes('datos') || 
                a.titulo.toLowerCase().includes('tarjeta') ||
                a.titulo.toLowerCase().includes('sensibles')
            );
        } else if (filtro === 'intentos-robo') {
            alertasFiltradas = this.alertas.filter(a => 
                a.titulo.toLowerCase().includes('robo') || 
                a.titulo.toLowerCase().includes('intento') ||
                a.titulo.toLowerCase().includes('malicioso')
            );
        }

        if (alertasFiltradas.length === 0) {
            contenido.innerHTML = `
                <div style="text-align: center; color: #666; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; color: #6B7280;"></i>
                    <p>No hay alertas de este tipo</p>
                </div>
            `;
        } else {
            const alertasHTML = alertasFiltradas.map(alerta => `
                <div class="alerta-item ${alerta.tipo}">
                    <div class="alerta-titulo">${alerta.titulo}</div>
                    <div class="alerta-descripcion">${alerta.descripcion}</div>
                    <div class="alerta-tiempo">${alerta.timestamp.toLocaleString()}</div>
                </div>
            `).join('');
            
            contenido.innerHTML = alertasHTML;
        }
    }

    actualizarContador() {
        const contador = document.getElementById('contador-alertas');
        const ultimaActualizacion = document.getElementById('ultima-actualizacion');
        
        if (contador) {
            contador.textContent = `${this.alertas.length} alertas`;
        }
        
        if (ultimaActualizacion) {
            ultimaActualizacion.textContent = `Última actualización: ${new Date().toLocaleTimeString()}`;
        }
    }

    mostrarNotificacion(titulo, tipo) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #EF4444, #DC2626);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
            z-index: 10001;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
            cursor: pointer;
        `;

        const iconos = {
            'warning': '⚠️',
            'error': '🚨',
            'info': 'ℹ️',
            'success': '✅'
        };

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2rem;">${iconos[tipo] || '🔒'}</span>
                <span>${titulo}</span>
            </div>
        `;

        notification.addEventListener('click', () => {
            this.mostrarPanel();
        });

        if (document.body) {
            document.body.appendChild(notification);
        }

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    inicializarMonitoreo() {
        // Interceptar la función logSecurityEvent si existe
        if (typeof window.logSecurityEvent === 'function') {
            const originalLog = window.logSecurityEvent;
            window.logSecurityEvent = (evento, descripcion) => {
                originalLog(evento, descripcion);
                this.agregarAlerta('warning', `Evento de Seguridad: ${evento}`, descripcion);
            };
        } else {
            // Crear la función si no existe
            window.logSecurityEvent = (evento, descripcion) => {
                this.agregarAlerta('warning', `Evento de Seguridad: ${evento}`, descripcion);
            };
        }
    }
}

// Auto-inicializar solo en páginas de administración
if (typeof window !== 'undefined' && (
    window.location.pathname.includes('admin') || 
    window.location.pathname.includes('panel') ||
    window.location.pathname.includes('master')
)) {
    document.addEventListener('DOMContentLoaded', () => {
        window.panelSeguridad = new PanelMonitoreoSeguridad();
    });
}
