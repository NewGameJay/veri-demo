/**
 * Signal Engine - Core signal processing for creator content analysis
 * Processes engagement, viral potential, safety, and quality signals
 */

export interface Signal {
  id: string;
  type: 'engagement' | 'viral' | 'safety' | 'quality';
  value: number; // 0-1 scale
  confidence: number; // 0-1 scale
  timestamp: number;
  source: string;
  metadata: Record<string, any>;
}

export interface ContentSignals {
  contentId: string;
  userId: number;
  platform: string;
  contentType: 'post' | 'video' | 'image' | 'story' | 'reel';
  signals: Signal[];
  aggregatedScore: number;
  timestamp: number;
}

export interface SignalWeights {
  engagement: number;
  viral: number;
  safety: number;
  quality: number;
}

export interface SignalAnalysis {
  overall: number;
  breakdown: {
    engagement: number;
    viral: number;
    safety: number;
    quality: number;
  };
  trend: 'rising' | 'falling' | 'stable';
  confidence: number;
  recommendations: string[];
}

export class SignalEngine {
  private defaultWeights: SignalWeights;
  private temporalDecayRate: number;
  private minConfidenceThreshold: number;
  private signalHistory: Map<string, ContentSignals[]>;

  constructor(options: {
    defaultWeights?: SignalWeights;
    temporalDecayRate?: number;
    minConfidenceThreshold?: number;
  } = {}) {
    this.defaultWeights = options.defaultWeights || {
      engagement: 0.3,
      viral: 0.25,
      safety: 0.25,
      quality: 0.2
    };
    this.temporalDecayRate = options.temporalDecayRate || 0.1;
    this.minConfidenceThreshold = options.minConfidenceThreshold || 0.3;
    this.signalHistory = new Map();
  }

  /**
   * Process raw content data into signals
   */
  async processContent(content: {
    id: string;
    userId: number;
    platform: string;
    type: 'post' | 'video' | 'image' | 'story' | 'reel';
    text?: string;
    metrics?: {
      likes?: number;
      shares?: number;
      comments?: number;
      views?: number;
      saves?: number;
    };
    metadata?: Record<string, any>;
  }): Promise<ContentSignals> {
    try {
      const signals: Signal[] = [];
      const now = Date.now();

      // Generate engagement signals
      const engagementSignal = await this.generateEngagementSignal(content);
      if (engagementSignal) signals.push(engagementSignal);

      // Generate viral signals
      const viralSignal = await this.generateViralSignal(content);
      if (viralSignal) signals.push(viralSignal);

      // Generate safety signals
      const safetySignal = await this.generateSafetySignal(content);
      if (safetySignal) signals.push(safetySignal);

      // Generate quality signals
      const qualitySignal = await this.generateQualitySignal(content);
      if (qualitySignal) signals.push(qualitySignal);

      // Calculate aggregated score
      const aggregatedScore = this.calculateAggregatedScore(signals);

      const contentSignals: ContentSignals = {
        contentId: content.id,
        userId: content.userId,
        platform: content.platform,
        contentType: content.type,
        signals,
        aggregatedScore,
        timestamp: now
      };

      // Store in history
      this.addToHistory(content.id, contentSignals);

      return contentSignals;
    } catch (error) {
      console.error('Error processing content signals:', error);
      throw new Error('Failed to process content signals');
    }
  }

  /**
   * Analyze signals and provide insights
   */
  async analyzeSignals(
    contentId: string,
    customWeights?: SignalWeights
  ): Promise<SignalAnalysis> {
    try {
      const history = this.signalHistory.get(contentId) || [];
      if (history.length === 0) {
        throw new Error('No signal history found for content');
      }

      const weights = customWeights || this.defaultWeights;
      const latest = history[history.length - 1];

      // Calculate breakdown scores
      const breakdown = {
        engagement: this.getSignalValue(latest.signals, 'engagement'),
        viral: this.getSignalValue(latest.signals, 'viral'),
        safety: this.getSignalValue(latest.signals, 'safety'),
        quality: this.getSignalValue(latest.signals, 'quality')
      };

      // Calculate overall score with weights
      const overall = (
        breakdown.engagement * weights.engagement +
        breakdown.viral * weights.viral +
        breakdown.safety * weights.safety +
        breakdown.quality * weights.quality
      );

      // Determine trend
      const trend = this.calculateTrend(history);

      // Calculate confidence
      const confidence = this.calculateConfidence(latest.signals);

      // Generate recommendations
      const recommendations = this.generateRecommendations(breakdown, trend);

      return {
        overall,
        breakdown,
        trend,
        confidence,
        recommendations
      };
    } catch (error) {
      console.error('Error analyzing signals:', error);
      throw new Error('Failed to analyze signals');
    }
  }

  /**
   * Get signal trends over time
   */
  getSignalTrends(contentId: string, timeRange: number = 86400000): {
    timestamps: number[];
    engagement: number[];
    viral: number[];
    safety: number[];
    quality: number[];
  } {
    const history = this.signalHistory.get(contentId) || [];
    const now = Date.now();
    const cutoff = now - timeRange;

    const filtered = history.filter(h => h.timestamp >= cutoff);

    return {
      timestamps: filtered.map(h => h.timestamp),
      engagement: filtered.map(h => this.getSignalValue(h.signals, 'engagement')),
      viral: filtered.map(h => this.getSignalValue(h.signals, 'viral')),
      safety: filtered.map(h => this.getSignalValue(h.signals, 'safety')),
      quality: filtered.map(h => this.getSignalValue(h.signals, 'quality'))
    };
  }

  // Private helper methods

  private async generateEngagementSignal(content: any): Promise<Signal | null> {
    try {
      const metrics = content.metrics || {};
      const { likes = 0, shares = 0, comments = 0, views = 1 } = metrics;

      // Calculate engagement rate
      const engagementRate = (likes + shares + comments) / Math.max(views, 1);
      
      // Normalize to 0-1 scale (assuming 0.1 is excellent engagement)
      const normalizedValue = Math.min(engagementRate / 0.1, 1);

      // Mock confidence calculation
      const confidence = Math.min(0.5 + (views / 10000), 1);

      return {
        id: `eng_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'engagement',
        value: normalizedValue,
        confidence,
        timestamp: Date.now(),
        source: 'metrics_analysis',
        metadata: {
          engagementRate,
          totalEngagements: likes + shares + comments,
          views,
          platform: content.platform
        }
      };
    } catch (error) {
      console.error('Error generating engagement signal:', error);
      return null;
    }
  }

  private async generateViralSignal(content: any): Promise<Signal | null> {
    try {
      const metrics = content.metrics || {};
      const { shares = 0, views = 1 } = metrics;

      // Calculate viral coefficient (share rate)
      const shareRate = shares / Math.max(views, 1);
      
      // Normalize to 0-1 scale
      const normalizedValue = Math.min(shareRate / 0.05, 1); // 5% share rate is very viral

      // Mock confidence based on sample size
      const confidence = Math.min(0.3 + (views / 5000), 1);

      return {
        id: `vir_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'viral',
        value: normalizedValue,
        confidence,
        timestamp: Date.now(),
        source: 'viral_analysis',
        metadata: {
          shareRate,
          shares,
          views,
          platform: content.platform
        }
      };
    } catch (error) {
      console.error('Error generating viral signal:', error);
      return null;
    }
  }

  private async generateSafetySignal(content: any): Promise<Signal | null> {
    try {
      // TODO: Implement actual content moderation
      // For now, return mock safety signal
      const text = content.text || '';
      
      // Simple keyword-based safety check (mock implementation)
      const unsafeKeywords = ['spam', 'scam', 'fake', 'hate'];
      const hasUnsafeContent = unsafeKeywords.some(keyword => 
        text.toLowerCase().includes(keyword)
      );

      const safetyScore = hasUnsafeContent ? 0.2 : 0.9;
      const confidence = text.length > 0 ? 0.7 : 0.3;

      return {
        id: `saf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'safety',
        value: safetyScore,
        confidence,
        timestamp: Date.now(),
        source: 'safety_analysis',
        metadata: {
          textLength: text.length,
          hasUnsafeContent,
          platform: content.platform
        }
      };
    } catch (error) {
      console.error('Error generating safety signal:', error);
      return null;
    }
  }

  private async generateQualitySignal(content: any): Promise<Signal | null> {
    try {
      const text = content.text || '';
      const metrics = content.metrics || {};

      // Simple quality factors (mock implementation)
      const hasText = text.length > 10;
      const hasGoodEngagement = (metrics.likes || 0) > 0;
      const hasDescription = text.length > 50;

      let qualityScore = 0.5; // Base score
      
      if (hasText) qualityScore += 0.2;
      if (hasGoodEngagement) qualityScore += 0.2;
      if (hasDescription) qualityScore += 0.1;

      const confidence = 0.6;

      return {
        id: `qua_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'quality',
        value: Math.min(qualityScore, 1),
        confidence,
        timestamp: Date.now(),
        source: 'quality_analysis',
        metadata: {
          textLength: text.length,
          hasText,
          hasGoodEngagement,
          hasDescription,
          platform: content.platform
        }
      };
    } catch (error) {
      console.error('Error generating quality signal:', error);
      return null;
    }
  }

  private calculateAggregatedScore(signals: Signal[]): number {
    if (signals.length === 0) return 0;

    const weightedSum = signals.reduce((sum, signal) => {
      const weight = this.defaultWeights[signal.type] || 0.25;
      return sum + (signal.value * signal.confidence * weight);
    }, 0);

    const totalWeight = signals.reduce((sum, signal) => {
      const weight = this.defaultWeights[signal.type] || 0.25;
      return sum + (signal.confidence * weight);
    }, 0);

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private getSignalValue(signals: Signal[], type: string): number {
    const signal = signals.find(s => s.type === type);
    return signal ? signal.value : 0;
  }

  private calculateTrend(history: ContentSignals[]): 'rising' | 'falling' | 'stable' {
    if (history.length < 2) return 'stable';

    const recent = history.slice(-5); // Last 5 data points
    const scores = recent.map(h => h.aggregatedScore);
    
    // Simple trend calculation
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    
    if (diff > 0.05) return 'rising';
    if (diff < -0.05) return 'falling';
    return 'stable';
  }

  private calculateConfidence(signals: Signal[]): number {
    if (signals.length === 0) return 0;
    
    const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
    return avgConfidence;
  }

  private generateRecommendations(
    breakdown: { engagement: number; viral: number; safety: number; quality: number },
    trend: 'rising' | 'falling' | 'stable'
  ): string[] {
    const recommendations: string[] = [];

    if (breakdown.engagement < 0.3) {
      recommendations.push('Increase engagement by asking questions or adding call-to-actions');
    }
    
    if (breakdown.viral < 0.2) {
      recommendations.push('Add shareable elements like quotes, tips, or relatable content');
    }
    
    if (breakdown.safety < 0.8) {
      recommendations.push('Review content for potential safety concerns');
    }
    
    if (breakdown.quality < 0.5) {
      recommendations.push('Improve content quality with better descriptions or visuals');
    }

    if (trend === 'falling') {
      recommendations.push('Consider refreshing your content strategy');
    } else if (trend === 'rising') {
      recommendations.push('Keep up the great work! Your content is performing well');
    }

    return recommendations;
  }

  private addToHistory(contentId: string, signals: ContentSignals): void {
    const history = this.signalHistory.get(contentId) || [];
    history.push(signals);
    
    // Keep only last 100 entries
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    this.signalHistory.set(contentId, history);
  }
}

// Export singleton instance
export const signalEngine = new SignalEngine();