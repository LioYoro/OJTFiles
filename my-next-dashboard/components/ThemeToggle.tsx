'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setDark(true);
        document.documentElement.classList.add('dark');
        return;
      }
      if (savedTheme === 'light') {
        setDark(false);
        document.documentElement.classList.remove('dark');
        return;
      }
      // no saved preference -> follow system
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setDark(true);
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    try {
      if (dark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
      setDark(prev => !prev);
    } catch (e) {
      // ignore storage errors
    }
  };

  return (
    <button onClick={toggleTheme} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
