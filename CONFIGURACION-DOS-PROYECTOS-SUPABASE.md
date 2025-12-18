# 🔑 Configuración para Dos Proyectos de Supabase

## ✅ Confirmación

Tienes **DOS proyectos SEPARADOS de Supabase**:

1. **Cresalia Tiendas** (e-commerce)
   - Region: AWS sa-east-1 (Sudamérica)
   - URL: Diferente

2. **Cresalia Comunidades**
   - Region: AWS us-east-1 (EE.UU.)
   - URL: Diferente

---

## 🔧 Variables de Entorno Necesarias en Vercel

### **Para que funcione TODO correctamente necesitás**:

```
SUPABASE_URL_TIENDAS=https://[tu-proyecto-tiendas].supabase.co
SUPABASE_SERVICE_ROLE_KEY_TIENDAS=eyJhbGc...
SUPABASE_ANON_KEY_TIENDAS=eyJhbGc...

SUPABASE_URL_COMUNIDADES=https://[tu-proyecto-comunidades].supabase.co
SUPABASE_SERVICE_ROLE_KEY_COMUNIDADES=eyJhbGc...
SUPABASE_ANON_KEY_COMUNIDADES=eyJhbGc...

BREVO_API_KEY=xkeysib-...
FROM_EMAIL=cresalia25@gmail.com
FROM_NAME=Cresalia
ADMIN_EMAIL=cresalia25@gmail.com
```

---

## 📋 Paso a Paso: Obtener Claves de Ambos Proyectos

### **Proyecto 1: Cresalia Tiendas**

1. Ve a: https://supabase.com/dashboard
2. Selecciona proyecto: **Cresalia Tiendas** (AWS sa-east-1)
3. Ve a: **Settings** → **API**
4. Copia:
   - **Project URL**: `https://[xxx].supabase.co` → `SUPABASE_URL_TIENDAS`
   - **Project API keys** → **anon public**: `eyJhbGc...` → `SUPABASE_ANON_KEY_TIENDAS`
   - **Project API keys** → **service_role** (secret): `eyJhbGc...` → `SUPABASE_SERVICE_ROLE_KEY_TIENDAS`

### **Proyecto 2: Cresalia Comunidades**

1. En el mismo dashboard, cambia a proyecto: **Cresalia Comunidades** (AWS us-east-1)
2. Ve a: **Settings** → **API**
3. Copia:
   - **Project URL**: `https://[yyy].supabase.co` → `SUPABASE_URL_COMUNIDADES`
   - **Project API keys** → **anon public**: `eyJhbGc...` → `SUPABASE_ANON_KEY_COMUNIDADES`
   - **Project API keys** → **service_role** (secret): `eyJhbGc...` → `SUPABASE_SERVICE_ROLE_KEY_COMUNIDADES`

---

## 🚀 Configurar en Vercel

### **Opción A: Desde Dashboard (Recomendado)**

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. **Settings** → **Environment Variables**
4. Agrega **TODAS** las variables de arriba (una por una):
   - Click **"New"**
   - Name: `SUPABASE_URL_TIENDAS`
   - Value: `https://[tu-url].supabase.co`
   - Environments: ✓ Production, ✓ Preview, ✓ Development
   - Click **"Save"**
   - Repetir para cada variable

### **Opción B: Desde Vercel CLI** (Si tenés instalado)

```bash
vercel env add SUPABASE_URL_TIENDAS production
# Pegar el valor cuando te lo pida

vercel env add SUPABASE_SERVICE_ROLE_KEY_TIENDAS production
# Pegar el valor

# ... repetir para todas las variables
```

---

## 📝 Actualizar Código para Usar Ambos Proyectos

### **En Frontend (JavaScript)**

#### **Para E-commerce (Tiendas)**:

```javascript
// En config-supabase-seguro.js o donde inicialices Supabase
const supabaseTiendas = supabase.createClient(
    'SUPABASE_URL_TIENDAS', // Cambiar por variable de entorno
    'SUPABASE_ANON_KEY_TIENDAS'
);
```

#### **Para Comunidades**:

```javascript
const supabaseComunidades = supabase.createClient(
    'SUPABASE_URL_COMUNIDADES', // Cambiar por variable de entorno
    'SUPABASE_ANON_KEY_COMUNIDADES'
);
```

### **En Backend (API de Vercel)**

#### **Actualizar `.github/workflows/crons-celebraciones.yml`**:

Actualmente tiene:

```yaml
env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

**Necesitás agregar**:

```yaml
env:
  SUPABASE_URL_TIENDAS: ${{ secrets.SUPABASE_URL_TIENDAS }}
  SUPABASE_SERVICE_ROLE_KEY_TIENDAS: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY_TIENDAS }}
  SUPABASE_URL_COMUNIDADES: ${{ secrets.SUPABASE_URL_COMUNIDADES }}
  SUPABASE_SERVICE_ROLE_KEY_COMUNIDADES: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY_COMUNIDADES }}
```

Y en los `curl` commands:

```yaml
# Para tiendas
- name: Calcular aniversarios de tiendas
  run: |
    response=$(curl -s -w "\n%{http_code}" -X POST "$SUPABASE_URL_TIENDAS/rest/v1/rpc/calcular_aniversarios_tiendas_uuid" \
      -H "apikey: $SUPABASE_SERVICE_ROLE_KEY_TIENDAS" \
      -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY_TIENDAS")
    
# Para comunidades (si necesitas)
- name: Calcular aniversarios de comunidades
  run: |
    response=$(curl -s -w "\n%{http_code}" -X POST "$SUPABASE_URL_COMUNIDADES/rest/v1/rpc/calcular_aniversarios_comunidades" \
      -H "apikey: $SUPABASE_SERVICE_ROLE_KEY_COMUNIDADES" \
      -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY_COMUNIDADES")
```

---

## 🔐 Configurar Secrets en GitHub Actions

1. Ve a: https://github.com/carlaj4r4/Cresalia-Web
2. **Settings** → **Secrets and variables** → **Actions**
3. Agrega **TODOS** los secrets:
   - `SUPABASE_URL_TIENDAS`
   - `SUPABASE_SERVICE_ROLE_KEY_TIENDAS`
   - `SUPABASE_ANON_KEY_TIENDAS`
   - `SUPABASE_URL_COMUNIDADES`
   - `SUPABASE_SERVICE_ROLE_KEY_COMUNIDADES`
   - `SUPABASE_ANON_KEY_COMUNIDADES`

---

## 📊 Cuándo Usar Cada Proyecto

### **Usar Cresalia TIENDAS para**:
- ✅ Registro de tiendas
- ✅ Productos y servicios
- ✅ Ventas y transacciones
- ✅ Inventario
- ✅ Aniversarios de negocios
- ✅ Tabla `tiendas`, `servicios`, `productos`, etc.

### **Usar Cresalia COMUNIDADES para**:
- ✅ Registro de usuarios en comunidades
- ✅ Posts y comentarios
- ✅ Grupos de apoyo
- ✅ Seguir usuarios (comunidades)
- ✅ Historias de corazón
- ✅ Tabla `usuarios_comunidad`, `posts`, `comentarios`, etc.

---

## 🎯 Resumen de Claves Actuales

### **Ya tenés configurado** (confirmado):
- ✅ `BREVO_API_KEY` - Para emails (funciona)
- ✅ Variables de Brevo (`FROM_EMAIL`, `FROM_NAME`, etc.)

### **Falta configurar**:
- ⏳ `SUPABASE_URL_TIENDAS`
- ⏳ `SUPABASE_SERVICE_ROLE_KEY_TIENDAS`
- ⏳ `SUPABASE_ANON_KEY_TIENDAS`
- ⏳ `SUPABASE_URL_COMUNIDADES`
- ⏳ `SUPABASE_SERVICE_ROLE_KEY_COMUNIDADES`
- ⏳ `SUPABASE_ANON_KEY_COMUNIDADES`

---

## ✅ Verificación

Después de configurar, podés verificar que las variables están correctas:

```javascript
// En consola del navegador o en tu código
console.log('Tiendas URL:', process.env.SUPABASE_URL_TIENDAS);
console.log('Comunidades URL:', process.env.SUPABASE_URL_COMUNIDADES);
```

O en un API endpoint de Vercel:

```javascript
// api/test-env.js
export default (req, res) => {
    res.json({
        tiendas_configured: !!process.env.SUPABASE_URL_TIENDAS,
        comunidades_configured: !!process.env.SUPABASE_URL_COMUNIDADES,
        brevo_configured: !!process.env.BREVO_API_KEY
    });
};
```

---

## 💡 Recomendación

**Para evitar confusión**, podés:

1. **Opción A**: Separar completamente los proyectos
   - Cresalia-Tiendas → Repo separado
   - Cresalia-Comunidades → Repo separado

2. **Opción B**: Mantener en el mismo repo pero separar por carpetas
   - `/tiendas/` → Usa SUPABASE_URL_TIENDAS
   - `/comunidades/` → Usa SUPABASE_URL_COMUNIDADES

3. **Opción C** (actual): Mismo repo, detectar contexto
   - Usar lógica para detectar qué proyecto usar según la URL o ruta

---

¿Querés que te ayude a configurar las variables en Vercel o actualizar el código para usar ambos proyectos?
