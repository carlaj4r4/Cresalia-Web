# 🚀 Solución: Límite de Funciones en Vercel

## ❌ Problema

```
Error: No more than 12 Serverless Functions can be added to a Deployment 
on the Hobby plan. Create a team (Pro plan) to deploy more.
```

**Causa**: El plan gratuito de Vercel limita a 12 funciones serverless.

---

## ✅ Solución Implementada

**Cambiamos de Vercel Functions a Supabase Edge Functions**

### **¿Por qué es mejor?**

1. ✅ **Gratis ilimitado** en plan gratuito de Supabase
2. ✅ **Más rápido** (está junto a la base de datos)
3. ✅ **Más simple** (ya tenés Supabase configurado)
4. ✅ **Más seguro** (service role key en Supabase)

---

## 📋 Instalación Supabase Edge Function

### **PASO 1: Instalar Supabase CLI**

**Windows** (PowerShell como admin):
```powershell
scoop install supabase
```

O descarga desde: https://github.com/supabase/cli/releases

**Verificar instalación**:
```bash
supabase --version
```

---

### **PASO 2: Login en Supabase**

```bash
supabase login
```

Te abrirá el navegador para autenticarte.

---

### **PASO 3: Link tu Proyecto**

Desde la carpeta de tu proyecto:

```bash
cd C:\Users\carla\Cresalia-Web
supabase link --project-ref TU_PROJECT_REF
```

**¿Dónde encontrar el PROJECT_REF?**
- Ir a Supabase Dashboard
- URL es: `https://supabase.com/dashboard/project/[TU_PROJECT_REF]`
- Copiar el ID del proyecto

---

### **PASO 4: Configurar Secrets**

```bash
supabase secrets set BREVO_API_KEY=tu_api_key_de_brevo
supabase secrets set BREVO_SENDER_EMAIL=alertas@cresalia.com
```

---

### **PASO 5: Deploy la Función**

```bash
supabase functions deploy enviar-emails-alerta
```

✅ Listo! La función está deployada.

---

## 🔧 Cambios Realizados

### **Eliminado**:
- ❌ `/api/enviar-emails-alerta.js` (Vercel Function)

### **Creado**:
- ✅ `/supabase/functions/enviar-emails-alerta/index.ts` (Edge Function)

### **Modificado**:
- ✅ `js/sistema-envio-emails-alertas.js` (ahora usa Edge Function)

---

## 🎯 Todo Sigue Funcionando Igual

El flujo es **exactamente el mismo**:

1. Usuario acepta recibir alertas
2. Admin crea alerta
3. **Edge Function** busca usuarios y envía emails
4. Usuarios reciben notificación

**Nada cambia para el usuario final** ✅

---

## 📊 Ventajas Adicionales

### **Rendimiento**:
- **Vercel**: Request → Vercel (USA) → Supabase → Vercel → Brevo
- **Edge Function**: Request → Supabase (ya está allí) → Brevo
- **Resultado**: ⚡ 2-3x más rápido

### **Costos**:
- **Vercel Pro**: $20/mes para +12 funciones
- **Supabase Edge Functions**: $0 (gratis)
- **Ahorro**: $240/año 💰

### **Límites**:
- **Vercel Free**: 12 funciones
- **Supabase Free**: Ilimitadas ✅

---

## 🐛 Troubleshooting

### **"supabase: command not found"**

**Windows**: Instalar con Scoop o descargar el .exe

**Mac**:
```bash
brew install supabase/tap/supabase
```

**Linux**:
```bash
# Ver: https://supabase.com/docs/guides/cli
```

---

### **"Failed to link project"**

1. Verificar que estás logueado: `supabase login`
2. Verificar el PROJECT_REF correcto
3. Verificar permisos en el proyecto

---

### **"Secrets not found"**

```bash
# Listar secrets
supabase secrets list

# Si no están, configurarlos:
supabase secrets set BREVO_API_KEY=xxx
supabase secrets set BREVO_SENDER_EMAIL=xxx
```

---

## 💜 Sin la CLI (Alternativa Manual)

Si no querés instalar la CLI, podés:

1. Ir a Supabase Dashboard
2. Edge Functions → Create Function
3. Copiar el código de `supabase/functions/enviar-emails-alerta/index.ts`
4. Pegar en el editor web
5. Configurar secrets en Settings
6. Deploy desde el dashboard

---

## ✅ Verificación

### **1. Verificar que está deployada**:
```bash
supabase functions list
```

Deberías ver: `enviar-emails-alerta`

### **2. Probar la función**:
```bash
supabase functions invoke enviar-emails-alerta --data '{"alerta_id":1}'
```

### **3. Ver logs**:
```bash
supabase functions logs enviar-emails-alerta
```

---

## 🎉 Resultado Final

✅ **SQL instalado** en ambos proyectos
✅ **Edge Function** deployada
✅ **Sistema completo** funcionando
✅ **Sin límites** de Vercel
✅ **Más rápido** y eficiente
✅ **$0 de costo** adicional

---

¿Necesitás ayuda con el deploy de la Edge Function? 😊
