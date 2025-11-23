# 🚀 GharSewa - Complete Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account OR local MongoDB
- Gmail account (for OTP emails - optional)

## Step-by-Step Setup

### Step 1: Fix MongoDB Connection (CRITICAL)

**You MUST do this for the website to work properly!**

#### Option A: MongoDB Atlas (Recommended)

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Login** to your account
3. **Select your project** (the one with cluster0.nw3tgtb.mongodb.net)
4. **Click "Network Access"** in the left sidebar
5. **Click "ADD IP ADDRESS"** button
6. **Choose one**:
   - Click "ADD CURRENT IP ADDRESS" (adds 103.139.191.219)
   - OR click "ALLOW ACCESS FROM ANYWHERE" and enter `0.0.0.0/0`
7. **Click "Confirm"**
8. **Wait 2-3 minutes** for changes to take effect

#### Option B: Local MongoDB

```bash
# Install MongoDB Community Edition
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
# Windows: Start MongoDB service from Services
# Mac/Linux: brew services start mongodb-community
# Or: mongod

# Update backend/.env
MONGODB_URI=mongodb://localhost:27017/gharsewa
```

### Step 2: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 3: Seed Database

```bash
cd backend
node scripts/seedData.js
```

**Expected Output**:
```
MongoDB Connected
Admin user created
Service categories seeded
System settings seeded
Content seeded
Database seeded successfully!
```

### Step 4: Configure Email (Optional)

For OTP emails to work:

1. **Go to Google Account**: https://myaccount.google.com/
2. **Security** → **2-Step Verification** (enable if not enabled)
3. **App Passwords** → Generate password for "Mail"
4. **Update backend/.env**:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
```

**Note**: Without this, OTPs will only show in backend console (still works for testing)

### Step 5: Start Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Expected Output**:
```
Server running on port 5000
✅ MongoDB Connected: cluster0.nw3tgtb.mongodb.net
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

**Expected Output**:
```
VITE v5.4.21  ready in 389 ms
➜  Local:   http://localhost:3000/
```

### Step 6: Access Application

Open browser: **http://localhost:3000**

## Testing the Application

### Test 1: Homepage
1. Go to http://localhost:3000
2. Should see beautiful homepage with 8 service categories
3. ✅ **Pass**: Homepage loads with services

### Test 2: Registration
1. Click "Sign Up" button
2. Select "Customer" or "Worker"
3. Fill in all required fields
4. Click "Register"
5. ✅ **Pass**: Success message, redirected to login

### Test 3: Login
1. Click "Login" button
2. Enter registered email
3. Click "Send OTP"
4. Check backend console for OTP (if email not configured)
5. Enter OTP
6. Click "Verify OTP"
7. ✅ **Pass**: Logged in, redirected to dashboard

### Test 4: Browse Workers (as Customer)
1. Login as customer
2. Click "Services" in navbar
3. Select a category filter
4. ✅ **Pass**: See list of verified workers

### Test 5: Book Service (as Customer)
1. Browse workers
2. Click "Book Now" on a worker
3. Fill booking form
4. Click "Confirm Booking"
5. ✅ **Pass**: Booking created, see in dashboard

### Test 6: Worker Dashboard (as Worker)
1. Register as worker
2. Wait for admin to verify (or verify via admin panel)
3. Login as worker
4. ✅ **Pass**: See dashboard with bookings

### Test 7: Admin Panel
1. Login with:
   - Email: admin@gharsewa.com
   - Password: Admin@123
2. Go to Admin Dashboard
3. ✅ **Pass**: See statistics and management options

## Default Accounts

After running seed script:

### Admin Account
- **Email**: admin@gharsewa.com
- **Password**: Admin@123
- **Access**: Full platform control

### Test Accounts
Create your own by registering through the UI

## Troubleshooting

### MongoDB Won't Connect
```
Error: SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```
**Solution**: Follow Step 1 above to whitelist IP in MongoDB Atlas

### OTP Not Received
**Solution**: Check backend console for OTP code, or configure email in Step 4

### "Failed to fetch" Error
**Solution**: Ensure backend is running on port 5000

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Cannot Register/Login
**Solution**: Ensure MongoDB is connected (check backend console)

## Project Structure

```
gharsewa/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, error handling
│   ├── utils/           # Email, helpers
│   ├── scripts/         # Seed data
│   ├── .env             # Environment variables
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # State management
│   │   ├── services/    # API calls
│   │   └── App.jsx      # Main app
│   └── index.html       # HTML template
└── README.md
```

## Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=gharsewa_super_secret_key_2024_change_in_production_min_32_chars
JWT_EXPIRE=24h

# OTP
OTP_EXPIRY_MINUTES=10

# Server
PORT=5000

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Admin
ADMIN_EMAIL=admin@gharsewa.com
ADMIN_PASSWORD=Admin@123
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
```
POST /auth/register     - Register new user
POST /auth/login        - Send OTP to email
POST /auth/verify-otp   - Verify OTP and get JWT
GET  /auth/me           - Get current user
```

### Customer
```
GET  /customer/services        - Get all services
GET  /customer/workers         - Get workers (with filters)
GET  /customer/workers/:id     - Get worker details
GET  /customer/dashboard       - Get customer dashboard
GET  /customer/bookings        - Get customer bookings
```

### Bookings
```
POST /bookings              - Create booking
GET  /bookings/:id          - Get booking details
PUT  /bookings/:id/cancel   - Cancel booking
```

### Worker
```
GET  /worker/dashboard              - Get worker dashboard
GET  /worker/bookings               - Get worker bookings
PUT  /worker/bookings/:id/accept    - Accept booking
PUT  /worker/bookings/:id/reject    - Reject booking
POST /worker/checkin                - Check-in
POST /worker/checkout               - Check-out
GET  /worker/earnings               - Get earnings
```

### Admin
```
GET    /admin/dashboard           - Get admin dashboard
GET    /admin/customers           - Get all customers
GET    /admin/workers             - Get all workers
PUT    /admin/workers/:id/verify  - Verify worker
GET    /admin/bookings            - Get all bookings
GET    /admin/payments            - Get all payments
GET    /admin/complaints          - Get all complaints
PUT    /admin/complaints/:id/resolve - Resolve complaint
```

## Support

If you encounter issues:
1. Check TROUBLESHOOTING.md
2. Verify MongoDB connection
3. Check backend console for errors
4. Check browser console (F12)
5. Ensure all dependencies installed

## Next Steps

1. ✅ Complete setup above
2. ✅ Test all features
3. 🎨 Customize styling (optional)
4. 🚀 Deploy to production
5. 📱 Add mobile app (future)

---

**Need help?** Check the backend and frontend console logs for detailed error messages.
