// ===== BÚSQUEDA INTELIGENTE - CRESALIA =====
// Búsqueda de productos con autocompletado y filtros avanzados

class BusquedaInteligente {
    constructor(tenantSlug, productos) {
        this.tenantSlug = tenantSlug;
        this.productos = productos || [];
        this.indicesBusqueda = this.construirIndices();
    }

    // Construir índices de búsqueda
    construirIndices() {
        return this.productos.map(producto => ({
            id: producto.id,
            textoCompleto: `${producto.nombre} ${producto.descripcion} ${producto.categoria_nombre} ${producto.tags || ''}`.toLowerCase(),
            nombre: producto.nombre.toLowerCase(),
            categoria: (producto.categoria_nombre || '').toLowerCase(),
            precio: producto.precio,
            stock: producto.stock,
            destacado: producto.destacado
        }));
    }

    // Buscar productos
    buscar(query, opciones = {}) {
        const {
            categoria = null,
            precioMin = 0,
            precioMax = Infinity,
            soloDisponibles = true,
            soloDestacados = false,
            ordenar = 'relevancia'
        } = opciones;

        if (!query || query.trim().length === 0) {
            return this.productos;
        }

        const queryLower = query.toLowerCase();
        const terminos = queryLower.split(' ').filter(t => t.length > 2);

        // Buscar y calcular relevancia
        let resultados = this.productos.map(producto => {
            const indice = this.indicesBusqueda.find(i => i.id === producto.id);
            let score = 0;

            // Coincidencia exacta en nombre (máxima relevancia)
            if (indice.nombre.includes(queryLower)) {
                score += 100;
            }

            // Coincidencias por término
            terminos.forEach(termino => {
                if (indice.nombre.includes(termino)) score += 50;
                if (indice.categoria.includes(termino)) score += 30;
                if (indice.textoCompleto.includes(termino)) score += 10;
            });

            // Bonus por destacado
            if (indice.destacado) score += 20;

            return { ...producto, score };
        });

        // Filtrar por score > 0
        resultados = resultados.filter(r => r.score > 0);

        // Aplicar filtros
        if (categoria) {
            resultados = resultados.filter(r => r.categoria_id == categoria);
        }

        if (soloDisponibles) {
            resultados = resultados.filter(r => r.stock > 0);
        }

        if (soloDestacados) {
            resultados = resultados.filter(r => r.destacado);
        }

        resultados = resultados.filter(r => 
            r.precio >= precioMin && r.precio <= precioMax
        );

        // Ordenar
        switch(ordenar) {
            case 'relevancia':
                resultados.sort((a, b) => b.score - a.score);
                break;
            case 'precio_asc':
                resultados.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio_desc':
                resultados.sort((a, b) => b.precio - a.precio);
                break;
            case 'nombre':
                resultados.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
        }

        return resultados;
    }

    // Crear componente de búsqueda
    crearComponenteBusqueda() {
        const componente = document.createElement('div');
        componente.className = 'busqueda-inteligente-container';
        componente.innerHTML = `
            <div class="busqueda-box">
                <i class="fas fa-search busqueda-icon"></i>
                <input 
                    type="text" 
                    id="busqueda-input"
                    class="busqueda-input"
                    placeholder="Buscar productos..."
                    autocomplete="off"
                >
                <button class="busqueda-filtros-btn" id="toggle-filtros">
                    <i class="fas fa-sliders-h"></i>
                    Filtros
                </button>
                <button class="busqueda-clear-btn" id="clear-busqueda" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Panel de filtros -->
            <div class="filtros-panel" id="filtros-panel" style="display: none;">
                <div class="filtros-grid">
                    <div class="filtro-group">
                        <label>Categoría</label>
                        <select id="filtro-categoria" class="filtro-select">
                            <option value="">Todas</option>
                            <!-- Se llenará dinámicamente -->
                        </select>
                    </div>

                    <div class="filtro-group">
                        <label>Precio</label>
                        <div class="precio-range">
                            <input type="number" id="precio-min" placeholder="Mín" class="filtro-input">
                            <span>-</span>
                            <input type="number" id="precio-max" placeholder="Máx" class="filtro-input">
                        </div>
                    </div>

                    <div class="filtro-group">
                        <label>
                            <input type="checkbox" id="filtro-disponibles" checked>
                            Solo disponibles
                        </label>
                    </div>

                    <div class="filtro-group">
                        <label>
                            <input type="checkbox" id="filtro-destacados">
                            Solo destacados
                        </label>
                    </div>
                </div>

                <div class="filtros-actions">
                    <button class="btn-aplicar-filtros" id="aplicar-filtros">
                        <i class="fas fa-check"></i>
                        Aplicar
                    </button>
                    <button class="btn-limpiar-filtros" id="limpiar-filtros">
                        Limpiar
                    </button>
                </div>
            </div>

            <!-- Sugerencias / Autocompletado -->
            <div class="busqueda-sugerencias" id="busqueda-sugerencias" style="display: none;">
                <!-- Se llenará dinámicamente -->
            </div>

            <!-- Resultados -->
            <div class="busqueda-info" id="busqueda-info" style="display: none;">
                <span id="resultados-count">0</span> resultados encontrados
            </div>

            ${this.getStyles()}
        `;

        this.setupEventListeners(componente);
        return componente;
    }

    // Event listeners
    setupEventListeners(componente) {
        // Input de búsqueda
        const input = componente.querySelector('#busqueda-input');
        input.addEventListener('input', (e) => {
            this.onBusquedaChange(e.target.value);
        });

        // Toggle filtros
        componente.querySelector('#toggle-filtros').addEventListener('click', () => {
            const panel = componente.querySelector('#filtros-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        // Aplicar filtros
        componente.querySelector('#aplicar-filtros').addEventListener('click', () => {
            this.aplicarBusqueda();
        });

        // Limpiar filtros
        componente.querySelector('#limpiar-filtros').addEventListener('click', () => {
            this.limpiarFiltros();
        });

        // Clear búsqueda
        componente.querySelector('#clear-busqueda').addEventListener('click', () => {
            input.value = '';
            this.onBusquedaChange('');
        });

        // Enter para buscar
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.aplicarBusqueda();
            }
        });
    }

    // Cuando cambia el input
    onBusquedaChange(query) {
        const clearBtn = document.getElementById('clear-busqueda');
        const suggestionsDiv = document.getElementById('busqueda-sugerencias');

        if (query.length === 0) {
            clearBtn.style.display = 'none';
            suggestionsDiv.style.display = 'none';
            return;
        }

        clearBtn.style.display = 'block';

        // Mostrar sugerencias si tiene 2+ caracteres
        if (query.length >= 2) {
            this.mostrarSugerencias(query);
        }
    }

    // Mostrar sugerencias (autocompletado)
    mostrarSugerencias(query) {
        const resultados = this.buscar(query, { limite: 5 });
        const suggestionsDiv = document.getElementById('busqueda-sugerencias');

        if (resultados.length === 0) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        suggestionsDiv.innerHTML = resultados.slice(0, 5).map(producto => `
            <div class="sugerencia-item" onclick="window.verProducto(${producto.id})">
                ${producto.imagen_principal ? `
                    <img src="${producto.imagen_principal}" alt="${producto.nombre}" class="sugerencia-img">
                ` : `
                    <div class="sugerencia-img-placeholder">
                        <i class="fas fa-box"></i>
                    </div>
                `}
                <div class="sugerencia-info">
                    <div class="sugerencia-nombre">${producto.nombre}</div>
                    <div class="sugerencia-precio">$${producto.precio.toLocaleString()}</div>
                </div>
                <i class="fas fa-arrow-right sugerencia-arrow"></i>
            </div>
        `).join('');

        suggestionsDiv.style.display = 'block';
    }

    // Aplicar búsqueda completa
    aplicarBusqueda() {
        const query = document.getElementById('busqueda-input').value;
        const opciones = {
            categoria: document.getElementById('filtro-categoria').value,
            precioMin: parseFloat(document.getElementById('precio-min').value) || 0,
            precioMax: parseFloat(document.getElementById('precio-max').value) || Infinity,
            soloDisponibles: document.getElementById('filtro-disponibles').checked,
            soloDestacados: document.getElementById('filtro-destacados').checked
        };

        const resultados = this.buscar(query, opciones);

        // Mostrar info de resultados
        const infoDiv = document.getElementById('busqueda-info');
        const countSpan = document.getElementById('resultados-count');
        countSpan.textContent = resultados.length;
        infoDiv.style.display = 'block';

        // Ocultar sugerencias
        document.getElementById('busqueda-sugerencias').style.display = 'none';

        // Disparar evento personalizado con resultados
        window.dispatchEvent(new CustomEvent('busquedaRealizada', {
            detail: { resultados, query, opciones }
        }));

        return resultados;
    }

    // Limpiar filtros
    limpiarFiltros() {
        document.getElementById('filtro-categoria').value = '';
        document.getElementById('precio-min').value = '';
        document.getElementById('precio-max').value = '';
        document.getElementById('filtro-disponibles').checked = true;
        document.getElementById('filtro-destacados').checked = false;
        
        this.aplicarBusqueda();
    }

    // Estilos
    getStyles() {
        return `
        <style>
            .busqueda-inteligente-container {
                margin-bottom: 32px;
            }

            .busqueda-box {
                position: relative;
                display: flex;
                align-items: center;
                gap: 12px;
                max-width: 800px;
                margin: 0 auto;
            }

            .busqueda-input {
                flex: 1;
                padding: 16px 48px;
                border: 2px solid #E5E7EB;
                border-radius: 50px;
                font-size: 16px;
                font-family: inherit;
                transition: all 0.3s ease;
                background: white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }

            .busqueda-input:focus {
                outline: none;
                border-color: #7C3AED;
                box-shadow: 0 4px 20px rgba(124, 58, 237, 0.15);
            }

            .busqueda-icon {
                position: absolute;
                left: 18px;
                color: #7C3AED;
                font-size: 20px;
            }

            .busqueda-filtros-btn {
                padding: 16px 24px;
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
                border: none;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
            }

            .busqueda-filtros-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
            }

            .busqueda-clear-btn {
                position: absolute;
                right: 200px;
                background: transparent;
                border: none;
                color: #9CA3AF;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s;
            }

            .busqueda-clear-btn:hover {
                background: #F3F4F6;
                color: #6B7280;
            }

            /* Panel de filtros */
            .filtros-panel {
                background: white;
                padding: 24px;
                border-radius: 16px;
                margin-top: 16px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                animation: slideDown 0.3s ease;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .filtros-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }

            .filtro-group label {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 8px;
                font-size: 14px;
            }

            .filtro-select, .filtro-input {
                width: 100%;
                padding: 10px 14px;
                border: 2px solid #E5E7EB;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.2s;
            }

            .filtro-select:focus, .filtro-input:focus {
                outline: none;
                border-color: #7C3AED;
            }

            .precio-range {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .precio-range input {
                flex: 1;
            }

            .filtros-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }

            .btn-aplicar-filtros, .btn-limpiar-filtros {
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                border: none;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s;
            }

            .btn-aplicar-filtros {
                background: linear-gradient(135deg, #7C3AED, #A78BFA);
                color: white;
            }

            .btn-limpiar-filtros {
                background: #F3F4F6;
                color: #6B7280;
            }

            /* Sugerencias */
            .busqueda-sugerencias {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                right: 200px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                overflow: hidden;
                z-index: 1000;
                animation: slideDown 0.2s ease;
            }

            .sugerencia-item {
                padding: 14px 16px;
                display: flex;
                align-items: center;
                gap: 14px;
                cursor: pointer;
                transition: background 0.2s;
                border-bottom: 1px solid #F3F4F6;
            }

            .sugerencia-item:last-child {
                border-bottom: none;
            }

            .sugerencia-item:hover {
                background: #F9FAFB;
            }

            .sugerencia-img, .sugerencia-img-placeholder {
                width: 50px;
                height: 50px;
                border-radius: 8px;
                object-fit: cover;
                flex-shrink: 0;
            }

            .sugerencia-img-placeholder {
                background: #F3F4F6;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #9CA3AF;
            }

            .sugerencia-info {
                flex: 1;
            }

            .sugerencia-nombre {
                font-weight: 600;
                color: #1F2937;
                font-size: 14px;
                margin-bottom: 4px;
            }

            .sugerencia-precio {
                color: #7C3AED;
                font-weight: 700;
                font-size: 16px;
            }

            .sugerencia-arrow {
                color: #7C3AED;
                font-size: 14px;
            }

            /* Info de resultados */
            .busqueda-info {
                text-align: center;
                padding: 16px;
                background: linear-gradient(135deg, #F5F3FF, #FFFFFF);
                border-radius: 12px;
                margin-top: 16px;
                font-weight: 600;
                color: #7C3AED;
            }

            @media (max-width: 768px) {
                .busqueda-box {
                    flex-direction: column;
                }

                .busqueda-input {
                    width: 100%;
                }

                .busqueda-filtros-btn {
                    width: 100%;
                }

                .busqueda-clear-btn {
                    right: 16px;
                    top: 16px;
                }
            }
        </style>
        `;
    }
}

// Función global
window.initBusquedaInteligente = function(tenantSlug, productos) {
    window.busquedaInteligente = new BusquedaInteligente(tenantSlug, productos);
    return window.busquedaInteligente;
};

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BusquedaInteligente };
}


