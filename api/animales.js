/**
 * 🐾 API Router: Animales
 * Combina endpoints de cumpleaños y subida de archivos
 * GET /api/animales?accion=cumpleanos
 * POST /api/animales?accion=subir-archivo
 */

const { createClient } = require('@supabase/supabase-js');

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '3600');
}

function validarTipoArchivo(filename, mimetype) {
    const extensionesImagen = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extensionesVideo = ['mp4', 'webm', 'mov', 'avi'];
    
    const ext = filename.split('.').pop().toLowerCase();
    const esImagen = extensionesImagen.includes(ext) || mimetype?.startsWith('image/');
    const esVideo = extensionesVideo.includes(ext) || mimetype?.startsWith('video/');
    
    if (!esImagen && !esVideo) {
        return { valido: false, tipo: null, error: 'Tipo de archivo no permitido' };
    }
    
    return { valido: true, tipo: esImagen ? 'image' : 'video', extension: ext };
}

function validarTamaño(buffer, tipo) {
    const maxSizeImagen = 10 * 1024 * 1024;
    const maxSizeVideo = 50 * 1024 * 1024;
    const maxSize = tipo === 'image' ? maxSizeImagen : maxSizeVideo;
    
    if (buffer.length > maxSize) {
        const maxMB = tipo === 'image' ? '10MB' : '50MB';
        return { valido: false, error: `El archivo es demasiado grande. Máximo: ${maxMB}` };
    }
    
    return { valido: true };
}

module.exports = async (req, res) => {
    applyCors(res);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { accion } = req.query;
    
    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({
                success: false,
                message: 'Configuración de Supabase no encontrada.'
            });
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // ===== CUMLEAÑOS =====
        if (accion === 'cumpleanos' && req.method === 'GET') {
            const ahora = new Date();
            const mesActual = ahora.getMonth() + 1;
            const { mes, año } = req.query;
            const mesBuscar = mes ? parseInt(mes) : mesActual;
            const añoBuscar = año ? parseInt(año) : ahora.getFullYear();
            
            if (mesBuscar < 1 || mesBuscar > 12) {
                return res.status(400).json({
                    success: false,
                    message: 'Mes inválido. Debe ser entre 1 y 12.'
                });
            }
            
            const inicioMes = `${añoBuscar}-${String(mesBuscar).padStart(2, '0')}-01`;
            const finMes = new Date(añoBuscar, mesBuscar, 0).getDate();
            const finMesStr = `${añoBuscar}-${String(mesBuscar).padStart(2, '0')}-${String(finMes).padStart(2, '0')}`;
            
            const { data: animales, error } = await supabase
                .from('animales_necesitan_ayuda')
                .select(`
                    *,
                    organizaciones_animales (
                        nombre_organizacion,
                        tipo,
                        contacto_email,
                        contacto_telefono
                    )
                `)
                .not('fecha_adopcion_rescate', 'is', null)
                .gte('fecha_adopcion_rescate', inicioMes)
                .lte('fecha_adopcion_rescate', finMesStr)
                .in('estado', ['activa', 'en_proceso'])
                .order('fecha_adopcion_rescate', { ascending: true });
            
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener animales que cumplen años.',
                    error: error.message
                });
            }
            
            const animalesConAños = (animales || []).map(animal => {
                if (!animal.fecha_adopcion_rescate) return null;
                
                const fechaAdopcion = new Date(animal.fecha_adopcion_rescate);
                const hoy = new Date();
                let años = hoy.getFullYear() - fechaAdopcion.getFullYear();
                const mesDiff = hoy.getMonth() - fechaAdopcion.getMonth();
                
                if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaAdopcion.getDate())) {
                    años--;
                }
                
                return {
                    ...animal,
                    años_desde_adopcion_rescate: años,
                    fecha_cumpleanos: `${mesBuscar}-${fechaAdopcion.getDate()}`,
                    tipo_celebracion: 'aniversario_adopcion_rescate'
                };
            }).filter(animal => animal !== null);
            
            return res.status(200).json({
                success: true,
                mes: mesBuscar,
                año: añoBuscar,
                total: animalesConAños.length,
                animales: animalesConAños
            });
        }
        
        // ===== SUBIR ARCHIVO =====
        if (accion === 'subir-archivo' && req.method === 'POST') {
            let file = null;
            let filename = null;
            let mimetype = null;
            
            if (req.body && req.body.file) {
                if (typeof req.body.file === 'string' && req.body.file.startsWith('data:')) {
                    const matches = req.body.file.match(/^data:([^;]+);base64,(.+)$/);
                    if (matches) {
                        mimetype = matches[1];
                        const base64Data = matches[2];
                        file = Buffer.from(base64Data, 'base64');
                        filename = req.body.filename || `archivo_${Date.now()}.${mimetype.split('/')[1]}`;
                    }
                } else {
                    file = Buffer.from(req.body.file, 'base64');
                    filename = req.body.filename || `archivo_${Date.now()}`;
                    mimetype = req.body.mimetype || 'application/octet-stream';
                }
            } else if (req.body && req.body.base64) {
                const base64Data = req.body.base64;
                file = Buffer.from(base64Data, 'base64');
                filename = req.body.filename || `archivo_${Date.now()}`;
                mimetype = req.body.mimetype || 'application/octet-stream';
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'No se proporcionó ningún archivo.'
                });
            }
            
            if (!file || file.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El archivo está vacío.'
                });
            }
            
            const validacionTipo = validarTipoArchivo(filename, mimetype);
            if (!validacionTipo.valido) {
                return res.status(400).json({
                    success: false,
                    message: validacionTipo.error
                });
            }
            
            const validacionTamaño = validarTamaño(file, validacionTipo.tipo);
            if (!validacionTamaño.valido) {
                return res.status(400).json({
                    success: false,
                    message: validacionTamaño.error
                });
            }
            
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(2, 9);
            const extension = validacionTipo.extension || filename.split('.').pop();
            const nombreArchivo = `${validacionTipo.tipo}_${timestamp}_${randomId}.${extension}`;
            const rutaStorage = `animales/${validacionTipo.tipo}s/${nombreArchivo}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('animales-files')
                .upload(rutaStorage, file, {
                    contentType: mimetype,
                    upsert: false
                });
            
            if (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al subir el archivo: ' + uploadError.message
                });
            }
            
            const { data: urlData } = supabase.storage
                .from('animales-files')
                .getPublicUrl(rutaStorage);
            
            const urlPublica = urlData?.publicUrl || `${supabaseUrl}/storage/v1/object/public/animales-files/${rutaStorage}`;
            
            return res.status(200).json({
                success: true,
                file: {
                    type: validacionTipo.tipo,
                    url: urlPublica,
                    path: rutaStorage,
                    filename: nombreArchivo,
                    size: file.length,
                    uploaded_at: new Date().toISOString()
                }
            });
        }
        
        return res.status(400).json({
            success: false,
            message: 'Acción inválida. Usa ?accion=cumpleanos o ?accion=subir-archivo'
        });
        
    } catch (error) {
        console.error('Error en API animales:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor.',
            error: error.message
        });
    }
};

