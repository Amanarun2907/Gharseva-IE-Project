import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Tab, Tabs } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customerAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const Dashboard = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Customer Dashboard loaded');
    fetchDashboardData();
  }, []);

  // Refetch data when navigating back to dashboard
  useEffect(() => {
    console.log('Location changed, refetching dashboard data...');
    fetchDashboardData();
  }, [location.key]); // Refetch whenever location key changes (navigation)

  const fetchDashboardData = async () => {
    try {
      console.log('🔄 Fetching dashboard data...');
      const response = await customerAPI.getDashboard();
      const data = response.data.data;
      console.log('📊 Dashboard data received:', data);
      console.log('📋 Bookings:', data.bookings);
      console.log('📈 Stats:', data.stats);
      setBookings(data.bookings || []);
      setStats(data.stats || { total: 0, upcoming: 0, completed: 0 });
    } catch (error) {
      console.error('❌ Dashboard error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      'in-progress': 'primary',
      completed: 'success',
      cancelled: 'danger',
      rejected: 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const upcomingBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'completed');
  
  // Debug: Log all booking statuses
  console.log('🔍 ALL BOOKINGS WITH STATUS:');
  bookings.forEach((b, i) => {
    console.log(`  ${i + 1}. ${b.bookingId} - Status: "${b.status}" - Date: ${new Date(b.scheduledDate).toLocaleDateString()}`);
  });
  console.log(`📅 Upcoming (pending/confirmed): ${upcomingBookings.length}`);
  console.log(`✅ Completed: ${completedBookings.length}`);

  return (
    <>
      <Navbar />
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">My Dashboard</h2>
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-2"></i>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="shadow-sm text-center">
              <Card.Body>
                <h3 className="text-primary">{stats.total}</h3>
                <p className="text-muted mb-0">Total Bookings</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm text-center">
              <Card.Body>
                <h3 className="text-warning">{stats.upcoming}</h3>
                <p className="text-muted mb-0">Upcoming</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm text-center">
              <Card.Body>
                <h3 className="text-success">{stats.completed}</h3>
                <p className="text-muted mb-0">Completed</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Bookings Tabs */}
        <Card className="shadow-sm">
          <Card.Body>
            <Tabs defaultActiveKey="upcoming" className="mb-3">
              <Tab eventKey="upcoming" title={`Upcoming (${upcomingBookings.length})`}>
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No upcoming bookings</p>
                    <Button as={Link} to="/services" variant="primary">
                      Book a Service
                    </Button>
                  </div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <Card key={booking._id} className="mb-3">
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col md={8}>
                            <h5>{booking.serviceCategory}</h5>
                            <p className="mb-1">
                              <strong>Booking ID:</strong> {booking.bookingId}
                            </p>
                            {booking.workerId?.userId?.name && (
                              <p className="mb-1">
                                <strong>Worker:</strong> {booking.workerId.userId.name}
                              </p>
                            )}
                            <p className="mb-1">
                              <strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                            </p>
                            <p className="mb-1">
                              <strong>Price:</strong> ₹{booking.totalPrice}
                            </p>
                            {getStatusBadge(booking.status)}
                          </Col>
                          <Col md={4} className="text-end">
                            <Button variant="outline-primary" size="sm" className="me-2">
                              View Details
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              Cancel
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Tab>

              <Tab eventKey="completed" title={`Completed (${completedBookings.length})`}>
                {completedBookings.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-check-circle fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No completed bookings yet</p>
                  </div>
                ) : (
                  completedBookings.map((booking) => (
                    <Card key={booking._id} className="mb-3">
                      <Card.Body>
                        <Row className="align-items-center">
                          <Col md={8}>
                            <h5>{booking.serviceCategory}</h5>
                            <p className="mb-1">
                              <strong>Booking ID:</strong> {booking.bookingId}
                            </p>
                            {booking.workerId?.userId?.name && (
                              <p className="mb-1">
                                <strong>Worker:</strong> {booking.workerId.userId.name}
                              </p>
                            )}
                            <p className="mb-1">
                              <strong>Completed on:</strong> {new Date(booking.updatedAt).toLocaleDateString()}
                            </p>
                            <p className="mb-1">
                              <strong>Price:</strong> ₹{booking.totalPrice}
                            </p>
                            {getStatusBadge(booking.status)}
                          </Col>
                          <Col md={4} className="text-end">
                            <Button variant="outline-primary" size="sm" className="me-2">
                              Re-book
                            </Button>
                            <Button variant="outline-success" size="sm">
                              Rate Service
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default Dashboard;
