# 📚 Documentación de API - Cresalia

**Versión:** 1.0  
**Última actualización:** 2025-11-26  
**Base URL:** `https://cresalia-web.vercel.app/api`

---

## 📋 Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Endpoints Públicos](#endpoints-públicos)
3. [Endpoints de Comunidades](#endpoints-de-comunidades)
4. [Endpoints de Pagos](#endpoints-de-pagos)
5. [Endpoints de Aniversarios](#endpoints-de-aniversarios)
6. [Endpoints de Historias](#endpoints-de-historias)
7. [Endpoints de Animales](#endpoints-de-animales)
8. [Códigos de Estado HTTP](#códigos-de-estado-http)
9. [Manejo de Errores](#manejo-de-errores)
10. [Rate Limiting](#rate-limiting)
11. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🔐 Autenticación

Actualmente, la mayoría de los endpoints son públicos. Para endpoints que requieren autenticación en el futuro, se utilizará **JWT (JSON Web Tokens)**.

### Headers Requeridos

```http
Content-Type: application/json
Accept: application/json
```

### Autenticación Futura (JWT)

```http
Authorization: Bearer {token}
```

---

## 🌐 Endpoints Públicos

### 1. Aniversarios y Celebraciones

#### Obtener Celebraciones Activas

```http
GET /api/aniversarios-celebracion?tipo=tienda&slug=ejemplo-tienda
```

**Parámetros de Query:**
- `tipo` (requerido): `tienda`, `servicio`, o `comprador`
- `slug` (requerido): Identificador único del negocio/usuario
- `mes` (opcional): Mes para filtrar (1-12)
- `año` (opcional): Año para filtrar (default: año actual)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "celebraciones": [
    {
      "tipo_celebracion": "cumpleanos",
      "fecha": "2025-03-15",
      "dias_restantes": 47,
      "personalizacion": {
        "color_fondo": "#EC4899",
        "color_texto": "#FFFFFF",
        "mensaje_personalizado": "¡Feliz cumpleaños!"
      },
      "combos": [
        {
          "nombre": "Combo Cumpleaños",
          "descuento": 20,
          "productos": ["producto-1", "producto-2"]
        }
      ]
    }
  ]
}
```

**Errores:**
- `400`: Parámetros inválidos
- `404`: No se encontró el negocio/usuario
- `500`: Error del servidor

---

#### Configurar Aniversarios

```http
POST /api/aniversarios-configuracion
```

**Body:**
```json
{
  "tipo_negocio": "tienda",
  "slug": "ejemplo-tienda",
  "tipo_celebracion": "cumpleanos",
  "fecha": "2025-03-15",
  "duracion_dias": 7,
  "personalizacion": {
    "color_fondo": "#EC4899",
    "color_texto": "#FFFFFF",
    "mensaje_personalizado": "¡Feliz cumpleaños!"
  }
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Aniversario configurado correctamente",
  "id": "uuid-del-aniversario"
}
```

---

### 2. Cumpleaños de Compradores

#### Obtener Consentimiento y Preferencias

```http
GET /api/compradores-cumple-consent?email=usuario@example.com
```

**Parámetros de Query:**
- `email` (requerido): Email del comprador

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "consentimiento": {
    "email": "usuario@example.com",
    "publico": true,
    "acepta_descuentos": true,
    "mensaje_publico": "¡Feliz cumpleaños!",
    "fecha_nacimiento": "1990-03-15"
  }
}
```

---

#### Guardar Consentimiento y Preferencias

```http
POST /api/compradores-cumple-consent
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "publico": true,
  "acepta_descuentos": true,
  "mensaje_publico": "¡Feliz cumpleaños!",
  "fecha_nacimiento": "1990-03-15"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Preferencias guardadas correctamente"
}
```

---

#### Obtener Resumen Mensual de Cumpleañeros

```http
GET /api/cumpleanos-resumen?mes=3&año=2025
```

**Parámetros de Query:**
- `mes` (opcional): Mes (1-12), default: mes actual
- `año` (opcional): Año, default: año actual

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "mes": 3,
  "año": 2025,
  "total_cumpleaneros": 15,
  "total_abrazos": 42,
  "total_mensajes": 28,
  "total_beneficios": 12
}
```

---

### 3. Historias con Corazón Cresalia

#### Obtener Historias Públicas

```http
GET /api/historias-corazon?publicas=true
```

**Parámetros de Query:**
- `publicas` (opcional): `true` para obtener solo historias públicas
- `vendedor_id` (opcional): ID del vendedor para obtener su historia
- `donde_mostrar` (opcional): `principal`, `mi_página`, `solo_vendedores`, `ninguna`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "historias": [
    {
      "id": "uuid",
      "vendedor_id": "uuid",
      "tipo_vendedor": "tienda",
      "nombre_negocio": "Mi Tienda",
      "historia": "Mi historia de emprendimiento...",
      "foto_url": "https://...",
      "consejos": "Mis consejos para emprendedores...",
      "publica": true,
      "donde_mostrar": "principal",
      "fecha_creacion": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

#### Crear/Actualizar Historia

```http
POST /api/historias-corazon
```

**Body:**
```json
{
  "vendedor_id": "uuid",
  "tipo_vendedor": "tienda",
  "nombre_negocio": "Mi Tienda",
  "historia": "Mi historia de emprendimiento...",
  "foto_url": "https://...",
  "consejos": "Mis consejos para emprendedores...",
  "publica": true,
  "donde_mostrar": "principal"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Historia guardada correctamente",
  "historia_id": "uuid"
}
```

---

#### Desactivar Historia

```http
DELETE /api/historias-corazon?vendedor_id=uuid
```

**Parámetros de Query:**
- `vendedor_id` (requerido): ID del vendedor

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Historia desactivada correctamente"
}
```

---

### 4. Cresalia Animales

#### Obtener Animales que Necesitan Ayuda

```http
GET /api/animales?accion=listar
```

**Parámetros de Query:**
- `accion` (requerido): `listar` para obtener animales
- `organizacion_id` (opcional): Filtrar por organización
- `tipo` (opcional): `perro`, `gato`, etc.
- `estado` (opcional): `disponible`, `adoptado`, `en_tratamiento`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "animales": [
    {
      "id": "uuid",
      "nombre": "Luna",
      "tipo": "perro",
      "edad": "2 años",
      "descripcion": "Perrita muy cariñosa...",
      "fotos": ["https://..."],
      "organizacion_id": "uuid",
      "fecha_adopcion_rescate": "2023-05-15",
      "estado": "disponible"
    }
  ]
}
```

---

#### Obtener Animales Cumpleañeros

```http
GET /api/animales?accion=cumpleanos&mes=5
```

**Parámetros de Query:**
- `accion` (requerido): `cumpleanos`
- `mes` (opcional): Mes (1-12), default: mes actual
- `año` (opcional): Año, default: año actual

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "mes": 5,
  "animales": [
    {
      "id": "uuid",
      "nombre": "Luna",
      "tipo": "perro",
      "años_desde_rescate": 2,
      "fecha_adopcion_rescate": "2023-05-15",
      "fotos": ["https://..."]
    }
  ]
}
```

---

#### Subir Archivo (Imagen/Video)

```http
POST /api/animales?accion=subir-archivo
```

**Body (multipart/form-data o JSON con base64):**
```json
{
  "archivo": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "tipo": "imagen",
  "organizacion_id": "uuid"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "url": "https://supabase.co/storage/v1/object/public/animales-files/uuid.jpg",
  "tipo": "imagen"
}
```

---

## 💜 Endpoints de Comunidades

### 1. Maternidad

#### Obtener Publicaciones

```http
GET /api/maternidad?tipo=publicaciones
```

**Parámetros de Query:**
- `tipo` (requerido): `publicaciones`
- `categoria` (opcional): Filtrar por categoría
- `limit` (opcional): Límite de resultados (default: 20)
- `offset` (opcional): Offset para paginación

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "publicaciones": [
    {
      "id": "uuid",
      "usuario_email": "usuario@example.com",
      "titulo": "Mi experiencia...",
      "contenido": "Contenido de la publicación...",
      "categoria": "embarazo",
      "fecha_creacion": "2025-01-15T10:30:00Z",
      "comentarios_count": 5
    }
  ]
}
```

---

#### Crear Publicación

```http
POST /api/maternidad?tipo=publicaciones
```

**Body:**
```json
{
  "usuario_email": "usuario@example.com",
  "titulo": "Mi experiencia...",
  "contenido": "Contenido de la publicación...",
  "categoria": "embarazo"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Publicación creada correctamente",
  "publicacion_id": "uuid"
}
```

---

#### Obtener Entradas de Diario

```http
GET /api/maternidad?tipo=diario&email=usuario@example.com
```

**Parámetros de Query:**
- `tipo` (requerido): `diario`
- `email` (requerido): Email del usuario

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "entradas": [
    {
      "id": "uuid",
      "usuario_email": "usuario@example.com",
      "fecha": "2025-01-15",
      "semana_embarazo": 12,
      "emocion": "feliz",
      "sintomas": "Náuseas leves",
      "notas": "Notas del día..."
    }
  ]
}
```

---

#### Crear Entrada de Diario

```http
POST /api/maternidad?tipo=diario
```

**Body:**
```json
{
  "usuario_email": "usuario@example.com",
  "fecha": "2025-01-15",
  "semana_embarazo": 12,
  "emocion": "feliz",
  "sintomas": "Náuseas leves",
  "notas": "Notas del día..."
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Entrada de diario guardada correctamente",
  "entrada_id": "uuid"
}
```

---

### 2. Otras Comunidades

Todas las comunidades siguen el mismo patrón de API:

- **Desahogo Libre**: `/api/desahogo-libre`
- **Libertad Emocional**: `/api/libertad-emocional`
- **Sanando Abandonos**: `/api/sanando-abandonos`
- **Libertad Económica**: `/api/libertad-economica`
- **Espiritualidad y Fe**: `/api/espiritualidad-fe`
- **Injusticias Vividas**: `/api/injusticias-vividas`
- **Caminando Juntos**: `/api/caminando-juntos`

**Estructura común:**

```http
GET /api/{comunidad}?accion=publicaciones
POST /api/{comunidad}?accion=publicaciones
GET /api/{comunidad}?accion=comentarios&publicacion_id=uuid
POST /api/{comunidad}?accion=comentarios
```

---

## 💳 Endpoints de Pagos

### 1. Crear Preferencia de Pago (Mercado Pago)

```http
POST /api/mercadopago-preference
```

**Body:**
```json
{
  "items": [
    {
      "title": "Producto 1",
      "quantity": 2,
      "unit_price": 100.00,
      "currency_id": "ARS"
    }
  ],
  "payer": {
    "email": "comprador@example.com",
    "name": "Juan Pérez"
  },
  "back_urls": {
    "success": "https://cresalia-web.vercel.app/pago-exitoso",
    "failure": "https://cresalia-web.vercel.app/pago-error",
    "pending": "https://cresalia-web.vercel.app/pago-pendiente"
  },
  "auto_return": "approved",
  "statement_descriptor": "Cresalia"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "preference_id": "1234567890-abc-def-ghi",
  "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=..."
}
```

---

### 2. Webhook de Mercado Pago

```http
POST /api/webhook-mercadopago
```

**Headers:**
```http
x-signature: {signature}
x-request-id: {request-id}
```

**Body (JSON):**
```json
{
  "action": "payment.created",
  "api_version": "v1",
  "data": {
    "id": "1234567890"
  },
  "date_created": "2025-01-15T10:30:00Z",
  "id": 123456,
  "live_mode": true,
  "type": "payment",
  "user_id": "123456789"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Webhook procesado correctamente"
}
```

---

## 📊 Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Parámetros inválidos o faltantes |
| 401 | Unauthorized | Autenticación requerida |
| 403 | Forbidden | No tienes permisos |
| 404 | Not Found | Recurso no encontrado |
| 429 | Too Many Requests | Límite de solicitudes excedido |
| 500 | Internal Server Error | Error del servidor |

---

## ⚠️ Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "details": {
    "campo": "mensaje específico del campo"
  }
}
```

**Ejemplo:**
```json
{
  "success": false,
  "error": "Parámetros inválidos",
  "code": "INVALID_PARAMS",
  "details": {
    "email": "El email es requerido",
    "fecha_nacimiento": "La fecha debe ser válida"
  }
}
```

---

## 🚦 Rate Limiting

Actualmente no hay límites estrictos, pero se recomienda:

- **Máximo 100 solicitudes por minuto** por IP
- **Máximo 1000 solicitudes por hora** por IP

Si excedes estos límites, recibirás un `429 Too Many Requests`.

---

## 💡 Ejemplos de Uso

### JavaScript (Fetch API)

```javascript
// Obtener celebraciones activas
async function obtenerCelebraciones() {
  const response = await fetch(
    'https://cresalia-web.vercel.app/api/aniversarios-celebracion?tipo=tienda&slug=ejemplo-tienda'
  );
  const data = await response.json();
  return data;
}

// Crear preferencia de pago
async function crearPreferenciaPago(items) {
  const response = await fetch(
    'https://cresalia-web.vercel.app/api/mercadopago-preference',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: items,
        payer: {
          email: 'comprador@example.com',
          name: 'Juan Pérez'
        },
        back_urls: {
          success: 'https://cresalia-web.vercel.app/pago-exitoso',
          failure: 'https://cresalia-web.vercel.app/pago-error'
        }
      })
    }
  );
  const data = await response.json();
  return data;
}
```

### cURL

```bash
# Obtener historias públicas
curl -X GET "https://cresalia-web.vercel.app/api/historias-corazon?publicas=true"

# Crear publicación en comunidad Maternidad
curl -X POST "https://cresalia-web.vercel.app/api/maternidad?tipo=publicaciones" \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_email": "usuario@example.com",
    "titulo": "Mi experiencia",
    "contenido": "Contenido...",
    "categoria": "embarazo"
  }'
```

### Python

```python
import requests

# Obtener animales que necesitan ayuda
response = requests.get(
    'https://cresalia-web.vercel.app/api/animales',
    params={'accion': 'listar'}
)
data = response.json()
print(data)

# Guardar consentimiento de cumpleaños
response = requests.post(
    'https://cresalia-web.vercel.app/api/compradores-cumple-consent',
    json={
        'email': 'usuario@example.com',
        'publico': True,
        'acepta_descuentos': True,
        'fecha_nacimiento': '1990-03-15'
    }
)
print(response.json())
```

---

## 📞 Soporte

Si tienes preguntas sobre la API:

- **Email:** cresalia25@gmail.com
- **Documentación:** Este documento
- **Issues:** GitHub (si tienes repositorio público)

---

## 🔄 Versiones

- **v1.0** (2025-01-27): Versión inicial de la documentación

---

**Última actualización:** 2025-01-27  
**Mantenido por:** Equipo Cresalia 💜


