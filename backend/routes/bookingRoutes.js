const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// Real booking endpoints with authentication
router.post('/', protect, createBooking);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
