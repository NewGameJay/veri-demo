# Veri MVP - Creator Platform

## Overview

This is a complete creator-focused platform built with React, TypeScript, and Express that connects social media creators with brands for authentic engagement tasks and AI-powered content optimization. The platform features a gamified points system, real-time leaderboards, and AI agents to help creators monetize their content.

The MVP is now fully functional with:
- Complete authentication flow with modal integration and proper onboarding
- Task verification system with social platform validation
- Profile builder for creators and studios
- Memorizz repository integration for AI-powered memory-driven intelligence
- Enhanced Apple-like glass morphism design with smooth animations
- Brand assets implementation (Veri logo, Termina Bold typography, brand colors)
- Dynamic user info display in header with real XP points and user data
- Animated social connections with brand-aligned platform icons
- Mobile-first responsive design with Lottie-style effects
- PostgreSQL database integration for persistent data storage
- Full social media platform connection functionality
- Streamlined dashboard navigation (task buttons removed from sidebar)

## User Preferences

Preferred communication style: Simple, everyday language.

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
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Storage**: DatabaseStorage class with full CRUD operations
- **Authentication**: Session-based authentication with secure user management

### Database Schema
The application uses a PostgreSQL database with these main entities:
- **Users**: Core user profiles with VeriScore and XP points
- **Social Connections**: Platform integrations (Twitter, YouTube, Instagram)
- **Tasks**: Engagement activities that earn points
- **Leaderboard**: Global and category-based rankings

## Key Components

### Design System
- **Primary Color**: #00d6a2 (teal/green) 
- **Accent Color**: #8456ff (purple)
- **Typography**: Termina Bold (headings), PP Neue Machina (accent), Inter (body)
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