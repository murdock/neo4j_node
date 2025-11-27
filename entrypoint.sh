#!/bin/sh
echo "Waiting for Neo4j to be ready..."
sleep 10

# Run setup (migrations/schema)
pnpm tsx src/db/setup.ts

# Populate mock data
pnpm tsx src/mocks/mockLLM.ts

# Start API and Vite frontend concurrently
pnpm tsx src/api/index.ts & pnpm vite --host 0.0.0.0
