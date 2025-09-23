#!/bin/bash

# Simple static file server for PrepGuides.dev
# No Node.js or npm required!

echo "🚀 Starting PrepGuides.dev static server..."
echo "📁 Serving files from: $(pwd)"
echo "🌐 Open your browser to: http://localhost:8000"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Try Python 3 first, then Python 2, then suggest alternatives
if command -v python3 &> /dev/null; then
    echo "Using Python 3..."
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Using Python 2..."
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python not found. Please install Python or use one of these alternatives:"
    echo "   - npx serve ."
    echo "   - php -S localhost:8000"
    echo "   - Any other static file server"
    exit 1
fi
