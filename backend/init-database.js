const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear conexión a la base de datos
const dbPath = path.join(__dirname, 'friocas.db');
const db = new sqlite3.Database(dbPath);

console.log('🗄️ Inicializando base de datos Cresalia...');

// Crear tablas
db.serialize(() => {
    // Tabla de categorías
    db.run(`CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        descripcion TEXT,
        imagen TEXT,
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de productos
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        precio_anterior DECIMAL(10,2),
        stock INTEGER DEFAULT 0,
        categoria_id INTEGER,
        imagen TEXT,
        imagenes TEXT, -- JSON array de imágenes adicionales
        caracteristicas TEXT, -- JSON object con características
        destacado BOOLEAN DEFAULT 0,
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES categorias (id)
    )`);

    // Tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        telefono TEXT,
        direccion TEXT,
        rol TEXT DEFAULT 'cliente',
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de órdenes
    db.run(`CREATE TABLE IF NOT EXISTS ordenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        total DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        descuento DECIMAL(10,2) DEFAULT 0,
        cupon_codigo TEXT,
        estado TEXT DEFAULT 'pendiente',
        metodo_pago TEXT,
        direccion_envio TEXT,
        notas TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )`);

    // Tabla de items de orden
    db.run(`CREATE TABLE IF NOT EXISTS orden_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orden_id INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (orden_id) REFERENCES ordenes (id),
        FOREIGN KEY (producto_id) REFERENCES productos (id)
    )`);

    // Tabla de cupones
    db.run(`CREATE TABLE IF NOT EXISTS cupones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        descripcion TEXT,
        tipo TEXT DEFAULT 'porcentaje', -- 'porcentaje' o 'monto_fijo'
        valor DECIMAL(10,2) NOT NULL,
        uso_maximo INTEGER DEFAULT 1,
        usos_actuales INTEGER DEFAULT 0,
        fecha_inicio DATE,
        fecha_fin DATE,
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de wishlist
    db.run(`CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
        FOREIGN KEY (producto_id) REFERENCES productos (id),
        UNIQUE(usuario_id, producto_id)
    )`);

    console.log('✅ Tablas creadas correctamente');

    // Insertar datos de ejemplo
    console.log('📦 Insertando datos de ejemplo...');

    // Categorías de ejemplo para Cresalia
    const categorias = [
        { nombre: 'Equipos Médicos', descripcion: 'Equipos especializados para rehabilitación y terapia' },
        { nombre: 'Dispositivos de Movilidad', descripcion: 'Sillas de ruedas, andadores y dispositivos de apoyo' },
        { nombre: 'Terapia Física', descripcion: 'Equipos para ejercicios y terapia física' },
        { nombre: 'Ortopedia', descripcion: 'Productos ortopédicos y de soporte' },
        { nombre: 'Accesorios', descripcion: 'Accesorios y complementos para equipos médicos' }
    ];

    categorias.forEach(categoria => {
        db.run(`INSERT OR IGNORE INTO categorias (nombre, descripcion) VALUES (?, ?)`, 
            [categoria.nombre, categoria.descripcion]);
    });

    // Productos de ejemplo para Cresalia
    const productos = [
        {
            nombre: 'Silla de Ruedas Eléctrica Premium',
            descripcion: 'Silla de ruedas eléctrica de alta calidad con control joystick y batería de larga duración',
            precio: 2500.00,
            precio_anterior: 2800.00,
            stock: 5,
            categoria_id: 2,
            caracteristicas: JSON.stringify({
                peso_maximo: '150 kg',
                velocidad_maxima: '10 km/h',
                autonomia: '25 km',
                peso: '45 kg'
            }),
            destacado: 1
        },
        {
            nombre: 'Andador con Ruedas Plegable',
            descripcion: 'Andador ligero y plegable con ruedas para máxima movilidad y comodidad',
            precio: 180.00,
            precio_anterior: 220.00,
            stock: 15,
            categoria_id: 2,
            caracteristicas: JSON.stringify({
                peso_maximo: '136 kg',
                peso: '6.8 kg',
                material: 'Aluminio',
                plegable: true
            }),
            destacado: 1
        },
        {
            nombre: 'Bicicleta Estática Terapéutica',
            descripcion: 'Bicicleta estática diseñada para rehabilitación y terapia física',
            precio: 450.00,
            precio_anterior: 520.00,
            stock: 8,
            categoria_id: 3,
            caracteristicas: JSON.stringify({
                resistencia: '8 niveles',
                peso_maximo: '150 kg',
                dimensiones: '120 x 60 x 90 cm',
                monitor: 'LCD'
            }),
            destacado: 1
        },
        {
            nombre: 'Cama Hospitalaria Eléctrica',
            descripcion: 'Cama hospitalaria eléctrica con múltiples posiciones y colchón antiescaras',
            precio: 1200.00,
            precio_anterior: 1400.00,
            stock: 3,
            categoria_id: 1,
            caracteristicas: JSON.stringify({
                peso_maximo: '200 kg',
                posiciones: '5',
                dimensiones: '200 x 90 cm',
                motor: 'Eléctrico'
            }),
            destacado: 0
        },
        {
            nombre: 'Férula de Tobillo Ajustable',
            descripcion: 'Férula ortopédica para tobillo con ajuste personalizable',
            precio: 85.00,
            precio_anterior: 95.00,
            stock: 25,
            categoria_id: 4,
            caracteristicas: JSON.stringify({
                tallas: 'S, M, L, XL',
                material: 'Neopreno',
                ajustable: true,
                lavable: true
            }),
            destacado: 0
        },
        {
            nombre: 'Monitor de Signos Vitales',
            descripcion: 'Monitor multiparamétrico para seguimiento de signos vitales',
            precio: 850.00,
            precio_anterior: 950.00,
            stock: 4,
            categoria_id: 1,
            caracteristicas: JSON.stringify({
                parametros: 'ECG, SpO2, NIBP, TEMP',
                pantalla: '7 pulgadas',
                bateria: '8 horas',
                conectividad: 'WiFi'
            }),
            destacado: 1
        },
        {
            nombre: 'Mesa de Terapia Ocupacional',
            descripcion: 'Mesa ajustable para terapia ocupacional y rehabilitación',
            precio: 320.00,
            precio_anterior: 380.00,
            stock: 12,
            categoria_id: 3,
            caracteristicas: JSON.stringify({
                altura_ajustable: '60-90 cm',
                material: 'Madera y metal',
                dimensiones: '120 x 60 cm',
                peso_maximo: '50 kg'
            }),
            destacado: 0
        },
        {
            nombre: 'Cojín Antiescaras',
            descripcion: 'Cojín especializado para prevenir úlceras por presión',
            precio: 75.00,
            precio_anterior: 90.00,
            stock: 30,
            categoria_id: 5,
            caracteristicas: JSON.stringify({
                material: 'Gel viscoelástico',
                dimensiones: '40 x 40 cm',
                peso_maximo: '150 kg',
                lavable: true
            }),
            destacado: 0
        },
        {
            nombre: 'Tensiónmetro Digital Profesional',
            descripcion: 'Tensiónmetro digital de brazo con tecnología avanzada',
            precio: 120.00,
            precio_anterior: 140.00,
            stock: 20,
            categoria_id: 1,
            caracteristicas: JSON.stringify({
                precision: '±3 mmHg',
                memoria: '99 lecturas',
                pantalla: 'LCD grande',
                bateria: 'AAA x 2'
            }),
            destacado: 1
        },
        {
            nombre: 'Muletas Axilares Ajustables',
            descripcion: 'Muletas axilares de aluminio con altura ajustable',
            precio: 45.00,
            precio_anterior: 55.00,
            stock: 35,
            categoria_id: 2,
            caracteristicas: JSON.stringify({
                material: 'Aluminio',
                altura_ajustable: '135-155 cm',
                peso_maximo: '125 kg',
                peso: '0.8 kg'
            }),
            destacado: 0
        }
    ];

    productos.forEach(producto => {
        db.run(`INSERT OR IGNORE INTO productos (nombre, descripcion, precio, precio_anterior, stock, categoria_id, caracteristicas, destacado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [producto.nombre, producto.descripcion, producto.precio, producto.precio_anterior, 
             producto.stock, producto.categoria_id, producto.caracteristicas, producto.destacado]);
    });

    // Cupones de ejemplo
    const cupones = [
        { codigo: 'CRESALIA10', descripcion: '10% de descuento en toda la tienda', tipo: 'porcentaje', valor: 10, uso_maximo: 100 },
        { codigo: 'CRESALIA20', descripcion: '20% de descuento en equipos médicos', tipo: 'porcentaje', valor: 20, uso_maximo: 50 },
        { codigo: 'ENVIOGRATIS', descripcion: 'Envío gratis en compras superiores a $500', tipo: 'monto_fijo', valor: 50, uso_maximo: 200 }
    ];

    cupones.forEach(cupon => {
        db.run(`INSERT OR IGNORE INTO cupones (codigo, descripcion, tipo, valor, uso_maximo) 
                VALUES (?, ?, ?, ?, ?)`, 
            [cupon.codigo, cupon.descripcion, cupon.tipo, cupon.valor, cupon.uso_maximo]);
    });

    // Usuario administrador de ejemplo
    db.run(`INSERT OR IGNORE INTO usuarios (nombre, email, password, rol) 
            VALUES (?, ?, ?, ?)`, 
        ['Administrador Cresalia', 'admin@cresalia.com', '$2a$10$rQZ8K9vX2mN3pL4qR5sT6u', 'admin']);

    console.log('✅ Datos de ejemplo insertados correctamente');
    console.log('🎉 Base de datos Cresalia inicializada exitosamente!');
});

// Cerrar conexión
db.close((err) => {
    if (err) {
        console.error('❌ Error al cerrar la base de datos:', err.message);
    } else {
        console.log('🔒 Conexión a la base de datos cerrada');
    }
});




