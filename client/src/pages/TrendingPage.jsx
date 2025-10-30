import React from 'react';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard';
import { useVideos } from '../hooks/useVideos';
import { useAuth } from '../hooks/useAuth';
import { FiLoader, FiTrendingUp } from 'react-icons/fi';

// Trending Page - Shows videos sorted by likes and recent activity
const TrendingPage = () => {
  const { videos, loading, error, refetch } = useVideos('trending');
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-400">Loading trending videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading videos</p>
          <button
            onClick={refetch}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 lg:left-64 right-0 z-30 glass border-b border-white/10 py-4 bg-dark-900"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-3">
          <FiTrendingUp className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold gradient-text">Trending Now</h1>
            <p className="text-gray-400 text-sm">
              {videos.length} hot videos right now 🔥
            </p>
          </div>
        </div>
      </motion.div>

      {/* Video Feed - Vertical Snap Scroll with Phone Width */}
      <div className="absolute top-[80px] left-0 right-0 bottom-0 lg:left-64 flex justify-center overflow-hidden">
        <div className="video-container-vertical w-full max-w-md h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          {videos.length === 0 ? (
            <div className="h-full flex items-center justify-center snap-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center px-4"
              >
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  No trending videos yet
                </h2>
                <p className="text-gray-400">
                  Start creating and get trending!
                </p>
              </motion.div>
            </div>
          ) : (
            videos.map((video, index) => (
              <div key={video._id} className="relative snap-start snap-always h-full">
                {/* Trending Rank Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute top-4 left-4 z-30 bg-gradient-to-r from-yellow-400 to-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg"
                >
                  #{index + 1}
                </motion.div>
                <VideoCard video={video} currentUser={user} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
