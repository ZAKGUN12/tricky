// Production Cognito OIDC configuration
export const getCognitoAuthUrl = () => {
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  
  // Fallback values if env vars not set
  const fallbackDomain = 'trickshare-auth.auth.eu-west-1.amazoncognito.com';
  const fallbackClientId = '7ce3588lqfcmq6ckedmlui6i9e';
  const fallbackRedirectUri = 'https://tricky-six.vercel.app/auth/callback';
  
  const finalDomain = domain || fallbackDomain;
  const finalClientId = clientId || fallbackClientId;
  const finalRedirectUri = redirectUri || fallbackRedirectUri;
  
  if (!finalDomain || !finalClientId || !finalRedirectUri) {
    console.error('Missing Cognito configuration');
    return '/login';
  }
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: finalClientId,
    redirect_uri: finalRedirectUri,
    scope: 'openid email profile',
    state: Math.random().toString(36).substring(7)
  });
  
  return `https://${finalDomain}/oauth2/authorize?${params}`;
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
