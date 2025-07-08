@echo off
REM Zelgodiz Studio Automated Installer for Windows

REM Step 1: Install dependencies
npm install
IF %ERRORLEVEL% NEQ 0 (
  echo Error: npm install failed.
  pause
  exit /b %ERRORLEVEL%
)

REM Step 2: Build the app
npm run build
IF %ERRORLEVEL% NEQ 0 (
  echo Error: npm run build failed.
  pause
  exit /b %ERRORLEVEL%
)

REM Step 3: Package the Windows installer
npm run dist
IF %ERRORLEVEL% NEQ 0 (
  echo Error: npm run dist failed.
  pause
  exit /b %ERRORLEVEL%
)

REM Step 4: Open the dist folder
start dist

echo.
echo All done! The Windows installer (.exe) is in the dist folder.
pause
