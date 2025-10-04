#!/bin/bash
set -e

echo "🚀 Starting TrickShare deployment..."

# Build the application
echo "📦 Building Next.js application..."
npm run build

# Deploy with CDK
echo "☁️ Deploying to AWS..."
npx cdk deploy --require-approval never

echo "✅ Deployment complete!"
echo "🌐 Your TrickShare app is live!"

# Get the website URL
aws cloudformation describe-stacks --stack-name TrickShareStack --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' --output text --region eu-west-1
