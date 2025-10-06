import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { awsConfig } from '../lib/aws-config';
import '../styles/globals.css';
import '../styles/modern.css';
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify
Amplify.configure(awsConfig);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
