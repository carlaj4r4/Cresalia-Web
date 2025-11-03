// ===== SISTEMA DE INTERCONEXIONES GLOBAL - CRESALIA =====
// Conecta todos los archivos del ecosistema Cresalia

class SistemaInterconexionesGlobal {
    constructor() {
        this.archivos = {
            landing: 'landing-cresalia-DEFINITIVO.html',
            index: 'index-cresalia.html',
            panelMaster: 'panel-master-cresalia.html',
            respaldoEmocional: 'crisla-respaldo-emocional.html',
            tiendaEjemplo: 'tiendas/ejemplo-tienda/index.html',
            demoBuyer: 'demo-buyer-interface.html',
            adminNuevo: 'tiendas/ejemplo-tienda/admin-nuevo.html'
        };
        
        this.eventos = new Map();
        this.sincronizacion = new Map();
        this.inicializar();
    }
    
    inicializar() {
        console.log('🔗 Sistema de Interconexiones Global inicializado');
        this.configurarEventos();
        this.configurarSincronizacion();
        this.configurarNavegacion();
    }
    
    configurarEventos() {
        // Eventos entre archivos
        this.eventos.set('usuario:login', this.manejarLogin.bind(this));
        this.eventos.set('usuario:logout', this.manejarLogout.bind(this));
        this.eventos.set('plan:cambio', this.manejarCambioPlan.bind(this));
        this.eventos.set('producto:creado', this.manejarProductoCreado.bind(this));
        this.eventos.set('servicio:creado', this.manejarServicioCreado.bind(this));
        this.eventos.set('venta:realizada', this.manejarVentaRealizada.bind(this));
        this.eventos.set('bienestar:actualizado', this.manejarBienestarActualizado.bind(this));
        this.eventos.set('comunidad:mensaje', this.manejarMensajeComunidad.bind(this));
    }
    
    configurarSincronizacion() {
        // Sincronización de datos entre archivos
        this.sincronizacion.set('productos', this.sincronizarProductos.bind(this));
        this.sincronizacion.set('servicios', this.sincronizarServicios.bind(this));
        this.sincronizacion.set('usuarios', this.sincronizarUsuarios.bind(this));
        this.sincronizacion.set('bienestar', this.sincronizarBienestar.bind(this));
        this.sincronizacion.set('comunidad', this.sincronizarComunidad.bind(this));
    }
    
    configurarNavegacion() {
        // Navegación entre archivos
        window.navegarA = this.navegarA.bind(this);
        window.abrirEnModal = this.abrirEnModal.bind(this);
        window.sincronizarDatos = this.sincronizarDatos.bind(this);
    }
    
    // ===== NAVEGACIÓN =====
    navegarA(archivo, parametros = {}) {
        const url = this.archivos[archivo] || archivo;
        const queryString = new URLSearchParams(parametros).toString();
        const urlCompleta = queryString ? `${url}?${queryString}` : url;
        
        console.log(`🔗 Navegando a: ${urlCompleta}`);
        window.location.href = urlCompleta;
    }
    
    abrirEnModal(archivo, parametros = {}) {
        const url = this.archivos[archivo] || archivo;
        const queryString = new URLSearchParams(parametros).toString();
        const urlCompleta = queryString ? `${url}?${queryString}` : url;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 0; border-radius: 16px; max-width: 95%; width: 1200px; max-height: 90vh; overflow: hidden; position: relative;">
                <div style="position: absolute; top: 15px; right: 15px; z-index: 10001;">
                    <button onclick="cerrarModalSeguro(this)" style="background: #6B7280; color: white; border: none; padding: 8px 12px; border-radius: 50%; cursor: pointer; font-size: 18px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                        ×
                    </button>
                </div>
                <iframe src="${urlCompleta}" style="width: 100%; height: 90vh; border: none; border-radius: 16px;"></iframe>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar al hacer click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // ===== SINCRONIZACIÓN =====
    sincronizarDatos(tipo, datos) {
        if (this.sincronizacion.has(tipo)) {
            this.sincronizacion.get(tipo)(datos);
        }
    }
    
    sincronizarProductos(datos) {
        // Sincronizar productos entre admin y tienda
        localStorage.setItem('productos_sincronizados', JSON.stringify(datos));
        
        // Notificar a otros archivos
        window.dispatchEvent(new CustomEvent('productos:actualizados', {
            detail: datos
        }));
    }
    
    sincronizarServicios(datos) {
        // Sincronizar servicios entre admin y tienda
        localStorage.setItem('servicios_sincronizados', JSON.stringify(datos));
        
        // Notificar a otros archivos
        window.dispatchEvent(new CustomEvent('servicios:actualizados', {
            detail: datos
        }));
    }
    
    sincronizarUsuarios(datos) {
        // Sincronizar usuarios entre archivos
        localStorage.setItem('usuarios_sincronizados', JSON.stringify(datos));
        
        // Notificar a otros archivos
        window.dispatchEvent(new CustomEvent('usuarios:actualizados', {
            detail: datos
        }));
    }
    
    sincronizarBienestar(datos) {
        // Sincronizar datos de bienestar emocional
        localStorage.setItem('bienestar_sincronizado', JSON.stringify(datos));
        
        // Notificar a otros archivos
        window.dispatchEvent(new CustomEvent('bienestar:actualizado', {
            detail: datos
        }));
    }
    
    sincronizarComunidad(datos) {
        // Sincronizar datos de comunidad
        localStorage.setItem('comunidad_sincronizada', JSON.stringify(datos));
        
        // Notificar a otros archivos
        window.dispatchEvent(new CustomEvent('comunidad:actualizada', {
            detail: datos
        }));
    }
    
    // ===== MANEJADORES DE EVENTOS =====
    manejarLogin(datos) {
        console.log('🔐 Usuario logueado:', datos);
        // Sincronizar datos de usuario
        this.sincronizarUsuarios(datos);
    }
    
    manejarLogout(datos) {
        console.log('🔓 Usuario deslogueado:', datos);
        // Limpiar datos de usuario
        localStorage.removeItem('usuarios_sincronizados');
    }
    
    manejarCambioPlan(datos) {
        console.log('📊 Plan cambiado:', datos);
        // Actualizar plan en todos los archivos
        localStorage.setItem('plan_actual', datos.plan);
    }
    
    manejarProductoCreado(datos) {
        console.log('📦 Producto creado:', datos);
        // Sincronizar productos
        this.sincronizarProductos(datos);
    }
    
    manejarServicioCreado(datos) {
        console.log('🔧 Servicio creado:', datos);
        // Sincronizar servicios
        this.sincronizarServicios(datos);
    }
    
    manejarVentaRealizada(datos) {
        console.log('💰 Venta realizada:', datos);
        // Procesar venta y comisiones
        this.procesarVenta(datos);
    }
    
    manejarBienestarActualizado(datos) {
        console.log('💜 Bienestar actualizado:', datos);
        // Sincronizar bienestar
        this.sincronizarBienestar(datos);
    }
    
    manejarMensajeComunidad(datos) {
        console.log('💬 Mensaje de comunidad:', datos);
        // Sincronizar comunidad
        this.sincronizarComunidad(datos);
    }
    
    // ===== PROCESAMIENTO DE VENTAS =====
    procesarVenta(datos) {
        const { vendedorId, monto, comision, plan } = datos;
        
        // Calcular montos
        const montoVendedor = monto - (monto * comision);
        const montoCresalia = monto * comision;
        
        // Guardar en historial
        const historial = JSON.parse(localStorage.getItem('historial_ventas') || '[]');
        historial.push({
            id: Date.now(),
            vendedorId,
            monto,
            montoVendedor,
            montoCresalia,
            comision,
            plan,
            fecha: new Date().toISOString()
        });
        localStorage.setItem('historial_ventas', JSON.stringify(historial));
        
        // Notificar a vendedor
        this.notificarVendedor(vendedorId, montoVendedor);
        
        // Notificar a Cresalia
        this.notificarCresalia(montoCresalia);
    }
    
    notificarVendedor(vendedorId, monto) {
        console.log(`💰 Vendedor ${vendedorId} recibió: $${monto}`);
        // Aquí se integraría con el sistema de pagos del vendedor
    }
    
    notificarCresalia(monto) {
        console.log(`💳 Cresalia recibió comisión: $${monto}`);
        // Aquí se integraría con el sistema de pagos de Cresalia
    }
    
    // ===== FUNCIONES DE UTILIDAD =====
    obtenerArchivo(archivo) {
        return this.archivos[archivo] || archivo;
    }
    
    listarArchivos() {
        return Object.keys(this.archivos);
    }
    
    verificarConexion(archivo) {
        const url = this.obtenerArchivo(archivo);
        return fetch(url, { method: 'HEAD' })
            .then(response => response.ok)
            .catch(() => false);
    }
}

// Instancia global
window.sistemaInterconexiones = new SistemaInterconexionesGlobal();

// Funciones globales para compatibilidad
window.navegarA = (archivo, parametros) => window.sistemaInterconexiones.navegarA(archivo, parametros);
window.abrirEnModal = (archivo, parametros) => window.sistemaInterconexiones.abrirEnModal(archivo, parametros);
window.sincronizarDatos = (tipo, datos) => window.sistemaInterconexiones.sincronizarDatos(tipo, datos);

console.log('🔗 Sistema de Interconexiones Global cargado');

