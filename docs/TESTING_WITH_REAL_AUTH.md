# Testing Backend with Real Authentication

Now that your frontend is connected to Supabase Auth, let's test the backend API with real authenticated users.

## 🚀 Quick Start

### Method 1: Test from Browser Console (Easiest)

1. **Sign in** to your app at `http://localhost:5173/signin`

2. **Open browser console** (F12)

3. **Get your token**:
   ```javascript
   const { data: { session } } = await supabase.auth.getSession();
   const token = session?.access_token;
   console.log('Token:', token);
   ```

4. **Test API endpoints** (examples below)

---

### Method 2: Test from React Component

Create a test component in your app (see `src/components/ApiTest.jsx` below)

---

### Method 3: Use the Test Script

```bash
# Get token first (sign in through browser, then get token)
node scripts/get-token.js

# Then test API
node scripts/test-auth-api.js YOUR_TOKEN
```

---

## 🧪 Testing All Endpoints

### 1. Create an Item

```javascript
// In browser console (after signing in)
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

const response = await fetch('http://localhost:3000/api/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: 'My Test Laptop',
    description: 'Testing the API with real auth',
    category: 'Electronics',
    condition: 'Good',
    available: true,
  }),
});

const data = await response.json();
console.log('Created item:', data);
```

### 2. List All Items (Public - No Auth Needed)

```javascript
const response = await fetch('http://localhost:3000/api/items');
const data = await response.json();
console.log('All items:', data);
```

### 3. Get Single Item

```javascript
const itemId = 'YOUR_ITEM_ID_HERE';
const response = await fetch(`http://localhost:3000/api/items/${itemId}`);
const data = await response.json();
console.log('Item:', data);
```

### 4. Submit Borrow Request

```javascript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

const itemId = 'YOUR_ITEM_ID_HERE';
const response = await fetch(`http://localhost:3000/api/items/${itemId}/borrow`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    borrow_start_date: '2024-12-01',
    borrow_end_date: '2024-12-15',
  }),
});

const data = await response.json();
console.log('Borrow request:', data);
```

### 5. Get My Borrow Requests

```javascript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

const response = await fetch('http://localhost:3000/api/borrow/mine', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const data = await response.json();
console.log('My borrow requests:', data);
```

### 6. Approve Borrow Request

```javascript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

const requestId = 'YOUR_REQUEST_ID_HERE';
const response = await fetch(`http://localhost:3000/api/borrow/${requestId}/approve`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const data = await response.json();
console.log('Approved:', data);
```

### 7. Send Message

```javascript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

const response = await fetch('http://localhost:3000/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    item_id: 'YOUR_ITEM_ID_HERE',
    text: 'Hello! Is this item still available?',
  }),
});

const data = await response.json();
console.log('Message sent:', data);
```

### 8. Get Messages

```javascript
const itemId = 'YOUR_ITEM_ID_HERE';
const response = await fetch(`http://localhost:3000/api/messages?itemId=${itemId}`);
const data = await response.json();
console.log('Messages:', data);
```

---

## ✅ Complete Test Flow

### Test Scenario: Full User Flow

1. **User A creates an item**
2. **User B views the item**
3. **User B submits a borrow request**
4. **User A approves the request**
5. **User B sends a message**
6. **User A views messages**

### Step-by-Step:

1. **Sign in as User A**
   - Go to `/signin`
   - Sign in with first account

2. **Create an item** (User A):
   ```javascript
   const { data: { session } } = await supabase.auth.getSession();
   const token = session?.access_token;
   
   const response = await fetch('http://localhost:3000/api/items', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`,
     },
     body: JSON.stringify({
       title: 'Test Calculator',
       description: 'TI-84 calculator for testing',
       category: 'Electronics',
       available: true,
     }),
   });
   
   const { data: item } = await response.json();
   console.log('Item created:', item.id);
   ```

3. **Sign out and sign in as User B**

4. **Submit borrow request** (User B):
   ```javascript
   const { data: { session } } = await supabase.auth.getSession();
   const token = session?.access_token;
   
   const response = await fetch(`http://localhost:3000/api/items/${item.id}/borrow`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`,
     },
     body: JSON.stringify({
       borrow_start_date: '2024-12-01',
       borrow_end_date: '2024-12-15',
     }),
   });
   
   const { data: request } = await response.json();
   console.log('Request created:', request.id);
   ```

5. **Sign out and sign in as User A**

6. **Approve request** (User A):
   ```javascript
   const { data: { session } } = await supabase.auth.getSession();
   const token = session?.access_token;
   
   const response = await fetch(`http://localhost:3000/api/borrow/${request.id}/approve`, {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${token}`,
     },
   });
   
   const data = await response.json();
   console.log('Request approved:', data);
   ```

---

## 🐛 Testing Authentication Errors

### Test 1: Request Without Token

```javascript
const response = await fetch('http://localhost:3000/api/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // No Authorization header
  },
  body: JSON.stringify({
    title: 'Test',
  }),
});

const data = await response.json();
console.log('Should be 401:', response.status);
console.log('Error:', data.error);
```

Expected: `401 Unauthorized` with error message

### Test 2: Request With Invalid Token

```javascript
const response = await fetch('http://localhost:3000/api/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer invalid-token-here',
  },
  body: JSON.stringify({
    title: 'Test',
  }),
});

const data = await response.json();
console.log('Should be 401:', response.status);
console.log('Error:', data.error);
```

Expected: `401 Unauthorized` with "Invalid or expired token"

---

## 💡 Helper Function

Create this in your browser console for easy testing:

```javascript
// Helper function for authenticated API calls
async function apiCall(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    console.error('Not signed in!');
    return;
  }
  
  const response = await fetch(`http://localhost:3000${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  const data = await response.json();
  console.log('Response:', data);
  return data;
}

// Usage:
// apiCall('/api/items', { method: 'POST', body: JSON.stringify({ title: 'Test' }) });
// apiCall('/api/borrow/mine');
```

---

## ✅ Checklist

Test all these scenarios:

- [ ] Create item (requires auth) ✅
- [ ] List items (public) ✅
- [ ] Get single item (public) ✅
- [ ] Submit borrow request (requires auth) ✅
- [ ] Get my borrow requests (requires auth) ✅
- [ ] Approve request (requires auth, only owner) ✅
- [ ] Reject request (requires auth, only owner) ✅
- [ ] Send message (requires auth) ✅
- [ ] Get messages (public) ✅
- [ ] Request without token (should fail with 401) ✅
- [ ] Request with invalid token (should fail with 401) ✅

---

## 🎯 Next Steps

After testing:

1. **Build frontend UI** to interact with the API
2. **Add error handling** in your React components
3. **Test with multiple users** to verify permissions
4. **Update RLS policies** in Supabase for security

