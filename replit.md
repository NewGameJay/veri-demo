# Veri MVP - Creator Platform

## Overview

This is a complete creator-focused platform built with React, TypeScript, and Express that connects social media creators with brands for authentic engagement tasks and AI-powered content optimization. The platform features a gamified points system, real-time leaderboards, and AI agents to help creators monetize their content.

The MVP is now fully functional with:
- Complete authentication flow with modal integration and proper onboarding
- Task verification system with social platform validation
- Profile builder for creators and studios
- Memorizz repository integration for AI-powered memory-driven intelligence
- Enhanced Apple-like glass morphism design with smooth animations
- Brand assets implementation (actual Veri logo, Termina Bold typography, brand colors)
- Dynamic user info display in header with real XP points and user data
- Animated social connections with brand-aligned platform icons
- Mobile-first responsive design with Lottie-style effects
- PostgreSQL database integration for persistent data storage
- Full social media platform connection functionality
- Enhanced hamburger menu with auto-collapse, pin functionality, and collapsible sidebar with icon-only mode

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
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM (primary storage)
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Caching**: Redis for session management and high-performance caching
- **Event Streaming**: Apache Kafka for real-time event processing
- **Message Queue**: Kafka topics for async communication
- **API Design**: RESTful API with JSON responses
- **Storage**: Hybrid storage with PostgreSQL, Redis, and optional MongoDB
- **Authentication**: Session-based authentication with secure user management
- **Monitoring**: Prometheus-compatible metrics and health endpoints

### Database Schema
The application uses a PostgreSQL database with these main entities:
- **Users**: Core user profiles with VeriScore and XP points
- **Social Connections**: Platform integrations (Twitter, YouTube, Instagram)
- **Tasks**: Engagement activities that earn points
- **Leaderboard**: Global and category-based rankings
- **Sessions**: Express session storage for authentication
- **Raw Social Data**: Event data from social platforms
- **Chat Memory**: AI agent conversation history

### Microservices Architecture
- **API Gateway**: Express server handling all client requests
- **Event Consumer**: Python service for event enrichment and processing
- **Signal Engine**: Extracts actionable insights from social data
- **Cache Manager**: Handles Redis operations with fallback to memory
- **Connection Factory**: Manages database connections and pooling
- **Metrics Collector**: Prometheus-compatible monitoring

## Key Components

### Design System
- **Primary Color**: #00d6a2 (teal/green) 
- **Accent Color**: #8456ff (purple)
- **Typography**: Termina Bold (headings), PP Neue Machina (accent text), Inter (body text)
- **Glass Morphism**: Enhanced Apple-like frosted glass with 20px blur and saturation effects
- **Animations**: Smooth cubic-bezier transitions, pulse effects, hover scaling
- **Brand Assets**: Veri logo implementation, brand-aligned social platform icons
- **Responsive Design**: Mobile-first approach with enhanced touch interactions

### Authentication & Social Integration
- Firebase Authentication for user management
- OAuth integration with major social platforms
- Social connection status tracking and point rewards

### Gamification System
- **VeriScore**: Primary reputation metric (0-100)
- **XP Points**: Earned through task completion
- **Leaderboards**: Real-time rankings with live activity
- **Achievement System**: Task completion and milestone rewards

### AI Agent Integration
- Profile-based AI agents for content optimization
- Memory-driven intelligence (planned MongoDB Atlas integration)
- Revenue optimization tools and analytics

## Data Flow

1. **User Onboarding**: OAuth → Profile Creation → Social Platform Connection
2. **Content Analysis**: Platform data ingestion → AI processing → Insights generation
3. **Task System**: Brand tasks → User completion → Point rewards → Leaderboard updates
4. **AI Enhancement**: User data → Memory processing → Personalized recommendations

## External Dependencies

### Core Dependencies
- **React Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL hosting
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Authentication & Social
- Firebase Authentication (planned)
- Social platform APIs (Twitter, YouTube, Instagram, TikTok)

### AI & Analytics
- OpenAI integration for content analysis
- MongoDB Atlas for memory-driven intelligence (planned)
- Voyage embeddings for semantic search (planned)

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: Express server with TypeScript compilation
- **Database**: In-memory storage for MVP, PostgreSQL for production

### Production Deployment
- **Frontend**: Static build deployed to Vercel or similar
- **Backend**: Node.js server on Railway or similar platform
- **Database**: Neon Database (serverless PostgreSQL)
- **Environment**: Separate staging and production environments

### Build Process
- `npm run dev`: Development server with hot reloading
- `npm run build`: Production build with Vite bundling and esbuild compilation
- `npm run start`: Production server startup
- `npm run db:push`: Database schema synchronization

The application is designed to scale from MVP to full marketplace functionality, with the current implementation focusing on core creator onboarding, social connections, and gamification features.

## Recent Updates (July 21, 2025)

### Task Preview Enhancement (July 21, 2025)
- ✅ **Task Preview Modal Implementation**: Full task details modal shows when clicking task cards
  - Complete task overview with description, duration, category, and all requirements
  - Glass morphism design matching site aesthetic with proper backdrop blur
  - Start task button directly from preview modal for seamless workflow
- ✅ **Gamified Task Interactions**: Streamlined dual-action interface for better user experience
  - Click anywhere on card to open detailed preview modal with complete task information
  - Prominent teal "Start" button in bottom right corner for immediate task initiation
  - Removed complex expand/collapse functionality for cleaner interface
  - Teal button styling with hover animations for gamified feel
- ✅ **Improved User Experience**: Better task discovery and decision-making process
  - Users can review complete requirements before committing to tasks (via card click)
  - Quick action via gamified Start button for users ready to begin immediately
  - Consistent glass design language throughout preview experience
  - Simplified interaction model reduces cognitive load

## Recent Updates (July 18, 2025)

### Sprint 5 Glass Morphism Enhancement (July 18, 2025)
- ✅ **Comprehensive Glass Morphism Design System**: Implemented 3-phase glass morphism system with enhanced CSS foundation
  - Primary, secondary, and interactive glass utility classes with proper backdrop-blur and saturation
  - Advanced shadow systems with multiple layers for depth and premium feel
  - Enhanced focus states for accessibility and form interactions
- ✅ **Component Glass Integration**: Updated all core UI components with refined glass effects
  - Buttons: Multiple glass variants (glass, glassSecondary, glassPrimary) with hover transformations
  - Cards: Glass variants (glass, elevated) with proper layering and depth
  - Forms: Input, textarea, select components with glass-secondary styling and smooth transitions
  - Dialogs: Glass-primary content with enhanced backdrop blur overlay
  - Tabs: Glass-secondary styling for consistent design language
- ✅ **Liquid Glass Navigation Header**: Advanced morphing effect for premium navigation experience
  - 32px backdrop blur with saturation and brightness enhancement
  - Gradient background with subtle shimmer animation (12s cycle, 0.02-0.03 opacity)
  - Radial gradient overlay and proper z-index layering for content visibility
  - Refined animation for subtle, non-distracting visual enhancement
- ✅ **Enhanced Dashboard Panel Navigation**: Professional hover effects and scroll behavior
  - Dashboard navigation items with darker charcoal background (gray-900/95) on hover
  - Multi-layered dimensional glow effects with bottom shadows for depth
  - Smooth 300ms transitions for all interactive elements
  - Scroll-triggered TabsList collapse with optimized performance (requestAnimationFrame throttling)
  - Polished collapse animation with scale-down (95%) and translate effects
  - 500ms ease-in-out transitions for natural, professional feel
- ✅ **Elegant Micro-interactions with 3D Effects**: Comprehensive button enhancement system
  - 3D button transformations with translateY(-2px) hover lift and perspective effects
  - Multi-layered depth shadows (2px, 4px, 8px, 16px) for realistic button elevation
  - Subtle press animations with scale(0.98) feedback for tactile response
  - Icon float animations with individual translateY(-1px) micro-movements
  - Ripple effect feedback with radial gradient expansion on button press
  - Enhanced focus states with emerald outline rings for accessibility
  - Applied consistently across dashboard sidebar, tabs, and liquid glass buttons
  - Staggered animation support for list elements and glass card interactions
- ✅ **Responsive Campaigns Page Layout**: Enhanced responsive behavior when sidebar is collapsed
  - Dashboard panel remains open by default, requiring user action to collapse for full-width view
  - Persistent sidebar state management with localStorage synchronization across pages
  - Dynamic content width adjustment (max-w-5xl→6xl→7xl based on sidebar state)
  - Adaptive grid layouts for stats cards and analytics based on available space
  - Smooth transition animations (500ms ease-in-out) for polished layout changes
  - Smart responsive breakpoints that adapt to sidebar open/collapsed/closed states

## Recent Updates (July 15, 2025)

### Sprint 5: Backend API Rate Limiting & Cost Control (July 15, 2025)
- ✅ **Rate Limiting Middleware Implementation**: Created comprehensive rate limiting system with `rate-limiter-flexible` package
  - Global rate limiter: 1000 requests per hour per user/IP
  - AI endpoint rate limiter: 100 requests per hour for AI-intensive operations
  - Dormant by default (RATE_LIMIT_ENABLED=false), zero performance impact when disabled
  - Differentiates between regular API calls and AI/Brightmatter endpoints
  - Proper error handling with 429 status codes and retry-after headers
- ✅ **Cost Tracking Service**: Implemented comprehensive API usage monitoring and cost control system
  - ApiCostTracker singleton service for tracking OpenAI, Anthropic, and ChromaDB usage
  - Database table `api_usage` with proper indexing for performance queries
  - Daily budget limits per service with configurable thresholds
  - Real-time cost calculation with accurate pricing models for each AI service
  - Usage analytics with user-specific and service-specific breakdowns
  - Budget alerts and logging when daily limits are exceeded
- ✅ **Admin Monitoring Endpoints**: Created internal-only admin API routes for cost and usage monitoring
  - `/api/admin/usage/summary` - Daily cost summary across all services
  - `/api/admin/usage/user/:userId` - Individual user usage analysis
  - Authentication required for all admin endpoints
  - No UI components - purely backend monitoring for internal use
- ✅ **Database Schema Extension**: Added `apiUsage` table to PostgreSQL schema
  - Comprehensive tracking of userId, service, endpoint, tokens, and estimated costs
  - Optimized indexes for service/date queries and user-specific lookups
  - Proper decimal precision for cost calculations
  - Integration with existing Drizzle ORM and type system
- ✅ **AI Service Cost Integration**: Enhanced Brightmatter AI services with cost tracking
  - AI Content Optimizer wrapped with usage tracking for all AI calls
  - Accurate token counting and cost calculation for OpenAI and Anthropic
  - Vector store usage tracking for ChromaDB embedding operations
  - Proper error handling and fallback to mock data when budgets exceeded
- ✅ **Environment Configuration**: Comprehensive environment variable system for feature control
  - All features dormant by default (RATE_LIMIT_ENABLED=false, API_COST_TRACKING_ENABLED=false)
  - Per-service daily budget limits (OpenAI: $20, Anthropic: $20, ChromaDB: $5)
  - Configurable rate limits and cost thresholds
  - Production-ready activation system for Phase 2 deployment
- ✅ **Middleware Integration**: Seamlessly integrated rate limiting with existing route system
  - Applied to all routes but dormant unless explicitly enabled
  - No impact on existing functionality or performance
  - Proper integration with existing auth middleware and monitoring systems
- ✅ **Testing Framework**: Created comprehensive test suite for Sprint 5 features
  - Tests verify dormant behavior by default
  - Rate limiting bypass verification when disabled
  - Cost tracking non-operation when disabled
  - Environment variable default validation
  - Integration tests for existing functionality preservation

### Previous Sprint Implementations (July 10-15, 2025)
- ✅ Unified Profile Builder Implementation (July 15, 2025):
  - **Visual Profile Builder Interface**: Created comprehensive UnifiedProfileBuilder component with edit, preview, and share functionality accessible from both dashboard panel and tab list
  - **Custom Public Profile URLs**: Implemented veri.club/username custom URLs with dedicated public profile page showcasing VeriScore, social connections, and featured content
  - **Enhanced Database Schema**: Added customUsername, website, and showcaseContent fields to users table for comprehensive profile management
  - **Backend API Endpoints**: Created profile update (PATCH /api/users/:id/profile) and public profile viewing (GET /api/public-profile/:username) endpoints
  - **Three-Tab Interface**: Edit tab for profile management, Preview tab for real-time editing feedback, Share tab for social sharing and public link generation
  - **Social Platform Integration**: Only displays connected platforms to encourage users to complete social connections, includes follower counts and engagement metrics
  - **Featured Content Showcase**: Displays top performing content from connected platforms with engagement metrics and platform-specific styling
  - **Tier-Based Ranking**: Shows user's global rank with Diamond/Platinum/Gold/Silver/Bronze tier badges based on VeriScore
  - **Share Functionality**: Copy to clipboard and social media sharing with platform-specific messaging for Twitter and LinkedIn
  - **Mobile-Responsive Design**: Full mobile optimization with touch-friendly interfaces and responsive grid layouts
- ✅ Sprint 5: Complete Signal Engine Architecture & MCP Tools Integration (July 15, 2025):
  - **Complete MCP Backend Infrastructure**: Implemented full Model Context Protocol server with tool registry, connector system, and API endpoints
  - **Four MCP Connectors**: Created Google Drive, Slack, Notion, and Custom API connectors with full backend implementation and configuration management
  - **API Integration**: Added comprehensive REST API endpoints for MCP status, tools, and connector management with proper authentication
  - **Settings UI Integration**: Updated VeriConnectors component to connect to real MCP API endpoints instead of demo mode
  - **Demo Mode Implementation**: All connectors display as "Coming Soon" in demo mode while backend infrastructure is fully functional
  - **Complete Architecture**: Full Signal Engine with event streaming, AI processing, and caching layers now code-complete
  - **Technical Dependencies**: Added googleapis, @slack/web-api, @notionhq/client, node-fetch packages for MCP functionality
  - **Production Ready**: MCP server initialization, tool registry, and connector management fully implemented with proper error handling
  - **Memorriz Memory Intelligence Layer**: Implemented complete memory-driven AI system with context management, semantic indexing, and memory pruning
  - **Vector Store Integration**: Created abstraction layer with ChromaDB provider, OpenAI embeddings wrapper, and comprehensive embedding management
  - **Enhanced Signal Engine**: Built complete signal processing system for engagement, viral, safety, and quality analysis with temporal decay
  - **VeriScore Calculator**: Implemented dynamic scoring algorithm with 6 factors (engagement, consistency, growth, quality, authenticity, community)
  - **AI Content Optimizer**: Created intelligent content analysis and optimization with viral potential analysis and trend insights
  - **Brightmatter AI Core**: Orchestrated all AI components with unified analysis, recommendations, and caching system
  - **Docker Infrastructure**: Added ChromaDB vector database service to docker-compose.yml with proper health checks
  - **Complete API Integration**: Added comprehensive REST API endpoints for all Brightmatter AI functionality at /api/brightmatter/*
- ✅ Sprint 4 Complete Implementation (July 15, 2025):
  - **Task vs Campaign Architecture**: Successfully differentiated Tasks (quick micro-actions) from Campaigns (full sponsored collaborations)
  - **Visual Profile Builder Interface**: Enhanced profile builder with Matt's Figma-inspired visual card-based profile type selection
  - **Campaign Application Multi-Field Enhancement**: Replaced single text input with comprehensive structured application form
  - **Technical Fixes Bundle**: Task points synchronization, AI agent unlock mechanism, real user data integration
  - **Analytics Page Data Simulation**: Realistic data generation with gaming creator patterns and interactive SVG charts
  - **Global Leaderboard Expansion**: Scalable leaderboard generator with 10,000+ realistic gaming creator profiles
  - **Profile Builder 2.0**: X.com/Facebook-inspired design with banner and profile picture editing capabilities