const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const Notification = require('../models/Notification');
const { sendBookingConfirmation } = require('../utils/emailService');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res) => {
  try {
    const {
      workerId,
      serviceCategory,
      duration,
      scheduledDate,
      scheduledTime,
      address,
      additionalNotes,
      paymentMethod,
      totalPrice
    } = req.body;

    // Validate scheduled date is not in past
    const bookingDate = new Date(scheduledDate);
    if (bookingDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book for past dates'
      });
    }

    // Check if worker exists and is available
    const worker = await Worker.findById(workerId).populate('userId');
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    if (!worker.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Worker is not available'
      });
    }

    // Create booking
    const booking = await Booking.create({
      customerId: req.user.id,
      workerId,
      serviceCategory,
      duration,
      scheduledDate,
      scheduledTime,
      address,
      additionalNotes,
      paymentMethod,
      totalPrice
    });

    // Create notifications
    await Notification.create({
      recipientId: req.user.id,
      recipientRole: 'customer',
      type: 'booking',
      title: 'Booking Confirmed',
      message: `Your booking for ${serviceCategory} has been confirmed. Booking ID: ${booking.bookingId}`,
      relatedId: booking._id
    });

    await Notification.create({
      recipientId: worker.userId._id,
      recipientRole: 'worker',
      type: 'booking',
      title: 'New Booking Request',
      message: `You have a new booking request for ${serviceCategory}. Booking ID: ${booking.bookingId}`,
      relatedId: booking._id
    });

    // Send email notifications
    await sendBookingConfirmation(req.user.email, {
      bookingId: booking.bookingId,
      serviceCategory,
      scheduledDate,
      scheduledTime,
      totalPrice
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('workerId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    await booking.save();

    // Create notifications
    await Notification.create({
      recipientId: booking.customerId,
      recipientRole: 'customer',
      type: 'booking',
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingId} has been cancelled.`,
      relatedId: booking._id
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
