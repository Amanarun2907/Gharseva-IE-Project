const nodemailer = require('nodemailer');

// Create transporter (will be null if email not configured)
let transporter = null;

try {
  transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} catch (error) {
  console.log('Email service not configured');
}

// Send email function
exports.sendEmail = async (options) => {
  if (!transporter) {
    console.log('Email service not configured - skipping email');
    return true; // Return true for development
  }
  
  try {
    const mailOptions = {
      from: `GharSewa <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Send OTP email
exports.sendOTPEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">GharSewa - OTP Verification</h2>
      <p>Your One-Time Password (OTP) for login is:</p>
      <h1 style="color: #2563eb; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
      <p>This OTP is valid for ${process.env.OTP_EXPIRY_MINUTES} minutes.</p>
      <p>If you didn't request this OTP, please ignore this email.</p>
      <hr style="margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">GharSewa - Verified Help for Every Home</p>
    </div>
  `;

  return await this.sendEmail({
    email,
    subject: 'GharSewa - Your OTP for Login',
    html
  });
};

// Send booking confirmation email
exports.sendBookingConfirmation = async (email, bookingDetails) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Booking Confirmation</h2>
      <p>Your booking has been confirmed!</p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
        <p><strong>Service:</strong> ${bookingDetails.serviceCategory}</p>
        <p><strong>Date:</strong> ${new Date(bookingDetails.scheduledDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${bookingDetails.scheduledTime}</p>
        <p><strong>Total Price:</strong> ₹${bookingDetails.totalPrice}</p>
      </div>
      <p>Thank you for choosing GharSewa!</p>
    </div>
  `;

  return await this.sendEmail({
    email,
    subject: 'GharSewa - Booking Confirmation',
    html
  });
};
