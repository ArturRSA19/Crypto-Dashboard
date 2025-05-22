'use client';

import { useTheme } from '../contexts/ThemeContext';
import { SunMoon, Moon, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleGithubClick = () => {
    open('https://github.com/ArturRSA19/Crypto-Dashboard', '_blank');
  };

  return (
    <header className="w-full px-6 py-4 bg-background text-foreground flex justify-between items-center border-b">
      <h1 className="text-xl font-bold">Crypto Dashboard</h1>

      <div className="flex items-center gap-2">

        {/* GitHub */}
        <button
          onClick={handleGithubClick}
          className="flex items-center justify-center w-10 h-10 rounded-md border border-input bg-transparent hover:bg-accent transition-colors"
        >
          <Github className="h-5 w-5" />
        </button>

        {/* Tema */}
        <button
          onClick={toggleTheme}
          className="relative flex items-center justify-center w-10 h-10 rounded-md border border-input bg-transparent hover:bg-accent transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? 'moon' : 'sunmoon'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              {isDark ? <Moon className="h-5 w-5" /> : <SunMoon className="h-5 w-5" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
