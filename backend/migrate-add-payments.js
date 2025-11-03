// ===== MIGRACIÓN: TABLAS DE PAGOS =====
// Crear tablas para manejar pagos con Mercado Pago y Stripe

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cresalia.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Creando tablas de pagos...');

// Tabla para preferencias de Mercado Pago
db.run(`
    CREATE TABLE IF NOT EXISTS payment_preferences (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        external_reference TEXT,
        init_point TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla payment_preferences:', err);
    } else {
        console.log('✅ Tabla payment_preferences creada');
    }
});

// Tabla para intenciones de pago de Stripe
db.run(`
    CREATE TABLE IF NOT EXISTS payment_intents (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'usd',
        status TEXT DEFAULT 'pending',
        client_secret TEXT,
        metadata TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla payment_intents:', err);
    } else {
        console.log('✅ Tabla payment_intents creada');
    }
});

// Tabla para transacciones (historial de pagos)
db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        provider TEXT NOT NULL, -- 'mercadopago' o 'stripe'
        payment_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'usd',
        status TEXT NOT NULL,
        transaction_type TEXT DEFAULT 'subscription', -- 'subscription', 'renewal', 'upgrade'
        metadata TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla transactions:', err);
    } else {
        console.log('✅ Tabla transactions creada');
    }
});

// Tabla para métodos de pago guardados
db.run(`
    CREATE TABLE IF NOT EXISTS payment_methods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        provider TEXT NOT NULL, -- 'mercadopago' o 'stripe'
        method_id TEXT NOT NULL,
        type TEXT NOT NULL, -- 'card', 'bank_transfer', 'cash'
        last_four TEXT,
        brand TEXT,
        expiry_month INTEGER,
        expiry_year INTEGER,
        is_default BOOLEAN DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla payment_methods:', err);
    } else {
        console.log('✅ Tabla payment_methods creada');
    }
});

// Agregar columnas de pago a la tabla tenants si no existen
db.run(`
    ALTER TABLE tenants ADD COLUMN payment_method_id TEXT
`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
        console.error('❌ Error agregando columna payment_method_id:', err);
    } else {
        console.log('✅ Columna payment_method_id agregada');
    }
});

db.run(`
    ALTER TABLE tenants ADD COLUMN payment_status TEXT DEFAULT 'none'
`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
        console.error('❌ Error agregando columna payment_status:', err);
    } else {
        console.log('✅ Columna payment_status agregada');
    }
});

db.run(`
    ALTER TABLE tenants ADD COLUMN last_payment TEXT
`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
        console.error('❌ Error agregando columna last_payment:', err);
    } else {
        console.log('✅ Columna last_payment agregada');
    }
});

db.run(`
    ALTER TABLE tenants ADD COLUMN transaction_id TEXT
`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
        console.error('❌ Error agregando columna transaction_id:', err);
    } else {
        console.log('✅ Columna transaction_id agregada');
    }
});

// Insertar datos de ejemplo para testing
db.run(`
    INSERT OR IGNORE INTO payment_preferences 
    (id, tenant_id, plan, amount, status, external_reference, created_at) 
    VALUES 
    ('pref_demo_1', 'demo_tenant', 'pro', 79.00, 'approved', 'cresalia_demo_1', datetime('now')),
    ('pref_demo_2', 'demo_tenant', 'basico', 29.00, 'pending', 'cresalia_demo_2', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando datos de ejemplo:', err);
    } else {
        console.log('✅ Datos de ejemplo insertados');
    }
});

db.run(`
    INSERT OR IGNORE INTO transactions 
    (tenant_id, provider, payment_id, plan, amount, status, transaction_type, created_at) 
    VALUES 
    ('demo_tenant', 'mercadopago', 'pref_demo_1', 'pro', 79.00, 'approved', 'subscription', datetime('now')),
    ('demo_tenant', 'stripe', 'pi_demo_1', 'basico', 29.00, 'pending', 'renewal', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando transacciones de ejemplo:', err);
    } else {
        console.log('✅ Transacciones de ejemplo insertadas');
    }
});

// Cerrar conexión
db.close((err) => {
    if (err) {
        console.error('❌ Error cerrando base de datos:', err);
    } else {
        console.log('✅ Migración de pagos completada');
        console.log('');
        console.log('📋 Tablas creadas:');
        console.log('   - payment_preferences (Mercado Pago)');
        console.log('   - payment_intents (Stripe)');
        console.log('   - transactions (Historial)');
        console.log('   - payment_methods (Métodos guardados)');
        console.log('');
        console.log('🔧 Columnas agregadas a tenants:');
        console.log('   - payment_method_id');
        console.log('   - payment_status');
        console.log('   - last_payment');
        console.log('   - transaction_id');
        console.log('');
        console.log('💳 Sistema de pagos listo para usar!');
    }
});























