#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting DEV deployment"

echo "Frontend artifact path: $FRONTEND_PATH"
echo "Backend artifact path:  $BACKEND_PATH"

if [ ! -d "$FRONTEND_PATH" ]; then
  echo "❌ Frontend artifact not found"
  exit 1
fi

if [ ! -d "$BACKEND_PATH" ]; then
  echo "❌ Backend artifact not found"
  exit 1
fi

echo "📦 Deploying frontend..."
ls -la "$FRONTEND_PATH"

echo "📦 Deploying backend..."
ls -la "$BACKEND_PATH"

# Example deployment placeholders
# rsync -av "$FRONTEND_PATH/" user@server:/var/www/frontend
# rsync -av "$BACKEND_PATH/" user@server:/opt/app/backend

echo "✅ DEV deployment completed successfully"
