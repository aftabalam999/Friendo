# 🎬 Friendo - Short Video Sharing Platform

A modern, full-stack TikTok/Reels clone built with the MERN stack, featuring Firebase authentication, AI-powered caption generation, and a sleek Gen-Z inspired design.

![Friendo](https://img.shields.io/badge/Friendo-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🎥 **Video Upload & Sharing** - Upload MP4/WebM videos to Firebase Storage
- 🔥 **Trending Algorithm** - AI-sorted videos by likes and recency
- ❤️ **Social Interactions** - Like, comment, and share videos
- 🤖 **AI Caption Generator** - OpenAI-powered caption and hashtag suggestions
- 🔐 **Firebase Authentication** - Google and Email/Password login
- 🎨 **Modern UI** - Glassmorphism, neon gradients, smooth animations
- 📊 **User Profiles** - View and manage uploaded videos
- ⚡ **Infinite Scroll** - Smooth video feed with snap scrolling
- 🌙 **Dark Theme** - Eye-friendly dark mode with accent colors

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **Firebase SDK** - Authentication & Storage

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Firebase Admin** - Token verification
- **OpenAI API** - AI caption generation

## 📁 Project Structure

```
friendo/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   └── UploadModal.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── AuthPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── TrendingPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   └── useVideos.js
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── config/          # Configuration
│   │   │   ├── firebase.js
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                  # Node.js Backend
    ├── config/              # Configuration
    │   ├── db.js
    │   └── firebase.js
    ├── models/              # MongoDB schemas
    │   ├── User.js
    │   └── Video.js
    ├── routes/              # API routes
    │   ├── userRoutes.js
    │   ├── videoRoutes.js
    │   └── aiRoutes.js
    ├── controllers/         # Business logic
    │   ├── userController.js
    │   ├── videoController.js
    │   └── aiController.js
    ├── middleware/          # Auth middleware
    │   └── auth.js
    ├── server.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Firebase account
- OpenAI API key (optional, for AI features)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/friendo.git
cd friendo
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/friendo
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:3000
```

**Firebase Setup:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Google & Email/Password)
4. Enable Storage
5. Go to Project Settings > Service Accounts
6. Generate new private key (downloads JSON file)
7. Rename it to `serviceAccountKey.json` and place in `server/` directory

**Start the backend server:**

```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

Update `src/config/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Start the frontend:**

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. MongoDB Setup

**Local MongoDB:**
```bash
# Make sure MongoDB is running
mongod
```

**MongoDB Atlas (Cloud):**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## 📱 Features Walkthrough

### Authentication
- Google sign-in with one click
- Email/Password registration and login
- Automatic token refresh
- Protected routes

### Video Upload
1. Click the **Upload** button
2. Select video file (MP4/WebM, max 100MB)
3. Add title
4. Use **AI Generate** to create caption and hashtags
5. Upload to Firebase Storage
6. Video appears in feed

### Video Feed
- Vertical scroll with snap
- Autoplay when 70% visible
- Tap to play/pause
- Swipe up for next video

### Interactions
- **Like**: Double-tap or click heart icon
- **Comment**: Click comment icon, type, and post
- **Share**: Click share icon to copy link

### Profile
- View your uploaded videos
- See total likes and views
- Edit profile information
- Logout

## 🎨 Design System

### Color Palette
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#ec4899` (Pink)
- **Accent**: `#8b5cf6` (Purple)
- **Background**: `#0f172a` (Dark)
- **Cards**: `#1e293b` (Slate)

### Typography
- **Font**: Poppins, Inter
- **Headings**: Bold, 700-800 weight
- **Body**: Regular, 400-500 weight

### Effects
- Glassmorphism cards
- Neon glow on buttons
- Smooth fade-in animations
- Parallax scrolling

## 🔌 API Endpoints

### Users
- `POST /api/users/sync` - Sync user with Firebase
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile
- `GET /api/users` - Get all users

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/trending` - Get trending videos
- `GET /api/videos/:id` - Get single video
- `GET /api/videos/user/:userId` - Get user videos
- `POST /api/videos` - Upload video
- `POST /api/videos/:id/like` - Like video
- `DELETE /api/videos/:id/like` - Unlike video
- `POST /api/videos/:id/comments` - Add comment
- `DELETE /api/videos/:id` - Delete video

### AI
- `POST /api/ai/generate-caption` - Generate caption

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import repository
4. Set build command: `cd client && npm run build`
5. Set output directory: `client/dist`
6. Add environment variables
7. Deploy

### Backend (Render)

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Create new Web Service
4. Connect repository
5. Set build command: `cd server && npm install`
6. Set start command: `cd server && npm start`
7. Add environment variables
8. Deploy

### Environment Variables (Production)

**Frontend:**
- `VITE_API_URL` - Backend API URL

**Backend:**
- `MONGODB_URI` - MongoDB connection string
- `FIREBASE_SERVICE_ACCOUNT_PATH` - Path to Firebase service account
- `OPENAI_API_KEY` - OpenAI API key
- `CLIENT_URL` - Frontend URL
- `NODE_ENV=production`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by TikTok and Instagram Reels
- Built with love using modern web technologies
- Special thanks to the open-source community

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ and ☕ by developers, for creators**
