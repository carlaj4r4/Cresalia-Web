// ===== MIGRACIÓN: SISTEMA DE RESPALDO EMOCIONAL Y SOPORTE TÉCNICO =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: 2025

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta de la base de datos
const dbPath = path.join(__dirname, 'cresalia.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Iniciando migración: Sistema de Respaldo Emocional y Soporte Técnico...');

// Crear tabla de mensajes de apoyo emocional
const createApoyoMensajesTable = `
CREATE TABLE IF NOT EXISTS apoyo_mensajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tenant_id TEXT NOT NULL,
    emocion TEXT NOT NULL CHECK (emocion IN ('excelente', 'bien', 'regular', 'dificil', 'abrumado')),
    mensaje TEXT NOT NULL,
    urgencia TEXT NOT NULL CHECK (urgencia IN ('critica', 'alta', 'media', 'baja')),
    anonimo BOOLEAN DEFAULT 0,
    permitir_contacto BOOLEAN DEFAULT 0,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'respondido', 'cerrado')),
    respuesta TEXT,
    respondido_por TEXT,
    respondido_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(slug)
);
`;

// Crear tabla de tickets de soporte técnico
const createSoporteTicketsTable = `
CREATE TABLE IF NOT EXISTS soporte_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asunto TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN ('tecnico', 'pagos', 'productos', 'diseno', 'otro')),
    prioridad TEXT NOT NULL CHECK (prioridad IN ('baja', 'media', 'alta')),
    mensaje TEXT NOT NULL,
    email TEXT NOT NULL,
    estado TEXT DEFAULT 'abierto' CHECK (estado IN ('abierto', 'en_proceso', 'resuelto', 'cerrado')),
    respuesta TEXT,
    respondido_por TEXT,
    respondido_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Crear índices para optimizar consultas
const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_apoyo_tenant ON apoyo_mensajes(tenant_id);',
    'CREATE INDEX IF NOT EXISTS idx_apoyo_urgencia ON apoyo_mensajes(urgencia);',
    'CREATE INDEX IF NOT EXISTS idx_apoyo_estado ON apoyo_mensajes(estado);',
    'CREATE INDEX IF NOT EXISTS idx_apoyo_created ON apoyo_mensajes(created_at);',
    'CREATE INDEX IF NOT EXISTS idx_soporte_estado ON soporte_tickets(estado);',
    'CREATE INDEX IF NOT EXISTS idx_soporte_prioridad ON soporte_tickets(prioridad);',
    'CREATE INDEX IF NOT EXISTS idx_soporte_created ON soporte_tickets(created_at);'
];

// Ejecutar migración
db.serialize(() => {
    console.log('📊 Creando tabla apoyo_mensajes...');
    db.run(createApoyoMensajesTable, (err) => {
        if (err) {
            console.error('❌ Error creando tabla apoyo_mensajes:', err.message);
        } else {
            console.log('✅ Tabla apoyo_mensajes creada exitosamente');
        }
    });

    console.log('📊 Creando tabla soporte_tickets...');
    db.run(createSoporteTicketsTable, (err) => {
        if (err) {
            console.error('❌ Error creando tabla soporte_tickets:', err.message);
        } else {
            console.log('✅ Tabla soporte_tickets creada exitosamente');
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
    
    // Mensaje de ejemplo de apoyo emocional
    const ejemploApoyo = db.prepare(`
        INSERT INTO apoyo_mensajes (
            tenant_id, emocion, mensaje, urgencia, anonimo, permitir_contacto, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    ejemploApoyo.run([
        'ejemplo-tienda',
        'abrumado',
        'Llevo 2 meses sin ventas. Invertí todos mis ahorros y no sé si seguir. Tengo miedo de fracasar...',
        'alta',
        1, // anónimo
        1, // permitir contacto
        'pendiente'
    ], function(err) {
        if (err) {
            console.error('❌ Error insertando ejemplo de apoyo:', err.message);
        } else {
            console.log('✅ Ejemplo de mensaje de apoyo insertado (ID:', this.lastID, ')');
        }
    });
    
    ejemploApoyo.finalize();

    // Ticket de ejemplo de soporte técnico
    const ejemploSoporte = db.prepare(`
        INSERT INTO soporte_tickets (
            asunto, categoria, prioridad, mensaje, email, estado
        ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    ejemploSoporte.run([
        'No puedo agregar productos a mi tienda',
        'tecnico',
        'media',
        'Cuando intento agregar un producto nuevo, la página se queda cargando y no se guarda. ¿Qué puedo hacer?',
        'ejemplo@tienda.com',
        'abierto'
    ], function(err) {
        if (err) {
            console.error('❌ Error insertando ejemplo de soporte:', err.message);
        } else {
            console.log('✅ Ejemplo de ticket de soporte insertado (ID:', this.lastID, ')');
        }
    });
    
    ejemploSoporte.finalize();

    // Verificar que las tablas se crearon correctamente
    setTimeout(() => {
        console.log('\n🔍 Verificando migración...');
        
        db.get("SELECT COUNT(*) as count FROM apoyo_mensajes", (err, row) => {
            if (err) {
                console.error('❌ Error verificando apoyo_mensajes:', err.message);
            } else {
                console.log(`✅ Tabla apoyo_mensajes: ${row.count} registros`);
            }
        });
        
        db.get("SELECT COUNT(*) as count FROM soporte_tickets", (err, row) => {
            if (err) {
                console.error('❌ Error verificando soporte_tickets:', err.message);
            } else {
                console.log(`✅ Tabla soporte_tickets: ${row.count} registros`);
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
                    console.log('   ✅ Tabla apoyo_mensajes creada');
                    console.log('   ✅ Tabla soporte_tickets creada');
                    console.log('   ✅ Índices optimizados creados');
                    console.log('   ✅ Datos de ejemplo insertados');
                    console.log('\n🚀 El sistema de respaldo emocional y soporte técnico está listo!');
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