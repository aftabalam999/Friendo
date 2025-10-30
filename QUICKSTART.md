# 🎬 Trendo - Quick Start Guide

## 🚀 Get Running in 5 Minutes!

### Step 1: Install Dependencies (2 minutes)

Open PowerShell and run:

```powershell
# Navigate to project
cd "c:\Users\Aftab Alam\Desktop\trendo"

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ..\client
npm install
```

### Step 2: Setup Environment Files (1 minute)

**Backend (.env):**
```powershell
cd ..\server
Copy-Item .env.example .env
```

Edit `server\.env` and add:
- MongoDB connection string (use `mongodb://localhost:27017/trendo` for local)
- Your Firebase service account path
- (Optional) OpenAI API key

**Frontend (.env):**
```powershell
cd ..\client
Copy-Item .env.example .env
```

The default `http://localhost:5000/api` should work!

### Step 3: Firebase Setup (2 minutes)

1. Go to https://console.firebase.google.com/
2. Create new project
3. Enable Authentication (Google + Email/Password)
4. Enable Storage
5. Get web app config → paste in `client\src\config\firebase.js`
6. Download service account JSON → save as `server\serviceAccountKey.json`

### Step 4: Start MongoDB

```powershell
# Start MongoDB service (if installed locally)
net start MongoDB
```

Or use MongoDB Atlas (cloud) - see SETUP_GUIDE.md

### Step 5: Run the App! 🎉

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\Aftab Alam\Desktop\trendo\server"
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\Aftab Alam\Desktop\trendo\client"
npm run dev
```

### Step 6: Open in Browser

Go to: **http://localhost:3000**

---

## 🎯 What You Can Do Now

✅ Sign up with Google or Email  
✅ Upload short videos (MP4/WebM)  
✅ Use AI to generate captions  
✅ Like, comment, and share videos  
✅ View trending videos  
✅ Check your profile  

---

## ⚡ Quick Tips

- **No MongoDB?** Use MongoDB Atlas free tier (cloud)
- **No OpenAI Key?** AI features will use fallback captions
- **Port conflict?** Change PORT in `server\.env`

---

## 📚 Need More Help?

- Full setup guide: `SETUP_GUIDE.md`
- Main documentation: `README.md`
- Troubleshooting: Check SETUP_GUIDE.md

---

**Enjoy building with Trendo!** 🚀
