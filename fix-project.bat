@echo off
echo ========================================
echo Rarity Leads Project Fix Script
echo ========================================
echo.

echo Step 1: Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18.17 or later from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Step 2: Clearing Next.js cache...
if exist .next rmdir /s /q .next
echo Cache cleared.

echo.
echo Step 3: Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo Cleaned up.

echo.
echo Step 4: Installing dependencies...
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 5: Starting development server...
echo Starting on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
npm run dev

pause 