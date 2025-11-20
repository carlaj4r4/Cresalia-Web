#!/usr/bin/env node

/**
 * Escáner sencillo para detectar posibles credenciales expuestas en el repositorio.
 * No reemplaza a herramientas profesionales (trufflehog, git-secrets), pero ayuda a detectar patrones comunes.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const EXCLUDE_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.vercel', '.turbo']);

const PATTERNS = [
    { name: 'JWT o API key Base64', regex: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}/g },
    { name: 'Claves tipo sk_live (Stripe/Brevo)', regex: /(sk_live|xkeysib)[A-Za-z0-9_-]{10,}/gi },
    { name: 'Mapbox Token', regex: /pk\.[A-Za-z0-9._-]{60,}/g },
    { name: 'AWS Secret Access Key', regex: /(?<![A-Z0-9])[A-Z0-9]{40}(?![A-Z0-9])/g },
    { name: 'JSON Web Token', regex: /eyJ[A-Za-z0-9/+_-]{20,}\.[A-Za-z0-9/+_-]{20,}\.[A-Za-z0-9/+_-]{20,}/g },
    { name: 'Passwords hardcodeadas', regex: /(password|contraseña|pass|secret|token)\s*[:=]\s*['"][^'"]{6,}['"]/gi },
    { name: 'MercadoPago', regex: /(TEST|LIVE)-[0-9a-fA-F-]{30,}/g }
];

let findings = [];

function scanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        PATTERNS.forEach(pattern => {
            const matches = content.match(pattern.regex);
            if (matches) {
                findings.push({
                    file: filePath.replace(ROOT_DIR + path.sep, ''),
                    pattern: pattern.name,
                    samples: [...new Set(matches)].slice(0, 3)
                });
            }
        });
    } catch (error) {
        console.warn(`⚠️ No se pudo analizar ${filePath}: ${error.message}`);
    }
}

function walkDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (EXCLUDE_DIRS.has(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDirectory(fullPath);
        } else if (entry.isFile()) {
            scanFile(fullPath);
        }
    }
}

console.log('🔍 Escaneando posibles credenciales expuestas...');
walkDirectory(ROOT_DIR);

if (findings.length === 0) {
    console.log('✅ No se detectaron patrones sospechosos con las reglas básicas.');
    console.log('   Recomendación: ejecutar herramientas adicionales como trufflehog/git-secrets para una cobertura mayor.\n');
} else {
    console.log(`⚠️ Se detectaron ${findings.length} coincidencias potenciales. Revísalas y rota las claves si fuera necesario:\n`);
    findings.forEach(finding => {
        console.log(`• Archivo: ${finding.file}`);
        console.log(`  Patrón: ${finding.pattern}`);
        finding.samples.forEach(sample => {
            console.log(`  Ejemplo: ${sample.slice(0, 60)}${sample.length > 60 ? '...' : ''}`);
        });
        console.log('');
    });
    console.log('➡️ Después de limpiar, vuelve a ejecutar el script para confirmar.');
}



