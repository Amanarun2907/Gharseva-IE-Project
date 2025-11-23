import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUsers, FaUserTie, FaCalendarCheck, FaRupeeSign, FaChartLine } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    newUsersThisWeek: 0,
    newBookingsToday: 0,
    revenueGrowth: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartData, setChartData] = useState({
    revenue: { labels: [], data: [] },
    bookings: { labels: [], data: [] },
    categories: { labels: [], data: [] }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      const data = response.data.data;
      
      setStats({
        totalUsers: data.totalUsers || 0,
        totalWorkers: data.totalWorkers || 0,
        totalBookings: data.totalBookings || 0,
        totalRevenue: data.totalRevenue || 0,
        newUsersThisWeek: data.newUsersThisWeek || 0,
        newBookingsToday: data.newBookingsToday || 0,
        revenueGrowth: data.revenueGrowth || 0
      });
      
      setRecentBookings(data.recentBookings || []);
      
      // Set chart data
      if (data.revenueChart) {
        setChartData(prev => ({
          ...prev,
          revenue: {
            labels: data.revenueChart.labels || [],
            data: data.revenueChart.data || []
          }
        }));
      }
      
      if (data.bookingsChart) {
        setChartData(prev => ({
          ...prev,
          bookings: {
            labels: data.bookingsChart.labels || [],
            data: data.bookingsChart.data || []
          }
        }));
      }
      
      if (data.categoriesChart) {
        setChartData(prev => ({
          ...prev,
          categories: {
            labels: data.categoriesChart.labels || [],
            data: data.categoriesChart.data || []
          }
        }));
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const revenueChartData = {
    labels: chartData.revenue.labels,
    datasets: [{
      label: 'Revenue (₹)',
      data: chartData.revenue.data,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4
    }]
  };

  const bookingsChartData = {
    labels: chartData.bookings.labels,
    datasets: [{
      label: 'Bookings',
      data: chartData.bookings.data,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const categoriesChartData = {
    labels: chartData.categories.labels,
    datasets: [{
      data: chartData.categories.data,
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ],
      borderWidth: 1
    }]
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading dashboard...</p>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Admin Dashboard</h2>
            <p className="text-muted mb-0">Welcome back, {user?.name || 'Admin'}!</p>
          </div>
          <Badge bg="success" className="px-3 py-2">
            <i className="fas fa-circle me-2"></i>
            System Online
          </Badge>
        </div>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm text-center mb-4 border-0 hover-shadow">
              <Card.Body>
                <div className="mb-3">
                  <FaUsers size={40} className="text-primary" />
                </div>
                <h3 className="text-primary mb-1">{stats.totalUsers}</h3>
                <p className="text-muted mb-0">Total Users</p>
                <small className="text-success">+{stats.newUsersThisWeek} this week</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm text-center mb-4 border-0 hover-shadow">
              <Card.Body>
                <div className="mb-3">
                  <FaUserTie size={40} className="text-success" />
                </div>
                <h3 className="text-success mb-1">{stats.totalWorkers}</h3>
                <p className="text-muted mb-0">Total Workers</p>
                <small className="text-success">Active workers</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm text-center mb-4 border-0 hover-shadow">
              <Card.Body>
                <div className="mb-3">
                  <FaCalendarCheck size={40} className="text-warning" />
                </div>
                <h3 className="text-warning mb-1">{stats.totalBookings}</h3>
                <p className="text-muted mb-0">Total Bookings</p>
                <small className="text-success">+{stats.newBookingsToday} today</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm text-center mb-4 border-0 hover-shadow">
              <Card.Body>
                <div className="mb-3">
                  <FaRupeeSign size={40} className="text-info" />
                </div>
                <h3 className="text-info mb-1">₹{stats.totalRevenue.toLocaleString()}</h3>
                <p className="text-muted mb-0">Total Revenue</p>
                <small className="text-success">+{stats.revenueGrowth}% this month</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="mb-3">Quick Actions</h5>
                <div className="d-flex flex-wrap gap-2">
                  <Button as={Link} to="/admin/workers" variant="primary" size="sm">
                    <i className="fas fa-user-tie me-2"></i>
                    Manage Workers
                  </Button>
                  <Button as={Link} to="/admin/customers" variant="success" size="sm">
                    <i className="fas fa-users me-2"></i>
                    Manage Customers
                  </Button>
                  <Button as={Link} to="/admin/bookings" variant="warning" size="sm">
                    <i className="fas fa-calendar me-2"></i>
                    View Bookings
                  </Button>
                  <Button as={Link} to="/admin/categories" variant="info" size="sm">
                    <i className="fas fa-tags me-2"></i>
                    Manage Categories
                  </Button>
                  <Button as={Link} to="/admin/payments" variant="secondary" size="sm">
                    <i className="fas fa-money-bill me-2"></i>
                    View Payments
                  </Button>
                  <Button as={Link} to="/admin/settings" variant="dark" size="sm">
                    <i className="fas fa-cog me-2"></i>
                    Settings
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="mb-3">Revenue Trend (Last 7 Days)</h5>
                <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="mb-3">Bookings by Status</h5>
                <Bar data={bookingsChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="mb-3">Service Categories Distribution</h5>
                <Doughnut data={categoriesChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="mb-3">
                  <FaChartLine className="me-2" />
                  Performance Metrics
                </h5>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Customer Satisfaction</small>
                    <small className="text-success">95%</small>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar bg-success" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Worker Availability</small>
                    <small className="text-info">88%</small>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar bg-info" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Booking Completion</small>
                    <small className="text-primary">92%</small>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar bg-primary" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Revenue Growth</small>
                    <small className="text-warning">{stats.revenueGrowth}%</small>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar bg-warning" style={{ width: `${stats.revenueGrowth}%` }}></div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Row>
          <Col md={12}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="mb-3">Recent Bookings</h5>
                {recentBookings.length === 0 ? (
                  <p className="text-muted text-center py-4">No recent bookings</p>
                ) : (
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Worker</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td>{booking.bookingId}</td>
                          <td>{booking.customerId?.name || 'N/A'}</td>
                          <td>{booking.workerId?.userId?.name || 'N/A'}</td>
                          <td>{booking.serviceCategory}</td>
                          <td>{new Date(booking.scheduledDate).toLocaleDateString()}</td>
                          <td>
                            <Badge bg={
                              booking.status === 'completed' ? 'success' :
                              booking.status === 'confirmed' ? 'info' :
                              booking.status === 'in-progress' ? 'warning' :
                              booking.status === 'cancelled' ? 'danger' : 'secondary'
                            }>
                              {booking.status}
                            </Badge>
                          </td>
                          <td>₹{booking.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
      
      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;
