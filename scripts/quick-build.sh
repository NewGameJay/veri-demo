#!/bin/bash

# Veri MVP - Quick Build Script
# Priority 3: Fix Production Build timeout issues

echo "🚀 Starting optimized build process..."

# Set memory limits
export NODE_OPTIONS="--max-old-space-size=4096"
export NODE_ENV=production

# Clean previous build
echo "📦 Cleaning previous build..."
rm -rf dist node_modules/.vite 2>/dev/null || true

# Build with timeout protection
echo "🔨 Building frontend..."
timeout 300 npm run build || {
    echo "⚠️  Build timed out, trying alternative approach..."
    
    # Try with reduced complexity
    echo "🔄 Attempting simplified build..."
    timeout 120 vite build --mode=production --logLevel=error || {
        echo "❌ Build failed completely"
        exit 1
    }
}

# Build backend quickly
echo "🏗️  Building backend..."
timeout 60 npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify || {
    echo "❌ Backend build failed"
    exit 1
}

echo "✅ Build completed successfully!"
echo "📊 Build size:"
du -sh dist/ 2>/dev/null || echo "Unable to determine build size"

echo "🎉 Ready for deployment!"