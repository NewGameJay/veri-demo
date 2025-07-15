/**
 * Context Manager - Session and long-term context handling for Veri platform
 * Tracks user sessions, manages context switching, and provides relevance scoring
 */

import { MemoryChunk, memorizzCore } from './memorizzCore';

export interface SessionContext {
  sessionId: string;
  userId: number;
  startTime: number;
  lastActivity: number;
  windowSize: number; // in minutes
  activeMemories: MemoryChunk[];
  contextType: 'task' | 'social' | 'campaign' | 'ai_agent' | 'profile' | 'general';
  relevanceScore: number;
  metadata: {
    platform?: string;
    deviceType?: string;
    location?: string;
    referrer?: string;
  };
}

export interface ContextMergeResult {
  mergedContext: MemoryChunk[];
  shortTermWeight: number;
  longTermWeight: number;
  relevanceScores: number[];
  contextSwitchDetected: boolean;
}

export interface ContextRelevanceScore {
  contextId: string;
  relevanceScore: number;
  factors: {
    temporal: number;
    semantic: number;
    behavioral: number;
    engagement: number;
  };
  confidence: number;
}

export class ContextManager {
  private activeSessions: Map<string, SessionContext>;
  private contextHistory: Map<number, SessionContext[]>;
  private slidingWindowSize: number;
  private contextSwitchThreshold: number;
  private maxActiveContexts: number;

  constructor(options: {
    slidingWindowSize?: number;
    contextSwitchThreshold?: number;
    maxActiveContexts?: number;
  } = {}) {
    this.activeSessions = new Map();
    this.contextHistory = new Map();
    this.slidingWindowSize = options.slidingWindowSize || 30; // 30 minutes
    this.contextSwitchThreshold = options.contextSwitchThreshold || 0.3;
    this.maxActiveContexts = options.maxActiveContexts || 5;
  }

  /**
   * Create or update a session context
   */
  async createSessionContext(
    sessionId: string,
    userId: number,
    contextType: SessionContext['contextType'],
    metadata: SessionContext['metadata'] = {}
  ): Promise<SessionContext> {
    try {
      const now = Date.now();
      
      const context: SessionContext = {
        sessionId,
        userId,
        startTime: now,
        lastActivity: now,
        windowSize: this.slidingWindowSize,
        activeMemories: [],
        contextType,
        relevanceScore: 1.0,
        metadata
      };

      // Load relevant memories for this context
      const memories = await memorizzCore.retrieveMemories({
        userId,
        query: contextType,
        timeRange: {
          start: now - (this.slidingWindowSize * 60 * 1000),
          end: now
        },
        limit: 20
      });

      context.activeMemories = memories.chunks;
      
      // Store in active sessions
      this.activeSessions.set(sessionId, context);
      
      // Add to user's context history
      this.addToContextHistory(userId, context);
      
      return context;
    } catch (error) {
      console.error('Error creating session context:', error);
      throw new Error('Failed to create session context');
    }
  }

  /**
   * Update session activity and refresh context
   */
  async updateSessionActivity(
    sessionId: string,
    newActivity: Partial<MemoryChunk>
  ): Promise<SessionContext | null> {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context) {
        return null;
      }

      const now = Date.now();
      context.lastActivity = now;

      // Add new activity to memories if provided
      if (newActivity.content) {
        const memoryChunk: MemoryChunk = {
          id: `ctx_${now}_${Math.random().toString(36).substr(2, 9)}`,
          userId: context.userId,
          content: newActivity.content,
          metadata: {
            timestamp: now,
            interactionType: newActivity.metadata?.interactionType || context.contextType,
            contextId: sessionId,
            importance: newActivity.metadata?.importance || 0.5,
            tags: newActivity.metadata?.tags || []
          }
        };

        context.activeMemories.push(memoryChunk);
        await memorizzCore.storeInteraction(memoryChunk);
      }

      // Check if context window needs sliding
      await this.slideContextWindow(context);

      // Detect context switches
      const contextSwitch = await this.detectContextSwitch(context);
      if (contextSwitch) {
        console.log(`Context switch detected for session ${sessionId}`);
        // TODO: Handle context switch (create new context, archive old one)
      }

      return context;
    } catch (error) {
      console.error('Error updating session activity:', error);
      return null;
    }
  }

  /**
   * Merge short-term and long-term memories for context
   */
  async mergeContextMemories(
    sessionId: string,
    lookbackHours: number = 24
  ): Promise<ContextMergeResult> {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context) {
        throw new Error('Session context not found');
      }

      const now = Date.now();
      const lookbackTime = now - (lookbackHours * 60 * 60 * 1000);

      // Get short-term memories (current session)
      const shortTermMemories = context.activeMemories;

      // Get long-term memories from storage
      const longTermMemories = await memorizzCore.retrieveMemories({
        userId: context.userId,
        query: context.contextType,
        timeRange: {
          start: lookbackTime,
          end: now - (this.slidingWindowSize * 60 * 1000)
        },
        limit: 50
      });

      // Calculate relevance scores
      const shortTermScores = shortTermMemories.map(m => 
        this.calculateRelevanceScore(m, context.contextType, 'short_term')
      );
      const longTermScores = longTermMemories.chunks.map(m => 
        this.calculateRelevanceScore(m, context.contextType, 'long_term')
      );

      // Merge and sort by relevance
      const mergedMemories = [
        ...shortTermMemories.map((m, i) => ({ memory: m, score: shortTermScores[i], type: 'short' })),
        ...longTermMemories.chunks.map((m, i) => ({ memory: m, score: longTermScores[i], type: 'long' }))
      ].sort((a, b) => b.score - a.score);

      const result: ContextMergeResult = {
        mergedContext: mergedMemories.slice(0, this.maxActiveContexts).map(m => m.memory),
        shortTermWeight: 0.7, // Favor recent memories
        longTermWeight: 0.3,
        relevanceScores: mergedMemories.slice(0, this.maxActiveContexts).map(m => m.score),
        contextSwitchDetected: false // TODO: Implement context switch detection
      };

      return result;
    } catch (error) {
      console.error('Error merging context memories:', error);
      throw new Error('Failed to merge context memories');
    }
  }

  /**
   * Calculate relevance score for a memory chunk
   */
  calculateRelevanceScore(
    memory: MemoryChunk,
    currentContext: string,
    timeType: 'short_term' | 'long_term'
  ): number {
    try {
      const now = Date.now();
      const age = now - memory.metadata.timestamp;
      
      // Temporal decay (more recent = higher score)
      const temporalScore = timeType === 'short_term' 
        ? Math.exp(-age / (1000 * 60 * 60)) // 1 hour half-life
        : Math.exp(-age / (1000 * 60 * 60 * 24)); // 24 hour half-life

      // Semantic similarity (mock implementation)
      const semanticScore = currentContext === memory.metadata.interactionType ? 0.8 : 0.3;

      // Importance score from metadata
      const importanceScore = memory.metadata.importance;

      // Behavioral score (based on engagement patterns)
      const behavioralScore = memory.metadata.tags.length > 0 ? 0.6 : 0.4;

      // Combined score
      const relevanceScore = (
        temporalScore * 0.3 +
        semanticScore * 0.4 +
        importanceScore * 0.2 +
        behavioralScore * 0.1
      );

      return Math.min(relevanceScore, 1.0);
    } catch (error) {
      console.error('Error calculating relevance score:', error);
      return 0.1; // Default low score
    }
  }

  /**
   * Get context statistics for a user
   */
  async getContextStats(userId: number): Promise<{
    activeContexts: number;
    totalSessions: number;
    averageSessionDuration: number;
    contextSwitches: number;
    mostUsedContext: string;
  }> {
    try {
      const userHistory = this.contextHistory.get(userId) || [];
      const activeSessions = Array.from(this.activeSessions.values())
        .filter(ctx => ctx.userId === userId);

      const totalSessions = userHistory.length;
      const averageSessionDuration = userHistory.length > 0
        ? userHistory.reduce((sum, ctx) => sum + (ctx.lastActivity - ctx.startTime), 0) / totalSessions
        : 0;

      // Count context types
      const contextCounts = userHistory.reduce((counts, ctx) => {
        counts[ctx.contextType] = (counts[ctx.contextType] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

      const mostUsedContext = Object.entries(contextCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general';

      return {
        activeContexts: activeSessions.length,
        totalSessions,
        averageSessionDuration,
        contextSwitches: 0, // TODO: Implement context switch counting
        mostUsedContext
      };
    } catch (error) {
      console.error('Error getting context stats:', error);
      return {
        activeContexts: 0,
        totalSessions: 0,
        averageSessionDuration: 0,
        contextSwitches: 0,
        mostUsedContext: 'general'
      };
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    try {
      const now = Date.now();
      const expiredSessions: string[] = [];

      for (const [sessionId, context] of this.activeSessions) {
        const sessionAge = now - context.lastActivity;
        const maxAge = this.slidingWindowSize * 60 * 1000 * 2; // 2x window size

        if (sessionAge > maxAge) {
          expiredSessions.push(sessionId);
        }
      }

      // Remove expired sessions
      expiredSessions.forEach(sessionId => {
        this.activeSessions.delete(sessionId);
      });

      console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }

  // Private helper methods

  private addToContextHistory(userId: number, context: SessionContext): void {
    const history = this.contextHistory.get(userId) || [];
    history.push(context);
    
    // Keep only last 100 sessions
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    this.contextHistory.set(userId, history);
  }

  private async slideContextWindow(context: SessionContext): Promise<void> {
    const now = Date.now();
    const windowStart = now - (context.windowSize * 60 * 1000);
    
    // Remove memories outside the window
    context.activeMemories = context.activeMemories.filter(
      memory => memory.metadata.timestamp >= windowStart
    );
  }

  private async detectContextSwitch(context: SessionContext): Promise<boolean> {
    // TODO: Implement sophisticated context switch detection
    // For now, return false (no context switch)
    return false;
  }
}

// Export singleton instance
export const contextManager = new ContextManager();