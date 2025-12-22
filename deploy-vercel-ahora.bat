@echo off
echo ========================================
echo   DEPLOY MANUAL A VERCEL
echo ========================================
echo.

echo 1. Verificando si Vercel CLI esta instalado...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Vercel CLI no esta instalado.
    echo Instalando Vercel CLI...
    echo.
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo.
        echo Error al instalar Vercel CLI
        echo Por favor instala Node.js primero: https://nodejs.org
        pause
        exit /b 1
    )
    echo.
    echo Vercel CLI instalado correctamente!
)

echo.
echo 2. Verificando si estas logueado...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo No estas logueado en Vercel.
    echo Abriendo login...
    echo.
    vercel login
    if %errorlevel% neq 0 (
        echo.
        echo Error al iniciar sesion
        pause
        exit /b 1
    )
)

echo.
echo 3. Haciendo deploy de produccion...
echo.
vercel --prod

echo.
echo ========================================
echo   DEPLOY COMPLETADO
echo ========================================
echo.
echo Ve a https://vercel.com para ver tu deploy
echo.
pause








