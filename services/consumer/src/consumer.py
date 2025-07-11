import asyncio
import json
import os
from typing import Dict, Any
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from loguru import logger
import asyncpg
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from .processors.social_processor import SocialProcessor
from .processors.content_analyzer import ContentAnalyzer
from .processors.signal_extractor import SignalExtractor

load_dotenv()

class EventConsumer:
    def __init__(self):
        self.kafka_brokers = os.getenv('KAFKA_BROKERS', 'localhost:9092').split(',')
        self.postgres_url = os.getenv('DATABASE_URL')
        self.mongo_url = os.getenv('MONGO_URL')
        self.use_mongo = os.getenv('USE_MONGO', 'false').lower() == 'true'
        
        self.consumer = None
        self.producer = None
        self.pg_pool = None
        self.mongo_client = None
        
        # Initialize processors
        self.social_processor = SocialProcessor()
        self.content_analyzer = ContentAnalyzer()
        self.signal_extractor = SignalExtractor()
        
    async def start(self):
        """Initialize connections and start consuming"""
        logger.info("Starting event consumer...")
        
        # Initialize PostgreSQL
        self.pg_pool = await asyncpg.create_pool(self.postgres_url)
        logger.info("PostgreSQL connected")
        
        # Initialize MongoDB if enabled
        if self.use_mongo:
            self.mongo_client = AsyncIOMotorClient(self.mongo_url)
            self.mongo_db = self.mongo_client.veri_signal
            logger.info("MongoDB connected")
        
        # Initialize Kafka
        self.consumer = AIOKafkaConsumer(
            'social-events',
            'assistant-requests',
            bootstrap_servers=self.kafka_brokers,
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            group_id='enrichment-consumer'
        )
        
        self.producer = AIOKafkaProducer(
            bootstrap_servers=self.kafka_brokers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
        await self.consumer.start()
        await self.producer.start()
        logger.info("Kafka consumer and producer started")
        
        # Start consuming
        try:
            await self.consume()
        finally:
            await self.stop()
    
    async def consume(self):
        """Main consumption loop"""
        async for msg in self.consumer:
            try:
                await self.process_message(msg)
            except Exception as e:
                logger.error(f"Error processing message: {e}")
    
    async def process_message(self, msg):
        """Process individual messages based on topic"""
        topic = msg.topic
        value = msg.value
        
        logger.info(f"Processing message from {topic}: {value.get('creatorId', 'unknown')}")
        
        if topic == 'social-events':
            await self.process_social_event(value)
        elif topic == 'assistant-requests':
            await self.process_assistant_request(value)
    
    async def process_social_event(self, event: Dict[str, Any]):
        """Process social media events"""
        creator_id = event['creatorId']
        platform = event['platform']
        
        # Enrich social data
        enriched_data = await self.social_processor.process(event)
        
        # Analyze content if applicable
        if 'content' in enriched_data:
            content_analysis = await self.content_analyzer.analyze(enriched_data['content'])
            enriched_data['analysis'] = content_analysis
        
        # Extract signals
        signals = await self.signal_extractor.extract(enriched_data)
        
        # Store in PostgreSQL
        async with self.pg_pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO raw_social_data (creator_id, platform, payload_json, created_at)
                VALUES ($1, $2, $3, NOW())
            """, creator_id, platform, json.dumps(enriched_data))
        
        # Store in MongoDB if enabled
        if self.use_mongo:
            await self.mongo_db.interactions.insert_one({
                'creator_id': creator_id,
                'platform': platform,
                'enriched_data': enriched_data,
                'signals': signals,
                'timestamp': event['timestamp']
            })
        
        # Publish enrichment results
        await self.producer.send('enrichment-results', {
            'creatorId': creator_id,
            'platform': platform,
            'signals': signals,
            'timestamp': event['timestamp']
        })
        
        logger.info(f"Processed social event for creator {creator_id}")
    
    async def process_assistant_request(self, request: Dict[str, Any]):
        """Process assistant chat requests"""
        creator_id = request['creatorId']
        message = request['message']
        
        # For now, just log - actual Claude integration would go here
        logger.info(f"Assistant request from {creator_id}: {message}")
        
        # Store chat memory
        async with self.pg_pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO chat_memory (creator_id, ts, role, content)
                VALUES ($1, NOW(), 'user', $2)
            """, creator_id, message)
    
    async def stop(self):
        """Cleanup connections"""
        logger.info("Stopping consumer...")
        
        if self.consumer:
            await self.consumer.stop()
        if self.producer:
            await self.producer.stop()
        if self.pg_pool:
            await self.pg_pool.close()
        if self.mongo_client:
            self.mongo_client.close()

def main():
    consumer = EventConsumer()
    asyncio.run(consumer.start())

if __name__ == "__main__":
    main()