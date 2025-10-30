#!/bin/sh
set -e

echo "Starting development environment..."

# Start PocketBase in the background
echo "Starting PocketBase on port 8090..."
pocketbase serve --http=0.0.0.0:8090 --dir=/data &
PB_PID=$!

# Wait for PocketBase to be ready
echo "Waiting for PocketBase to start..."
sleep 2

# Start Vite dev server in the foreground
echo "Starting Vite dev server on port 8066..."
exec pnpm run dev --host 0.0.0.0 --port 8066
