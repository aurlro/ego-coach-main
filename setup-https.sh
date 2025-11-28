#!/bin/bash
# Setup HTTPS local testing for PWA

set -e

echo "🔒 EgoCoach - HTTPS Local Setup"
echo "================================"
echo ""

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "📦 Installing mkcert..."
    if command -v brew &> /dev/null; then
        brew install mkcert
    else
        echo "❌ Homebrew not found. Please install mkcert manually:"
        echo "   https://github.com/FiloSottile/mkcert#installation"
        exit 1
    fi
fi

echo "✅ mkcert found"

# Install local CA
echo "🔐 Installing local Certificate Authority..."
mkcert -install

# Generate certificates
echo "📜 Generating SSL certificates..."
cd "$(dirname "$0")"
mkcert -key-file localhost-key.pem -cert-file localhost.pem localhost 127.0.0.1 ::1

echo ""
echo "✅ SSL certificates generated!"
echo ""

# Check if http-server is installed
if ! command -v http-server &> /dev/null; then
    echo "📦 Installing http-server globally..."
    npm install -g http-server
fi

echo "✅ http-server ready"
echo ""
echo "🚀 To start HTTPS server, run:"
echo "   npm run serve:https"
echo ""
echo "   Or manually:"
echo "   http-server -S -C localhost.pem -K localhost-key.pem -p 8443"
echo ""
echo "📱 Then open: https://localhost:8443"
echo ""
echo "💡 Tips:"
echo "   - First visit: Browser may show warning (click Advanced > Proceed)"
echo "   - Test PWA install: Chrome menu > Install EgoCoach"
echo "   - DevTools > Application > Service Worker (should show registered)"
echo ""
