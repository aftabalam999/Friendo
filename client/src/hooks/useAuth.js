import { useState, useEffect } from 'react';
import authService from '../services/authService';
import { userService } from '../services/api';
import socketService from '../config/socket';

// Custom hook for JWT Authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to refresh user data from backend
  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          // Create a new object reference to ensure React detects the change
          const newUser = { ...userData };
          setUser(newUser);
          return newUser;
        }
      } catch (err) {
        console.error('Error refreshing user:', err);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const accessToken = authService.getAccessToken();

        if (storedUser && accessToken) {
          // Verify token and get fresh user data
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            // Connect socket when user is authenticated
            socketService.connect(userData.id);
          } else {
            // Token invalid, clear storage
            authService.logout();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sign up with email and password
  const signUpWithEmail = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      
      const { user: userData } = await authService.register(email, password, displayName);
      setUser(userData);
      
      // Connect socket
      socketService.connect(userData.id);
      
      return userData;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const { user: userData } = await authService.login(email, password);
      setUser(userData);
      
      // Connect socket
      socketService.connect(userData.id);
      
      // Force a state update to trigger re-renders
      setLoading(false);
      
      return userData;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      
      console.log('🚪 Logging out...');
      
      // Disconnect socket
      socketService.disconnect();
      
      // Clear user state immediately
      setUser(null);
      
      // Clear storage
      await authService.logout();
      
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('❌ Logout error:', err);
      setError(err.message);
      // Even if there's an error, clear the user state
      setUser(null);
      authService.logout();
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    logout,
    refreshUser,
  };
};
