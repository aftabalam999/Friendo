import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// ES Module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'https://friendo-nine.vercel.app'],
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['https://friendo-nine.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve uploaded videos as static files
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));
// Serve uploaded profile images as static files
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Friendo API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      videos: '/api/videos',
      ai: '/api/ai',
      health: '/api/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Socket.io connection handling
const onlineUsers = new Map(); // Map<userId, socketId>

io.on('connection', (socket) => {
  console.log('\u26a1 New socket connection:', socket.id);

  // Send current online users to newly connected user
  const onlineUsersList = Array.from(onlineUsers.keys());
  socket.emit('users:online', onlineUsersList);

  // User comes online
  socket.on('user:online', (userId) => {
    console.log('\ud83d\udfe2 User online:', userId);
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Broadcast to all connected users
    io.emit('user:status', { userId, online: true });
    
    // Send current user's online status to all users
    socket.broadcast.emit('user:status', {
      userId: userId,
      online: true,
      lastSeen: new Date()
    });
  });

  // Send message
  socket.on('message:send', (data) => {
    console.log('\ud83d\udcac Message from', data.senderId, 'to', data.receiverId);
    
    const recipientSocketId = onlineUsers.get(data.receiverId);
    if (recipientSocketId) {
      // Send to recipient
      io.to(recipientSocketId).emit('message:receive', data);
    }
  });

  // Typing indicator
  socket.on('typing:start', ({ senderId, receiverId }) => {
    const recipientSocketId = onlineUsers.get(receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing:start', { userId: senderId });
    }
  });

  socket.on('typing:stop', ({ senderId, receiverId }) => {
    const recipientSocketId = onlineUsers.get(receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing:stop', { userId: senderId });
    }
  });

  // Mark messages as read
  socket.on('messages:read', ({ senderId, receiverId }) => {
    const recipientSocketId = onlineUsers.get(receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('messages:read', { userId: senderId });
    }
  });

  // Friend request events
  socket.on('friend:request', (data) => {
    const recipientSocketId = onlineUsers.get(data.receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('friend:request', data);
    }
  });

  socket.on('friend:accepted', (data) => {
    const recipientSocketId = onlineUsers.get(data.receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('friend:accepted', data);
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log('\u274c Socket disconnected:', socket.id);
    
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      // Broadcast offline status with last seen
      io.emit('user:status', { 
        userId: socket.userId, 
        online: false,
        lastSeen: new Date()
      });
    }
  });

  // Note: the 'reconnect' event is a client-side event and is not reliably emitted on the server.
  // Server relies on 'connect' and 'disconnect' events plus client reconnection logic.
});

// Make io accessible in routes
app.set('io', io);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5002;

httpServer.listen(PORT, () => {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Friendo Server Started Successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API Base: http://localhost:${PORT}/api`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});

export default app;
