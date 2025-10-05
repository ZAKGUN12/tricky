#!/bin/bash

echo "🚀 Setting up AWS Amplify deployment..."

# Create Amplify app with GitHub integration
APP_ID=$(aws amplify create-app \
  --name "TrickShare" \
  --description "Global community for sharing life tricks" \
  --platform "WEB" \
  --query 'app.appId' \
  --output text)

echo "✅ Created Amplify app: $APP_ID"

# Create branch
aws amplify create-branch \
  --app-id $APP_ID \
  --branch-name "main" \
  --framework "Next.js - SSR" \
  --enable-auto-build

echo "✅ Created main branch"

# Update app with repository (requires manual GitHub connection)
aws amplify update-app \
  --app-id $APP_ID \
  --name "TrickShare" \
  --repository "https://github.com/ZAKGUN12/tricky" \
  --enable-auto-branch-creation \
  --auto-branch-creation-patterns "main"

echo "✅ Updated app with repository"
echo "🌐 Your app will be available at: https://main.$APP_ID.amplifyapp.com"
echo "🔗 Complete setup in AWS Console: https://console.aws.amazon.com/amplify/home#/$APP_ID"
echo ""
echo "Next steps:"
echo "1. Go to the AWS Console link above"
echo "2. Connect your GitHub repository"
echo "3. Add environment variables: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY"
echo "4. Deploy!"
