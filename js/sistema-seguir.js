// ===== SISTEMA DE SEGUIR TIENDAS Y USUARIOS - CRESALIA =====
// Cliente JavaScript para el sistema de seguidores

class SistemaSeguir {
    constructor() {
        this.supabase = null;
        this.init();
    }

    async init() {
        // Obtener cliente de Supabase
        if (typeof initSupabase === 'function') {
            this.supabase = initSupabase();
        } else if (typeof window.supabase !== 'undefined') {
            this.supabase = window.supabase;
        }
        
        if (!this.supabase) {
            console.warn('⚠️ Supabase no está inicializado. Sistema de seguir deshabilitado.');
            return;
        }
        
        console.log('✅ Sistema de Seguir inicializado');
    }

    // ===== FUNCIÓN PRINCIPAL: SEGUIR =====
    async seguir(entidadId, entidadTipo = 'tienda') {
        if (!this.supabase) {
            return { success: false, message: 'Supabase no disponible' };
        }

        try {
            const { data, error } = await this.supabase.rpc('seguir_entidad', {
                p_seguido_id: entidadId,
                p_seguido_tipo: entidadTipo
            });

            if (error) throw error;

            console.log('✅ Siguiendo a:', entidadTipo, entidadId);
            
            // Mostrar notificación
            this.mostrarNotificacion(`Ahora seguís a esta ${entidadTipo}`, 'success');
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error siguiendo:', error);
            this.mostrarNotificacion('No se pudo seguir. ¿Iniciaste sesión?', 'error');
            return { success: false, error: error.message };
        }
    }

    // ===== FUNCIÓN: DEJAR DE SEGUIR =====
    async dejarDeSeguir(entidadId, entidadTipo = 'tienda') {
        if (!this.supabase) {
            return { success: false, message: 'Supabase no disponible' };
        }

        try {
            const { data, error } = await this.supabase.rpc('dejar_de_seguir_entidad', {
                p_seguido_id: entidadId,
                p_seguido_tipo: entidadTipo
            });

            if (error) throw error;

            console.log('✅ Dejaste de seguir a:', entidadTipo, entidadId);
            
            this.mostrarNotificacion(`Dejaste de seguir a esta ${entidadTipo}`, 'info');
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error dejando de seguir:', error);
            this.mostrarNotificacion('No se pudo dejar de seguir', 'error');
            return { success: false, error: error.message };
        }
    }

    // ===== FUNCIÓN: VERIFICAR SI ESTÁ SIGUIENDO =====
    async estaSiguiendo(entidadId, entidadTipo = 'tienda') {
        if (!this.supabase) {
            return false;
        }

        try {
            const { data, error } = await this.supabase.rpc('esta_siguiendo', {
                p_seguido_id: entidadId,
                p_seguido_tipo: entidadTipo
            });

            if (error) throw error;

            return data === true;
        } catch (error) {
            console.error('❌ Error verificando seguimiento:', error);
            return false;
        }
    }

    // ===== FUNCIÓN: OBTENER SEGUIDORES =====
    async obtenerSeguidores(entidadId, entidadTipo = 'tienda', limite = 50) {
        if (!this.supabase) {
            return { success: false, seguidores: [] };
        }

        try {
            const { data, error } = await this.supabase.rpc('obtener_seguidores', {
                p_entidad_id: entidadId,
                p_entidad_tipo: entidadTipo,
                p_limite: limite
            });

            if (error) throw error;

            return { success: true, seguidores: data || [] };
        } catch (error) {
            console.error('❌ Error obteniendo seguidores:', error);
            return { success: false, seguidores: [], error: error.message };
        }
    }

    // ===== FUNCIÓN: OBTENER A QUIÉN SIGUE EL USUARIO =====
    async obtenerSiguiendo(usuarioId = null, limite = 50) {
        if (!this.supabase) {
            return { success: false, siguiendo: [] };
        }

        try {
            const { data, error } = await this.supabase.rpc('obtener_siguiendo', {
                p_usuario_id: usuarioId,
                p_limite: limite
            });

            if (error) throw error;

            return { success: true, siguiendo: data || [] };
        } catch (error) {
            console.error('❌ Error obteniendo seguidos:', error);
            return { success: false, siguiendo: [], error: error.message };
        }
    }

    // ===== FUNCIÓN: OBTENER CONTADOR DE SEGUIDORES =====
    async obtenerContador(entidadId, entidadTipo = 'tienda') {
        if (!this.supabase) {
            return { total_seguidores: 0, total_siguiendo: 0 };
        }

        try {
            const { data, error } = await this.supabase
                .from('contadores_seguidores')
                .select('*')
                .eq('entidad_id', entidadId)
                .eq('entidad_tipo', entidadTipo)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            return data || { total_seguidores: 0, total_siguiendo: 0 };
        } catch (error) {
            console.error('❌ Error obteniendo contador:', error);
            return { total_seguidores: 0, total_siguiendo: 0 };
        }
    }

    // ===== FUNCIÓN: TOGGLE SEGUIR/DEJAR DE SEGUIR =====
    async toggleSeguir(entidadId, entidadTipo = 'tienda') {
        const estaSiguiendo = await this.estaSiguiendo(entidadId, entidadTipo);
        
        if (estaSiguiendo) {
            return await this.dejarDeSeguir(entidadId, entidadTipo);
        } else {
            return await this.seguir(entidadId, entidadTipo);
        }
    }

    // ===== FUNCIÓN: RENDERIZAR BOTÓN DE SEGUIR =====
    async renderizarBotonSeguir(contenedor, entidadId, entidadTipo = 'tienda') {
        if (!contenedor) return;

        const estaSiguiendo = await this.estaSiguiendo(entidadId, entidadTipo);
        const contador = await this.obtenerContador(entidadId, entidadTipo);

        const boton = document.createElement('button');
        boton.className = `btn-seguir ${estaSiguiendo ? 'siguiendo' : ''}`;
        boton.innerHTML = `
            <i class="fas fa-${estaSiguiendo ? 'check' : 'plus'}"></i>
            <span class="btn-seguir-texto">${estaSiguiendo ? 'Siguiendo' : 'Seguir'}</span>
            ${contador.total_seguidores > 0 ? `<span class="btn-seguir-count">${contador.total_seguidores}</span>` : ''}
        `;

        boton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            boton.disabled = true;
            
            const resultado = await this.toggleSeguir(entidadId, entidadTipo);
            
            if (resultado.success) {
                // Actualizar botón
                const nuevoEstado = await this.estaSiguiendo(entidadId, entidadTipo);
                const nuevoContador = await this.obtenerContador(entidadId, entidadTipo);
                
                boton.className = `btn-seguir ${nuevoEstado ? 'siguiendo' : ''}`;
                boton.innerHTML = `
                    <i class="fas fa-${nuevoEstado ? 'check' : 'plus'}"></i>
                    <span class="btn-seguir-texto">${nuevoEstado ? 'Siguiendo' : 'Seguir'}</span>
                    ${nuevoContador.total_seguidores > 0 ? `<span class="btn-seguir-count">${nuevoContador.total_seguidores}</span>` : ''}
                `;
            }
            
            boton.disabled = false;
        });

        contenedor.innerHTML = '';
        contenedor.appendChild(boton);
        
        return boton;
    }

    // ===== FUNCIÓN: MOSTRAR LISTA DE SEGUIDORES =====
    async mostrarSeguidores(entidadId, entidadTipo = 'tienda') {
        const { seguidores } = await this.obtenerSeguidores(entidadId, entidadTipo);

        const modal = document.createElement('div');
        modal.className = 'modal-seguidores';
        modal.innerHTML = `
            <div class="modal-seguidores-contenido">
                <div class="modal-seguidores-header">
                    <h3>Seguidores (${seguidores.length})</h3>
                    <button class="btn-cerrar">&times;</button>
                </div>
                <div class="modal-seguidores-lista">
                    ${seguidores.length > 0 ? seguidores.map(s => `
                        <div class="seguidor-item">
                            <div class="seguidor-avatar">
                                ${s.nombre ? s.nombre.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div class="seguidor-info">
                                <h4>${s.nombre || s.email}</h4>
                                <p>${s.seguidor_tipo}</p>
                                <span class="seguidor-fecha">Desde ${new Date(s.fecha_inicio).toLocaleDateString('es-AR')}</span>
                            </div>
                        </div>
                    `).join('') : '<p class="sin-seguidores">Aún no hay seguidores</p>'}
                </div>
            </div>
        `;

        modal.querySelector('.btn-cerrar').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.body.appendChild(modal);
    }

    // ===== FUNCIÓN: MOSTRAR NOTIFICACIÓN =====
    mostrarNotificacion(mensaje, tipo = 'info') {
        // Si hay un sistema de notificaciones global, usarlo
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, tipo);
            return;
        }

        // Si no, crear notificación simple
        const notif = document.createElement('div');
        notif.className = `notificacion notificacion-${tipo}`;
        notif.textContent = mensaje;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'success' ? '#22c55e' : tipo === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999999;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // ===== FUNCIÓN: OBTENER TOP TIENDAS MÁS SEGUIDAS =====
    async obtenerTopTiendasSeguidas(limite = 10) {
        if (!this.supabase) {
            return [];
        }

        try {
            const { data, error } = await this.supabase
                .from('top_tiendas_seguidas')
                .select('*')
                .limit(limite);

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('❌ Error obteniendo top tiendas:', error);
            return [];
        }
    }

    // ===== FUNCIÓN: OBTENER TOP SERVICIOS MÁS SEGUIDOS =====
    async obtenerTopServiciosSeguidos(limite = 10) {
        if (!this.supabase) {
            return [];
        }

        try {
            const { data, error } = await this.supabase
                .from('top_servicios_seguidos')
                .select('*')
                .limit(limite);

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('❌ Error obteniendo top servicios:', error);
            return [];
        }
    }
}

// ===== INSTANCIA GLOBAL =====
window.sistemaSeguir = new SistemaSeguir();

// ===== FUNCIONES GLOBALES DE CONVENIENCIA =====
window.seguir = (id, tipo) => window.sistemaSeguir.seguir(id, tipo);
window.dejarDeSeguir = (id, tipo) => window.sistemaSeguir.dejarDeSeguir(id, tipo);
window.estaSiguiendo = (id, tipo) => window.sistemaSeguir.estaSiguiendo(id, tipo);
window.mostrarSeguidores = (id, tipo) => window.sistemaSeguir.mostrarSeguidores(id, tipo);

console.log('✅ Sistema de Seguir Cresalia cargado');

// ===== ESTILOS CSS =====
const estilos = document.createElement('style');
estilos.textContent = `
    /* Botón de seguir */
    .btn-seguir {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 25px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-seguir:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    .btn-seguir.siguiendo {
        background: linear-gradient(135deg, #22c55e, #10b981);
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    }

    .btn-seguir:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .btn-seguir-count {
        background: rgba(255, 255, 255, 0.3);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.85rem;
    }

    /* Modal de seguidores */
    .modal-seguidores {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        animation: fadeIn 0.3s ease;
    }

    .modal-seguidores-contenido {
        background: white;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .modal-seguidores-header {
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-seguidores-header h3 {
        margin: 0;
        color: #374151;
    }

    .btn-cerrar {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
        transition: color 0.2s;
    }

    .btn-cerrar:hover {
        color: #374151;
    }

    .modal-seguidores-lista {
        padding: 20px;
        overflow-y: auto;
        flex: 1;
    }

    .seguidor-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px;
        border-radius: 10px;
        transition: background 0.2s;
        margin-bottom: 10px;
    }

    .seguidor-item:hover {
        background: #f9fafb;
    }

    .seguidor-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
        flex-shrink: 0;
    }

    .seguidor-info h4 {
        margin: 0 0 4px 0;
        color: #374151;
        font-size: 1rem;
    }

    .seguidor-info p {
        margin: 0 0 4px 0;
        color: #6b7280;
        font-size: 0.875rem;
        text-transform: capitalize;
    }

    .seguidor-fecha {
        color: #9ca3af;
        font-size: 0.75rem;
    }

    .sin-seguidores {
        text-align: center;
        color: #9ca3af;
        padding: 40px 20px;
    }

    /* Animaciones */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;

document.head.appendChild(estilos);
