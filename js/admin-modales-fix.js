// ========================================
// CORRECCIÓN DE MODALES - PANEL DE ADMIN
// ========================================

console.log('🔧 Iniciando corrección de modales...');

// ========================================
// 1. MI ESPACIO (Diario Emocional)
// ========================================

function abrirDiarioEmocional() {
    console.log('✅ Abriendo Mi Espacio...');
    
    // Buscar si ya existe el modal
    let modal = document.getElementById('diarioModal');
    
    if (modal) {
        // Si existe, solo mostrarlo
        modal.style.display = 'flex';
        modal.classList.add('show');
    } else {
        // Si no existe, crearlo e insertarlo
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = crearModalDiario();
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Mostrar modal
        modal = document.getElementById('diarioModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
            
            // Configurar botones de emociones
            configurarBotonesEmociones();
            
            // Configurar formulario
            const form = document.getElementById('diarioForm');
            if (form) {
                form.addEventListener('submit', guardarDiarioEmocional);
            }
        }
    }
    
    mostrarNotificacion('📝 Abriendo Mi Espacio Personal', 'info');
}

function crearModalDiario() {
    return `
        <div id="diarioModal" class="modal" style="display: flex; z-index: 99999 !important;">
            <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3><i class="fas fa-heart"></i> Mi Espacio Personal</h3>
                    <button class="close-btn" onclick="cerrarDiarioEmocional()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="color: #6B7280; margin-bottom: 20px; text-align: center;">
                        Un espacio seguro para reflexionar sobre tu día como emprendedor/a
                    </p>
                    
                    <form id="diarioForm">
                        <div class="form-group">
                            <label for="emocionSeleccionada"><i class="fas fa-smile"></i> ¿Cómo te sientes hoy?</label>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-top: 10px;">
                                <button type="button" class="emocion-btn" data-emocion="feliz" style="padding: 15px; border-radius: 10px; border: 2px solid #10B981; background: #DCFCE7; cursor: pointer; transition: all 0.3s;">
                                    <div style="font-size: 24px;">😊</div>
                                    <div style="font-size: 12px; margin-top: 5px;">Feliz</div>
                                </button>
                                <button type="button" class="emocion-btn" data-emocion="motivado" style="padding: 15px; border-radius: 10px; border: 2px solid #F59E0B; background: #FEF3C7; cursor: pointer; transition: all 0.3s;">
                                    <div style="font-size: 24px;">🚀</div>
                                    <div style="font-size: 12px; margin-top: 5px;">Motivado</div>
                                </button>
                                <button type="button" class="emocion-btn" data-emocion="neutral" style="padding: 15px; border-radius: 10px; border: 2px solid #6B7280; background: #F3F4F6; cursor: pointer; transition: all 0.3s;">
                                    <div style="font-size: 24px;">😐</div>
                                    <div style="font-size: 12px; margin-top: 5px;">Neutral</div>
                                </button>
                                <button type="button" class="emocion-btn" data-emocion="estresado" style="padding: 15px; border-radius: 10px; border: 2px solid #EF4444; background: #FEE2E2; cursor: pointer; transition: all 0.3s;">
                                    <div style="font-size: 24px;">😰</div>
                                    <div style="font-size: 12px; margin-top: 5px;">Estresado</div>
                                </button>
                                <button type="button" class="emocion-btn" data-emocion="preocupado" style="padding: 15px; border-radius: 10px; border: 2px solid #DC2626; background: #FEF2F2; cursor: pointer; transition: all 0.3s;">
                                    <div style="font-size: 24px;">😟</div>
                                    <div style="font-size: 12px; margin-top: 5px;">Preocupado</div>
                                </button>
                            </div>
                            <input type="hidden" id="emocionSeleccionada" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="diarioReflexion">
                                <i class="fas fa-pen"></i> ¿Qué pasó hoy?
                            </label>
                            <textarea id="diarioReflexion" class="form-control" rows="4" 
                                      placeholder="Escribe libremente sobre tu día, tus pensamientos, tus experiencias..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="diarioLogros">
                                <i class="fas fa-trophy"></i> Logros de hoy (opcional)
                            </label>
                            <textarea id="diarioLogros" class="form-control" rows="2" 
                                      placeholder="¿Qué lograste hoy? Por pequeño que sea..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="diarioDesafios">
                                <i class="fas fa-mountain"></i> Desafíos enfrentados (opcional)
                            </label>
                            <textarea id="diarioDesafios" class="form-control" rows="2" 
                                      placeholder="¿Qué obstáculos encontraste?"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="diarioGratitud">
                                <i class="fas fa-heart"></i> ¿Por qué estás agradecido/a hoy? (opcional)
                            </label>
                            <textarea id="diarioGratitud" class="form-control" rows="2" 
                                      placeholder="Tres cosas por las que te sientes agradecido/a..."></textarea>
                        </div>
                        
                        <div class="modal-footer" style="margin-top: 20px;">
                            <button type="button" class="btn btn-secondary" onclick="cerrarDiarioEmocional()">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Guardar Entrada
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function configurarBotonesEmociones() {
    const botones = document.querySelectorAll('.emocion-btn');
    botones.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover selección de todos
            botones.forEach(b => {
                b.style.transform = 'scale(1)';
                b.style.boxShadow = 'none';
            });
            
            // Seleccionar este
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            
            // Guardar selección
            const emocion = this.getAttribute('data-emocion');
            document.getElementById('emocionSeleccionada').value = emocion;
        });
    });
}

function cerrarDiarioEmocional() {
    const modal = document.getElementById('diarioModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

function guardarDiarioEmocional(event) {
    event.preventDefault();
    
    const tiendaActual = JSON.parse(localStorage.getItem('tienda_actual') || '{}');
    
    const entrada = {
        id: 'diario-' + Date.now(),
        fecha: new Date().toISOString(),
        emocion: document.getElementById('emocionSeleccionada').value,
        reflexion: document.getElementById('diarioReflexion').value,
        logros: document.getElementById('diarioLogros').value || '',
        desafios: document.getElementById('diarioDesafios').value || '',
        gratitud: document.getElementById('diarioGratitud').value || '',
        tienda_id: tiendaActual.id
    };
    
    // Guardar en localStorage
    let diarios = JSON.parse(localStorage.getItem('diarios_emocionales') || '[]');
    diarios.push(entrada);
    localStorage.setItem('diarios_emocionales', JSON.stringify(diarios));
    
    mostrarNotificacion('✅ Entrada guardada en tu diario personal', 'success');
    cerrarDiarioEmocional();
    
    console.log('✅ Diario guardado:', entrada);
}

// ========================================
// 2. VER PRODUCTOS (Lista actual)
// ========================================

function verProductosActuales() {
    console.log('📦 Abriendo lista de productos...');
    
    const tiendaActual = JSON.parse(localStorage.getItem('tienda_actual') || '{}');
    const tiendaId = tiendaActual.id || 'demo';
    const productos = JSON.parse(localStorage.getItem('productos_' + tiendaId) || '[]');
    
    if (productos.length === 0) {
        mostrarNotificacion('ℹ️ No tienes productos aún. Agrega tu primer producto!', 'info');
        // Abrir modal de agregar producto
        if (typeof mostrarFormularioProducto === 'function') {
            setTimeout(() => mostrarFormularioProducto(), 500);
        }
        return;
    }
    
    // Crear modal con lista
    const modalHTML = `
        <div id="listaProductosModal" class="modal" style="display: flex; z-index: 99999;">
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3><i class="fas fa-boxes"></i> Mis Productos (${productos.length})</h3>
                    <button class="close-btn" onclick="cerrarListaProductos()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; gap: 15px;">
                        ${productos.map(prod => `
                            <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 15px; display: flex; gap: 15px; align-items: center;">
                                ${prod.imagen ? 
                                    `<img src="${prod.imagen}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">` : 
                                    `<div style="width: 80px; height: 80px; background: #F3F4F6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-box fa-2x" style="color: #9CA3AF;"></i>
                                    </div>`
                                }
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 5px 0; color: #1F2937;">${prod.nombre}</h4>
                                    <p style="margin: 0 0 5px 0; color: #6B7280; font-size: 14px;">${prod.descripcion || 'Sin descripción'}</p>
                                    <div style="display: flex; gap: 10px; align-items: center;">
                                        <span style="font-size: 18px; font-weight: bold; color: #7C3AED;">$${prod.precio}</span>
                                        <span style="background: #E5E7EB; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                            ${prod.categoria}
                                        </span>
                                        ${prod.destacado ? '<span style="color: #F59E0B;">⭐ Destacado</span>' : ''}
                                        ${prod.oferta ? '<span style="color: #EF4444;">🏷️ Oferta</span>' : ''}
                                        ${prod.nuevo ? '<span style="color: #10B981;">🆕 Nuevo</span>' : ''}
                                    </div>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 5px;">
                                    <button class="btn btn-sm btn-secondary" onclick="editarProducto('${prod.id}')" style="font-size: 12px; padding: 5px 10px;">
                                        <i class="fas fa-edit"></i> Editar
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${prod.id}')" style="font-size: 12px; padding: 5px 10px;">
                                        <i class="fas fa-trash"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insertar modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);
}

function cerrarListaProductos() {
    const modal = document.getElementById('listaProductosModal');
    if (modal) {
        modal.remove();
    }
}

function editarProducto(id) {
    mostrarNotificacion('🔧 Función de edición (próximamente)', 'info');
    console.log('Editar producto:', id);
}

function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    const tiendaActual = JSON.parse(localStorage.getItem('tienda_actual') || '{}');
    const tiendaId = tiendaActual.id || 'demo';
    let productos = JSON.parse(localStorage.getItem('productos_' + tiendaId) || '[]');
    
    productos = productos.filter(p => p.id !== id);
    localStorage.setItem('productos_' + tiendaId, JSON.stringify(productos));
    
    mostrarNotificacion('✅ Producto eliminado', 'success');
    
    // Cerrar y reabrir para refrescar
    cerrarListaProductos();
    setTimeout(() => verProductosActuales(), 300);
}

// ========================================
// 3. OFERTAS
// ========================================

function mostrarFormularioOferta() {
    mostrarNotificacion('🏷️ Sistema de ofertas (próximamente)', 'info');
    console.log('Modal de ofertas en desarrollo...');
}

// ========================================
// HACER FUNCIONES GLOBALES
// ========================================

window.abrirDiarioEmocional = abrirDiarioEmocional;
window.cerrarDiarioEmocional = cerrarDiarioEmocional;
window.guardarDiarioEmocional = guardarDiarioEmocional;
window.verProductosActuales = verProductosActuales;
window.cerrarListaProductos = cerrarListaProductos;
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
window.mostrarFormularioOferta = mostrarFormularioOferta;

console.log('✅ Todos los modales corregidos y listos');

