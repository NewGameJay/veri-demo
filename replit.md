# Veri MVP - Creator Platform

## Overview
Veri MVP is an AI-powered creator monetization platform designed to connect social media creators with brands. It aims to revolutionize brand-creator collaborations through intelligent matching, gamified engagement, and memory-driven optimization. The platform features an advanced signal processing engine, a transparent VeriScore reputation system, and a modern glass morphism design. Key capabilities include AI intelligence for content optimization, a persistent memory system for learning, a 6-factor VeriScore algorithm, comprehensive security, and a scalable architecture supporting high user and event volumes. The MVP currently offers full authentication, a sophisticated profile builder, AI integration, real-time leaderboards, a campaign marketplace, and an AI Agent Studio.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX preferences: Prefers sophisticated glass morphism with translucent effects for a luxury, high-end feel. Hover effects should maintain good contrast and readability while being visually striking.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Caching**: Redis for session management and high-performance caching
- **Event Streaming**: Apache Kafka for real-time event processing
- **Message Queue**: Kafka topics for async communication
- **API Design**: RESTful API with JSON responses
- **Storage**: Hybrid storage with PostgreSQL, Redis
- **Authentication**: Session-based authentication with secure user management
- **Monitoring**: Prometheus-compatible metrics and health endpoints

### Database Schema
Key entities include Users (profiles, VeriScore, XP), Social Connections, Tasks, Leaderboard, Sessions, Raw Social Data, and Chat Memory. The schema also includes an `apiUsage` table for cost tracking.

### Microservices Architecture
- **API Gateway**: Express server for client requests
- **Event Consumer**: Python service for event enrichment and processing
- **Signal Engine**: Extracts insights from social data
- **Cache Manager**: Handles Redis operations
- **Connection Factory**: Manages database connections
- **Metrics Collector**: Prometheus-compatible monitoring

### Design System
- **Primary Color**: #00d6a2 (teal/green)
- **Accent Color**: #8456ff (purple)
- **Typography**: Termina Bold (headings), PP Neue Machina (accent), Inter (body)
- **Glass Morphism**: Apple-like frosted glass with 20px blur and saturation effects, integrated across UI components (buttons, cards, forms, dialogs, navigation header).
- **Animations**: Smooth cubic-bezier transitions, pulse effects, hover scaling, 3D button transformations, icon float animations, ripple effects.
- **Brand Assets**: Veri logo, brand-aligned social platform icons.
- **Responsive Design**: Mobile-first approach with enhanced touch interactions.

### Key Features and Implementations
- **Authentication & Social Integration**: JWT tokens, OAuth integration, Firebase Authentication (planned), social platform APIs.
- **Gamification System**: VeriScore (0-100 reputation), XP points, real-time leaderboards, achievement system.
- **AI Agent Integration**: Profile-based AI agents, memory-driven intelligence, revenue optimization tools. AI Agent Studio with Veri-branded chatbot interface and engine selection.
- **Signal Engine**: Processes engagement, viral, safety, and quality signals with temporal decay.
- **VeriScore Algorithm**: Dynamic scoring based on 6 factors (engagement, consistency, growth, quality, authenticity, community).
- **AI Content Optimizer**: Intelligent content analysis and optimization.
- **Model Context Protocol (MCP)**: Backend infrastructure with tool registry and connectors (Google Drive, Slack, Notion, Custom API).
- **Rate Limiting & Cost Control**: Global and AI-specific rate limiting, API usage monitoring, and cost tracking service.
- **Unified Profile Builder**: Visual interface with public profile URLs (`veri.club/username`), three-tab interface (Edit, Preview, Share), social platform integration, and content showcase.
- **Gamified Task System**: Distinction between quick tasks and comprehensive campaigns, streamlined verification, and celebratory emoji reactions.

## External Dependencies

- **React Query**: Server state management
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL hosting
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Firebase Authentication**: User management (planned)
- **Social platform APIs**: Twitter, YouTube, Instagram, TikTok
- **OpenAI**: Content analysis, embeddings
- **MongoDB Atlas**: Memory-driven intelligence (planned)
- **Voyage embeddings**: Semantic search (planned)
- **Apache Kafka**: Event streaming
- **Redis**: Caching, session management
- **@rate-limiter-flexible**: Rate limiting
- **googleapis**: Google Drive connector
- **@slack/web-api**: Slack connector
- **@notionhq/client**: Notion connector
- **node-fetch**: Custom API connector
- **ChromaDB**: Vector database (for embeddings)