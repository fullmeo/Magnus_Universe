#!/bin/bash

# Magnus Dashboard - Deployment Script
# Usage: ./deploy.sh [option]
# Options: docker, pm2, heroku, direct

set -e

DEPLOY_TYPE="${1:-docker}"
APP_NAME="magnus-dashboard"
PORT="${PORT:-3000}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║      Magnus Dashboard 15.3 - Deployment Script            ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Install dependencies
echo -e "\n📦 Installing dependencies..."
npm ci --production

case "$DEPLOY_TYPE" in
  docker)
    echo -e "\n🐳 Building Docker image..."
    docker build -t $APP_NAME:latest .
    echo -e "\n✅ Docker build complete!"
    echo -e "\nTo run:"
    echo "  docker run -p $PORT:$PORT $APP_NAME:latest"
    ;;
  
  pm2)
    echo -e "\n⚙️  Setting up PM2..."
    npm install -g pm2
    pm2 start server/index.js --name "$APP_NAME" --env production
    pm2 save
    pm2 startup
    echo -e "\n✅ PM2 setup complete!"
    echo -e "\nTo manage:"
    echo "  pm2 status"
    echo "  pm2 logs $APP_NAME"
    echo "  pm2 restart $APP_NAME"
    ;;
  
  heroku)
    echo -e "\n☁️  Preparing for Heroku..."
    git init 2>/dev/null || true
    git add .
    git commit -m "Deploy Magnus Dashboard" 2>/dev/null || true
    heroku create $APP_NAME 2>/dev/null || echo "App already exists"
    git push heroku main
    echo -e "\n✅ Heroku deployment complete!"
    heroku open
    ;;
  
  direct)
    echo -e "\n▶️  Starting application..."
    NODE_ENV=production npm start
    ;;
  
  *)
    echo "❌ Unknown deploy type: $DEPLOY_TYPE"
    echo "Usage: ./deploy.sh [docker|pm2|heroku|direct]"
    exit 1
    ;;
esac

echo -e "\n🎉 Deployment script complete!"
