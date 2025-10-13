interface OIDCConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
}

const config: OIDCConfig = {
  domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '',
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/auth/callback'
};

export const getAuthUrl = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: 'openid email profile'
  });
  
  return `https://${config.domain}/oauth2/authorize?${params}`;
};

export const getLogoutUrl = () => {
  const params = new URLSearchParams({
    client_id: config.clientId,
    logout_uri: window.location.origin
  });
  
  return `https://${config.domain}/logout?${params}`;
};

export const exchangeCodeForTokens = async (code: string) => {
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  
  if (!response.ok) throw new Error('Token exchange failed');
  return response.json();
};

export const getUserInfo = async (accessToken: string) => {
  const response = await fetch(`https://${config.domain}/oauth2/userInfo`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!response.ok) throw new Error('Failed to get user info');
  return response.json();
};