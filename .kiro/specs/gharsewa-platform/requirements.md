# Requirements Document

## Introduction

GharSewa is a comprehensive household workers management platform designed to connect urban households in India with verified domestic service providers. The platform addresses the fragmented and unorganized household services sector by providing a centralized, secure, and transparent marketplace for booking electricians, plumbers, maids, cooks, carpenters, painters, and drivers. The system consists of three distinct portals: Customer Portal for service booking and management, Worker Portal for job management and attendance, and Admin Portal for platform oversight and control.

## Glossary

- **GharSewa System**: The complete web-based platform including customer, worker, and admin portals
- **Customer**: A registered user who books household services through the platform
- **Worker**: A verified service provider who offers household services (electrician, plumber, maid, cook, carpenter, painter, driver)
- **Admin**: Platform administrator with full control over users, workers, bookings, and system settings
- **Booking**: A service request created by a customer for a specific worker and time slot
- **Service Category**: Classification of household services (Electrician, Plumber, House Cleaning, Maid, Carpenter, Cook, Painter, Driver)
- **Verification Badge**: Visual indicator showing a worker has completed identity and background verification
- **Attendance Record**: Check-in and check-out timestamps recorded by workers for each service
- **Complaint**: A formal issue raised by a customer regarding service quality, worker behavior, pricing, or delays
- **Commission**: Percentage of service fee deducted by the platform from worker earnings
- **OTP**: One-Time Password sent via email for authentication
- **JWT Token**: JSON Web Token used for maintaining authenticated sessions
- **Service Duration**: Time period for which a service is booked (One-time, Daily, Weekly, Monthly)

## Requirements

### Requirement 1: Customer Authentication

**User Story:** As a customer, I want to register and login securely, so that I can access personalized booking services and track my service history.

#### Acceptance Criteria

1. WHEN a customer provides name, email, contact number, and address THEN the GharSewa System SHALL create a new customer account with unique identifier
2. WHEN a customer requests login with registered email THEN the GharSewa System SHALL send an OTP to that email address within 30 seconds
3. WHEN a customer enters valid OTP within 10 minutes of generation THEN the GharSewa System SHALL authenticate the customer and generate a JWT token
4. WHEN a customer enters invalid OTP or expired OTP THEN the GharSewa System SHALL reject authentication and display appropriate error message
5. WHEN an authenticated customer accesses protected routes THEN the GharSewa System SHALL validate the JWT token before granting access

### Requirement 2: Service Discovery and Browsing

**User Story:** As a customer, I want to browse available services and workers by category, so that I can find the right service provider for my needs.

#### Acceptance Criteria

1. WHEN a customer views the homepage THEN the GharSewa System SHALL display all eight service categories with icons and descriptions
2. WHEN a customer selects a service category THEN the GharSewa System SHALL display all verified workers offering that service with their ratings and pricing
3. WHEN a customer searches by service type and location THEN the GharSewa System SHALL return workers matching both criteria sorted by rating
4. WHEN a customer views a worker profile THEN the GharSewa System SHALL display verification badge, ratings, reviews, skills, experience, service charges, response time, and completed jobs count
5. WHEN no workers are available for selected criteria THEN the GharSewa System SHALL display a message suggesting alternative service categories or locations

### Requirement 3: Service Booking

**User Story:** As a customer, I want to book a verified worker for a specific date and time, so that I can schedule household services conveniently.

#### Acceptance Criteria

1. WHEN a customer selects a worker and clicks Book Now THEN the GharSewa System SHALL display a booking form with service type, duration options, date-time picker, address field, and payment method selection
2. WHEN a customer submits a complete booking form THEN the GharSewa System SHALL create a booking record with status "Pending" and generate a unique booking ID
3. WHEN a booking is created THEN the GharSewa System SHALL send confirmation notification to both customer and assigned worker
4. WHEN a customer selects duration as Daily, Weekly, or Monthly THEN the GharSewa System SHALL calculate total price based on service charges and duration
5. WHEN a customer attempts to book for a past date THEN the GharSewa System SHALL prevent booking creation and display validation error

### Requirement 4: Customer Dashboard and Booking Management

**User Story:** As a customer, I want to view and manage all my bookings in one place, so that I can track service status and access booking history.

#### Acceptance Criteria

1. WHEN a customer accesses their dashboard THEN the GharSewa System SHALL display upcoming bookings, completed bookings, and booking statistics
2. WHEN a customer views booking details THEN the GharSewa System SHALL display worker name, service type, date, time, address, status, and total price
3. WHEN a customer clicks re-book on a completed service THEN the GharSewa System SHALL pre-fill booking form with previous booking details
4. WHEN a booking status changes THEN the GharSewa System SHALL update the dashboard in real-time and send notification to customer
5. WHEN a customer requests invoice for completed booking THEN the GharSewa System SHALL generate PDF invoice with booking details, worker info, and payment breakdown

### Requirement 5: Ratings, Reviews, and Complaints

**User Story:** As a customer, I want to rate workers and submit complaints, so that I can provide feedback and ensure service quality.

#### Acceptance Criteria

1. WHEN a booking is marked as completed THEN the GharSewa System SHALL enable rating and review submission for that booking
2. WHEN a customer submits a rating between 1-5 stars with optional comment THEN the GharSewa System SHALL store the review and update worker's average rating
3. WHEN a customer submits a complaint with category and description THEN the GharSewa System SHALL create a complaint record with status "Open" and notify admin
4. WHEN a customer views reviews page THEN the GharSewa System SHALL display top-rated workers, most popular services, and latest customer reviews
5. WHEN admin responds to a complaint THEN the GharSewa System SHALL update complaint status and notify the customer

### Requirement 6: Worker Authentication and Profile Management

**User Story:** As a worker, I want to register and manage my profile, so that customers can discover and book my services.

#### Acceptance Criteria

1. WHEN a worker provides name, email, contact, service category, experience, and service charges THEN the GharSewa System SHALL create a worker account with status "Pending Verification"
2. WHEN a worker uploads identity documents and profile photo THEN the GharSewa System SHALL store files securely and notify admin for verification
3. WHEN admin approves worker verification THEN the GharSewa System SHALL update worker status to "Verified" and display verification badge on profile
4. WHEN a worker updates profile information THEN the GharSewa System SHALL save changes and reflect updates on customer-facing profile immediately
5. WHEN a worker logs in with valid credentials THEN the GharSewa System SHALL authenticate and provide access to worker dashboard

### Requirement 7: Worker Booking Management

**User Story:** As a worker, I want to view and manage my assigned bookings, so that I can organize my work schedule and complete services efficiently.

#### Acceptance Criteria

1. WHEN a worker accesses their dashboard THEN the GharSewa System SHALL display pending bookings, upcoming bookings, and completed bookings
2. WHEN a new booking is assigned to a worker THEN the GharSewa System SHALL send notification with customer details, service type, date, time, and address
3. WHEN a worker accepts a pending booking THEN the GharSewa System SHALL update booking status to "Confirmed" and notify customer
4. WHEN a worker rejects a booking THEN the GharSewa System SHALL update status to "Rejected" and notify admin for reassignment
5. WHEN a worker views booking details THEN the GharSewa System SHALL display customer name, contact, address, service requirements, and payment method

### Requirement 8: Attendance Tracking

**User Story:** As a worker, I want to check-in and check-out for each service, so that my work hours are recorded accurately.

#### Acceptance Criteria

1. WHEN a worker arrives at service location THEN the GharSewa System SHALL allow manual check-in with timestamp recording
2. WHEN a worker completes service THEN the GharSewa System SHALL allow manual check-out with timestamp recording
3. WHEN check-in and check-out are recorded THEN the GharSewa System SHALL calculate total service duration and update booking status to "Completed"
4. WHEN a customer views attendance tracker THEN the GharSewa System SHALL display table with date, worker name, check-in time, check-out time, and status
5. WHEN a customer views attendance summary THEN the GharSewa System SHALL calculate total working days and punctuality percentage

### Requirement 9: Worker Earnings and Payment Tracking

**User Story:** As a worker, I want to track my earnings and payment history, so that I can monitor my income and financial transactions.

#### Acceptance Criteria

1. WHEN a booking is completed THEN the GharSewa System SHALL calculate worker earnings after deducting platform commission
2. WHEN a worker views earnings dashboard THEN the GharSewa System SHALL display total earnings, pending payments, completed payments, and commission deducted
3. WHEN payment is processed for a booking THEN the GharSewa System SHALL update payment status and notify worker
4. WHEN a worker requests payment history THEN the GharSewa System SHALL display list of all transactions with dates, amounts, and booking references
5. WHEN admin sets commission percentage THEN the GharSewa System SHALL apply new commission rate to all future bookings

### Requirement 10: Admin Authentication and Dashboard

**User Story:** As an admin, I want to access a secure dashboard with platform overview, so that I can monitor and manage the entire system.

#### Acceptance Criteria

1. WHEN an admin provides valid credentials THEN the GharSewa System SHALL authenticate and grant access to admin portal
2. WHEN an admin accesses dashboard THEN the GharSewa System SHALL display total users count, total workers count, total bookings count, total revenue, and pending complaints count
3. WHEN an admin views dashboard analytics THEN the GharSewa System SHALL display charts showing booking trends, revenue growth, and user activity over time
4. WHEN dashboard data changes THEN the GharSewa System SHALL refresh statistics automatically without page reload
5. WHEN an unauthorized user attempts admin access THEN the GharSewa System SHALL deny access and redirect to login page

### Requirement 11: Customer Management by Admin

**User Story:** As an admin, I want to manage customer accounts, so that I can maintain platform integrity and handle user issues.

#### Acceptance Criteria

1. WHEN an admin views customer management page THEN the GharSewa System SHALL display list of all customers with name, email, contact, registration date, and account status
2. WHEN an admin searches for a customer by name or email THEN the GharSewa System SHALL filter and display matching customer records
3. WHEN an admin views customer details THEN the GharSewa System SHALL display complete profile, booking history, and complaint history
4. WHEN an admin blocks a customer account THEN the GharSewa System SHALL prevent that customer from logging in and creating new bookings
5. WHEN an admin deletes a customer account THEN the GharSewa System SHALL remove customer data while preserving booking records for audit purposes

### Requirement 12: Worker Management and Verification by Admin

**User Story:** As an admin, I want to verify and manage worker accounts, so that only qualified and trustworthy workers are available on the platform.

#### Acceptance Criteria

1. WHEN an admin views worker management page THEN the GharSewa System SHALL display all workers with name, service category, verification status, rating, and registration date
2. WHEN a new worker registers THEN the GharSewa System SHALL add worker to pending verification queue and notify admin
3. WHEN an admin reviews worker documents THEN the GharSewa System SHALL display uploaded identity documents and profile information
4. WHEN an admin approves worker verification THEN the GharSewa System SHALL update status to "Verified", enable profile visibility to customers, and notify worker
5. WHEN an admin rejects worker verification THEN the GharSewa System SHALL update status to "Rejected", provide rejection reason, and notify worker

### Requirement 13: Service Category Management

**User Story:** As an admin, I want to manage service categories, so that I can add new services or modify existing ones based on market demand.

#### Acceptance Criteria

1. WHEN an admin views service category page THEN the GharSewa System SHALL display all service categories with name, description, icon, and active worker count
2. WHEN an admin creates a new service category THEN the GharSewa System SHALL add category with name, description, and icon to the system
3. WHEN an admin edits a service category THEN the GharSewa System SHALL update category details and reflect changes across the platform
4. WHEN an admin deletes a service category THEN the GharSewa System SHALL remove category only if no active workers are associated with it
5. WHEN a service category is modified THEN the GharSewa System SHALL update customer-facing service listings immediately

### Requirement 14: Booking Management by Admin

**User Story:** As an admin, I want to monitor and manage all bookings, so that I can ensure smooth service delivery and handle issues.

#### Acceptance Criteria

1. WHEN an admin views booking management page THEN the GharSewa System SHALL display all bookings with booking ID, customer name, worker name, service type, date, status, and amount
2. WHEN an admin filters bookings by status or date range THEN the GharSewa System SHALL display only bookings matching the filter criteria
3. WHEN an admin views booking details THEN the GharSewa System SHALL display complete information including customer details, worker details, service requirements, and payment status
4. WHEN an admin cancels a booking THEN the GharSewa System SHALL update status to "Cancelled", notify both customer and worker, and process refund if applicable
5. WHEN an admin reassigns a booking to different worker THEN the GharSewa System SHALL update worker assignment, notify both old and new worker, and notify customer

### Requirement 15: Payment and Commission Management

**User Story:** As an admin, I want to manage payments and commission rates, so that I can ensure proper financial transactions and platform revenue.

#### Acceptance Criteria

1. WHEN an admin views payment management page THEN the GharSewa System SHALL display all transactions with booking ID, customer, worker, amount, commission, payment method, and status
2. WHEN an admin sets commission percentage THEN the GharSewa System SHALL validate percentage is between 0-50 and apply to future bookings
3. WHEN a booking payment is completed THEN the GharSewa System SHALL calculate platform commission and worker earnings automatically
4. WHEN an admin processes refund THEN the GharSewa System SHALL update payment status, adjust worker earnings, and notify customer
5. WHEN an admin views revenue report THEN the GharSewa System SHALL display total revenue, total commission earned, and payment breakdown by service category

### Requirement 16: Complaint and Feedback Management

**User Story:** As an admin, I want to handle customer complaints and monitor feedback, so that I can maintain service quality and resolve issues promptly.

#### Acceptance Criteria

1. WHEN an admin views complaint management page THEN the GharSewa System SHALL display all complaints with complaint ID, customer name, worker name, category, status, and submission date
2. WHEN an admin views complaint details THEN the GharSewa System SHALL display complete complaint description, related booking information, and customer contact details
3. WHEN an admin responds to a complaint THEN the GharSewa System SHALL update complaint status to "Resolved", store admin response, and notify customer
4. WHEN an admin views feedback monitoring page THEN the GharSewa System SHALL display all ratings and reviews with worker name, customer name, rating, comment, and date
5. WHEN an admin deletes inappropriate review THEN the GharSewa System SHALL remove review from system and recalculate worker's average rating

### Requirement 17: Notification System

**User Story:** As a system user, I want to receive timely notifications about important events, so that I stay informed about bookings, payments, and platform updates.

#### Acceptance Criteria

1. WHEN a booking is created THEN the GharSewa System SHALL send email notification to customer with booking confirmation and to assigned worker with booking details
2. WHEN a booking status changes THEN the GharSewa System SHALL send notification to relevant parties (customer, worker, or admin) with updated status
3. WHEN a payment is completed THEN the GharSewa System SHALL send payment receipt to customer and payment confirmation to worker
4. WHEN a complaint is submitted THEN the GharSewa System SHALL send notification to admin with complaint details
5. WHEN admin sends platform announcement THEN the GharSewa System SHALL deliver notification to all customers or all workers based on target audience selection

### Requirement 18: Worker Performance Tracking

**User Story:** As an admin, I want to track worker performance metrics, so that I can identify top performers and address quality issues.

#### Acceptance Criteria

1. WHEN an admin views worker performance page THEN the GharSewa System SHALL display all workers with average rating, total jobs completed, punctuality score, and complaint count
2. WHEN an admin views individual worker performance THEN the GharSewa System SHALL display detailed metrics including monthly job count, earnings trend, rating history, and customer feedback
3. WHEN a worker's average rating falls below 3.0 stars THEN the GharSewa System SHALL flag worker profile and notify admin for review
4. WHEN a worker completes 50 jobs with average rating above 4.5 stars THEN the GharSewa System SHALL mark worker as "Top Rated" with special badge
5. WHEN an admin exports performance report THEN the GharSewa System SHALL generate CSV file with all worker performance metrics

### Requirement 19: Content Management

**User Story:** As an admin, I want to manage website content, so that I can update information, banners, and guidelines without code changes.

#### Acceptance Criteria

1. WHEN an admin views content management page THEN the GharSewa System SHALL display editable sections for homepage banner, service descriptions, FAQs, and terms of use
2. WHEN an admin updates homepage banner text or image THEN the GharSewa System SHALL save changes and display updated banner on customer homepage immediately
3. WHEN an admin adds or edits FAQ entry THEN the GharSewa System SHALL update FAQ section visible to all users
4. WHEN an admin uploads promotional banner THEN the GharSewa System SHALL display banner on specified pages with configured display duration
5. WHEN an admin updates terms of use or privacy policy THEN the GharSewa System SHALL save new version with timestamp and display to users

### Requirement 20: System Settings and Configuration

**User Story:** As an admin, I want to configure system settings, so that I can control platform behavior and security parameters.

#### Acceptance Criteria

1. WHEN an admin views system settings page THEN the GharSewa System SHALL display configurable parameters including OTP expiry time, session timeout, commission rate, and booking cancellation policy
2. WHEN an admin updates OTP expiry time THEN the GharSewa System SHALL validate value is between 5-30 minutes and apply to all future OTP generations
3. WHEN an admin updates session timeout THEN the GharSewa System SHALL apply new timeout duration to all new user sessions
4. WHEN an admin enables maintenance mode THEN the GharSewa System SHALL display maintenance message to all users except admin and prevent new bookings
5. WHEN an admin changes admin password THEN the GharSewa System SHALL validate password strength, hash password securely, and require re-authentication
