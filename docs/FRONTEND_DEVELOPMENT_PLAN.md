# Frontend Development Plan

## 🎯 Overview

Now that your backend is working with real authentication, it's time to build the frontend UI to use all the features.

## 📋 Features to Build

### 1. Home Page (Browse Items)
- Display all available items
- Search and filter functionality
- Category filters
- Item cards with images

### 2. Item Detail Page
- Show item details
- View item owner info
- Submit borrow request button
- View messages/chat
- Real-time messaging

### 3. Create Item Page
- Form to create new items
- Image upload (optional)
- Category selection
- Condition selection

### 4. My Items Page
- List items you've created
- Edit/delete items
- View borrow requests for your items
- Approve/reject requests

### 5. Borrow Requests Page
- View all your borrow requests (as borrower)
- View requests for your items (as owner)
- Approve/reject buttons
- Status indicators

### 6. Messages/Chat Page
- Real-time messaging
- Chat interface for each item
- Message history
- Send messages

### 7. User Profile Page
- View/edit profile
- View your activity
- Statistics

---

## 🚀 Step-by-Step Development

### Phase 1: Core Pages (MVP)

#### Step 1: Home Page - Browse Items

**File**: `src/pages/Home.jsx` or `src/components/Home.jsx`

**Features**:
- Fetch and display all items
- Item cards with image, title, description
- Click to view item details
- Search bar
- Category filters

**API Calls**:
- `GET /api/items` - Get all items

#### Step 2: Item Detail Page

**File**: `src/pages/ItemDetail.jsx`

**Features**:
- Show full item details
- Display owner info
- "Request to Borrow" button (if not owner)
- View messages/chat
- Real-time messaging

**API Calls**:
- `GET /api/items/:id` - Get item details
- `POST /api/items/:id/borrow` - Submit borrow request
- `GET /api/messages?itemId=xxx` - Get messages
- `POST /api/messages` - Send message

#### Step 3: Create Item Page

**File**: `src/pages/CreateItem.jsx`

**Features**:
- Form with all item fields
- Image upload (optional for now)
- Submit button
- Redirect to item detail after creation

**API Calls**:
- `POST /api/items` - Create item

#### Step 4: My Items Page

**File**: `src/pages/MyItems.jsx`

**Features**:
- List items you created
- View borrow requests for each item
- Approve/reject buttons
- Delete item option

**API Calls**:
- `GET /api/items` - Filter by owner (you'll need to filter on frontend)
- `GET /api/borrow/mine` - Get your requests
- `POST /api/borrow/:id/approve` - Approve request
- `POST /api/borrow/:id/reject` - Reject request

#### Step 5: Borrow Requests Page

**File**: `src/pages/BorrowRequests.jsx`

**Features**:
- List all borrow requests (as borrower and owner)
- Filter by status (pending, approved, rejected)
- Status badges
- Approve/reject buttons (if you're owner)

**API Calls**:
- `GET /api/borrow/mine` - Get all your requests
- `POST /api/borrow/:id/approve` - Approve
- `POST /api/borrow/:id/reject` - Reject

---

### Phase 2: Enhanced Features

#### Step 6: Real-time Messaging

**File**: `src/components/ItemChat.jsx`

**Features**:
- Real-time message display
- Send message form
- Auto-scroll to latest message
- Message timestamps

**Uses**: `examples/useRealtimeMessages.tsx` hook

#### Step 7: Search and Filters

**Features**:
- Search by title/description
- Filter by category
- Filter by availability
- Sort options

#### Step 8: Image Upload

**Features**:
- Upload item images
- Display images
- Image preview

---

## 📁 Recommended File Structure

```
src/
├── components/
│   ├── ItemCard.jsx          # Item card component
│   ├── ItemList.jsx          # List of items
│   ├── ItemDetail.jsx        # Item detail view
│   ├── CreateItemForm.jsx    # Create item form
│   ├── BorrowRequestCard.jsx # Borrow request card
│   ├── ItemChat.jsx          # Real-time chat component
│   ├── SearchBar.jsx         # Search component
│   └── FilterBar.jsx         # Filter component
├── pages/
│   ├── Home.jsx              # Home page (browse items)
│   ├── ItemDetail.jsx        # Item detail page
│   ├── CreateItem.jsx        # Create item page
│   ├── MyItems.jsx           # My items page
│   ├── BorrowRequests.jsx    # Borrow requests page
│   └── Profile.jsx           # User profile page
├── hooks/
│   ├── useItems.js           # Hook for items
│   ├── useBorrowRequests.js  # Hook for borrow requests
│   └── useRealtimeMessages.js # Real-time messaging hook
├── utils/
│   └── api.js                # API helper functions
└── context/
    └── AuthContext.jsx       # Already exists
```

---

## 🛠️ Implementation Order

### Week 1: Core Functionality
1. ✅ Home page - Browse items
2. ✅ Item detail page
3. ✅ Create item page
4. ✅ Basic navigation

### Week 2: Borrowing System
5. ✅ Submit borrow requests
6. ✅ View borrow requests
7. ✅ Approve/reject requests

### Week 3: Messaging
8. ✅ Real-time messaging
9. ✅ Chat interface
10. ✅ Message notifications

### Week 4: Polish
11. ✅ Search and filters
12. ✅ Image upload
13. ✅ User profile
14. ✅ Error handling
15. ✅ Loading states

---

## 💡 Component Examples

I'll create example components for you to use as starting points.

---

## 🎨 UI/UX Recommendations

### Design Principles
- **Clean and simple** - Easy to use
- **Mobile-first** - Responsive design
- **Clear CTAs** - Obvious action buttons
- **Feedback** - Loading states, error messages
- **Real-time updates** - Use realtime for messages

### Color Scheme
- Primary: UMass colors (maroon, white)
- Success: Green (approved requests)
- Warning: Yellow (pending requests)
- Error: Red (rejected requests, errors)

### Key Pages
1. **Home** - Browse all items
2. **Item Detail** - View item, request to borrow, chat
3. **Create Item** - Simple form
4. **My Items** - Manage your items
5. **Borrow Requests** - Manage requests
6. **Messages** - Chat with owners/borrowers

---

## 🚀 Getting Started

I'll create the first component (Home page) to get you started, then you can build the rest following the same pattern.

Ready to start building?

