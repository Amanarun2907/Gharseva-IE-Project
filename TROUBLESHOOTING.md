# GharSewa - Troubleshooting Guide

## Current Status

### ✅ Working
- Frontend server running on http://localhost:3000
- Backend server running on http://localhost:5000
- All routes configured
- All components created
- Beautiful UI with Bootstrap 5

### ⚠️ Issues

#### 1. MongoDB Connection Error
**Problem**: SSL/TLS handshake failure with MongoDB Atlas

**Cause**: This is typically caused by:
- IP address not whitelisted in MongoDB Atlas
- Incorrect connection string
- MongoDB Atlas network restrictions
- SSL certificate issues

**Solutions**:

**Option A: Fix MongoDB Atlas (Recommended)**
1. Go to https://cloud.mongodb.com/
2. Select your project
3. Click "Network Access" in left sidebar
4. Click "Add IP Address"
5. Either:
   - Add your current IP: 103.139.191.219
   - Or click "Allow Access from Anywhere" (0.0.0.0/0) for development
6. Wait 2-3 minutes for changes to propagate
7. Restart backend server

**Option B: Use Local MongoDB**
1. Install MongoDB locally: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/gharsewa
   ```
4. Restart backend server
5. Run seed script: `node backend/scripts/seedData.js`

**Option C: Use MongoDB Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```
Then update .env to: `MONGODB_URI=mongodb://localhost:27017/gharsewa`

#### 2. Email Service Not Configured
**Problem**: OTP emails won't be sent

**Solution**:
1. Get Gmail App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App Passwords
   - Generate password for "Mail"
2. Update `backend/.env`:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   ```

**Workaround for Testing**:
- OTP will be logged in backend console
- Check terminal running backend for OTP code

## Testing Without Database

The application will run but with limited functionality:
- ✅ Frontend loads
- ✅ Pages render
- ❌ Registration won't work
- ❌ Login won't work
- ❌ Data fetching won't work

## How to Test Each Feature

### 1. Homepage
- URL: http://localhost:3000
- Should show: Service categories, features, testimonials
- **Status**: ✅ Should work

### 2. Registration
- URL: http://localhost:3000/register
- **Requires**: MongoDB connection
- **Test**: Fill form and submit
- **Expected**: Success message and redirect to login

### 3. Login
- URL: http://localhost:3000/login
- **Requires**: MongoDB connection + registered user
- **Test**: Enter email, receive OTP, verify
- **Expected**: Redirect to dashboard based on role

### 4. Browse Services
- URL: http://localhost:3000/services
- **Requires**: MongoDB with worker data
- **Test**: Filter by category, city, rating
- **Expected**: List of verified workers

### 5. Worker Profile
- URL: http://localhost:3000/worker/:id
- **Requires**: MongoDB with worker data
- **Test**: Click on worker card
- **Expected**: Detailed profile with ratings, skills

### 6. Book Service
- URL: http://localhost:3000/book/:workerId
- **Requires**: MongoDB + authenticated customer
- **Test**: Fill booking form
- **Expected**: Booking created, redirect to dashboard

### 7. Customer Dashboard
- URL: http://localhost:3000/dashboard
- **Requires**: MongoDB + authenticated customer
- **Test**: Login as customer
- **Expected**: Bookings list, stats

### 8. Worker Dashboard
- URL: http://localhost:3000/worker/dashboard
- **Requires**: MongoDB + authenticated worker
- **Test**: Login as worker
- **Expected**: Pending/upcoming bookings, earnings

### 9. Admin Dashboard
- URL: http://localhost:3000/admin/dashboard
- **Requires**: MongoDB + authenticated admin
- **Test**: Login as admin
- **Expected**: Platform statistics, analytics

## API Endpoints Test

Test if backend is responding:

```bash
# Health check
curl http://localhost:5000/health

# Get services (public)
curl http://localhost:5000/api/customer/services

# Register (requires MongoDB)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","phone":"1234567890","role":"customer"}'
```

## Quick Fix Checklist

- [ ] MongoDB Atlas IP whitelisted
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] No console errors in browser
- [ ] Backend shows "MongoDB Connected" message
- [ ] Seed script run successfully
- [ ] Can access http://localhost:3000
- [ ] Can register new user
- [ ] Can login with OTP
- [ ] Can browse workers
- [ ] Can create booking

## Common Errors

### "Failed to fetch"
- **Cause**: Backend not running or wrong URL
- **Fix**: Ensure backend is on port 5000

### "Network Error"
- **Cause**: CORS issue or backend crashed
- **Fix**: Check backend console for errors

### "User not found"
- **Cause**: Database empty or user not registered
- **Fix**: Run seed script, register new user

### "Invalid OTP"
- **Cause**: Wrong OTP or expired
- **Fix**: Check backend console for OTP, use within 10 minutes

## Need Help?

1. Check backend console for errors
2. Check browser console (F12) for errors
3. Verify MongoDB connection string
4. Ensure all npm packages installed
5. Try restarting both servers

## Contact

For issues, check:
- Backend logs in terminal
- Browser console (F12 → Console tab)
- Network tab (F12 → Network tab)
