// ===== API: HISTORIAS CON CORAZÓN CRESALIA =====
// Para TODOS los vendedores/emprendedores/servicios que quieren compartir su historia

module.exports = async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const { createClient } = require('@supabase/supabase-js');
        
        // Logging detallado para debugging
        console.log('🔍 [DEBUG] Verificando variables de entorno...');
        const supabaseUrl = process.env.SUPABASE_URL;
        const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        const hasAnonKey = !!process.env.SUPABASE_ANON_KEY;
        
        console.log('🔍 [DEBUG] Variables encontradas:', {
            hasUrl: !!supabaseUrl,
            urlLength: supabaseUrl ? supabaseUrl.length : 0,
            urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'no existe',
            hasServiceKey: hasServiceKey,
            serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 0,
            hasAnonKey: hasAnonKey,
            anonKeyLength: process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.length : 0
        });
        
        // Usar SERVICE_ROLE_KEY como fallback (más permisos) o ANON_KEY
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Supabase no configurado:', {
                hasUrl: !!supabaseUrl,
                hasServiceKey: hasServiceKey,
                hasAnonKey: hasAnonKey
            });
            return res.status(500).json({ 
                error: 'Supabase no configurado. Verificá las variables SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_ANON_KEY) en Vercel.' 
            });
        }
        
        // Verificar que la URL y key no tengan espacios extra
        const cleanUrl = supabaseUrl.trim();
        const cleanKey = supabaseKey.trim();
        
        // Extraer Project ID de la URL para verificación
        const urlMatch = cleanUrl.match(/https?:\/\/([^.]+)\.supabase\.(co|in)/);
        const projectIdFromUrl = urlMatch ? urlMatch[1] : null;
        
        // Intentar decodificar el JWT para extraer información (solo el header y payload, sin verificar firma)
        let keyProjectId = null;
        let keyType = null;
        try {
            const keyParts = cleanKey.split('.');
            if (keyParts.length >= 2) {
                // Decodificar el payload del JWT (base64url)
                const payload = JSON.parse(Buffer.from(keyParts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
                keyProjectId = payload.iss?.match(/https?:\/\/([^.]+)\.supabase\.(co|in)/)?.[1] || null;
                keyType = payload.role || payload.aud || null;
            }
        } catch (err) {
            console.log('ℹ️ [DEBUG] No se pudo decodificar el JWT (normal si es legacy)');
        }
        
        // Validar formato de la key (puede ser JWT o legacy)
        const keyParts = cleanKey.split('.');
        const isValidJWTFormat = keyParts.length === 3 && keyParts[0].length > 0 && keyParts[1].length > 0 && keyParts[2].length > 0;
        const isLegacyFormat = cleanKey.length > 0 && !isValidJWTFormat && cleanKey.includes('eyJ'); // Legacy keys pueden tener formato diferente
        
        console.log('🔍 [DEBUG] Creando cliente Supabase...');
        console.log('🔍 [DEBUG] URL completa:', cleanUrl);
        console.log('🔍 [DEBUG] Project ID de URL:', projectIdFromUrl || 'no detectado');
        console.log('🔍 [DEBUG] Key (primeros 20 chars):', cleanKey.substring(0, 20) + '...');
        console.log('🔍 [DEBUG] Key (últimos 20 chars):', '...' + cleanKey.substring(cleanKey.length - 20));
        console.log('🔍 [DEBUG] Key length:', cleanKey.length);
        console.log('🔍 [DEBUG] Key formato JWT válido:', isValidJWTFormat);
        console.log('🔍 [DEBUG] Key formato Legacy:', isLegacyFormat);
        if (keyProjectId) {
            console.log('🔍 [DEBUG] Project ID de Key:', keyProjectId);
            console.log('🔍 [DEBUG] Tipo de Key:', keyType || 'desconocido');
        }
        console.log('🔍 [DEBUG] Usando SERVICE_ROLE_KEY:', hasServiceKey);
        console.log('🔍 [DEBUG] Usando ANON_KEY (fallback):', !hasServiceKey && hasAnonKey);
        
        // Verificar que la URL y la key sean del mismo proyecto
        if (projectIdFromUrl && keyProjectId && projectIdFromUrl !== keyProjectId) {
            console.error('❌ ERROR CRÍTICO: La URL y la Key son de proyectos diferentes!');
            console.error('   - Project ID de URL:', projectIdFromUrl);
            console.error('   - Project ID de Key:', keyProjectId);
            return res.status(500).json({ 
                error: 'La URL y la API key son de proyectos diferentes de Supabase. Verificá que ambas sean del mismo proyecto.',
                debug: {
                    urlProjectId: projectIdFromUrl,
                    keyProjectId: keyProjectId,
                    url: cleanUrl.substring(0, 50) + '...'
                },
                solution: 'Ve a Supabase Dashboard y verificá que la URL (Settings → API → Project URL) y la key (Settings → API → Project API keys) sean del mismo proyecto.'
            });
        }
        
        // Verificar que la URL termine correctamente
        if (!cleanUrl.includes('supabase.co') && !cleanUrl.includes('supabase.in')) {
            console.warn('⚠️ La URL no parece ser de Supabase:', cleanUrl);
        }
        
        // Si no se pudo extraer el project ID de la key, mostrar advertencia
        if (!keyProjectId && isValidJWTFormat) {
            console.warn('⚠️ No se pudo extraer el Project ID de la key. Verificá manualmente que la URL y la key sean del mismo proyecto.');
        }
        
        // Intentar crear el cliente con diferentes opciones
        let supabase;
        let clientError = null;
        
        try {
            // Opción 1: Crear cliente estándar
            supabase = createClient(cleanUrl, cleanKey, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false
                }
            });
            console.log('✅ [DEBUG] Cliente Supabase creado');
        } catch (err) {
            clientError = err;
            console.error('❌ Error creando cliente Supabase:', err.message);
            
            // Opción 2: Intentar con opciones adicionales para legacy keys
            try {
                supabase = createClient(cleanUrl, cleanKey, {
                    auth: {
                        persistSession: false,
                        autoRefreshToken: false,
                        detectSessionInUrl: false
                    },
                    global: {
                        headers: {
                            'apikey': cleanKey
                        }
                    }
                });
                console.log('✅ [DEBUG] Cliente Supabase creado con opciones legacy');
            } catch (err2) {
                console.error('❌ Error creando cliente con opciones legacy:', err2.message);
                return res.status(500).json({ 
                    error: 'Error creando cliente de Supabase. Verificá que la URL y la key sean correctas.',
                    debug: {
                        error: err2.message,
                        urlLength: cleanUrl.length,
                        keyLength: cleanKey.length
                    }
                });
            }
        }
        
        // Verificar conexión con Supabase usando múltiples métodos
        console.log('🔍 [DEBUG] Probando conexión con Supabase...');
        
        // Método 1: Probar con una query simple a una tabla
        let testError = null;
        let testData = null;
        
        try {
            const result = await supabase
                .from('historias_corazon_cresalia')
                .select('id')
                .limit(1);
            
            testData = result.data;
            testError = result.error;
            
            if (!testError) {
                console.log('✅ [DEBUG] Query a tabla exitosa');
            }
        } catch (err) {
            testError = { message: err.message, code: err.code };
            console.error('❌ Error en query a tabla:', err.message);
        }
        
        // Método 2: Si es SERVICE_ROLE_KEY, probar con auth.admin
        if (hasServiceKey && testError) {
            console.log('🔍 [DEBUG] Probando con auth.admin (SERVICE_ROLE_KEY)...');
            try {
                const { data: authTest, error: authError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
                if (authError) {
                    console.error('❌ Error con auth.admin:', authError.message);
                    // Si auth.admin falla pero la key existe, puede ser un problema de permisos
                    if (authError.message?.includes('Invalid API key')) {
                        testError = authError; // Usar este error como principal
                    }
                } else {
                    console.log('✅ [DEBUG] SERVICE_ROLE_KEY válida (auth.admin funciona)');
                    // Si auth.admin funciona, la key es válida pero puede haber problema con RLS
                    testError = null; // Resetear el error porque la key es válida
                }
            } catch (authErr) {
                console.log('ℹ️ [DEBUG] No se pudo verificar con auth.admin:', authErr.message);
            }
        }
        
        // Método 3: Probar con una query más simple (sin RLS)
        if (testError && testError.message?.includes('Invalid API key')) {
            console.log('🔍 [DEBUG] Probando con query directa a auth...');
            try {
                // Intentar una query que no requiere RLS
                const { data: directTest, error: directError } = await supabase
                    .rpc('version'); // Esta función debería existir en Supabase
                
                if (directError && !directError.message?.includes('Invalid API key')) {
                    console.log('ℹ️ [DEBUG] La key parece válida pero hay problema con RLS o tabla');
                    // La key puede ser válida pero hay otro problema
                }
            } catch (directErr) {
                console.log('ℹ️ [DEBUG] No se pudo probar con RPC:', directErr.message);
            }
        }
        
        if (testError) {
            console.error('❌ Error de Supabase:', {
                code: testError.code,
                message: testError.message,
                hint: testError.hint,
                details: testError.details,
                status: testError.status
            });
            
            // Error específico de API key inválido
            if (testError.code === 'PGRST301' || testError.message?.includes('Invalid API key') || testError.status === 401) {
                console.error('❌ API key inválido. Diagnóstico:');
                console.error('   - Key length:', cleanKey.length, '(esperado: ~200-250 caracteres)');
                console.error('   - Key formato JWT:', isValidJWTFormat ? '✅' : '❌');
                console.error('   - Key empieza con:', cleanKey.substring(0, 20));
                console.error('   - Key termina con:', cleanKey.substring(cleanKey.length - 20));
                console.error('   - Usando SERVICE_ROLE_KEY:', hasServiceKey);
                console.error('   - Usando ANON_KEY:', !hasServiceKey && hasAnonKey);
                console.error('');
                console.error('🔧 SOLUCIÓN:');
                console.error('   1. Ve a Supabase Dashboard → Settings → API');
                console.error('   2. Si usás SERVICE_ROLE_KEY: copiá la key de "service_role" (secreta)');
                console.error('   3. Si usás ANON_KEY: copiá la key de "anon public"');
                console.error('   4. Verificá que la key no tenga espacios al inicio o final');
                console.error('   5. Pegala en Vercel → Settings → Environment Variables');
                console.error('   6. Asegurate de que esté en "Production"');
                console.error('   7. Hacé un nuevo deploy');
                
                return res.status(500).json({ 
                    error: 'API key de Supabase inválido. Verificá en Vercel que SUPABASE_SERVICE_ROLE_KEY o SUPABASE_ANON_KEY estén correctamente configuradas.',
                    debug: {
                        hasServiceKey: hasServiceKey,
                        hasAnonKey: hasAnonKey,
                        keyLength: cleanKey.length,
                        isValidJWTFormat: isValidJWTFormat,
                        keyPreview: cleanKey.substring(0, 30) + '...' + cleanKey.substring(cleanKey.length - 10)
                    },
                    solution: 'Ve a Supabase Dashboard → Settings → API y copiá la key correcta (service_role o anon public). Verificá que no tenga espacios y que esté en Production en Vercel.'
                });
            }
            
            // Otro tipo de error
            return res.status(500).json({ 
                error: testError.message || 'Error de conexión con Supabase',
                code: testError.code,
                status: testError.status
            });
        }
        
        console.log('✅ [DEBUG] Conexión con Supabase exitosa');
        
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

