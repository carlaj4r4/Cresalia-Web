// ===== SISTEMA DE HISTORIAS CON CORAZÓN CRESALIA =====
// Para clientes VIP que quieren compartir su historia

const HistoriasCorazon = {
    historias: [],
    
    async init() {
        console.log('💜 Inicializando sistema de Historias con Corazón Cresalia');
        await this.cargarHistorias();
    },
    
    async cargarHistorias(dondeMostrar = null) {
        try {
            let url = '/api/historias-corazon?publicas=true&activa=true';
            if (dondeMostrar) {
                url += `&donde_mostrar=${dondeMostrar}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error cargando historias');
            
            const data = await response.json();
            this.historias = data.historias || [];
            
            this.renderizarHistorias();
        } catch (error) {
            console.error('❌ Error cargando historias:', error);
            this.mostrarSinHistorias();
        }
    },
    
    renderizarHistorias() {
        const grid = document.getElementById('historiasGrid');
        const sinHistorias = document.getElementById('sinHistorias');
        const seccion = document.getElementById('historias-corazon');
        
        if (!grid || !seccion) return;
        
        if (this.historias.length === 0) {
            this.mostrarSinHistorias();
            return;
        }
        
        // Mostrar sección
        seccion.style.display = 'block';
        sinHistorias.style.display = 'none';
        
        grid.innerHTML = this.historias.map(historia => `
            <div class="historia-card">
                <div class="historia-header">
                    ${historia.foto_url ? 
                        `<img src="${historia.foto_url}" alt="${historia.nombre_negocio || 'Cliente'}" class="historia-avatar">` :
                        `<div class="historia-avatar" style="background: linear-gradient(135deg, #667eea, #ec4899); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
                            ${(historia.nombre_negocio || 'C').charAt(0).toUpperCase()}
                        </div>`
                    }
                    <div class="historia-info">
                        <h4>${this.escapeHtml(historia.nombre_negocio || 'Emprendedor Cresalia')}</h4>
                        <p>${historia.tipo_vendedor === 'tienda' ? '🏪 Tienda' : historia.tipo_vendedor === 'servicio' ? '🔧 Servicio' : '💼 Emprendedor'}</p>
                    </div>
                </div>
                <div class="historia-contenido">
                    ${this.escapeHtml(historia.historia || '')}
                </div>
                ${historia.consejos ? `
                    <div class="historia-consejos" style="background: #F0F9FF; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <h5 style="color: #1E40AF; margin-bottom: 10px; font-size: 1rem;">
                            <i class="fas fa-lightbulb"></i> Consejos para Emprendedores:
                        </h5>
                        <p style="color: #1E3A8A; line-height: 1.6; margin: 0;">
                            ${this.escapeHtml(historia.consejos)}
                        </p>
                    </div>
                ` : ''}
                ${historia.fecha_publicacion ? 
                    `<p style="color: #94a3b8; font-size: 0.85rem; margin-top: 15px;">
                        <i class="fas fa-calendar"></i> ${new Date(historia.fecha_publicacion).toLocaleDateString('es-AR')}
                    </p>` : ''
                }
            </div>
        `).join('');
    },
    
    mostrarSinHistorias() {
        const grid = document.getElementById('historiasGrid');
        const sinHistorias = document.getElementById('sinHistorias');
        const seccion = document.getElementById('historias-corazon');
        
        if (!grid || !sinHistorias || !seccion) return;
        
        // Solo mostrar si hay historias o si es la primera carga
        if (this.historias.length === 0) {
            seccion.style.display = 'block';
            grid.innerHTML = '';
            sinHistorias.style.display = 'block';
        }
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HistoriasCorazon.init());
} else {
    HistoriasCorazon.init();
}

