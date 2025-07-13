/**
 * Veri MVP - Build Configuration
 * Priority 3: Fix Production Build timeout issues
 */

export const buildConfig = {
  // Optimization settings
  optimization: {
    minify: 'terser',
    sourcemap: false,
    target: 'es2015',
    chunkSizeWarningLimit: 1000,
    
    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
        unused: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    }
  },
  
  // Manual chunks for better code splitting
  chunks: {
    'react-vendor': ['react', 'react-dom'],
    'ui-vendor': [
      'framer-motion',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-select',
      '@radix-ui/react-progress',
      '@radix-ui/react-switch',
      '@radix-ui/react-label',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-avatar',
      '@radix-ui/react-slot'
    ],
    'query-vendor': ['@tanstack/react-query'],
    'utils': ['clsx', 'date-fns', 'zod', 'lucide-react'],
    'auth': ['jsonwebtoken', 'passport', 'passport-local'],
    'db': ['drizzle-orm', 'drizzle-zod', '@neondatabase/serverless']
  },
  
  // Build timeouts and memory limits
  limits: {
    timeout: 300000, // 5 minutes
    memory: 4096, // 4GB max memory
    retries: 3
  }
};

export default buildConfig;