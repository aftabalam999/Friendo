import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiTrendingUp, FiUser, FiPlusCircle, FiUsers, FiMessageCircle } from 'react-icons/fi';

const Sidebar = ({ user, onUploadClick }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/trending', icon: FiTrendingUp, label: 'Trending' },
    { path: '/friends', icon: FiUsers, label: 'Friends' },
    { path: '/chat', icon: FiMessageCircle, label: 'Messages' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/10 z-40 hidden lg:block"
    >
      <div className="flex flex-col h-full py-6">
        {/* Logo */}
        <Link to="/" className="px-6 mb-8">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-primary via-accent to-secondary flex items-center justify-center"
            >
              <span className="text-2xl font-bold">F</span>
            </motion.div>
            <span className="text-2xl font-bold gradient-text">Friendo</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium text-base">{item.label}</span>
              </motion.div>
            </Link>
          ))}

          {/* Upload Button */}
          {user && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUploadClick}
              className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl bg-gradient-to-r from-primary via-accent to-secondary text-white font-medium neon-glow mt-4"
            >
              <FiPlusCircle className="w-6 h-6" />
              <span>Upload Video</span>
            </motion.button>
          )}
        </nav>

        {/* User Profile */}
        {user && (
          <Link to="/profile" className="px-3" key={`sidebar-${user.photoURL}-${user.displayName}-${Date.now()}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-dark-700 transition"
            >
              <img
                key={`avatar-${user.photoURL}-${Date.now()}`}
                src={user.photoURL ? `${user.photoURL}?t=${Date.now()}` : '/default-avatar.png'}
                alt={user.displayName}
                className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user.displayName || 'User'}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  @{user.email?.split('@')[0]}
                </p>
              </div>
            </motion.div>
          </Link>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
