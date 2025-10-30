# 🔧 Signup Network Error - Fix Guide

## Issues Fixed

### 1. ✅ App Name Updated
- Changed all "Trendo" references to "Friendo" throughout the app
- Updated database name from `trendo` to `friendo`

### 2. ✅ Better Error Handling
- Improved error messages in `authService.js`
- Added network error detection
- Added user-friendly error alerts in `AuthPage.jsx`

### 3. ✅ Environment Configuration
- Created `client/.env` with correct API URL
- Updated `server/.env` to use `friendo` database

## How to Test

### Step 1: Restart Backend Server
```bash
cd "c:\Users\Aftab Alam\Desktop\Trendo-Compact-version\Trenod-1\server"
npm run dev
```

**Expected output:**
```
🚀 Friendo Server Started Successfully!
📡 Server: http://localhost:5000
✅ MongoDB Connected
```

### Step 2: Restart Frontend
```bash
cd "c:\Users\Aftab Alam\Desktop\Trendo-Compact-version\Trenod-1\client"
npm run dev
```

**Expected output:**
```
VITE ready
Local: http://localhost:3000
```

### Step 3: Test Registration

1. Open browser to `http://localhost:3000/auth`
2. Click "Sign Up" tab
3. Fill in:
   - Display Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123456`
4. Click "Sign Up"

### Step 4: Check Browser Console (F12)

You should see:
```
Attempting to register with email: test@example.com
```

## Common Issues & Solutions

### ❌ "Network Error" Message

**Cause:** Backend server is not running or wrong URL

**Solution:**
1. Make sure backend is running on port 5000
2. Check `client/.env` has: `VITE_API_URL=http://localhost:5000/api`
3. Restart frontend after changing `.env`

### ❌ "User already exists" Error

**Cause:** Email is already registered

**Solution:**
- Use a different email address
- Or delete the user from MongoDB:
```bash
# In MongoDB shell
use friendo
db.users.deleteOne({ email: "test@example.com" })
```

### ❌ CORS Error

**Cause:** CORS configuration mismatch

**Solution:**
Check `server/.env` has:
```
CLIENT_URL=http://localhost:3000
```

### ❌ MongoDB Connection Failed

**Cause:** MongoDB not running or wrong connection string

**Solution:**
- Check internet connection (using MongoDB Atlas)
- Verify `.env` has correct `MONGODB_URI`

## What Was Changed

### Files Modified:

1. **client/.env** (Created)
   - Added API URL configuration

2. **server/.env**
   - Changed database from `trendo` to `friendo`

3. **client/src/services/authService.js**
   - Added better error handling
   - Added network error detection
   - Improved error messages

4. **client/src/pages/AuthPage.jsx**
   - Added console logging for debugging
   - Added error alert to show user what went wrong

5. **server/server.js**
   - Updated "Trendo" to "Friendo" in messages

## Testing Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] MongoDB connected successfully
- [ ] Can see login page
- [ ] Can switch between Login/Signup tabs
- [ ] Registration form shows validation errors for short passwords
- [ ] Registration works with valid credentials
- [ ] User is redirected to home page after signup
- [ ] Can logout and login again

## Debug Commands

### Test Backend API Directly:
```bash
# Windows PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
```

### Check if server is responding:
```bash
curl http://localhost:5000/api/health
```

### Test registration endpoint:
```bash
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"new@test.com","password":"test123","displayName":"New User"}'
```

## Need More Help?

1. **Check browser console** (F12 → Console tab)
   - Look for red error messages
   - Check what API calls are being made

2. **Check server terminal**
   - Look for incoming requests
   - Check for error messages

3. **Check Network tab** (F12 → Network tab)
   - Filter by "Fetch/XHR"
   - Click on "register" request
   - Check status code and response

## Success Indicators

✅ No errors in browser console
✅ Server logs show: `📝 User registration request received`
✅ Server logs show: `✅ User registered successfully`
✅ User is redirected to home page
✅ User data is stored in localStorage
✅ MongoDB has new user document

---

**App Name:** Friendo
**Version:** 1.0.0
**Last Updated:** 2025-10-29
