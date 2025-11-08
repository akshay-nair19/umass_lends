# Troubleshooting Frontend Issues

## 🐛 Common Issues and Solutions

### Issue 1: Frontend Won't Start

**Error**: `Cannot find module '@vitejs/plugin-react-swc'`

**Solution**: Fixed! The config now uses `@vitejs/plugin-react` which is installed.

**If you still get errors**:
```bash
# Reinstall dependencies
npm install
```

---

### Issue 2: Cannot Navigate to Dashboard

**Possible causes**:
1. **Not signed in** - PrivateRoute redirects to `/signup` if no session
2. **Session not loading** - Check browser console for errors
3. **Environment variables missing** - Vite needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Solution**:

1. **Check if you're signed in**:
   - Open browser console (F12)
   - Run: `supabase.auth.getSession()`
   - If it returns `null`, you need to sign in first

2. **Check environment variables**:
   - Make sure `.env` file has:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Restart Vite server after adding env variables

3. **Check browser console**:
   - Look for any error messages
   - Check Network tab for failed requests

---

### Issue 3: "Cannot find module 'react-router-dom'"

**Solution**: 
```bash
npm install react-router-dom
```

---

### Issue 4: Dashboard Redirects to Signup

**Cause**: The PrivateRoute component checks if `session` exists. If `session` is `undefined` (still loading) or `null` (not signed in), it redirects.

**Check**:
1. Are you actually signed in?
2. Is the session loading? (Check browser console)
3. Are Supabase environment variables set correctly?

**Debug**:
```javascript
// In browser console
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

---

### Issue 5: Environment Variables Not Working

**For Vite**, environment variables must:
1. Start with `VITE_` prefix
2. Be in `.env` file in root directory
3. Server must be restarted after adding them

**Check**:
```javascript
// In browser console or component
console.log(import.meta.env.VITE_SUPABASE_URL);
```

If it's `undefined`, the env variable isn't loaded.

---

## 🔧 Step-by-Step Fix

### 1. Check Environment Variables

Create/update `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Install All Dependencies

```bash
npm install
```

### 3. Start Frontend

```bash
npm run dev:frontend
```

### 4. Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check if Supabase is connected

### 5. Test Sign In

1. Go to `http://localhost:5173/signin`
2. Enter email and password
3. Click "Sign In"
4. Check console for errors

### 6. Check Session

In browser console:
```javascript
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log('Session:', session);
  if (session) {
    console.log('✅ Signed in as:', session.user.email);
  } else {
    console.log('❌ Not signed in');
  }
});
```

---

## 🎯 Quick Debug Checklist

- [ ] Environment variables set (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Vite server restarted after adding env variables
- [ ] All dependencies installed (`npm install`)
- [ ] Frontend server running (`npm run dev:frontend`)
- [ ] Browser console shows no errors
- [ ] Supabase client can connect (check console)
- [ ] User is actually signed in (check session)
- [ ] PrivateRoute is working (check if it redirects)

---

## 💡 Common Mistakes

1. **Wrong environment variable names** - Must be `VITE_` prefix for Vite
2. **Not restarting server** - Must restart after changing `.env`
3. **Not signed in** - Can't access dashboard without session
4. **Wrong port** - Check terminal output for actual port number
5. **CORS issues** - Make sure Supabase URL is correct

---

## 🚀 Quick Test

1. **Start frontend**: `npm run dev:frontend`
2. **Open browser**: Go to the URL shown in terminal
3. **Check console**: Open DevTools (F12) → Console
4. **Sign in**: Go to `/signin` and sign in
5. **Check session**: In console, run `supabase.auth.getSession()`
6. **Navigate to dashboard**: Should work if session exists

