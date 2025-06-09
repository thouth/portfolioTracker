#!/usr/bin/env bash
set -e

# Create Python virtual environment if it doesn't exist
if [ ! -d "backend/venv" ]; then
    python3 -m venv backend/venv
fi

# Install backend dependencies
backend/venv/bin/python -m pip install --upgrade pip
backend/venv/bin/pip install -r backend/requirements.txt

# Copy environment example if .env is missing
if [ ! -f "backend/.env" ]; then
    cp backend/.envExample backend/.env
fi

# Install frontend dependencies
(cd frontend && npm install)

# Copy frontend env example if needed
if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.local.example frontend/.env.local
fi

