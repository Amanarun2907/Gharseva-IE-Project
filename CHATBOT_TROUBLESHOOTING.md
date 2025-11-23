# Chatbot Troubleshooting Guide

## Issue: "Sorry, I encountered an error. Please try again."

### ✅ Fixed!

I've added better error logging and fixed the Groq SDK initialization.

## What Was Fixed:

1. ✅ **Groq SDK Import** - Fixed the import statement
2. ✅ **Initialization Check** - Added validation that Groq SDK is initialized
3. ✅ **Better Error Logging** - Added detailed console logs
4. ✅ **Frontend Error Display** - Shows actual error messages

## How to Test Now:

### Step 1: Check Backend Logs

The backend should show:
```
✅ Groq SDK initialized successfully
Server running on port 5000
✅ MongoDB Connected
```

### Step 2: Try Chatbot Again

1. Login to any account
2. Click the purple chat button
3. Send a message like "Hello"
4. Watch the backend terminal for logs:
   ```
   📨 Chat request received
   User: rajesh@example.com Role: customer
   Message: Hello
   🤖 Calling Groq API...
   ✅ Groq API response received
   ```

### Step 3: Check Browser Console

Open browser DevTools (F12) → Console tab

You should see:
```
Sending chat request: { message: "Hello", historyLength: 1 }
Chat response: { success: true, data: { message: "..." } }
```

## If Still Getting Errors:

### Check 1: API Key
Make sure the Groq API key is correct in `backend/.env`:
```
GROQ_API_KEY=gsk_79LGIx0Ny14umvVtpE66WGdyb3FY6KRC62ojYNujFFTAak1W3RQigo
```

### Check 2: Backend Running
Make sure backend restarted after changes:
```
Backend should show: ✅ Groq SDK initialized successfully
```

### Check 3: Network Request
In browser DevTools → Network tab:
- Look for request to `/api/chatbot/chat`
- Should return status 200
- Check response for error details

### Check 4: Authentication
Make sure you're logged in:
- Token should be in localStorage
- Request should have Authorization header

## Common Errors:

### Error: "AI service not available"
**Solution**: Groq SDK not initialized. Restart backend.

### Error: "Message is required"
**Solution**: Empty message sent. Type something before sending.

### Error: "Failed to get user context"
**Solution**: Database issue. Check MongoDB connection.

### Error: "Unauthorized"
**Solution**: Not logged in or token expired. Login again.

## Testing Commands:

### Test Customer Chatbot:
```
Login: rajesh@example.com / Password@123
Message: "How many bookings do I have?"
Expected: Real booking count from database
```

### Test Worker Chatbot:
```
Login: ramesh.worker@gharsewa.com / Worker@123
Message: "What are my earnings?"
Expected: Real earnings from database
```

### Test Admin Chatbot:
```
Login: admin@gharsewa.com / Admin@123
Message: "How many users are there?"
Expected: Real user count from database
```

## Debug Mode:

The chatbot now has extensive logging:

**Backend logs show:**
- When request is received
- User email and role
- Message content
- When Groq API is called
- When response is received
- Any errors with full stack trace

**Frontend logs show:**
- When message is sent
- Conversation history length
- Response received
- Any errors with details

## Success Indicators:

✅ Backend shows "Groq SDK initialized successfully"
✅ Chat request logs appear in backend
✅ Groq API response received
✅ AI message appears in chat
✅ No errors in browser console

## If Everything Fails:

1. Clear browser cache
2. Restart backend server
3. Restart frontend server
4. Login again
5. Try a simple message like "Hello"
6. Check all logs (backend terminal + browser console)
7. Share the error logs for further debugging

---

**The chatbot should now work correctly with detailed error logging!** 🚀
