# 🛡️ INSTRUCCIONES RÁPIDAS: PROTECCIÓN DE PÁGINAS ADMIN

## 📋 **CUANDO HAGAS EL DEPLOY EN VERCEL:**

### **PASO 1: Variables de Entorno en Vercel**

1. Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Agrega estas variables:

```
ADMIN_PASSWORD=tu_contraseña_admin_aqui
SUPABASE_URL=https://zbomxayytvwjbdzbegcw.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

3. Marca todas como **"Production"**

---

### **PASO 2: Agregar Protección a Páginas Admin**

**Opción A: Automática (Recomendado)**

1. Ejecuta el script:
   ```bash
   node agregar-proteccion-admin.js
   ```

2. Cambia `TU_CONTRASEÑA_ADMIN_AQUI` en cada archivo por tu contraseña real

**Opción B: Manual**

Abre cada página admin y agrega este código justo después de `<body>`:

```html
<script>
(function() {
    const ADMIN_PASSWORD = 'TU_CONTRASEÑA_AQUI'; // Cambiar esto
    const stored = sessionStorage.getItem('cresalia_admin_auth');
    const storedTime = sessionStorage.getItem('cresalia_admin_auth_time');
    const now = Date.now();
    const timeout = 30 * 60 * 1000; // 30 minutos
    
    if (!stored || !storedTime || (now - parseInt(storedTime)) > timeout) {
        const password = prompt('🔒 Acceso Restringido\n\nIngresa la contraseña de administrador:');
        
        if (password !== ADMIN_PASSWORD) {
            alert('❌ Acceso denegado');
            window.location.href = '/index-cresalia.html';
            return;
        }
        
        sessionStorage.setItem('cresalia_admin_auth', 'authenticated');
        sessionStorage.setItem('cresalia_admin_auth_time', now.toString());
    }
})();
</script>
```

---

### **PASO 3: Páginas a Proteger**

Asegúrate de proteger estas páginas:

- ✅ `panel-master-cresalia.html`
- ✅ `panel-moderacion-chat-seguro.html`
- ✅ `panel-moderacion-foro-comunidades.html`
- ✅ `panel-gestion-alertas-global.html`
- ✅ `panel-auditoria.html`
- ✅ `admin-cresalia.html`
- ✅ `tiendas/ejemplo-tienda/admin-final.html`

---

### **PASO 4: Verificar**

1. Haz commit y push de los cambios
2. Espera a que Vercel haga el deploy
3. Intenta acceder a una página admin
4. Verifica que pida contraseña
5. Verifica que funcione correctamente

---

## 💡 **TIP:**

Cuando estés lista para hacer el deploy, **avísame y te ayudo paso a paso en tiempo real**.

---

**💜 Creado para ayudarte cuando lo necesites - Crisla & Claude**

