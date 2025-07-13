#!/usr/bin/env node

/**
 * Veri MVP - Simple Production Build
 * Priority 3: Fix Production Build timeout with streamlined approach
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting simplified production build...');

// Clean build artifacts
console.log('🧹 Cleaning...');
try {
  execSync('rm -rf dist node_modules/.vite', { stdio: 'pipe' });
} catch (e) {
  // Ignore cleanup errors
}

// Build with increased memory and timeout
console.log('🔨 Building frontend...');
try {
  execSync('vite build --mode=production', {
    stdio: 'inherit',
    timeout: 180000, // 3 minutes
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=6144'
    }
  });
  
  console.log('✅ Frontend build completed');
  
  // Build backend
  console.log('🏗️  Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify', {
    stdio: 'inherit',
    timeout: 30000
  });
  
  console.log('✅ Backend build completed');
  
  // Check output
  const distPath = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log(`📁 Generated ${files.length} files`);
    console.log('🎉 Build successful!');
  } else {
    console.log('❌ No build output found');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('🚀 Ready for deployment!');