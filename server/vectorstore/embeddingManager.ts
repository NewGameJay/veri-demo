/**
 * Embedding Manager - Orchestrates embedding operations
 * Handles text preprocessing, chunking, caching, and fallback to mock embeddings
 */

import { OpenAIEmbeddingProvider, TextPreprocessor } from './providers/openai';
import { EmbeddingProvider } from '../intelligence/semanticIndex';

export interface EmbeddingCacheEntry {
  text: string;
  embedding: number[];
  timestamp: number;
  provider: string;
  model: string;
}

export interface EmbeddingRequest {
  text: string;
  metadata?: Record<string, any>;
  useCache?: boolean;
  chunkSize?: number;
}

export interface EmbeddingResponse {
  text: string;
  embedding: number[];
  chunks?: EmbeddingChunk[];
  metadata?: Record<string, any>;
  cached: boolean;
  provider: string;
  processingTime: number;
}

export interface EmbeddingChunk {
  text: string;
  embedding: number[];
  index: number;
  metadata?: Record<string, any>;
}

export interface EmbeddingStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  totalTokens: number;
  estimatedCost: number;
  averageProcessingTime: number;
}

export class EmbeddingManager {
  private providers: Map<string, EmbeddingProvider>;
  private defaultProvider: string;
  private cache: Map<string, EmbeddingCacheEntry>;
  private cacheEnabled: boolean;
  private maxCacheSize: number;
  private stats: EmbeddingStats;

  constructor(options: {
    cacheEnabled?: boolean;
    maxCacheSize?: number;
  } = {}) {
    this.providers = new Map();
    this.defaultProvider = 'openai';
    this.cache = new Map();
    this.cacheEnabled = options.cacheEnabled !== false;
    this.maxCacheSize = options.maxCacheSize || 10000;
    
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalTokens: 0,
      estimatedCost: 0,
      averageProcessingTime: 0,
    };

    // Initialize default providers
    this.initializeProviders();
  }

  /**
   * Initialize embedding providers
   */
  private initializeProviders(): void {
    // OpenAI provider
    const openaiProvider = new OpenAIEmbeddingProvider();
    this.providers.set('openai', openaiProvider);
    
    // TODO: Add other providers (Anthropic, HuggingFace, etc.)
    
    console.log('Embedding manager initialized with providers:', Array.from(this.providers.keys()));
  }

  /**
   * Generate embedding for text
   */
  async generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const startTime = Date.now();
    this.stats.totalRequests++;

    try {
      // Clean and preprocess text
      const cleanedText = TextPreprocessor.cleanText(request.text);
      const cacheKey = this.generateCacheKey(cleanedText);

      // Check cache first
      if (this.cacheEnabled && request.useCache !== false) {
        const cached = this.cache.get(cacheKey);
        if (cached) {
          this.stats.cacheHits++;
          return {
            text: cleanedText,
            embedding: cached.embedding,
            metadata: request.metadata,
            cached: true,
            provider: cached.provider,
            processingTime: Date.now() - startTime,
          };
        }
      }

      // Get provider
      const provider = this.providers.get(this.defaultProvider);
      if (!provider) {
        throw new Error(`Provider ${this.defaultProvider} not found`);
      }

      // Check if text needs chunking
      const tokenCount = provider.estimateTokens(cleanedText);
      let embedding: number[];
      let chunks: EmbeddingChunk[] | undefined;

      if (request.chunkSize && cleanedText.length > request.chunkSize) {
        // Generate embeddings for chunks
        const textChunks = TextPreprocessor.chunkText(cleanedText, request.chunkSize);
        const chunkEmbeddings = await provider.generateBatchEmbeddings(textChunks);
        
        chunks = textChunks.map((chunk, index) => ({
          text: chunk,
          embedding: chunkEmbeddings[index],
          index,
          metadata: { ...request.metadata, chunkIndex: index }
        }));

        // Average embeddings for main result
        embedding = this.averageEmbeddings(chunkEmbeddings);
      } else {
        // Generate single embedding
        embedding = await provider.generateEmbedding(cleanedText);
      }

      // Update stats
      this.stats.cacheMisses++;
      this.stats.totalTokens += tokenCount;
      this.stats.estimatedCost += provider.estimateCost(tokenCount);

      // Cache result
      if (this.cacheEnabled) {
        this.cacheEmbedding(cacheKey, {
          text: cleanedText,
          embedding,
          timestamp: Date.now(),
          provider: provider.name,
          model: provider.name // Provider should expose model info
        });
      }

      const processingTime = Date.now() - startTime;
      this.updateAverageProcessingTime(processingTime);

      return {
        text: cleanedText,
        embedding,
        chunks,
        metadata: request.metadata,
        cached: false,
        provider: provider.name,
        processingTime,
      };

    } catch (error) {
      console.error('Error generating embedding:', error);
      
      // Fallback to mock embedding
      const mockEmbedding = this.generateMockEmbedding(request.text);
      return {
        text: request.text,
        embedding: mockEmbedding,
        metadata: request.metadata,
        cached: false,
        provider: 'mock',
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Generate batch embeddings
   */
  async generateBatchEmbeddings(requests: EmbeddingRequest[]): Promise<EmbeddingResponse[]> {
    // Check for cached results first
    const cachedResults: EmbeddingResponse[] = [];
    const uncachedRequests: EmbeddingRequest[] = [];

    if (this.cacheEnabled) {
      for (const request of requests) {
        const cleanedText = TextPreprocessor.cleanText(request.text);
        const cacheKey = this.generateCacheKey(cleanedText);
        const cached = this.cache.get(cacheKey);
        
        if (cached && request.useCache !== false) {
          cachedResults.push({
            text: cleanedText,
            embedding: cached.embedding,
            metadata: request.metadata,
            cached: true,
            provider: cached.provider,
            processingTime: 0,
          });
        } else {
          uncachedRequests.push(request);
        }
      }
    } else {
      uncachedRequests.push(...requests);
    }

    // Generate embeddings for uncached requests
    const provider = this.providers.get(this.defaultProvider);
    if (!provider) {
      throw new Error(`Provider ${this.defaultProvider} not found`);
    }

    const uncachedResults: EmbeddingResponse[] = [];
    
    if (uncachedRequests.length > 0) {
      const startTime = Date.now();
      const texts = uncachedRequests.map(req => TextPreprocessor.cleanText(req.text));
      
      try {
        const embeddings = await provider.generateBatchEmbeddings(texts);
        
        for (let i = 0; i < uncachedRequests.length; i++) {
          const request = uncachedRequests[i];
          const text = texts[i];
          const embedding = embeddings[i];
          
          // Cache result
          if (this.cacheEnabled) {
            const cacheKey = this.generateCacheKey(text);
            this.cacheEmbedding(cacheKey, {
              text,
              embedding,
              timestamp: Date.now(),
              provider: provider.name,
              model: provider.name
            });
          }
          
          uncachedResults.push({
            text,
            embedding,
            metadata: request.metadata,
            cached: false,
            provider: provider.name,
            processingTime: Date.now() - startTime,
          });
        }
      } catch (error) {
        console.error('Error generating batch embeddings:', error);
        
        // Fallback to mock embeddings
        for (let i = 0; i < uncachedRequests.length; i++) {
          const request = uncachedRequests[i];
          uncachedResults.push({
            text: request.text,
            embedding: this.generateMockEmbedding(request.text),
            metadata: request.metadata,
            cached: false,
            provider: 'mock',
            processingTime: 0,
          });
        }
      }
    }

    // Combine cached and uncached results
    return [...cachedResults, ...uncachedResults];
  }

  /**
   * Search for similar embeddings
   */
  async searchSimilar(
    queryEmbedding: number[],
    candidates: EmbeddingResponse[],
    options: {
      limit?: number;
      threshold?: number;
    } = {}
  ): Promise<{ result: EmbeddingResponse; similarity: number }[]> {
    const { limit = 10, threshold = 0.5 } = options;
    
    const similarities = candidates.map(candidate => ({
      result: candidate,
      similarity: this.calculateCosineSimilarity(queryEmbedding, candidate.embedding)
    }));

    return similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Get embedding statistics
   */
  getStats(): EmbeddingStats {
    return { ...this.stats };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Embedding cache cleared');
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  // Private helper methods

  private generateCacheKey(text: string): string {
    // Simple hash function for cache key
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private cacheEmbedding(key: string, entry: EmbeddingCacheEntry): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, entry);
  }

  private averageEmbeddings(embeddings: number[][]): number[] {
    if (embeddings.length === 0) return [];
    
    const dimension = embeddings[0].length;
    const averaged = new Array(dimension).fill(0);
    
    for (const embedding of embeddings) {
      for (let i = 0; i < dimension; i++) {
        averaged[i] += embedding[i];
      }
    }
    
    return averaged.map(val => val / embeddings.length);
  }

  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimension');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private generateMockEmbedding(text: string): number[] {
    // Generate deterministic mock embedding
    const dimension = 1536; // OpenAI dimension
    const embedding = new Array(dimension);
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
    }
    
    for (let i = 0; i < dimension; i++) {
      const seed = hash + i;
      embedding[i] = (Math.sin(seed) * 0.5) + Math.cos(seed * 0.7) * 0.3;
    }
    
    // Normalize
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / norm);
  }

  private updateAverageProcessingTime(processingTime: number): void {
    const total = this.stats.averageProcessingTime * (this.stats.totalRequests - 1);
    this.stats.averageProcessingTime = (total + processingTime) / this.stats.totalRequests;
  }
}

// Export singleton instance
export const embeddingManager = new EmbeddingManager();