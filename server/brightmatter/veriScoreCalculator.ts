/**
 * VeriScore Calculator - Dynamic scoring algorithm for creator reputation
 * Calculates real-time VeriScore based on multiple factors and historical trends
 */

import { signalEngine, ContentSignals } from './signalEngine';

export interface VeriScoreFactors {
  engagement: number;
  consistency: number;
  growth: number;
  quality: number;
  authenticity: number;
  community: number;
}

export interface VeriScoreWeights {
  engagement: number;
  consistency: number;
  growth: number;
  quality: number;
  authenticity: number;
  community: number;
}

export interface VeriScoreBreakdown {
  currentScore: number;
  previousScore: number;
  change: number;
  factors: VeriScoreFactors;
  percentile: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  trend: 'rising' | 'falling' | 'stable';
  nextMilestone: number;
}

export interface VeriScoreHistory {
  timestamp: number;
  score: number;
  factors: VeriScoreFactors;
  events: string[];
}

export interface CreatorProfile {
  userId: number;
  totalPosts: number;
  totalEngagement: number;
  followerCount: number;
  averageEngagement: number;
  streakDays: number;
  joinDate: number;
  platforms: string[];
  contentTypes: string[];
}

export class VeriScoreCalculator {
  private defaultWeights: VeriScoreWeights;
  private scoreHistory: Map<number, VeriScoreHistory[]>;
  private tierThresholds: { [key: string]: number };
  private decayRate: number;

  constructor(options: {
    defaultWeights?: VeriScoreWeights;
    decayRate?: number;
  } = {}) {
    this.defaultWeights = options.defaultWeights || {
      engagement: 0.25,
      consistency: 0.20,
      growth: 0.15,
      quality: 0.15,
      authenticity: 0.15,
      community: 0.10
    };
    
    this.decayRate = options.decayRate || 0.01; // 1% decay per day
    this.scoreHistory = new Map();
    
    this.tierThresholds = {
      'Bronze': 0,
      'Silver': 20,
      'Gold': 40,
      'Platinum': 70,
      'Diamond': 90
    };
  }

  /**
   * Calculate VeriScore for a creator
   */
  async calculateVeriScore(
    userId: number,
    profile: CreatorProfile,
    recentSignals: ContentSignals[],
    customWeights?: VeriScoreWeights
  ): Promise<VeriScoreBreakdown> {
    try {
      const weights = customWeights || this.defaultWeights;
      const now = Date.now();
      
      // Calculate individual factors
      const factors: VeriScoreFactors = {
        engagement: this.calculateEngagementFactor(profile, recentSignals),
        consistency: this.calculateConsistencyFactor(profile, recentSignals),
        growth: this.calculateGrowthFactor(profile, recentSignals),
        quality: this.calculateQualityFactor(profile, recentSignals),
        authenticity: this.calculateAuthenticityFactor(profile, recentSignals),
        community: this.calculateCommunityFactor(profile, recentSignals)
      };

      // Calculate weighted score
      const weightedScore = (
        factors.engagement * weights.engagement +
        factors.consistency * weights.consistency +
        factors.growth * weights.growth +
        factors.quality * weights.quality +
        factors.authenticity * weights.authenticity +
        factors.community * weights.community
      );

      // Apply temporal decay
      const decayedScore = this.applyTemporalDecay(weightedScore, profile.joinDate);
      
      // Scale to 0-100 range
      const currentScore = Math.min(Math.max(decayedScore * 100, 0), 100);

      // Get previous score for comparison
      const history = this.scoreHistory.get(userId) || [];
      const previousScore = history.length > 0 ? history[history.length - 1].score : 0;
      const change = currentScore - previousScore;

      // Calculate percentile and tier
      const percentile = await this.calculatePercentile(currentScore);
      const tier = this.calculateTier(currentScore);
      const trend = this.calculateTrend(history);
      const nextMilestone = this.getNextMilestone(currentScore);

      // Store in history
      this.addToHistory(userId, {
        timestamp: now,
        score: currentScore,
        factors,
        events: this.generateScoreEvents(factors, change)
      });

      return {
        currentScore,
        previousScore,
        change,
        factors,
        percentile,
        tier,
        trend,
        nextMilestone
      };
    } catch (error) {
      console.error('Error calculating VeriScore:', error);
      throw new Error('Failed to calculate VeriScore');
    }
  }

  /**
   * Get detailed score explanation
   */
  getScoreExplanation(breakdown: VeriScoreBreakdown): {
    summary: string;
    strengths: string[];
    improvements: string[];
    actionItems: string[];
  } {
    const { factors, tier, trend } = breakdown;
    
    const strengths: string[] = [];
    const improvements: string[] = [];
    const actionItems: string[] = [];

    // Analyze strengths
    if (factors.engagement > 0.7) strengths.push('High engagement rates');
    if (factors.consistency > 0.7) strengths.push('Consistent posting schedule');
    if (factors.growth > 0.7) strengths.push('Strong follower growth');
    if (factors.quality > 0.7) strengths.push('High-quality content');
    if (factors.authenticity > 0.7) strengths.push('Authentic brand voice');
    if (factors.community > 0.7) strengths.push('Active community engagement');

    // Analyze improvements
    if (factors.engagement < 0.5) improvements.push('Engagement could be higher');
    if (factors.consistency < 0.5) improvements.push('More consistent posting needed');
    if (factors.growth < 0.5) improvements.push('Focus on follower growth');
    if (factors.quality < 0.5) improvements.push('Content quality needs improvement');
    if (factors.authenticity < 0.5) improvements.push('Strengthen brand authenticity');
    if (factors.community < 0.5) improvements.push('Increase community interaction');

    // Generate action items
    if (factors.engagement < 0.6) {
      actionItems.push('Try asking questions in your posts to boost engagement');
    }
    if (factors.consistency < 0.6) {
      actionItems.push('Create a content calendar and stick to it');
    }
    if (factors.growth < 0.6) {
      actionItems.push('Use trending hashtags and collaborate with others');
    }

    const summary = `Your VeriScore is ${breakdown.currentScore.toFixed(1)}/100 (${tier} tier). ${
      trend === 'rising' ? 'Keep up the great work!' : 
      trend === 'falling' ? 'Focus on improvements to boost your score.' :
      'Your score is stable - try implementing some action items.'
    }`;

    return {
      summary,
      strengths,
      improvements,
      actionItems
    };
  }

  /**
   * Predict future score trajectory
   */
  predictScoreTrajectory(
    userId: number,
    timeframe: number = 30 // days
  ): {
    currentScore: number;
    predictedScore: number;
    confidence: number;
    trajectory: { day: number; score: number }[];
  } {
    const history = this.scoreHistory.get(userId) || [];
    if (history.length < 3) {
      return {
        currentScore: 0,
        predictedScore: 0,
        confidence: 0,
        trajectory: []
      };
    }

    const currentScore = history[history.length - 1].score;
    
    // Simple linear trend prediction
    const recentHistory = history.slice(-7); // Last 7 data points
    const trend = this.calculateLinearTrend(recentHistory);
    
    const predictedScore = Math.min(Math.max(currentScore + (trend * timeframe), 0), 100);
    const confidence = Math.min(recentHistory.length / 7, 1); // Confidence based on data points
    
    // Generate trajectory
    const trajectory = [];
    for (let day = 0; day <= timeframe; day++) {
      const score = Math.min(Math.max(currentScore + (trend * day), 0), 100);
      trajectory.push({ day, score });
    }

    return {
      currentScore,
      predictedScore,
      confidence,
      trajectory
    };
  }

  // Private calculation methods

  private calculateEngagementFactor(
    profile: CreatorProfile,
    signals: ContentSignals[]
  ): number {
    if (signals.length === 0) return 0.5;
    
    const avgEngagement = signals.reduce((sum, signal) => {
      const engagementSignal = signal.signals.find(s => s.type === 'engagement');
      return sum + (engagementSignal ? engagementSignal.value : 0);
    }, 0) / signals.length;

    return Math.min(avgEngagement * 1.2, 1); // Boost factor
  }

  private calculateConsistencyFactor(
    profile: CreatorProfile,
    signals: ContentSignals[]
  ): number {
    if (signals.length === 0) return 0.3;
    
    // Calculate posting consistency
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    const recentDays = 30;
    
    const postsPerDay = signals.length / recentDays;
    const consistencyScore = Math.min(postsPerDay / 1, 1); // Normalize to 1 post per day
    
    // Factor in streak
    const streakBonus = Math.min(profile.streakDays / 30, 0.3);
    
    return Math.min(consistencyScore + streakBonus, 1);
  }

  private calculateGrowthFactor(
    profile: CreatorProfile,
    signals: ContentSignals[]
  ): number {
    // Mock growth calculation
    const accountAge = (Date.now() - profile.joinDate) / (1000 * 60 * 60 * 24);
    const growthRate = profile.followerCount / Math.max(accountAge, 1);
    
    return Math.min(growthRate / 10, 1); // Normalize to 10 followers per day
  }

  private calculateQualityFactor(
    profile: CreatorProfile,
    signals: ContentSignals[]
  ): number {
    if (signals.length === 0) return 0.5;
    
    const avgQuality = signals.reduce((sum, signal) => {
      const qualitySignal = signal.signals.find(s => s.type === 'quality');
      return sum + (qualitySignal ? qualitySignal.value : 0);
    }, 0) / signals.length;

    return avgQuality;
  }

  private calculateAuthenticityFactor(
    profile: CreatorProfile,
    signals: ContentSignals[]
  ): number {
    // Mock authenticity calculation
    const platformDiversity = profile.platforms.length / 5; // Max 5 platforms
    const contentTypeBonus = profile.contentTypes.length / 4; // Max 4 content types
    
    return Math.min((platformDiversity + contentTypeBonus) / 2, 1);
  }

  private calculateCommunityFactor(
    profile: CreatorProfile,
    signals: ContentSignals[]
  ): number {
    // Mock community calculation based on engagement ratio
    const engagementRatio = profile.totalEngagement / Math.max(profile.followerCount, 1);
    return Math.min(engagementRatio * 10, 1); // Normalize
  }

  private applyTemporalDecay(score: number, joinDate: number): number {
    const daysSinceJoin = (Date.now() - joinDate) / (1000 * 60 * 60 * 24);
    const decay = Math.exp(-this.decayRate * daysSinceJoin);
    return score * (0.8 + 0.2 * decay); // Minimum 80% of original score
  }

  private async calculatePercentile(score: number): Promise<number> {
    // Mock percentile calculation
    if (score >= 90) return 95;
    if (score >= 70) return 80;
    if (score >= 50) return 60;
    if (score >= 30) return 40;
    return 20;
  }

  private calculateTier(score: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' {
    if (score >= 90) return 'Diamond';
    if (score >= 70) return 'Platinum';
    if (score >= 50) return 'Gold';
    if (score >= 30) return 'Silver';
    return 'Bronze';
  }

  private calculateTrend(history: VeriScoreHistory[]): 'rising' | 'falling' | 'stable' {
    if (history.length < 2) return 'stable';
    
    const recent = history.slice(-5);
    const first = recent[0].score;
    const last = recent[recent.length - 1].score;
    
    const change = last - first;
    if (change > 2) return 'rising';
    if (change < -2) return 'falling';
    return 'stable';
  }

  private getNextMilestone(currentScore: number): number {
    const milestones = [20, 40, 70, 90, 100];
    return milestones.find(m => m > currentScore) || 100;
  }

  private calculateLinearTrend(history: VeriScoreHistory[]): number {
    if (history.length < 2) return 0;
    
    const n = history.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += history[i].score;
      sumXY += i * history[i].score;
      sumX2 += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  private generateScoreEvents(factors: VeriScoreFactors, change: number): string[] {
    const events: string[] = [];
    
    if (change > 5) events.push('Significant score increase');
    if (change < -5) events.push('Score decreased');
    if (factors.engagement > 0.8) events.push('High engagement achieved');
    if (factors.consistency > 0.8) events.push('Consistent posting streak');
    
    return events;
  }

  private addToHistory(userId: number, entry: VeriScoreHistory): void {
    const history = this.scoreHistory.get(userId) || [];
    history.push(entry);
    
    // Keep only last 100 entries
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    this.scoreHistory.set(userId, history);
  }
}

// Export singleton instance
export const veriScoreCalculator = new VeriScoreCalculator();