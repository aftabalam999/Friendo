# 🧪 Trendo - Testing Guide

## ✅ Complete Feature Testing Checklist

Follow these steps to test all features systematically.

---

## 🔐 **Test 1: Authentication**

### Google Sign-In Test:
1. ✅ Open http://localhost:3000
2. ✅ Click "Continue with Google"
3. ✅ Select your Google account
4. ✅ Should redirect to home page
5. ✅ Your avatar should appear in navbar

**Expected Result:** Successfully logged in, user synced to MongoDB

### Email/Password Sign-Up Test:
1. ✅ Click "Sign Up" tab
2. ✅ Enter:
   - Display Name: `Test User`
   - Email: `test@trendo.com`
   - Password: `test123456`
3. ✅ Click "Sign Up"
4. ✅ Should redirect to home page

**Expected Result:** Account created, logged in successfully

### Email/Password Login Test:
1. ✅ Logout (click avatar → Logout)
2. ✅ Click "Login" tab
3. ✅ Enter same credentials
4. ✅ Click "Login"
5. ✅ Should redirect to home page

**Expected Result:** Login successful

---

## 🎥 **Test 2: Video Upload**

### Upload Test:
1. ✅ Click "Upload" button in navbar (or floating + button on mobile)
2. ✅ Upload modal should open with glassmorphism effect
3. ✅ Click "Click to upload video"
4. ✅ Select a video file (MP4 or WebM, under 100MB)
5. ✅ Video preview should appear
6. ✅ Enter Title: `My First Trendo Video`
7. ✅ Enter Caption: `Testing the upload feature!`
8. ✅ Enter Hashtags: `#test #trendo #fyp`
9. ✅ Click "Upload Video"
10. ✅ Progress bar should show upload progress
11. ✅ Modal should close when complete
12. ✅ Video should appear in feed

**Expected Result:** 
- Progress bar shows 0% → 100%
- Upload success message
- Video appears in home feed
- Video is playable

### AI Caption Test (if OpenAI configured):
1. ✅ Open upload modal
2. ✅ Select video
3. ✅ Enter Title only
4. ✅ Click "✨ AI Generate" button
5. ✅ Should show "Generating..."
6. ✅ Caption and hashtags auto-fill

**Expected Result:** AI generates relevant caption and hashtags

---

## 📺 **Test 3: Video Feed**

### Home Feed Test:
1. ✅ Go to Home page (click "Home" in navbar)
2. ✅ Videos should display in vertical scroll
3. ✅ Scroll to bring video into view
4. ✅ Video should autoplay when 70% visible
5. ✅ Click video to pause/play
6. ✅ Swipe/scroll to next video
7. ✅ Previous video should pause

**Expected Result:** Smooth TikTok-style feed experience

### Video Player Controls:
1. ✅ Tap video → should pause
2. ✅ Tap again → should play
3. ✅ Scroll up/down → videos change smoothly
4. ✅ Video shows user avatar and username
5. ✅ Caption and hashtags visible

**Expected Result:** Smooth playback controls

---

## ❤️ **Test 4: Social Interactions**

### Like Test:
1. ✅ Click heart icon on a video
2. ✅ Heart should turn red
3. ✅ Like count should increase by 1
4. ✅ Click again to unlike
5. ✅ Heart should turn white
6. ✅ Like count should decrease by 1

**Expected Result:** Like/Unlike works, count updates in real-time

### Comment Test:
1. ✅ Click comment icon
2. ✅ Comment modal slides up from bottom
3. ✅ Type a comment: `Great video!`
4. ✅ Click "Post"
5. ✅ Comment should appear in list
6. ✅ Your avatar and name should show
7. ✅ Comment count should increase

**Expected Result:** Comments work, display correctly

### Share Test:
1. ✅ Click share icon
2. ✅ Native share dialog appears (or link copied)
3. ✅ Share to another app or copy link

**Expected Result:** Share functionality works

---

## 🔥 **Test 5: Trending Page**

### Trending Test:
1. ✅ Click "Trending" in navbar
2. ✅ Page shows "Trending Now" header
3. ✅ Videos sorted by likes (highest first)
4. ✅ Rank badges show (#1, #2, #3...)
5. ✅ All interactions work (like, comment, share)

**Expected Result:** Trending videos display with rankings

---

## 👤 **Test 6: Profile Page**

### Profile View Test:
1. ✅ Click "Profile" in navbar
2. ✅ Profile page loads without errors
3. ✅ Shows your avatar and name
4. ✅ Shows stats:
   - Videos: correct count
   - Likes: total likes on all your videos
   - Views: total views (currently 0, needs implementation)
5. ✅ "My Videos" tab is active
6. ✅ Your uploaded videos show in grid

**Expected Result:** Profile displays correctly with stats

### Video Grid Test:
1. ✅ Click "My Videos" tab
2. ✅ Your videos show in 2-3 column grid
3. ✅ Hover over video → should scale up slightly
4. ✅ Shows video title, likes, views
5. ✅ Click "Liked" tab
6. ✅ Shows videos you've liked (empty for now)

**Expected Result:** Video grid works, tab switching works

### Logout Test:
1. ✅ Click "Logout" button
2. ✅ Should redirect to auth page
3. ✅ No longer logged in

**Expected Result:** Logout successful

---

## 📱 **Test 7: Mobile Responsive**

### Mobile View Test:
1. ✅ Open DevTools (F12)
2. ✅ Toggle device toolbar (Ctrl+Shift+M)
3. ✅ Select "iPhone 12 Pro" or similar
4. ✅ Bottom navigation bar should appear
5. ✅ Floating + button visible
6. ✅ All features work on mobile

**Expected Result:** Perfect mobile experience

---

## 🎨 **Test 8: UI/UX Features**

### Animation Test:
1. ✅ Buttons have ripple effect on click
2. ✅ Cards have hover animations
3. ✅ Page transitions are smooth
4. ✅ Upload modal has slide-in animation
5. ✅ Comment modal slides from bottom

**Expected Result:** Smooth, beautiful animations

### Dark Theme Test:
1. ✅ Background is dark (#0f172a)
2. ✅ Cards have glassmorphism effect
3. ✅ Neon gradient colors visible
4. ✅ Custom scrollbar with gradient
5. ✅ Text is readable (high contrast)

**Expected Result:** Beautiful dark theme

---

## 🔍 **Test 9: Error Handling**

### Upload Error Test:
1. ✅ Try uploading >100MB file
2. ✅ Should show error message
3. ✅ Try uploading non-video file
4. ✅ Should show error

**Expected Result:** Proper error messages

### Network Error Test:
1. ✅ Stop backend server
2. ✅ Try to upload video
3. ✅ Should show "Failed to upload" error
4. ✅ Restart backend
5. ✅ Should work again

**Expected Result:** Graceful error handling

---

## 📊 **Test 10: Performance**

### Load Time Test:
1. ✅ Clear cache (Ctrl+Shift+Delete)
2. ✅ Reload page
3. ✅ Should load in < 3 seconds
4. ✅ Videos load smoothly
5. ✅ No lag when scrolling

**Expected Result:** Fast, smooth performance

### Multiple Videos Test:
1. ✅ Upload 3-5 videos
2. ✅ Scroll through feed
3. ✅ Autoplay works for each
4. ✅ Memory usage stays reasonable
5. ✅ No crashes or freezes

**Expected Result:** Handles multiple videos well

---

## ✅ **Final Checklist**

After testing all features, verify:

- [ ] Authentication works (Google + Email)
- [ ] Video upload works (no CORS errors)
- [ ] Videos play in feed
- [ ] Likes/Comments work
- [ ] Trending page works
- [ ] Profile page works (no errors)
- [ ] Mobile responsive
- [ ] Beautiful UI/animations
- [ ] Error handling works
- [ ] Performance is good

---

## 🐛 **Found Issues? Report Format:**

If you find any bugs, report them like this:

```
Issue: [Brief description]
Steps to reproduce:
1. ...
2. ...
3. ...

Expected: [What should happen]
Actual: [What actually happens]
Error message (if any): [paste error]
```

---

## 📝 **Test Results**

As you test, mark each section:
- ✅ Working perfectly
- ⚠️ Works but has minor issues
- ❌ Not working
- 🔧 Needs improvement

---

## 🎉 **After Testing**

Once all tests pass, we can:
1. Add the Friend Request & Chat system
2. Deploy to production
3. Add more features

---

**Start testing now! Go to http://localhost:3000 and follow the checklist!** 🚀

Let me know what works and what doesn't! 💪
