#!/bin/bash

# Veri MVP Infrastructure Setup Script
# This script sets up the baseline infrastructure for Veri platform

set -e

echo "🚀 Starting Veri MVP Infrastructure Setup..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating infrastructure directories..."
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p data/mongo
mkdir -p logs

# Generate .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual configuration values"
fi

# Pull required Docker images
echo "🐳 Pulling Docker images..."
docker-compose pull

# Start infrastructure services
echo "🔧 Starting infrastructure services..."
docker-compose up -d postgres redis kafka zookeeper

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check PostgreSQL
echo "🔍 Checking PostgreSQL..."
docker-compose exec -T postgres pg_isready -U postgres

# Check Redis
echo "🔍 Checking Redis..."
docker-compose exec -T redis redis-cli ping

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:push

# Create Kafka topics
echo "📨 Creating Kafka topics..."
docker-compose exec -T kafka kafka-topics.sh --create \
    --topic social-events \
    --bootstrap-server localhost:9092 \
    --partitions 3 \
    --replication-factor 1 \
    --if-not-exists

docker-compose exec -T kafka kafka-topics.sh --create \
    --topic assistant-requests \
    --bootstrap-server localhost:9092 \
    --partitions 3 \
    --replication-factor 1 \
    --if-not-exists

docker-compose exec -T kafka kafka-topics.sh --create \
    --topic enrichment-results \
    --bootstrap-server localhost:9092 \
    --partitions 3 \
    --replication-factor 1 \
    --if-not-exists

docker-compose exec -T kafka kafka-topics.sh --create \
    --topic memory-formation \
    --bootstrap-server localhost:9092 \
    --partitions 3 \
    --replication-factor 1 \
    --if-not-exists

echo "✅ Infrastructure setup complete!"
echo ""
echo "📊 Services Status:"
docker-compose ps

echo ""
echo "🚀 Next steps:"
echo "1. Update .env with your configuration"
echo "2. Run 'npm run dev' to start the application"
echo "3. Run 'docker-compose up consumer' to start the Python consumer"
echo "4. Access the application at http://localhost:5000"