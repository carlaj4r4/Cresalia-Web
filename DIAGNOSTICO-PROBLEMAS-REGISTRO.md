# 🚨 Diagnóstico: Problemas de Registro y Emails

## ❌ Problemas Encontrados

### **1. Email de Bienvenida Redirige a "cresalia.com"**

**Ubicación del problema**: Probablemente en plantilla de Brevo o configuración de API

**Solución**: El template HTML en `sistema-emails-automaticos.js` NO tiene links. El problema está en:
- Template de Brevo (si usás templates guardados en Brevo)
- O en el endpoint `/api/enviar-email-brevo`

---

### **2. Registro de Tiendas Crea Compradores**

**Problema GRAVE encontrado**: 

En `auth/auth-system.js` línea 37:
```javascript
data: {
    nombre_completo: nombreCompleto,
    tipo_usuario: 'comprador' // ← SIEMPRE COMPRADOR
}
```

Y línea 27:
```javascript
const redirectUrl = 'https://cresalia-web.vercel.app/login-comprador.html';
// ← SIEMPRE REDIRIGE A LOGIN DE COMPRADOR
```

**Causa**: La función `registrarNuevoComprador()` está siendo usada para TODOS los registros (tanto compradores como tiendas).

---

## 🔧 Soluciones

### **Solución 1: Crear Función de Registro para Vendedores**

Agregar esta función a `auth/auth-system.js`:

```javascript
// ===== REGISTRO DE NUEVOS VENDEDORES/TIENDAS =====
async function registrarNuevoVendedor(datos) {
    console.log('📝 Registrando nuevo vendedor/tienda...');
    
    const { email, password, nombreCompleto, nombreTienda } = datos;
    
    try {
        const supabase = initSupabase();
        
        if (!supabase) {
            throw new Error('No se pudo inicializar Supabase');
        }
        
        // URL de redirección para VENDEDORES
        const redirectUrl = 'https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html';
        console.log('🔗 URL de redirección para email:', redirectUrl);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: redirectUrl,
                data: {
                    nombre_completo: nombreCompleto,
                    nombre_tienda: nombreTienda,
                    tipo_usuario: 'vendedor' // ← VENDEDOR, NO COMPRADOR
                }
            }
        });
        
        console.log('📊 Respuesta de signUp:', { data: authData, error: authError });
        
        if (authError) {
            console.error('❌ Error en signUp:', authError);
            throw new Error(authError.message);
        }
        
        if (!authData.user) {
            throw new Error('No se pudo crear el usuario. Por favor, inténtalo de nuevo.');
        }
        
        // Enviar email de bienvenida para VENDEDOR
        if (window.sistemaEmailsCresalia) {
            await window.sistemaEmailsCresalia.enviarBienvenida({
                id: authData.user.id,
                email: email,
                nombre: nombreCompleto,
                tipo: 'vendedor' // ← TIPO VENDEDOR
            });
        }
        
        console.log('✅ Vendedor registrado exitosamente');
        return { success: true, user: authData.user };
        
    } catch (error) {
        console.error('❌ Error registrando vendedor:', error);
        throw error;
    }
}
```

---

### **Solución 2: Actualizar Formulario de Registro de Tiendas**

En `registro-tienda.html`, cambiar la función que se llama al hacer submit:

**ANTES** (incorrecto):
```javascript
await registrarNuevoComprador({
    email: email,
    password: password,
    nombreCompleto: nombre
});
```

**DESPUÉS** (correcto):
```javascript
await registrarNuevoVendedor({
    email: email,
    password: password,
    nombreCompleto: nombre,
    nombreTienda: nombreTienda
});
```

---

### **Solución 3: Corregir Email de Bienvenida**

El template NO tiene links incorrectos. El problema está en:

#### **Opción A: Si usás templates de Brevo**

1. Ir a Brevo Dashboard
2. Campaigns → Templates
3. Buscar template de bienvenida
4. Editar y cambiar "cresalia.com" por:
   - Para compradores: `https://cresalia-web.vercel.app/login-comprador.html`
   - Para vendedores: `https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html`

#### **Opción B: Si es en el endpoint de Vercel**

Verificar `/api/enviar-email-brevo.js` y corregir cualquier URL hardcodeada.

---

## 📋 Implementación Paso a Paso

### **PASO 1: Agregar Función de Registro de Vendedores**

1. Abrir `auth/auth-system.js`
2. Buscar la función `registrarNuevoComprador`
3. Después de esa función, agregar la nueva función `registrarNuevoVendedor`
4. Guardar

---

### **PASO 2: Actualizar Formulario de Registro**

1. Abrir `registro-tienda.html`
2. Buscar donde se llama a `registrarNuevoComprador`
3. Cambiar por `registrarNuevoVendedor`
4. Guardar

---

### **PASO 3: Verificar Trigger de Perfiles**

Asegurarse de que el trigger SQL en Supabase crea el perfil correcto según `tipo_usuario`:

```sql
-- Verificar que existe este trigger
SELECT * FROM information_schema.triggers 
WHERE trigger_name LIKE '%perfil%' OR trigger_name LIKE '%user%';
```

---

### **PASO 4: Probar**

1. Ir a `registro-tienda.html`
2. Registrar usuario de prueba
3. Verificar:
   - ¿El email de confirmación redirige a `admin-final.html`? ✅
   - ¿El email de bienvenida llega? ✅
   - ¿El usuario aparece en tabla de vendedores? ✅
   - ¿NO aparece en tabla de compradores? ✅

---

## 🔍 Verificación en Supabase

### **Verificar Tipo de Usuario en Auth**

```sql
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'tipo_usuario' as tipo,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
```

### **Verificar Perfiles Creados**

```sql
-- Si tenés tabla perfiles_vendedores
SELECT * FROM perfiles_vendedores ORDER BY created_at DESC LIMIT 5;

-- Si tenés tabla perfiles_compradores
SELECT * FROM perfiles_compradores ORDER BY created_at DESC LIMIT 5;
```

---

## ✅ Checklist de Corrección

- [ ] Agregar función `registrarNuevoVendedor()` en `auth-system.js`
- [ ] Actualizar `registro-tienda.html` para usar la nueva función
- [ ] Verificar triggers de creación de perfiles en Supabase
- [ ] Corregir templates de email en Brevo
- [ ] Probar registro de tienda
- [ ] Verificar que aparece en tabla de vendedores
- [ ] Verificar email de bienvenida correcto

---

¿Quieres que implemente estas correcciones ahora? 💜
