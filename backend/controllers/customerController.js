const ServiceCategory = require('../models/ServiceCategory');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Attendance = require('../models/Attendance');

// @desc    Get all service categories
// @route   GET /api/customer/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true });
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

// @desc    Get workers by category/location
// @route   GET /api/customer/workers
// @access  Public
exports.getWorkers = async (req, res) => {
  try {
    const { serviceCategory, city, minRating } = req.query;
    
    const query = { verificationStatus: 'verified', isAvailable: true };
    
    if (serviceCategory) {
      query.serviceCategory = serviceCategory;
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    let workers = await Worker.find(query).populate('userId', 'name email phone address');
    
    // Filter by city if provided
    if (city) {
      workers = workers.filter(w => 
        w.userId?.address?.city?.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Sort by rating descending
    workers.sort((a, b) => b.rating - a.rating);

    res.status(200).json({
      success: true,
      count: workers.length,
      data: workers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get worker by ID
// @route   GET /api/customer/workers/:id
// @access  Public
exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('userId', 'name email phone address');
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get customer dashboard data
// @route   GET /api/customer/dashboard
// @access  Private (Customer)
exports.getDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate({
        path: 'workerId',
        populate: {
          path: 'userId',
          select: 'name email phone'
        }
      })
      .sort({ createdAt: -1 });

    const stats = {
      total: bookings.length,
      upcoming: bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length,
      completed: bookings.filter(b => b.status === 'completed').length
    };

    res.status(200).json({
      success: true,
      data: {
        bookings,
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

// @desc    Get customer bookings
// @route   GET /api/customer/bookings
// @access  Private (Customer)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
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

// @desc    Get attendance records
// @route   GET /api/customer/attendance
// @access  Private (Customer)
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ customerId: req.user.id })
      .populate('workerId')
      .populate('bookingId')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalDays = attendance.filter(a => a.status === 'checked-out').length;
    const onTimeDays = attendance.filter(a => a.status === 'checked-out' && a.duration > 0).length;
    const punctualityPercentage = totalDays > 0 ? ((onTimeDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        attendance,
        stats: {
          totalDays,
          punctualityPercentage
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
