import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

const Stories = () => {
  // Mock story data - replace with actual data from API
  const [stories] = useState([
    {
      id: 1,
      user: {
        displayName: 'Your Story',
        photoURL: '/default-avatar.png',
      },
      isAdd: true,
    },
    {
      id: 2,
      user: {
        displayName: 'John Doe',
        photoURL: 'https://i.pravatar.cc/150?img=1',
      },
      hasNew: true,
    },
    {
      id: 3,
      user: {
        displayName: 'Jane Smith',
        photoURL: 'https://i.pravatar.cc/150?img=2',
      },
      hasNew: true,
    },
    {
      id: 4,
      user: {
        displayName: 'Mike Johnson',
        photoURL: 'https://i.pravatar.cc/150?img=3',
      },
      hasNew: false,
    },
    {
      id: 5,
      user: {
        displayName: 'Sarah Wilson',
        photoURL: 'https://i.pravatar.cc/150?img=4',
      },
      hasNew: true,
    },
  ]);

  return (
    <div className="w-full bg-dark-800/50 backdrop-blur-sm border-b border-white/10 py-2 px-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 cursor-pointer"
          >
            <div className="flex flex-col items-center space-y-1">
              {/* Story Circle */}
              <div
                className={`relative ${
                  story.isAdd
                    ? 'bg-gradient-to-r from-primary to-secondary'
                    : story.hasNew
                    ? 'bg-gradient-to-r from-primary via-accent to-secondary'
                    : 'bg-gray-600'
                } p-[2px] rounded-full`}
              >
                <div className="bg-dark-900 p-[3px] rounded-full">
                  {story.isAdd ? (
                    <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center">
                      <FiPlus className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <img
                      src={story.user.photoURL}
                      alt={story.user.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
              {/* Story Name */}
              <span className="text-xs text-white text-center max-w-[70px] truncate">
                {story.user.displayName}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Stories;