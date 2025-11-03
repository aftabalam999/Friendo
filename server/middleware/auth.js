import { verifyToken as verifyJWT } from '../utils/jwt.js';
import User from '../models/User.js';

// Middleware to verify JWT authentication token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log('🔐 Auth middleware - Checking token...');
    
    // Check if authorization header exists
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return res.status(401).json({ 
        success: false, 
        message: 'No authorization header provided' 
      });
    }

    // Parse Authorization header robustly: "Bearer <token>" (case-insensitive)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
      console.error('❌ Invalid authorization format');
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format. Use: Bearer <token>'
      });
    }

    const token = parts[1];
    if (!token) {
      console.error('❌ No token provided in Authorization header');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    console.log('🔍 Verifying JWT token...');

    // Verify JWT token
    const decoded = verifyJWT(token);
    
    console.log('✅ Token verified successfully for user:', decoded.email);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        try {
          const decoded = verifyJWT(parts[1]);
          req.user = {
            id: decoded.id,
            email: decoded.email,
            username: decoded.username,
          };
        } catch (err) {
          // ignore optional auth errors
          console.error('Optional auth error during token verification:', err.message);
        }
      }
    }
  } catch (error) {
    console.error('Optional auth error:', error);
  }
  
  next();
};
