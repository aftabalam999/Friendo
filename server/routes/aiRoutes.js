import express from 'express';
import { generateCaption } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// AI routes
router.post('/generate-caption', verifyToken, generateCaption); // Generate caption using AI (requires auth)

export default router;
