import { db } from '@/db';
import { 
  StorageInterface, 
  RawSocialEvent, 
  CreatorProfile, 
  Memory,
  ResonanceTag,
  BehavioralPatterns 
} from '../interfaces/StorageInterface';
import { users, socialConnections, leaderboard, tasks } from '@shared/schema';
import { eq, desc, and, gte } from 'drizzle-orm';

export class PostgresStorageAdapter implements StorageInterface {
  // Event operations
  async saveEvent(event: RawSocialEvent): Promise<void> {
    // In PostgreSQL, we'll store events in a JSONB column
    // For MVP, we can store in the social_connections table with extended data
    await db.insert(socialConnections).values({
      userId: parseInt(event.creatorId),
      platform: event.platform,
      username: `${event.platform}_user`,
      isConnected: true,
      lastSync: new Date(),
      metadata: {
        eventType: event.type,
        payload: event.payload,
        timestamp: event.timestamp
      } as any
    });
  }

  async fetchRecentEvents(creatorId: string, limit: number): Promise<RawSocialEvent[]> {
    const connections = await db
      .select()
      .from(socialConnections)
      .where(eq(socialConnections.userId, parseInt(creatorId)))
      .orderBy(desc(socialConnections.lastSync))
      .limit(limit);

    return connections.map(conn => ({
      creatorId,
      platform: conn.platform,
      type: (conn.metadata as any)?.eventType || 'unknown',
      payload: (conn.metadata as any)?.payload || {},
      timestamp: conn.lastSync || new Date()
    }));
  }

  // Creator operations
  async getCreator(creatorId: string): Promise<CreatorProfile | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(creatorId)));

    if (!user) return null;

    return {
      id: user.id.toString(),
      userId: user.id.toString(),
      username: user.username,
      email: user.email || undefined,
      veriScore: user.veriScore,
      xpPoints: user.xpPoints,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async updateCreatorProfile(creatorId: string, updates: Partial<CreatorProfile>): Promise<void> {
    const updateData: any = {};
    
    if (updates.veriScore !== undefined) updateData.veriScore = updates.veriScore;
    if (updates.xpPoints !== undefined) updateData.xpPoints = updates.xpPoints;
    if (updates.username !== undefined) updateData.username = updates.username;
    if (updates.email !== undefined) updateData.email = updates.email;
    
    await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(users.id, parseInt(creatorId)));
  }

  async getCreatorsByTag(tag: string, limit: number): Promise<CreatorProfile[]> {
    // For PostgreSQL MVP, we'll search by userType
    const results = await db
      .select()
      .from(users)
      .where(eq(users.userType, tag))
      .limit(limit);

    return results.map(user => ({
      id: user.id.toString(),
      userId: user.id.toString(),
      username: user.username,
      email: user.email || undefined,
      veriScore: user.veriScore,
      xpPoints: user.xpPoints,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  // Memory operations (simplified for PostgreSQL)
  async saveMemory(memory: Memory): Promise<void> {
    // For MVP, we'll store memories in tasks table with extended metadata
    await db.insert(tasks).values({
      userId: parseInt(memory.creatorId),
      title: `Memory: ${memory.type}`,
      description: JSON.stringify(memory.content),
      platform: 'system',
      xpReward: 0,
      status: 'active',
      metadata: {
        memoryId: memory.id,
        memoryType: memory.type,
        relevanceScore: memory.relevanceScore,
        expiresAt: memory.expiresAt
      } as any
    });
  }

  async getMemories(creatorId: string, type?: Memory['type'], limit = 10): Promise<Memory[]> {
    const query = db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, parseInt(creatorId)),
          eq(tasks.title, `Memory: ${type || ''}`)
        )
      )
      .orderBy(desc(tasks.createdAt))
      .limit(limit);

    const results = await query;

    return results.map(task => ({
      id: (task.metadata as any)?.memoryId || task.id.toString(),
      creatorId,
      type: (task.metadata as any)?.memoryType || 'entity',
      content: JSON.parse(task.description || '{}'),
      relevanceScore: (task.metadata as any)?.relevanceScore || 1,
      timestamp: task.createdAt,
      expiresAt: (task.metadata as any)?.expiresAt
    }));
  }

  async deleteExpiredMemories(): Promise<number> {
    // For MVP, we'll mark tasks as completed instead of deleting
    const result = await db
      .update(tasks)
      .set({ status: 'completed' })
      .where(
        and(
          eq(tasks.platform, 'system'),
          gte(tasks.createdAt, new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) // 90 days
        )
      );

    return 0; // Return affected count when available
  }

  // Batch operations
  async batchSaveEvents(events: RawSocialEvent[]): Promise<void> {
    const values = events.map(event => ({
      userId: parseInt(event.creatorId),
      platform: event.platform,
      username: `${event.platform}_user`,
      isConnected: true,
      lastSync: new Date(),
      metadata: {
        eventType: event.type,
        payload: event.payload,
        timestamp: event.timestamp
      } as any
    }));

    await db.insert(socialConnections).values(values);
  }

  async batchUpdateCreators(updates: Array<{ id: string; updates: Partial<CreatorProfile> }>): Promise<void> {
    // PostgreSQL doesn't have efficient batch updates in Drizzle, so we'll use transactions
    await db.transaction(async (tx) => {
      for (const update of updates) {
        const updateData: any = {};
        
        if (update.updates.veriScore !== undefined) updateData.veriScore = update.updates.veriScore;
        if (update.updates.xpPoints !== undefined) updateData.xpPoints = update.updates.xpPoints;
        
        await tx
          .update(users)
          .set({
            ...updateData,
            updatedAt: new Date()
          })
          .where(eq(users.id, parseInt(update.id)));
      }
    });
  }
}