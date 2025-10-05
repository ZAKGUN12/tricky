import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { awsConfig } from '../lib/aws-config';
import '../styles/globals.css';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsConfig);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <Authenticator.Provider>
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
        <Link 
          href="/profile" 
          className={`nav-btn ${router.pathname === '/profile' ? 'active' : ''}`}
        >
          👤 Profile
        </Link>
      </nav>
      <Component {...pageProps} />
    </Authenticator.Provider>
  );
}
