# Troubleshooting: Blank Page

## ✅ What I Fixed

I fixed the routing issue where the Navbar was outside the RouterProvider. Now the structure is:

```
AuthContextProvider
  └── RouterProvider
      └── Layout (includes Navbar)
          └── Routes (Home, SignIn, etc.)
```

## 🚀 Next Steps

### Step 1: Restart Frontend

**IMPORTANT**: You MUST restart the frontend for changes to take effect!

```bash
# Stop frontend (Ctrl+C)
# Then restart:
npm run dev:frontend
```

### Step 2: Check Browser Console

Open browser console (F12) and look for errors:

1. **Press F12** to open DevTools
2. **Go to Console tab**
3. **Look for red error messages**

Common errors you might see:
- `Cannot read property 'user' of undefined` - Session issue
- `Failed to fetch` - Backend not running
- `useNavigate must be used within a Router` - Should be fixed now
- `Cannot find module` - Missing import

### Step 3: Check What You See

After restarting, you should see:

**If working:**
- ✅ Navbar at the top (blue bar with "UMass Lends")
- ✅ "Browse Items" heading
- ✅ Search bar and filters
- ✅ Item list (even if empty)

**If still blank:**
- ❌ Completely white page
- ❌ No navbar
- ❌ No content

### Step 4: Check Network Tab

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Refresh page** (F5)
4. **Look for failed requests** (red)

If you see failed requests to `http://localhost:3000/api/items`:
- Backend is not running → Start it with `npm run dev:backend`
- CORS error → Backend needs CORS headers (already added, but restart backend)

### Step 5: Verify Backend is Running

```bash
# In a separate terminal, check if backend is running:
curl http://localhost:3000/api/items
```

Or just open: `http://localhost:3000/api/items` in your browser

Should see JSON response (even if empty array).

## 🐛 Common Issues

### Issue 1: Still Blank After Restart

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. Backend is running
4. No JavaScript errors

**Fix:** Share the console errors and I'll help fix them.

### Issue 2: "Failed to fetch" Errors

**Symptom:** Console shows "Failed to fetch" when loading items

**Fix:**
1. Make sure backend is running: `npm run dev:backend`
2. Check backend URL is correct: `http://localhost:3000`
3. Restart backend (CORS headers need restart)

### Issue 3: "Cannot read property 'user' of undefined"

**Symptom:** Errors about `session.user`

**Fix:**
- This is usually okay (session might be undefined initially)
- Check if AuthContext is working
- Check browser console for specific error

### Issue 4: Page Loads but No Items

**Symptom:** See page but no items listed

**Possible causes:**
1. No items in database (this is okay, page should still show)
2. API call failing (check console)
3. Backend not running

**Fix:**
- Check console for errors
- Check Network tab for API calls
- Create some items using the API test or create item page

### Issue 5: Navbar Not Showing

**Symptom:** No blue navbar at top

**Fix:**
- Check if Layout component is working
- Check browser console for errors
- Verify router is set up correctly

## 🔍 Debug Steps

1. **Open browser console** (F12)
2. **Check for errors** - Look for red messages
3. **Check Network tab** - See if requests are working
4. **Try different routes** - `/signin`, `/signup`
5. **Check React DevTools** - See if components are rendering

## ✅ Quick Test

Try these URLs to test if routing works:

1. `http://localhost:5174/` - Home page
2. `http://localhost:5174/signin` - Sign in page
3. `http://localhost:5174/signup` - Sign up page

If these work, routing is fine. If they don't, there's a routing issue.

## 💡 What to Share

If the page is still blank after restarting:

1. **Console errors** - Copy any red error messages
2. **Network tab** - Screenshot of failed requests
3. **What you see** - Describe what's on the page
4. **Backend status** - Is backend running?

## 🎯 Expected Behavior

After fixing, you should see:

1. ✅ **Navbar** - Blue bar at top with "UMass Lends"
2. ✅ **Home page** - "Browse Items" heading
3. ✅ **Search bar** - Search input field
4. ✅ **Filters** - Dropdown menus
5. ✅ **Item list** - Items (or "No items found" if empty)
6. ✅ **No errors** - Console should be clean (or just warnings)

If you see all of these, it's working! 🎉

---

## 🚀 Quick Fix Summary

1. **Restart frontend**: `npm run dev:frontend`
2. **Check console**: Look for errors
3. **Check backend**: Make sure it's running
4. **Try different routes**: Test if routing works
5. **Share errors**: If still broken, share console errors

The routing issue should be fixed now. Restart the frontend and check the console!

