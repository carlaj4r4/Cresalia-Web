const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cresalia.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Migrando base de datos: Agregando multi-idioma y chatbot IA...');

db.serialize(() => {
    // Agregar campos de idioma y traducciones a tenants
    db.run(`ALTER TABLE tenants ADD COLUMN idiomas_disponibles TEXT DEFAULT '["es"]'`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando idiomas_disponibles:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN idioma_principal TEXT DEFAULT 'es'`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando idioma_principal:', err.message);
        }
    });

    // Agregar sección "Nuestra Historia"
    db.run(`ALTER TABLE tenants ADD COLUMN historia_empresa TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando historia_empresa:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN mision TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando mision:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN vision TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando vision:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN valores TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando valores:', err.message);
        }
    });

    // Agregar configuración de chatbot IA (solo para Pro+)
    db.run(`ALTER TABLE tenants ADD COLUMN chatbot_enabled BOOLEAN DEFAULT 0`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando chatbot_enabled:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN chatbot_nombre TEXT DEFAULT 'Asistente Virtual'`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando chatbot_nombre:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN chatbot_mensaje_bienvenida TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando chatbot_mensaje_bienvenida:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN chatbot_tono TEXT DEFAULT 'amigable'`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando chatbot_tono:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN chatbot_avatar_url TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando chatbot_avatar_url:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN chatbot_color TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando chatbot_color:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN chatbot_conocimiento_base TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando chatbot_conocimiento_base:', err.message);
        }
    });

    // Agregar más configuraciones de diseño
    db.run(`ALTER TABLE tenants ADD COLUMN color_texto TEXT DEFAULT '#333333'`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando color_texto:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN color_fondo TEXT DEFAULT '#ffffff'`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando color_fondo:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN estilo_botones TEXT DEFAULT 'rounded'`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando estilo_botones:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN banner_principal_url TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando banner_principal_url:', err.message);
        }
    });

    db.run(`ALTER TABLE tenants ADD COLUMN video_presentacion_url TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('Error agregando video_presentacion_url:', err.message);
        }
    });

    // Tabla de traducciones para contenido multi-idioma
    db.run(`CREATE TABLE IF NOT EXISTS traducciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        idioma TEXT NOT NULL,
        clave TEXT NOT NULL,
        valor TEXT NOT NULL,
        contexto TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
        UNIQUE(tenant_id, idioma, clave)
    )`, (err) => {
        if (err) {
            console.error('Error creando tabla traducciones:', err.message);
        } else {
            console.log('✅ Tabla traducciones creada');
        }
    });

    // Tabla de conversaciones del chatbot (para aprendizaje y mejora)
    db.run(`CREATE TABLE IF NOT EXISTS chatbot_conversaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        usuario_mensaje TEXT NOT NULL,
        bot_respuesta TEXT NOT NULL,
        sentimiento TEXT,
        util BOOLEAN,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            console.error('Error creando tabla chatbot_conversaciones:', err.message);
        } else {
            console.log('✅ Tabla chatbot_conversaciones creada');
        }
    });

    console.log('\n✅ Migración completada exitosamente!');
    console.log('\n📝 Nuevas características disponibles:');
    console.log('   • Multi-idioma por tenant');
    console.log('   • Sección "Nuestra Historia"');
    console.log('   • Chatbot IA personalizable (Pro+)');
    console.log('   • Colores y diseño avanzado');
});

db.close((err) => {
    if (err) {
        console.error('Error al cerrar DB:', err.message);
    } else {
        console.log('🔒 Migración finalizada');
    }
});


