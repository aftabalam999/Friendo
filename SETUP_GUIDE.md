# 🚀 Trendo - Setup & Deployment Guide

Complete step-by-step instructions for running Trendo locally and deploying to production.

## 📋 Table of Contents
- [Local Development Setup](#local-development-setup)
- [Firebase Configuration](#firebase-configuration)
- [MongoDB Setup](#mongodb-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Production Deployment](#production-deployment)

---

## 🏠 Local Development Setup

### 1. Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

Verify installations:
```bash
node --version  # Should be v16+
npm --version
git --version
```

### 2. Clone and Install

```bash
# Navigate to your projects folder
cd Desktop

# The project is already in trendo folder
cd trendo

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

## 🔥 Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `trendo` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Enable **"Email/Password"** sign-in method
4. Enable **"Google"** sign-in method
5. Click **"Save"**

### Step 3: Enable Storage

1. Click **"Storage"** in left sidebar
2. Click **"Get started"**
3. Start in **production mode**
4. Choose a location (default is fine)
5. Click **"Done"**

### Step 4: Update Storage Rules

1. Go to **Storage** > **Rules** tab
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Step 5: Get Frontend Config

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click web icon (</>) to add a web app
4. Register app with nickname: `trendo-web`
5. Copy the `firebaseConfig` object
6. Paste into `client/src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "trendo-xxxxx.firebaseapp.com",
  projectId: "trendo-xxxxx",
  storageBucket: "trendo-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 6: Get Backend Service Account

1. Still in **Project Settings**
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** (downloads a JSON file)
5. Rename the file to `serviceAccountKey.json`
6. Move it to `server/` directory

⚠️ **Important**: Never commit `serviceAccountKey.json` to Git!

---

## 🗄️ MongoDB Setup

Choose one option:

### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB Community Server**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Follow installation wizard
   - Choose "Complete" installation

2. **Start MongoDB**
   ```bash
   # On Windows
   net start MongoDB
   
   # On Mac
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   ```

3. **Verify it's running**
   ```bash
   mongosh
   # Should connect to MongoDB shell
   # Type 'exit' to quit
   ```

4. **Connection String**
   ```
   MONGODB_URI=mongodb://localhost:27017/trendo
   ```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for free

2. **Create Cluster**
   - Click **"Build a Database"**
   - Choose **"FREE"** (Shared)
   - Select region closest to you
   - Click **"Create Cluster"**

3. **Create Database User**
   - Go to **"Database Access"**
   - Click **"Add New Database User"**
   - Choose **Password** authentication
   - Username: `trendoAdmin`
   - Generate secure password (save it!)
   - User Privileges: **"Read and write to any database"**
   - Click **"Add User"**

4. **Whitelist IP Address**
   - Go to **"Network Access"**
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (for development)
   - Click **"Confirm"**

5. **Get Connection String**
   - Go to **"Database"**
   - Click **"Connect"** on your cluster
   - Choose **"Connect your application"**
   - Copy the connection string
   - Replace `<password>` with your user password
   - Replace `<dbname>` with `trendo`

   ```
   MONGODB_URI=mongodb+srv://trendoAdmin:<password>@cluster0.xxxxx.mongodb.net/trendo?retryWrites=true&w=majority
   ```

---

## 🔐 Environment Variables

### Backend (.env)

Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/trendo
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trendo

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# OpenAI (Optional - for AI caption generation)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
# Get your key from: https://platform.openai.com/api-keys

# CORS
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)

Create `client/.env` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

### Method 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
✅ Firebase Admin initialized
🚀 Trendo Server Started Successfully!
📡 Server: http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Method 2: Single Terminal (Alternative)

Install `concurrently` globally:
```bash
npm install -g concurrently
```

Create a script in root package.json (optional):
```json
{
  "scripts": {
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\""
  }
}
```

Run both:
```bash
npm run dev
```

### 🎉 Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

---

## 🌐 Production Deployment

### Frontend - Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/trendo.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click **"Import Project"**
   - Select your `trendo` repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   
3. **Add Environment Variables**
   - In Vercel dashboard > Settings > Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
   - Click **"Deploy"**

4. **Get Frontend URL**
   - After deployment completes
   - Copy the URL (e.g., `https://trendo-xyz.vercel.app`)

### Backend - Deploy to Render

1. **Prepare for Deployment**
   
   Make sure `server/package.json` has:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click **"New +"** > **"Web Service"**
   - Connect your repository
   - Configure:
     - **Name**: `trendo-api`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Root Directory**: `server`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables**
   - In Render dashboard > Environment
   - Add all variables from your `.env` file:
     ```
     PORT=5000
     NODE_ENV=production
     MONGODB_URI=your_mongodb_atlas_uri
     OPENAI_API_KEY=your_openai_key
     CLIENT_URL=https://trendo-xyz.vercel.app
     ```
   
4. **Firebase Service Account**
   - Option 1: Copy JSON content and paste as environment variable
     ```
     FIREBASE_CONFIG={"type":"service_account",...entire JSON...}
     ```
     Update `config/firebase.js` to parse from env
   
   - Option 2: Use Render Secrets (Recommended)
     - Upload `serviceAccountKey.json` as a secret file

5. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment
   - Copy the URL (e.g., `https://trendo-api.onrender.com`)

### Update CORS and API URLs

1. **Update Frontend Environment**
   - In Vercel, update `VITE_API_URL` to your Render backend URL
   - Redeploy frontend

2. **Update Backend CORS**
   - In Render, update `CLIENT_URL` to your Vercel frontend URL
   - Redeploy backend

---

## 🧪 Testing the Deployment

1. Visit your Vercel URL
2. Try signing up/logging in
3. Upload a test video
4. Check if it appears in the feed
5. Test likes, comments, and sharing

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB is running: `mongosh`
- Verify connection string in `.env`
- For Atlas: Check IP whitelist and user credentials

### Firebase Auth Not Working
- Verify `firebaseConfig` in `client/src/config/firebase.js`
- Check if Authentication is enabled in Firebase Console
- Ensure domain is authorized in Firebase Console

### Videos Not Uploading
- Check Firebase Storage rules
- Verify `serviceAccountKey.json` exists in server folder
- Check browser console for errors

### AI Captions Not Working
- Verify `OPENAI_API_KEY` in `.env`
- Check OpenAI account has credits
- Check backend logs for API errors

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express Documentation](https://expressjs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

## 💡 Tips

1. **Development**: Use MongoDB local for faster development
2. **Production**: Use MongoDB Atlas for reliability
3. **API Keys**: Never commit API keys to Git
4. **Firebase**: Set up budget alerts to avoid surprise charges
5. **OpenAI**: Monitor API usage to control costs

---

## ✅ Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB running
- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Storage enabled
- [ ] Service account downloaded
- [ ] Frontend config updated
- [ ] Backend .env created
- [ ] Frontend .env created
- [ ] Dependencies installed
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can create account
- [ ] Can upload video
- [ ] Can view feed

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.

Good luck building with Trendo! 🚀
