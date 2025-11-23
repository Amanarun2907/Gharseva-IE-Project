const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// MongoDB connection
const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      tls: true,
      tlsAllowInvalidCertificates: true
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Sample reviews data
const reviewsData = [
  {
    rating: 5,
    comment: 'Excellent service! Very professional and punctual. Fixed my plumbing issue quickly.'
  },
  {
    rating: 4,
    comment: 'Good work. Arrived on time and completed the job efficiently.'
  },
  {
    rating: 5,
    comment: 'Outstanding! Very skilled and friendly. Highly recommended.'
  },
  {
    rating: 4,
    comment: 'Professional service. Minor delay but overall satisfied with the work.'
  },
  {
    rating: 5,
    comment: 'Amazing experience! Will definitely book again. Very thorough and clean work.'
  },
  {
    rating: 5,
    comment: 'Best service provider I have used. Polite, skilled, and efficient.'
  },
  {
    rating: 4,
    comment: 'Very good service. Quality work at reasonable price.'
  },
  {
    rating: 5,
    comment: 'Exceptional work! Solved the problem that others couldn\'t fix.'
  },
  {
    rating: 4,
    comment: 'Reliable and trustworthy. Good communication throughout the service.'
  },
  {
    rating: 5,
    comment: 'Perfect! Exactly what I needed. Very satisfied with the results.'
  },
  {
    rating: 5,
    comment: 'Highly professional. Cleaned up after work and explained everything clearly.'
  },
  {
    rating: 4,
    comment: 'Great service. Would have been 5 stars if arrived a bit earlier.'
  },
  {
    rating: 5,
    comment: 'Superb! Very knowledgeable and experienced. Fixed everything perfectly.'
  },
  {
    rating: 5,
    comment: 'Wonderful experience! Courteous, skilled, and very efficient.'
  },
  {
    rating: 4,
    comment: 'Good quality work. Fair pricing and honest service.'
  }
];

// Add reviews
const addReviews = async () => {
  try {
    console.log('🌱 Starting to add reviews...');

    // Get all customers and workers
    const customers = await User.find({ role: 'customer' });
    const workers = await Worker.find({ verificationStatus: 'verified' }).populate('userId');

    if (customers.length === 0 || workers.length === 0) {
      console.log('❌ No customers or workers found. Please seed database first.');
      process.exit(1);
    }

    console.log(`Found ${customers.length} customers and ${workers.length} workers`);

    let reviewCount = 0;
    let bookingCount = 0;

    // Create bookings and reviews for each worker
    for (const worker of workers) {
      // Create 2-3 bookings per worker
      const numBookings = Math.floor(Math.random() * 2) + 2; // 2-3 bookings

      for (let i = 0; i < numBookings; i++) {
        // Random customer
        const customer = customers[Math.floor(Math.random() * customers.length)];

        // Create booking
        const booking = await Booking.create({
          bookingId: 'BK' + Date.now() + Math.floor(Math.random() * 1000),
          customerId: customer._id,
          workerId: worker._id,
          serviceCategory: worker.serviceCategory,
          duration: 'one-time',
          scheduledDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random past date
          scheduledTime: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'][Math.floor(Math.random() * 4)],
          address: {
            street: customer.address?.street || '123 Main Street',
            city: customer.address?.city || 'Mumbai',
            state: customer.address?.state || 'Maharashtra',
            pincode: customer.address?.pincode || '400001'
          },
          additionalNotes: 'Service completed successfully',
          paymentMethod: Math.random() > 0.5 ? 'cash' : 'online',
          totalPrice: worker.serviceCharges + Math.floor(Math.random() * 200),
          status: 'completed'
        });

        bookingCount++;

        // Create review for this booking
        const reviewData = reviewsData[Math.floor(Math.random() * reviewsData.length)];
        await Review.create({
          bookingId: booking._id,
          customerId: customer._id,
          workerId: worker._id,
          rating: reviewData.rating,
          comment: reviewData.comment
        });

        reviewCount++;
      }
    }

    console.log(`✅ Added ${bookingCount} bookings`);
    console.log(`✅ Added ${reviewCount} reviews`);
    console.log('\n🎉 Reviews added successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding reviews:', error);
    process.exit(1);
  }
};

// Run
connectDB().then(() => addReviews());
