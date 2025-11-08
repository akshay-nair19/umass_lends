# Authentication Guide

## ✅ Updated to Use Supabase Auth

All API routes now require authentication using Supabase Auth tokens.

## How It Works

1. **User signs in** via your frontend (using Supabase Auth)
2. **Frontend gets access token** from Supabase session
3. **Frontend sends token** in `Authorization` header to API
4. **API validates token** and gets user information
5. **API processes request** with authenticated user

## Making Authenticated Requests

### From Frontend (React/Next.js)

```typescript
import { supabase } from '@/lib/supabaseClient';

// Get the session token
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// Make API request with token
const response = await fetch('/api/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: 'My Item',
    description: 'Item description',
  }),
});
```

### Using Your AuthContext

If you're using the AuthContext from `src/context/AuthContext.jsx`:

```javascript
import { UserAuth } from '../context/AuthContext';

function MyComponent() {
  const { session } = UserAuth();

  const createItem = async () => {
    const token = session?.access_token;
    
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'My Item',
        description: 'Item description',
      }),
    });

    const data = await response.json();
    console.log(data);
  };
}
```

### Helper Function for API Calls

Create a helper function to automatically add the auth token:

```typescript
// lib/apiClient.ts
import { supabase } from './supabaseClient';

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error('Not authenticated');
  }

  return fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
}

// Usage:
const response = await apiCall('/api/items', {
  method: 'POST',
  body: JSON.stringify({ title: 'My Item' }),
});
```

## API Endpoints

### Requires Authentication

All endpoints except public GET requests require authentication:

- ✅ `POST /api/items` - Create item (requires auth)
- ✅ `POST /api/items/:id/borrow` - Submit borrow request (requires auth)
- ✅ `POST /api/borrow/:id/approve` - Approve request (requires auth)
- ✅ `POST /api/borrow/:id/reject` - Reject request (requires auth)
- ✅ `GET /api/borrow/mine` - Get my requests (requires auth)
- ✅ `POST /api/messages` - Send message (requires auth)

### Public Endpoints

These endpoints don't require authentication:

- ✅ `GET /api/items` - List all items (public)
- ✅ `GET /api/items/:id` - Get item details (public)
- ✅ `GET /api/messages?itemId=xxx` - Get messages (public, but consider making this auth-only)

## Error Responses

### 401 Unauthorized

If the token is missing or invalid:

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

## Testing with Authentication

### Using cURL

1. **Get your access token** from Supabase session (in browser DevTools → Application → Local Storage → `sb-<project>-auth-token`)

2. **Make authenticated request**:

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "title": "Test Item",
    "description": "Test description"
  }'
```

### Using the Test Scripts

Update the test scripts to include authentication tokens, or create a new test script that handles auth.

## Migration from Placeholder Auth

The placeholder user ID (`00000000-0000-0000-0000-000000000001`) is no longer used. All API requests now require a valid Supabase Auth token.

### What Changed

1. ✅ `getUser()` now extracts token from request headers
2. ✅ All API routes pass `request` to `getUser()`
3. ✅ Authentication errors return 401 status
4. ✅ User ID comes from Supabase Auth session

### Next Steps

1. **Update your frontend** to send auth tokens in API requests
2. **Test authentication** with real Supabase users
3. **Update RLS policies** in Supabase to use `auth.uid()`
4. **Remove placeholder user** from database if needed

## RLS Policy Updates

Update your Supabase RLS policies to use `auth.uid()`:

```sql
-- Example: Users can only see their own items
CREATE POLICY "Users can view their own items" 
ON items FOR SELECT 
USING (owner_id = auth.uid());

-- Example: Users can only create items for themselves
CREATE POLICY "Users can create their own items" 
ON items FOR INSERT 
WITH CHECK (owner_id = auth.uid());
```

## Troubleshooting

### "Unauthorized: No authorization token provided"

- Make sure you're sending the `Authorization` header
- Check that the header format is: `Bearer <token>`
- Verify the token is not null/undefined

### "Unauthorized: Invalid or expired token"

- Token may have expired (refresh the session)
- Token may be invalid (sign in again)
- Check that you're using the correct token (access_token, not refresh_token)

### "Authentication failed"

- Check Supabase environment variables
- Verify Supabase project is active
- Check network connectivity to Supabase

