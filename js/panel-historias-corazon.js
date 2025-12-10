// ===== PANEL: HISTORIAS CON CORAZÓN CRESALIA =====
// Para que vendedores/emprendedores/servicios compartan su historia

class PanelHistoriasCorazon {
    constructor() {
        this.vendedorId = null;
        this.tipoVendedor = null;
        this.historiaActual = null;
    }
    
    async init(vendedorId, tipoVendedor) {
        this.vendedorId = vendedorId;
        this.tipoVendedor = tipoVendedor || 'tienda';
        
        await this.cargarHistoria();
        this.configurarEventos();
    }
    
    async cargarHistoria() {
        try {
            // Si no hay vendedor_id, no intentar cargar
            if (!this.vendedorId) {
                console.log('⚠️ No hay vendedor_id, mostrando formulario vacío');
                this.renderizarFormulario();
                return;
            }
            
            const response = await fetch(`/api/historias-corazon?vendedor_id=${this.vendedorId}`);
            if (!response.ok) {
                // Si la API no está disponible, continuar con formulario vacío
                console.warn('⚠️ API no disponible, mostrando formulario vacío');
                this.renderizarFormulario();
                return;
            }
            
            const data = await response.json();
            this.historiaActual = data.historias && data.historias.length > 0 ? data.historias[0] : null;
            
            this.renderizarFormulario();
        } catch (error) {
            console.warn('⚠️ Error cargando historia (continuando con formulario vacío):', error);
            this.renderizarFormulario();
        }
    }
    
    renderizarFormulario() {
        const container = document.getElementById('seccion-historias-corazon');
        if (!container) return;
        
        const historia = this.historiaActual;
        
        container.innerHTML = `
            <div class="historias-panel-container">
                <div class="historias-header">
                    <h2><i class="fas fa-heart"></i> Mi Historia con Corazón Cresalia</h2>
                    <p>Compartí tu historia de emprendimiento y ayudá a otros que están empezando</p>
                </div>
                
                <form id="formHistoriaCorazon" class="historias-form">
                    <div class="form-group">
                        <label for="nombreNegocio">
                            <i class="fas fa-store"></i> Nombre de tu Negocio/Emprendimiento
                        </label>
                        <input 
                            type="text" 
                            id="nombreNegocio" 
                            value="${historia?.nombre_negocio || ''}"
                            placeholder="Ej: Mi Tienda, Mi Servicio, Mi Emprendimiento"
                            required
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="historiaTexto">
                            <i class="fas fa-book"></i> Tu Historia *
                        </label>
                        <textarea 
                            id="historiaTexto" 
                            rows="8"
                            placeholder="Contanos tu historia... ¿Cómo empezaste? ¿Qué te motivó? ¿Qué desafíos enfrentaste? ¿Cómo Cresalia te ayudó?"
                            required
                        >${historia?.historia || ''}</textarea>
                        <small>Compartí tu experiencia para inspirar a otros emprendedores</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="consejos">
                            <i class="fas fa-lightbulb"></i> Consejos para Otros (Opcional pero Recomendado)
                        </label>
                        <textarea 
                            id="consejos" 
                            rows="5"
                            placeholder="¿Qué consejos le darías a alguien que está empezando? Esto puede ayudar mucho a quienes tienen miedo o dudas..."
                        >${historia?.consejos || ''}</textarea>
                        <small style="color: #7C3AED; font-weight: 500;">
                            💡 <strong>Te alentamos a compartir consejos</strong> - Pueden ayudar mucho a quienes están empezando y tienen miedo
                        </small>
                    </div>
                    
                    <div class="form-group">
                        <label for="fotoHistoria">
                            <i class="fas fa-image"></i> Foto de tu Negocio/Equipo (Opcional)
                        </label>
                        <input 
                            type="file" 
                            id="fotoHistoria" 
                            accept="image/*"
                            onchange="panelHistorias.mostrarPreviewFoto(event)"
                        >
                        <div id="previewFoto" class="preview-foto" style="display: ${historia?.foto_url ? 'block' : 'none'};">
                            ${historia?.foto_url ? `<img src="${historia.foto_url}" alt="Foto actual">` : ''}
                        </div>
                        <small>Subí una foto relacionada con tu negocio o equipo</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="dondeMostrar">
                            <i class="fas fa-eye"></i> ¿Dónde Mostrar tu Historia?
                        </label>
                        <select id="dondeMostrar" required>
                            <option value="página_principal" ${historia?.donde_mostrar === 'página_principal' ? 'selected' : ''}>
                                📱 Página Principal de Cresalia
                            </option>
                            <option value="mi_página" ${historia?.donde_mostrar === 'mi_página' ? 'selected' : ''}>
                                🏪 Solo en mi Página de Tienda/Servicio
                            </option>
                            <option value="solo_vendedores" ${historia?.donde_mostrar === 'solo_vendedores' ? 'selected' : ''}>
                                👥 Solo en Comunidad de Vendedores
                            </option>
                            <option value="ninguna" ${historia?.donde_mostrar === 'ninguna' ? 'selected' : ''}>
                                🔒 No mostrar públicamente (solo para mí)
                            </option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input 
                                type="checkbox" 
                                id="historiaPublica" 
                                ${historia?.publica !== false ? 'checked' : ''}
                            >
                            <span>Hacer mi historia pública</span>
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-guardar-historia">
                            <i class="fas fa-save"></i> ${historia ? 'Actualizar' : 'Guardar'} Historia
                        </button>
                        ${historia ? `
                            <button type="button" class="btn-eliminar-historia" onclick="panelHistorias.eliminarHistoria()">
                                <i class="fas fa-trash"></i> Eliminar Historia
                            </button>
                        ` : ''}
                    </div>
                </form>
            </div>
        `;
    }
    
    configurarEventos() {
        const form = document.getElementById('formHistoriaCorazon');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.guardarHistoria();
            });
        }
    }
    
    mostrarPreviewFoto(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('previewFoto');
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
    
    async subirFoto(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('tipo', 'historia');
            formData.append('vendedor_id', this.vendedorId);
            
            const response = await fetch('/api/subir-archivo', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Error subiendo foto');
            
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Error subiendo foto:', error);
            return null;
        }
    }
    
    async guardarHistoria() {
        const nombreNegocio = document.getElementById('nombreNegocio')?.value;
        const historiaTexto = document.getElementById('historiaTexto')?.value;
        const consejos = document.getElementById('consejos')?.value;
        const dondeMostrar = document.getElementById('dondeMostrar')?.value;
        const publica = document.getElementById('historiaPublica')?.checked;
        const fotoInput = document.getElementById('fotoHistoria');
        
        if (!historiaTexto) {
            alert('Por favor, completá tu historia');
            return;
        }
        
        let fotoUrl = this.historiaActual?.foto_url || null;
        
        // Subir foto si hay una nueva
        if (fotoInput?.files && fotoInput.files.length > 0) {
            const nuevaFoto = await this.subirFoto(fotoInput.files[0]);
            if (nuevaFoto) {
                fotoUrl = nuevaFoto;
            }
        }
        
        try {
            const response = await fetch('/api/historias-corazon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vendedor_id: this.vendedorId,
                    tipo_vendedor: this.tipoVendedor,
                    nombre_negocio: nombreNegocio,
                    historia: historiaTexto,
                    consejos: consejos || null,
                    foto_url: fotoUrl,
                    donde_mostrar: dondeMostrar,
                    publica: publica
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error guardando historia');
            }
            
            const data = await response.json();
            this.historiaActual = data.historia;
            
            alert('✅ Historia guardada correctamente');
            await this.cargarHistoria();
        } catch (error) {
            console.error('Error guardando historia:', error);
            alert('❌ Error: ' + error.message);
        }
    }
    
    async eliminarHistoria() {
        if (!this.historiaActual) return;
        
        if (!confirm('¿Estás seguro de que querés eliminar tu historia?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/historias-corazon?historia_id=${this.historiaActual.id}&vendedor_id=${this.vendedorId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Error eliminando historia');
            
            this.historiaActual = null;
            alert('✅ Historia eliminada correctamente');
            await this.cargarHistoria();
        } catch (error) {
            console.error('Error eliminando historia:', error);
            alert('❌ Error: ' + error.message);
        }
    }
}

// Instancia global
const panelHistorias = new PanelHistoriasCorazon();



