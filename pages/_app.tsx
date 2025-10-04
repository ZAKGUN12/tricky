import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <nav className="nav">
        <Link 
          href="/" 
          className={`nav-btn ${router.pathname === '/' ? 'active' : ''}`}
        >
          🏠 Browse
        </Link>
        <Link 
          href="/submit" 
          className={`nav-btn ${router.pathname === '/submit' ? 'active' : ''}`}
        >
          ✨ Share
        </Link>
      </nav>
      <Component {...pageProps} />
    </>
  );
}
