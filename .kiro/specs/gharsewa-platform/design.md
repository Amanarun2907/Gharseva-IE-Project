# Design Document

## Overview

GharSewa is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) that connects customers with verified household service workers. The platform consists of three distinct portals with role-based access control, providing a comprehensive solution for booking, managing, and tracking household services across India.

The system architecture follows a client-server model with RESTful API design, JWT-based authentication, and MongoDB for data persistence. The frontend uses React.js with Bootstrap for responsive UI, while the backend uses Node.js with Express.js for API endpoints and business logic.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (React.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Customer   │  │    Worker    │  │    Admin     │      │
│  │    Portal    │  │    Portal    │  │    Portal    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTPS/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│              Application Layer (Node.js/Express)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication Middleware (JWT Verification)        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Booking  │  │  Worker  │  │  Admin   │   │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Booking  │  │  Worker  │  │  Admin   │   │
│  │Controller│  │Controller│  │Controller│  │Controller│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Business Logic & Services Layer              │   │
│  │  - Email Service (Nodemailer)                        │   │
│  │  - File Upload Service (Multer)                      │   │
│  │  - Notification Service                              │   │
│  │  - Payment Service (Mock/Razorpay)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    Mongoose ODM
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Data Layer (MongoDB)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Workers  │  │ Bookings │  │ Reviews  │   │
│  │Collection│  │Collection│  │Collection│  │Collection│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Attendance│  │Complaints│  │Categories│  │Notifications│ │
│  │Collection│  │Collection│  │Collection│  │Collection│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React.js 18.x - Component-based UI framework
- React Router v6 - Client-side routing
- Bootstrap 5.3 - Responsive CSS framework
- Axios - HTTP client for API calls
- React Context API - State management
- React Hook Form - Form validation
- React Toastify - Notification system

**Backend:**
- Node.js 18.x - JavaScript runtime
- Express.js 4.x - Web application framework
- Mongoose 7.x - MongoDB ODM
- JWT (jsonwebtoken) - Authentication tokens
- bcryptjs - Password hashing
- Multer - File upload handling
- Nodemailer - Email service
- express-validator - Input validation
- cors - Cross-origin resource sharing
- dotenv - Environment configuration

**Database:**
- MongoDB Atlas - Cloud database service

**Development Tools:**
- Vite - Frontend build tool
- Nodemon - Backend auto-restart
- ESLint - Code linting
- Prettier - Code formatting

## Components and Interfaces

### Frontend Components Structure

**Customer Portal Components:**
```
src/
├── components/
│   ├── customer/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── HomePage.jsx
│   │   ├── ServiceCategories.jsx
│   │   ├── WorkerCard.jsx
│   │   ├── WorkerProfile.jsx
│   │   ├── BookingForm.jsx
│   │   ├── CustomerDashboard.jsx
│   │   ├── BookingList.jsx
│   │   ├── AttendanceTracker.jsx
│   │   ├── ReviewForm.jsx
│   │   ├── ComplaintForm.jsx
│   │   └── ContactPage.jsx
```

**Worker Portal Components:**
```
│   ├── worker/
│   │   ├── WorkerNavbar.jsx
│   │   ├── WorkerDashboard.jsx
│   │   ├── WorkerProfile.jsx
│   │   ├── BookingRequests.jsx
│   │   ├── CheckInOut.jsx
│   │   ├── EarningsPage.jsx
│   │   └── WorkerSettings.jsx
```

**Admin Portal Components:**
```
│   ├── admin/
│   │   ├── AdminNavbar.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CustomerManagement.jsx
│   │   ├── WorkerManagement.jsx
│   │   ├── WorkerVerification.jsx
│   │   ├── CategoryManagement.jsx
│   │   ├── BookingManagement.jsx
│   │   ├── PaymentManagement.jsx
│   │   ├── ComplaintManagement.jsx
│   │   ├── FeedbackMonitoring.jsx
│   │   ├── PerformanceTracking.jsx
│   │   ├── ContentManagement.jsx
│   │   ├── SystemSettings.jsx
│   │   └── Analytics.jsx
```

**Shared Components:**
```
│   └── shared/
│       ├── AuthForm.jsx
│       ├── OTPInput.jsx
│       ├── LoadingSpinner.jsx
│       ├── ErrorBoundary.jsx
│       ├── ProtectedRoute.jsx
│       ├── Modal.jsx
│       ├── Pagination.jsx
│       └── SearchBar.jsx
```

### Backend API Structure

**API Endpoints:**

**Authentication Routes (`/api/auth`):**
- POST `/register` - Register new user/worker
- POST `/login` - Send OTP to email
- POST `/verify-otp` - Verify OTP and return JWT
- POST `/logout` - Invalidate token
- GET `/me` - Get current user profile

**Customer Routes (`/api/customer`):**
- GET `/services` - Get all service categories
- GET `/workers` - Get workers by category/location
- GET `/workers/:id` - Get worker profile details
- GET `/dashboard` - Get customer dashboard data
- GET `/bookings` - Get customer bookings
- GET `/bookings/:id` - Get booking details
- POST `/bookings/:id/rebook` - Rebook previous service
- GET `/attendance` - Get attendance records
- POST `/reviews` - Submit review
- POST `/complaints` - Submit complaint
- GET `/notifications` - Get customer notifications

**Booking Routes (`/api/bookings`):**
- POST `/` - Create new booking
- GET `/:id` - Get booking by ID
- PUT `/:id/cancel` - Cancel booking
- GET `/:id/invoice` - Generate invoice PDF

**Worker Routes (`/api/worker`):**
- GET `/dashboard` - Get worker dashboard data
- GET `/bookings` - Get assigned bookings
- PUT `/bookings/:id/accept` - Accept booking
- PUT `/bookings/:id/reject` - Reject booking
- POST `/checkin` - Record check-in
- POST `/checkout` - Record check-out
- GET `/earnings` - Get earnings summary
- GET `/payments` - Get payment history
- PUT `/profile` - Update worker profile
- POST `/documents` - Upload verification documents

**Admin Routes (`/api/admin`):**
- GET `/dashboard` - Get admin dashboard statistics
- GET `/customers` - Get all customers
- GET `/customers/:id` - Get customer details
- PUT `/customers/:id/block` - Block customer
- DELETE `/customers/:id` - Delete customer
- GET `/workers` - Get all workers
- GET `/workers/:id` - Get worker details
- PUT `/workers/:id/verify` - Verify worker
- PUT `/workers/:id/reject` - Reject worker verification
- GET `/categories` - Get all categories
- POST `/categories` - Create category
- PUT `/categories/:id` - Update category
- DELETE `/categories/:id` - Delete category
- GET `/bookings` - Get all bookings
- PUT `/bookings/:id/reassign` - Reassign booking
- PUT `/bookings/:id/cancel` - Cancel booking
- GET `/payments` - Get all payments
- POST `/payments/refund` - Process refund
- PUT `/settings/commission` - Update commission rate
- GET `/complaints` - Get all complaints
- PUT `/complaints/:id/resolve` - Resolve complaint
- GET `/reviews` - Get all reviews
- DELETE `/reviews/:id` - Delete review
- GET `/performance` - Get worker performance metrics
- POST `/notifications/send` - Send bulk notifications
- GET `/content` - Get content sections
- PUT `/content/:section` - Update content
- GET `/settings` - Get system settings
- PUT `/settings` - Update system settings

## Data Models

### 
User Schema
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  phone: String (required),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  role: String (enum: ['customer', 'worker', 'admin'], default: 'customer'),
  isBlocked: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Worker Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  serviceCategory: String (required),
  experience: Number (years),
  serviceCharges: Number (required),
  skills: [String],
  profilePhoto: String (file path),
  documents: [{
    type: String (enum: ['aadhar', 'pan', 'police_verification']),
    filePath: String,
    uploadedAt: Date
  }],
  verificationStatus: String (enum: ['pending', 'verified', 'rejected'], default: 'pending'),
  verificationDate: Date,
  rejectionReason: String,
  rating: Number (default: 0),
  totalRatings: Number (default: 0),
  completedJobs: Number (default: 0),
  responseTime: Number (minutes, default: 30),
  isTopRated: Boolean (default: false),
  isAvailable: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Schema
```javascript
{
  _id: ObjectId,
  bookingId: String (unique, auto-generated),
  customerId: ObjectId (ref: 'User', required),
  workerId: ObjectId (ref: 'Worker', required),
  serviceCategory: String (required),
  duration: String (enum: ['one-time', 'daily', 'weekly', 'monthly'], required),
  scheduledDate: Date (required),
  scheduledTime: String (required),
  address: {
    street: String (required),
    city: String (required),
    state: String (required),
    pincode: String (required)
  },
  additionalNotes: String,
  paymentMethod: String (enum: ['cash', 'online'], required),
  totalPrice: Number (required),
  status: String (enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rejected'], default: 'pending'),
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Schema
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: 'Booking', required),
  workerId: ObjectId (ref: 'Worker', required),
  customerId: ObjectId (ref: 'User', required),
  checkInTime: Date,
  checkOutTime: Date,
  duration: Number (minutes),
  status: String (enum: ['checked-in', 'checked-out', 'absent'], default: 'absent'),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Schema
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: 'Booking', required),
  customerId: ObjectId (ref: 'User', required),
  workerId: ObjectId (ref: 'Worker', required),
  rating: Number (min: 1, max: 5, required),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Schema
```javascript
{
  _id: ObjectId,
  complaintId: String (unique, auto-generated),
  customerId: ObjectId (ref: 'User', required),
  workerId: ObjectId (ref: 'Worker'),
  bookingId: ObjectId (ref: 'Booking'),
  category: String (enum: ['service_quality', 'worker_behavior', 'pricing', 'delay'], required),
  description: String (required),
  status: String (enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open'),
  adminResponse: String,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Schema
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: 'Booking', required),
  customerId: ObjectId (ref: 'User', required),
  workerId: ObjectId (ref: 'Worker', required),
  amount: Number (required),
  commissionRate: Number (percentage, required),
  commissionAmount: Number (required),
  workerEarnings: Number (required),
  paymentMethod: String (enum: ['cash', 'online'], required),
  paymentStatus: String (enum: ['pending', 'completed', 'refunded'], default: 'pending'),
  transactionId: String,
  refundAmount: Number,
  refundReason: String,
  paidAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ServiceCategory Schema
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String,
  icon: String (icon class or file path),
  isActive: Boolean (default: true),
  activeWorkerCount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Schema
```javascript
{
  _id: ObjectId,
  recipientId: ObjectId (ref: 'User', required),
  recipientRole: String (enum: ['customer', 'worker', 'admin'], required),
  type: String (enum: ['booking', 'payment', 'complaint', 'announcement'], required),
  title: String (required),
  message: String (required),
  relatedId: ObjectId (booking/payment/complaint ID),
  isRead: Boolean (default: false),
  createdAt: Date
}
```

### Content Schema
```javascript
{
  _id: ObjectId,
  section: String (enum: ['homepage_banner', 'faq', 'terms', 'privacy', 'about'], required, unique),
  title: String,
  content: String (HTML or text),
  imageUrl: String,
  displayDuration: Number (days),
  isActive: Boolean (default: true),
  updatedBy: ObjectId (ref: 'User'),
  updatedAt: Date,
  createdAt: Date
}
```

### SystemSettings Schema
```javascript
{
  _id: ObjectId,
  otpExpiryMinutes: Number (default: 10, min: 5, max: 30),
  sessionTimeoutMinutes: Number (default: 60),
  commissionRate: Number (default: 10, min: 0, max: 50),
  maintenanceMode: Boolean (default: false),
  maintenanceMessage: String,
  cancellationPolicy: String,
  updatedBy: ObjectId (ref: 'User'),
  updatedAt: Date
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Authentication and Authorization Properties

**Property 1: Account creation uniqueness**
*For any* valid customer registration data, creating an account should result in a unique user ID that doesn't conflict with existing users
**Validates: Requirements 1.1**

**Property 2: Valid OTP authentication**
*For any* valid OTP entered within the expiry window, the system should generate a valid JWT token that grants access to protected resources
**Validates: Requirements 1.3**

**Property 3: JWT token validation**
*For any* authenticated user with a valid JWT token, accessing protected routes should grant access, while invalid or expired tokens should deny access
**Validates: Requirements 1.5**

**Property 4: Worker authentication**
*For any* worker with valid credentials, login should authenticate successfully and provide access to the worker dashboard
**Validates: Requirements 6.5**

**Property 5: Admin authentication**
*For any* admin with valid credentials, login should authenticate successfully and grant access to the admin portal
**Validates: Requirements 10.1**

**Property 6: Authorization enforcement**
*For any* unauthorized user attempting admin access, the system should deny access regardless of the route attempted
**Validates: Requirements 10.5**

### Service Discovery and Booking Properties

**Property 7: Worker filtering by category**
*For any* service category selection, the system should return only verified workers who offer that specific service category
**Validates: Requirements 2.2**

**Property 8: Worker search and sort**
*For any* search query with service type and location, returned workers should match both criteria and be sorted by rating in descending order
**Validates: Requirements 2.3**

**Property 9: Worker profile completeness**
*For any* worker profile view, the displayed information should include verification badge, ratings, reviews, skills, experience, service charges, response time, and completed jobs count
**Validates: Requirements 2.4**

**Property 10: Booking creation with unique ID**
*For any* valid booking form submission, the system should create a booking record with status "Pending" and a unique booking ID
**Validates: Requirements 3.2**

**Property 11: Booking notification delivery**
*For any* created booking, the system should generate notifications for both the customer and the assigned worker
**Validates: Requirements 3.3**

**Property 12: Price calculation accuracy**
*For any* booking with duration (Daily, Weekly, or Monthly), the total price should equal the service charges multiplied by the appropriate duration multiplier
**Validates: Requirements 3.4**

### Dashboard and Data Display Properties

**Property 13: Customer dashboard aggregation**
*For any* customer, their dashboard should correctly aggregate and display all their bookings categorized as upcoming, completed, and statistics
**Validates: Requirements 4.1**

**Property 14: Booking details completeness**
*For any* booking detail view, the system should display worker name, service type, date, time, address, status, and total price
**Validates: Requirements 4.2**

**Property 15: Re-book data preservation**
*For any* completed booking, clicking re-book should pre-fill the booking form with all details from the previous booking except the date
**Validates: Requirements 4.3**

**Property 16: Status change notifications**
*For any* booking status change, the system should create a notification for the customer with the updated status
**Validates: Requirements 4.4**

**Property 17: Invoice generation completeness**
*For any* completed booking, the generated invoice should contain booking details, worker information, and payment breakdown
**Validates: Requirements 4.5**

**Property 18: Worker dashboard aggregation**
*For any* worker, their dashboard should correctly aggregate and display bookings categorized as pending, upcoming, and completed
**Validates: Requirements 7.1**

**Property 19: Worker booking notification completeness**
*For any* new booking assigned to a worker, the notification should include customer details, service type, date, time, and address
**Validates: Requirements 7.2**

**Property 20: Worker booking details completeness**
*For any* booking viewed by a worker, the system should display customer name, contact, address, service requirements, and payment method
**Validates: Requirements 7.5**

### Review and Rating Properties

**Property 21: Review enablement**
*For any* booking with status "completed", the system should enable rating and review submission for that booking
**Validates: Requirements 5.1**

**Property 22: Rating calculation accuracy**
*For any* new review submission, the worker's average rating should be recalculated correctly based on all their reviews
**Validates: Requirements 5.2**

**Property 23: Complaint creation**
*For any* valid complaint submission with category and description, the system should create a complaint record with status "Open" and notify admin
**Validates: Requirements 5.3**

**Property 24: Reviews page aggregation**
*For any* reviews page view, the system should correctly display top-rated workers, most popular services, and latest reviews
**Validates: Requirements 5.4**

**Property 25: Complaint resolution workflow**
*For any* complaint with admin response, the system should update status to "Resolved" and notify the customer
**Validates: Requirements 5.5**

**Property 26: Review deletion and recalculation**
*For any* review deletion by admin, the system should remove the review and recalculate the worker's average rating correctly
**Validates: Requirements 16.5**

### Worker Management Properties

**Property 27: Worker account creation**
*For any* valid worker registration data, the system should create a worker account with status "Pending Verification"
**Validates: Requirements 6.1**

**Property 28: Document upload and notification**
*For any* worker document upload, the system should store the files and create a notification for admin verification
**Validates: Requirements 6.2**

**Property 29: Worker verification approval**
*For any* admin approval of worker verification, the system should update status to "Verified" and enable profile visibility to customers
**Validates: Requirements 6.3**

**Property 30: Worker profile updates**
*For any* worker profile information update, the changes should persist and be immediately reflected on the customer-facing profile
**Validates: Requirements 6.4**

**Property 31: Worker verification queue**
*For any* new worker registration, the system should add the worker to the pending verification queue and notify admin
**Validates: Requirements 12.2**

**Property 32: Worker verification rejection**
*For any* admin rejection of worker verification, the system should update status to "Rejected", store rejection reason, and notify worker
**Validates: Requirements 12.5**

### Booking Workflow Properties

**Property 33: Booking acceptance workflow**
*For any* pending booking accepted by a worker, the system should update status to "Confirmed" and notify the customer
**Validates: Requirements 7.3**

**Property 34: Booking rejection workflow**
*For any* booking rejected by a worker, the system should update status to "Rejected" and notify admin for reassignment
**Validates: Requirements 7.4**

**Property 35: Booking cancellation workflow**
*For any* booking cancelled by admin, the system should update status to "Cancelled", notify both customer and worker, and process refund if applicable
**Validates: Requirements 14.4**

**Property 36: Booking reassignment workflow**
*For any* booking reassigned to a different worker, the system should update worker assignment and notify old worker, new worker, and customer
**Validates: Requirements 14.5**

### Attendance and Time Tracking Properties

**Property 37: Check-in timestamp recording**
*For any* worker check-in at service location, the system should record the check-in timestamp accurately
**Validates: Requirements 8.1**

**Property 38: Check-out timestamp recording**
*For any* worker check-out after service completion, the system should record the check-out timestamp accurately
**Validates: Requirements 8.2**

**Property 39: Duration calculation accuracy**
*For any* booking with both check-in and check-out timestamps, the calculated duration should equal the time difference between check-out and check-in
**Validates: Requirements 8.3**

**Property 40: Attendance display completeness**
*For any* attendance record viewed by customer, the display should include date, worker name, check-in time, check-out time, and status
**Validates: Requirements 8.4**

**Property 41: Attendance statistics accuracy**
*For any* customer viewing attendance summary, the total working days and punctuality percentage should be calculated correctly from attendance records
**Validates: Requirements 8.5**

### Payment and Commission Properties

**Property 42: Earnings calculation accuracy**
*For any* completed booking, the worker earnings should equal the total price minus the platform commission amount
**Validates: Requirements 9.1**

**Property 43: Earnings dashboard aggregation**
*For any* worker viewing earnings dashboard, the displayed totals for earnings, pending payments, completed payments, and commission should be calculated correctly
**Validates: Requirements 9.2**

**Property 44: Payment processing workflow**
*For any* payment processed for a booking, the system should update payment status and notify the worker
**Validates: Requirements 9.3**

**Property 45: Payment history completeness**
*For any* worker payment history request, the system should display all transactions with dates, amounts, and booking references
**Validates: Requirements 9.4**

**Property 46: Commission rate application**
*For any* commission rate update by admin, all future bookings should use the new commission rate for earnings calculations
**Validates: Requirements 9.5**

**Property 47: Commission validation**
*For any* commission percentage set by admin, the system should validate it is between 0-50 before applying to future bookings
**Validates: Requirements 15.2**

**Property 48: Payment calculation automation**
*For any* completed booking payment, the system should automatically calculate platform commission and worker earnings correctly
**Validates: Requirements 15.3**

**Property 49: Refund processing workflow**
*For any* refund processed by admin, the system should update payment status, adjust worker earnings, and notify customer
**Validates: Requirements 15.4**

**Property 50: Revenue aggregation accuracy**
*For any* admin revenue report view, the total revenue, total commission, and payment breakdown by category should be calculated correctly
**Validates: Requirements 15.5**

### Admin Management Properties

**Property 51: Admin dashboard statistics**
*For any* admin dashboard view, the displayed counts for users, workers, bookings, revenue, and complaints should be accurate aggregations
**Validates: Requirements 10.2**

**Property 52: Admin analytics aggregation**
*For any* admin analytics view, the booking trends, revenue growth, and user activity data should be correctly aggregated over time
**Validates: Requirements 10.3**

**Property 53: Customer list completeness**
*For any* customer management page view, the list should display all customers with name, email, contact, registration date, and account status
**Validates: Requirements 11.1**

**Property 54: Customer search filtering**
*For any* customer search by name or email, the results should include only customers matching the search term
**Validates: Requirements 11.2**

**Property 55: Customer details completeness**
*For any* customer detail view, the system should display complete profile, booking history, and complaint history
**Validates: Requirements 11.3**

**Property 56: Customer account blocking**
*For any* customer account blocked by admin, that customer should be prevented from logging in and creating new bookings
**Validates: Requirements 11.4**

**Property 57: Customer deletion with audit preservation**
*For any* customer account deleted by admin, the customer data should be removed while booking records are preserved for audit
**Validates: Requirements 11.5**

**Property 58: Worker list completeness**
*For any* worker management page view, the list should display all workers with name, service category, verification status, rating, and registration date
**Validates: Requirements 12.1**

**Property 59: Worker document display**
*For any* worker verification review, the system should display all uploaded identity documents and profile information
**Validates: Requirements 12.3**

**Property 60: Worker verification approval workflow**
*For any* worker verification approved by admin, the system should update status to "Verified", enable profile visibility, and notify worker
**Validates: Requirements 12.4**

### Category Management Properties

**Property 61: Category list completeness**
*For any* service category page view, the list should display all categories with name, description, icon, and active worker count
**Validates: Requirements 13.1**

**Property 62: Category creation**
*For any* valid category creation by admin, the system should add the category with name, description, and icon
**Validates: Requirements 13.2**

**Property 63: Category update propagation**
*For any* category edit by admin, the changes should persist and be reflected across the platform
**Validates: Requirements 13.3**

**Property 64: Conditional category deletion**
*For any* category deletion attempt, the system should only allow deletion if no active workers are associated with that category
**Validates: Requirements 13.4**

**Property 65: Category modification propagation**
*For any* service category modification, the customer-facing service listings should reflect the changes
**Validates: Requirements 13.5**

### Booking Management Properties

**Property 66: Booking list completeness**
*For any* booking management page view, the list should display all bookings with booking ID, customer name, worker name, service type, date, status, and amount
**Validates: Requirements 14.1**

**Property 67: Booking filtering accuracy**
*For any* booking filter by status or date range, the results should include only bookings matching all filter criteria
**Validates: Requirements 14.2**

**Property 68: Booking details completeness**
*For any* booking detail view by admin, the system should display complete customer details, worker details, service requirements, and payment status
**Validates: Requirements 14.3**

### Payment Management Properties

**Property 69: Payment list completeness**
*For any* payment management page view, the list should display all transactions with booking ID, customer, worker, amount, commission, payment method, and status
**Validates: Requirements 15.1**

### Complaint Management Properties

**Property 70: Complaint list completeness**
*For any* complaint management page view, the list should display all complaints with complaint ID, customer name, worker name, category, status, and submission date
**Validates: Requirements 16.1**

**Property 71: Complaint details completeness**
*For any* complaint detail view, the system should display complete description, related booking information, and customer contact details
**Validates: Requirements 16.2**

**Property 72: Complaint resolution workflow**
*For any* complaint response by admin, the system should update status to "Resolved", store admin response, and notify customer
**Validates: Requirements 16.3**

**Property 73: Feedback list completeness**
*For any* feedback monitoring page view, the list should display all reviews with worker name, customer name, rating, comment, and date
**Validates: Requirements 16.4**

### Notification Properties

**Property 74: Booking creation notifications**
*For any* booking creation, the system should send email notification to customer with confirmation and to worker with booking details
**Validates: Requirements 17.1**

**Property 75: Status change notifications**
*For any* booking status change, the system should send notification to relevant parties (customer, worker, or admin) with updated status
**Validates: Requirements 17.2**

**Property 76: Payment completion notifications**
*For any* completed payment, the system should send receipt to customer and confirmation to worker
**Validates: Requirements 17.3**

**Property 77: Complaint submission notifications**
*For any* complaint submission, the system should send notification to admin with complaint details
**Validates: Requirements 17.4**

**Property 78: Bulk announcement delivery**
*For any* platform announcement sent by admin, the system should deliver notification to all users in the target audience (customers or workers)
**Validates: Requirements 17.5**

### Performance Tracking Properties

**Property 79: Worker performance metrics aggregation**
*For any* worker performance page view, the metrics for average rating, total jobs, punctuality score, and complaint count should be calculated correctly for all workers
**Validates: Requirements 18.1**

**Property 80: Individual performance details**
*For any* individual worker performance view, the detailed metrics including monthly job count, earnings trend, rating history, and feedback should be accurate
**Validates: Requirements 18.2**

**Property 81: Automatic worker flagging**
*For any* worker whose average rating falls below 3.0 stars, the system should automatically flag the profile and notify admin
**Validates: Requirements 18.3**

**Property 82: Top rated badge assignment**
*For any* worker who completes 50 jobs with average rating above 4.5 stars, the system should automatically assign "Top Rated" badge
**Validates: Requirements 18.4**

**Property 83: Performance report export completeness**
*For any* performance report export, the CSV file should contain all worker performance metrics
**Validates: Requirements 18.5**

### Content Management Properties

**Property 84: Content sections display**
*For any* content management page view, the system should display all editable sections including homepage banner, service descriptions, FAQs, and terms
**Validates: Requirements 19.1**

**Property 85: Homepage banner update persistence**
*For any* homepage banner update by admin, the changes should persist and be displayed on the customer homepage
**Validates: Requirements 19.2**

**Property 86: FAQ update visibility**
*For any* FAQ entry addition or edit, the updated FAQ section should be visible to all users
**Validates: Requirements 19.3**

**Property 87: Promotional banner configuration**
*For any* promotional banner upload, the system should display the banner on specified pages with the configured display duration
**Validates: Requirements 19.4**

**Property 88: Versioned content updates**
*For any* terms of use or privacy policy update, the system should save the new version with timestamp and display to users
**Validates: Requirements 19.5**

### System Settings Properties

**Property 89: Settings display completeness**
*For any* system settings page view, the system should display all configurable parameters including OTP expiry, session timeout, commission rate, and cancellation policy
**Validates: Requirements 20.1**

**Property 90: OTP expiry validation and application**
*For any* OTP expiry time update, the system should validate the value is between 5-30 minutes and apply to all future OTP generations
**Validates: Requirements 20.2**

**Property 91: Session timeout application**
*For any* session timeout update, the system should apply the new duration to all new user sessions
**Validates: Requirements 20.3**

**Property 92: Maintenance mode enforcement**
*For any* maintenance mode enablement, the system should display maintenance message to all non-admin users and prevent new bookings
**Validates: Requirements 20.4**

**Property 93: Password change security**
*For any* admin password change, the system should validate password strength, hash the password securely, and require re-authentication
**Validates: Requirements 20.5**

## Error Handling

### Authentication Errors
- Invalid credentials: Return 401 Unauthorized with clear error message
- Expired OTP: Return 400 Bad Request with "OTP expired" message
- Invalid OTP: Return 400 Bad Request with "Invalid OTP" message
- Expired JWT token: Return 401 Unauthorized with "Token expired" message
- Missing JWT token: Return 401 Unauthorized with "Authentication required" message

### Validation Errors
- Missing required fields: Return 400 Bad Request with list of missing fields
- Invalid email format: Return 400 Bad Request with "Invalid email format" message
- Invalid phone number: Return 400 Bad Request with "Invalid phone number" message
- Past date booking: Return 400 Bad Request with "Cannot book for past dates" message
- Invalid commission rate: Return 400 Bad Request with "Commission must be between 0-50%" message

### Authorization Errors
- Insufficient permissions: Return 403 Forbidden with "Access denied" message
- Blocked account: Return 403 Forbidden with "Account has been blocked" message
- Unverified worker: Return 403 Forbidden with "Worker verification pending" message

### Resource Errors
- User not found: Return 404 Not Found with "User not found" message
- Worker not found: Return 404 Not Found with "Worker not found" message
- Booking not found: Return 404 Not Found with "Booking not found" message
- Category not found: Return 404 Not Found with "Category not found" message

### Business Logic Errors
- Category deletion with active workers: Return 400 Bad Request with "Cannot delete category with active workers" message
- Duplicate booking: Return 409 Conflict with "Booking already exists" message
- Worker unavailable: Return 400 Bad Request with "Worker is not available" message
- Already reviewed: Return 400 Bad Request with "Booking already reviewed" message

### File Upload Errors
- File too large: Return 413 Payload Too Large with "File size exceeds limit" message
- Invalid file type: Return 400 Bad Request with "Invalid file type" message
- Upload failed: Return 500 Internal Server Error with "File upload failed" message

### Database Errors
- Connection error: Return 503 Service Unavailable with "Database connection failed" message
- Query timeout: Return 504 Gateway Timeout with "Request timeout" message
- Duplicate key error: Return 409 Conflict with "Record already exists" message

### External Service Errors
- Email service failure: Log error, return 500 with "Failed to send email" message
- Payment gateway error: Return 502 Bad Gateway with "Payment service unavailable" message

## Testing Strategy

### Unit Testing
The application will use **Jest** as the testing framework for both frontend and backend unit tests.

**Backend Unit Tests:**
- Test individual controller functions with mocked services
- Test service layer business logic with mocked database calls
- Test middleware functions (authentication, validation, error handling)
- Test utility functions (date calculations, price calculations, ID generation)
- Test database models and schema validations

**Frontend Unit Tests:**
- Test React components with React Testing Library
- Test custom hooks and context providers
- Test utility functions and helpers
- Test form validation logic
- Test API service functions with mocked axios calls

**Coverage Goals:**
- Minimum 70% code coverage for critical business logic
- 100% coverage for calculation functions (pricing, commission, duration)
- 100% coverage for authentication and authorization logic

### Property-Based Testing
The application will use **fast-check** library for property-based testing in JavaScript/TypeScript.

**Property Test Configuration:**
- Each property-based test should run a minimum of 100 iterations
- Use appropriate generators for different data types (strings, numbers, dates, objects)
- Configure shrinking to find minimal failing examples
- Tag each property test with the correctness property it validates

**Property Test Implementation:**
- Each correctness property from the design document must be implemented as a property-based test
- Tests should generate random valid inputs within domain constraints
- Tests should verify the property holds for all generated inputs
- Tests should use descriptive names matching the property descriptions

**Property Test Tagging Format:**
Each property-based test must include a comment with this exact format:
```javascript
/**
 * Feature: gharsewa-platform, Property 1: Account creation uniqueness
 * Validates: Requirements 1.1
 */
```

### Integration Testing
- Test complete API endpoints with real database (test database)
- Test authentication flow from registration to protected route access
- Test booking workflow from creation to completion
- Test payment calculation and commission deduction flow
- Test notification delivery for various events
- Test file upload and retrieval
- Use supertest for API endpoint testing

### End-to-End Testing
- Test critical user journeys through the UI
- Customer journey: Registration → Browse services → Book worker → Rate service
- Worker journey: Registration → Document upload → Accept booking → Check-in/out
- Admin journey: Login → Verify worker → Manage bookings → View analytics
- Use Cypress or Playwright for E2E testing

### Testing Best Practices
- Write tests before or alongside implementation (TDD approach)
- Keep tests isolated and independent
- Use descriptive test names that explain what is being tested
- Mock external dependencies (email service, payment gateway)
- Use test fixtures and factories for consistent test data
- Run tests automatically on every commit (CI/CD integration)
- Maintain separate test databases for integration tests
- Clean up test data after each test run

## Security Considerations

### Authentication Security
- Store passwords hashed using bcrypt with salt rounds ≥ 10
- Use secure JWT tokens with expiration (24 hours for users, 7 days for "remember me")
- Implement OTP expiry (10 minutes default, configurable 5-30 minutes)
- Rate limit OTP requests to prevent abuse (max 3 requests per 15 minutes per email)
- Implement account lockout after 5 failed login attempts

### Authorization Security
- Implement role-based access control (RBAC) for customer, worker, admin roles
- Validate user permissions on every protected route
- Prevent horizontal privilege escalation (users accessing other users' data)
- Prevent vertical privilege escalation (users accessing admin functions)

### Data Security
- Validate and sanitize all user inputs to prevent injection attacks
- Use parameterized queries with Mongoose to prevent NoSQL injection
- Implement CORS with whitelist of allowed origins
- Use HTTPS for all communications in production
- Store sensitive configuration in environment variables, never in code
- Implement file upload restrictions (file type, size, scan for malware)

### API Security
- Implement rate limiting on all API endpoints (100 requests per 15 minutes per IP)
- Add request size limits to prevent DoS attacks
- Implement CSRF protection for state-changing operations
- Add security headers (Helmet.js): CSP, X-Frame-Options, X-Content-Type-Options
- Log all authentication attempts and admin actions for audit trail

### Database Security
- Use MongoDB connection string with authentication
- Implement principle of least privilege for database user permissions
- Enable MongoDB encryption at rest
- Regular database backups with encryption
- Implement soft deletes for audit trail preservation

### File Upload Security
- Validate file types using MIME type checking
- Limit file sizes (max 5MB for documents, 2MB for images)
- Store files outside web root or use cloud storage with access controls
- Generate unique filenames to prevent overwriting
- Scan uploaded files for malware before storage

## Deployment Architecture

### Development Environment
- Local MongoDB instance or MongoDB Atlas free tier
- Node.js backend running on localhost:5000
- React frontend running on localhost:3000 (Vite dev server)
- Environment variables in .env file (not committed to git)

### Production Environment
- **Frontend Hosting:** Vercel or Netlify
  - Automatic deployments from main branch
  - CDN distribution for fast global access
  - HTTPS enabled by default
  
- **Backend Hosting:** Railway, Render, or Heroku
  - Node.js application server
  - Environment variables configured in platform
  - Automatic deployments from main branch
  - Health check endpoint for monitoring
  
- **Database:** MongoDB Atlas
  - Production cluster with replica set
  - Automated backups
  - IP whitelist for security
  - Connection pooling enabled

### Environment Variables
```
# Backend
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=random_secure_string_min_32_chars
JWT_EXPIRE=24h
OTP_EXPIRY_MINUTES=10
SESSION_TIMEOUT_MINUTES=60
COMMISSION_RATE=10

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend
VITE_API_URL=https://api.gharsewa.com

# Admin Credentials (initial setup)
ADMIN_EMAIL=admin@gharsewa.com
ADMIN_PASSWORD=secure_password_change_immediately
```

### CI/CD Pipeline
- Use GitHub Actions for automated testing and deployment
- Run tests on every pull request
- Deploy to staging environment on merge to develop branch
- Deploy to production on merge to main branch
- Automated database migrations if needed

## Performance Optimization

### Backend Optimization
- Implement database indexing on frequently queried fields (email, bookingId, workerId)
- Use MongoDB aggregation pipelines for complex queries
- Implement caching for frequently accessed data (service categories, worker lists)
- Use pagination for large data sets (default 20 items per page)
- Implement connection pooling for database connections
- Compress API responses using gzip

### Frontend Optimization
- Code splitting and lazy loading for routes
- Image optimization and lazy loading
- Minimize bundle size with tree shaking
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Cache API responses with appropriate TTL
- Use service workers for offline functionality (future enhancement)

### Database Optimization
- Create indexes on: email, bookingId, workerId, customerId, serviceCategory
- Use compound indexes for common query patterns
- Implement data archiving for old bookings (older than 2 years)
- Regular database maintenance and optimization
- Monitor slow queries and optimize

## Future Enhancements

### Phase 2 Features
- Real-time chat between customers and workers
- GPS-based worker tracking during service
- Video call support for remote consultations
- Multi-language support (Hindi, English, regional languages)
- Mobile applications (iOS and Android)
- Worker availability calendar
- Recurring booking automation
- Subscription packages for regular services

### Phase 3 Features
- AI-powered worker recommendations
- Predictive analytics for demand forecasting
- Integration with payment gateways (Razorpay, Paytm, PhonePe)
- Integration with SMS gateways for OTP
- Worker training and certification programs
- Insurance offerings for workers and customers
- Loyalty and rewards program
- Referral system with incentives

### Scalability Considerations
- Microservices architecture for high-scale deployment
- Message queue (RabbitMQ/Redis) for async operations
- Separate read and write databases (CQRS pattern)
- Horizontal scaling with load balancers
- CDN for static assets
- Database sharding for multi-region support
