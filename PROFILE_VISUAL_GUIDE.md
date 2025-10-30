# 👤 Profile Page - Visual Guide

## 🖼️ Profile Display Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  FRIENDO                                   🏠 🔥 👤  [Upload]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │    ┌──────────┐                                           │ │
│  │    │          │     John Doe                              │ │
│  │    │  PHOTO   │     @johndoe                              │ │
│  │    │          │                                           │ │
│  │    └──────────┘     Content creator and tech enthusiast  │ │
│  │                                                            │ │
│  │                     👤 Male   📞 +1 234 567 8900          │ │
│  │                     📅 6/15/1995                          │ │
│  │                                                            │ │
│  │                     ┌─────┐  ┌─────┐  ┌──────┐           │ │
│  │                     │  12 │  │  85 │  │ 1.2K │           │ │
│  │                     │Videos│ │Likes│  │Views │           │ │
│  │                     └─────┘  └─────┘  └──────┘           │ │
│  │                                                            │ │
│  │                     [⚙ Edit Profile]  [🚪 Logout]        │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  [📱 My Videos]  │  [❤️ Liked]                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────┐  ┌──────┐  ┌──────┐                                 │
│  │VIDEO │  │VIDEO │  │VIDEO │                                 │
│  │  #1  │  │  #2  │  │  #3  │                                 │
│  │      │  │      │  │      │                                 │
│  │ ❤ 23 │  │ ❤ 45 │  │ ❤ 17 │                                 │
│  │👁 120│  │👁 280│  │👁 95 │                                 │
│  └──────┘  └──────┘  └──────┘                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✏️ Edit Profile Modal Layout

```
           ┌─────────────────────────────────────────┐
           │  Edit Profile                       ✕  │
           ├─────────────────────────────────────────┤
           │                                         │
           │  Profile Image                          │
           │  ┌──────┐                               │
           │  │PHOTO │  [Change Photo]               │
           │  │PREV. │                               │
           │  └──────┘                               │
           │  Or paste image URL below:              │
           │  [https://example.com/image.jpg]        │
           │                                         │
           │  Display Name                           │
           │  [John Doe                    ]         │
           │                                         │
           │  Bio                                    │
           │  ┌─────────────────────────────┐        │
           │  │Content creator and tech     │        │
           │  │enthusiast                   │        │
           │  └─────────────────────────────┘        │
           │  48/150 characters                      │
           │                                         │
           │  Gender                                 │
           │  [Male                    ▼]            │
           │                                         │
           │  Mobile Number                          │
           │  [+1 234 567 8900         ]             │
           │                                         │
           │  Date of Birth                          │
           │  [06/15/1995              📅]           │
           │                                         │
           │  [Cancel]  [Save Changes]               │
           │                                         │
           └─────────────────────────────────────────┘
```

---

## 🎨 Field Examples

### Profile Image
**Options:**
1. Upload file: User selects image → Preview shown immediately
2. Paste URL: `https://i.pravatar.cc/300?img=8`

**Examples of free image URLs:**
```
https://i.pravatar.cc/300?img=1
https://i.pravatar.cc/300?img=2
https://randomuser.me/api/portraits/men/75.jpg
https://randomuser.me/api/portraits/women/65.jpg
```

### Display Name
**Examples:**
```
John Doe
Jane Smith
TechGuru2024
CoolCreator
```

### Bio
**Examples:**
```
Content creator and tech enthusiast 🚀
Love making videos about coding and tech
Just here to share my creative journey ✨
Professional photographer | Travel lover
```
**Max:** 150 characters

### Gender
**Options:**
```
[Dropdown]
├── Prefer not to say (default)
├── Male
├── Female
└── Other
```

### Mobile Number
**Examples:**
```
+1 234 567 8900
+44 20 7123 4567
(555) 123-4567
123-456-7890
```
**Note:** No format validation currently - accepts any text

### Date of Birth
**Format:** Based on browser locale
```
US Format: 06/15/1995
UK Format: 15/06/1995
ISO Format: 1995-06-15
```
**Validation:** Cannot select future dates

---

## 📱 Mobile View

```
┌─────────────────────────┐
│  FRIENDO     ☰          │
├─────────────────────────┤
│                         │
│     ┌──────────┐        │
│     │          │        │
│     │  PHOTO   │        │
│     │          │        │
│     └──────────┘        │
│                         │
│      John Doe           │
│      @johndoe           │
│                         │
│  Content creator and    │
│  tech enthusiast        │
│                         │
│  👤 Male                │
│  📞 +1 234 567 8900     │
│  📅 6/15/1995           │
│                         │
│  ┌───┐ ┌───┐ ┌────┐   │
│  │12 │ │85 │ │1.2K│   │
│  │Vid│ │Lks│ │Viws│   │
│  └───┘ └───┘ └────┘   │
│                         │
│  [⚙ Edit Profile]      │
│  [🚪 Logout]           │
│                         │
├─────────────────────────┤
│[My Videos] │ [Liked]   │
├─────────────────────────┤
│                         │
│  ┌────┐     ┌────┐    │
│  │VID1│     │VID2│    │
│  │    │     │    │    │
│  │❤ 23│     │❤ 45│    │
│  └────┘     └────┘    │
│                         │
└─────────────────────────┘
```

---

## 🌈 Color Scheme

### Profile Card
- **Background:** Glassmorphism effect (semi-transparent with blur)
- **Border:** Gradient border with primary colors
- **Text:** White (name), Gray-400 (username, labels)

### Profile Picture
- **Border:** 4px solid with primary color
- **Size:** 128px × 128px (desktop), 96px × 96px (mobile)
- **Shape:** Circular with object-cover

### Stats Cards
- **Numbers:** Gradient text (primary → secondary)
- **Labels:** Gray-400, small font

### Buttons
- **Edit Profile:** Gradient background (primary → secondary)
- **Logout:** Dark-800 background, hover effect
- **Border Radius:** Full (rounded-full)

### Icons
- **Gender:** FiUser (React Icons)
- **Mobile:** FiPhone
- **Date:** FiCalendar
- **Color:** Gray-400

---

## 🎭 States

### Empty State (New User)
```
┌─────────────────────────────────┐
│  ┌──────┐                       │
│  │      │  User                 │
│  │  ?   │  @newuser             │
│  │      │                       │
│  └──────┘                       │
│                                  │
│  ┌─┐  ┌─┐  ┌─┐                 │
│  │0│  │0│  │0│                 │
│  └─┘  └─┘  └─┘                 │
│  Videos Likes Views             │
│                                  │
│  [⚙ Edit Profile]              │
│                                  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  🎬                             │
│  You haven't uploaded any       │
│  videos yet                     │
│                                  │
│  [Upload Your First Video]      │
└─────────────────────────────────┘
```

### With Bio Only
```
┌─────────────────────────────────┐
│  ┌──────┐                       │
│  │      │  John Doe             │
│  │PHOTO │  @johndoe             │
│  │      │                       │
│  └──────┘  Just here to share   │
│             my journey ✨        │
│                                  │
│  ┌──┐  ┌──┐  ┌───┐             │
│  │5 │  │12│  │345│             │
│  └──┘  └──┘  └───┘             │
│                                  │
└─────────────────────────────────┘
```

### Complete Profile
```
┌─────────────────────────────────┐
│  ┌──────┐                       │
│  │      │  John Doe             │
│  │PHOTO │  @johndoe             │
│  │      │                       │
│  └──────┘  Content creator      │
│                                  │
│  👤 Male   📞 +1 234 567 8900  │
│  📅 6/15/1995                   │
│                                  │
│  ┌──┐  ┌──┐  ┌────┐            │
│  │12│  │85│  │1.2K│            │
│  └──┘  └──┘  └────┘            │
│                                  │
└─────────────────────────────────┘
```

### Gender Hidden (Privacy)
```
If gender is:
- "" (empty)
- "prefer-not-to-say"

Then: 👤 Male does NOT appear
Only show: 📞 Mobile and 📅 Date
```

---

## 🔄 User Flows

### Flow 1: First Time Profile Setup
```
Login → Navigate to Profile → See empty profile 
  → Click "Edit Profile" → Fill all fields 
  → Upload/paste profile image → Click "Save Changes" 
  → See success message → Modal closes 
  → Profile shows all data
```

### Flow 2: Updating Existing Profile
```
Navigate to Profile → See current data 
  → Click "Edit Profile" → Form pre-filled 
  → Change specific fields (e.g., bio) 
  → Click "Save Changes" → Success message 
  → Modal closes → Profile refreshes → See updates
```

### Flow 3: Changing Profile Picture via URL
```
Click "Edit Profile" → See current photo preview 
  → Scroll to image URL field 
  → Paste: https://i.pravatar.cc/300?img=8 
  → Preview updates immediately 
  → Click "Save Changes" → Success 
  → New photo appears on profile
```

### Flow 4: Changing Profile Picture via File
```
Click "Edit Profile" → See current photo preview 
  → Click "Change Photo" button 
  → File picker opens → Select image.jpg 
  → Preview updates immediately 
  → Click "Save Changes" 
  → See note: "will be implemented..." 
  → (Currently URL method recommended)
```

### Flow 5: Privacy Mode (Hide Personal Info)
```
Click "Edit Profile" 
  → Gender: Select "Prefer not to say" 
  → Mobile Number: Leave blank 
  → Date of Birth: Leave blank 
  → Fill only Name and Bio 
  → Save → Profile shows ONLY Name and Bio 
  → Personal info hidden
```

---

## ✨ Animations

### Profile Card
- **Entry:** Fade in + slide up (opacity 0→1, y: 20→0)
- **Duration:** ~300ms

### Profile Picture
- **Hover:** Scale 1.05 (grows 5%)
- **Transition:** Smooth ease

### Edit Modal
- **Backdrop:** Fade in (opacity 0→1)
- **Modal:** Scale in (0.9→1) + fade in
- **Exit:** Reverse animation

### Buttons
- **Hover:** Background color change
- **Active:** Slight scale down (0.98)
- **Glow:** Neon glow on primary button

### Tabs
- **Active Tab:** Gradient background
- **Inactive Tab:** Gray text
- **Transition:** Background + color change

---

## 📊 Data Display Logic

### Videos Count
```javascript
Array.isArray(userVideos) ? userVideos.length : 0
```
Shows: Number of videos uploaded by user

### Total Likes
```javascript
Array.isArray(userVideos) 
  ? userVideos.reduce((acc, video) => acc + (video.likes || 0), 0) 
  : 0
```
Shows: Sum of all likes across user's videos

### Total Views
```javascript
Array.isArray(userVideos) 
  ? userVideos.reduce((acc, video) => acc + (video.views || 0), 0) 
  : 0
```
Shows: Sum of all views across user's videos

### Bio Display
```javascript
{editForm.bio && (
  <p className="text-gray-300 text-sm mb-3 max-w-md">
    {editForm.bio}
  </p>
)}
```
Shows: Only if bio exists (not empty string)

### Gender Display
```javascript
{editForm.gender && 
 editForm.gender !== '' && 
 editForm.gender !== 'prefer-not-to-say' && (
  <div>
    <FiUser /> <span>{editForm.gender}</span>
  </div>
)}
```
Shows: Only if gender is set and not privacy option

### Mobile Display
```javascript
{editForm.mobileNumber && (
  <div>
    <FiPhone /> <span>{editForm.mobileNumber}</span>
  </div>
)}
```
Shows: Only if mobile number exists

### Date Display
```javascript
{editForm.dateOfBirth && (
  <div>
    <FiCalendar /> 
    <span>{new Date(editForm.dateOfBirth).toLocaleDateString()}</span>
  </div>
)}
```
Shows: Only if date of birth exists, formatted to locale

---

## 🎯 Key Features Summary

✅ **Dynamic Data Loading** - Fetches from MongoDB on page load  
✅ **Pre-filled Forms** - Edit modal shows current values  
✅ **Real-time Preview** - Image preview updates instantly  
✅ **Conditional Display** - Only shows filled fields  
✅ **Privacy Controls** - Can hide personal info  
✅ **Stats Calculation** - Auto-calculates totals  
✅ **Responsive Design** - Works on mobile and desktop  
✅ **Smooth Animations** - Framer Motion transitions  
✅ **Error Handling** - Shows alerts on errors  
✅ **Data Persistence** - Saves to MongoDB  

---

## 🔍 Troubleshooting Visual Issues

### Issue: Profile Picture Not Showing
**Check:**
- Is `photoURL` set in database?
- Is URL accessible (try opening in browser)?
- Check browser console for CORS errors

**Fix:**
- Use a valid, publicly accessible URL
- Example: `https://i.pravatar.cc/300?img=8`

### Issue: Bio Not Showing
**Check:**
- Is `bio` field filled in edit form?
- Did you save changes?

**Fix:**
- Edit profile → Add bio → Save

### Issue: Gender/Mobile/DOB Not Showing
**Check:**
- Are these fields filled?
- Is gender set to "prefer-not-to-say"?

**Fix:**
- Edit profile → Fill fields → Select visible gender option → Save

### Issue: Stats Showing 0
**Check:**
- Have you uploaded any videos?
- Check "My Videos" tab

**Fix:**
- Upload a video from home page
- Refresh profile page

### Issue: Layout Broken on Mobile
**Check:**
- Browser viewport width
- Tailwind responsive classes working?

**Fix:**
- Clear browser cache
- Check for CSS conflicts
- Verify Tailwind CDN loaded

---

**This completes the visual guide for the Profile Page!** 🎨

All features are now implemented and ready to use. Navigate to `/profile` to see your profile!
