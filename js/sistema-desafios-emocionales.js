// ===== SISTEMA DE DESAFÍOS Y LOGROS EMOCIONALES =====
// Version 1.0 - Cresalia Platform
// Autor: Carla & Claude
// Descripción: Sistema opcional de gamificación para apoyo emocional

const DesafiosEmocionales = {
    // Configuración
    config: {
        storageKey: 'cresalia_desafios_emocionales',
        habilitado: true, // El usuario puede desactivarlo
        apiUrl: window.location.hostname === 'localhost' 
            ? 'http://localhost:3001/api' 
            : 'https://cresalia-backend.vercel.app/api'
    },

    // Estado del usuario
    state: {
        desafiosActivos: [],
        logrosDesbloqueados: [],
        puntosMotivacion: 0,
        nivel: 1,
        rachaActual: 0,
        ultimaVisita: null,
        sistemaHabilitado: true
    },

    // ===== DESAFÍOS DISPONIBLES =====
    desafios: [
        {
            id: 'primer_paso',
            nombre: '🌱 Primer Paso',
            descripcion: 'Registra tu primer estado emocional',
            puntos: 10,
            tipo: 'inicial',
            icono: '🌱',
            completado: false
        },
        {
            id: 'tres_dias',
            nombre: '🔥 3 Días Seguidos',
            descripcion: 'Registra tu estado emocional 3 días consecutivos',
            puntos: 30,
            tipo: 'racha',
            icono: '🔥',
            requisito: { racha: 3 },
            completado: false
        },
        {
            id: 'semana_completa',
            nombre: '⭐ Semana Completa',
            descripcion: 'Registra tu estado emocional 7 días seguidos',
            puntos: 70,
            tipo: 'racha',
            icono: '⭐',
            requisito: { racha: 7 },
            completado: false
        },
        {
            id: 'mes_guerrero',
            nombre: '👑 Guerrero de un Mes',
            descripcion: '30 días registrando tu estado emocional',
            puntos: 200,
            tipo: 'racha',
            icono: '👑',
            requisito: { racha: 30 },
            completado: false
        },
        {
            id: 'primer_recurso',
            nombre: '📚 Aprendiz',
            descripcion: 'Usa un recurso de bienestar (audio, texto, ejercicio)',
            puntos: 15,
            tipo: 'accion',
            icono: '📚',
            completado: false
        },
        {
            id: 'cinco_recursos',
            nombre: '🎓 Estudiante Dedicado',
            descripcion: 'Usa 5 recursos diferentes de bienestar',
            puntos: 50,
            tipo: 'accion',
            icono: '🎓',
            requisito: { recursosUsados: 5 },
            completado: false
        },
        {
            id: 'desahogo',
            nombre: '💭 Liberación',
            descripcion: 'Usa el botón "Hoy quiero desahogarme"',
            puntos: 20,
            tipo: 'accion',
            icono: '💭',
            completado: false
        },
        {
            id: 'cinco_desahogos',
            nombre: '🌊 Fluir',
            descripcion: 'Usa el desahogo 5 veces',
            puntos: 60,
            tipo: 'accion',
            icono: '🌊',
            requisito: { desahogos: 5 },
            completado: false
        },
        {
            id: 'primer_dia_positivo',
            nombre: '😊 Día Brillante',
            descripcion: 'Registra un día con estado emocional positivo',
            puntos: 25,
            tipo: 'emocional',
            icono: '😊',
            completado: false
        },
        {
            id: 'semana_positiva',
            nombre: '🌈 Semana Arcoíris',
            descripcion: 'Una semana completa con estados positivos',
            puntos: 100,
            tipo: 'emocional',
            icono: '🌈',
            requisito: { diasPositivos: 7 },
            completado: false
        },
        {
            id: 'superacion',
            nombre: '💪 Resiliencia',
            descripcion: 'Pasa de un día difícil a uno positivo',
            puntos: 40,
            tipo: 'emocional',
            icono: '💪',
            completado: false
        },
        {
            id: 'ayuda_otros',
            nombre: '🤝 Mano Amiga',
            descripcion: 'Deja un mensaje de apoyo a otro usuario',
            puntos: 35,
            tipo: 'comunidad',
            icono: '🤝',
            completado: false
        }
    ],

    // ===== LOGROS ESPECIALES =====
    logros: [
        {
            id: 'nivel_5',
            nombre: '🎖️ Veterano',
            descripcion: 'Alcanza el nivel 5',
            requisito: { nivel: 5 },
            recompensa: 'Badge especial',
            desbloqueado: false
        },
        {
            id: 'nivel_10',
            nombre: '🏆 Maestro del Bienestar',
            descripcion: 'Alcanza el nivel 10',
            requisito: { nivel: 10 },
            recompensa: 'Badge dorado + Reconocimiento especial',
            desbloqueado: false
        },
        {
            id: 'todos_desafios',
            nombre: '🌟 Completista',
            descripcion: 'Completa todos los desafíos',
            requisito: { desafiosCompletados: 'todos' },
            recompensa: 'Insignia exclusiva',
            desbloqueado: false
        },
        {
            id: 'racha_100',
            nombre: '🔥 Imparable',
            descripcion: '100 días de racha',
            requisito: { racha: 100 },
            recompensa: 'Reconocimiento público (si lo deseas)',
            desbloqueado: false
        }
    ],

    // ===== INICIALIZACIÓN =====
    init() {
        console.log('🎮 Inicializando Sistema de Desafíos Emocionales...');
        this.cargarEstado();
        this.verificarRacha();
        this.renderizar();
    },

    // ===== CARGAR ESTADO =====
    cargarEstado() {
        const guardado = localStorage.getItem(this.config.storageKey);
        if (guardado) {
            const estado = JSON.parse(guardado);
            this.state = { ...this.state, ...estado };
        }
        
        // Actualizar desafíos con estado guardado
        if (this.state.desafiosActivos.length > 0) {
            this.desafios.forEach(desafio => {
                const guardado = this.state.desafiosActivos.find(d => d.id === desafio.id);
                if (guardado) {
                    desafio.completado = guardado.completado;
                }
            });
        }
    },

    // ===== GUARDAR ESTADO =====
    guardarEstado() {
        localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
    },

    // ===== VERIFICAR RACHA =====
    verificarRacha() {
        const hoy = new Date().toDateString();
        const ultimaVisita = this.state.ultimaVisita;
        
        if (ultimaVisita) {
            const ayer = new Date();
            ayer.setDate(ayer.getDate() - 1);
            
            if (ultimaVisita === hoy) {
                // Ya visitó hoy, no hacer nada
                return;
            } else if (ultimaVisita === ayer.toDateString()) {
                // Visitó ayer, continuar racha
                this.state.rachaActual++;
            } else {
                // Rompió la racha
                this.state.rachaActual = 1;
            }
        } else {
            // Primera visita
            this.state.rachaActual = 1;
        }
        
        this.state.ultimaVisita = hoy;
        this.guardarEstado();
        this.verificarDesafiosRacha();
    },

    // ===== VERIFICAR DESAFÍOS DE RACHA =====
    verificarDesafiosRacha() {
        this.desafios.forEach(desafio => {
            if (desafio.tipo === 'racha' && !desafio.completado) {
                if (this.state.rachaActual >= desafio.requisito.racha) {
                    this.completarDesafio(desafio.id);
                }
            }
        });
    },

    // ===== COMPLETAR DESAFÍO =====
    completarDesafio(desafioId) {
        const desafio = this.desafios.find(d => d.id === desafioId);
        if (!desafio || desafio.completado) return;
        
        desafio.completado = true;
        this.state.puntosMotivacion += desafio.puntos;
        
        // Actualizar nivel (cada 100 puntos = 1 nivel)
        const nuevoNivel = Math.floor(this.state.puntosMotivacion / 100) + 1;
        const subioNivel = nuevoNivel > this.state.nivel;
        this.state.nivel = nuevoNivel;
        
        // Guardar en estado
        this.state.desafiosActivos.push({
            id: desafio.id,
            completado: true,
            fecha: new Date().toISOString()
        });
        
        this.guardarEstado();
        
        // Mostrar notificación
        this.mostrarNotificacionDesafio(desafio, subioNivel);
        
        // Verificar logros
        this.verificarLogros();
        
        // Re-renderizar
        this.renderizar();
    },

    // ===== VERIFICAR LOGROS =====
    verificarLogros() {
        this.logros.forEach(logro => {
            if (logro.desbloqueado) return;
            
            let cumpleRequisito = false;
            
            if (logro.requisito.nivel) {
                cumpleRequisito = this.state.nivel >= logro.requisito.nivel;
            } else if (logro.requisito.racha) {
                cumpleRequisito = this.state.rachaActual >= logro.requisito.racha;
            } else if (logro.requisito.desafiosCompletados === 'todos') {
                const completados = this.desafios.filter(d => d.completado).length;
                cumpleRequisito = completados === this.desafios.length;
            }
            
            if (cumpleRequisito) {
                this.desbloquearLogro(logro.id);
            }
        });
    },

    // ===== DESBLOQUEAR LOGRO =====
    desbloquearLogro(logroId) {
        const logro = this.logros.find(l => l.id === logroId);
        if (!logro || logro.desbloqueado) return;
        
        logro.desbloqueado = true;
        this.state.logrosDesbloqueados.push({
            id: logro.id,
            fecha: new Date().toISOString()
        });
        
        this.guardarEstado();
        this.mostrarNotificacionLogro(logro);
        this.renderizar();
    },

    // ===== REGISTRAR ACCIÓN =====
    registrarAccion(tipo, datos = {}) {
        switch(tipo) {
            case 'primer_registro':
                this.completarDesafio('primer_paso');
                break;
            
            case 'usar_recurso':
                const recursosUsados = datos.recursosUsados || 1;
                if (recursosUsados === 1) {
                    this.completarDesafio('primer_recurso');
                } else if (recursosUsados >= 5) {
                    this.completarDesafio('cinco_recursos');
                }
                break;
            
            case 'desahogo':
                const desahogos = datos.desahogos || 1;
                if (desahogos === 1) {
                    this.completarDesafio('desahogo');
                } else if (desahogos >= 5) {
                    this.completarDesafio('cinco_desahogos');
                }
                break;
            
            case 'dia_positivo':
                this.completarDesafio('primer_dia_positivo');
                if (datos.diasPositivos >= 7) {
                    this.completarDesafio('semana_positiva');
                }
                break;
            
            case 'superacion':
                this.completarDesafio('superacion');
                break;
            
            case 'ayuda_otros':
                this.completarDesafio('ayuda_otros');
                break;
        }
    },

    // ===== RENDERIZAR INTERFAZ =====
    renderizar() {
        const container = document.getElementById('desafiosContainer');
        if (!container) return;
        
        if (!this.state.sistemaHabilitado) {
            container.innerHTML = `
                <div class="desafios-deshabilitado">
                    <p>Sistema de desafíos deshabilitado</p>
                    <button onclick="DesafiosEmocionales.habilitarSistema()" class="btn-habilitar">
                        Habilitar Desafíos
                    </button>
                </div>
            `;
            return;
        }
        
        const html = `
            <div class="desafios-emocionales">
                ${this.renderizarProgreso()}
                ${this.renderizarDesafios()}
                ${this.renderizarLogros()}
            </div>
        `;
        
        container.innerHTML = html;
    },

    // ===== RENDERIZAR PROGRESO =====
    renderizarProgreso() {
        const progreso = (this.state.puntosMotivacion % 100);
        const puntosParaSiguienteNivel = 100 - progreso;
        
        return `
            <div class="progreso-usuario">
                <div class="nivel-actual">
                    <div class="nivel-numero">Nivel ${this.state.nivel}</div>
                    <div class="nivel-icono">🏅</div>
                </div>
                
                <div class="estadisticas">
                    <div class="stat">
                        <span class="stat-icono">⭐</span>
                        <span class="stat-valor">${this.state.puntosMotivacion}</span>
                        <span class="stat-label">Puntos</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icono">🔥</span>
                        <span class="stat-valor">${this.state.rachaActual}</span>
                        <span class="stat-label">Días</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icono">🎯</span>
                        <span class="stat-valor">${this.desafios.filter(d => d.completado).length}</span>
                        <span class="stat-label">Desafíos</span>
                    </div>
                </div>
                
                <div class="barra-progreso">
                    <div class="barra-fill" style="width: ${progreso}%"></div>
                </div>
                <p class="progreso-texto">${puntosParaSiguienteNivel} puntos para nivel ${this.state.nivel + 1}</p>
                
                <button class="btn-deshabilitar" onclick="DesafiosEmocionales.deshabilitarSistema()">
                    <i class="fas fa-cog"></i> Configurar
                </button>
            </div>
        `;
    },

    // ===== RENDERIZAR DESAFÍOS =====
    renderizarDesafios() {
        const desafiosHTML = this.desafios.map(desafio => {
            const clase = desafio.completado ? 'desafio-completado' : 'desafio-activo';
            return `
                <div class="desafio-card ${clase}">
                    <div class="desafio-icono">${desafio.icono}</div>
                    <div class="desafio-info">
                        <h4>${desafio.nombre}</h4>
                        <p>${desafio.descripcion}</p>
                        <div class="desafio-puntos">
                            ${desafio.completado ? 
                                '<span class="completado-badge">✅ Completado</span>' : 
                                `<span class="puntos-badge">+${desafio.puntos} puntos</span>`
                            }
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="desafios-section">
                <h3><i class="fas fa-flag-checkered"></i> Desafíos</h3>
                <div class="desafios-grid">
                    ${desafiosHTML}
                </div>
            </div>
        `;
    },

    // ===== RENDERIZAR LOGROS =====
    renderizarLogros() {
        const logrosHTML = this.logros.map(logro => {
            const clase = logro.desbloqueado ? 'logro-desbloqueado' : 'logro-bloqueado';
            return `
                <div class="logro-card ${clase}">
                    <div class="logro-contenido">
                        <h4>${logro.nombre}</h4>
                        <p>${logro.descripcion}</p>
                        ${logro.desbloqueado ? 
                            `<span class="recompensa">🎁 ${logro.recompensa}</span>` :
                            '<span class="bloqueado-texto">🔒 Bloqueado</span>'
                        }
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="logros-section">
                <h3><i class="fas fa-trophy"></i> Logros</h3>
                <div class="logros-grid">
                    ${logrosHTML}
                </div>
            </div>
        `;
    },

    // ===== NOTIFICACIONES =====
    mostrarNotificacionDesafio(desafio, subioNivel) {
        const mensaje = subioNivel ? 
            `🎉 ¡Desafío completado! ${desafio.nombre}\n🎖️ ¡Subiste al nivel ${this.state.nivel}!` :
            `🎉 ¡Desafío completado! ${desafio.nombre}\n+${desafio.puntos} puntos`;
        
        if (typeof mostrarNotificacionElegante === 'function') {
            mostrarNotificacionElegante(mensaje, 'success');
        } else {
            alert(mensaje);
        }
    },

    mostrarNotificacionLogro(logro) {
        const mensaje = `🏆 ¡Logro desbloqueado! ${logro.nombre}\n🎁 Recompensa: ${logro.recompensa}`;
        
        if (typeof mostrarNotificacionElegante === 'function') {
            mostrarNotificacionElegante(mensaje, 'success');
        } else {
            alert(mensaje);
        }
    },

    // ===== HABILITAR/DESHABILITAR =====
    habilitarSistema() {
        this.state.sistemaHabilitado = true;
        this.guardarEstado();
        this.renderizar();
    },

    deshabilitarSistema() {
        const confirmar = confirm('¿Deseas deshabilitar el sistema de desafíos?\n\nTus progresos se guardarán y podrás reactivarlo cuando quieras.');
        if (confirmar) {
            this.state.sistemaHabilitado = false;
            this.guardarEstado();
            this.renderizar();
        }
    }
};

// Exportar para uso global
window.DesafiosEmocionales = DesafiosEmocionales;

console.log('✅ Sistema de Desafíos Emocionales cargado correctamente');















