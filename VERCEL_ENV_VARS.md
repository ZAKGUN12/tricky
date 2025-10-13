# Vercel Environment Variables

Add these to your Vercel project settings:

```env
NEXT_PUBLIC_COGNITO_DOMAIN=trickshare-auth.auth.eu-west-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=7ce3588lqfcmq6ckedmlui6i9e
NEXT_PUBLIC_REDIRECT_URI=https://tricky-six.vercel.app/auth/callback
AWS_REGION=eu-west-1
```

## How to add in Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above
5. Redeploy your application

## Updated Cognito Configuration:
- ✅ Callback URL: `https://tricky-six.vercel.app/auth/callback`
- ✅ Logout URL: `https://tricky-six.vercel.app`
- ✅ OAuth flows: Authorization code
- ✅ Scopes: openid, email, profile
