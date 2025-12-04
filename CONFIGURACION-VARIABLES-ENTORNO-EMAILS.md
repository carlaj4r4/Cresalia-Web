# 📧 Configuración de Variables de Entorno para Emails

## 🔍 ¿Cómo funcionan los valores por defecto?

### **Respuesta corta:**
**SÍ**, si no configurás las variables de entorno, los emails se enviarán con los valores por defecto:
- **Remitente (FROM_NAME):** `"Cresalia"`
- **Email remitente (FROM_EMAIL):** `"cresalia25@gmail.com"`

### **Variables de Entorno:**

| Variable | Valor por Defecto | ¿Qué hace? |
|----------|-------------------|------------|
| `BREVO_API_KEY` | ❌ **REQUERIDA** | API Key de Brevo (sin esto, los emails NO se enviarán) |
| `ADMIN_EMAIL` | `cresalia25@gmail.com` | Email de administración (para notificaciones internas) |
| `FROM_EMAIL` | `ADMIN_EMAIL` o `cresalia25@gmail.com` | Email desde el cual se envían los emails |
| `FROM_NAME` | `"Cresalia"` | Nombre que aparece como remitente |

### **Ejemplo de Email Enviado:**

Si **NO configurás** las variables:
```
De: Cresalia <cresalia25@gmail.com>
Para: usuario@ejemplo.com
Asunto: ¡Bienvenido a Cresalia! 💜
```

Si **SÍ configurás** las variables en Vercel:
```
De: Tu Nombre Personalizado <tu-email@tudominio.com>
Para: usuario@ejemplo.com
Asunto: ¡Bienvenido a Cresalia! 💜
```

## ⚙️ Configuración Recomendada

### **Opción 1: Usar valores por defecto (más simple)**
No configures nada, los emails se enviarán desde:
- **Nombre:** Cresalia
- **Email:** cresalia25@gmail.com

### **Opción 2: Personalizar (recomendado para producción)**
En Vercel → Settings → Environment Variables, agrega:

```
FROM_NAME = "Tu Nombre o Nombre de tu Empresa"
FROM_EMAIL = "noreply@tudominio.com"  (o tu email preferido)
ADMIN_EMAIL = "admin@tudominio.com"  (opcional, para notificaciones)
```

**⚠️ IMPORTANTE:**
- `BREVO_API_KEY` es **OBLIGATORIA** - sin ella, los emails no se enviarán
- `FROM_EMAIL` debe ser un email válido verificado en Brevo
- Si usás un dominio personalizado, asegurate de verificarlo en Brevo

## 📋 Checklist de Configuración

- [ ] `BREVO_API_KEY` configurada en Vercel ✅ (ya está configurada)
- [ ] `FROM_EMAIL` configurada (opcional, usa default si no)
- [ ] `FROM_NAME` configurada (opcional, usa "Cresalia" si no)
- [ ] `ADMIN_EMAIL` configurada (opcional, usa default si no)

---

**Última actualización:** 2025-01-27

