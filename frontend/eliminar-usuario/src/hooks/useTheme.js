import { useState, useEffect } from 'react';

const STORAGE_KEY = 'navops_theme';

/**
 * useTheme
 * Manages light/dark mode toggle.
 * Persists preference in localStorage.
 * Applies [data-theme] attribute to document root.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const isDark = theme === 'dark';

  return { theme, isDark, toggleTheme };
}
