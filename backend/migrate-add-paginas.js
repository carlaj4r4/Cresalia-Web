// ===== MIGRACIÓN: Agregar Tabla de Páginas Personalizables =====

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'friocas.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Iniciando migración: Páginas Personalizables...\n');

db.serialize(() => {
    // 1. Tabla de páginas personalizables
    console.log('📄 Creando tabla paginas_custom...');
    
    db.run(`
        CREATE TABLE IF NOT EXISTS paginas_custom (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT NOT NULL,
            titulo TEXT NOT NULL,
            slug TEXT NOT NULL,
            contenido TEXT NOT NULL,
            tipo TEXT DEFAULT 'custom', -- custom, about, terms, privacy, shipping, returns, faq
            visible INTEGER DEFAULT 1,
            en_menu INTEGER DEFAULT 1,
            orden INTEGER DEFAULT 0,
            meta_descripcion TEXT,
            meta_keywords TEXT,
            creada_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            actualizada_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(tenant_id, slug)
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error al crear tabla paginas_custom:', err);
        } else {
            console.log('✅ Tabla paginas_custom creada\n');
        }
    });

    // 2. Índices para optimización
    console.log('📊 Creando índices...');
    
    db.run(`
        CREATE INDEX IF NOT EXISTS idx_paginas_tenant 
        ON paginas_custom(tenant_id)
    `, (err) => {
        if (err) {
            console.error('❌ Error al crear índice:', err);
        } else {
            console.log('✅ Índice idx_paginas_tenant creado');
        }
    });

    db.run(`
        CREATE INDEX IF NOT EXISTS idx_paginas_visible 
        ON paginas_custom(tenant_id, visible, en_menu)
    `, (err) => {
        if (err) {
            console.error('❌ Error al crear índice:', err);
        } else {
            console.log('✅ Índice idx_paginas_visible creado\n');
        }
    });

    // 3. Datos de ejemplo (páginas predeterminadas)
    console.log('📝 Insertando páginas predeterminadas de ejemplo...');
    
    const paginasPredeterminadas = [
        {
            tenant_id: 'demo',
            titulo: 'Sobre Nosotros',
            slug: 'sobre-nosotros',
            contenido: `# Sobre Nosotros

## Nuestra Historia

Somos un emprendimiento que nació con la pasión de ofrecer productos de calidad.

## Nuestra Misión

Brindar la mejor experiencia de compra a nuestros clientes.

## ¿Por qué elegirnos?

- **Calidad**: Productos cuidadosamente seleccionados
- **Compromiso**: Con cada cliente y pedido
- **Atención**: Personalizada y cercana`,
            tipo: 'about',
            meta_descripcion: 'Conoce nuestra historia y por qué elegirnos'
        },
        {
            tenant_id: 'demo',
            titulo: 'Términos y Condiciones',
            slug: 'terminos',
            contenido: `# Términos y Condiciones

## 1. Aceptación de los Términos

Al usar este sitio, aceptás estos términos y condiciones.

## 2. Productos y Servicios

Ofrecemos productos de alta calidad. Los precios pueden cambiar sin previo aviso.

## 3. Precios y Pagos

Los precios están expresados en pesos argentinos. Aceptamos los métodos de pago indicados en el checkout.

## 4. Envíos

Realizamos envíos a todo el país. Los tiempos dependen de la zona.`,
            tipo: 'terms',
            meta_descripcion: 'Términos y condiciones de uso de nuestra tienda',
            en_menu: 0
        },
        {
            tenant_id: 'demo',
            titulo: 'Política de Privacidad',
            slug: 'privacidad',
            contenido: `# Política de Privacidad

## Información que Recopilamos

Recopilamos la información necesaria para procesar tus pedidos.

## Uso de la Información

Usamos tu información únicamente para:
- Procesar y enviar pedidos
- Mejorar nuestro servicio
- Comunicarnos contigo sobre tu pedido

## Seguridad

Protegemos tu información con medidas de seguridad apropiadas.`,
            tipo: 'privacy',
            meta_descripcion: 'Cómo protegemos tu información personal',
            en_menu: 0
        },
        {
            tenant_id: 'demo',
            titulo: 'Preguntas Frecuentes',
            slug: 'faq',
            contenido: `# Preguntas Frecuentes

## ¿Cómo hago un pedido?

Seleccioná los productos que querés, agregarlos al carrito y seguí los pasos del checkout.

## ¿Cuánto tarda el envío?

Depende de tu zona. Generalmente entre 3-7 días hábiles.

## ¿Aceptan devoluciones?

Sí, dentro de los 30 días de recibido el producto.

## ¿Cómo puedo contactarlos?

Por email, teléfono o redes sociales. Los datos están en la sección Contacto.`,
            tipo: 'faq',
            meta_descripcion: 'Respuestas a las preguntas más frecuentes'
        }
    ];

    const stmt = db.prepare(`
        INSERT OR IGNORE INTO paginas_custom 
        (tenant_id, titulo, slug, contenido, tipo, meta_descripcion, en_menu)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    paginasPredeterminadas.forEach((pagina) => {
        stmt.run(
            pagina.tenant_id,
            pagina.titulo,
            pagina.slug,
            pagina.contenido,
            pagina.tipo,
            pagina.meta_descripcion || '',
            pagina.en_menu !== undefined ? pagina.en_menu : 1
        );
    });

    stmt.finalize((err) => {
        if (err) {
            console.error('❌ Error al insertar páginas predeterminadas:', err);
        } else {
            console.log('✅ Páginas predeterminadas insertadas\n');
        }
    });

    // 4. Verificar
    db.all(`
        SELECT COUNT(*) as count FROM paginas_custom
    `, (err, rows) => {
        if (err) {
            console.error('❌ Error al verificar:', err);
        } else {
            console.log(`✅ Total de páginas en base de datos: ${rows[0].count}\n`);
        }

        console.log('🎉 Migración completada exitosamente!\n');
        console.log('📋 Tabla creada:');
        console.log('   • paginas_custom (páginas personalizables por tenant)\n');
        console.log('🔍 Próximo paso:');
        console.log('   Agregar rutas en server-multitenancy.js para manejar páginas\n');

        db.close();
    });
});


