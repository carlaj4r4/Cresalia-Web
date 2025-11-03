const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Importar configuración de seguridad
const {
    generalLimiter,
    authLimiter,
    sensitiveLimiter,
    helmetConfig,
    securityLogger,
    detectSuspiciousActivity
} = require('./security-config');

const app = express();
const PORT = process.env.PORT || 3001;

// ===== MIDDLEWARE DE SEGURIDAD =====

// Headers de seguridad con Helmet
app.use(helmetConfig);

// Rate limiting general
app.use(generalLimiter);

// Detección de actividad sospechosa
app.use(detectSuspiciousActivity);

// Middleware básico
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://cresalia.vercel.app', 'https://cresalia-web.vercel.app']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging de inicio
securityLogger.log('INFO', 'Servidor Cresalia iniciando con medidas de seguridad avanzadas');

// ===== RUTA DE SALUD DEL SERVIDOR =====

app.get('/api/health', (req, res) => {
    securityLogger.log('INFO', 'Health check realizado', req);
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        security: 'ACTIVE',
        version: '2.0.0'
    });
});

// Conectar a la base de datos
const dbPath = path.join(__dirname, 'friocas.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Servidor Cresalia iniciando...');
console.log('📊 Conectando a la base de datos...');

// Verificar conexión a la base de datos
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='productos'", (err, row) => {
    if (err) {
        console.error('❌ Error al conectar con la base de datos:', err.message);
    } else if (!row) {
        console.log('⚠️ Base de datos no inicializada. Ejecuta: npm run init-db');
    } else {
        console.log('✅ Base de datos conectada correctamente');
    }
});

// ==================== RUTAS DE PRODUCTOS ====================

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    const { categoria, destacado, busqueda, ordenar, limite = 20, pagina = 1 } = req.query;
    
    let query = `
        SELECT p.*, c.nombre as categoria_nombre 
        FROM productos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.activo = 1
    `;
    let params = [];
    
    // Filtros
    if (categoria) {
        query += ' AND p.categoria_id = ?';
        params.push(categoria);
    }
    
    if (destacado === 'true') {
        query += ' AND p.destacado = 1';
    }
    
    if (busqueda) {
        query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
        params.push(`%${busqueda}%`, `%${busqueda}%`);
    }
    
    // Ordenamiento
    switch (ordenar) {
        case 'precio_asc':
            query += ' ORDER BY p.precio ASC';
            break;
        case 'precio_desc':
            query += ' ORDER BY p.precio DESC';
            break;
        case 'nombre':
            query += ' ORDER BY p.nombre ASC';
            break;
        case 'destacado':
            query += ' ORDER BY p.destacado DESC, p.nombre ASC';
            break;
        default:
            query += ' ORDER BY p.created_at DESC';
    }
    
    // Paginación
    const offset = (pagina - 1) * limite;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limite), offset);
    
    db.all(query, params, (err, productos) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        // Procesar características JSON
        productos.forEach(producto => {
            if (producto.caracteristicas) {
                try {
                    producto.caracteristicas = JSON.parse(producto.caracteristicas);
                } catch (e) {
                    producto.caracteristicas = {};
                }
            }
        });
        
        res.json(productos);
    });
});

// Crear nuevo producto
app.post('/api/productos', (req, res) => {
    const { nombre, descripcion, precio, stock, categoria_id, imagen, caracteristicas, destacado = 0 } = req.body;
    
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }
    
    db.run(`
        INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen, caracteristicas, destacado, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [nombre, descripcion, precio, stock || 0, categoria_id, imagen, caracteristicas, destacado], function(err) {
        if (err) {
            console.error('Error al crear producto:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.status(201).json({
            id: this.lastID,
            nombre,
            descripcion,
            precio,
            stock,
            categoria_id,
            imagen,
            caracteristicas,
            destacado,
            mensaje: 'Producto creado exitosamente'
        });
    });
});

// Obtener producto por ID
app.get('/api/productos/:id', (req, res) => {
    const { id } = req.params;
    
    db.get(`
        SELECT p.*, c.nombre as categoria_nombre 
        FROM productos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.id = ? AND p.activo = 1
    `, [id], (err, producto) => {
        if (err) {
            console.error('Error al obtener producto:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        // Procesar características JSON
        if (producto.caracteristicas) {
            try {
                producto.caracteristicas = JSON.parse(producto.caracteristicas);
            } catch (e) {
                producto.caracteristicas = {};
            }
        }
        
        res.json(producto);
    });
});

// ==================== RUTAS DE CATEGORÍAS ====================

// Obtener todas las categorías
app.get('/api/categorias', (req, res) => {
    db.all('SELECT * FROM categorias WHERE activo = 1 ORDER BY nombre', (err, categorias) => {
        if (err) {
            console.error('Error al obtener categorías:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(categorias);
    });
});

// Crear nueva categoría
app.post('/api/categorias', (req, res) => {
    const { nombre, descripcion, imagen } = req.body;
    
    if (!nombre) {
        return res.status(400).json({ error: 'Nombre de categoría es requerido' });
    }
    
    db.run(`
        INSERT INTO categorias (nombre, descripcion, imagen, activo)
        VALUES (?, ?, ?, 1)
    `, [nombre, descripcion, imagen], function(err) {
        if (err) {
            console.error('Error al crear categoría:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.status(201).json({
            id: this.lastID,
            nombre,
            descripcion,
            imagen,
            mensaje: 'Categoría creada exitosamente'
        });
    });
});

// ==================== RUTAS DE CUPONES ====================

// Validar cupón
app.post('/api/cupones/validar', (req, res) => {
    const { codigo } = req.body;
    
    if (!codigo) {
        return res.status(400).json({ error: 'Código de cupón requerido' });
    }
    
    db.get(`
        SELECT * FROM cupones 
        WHERE codigo = ? AND activo = 1 
        AND (fecha_inicio IS NULL OR fecha_inicio <= date('now'))
        AND (fecha_fin IS NULL OR fecha_fin >= date('now'))
        AND usos_actuales < uso_maximo
    `, [codigo.toUpperCase()], (err, cupon) => {
        if (err) {
            console.error('Error al validar cupón:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (!cupon) {
            return res.status(404).json({ error: 'Cupón no válido o expirado' });
        }
        
        res.json({
            id: cupon.id,
            codigo: cupon.codigo,
            descripcion: cupon.descripcion,
            tipo: cupon.tipo,
            valor: cupon.valor
        });
    });
});

// ==================== RUTAS DE USUARIOS ====================

// Registrar usuario
app.post('/api/usuarios/registro', (req, res) => {
    const { nombre, email, password, telefono, direccion } = req.body;
    
    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }
    
    // Verificar si el email ya existe
    db.get('SELECT id FROM usuarios WHERE email = ?', [email], (err, usuario) => {
        if (err) {
            console.error('Error al verificar usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (usuario) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        
        // Crear nuevo usuario (en producción usar bcrypt para la contraseña)
        db.run(`
            INSERT INTO usuarios (nombre, email, password, telefono, direccion)
            VALUES (?, ?, ?, ?, ?)
        `, [nombre, email, password, telefono, direccion], function(err) {
            if (err) {
                console.error('Error al crear usuario:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            res.status(201).json({
                id: this.lastID,
                nombre,
                email,
                mensaje: 'Usuario registrado exitosamente'
            });
        });
    });
});

// ===== RUTAS DE AUTENTICACIÓN CON SEGURIDAD AVANZADA =====

// Login de usuario con rate limiting estricto
app.post('/api/usuarios/login', authLimiter, (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        securityLogger.log('WARNING', `Intento de login sin credenciales desde IP: ${req.ip}`, req);
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    db.get('SELECT * FROM usuarios WHERE email = ? AND password = ? AND activo = 1', 
        [email, password], (err, usuario) => {
        if (err) {
            console.error('Error al hacer login:', err);
            securityLogger.log('ERROR', `Error de base de datos en login para IP: ${req.ip}`, req);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (!usuario) {
            securityLogger.logFailedAuth(req, email);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // Log de autenticación exitosa
        securityLogger.logSuccessfulAuth(req, email);
        
        // En producción, generar JWT token aquí
        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            mensaje: 'Login exitoso'
        });
    });
});

// ===== RUTAS DE APOYO EMOCIONAL CON SEGURIDAD =====

// Importar validadores
const { validateEmotionalSupport, validateRequest } = require('./security-config');

// Endpoint para mensajes de apoyo emocional
app.post('/api/apoyo/mensaje', sensitiveLimiter, validateEmotionalSupport, validateRequest, (req, res) => {
    const { tenant_id, emocion, mensaje, contexto, metricas, anonimo, permitir_contacto } = req.body;
    
    // Log del mensaje recibido
    securityLogger.log('INFO', `Mensaje de apoyo emocional recibido de tenant: ${tenant_id}`, req);
    
    // En una implementación real, aquí guardarías en la base de datos
    const mensajeId = Date.now();
    
    res.json({
        id: mensajeId,
        mensaje: 'Tu mensaje ha sido recibido. Crisla te responderá pronto 💜',
        respuesta: 'Gracias por confiar en nosotros. Te contactaremos en las próximas horas.',
        timestamp: new Date().toISOString()
    });
});

// ==================== RUTAS DE ÓRDENES ====================

// Crear orden
app.post('/api/ordenes', (req, res) => {
    const { usuario_id, items, cupon_codigo, direccion_envio, metodo_pago, notas } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'La orden debe tener al menos un item' });
    }
    
    // Calcular totales
    let subtotal = 0;
    items.forEach(item => {
        subtotal += item.precio * item.cantidad;
    });
    
    let descuento = 0;
    let cupon_aplicado = null;
    
    // Validar cupón si se proporciona
    if (cupon_codigo) {
        db.get(`
            SELECT * FROM cupones 
            WHERE codigo = ? AND activo = 1 
            AND usos_actuales < uso_maximo
        `, [cupon_codigo.toUpperCase()], (err, cupon) => {
            if (cupon) {
                if (cupon.tipo === 'porcentaje') {
                    descuento = (subtotal * cupon.valor) / 100;
                } else {
                    descuento = cupon.valor;
                }
                cupon_aplicado = cupon.codigo;
            }
            
            crearOrden();
        });
    } else {
        crearOrden();
    }
    
    function crearOrden() {
        const total = subtotal - descuento;
        
        db.run(`
            INSERT INTO ordenes (usuario_id, total, subtotal, descuento, cupon_codigo, direccion_envio, metodo_pago, notas)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [usuario_id, total, subtotal, descuento, cupon_aplicado, direccion_envio, metodo_pago, notas], function(err) {
            if (err) {
                console.error('Error al crear orden:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            const ordenId = this.lastID;
            
            // Crear items de la orden
            const itemPromises = items.map(item => {
                return new Promise((resolve, reject) => {
                    db.run(`
                        INSERT INTO orden_items (orden_id, producto_id, cantidad, precio_unitario, subtotal)
                        VALUES (?, ?, ?, ?, ?)
                    `, [ordenId, item.producto_id, item.cantidad, item.precio, item.precio * item.cantidad], function(err) {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });
            
            Promise.all(itemPromises)
                .then(() => {
                    // Actualizar usos del cupón si se aplicó
                    if (cupon_aplicado) {
                        db.run('UPDATE cupones SET usos_actuales = usos_actuales + 1 WHERE codigo = ?', [cupon_aplicado]);
                    }
                    
                    res.status(201).json({
                        id: ordenId,
                        total,
                        subtotal,
                        descuento,
                        mensaje: 'Orden creada exitosamente'
                    });
                })
                .catch(err => {
                    console.error('Error al crear items de orden:', err);
                    res.status(500).json({ error: 'Error interno del servidor' });
                });
        });
    }
});

// Obtener órdenes de un usuario
app.get('/api/usuarios/:id/ordenes', (req, res) => {
    const { id } = req.params;
    
    db.all(`
        SELECT o.*, 
               COUNT(oi.id) as total_items
        FROM ordenes o
        LEFT JOIN orden_items oi ON o.id = oi.orden_id
        WHERE o.usuario_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `, [id], (err, ordenes) => {
        if (err) {
            console.error('Error al obtener órdenes:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json(ordenes);
    });
});

// ==================== RUTAS DE WISHLIST ====================

// Agregar a wishlist
app.post('/api/wishlist', (req, res) => {
    const { usuario_id, producto_id } = req.body;
    
    if (!usuario_id || !producto_id) {
        return res.status(400).json({ error: 'Usuario y producto son requeridos' });
    }
    
    db.run('INSERT OR IGNORE INTO wishlist (usuario_id, producto_id) VALUES (?, ?)', 
        [usuario_id, producto_id], function(err) {
        if (err) {
            console.error('Error al agregar a wishlist:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({ mensaje: 'Producto agregado a favoritos' });
    });
});

// Remover de wishlist
app.delete('/api/wishlist/:usuario_id/:producto_id', (req, res) => {
    const { usuario_id, producto_id } = req.params;
    
    db.run('DELETE FROM wishlist WHERE usuario_id = ? AND producto_id = ?', 
        [usuario_id, producto_id], function(err) {
        if (err) {
            console.error('Error al remover de wishlist:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({ mensaje: 'Producto removido de favoritos' });
    });
});

// Obtener wishlist de un usuario
app.get('/api/wishlist/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
    
    db.all(`
        SELECT p.*, c.nombre as categoria_nombre
        FROM wishlist w
        JOIN productos p ON w.producto_id = p.id
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE w.usuario_id = ? AND p.activo = 1
        ORDER BY w.created_at DESC
    `, [usuario_id], (err, productos) => {
        if (err) {
            console.error('Error al obtener wishlist:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        // Procesar características JSON
        productos.forEach(producto => {
            if (producto.caracteristicas) {
                try {
                    producto.caracteristicas = JSON.parse(producto.caracteristicas);
                } catch (e) {
                    producto.caracteristicas = {};
                }
            }
        });
        
        res.json(productos);
    });
});

// ==================== RUTAS DE ESTADÍSTICAS ====================

// Obtener estadísticas básicas
app.get('/api/stats', (req, res) => {
    const stats = {};
    
    // Contar productos
    db.get('SELECT COUNT(*) as total FROM productos WHERE activo = 1', (err, result) => {
        if (err) {
            console.error('Error al obtener estadísticas:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        stats.totalProductos = result.total;
        
        // Contar categorías
        db.get('SELECT COUNT(*) as total FROM categorias WHERE activo = 1', (err, result) => {
            stats.totalCategorias = result.total;
            
            // Contar órdenes
            db.get('SELECT COUNT(*) as total FROM ordenes', (err, result) => {
                stats.totalOrdenes = result.total;
                
                // Productos destacados
                db.get('SELECT COUNT(*) as total FROM productos WHERE destacado = 1 AND activo = 1', (err, result) => {
                    stats.productosDestacados = result.total;
                    
                    res.json(stats);
                });
            });
        });
    });
});

// ==================== RUTAS DE SOPORTE ====================

// Obtener todos los usuarios (clientes)
app.get('/api/soporte/clientes', (req, res) => {
    db.all(`
        SELECT id, nombre, email, telefono, direccion, created_at, activo
        FROM usuarios 
        ORDER BY created_at DESC
    `, (err, clientes) => {
        if (err) {
            console.error('Error al obtener clientes:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(clientes);
    });
});

// Obtener todas las órdenes con detalles
app.get('/api/soporte/ordenes', (req, res) => {
    db.all(`
        SELECT o.*, u.nombre as cliente_nombre, u.email as cliente_email
        FROM ordenes o
        LEFT JOIN usuarios u ON o.usuario_id = u.id
        ORDER BY o.created_at DESC
    `, (err, ordenes) => {
        if (err) {
            console.error('Error al obtener órdenes:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(ordenes);
    });
});

// Obtener detalles de una orden específica
app.get('/api/soporte/ordenes/:id', (req, res) => {
    const { id } = req.params;
    
    db.get(`
        SELECT o.*, u.nombre as cliente_nombre, u.email as cliente_email, u.telefono
        FROM ordenes o
        LEFT JOIN usuarios u ON o.usuario_id = u.id
        WHERE o.id = ?
    `, [id], (err, orden) => {
        if (err) {
            console.error('Error al obtener orden:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (!orden) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        
        // Obtener items de la orden
        db.all(`
            SELECT oi.*, p.nombre as producto_nombre, p.imagen
            FROM orden_items oi
            LEFT JOIN productos p ON oi.producto_id = p.id
            WHERE oi.orden_id = ?
        `, [id], (err, items) => {
            if (err) {
                console.error('Error al obtener items de orden:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            orden.items = items;
            res.json(orden);
        });
    });
});

// Actualizar estado de una orden
app.put('/api/soporte/ordenes/:id/estado', (req, res) => {
    const { id } = req.params;
    const { estado, notas } = req.body;
    
    db.run(`
        UPDATE ordenes 
        SET estado = ?, notas = ?, updated_at = datetime('now')
        WHERE id = ?
    `, [estado, notas, id], function(err) {
        if (err) {
            console.error('Error al actualizar orden:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        
        res.json({ 
            mensaje: 'Estado de orden actualizado exitosamente',
            orden_id: id,
            estado: estado
        });
    });
});

// Obtener reportes de ventas
app.get('/api/soporte/reportes/ventas', (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    
    let query = `
        SELECT 
            DATE(o.created_at) as fecha,
            COUNT(*) as total_ordenes,
            SUM(o.total) as total_ventas,
            AVG(o.total) as promedio_orden
        FROM ordenes o
    `;
    
    let params = [];
    
    if (fecha_inicio && fecha_fin) {
        query += ' WHERE DATE(o.created_at) BETWEEN ? AND ?';
        params.push(fecha_inicio, fecha_fin);
    }
    
    query += ' GROUP BY DATE(o.created_at) ORDER BY fecha DESC';
    
    db.all(query, params, (err, reporte) => {
        if (err) {
            console.error('Error al obtener reporte de ventas:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(reporte);
    });
});

// Obtener productos más vendidos
app.get('/api/soporte/reportes/productos-vendidos', (req, res) => {
    const { limite = 10 } = req.query;
    
    db.all(`
        SELECT 
            p.nombre,
            p.precio,
            SUM(oi.cantidad) as total_vendido,
            SUM(oi.subtotal) as total_ventas
        FROM orden_items oi
        LEFT JOIN productos p ON oi.producto_id = p.id
        GROUP BY oi.producto_id
        ORDER BY total_vendido DESC
        LIMIT ?
    `, [limite], (err, productos) => {
        if (err) {
            console.error('Error al obtener productos vendidos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(productos);
    });
});

// ==================== RUTAS DE FEEDBACKS DE TIENDAS ====================

// Obtener feedbacks de una tienda
app.get('/api/tiendas/:tiendaId/feedbacks', (req, res) => {
    const { tiendaId } = req.params;
    const { limite = 50, pagina = 1, solo_aprobados = 'true' } = req.query;
    
    const offset = (pagina - 1) * limite;
    
    let query = 'SELECT * FROM tienda_feedbacks WHERE tienda_id = ?';
    let params = [tiendaId];
    
    if (solo_aprobados === 'true') {
        query += ' AND aprobado = 1';
    }
    
    query += ' ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limite), parseInt(offset));
    
    db.all(query, params, (err, feedbacks) => {
        if (err) {
            console.error('Error al obtener feedbacks:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        // Obtener estadísticas
        db.get('SELECT * FROM tienda_feedback_stats WHERE tienda_id = ?', [tiendaId], (err, stats) => {
            if (err) {
                console.error('Error al obtener stats:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            res.json({
                feedbacks,
                stats: stats || {
                    total_feedbacks: 0,
                    promedio_calificacion: 0,
                    total_5_estrellas: 0,
                    total_4_estrellas: 0,
                    total_3_estrellas: 0,
                    total_2_estrellas: 0,
                    total_1_estrella: 0
                }
            });
        });
    });
});

// Crear nuevo feedback
app.post('/api/tiendas/:tiendaId/feedbacks', authLimiter, (req, res) => {
    const { tiendaId } = req.params;
    const { usuario_nombre, usuario_email, calificacion, comentario } = req.body;
    
    // Validaciones
    if (!usuario_nombre || !calificacion) {
        return res.status(400).json({ error: 'Nombre y calificación son requeridos' });
    }
    
    if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
    }
    
    const query = `
        INSERT INTO tienda_feedbacks (tienda_id, usuario_nombre, usuario_email, calificacion, comentario)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(query, [tiendaId, usuario_nombre, usuario_email, calificacion, comentario], function(err) {
        if (err) {
            console.error('Error al crear feedback:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        // Actualizar estadísticas
        actualizarEstadisticasFeedback(tiendaId);
        
        res.status(201).json({
            message: 'Feedback enviado correctamente. Será revisado antes de publicarse.',
            id: this.lastID
        });
    });
});

// Aprobar feedback (solo admin)
app.patch('/api/tiendas/:tiendaId/feedbacks/:feedbackId/aprobar', sensitiveLimiter, (req, res) => {
    const { tiendaId, feedbackId } = req.params;
    
    const query = 'UPDATE tienda_feedbacks SET aprobado = 1 WHERE id = ? AND tienda_id = ?';
    
    db.run(query, [feedbackId, tiendaId], function(err) {
        if (err) {
            console.error('Error al aprobar feedback:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Feedback no encontrado' });
        }
        
        actualizarEstadisticasFeedback(tiendaId);
        
        res.json({ message: 'Feedback aprobado correctamente' });
    });
});

// Responder a feedback (tienda owner)
app.patch('/api/tiendas/:tiendaId/feedbacks/:feedbackId/responder', sensitiveLimiter, (req, res) => {
    const { tiendaId, feedbackId } = req.params;
    const { respuesta_tienda } = req.body;
    
    if (!respuesta_tienda) {
        return res.status(400).json({ error: 'La respuesta es requerida' });
    }
    
    const query = `
        UPDATE tienda_feedbacks 
        SET respuesta_tienda = ?, fecha_respuesta = CURRENT_TIMESTAMP 
        WHERE id = ? AND tienda_id = ?
    `;
    
    db.run(query, [respuesta_tienda, feedbackId, tiendaId], function(err) {
        if (err) {
            console.error('Error al responder feedback:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Feedback no encontrado' });
        }
        
        res.json({ message: 'Respuesta publicada correctamente' });
    });
});

// Marcar feedback como útil
app.post('/api/tiendas/:tiendaId/feedbacks/:feedbackId/util', (req, res) => {
    const { tiendaId, feedbackId } = req.params;
    
    const query = `
        UPDATE tienda_feedbacks 
        SET util_count = util_count + 1 
        WHERE id = ? AND tienda_id = ?
    `;
    
    db.run(query, [feedbackId, tiendaId], function(err) {
        if (err) {
            console.error('Error al marcar como útil:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Feedback no encontrado' });
        }
        
        res.json({ message: 'Marcado como útil' });
    });
});

// Función auxiliar para actualizar estadísticas
function actualizarEstadisticasFeedback(tiendaId) {
    // Obtener todos los feedbacks aprobados
    db.all('SELECT calificacion FROM tienda_feedbacks WHERE tienda_id = ? AND aprobado = 1', [tiendaId], (err, feedbacks) => {
        if (err) {
            console.error('Error al calcular estadísticas:', err);
            return;
        }
        
        const total = feedbacks.length;
        if (total === 0) {
            return;
        }
        
        const suma = feedbacks.reduce((acc, f) => acc + f.calificacion, 0);
        const promedio = suma / total;
        
        const estrellas = {
            5: feedbacks.filter(f => f.calificacion === 5).length,
            4: feedbacks.filter(f => f.calificacion === 4).length,
            3: feedbacks.filter(f => f.calificacion === 3).length,
            2: feedbacks.filter(f => f.calificacion === 2).length,
            1: feedbacks.filter(f => f.calificacion === 1).length
        };
        
        const query = `
            INSERT OR REPLACE INTO tienda_feedback_stats 
            (tienda_id, total_feedbacks, promedio_calificacion, 
             total_5_estrellas, total_4_estrellas, total_3_estrellas, 
             total_2_estrellas, total_1_estrella, ultima_actualizacion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        db.run(query, [
            tiendaId, total, promedio.toFixed(2),
            estrellas[5], estrellas[4], estrellas[3], estrellas[2], estrellas[1]
        ], (err) => {
            if (err) {
                console.error('Error al actualizar stats:', err);
            } else {
                console.log(`✅ Stats actualizadas para ${tiendaId}`);
            }
        });
    });
}

// ==================== RUTA DE PRUEBA ====================

app.get('/api/test', (req, res) => {
    res.json({
        mensaje: '🚀 API Cresalia funcionando correctamente',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// ==================== MANEJO DE ERRORES ====================

app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
    console.log(`🎉 Servidor Cresalia ejecutándose en puerto ${PORT}`);
    console.log(`📡 API disponible en: http://localhost:${PORT}/api`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err.message);
        } else {
            console.log('✅ Base de datos cerrada');
        }
        process.exit(0);
    });
});




