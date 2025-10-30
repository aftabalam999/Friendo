import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiTrendingUp, FiUser, FiPlusCircle } from 'react-icons/fi';

// Navigation Bar Component with glassmorphism effect
const Navbar = ({ user, onUploadClick }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/trending', icon: FiTrendingUp, label: 'Trending' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary via-accent to-secondary flex items-center justify-center"
            >
              <span className="text-2xl font-bold">F</span>
            </motion.div>
            <span className="text-2xl font-bold gradient-text">Friendo</span>
          </Link>

          {/* Upload Button & User Info */}
          <div className="flex items-center space-x-4">
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onUploadClick}
                className="ripple-button bg-gradient-to-r from-primary via-accent to-secondary text-white px-6 py-2 rounded-full font-semibold flex items-center space-x-2 neon-glow"
              >
                <FiPlusCircle className="w-5 h-5" />
                <span>Upload</span>
              </motion.button>
            )}

            {user && (
              <Link to="/profile">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={user.photoURL || '/default-avatar.png'}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full border-2 border-primary"
                />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-4 py-2 ${
                isActive(item.path) ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;