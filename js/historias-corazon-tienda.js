// ===== HISTORIAS CON CORAZÓN CRESALIA - PÁGINA DE TIENDA =====
// Carga automáticamente la historia de la tienda según la configuración

const HistoriasCorazonTienda = {
    async init(tiendaId) {
        console.log('💜 Cargando historia de la tienda:', tiendaId);
        
        // Intentar cargar desde múltiples fuentes
        let historia = null;
        
        // 1. Intentar desde API
        try {
            const response = await fetch(`/api/historias-corazon?vendedor_id=${tiendaId}&donde_mostrar=mi_página`);
            
            if (response.ok) {
                const data = await response.json();
                const historias = data.historias || [];
                if (historias.length > 0) {
                    historia = historias[0];
                    console.log('✅ Historia cargada desde API');
                }
            }
        } catch (error) {
            console.log('⚠️ API no disponible, intentando otras fuentes...');
        }
        
        // 2. Si no hay en API, intentar desde localStorage
        if (!historia) {
            try {
                const key = `historia_tienda_${tiendaId}`;
                const historiaGuardada = localStorage.getItem(key);
                if (historiaGuardada) {
                    historia = JSON.parse(historiaGuardada);
                    console.log('✅ Historia cargada desde localStorage');
                }
            } catch (error) {
                console.log('⚠️ Error cargando desde localStorage:', error);
            }
        }
        
        // 3. Si no hay en localStorage, intentar desde Supabase
        if (!historia) {
            try {
                if (window.supabase || window.SUPABASE_CLIENT) {
                    const supabase = window.supabase || window.SUPABASE_CLIENT;
                    const { data, error } = await supabase
                        .from('historias_corazon')
                        .select('*')
                        .eq('vendedor_id', tiendaId)
                        .eq('donde_mostrar', 'mi_página')
                        .eq('activo', true)
                        .limit(1)
                        .single();
                    
                    if (!error && data) {
                        historia = data;
                        console.log('✅ Historia cargada desde Supabase');
                    }
                }
            } catch (error) {
                console.log('⚠️ Error cargando desde Supabase:', error);
            }
        }
        
        // Mostrar historia si existe
        if (historia) {
            this.mostrarHistoria(historia);
        } else {
            console.log('ℹ️ Esta tienda no tiene historia compartida o configurada para mostrarse');
        }
    },
    
    mostrarHistoria(historia) {
        const seccion = document.getElementById('historias-corazon-tienda');
        const container = document.getElementById('historiaTiendaContainer');
        
        if (!seccion || !container) {
            console.warn('⚠️ Sección de historia no encontrada en el DOM');
            return;
        }
        
        // Normalizar campos (diferentes fuentes pueden usar diferentes nombres)
        const nombreNegocio = historia.nombre_negocio || historia.nombre || historia.titulo || 'Nuestra Historia';
        const fotoUrl = historia.foto_url || historia.foto || historia.imagen || null;
        const tipoVendedor = historia.tipo_vendedor || historia.tipo || 'emprendimiento';
        const historiaTexto = historia.historia || historia.contenido || historia.descripcion || '';
        const consejos = historia.consejos || historia.consejos_emprendedores || null;
        const fechaPublicacion = historia.fecha_publicacion || historia.fecha || historia.created_at || null;
        
        // Mostrar sección
        seccion.style.display = 'block';
        
        // Renderizar historia
        container.innerHTML = `
            <div class="historia-tienda-card">
                <div class="historia-tienda-header">
                    ${fotoUrl ? 
                        `<img src="${fotoUrl}" alt="${this.escapeHtml(nombreNegocio)}" class="historia-tienda-avatar">` :
                        `<div class="historia-tienda-avatar" style="background: linear-gradient(135deg, #667eea, #ec4899); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold;">
                            ${nombreNegocio.charAt(0).toUpperCase()}
                        </div>`
                    }
                    <div class="historia-tienda-info">
                        <h3>${this.escapeHtml(nombreNegocio)}</h3>
                        <p>${tipoVendedor === 'tienda' ? '🏪 Tienda' : tipoVendedor === 'servicio' ? '🔧 Servicio' : '💼 Emprendimiento'}</p>
                    </div>
                </div>
                
                ${historiaTexto ? `
                    <div class="historia-tienda-contenido">
                        ${this.escapeHtml(historiaTexto)}
                    </div>
                ` : ''}
                
                ${consejos ? `
                    <div class="historia-tienda-consejos">
                        <h5>
                            <i class="fas fa-lightbulb"></i> Consejos para Emprendedores:
                        </h5>
                        <p>${this.escapeHtml(consejos)}</p>
                    </div>
                ` : ''}
                
                ${fechaPublicacion ? `
                    <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 20px; text-align: center;">
                        <i class="fas fa-calendar"></i> Publicado el ${new Date(fechaPublicacion).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                ` : ''}
            </div>
        `;
        
        console.log('✅ Historia mostrada correctamente');
    },
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};



