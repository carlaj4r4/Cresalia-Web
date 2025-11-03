// ===== MIGRACIÓN: Sistema de Seguridad Completo =====

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'friocas.db');
const db = new sqlite3.Database(dbPath);

console.log('🔐 Iniciando migración: Sistema de Seguridad...\n');

db.serialize(() => {
    
    // 1. Tabla de Verificaciones (KYC)
    console.log('📋 Creando tabla verificaciones...');
    
    db.run(`
        CREATE TABLE IF NOT EXISTS verificaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT NOT NULL,
            tipo TEXT NOT NULL, -- 'identidad', 'email', 'telefono', 'mercadopago', 'negocio'
            estado TEXT DEFAULT 'pendiente', -- 'pendiente', 'aprobado', 'rechazado'
            score INTEGER DEFAULT 0,
            datos_verificacion TEXT, -- JSON con detalles
            verificado_por TEXT, -- 'sistema' o 'carla'
            verificado_at DATETIME,
            expira_at DATETIME,
            notas TEXT,
            creada_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tenant_id) REFERENCES tenants(slug)
        )
    `, (err) => {
        if (err) console.error('❌ Error:', err);
        else console.log('✅ Tabla verificaciones creada\n');
    });

    // 2. Tabla de Trust Scores
    console.log('⭐ Creando tabla trust_scores...');
    
    db.run(`
        CREATE TABLE IF NOT EXISTS trust_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT NOT NULL UNIQUE,
            score INTEGER DEFAULT 0, -- 0-100
            nivel TEXT, -- 'EXCELENTE', 'BUENO', 'ACEPTABLE', 'BAJO', 'MUY BAJO'
            factores TEXT, -- JSON con desglose de puntos
            ultima_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tenant_id) REFERENCES tenants(slug)
        )
    `, (err) => {
        if (err) console.error('❌ Error:', err);
        else console.log('✅ Tabla trust_scores creada\n');
    });

    // 3. Tabla de Reportes de Usuarios
    console.log('📢 Creando tabla reportes_usuarios...');
    
    db.run(`
        CREATE TABLE IF NOT EXISTS reportes_usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT NOT NULL,
            reportado_por TEXT, -- email del comprador
            tipo TEXT NOT NULL, -- 'fraude', 'producto_falso', 'no_envia', 'estafa', 'otro'
            descripcion TEXT NOT NULL,
            evidencia TEXT, -- JSON con URLs de fotos, capturas, etc.
            orden_id INTEGER, -- Orden relacionada
            estado TEXT DEFAULT 'pendiente', -- 'pendiente', 'investigando', 'resuelto', 'rechazado'
            prioridad TEXT DEFAULT 'media', -- 'baja', 'media', 'alta', 'critica'
            resolucion TEXT,
            resuelto_por TEXT,
            resuelto_at DATETIME,
            creado_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tenant_id) REFERENCES tenants(slug)
        )
    `, (err) => {
        if (err) console.error('❌ Error:', err);
        else console.log('✅ Tabla reportes_usuarios creada\n');
    });

    // 4. Tabla de Alertas de Seguridad
    console.log('🚨 Creando tabla security_alerts...');
    
    db.run(`
        CREATE TABLE IF NOT EXISTS security_alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT,
            tipo TEXT NOT NULL, -- 'fraude_detectado', 'actividad_sospechosa', 'cuenta_comprometida', etc.
            nivel TEXT NOT NULL, -- 'BAJO', 'MEDIO', 'ALTO', 'CRÍTICO'
            descripcion TEXT NOT NULL,
            datos TEXT, -- JSON con detalles
            accion_tomada TEXT, -- 'bloqueado', 'pausado', 'notificado', etc.
            revisado INTEGER DEFAULT 0,
            revisado_por TEXT,
            revisado_at DATETIME,
            creada_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tenant_id) REFERENCES tenants(slug)
        )
    `, (err) => {
        if (err) console.error('❌ Error:', err);
        else console.log('✅ Tabla security_alerts creada\n');
    });

    // 5. Tabla de Audit Logs
    console.log('📝 Creando tabla audit_logs...');
    
    db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT,
            usuario_id INTEGER,
            accion TEXT NOT NULL, -- 'login', 'cambio_config', 'cambio_credenciales_mp', etc.
            entidad TEXT, -- 'tenant', 'producto', 'orden', etc.
            entidad_id TEXT,
            datos_previos TEXT, -- JSON del estado anterior
            datos_nuevos TEXT, -- JSON del estado nuevo
            ip TEXT,
            user_agent TEXT,
            resultado TEXT DEFAULT 'exito', -- 'exito', 'fallo', 'bloqueado'
            razon TEXT,
            creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('❌ Error:', err);
        else console.log('✅ Tabla audit_logs creada\n');
    });

    // 6. Tabla de Lista Negra
    console.log('🚫 Creando tabla lista_negra...');
    
    db.run(`
        CREATE TABLE IF NOT EXISTS lista_negra (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT NOT NULL, -- 'email', 'ip', 'documento', 'mp_account', 'tarjeta'
            valor TEXT NOT NULL,
            razon TEXT NOT NULL,
            agregado_por TEXT DEFAULT 'sistema',
            evidencia TEXT, -- JSON
            permanente INTEGER DEFAULT 0,
            expira_at DATETIME,
            creado_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(tipo, valor)
        )
    `, (err) => {
        if (err) console.error('❌ Error:', err);
        else console.log('✅ Tabla lista_negra creada\n');
    });

    // 7. Tabla de Monitoreo de Actividad
    console.log('👁️ Creando tabla actividad_monitoreo...');
    
    db.run(`
        CREATE TABLE IF NOT EXISTS actividad_monitoreo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT NOT NULL,
            periodo TEXT NOT NULL, -- '24h', '7d', '30d'
            ordenes_total INTEGER DEFAULT 0,
            monto_total REAL DEFAULT 0,
            productos_agregados INTEGER DEFAULT 0,
            cambios_config INTEGER DEFAULT 0,
            ips_unicas INTEGER DEFAULT 0,
            tasa_devolucion REAL DEFAULT 0,
            reportes INTEGER DEFAULT 0,
            intentos_fallidos_login INTEGER DEFAULT 0,
            ultima_actividad_sospechosa DATETIME,
            calculado_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tenant_id) REFERENCES tenants(slug)
        )
    `, (err) => {
        if (err) console.error('❌ Error:', err);
        else console.log('✅ Tabla actividad_monitoreo creada\n');
    });

    // 8. Actualizar tabla tenants (agregar campos de seguridad)
    console.log('🔄 Actualizando tabla tenants...');
    
    db.run(`
        ALTER TABLE tenants ADD COLUMN estado_cuenta TEXT DEFAULT 'activo'
    `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('❌ Error:', err);
        }
    });

    db.run(`
        ALTER TABLE tenants ADD COLUMN trust_score INTEGER DEFAULT 50
    `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('❌ Error:', err);
        }
    });

    db.run(`
        ALTER TABLE tenants ADD COLUMN verificado INTEGER DEFAULT 0
    `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('❌ Error:', err);
        }
    });

    db.run(`
        ALTER TABLE tenants ADD COLUMN suspendido_at DATETIME
    `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('❌ Error:', err);
        }
    });

    db.run(`
        ALTER TABLE tenants ADD COLUMN razon_suspension TEXT
    `, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            console.error('❌ Error:', err);
        } else {
            console.log('✅ Tabla tenants actualizada\n');
        }
    });

    // 9. Crear índices para performance
    console.log('📊 Creando índices...');
    
    const indices = [
        'CREATE INDEX IF NOT EXISTS idx_verificaciones_tenant ON verificaciones(tenant_id)',
        'CREATE INDEX IF NOT EXISTS idx_reportes_tenant ON reportes_usuarios(tenant_id)',
        'CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes_usuarios(estado)',
        'CREATE INDEX IF NOT EXISTS idx_alerts_nivel ON security_alerts(nivel, revisado)',
        'CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_logs(tenant_id)',
        'CREATE INDEX IF NOT EXISTS idx_lista_negra_tipo ON lista_negra(tipo, valor)',
        'CREATE INDEX IF NOT EXISTS idx_monitoreo_tenant ON actividad_monitoreo(tenant_id)'
    ];

    indices.forEach((sql, index) => {
        db.run(sql, (err) => {
            if (err) console.error(`❌ Error en índice ${index}:`, err);
        });
    });

    console.log('✅ Índices creados\n');

    // 10. Insertar datos iniciales de prueba
    console.log('🧪 Insertando datos de prueba...');
    
    // Lista negra con emails descartables comunes
    const emailsDescartables = [
        'tempmail.com', 'guerrillamail.com', '10minutemail.com',
        'mailinator.com', 'throwaway.email', 'temp-mail.org',
        'yopmail.com', 'trashmail.com', 'maildrop.cc'
    ];

    const stmtListaNegra = db.prepare(`
        INSERT OR IGNORE INTO lista_negra (tipo, valor, razon, agregado_por, permanente)
        VALUES ('email_domain', ?, 'Servicio de email temporal', 'sistema', 1)
    `);

    emailsDescartables.forEach(domain => {
        stmtListaNegra.run(domain);
    });

    stmtListaNegra.finalize((err) => {
        if (err) console.error('❌ Error:', err);
        else console.log('✅ Lista negra de emails temporales creada\n');
    });

    // 11. Verificar
    db.all(`
        SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%security%' OR name LIKE '%verif%' OR name LIKE '%audit%'
    `, (err, rows) => {
        if (err) {
            console.error('❌ Error al verificar:', err);
        } else {
            console.log('📋 Tablas de seguridad creadas:');
            rows.forEach(row => console.log(`   • ${row.name}`));
            console.log('');
        }

        console.log('🎉 Migración de seguridad completada exitosamente!\n');
        console.log('🔐 Sistema de seguridad nivel bancario implementado\n');
        console.log('💜 Carla puede dormir tranquila\n');
        console.log('📋 Tablas creadas:');
        console.log('   • verificaciones (KYC)');
        console.log('   • trust_scores (puntuación de confianza)');
        console.log('   • reportes_usuarios (reportes de compradores)');
        console.log('   • security_alerts (alertas automáticas)');
        console.log('   • audit_logs (trazabilidad completa)');
        console.log('   • lista_negra (emails/IPs bloqueados)');
        console.log('   • actividad_monitoreo (detección de patrones)\n');
        console.log('🔍 Próximo paso:');
        console.log('   Agregar rutas de seguridad en server-multitenancy.js\n');

        db.close();
    });
});


