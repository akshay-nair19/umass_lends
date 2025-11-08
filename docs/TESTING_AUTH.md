# Testing Authentication

This guide shows you how to test the authenticated API endpoints.

## 🚀 Quick Start

### Method 1: Using the Test Script (Easiest)

1. **Get your access token** (see below)
2. **Run the test script**:
   ```bash
   node scripts/test-auth-api.js YOUR_ACCESS_TOKEN
   ```

### Method 2: Using Browser DevTools

1. **Sign in** through your frontend
2. **Open DevTools** (F12)
3. **Go to Console tab**
4. **Run this code**:

```javascript
// Get token from session
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// Test creating an item
const response = await fetch('http://localhost:3000/api/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: 'Test Item',
    description: 'Testing authenticated API',
    category: 'Electronics',
    available: true,
  }),
});

const data = await response.json();
console.log(data);
```

### Method 3: Using cURL

1. **Get your access token**
2. **Run cURL command**:

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "title": "Test Item",
    "description": "Testing authenticated API",
    "category": "Electronics",
    "available": true
  }'
```

## 🔑 How to Get Your Access Token

### Option 1: From Browser Local Storage (Recommended)

1. **Sign in** through your frontend application
2. **Open browser DevTools** (F12)
3. **Go to Application tab** (Chrome) or **Storage tab** (Firefox)
4. **Click on Local Storage**
5. **Find your Supabase project** (look for `sb-<project-id>-auth-token`)
6. **Click on it** and find the `access_token` value
7. **Copy the token** (it's a long string)

### Option 2: From Your React Component

If you're using the AuthContext:

```javascript
import { UserAuth } from '../context/AuthContext';

function MyComponent() {
  const { session } = UserAuth();
  
  const token = session?.access_token;
  console.log('Access token:', token);
  
  // Use the token in API calls
}
```

### Option 3: From Supabase Dashboard

1. Go to your Supabase project dashboard
2. Go to **Authentication** → **Users**
3. Find your user and view their session
4. Copy the access token

### Option 4: Programmatically (for testing)

```javascript
// In browser console or your app
const { data: { session } } = await supabase.auth.getSession();
console.log('Access token:', session?.access_token);
```

## 🧪 Testing Different Endpoints

### 1. Create Item (Requires Auth)

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My Item",
    "description": "Item description",
    "category": "Electronics",
    "condition": "Good",
    "available": true
  }'
```

### 2. Submit Borrow Request (Requires Auth)

```bash
curl -X POST http://localhost:3000/api/items/ITEM_ID/borrow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "borrow_start_date": "2024-12-01",
    "borrow_end_date": "2024-12-15"
  }'
```

### 3. Get My Borrow Requests (Requires Auth)

```bash
curl http://localhost:3000/api/borrow/mine \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Send Message (Requires Auth)

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "item_id": "ITEM_ID",
    "text": "Hello! Is this available?"
  }'
```

### 5. List Items (Public - No Auth Required)

```bash
curl http://localhost:3000/api/items
```

## ✅ Expected Responses

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "owner_id": "user-uuid",
    "title": "My Item",
    ...
  }
}
```

### Unauthorized Response (401)

```json
{
  "success": false,
  "error": "Unauthorized: No authorization token provided"
}
```

Or:

```json
{
  "success": false,
  "error": "Unauthorized: Invalid or expired token"
}
```

## 🐛 Troubleshooting

### Issue: "Unauthorized: No authorization token provided"

**Problem:** Token is not being sent.

**Solution:**
- Make sure you're including the `Authorization` header
- Check that the header format is: `Bearer <token>`
- Verify the token is not null/undefined

### Issue: "Unauthorized: Invalid or expired token"

**Problem:** Token is invalid or has expired.

**Solution:**
1. Sign in again to get a new token
2. Check that you're using the `access_token`, not `refresh_token`
3. Verify the token hasn't expired (tokens expire after 1 hour by default)
4. Make sure you're copying the entire token (it's a long string)

### Issue: Token works in browser but not in script

**Problem:** Token might be scoped to a specific domain.

**Solution:**
- Make sure you're using the same Supabase project
- Check that your `.env` file has the correct Supabase URL and keys
- Verify the token is from the same Supabase project

### Issue: "Failed to fetch" or Network Error

**Problem:** CORS or connection issue.

**Solution:**
1. Make sure your dev server is running: `npm run dev`
2. Check that you're using the correct URL: `http://localhost:3000`
3. Verify CORS is configured (should be handled by the API routes)

## 🎯 Testing Checklist

- [ ] Can get access token from session
- [ ] Can create item with valid token
- [ ] Cannot create item without token (401 error)
- [ ] Cannot create item with invalid token (401 error)
- [ ] Can submit borrow request with valid token
- [ ] Can get my borrow requests with valid token
- [ ] Can send message with valid token
- [ ] Public endpoints work without token (GET /api/items)

## 💡 Pro Tips

1. **Token Expiration**: Access tokens expire after 1 hour. If your token stops working, sign in again to get a new one.

2. **Refresh Tokens**: For production, implement token refresh logic to automatically get new access tokens.

3. **Store Tokens Securely**: Never commit tokens to git. Use environment variables or secure storage.

4. **Test with Multiple Users**: Create multiple test accounts to test different scenarios (owner vs borrower).

5. **Check Supabase Logs**: If something isn't working, check Supabase dashboard → Logs for authentication errors.

## 🔐 Security Notes

- ✅ Never expose your access token in client-side code that's committed to git
- ✅ Tokens are automatically included in Supabase client requests
- ✅ Always validate tokens on the server side (which we're doing)
- ✅ Use HTTPS in production
- ✅ Implement token refresh for better UX

