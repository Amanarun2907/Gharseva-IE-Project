const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Review = require('../models/Review');
const ServiceCategory = require('../models/ServiceCategory');
const SystemSettings = require('../models/SystemSettings');
const Notification = require('../models/Notification');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalWorkers = await Worker.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'open' });
    
    const payments = await Payment.find({ paymentStatus: 'completed' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.commissionAmount, 0);
    
    // Calculate growth metrics
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newUsersThisWeek = await User.countDocuments({ 
      role: 'customer', 
      createdAt: { $gte: oneWeekAgo } 
    });
    
    const newBookingsToday = await Booking.countDocuments({ 
      createdAt: { $gte: today } 
    });
    
    // Revenue growth calculation
    const lastMonthRevenue = await Payment.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: oneMonthAgo, $lt: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$commissionAmount' }
        }
      }
    ]);
    
    const thisMonthRevenue = await Payment.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$commissionAmount' }
        }
      }
    ]);
    
    const lastMonthTotal = lastMonthRevenue[0]?.total || 1;
    const thisMonthTotal = thisMonthRevenue[0]?.total || 0;
    const revenueGrowth = Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100);
    
    // Revenue chart data (last 7 days)
    const revenueByDay = await Payment.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$commissionAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Bookings by status chart
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Service categories distribution
    const categoriesDistribution = await Booking.aggregate([
      {
        $group: {
          _id: '$serviceCategory',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);
    
    // Recent bookings with populated data
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customerId', 'name email')
      .populate({
        path: 'workerId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalWorkers,
        totalBookings,
        totalRevenue,
        newUsersThisWeek,
        newBookingsToday,
        revenueGrowth: Math.max(0, revenueGrowth),
        pendingComplaints,
        recentBookings,
        revenueChart: {
          labels: revenueByDay.map(d => new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
          data: revenueByDay.map(d => d.total)
        },
        bookingsChart: {
          labels: bookingsByStatus.map(b => b._id),
          data: bookingsByStatus.map(b => b.count)
        },
        categoriesChart: {
          labels: categoriesDistribution.map(c => c._id),
          data: categoriesDistribution.map(c => c.count)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private (Admin)
exports.getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: 'customer' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const customers = await User.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get customer by ID
// @route   GET /api/admin/customers/:id
// @access  Private (Admin)
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    const bookings = await Booking.find({ customerId: req.params.id });
    const complaints = await Complaint.find({ customerId: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {
        customer,
        bookings,
        complaints
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Block customer
// @route   PUT /api/admin/customers/:id/block
// @access  Private (Admin)
exports.blockCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    customer.isBlocked = !customer.isBlocked;
    await customer.save();
    
    res.status(200).json({
      success: true,
      message: `Customer ${customer.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete customer
// @route   DELETE /api/admin/customers/:id
// @access  Private (Admin)
exports.deleteCustomer = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all workers
// @route   GET /api/admin/workers
// @access  Private (Admin)
exports.getWorkers = async (req, res) => {
  try {
    const { search, verificationStatus } = req.query;
    let query = {};
    
    if (verificationStatus) {
      query.verificationStatus = verificationStatus;
    }
    
    const workers = await Worker.find(query).populate('userId').sort({ createdAt: -1 });
    
    // Filter by search if provided
    let filteredWorkers = workers;
    if (search) {
      filteredWorkers = workers.filter(w => 
        w.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        w.serviceCategory?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.status(200).json({
      success: true,
      data: filteredWorkers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get worker by ID
// @route   GET /api/admin/workers/:id
// @access  Private (Admin)
exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('userId');
    const bookings = await Booking.find({ workerId: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {
        worker,
        bookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify worker
// @route   PUT /api/admin/workers/:id/verify
// @access  Private (Admin)
exports.verifyWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('userId');
    
    worker.verificationStatus = 'verified';
    worker.verificationDate = new Date();
    await worker.save();
    
    // Send notification to worker
    await Notification.create({
      recipientId: worker.userId._id,
      recipientRole: 'worker',
      type: 'announcement',
      title: 'Verification Approved',
      message: 'Congratulations! Your profile has been verified. You can now receive bookings.',
      relatedId: worker._id
    });
    
    res.status(200).json({
      success: true,
      message: 'Worker verified successfully',
      data: worker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject worker verification
// @route   PUT /api/admin/workers/:id/reject
// @access  Private (Admin)
exports.rejectWorker = async (req, res) => {
  try {
    const { reason } = req.body;
    const worker = await Worker.findById(req.params.id).populate('userId');
    
    worker.verificationStatus = 'rejected';
    worker.rejectionReason = reason;
    await worker.save();
    
    // Send notification to worker
    await Notification.create({
      recipientId: worker.userId._id,
      recipientRole: 'worker',
      type: 'announcement',
      title: 'Verification Rejected',
      message: `Your verification has been rejected. Reason: ${reason}`,
      relatedId: worker._id
    });
    
    res.status(200).json({
      success: true,
      message: 'Worker verification rejected',
      data: worker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private (Admin)
exports.getCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find();
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    
    // Check if any workers are using this category
    const workersCount = await Worker.countDocuments({ serviceCategory: category.name });
    
    if (workersCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with active workers'
      });
    }
    
    await ServiceCategory.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin)
exports.getBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (startDate && endDate) {
      query.scheduledDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const bookings = await Booking.find(query)
      .populate('customerId', 'name email phone')
      .populate({
        path: 'workerId',
        populate: {
          path: 'userId',
          select: 'name email phone'
        }
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reassign booking
// @route   PUT /api/admin/bookings/:id/reassign
// @access  Private (Admin)
exports.reassignBooking = async (req, res) => {
  try {
    const { workerId } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    const oldWorkerId = booking.workerId;
    booking.workerId = workerId;
    await booking.save();
    
    // Send notifications
    await Notification.create({
      recipientId: oldWorkerId,
      recipientRole: 'worker',
      type: 'booking',
      title: 'Booking Reassigned',
      message: `Booking ${booking.bookingId} has been reassigned to another worker.`,
      relatedId: booking._id
    });
    
    res.status(200).json({
      success: true,
      message: 'Booking reassigned successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private (Admin)
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('bookingId')
      .populate('customerId', 'name email')
      .populate('workerId')
      .sort({ createdAt: -1 });
    
    const totalRevenue = payments
      .filter(p => p.paymentStatus === 'completed')
      .reduce((sum, p) => sum + p.commissionAmount, 0);
    
    res.status(200).json({
      success: true,
      data: {
        payments,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update commission rate
// @route   PUT /api/admin/settings/commission
// @access  Private (Admin)
exports.updateCommission = async (req, res) => {
  try {
    const { commissionRate } = req.body;
    
    if (commissionRate < 0 || commissionRate > 50) {
      return res.status(400).json({
        success: false,
        message: 'Commission rate must be between 0-50%'
      });
    }
    
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create({ commissionRate });
    } else {
      settings.commissionRate = commissionRate;
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Commission rate updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all complaints
// @route   GET /api/admin/complaints
// @access  Private (Admin)
exports.getComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const complaints = await Complaint.find(query)
      .populate('customerId', 'name email phone')
      .populate('workerId')
      .populate('bookingId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Resolve complaint
// @route   PUT /api/admin/complaints/:id/resolve
// @access  Private (Admin)
exports.resolveComplaint = async (req, res) => {
  try {
    const { adminResponse } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    
    complaint.status = 'resolved';
    complaint.adminResponse = adminResponse;
    complaint.resolvedAt = new Date();
    await complaint.save();
    
    // Send notification to customer
    await Notification.create({
      recipientId: complaint.customerId,
      recipientRole: 'customer',
      type: 'complaint',
      title: 'Complaint Resolved',
      message: `Your complaint ${complaint.complaintId} has been resolved. Response: ${adminResponse}`,
      relatedId: complaint._id
    });
    
    res.status(200).json({
      success: true,
      message: 'Complaint resolved successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews
// @route   GET /api/admin/reviews
// @access  Private (Admin)
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('customerId', 'name')
      .populate('workerId')
      .populate('bookingId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    const workerId = review.workerId;
    
    await Review.findByIdAndDelete(req.params.id);
    
    // Recalculate worker rating
    const worker = await Worker.findById(workerId);
    const reviews = await Review.find({ workerId });
    
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      worker.rating = avgRating;
      worker.totalRatings = reviews.length;
    } else {
      worker.rating = 0;
      worker.totalRatings = 0;
    }
    
    await worker.save();
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
exports.getSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create({});
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
