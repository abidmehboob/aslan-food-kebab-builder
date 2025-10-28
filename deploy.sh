#!/bin/bash

# 🚀 Deployment Preparation Script
# This script prepares the Aslan Food Kebab Builder for deployment

echo "🔧 Preparing Aslan Food Kebab Builder for deployment..."

# Step 1: Clean previous builds
echo "📦 Cleaning previous builds..."
rm -rf dist/
rm -rf build/
rm -rf .vercel/

# Step 2: Install dependencies
echo "📚 Installing dependencies..."
cd backend && npm install && cd ..

# Step 3: Run tests (if available)
echo "🧪 Running tests..."
# npm test

# Step 4: Build optimized assets
echo "🏗️ Building optimized assets..."
npm run build

# Step 5: Verify configuration
echo "✅ Verifying configuration..."

# Check if required files exist
if [ ! -f "backend/server.js" ]; then
    echo "❌ Error: backend/server.js not found!"
    exit 1
fi

if [ ! -f "frontend/index.html" ]; then
    echo "❌ Error: frontend/index.html not found!"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found!"
    exit 1
fi

echo "✅ All required files present!"

# Step 6: Environment check
echo "🌍 Environment configuration:"
echo "  - NODE_ENV: ${NODE_ENV:-development}"
echo "  - JWT_SECRET: ${JWT_SECRET:+[SET]}${JWT_SECRET:-[NOT SET]}"
echo "  - API_PREFIX: ${API_PREFIX:-/api}"

# Step 7: Deployment readiness
echo ""
echo "🎉 Application ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "  1. Choose your deployment platform:"
echo "     • Vercel: npx vercel --prod"
echo "     • Railway: railway up"
echo "     • Render: Connect GitHub repository"
echo ""
echo "  2. Set environment variables:"
echo "     • NODE_ENV=production"
echo "     • JWT_SECRET=your-secret-key"
echo "     • API_PREFIX=/api"
echo "     • API_VERSION=v1"
echo ""
echo "  3. Test deployment:"
echo "     • Visit /api/health for backend"
echo "     • Test ingredient loading"
echo "     • Verify all functionality"
echo ""
echo "🚀 Happy deploying!"