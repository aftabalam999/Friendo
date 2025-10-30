import axios from 'axios';
import API_BASE_URL from '../config/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          if (response.data.success) {
            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Video Service - Handles all video-related API calls
export const videoService = {
  // Get all videos for feed
  getAllVideos: async () => {
    const response = await api.get('/videos');
    return response.data;
  },

  // Get trending videos
  getTrendingVideos: async () => {
    const response = await api.get('/videos/trending');
    return response.data;
  },

  // Get single video by ID
  getVideoById: async (id) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  // Get videos by user ID
  getUserVideos: async (userId) => {
    const response = await api.get(`/videos/user/${userId}`);
    return response.data;
  },

  // Upload new video
  uploadVideo: async (formData, config = {}) => {
    const response = await api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config, // Allow passing onUploadProgress and other config
    });
    return response.data;
  },

  // Like a video
  likeVideo: async (videoId) => {
    const response = await api.post(`/videos/${videoId}/like`);
    return response.data;
  },

  // Unlike a video
  unlikeVideo: async (videoId) => {
    const response = await api.delete(`/videos/${videoId}/like`);
    return response.data;
  },

  // Add comment to video
  addComment: async (videoId, commentText) => {
    const response = await api.post(`/videos/${videoId}/comments`, {
      text: commentText,
    });
    return response.data;
  },

  // Get comments for a video
  getComments: async (videoId) => {
    const response = await api.get(`/videos/${videoId}/comments`);
    return response.data;
  },

  // Delete a video
  deleteVideo: async (videoId) => {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  },
};

// User Service - Handles user-related API calls
export const userService = {
  // Get user profile by UID
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      console.log('Updating profile for user:', userId);
      console.log('Profile data:', profileData);
      
      const response = await api.put(`/users/${userId}`, profileData);
      console.log('Update profile response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Upload profile image
  uploadProfileImage: async (userId, formData) => {
    try {
      console.log('Uploading profile image for user:', userId);
      
      const response = await api.post(`/users/${userId}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Upload image response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload image error:', error.response?.data || error.message);
      throw error;
    }
  },
};

// AI Service - Handles AI caption generation
export const aiService = {
  // Generate caption and hashtags using OpenAI
  generateCaption: async (videoTitle) => {
    const response = await api.post('/ai/generate-caption', {
      title: videoTitle,
    });
    return response.data;
  },
};

// Friend Service - Handles friend-related API calls
export const friendService = {
  // Search users
  searchUsers: async (query) => {
    try {
      const response = await api.get(`/friends/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search users error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Send friend request
  sendFriendRequest: async (receiverId) => {
    try {
      const response = await api.post('/friends/requests', { receiverId });
      return response.data;
    } catch (error) {
      console.error('Send friend request error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get pending requests (received)
  getPendingRequests: async () => {
    try {
      const response = await api.get('/friends/requests/pending');
      return response.data;
    } catch (error) {
      console.error('Get pending requests error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get sent requests
  getSentRequests: async () => {
    try {
      const response = await api.get('/friends/requests/sent');
      return response.data;
    } catch (error) {
      console.error('Get sent requests error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId) => {
    try {
      const response = await api.put(`/friends/requests/${requestId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Accept friend request error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Reject friend request
  rejectFriendRequest: async (requestId) => {
    try {
      const response = await api.put(`/friends/requests/${requestId}/reject`);
      return response.data;
    } catch (error) {
      console.error('Reject friend request error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get friends list
  getFriendsList: async () => {
    try {
      const response = await api.get('/friends');
      return response.data;
    } catch (error) {
      console.error('Get friends list error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Remove friend
  removeFriend: async (friendId) => {
    try {
      const response = await api.delete(`/friends/${friendId}`);
      return response.data;
    } catch (error) {
      console.error('Remove friend error:', error.response?.data || error.message);
      throw error;
    }
  },
};

// Chat Service - Handles chat-related API calls
export const chatService = {
  // Send message
  sendMessage: async (receiverId, text) => {
    try {
      const response = await api.post('/chat/messages', { receiverId, text });
      return response.data;
    } catch (error) {
      console.error('Send message error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get messages with a friend
  getMessages: async (friendId, limit = 50, before = null) => {
    try {
      let url = `/chat/messages/${friendId}?limit=${limit}`;
      if (before) {
        url += `&before=${before}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get chat list
  getChatList: async () => {
    try {
      const response = await api.get('/chat/list');
      return response.data;
    } catch (error) {
      console.error('Get chat list error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/chat/unread-count');
      return response.data;
    } catch (error) {
      console.error('Get unread count error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Mark messages as read
  markAsRead: async (friendId) => {
    try {
      const response = await api.put(`/chat/messages/${friendId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default api;
