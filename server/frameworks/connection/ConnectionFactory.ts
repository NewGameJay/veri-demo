import { Pool } from 'pg';
import { MongoClient, Db } from 'mongodb';
import { createClient, RedisClientType } from 'redis';
import { features } from '../../config/features';

export interface DatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isHealthy(): Promise<boolean>;
}

// PostgreSQL Connection
export class PostgresConnection implements DatabaseConnection {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async connect(): Promise<void> {
    const client = await this.pool.connect();
    client.release();
    console.log('PostgreSQL connected successfully');
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }

  async isHealthy(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      const result = await client.query('SELECT 1');
      client.release();
      return result.rows.length > 0;
    } catch (error) {
      return false;
    }
  }

  getPool(): Pool {
    return this.pool;
  }
}

// MongoDB Connection
export class MongoConnection implements DatabaseConnection {
  private client: MongoClient;
  private db: Db | null = null;

  constructor(private connectionString: string, private dbName: string) {
    this.client = new MongoClient(connectionString);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    console.log('MongoDB connected successfully');
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.client.db('admin').command({ ping: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('MongoDB not connected');
    }
    return this.db;
  }
}

// Redis Connection
export class RedisConnection implements DatabaseConnection {
  private client: RedisClientType;

  constructor(private url: string) {
    this.client = createClient({ url });
  }

  async connect(): Promise<void> {
    await this.client.connect();
    console.log('Redis connected successfully');
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  async isHealthy(): Promise<boolean> {
    try {
      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch (error) {
      return false;
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }
}

// Connection Factory
export class ConnectionFactory {
  private static postgres: PostgresConnection | null = null;
  private static mongo: MongoConnection | null = null;
  private static redis: RedisConnection | null = null;

  static async initializeConnections() {
    // Always initialize PostgreSQL (baseline)
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required');
    }
    this.postgres = new PostgresConnection(process.env.DATABASE_URL);
    await this.postgres.connect();

    // Initialize MongoDB if enabled
    if (features.useMongo) {
      if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL is required when USE_MONGO=true');
      }
      this.mongo = new MongoConnection(
        process.env.MONGO_URL,
        process.env.MONGO_DB_NAME || 'veri_signal'
      );
      await this.mongo.connect();
    }

    // Initialize Redis if enabled
    if (features.useRedis) {
      if (!process.env.REDIS_URL) {
        throw new Error('REDIS_URL is required when USE_REDIS=true');
      }
      this.redis = new RedisConnection(process.env.REDIS_URL);
      await this.redis.connect();
    }
  }

  static getPostgres(): PostgresConnection {
    if (!this.postgres) {
      throw new Error('PostgreSQL connection not initialized');
    }
    return this.postgres;
  }

  static getMongo(): MongoConnection {
    if (!this.mongo) {
      throw new Error('MongoDB connection not initialized');
    }
    return this.mongo;
  }

  static getRedis(): RedisConnection {
    if (!this.redis) {
      throw new Error('Redis connection not initialized');
    }
    return this.redis;
  }

  static async healthCheck(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};

    if (this.postgres) {
      health.postgres = await this.postgres.isHealthy();
    }

    if (this.mongo) {
      health.mongo = await this.mongo.isHealthy();
    }

    if (this.redis) {
      health.redis = await this.redis.isHealthy();
    }

    return health;
  }

  static async disconnectAll() {
    if (this.postgres) await this.postgres.disconnect();
    if (this.mongo) await this.mongo.disconnect();
    if (this.redis) await this.redis.disconnect();
  }
}