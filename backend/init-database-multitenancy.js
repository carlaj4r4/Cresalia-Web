const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear conexión a la base de datos
const dbPath = path.join(__dirname, 'cresalia.db');
const db = new sqlite3.Database(dbPath);

console.log('🗄️ Inicializando base de datos Cresalia Multi-tenant...');

// Crear tablas con soporte multi-tenancy
db.serialize(() => {
    // ==================== TABLA DE TENANTS (CLIENTES) ====================
    db.run(`CREATE TABLE IF NOT EXISTS tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL, -- URL amigable (ej: mi-tienda)
        nombre_empresa TEXT NOT NULL,
        dominio TEXT UNIQUE, -- Dominio personalizado (opcional)
        email_contacto TEXT NOT NULL,
        telefono TEXT,
        logo_url TEXT,
        favicon_url TEXT,
        eslogan TEXT,
        descripcion TEXT,
        
        -- Configuración de diseño
        color_primario TEXT DEFAULT '#667eea',
        color_secundario TEXT DEFAULT '#764ba2',
        color_acento TEXT DEFAULT '#f59e0b',
        fuente_principal TEXT DEFAULT 'Poppins',
        
        -- Configuración de negocio
        moneda TEXT DEFAULT 'USD',
        idioma TEXT DEFAULT 'es',
        zona_horaria TEXT DEFAULT 'America/Lima',
        
        -- Configuración de e-commerce
        permite_pagos_online BOOLEAN DEFAULT 1,
        permite_pagos_efectivo BOOLEAN DEFAULT 1,
        costo_envio DECIMAL(10,2) DEFAULT 0,
        envio_gratis_desde DECIMAL(10,2) DEFAULT 0,
        
        -- API Keys (encriptadas)
        mercadopago_public_key TEXT,
        mercadopago_access_token TEXT,
        
        -- Plan y facturación
        plan TEXT DEFAULT 'free', -- free, basic, pro, enterprise
        estado TEXT DEFAULT 'activo', -- activo, suspendido, cancelado
        fecha_inicio DATE DEFAULT CURRENT_TIMESTAMP,
        fecha_expiracion DATE,
        limite_productos INTEGER DEFAULT 50,
        limite_ordenes_mes INTEGER DEFAULT 100,
        
        -- Metadata
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // ==================== USUARIOS (MULTI-TENANT) ====================
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        telefono TEXT,
        direccion TEXT,
        rol TEXT DEFAULT 'cliente', -- cliente, admin_tenant, super_admin
        activo BOOLEAN DEFAULT 1,
        ultimo_acceso DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
        UNIQUE(tenant_id, email)
    )`);

    // ==================== CATEGORÍAS (MULTI-TENANT) ====================
    db.run(`CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        imagen TEXT,
        orden INTEGER DEFAULT 0,
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
        UNIQUE(tenant_id, nombre)
    )`);

    // ==================== PRODUCTOS (MULTI-TENANT) ====================
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        nombre TEXT NOT NULL,
        slug TEXT NOT NULL,
        descripcion TEXT,
        descripcion_larga TEXT,
        precio DECIMAL(10,2) NOT NULL,
        precio_anterior DECIMAL(10,2),
        costo DECIMAL(10,2), -- Para calcular rentabilidad
        stock INTEGER DEFAULT 0,
        categoria_id INTEGER,
        sku TEXT,
        codigo_barras TEXT,
        
        -- Imágenes
        imagen_principal TEXT,
        imagenes TEXT, -- JSON array
        
        -- Características
        caracteristicas TEXT, -- JSON object
        especificaciones TEXT, -- JSON object
        
        -- SEO
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        
        -- Control
        destacado BOOLEAN DEFAULT 0,
        nuevo BOOLEAN DEFAULT 0,
        activo BOOLEAN DEFAULT 1,
        visitas INTEGER DEFAULT 0,
        ventas_totales INTEGER DEFAULT 0,
        
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
        FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE SET NULL,
        UNIQUE(tenant_id, slug)
    )`);

    // ==================== ÓRDENES (MULTI-TENANT) ====================
    db.run(`CREATE TABLE IF NOT EXISTS ordenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        numero_orden TEXT NOT NULL,
        usuario_id INTEGER,
        
        -- Cliente (puede ser guest)
        cliente_nombre TEXT NOT NULL,
        cliente_email TEXT NOT NULL,
        cliente_telefono TEXT,
        
        -- Montos
        subtotal DECIMAL(10,2) NOT NULL,
        descuento DECIMAL(10,2) DEFAULT 0,
        costo_envio DECIMAL(10,2) DEFAULT 0,
        impuestos DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        
        -- Cupón
        cupon_codigo TEXT,
        cupon_descuento DECIMAL(10,2) DEFAULT 0,
        
        -- Estado
        estado TEXT DEFAULT 'pendiente', -- pendiente, confirmado, procesando, enviado, entregado, cancelado
        estado_pago TEXT DEFAULT 'pendiente', -- pendiente, aprobado, rechazado, reembolsado
        
        -- Método de pago
        metodo_pago TEXT, -- mercadopago, efectivo, transferencia
        payment_id TEXT, -- ID de pago externo (MercadoPago, etc)
        
        -- Envío
        direccion_envio TEXT NOT NULL,
        ciudad TEXT,
        codigo_postal TEXT,
        pais TEXT DEFAULT 'PE',
        tracking_number TEXT,
        
        -- Notas
        notas_cliente TEXT,
        notas_admin TEXT,
        
        -- Metadata
        ip_address TEXT,
        user_agent TEXT,
        
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL,
        UNIQUE(tenant_id, numero_orden)
    )`);

    // ==================== ITEMS DE ORDEN (MULTI-TENANT) ====================
    db.run(`CREATE TABLE IF NOT EXISTS orden_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orden_id INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        producto_nombre TEXT NOT NULL, -- Guardar nombre por si se elimina el producto
        producto_imagen TEXT,
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (orden_id) REFERENCES ordenes (id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE RESTRICT
    )`);

    // ==================== CUPONES (MULTI-TENANT) ====================
    db.run(`CREATE TABLE IF NOT EXISTS cupones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        codigo TEXT NOT NULL,
        descripcion TEXT,
        tipo TEXT DEFAULT 'porcentaje', -- porcentaje, monto_fijo, envio_gratis
        valor DECIMAL(10,2) NOT NULL,
        monto_minimo DECIMAL(10,2) DEFAULT 0,
        uso_maximo INTEGER DEFAULT 1,
        usos_actuales INTEGER DEFAULT 0,
        fecha_inicio DATE,
        fecha_fin DATE,
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
        UNIQUE(tenant_id, codigo)
    )`);

    // ==================== WISHLIST (MULTI-TENANT) ====================
    db.run(`CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
        UNIQUE(usuario_id, producto_id)
    )`);

    // ==================== REVIEWS (MULTI-TENANT) ====================
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        usuario_id INTEGER,
        nombre_cliente TEXT NOT NULL,
        email_cliente TEXT,
        calificacion INTEGER NOT NULL CHECK(calificacion >= 1 AND calificacion <= 5),
        titulo TEXT,
        comentario TEXT,
        verificado BOOLEAN DEFAULT 0,
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
    )`);

    // ==================== ANALYTICS (MULTI-TENANT) ====================
    db.run(`CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        fecha DATE NOT NULL,
        visitas INTEGER DEFAULT 0,
        visitantes_unicos INTEGER DEFAULT 0,
        productos_vistos INTEGER DEFAULT 0,
        carritos_creados INTEGER DEFAULT 0,
        carritos_abandonados INTEGER DEFAULT 0,
        ordenes_completadas INTEGER DEFAULT 0,
        ingresos_totales DECIMAL(10,2) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
        UNIQUE(tenant_id, fecha)
    )`);

    console.log('✅ Tablas multi-tenant creadas correctamente');

    // ==================== INSERTAR TENANT DE EJEMPLO ====================
    console.log('📦 Insertando tenant de ejemplo...');

    const tenantExample = {
        slug: 'demo-store',
        nombre_empresa: 'Tienda Demo Cresalia',
        email_contacto: 'demo@cresalia.com',
        telefono: '+51 999 999 999',
        eslogan: 'Empezamos pocos, crecemos mucho',
        descripcion: 'Tienda de ejemplo para demostrar las capacidades de Cresalia',
        color_primario: '#667eea',
        color_secundario: '#764ba2',
        plan: 'pro',
        limite_productos: 500,
        limite_ordenes_mes: 1000
    };

    db.run(`INSERT OR IGNORE INTO tenants (
        slug, nombre_empresa, email_contacto, telefono, eslogan, descripcion,
        color_primario, color_secundario, plan, limite_productos, limite_ordenes_mes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [tenantExample.slug, tenantExample.nombre_empresa, tenantExample.email_contacto,
         tenantExample.telefono, tenantExample.eslogan, tenantExample.descripcion,
         tenantExample.color_primario, tenantExample.color_secundario, tenantExample.plan,
         tenantExample.limite_productos, tenantExample.limite_ordenes_mes],
        function(err) {
            if (err) {
                console.error('Error al insertar tenant:', err);
                return;
            }

            const tenantId = this.lastID || 1;
            console.log(`✅ Tenant demo creado con ID: ${tenantId}`);

            // Insertar categorías de ejemplo para el tenant
            const categorias = [
                { nombre: 'Limpieza Automotriz', descripcion: 'Productos de limpieza para vehículos' },
                { nombre: 'Ceras y Protectores', descripcion: 'Ceras y productos de protección' },
                { nombre: 'Accesorios', descripcion: 'Accesorios para el cuidado automotriz' }
            ];

            categorias.forEach(categoria => {
                db.run(`INSERT OR IGNORE INTO categorias (tenant_id, nombre, descripcion) VALUES (?, ?, ?)`,
                    [tenantId, categoria.nombre, categoria.descripcion]);
            });

            // Insertar productos de ejemplo
            const productos = [
                {
                    nombre: 'Shampoo Premium Auto',
                    slug: 'shampoo-premium-auto',
                    descripcion: 'Shampoo de alta calidad para lavado de autos',
                    precio: 25.99,
                    precio_anterior: 29.99,
                    stock: 50,
                    categoria_id: 1,
                    destacado: 1
                },
                {
                    nombre: 'Cera Líquida Protectora',
                    slug: 'cera-liquida-protectora',
                    descripcion: 'Cera líquida de larga duración',
                    precio: 35.99,
                    precio_anterior: 42.99,
                    stock: 30,
                    categoria_id: 2,
                    destacado: 1
                },
                {
                    nombre: 'Kit de Limpieza Completo',
                    slug: 'kit-limpieza-completo',
                    descripcion: 'Kit completo con todos los productos esenciales',
                    precio: 89.99,
                    precio_anterior: 109.99,
                    stock: 15,
                    categoria_id: 3,
                    destacado: 1
                }
            ];

            productos.forEach(producto => {
                db.run(`INSERT OR IGNORE INTO productos (
                    tenant_id, nombre, slug, descripcion, precio, precio_anterior,
                    stock, categoria_id, destacado
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [tenantId, producto.nombre, producto.slug, producto.descripcion,
                     producto.precio, producto.precio_anterior, producto.stock,
                     producto.categoria_id, producto.destacado]);
            });

            // Usuario admin del tenant
            db.run(`INSERT OR IGNORE INTO usuarios (
                tenant_id, nombre, email, password, rol
            ) VALUES (?, ?, ?, ?, ?)`,
                [tenantId, 'Admin Demo', 'admin@demo-store.cresalia.com',
                 '$2a$10$rQZ8K9vX2mN3pL4qR5sT6u', 'admin_tenant']);

            // Cupón de ejemplo
            db.run(`INSERT OR IGNORE INTO cupones (
                tenant_id, codigo, descripcion, tipo, valor, uso_maximo
            ) VALUES (?, ?, ?, ?, ?, ?)`,
                [tenantId, 'BIENVENIDA10', 'Descuento de bienvenida', 'porcentaje', 10, 100]);

            console.log('✅ Datos de ejemplo del tenant insertados');
        });

    console.log('🎉 Base de datos Cresalia Multi-tenant inicializada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Ejecuta: npm start');
    console.log('   2. Accede a: http://localhost:3001/demo-store');
    console.log('   3. Credenciales admin: admin@demo-store.cresalia.com');
});

// Cerrar conexión
db.close((err) => {
    if (err) {
        console.error('❌ Error al cerrar la base de datos:', err.message);
    } else {
        console.log('🔒 Conexión a la base de datos cerrada');
    }
});



