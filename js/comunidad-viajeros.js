// ===== COMUNIDAD: VIAJEROS =====
// Espacio para compartir historias de viaje
// Co-fundadores: Carla & Claude

class ComunidadViajeros {
    constructor() {
        this.supabase = null;
        this.usuarioHash = null;
        this.init();
    }
    
    async init() {
        // Inicializar Supabase
        if (typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
            try {
                const config = window.SUPABASE_CONFIG;
                if (config.url && config.anonKey && !config.anonKey.includes('REEMPLAZA')) {
                    this.supabase = window.supabase.createClient(config.url, config.anonKey);
                    console.log('✅ Comunidad Viajeros: Supabase inicializado');
                }
            } catch (error) {
                console.error('❌ Error inicializando Supabase:', error);
            }
        }
        
        // Generar hash de usuario
        this.usuarioHash = this.generarHashUsuario();
        
        // Configurar tabs
        this.configurarTabs();
        
        // Cargar contenido inicial
        await this.cargarHistorias();
        await this.cargarEstadisticas();
        
        // Configurar formulario
        this.configurarFormulario();
    }
    
    generarHashUsuario() {
        let hash = localStorage.getItem('cresalia_viajeros_hash');
        if (!hash) {
            const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
            hash = btoa(random).substring(0, 32);
            localStorage.setItem('cresalia_viajeros_hash', hash);
        }
        return hash;
    }
    
    configurarTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                
                tab.classList.add('active');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                    
                    // Recargar contenido según la tab
                    if (tabId === 'historias') {
                        this.cargarHistorias();
                    } else if (tabId === 'estadisticas') {
                        this.cargarEstadisticas();
                    } else if (tabId === 'mi-historial') {
                        this.cargarMiHistorial();
                    }
                }
            });
        });
    }
    
    // ===== CARGAR HISTORIAS =====
    async cargarHistorias() {
        if (!this.supabase) {
            document.getElementById('historias-lista').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error: No se pudo conectar con la base de datos</p>
                </div>
            `;
            return;
        }
        
        const tipo = document.getElementById('filtro-tipo')?.value || '';
        const continente = document.getElementById('filtro-continente')?.value || '';
        
        try {
            let query = this.supabase
                .from('historias_viajeros')
                .select('*')
                .eq('estado', 'activo')
                .order('fecha_creacion', { ascending: false })
                .limit(50);
            
            if (tipo) {
                query = query.eq('tipo', tipo);
            }
            
            if (continente) {
                query = query.eq('continente', continente);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            if (!data || data.length === 0) {
                document.getElementById('historias-lista').innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-book-open"></i>
                        <p>No hay historias aún. Sé el primero en compartir tu experiencia.</p>
                    </div>
                `;
                return;
            }
            
            this.mostrarHistorias(data);
        } catch (error) {
            console.error('Error cargando historias:', error);
            document.getElementById('historias-lista').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar las historias. Por favor, intenta de nuevo.</p>
                </div>
            `;
        }
    }
    
    mostrarHistorias(historias) {
        const lista = document.getElementById('historias-lista');
        
        lista.innerHTML = historias.map(h => {
            const fecha = new Date(h.fecha_creacion).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const tagClass = 'tag';
            const autorNombre = h.es_anonimo ? 'Viajero Anónimo' : (h.autor_nombre || 'Viajero');
            
            return `
                <div class="historia-card">
                    <div class="historia-header">
                        <h3 class="historia-title">${this.escapeHtml(h.titulo)}</h3>
                    </div>
                    <div class="historia-meta">
                        <span><i class="fas fa-user"></i> ${autorNombre}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(h.destino)}</span>
                        <span><i class="fas fa-globe"></i> ${this.getContinenteNombre(h.continente)}</span>
                        <span><i class="fas fa-calendar"></i> ${fecha}</span>
                    </div>
                    <div class="historia-content">${this.escapeHtml(h.contenido)}</div>
                    <div class="historia-tags">
                        <span class="${tagClass}">${this.getTipoNombre(h.tipo)}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    getTipoNombre(tipo) {
        const tipos = {
            'aventura': 'Aventura',
            'cultural': 'Cultural',
            'relajante': 'Relajante',
            'trabajo': 'Viaje de Trabajo',
            'solo': 'Viajando Solo/a',
            'otro': 'Otro'
        };
        return tipos[tipo] || tipo;
    }
    
    getContinenteNombre(continente) {
        const continentes = {
            'america': 'América',
            'europa': 'Europa',
            'asia': 'Asia',
            'africa': 'África',
            'oceania': 'Oceanía',
            'antartida': 'Antártida'
        };
        return continentes[continente] || continente;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ===== APLICAR FILTROS =====
    aplicarFiltros() {
        this.cargarHistorias();
    }
    
    // ===== CONFIGURAR FORMULARIO =====
    configurarFormulario() {
        const form = document.getElementById('form-historia');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.compartirHistoria();
        });
    }
    
    async compartirHistoria() {
        const btn = document.getElementById('btn-submit-historia');
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compartiendo...';
        
        if (!this.supabase) {
            this.mostrarError('Error: No se pudo conectar con la base de datos');
            btn.disabled = false;
            btn.innerHTML = originalText;
            return;
        }
        
        const datos = {
            titulo: document.getElementById('historia-titulo').value.trim(),
            tipo: document.getElementById('historia-tipo').value,
            destino: document.getElementById('historia-destino').value.trim(),
            continente: document.getElementById('historia-continente').value,
            contenido: document.getElementById('historia-contenido').value.trim(),
            es_anonimo: document.getElementById('historia-anonima').checked,
            autor_nombre: document.getElementById('historia-anonima').checked ? null : 'Viajero',
            autor_hash: this.usuarioHash,
            estado: 'activo',
            fecha_creacion: new Date().toISOString()
        };
        
        // Validar
        if (!datos.titulo || !datos.tipo || !datos.destino || !datos.continente || !datos.contenido) {
            this.mostrarError('Por favor, completa todos los campos obligatorios');
            btn.disabled = false;
            btn.innerHTML = originalText;
            return;
        }
        
        try {
            const { data, error } = await this.supabase
                .from('historias_viajeros')
                .insert([datos])
                .select();
            
            if (error) throw error;
            
            this.mostrarExito('✅ Historia compartida exitosamente. Gracias por compartir tu experiencia.');
            
            // Limpiar formulario
            document.getElementById('form-historia').reset();
            
            // Cambiar a tab de historias y recargar
            document.querySelector('[data-tab="historias"]').click();
            await this.cargarHistorias();
            await this.cargarEstadisticas();
            
        } catch (error) {
            console.error('Error compartiendo historia:', error);
            this.mostrarError('Error al compartir la historia. Por favor, intenta de nuevo.');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
    
    // ===== CARGAR ESTADÍSTICAS =====
    async cargarEstadisticas() {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('historias_viajeros')
                .select('continente, destino')
                .eq('estado', 'activo');
            
            if (error) throw error;
            
            const total = data.length;
            const continentes = new Set(data.map(h => h.continente).filter(Boolean));
            const paises = new Set(data.map(h => h.destino?.split(',')[1]?.trim()).filter(Boolean));
            const usuarios = new Set(data.map(h => h.autor_hash).filter(Boolean));
            
            document.getElementById('estadisticas-grid').innerHTML = `
                <div class="estadistica-card">
                    <div class="estadistica-valor">${total}</div>
                    <div class="estadistica-label">Total Historias</div>
                </div>
                <div class="estadistica-card">
                    <div class="estadistica-valor">${paises.size}</div>
                    <div class="estadistica-label">Países Visitados</div>
                </div>
                <div class="estadistica-card">
                    <div class="estadistica-valor">${continentes.size}</div>
                    <div class="estadistica-label">Continentes</div>
                </div>
                <div class="estadistica-card">
                    <div class="estadistica-valor">${usuarios.size}</div>
                    <div class="estadistica-label">Viajeros Activos</div>
                </div>
            `;
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    }
    
    // ===== MENSAJES =====
    mostrarExito(mensaje) {
        const alert = document.getElementById('alert-message');
        alert.className = 'alert alert-success';
        alert.textContent = mensaje;
        alert.style.display = 'block';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }
    
    mostrarError(mensaje) {
        const alert = document.getElementById('alert-message');
        alert.className = 'alert alert-error';
        alert.textContent = mensaje;
        alert.style.display = 'block';
        
        setTimeout(() => {
            alert.style.display = 'none';
        }, 5000);
    }
    
    // ===== CARGAR MI HISTORIAL =====
    async cargarMiHistorial() {
        if (!this.supabase || !this.usuarioHash) {
            const container = document.getElementById('mi-historial-lista');
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>No se pudo cargar tu historial. Por favor, recarga la página.</p>
                    </div>
                `;
            }
            return;
        }
        
        try {
            const { data, error } = await this.supabase
                .from('historias_viajeros')
                .select('*')
                .eq('autor_hash', this.usuarioHash)
                .order('fecha_creacion', { ascending: false });
            
            if (error) throw error;
            
            this.mostrarMiHistorial(data || []);
        } catch (error) {
            console.error('Error cargando historial:', error);
            const container = document.getElementById('mi-historial-lista');
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error al cargar tu historial. Por favor, intenta nuevamente.</p>
                    </div>
                `;
            }
        }
    }
    
    // ===== MOSTRAR MI HISTORIAL =====
    mostrarMiHistorial(historias) {
        const container = document.getElementById('mi-historial-lista');
        if (!container) return;
        
        if (!historias || historias.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No has compartido ninguna historia aún.</p>
                    <p style="margin-top: 10px; font-size: 0.9rem;">Puedes compartir tu primera historia en la pestaña "Compartir Historia".</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = historias.map(historia => {
            const fecha = new Date(historia.fecha_creacion).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const estadoBadge = historia.estado === 'pausado' || historia.estado === 'oculto'
                ? '<span style="background: #6b7280; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">⏸️ Pausado</span>'
                : historia.estado === 'eliminado'
                ? '<span style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">🗑️ Eliminado</span>'
                : '<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">✅ Activo</span>';
            
            return `
                <div class="story-card" style="margin-bottom: 20px; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <h3 style="color: #374151; margin: 0 0 5px 0;">${this.escapeHtml(historia.titulo)}</h3>
                            ${estadoBadge}
                        </div>
                        <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <p style="color: #6b7280; font-size: 0.9rem; margin: 0;">
                            📍 ${this.escapeHtml(historia.destino)} - ${this.escapeHtml(historia.continente)} | 
                            Tipo: ${this.escapeHtml(historia.tipo)}
                        </p>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <p style="color: #374151; margin: 0; line-height: 1.6;">${this.escapeHtml(historia.contenido.substring(0, 200))}${historia.contenido.length > 200 ? '...' : ''}</p>
                    </div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                        <button onclick="editarHistoriaViajeros(${historia.id})" class="btn-primary" style="background: #8b5cf6; flex: 1; min-width: 100px;">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="pausarHistoriaViajeros(${historia.id})" class="btn-primary" style="background: #f59e0b; flex: 1; min-width: 100px;">
                            <i class="fas fa-pause"></i> ${(historia.estado === 'pausado' || historia.estado === 'oculto') ? 'Reactivar' : 'Pausar'}
                        </button>
                        <button onclick="eliminarHistoriaViajeros(${historia.id})" class="btn-primary" style="background: #ef4444; flex: 1; min-width: 100px;">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // ===== EDITAR HISTORIA =====
    async editarHistoria(historiaId) {
        alert('💡 La funcionalidad de editar historias estará disponible próximamente. Gracias por tu paciencia.');
    }
    
    // ===== PAUSAR/REACTIVAR HISTORIA =====
    async pausarHistoria(historiaId) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con la base de datos');
            return;
        }
        
        try {
            // Primero obtener el estado actual
            const { data: historia, error: fetchError } = await this.supabase
                .from('historias_viajeros')
                .select('estado')
                .eq('id', historiaId)
                .eq('autor_hash', this.usuarioHash)
                .single();
            
            if (fetchError) throw fetchError;
            
            const nuevoEstado = (historia.estado === 'pausado' || historia.estado === 'oculto') ? 'activo' : 'pausado';
            
            const { error } = await this.supabase
                .from('historias_viajeros')
                .update({ estado: nuevoEstado })
                .eq('id', historiaId)
                .eq('autor_hash', this.usuarioHash);
            
            if (error) throw error;
            
            this.mostrarExito(nuevoEstado === 'pausado' ? '✅ Historia pausada correctamente.' : '✅ Historia reactivada correctamente.');
            await this.cargarMiHistorial();
        } catch (error) {
            console.error('Error pausando historia:', error);
            this.mostrarError('Error al pausar/reactivar la historia. Por favor, intenta nuevamente.');
        }
    }
    
    // ===== ELIMINAR HISTORIA =====
    async eliminarHistoria(historiaId) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta historia? Esta acción no se puede deshacer.')) {
            return;
        }
        
        if (!this.supabase) {
            this.mostrarError('No hay conexión con la base de datos');
            return;
        }
        
        try {
            const { error } = await this.supabase
                .from('historias_viajeros')
                .delete()
                .eq('id', historiaId)
                .eq('autor_hash', this.usuarioHash);
            
            if (error) throw error;
            
            this.mostrarExito('✅ Historia eliminada correctamente.');
            await this.cargarMiHistorial();
            await this.cargarHistorias(); // Recargar también la lista principal
        } catch (error) {
            console.error('Error eliminando historia:', error);
            this.mostrarError('Error al eliminar la historia. Por favor, intenta nuevamente.');
        }
    }
}

// Funciones globales
window.editarHistoriaViajeros = function(historiaId) {
    if (window.comunidadViajeros) {
        window.comunidadViajeros.editarHistoria(historiaId);
    }
};

window.pausarHistoriaViajeros = function(historiaId) {
    if (window.comunidadViajeros) {
        window.comunidadViajeros.pausarHistoria(historiaId);
    }
};

window.eliminarHistoriaViajeros = function(historiaId) {
    if (window.comunidadViajeros) {
        window.comunidadViajeros.eliminarHistoria(historiaId);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.comunidadViajeros = new ComunidadViajeros();
});

