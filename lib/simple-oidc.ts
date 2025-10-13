// Simple OIDC helper functions
export const getAuthUrl = () => {
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/auth/callback';
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId || '',
    redirect_uri: redirectUri,
    scope: 'openid email profile'
  });
  
  return `https://${domain}/oauth2/authorize?${params}`;
};

export const getLogoutUrl = () => {
  const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  const logoutUri = typeof window !== 'undefined' ? window.location.origin : '';
  
  const params = new URLSearchParams({
    client_id: clientId || '',
    logout_uri: logoutUri
  });
  
  return `https://${domain}/logout?${params}`;
};
