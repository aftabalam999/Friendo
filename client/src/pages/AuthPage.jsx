import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Login/Signup Page Component
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signInWithEmail, signUpWithEmail, error } = useAuth();
  const navigate = useNavigate();

  // Handle Email/Password Sign In or Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!isLogin && displayName.trim().length < 2) {
      alert('Display name must be at least 2 characters');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Attempting to', isLogin ? 'login' : 'register', 'with email:', email);
      
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      alert(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 max-w-md w-full relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-primary via-accent to-secondary flex items-center justify-center mb-4"
          >
            <span className="text-4xl font-bold">F</span>
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Friendo</h1>
          <p className="text-gray-400">Share Your Moments</p>
        </div>

        {/* Toggle Login/Signup */}
        <div className="flex mb-6 bg-dark-800 rounded-xl p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              isLogin
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'text-gray-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              !isLogin
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'text-gray-400'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="w-full bg-dark-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                required={!isLogin}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                👤
              </div>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-dark-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-dark-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary via-accent to-secondary text-white py-3 rounded-xl font-semibold ripple-button neon-glow flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>{isLogin ? 'Login' : 'Sign Up'}</span>
            )}
          </button>
        </form>

        {/* Terms */}
        <p className="text-center text-gray-400 text-xs mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
