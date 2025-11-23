const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const SystemSettings = require('../models/SystemSettings');

// @desc    Get worker dashboard data
// @route   GET /api/worker/dashboard
// @access  Private (Worker)
exports.getDashboard = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    const bookings = await Booking.find({ workerId: worker._id })
      .populate('customerId', 'name email phone address')
      .sort({ createdAt: -1 });

    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const upcomingBookings = bookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;

    // Calculate earnings
    const payments = await Payment.find({ workerId: worker._id, paymentStatus: 'completed' });
    const totalEarnings = payments.reduce((sum, p) => sum + p.workerEarnings, 0);
    
    // Monthly earnings
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyPayments = await Payment.find({ 
      workerId: worker._id, 
      paymentStatus: 'completed',
      createdAt: { $gte: oneMonthAgo }
    });
    const monthlyEarnings = monthlyPayments.reduce((sum, p) => sum + p.workerEarnings, 0);
    
    // Earnings chart (last 7 days)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const earningsByDay = await Payment.aggregate([
      {
        $match: {
          workerId: worker._id,
          paymentStatus: 'completed',
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$workerEarnings' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Calculate average rating
    const Review = require('../models/Review');
    const reviews = await Review.find({ workerId: worker._id });
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    // Recent bookings
    const recentBookings = bookings.slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        pendingBookings,
        upcomingBookings,
        completedBookings,
        totalEarnings,
        monthlyEarnings,
        averageRating,
        totalReviews: reviews.length,
        recentBookings,
        earningsChart: {
          labels: earningsByDay.map(d => new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
          data: earningsByDay.map(d => d.total)
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

// @desc    Get worker bookings
// @route   GET /api/worker/bookings
// @access  Private (Worker)
exports.getBookings = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found'
      });
    }

    const bookings = await Booking.find({ workerId: worker._id })
      .populate('customerId', 'name email phone address')
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

// @desc    Accept booking
// @route   PUT /api/worker/bookings/:id/accept
// @access  Private (Worker)
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = 'confirmed';
    await booking.save();

    // Create notification for customer
    await Notification.create({
      recipientId: booking.customerId,
      recipientRole: 'customer',
      type: 'booking',
      title: 'Booking Confirmed',
      message: `Your booking ${booking.bookingId} has been confirmed by the worker.`,
      relatedId: booking._id
    });

    res.status(200).json({
      success: true,
      message: 'Booking accepted successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject booking
// @route   PUT /api/worker/bookings/:id/reject
// @access  Private (Worker)
exports.rejectBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = 'rejected';
    booking.cancellationReason = reason;
    await booking.save();

    // Create notification for admin
    await Notification.create({
      recipientId: booking.customerId,
      recipientRole: 'customer',
      type: 'booking',
      title: 'Booking Rejected',
      message: `Your booking ${booking.bookingId} has been rejected. Reason: ${reason}`,
      relatedId: booking._id
    });

    res.status(200).json({
      success: true,
      message: 'Booking rejected',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check-in
// @route   POST /api/worker/checkin
// @access  Private (Worker)
exports.checkIn = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const worker = await Worker.findOne({ userId: req.user.id });
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Create or update attendance
    let attendance = await Attendance.findOne({ bookingId });
    
    if (!attendance) {
      attendance = await Attendance.create({
        bookingId,
        workerId: worker._id,
        customerId: booking.customerId,
        checkInTime: new Date(),
        status: 'checked-in'
      });
    } else {
      attendance.checkInTime = new Date();
      attendance.status = 'checked-in';
      await attendance.save();
    }

    booking.status = 'in-progress';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Checked in successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check-out
// @route   POST /api/worker/checkout
// @access  Private (Worker)
exports.checkOut = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const attendance = await Attendance.findOne({ bookingId });
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Check-in record not found'
      });
    }

    attendance.checkOutTime = new Date();
    attendance.status = 'checked-out';
    
    // Calculate duration in minutes
    const duration = Math.floor((attendance.checkOutTime - attendance.checkInTime) / 60000);
    attendance.duration = duration;
    await attendance.save();

    // Update booking status
    const booking = await Booking.findById(bookingId);
    booking.status = 'completed';
    await booking.save();

    // Create payment record
    const settings = await SystemSettings.findOne();
    const commissionRate = settings?.commissionRate || 10;
    const commissionAmount = (booking.totalPrice * commissionRate) / 100;
    const workerEarnings = booking.totalPrice - commissionAmount;

    await Payment.create({
      bookingId: booking._id,
      customerId: booking.customerId,
      workerId: attendance.workerId,
      amount: booking.totalPrice,
      commissionRate,
      commissionAmount,
      workerEarnings,
      paymentMethod: booking.paymentMethod,
      paymentStatus: 'completed',
      paidAt: new Date()
    });

    // Update worker stats
    const worker = await Worker.findById(attendance.workerId);
    worker.completedJobs += 1;
    await worker.save();

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get earnings
// @route   GET /api/worker/earnings
// @access  Private (Worker)
exports.getEarnings = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });
    
    const payments = await Payment.find({ workerId: worker._id });
    
    const stats = {
      totalEarnings: payments.reduce((sum, p) => sum + p.workerEarnings, 0),
      pendingPayments: payments.filter(p => p.paymentStatus === 'pending').reduce((sum, p) => sum + p.workerEarnings, 0),
      completedPayments: payments.filter(p => p.paymentStatus === 'completed').reduce((sum, p) => sum + p.workerEarnings, 0),
      totalCommission: payments.reduce((sum, p) => sum + p.commissionAmount, 0)
    };

    res.status(200).json({
      success: true,
      data: {
        payments,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment history
// @route   GET /api/worker/payments
// @access  Private (Worker)
exports.getPayments = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });
    
    const payments = await Payment.find({ workerId: worker._id })
      .populate('bookingId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update worker profile
// @route   PUT /api/worker/profile
// @access  Private (Worker)
exports.updateProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });
    
    const { serviceCharges, skills, isAvailable } = req.body;
    
    if (serviceCharges) worker.serviceCharges = serviceCharges;
    if (skills) worker.skills = skills;
    if (typeof isAvailable !== 'undefined') worker.isAvailable = isAvailable;
    
    await worker.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: worker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
