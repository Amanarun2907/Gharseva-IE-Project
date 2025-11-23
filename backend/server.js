const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview URLs and production URL
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow specific CORS_ORIGIN if set
    if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.split(',').includes(origin)) {
      return callback(null, true);
    }
    
    // In development, allow all
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/worker', require('./routes/workerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
