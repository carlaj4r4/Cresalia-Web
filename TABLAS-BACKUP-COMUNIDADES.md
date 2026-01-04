# 📋 Tablas de Comunidades Incluidas en el Backup

**Fecha:** 27 de Enero, 2025  
**Estado:** ✅ Actualizado

**IMPORTANTE:** Las comunidades están en un **proyecto SEPARADO de Supabase** (Cresalia-Comunidades).  
Se respaldan con un script y workflow separados.

---

## ✅ Tablas de Comunidades que se Respaldan

### **1. Catálogo y Foros**
- ✅ `comunidades` - Catálogo de todas las comunidades
- ✅ `posts_comunidades` - Posts anónimos de cada comunidad
- ✅ `comentarios_comunidades` - Comentarios de los posts
- ✅ `reacciones_comunidades` - Reacciones (likes, abrazos, etc.)

### **2. Comunidades de Usuarios**
- ✅ `comunidad_vendedores` - Perfiles de vendedores en la comunidad
- ✅ `comunidad_compradores` - Perfiles de compradores en la comunidad
- ✅ `reportes_comunidad` - Reportes entre usuarios

### **3. Funcionalidades Adicionales**
- ✅ `cumpleanos_historial` - Historial de cumpleaños y celebraciones
- ✅ `mentor_sesiones` - Sesiones de mentoría (si existe)
- ✅ `mentor_metricas_resumen` - Métricas de mentoría (si existe)

---

## 📊 Total de Tablas Respaldadas

**Cresalia-Tiendas (proyecto separado):** ~14 tablas  
**Cresalia-Comunidades (proyecto separado):** 9 tablas  
**Total:** 23 tablas en 2 proyectos separados

---

## 🔄 Próximo Backup

El próximo backup automático (diario a las 2 AM UTC) incluirá:
- ✅ Backup de Tiendas (proyecto Cresalia-Tiendas)
- ✅ Backup de Comunidades (proyecto Cresalia-Comunidades)

También puedes ejecutar un backup manual desde GitHub Actions → "Backup Manual de Supabase (Tiendas + Comunidades)" → "Run workflow".

**Nota:** Necesitas configurar 4 secrets en GitHub:
1. `SUPABASE_URL` (Tiendas)
2. `SUPABASE_SERVICE_KEY` (Tiendas)
3. `SUPABASE_URL_COMUNIDADES` (Comunidades)
4. `SUPABASE_SERVICE_KEY_COMUNIDADES` (Comunidades)

Ver `CONFIGURAR-BACKUPS-DOS-PROYECTOS.md` para más detalles.

---

## 📁 Ubicación de los Backups

Los backups se guardan como **artefactos** en GitHub Actions:
1. Ve a **Actions** → Click en el workflow de backup
2. Scroll hacia abajo hasta **"Artifacts"**
3. Descarga el archivo `.tar.gz` o los archivos `.json` individuales

---

*Última actualización: 27 de Enero, 2025*

