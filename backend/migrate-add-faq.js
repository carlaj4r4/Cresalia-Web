const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cresalia.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Agregando sistema de FAQs a la base de datos...');

db.serialize(() => {
    // Crear tabla de FAQs
    db.run(`CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        categoria TEXT NOT NULL,
        pregunta TEXT NOT NULL,
        respuesta TEXT NOT NULL,
        tags TEXT, -- JSON array de tags para búsqueda
        orden INTEGER DEFAULT 0,
        visitas INTEGER DEFAULT 0,
        votos_util INTEGER DEFAULT 0,
        votos_no_util INTEGER DEFAULT 0,
        activo BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            console.error('Error creando tabla faqs:', err.message);
        } else {
            console.log('✅ Tabla faqs creada');
        }
    });

    // Insertar FAQs de ejemplo para demo-store
    const faqsDemo = [
        {
            tenant_id: 1,
            categoria: 'Pedidos',
            pregunta: '¿Cómo realizo un pedido?',
            respuesta: 'Navega por nuestros productos, agrega al carrito los que desees y completa el proceso de pago. Recibirás confirmación por email.',
            tags: JSON.stringify(['pedido', 'comprar', 'orden', 'como']),
            orden: 1
        },
        {
            tenant_id: 1,
            categoria: 'Envíos',
            pregunta: '¿Cuánto tarda el envío?',
            respuesta: 'Los envíos demoran entre 3-5 días hábiles a nivel nacional. Para envíos internacionales, entre 7-15 días.',
            tags: JSON.stringify(['envio', 'entrega', 'tiempo', 'demora']),
            orden: 2
        },
        {
            tenant_id: 1,
            categoria: 'Envíos',
            pregunta: '¿Tienen envío gratis?',
            respuesta: '¡Sí! Envío gratis en compras mayores a $100. Para compras menores, el costo de envío es de $5.',
            tags: JSON.stringify(['envio', 'gratis', 'costo', 'precio']),
            orden: 3
        },
        {
            tenant_id: 1,
            categoria: 'Pagos',
            pregunta: '¿Qué métodos de pago aceptan?',
            respuesta: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express) y pago en efectivo contra entrega.',
            tags: JSON.stringify(['pago', 'tarjeta', 'efectivo', 'metodo']),
            orden: 4
        },
        {
            tenant_id: 1,
            categoria: 'Pagos',
            pregunta: '¿Es seguro pagar con tarjeta?',
            respuesta: 'Absolutamente. Usamos Mercado Pago con encriptación SSL. Tu información está 100% protegida.',
            tags: JSON.stringify(['seguridad', 'tarjeta', 'pago', 'proteccion']),
            orden: 5
        },
        {
            tenant_id: 1,
            categoria: 'Devoluciones',
            pregunta: '¿Puedo devolver un producto?',
            respuesta: 'Sí, aceptamos devoluciones dentro de 30 días. El producto debe estar sin usar y en su empaque original.',
            tags: JSON.stringify(['devolver', 'cambio', 'garantia', 'reembolso']),
            orden: 6
        },
        {
            tenant_id: 1,
            categoria: 'Devoluciones',
            pregunta: '¿Cómo hago una devolución?',
            respuesta: 'Contáctanos por email o chat con tu número de orden. Te enviaremos una etiqueta de devolución prepagada.',
            tags: JSON.stringify(['devolver', 'proceso', 'como', 'pasos']),
            orden: 7
        },
        {
            tenant_id: 1,
            categoria: 'Cuenta',
            pregunta: '¿Necesito crear una cuenta para comprar?',
            respuesta: 'No es obligatorio, pero crear cuenta te permite ver tu historial, guardar direcciones y recibir ofertas exclusivas.',
            tags: JSON.stringify(['cuenta', 'registro', 'comprar', 'necesario']),
            orden: 8
        },
        {
            tenant_id: 1,
            categoria: 'Cuenta',
            pregunta: '¿Cómo recupero mi contraseña?',
            respuesta: 'Haz clic en "Olvidé mi contraseña" en el login. Te enviaremos un email con un link para resetearla.',
            tags: JSON.stringify(['password', 'contraseña', 'recuperar', 'olvidé']),
            orden: 9
        },
        {
            tenant_id: 1,
            categoria: 'Productos',
            pregunta: '¿Los productos tienen garantía?',
            respuesta: 'Sí, todos nuestros productos tienen garantía de 30 días contra defectos de fabricación.',
            tags: JSON.stringify(['garantia', 'calidad', 'defecto', 'proteccion']),
            orden: 10
        }
    ];

    const stmt = db.prepare(`INSERT INTO faqs 
        (tenant_id, categoria, pregunta, respuesta, tags, orden)
        VALUES (?, ?, ?, ?, ?, ?)`);

    faqsDemo.forEach(faq => {
        stmt.run([
            faq.tenant_id,
            faq.categoria,
            faq.pregunta,
            faq.respuesta,
            faq.tags,
            faq.orden
        ]);
    });

    stmt.finalize(() => {
        console.log('✅ FAQs de ejemplo insertados');
    });

    console.log('\n✅ Migración de FAQs completada!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Reinicia el servidor: npm start');
    console.log('   2. Accede a: /api/demo-store/faqs');
    console.log('   3. Agrega <script src="core/faq-system.js"></script>');
});

db.close((err) => {
    if (err) {
        console.error('Error al cerrar BD:', err.message);
    } else {
        console.log('🔒 Migración finalizada');
    }
});


