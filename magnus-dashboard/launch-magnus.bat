@echo off
REM Magnus Infinity Launcher Script (Windows)
REM Simplified interface for running Magnus ∞

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║                                                       ║
echo ║              MAGNUS ∞ - LAUNCHER                      ║
echo ║                                                       ║
echo ║  Self-Improving AI with Transparency and Safety       ║
echo ║                                                       ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

REM Show menu
:menu
echo Select test to run:
echo.
echo 1. 🔍 Quick Debug Test (15 cycles, ~30 seconds^)
echo    → Verify autonomous decisions are working
echo.
echo 2. 📊 Extended Decision Test (100 cycles, ~3 minutes^)
echo    → Capture first autonomous decision
echo.
echo 3. 🔄 Continuous Decision Test (until 10 decisions^)
echo    → Capture multiple decisions and validate quality
echo.
echo 4. 🛠️  Scanner Validation (^<1 second^)
echo    → Test Magnus 14 pattern detection
echo.
echo 5. 🚀 Production Run (continuous^)
echo    → Run Magnus Infinity in production mode
echo.
echo 6. 📚 View Documentation
echo    → Open guides and reports
echo.
echo 0. ❌ Exit
echo.

set /p choice="Enter choice [0-6]: "

if "%choice%"=="1" goto debug
if "%choice%"=="2" goto extended
if "%choice%"=="3" goto continuous
if "%choice%"=="4" goto scanner
if "%choice%"=="5" goto production
if "%choice%"=="6" goto docs
if "%choice%"=="0" goto exit
goto invalid

:debug
echo.
echo 🔍 Running Quick Debug Test...
echo.
node debug-decisions.js
goto end

:extended
echo.
echo 📊 Running Extended Decision Test...
echo.
node test-autonomous-decisions.js
goto end

:continuous
echo.
echo 🔄 Running Continuous Decision Test...
echo.
node test-continuous-decisions.js
goto end

:scanner
echo.
echo 🛠️  Running Scanner Validation...
echo.
node test-scanner.js
goto end

:production
echo.
echo 🚀 Starting Magnus Infinity Production Run...
echo    Press Ctrl+C to stop
echo.
set ENABLE_DASHBOARD=false
set ENABLE_API=false
node run-infinity.js
goto end

:docs
echo.
echo 📚 Available Documentation:
echo.
echo    Core Status:
echo    - MAGNUS-INFINITY-FINAL-STATUS.md
echo    - AUTONOMOUS-DECISION-SUCCESS.md
echo    - SCANNER-SUCCESS.md
echo.
echo    Technical:
echo    - MAGNUS-INFINITY-IMPROVEMENTS.md
echo    - TESTING-GUIDE.md
echo.
echo    Getting Started:
echo    - README.md
echo    - QUICK-START.md
echo.
set /p docfile="Open which file? (or press Enter to skip): "
if not "%docfile%"=="" (
    if exist "%docfile%" (
        type "%docfile%" | more
    ) else (
        echo File not found: %docfile%
    )
)
goto end

:invalid
echo.
echo ❌ Invalid choice. Please run again and select 0-6.
echo.
pause
exit /b 1

:exit
echo.
echo 👋 Goodbye!
echo.
exit /b 0

:end
echo.
echo ✅ Complete!
echo.
pause
