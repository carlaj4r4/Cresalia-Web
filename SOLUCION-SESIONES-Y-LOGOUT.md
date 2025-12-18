# 🔧 Soluciones: Logout, Celular y Sesiones Persistentes

## 📋 Problemas Reportados

1. ❓ Cómo salir del perfil de comprador
2. ❓ Pueden guardar celular
3. ❌ Las sesiones no permanecen abiertas por mucho tiempo (usuarios se quejan)

---

## 🚪 Solución 1: Agregar Botón de Logout

### **Problema**: No hay forma clara de cerrar sesión

### **Solución**: Agregar botón de logout en los paneles

#### **Código para Logout**:

```javascript
// Función de logout mejorada
async function cerrarSesion() {
    try {
        const supabase = initSupabase();
        
        if (!supabase) {
            throw new Error('No se pudo inicializar Supabase');
        }
        
        // Cerrar sesión en Supabase
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Error al cerrar sesión:', error);
            throw error;
        }
        
        // Limpiar localStorage
        localStorage.removeItem('cresalia_sesion_activa');
        localStorage.removeItem('cresalia_session_token');
        localStorage.removeItem('cresalia_user_data');
        localStorage.removeItem('plan-actual');
        
        // Limpiar sessionStorage
        sessionStorage.clear();
        
        // Redirigir al login
        window.location.href = '/index-cresalia.html';
        
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Por favor, recarga la página.');
    }
}

// Hacer disponible globalmente
window.cerrarSesion = cerrarSesion;
```

#### **Agregar Botón en HTML**:

```html
<!-- En admin-final.html, agregar en el header -->
<div class="user-menu">
    <button onclick="cerrarSesion()" class="btn-logout">
        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
    </button>
</div>

<style>
.btn-logout {
    background: #ef4444;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-logout:hover {
    background: #dc2626;
    transform: translateY(-2px);
}
</style>
```

---

## 📱 Solución 2: Agregar Campo de Celular

### **Problema**: No se puede guardar el número de celular

### **Solución A: En el Registro**

Agregar campo de celular en `registro-tienda.html`:

```html
<!-- Después del campo de email -->
<div class="form-group">
    <label for="celular">
        <i class="fas fa-phone"></i> Celular (Opcional)
    </label>
    <input 
        type="tel" 
        id="celular" 
        name="celular"
        placeholder="+54 9 11 1234-5678"
        pattern="[+]?[0-9\s-]+"
    >
</div>
```

### **Solución B: En el Perfil**

Permitir editar celular desde el panel de administración.

### **SQL para Agregar Campo**:

```sql
-- En tabla de tiendas
ALTER TABLE tiendas 
ADD COLUMN IF NOT EXISTS celular VARCHAR(20);

-- En tabla de perfiles de vendedores (si existe)
ALTER TABLE perfiles_vendedores 
ADD COLUMN IF NOT EXISTS celular VARCHAR(20);

-- En metadata de auth.users (ya está disponible)
-- Se guarda en user_metadata al registrarse
```

### **Guardar Celular en el Registro**:

```javascript
// En registro-tienda.html, modificar la llamada a registrarNuevoCliente:
const celular = document.getElementById('celular')?.value || null;

const resultado = await registrarNuevoCliente({
    email,
    password,
    nombreTienda,
    plan,
    celular  // ← NUEVO
});
```

### **Actualizar auth-system.js**:

```javascript
// En la función registrarNuevoCliente, agregar celular:
const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
        emailRedirectTo: redirectUrl,
        data: {
            nombre_tienda: nombreTienda,
            plan: plan,
            tipo_usuario: 'vendedor',
            celular: datos.celular  // ← NUEVO
        }
    }
});
```

---

## ⏰ Solución 3: Sesiones Persistentes (MUY IMPORTANTE)

### **Problema**: Las sesiones se cierran muy rápido

### **Causas Posibles**:

1. **autoRefreshToken** deshabilitado
2. **persistSession** deshabilitado
3. Timeout muy corto en Supabase
4. localStorage se limpia accidentalmente

---

### **Solución A: Configurar Supabase Client Correctamente**

#### **En `auth/supabase-config.js` o similar**:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://lvdgklwcgrmfbqwghxhl.supabase.co',
    anonKey: 'TU_ANON_KEY',
    
    // ✅ CONFIGURACIÓN PARA SESIONES PERSISTENTES
    auth: {
        autoRefreshToken: true,      // ← Auto-renovar token
        persistSession: true,         // ← Guardar sesión en localStorage
        detectSessionInUrl: true,     // ← Detectar sesión en URL (para emails)
        flowType: 'pkce',            // ← Más seguro
        
        // ✅ NUEVO: Storage personalizado para evitar limpieza
        storage: window.localStorage, // ← Usar localStorage explícitamente
        storageKey: 'cresalia-auth-token', // ← Key personalizada
        
        // ✅ NUEVO: Configuración de debug
        debug: false // true solo en desarrollo
    }
};

// Crear cliente con configuración mejorada
const supabaseClient = supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
        auth: SUPABASE_CONFIG.auth,
        global: {
            headers: {
                'x-client-info': 'cresalia-web/1.0'
            }
        }
    }
);
```

---

### **Solución B: Configurar en Supabase Dashboard**

#### **1. Ir a Supabase Dashboard**

1. Tu proyecto → **Authentication** → **Settings**
2. Buscar **"JWT expiry limit"**
3. **Cambiar de** 3600 (1 hora) **a** 604800 (7 días)

#### **2. Configurar Refresh Token Expiry**

1. En la misma sección
2. **"Refresh token rotation"** → ✅ **Enabled**
3. **"Refresh token reuse interval"** → 10 segundos

---

### **Solución C: Implementar Auto-Refresh Manual**

Si Supabase no renueva automáticamente, forzar renovación:

```javascript
// Agregar en todos los HTML principales
document.addEventListener('DOMContentLoaded', async function() {
    const supabase = initSupabase();
    
    if (!supabase) return;
    
    // Verificar sesión al cargar
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        console.log('✅ Sesión activa encontrada');
        
        // Renovar sesión cada 50 minutos (antes de que expire a 1 hora)
        setInterval(async () => {
            const { data, error } = await supabase.auth.refreshSession();
            
            if (error) {
                console.error('❌ Error renovando sesión:', error);
            } else {
                console.log('🔄 Sesión renovada automáticamente');
            }
        }, 50 * 60 * 1000); // 50 minutos
    }
    
    // Escuchar cambios de sesión
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔐 Estado de auth cambió:', event);
        
        if (event === 'SIGNED_OUT') {
            // Limpiar todo al cerrar sesión
            localStorage.removeItem('cresalia_sesion_activa');
            localStorage.removeItem('cresalia_session_token');
            localStorage.removeItem('cresalia_user_data');
            
            // Redirigir al login
            window.location.href = '/index-cresalia.html';
        }
        
        if (event === 'TOKEN_REFRESHED') {
            console.log('✅ Token renovado exitosamente');
        }
        
        if (event === 'SIGNED_IN') {
            console.log('✅ Usuario autenticado');
        }
    });
});
```

---

### **Solución D: Prevenir Limpieza Accidental de localStorage**

```javascript
// Proteger claves importantes de localStorage
(function protegerSesion() {
    const CLAVES_PROTEGIDAS = [
        'cresalia_sesion_activa',
        'cresalia_session_token',
        'cresalia_user_data',
        'cresalia-auth-token',
        'sb-' // Prefijo de Supabase
    ];
    
    // Backup original de clear
    const originalClear = localStorage.clear.bind(localStorage);
    
    // Sobrescribir clear para proteger claves
    localStorage.clear = function() {
        const respaldo = {};
        
        // Guardar claves protegidas
        CLAVES_PROTEGIDAS.forEach(clave => {
            Object.keys(localStorage).forEach(key => {
                if (key.includes(clave)) {
                    respaldo[key] = localStorage.getItem(key);
                }
            });
        });
        
        // Limpiar todo
        originalClear();
        
        // Restaurar claves protegidas
        Object.keys(respaldo).forEach(key => {
            localStorage.setItem(key, respaldo[key]);
        });
        
        console.log('🛡️ localStorage limpiado pero sesión protegida');
    };
})();
```

---

## 📋 Checklist de Implementación

### **Sesiones Persistentes**:
- [ ] Configurar `autoRefreshToken: true` en Supabase client
- [ ] Configurar `persistSession: true`
- [ ] Aumentar JWT expiry a 7 días en Dashboard
- [ ] Implementar auto-refresh manual cada 50 min
- [ ] Proteger localStorage de limpieza accidental

### **Logout**:
- [ ] Agregar función `cerrarSesion()` en auth-system.js
- [ ] Agregar botón de logout en admin-final.html
- [ ] Agregar botón de logout en otros paneles

### **Celular**:
- [ ] Agregar campo en registro-tienda.html
- [ ] Actualizar función registrarNuevoCliente
- [ ] Agregar columna en tabla (opcional)
- [ ] Permitir editar desde perfil

---

## 🧪 Cómo Probar Sesiones

1. **Registrarse o iniciar sesión**
2. **Esperar 1 hora** sin hacer nada
3. **Recargar la página** (F5)
4. **¿La sesión sigue activa?** ✅ = Funciona
5. **Verificar en Console** (F12):
   - ¿Aparece "🔄 Sesión renovada automáticamente"?
   - ¿Aparece "✅ Token renovado exitosamente"?

---

## 💡 Recomendación Final

**Orden de implementación**:

1. **PRIMERO**: Sesiones persistentes (el más importante para usuarios)
2. **SEGUNDO**: Botón de logout
3. **TERCERO**: Campo de celular

¿Querés que implemente estas soluciones ahora? 😊💜
