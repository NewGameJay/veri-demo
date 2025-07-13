#!/usr/bin/env node

/**
 * Veri MVP - Icon Optimization Script
 * Priority 3: Fix Production Build timeout by optimizing icon imports
 * 
 * This script replaces bulk lucide-react imports with specific icon imports
 * to reduce bundle size and build time.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

console.log('🔧 Starting icon optimization...');

// Find all TypeScript/JSX files
function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walk(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

// Extract used icons from file content
function extractUsedIcons(content) {
  const iconRegex = /(?:from ['"]lucide-react['"]|import[^}]*{([^}]*)}[^}]*from ['"]lucide-react['"])/g;
  const icons = new Set();
  
  let match;
  while ((match = iconRegex.exec(content)) !== null) {
    if (match[1]) {
      // Extract individual icon names from import statement
      const iconNames = match[1].split(',').map(name => name.trim()).filter(Boolean);
      iconNames.forEach(name => icons.add(name));
    }
  }
  
  return Array.from(icons);
}

// Optimize icon imports in a file
function optimizeFileIcons(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const usedIcons = extractUsedIcons(content);
  
  if (usedIcons.length === 0) return false;
  
  let optimized = content;
  
  // Replace bulk imports with specific imports
  const bulkImportRegex = /import\s*{[^}]*}\s*from\s*['"]lucide-react['"];?/g;
  const specificImports = usedIcons.map(icon => 
    `import { ${icon} } from 'lucide-react/dist/esm/icons/${icon.toLowerCase().replace(/([A-Z])/g, '-$1').substring(1)}';`
  ).join('\n');
  
  optimized = optimized.replace(bulkImportRegex, specificImports);
  
  if (optimized !== content) {
    fs.writeFileSync(filePath, optimized);
    return true;
  }
  
  return false;
}

// Main optimization process
const clientDir = path.join(projectRoot, 'client', 'src');
const files = findFiles(clientDir);

let optimizedCount = 0;
let totalIcons = 0;

console.log(`📁 Found ${files.length} files to check...`);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const usedIcons = extractUsedIcons(content);
  
  if (usedIcons.length > 0) {
    console.log(`🔍 ${path.relative(projectRoot, file)}: ${usedIcons.length} icons`);
    totalIcons += usedIcons.length;
    
    if (optimizeFileIcons(file)) {
      optimizedCount++;
    }
  }
}

console.log(`✅ Optimization complete!`);
console.log(`📊 Files optimized: ${optimizedCount}/${files.length}`);
console.log(`🎯 Total icons found: ${totalIcons}`);
console.log(`⚡ This should significantly reduce build time!`);

// Create a summary report
const reportPath = path.join(projectRoot, 'icon-optimization-report.json');
const report = {
  timestamp: new Date().toISOString(),
  filesProcessed: files.length,
  filesOptimized: optimizedCount,
  totalIcons: totalIcons,
  buildOptimization: 'Icons converted to specific imports to reduce bundle size'
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📄 Report saved to: ${reportPath}`);