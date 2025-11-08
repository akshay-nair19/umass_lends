# Quick Test Guide: Backend with Real Auth

## 🚀 Fastest Way to Test

### Option 1: Use the Test Component (Recommended)

1. **Sign in** to your app: `http://localhost:5173/signin`

2. **Go to dashboard**: `http://localhost:5173/dashboard`

3. **Use the API Test Panel** - You'll see buttons to test each endpoint!

4. **Click the buttons** to test:
   - Create Item
   - Get Items
   - Get My Requests
   - Send Message
   - Test Unauthorized (should fail)

5. **View results** - All responses are displayed below

---

### Option 2: Browser Console

1. **Sign in** to your app

2. **Open browser console** (F12)

3. **Copy and paste this helper function**:

```javascript
// Helper for API calls
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
```

4. **Test endpoints**:

```javascript
// Create an item
await apiCall('/api/items', {
  method: 'POST',
  body: JSON.stringify({
    title: 'My Test Item',
    description: 'Testing the API',
    category: 'Electronics',
    available: true,
  }),
});

// Get all items
await apiCall('/api/items');

// Get my borrow requests
await apiCall('/api/borrow/mine');
```

---

## ✅ Test Checklist

### Basic Tests

- [ ] **Create item** - Should work when signed in
- [ ] **Get items** - Should work without auth (public)
- [ ] **Get my requests** - Should show your requests
- [ ] **Send message** - Should work when signed in

### Authentication Tests

- [ ] **Request without token** - Should return 401
- [ ] **Request with invalid token** - Should return 401
- [ ] **Request with valid token** - Should work

### Permission Tests

- [ ] **Create item** - Creates with your user ID
- [ ] **Borrow request** - Can only approve your own items
- [ ] **Messages** - Can send messages when signed in

---

## 🧪 Complete Test Flow

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
    title: 'Test Calculator',
    description: 'TI-84 calculator',
    category: 'Electronics',
    available: true,
  }),
});

const { data: item } = await response.json();
console.log('Item created:', item);
// Save the item.id for next steps
```

### 2. View the Item

```javascript
// No auth needed
const response = await fetch(`http://localhost:3000/api/items/${item.id}`);
const data = await response.json();
console.log('Item:', data);
```

### 3. Submit Borrow Request

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
console.log('Request created:', request);
```

### 4. Get My Requests

```javascript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

const response = await fetch('http://localhost:3000/api/borrow/mine', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const { data: requests } = await response.json();
console.log('My requests:', requests);
```

### 5. Send a Message

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
    item_id: item.id,
    text: 'Hello! Is this item available?',
  }),
});

const { data: message } = await response.json();
console.log('Message sent:', message);
```

---

## 🐛 Testing Errors

### Test Unauthorized Request

```javascript
// This should fail with 401
const response = await fetch('http://localhost:3000/api/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // No Authorization header
  },
  body: JSON.stringify({
    title: 'This should fail',
  }),
});

const data = await response.json();
console.log('Status:', response.status); // Should be 401
console.log('Error:', data.error); // Should say "Unauthorized"
```

---

## 💡 Tips

1. **Use the Test Component** - Easiest way to test everything
2. **Check browser console** - All responses are logged
3. **Test with multiple users** - Create a second account to test permissions
4. **Check Supabase dashboard** - See data being created in real-time

---

## 🎯 Next Steps

After testing:

1. ✅ All endpoints work with real auth
2. ✅ Build frontend UI components
3. ✅ Add error handling
4. ✅ Test with multiple users
5. ✅ Update RLS policies in Supabase

