# AWS Cognito OIDC Implementation

## 🔐 Overview
TrickShare now implements secure authentication using AWS Cognito with OpenID Connect (OIDC) protocol, providing enterprise-grade security and seamless user experience.

## 🏗️ Architecture Components

### 1. **Cognito OIDC Client** (`/lib/cognito-oidc.ts`)
- Centralized authentication logic
- Token management (access, ID, refresh)
- User session handling
- OAuth 2.0 / OIDC flow implementation

### 2. **Enhanced Auth Provider** (`/components/CognitoAuthProvider.tsx`)
- React context for authentication state
- Automatic token refresh
- Auth event listeners
- Protected route HOC

### 3. **Auth Callback Handler** (`/pages/auth/callback.tsx`)
- Handles OAuth callback
- Token exchange
- User info retrieval
- Secure token storage

### 4. **Login Interface** (`/pages/login.tsx`)
- Modern UI with Global Network theme
- Cognito OAuth redirect
- Loading states and error handling

## 🚀 Setup Instructions

### Step 1: AWS Cognito Configuration

1. **Create User Pool**
```bash
aws cognito-idp create-user-pool \
  --pool-name "TrickShare-Users" \
  --region eu-west-1 \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": false
    }
  }'
```

2. **Create User Pool Client**
```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id eu-west-1_xxxxxxxxx \
  --client-name "TrickShare-Web" \
  --generate-secret false \
  --supported-identity-providers "COGNITO" \
  --callback-urls "http://localhost:3000/auth/callback,https://your-domain.com/auth/callback" \
  --logout-urls "http://localhost:3000,https://your-domain.com" \
  --allowed-o-auth-flows "code" \
  --allowed-o-auth-scopes "openid,email,profile" \
  --allowed-o-auth-flows-user-pool-client
```

3. **Create Identity Pool**
```bash
aws cognito-identity create-identity-pool \
  --identity-pool-name "TrickShare-Identity" \
  --allow-unauthenticated-identities false \
  --cognito-identity-providers '[{
    "ProviderName": "cognito-idp.eu-west-1.amazonaws.com/eu-west-1_xxxxxxxxx",
    "ClientId": "xxxxxxxxxxxxxxxxxxxxxxxxxx"
  }]'
```

4. **Configure Domain**
```bash
aws cognito-idp create-user-pool-domain \
  --domain "trickshare-auth" \
  --user-pool-id eu-west-1_xxxxxxxxx
```

### Step 2: Environment Configuration

Create `.env.local`:
```env
# AWS Cognito OIDC Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=eu-west-1_xxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_DOMAIN=trickshare-auth.auth.eu-west-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=eu-west-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_AWS_REGION=eu-west-1
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

### Step 3: Application Integration

Update `_app.tsx`:
```typescript
import { CognitoAuthProvider } from '../components/CognitoAuthProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CognitoAuthProvider>
      <Component {...pageProps} />
    </CognitoAuthProvider>
  );
}
```

## 🔄 Authentication Flow

### 1. **Login Process**
```
User clicks "Sign In" → Redirect to Cognito → User authenticates → 
Callback with code → Exchange for tokens → Store securely → Redirect to app
```

### 2. **Token Management**
- **Access Token**: API authentication (1 hour expiry)
- **ID Token**: User information (1 hour expiry)
- **Refresh Token**: Token renewal (30 days expiry)

### 3. **Session Handling**
- Automatic token refresh
- Secure storage in localStorage
- Auth state synchronization

## 🛡️ Security Features

### OAuth 2.0 / OIDC Compliance
- ✅ Authorization Code flow with PKCE
- ✅ State parameter for CSRF protection
- ✅ Secure token exchange
- ✅ JWT token validation

### Token Security
- ✅ Short-lived access tokens (1 hour)
- ✅ Secure refresh mechanism
- ✅ Automatic token cleanup on logout
- ✅ HTTPS-only in production

### User Data Protection
- ✅ Minimal data collection (email, name)
- ✅ GDPR compliant (EU region)
- ✅ Encrypted data transmission
- ✅ Secure session management

## 🔧 API Integration

### Protected API Endpoints
```typescript
// Middleware for protected routes
export async function authenticateRequest(req: NextApiRequest): Promise<CognitoUser | null> {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  
  // Verify JWT token with Cognito
  return await CognitoOIDC.verifyToken(token);
}
```

### Frontend Usage
```typescript
// Get authenticated user
const { user, isAuthenticated } = useCognitoAuth();

// Make authenticated API calls
const token = await getAccessToken();
const response = await fetch('/api/protected', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## 🚀 Deployment Considerations

### Production Environment
- Update callback URLs for production domain
- Configure HTTPS-only cookies
- Set up proper CORS policies
- Enable CloudWatch logging

### Monitoring & Analytics
- Track authentication events
- Monitor token refresh rates
- Set up security alerts
- User activity analytics

## 🔍 Testing

### Local Development
```bash
npm run dev
# Navigate to http://localhost:3000/login
# Test OAuth flow with Cognito
```

### Integration Tests
```typescript
// Test authentication flow
describe('Cognito OIDC', () => {
  it('should redirect to Cognito for authentication', () => {
    // Test implementation
  });
});
```

## 📞 Support & Troubleshooting

### Common Issues
1. **Invalid redirect URI**: Check callback URL configuration
2. **Token expired**: Implement proper refresh logic
3. **CORS errors**: Configure Cognito domain settings
4. **User not found**: Check user pool configuration

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('aws-amplify-debug', 'true');
```

## 🔄 Migration from Previous Auth

### Data Migration
- Export existing user data
- Create users in Cognito
- Map user attributes
- Update database references

### Gradual Rollout
- Feature flag for new auth
- Parallel authentication systems
- User migration prompts
- Fallback mechanisms

This implementation provides enterprise-grade security while maintaining the seamless user experience expected in modern web applications.
