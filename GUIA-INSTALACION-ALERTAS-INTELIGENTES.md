# 🚀 Instalación: Sistema de Alertas Inteligente

## 🎯 Lo que Implementamos

✅ **Solidaridad Global**: Desastres naturales → TODOS se enteran → Pueden ayudar
✅ **Proximidad Local**: Emergencias locales → Solo cercanos → Información útil
✅ **Presión a Autoridades**: Horas sin servicio → Severidad auto-aumenta
✅ **Redirección a Donaciones**: Integración con sistema existente
✅ **SIN ROMPER NADA**: Todo compatible con lo que ya existe

---

## 📋 PASO 1: Instalar en Supabase (AMBOS proyectos)

### **1.1 Proyecto E-COMMERCE**

1. Ir a: `https://tu-proyecto-ecommerce.supabase.co`
2. SQL Editor → + New Query
3. Copiar TODO de: `SUPABASE-ALERTAS-MEJORADO-SOLIDARIDAD-PROXIMIDAD.sql`
4. Pegar → RUN

✅ Deberías ver: `✅ SISTEMA DE ALERTAS MEJORADO INSTALADO`

---

### **1.2 Proyecto COMUNIDADES**

1. Ir a: `https://tu-proyecto-comunidades.supabase.co`
2. SQL Editor → + New Query
3. Copiar TODO de: `SUPABASE-ALERTAS-MEJORADO-SOLIDARIDAD-PROXIMIDAD.sql`
4. Pegar → RUN

✅ Listo! Ahora tenés alertas en ambos proyectos.

---

## 📋 PASO 2: Agregar Script en tus Páginas

### **2.1 En `index-cresalia.html`**

Buscar donde están los otros scripts y agregar:

```html
<!-- Sistema de Alertas Inteligente -->
<script src="/js/sistema-alertas-inteligente.js"></script>
```

### **2.2 En `demo-buyer-interface.html`**

Lo mismo:

```html
<!-- Sistema de Alertas Inteligente -->
<script src="/js/sistema-alertas-inteligente.js"></script>
```

### **2.3 En `tiendas/ejemplo-tienda/admin-final.html`**

Lo mismo:

```html
<!-- Sistema de Alertas Inteligente -->
<script src="/js/sistema-alertas-inteligente.js"></script>
```

### **2.4 En páginas de comunidades**

En todas las páginas de comunidades:

```html
<!-- Sistema de Alertas Inteligente -->
<script src="/js/sistema-alertas-inteligente.js"></script>
```

---

## 📋 PASO 3: Crear tu Primera Alerta

### **Opción A: Desastre Natural (Global)**

Usar el `panel-gestion-alertas-global.html`:

```
Tipo: Inundación
Alcance: global  ← NUEVO
Título: "Inundación grave en Buenos Aires - Necesitamos tu ayuda"
Descripción: "Miles de familias perdieron sus hogares..."
Severidad: Crítica
URLs: (se completan automáticamente)
- Donar materiales: /cresalia-solidario-emergencias/donar-materiales.html
- Donar dinero: /cresalia-solidario-emergencias/index.html
```

**Resultado**: TODOS los usuarios lo ven y pueden ayudar 💜

---

### **Opción B: Emergencia Local (Proximidad)**

```
Tipo: Corte de Agua
Alcance: local  ← NUEVO
Horas sin servicio: 72 (3 días) ← NUEVO
Coordenadas: Seleccionar en mapa
Radio: 10 km
Título: "Corte de agua en zona norte - 3 días sin servicio"
Descripción: "Rotura de caño principal. Empresa estima 48h para solución."
Severidad: (se calcula automáticamente según horas)
```

**Resultado**: Solo usuarios dentro de 10km lo ven ✅

---

## 🔧 Características Especiales

### **1. Severidad Automática por Horas**

El sistema ajusta la severidad automáticamente:

```
Horas sin servicio → Severidad
0-24 horas        → Baja
24-48 horas       → Media
48-72 horas       → Alta
+72 horas (3 días) → CRÍTICA  ← Presión máxima
```

**Objetivo**: Presionar a autoridades/empresas para actuar rápido

---

### **2. Filtro Inteligente por Proximidad**

```javascript
// Usuario en Buenos Aires (lat: -34.6, lng: -58.4)

Alerta 1: Inundación en Buenos Aires (Global)
→ ✅ SE MUESTRA (es global, todos la ven)

Alerta 2: Corte de agua en zona norte BA (Local, 10km)
→ ✅ SE MUESTRA (usuario está dentro del radio)

Alerta 3: Corte de luz en Córdoba (Local, 10km)
→ ❌ NO SE MUESTRA (usuario está fuera del radio)
```

---

### **3. Botones Dinámicos según Tipo**

**Desastre Global**:
```
[💵 Donar Dinero] [📦 Donar Materiales] [💜 847 personas ayudando]
```

**Emergencia Local**:
```
[⏰ Lleva 3 días sin servicio] [📍 Ver en Mapa] [✓ Reportar Estado]
```

---

### **4. Contador de Solidaridad**

Cuando alguien ayuda, se registra automáticamente:

```sql
-- Ejemplo: Alguien donó $100
SELECT registrar_ayuda(
    alerta_id := 123,
    tipo_ayuda := 'dinero',
    monto := 100
);

-- Resultado: Contador actualizado
total_donaciones_dinero: $25,530
total_personas_ayudando: 848 ← +1
```

**Transparencia**: Todos ven cuánta ayuda se reunió 💜

---

## 🎨 Ejemplos de Uso Real

### **Ejemplo 1: Inundación en Buenos Aires**

**Crear alerta**:
```
Alcance: global
Tipo: Inundación
Severidad: Crítica
```

**Lo que pasa**:
1. TODOS los usuarios de Cresalia lo ven (Argentina, Chile, México...)
2. Pueden donar dinero o materiales
3. Ven contador en tiempo real: "$25,430 donados por 847 personas"
4. Pueden compartir en redes

---

### **Ejemplo 2: Corte de Agua (3 días)**

**Crear alerta**:
```
Alcance: local
Tipo: Corte de Agua
Horas sin servicio: 72
Radio: 10 km
Coordenadas: Zona norte BA
```

**Lo que pasa**:
1. Solo usuarios dentro de 10km lo ven
2. Severidad = CRÍTICA (por 3 días sin servicio)
3. Ven: "⏰ Lleva 3 días sin servicio"
4. **Presión a la empresa** para solucionar YA

---

### **Ejemplo 3: Terremoto en Chile**

**Crear alerta**:
```
Alcance: global
Tipo: Terremoto
Severidad: Alta
```

**Lo que pasa**:
1. Usuarios en Argentina, México, etc. lo ven
2. Solidaridad: "💵 Donar para ayudar a Chile"
3. Comunidad global de Cresalia ayudando 💜

---

## ✅ Verificación

### **¿Cómo saber si funcionó?**

1. **Verificar SQL**:
   ```sql
   -- En Supabase
   SELECT * FROM estadisticas_alertas_solidaridad;
   ```
   
   Deberías ver:
   ```
   desastres_activos: 0
   emergencias_locales_activas: 0
   total_dinero_donado: $0
   total_personas_ayudando: 0
   ```

2. **Probar en Frontend**:
   - Abrir `index-cresalia.html`
   - Abrir consola del navegador
   - Ver: `✅ Sistema de Alertas Inteligente cargado`

3. **Crear Alerta de Prueba**:
   - Panel Master → Crear alerta global
   - Debería aparecer en todas las páginas

---

## 🔔 Configuración de Usuario

Los usuarios pueden configurar qué alertas quieren:

```javascript
// Activar/Desactivar notificaciones globales
sistemaAlertasInteligente.activarNotificacionesGlobales(true);

// Activar/Desactivar notificaciones locales
sistemaAlertasInteligente.activarNotificacionesLocales(true);

// Configurar radio máximo (km)
sistemaAlertasInteligente.configurarRadio(20);
```

**Respeto al usuario**: Pueden deshabilitar lo que quieran ✅

---

## 📊 Estadísticas en Tiempo Real

Ver cuánta solidaridad hay:

```sql
SELECT * FROM estadisticas_alertas_solidaridad;
```

Resultado:
```
Desastres activos: 2
Emergencias locales: 5
Dinero donado: $52,340
Materiales donados: 1,234
Personas ayudando: 3,847
Promedio horas resolución: 36 (1.5 días)
```

---

## 💜 Tu Visión Implementada

Lo que logramos:

✅ **Solidaridad Amplificada**
   - Desastres → TODOS ayudan
   - Transparencia total
   - Comunidad global

✅ **Información Útil**
   - Emergencias locales → Solo afectados
   - No molesta a otros
   - Datos precisos

✅ **Presión para Actuar**
   - Severidad aumenta con tiempo
   - Obliga a autoridades/empresas
   - Resultados medibles

✅ **Tecnología con Propósito**
   - Geolocalización inteligente
   - Sin romper nada existente
   - Integrado con donaciones

---

## 🚀 Próximos Pasos

1. **Ejecutar SQL** en ambos proyectos Supabase
2. **Agregar scripts** en tus páginas
3. **Crear primera alerta de prueba**
4. **Ver la magia** 💜

---

¿Listo para instalarlo? 😊🚀
