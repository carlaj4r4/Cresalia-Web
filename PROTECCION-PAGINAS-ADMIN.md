# 🛡️ PROTECCIÓN DE PÁGINAS ADMINISTRATIVAS

## 📋 **LISTA DE PÁGINAS A PROTEGER:**

### **Páginas Administrativas Principales:**
1. ✅ `panel-master-cresalia.html` - Panel master
2. ✅ `panel-moderacion-chat-seguro.html` - Moderación de chat
3. ✅ `panel-moderacion-foro-comunidades.html` - Moderación de foros
4. ✅ `panel-gestion-alertas-global.html` - Gestión de alertas
5. ✅ `panel-auditoria.html` - Auditoría
6. ✅ `admin-cresalia.html` - Admin principal
7. ✅ `tiendas/ejemplo-tienda/admin-final.html` - Admin de tienda

---

## 🔒 **MÉTODO RECOMENDADO: PROTECCIÓN CON PASSWORD**

### **Implementación Simple:**

Agrega este código al inicio de cada página admin (después de `<body>`):

```html
<script>
// Protección de página admin
(function() {
    // Verificar si ya está autenticado
    const authKey = sessionStorage.getItem('cresalia_admin_auth');
    const authTimestamp = sessionStorage.getItem('cresalia_admin_auth_time');
    
    // Verificar si la sesión expiró (30 minutos)
    const now = Date.now();
    const sessionTimeout = 30 * 60 * 1000; // 30 minutos
    
    if (!authKey || !authTimestamp || (now - parseInt(authTimestamp)) > sessionTimeout) {
        // Pedir contraseña
        const password = prompt('🔒 Acceso Restringido\n\nIngresa la contraseña de administrador:');
        
        // En producción, esto debería venir de una variable de entorno
        // Por ahora, usa una contraseña configurada
        const correctPassword = 'TU_CONTRASEÑA_ADMIN_AQUI'; // Cambiar esto
        
        if (password !== correctPassword) {
            alert('❌ Acceso denegado. Redirigiendo...');
            window.location.href = '/index-cresalia.html';
            return;
        }
        
        // Guardar autenticación
        sessionStorage.setItem('cresalia_admin_auth', 'authenticated');
        sessionStorage.setItem('cresalia_admin_auth_time', now.toString());
    }
})();
</script>
```

---

## 🔐 **MÉTODO AVANZADO: CON VARIABLES DE ENTORNO**

### **Para Vercel:**

1. **Crea un archivo `api/auth-admin.js`:**

```javascript
export default function handler(req, res) {
    const { password } = req.body;
    
    if (password === process.env.ADMIN_PASSWORD) {
        // Generar token JWT simple
        const token = Buffer.from(Date.now().toString()).toString('base64');
        
        res.status(200).json({
            success: true,
            token: token,
            expires: Date.now() + (30 * 60 * 1000) // 30 minutos
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Contraseña incorrecta'
        });
    }
}
```

2. **Modifica tus páginas admin para usar este endpoint:**

```javascript
async function verificarAuth() {
    const token = sessionStorage.getItem('cresalia_admin_token');
    const expires = sessionStorage.getItem('cresalia_admin_expires');
    
    if (!token || !expires || Date.now() > parseInt(expires)) {
        const password = prompt('🔒 Ingresa la contraseña de administrador:');
        
        if (!password) {
            window.location.href = '/index-cresalia.html';
            return false;
        }
        
        try {
            const response = await fetch('/api/auth-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                sessionStorage.setItem('cresalia_admin_token', data.token);
                sessionStorage.setItem('cresalia_admin_expires', data.expires.toString());
                return true;
            } else {
                alert('❌ Contraseña incorrecta');
                window.location.href = '/index-cresalia.html';
                return false;
            }
        } catch (error) {
            console.error('Error de autenticación:', error);
            alert('❌ Error al verificar autenticación');
            window.location.href = '/index-cresalia.html';
            return false;
        }
    }
    
    return true;
}

// Llamar al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    if (!(await verificarAuth())) {
        return; // Detener carga si no está autenticado
    }
    
    // Continuar cargando el panel normalmente
});
```

---

## 🎯 **IMPLEMENTACIÓN RÁPIDA (SIN BACKEND):**

### **Para páginas que no necesitan backend:**

Agrega esto al inicio de cada página admin:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- ... head ... -->
</head>
<body>
    <script>
        // Protección simple
        (function() {
            const ADMIN_PASSWORD = 'TU_CONTRASEÑA_AQUI'; // Cambiar esto
            
            const stored = sessionStorage.getItem('admin_authenticated');
            const storedTime = sessionStorage.getItem('admin_auth_time');
            const now = Date.now();
            const timeout = 30 * 60 * 1000; // 30 minutos
            
            if (!stored || !storedTime || (now - parseInt(storedTime)) > timeout) {
                const password = prompt('🔒 Acceso Restringido\n\nIngresa la contraseña de administrador:');
                
                if (password !== ADMIN_PASSWORD) {
                    alert('❌ Acceso denegado');
                    window.location.href = '/index-cresalia.html';
                    return;
                }
                
                sessionStorage.setItem('admin_authenticated', 'true');
                sessionStorage.setItem('admin_auth_time', now.toString());
            }
        })();
    </script>
    
    <!-- Resto del contenido de la página -->
</body>
</html>
```

---

## 📝 **CHECKLIST DE IMPLEMENTACIÓN:**

Para cada página admin:

- [ ] Agregar script de protección al inicio
- [ ] Configurar contraseña (o usar variable de entorno)
- [ ] Probar que pida contraseña al acceder
- [ ] Probar que rechace contraseña incorrecta
- [ ] Probar que redirija a página principal si falla
- [ ] Probar que mantenga sesión por 30 minutos
- [ ] Probar que expire después de 30 minutos

---

## 🔄 **ACTUALIZAR TODAS LAS PÁGINAS:**

### **Script para agregar protección automáticamente:**

Puedo crear un script que agregue la protección a todas las páginas admin automáticamente. ¿Quieres que lo haga?

---

## 💜 **RECUERDA:**

> **"La seguridad es primero. Protege tus paneles admin siempre."**

---

**Cuando estés lista para implementar esto, avísame y te ayudo a agregarlo a cada página. 💜**

**💜 Creado para proteger tu plataforma - Crisla & Claude**

