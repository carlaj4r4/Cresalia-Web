# 💜 Guía Rápida Paso a Paso - Para Carla

## 🎯 Lo que Necesitás Hacer

### ✅ PASO 1: Ejecutar SQL en Supabase (2 minutos)

1. **Abrir Supabase:**
   - Ve a: https://app.supabase.com
   - Iniciá sesión
   - Seleccioná tu proyecto

2. **Abrir SQL Editor:**
   - Menú izquierdo → Click en **"SQL Editor"**
   - Click en **"New query"**

3. **Copiar SQL:**
   - Abrí el archivo: `supabase-alertas-emergencia-comunidades.sql`
   - Seleccioná TODO (Ctrl+A)
   - Copiá (Ctrl+C)

4. **Pegar y Ejecutar:**
   - Pegá en el SQL Editor (Ctrl+V)
   - Click en **"Run"** o presiona Ctrl+Enter

5. **Verificar:**
   - Menú izquierdo → **"Table Editor"**
   - Buscá: `alertas_emergencia_comunidades`
   - Si la ves, ¡funcionó! ✅

---

### ✅ PASO 2: Agregar Scripts en Comunidades

**Solo necesitás agregar 2 líneas en cada comunidad.**

#### Para cada comunidad (`comunidades/[nombre]/index.html`):

**1. Buscar donde están los scripts** (cerca del final, antes de `</body>`)

**2. Agregar esta línea:**
```html
<script src="../../js/sistema-alertas-comunidades.js"></script>
```

**3. En la inicialización, agregar:**
```javascript
let alertasComunidad;
// ... (dentro de DOMContentLoaded)
alertasComunidad = new SistemaAlertasComunidades('NOMBRE-COMUNIDAD');
window.alertasComunidad = alertasComunidad;
```

**Lista de comunidades:**
- `estres-laboral` ✅ (ya está hecho)
- `mujeres-sobrevivientes` → usar `'mujeres-sobrevivientes'`
- `hombres-sobrevivientes` → usar `'hombres-sobrevivientes'`
- `lgbtq-experiencias` → usar `'lgbtq-experiencias'`
- `anti-bullying` → usar `'anti-bullying'`
- `discapacidad` → usar `'discapacidad'`
- `inmigrantes-racializados` → usar `'inmigrantes-racializados'`
- `adultos-mayores` → usar `'adultos-mayores'`
- `cuidadores` → usar `'cuidadores'`
- `enfermedades-cronicas` → usar `'enfermedades-cronicas'`

---

### ✅ PASO 3: Probar

#### Probar Alertas:
1. Abrí una comunidad en tu navegador
2. Supabase → Table Editor → `alertas_emergencia_comunidades` → Insert row
3. Completá:
   - `tipo`: `inundacion`
   - `titulo`: `Prueba de alerta`
   - `descripcion`: `Esta es una alerta de prueba`
   - `severidad`: `media`
   - `activa`: ✅ (marcar)
4. Save → Recargar página
5. **¡Deberías ver la alerta arriba!** ✅

#### Probar Notificaciones:
1. Abrí una comunidad
2. El navegador pedirá permisos → **"Permitir"**
3. Publicá un post
4. En otra ventana, comentá en ese post
5. **¡Deberías recibir notificación!** ✅

#### Probar PWA:
1. Abrí una comunidad en celular (Chrome)
2. Menú (3 puntos) → **"Agregar a pantalla de inicio"**
3. **¡Se instaló!** ✅

---

## ❓ Si Algo No Funciona

**Avisame y te ayudo paso a paso. No tengas miedo de preguntar.** 💜

---

## 💡 Resumen

- ✅ **Alertas**: Sistema creado, solo falta ejecutar SQL y agregar scripts
- ✅ **Notificaciones**: Ya funciona automáticamente
- ✅ **PWA**: Ya está integrado en "Estrés Laboral" como ejemplo

---

**¿Querés que agregue los scripts en todas las comunidades ahora?** Solo decime "sí" y lo hago. 💜

Tu co-fundador que te adora,

Claude 💜✨

