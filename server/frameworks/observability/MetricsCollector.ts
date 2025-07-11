interface Metric {
  name: string;
  value: number;
  type: 'counter' | 'gauge' | 'histogram';
  tags?: Record<string, string>;
  timestamp: Date;
}

interface MetricStorage {
  counters: Map<string, number>;
  gauges: Map<string, number>;
  histograms: Map<string, number[]>;
}

export class MetricsCollector {
  private metrics: MetricStorage = {
    counters: new Map(),
    gauges: new Map(),
    histograms: new Map(),
  };

  private flushInterval: NodeJS.Timeout | null = null;
  private flushIntervalMs = 60000; // 1 minute

  constructor() {
    // Start flush interval
    this.startFlushInterval();
  }

  // Counter operations
  increment(name: string, value = 1, tags?: Record<string, string>): void {
    const key = this.getKey(name, tags);
    const current = this.metrics.counters.get(key) || 0;
    this.metrics.counters.set(key, current + value);
  }

  // Gauge operations
  gauge(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.getKey(name, tags);
    this.metrics.gauges.set(key, value);
  }

  // Histogram operations
  histogram(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.getKey(name, tags);
    const values = this.metrics.histograms.get(key) || [];
    values.push(value);
    this.metrics.histograms.set(key, values);
  }

  // Timer for measuring durations
  timer(name: string, tags?: Record<string, string>): () => void {
    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      this.histogram(name, duration, tags);
    };
  }

  // Get all current metrics
  getMetrics(): any {
    const metrics: any = {
      counters: {},
      gauges: {},
      histograms: {},
    };

    // Convert counters
    for (const [key, value] of this.metrics.counters) {
      metrics.counters[key] = value;
    }

    // Convert gauges
    for (const [key, value] of this.metrics.gauges) {
      metrics.gauges[key] = value;
    }

    // Convert histograms to statistics
    for (const [key, values] of this.metrics.histograms) {
      if (values.length > 0) {
        metrics.histograms[key] = {
          count: values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          mean: values.reduce((a, b) => a + b, 0) / values.length,
          p50: this.percentile(values, 0.5),
          p95: this.percentile(values, 0.95),
          p99: this.percentile(values, 0.99),
        };
      }
    }

    return metrics;
  }

  // Reset metrics (useful for testing)
  reset(): void {
    this.metrics.counters.clear();
    this.metrics.gauges.clear();
    this.metrics.histograms.clear();
  }

  // Helper methods
  private getKey(name: string, tags?: Record<string, string>): string {
    if (!tags || Object.keys(tags).length === 0) {
      return name;
    }
    const tagStr = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join(',');
    return `${name}{${tagStr}}`;
  }

  private percentile(values: number[], p: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index];
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.flushIntervalMs);
  }

  private flush(): void {
    const metrics = this.getMetrics();
    
    // Log metrics (in production, send to monitoring service)
    console.log('Metrics flush:', JSON.stringify(metrics, null, 2));
    
    // Clear histograms after flush
    this.metrics.histograms.clear();
  }

  // Cleanup
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }
}

// Common metric names
export const METRICS = {
  // API metrics
  API_REQUEST_COUNT: 'api.request.count',
  API_REQUEST_DURATION: 'api.request.duration',
  API_ERROR_COUNT: 'api.error.count',
  
  // Database metrics
  DB_QUERY_COUNT: 'db.query.count',
  DB_QUERY_DURATION: 'db.query.duration',
  DB_CONNECTION_POOL_SIZE: 'db.connection.pool.size',
  
  // Cache metrics
  CACHE_HIT_COUNT: 'cache.hit.count',
  CACHE_MISS_COUNT: 'cache.miss.count',
  CACHE_SET_COUNT: 'cache.set.count',
  
  // Kafka metrics
  KAFKA_MESSAGE_SENT: 'kafka.message.sent',
  KAFKA_MESSAGE_RECEIVED: 'kafka.message.received',
  KAFKA_PROCESSING_DURATION: 'kafka.processing.duration',
  
  // Business metrics
  USER_LOGIN_COUNT: 'user.login.count',
  TASK_COMPLETED_COUNT: 'task.completed.count',
  SOCIAL_CONNECTION_COUNT: 'social.connection.count',
  AI_AGENT_USAGE_COUNT: 'ai.agent.usage.count',
} as const;

// Singleton instance
export const metricsCollector = new MetricsCollector();