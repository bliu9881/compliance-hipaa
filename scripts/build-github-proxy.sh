#!/bin/bash

# Build script for GitHub Proxy Lambda function
# This script compiles the TypeScript Lambda function and prepares it for deployment

set -e

echo "🔨 Building GitHub Proxy Lambda function..."

# Create dist directory
mkdir -p dist/github-proxy

# Compile TypeScript
echo "📦 Compiling TypeScript..."
npx tsc api/github-proxy.ts \
  --target ES2020 \
  --module commonjs \
  --outDir dist/github-proxy \
  --declaration \
  --strict \
  --esModuleInterop \
  --skipLibCheck \
  --forceConsistentCasingInFileNames

# Create package.json for Lambda
echo "📝 Creating package.json..."
cat > dist/github-proxy/package.json << 'EOF'
{
  "name": "github-proxy",
  "version": "1.0.0",
  "description": "GitHub API proxy Lambda function",
  "main": "index.js",
  "license": "MIT"
}
EOF

# Create index.js wrapper if needed
if [ ! -f dist/github-proxy/index.js ]; then
  echo "⚠️  Creating index.js wrapper..."
  cat > dist/github-proxy/index.js << 'EOF'
const githubProxy = require('./github-proxy');
exports.handler = githubProxy.handler;
EOF
fi

echo "✅ Build complete!"
echo "📍 Output: dist/github-proxy/"
echo ""
echo "Next steps:"
echo "1. Deploy with CDK: npm run cdk:deploy"
echo "2. Or manually: aws lambda update-function-code --function-name github-proxy --zip-file fileb://dist/github-proxy.zip"
