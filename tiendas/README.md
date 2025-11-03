# 🏪 Carpetas de Tiendas - Cresalia

Esta carpeta contiene todas las tiendas creadas en la plataforma Cresalia.

## 📁 Estructura

```
tiendas/
├── templates/          # Plantillas base para nuevas tiendas
├── assets/            # Recursos compartidos entre tiendas
└── [nombre-tienda]/   # Carpeta individual de cada tienda
    ├── index.html     # Página principal de la tienda
    ├── assets/        # Recursos específicos de la tienda
    │   ├── logo/      # Logo de la tienda
    │   ├── productos/ # Imágenes de productos
    │   └── banners/   # Banners promocionales
    ├── config.json    # Configuración de la tienda
    └── data/          # Datos específicos (productos, categorías, etc.)
```

## 🚀 Creación de Nueva Tienda

Cuando un usuario se registra como "Tienda", se crea automáticamente:

1. **Carpeta individual** con el slug de la tienda
2. **Archivos base** copiados desde `templates/`
3. **Configuración inicial** en `config.json`
4. **Conexión** con la base de datos multi-tenant

## 🔧 Configuración

Cada tienda tiene su propia configuración en `config.json`:

```json
{
  "slug": "mi-tienda",
  "nombre": "Mi Tienda",
  "descripcion": "Descripción de la tienda",
  "contacto": {
    "email": "contacto@mitienda.com",
    "telefono": "+54 11 1234-5678"
  },
  "ubicacion": {
    "direccion": "Av. Principal 123",
    "ciudad": "Buenos Aires",
    "pais": "Argentina"
  },
  "envios": {
    "costo": 500,
    "gratis_desde": 10000
  },
  "pagos": {
    "online": true,
    "efectivo": true
  }
}
```

## 🌐 Acceso

Las tiendas son accesibles mediante:
- **Subdominio**: `mi-tienda.cresalia.com`
- **Path**: `cresalia.com/tienda/mi-tienda`
- **Dominio personalizado**: `mitienda.com` (opcional)
























