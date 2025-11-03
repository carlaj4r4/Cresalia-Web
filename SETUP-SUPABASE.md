# 🔐 Guía de Configuración: Sistema de Autenticación con Supabase

## ¿Por qué Supabase?

✅ **Gratis hasta 50,000 usuarios**  
✅ **Seguridad nivel empresarial**  
✅ **Base de datos PostgreSQL**  
✅ **Configuración en 10 minutos**  
✅ **Sin necesidad de servidor propio**

---

## 📋 Paso 1: Crear Cuenta en Supabase

1. Ve a: https://supabase.com
2. Haz clic en **"Start your project"**
3. Regístrate con tu email o GitHub
4. Es **100% GRATIS** para empezar

---

## 🏗️ Paso 2: Crear Nuevo Proyecto

1. En el dashboard, haz clic en **"New Project"**
2. Llena los datos:
   - **Name**: CRESALIA-Tiendas
   - **Database Password**: (guarda esta contraseña en un lugar seguro)
   - **Region**: South America (São Paulo) - más cercano a Argentina
3. Haz clic en **"Create new project"**
4. Espera 2 minutos mientras se crea

---

## 🔑 Paso 3: Obtener tus Credenciales

1. En tu proyecto, ve a **Settings** (⚙️) → **API**
2. Encontrarás:
   - **Project URL**: `https://xxxx.supabase.co`
   - **anon public key**: Una clave larga (empieza con `eyJ...`)

3. **Copia estos dos valores** y pégalos en:
   - Archivo: `auth/supabase-config.js`
   - Reemplaza `TU_SUPABASE_URL` con tu URL
   - Reemplaza `TU_SUPABASE_ANON_KEY` con tu clave

**Ejemplo:**
```javascript
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto-123.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    // ...
};
```

---

## 🗄️ Paso 4: Crear la Tabla de Tiendas

1. En Supabase, ve a **SQL Editor** (📝)
2. Haz clic en **"New Query"**
3. Copia y pega este código SQL:

```sql
-- Crear tabla de tiendas
CREATE TABLE tiendas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_tienda TEXT NOT NULL,
    email TEXT NOT NULL,
    plan TEXT NOT NULL CHECK (plan IN ('basico', 'pro', 'premium')),
    subdomain TEXT UNIQUE NOT NULL,
    activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    configuracion JSONB DEFAULT '{}'::jsonb,
    
    CONSTRAINT tiendas_user_id_unique UNIQUE (user_id)
);

-- Crear índices para mejor performance
CREATE INDEX idx_tiendas_user_id ON tiendas(user_id);
CREATE INDEX idx_tiendas_subdomain ON tiendas(subdomain);
CREATE INDEX idx_tiendas_email ON tiendas(email);

-- Habilitar Row Level Security (RLS)
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver y editar su propia tienda
CREATE POLICY "Los usuarios pueden ver su propia tienda"
    ON tiendas
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su propia tienda"
    ON tiendas
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar su propia tienda"
    ON tiendas
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

4. Haz clic en **"Run"** (▶️)
5. Deberías ver: **Success. No rows returned**

---

## 📧 Paso 5: Configurar Emails

1. Ve a **Authentication** → **Email Templates**
2. Personaliza los templates de:
   - Confirmación de email
   - Recuperación de contraseña
   - Magic Link (opcional)

3. Para testing, Supabase usa emails falsos
4. Para producción, configura tu propio SMTP o usa SendGrid

---

## 🎨 Paso 6: Configurar URL de Redirección

1. Ve a **Authentication** → **URL Configuration**
2. En **Site URL**, pon tu dominio:
   - Desarrollo: `http://localhost:8080` o `http://127.0.0.1:8080`
   - Producción: `https://cresalia.com`

3. En **Redirect URLs**, agrega:
   ```
   http://localhost:8080/auth/**
   https://cresalia.com/auth/**
   ```

---

## ✅ Paso 7: ¡Probar el Sistema!

1. Abre: `registro-tienda.html` en tu navegador
2. Llena el formulario de registro
3. Deberías ver: "¡Registro exitoso! Revisa tu email..."
4. Verifica en Supabase → **Authentication** → **Users**
5. Deberías ver el nuevo usuario creado

---

## 🔒 Seguridad

### ¿Es seguro exponer la anon key?

**SÍ**, es completamente seguro porque:
- La anon key es pública (diseñada para frontend)
- Todas las operaciones están protegidas por Row Level Security (RLS)
- Cada usuario solo puede acceder a SUS datos
- Las contraseñas se hashean automáticamente con bcrypt

### Row Level Security (RLS)

RLS asegura que:
- Un usuario **solo puede ver su propia tienda**
- **No puede** ver tiendas de otros usuarios
- **No puede** modificar datos de otros
- **Todo esto se valida en el servidor**, no en el cliente

---

## 🚀 ¿Qué Sigue?

Una vez configurado Supabase:

1. ✅ Los clientes se registran en `registro-tienda.html`
2. ✅ Hacen login en `login-tienda.html`
3. ✅ Acceden a su panel admin personal
4. ✅ Cada cliente tiene su propia tienda independiente
5. ✅ Todo es seguro y escalable

---

## 💰 Costos

### Plan Gratuito (Forever Free):
- ✅ 50,000 usuarios activos mensuales
- ✅ 500 MB de almacenamiento
- ✅ 2 GB de transferencia
- ✅ Autenticación incluida
- ✅ Base de datos PostgreSQL

### ¿Cuándo necesitas pagar?
- Cuando tengas **más de 50,000 usuarios activos al mes**
- O si necesitas **más almacenamiento**

**Para empezar, es 100% GRATIS** 🎉

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que las credenciales estén correctas
3. Asegúrate de que la tabla `tiendas` existe
4. Revisa los logs en Supabase → **Logs**

---

## 📚 Documentación Adicional

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**¡Listo! Con esto tienes un sistema de autenticación seguro, escalable y GRATIS para empezar** 💜🚀




















