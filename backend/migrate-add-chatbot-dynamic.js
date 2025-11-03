// ===== MIGRACIÓN: CHATBOT DINÁMICO =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta de la base de datos
const dbPath = path.join(__dirname, 'cresalia.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Iniciando migración: Chatbot Dinámico...');

// Crear tabla de ofertas
const createOfertasTable = `
CREATE TABLE IF NOT EXISTS ofertas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    descuento DECIMAL(5,2) DEFAULT 0,
    fecha_inicio DATE,
    fecha_fin DATE,
    activa BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(slug)
);
`;

// Crear tabla de FAQ
const createFAQTable = `
CREATE TABLE IF NOT EXISTS faq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    categoria TEXT DEFAULT 'general',
    orden INTEGER DEFAULT 0,
    activa BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(slug)
);
`;

// Crear tabla de temas de soporte
const createSoporteTemasTable = `
CREATE TABLE IF NOT EXISTS soporte_temas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    tema TEXT NOT NULL,
    solucion TEXT NOT NULL,
    categoria TEXT DEFAULT 'general',
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(slug)
);
`;

// Crear índices para optimizar consultas
const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_ofertas_tenant ON ofertas(tenant_id);',
    'CREATE INDEX IF NOT EXISTS idx_ofertas_activa ON ofertas(activa);',
    'CREATE INDEX IF NOT EXISTS idx_faq_tenant ON faq(tenant_id);',
    'CREATE INDEX IF NOT EXISTS idx_faq_activa ON faq(activa);',
    'CREATE INDEX IF NOT EXISTS idx_soporte_tenant ON soporte_temas(tenant_id);',
    'CREATE INDEX IF NOT EXISTS idx_soporte_activo ON soporte_temas(activo);'
];

// Ejecutar migración
db.serialize(() => {
    console.log('📊 Creando tabla ofertas...');
    db.run(createOfertasTable, (err) => {
        if (err) {
            console.error('❌ Error creando tabla ofertas:', err.message);
        } else {
            console.log('✅ Tabla ofertas creada exitosamente');
        }
    });

    console.log('📊 Creando tabla faq...');
    db.run(createFAQTable, (err) => {
        if (err) {
            console.error('❌ Error creando tabla faq:', err.message);
        } else {
            console.log('✅ Tabla faq creada exitosamente');
        }
    });

    console.log('📊 Creando tabla soporte_temas...');
    db.run(createSoporteTemasTable, (err) => {
        if (err) {
            console.error('❌ Error creando tabla soporte_temas:', err.message);
        } else {
            console.log('✅ Tabla soporte_temas creada exitosamente');
        }
    });

    console.log('📊 Creando índices...');
    createIndexes.forEach((indexSQL, i) => {
        db.run(indexSQL, (err) => {
            if (err) {
                console.error(`❌ Error creando índice ${i + 1}:`, err.message);
            } else {
                console.log(`✅ Índice ${i + 1} creado exitosamente`);
            }
        });
    });

    // Insertar datos de ejemplo para testing
    console.log('📊 Insertando datos de ejemplo...');
    
    // Ofertas de ejemplo
    const ejemploOfertas = db.prepare(`
        INSERT INTO ofertas (
            tenant_id, titulo, descripcion, descuento, activa
        ) VALUES (?, ?, ?, ?, ?)
    `);
    
    ejemploOfertas.run([
        'ejemplo-tienda',
        'Oferta de Bienvenida',
        'Descuento especial para nuevos clientes',
        15.00,
        1
    ], function(err) {
        if (err) {
            console.error('❌ Error insertando ejemplo de oferta:', err.message);
        } else {
            console.log('✅ Ejemplo de oferta insertado (ID:', this.lastID, ')');
        }
    });
    
    ejemploOfertas.finalize();

    // FAQ de ejemplo
    const ejemploFAQ = db.prepare(`
        INSERT INTO faq (
            tenant_id, pregunta, respuesta, categoria, orden, activa
        ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    ejemploFAQ.run([
        'ejemplo-tienda',
        '¿Cuáles son los métodos de pago?',
        'Aceptamos Mercado Pago, transferencia bancaria y pagos en efectivo.',
        'pagos',
        1,
        1
    ], function(err) {
        if (err) {
            console.error('❌ Error insertando ejemplo de FAQ:', err.message);
        } else {
            console.log('✅ Ejemplo de FAQ insertado (ID:', this.lastID, ')');
        }
    });
    
    ejemploFAQ.run([
        'ejemplo-tienda',
        '¿Hacen envíos?',
        'Sí, realizamos envíos a todo el país. El costo depende de la ubicación.',
        'envios',
        2,
        1
    ], function(err) {
        if (err) {
            console.error('❌ Error insertando ejemplo de FAQ:', err.message);
        } else {
            console.log('✅ Ejemplo de FAQ insertado (ID:', this.lastID, ')');
        }
    });
    
    ejemploFAQ.finalize();

    // Temas de soporte de ejemplo
    const ejemploSoporte = db.prepare(`
        INSERT INTO soporte_temas (
            tenant_id, tema, solucion, categoria, orden, activo
        ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    ejemploSoporte.run([
        'ejemplo-tienda',
        'Problemas de pago',
        'Si tienes problemas con el pago, contacta a nuestro soporte técnico o intenta con otro método de pago.',
        'pagos',
        1,
        1
    ], function(err) {
        if (err) {
            console.error('❌ Error insertando ejemplo de soporte:', err.message);
        } else {
            console.log('✅ Ejemplo de soporte insertado (ID:', this.lastID, ')');
        }
    });
    
    ejemploSoporte.run([
        'ejemplo-tienda',
        'Problemas de envío',
        'Para consultas sobre envíos, revisa el estado de tu pedido en tu cuenta o contacta a nuestro soporte.',
        'envios',
        2,
        1
    ], function(err) {
        if (err) {
            console.error('❌ Error insertando ejemplo de soporte:', err.message);
        } else {
            console.log('✅ Ejemplo de soporte insertado (ID:', this.lastID, ')');
        }
    });
    
    ejemploSoporte.finalize();

    // Verificar que las tablas se crearon correctamente
    setTimeout(() => {
        console.log('\n🔍 Verificando migración...');
        
        db.get("SELECT COUNT(*) as count FROM ofertas", (err, row) => {
            if (err) {
                console.error('❌ Error verificando ofertas:', err.message);
            } else {
                console.log(`✅ Tabla ofertas: ${row.count} registros`);
            }
        });
        
        db.get("SELECT COUNT(*) as count FROM faq", (err, row) => {
            if (err) {
                console.error('❌ Error verificando faq:', err.message);
            } else {
                console.log(`✅ Tabla faq: ${row.count} registros`);
            }
        });
        
        db.get("SELECT COUNT(*) as count FROM soporte_temas", (err, row) => {
            if (err) {
                console.error('❌ Error verificando soporte_temas:', err.message);
            } else {
                console.log(`✅ Tabla soporte_temas: ${row.count} registros`);
            }
        });
        
        // Cerrar conexión
        setTimeout(() => {
            db.close((err) => {
                if (err) {
                    console.error('❌ Error cerrando base de datos:', err.message);
                } else {
                    console.log('\n🎉 Migración completada exitosamente!');
                    console.log('\n📋 Resumen de la migración:');
                    console.log('   ✅ Tabla ofertas creada');
                    console.log('   ✅ Tabla faq creada');
                    console.log('   ✅ Tabla soporte_temas creada');
                    console.log('   ✅ Índices optimizados creados');
                    console.log('   ✅ Datos de ejemplo insertados');
                    console.log('\n🚀 El chatbot dinámico está listo!');
                }
            });
        }, 1000);
    }, 2000);
});

// Manejar errores no capturados
process.on('uncaughtException', (err) => {
    console.error('❌ Error no capturado:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
    process.exit(1);
});























