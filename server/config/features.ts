// Feature flags for hybrid architecture migration
export const features = {
  // Database features
  useMongo: process.env.USE_MONGO === 'true',
  readFromMongo: process.env.READ_FROM_MONGO === 'true',
  
  // Search features
  hybridSearch: process.env.HYBRID_SEARCH === 'true',
  vectorSearch: process.env.VECTOR_SEARCH === 'true',
  
  // Memory features
  memoryDecay: process.env.MEMORY_DECAY === 'true',
  signalExtraction: process.env.SIGNAL_EXTRACTION === 'true',
  
  // Streaming features
  useRedpanda: process.env.USE_REDPANDA === 'true',
  
  // Caching features
  useRedis: process.env.USE_REDIS === 'true',
  
  // AI features
  useClaudeStreaming: process.env.CLAUDE_STREAMING === 'true',
  useOpenAI: process.env.USE_OPENAI === 'true',
} as const;

// Validate required features for Signal Engine
export function validateFeatures() {
  if (features.readFromMongo && !features.useMongo) {
    throw new Error('Cannot read from MongoDB without enabling dual-write mode (USE_MONGO=true)');
  }
  
  if (features.vectorSearch && !features.useMongo) {
    throw new Error('Vector search requires MongoDB (USE_MONGO=true)');
  }
  
  if (features.memoryDecay && !features.signalExtraction) {
    throw new Error('Memory decay requires signal extraction to be enabled');
  }
}

// Get active features for logging
export function getActiveFeatures(): string[] {
  return Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature);
}