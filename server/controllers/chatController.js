import Message from '../models/Message.js';
import User from '../models/User.js';

// Send message
export const sendMessage = async (req, res) => {
  console.log('💬 Send message');
  
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.uid;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required',
      });
    }

    const [sender, receiver] = await Promise.all([
      User.findOne({ uid: senderId }),
      User.findOne({ uid: receiverId }),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if they are friends
    if (!sender.friends.includes(receiver._id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only send messages to friends',
      });
    }

    const message = await Message.create({
      sender: sender._id,
      senderId,
      receiver: receiver._id,
      receiverId,
      text: text.trim(),
      read: false,
    });

    await message.populate('sender receiver', 'uid displayName photoURL');

    console.log('✅ Message sent');
    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('❌ Send message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  console.log('📩 Get messages');
  
  try {
    const { friendId } = req.params;
    const userId = req.user.uid;
    const { limit = 50, before } = req.query;

    const user = await User.findOne({ uid: userId });
    const friend = await User.findOne({ uid: friendId });

    if (!user || !friend) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if they are friends
    if (!user.friends.includes(friend._id)) {
      return res.status(403).json({
        success: false,
        message: 'You can only view messages with friends',
      });
    }

    const query = {
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('sender receiver', 'uid displayName photoURL')
      .lean();

    // Mark messages as read
    await Message.updateMany(
      {
        senderId: friendId,
        receiverId: userId,
        read: false,
      },
      { read: true }
    );

    console.log(`✅ Found ${messages.length} messages`);
    return res.status(200).json({
      success: true,
      data: messages.reverse(), // Return in chronological order
    });
  } catch (error) {
    console.error('❌ Get messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get messages',
      error: error.message,
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  console.log('🔢 Get unread count');
  
  try {
    const userId = req.user.uid;

    const count = await Message.countDocuments({
      receiverId: userId,
      read: false,
    });

    console.log(`✅ Unread count: ${count}`);
    return res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error('❌ Get unread count error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message,
    });
  }
};

// Get chat list with last message
export const getChatList = async (req, res) => {
  console.log('💬 Get chat list');
  
  try {
    const userId = req.user.uid;

    const user = await User.findOne({ uid: userId })
      .populate('friends', 'uid displayName photoURL username')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get last message for each friend
    const chats = await Promise.all(
      user.friends.map(async (friend) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: userId, receiverId: friend.uid },
            { senderId: friend.uid, receiverId: userId },
          ],
        })
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await Message.countDocuments({
          senderId: friend.uid,
          receiverId: userId,
          read: false,
        });

        return {
          friend,
          lastMessage,
          unreadCount,
        };
      })
    );

    // Sort by last message time
    chats.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || 0;
      const bTime = b.lastMessage?.createdAt || 0;
      return new Date(bTime) - new Date(aTime);
    });

    console.log(`✅ Found ${chats.length} chats`);
    return res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    console.error('❌ Get chat list error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get chat list',
      error: error.message,
    });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  console.log('✓ Mark as read');
  
  try {
    const { friendId } = req.params;
    const userId = req.user.uid;

    await Message.updateMany(
      {
        senderId: friendId,
        receiverId: userId,
        read: false,
      },
      { read: true }
    );

    console.log('✅ Messages marked as read');
    return res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    console.error('❌ Mark as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message,
    });
  }
};
