/**
 * 💜 SISTEMA DE BIENESTAR EMOCIONAL PERSONALIZADO
 * Detección de sobrecarga, alertas de estrés (SOP), recordatorios de límites
 * Sistema privado y personal
 */

class SistemaBienestarCarla {
    constructor() {
        this.estadoActual = null;
        this.nivelEstres = 0;
        this.historial = this.cargarHistorial();
        this.diario = this.cargarDiario();
        this.contadorRespiracion = null;
        this.faseRespiracion = 'inhalar'; // inhalar, mantener, exhalar, pausa
        this.intervaloRespiracion = null;
        this.nombreUsuario = this.cargarNombre() || 'Tu';
        
        this.init();
    }

    init() {
        console.log('💜 Sistema de Bienestar inicializado');
        this.configurarNombre();
        this.configurarEventos();
        this.monitorearActividad();
        this.verificarEstadoActual();
        this.mostrarHistorial();
        this.mostrarEntradasDiario();
    }

    configurarNombre() {
        const nombreSpan = document.getElementById('nombreUsuario');
        if (nombreSpan && this.nombreUsuario) {
            nombreSpan.textContent = this.nombreUsuario;
        }
        
        // Permitir cambiar el nombre
        if (nombreSpan) {
            nombreSpan.style.cursor = 'pointer';
            nombreSpan.title = 'Click para cambiar tu nombre';
            nombreSpan.addEventListener('click', () => {
                this.cambiarNombre();
            });
        }
    }

    cambiarNombre() {
        const nombreActual = this.nombreUsuario || 'Tu';
        const nuevoNombre = prompt('¿Cómo querés que te llamemos? (dejá vacío para usar "Tu")', nombreActual);
        
        if (nuevoNombre !== null) {
            this.nombreUsuario = nuevoNombre.trim() || 'Tu';
            this.guardarNombre();
            this.configurarNombre();
            
            const mensaje = document.createElement('div');
            mensaje.className = 'mensaje-apoyo';
            mensaje.innerHTML = `<i class="fas fa-check"></i><p>¡Listo, ${this.nombreUsuario}! Tu nombre se guardó.</p>`;
            document.body.appendChild(mensaje);
            setTimeout(() => mensaje.remove(), 3000);
        }
    }

    configurarEventos() {
        // Botones de emociones
        document.querySelectorAll('.emocion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const emocion = e.currentTarget.dataset.emocion;
                const nivel = parseInt(e.currentTarget.dataset.nivel);
                this.registrarEstado(emocion, nivel);
            });
        });

        // Detectar cuando está leyendo contenido triste o estresante
        this.detectarContenidoEstresante();
    }

    registrarEstado(emocion, nivel) {
        this.estadoActual = { emocion, nivel, fecha: new Date() };
        
        // Actualizar UI
        document.querySelectorAll('.emocion-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        // Guardar en historial
        this.historial.push({
            emocion,
            nivel,
            fecha: new Date().toISOString(),
            timestamp: Date.now()
        });
        this.guardarHistorial();

        // Evaluar si necesita alerta
        this.evaluarAlerta(nivel);

        // Mostrar mensaje de apoyo
        this.mostrarMensajeApoyo(emocion, nivel);

        // Actualizar historial visual
        this.mostrarHistorial();
    }

    evaluarAlerta(nivel) {
        const seccionAlerta = document.getElementById('seccionAlertaEstres');
        
        // Nivel 4-5 = necesita atención inmediata
        if (nivel >= 4) {
            this.nivelEstres = nivel;
            seccionAlerta.style.display = 'block';
            
            // Alerta especial para estrés (SOP)
            if (nivel === 5) {
                this.mostrarAlertaCritica();
            }
        } else {
            seccionAlerta.style.display = 'none';
        }
    }

    mostrarAlertaCritica() {
        // Crear notificación especial
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion-critica';
        notificacion.innerHTML = `
            <div class="notificacion-contenido">
                <i class="fas fa-heartbeat"></i>
                <div>
                    <h4>⚠️ Alerta de Estrés Crítico</h4>
                    <p>Recordá que el estrés puede empeorar el SOP y aumentar el riesgo cardiovascular. Es momento de parar y cuidarte.</p>
                    <p><strong>Tomá una pausa ahora. Tu salud es lo más importante.</strong></p>
                </div>
            </div>
        `;
        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.style.opacity = '0';
            setTimeout(() => notificacion.remove(), 300);
        }, 10000);
    }

    mostrarMensajeApoyo(emocion, nivel) {
        const mensajes = {
            sobrepasada: "Entiendo que te sentís sobrepasada. No estás sola. Tomá una pausa, respirá. No tenés que resolver todo ahora.",
            estresada: "El estrés puede empeorar el SOP. Recordá: parar no es rendirse, es cuidarte. Tu salud es prioridad.",
            triste: "Está bien sentirse triste. Tus sentimientos son válidos. Permitite sentir, pero también recordá que esto pasará.",
            ansiosa: "La ansiedad puede ser abrumadora. Intentá la respiración guiada. Te va a ayudar a calmarte.",
            regular: "Está bien tener días regulares. No todos los días tienen que ser perfectos. Cuidate hoy.",
            bien: "Me alegra que te sientas bien. Seguí cuidándote y recordá tus límites."
        };

        const mensaje = mensajes[emocion] || "Estás haciendo lo mejor que podés. Eso es suficiente.";

        // Mostrar mensaje temporal
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'mensaje-apoyo';
        mensajeDiv.innerHTML = `
            <i class="fas fa-heart"></i>
            <p>${mensaje}</p>
        `;
        document.body.appendChild(mensajeDiv);

        setTimeout(() => {
            mensajeDiv.style.opacity = '0';
            setTimeout(() => mensajeDiv.remove(), 300);
        }, 5000);
    }

    detectarContenidoEstresante() {
        // Monitorear cuando lee contenido que puede afectarla
        let tiempoEnContenidoTriste = 0;
        const palabrasClave = ['triste', 'dolor', 'sufrimiento', 'difícil', 'problema', 'crisis'];

        // Detectar cuando está en páginas con contenido sensible
        const observer = new MutationObserver(() => {
            const texto = document.body.innerText.toLowerCase();
            const tieneContenidoSensible = palabrasClave.some(palabra => texto.includes(palabra));

            if (tieneContenidoSensible) {
                tiempoEnContenidoTriste += 1;
                
                // Si pasa más de 2 minutos leyendo contenido sensible, sugerir pausa
                if (tiempoEnContenidoTriste > 120) {
                    this.sugerirPausa();
                    tiempoEnContenidoTriste = 0;
                }
            } else {
                tiempoEnContenidoTriste = 0;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    sugerirPausa() {
        const sugerencia = document.createElement('div');
        sugerencia.className = 'sugerencia-pausa';
        sugerencia.innerHTML = `
            <div class="sugerencia-contenido">
                <i class="fas fa-pause-circle"></i>
                <div>
                    <h4>💜 Recordatorio de Límites</h4>
                    <p>Llevás un tiempo leyendo contenido que puede afectarte. Recordá que podés cerrar esto y cuidarte. No tenés que leer todo.</p>
                    <button onclick="this.closest('.sugerencia-pausa').remove(); tomarPausa();">Tomar Pausa</button>
                    <button onclick="this.closest('.sugerencia-pausa').remove();" style="background: #6B7280;">Continuar</button>
                </div>
            </div>
        `;
        document.body.appendChild(sugerencia);
    }

    monitorearActividad() {
        // Detectar patrones de sobrecarga
        let clicksRapidos = 0;
        let ultimoClick = 0;

        document.addEventListener('click', () => {
            const ahora = Date.now();
            if (ahora - ultimoClick < 500) {
                clicksRapidos++;
                if (clicksRapidos > 10) {
                    this.detectarSobrecarga();
                    clicksRapidos = 0;
                }
            } else {
                clicksRapidos = 0;
            }
            ultimoClick = ahora;
        });

        // Detectar cuando está trabajando mucho tiempo
        let tiempoTrabajando = 0;
        setInterval(() => {
            tiempoTrabajando += 1;
            if (tiempoTrabajando > 3600) { // 1 hora
                this.sugerirDescanso();
                tiempoTrabajando = 0;
            }
        }, 1000);
    }

    detectarSobrecarga() {
        if (this.nivelEstres < 4) {
            this.nivelEstres = 4;
            this.evaluarAlerta(4);
            
            const alerta = document.createElement('div');
            alerta.className = 'alerta-sobrecarga';
            alerta.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>Detecté que podés estar sobrepasándote. ¿Querés tomar una pausa?</p>
                <button onclick="tomarPausa(); this.closest('.alerta-sobrecarga').remove();">Sí, pausa</button>
                <button onclick="this.closest('.alerta-sobrecarga').remove();" style="background: #6B7280;">No, sigo</button>
            `;
            document.body.appendChild(alerta);
        }
    }

    sugerirDescanso() {
        const sugerencia = document.createElement('div');
        sugerencia.className = 'sugerencia-descanso';
        sugerencia.innerHTML = `
            <i class="fas fa-bed"></i>
            <p>Llevás más de una hora trabajando. Recordá que el descanso es importante, especialmente con SOP. ¿Querés tomar un descanso?</p>
            <button onclick="this.closest('.sugerencia-descanso').remove();">Cerrar</button>
        `;
        document.body.appendChild(sugerencia);
    }

    verificarEstadoActual() {
        if (this.historial.length > 0) {
            const ultimo = this.historial[this.historial.length - 1];
            const fechaUltimo = new Date(ultimo.timestamp);
            const ahora = new Date();
            const horasPasadas = (ahora - fechaUltimo) / (1000 * 60 * 60);

            // Si el último registro fue hace menos de 24 horas, mostrar estado
            if (horasPasadas < 24) {
                const btn = document.querySelector(`[data-emocion="${ultimo.emocion}"]`);
                if (btn) {
                    btn.classList.add('active');
                }
                this.evaluarAlerta(ultimo.nivel);
            }
        }
    }

    mostrarHistorial() {
        const container = document.getElementById('historialContainer');
        
        if (this.historial.length === 0) {
            container.innerHTML = '<p class="sin-datos">Aún no hay registros. Empezá registrando cómo te sentís.</p>';
            return;
        }

        const ultimos10 = this.historial.slice(-10).reverse();
        container.innerHTML = ultimos10.map(entrada => {
            const fecha = new Date(entrada.timestamp);
            const fechaStr = fecha.toLocaleDateString('es-AR', { 
                day: 'numeric', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            return `
                <div class="entrada-historial">
                    <div class="entrada-info">
                        <div class="entrada-fecha">${fechaStr}</div>
                        <div class="entrada-emocion">${this.obtenerEmojiEmocion(entrada.emocion)} ${this.capitalizar(entrada.emocion)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    obtenerEmojiEmocion(emocion) {
        const emojis = {
            bien: '😊',
            regular: '😐',
            ansiosa: '😰',
            triste: '😔',
            sobrepasada: '⚠️',
            estresada: '💔'
        };
        return emojis[emocion] || '💜';
    }

    capitalizar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ===== RESPIRACIÓN GUIADA =====
    iniciarRespiracionCompleta() {
        const circulo = document.getElementById('circuloRespiracion');
        const instrucciones = document.getElementById('instruccionesRespiracion');
        const contador = document.getElementById('contadorRespiracion');
        const btn = document.querySelector('.btn-iniciar-respiracion');
        
        btn.style.display = 'none';
        this.faseRespiracion = 'inhalar';
        let segundos = 4;

        this.intervaloRespiracion = setInterval(() => {
            contador.textContent = segundos;
            
            if (this.faseRespiracion === 'inhalar') {
                instrucciones.textContent = 'Inhalá por la nariz...';
                circulo.style.transform = 'scale(1.3)';
                segundos--;
                if (segundos < 0) {
                    this.faseRespiracion = 'mantener';
                    segundos = 7;
                }
            } else if (this.faseRespiracion === 'mantener') {
                instrucciones.textContent = 'Mantené el aire...';
                circulo.style.transform = 'scale(1.3)';
                segundos--;
                if (segundos < 0) {
                    this.faseRespiracion = 'exhalar';
                    segundos = 8;
                }
            } else if (this.faseRespiracion === 'exhalar') {
                instrucciones.textContent = 'Exhalá por la boca...';
                circulo.style.transform = 'scale(1)';
                segundos--;
                if (segundos < 0) {
                    this.faseRespiracion = 'pausa';
                    segundos = 2;
                }
            } else {
                instrucciones.textContent = 'Pausa...';
                segundos--;
                if (segundos < 0) {
                    this.faseRespiracion = 'inhalar';
                    segundos = 4;
                }
            }
        }, 1000);
    }

    // ===== DIARIO =====
    guardarEntradaDiario() {
        const texto = document.getElementById('entradaDiario').value.trim();
        if (!texto) return;

        const entrada = {
            texto,
            fecha: new Date().toISOString(),
            timestamp: Date.now()
        };

        this.diario.push(entrada);
        this.guardarDiario();
        document.getElementById('entradaDiario').value = '';
        this.mostrarEntradasDiario();
        
        // Mensaje de confirmación
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-apoyo';
        mensaje.innerHTML = '<i class="fas fa-check"></i><p>Entrada guardada. Escribir ayuda a procesar las emociones.</p>';
        document.body.appendChild(mensaje);
        setTimeout(() => mensaje.remove(), 3000);
    }

    mostrarEntradasDiario() {
        const container = document.getElementById('entradasPrevias');
        if (this.diario.length === 0) {
            container.innerHTML = '<p class="sin-datos">Aún no hay entradas. Escribí lo que sentís cuando quieras.</p>';
            return;
        }

        const ultimas5 = this.diario.slice(-5).reverse();
        container.innerHTML = ultimas5.map(entrada => {
            const fecha = new Date(entrada.timestamp);
            const fechaStr = fecha.toLocaleDateString('es-AR', { 
                day: 'numeric', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            return `
                <div class="entrada-diario-item">
                    <div class="entrada-diario-fecha">${fechaStr}</div>
                    <div class="entrada-diario-texto">${entrada.texto}</div>
                </div>
            `;
        }).join('');
    }

    // ===== ALMACENAMIENTO =====
    guardarHistorial() {
        localStorage.setItem('bienestar_carla_historial', JSON.stringify(this.historial));
    }

    cargarHistorial() {
        const guardado = localStorage.getItem('bienestar_carla_historial');
        return guardado ? JSON.parse(guardado) : [];
    }

    guardarDiario() {
        localStorage.setItem('bienestar_carla_diario', JSON.stringify(this.diario));
    }

    cargarDiario() {
        const guardado = localStorage.getItem('bienestar_carla_diario');
        return guardado ? JSON.parse(guardado) : [];
    }

    guardarNombre() {
        localStorage.setItem('bienestar_nombre_usuario', this.nombreUsuario);
    }

    cargarNombre() {
        return localStorage.getItem('bienestar_nombre_usuario');
    }
}

// ===== FUNCIONES GLOBALES =====
let sistemaBienestar;

function iniciarRespiracion() {
    abrirModal('modalRespiracion');
}

function tomarPausa() {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-apoyo';
    mensaje.innerHTML = `
        <i class="fas fa-pause"></i>
        <p>Tomaste una pausa. Eso está bien. Cuidarte es importante. Respirá, descansá. No hay prisa.</p>
    `;
    document.body.appendChild(mensaje);
    setTimeout(() => mensaje.remove(), 8000);
}

function abrirRespiracion() {
    abrirModal('modalRespiracion');
}

function abrirLímites() {
    abrirModal('modalLimites');
}

function abrirAutocuidado() {
    abrirModal('modalAutocuidado');
}

function abrirDiario() {
    abrirModal('modalDiario');
}

function cerrarModal(id) {
    document.getElementById(id).style.display = 'none';
    if (sistemaBienestar && sistemaBienestar.intervaloRespiracion) {
        clearInterval(sistemaBienestar.intervaloRespiracion);
    }
}

function abrirModal(id) {
    document.getElementById(id).style.display = 'block';
}

function guardarEntradaDiario() {
    if (sistemaBienestar) {
        sistemaBienestar.guardarEntradaDiario();
    }
}

function iniciarRespiracionCompleta() {
    if (sistemaBienestar) {
        sistemaBienestar.iniciarRespiracionCompleta();
    }
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    sistemaBienestar = new SistemaBienestarCarla();
});

