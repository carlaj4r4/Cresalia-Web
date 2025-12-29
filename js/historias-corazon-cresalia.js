// ===== SISTEMA DE HISTORIAS CON CORAZÓN CRESALIA =====
// Para clientes VIP que quieren compartir su historia

const HistoriasCorazon = {
    historias: [],
    
    async init() {
        console.log('💜 Inicializando sistema de Historias con Corazón Cresalia');
        await this.cargarHistorias();
    },
    
    async cargarHistorias(dondeMostrar = null) {
        try {
            let url = '/api/historias-corazon?publicas=true&activa=true';
            if (dondeMostrar) {
                url += `&donde_mostrar=${dondeMostrar}`;
            }
            
            const response = await fetch(url).catch(err => {
                console.warn('⚠️ No se pudo conectar con la API de historias (esto es normal si la API no está disponible)');
                return null;
            });
            
            if (!response || !response.ok) {
                console.warn('⚠️ API de historias no disponible, usando modo sin historias');
                this.mostrarSinHistorias();
                return;
            }
            
            const data = await response.json();
            this.historias = data.historias || [];
            
            this.renderizarHistorias();
        } catch (error) {
            console.warn('⚠️ Error cargando historias (esto es normal si la API no está disponible):', error.message);
            this.mostrarSinHistorias();
        }
    },
    
    renderizarHistorias() {
        const grid = document.getElementById('historiasGrid');
        const sinHistorias = document.getElementById('sinHistorias');
        const seccion = document.getElementById('historias-corazon');
        
        if (!grid || !seccion) return;
        
        if (this.historias.length === 0) {
            this.mostrarSinHistorias();
            return;
        }
        
        // Mostrar sección SOLO si el hash de la URL es #historias-corazon o si fue explícitamente solicitado
        // Esto evita que se muestre automáticamente cuando el usuario navega a otras secciones
        const hash = window.location.hash;
        if (hash === '#historias-corazon' || hash === '#compartidas') {
            seccion.style.display = 'block';
        } else {
            // No mostrar automáticamente - solo cuando el usuario navegue específicamente a esta sección
            seccion.style.display = 'none';
            return;
        }
        sinHistorias.style.display = 'none';
        
        grid.innerHTML = this.historias.map(historia => {
            const historiaId = historia.id || `historia-${Date.now()}-${Math.random()}`;
            const reacciones = this.obtenerReacciones(historiaId);
            
            return `
            <div class="historia-card" data-historia-id="${historiaId}">
                <div class="historia-header">
                    ${historia.foto_url ? 
                        `<img src="${historia.foto_url}" alt="${historia.nombre_negocio || 'Cliente'}" class="historia-avatar">` :
                        `<div class="historia-avatar" style="background: linear-gradient(135deg, #667eea, #ec4899); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
                            ${(historia.nombre_negocio || 'C').charAt(0).toUpperCase()}
                        </div>`
                    }
                    <div class="historia-info">
                        <h4>${this.escapeHtml(historia.nombre_negocio || 'Emprendedor Cresalia')}</h4>
                        <p>${historia.tipo_vendedor === 'tienda' ? '🏪 Tienda' : historia.tipo_vendedor === 'servicio' ? '🔧 Servicio' : '💼 Emprendedor'}</p>
                    </div>
                </div>
                <div class="historia-contenido">
                    ${this.escapeHtml(historia.historia || '')}
                </div>
                ${historia.consejos ? `
                    <div class="historia-consejos" style="background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <h5 style="color: #1E40AF; margin-bottom: 10px; font-size: 1rem;">
                            <i class="fas fa-lightbulb"></i> Consejos para Emprendedores:
                        </h5>
                        <p style="color: #1E3A8A; line-height: 1.6; margin: 0;">
                            ${this.escapeHtml(historia.consejos)}
                        </p>
                    </div>
                ` : ''}
                ${historia.fecha_publicacion ? 
                    `<p style="color: #94a3b8; font-size: 0.85rem; margin-top: 15px;">
                        <i class="fas fa-calendar"></i> ${new Date(historia.fecha_publicacion).toLocaleDateString('es-AR')}
                    </p>` : ''
                }
                
                <!-- Sistema de Reacciones -->
                <div class="historia-reacciones" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #E5E7EB; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                    <div class="reacciones-botones" style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <button class="btn-reaccion ${reacciones.meGusta ? 'activa' : ''}" 
                                onclick="HistoriasCorazon.reaccionar('${historiaId}', 'meGusta')"
                                title="Me gusta">
                            <span class="emoji-reaccion">👍</span>
                            <span class="contador-reaccion" data-tipo="meGusta">${reacciones.meGusta || 0}</span>
                        </button>
                        <button class="btn-reaccion ${reacciones.corazon ? 'activa' : ''}" 
                                onclick="HistoriasCorazon.reaccionar('${historiaId}', 'corazon')"
                                title="Me encanta">
                            <span class="emoji-reaccion">💜</span>
                            <span class="contador-reaccion" data-tipo="corazon">${reacciones.corazon || 0}</span>
                        </button>
                        <button class="btn-reaccion ${reacciones.aplausos ? 'activa' : ''}" 
                                onclick="HistoriasCorazon.reaccionar('${historiaId}', 'aplausos')"
                                title="Aplausos">
                            <span class="emoji-reaccion">👏</span>
                            <span class="contador-reaccion" data-tipo="aplausos">${reacciones.aplausos || 0}</span>
                        </button>
                        <button class="btn-reaccion ${reacciones.inspirador ? 'activa' : ''}" 
                                onclick="HistoriasCorazon.reaccionar('${historiaId}', 'inspirador')"
                                title="Inspirador">
                            <span class="emoji-reaccion">✨</span>
                            <span class="contador-reaccion" data-tipo="inspirador">${reacciones.inspirador || 0}</span>
                        </button>
                        <button class="btn-reaccion ${reacciones.fuerza ? 'activa' : ''}" 
                                onclick="HistoriasCorazon.reaccionar('${historiaId}', 'fuerza')"
                                title="Mucha fuerza">
                            <span class="emoji-reaccion">💪</span>
                            <span class="contador-reaccion" data-tipo="fuerza">${reacciones.fuerza || 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        }).join('');
        
        // Agregar estilos para las reacciones si no existen
        this.agregarEstilosReacciones();
    },
    
    mostrarSinHistorias() {
        const grid = document.getElementById('historiasGrid');
        const sinHistorias = document.getElementById('sinHistorias');
        const seccion = document.getElementById('historias-corazon');
        
        if (!grid || !sinHistorias || !seccion) return;
        
        // NO mostrar automáticamente la sección - solo mostrar si el usuario navega específicamente a ella
        // Verificar el hash de la URL antes de mostrar
        const hash = window.location.hash;
        if (hash === '#historias-corazon' || hash === '#compartidas') {
            if (this.historias.length === 0) {
                seccion.style.display = 'block';
                grid.innerHTML = '';
                sinHistorias.style.display = 'block';
            }
        } else {
            // Si no estamos en la sección de historias, no mostrar nada
            seccion.style.display = 'none';
        }
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    obtenerReacciones(historiaId) {
        try {
            const todasReacciones = JSON.parse(localStorage.getItem('historiasCorazonReacciones') || '{}');
            return todasReacciones[historiaId] || {
                meGusta: 0,
                corazon: 0,
                aplausos: 0,
                inspirador: 0,
                fuerza: 0
            };
        } catch (error) {
            console.warn('Error leyendo reacciones:', error);
            return {
                meGusta: 0,
                corazon: 0,
                aplausos: 0,
                inspirador: 0,
                fuerza: 0
            };
        }
    },
    
    guardarReacciones(historiaId, reacciones) {
        try {
            const todasReacciones = JSON.parse(localStorage.getItem('historiasCorazonReacciones') || '{}');
            todasReacciones[historiaId] = reacciones;
            localStorage.setItem('historiasCorazonReacciones', JSON.stringify(todasReacciones));
        } catch (error) {
            console.warn('Error guardando reacciones:', error);
        }
    },
    
    reaccionar(historiaId, tipo) {
        const card = document.querySelector(`[data-historia-id="${historiaId}"]`);
        if (!card) return;
        
        const reacciones = this.obtenerReacciones(historiaId);
        const boton = card.querySelector(`[onclick*="'${tipo}'"]`);
        const contador = card.querySelector(`[data-tipo="${tipo}"]`);
        
        if (!boton || !contador) return;
        
        // Verificar si el usuario ya reaccionó con este tipo
        const yaReacciono = boton.classList.contains('activa');
        
        if (yaReacciono) {
            // Quitar reacción
            reacciones[tipo] = Math.max(0, (reacciones[tipo] || 0) - 1);
            boton.classList.remove('activa');
        } else {
            // Agregar reacción
            reacciones[tipo] = (reacciones[tipo] || 0) + 1;
            boton.classList.add('activa');
        }
        
        // Actualizar contador
        contador.textContent = reacciones[tipo] || 0;
        
        // Guardar reacciones
        this.guardarReacciones(historiaId, reacciones);
        
        // Intentar guardar en el servidor (opcional, no bloquea si falla)
        this.enviarReaccionAlServidor(historiaId, tipo, !yaReacciono).catch(err => {
            console.warn('No se pudo guardar reacción en servidor (continuando con localStorage):', err);
        });
    },
    
    async enviarReaccionAlServidor(historiaId, tipo, agregar) {
        try {
            const response = await fetch('/api/historias-corazon/reacciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    historia_id: historiaId,
                    tipo: tipo,
                    accion: agregar ? 'agregar' : 'quitar'
                })
            });
            
            if (!response.ok) {
                throw new Error('Error en servidor');
            }
        } catch (error) {
            // No es crítico si falla, las reacciones se guardan en localStorage
            throw error;
        }
    },
    
    agregarEstilosReacciones() {
        // Verificar si los estilos ya existen
        if (document.getElementById('estilos-reacciones-historias')) return;
        
        const style = document.createElement('style');
        style.id = 'estilos-reacciones-historias';
        style.textContent = `
            .historia-reacciones {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #E5E7EB;
            }
            
            .reacciones-botones {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            
            .btn-reaccion {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 12px;
                border: 2px solid #E5E7EB;
                border-radius: 20px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                font-weight: 500;
                color: #64748b;
            }
            
            .btn-reaccion:hover {
                border-color: #667eea;
                background: #F0F9FF;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
            }
            
            .btn-reaccion.activa {
                border-color: #EC4899;
                background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(199, 38, 211, 0.1));
                color: #EC4899;
            }
            
            .btn-reaccion.activa:hover {
                border-color: #C026D3;
                background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(199, 38, 211, 0.15));
            }
            
            .emoji-reaccion {
                font-size: 1.2rem;
                line-height: 1;
            }
            
            .contador-reaccion {
                font-weight: 600;
                min-width: 20px;
                text-align: center;
            }
            
            .btn-reaccion.activa .contador-reaccion {
                color: #EC4899;
            }
        `;
        
        document.head.appendChild(style);
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HistoriasCorazon.init());
} else {
    HistoriasCorazon.init();
}

