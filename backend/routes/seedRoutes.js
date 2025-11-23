const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ServiceCategory = require('../models/ServiceCategory');
const SystemSettings = require('../models/SystemSettings');
const Content = require('../models/Content');

// @route   GET /api/seed/init
// @desc    Initialize database with seed data
// @access  Public (for initial setup only)
router.get('/init', async (req, res) => {
  try {
    // Check if already seeded
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    const categoriesExist = await ServiceCategory.countDocuments();

    if (adminExists && categoriesExist > 0) {
      return res.json({
        success: true,
        message: 'Database already seeded',
        data: {
          adminExists: true,
          categoriesCount: categoriesExist
        }
      });
    }

    // Create admin user if not exists
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@gharsewa.com',
        phone: '9999999999',
        role: 'admin',
        password: process.env.ADMIN_PASSWORD || 'Admin@123'
      });
    }

    // Seed service categories if empty
    if (categoriesExist === 0) {
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
    }

    // Seed system settings if not exists
    const settingsExist = await SystemSettings.findOne();
    if (!settingsExist) {
      await SystemSettings.create({
        otpExpiryMinutes: 10,
        sessionTimeoutMinutes: 60,
        commissionRate: 10,
        maintenanceMode: false,
        cancellationPolicy: 'Cancellations must be made 24 hours in advance for full refund.'
      });
    }

    // Seed content if not exists
    const contentExist = await Content.countDocuments();
    if (contentExist === 0) {
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
          content: 'GharSewa connects you with verified domestic helpers near you.',
          isActive: true
        }
      ];
      await Content.insertMany(content);
    }

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        adminCreated: !adminExists,
        categoriesCreated: categoriesExist === 0,
        adminEmail: process.env.ADMIN_EMAIL || 'admin@gharsewa.com',
        adminPassword: 'Admin@123'
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message
    });
  }
});

module.exports = router;
