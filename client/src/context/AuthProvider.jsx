import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './authContext';
import authService from '../services/authService';
import { setAccessToken } from '../services/api';

/**
 * Authentication Global Provider Component
 * Orchestrates session validation states and exposes lifecycle actions.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Checks session health by silently refreshing the session token on mount
  const checkSession = useCallback(async () => {
    try {
      // Trigger silent rotation via HttpOnly Cookie
      const response = await authService.refreshToken();
      const accessToken = response.data?.accessToken;
      
      if (accessToken) {
        setAccessToken(accessToken);
        
        // Fetch current user details
        const profile = await authService.getMe();
        setUser(profile.data.user);
        setIsAuthenticated(true);
      }
    } catch {
      // Refresh failed or no session active
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Auth Actions
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user: userProfile, accessToken } = response.data;
      
      setAccessToken(accessToken);
      setUser(userProfile);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.register({ username, email, password });
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      // Always reset client session state even if HTTP logout fails
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const getCurrentUser = useCallback(async () => {
    return await checkSession();
  }, [checkSession]);

  const refreshToken = async () => {
    const response = await authService.refreshToken();
    const accessToken = response.data?.accessToken;
    if (accessToken) {
      setAccessToken(accessToken);
    }
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loading: isLoading,
        login,
        register,
        logout,
        checkSession,
        getCurrentUser,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
