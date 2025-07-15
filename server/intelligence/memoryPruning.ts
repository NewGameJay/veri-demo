/**
 * Memory Pruning - Intelligent forgetting system for Veri platform
 * Implements retention policies, relevance decay, and memory optimization
 */

import { MemoryChunk } from './memorizzCore';

export interface PruningPolicy {
  id: string;
  name: string;
  description: string;
  rules: PruningRule[];
  enabled: boolean;
  priority: number;
}

export interface PruningRule {
  type: 'age' | 'relevance' | 'size' | 'redundancy' | 'user_request';
  condition: {
    operator: 'gt' | 'lt' | 'eq' | 'contains' | 'not_contains';
    value: any;
    threshold?: number;
  };
  action: 'delete' | 'compress' | 'archive' | 'flag';
  weight: number;
}

export interface PruningSchedule {
  interval: number; // in milliseconds
  batchSize: number;
  maxProcessingTime: number;
  priority: 'low' | 'medium' | 'high';
}

export interface PruningResult {
  processed: number;
  deleted: number;
  compressed: number;
  archived: number;
  errors: number;
  processingTime: number;
  nextSchedule: number;
}

export interface RelevanceDecayConfig {
  baseDecayRate: number;
  contextualBoost: number;
  interactionBoost: number;
  importanceThreshold: number;
  decayFunction: 'linear' | 'exponential' | 'logarithmic';
}

export class MemoryPruning {
  private policies: Map<string, PruningPolicy>;
  private schedules: Map<string, PruningSchedule>;
  private decayConfig: RelevanceDecayConfig;
  private pruningInProgress: boolean;
  private lastPruningTime: number;

  constructor(options: {
    decayConfig?: Partial<RelevanceDecayConfig>;
  } = {}) {
    this.policies = new Map();
    this.schedules = new Map();
    this.pruningInProgress = false;
    this.lastPruningTime = 0;
    
    this.decayConfig = {
      baseDecayRate: 0.1,
      contextualBoost: 0.2,
      interactionBoost: 0.3,
      importanceThreshold: 0.3,
      decayFunction: 'exponential',
      ...options.decayConfig
    };

    this.initializeDefaultPolicies();
  }

  /**
   * Initialize default pruning policies
   */
  private initializeDefaultPolicies(): void {
    // Age-based pruning
    this.addPolicy({
      id: 'age_based',
      name: 'Age-Based Pruning',
      description: 'Remove memories older than specified threshold',
      enabled: true,
      priority: 1,
      rules: [
        {
          type: 'age',
          condition: {
            operator: 'gt',
            value: 90 * 24 * 60 * 60 * 1000, // 90 days
            threshold: 0.8
          },
          action: 'delete',
          weight: 1.0
        }
      ]
    });

    // Relevance-based pruning
    this.addPolicy({
      id: 'relevance_based',
      name: 'Relevance-Based Pruning',
      description: 'Remove memories with low relevance scores',
      enabled: true,
      priority: 2,
      rules: [
        {
          type: 'relevance',
          condition: {
            operator: 'lt',
            value: 0.1,
            threshold: 0.1
          },
          action: 'delete',
          weight: 0.8
        }
      ]
    });

    // Size-based pruning
    this.addPolicy({
      id: 'size_based',
      name: 'Size-Based Pruning',
      description: 'Compress or remove large memories',
      enabled: true,
      priority: 3,
      rules: [
        {
          type: 'size',
          condition: {
            operator: 'gt',
            value: 10000, // 10KB
            threshold: 0.5
          },
          action: 'compress',
          weight: 0.6
        }
      ]
    });

    // Redundancy-based pruning
    this.addPolicy({
      id: 'redundancy_based',
      name: 'Redundancy-Based Pruning',
      description: 'Remove duplicate or similar memories',
      enabled: false, // Disabled by default (requires semantic comparison)
      priority: 4,
      rules: [
        {
          type: 'redundancy',
          condition: {
            operator: 'gt',
            value: 0.9, // 90% similarity
            threshold: 0.9
          },
          action: 'delete',
          weight: 0.7
        }
      ]
    });
  }

  /**
   * Add a pruning policy
   */
  addPolicy(policy: PruningPolicy): void {
    this.policies.set(policy.id, policy);
  }

  /**
   * Remove a pruning policy
   */
  removePolicy(policyId: string): boolean {
    return this.policies.delete(policyId);
  }

  /**
   * Get all policies
   */
  getPolicies(): PruningPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Set pruning schedule
   */
  setSchedule(policyId: string, schedule: PruningSchedule): void {
    this.schedules.set(policyId, schedule);
  }

  /**
   * Run pruning process for a user
   */
  async pruneUserMemories(userId: number, memories: MemoryChunk[]): Promise<PruningResult> {
    if (this.pruningInProgress) {
      throw new Error('Pruning is already in progress');
    }

    this.pruningInProgress = true;
    const startTime = Date.now();
    
    try {
      const result: PruningResult = {
        processed: 0,
        deleted: 0,
        compressed: 0,
        archived: 0,
        errors: 0,
        processingTime: 0,
        nextSchedule: 0
      };

      // Apply relevance decay first
      const memoriesWithDecay = await this.applyRelevanceDecay(memories);

      // Apply each policy in priority order
      const activePolicies = Array.from(this.policies.values())
        .filter(p => p.enabled)
        .sort((a, b) => a.priority - b.priority);

      for (const policy of activePolicies) {
        const policyResult = await this.applyPolicy(policy, memoriesWithDecay);
        result.processed += policyResult.processed;
        result.deleted += policyResult.deleted;
        result.compressed += policyResult.compressed;
        result.archived += policyResult.archived;
        result.errors += policyResult.errors;
      }

      result.processingTime = Date.now() - startTime;
      result.nextSchedule = this.calculateNextSchedule();
      
      this.lastPruningTime = Date.now();
      
      console.log(`Pruning completed for user ${userId}:`, result);
      return result;
    } catch (error) {
      console.error(`Error pruning memories for user ${userId}:`, error);
      throw error;
    } finally {
      this.pruningInProgress = false;
    }
  }

  /**
   * Apply relevance decay to memories
   */
  async applyRelevanceDecay(memories: MemoryChunk[]): Promise<MemoryChunk[]> {
    const now = Date.now();
    
    return memories.map(memory => {
      const age = now - memory.metadata.timestamp;
      const daysSinceCreation = age / (24 * 60 * 60 * 1000);
      
      let decayFactor: number;
      
      switch (this.decayConfig.decayFunction) {
        case 'linear':
          decayFactor = Math.max(0, 1 - (daysSinceCreation * this.decayConfig.baseDecayRate));
          break;
        case 'logarithmic':
          decayFactor = Math.max(0, 1 - Math.log(daysSinceCreation + 1) * this.decayConfig.baseDecayRate);
          break;
        case 'exponential':
        default:
          decayFactor = Math.exp(-daysSinceCreation * this.decayConfig.baseDecayRate);
          break;
      }

      // Apply contextual and interaction boosts
      const originalImportance = memory.metadata.importance;
      const decayedImportance = originalImportance * decayFactor;
      
      // Apply boosts based on context and interactions
      let boostedImportance = decayedImportance;
      
      // Contextual boost (if memory has been accessed recently)
      if (memory.metadata.contextId) {
        boostedImportance += this.decayConfig.contextualBoost * decayFactor;
      }
      
      // Interaction boost (if memory has tags indicating interaction)
      if (memory.metadata.tags.length > 0) {
        boostedImportance += this.decayConfig.interactionBoost * decayFactor;
      }
      
      // Ensure importance doesn't exceed 1.0
      boostedImportance = Math.min(1.0, boostedImportance);
      
      return {
        ...memory,
        metadata: {
          ...memory.metadata,
          importance: boostedImportance
        }
      };
    });
  }

  /**
   * Apply a specific policy to memories
   */
  async applyPolicy(policy: PruningPolicy, memories: MemoryChunk[]): Promise<PruningResult> {
    const result: PruningResult = {
      processed: 0,
      deleted: 0,
      compressed: 0,
      archived: 0,
      errors: 0,
      processingTime: 0,
      nextSchedule: 0
    };

    for (const memory of memories) {
      try {
        result.processed++;
        
        for (const rule of policy.rules) {
          const shouldApply = await this.evaluateRule(rule, memory);
          
          if (shouldApply) {
            switch (rule.action) {
              case 'delete':
                await this.deleteMemory(memory);
                result.deleted++;
                break;
              case 'compress':
                await this.compressMemory(memory);
                result.compressed++;
                break;
              case 'archive':
                await this.archiveMemory(memory);
                result.archived++;
                break;
              case 'flag':
                await this.flagMemory(memory);
                break;
            }
            break; // Only apply first matching rule
          }
        }
      } catch (error) {
        console.error(`Error applying policy ${policy.id} to memory ${memory.id}:`, error);
        result.errors++;
      }
    }

    return result;
  }

  /**
   * Evaluate if a rule should be applied to a memory
   */
  async evaluateRule(rule: PruningRule, memory: MemoryChunk): Promise<boolean> {
    const now = Date.now();
    
    switch (rule.type) {
      case 'age':
        const age = now - memory.metadata.timestamp;
        return this.compareValues(age, rule.condition.value, rule.condition.operator);
      
      case 'relevance':
        const relevance = memory.metadata.importance;
        return this.compareValues(relevance, rule.condition.value, rule.condition.operator);
      
      case 'size':
        const size = memory.content.length;
        return this.compareValues(size, rule.condition.value, rule.condition.operator);
      
      case 'redundancy':
        // TODO: Implement semantic similarity checking
        return false;
      
      case 'user_request':
        // TODO: Implement user-specific pruning requests
        return false;
      
      default:
        return false;
    }
  }

  /**
   * Compare values based on operator
   */
  private compareValues(actual: any, expected: any, operator: string): boolean {
    switch (operator) {
      case 'gt':
        return actual > expected;
      case 'lt':
        return actual < expected;
      case 'eq':
        return actual === expected;
      case 'contains':
        return String(actual).includes(String(expected));
      case 'not_contains':
        return !String(actual).includes(String(expected));
      default:
        return false;
    }
  }

  /**
   * Delete a memory (mock implementation)
   */
  private async deleteMemory(memory: MemoryChunk): Promise<void> {
    // TODO: Implement actual memory deletion
    console.log(`Deleting memory: ${memory.id}`);
  }

  /**
   * Compress a memory (mock implementation)
   */
  private async compressMemory(memory: MemoryChunk): Promise<void> {
    // TODO: Implement memory compression
    console.log(`Compressing memory: ${memory.id}`);
  }

  /**
   * Archive a memory (mock implementation)
   */
  private async archiveMemory(memory: MemoryChunk): Promise<void> {
    // TODO: Implement memory archiving
    console.log(`Archiving memory: ${memory.id}`);
  }

  /**
   * Flag a memory for review (mock implementation)
   */
  private async flagMemory(memory: MemoryChunk): Promise<void> {
    // TODO: Implement memory flagging
    console.log(`Flagging memory: ${memory.id}`);
  }

  /**
   * Calculate when the next pruning should occur
   */
  private calculateNextSchedule(): number {
    // Default to 24 hours from now
    return Date.now() + (24 * 60 * 60 * 1000);
  }

  /**
   * Get pruning statistics
   */
  getPruningStats(): {
    lastPruningTime: number;
    policiesCount: number;
    activePolicies: number;
    nextScheduledPruning: number;
  } {
    const activePolicies = Array.from(this.policies.values())
      .filter(p => p.enabled).length;

    return {
      lastPruningTime: this.lastPruningTime,
      policiesCount: this.policies.size,
      activePolicies,
      nextScheduledPruning: this.calculateNextSchedule()
    };
  }

  /**
   * Update decay configuration
   */
  updateDecayConfig(config: Partial<RelevanceDecayConfig>): void {
    this.decayConfig = {
      ...this.decayConfig,
      ...config
    };
  }
}

// Export singleton instance
export const memoryPruning = new MemoryPruning();