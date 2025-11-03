# 📁 Nueva Estructura de Carpetas - Cresalia

## Estructura Recomendada por Tenant

```
Cresalia-Web/
├── 📁 core/                          # Código base de Cresalia (NO tocar)
│   ├── 📄 auth-system-cresalia.js
│   ├── 📄 i18n-cresalia.js
│   ├── 📄 chatbot-ia-cresalia.js
│   ├── 📄 historia-empresa.js
│   └── 📁 css/
│       ├── cresalia-theme.css        # Tema base morado/lavanda
│       ├── animations.css
│       └── components.css
│
├── 📁 tenants/                       # Carpeta de tenants (clientes)
│   ├── 📁 demo-store/               # Tienda demo
│   │   ├── 📄 index.html            # Página principal
│   │   ├── 📄 config.json           # Configuración específica
│   │   ├── 📄 custom.css            # Estilos personalizados
│   │   ├── 📄 custom.js             # Scripts personalizados
│   │   └── 📁 assets/
│   │       ├── logo.png
│   │       └── productos/
│   │
│   ├── 📁 tienda-zapatos/           # Cliente: Tienda de Zapatos
│   │   ├── 📄 index.html
│   │   ├── 📄 config.json
│   │   ├── 📄 custom.css
│   │   └── 📁 assets/
│   │
│   └── 📁 tech-store/               # Cliente: Tech Store
│       ├── 📄 index.html
│       ├── 📄 config.json
│       └── 📁 assets/
│
├── 📁 admin/                         # Panel de administración
│   ├── 📄 index.html                # Login admin
│   ├── 📄 dashboard.html            # Dashboard principal
│   ├── 📄 productos.html
│   ├── 📄 ordenes.html
│   ├── 📄 configuracion.html
│   └── 📁 css/
│       └── admin-theme.css
│
├── 📁 super-admin/                   # Tu panel maestro
│   ├── 📄 index.html                # Login super admin
│   ├── 📄 dashboard.html
│   ├── 📄 tenants.html              # Gestión de tenants
│   ├── 📄 facturacion.html
│   └── 📁 css/
│       └── super-admin-theme.css
│
├── 📁 backend/                       # API y base de datos
│   ├── 📄 server-multitenancy.js
│   ├── 📄 cresalia.db
│   └── 📄 package.json
│
├── 📁 assets/                        # Assets globales
│   └── 📁 cresalia/
│       ├── logo.png
│       └── branding/
│
├── 📄 index.html                     # Landing page de Cresalia
└── 📄 README.md

```

---

## Ventajas de esta Estructura

### ✅ 1. Organización Clara
```
tenants/tienda-zapatos/     ← Todo del cliente A
tenants/tech-store/         ← Todo del cliente B
```

### ✅ 2. Fácil Debugging
```bash
# Problema con "tienda-zapatos"?
cd tenants/tienda-zapatos
# Todo su código está aquí
```

### ✅ 3. Actualizaciones Seguras
```
core/          ← Actualizas aquí (afecta a todos)
tenants/X/     ← Modificas aquí (solo afecta a cliente X)
```

### ✅ 4. Backups por Cliente
```bash
# Backup de un solo cliente
tar -czf tienda-zapatos-backup.tar.gz tenants/tienda-zapatos/
```

### ✅ 5. Deploy Independiente
```
Producción:
├── cresalia.com/demo-store    → tenants/demo-store/
├── cresalia.com/zapatos       → tenants/tienda-zapatos/
└── cresalia.com/tech          → tenants/tech-store/
```

---

## Config.json por Tenant

Cada tenant tiene su `config.json`:

```json
{
  "tenant": {
    "slug": "tienda-zapatos",
    "nombre": "Zapatos Elegantes",
    "plan": "pro"
  },
  "branding": {
    "logo": "assets/logo.png",
    "favicon": "assets/favicon.ico",
    "colores": {
      "primario": "#7C3AED",
      "secundario": "#A78BFA",
      "acento": "#C4B5FD"
    }
  },
  "features": {
    "multiidioma": true,
    "chatbot": true,
    "historia": true
  },
  "api": {
    "endpoint": "http://localhost:3001/api/tienda-zapatos"
  }
}
```

---

## Rutas URL Limpias

```
Landing:
https://cresalia.com/                 → index.html

Tiendas:
https://cresalia.com/demo-store       → tenants/demo-store/index.html
https://cresalia.com/tienda-zapatos   → tenants/tienda-zapatos/index.html
https://cresalia.com/tech-store       → tenants/tech-store/index.html

Admin (por tenant):
https://cresalia.com/tienda-zapatos/admin  → admin/index.html?tenant=tienda-zapatos

Super Admin (solo tú):
https://cresalia.com/super-admin      → super-admin/index.html
```

---

## Script de Creación Automática

Cuando un cliente nuevo se registra:

```javascript
// create-tenant.js
async function crearNuevoTenant(slug, nombre, plan) {
    // 1. Crear en BD
    await crearTenantBD(slug, nombre, plan);
    
    // 2. Crear carpeta
    const tenantPath = `tenants/${slug}/`;
    fs.mkdirSync(tenantPath, { recursive: true });
    
    // 3. Copiar template
    fs.copyFileSync('templates/index.html', `${tenantPath}/index.html`);
    fs.copyFileSync('templates/config.json', `${tenantPath}/config.json`);
    
    // 4. Personalizar config
    const config = require(`${tenantPath}/config.json`);
    config.tenant.slug = slug;
    config.tenant.nombre = nombre;
    config.tenant.plan = plan;
    fs.writeFileSync(`${tenantPath}/config.json`, JSON.stringify(config, null, 2));
    
    // 5. Crear carpeta de assets
    fs.mkdirSync(`${tenantPath}/assets/`, { recursive: true });
    
    console.log(`✅ Tenant ${slug} creado exitosamente`);
}
```

---

## Migración Actual → Nueva Estructura

```bash
# Script de migración
mkdir -p tenants/demo-store
mv index-cresalia.html tenants/demo-store/index.html
mv assets tenants/demo-store/assets

mkdir -p admin
mv admin-cresalia.html admin/index.html
mv admin-cresalia.js admin/admin.js

mkdir -p core
mv i18n-cresalia.js core/
mv chatbot-ia-cresalia.js core/
mv historia-empresa.js core/
mv auth-system-cresalia.js core/

mkdir -p core/css
mv css/* core/css/
```

---

## .gitignore Actualizado

```gitignore
# Node modules
backend/node_modules/
backend/cresalia.db

# Datos de clientes (sensible)
tenants/*/config.json
tenants/*/assets/productos/*

# Archivos temporales
*.log
*.tmp
.DS_Store
desktop.ini

# Backups
*.backup
backups/
```



