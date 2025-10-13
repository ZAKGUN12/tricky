import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';

function LoginContent() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      const returnUrl = router.query.returnUrl as string || '/';
      router.push(returnUrl);
    } else if (!loading) {
      // Redirect to custom signin page
      const returnUrl = router.query.returnUrl as string || '/';
      router.push(`/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>
  );
}

export default function Login() {
  return <LoginContent />;
}
