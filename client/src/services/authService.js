import api from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Frontend Authentication API Service
 * Handles network requests to authentication routes.
 */
const authService = {
  /**
   * Submits register request to server
   * @param {Object} credentials
   * @param {string} credentials.username
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  async register({ username, email, password }) {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      username,
      email,
      password,
    });
    return response.data;
  },

  /**
   * Submits login request to server
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  async login({ email, password }) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Submits logout request to server
   */
  async logout() {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  /**
   * Submits token refresh request
   */
  async refreshToken() {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH);
    return response.data;
  },

  /**
   * Fetches active user details
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Submits email verification token
   * @param {string} token
   */
  async verifyEmail(token) {
    const response = await api.post(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}/${token}`);
    return response.data;
  },

  /**
   * Requests forgotten password link
   * @param {string} email
   */
  async forgotPassword(email) {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  /**
   * Resets password using token
   * @param {string} token
   * @param {string} password - New password
   */
  async resetPassword(token, password) {
    const response = await api.post(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, {
      password,
    });
    return response.data;
  },

  /**
   * Updates password inside active session
   * @param {Object} payload
   * @param {string} payload.currentPassword
   * @param {string} payload.newPassword
   */
  async changePassword({ currentPassword, newPassword }) {
    const response = await api.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Deletes user account and associated details
   */
  async deleteAccount() {
    const response = await api.delete(API_ENDPOINTS.AUTH.DELETE_ACCOUNT);
    return response.data;
  },
};

export default authService;
