import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiTrendingUp, FiPlusCircle, FiUsers, FiMessageCircle } from 'react-icons/fi';

const BottomNav = ({ user, onUploadClick }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome },
    { path: '/friends', icon: FiUsers },
    { action: 'upload', icon: FiPlusCircle, isUpload: true },
    { path: '/chat', icon: FiMessageCircle },
    { path: '/trending', icon: FiTrendingUp },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 lg:left-64 glass border-t border-white/10 z-50 lg:hidden"
    >
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item, index) => (
          item.isUpload ? (
            <motion.button
              key="upload"
              whileTap={{ scale: 0.9 }}
              onClick={onUploadClick}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white"
            >
              <item.icon className="w-6 h-6" />
            </motion.button>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center w-12 h-12 rounded-xl transition ${
                isActive(item.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <item.icon className="w-7 h-7" />
              </motion.div>
            </Link>
          )
        ))}
      </div>
      {/* Safe area for devices with notch */}
      <div className="h-safe bg-dark-900/50"></div>
    </motion.nav>
  );
};

export default BottomNav;
