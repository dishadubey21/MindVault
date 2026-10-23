import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

// In-Memory cache for the short-lived access token
let memoryToken = null;

/**
 * Updates the in-memory access token.
 * @param {string|null} token - The access token or null to clear it
 */
export const setAccessToken = (token) => {
  memoryToken = token;
};

/**
 * Retrieves the in-memory access token.
 * @returns {string|null} The cached token
 */
export const getAccessToken = () => {
  return memoryToken;
};

// Create configured Axios instance
const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permits cookie exchange for refresh rotation
});

// Request Interceptor: Injects Access Token from memory into HTTP Headers
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unifies error payloads and automates token rotation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Normalizes error schema returned by the backend global handler
    const parsedError = {
      message: error.response?.data?.message || 'A server communication error occurred.',
      statusCode: error.response?.status || 500,
      errorCode: error.response?.data?.errorCode || 'NETWORK_ERROR',
      errors: error.response?.data?.errors || [],
      raw: error,
    };

    // Intercepts expired token events to perform silent refresh rotation
    if (
      error.response?.status === 401 &&
      error.response?.data?.errorCode === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Post request to refresh endpoint. Axios automatically includes the HttpOnly cookie
        const refreshResponse = await axios.post(
          `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (newAccessToken) {
          // Cache the fresh access token in memory
          setAccessToken(newAccessToken);
          
          // Re-attempt original request with the fresh token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch {
        // Trigger manual session cleanup
        setAccessToken(null);
        return Promise.reject({
          ...parsedError,
          message: 'Your login session has expired. Please sign in again.',
          errorCode: 'SESSION_EXPIRED',
        });
      }
    }

    return Promise.reject(parsedError);
  }
);

export default api;
