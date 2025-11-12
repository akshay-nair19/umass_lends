# 🔧 Fix Backend Connection Issue

## ❌ Problem

The frontend is deployed but can't connect to the backend. The error shows:
- URL has double slash: `https://umass-lends-seven.vercel.app//api/items`
- Error: "Cannot connect to server at https://umass-lends-seven.vercel.app//api/items"

## ✅ Fix Applied

I've updated the API configuration to:
1. **Normalize the API URL** - Remove trailing slashes to prevent double slashes
2. **Better URL handling** - Ensure URLs are constructed correctly

## 📋 Next Steps

### Step 1: Fix Netlify Environment Variable

The `VITE_API_URL` in Netlify might have a trailing slash. Fix it:

1. Go to Netlify Dashboard → Your Site → Site settings
2. Go to **Build & deploy** → **Environment variables**
3. Find **`VITE_API_URL`**
4. **Check the value** - it should be:
   ```
   https://umass-lends-seven.vercel.app
   ```
   **NOT:**
   ```
   https://umass-lends-seven.vercel.app/
   ```
   (No trailing slash!)

5. **Edit** the variable and remove any trailing slash
6. **Save** changes

### Step 2: Verify Backend URL

Make sure your backend URL is correct:
- Backend URL: `https://umass-lends-seven.vercel.app`
- Test it: Visit `https://umass-lends-seven.vercel.app` in your browser
- You should see the API landing page

### Step 3: Test Backend API

Test if your backend is working:
1. Visit: `https://umass-lends-seven.vercel.app/api/items`
2. You should see JSON response with items (or empty array)
3. If you get an error, your backend might not be deployed correctly

### Step 4: Redeploy Frontend

After fixing the environment variable:

1. Go to **Deploys** tab in Netlify
2. Click **"Clear cache and deploy site"**
3. Wait for build to complete
4. Test the frontend - it should now connect to the backend

## ✅ Expected Result

After the fix:
1. ✅ `VITE_API_URL` has no trailing slash
2. ✅ API calls go to: `https://umass-lends-seven.vercel.app/api/items`
3. ✅ No double slashes in URLs
4. ✅ Frontend connects to backend successfully
5. ✅ Items load correctly

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Problem:** Backend is not accessible or CORS issue

**Solution:**
1. Verify backend is deployed and accessible
2. Check backend CORS settings (should allow your Netlify domain)
3. Test backend URL directly in browser
4. Check browser console for specific CORS errors

### Error: "Cannot connect to server"

**Problem:** Backend URL is incorrect or backend is down

**Solution:**
1. Verify backend URL is correct in Netlify environment variables
2. Test backend URL: `https://umass-lends-seven.vercel.app`
3. Check Vercel dashboard to ensure backend is deployed
4. Check backend logs in Vercel for errors

### Still Getting Double Slash

**Problem:** Environment variable still has trailing slash

**Solution:**
1. Double-check `VITE_API_URL` in Netlify (no trailing slash)
2. Clear Netlify cache
3. Redeploy frontend
4. Check browser console for actual API_BASE URL

## 📝 Environment Variables Checklist

In Netlify → Environment variables, make sure you have:

```
VITE_API_URL=https://umass-lends-seven.vercel.app
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:** No trailing slash in `VITE_API_URL`!

## 🎯 Quick Fix

1. Go to Netlify → Environment variables
2. Edit `VITE_API_URL`
3. Remove trailing slash: `https://umass-lends-seven.vercel.app` (not `https://umass-lends-seven.vercel.app/`)
4. Save
5. Redeploy frontend

---

**After fixing the environment variable and redeploying, the frontend should connect to the backend successfully!**

