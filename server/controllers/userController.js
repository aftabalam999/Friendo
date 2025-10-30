import User from '../models/User.js';

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  console.log('📸 Profile image upload request received');
  console.log('User ID from params:', req.params.userId);
  console.log('Authenticated user:', req.user?.id);
  console.log('File received:', req.file ? req.file.filename : 'NO FILE');

  try {
    const { userId } = req.params;

    // Validate authentication
    if (!req.user || !req.user.id) {
      console.error('❌ No authenticated user found');
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Validate authorization
    if (req.user.id !== userId) {
      console.error('❌ User mismatch - Unauthorized');
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile',
      });
    }

    // Validate file upload
    if (!req.file) {
      console.error('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'Please select an image file',
      });
    }

    // Generate photo URL
    const photoURL = `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`;
    console.log('Generated photo URL:', photoURL);

    // Update user in database
    const user = await User.findByIdAndUpdate(
      userId,
      { photoURL },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.error('❌ User not found in database:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ Profile image uploaded successfully');
    return res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        photoURL: user.photoURL,
        user,
      },
    });
  } catch (error) {
    console.error('❌ Profile image upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while uploading image',
      error: error.message,
    });
  }
};

// Get user profile by ID
export const getUserProfile = async (req, res) => {
  console.log('👤 Get user profile request:', req.params.userId);
  
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-__v');

    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ User profile retrieved');
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message,
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  console.log('📝 Profile update request received');
  console.log('User ID from params:', req.params.userId);
  console.log('Authenticated user:', req.user?.id);
  console.log('Update data:', req.body);

  try {
    const { userId } = req.params;
    const { displayName, bio, username, gender, mobileNumber, dateOfBirth, photoURL } = req.body;

    // Validate authentication
    if (!req.user || !req.user.id) {
      console.error('❌ No authenticated user found');
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Validate authorization
    if (req.user.id !== userId) {
      console.error('❌ User mismatch - Unauthorized');
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile',
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (bio !== undefined) updateData.bio = bio;
    if (username !== undefined) updateData.username = username;
    if (gender !== undefined) updateData.gender = gender;
    if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (photoURL !== undefined) updateData.photoURL = photoURL;

    console.log('Updating user with data:', updateData);

    // Update user in database
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      console.error('❌ User not found in database:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ Profile updated successfully');
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('❌ Update user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// Get all users (for admin/search)
export const getAllUsers = async (req, res) => {
  console.log('👥 Get all users request');
  
  try {
    const users = await User.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(50);

    console.log('✅ Retrieved', users.length, 'users');
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('❌ Get all users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message,
    });
  }
};
