const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getCustomers,
  getCustomerById,
  blockCustomer,
  deleteCustomer,
  getWorkers,
  getWorkerById,
  verifyWorker,
  rejectWorker,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBookings,
  reassignBooking,
  getPayments,
  updateCommission,
  getComplaints,
  resolveComplaint,
  getReviews,
  deleteReview,
  getSettings,
  updateSettings
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Dashboard
router.get('/dashboard', protect, authorize('admin'), getDashboard);

// Customers
router.get('/customers', protect, authorize('admin'), getCustomers);
router.get('/customers/:id', protect, authorize('admin'), getCustomerById);
router.put('/customers/:id/block', protect, authorize('admin'), blockCustomer);
router.delete('/customers/:id', protect, authorize('admin'), deleteCustomer);

// Workers
router.get('/workers', protect, authorize('admin'), getWorkers);
router.get('/workers/:id', protect, authorize('admin'), getWorkerById);
router.put('/workers/:id/verify', protect, authorize('admin'), verifyWorker);
router.put('/workers/:id/reject', protect, authorize('admin'), rejectWorker);

// Categories
router.get('/categories', protect, authorize('admin'), getCategories);
router.post('/categories', protect, authorize('admin'), createCategory);
router.put('/categories/:id', protect, authorize('admin'), updateCategory);
router.delete('/categories/:id', protect, authorize('admin'), deleteCategory);

// Bookings
router.get('/bookings', protect, authorize('admin'), getBookings);
router.put('/bookings/:id/reassign', protect, authorize('admin'), reassignBooking);

// Payments
router.get('/payments', protect, authorize('admin'), getPayments);
router.put('/settings/commission', protect, authorize('admin'), updateCommission);

// Complaints
router.get('/complaints', protect, authorize('admin'), getComplaints);
router.put('/complaints/:id/resolve', protect, authorize('admin'), resolveComplaint);

// Reviews
router.get('/reviews', protect, authorize('admin'), getReviews);
router.delete('/reviews/:id', protect, authorize('admin'), deleteReview);

// Settings
router.get('/settings', protect, authorize('admin'), getSettings);
router.put('/settings', protect, authorize('admin'), updateSettings);

module.exports = router;
