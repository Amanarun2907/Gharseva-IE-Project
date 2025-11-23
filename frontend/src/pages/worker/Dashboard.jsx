import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaClock, FaCheckCircle, FaStar, FaRupeeSign } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../context/AuthContext';
import { workerAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    upcoming: 0,
    completed: 0,
    monthlyEarnings: 0,
    rating: 0,
    totalReviews: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [earningsChart, setEarningsChart] = useState({ labels: [], data: [] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await workerAPI.getDashboard();
      const data = response.data.data;
      
      setStats({
        pending: data.pendingBookings || 0,
        upcoming: data.upcomingBookings || 0,
        completed: data.completedBookings || 0,
        monthlyEarnings: data.monthlyEarnings || 0,
        rating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0
      });
      
      setRecentBookings(data.recentBookings || []);
      
      if (data.earningsChart) {
        setEarningsChart({
          labels: data.earningsChart.labels || [],
          data: data.earningsChart.data || []
        });
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const earningsChartData = {
    labels: earningsChart.labels,
    datasets: [{
      label: 'Earnings (₹)',
      data: earningsChart.data,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4
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
            <h2 className="mb-1">Worker Dashboard</h2>
            <p className="text-muted mb-0">Welcome back, {user?.name || 'Worker'}!</p>
          </div>
          <Badge bg="success" className="px-3 py-2">
            <i className="fas fa-circle me-2"></i>
            Available
          </Badge>
        </div>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm text-center mb-4 border-0">
              <Card.Body>
                <div className="mb-3">
                  <FaClock size={40} className="text-warning" />
                </div>
                <h3 className="text-warning mb-1">{stats.pending}</h3>
                <p className="text-muted mb-0">Pending Bookings</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm text-center mb-4 border-0">
              <Card.Body>
                <div className="mb-3">
                  <FaCalendarCheck size={40} className="text-primary" />
                </div>
                <h3 className="text-primary mb-1">{stats.upcoming}</h3>
                <p className="text-muted mb-0">Upcoming</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm text-center mb-4 border-0">
              <Card.Body>
                <div className="mb-3">
                  <FaCheckCircle size={40} className="text-success" />
                </div>
                <h3 className="text-success mb-1">{stats.completed}</h3>
                <p className="text-muted mb-0">Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm text-center mb-4 border-0">
              <Card.Body>
                <div className="mb-3">
                  <FaRupeeSign size={40} className="text-info" />
                </div>
                <h3 className="text-info mb-1">₹{stats.monthlyEarnings.toLocaleString()}</h3>
                <p className="text-muted mb-0">This Month</p>
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
                  <Button as={Link} to="/worker/bookings" variant="primary" size="sm">
                    <i className="fas fa-calendar me-2"></i>
                    View Bookings
                  </Button>
                  <Button as={Link} to="/worker/earnings" variant="success" size="sm">
                    <i className="fas fa-money-bill me-2"></i>
                    View Earnings
                  </Button>
                  <Button as={Link} to="/worker/profile" variant="info" size="sm">
                    <i className="fas fa-user me-2"></i>
                    Update Profile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Earnings Chart */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="mb-3">Earnings Trend (Last 7 Days)</h5>
                <Line data={earningsChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Bookings */}
        <Row>
          <Col md={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="mb-3">Recent Bookings</h5>
                {recentBookings.length === 0 ? (
                  <p className="text-muted text-center py-4">No recent bookings</p>
                ) : (
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td>{booking.customerId?.name || 'N/A'}</td>
                          <td>{booking.serviceCategory}</td>
                          <td>{new Date(booking.scheduledDate).toLocaleDateString()}</td>
                          <td>{booking.scheduledTime}</td>
                          <td>
                            <Badge bg={
                              booking.status === 'completed' ? 'success' :
                              booking.status === 'confirmed' ? 'primary' :
                              booking.status === 'pending' ? 'warning' :
                              'secondary'
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
          <Col md={4}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="mb-3">
                  <FaStar className="text-warning me-2" />
                  Your Rating
                </h5>
                <div className="text-center mb-3">
                  <h1 className="display-4 text-warning mb-0">{stats.rating.toFixed(1)}</h1>
                  <div className="text-warning mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(stats.rating) ? '' : 'text-muted'} />
                    ))}
                  </div>
                  <p className="text-muted">Based on {stats.totalReviews} reviews</p>
                </div>
                <hr />
                <div className="mb-2">
                  <small className="text-muted">Total Completed</small>
                  <div className="d-flex justify-content-between">
                    <span>{stats.completed} jobs</span>
                    <Badge bg="success">Excellent</Badge>
                  </div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Monthly Earnings</small>
                  <div className="d-flex justify-content-between">
                    <span>₹{stats.monthlyEarnings.toLocaleString()}</span>
                    <Badge bg="info">This Month</Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default WorkerDashboard;
