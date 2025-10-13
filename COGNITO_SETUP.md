# AWS Cognito Authentication Setup

This guide explains how to set up AWS Cognito authentication for TrickShare.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured (optional but recommended)

## Step 1: Create Cognito User Pool

1. Go to AWS Cognito console
2. Click "Create user pool"
3. Configure sign-in options:
   - Select "Email" as sign-in option
   - Uncheck "Username"
4. Configure security requirements:
   - Password policy: Use default or customize
   - MFA: Optional (recommended for production)
5. Configure sign-up experience:
   - Enable self-registration
   - Required attributes: Email
   - Optional attributes: Name (recommended)
6. Configure message delivery:
   - Email: Use Cognito default or configure SES
7. Integrate your app:
   - User pool name: `TrickShare-Users`
   - App client name: `TrickShare-Web`
   - Don't generate client secret (for web apps)
8. Review and create

## Step 2: Configure Environment Variables

Copy `.env.local.example` to `.env.local` and update:

```env
# AWS Cognito Configuration
NEXT_PUBLIC_AWS_REGION=eu-west-1
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-west-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Update DynamoDB Schema (Optional)

The current implementation works with existing user data structure. For enhanced user management, consider adding:

- User profiles table
- User preferences
- Social features

## Features Implemented

### Authentication Flow
- ✅ Sign up with email verification
- ✅ Sign in with email/password
- ✅ Password reset
- ✅ Automatic session management
- ✅ Protected routes

### Integration Points
- ✅ Trick submission uses authenticated user data
- ✅ Kudos require authentication
- ✅ Comments require authentication
- ✅ User name displayed in header
- ✅ Redirect to login for protected actions

### UI/UX
- ✅ Themed login page matching app design
- ✅ Authentication guards for protected pages
- ✅ User status in header
- ✅ Seamless redirect after login

## Security Considerations

1. **Environment Variables**: Never commit real Cognito credentials to version control
2. **HTTPS**: Always use HTTPS in production
3. **Token Management**: Amplify handles token refresh automatically
4. **Rate Limiting**: Consider implementing rate limiting for auth endpoints

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `/login` to test authentication
3. Try signing up with a new email
4. Test protected actions (kudos, comments, trick submission)
5. Verify user data is properly associated with tricks

## Troubleshooting

### Common Issues

1. **"User pool does not exist"**: Check user pool ID in environment variables
2. **"Invalid client"**: Verify client ID and ensure no client secret is configured
3. **Email not verified**: Check email and spam folder for verification code
4. **Redirect loops**: Ensure returnUrl parameter is properly encoded

### Debug Mode

Add to your `.env.local` for debugging:
```env
NEXT_PUBLIC_DEBUG_AUTH=true
```

## Production Deployment

1. Set up Cognito user pool in production AWS account
2. Configure production environment variables in Vercel
3. Set up custom domain for Cognito (optional)
4. Configure email templates and branding
5. Set up monitoring and alerts

## Next Steps

Consider implementing:
- Social login (Google, Facebook)
- User profiles and preferences
- Admin panel for user management
- Advanced security features (device tracking, suspicious activity detection)