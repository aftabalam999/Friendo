import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { videoService, userService } from '../services/api';
import { FiLogOut, FiSettings, FiGrid, FiHeart, FiX, FiEdit2, FiUser, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import VideoPlayerModal from '../components/VideoPlayerModal';

// Profile Page - User profile with uploaded videos
const ProfilePage = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [userVideos, setUserVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' or 'liked'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    gender: '',
    mobileNumber: '',
    dateOfBirth: '',
    photoURL: '',
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileImageObjectUrl, setProfileImageObjectUrl] = useState(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserVideos();
      fetchLikedVideos();
      // Fetch complete user data from backend
      fetchUserData();
    }
  }, [user]);

  // Update editForm whenever user changes (for immediate UI updates)
  useEffect(() => {
    if (user) {
      setEditForm(prev => ({
        ...prev,
        photoURL: user.photoURL || prev.photoURL,
        displayName: user.displayName || prev.displayName,
      }));
      
      // Only update profile image preview if it's not already set to the user's photoURL
      if (user.photoURL && profileImagePreview !== user.photoURL) {
        setProfileImagePreview(user.photoURL);
      }
    }
  }, [user?.photoURL, user?.displayName]);

  const fetchUserData = async () => {
    try {
      const response = await userService.getUserProfile(user.id);
      const userData = response.data || response;
      setEditForm({
        displayName: userData.displayName || user.displayName || '',
        bio: userData.bio || '',
        gender: userData.gender || '',
        mobileNumber: userData.mobileNumber || '',
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
        photoURL: userData.photoURL || user.photoURL || '',
      });
      setProfileImagePreview(userData.photoURL || user.photoURL || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to user data
      setEditForm({
        displayName: user.displayName || '',
        bio: '',
        gender: '',
        mobileNumber: '',
        dateOfBirth: '',
        photoURL: user.photoURL || '',
      });
      setProfileImagePreview(user.photoURL || '');
    }
  };

  const fetchUserVideos = async () => {
    try {
      setLoading(true);
      const response = await videoService.getUserVideos(user.id);
      // Extract data from response
      const videos = response.data || response || [];
      setUserVideos(Array.isArray(videos) ? videos : []);
      console.log('User videos:', videos);
    } catch (error) {
      console.error('Error fetching user videos:', error);
      setUserVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedVideos = async () => {
    try {
      const response = await videoService.getAllVideos();
      const allVideos = response.data || response || [];
      // Filter videos liked by current user
      const liked = Array.isArray(allVideos) 
        ? allVideos.filter(video => 
            video.likedBy && video.likedBy.includes(user.id)
          )
        : [];
      setLikedVideos(liked);
      console.log('Liked videos:', liked);
    } catch (error) {
      console.error('Error fetching liked videos:', error);
      setLikedVideos([]);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      success('Logged out successfully!');
      setTimeout(() => navigate('/auth'), 1000);
    } catch (error) {
      console.error('Error logging out:', error);
      showError('Failed to logout');
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      // Use an object URL for a fast, reliable preview
      try {
        // Revoke previous object URL if present
        if (profileImageObjectUrl) {
          URL.revokeObjectURL(profileImageObjectUrl);
        }
        const objectUrl = URL.createObjectURL(file);
        setProfileImagePreview(objectUrl);
        setProfileImageObjectUrl(objectUrl);
      } catch (err) {
        console.error('Error creating object URL for preview:', err);
      }
    }
  };

  // Clean up object URL when the component unmounts or when a new one is created
  useEffect(() => {
    return () => {
      if (profileImageObjectUrl) {
        try {
          URL.revokeObjectURL(profileImageObjectUrl);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [profileImageObjectUrl]);

  // Handle profile update with clean error handling
  const handleEditProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('🔄 Starting profile update...');
    
    try {
      let updatedPhotoURL = editForm.photoURL;
      
      // Step 1: Upload profile image if changed
      if (profileImageFile) {
        console.log('📸 Uploading new profile image...');
        
        try {
          const imageFormData = new FormData();
          imageFormData.append('profileImage', profileImageFile);
          
          const uploadResponse = await userService.uploadProfileImage(user.id, imageFormData);
          
          if (uploadResponse.success) {
            updatedPhotoURL = uploadResponse.data.photoURL;
            console.log('✅ Profile image uploaded:', updatedPhotoURL);
            success('Profile image uploaded successfully!');
          }
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError);
          showError(uploadError.response?.data?.message || 'Failed to upload image');
          // Continue with profile update even if image upload fails
        }
      }

      // Step 2: Update profile data
      console.log('📝 Updating profile information...');
      
      const updateData = {
        displayName: editForm.displayName.trim(),
        bio: editForm.bio.trim(),
        gender: editForm.gender,
        mobileNumber: editForm.mobileNumber.trim(),
        dateOfBirth: editForm.dateOfBirth || null,
        photoURL: updatedPhotoURL,
      };
      
      const profileResponse = await userService.updateProfile(user.id, updateData);
      
      if (profileResponse.success) {
        console.log('✅ Profile updated successfully');
        success('Profile updated successfully!');
        
        // Step 3: Refresh user data
        if (refreshUser) {
          await refreshUser();
        }
        
        await fetchUserData();
        
        // Step 4: Reset and close modal
        setProfileImageFile(null);
        setIsEditModalOpen(false);
      }
      
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-24">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        {/* User Info Card */}
        <div className="glass rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <motion.img
              key={profileImagePreview || editForm.photoURL || user.photoURL || '/default-avatar.png'}
              whileHover={{ scale: 1.05 }}
              src={profileImagePreview || editForm.photoURL || user.photoURL || '/default-avatar.png'}
              alt={editForm.displayName || user.displayName}
              className="w-32 h-32 rounded-full border-4 border-primary shadow-lg object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />

            {/* User Details */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-1">
                {editForm.displayName || user.displayName || 'User'}
              </h1>
              <p className="text-gray-400 mb-2">@{user.email?.split('@')[0]}</p>
              
              {/* Bio */}
              {editForm.bio && (
                <p className="text-gray-300 text-sm mb-3 max-w-md">{editForm.bio}</p>
              )}
              
              {/* Additional Info */}
              <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-400">
                {editForm.gender && editForm.gender !== '' && editForm.gender !== 'prefer-not-to-say' && (
                  <div className="flex items-center space-x-1">
                    <FiUser className="w-4 h-4" />
                    <span className="capitalize">{editForm.gender}</span>
                  </div>
                )}
                {editForm.dateOfBirth && (
                  <div className="flex items-center space-x-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>{new Date(editForm.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">
                    {Array.isArray(userVideos) ? userVideos.length : 0}
                  </p>
                  <p className="text-gray-400 text-sm">Videos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">
                    {Array.isArray(userVideos) ? userVideos.reduce((acc, video) => acc + (video.likes || 0), 0) : 0}
                  </p>
                  <p className="text-gray-400 text-sm">Likes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold gradient-text">
                    {Array.isArray(userVideos) ? userVideos.reduce((acc, video) => acc + (video.views || 0), 0) : 0}
                  </p>
                  <p className="text-gray-400 text-sm">Views</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-semibold flex items-center space-x-2">
                  <FiSettings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-dark-800 text-white px-6 py-2 rounded-full font-semibold flex items-center space-x-2 hover:bg-dark-700 transition"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-dark-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'text-gray-400'
            }`}
          >
            <FiGrid className="w-5 h-5" />
            <span>My Videos</span>
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition ${
              activeTab === 'liked'
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'text-gray-400'
            }`}
          >
            <FiHeart className="w-5 h-5" />
            <span>Liked</span>
          </button>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-400">Loading videos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(() => {
              const displayVideos = activeTab === 'videos' ? userVideos : likedVideos;
              if (!Array.isArray(displayVideos) || displayVideos.length === 0) {
                return (
                  <div className="col-span-full text-center py-12">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-gray-400 mb-4">
                      {activeTab === 'videos'
                        ? "You haven't uploaded any videos yet"
                        : "You haven't liked any videos yet"}
                    </p>
                    {activeTab === 'videos' && (
                      <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-semibold"
                      >
                        Upload Your First Video
                      </button>
                    )}
                  </div>
                );
              }
              return displayVideos.map((video, index) => (
                <motion.div
                  key={video._id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setSelectedVideoIndex(index);
                    setIsVideoPlayerOpen(true);
                  }}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer card-hover"
                >
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                    <p className="text-white font-semibold text-sm line-clamp-2">
                      {video.title}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-white text-xs">
                      <span className="flex items-center space-x-1">
                        <FiHeart className="w-4 h-4" />
                        <span>{video.likes || 0}</span>
                      </span>
                      <span>👁 {video.views || 0}</span>
                    </div>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        )}
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-3xl p-6 max-w-md w-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text">Edit Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleEditProfile} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Profile Image */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={profileImagePreview || '/default-avatar.png'}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full border-2 border-primary object-cover"
                    />
                    <label className="cursor-pointer bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl hover:opacity-90 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                      Choose Photo
                    </label>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Upload a profile picture from your device
                  </p>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                    className="w-full bg-dark-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your display name"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows="3"
                    className="w-full bg-dark-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength="150"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    {editForm.bio.length}/150 characters
                  </p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Gender
                  </label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full bg-dark-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.mobileNumber}
                    onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })}
                    className="w-full bg-dark-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className="w-full bg-dark-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 bg-dark-700 text-white py-3 rounded-xl font-semibold hover:bg-dark-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary text-white py-3 rounded-xl font-semibold neon-glow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <VideoPlayerModal
        videos={activeTab === 'videos' ? userVideos : likedVideos}
        initialIndex={selectedVideoIndex}
        isOpen={isVideoPlayerOpen}
        onClose={() => setIsVideoPlayerOpen(false)}
        currentUser={user}
      />
    </div>
  );
};

export default ProfilePage;
