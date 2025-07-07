#!/bin/bash
set -e

# Node & Yarn Setup via Corepack
export NODE_VERSION=22.17.0
export YARN_VERSION=4.9.2

echo "▶ Installing Node.js $NODE_VERSION and Yarn $YARN_VERSION..."

# Install Node (ensure nvm or system version manager is used)
if ! command -v node &> /dev/null || [[ "$(node -v)" != "v$NODE_VERSION" ]]; then
    echo "❗ Please install Node.js v$NODE_VERSION manually or via nvm"
    exit 1
fi

# Enable and set up Yarn 4 via Corepack
corepack enable
corepack prepare yarn@$YARN_VERSION --activate

# Ensure correct NodeLinker
echo "nodeLinker: pnp" > .yarnrc.yml

echo "▶ Running yarn install..."
yarn install --immutable

echo "▶ Running lint..."
yarn lint


echo "Running format:check..."
yarn format:check

echo "▶ Running unit tests..."
yarn test:unit

echo "▶ Building frontend..."
yarn build

echo "✅ Build complete"
