@echo off
echo ========================================
echo Starting Rarity Leads Project
echo ========================================
echo.

echo Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18.17 or later from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Starting development server...
echo The app will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
npm run dev

pause 