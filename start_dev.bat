@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
echo ============================================
echo   Atlan Hub - Memulai Server...
echo ============================================
echo.
echo [1/2] Memulai Backend API (port 3001)...
start "Atlan Backend" cmd /k "set PATH=C:\Program Files\nodejs;%PATH% && node server.js"
timeout /t 2 /nobreak > nul
echo [2/2] Memulai Frontend Vite (port 5173)...
echo.
echo Buka di browser: http://localhost:5173
echo.
npm run dev
