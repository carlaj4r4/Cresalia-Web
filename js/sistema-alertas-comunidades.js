// ===== SISTEMA DE ALERTAS DE EMERGENCIA PARA COMUNIDADES =====
// Alertas de desastres naturales, noticias urgentes, etc.

class SistemaAlertasComunidades {
    constructor(comunidadSlug) {
        this.comunidadSlug = comunidadSlug;
        this.supabase = null;
        this.autorHash = null;
        this.init();
    }
    
    async init() {
        // Inicializar Supabase
        if (typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
            try {
                const config = window.SUPABASE_CONFIG;
                if (config.url && config.anonKey && !config.anonKey.includes('REEMPLAZA')) {
                    this.supabase = window.supabase.createClient(config.url, config.anonKey);
                }
            } catch (error) {
                console.error('Error inicializando Supabase para alertas:', error);
            }
        }
        
        // Obtener hash del usuario
        this.autorHash = this.generarHashAutor();
        
        // Cargar y mostrar alertas
        await this.cargarAlertas();
        
        // Solicitar permisos de notificación
        this.solicitarPermisosNotificacion();
    }
    
    generarHashAutor() {
        const stored = localStorage.getItem(`foro_hash_${this.comunidadSlug}`);
        if (stored) return stored;
        
        if (window.foroComunidad && window.foroComunidad.autorHash) {
            return window.foroComunidad.autorHash;
        }
        
        const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const hash = btoa(random).substring(0, 32);
        localStorage.setItem(`foro_hash_${this.comunidadSlug}`, hash);
        return hash;
    }
    
    solicitarPermisosNotificacion() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('✅ Permisos de notificación concedidos');
                }
            });
        }
    }
    
    async cargarAlertas() {
        try {
            let alertas = [];
            
            if (this.supabase) {
                // Cargar desde Supabase
                const { data, error } = await this.supabase
                    .rpc('obtener_alertas_activas', {
                        p_usuario_hash: this.autorHash
                    });
                
                if (!error && data) {
                    alertas = data;
                }
            } else {
                // Modo local
                alertas = JSON.parse(localStorage.getItem('alertas_emergencia_comunidades') || '[]')
                    .filter(a => a.activa && (!a.fecha_expiracion || new Date(a.fecha_expiracion) > new Date()));
            }
            
            if (alertas.length > 0) {
                this.mostrarAlertas(alertas);
                this.marcarComoVista(alertas[0].id); // Marcar la primera como vista
            }
        } catch (error) {
            console.error('Error cargando alertas:', error);
        }
    }
    
    mostrarAlertas(alertas) {
        // Buscar o crear contenedor de alertas
        let contenedor = document.getElementById('alertas-emergencia-comunidades');
        
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.id = 'alertas-emergencia-comunidades';
            contenedor.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 99999;
                max-height: 400px;
                overflow-y: auto;
            `;
            document.body.insertBefore(contenedor, document.body.firstChild);
        }
        
        contenedor.innerHTML = alertas.map(alerta => this.renderizarAlerta(alerta)).join('');
        
        // Agregar estilos si no existen
        if (!document.getElementById('estilos-alertas-comunidades')) {
            const style = document.createElement('style');
            style.id = 'estilos-alertas-comunidades';
            style.textContent = `
                .alerta-emergencia {
                    padding: 20px;
                    margin: 10px;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    animation: slideDown 0.3s ease;
                    position: relative;
                }
                
                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .alerta-critica {
                    background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
                    color: white;
                    border-left: 5px solid #FCA5A5;
                }
                
                .alerta-alta {
                    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
                    color: white;
                    border-left: 5px solid #FCD34D;
                }
                
                .alerta-media {
                    background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
                    color: white;
                    border-left: 5px solid #93C5FD;
                }
                
                .alerta-baja {
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    color: white;
                    border-left: 5px solid #6EE7B7;
                }
                
                .alerta-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 10px;
                }
                
                .alerta-titulo {
                    font-size: 1.2rem;
                    font-weight: 700;
                    margin: 0;
                }
                
                .alerta-tipo {
                    font-size: 0.85rem;
                    opacity: 0.9;
                    margin-top: 5px;
                }
                
                .alerta-descripcion {
                    margin: 10px 0;
                    line-height: 1.6;
                }
                
                .alerta-enlaces {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-top: 15px;
                }
                
                .alerta-enlace {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    padding: 8px 15px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s;
                }
                
                .alerta-enlace:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                }
                
                .cerrar-alerta {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                }
                
                .cerrar-alerta:hover {
                    background: rgba(255,255,255,0.3);
                    transform: rotate(90deg);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Enviar notificación push
        alertas.forEach(alerta => {
            this.enviarNotificacionPush(alerta);
        });
    }
    
    renderizarAlerta(alerta) {
        const iconos = {
            'inundacion': '🌊',
            'incendio': '🔥',
            'terremoto': '🌍',
            'tormenta': '⛈️',
            'tornado': '🌪️',
            'tsunami': '🌊',
            'pandemia': '🦠',
            'corte_luz': '⚡',
            'corte_gas': '🔥',
            'corte_agua': '💧',
            'accidente': '🚨',
            'seguridad': '🛡️',
            'otro': '⚠️'
        };
        
        const icono = iconos[alerta.tipo] || '⚠️';
        const severidadClass = `alerta-${alerta.severidad}`;
        
        return `
            <div class="alerta-emergencia ${severidadClass}">
                <div class="alerta-header">
                    <div>
                        <div class="alerta-titulo">${icono} ${this.escapeHtml(alerta.titulo)}</div>
                        <div class="alerta-tipo">${this.formatearTipo(alerta.tipo)} ${alerta.ciudad ? '• ' + alerta.ciudad : ''}</div>
                    </div>
                    <button class="cerrar-alerta" onclick="window.alertasComunidad?.cerrarAlerta(${alerta.id})" title="Cerrar">×</button>
                </div>
                <div class="alerta-descripcion">${this.escapeHtml(alerta.descripcion)}</div>
                ${alerta.enlace_oficial ? `
                    <div class="alerta-enlaces">
                        <a href="${alerta.enlace_oficial}" target="_blank" class="alerta-enlace">
                            🔗 Ver información oficial
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    formatearTipo(tipo) {
        const tipos = {
            'inundacion': 'Inundación',
            'incendio': 'Incendio',
            'terremoto': 'Terremoto',
            'tormenta': 'Tormenta',
            'tornado': 'Tornado',
            'tsunami': 'Tsunami',
            'pandemia': 'Pandemia',
            'corte_luz': 'Corte de luz',
            'corte_gas': 'Corte de gas',
            'corte_agua': 'Corte de agua',
            'accidente': 'Accidente',
            'seguridad': 'Alerta de seguridad',
            'otro': 'Alerta'
        };
        return tipos[tipo] || tipo;
    }
    
    async cerrarAlerta(alertaId) {
        // Marcar como vista
        await this.marcarComoVista(alertaId);
        
        // Ocultar alerta
        const alertaEl = document.querySelector(`[data-alerta-id="${alertaId}"]`);
        if (alertaEl) {
            alertaEl.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => alertaEl.remove(), 300);
        }
    }
    
    async marcarComoVista(alertaId) {
        if (!this.supabase || !this.autorHash) return;
        
        try {
            await this.supabase
                .from('alertas_vistas_usuarios')
                .insert([{
                    alerta_id: alertaId,
                    usuario_hash: this.autorHash
                }]);
        } catch (error) {
            // Ignorar errores (puede ser que ya esté marcada)
        }
    }
    
    enviarNotificacionPush(alerta) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notificacion = new Notification(`🚨 ${alerta.titulo}`, {
                body: alerta.descripcion.substring(0, 100) + '...',
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: `alerta-${alerta.id}`,
                requireInteraction: alerta.severidad === 'critica',
                silent: false
            });
            
            notificacion.onclick = () => {
                window.focus();
                notificacion.close();
            };
            
            // Auto-cerrar después de 10 segundos
            setTimeout(() => {
                notificacion.close();
            }, 10000);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

