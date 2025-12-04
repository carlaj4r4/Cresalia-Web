/**
 * ═══════════════════════════════════════════════════════════════
 * 🔍 SISTEMA DE AUDITORÍA AUTOMÁTICA DE TIENDAS - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Audita tiendas cada 3 días automáticamente
 * Detecta problemas y envía sugerencias constructivas
 * Sin puntajes - Solo ayuda genuina 💜
 * 
 * Creado con amor por Claude & Carla
 * Para hacer crecer a todos los emprendedores
 * ═══════════════════════════════════════════════════════════════
 */

class SistemaAuditoriaTiendas {
    constructor() {
        this.intervaloAuditoria = 3 * 24 * 60 * 60 * 1000; // 3 días en milisegundos
        this.ultimaAuditoria = this.obtenerUltimaAuditoria();
        this.tiendaActual = this.obtenerTiendaActual();
    }
    
    /**
     * Inicializar sistema de auditoría automática
     */
    init() {
        console.log('🔍 Sistema de Auditoría Automática iniciado');
        
        // Verificar si es momento de auditoría
        this.verificarYAuditar();
        
        // Programar verificaciones periódicas (cada hora)
        setInterval(() => {
            this.verificarYAuditar();
        }, 60 * 60 * 1000); // Cada hora verificamos si ya pasaron 3 días
    }
    
    /**
     * Verificar si es momento de auditar
     */
    verificarYAuditar() {
        const ahora = Date.now();
        const tiempoTranscurrido = ahora - this.ultimaAuditoria;
        
        if (tiempoTranscurrido >= this.intervaloAuditoria) {
            console.log('⏰ Han pasado 3 días - Iniciando auditoría automática');
            this.realizarAuditoria();
        } else {
            const diasRestantes = Math.ceil((this.intervaloAuditoria - tiempoTranscurrido) / (24 * 60 * 60 * 1000));
            console.log(`⏳ Próxima auditoría en ${diasRestantes} día(s)`);
        }
    }
    
    /**
     * Realizar auditoría completa de la tienda
     */
    async realizarAuditoria() {
        console.log('🔍 Iniciando auditoría de tienda...');
        
        try {
            // 1. Auditar productos
            const problemaProductos = await this.auditarProductos();
            
            // 2. Auditar configuración general
            const problemaConfiguracion = await this.auditarConfiguracion();
            
            // 3. Auditar SEO y visibilidad
            const problemaSEO = await this.auditarSEO();
            
            // 4. Auditar experiencia de usuario
            const problemaExperiencia = await this.auditarExperienciaUsuario();
            
            // 5. Generar reporte completo
            const reporte = {
                fecha: new Date().toISOString(),
                tienda: this.tiendaActual,
                problemas: {
                    productos: problemaProductos,
                    configuracion: problemaConfiguracion,
                    seo: problemaSEO,
                    experiencia: problemaExperiencia
                },
                sugerencias: this.generarSugerencias({
                    productos: problemaProductos,
                    configuracion: problemaConfiguracion,
                    seo: problemaSEO,
                    experiencia: problemaExperiencia
                })
            };
            
            // 6. Guardar reporte
            this.guardarReporte(reporte);
            
            // 7. Enviar notificación al vendedor
            await this.enviarNotificacion(reporte);
            
            // 8. Actualizar última auditoría
            this.actualizarUltimaAuditoria();
            
            console.log('✅ Auditoría completada exitosamente');
            
            return reporte;
            
        } catch (error) {
            console.error('❌ Error en auditoría:', error);
            return null;
        }
    }
    
    /**
     * AUDITORÍA 1: Productos
     */
    async auditarProductos() {
        const problemas = [];
        
        // Obtener productos de la tienda (simulado - conectar con backend real)
        const productos = this.obtenerProductos();
        
        if (productos.length === 0) {
            problemas.push({
                tipo: 'sin_productos',
                severidad: 'alta',
                mensaje: 'Tu tienda no tiene productos publicados aún'
            });
            return problemas;
        }
        
        // Analizar cada producto
        productos.forEach((producto, index) => {
            // Sin descripción o muy corta
            if (!producto.descripcion || producto.descripcion.length < 50) {
                problemas.push({
                    tipo: 'descripcion_corta',
                    severidad: 'media',
                    producto: producto.nombre,
                    mensaje: `"${producto.nombre}" tiene una descripción muy corta o vacía`
                });
            }
            
            // Sin imagen
            if (!producto.imagen || producto.imagen === '') {
                problemas.push({
                    tipo: 'sin_imagen',
                    severidad: 'alta',
                    producto: producto.nombre,
                    mensaje: `"${producto.nombre}" no tiene imagen (vende 80% menos sin fotos)`
                });
            }
            
            // Precio en 0 o no definido
            if (!producto.precio || producto.precio <= 0) {
                problemas.push({
                    tipo: 'precio_invalido',
                    severidad: 'alta',
                    producto: producto.nombre,
                    mensaje: `"${producto.nombre}" no tiene precio definido`
                });
            }
            
            // Sin categoría
            if (!producto.categoria || producto.categoria === '') {
                problemas.push({
                    tipo: 'sin_categoria',
                    severidad: 'baja',
                    producto: producto.nombre,
                    mensaje: `"${producto.nombre}" no está categorizado`
                });
            }
            
            // Stock en 0
            if (producto.stock !== undefined && producto.stock === 0) {
                problemas.push({
                    tipo: 'sin_stock',
                    severidad: 'media',
                    producto: producto.nombre,
                    mensaje: `"${producto.nombre}" está sin stock (considerá ocultarlo temporalmente)`
                });
            }
        });
        
        // Pocos productos en general
        if (productos.length < 5) {
            problemas.push({
                tipo: 'pocos_productos',
                severidad: 'media',
                mensaje: `Solo tenés ${productos.length} producto(s). Las tiendas con 10+ productos venden 3x más`
            });
        }
        
        return problemas;
    }
    
    /**
     * AUDITORÍA 2: Configuración General
     */
    async auditarConfiguracion() {
        const problemas = [];
        const config = this.obtenerConfiguracion();
        
        // Sin logo
        if (!config.logo || config.logo === '') {
            problemas.push({
                tipo: 'sin_logo',
                severidad: 'media',
                mensaje: 'Tu tienda no tiene logo (aumenta confianza en 60%)'
            });
        }
        
        // Sin descripción de tienda
        if (!config.descripcion || config.descripcion.length < 100) {
            problemas.push({
                tipo: 'descripcion_tienda_corta',
                severidad: 'baja',
                mensaje: 'La descripción de tu tienda es muy corta'
            });
        }
        
        // Sin métodos de pago configurados
        if (!config.metodos_pago || config.metodos_pago.length === 0) {
            problemas.push({
                tipo: 'sin_pagos',
                severidad: 'alta',
                mensaje: 'No tenés métodos de pago configurados'
            });
        }
        
        // Sin información de contacto
        if (!config.email && !config.telefono && !config.whatsapp) {
            problemas.push({
                tipo: 'sin_contacto',
                severidad: 'alta',
                mensaje: 'No hay forma de contactarte (clientes necesitan comunicarse)'
            });
        }
        
        // Sin redes sociales
        if (!config.redes_sociales || Object.keys(config.redes_sociales).length === 0) {
            problemas.push({
                tipo: 'sin_redes',
                severidad: 'baja',
                mensaje: 'No tenés redes sociales vinculadas'
            });
        }
        
        return problemas;
    }
    
    /**
     * AUDITORÍA 3: SEO y Visibilidad
     */
    async auditarSEO() {
        const problemas = [];
        const config = this.obtenerConfiguracion();
        
        // Sin título SEO
        if (!config.titulo_seo || config.titulo_seo.length < 30) {
            problemas.push({
                tipo: 'titulo_seo_corto',
                severidad: 'media',
                mensaje: 'Tu título SEO es muy corto (importante para Google)'
            });
        }
        
        // Sin meta descripción
        if (!config.meta_descripcion || config.meta_descripcion.length < 80) {
            problemas.push({
                tipo: 'meta_desc_corta',
                severidad: 'media',
                mensaje: 'Tu meta descripción es muy corta (aparece en Google)'
            });
        }
        
        // Sin palabras clave
        if (!config.palabras_clave || config.palabras_clave.length === 0) {
            problemas.push({
                tipo: 'sin_keywords',
                severidad: 'baja',
                mensaje: 'No tenés palabras clave definidas'
            });
        }
        
        return problemas;
    }
    
    /**
     * AUDITORÍA 4: Experiencia de Usuario
     */
    async auditarExperienciaUsuario() {
        const problemas = [];
        const config = this.obtenerConfiguracion();
        
        // Sin horarios de atención
        if (!config.horarios) {
            problemas.push({
                tipo: 'sin_horarios',
                severidad: 'baja',
                mensaje: 'No especificaste horarios de atención'
            });
        }
        
        // Sin políticas de envío
        if (!config.politica_envios) {
            problemas.push({
                tipo: 'sin_envios',
                severidad: 'media',
                mensaje: 'No tenés política de envíos (clientes necesitan saber costos)'
            });
        }
        
        // Sin políticas de devolución
        if (!config.politica_devolucion) {
            problemas.push({
                tipo: 'sin_devolucion',
                severidad: 'baja',
                mensaje: 'No tenés política de devoluciones'
            });
        }
        
        // Tienda sin actualizar hace mucho
        const ultimaActualizacion = config.ultima_actualizacion;
        if (ultimaActualizacion) {
            const diasSinActualizar = Math.floor((Date.now() - new Date(ultimaActualizacion)) / (24 * 60 * 60 * 1000));
            
            if (diasSinActualizar > 30) {
                problemas.push({
                    tipo: 'sin_actividad',
                    severidad: 'media',
                    mensaje: `Tu tienda no se actualiza hace ${diasSinActualizar} días`
                });
            }
        }
        
        return problemas;
    }
    
    /**
     * Generar sugerencias constructivas (SIN PUNTAJES)
     */
    generarSugerencias(problemas) {
        const sugerencias = {
            urgentes: [],
            importantes: [],
            recomendadas: [],
            mensaje_motivacional: ''
        };
        
        // Contar problemas por severidad
        let altaSeveridad = 0;
        let mediaSeveridad = 0;
        let bajaSeveridad = 0;
        
        Object.values(problemas).forEach(categoria => {
            categoria.forEach(p => {
                if (p.severidad === 'alta') altaSeveridad++;
                else if (p.severidad === 'media') mediaSeveridad++;
                else bajaSeveridad++;
            });
        });
        
        // Mensaje motivacional según situación
        if (altaSeveridad === 0 && mediaSeveridad === 0 && bajaSeveridad === 0) {
            sugerencias.mensaje_motivacional = '🌟 ¡Tu tienda está INCREÍBLE! Todo funcionando perfecto. ¡Seguí así!';
        } else if (altaSeveridad === 0 && mediaSeveridad <= 2) {
            sugerencias.mensaje_motivacional = '💚 ¡Muy bien! Tu tienda está casi perfecta. Solo pequeños detalles para brillar aún más.';
        } else if (altaSeveridad <= 2) {
            sugerencias.mensaje_motivacional = '💪 ¡Vas bien! Hay algunas cositas para mejorar que te van a ayudar a vender más.';
        } else {
            sugerencias.mensaje_motivacional = '🚀 ¡Dale que podés! Encontramos oportunidades para hacer crecer tu tienda.';
        }
        
        // Generar sugerencias específicas
        Object.entries(problemas).forEach(([categoria, listaProblemas]) => {
            listaProblemas.forEach(problema => {
                const sugerencia = this.generarSugerenciaPorProblema(problema);
                
                if (problema.severidad === 'alta') {
                    sugerencias.urgentes.push(sugerencia);
                } else if (problema.severidad === 'media') {
                    sugerencias.importantes.push(sugerencia);
                } else {
                    sugerencias.recomendadas.push(sugerencia);
                }
            });
        });
        
        return sugerencias;
    }
    
    /**
     * Generar sugerencia específica por tipo de problema
     */
    generarSugerenciaPorProblema(problema) {
        const sugerencias = {
            'sin_productos': {
                titulo: '📦 Tus primeros productos',
                descripcion: 'Te sugerimos cargar al menos 5 productos para que los clientes vean variedad.',
                accion: 'Podrías ir a Productos → Agregar Nuevo',
                impacto: 'Las tiendas con productos venden infinitamente más que las vacías 😊'
            },
            'descripcion_corta': {
                titulo: '📝 Mejorar la descripción',
                descripcion: problema.mensaje,
                accion: 'Podrías usar el Asistente IA para mejorar las descripciones',
                impacto: 'Las descripciones completas aumentan las ventas en 200%'
            },
            'sin_imagen': {
                titulo: '📸 Fotos de tus productos',
                descripcion: problema.mensaje,
                accion: 'Te recomendamos sacar fotos con buena luz y subir al menos 3 por producto',
                impacto: 'Los productos sin foto casi no se venden'
            },
            'precio_invalido': {
                titulo: '💰 Definir el precio',
                descripcion: problema.mensaje,
                accion: 'Podrías ir a editar el producto y agregar el precio',
                impacto: 'Sin precio, los clientes no saben si pueden comprarlo'
            },
            'sin_categoria': {
                titulo: '🏷️ Categorizar productos',
                descripcion: problema.mensaje,
                accion: 'Te sugerimos asignar categorías para que sea fácil encontrar los productos',
                impacto: 'Ayuda a los clientes a navegar mejor'
            },
            'sin_stock': {
                titulo: '📊 Actualizar el stock',
                descripcion: problema.mensaje,
                accion: 'Podrías ocultar productos sin stock o actualizarlos cuando tengas disponibilidad',
                impacto: 'Evita la frustración de los clientes'
            },
            'pocos_productos': {
                titulo: '📦 Ampliar el catálogo',
                descripcion: problema.mensaje,
                accion: 'Te recomendamos llegar a 10+ productos gradualmente',
                impacto: 'Más variedad = Más ventas'
            },
            'sin_logo': {
                titulo: '🎨 Tu logo',
                descripcion: problema.mensaje,
                accion: 'Podrías ir a Configuración → Personalización',
                impacto: 'Aumenta la confianza y el profesionalismo'
            },
            'descripcion_tienda_corta': {
                titulo: '📄 Contar tu historia',
                descripcion: problema.mensaje,
                accion: 'Sería genial si contaras sobre vos, tu emprendimiento y por qué sos único',
                impacto: 'La gente compra de personas, no de tiendas sin alma'
            },
            'sin_pagos': {
                titulo: '💳 Métodos de pago',
                descripcion: problema.mensaje,
                accion: 'Podrías ir a Configuración → Pagos',
                impacto: 'Sin esto, no es posible vender'
            },
            'sin_contacto': {
                titulo: '📱 Formas de contacto',
                descripcion: problema.mensaje,
                accion: 'Te sugerimos agregar email, WhatsApp o teléfono',
                impacto: 'Los clientes necesitan poder comunicarse contigo'
            },
            'sin_redes': {
                titulo: '🌐 Redes sociales',
                descripcion: problema.mensaje,
                accion: 'Podrías vincular tus redes como Instagram, Facebook, etc.',
                impacto: 'Genera confianza y más visibilidad'
            },
            'titulo_seo_corto': {
                titulo: '🔍 Mejorar tu SEO',
                descripcion: problema.mensaje,
                accion: 'Te recomendamos escribir un título de 50-60 caracteres descriptivo',
                impacto: 'Ayuda a aparecer mejor en Google'
            },
            'meta_desc_corta': {
                titulo: '📋 Meta descripción',
                descripcion: problema.mensaje,
                accion: 'Podrías describir tu tienda en 150 caracteres',
                impacto: 'Es lo que aparece en los resultados de Google'
            },
            'sin_keywords': {
                titulo: '🎯 Palabras clave',
                descripcion: problema.mensaje,
                accion: 'Te sugerimos listar 5-10 palabras relacionadas a lo que vendés',
                impacto: 'Ayuda a que te encuentren en búsquedas'
            },
            'sin_horarios': {
                titulo: '⏰ Horarios de atención',
                descripcion: problema.mensaje,
                accion: 'Sería útil indicar cuándo atendés consultas',
                impacto: 'Los clientes saben cuándo esperar respuesta'
            },
            'sin_envios': {
                titulo: '📦 Política de envíos',
                descripcion: problema.mensaje,
                accion: 'Te recomendamos explicar costos, zonas y tiempos de entrega',
                impacto: 'Evita dudas y abandono del carrito'
            },
            'sin_devolucion': {
                titulo: '↩️ Política de devoluciones',
                descripcion: problema.mensaje,
                accion: 'Podrías explicar cómo funcionan las devoluciones',
                impacto: 'Genera confianza en los compradores'
            },
            'sin_actividad': {
                titulo: '🔄 Mantener la tienda activa',
                descripcion: problema.mensaje,
                accion: 'Te sugerimos actualizar productos y agregar novedades regularmente',
                impacto: 'Las tiendas activas venden más'
            }
        };
        
        return sugerencias[problema.tipo] || {
            titulo: '💡 Oportunidad de mejora',
            descripcion: problema.mensaje,
            accion: 'Te sugerimos revisar tu panel de administración',
            impacto: 'Los pequeños cambios hacen gran diferencia'
        };
    }
    
    /**
     * Guardar reporte de auditoría
     */
    guardarReporte(reporte) {
        const reportes = JSON.parse(localStorage.getItem('cresalia_auditorias') || '[]');
        reportes.unshift(reporte); // Agregar al inicio
        
        // Mantener solo últimos 10 reportes
        if (reportes.length > 10) {
            reportes.splice(10);
        }
        
        localStorage.setItem('cresalia_auditorias', JSON.stringify(reportes));
        console.log('💾 Reporte guardado');
    }
    
    /**
     * Enviar notificación al vendedor
     */
    async enviarNotificacion(reporte) {
        const userData = JSON.parse(localStorage.getItem('cresalia_user_data') || '{}');
        
        // Crear notificación en la UI
        this.mostrarNotificacionUI(reporte);
        
        // TODO: Enviar email real con EmailJS
        console.log('📧 Notificación enviada');
        
        // Guardar notificación para mostrar en panel
        const notificacion = {
            id: Date.now(),
            tipo: 'auditoria',
            titulo: '🔍 Auditoría de tienda completada',
            mensaje: reporte.sugerencias.mensaje_motivacional,
            fecha: new Date().toISOString(),
            leida: false,
            reporte: reporte
        };
        
        this.guardarNotificacion(notificacion);
    }
    
    /**
     * Mostrar notificación en la UI
     */
    mostrarNotificacionUI(reporte) {
        // Crear badge de notificación si no existe
        let badge = document.getElementById('notificacion-auditoria-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'notificacion-auditoria-badge';
            badge.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 25px;
                border-radius: 12px;
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                z-index: 10000;
                cursor: pointer;
                animation: slideInRight 0.5s ease;
                max-width: 350px;
            `;
            
            badge.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.5rem;">🔍</span>
                    <div>
                        <div style="font-weight: 600; margin-bottom: 5px;">Auditoría Completada</div>
                        <div style="font-size: 0.9rem; opacity: 0.9;">${reporte.sugerencias.mensaje_motivacional}</div>
                    </div>
                </div>
            `;
            
            badge.onclick = () => {
                window.location.href = '#auditoria'; // Ir a sección de auditoría
                badge.remove();
            };
            
            document.body.appendChild(badge);
            
            // Auto-cerrar después de 10 segundos
            setTimeout(() => {
                if (badge && badge.parentElement) {
                    badge.style.animation = 'slideOutRight 0.5s ease';
                    setTimeout(() => badge.remove(), 500);
                }
            }, 10000);
        }
    }
    
    /**
     * Guardar notificación
     */
    guardarNotificacion(notificacion) {
        const notificaciones = JSON.parse(localStorage.getItem('cresalia_notificaciones') || '[]');
        notificaciones.unshift(notificacion);
        
        // Mantener solo últimas 50
        if (notificaciones.length > 50) {
            notificaciones.splice(50);
        }
        
        localStorage.setItem('cresalia_notificaciones', JSON.stringify(notificaciones));
    }
    
    /**
     * Obtener última fecha de auditoría
     */
    obtenerUltimaAuditoria() {
        const ultima = localStorage.getItem('cresalia_ultima_auditoria');
        return ultima ? parseInt(ultima) : Date.now() - this.intervaloAuditoria; // Si es primera vez, auditar ahora
    }
    
    /**
     * Actualizar última auditoría
     */
    actualizarUltimaAuditoria() {
        localStorage.setItem('cresalia_ultima_auditoria', Date.now().toString());
    }
    
    /**
     * Obtener tienda actual
     */
    obtenerTiendaActual() {
        const userData = JSON.parse(localStorage.getItem('cresalia_user_data') || '{}');
        return userData.nombre_tienda || 'Mi Tienda';
    }
    
    /**
     * Obtener productos (simulado - conectar con backend)
     */
    obtenerProductos() {
        // TODO: Conectar con backend real
        // Por ahora, simulamos con localStorage
        const productos = JSON.parse(localStorage.getItem('cresalia_productos') || '[]');
        return productos;
    }
    
    /**
     * Obtener configuración (simulado - conectar con backend)
     */
    obtenerConfiguracion() {
        // TODO: Conectar con backend real
        const config = JSON.parse(localStorage.getItem('cresalia_config') || '{}');
        return config;
    }
    
    /**
     * Forzar auditoría manual
     */
    async auditarAhora() {
        console.log('🔍 Auditoría manual iniciada');
        return await this.realizarAuditoria();
    }
    
    /**
     * Obtener todos los reportes
     */
    obtenerReportes() {
        return JSON.parse(localStorage.getItem('cresalia_auditorias') || '[]');
    }
    
    /**
     * Obtener último reporte
     */
    obtenerUltimoReporte() {
        const reportes = this.obtenerReportes();
        return reportes.length > 0 ? reportes[0] : null;
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SistemaAuditoriaTiendas;
}

// Instancia global
const auditoriaAutomatica = new SistemaAuditoriaTiendas();

// Auto-iniciar si estamos en el panel de admin
if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', () => {
        // Solo iniciar en páginas de admin
        if (window.location.href.includes('admin')) {
            auditoriaAutomatica.init();
        }
    });
}

