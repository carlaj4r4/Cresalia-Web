# 🚀 Instrucciones para Subir FRIOCAS Web a Git

## 📋 Pasos para Subir a GitHub

### 1. **Inicializar Git (si no está inicializado)**
```bash
cd "c:\Users\carla\FRIOCAS-Web"
git init
```

### 2. **Configurar Git (si no está configurado)**
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### 3. **Agregar todos los archivos**
```bash
git add .
```

### 4. **Hacer el primer commit**
```bash
git commit -m "🚀 FRIOCAS Web - Versión Final Completa

✨ Características implementadas:
- Sistema de carrito completo
- Verificación de tarjetas reales
- Panel de administración secreto
- Chat de soporte inteligente
- Sistema de facturación profesional
- Capitalización automática
- Notificaciones por email
- Protección de IP y seguridad
- Horario comercial argentino
- Gestión de datos fiscales

🔒 Seguridad:
- Acceso admin oculto (Ctrl+Alt+A o escribir 'admin')
- Protección contra indexación
- Headers de seguridad
- Archivo .htaccess configurado

📧 Funcionalidades:
- Envío automático de emails
- Verificación de pagos en efectivo
- Sistema de comprobantes
- Gestión de productos y ofertas"
```

### 5. **Crear repositorio en GitHub**
1. Ve a [GitHub.com](https://github.com)
2. Haz clic en "New repository"
3. Nombre: `friocas-web`
4. Descripción: "Sitio web profesional para FRIOCAS - Servicios Automotrices"
5. **IMPORTANTE:** Marca como **PRIVATE** para mayor seguridad
6. No inicialices con README (ya tienes archivos)

### 6. **Conectar con GitHub**
```bash
git remote add origin https://github.com/TU-USUARIO/friocas-web.git
git branch -M main
git push -u origin main
```

## 🔐 Configuración de Seguridad

### **Acceso al Panel de Administración:**
- **Método 1:** Presionar `Ctrl + Alt + A`
- **Método 2:** Escribir "admin" en cualquier lugar de la página
- **Duración:** 30 segundos de inactividad

### **Credenciales de Admin:**
- **Usuario:** `friocas_admin`
- **Contraseña:** `FRIOCAS2025!`

## 🌐 Despliegue en Netlify

### 1. **Conectar con Netlify**
1. Ve a [Netlify.com](https://netlify.com)
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio `friocas-web`
4. Configura el dominio personalizado

### 2. **Configuración de Netlify**
- **Build command:** (dejar vacío - es un sitio estático)
- **Publish directory:** `/` (raíz)
- **Domain:** `friocas.netlify.app` (o tu dominio personalizado)

## 📁 Estructura del Proyecto

```
FRIOCAS-Web/
├── index.html              # Página principal
├── styles.css              # Estilos
├── script.js               # Lógica JavaScript
├── .htaccess               # Protección de servidor
├── robots.txt              # Control de buscadores
├── assets/                 # Imágenes y recursos
├── README.md               # Documentación
└── GIT-INSTRUCTIONS.md     # Estas instrucciones
```

## 🔒 Medidas de Seguridad Implementadas

### **Protección de IP:**
- ✅ Headers de seguridad en HTML
- ✅ Archivo .htaccess configurado
- ✅ robots.txt para control de indexación
- ✅ Panel admin oculto por defecto

### **Acceso Restringido:**
- ✅ Botón de admin invisible
- ✅ Acceso solo con combinación de teclas
- ✅ Timeout automático de 30 segundos
- ✅ Repositorio privado recomendado

## 🚀 Comandos Útiles

### **Actualizar cambios:**
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### **Ver estado:**
```bash
git status
git log --oneline
```

### **Crear nueva rama:**
```bash
git checkout -b nueva-funcionalidad
git push -u origin nueva-funcionalidad
```

## 📞 Soporte

Si tienes problemas:
1. Verifica que Git esté instalado: `git --version`
2. Verifica la conexión: `git remote -v`
3. Revisa los logs: `git log --oneline`

¡Tu sitio web está listo para ser profesional y seguro! 🎉
