# 🗄️ Cresalia Backend - Multi-tenant API

Backend Node.js/Express para la plataforma SaaS multi-tenant Cresalia.

## 🚀 Características

- **Multi-tenancy**: Aislamiento completo de datos por tenant
- **REST API**: Endpoints RESTful bien diseñados
- **SQLite**: Base de datos ligera y eficiente
- **Autenticación**: JWT + bcrypt
- **CORS**: Configurado para desarrollo y producción

## 📦 Instalación

```bash
npm install
```

## 🎯 Scripts Disponibles

```bash
# Iniciar servidor multi-tenant (producción)
npm start

# Modo desarrollo con auto-reload
npm run dev

# Iniciar servidor legacy (CRESALIA antiguo)
npm run start:legacy

# Inicializar base de datos multi-tenant
npm run init-multitenancy

# Inicializar base de datos legacy
npm run init-db
```

## 🗃️ Estructura de la Base de Datos

### Tablas Principales

1. **tenants** - Clientes/tiendas
2. **usuarios** - Usuarios por tenant
3. **categorias** - Categorías de productos por tenant
4. **productos** - Productos por tenant
5. **ordenes** - Órdenes de compra por tenant
6. **orden_items** - Items de cada orden
7. **cupones** - Cupones de descuento por tenant
8. **wishlist** - Lista de deseos
9. **reviews** - Reseñas de productos
10. **analytics** - Métricas y estadísticas

### Relaciones

- Todas las tablas tienen `tenant_id` para aislamiento
- Foreign keys con `ON DELETE CASCADE` para limpieza automática
- Índices únicos compuestos: `(tenant_id, slug)`, `(tenant_id, email)`, etc.

## 🔌 API Endpoints

### Públicos (sin autenticación)

```
GET  /api/health              # Health check
GET  /api/tenants             # Listar todos los tenants activos
POST /api/tenants/register    # Registrar nuevo tenant
```

### Por Tenant

```
GET  /api/:tenant/config           # Configuración del tenant
GET  /api/:tenant/productos        # Listar productos
GET  /api/:tenant/productos/:id    # Obtener producto
GET  /api/:tenant/categorias       # Listar categorías
POST /api/:tenant/ordenes          # Crear orden
GET  /api/:tenant/stats            # Estadísticas (admin)
```

## 🔑 Autenticación de Tenant

El sistema identifica el tenant actual mediante:

1. **Header**: `X-Tenant-Slug: mi-tienda`
2. **Path parameter**: `/api/mi-tienda/productos`
3. **Subdomain**: `mi-tienda.cresalia.com` (requiere configuración DNS)

Si no se especifica tenant, usa `demo-store` por defecto.

## 📊 Ejemplo de Uso

### Obtener productos de una tienda

```bash
curl http://localhost:3001/api/demo-store/productos
```

### Crear una nueva orden

```bash
curl -X POST http://localhost:3001/api/demo-store/ordenes \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_nombre": "Juan Pérez",
    "cliente_email": "juan@example.com",
    "cliente_telefono": "+51999999999",
    "productos": [
      {
        "id": 1,
        "nombre": "Producto 1",
        "precio": 25.99,
        "cantidad": 2
      }
    ],
    "direccion_envio": "Av. Principal 123",
    "ciudad": "Lima",
    "metodo_pago": "mercadopago"
  }'
```

### Registrar un nuevo tenant

```bash
curl -X POST http://localhost:3001/api/tenants/register \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "mi-tienda",
    "nombre_empresa": "Mi Tienda S.A.",
    "email_contacto": "admin@mitienda.com",
    "telefono": "+51999999999",
    "password": "mi_password_seguro"
  }'
```

## 🔒 Seguridad

- Passwords hasheados con bcrypt (salt rounds: 10)
- Validación de slug para evitar injection
- Foreign keys con restricciones
- SQL preparado statements
- CORS configurado
- Rate limiting (próximamente)

## 🐛 Debug

El servidor imprime logs útiles:

```
🚀 Servidor Cresalia Multi-tenant iniciando...
📊 Conectando a la base de datos...
✅ Base de datos multi-tenant conectada correctamente
🏪 Tenant identificado: Tienda Demo Cresalia (demo-store)
🎉 Servidor Cresalia Multi-tenant corriendo en puerto 3001
```

## 📈 Próximas Mejoras

- [ ] Autenticación JWT completa
- [ ] Middleware de autorización por roles
- [ ] Paginación mejorada
- [ ] Full-text search en productos
- [ ] Caché con Redis
- [ ] Logs estructurados (Winston)
- [ ] Tests unitarios y de integración
- [ ] Documentación Swagger/OpenAPI
- [ ] Webhooks para eventos
- [ ] Queue system (Bull)

## 🤝 Contribuir

Ver el README principal del proyecto.

## 📝 Licencia

MIT
