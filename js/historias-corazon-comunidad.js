// ===== HISTORIAS CON CORAZÓN CRESALIA - COMUNIDAD DE VENDEDORES =====
// Carga automáticamente las historias que deben mostrarse en la comunidad

const HistoriasCorazonComunidad = {
    historias: [],
    
    async init() {
        console.log('💜 Cargando historias para comunidad de vendedores');
        await this.cargarHistorias();
    },
    
    async cargarHistorias() {
        try {
            // Cargar historias que deben mostrarse en "solo_vendedores" o "página_principal"
            const response = await fetch('/api/historias-corazon?publicas=true&donde_mostrar=solo_vendedores');
            
            if (!response.ok) {
                console.log('⚠️ No se pudieron cargar las historias');
                this.mostrarSinHistorias();
                return;
            }
            
            const data = await response.json();
            this.historias = data.historias || [];
            
            if (this.historias.length > 0) {
                this.renderizarHistorias();
            } else {
                this.mostrarSinHistorias();
            }
        } catch (error) {
            console.error('❌ Error cargando historias:', error);
            this.mostrarSinHistorias();
        }
    },
    
    renderizarHistorias() {
        const seccion = document.getElementById('historias-comunidad-section');
        const grid = document.getElementById('historiasComunidadGrid');
        const sinHistorias = document.getElementById('sinHistoriasComunidad');
        
        if (!seccion || !grid) return;
        
        // Mostrar sección
        seccion.style.display = 'block';
        if (sinHistorias) sinHistorias.style.display = 'none';
        
        // Renderizar historias
        grid.innerHTML = this.historias.map(historia => `
            <div class="historia-comunidad-card">
                <div class="historia-comunidad-header">
                    ${historia.foto_url ? 
                        `<img src="${historia.foto_url}" alt="${historia.nombre_negocio || 'Emprendedor'}" class="historia-comunidad-avatar">` :
                        `<div class="historia-comunidad-avatar" style="background: linear-gradient(135deg, #667eea, #ec4899); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; font-weight: bold;">
                            ${(historia.nombre_negocio || 'E').charAt(0).toUpperCase()}
                        </div>`
                    }
                    <div class="historia-comunidad-info">
                        <h4>${this.escapeHtml(historia.nombre_negocio || 'Emprendedor Cresalia')}</h4>
                        <p>${historia.tipo_vendedor === 'tienda' ? '🏪 Tienda' : historia.tipo_vendedor === 'servicio' ? '🔧 Servicio' : '💼 Emprendedor'}</p>
                    </div>
                </div>
                
                <div class="historia-comunidad-contenido">
                    ${this.escapeHtml(historia.historia || '').substring(0, 200)}${historia.historia && historia.historia.length > 200 ? '...' : ''}
                </div>
                
                ${historia.consejos ? `
                    <div class="historia-comunidad-consejos">
                        <h6>
                            <i class="fas fa-lightbulb"></i> Consejos:
                        </h6>
                        <p>${this.escapeHtml(historia.consejos).substring(0, 150)}${historia.consejos.length > 150 ? '...' : ''}</p>
                    </div>
                ` : ''}
                
                ${historia.fecha_publicacion ? `
                    <p style="color: #94a3b8; font-size: 0.8rem; margin-top: 10px; text-align: right;">
                        <i class="fas fa-calendar"></i> ${new Date(historia.fecha_publicacion).toLocaleDateString('es-AR')}
                    </p>
                ` : ''}
            </div>
        `).join('');
    },
    
    mostrarSinHistorias() {
        const seccion = document.getElementById('historias-comunidad-section');
        const grid = document.getElementById('historiasComunidadGrid');
        const sinHistorias = document.getElementById('sinHistoriasComunidad');
        
        if (!seccion) return;
        
        // Mostrar sección aunque no haya historias (para que se vea el mensaje)
        seccion.style.display = 'block';
        if (grid) grid.innerHTML = '';
        if (sinHistorias) sinHistorias.style.display = 'block';
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};



