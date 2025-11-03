import Video from '../models/Video.js';
import User from '../models/User.js';

// Get all videos (for feed)
export const getAllVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const videos = await Video.find({ isActive: true })
      .populate('user', 'displayName username photoURL')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Video.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      count: videos.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: videos,
    });
  } catch (error) {
    console.error('Get all videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch videos',
      error: error.message,
    });
  }
};

// Get trending videos (sorted by likes and recency)
export const getTrendingVideos = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Get videos from the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const videos = await Video.find({
      isActive: true,
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate('user', 'displayName username photoURL')
      .sort({ likes: -1, views: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error('Get trending videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending videos',
      error: error.message,
    });
  }
};

// Get single video by ID
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id)
      .populate('user', 'displayName username photoURL')
      .populate('comments.user', 'displayName photoURL');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video',
      error: error.message,
    });
  }
};

// Get videos by user ID
export const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;

    const videos = await Video.find({ userId, isActive: true })
      .populate('user', 'displayName username photoURL')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    console.error('Get user videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user videos',
      error: error.message,
    });
  }
};

// Upload new video
export const uploadVideo = async (req, res) => {
  try {
    console.log('📹 Video upload request received');
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    
    const { title, caption, hashtags, duration } = req.body;
    const userId = req.user?.id; // JWT MongoDB _id
    
    console.log('👤 User ID from token:', userId);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded',
      });
    }

    // Generate video URL (accessible via server)
    const videoUrl = `${req.protocol}://${req.get('host')}/uploads/videos/${req.file.filename}`;
    
    console.log('📏 Video URL:', videoUrl);

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Parse hashtags if sent as string
    let hashtagsArray = [];
    if (hashtags) {
      if (typeof hashtags === 'string') {
        hashtagsArray = hashtags.split(' ').filter(tag => tag.trim() && tag.startsWith('#'));
      } else if (Array.isArray(hashtags)) {
        hashtagsArray = hashtags;
      }
    }

    // Create video document
    const video = await Video.create({
      title,
      caption,
      hashtags: hashtagsArray,
      videoUrl,
      userId: userId, // Store MongoDB _id as userId
      user: user._id,
      duration: duration || 0,
    });

    // Populate user info
    await video.populate('user', 'displayName username photoURL');
    
    console.log('✅ Video uploaded successfully:', video._id);

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: video,
    });
  } catch (error) {
    console.error('❌ Upload video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload video',
      error: error.message,
    });
  }
};

// Like a video
export const likeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // JWT MongoDB _id

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Check if already liked
    if (video.likedBy.includes(userId.toString())) {
      return res.status(400).json({
        success: false,
        message: 'Video already liked',
      });
    }

    // Add like
    video.likedBy.push(userId.toString());
    video.likes += 1;
    await video.save();

    res.status(200).json({
      success: true,
      message: 'Video liked',
      data: { likes: video.likes },
    });
  } catch (error) {
    console.error('Like video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like video',
      error: error.message,
    });
  }
};

// Unlike a video
export const unlikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // JWT MongoDB _id

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Check if not liked
    if (!video.likedBy.includes(userId.toString())) {
      return res.status(400).json({
        success: false,
        message: 'Video not liked yet',
      });
    }

    // Remove like
    video.likedBy = video.likedBy.filter(id => id !== userId.toString());
    video.likes = Math.max(0, video.likes - 1);
    await video.save();

    res.status(200).json({
      success: true,
      message: 'Video unliked',
      data: { likes: video.likes },
    });
  } catch (error) {
    console.error('Unlike video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlike video',
      error: error.message,
    });
  }
};

// Add comment to video
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id; // JWT MongoDB _id

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required',
      });
    }

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Add comment
    video.comments.push({
      user: user._id,
      userId: userId,
      text: text.trim(),
    });

    await video.save();

    // Populate and return the new comment
    await video.populate('comments.user', 'displayName photoURL');
    const newComment = video.comments[video.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: newComment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message,
    });
  }
};

// Get comments for a video
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id)
      .populate('comments.user', 'displayName photoURL')
      .select('comments');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    res.status(200).json({
      success: true,
      count: video.comments.length,
      data: video.comments,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message,
    });
  }
};

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // JWT MongoDB _id

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Check if user owns the video (normalize both sides to string)
    if (String(video.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this video',
      });
    }

    // Soft delete - mark as inactive
    video.isActive = false;
    await video.save();

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete video',
      error: error.message,
    });
  }
};
