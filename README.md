# 🚀 Cresalia - Plataforma E-commerce Multi-tenant SaaS

> **"Empezamos pocos, crecemos mucho"**

Cresalia es una plataforma SaaS de comercio electrónico multi-tenant que permite a múltiples negocios crear y gestionar sus propias tiendas online de forma independiente en una sola infraestructura.

---

## ✨ Características Principales

### 🏪 Multi-tenancy Completo
- **Aislamiento de datos**: Cada tenant (cliente) tiene sus propios productos, órdenes y usuarios
- **Personalización total**: Logo, colores, fuentes y configuración independiente por tenant
- **Subdominios**: Soporte para subdominios personalizados (ej: `mitienda.cresalia.com`)
- **Path-based routing**: Acceso por ruta (ej: `cresalia.com/mitienda`)

### 🌍 Multi-idioma Avanzado
- **6 idiomas soportados**: Español, English, Português, Français, Deutsch, Italiano
- **Selector visual**: Interfaz elegante para cambio de idioma
- **Traducciones por tenant**: Cada tienda puede personalizar sus traducciones
- **Automático**: Detecta idioma del navegador
- **Persistente**: Guarda preferencia del usuario

### 💼 Gestión de Negocios
- Panel de administración completo por tenant
- Dashboard con métricas y análisis en tiempo real
- Gestión de productos, categorías y inventario
- Sistema de órdenes y seguimiento
- Sistema de cupones y descuentos
- Reviews y calificaciones de productos
- **Sección "Nuestra Historia"**: Cuenta tu historia, misión, visión y valores

### 🤖 Chatbot IA Personalizable (Pro+)
- **Chatbot inteligente** exclusivo para planes Pro y Enterprise
- **Personalización completa**: Nombre, avatar, colores y tono
- **Mensaje de bienvenida** configurable
- **Base de conocimiento** personalizada por tienda
- **Respuestas inteligentes** sobre productos, envíos, pagos
- **Conversacional**: Tono amigable, profesional o casual

### 💳 Pagos y Checkout
- Integración con Mercado Pago
- Soporte para pagos en efectivo
- Carrito de compras persistente
- Cálculo automático de envíos
- Sistema de facturación

### 👥 Atención al Cliente
- Sistema exclusivo de soporte (Carla's Support)
- Gestión de mensajes y tickets
- Historial de compras por cliente
- Sistema de usuarios y autenticación

### 📊 Analytics
- Tracking de visitas y conversiones
- Análisis de productos más vendidos
- Métricas de carritos abandonados
- Reportes de ingresos y rentabilidad

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   CRESALIA PLATFORM                 │
│                   Multi-tenant SaaS                 │
└─────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │ Tenant 1│       │ Tenant 2│       │ Tenant N│
   │ (Tienda │       │ (Tienda │       │ (Tienda │
   │  Auto)  │       │  Moda)  │       │  Tech)  │
   └─────────┘       └─────────┘       └─────────┘
        │                  │                  │
        └──────────────────┴──────────────────┘
                           │
                    ┌──────▼──────┐
                    │  SQLite DB   │
                    │ (cresalia.db)│
                    └─────────────┘
```

---

## 📁 Estructura del Proyecto

```
Cresalia-Web/
├── 📄 index.html                      # Página de carga/redirección
├── 📄 index-cresalia.html             # Tienda principal (demo)
├── 📄 admin-cresalia.html             # Panel de administración
├── 📄 atencion-cliente-carla.html     # Sistema de soporte
├── 📄 script-cresalia.js              # Lógica principal
├── 📄 admin-cresalia.js               # Lógica del admin
├── 📄 carla-support.js                # Lógica de soporte
├── 📄 security-system.js              # Sistema de seguridad
├── 📄 facturacion.js                  # Integración pagos
├── 📄 styles-cresalia.css             # Estilos principales
├── 📄 styles-admin-cresalia.css       # Estilos admin
├── 📄 styles-atencion-carla.css       # Estilos soporte
├── 📁 backend/
│   ├── 📄 server-multitenancy.js      # Servidor multi-tenant
│   ├── 📄 server.js                   # Servidor legacy
│   ├── 📄 init-database-multitenancy.js # Inicialización MT
│   ├── 📄 init-database.js            # Inicialización legacy
│   ├── 📄 package.json                # Dependencias
│   └── 📊 cresalia.db                 # Base de datos
├── 📁 assets/
│   ├── 📁 logo/                       # Logos y favicons
│   ├── 📁 productos/                  # Imágenes de productos
│   └── 📁 ofertas/                    # Imágenes promocionales
├── 📁 css/
│   ├── 📄 accessibility.css           # Accesibilidad
│   ├── 📄 api-notifications.css       # Notificaciones
│   ├── 📄 carrito-mejoras.css         # Estilos carrito
│   └── 📄 chatbots-mejorados.css      # Chatbots
└── 📄 README.md                       # Este archivo
```

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 14+ y npm
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/Cresalia-Web.git
cd Cresalia-Web
```

2. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

3. **Inicializar base de datos multi-tenant**
```bash
npm run init-multitenancy
```

4. **Iniciar el servidor**
```bash
npm start
```

5. **Abrir en el navegador**
```
http://localhost:3001/demo-store
```

---

## 🎯 Accesos del Sistema

### Accesos Secretos desde la Página Principal
- **Panel Admin**: `Ctrl + Alt + A`
- **Soporte Carla**: `Ctrl + Alt + Shift + C`

### Credenciales de Prueba

> ⚠️ **IMPORTANTE**: Las credenciales de prueba no deben estar en el README público por seguridad.  
> Contacta al equipo de desarrollo para obtener credenciales de prueba.

#### Panel de Administración
- **URL**: `admin-cresalia.html`
- **Credenciales**: Contactar al equipo de desarrollo

#### Sistema de Soporte Carla
- **URL**: `atencion-cliente-carla.html`
- **Credenciales**: Contactar al equipo de desarrollo

#### Tienda Demo
- **Slug**: `demo-store`
- **URL API**: `http://localhost:3001/demo-store`

---

## 🔧 API Multi-tenant

### Endpoints Públicos

#### Obtener configuración del tenant
```http
GET /api/:tenant/config
```

#### Listar productos
```http
GET /api/:tenant/productos?categoria=1&ordenar=precio_asc&limite=20
```

#### Obtener producto específico
```http
GET /api/:tenant/productos/:id
```

#### Listar categorías
```http
GET /api/:tenant/categorias
```

#### Crear orden
```http
POST /api/:tenant/ordenes
Content-Type: application/json

{
  "cliente_nombre": "Juan Pérez",
  "cliente_email": "juan@example.com",
  "productos": [
    {
      "id": 1,
      "nombre": "Producto 1",
      "precio": 25.99,
      "cantidad": 2
    }
  ],
  "direccion_envio": "Av. Principal 123",
  "metodo_pago": "mercadopago"
}
```

### Endpoints de Administración

#### Listar todos los tenants
```http
GET /api/tenants
```

#### Registrar nuevo tenant
```http
POST /api/tenants/register
Content-Type: application/json

{
  "slug": "mi-tienda",
  "nombre_empresa": "Mi Tienda S.A.",
  "email_contacto": "admin@mitienda.com",
  "telefono": "+51 999999999",
  "password": "mi_password_seguro"
}
```

#### Estadísticas del tenant
```http
GET /api/:tenant/stats
```

---

## 💳 Planes de Alquiler Mensual (SaaS)

> **Modelo de Negocio**: Los clientes pagan mensualmente para usar la plataforma Cresalia

### 🆓 Free - Gratis para Siempre
- ✅ 50 productos
- ✅ 100 órdenes/mes
- ✅ 2 idiomas
- ✅ Logo y colores personalizados
- ✅ Sección "Nuestra Historia"
- ✅ Soporte por email
- ❌ Sin chatbot IA

### 💼 Basic - $29,000 ARS/mes
- ✅ 500 productos
- ✅ 1,000 órdenes/mes
- ✅ 3 idiomas
- ✅ Dominio personalizado
- ✅ Analytics básico
- ✅ Soporte prioritario
- ✅ Video de presentación
- ❌ Sin chatbot IA

### 🚀 Pro - $79,000 ARS/mes
- ✅ Productos ilimitados
- ✅ Órdenes ilimitadas
- ✅ Todos los idiomas (6)
- ✅ Múltiples dominios
- ✅ Analytics avanzado
- ✅ API completa
- ✅ **Chatbot IA personalizable** 🤖
- ✅ Soporte 24/7
- ✅ Múltiples administradores

### 🏢 Enterprise - Precio Personalizado
- ✅ Todo de Pro +
- ✅ **Chatbot IA con prioridad** 🤖
- ✅ White-label completo
- ✅ Servidores dedicados
- ✅ Consultoría personalizada
- ✅ Desarrollo a medida
- ✅ SLA garantizado 99.9%
- ✅ Account Manager dedicado

---

## 🎨 Personalización Completa por Tenant

Cada tenant puede personalizar **TODO** desde su panel:

### Visual y Branding
- 🎨 **Paleta de colores**: Primario, secundario, acento, texto y fondo
- 📝 **Tipografía**: 10+ fuentes profesionales
- 🖼️ **Logo y Favicon**: Branding completo
- 🎯 **Banner principal**: Hero image personalizado
- 💬 **Eslogan**: Tu mensaje único
- 🎬 **Video de presentación**: YouTube/Vimeo embed

### Idiomas y Contenido
- 🌍 **Multi-idioma**: Hasta 6 idiomas simultáneos
- 📖 **Historia de la empresa**: Sección completa personalizable
- 🎯 **Misión, Visión y Valores**: Cuenta tu propósito
- 📝 **Traducciones personalizadas**: Adapta cada palabra

### E-commerce
- 💰 **Moneda**: USD, PEN, EUR, MXN, COP, BRL, CLP, etc.
- 📦 **Configuración de envíos**: Costos y envío gratis
- 💳 **Métodos de pago**: Online, efectivo, transferencia
- 🎫 **Cupones y descuentos**: Sistema completo
- 🌐 **Zona horaria**: Para reportes precisos

### Chatbot IA (Pro+)
- 🤖 **Nombre del bot**: Personaliza completamente
- 👤 **Avatar**: Imagen personalizada
- 💬 **Mensaje de bienvenida**: Tu primera impresión
- 🎨 **Colores del chat**: Match con tu marca
- 🎭 **Tono**: Amigable, profesional, casual o experto
- 📚 **Base de conocimiento**: Entrena con info de tu negocio

---

## 🔒 Seguridad

- ✅ Aislamiento completo de datos entre tenants
- ✅ Autenticación JWT
- ✅ Passwords encriptados con bcrypt
- ✅ Validación de entrada en todas las APIs
- ✅ CORS configurado correctamente
- ✅ SQL injection prevention
- ✅ Rate limiting (próximamente)
- ✅ 2FA (próximamente)

---

## 📈 Roadmap

### Q1 2025
- [x] Sistema multi-tenancy completo
- [x] Rebranding de FRIOCAS a Cresalia
- [ ] Landing page comercial
- [ ] Sistema de suscripciones automático
- [ ] Pasarela de pagos para suscripciones

### Q2 2025
- [ ] Panel de super-admin
- [ ] Marketplace de temas y plugins
- [ ] API pública documentada
- [ ] Webhooks para integraciones
- [ ] App móvil para admins

### Q3 2025
- [ ] AI chatbot personalizado por tenant
- [ ] Recomendaciones de productos con ML
- [ ] Análisis predictivo de ventas
- [ ] Internacionalización completa

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📞 Contacto

**Cresalia Team**
- Email: contact@cresalia.com
- Website: https://cresalia.com (próximamente)

---

## 🙏 Agradecimientos

- Bootstrap 5
- Font Awesome
- Mercado Pago SDK
- Express.js
- SQLite3

---

<div align="center">
  <strong>Hecho con ❤️ por el equipo de Cresalia</strong>
  <br>
  <em>"Empezamos pocos, crecemos mucho"</em>
</div>
