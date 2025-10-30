import api from './api';

/**
 * JWT Authentication Service
 * Handles user authentication without Firebase
 */

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// Register new user
export const register = async (email, password, displayName) => {
  try {
    const response = await api.post('/auth/register', {
      email,
      password,
      displayName,
    });

    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      
      // Store tokens and user data
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return { user, accessToken, refreshToken };
    }
    
    throw new Error(response.data.message || 'Registration failed');
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle network errors
    if (!error.response) {
      throw new Error('Network error. Please check your connection and make sure the server is running.');
    }
    
    // Handle validation errors from backend
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    throw new Error(errorMessage);
  }
};

// Login existing user
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      
      // Store tokens and user data
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      return { user, accessToken, refreshToken };
    }
    
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle network errors
    if (!error.response) {
      throw new Error('Network error. Please check your connection and make sure the server is running.');
    }
    
    // Handle validation errors from backend
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

// Logout user
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Refresh access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh-token', {
      refreshToken,
    });

    if (response.data.success) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      
      localStorage.setItem(TOKEN_KEY, accessToken);
      if (newRefreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      }
      
      return accessToken;
    }
    
    throw new Error('Token refresh failed');
  } catch (error) {
    // If refresh fails, logout user
    logout();
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    
    if (response.data.success) {
      const user = response.data.data;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Get stored user data
export const getStoredUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};

const authService = {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  isAuthenticated,
};

export default authService;
