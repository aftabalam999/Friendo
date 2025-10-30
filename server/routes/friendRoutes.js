import express from 'express';
import {
  sendFriendRequest,
  getPendingRequests,
  getSentRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
  searchUsers,
  removeFriend,
} from '../controllers/friendController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Search users
router.get('/search', searchUsers);

// Friend request routes
router.post('/requests', sendFriendRequest);
router.get('/requests/pending', getPendingRequests);
router.get('/requests/sent', getSentRequests);
router.put('/requests/:requestId/accept', acceptFriendRequest);
router.put('/requests/:requestId/reject', rejectFriendRequest);

// Friends list
router.get('/', getFriendsList);
router.delete('/:friendId', removeFriend);

export default router;
