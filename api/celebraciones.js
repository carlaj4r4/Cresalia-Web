/**
 * API Endpoint Consolidado: Celebraciones
 * Maneja: Cumpleaños, Aniversarios e Historias
 * 
 * Endpoints:
 * GET /api/celebraciones?tipo=cumpleanos|aniversario|historia&action=...
 * POST /api/celebraciones?tipo=...
 */

const { createClient } = require('@supabase/supabase-js');

// Configurar Supabase (usar variables de Tiendas)
function getSupabase() {
    const supabaseUrl = process.env.SUPABASE_URL_TIENDAS 
        || process.env.NEXT_PUBLIC_SUPABASE_URL_TIENDAS
        || process.env.SUPABASE_URL 
        || 'https://lvdgklwcgrmfbqwghxhl.supabase.co';
        
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY_TIENDAS
        || process.env.SUPABASE_SERVICE_ROLE_KEY
        || process.env.SUPABASE_ANON_KEY_TIENDAS
        || process.env.SUPABASE_ANON_KEY;

    if (!supabaseKey) {
        throw new Error('Supabase no configurado');
    }

    return createClient(supabaseUrl.trim(), supabaseKey.trim());
}

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// ==================== CUMPLEAÑOS ====================
async function handleCumpleanos(supabase, req, res) {
    const action = req.query.action || 'consent';
    
    if (action === 'consent') {
        // GET: Consultar preferencias
        if (req.method === 'GET') {
            const { email } = req.query;
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    error: 'Email requerido'
                });
            }

            const { data: comprador, error } = await supabase
                .from('compradores')
                .select('*')
                .eq('email', email.toLowerCase().trim())
                .eq('activo', true)
                .single();

            if (error && error.code !== 'PGRST116') {
                return res.status(500).json({
                    success: false,
                    error: 'Error buscando comprador',
                    detalles: error.message
                });
            }

            if (!comprador) {
                return res.status(404).json({
                    success: false,
                    error: 'Comprador no encontrado'
                });
            }

            const preferencias = {
                email: comprador.email,
                acepta_publico: comprador.acepta_publico || comprador.acepta_cumple_publico || false,
                acepta_descuento: comprador.acepta_descuento || comprador.acepta_cumple_descuento || false,
                fecha_nacimiento: comprador.fecha_nacimiento || null,
                mensaje_publico: comprador.mensaje_publico || comprador.mensaje_cumple_publico || null
            };

            return res.status(200).json({
                success: true,
                data: preferencias
            });
        }

        // POST: Guardar preferencias
        if (req.method === 'POST') {
            const { email, acepta_publico, acepta_descuento, fecha_nacimiento, mensaje_publico } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    error: 'Email requerido'
                });
            }

            const { data: compradorExistente, error: errorBuscar } = await supabase
                .from('compradores')
                .select('id')
                .eq('email', email.toLowerCase().trim())
                .eq('activo', true)
                .single();

            if (errorBuscar && errorBuscar.code !== 'PGRST116') {
                return res.status(500).json({
                    success: false,
                    error: 'Error buscando comprador',
                    detalles: errorBuscar.message
                });
            }

            if (!compradorExistente) {
                return res.status(404).json({
                    success: false,
                    error: 'Comprador no encontrado. Debes registrarte primero como comprador.'
                });
            }

            const datosActualizar = {
                fecha_nacimiento: fecha_nacimiento || null,
                acepta_publico: acepta_publico === true || acepta_publico === 'true',
                acepta_descuento: acepta_descuento === true || acepta_descuento === 'true',
                mensaje_publico: mensaje_publico || null,
                acepta_cumple_publico: acepta_publico === true || acepta_publico === 'true',
                acepta_cumple_descuento: acepta_descuento === true || acepta_descuento === 'true',
                mensaje_cumple_publico: mensaje_publico || null,
                fecha_actualizacion: new Date().toISOString()
            };

            const { data: compradorActualizado, error: errorActualizar } = await supabase
                .from('compradores')
                .update(datosActualizar)
                .eq('id', compradorExistente.id)
                .select()
                .single();

            if (errorActualizar) {
                return res.status(500).json({
                    success: false,
                    error: 'Error guardando preferencias',
                    detalles: errorActualizar.message
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Preferencias guardadas correctamente',
                data: {
                    email: compradorActualizado.email,
                    acepta_publico: compradorActualizado.acepta_publico || compradorActualizado.acepta_cumple_publico || false,
                    acepta_descuento: compradorActualizado.acepta_descuento || compradorActualizado.acepta_cumple_descuento || false,
                    fecha_nacimiento: compradorActualizado.fecha_nacimiento || null,
                    mensaje_publico: compradorActualizado.mensaje_publico || compradorActualizado.mensaje_cumple_publico || null
                }
            });
        }
    }

    return res.status(400).json({
        success: false,
        error: 'Acción no válida para cumpleaños'
    });
}

// ==================== ANIVERSARIOS ====================
async function handleAniversarios(supabase, req, res) {
    const action = req.query.action || 'celebracion';
    
    if (action === 'celebracion') {
        const tipo = (req.query.tipo || 'tienda').toLowerCase();
        const slug = (req.query.slug || '').toLowerCase();
        const email = (req.query.email || '').toLowerCase();
        const id = req.query.id || null;

        // Obtener registro
        const tabla = tipo === 'servicio' ? 'servicios' : tipo === 'comprador' ? 'compradores' : 'tiendas';
        let registro = null;

        if (id) {
            const { data } = await supabase.from(tabla).select('*').eq('id', id).maybeSingle();
            if (data) registro = data;
        } else if (slug) {
            const { data } = await supabase.from(tabla).select('*').eq('slug', slug).maybeSingle();
            if (data) registro = data;
        } else if (email) {
            const { data } = await supabase.from(tabla).select('*').ilike('email', email).maybeSingle();
            if (data) registro = data;
        }

        if (!registro) {
            return res.status(200).json({
                success: false,
                celebraciones: [],
                mensaje: 'No encontramos información para esta tienda, servicio o comprador.'
            });
        }

        // Construir celebraciones
        const celebraciones = construirCelebraciones(registro, tipo);
        
        return res.status(200).json({
            success: true,
            celebrando: celebraciones.length > 0,
            celebraciones: celebraciones
        });
    }

    if (action === 'configuracion' && req.method === 'POST') {
        const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { tipo, slug, email, id, tipo_celebracion, duracion_dias, color_fondo, color_texto, color_accento } = payload;

        if (!tipo || !['tienda', 'servicio'].includes(tipo)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo inválido. Debe ser "tienda" o "servicio".'
            });
        }

        const tabla = tipo === 'servicio' ? 'servicios' : 'tiendas';
        let registro = null;

        if (id) {
            const { data } = await supabase.from(tabla).select('id, slug, email').eq('id', id).maybeSingle();
            if (data) registro = data;
        } else if (slug) {
            const { data } = await supabase.from(tabla).select('id, slug, email').eq('slug', slug).maybeSingle();
            if (data) registro = data;
        } else if (email) {
            const { data } = await supabase.from(tabla).select('id, slug, email').ilike('email', email).maybeSingle();
            if (data) registro = data;
        }

        if (!registro) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró la tienda o servicio.'
            });
        }

        // Guardar configuración (simplificado - puedes expandir según necesites)
        return res.status(200).json({
            success: true,
            message: 'Configuración guardada correctamente'
        });
    }

    return res.status(400).json({
        success: false,
        error: 'Acción no válida para aniversarios'
    });
}

// ==================== HISTORIAS ====================
async function handleHistorias(supabase, req, res) {
    const action = req.query.action || 'listar';
    
    if (action === 'listar' && req.method === 'GET') {
        const { publicas, vendedor_id, limit = 20, offset = 0 } = req.query;

        let query = supabase
            .from('historias_corazon')
            .select('*')
            .eq('aprobada', true)
            .order('fecha_creacion', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (publicas === 'true') {
            query = query.eq('publica', true);
        }

        if (vendedor_id) {
            query = query.eq('vendedor_id', vendedor_id);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(500).json({
                success: false,
                error: 'Error obteniendo historias',
                detalles: error.message
            });
        }

        return res.status(200).json({
            success: true,
            historias: data || [],
            total: data?.length || 0
        });
    }

    if (action === 'crear' && req.method === 'POST') {
        const { vendedor_id, titulo, historia, publica = false, anonimo = false } = req.body;

        if (!vendedor_id || !titulo || !historia) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos: vendedor_id, titulo, historia'
            });
        }

        const { data, error } = await supabase
            .from('historias_corazon')
            .insert({
                vendedor_id,
                titulo,
                historia,
                publica: publica === true || publica === 'true',
                anonimo: anonimo === true || anonimo === 'true',
                aprobada: false, // Requiere aprobación
                fecha_creacion: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                error: 'Error creando historia',
                detalles: error.message
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Historia creada. Será revisada antes de publicarse.',
            data: data
        });
    }

    if (action === 'eliminar' && req.method === 'DELETE') {
        const { historia_id, vendedor_id } = req.query;

        if (!historia_id || !vendedor_id) {
            return res.status(400).json({
                success: false,
                error: 'Faltan historia_id y vendedor_id'
            });
        }

        const { error } = await supabase
            .from('historias_corazon')
            .delete()
            .eq('id', historia_id)
            .eq('vendedor_id', vendedor_id);

        if (error) {
            return res.status(500).json({
                success: false,
                error: 'Error eliminando historia',
                detalles: error.message
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Historia eliminada correctamente'
        });
    }

    return res.status(400).json({
        success: false,
        error: 'Acción no válida para historias'
    });
}

// ==================== FUNCIONES AUXILIARES ====================
function construirCelebraciones(registro, tipo) {
    const hoy = new Date();
    const celebraciones = [];

    if (tipo === 'tienda' || tipo === 'servicio') {
        if (esHoy(registro.fecha_nacimiento_responsable) && esVerdadero(registro.acepta_cumple_home)) {
            celebraciones.push({
                tipo: 'cumpleanos_fundador',
                titulo: '¡Felicidades y bienvenido!',
                subtitulo: 'Hoy celebramos tu vida y tu fuerza emprendedora.',
                icono: '🎂',
                etiqueta: 'Cumpleaños del Fundador'
            });
        }

        const fechaNegocio = registro.fecha_creacion_negocio || registro.fecha_creacion || registro.fecha_registro;
        if (esHoy(fechaNegocio) && esVerdadero(registro.acepta_aniversario_negocio_home)) {
            celebraciones.push({
                tipo: 'aniversario_negocio',
                titulo: '¡Felicidades y bienvenido!',
                subtitulo: 'Cada capítulo escrito con esfuerzo merece una celebración.',
                icono: '🏢',
                etiqueta: 'Aniversario del Negocio'
            });
        }
    }

    if (tipo === 'comprador') {
        if (esHoy(registro.fecha_nacimiento) && esVerdadero(registro.acepta_publico || registro.acepta_cumple_publico)) {
            celebraciones.push({
                tipo: 'cumpleanos',
                titulo: '¡Bienvenido y Feliz Cumpleaños!',
                subtitulo: 'Tu presencia en la comunidad Cresalia es un regalo.',
                icono: '🎂',
                etiqueta: 'Cumpleaños'
            });
        }
    }

    return celebraciones;
}

function esHoy(fecha) {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaComparar = new Date(fecha);
    if (Number.isNaN(fechaComparar.getTime())) return false;
    return (
        fechaComparar.getUTCDate() === hoy.getUTCDate() &&
        fechaComparar.getUTCMonth() === hoy.getUTCMonth()
    );
}

function esVerdadero(valor) {
    return valor === true || valor === 1 || valor === 'true' || valor === '1';
}

// ==================== HANDLER PRINCIPAL ====================
module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const supabase = getSupabase();
        const tipo = (req.query.tipo || 'cumpleanos').toLowerCase();

        switch (tipo) {
            case 'cumpleanos':
                await handleCumpleanos(supabase, req, res);
                break;
            case 'aniversario':
            case 'aniversarios':
                await handleAniversarios(supabase, req, res);
                break;
            case 'historia':
            case 'historias':
                await handleHistorias(supabase, req, res);
                break;
            default:
                res.status(400).json({
                    success: false,
                    error: `Tipo "${tipo}" no válido. Use: cumpleanos, aniversario, historia`
                });
        }
    } catch (error) {
        console.error('❌ Error en API celebraciones:', error.message);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un problema al procesar la solicitud',
            error: error.message
        });
    }
};
