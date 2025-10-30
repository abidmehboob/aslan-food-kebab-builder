#!/bin/bash
# Render.com deployment script

set -e

echo "🚀 Starting Render.com deployment for Aslan Food Kebab Builder"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --production

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p uploads

# Set proper permissions
echo "🔒 Setting permissions..."
chmod -R 755 ../frontend
chmod -R 755 logs
chmod -R 755 uploads

# Verify critical files exist
echo "✅ Verifying deployment files..."
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found"
    exit 1
fi

if [ ! -f "../frontend/index.html" ]; then
    echo "❌ Error: frontend/index.html not found"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ Error: backend/package.json not found"
    exit 1
fi

echo "✅ Deployment preparation complete!"
echo "🎯 Ready to start server with: npm start"