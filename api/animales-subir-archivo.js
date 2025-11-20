/**
 * 🐾 API: Subir Archivo (Imagen/Video) para Animales
 * Sube archivos directamente a Supabase Storage
 * Co-fundadores: Carla & Claude
 */

const { createClient } = require('@supabase/supabase-js');

// Función para aplicar CORS
function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '3600');
}

// Validar tipo de archivo
function validarTipoArchivo(filename, mimetype) {
    const extensionesImagen = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extensionesVideo = ['mp4', 'webm', 'mov', 'avi'];
    
    const ext = filename.split('.').pop().toLowerCase();
    const esImagen = extensionesImagen.includes(ext) || mimetype?.startsWith('image/');
    const esVideo = extensionesVideo.includes(ext) || mimetype?.startsWith('video/');
    
    if (!esImagen && !esVideo) {
        return { valido: false, tipo: null, error: 'Tipo de archivo no permitido. Solo imágenes (jpg, png, gif, webp) y videos (mp4, webm, mov, avi)' };
    }
    
    return { 
        valido: true, 
        tipo: esImagen ? 'image' : 'video',
        extension: ext
    };
}

// Validar tamaño de archivo (max 10MB para imágenes, 50MB para videos)
function validarTamaño(buffer, tipo) {
    const maxSizeImagen = 10 * 1024 * 1024; // 10MB
    const maxSizeVideo = 50 * 1024 * 1024; // 50MB
    
    const maxSize = tipo === 'image' ? maxSizeImagen : maxSizeVideo;
    
    if (buffer.length > maxSize) {
        const maxMB = tipo === 'image' ? '10MB' : '50MB';
        return { valido: false, error: `El archivo es demasiado grande. Máximo permitido: ${maxMB}` };
    }
    
    return { valido: true };
}

module.exports = async (req, res) => {
    applyCors(res);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Método no permitido. Usa POST para subir archivos.'
        });
    }
    
    try {
        // Obtener credenciales de Supabase
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({
                success: false,
                message: 'Configuración de Supabase no encontrada. Verificá las variables de entorno.'
            });
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Obtener el archivo del body (multipart/form-data o base64)
        let file = null;
        let filename = null;
        let mimetype = null;
        
        // Intentar obtener de diferentes formatos
        if (req.body && req.body.file) {
            // Si viene como base64
            if (typeof req.body.file === 'string' && req.body.file.startsWith('data:')) {
                const matches = req.body.file.match(/^data:([^;]+);base64,(.+)$/);
                if (matches) {
                    mimetype = matches[1];
                    const base64Data = matches[2];
                    file = Buffer.from(base64Data, 'base64');
                    filename = req.body.filename || `archivo_${Date.now()}.${mimetype.split('/')[1]}`;
                }
            } else {
                // Si viene como buffer
                file = Buffer.from(req.body.file, 'base64');
                filename = req.body.filename || `archivo_${Date.now()}`;
                mimetype = req.body.mimetype || 'application/octet-stream';
            }
        } else if (req.body && req.body.base64) {
            // Formato alternativo: {base64: "...", filename: "...", mimetype: "..."}
            const base64Data = req.body.base64;
            file = Buffer.from(base64Data, 'base64');
            filename = req.body.filename || `archivo_${Date.now()}`;
            mimetype = req.body.mimetype || 'application/octet-stream';
        } else {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionó ningún archivo. Enviá el archivo como base64 o multipart/form-data.'
            });
        }
        
        if (!file || file.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El archivo está vacío.'
            });
        }
        
        // Validar tipo de archivo
        const validacionTipo = validarTipoArchivo(filename, mimetype);
        if (!validacionTipo.valido) {
            return res.status(400).json({
                success: false,
                message: validacionTipo.error
            });
        }
        
        // Validar tamaño
        const validacionTamaño = validarTamaño(file, validacionTipo.tipo);
        if (!validacionTamaño.valido) {
            return res.status(400).json({
                success: false,
                message: validacionTamaño.error
            });
        }
        
        // Generar nombre único para el archivo
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 9);
        const extension = validacionTipo.extension || filename.split('.').pop();
        const nombreArchivo = `${validacionTipo.tipo}_${timestamp}_${randomId}.${extension}`;
        const rutaStorage = `animales/${validacionTipo.tipo}s/${nombreArchivo}`;
        
        // Subir a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('animales-files')
            .upload(rutaStorage, file, {
                contentType: mimetype,
                upsert: false
            });
        
        if (uploadError) {
            console.error('❌ Error subiendo archivo:', uploadError);
            
            // Si el bucket no existe, intentar crearlo
            if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('not found')) {
                return res.status(500).json({
                    success: false,
                    message: 'El bucket de almacenamiento no existe. Creá el bucket "animales-files" en Supabase Storage primero.',
                    error: 'BUCKET_NOT_FOUND'
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Error al subir el archivo: ' + uploadError.message,
                error: uploadError.message
            });
        }
        
        // Obtener URL pública del archivo
        const { data: urlData } = supabase.storage
            .from('animales-files')
            .getPublicUrl(rutaStorage);
        
        const urlPublica = urlData?.publicUrl || `${supabaseUrl}/storage/v1/object/public/animales-files/${rutaStorage}`;
        
        // Retornar información del archivo subido
        return res.status(200).json({
            success: true,
            file: {
                type: validacionTipo.tipo,
                url: urlPublica,
                path: rutaStorage,
                filename: nombreArchivo,
                size: file.length,
                uploaded_at: new Date().toISOString()
            },
            message: `Archivo subido correctamente. Tipo: ${validacionTipo.tipo}`
        });
        
    } catch (error) {
        console.error('❌ Error en /api/animales-subir-archivo:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al subir el archivo.',
            error: error.message
        });
    }
};

