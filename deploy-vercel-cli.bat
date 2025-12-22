@echo off
echo ========================================
echo   DEPLOY MANUAL CON VERCEL CLI
echo ========================================
echo.

echo 1. Verificando si Vercel CLI esta instalado...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI no esta instalado. Instalando...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo Error al instalar Vercel CLI
        pause
        exit /b 1
    )
)

echo.
echo 2. Iniciando sesion en Vercel...
vercel login

echo.
echo 3. Haciendo deploy de produccion...
vercel --prod

echo.
echo ========================================
echo   DEPLOY COMPLETADO
echo ========================================
pause








