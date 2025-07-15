/**
 * Brightmatter AI - Core AI intelligence layer
 * Orchestrates signal processing, VeriScore calculation, and content optimization
 */

import { signalEngine, ContentSignals, SignalAnalysis } from './signalEngine';
import { veriScoreCalculator, VeriScoreBreakdown, CreatorProfile } from './veriScoreCalculator';
import { aiContentOptimizer, ContentOptimizationRequest, ContentOptimizationResult } from './aiContentOptimizer';

export interface BrightmatterAnalysisRequest {
  userId: number;
  content: {
    id: string;
    text: string;
    platform: string;
    type: 'post' | 'video' | 'image' | 'story' | 'reel';
    metrics?: {
      likes?: number;
      shares?: number;
      comments?: number;
      views?: number;
    };
  };
  userProfile: CreatorProfile;
  options?: {
    includeOptimization?: boolean;
    includeViralAnalysis?: boolean;
    customWeights?: any;
  };
}

export interface BrightmatterAnalysisResult {
  contentSignals: ContentSignals;
  signalAnalysis: SignalAnalysis;
  veriScoreBreakdown: VeriScoreBreakdown;
  contentOptimization?: ContentOptimizationResult;
  viralPotential?: {
    score: number;
    factors: any;
    suggestions: string[];
  };
  recommendations: string[];
  confidence: number;
}

export class BrightmatterAI {
  private enabled: boolean;
  private analysisCache: Map<string, BrightmatterAnalysisResult>;
  private cacheTimeout: number;

  constructor(options: {
    enabled?: boolean;
    cacheTimeout?: number;
  } = {}) {
    this.enabled = options.enabled !== false;
    this.analysisCache = new Map();
    this.cacheTimeout = options.cacheTimeout || 3600000; // 1 hour
    
    console.log('Brightmatter AI initialized:', this.enabled ? 'enabled' : 'disabled');
  }

  /**
   * Comprehensive content and creator analysis
   */
  async analyzeContent(request: BrightmatterAnalysisRequest): Promise<BrightmatterAnalysisResult> {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request);
      const cached = this.analysisCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // 1. Process content signals
      const contentSignals = await signalEngine.processContent({
        id: request.content.id,
        userId: request.userId,
        platform: request.content.platform,
        type: request.content.type,
        text: request.content.text,
        metrics: request.content.metrics
      });

      // 2. Analyze signals
      const signalAnalysis = await signalEngine.analyzeSignals(
        contentSignals.contentId,
        request.options?.customWeights
      );

      // 3. Calculate VeriScore
      const veriScoreBreakdown = await veriScoreCalculator.calculateVeriScore(
        request.userId,
        request.userProfile,
        [contentSignals],
        request.options?.customWeights
      );

      // 4. Optional: Content optimization
      let contentOptimization: ContentOptimizationResult | undefined;
      if (request.options?.includeOptimization) {
        contentOptimization = await aiContentOptimizer.optimizeContent({
          content: request.content,
          userId: request.userId,
          optimizationGoals: ['engagement', 'viral', 'quality']
        });
      }

      // 5. Optional: Viral potential analysis
      let viralPotential: any;
      if (request.options?.includeViralAnalysis) {
        viralPotential = await aiContentOptimizer.analyzeViralPotential(
          request.content.text,
          request.content.platform
        );
      }

      // 6. Generate unified recommendations
      const recommendations = this.generateUnifiedRecommendations(
        signalAnalysis,
        veriScoreBreakdown,
        contentOptimization,
        viralPotential
      );

      // 7. Calculate overall confidence
      const confidence = this.calculateOverallConfidence(
        signalAnalysis,
        veriScoreBreakdown,
        contentOptimization
      );

      const result: BrightmatterAnalysisResult = {
        contentSignals,
        signalAnalysis,
        veriScoreBreakdown,
        contentOptimization,
        viralPotential,
        recommendations,
        confidence
      };

      // Cache result
      this.analysisCache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error in Brightmatter analysis:', error);
      throw new Error('Failed to analyze content with Brightmatter AI');
    }
  }

  /**
   * Get trending insights for a platform
   */
  async getTrendingInsights(platform: string, category?: string): Promise<{
    topics: string[];
    hashtags: string[];
    timing: string[];
    opportunities: string[];
  }> {
    try {
      const trendAnalysis = await aiContentOptimizer.getTrendAnalysis(platform, category);
      
      return {
        topics: trendAnalysis.trendingTopics,
        hashtags: trendAnalysis.hashtags,
        timing: [], // Would be populated from timing analysis
        opportunities: trendAnalysis.competitorInsights.gaps
      };
    } catch (error) {
      console.error('Error getting trending insights:', error);
      return {
        topics: [],
        hashtags: [],
        timing: [],
        opportunities: []
      };
    }
  }

  /**
   * Generate personalized content ideas
   */
  async generateContentIdeas(
    userId: number,
    platform: string,
    contentType: string
  ): Promise<{
    ideas: string[];
    templates: string[];
    hashtags: string[];
    timing: string[];
  }> {
    try {
      return await aiContentOptimizer.generateContentSuggestions(
        userId,
        platform,
        contentType
      );
    } catch (error) {
      console.error('Error generating content ideas:', error);
      return {
        ideas: [],
        templates: [],
        hashtags: [],
        timing: []
      };
    }
  }

  /**
   * Batch analyze multiple content pieces
   */
  async batchAnalyze(requests: BrightmatterAnalysisRequest[]): Promise<BrightmatterAnalysisResult[]> {
    const results = await Promise.all(
      requests.map(request => this.analyzeContent(request))
    );
    
    return results;
  }

  /**
   * Get user performance insights
   */
  async getUserInsights(userId: number, timeRange: number = 30): Promise<{
    performance: {
      averageVeriScore: number;
      trend: 'rising' | 'falling' | 'stable';
      topPerformingContent: string[];
      improvementAreas: string[];
    };
    recommendations: string[];
    nextSteps: string[];
  }> {
    try {
      // TODO: Implement actual user insights aggregation
      // This would analyze user's historical data and provide personalized insights
      
      return {
        performance: {
          averageVeriScore: 72,
          trend: 'rising',
          topPerformingContent: [
            'Tutorial videos perform best',
            'Behind-the-scenes content gets high engagement',
            'Interactive polls boost community interaction'
          ],
          improvementAreas: [
            'Consistency in posting schedule',
            'More engaging call-to-actions',
            'Better hashtag strategy'
          ]
        },
        recommendations: [
          'Post tutorial content more frequently',
          'Schedule posts for optimal timing',
          'Engage more with your community'
        ],
        nextSteps: [
          'Create a content calendar',
          'Analyze your top 5 posts for patterns',
          'Experiment with different content formats'
        ]
      };
    } catch (error) {
      console.error('Error getting user insights:', error);
      throw new Error('Failed to get user insights');
    }
  }

  /**
   * Clear analysis cache
   */
  clearCache(): void {
    this.analysisCache.clear();
    console.log('Brightmatter AI cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    enabled: boolean;
  } {
    return {
      size: this.analysisCache.size,
      hitRate: 0, // Would track hits/misses
      enabled: this.enabled
    };
  }

  // Private helper methods

  private generateUnifiedRecommendations(
    signalAnalysis: SignalAnalysis,
    veriScoreBreakdown: VeriScoreBreakdown,
    contentOptimization?: ContentOptimizationResult,
    viralPotential?: any
  ): string[] {
    const recommendations: string[] = [];

    // Signal-based recommendations
    recommendations.push(...signalAnalysis.recommendations);

    // VeriScore-based recommendations
    if (veriScoreBreakdown.factors.engagement < 0.6) {
      recommendations.push('Focus on creating more engaging content');
    }
    
    if (veriScoreBreakdown.factors.consistency < 0.6) {
      recommendations.push('Maintain a consistent posting schedule');
    }

    // Content optimization recommendations
    if (contentOptimization) {
      recommendations.push(...contentOptimization.recommendations);
    }

    // Viral potential recommendations
    if (viralPotential && viralPotential.score < 60) {
      recommendations.push('Add trending elements to increase viral potential');
    }

    // Remove duplicates and limit to top 5
    const uniqueRecommendations = [...new Set(recommendations)];
    return uniqueRecommendations.slice(0, 5);
  }

  private calculateOverallConfidence(
    signalAnalysis: SignalAnalysis,
    veriScoreBreakdown: VeriScoreBreakdown,
    contentOptimization?: ContentOptimizationResult
  ): number {
    const confidenceScores = [signalAnalysis.confidence];
    
    if (contentOptimization) {
      confidenceScores.push(contentOptimization.confidence);
    }

    // Calculate average confidence
    const avgConfidence = confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length;
    
    return Math.min(avgConfidence, 1);
  }

  private generateCacheKey(request: BrightmatterAnalysisRequest): string {
    const key = `${request.userId}_${request.content.id}_${request.content.platform}`;
    return Buffer.from(key).toString('base64').substring(0, 32);
  }
}

// Export singleton instance
export const brightmatterAI = new BrightmatterAI();

// Export all sub-modules
export * from './signalEngine';
export * from './veriScoreCalculator';
export * from './aiContentOptimizer';