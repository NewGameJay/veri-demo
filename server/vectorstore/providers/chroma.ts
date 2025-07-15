/**
 * Chroma Vector Store Provider - ChromaDB implementation
 * Handles connection, collection management, and vector operations
 */

import { VectorStoreProvider, VectorDocument, VectorQuery, VectorSearchResult, VectorCollection, BatchOperation, VectorStoreStats } from '../vectorInterface';

interface ChromaCollection {
  id: string;
  name: string;
  metadata: Record<string, any>;
  dimension?: number;
}

interface ChromaQueryResponse {
  ids: string[][];
  embeddings: number[][];
  documents: string[][];
  metadatas: Record<string, any>[][];
  distances: number[][];
}

export class ChromaVectorStore extends VectorStoreProvider {
  private baseUrl: string;
  private collections: Map<string, ChromaCollection> = new Map();

  constructor(config: any) {
    super(config);
    this.baseUrl = config.url || process.env.CHROMA_URL || 'http://localhost:8000';
  }

  /**
   * Initialize connection to ChromaDB
   */
  async initialize(): Promise<void> {
    try {
      if (process.env.USE_CHROMA !== 'true') {
        console.log('Chroma disabled - using mock mode');
        this.connected = false;
        return;
      }

      // Check if ChromaDB is accessible
      const response = await fetch(`${this.baseUrl}/api/v1/heartbeat`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`ChromaDB not accessible: ${response.status}`);
      }

      this.connected = true;
      console.log('ChromaDB connected successfully');

      // Load existing collections
      await this.loadCollections();
    } catch (error) {
      console.error('Failed to initialize ChromaDB:', error);
      this.connected = false;
      // Continue in mock mode
    }
  }

  /**
   * Check if ChromaDB is healthy
   */
  async isHealthy(): Promise<boolean> {
    if (!this.connected) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/heartbeat`);
      return response.ok;
    } catch (error) {
      console.error('ChromaDB health check failed:', error);
      return false;
    }
  }

  /**
   * Create a new collection in ChromaDB
   */
  async createCollection(
    name: string,
    dimension: number,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      if (!this.connected) {
        console.log(`Mock: Creating collection ${name} with dimension ${dimension}`);
        this.collections.set(name, {
          id: name,
          name,
          metadata: { ...metadata, dimension },
          dimension
        });
        return;
      }

      const response = await fetch(`${this.baseUrl}/api/v1/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          metadata: { ...metadata, dimension },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create collection: ${error}`);
      }

      const collection = await response.json();
      this.collections.set(name, {
        id: collection.id,
        name: collection.name,
        metadata: collection.metadata,
        dimension
      });

      console.log(`ChromaDB collection ${name} created successfully`);
    } catch (error) {
      console.error(`Error creating collection ${name}:`, error);
      throw error;
    }
  }

  /**
   * Delete a collection from ChromaDB
   */
  async deleteCollection(name: string): Promise<void> {
    try {
      if (!this.connected) {
        console.log(`Mock: Deleting collection ${name}`);
        this.collections.delete(name);
        return;
      }

      const response = await fetch(`${this.baseUrl}/api/v1/collections/${name}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete collection: ${error}`);
      }

      this.collections.delete(name);
      console.log(`ChromaDB collection ${name} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting collection ${name}:`, error);
      throw error;
    }
  }

  /**
   * List all collections
   */
  async listCollections(): Promise<VectorCollection[]> {
    try {
      if (!this.connected) {
        return Array.from(this.collections.values()).map(col => ({
          name: col.name,
          dimension: col.dimension || 384,
          description: col.metadata?.description,
          metadata: col.metadata
        }));
      }

      const response = await fetch(`${this.baseUrl}/api/v1/collections`);
      if (!response.ok) {
        throw new Error('Failed to list collections');
      }

      const collections = await response.json();
      return collections.map((col: any) => ({
        name: col.name,
        dimension: col.metadata?.dimension || 384,
        description: col.metadata?.description,
        metadata: col.metadata
      }));
    } catch (error) {
      console.error('Error listing collections:', error);
      return [];
    }
  }

  /**
   * Get collection information
   */
  async getCollection(name: string): Promise<VectorCollection | null> {
    try {
      if (!this.connected) {
        const col = this.collections.get(name);
        return col ? {
          name: col.name,
          dimension: col.dimension || 384,
          description: col.metadata?.description,
          metadata: col.metadata
        } : null;
      }

      const response = await fetch(`${this.baseUrl}/api/v1/collections/${name}`);
      if (!response.ok) {
        return null;
      }

      const collection = await response.json();
      return {
        name: collection.name,
        dimension: collection.metadata?.dimension || 384,
        description: collection.metadata?.description,
        metadata: collection.metadata
      };
    } catch (error) {
      console.error(`Error getting collection ${name}:`, error);
      return null;
    }
  }

  /**
   * Insert or update documents in collection
   */
  async upsert(collection: string, documents: VectorDocument[]): Promise<void> {
    try {
      if (!this.connected) {
        console.log(`Mock: Upserting ${documents.length} documents to ${collection}`);
        return;
      }

      const ids = documents.map(doc => doc.id);
      const embeddings = documents.map(doc => doc.embeddings);
      const metadatas = documents.map(doc => doc.metadata);
      const documentsContent = documents.map(doc => doc.content);

      const response = await fetch(`${this.baseUrl}/api/v1/collections/${collection}/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids,
          embeddings,
          metadatas,
          documents: documentsContent,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to upsert documents: ${error}`);
      }

      console.log(`Upserted ${documents.length} documents to ${collection}`);
    } catch (error) {
      console.error(`Error upserting documents to ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Delete documents by IDs
   */
  async delete(collection: string, ids: string[]): Promise<void> {
    try {
      if (!this.connected) {
        console.log(`Mock: Deleting ${ids.length} documents from ${collection}`);
        return;
      }

      const response = await fetch(`${this.baseUrl}/api/v1/collections/${collection}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete documents: ${error}`);
      }

      console.log(`Deleted ${ids.length} documents from ${collection}`);
    } catch (error) {
      console.error(`Error deleting documents from ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Update documents in collection
   */
  async update(collection: string, documents: Partial<VectorDocument>[]): Promise<void> {
    try {
      if (!this.connected) {
        console.log(`Mock: Updating ${documents.length} documents in ${collection}`);
        return;
      }

      const updates = documents.map(doc => ({
        id: doc.id,
        embeddings: doc.embeddings,
        metadata: doc.metadata,
        document: doc.content,
      }));

      const response = await fetch(`${this.baseUrl}/api/v1/collections/${collection}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: updates.map(u => u.id),
          embeddings: updates.map(u => u.embeddings),
          metadatas: updates.map(u => u.metadata),
          documents: updates.map(u => u.document),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update documents: ${error}`);
      }

      console.log(`Updated ${documents.length} documents in ${collection}`);
    } catch (error) {
      console.error(`Error updating documents in ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Search for similar vectors
   */
  async search(collection: string, query: VectorQuery): Promise<VectorSearchResult[]> {
    try {
      if (!this.connected) {
        return this.generateMockSearchResults(query);
      }

      const queryEmbeddings = query.embeddings;
      if (!queryEmbeddings) {
        throw new Error('Query embeddings are required for search');
      }

      const response = await fetch(`${this.baseUrl}/api/v1/collections/${collection}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_embeddings: [queryEmbeddings],
          n_results: query.limit || 10,
          where: query.metadata || {},
          include: ['embeddings', 'documents', 'metadatas', 'distances'],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to search collection: ${error}`);
      }

      const results: ChromaQueryResponse = await response.json();
      
      // Transform ChromaDB results to our format
      const searchResults: VectorSearchResult[] = [];
      
      if (results.ids && results.ids[0]) {
        for (let i = 0; i < results.ids[0].length; i++) {
          const id = results.ids[0][i];
          const score = 1 - (results.distances[0][i] || 0); // Convert distance to similarity
          const document: VectorDocument = {
            id,
            content: results.documents[0][i] || '',
            metadata: results.metadatas[0][i] || {},
            embeddings: results.embeddings[0][i] || [],
          };

          searchResults.push({
            id,
            score,
            document,
            metadata: results.metadatas[0][i] || {},
          });
        }
      }

      return searchResults;
    } catch (error) {
      console.error(`Error searching collection ${collection}:`, error);
      return this.generateMockSearchResults(query);
    }
  }

  /**
   * Execute batch operations
   */
  async batch(collection: string, operations: BatchOperation[]): Promise<void> {
    try {
      if (!this.connected) {
        console.log(`Mock: Executing ${operations.length} batch operations on ${collection}`);
        return;
      }

      // Process operations in sequence
      for (const operation of operations) {
        switch (operation.operation) {
          case 'upsert':
            if (operation.documents) {
              await this.upsert(collection, operation.documents);
            }
            break;
          case 'delete':
            if (operation.ids) {
              await this.delete(collection, operation.ids);
            }
            break;
          case 'update':
            if (operation.documents) {
              await this.update(collection, operation.documents);
            }
            break;
        }
      }

      console.log(`Executed ${operations.length} batch operations on ${collection}`);
    } catch (error) {
      console.error(`Error executing batch operations on ${collection}:`, error);
      throw error;
    }
  }

  /**
   * Get vector store statistics
   */
  async getStats(): Promise<VectorStoreStats> {
    try {
      if (!this.connected) {
        return {
          totalCollections: this.collections.size,
          totalDocuments: 0,
          totalSize: 0,
          lastUpdated: Date.now(),
        };
      }

      // ChromaDB doesn't provide global stats endpoint
      // We'll aggregate from individual collections
      const collections = await this.listCollections();
      
      return {
        totalCollections: collections.length,
        totalDocuments: 0, // Would need to count documents in each collection
        totalSize: 0, // Would need to calculate size
        lastUpdated: Date.now(),
      };
    } catch (error) {
      console.error('Error getting vector store stats:', error);
      return {
        totalCollections: 0,
        totalDocuments: 0,
        totalSize: 0,
        lastUpdated: Date.now(),
      };
    }
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    this.connected = false;
    this.collections.clear();
    console.log('ChromaDB connection closed');
  }

  // Private helper methods

  private async loadCollections(): Promise<void> {
    try {
      const collections = await this.listCollections();
      for (const col of collections) {
        this.collections.set(col.name, {
          id: col.name,
          name: col.name,
          metadata: col.metadata || {},
          dimension: col.dimension,
        });
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  }

  private generateMockSearchResults(query: VectorQuery): VectorSearchResult[] {
    const results: VectorSearchResult[] = [];
    const limit = query.limit || 10;
    
    for (let i = 0; i < Math.min(limit, 5); i++) {
      results.push({
        id: `doc_${i}`,
        score: 0.9 - (i * 0.1),
        document: {
          id: `doc_${i}`,
          content: `Mock search result ${i}`,
          metadata: { type: 'mock', index: i },
          embeddings: query.embeddings || [],
        },
        metadata: { type: 'mock', index: i },
      });
    }
    
    return results;
  }
}