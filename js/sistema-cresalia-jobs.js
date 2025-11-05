// ===== SISTEMA CRESALIA JOBS =====
// Marketplace Ético de Empleo
// Autor: Carla & Claude - Diciembre 2024

class SistemaCresaliaJobs {
    constructor() {
        this.supabase = null;
        this.usuarioActual = null;
        this.tipoUsuario = null; // 'empleador' o 'buscador'
        this.init();
    }
    
    async init() {
        // Inicializar Supabase
        if (typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
            try {
                const config = window.SUPABASE_CONFIG;
                if (config.url && config.anonKey && !config.anonKey.includes('REEMPLAZA')) {
                    this.supabase = window.supabase.createClient(config.url, config.anonKey);
                }
            } catch (error) {
                console.error('Error inicializando Supabase para Cresalia Jobs:', error);
            }
        }
        
        // Verificar usuario actual
        await this.verificarUsuario();
    }
    
    async verificarUsuario() {
        // Verificar si hay usuario logueado
        const usuario = localStorage.getItem('cresalia_jobs_usuario');
        if (usuario) {
            this.usuarioActual = JSON.parse(usuario);
            this.tipoUsuario = this.usuarioActual.tipo;
        }
    }
    
    // ===== REGISTRO DE EMPLEADOR =====
    async registrarEmpleador(datos) {
        try {
            // ===== VALIDACIÓN DE SEGURIDAD =====
            let datosLimpios = datos;
            if (typeof window.seguridadValidacion !== 'undefined') {
                const esquema = {
                    nombre_empresa: { tipo: 'texto', maxLength: 100, minLength: 2, required: true },
                    razon_social: { tipo: 'texto', maxLength: 100, minLength: 2, required: false },
                    email: { tipo: 'email', required: true },
                    telefono: { tipo: 'telefono', required: false },
                    direccion: { tipo: 'texto', maxLength: 300, required: false },
                    descripcion: { tipo: 'texto', maxLength: 2000, required: false },
                    sector: { tipo: 'texto', maxLength: 100, required: false },
                    tamaño_empresa: { tipo: 'texto', maxLength: 50, required: false },
                    sitio_web: { tipo: 'url', required: false }
                };
                
                const validacion = window.seguridadValidacion.validarObjeto(datos, esquema);
                if (!validacion.valido) {
                    return { success: false, error: validacion.errores.join(', ') };
                }
                
                datosLimpios = window.seguridadValidacion.limpiarObjeto(validacion.datos);
            }
            
            const empleadorData = {
                nombre_empresa: datosLimpios.nombre_empresa,
                razon_social: datosLimpios.razon_social || datosLimpios.nombre_empresa,
                email: datosLimpios.email,
                telefono: datosLimpios.telefono || null,
                direccion: datosLimpios.direccion || null,
                descripcion: datosLimpios.descripcion || null,
                sector: datosLimpios.sector || null,
                tamaño_empresa: datosLimpios.tamaño_empresa || null,
                sitio_web: datosLimpios.sitio_web || null,
                estado: 'verificando'
            };
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('empleadores')
                    .insert([empleadorData])
                    .select()
                    .single();
                
                if (error) throw error;
                
                // Guardar usuario
                this.usuarioActual = { ...data, tipo: 'empleador' };
                localStorage.setItem('cresalia_jobs_usuario', JSON.stringify(this.usuarioActual));
                this.tipoUsuario = 'empleador';
                
                return { success: true, empleador: data };
            } else {
                // Modo local
                const empleador = {
                    id: 'local_' + Date.now(),
                    ...empleadorData,
                    fecha_registro: new Date().toISOString()
                };
                this.usuarioActual = { ...empleador, tipo: 'empleador' };
                localStorage.setItem('cresalia_jobs_usuario', JSON.stringify(this.usuarioActual));
                localStorage.setItem('empleadores_local', JSON.stringify(
                    JSON.parse(localStorage.getItem('empleadores_local') || '[]').concat([empleador])
                ));
                return { success: true, empleador };
            }
        } catch (error) {
            console.error('Error registrando empleador:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ===== REGISTRO DE BUSCADOR =====
    async registrarBuscador(datos) {
        try {
            // ===== VALIDACIÓN DE SEGURIDAD =====
            let datosLimpios = datos;
            if (typeof window.seguridadValidacion !== 'undefined') {
                const esquema = {
                    nombre: { tipo: 'texto', maxLength: 100, minLength: 2, required: true },
                    email: { tipo: 'email', required: true },
                    telefono: { tipo: 'telefono', required: false },
                    ubicacion: { tipo: 'texto', maxLength: 200, required: false },
                    perfil_profesional: { tipo: 'texto', maxLength: 2000, required: false },
                    experiencia_años: { tipo: 'numero', min: 0, max: 100, entero: true, required: false }
                };
                
                const validacion = window.seguridadValidacion.validarObjeto(datos, esquema);
                if (!validacion.valido) {
                    return { success: false, error: validacion.errores.join(', ') };
                }
                
                datosLimpios = window.seguridadValidacion.limpiarObjeto(validacion.datos);
            }
            
            const buscadorData = {
                nombre: datosLimpios.nombre,
                email: datosLimpios.email,
                telefono: datosLimpios.telefono || null,
                ubicacion: datosLimpios.ubicacion || null,
                perfil_profesional: datosLimpios.perfil_profesional || null,
                experiencia_años: datosLimpios.experiencia_años || 0,
                habilidades: datos.habilidades || [],
                educacion: datos.educacion,
                disponibilidad: datos.disponibilidad,
                modalidad_preferida: datos.modalidad_preferida || [],
                salario_minimo: datos.salario_minimo
            };
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('buscadores_empleo')
                    .insert([buscadorData])
                    .select()
                    .single();
                
                if (error) throw error;
                
                this.usuarioActual = { ...data, tipo: 'buscador' };
                localStorage.setItem('cresalia_jobs_usuario', JSON.stringify(this.usuarioActual));
                this.tipoUsuario = 'buscador';
                
                return { success: true, buscador: data };
            } else {
                const buscador = {
                    id: 'local_' + Date.now(),
                    ...buscadorData,
                    fecha_registro: new Date().toISOString()
                };
                this.usuarioActual = { ...buscador, tipo: 'buscador' };
                localStorage.setItem('cresalia_jobs_usuario', JSON.stringify(this.usuarioActual));
                localStorage.setItem('buscadores_local', JSON.stringify(
                    JSON.parse(localStorage.getItem('buscadores_local') || '[]').concat([buscador])
                ));
                return { success: true, buscador };
            }
        } catch (error) {
            console.error('Error registrando buscador:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ===== PUBLICAR OFERTA DE EMPLEO =====
    async publicarOferta(datos) {
        if (this.tipoUsuario !== 'empleador') {
            return { success: false, error: 'Solo los empleadores pueden publicar ofertas' };
        }
        
        try {
            // Validar que el salario sea obligatorio
            if (!datos.salario_minimo || datos.salario_minimo <= 0) {
                return { success: false, error: 'El salario mínimo es obligatorio. No permitimos "a convenir".' };
            }
            
            const ofertaData = {
                empleador_id: this.usuarioActual.id,
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                requisitos: datos.requisitos,
                responsabilidades: datos.responsabilidades,
                salario_minimo: datos.salario_minimo,
                salario_maximo: datos.salario_maximo,
                moneda: datos.moneda || 'ARS',
                modalidad: datos.modalidad,
                ubicacion: datos.ubicacion,
                jornada: datos.jornada,
                tipo_contrato: datos.tipo_contrato,
                beneficios: datos.beneficios || [],
                fecha_inicio: datos.fecha_inicio,
                categoria: datos.categoria,
                nivel_experiencia: datos.nivel_experiencia,
                fecha_cierre: datos.fecha_cierre
            };
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('ofertas_empleo')
                    .insert([ofertaData])
                    .select()
                    .single();
                
                if (error) throw error;
                return { success: true, oferta: data };
            } else {
                const oferta = {
                    id: 'local_' + Date.now(),
                    ...ofertaData,
                    fecha_publicacion: new Date().toISOString(),
                    estado: 'activa',
                    vistas: 0,
                    postulaciones: 0
                };
                localStorage.setItem('ofertas_local', JSON.stringify(
                    JSON.parse(localStorage.getItem('ofertas_local') || '[]').concat([oferta])
                ));
                return { success: true, oferta };
            }
        } catch (error) {
            console.error('Error publicando oferta:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ===== BUSCAR OFERTAS =====
    async buscarOfertas(filtros = {}) {
        try {
            let ofertas = [];
            
            if (this.supabase) {
                let query = this.supabase
                    .from('ofertas_empleo')
                    .select('*, empleadores(*)')
                    .eq('estado', 'activa');
                
                if (filtros.categoria) {
                    query = query.eq('categoria', filtros.categoria);
                }
                if (filtros.modalidad) {
                    query = query.eq('modalidad', filtros.modalidad);
                }
                if (filtros.nivel_experiencia) {
                    query = query.eq('nivel_experiencia', filtros.nivel_experiencia);
                }
                if (filtros.salario_minimo) {
                    query = query.gte('salario_minimo', filtros.salario_minimo);
                }
                
                query = query.order('fecha_publicacion', { ascending: false });
                
                const { data, error } = await query;
                if (error) throw error;
                ofertas = data || [];
            } else {
                ofertas = JSON.parse(localStorage.getItem('ofertas_local') || '[]')
                    .filter(o => o.estado === 'activa');
                
                // Aplicar filtros
                if (filtros.categoria) {
                    ofertas = ofertas.filter(o => o.categoria === filtros.categoria);
                }
                if (filtros.modalidad) {
                    ofertas = ofertas.filter(o => o.modalidad === filtros.modalidad);
                }
                if (filtros.salario_minimo) {
                    ofertas = ofertas.filter(o => o.salario_minimo >= filtros.salario_minimo);
                }
            }
            
            return { success: true, ofertas };
        } catch (error) {
            console.error('Error buscando ofertas:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ===== POSTULARSE A OFERTA =====
    async postularseAOferta(ofertaId, mensaje = '') {
        if (this.tipoUsuario !== 'buscador') {
            return { success: false, error: 'Solo los buscadores pueden postularse' };
        }
        
        try {
            const postulacionData = {
                oferta_id: ofertaId,
                buscador_id: this.usuarioActual.id,
                mensaje_personalizado: mensaje
            };
            
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('postulaciones')
                    .insert([postulacionData])
                    .select()
                    .single();
                
                if (error) {
                    if (error.code === '23505') { // Unique violation
                        return { success: false, error: 'Ya te postulaste a esta oferta' };
                    }
                    throw error;
                }
                
                // Incrementar contador de postulaciones
                await this.supabase.rpc('incrementar_postulaciones', { oferta_id: ofertaId });
                
                return { success: true, postulacion: data };
            } else {
                const postulacion = {
                    id: 'local_' + Date.now(),
                    ...postulacionData,
                    estado: 'pendiente',
                    fecha_postulacion: new Date().toISOString()
                };
                localStorage.setItem('postulaciones_local', JSON.stringify(
                    JSON.parse(localStorage.getItem('postulaciones_local') || '[]').concat([postulacion])
                ));
                return { success: true, postulacion };
            }
        } catch (error) {
            console.error('Error postulándose:', error);
            return { success: false, error: error.message };
        }
    }
    
    // ===== PAGAR PUBLICACIÓN (CON MERCADO PAGO - PRODUCCIÓN) =====
    async pagarPublicacionOferta(ofertaId, tipo = 'publicacion') {
        try {
            // Configurar Mercado Pago con PRIVACIDAD
            const config = this.obtenerConfigMercadoPagoPrivada();
            
            if (!config || !config.publicKey) {
                return { success: false, error: 'Mercado Pago no configurado' };
            }
            
            // Verificar que Mercado Pago SDK esté cargado
            if (typeof MercadoPago === 'undefined') {
                return { success: false, error: 'Mercado Pago SDK no está cargado. Por favor, recargá la página.' };
            }
            
            // Inicializar Mercado Pago
            const mp = new MercadoPago(config.publicKey, {
                locale: 'es-AR'
            });
            
            // Precios según tipo
            const precio = tipo === 'publicacion' ? 500 : 1000; // Destacado más caro
            
            // Crear preferencia de pago con nombre comercial "Cresalia"
            const preferenciaData = {
                items: [{
                    title: 'Publicación de Oferta - Cresalia Jobs',
                    description: tipo === 'publicacion' 
                        ? 'Publicación de oferta de empleo en Cresalia Jobs' 
                        : 'Publicación destacada de oferta de empleo en Cresalia Jobs',
                    quantity: 1,
                    unit_price: precio,
                    currency_id: 'ARS'
                }],
                payer: {
                    // Solo email para verificación interna de Mercado Pago
                    // El nombre comercial será "Cresalia" (configurado en statement_descriptor)
                    email: this.usuarioActual.email
                },
                statement_descriptor: 'Cresalia', // ✅ Lo que verá el cliente en su resumen de cuenta
                back_urls: {
                    success: `${window.location.origin}/cresalia-jobs/index.html?pago=exitoso`,
                    failure: `${window.location.origin}/cresalia-jobs/index.html?pago=fallido`,
                    pending: `${window.location.origin}/cresalia-jobs/index.html?pago=pendiente`
                },
                auto_return: 'approved',
                external_reference: `cresalia_jobs_${ofertaId}_${Date.now()}`,
                metadata: {
                    tipo: 'oferta_empleo',
                    oferta_id: ofertaId,
                    tipo_pago: tipo,
                    // NO incluir datos personales aquí
                    plataforma: 'cresalia-jobs'
                }
            };
            
            // Crear preferencia usando el SDK de Mercado Pago
            const response = await mp.preferences.create(preferenciaData);
            
            if (response && response.body && response.body.init_point) {
                // Redirigir a Mercado Pago
                window.location.href = response.body.init_point;
                return { 
                    success: true, 
                    redirect: true,
                    init_point: response.body.init_point
                };
            } else {
                throw new Error('No se pudo crear la preferencia de pago');
            }
        } catch (error) {
            console.error('Error procesando pago:', error);
            return { success: false, error: error.message || 'Error al procesar el pago' };
        }
    }
    
    // ===== CONFIGURACIÓN PRIVADA DE MERCADO PAGO =====
    obtenerConfigMercadoPagoPrivada() {
        // Esta función asegura que solo se use "Cresalia" como nombre
        if (typeof window.CONFIG_MERCADO_PAGO !== 'undefined') {
            const config = window.CONFIG_MERCADO_PAGO;
            const env = config.app?.environment || 'production';
            
            // Verificar que esté habilitado
            if (config.app?.enabled === false) {
                console.warn('⚠️ Mercado Pago está deshabilitado en la configuración');
                return null;
            }
            
            return {
                publicKey: config[env]?.publicKey || config.production?.publicKey,
                accessToken: config[env]?.accessToken || config.production?.accessToken,
                // Configuración de privacidad
                nombreComercial: 'Cresalia',
                ocultarDatosPersonales: true,
                statementDescriptor: config.app?.statement_descriptor || 'Cresalia', // Máximo 22 caracteres
                sandbox: env === 'sandbox',
                enabled: config.app?.enabled !== false
            };
        }
        
        // Fallback: usar configuración directa si está disponible
        if (typeof window !== 'undefined' && window.MERCADO_PAGO_CONFIG) {
            return {
                publicKey: window.MERCADO_PAGO_CONFIG.publicKey,
                accessToken: window.MERCADO_PAGO_CONFIG.accessToken,
                nombreComercial: 'Cresalia',
                ocultarDatosPersonales: true,
                statementDescriptor: window.MERCADO_PAGO_CONFIG.statement_descriptor || 'Cresalia',
                sandbox: window.MERCADO_PAGO_CONFIG.sandbox === true,
                enabled: window.MERCADO_PAGO_CONFIG.enabled !== false
            };
        }
        
        return null;
    }
}

// Hacer disponible globalmente
window.SistemaCresaliaJobs = SistemaCresaliaJobs;

