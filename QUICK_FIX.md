# Quick Fix: Frontend Not Working

## 🔧 Immediate Fixes

### 1. Install Missing Dependencies

```bash
npm install react-router-dom
```

### 2. Fix Vite Config

The config has been updated to use the correct plugin. If you still get errors:

```bash
# Reinstall dependencies
npm install
```

### 3. Set Up Environment Variables

Make sure your `.env` file has:

```env
# For Vite frontend (REQUIRED)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# For Next.js backend (if running backend)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Important**: Use the SAME Supabase URL and key for both, just different variable names!

### 4. Start Frontend

```bash
npm run dev:frontend
```

This should start on `http://localhost:5173` (or another port)

---

## 🚨 Dashboard Access Issues

### Why Dashboard Might Not Work

The `PrivateRoute` component redirects to `/signup` if:
1. **No session exists** (you're not signed in)
2. **Session is still loading** (`session === undefined`)

### How to Fix

1. **Sign in first**:
   - Go to `http://localhost:5173/signin`
   - Enter your email and password
   - Click "Sign In"

2. **Check if you're signed in**:
   - Open browser console (F12)
   - Run: `supabase.auth.getSession()`
   - If it returns `null`, you need to sign in

3. **If you don't have an account**:
   - Go to `http://localhost:5173/signup`
   - Create an account
   - Then sign in

---

## 🧪 Debug Steps

### Step 1: Check Frontend is Running

```bash
npm run dev:frontend
```

Look for output like:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 2: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check if Supabase is loaded

### Step 3: Check Environment Variables

In browser console, run:
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
```

If it's `undefined`, your env variables aren't loaded.

**Fix**: 
- Make sure `.env` file exists in root directory
- Make sure variables start with `VITE_`
- Restart Vite server

### Step 4: Test Sign In

1. Go to `http://localhost:5173/signin`
2. Enter credentials
3. Click "Sign In"
4. Check console for errors

### Step 5: Check Session

In browser console:
```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

If `session` is `null`, you're not signed in.

---

## ✅ Checklist

- [ ] `react-router-dom` installed (`npm install react-router-dom`)
- [ ] Environment variables set (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Vite server restarted after adding env variables
- [ ] Frontend running (`npm run dev:frontend`)
- [ ] Browser shows the app (no errors)
- [ ] Can access `/signin` page
- [ ] Can sign in successfully
- [ ] Session exists after signing in
- [ ] Can access `/dashboard` after signing in

---

## 🎯 Quick Test

1. **Start frontend**: `npm run dev:frontend`
2. **Open browser**: Go to URL shown in terminal (usually `http://localhost:5173`)
3. **Go to sign-in**: `http://localhost:5173/signin`
4. **Sign in**: Enter email and password
5. **Check console**: Run `supabase.auth.getSession()` to verify session
6. **Go to dashboard**: `http://localhost:5173/dashboard`

---

## 💡 Common Issues

### "Cannot access dashboard"
- **Solution**: Make sure you're signed in first

### "Redirects to /signup"
- **Solution**: This means no session exists - sign in first

### "Environment variables not working"
- **Solution**: 
  - Use `VITE_` prefix
  - Restart Vite server
  - Check `.env` file is in root directory

### "Frontend won't start"
- **Solution**: 
  - Run `npm install`
  - Check for error messages
  - Make sure all dependencies are installed

