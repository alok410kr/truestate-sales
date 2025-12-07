@echo off
echo 🚀 Installing TruEstate Sales Management System...
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    exit /b %errorlevel%
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    exit /b %errorlevel%
)
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b %errorlevel%
)
cd ..

echo.
echo ✅ Installation complete!
echo.
echo To start the application, run:
echo   npm run dev
echo.
echo The application will be available at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo Note: The backend needs 30-60 seconds to load the CSV data (1M+ records) on first start.
echo.
pause
