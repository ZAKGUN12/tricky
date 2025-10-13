// Production Cognito OIDC configuration
export const getCognitoAuthUrl = () => {
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  
  if (!domain || !clientId || !redirectUri) {
    console.error('Missing Cognito configuration');
    return '/login';
  }
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid email profile',
    state: Math.random().toString(36).substring(7)
  });
  
  return `https://${domain}/oauth2/authorize?${params}`;
};

export const getCognitoLogoutUrl = () => {
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  const logoutUri = typeof window !== 'undefined' ? window.location.origin : '';
  
  if (!domain || !clientId) {
    return '/';
  }
  
  const params = new URLSearchParams({
    client_id: clientId,
    logout_uri: logoutUri
  });
  
  return `https://${domain}/logout?${params}`;
};

export const exchangeCodeForTokens = async (code: string) => {
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Token exchange failed');
  }
  
  return response.json();
};
