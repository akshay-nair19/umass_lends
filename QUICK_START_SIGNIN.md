# Quick Start: How to Sign In

## 🚀 Step-by-Step

### 1. Set Up Environment Variables

Make sure your `.env` file has these variables:

```env
# For Next.js backend
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# For Vite frontend (SAME values, different prefix)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Use the SAME Supabase URL and keys for both, just different variable names!

### 2. Install Vite Dependencies (if needed)

```bash
npm install vite @vitejs/plugin-react @tailwindcss/vite
```

### 3. Run the Frontend

```bash
npm run dev:frontend
```

This will start Vite on `http://localhost:5173` (or another port if 5173 is taken)

### 4. Open Sign-In Page

1. **Open your browser**
2. **Go to**: `http://localhost:5173/signin`
3. **Enter your email and password**
4. **Click "Sign In"**

### 5. If You Don't Have an Account

1. **Go to**: `http://localhost:5173/signup`
2. **Enter email and password**
3. **Click "Sign Up"**
4. **Then sign in** at `/signin`

---

## 📋 Running Both Frontend and Backend

You need **TWO terminals**:

**Terminal 1 - Backend**:
```bash
npm run dev:backend
# or
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Frontend**:
```bash
npm run dev:frontend
# Runs on http://localhost:5173
```

---

## 🎯 Quick Test

1. **Start frontend**: `npm run dev:frontend`
2. **Open browser**: `http://localhost:5173/signin`
3. **Sign in** with your credentials
4. **You'll be redirected to `/dashboard`** if successful

---

## 🐛 Troubleshooting

### "Cannot find module 'vite'"
```bash
npm install vite @vitejs/plugin-react @tailwindcss/vite --save-dev
```

### "VITE_SUPABASE_URL is not defined"
- Make sure your `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the Vite server after adding env variables

### Port already in use
- Vite will automatically use the next available port
- Check the terminal output for the actual port number

### Sign-in fails
- Make sure you have an account (sign up first)
- Check browser console (F12) for error messages
- Verify Supabase credentials in `.env` file

---

## ✅ After Signing In

Once signed in, you can:

1. **Get your token** for API testing:
   - Open browser console (F12)
   - Run: `supabase.auth.getSession()`
   - Copy the `access_token`

2. **Test the API**:
   ```bash
   node scripts/test-auth-api.js YOUR_TOKEN
   ```

