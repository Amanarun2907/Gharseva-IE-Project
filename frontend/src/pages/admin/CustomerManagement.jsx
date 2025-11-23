import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { FaSearch, FaUserCircle, FaBan, FaTrash, FaEye, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, filterStatus, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCustomers();
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
      // Use mock data if API fails
      setCustomers(getMockCustomers());
    } finally {
      setLoading(false);
    }
  };

  const getMockCustomers = () => [
    {
      _id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543211',
      address: { city: 'Mumbai', state: 'Maharashtra' },
      isBlocked: false,
      createdAt: new Date('2024-01-15'),
      totalBookings: 5,
      totalSpent: 3500
    },
    {
      _id: '2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '9876543212',
      address: { city: 'Delhi', state: 'Delhi' },
      isBlocked: false,
      createdAt: new Date('2024-02-20'),
      totalBookings: 8,
      totalSpent: 6400
    },
    {
      _id: '3',
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '9876543213',
      address: { city: 'Bangalore', state: 'Karnataka' },
      isBlocked: false,
      createdAt: new Date('2024-03-10'),
      totalBookings: 3,
      totalSpent: 2100
    }
  ];

  const filterCustomers = () => {
    let filtered = [...customers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
      );
    }

    // Status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter(c => !c.isBlocked);
    } else if (filterStatus === 'blocked') {
      filtered = filtered.filter(c => c.isBlocked);
    }

    setFilteredCustomers(filtered);
  };

  const handleBlockUnblock = async (customerId, currentStatus) => {
    try {
      await adminAPI.blockCustomer(customerId);
      toast.success(currentStatus ? 'Customer unblocked successfully' : 'Customer blocked successfully');
      fetchCustomers();
    } catch (error) {
      console.error('Block/Unblock error:', error);
      toast.error('Failed to update customer status');
    }
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteCustomer(selectedCustomer._id);
      toast.success('Customer deleted successfully');
      setShowDeleteModal(false);
      fetchCustomers();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete customer');
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading customers...</p>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h2 className="mb-1">Customer Management</h2>
            <p className="text-muted">Manage all registered customers</p>
          </Col>
          <Col xs="auto">
            <Badge bg="primary" className="px-3 py-2">
              Total: {customers.length}
            </Badge>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Customers</h6>
                <h3 className="mb-0">{customers.length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Active</h6>
                <h3 className="mb-0 text-success">{customers.filter(c => !c.isBlocked).length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Blocked</h6>
                <h3 className="mb-0 text-danger">{customers.filter(c => c.isBlocked).length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">This Month</h6>
                <h3 className="mb-0 text-info">
                  {customers.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length}
                </h3>
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
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text><FaFilter /></InputGroup.Text>
                  <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Customers</option>
                    <option value="active">Active Only</option>
                    <option value="blocked">Blocked Only</option>
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

        {/* Customers Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Bookings</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <FaUserCircle size={50} className="text-muted mb-3" />
                      <p className="text-muted">No customers found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaUserCircle size={30} className="text-primary me-2" />
                          <div>
                            <div className="fw-bold">{customer.name}</div>
                            <small className="text-muted">{customer.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{customer.phone}</td>
                      <td>
                        {customer.address?.city}, {customer.address?.state}
                      </td>
                      <td>
                        <Badge bg="info">{customer.totalBookings || 0}</Badge>
                      </td>
                      <td className="fw-bold">₹{customer.totalSpent || 0}</td>
                      <td>
                        {customer.isBlocked ? (
                          <Badge bg="danger">Blocked</Badge>
                        ) : (
                          <Badge bg="success">Active</Badge>
                        )}
                      </td>
                      <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => handleViewDetails(customer)}
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant={customer.isBlocked ? "outline-success" : "outline-warning"}
                          size="sm"
                          className="me-1"
                          onClick={() => handleBlockUnblock(customer._id, customer.isBlocked)}
                        >
                          <FaBan />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Customer Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <Row>
              <Col md={6}>
                <h6 className="text-muted">Personal Information</h6>
                <p><strong>Name:</strong> {selectedCustomer.name}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                <p><strong>Status:</strong> {selectedCustomer.isBlocked ? 
                  <Badge bg="danger">Blocked</Badge> : 
                  <Badge bg="success">Active</Badge>
                }</p>
              </Col>
              <Col md={6}>
                <h6 className="text-muted">Address</h6>
                <p>{selectedCustomer.address?.street}</p>
                <p>{selectedCustomer.address?.city}, {selectedCustomer.address?.state}</p>
                <p>{selectedCustomer.address?.pincode}</p>
              </Col>
              <Col md={12} className="mt-3">
                <h6 className="text-muted">Booking Statistics</h6>
                <p><strong>Total Bookings:</strong> {selectedCustomer.totalBookings || 0}</p>
                <p><strong>Total Spent:</strong> ₹{selectedCustomer.totalSpent || 0}</p>
                <p><strong>Member Since:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete customer <strong>{selectedCustomer?.name}</strong>? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default CustomerManagement;
