#!/bin/bash

# Ecommerce Dashboard Deployment Script

echo "🚀 Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Run tests (if available)
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
    echo "🧪 Running tests..."
    npm test -- --watchAll=false
    
    if [ $? -ne 0 ]; then
        echo "❌ Tests failed"
        exit 1
    fi
    
    echo "✅ Tests passed"
fi

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "❌ Build directory not found"
    exit 1
fi

echo "📁 Build directory created at: $(pwd)/build"

# Optional: Start the application
if [ "$1" = "--start" ]; then
    echo "🌐 Starting the application..."
    npm start
elif [ "$1" = "--serve" ]; then
    echo "🌐 Serving the built application..."
    npx serve -s build -l 3000
else
    echo "✅ Deployment completed successfully!"
    echo "📁 Your built application is in the 'build' directory"
    echo "🌐 To serve it locally, run: npx serve -s build -l 3000"
    echo "🚀 To start development server, run: npm start"
fi 