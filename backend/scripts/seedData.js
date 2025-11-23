const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const ServiceCategory = require('../models/ServiceCategory');
const SystemSettings = require('../models/SystemSettings');
const Content = require('../models/Content');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await ServiceCategory.deleteMany();
    await SystemSettings.deleteMany();
    await Content.deleteMany();

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        phone: '9999999999',
        role: 'admin',
        password: process.env.ADMIN_PASSWORD
      });
      console.log('Admin user created');
    }

    // Seed service categories
    const categories = [
      {
        name: 'Electrician',
        description: 'Electrical repairs, installations, and maintenance',
        icon: 'fa-bolt'
      },
      {
        name: 'Plumber',
        description: 'Plumbing repairs, pipe fitting, and water solutions',
        icon: 'fa-wrench'
      },
      {
        name: 'House Cleaning',
        description: 'Professional house cleaning and sanitization services',
        icon: 'fa-broom'
      },
      {
        name: 'Maid',
        description: 'Daily household help and domestic assistance',
        icon: 'fa-user'
      },
      {
        name: 'Carpenter',
        description: 'Furniture repair, woodwork, and carpentry services',
        icon: 'fa-hammer'
      },
      {
        name: 'Cook',
        description: 'Professional cooking services for homes',
        icon: 'fa-utensils'
      },
      {
        name: 'Painter',
        description: 'Interior and exterior painting services',
        icon: 'fa-paint-roller'
      },
      {
        name: 'Driver',
        description: 'Personal driver services for daily commute',
        icon: 'fa-car'
      }
    ];

    await ServiceCategory.insertMany(categories);
    console.log('Service categories seeded');

    // Seed system settings
    await SystemSettings.create({
      otpExpiryMinutes: 10,
      sessionTimeoutMinutes: 60,
      commissionRate: 10,
      maintenanceMode: false,
      cancellationPolicy: 'Cancellations must be made 24 hours in advance for full refund.'
    });
    console.log('System settings seeded');

    // Seed content
    const content = [
      {
        section: 'homepage_banner',
        title: 'Verified Help for Every Home',
        content: 'Find trusted maids, cooks, or maintenance workers in your area.',
        isActive: true
      },
      {
        section: 'about',
        title: 'About GharSewa',
        content: 'GharSewa connects you with verified domestic helpers near you. Our goal is to make household help safe, reliable, and easily accessible.',
        isActive: true
      },
      {
        section: 'terms',
        title: 'Terms of Use',
        content: 'By using GharSewa, you agree to our terms and conditions...',
        isActive: true
      },
      {
        section: 'privacy',
        title: 'Privacy Policy',
        content: 'We respect your privacy and are committed to protecting your personal data...',
        isActive: true
      }
    ];

    await Content.insertMany(content);
    console.log('Content seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
