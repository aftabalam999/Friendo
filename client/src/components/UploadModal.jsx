import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUpload, FiLoader } from 'react-icons/fi';
import { videoService, aiService } from '../services/api';

// Upload Modal Component for video uploads with AI caption generation
const UploadModal = ({ isOpen, onClose, user, onUploadSuccess }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [generatingCaption, setGeneratingCaption] = useState(false);

  // Handle video file selection
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'video/mp4' || file.type === 'video/webm')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      alert('Please select a valid video file (MP4 or WebM)');
    }
  };

  // Generate AI caption using OpenAI
  const handleGenerateCaption = async () => {
    if (!title.trim()) {
      alert('Please enter a title first');
      return;
    }

    try {
      setGeneratingCaption(true);
      const result = await aiService.generateCaption(title);
      
      if (result.caption) {
        setCaption(result.caption);
      }
      if (result.hashtags) {
        setHashtags(result.hashtags.join(' '));
      }
    } catch (error) {
      console.error('Error generating caption:', error);
      alert('Failed to generate caption. Please try again.');
    } finally {
      setGeneratingCaption(false);
    }
  };

  // Handle video upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoFile || !title.trim() || !caption.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', title);
      formData.append('caption', caption);
      formData.append('hashtags', hashtags);

      // Upload video to server with progress tracking
      const response = await videoService.uploadVideo(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      });

      console.log('Upload successful:', response);

      // Reset form and close modal
      resetForm();
      setUploading(false);
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video: ' + (error.response?.data?.message || error.message));
      setUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setTitle('');
    setCaption('');
    setHashtags('');
    setUploadProgress(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">Upload Video</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Video Upload Area */}
            {!videoPreview ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-primary/50 rounded-2xl p-12 text-center hover:border-primary transition">
                  <FiUpload className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-white font-semibold mb-2">
                    Click to upload video
                  </p>
                  <p className="text-gray-400 text-sm">
                    Supports MP4, WebM (Max 100MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-80 object-contain bg-black"
                />
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <FiX />
                </button>
              </div>
            )}

            {/* Title Input */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your video a catchy title"
                className="w-full bg-dark-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Caption Input with AI Generator */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white font-semibold">Caption *</label>
                <button
                  type="button"
                  onClick={handleGenerateCaption}
                  disabled={generatingCaption || !title.trim()}
                  className="text-sm bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full font-medium flex items-center space-x-2 disabled:opacity-50"
                >
                  {generatingCaption ? (
                    <>
                      <FiLoader className="animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <span>✨ AI Generate</span>
                  )}
                </button>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe your video or let AI generate it"
                rows="3"
                className="w-full bg-dark-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            {/* Hashtags Input */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#trending #viral #fyp"
                className="w-full bg-dark-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-gray-400 text-xs mt-1">
                Separate hashtags with spaces
              </p>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white">Uploading...</span>
                  <span className="text-primary font-semibold">
                    {uploadProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-dark-700 text-white py-3 rounded-xl font-semibold hover:bg-dark-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !videoFile}
                className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary text-white py-3 rounded-xl font-semibold ripple-button neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;
