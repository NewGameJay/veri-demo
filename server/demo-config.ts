/**
 * Demo Mode Configuration
 * Determines when to use demo mode vs production mode
 */

// Demo mode is enabled when:
// 1. NODE_ENV is not production
// 2. DATABASE_URL is not set or contains 'demo'
// 3. DEMO_MODE environment variable is explicitly set to 'true'
export const isDemoMode = (): boolean => {
  const nodeEnv = process.env.NODE_ENV;
  const databaseUrl = process.env.DATABASE_URL;
  const demoMode = process.env.DEMO_MODE;

  // Explicit demo mode
  if (demoMode === 'true') {
    return true;
  }

  // Force demo mode for Netlify/GitHub deployments (no database connection)
  if (!databaseUrl) {
    return true;
  }

  // Production mode explicitly disabled demo only if database URL is set
  if (nodeEnv === 'production' && databaseUrl && demoMode !== 'true') {
    return false;
  }

  // Demo mode if database URL contains 'demo'
  if (databaseUrl && databaseUrl.includes('demo')) {
    return true;
  }

  // Default to demo mode for development or when no database
  return nodeEnv !== 'production' || !databaseUrl;
};

export const getDemoConfig = () => ({
  isDemo: isDemoMode(),
  skipAuth: false, // Users must go through signup/login first
  skipExternalServices: isDemoMode(),
  autoLogin: false, // No automatic login - users must click signup/login
  demoUserId: 1, // Default demo user ID
});

console.log('Demo mode configuration:', getDemoConfig());