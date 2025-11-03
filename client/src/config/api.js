// API Configuration
// Base URL for backend API
// NOTE: default to server's port used by the backend (5002) to match server/server.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

export const API_ENDPOINTS = {
  // Video endpoints
  VIDEOS: `${API_BASE_URL}/videos`,
  VIDEO_BY_ID: (id) => `${API_BASE_URL}/videos/${id}`,
  TRENDING_VIDEOS: `${API_BASE_URL}/videos/trending`,
  USER_VIDEOS: (userId) => `${API_BASE_URL}/videos/user/${userId}`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  
  // Interaction endpoints
  LIKE_VIDEO: (id) => `${API_BASE_URL}/videos/${id}/like`,
  COMMENT_VIDEO: (id) => `${API_BASE_URL}/videos/${id}/comments`,
  
  // AI endpoints
  GENERATE_CAPTION: `${API_BASE_URL}/ai/generate-caption`,
};

export default API_BASE_URL;
