import { Router } from 'express';
import { ConnectionFactory } from '../frameworks/connection/ConnectionFactory';
import { features, getActiveFeatures } from '../config/features';
import { cacheManager } from '../frameworks/cache/CacheManager';
import { getKafkaService } from '../services/kafka';

const router = Router();

// Basic health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Detailed health check with all services
router.get('/health/detailed', async (req, res) => {
  try {
    const healthChecks = await ConnectionFactory.healthCheck();
    
    // Check cache if enabled
    let cacheHealth = false;
    if (features.useRedis) {
      try {
        await cacheManager.set('health:check', true, { ttl: 10 });
        const value = await cacheManager.get('health:check');
        cacheHealth = value === true;
      } catch (error) {
        cacheHealth = false;
      }
    }

    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      features: getActiveFeatures(),
      services: {
        ...healthChecks,
        cache: features.useRedis ? cacheHealth : 'disabled',
        kafka: features.useRedpanda ? 'enabled' : 'disabled',
      },
      memory: {
        rss: process.memoryUsage().rss / 1024 / 1024, // MB
        heapUsed: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      },
    };

    // If any service is unhealthy, return 503
    const allHealthy = Object.values(healthChecks).every(healthy => healthy);
    res.status(allHealthy ? 200 : 503).json(response);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

// Feature flags endpoint
router.get('/health/features', (req, res) => {
  res.json({
    activeFeatures: getActiveFeatures(),
    allFeatures: features,
  });
});

// Readiness check (for Kubernetes/container orchestration)
router.get('/ready', async (req, res) => {
  try {
    const healthChecks = await ConnectionFactory.healthCheck();
    const postgresHealthy = healthChecks.postgres || false;
    
    // For MVP, we only require PostgreSQL to be healthy
    if (postgresHealthy) {
      res.json({ ready: true });
    } else {
      res.status(503).json({ ready: false, reason: 'Database not ready' });
    }
  } catch (error) {
    res.status(503).json({ 
      ready: false, 
      reason: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Liveness check (for Kubernetes/container orchestration)
router.get('/live', (req, res) => {
  res.json({ alive: true });
});

export default router;