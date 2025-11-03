# 👥 Carpetas de Usuarios - Cresalia

Esta carpeta contiene todos los usuarios compradores registrados en la plataforma Cresalia.

## 📁 Estructura

```
usuarios/
├── templates/          # Plantillas base para perfiles de usuario
├── assets/            # Recursos compartidos entre usuarios
└── [user-id]/         # Carpeta individual de cada usuario
    ├── profile.html   # Página de perfil del usuario
    ├── orders.html    # Historial de pedidos
    ├── wishlist.html  # Lista de deseos
    ├── assets/        # Recursos específicos del usuario
    │   ├── avatar/    # Foto de perfil
    │   └── uploads/   # Archivos subidos por el usuario
    ├── config.json    # Configuración del usuario
    └── data/          # Datos específicos (pedidos, favoritos, etc.)
```

## 🚀 Creación de Nuevo Usuario

Cuando un usuario se registra como "Comprador", se crea automáticamente:

1. **Carpeta individual** con el ID del usuario
2. **Archivos base** copiados desde `templates/`
3. **Configuración inicial** en `config.json`
4. **Conexión** con la base de datos multi-tenant

## 🔧 Configuración

Cada usuario tiene su propia configuración en `config.json`:

```json
{
  "id": "user_123",
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "+54 11 1234-5678",
  "preferencias": {
    "idioma": "es",
    "moneda": "ARS",
    "notificaciones": {
      "email": true,
      "sms": false,
      "push": true
    }
  },
  "direcciones": [
    {
      "tipo": "casa",
      "direccion": "Av. Principal 123",
      "ciudad": "Buenos Aires",
      "codigo_postal": "1000"
    }
  ],
  "metodos_pago": [
    {
      "tipo": "tarjeta",
      "ultimos_digitos": "1234",
      "nombre": "Juan Pérez"
    }
  ]
}
```

## 🌐 Acceso

Los usuarios acceden a su perfil mediante:
- **Dashboard**: `cresalia.com/mi-cuenta`
- **Perfil público**: `cresalia.com/usuario/juan-perez` (opcional)
- **Panel de usuario**: Integrado en la plataforma principal

## 🔒 Privacidad

- **Datos personales**: Solo accesibles por el usuario
- **Historial de compras**: Privado y seguro
- **Configuraciones**: Personalizables por usuario























