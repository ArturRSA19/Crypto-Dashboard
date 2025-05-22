// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Inter } from 'next/font/google';

// Importa e configura a fonte Inter
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.variable}>
      <ThemeProvider>
        <main className="font-sans">
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </div>
  );
}
