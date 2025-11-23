const express = require('express');
const router = express.Router();
const {
  getServices,
  getWorkers,
  getWorkerById,
  getDashboard,
  getBookings,
  getAttendance
} = require('../controllers/customerController');
const {
  getMockServices,
  getMockWorkers,
  getMockWorkerById,
  getMockDashboard
} = require('../controllers/mockDataController');
const { protect, authorize } = require('../middleware/auth');

// Public routes - now using real database
router.get('/services', getServices);
router.get('/workers', getWorkers);
router.get('/workers/:id', getWorkerById);

// Protected routes
router.get('/dashboard', protect, authorize('customer'), getDashboard);
router.get('/bookings', protect, authorize('customer'), getBookings);
router.get('/attendance', protect, authorize('customer'), getAttendance);

module.exports = router;
