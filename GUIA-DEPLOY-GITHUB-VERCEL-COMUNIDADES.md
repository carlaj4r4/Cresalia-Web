# 🚀 Guía Completa: Subir Comunidades a GitHub y Vercel

## 📋 Paso a Paso

### Parte 1: GitHub

#### Paso 1: Inicializar Git (si no lo hiciste)
```bash
cd C:\Users\carla\Cresalia-Web
git init
```

#### Paso 2: Crear archivo .gitignore (si no existe)
Crea un archivo `.gitignore` en la raíz con:
```
node_modules/
.env
.env.local
.DS_Store
*.log
config-privado.js
```

#### Paso 3: Agregar todos los archivos
```bash
git add .
```

#### Paso 4: Hacer commit inicial
```bash
git commit -m "Agregar comunidades de apoyo Cresalia"
```

#### Paso 5: Conectar con GitHub
1. Ve a https://github.com
2. Crea un nuevo repositorio (ej: `Cresalia-Web`)
3. **NO** inicialices con README (ya tenés archivos)
4. Copia la URL del repo (ej: `https://github.com/tu-usuario/Cresalia-Web.git`)

#### Paso 6: Conectar repositorio local con GitHub
```bash
git remote add origin https://github.com/tu-usuario/Cresalia-Web.git
git branch -M main
git push -u origin main
```

---

### Parte 2: Vercel

#### Paso 1: Instalar Vercel CLI (opcional, también podés usar la web)
```bash
npm install -g vercel
```

#### Paso 2: Login en Vercel
```bash
vercel login
```

#### Paso 3: Deploy desde carpeta
```bash
cd C:\Users\carla\Cresalia-Web
vercel
```

**O usar la interfaz web:**
1. Ve a https://vercel.com
2. Sign up/Login con GitHub
3. Click en "Add New Project"
4. Importa tu repositorio de GitHub
5. Vercel detectará automáticamente la configuración

---

## ⚙️ Configuración de Vercel

### Opción A: Usar vercel.json (ya existe)

Tu `vercel.json` actual debería funcionar. Déjame verificar que esté correcto.

### Opción B: Configuración automática

Vercel detecta automáticamente:
- Archivos HTML estáticos
- Estructura de carpetas
- Enlaces relativos

---

## 🔗 ¿Funcionarán los Enlaces del Footer?

### ✅ **SÍ, funcionarán perfectamente**

**¿Por qué?**

Los enlaces en el footer probablemente sean así:
```html
<a href="comunidades/estres-laboral/index.html">Estrés Laboral</a>
<a href="comunidades/mujeres-sobrevivientes/index.html">Mujeres Sobrevivientes</a>
```

**En Vercel:**
- ✅ Las rutas relativas funcionan igual
- ✅ `comunidades/estres-laboral/index.html` → `tudominio.com/comunidades/estres-laboral/`
- ✅ `comunidades/mujeres-sobrevivientes/index.html` → `tudominio.com/comunidades/mujeres-sobrevivientes/`

**Ejemplo:**
- **Local:** `file:///C:/Users/carla/Cresalia-Web/comunidades/estres-laboral/index.html`
- **Vercel:** `https://tu-proyecto.vercel.app/comunidades/estres-laboral/`

**¡Funciona igual!** 🎉

---

## 📁 Estructura en Vercel

```
https://tu-proyecto.vercel.app/
├── index-cresalia.html (página principal)
├── comunidades/
│   ├── estres-laboral/
│   │   └── index.html ✅
│   ├── mujeres-sobrevivientes/
│   │   └── index.html ✅
│   ├── hombres-sobrevivientes/
│   │   └── index.html ✅
│   └── ... (todas las demás)
```

---

## ⚠️ Importante: Rutas Relativas

### ✅ **Lo que YA está bien:**

**Desde `index-cresalia.html`:**
```html
<a href="comunidades/estres-laboral/index.html">✅</a>
```

**Desde dentro de una comunidad (`comunidades/estres-laboral/index.html`):**
```html
<script src="../../config-supabase-seguro.js">✅</script>
<link href="../../favicon.ico">✅</link>
```

### ✅ **Todo funciona en Vercel**

---

## 🔐 Seguridad y Privacidad

### Lo que NO subir a GitHub:

**Crear/verificar `.gitignore`:**
```
config-privado.js          ← NO subir
*.env                      ← NO subir
config-supabase-seguro.js  ← ⚠️ Este SÍ (pero sin keys reales)
```

**En `config-supabase-seguro.js`:**
- ✅ URL de Supabase: SÍ (es pública)
- ✅ anonKey: SÍ (es pública, para frontend)
- ❌ serviceRoleKey: NO (es privada, solo backend)

---

## 🎯 Checklist Pre-Deploy

Antes de subir, verifica:

- [ ] `.gitignore` incluye archivos privados
- [ ] `config-supabase-seguro.js` no tiene `serviceRoleKey` real
- [ ] Todas las rutas relativas funcionan localmente
- [ ] Links del footer apuntan correctamente
- [ ] Favicons cargan bien
- [ ] Scripts de Supabase apuntan a rutas relativas correctas

---

## 🚀 Deploy Rápido (Comandos)

```bash
# 1. Verificar estado
git status

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "Agregar comunidades de apoyo"

# 4. Push a GitHub
git push origin main

# 5. Deploy en Vercel (si usás CLI)
vercel --prod

# O conectá GitHub a Vercel (más fácil) y hace deploy automático
```

---

## 📝 Variables de Entorno en Vercel (Opcional)

Si necesitás variables privadas:

1. En Vercel Dashboard → Project → Settings → Environment Variables
2. Agregá:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - etc.

---

## 💡 Tips

### 1. **Deploy Automático**
Conectá GitHub a Vercel → cada push hace deploy automático ✅

### 2. **Preview Deploys**
Cada pull request genera un preview URL para probar antes ✅

### 3. **Dominio Personalizado**
Después podés agregar tu dominio propio en Vercel Settings ✅

---

## ❓ Preguntas Frecuentes

### **¿Los enlaces del footer funcionarán?**
✅ **SÍ**, siempre que sean rutas relativas (como `comunidades/...`)

### **¿Necesito cambiar algo en el código?**
❌ **NO**, las rutas relativas funcionan igual en Vercel

### **¿Se verán las keys de Supabase?**
⚠️ **Sí, pero es normal**: `anonKey` es pública y segura para frontend. `serviceRoleKey` NO debe subirse.

### **¿Puedo hacer cambios después?**
✅ **SÍ**, cada push a GitHub hace deploy automático en Vercel

---

**¿Querés que te guíe paso a paso mientras lo hacés, o preferís intentarlo primero y preguntar si algo no funciona?** 💜

Tu co-fundador que te acompaña en cada paso,

Claude 💜✨

