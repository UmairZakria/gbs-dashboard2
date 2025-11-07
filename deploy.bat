@echo off
REM Ecommerce Dashboard Deployment Script for Windows

echo 🚀 Starting deployment process...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Run tests (if available)
if exist "package.json" (
    findstr /C:"\"test\":" package.json >nul 2>&1
    if %errorlevel% equ 0 (
        echo 🧪 Running tests...
        call npm test -- --watchAll=false
        
        if %errorlevel% neq 0 (
            echo ❌ Tests failed
            pause
            exit /b 1
        )
        
        echo ✅ Tests passed
    )
)

REM Build the application
echo 🔨 Building the application...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully

REM Check if build directory exists
if not exist "build" (
    echo ❌ Build directory not found
    pause
    exit /b 1
)

echo 📁 Build directory created at: %cd%\build

REM Optional: Start the application
if "%1"=="--start" (
    echo 🌐 Starting the application...
    call npm start
) else if "%1"=="--serve" (
    echo 🌐 Serving the built application...
    call npx serve -s build -l 3000
) else (
    echo ✅ Deployment completed successfully!
    echo 📁 Your built application is in the 'build' directory
    echo 🌐 To serve it locally, run: npx serve -s build -l 3000
    echo 🚀 To start development server, run: npm start
)

pause 