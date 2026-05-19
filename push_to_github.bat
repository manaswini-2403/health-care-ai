@echo off
echo ========================================================
echo 🚀 UPLOADING HEALTH-CARE-AI TO GITHUB
echo ========================================================
echo.
echo [1/3] Navigating to project root directory...
cd /d "%~dp0"

echo.
echo [2/3] Checking current Git status...
git status

echo.
echo [3/3] Initiating push to GitHub repository...
echo A secure sign-in window may appear. Please click 'Sign in with your browser' to authenticate!
echo.
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ❌ Push failed! If you haven't authenticated, you can also push by pasting your Personal Access Token (PAT):
    echo.
    echo Command format:
    echo git push https://YOUR_GITHUB_TOKEN@github.com/manaswini-2403/health-care-ai.git main
) else (
    echo.
    echo ✅ SUCCESS! Your premium health platform is now live on your GitHub repository!
)
echo.
pause
