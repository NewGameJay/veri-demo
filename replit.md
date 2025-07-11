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

## Recent Updates (July 10-11, 2025)
- ✅ Implemented collapsible dashboard sidebar with three states: open, collapsed (icon-only), and hidden
- ✅ Fixed light mode text visibility across all sections, especially "Getting Started" with proper contrast
- ✅ Enhanced dashboard navigation with smooth transitions and intuitive collapse/expand functionality
- ✅ Improved accessibility with tooltips for collapsed menu items
- ✅ Fixed duplicate task sections by removing redundant tabs from VeriScoreCard component
- ✅ Added production-ready polish with performance optimizations:
  - GPU-accelerated animations with transform-gpu and will-change properties
  - Reduced motion support for accessibility
  - Error boundaries for graceful error handling
  - Shadow depth utilities for better visual hierarchy
  - Optimized imports and removed unused dependencies
  - Enhanced focus states for form interactions
  - Consistent 4pt grid spacing system
- ✅ Implemented fully functional navigation system with all pages:
  - Profile page with social connections and personal info management
  - Analytics page with performance metrics and platform insights
  - Leaderboard page with global rankings and tier system
  - AI Agent Studio page with streak-based access control
  - Settings page with notification, privacy, and subscription management
- ✅ Added logout functionality to dashboard sidebar
- ✅ Fixed routing to ensure all pages are accessible via sidebar navigation
- ✅ Implemented enterprise-grade hybrid stack infrastructure:
  - PostgreSQL for primary data storage with connection pooling
  - Redis for high-performance caching and session management
  - Kafka for event streaming and real-time data processing
  - Python consumer service for event enrichment and signal extraction
  - Docker containerization for all services
  - Health monitoring endpoints and metrics collection
  - Production deployment scripts with automated setup
- ✅ Created comprehensive monitoring and observability framework:
  - Request timing middleware for API performance tracking
  - Prometheus-compatible metrics endpoint
  - Error tracking and logging infrastructure
  - Database query monitoring
  - Cache hit/miss tracking
- ✅ Built event-driven architecture for real-time processing:
  - Social media event ingestion and enrichment
  - Content analysis with sentiment and engagement scoring
  - Signal extraction for viral potential and brand safety
  - Memory formation pipeline for AI agents
  - Kafka topics for async communication between services
- ✅ Fixed VeriScore animation glitching issue and improved task verification system:
  - Enhanced useCounter hook with proper memoization and cleanup
  - VeriScore calculation now properly memoized to prevent unnecessary recalculations
  - Added MVP Test Task for easy demo verification without requiring real social media posting
  - Task verification now actually awards XP points and increases VeriScore
  - Backend task verification endpoint properly integrates with user progression system
  - MVP Test Task accepts URLs containing "test", "demo", or "veri" for guaranteed success during demos