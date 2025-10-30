import User from '../models/User.js';
import { generateTokens, verifyToken } from '../utils/jwt.js';

/**
 * Register a new user
 */
export const register = async (req, res) => {
  console.log('📝 User registration request received');
  
  try {
    const { email, password, displayName } = req.body;

    // Input Validation
    if (!email || !password) {
      console.log('❌ Registration failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    if (password.length < 6) {
      console.log('❌ Registration failed: Password too short');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check existing user - with timeout handling
    const existingUserPromise = User.findOne({ email }).maxTimeMS(15000);
    const existingUser = await Promise.race([
      existingUserPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timed out')), 15000)
      )
    ]);

    if (existingUser) {
      console.log('❌ Registration failed: Email already exists');
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Generate unique username with timeout handling
    const baseUsername = email.split('@')[0];
    let username = baseUsername;
    let counter = 1;
    let maxAttempts = 5;

    while (maxAttempts > 0) {
      try {
        const usernameExists = await User.findOne({ username }).maxTimeMS(5000);
        if (!usernameExists) break;
        
        username = `${baseUsername}${counter}`;
        counter++;
        maxAttempts--;
      } catch (error) {
        console.log('⚠️ Username check timed out, using fallback');
        username = `${baseUsername}${Date.now().toString().slice(-4)}`;
        break;
      }
    }

    // Prepare user data
    const userData = {
      email,
      password,
      displayName: displayName || username,
      username,
      bio: '',
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || username)}&background=random`,
    };

    // Create new user with timeout handling
    const createUserPromise = User.create(userData);
    const user = await Promise.race([
      createUserPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('User creation timed out')), 20000)
      )
    ]);

    if (!user) {
      throw new Error('Failed to create user account');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    console.log('✅ User registered successfully:', user.email);

    // Return user data and tokens
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
          username: user.username,
          photoURL: user.photoURL,
          bio: user.bio,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error);

    // Handle specific error types
    if (error.message.includes('timed out')) {
      return res.status(504).json({
        success: false,
        message: 'Registration timed out. Please try again.',
        error: 'Database operation timed out'
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists',
        error: 'Duplicate key error'
      });
    }

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Invalid input data',
        error: messages.join(', ')
      });
    }

    // Default error response
    return res.status(500).json({
      success: false,
      message: 'Failed to register user. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Login existing user
 */
export const login = async (req, res) => {
  console.log('🔐 User login request received');
  
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    console.log('✅ User logged in successfully:', user.email);

    // Return user data and tokens
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
          username: user.username,
          photoURL: user.photoURL,
          bio: user.bio,
          gender: user.gender,
          mobileNumber: user.mobileNumber,
          dateOfBirth: user.dateOfBirth,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message,
    });
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (req, res) => {
  console.log('🔄 Token refresh request received');
  
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    console.log('✅ Token refreshed successfully for user:', user.email);

    return res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    console.error('❌ Token refresh error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
      error: error.message,
    });
  }
};

/**
 * Get current user profile
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        username: user.username,
        photoURL: user.photoURL,
        bio: user.bio,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    console.error('❌ Get me error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message,
    });
  }
};

/**
 * Logout user (client-side token removal)
 */
export const logout = async (req, res) => {
  console.log('👋 User logout request received');
  
  return res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};
