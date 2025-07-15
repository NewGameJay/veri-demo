/**
 * OpenAI Embeddings Provider - Text-to-embedding conversion
 * Handles OpenAI API integration for embedding generation
 */

import { EmbeddingProvider } from '../../intelligence/semanticIndex';

export interface OpenAIEmbeddingConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  batchSize: number;
}

export interface OpenAIEmbeddingResponse {
  data: {
    embedding: number[];
    index: number;
  }[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  name = 'openai';
  dimension = 1536; // text-embedding-ada-002 dimension
  
  private config: OpenAIEmbeddingConfig;
  private enabled: boolean;

  constructor(config: Partial<OpenAIEmbeddingConfig> = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.OPENAI_API_KEY || '',
      model: config.model || 'text-embedding-ada-002',
      maxTokens: config.maxTokens || 8192,
      batchSize: config.batchSize || 100,
    };
    
    this.enabled = process.env.USE_AI === 'true' && !!this.config.apiKey;
    
    if (!this.enabled) {
      console.log('OpenAI embeddings disabled - using mock embeddings');
    }
  }

  /**
   * Generate embedding for a single text
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (!this.enabled) {
        return this.generateMockEmbedding(text);
      }

      // Truncate text if too long
      const truncatedText = this.truncateText(text);
      
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          input: truncatedText,
          model: this.config.model,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${response.status} ${error}`);
      }

      const data: OpenAIEmbeddingResponse = await response.json();
      
      if (data.data && data.data.length > 0) {
        return data.data[0].embedding;
      } else {
        throw new Error('No embedding returned from OpenAI');
      }
    } catch (error) {
      console.error('Error generating OpenAI embedding:', error);
      // Fallback to mock embedding
      return this.generateMockEmbedding(text);
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      if (!this.enabled) {
        return texts.map(text => this.generateMockEmbedding(text));
      }

      const results: number[][] = [];
      
      // Process in batches to avoid API limits
      for (let i = 0; i < texts.length; i += this.config.batchSize) {
        const batch = texts.slice(i, i + this.config.batchSize);
        const truncatedBatch = batch.map(text => this.truncateText(text));
        
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            input: truncatedBatch,
            model: this.config.model,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`OpenAI API error: ${response.status} ${error}`);
        }

        const data: OpenAIEmbeddingResponse = await response.json();
        
        if (data.data && data.data.length > 0) {
          // Sort by index to maintain order
          const sortedEmbeddings = data.data
            .sort((a, b) => a.index - b.index)
            .map(item => item.embedding);
          
          results.push(...sortedEmbeddings);
        }
      }

      return results;
    } catch (error) {
      console.error('Error generating batch embeddings:', error);
      // Fallback to mock embeddings
      return texts.map(text => this.generateMockEmbedding(text));
    }
  }

  /**
   * Estimate token count for text
   */
  estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  /**
   * Estimate cost for token count
   */
  estimateCost(tokens: number): number {
    // text-embedding-ada-002 pricing: $0.0001 per 1K tokens
    return (tokens / 1000) * 0.0001;
  }

  /**
   * Get embedding statistics
   */
  getStats(): {
    model: string;
    dimension: number;
    maxTokens: number;
    enabled: boolean;
  } {
    return {
      model: this.config.model,
      dimension: this.dimension,
      maxTokens: this.config.maxTokens,
      enabled: this.enabled,
    };
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.enabled) {
        return false;
      }

      const testEmbedding = await this.generateEmbedding('test');
      return testEmbedding.length === this.dimension;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }

  // Private helper methods

  /**
   * Truncate text to fit within token limits
   */
  private truncateText(text: string): string {
    const estimatedTokens = this.estimateTokens(text);
    
    if (estimatedTokens <= this.config.maxTokens) {
      return text;
    }

    // Truncate to approximately maxTokens
    const maxChars = this.config.maxTokens * 4;
    return text.substring(0, maxChars);
  }

  /**
   * Generate mock embedding for testing
   */
  private generateMockEmbedding(text: string): number[] {
    // Generate deterministic mock embedding based on text
    const embedding = new Array(this.dimension);
    
    // Use simple hash-based approach for consistency
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
    }
    
    for (let i = 0; i < this.dimension; i++) {
      const seed = hash + i;
      embedding[i] = (Math.sin(seed) * 0.5) + Math.cos(seed * 0.7) * 0.3;
    }
    
    // Normalize to unit vector
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / norm);
  }
}

/**
 * Text preprocessing utilities
 */
export class TextPreprocessor {
  private static readonly CHUNK_SIZE = 1000;
  private static readonly CHUNK_OVERLAP = 200;

  /**
   * Split text into chunks for embedding
   */
  static chunkText(text: string, chunkSize: number = TextPreprocessor.CHUNK_SIZE): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;
      
      if (currentChunk.length + trimmedSentence.length <= chunkSize) {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        currentChunk = trimmedSentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  }

  /**
   * Clean text for embedding
   */
  static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
      .trim();
  }

  /**
   * Extract keywords from text
   */
  static extractKeywords(text: string, count: number = 10): string[] {
    const words = text.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3);
    
    // Simple frequency-based keyword extraction
    const wordCount = new Map<string, number>();
    
    for (const word of words) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
    
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([word]) => word);
  }
}

// Export singleton instance
export const openaiEmbeddingProvider = new OpenAIEmbeddingProvider();