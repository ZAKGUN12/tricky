#!/bin/bash

# AWS Cognito Setup Script for TrickShare
echo "🔐 Setting up AWS Cognito for TrickShare..."

# Variables
REGION="eu-west-1"
POOL_NAME="TrickShare-Users"
CLIENT_NAME="TrickShare-Web"
DOMAIN_PREFIX="trickshare-auth"
CALLBACK_URL="https://tricky-peach.vercel.app/auth/callback"
LOGOUT_URL="https://tricky-peach.vercel.app"

# Create User Pool
echo "📝 Creating User Pool..."
USER_POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name "$POOL_NAME" \
  --region "$REGION" \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": false
    }
  }' \
  --auto-verified-attributes email \
  --username-attributes email \
  --query 'UserPool.Id' \
  --output text)

echo "✅ User Pool created: $USER_POOL_ID"

# Create User Pool Client
echo "📱 Creating User Pool Client..."
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --user-pool-id "$USER_POOL_ID" \
  --client-name "$CLIENT_NAME" \
  --region "$REGION" \
  --generate-secret false \
  --supported-identity-providers "COGNITO" \
  --callback-urls "$CALLBACK_URL" \
  --logout-urls "$LOGOUT_URL" \
  --allowed-o-auth-flows "code" \
  --allowed-o-auth-scopes "openid" "email" "profile" \
  --allowed-o-auth-flows-user-pool-client \
  --query 'UserPoolClient.ClientId' \
  --output text)

echo "✅ User Pool Client created: $CLIENT_ID"

# Create Domain
echo "🌐 Creating Cognito Domain..."
aws cognito-idp create-user-pool-domain \
  --domain "$DOMAIN_PREFIX" \
  --user-pool-id "$USER_POOL_ID" \
  --region "$REGION"

DOMAIN="$DOMAIN_PREFIX.auth.$REGION.amazoncognito.com"
echo "✅ Domain created: $DOMAIN"

# Output environment variables
echo ""
echo "🔧 Add these to your .env.local:"
echo "NEXT_PUBLIC_COGNITO_DOMAIN=$DOMAIN"
echo "NEXT_PUBLIC_COGNITO_CLIENT_ID=$CLIENT_ID"
echo "NEXT_PUBLIC_REDIRECT_URI=$CALLBACK_URL"
echo ""
echo "✅ Cognito setup complete!"
