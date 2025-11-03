# 🚀 Backend FRIOCAS - Guía de Configuración

## 📋 Resumen

El backend de FRIOCAS es un sistema completo que maneja:
- ✅ **Persistencia de carritos** en base de datos
- ✅ **Gestión de usuarios** con autenticación
- ✅ **Sincronización** entre dispositivos
- ✅ **Historial de pedidos** completo
- ✅ **Sistema de cupones** y descuentos
- ✅ **Wishlist** (lista de deseos)
- ✅ **Estadísticas** del negocio
- ✅ **Pago en efectivo** optimizado

## 🛠️ Instalación y Configuración

### 1. Requisitos Previos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)
- PowerShell (Windows)

### 2. Instalar Dependencias
```bash
cd backend
npm install
```

### 3. Inicializar Base de Datos
```bash
npm run init-db
```

### 4. Iniciar Servidor
```bash
npm start
```

El servidor se ejecutará en: `http://localhost:3001`

## 📊 Estructura de la Base de Datos

### Tablas Principales:
- **`productos`** - Catálogo de productos
- **`categorias`** - Categorías de productos
- **`usuarios`** - Datos de usuarios registrados
- **`ordenes`** - Pedidos realizados
- **`orden_items`** - Items de cada pedido
- **`carrito`** - Carritos de usuarios
- **`cupones`** - Sistema de descuentos
- **`wishlist`** - Lista de deseos

## 🔌 Endpoints de la API

### Productos
- `GET /api/productos` - Obtener productos
- `GET /api/productos/:id` - Obtener producto específico
- `GET /api/categorias` - Obtener categorías

### Usuarios
- `POST /api/usuarios/registro` - Registrar usuario
- `POST /api/usuarios/login` - Login de usuario
- `GET /api/usuarios/:id` - Obtener perfil

### Carrito
- `GET /api/carrito/:usuario_id` - Obtener carrito
- `POST /api/carrito` - Agregar al carrito
- `PUT /api/carrito/:id` - Actualizar cantidad
- `DELETE /api/carrito/:id` - Remover del carrito

### Órdenes
- `POST /api/ordenes` - Crear orden
- `GET /api/ordenes/usuario/:id` - Historial de pedidos
- `GET /api/ordenes/:id` - Detalle de orden

### Wishlist
- `GET /api/wishlist/:usuario_id` - Obtener wishlist
- `POST /api/wishlist/agregar` - Agregar a wishlist
- `POST /api/wishlist/remover` - Remover de wishlist

### Cupones
- `POST /api/cupones/validar` - Validar cupón

### Estadísticas
- `GET /api/stats` - Estadísticas del sistema

## 🎯 Características Especiales

### 1. Modo Offline
- El frontend funciona sin backend
- Carrito local en localStorage
- Sincronización automática cuando hay conexión

### 2. Notificaciones No Intrusivas
- Notificaciones elegantes y animadas
- Diferentes tipos: success, error, warning, info
- Responsive y accesible

### 3. Pago en Efectivo Optimizado
- Flujo simplificado para efectivo
- Estados de pedido: pendiente → en preparación → listo
- Notificaciones de estado

### 4. Seguridad
- Validación de datos
- Sanitización de inputs
- Manejo de errores robusto

## 🧪 Testing

### Archivo de Prueba
Abre `test-backend-integration.html` en tu navegador para:
- ✅ Verificar conexión con backend
- ✅ Probar todos los endpoints
- ✅ Ver logs en tiempo real
- ✅ Validar funcionalidades

### Comandos de Test
```bash
# Test de conexión
curl http://localhost:3001/api/test

# Obtener productos
curl http://localhost:3001/api/productos

# Obtener estadísticas
curl http://localhost:3001/api/stats
```

## 🔧 Configuración Avanzada

### Variables de Entorno
Crear archivo `.env` en la carpeta `backend`:
```env
PORT=3001
NODE_ENV=development
DB_PATH=./friocas.db
JWT_SECRET=tu_secreto_jwt
```

### Personalización
- **Puerto**: Cambiar en `server.js` línea 8
- **Base de datos**: Cambiar en `server.js` línea 15
- **CORS**: Configurar en `server.js` línea 11

## 📱 Integración con Frontend

### Archivos Agregados:
1. **`api-config.js`** - Configuración y métodos de API
2. **`css/api-notifications.css`** - Estilos de notificaciones
3. **`test-backend-integration.html`** - Página de pruebas

### Uso en el Frontend:
```javascript
// Verificar conexión
await window.friocasAPI.testConnection();

// Obtener productos
const productos = await window.friocasAPI.getProductos();

// Agregar al carrito
await window.friocasAPI.agregarAlCarrito(usuarioId, item);

// Crear orden
await window.friocasAPI.crearOrden(datosOrden);
```

## 🚨 Solución de Problemas

### Error: "Backend no disponible"
1. Verificar que el servidor esté ejecutándose
2. Comprobar puerto 3001
3. Revisar logs del servidor

### Error: "Base de datos no inicializada"
```bash
npm run init-db
```

### Error: "Puerto en uso"
Cambiar puerto en `server.js`:
```javascript
const PORT = process.env.PORT || 3002;
```

### Error: "CORS"
Verificar configuración CORS en `server.js` línea 11.

## 📈 Próximos Pasos

### Mejoras Sugeridas:
1. **Autenticación JWT** completa
2. **Encriptación** de contraseñas con bcrypt
3. **Logs** detallados
4. **Backup** automático de base de datos
5. **Rate limiting** para API
6. **Documentación** con Swagger
7. **Tests** automatizados
8. **Deployment** en producción

### Escalabilidad:
- Migrar a PostgreSQL/MySQL
- Implementar Redis para cache
- Agregar balanceador de carga
- Configurar CDN para imágenes

## 🎉 ¡Listo!

Tu backend de FRIOCAS está configurado y funcionando. Ahora puedes:

1. **Probar la integración** con `test-backend-integration.html`
2. **Usar el carrito persistente** en el frontend
3. **Gestionar usuarios** y pedidos
4. **Monitorear estadísticas** del negocio

¡El sistema está listo para manejar pedidos en efectivo de manera eficiente! 🚀



