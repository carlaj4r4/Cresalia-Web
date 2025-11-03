// ===== SISTEMA FAQ PERSONALIZABLE - CRESALIA =====
// Sistema de FAQ que se adapta según el plan del cliente

console.log('❓ Inicializando sistema FAQ Cresalia...');

class FAQSystem {
    constructor() {
        this.currentPlan = 'free';
        this.faqData = {
            preguntas: [],
            categorias: []
        };
        this.cargarConfiguracion();
    }

    // ===== CONFIGURACIÓN POR PLAN =====
    cargarConfiguracion() {
        const planData = localStorage.getItem('cresalia_current_plan') || 'free';
        this.currentPlan = planData;
        this.cargarFAQDesdeLocalStorage();
    }

    // ===== CARGAR FAQ DESDE LOCALSTORAGE =====
    cargarFAQDesdeLocalStorage() {
        const faqData = localStorage.getItem(`cresalia_faq_${this.currentPlan}`);
        if (faqData) {
            this.faqData = JSON.parse(faqData);
        } else {
            this.inicializarFAQBasico();
        }
    }

    // ===== INICIALIZAR FAQ BÁSICO SEGÚN PLAN =====
    inicializarFAQBasico() {
        const planConfig = PLANES_CONFIG[this.currentPlan];
        
        if (!planConfig || !planConfig.faq_config) {
            console.error('❌ Configuración de FAQ no encontrada para el plan:', this.currentPlan);
            return;
        }

        const faqConfig = planConfig.faq_config;

        if (faqConfig.tipo === 'basico') {
            this.inicializarFAQBasico();
        } else if (faqConfig.tipo === 'basico_plus') {
            this.inicializarFAQBasicoPlus();
        } else if (faqConfig.tipo === 'avanzado') {
            this.inicializarFAQAvanzado();
        } else if (faqConfig.tipo === 'enterprise') {
            this.inicializarFAQEnterprise();
        }
    }

    // ===== FAQ BÁSICO (FREE) =====
    inicializarFAQBasico() {
        this.faqData = {
            preguntas: [
                {
                    id: 1,
                    pregunta: "¿Cómo puedo hacer un pedido?",
                    respuesta: "Para hacer un pedido, simplemente navega por nuestros productos, selecciona los que deseas y haz clic en 'Agregar al carrito'. Luego procede al checkout para completar tu compra.",
                    categoria: "Compras",
                    editable: false
                },
                {
                    id: 2,
                    pregunta: "¿Cuáles son los métodos de pago disponibles?",
                    respuesta: "Aceptamos tarjetas de crédito, débito, PayPal y transferencias bancarias. Todos los pagos son procesados de forma segura.",
                    categoria: "Pagos",
                    editable: false
                },
                {
                    id: 3,
                    pregunta: "¿Cuánto tiempo tarda el envío?",
                    respuesta: "Los envíos estándar tardan entre 3-5 días hábiles. Los envíos express están disponibles por un costo adicional y tardan 1-2 días hábiles.",
                    categoria: "Envíos",
                    editable: false
                },
                {
                    id: 4,
                    pregunta: "¿Puedo devolver un producto?",
                    respuesta: "Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar en condiciones originales.",
                    categoria: "Devoluciones",
                    editable: false
                },
                {
                    id: 5,
                    pregunta: "¿Cómo puedo contactar con el soporte?",
                    respuesta: "Puedes contactarnos por email a soporte@cresalia.com o usar el formulario de contacto en nuestra página.",
                    categoria: "Soporte",
                    editable: false
                }
            ],
            categorias: ["Compras", "Pagos", "Envíos", "Devoluciones", "Soporte"]
        };
    }

    // ===== FAQ BÁSICO PLUS (STARTER) =====
    inicializarFAQBasicoPlus() {
        this.inicializarFAQBasico();
        
        // Agregar algunas preguntas personalizables
        this.faqData.preguntas.push(
            {
                id: 6,
                pregunta: "¿Ofrecen descuentos por volumen?",
                respuesta: "Sí, ofrecemos descuentos especiales para pedidos grandes. Contacta con nosotros para más información.",
                categoria: "Descuentos",
                editable: true
            },
            {
                id: 7,
                pregunta: "¿Tienen programa de fidelidad?",
                respuesta: "Tenemos un programa de puntos donde acumulas créditos con cada compra que puedes usar en futuras compras.",
                categoria: "Fidelidad",
                editable: true
            }
        );
        
        this.faqData.categorias.push("Descuentos", "Fidelidad");
    }

    // ===== FAQ AVANZADO (PRO) =====
    inicializarFAQAvanzado() {
        this.inicializarFAQBasicoPlus();
        
        // Agregar más preguntas personalizables
        this.faqData.preguntas.push(
            {
                id: 8,
                pregunta: "¿Puedo personalizar mis productos?",
                respuesta: "Sí, ofrecemos servicios de personalización. Contacta con nosotros para discutir tus necesidades específicas.",
                categoria: "Personalización",
                editable: true
            },
            {
                id: 9,
                pregunta: "¿Tienen garantía extendida?",
                respuesta: "Ofrecemos garantía extendida en productos seleccionados. Consulta los detalles en cada producto.",
                categoria: "Garantías",
                editable: true
            }
        );
        
        this.faqData.categorias.push("Personalización", "Garantías");
    }

    // ===== FAQ ENTERPRISE =====
    inicializarFAQEnterprise() {
        this.inicializarFAQAvanzado();
        
        // FAQ completamente personalizable
        this.faqData.preguntas = this.faqData.preguntas.map(pregunta => ({
            ...pregunta,
            editable: true
        }));
        
        // Agregar categorías personalizadas
        this.faqData.categorias.push("Enterprise", "API", "Integraciones");
    }

    // ===== MOSTRAR FAQ =====
    mostrarFAQ() {
        const faqContainer = document.getElementById('faq-container');
        if (!faqContainer) return;

        let html = `
            <div class="faq-header">
                <h3>❓ Preguntas Frecuentes</h3>
                ${this.puedeEditarFAQ() ? `
                    <button class="btn-editar-faq" onclick="faqSystem.editarFAQ()">
                        <i class="fas fa-edit"></i> Editar FAQ
                    </button>
                ` : ''}
            </div>
            <div class="faq-content">
        `;

        // Agrupar por categorías
        const categorias = [...new Set(this.faqData.preguntas.map(p => p.categoria))];
        
        categorias.forEach(categoria => {
            const preguntasCategoria = this.faqData.preguntas.filter(p => p.categoria === categoria);
            
            html += `
                <div class="faq-categoria">
                    <h4 class="categoria-titulo">${categoria}</h4>
                    <div class="preguntas-container">
            `;
            
            preguntasCategoria.forEach(pregunta => {
                html += `
                    <div class="pregunta-item">
                        <div class="pregunta-header" onclick="faqSystem.togglePregunta(${pregunta.id})">
                            <span class="pregunta-texto">${pregunta.pregunta}</span>
                            <span class="pregunta-icon">+</span>
                            ${pregunta.editable ? '<span class="editable-badge">Editable</span>' : ''}
                        </div>
                        <div class="pregunta-respuesta" id="respuesta-${pregunta.id}">
                            <p>${pregunta.respuesta}</p>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });

        html += `
            </div>
        `;

        faqContainer.innerHTML = html;
    }

    // ===== TOGGLE PREGUNTA =====
    togglePregunta(id) {
        const respuesta = document.getElementById(`respuesta-${id}`);
        const icon = document.querySelector(`[onclick="faqSystem.togglePregunta(${id})"] .pregunta-icon`);
        
        if (respuesta.style.display === 'block') {
            respuesta.style.display = 'none';
            icon.textContent = '+';
        } else {
            respuesta.style.display = 'block';
            icon.textContent = '-';
        }
    }

    // ===== EDITAR FAQ =====
    editarFAQ() {
        if (!this.puedeEditarFAQ()) {
            alert('Tu plan actual no permite editar el FAQ. Actualiza tu plan para personalizar las preguntas y respuestas.');
            return;
        }

        const modal = this.crearModalEdicion();
        document.body.appendChild(modal);
    }

    // ===== CREAR MODAL DE EDICIÓN =====
    crearModalEdicion() {
        const modal = document.createElement('div');
        modal.className = 'modal-faq-editor';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>✏️ Editar FAQ</h3>
                    <button class="btn-cerrar" onclick="this.closest('.modal-faq-editor').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="faq-editor-tabs">
                        <button class="tab-btn active" onclick="faqSystem.mostrarTab('preguntas')">Preguntas</button>
                        <button class="tab-btn" onclick="faqSystem.mostrarTab('categorias')">Categorías</button>
                        <button class="tab-btn" onclick="faqSystem.mostrarTab('agregar')">Agregar Nueva</button>
                    </div>
                    <div class="faq-editor-content">
                        <div id="tab-preguntas" class="tab-content active">
                            ${this.generarListaPreguntasEditable()}
                        </div>
                        <div id="tab-categorias" class="tab-content">
                            ${this.generarListaCategoriasEditable()}
                        </div>
                        <div id="tab-agregar" class="tab-content">
                            ${this.generarFormularioNuevaPregunta()}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-guardar" onclick="faqSystem.guardarFAQ()">Guardar Cambios</button>
                    <button class="btn-cancelar" onclick="this.closest('.modal-faq-editor').remove()">Cancelar</button>
                </div>
            </div>
        `;
        return modal;
    }

    // ===== GENERAR LISTA DE PREGUNTAS EDITABLE =====
    generarListaPreguntasEditable() {
        return this.faqData.preguntas.map(pregunta => `
            <div class="pregunta-editable">
                <div class="pregunta-controls">
                    <select onchange="faqSystem.cambiarCategoria(${pregunta.id}, this.value)">
                        ${this.faqData.categorias.map(cat => 
                            `<option value="${cat}" ${cat === pregunta.categoria ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                    ${pregunta.editable ? `
                        <button class="btn-editar" onclick="faqSystem.editarPregunta(${pregunta.id})">Editar</button>
                        <button class="btn-eliminar" onclick="faqSystem.eliminarPregunta(${pregunta.id})">Eliminar</button>
                    ` : '<span class="no-editable">No editable</span>'}
                </div>
                <div class="pregunta-preview">
                    <strong>P:</strong> ${pregunta.pregunta}<br>
                    <strong>R:</strong> ${pregunta.respuesta.substring(0, 100)}...
                </div>
            </div>
        `).join('');
    }

    // ===== GENERAR LISTA DE CATEGORÍAS EDITABLE =====
    generarListaCategoriasEditable() {
        return `
            <div class="categorias-editor">
                <h4>Categorías Actuales:</h4>
                ${this.faqData.categorias.map(categoria => `
                    <div class="categoria-item">
                        <span>${categoria}</span>
                        <button class="btn-eliminar" onclick="faqSystem.eliminarCategoria('${categoria}')">Eliminar</button>
                    </div>
                `).join('')}
                <div class="agregar-categoria">
                    <input type="text" id="nueva-categoria" placeholder="Nueva categoría">
                    <button onclick="faqSystem.agregarCategoria()">Agregar</button>
                </div>
            </div>
        `;
    }

    // ===== GENERAR FORMULARIO NUEVA PREGUNTA =====
    generarFormularioNuevaPregunta() {
        return `
            <div class="nueva-pregunta-form">
                <h4>Agregar Nueva Pregunta</h4>
                <div class="form-group">
                    <label>Categoría:</label>
                    <select id="categoria-nueva">
                        ${this.faqData.categorias.map(cat => 
                            `<option value="${cat}">${cat}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Pregunta:</label>
                    <input type="text" id="pregunta-nueva" placeholder="Escribe tu pregunta">
                </div>
                <div class="form-group">
                    <label>Respuesta:</label>
                    <textarea id="respuesta-nueva" placeholder="Escribe la respuesta"></textarea>
                </div>
                <button class="btn-agregar" onclick="faqSystem.agregarPregunta()">Agregar Pregunta</button>
            </div>
        `;
    }

    // ===== FUNCIONES DE EDICIÓN =====
    puedeEditarFAQ() {
        const planConfig = PLANES_CONFIG[this.currentPlan];
        return planConfig && planConfig.faq_config && planConfig.faq_config.preguntas_custom;
    }

    guardarFAQ() {
        localStorage.setItem(`cresalia_faq_${this.currentPlan}`, JSON.stringify(this.faqData));
        this.mostrarFAQ();
        document.querySelector('.modal-faq-editor')?.remove();
        
        // Notificar al usuario
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('FAQ actualizado correctamente', 'success');
        }
    }

    editarPregunta(id) {
        const pregunta = this.faqData.preguntas.find(p => p.id === id);
        if (!pregunta) return;

        const nuevaPregunta = prompt('Nueva pregunta:', pregunta.pregunta);
        const nuevaRespuesta = prompt('Nueva respuesta:', pregunta.respuesta);
        
        if (nuevaPregunta && nuevaRespuesta) {
            pregunta.pregunta = nuevaPregunta;
            pregunta.respuesta = nuevaRespuesta;
        }
    }

    eliminarPregunta(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
            this.faqData.preguntas = this.faqData.preguntas.filter(p => p.id !== id);
        }
    }

    agregarPregunta() {
        const categoria = document.getElementById('categoria-nueva').value;
        const pregunta = document.getElementById('pregunta-nueva').value;
        const respuesta = document.getElementById('respuesta-nueva').value;
        
        if (!pregunta || !respuesta) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        const nuevaPregunta = {
            id: Date.now(),
            pregunta: pregunta,
            respuesta: respuesta,
            categoria: categoria,
            editable: true
        };
        
        this.faqData.preguntas.push(nuevaPregunta);
        
        // Limpiar formulario
        document.getElementById('pregunta-nueva').value = '';
        document.getElementById('respuesta-nueva').value = '';
    }

    agregarCategoria() {
        const nuevaCategoria = document.getElementById('nueva-categoria').value.trim();
        if (!nuevaCategoria) return;
        
        if (!this.faqData.categorias.includes(nuevaCategoria)) {
            this.faqData.categorias.push(nuevaCategoria);
            document.getElementById('nueva-categoria').value = '';
        }
    }

    eliminarCategoria(categoria) {
        if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria}"?`)) {
            this.faqData.categorias = this.faqData.categorias.filter(c => c !== categoria);
            this.faqData.preguntas = this.faqData.preguntas.filter(p => p.categoria !== categoria);
        }
    }

    mostrarTab(tabName) {
        // Ocultar todos los tabs
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        // Mostrar el tab seleccionado
        document.getElementById(`tab-${tabName}`).classList.add('active');
        document.querySelector(`[onclick="faqSystem.mostrarTab('${tabName}')"]`).classList.add('active');
    }
}

// ===== INICIALIZAR SISTEMA FAQ =====
let faqSystem;
document.addEventListener('DOMContentLoaded', function() {
    faqSystem = new FAQSystem();
    
    // Mostrar FAQ si el contenedor existe
    if (document.getElementById('faq-container')) {
        faqSystem.mostrarFAQ();
    }
});

// ===== EXPORTAR PARA USO GLOBAL =====
window.faqSystem = faqSystem;






















