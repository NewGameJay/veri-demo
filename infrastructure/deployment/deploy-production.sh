#!/bin/bash

# Veri MVP Production Deployment Script
# This script deploys the Veri platform to production

set -e

echo "🚀 Starting Veri MVP Production Deployment..."

# Check environment
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to production"
    read -p "Continue with deployment? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build application
echo "🔨 Building application..."
npm run build

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:push

# Deploy services
echo "🚀 Deploying services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 15

# Health checks
echo "🏥 Running health checks..."

# Check Node.js API
API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health || echo "000")
if [ "$API_HEALTH" == "200" ]; then
    echo "✅ API is healthy"
else
    echo "❌ API health check failed (status: $API_HEALTH)"
    exit 1
fi

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null; then
    echo "✅ PostgreSQL is healthy"
else
    echo "❌ PostgreSQL health check failed"
    exit 1
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null; then
    echo "✅ Redis is healthy"
else
    echo "❌ Redis health check failed"
    exit 1
fi

# Check Kafka
if docker-compose exec -T kafka kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1; then
    echo "✅ Kafka is healthy"
else
    echo "❌ Kafka health check failed"
    exit 1
fi

# Display service status
echo ""
echo "📊 Deployment Status:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Display logs tail
echo ""
echo "📝 Recent logs:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=20

echo ""
echo "✅ Production deployment complete!"
echo ""
echo "🌐 Application URLs:"
echo "- Frontend: http://localhost:5000"
echo "- API Health: http://localhost:5000/api/health"
echo "- Metrics: http://localhost:5000/api/metrics"
echo ""
echo "📊 Monitoring:"
echo "- Logs: docker-compose logs -f [service]"
echo "- Metrics: curl http://localhost:5000/api/metrics"
echo "- Status: docker-compose ps"