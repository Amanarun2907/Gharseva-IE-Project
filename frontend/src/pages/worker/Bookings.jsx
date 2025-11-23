import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Modal, Spinner, Tabs, Tab } from 'react-bootstrap';
import { FaSearch, FaCheckCircle, FaTimes, FaEye, FaClock, FaCalendar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { workerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const WorkerBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await workerAPI.getBookings();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
      setBookings(getMockBookings());
    } finally {
      setLoading(false);
    }
  };

  const getMockBookings = () => [
    {
      _id: '1',
      bookingId: 'BK1732291200001',
      customerId: { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543211' },
      serviceCategory: 'Plumber',
      scheduledDate: new Date('2025-11-25'),
      scheduledTime: '10:00 AM',
      duration: 'one-time',
      totalPrice: 700,
      status: 'pending',
      address: { street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      additionalNotes: 'Need plumbing work for kitchen sink',
      createdAt: new Date('2025-11-22')
    },
    {
      _id: '2',
      bookingId: 'BK1732291200002',
      customerId: { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543212' },
      serviceCategory: 'Plumber',
      scheduledDate: new Date('2025-11-24'),
      scheduledTime: '02:00 PM',
      duration: 'one-time',
      totalPrice: 650,
      status: 'confirmed',
      address: { street: '456 Park Ave', city: 'Mumbai', state: 'Maharashtra', pincode: '400002' },
      additionalNotes: 'Bathroom tap repair needed',
      createdAt: new Date('2025-11-21')
    },
    {
      _id: '3',
      bookingId: 'BK1732291200003',
      customerId: { name: 'Amit Patel', email: 'amit@example.com', phone: '9876543213' },
      serviceCategory: 'Plumber',
      scheduledDate: new Date('2025-11-20'),
      scheduledTime: '11:00 AM',
      duration: 'one-time',
      totalPrice: 800,
      status: 'completed',
      address: { street: '789 Lake Rd', city: 'Mumbai', state: 'Maharashtra', pincode: '400003' },
      additionalNotes: 'Water heater installation',
      createdAt: new Date('2025-11-18')
    }
  ];

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
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
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  };

  const handleAcceptBooking = async () => {
    try {
      await workerAPI.acceptBooking(selectedBooking._id);
      toast.success('Booking accepted successfully');
      setShowAcceptModal(false);
      fetchBookings();
    } catch (error) {
      console.error('Accept booking error:', error);
      toast.error('Failed to accept booking');
    }
  };

  const handleRejectBooking = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      await workerAPI.rejectBooking(selectedBooking._id, rejectReason);
      toast.success('Booking rejected');
      setShowRejectModal(false);
      setRejectReason('');
      fetchBookings();
    } catch (error) {
      console.error('Reject booking error:', error);
      toast.error('Failed to reject booking');
    }
  };

  const pendingBookings = filteredBookings.filter(b => b.status === 'pending');
  const upcomingBookings = filteredBookings.filter(b => ['confirmed', 'in-progress'].includes(b.status));
  const completedBookings = filteredBookings.filter(b => b.status === 'completed');

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading bookings...</p>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-1">My Bookings</h2>
            <p className="text-muted">Manage your service bookings</p>
          </Col>
        </Row>

        {/* Statistics */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <FaClock size={30} className="text-warning mb-2" />
                <h4 className="mb-0">{pendingBookings.length}</h4>
                <small className="text-muted">Pending</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <FaCalendar size={30} className="text-info mb-2" />
                <h4 className="mb-0">{upcomingBookings.length}</h4>
                <small className="text-muted">Upcoming</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <FaCheckCircle size={30} className="text-success mb-2" />
                <h4 className="mb-0">{completedBookings.length}</h4>
                <small className="text-muted">Completed</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h4 className="mb-0">₹{bookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.totalPrice : 0), 0)}</h4>
                <small className="text-muted">Total Earned</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <InputGroup>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                placeholder="Search by booking ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Card.Body>
        </Card>

        {/* Bookings Tabs */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Tabs defaultActiveKey="pending" className="mb-3">
              <Tab eventKey="pending" title={`Pending (${pendingBookings.length})`}>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Date & Time</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <p className="text-muted">No pending bookings</p>
                        </td>
                      </tr>
                    ) : (
                      pendingBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="fw-bold">{booking.bookingId}</td>
                          <td>
                            <div>
                              <div className="fw-bold">{booking.customerId?.name}</div>
                              <small className="text-muted">{booking.customerId?.phone}</small>
                            </div>
                          </td>
                          <td>
                            <div>{new Date(booking.scheduledDate).toLocaleDateString()}</div>
                            <small className="text-muted">{booking.scheduledTime}</small>
                          </td>
                          <td className="fw-bold">₹{booking.totalPrice}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsModal(true);
                              }}
                            >
                              <FaEye />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="me-1"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowAcceptModal(true);
                              }}
                            >
                              <FaCheckCircle />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowRejectModal(true);
                              }}
                            >
                              <FaTimes />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey="upcoming" title={`Upcoming (${upcomingBookings.length})`}>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Date & Time</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingBookings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <p className="text-muted">No upcoming bookings</p>
                        </td>
                      </tr>
                    ) : (
                      upcomingBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="fw-bold">{booking.bookingId}</td>
                          <td>
                            <div>
                              <div className="fw-bold">{booking.customerId?.name}</div>
                              <small className="text-muted">{booking.customerId?.phone}</small>
                            </div>
                          </td>
                          <td>
                            <div>{new Date(booking.scheduledDate).toLocaleDateString()}</div>
                            <small className="text-muted">{booking.scheduledTime}</small>
                          </td>
                          <td className="fw-bold">₹{booking.totalPrice}</td>
                          <td>{getStatusBadge(booking.status)}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsModal(true);
                              }}
                            >
                              <FaEye /> View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Tab>

              <Tab eventKey="completed" title={`Completed (${completedBookings.length})`}>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Completed On</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedBookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <p className="text-muted">No completed bookings</p>
                        </td>
                      </tr>
                    ) : (
                      completedBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="fw-bold">{booking.bookingId}</td>
                          <td>
                            <div>
                              <div className="fw-bold">{booking.customerId?.name}</div>
                              <small className="text-muted">{booking.customerId?.phone}</small>
                            </div>
                          </td>
                          <td>{new Date(booking.scheduledDate).toLocaleDateString()}</td>
                          <td className="fw-bold text-success">₹{booking.totalPrice}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsModal(true);
                              }}
                            >
                              <FaEye /> View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>

      {/* Booking Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Row>
              <Col md={6}>
                <h6 className="text-muted">Booking Information</h6>
                <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
                <p><strong>Service:</strong> {selectedBooking.serviceCategory}</p>
                <p><strong>Date:</strong> {new Date(selectedBooking.scheduledDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedBooking.scheduledTime}</p>
                <p><strong>Duration:</strong> {selectedBooking.duration}</p>
                <p><strong>Amount:</strong> ₹{selectedBooking.totalPrice}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedBooking.status)}</p>
              </Col>
              <Col md={6}>
                <h6 className="text-muted">Customer Details</h6>
                <p><strong>Name:</strong> {selectedBooking.customerId?.name}</p>
                <p><strong>Email:</strong> {selectedBooking.customerId?.email}</p>
                <p><strong>Phone:</strong> {selectedBooking.customerId?.phone}</p>
              </Col>
              <Col md={12} className="mt-3">
                <h6 className="text-muted">Service Address</h6>
                <p>{selectedBooking.address?.street}</p>
                <p>{selectedBooking.address?.city}, {selectedBooking.address?.state} - {selectedBooking.address?.pincode}</p>
                {selectedBooking.additionalNotes && (
                  <>
                    <h6 className="text-muted mt-3">Additional Notes</h6>
                    <p>{selectedBooking.additionalNotes}</p>
                  </>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Accept Booking Modal */}
      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Accept Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to accept booking <strong>{selectedBooking?.bookingId}</strong>?
          <div className="mt-3">
            <p><strong>Customer:</strong> {selectedBooking?.customerId?.name}</p>
            <p><strong>Date:</strong> {new Date(selectedBooking?.scheduledDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedBooking?.scheduledTime}</p>
            <p><strong>Amount:</strong> ₹{selectedBooking?.totalPrice}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAcceptBooking}>
            Accept Booking
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Booking Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Provide a reason for rejecting booking <strong>{selectedBooking?.bookingId}</strong>:</p>
          <Form.Control
            as="textarea"
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRejectBooking}>
            Reject Booking
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default WorkerBookings;
