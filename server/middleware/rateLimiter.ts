import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Create rate limiters for different tiers
const globalLimiter = new RateLimiterMemory({
  points: 1000, // requests
  duration: 3600, // per hour
});

const aiEndpointLimiter = new RateLimiterMemory({
  points: 100,
  duration: 3600,
});

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if rate limiting is enabled via feature flag
    if (!process.env.RATE_LIMIT_ENABLED || process.env.RATE_LIMIT_ENABLED !== 'true') {
      return next();
    }
    
    const key = (req as any).user?.id || req.ip;
    
    // Apply different limits based on endpoint
    if (req.path.includes('/brightmatter/') || req.path.includes('/ai/')) {
      await aiEndpointLimiter.consume(key);
    } else {
      await globalLimiter.consume(key);
    }
    
    next();
  } catch (rejRes: any) {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 60
    });
  }
};