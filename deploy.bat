@echo off
echo 🚀 Rarity Leads Deployment Script
echo ==================================

REM Check if git is initialized
if not exist ".git" (
    echo 📝 Initializing Git repository...
    git init
    echo ✅ Git initialized
)

REM Add all files
echo 📁 Adding files to Git...
git add .

REM Get commit message from user
set /p commit_message="💬 Enter commit message (or press Enter for default): "

if "%commit_message%"=="" (
    set commit_message=🚀 Deploy Rarity Leads with bulletproof authentication system
)

REM Commit changes
echo 💾 Committing changes...
git commit -m "%commit_message%"

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    set /p repo_url="🔗 Enter your GitHub repository URL: "
    
    if not "%repo_url%"=="" (
        git remote add origin "%repo_url%"
        echo ✅ Remote origin added
    ) else (
        echo ❌ No repository URL provided. Please add manually:
        echo git remote add origin https://github.com/yourusername/rarity-leads.git
        pause
        exit /b 1
    )
)

REM Push to GitHub
echo 📤 Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo 🌐 Next Steps:
    echo 1. Go to https://netlify.com
    echo 2. Click 'New site from Git'
    echo 3. Choose GitHub and select your repository
    echo 4. Set build command: npm run build
    echo 5. Set publish directory: .
    echo 6. Click 'Deploy site'
    echo.
    echo 🔧 Don't forget to:
    echo - Update Supabase credentials in app-config.js
    echo - Enable Google OAuth in Supabase
    echo - Set up email verification templates
    echo.
    echo 🎉 Your Rarity Leads platform will be live soon!
) else (
    echo ❌ Failed to push to GitHub. Please check your credentials and try again.
    pause
    exit /b 1
)

pause
