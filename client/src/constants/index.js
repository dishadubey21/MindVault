/**
 * Centralized Client Application Constants
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  ARCHIVE: '/archive',
  TRASH: '/trash',
  FAVORITES: '/favorites',
  SETTINGS: '/settings',
};

export const STORAGE_KEYS = {
  THEME: 'mindvault_theme',
  USER: 'mindvault_user',
};

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const LIMITS = {
  MAX_NOTE_TITLE_LENGTH: 100,
  AUTO_SAVE_DEBOUNCE_MS: 1000,
};

export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    DELETE_ACCOUNT: '/auth/delete-account',
  },
  NOTES: {
    BASE: '/notes',
    PIN: (id) => `/notes/${id}/pin`,
    FAVORITE: (id) => `/notes/${id}/favorite`,
    ARCHIVE: (id) => `/notes/${id}/archive`,
    RESTORE: (id) => `/notes/${id}/restore`,
    FORCE_DELETE: (id) => `/notes/${id}/force`,
  },
  ATTACHMENTS: {
    BASE: '/attachments',
    UPLOAD: '/attachments/upload',
  },
  PAYMENTS: {
    BASE: '/payments',
    ORDER: '/payments/order',
    VERIFY: '/payments/verify',
    HISTORY: '/payments/history',
  },
};

export const MESSAGES = {
  COMMON: {
    LOADING: 'Loading...',
    SAVING: 'Saving note...',
    SAVED: 'All changes saved.',
    ERROR_OCCURRED: 'An unexpected error occurred. Please try again.',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORD_STRENGTH: 'Password must be at least 8 characters and contain uppercase, lowercase, numbers, and special characters.',
  },
};
