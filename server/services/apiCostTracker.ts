import { db } from '../db';
import { apiUsage } from '../../shared/schema';
import { and, eq, gte, sql } from 'drizzle-orm';

interface ApiUsageData {
  userId?: string;
  service: 'openai' | 'anthropic' | 'twitter' | 'chroma';
  endpoint: string;
  tokensUsed?: number;
  estimatedCost: number;
}

export class ApiCostTracker {
  private static instance: ApiCostTracker;
  private dailyBudgets = {
    openai: parseFloat(process.env.OPENAI_DAILY_LIMIT_USD || '20'),
    anthropic: parseFloat(process.env.ANTHROPIC_DAILY_LIMIT_USD || '20'),
    chroma: parseFloat(process.env.VECTOR_STORE_DAILY_LIMIT_USD || '5'),
  };

  static getInstance() {
    if (!this.instance) {
      this.instance = new ApiCostTracker();
    }
    return this.instance;
  }

  async trackUsage(usage: ApiUsageData) {
    // Only track if cost tracking is enabled
    if (!process.env.API_COST_TRACKING_ENABLED || process.env.API_COST_TRACKING_ENABLED !== 'true') {
      return;
    }
    
    // Store in database
    await db.insert(apiUsage).values({
      userId: usage.userId,
      service: usage.service,
      endpoint: usage.endpoint,
      tokensUsed: usage.tokensUsed,
      estimatedCost: usage.estimatedCost.toString(),
    });

    // Check budget limits
    const todaysCost = await this.getTodaysCost(usage.service);
    if (todaysCost >= this.dailyBudgets[usage.service]) {
      // Log alert but don't throw - let the service decide what to do
      console.error(`Daily budget exceeded for ${usage.service}: $${todaysCost}`);
    }
  }

  async getTodaysCost(service: string): Promise<number> {
    // Query today's usage and sum costs
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const result = await db.select({
      total: sql<number>`SUM(${apiUsage.estimatedCost})`
    })
    .from(apiUsage)
    .where(and(
      eq(apiUsage.service, service),
      gte(apiUsage.createdAt, startOfDay)
    ));
    
    return Number(result[0]?.total) || 0;
  }

  async getUserUsage(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return await db.select({
      service: apiUsage.service,
      totalCost: sql<number>`SUM(${apiUsage.estimatedCost})`,
      totalTokens: sql<number>`SUM(${apiUsage.tokensUsed})`,
      requestCount: sql<number>`COUNT(*)`
    })
    .from(apiUsage)
    .where(and(
      eq(apiUsage.userId, userId),
      gte(apiUsage.createdAt, startDate)
    ))
    .groupBy(apiUsage.service);
  }
}