#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "=== [1/2] Installing Python Dependencies ==="
pip install -r requirements.txt

echo "=== [2/2] Building React Frontend ==="
cd frontend
npm install
npm run build
cd ..

echo "=== Build Complete! Both Backend and Frontend are Ready ==="
