# 🎨 Colores de Ofertas y 🗺️ Implementación de Mapbox

## 🎨 **COLORES DE OFERTAS**

### **Colores Actuales:**

1. **Badge de Descuento Principal** (`badge-descuento`)
   - Color: `#EF4444` (Rojo)
   - Ubicación: `css/tienda-search-chatbot.css`
   - Uso: Badge que muestra el porcentaje de descuento

2. **Badge de Descuento Alternativo** (`discount-badge`)
   - Color: `#10b981` (Verde)
   - Ubicación: `styles-cresalia.css`
   - Uso: Badge de ahorro en combos

3. **Oferta Combo** (`combo-badge.oferta`)
   - Fondo: `rgba(255, 193, 7, 0.3)` (Amarillo transparente)
   - Texto: `#ffc107` (Amarillo)
   - Ubicación: `styles-cresalia.css`
   - Uso: Ofertas de combos

4. **Flash Sale** (`combo-badge.flash`)
   - Fondo: `rgba(255, 107, 107, 0.3)` (Rojo claro transparente)
   - Texto: `#ff6b6b` (Rojo claro)
   - Ubicación: `styles-cresalia.css`
   - Uso: Ofertas flash/relámpago

5. **Price Discount** (`price-discount`)
   - Color: `var(--danger-color)` (Rojo del tema)
   - Ubicación: `css/buyer-interface-improved.css`
   - Uso: Badge de precio con descuento

---

## 🗺️ **IMPLEMENTACIÓN DE MAPBOX**

### **Estado Actual:**

✅ **Ya configurado:**
- Archivo `config-mapbox.js` para obtener el token
- Referencias en `js/geolocalizacion-usuarios.js`
- Configuración en `js/sistema-mapas.js` con estilos Mapbox
- Variable de entorno `MAPBOX_ACCESS_TOKEN` en Vercel

⚠️ **Pendiente de implementar:**
- Inicialización real del mapa con Mapbox GL JS
- Integración completa en `js/sistema-mapas.js`
- Carga del SDK de Mapbox en las páginas

### **Cómo Implementar Mapbox Completamente:**

#### **1. Agregar el SDK de Mapbox en las páginas:**

```html
<!-- En las páginas que necesiten mapas (ej: admin-final.html) -->
<link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
```

#### **2. Configurar la Variable de Entorno en Vercel:**

- Ve a **Settings → Environment Variables**
- Agrega: `MAPBOX_ACCESS_TOKEN` = `pk.eyJ1Ijoi...` (tu token de Mapbox)

#### **3. Actualizar `js/sistema-mapas.js`:**

El archivo ya tiene la estructura, solo necesita la inicialización real del mapa:

```javascript
// En la función generarInterfazMapas(), reemplazar el placeholder del mapa con:
<div id="mapaContainer" style="width: 100%; height: 300px; border-radius: 8px;"></div>

// Y luego inicializar:
inicializarMapaMapbox: function() {
    const token = window.MAPBOX_CONFIG?.accessToken || process.env.MAPBOX_ACCESS_TOKEN;
    if (!token) {
        console.warn('⚠️ MAPBOX_ACCESS_TOKEN no configurado');
        return;
    }
    
    mapboxgl.accessToken = token;
    
    const map = new mapboxgl.Map({
        container: 'mapaContainer',
        style: 'mapbox://styles/mapbox/light-v10', // o dark-v10, satellite-v9
        center: [-58.3816, -34.6037], // Buenos Aires por defecto
        zoom: 13
    });
    
    // Agregar marcador arrastrable
    const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([-58.3816, -34.6037])
        .addTo(map);
    
    marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        console.log('📍 Nueva ubicación:', lngLat);
        // Guardar coordenadas
    });
}
```

#### **4. Agregar Geocodificación (Buscar Direcciones):**

```javascript
buscarDireccion: async function() {
    const direccion = document.getElementById('buscarDireccion').value.trim();
    if (!direccion) return;
    
    const token = window.MAPBOX_CONFIG?.accessToken;
    if (!token) return;
    
    try {
        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(direccion)}.json?access_token=${token}&country=ar&language=es&limit=1`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            // Centrar mapa y mover marcador
            map.setCenter([lng, lat]);
            marker.setLngLat([lng, lat]);
        }
    } catch (error) {
        console.error('Error buscando dirección:', error);
    }
}
```

---

## 📝 **Resumen:**

- **Ofertas:** Principalmente **rojo** (`#EF4444`), con variantes en **verde** y **amarillo** para diferentes tipos
- **Mapbox:** Configuración base lista, solo falta inicializar el mapa real con el SDK de Mapbox GL JS

¿Quieres que implemente completamente Mapbox en `js/sistema-mapas.js`?

