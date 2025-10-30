import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiMessageCircle, FiShare2, FiMoreVertical, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useVideoInteractions } from '../hooks/useVideos';

const VideoPlayerModal = ({ videos, initialIndex, isOpen, onClose, currentUser }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const videoRef = useRef(null);

  const { likeVideo, unlikeVideo, addComment } = useVideoInteractions();

  const currentVideo = videos[currentIndex];

  // Update video when index changes
  useEffect(() => {
    if (currentVideo) {
      setIsLiked(currentVideo.likedBy?.includes(currentUser?.uid) || false);
      setLikesCount(currentVideo.likes || 0);
      setComments(currentVideo.comments || []);
      
      // Auto-play when video changes
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [currentIndex, currentVideo, currentUser]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!currentUser || !currentVideo) return;

    try {
      if (isLiked) {
        await unlikeVideo(currentVideo._id);
        setLikesCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        await likeVideo(currentVideo._id);
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Handle comment submission
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser || !currentVideo) return;

    try {
      const newComment = await addComment(currentVideo._id, comment);
      setComments([...comments, newComment]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle video play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share && currentVideo) {
      try {
        await navigator.share({
          title: currentVideo.title,
          text: currentVideo.caption,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Navigate to previous video
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Navigate to next video
  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, isPlaying]);

  if (!currentVideo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] text-white hover:text-gray-300 transition"
          >
            <FiX className="w-8 h-8" />
          </button>

          {/* Previous Button */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] text-white hover:text-gray-300 transition"
            >
              <FiChevronLeft className="w-10 h-10" />
            </button>
          )}

          {/* Next Button */}
          {currentIndex < videos.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] text-white hover:text-gray-300 transition"
            >
              <FiChevronRight className="w-10 h-10" />
            </button>
          )}

          {/* Video Player Container */}
          <div className="relative w-full max-w-md h-full bg-black">
            {/* Video */}
            <video
              ref={videoRef}
              src={currentVideo.videoUrl}
              className="w-full h-full object-contain"
              loop
              playsInline
              autoPlay
              onClick={togglePlayPause}
            />

            {/* Play/Pause Indicator */}
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-2"></div>
                </div>
              </motion.div>
            )}

            {/* Video Info Overlay */}
            <div className="absolute bottom-24 left-0 right-20 p-4 text-white">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={currentVideo.user?.photoURL || '/default-avatar.png'}
                  alt={currentVideo.user?.displayName}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
                <div>
                  <h3 className="font-semibold text-base">@{currentVideo.user?.username || 'user'}</h3>
                  <p className="text-xs text-gray-300">{currentVideo.user?.displayName}</p>
                </div>
              </div>

              {/* Caption */}
              <p className="text-sm mb-2">{currentVideo.caption}</p>

              {/* Hashtags */}
              {currentVideo.hashtags && (
                <div className="flex flex-wrap gap-2">
                  {currentVideo.hashtags.map((tag, index) => (
                    <span key={index} className="text-primary font-medium text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Interaction Buttons */}
            <div className="absolute right-3 bottom-28 flex flex-col space-y-5">
              {/* Like */}
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleLike}
                className="flex flex-col items-center space-y-1"
              >
                {isLiked ? (
                  <FaHeart className="w-7 h-7 text-red-500 drop-shadow-lg" />
                ) : (
                  <FiHeart className="w-7 h-7 text-white drop-shadow-lg" />
                )}
                <span className="text-white text-xs font-semibold drop-shadow-lg">
                  {likesCount > 999 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount}
                </span>
              </motion.button>

              {/* Comment */}
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setShowComments(!showComments)}
                className="flex flex-col items-center space-y-1"
              >
                <FiMessageCircle className="w-7 h-7 text-white drop-shadow-lg" />
                <span className="text-white text-xs font-semibold drop-shadow-lg">
                  {comments.length}
                </span>
              </motion.button>

              {/* Share */}
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleShare}
                className="flex flex-col items-center space-y-1"
              >
                <FiShare2 className="w-7 h-7 text-white drop-shadow-lg" />
                <span className="text-white text-[10px] font-semibold drop-shadow-lg">Share</span>
              </motion.button>

              {/* More */}
              <motion.button
                whileTap={{ scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <FiMoreVertical className="w-7 h-7 text-white drop-shadow-lg" />
              </motion.button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="absolute bottom-0 left-0 right-0 h-2/3 glass rounded-t-3xl p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Comments ({comments.length})
                  </h3>
                  <button
                    onClick={() => setShowComments(false)}
                    className="text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4 mb-20">
                  {comments.map((comment, index) => (
                    <div key={index} className="flex space-x-3">
                      <img
                        src={comment.user?.photoURL || '/default-avatar.png'}
                        alt={comment.user?.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {comment.user?.displayName}
                        </p>
                        <p className="text-gray-300 text-sm">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                {currentUser && (
                  <form
                    onSubmit={handleComment}
                    className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-white/10"
                  >
                    <div className="flex space-x-2 max-w-md mx-auto">
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-dark-800 text-white px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="submit"
                        disabled={!comment.trim()}
                        className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPlayerModal;
