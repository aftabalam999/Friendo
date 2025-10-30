import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import TrendingPage from './pages/TrendingPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import FriendsPage from './pages/FriendsPage';
import ChatListPage from './pages/ChatListPage';
import ChatPage from './pages/ChatPage';
import UploadModal from './components/UploadModal';
import { FiLoader } from 'react-icons/fi';

// Protected Route Component - Requires authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" />;
};

// Main App Component
function App() {
  const { user, loading } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary via-accent to-secondary flex items-center justify-center animate-pulse">
            <span className="text-4xl font-bold">F</span>
          </div>
          <FiLoader className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-gray-400">Loading Friendo...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        {/* Sidebar Navigation - Desktop Only */}
        {user && (
          <Sidebar 
            user={user} 
            onUploadClick={() => setIsUploadModalOpen(true)} 
          />
        )}

        {/* Main Content - Adjusted for sidebar on desktop */}
        <div className={user ? "lg:ml-64" : ""}>
          <Routes>
            {/* Public Route */}
            <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trending"
              element={
                <ProtectedRoute>
                  <TrendingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <FriendsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:friendId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Bottom Navigation - Mobile Only (Icon-only when playing reels) */}
        {user && (
          <BottomNav 
            user={user} 
            onUploadClick={() => setIsUploadModalOpen(true)} 
          />
        )}

        {/* Upload Modal - Available globally when logged in */}
        {user && (
          <UploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            user={user}
            onUploadSuccess={() => {
              setIsUploadModalOpen(false);
              window.location.reload(); // Refresh to show new video
            }}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
