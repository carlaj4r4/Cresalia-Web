# 🔔 Sistema de Alertas y Mensajes Personalizados - Cresalia

## 📊 Estado Actual

Ya tenés **2 sistemas funcionando**:

1. **`elegant-notifications.js`** - Notificaciones visuales elegantes
2. **`sistema-alertas-emergencia-global.js`** - Alertas de emergencia

---

## 🤔 ¿Necesitás Supabase?

**Depende de lo que quieras hacer:**

### **Opción 1: SIN Servidor (100% Cliente)** ⚡
**Ideal para**:
- ✅ Mensajes temporales en la sesión
- ✅ Alertas basadas en acciones del usuario
- ✅ Notificaciones de eventos locales
- ✅ Mensajes predefinidos en el código

**Ventajas**:
- 🚀 **Instantáneo** (sin latencia)
- 💰 **Gratis** (sin costos de servidor)
- 🔒 **Privado** (todo local)
- 📱 **Funciona offline**

**Desventajas**:
- ❌ No puedes cambiar mensajes sin actualizar el código
- ❌ No puedes enviar mensajes a usuarios específicos
- ❌ No hay persistencia entre dispositivos
- ❌ No puedes programar mensajes futuros

**Cómo funciona actualmente**:
```javascript
// En cualquier parte de tu app
elegantNotifications.show(
    'Bienvenido a Cresalia! 🎉',
    'success',
    'Mensaje de Bienvenida',
    5000
);
```

---

### **Opción 2: CON Supabase (Cliente + Servidor)** 🌐
**Ideal para**:
- ✅ Mensajes personalizados por usuario
- ✅ Cambiar mensajes sin actualizar código
- ✅ Programar mensajes futuros
- ✅ Estadísticas de lectura
- ✅ Mensajes de administrador a todos
- ✅ Alertas de emergencia coordinadas

**Ventajas**:
- 🎯 **Mensajes personalizados** por usuario
- 📝 **Control total** desde panel admin
- 📊 **Analytics** de lectura
- 🕒 **Programar** mensajes
- 🔄 **Sincronizar** entre dispositivos

**Desventajas**:
- 💰 Consume cuota de Supabase (gratis hasta 50k filas/mes)
- 🌐 Requiere conexión a internet
- ⏱️ Ligera latencia al cargar

---

## 🎯 Recomendación: Sistema Híbrido (Lo Mejor de Ambos)

**Te propongo combinar ambos**:

### **1. Mensajes Locales (Sin Supabase)** 
Para cosas rápidas y temporales:
- Confirmaciones de acciones
- Errores de validación
- Mensajes de éxito/error
- Notificaciones de eventos

**Ya lo tenés funcionando con** `elegant-notifications.js`

### **2. Mensajes Globales (Con Supabase)**
Para cosas importantes y centralizadas:
- Mensajes de administrador
- Alertas de emergencia globales
- Anuncios de mantenimiento
- Promociones especiales
- Mensajes personalizados

---

## 💡 Solución Propuesta: Sistema Híbrido Completo

### **Tabla en Supabase** (Opcional, solo si querés control centralizado):

```sql
-- Tabla para mensajes globales (solo si querés Supabase)
CREATE TABLE mensajes_app (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL, -- 'emergencia', 'anuncio', 'promocion', 'mantenimiento'
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    destinatarios TEXT, -- 'todos', 'compradores', 'vendedores', 'emprendedores'
    prioridad TEXT DEFAULT 'normal', -- 'baja', 'normal', 'alta', 'critica'
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_fin TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,
    leido_por JSONB DEFAULT '[]', -- Array de user_ids que ya lo leyeron
    creado_por UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Todos pueden leer mensajes activos
CREATE POLICY "Mensajes públicos"
    ON mensajes_app FOR SELECT
    USING (activo = true AND NOW() >= fecha_inicio AND (fecha_fin IS NULL OR NOW() <= fecha_fin));
```

### **Sistema de Mensajes Combinado (JavaScript)**:

```javascript
// sistema-mensajes-cresalia.js
class SistemaMensajesCresalia {
    constructor() {
        this.usarSupabase = true; // Cambiar a false para solo local
        this.mensajesLocales = [
            // Mensajes predefinidos que siempre funcionan
            {
                id: 'bienvenida',
                tipo: 'info',
                titulo: 'Bienvenido a Cresalia',
                mensaje: '¡Gracias por ser parte de nuestra comunidad! 🎉',
                destinatarios: 'todos',
                prioridad: 'normal'
            },
            {
                id: 'emergencia_demo',
                tipo: 'emergencia',
                titulo: 'Alerta de Emergencia',
                mensaje: 'Sistema de alertas funcionando correctamente',
                destinatarios: 'todos',
                prioridad: 'critica'
            }
        ];
        this.inicializar();
    }
    
    async inicializar() {
        console.log('🔔 Inicializando Sistema de Mensajes...');
        
        // Siempre cargar mensajes locales primero (funciona offline)
        this.cargarMensajesLocales();
        
        // Intentar cargar mensajes de Supabase si está habilitado
        if (this.usarSupabase && typeof supabase !== 'undefined') {
            await this.cargarMensajesSupabase();
        }
    }
    
    cargarMensajesLocales() {
        console.log('📝 Cargando mensajes locales...');
        this.mostrarMensajesSiCorresponde(this.mensajesLocales);
    }
    
    async cargarMensajesSupabase() {
        try {
            console.log('🌐 Cargando mensajes de Supabase...');
            
            const tipoUsuario = this.obtenerTipoUsuario();
            
            const { data, error } = await supabase
                .from('mensajes_app')
                .select('*')
                .eq('activo', true)
                .or(`destinatarios.eq.todos,destinatarios.eq.${tipoUsuario}`)
                .lte('fecha_inicio', new Date().toISOString())
                .order('prioridad', { ascending: false });
            
            if (error) throw error;
            
            if (data && data.length > 0) {
                console.log(`✅ ${data.length} mensajes cargados de Supabase`);
                this.mostrarMensajesSiCorresponde(data);
            }
        } catch (error) {
            console.warn('⚠️ Error cargando mensajes de Supabase:', error);
            // Fallback: usar solo mensajes locales
            console.log('📝 Usando solo mensajes locales');
        }
    }
    
    mostrarMensajesSiCorresponde(mensajes) {
        mensajes.forEach(mensaje => {
            // Verificar si el usuario ya lo leyó
            const yaLeido = localStorage.getItem(`mensaje_leido_${mensaje.id}`);
            if (!yaLeido) {
                this.mostrarMensaje(mensaje);
                
                // Marcar como leído
                localStorage.setItem(`mensaje_leido_${mensaje.id}`, 'true');
            }
        });
    }
    
    mostrarMensaje(mensaje) {
        // Usar elegant-notifications
        const tipoNotif = this.mapearTipo(mensaje.tipo);
        const duracion = mensaje.prioridad === 'critica' ? 0 : 8000; // 0 = no se cierra automáticamente
        
        if (typeof elegantNotifications !== 'undefined') {
            elegantNotifications.show(
                mensaje.mensaje,
                tipoNotif,
                mensaje.titulo,
                duracion
            );
        } else {
            // Fallback
            alert(`${mensaje.titulo}: ${mensaje.mensaje}`);
        }
    }
    
    mapearTipo(tipo) {
        const mapeo = {
            'emergencia': 'error',
            'anuncio': 'info',
            'promocion': 'success',
            'mantenimiento': 'warning'
        };
        return mapeo[tipo] || 'info';
    }
    
    obtenerTipoUsuario() {
        try {
            const userData = localStorage.getItem('cresalia_user_data');
            if (userData) {
                const data = JSON.parse(userData);
                return data.tipo || 'comprador';
            }
        } catch (error) {
            console.warn('⚠️ Error obteniendo tipo de usuario:', error);
        }
        return 'comprador'; // Default
    }
    
    // Método para enviar mensaje desde panel admin (requiere Supabase)
    async enviarMensajeGlobal(mensaje) {
        if (!this.usarSupabase) {
            console.warn('⚠️ Supabase deshabilitado, no se puede enviar mensaje');
            return { success: false, error: 'Supabase no configurado' };
        }
        
        try {
            const { data, error } = await supabase
                .from('mensajes_app')
                .insert([mensaje]);
            
            if (error) throw error;
            
            console.log('✅ Mensaje enviado correctamente');
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error enviando mensaje:', error);
            return { success: false, error: error.message };
        }
    }
}

// Inicializar automáticamente
const sistemaMensajes = new SistemaMensajesCresalia();
window.sistemaMensajes = sistemaMensajes;
```

---

## 📋 Comparación de Opciones

| Característica | Sin Supabase | Con Supabase | Híbrido (Recomendado) |
|---|---|---|---|
| **Costo** | $0 | $0-$25/mes | $0-$25/mes |
| **Velocidad** | ⚡ Instantáneo | 🌐 ~100ms | ⚡ Instantáneo + 🌐 |
| **Offline** | ✅ Funciona | ❌ Requiere internet | ✅ Funciona |
| **Mensajes dinámicos** | ❌ | ✅ | ✅ |
| **Personalización** | ❌ | ✅ | ✅ |
| **Analytics** | ❌ | ✅ | ✅ |
| **Control admin** | ❌ | ✅ | ✅ |
| **Complejidad** | 🟢 Baja | 🟡 Media | 🟡 Media |

---

## 🎯 Mi Recomendación

### **Para empezar**: Sin Supabase (Lo que ya tenés)
- Ya funciona con `elegant-notifications.js`
- Gratis y rápido
- Ideal para mensajes de interfaz

### **Para crecer**: Sistema Híbrido
1. **Mantener** `elegant-notifications.js` para UI
2. **Agregar** tabla `mensajes_app` en Supabase
3. **Crear** panel en admin para enviar mensajes globales
4. **Combinar** ambos sistemas

### **Ventaja del Híbrido**:
- ✅ Funciona **siempre** (incluso offline)
- ✅ Puedes enviar **mensajes urgentes** desde admin
- ✅ **No dependes** de Supabase para funcionalidad básica
- ✅ Tienes **control total** cuando lo necesitás

---

## 💡 Ejemplo Práctico

### **Sin Supabase** (Lo que tenés ahora):
```javascript
// En cualquier archivo .js
elegantNotifications.show(
    '¡Nueva promoción! 50% OFF en todo',
    'success',
    'Oferta Especial',
    10000
);
```

### **Con Supabase** (Panel Admin):
```javascript
// Desde panel admin
await sistemaMensajes.enviarMensajeGlobal({
    tipo: 'promocion',
    titulo: 'Oferta Especial',
    mensaje: '¡Nueva promoción! 50% OFF en todo',
    destinatarios: 'todos',
    prioridad: 'alta',
    fecha_inicio: new Date().toISOString(),
    fecha_fin: new Date(Date.now() + 7*24*60*60*1000).toISOString() // 7 días
});
```

---

## 🚀 ¿Qué Hacer Ahora?

### **Opción A: Seguir sin Supabase (Más simple)**
- ✅ Ya funciona perfecto
- ✅ Gratis total
- ✅ Rápido y simple
- ❌ Menos flexible

### **Opción B: Agregar Supabase (Más potente)**
- ✅ Control total desde admin
- ✅ Mensajes personalizados
- ✅ Analytics y estadísticas
- ❌ Más complejo
- ❌ Depende de internet

### **Opción C: Híbrido (Lo mejor de ambos)**
- ✅ Funciona siempre
- ✅ Control cuando lo necesitás
- ✅ Flexible y escalable
- 🟡 Complejidad media

---

## 💬 Mi Sugerencia

**Empezá sin Supabase** para mensajes básicos (ya lo tenés funcionando).

**Agregá Supabase** solo cuando necesites:
- Enviar mensajes urgentes a todos los usuarios
- Alertas de emergencia coordinadas
- Anuncios de mantenimiento
- Promociones personalizadas

**Mientras tanto**, usá `elegant-notifications.js` que ya funciona perfecto para:
- Confirmaciones
- Errores
- Mensajes de éxito
- Notificaciones temporales

---

¿Querés que te cree el sistema híbrido completo o preferís seguir con el sistema local que ya tenés? 😊
