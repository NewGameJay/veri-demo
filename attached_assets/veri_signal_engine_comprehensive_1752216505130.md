# Veri Signal Engine - Comprehensive Architecture & Strategy

**context:** comprehensive technical blueprint for veri's memory-driven intelligence platform - from baseline mvp through full signal engine implementation  
**audience:** technical team, investors, strategic partners  
**timeline:** july 2025 - q4 2025 phased rollout  

---

## executive summary

veri's signal engine transforms creator data into persistent memory that powers compound learning across the entire platform. unlike traditional analytics that treat data as disposable metrics, our memory-driven architecture creates defensible competitive advantages through accumulated intelligence that improves recommendations for all creators based on collective learnings.

**key differentiators:**
- **memory-driven architecture** – every interaction builds persistent intelligence
- **compound learning** – each creator's success improves recommendations for similar creators  
- **hybrid search** – vector + text + metadata queries in single database call
- **cost-effective scaling** – $3.30/creator target with improving margins at scale

---

## table of contents

1. [memory-driven architecture foundation](#memory-architecture)
2. [baseline mvp stack](#baseline-mvp)
3. [signal engine stack](#signal-engine)
4. [comparative analysis](#comparative-analysis)
5. [business intelligence layer](#business-intelligence)
6. [technology stack choices](#tech-stack)
7. [implementation roadmap](#roadmap)
8. [cost management](#cost-management)
9. [competitive differentiation](#differentiation)

---

## 1. memory-driven architecture foundation {#memory-architecture}

### core philosophy
every creator action becomes durable memory that improves future recommendations. the signal engine "remembers" what works for each creator + brand combination, creating compound intelligence advantages that traditional platforms cannot replicate.

### memory types

| **memory layer** | **what it stores** | **why it matters** | **implementation** |
|:-:|:-:|:-:|:-:|
| **creator entity memory** | complete creator profile, preferences, performance history | persistent personalization across sessions | mongodb document model with vector embeddings |
| **campaign episodic memory** | brand interactions, quest outcomes, workflow steps | learns from past campaign successes/failures | time-series with decay scoring for relevance |
| **content knowledge memory** | video analysis, engagement patterns, monetization data | powers content recommendations + optimization | atlas vector search for semantic similarity |
| **brand interaction memory** | communication history, satisfaction scores, roi data | builds trust + predicts future campaign fit | relational data with hybrid text/vector search |
| **workflow memory** | agent execution logs, tool usage, success patterns | improves agent performance over time | json schema storage with success rate tracking |

### memory formation process

```
raw interaction → signal extraction → memory formation → compound learning → improved recommendations
```

**signal extraction algorithms:**
- **engagement resonance** – tf-idf on top 10% engagement moments + semantic clustering
- **brand-creator fit** – weighted average: content_alignment(0.4) + audience_overlap(0.3) + past_performance(0.3)
- **revenue lift prediction** – bayesian model using historical campaign outcomes
- **reliability index** – exponential moving average of delivery metrics weighted by campaign value

---

## 2. baseline mvp stack {#baseline-mvp}

### objective
provide fully functional mvp for early creators and investors with minimal infrastructure overhead. postpone vector/hybrid search until data volume (> 10m events/month) demands it. embed interface layers for seamless signal engine migration.

### topology

| tier | component | purpose | implementation |
|------|-----------|---------|----------------|
| **ui** | next.js + react | dashboard + "my agent" chat | vercel deploy |
| **api** | node/express | `/assistantRequest`, auth, health | forwards to kafka |
| **stream** | redpanda | buffers chat prompts + social events | topics: `assistant-requests`, `social-events` |
| **enrichment** | python consumer | social api calls, whisper, ollama | docker on replit/ecs |
| **storage** | amazon rds (postgresql) | `raw_social`, `chat_memory`, `generated_insights` | pgvector optional |
| **llm** | anthropic claude | real-time chat, batched generation | sse stream |
| **orchestration** | aws lambda + sns/websocket | trigger scoring, push live updates | serverless |
| **observability** | datadog + sentry | lag/error/latency alerts | free tier sufficient |

### memory schema (postgresql)

```sql
-- baseline tables for mvp
CREATE TABLE raw_social_data (
  creator_id UUID,
  platform VARCHAR(50),
  payload_json JSONB,
  transcription TEXT,
  tone_score DECIMAL,
  created_at TIMESTAMP
);

CREATE TABLE chat_memory (
  creator_id UUID,
  ts TIMESTAMP,
  role VARCHAR(20),
  content TEXT
);

CREATE TABLE generated_insights (
  creator_id UUID,
  insight_type VARCHAR(100),
  payload_json JSONB,
  created_at TIMESTAMP
);
```

### data flow
1. **ingestion** – event lands, consumer enriches, writes to `raw_social_data`
2. **interaction** – ui post → `assistant-requests` → backend → claude
3. **batch** – heavy tasks queued; job-id returned to ui
4. **retention** – cron archives data older than 90d to s3

---

## 3. signal engine stack {#signal-engine}

### architecture evolution
the signal engine extends baseline mvp with sophisticated memory formation, hybrid search, and automated decay mechanisms. built on mongodb atlas for document flexibility + vector search in single database.

### enhanced topology

| tier | component | enhancement over baseline |
|------|-----------|--------------------------|
| **memory formation** | brightmatter intelligence layer | transforms raw signals into actionable insights |
| **storage** | mongodb atlas | document model + vector search + hybrid queries |
| **search** | atlas vector search | semantic similarity + text + metadata filtering |
| **decay** | intelligent forgetting | relevance-based memory compression + ttl |
| **prediction** | ml models | roi forecasting, engagement prediction, fit scoring |

### memory collections (mongodb)

```javascript
// creators collection (entity memory)
const creatorSchema = {
  _id: ObjectId,
  user_id: ObjectId,
  memory_profile: {
    resonance_tags: [
      {
        category: String,
        subcategory: String,
        confidence: Number,
        last_updated: Date,
        source_interactions: [String]
      }
    ],
    behavioral_patterns: {
      tool_usage_frequency: Map,
      peak_activity_hours: [Number],
      preferred_content_formats: [String],
      monetization_success_rate: Number
    }
  },
  created_at: Date,
  updated_at: Date
};

// interactions collection (episodic memory)
const interactionSchema = {
  _id: ObjectId,
  creator_id: ObjectId,
  interaction_type: String,
  platform: String,
  raw_data: Object,
  processed_signals: {
    engagement_metrics: Object,
    content_analysis: Object,
    sentiment_scores: Object,
    performance_indicators: Object
  },
  memory_impact: {
    resonance_updates: [Object],
    behavioral_changes: Object,
    compound_learning_contribution: Number
  },
  embedding_vector: [Number],
  timestamp: Date,
  processing_status: String
};

// content analysis collection
const contentSchema = {
  _id: ObjectId,
  creator_id: ObjectId,
  content_id: String,
  analysis_results: {
    engagement_prediction: Number,
    sentiment_breakdown: Object,
    topic_classification: [String],
    monetization_potential: Number
  },
  embedding_vector: [Number],
  created_at: Date
};
```

### hybrid search capabilities

```javascript
// example: find creators similar to high-performing campaign
const similarCreators = await db.creators.aggregate([
  {
    $vectorSearch: {
      index: "creator_similarity_index",
      path: "memory_profile.behavioral_vector",
      queryVector: campaignSuccessVector,
      numCandidates: 100,
      limit: 10
    }
  },
  {
    $match: {
      "memory_profile.monetization_success_rate": { $gte: 0.7 },
      "memory_profile.resonance_tags.category": "gaming"
    }
  },
  {
    $addFields: {
      score: { $meta: "vectorSearchScore" }
    }
  }
]);
```

---

## 4. comparative analysis {#comparative-analysis}

| dimension | baseline mvp stack | signal engine stack |
|-----------|-------------------|-------------------|
| **launch speed** | ≤ 1 week demo possible | 2-3 week additional lead time |
| **initial infra cost** | $60-$100/mo at 500 creators | $180-$230/mo at same load |
| **query capability** | standard sql, optional pgvector | hybrid search in single query |
| **schema flexibility** | table alters required | document model, no disruption |
| **memory lifecycle** | manual cron/lambda deletes | native ttl + decay algorithms |
| **retrieval precision** | latest-n strategy | configurable composite scoring |
| **scaling > 10m events/mo** | vertical scaling, iops ceiling | horizontal shard scaling |
| **team familiarity** | high (sql/postgresql) | moderate (mongo queries) |
| **migration complexity** | staging db, remains reporting | primary store, requires backfill |

### evolution strategy
baseline acts as staging environment while signal engine provides production-scale memory intelligence. dual-write bridge enables seamless transition without service disruption.

---

## 5. business intelligence layer {#business-intelligence}

### real-time signal generation

| signal type | algorithm specification | business impact |
|-------------|------------------------|-----------------|
| **revenue lift prediction** | bayesian model using historical outcomes | reduces brand campaign risk 40%+ |
| **engagement resonance** | tf-idf + semantic clustering | powers content optimization |
| **brand-creator fit** | weighted content/audience/performance | increases campaign success 25%+ |
| **reliability index** | exponential moving average delivery metrics | enables premium creator tiers |

### success metrics (phased targets)

**month 1-2 (mvp validation):**
- **prediction accuracy** → 50% roi forecast accuracy (vs 25% baseline)
- **engagement correlation** → 0.6 correlation signals vs actual performance
- **creator retention** → 35% 7-day retention via personalized recommendations

**month 3-4 (scaling phase):**
- **prediction accuracy** → 65% roi forecast accuracy
- **engagement correlation** → 0.75 correlation
- **creator retention** → 45% 7-day, 25% 30-day retention

**month 5-6 (optimization phase):**
- **prediction accuracy** → 75% roi forecast accuracy
- **engagement correlation** → 0.85 correlation
- **creator retention** → 55% 7-day, 35% 30-day retention

### business kpi integration
- **creator lifetime value** → memory-driven personalization increases clv 40%+
- **brand repeat rate** → relationship memory drives 60%+ campaign repeat bookings
- **revenue per creator** → $25+ monthly attribution from signal-driven optimizations
- **cost efficiency** → <$2.50 per active creator monthly (vs $5+ basic analytics)

---

## 6. technology stack choices {#tech-stack}

### mongodb atlas vs postgresql + pinecone
- **unified database** – documents + vector search + text queries in single api call
- **operational simplicity** – 40% complexity reduction, unified billing, built-in scaling
- **cost efficiency** – $450/month vs $600+ multi-vendor equivalent

### openai o3 + anthropic vs single llm
- **reasoning quality** – 35% better accuracy for complex creator-brand matching
- **risk mitigation** – vendor diversification prevents single-point-of-failure
- **cost premium** – ~$150/month additional, absorbed in pricing model

### hybrid architecture benefits
- **development speed** – proven patterns reduce build time 60%
- **competitive differentiation** – proprietary memory algorithms on battle-tested foundations
- **operational control** – full ownership while leveraging proven infrastructure

---

## 7. implementation roadmap {#roadmap}

### phase 1: memory foundation (weeks 1-4)
- **mongodb atlas setup** → document schema design, vector index configuration
- **creator entity memory** → basic profile storage with resonance tagging
- **oauth integration** → secure token management with gdpr flows
- **basic retrieval** → hybrid search for creator discovery

### phase 2: learning systems (weeks 5-8)
- **workflow memory** → agent execution tracking + success pattern recognition
- **campaign episodic memory** → brand interaction history + satisfaction scoring
- **intelligent forgetting** → memory decay algorithms + relevance scoring
- **recommendation engine** → personalized creator suggestions with a/b testing

### phase 3: intelligence amplification (weeks 9-12)
- **predictive modeling** → roi forecasting using historical memory patterns
- **agentic workflows** → autonomous campaign optimization
- **brand dashboard** → memory-driven insights + creator discovery
- **success story generation** → automated case studies from outcomes

### phase 4: scaling + optimization (weeks 13-16)
- **multi-agent coordination** → agents sharing memory across workflows
- **advanced forgetting** → sophisticated relevance algorithms + compression
- **real-time adaptation** → continuous model updating
- **competitive intelligence** → industry benchmarking using anonymized patterns

---

## 8. cost management {#cost-management}

### monthly budget targets ($3.30/creator at 500 creators)

| component | cost | purpose |
|-----------|------|---------|
| **mongodb atlas** | $450 | document storage + vector search + analytics |
| **ai processing** | $900 | openai o3 + anthropic + voyage embeddings |
| **infrastructure** | $300 | redis cache + monitoring + security |
| **total** | $1,650 | **$3.30 per creator** |

### scaling economics
- **1k creators** → $3.30 per creator (linear scaling)
- **5k creators** → $2.85 per creator (infrastructure efficiencies)
- **25k creators** → $2.20 per creator (volume discounts + optimization)

### cost optimization strategies
- **intelligent caching** → redis layer reduces database queries 60%
- **batch processing** → group operations reduce api costs 40%
- **decay algorithms** → automated cleanup maintains storage efficiency
- **query optimization** → compound indexes minimize read units

---

## 9. competitive differentiation {#differentiation}

### memory-driven advantages
traditional platforms treat creator data as disposable analytics. veri's persistent memory creates compound intelligence that becomes more valuable over time, building defensible moats through accumulated learning.

### unique capabilities
- **cross-creator learning** → successful patterns automatically improve recommendations for similar creators
- **brand relationship memory** → deep interaction history enables predictive campaign matching
- **workflow intelligence** → agent performance improves through persistent execution memory
- **content optimization** → semantic understanding of what resonates across creator types

### market positioning
veri becomes the only platform where creator success compounds across the entire network, creating network effects that increase value for all participants as the platform grows.

---

## conclusion

the signal engine represents a fundamental shift from disposable analytics to persistent intelligence. by treating creator data as durable memory, veri builds compound competitive advantages that become stronger with scale, positioning the platform as the definitive infrastructure for performance-based creator marketing.

**next steps:**
1. **baseline mvp deployment** → prove core functionality + creator value
2. **dual-write implementation** → seamless bridge to signal engine capabilities  
3. **memory formation testing** → validate compound learning hypothesis
4. **brand saas validation** → prove roi-driven pricing model sustainability