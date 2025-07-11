import { RedisClientType } from 'redis';
import { ConnectionFactory } from '../connection/ConnectionFactory';
import { features } from '../../config/features';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

export class CacheManager {
  private redis: RedisClientType | null = null;
  private memoryCache: Map<string, { value: any; expiresAt: number }> = new Map();

  constructor(private defaultTTL: number = 3600) {} // 1 hour default

  private getClient(): RedisClientType | null {
    if (!features.useRedis) return null;
    
    if (!this.redis) {
      const connection = ConnectionFactory.getRedis();
      this.redis = connection.getClient();
    }
    return this.redis;
  }

  private getKey(key: string, prefix?: string): string {
    return prefix ? `${prefix}:${key}` : key;
  }

  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    const fullKey = this.getKey(key, options?.prefix);
    const client = this.getClient();

    if (client) {
      try {
        const value = await client.get(fullKey);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error(`Cache get error for ${fullKey}:`, error);
        return null;
      }
    } else {
      // Fallback to memory cache
      const cached = this.memoryCache.get(fullKey);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.value;
      }
      this.memoryCache.delete(fullKey);
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const fullKey = this.getKey(key, options?.prefix);
    const ttl = options?.ttl || this.defaultTTL;
    const client = this.getClient();

    if (client) {
      try {
        await client.setEx(fullKey, ttl, JSON.stringify(value));
      } catch (error) {
        console.error(`Cache set error for ${fullKey}:`, error);
      }
    } else {
      // Fallback to memory cache
      this.memoryCache.set(fullKey, {
        value,
        expiresAt: Date.now() + (ttl * 1000)
      });
    }
  }

  async delete(key: string, options?: CacheOptions): Promise<void> {
    const fullKey = this.getKey(key, options?.prefix);
    const client = this.getClient();

    if (client) {
      try {
        await client.del(fullKey);
      } catch (error) {
        console.error(`Cache delete error for ${fullKey}:`, error);
      }
    } else {
      this.memoryCache.delete(fullKey);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const client = this.getClient();

    if (client) {
      try {
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
          await client.del(keys);
        }
      } catch (error) {
        console.error(`Cache invalidate pattern error for ${pattern}:`, error);
      }
    } else {
      // For memory cache, iterate and delete matching keys
      for (const key of this.memoryCache.keys()) {
        if (key.includes(pattern.replace('*', ''))) {
          this.memoryCache.delete(key);
        }
      }
    }
  }

  // Batch operations
  async mget<T>(keys: string[], options?: CacheOptions): Promise<(T | null)[]> {
    const client = this.getClient();
    const fullKeys = keys.map(key => this.getKey(key, options?.prefix));

    if (client) {
      try {
        const values = await client.mGet(fullKeys);
        return values.map(value => value ? JSON.parse(value) : null);
      } catch (error) {
        console.error('Cache mget error:', error);
        return keys.map(() => null);
      }
    } else {
      // Fallback to memory cache
      return fullKeys.map(key => {
        const cached = this.memoryCache.get(key);
        if (cached && cached.expiresAt > Date.now()) {
          return cached.value;
        }
        return null;
      });
    }
  }

  async mset<T>(items: Array<{ key: string; value: T }>, options?: CacheOptions): Promise<void> {
    const client = this.getClient();
    const ttl = options?.ttl || this.defaultTTL;

    if (client) {
      try {
        const pipeline = client.multi();
        items.forEach(({ key, value }) => {
          const fullKey = this.getKey(key, options?.prefix);
          pipeline.setEx(fullKey, ttl, JSON.stringify(value));
        });
        await pipeline.exec();
      } catch (error) {
        console.error('Cache mset error:', error);
      }
    } else {
      // Fallback to memory cache
      items.forEach(({ key, value }) => {
        const fullKey = this.getKey(key, options?.prefix);
        this.memoryCache.set(fullKey, {
          value,
          expiresAt: Date.now() + (ttl * 1000)
        });
      });
    }
  }

  // Clear memory cache (for testing)
  clearMemoryCache(): void {
    this.memoryCache.clear();
  }
}

// Singleton instance
export const cacheManager = new CacheManager();