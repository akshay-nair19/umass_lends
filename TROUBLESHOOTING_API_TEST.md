# Troubleshooting: API Test "Failed to Fetch"

## 🐛 Problem

The API test buttons show "Failed to fetch" errors.

## ✅ Solutions

### 1. Make Sure Backend is Running

**Check if backend is running**:
```bash
# In a separate terminal, start the backend:
npm run dev:backend
# or
npm run dev
```

**Verify it's running**:
- Open browser and go to: `http://localhost:3000/api/items`
- Should see JSON response (even if empty array)
- If you see "Cannot GET /api/items" or connection error, backend isn't running

### 2. Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for specific error messages
4. Common errors:
   - `Failed to fetch` - Backend not running or CORS issue
   - `NetworkError` - Backend not running
   - `CORS error` - CORS headers missing

### 3. Verify CORS is Fixed

I've added CORS headers to ALL API routes. **Restart your backend server** after the changes:

```bash
# Stop the backend (Ctrl+C)
# Then restart:
npm run dev:backend
```

### 4. Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click a test button
4. Look for the request:
   - **Status**: Should be 200, 201, or 401 (not "failed")
   - **Request URL**: Should be `http://localhost:3000/api/...`
   - **Response**: Should show the JSON response

### 5. Test Direct URL

Test if backend is accessible:

```javascript
// In browser console
fetch('http://localhost:3000/api/items')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

If this fails, the backend isn't running or isn't accessible.

---

## 🔧 Step-by-Step Fix

### Step 1: Start Backend

```bash
# Terminal 1 - Backend
npm run dev:backend
```

Wait for: `✓ Ready in Xs` or `Compiled successfully`

### Step 2: Verify Backend is Running

Open browser and visit: `http://localhost:3000/api/items`

Should see: `{"success":true,"data":[]}` or similar JSON

### Step 3: Check Frontend is Running

```bash
# Terminal 2 - Frontend (if not already running)
npm run dev:frontend
```

### Step 4: Sign In

1. Go to `http://localhost:5173/signin`
2. Sign in with your credentials
3. Go to dashboard

### Step 5: Test API

1. Click "Test: Get Items" (should work - no auth needed)
2. If that works, try "Test: Create Item"
3. Check browser console for errors

---

## 🧪 Manual Test

Test in browser console:

```javascript
// Test 1: Check backend is accessible
fetch('http://localhost:3000/api/items')
  .then(r => r.json())
  .then(data => console.log('✅ Backend works:', data))
  .catch(err => console.error('❌ Backend error:', err));

// Test 2: Test with auth
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

fetch('http://localhost:3000/api/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: 'Test Item',
    description: 'Testing',
    category: 'Electronics',
    available: true,
  }),
})
  .then(r => r.json())
  .then(data => console.log('✅ Auth works:', data))
  .catch(err => console.error('❌ Auth error:', err));
```

---

## ✅ Checklist

- [ ] Backend server is running (`npm run dev:backend`)
- [ ] Backend is accessible (`http://localhost:3000/api/items` works)
- [ ] Frontend is running (`npm run dev:frontend`)
- [ ] Signed in to the app
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows requests going through
- [ ] CORS headers are in responses (check Network tab → Headers)

---

## 💡 Common Issues

### Issue: "Failed to fetch" - Backend not running
**Solution**: Start backend with `npm run dev:backend`

### Issue: CORS error in console
**Solution**: Restart backend server (CORS headers have been added)

### Issue: 401 Unauthorized
**Solution**: Make sure you're signed in and token is valid

### Issue: Network error
**Solution**: 
- Check backend is running
- Check URL is correct (`http://localhost:3000`)
- Check firewall isn't blocking

---

## 🚀 Quick Fix

1. **Restart backend**:
   ```bash
   # Stop (Ctrl+C)
   npm run dev:backend
   ```

2. **Hard refresh browser**: Ctrl+Shift+R

3. **Test again**: Click "Test: Get Items" first (easiest test)

4. **Check console**: Look for specific error messages

---

## 📋 Test Order

Test in this order:

1. ✅ **Backend accessible**: Visit `http://localhost:3000/api/items` in browser
2. ✅ **Get Items**: Click "Test: Get Items" (no auth needed)
3. ✅ **Create Item**: Click "Test: Create Item" (needs auth)
4. ✅ **Other endpoints**: Test remaining endpoints

If step 1 fails, backend isn't running. If step 2 fails, there's a CORS or connection issue.

