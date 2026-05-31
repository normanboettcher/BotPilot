#!/bin/bash
set -e

echo "▶ Running bun install..."
bun install --frozen-lockfile

echo "▶ Running lint..."
bun run lint

echo "Running format:check..."
bun run format:check

echo "▶ Running unit tests..."
bun run test:unit

echo "▶ Building frontend..."
bun run build

echo "✅ Build complete"
