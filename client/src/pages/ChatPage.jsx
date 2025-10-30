import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiArrowLeft, FiMoreVertical } from 'react-icons/fi';
import { chatService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import socketService from '../config/socket';
import { format } from 'date-fns';

const ChatPage = () => {
  const { friendId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (user && friendId) {
      fetchMessages();
      setupSocketListeners();
    }

    return () => {
      // Cleanup socket listeners
      socketService.off('message:receive');
      socketService.off('typing:start');
      socketService.off('typing:stop');
      socketService.off('user:status');
    };
  }, [user, friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await chatService.getMessages(friendId);
      setMessages(response.data || []);
      
      // Get friend info from first message
      if (response.data && response.data.length > 0) {
        const firstMessage = response.data[0];
        const friendData = firstMessage.sender?.uid === friendId 
          ? firstMessage.sender 
          : firstMessage.receiver;
        setFriend(friendData);
      }

      // Mark messages as read
      await chatService.markAsRead(friendId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Connect socket
    socketService.connect(user.id);

    // Listen for new messages
    socketService.on('message:receive', (message) => {
      if (message.senderId === friendId) {
        setMessages(prev => [...prev, message]);
        chatService.markAsRead(friendId);
      }
    });

    // Listen for typing indicators
    socketService.on('typing:start', ({ userId }) => {
      if (userId === friendId) {
        setIsTyping(true);
      }
    });

    socketService.on('typing:stop', ({ userId }) => {
      if (userId === friendId) {
        setIsTyping(false);
      }
    });

    // Listen for online status
    socketService.on('user:status', ({ userId, online }) => {
      if (userId === friendId) {
        setIsOnline(online);
      }
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const response = await chatService.sendMessage(friendId, messageText);
      
      // Add message to local state
      setMessages(prev => [...prev, response.data]);

      // Emit via socket
      socketService.emit('message:send', {
        ...response.data,
        senderId: user.id,
        receiverId: friendId,
      });

      // Stop typing indicator
      socketService.emit('typing:stop', {
        senderId: user.id,
        receiverId: friendId,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing start
    socketService.emit('typing:start', {
      senderId: user.id,
      receiverId: friendId,
    });

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emit('typing:stop', {
        senderId: user.id,
        receiverId: friendId,
      });
    }, 1000);
  };

  const formatMessageTime = (date) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now - messageDate;

    // Less than a minute
    if (diff < 60000) return 'Just now';
    
    // Less than an hour
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `${mins}m ago`;
    }

    // Same day
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'h:mm a');
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${format(messageDate, 'h:mm a')}`;
    }

    // Older
    return format(messageDate, 'MMM d, h:mm a');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-dark-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/chat')}
            className="p-2 hover:bg-dark-700 rounded-full transition"
          >
            <FiArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="relative">
            <img
              src={friend?.photoURL || '/default-avatar.png'}
              alt={friend?.displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-900" />
            )}
          </div>

          <div>
            <h2 className="font-semibold text-white">{friend?.displayName || 'Loading...'}</h2>
            {isTyping ? (
              <p className="text-xs text-primary">typing...</p>
            ) : (
              <p className="text-xs text-gray-400">{isOnline ? 'Online' : 'Offline'}</p>
            )}
          </div>
        </div>

        <button className="p-2 hover:bg-dark-700 rounded-full transition">
          <FiMoreVertical className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 lg:pb-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => {
            const isOwn = message.senderId === user.id;
            const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;

            return (
              <motion.div
                key={message._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end space-x-2`}
              >
                {!isOwn && showAvatar && (
                  <img
                    src={friend?.photoURL || '/default-avatar.png'}
                    alt={friend?.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                {!isOwn && !showAvatar && <div className="w-8" />}

                <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                        : 'bg-dark-700 text-white rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm break-words">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-2">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-16 lg:bottom-0 glass border-t border-dark-700 p-4 bg-dark-900">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 bg-dark-700 text-white rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
