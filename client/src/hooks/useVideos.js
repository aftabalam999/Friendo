import { useState, useEffect } from 'react';
import { videoService } from '../services/api';

// Custom hook for fetching videos
export const useVideos = (type = 'all') => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, [type]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (type === 'trending') {
        response = await videoService.getTrendingVideos();
      } else {
        response = await videoService.getAllVideos();
      }
      
      // Handle response format - could be direct array or wrapped in data property
      const data = response.data || response;
      setVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
      setVideos([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchVideos();
  };

  return { videos, loading, error, refetch };
};

// Custom hook for video interactions
export const useVideoInteractions = () => {
  const [loading, setLoading] = useState(false);

  const likeVideo = async (videoId) => {
    try {
      setLoading(true);
      await videoService.likeVideo(videoId);
    } catch (err) {
      console.error('Error liking video:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unlikeVideo = async (videoId) => {
    try {
      setLoading(true);
      await videoService.unlikeVideo(videoId);
    } catch (err) {
      console.error('Error unliking video:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (videoId, commentText) => {
    try {
      setLoading(true);
      const comment = await videoService.addComment(videoId, commentText);
      return comment;
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { likeVideo, unlikeVideo, addComment, loading };
};
