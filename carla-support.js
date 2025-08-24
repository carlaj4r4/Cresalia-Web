// ===== SISTEMA DE CARLA - VERSIÓN 1.8 - MODO DESARROLLO =====
// ===== CONFIGURACIÓN EXCLUSIVA DE CARLA =====
const CARLA_CONFIG = {
    password: 'carla2024',
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
    console.log('🎯 Sistema de Carla iniciando...');
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
}

function manejarLoginCarla(event) {
    event.preventDefault();
    const password = document.getElementById('carlaPassword').value;
    
    if (password === CARLA_CONFIG.password) {
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
    const modoDesarrolloGuardado = localStorage.getItem('carlaModoDesarrollo');
    if (modoDesarrolloGuardado !== null) {
        CARLA_CONFIG.modoDesarrollo = modoDesarrolloGuardado === 'true';
    }
    
    // Iniciar timer de sesión
    iniciarTimerSesionCarla();
    
    // Iniciar sistema de backup automático
    iniciarBackupAutomaticoCarla();
    
    // Iniciar simulaciones si está en modo desarrollo
    if (CARLA_CONFIG.modoDesarrollo) {
        iniciarSimulacionesDesarrollo();
    }
    
    // Actualizar interfaz del modo desarrollo
    actualizarInterfazModoDesarrollo();
    
    // Cargar dashboard
    cargarDashboardCarla();
    
    mostrarNotificacionCarla('👑 ¡Bienvenida Carla!', 'success');
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
    }, CARLA_CONFIG.sessionTimeout);
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
        case 'tickets':
            cargarTicketsCarla();
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
    }
}

// ===== DASHBOARD =====
function cargarDashboardCarla() {
    const ticketsHoy = calcularTicketsHoy();
    const tiempoPromedio = calcularTiempoPromedio();
    
    document.getElementById('ticketsHoy').textContent = ticketsHoy;
    document.getElementById('tiempoPromedio').textContent = tiempoPromedio + ' min';
    
    // Simular estadísticas en tiempo real
    setInterval(() => {
        actualizarEstadisticasDashboard();
    }, 5000);
}

function calcularTicketsHoy() {
    const tickets = obtenerTickets();
    const hoy = new Date().toDateString();
    return tickets.filter(ticket => 
        new Date(ticket.fecha).toDateString() === hoy
    ).length;
}

function calcularTiempoPromedio() {
    const tickets = obtenerTickets();
    if (tickets.length === 0) return 0;
    
    const tiempos = tickets.map(ticket => {
        if (ticket.tiempoResolucion) {
            return ticket.tiempoResolucion;
        }
        return 15; // Tiempo promedio por defecto
    });
    
    return Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length);
}

function actualizarEstadisticasDashboard() {
    const ticketsHoy = calcularTicketsHoy();
    const tiempoPromedio = calcularTiempoPromedio();
    
    document.getElementById('ticketsHoy').textContent = ticketsHoy;
    document.getElementById('tiempoPromedio').textContent = tiempoPromedio + ' min';
}

// ===== GESTIÓN DE TICKETS =====
function cargarTicketsCarla() {
    const tickets = obtenerTickets();
    const container = document.getElementById('ticketsContainer');
    
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
    
    container.innerHTML = tickets.map(ticket => `
        <div class="ticket-card ${ticket.estado}" data-id="${ticket.id}">
            <div class="ticket-header">
                <span class="ticket-id">#${ticket.id}</span>
                <span class="ticket-estado ${ticket.estado}">${ticket.estado}</span>
                <span class="ticket-fecha">${new Date(ticket.fecha).toLocaleDateString()}</span>
            </div>
            <div class="ticket-content">
                <h4>${ticket.titulo}</h4>
                <p>${ticket.descripcion}</p>
                <div class="ticket-info">
                    <span><i class="fas fa-user"></i> ${ticket.cliente}</span>
                    <span><i class="fas fa-envelope"></i> ${ticket.email}</span>
                    <span><i class="fas fa-phone"></i> ${ticket.telefono}</span>
                </div>
            </div>
            <div class="ticket-actions">
                <button onclick="abrirTicketCarla('${ticket.id}')" class="btn-ver">
                    <i class="fas fa-eye"></i> Ver
                </button>
                <button onclick="cambiarEstadoTicketCarla('${ticket.id}')" class="btn-estado">
                    <i class="fas fa-check"></i> Atender
                </button>
            </div>
        </div>
    `).join('');
}

function abrirTicketCarla(ticketId) {
    const tickets = obtenerTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    // Crear modal para ver ticket
    const modal = document.createElement('div');
    modal.className = 'modal-ticket';
    modal.innerHTML = `
        <div class="modal-ticket-content">
            <div class="modal-ticket-header">
                <h3>Ticket #${ticket.id}</h3>
                <button onclick="cerrarModalTicketCarla()" class="cerrar-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-ticket-body">
                <div class="ticket-detalles">
                    <h4>${ticket.titulo}</h4>
                    <p>${ticket.descripcion}</p>
                    <div class="ticket-meta">
                        <span><strong>Cliente:</strong> ${ticket.cliente}</span>
                        <span><strong>Email:</strong> ${ticket.email}</span>
                        <span><strong>Teléfono:</strong> ${ticket.telefono}</span>
                        <span><strong>Fecha:</strong> ${new Date(ticket.fecha).toLocaleString()}</span>
                        <span><strong>Estado:</strong> ${ticket.estado}</span>
                    </div>
                </div>
                <div class="ticket-respuesta">
                    <h4>Responder al Cliente</h4>
                    <textarea id="respuestaTicket" placeholder="Escribe tu respuesta..."></textarea>
                    <button onclick="enviarRespuestaCarla('${ticket.id}')" class="btn-enviar">
                        <i class="fas fa-paper-plane"></i> Enviar Respuesta
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function cerrarModalTicketCarla() {
    const modal = document.querySelector('.modal-ticket');
    if (modal) {
        modal.remove();
    }
}

function enviarRespuestaCarla(ticketId) {
    const respuesta = document.getElementById('respuestaTicket').value;
    if (!respuesta.trim()) {
        mostrarNotificacionCarla('❌ Escribe una respuesta', 'error');
        return;
    }
    
    // Agregar respuesta al ticket
    agregarRespuestaTicket(ticketId, respuesta);
    
    // Cerrar modal y actualizar
    cerrarModalTicketCarla();
    cargarTicketsCarla();
    
    mostrarNotificacionCarla('✅ Respuesta enviada', 'success');
}

function cambiarEstadoTicketCarla(ticketId) {
    actualizarEstadoTicket(ticketId, 'atendido');
    cargarTicketsCarla();
    mostrarNotificacionCarla('✅ Ticket marcado como atendido', 'success');
}

// ===== CHAT EN VIVO =====
function cargarChatCarla() {
    const container = document.getElementById('chatContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="chat-live">
            <div class="chat-header">
                <h3><i class="fas fa-comments"></i> Chat en Vivo</h3>
                <span class="online-indicator">● En línea</span>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="welcome-message">
                    <i class="fas fa-crown"></i>
                    <h4>¡Hola Carla!</h4>
                    <p>Aquí puedes ver los chats en vivo de los clientes</p>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="Escribe tu mensaje...">
                <button onclick="enviarMensajeChat()" class="btn-enviar-chat">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    // Las simulaciones se manejan automáticamente en modo desarrollo
    console.log('💬 Chat de Carla cargado');
}

function enviarMensajeChat() {
    const input = document.getElementById('chatInput');
    const mensaje = input.value.trim();
    
    if (!mensaje) return;
    
    const chatMessages = document.getElementById('chatMessages');
    const mensajeElement = document.createElement('div');
    mensajeElement.className = 'mensaje-carla';
    mensajeElement.innerHTML = `
        <div class="mensaje-contenido">
            <span class="mensaje-texto">${mensaje}</span>
            <span class="mensaje-tiempo">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
    
    chatMessages.appendChild(mensajeElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    input.value = '';
}

function simularMensajesEnVivo() {
    // Función desactivada para producción
    console.log('🎯 Simulación de mensajes en vivo desactivada para producción');
    return;
    
    // Código original comentado:
    /*
    const mensajes = [
        "Hola, necesito ayuda con mi pedido",
        "¿Cuánto tiempo tarda la entrega?",
        "Tengo un problema con mi factura",
        "¿Pueden ayudarme con el servicio técnico?"
    ];
    
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% de probabilidad
            const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
            const chatMessages = document.getElementById('chatMessages');
            
            const mensajeElement = document.createElement('div');
            mensajeElement.className = 'mensaje-cliente';
            mensajeElement.innerHTML = `
                <div class="mensaje-contenido">
                    <span class="mensaje-texto">${mensaje}</span>
                    <span class="mensaje-tiempo">${new Date().toLocaleTimeString()}</span>
                </div>
            `;
            
            chatMessages.appendChild(mensajeElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            mostrarNotificacionCarla('💬 Nuevo mensaje en chat', 'info');
        }
    }, 10000); // Cada 10 segundos
    */
}

// ===== HISTORIAL =====
function cargarHistorialCarla() {
    const container = document.getElementById('historialContainer');
    if (!container) return;
    
    const tickets = obtenerTickets();
    const ticketsAtendidos = tickets.filter(t => t.estado === 'atendido');
    
    container.innerHTML = `
        <div class="historial-stats">
            <div class="stat-card">
                <h3>Total de Tickets</h3>
                <span class="stat-number">${tickets.length}</span>
            </div>
            <div class="stat-card">
                <h3>Atendidos</h3>
                <span class="stat-number">${ticketsAtendidos.length}</span>
            </div>
            <div class="stat-card">
                <h3>Pendientes</h3>
                <span class="stat-number">${tickets.length - ticketsAtendidos.length}</span>
            </div>
        </div>
        <div class="historial-list">
            ${ticketsAtendidos.map(ticket => `
                <div class="historial-item">
                    <div class="historial-header">
                        <span class="ticket-id">#${ticket.id}</span>
                        <span class="ticket-fecha">${new Date(ticket.fecha).toLocaleDateString()}</span>
                    </div>
                    <div class="historial-content">
                        <h4>${ticket.titulo}</h4>
                        <p>${ticket.descripcion}</p>
                        <span class="cliente">Cliente: ${ticket.cliente}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ===== CONFIGURACIÓN =====
function cargarConfiguracionCarla() {
    // La configuración ya está en el HTML
    console.log('Configuración de Carla cargada');
}

// ===== FUNCIONES DE UTILIDAD =====
function toggleCarlaPassword() {
    const passwordInput = document.getElementById('carlaPassword');
    const toggleIcon = document.getElementById('toggleCarlaPassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

function mostrarNotificacionCarla(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion-carla notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <span>${mensaje}</span>
        </div>
    `;
    
    // Estilos para notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#10B981' : tipo === 'error' ? '#EF4444' : tipo === 'warning' ? '#F59E0B' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 3000);
}

// ===== FUNCIONES DE INTEGRACIÓN CON LA PÁGINA PRINCIPAL =====
// Estas funciones deben estar disponibles globalmente para que la página principal las use

// Función para crear tickets desde el chat de soporte
function crearTicketDesdeChat(datos) {
    const ticket = {
        id: Date.now().toString(),
        titulo: datos.titulo || 'Consulta desde chat',
        descripcion: datos.mensaje,
        cliente: datos.nombre || 'Cliente',
        email: datos.email || 'cliente@email.com',
        telefono: datos.telefono || 'Sin teléfono',
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        tipo: 'chat',
        respuestas: []
    };
    
    guardarTicket(ticket);
    mostrarNotificacionCarla('🎫 Nuevo ticket creado desde chat', 'info');
}

// Función para guardar tickets
function guardarTicket(ticket) {
    let tickets = JSON.parse(localStorage.getItem('ticketsCarla') || '[]');
    tickets.push(ticket);
    localStorage.setItem('ticketsCarla', JSON.stringify(tickets));
    
    // También guardar en tickets de soporte general
    let ticketsSoporte = JSON.parse(localStorage.getItem('ticketsSoporte') || '[]');
    ticketsSoporte.push(ticket);
    localStorage.setItem('ticketsSoporte', JSON.stringify(ticketsSoporte));
}

// Función para obtener tickets
function obtenerTickets() {
    return JSON.parse(localStorage.getItem('ticketsCarla') || '[]');
}

// Función para actualizar estado de ticket
function actualizarEstadoTicket(ticketId, nuevoEstado) {
    let tickets = obtenerTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex !== -1) {
        tickets[ticketIndex].estado = nuevoEstado;
        tickets[ticketIndex].fechaActualizacion = new Date().toISOString();
        localStorage.setItem('ticketsCarla', JSON.stringify(tickets));
    }
}

// Función para agregar respuesta a ticket
function agregarRespuestaTicket(ticketId, respuesta) {
    let tickets = obtenerTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex !== -1) {
        if (!tickets[ticketIndex].respuestas) {
            tickets[ticketIndex].respuestas = [];
        }
        
        tickets[ticketIndex].respuestas.push({
            texto: respuesta,
            fecha: new Date().toISOString(),
            autor: 'Carla'
        });
        
        localStorage.setItem('ticketsCarla', JSON.stringify(tickets));
    }
}

// Función para obtener estadísticas de tickets
function obtenerEstadisticasTickets() {
    const tickets = obtenerTickets();
    const hoy = new Date().toDateString();
    
    return {
        total: tickets.length,
        pendientes: tickets.filter(t => t.estado === 'pendiente').length,
        atendidos: tickets.filter(t => t.estado === 'atendido').length,
        hoy: tickets.filter(t => new Date(t.fecha).toDateString() === hoy).length
    };
}

// ===== SISTEMA DE REPORTES =====
function cargarReportesCarla() {
    console.log('📊 Cargando reportes...');
    generarReporte();
}

function generarReporte() {
    const periodo = document.getElementById('filtroFecha').value;
    const tipo = document.getElementById('filtroTipo').value;
    
    console.log(`📊 Generando reporte: ${tipo} - ${periodo}`);
    
    // Generar reporte según el tipo
    switch(tipo) {
        case 'tickets':
            generarReporteTickets(periodo);
            break;
        case 'satisfaccion':
            generarReporteSatisfaccion(periodo);
            break;
        case 'tiempo':
            generarReporteTiempo(periodo);
            break;
        case 'categorias':
            generarReporteCategorias(periodo);
            break;
    }
}

function generarReporteTickets(periodo) {
    const tickets = obtenerTickets();
    const ticketsFiltrados = filtrarTicketsPorPeriodo(tickets, periodo);
    
    // Resumen general
    const resumen = {
        total: ticketsFiltrados.length,
        pendientes: ticketsFiltrados.filter(t => t.estado === 'pendiente').length,
        atendidos: ticketsFiltrados.filter(t => t.estado === 'atendido').length,
        urgentes: ticketsFiltrados.filter(t => t.prioridad === 'urgente').length,
        promedioTiempo: calcularTiempoPromedioResolucion(ticketsFiltrados)
    };
    
    document.getElementById('reporteResumen').innerHTML = `
        <div class="reporte-stat">
            <span class="stat-numero">${resumen.total}</span>
            <span class="stat-label">Total Tickets</span>
        </div>
        <div class="reporte-stat">
            <span class="stat-numero">${resumen.pendientes}</span>
            <span class="stat-label">Pendientes</span>
        </div>
        <div class="reporte-stat">
            <span class="stat-numero">${resumen.atendidos}</span>
            <span class="stat-label">Atendidos</span>
        </div>
        <div class="reporte-stat">
            <span class="stat-numero">${resumen.urgentes}</span>
            <span class="stat-label">Urgentes</span>
        </div>
        <div class="reporte-stat">
            <span class="stat-numero">${resumen.promedioTiempo}</span>
            <span class="stat-label">Min Promedio</span>
        </div>
    `;
    
    // Gráfico de tickets por día
    const ticketsPorDia = agruparTicketsPorDia(ticketsFiltrados);
    document.getElementById('reporteGraficoTickets').innerHTML = `
        <div class="grafico-barras">
            ${Object.entries(ticketsPorDia).map(([fecha, cantidad]) => `
                <div class="barra">
                    <div class="barra-valor" style="height: ${(cantidad / Math.max(...Object.values(ticketsPorDia))) * 100}%"></div>
                    <span class="barra-label">${fecha}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Métricas de rendimiento
    document.getElementById('reporteMetricas').innerHTML = `
        <div class="metrica">
            <div class="metrica-icono">⚡</div>
            <div class="metrica-info">
                <span class="metrica-valor">${resumen.promedioTiempo} min</span>
                <span class="metrica-label">Tiempo Promedio</span>
            </div>
        </div>
        <div class="metrica">
            <div class="metrica-icono">📈</div>
            <div class="metrica-info">
                <span class="metrica-valor">${Math.round((resumen.atendidos / resumen.total) * 100)}%</span>
                <span class="metrica-label">Tasa de Resolución</span>
            </div>
        </div>
        <div class="metrica">
            <div class="metrica-icono">🎯</div>
            <div class="metrica-info">
                <span class="metrica-valor">${resumen.urgentes}</span>
                <span class="metrica-label">Tickets Urgentes</span>
            </div>
        </div>
    `;
    
    // Top clientes
    const topClientes = obtenerTopClientes(ticketsFiltrados);
    document.getElementById('reporteClientes').innerHTML = `
        <div class="top-clientes">
            ${topClientes.map((cliente, index) => `
                <div class="cliente-item">
                    <span class="cliente-posicion">#${index + 1}</span>
                    <span class="cliente-nombre">${cliente.nombre}</span>
                    <span class="cliente-tickets">${cliente.tickets} tickets</span>
                </div>
            `).join('')}
        </div>
    `;
}

function filtrarTicketsPorPeriodo(tickets, periodo) {
    const ahora = new Date();
    const inicio = new Date();
    
    switch(periodo) {
        case 'hoy':
            inicio.setHours(0, 0, 0, 0);
            break;
        case 'semana':
            inicio.setDate(inicio.getDate() - 7);
            break;
        case 'mes':
            inicio.setMonth(inicio.getMonth() - 1);
            break;
        case 'trimestre':
            inicio.setMonth(inicio.getMonth() - 3);
            break;
        case 'año':
            inicio.setFullYear(inicio.getFullYear() - 1);
            break;
    }
    
    return tickets.filter(ticket => {
        const fechaTicket = new Date(ticket.fecha);
        return fechaTicket >= inicio && fechaTicket <= ahora;
    });
}

function agruparTicketsPorDia(tickets) {
    const agrupados = {};
    
    tickets.forEach(ticket => {
        const fecha = new Date(ticket.fecha).toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric' 
        });
        agrupados[fecha] = (agrupados[fecha] || 0) + 1;
    });
    
    return agrupados;
}

function calcularTiempoPromedioResolucion(tickets) {
    const ticketsResueltos = tickets.filter(t => t.estado === 'atendido' && t.tiempoResolucion);
    
    if (ticketsResueltos.length === 0) return 0;
    
    const tiempoTotal = ticketsResueltos.reduce((total, ticket) => total + ticket.tiempoResolucion, 0);
    return Math.round(tiempoTotal / ticketsResueltos.length);
}

function obtenerTopClientes(tickets) {
    const clientes = {};
    
    tickets.forEach(ticket => {
        const nombre = ticket.cliente;
        clientes[nombre] = (clientes[nombre] || 0) + 1;
    });
    
    return Object.entries(clientes)
        .map(([nombre, tickets]) => ({ nombre, tickets }))
        .sort((a, b) => b.tickets - a.tickets)
        .slice(0, 5);
}

function generarReporteSatisfaccion(periodo) {
    // Implementar reporte de satisfacción
    document.getElementById('reporteResumen').innerHTML = '<p>Reporte de satisfacción en desarrollo...</p>';
}

function generarReporteTiempo(periodo) {
    // Implementar reporte de tiempo de respuesta
    document.getElementById('reporteResumen').innerHTML = '<p>Reporte de tiempo en desarrollo...</p>';
}

function generarReporteCategorias(periodo) {
    // Implementar reporte por categorías
    document.getElementById('reporteResumen').innerHTML = '<p>Reporte por categorías en desarrollo...</p>';
}

function exportarReporte() {
    const periodo = document.getElementById('filtroFecha').value;
    const tipo = document.getElementById('filtroTipo').value;
    
    // Crear contenido del PDF
    const contenido = `
        <h1>Reporte de Atención al Cliente - FRIOCAS</h1>
        <p><strong>Período:</strong> ${periodo}</p>
        <p><strong>Tipo:</strong> ${tipo}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
        <hr>
        <div id="contenidoReporte">
            ${document.getElementById('reporteResumen').innerHTML}
        </div>
    `;
    
    // Simular descarga de PDF
    const blob = new Blob([contenido], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${tipo}-${periodo}-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    
    mostrarNotificacionCarla('📄 Reporte exportado correctamente', 'success');
}

// ===== CONFIGURACIÓN DE EVENTOS DE NAVEGACIÓN =====
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('carla-nav-btn')) {
        const seccion = event.target.getAttribute('data-section');
        mostrarSeccionCarla(seccion);
    }
});

// Función para mostrar sección (alias para compatibilidad)
function mostrarSeccion(seccion) {
    mostrarSeccionCarla(seccion);
}

// Función para mostrar formulario de ticket
function mostrarFormularioTicket() {
    // Crear modal para nuevo ticket
    const modal = document.createElement('div');
    modal.className = 'modal-ticket';
    modal.innerHTML = `
        <div class="modal-ticket-content">
            <div class="modal-ticket-header">
                <h3>Nuevo Ticket</h3>
                <button onclick="cerrarModalTicketCarla()" class="cerrar-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-ticket-body">
                <form id="formNuevoTicket">
                    <div class="form-group">
                        <label for="ticketTitulo">Título del Ticket</label>
                        <input type="text" id="ticketTitulo" required>
                    </div>
                    <div class="form-group">
                        <label for="ticketCliente">Cliente</label>
                        <input type="text" id="ticketCliente" required>
                    </div>
                    <div class="form-group">
                        <label for="ticketEmail">Email</label>
                        <input type="email" id="ticketEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="ticketTelefono">Teléfono</label>
                        <input type="tel" id="ticketTelefono" required>
                    </div>
                    <div class="form-group">
                        <label for="ticketDescripcion">Descripción</label>
                        <textarea id="ticketDescripcion" rows="4" required></textarea>
                    </div>
                    <button type="submit" class="btn-enviar">
                        <i class="fas fa-paper-plane"></i> Crear Ticket
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar evento del formulario
    document.getElementById('formNuevoTicket').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const ticket = {
            id: Date.now().toString(),
            titulo: document.getElementById('ticketTitulo').value,
            descripcion: document.getElementById('ticketDescripcion').value,
            cliente: document.getElementById('ticketCliente').value,
            email: document.getElementById('ticketEmail').value,
            telefono: document.getElementById('ticketTelefono').value,
            fecha: new Date().toISOString(),
            estado: 'pendiente',
            respuestas: []
        };
        
        guardarTicket(ticket);
        cerrarModalTicketCarla();
        cargarTicketsCarla();
        mostrarNotificacionCarla('✅ Ticket creado exitosamente', 'success');
    });
}

// ===== SISTEMA DE SIMULACIONES EN MODO DESARROLLO =====
let simulacionTicketsInterval;
let simulacionChatInterval;

function simularNuevoTicket() {
    if (!CARLA_CONFIG.modoDesarrollo) {
        console.log('🎯 Simulación de tickets desactivada (modo producción)');
        return;
    }
    
    const clientes = ['María González', 'Juan Pérez', 'Ana López', 'Carlos Rodríguez', 'Laura Martínez'];
    const problemas = [
        'Problema con la facturación',
        'Consulta sobre servicios',
        'Problema técnico',
        'Solicitud de información',
        'Reclamo por entrega'
    ];
    
    const ticket = {
        id: Date.now().toString(),
        titulo: problemas[Math.floor(Math.random() * problemas.length)],
        descripcion: 'Ticket generado automáticamente en modo desarrollo',
        cliente: clientes[Math.floor(Math.random() * clientes.length)],
        email: 'cliente@ejemplo.com',
        telefono: '+54 9 11 1234-5678',
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        respuestas: []
    };
    
    guardarTicket(ticket);
    mostrarNotificacionCarla('🎫 Nuevo ticket simulado creado', 'info');
    
    // Actualizar dashboard si está visible
    if (document.getElementById('dashboardContainer').style.display !== 'none') {
        cargarDashboardCarla();
    }
    
    // Actualizar tickets si está visible
    if (document.getElementById('ticketsContainer').style.display !== 'none') {
        cargarTicketsCarla();
    }
}

function simularMensajesEnVivo() {
    if (!CARLA_CONFIG.modoDesarrollo) {
        console.log('🎯 Simulación de chat desactivada (modo producción)');
        return;
    }
    
    const mensajes = [
        "Hola, necesito ayuda con mi pedido #12345",
        "¿Cuánto tiempo tarda la entrega a domicilio?",
        "Tengo un problema con mi factura del mes pasado",
        "¿Pueden ayudarme con el servicio técnico de mi equipo?",
        "Quisiera consultar sobre los horarios de atención",
        "¿Tienen stock del producto X?",
        "Necesito información sobre garantías",
        "¿Cómo puedo hacer un cambio de producto?"
    ];
    
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
    const mensajeElement = document.createElement('div');
    mensajeElement.className = 'mensaje-cliente';
    mensajeElement.innerHTML = `
        <div class="mensaje-contenido">
            <span class="mensaje-texto">${mensaje}</span>
            <span class="mensaje-tiempo">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
    
    chatMessages.appendChild(mensajeElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    mostrarNotificacionCarla('💬 Nuevo mensaje simulado en chat', 'info');
}

function iniciarSimulacionesDesarrollo() {
    if (!CARLA_CONFIG.modoDesarrollo) {
        console.log('🎯 Modo desarrollo desactivado - simulaciones no iniciadas');
        return;
    }
    
    console.log('🚀 Iniciando simulaciones en modo desarrollo...');
    
    // Simulación de tickets cada 30 segundos
    simulacionTicketsInterval = setInterval(() => {
        if (carlaLoggedIn && Math.random() > 0.7) { // 30% de probabilidad
            simularNuevoTicket();
        }
    }, 30000);
    
    // Simulación de chat cada 15 segundos
    simulacionChatInterval = setInterval(() => {
        if (carlaLoggedIn && Math.random() > 0.6) { // 40% de probabilidad
            simularMensajesEnVivo();
        }
    }, 15000);
    
    mostrarNotificacionCarla('🚀 Simulaciones de desarrollo iniciadas', 'success');
}

function detenerSimulacionesDesarrollo() {
    if (simulacionTicketsInterval) {
        clearInterval(simulacionTicketsInterval);
        simulacionTicketsInterval = null;
    }
    
    if (simulacionChatInterval) {
        clearInterval(simulacionChatInterval);
        simulacionChatInterval = null;
    }
    
    console.log('🛑 Simulaciones de desarrollo detenidas');
}

function actualizarInterfazModoDesarrollo() {
    const btnDesarrollo = document.getElementById('btnModoDesarrollo');
    const infoDesarrollo = document.getElementById('infoModoDesarrollo');
    
    if (!btnDesarrollo || !infoDesarrollo) return;
    
    if (CARLA_CONFIG.modoDesarrollo) {
        // Modo desarrollo activo
        btnDesarrollo.classList.add('activo');
        btnDesarrollo.innerHTML = '<i class="fas fa-stop"></i> <span id="textoModoDesarrollo">Desactivar Modo Desarrollo</span>';
        infoDesarrollo.textContent = 'Simulaciones activas - Tickets y chat en vivo se generarán automáticamente';
        infoDesarrollo.classList.add('activo');
    } else {
        // Modo desarrollo inactivo
        btnDesarrollo.classList.remove('activo');
        btnDesarrollo.innerHTML = '<i class="fas fa-code"></i> <span id="textoModoDesarrollo">Activar Modo Desarrollo</span>';
        infoDesarrollo.textContent = 'Las simulaciones están desactivadas para producción';
        infoDesarrollo.classList.remove('activo');
    }
}

function toggleModoDesarrollo() {
    CARLA_CONFIG.modoDesarrollo = !CARLA_CONFIG.modoDesarrollo;
    
    if (CARLA_CONFIG.modoDesarrollo) {
        iniciarSimulacionesDesarrollo();
        mostrarNotificacionCarla('🚀 Modo desarrollo ACTIVADO', 'success');
    } else {
        detenerSimulacionesDesarrollo();
        mostrarNotificacionCarla('🛑 Modo desarrollo DESACTIVADO', 'info');
    }
    
    // Actualizar interfaz visual
    actualizarInterfazModoDesarrollo();
    
    // Guardar configuración
    localStorage.setItem('carlaModoDesarrollo', CARLA_CONFIG.modoDesarrollo);
}

console.log('🎯 Sistema de Carla cargado completamente');

// ===== SISTEMA DE BACKUP AUTOMÁTICO =====
function iniciarBackupAutomaticoCarla() {
    console.log('💾 Iniciando sistema de backup automático para Carla...');
    
    // Realizar backup inicial
    realizarBackupCarla();
    
    // Configurar backup automático cada 5 minutos
    carlaBackupTimer = setInterval(() => {
        if (carlaLoggedIn) {
            realizarBackupCarla();
        }
    }, CARLA_CONFIG.backupInterval);
    
    console.log('✅ Sistema de backup automático iniciado');
}

function realizarBackupCarla() {
    try {
        const timestamp = new Date().toISOString();
        const backupData = {
            timestamp: timestamp,
            tickets: obtenerTickets(),
            configuracion: {
                notificaciones: document.getElementById('notificacionesCarla')?.checked || true,
                tema: 'carla-exclusivo',
                ultimaActividad: timestamp
            },
            estadisticas: {
                totalTickets: obtenerTickets().length,
                ticketsPendientes: obtenerTickets().filter(t => t.estado === 'pendiente').length,
                ticketsAtendidos: obtenerTickets().filter(t => t.estado === 'atendido').length
            }
        };
        
        // Obtener backups existentes
        let backups = JSON.parse(localStorage.getItem('carlaBackups') || '[]');
        
        // Agregar nuevo backup
        backups.push(backupData);
        
        // Mantener solo los últimos X backups
        if (backups.length > CARLA_CONFIG.maxBackups) {
            backups = backups.slice(-CARLA_CONFIG.maxBackups);
        }
        
        // Guardar backups
        localStorage.setItem('carlaBackups', JSON.stringify(backups));
        
        console.log(`💾 Backup automático realizado: ${timestamp}`);
        
        // Notificación silenciosa (solo en consola)
        if (carlaLoggedIn) {
            mostrarNotificacionCarla('💾 Backup automático completado', 'info');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error en backup automático:', error);
        return false;
    }
}

function restaurarBackupCarla(backupIndex) {
    try {
        const backups = JSON.parse(localStorage.getItem('carlaBackups') || '[]');
        const backup = backups[backupIndex];
        
        if (!backup) {
            mostrarNotificacionCarla('❌ Backup no encontrado', 'error');
            return false;
        }
        
        // Restaurar tickets
        localStorage.setItem('ticketsCarla', JSON.stringify(backup.tickets));
        
        // Restaurar configuración
        if (backup.configuracion) {
            const notificacionesCheckbox = document.getElementById('notificacionesCarla');
            if (notificacionesCheckbox) {
                notificacionesCheckbox.checked = backup.configuracion.notificaciones;
            }
        }
        
        // Recargar datos
        cargarDashboardCarla();
        cargarTicketsCarla();
        
        mostrarNotificacionCarla(`✅ Backup restaurado del ${new Date(backup.timestamp).toLocaleString()}`, 'success');
        
        return true;
    } catch (error) {
        console.error('❌ Error restaurando backup:', error);
        mostrarNotificacionCarla('❌ Error al restaurar backup', 'error');
        return false;
    }
}

function obtenerBackupsCarla() {
    return JSON.parse(localStorage.getItem('carlaBackups') || '[]');
}

function eliminarBackupCarla(backupIndex) {
    try {
        let backups = JSON.parse(localStorage.getItem('carlaBackups') || '[]');
        backups.splice(backupIndex, 1);
        localStorage.setItem('carlaBackups', JSON.stringify(backups));
        
        mostrarNotificacionCarla('✅ Backup eliminado', 'success');
        return true;
    } catch (error) {
        console.error('❌ Error eliminando backup:', error);
        mostrarNotificacionCarla('❌ Error al eliminar backup', 'error');
        return false;
    }
}

function mostrarBackupsCarla() {
    const backups = obtenerBackupsCarla();
    
    if (backups.length === 0) {
        mostrarNotificacionCarla('📭 No hay backups disponibles', 'info');
        return;
    }
    
    // Crear modal de backups
    const modal = document.createElement('div');
    modal.className = 'modal-backup';
    modal.innerHTML = `
        <div class="modal-backup-content">
            <div class="modal-backup-header">
                <h3>💾 Backups Disponibles</h3>
                <button onclick="cerrarModalBackupCarla()" class="cerrar-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-backup-body">
                <div class="backups-list">
                    ${backups.map((backup, index) => `
                        <div class="backup-item">
                            <div class="backup-info">
                                <span class="backup-fecha">${new Date(backup.timestamp).toLocaleString()}</span>
                                <span class="backup-stats">
                                    📊 ${backup.tickets.length} tickets | 
                                    ⏳ ${backup.tickets.filter(t => t.estado === 'pendiente').length} pendientes
                                </span>
                            </div>
                            <div class="backup-actions">
                                <button onclick="restaurarBackupCarla(${index})" class="btn-restaurar">
                                    <i class="fas fa-undo"></i> Restaurar
                                </button>
                                <button onclick="eliminarBackupCarla(${index})" class="btn-eliminar">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function cerrarModalBackupCarla() {
    const modal = document.querySelector('.modal-backup');
    if (modal) {
        modal.remove();
    }
}

// Función para backup manual
function realizarBackupManualCarla() {
    const resultado = realizarBackupCarla();
    if (resultado) {
        mostrarNotificacionCarla('💾 Backup manual completado exitosamente', 'success');
    } else {
        mostrarNotificacionCarla('❌ Error en backup manual', 'error');
    }
}

// ===== FUNCIONES DE INTEGRACIÓN CON LA PÁGINA PRINCIPAL =====
// Estas funciones deben estar disponibles globalmente para que la página principal las use

// Función para crear tickets desde el chat de soporte
function crearTicketDesdeChat(datos) {
    const ticket = {
        id: Date.now().toString(),
        titulo: datos.titulo || 'Consulta desde chat',
        descripcion: datos.mensaje,
        cliente: datos.nombre || 'Cliente',
        email: datos.email || 'cliente@email.com',
        telefono: datos.telefono || 'Sin teléfono',
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        tipo: 'chat',
        respuestas: []
    };
    
    guardarTicket(ticket);
    mostrarNotificacionCarla('🎫 Nuevo ticket creado desde chat', 'info');
}

// Función para guardar tickets
function guardarTicket(ticket) {
    let tickets = JSON.parse(localStorage.getItem('ticketsCarla') || '[]');
    tickets.push(ticket);
    localStorage.setItem('ticketsCarla', JSON.stringify(tickets));
    
    // También guardar en tickets de soporte general
    let ticketsSoporte = JSON.parse(localStorage.getItem('ticketsSoporte') || '[]');
    ticketsSoporte.push(ticket);
    localStorage.setItem('ticketsSoporte', JSON.stringify(ticketsSoporte));
}

// Función para obtener tickets
function obtenerTickets() {
    return JSON.parse(localStorage.getItem('ticketsCarla') || '[]');
}

// Función para actualizar estado de ticket
function actualizarEstadoTicket(ticketId, nuevoEstado) {
    let tickets = obtenerTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex !== -1) {
        tickets[ticketIndex].estado = nuevoEstado;
        tickets[ticketIndex].fechaActualizacion = new Date().toISOString();
        localStorage.setItem('ticketsCarla', JSON.stringify(tickets));
    }
}

// Función para agregar respuesta a ticket
function agregarRespuestaTicket(ticketId, respuesta) {
    let tickets = obtenerTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex !== -1) {
        if (!tickets[ticketIndex].respuestas) {
            tickets[ticketIndex].respuestas = [];
        }
        
        tickets[ticketIndex].respuestas.push({
            texto: respuesta,
            fecha: new Date().toISOString(),
            autor: 'Carla'
        });
        
        localStorage.setItem('ticketsCarla', JSON.stringify(tickets));
    }
}

// Función para obtener estadísticas de tickets
function obtenerEstadisticasTickets() {
    const tickets = obtenerTickets();
    const hoy = new Date().toDateString();
    
    return {
        total: tickets.length,
        pendientes: tickets.filter(t => t.estado === 'pendiente').length,
        atendidos: tickets.filter(t => t.estado === 'atendido').length,
        hoy: tickets.filter(t => new Date(t.fecha).toDateString() === hoy).length
    };
}
