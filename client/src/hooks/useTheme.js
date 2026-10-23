import { useContext } from 'react';
import { ThemeContext } from '../context/themeContext';

/**
 * Custom React Hook to access theme variables and theme toggles
 * @returns {{ theme: string, toggleTheme: function }} Theme data and actions
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be executed within a valid ThemeProvider tree.');
  }
  return context;
}
