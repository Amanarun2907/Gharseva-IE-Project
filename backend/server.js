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

// Enable CORS - Allow all Vercel domains
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin
    if (!origin) return callback(null, true);
    // Allow all vercel.app domains
    if (origin.includes('vercel.app')) return callback(null, true);
    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);
    // Deny others
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

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
