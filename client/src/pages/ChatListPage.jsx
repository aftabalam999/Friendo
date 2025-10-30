import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiSearch } from 'react-icons/fi';
import { chatService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import socketService from '../config/socket';
import { format } from 'date-fns';

const ChatListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (user) {
      fetchChatList();
      setupSocketListeners();
    }

    return () => {
      socketService.off('message:receive');
      socketService.off('user:status');
    };
  }, [user]);

  const fetchChatList = async () => {
    try {
      setLoading(true);
      const response = await chatService.getChatList();
      setChats(response.data || []);
    } catch (error) {
      console.error('Error fetching chat list:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.connect(user.id);

    // Listen for new messages
    socketService.on('message:receive', () => {
      fetchChatList(); // Refresh chat list when new message arrives
    });

    // Listen for online status
    socketService.on('user:status', ({ userId, online }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (online) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });
  };

  const formatLastMessageTime = (date) => {
    if (!date) return '';
    
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now - messageDate;

    // Less than a minute
    if (diff < 60000) return 'Just now';
    
    // Less than an hour
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `${mins}m`;
    }

    // Same day
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'h:mm a');
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // This week
    if (diff < 604800000) {
      return format(messageDate, 'EEE');
    }

    // Older
    return format(messageDate, 'MMM d');
  };

  const truncateMessage = (text, maxLength = 40) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen pt-16 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Messages</h1>
          <p className="text-gray-400">Chat with your friends</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-3 glass rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </motion.div>

        {/* Chat List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No conversations yet</p>
            <button
              onClick={() => navigate('/friends')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transition"
            >
              Find Friends
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => {
              const isOnline = onlineUsers.has(chat.friend.uid);
              
              return (
                <motion.div
                  key={chat.friend._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/chat/${chat.friend.uid}`)}
                  className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-dark-700/50 cursor-pointer transition group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative">
                      <img
                        src={chat.friend.photoURL || '/default-avatar.png'}
                        alt={chat.friend.displayName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                      />
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-900" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white group-hover:text-primary transition">
                          {chat.friend.displayName}
                        </h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {formatLastMessageTime(chat.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400 truncate">
                          {chat.lastMessage 
                            ? truncateMessage(chat.lastMessage.text) 
                            : 'Start a conversation'}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="ml-2 px-2 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListPage;
