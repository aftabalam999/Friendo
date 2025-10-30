import express from 'express';
import {
  getAllVideos,
  getTrendingVideos,
  getVideoById,
  getUserVideos,
  uploadVideo,
  likeVideo,
  unlikeVideo,
  addComment,
  getComments,
  deleteVideo,
} from '../controllers/videoController.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';
import upload from '../config/upload.js';

const router = express.Router();

// Video routes
router.get('/', optionalAuth, getAllVideos); // Get all videos (optional auth for personalization)
router.get('/trending', optionalAuth, getTrendingVideos); // Get trending videos
router.get('/user/:userId', getUserVideos); // Get videos by user ID
router.get('/:id', optionalAuth, getVideoById); // Get single video by ID
router.post('/', verifyToken, upload.single('video'), uploadVideo); // Upload new video with file (requires auth)
router.delete('/:id', verifyToken, deleteVideo); // Delete video (requires auth)

// Interaction routes
router.post('/:id/like', verifyToken, likeVideo); // Like video (requires auth)
router.delete('/:id/like', verifyToken, unlikeVideo); // Unlike video (requires auth)
router.post('/:id/comments', verifyToken, addComment); // Add comment (requires auth)
router.get('/:id/comments', getComments); // Get comments

export default router;
