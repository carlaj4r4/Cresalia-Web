// ===== SISTEMA DE PERSONALIZACIÓN AVANZADA CRESALIA =====
// Sistema completo de personalización y temas

class SistemaPersonalizacionAvanzada {
    constructor() {
        this.temas = {};
        this.configuracion = {};
        this.preferencias = {};
        this.inicializar();
    }

    // Inicializar sistema de personalización
    inicializar() {
        console.log('🎨 Inicializando Sistema de Personalización Avanzada...');
        
        // Configurar temas disponibles
        this.configurarTemas();
        
        // Configurar personalización de colores
        this.configurarColores();
        
        // Configurar personalización de layout
        this.configurarLayout();
        
        // Configurar personalización de contenido
        this.configurarContenido();
        
        // Configurar personalización de widgets
        this.configurarWidgets();
        
        // Cargar configuración guardada
        this.cargarConfiguracion();
        
        console.log('✅ Sistema de Personalización Avanzada inicializado');
    }

    // Configurar temas disponibles
    configurarTemas() {
        this.temas = {
            // Tema Clásico
            clasico: {
                nombre: 'Clásico',
                colores: {
                    primario: '#667eea',
                    secundario: '#764ba2',
                    fondo: '#ffffff',
                    texto: '#374151',
                    acento: '#f59e0b'
                },
                tipografia: {
                    fuente: 'Inter',
                    tamaño: '16px',
                    peso: '400'
                },
                layout: {
                    sidebar: 'izquierda',
                    densidad: 'normal',
                    animaciones: true
                }
            },
            
            // Tema Oscuro
            oscuro: {
                nombre: 'Oscuro',
                colores: {
                    primario: '#3b82f6',
                    secundario: '#1e40af',
                    fondo: '#1f2937',
                    texto: '#f9fafb',
                    acento: '#f59e0b'
                },
                tipografia: {
                    fuente: 'Inter',
                    tamaño: '16px',
                    peso: '400'
                },
                layout: {
                    sidebar: 'izquierda',
                    densidad: 'normal',
                    animaciones: true
                }
            },
            
            // Tema Minimalista
            minimalista: {
                nombre: 'Minimalista',
                colores: {
                    primario: '#6b7280',
                    secundario: '#9ca3af',
                    fondo: '#ffffff',
                    texto: '#111827',
                    acento: '#10b981'
                },
                tipografia: {
                    fuente: 'Inter',
                    tamaño: '14px',
                    peso: '300'
                },
                layout: {
                    sidebar: 'derecha',
                    densidad: 'compacta',
                    animaciones: false
                }
            },
            
            // Tema Vibrante
            vibrante: {
                nombre: 'Vibrante',
                colores: {
                    primario: '#ec4899',
                    secundario: '#be185d',
                    fondo: '#fef3c7',
                    texto: '#1f2937',
                    acento: '#f59e0b'
                },
                tipografia: {
                    fuente: 'Inter',
                    tamaño: '18px',
                    peso: '500'
                },
                layout: {
                    sidebar: 'izquierda',
                    densidad: 'espaciosa',
                    animaciones: true
                }
            },
            
            // Tema Profesional
            profesional: {
                nombre: 'Profesional',
                colores: {
                    primario: '#1f2937',
                    secundario: '#374151',
                    fondo: '#f9fafb',
                    texto: '#111827',
                    acento: '#3b82f6'
                },
                tipografia: {
                    fuente: 'Inter',
                    tamaño: '16px',
                    peso: '400'
                },
                layout: {
                    sidebar: 'izquierda',
                    densidad: 'normal',
                    animaciones: true
                }
            }
        };
    }

    // Configurar personalización de colores
    configurarColores() {
        this.coloresPersonalizables = {
            primario: {
                nombre: 'Color Primario',
                descripcion: 'Color principal de la interfaz',
                valor: '#667eea',
                categoria: 'colores'
            },
            secundario: {
                nombre: 'Color Secundario',
                descripcion: 'Color secundario para acentos',
                valor: '#764ba2',
                categoria: 'colores'
            },
            fondo: {
                nombre: 'Color de Fondo',
                descripcion: 'Color de fondo principal',
                valor: '#ffffff',
                categoria: 'colores'
            },
            texto: {
                nombre: 'Color de Texto',
                descripcion: 'Color del texto principal',
                valor: '#374151',
                categoria: 'colores'
            },
            acento: {
                nombre: 'Color de Acento',
                descripcion: 'Color para elementos destacados',
                valor: '#f59e0b',
                categoria: 'colores'
            }
        };
    }

    // Configurar personalización de layout
    configurarLayout() {
        this.layoutPersonalizable = {
            sidebar: {
                nombre: 'Posición de Sidebar',
                opciones: ['izquierda', 'derecha', 'oculta'],
                valor: 'izquierda',
                categoria: 'layout'
            },
            densidad: {
                nombre: 'Densidad de Contenido',
                opciones: ['compacta', 'normal', 'espaciosa'],
                valor: 'normal',
                categoria: 'layout'
            },
            animaciones: {
                nombre: 'Animaciones',
                opciones: [true, false],
                valor: true,
                categoria: 'layout'
            },
            grid: {
                nombre: 'Tipo de Grid',
                opciones: ['normal', 'compacto', 'espacioso'],
                valor: 'normal',
                categoria: 'layout'
            }
        };
    }

    // Configurar personalización de contenido
    configurarContenido() {
        this.contenidoPersonalizable = {
            idioma: {
                nombre: 'Idioma',
                opciones: ['español', 'inglés', 'portugués'],
                valor: 'español',
                categoria: 'contenido'
            },
            moneda: {
                nombre: 'Moneda',
                opciones: ['ARS', 'USD', 'EUR', 'BRL'],
                valor: 'ARS',
                categoria: 'contenido'
            },
            formatoFecha: {
                nombre: 'Formato de Fecha',
                opciones: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
                valor: 'DD/MM/YYYY',
                categoria: 'contenido'
            },
            zonaHoraria: {
                nombre: 'Zona Horaria',
                opciones: ['America/Argentina/Buenos_Aires', 'UTC', 'America/New_York'],
                valor: 'America/Argentina/Buenos_Aires',
                categoria: 'contenido'
            }
        };
    }

    // Configurar personalización de widgets
    configurarWidgets() {
        this.widgetsPersonalizables = {
            bienestar: {
                nombre: 'Widget de Bienestar',
                visible: true,
                posicion: 'bottom-right',
                tamaño: 'pequeño',
                categoria: 'widgets'
            },
            notificaciones: {
                nombre: 'Widget de Notificaciones',
                visible: true,
                posicion: 'top-right',
                tamaño: 'normal',
                categoria: 'widgets'
            },
            chat: {
                nombre: 'Widget de Chat',
                visible: true,
                posicion: 'bottom-left',
                tamaño: 'normal',
                categoria: 'widgets'
            },
            analytics: {
                nombre: 'Widget de Analytics',
                visible: false,
                posicion: 'dashboard',
                tamaño: 'grande',
                categoria: 'widgets'
            }
        };
    }

    // Cargar configuración guardada
    cargarConfiguracion() {
        const configuracionGuardada = JSON.parse(localStorage.getItem('configuracionPersonalizacion') || '{}');
        
        if (Object.keys(configuracionGuardada).length > 0) {
            this.configuracion = { ...this.configuracion, ...configuracionGuardada };
            this.aplicarConfiguracion();
        }
    }

    // Aplicar configuración
    aplicarConfiguracion() {
        // Aplicar tema
        if (this.configuracion.tema) {
            this.aplicarTema(this.configuracion.tema);
        }
        
        // Aplicar colores personalizados
        if (this.configuracion.colores) {
            this.aplicarColores(this.configuracion.colores);
        }
        
        // Aplicar layout personalizado
        if (this.configuracion.layout) {
            this.aplicarLayout(this.configuracion.layout);
        }
        
        // Aplicar contenido personalizado
        if (this.configuracion.contenido) {
            this.aplicarContenido(this.configuracion.contenido);
        }
        
        // Aplicar widgets personalizados
        if (this.configuracion.widgets) {
            this.aplicarWidgets(this.configuracion.widgets);
        }
    }

    // Aplicar tema
    aplicarTema(tema) {
        const temaConfig = this.temas[tema];
        if (!temaConfig) return;
        
        // Aplicar colores del tema
        this.aplicarColores(temaConfig.colores);
        
        // Aplicar tipografía del tema
        this.aplicarTipografia(temaConfig.tipografia);
        
        // Aplicar layout del tema
        this.aplicarLayout(temaConfig.layout);
        
        console.log(`🎨 Tema ${temaConfig.nombre} aplicado`);
    }

    // Aplicar colores
    aplicarColores(colores) {
        const root = document.documentElement;
        
        Object.keys(colores).forEach(color => {
            root.style.setProperty(`--color-${color}`, colores[color]);
        });
        
        // Aplicar estilos CSS dinámicos
        this.aplicarEstilosCSS(colores);
    }

    // Aplicar estilos CSS dinámicos
    aplicarEstilosCSS(colores) {
        let estilosExistentes = document.getElementById('estilos-personalizacion');
        
        if (!estilosExistentes) {
            estilosExistentes = document.createElement('style');
            estilosExistentes.id = 'estilos-personalizacion';
            document.head.appendChild(estilosExistentes);
        }
        
        const css = `
            :root {
                --color-primario: ${colores.primario || '#667eea'};
                --color-secundario: ${colores.secundario || '#764ba2'};
                --color-fondo: ${colores.fondo || '#ffffff'};
                --color-texto: ${colores.texto || '#374151'};
                --color-acento: ${colores.acento || '#f59e0b'};
            }
            
            .btn-primary {
                background-color: var(--color-primario) !important;
                border-color: var(--color-primario) !important;
            }
            
            .btn-primary:hover {
                background-color: var(--color-secundario) !important;
                border-color: var(--color-secundario) !important;
            }
            
            .text-primary {
                color: var(--color-primario) !important;
            }
            
            .bg-primary {
                background-color: var(--color-primario) !important;
            }
            
            .border-primary {
                border-color: var(--color-primario) !important;
            }
            
            body {
                background-color: var(--color-fondo) !important;
                color: var(--color-texto) !important;
            }
            
            .card {
                background-color: var(--color-fondo) !important;
                border-color: var(--color-primario) !important;
            }
            
            .navbar {
                background-color: var(--color-primario) !important;
            }
            
            .sidebar {
                background-color: var(--color-secundario) !important;
            }
        `;
        
        estilosExistentes.textContent = css;
    }

    // Aplicar tipografía
    aplicarTipografia(tipografia) {
        const root = document.documentElement;
        
        root.style.setProperty('--fuente-principal', tipografia.fuente);
        root.style.setProperty('--tamaño-fuente', tipografia.tamaño);
        root.style.setProperty('--peso-fuente', tipografia.peso);
        
        // Aplicar a elementos
        document.body.style.fontFamily = tipografia.fuente;
        document.body.style.fontSize = tipografia.tamaño;
        document.body.style.fontWeight = tipografia.peso;
    }

    // Aplicar layout
    aplicarLayout(layout) {
        // Aplicar posición de sidebar
        if (layout.sidebar) {
            this.aplicarPosicionSidebar(layout.sidebar);
        }
        
        // Aplicar densidad
        if (layout.densidad) {
            this.aplicarDensidad(layout.densidad);
        }
        
        // Aplicar animaciones
        if (layout.animaciones !== undefined) {
            this.aplicarAnimaciones(layout.animaciones);
        }
    }

    // Aplicar posición de sidebar
    aplicarPosicionSidebar(posicion) {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        sidebar.style.order = posicion === 'derecha' ? '2' : '0';
        
        if (posicion === 'oculta') {
            sidebar.style.display = 'none';
        } else {
            sidebar.style.display = 'block';
        }
    }

    // Aplicar densidad
    aplicarDensidad(densidad) {
        const contenedor = document.querySelector('.main-content');
        if (!contenedor) return;
        
        switch (densidad) {
            case 'compacta':
                contenedor.style.padding = '10px';
                contenedor.style.gap = '10px';
                break;
            case 'espaciosa':
                contenedor.style.padding = '30px';
                contenedor.style.gap = '30px';
                break;
            default:
                contenedor.style.padding = '20px';
                contenedor.style.gap = '20px';
        }
    }

    // Aplicar animaciones
    aplicarAnimaciones(habilitadas) {
        const root = document.documentElement;
        
        if (habilitadas) {
            root.style.setProperty('--transicion', 'all 0.3s ease');
            root.style.setProperty('--animacion', 'fadeIn 0.5s ease');
        } else {
            root.style.setProperty('--transicion', 'none');
            root.style.setProperty('--animacion', 'none');
        }
    }

    // Aplicar contenido personalizado
    aplicarContenido(contenido) {
        // Aplicar idioma
        if (contenido.idioma) {
            this.aplicarIdioma(contenido.idioma);
        }
        
        // Aplicar moneda
        if (contenido.moneda) {
            this.aplicarMoneda(contenido.moneda);
        }
        
        // Aplicar formato de fecha
        if (contenido.formatoFecha) {
            this.aplicarFormatoFecha(contenido.formatoFecha);
        }
    }

    // Aplicar idioma
    aplicarIdioma(idioma) {
        // Cambiar textos según idioma
        const textos = this.obtenerTextos(idioma);
        
        Object.keys(textos).forEach(selector => {
            const elementos = document.querySelectorAll(selector);
            elementos.forEach(elemento => {
                elemento.textContent = textos[selector];
            });
        });
    }

    // Obtener textos por idioma
    obtenerTextos(idioma) {
        const textos = {
            español: {
                '.dashboard-title': 'Dashboard',
                '.products-title': 'Productos',
                '.services-title': 'Servicios',
                '.sales-title': 'Ventas'
            },
            inglés: {
                '.dashboard-title': 'Dashboard',
                '.products-title': 'Products',
                '.services-title': 'Services',
                '.sales-title': 'Sales'
            },
            portugués: {
                '.dashboard-title': 'Painel',
                '.products-title': 'Produtos',
                '.services-title': 'Serviços',
                '.sales-title': 'Vendas'
            }
        };
        
        return textos[idioma] || textos.español;
    }

    // Aplicar moneda
    aplicarMoneda(moneda) {
        const simbolos = {
            'ARS': '$',
            'USD': '$',
            'EUR': '€',
            'BRL': 'R$'
        };
        
        const simbolo = simbolos[moneda] || '$';
        
        // Actualizar símbolos de moneda en la interfaz
        const elementosMoneda = document.querySelectorAll('.moneda-simbolo');
        elementosMoneda.forEach(elemento => {
            elemento.textContent = simbolo;
        });
    }

    // Aplicar formato de fecha
    aplicarFormatoFecha(formato) {
        // Guardar formato para uso en funciones de fecha
        localStorage.setItem('formatoFecha', formato);
    }

    // Aplicar widgets personalizados
    aplicarWidgets(widgets) {
        Object.keys(widgets).forEach(widget => {
            const config = widgets[widget];
            this.configurarWidget(widget, config);
        });
    }

    // Configurar widget individual
    configurarWidget(widget, config) {
        const elemento = document.getElementById(widget);
        if (!elemento) return;
        
        // Aplicar visibilidad
        elemento.style.display = config.visible ? 'block' : 'none';
        
        // Aplicar posición
        if (config.posicion) {
            this.aplicarPosicionWidget(elemento, config.posicion);
        }
        
        // Aplicar tamaño
        if (config.tamaño) {
            this.aplicarTamañoWidget(elemento, config.tamaño);
        }
    }

    // Aplicar posición de widget
    aplicarPosicionWidget(elemento, posicion) {
        elemento.style.position = 'fixed';
        
        switch (posicion) {
            case 'top-right':
                elemento.style.top = '20px';
                elemento.style.right = '20px';
                break;
            case 'bottom-right':
                elemento.style.bottom = '20px';
                elemento.style.right = '20px';
                break;
            case 'bottom-left':
                elemento.style.bottom = '20px';
                elemento.style.left = '20px';
                break;
            case 'top-left':
                elemento.style.top = '20px';
                elemento.style.left = '20px';
                break;
        }
    }

    // Aplicar tamaño de widget
    aplicarTamañoWidget(elemento, tamaño) {
        switch (tamaño) {
            case 'pequeño':
                elemento.style.width = '200px';
                elemento.style.height = '150px';
                break;
            case 'normal':
                elemento.style.width = '300px';
                elemento.style.height = '200px';
                break;
            case 'grande':
                elemento.style.width = '400px';
                elemento.style.height = '300px';
                break;
        }
    }

    // Guardar configuración
    guardarConfiguracion() {
        localStorage.setItem('configuracionPersonalizacion', JSON.stringify(this.configuracion));
        console.log('💾 Configuración de personalización guardada');
    }

    // Obtener configuración actual
    obtenerConfiguracion() {
        return {
            tema: this.configuracion.tema || 'clasico',
            colores: this.configuracion.colores || {},
            layout: this.configuracion.layout || {},
            contenido: this.configuracion.contenido || {},
            widgets: this.configuracion.widgets || {},
            ultimaActualizacion: new Date().toISOString()
        };
    }

    // Mostrar panel de personalización
    mostrarPanelPersonalizacion() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0,0,0,0.8) !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 90vw; max-height: 90vh; width: 90%; overflow-y: auto;">
                <h3 style="color: #667eea; margin-bottom: 20px;">🎨 Panel de Personalización</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <!-- Temas -->
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                        <h4 style="color: #374151; margin-bottom: 15px;">Temas</h4>
                        ${Object.keys(this.temas).map(tema => `
                            <label style="display: flex; align-items: center; margin-bottom: 10px; cursor: pointer;">
                                <input type="radio" name="tema" value="${tema}" ${this.configuracion.tema === tema ? 'checked' : ''} style="margin-right: 10px;">
                                ${this.temas[tema].nombre}
                            </label>
                        `).join('')}
                    </div>
                    
                    <!-- Colores -->
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                        <h4 style="color: #374151; margin-bottom: 15px;">Colores</h4>
                        ${Object.keys(this.coloresPersonalizables).map(color => `
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px;">${this.coloresPersonalizables[color].nombre}</label>
                                <input type="color" id="color-${color}" value="${this.coloresPersonalizables[color].valor}" style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Layout -->
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                        <h4 style="color: #374151; margin-bottom: 15px;">Layout</h4>
                        ${Object.keys(this.layoutPersonalizable).map(layout => `
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; margin-bottom: 5px;">${this.layoutPersonalizable[layout].nombre}</label>
                                <select id="layout-${layout}" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
                                    ${this.layoutPersonalizable[layout].opciones.map(opcion => `
                                        <option value="${opcion}" ${this.layoutPersonalizable[layout].valor === opcion ? 'selected' : ''}>${opcion}</option>
                                    `).join('')}
                                </select>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Widgets -->
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                        <h4 style="color: #374151; margin-bottom: 15px;">Widgets</h4>
                        ${Object.keys(this.widgetsPersonalizables).map(widget => `
                            <div style="margin-bottom: 10px;">
                                <label style="display: flex; align-items: center; cursor: pointer;">
                                    <input type="checkbox" id="widget-${widget}" ${this.widgetsPersonalizables[widget].visible ? 'checked' : ''} style="margin-right: 10px;">
                                    ${this.widgetsPersonalizables[widget].nombre}
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="cerrarModal(this)" style="background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        Cancelar
                    </button>
                    <button onclick="aplicarPersonalizacion()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        Aplicar
                    </button>
                    <button onclick="guardarPersonalizacion()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        Guardar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Aplicar personalización
    aplicarPersonalizacion() {
        // Aplicar tema seleccionado
        const temaSeleccionado = document.querySelector('input[name="tema"]:checked');
        if (temaSeleccionado) {
            this.configuracion.tema = temaSeleccionado.value;
            this.aplicarTema(temaSeleccionado.value);
        }
        
        // Aplicar colores personalizados
        const colores = {};
        Object.keys(this.coloresPersonalizables).forEach(color => {
            const input = document.getElementById(`color-${color}`);
            if (input) {
                colores[color] = input.value;
            }
        });
        this.configuracion.colores = colores;
        this.aplicarColores(colores);
        
        // Aplicar layout personalizado
        const layout = {};
        Object.keys(this.layoutPersonalizable).forEach(layoutKey => {
            const select = document.getElementById(`layout-${layoutKey}`);
            if (select) {
                layout[layoutKey] = select.value;
            }
        });
        this.configuracion.layout = layout;
        this.aplicarLayout(layout);
        
        // Aplicar widgets personalizados
        const widgets = {};
        Object.keys(this.widgetsPersonalizables).forEach(widget => {
            const checkbox = document.getElementById(`widget-${widget}`);
            if (checkbox) {
                widgets[widget] = {
                    ...this.widgetsPersonalizables[widget],
                    visible: checkbox.checked
                };
            }
        });
        this.configuracion.widgets = widgets;
        this.aplicarWidgets(widgets);
        
        console.log('🎨 Personalización aplicada');
    }

    // Guardar personalización
    guardarPersonalizacion() {
        this.aplicarPersonalizacion();
        this.guardarConfiguracion();
        
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('✅ Personalización guardada exitosamente', 'success');
        }
        
        cerrarModal(document.querySelector('.modal'));
    }
}

// Inicializar sistema globalmente
window.sistemaPersonalizacion = new SistemaPersonalizacionAvanzada();

// Funciones globales
window.mostrarPanelPersonalizacion = function() {
    window.sistemaPersonalizacion.mostrarPanelPersonalizacion();
};

window.aplicarPersonalizacion = function() {
    window.sistemaPersonalizacion.aplicarPersonalizacion();
};

window.guardarPersonalizacion = function() {
    window.sistemaPersonalizacion.guardarPersonalizacion();
};

window.obtenerConfiguracionPersonalizacion = function() {
    return window.sistemaPersonalizacion.obtenerConfiguracion();
};

console.log('✅ Sistema de Personalización Avanzada cargado correctamente');










