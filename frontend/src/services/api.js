import axios from 'axios';

// Use environment variable for production, fallback to /api for development
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Configure axios
axios.defaults.baseURL = API_URL;

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => axios.post('/auth/register', data),
  login: (data) => axios.post('/auth/login', data),
  sendOTP: (email) => axios.post('/auth/send-otp', { email }),
  verifyOTP: (email, otp) => axios.post('/auth/verify-otp', { email, otp }),
  getMe: () => axios.get('/auth/me'),
  logout: () => axios.post('/auth/logout')
};

// Customer API
export const customerAPI = {
  getServices: () => axios.get('/customer/services'),
  getWorkers: (params) => axios.get('/customer/workers', { params }),
  getWorkerById: (id) => axios.get(`/customer/workers/${id}`),
  getDashboard: () => axios.get('/customer/dashboard'),
  getBookings: () => axios.get('/customer/bookings'),
  getBookingById: (id) => axios.get(`/customer/bookings/${id}`),
  rebookService: (id) => axios.post(`/customer/bookings/${id}/rebook`),
  getAttendance: () => axios.get('/customer/attendance'),
  submitReview: (data) => axios.post('/customer/reviews', data),
  submitComplaint: (data) => axios.post('/customer/complaints', data),
  getNotifications: () => axios.get('/customer/notifications')
};

// Booking API
export const bookingAPI = {
  create: (data) => axios.post('/bookings', data),
  getById: (id) => axios.get(`/bookings/${id}`),
  cancel: (id, reason) => axios.put(`/bookings/${id}/cancel`, { reason }),
  getInvoice: (id) => axios.get(`/bookings/${id}/invoice`, { responseType: 'blob' })
};

// Worker API
export const workerAPI = {
  getDashboard: () => axios.get('/worker/dashboard'),
  getBookings: () => axios.get('/worker/bookings'),
  acceptBooking: (id) => axios.put(`/worker/bookings/${id}/accept`),
  rejectBooking: (id, reason) => axios.put(`/worker/bookings/${id}/reject`, { reason }),
  checkIn: (bookingId) => axios.post('/worker/checkin', { bookingId }),
  checkOut: (bookingId) => axios.post('/worker/checkout', { bookingId }),
  getEarnings: () => axios.get('/worker/earnings'),
  getPayments: () => axios.get('/worker/payments'),
  updateProfile: (data) => axios.put('/worker/profile', data),
  uploadDocuments: (formData) => axios.post('/worker/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Admin API
export const adminAPI = {
  getDashboard: () => axios.get('/admin/dashboard'),
  
  // Customers
  getCustomers: (params) => axios.get('/admin/customers', { params }),
  getCustomerById: (id) => axios.get(`/admin/customers/${id}`),
  blockCustomer: (id) => axios.put(`/admin/customers/${id}/block`),
  deleteCustomer: (id) => axios.delete(`/admin/customers/${id}`),
  
  // Workers
  getWorkers: (params) => axios.get('/admin/workers', { params }),
  getWorkerById: (id) => axios.get(`/admin/workers/${id}`),
  verifyWorker: (id) => axios.put(`/admin/workers/${id}/verify`),
  rejectWorker: (id, reason) => axios.put(`/admin/workers/${id}/reject`, { reason }),
  
  // Categories
  getCategories: () => axios.get('/admin/categories'),
  createCategory: (data) => axios.post('/admin/categories', data),
  updateCategory: (id, data) => axios.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => axios.delete(`/admin/categories/${id}`),
  
  // Bookings
  getBookings: (params) => axios.get('/admin/bookings', { params }),
  reassignBooking: (id, workerId) => axios.put(`/admin/bookings/${id}/reassign`, { workerId }),
  cancelBooking: (id, reason) => axios.put(`/admin/bookings/${id}/cancel`, { reason }),
  
  // Payments
  getPayments: (params) => axios.get('/admin/payments', { params }),
  processRefund: (data) => axios.post('/admin/payments/refund', data),
  updateCommission: (rate) => axios.put('/admin/settings/commission', { commissionRate: rate }),
  
  // Complaints
  getComplaints: (params) => axios.get('/admin/complaints', { params }),
  resolveComplaint: (id, response) => axios.put(`/admin/complaints/${id}/resolve`, { adminResponse: response }),
  
  // Reviews
  getReviews: (params) => axios.get('/admin/reviews', { params }),
  deleteReview: (id) => axios.delete(`/admin/reviews/${id}`),
  
  // Performance
  getPerformance: () => axios.get('/admin/performance'),
  
  // Notifications
  sendNotification: (data) => axios.post('/admin/notifications/send', data),
  
  // Content
  getContent: () => axios.get('/admin/content'),
  updateContent: (section, data) => axios.put(`/admin/content/${section}`, data),
  
  // Settings
  getSettings: () => axios.get('/admin/settings'),
  updateSettings: (data) => axios.put('/admin/settings', data)
};

export default axios;
