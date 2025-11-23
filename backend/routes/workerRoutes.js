const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getBookings,
  acceptBooking,
  rejectBooking,
  checkIn,
  checkOut,
  getEarnings,
  getPayments,
  updateProfile
} = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('worker'), getDashboard);
router.get('/bookings', protect, authorize('worker'), getBookings);
router.put('/bookings/:id/accept', protect, authorize('worker'), acceptBooking);
router.put('/bookings/:id/reject', protect, authorize('worker'), rejectBooking);
router.post('/checkin', protect, authorize('worker'), checkIn);
router.post('/checkout', protect, authorize('worker'), checkOut);
router.get('/earnings', protect, authorize('worker'), getEarnings);
router.get('/payments', protect, authorize('worker'), getPayments);
router.put('/profile', protect, authorize('worker'), updateProfile);

module.exports = router;
