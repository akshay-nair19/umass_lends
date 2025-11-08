# Quick Start: Frontend Development

## 🎉 What's Been Built

I've created a complete frontend structure for your UMass Lends app! Here's what's ready:

### ✅ Pages Created
- **Home** (`/`) - Browse all items with search and filters
- **Item Detail** (`/items/:id`) - View item details, request to borrow, send messages
- **Create Item** (`/items/new`) - Create new items
- **My Items** (`/my-items`) - Manage your items and approve/reject requests
- **Borrow Requests** (`/borrow-requests`) - View all borrow requests
- **Dashboard** (`/dashboard`) - Main dashboard with quick links

### ✅ Components Created
- **ItemCard** - Displays item in a card format
- **Navbar** - Top navigation bar
- **API helpers** - Utility functions for API calls

---

## 🚀 Getting Started

### Step 1: Make Sure Backend is Running

```bash
# Terminal 1 - Backend
npm run dev:backend
```

Wait for: `✓ Ready in Xs`

### Step 2: Start Frontend

```bash
# Terminal 2 - Frontend
npm run dev:frontend
```

### Step 3: Open Browser

Go to: `http://localhost:5174` (or the port Vite shows)

---

## 📋 Testing the Features

### 1. Browse Items
- Go to home page (`/`)
- You should see all items
- Try searching and filtering

### 2. View Item Details
- Click on any item
- See item details
- If signed in, you can:
  - Request to borrow
  - Send messages

### 3. Create Item
- Sign in first
- Go to `/items/new` or click "List Item" in navbar
- Fill out the form
- Submit to create item

### 4. Manage Your Items
- Go to `/my-items`
- See items you created
- View and manage borrow requests

### 5. View Borrow Requests
- Go to `/borrow-requests`
- See requests you made (as borrower)
- See requests for your items (as owner)
- Approve/reject requests

---

## 🐛 Known Issues to Fix

### 1. Session User ID Access
The session structure might be different. If you see errors about `session.user.id`, check:

**In browser console**, check what `session` looks like:
```javascript
// In browser console
const { data: { session } } = await supabase.auth.getSession();
console.log(session);
console.log(session.user);
```

Then update the code accordingly. The session might be:
- `session.user.id` (current code)
- `session.user_id` (alternative)
- Or something else

### 2. Real-time Messaging
Currently using polling (every 2 seconds). To use real-time:
- See `examples/useRealtimeMessages.tsx`
- Replace polling with the real-time hook

### 3. User Names
Currently showing user IDs. To show names:
- Fetch user names from the users table
- Display names instead of IDs

---

## 🔧 Quick Fixes

### Fix Session User ID

If you get errors about `session.user.id`, update these files:

**Option 1: If session.user exists**
```javascript
// Current code (should work)
session.user?.id
```

**Option 2: If session has user_id directly**
```javascript
// Update to:
session.user_id
```

**Option 3: Check session structure**
```javascript
// Add this to see what session looks like:
console.log('Session:', session);
console.log('User:', session?.user);
```

### Fix API Base URL

If API calls fail, check `src/utils/api.js`:

```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

Make sure your backend is running on port 3000, or update the URL.

---

## 📁 File Structure

```
src/
├── components/
│   ├── ItemCard.jsx          # Item card component
│   ├── Navbar.jsx            # Navigation bar
│   ├── Dashboard.jsx         # Dashboard (updated)
│   └── ApiTest.jsx           # API test component
├── pages/
│   ├── Home.jsx              # Browse items
│   ├── ItemDetail.jsx        # Item details
│   ├── CreateItem.jsx        # Create item
│   ├── MyItems.jsx           # My items
│   └── BorrowRequests.jsx    # Borrow requests
├── utils/
│   └── api.js                # API helper functions
└── context/
    └── AuthContext.jsx       # Auth context (existing)
```

---

## 🎨 Next Steps

### Immediate (Test Everything)
1. ✅ Test all pages
2. ✅ Fix any bugs
3. ✅ Test with real data

### Short Term (1-2 days)
1. 🔄 Replace polling with real-time messaging
2. 🔄 Add user names instead of IDs
3. 🔄 Improve error handling
4. 🔄 Add loading states

### Medium Term (1 week)
1. 🔄 Add image upload
2. 🔄 Improve UI/UX
3. 🔄 Add search filters
4. 🔄 Add pagination

### Long Term (2+ weeks)
1. 🔄 Add user profiles
2. 🔄 Add ratings/reviews
3. 🔄 Add notifications
4. 🔄 Add mobile app

---

## 🐛 Troubleshooting

### "Failed to fetch" errors
- Make sure backend is running
- Check CORS headers are set
- Check API URL is correct

### "Unauthorized" errors
- Make sure you're signed in
- Check token is being sent
- Check backend is validating tokens

### Blank pages
- Check browser console for errors
- Check if routes are correct
- Check if components are imported correctly

### Session errors
- Check session structure
- Update session access code
- Check if user is signed in

---

## 💡 Tips

1. **Use Browser DevTools**: Check console for errors
2. **Check Network Tab**: See API requests/responses
3. **Test with Real Data**: Create items and test features
4. **Fix Errors One at a Time**: Don't try to fix everything at once

---

## 📚 Documentation

- `docs/FRONTEND_ROADMAP.md` - Detailed roadmap
- `docs/API_REFERENCE.md` - API documentation
- `docs/TESTING_WITH_REAL_AUTH.md` - Testing guide

---

## 🎯 Priority Order

1. **Test all pages** - Make sure everything works
2. **Fix session errors** - If any
3. **Test with real data** - Create items, make requests
4. **Fix bugs** - As you find them
5. **Enhance features** - Add real-time, improve UI

---

## ✅ Checklist

- [ ] Backend is running
- [ ] Frontend is running
- [ ] Can browse items
- [ ] Can view item details
- [ ] Can create items (when signed in)
- [ ] Can request to borrow (when signed in)
- [ ] Can send messages (when signed in)
- [ ] Can view my items
- [ ] Can view borrow requests
- [ ] Can approve/reject requests

---

Ready to test! Start both servers and navigate to `http://localhost:5174` 🚀

