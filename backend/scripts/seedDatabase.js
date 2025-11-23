const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/User');
const Worker = require('../models/Worker');
const ServiceCategory = require('../models/ServiceCategory');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// MongoDB connection with SSL fix
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

// Service Categories Data
const serviceCategories = [
  {
    name: 'Plumber',
    description: 'Professional plumbing services for all your needs',
    icon: 'fa-wrench',
    basePrice: 300,
    isActive: true
  },
  {
    name: 'Electrician',
    description: 'Expert electrical repairs and installations',
    icon: 'fa-bolt',
    basePrice: 350,
    isActive: true
  },
  {
    name: 'Carpenter',
    description: 'Skilled carpentry and furniture work',
    icon: 'fa-hammer',
    basePrice: 400,
    isActive: true
  },
  {
    name: 'House Cleaning',
    description: 'Complete home cleaning services',
    icon: 'fa-broom',
    basePrice: 500,
    isActive: true
  },
  {
    name: 'Painter',
    description: 'Professional painting services',
    icon: 'fa-paint-roller',
    basePrice: 450,
    isActive: true
  },
  {
    name: 'AC Repair',
    description: 'AC installation, repair and maintenance',
    icon: 'fa-fan',
    basePrice: 400,
    isActive: true
  },
  {
    name: 'Pest Control',
    description: 'Complete pest control solutions',
    icon: 'fa-bug',
    basePrice: 800,
    isActive: true
  },
  {
    name: 'Appliance Repair',
    description: 'Repair services for all home appliances',
    icon: 'fa-tools',
    basePrice: 350,
    isActive: true
  }
];

// Sample Users Data
const users = [
  {
    name: 'Admin User',
    email: 'admin@gharsewa.com',
    password: 'Admin@123',
    phone: '9876543210',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    password: 'Password@123',
    phone: '9876543211',
    role: 'customer',
    isVerified: true,
    address: {
      street: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    }
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'Password@123',
    phone: '9876543212',
    role: 'customer',
    isVerified: true,
    address: {
      street: '456 Park Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    }
  },
  {
    name: 'Amit Patel',
    email: 'amit@example.com',
    password: 'Password@123',
    phone: '9876543213',
    role: 'customer',
    isVerified: true,
    address: {
      street: '789 Brigade Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    }
  }
];

// Sample Workers Data (will be created as Users first)
const workerUsers = [
  {
    name: 'Ramesh Singh',
    email: 'ramesh.worker@gharsewa.com',
    phone: '9876543220',
    password: 'Worker@123',
    role: 'worker',
    isVerified: true
  },
  {
    name: 'Suresh Yadav',
    email: 'suresh.worker@gharsewa.com',
    phone: '9876543221',
    password: 'Worker@123',
    role: 'worker',
    isVerified: true
  },
  {
    name: 'Vijay Carpenter',
    email: 'vijay.worker@gharsewa.com',
    phone: '9876543222',
    password: 'Worker@123',
    role: 'worker',
    isVerified: true
  },
  {
    name: 'Lakshmi Cleaning Services',
    email: 'lakshmi.worker@gharsewa.com',
    phone: '9876543223',
    password: 'Worker@123',
    role: 'worker',
    isVerified: true
  },
  {
    name: 'Ravi Painter',
    email: 'ravi.worker@gharsewa.com',
    phone: '9876543224',
    password: 'Worker@123',
    role: 'worker',
    isVerified: true
  },
  {
    name: 'Anil AC Services',
    email: 'anil.worker@gharsewa.com',
    phone: '9876543225',
    password: 'Worker@123',
    role: 'worker',
    isVerified: true
  }
];

const workers = [
  {
    serviceCategory: 'Plumber',
    experience: 8,
    serviceCharges: 350,
    skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom Fitting', 'Water Heater Installation'],
    rating: 4.8,
    totalRatings: 156,
    completedJobs: 234,
    verificationStatus: 'verified',
    isAvailable: true,
    responseTime: 25
  },
  {
    serviceCategory: 'Electrician',
    experience: 10,
    serviceCharges: 400,
    skills: ['Wiring', 'Circuit Repair', 'Light Installation', 'Fan Installation', 'MCB Replacement'],
    rating: 4.9,
    totalRatings: 203,
    completedJobs: 312,
    verificationStatus: 'verified',
    isAvailable: true,
    responseTime: 20,
    isTopRated: true
  },
  {
    serviceCategory: 'Carpenter',
    experience: 12,
    serviceCharges: 450,
    skills: ['Furniture Making', 'Door Repair', 'Cabinet Installation', 'Wood Polishing'],
    rating: 4.7,
    totalRatings: 178,
    completedJobs: 267,
    verificationStatus: 'verified',
    isAvailable: true,
    responseTime: 30
  },
  {
    serviceCategory: 'House Cleaning',
    experience: 5,
    serviceCharges: 250,
    skills: ['Deep Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Floor Mopping'],
    rating: 4.6,
    totalRatings: 142,
    completedJobs: 198,
    verificationStatus: 'verified',
    isAvailable: true,
    responseTime: 18
  },
  {
    serviceCategory: 'Painter',
    experience: 9,
    serviceCharges: 400,
    skills: ['Wall Painting', 'Texture Work', 'Waterproofing', 'Wood Painting'],
    rating: 4.8,
    totalRatings: 167,
    completedJobs: 245,
    verificationStatus: 'verified',
    isAvailable: true,
    responseTime: 28,
    isTopRated: true
  },
  {
    serviceCategory: 'AC Repair',
    experience: 7,
    serviceCharges: 450,
    skills: ['AC Installation', 'Gas Filling', 'AC Servicing', 'Compressor Repair'],
    rating: 4.9,
    totalRatings: 189,
    completedJobs: 278,
    verificationStatus: 'verified',
    isAvailable: true,
    responseTime: 22,
    isTopRated: true
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Worker.deleteMany({});
    await ServiceCategory.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert Service Categories
    const categories = await ServiceCategory.insertMany(serviceCategories);
    console.log(`✅ Added ${categories.length} service categories`);

    // Hash passwords and insert users
    const allUsers = [...users, ...workerUsers];
    for (let user of allUsers) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    const createdUsers = await User.insertMany(allUsers);
    console.log(`✅ Added ${createdUsers.length} users`);

    // Create worker profiles linked to worker users
    const workerUserRecords = createdUsers.filter(u => u.role === 'worker');
    const createdWorkers = [];
    
    for (let i = 0; i < workers.length && i < workerUserRecords.length; i++) {
      const workerData = {
        ...workers[i],
        userId: workerUserRecords[i]._id
      };
      const worker = await Worker.create(workerData);
      createdWorkers.push(worker);
    }
    console.log(`✅ Added ${createdWorkers.length} workers`);

    // Create sample bookings
    const customer = createdUsers.find(u => u.role === 'customer');
    const worker = createdWorkers[0];
    
    if (customer && worker) {
      const sampleBooking = await Booking.create({
        bookingId: 'BK' + Date.now(),
        customerId: customer._id,
        workerId: worker._id,
        serviceCategory: 'Plumber',
        duration: 'one-time',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        scheduledTime: '10:00 AM',
        address: {
          street: customer.address?.street || '123 Main Street',
          city: customer.address?.city || 'Mumbai',
          state: customer.address?.state || 'Maharashtra',
          pincode: customer.address?.pincode || '400001'
        },
        additionalNotes: 'Need plumbing work for kitchen sink',
        paymentMethod: 'cash',
        totalPrice: 700,
        status: 'pending'
      });
      console.log('✅ Added sample booking');

      // Create sample review
      const sampleReview = await Review.create({
        bookingId: sampleBooking._id,
        customerId: customer._id,
        workerId: worker._id,
        rating: 5,
        comment: 'Excellent service! Very professional and punctual.'
      });
      console.log('✅ Added sample review');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Service Categories: ${categories.length}`);
    console.log(`   - Users: ${createdUsers.length}`);
    console.log(`   - Workers: ${createdWorkers.length}`);
    console.log(`   - Sample Bookings: 1`);
    console.log(`   - Sample Reviews: 1`);
    console.log('\n✅ You can now login with:');
    console.log('   Admin: admin@gharsewa.com / Admin@123');
    console.log('   Customer: rajesh@example.com / Password@123');
    console.log('   Worker: ramesh.worker@gharsewa.com / Worker@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => seedDatabase());
