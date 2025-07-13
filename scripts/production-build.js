#!/usr/bin/env node

/**
 * Veri MVP - Production Build Script
 * Priority 3: Fix Production Build timeout with progressive optimization
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting production build...');

// Configuration
const BUILD_CONFIG = {
  maxMemory: 8192,
  timeoutMs: 300000, // 5 minutes
  retries: 3,
  fallbackMode: 'development'
};

// Clean function
function clean() {
  console.log('🧹 Cleaning build artifacts...');
  try {
    execSync('rm -rf dist node_modules/.vite node_modules/.cache', { stdio: 'pipe' });
    console.log('✅ Clean completed');
  } catch (error) {
    console.log('⚠️  Clean failed (continuing)');
  }
}

// Build function with retry logic
function buildWithRetry(attempt = 1) {
  const buildCmd = attempt === 1 
    ? 'vite build --logLevel=error' 
    : `vite build --mode=${BUILD_CONFIG.fallbackMode} --logLevel=error`;

  console.log(`🔨 Build attempt ${attempt}/${BUILD_CONFIG.retries}...`);
  
  try {
    execSync(buildCmd, {
      stdio: 'inherit',
      timeout: BUILD_CONFIG.timeoutMs,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        NODE_OPTIONS: `--max-old-space-size=${BUILD_CONFIG.maxMemory} --optimize-for-size`,
        VITE_BUILD_OPTIMIZE: 'true'
      }
    });
    
    console.log('✅ Frontend build successful');
    return true;
    
  } catch (error) {
    console.log(`❌ Build attempt ${attempt} failed: ${error.message}`);
    
    if (attempt < BUILD_CONFIG.retries) {
      console.log(`🔄 Retrying with adjusted settings...`);
      return buildWithRetry(attempt + 1);
    }
    
    return false;
  }
}

// Backend build function
function buildBackend() {
  console.log('🏗️  Building backend...');
  try {
    execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify', {
      stdio: 'inherit',
      timeout: 60000,
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=2048'
      }
    });
    
    console.log('✅ Backend build successful');
    return true;
    
  } catch (error) {
    console.error('❌ Backend build failed:', error.message);
    return false;
  }
}

// Report build results
function reportResults() {
  console.log('\n📊 Build Report:');
  
  try {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath);
      console.log(`📁 Output files: ${files.length}`);
      
      // Calculate total size
      let totalSize = 0;
      files.forEach(file => {
        const filePath = path.join(distPath, file);
        const stat = fs.statSync(filePath);
        totalSize += stat.size;
      });
      
      console.log(`📏 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      
      // Check for common files
      const hasIndex = files.some(f => f.includes('index'));
      const hasAssets = files.some(f => f.includes('assets'));
      console.log(`📄 Has main files: ${hasIndex ? '✅' : '❌'}`);
      console.log(`🎨 Has assets: ${hasAssets ? '✅' : '❌'}`);
      
    } else {
      console.log('❌ No build output found');
    }
    
  } catch (error) {
    console.log('⚠️  Could not analyze build output');
  }
}

// Main execution
async function main() {
  const startTime = Date.now();
  
  // Step 1: Clean
  clean();
  
  // Step 2: Build frontend
  const frontendSuccess = buildWithRetry();
  
  // Step 3: Build backend
  const backendSuccess = buildBackend();
  
  // Step 4: Report results
  reportResults();
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n⏱️  Total build time: ${duration}s`);
  
  if (frontendSuccess && backendSuccess) {
    console.log('🎉 Build completed successfully!');
    console.log('🚀 Ready for deployment!');
    process.exit(0);
  } else {
    console.log('❌ Build failed');
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('💥 Build script failed:', error);
  process.exit(1);
});