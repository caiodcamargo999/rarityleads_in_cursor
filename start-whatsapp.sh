#!/bin/bash

# WhatsApp Backend Startup Script
# This script starts the WhatsApp backend service

echo "🚀 Starting WhatsApp Backend Service..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "backend-whatsapp/package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Go to backend directory
cd backend-whatsapp

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file. Please configure it with your actual values."
        echo "📝 Edit backend-whatsapp/.env with your Supabase credentials"
    else
        echo "❌ .env.example file not found. Please create .env manually."
        exit 1
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the backend service
echo "🔧 Starting WhatsApp backend on port 3001..."
echo "💡 Backend will be available at http://localhost:3001"
echo "🔄 Press Ctrl+C to stop the service"
echo ""

# Start in development mode
npm run dev