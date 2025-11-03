// ===== SISTEMA DE MONITOREO POSTERIOR CRESALIA =====
// Version 1.0 - Para revisar cuentas DESPUÉS del registro
// Co-fundadores: CRISLA & Claude
// Filosofía: "Todos entran, monitoreamos después"

const MonitoreoPostRegistro = {
    
    // ===== PANEL DE MONITOREO PARA CRISLA =====
    crearPanelMonitoreo() {
        return `
            <div class="panel-monitoreo-crisla">
                <div class="header-monitoreo">
                    <h3><i class="fas fa-shield-alt"></i> Panel de Monitoreo CRISLA</h3>
                    <p>Cuentas registradas con alertas para revisar</p>
                </div>
                
                <div class="filtros-monitoreo">
                    <button class="filtro-activo" data-filtro="todas">Todas</button>
                    <button data-filtro="alta">Alta Prioridad</button>
                    <button data-filtro="media">Media Prioridad</button>
                    <button data-filtro="revisadas">Ya Revisadas</button>
                </div>
                
                <div class="lista-cuentas-monitoreo">
                    ${this.generarListaCuentas()}
                </div>
            </div>
        `;
    },
    
    // Generar lista de cuentas con alertas
    generarListaCuentas() {
        const cuentasConAlertas = this.obtenerCuentasConAlertas();
        
        if (cuentasConAlertas.length === 0) {
            return `
                <div class="sin-alertas-monitoreo">
                    <i class="fas fa-check-circle"></i>
                    <h4>¡Todo limpio!</h4>
                    <p>No hay cuentas pendientes de revisión</p>
                </div>
            `;
        }
        
        return cuentasConAlertas.map(cuenta => `
            <div class="cuenta-monitoreo severidad-${cuenta.severidadMaxima}">
                <div class="info-cuenta">
                    <div class="nombre-email">
                        <strong>${cuenta.nombre}</strong>
                        <span class="email">${cuenta.email}</span>
                    </div>
                    <div class="fecha-registro">
                        ${this.formatearFecha(cuenta.fechaRegistro)}
                    </div>
                </div>
                
                <div class="alertas-resumen">
                    <span class="badge-alertas">${cuenta.alertas.length} alertas</span>
                    ${cuenta.alertas.slice(0, 2).map(alerta => `
                        <span class="mini-alerta">${alerta.tipo}</span>
                    `).join('')}
                </div>
                
                <div class="acciones-monitoreo">
                    <button class="btn-revisar" onclick="MonitoreoPostRegistro.revisarCuenta('${cuenta.email}')">
                        <i class="fas fa-eye"></i> Revisar
                    </button>
                    <button class="btn-aprobar" onclick="MonitoreoPostRegistro.aprobarCuenta('${cuenta.email}')">
                        <i class="fas fa-check"></i> Aprobar
                    </button>
                    <button class="btn-advertir" onclick="MonitoreoPostRegistro.advertirCuenta('${cuenta.email}')">
                        <i class="fas fa-exclamation-triangle"></i> Advertir
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    // Obtener cuentas con alertas
    obtenerCuentasConAlertas() {
        const cuentas = [];
        
        // Revisar localStorage para alertas guardadas
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('alertas_')) {
                const email = key.replace('alertas_', '');
                const alertas = JSON.parse(localStorage.getItem(key) || '[]');
                
                if (alertas.length > 0) {
                    // Buscar datos de la cuenta
                    const datosOrden = this.buscarDatosCuenta(email);
                    
                    cuentas.push({
                        email: email,
                        nombre: datosOrden?.nombre_propietario || 'Usuario',
                        alertas: alertas,
                        severidadMaxima: this.calcularSeveridadMaxima(alertas),
                        fechaRegistro: datosOrden?.fechaCreacion || new Date().toISOString(),
                        estado: 'pendiente'
                    });
                }
            }
        }
        
        return cuentas.sort((a, b) => 
            new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
        );
    },
    
    // Buscar datos de cuenta registrada
    buscarDatosCuenta(email) {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('tienda_')) {
                const datos = JSON.parse(localStorage.getItem(key) || '{}');
                if (datos.email === email) {
                    return datos;
                }
            }
        }
        return null;
    },
    
    // Calcular severidad máxima
    calcularSeveridadMaxima(alertas) {
        if (alertas.some(a => a.severidad === 'muy_alta')) return 'muy_alta';
        if (alertas.some(a => a.severidad === 'alta')) return 'alta';
        if (alertas.some(a => a.severidad === 'media')) return 'media';
        return 'baja';
    },
    
    // Revisar cuenta detalladamente
    revisarCuenta(email) {
        const alertas = JSON.parse(localStorage.getItem(`alertas_${email}`) || '[]');
        const datosCuenta = this.buscarDatosCuenta(email);
        
        const modal = document.createElement('div');
        modal.className = 'modal-revision-cuenta';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content-revision">
                <div class="modal-header-revision">
                    <h3>🔍 Revisión Detallada</h3>
                    <button onclick="this.closest('.modal-revision-cuenta').remove()">✕</button>
                </div>
                
                <div class="modal-body-revision">
                    <div class="info-usuario-completa">
                        <h4>👤 Información del Usuario</h4>
                        <div class="datos-grid">
                            <div><strong>Nombre:</strong> ${datosCuenta?.nombre_propietario || 'N/A'}</div>
                            <div><strong>Email:</strong> ${email}</div>
                            <div><strong>Tienda:</strong> ${datosCuenta?.nombre_tienda || 'N/A'}</div>
                            <div><strong>Categoría:</strong> ${datosCuenta?.categoria_principal || 'N/A'}</div>
                            <div><strong>Ciudad:</strong> ${datosCuenta?.ciudad || 'N/A'}</div>
                            <div><strong>Teléfono:</strong> ${datosCuenta?.telefono || 'N/A'}</div>
                        </div>
                    </div>
                    
                    <div class="historia-emprendedor">
                        <h4>📖 Historia del Emprendedor</h4>
                        <div class="historia-contenido">
                            ${datosCuenta?.historia_emprendedor || 'No proporcionada'}
                        </div>
                    </div>
                    
                    <div class="productos-servicios">
                        <h4>🛍️ Productos/Servicios</h4>
                        <div class="productos-contenido">
                            ${datosCuenta?.productos_servicios || 'No especificados'}
                        </div>
                    </div>
                    
                    <div class="alertas-detalladas">
                        <h4>⚠️ Alertas Detectadas</h4>
                        ${alertas.map(alerta => `
                            <div class="alerta-detalle severidad-${alerta.severidad}">
                                <div class="alerta-tipo">${alerta.tipo}</div>
                                <div class="alerta-categoria">${alerta.categoria || 'General'}</div>
                                <div class="alerta-descripcion">${alerta.descripcion || 'Sin descripción'}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="modal-footer-revision">
                    <button class="btn-aprobar-final" onclick="MonitoreoPostRegistro.aprobarCuentaFinal('${email}')">
                        ✅ Aprobar - Todo OK
                    </button>
                    <button class="btn-advertir-final" onclick="MonitoreoPostRegistro.advertirCuentaFinal('${email}')">
                        ⚠️ Enviar Advertencia
                    </button>
                    <button class="btn-suspender-final" onclick="MonitoreoPostRegistro.suspenderCuentaFinal('${email}')">
                        🚫 Suspender Cuenta
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    // Aprobar cuenta (limpiar alertas)
    aprobarCuentaFinal(email) {
        localStorage.removeItem(`alertas_${email}`);
        localStorage.setItem(`cuenta_aprobada_${email}`, JSON.stringify({
            fecha: new Date().toISOString(),
            aprobadoPor: 'CRISLA',
            accion: 'aprobada'
        }));
        
        // Cerrar modal y actualizar vista
        document.querySelector('.modal-revision-cuenta')?.remove();
        this.actualizarPanelMonitoreo();
        
        // Mostrar confirmación
        this.mostrarNotificacion('✅ Cuenta aprobada correctamente', 'success');
    },
    
    // Advertir cuenta
    advertirCuentaFinal(email) {
        const mensaje = prompt('Mensaje de advertencia para el usuario:') || 
                       'Hola, hemos notado algunos aspectos en tu cuenta que nos gustaría que revises...';
        
        // Simular envío de email
        console.log(`📧 Enviando advertencia a ${email}:`, mensaje);
        
        // Marcar como advertida
        localStorage.setItem(`cuenta_advertida_${email}`, JSON.stringify({
            fecha: new Date().toISOString(),
            mensaje: mensaje,
            advertencias: 1
        }));
        
        // Cerrar modal y actualizar
        document.querySelector('.modal-revision-cuenta')?.remove();
        this.actualizarPanelMonitoreo();
        
        this.mostrarNotificacion('⚠️ Advertencia enviada al usuario', 'warning');
    },
    
    // Suspender cuenta
    suspenderCuentaFinal(email) {
        const motivo = prompt('Motivo de suspensión:') || 'Violación de políticas de comunidad';
        
        if (confirm(`¿Estás segura de suspender la cuenta ${email}?`)) {
            localStorage.setItem(`cuenta_suspendida_${email}`, JSON.stringify({
                fecha: new Date().toISOString(),
                motivo: motivo,
                suspendidaPor: 'CRISLA'
            }));
            
            localStorage.removeItem(`alertas_${email}`);
            
            // Cerrar modal y actualizar
            document.querySelector('.modal-revision-cuenta')?.remove();
            this.actualizarPanelMonitoreo();
            
            this.mostrarNotificacion('🚫 Cuenta suspendida', 'error');
        }
    },
    
    // Actualizar panel de monitoreo
    actualizarPanelMonitoreo() {
        const panel = document.querySelector('.lista-cuentas-monitoreo');
        if (panel) {
            panel.innerHTML = this.generarListaCuentas();
        }
    },
    
    // Formatear fecha
    formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo) {
        // Usar sistema de notificaciones existente si está disponible
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, tipo);
        } else {
            alert(mensaje);
        }
    }
};

// Exportar para uso global
window.MonitoreoPostRegistro = MonitoreoPostRegistro;

console.log('📋 Sistema de Monitoreo Post-Registro cargado');













