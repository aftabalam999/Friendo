import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard';
import UploadModal from '../components/UploadModal';
import Stories from '../components/Stories';
import { useVideos } from '../hooks/useVideos';
import { useAuth } from '../hooks/useAuth';
import { FiLoader } from 'react-icons/fi';

// Home Page - Main video feed with vertical scroll
const HomePage = () => {
  const { videos, loading, error, refetch } = useVideos('all');
  const { user } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-400">Loading videos...</p>
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
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Stories Section - Top */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="bg-gradient-to-b from-black/80 via-black/40 to-transparent pt-2">
          <Stories />
        </div>
      </div>

      {/* Video Feed Container - Vertical Snap Scroll with Phone Width */}
      <div className="h-screen w-full flex justify-center">
        <div className="video-container-vertical w-full max-w-md h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide pb-16">
          {videos.length === 0 ? (
            <div className="h-full flex items-center justify-center snap-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center px-4"
              >
                <div className="text-6xl mb-4">🎥</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  No videos yet
                </h2>
                <p className="text-gray-400 mb-6">
                  Be the first to upload and start trending!
                </p>
                {user && (
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-gradient-to-r from-primary via-accent to-secondary text-white px-8 py-3 rounded-full font-semibold neon-glow"
                  >
                    Upload Your First Video
                  </button>
                )}
              </motion.div>
            </div>
          ) : (
            videos.map((video, index) => (
              <VideoCard 
                key={video._id || video.id || index} 
                video={video} 
                currentUser={user} 
              />
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        user={user}
        onUploadSuccess={refetch}
      />
    </div>
  );
};

export default HomePage;
