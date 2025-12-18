# 🔧 Configurar TEST-EDGE-FUNCTION.html

## ⚠️ Necesitás Editar el Archivo Primero

El archivo `TEST-EDGE-FUNCTION.html` necesita las URLs y Anon Keys de **ambos** proyectos de Supabase.

---

## 📋 PASO 1: Obtener las URLs y Keys

### **Proyecto 1: Cresalia (Tiendas)**

1. Ir a: https://supabase.com/dashboard
2. Seleccionar proyecto **"Cresalia"**
3. Settings → API
4. Copiar:
   - **Project URL**: `https://lvdgklwcgrmfbqwghxhl.supabase.co`
   - **anon public**: `eyJ...` (una key MUY larga)

### **Proyecto 2: Cresalia Comunidades**

1. En el mismo dashboard, cambiar de proyecto
2. Seleccionar **"Cresalia Comunidades"**
3. Settings → API
4. Copiar:
   - **Project URL**: `https://[TU_ID].supabase.co`
   - **anon public**: `eyJ...` (otra key diferente)

---

## 📋 PASO 2: Editar TEST-EDGE-FUNCTION.html

1. **Abrir archivo**: `TEST-EDGE-FUNCTION.html` en tu editor
2. **Buscar** (Ctrl + F): `PROYECTOS`
3. **Verás esto**:

```javascript
const PROYECTOS = {
    tiendas: {
        nombre: 'Cresalia (Tiendas)',
        url: 'https://lvdgklwcgrmfbqwghxhl.supabase.co',
        anonKey: 'TU_ANON_KEY_TIENDAS' // Reemplazar
    },
    comunidades: {
        nombre: 'Cresalia Comunidades',
        url: 'https://TU_URL_COMUNIDADES.supabase.co', // Reemplazar
        anonKey: 'TU_ANON_KEY_COMUNIDADES' // Reemplazar
    }
};
```

4. **Reemplazar**:
   - En `tiendas` → `anonKey`: Pegar la anon key del proyecto Tiendas
   - En `comunidades` → `url`: Pegar la URL del proyecto Comunidades
   - En `comunidades` → `anonKey`: Pegar la anon key del proyecto Comunidades

5. **Guardar el archivo**

---

## 📋 PASO 3: Abrir en el Navegador

1. Abrir `TEST-EDGE-FUNCTION.html` en el navegador
2. Deberías ver:
   - Selector de proyecto (Tiendas / Comunidades)
   - Botones de prueba
   - Log vacío

---

## 🎯 PASO 4: Probar

### **Probar en Comunidades** (Recomendado)

1. Click en botón **"🤝 Comunidades"**
2. Click en **"👥 Ver Usuarios Registrados"**
   - ¿Hay usuarios? ✅ Seguir
   - ¿NO hay usuarios? ⚠️ Ejecutar `SUPABASE-UBICACIONES-USUARIOS-ALERTAS.sql` primero

3. Click en **"➕ Crear Alerta de Prueba"**
4. Esperar a que termine
5. Ver el resultado en el log

### **Probar en Tiendas** (Opcional)

1. Click en botón **"🏪 Tiendas"**
2. Repetir los mismos pasos

---

## ❓ ¿Dónde Están las Anon Keys?

### **Método A: Desde Supabase Dashboard**

1. Supabase Dashboard
2. Tu proyecto
3. **Settings** (rueda en la barra lateral)
4. **API**
5. Buscar: **"anon" "public"**
6. Click en el ícono de copiar 📋

### **Método B: Desde Vercel (si las configuraste ahí)**

1. Vercel Dashboard
2. Tu proyecto
3. Settings → Environment Variables
4. Buscar variables que empiecen con `SUPABASE_`
5. NOTA: Vercel oculta los valores con `***`, pero si las pusiste ahí originalmente, podrías editarlas para verlas

---

## 🚨 NO Commitear con las Keys

**IMPORTANTE**: NO hagas `git add` ni `git commit` del archivo `TEST-EDGE-FUNCTION.html` después de poner las keys reales.

```bash
# Ignorar cambios locales
git update-index --skip-worktree TEST-EDGE-FUNCTION.html
```

O mejor: **usa la versión deployada** en `https://cresalia.com/TEST-EDGE-FUNCTION.html` (si pusheamos la versión con placeholders)

---

## 💡 Alternativa: Test Manual sin el HTML

Si no querés editar el archivo, podés probar directamente en la consola del navegador:

```javascript
// 1. Ir a tu sitio: https://cresalia.com
// 2. Abrir DevTools (F12)
// 3. Console
// 4. Pegar esto:

const SUPABASE_URL_COMUNIDADES = 'https://TU_URL.supabase.co';
const SUPABASE_ANON_KEY_COMUNIDADES = 'eyJTU_KEY_LARGA...';

const client = supabase.createClient(SUPABASE_URL_COMUNIDADES, SUPABASE_ANON_KEY_COMUNIDADES);

// Ver usuarios registrados
const { data: usuarios } = await client
    .from('usuarios_ubicaciones_alertas')
    .select('*');
console.log('Usuarios:', usuarios);

// Ver alertas
const { data: alertas } = await client
    .from('alertas_emergencia_comunidades')
    .select('*')
    .limit(5);
console.log('Alertas:', alertas);

// Probar Edge Function
fetch(`${SUPABASE_URL_COMUNIDADES}/functions/v1/enviar-emails-alerta`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY_COMUNIDADES}`
    },
    body: JSON.stringify({ alerta_id: 1 })
})
.then(r => r.json())
.then(data => console.log('Resultado:', data));
```

---

¿Necesitás ayuda para encontrar las Anon Keys? 😊
