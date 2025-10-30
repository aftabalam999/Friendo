# 🔧 Firebase Storage CORS Fix

## Issue
CORS policy blocking video uploads to Firebase Storage.

## ✅ Solution Steps

### Step 1: Update Storage Rules
1. Go to: https://console.firebase.google.com/project/friendo-9e595/storage/rules
2. Click on the **"Rules"** tab
3. Replace with this:

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

4. Click **"Publish"**

### Step 2: Verify Storage Bucket
The storage bucket URL has been updated to: `friendo-9e595.appspot.com`

### Step 3: Test Upload
1. Refresh your browser at http://localhost:3000
2. Click the Upload button
3. Select a video file
4. Try uploading again

## 🔍 Troubleshooting

If still not working:

### Option A: Enable CORS via Firebase Console
1. Go to Storage → Files
2. Click on the 3 dots menu → Edit bucket CORS configuration
3. Add:
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

### Option B: Use Google Cloud Console
1. Go to: https://console.cloud.google.com/storage/browser
2. Select your bucket: `friendo-9e595.appspot.com`
3. Click "Edit bucket CORS configuration"
4. Add the CORS rules from Option A

### Option C: Command Line (Advanced)
Create `cors.json`:
```json
[
  {
    "origin": ["http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

Run:
```bash
gsutil cors set cors.json gs://friendo-9e595.appspot.com
```

## ✅ Expected Result
After fixing:
- No CORS errors in console
- Video uploads successfully
- Progress bar shows upload progress
- Video appears in feed after upload

---

**Storage bucket updated to: `friendo-9e595.appspot.com`**
**Next: Update Storage Rules in Firebase Console**
