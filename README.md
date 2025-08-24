# 🚗 FRIOCAS - Sistema Web Completo

Sistema web completo para FRIOCAS, empresa de refrigeración automotriz en Corrientes, Argentina.

## 🌟 Características

- **🛒 Catálogo de Productos** - Productos de refrigeración automotriz
- **🛍️ Carrito de Compras** - Sistema completo de compras
- **💳 Integración Mercado Pago** - Pagos online seguros
- **🚚 Sistema de Transporte** - Cálculo de precios por kilómetro
- **📋 Gestión de Reservas** - Sistema de turnos y servicios
- **📧 Comprobantes** - Descarga PDF, Email y WhatsApp
- **🔐 Panel de Administración** - Gestión completa del negocio
- **🎧 Soporte de Carla** - Sistema de atención al cliente
- **🛡️ Sistema de Seguridad** - Protección completa

## 🚀 Instalación

### Requisitos
- Navegador web moderno
- Servidor web (para Mercado Pago)
- Cuenta de Mercado Pago Business

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/friocas-web.git
cd friocas-web
```

2. **Configurar Mercado Pago:**
   - Obtener credenciales de Mercado Pago Business
   - Editar `script-friocas.js` línea 4361-4364:
   ```javascript
   const MERCADO_PAGO_CONFIG = {
       publicKey: 'APP-TU-PUBLIC-KEY-REAL',
       accessToken: 'APP-TU-ACCESS-TOKEN-REAL',
       preferenceId: null,
       sandbox: false
   };
   ```

3. **Subir a servidor web:**
   - GitHub Pages
   - Vercel
   - Netlify
   - Servidor propio

## 🔧 Configuración

### Credenciales de Acceso

**Panel de Administración:**
- Acceso: `Ctrl + Alt + A`
- Usuario: `admin`
- Contraseña: `FRIOCAS2024ADMIN`

**Soporte de Carla:**
- Acceso: `Ctrl + Alt + C`
- Usuario: `carla`
- Contraseña: `FRIOCAS2024CARLA`

### Configuración de Mercado Pago

1. **Crear cuenta en Mercado Pago Business**
2. **Obtener credenciales de producción:**
   - Public Key
   - Access Token
3. **Configurar webhooks** (opcional)
4. **Probar en sandbox** antes de producción

## 📁 Estructura del Proyecto

```
FRIOCAS-Web/
├── index-friocas-productos.html    # Página principal
├── admin-friocas.html              # Panel de administración
├── soporte-carla.html              # Sistema de Carla
├── script-friocas.js               # JavaScript principal
├── admin-friocas.js                # JavaScript del admin
├── security-system.js              # Sistema de seguridad
├── styles-friocas.css              # Estilos principales
├── assets/                         # Imágenes y recursos
│   ├── logo/
│   └── productos/
├── test-*.html                     # Páginas de prueba
└── README.md                       # Este archivo
```

## 🌐 Despliegue

### GitHub Pages
1. Subir código a GitHub
2. Activar GitHub Pages en Settings
3. Configurar dominio personalizado (opcional)

### Vercel
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Desplegar automáticamente

### Netlify
1. Arrastrar carpeta del proyecto
2. Configurar dominio
3. Activar HTTPS automático

## 🔐 Seguridad

- **Autenticación con tokens**
- **Protección contra fuerza bruta**
- **Detección de herramientas de desarrollador**
- **Auditoría completa de eventos**
- **Timeout de sesión automático**

## 📞 Contacto

**FRIOCAS**
- 📍 Moreno 2242, Corrientes Capital, Argentina
- 📞 +5493795015712
- 📧 jj_refrigeracionesctes@hotmail.com
- 🕒 Lunes a Viernes: 8:00 - 12:00 y 16:00 - 20:00
- 🕒 Sábados: 8:00 - 12:00
- 🕒 Domingos: Cerrado

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsivos
- **JavaScript ES6+** - Funcionalidad dinámica
- **Bootstrap 5** - Framework CSS
- **Font Awesome** - Iconografía
- **Mercado Pago API** - Procesamiento de pagos
- **LocalStorage** - Almacenamiento local
- **Google Maps API** - Mapas y ubicación

## 📋 Funcionalidades Principales

### Para Clientes
- ✅ Catálogo de productos con búsqueda
- ✅ Carrito de compras funcional
- ✅ Cálculo de precios por cantidad
- ✅ Reserva de servicios técnicos
- ✅ Sistema de transporte con cálculo de precios
- ✅ Descarga de comprobantes
- ✅ Envío por email y WhatsApp
- ✅ Múltiples métodos de pago

### Para Administración
- ✅ Gestión completa de productos
- ✅ Panel de administración seguro
- ✅ Gestión de usuarios y clientes
- ✅ Reportes de ventas
- ✅ Configuración de pagos
- ✅ Monitoreo de seguridad
- ✅ Backup automático de datos

### Para Soporte (Carla)
- ✅ Sistema de atención al cliente
- ✅ Gestión de tickets de soporte
- ✅ Chat en tiempo real
- ✅ Reportes de clientes
- ✅ Configuración de soporte

## 🚨 Notas Importantes

1. **Mercado Pago requiere un servidor web** - No funciona en archivos locales
2. **Credenciales reales** - Reemplazar las credenciales de prueba
3. **Dominio HTTPS** - Mercado Pago requiere HTTPS en producción
4. **Webhooks** - Configurar para notificaciones automáticas
5. **Backup regular** - Hacer copias de seguridad de los datos

## 🔄 Actualizaciones

- **Versión actual:** 7.5
- **Última actualización:** Enero 2025
- **Compatibilidad:** Navegadores modernos

## 📄 Licencia

Este proyecto es propiedad de FRIOCAS. Todos los derechos reservados.

---

**Desarrollado con ❤️ para FRIOCAS** 