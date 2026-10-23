import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

/**
 * Custom React Hook to query workspace authentication status and execute login/logout actions
 * @returns {Object} Global session properties and operations
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be executed within a valid AuthProvider tree.');
  }
  return context;
}
