import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiShare2, FiMoreVertical } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { useVideoInteractions } from '../hooks/useVideos';

// Video Card Component - Main video display with interactions
const VideoCard = ({ video, currentUser }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(video.comments || []);

  const { likeVideo, unlikeVideo, addComment } = useVideoInteractions();

  // Intersection Observer to autoplay video when in view
  const { ref, inView } = useInView({
    threshold: 0.7, // Video is 70% visible
  });

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [inView]);

  // Check if current user has liked this video
  useEffect(() => {
    if (currentUser && video.likedBy) {
      setIsLiked(video.likedBy.includes(currentUser.uid));
    }
  }, [currentUser, video.likedBy]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!currentUser) return;

    try {
      if (isLiked) {
        await unlikeVideo(video._id);
        setLikesCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        await likeVideo(video._id);
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
    if (!comment.trim() || !currentUser) return;

    try {
      const newComment = await addComment(video._id, comment);
      setComments([...comments, newComment]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle video play/pause on click
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.caption,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div ref={ref} className="snap-start snap-always relative w-full h-[calc(100vh-160px)] bg-black flex-shrink-0 flex items-center justify-center">
      <div className="absolute bottom-0 left-0 right-0 h-full">
        {/* Video Element */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover"
          loop
          playsInline
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

        {/* Video Info Overlay - Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/80 to-black/20"
        >
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={video.user?.photoURL || '/default-avatar.png'}
              alt={video.user?.displayName}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <div>
              <h3 className="font-semibold text-sm">@{video.user?.username || 'user'}</h3>
              <p className="text-xs text-gray-300">{video.user?.displayName}</p>
            </div>
          </div>

          {/* Caption */}
          <p className="text-sm mb-2 line-clamp-2">{video.caption}</p>

          {/* Hashtags */}
          {video.hashtags && (
            <div className="flex flex-wrap gap-2">
              {video.hashtags.map((tag, index) => (
                <span key={index} className="text-primary font-medium text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Interaction Buttons - Right Side */}
        <div className="absolute right-2 bottom-24 flex flex-col items-center space-y-4">
          {/* Like Button */}
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

          {/* Comment Button */}
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

          {/* Share Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleShare}
            className="flex flex-col items-center space-y-1"
          >
            <FiShare2 className="w-7 h-7 text-white drop-shadow-lg" />
            <span className="text-white text-[10px] font-semibold drop-shadow-lg">Share</span>
          </motion.button>

          {/* More Options */}
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
                    className="w-8 h-8 rounded-full"
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
                <div className="flex space-x-2 max-w-7xl mx-auto">
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
    </div>
  );
};

export default VideoCard;