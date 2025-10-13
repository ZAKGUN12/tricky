# AWS Cognito CLI Setup

## Quick Setup

Run the automated setup script:

```bash
./setup-cognito.sh
```

This will:
1. ✅ Create Cognito User Pool
2. ✅ Create User Pool Client with OAuth settings
3. ✅ Configure domain for authentication
4. ✅ Output environment variables

## Manual Commands

If you prefer manual setup:

```bash
# 1. Create User Pool
aws cognito-idp create-user-pool \
  --pool-name "TrickShare-Users" \
  --region eu-west-1 \
  --auto-verified-attributes email \
  --username-attributes email

# 2. Create Client (replace USER_POOL_ID)
aws cognito-idp create-user-pool-client \
  --user-pool-id eu-west-1_xxxxxxxxx \
  --client-name "TrickShare-Web" \
  --generate-secret false \
  --callback-urls "https://tricky-peach.vercel.app/auth/callback" \
  --logout-urls "https://tricky-peach.vercel.app" \
  --allowed-o-auth-flows "code" \
  --allowed-o-auth-scopes "openid" "email" "profile" \
  --allowed-o-auth-flows-user-pool-client

# 3. Create Domain (replace USER_POOL_ID)
aws cognito-idp create-user-pool-domain \
  --domain "trickshare-auth" \
  --user-pool-id eu-west-1_xxxxxxxxx
```

## Environment Variables

After setup, add to `.env.local`:

```env
NEXT_PUBLIC_COGNITO_DOMAIN=trickshare-auth.auth.eu-west-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_REDIRECT_URI=https://tricky-peach.vercel.app/auth/callback
```
