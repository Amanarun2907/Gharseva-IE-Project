// Mock data for demonstration when MongoDB is not available

const mockUsers = [];
const mockWorkers = [
  {
    _id: '1',
    userId: {
      _id: 'u1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543210',
      address: { city: 'Delhi', state: 'Delhi', pincode: '110001' }
    },
    serviceCategory: 'Electrician',
    experience: 5,
    serviceCharges: 500,
    skills: ['Wiring', 'Installation', 'Repair', 'MCB Replacement', 'Fan Installation'],
    rating: 4.5,
    totalRatings: 20,
    completedJobs: 45,
    responseTime: 30,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Certified electrician with 5 years of experience in residential and commercial electrical work.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    _id: '2',
    userId: {
      _id: 'u2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '9876543211',
      address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
    },
    serviceCategory: 'House Cleaning',
    experience: 3,
    serviceCharges: 400,
    skills: ['Deep Cleaning', 'Sanitization', 'Kitchen Cleaning', 'Bathroom Cleaning'],
    rating: 4.8,
    totalRatings: 35,
    completedJobs: 78,
    responseTime: 20,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Professional cleaning expert specializing in deep cleaning and sanitization services.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    _id: '3',
    userId: {
      _id: 'u3',
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '9876543212',
      address: { city: 'Bangalore', state: 'Karnataka', pincode: '560001' }
    },
    serviceCategory: 'Plumber',
    experience: 7,
    serviceCharges: 600,
    skills: ['Pipe Fitting', 'Leak Repair', 'Installation', 'Bathroom Fitting', 'Water Heater'],
    rating: 4.6,
    totalRatings: 28,
    completedJobs: 62,
    responseTime: 25,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Expert plumber with 7 years of experience in all types of plumbing work.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    _id: '4',
    userId: {
      _id: 'u4',
      name: 'Sunita Devi',
      email: 'sunita@example.com',
      phone: '9876543213',
      address: { city: 'Delhi', state: 'Delhi', pincode: '110002' }
    },
    serviceCategory: 'Maid',
    experience: 4,
    serviceCharges: 350,
    skills: ['Cooking', 'Cleaning', 'Utensil Washing', 'Laundry'],
    rating: 4.7,
    totalRatings: 42,
    completedJobs: 95,
    responseTime: 15,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Experienced household help with excellent cooking and cleaning skills.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    _id: '5',
    userId: {
      _id: 'u5',
      name: 'Vijay Carpenter',
      email: 'vijay@example.com',
      phone: '9876543214',
      address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400002' }
    },
    serviceCategory: 'Carpenter',
    experience: 10,
    serviceCharges: 700,
    skills: ['Furniture Making', 'Door Repair', 'Cabinet Installation', 'Wood Polishing'],
    rating: 4.9,
    totalRatings: 55,
    completedJobs: 120,
    responseTime: 35,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Master carpenter with 10 years of experience in custom furniture and woodwork.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    _id: '6',
    userId: {
      _id: 'u6',
      name: 'Ramesh Chef',
      email: 'ramesh@example.com',
      phone: '9876543215',
      address: { city: 'Bangalore', state: 'Karnataka', pincode: '560002' }
    },
    serviceCategory: 'Cook',
    experience: 6,
    serviceCharges: 550,
    skills: ['North Indian', 'South Indian', 'Chinese', 'Continental'],
    rating: 4.8,
    totalRatings: 48,
    completedJobs: 88,
    responseTime: 25,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Professional cook specializing in multiple cuisines with hygiene certification.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    _id: '7',
    userId: {
      _id: 'u7',
      name: 'Ravi Painter',
      email: 'ravi@example.com',
      phone: '9876543216',
      address: { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' }
    },
    serviceCategory: 'Painter',
    experience: 8,
    serviceCharges: 650,
    skills: ['Interior Painting', 'Exterior Painting', 'Texture Work', 'Waterproofing'],
    rating: 4.7,
    totalRatings: 38,
    completedJobs: 72,
    responseTime: 30,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Professional painter with expertise in all types of painting and texture work.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    _id: '8',
    userId: {
      _id: 'u8',
      name: 'Suresh Driver',
      email: 'suresh@example.com',
      phone: '9876543217',
      address: { city: 'Pune', state: 'Maharashtra', pincode: '411001' }
    },
    serviceCategory: 'Driver',
    experience: 12,
    serviceCharges: 800,
    skills: ['Personal Driver', 'Long Distance', 'City Navigation', 'Safe Driving'],
    rating: 4.9,
    totalRatings: 65,
    completedJobs: 150,
    responseTime: 20,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Experienced driver with clean driving record and excellent city knowledge.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  {
    _id: '9',
    userId: {
      _id: 'u9',
      name: 'Lakshmi Cleaning',
      email: 'lakshmi@example.com',
      phone: '9876543218',
      address: { city: 'Hyderabad', state: 'Telangana', pincode: '500001' }
    },
    serviceCategory: 'House Cleaning',
    experience: 5,
    serviceCharges: 450,
    skills: ['Deep Cleaning', 'Carpet Cleaning', 'Window Cleaning', 'Sanitization'],
    rating: 4.6,
    totalRatings: 32,
    completedJobs: 68,
    responseTime: 22,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Professional cleaning service with eco-friendly products and attention to detail.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    _id: '10',
    userId: {
      _id: 'u10',
      name: 'Anil Electrician',
      email: 'anil@example.com',
      phone: '9876543219',
      address: { city: 'Kolkata', state: 'West Bengal', pincode: '700001' }
    },
    serviceCategory: 'Electrician',
    experience: 9,
    serviceCharges: 550,
    skills: ['Industrial Wiring', 'Home Automation', 'Solar Installation', 'Emergency Repair'],
    rating: 4.8,
    totalRatings: 52,
    completedJobs: 105,
    responseTime: 18,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Senior electrician with expertise in modern electrical systems and home automation.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    _id: '11',
    userId: {
      _id: 'u11',
      name: 'Mohan Plumber',
      email: 'mohan@example.com',
      phone: '9876543220',
      address: { city: 'Jaipur', state: 'Rajasthan', pincode: '302001' }
    },
    serviceCategory: 'Plumber',
    experience: 6,
    serviceCharges: 500,
    skills: ['Drainage', 'Pipeline', 'Tap Repair', 'Toilet Repair'],
    rating: 4.5,
    totalRatings: 25,
    completedJobs: 55,
    responseTime: 28,
    isTopRated: false,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Reliable plumber with quick response time and quality work guarantee.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    _id: '12',
    userId: {
      _id: 'u12',
      name: 'Geeta Maid',
      email: 'geeta@example.com',
      phone: '9876543221',
      address: { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' }
    },
    serviceCategory: 'Maid',
    experience: 7,
    serviceCharges: 400,
    skills: ['Full Time Maid', 'Baby Care', 'Elder Care', 'Cooking'],
    rating: 4.9,
    totalRatings: 58,
    completedJobs: 110,
    responseTime: 12,
    isTopRated: true,
    isAvailable: true,
    verificationStatus: 'verified',
    bio: 'Experienced household help with special training in baby and elder care.',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }
];

const mockCategories = [
  { _id: '1', name: 'Electrician', description: 'Electrical repairs and installations', icon: 'fa-bolt', isActive: true, activeWorkerCount: 15 },
  { _id: '2', name: 'Plumber', description: 'Plumbing repairs and pipe fitting', icon: 'fa-wrench', isActive: true, activeWorkerCount: 12 },
  { _id: '3', name: 'House Cleaning', description: 'Professional house cleaning services', icon: 'fa-broom', isActive: true, activeWorkerCount: 25 },
  { _id: '4', name: 'Maid', description: 'Daily household help', icon: 'fa-user', isActive: true, activeWorkerCount: 30 },
  { _id: '5', name: 'Carpenter', description: 'Furniture repair and woodwork', icon: 'fa-hammer', isActive: true, activeWorkerCount: 10 },
  { _id: '6', name: 'Cook', description: 'Professional cooking services', icon: 'fa-utensils', isActive: true, activeWorkerCount: 18 },
  { _id: '7', name: 'Painter', description: 'Interior and exterior painting', icon: 'fa-paint-roller', isActive: true, activeWorkerCount: 8 },
  { _id: '8', name: 'Driver', description: 'Personal driver services', icon: 'fa-car', isActive: true, activeWorkerCount: 20 }
];

let mockBookings = [];
let bookingIdCounter = 1;

exports.getMockServices = (req, res) => {
  res.status(200).json({
    success: true,
    data: mockCategories
  });
};

exports.getMockWorkers = (req, res) => {
  const { serviceCategory, city } = req.query;
  let filtered = [...mockWorkers];
  
  if (serviceCategory) {
    filtered = filtered.filter(w => w.serviceCategory === serviceCategory);
  }
  
  if (city) {
    filtered = filtered.filter(w => 
      w.userId.address.city.toLowerCase().includes(city.toLowerCase())
    );
  }
  
  res.status(200).json({
    success: true,
    count: filtered.length,
    data: filtered
  });
};

exports.getMockWorkerById = (req, res) => {
  const worker = mockWorkers.find(w => w._id === req.params.id);
  
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
};

exports.createMockBooking = (req, res) => {
  const booking = {
    _id: `b${bookingIdCounter}`,
    bookingId: `BK${Date.now()}`,
    ...req.body,
    status: 'pending',
    createdAt: new Date()
  };
  
  mockBookings.push(booking);
  bookingIdCounter++;
  
  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking
  });
};

exports.getMockDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      bookings: mockBookings,
      stats: {
        total: mockBookings.length,
        upcoming: mockBookings.filter(b => b.status === 'pending').length,
        completed: mockBookings.filter(b => b.status === 'completed').length
      }
    }
  });
};

module.exports = exports;
