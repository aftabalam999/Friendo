import express from 'express';
import {
  sendMessage,
  getMessages,
  getUnreadCount,
  getChatList,
  markAsRead,
} from '../controllers/chatController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Chat routes
router.post('/messages', sendMessage);
router.get('/messages/:friendId', getMessages);
router.put('/messages/:friendId/read', markAsRead);
router.get('/unread-count', getUnreadCount);
router.get('/list', getChatList);

export default router;
