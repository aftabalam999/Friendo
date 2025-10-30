import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  getAllUsers,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import uploadProfile from '../config/profileUpload.js';

const router = express.Router();

// User routes
router.get('/', getAllUsers); // Get all users (for search)
router.post('/:userId/photo', verifyToken, uploadProfile.single('profileImage'), uploadProfileImage); // Upload profile image (must be before /:userId)
router.get('/:userId', getUserProfile); // Get user profile by ID
router.put('/:userId', verifyToken, updateUserProfile); // Update user profile (requires auth)

export default router;
