export async function exchangeCodeForTokens(code: string) {
  const response = await fetch('/api/auth/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  
  if (!response.ok) {
    throw new Error('Token exchange failed');
  }
  
  return response.json();
}
