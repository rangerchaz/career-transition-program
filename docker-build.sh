#!/bin/bash

# Build and test Docker image locally
# Usage: ./docker-build.sh

set -e

echo "🐳 Building Docker image..."
docker build -t career-transition-platform:latest .

echo ""
echo "✅ Build successful!"
echo ""
echo "To run the container locally:"
echo "  docker run -p 8080:8080 \\"
echo "    -e DATABASE_URL='your_database_url' \\"
echo "    -e ANTHROPIC_API_KEY='your_api_key' \\"
echo "    -e JWT_SECRET='your_jwt_secret' \\"
echo "    -e NODE_ENV='production' \\"
echo "    career-transition-platform:latest"
echo ""
echo "Or use docker-compose:"
echo "  docker-compose -f docker-compose.prod.yml up"
