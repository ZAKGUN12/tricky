# Vercel Environment Variables

Add these environment variables in your Vercel dashboard:

## Required Environment Variables

```
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
```

## How to Add in Vercel:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable:
   - Name: `AWS_REGION`, Value: `eu-west-1`
   - Name: `AWS_ACCESS_KEY_ID`, Value: `your_access_key_here`
   - Name: `AWS_SECRET_ACCESS_KEY`, Value: `your_secret_key_here`

## Note:
- Use the same AWS credentials that work locally
- All API routes are configured to use eu-west-1 region
- After adding variables, redeploy the application
