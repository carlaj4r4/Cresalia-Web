/**
 * ═══════════════════════════════════════════════════════════════
 * 🤖 SISTEMA DE IA PARA DESCRIPCIONES - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Mejora automáticamente las descripciones de productos
 * 100% GRATIS - No usa APIs pagas
 * Sistema inteligente basado en reglas + templates
 * 
 * Creado con 💜 por Claude & Carla
 * Para ayudar a emprendedores a vender más
 * ═══════════════════════════════════════════════════════════════
 */

class IADescripciones {
    constructor() {
        this.categorias = {
            'alimentos': {
                palabras_clave: ['delicioso', 'casero', 'fresco', 'artesanal', 'calidad premium', 'recién hecho', 'tradicional', 'natural'],
                emojis: ['🍰', '🍪', '🎂', '🥐', '🍞', '🧁', '🥧'],
                ideal_para: [
                    'Fiestas, reuniones familiares, regalos especiales, celebraciones',
                    'Compartir en familia, meriendas, eventos especiales',
                    'Sorprender a alguien especial, cumpleaños, antojos dulces',
                    'Ocasiones importantes, agasajar invitados, darte un gusto'
                ],
                tips: [
                    'Mencioná los ingredientes principales',
                    'Destacá si es casero o artesanal',
                    'Indicá cuántas porciones sirve'
                ]
            },
            'ropa': {
                palabras_clave: ['elegante', 'cómodo', 'versátil', 'tendencia', 'alta calidad', 'estilo único', 'moderno', 'atemporal'],
                emojis: ['👕', '👗', '👔', '👚', '🧥', '👖', '👘'],
                ideal_para: [
                    'Uso diario, eventos especiales, trabajo, ocasiones formales',
                    'Salir con amigos, citas, reuniones importantes, look casual',
                    'Estar cómodo y a la moda, destacarte, sentirte bien',
                    'Todo tipo de ocasiones, combinar con todo, lucir increíble'
                ],
                tips: [
                    'Mencioná los materiales (algodón, seda, etc.)',
                    'Indicá talles disponibles',
                    'Destacá la comodidad y estilo'
                ]
            },
            'hogar': {
                palabras_clave: ['práctico', 'duradero', 'diseño único', 'funcional', 'hermoso', 'decorativo', 'útil', 'versátil'],
                emojis: ['🏠', '🛋️', '🪴', '🕯️', '🖼️', '🛏️', '🪑'],
                ideal_para: [
                    'Decorar tu hogar, regalo perfecto, uso diario, ambientar espacios',
                    'Transformar tu casa, hacer tu espacio más acogedor, regalar con amor',
                    'Renovar ambientes, darle vida a tu hogar, impresionar visitas',
                    'Mejorar tu calidad de vida, organizar mejor, vivir más cómodo'
                ],
                tips: [
                    'Mencioná las medidas',
                    'Indicá el material de fabricación',
                    'Destacá cómo mejora el ambiente'
                ]
            },
            'belleza': {
                palabras_clave: ['natural', 'efectivo', 'suave', 'resultados visibles', 'probado', 'dermatológicamente testeado', 'hipoalergénico'],
                emojis: ['💄', '💅', '💆', '🧴', '🧼', '💇', '🌸'],
                ideal_para: [
                    'Cuidado diario, ocasiones especiales, regalo ideal, rutina de belleza',
                    'Sentirte radiante, cuidar tu piel, verte espectacular, regalarte amor',
                    'Tu rutina de autocuidado, lucir natural, resaltar tu belleza',
                    'Eventos importantes, selfies perfectas, brillar siempre'
                ],
                tips: [
                    'Mencioná los ingredientes naturales',
                    'Indicá el tipo de piel recomendado',
                    'Destacá los beneficios principales'
                ]
            },
            'tecnologia': {
                palabras_clave: ['innovador', 'última generación', 'eficiente', 'rápido', 'potente', 'confiable', 'fácil de usar'],
                emojis: ['📱', '💻', '⌚', '🎧', '📷', '🖥️', '⌨️'],
                ideal_para: [
                    'Trabajo, estudio, entretenimiento, productividad',
                    'Mejorar tu rendimiento, estudiar mejor, disfrutar multimedia',
                    'Profesionales, estudiantes, gamers, creadores de contenido',
                    'Optimizar tu tiempo, trabajar desde casa, crear proyectos'
                ],
                tips: [
                    'Mencioná las especificaciones técnicas',
                    'Indicá garantía y soporte',
                    'Destacá la facilidad de uso'
                ]
            },
            'servicios': {
                palabras_clave: ['profesional', 'confiable', 'experiencia', 'calidad garantizada', 'personalizado', 'rápido', 'eficiente'],
                emojis: ['🔧', '🛠️', '👨‍💼', '📋', '✅', '⚙️', '🤝'],
                ideal_para: [
                    'Solucionar problemas, mejorar tu negocio, ahorrarte tiempo',
                    'Profesionales, empresas, emprendedores, quienes buscan calidad',
                    'Resolver rápido, hacer crecer tu proyecto, obtener resultados',
                    'Delegar tareas, optimizar procesos, enfocarte en lo importante'
                ],
                tips: [
                    'Mencioná tu experiencia',
                    'Indicá tiempo de entrega',
                    'Destacá casos de éxito'
                ]
            },
            'artesanias': {
                palabras_clave: ['único', 'hecho a mano', 'exclusivo', 'artístico', 'personalizado', 'detalle artesanal', 'original'],
                emojis: ['🎨', '✨', '🧶', '🪡', '🎭', '🖌️', '💎'],
                ideal_para: [
                    'Regalo especial, decoración única, coleccionistas, personalización',
                    'Sorprender, regalar con significado, tener algo exclusivo',
                    'Quienes valoran lo hecho a mano, apoyar artesanos locales',
                    'Hacer un regalo memorable, decorar con estilo, tener piezas únicas'
                ],
                tips: [
                    'Destacá que es único y hecho a mano',
                    'Mencioná el tiempo de elaboración',
                    'Indicá si aceptás personalizaciones'
                ]
            },
            'otros': {
                palabras_clave: ['calidad', 'confiable', 'práctico', 'útil', 'excelente', 'recomendado'],
                emojis: ['⭐', '✨', '💫', '🌟'],
                ideal_para: [
                    'Regalo, uso personal, sorprender a alguien especial',
                    'Cualquier ocasión, tener a mano, facilitar tu vida',
                    'Darte un gusto, regalar con amor, uso cotidiano',
                    'Mejorar tu día a día, tener lo mejor, invertir bien'
                ],
                tips: [
                    'Describí claramente el producto',
                    'Mencioná sus beneficios principales',
                    'Indicá cómo se usa'
                ]
            }
        };
        
        // CTAs expandidos - 25 variaciones para evitar repetición
        this.ctas = [
            '¡Hacé tu pedido ahora! 🛒',
            '¡Consultá disponibilidad! 💬',
            '¡No te quedes sin el tuyo! ⭐',
            '¡Aprovechá esta oportunidad! 🎉',
            '¡Escribime para más información! 📱',
            '¡Pedilo ya! ✨',
            '¡Contactame sin compromiso! 💚',
            '¡Reservá el tuyo hoy mismo! 🎯',
            '¡Te esperamos para tu consulta! 💝',
            '¡Hablame por WhatsApp! 📲',
            '¡Encargalo antes que se agote! ⚡',
            '¡Dale, animate! 🚀',
            '¡Preguntame lo que necesites! 🤗',
            '¡Tu próximo favorito te espera! 💫',
            '¡Hacé tu consulta ahora! ✅',
            '¡Separalo con una seña! 💰',
            '¡Stock limitado, consultá ya! ⏰',
            '¡Te asesoramos sin compromiso! 🌟',
            '¡Comunicate para coordinar! 📞',
            '¡Esperamos tu mensaje! 💌',
            '¡Conseguilo antes que se termine! 🔥',
            '¡Estamos para ayudarte! 🙌',
            '¡Preguntá sin compromiso! 😊',
            '¡Coordinamos la entrega! 🚚',
            '¡Hacemos envíos a todo el país! 📦'
        ];
        
        // Frases introductorias variadas
        this.intros = [
            'Te presentamos',
            'Descubrí',
            'Conocé',
            'No te pierdas',
            'Aprovechá',
            'Disfrutá de',
            'Encontrá',
            'Conseguí',
            'Llevate',
            'Probá'
        ];
        
        // Conectores variados para descripción
        this.conectores = [
            'Además,',
            'También,',
            'Lo mejor es que',
            'Y no solo eso,',
            'Sumado a eso,',
            'Por si fuera poco,',
            'Para completar,'
        ];
        
        // Formas de presentar "ideal para"
        this.idealParaFormatos = [
            '💝 Ideal para: {texto}',
            '🎯 Perfecto para: {texto}',
            '✨ Recomendado para: {texto}',
            '🌟 Genial para: {texto}',
            '💫 Excelente para: {texto}'
        ];
        
        // Formas de presentar características
        this.caracteristicasFormatos = [
            '✨ Características:',
            '⭐ Lo que incluye:',
            '💎 Detalles importantes:',
            '🔍 Especificaciones:',
            '📋 Qué ofrece:'
        ];
    }
    
    /**
     * Analiza una descripción y detecta problemas
     */
    analizarDescripcion(descripcion, producto) {
        const problemas = [];
        const sugerencias = [];
        
        if (!descripcion || descripcion.trim().length === 0) {
            problemas.push({
                tipo: 'sin_descripcion',
                urgencia: 'alta',
                mensaje: 'No hay descripción'
            });
            return { problemas, sugerencias, nivel: 'puede_mejorar', mensaje_motivacional: '💚 ¡Podés mejorarla! Te ayudo:' };
        }
        
        // 1. Longitud
        if (descripcion.length < 50) {
            problemas.push({
                tipo: 'muy_corta',
                urgencia: 'alta',
                mensaje: 'La descripción es muy corta (menos de 50 caracteres)'
            });
            sugerencias.push('Agregá más detalles sobre tu producto. Las descripciones largas venden 200% más.');
        }
        
        if (descripcion.length < 100) {
            sugerencias.push('Podés expandir la descripción con más características.');
        }
        
        // 2. Emojis
        const tieneEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(descripcion);
        if (!tieneEmojis) {
            sugerencias.push('Agregá emojis para hacer la descripción más atractiva 😊');
        }
        
        // 3. Información de precio/envío
        const mencionaPrecio = /\$|precio|cuesta|vale/i.test(descripcion);
        const mencionaEnvio = /envío|envio|entrega|delivery/i.test(descripcion);
        
        if (!mencionaEnvio) {
            sugerencias.push('Mencioná las opciones de envío o entrega');
        }
        
        // 4. Call to Action
        const tieneCTA = /hacé|pedí|consultá|escribí|contacta|compra/i.test(descripcion);
        if (!tieneCTA) {
            sugerencias.push('Agregá un llamado a la acción (ej: "¡Hacé tu pedido!")');
        }
        
        // 5. Características
        const tieneCaracteristicas = /•|✓|✅|▪|-/.test(descripcion) || descripcion.split('\n').length > 2;
        if (!tieneCaracteristicas) {
            sugerencias.push('Usá viñetas (•) para listar características');
        }
        
        // Calcular nivel (sin puntajes para no ofender)
        let nivel = 'excelente';
        const problemasAltos = problemas.filter(p => p.urgencia === 'alta').length;
        const cantidadSugerencias = sugerencias.length;
        
        if (problemasAltos > 0 || cantidadSugerencias > 5) {
            nivel = 'puede_mejorar';
        } else if (cantidadSugerencias > 2) {
            nivel = 'buena';
        } else if (cantidadSugerencias > 0) {
            nivel = 'muy_buena';
        }
        
        const mensajesMotivacionales = {
            'puede_mejorar': '💚 ¡Podés mejorarla! Te ayudo:',
            'buena': '👍 ¡Buen inicio! Algunos tips para hacerla brillar:',
            'muy_buena': '🌟 ¡Casi perfecta! Solo pequeños detalles:',
            'excelente': '✨ ¡Excelente descripción! Está perfecta.'
        };
        
        return {
            problemas,
            sugerencias,
            nivel,
            mensaje_motivacional: mensajesMotivacionales[nivel]
        };
    }
    
    /**
     * Mejora automáticamente una descripción
     * VERSIÓN MEJORADA: Con múltiples variaciones para evitar repetición
     */
    mejorarDescripcion(producto) {
        const categoria = producto.categoria || 'otros';
        const config = this.categorias[categoria] || this.categorias['otros'];
        
        // Selección aleatoria de elementos para hacer cada descripción única
        const emoji = this.seleccionarAleatorio(config.emojis);
        const intro = this.seleccionarAleatorio(this.intros);
        const conector = this.seleccionarAleatorio(this.conectores);
        const formatoIdealPara = this.seleccionarAleatorio(this.idealParaFormatos);
        const formatoCaracteristicas = this.seleccionarAleatorio(this.caracteristicasFormatos);
        const cta = this.seleccionarAleatorio(this.ctas);
        
        // Seleccionar texto de ideal_para (ahora puede ser array o string)
        const idealParaTexto = Array.isArray(config.ideal_para) 
            ? this.seleccionarAleatorio(config.ideal_para)
            : config.ideal_para;
        
        // Decidir aleatoriamente el orden de las secciones (3 estructuras diferentes)
        const estructura = Math.floor(Math.random() * 3);
        
        let descripcionMejorada = '';
        
        // ESTRUCTURA 1: Tradicional (emoji → descripción → características → ideal para → envío → CTA)
        if (estructura === 0) {
            descripcionMejorada += `${emoji} ${producto.nombre}\n\n`;
            descripcionMejorada += this.expandirDescripcion(
                producto.descripcion_original || producto.descripcion || '',
                config.palabras_clave,
                conector
            );
            descripcionMejorada += '\n\n';
            descripcionMejorada += `${formatoCaracteristicas}\n`;
            const caracteristicas = this.generarCaracteristicas(producto, config);
            caracteristicas.forEach(c => {
                descripcionMejorada += `• ${c}\n`;
            });
            descripcionMejorada += '\n';
            descripcionMejorada += formatoIdealPara.replace('{texto}', idealParaTexto) + '\n\n';
            descripcionMejorada += this.generarInfoEnvio(producto) + '\n\n';
            descripcionMejorada += cta;
        }
        
        // ESTRUCTURA 2: Con intro (intro → nombre → descripción → ideal para → características → envío → CTA)
        else if (estructura === 1) {
            descripcionMejorada += `${intro} ${emoji} ${producto.nombre}\n\n`;
            descripcionMejorada += this.expandirDescripcion(
                producto.descripcion_original || producto.descripcion || '',
                config.palabras_clave,
                conector
            );
            descripcionMejorada += '\n\n';
            descripcionMejorada += formatoIdealPara.replace('{texto}', config.ideal_para) + '\n\n';
            descripcionMejorada += `${formatoCaracteristicas}\n`;
            const caracteristicas = this.generarCaracteristicas(producto, config);
            caracteristicas.forEach(c => {
                descripcionMejorada += `• ${c}\n`;
            });
            descripcionMejorada += '\n';
            descripcionMejorada += this.generarInfoEnvio(producto) + '\n\n';
            descripcionMejorada += cta;
        }
        
        // ESTRUCTURA 3: Compacta (emoji + nombre → ideal para → descripción + características → envío → CTA)
        else {
            descripcionMejorada += `${emoji} ${producto.nombre}\n`;
            descripcionMejorada += formatoIdealPara.replace('{texto}', config.ideal_para) + '\n\n';
            descripcionMejorada += this.expandirDescripcion(
                producto.descripcion_original || producto.descripcion || '',
                config.palabras_clave,
                conector
            );
            descripcionMejorada += '\n\n';
            descripcionMejorada += `${formatoCaracteristicas}\n`;
            const caracteristicas = this.generarCaracteristicas(producto, config);
            caracteristicas.forEach(c => {
                descripcionMejorada += `• ${c}\n`;
            });
            descripcionMejorada += '\n';
            descripcionMejorada += this.generarInfoEnvio(producto) + '\n\n';
            descripcionMejorada += cta;
        }
        
        return descripcionMejorada.trim();
    }
    
    /**
     * Seleccionar elemento aleatorio de un array
     */
    seleccionarAleatorio(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    /**
     * Generar información de envío variada
     */
    generarInfoEnvio(producto) {
        if (producto.envio) {
            return `📦 Envío: ${producto.envio}`;
        }
        
        const opcionesEnvio = [
            '📦 Envío: Coordinamos según tu ubicación',
            '🚚 Hacemos envíos a domicilio',
            '📍 Retiro en zona o envío a coordinar',
            '🚚 Envíos a todo el país',
            '📦 Consultá por envío a tu zona'
        ];
        
        return this.seleccionarAleatorio(opcionesEnvio);
    }
    
    /**
     * Expande una descripción corta usando palabras clave
     * VERSIÓN MEJORADA: Con más variaciones
     */
    expandirDescripcion(descripcionOriginal, palabrasClave, conector = 'Además,') {
        if (!descripcionOriginal || descripcionOriginal.trim().length === 0) {
            // Variaciones cuando no hay descripción original
            const variaciones = [
                `Producto de ${palabrasClave[0]} ${palabrasClave[1]}, perfecto para quienes buscan ${palabrasClave[2]}.`,
                `${palabrasClave[0]} y ${palabrasClave[1]}, ideal para tu día a día.`,
                `Con ${palabrasClave[0]} ${palabrasClave[2]}, pensado especialmente para vos.`,
                `De ${palabrasClave[1]} superior, ${palabrasClave[0]} que no vas a encontrar en otro lado.`
            ];
            return this.seleccionarAleatorio(variaciones);
        }
        
        // Si ya es larga, devolverla como está
        if (descripcionOriginal.length > 150) {
            return descripcionOriginal;
        }
        
        // Si es corta, expandirla con variaciones
        const palabra1 = palabrasClave[0] || 'excelente';
        const palabra2 = palabrasClave[1] || 'calidad';
        const palabra3 = palabrasClave[2] || 'lo mejor';
        
        const expansiones = [
            `${descripcionOriginal}. ${conector} es ${palabra1} y ${palabra2}, ideal para quienes buscan ${palabra3}.`,
            `${descripcionOriginal} - ${palabra1}, ${palabra2}, y con ese toque especial que estás buscando.`,
            `${descripcionOriginal}. Con ${palabra1} ${palabra2}, perfecto para disfrutar.`,
            `${descripcionOriginal}. ${conector} combina ${palabra1} con ${palabra2} de forma única.`
        ];
        
        return this.seleccionarAleatorio(expansiones);
    }
    
    /**
     * Genera características basadas en el producto
     */
    generarCaracteristicas(producto, config) {
        const caracteristicas = [];
        
        // Características del producto
        if (producto.material) {
            caracteristicas.push(`Material: ${producto.material}`);
        }
        if (producto.tamaño || producto.tamano) {
            caracteristicas.push(`Tamaño: ${producto.tamaño || producto.tamano}`);
        }
        if (producto.peso) {
            caracteristicas.push(`Peso: ${producto.peso}`);
        }
        if (producto.color || producto.colores) {
            caracteristicas.push(`Color: ${producto.color || producto.colores}`);
        }
        if (producto.origen) {
            caracteristicas.push(`Origen: ${producto.origen}`);
        }
        
        // Características genéricas si no hay específicas
        if (caracteristicas.length === 0) {
            caracteristicas.push('Producto de alta calidad');
            caracteristicas.push('Hecho con dedicación y cuidado');
            
            // Agregar algo específico de la categoría
            if (config.tips && config.tips.length > 0) {
                const tip = config.tips[0].replace('Mencioná', 'Incluye')
                                          .replace('Indicá', 'Especifica')
                                          .replace('Destacá', 'Con');
                caracteristicas.push(tip);
            }
        }
        
        // Siempre agregar algo sobre entrega/servicio
        if (!producto.envio) {
            caracteristicas.push('Entrega coordinada según tu preferencia');
        }
        
        return caracteristicas.slice(0, 5); // Máximo 5 características
    }
    
    /**
     * Genera sugerencias personalizadas
     */
    generarSugerencias(producto) {
        const analisis = this.analizarDescripcion(
            producto.descripcion || producto.descripcion_original || '',
            producto
        );
        
        const config = this.categorias[producto.categoria] || this.categorias['otros'];
        
        return {
            nivel: analisis.nivel,
            mensaje_motivacional: analisis.mensaje_motivacional,
            problemas: analisis.problemas,
            sugerencias: analisis.sugerencias,
            tips_categoria: config.tips,
            ejemplo_mejorado: this.mejorarDescripcion(producto)
        };
    }
    
    /**
     * Interfaz principal para usar en el sistema
     */
    async procesarProducto(producto) {
        try {
            // Análisis
            const sugerencias = this.generarSugerencias(producto);
            
            // Si puede mejorar mucho, ofrecer mejora automática
            if (sugerencias.nivel === 'puede_mejorar') {
                return {
                    necesita_mejora: true,
                    nivel: sugerencias.nivel,
                    mensaje_motivacional: sugerencias.mensaje_motivacional,
                    problemas: sugerencias.problemas,
                    sugerencias: sugerencias.sugerencias,
                    descripcion_mejorada: sugerencias.ejemplo_mejorado,
                    mensaje: `💚 ¡Podés mejorarla! ¿Querés que te ayude a hacerla más atractiva?`
                };
            }
            
            // Si es buena pero puede mejorar
            if (sugerencias.nivel === 'buena' || sugerencias.nivel === 'muy_buena') {
                return {
                    necesita_mejora: false,
                    nivel: sugerencias.nivel,
                    mensaje_motivacional: sugerencias.mensaje_motivacional,
                    sugerencias: sugerencias.sugerencias,
                    mensaje: sugerencias.mensaje_motivacional
                };
            }
            
            // Excelente
            return {
                necesita_mejora: false,
                nivel: sugerencias.nivel,
                mensaje_motivacional: sugerencias.mensaje_motivacional,
                mensaje: '✨ ¡Excelente descripción! Está perfecta. 🌟'
            };
            
        } catch (error) {
            console.error('Error procesando producto:', error);
            return {
                error: true,
                mensaje: 'Hubo un error al analizar tu producto. Intentá de nuevo.'
            };
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// INTEGRACIÓN CON CRESALIA
// ═══════════════════════════════════════════════════════════════

// Instancia global
const iaDescripciones = new IADescripciones();

/**
 * Función para usar en el panel de carga de productos
 */
async function mejorarDescripcionProducto(producto) {
    const resultado = await iaDescripciones.procesarProducto(producto);
    return resultado;
}

/**
 * Función para mostrar sugerencias en tiempo real mientras escribe
 */
function mostrarSugerenciasEnVivo(textarea, producto) {
    const contenedorSugerencias = document.createElement('div');
    contenedorSugerencias.className = 'sugerencias-ia';
    contenedorSugerencias.style.cssText = `
        margin-top: 10px;
        padding: 15px;
        background: linear-gradient(135deg, #E8F5E8, #C8E6C9);
        border-radius: 10px;
        border-left: 4px solid #4CAF50;
    `;
    
    textarea.parentElement.appendChild(contenedorSugerencias);
    
    // Analizar mientras escribe (debounce de 1 segundo)
    let timeout;
    textarea.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            producto.descripcion = textarea.value;
            const analisis = iaDescripciones.generarSugerencias(producto);
            
            contenedorSugerencias.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <strong style="color: #2E7D32;">${analisis.mensaje_motivacional}</strong>
                </div>
                ${analisis.sugerencias.length > 0 ? `
                    <div style="margin-top: 10px;">
                        <strong style="color: #2E7D32;">💡 Sugerencias:</strong>
                        <ul style="margin: 5px 0 0 20px; color: #1B5E20;">
                            ${analisis.sugerencias.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${analisis.nivel === 'puede_mejorar' ? `
                    <button onclick="aplicarMejoraAutomatica('${textarea.id}')" 
                            style="margin-top: 10px; padding: 8px 15px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ✨ Mejorar Automáticamente
                    </button>
                ` : ''}
            `;
        }, 1000);
    });
}

/**
 * Aplicar mejora automática
 */
function aplicarMejoraAutomatica(textareaId) {
    const textarea = document.getElementById(textareaId);
    const producto = {
        nombre: document.getElementById('nombre_producto').value,
        descripcion_original: textarea.value,
        categoria: document.getElementById('categoria').value
    };
    
    const mejorada = iaDescripciones.mejorarDescripcion(producto);
    textarea.value = mejorada;
    
    // Trigger evento para actualizar sugerencias
    textarea.dispatchEvent(new Event('input'));
    
    // Mostrar notificación
    mostrarNotificacion('✨ Descripción mejorada automáticamente!', 'success');
}

/**
 * Mostrar notificación
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notif = document.createElement('div');
    notif.className = `notificacion notificacion-${tipo}`;
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${tipo === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Exportar para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IADescripciones;
}

