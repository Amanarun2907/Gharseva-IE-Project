# Implementation Plan

- [ ] 1. Project Setup and Configuration
  - Initialize backend (Node.js + Express) and frontend (React + Vite) projects
  - Configure MongoDB connection with provided credentials
  - Set up environment variables and project structure
  - Install all required dependencies (Express, Mongoose, JWT, bcryptjs, Multer, Nodemailer, React, Bootstrap, Axios, React Router)
  - Configure CORS and middleware
  - _Requirements: All_

- [ ] 2. Database Models and Schemas
  - Create User schema with role-based fields (customer/worker/admin)
  - Create Worker schema with verification and rating fields
  - Create Booking schema with status tracking
  - Create Attendance schema for check-in/check-out
  - Create Review schema for ratings and comments
  - Create Complaint schema with status workflow
  - Create Payment schema with commission calculation
  - Create ServiceCategory schema
  - Create Notification schema
  - Create Content schema for CMS
  - Create SystemSettings schema
  - _Requirements: 1.1, 2.1, 3.2, 6.1, 8.1, 9.1, 13.2, 17.1, 19.2, 20.1_

- [ ] 3. Authentication System
  - [ ] 3.1 Implement user registration endpoint with email validation
    - Create POST /api/auth/register endpoint
    - Validate input data and check for duplicate emails
    - Hash passwords and create user records
    - _Requirements: 1.1_
  
  - [ ] 3.2 Implement OTP-based login system
    - Create POST /api/auth/login endpoint to send OTP via email
    - Generate 6-digit OTP with 10-minute expiry
    - Configure Nodemailer for email delivery
    - _Requirements: 1.2_
  
  - [ ] 3.3 Implement OTP verification and JWT generation
    - Create POST /api/auth/verify-otp endpoint
    - Validate OTP and expiry time
    - Generate JWT token with user role
    - _Requirements: 1.3, 1.4_
  
  - [ ] 3.4 Create JWT authentication middleware
    - Implement middleware to verify JWT tokens
    - Extract user information from token
    - Protect routes based on user roles
    - _Requirements: 1.5_
  
  - [ ] 3.5 Create role-based authorization middleware
    - Implement middleware for customer-only routes
    - Implement middleware for worker-only routes
    - Implement middleware for admin-only routes
    - _Requirements: 10.5_

- [ ] 4. Service Category Management
  - [ ] 4.1 Create service category CRUD endpoints
    - Implement GET /api/admin/categories (list all)
    - Implement POST /api/admin/categories (create)
    - Implement PUT /api/admin/categories/:id (update)
    - Implement DELETE /api/admin/categories/:id (conditional delete)
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [ ] 4.2 Seed initial service categories
    - Create seed script for 8 service categories (Electrician, Plumber, House Cleaning, Maid, Carpenter, Cook, Painter, Driver)
    - Add descriptions and icon references
    - _Requirements: 2.1_

- [ ] 5. Worker Management System
  - [ ] 5.1 Implement worker registration
    - Create POST /api/auth/register endpoint for workers
    - Store worker-specific fields (service category, experience, charges)
    - Set initial verification status to "pending"
    - _Requirements: 6.1_
  
  - [ ] 5.2 Implement document upload for workers
    - Create POST /api/worker/documents endpoint
    - Configure Multer for file uploads (Aadhar, PAN, Police Verification)
    - Store file paths in worker documents array
    - Send notification to admin
    - _Requirements: 6.2_
  
  - [ ] 5.3 Implement worker verification by admin
    - Create PUT /api/admin/workers/:id/verify endpoint
    - Update verification status to "verified"
    - Set verification date
    - Send notification to worker
    - _Requirements: 6.3, 12.4_
  
  - [ ] 5.4 Implement worker rejection by admin
    - Create PUT /api/admin/workers/:id/reject endpoint
    - Update status to "rejected" with reason
    - Send notification to worker
    - _Requirements: 12.5_
  
  - [ ] 5.5 Implement worker profile update
    - Create PUT /api/worker/profile endpoint
    - Allow workers to update profile information
    - Validate and save changes
    - _Requirements: 6.4_

- [ ] 6. Worker Discovery and Search
  - [ ] 6.1 Implement worker listing by category
    - Create GET /api/customer/workers endpoint
    - Filter by service category
    - Return only verified workers
    - Include ratings and pricing
    - _Requirements: 2.2_
  
  - [ ] 6.2 Implement worker search with location
    - Add location-based filtering to worker listing
    - Sort results by rating (descending)
    - _Requirements: 2.3_
  
  - [ ] 6.3 Implement worker profile details endpoint
    - Create GET /api/customer/workers/:id endpoint
    - Return complete worker profile with verification badge
    - Include ratings, reviews, skills, experience, charges, response time, completed jobs
    - _Requirements: 2.4_

- [ ] 7. Booking System
  - [ ] 7.1 Implement booking creation
    - Create POST /api/bookings endpoint
    - Generate unique booking ID
    - Validate booking data (date not in past)
    - Calculate total price based on duration
    - Set initial status to "pending"
    - _Requirements: 3.2, 3.4, 3.5_
  
  - [ ] 7.2 Implement booking notifications
    - Send email to customer with booking confirmation
    - Send email to worker with booking details
    - Create notification records in database
    - _Requirements: 3.3, 17.1_
  
  - [ ] 7.3 Implement worker booking acceptance
    - Create PUT /api/worker/bookings/:id/accept endpoint
    - Update booking status to "confirmed"
    - Send notification to customer
    - _Requirements: 7.3, 17.2_
  
  - [ ] 7.4 Implement worker booking rejection
    - Create PUT /api/worker/bookings/:id/reject endpoint
    - Update status to "rejected"
    - Send notification to admin for reassignment
    - _Requirements: 7.4_
  
  - [ ] 7.5 Implement booking cancellation
    - Create PUT /api/bookings/:id/cancel endpoint
    - Update status to "cancelled"
    - Send notifications to customer and worker
    - Process refund if applicable
    - _Requirements: 14.4_
  
  - [ ] 7.6 Implement booking reassignment by admin
    - Create PUT /api/admin/bookings/:id/reassign endpoint
    - Update worker assignment
    - Send notifications to old worker, new worker, and customer
    - _Requirements: 14.5_

- [ ] 8. Attendance Tracking System
  - [ ] 8.1 Implement worker check-in
    - Create POST /api/worker/checkin endpoint
    - Record check-in timestamp
    - Update attendance status to "checked-in"
    - _Requirements: 8.1_
  
  - [ ] 8.2 Implement worker check-out
    - Create POST /api/worker/checkout endpoint
    - Record check-out timestamp
    - Calculate service duration
    - Update booking status to "completed"
    - Update attendance status to "checked-out"
    - _Requirements: 8.2, 8.3_
  
  - [ ] 8.3 Implement attendance tracker for customers
    - Create GET /api/customer/attendance endpoint
    - Return attendance records with all details
    - Calculate total working days and punctuality percentage
    - _Requirements: 8.4, 8.5_

- [ ] 9. Review and Rating System
  - [ ] 9.1 Implement review submission
    - Create POST /api/customer/reviews endpoint
    - Validate booking is completed
    - Store rating (1-5) and comment
    - Recalculate worker's average rating
    - _Requirements: 5.1, 5.2_
  
  - [ ] 9.2 Implement reviews page data
    - Create GET /api/customer/reviews endpoint
    - Return top-rated workers
    - Return most popular services
    - Return latest reviews
    - _Requirements: 5.4_
  
  - [ ] 9.3 Implement review deletion by admin
    - Create DELETE /api/admin/reviews/:id endpoint
    - Remove review from database
    - Recalculate worker's average rating
    - _Requirements: 16.5_

- [ ] 10. Complaint Management System
  - [ ] 10.1 Implement complaint submission
    - Create POST /api/customer/complaints endpoint
    - Store complaint with status "open"
    - Send notification to admin
    - _Requirements: 5.3, 17.4_
  
  - [ ] 10.2 Implement complaint resolution by admin
    - Create PUT /api/admin/complaints/:id/resolve endpoint
    - Update status to "resolved"
    - Store admin response
    - Send notification to customer
    - _Requirements: 5.5, 16.3_
  
  - [ ] 10.3 Implement complaint listing for admin
    - Create GET /api/admin/complaints endpoint
    - Return all complaints with details
    - Support filtering by status
    - _Requirements: 16.1, 16.2_

- [ ] 11. Payment and Commission System
  - [ ] 11.1 Implement payment calculation
    - Create payment record when booking is completed
    - Calculate commission amount based on commission rate
    - Calculate worker earnings (total - commission)
    - _Requirements: 9.1, 15.3_
  
  - [ ] 11.2 Implement worker earnings dashboard
    - Create GET /api/worker/earnings endpoint
    - Aggregate total earnings, pending payments, completed payments
    - Calculate total commission deducted
    - _Requirements: 9.2_
  
  - [ ] 11.3 Implement payment history
    - Create GET /api/worker/payments endpoint
    - Return all transactions with dates, amounts, booking references
    - _Requirements: 9.4_
  
  - [ ] 11.4 Implement commission rate management
    - Create PUT /api/admin/settings/commission endpoint
    - Validate rate is between 0-50
    - Apply to future bookings
    - _Requirements: 9.5, 15.2_
  
  - [ ] 11.5 Implement refund processing
    - Create POST /api/admin/payments/refund endpoint
    - Update payment status to "refunded"
    - Adjust worker earnings
    - Send notification to customer
    - _Requirements: 15.4_

- [ ] 12. Dashboard Endpoints
  - [ ] 12.1 Implement customer dashboard
    - Create GET /api/customer/dashboard endpoint
    - Aggregate upcoming bookings, completed bookings
    - Calculate booking statistics
    - _Requirements: 4.1_
  
  - [ ] 12.2 Implement worker dashboard
    - Create GET /api/worker/dashboard endpoint
    - Aggregate pending, upcoming, completed bookings
    - Include earnings summary
    - _Requirements: 7.1_
  
  - [ ] 12.3 Implement admin dashboard
    - Create GET /api/admin/dashboard endpoint
    - Count total users, workers, bookings
    - Calculate total revenue and pending complaints
    - Generate analytics data (booking trends, revenue growth)
    - _Requirements: 10.2, 10.3_

- [ ] 13. Admin Management Features
  - [ ] 13.1 Implement customer management
    - Create GET /api/admin/customers endpoint (list all)
    - Create GET /api/admin/customers/:id endpoint (details)
    - Create PUT /api/admin/customers/:id/block endpoint
    - Create DELETE /api/admin/customers/:id endpoint (soft delete)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 13.2 Implement worker management
    - Create GET /api/admin/workers endpoint (list all)
    - Create GET /api/admin/workers/:id endpoint (details)
    - Support search and filtering
    - _Requirements: 12.1, 12.3_
  
  - [ ] 13.3 Implement booking management
    - Create GET /api/admin/bookings endpoint (list all)
    - Support filtering by status and date range
    - Create GET /api/admin/bookings/:id endpoint (details)
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [ ] 13.4 Implement payment management
    - Create GET /api/admin/payments endpoint (list all)
    - Include booking, customer, worker details
    - Calculate revenue report
    - _Requirements: 15.1, 15.5_

- [ ] 14. Worker Performance Tracking
  - [ ] 14.1 Implement performance metrics calculation
    - Create GET /api/admin/performance endpoint
    - Calculate average rating, total jobs, punctuality score, complaint count for each worker
    - Implement automatic flagging for rating < 3.0
    - Implement automatic "Top Rated" badge for 50+ jobs with rating > 4.5
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

- [ ] 15. Content Management System
  - [ ] 15.1 Implement content CRUD endpoints
    - Create GET /api/admin/content endpoint (list all sections)
    - Create PUT /api/admin/content/:section endpoint (update)
    - Support homepage banner, FAQs, terms, privacy policy
    - _Requirements: 19.1, 19.2, 19.3, 19.5_

- [ ] 16. System Settings Management
  - [ ] 16.1 Implement system settings endpoints
    - Create GET /api/admin/settings endpoint
    - Create PUT /api/admin/settings endpoint
    - Validate OTP expiry (5-30 minutes)
    - Support maintenance mode toggle
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

- [ ] 17. Notification System
  - [ ] 17.1 Create notification service
    - Implement function to create notification records
    - Implement function to send emails via Nodemailer
    - Support different notification types (booking, payment, complaint, announcement)
    - _Requirements: 17.1, 17.2, 17.3, 17.4_
  
  - [ ] 17.2 Implement notification endpoints
    - Create GET /api/customer/notifications endpoint
    - Create GET /api/worker/notifications endpoint
    - Create POST /api/admin/notifications/send endpoint (bulk announcements)
    - _Requirements: 17.5_

- [ ] 18. Invoice Generation
  - [ ] 18.1 Implement invoice generation
    - Create GET /api/bookings/:id/invoice endpoint
    - Generate PDF with booking details, worker info, payment breakdown
    - Use a PDF library (pdfkit or similar)
    - _Requirements: 4.5_

- [ ] 19. Frontend - Shared Components
  - [ ] 19.1 Create authentication components
    - Build AuthForm component (login/register)
    - Build OTPInput component
    - Implement authentication context for state management
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 19.2 Create shared UI components
    - Build Navbar component (sticky navigation)
    - Build Footer component
    - Build LoadingSpinner component
    - Build Modal component
    - Build Pagination component
    - Build SearchBar component
    - Build ProtectedRoute component for route guarding
    - _Requirements: All_

- [ ] 20. Frontend - Customer Portal
  - [ ] 20.1 Build customer homepage
    - Create HomePage component with banner and tagline
    - Display service categories as interactive cards
    - Show featured workers and testimonials
    - Add "Book Now" buttons
    - _Requirements: 2.1_
  
  - [ ] 20.2 Build service browsing pages
    - Create ServiceCategories component
    - Create WorkerCard component for worker listings
    - Create WorkerProfile component with all details
    - Implement search and filter functionality
    - _Requirements: 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 20.3 Build booking flow
    - Create BookingForm component with all fields
    - Implement date-time picker
    - Add duration selection (one-time, daily, weekly, monthly)
    - Show price calculation
    - Display confirmation message after submission
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [ ] 20.4 Build customer dashboard
    - Create CustomerDashboard component
    - Display upcoming and completed bookings
    - Show booking statistics
    - Implement re-book functionality
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ] 20.5 Build attendance tracker
    - Create AttendanceTracker component
    - Display attendance table with all details
    - Show summary with total days and punctuality percentage
    - _Requirements: 8.4, 8.5_
  
  - [ ] 20.6 Build review and complaint forms
    - Create ReviewForm component with star rating
    - Create ComplaintForm component with category selection
    - Display reviews page with top-rated workers
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ] 20.7 Build contact page
    - Create ContactPage component with contact form
    - Display team information
    - Add about section
    - _Requirements: General_

- [ ] 21. Frontend - Worker Portal
  - [ ] 21.1 Build worker registration and profile
    - Create worker registration form with service category
    - Build document upload interface
    - Create WorkerProfile component for editing
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [ ] 21.2 Build worker dashboard
    - Create WorkerDashboard component
    - Display pending, upcoming, completed bookings
    - Show earnings summary
    - _Requirements: 7.1, 7.5_
  
  - [ ] 21.3 Build booking management for workers
    - Create BookingRequests component
    - Add accept/reject buttons
    - Display booking details
    - _Requirements: 7.2, 7.3, 7.4_
  
  - [ ] 21.4 Build check-in/check-out interface
    - Create CheckInOut component
    - Add check-in button with timestamp
    - Add check-out button with duration calculation
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 21.5 Build earnings page
    - Create EarningsPage component
    - Display earnings breakdown
    - Show payment history
    - _Requirements: 9.2, 9.4_

- [ ] 22. Frontend - Admin Portal
  - [ ] 22.1 Build admin dashboard
    - Create AdminDashboard component
    - Display statistics cards (users, workers, bookings, revenue, complaints)
    - Add analytics charts for trends
    - _Requirements: 10.2, 10.3_
  
  - [ ] 22.2 Build customer management
    - Create CustomerManagement component
    - Display customer list with search
    - Add block/delete actions
    - Show customer details view
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 22.3 Build worker management and verification
    - Create WorkerManagement component
    - Create WorkerVerification component
    - Display pending verification queue
    - Show document viewer
    - Add approve/reject actions
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ] 22.4 Build category management
    - Create CategoryManagement component
    - Add create/edit/delete functionality
    - Display active worker count
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ] 22.5 Build booking management
    - Create BookingManagement component
    - Add filtering by status and date
    - Implement cancel and reassign actions
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ] 22.6 Build payment management
    - Create PaymentManagement component
    - Display transaction list
    - Add refund processing
    - Show revenue report
    - _Requirements: 15.1, 15.4, 15.5_
  
  - [ ] 22.7 Build complaint management
    - Create ComplaintManagement component
    - Display complaint list with filtering
    - Add resolution interface
    - _Requirements: 16.1, 16.2, 16.3_
  
  - [ ] 22.8 Build feedback monitoring
    - Create FeedbackMonitoring component
    - Display all reviews
    - Add delete functionality for inappropriate reviews
    - _Requirements: 16.4, 16.5_
  
  - [ ] 22.9 Build performance tracking
    - Create PerformanceTracking component
    - Display worker performance metrics
    - Show flagged workers and top-rated workers
    - _Requirements: 18.1, 18.2, 18.3, 18.4_
  
  - [ ] 22.10 Build content management
    - Create ContentManagement component
    - Add editors for homepage banner, FAQs, terms, privacy
    - Support image upload for banners
    - _Requirements: 19.1, 19.2, 19.3, 19.5_
  
  - [ ] 22.11 Build system settings
    - Create SystemSettings component
    - Add forms for OTP expiry, session timeout, commission rate
    - Add maintenance mode toggle
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

- [ ] 23. Styling and UI Polish
  - Apply Bootstrap 5 styling to all components
  - Implement responsive design for mobile, tablet, desktop
  - Add smooth animations and transitions
  - Use Indian-focused design elements (₹ currency symbol, Indian cities)
  - Add loading states and error messages
  - Implement toast notifications for user feedback
  - Add icons using Font Awesome or React Icons
  - Create consistent color scheme (White + Blue + Orange as per design)
  - _Requirements: All_

- [ ] 24. API Integration
  - Create Axios instance with base URL and interceptors
  - Implement API service functions for all endpoints
  - Add JWT token to request headers
  - Handle authentication errors (redirect to login)
  - Implement error handling and user-friendly messages
  - Add loading states during API calls
  - _Requirements: All_

- [ ] 25. Routing and Navigation
  - Set up React Router with routes for all pages
  - Implement protected routes for customer, worker, admin
  - Add role-based route guards
  - Implement navigation between portals
  - Add 404 page for invalid routes
  - _Requirements: All_

- [ ] 26. Final Integration and Testing
  - Connect frontend to backend API
  - Test complete user flows (registration → booking → completion)
  - Test all CRUD operations
  - Verify file uploads work correctly
  - Test email notifications
  - Verify calculations (pricing, commission, duration, ratings)
  - Test on different browsers and devices
  - Fix any bugs or issues
  - _Requirements: All_

- [ ] 27. Deployment Preparation
  - Create production build of frontend
  - Set up environment variables for production
  - Configure MongoDB Atlas for production
  - Test production build locally
  - Create README with setup instructions
  - _Requirements: All_
