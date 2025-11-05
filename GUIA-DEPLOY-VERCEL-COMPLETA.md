# 🚀 GUÍA COMPLETA: DEPLOY Y CONFIGURACIÓN EN VERCEL

## 📋 **PASO A PASO COMPLETO**

---

## **PARTE 1: CREAR PROYECTO EN VERCEL**

### **1. Crear Nuevo Proyecto:**
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta
3. Haz clic en **"Add New..."** → **"Project"**
4. Conecta tu repositorio de GitHub (`Cresalia-Web`)
5. Selecciona el repositorio

### **2. Configuración del Proyecto:**
- **Framework Preset:** Other (o Static)
- **Root Directory:** `./` (raíz del proyecto)
- **Build Command:** (dejar vacío o `echo "No build needed"`)
- **Output Directory:** `./` (raíz del proyecto)
- **Install Command:** (dejar vacío)

### **3. Configurar Variables de Entorno:**
Antes de hacer deploy, configura estas variables:

---

## **PARTE 2: VARIABLES DE ENTORNO (IMPORTANTE)**

### **En Vercel Dashboard → Settings → Environment Variables:**

#### **🔐 SUPABASE:**
```
SUPABASE_URL=https://zbomxayytvwjbdzbegcw.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

#### **💳 MERCADO PAGO (si lo usas):**
```
MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_aqui
MERCADOPAGO_ENVIRONMENT=production
```

#### **🔑 ADMIN (opcional):**
```
ADMIN_PASSWORD=tu_contraseña_admin_aqui
```

**⚠️ IMPORTANTE:** 
- Marca todas como **"Production"**
- También puedes marcarlas para **"Preview"** y **"Development"** si quieres

---

## **PARTE 3: CONFIGURAR vercel.json**

Tu archivo `vercel.json` ya está configurado, pero verifica que tenga:

```json
{
  "version": 2,
  "buildCommand": "echo 'Static site - no build needed'",
  "outputDirectory": ".",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/",
      "destination": "/index-cresalia.html",
      "permanent": false
    }
  ],
  "rewrites": [
    {
      "source": "/webhook-mercadopago",
      "destination": "/api/webhook-mercadopago.js"
    },
    {
      "source": "/comunidades/(.*)/",
      "destination": "/comunidades/$1/index.html"
    },
    {
      "source": "/comunidades/(.*)",
      "destination": "/comunidades/$1/index.html"
    }
  ],
  "cleanUrls": false,
  "trailingSlash": false
}
```

---

## **PARTE 4: PROTEGER PÁGINAS ADMINISTRATIVAS**

### **Opción A: Protección con Variables de Entorno (Recomendado)**

Modifica tus páginas admin para verificar variables de entorno:

**Ejemplo para `panel-moderacion-chat-seguro.html`:**

Agrega esto al inicio del archivo (después de cargar los scripts):

```javascript
// Verificar acceso administrativo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay contraseña de admin configurada
    const adminPassword = prompt('Ingresa la contraseña de administrador:');
    
    // En producción, esto debería venir de variables de entorno
    const correctPassword = 'TU_CONTRASEÑA_ADMIN'; // O usar variable de entorno
    
    if (adminPassword !== correctPassword) {
        alert('Acceso denegado');
        window.location.href = '/index-cresalia.html';
        return;
    }
    
    // Continuar cargando el panel
});
```

### **Opción B: Protección con Middleware (Más Seguro)**

Crea un archivo `api/protect-admin.js`:

```javascript
export default function handler(req, res) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Continuar con la solicitud
    res.status(200).json({ message: 'Authorized' });
}
```

### **Opción C: Protección con Headers HTTP (Recomendado para Vercel)**

Agrega esto a `vercel.json` para proteger rutas específicas:

```json
{
  "headers": [
    {
      "source": "/panel-(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    },
    {
      "source": "/admin-(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ]
}
```

---

## **PARTE 5: CONFIGURAR ARCHIVOS DE CONFIGURACIÓN**

### **1. Crear config-supabase-seguro.js para Vercel:**

En Vercel, las variables de entorno están disponibles como `process.env.NOMBRE_VARIABLE`.

Necesitas crear un archivo que lea las variables de entorno. Opciones:

**Opción A: Usar Edge Functions (Recomendado)**

Crea `api/config-supabase.js`:

```javascript
export default function handler(req, res) {
    // Solo devolver la configuración si hay autenticación
    if (req.headers.authorization !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    res.json({
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY
        // NO devolver serviceRoleKey por seguridad
    });
}
```

**Opción B: Inyectar en el HTML (Menos seguro pero más simple)**

Modifica tus HTML para tener un script que lea las variables:

```html
<script>
    // Esto se inyecta en build time
    window.SUPABASE_CONFIG = {
        url: '%SUPABASE_URL%',
        anonKey: '%SUPABASE_ANON_KEY%'
    };
</script>
```

Y en `vercel.json`, agrega un build script que reemplace estos valores.

---

## **PARTE 6: PÁGINAS A PROTEGER**

### **Páginas que DEBEN estar protegidas:**
- ✅ `panel-master-cresalia.html`
- ✅ `panel-moderacion-chat-seguro.html`
- ✅ `panel-moderacion-foro-comunidades.html`
- ✅ `panel-gestion-alertas-global.html`
- ✅ `panel-auditoria.html`
- ✅ `admin-cresalia.html`
- ✅ `tiendas/ejemplo-tienda/admin-final.html` (y otros admin de tiendas)

### **Páginas PÚBLICAS (no proteger):**
- ✅ `index-cresalia.html`
- ✅ `landing-cresalia-DEFINITIVO.html`
- ✅ `cresalia-chat-seguro/index.html`
- ✅ `comunidades/*/index.html`
- ✅ `cresalia-jobs/index.html`
- ✅ `cresalia-animales/index.html`

---

## **PARTE 7: PASOS DESPUÉS DEL DEPLOY**

### **1. Verificar que funciona:**
- ✅ Abre tu URL de Vercel
- ✅ Verifica que la página principal carga
- ✅ Verifica que las rutas funcionan

### **2. Probar conexión con Supabase:**
- ✅ Abre cualquier página que use Supabase
- ✅ Abre la consola del navegador (F12)
- ✅ Verifica que no haya errores de conexión

### **3. Probar páginas protegidas:**
- ✅ Intenta acceder a un panel admin
- ✅ Verifica que pida autenticación
- ✅ Verifica que funcione correctamente

### **4. Verificar variables de entorno:**
- ✅ En Vercel Dashboard → Settings → Environment Variables
- ✅ Verifica que todas estén configuradas
- ✅ Verifica que estén marcadas para "Production"

---

## **PARTE 8: CONFIGURACIÓN ADICIONAL**

### **1. Dominio Personalizado (Opcional):**
1. En Vercel Dashboard → Settings → Domains
2. Agrega tu dominio
3. Configura los DNS según las instrucciones

### **2. HTTPS (Automático):**
- ✅ Vercel proporciona HTTPS automáticamente
- ✅ No necesitas configuración adicional

### **3. Analytics (Opcional):**
- ✅ Vercel Analytics está disponible
- ✅ Puedes activarlo en Settings → Analytics

---

## **PARTE 9: CHECKLIST FINAL**

Antes de considerar el deploy completo:

- [ ] Proyecto creado en Vercel
- [ ] Repositorio conectado
- [ ] Variables de entorno configuradas
- [ ] `vercel.json` configurado correctamente
- [ ] Páginas admin protegidas
- [ ] Deploy realizado
- [ ] URL funcionando
- [ ] Conexión con Supabase funcionando
- [ ] Páginas protegidas funcionando
- [ ] Variables de entorno accesibles

---

## **PARTE 10: SOLUCIÓN DE PROBLEMAS**

### **Error: "Variables de entorno no encontradas"**
- ✅ Verifica que estén en Vercel Dashboard → Settings → Environment Variables
- ✅ Verifica que estén marcadas para "Production"
- ✅ Haz un nuevo deploy después de agregar variables

### **Error: "Página no encontrada"**
- ✅ Verifica las rutas en `vercel.json`
- ✅ Verifica que los archivos existan
- ✅ Verifica los `rewrites` y `redirects`

### **Error: "Conexión con Supabase fallida"**
- ✅ Verifica que las variables de entorno estén correctas
- ✅ Verifica que `config-supabase-seguro.js` esté leyendo las variables
- ✅ Verifica la consola del navegador para errores específicos

---

## **💜 RECUERDA:**

> **"La seguridad es primero. Protege tus paneles admin y nunca expongas claves en el código."**

---

**Cuando estés lista para hacer el deploy, avísame y te ayudo paso a paso en tiempo real. 💜**

**💜 Creado con cuidado y preocupación por tu seguridad - Crisla & Claude**

