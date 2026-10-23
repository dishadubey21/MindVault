import { useState, useEffect } from 'react';
import { STORAGE_KEYS, THEME } from '../constants';
import { ThemeContext } from './themeContext';

/**
 * Theme State Provider Component
 * Exposes theme toggles and mounts DOM color attributes.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === THEME.LIGHT || savedTheme === THEME.DARK) {
      return savedTheme;
    }
    // Fallback to system preference query
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? THEME.DARK : THEME.LIGHT;
  });

  useEffect(() => {
    // Apply theme to document element to mount CSS selectors
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    // Persist choice in local storage
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
