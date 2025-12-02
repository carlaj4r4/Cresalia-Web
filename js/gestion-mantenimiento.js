// ===== GESTIÓN DE MANTENIMIENTO =====
// Sistema para activar/desactivar el mantenimiento desde el panel master

const MANTENIMIENTO_API = {
    estado: '/api/mantenimiento/estado',
    notificar: '/api/mantenimiento/notificar'
};

// ===== CARGAR ESTADO ACTUAL =====
async function cargarEstadoMantenimiento() {
    const contenedor = document.getElementById('estadoMantenimiento');
    const formulario = document.getElementById('formularioMantenimiento');
    
    if (!contenedor) return;
    
    contenedor.innerHTML = '<div class="loading"><div class="spinner"></div>Cargando estado...</div>';
    formulario.style.display = 'none';
    
    try {
        const response = await fetch(MANTENIMIENTO_API.estado);
        
        if (!response.ok) {
            throw new Error('Error al obtener el estado');
        }
        
        const data = await response.json();
        
        // Mostrar estado actual
        mostrarEstadoMantenimiento(data);
        
        // Mostrar formulario
        formulario.style.display = 'block';
        
        // Configurar controles
        document.getElementById('mantenimientoActivo').checked = data.activo || false;
        actualizarControlesEstado(data.activo);
        
        if (data.fechaFinEstimada) {
            // Convertir fecha a formato local para datetime-local
            const fecha = new Date(data.fechaFinEstimada);
            const fechaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            document.getElementById('fechaFinEstimada').value = fechaLocal;
        }
        
        if (data.mensaje) {
            document.getElementById('mensajeMantenimiento').value = data.mensaje;
        }
        
        // Agregar listener al checkbox
        document.getElementById('mantenimientoActivo').addEventListener('change', function() {
            actualizarControlesEstado(this.checked);
        });
        
    } catch (error) {
        console.error('Error cargando estado de mantenimiento:', error);
        contenedor.innerHTML = `
            <div style="background: #fee; padding: 20px; border-radius: 10px; border-left: 4px solid #f33;">
                <p style="color: #c33; margin: 0;">
                    <i class="fas fa-exclamation-circle"></i> Error al cargar el estado: ${error.message}
                </p>
            </div>
        `;
    }
}

// ===== MOSTRAR ESTADO =====
function mostrarEstadoMantenimiento(data) {
    const contenedor = document.getElementById('estadoMantenimiento');
    
    if (data.activo) {
        contenedor.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1)); padding: 25px; border-radius: 15px; border-left: 4px solid #ef4444;">
                <h3 style="margin: 0 0 15px 0; color: #dc2626;">
                    <i class="fas fa-exclamation-triangle"></i> Mantenimiento ACTIVO
                </h3>
                <p style="margin: 0 0 10px 0; color: #4b5563;">
                    <strong>Estado:</strong> Los usuarios están siendo redirigidos a la página de mantenimiento
                </p>
                ${data.fechaInicio ? `
                    <p style="margin: 0 0 10px 0; color: #4b5563;">
                        <strong>Iniciado:</strong> ${new Date(data.fechaInicio).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
                    </p>
                ` : ''}
                ${data.fechaFinEstimada ? `
                    <p style="margin: 0; color: #4b5563;">
                        <strong>Fin estimado:</strong> ${new Date(data.fechaFinEstimada).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
                    </p>
                ` : ''}
            </div>
        `;
    } else {
        contenedor.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1)); padding: 25px; border-radius: 15px; border-left: 4px solid #10b981;">
                <h3 style="margin: 0 0 15px 0; color: #059669;">
                    <i class="fas fa-check-circle"></i> Mantenimiento INACTIVO
                </h3>
                <p style="margin: 0; color: #4b5563;">
                    La plataforma está funcionando normalmente
                </p>
            </div>
        `;
    }
}

// ===== ACTUALIZAR CONTROLES =====
function actualizarControlesEstado(activo) {
    const estadoTexto = document.getElementById('estadoTexto');
    const btnActivar = document.getElementById('btnActivar');
    const btnDesactivar = document.getElementById('btnDesactivar');
    
    if (activo) {
        estadoTexto.textContent = 'Activo';
        estadoTexto.style.color = '#dc2626';
        btnActivar.style.display = 'none';
        btnDesactivar.style.display = 'inline-block';
    } else {
        estadoTexto.textContent = 'Inactivo';
        estadoTexto.style.color = '#059669';
        btnActivar.style.display = 'inline-block';
        btnDesactivar.style.display = 'none';
    }
}

// ===== ACTIVAR MANTENIMIENTO =====
async function activarMantenimiento() {
    const mensaje = document.getElementById('mensajeMantenimiento').value.trim();
    const fechaFinEstimada = document.getElementById('fechaFinEstimada').value;
    
    if (!confirm('¿Estás segura de que querés activar el mantenimiento? Se enviarán emails a todos los usuarios registrados.')) {
        return;
    }
    
    try {
        mostrarNotificacion('⏳ Activando mantenimiento y enviando notificaciones...', 'info');
        
        // Primero activar el mantenimiento
        const response = await fetch(MANTENIMIENTO_API.estado, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activo: true,
                mensaje: mensaje || null,
                fechaFinEstimada: fechaFinEstimada || null
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al activar el mantenimiento');
        }
        
        // Luego enviar notificaciones
        const notificarResponse = await fetch(MANTENIMIENTO_API.notificar, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activo: true,
                mensaje: mensaje || null,
                fechaFinEstimada: fechaFinEstimada || null
            })
        });
        
        if (!notificarResponse.ok) {
            console.warn('El mantenimiento se activó pero hubo problemas enviando notificaciones');
        }
        
        const notificarData = await notificarResponse.json();
        
        mostrarNotificacion(
            `✅ Mantenimiento activado. Notificaciones enviadas a ${notificarData.usuariosNotificados || 0} usuarios`,
            'success'
        );
        
        // Recargar estado
        setTimeout(() => {
            cargarEstadoMantenimiento();
        }, 1000);
        
    } catch (error) {
        console.error('Error activando mantenimiento:', error);
        mostrarNotificacion('❌ Error al activar el mantenimiento: ' + error.message, 'error');
    }
}

// ===== DESACTIVAR MANTENIMIENTO =====
async function desactivarMantenimiento() {
    if (!confirm('¿Estás segura de que querés desactivar el mantenimiento? Los usuarios podrán acceder nuevamente.')) {
        return;
    }
    
    try {
        mostrarNotificacion('⏳ Desactivando mantenimiento...', 'info');
        
        const response = await fetch(MANTENIMIENTO_API.estado, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                activo: false,
                mensaje: null,
                fechaFinEstimada: null
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al desactivar el mantenimiento');
        }
        
        mostrarNotificacion('✅ Mantenimiento desactivado. Los usuarios pueden acceder nuevamente.', 'success');
        
        // Recargar estado
        setTimeout(() => {
            cargarEstadoMantenimiento();
        }, 1000);
        
    } catch (error) {
        console.error('Error desactivando mantenimiento:', error);
        mostrarNotificacion('❌ Error al desactivar el mantenimiento: ' + error.message, 'error');
    }
}

// ===== GUARDAR CONFIGURACIÓN =====
async function guardarConfiguracionMantenimiento() {
    const activo = document.getElementById('mantenimientoActivo').checked;
    const mensaje = document.getElementById('mensajeMantenimiento').value.trim();
    const fechaFinEstimada = document.getElementById('fechaFinEstimada').value;
    
    if (activo) {
        await activarMantenimiento();
    } else {
        await desactivarMantenimiento();
    }
}

// Exportar funciones globalmente
window.cargarEstadoMantenimiento = cargarEstadoMantenimiento;
window.activarMantenimiento = activarMantenimiento;
window.desactivarMantenimiento = desactivarMantenimiento;
window.guardarConfiguracionMantenimiento = guardarConfiguracionMantenimiento;

console.log('✅ Sistema de gestión de mantenimiento cargado');



