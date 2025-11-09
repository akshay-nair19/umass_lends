# Troubleshooting "Failed to Fetch" Error When Submitting Borrow Request

## Common Causes and Solutions

### 1. Backend Server Not Running
**Problem**: The Next.js backend server is not running on port 3000.

**Solution**:
```bash
# Make sure you're in the project root directory
npm run dev
```

The backend should be running on `http://localhost:3000`. Check the terminal for confirmation.

### 2. CORS Issues
**Problem**: CORS headers are missing on error responses (this has been fixed in the code).

**Solution**: 
- The code has been updated to add CORS headers to all responses
- Make sure you've restarted the backend server after the fix

### 3. Authentication Token Issues
**Problem**: Your session token might be expired or invalid.

**Solution**:
- Sign out and sign back in
- Check browser console for authentication errors
- Verify your `.env` file has the correct Supabase credentials

### 4. Missing End Date
**Problem**: The end date might not be calculated properly if no duration is set.

**Solution**:
- Make sure to set at least one duration field (months, days, hours, or minutes)
- The end date should be calculated automatically from the start date and duration

### 5. Network Connectivity
**Problem**: Firewall or network issues blocking the connection.

**Solution**:
- Check if `http://localhost:3000` is accessible in your browser
- Verify no firewall is blocking port 3000
- Check if another application is using port 3000

## Debugging Steps

1. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Go to the Console tab
   - Look for detailed error messages
   - Check the Network tab to see the actual HTTP request/response

2. **Check Backend Logs**:
   - Look at the terminal where `npm run dev` is running
   - Check for any error messages or stack traces

3. **Test the API Directly**:
   ```bash
   # Test if the backend is accessible
   curl http://localhost:3000/api/items
   ```

4. **Verify Environment Variables**:
   - Check your `.env` file
   - Make sure `VITE_API_URL` is set correctly (or defaults to `http://localhost:3000`)

5. **Check Authentication**:
   - Verify you're signed in
   - Check if your session token is valid
   - Try signing out and signing back in

## What Was Fixed

1. **Added CORS headers to all error responses** in the borrow request API route
2. **Improved error handling** in the frontend API utility to show better error messages
3. **Better validation** for missing end dates

## Next Steps

If the error persists:
1. Check the browser console for the exact error message
2. Check the backend terminal for server errors
3. Verify both frontend and backend are running
4. Try a hard refresh (Ctrl+F5) to clear cached code

