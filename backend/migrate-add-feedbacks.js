const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar a la base de datos
const dbPath = path.join(__dirname, 'friocas.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Iniciando migración: Sistema de Feedbacks para Tiendas...');

// Crear tabla de feedbacks
db.serialize(() => {
    // Tabla de feedbacks de tiendas
    db.run(`
        CREATE TABLE IF NOT EXISTS tienda_feedbacks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tienda_id VARCHAR(100) NOT NULL,
            usuario_nombre VARCHAR(255) NOT NULL,
            usuario_email VARCHAR(255),
            calificacion INTEGER NOT NULL CHECK(calificacion >= 1 AND calificacion <= 5),
            comentario TEXT,
            fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            aprobado BOOLEAN DEFAULT 0,
            respuesta_tienda TEXT,
            fecha_respuesta DATETIME,
            util_count INTEGER DEFAULT 0,
            verificado BOOLEAN DEFAULT 0
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error creando tabla tienda_feedbacks:', err.message);
        } else {
            console.log('✅ Tabla tienda_feedbacks creada correctamente');
        }
    });

    // Índices para mejorar rendimiento
    db.run(`CREATE INDEX IF NOT EXISTS idx_tienda_feedbacks_tienda ON tienda_feedbacks(tienda_id)`, (err) => {
        if (err) {
            console.error('❌ Error creando índice idx_tienda_feedbacks_tienda:', err.message);
        } else {
            console.log('✅ Índice idx_tienda_feedbacks_tienda creado');
        }
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_tienda_feedbacks_fecha ON tienda_feedbacks(fecha_creacion DESC)`, (err) => {
        if (err) {
            console.error('❌ Error creando índice idx_tienda_feedbacks_fecha:', err.message);
        } else {
            console.log('✅ Índice idx_tienda_feedbacks_fecha creado');
        }
    });

    // Tabla de estadísticas de feedbacks por tienda
    db.run(`
        CREATE TABLE IF NOT EXISTS tienda_feedback_stats (
            tienda_id VARCHAR(100) PRIMARY KEY,
            total_feedbacks INTEGER DEFAULT 0,
            promedio_calificacion REAL DEFAULT 0,
            total_5_estrellas INTEGER DEFAULT 0,
            total_4_estrellas INTEGER DEFAULT 0,
            total_3_estrellas INTEGER DEFAULT 0,
            total_2_estrellas INTEGER DEFAULT 0,
            total_1_estrella INTEGER DEFAULT 0,
            ultima_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error creando tabla tienda_feedback_stats:', err.message);
        } else {
            console.log('✅ Tabla tienda_feedback_stats creada correctamente');
        }
    });

    // Insertar datos de ejemplo
    db.run(`
        INSERT OR IGNORE INTO tienda_feedback_stats (tienda_id, total_feedbacks, promedio_calificacion) 
        VALUES ('ejemplo-tienda', 0, 0)
    `, (err) => {
        if (err) {
            console.error('❌ Error insertando stats iniciales:', err.message);
        } else {
            console.log('✅ Stats iniciales para ejemplo-tienda creados');
        }
    });

    console.log('\n✨ Migración completada exitosamente!');
    console.log('📊 Sistema de feedbacks listo para usar\n');
});

// Cerrar conexión
db.close();















