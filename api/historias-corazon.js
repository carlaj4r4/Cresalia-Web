// ===== API: HISTORIAS CON CORAZÓN CRESALIA =====
// Para TODOS los vendedores/emprendedores/servicios que quieren compartir su historia

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const { createClient } = require('@supabase/supabase-js');
        
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({ error: 'Supabase no configurado' });
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // GET: Obtener historias públicas
        if (req.method === 'GET') {
            const { publicas, vendedor_id, donde_mostrar, tipo_vendedor } = req.query;
            
            let query = supabase
                .from('historias_corazon_cresalia')
                .select('*')
                .eq('publica', true)
                .eq('activa', true)
                .order('fecha_publicacion', { ascending: false });
            
            if (vendedor_id) {
                query = query.eq('vendedor_id', vendedor_id);
            }
            
            if (donde_mostrar) {
                query = query.eq('donde_mostrar', donde_mostrar);
            }
            
            if (tipo_vendedor) {
                query = query.eq('tipo_vendedor', tipo_vendedor);
            }
            
            const { data, error } = await query;
            
            if (error) {
                console.error('Error obteniendo historias:', error);
                return res.status(500).json({ error: error.message });
            }
            
            return res.status(200).json({ historias: data || [] });
        }
        
        // POST: Crear/actualizar historia
        if (req.method === 'POST') {
            const { 
                vendedor_id, 
                tipo_vendedor, 
                nombre_negocio, 
                historia, 
                consejos,
                foto_url, 
                donde_mostrar,
                publica 
            } = req.body;
            
            if (!vendedor_id || !tipo_vendedor || !historia) {
                return res.status(400).json({ error: 'Faltan datos requeridos: vendedor_id, tipo_vendedor, historia' });
            }
            
            // Verificar si ya tiene una historia
            const { data: historiaExistente } = await supabase
                .from('historias_corazon_cresalia')
                .select('id')
                .eq('vendedor_id', vendedor_id)
                .single();
            
            let result;
            if (historiaExistente) {
                // Actualizar
                const { data, error } = await supabase
                    .from('historias_corazon_cresalia')
                    .update({
                        tipo_vendedor,
                        nombre_negocio,
                        historia,
                        consejos,
                        foto_url,
                        donde_mostrar: donde_mostrar || 'página_principal',
                        publica: publica !== undefined ? publica : true,
                        fecha_actualizacion: new Date().toISOString()
                    })
                    .eq('id', historiaExistente.id)
                    .select()
                    .single();
                
                if (error) throw error;
                result = data;
            } else {
                // Crear nueva
                const { data, error } = await supabase
                    .from('historias_corazon_cresalia')
                    .insert({
                        vendedor_id,
                        tipo_vendedor,
                        nombre_negocio,
                        historia,
                        consejos,
                        foto_url,
                        donde_mostrar: donde_mostrar || 'página_principal',
                        publica: publica !== undefined ? publica : true,
                        activa: true,
                        fecha_publicacion: new Date().toISOString()
                    })
                    .select()
                    .single();
                
                if (error) throw error;
                result = data;
            }
            
            return res.status(200).json({ historia: result });
        }
        
        // DELETE: Eliminar historia
        if (req.method === 'DELETE') {
            const { historia_id, vendedor_id } = req.query;
            
            if (!historia_id || !vendedor_id) {
                return res.status(400).json({ error: 'Faltan datos requeridos' });
            }
            
            // Verificar que la historia pertenece al vendedor
            const { data: historia, error: historiaError } = await supabase
                .from('historias_corazon_cresalia')
                .select('vendedor_id')
                .eq('id', historia_id)
                .single();
            
            if (historiaError || !historia || historia.vendedor_id !== vendedor_id) {
                return res.status(403).json({ error: 'No autorizado' });
            }
            
            const { error } = await supabase
                .from('historias_corazon_cresalia')
                .update({ activa: false })
                .eq('id', historia_id);
            
            if (error) throw error;
            
            return res.status(200).json({ mensaje: 'Historia eliminada correctamente' });
        }
        
        return res.status(405).json({ error: 'Método no permitido' });
        
    } catch (error) {
        console.error('Error en API historias-corazon:', error);
        return res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
}

