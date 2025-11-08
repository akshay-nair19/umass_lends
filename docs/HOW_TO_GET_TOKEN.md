# How to Get Your Auth Token

## 🚀 Quick Methods

### Method 1: From Browser Console (Easiest)

1. **Sign in** to your app (through your frontend sign-in page)

2. **Open Browser DevTools**:
   - Press `F12` (Windows/Linux)
   - Or `Cmd + Option + I` (Mac)
   - Or right-click → "Inspect"

3. **Go to Console tab**

4. **Run this code**:
   ```javascript
   // If you're using Supabase client directly
   const { data: { session } } = await supabase.auth.getSession();
   console.log('Access Token:', session?.access_token);
   ```

5. **Copy the token** that appears in the console

---

### Method 2: From Local Storage (Manual)

1. **Sign in** to your app

2. **Open Browser DevTools** (`F12`)

3. **Go to Application tab** (Chrome) or **Storage tab** (Firefox)

4. **Click on Local Storage** in the left sidebar

5. **Find your Supabase project**:
   - Look for: `sb-<your-project-id>-auth-token`
   - Or search for: `supabase.auth.token`

6. **Click on it** to see the stored data

7. **Find the `access_token`** field

8. **Copy the token value** (it's a long string like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

---

### Method 3: Using the Get Token Script

1. **Run the script**:
   ```bash
   npm run get-token
   ```

2. **Enter your email and password** when prompted

3. **Copy the token** from the output

---

### Method 4: From Your React Component

If you're using the AuthContext in your app:

```javascript
import { UserAuth } from '../context/AuthContext';

function MyComponent() {
  const { session } = UserAuth();
  
  // Get the token
  const token = session?.access_token;
  
  // Log it to console
  console.log('My access token:', token);
  
  // Or display it (for testing only!)
  return (
    <div>
      <p>Token: {token}</p>
    </div>
  );
}
```

---

## 🎯 Step-by-Step: Browser Console Method

### Step 1: Sign In
- Go to your app's sign-in page
- Enter your email and password
- Click "Sign In"

### Step 2: Open Console
- Press `F12` to open DevTools
- Click on the **Console** tab

### Step 3: Get Token
If you have Supabase client available in the console, run:
```javascript
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log('Access Token:', session?.access_token);
  console.log('Full Session:', session);
});
```

Or if you need to access it from your AuthContext:
```javascript
// This works if you're on a page that uses AuthContext
// Check the React DevTools or use the method below
```

### Step 4: Copy Token
- The token will appear in the console
- Copy it (it's a long string)
- Use it in your API tests

---

## 🔍 Finding Token in Local Storage

### Chrome/Edge:

1. Open DevTools (`F12`)
2. Go to **Application** tab
3. In the left sidebar, expand **Local Storage**
4. Click on your domain (e.g., `http://localhost:3000`)
5. Look for key: `sb-<project-id>-auth-token`
6. The value is a JSON object - find `access_token` inside it

### Firefox:

1. Open DevTools (`F12`)
2. Go to **Storage** tab
3. Click on **Local Storage**
4. Click on your domain
5. Find the `sb-<project-id>-auth-token` entry
6. Click on it to see the value - find `access_token`

### Safari:

1. Enable Developer menu: Preferences → Advanced → "Show Develop menu"
2. Open DevTools (`Cmd + Option + I`)
3. Go to **Storage** tab
4. Click on **Local Storage**
5. Find your token entry

---

## 📋 Visual Guide

```
1. Sign in to your app
   ↓
2. Open DevTools (F12)
   ↓
3. Go to Console tab
   ↓
4. Run: supabase.auth.getSession()
   ↓
5. Copy the access_token from the result
   ↓
6. Use it in: node scripts/test-auth-api.js YOUR_TOKEN
```

---

## 🧪 Quick Test

Once you have your token, test it:

```bash
# Test with the token
node scripts/test-auth-api.js YOUR_TOKEN_HERE
```

Or use it in a curl command:

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title": "Test Item", "available": true}'
```

---

## ⚠️ Important Notes

1. **Token Expiration**: Tokens expire after 1 hour. If your token stops working, sign in again to get a new one.

2. **Don't Share Tokens**: Never commit tokens to git or share them publicly. They give full access to your account.

3. **Use Environment Variables**: For production, store tokens securely using environment variables.

4. **Token Format**: The token should start with `eyJ` and be a very long string (usually 200+ characters).

---

## 🐛 Troubleshooting

### "Token is undefined"
- Make sure you're signed in
- Check that the session exists: `console.log(session)`
- Try signing out and signing in again

### "Cannot find supabase in console"
- Make sure you're on a page that loads Supabase
- Or use the Local Storage method instead
- Or use the get-token script: `npm run get-token`

### "Token doesn't work"
- Token might be expired (sign in again)
- Make sure you're using `access_token`, not `refresh_token`
- Verify you copied the entire token (it's very long)

---

## 💡 Pro Tip

Create a helper function in your browser console:

```javascript
// Save this in your browser console for easy access
function getToken() {
  return supabase.auth.getSession().then(({ data: { session } }) => {
    const token = session?.access_token;
    console.log('Access Token:', token);
    // Copy to clipboard (Chrome/Edge)
    navigator.clipboard.writeText(token).then(() => {
      console.log('✅ Token copied to clipboard!');
    });
    return token;
  });
}

// Then just run:
getToken();
```

