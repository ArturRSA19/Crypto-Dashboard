// frontend/pages/_app.tsx
import '../styles/globals.css'; // ou use '../styles/globals.css' se o alias "@" não estiver configurado
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
