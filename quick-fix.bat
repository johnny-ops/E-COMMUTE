@echo off
echo ========================================
echo E-COMMUTE MO! - Quick Fix
echo ========================================
echo.

echo Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo Clearing cache...
npm cache clean --force

echo.
echo Starting Expo...
npx expo start --clear

pause
