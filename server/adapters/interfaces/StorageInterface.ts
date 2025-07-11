// Storage Interface for hybrid architecture
export interface RawSocialEvent {
  creatorId: string;
  platform: string;
  type: string;
  payload: any;
  timestamp: Date;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  username: string;
  email?: string;
  veriScore: number;
  xpPoints: number;
  resonanceTags?: ResonanceTag[];
  behavioralPatterns?: BehavioralPatterns;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResonanceTag {
  category: string;
  subcategory: string;
  confidence: number;
  lastUpdated: Date;
  sourceInteractions: string[];
}

export interface BehavioralPatterns {
  toolUsageFrequency: Record<string, number>;
  peakActivityHours: number[];
  preferredContentFormats: string[];
  monetizationSuccessRate: number;
}

export interface Memory {
  id: string;
  creatorId: string;
  type: 'entity' | 'episodic' | 'content' | 'brand' | 'workflow';
  content: any;
  relevanceScore: number;
  timestamp: Date;
  expiresAt?: Date;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  includeEmbeddings?: boolean;
}

export interface SearchResult {
  id: string;
  score: number;
  data: any;
}

// Storage Interface - all implementations must conform to this
export interface StorageInterface {
  // Event operations
  saveEvent(event: RawSocialEvent): Promise<void>;
  fetchRecentEvents(creatorId: string, limit: number): Promise<RawSocialEvent[]>;
  
  // Creator operations
  getCreator(creatorId: string): Promise<CreatorProfile | null>;
  updateCreatorProfile(creatorId: string, updates: Partial<CreatorProfile>): Promise<void>;
  getCreatorsByTag(tag: string, limit: number): Promise<CreatorProfile[]>;
  
  // Memory operations
  saveMemory(memory: Memory): Promise<void>;
  getMemories(creatorId: string, type?: Memory['type'], limit?: number): Promise<Memory[]>;
  deleteExpiredMemories(): Promise<number>;
  
  // Batch operations
  batchSaveEvents(events: RawSocialEvent[]): Promise<void>;
  batchUpdateCreators(updates: Array<{ id: string; updates: Partial<CreatorProfile> }>): Promise<void>;
}

// Search Interface - implementations vary between SQL and vector search
export interface SearchInterface {
  // Text search
  searchCreators(query: string, options?: SearchOptions): Promise<SearchResult[]>;
  searchContent(query: string, options?: SearchOptions): Promise<SearchResult[]>;
  
  // Similarity search
  findSimilarCreators(creatorId: string, limit: number): Promise<CreatorProfile[]>;
  findSimilarContent(contentId: string, limit: number): Promise<SearchResult[]>;
  
  // Hybrid search (when available)
  hybridSearch?(query: { text?: string; vector?: number[]; filters?: Record<string, any> }): Promise<SearchResult[]>;
}

// Memory Interface - handles memory formation and retrieval
export interface MemoryInterface {
  // Memory formation
  formMemory(interaction: any): Promise<Memory>;
  extractSignals(rawData: any): Promise<any>;
  
  // Memory retrieval
  retrieveMemory(creatorId: string, context: string): Promise<Memory[]>;
  getRelevantMemories(creatorId: string, query: string, limit: number): Promise<Memory[]>;
  
  // Memory lifecycle
  decayMemory(retentionPolicy: RetentionPolicy): Promise<void>;
  consolidateMemories(creatorId: string): Promise<void>;
}

export interface RetentionPolicy {
  maxAge?: number; // in days
  minRelevanceScore?: number;
  maxMemoriesPerType?: Record<Memory['type'], number>;
}