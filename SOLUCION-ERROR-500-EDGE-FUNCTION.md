# 🔧 Solución: Error 500 en Edge Function

## ❌ Error Reportado

```
500
Unexpected non-whitespace character after JSON at position 24 (line 1 column 25)
```

---

## 🔍 Análisis del Problema

### **Causa Posible**:

El error "Unexpected non-whitespace character after JSON at position 24" indica que:
1. El JSON es válido hasta la posición 24
2. Hay caracteres extra **después** del JSON válido
3. Por ejemplo: `{"alerta_id": 123}xyz` ← el `xyz` causa el error

### **Posibles Orígenes**:

1. **Body con caracteres extra**: El request body tiene algo después del JSON
2. **Encoding incorrecto**: Problemas con UTF-8 o caracteres especiales
3. **Headers incorrectos**: `Content-Type` no está configurado correctamente
4. **Body duplicado**: Se está enviando el body dos veces

---

## ✅ Solución Implementada

### **1. Validación Mejorada en Edge Function**:

```typescript
// Limpiar el body: remover espacios al inicio/final
const bodyClean = bodyText.trim()

// Verificar que empiece con { o [
if (!bodyClean.startsWith('{') && !bodyClean.startsWith('[')) {
    return new Response(
        JSON.stringify({ error: 'Body no es JSON válido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
}

// Parsear JSON de forma segura
const parsed = JSON.parse(bodyClean)
```

### **2. Mejoras en el Cliente**:

```javascript
// Preparar body limpio
const bodyData = {
    alerta_id: id
};

const bodyString = JSON.stringify(bodyData);

// Agregar header apikey (requerido por Supabase)
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${anonKey}`,
    'apikey': anonKey // ← NUEVO
}
```

---

## 🧪 Cómo Verificar

### **Test 1: Ver Logs de Edge Function**

1. Ir a **Supabase Dashboard** → **Edge Functions** → **enviar-emails-alerta**
2. Click en **"Logs"**
3. Crear una alerta desde el panel
4. Verificar logs:
   - ¿Aparece "📧 Procesando alerta ID: X"? ✅
   - ¿Aparece error de JSON? ❌ NO debería

### **Test 2: Ver Request en Network Tab**

1. Abrir **DevTools** (F12)
2. Ir a **Network** tab
3. Crear una alerta
4. Buscar request a `enviar-emails-alerta`
5. Click en el request → **Payload**
6. Verificar:
   - **Request Payload**: `{"alerta_id": 123}` ✅
   - **Content-Type**: `application/json` ✅
   - **Headers**: `Authorization` y `apikey` presentes ✅

---

## 📋 Checklist de Verificación

- [ ] Edge Function tiene validación de JSON mejorada
- [ ] Cliente envía `apikey` en headers
- [ ] Body se limpia antes de parsear
- [ ] Logs muestran preview del body si hay error
- [ ] Content-Type está configurado correctamente

---

## 💡 Si Sigue el Error

### **Debug Adicional**:

1. **Ver body completo en logs**:
   - La Edge Function ahora loggea los primeros 100 caracteres del body
   - Revisar en Supabase Dashboard → Logs

2. **Verificar desde el cliente**:
   - Abrir Console (F12)
   - Verificar que aparece: "📧 Enviando request a Edge Function"
   - Verificar que `body` es un JSON válido

3. **Probar manualmente con cURL**:
```bash
curl -X POST 'https://zbomxayytvwjbdzbegcw.supabase.co/functions/v1/enviar-emails-alerta' \
-H 'Authorization: Bearer TU_ANON_KEY' \
-H 'apikey: TU_ANON_KEY' \
-H 'Content-Type: application/json' \
-d '{"alerta_id": 123}'
```

---

## 🎯 Resultado Esperado

Después de estos cambios:

✅ **Edge Function valida JSON correctamente**  
✅ **Cliente envía headers completos**  
✅ **Errores muestran más información para debug**  
✅ **Body se limpia antes de parsear**

---

¿Probamos crear una alerta y ver si el error desaparece? 😊💜
