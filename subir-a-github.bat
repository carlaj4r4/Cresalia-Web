@echo off
echo ====================================
echo    SUBIR PROYECTO A GITHUB
echo ====================================
echo.

cd /d "C:\Users\carla\Cresalia-Web"

echo [1/4] Verificando ubicacion...
cd
echo OK - Estamos en la carpeta correcta
echo.

echo [2/4] Agregando archivos a Git...
git add .
echo OK - Archivos agregados
echo.

echo [3/4] Creando commit...
git commit -m "Proyecto Cresalia completo: Comunidades Otakus y Gamers, correcciones, claves protegidas"
echo OK - Commit creado
echo.

echo [4/4] Subiendo a GitHub...
git push
echo.

echo ====================================
echo    PROCESO COMPLETADO
echo ====================================
pause

