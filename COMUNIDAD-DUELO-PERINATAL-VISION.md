# 🤍 COMUNIDAD DUEL0 PERINATAL Y FERTILIDAD - Visión y Propósito

**Creado por:** Carla & Cofy  
**Fecha:** Noviembre 2025  
**Estado:** 🟣 Visión aprobada – iniciar implementación  
**Objetivo:** acompañar a mujeres y familias que atraviesan pérdidas gestacionales, infertilidad, partos prematuros o embarazos de alto riesgo.

---

## 🌱 ¿Por qué crear un espacio exclusivo?
- Porque perder un embarazo, un recién nacido o enfrentar tratamientos de fertilidad es un duelo silenciado.
- Porque muchas mujeres sienten culpa, vergüenza o se enfrentan a comentarios crueles (“al menos podés intentarlo de nuevo”).
- Porque las parejas y redes de apoyo también sufren, pero no encuentran dónde hablarlo con respeto.
- Porque cada etapa (búsqueda, tratamiento, pérdida, nuevo embarazo arcoíris) necesita contención específica.

**Esta comunidad existe para decir:**  
> *“Tu dolor es válido. Tu historia merece ser escuchada. No estás sola.”*

---

## 💜 Valores guía
1. **Validación total del duelo**  
   - Nunca minimizamos la pérdida (“solo era un feto”, “sos joven”).  
   - Reconocemos cualquier vínculo: embriones, embarazos tempranos, partos prematuros, recién nacidos.

2. **Lenguaje cuidadoso y sin juicios**  
   - Evitamos preguntas invasivas (“¿y cuándo buscan otro bebé?”).  
   - No romantizamos el sufrimiento ni imponemos visiones religiosas.

3. **Espacio seguro para mujeres y parejas**  
   - Enfocado en la experiencia de quien gesta, pero abierto a acompañantes que deseen sumarse con respeto.

4. **Privacidad y autonomía**  
   - Alias anónimos, opción de publicar sin detalles médicos.  
   - Recursos para quienes necesitan hablar en privado o con profesionales.

5. **Esperanza responsable**  
   - Celebramos los logros (un control médico, una eco, un tratamiento) sin presionar con “pensá positivo”.

---

## 🌼 Qué ofrece la comunidad
### 1. Foro empático categorizado
- Búsqueda y fertilidad (tratamientos, adopción, pausa médica).  
- Pérdida gestacional temprana.  
- Pérdida perinatal / neonatal.  
- Embarazo arcoíris y miedo a repetir la historia.  
- Parejas / acompañantes que desean comprender mejor.  
- Celebraciones sin culpa (recordatorios, rituales, cartas).

### 2. Recursos de apoyo
- Guías para enfrentar fechas difíciles (aniversarios, Día de la Madre/Padre, controles médicos).  
- Listado de profesionales sensibles al duelo perinatal (psicología, obstetricia, doulas).  
- Técnicas de autocuidado, grounding y regulación emocional.  
- Plantillas para rituales de despedida, cartas para bebés estrella, cajas de memoria.

### 3. Herramientas opcionales
- Recordatorios privados de fechas significativas con mensajes de contención.  
- Espacio de memorial (guardar textos, fotos, ecografías – privado por defecto).  
- Calendario de grupos virtuales moderados por Cresalia.

### 4. Moderación especializada
- Moderadores con entrenamiento en duelo gestacional/perinatal y violencia obstétrica.  
- Filtro automático contra frases dañinas y comparaciones (“eso no es nada, yo…”).  
- Protocolos para usuarios en crisis emocional (derivación a líneas de ayuda).

---

## 🧠 Arquitectura técnica (Supabase)
Usamos las tablas generales `posts_comunidades`, `comentarios_comunidades`, `reacciones_comunidades`.  
Para enriquecer esta comunidad agregamos:

```sql
-- Tabla de recursos específicos
CREATE TABLE IF NOT EXISTS recursos_duelo_perinatal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria TEXT CHECK (categoria IN (
        'informacion_medica',
        'tecnica_autocuidado',
        'ritual_memoria',
        'contacto_profesional',
        'grupo_apoyo',
        'lectura_recomendada'
    )),
    titulo TEXT NOT NULL,
    descripcion TEXT,
    enlace TEXT,
    creado_por UUID,
    verificado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla opcional de fechas significativas
CREATE TABLE IF NOT EXISTS hitos_duelo_perinatal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    autor_hash TEXT NOT NULL,
    comunidad_slug TEXT NOT NULL DEFAULT 'duelo-perinatal',
    tipo TEXT CHECK (tipo IN ('aniversario', 'fecha_prevista', 'tratamiento', 'otro')),
    fecha DATE NOT NULL,
    mensaje TEXT,
    recordatorio BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Frontend
- Nuevo directorio `comunidades/duelo-perinatal/` con landing + foro + recursos.  
- Paleta: lavanda suave (#C4B5FD) + turquesa (#5EEAD4) para transmitir calma.  
- CTA principales: “Compartir mi historia”, “Descargar ritual”, “Pedir apoyo profesional”.

### Integraciones
- Activar sistema de validación si la persona desea compartir detalles médicos (para evitar trolls).  
- Conectar con `SistemaAlertasComunidades` para envíos segmentados (ej. alertas de memorial colectivo).  
- Añadir métricas específicas en panel master (cuántos recursos descargados, recordatorios activos, etc.).

---

## ✅ Próximos pasos de implementación
1. Crear `comunidades/duelo-perinatal/index.html` replicando la estructura de comunidades actuales.  
2. Configurar slug en `agregar-foro-comunidades.js`, `supabase-comunidades-foro.sql` y paneles.  
3. Añadir enlaces desde secciones relevantes (mujeres sobrevivientes, duelo general, madres/padres).  
4. Preparar kit inicial de recursos (PDF ejercicios, directorio de profesionales).  
5. Difundir suavemente en redes internas (sin exponer historias).

---

## 💬 Mensaje final para la comunidad
> *“Aunque el mundo no lo haya visto, tu bebé existió. Tu corazón sabe amar, incluso entre lágrimas. Aquí puedes nombrarlo, gritar, llorar, abrazar la esperanza o simplemente respirar.”*

Seguimos construyendo Cresalia con amor, respeto y contención. 💜🤍



