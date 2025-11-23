import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ChatBot from './components/ChatBot/ChatBot';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LoginRedirect from './pages/auth/LoginRedirect';
import TestDashboards from './pages/TestDashboards';
import DebugAuth from './pages/DebugAuth';

// Customer Pages
import CustomerHome from './pages/customer/Home';
import BrowseServices from './pages/customer/BrowseServices';
import WorkerProfileView from './pages/customer/WorkerProfile';
import BookService from './pages/customer/BookService';
import CustomerDashboard from './pages/customer/Dashboard';
import AttendanceTracker from './pages/customer/AttendanceTracker';
import Reviews from './pages/customer/Reviews';
import Contact from './pages/customer/Contact';
import CustomerProfile from './pages/customer/Profile';
import SubmitReview from './pages/customer/SubmitReview';

// Worker Pages
import WorkerDashboard from './pages/worker/Dashboard';
import WorkerBookings from './pages/worker/Bookings';
import WorkerEarnings from './pages/worker/Earnings';
import WorkerProfile from './pages/worker/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import CustomerManagement from './pages/admin/CustomerManagement';
import WorkerManagement from './pages/admin/WorkerManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import BookingManagement from './pages/admin/BookingManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import PerformanceTracking from './pages/admin/PerformanceTracking';
import ContentManagement from './pages/admin/ContentManagement';
import SystemSettings from './pages/admin/SystemSettings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <ChatBot />
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/redirect" element={<LoginRedirect />} />
          <Route path="/test-dashboards" element={<TestDashboards />} />
          <Route path="/debug-auth" element={<DebugAuth />} />
          
          {/* Customer Routes */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/services" element={<BrowseServices />} />
          <Route path="/worker/:id" element={<WorkerProfileView />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />
          
          <Route path="/book/:workerId" element={
            <ProtectedRoute role="customer">
              <BookService />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/attendance" element={
            <ProtectedRoute role="customer">
              <AttendanceTracker />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute role="customer">
              <CustomerProfile />
            </ProtectedRoute>
          } />
          <Route path="/submit-review/:bookingId" element={
            <ProtectedRoute role="customer">
              <SubmitReview />
            </ProtectedRoute>
          } />
          
          {/* Worker Routes */}
          <Route path="/worker/dashboard" element={
            <ProtectedRoute role="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/worker/bookings" element={
            <ProtectedRoute role="worker">
              <WorkerBookings />
            </ProtectedRoute>
          } />
          <Route path="/worker/earnings" element={
            <ProtectedRoute role="worker">
              <WorkerEarnings />
            </ProtectedRoute>
          } />
          <Route path="/worker/profile" element={
            <ProtectedRoute role="worker">
              <WorkerProfile />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRoute role="admin">
              <CustomerManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/workers" element={
            <ProtectedRoute role="admin">
              <WorkerManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute role="admin">
              <CategoryManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute role="admin">
              <BookingManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute role="admin">
              <PaymentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/complaints" element={
            <ProtectedRoute role="admin">
              <ComplaintManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/performance" element={
            <ProtectedRoute role="admin">
              <PerformanceTracking />
            </ProtectedRoute>
          } />
          <Route path="/admin/content" element={
            <ProtectedRoute role="admin">
              <ContentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute role="admin">
              <SystemSettings />
            </ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
