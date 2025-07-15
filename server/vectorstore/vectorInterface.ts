/**
 * Vector Store Interface - Abstract interface for multiple vector store providers
 * Supports Chroma, Pinecone, OpenAI embeddings and other vector databases
 */

export interface VectorDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embeddings: number[];
}

export interface VectorQuery {
  embeddings?: number[];
  text?: string;
  metadata?: Record<string, any>;
  limit?: number;
  threshold?: number;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  document: VectorDocument;
  metadata: Record<string, any>;
}

export interface VectorCollection {
  name: string;
  dimension: number;
  description?: string;
  metadata?: Record<string, any>;
}

export interface BatchOperation {
  operation: 'upsert' | 'delete' | 'update';
  documents?: VectorDocument[];
  ids?: string[];
}

export interface VectorStoreConfig {
  provider: 'chroma' | 'pinecone' | 'openai' | 'custom';
  url?: string;
  apiKey?: string;
  dimension?: number;
  metadata?: Record<string, any>;
}

export interface VectorStoreStats {
  totalCollections: number;
  totalDocuments: number;
  totalSize: number;
  lastUpdated: number;
}

export abstract class VectorStoreProvider {
  protected config: VectorStoreConfig;
  protected connected: boolean = false;

  constructor(config: VectorStoreConfig) {
    this.config = config;
  }

  /**
   * Initialize connection to vector store
   */
  abstract initialize(): Promise<void>;

  /**
   * Check if connection is healthy
   */
  abstract isHealthy(): Promise<boolean>;

  /**
   * Create a new collection
   */
  abstract createCollection(
    name: string,
    dimension: number,
    metadata?: Record<string, any>
  ): Promise<void>;

  /**
   * Delete a collection
   */
  abstract deleteCollection(name: string): Promise<void>;

  /**
   * List all collections
   */
  abstract listCollections(): Promise<VectorCollection[]>;

  /**
   * Get collection information
   */
  abstract getCollection(name: string): Promise<VectorCollection | null>;

  /**
   * Insert or update documents
   */
  abstract upsert(
    collection: string,
    documents: VectorDocument[]
  ): Promise<void>;

  /**
   * Delete documents by IDs
   */
  abstract delete(
    collection: string,
    ids: string[]
  ): Promise<void>;

  /**
   * Update documents
   */
  abstract update(
    collection: string,
    documents: Partial<VectorDocument>[]
  ): Promise<void>;

  /**
   * Search for similar vectors
   */
  abstract search(
    collection: string,
    query: VectorQuery
  ): Promise<VectorSearchResult[]>;

  /**
   * Execute batch operations
   */
  abstract batch(
    collection: string,
    operations: BatchOperation[]
  ): Promise<void>;

  /**
   * Get vector store statistics
   */
  abstract getStats(): Promise<VectorStoreStats>;

  /**
   * Close connection
   */
  abstract close(): Promise<void>;

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get configuration
   */
  getConfig(): VectorStoreConfig {
    return { ...this.config };
  }
}

/**
 * Vector Store Factory
 */
export class VectorStoreFactory {
  private static providers: Map<string, typeof VectorStoreProvider> = new Map();

  /**
   * Register a vector store provider
   */
  static registerProvider(name: string, provider: typeof VectorStoreProvider): void {
    this.providers.set(name, provider);
  }

  /**
   * Create a vector store instance
   */
  static create(config: VectorStoreConfig): VectorStoreProvider {
    const Provider = this.providers.get(config.provider);
    if (!Provider) {
      throw new Error(`Vector store provider '${config.provider}' not found`);
    }
    return new Provider(config);
  }

  /**
   * Get available providers
   */
  static getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

/**
 * Vector Store Manager - High-level interface for managing vector operations
 */
export class VectorStoreManager {
  private providers: Map<string, VectorStoreProvider> = new Map();
  private defaultProvider: string | null = null;

  /**
   * Add a vector store provider
   */
  async addProvider(name: string, config: VectorStoreConfig): Promise<void> {
    const provider = VectorStoreFactory.create(config);
    await provider.initialize();
    this.providers.set(name, provider);
    
    if (!this.defaultProvider) {
      this.defaultProvider = name;
    }
  }

  /**
   * Get a provider by name
   */
  getProvider(name?: string): VectorStoreProvider | null {
    const providerName = name || this.defaultProvider;
    return providerName ? this.providers.get(providerName) || null : null;
  }

  /**
   * Remove a provider
   */
  async removeProvider(name: string): Promise<void> {
    const provider = this.providers.get(name);
    if (provider) {
      await provider.close();
      this.providers.delete(name);
      
      if (this.defaultProvider === name) {
        this.defaultProvider = this.providers.keys().next().value || null;
      }
    }
  }

  /**
   * Set default provider
   */
  setDefaultProvider(name: string): void {
    if (this.providers.has(name)) {
      this.defaultProvider = name;
    } else {
      throw new Error(`Provider '${name}' not found`);
    }
  }

  /**
   * Get all provider names
   */
  getProviderNames(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check health of all providers
   */
  async checkHealth(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};
    
    for (const [name, provider] of this.providers) {
      try {
        health[name] = await provider.isHealthy();
      } catch (error) {
        health[name] = false;
      }
    }
    
    return health;
  }

  /**
   * Close all providers
   */
  async closeAll(): Promise<void> {
    const promises = Array.from(this.providers.values()).map(provider => provider.close());
    await Promise.all(promises);
    this.providers.clear();
    this.defaultProvider = null;
  }
}

// Export singleton instance
export const vectorStoreManager = new VectorStoreManager();