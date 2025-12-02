// ===== COMUNIDAD: EXPERIENCIAS SOBRENATURALES =====
// Espacio seguro para compartir experiencias sobrenaturales
// Co-fundadores: Carla & Claude

class ComunidadSobrenaturales {
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
                    console.log('✅ Comunidad Sobrenaturales: Supabase inicializado');
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
        await this.cargarExperiencias();
        await this.cargarEstadisticas();
        
        // Configurar formulario
        this.configurarFormulario();
    }
    
    generarHashUsuario() {
        let hash = localStorage.getItem('cresalia_sobrenaturales_hash');
        if (!hash) {
            const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
            hash = btoa(random).substring(0, 32);
            localStorage.setItem('cresalia_sobrenaturales_hash', hash);
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
                    if (tabId === 'experiencias') {
                        this.cargarExperiencias();
                    } else if (tabId === 'estadisticas') {
                        this.cargarEstadisticas();
                    } else if (tabId === 'mi-historial') {
                        this.cargarMiHistorial();
                    }
                }
            });
        });
    }
    
    // ===== CARGAR EXPERIENCIAS =====
    async cargarExperiencias() {
        if (!this.supabase) {
            document.getElementById('experiencias-lista').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error: No se pudo conectar con la base de datos</p>
                </div>
            `;
            return;
        }
        
        const tipo = document.getElementById('filtro-tipo')?.value || '';
        const intensidad = document.getElementById('filtro-intensidad')?.value || '';
        
        try {
            let query = this.supabase
                .from('experiencias_sobrenaturales')
                .select('*')
                .eq('estado', 'activo')
                .order('fecha_creacion', { ascending: false })
                .limit(50);
            
            if (tipo) {
                query = query.eq('tipo', tipo);
            }
            
            if (intensidad) {
                query = query.eq('intensidad', intensidad);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            if (!data || data.length === 0) {
                document.getElementById('experiencias-lista').innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-ghost"></i>
                        <p>No hay experiencias aún. Sé el primero en compartir tu experiencia.</p>
                    </div>
                `;
                return;
            }
            
            this.mostrarExperiencias(data);
        } catch (error) {
            console.error('Error cargando experiencias:', error);
            document.getElementById('experiencias-lista').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar las experiencias. Por favor, intenta de nuevo.</p>
                </div>
            `;
        }
    }
    
    mostrarExperiencias(experiencias) {
        const lista = document.getElementById('experiencias-lista');
        
        lista.innerHTML = experiencias.map(e => {
            const fecha = new Date(e.fecha_creacion).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const tagClass = e.intensidad === 'muy-intensa' || e.intensidad === 'intensa' ? 'tag tag-intensa' : 'tag';
            const autorNombre = e.es_anonimo ? 'Anónimo' : (e.autor_nombre || 'Miembro');
            
            return `
                <div class="experiencia-card">
                    <div class="experiencia-header">
                        <h3 class="experiencia-title">${this.escapeHtml(e.titulo)}</h3>
                    </div>
                    <div class="experiencia-meta">
                        <span><i class="fas fa-user"></i> ${autorNombre}</span>
                        ${e.ubicacion ? `<span><i class="fas fa-map-marker-alt"></i> ${this.escapeHtml(e.ubicacion)}</span>` : ''}
                        ${e.fecha_experiencia ? `<span><i class="fas fa-calendar"></i> ${this.escapeHtml(e.fecha_experiencia)}</span>` : ''}
                        <span><i class="fas fa-clock"></i> Publicado: ${fecha}</span>
                    </div>
                    <div class="experiencia-content">${this.escapeHtml(e.contenido)}</div>
                    <div class="experiencia-tags">
                        <span class="${tagClass}">${this.getTipoNombre(e.tipo)}</span>
                        <span class="${tagClass}">${this.getIntensidadNombre(e.intensidad)}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    getTipoNombre(tipo) {
        const tipos = {
            'aparicion': '👻 Apariciones / Espíritus',
            'premonicion': '🔮 Premoniciones',
            'fuera-cuerpo': '🌀 Fuera del Cuerpo',
            'encuentro': '💫 Encuentros',
            'fenomeno': '🔥 Fenómenos',
            'sincronicidad': '✨ Sincronicidades',
            'mistico': '🌙 Místico / Espiritual',
            'otro': '🔍 Otro'
        };
        return tipos[tipo] || tipo;
    }
    
    getIntensidadNombre(intensidad) {
        const intensidades = {
            'leve': 'Leve',
            'moderada': 'Moderada',
            'intensa': 'Intensa',
            'muy-intensa': 'Muy Intensa'
        };
        return intensidades[intensidad] || intensidad;
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ===== APLICAR FILTROS =====
    aplicarFiltros() {
        this.cargarExperiencias();
    }
    
    // ===== CONFIGURAR FORMULARIO =====
    configurarFormulario() {
        const form = document.getElementById('form-experiencia');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.compartirExperiencia();
        });
    }
    
    async compartirExperiencia() {
        const btn = document.getElementById('btn-submit-experiencia');
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
            titulo: document.getElementById('experiencia-titulo').value.trim(),
            tipo: document.getElementById('experiencia-tipo').value,
            intensidad: document.getElementById('experiencia-intensidad').value,
            ubicacion: document.getElementById('experiencia-ubicacion')?.value.trim() || null,
            fecha_experiencia: document.getElementById('experiencia-fecha')?.value.trim() || null,
            contenido: document.getElementById('experiencia-contenido').value.trim(),
            es_anonimo: document.getElementById('experiencia-anonima').checked,
            autor_nombre: document.getElementById('experiencia-anonima').checked ? null : 'Miembro',
            autor_hash: this.usuarioHash,
            estado: 'activo',
            fecha_creacion: new Date().toISOString()
        };
        
        // Validar
        if (!datos.titulo || !datos.tipo || !datos.intensidad || !datos.contenido) {
            this.mostrarError('Por favor, completa todos los campos obligatorios');
            btn.disabled = false;
            btn.innerHTML = originalText;
            return;
        }
        
        try {
            const { data, error } = await this.supabase
                .from('experiencias_sobrenaturales')
                .insert([datos])
                .select();
            
            if (error) throw error;
            
            this.mostrarExito('✅ Experiencia compartida exitosamente. Gracias por compartir tu experiencia. Este es un espacio seguro.');
            
            // Limpiar formulario
            document.getElementById('form-experiencia').reset();
            
            // Cambiar a tab de experiencias y recargar
            document.querySelector('[data-tab="experiencias"]').click();
            await this.cargarExperiencias();
            await this.cargarEstadisticas();
            
        } catch (error) {
            console.error('Error compartiendo experiencia:', error);
            this.mostrarError('Error al compartir la experiencia. Por favor, intenta de nuevo.');
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
                .from('experiencias_sobrenaturales')
                .select('tipo, es_anonimo, autor_hash')
                .eq('estado', 'activo');
            
            if (error) throw error;
            
            const total = data.length;
            const tipos = new Set(data.map(e => e.tipo).filter(Boolean));
            const anonimas = data.filter(e => e.es_anonimo).length;
            const usuarios = new Set(data.map(e => e.autor_hash).filter(Boolean));
            
            document.getElementById('estadisticas-grid').innerHTML = `
                <div class="estadistica-card">
                    <div class="estadistica-valor">${total}</div>
                    <div class="estadistica-label">Total Experiencias</div>
                </div>
                <div class="estadistica-card">
                    <div class="estadistica-valor">${tipos.size}</div>
                    <div class="estadistica-label">Tipos Diferentes</div>
                </div>
                <div class="estadistica-card">
                    <div class="estadistica-valor">${usuarios.size}</div>
                    <div class="estadistica-label">Miembros Activos</div>
                </div>
                <div class="estadistica-card">
                    <div class="estadistica-valor">${anonimas}</div>
                    <div class="estadistica-label">Experiencias Anónimas</div>
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
                .from('experiencias_sobrenaturales')
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
    mostrarMiHistorial(experiencias) {
        const container = document.getElementById('mi-historial-lista');
        if (!container) return;
        
        if (!experiencias || experiencias.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No has compartido ninguna experiencia aún.</p>
                    <p style="margin-top: 10px; font-size: 0.9rem;">Puedes compartir tu primera experiencia en la pestaña "Compartir Experiencia".</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = experiencias.map(exp => {
            const fecha = new Date(exp.fecha_creacion).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const estadoBadge = exp.estado === 'pausado' || exp.estado === 'oculto'
                ? '<span style="background: #6b7280; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">⏸️ Pausado</span>'
                : exp.estado === 'eliminado'
                ? '<span style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">🗑️ Eliminado</span>'
                : '<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 5px; font-size: 0.85rem;">✅ Activo</span>';
            
            return `
                <div class="story-card" style="margin-bottom: 20px; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <h3 style="color: #374151; margin: 0 0 5px 0;">${this.escapeHtml(exp.titulo)}</h3>
                            ${estadoBadge}
                        </div>
                        <span style="color: #6b7280; font-size: 0.9rem;">${fecha}</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <p style="color: #6b7280; font-size: 0.9rem; margin: 0;">
                            📍 ${this.escapeHtml(exp.ubicacion || 'Sin ubicación')} | 
                            Tipo: ${this.escapeHtml(exp.tipo)} | 
                            Intensidad: ${exp.intensidad || 'N/A'}
                        </p>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <p style="color: #374151; margin: 0; line-height: 1.6;">${this.escapeHtml(exp.contenido.substring(0, 200))}${exp.contenido.length > 200 ? '...' : ''}</p>
                    </div>
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                        <button onclick="editarExperienciaSobrenaturales(${exp.id})" class="btn-primary" style="background: #8b5cf6; flex: 1; min-width: 100px;">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="pausarExperienciaSobrenaturales(${exp.id})" class="btn-primary" style="background: #f59e0b; flex: 1; min-width: 100px;">
                            <i class="fas fa-pause"></i> ${exp.estado === 'pausado' ? 'Reactivar' : 'Pausar'}
                        </button>
                        <button onclick="eliminarExperienciaSobrenaturales(${exp.id})" class="btn-primary" style="background: #ef4444; flex: 1; min-width: 100px;">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // ===== EDITAR EXPERIENCIA =====
    async editarExperiencia(experienciaId) {
        alert('💡 La funcionalidad de editar experiencias estará disponible próximamente. Gracias por tu paciencia.');
    }
    
    // ===== PAUSAR/REACTIVAR EXPERIENCIA =====
    async pausarExperiencia(experienciaId) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con la base de datos');
            return;
        }
        
        try {
            const { data: exp, error: fetchError } = await this.supabase
                .from('experiencias_sobrenaturales')
                .select('estado')
                .eq('id', experienciaId)
                .eq('autor_hash', this.usuarioHash)
                .single();
            
            if (fetchError) throw fetchError;
            
            const nuevoEstado = (exp.estado === 'pausado' || exp.estado === 'oculto') ? 'activo' : 'pausado';
            
            const { error } = await this.supabase
                .from('experiencias_sobrenaturales')
                .update({ estado: nuevoEstado })
                .eq('id', experienciaId)
                .eq('autor_hash', this.usuarioHash);
            
            if (error) throw error;
            
            this.mostrarExito(nuevoEstado === 'pausado' ? '✅ Experiencia pausada correctamente.' : '✅ Experiencia reactivada correctamente.');
            await this.cargarMiHistorial();
        } catch (error) {
            console.error('Error pausando experiencia:', error);
            this.mostrarError('Error al pausar/reactivar la experiencia. Por favor, intenta nuevamente.');
        }
    }
    
    // ===== ELIMINAR EXPERIENCIA =====
    async eliminarExperiencia(experienciaId) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta experiencia? Esta acción no se puede deshacer.')) {
            return;
        }
        
        if (!this.supabase) {
            this.mostrarError('No hay conexión con la base de datos');
            return;
        }
        
        try {
            const { error } = await this.supabase
                .from('experiencias_sobrenaturales')
                .delete()
                .eq('id', experienciaId)
                .eq('autor_hash', this.usuarioHash);
            
            if (error) throw error;
            
            this.mostrarExito('✅ Experiencia eliminada correctamente.');
            await this.cargarMiHistorial();
            await this.cargarExperiencias(); // Recargar también la lista principal
        } catch (error) {
            console.error('Error eliminando experiencia:', error);
            this.mostrarError('Error al eliminar la experiencia. Por favor, intenta nuevamente.');
        }
    }
}

// Funciones globales
window.editarExperienciaSobrenaturales = function(experienciaId) {
    if (window.comunidadSobrenaturales) {
        window.comunidadSobrenaturales.editarExperiencia(experienciaId);
    }
};

window.pausarExperienciaSobrenaturales = function(experienciaId) {
    if (window.comunidadSobrenaturales) {
        window.comunidadSobrenaturales.pausarExperiencia(experienciaId);
    }
};

window.eliminarExperienciaSobrenaturales = function(experienciaId) {
    if (window.comunidadSobrenaturales) {
        window.comunidadSobrenaturales.eliminarExperiencia(experienciaId);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.comunidadSobrenaturales = new ComunidadSobrenaturales();
});

