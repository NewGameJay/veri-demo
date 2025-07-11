import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import { features } from '@/config/features';

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
}

export class KafkaService {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumers: Map<string, Consumer> = new Map();

  constructor(config: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
    });
  }

  async connectProducer(): Promise<void> {
    if (!features.useRedpanda) return;
    
    this.producer = this.kafka.producer();
    await this.producer.connect();
    console.log('Kafka producer connected');
  }

  async disconnectProducer(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
      this.producer = null;
    }
  }

  async send(topic: string, messages: Array<{ key?: string; value: string }>): Promise<void> {
    if (!features.useRedpanda || !this.producer) {
      console.log(`Kafka disabled, skipping message to ${topic}`);
      return;
    }

    await this.producer.send({
      topic,
      messages: messages.map(msg => ({
        key: msg.key,
        value: msg.value,
      })),
    });
  }

  async createConsumer(
    groupId: string,
    topics: string[],
    handler: (payload: EachMessagePayload) => Promise<void>
  ): Promise<void> {
    if (!features.useRedpanda) return;

    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    
    await consumer.subscribe({ topics, fromBeginning: false });
    
    await consumer.run({
      eachMessage: handler,
    });

    this.consumers.set(groupId, consumer);
    console.log(`Kafka consumer ${groupId} connected to topics: ${topics.join(', ')}`);
  }

  async disconnectConsumer(groupId: string): Promise<void> {
    const consumer = this.consumers.get(groupId);
    if (consumer) {
      await consumer.disconnect();
      this.consumers.delete(groupId);
    }
  }

  async disconnectAll(): Promise<void> {
    await this.disconnectProducer();
    
    for (const [groupId, consumer] of this.consumers) {
      await consumer.disconnect();
    }
    this.consumers.clear();
  }
}

// Topic definitions
export const KAFKA_TOPICS = {
  ASSISTANT_REQUESTS: 'assistant-requests',
  SOCIAL_EVENTS: 'social-events',
  MEMORY_FORMATIONS: 'memory-formations',
  ENRICHMENT_RESULTS: 'enrichment-results',
  CAMPAIGN_EVENTS: 'campaign-events',
} as const;

// Message schemas
export interface AssistantRequestMessage {
  creatorId: string;
  sessionId: string;
  message: string;
  context?: any;
  timestamp: Date;
}

export interface SocialEventMessage {
  creatorId: string;
  platform: string;
  eventType: string;
  data: any;
  timestamp: Date;
}

export interface MemoryFormationMessage {
  creatorId: string;
  memoryType: 'entity' | 'episodic' | 'content' | 'brand' | 'workflow';
  content: any;
  signals: any;
  timestamp: Date;
}

// Singleton instance
let kafkaService: KafkaService | null = null;

export function getKafkaService(): KafkaService {
  if (!kafkaService) {
    const brokers = process.env.KAFKA_BROKERS?.split(',') || ['localhost:19092'];
    kafkaService = new KafkaService({
      clientId: 'veri-api',
      brokers,
    });
  }
  return kafkaService;
}