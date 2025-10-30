# 🎨 Friendo - UI/UX Design Guide

## 🌈 Color System

### Primary Colors
```css
/* Indigo - Main Brand Color */
--primary: #6366f1;
--primary-hover: #5558e3;
--primary-light: #818cf8;
--primary-dark: #4f46e5;

/* Pink - Secondary/Accent */
--secondary: #ec4899;
--secondary-hover: #db2777;
--secondary-light: #f472b6;
--secondary-dark: #be185d;

/* Purple - Accent */
--accent: #8b5cf6;
--accent-hover: #7c3aed;
--accent-light: #a78bfa;
--accent-dark: #6d28d9;
```

### Dark Theme Colors
```css
/* Backgrounds */
--dark-900: #0f172a;  /* Main background */
--dark-800: #1e293b;  /* Card background */
--dark-700: #334155;  /* Hover states */

/* Text */
--text-white: #ffffff;
--text-gray-100: #f1f5f9;
--text-gray-300: #cbd5e1;
--text-gray-400: #94a3b8;
--text-gray-500: #64748b;
```

### Gradient Definitions
```css
/* Neon Gradient - Primary */
background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);

/* Neon Gradient - Alternative */
background: linear-gradient(90deg, #6366f1 0%, #ec4899 100%);

/* Subtle Gradient - Backgrounds */
background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);

/* Text Gradient */
background: linear-gradient(135deg, #6366f1, #ec4899);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 📐 Spacing Scale

### Spacing System (based on 4px)
```css
--space-1: 4px;    /* 0.25rem */
--space-2: 8px;    /* 0.5rem */
--space-3: 12px;   /* 0.75rem */
--space-4: 16px;   /* 1rem */
--space-5: 20px;   /* 1.25rem */
--space-6: 24px;   /* 1.5rem */
--space-8: 32px;   /* 2rem */
--space-10: 40px;  /* 2.5rem */
--space-12: 48px;  /* 3rem */
--space-16: 64px;  /* 4rem */
--space-20: 80px;  /* 5rem */
--space-24: 96px;  /* 6rem */
```

### Usage Examples
```jsx
// Margins
className="m-4"      // 16px margin
className="mt-6"     // 24px margin-top
className="mb-8"     // 32px margin-bottom

// Padding
className="p-4"      // 16px padding
className="px-6"     // 24px horizontal padding
className="py-8"     // 32px vertical padding

// Gaps
className="gap-4"    // 16px gap between flex/grid items
className="space-y-4" // 16px vertical space between children
```

---

## 🔤 Typography

### Font Families
```css
/* Primary - Headings, Body */
font-family: 'Poppins', sans-serif;

/* Secondary - UI Text */
font-family: 'Inter', sans-serif;

/* Monospace - Code */
font-family: 'Fira Code', monospace;
```

### Font Sizes
```css
--text-xs: 12px;     /* 0.75rem - Captions, Labels */
--text-sm: 14px;     /* 0.875rem - Small text */
--text-base: 16px;   /* 1rem - Body text */
--text-lg: 18px;     /* 1.125rem - Large body */
--text-xl: 20px;     /* 1.25rem - Subheadings */
--text-2xl: 24px;    /* 1.5rem - Section titles */
--text-3xl: 30px;    /* 1.875rem - Page titles */
--text-4xl: 36px;    /* 2.25rem - Large headings */
--text-5xl: 48px;    /* 3rem - Hero text */
```

### Font Weights
```css
--font-light: 300;   /* Light text */
--font-normal: 400;  /* Body text */
--font-medium: 500;  /* Emphasis */
--font-semibold: 600; /* Headings */
--font-bold: 700;    /* Strong headings */
--font-extrabold: 800; /* Display text */
```

### Typography Hierarchy
```jsx
// Hero Title
<h1 className="text-5xl font-extrabold gradient-text">
  Friendo
</h1>

// Page Title
<h2 className="text-3xl font-bold text-white">
  Trending Now
</h2>

// Section Title
<h3 className="text-2xl font-semibold text-white">
  Your Videos
</h3>

// Card Title
<h4 className="text-xl font-semibold text-white">
  Video Title
</h4>

// Body Text
<p className="text-base text-gray-300">
  Description text
</p>

// Small Text
<span className="text-sm text-gray-400">
  Secondary info
</span>

// Caption
<span className="text-xs text-gray-500">
  Metadata
</span>
```

---

## 🎭 Component Styles

### Button Styles

#### Primary Button (Gradient)
```jsx
<button className="
  bg-gradient-to-r from-primary via-accent to-secondary
  text-white
  px-6 py-3
  rounded-full
  font-semibold
  ripple-button
  neon-glow
  hover:scale-105
  active:scale-95
  transition-all
">
  Upload Video
</button>
```

#### Secondary Button
```jsx
<button className="
  bg-dark-800
  text-white
  px-6 py-2
  rounded-xl
  font-semibold
  hover:bg-dark-700
  transition-all
">
  Cancel
</button>
```

#### Icon Button
```jsx
<button className="
  w-12 h-12
  rounded-full
  bg-dark-800/50
  backdrop-blur-sm
  flex items-center justify-center
  hover:bg-dark-700
  transition-all
">
  <Icon className="w-6 h-6 text-white" />
</button>
```

### Card Styles

#### Glass Card
```jsx
<div className="
  glass
  rounded-3xl
  p-6
  card-hover
  border border-white/10
">
  {/* Card content */}
</div>
```

#### Video Card
```jsx
<div className="
  relative
  aspect-[9/16]
  rounded-xl
  overflow-hidden
  bg-black
  card-hover
">
  <video className="w-full h-full object-cover" />
  {/* Overlay content */}
</div>
```

### Input Styles

#### Text Input
```jsx
<input
  type="text"
  className="
    w-full
    bg-dark-800
    text-white
    px-4 py-3
    rounded-xl
    outline-none
    focus:ring-2 focus:ring-primary
    placeholder:text-gray-500
  "
  placeholder="Enter text..."
/>
```

#### Search Input
```jsx
<div className="relative">
  <input
    type="search"
    className="
      w-full
      bg-dark-800
      text-white
      pl-12 pr-4 py-3
      rounded-full
      outline-none
      focus:ring-2 focus:ring-primary
    "
    placeholder="Search videos..."
  />
  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
</div>
```

#### Textarea
```jsx
<textarea
  className="
    w-full
    bg-dark-800
    text-white
    px-4 py-3
    rounded-xl
    outline-none
    focus:ring-2 focus:ring-primary
    resize-none
  "
  rows="4"
  placeholder="Write a caption..."
/>
```

---

## ✨ Special Effects

### Glassmorphism
```css
.glass {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Neon Glow
```css
.neon-glow {
  box-shadow: 
    0 0 20px rgba(99, 102, 241, 0.5),
    0 0 40px rgba(236, 72, 153, 0.3);
}
```

### Ripple Effect
```css
.ripple-button {
  position: relative;
  overflow: hidden;
}

.ripple-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple-button:active::before {
  width: 300px;
  height: 300px;
}
```

---

## 🎬 Animations

### Fade In
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>
```

### Scale Hover
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>
```

### Slide In Modal
```jsx
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 25 }}
>
  {/* Modal content */}
</motion.div>
```

### Floating Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default: Mobile (< 640px) */

/* Tablet */
@media (min-width: 640px) {
  /* sm: */
}

/* Laptop */
@media (min-width: 768px) {
  /* md: */
}

/* Desktop */
@media (min-width: 1024px) {
  /* lg: */
}

/* Large Desktop */
@media (min-width: 1280px) {
  /* xl: */
}

/* Extra Large */
@media (min-width: 1536px) {
  /* 2xl: */
}
```

### Responsive Examples
```jsx
// Responsive Text
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>

// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>

// Responsive Spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>

// Show/Hide on Mobile
<div className="hidden md:block">
  {/* Desktop only */}
</div>

<div className="md:hidden">
  {/* Mobile only */}
</div>
```

---

## 🎯 Layout Patterns

### Container
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Centered Content
```jsx
<div className="min-h-screen flex items-center justify-center">
  {/* Centered content */}
</div>
```

### Grid Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

### Flex Layout
```jsx
<div className="flex items-center justify-between">
  {/* Flex items */}
</div>
```

### Stack Layout
```jsx
<div className="flex flex-col space-y-4">
  {/* Stacked items */}
</div>
```

---

## 🎨 Component Examples

### User Avatar
```jsx
<img
  src={user.photoURL}
  alt={user.displayName}
  className="
    w-12 h-12
    rounded-full
    border-2 border-primary
    object-cover
  "
/>
```

### Badge
```jsx
<span className="
  bg-gradient-to-r from-primary to-secondary
  text-white
  px-3 py-1
  rounded-full
  text-xs
  font-semibold
">
  Trending
</span>
```

### Loading Spinner
```jsx
<div className="
  w-10 h-10
  border-3 border-gray-700
  border-t-primary
  rounded-full
  animate-spin
" />
```

### Progress Bar
```jsx
<div className="w-full bg-dark-700 rounded-full h-2">
  <div
    className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
    style={{ width: `${progress}%` }}
  />
</div>
```

---

## 🌟 Design Principles

### 1. Consistency
- Use the same spacing scale throughout
- Maintain consistent border radius
- Stick to the color palette
- Use the same animation timings

### 2. Hierarchy
- Clear visual hierarchy with typography
- Important actions use primary colors
- Secondary actions use muted colors
- Proper use of white space

### 3. Feedback
- Hover states on interactive elements
- Loading states for async actions
- Success/error messages for user actions
- Visual feedback on interactions

### 4. Accessibility
- High contrast text (WCAG AA compliant)
- Large touch targets (44px minimum)
- Keyboard navigation support
- Screen reader friendly markup

### 5. Performance
- Optimized animations (GPU accelerated)
- Lazy loading images/videos
- Efficient re-renders
- Proper image compression

---

## 📊 Design Tokens

```javascript
// tokens.js
export const tokens = {
  colors: {
    primary: '#6366f1',
    secondary: '#ec4899',
    accent: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    glow: '0 0 20px rgba(99, 102, 241, 0.5)',
    card: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
};
```

---

**This design system ensures a consistent, beautiful, and modern UI throughout Friendo!** 🎨✨
