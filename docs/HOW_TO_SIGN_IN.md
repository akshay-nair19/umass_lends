# How to Sign In to Your App

## 🚀 Quick Steps

### Step 1: Set Up Environment Variables for Frontend

Your frontend uses Vite, so it needs environment variables with `VITE_` prefix.

1. **Create or update `.env` file** in the root directory:
   ```env
   # Supabase (for Next.js backend)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Supabase (for Vite frontend - same values, different prefix)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Make sure both are set** (they should be the same values)

### Step 2: Install Vite Dependencies (if not already installed)

```bash
npm install vite @vitejs/plugin-react
```

### Step 3: Add Vite Script to package.json

Add this script to run the Vite frontend:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:frontend": "vite",
    "dev:backend": "next dev"
  }
}
```

### Step 4: Run the Frontend

```bash
# Run Vite frontend (usually on port 5173)
npm run dev:frontend
# or
npx vite
```

### Step 5: Open the Sign-In Page

1. **Open your browser** and go to: `http://localhost:5173/signin`
   (or whatever port Vite shows)

2. **Enter your credentials**:
   - Email
   - Password

3. **Click "Sign In"**

4. **You'll be redirected to `/dashboard`** if successful

---

## 📋 Detailed Instructions

### If You Don't Have an Account Yet

1. **Go to sign-up page**: `http://localhost:5173/signup`

2. **Enter your email and password**

3. **Click "Sign Up"**

4. **Check your email** for verification (if email confirmation is enabled)

5. **Then sign in** at `/signin`

### Running Both Frontend and Backend

You need **two terminals**:

**Terminal 1 - Backend (Next.js API)**:
```bash
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Frontend (Vite/React)**:
```bash
npm run dev:frontend
# or
npx vite
# Runs on http://localhost:5173 (or another port)
```

### Sign-In Process

1. **Navigate to**: `http://localhost:5173/signin`

2. **Fill in the form**:
   - Email: your email address
   - Password: your password

3. **Click "Sign In" button**

4. **If successful**: You'll be redirected to `/dashboard`

5. **If there's an error**: Check the error message on the page

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'vite'"

**Solution**: Install Vite:
```bash
npm install vite @vitejs/plugin-react --save-dev
```

### Issue: "VITE_SUPABASE_URL is not defined"

**Solution**: 
1. Create `.env` file in root directory
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart the Vite dev server

### Issue: Sign-in page doesn't load

**Solution**:
1. Make sure Vite dev server is running
2. Check the console for errors
3. Verify your router is set up correctly

### Issue: "Sign in failed" or "Invalid credentials"

**Solution**:
1. Make sure you have an account (sign up first if needed)
2. Check your email and password are correct
3. Verify your Supabase project is active
4. Check browser console for detailed error messages

### Issue: Port already in use

**Solution**:
- Vite will automatically use the next available port
- Or specify a port: `vite --port 3001`

---

## 🎯 Quick Reference

### URLs:
- **Frontend**: `http://localhost:5173` (or port shown by Vite)
- **Sign In**: `http://localhost:5173/signin`
- **Sign Up**: `http://localhost:5173/signup`
- **Dashboard**: `http://localhost:5173/dashboard`
- **Backend API**: `http://localhost:3000/api`

### Commands:
```bash
# Run frontend
npm run dev:frontend
# or
npx vite

# Run backend
npm run dev

# Run both (need two terminals)
```

---

## 💡 After Signing In

Once you're signed in:

1. **Get your access token** (for API testing):
   - Open browser console (F12)
   - Run: `supabase.auth.getSession()`
   - Copy the `access_token`

2. **Test the API**:
   ```bash
   node scripts/test-auth-api.js YOUR_TOKEN
   ```

3. **Use the dashboard**: Navigate to `/dashboard` to see your authenticated content

