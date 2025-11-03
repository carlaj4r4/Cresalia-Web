// ===== MIGRACIÓN: SISTEMA DE PAGOS DISTRIBUIDO =====
// Cada tienda recibe sus propios pagos, Cresalia solo cobra comisión

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cresalia.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Creando sistema de pagos distribuido...');

// Tabla para configuración de pagos por tienda
db.run(`
    CREATE TABLE IF NOT EXISTS tenant_payment_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        access_token TEXT NOT NULL,
        public_key TEXT NOT NULL,
        configured_at TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla tenant_payment_config:', err);
    } else {
        console.log('✅ Tabla tenant_payment_config creada');
    }
});

// Tabla para preferencias de pago por tienda
db.run(`
    CREATE TABLE IF NOT EXISTS store_payment_preferences (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        amount REAL NOT NULL,
        net_amount REAL NOT NULL,
        commission REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        external_reference TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla store_payment_preferences:', err);
    } else {
        console.log('✅ Tabla store_payment_preferences creada');
    }
});

// Tabla para comisiones de Cresalia
db.run(`
    CREATE TABLE IF NOT EXISTS cresalia_commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        transaction_id TEXT NOT NULL,
        transaction_amount REAL NOT NULL,
        commission_amount REAL NOT NULL,
        commission_rate REAL DEFAULT 0.1,
        created_at TEXT NOT NULL,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla cresalia_commissions:', err);
    } else {
        console.log('✅ Tabla cresalia_commissions creada');
    }
});

// Tabla para transacciones distribuidas
db.run(`
    CREATE TABLE IF NOT EXISTS distributed_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        payment_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        amount REAL NOT NULL,
        net_amount REAL NOT NULL,
        commission REAL NOT NULL,
        status TEXT NOT NULL,
        payment_method TEXT DEFAULT 'mercadopago',
        metadata TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla distributed_transactions:', err);
    } else {
        console.log('✅ Tabla distributed_transactions creada');
    }
});

// Insertar datos de ejemplo para testing
db.run(`
    INSERT OR IGNORE INTO tenant_payment_config 
    (tenant_id, email, access_token, public_key, configured_at, status, created_at) 
    VALUES 
    ('demo_tenant', 'demo@ejemplo.com', 'APP_USR-1234567890123456-123456-123456789012345678901234567890-123456789', 'APP_USR-1234567890123456-123456-123456789012345678901234567890-123456789', datetime('now'), 'active', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando configuración de ejemplo:', err);
    } else {
        console.log('✅ Configuración de ejemplo insertada');
    }
});

db.run(`
    INSERT OR IGNORE INTO store_payment_preferences 
    (id, tenant_id, plan, amount, net_amount, commission, status, external_reference, created_at) 
    VALUES 
    ('pref_demo_dist_1', 'demo_tenant', 'pro', 79.00, 71.10, 7.90, 'approved', 'cresalia_demo_dist_1', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando preferencia de ejemplo:', err);
    } else {
        console.log('✅ Preferencia de ejemplo insertada');
    }
});

db.run(`
    INSERT OR IGNORE INTO cresalia_commissions 
    (tenant_id, transaction_id, transaction_amount, commission_amount, commission_rate, created_at) 
    VALUES 
    ('demo_tenant', 'pref_demo_dist_1', 79.00, 7.90, 0.1, datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando comisión de ejemplo:', err);
    } else {
        console.log('✅ Comisión de ejemplo insertada');
    }
});

// Cerrar conexión
db.close((err) => {
    if (err) {
        console.error('❌ Error cerrando base de datos:', err);
    } else {
        console.log('✅ Sistema de pagos distribuido creado');
        console.log('');
        console.log('🏪 Cómo funciona el sistema distribuido:');
        console.log('   1. Cada tienda configura su propia cuenta de Mercado Pago');
        console.log('   2. Los pagos van directamente a la cuenta de la tienda');
        console.log('   3. Cresalia cobra solo una comisión del 10%');
        console.log('   4. 100% transparente - las tiendas ven todos sus pagos');
        console.log('');
        console.log('📊 Tablas creadas:');
        console.log('   - tenant_payment_config (Configuración por tienda)');
        console.log('   - store_payment_preferences (Preferencias de pago)');
        console.log('   - cresalia_commissions (Comisiones de Cresalia)');
        console.log('   - distributed_transactions (Historial distribuido)');
        console.log('');
        console.log('💡 Beneficios:');
        console.log('   ✅ Transparencia total');
        console.log('   ✅ Confianza de los emprendedores');
        console.log('   ✅ Cada tienda maneja su dinero');
        console.log('   ✅ Cresalia solo cobra comisión justa');
        console.log('');
        console.log('🚀 Sistema listo para usar!');
    }
});























