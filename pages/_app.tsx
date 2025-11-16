import type { AppProps } from 'next/app';
import { AuthProvider } from '../components/AuthProvider';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';
import '../styles/kudos-button.css';
import '../styles/country-chain.css';
import '../styles/global-network.css';
import '../styles/card-layout-fix.css';
import '../styles/force-buttons-visible.css';
import '../styles/reddit-style-cards.css';
import '../styles/responsive-layout-fix.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  );
}
