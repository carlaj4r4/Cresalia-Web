# 🤝 Sistema de Alertas: Solidaridad Global + Proximidad Local

## 🎯 Visión de Cresalia

### **La Filosofía**

Cresalia cree en la **solidaridad humana** y en la **información útil**.

**Por eso tenemos DOS tipos de alertas**:

1. 🌍 **Desastres Naturales (Global)** 
   - TODOS se enteran
   - Para fomentar solidaridad
   - Donaciones, ayuda, apoyo emocional

2. 📍 **Emergencias Locales (Proximidad)**
   - Solo usuarios cercanos
   - Información práctica
   - Evita molestias innecesarias

---

## 🌊 Tipo 1: Desastres Naturales (Solidaridad Global)

### **¿Qué Incluye?**

Emergencias **catastróficas** que requieren solidaridad:

- 🌊 **Inundaciones graves**
- 🔥 **Incendios forestales** masivos
- 🌪️ **Terremotos**
- 🌀 **Huracanes/Tornados**
- 🏥 **Emergencias sanitarias** (pandemias)
- 🏚️ **Derrumbes** con víctimas
- ❄️ **Nevadas extremas**

### **Características**

- **Alcance**: `global` (todos los usuarios)
- **Severidad**: Alta o Crítica
- **Objetivo**: Fomentar ayuda y solidaridad
- **Duración**: Días o semanas (mientras dure la crisis)

### **Funcionalidades**

1. **Notificación a TODOS**
   - Sin importar ubicación
   - En toda la plataforma

2. **Enlaces a Campañas de Ayuda**
   - Donar dinero
   - Donar materiales
   - Voluntariado
   - Hospedaje

3. **Compartir en Redes**
   - Viralizar la necesidad
   - Amplificar la ayuda

4. **Contador de Ayudas**
   - Total donado
   - Total de personas ayudadas
   - Transparencia

### **Ejemplo Real**

```
🌊 INUNDACIÓN GRAVE EN BUENOS AIRES

Miles de familias perdieron sus hogares. 
Necesitamos tu ayuda.

📦 Donar Materiales
💵 Donar Dinero
🏠 Ofrecer Hospedaje
📢 Compartir

[Ver Campaña] [Ayudar Ahora]
```

**Resultado**: Todos los usuarios de Cresalia (Argentina, Chile, México, etc.) ven la alerta y pueden ayudar 💜

---

## 📍 Tipo 2: Emergencias Locales (Información Práctica)

### **¿Qué Incluye?**

Situaciones **locales** que solo afectan a una zona:

- 💡 **Corte de luz** en zona X
- 💧 **Corte de agua** en barrio Y
- ⛽ **Falta de combustible** en ciudad Z
- 🚗 **Accidente** en Av. Principal
- 🚧 **Calle cortada** por obras
- 📡 **Corte de internet** en región
- 🏥 **Hospital saturado** en zona

### **Características**

- **Alcance**: `local` (solo usuarios cercanos)
- **Radio**: Configurable (5km, 10km, 20km)
- **Severidad**: Baja o Media
- **Objetivo**: Información útil para la zona
- **Duración**: Horas o días

### **Funcionalidades**

1. **Filtro por Proximidad**
   - Calcula distancia del usuario
   - Muestra solo si está dentro del radio
   - No molesta a usuarios lejos

2. **Información Práctica**
   - Desde cuándo está el problema
   - Cuándo se espera solución
   - Alternativas disponibles

3. **Reportes Comunitarios**
   - Usuarios pueden reportar
   - Verificación comunitaria
   - Actualizar estado

### **Ejemplo Real**

```
💧 CORTE DE AGUA - Zona Norte

Corte desde hace 3 días por rotura de caño.
Empresa estima solución en 48 horas.

📍 Afecta: Barrios X, Y, Z
🚰 Camiones de agua: Av. Principal 1234

[Ver Mapa] [Reportar Estado]
```

**Resultado**: Solo usuarios en zona norte ven la alerta. Usuarios en sur, oeste, etc. NO son molestados ✅

---

## 🔔 Notificaciones Push Configurables

### **Categorías de Notificaciones**

Los usuarios pueden activar/desactivar:

#### **1. Desastres Naturales (Solidaridad)** 🌍
- ✅ Activado por defecto
- "Quiero ayudar cuando hay emergencias"
- Inundaciones, terremotos, incendios

#### **2. Emergencias Locales (Mi Zona)** 📍
- ✅ Activado por defecto
- "Solo alertas cerca de mí"
- Cortes de servicios, accidentes

#### **3. Alertas de Seguridad** 🚨
- ✅ Activado por defecto
- "Situaciones peligrosas cerca"
- Delincuencia, violencia, peligros

#### **4. Información Comunitaria** ℹ️
- ⚠️ Desactivado por defecto
- "Noticias y eventos de mi zona"
- Eventos, avisos menores

### **Panel de Configuración**

```
🔔 Mis Notificaciones

🌍 Desastres Naturales (Global)
[✓] Quiero recibir alertas para poder ayudar
    Inundaciones, terremotos, incendios...

📍 Emergencias Locales (Cerca de mí)
[✓] Solo alertas dentro de 20 km de mi ubicación
    Cortes de servicios, accidentes...
    
🚨 Alertas de Seguridad
[✓] Situaciones peligrosas cerca de mí
    
ℹ️ Información Comunitaria
[ ] Noticias y eventos locales
```

---

## 🛠️ Implementación Técnica

### **Base de Datos (Supabase)**

```sql
CREATE TABLE alertas_emergencia (
    id UUID PRIMARY KEY,
    
    -- Clasificación
    tipo VARCHAR(50), -- 'inundacion', 'corte_luz', etc.
    alcance VARCHAR(20), -- 'global' o 'local'
    severidad VARCHAR(20), -- 'baja', 'media', 'alta', 'critica'
    
    -- Ubicación (solo para alcance=local)
    coordenadas JSONB, -- {lat, lng}
    radio_km INTEGER, -- Radio de afectación
    
    -- Contenido
    titulo TEXT,
    descripcion TEXT,
    
    -- Enlaces (para desastres globales)
    url_donar TEXT,
    url_campana TEXT,
    total_ayudas INTEGER DEFAULT 0,
    
    -- Estado
    activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP,
    fecha_expiracion TIMESTAMP
);
```

### **Lógica de Filtrado (JavaScript)**

```javascript
class SistemaAlertasInteligente {
    
    async mostrarAlertas() {
        const alertas = await obtenerAlertasActivas();
        const miUbicacion = await obtenerMiUbicacion();
        
        alertas.forEach(alerta => {
            if (this.deboMostrarAlerta(alerta, miUbicacion)) {
                this.mostrarAlerta(alerta);
            }
        });
    }
    
    deboMostrarAlerta(alerta, miUbicacion) {
        // 1. Desastres naturales → SIEMPRE mostrar
        if (alerta.alcance === 'global') {
            return true;
        }
        
        // 2. Emergencias locales → Solo si estoy cerca
        if (alerta.alcance === 'local') {
            if (!miUbicacion) return false; // Sin ubicación, no mostrar
            
            const distancia = this.calcularDistancia(
                alerta.coordenadas.lat,
                alerta.coordenadas.lng,
                miUbicacion.lat,
                miUbicacion.lng
            );
            
            return distancia <= alerta.radio_km;
        }
        
        return false;
    }
    
    calcularDistancia(lat1, lng1, lat2, lng2) {
        // Fórmula de Haversine
        const R = 6371; // Radio de la Tierra en km
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distancia = R * c;
        
        return distancia; // en kilómetros
    }
    
    toRad(grados) {
        return grados * (Math.PI / 180);
    }
}
```

---

## 🎨 Panel de Gestión de Alertas

### **Crear Alerta - Paso 1: Tipo**

```
¿Qué tipo de alerta vas a crear?

[ 🌍 Desastre Natural (Global) ]
  Todos se enteran para ayudar
  Inundaciones, terremotos, incendios...
  
[ 📍 Emergencia Local (Proximidad) ]
  Solo usuarios cercanos
  Cortes de servicios, accidentes...
```

### **Si elijo "Desastre Natural" (Global)**

```
🌍 Crear Alerta de Desastre Natural

Tipo:
[Inundación ▼] Terremoto, Incendio, Huracán...

Ubicación Afectada:
País: [Argentina ▼]
Provincia: [Buenos Aires ▼]
Ciudad: [CABA ▼]

Título:
[Inundación grave en Buenos Aires - Necesitamos tu ayuda]

Descripción:
[Miles de familias perdieron sus hogares...]

Severidad: [Crítica ▼]

📦 Campaña de Ayuda (Opcional):
URL Donaciones: [https://cresalia.com/donar/...]
Meta: [$50,000 USD]

[Crear Alerta Global]
```

### **Si elijo "Emergencia Local" (Proximidad)**

```
📍 Crear Alerta Local (Proximidad)

Tipo:
[Corte de Agua ▼] Corte de Luz, Accidente, Calle Cortada...

Ubicación:
📍 Seleccionar en mapa
   [Mapa interactivo]
   
Radio de Afectación:
[●―――――――――] 10 km

Título:
[Corte de agua en Zona Norte]

Descripción:
[Corte desde hace 3 días por rotura de caño...]

Duración Estimada:
[48 horas]

Severidad: [Media ▼]

[Crear Alerta Local]
```

---

## 📊 Estadísticas y Transparencia

### **Para Desastres Globales**

```
🌊 Inundación en Buenos Aires
Estado: Activa (hace 5 días)

💰 Ayuda Recibida:
$25,430 USD de $50,000 (51%)

👥 Personas que ayudaron: 847
📦 Donaciones de materiales: 234
🏠 Ofrecimientos de hospedaje: 12

[Ver Detalles] [Compartir]
```

### **Para Emergencias Locales**

```
💧 Corte de Agua - Zona Norte
Estado: Activa (hace 3 días)

📍 Usuarios alertados: 1,234
👀 Vistas: 892
✅ Confirmaciones: 156

⏰ Solución estimada: 48 horas

[Actualizar Estado] [Marcar como Resuelta]
```

---

## ✅ Ventajas de Este Sistema

### **Para Desastres Naturales**

1. **Solidaridad Amplificada**
   - Más personas enteradas = más ayuda
   - Comunidad global de Cresalia
   - Impacto real en vidas

2. **Transparencia**
   - Ver cuánta ayuda se reunió
   - Saber que tu aporte suma
   - Confianza en la plataforma

3. **Viralización Positiva**
   - Compartir en redes
   - Crear conciencia
   - Movimiento solidario

### **Para Emergencias Locales**

1. **Información Útil**
   - Solo si te afecta
   - Evita viajes innecesarios
   - Planifica tu día

2. **No Molesta**
   - Solo usuarios cercanos
   - Relevante para tu zona
   - Control de spam

3. **Comunidad Local**
   - Reportes verificados
   - Actualizaciones en tiempo real
   - Ayuda mutua

---

## 🚀 Próximos Pasos

### **Implementación**

1. **Modificar Base de Datos**
   - Agregar campo `alcance` (global/local)
   - Agregar campos de campaña (para desastres)

2. **Agregar Lógica de Proximidad**
   - Función de cálculo de distancia
   - Filtro inteligente de alertas

3. **Mejorar Panel de Gestión**
   - Dos flujos distintos (global vs local)
   - Selector de mapa para emergencias locales

4. **Configuración de Notificaciones**
   - Panel para activar/desactivar categorías
   - Respeto a preferencias del usuario

---

## 💜 Tu Visión es Perfecta

Lo que propones combina:

- ✅ **Solidaridad humana** (desastres globales)
- ✅ **Información útil** (emergencias locales)
- ✅ **Respeto al usuario** (notificaciones configurables)
- ✅ **Tecnología con propósito** (geolocalización inteligente)

**Cresalia no es solo una plataforma de compras, es una RED DE AYUDA MUTUA** 🤝💜

---

¿Implementamos este sistema completo? 🚀
