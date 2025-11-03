# 🚨 GUÍA DE SEGURIDAD SUPABASE - CRESALIA

## ⚠️ PROBLEMA CRÍTICO DETECTADO

**Las claves de Supabase están expuestas públicamente en el código**, lo que representa un **riesgo de seguridad grave**.

## 🔧 SOLUCIÓN INMEDIATA

### 1. **REEMPLAZAR ARCHIVO DE CONFIGURACIÓN**

```bash
# Reemplazar el archivo inseguro
mv auth/supabase-config.js auth/supabase-config-INSEGURO.js
mv auth/supabase-config-seguro.js auth/supabase-config.js
```

### 2. **CONFIGURAR VARIABLES DE ENTORNO**

Crear un archivo `.env` en la raíz del proyecto:

```env
# Variables de entorno para Supabase
SUPABASE_URL=https://tu-proyecto-real.supabase.co
SUPABASE_ANON_KEY=tu-clave-anonima-real-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-clave-de-servicio-real-aqui
```

### 3. **CONFIGURAR RLS (ROW LEVEL SECURITY)**

En el dashboard de Supabase, habilitar RLS en todas las tablas:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para tiendas
CREATE POLICY "Users can only see their own tienda" ON tiendas
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para productos
CREATE POLICY "Users can only manage their own productos" ON productos
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para servicios
CREATE POLICY "Users can only manage their own servicios" ON servicios
    FOR ALL USING (auth.uid() = user_id);
```

### 4. **CONFIGURAR POLÍTICAS DE SEGURIDAD**

```sql
-- Política para que los usuarios solo vean sus propios datos
CREATE POLICY "Users can only access their own data" ON tiendas
    FOR ALL USING (auth.uid() = user_id);

-- Política para productos
CREATE POLICY "Users can only access their own productos" ON productos
    FOR ALL USING (auth.uid() = user_id);

-- Política para servicios
CREATE POLICY "Users can only access their own servicios" ON servicios
    FOR ALL USING (auth.uid() = user_id);
```

### 5. **CONFIGURAR AUTENTICACIÓN SEGURA**

```javascript
// En el dashboard de Supabase, configurar:
// - Email confirmations: ON
// - Phone confirmations: ON
// - Password requirements: Strong
// - Session timeout: 24 hours
// - Rate limiting: ON
```

## 🔒 MEJORAS DE SEGURIDAD IMPLEMENTADAS

### ✅ **Configuración Segura**
- Variables de entorno en lugar de claves hardcodeadas
- Validación de configuración antes de inicializar
- Headers de seguridad adicionales

### ✅ **Autenticación Mejorada**
- PKCE flow para mayor seguridad
- Validación de sesiones expiradas
- Cierre de sesión seguro con limpieza de datos

### ✅ **Validaciones de Datos**
- Validación de IDs de usuario
- Verificación de campos requeridos
- Manejo de errores mejorado

### ✅ **RLS (Row Level Security)**
- Políticas para que usuarios solo vean sus datos
- Protección contra acceso no autorizado
- Segregación de datos por usuario

## 🚨 ACCIONES INMEDIATAS REQUERIDAS

1. **CAMBIAR LAS CLAVES** en Supabase Dashboard
2. **HABILITAR RLS** en todas las tablas
3. **CONFIGURAR POLÍTICAS** de seguridad
4. **REEMPLAZAR** el archivo de configuración
5. **PROBAR** que todo funcione correctamente

## 📋 CHECKLIST DE SEGURIDAD

- [ ] Claves cambiadas en Supabase
- [ ] RLS habilitado en todas las tablas
- [ ] Políticas de seguridad configuradas
- [ ] Archivo de configuración reemplazado
- [ ] Variables de entorno configuradas
- [ ] Autenticación probada
- [ ] Acceso no autorizado bloqueado

## 🔍 VERIFICACIÓN DE SEGURIDAD

Para verificar que la seguridad está funcionando:

1. **Intentar acceder a datos de otro usuario** - Debe fallar
2. **Verificar que RLS está activo** - Solo ver datos propios
3. **Probar autenticación** - Debe funcionar correctamente
4. **Verificar logs de Supabase** - No debe haber accesos no autorizados

## 📞 SOPORTE

Si necesitas ayuda con la configuración de seguridad, contacta a:
- **Supabase Support**: https://supabase.com/support
- **Documentación**: https://supabase.com/docs/guides/auth/row-level-security

---

**⚠️ IMPORTANTE**: Esta configuración es crítica para la seguridad de Cresalia. No subas las claves reales al repositorio.





