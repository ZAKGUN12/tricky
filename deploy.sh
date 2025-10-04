#!/bin/bash
set -e

echo "Building Next.js app..."
npm run build

echo "Deploying AWS infrastructure..."
npx cdk deploy --require-approval never

echo "Deployment complete!"
echo "Run 'npm run dev' to test locally"
