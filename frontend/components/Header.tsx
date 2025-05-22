'use client';

import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full p-4 bg-gray-100 dark:bg-gray-800 text-black dark:text-white flex justify-between items-center">
      <h1 className="text-xl font-mono">Crypto Dashboard</h1>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        className="bg-white dark:bg-gray-700 text-black dark:text-white border rounded px-2 py-1 font-mono"
      >
        <option value="light">☀️ Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="system">💻 System</option>
      </select>
    </header>
  );
}
