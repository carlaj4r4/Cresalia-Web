// ===== SISTEMA DE CRISLA - VERSIÓN 2.0 - MODO DESARROLLO =====
// ===== CONFIGURACIÓN EXCLUSIVA DE CRISLA =====
const CRISLA_CONFIG = {
    password: 'crisla2024',
    sessionTimeout: 30 * 60 * 1000, // 30 minutos
    secretKey: 'Ctrl + Alt + Shift + C',
    backupInterval: 5 * 60 * 1000, // 5 minutos
    maxBackups: 10, // Máximo 10 backups guardados
    modoDesarrollo: false // Cambiar a true para activar simulaciones
};

// ===== VARIABLES GLOBALES =====
let carlaSessionTimer;
let carlaLoggedIn = false;
let carlaBackupTimer;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Sistema de Crisla iniciando...');
    mostrarLoginCarla();
    configurarEventosCarla();
});

// ===== FUNCIONES DE LOGIN/LOGOUT =====
function mostrarLoginCarla() {
    document.getElementById('loginCarla').style.display = 'flex';
    document.getElementById('carlaPanel').style.display = 'none';
}

function configurarEventosCarla() {
    const loginForm = document.getElementById('loginCarlaForm');
    if (loginForm) {
        loginForm.addEventListener('submit', manejarLoginCarla);
    }
    
    // Configurar event listeners para navegación
    configurarNavegacionCarla();
}

function configurarNavegacionCarla() {
    const navButtons = document.querySelectorAll('.carla-nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const seccion = this.getAttribute('data-section');
            if (seccion) {
                mostrarSeccionCarla(seccion);
            }
        });
    });
}

function manejarLoginCarla(event) {
    event.preventDefault();
    const password = document.getElementById('carlaPassword').value;
    
    if (password === CRISLA_CONFIG.password) {
        iniciarSesionCarla();
    } else {
        mostrarNotificacionCarla('❌ Contraseña incorrecta', 'error');
    }
}

function iniciarSesionCarla() {
    carlaLoggedIn = true;
    document.getElementById('loginCarla').style.display = 'none';
    document.getElementById('carlaPanel').style.display = 'block';
    
    // Cargar configuración de modo desarrollo
    const modoDesarrolloGuardado = localStorage.getItem('crislaModoDesarrollo');
    if (modoDesarrolloGuardado !== null) {
        CRISLA_CONFIG.modoDesarrollo = modoDesarrolloGuardado === 'true';
    }
    
    // Iniciar timer de sesión
    iniciarTimerSesionCarla();
    
    // Iniciar sistema de backup automático
    iniciarBackupAutomaticoCarla();
    
    // Iniciar simulaciones si está en modo desarrollo
    if (CRISLA_CONFIG.modoDesarrollo) {
        iniciarSimulacionesDesarrollo();
    }
    
    // Actualizar interfaz del modo desarrollo
    actualizarInterfazModoDesarrollo();
    
    // Cargar dashboard
    cargarDashboardCarla();
    
    // Configurar navegación después de cargar el panel
    setTimeout(() => {
        configurarNavegacionCarla();
    }, 100);
    
    mostrarNotificacionCarla('👑 ¡Bienvenida Crisla!', 'success');
}

function cerrarSesionCarla() {
    carlaLoggedIn = false;
    clearTimeout(carlaSessionTimer);
    clearInterval(carlaBackupTimer);
    
    // Detener simulaciones si están activas
    detenerSimulacionesDesarrollo();
    
    mostrarLoginCarla();
    mostrarNotificacionCarla('👋 Sesión cerrada', 'info');
}

function iniciarTimerSesionCarla() {
    carlaSessionTimer = setTimeout(() => {
        cerrarSesionCarla();
        mostrarNotificacionCarla('⏰ Sesión expirada', 'warning');
    }, CRISLA_CONFIG.sessionTimeout);
}

// ===== NAVEGACIÓN =====
function mostrarSeccionCarla(seccion) {
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('.carla-section');
    secciones.forEach(sec => sec.style.display = 'none');
    
    // Mostrar sección seleccionada
    const seccionActiva = document.getElementById(seccion);
    if (seccionActiva) {
        seccionActiva.style.display = 'block';
    }
    
    // Actualizar botones de navegación
    const navBtns = document.querySelectorAll('.carla-nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    const btnActivo = document.querySelector(`[data-section="${seccion}"]`);
    if (btnActivo) {
        btnActivo.classList.add('active');
    }
    
    // Cargar contenido específico
    switch(seccion) {
        case 'dashboard':
            cargarDashboardCarla();
            break;
        case 'clientes':
            cargarTicketsClientes();
            break;
        case 'usuarios':
            cargarTicketsUsuarios();
            break;
        case 'todos':
            cargarTodosLosTickets();
            break;
        case 'chat':
            cargarChatCarla();
            break;
        case 'historial':
            cargarHistorialCarla();
            break;
        case 'reportes':
            cargarReportesCarla();
            break;
        case 'configuracion':
            cargarConfiguracionCarla();
            break;
        case 'logs':
            cargarLogsUsuariosCarla();
            break;
    }
}

// ===== DASHBOARD =====
function cargarDashboardCarla() {
    const tickets = JSON.parse(localStorage.getItem('cresalia_tickets') || '[]');
    const chats = JSON.parse(localStorage.getItem('crisla_chats') || '[]');
    
    // Actualizar estadísticas
    const totalTickets = tickets.length;
    const ticketsUrgentes = tickets.filter(t => t.prioridad === 'Alta' || t.prioridad === 'Urgente').length;
    const ticketsPendientes = tickets.filter(t => t.estado === 'Abierto').length;
    const ticketsResueltos = tickets.filter(t => t.estado === 'Cerrado' || t.estado === 'Resuelto').length;
    const ticketsHoy = tickets.filter(t => {
        const hoy = new Date().toDateString();
        return new Date(t.timestamp).toDateString() === hoy;
    }).length;
    const tiempoPromedio = 15; // Simulado
    
    // Actualizar elementos que existen
    const totalTicketsEl = document.getElementById('totalTickets');
    if (totalTicketsEl) totalTicketsEl.textContent = totalTickets;
    
    const ticketsUrgentesEl = document.getElementById('ticketsUrgentes');
    if (ticketsUrgentesEl) ticketsUrgentesEl.textContent = ticketsUrgentes;
    
    const ticketsPendientesEl = document.getElementById('ticketsPendientes');
    if (ticketsPendientesEl) ticketsPendientesEl.textContent = ticketsPendientes;
    
    const ticketsResueltosEl = document.getElementById('ticketsResueltos');
    if (ticketsResueltosEl) ticketsResueltosEl.textContent = ticketsResueltos;
    
    const ticketsHoyEl = document.getElementById('ticketsHoy');
    if (ticketsHoyEl) ticketsHoyEl.textContent = ticketsHoy;
    
    const tiempoPromedioEl = document.getElementById('tiempoPromedio');
    if (tiempoPromedioEl) tiempoPromedioEl.textContent = tiempoPromedio + ' min';
    
    // Cargar mensajes de apoyo emocional
    cargarMensajesApoyoEmocional();
}

// Cargar mensajes de apoyo emocional
function cargarMensajesApoyoEmocional() {
    const mensajesApoyo = JSON.parse(localStorage.getItem('cresalia_mensajes_apoyo') || '[]');
    
    // Crear o actualizar sección de mensajes de apoyo
    let apoyoSection = document.getElementById('apoyo-emocional-section');
    if (!apoyoSection) {
        // Crear sección si no existe
        const dashboardContent = document.querySelector('.dashboard-content');
        if (dashboardContent) {
            apoyoSection = document.createElement('div');
            apoyoSection.id = 'apoyo-emocional-section';
            apoyoSection.className = 'dashboard-card';
            apoyoSection.innerHTML = `
                <div class="card-header">
                    <h3>💜 Mensajes de Apoyo Emocional</h3>
                    <span class="badge badge-purple">${mensajesApoyo.length}</span>
                </div>
                <div class="card-body">
                    <div id="mensajes-apoyo-container"></div>
                </div>
            `;
            dashboardContent.appendChild(apoyoSection);
        }
    }
    
    // Actualizar contador
    const badge = apoyoSection?.querySelector('.badge');
    if (badge) {
        badge.textContent = mensajesApoyo.length;
    }
    
    // Renderizar mensajes
    const container = document.getElementById('mensajes-apoyo-container');
    if (container && mensajesApoyo.length > 0) {
        container.innerHTML = mensajesApoyo.slice(0, 5).map(mensaje => `
            <div class="mensaje-apoyo-item" onclick="abrirMensajeApoyo('${mensaje.id}')">
                <div class="mensaje-header">
                    <span class="mensaje-from">${mensaje.tenant_id}</span>
                    <span class="mensaje-fecha">${new Date(mensaje.fecha).toLocaleDateString()}</span>
                    <span class="mensaje-prioridad ${mensaje.prioridad}">${mensaje.prioridad}</span>
                </div>
                <div class="mensaje-preview">
                    ${mensaje.mensaje.substring(0, 100)}${mensaje.mensaje.length > 100 ? '...' : ''}
                </div>
                <div class="mensaje-emocion">
                    Emoción: ${mensaje.emocion}
                </div>
            </div>
        `).join('');
    } else if (container) {
        container.innerHTML = '<p class="no-mensajes">No hay mensajes de apoyo emocional pendientes</p>';
    }
}

// Abrir mensaje de apoyo emocional
function abrirMensajeApoyo(mensajeId) {
    const mensajesApoyo = JSON.parse(localStorage.getItem('cresalia_mensajes_apoyo') || '[]');
    const mensaje = mensajesApoyo.find(m => m.id == mensajeId);
    
    if (!mensaje) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-apoyo-emocional';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>💜 Mensaje de Apoyo Emocional</h2>
                <button class="btn-cerrar" onclick="this.closest('.modal-apoyo-emocional').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="mensaje-info">
                    <div class="info-item">
                        <strong>De:</strong> ${mensaje.tenant_id}
                    </div>
                    <div class="info-item">
                        <strong>Fecha:</strong> ${new Date(mensaje.fecha).toLocaleString()}
                    </div>
                    <div class="info-item">
                        <strong>Emoción:</strong> ${mensaje.emocion}
                    </div>
                    <div class="info-item">
                        <strong>Prioridad:</strong> <span class="prioridad-badge ${mensaje.prioridad}">${mensaje.prioridad}</span>
                    </div>
                </div>
                
                <div class="mensaje-contenido">
                    <h4>Mensaje:</h4>
                    <div class="mensaje-texto">${mensaje.mensaje}</div>
                </div>
                
                ${mensaje.contexto ? `
                <div class="mensaje-contexto">
                    <h4>Contexto:</h4>
                    <ul>
                        ${Object.entries(mensaje.contexto).map(([key, value]) => 
                            value ? `<li>${key}</li>` : ''
                        ).filter(Boolean).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="modal-actions">
                    <button class="btn-cancelar" onclick="this.closest('.modal-apoyo-emocional').remove()">
                        Cerrar
                    </button>
                    <button class="btn-responder" onclick="responderMensajeApoyo('${mensaje.id}')">
                        <i class="fas fa-reply"></i>
                        Responder
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Responder mensaje de apoyo emocional
function responderMensajeApoyo(mensajeId) {
    // Cerrar modal actual
    document.querySelector('.modal-apoyo-emocional')?.remove();
    
    // Abrir modal de respuesta
    const modal = document.createElement('div');
    modal.className = 'modal-respuesta-apoyo';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>💜 Responder Mensaje de Apoyo</h2>
                <button class="btn-cerrar" onclick="this.closest('.modal-respuesta-apoyo').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="respuesta-area">
                    <label for="respuesta-apoyo">Tu respuesta:</label>
                    <textarea id="respuesta-apoyo" rows="8" placeholder="Escribí tu respuesta empática aquí..."></textarea>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-cancelar" onclick="this.closest('.modal-respuesta-apoyo').remove()">
                        Cancelar
                    </button>
                    <button class="btn-enviar" onclick="enviarRespuestaApoyo('${mensajeId}')">
                        <i class="fas fa-paper-plane"></i>
                        Enviar Respuesta
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Enviar respuesta de apoyo emocional
function enviarRespuestaApoyo(mensajeId) {
    const respuesta = document.getElementById('respuesta-apoyo').value;
    
    if (!respuesta.trim()) {
        alert('Por favor escribí una respuesta');
        return;
    }
    
    // Actualizar mensaje con respuesta
    const mensajesApoyo = JSON.parse(localStorage.getItem('cresalia_mensajes_apoyo') || '[]');
    const mensajeIndex = mensajesApoyo.findIndex(m => m.id == mensajeId);
    
    if (mensajeIndex !== -1) {
        mensajesApoyo[mensajeIndex].respuesta = respuesta;
        mensajesApoyo[mensajeIndex].estado = 'respondido';
        mensajesApoyo[mensajeIndex].fechaRespuesta = new Date().toISOString();
        
        localStorage.setItem('cresalia_mensajes_apoyo', JSON.stringify(mensajesApoyo));
    }
    
    // Cerrar modal
    document.querySelector('.modal-respuesta-apoyo')?.remove();
    
    // Mostrar confirmación
    mostrarNotificacionCarla('💜 Respuesta enviada correctamente', 'success');
    
    // Recargar mensajes
    cargarMensajesApoyoEmocional();
}

// ===== GESTIÓN DE TICKETS =====
function cargarTicketsClientes() {
    let tickets = JSON.parse(localStorage.getItem('cresalia_tickets') || '[]');
    const ticketsClientes = tickets.filter(t => t.tipoUsuario === 'Cliente');
    
    const container = document.getElementById('clientesContainer');
    if (!container) return;
    
    if (ticketsClientes.length === 0) {
        container.innerHTML = `
            <div class="no-tickets">
                <i class="fas fa-store"></i>
                <h3>No hay tickets de clientes</h3>
                <p>Los administradores de tiendas no han creado tickets aún</p>
            </div>
        `;
        return;
    }
    
    ticketsClientes.sort((a, b) => b.timestamp - a.timestamp);
    container.innerHTML = ticketsClientes.map(ticket => crearTicketHTML(ticket)).join('');
}

function cargarTicketsUsuarios() {
    let tickets = JSON.parse(localStorage.getItem('cresalia_tickets') || '[]');
    const ticketsUsuarios = tickets.filter(t => t.tipoUsuario === 'Usuario');
    
    const container = document.getElementById('usuariosContainer');
    if (!container) return;
    
    if (ticketsUsuarios.length === 0) {
        container.innerHTML = `
            <div class="no-tickets">
                <i class="fas fa-shopping-cart"></i>
                <h3>No hay tickets de usuarios</h3>
                <p>Los compradores no han creado consultas aún</p>
            </div>
        `;
        return;
    }
    
    ticketsUsuarios.sort((a, b) => b.timestamp - a.timestamp);
    container.innerHTML = ticketsUsuarios.map(ticket => crearTicketHTML(ticket)).join('');
}

function cargarTodosLosTickets() {
    let tickets = JSON.parse(localStorage.getItem('cresalia_tickets') || '[]');
    
    // Agregar algunos tickets de ejemplo si no hay ninguno
    if (tickets.length === 0) {
        tickets = [
            {
                id: 'TKT-001',
                tipoUsuario: 'Cliente',
                tipoProblema: 'configuracion',
                prioridad: 'Alta',
                nombre: 'María García',
                email: 'maria@email.com',
                descripcion: 'No puedo configurar los métodos de pago en mi tienda',
                tienda: 'TechStore Argentina',
                tenantId: 'techstore-arg',
                estado: 'Abierto',
                fecha: new Date().toLocaleString(),
                timestamp: Date.now()
            },
            {
                id: 'USR-001',
                tipoUsuario: 'Usuario',
                tipoConsulta: 'producto',
                nombre: 'Juan Pérez',
                email: 'juan@email.com',
                descripcion: 'Mi pedido #12345 no llegó',
                numeroPedido: '#12345',
                estado: 'Abierto',
                fecha: new Date().toLocaleString(),
                timestamp: Date.now() - 3600000
            }
        ];
        localStorage.setItem('cresalia_tickets', JSON.stringify(tickets));
    }
    
    const container = document.getElementById('todosContainer');
    if (!container) return;
    
    if (tickets.length === 0) {
        container.innerHTML = `
            <div class="no-tickets">
                <i class="fas fa-inbox"></i>
                <h3>No hay tickets pendientes</h3>
                <p>Todos los tickets han sido atendidos</p>
            </div>
        `;
        return;
    }
    
    tickets.sort((a, b) => b.timestamp - a.timestamp);
    container.innerHTML = tickets.map(ticket => crearTicketHTML(ticket)).join('');
}

function crearTicketHTML(ticket) {
    const tipoUsuarioIcon = ticket.tipoUsuario === 'Cliente' ? '🏪' : '🛒';
    const tipoUsuarioClass = ticket.tipoUsuario === 'Cliente' ? 'cliente' : 'usuario';
    
    return `
        <div class="ticket-card ${ticket.estado} ${tipoUsuarioClass}" data-id="${ticket.id}">
            <div class="ticket-header">
                <span class="ticket-id">#${ticket.id}</span>
                <span class="ticket-tipo">${tipoUsuarioIcon} ${ticket.tipoUsuario}</span>
                <span class="ticket-estado ${ticket.estado}">${ticket.estado}</span>
                <span class="ticket-fecha">${new Date(ticket.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="ticket-content">
                <h4>${ticket.tipoProblema || ticket.tipoConsulta || 'Consulta'}</h4>
                <p>${ticket.descripcion}</p>
                <div class="ticket-info">
                    <span><i class="fas fa-user"></i> ${ticket.nombre}</span>
                    <span><i class="fas fa-envelope"></i> ${ticket.email}</span>
                    ${ticket.tienda ? `<span><i class="fas fa-store"></i> ${ticket.tienda}</span>` : ''}
                    ${ticket.numeroPedido ? `<span><i class="fas fa-receipt"></i> ${ticket.numeroPedido}</span>` : ''}
                    ${ticket.prioridad ? `<span><i class="fas fa-flag"></i> ${ticket.prioridad}</span>` : ''}
                </div>
            </div>
            <div class="ticket-actions">
                <button onclick="abrirTicketCarla('${ticket.id}')" class="btn-ver">
                    <i class="fas fa-eye"></i> Ver
                </button>
                <button onclick="cambiarEstadoTicketCarla('${ticket.id}')" class="btn-estado">
                    <i class="fas fa-check"></i> Atender
                </button>
                <button onclick="responderTicketCarla('${ticket.id}')" class="btn-responder">
                    <i class="fas fa-reply"></i> Responder
                </button>
            </div>
        </div>
    `;
}

function abrirTicketCarla(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('cresalia_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
        mostrarNotificacionCarla('❌ Ticket no encontrado', 'error');
        return;
    }
    
    // Crear modal para ver el ticket completo
    const modal = `
        <div id="ticketModal" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: var(--carla-primary); margin: 0;">🎫 Ticket #${ticket.id}</h2>
                    <button onclick="cerrarTicketModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--carla-gray);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="ticket-detalle" style="display: grid; gap: 20px;">
                    <!-- Información del ticket -->
                    <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; border: 2px solid #F9A8D4;">
                        <h3 style="color: var(--carla-primary); margin-bottom: 15px;"><i class="fas fa-info-circle"></i> Información del Ticket</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div><strong>ID:</strong> ${ticket.id}</div>
                            <div><strong>Tipo:</strong> ${ticket.tipoUsuario === 'Cliente' ? '🏪 Cliente' : '🛒 Usuario'}</div>
                            <div><strong>Estado:</strong> <span class="estado-${ticket.estado}">${ticket.estado}</span></div>
                            <div><strong>Fecha:</strong> ${ticket.fecha}</div>
                            <div><strong>Problema:</strong> ${ticket.tipoProblema || ticket.tipoConsulta || 'Consulta'}</div>
                            ${ticket.prioridad ? `<div><strong>Prioridad:</strong> ${ticket.prioridad}</div>` : ''}
                        </div>
                    </div>
                    
                    <!-- Información del usuario -->
                    <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; border: 2px solid #F9A8D4;">
                        <h3 style="color: var(--carla-primary); margin-bottom: 15px;"><i class="fas fa-user"></i> Información del Usuario</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div><strong>Nombre:</strong> ${ticket.nombre}</div>
                            <div><strong>Email:</strong> ${ticket.email}</div>
                            ${ticket.tienda ? `<div><strong>Tienda:</strong> ${ticket.tienda}</div>` : ''}
                            ${ticket.numeroPedido ? `<div><strong>Pedido:</strong> ${ticket.numeroPedido}</div>` : ''}
                        </div>
                    </div>
                    
                    <!-- Descripción del problema -->
                    <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; border: 2px solid #F9A8D4;">
                        <h3 style="color: var(--carla-primary); margin-bottom: 15px;"><i class="fas fa-comment"></i> Descripción del Problema</h3>
                        <p style="color: var(--carla-gray); line-height: 1.6; margin: 0;">${ticket.descripcion}</p>
                    </div>
                    
                    <!-- Respuestas (si las hay) -->
                    <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 20px; border-radius: 15px; border: 2px solid #F9A8D4;">
                        <h3 style="color: var(--carla-primary); margin-bottom: 15px;"><i class="fas fa-reply"></i> Historial de Respuestas</h3>
                        <div id="respuestasTicket" style="max-height: 200px; overflow-y: auto;">
                            ${ticket.respuestas ? ticket.respuestas.map(respuesta => `
                                <div style="background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid var(--carla-primary);">
                                    <div style="font-size: 12px; color: var(--carla-gray); margin-bottom: 5px;">
                                        ${respuesta.fecha} - Crisla
                                    </div>
                                    <div style="color: var(--carla-dark);">${respuesta.mensaje}</div>
                                    ${respuesta.archivos && respuesta.archivos.length > 0 ? `
                                        <div style="margin-top: 10px;">
                                            <strong style="color: var(--carla-primary); font-size: 12px;">📎 Archivos adjuntos:</strong>
                                            <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
                                                ${respuesta.archivos.map(archivo => `
                                                    <div style="background: var(--carla-light); padding: 5px 10px; border-radius: 6px; font-size: 11px; color: var(--carla-dark); border: 1px solid var(--carla-accent);">
                                                        <i class="fas fa-paperclip"></i> ${archivo.nombre}
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('') : '<p style="color: var(--carla-gray); text-align: center; font-style: italic;">No hay respuestas aún</p>'}
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; margin-top: 30px;">
                    <button onclick="cerrarTicketModal()" style="flex: 1; background: var(--carla-gray); color: white; border: none; padding: 15px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                    <button onclick="responderTicketCarla('${ticket.id}')" style="flex: 2; background: var(--carla-gradient); color: white; border: none; padding: 15px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-reply"></i> Responder
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
}

function cerrarTicketModal() {
    const modal = document.getElementById('ticketModal');
    if (modal) {
        modal.remove();
    }
}

function responderTicketCarla(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('cresalia_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    const modal = `
        <div id="respuestaModal" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 600px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: var(--carla-primary); margin-bottom: 10px;">💬 Responder Ticket</h2>
                    <p style="color: var(--carla-gray);">Enviar respuesta a ${ticket.nombre}</p>
                </div>
                
                <form id="respuestaForm">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--carla-primary);">Mensaje</label>
                        <textarea id="mensajeRespuesta" placeholder="Escribe tu respuesta..." style="width: 100%; padding: 15px; border: 2px solid #E5E7EB; border-radius: 10px; font-size: 14px; min-height: 150px; resize: vertical;" required></textarea>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--carla-primary);">📎 Archivos Adjuntos (Opcional)</label>
                        <div style="position: relative;">
                            <input type="file" id="archivosRespuesta" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar" style="width: 100%; padding: 15px; border: 2px dashed #E5E7EB; border-radius: 10px; font-size: 14px; cursor: pointer;">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; color: var(--carla-gray); font-size: 12px; text-align: center;">
                                <i class="fas fa-cloud-upload-alt" style="font-size: 24px; margin-bottom: 5px; display: block;"></i>
                                Haz clic para seleccionar archivos<br>
                                <small>Imágenes, videos, audios, PDFs, documentos (máx. 10MB cada uno)</small>
                            </div>
                        </div>
                        <div id="previewArchivosRespuesta" style="margin-top: 10px; display: none;">
                            <h4 style="color: var(--carla-primary); margin-bottom: 10px;">Archivos seleccionados:</h4>
                            <div id="listaArchivosRespuesta"></div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--carla-primary);">Nuevo Estado</label>
                        <select id="nuevoEstado" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 10px; font-size: 14px;">
                            <option value="${ticket.estado}">Mantener: ${ticket.estado}</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Cerrado">Cerrado</option>
                        </select>
                    </div>
                </form>
                
                <div style="display: flex; gap: 15px;">
                    <button onclick="cerrarRespuestaModal()" style="flex: 1; background: var(--carla-gray); color: white; border: none; padding: 15px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button onclick="enviarRespuestaCarla('${ticketId}')" style="flex: 2; background: var(--carla-gradient); color: white; border: none; padding: 15px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-paper-plane"></i> Enviar Respuesta
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
}

function cerrarRespuestaModal() {
    const modal = document.getElementById('respuestaModal');
    if (modal) {
        modal.remove();
    }
}

function enviarRespuestaCarla(ticketId) {
    const mensaje = document.getElementById('mensajeRespuesta').value;
    const nuevoEstado = document.getElementById('nuevoEstado').value;
    const archivosInput = document.getElementById('archivosRespuesta');
    
    if (!mensaje.trim()) {
        mostrarNotificacionCarla('⚠️ Por favor, escribe un mensaje', 'warning');
        return;
    }
    
    const tickets = JSON.parse(localStorage.getItem('cresalia_tickets') || '[]');
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
        mostrarNotificacionCarla('❌ Ticket no encontrado', 'error');
        return;
    }
    
    // Procesar archivos si los hay
    let archivosAdjuntos = [];
    if (archivosInput && archivosInput.files && archivosInput.files.length > 0) {
        archivosAdjuntos = Array.from(archivosInput.files).map(file => ({
            nombre: file.name,
            tamaño: file.size,
            tipo: file.type,
            fecha: new Date().toISOString(),
            url: URL.createObjectURL(file) // Para preview local
        }));
    }
    
    // Agregar respuesta al ticket
    if (!tickets[ticketIndex].respuestas) {
        tickets[ticketIndex].respuestas = [];
    }
    
    tickets[ticketIndex].respuestas.push({
        mensaje: mensaje,
        fecha: new Date().toLocaleString(),
        autor: 'Crisla',
        archivos: archivosAdjuntos
    });
    
    // Actualizar estado si cambió
    tickets[ticketIndex].estado = nuevoEstado;
    
    // Guardar cambios
    localStorage.setItem('cresalia_tickets', JSON.stringify(tickets));
    
    mostrarNotificacionCarla('✅ Respuesta enviada exitosamente' + (archivosAdjuntos.length > 0 ? ` con ${archivosAdjuntos.length} archivo(s)` : ''), 'success');
    cerrarRespuestaModal();
    
    // Recargar la sección actual
    const seccionActiva = document.querySelector('.carla-section.active');
    if (seccionActiva) {
        const seccionId = seccionActiva.id;
        mostrarSeccionCarla(seccionId);
    }
}

function cambiarEstadoTicketCarla(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('cresalia_tickets') || '[]');
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex !== -1) {
        tickets[ticketIndex].estado = 'En Proceso';
        localStorage.setItem('cresalia_tickets', JSON.stringify(tickets));
        
        // Recargar la sección actual
        const seccionActiva = document.querySelector('.carla-section.active');
        if (seccionActiva) {
            const seccionId = seccionActiva.id;
            mostrarSeccionCarla(seccionId);
        }
        
        mostrarNotificacionCarla('✅ Ticket marcado como "En Proceso"', 'success');
    }
}

// ===== CHAT EN VIVO =====
function cargarChatCarla() {
    const container = document.getElementById('chatContainer');
    if (!container) return;
    
    // Cargar chats existentes
    const chats = JSON.parse(localStorage.getItem('crisla_chats') || '[]');
    
    if (chats.length === 0) {
        // Crear algunos chats de ejemplo
        const chatsEjemplo = [
            {
                id: 'chat-001',
                usuario: 'María García',
                email: 'maria@email.com',
                tienda: 'TechStore Argentina',
                estado: 'activo',
                ultimoMensaje: 'Hola, necesito ayuda con mi tienda',
                timestamp: Date.now() - 1800000, // 30 minutos atrás
                mensajes: [
                    {
                        autor: 'usuario',
                        mensaje: 'Hola, necesito ayuda con mi tienda',
                        timestamp: Date.now() - 1800000
                    }
                ]
            },
            {
                id: 'chat-002',
                usuario: 'Juan Pérez',
                email: 'juan@email.com',
                tienda: 'Fashion Store',
                estado: 'activo',
                ultimoMensaje: '¿Cómo puedo configurar los pagos?',
                timestamp: Date.now() - 3600000, // 1 hora atrás
                mensajes: [
                    {
                        autor: 'usuario',
                        mensaje: '¿Cómo puedo configurar los pagos?',
                        timestamp: Date.now() - 3600000
                    }
                ]
            }
        ];
        localStorage.setItem('crisla_chats', JSON.stringify(chatsEjemplo));
    }
    
    container.innerHTML = `
        <div class="chat-live">
            <div class="chat-header">
                <h3><i class="fas fa-comments"></i> Chat en Vivo</h3>
                <span class="online-indicator">● En línea</span>
            </div>
            
            <div class="chats-list" id="chatsList">
                <!-- Los chats se cargarán aquí -->
            </div>
        </div>
    `;
    
    cargarListaChats();
    console.log('💬 Chat de Crisla cargado');
}

function cargarListaChats() {
    const chats = JSON.parse(localStorage.getItem('crisla_chats') || '[]');
    const container = document.getElementById('chatsList');
    
    if (!container) return;
    
    if (chats.length === 0) {
        container.innerHTML = `
            <div class="no-chats">
                <i class="fas fa-comments"></i>
                <h4>No hay chats activos</h4>
                <p>Los clientes aparecerán aquí cuando inicien un chat</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por último mensaje (más recientes primero)
    chats.sort((a, b) => b.timestamp - a.timestamp);
    
    container.innerHTML = chats.map(chat => `
        <div class="chat-item ${chat.estado}" onclick="abrirChatModal('${chat.id}')">
            <div class="chat-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="chat-info">
                <div class="chat-usuario">
                    <h4>${chat.usuario}</h4>
                    <span class="chat-tienda">${chat.tienda}</span>
                </div>
                <div class="chat-ultimo-mensaje">
                    <p>${chat.ultimoMensaje}</p>
                    <span class="chat-tiempo">${formatearTiempo(chat.timestamp)}</span>
                </div>
            </div>
            <div class="chat-estado">
                <span class="estado-${chat.estado}">${chat.estado}</span>
            </div>
        </div>
    `).join('');
}

function abrirChatModal(chatId) {
    const chats = JSON.parse(localStorage.getItem('crisla_chats') || '[]');
    const chat = chats.find(c => c.id === chatId);
    
    if (!chat) return;
    
    const modal = `
        <div id="chatModal" class="modal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; align-items: center; justify-content: center;" onclick="if(event.target.id === 'chatModal') cerrarChatModal()">
            <div class="modal-content" style="max-width: 700px; max-height: 80vh; display: flex; flex-direction: column; background: white; border-radius: 20px; padding: 25px; box-shadow: 0 25px 80px rgba(0,0,0,0.3); position: relative;" onclick="event.stopPropagation()">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #F9A8D4;">
                    <div>
                        <h2 style="color: var(--carla-primary); margin: 0;">💬 Chat con ${chat.usuario}</h2>
                        <p style="color: var(--carla-gray); margin: 5px 0 0 0; font-size: 14px;">${chat.tienda} • ${chat.email}</p>
                        <small style="color: #9CA3AF; font-size: 11px;">💡 Presiona ESC o haz clic fuera para cerrar</small>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button onclick="cerrarChatModal()" style="background: #FF6B6B; color: white; border: none; font-size: 18px; cursor: pointer; padding: 8px 12px; border-radius: 50%; transition: all 0.3s ease; box-shadow: 0 2px 10px rgba(255,107,107,0.3);" title="Cerrar Chat (ESC)" onmouseover="this.style.background='#FF5252'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='#FF6B6B'; this.style.transform='scale(1)'">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="chat-messages-container" style="flex: 1; overflow-y: auto; max-height: 400px; padding: 20px; background: linear-gradient(135deg, #FDF2F8, #FCE7F3); border-radius: 15px; border: 2px solid #F9A8D4; margin-bottom: 20px;">
                    <div id="chatMessages" class="chat-messages">
                        ${chat.mensajes.map(mensaje => `
                            <div class="mensaje ${mensaje.autor}">
                                <div class="mensaje-contenido">
                                    <span class="mensaje-texto">${mensaje.mensaje}</span>
                                    ${mensaje.archivos && mensaje.archivos.length > 0 ? `
                                        <div class="mensaje-archivos" style="margin-top: 10px;">
                                            ${mensaje.archivos.map(archivo => `
                                                <div style="display: inline-block; margin: 5px; padding: 8px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 12px;">
                                                    <i class="fas fa-paperclip"></i> ${archivo.nombre}
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                    <span class="mensaje-tiempo">${new Date(mensaje.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="chat-input-container" style="display: flex; gap: 10px; align-items: flex-end;">
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
                        <input type="text" id="chatInputModal" placeholder="Escribe tu respuesta..." style="padding: 15px; border: 2px solid #E5E7EB; border-radius: 10px; font-size: 14px;" onkeypress="if(event.key==='Enter') enviarMensajeChatModal('${chat.id}')">
                        <input type="file" id="chatArchivos" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar" style="padding: 10px; border: 2px dashed #E5E7EB; border-radius: 10px; font-size: 12px; background: #FDF2F8;" title="Adjuntar archivos">
                        <div id="previewChatArchivos" style="display: none; font-size: 12px; color: var(--carla-gray);">
                            <strong>Archivos:</strong> <span id="listaChatArchivos"></span>
                        </div>
                    </div>
                    <button onclick="enviarMensajeChatModal('${chat.id}')" style="background: var(--carla-gradient); color: white; border: none; padding: 15px 20px; border-radius: 10px; cursor: pointer; font-size: 16px;">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Enfocar el input
    setTimeout(() => {
        const input = document.getElementById('chatInputModal');
        if (input) input.focus();
        
        // Configurar preview de archivos para chat
        configurarPreviewArchivos('chatArchivos', 'previewChatArchivos', 'listaChatArchivos');
    }, 100);
}

function cerrarChatModal() {
    console.log('🔒 Cerrando modal de chat...');
    
    const modal = document.getElementById('chatModal');
    if (modal) {
        // Agregar animación de cierre
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            modal.remove();
            console.log('✅ Modal de chat cerrado exitosamente');
        }, 300);
    } else {
        console.log('⚠️ Modal de chat no encontrado');
    }
    
    // También cerrar cualquier otro modal que pueda estar abierto
    const otrosModales = document.querySelectorAll('.modal');
    otrosModales.forEach(modal => {
        if (modal.id !== 'chatModal') {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Función para cerrar todos los modales (útil para emergencias)
function cerrarTodosLosModales() {
    console.log('🚨 Cerrando todos los modales...');
    
    const modales = document.querySelectorAll('.modal, .modal-overlay, [id*="modal"], [class*="modal"]');
    modales.forEach(modal => {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => modal.remove(), 300);
    });
    
    console.log('✅ Todos los modales cerrados');
}

// Función para agregar botón de emergencia en el header
function agregarBotonEmergenciaModales() {
    const header = document.querySelector('.carla-header-right');
    if (header && !document.getElementById('botonEmergenciaModales')) {
        const botonEmergencia = document.createElement('button');
        botonEmergencia.id = 'botonEmergenciaModales';
        botonEmergencia.innerHTML = '<i class="fas fa-times-circle"></i> Cerrar Todos';
        botonEmergencia.style.cssText = `
            background: #FF6B6B;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 10px;
            transition: all 0.3s ease;
        `;
        botonEmergencia.onclick = cerrarTodosLosModales;
        botonEmergencia.title = 'Cerrar todos los modales abiertos';
        header.appendChild(botonEmergencia);
    }
}

// Agregar botón de emergencia cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(agregarBotonEmergenciaModales, 1000);
    
    // Agregar soporte para tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log('⌨️ Tecla Escape presionada - cerrando modales...');
            cerrarTodosLosModales();
        }
    });
});

function enviarMensajeChatModal(chatId) {
    const input = document.getElementById('chatInputModal');
    const mensaje = input.value.trim();
    const archivosInput = document.getElementById('chatArchivos');
    
    if (!mensaje && (!archivosInput || !archivosInput.files || archivosInput.files.length === 0)) return;
    
    const chats = JSON.parse(localStorage.getItem('crisla_chats') || '[]');
    const chatIndex = chats.findIndex(c => c.id === chatId);
    
    if (chatIndex === -1) return;
    
    // Procesar archivos si los hay
    let archivosAdjuntos = [];
    if (archivosInput && archivosInput.files && archivosInput.files.length > 0) {
        archivosAdjuntos = Array.from(archivosInput.files).map(file => ({
            nombre: file.name,
            tamaño: file.size,
            tipo: file.type,
            fecha: new Date().toISOString(),
            url: URL.createObjectURL(file)
        }));
    }
    
    // Crear mensaje
    const mensajeCompleto = mensaje || (archivosAdjuntos.length > 0 ? '📎 Archivo(s) enviado(s)' : '');
    
    // Agregar mensaje de Crisla
    chats[chatIndex].mensajes.push({
        autor: 'crisla',
        mensaje: mensajeCompleto,
        timestamp: Date.now(),
        archivos: archivosAdjuntos
    });
    
    // Actualizar último mensaje y timestamp
    chats[chatIndex].ultimoMensaje = mensajeCompleto;
    chats[chatIndex].timestamp = Date.now();
    
    // Guardar cambios
    localStorage.setItem('crisla_chats', JSON.stringify(chats));
    
    // Actualizar el modal
    const chatMessages = document.getElementById('chatMessages');
    const mensajeElement = document.createElement('div');
    mensajeElement.className = 'mensaje crisla';
    
    let archivosHTML = '';
    if (archivosAdjuntos.length > 0) {
        archivosHTML = `<div class="mensaje-archivos" style="margin-top: 10px;">
            ${archivosAdjuntos.map(archivo => `
                <div style="display: inline-block; margin: 5px; padding: 8px; background: rgba(255,255,255,0.2); border-radius: 8px; font-size: 12px;">
                    <i class="fas fa-paperclip"></i> ${archivo.nombre}
                </div>
            `).join('')}
        </div>`;
    }
    
    mensajeElement.innerHTML = `
        <div class="mensaje-contenido">
            <span class="mensaje-texto">${mensajeCompleto}</span>
            ${archivosHTML}
            <span class="mensaje-tiempo">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
    
    chatMessages.appendChild(mensajeElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    input.value = '';
    if (archivosInput) archivosInput.value = '';
    
    // Limpiar preview
    const preview = document.getElementById('previewChatArchivos');
    if (preview) preview.style.display = 'none';
    
    // Actualizar la lista de chats
    cargarListaChats();
}

function formatearTiempo(timestamp) {
    const ahora = Date.now();
    const diferencia = ahora - timestamp;
    
    if (diferencia < 60000) return 'Ahora';
    if (diferencia < 3600000) return `${Math.floor(diferencia / 60000)}m`;
    if (diferencia < 86400000) return `${Math.floor(diferencia / 3600000)}h`;
    return `${Math.floor(diferencia / 86400000)}d`;
}

// ===== FUNCIONES DE UTILIDAD =====
function iniciarBackupAutomaticoCarla() {
    carlaBackupTimer = setInterval(() => {
        console.log('💾 Backup automático ejecutado');
    }, CRISLA_CONFIG.backupInterval);
}

function iniciarSimulacionesDesarrollo() {
    console.log('🎭 Simulaciones de desarrollo activadas');
}

function detenerSimulacionesDesarrollo() {
    console.log('🎭 Simulaciones de desarrollo detenidas');
}

function actualizarInterfazModoDesarrollo() {
    console.log('🎨 Interfaz de modo desarrollo actualizada');
}

function cargarHistorialCarla() {
    console.log('📚 Cargando historial...');
}

function cargarReportesCarla() {
    console.log('📊 Cargando reportes...');
}

function cargarConfiguracionCarla() {
    console.log('⚙️ Cargando configuración...');
}

function cargarLogsUsuariosCarla() {
    console.log('📋 Cargando logs de usuarios...');
}

function simularNuevoTicket() {
    const tickets = JSON.parse(localStorage.getItem('cresalia_tickets') || '[]');
    
    // Crear un ticket de ejemplo
    const nuevoTicket = {
        id: 'TKT-' + (Date.now().toString().slice(-4)),
        tipoUsuario: Math.random() > 0.5 ? 'Cliente' : 'Usuario',
        tipoProblema: ['configuracion', 'pago', 'producto', 'tecnico'][Math.floor(Math.random() * 4)],
        prioridad: ['Baja', 'Media', 'Alta'][Math.floor(Math.random() * 3)],
        nombre: ['Ana García', 'Carlos López', 'María Rodríguez', 'Juan Pérez'][Math.floor(Math.random() * 4)],
        email: 'usuario@email.com',
        descripcion: 'Este es un ticket de prueba generado automáticamente',
        tienda: 'Tienda de Prueba',
        estado: 'Abierto',
        fecha: new Date().toLocaleString(),
        timestamp: Date.now()
    };
    
    tickets.push(nuevoTicket);
    localStorage.setItem('cresalia_tickets', JSON.stringify(tickets));
    
    // Actualizar dashboard
    cargarDashboardCarla();
    
    mostrarNotificacionCarla('🎫 Nuevo ticket simulado creado', 'success');
}

// ===== FUNCIONES DE ARCHIVOS =====
function configurarPreviewArchivos(inputId, previewId, listaId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const lista = document.getElementById(listaId);
    
    if (input && preview && lista) {
        input.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                if (inputId === 'archivosRespuesta') {
                    // Preview detallado para tickets
                    lista.innerHTML = Array.from(this.files).map(file => `
                        <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: var(--carla-light); border-radius: 8px; margin-bottom: 5px; border: 1px solid var(--carla-accent);">
                            <i class="fas fa-file" style="color: var(--carla-primary);"></i>
                            <span style="flex: 1; font-size: 12px;">${file.name}</span>
                            <span style="font-size: 11px; color: var(--carla-gray);">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    `).join('');
                } else {
                    // Preview simple para chat
                    lista.textContent = Array.from(this.files).map(f => f.name).join(', ');
                }
                preview.style.display = 'block';
            } else {
                preview.style.display = 'none';
            }
        });
    }
}

function mostrarNotificacionCarla(mensaje, tipo = 'info') {
    // Sistema de notificaciones simple
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    switch(tipo) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #10B981, #34D399)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #EF4444, #F87171)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #F59E0B, #FBBF24)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #7C3AED, #EC4899)';
    }
    
    notification.textContent = mensaje;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
