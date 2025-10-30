# Firebase to JWT Migration Guide

## ✅ Completed Changes

### Backend
1. **Installed JWT dependencies**: `bcryptjs`, `jsonwebtoken`, `cookie-parser`
2. **Created JWT utilities** (`server/utils/jwt.js`):
   - Token generation (access & refresh tokens)
   - Token verification
   - Configurable expiration times

3. **Updated User Model** (`server/models/User.js`):
   - Removed `uid` field (now using MongoDB `_id`)
   - Added `password` field (hashed with bcrypt)
   - Added password comparison method
   - Pre-save hook for password hashing

4. **Created Auth Controller** (`server/controllers/authController.js`):
   - `/api/auth/register` - Register new users
   - `/api/auth/login` - Login with email/password
   - `/api/auth/refresh-token` - Refresh access tokens
   - `/api/auth/me` - Get current user
   - `/api/auth/logout` - Logout

5. **Updated Auth Middleware** (`server/middleware/auth.js`):
   - Replaced Firebase token verification with JWT verification
   - Now checks `req.user.id` instead of `req.user.uid`

6. **Updated Server** (`server/server.js`):
   - Added auth routes
   - Removed Firebase config dependency

### Frontend
1. **Removed Firebase**: Uninstalled `firebase` package
2. **Created Auth Service** (`client/src/services/authService.js`):
   - Register, login, logout functions
   - Token management (access & refresh)
   - Automatic token refresh

3. **Updated API Service** (`client/src/services/api.js`):
   - Token stored as `accessToken` (not `authToken`)
   - Automatic token refresh on 401 errors
   - Removed Firebase user sync

4. **Updated useAuth Hook** (`client/src/hooks/useAuth.js`):
   - Removed Firebase authentication
   - Uses JWT-based authentication
   - User data from `user.id` (not `user.uid`)

5. **Updated AuthPage** (`client/src/pages/AuthPage.jsx`):
   - Removed Google Sign-In
   - Email/password authentication only
   - Better form validation

6. **Updated References**:
   - `ProfilePage`: Changed `user.uid` → `user.id`
   - `ChatPage`: Changed `user.uid` → `user.id`
   - `ChatListPage`: Changed `user.uid` → `user.id`

## ⚠️ Known Issues to Fix

### Backend Controllers Need Updates
The following files still reference `uid` and need to be updated to use `_id`:

1. **chatController.js**: 
   - Change `req.user.uid` → `req.user.id`
   - Change `User.findOne({ uid: ... })` → `User.findById(...)`

2. **friendController.js** (partially done):
   - Change remaining `req.user.uid` → `req.user.id`
   - Change `User.findOne({ uid: ... })` → `User.findById(...)`

3. **videoController.js**:
   - Change `req.user.uid` → `req.user.id`

### Database Migration Required
Since we removed the `uid` field, existing users in MongoDB need to be migrated or the database should be cleared for a fresh start.

**Option 1: Clear Database (Recommended for Development)**
```bash
# Connect to MongoDB
mongosh
# Use friendo database
use friendo
# Drop all collections
db.users.drop()
db.friendrequests.drop()
db.messages.drop()
db.videos.drop()
```

**Option 2: Keep Data** (More complex - not recommended unless you have important data)
- Would require a migration script to update references

## 🔧 Required Configuration

### Server Environment Variables
Update `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/friendo
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CLIENT_URL=http://localhost:3001
OPENAI_API_KEY=your_openai_api_key_here
```

**IMPORTANT**: Change `JWT_SECRET` to a strong random string in production!

## 📝 API Changes

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "displayName": "John Doe"
  }
  ```

- `POST /api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/refresh-token` - Refresh access token
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

- `GET /api/auth/me` - Get current user (requires auth)

- `POST /api/auth/logout` - Logout (requires auth)

### User ID Format
- **Before**: Firebase UID (string like `abc123xyz`)
- **After**: MongoDB ObjectId (string like `507f1f77bcf86cd799439011`)

## 🚀 Testing

1. **Clear existing auth data**:
   ```javascript
   localStorage.clear();
   ```

2. **Register a new user** via `/auth` page

3. **Test login/logout**

4. **Verify token refresh** (wait 7 days or modify JWT expiry for testing)

## 📋 Migration Checklist

- [x] Install JWT dependencies
- [x] Create JWT utilities
- [x] Update User model
- [x] Create auth controller
- [x] Update auth middleware
- [x] Add auth routes to server
- [x] Remove Firebase from frontend
- [x] Create auth service
- [x] Update useAuth hook
- [x] Update AuthPage
- [x] Update API interceptors
- [x] Update ProfilePage references
- [x] Update ChatPage references
- [x] Update ChatListPage references
- [ ] Update chatController uid references
- [ ] Update friendController uid references
- [ ] Update videoController uid references
- [ ] Clear/migrate database
- [ ] Test full authentication flow
- [ ] Update documentation

## 🎯 Benefits of JWT over Firebase

1. **No External Dependencies**: Complete control over authentication
2. **Cost**: Free, no Firebase billing
3. **Customization**: Full control over token structure and validation
4. **Privacy**: User data stays on your server
5. **Performance**: No external API calls for token verification
6. **Simplicity**: Standard JWT implementation, widely documented

## ⚡ Next Steps

1. Complete the controller updates (chat, friend, video)
2. Clear the database for testing
3. Test the complete authentication flow
4. Consider adding:
   - Email verification
   - Password reset functionality
   - Rate limiting for auth endpoints
   - Account lockout after failed attempts
