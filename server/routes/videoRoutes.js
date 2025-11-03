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
import { uploadMiddleware } from '../config/upload.js';

const router = express.Router();

// Video routes
router.get('/', optionalAuth, getAllVideos);
router.get('/trending', optionalAuth, getTrendingVideos);
router.get('/user/:userId', getUserVideos);
router.get('/:id', optionalAuth, getVideoById);

// Video upload route with improved error handling
router.post('/', verifyToken, uploadMiddleware, uploadVideo);

router.delete('/:id', verifyToken, deleteVideo);

// Interaction routes
router.post('/:id/like', verifyToken, likeVideo); // Like video (requires auth)
router.delete('/:id/like', verifyToken, unlikeVideo); // Unlike video (requires auth)
router.post('/:id/comments', verifyToken, addComment); // Add comment (requires auth)
router.get('/:id/comments', getComments); // Get comments

export default router;
