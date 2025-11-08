# Environment Variables Setup

## 🔧 VITE_API_URL

### What to Set It To

**For local development:**
```env
VITE_API_URL=http://localhost:3000
```

**Why `http://localhost:3000`?**
- Your Next.js backend runs on port 3000 by default
- The frontend (Vite) needs to know where to send API requests
- This is the URL where your backend API routes are accessible

### Default Value

If you don't set `VITE_API_URL` in your `.env` file, the code will default to `http://localhost:3000`:

```javascript
// In src/utils/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

So technically, you don't **need** to set it if your backend is on port 3000, but it's good practice to be explicit.

---

## 📋 Complete .env File

Your `.env` file should have:

```env
# Supabase Configuration (for Next.js backend)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Supabase Configuration (for Vite frontend - same values, different prefix)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API URL (optional - defaults to http://localhost:3000)
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Different Environments

### Local Development
```env
VITE_API_URL=http://localhost:3000
```

### Production (when you deploy)
```env
VITE_API_URL=https://your-backend-domain.com
```

### If Backend is on Different Port
```env
# If backend runs on port 3001
VITE_API_URL=http://localhost:3001
```

---

## ✅ Verification

After setting `VITE_API_URL`, verify it works:

1. **Restart your frontend server** (Vite needs to restart to pick up env changes)
2. **Check browser console** - API calls should go to the correct URL
3. **Check Network tab** - Requests should go to `http://localhost:3000/api/...`

---

## 🐛 Troubleshooting

### API calls failing
- Make sure backend is running on port 3000
- Check `VITE_API_URL` is set correctly
- Restart frontend after changing `.env`

### Wrong port
- If your backend runs on a different port, update `VITE_API_URL`
- Or change Next.js port: `npm run dev:backend -- -p 3001`

### CORS errors
- Make sure backend has CORS headers (already added)
- Check backend is running
- Check URL is correct

---

## 💡 Quick Reference

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | `http://localhost:3000` | No (has default) |
| `VITE_SUPABASE_URL` | Your Supabase URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Yes (for backend) |

---

## 🔄 After Changing .env

**IMPORTANT**: After changing `.env` file, you MUST restart:

1. **Frontend** (Vite) - Restart to pick up `VITE_*` variables
2. **Backend** (Next.js) - Restart to pick up `NEXT_PUBLIC_*` variables

Vite and Next.js only read environment variables on startup!

