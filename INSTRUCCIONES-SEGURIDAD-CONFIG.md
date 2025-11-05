# 🔒 INSTRUCCIONES DE SEGURIDAD - CONFIGURACIÓN

## ✅ **LO QUE ACABAMOS DE HACER:**

1. ✅ Agregado `config-supabase-seguro.js` al `.gitignore`
2. ✅ Removido `config-supabase-seguro.js` del tracking de Git
3. ✅ Creado `config-supabase-seguro.ejemplo.js` como plantilla

---

## 🛡️ **ARCHIVOS PROTEGIDOS (NO SE SUBEN A GITHUB):**

Los siguientes archivos están en `.gitignore` y **NO se subirán a GitHub**:

- ✅ `config-supabase-seguro.js` - Contiene tus claves de Supabase
- ✅ `config-privado.js` - Contiene contraseñas de administración
- ✅ `config-mercado-pago.js` - Contiene claves de Mercado Pago

---

## 📋 **QUÉ HACER SI TRABAJAS EN OTRO EQUIPO:**

Si clonas el repositorio en otro equipo, necesitarás:

1. **Copiar el archivo de ejemplo:**
   ```bash
   cp config-supabase-seguro.ejemplo.js config-supabase-seguro.js
   ```

2. **Configurar tus credenciales:**
   - Abre `config-supabase-seguro.js`
   - Reemplaza `REEMPLAZA_CON_TU_URL_DE_SUPABASE` con tu URL
   - Reemplaza `REEMPLAZA_CON_TU_ANON_KEY` con tu anon key
   - Reemplaza `REEMPLAZA_CON_TU_SERVICE_ROLE_KEY_LOCALMENTE` con tu service role key

3. **Verificar que funciona:**
   - Abre cualquier página que use Supabase
   - Verifica en la consola que no haya errores de conexión

---

## ⚠️ **IMPORTANTE:**

- **NUNCA** subas archivos con claves reales a GitHub
- **NUNCA** compartas tus claves con nadie
- **SIEMPRE** usa el archivo `.ejemplo.js` como base
- **SIEMPRE** verifica que los archivos sensibles estén en `.gitignore`

---

## 🔍 **VERIFICAR QUE ESTÁ PROTEGIDO:**

Para verificar que un archivo está protegido, ejecuta:

```bash
git check-ignore config-supabase-seguro.js
```

Si dice `config-supabase-seguro.js`, significa que está siendo ignorado correctamente.

---

## 💜 **SEGURIDAD PRIMERO:**

> **"Proteger tus credenciales es proteger tu proyecto y a tus usuarios"**

---

**💜 Creado para proteger tus datos - Crisla & Claude**

