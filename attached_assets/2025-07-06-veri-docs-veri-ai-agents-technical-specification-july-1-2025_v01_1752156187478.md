# Veri AI Agents - Technical Specification (July 1, 2025)
**context:** comprehensive implementation doc for mvp agents aligned with signal engine memory-driven architecture **scope:** brightmatter intelligence layer, mongodb atlas, o3 integration, memory management, deployment pipeline **timeline:** 8-week dev cycle targeting 31 aug launch

## 1. memory-driven architecture overview
### 1.1 signal engine + brightmatter stack
intelligence layer: brightmatter (openai o3 + voyage embeddings + memoriz)
memory infrastructure: signal engine (mongodb atlas + redpanda streams)
auth + oauth: firebase auth (youtube, twitch, twitter, tiktok)
frontend: nextjs 14 + tailwind + shadcn/ui
backend: nodejs + fastify + mongoose odm
deployment: vercel (frontend) + railway (backend) + mongodb atlas (cloud)
monitoring: sentry + posthog + datadog
### 1.2 memory-driven flow
creator action → redpanda stream → signal engine → memory storage → brightmatter processing → personalized recommendations → ui update

## 2. mongodb atlas schema (document model)
### 2.1 creator entity memory
// creators collection (main entity memory)
const creatorSchema = {
  _id: ObjectId,
  user_id: String, // firebase uid
  email: String,
  wallet_address: String,
  matera_points: Number,
  oauth_connections: {
    youtube: { connected: Boolean, profile_id: String, last_sync: Date },
    twitch: { connected: Boolean, profile_id: String, last_sync: Date },
    twitter: { connected: Boolean, profile_id: String, last_sync: Date },
    tiktok: { connected: Boolean, profile_id: String, last_sync: Date }
  },
  memory_profile: {
    resonance_tags: [
      {
        category: String, // gaming, format, audience, monetization
        tag: String,
        confidence: Number, // 0-1
        last_updated: Date,
        source_interactions: [String] // interaction_ids that built this tag
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

// compound index for efficient queries
db.creators.createIndex({ "user_id": 1 });
db.creators.createIndex({ "memory_profile.resonance_tags.category": 1, "memory_profile.resonance_tags.confidence": -1 });
### 2.2 episodic memory (interactions)
// interactions collection (episodic memory)
const interactionSchema = {
  _id: ObjectId,
  creator_id: ObjectId, // ref to creators
  interaction_type: String, // oauth_sync, tool_usage, campaign_action, quest_completion
  platform: String, // youtube, twitch, twitter, tiktok, veri
  raw_data: Object, // platform-specific data
  processed_signals: {
    engagement_metrics: Object,
    content_analysis: Object,
    sentiment_scores: Object,
    performance_indicators: Object
  },
  memory_impact: {
    resonance_updates: [Object], // which tags were updated
    behavioral_changes: Object,
    compound_learning_contribution: Number
  },
  embedding_vector: [Number], // voyage ai embeddings for semantic search
  timestamp: Date,
  processing_status: String // pending, processing, completed, failed
};

// indexes for memory retrieval
db.interactions.createIndex({ "creator_id": 1, "timestamp": -1 });
db.interactions.createIndex({ "interaction_type": 1, "platform": 1 });
db.interactions.createIndex({ "embedding_vector": "2dsphere" }); // vector search
### 2.3 content knowledge memory
// content_analysis collection
const contentSchema = {
  _id: ObjectId,
  creator_id: ObjectId,
  content_id: String, // platform-specific video/post id
  platform: String,
  analysis_data: {
    thumbnail_performance: Object,
    title_optimization_potential: Object,
    engagement_patterns: Object,
    monetization_opportunities: [String],
    clip_moments: [
      {
        timestamp: Number,
        engagement_score: Number,
        sponsor_potential: Number,
        description: String
      }
    ]
  },
  embedding_vector: [Number],
  last_analyzed: Date
};
### 2.4 workflow memory
// agent_executions collection
const agentExecutionSchema = {
  _id: ObjectId,
  creator_id: ObjectId,
  agent_type: String, // thumbnail_optimizer, clipping_agent, etc
  execution_data: {
    input_parameters: Object,
    processing_steps: [Object],
    output_results: Object,
    success_metrics: Object
  },
  performance_metrics: {
    execution_time: Number,
    accuracy_score: Number,
    creator_satisfaction: Number,
    business_impact: Object
  },
  cost_tracking: {
    api_calls: Object, // {openai: 5, voyage: 2, etc}
    total_cost_usd: Number
  },
  timestamp: Date
};

## 3. brightmatter intelligence apis
### 3.1 openai o3 integration
// brightmatter ai service
class BrightmatterService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'o3-2024-12-17' // latest o3 model
    });
    this.voyageAI = new VoyageAI({
      apiKey: process.env.VOYAGE_API_KEY
    });
  }

  async processCreatorMemory(creatorId, interactionData) {
    // use o3 for complex reasoning about creator patterns
    const memoryAnalysis = await this.openai.chat.completions.create({
      model: 'o3-2024-12-17',
      messages: [
        {
          role: 'system',
          content: `analyze creator interaction patterns and update memory profile.
          focus on: resonance tag confidence, behavioral changes, compound learning opportunities.
          return structured json with memory updates.`
        },
        {
          role: 'user',
          content: JSON.stringify({
            creator_profile: await this.getCreatorMemory(creatorId),
            new_interaction: interactionData,
            similar_creator_patterns: await this.getSimilarCreatorPatterns(creatorId)
          })
        }
      ],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(memoryAnalysis.choices[0].message.content);
  }

  async generateEmbeddings(content) {
    // use voyage ai for superior embedding quality
    const embedding = await this.voyageAI.embed({
      input: content,
      model: 'voyage-large-2'
    });
    return embedding.data[0].embedding;
  }
}
### 3.2 memoriz library integration
// memory management using memoriz patterns
import { MemoryManager, EpisodicMemory, SemanticMemory } from '@memoriz/core';

class VeriMemoryManager extends MemoryManager {
  constructor(creatorId) {
    super();
    this.creatorId = creatorId;
    this.episodicMemory = new EpisodicMemory({
      maxSize: 10000, // last 10k interactions
      decayFunction: this.calculateMemoryDecay.bind(this)
    });
    this.semanticMemory = new SemanticMemory({
      embeddingFunction: this.generateEmbeddings.bind(this)
    });
  }

  calculateMemoryDecay(interaction, currentTime) {
    const ageInDays = (currentTime - interaction.timestamp) / (1000 * 60 * 60 * 24);
    const relevanceScore = interaction.memory_impact?.compound_learning_contribution || 0;
    
    // high-impact memories decay slower
    return Math.exp(-ageInDays / (30 * (1 + relevanceScore)));
  }

  async storeInteraction(interactionData) {
    // store in episodic memory with decay
    await this.episodicMemory.store(interactionData);
    
    // extract semantic meaning for long-term storage
    const semanticMeaning = await this.extractSemanticMeaning(interactionData);
    await this.semanticMemory.store(semanticMeaning);
    
    // update mongodb
    await this.persistToDatabase(interactionData);
  }
}

## 4. redpanda streams + event processing
### 4.1 event streaming setup
// redpanda kafka-compatible streaming
import { Kafka } from 'kafkajs';

const redpanda = new Kafka({
  clientId: 'veri-signal-engine',
  brokers: [process.env.REDPANDA_BROKER_URL],
  ssl: true,
  sasl: {
    mechanism: 'SCRAM-SHA-256',
    username: process.env.REDPANDA_USERNAME,
    password: process.env.REDPANDA_PASSWORD
  }
});

// event topics
const TOPICS = {
  CREATOR_INTERACTIONS: 'creator.interactions',
  OAUTH_SYNCS: 'oauth.platform_syncs',
  AGENT_EXECUTIONS: 'agents.executions',
  MEMORY_UPDATES: 'memory.profile_updates'
};

class SignalEngineProcessor {
  constructor() {
    this.producer = redpanda.producer();
    this.consumer = redpanda.consumer({ groupId: 'signal-processing-group' });
  }

  async publishInteraction(creatorId, interactionData) {
    await this.producer.send({
      topic: TOPICS.CREATOR_INTERACTIONS,
      messages: [{
        key: creatorId,
        value: JSON.stringify({
          ...interactionData,
          timestamp: new Date().toISOString()
        })
      }]
    });
  }

  async processInteractionStream() {
    await this.consumer.subscribe({ topic: TOPICS.CREATOR_INTERACTIONS });
    
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const interaction = JSON.parse(message.value.toString());
        const creatorId = message.key.toString();
        
        // process through brightmatter
        const memoryUpdates = await brightmatter.processCreatorMemory(creatorId, interaction);
        
        // update creator memory profile
        await this.updateCreatorMemory(creatorId, memoryUpdates);
        
        // publish memory updates for compound learning
        await this.publishMemoryUpdate(creatorId, memoryUpdates);
      }
    });
  }
}

## 5. firebase auth + oauth integration
### 5.1 oauth platform connections
// firebase auth with platform oauth
import { getAuth, signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider, createCustomToken } from 'firebase-admin/auth';

const OAUTH_CONFIGS = {
  youtube: {
    provider: GoogleAuthProvider,
    scopes: ['https://www.googleapis.com/auth/youtube.readonly']
  },
  twitch: {
    clientId: process.env.TWITCH_CLIENT_ID,
    scopes: ['user:read:email', 'channel:read:subscriptions']
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID,
    scopes: ['tweet.read', 'users.read', 'follows.read']
  }
};

class OAuthManager {
  async connectPlatform(creatorId, platform) {
    const config = OAUTH_CONFIGS[platform];
    
    // get platform oauth token
    const platformToken = await this.getPlatformToken(platform, config);
    
    // sync platform data
    const platformData = await this.syncPlatformData(platform, platformToken);
    
    // process through signal engine
    await signalEngine.publishInteraction(creatorId, {
      type: 'oauth_sync',
      platform,
      data: platformData
    });
    
    // update creator oauth connections
    await db.creators.updateOne(
      { user_id: creatorId },
      { 
        $set: { 
          [`oauth_connections.${platform}`]: {
            connected: true,
            last_sync: new Date(),
            profile_id: platformData.profile_id
          }
        }
      }
    );
  }
}

## 6. cost management + monitoring
### 6.1 cost tracking with $3.30/creator target
class CostManager {
  static readonly COST_TARGETS = {
    monthly_per_creator: 3.30, // usd
    o3_upgrade_delta: 0.30, // additional cost vs gpt-4
    api_breakdown: {
      openai_o3: 1.80,      // $1.80/creator/month
      voyage_embeddings: 0.60, // $0.60/creator/month  
      mongodb_atlas: 0.50,   // $0.50/creator/month
      firebase_auth: 0.20,   // $0.20/creator/month
      redpanda: 0.20         // $0.20/creator/month
    }
  };

  async trackAPIUsage(creatorId, service, endpoint, cost) {
    await db.cost_tracking.insertOne({
      creator_id: creatorId,
      service,
      endpoint,
      cost_usd: cost,
      timestamp: new Date()
    });
    
    // check monthly spend per creator
    const monthlySpend = await this.getCreatorMonthlyCost(creatorId);
    if (monthlySpend > this.COST_TARGETS.monthly_per_creator) {
      await this.alertCostOverage(creatorId, monthlySpend);
    }
  }

  async getCreatorMonthlyCost(creatorId) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const costs = await db.cost_tracking.aggregate([
      {
        $match: {
          creator_id: creatorId,
          timestamp: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total_cost: { $sum: '$cost_usd' }
        }
      }
    ]);
    
    return costs[0]?.total_cost || 0;
  }
}

## 7. mongodb atlas hybrid search
### 7.1 vector search + text search
// atlas vector search for semantic similarity
class MemorySearchEngine {
  async findSimilarCreators(creatorId, limit = 10) {
    const creator = await db.creators.findOne({ user_id: creatorId });
    const queryVector = creator.memory_profile.primary_embedding;
    
    return db.creators.aggregate([
      {
        $vectorSearch: {
          index: 'creator_memory_vector_index',
          path: 'memory_profile.primary_embedding',
          queryVector,
          numCandidates: 100,
          limit
        }
      },
      {
        $project: {
          user_id: 1,
          memory_profile: 1,
          similarity_score: { $meta: 'vectorSearchScore' }
        }
      }
    ]);
  }

  async searchRelevantMemories(creatorId, query, context) {
    // hybrid search: vector + text + metadata
    const queryEmbedding = await voyageAI.embed(query);
    
    return db.interactions.aggregate([
      {
        $search: {
          compound: {
            must: [
              {
                vectorSearch: {
                  index: 'interaction_vector_index',
                  path: 'embedding_vector',
                  queryVector: queryEmbedding,
                  numCandidates: 100
                }
              }
            ],
            should: [
              {
                text: {
                  query: query,
                  path: ['processed_signals', 'raw_data']
                }
              }
            ],
            filter: [
              {
                equals: {
                  path: 'creator_id',
                  value: creatorId
                }
              }
            ]
          }
        }
      },
      { $limit: 20 }
    ]);
  }
}

## 8. agent implementations
### 8.1 thumbnail optimizer agent
class ThumbnailOptimizerAgent {
  async optimize(creatorId, videoData) {
    // get creator memory context
    const memoryContext = await memoryManager.getCreatorContext(creatorId);
    
    // analyze current thumbnail performance
    const thumbnailAnalysis = await brightmatter.analyzeThumbnail(videoData, memoryContext);
    
    // generate optimized thumbnails using o3
    const optimizedThumbnails = await brightmatter.generateOptimizations(thumbnailAnalysis);
    
    // store execution in workflow memory
    await this.recordExecution(creatorId, {
      agent_type: 'thumbnail_optimizer',
      input: videoData,
      output: optimizedThumbnails,
      memory_context: memoryContext
    });
    
    return optimizedThumbnails;
  }
}
### 8.2 clipping agent
class ClippingAgent {
  async generateClips(creatorId, videoData) {
    // get creator's successful clip patterns from memory
    const clipPatterns = await memoryManager.getClipPatterns(creatorId);
    
    // analyze video for clip opportunities
    const clipMoments = await brightmatter.identifyClipMoments(videoData, clipPatterns);
    
    // generate clips with sponsor potential scoring
    const generatedClips = await this.processClipMoments(clipMoments);
    
    // update content knowledge memory
    await this.updateContentMemory(creatorId, videoData, clipMoments);
    
    return generatedClips;
  }
}

## 9. deployment pipeline
### 9.1 mongodb atlas + railway + vercel
# railway.json for backend deployment
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "sleepApplication": false
  },
  "environments": {
    "production": {
      "variables": {
        "NODE_ENV": "production",
        "MONGODB_ATLAS_URI": "${{MONGODB_ATLAS_URI}}",
        "OPENAI_API_KEY": "${{OPENAI_API_KEY}}",
        "VOYAGE_API_KEY": "${{VOYAGE_API_KEY}}",
        "REDPANDA_BROKER_URL": "${{REDPANDA_BROKER_URL}}",
        "FIREBASE_PROJECT_ID": "${{FIREBASE_PROJECT_ID}}"
      }
    }
  }
}
### 9.2 ci/cd with memory validation
# github workflows
name: Deploy with Memory Validation
on:
  push:
    branches: [main]

jobs:
  test-memory-systems:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Test Memory Patterns
        run: |
          npm test -- --testPathPattern=memory
          npm run test:brightmatter
          npm run test:signal-engine
      
  deploy-backend:
    needs: test-memory-systems
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        uses: railway-app/railway-deploy@v2
        with:
          service: veri-signal-engine
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: vercel/action@v1

## 10. success metrics + validation
### 10.1 memory system metrics
// memory performance tracking
class MemoryMetrics {
  async trackCompoundLearning() {
    return {
      cross_creator_improvement: await this.measureCrossCreatorLearning(),
      memory_decay_effectiveness: await this.measureMemoryDecay(),
      semantic_search_accuracy: await this.measureSearchAccuracy(),
      brightmatter_prediction_accuracy: await this.measurePredictionAccuracy()
    };
  }

  async measureCrossCreatorLearning() {
    // measure how creator A's interactions improve recommendations for similar creator B
    const improvementMetrics = await db.interactions.aggregate([
      // complex aggregation to measure compound learning effectiveness
    ]);
    return improvementMetrics;
  }
}
### 10.2 mvp launch targets
* **memory accuracy:** 67% prediction accuracy on campaign performance by month-6
* **cost efficiency:** maintain $3.30/creator monthly cost target
* **retention impact:** 40-60% creator 7-day retention via memory-driven personalization
* **compound learning:** measurable improvement in recommendations from cross-creator patterns

⠀
*this technical specification aligns with veri's signal engine v4 memory-driven architecture, providing complete implementation guidance for 8-week mvp development with brightmatter intelligence and persistent creator memory.*
