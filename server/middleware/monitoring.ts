import { Request, Response, NextFunction } from 'express';
import { metricsCollector, METRICS } from '../frameworks/observability/MetricsCollector';

// Request timing middleware
export function requestTiming(req: Request, res: Response, next: NextFunction) {
  const timer = metricsCollector.timer(METRICS.API_REQUEST_DURATION, {
    method: req.method,
    route: req.route?.path || req.path,
  });

  // Track response
  res.on('finish', () => {
    timer();
    
    metricsCollector.increment(METRICS.API_REQUEST_COUNT, 1, {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode.toString(),
    });

    if (res.statusCode >= 400) {
      metricsCollector.increment(METRICS.API_ERROR_COUNT, 1, {
        method: req.method,
        route: req.route?.path || req.path,
        status: res.statusCode.toString(),
      });
    }
  });

  next();
}

// Database query tracking
export function trackDatabaseQuery(queryName: string) {
  return {
    start: () => {
      const timer = metricsCollector.timer(METRICS.DB_QUERY_DURATION, {
        query: queryName,
      });
      
      metricsCollector.increment(METRICS.DB_QUERY_COUNT, 1, {
        query: queryName,
      });

      return timer;
    }
  };
}

// Cache tracking
export function trackCacheOperation(operation: 'hit' | 'miss' | 'set', key: string) {
  const metric = operation === 'hit' ? METRICS.CACHE_HIT_COUNT :
                 operation === 'miss' ? METRICS.CACHE_MISS_COUNT :
                 METRICS.CACHE_SET_COUNT;
  
  metricsCollector.increment(metric, 1, {
    key: key.split(':')[0], // Use key prefix as tag
  });
}

// Business metrics tracking
export function trackBusinessMetric(metric: string, value = 1, tags?: Record<string, string>) {
  metricsCollector.increment(metric, value, tags);
}

// Error tracking middleware
export function errorTracking(err: Error, req: Request, res: Response, next: NextFunction) {
  metricsCollector.increment(METRICS.API_ERROR_COUNT, 1, {
    method: req.method,
    route: req.route?.path || req.path,
    error: err.name,
  });

  // Log error details
  console.error('Request error:', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack,
  });

  next(err);
}