# 🏠 GharSewa - Household Workers Management Platform

> **Verified Help for Every Home** - Connecting customers with trusted household service workers across India

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%2018-blue)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)]()
[![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)]()
[![Styling](https://img.shields.io/badge/Styling-Bootstrap%205-purple)]()

## 🎯 Project Overview

GharSewa is a comprehensive full-stack MERN application that revolutionizes the household services sector in India by connecting customers with verified workers including electricians, plumbers, maids, cooks, carpenters, painters, and drivers.

### ✨ Key Features

- 🔐 **Secure Authentication** - JWT + OTP-based login
- 👥 **Three User Roles** - Customer, Worker, Admin
- 📱 **Responsive Design** - Works on all devices
- ⭐ **Rating System** - Customer reviews and ratings
- 💳 **Payment Tracking** - Commission-based payment system
- 📊 **Analytics Dashboard** - Comprehensive admin panel
- ✅ **Worker Verification** - Background check system
- 📅 **Attendance Tracking** - Check-in/check-out system
- 💬 **Complaint Management** - Issue resolution workflow

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or Local)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gharsewa

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

⚠️ **IMPORTANT**: Never commit your `.env` file to GitHub!

1. **Create `backend/.env` from example**:
```bash
cd backend
cp .env.example .env
```

2. **Update `backend/.env` with your credentials**:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_minimum_32_characters
JWT_EXPIRE=24h
OTP_EXPIRY_MINUTES=10
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
GROQ_API_KEY=your_groq_api_key
```

3. **Seed Database**:
```bash
cd backend
node scripts/seedData.js
```

📖 **See `SECURITY_SETUP.md` for detailed security instructions**

### Run the Application

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

**Access**: http://localhost:3000

## 📊 Project Structure

```
gharsewa/
├── backend/
│   ├── config/              # Database configuration
│   ├── controllers/         # Business logic (5 controllers)
│   ├── models/              # Database models (11 schemas)
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & error handling
│   ├── utils/               # Helper functions
│   ├── scripts/             # Seed data
│   └── server.js            # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── customer/    # Customer portal (8 pages)
│   │   │   ├── worker/      # Worker portal (4 pages)
│   │   │   ├── admin/       # Admin portal (11 pages)
│   │   │   └── shared/      # Shared components
│   │   ├── context/         # State management
│   │   ├── services/        # API integration
│   │   ├── pages/           # Page components (25 total)
│   │   └── App.jsx          # Main application
│   └── index.html
└── README.md
```

## 🎨 Features by Portal

### 👤 Customer Portal

- Browse 8 service categories
- Filter workers by category, location, rating
- View detailed worker profiles
- Book services with flexible durations
- Track bookings and attendance
- Submit reviews and ratings
- Raise complaints
- Personal dashboard with statistics

### 👷 Worker Portal

- Complete profile management
- View and manage booking requests
- Accept/reject bookings
- Check-in and check-out for services
- Track earnings and commission
- View payment history
- Update availability status

### 👨‍💼 Admin Portal

- Comprehensive dashboard with analytics
- Customer management (view, block, delete)
- Worker verification system
- Service category management
- Booking management and reassignment
- Payment and commission tracking
- Complaint resolution
- Review moderation
- System settings configuration
- Performance tracking

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Bootstrap 5 + Custom CSS
- **HTTP Client**: Axios
- **State Management**: Context API
- **Notifications**: React Toastify
- **Icons**: Font Awesome + React Icons
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js 4
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: CORS, helmet

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user/worker
- `POST /api/auth/login` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP & get JWT
- `GET /api/auth/me` - Get current user

### Customer
- `GET /api/customer/services` - Get all services
- `GET /api/customer/workers` - Get workers (with filters)
- `GET /api/customer/workers/:id` - Get worker details
- `GET /api/customer/dashboard` - Get dashboard data
- `GET /api/customer/bookings` - Get bookings
- `GET /api/customer/attendance` - Get attendance records

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Worker
- `GET /api/worker/dashboard` - Get dashboard
- `GET /api/worker/bookings` - Get bookings
- `PUT /api/worker/bookings/:id/accept` - Accept booking
- `PUT /api/worker/bookings/:id/reject` - Reject booking
- `POST /api/worker/checkin` - Check-in
- `POST /api/worker/checkout` - Check-out
- `GET /api/worker/earnings` - Get earnings
- `PUT /api/worker/profile` - Update profile

### Admin
- `GET /api/admin/dashboard` - Get statistics
- `GET /api/admin/customers` - Get all customers
- `GET /api/admin/workers` - Get all workers
- `PUT /api/admin/workers/:id/verify` - Verify worker
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/payments` - Get all payments
- `GET /api/admin/complaints` - Get complaints
- `PUT /api/admin/complaints/:id/resolve` - Resolve complaint
- And 15+ more endpoints...

**Total**: 47+ API endpoints

## 🎨 Design Features

- **Color Scheme**: Blue (trust) + Orange (CTA) + White
- **Typography**: Poppins, Roboto
- **Icons**: Font Awesome
- **Responsive**: Mobile-first design
- **Animations**: Smooth hover effects and transitions
- **Indian Context**: ₹ currency, Indian cities, local design elements

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- OTP-based login (10-minute expiry)
- Role-based access control
- Protected API routes
- Input validation
- CORS enabled
- Secure file uploads
- Environment variables for sensitive data
- `.gitignore` configured to exclude secrets

⚠️ **SECURITY NOTICE**: 
- Never commit `.env` files
- Use `.env.example` as template
- Rotate credentials regularly
- See `SECURITY_SETUP.md` for best practices

## 📊 Database Models

1. **User** - Customer/Worker/Admin accounts
2. **Worker** - Worker profiles with verification
3. **Booking** - Service bookings with status tracking
4. **Attendance** - Check-in/check-out records
5. **Review** - Ratings and comments
6. **Complaint** - Issue tracking
7. **Payment** - Payment records with commission
8. **ServiceCategory** - Service types
9. **Notification** - User notifications
10. **Content** - CMS for website content
11. **SystemSettings** - Platform configuration

## 🧪 Testing

The application includes:
- Unit tests for controllers
- Integration tests for API endpoints
- End-to-end testing capability
- Mock data for demonstration

## 📈 Performance

- Optimized database queries
- Efficient API endpoints
- Lazy loading for routes
- Image optimization
- Responsive caching

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist folder
```

### Backend (Railway/Render/Heroku)
```bash
cd backend
# Set environment variables
# Deploy
```

## 👥 Team

- Rohit Fogla
- Jhalak Kapila
- Khushi Hooda
- Aman Jain

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions:
- Check `TROUBLESHOOTING.md`
- Review `SETUP_GUIDE.md`
- See `FINAL_SOLUTION.md`

## 🎉 Acknowledgments

Built with ❤️ for the Indian household services sector.

---

**Status**: Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2025

🌟 **Star this repo if you find it helpful!**
