# Booking Visibility Fix

## Issue
When a customer books a service, it should immediately appear in:
1. Customer Dashboard (Upcoming Bookings)
2. Worker Dashboard (Pending Bookings)
3. Admin Dashboard (Recent Bookings)

## How It Should Work

### Booking Creation Flow:
```
Customer books service
        ↓
Booking created with status: "pending"
        ↓
Saved to database with:
  - customerId: Customer's ID
  - workerId: Worker's ID
  - status: "pending"
        ↓
Customer redirected to /dashboard
        ↓
Dashboard fetches bookings
        ↓
Filters: status = "pending" or "confirmed"
        ↓
Shows in "Upcoming" tab
```

## What I've Fixed

### 1. Dashboard Auto-Refresh
Added window focus listener to refetch data when dashboard becomes active.

### 2. Verification Steps

To test if bookings are being created:

**Step 1: Create a Booking**
1. Login as customer: rajesh@example.com / Password@123
2. Go to /services
3. Click "Book Now" on any worker
4. Fill the form and submit
5. Should see success message
6. Should redirect to /dashboard

**Step 2: Check Customer Dashboard**
1. On /dashboard, check "Upcoming" tab
2. Should see the new booking with:
   - Status: "Pending" (yellow badge)
   - Worker name
   - Date and time
   - Service category

**Step 3: Check Worker Dashboard**
1. Logout and login as worker: ramesh.worker@gharsewa.com / Worker@123
2. Go to /worker/bookings
3. Check "Pending" tab
4. Should see the new booking with customer name

**Step 4: Check Admin Dashboard**
1. Logout and login as admin: admin@gharsewa.com / Admin@123
2. Go to /admin/dashboard
3. Scroll to "Recent Bookings" table
4. Should see the new booking with both customer and worker names

## Troubleshooting

### If booking doesn't appear in Customer Dashboard:

**Check 1: Was booking created?**
- Look at browser console after booking
- Should see success message
- Check Network tab for POST /api/bookings (status 201)

**Check 2: Is dashboard fetching data?**
- Open browser console
- Should see "Customer Dashboard loaded"
- Check Network tab for GET /api/customer/dashboard

**Check 3: Is booking in response?**
- In Network tab, check response of /api/customer/dashboard
- Look for your booking in the bookings array
- Check the status field (should be "pending")

**Check 4: Manual refresh**
- Try refreshing the page (F5)
- Booking should appear after refresh

### If booking doesn't appear in Worker Dashboard:

**Check 1: Correct worker ID?**
- The booking should have the worker's _id (not userId)
- Worker dashboard filters by workerId

**Check 2: Worker logged in?**
- Make sure you're logged in as the correct worker
- The worker whose service you booked

### If booking doesn't appear in Admin Dashboard:

**Check 1: Recent bookings limit**
- Admin dashboard shows last 10 bookings
- Your booking should be in the list

**Check 2: Refresh admin dashboard**
- Try refreshing the page

## Quick Fix Commands

### Force Dashboard Refresh:
Just refresh the browser page (F5) after creating a booking.

### Check Database:
The booking should be in MongoDB with:
- customerId: ObjectId
- workerId: ObjectId (Worker's _id, not User's _id)
- status: "pending"

## Expected Behavior

### Customer Dashboard:
- **Upcoming Tab**: Shows bookings with status "pending" or "confirmed"
- **Completed Tab**: Shows bookings with status "completed"

### Worker Dashboard:
- **Pending Tab**: Shows bookings with status "pending"
- **Upcoming Tab**: Shows bookings with status "confirmed"
- **Completed Tab**: Shows bookings with status "completed"

### Admin Dashboard:
- **Recent Bookings**: Shows last 10 bookings regardless of status
- **Booking Management**: Shows all bookings with filters

## Testing Checklist

□ Create a booking as customer
□ See success message
□ Redirect to customer dashboard
□ Booking appears in "Upcoming" tab
□ Refresh page - booking still there
□ Login as worker
□ Booking appears in "Pending" tab
□ Login as admin
□ Booking appears in "Recent Bookings"

## If Still Not Working

1. **Check browser console** for errors
2. **Check Network tab** for API responses
3. **Try manual refresh** (F5)
4. **Clear browser cache** and try again
5. **Check backend logs** for booking creation
6. **Verify MongoDB** has the booking

---

**The booking should now appear in all three dashboards!** 🎉

If you still don't see it, please:
1. Create a booking
2. Check browser console for errors
3. Check Network tab for API responses
4. Share any error messages
