/**
 * API Endpoint para guardar preferencias de cumpleaños de compradores
 * POST /api/compradores-cumple-consent
 */

const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Configurar Supabase (usar variables de Tiendas)
        const supabaseUrl = process.env.SUPABASE_URL_TIENDAS 
            || process.env.NEXT_PUBLIC_SUPABASE_URL_TIENDAS
            || process.env.SUPABASE_URL 
            || 'https://lvdgklwcgrmfbqwghxhl.supabase.co';
            
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY_TIENDAS
            || process.env.SUPABASE_SERVICE_ROLE_KEY
            || process.env.SUPABASE_ANON_KEY_TIENDAS
            || process.env.SUPABASE_ANON_KEY;

        if (!supabaseKey) {
            return res.status(500).json({
                success: false,
                error: 'Supabase no configurado'
            });
        }

        const supabase = createClient(supabaseUrl.trim(), supabaseKey.trim());

        // GET: Consultar preferencias
        if (req.method === 'GET') {
            const { email } = req.query;
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    error: 'Email requerido'
                });
            }

            // Buscar comprador por email
            const { data: comprador, error: errorComprador } = await supabase
                .from('compradores')
                .select('*')
                .eq('email', email.toLowerCase().trim())
                .eq('activo', true)
                .single();

            if (errorComprador && errorComprador.code !== 'PGRST116') {
                console.error('Error buscando comprador:', errorComprador);
                return res.status(500).json({
                    success: false,
                    error: 'Error buscando comprador',
                    detalles: errorComprador.message
                });
            }

            if (!comprador) {
                return res.status(404).json({
                    success: false,
                    error: 'Comprador no encontrado'
                });
            }

            // Extraer preferencias de cumpleaños
            // Nota: Los nombres de columnas pueden variar según el esquema SQL usado
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

            // Buscar comprador por email
            const { data: compradorExistente, error: errorBuscar } = await supabase
                .from('compradores')
                .select('id, user_id')
                .eq('email', email.toLowerCase().trim())
                .eq('activo', true)
                .single();

            if (errorBuscar && errorBuscar.code !== 'PGRST116') {
                console.error('Error buscando comprador:', errorBuscar);
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

            // Preparar datos para actualizar
            // Intentar actualizar ambas versiones de nombres de columnas para compatibilidad
            const datosActualizar = {
                fecha_nacimiento: fecha_nacimiento || null,
                // Nombres estándar
                acepta_publico: acepta_publico === true || acepta_publico === 'true',
                acepta_descuento: acepta_descuento === true || acepta_descuento === 'true',
                mensaje_publico: mensaje_publico || null,
                // Nombres alternativos (para compatibilidad)
                acepta_cumple_publico: acepta_publico === true || acepta_publico === 'true',
                acepta_cumple_descuento: acepta_descuento === true || acepta_descuento === 'true',
                mensaje_cumple_publico: mensaje_publico || null,
                fecha_actualizacion: new Date().toISOString()
            };

            // Actualizar comprador
            const { data: compradorActualizado, error: errorActualizar } = await supabase
                .from('compradores')
                .update(datosActualizar)
                .eq('id', compradorExistente.id)
                .select()
                .single();

            if (errorActualizar) {
                console.error('Error actualizando preferencias:', errorActualizar);
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

        // Método no permitido
        return res.status(405).json({
            success: false,
            error: 'Método no permitido'
        });

    } catch (error) {
        console.error('Error en compradores-cumple-consent:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            detalles: error.message
        });
    }
};
