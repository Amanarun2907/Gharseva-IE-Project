import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [searchTerm, filterStatus, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getComplaints();
      setComplaints(response.data.data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
      setComplaints(getMockComplaints());
    } finally {
      setLoading(false);
    }
  };

  const getMockComplaints = () => [
    {
      _id: '1',
      customerId: { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543211' },
      bookingId: { bookingId: 'BK1732291200001', workerId: { userId: { name: 'Ramesh Singh' } } },
      subject: 'Worker arrived late',
      description: 'The worker arrived 30 minutes late without prior notice. This caused inconvenience.',
      status: 'pending',
      priority: 'medium',
      createdAt: new Date('2025-11-22'),
      resolvedAt: null,
      adminResponse: null
    },
    {
      _id: '2',
      customerId: { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543212' },
      bookingId: { bookingId: 'BK1732291200002', workerId: { userId: { name: 'Suresh Yadav' } } },
      subject: 'Poor quality work',
      description: 'The electrical work was not done properly. Some switches are still not working.',
      status: 'pending',
      priority: 'high',
      createdAt: new Date('2025-11-21'),
      resolvedAt: null,
      adminResponse: null
    },
    {
      _id: '3',
      customerId: { name: 'Amit Patel', email: 'amit@example.com', phone: '9876543213' },
      bookingId: { bookingId: 'BK1732291200003', workerId: { userId: { name: 'Vijay Carpenter' } } },
      subject: 'Overcharging',
      description: 'The worker charged more than the agreed amount.',
      status: 'resolved',
      priority: 'high',
      createdAt: new Date('2025-11-18'),
      resolvedAt: new Date('2025-11-19'),
      adminResponse: 'Issue resolved. Refund processed for the extra amount charged.'
    }
  ];

  const filterComplaints = () => {
    let filtered = [...complaints];

    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.bookingId?.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    setFilteredComplaints(filtered);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      'in-progress': 'info',
      resolved: 'success',
      closed: 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: 'secondary',
      medium: 'warning',
      high: 'danger'
    };
    return <Badge bg={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  const handleResolveComplaint = async () => {
    if (!adminResponse.trim()) {
      toast.error('Please provide a response');
      return;
    }
    try {
      await axios.put(`/api/admin/complaints/${selectedComplaint._id}/resolve`, {
        adminResponse: adminResponse
      });
      toast.success('Complaint resolved successfully');
      setShowResolveModal(false);
      setAdminResponse('');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to resolve complaint');
    }
  };

  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  const highPriorityCount = complaints.filter(c => c.priority === 'high' && c.status === 'pending').length;

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading complaints...</p>
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
            <h2 className="mb-1">Complaint Management</h2>
            <p className="text-muted">Handle customer complaints and issues</p>
          </Col>
          <Col xs="auto">
            <Badge bg="primary" className="px-3 py-2">
              Total: {complaints.length}
            </Badge>
          </Col>
        </Row>

        {/* Statistics */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Complaints</h6>
                <h3 className="mb-0">{complaints.length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Pending</h6>
                <h3 className="mb-0 text-warning">{pendingCount}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Resolved</h6>
                <h3 className="mb-0 text-success">{resolvedCount}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">High Priority</h6>
                <h3 className="mb-0 text-danger">{highPriorityCount}</h3>
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
                    placeholder="Search by subject, customer, or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text><FaFilter /></InputGroup.Text>
                  <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Complaints</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
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

        {/* Complaints Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Customer</th>
                  <th>Booking ID</th>
                  <th>Worker</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <FaExclamationTriangle size={50} className="text-muted mb-3" />
                      <p className="text-muted">No complaints found</p>
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="fw-bold">{complaint.subject}</td>
                      <td>
                        <div>
                          <div>{complaint.customerId?.name}</div>
                          <small className="text-muted">{complaint.customerId?.phone}</small>
                        </div>
                      </td>
                      <td>{complaint.bookingId?.bookingId}</td>
                      <td>{complaint.bookingId?.workerId?.userId?.name}</td>
                      <td>{getPriorityBadge(complaint.priority)}</td>
                      <td>{getStatusBadge(complaint.status)}</td>
                      <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setShowDetailsModal(true);
                          }}
                        >
                          <FaEye />
                        </Button>
                        {complaint.status === 'pending' && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setShowResolveModal(true);
                            }}
                          >
                            <FaCheckCircle />
                          </Button>
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

      {/* Complaint Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Complaint Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <Row>
              <Col md={12}>
                <h6 className="text-muted">Complaint Information</h6>
                <p><strong>Subject:</strong> {selectedComplaint.subject}</p>
                <p><strong>Description:</strong></p>
                <p className="bg-light p-3 rounded">{selectedComplaint.description}</p>
                <p><strong>Priority:</strong> {getPriorityBadge(selectedComplaint.priority)}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedComplaint.status)}</p>
              </Col>
              <Col md={6}>
                <h6 className="text-muted mt-3">Customer Details</h6>
                <p><strong>Name:</strong> {selectedComplaint.customerId?.name}</p>
                <p><strong>Email:</strong> {selectedComplaint.customerId?.email}</p>
                <p><strong>Phone:</strong> {selectedComplaint.customerId?.phone}</p>
              </Col>
              <Col md={6}>
                <h6 className="text-muted mt-3">Booking Details</h6>
                <p><strong>Booking ID:</strong> {selectedComplaint.bookingId?.bookingId}</p>
                <p><strong>Worker:</strong> {selectedComplaint.bookingId?.workerId?.userId?.name}</p>
              </Col>
              <Col md={12}>
                <h6 className="text-muted mt-3">Timeline</h6>
                <p><strong>Submitted:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                {selectedComplaint.resolvedAt && (
                  <p><strong>Resolved:</strong> {new Date(selectedComplaint.resolvedAt).toLocaleString()}</p>
                )}
                {selectedComplaint.adminResponse && (
                  <>
                    <h6 className="text-muted mt-3">Admin Response</h6>
                    <p className="bg-success bg-opacity-10 p-3 rounded">{selectedComplaint.adminResponse}</p>
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

      {/* Resolve Complaint Modal */}
      <Modal show={showResolveModal} onHide={() => setShowResolveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Resolve Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Subject:</strong> {selectedComplaint?.subject}</p>
          <p><strong>Customer:</strong> {selectedComplaint?.customerId?.name}</p>
          <Form.Group className="mb-3">
            <Form.Label>Admin Response *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder="Enter your response to resolve this complaint..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResolveModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleResolveComplaint}>
            Resolve Complaint
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default ComplaintManagement;
