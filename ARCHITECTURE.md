# Veri Hybrid Stack - Architecture Overview

## What We're Building

A comprehensive technical architecture for Veri's creator monetization platform with dual-path implementation strategy:

1. **Signal Engine Architecture** - Memory-driven intelligence platform that treats creator data as persistent memory rather than disposable analytics
2. **Baseline MVP Stack** - Lightweight PostgreSQL + Redpanda implementation for rapid launch
3. **Hybrid Migration Framework** - Seamless transition path from baseline to full signal engine

## Current Implementation Status

### ✅ Completed
- Full React/TypeScript frontend with dashboard, analytics, and AI agent interfaces
- PostgreSQL database with Drizzle ORM for type-safe operations
- Express.js API server with session management
- Complete authentication flow with social platform connections
- Task verification system with gamification
- Real-time leaderboards and VeriScore tracking

### 🚧 Next Phase: Infrastructure Setup
- Redpanda/Kafka for event streaming
- Redis for caching and session storage
- Memory formation framework
- Signal extraction algorithms
- Hybrid search capabilities

## Architecture Layers

### 1. Frontend Layer (Completed)
- **Framework**: React 18 with TypeScript
- **State Management**: React Query + Context API
- **UI Components**: Radix UI + Tailwind CSS
- **Real-time Updates**: WebSocket integration (planned)

### 2. API Layer (In Progress)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Caching**: Redis (to be implemented)
- **Event Streaming**: Redpanda (to be implemented)
- **Authentication**: Session-based with OAuth ready

### 3. Data Processing Layer (To Be Built)
- **Stream Processing**: Python consumer for enrichment
- **LLM Integration**: Anthropic Claude for chat
- **Memory Formation**: Signal extraction and storage
- **Analytics**: Real-time and batch processing

### 4. Storage Layer (Hybrid Approach)
- **Phase 1**: PostgreSQL for all data (current)
- **Phase 2**: Dual-write to MongoDB Atlas
- **Phase 3**: MongoDB primary with vector search

## Feature Flags for Migration

```typescript
// Environment variables for phased migration
USE_MONGO=false         // Enable dual-write mode
READ_FROM_MONGO=false   // Switch primary read source
HYBRID_SEARCH=false     // Enable vector search
MEMORY_DECAY=false      // Intelligent forgetting
```

## Memory Architecture

### Memory Types
1. **Creator Entity Memory** - Complete creator profiles with preferences
2. **Campaign Episodic Memory** - Brand interactions and outcomes
3. **Content Knowledge Memory** - Video analysis and engagement patterns
4. **Brand Interaction Memory** - Communication history and ROI data
5. **Workflow Memory** - Agent execution logs and patterns

### Memory Formation Process
```
Raw Interaction → Signal Extraction → Memory Formation → Compound Learning → Improved Recommendations
```

## Cost Targets
- **Baseline MVP**: <$100/month for 500 creators
- **Signal Engine**: <$3.30/creator/month at scale
- **Infrastructure**: Auto-scaling with circuit breakers

## Success Metrics
- **Technical**: ≤1s chat latency, 99%+ uptime
- **Business**: 50%+ ROI prediction accuracy, 35%+ creator retention
- **Scale**: Support 10M+ events/month

## Migration Timeline
- **Week 1**: Baseline infrastructure setup
- **Week 2**: Dual-write implementation
- **Week 3**: Signal engine capabilities
- **Week 4**: Migration and optimization