// frontend/pages/_app.tsx
import '../styles/globals.css'; // ou use '../styles/globals.css' se o alias "@" não estiver configurado
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext'; // ou use '../contexts/ThemeContext' se o alias "@" não estiver configurado

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
