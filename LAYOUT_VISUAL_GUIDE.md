# 📱 Visual Layout Guide - TikTok/Reels Style

## 🖥️ Desktop View (1024px+)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ┌─────────────┐                                                 ┃
┃ │             │  ┌──────────────────────────────────────────┐  ┃
┃ │   FRIENDO   │  │ [○] Story1 [○] Story2 [○] Story3 ... →  │  ┃
┃ │     🅣      │  └──────────────────────────────────────────┘  ┃
┃ │             │                                                 ┃
┃ │ 🏠 Home     │              ┌────────────────┐                ┃
┃ │ 🔥 Trending │              │                │                ┃
┃ │ 🧭 Explore  │              │                │                ┃
┃ │ ❤️  Notify  │              │   PHONE-WIDTH  │                ┃
┃ │ 💬 Messages │              │     VIDEO      │                ┃
┃ │ 👤 Profile  │              │     PLAYING    │                ┃
┃ │             │              │                │                ┃
┃ │ ┌─────────┐ │              │   @username    │         ❤️ 234 ┃
┃ │ │ Upload  │ │              │   Caption...   │         💬 45  ┃
┃ │ │  Video  │ │              │   #trending    │         ↗️     ┃
┃ │ └─────────┘ │              │                │         ⋮      ┃
┃ │             │              └────────────────┘                ┃
┃ │ ┌─────────┐ │                                                 ┃
┃ │ │ [pic]   │ │                                                 ┃
┃ │ │ John    │ │                                                 ┃
┃ │ │ @john   │ │                                                 ┃
┃ │ └─────────┘ │                                                 ┃
┃ └─────────────┘                                                 ┃
┃      256px                    448px max                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Key Elements:**
- **Left Sidebar (256px):** Always visible, fixed position
- **Stories (Top):** Horizontal scroll, offset 256px from left
- **Video Feed:** Centered, max-width 448px (phone width)
- **Dark Sides:** Background visible on sides of video

---

## 📱 Mobile View (<1024px)

```
┏━━━━━━━━━━━━━┓
┃ [○] Story1  ┃ ← Stories (horizontal scroll)
┃ [○] Story2  ┃
┃ [○] Story3→ ┃
┣━━━━━━━━━━━━━┫
┃             ┃
┃             ┃
┃   VIDEO     ┃ ← Full-width video
┃   PLAYING   ┃   (phone-width on small screens)
┃   IN        ┃
┃   VERTICAL  ┃
┃   FORMAT    ┃
┃             ┃
┃ @username   ┃ ← User info (bottom-left)
┃ Caption...  ┃
┃ #trending   ┃
┃          ❤️ ┃ ← Actions (right side)
┃          💬 ┃
┃          ↗️ ┃
┃          ⋮  ┃
┣━━━━━━━━━━━━━┫
┃ 🏠 🔥 ➕ ❤️ 👤┃ ← Bottom Nav (Icons Only)
┗━━━━━━━━━━━━━┛
```

**Key Elements:**
- **Stories (Top):** Full-width horizontal scroll
- **Video Feed:** Full-width vertical scroll
- **Bottom Nav:** Icon-only, 5 items
- **No Sidebar:** Sidebar hidden on mobile

---

## 🎨 Component Breakdown

### 1. Stories Section

```
┌──────────────────────────────────────────────┐
│ ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐ →   │
│ │[+] │  │[😊]│  │[👤]│  │[🧑]│  │[👨]│     │
│ │Add │  │John│  │Jane│  │Mike│  │Sara│     │
│ └────┘  └────┘  └────┘  └────┘  └────┘     │
└──────────────────────────────────────────────┘
  Gradient   New      New    Viewed   New
   Border   Story    Story    Story   Story
```

**Features:**
- First item: "Your Story" with + icon
- Gradient border for new stories
- Gray border for viewed stories
- Names truncated
- Horizontal scroll (no scrollbar)

---

### 2. Sidebar (Desktop)

```
┌─────────────┐
│   FRIENDO   │ ← Logo (rotating on hover)
│     🅣      │
├─────────────┤
│ 🏠 Home     │ ← Active (gradient background)
│ 🔥 Trending │
│ 🧭 Explore  │
│ ❤️  Notify  │
│ 💬 Messages │
│ 👤 Profile  │
├─────────────┤
│ ┌─────────┐ │
│ │ Upload  │ │ ← Upload button (gradient)
│ │  Video  │ │
│ └─────────┘ │
├─────────────┤
│ ┌─────────┐ │
│ │ [pic]   │ │ ← User profile card
│ │ John    │ │
│ │ @john   │ │
│ └─────────┘ │
└─────────────┘
```

**Features:**
- Fixed left position
- 256px width
- Glassmorphism effect
- Icon + Label format
- Active state highlighting
- Upload button with glow
- User card at bottom

---

### 3. Bottom Navigation (Mobile)

```
┌─────────────────────────────────┐
│   🏠     🔥     ➕     ❤️     👤  │
│  Home  Trend  Upload Notif Prof │
└─────────────────────────────────┘
```

**Features:**
- Icon-only (no labels)
- Upload button: Circular gradient background
- Active state: Color + background tint
- Fixed bottom position
- Safe area padding for notched devices

---

### 4. Video Card

```
┌────────────────┐
│                │ ← Video playing
│    [PLAY]      │
│                │
│                │
│ ┌──────────┐  │
│ │ [pic]    │  │ ← User info
│ │ @user    │  │
│ │ Name     │  │
│ └──────────┘  │
│                │
│ Caption text   │ ← Caption
│ #hashtags      │ ← Hashtags
│                │
│             ❤️ │ ← Actions
│             💬 │   (right)
│             ↗️ │
│             ⋮  │
└────────────────┘
```

**Layout:**
- Full-height video
- User info: Bottom-left
- Actions: Bottom-right
- Snap scroll behavior
- Auto-play when in view

---

## 📐 Spacing & Measurements

### Desktop:
```
Sidebar width:     256px (w-64)
Video max-width:   448px (max-w-md)
Stories height:    ~100px
Total offset:      256px (sidebar)
```

### Mobile:
```
Video width:       100% (max 448px)
Bottom nav height: ~60px
Stories height:    ~100px
Content padding:   16px
```

### Video Card:
```
User info position:  bottom-24 (6rem/96px)
Actions position:    bottom-28 (7rem/112px)
Icon sizes:          w-7 h-7 (28px)
Spacing between:     space-y-5 (1.25rem/20px)
```

---

## 🎨 Color Coding

### Active States:
```css
/* Sidebar Active */
background: linear-gradient(to right, #6366f1, #ec4899);
color: white;

/* Bottom Nav Active */
color: #6366f1;
background: rgba(99, 102, 241, 0.1);

/* Story New */
border: linear-gradient(135deg, #6366f1, #ec4899);

/* Story Viewed */
border: #6b7280 (gray-600);
```

### Backgrounds:
```css
/* Main */
background: #0f172a (dark-900);

/* Glass */
background: rgba(30, 41, 59, 0.4);
backdrop-filter: blur(12px);

/* Sidebar/Stories */
background: rgba(30, 41, 59, 0.4);
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## 🔄 Responsive Behavior

### Breakpoints:

```css
/* Mobile: < 1024px */
- Sidebar: hidden
- Bottom nav: visible
- Video: full-width (max 448px)
- Stories: full-width

/* Desktop: >= 1024px */
- Sidebar: visible (fixed left)
- Bottom nav: hidden
- Video: centered, max 448px
- Stories: offset for sidebar
- Content: margin-left 256px
```

### Layout Shifts:

```
Mobile → Desktop (at 1024px):
1. Sidebar slides in from left
2. Content shifts right 256px
3. Bottom nav fades out
4. Video centers with max-width
5. Stories offset for sidebar
```

---

## 📱 Screen Examples

### Small Mobile (320px):
```
Full-width video feed
Bottom nav visible
Stories full-width
Compact spacing
```

### Large Mobile (768px):
```
Video max-width enforced
Bottom nav visible
More padding
Better spacing
```

### Tablet (1024px):
```
Sidebar appears
Bottom nav disappears
Video centered
Dark sides visible
```

### Desktop (1440px+):
```
Sidebar + centered video
Wide dark background
Optimal viewing
Professional layout
```

---

## ✨ Animations

### Sidebar:
```javascript
initial={{ x: -100, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
```

### Bottom Nav:
```javascript
initial={{ y: 100 }}
animate={{ y: 0 }}
```

### Stories:
```javascript
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Video Snap:
```css
scroll-snap-type: y mandatory;
scroll-snap-align: start;
```

---

## 🎯 User Interaction

### Desktop Flow:
1. Use sidebar to navigate
2. Scroll stories horizontally
3. Scroll videos vertically
4. Click upload in sidebar
5. Profile card at bottom

### Mobile Flow:
1. Use bottom nav icons
2. Scroll stories horizontally
3. Swipe videos vertically
4. Tap upload button (center)
5. Profile icon in bottom nav

---

## 📊 Layout Comparison

### Before:
```
┌──────────────────────┐
│    TOP NAVBAR        │
├──────────────────────┤
│                      │
│   FULL-WIDTH VIDEO   │
│   FEED               │
│                      │
├──────────────────────┤
│  BOTTOM NAV (MOBILE) │
└──────────────────────┘
```

### After:
```
Desktop:
┌───────┬──────────────┐
│       │ [Stories]    │
│ SIDE  ├──────────────┤
│ BAR   │ ┌──────────┐ │
│       │ │  VIDEO   │ │
│       │ │  PHONE   │ │
│       │ │  WIDTH   │ │
│       │ └──────────┘ │
└───────┴──────────────┘

Mobile:
┌──────────────┐
│  [Stories]   │
├──────────────┤
│              │
│   VIDEO      │
│   FULL       │
│   WIDTH      │
│              │
├──────────────┤
│ 🏠 🔥 ➕ ❤️ 👤│
└──────────────┘
```

---

## 🎉 Summary

**New TikTok/Reels-style layout:**

✅ Phone-width vertical videos (centered on desktop)  
✅ Left sidebar with full navigation (desktop)  
✅ Top stories section (horizontal scroll)  
✅ Bottom icon-only nav (mobile)  
✅ Snap scroll between videos  
✅ Hidden scrollbars  
✅ Responsive design  
✅ Glassmorphism UI  

**Experience:**
- **Desktop:** Professional with sidebar
- **Mobile:** Full TikTok/Reels clone
- **Both:** Vertical phone-width videos

---

**Visual perfection achieved!** 🎨✨
