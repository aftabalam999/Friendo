# 🎯 Friendo - Installation & Verification Checklist

## ✅ Pre-Installation Checklist

### Required Software
- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] MongoDB installed OR MongoDB Atlas account
- [ ] Code editor (VS Code recommended)

### Required Accounts
- [ ] Firebase account created
- [ ] Firebase project created
- [ ] MongoDB Atlas account (if using cloud)
- [ ] OpenAI account (optional, for AI features)

---

## 📦 Installation Steps

### 1. Navigate to Project
```powershell
cd "c:\Users\Aftab Alam\Desktop\friendo"
```
- [ ] Successfully navigated to project directory

### 2. Install Backend Dependencies
```powershell
cd server
npm install
```
**Expected Output:**
- `added X packages` message
- No critical errors

**Verify:**
- [ ] `node_modules` folder created in `server/`
- [ ] No error messages during installation
- [ ] All packages installed successfully

### 3. Install Frontend Dependencies
```powershell
cd ..\client
npm install
```
**Expected Output:**
- `added X packages` message
- No critical errors

**Verify:**
- [ ] `node_modules` folder created in `client/`
- [ ] No error messages during installation
- [ ] All packages installed successfully

---

## ⚙️ Configuration Steps

### 4. Setup Backend Environment
```powershell
cd ..\server
Copy-Item .env.example .env
```

**Edit `server\.env` file:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/friendo
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
OPENAI_API_KEY=your_key_here
CLIENT_URL=http://localhost:3000
```

**Verify:**
- [ ] `.env` file created in `server/`
- [ ] MongoDB URI configured
- [ ] Firebase path set
- [ ] OpenAI key added (optional)

### 5. Setup Frontend Environment
```powershell
cd ..\client
Copy-Item .env.example .env
```

**Edit `client\.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Verify:**
- [ ] `.env` file created in `client/`
- [ ] API URL is correct

### 6. Configure Firebase (Client)

**Edit `client\src\config\firebase.js`:**

Replace with your Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**Verify:**
- [ ] Firebase config updated
- [ ] All fields filled with actual values
- [ ] No placeholder text remaining

### 7. Setup Firebase Admin (Server)

**Download `serviceAccountKey.json` from Firebase:**
1. Firebase Console → Project Settings
2. Service Accounts tab
3. Generate New Private Key
4. Save as `serviceAccountKey.json`
5. Move to `server/` directory

**Verify:**
- [ ] `serviceAccountKey.json` exists in `server/`
- [ ] File contains valid JSON
- [ ] File has proper permissions

---

## 🗄️ Database Setup

### 8. MongoDB Setup

**Option A: Local MongoDB**
```powershell
net start MongoDB
```
- [ ] MongoDB service started successfully
- [ ] No error messages

**Option B: MongoDB Atlas**
- [ ] Cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Connection string copied to `.env`

**Test Connection:**
```powershell
# In server directory
node -e "require('mongoose').connect('mongodb://localhost:27017/friendo').then(() => console.log('✅ Connected')).catch(err => console.log('❌ Error:', err))"
```
- [ ] Connection successful

---

## 🚀 Running the Application

### 9. Start Backend Server

```powershell
cd "c:\Users\Aftab Alam\Desktop\friendo\server"
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
✅ Firebase Admin initialized
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Friendo Server Started Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server: http://localhost:5000
🔧 Environment: development
📊 API Base: http://localhost:5000/api
```

**Verify:**
- [ ] Server started without errors
- [ ] MongoDB connected successfully
- [ ] Firebase initialized
- [ ] Server listening on port 5000

**Test Backend:**
Open browser: http://localhost:5000
- [ ] See welcome message
- [ ] API endpoints listed

### 10. Start Frontend (New Terminal)

```powershell
cd "c:\Users\Aftab Alam\Desktop\friendo\client"
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**Verify:**
- [ ] Frontend started without errors
- [ ] Vite dev server running
- [ ] No compilation errors
- [ ] Server listening on port 3000

**Test Frontend:**
Open browser: http://localhost:3000
- [ ] Page loads successfully
- [ ] No console errors
- [ ] Login page visible
- [ ] UI looks correct

---

## 🧪 Feature Testing

### 11. Test Authentication
- [ ] Click "Continue with Google"
- [ ] Google sign-in popup appears
- [ ] Sign in successfully
- [ ] Redirected to home page
- [ ] User avatar shows in navbar

**OR**

- [ ] Click "Sign Up" tab
- [ ] Enter email and password
- [ ] Create account successfully
- [ ] Redirected to home page

### 12. Test Video Feed
- [ ] Home page shows video feed (or empty state)
- [ ] Navigation works (Home, Trending, Profile)
- [ ] Bottom nav visible on mobile view

### 13. Test Video Upload
- [ ] Click "Upload" button
- [ ] Modal opens
- [ ] Select video file (MP4/WebM)
- [ ] Video preview shows
- [ ] Enter title
- [ ] Click "AI Generate" (if OpenAI configured)
- [ ] Caption appears
- [ ] Hashtags added
- [ ] Click "Upload Video"
- [ ] Progress bar shows
- [ ] Upload completes
- [ ] Video appears in feed

### 14. Test Video Interactions
- [ ] Video autoplays when scrolled into view
- [ ] Click to pause/play
- [ ] Like button works (heart turns red)
- [ ] Like count increases
- [ ] Comment button opens modal
- [ ] Can add comment
- [ ] Comment appears in list
- [ ] Share button works

### 15. Test Trending Page
- [ ] Navigate to Trending
- [ ] Videos appear
- [ ] Rank badges visible (#1, #2, etc.)
- [ ] Can interact with videos

### 16. Test Profile Page
- [ ] Navigate to Profile
- [ ] User info displays
- [ ] Stats show (videos, likes, views)
- [ ] Uploaded videos in grid
- [ ] Can switch tabs (My Videos / Liked)
- [ ] Logout button works

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
```
Solution:
1. Check if MongoDB is running: mongosh
2. Verify MONGODB_URI in .env
3. For Atlas: Check IP whitelist
```
- [ ] MongoDB connection working

**Firebase Admin Error:**
```
Solution:
1. Check serviceAccountKey.json exists
2. Verify file has valid JSON
3. Check file path in .env
```
- [ ] Firebase Admin working

**Port 5000 in Use:**
```powershell
# Find process
netstat -ano | findstr :5000
# Kill process
taskkill /PID <PID> /F
```
- [ ] Port 5000 available

### Frontend Issues

**API Connection Failed:**
```
Solution:
1. Check backend is running
2. Verify VITE_API_URL in .env
3. Check browser console for CORS errors
```
- [ ] API connection working

**Firebase Auth Not Working:**
```
Solution:
1. Check firebaseConfig in firebase.js
2. Verify Auth enabled in Firebase Console
3. Check browser console for errors
```
- [ ] Firebase Auth working

**Port 3000 in Use:**
```powershell
# Change port in vite.config.js or kill process
```
- [ ] Port 3000 available

---

## ✅ Final Verification

### Backend Checklist
- [ ] Server starts without errors
- [ ] MongoDB connected
- [ ] Firebase Admin initialized
- [ ] API endpoints respond
- [ ] CORS configured correctly
- [ ] Environment variables loaded

### Frontend Checklist
- [ ] App loads without errors
- [ ] No console errors
- [ ] Firebase initialized
- [ ] API calls work
- [ ] Routing works
- [ ] Styles load correctly

### Features Checklist
- [ ] Authentication works (Google + Email)
- [ ] Video upload works
- [ ] Video playback works
- [ ] Like functionality works
- [ ] Comment functionality works
- [ ] Trending page works
- [ ] Profile page works
- [ ] AI caption generation works (if configured)

### UI/UX Checklist
- [ ] Dark theme applied
- [ ] Gradient colors visible
- [ ] Animations smooth
- [ ] Responsive on mobile
- [ ] Bottom nav works on mobile
- [ ] Glassmorphism effects visible
- [ ] Icons load correctly

---

## 📊 Performance Check

### Frontend
- [ ] Initial load < 3 seconds
- [ ] Page transitions smooth
- [ ] No layout shifts
- [ ] Animations at 60fps

### Backend
- [ ] API response < 100ms
- [ ] Database queries fast
- [ ] No memory leaks
- [ ] Error handling works

---

## 🎉 Success Criteria

**Your installation is successful if:**

1. ✅ Both servers start without errors
2. ✅ You can sign up/login
3. ✅ You can upload a video
4. ✅ Video appears in feed
5. ✅ You can like and comment
6. ✅ Profile page shows your data
7. ✅ No console errors
8. ✅ UI looks good and responsive

---

## 📝 Installation Summary

```
✅ Dependencies Installed
   - Backend: X packages
   - Frontend: Y packages

✅ Configuration Complete
   - Environment variables set
   - Firebase configured
   - MongoDB connected

✅ Services Running
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

✅ All Features Working
   - Authentication ✓
   - Video Upload ✓
   - Video Feed ✓
   - Interactions ✓
   - Trending ✓
   - Profile ✓
```

---

## 🚀 Next Steps

1. **Customize** - Add your branding
2. **Test** - Try all features thoroughly
3. **Develop** - Add custom features
4. **Deploy** - Follow SETUP_GUIDE.md for deployment
5. **Share** - Show off your project!

---

## 📞 Need Help?

If you encounter issues:
1. Check this checklist item by item
2. Review error messages carefully
3. Check browser console for errors
4. Review server logs for backend errors
5. Consult SETUP_GUIDE.md for detailed help
6. Check Firebase/MongoDB documentation

---

**Congratulations! You now have a fully functional TikTok clone running locally!** 🎉

Time to create amazing content! 🚀
