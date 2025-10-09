import type { AppProps } from 'next/app';
import { Authenticator } from '@aws-amplify/ui-react';
import { AuthProvider } from '../components/AuthProvider';
import '../lib/aws-config';
import '../styles/globals.css';
import '@aws-amplify/ui-react/styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator.Provider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Authenticator.Provider>
  );
}
