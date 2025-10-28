@echo off
echo 🔧 Preparing Aslan Food Kebab Builder for deployment...

REM Step 1: Clean previous builds
echo 📦 Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build
if exist .vercel rmdir /s /q .vercel

REM Step 2: Install dependencies
echo 📚 Installing dependencies...
cd backend
npm install
cd ..

REM Step 3: Build optimized assets
echo 🏗️ Building optimized assets...
npm run build

REM Step 4: Verify configuration
echo ✅ Verifying configuration...

if not exist "backend\server.js" (
    echo ❌ Error: backend\server.js not found!
    pause
    exit /b 1
)

if not exist "frontend\index.html" (
    echo ❌ Error: frontend\index.html not found!
    pause
    exit /b 1
)

if not exist "vercel.json" (
    echo ❌ Error: vercel.json not found!
    pause
    exit /b 1
)

echo ✅ All required files present!

REM Step 5: Environment check
echo 🌍 Environment configuration:
echo   - NODE_ENV: %NODE_ENV%
echo   - JWT_SECRET: [CHECK MANUALLY]
echo   - API_PREFIX: %API_PREFIX%

REM Step 6: Deployment readiness
echo.
echo 🎉 Application ready for deployment!
echo.
echo 📋 Next steps:
echo   1. Choose your deployment platform:
echo      • Vercel: npx vercel --prod
echo      • Railway: railway up  
echo      • Render: Connect GitHub repository
echo.
echo   2. Set environment variables:
echo      • NODE_ENV=production
echo      • JWT_SECRET=your-secret-key
echo      • API_PREFIX=/api
echo      • API_VERSION=v1
echo.
echo   3. Test deployment:
echo      • Visit /api/health for backend
echo      • Test ingredient loading
echo      • Verify all functionality
echo.
echo 🚀 Happy deploying!
pause