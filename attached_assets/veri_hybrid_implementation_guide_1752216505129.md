# Veri Hybrid Implementation Strategy - Replit Technical Guide

**context:** complete technical implementation guide for building veri's hybrid stack on replit  
**goal:** production-ready mvp with embedded signal engine migration framework  
**timeline:** 4-week sprint to working demo + migration infrastructure  

---

## table of contents

1. [frameworks to build](#frameworks)
2. [hybrid architecture strategy](#hybrid-strategy)
3. [replit repository structure](#repo-structure)
4. [implementation phases](#phases)
5. [configuration management](#config)
6. [testing + validation](#testing)
7. [deployment pipeline](#deployment)
8. [monitoring + observability](#monitoring)

---

## 1. frameworks to build {#frameworks}

### core infrastructure frameworks

**- connection management framework**  
abstract connection factory with atlas/postgres adapters, credential rotation interface, health check endpoints, automatic failover logic

**- cache layer framework**  
redis wrapper with configurable ttl, batch operations, cache-aside pattern implementation, invalidation strategies, distributed locking

**- security framework**  
webhook signature validation middleware, oauth state management, api key rotation system, rate limiting with spike protection

**- config management framework**  
environment variable validator, feature flag interface, secrets injection pipeline, runtime configuration updates

**- observability framework**  
custom metrics collector, dashboard template engine, alert rule builder, distributed tracing integration

**- cost control framework**  
usage tracking middleware, circuit breaker pattern, quota enforcement layer, cost spike detection + alerts

**- data lifecycle framework**  
backup job scheduler, retention policy engine, recovery automation, compliance deletion workflows

**- performance testing framework**  
load test scenarios, memory profiling hooks, cost simulation tools, bottleneck identification

**- compliance framework**  
gdpr request handler, data export pipeline, consent tracking system, audit trail generation

**- business process framework**  
workflow template engine, contract automation, payment escrow interface, campaign lifecycle management

---

## 2. hybrid architecture strategy {#hybrid-strategy}

### phase evolution approach

```
baseline mvp (postgres + redpanda) → dual-write bridge → atlas primary (mongo + redpanda)
```

### feature flag design

| flag | default | purpose | impact |
|------|---------|---------|--------|
| `USE_MONGO=false` | true | enable dual-write mode | writes to both databases |
| `READ_FROM_MONGO=false` | true | primary read source | postgres vs mongo reads |
| `HYBRID_SEARCH=false` | true | vector search capabilities | semantic vs text search |
| `MEMORY_DECAY=false` | true | intelligent forgetting | manual vs automatic cleanup |

### interface abstractions

```typescript
// storage abstraction layer
export interface StorageInterface {
  saveEvent(event: RawSocialEvent): Promise<void>;
  fetchRecentEvents(creatorId: string, limit: number): Promise<RawSocialEvent[]>;
  updateCreatorProfile(creatorId: string, updates: Partial<CreatorProfile>): Promise<void>;
  getCreatorsByTag(tag: string, limit: number): Promise<CreatorProfile[]>;
}

// search abstraction layer  
export interface SearchInterface {
  semanticSearch(query: string, options: SearchOptions): Promise<SearchResult[]>;
  hybridSearch(query: SearchQuery): Promise<SearchResult[]>;
  findSimilarCreators(creatorId: string, limit: number): Promise<CreatorProfile[]>;
}

// memory management abstraction
export interface MemoryInterface {
  formMemory(interaction: Interaction): Promise<void>;
  retrieveMemory(creatorId: string, context: string): Promise<Memory[]>;
  decayMemory(retentionPolicy: RetentionPolicy): Promise<void>;
}
```

### adapter implementations

```typescript
// postgres adapter (baseline)
export class PostgresStorageAdapter implements StorageInterface {
  async saveEvent(event: RawSocialEvent): Promise<void> {
    await this.db.query(`
      INSERT INTO raw_social_data (creator_id, platform, payload_json, created_at)
      VALUES ($1, $2, $3, NOW())
    `, [event.creatorId, event.platform, event.payload]);
  }
  
  async fetchRecentEvents(creatorId: string, limit: number): Promise<RawSocialEvent[]> {
    const result = await this.db.query(`
      SELECT * FROM raw_social_data 
      WHERE creator_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `, [creatorId, limit]);
    return result.rows;
  }
}

// mongodb adapter (signal engine)
export class MongoStorageAdapter implements StorageInterface {
  async saveEvent(event: RawSocialEvent): Promise<void> {
    await this.db.collection('interactions').insertOne({
      creator_id: new ObjectId(event.creatorId),
      interaction_type: event.type,
      platform: event.platform,
      raw_data: event.payload,
      timestamp: new Date(),
      processing_status: 'pending'
    });
  }
  
  async fetchRecentEvents(creatorId: string, limit: number): Promise<RawSocialEvent[]> {
    return await this.db.collection('interactions')
      .find({ creator_id: new ObjectId(creatorId) })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }
}
```

---

## 3. replit repository structure {#repo-structure}

```
veri-hybrid-stack/
├── README.md                          # quick-start + architecture overview
├── docker-compose.yml                 # local development stack
├── .replit                            # replit configuration
├── .env.example                       # environment template
├── replit.nix                         # nix environment
│
├── packages/
│   ├── api/                           # node.js backend
│   │   ├── package.json              # dependencies + scripts
│   │   ├── src/
│   │   │   ├── index.ts              # express app entry
│   │   │   ├── config/
│   │   │   │   ├── database.ts       # connection management
│   │   │   │   ├── redis.ts          # cache configuration
│   │   │   │   └── features.ts       # feature flags
│   │   │   ├── frameworks/
│   │   │   │   ├── connection/       # connection management framework
│   │   │   │   │   ├── ConnectionFactory.ts
│   │   │   │   │   ├── PostgresConnection.ts
│   │   │   │   │   └── MongoConnection.ts
│   │   │   │   ├── cache/           # cache layer framework
│   │   │   │   │   ├── CacheManager.ts
│   │   │   │   │   ├── RedisCache.ts
│   │   │   │   │   └── CacheStrategies.ts
│   │   │   │   ├── security/        # security framework
│   │   │   │   │   ├── AuthMiddleware.ts
│   │   │   │   │   ├── WebhookValidator.ts
│   │   │   │   │   └── RateLimiter.ts
│   │   │   │   ├── observability/   # monitoring framework
│   │   │   │   │   ├── MetricsCollector.ts
│   │   │   │   │   ├── Logger.ts
│   │   │   │   │   └── HealthCheck.ts
│   │   │   │   └── cost/            # cost control framework
│   │   │   │       ├── UsageTracker.ts
│   │   │   │       ├── CircuitBreaker.ts
│   │   │   │       └── QuotaManager.ts
│   │   │   ├── routes/
│   │   │   │   ├── assistant.ts      # chat endpoints
│   │   │   │   ├── auth.ts           # oauth handlers
│   │   │   │   ├── creators.ts       # creator management
│   │   │   │   └── health.ts         # system health
│   │   │   ├── services/
│   │   │   │   ├── kafka.ts          # redpanda integration
│   │   │   │   ├── claude.ts         # anthropic client
│   │   │   │   ├── oauth.ts          # platform apis
│   │   │   │   └── memory.ts         # memory formation
│   │   │   ├── adapters/
│   │   │   │   ├── interfaces/       # abstract contracts
│   │   │   │   │   ├── StorageInterface.ts
│   │   │   │   │   ├── SearchInterface.ts
│   │   │   │   │   └── MemoryInterface.ts
│   │   │   │   ├── postgres/         # baseline implementation
│   │   │   │   │   ├── PostgresStorage.ts
│   │   │   │   │   ├── PostgresSearch.ts
│   │   │   │   │   └── PostgresMemory.ts
│   │   │   │   └── mongo/            # signal engine implementation
│   │   │   │       ├── MongoStorage.ts
│   │   │   │       ├── MongoSearch.ts
│   │   │   │       └── MongoMemory.ts
│   │   │   └── middleware/
│   │   │       ├── validation.ts     # request validation
│   │   │       ├── cors.ts          # cross-origin handling
│   │   │       └── logging.ts       # request logging
│   │   └── tests/
│   │       ├── unit/                # unit tests
│   │       ├── integration/         # integration tests
│   │       └── load/                # performance tests
│   │
│   └── frontend/                      # next.js ui
│       ├── package.json
│       ├── src/
│       │   ├── app/                  # app router
│       │   ├── components/           # ui components
│       │   ├── hooks/               # react hooks
│       │   ├── lib/                 # utilities
│       │   └── types/               # typescript definitions
│       └── public/
│
├── services/
│   └── consumer/                      # python enrichment worker
│       ├── Dockerfile
│       ├── requirements.txt
│       ├── src/
│       │   ├── consumer.py           # main processor
│       │   ├── frameworks/
│       │   │   ├── enrichment/      # enrichment framework
│       │   │   │   ├── WhisperProcessor.ts
│       │   │   │   ├── OllamaProcessor.ts
│       │   │   │   └── SentimentAnalyzer.ts
│       │   │   └── memory/          # memory formation framework
│       │   │       ├── SignalExtractor.ts
│       │   │       ├── MemoryFormatter.ts
│       │   │       └── DecayManager.ts
│       │   ├── processors/
│       │   │   ├── social_processor.py
│       │   │   ├── content_analyzer.py
│       │   │   └── signal_extractor.py
│       │   └── utils/
│       └── tests/
│
├── schemas/
│   ├── database/
│   │   ├── postgres/
│   │   │   ├── schema.sql           # table definitions
│   │   │   ├── indexes.sql          # performance indexes
│   │   │   └── migrations/          # version control
│   │   └── mongo/
│   │       ├── collections.js       # collection setup
│   │       ├── indexes.js           # compound indexes
│   │       └── aggregations.js      # search pipelines
│   ├── events/
│   │   ├── assistant-requests.json  # chat schemas
│   │   ├── social-events.json       # platform data schemas
│   │   └── memory-formations.json   # memory event schemas
│   └── api/
│       ├── openapi.yaml            # rest api specification
│       └── webhooks.json           # webhook schemas
│
├── infrastructure/
│   ├── docker/
│   │   ├── api.Dockerfile           # backend container
│   │   ├── consumer.Dockerfile      # enrichment worker
│   │   └── nginx.conf              # reverse proxy
│   ├── monitoring/
│   │   ├── datadog.yml             # dashboard configs
│   │   ├── sentry.yml              # error tracking
│   │   ├── prometheus.yml          # metrics collection
│   │   └── grafana-dashboards/     # visualization configs
│   └── deployment/
│       ├── replit-deploy.sh        # replit deployment
│       ├── production-deploy.sh    # production deployment
│       └── health-checks.sh        # system validation
│
├── docs/
│   ├── api/
│   │   ├── endpoints.md            # api documentation
│   │   ├── authentication.md      # auth flows
│   │   └── rate-limits.md          # quota documentation
│   ├── architecture/
│   │   ├── hybrid-strategy.md      # migration approach
│   │   ├── memory-formation.md     # signal engine design
│   │   └── cost-analysis.md        # financial projections
│   ├── deployment/
│   │   ├── replit-setup.md         # replit configuration
│   │   ├── production-guide.md     # production deployment
│   │   └── troubleshooting.md      # common issues
│   └── frameworks/
│       ├── connection-management.md
│       ├── cache-layer.md
│       ├── security.md
│       └── observability.md
│
├── scripts/
│   ├── setup/
│   │   ├── init-postgres.sh        # database initialization
│   │   ├── init-mongo.sh           # mongodb setup
│   │   ├── seed-data.js            # sample data generation
│   │   └── migrate-data.js         # postgres → mongo migration
│   ├── development/
│   │   ├── dev-server.sh           # local development
│   │   ├── test-runner.sh          # test execution
│   │   └── lint-fix.sh             # code quality
│   └── operations/
│       ├── backup.sh               # data backup
│       ├── restore.sh              # data recovery
│       ├── health-check.sh         # system validation
│       └── cost-report.sh          # usage analysis
│
└── tools/
    ├── migration-validator.js       # dual-write verification
    ├── performance-profiler.js     # bottleneck analysis
    ├── cost-calculator.js          # expense projection
    └── load-generator.js           # stress testing
```

---

## 4. implementation phases {#phases}

### phase a: baseline foundation (week 1)

**deliverables:**
- **docker stack running** – postgres + redpanda + api + consumer all healthy
- **oauth flows working** – youtube, twitch, twitter, tiktok authentication
- **basic chat functional** – assistant endpoint responding via claude

**exit criteria:**
- `/health` endpoint returns 200 across all services
- oauth callback successfully stores tokens
- chat request → enrichment → response ≤ 2s latency

### phase b: dual-write infrastructure (week 2)

**deliverables:**
- **storage interfaces implemented** – postgres + mongo adapters
- **feature flag system** – USE_MONGO toggle working
- **parity monitoring** – dual-write verification + alerting

**exit criteria:**
- USE_MONGO=true writes successfully to both databases
- parity checker reports ≥99% consistency nightly
- zero data loss during dual-write mode

### phase c: signal engine capabilities (week 3)

**deliverables:**
- **hybrid search working** – vector + text + metadata queries
- **memory formation** – interactions creating persistent memories
- **intelligent decay** – ttl + relevance-based cleanup

**exit criteria:**
- semantic search returns relevant creators
- memory formation creates measurable signal improvements
- decay algorithms maintain storage efficiency

### phase d: migration + optimization (week 4)

**deliverables:**
- **read cutover** – READ_FROM_MONGO=true functional
- **performance optimization** – query caching + indexing
- **monitoring dashboard** – cost + performance + health metrics

**exit criteria:**
- read performance equal or better than baseline
- cost metrics within $3.30/creator target
- full observability stack operational

---

## 5. configuration management {#config}

### environment variables

```bash
# database connections
DATABASE_URL=postgresql://user:pass@localhost:5432/veri
MONGODB_URI=mongodb+srv://cluster.mongodb.net/veri
REDIS_URL=redis://localhost:6379

# feature flags
USE_MONGO=false              # enable dual-write mode
READ_FROM_MONGO=false        # primary read source
HYBRID_SEARCH=false          # vector search capabilities
MEMORY_DECAY=false           # intelligent forgetting
COST_TRACKING=true           # usage monitoring

# message queue
REDPANDA_BROKERS=localhost:9092
KAFKA_GROUP_ID=veri-consumers
KAFKA_TOPICS=assistant-requests,social-events

# external apis
CLAUDE_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...
VOYAGE_API_KEY=pa-...

# oauth credentials  
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
TWITCH_CLIENT_ID=...
TWITCH_CLIENT_SECRET=...
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
TIKTOK_CLIENT_ID=...
TIKTOK_CLIENT_SECRET=...

# security
JWT_SECRET=...
WEBHOOK_SECRET=...
ENCRYPTION_KEY=...

# monitoring
SENTRY_DSN=...
DATADOG_API_KEY=...
PROMETHEUS_ENDPOINT=...

# cost limits (monthly $)
CLAUDE_BUDGET=500
OPENAI_BUDGET=300
MONGO_BUDGET=450
ALERT_THRESHOLD=0.8          # alert at 80% budget
```

### feature flag logic

```typescript
export class FeatureFlags {
  static get useMongo(): boolean {
    return process.env.USE_MONGO === 'true';
  }
  
  static get readFromMongo(): boolean {
    return process.env.READ_FROM_MONGO === 'true' && this.useMongo;
  }
  
  static get hybridSearch(): boolean {
    return process.env.HYBRID_SEARCH === 'true' && this.readFromMongo;
  }
  
  static get memoryDecay(): boolean {
    return process.env.MEMORY_DECAY === 'true' && this.useMongo;
  }
}

// usage in storage factory
export class StorageFactory {
  static createStorage(): StorageInterface {
    if (FeatureFlags.useMongo) {
      return new HybridStorageAdapter(
        new PostgresStorageAdapter(),
        new MongoStorageAdapter()
      );
    }
    return new PostgresStorageAdapter();
  }
  
  static createSearch(): SearchInterface {
    if (FeatureFlags.hybridSearch) {
      return new MongoSearchAdapter();
    }
    return new PostgresSearchAdapter();
  }
}
```

---

## 6. testing + validation {#testing}

### test strategy

```typescript
// unit tests
describe('StorageInterface', () => {
  test('postgres adapter saves events correctly', async () => {
    const adapter = new PostgresStorageAdapter();
    const event = createMockEvent();
    await adapter.saveEvent(event);
    
    const retrieved = await adapter.fetchRecentEvents(event.creatorId, 1);
    expect(retrieved[0]).toMatchObject(event);
  });
  
  test('mongo adapter saves events correctly', async () => {
    const adapter = new MongoStorageAdapter();
    const event = createMockEvent();
    await adapter.saveEvent(event);
    
    const retrieved = await adapter.fetchRecentEvents(event.creatorId, 1);
    expect(retrieved[0]).toMatchObject(event);
  });
});

// integration tests
describe('dual-write system', () => {
  test('writes to both databases maintain parity', async () => {
    const hybridAdapter = new HybridStorageAdapter();
    const events = createMockEvents(100);
    
    for (const event of events) {
      await hybridAdapter.saveEvent(event);
    }
    
    const postgresEvents = await hybridAdapter.postgres.fetchRecentEvents('creator1', 100);
    const mongoEvents = await hybridAdapter.mongo.fetchRecentEvents('creator1', 100);
    
    expect(postgresEvents).toHaveLength(mongoEvents.length);
    // validate content parity
  });
});

// load tests
describe('performance under load', () => {
  test('handles 1000 concurrent chat requests', async () => {
    const requests = Array(1000).fill().map(() => 
      request(app).post('/assistant').send(mockChatRequest)
    );
    
    const results = await Promise.all(requests);
    const avgLatency = results.reduce((sum, r) => sum + r.latency, 0) / 1000;
    
    expect(avgLatency).toBeLessThan(2000); // <2s average
    expect(results.filter(r => r.status === 200)).toHaveLength(1000);
  });
});
```

### validation framework

```typescript
export class MigrationValidator {
  async validateDualWriteParity(): Promise<ValidationReport> {
    const sampleSize = 1000;
    const postgresEvents = await this.postgres.sample(sampleSize);
    const mongoEvents = await this.mongo.sample(sampleSize);
    
    const mismatches = this.compareEvents(postgresEvents, mongoEvents);
    
    return {
      totalSampled: sampleSize,
      mismatches: mismatches.length,
      parityPercentage: ((sampleSize - mismatches.length) / sampleSize) * 100,
      issues: mismatches
    };
  }
  
  async validatePerformance(): Promise<PerformanceReport> {
    const testQueries = this.generateTestQueries(100);
    const postgresResults = await this.benchmarkQueries(this.postgres, testQueries);
    const mongoResults = await this.benchmarkQueries(this.mongo, testQueries);
    
    return {
      postgres: postgresResults,
      mongo: mongoResults,
      recommendation: this.analyzePerformance(postgresResults, mongoResults)
    };
  }
}
```

---

## 7. deployment pipeline {#deployment}

### replit deployment

```bash
#!/bin/bash
# scripts/deploy-replit.sh

echo "🚀 deploying veri hybrid stack to replit..."

# 1. environment setup
echo "📋 validating environment..."
source scripts/validate-env.sh

# 2. dependency installation
echo "📦 installing dependencies..."
cd packages/api && npm ci
cd ../frontend && npm ci
cd ../../services/consumer && pip install -r requirements.txt

# 3. database initialization
echo "🗄️ initializing databases..."
npm run db:migrate:postgres
npm run db:seed:sample-data

# 4. service startup
echo "🔧 starting services..."
docker compose up -d postgres redis redpanda
npm run dev:api &
npm run dev:frontend &
python services/consumer/src/consumer.py &

# 5. health validation
echo "🩺 validating system health..."
sleep 30
curl -f http://localhost:3000/health || exit 1
curl -f http://localhost:3001/health || exit 1

echo "✅ deployment complete!"
echo "🌐 api: http://localhost:3000"
echo "🖥️ frontend: http://localhost:3001"
echo "📊 metrics: http://localhost:3000/metrics"
```

### production deployment

```bash
#!/bin/bash
# scripts/deploy-production.sh

echo "🏭 deploying to production..."

# 1. pre-deployment validation
npm run test:integration
npm run test:load
npm run security:scan

# 2. feature flag preparation
export USE_MONGO=true
export READ_FROM_MONGO=false  # dual-write mode

# 3. rolling deployment
kubectl apply -f infrastructure/k8s/
kubectl rollout status deployment/veri-api
kubectl rollout status deployment/veri-consumer

# 4. migration checkpoint
npm run validate:dual-write-parity
if [ $? -ne 0 ]; then
  echo "❌ parity validation failed, rolling back..."
  kubectl rollout undo deployment/veri-api
  exit 1
fi

echo "✅ production deployment successful!"
```

---

## 8. monitoring + observability {#monitoring}

### metrics collection

```typescript
export class MetricsCollector {
  private prometheus = new PrometheusRegistry();
  
  // business metrics
  private creatorCount = new Gauge({
    name: 'veri_active_creators_total',
    help: 'number of active creators'
  });
  
  private chatLatency = new Histogram({
    name: 'veri_chat_duration_seconds',
    help: 'chat request latency',
    buckets: [0.1, 0.5, 1, 2, 5, 10]
  });
  
  private memoryFormations = new Counter({
    name: 'veri_memory_formations_total',
    help: 'total memory formations created'
  });
  
  // infrastructure metrics
  private dbConnections = new Gauge({
    name: 'veri_db_connections_active',
    help: 'active database connections',
    labelNames: ['database']
  });
  
  private apiCosts = new Counter({
    name: 'veri_api_costs_usd_total',
    help: 'cumulative api costs in usd',
    labelNames: ['service']
  });
  
  // dual-write metrics
  private dualWriteLatency = new Histogram({
    name: 'veri_dual_write_duration_seconds',
    help: 'dual-write operation latency'
  });
  
  private parityErrors = new Counter({
    name: 'veri_parity_errors_total',
    help: 'dual-write parity validation errors'
  });
}
```

### alerting rules

```yaml
# monitoring/alerts.yml
groups:
  - name: veri.rules
    rules:
      # performance alerts
      - alert: HighChatLatency
        expr: histogram_quantile(0.95, veri_chat_duration_seconds) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "chat response latency high"
          
      - alert: DualWriteParity
        expr: increase(veri_parity_errors_total[1h]) > 10
        for: 0m
        labels:
          severity: critical
        annotations:
          summary: "dual-write parity errors detected"
          
      # cost alerts  
      - alert: BudgetExceeded
        expr: veri_api_costs_usd_total{service="claude"} > 500
        for: 0m
        labels:
          severity: warning
        annotations:
          summary: "monthly claude budget exceeded"
          
      # system health
      - alert: ServiceDown
        expr: up{job="veri-api"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "veri api service is down"
```

### dashboard configuration

```json
{
  "dashboard": {
    "title": "veri hybrid stack",
    "panels": [
      {
        "title": "creator activity",
        "type": "graph",
        "targets": [
          {
            "expr": "veri_active_creators_total",
            "legendFormat": "active creators"
          }
        ]
      },
      {
        "title": "chat performance",
        "type": "graph", 
        "targets": [
          {
            "expr": "histogram_quantile(0.50, veri_chat_duration_seconds)",
            "legendFormat": "p50 latency"
          },
          {
            "expr": "histogram_quantile(0.95, veri_chat_duration_seconds)",
            "legendFormat": "p95 latency"
          }
        ]
      },
      {
        "title": "dual-write health",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(veri_parity_errors_total[5m])",
            "legendFormat": "parity error rate"
          }
        ]
      },
      {
        "title": "cost tracking",
        "type": "graph",
        "targets": [
          {
            "expr": "veri_api_costs_usd_total",
            "legendFormat": "{{service}} costs"
          }
        ]
      }
    ]
  }
}
```

---

## conclusion

this implementation guide provides complete frameworks and technical specifications for building veri's hybrid stack on replit. the phased approach ensures rapid mvp delivery while embedding migration infrastructure for seamless signal engine transition.

**key success factors:**
- **interface abstraction** – enables zero-downtime migration between storage layers
- **comprehensive testing** – validates parity + performance throughout transition
- **observability first** – real-time monitoring of costs + performance + business metrics
- **framework foundation** – reusable components accelerate future feature development

**next steps:**
1. **week 1** → baseline stack deployment + validation
2. **week 2** → dual-write implementation + parity monitoring  
3. **week 3** → signal engine capabilities + hybrid search
4. **week 4** → migration + optimization + production readiness