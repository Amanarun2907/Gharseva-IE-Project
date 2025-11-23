import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { FaSearch, FaCalendar, FaFilter, FaEye, FaTimes, FaExchangeAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchWorkers();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, filterStatus, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBookings();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
      setBookings(getMockBookings());
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await adminAPI.getWorkers();
      setWorkers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const getMockBookings = () => [
    {
      _id: '1',
      bookingId: 'BK1732291200001',
      customerId: { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543211' },
      workerId: { userId: { name: 'Ramesh Singh' }, serviceCategory: 'Plumber' },
      serviceCategory: 'Plumber',
      scheduledDate: new Date('2025-11-25'),
      scheduledTime: '10:00 AM',
      duration: 'one-time',
      totalPrice: 700,
      status: 'pending',
      address: { city: 'Mumbai', state: 'Maharashtra' },
      createdAt: new Date('2025-11-22')
    },
    {
      _id: '2',
      bookingId: 'BK1732291200002',
      customerId: { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543212' },
      workerId: { userId: { name: 'Suresh Yadav' }, serviceCategory: 'Electrician' },
      serviceCategory: 'Electrician',
      scheduledDate: new Date('2025-11-24'),
      scheduledTime: '02:00 PM',
      duration: 'one-time',
      totalPrice: 800,
      status: 'confirmed',
      address: { city: 'Delhi', state: 'Delhi' },
      createdAt: new Date('2025-11-21')
    },
    {
      _id: '3',
      bookingId: 'BK1732291200003',
      customerId: { name: 'Amit Patel', email: 'amit@example.com', phone: '9876543213' },
      workerId: { userId: { name: 'Vijay Carpenter' }, serviceCategory: 'Carpenter' },
      serviceCategory: 'Carpenter',
      scheduledDate: new Date('2025-11-20'),
      scheduledTime: '11:00 AM',
      duration: 'one-time',
      totalPrice: 900,
      status: 'completed',
      address: { city: 'Bangalore', state: 'Karnataka' },
      createdAt: new Date('2025-11-18')
    }
  ];

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceCategory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus);
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
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }
    try {
      await axios.put(`/api/admin/bookings/${selectedBooking._id}/cancel`, { reason: cancelReason });
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleReassignBooking = async () => {
    if (!selectedWorkerId) {
      toast.error('Please select a worker');
      return;
    }
    try {
      await axios.put(`/api/admin/bookings/${selectedBooking._id}/reassign`, { workerId: selectedWorkerId });
      toast.success('Booking reassigned successfully');
      setShowReassignModal(false);
      setSelectedWorkerId('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to reassign booking');
    }
  };

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
            <h2 className="mb-1">Booking Management</h2>
            <p className="text-muted">Manage all service bookings</p>
          </Col>
          <Col xs="auto">
            <Badge bg="primary" className="px-3 py-2">
              Total: {bookings.length}
            </Badge>
          </Col>
        </Row>

        {/* Statistics */}
        <Row className="mb-4">
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Total</h6>
                <h4 className="mb-0">{bookings.length}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Pending</h6>
                <h4 className="mb-0 text-warning">
                  {bookings.filter(b => b.status === 'pending').length}
                </h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Confirmed</h6>
                <h4 className="mb-0 text-info">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">In Progress</h6>
                <h4 className="mb-0 text-primary">
                  {bookings.filter(b => b.status === 'in-progress').length}
                </h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Completed</h6>
                <h4 className="mb-0 text-success">
                  {bookings.filter(b => b.status === 'completed').length}
                </h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Cancelled</h6>
                <h4 className="mb-0 text-danger">
                  {bookings.filter(b => b.status === 'cancelled').length}
                </h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search and Filter */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    placeholder="Search by booking ID, customer, or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text><FaFilter /></InputGroup.Text>
                  <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={2}>
                <Button variant="outline-secondary" className="w-100" onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}>
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Bookings Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Worker</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <FaCalendar size={50} className="text-muted mb-3" />
                      <p className="text-muted">No bookings found</p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="fw-bold">{booking.bookingId}</td>
                      <td>
                        <div>
                          <div className="fw-bold">{booking.customerId?.name}</div>
                          <small className="text-muted">{booking.customerId?.phone}</small>
                        </div>
                      </td>
                      <td>{booking.workerId?.userId?.name || 'Not Assigned'}</td>
                      <td>
                        <Badge bg="secondary">{booking.serviceCategory}</Badge>
                      </td>
                      <td>
                        <div>
                          <div>{new Date(booking.scheduledDate).toLocaleDateString()}</div>
                          <small className="text-muted">{booking.scheduledTime}</small>
                        </div>
                      </td>
                      <td className="fw-bold">₹{booking.totalPrice}</td>
                      <td>{getStatusBadge(booking.status)}</td>
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
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <>
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-1"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowReassignModal(true);
                              }}
                            >
                              <FaExchangeAlt />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowCancelModal(true);
                              }}
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
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
                <h6 className="text-muted mt-3">Worker Details</h6>
                <p><strong>Name:</strong> {selectedBooking.workerId?.userId?.name || 'Not Assigned'}</p>
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

      {/* Cancel Booking Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Provide a reason for cancelling booking <strong>{selectedBooking?.bookingId}</strong>:</p>
          <Form.Control
            as="textarea"
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Enter cancellation reason..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleCancelBooking}>
            Cancel Booking
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reassign Booking Modal */}
      <Modal show={showReassignModal} onHide={() => setShowReassignModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reassign Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Select a new worker for booking <strong>{selectedBooking?.bookingId}</strong>:</p>
          <Form.Select
            value={selectedWorkerId}
            onChange={(e) => setSelectedWorkerId(e.target.value)}
          >
            <option value="">Select Worker...</option>
            {workers
              .filter(w => w.serviceCategory === selectedBooking?.serviceCategory && w.verificationStatus === 'verified')
              .map(worker => (
                <option key={worker._id} value={worker._id}>
                  {worker.userId?.name} - ₹{worker.serviceCharges}/hr
                </option>
              ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReassignModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReassignBooking}>
            Reassign
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default BookingManagement;
