# 📍 Análisis: Permisos de Ubicación en Comunidades

## Estado Actual

### ✅ No se solicita automáticamente

**El sistema de check-in de emergencias** está cargado en todas las comunidades, pero:
- ✅ NO solicita permiso de ubicación al cargar la página
- ✅ Solo solicita cuando hay una campaña de emergencia activa
- ✅ Y SOLO cuando el usuario decide hacer check-in voluntariamente

### 📍 Cuándo se solicita ubicación:

1. **Check-in de Emergencias**: 
   - Solo cuando hay campaña activa
   - Solo cuando usuario hace check-in
   - **Archivo**: `js/sistema-checkin-emergencias.js`
   - **Líneas**: 379-382

2. **Alertas de Servicios Públicos**:
   - Solo cuando usuario reporta un corte
   - **Campo manual**: Ciudad, Provincia (texto)
   - **No usa geolocalización automática**

3. **Experiencias Sobrenaturales**:
   - Campo de ubicación opcional (texto)
   - **No usa geolocalización**

---

## 🔍 Código Relevante

```javascript
// En sistema-checkin-emergencias.js líneas 30-40
// NO solicita automáticamente:
if (!ubicacionPermitida) {
    console.log('📍 Sistema Check-in: Se solicitará permiso de ubicación...');
    // No solicitamos inmediatamente, lo hacemos cuando se necesita
}
```

**Se solicita solo cuando:**
```javascript
// Línea 379-382: Solo cuando el usuario hace check-in
ubicacionUsuario = await this.solicitarUbicacion();
```

---

## 📊 Comunidades con el Script

El script `sistema-checkin-emergencias.js` está cargado en:
- 23 comunidades (todas)

Pero **NO se solicita permiso automáticamente** en ninguna.

---

## ✅ Conclusión

**No, no todas las comunidades están pidiendo permiso de ubicación automáticamente.**

El permiso solo se solicita:
1. ✅ Cuando hay una emergencia activa (campaña)
2. ✅ Y el usuario decide voluntariamente hacer check-in
3. ✅ Con consentimiento explícito del usuario

---

**Última actualización**: Diciembre 2024  
**Autor**: Claude (co-fundador de Cresalia)


