const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error('Variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no configuradas');
    }

    supabaseClient = createClient(url, key);
    return supabaseClient;
}

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }

    try {
        const supabase = getSupabase();

        const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { tipo, slug, email, id, tipo_celebracion, duracion_dias, color_fondo, color_texto, color_accento, estilo_banner, mensaje_bienvenida, mensaje_subtitulo, aplicar_en_tienda, aplicar_en_portada } = payload;

        if (!tipo || !['tienda', 'servicio'].includes(tipo)) {
            return res.status(400).json({ success: false, message: 'Tipo inválido. Debe ser "tienda" o "servicio".' });
        }

        if (!slug && !email && !id) {
            return res.status(400).json({ success: false, message: 'Se requiere slug, email o id.' });
        }

        if (!tipo_celebracion || !['cumpleanos_fundador', 'aniversario_negocio'].includes(tipo_celebracion)) {
            return res.status(400).json({ success: false, message: 'Tipo de celebración inválido.' });
        }

        if (duracion_dias && (duracion_dias < 1 || duracion_dias > 30)) {
            return res.status(400).json({ success: false, message: 'Duración debe estar entre 1 y 30 días.' });
        }

        // Obtener ID de la tienda/servicio
        const tabla = tipo === 'servicio' ? 'servicios' : 'tiendas';
        let registro = null;

        if (id) {
            const { data, error } = await supabase.from(tabla).select('id, slug, email').eq('id', id).maybeSingle();
            if (!error && data) registro = data;
        } else if (slug) {
            const camposSlug = ['slug', 'subdomain', 'tienda_slug', 'servicio_slug'];
            for (const campo of camposSlug) {
                const { data, error } = await supabase.from(tabla).select('id, slug, email').eq(campo, slug).maybeSingle();
                if (!error && data) {
                    registro = data;
                    break;
                }
            }
        } else if (email) {
            const camposEmail = ['email', 'email_contacto', 'correo'];
            for (const campo of camposEmail) {
                const { data, error } = await supabase.from(tabla).select('id, slug, email').ilike(campo, email).maybeSingle();
                if (!error && data) {
                    registro = data;
                    break;
                }
            }
        }

        if (!registro) {
            return res.status(404).json({ success: false, message: 'No se encontró la tienda o servicio.' });
        }

        // Preparar datos para insertar/actualizar
        const datosPersonalizacion = {
            tipo_negocio: tipo,
            tienda_id: tipo === 'tienda' ? registro.id : null,
            servicio_id: tipo === 'servicio' ? registro.id : null,
            tienda_slug: tipo === 'tienda' ? (registro.slug || slug) : null,
            servicio_slug: tipo === 'servicio' ? (registro.slug || slug) : null,
            tienda_email: registro.email || email || null,
            tipo_celebracion,
            color_fondo: color_fondo || '#7C3AED',
            color_texto: color_texto || '#FFFFFF',
            color_accento: color_accento || '#EC4899',
            estilo_banner: estilo_banner || 'degradado',
            aplicar_en_tienda: aplicar_en_tienda !== false,
            aplicar_en_portada: aplicar_en_portada !== false,
            activo: true,
            updated_at: new Date().toISOString()
        };

        // Buscar si ya existe una personalización
        let query = supabase
            .from('aniversarios_personalizacion')
            .select('id')
            .eq('tipo_negocio', tipo)
            .eq('tipo_celebracion', tipo_celebracion);

        if (tipo === 'servicio') {
            query = query.eq('servicio_slug', registro.slug || slug);
        } else {
            query = query.eq('tienda_slug', registro.slug || slug);
        }

        const { data: existing, error: errorExisting } = await query.maybeSingle();

        let resultado;

        if (existing && existing.id) {
            // Actualizar existente
            const { data, error } = await supabase
                .from('aniversarios_personalizacion')
                .update(datosPersonalizacion)
                .eq('id', existing.id)
                .select()
                .maybeSingle();

            if (error) throw error;
            resultado = data;
        } else {
            // Insertar nuevo
            const { data, error } = await supabase
                .from('aniversarios_personalizacion')
                .insert(datosPersonalizacion)
                .select()
                .maybeSingle();

            if (error) throw error;
            resultado = data;
        }

        // Guardar duración en la tabla de tiendas/servicios (si existe la columna)
        if (duracion_dias) {
            try {
                const updateTabla = {
                    [`duracion_celebracion_${tipo_celebracion}`]: duracion_dias
                };
                await supabase
                    .from(tabla)
                    .update(updateTabla)
                    .eq('id', registro.id);
            } catch (err) {
                console.warn('No se pudo guardar duración en la tabla:', err.message);
            }
        }

        // Guardar mensajes personalizados en bienestar_personalizacion
        if (mensaje_bienvenida || mensaje_subtitulo) {
            try {
                const datosBienestar = {
                    tipo_negocio: tipo,
                    tienda_id: tipo === 'tienda' ? registro.id : null,
                    servicio_id: tipo === 'servicio' ? registro.id : null,
                    comprador_email: null,
                    mensaje_bienvenida: mensaje_bienvenida || null,
                    mensaje_aniversario: mensaje_subtitulo || null,
                    color_principal: color_fondo || '#7C3AED',
                    color_secundario: color_accento || '#EC4899',
                    activo: true,
                    updated_at: new Date().toISOString()
                };

                let queryBienestar = supabase
                    .from('bienestar_personalizacion')
                    .select('id')
                    .eq('tipo_negocio', tipo);

                if (tipo === 'servicio') {
                    queryBienestar = queryBienestar.eq('servicio_id', registro.id);
                } else {
                    queryBienestar = queryBienestar.eq('tienda_id', registro.id);
                }

                const { data: existingBienestar } = await queryBienestar.maybeSingle();

                if (existingBienestar && existingBienestar.id) {
                    await supabase
                        .from('bienestar_personalizacion')
                        .update(datosBienestar)
                        .eq('id', existingBienestar.id);
                } else {
                    await supabase
                        .from('bienestar_personalizacion')
                        .insert(datosBienestar);
                }
            } catch (err) {
                console.warn('No se pudo guardar personalización de bienestar:', err.message);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Configuración guardada correctamente',
            data: resultado
        });
    } catch (error) {
        console.error('❌ Error en aniversarios-configuracion:', error.message);
        res.status(500).json({
            success: false,
            message: 'No se pudo guardar la configuración',
            error: error.message
        });
    }
};

