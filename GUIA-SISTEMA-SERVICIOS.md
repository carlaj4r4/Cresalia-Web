# 🛠️ **Guía del Sistema de Servicios - CRESALIA SaaS**

## 📋 **Tabla de Contenidos**
1. [¿Qué es el Sistema de Servicios?](#qué-es)
2. [Categorías Disponibles](#categorías)
3. [Cómo Agregar un Servicio](#agregar-servicio)
4. [Gestión de Servicios](#gestión)
5. [Supabase: Tabla de Servicios](#supabase)
6. [Sistema de Reservas (Futuro)](#reservas)

---

## 🎯 **¿Qué es el Sistema de Servicios?**

El Sistema de Servicios permite a los emprendimientos ofrecer **servicios profesionales** además de (o en lugar de) productos físicos.

### **Ideal para:**
- 💇 **Peluquerías y Barberías**
- 💅 **Salones de Manicura**
- 💆 **Spas y Masajes**
- 🚗 **Talleres Mecánicos**
- 💻 **Freelancers (Diseño, Programación)**
- 🏋️ **Entrenadores Personales**
- 📚 **Profesores Particulares**
- 🎨 **Artistas y Creativos**
- Y muchos más...

---

## 🏷️ **Categorías Disponibles (100+ categorías)**

### 💇 **Belleza y Estética** (9 categorías)
- Peluquería
- Barbería
- Manicura y Pedicura
- Uñas Esculpidas
- Depilación
- Maquillaje Profesional
- Pestañas y Cejas
- Tratamientos Faciales
- Estética Corporal

### 💆 **Spa y Bienestar** (6 categorías)
- Masajes
- Spa y Relax
- Aromaterapia
- Reflexología
- Sauna y Vapor
- Hidromasaje

### 💪 **Salud y Fitness** (8 categorías)
- Entrenamiento Personal
- Yoga
- Pilates
- CrossFit
- Asesoría Nutricional
- Fisioterapia
- Quiropráctica
- Osteopatía

### 🏥 **Salud y Medicina** (6 categorías)
- Consulta Médica
- Odontología
- Psicología
- Terapia Ocupacional
- Fonoaudiología
- Análisis de Laboratorio

### 🚗 **Automotor** (7 categorías)
- Mecánica General
- Electricidad Automotriz
- Lavado de Auto
- Detailing y Pulido
- Chapería y Pintura
- Alineación y Balanceo
- Cambio de Aceite

### 🏠 **Hogar y Mantenimiento** (9 categorías)
- Plomería
- Electricidad
- Pintura
- Carpintería
- Albañilería
- Jardinería
- Limpieza
- Fumigación
- Mudanzas

### 💻 **Tecnología** (7 categorías)
- Reparación de PC
- Reparación de Celulares
- Desarrollo Web
- Diseño Gráfico
- Marketing Digital
- Gestión de Redes Sociales
- SEO y Posicionamiento

### 📚 **Educación** (6 categorías)
- Clases Particulares
- Enseñanza de Idiomas
- Clases de Música
- Clases de Arte
- Clases de Danza
- Apoyo Escolar

### 🎉 **Eventos** (7 categorías)
- Fotografía
- Videografía
- DJ
- Catering
- Decoración de Eventos
- Animación
- Organización de Eventos

### 🐾 **Mascotas** (5 categorías)
- Veterinaria
- Peluquería Canina
- Adiestramiento
- Paseo de Perros
- Guardería para Mascotas

### 💼 **Profesionales** (6 categorías)
- Contabilidad
- Asesoría Legal
- Traducción
- Consultoría
- Coaching
- Arquitectura

---

## ➕ **Cómo Agregar un Servicio**

### **Paso 1: Acceder a "Mis Servicios"**
1. Inicia sesión en tu panel de administración
2. En el menú lateral, haz clic en **"Mis Servicios"**
3. Haz clic en el botón **"+ Agregar Servicio"**

### **Paso 2: Completar el Formulario**

#### **Información Básica**
- **Nombre del Servicio*** (Requerido)
  - Ejemplo: "Corte de Cabello", "Manicura Francesa", "Masaje Relajante"
  
- **Duración (minutos)**
  - Por defecto: 60 minutos
  - Rango: 5 - 480 minutos
  
- **Descripción**
  - Describe qué incluye el servicio, beneficios, técnicas usadas, etc.

#### **Categoría y Precio**
- **Categoría*** (Requerido)
  - Selecciona la categoría que mejor describa tu servicio
  
- **Precio*** (Requerido)
  - Ingresa el precio en tu moneda local
  - Ejemplo: 25.00, 1500.00

#### **Configuración**
- **Estado**
  - ✅ **Activo**: El servicio está disponible para reservas
  - ⏸️ **Pausado**: Temporalmente no disponible
  
- **Requiere Cita Previa**
  - **Sí**: Los clientes deben agendar (recomendado)
  - **No**: Servicio sin cita previa

#### **Notas Adicionales** (Opcional)
- Instrucciones especiales para el cliente
- Ejemplo: "Traer toalla", "Llegar 10 min antes", "Estacionamiento disponible"

### **Paso 3: Guardar**
- Haz clic en **"Guardar Servicio"**
- ¡Listo! Tu servicio ahora es visible en el catálogo

---

## 📊 **Gestión de Servicios**

### **Ver Tus Servicios**
En la sección "Mis Servicios" verás:
- 📦 **Nombre y categoría** con emoji representativo
- 💰 **Precio**
- ⏱️ **Duración**
- ✅/⏸️ **Estado** (Activo/Pausado)
- 📊 **Número de reservas**
- 📝 **Notas especiales**

### **Editar un Servicio**
1. Haz clic en el ícono **✏️ Editar**
2. Modifica los campos que desees
3. Guarda los cambios

### **Eliminar un Servicio**
1. Haz clic en el ícono **🗑️ Eliminar**
2. Confirma la eliminación
3. El servicio se borrará permanentemente

### **Pausar un Servicio**
Si no quieres eliminar el servicio pero temporalmente no lo ofreces:
1. Edita el servicio
2. Cambia el estado a **"Pausado"**
3. Los clientes no podrán reservarlo hasta que lo reactives

---

## 🗄️ **Supabase: Tabla de Servicios**

### **Configuración Inicial**

#### **1. Crear la Tabla**
```sql
-- Ejecuta el archivo: supabase-servicios.sql
-- Esto creará:
-- - Tabla "servicios"
-- - Tabla "reservas_servicios" (para sistema de citas)
-- - Políticas de seguridad (RLS)
-- - Triggers para estadísticas automáticas
```

#### **2. Pasos en Supabase**
1. Ve a tu proyecto de Supabase
2. Abre **SQL Editor**
3. Copia el contenido de `supabase-servicios.sql`
4. Pega y ejecuta
5. Verifica que las tablas se crearon correctamente

#### **3. Campos de la Tabla**
- `id`: UUID único
- `tienda_id`: Referencia a la tienda
- `nombre`: Nombre del servicio
- `descripcion`: Descripción detallada
- `categoria`: Categoría del servicio
- `precio`: Precio en decimal
- `duracion`: Duración en minutos
- `estado`: 'activo', 'pausado', 'inactivo'
- `requiere_cita`: Boolean
- `notas`: Notas adicionales
- `reservas_totales`: Contador automático
- `calificacion_promedio`: Rating promedio (1-5)
- `fecha_creacion`: Timestamp
- `imagen_url`: URL de imagen (opcional)
- `tags`: Array de etiquetas
- `visible`: Boolean para visibilidad pública

### **Sincronización Automática**
- ✅ Todos los servicios creados se guardan automáticamente en Supabase
- ✅ Si Supabase no está disponible, se guarda localmente en `localStorage`
- ✅ Los servicios se cargan desde Supabase al iniciar sesión

---

## 📅 **Sistema de Reservas (Próximamente)**

### **Funcionalidades Futuras**

#### **Para Emprendedores:**
- 📆 **Calendario de Reservas**
  - Ver todas las citas del día/semana/mes
  - Aceptar/rechazar/reprogramar citas
  
- 🔔 **Notificaciones**
  - Email cuando un cliente reserva
  - Recordatorios automáticos
  
- 📊 **Estadísticas**
  - Servicios más solicitados
  - Horarios más populares
  - Ingresos por servicio

#### **Para Clientes:**
- 🗓️ **Reservar Online**
  - Seleccionar fecha y hora
  - Ver disponibilidad en tiempo real
  
- ⭐ **Calificar Servicio**
  - Dejar reseñas
  - Rating de 1-5 estrellas
  
- 📧 **Confirmación Automática**
  - Email de confirmación
  - Recordatorios antes de la cita

### **Tabla de Reservas**
La tabla `reservas_servicios` ya está lista en el archivo SQL e incluye:
- Información del cliente
- Fecha y hora de la reserva
- Estado (pendiente, confirmada, completada, cancelada)
- Sistema de calificaciones
- Triggers automáticos para actualizar estadísticas

---

## 💡 **Consejos y Mejores Prácticas**

### **Nombres Descriptivos**
❌ **Mal**: "Servicio 1", "Paquete A"
✅ **Bien**: "Corte + Barba + Afeitado", "Manicura + Esmaltado Semipermanente"

### **Descripciones Claras**
Incluye:
- ¿Qué incluye el servicio?
- ¿Cuánto dura?
- ¿Qué beneficios ofrece?
- ¿Qué técnicas usas?

Ejemplo:
> "Masaje descontracturante de 60 minutos con aceites esenciales. Ideal para aliviar tensiones musculares y estrés. Incluye aromaterapia y música relajante."

### **Precios Competitivos**
- Investiga precios de la competencia
- Considera tu experiencia y calidad
- Ofrece paquetes/combos con descuento

### **Fotografías**
(Funcionalidad próxima)
- Sube fotos de alta calidad
- Muestra resultados reales
- Crea confianza en los clientes

### **Actualiza Regularmente**
- Pausa servicios que no ofreces temporalmente
- Actualiza precios según demanda
- Agrega nuevos servicios según tendencias

---

## ❓ **Preguntas Frecuentes**

### **¿Puedo ofrecer productos Y servicios?**
✅ Sí, ambos sistemas funcionan independientemente.

### **¿Cuántos servicios puedo agregar?**
✅ Ilimitados.

### **¿Los servicios se muestran en la página principal?**
✅ Sí, si están marcados como "Activo" y "Visible".

### **¿Puedo cambiar la categoría después?**
✅ Sí, edita el servicio y cambia la categoría.

### **¿Cómo gestiono las citas?**
🔜 El sistema de reservas estará disponible próximamente.

### **¿Se envían notificaciones a los clientes?**
🔜 Próximamente con el sistema de reservas.

---

## 🚀 **Próximos Pasos**

1. ✅ **Crea tu primer servicio** en el panel de admin
2. ✅ **Ejecuta el SQL** en Supabase para habilitar sincronización
3. ✅ **Personaliza** descripciones y precios
4. ⏳ **Espera** el sistema de reservas (próxima actualización)

---

## 💜 **Soporte**

¿Necesitas ayuda?
- 💬 Usa el chat de soporte en tu panel
- 📧 Email: soporte@cresalia.com
- 🤖 CRISLA (asistente virtual)

---

**¡Felicidades por expandir tu negocio con servicios!** 🎉

Tu emprendimiento ahora puede llegar a **más clientes** y generar **más ingresos**.

*Documento creado con 💜 por el equipo de CRESALIA*




















