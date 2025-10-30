import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUserPlus, FiUserCheck, FiUserX, FiCheck, FiX, FiMessageCircle } from 'react-icons/fi';
import { friendService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

const FriendsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, removeToast, success, error: showError } = useToast();
  
  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'pending', 'sent', 'search'
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchPendingRequests();
      fetchSentRequests();
    }
  }, [user]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await friendService.getFriendsList();
      setFriends(response.data || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await friendService.getPendingRequests();
      setPendingRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const response = await friendService.getSentRequests();
      setSentRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await friendService.searchUsers(query);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      showError('Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendRequest = async (receiverId) => {
    try {
      await friendService.sendFriendRequest(receiverId);
      success('Friend request sent!');
      // Refresh sent requests
      await fetchSentRequests();
      // Update search results to show button state
      setSearchResults(prev => 
        prev.map(u => u.id === receiverId || u._id === receiverId ? { ...u, requestSent: true } : u)
      );
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      success('Friend request accepted!');
      await fetchFriends();
      await fetchPendingRequests();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await friendService.rejectFriendRequest(requestId);
      success('Friend request rejected');
      await fetchPendingRequests();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    
    try {
      await friendService.removeFriend(friendId);
      success('Friend removed');
      await fetchFriends();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to remove friend');
    }
  };

  const isRequestSent = (userId) => {
    return sentRequests.some(req => req.receiver?._id === userId || req.receiver?.id === userId);
  };

  const isFriend = (userId) => {
    return friends.some(friend => friend._id === userId || friend.id === userId);
  };

  return (
    <div className="min-h-screen pt-16 pb-24 px-4">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Friends</h1>
          <p className="text-gray-400">Connect and chat with your friends</p>
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
              placeholder="Search users by name or username..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-dark-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 rounded-lg font-semibold transition relative ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Requests ({pendingRequests.length})
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              activeTab === 'sent'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Search Results</h2>
            <div className="space-y-3">
              {searchResults.map((searchUser) => (
                <motion.div
                  key={searchUser._id || searchUser.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={searchUser.photoURL || '/default-avatar.png'}
                      alt={searchUser.displayName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{searchUser.displayName}</h3>
                      <p className="text-sm text-gray-400">@{searchUser.username || 'user'}</p>
                    </div>
                  </div>
                  
                  {isFriend(searchUser._id || searchUser.id) ? (
                    <button
                      onClick={() => navigate(`/chat/${searchUser._id || searchUser.id}`)}
                      className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-semibold flex items-center space-x-2"
                    >
                      <FiMessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  ) : isRequestSent(searchUser._id || searchUser.id) ? (
                    <button
                      disabled
                      className="px-4 py-2 rounded-full bg-gray-500/20 text-gray-400 font-semibold flex items-center space-x-2"
                    >
                      <FiUserCheck className="w-4 h-4" />
                      <span>Sent</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(searchUser._id || searchUser.id)}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center space-x-2 hover:shadow-lg transition"
                    >
                      <FiUserPlus className="w-4 h-4" />
                      <span>Add Friend</span>
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-12">
                  <FiUserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No friends yet. Search to add friends!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <motion.div
                      key={friend._id || friend.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-dark-700/50 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={friend.photoURL || '/default-avatar.png'}
                          alt={friend.displayName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                        />
                        <div>
                          <h3 className="font-semibold text-white">{friend.displayName}</h3>
                          <p className="text-sm text-gray-400">@{friend.username || 'user'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/chat/${friend._id || friend.id}`)}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center space-x-2 hover:shadow-lg transition"
                        >
                          <FiMessageCircle className="w-4 h-4" />
                          <span>Chat</span>
                        </button>
                        <button
                          onClick={() => handleRemoveFriend(friend._id || friend.id)}
                          className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                        >
                          <FiUserX className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FiUserCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={request.sender?.photoURL || '/default-avatar.png'}
                          alt={request.sender?.displayName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                        />
                        <div>
                          <h3 className="font-semibold text-white">{request.sender?.displayName}</h3>
                          <p className="text-sm text-gray-400">@{request.sender?.username || 'user'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition flex items-center space-x-2"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition flex items-center space-x-2"
                        >
                          <FiX className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'sent' && (
            <motion.div
              key="sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {sentRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FiUserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No sent requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentRequests.map((request) => (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={request.receiver?.photoURL || '/default-avatar.png'}
                          alt={request.receiver?.displayName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                        />
                        <div>
                          <h3 className="font-semibold text-white">{request.receiver?.displayName}</h3>
                          <p className="text-sm text-gray-400">@{request.receiver?.username || 'user'}</p>
                        </div>
                      </div>
                      
                      <span className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold text-sm">
                        Pending
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FriendsPage;
