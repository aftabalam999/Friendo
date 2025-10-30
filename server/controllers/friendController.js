import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';

// Send friend request
export const sendFriendRequest = async (req, res) => {
  console.log('👥 Send friend request');
  
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a friend request to yourself',
      });
    }

    // Check if users exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already friends
    if (sender.friends.includes(receiver._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already friends',
      });
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: 'pending' },
        { sender: receiverId, receiver: senderId, status: 'pending' },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Friend request already exists',
      });
    }

    // Create friend request
    const friendRequest = await FriendRequest.create({
      sender: senderId,
      senderId,
      receiver: receiverId,
      receiverId,
      status: 'pending',
    });

    await friendRequest.populate('sender receiver', 'displayName photoURL username email');

    console.log('✅ Friend request sent');
    return res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      data: friendRequest,
    });
  } catch (error) {
    console.error('❌ Send friend request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send friend request',
      error: error.message,
    });
  }
};

// Get pending friend requests (received)
export const getPendingRequests = async (req, res) => {
  console.log('📨 Get pending requests');
  
  try {
    const userId = req.user.id; // JWT MongoDB _id

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const requests = await FriendRequest.find({
      receiver: user._id,
      status: 'pending',
    })
      .populate('sender', 'displayName photoURL username email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${requests.length} pending requests`);
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('❌ Get pending requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get pending requests',
      error: error.message,
    });
  }
};

// Get sent friend requests
export const getSentRequests = async (req, res) => {
  console.log('📤 Get sent requests');
  
  try {
    const userId = req.user.id; // JWT MongoDB _id

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const requests = await FriendRequest.find({
      sender: user._id,
      status: 'pending',
    })
      .populate('receiver', 'displayName photoURL username email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${requests.length} sent requests`);
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('❌ Get sent requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get sent requests',
      error: error.message,
    });
  }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
  console.log('✅ Accept friend request');
  
  try {
    const { requestId } = req.params;
    const userId = req.user.id; // JWT MongoDB _id

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found',
      });
    }

    // Check if current user is the receiver
    if (friendRequest.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request already processed',
      });
    }

    // Update request status
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Add each other as friends
    await Promise.all([
      User.findByIdAndUpdate(
        friendRequest.sender,
        { $addToSet: { friends: friendRequest.receiver } }
      ),
      User.findByIdAndUpdate(
        friendRequest.receiver,
        { $addToSet: { friends: friendRequest.sender } }
      ),
    ]);

    await friendRequest.populate('sender receiver', 'displayName photoURL username email');

    console.log('✅ Friend request accepted');
    return res.status(200).json({
      success: true,
      message: 'Friend request accepted',
      data: friendRequest,
    });
  } catch (error) {
    console.error('❌ Accept friend request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to accept friend request',
      error: error.message,
    });
  }
};

// Reject friend request
export const rejectFriendRequest = async (req, res) => {
  console.log('❌ Reject friend request');
  
  try {
    const { requestId } = req.params;
    const userId = req.user.id; // JWT MongoDB _id

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found',
      });
    }

    // Check if current user is the receiver
    if (friendRequest.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request already processed',
      });
    }

    // Update request status
    friendRequest.status = 'rejected';
    await friendRequest.save();

    console.log('✅ Friend request rejected');
    return res.status(200).json({
      success: true,
      message: 'Friend request rejected',
      data: friendRequest,
    });
  } catch (error) {
    console.error('❌ Reject friend request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject friend request',
      error: error.message,
    });
  }
};

// Get friends list
export const getFriendsList = async (req, res) => {
  console.log('👥 Get friends list');
  
  try {
    const userId = req.user.id; // JWT MongoDB _id

    const user = await User.findById(userId)
      .populate('friends', 'displayName photoURL username email')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Add id field for each friend
    const friends = (user.friends || []).map(friend => ({
      ...friend,
      id: friend._id,
    }));

    console.log(`✅ Found ${friends.length} friends`);
    return res.status(200).json({
      success: true,
      data: friends,
    });
  } catch (error) {
    console.error('❌ Get friends list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get friends list',
      error: error.message,
    });
  }
};

// Search users
export const searchUsers = async (req, res) => {
  console.log('🔍 Search users');
  
  try {
    const { query } = req.query;
    const userId = req.user.id; // JWT MongoDB _id

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    const users = await User.find({
      _id: { $ne: userId }, // Exclude current user
      $or: [
        { displayName: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .select('displayName photoURL username bio email')
      .limit(20)
      .lean();

    // Add id field for each user
    const usersWithId = users.map(user => ({
      ...user,
      id: user._id,
    }));

    console.log(`✅ Found ${usersWithId.length} users matching "${query}"`);
    return res.status(200).json({
      success: true,
      data: usersWithId,
    });
  } catch (error) {
    console.error('❌ Search users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message,
    });
  }
};

// Remove friend
export const removeFriend = async (req, res) => {
  console.log('🗑️ Remove friend');
  
  try {
    const { friendId } = req.params;
    const userId = req.user.id; // JWT MongoDB _id

    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId),
    ]);

    if (!user || !friend) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove from friends list
    await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $pull: { friends: friend._id } }
      ),
      User.findByIdAndUpdate(
        friendId,
        { $pull: { friends: user._id } }
      ),
    ]);

    console.log('✅ Friend removed');
    return res.status(200).json({
      success: true,
      message: 'Friend removed successfully',
    });
  } catch (error) {
    console.error('❌ Remove friend error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove friend',
      error: error.message,
    });
  }
};
