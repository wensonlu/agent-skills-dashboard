#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "Installing dependencies with temporary npm mirror..."
CI=true pnpm install --no-frozen-lockfile --registry=https://registry.npmmirror.com

echo "Starting Agent Skills Dashboard demo at http://127.0.0.1:5173/"
pnpm demo
