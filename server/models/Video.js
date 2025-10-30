import mongoose from 'mongoose';

// Video Schema - Stores video metadata and engagement data
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      required: true,
      maxlength: 500,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    hashtags: [{
      type: String,
      lowercase: true,
    }],
    userId: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [{
      type: String, // Firebase UIDs
    }],
    views: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      userId: String,
      text: {
        type: String,
        required: true,
        maxlength: 500,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
videoSchema.index({ userId: 1, createdAt: -1 });
videoSchema.index({ likes: -1, createdAt: -1 }); // For trending
videoSchema.index({ hashtags: 1 });
videoSchema.index({ createdAt: -1 });

// Virtual for trending score (combination of likes and recency)
videoSchema.virtual('trendingScore').get(function() {
  const daysSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  return this.likes / (daysSinceCreation + 1); // Higher score = more trending
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
