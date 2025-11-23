import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { FaSearch, FaUserTie, FaCheckCircle, FaTimes, FaBan, FaEye, FaFilter, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    filterWorkers();
  }, [searchTerm, filterStatus, workers]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getWorkers();
      setWorkers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
      toast.error('Failed to load workers');
      setWorkers(getMockWorkers());
    } finally {
      setLoading(false);
    }
  };

  const getMockWorkers = () => [
    {
      _id: '1',
      userId: { name: 'Ramesh Singh', email: 'ramesh.worker@gharsewa.com', phone: '9876543220' },
      serviceCategory: 'Plumber',
      experience: 8,
      serviceCharges: 350,
      rating: 4.8,
      totalRatings: 156,
      completedJobs: 234,
      verificationStatus: 'verified',
      isAvailable: true,
      createdAt: new Date('2024-01-10')
    },
    {
      _id: '2',
      userId: { name: 'Suresh Yadav', email: 'suresh.worker@gharsewa.com', phone: '9876543221' },
      serviceCategory: 'Electrician',
      experience: 10,
      serviceCharges: 400,
      rating: 4.9,
      totalRatings: 203,
      completedJobs: 312,
      verificationStatus: 'verified',
      isAvailable: true,
      createdAt: new Date('2024-01-15')
    },
    {
      _id: '3',
      userId: { name: 'Vijay Carpenter', email: 'vijay.worker@gharsewa.com', phone: '9876543222' },
      serviceCategory: 'Carpenter',
      experience: 12,
      serviceCharges: 450,
      rating: 4.7,
      totalRatings: 178,
      completedJobs: 267,
      verificationStatus: 'pending',
      isAvailable: true,
      createdAt: new Date('2024-03-20')
    }
  ];

  const filterWorkers = () => {
    let filtered = [...workers];

    if (searchTerm) {
      filtered = filtered.filter(worker =>
        worker.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.serviceCategory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(w => w.verificationStatus === filterStatus);
    }

    setFilteredWorkers(filtered);
  };

  const handleVerify = async () => {
    try {
      await axios.put(`/api/admin/workers/${selectedWorker._id}/verify`);
      toast.success('Worker verified successfully');
      setShowVerifyModal(false);
      fetchWorkers();
    } catch (error) {
      toast.error('Failed to verify worker');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      await axios.put(`/api/admin/workers/${selectedWorker._id}/reject`, { reason: rejectReason });
      toast.success('Worker rejected');
      setShowRejectModal(false);
      setRejectReason('');
      fetchWorkers();
    } catch (error) {
      toast.error('Failed to reject worker');
    }
  };

  const handleBlockUnblock = async (workerId) => {
    try {
      await axios.put(`/api/admin/workers/${workerId}/block`);
      toast.success('Worker status updated');
      fetchWorkers();
    } catch (error) {
      toast.error('Failed to update worker status');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading workers...</p>
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
            <h2 className="mb-1">Worker Management</h2>
            <p className="text-muted">Manage and verify service providers</p>
          </Col>
          <Col xs="auto">
            <Badge bg="primary" className="px-3 py-2">
              Total: {workers.length}
            </Badge>
          </Col>
        </Row>

        {/* Statistics */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Workers</h6>
                <h3 className="mb-0">{workers.length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Verified</h6>
                <h3 className="mb-0 text-success">
                  {workers.filter(w => w.verificationStatus === 'verified').length}
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Pending</h6>
                <h3 className="mb-0 text-warning">
                  {workers.filter(w => w.verificationStatus === 'pending').length}
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Available</h6>
                <h3 className="mb-0 text-info">
                  {workers.filter(w => w.isAvailable).length}
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
                    placeholder="Search by name, email, or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text><FaFilter /></InputGroup.Text>
                  <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Workers</option>
                    <option value="verified">Verified Only</option>
                    <option value="pending">Pending Only</option>
                    <option value="rejected">Rejected Only</option>
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

        {/* Workers Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Service</th>
                  <th>Experience</th>
                  <th>Rate</th>
                  <th>Rating</th>
                  <th>Jobs</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <FaUserTie size={50} className="text-muted mb-3" />
                      <p className="text-muted">No workers found</p>
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map((worker) => (
                    <tr key={worker._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaUserTie size={30} className="text-primary me-2" />
                          <div>
                            <div className="fw-bold">{worker.userId?.name}</div>
                            <small className="text-muted">{worker.userId?.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="secondary">{worker.serviceCategory}</Badge>
                      </td>
                      <td>{worker.experience} years</td>
                      <td className="fw-bold">₹{worker.serviceCharges}/hr</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaStar className="text-warning me-1" />
                          <span className="fw-bold">{worker.rating}</span>
                          <small className="text-muted ms-1">({worker.totalRatings})</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info">{worker.completedJobs}</Badge>
                      </td>
                      <td>
                        {worker.verificationStatus === 'verified' && (
                          <Badge bg="success">Verified</Badge>
                        )}
                        {worker.verificationStatus === 'pending' && (
                          <Badge bg="warning">Pending</Badge>
                        )}
                        {worker.verificationStatus === 'rejected' && (
                          <Badge bg="danger">Rejected</Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => {
                            setSelectedWorker(worker);
                            setShowDetailsModal(true);
                          }}
                        >
                          <FaEye />
                        </Button>
                        {worker.verificationStatus === 'pending' && (
                          <>
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="me-1"
                              onClick={() => {
                                setSelectedWorker(worker);
                                setShowVerifyModal(true);
                              }}
                            >
                              <FaCheckCircle />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setSelectedWorker(worker);
                                setShowRejectModal(true);
                              }}
                            >
                              <FaTimes />
                            </Button>
                          </>
                        )}
                        {worker.verificationStatus === 'verified' && (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleBlockUnblock(worker._id)}
                          >
                            <FaBan />
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

      {/* Worker Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Worker Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWorker && (
            <Row>
              <Col md={6}>
                <h6 className="text-muted">Personal Information</h6>
                <p><strong>Name:</strong> {selectedWorker.userId?.name}</p>
                <p><strong>Email:</strong> {selectedWorker.userId?.email}</p>
                <p><strong>Phone:</strong> {selectedWorker.userId?.phone}</p>
                <p><strong>Service:</strong> {selectedWorker.serviceCategory}</p>
              </Col>
              <Col md={6}>
                <h6 className="text-muted">Professional Details</h6>
                <p><strong>Experience:</strong> {selectedWorker.experience} years</p>
                <p><strong>Rate:</strong> ₹{selectedWorker.serviceCharges}/hour</p>
                <p><strong>Rating:</strong> {selectedWorker.rating} ⭐ ({selectedWorker.totalRatings} reviews)</p>
                <p><strong>Completed Jobs:</strong> {selectedWorker.completedJobs}</p>
              </Col>
              <Col md={12} className="mt-3">
                <h6 className="text-muted">Status</h6>
                <p><strong>Verification:</strong> {
                  selectedWorker.verificationStatus === 'verified' ? 
                    <Badge bg="success">Verified</Badge> : 
                  selectedWorker.verificationStatus === 'pending' ?
                    <Badge bg="warning">Pending</Badge> :
                    <Badge bg="danger">Rejected</Badge>
                }</p>
                <p><strong>Availability:</strong> {selectedWorker.isAvailable ? 
                  <Badge bg="success">Available</Badge> : 
                  <Badge bg="secondary">Not Available</Badge>
                }</p>
                <p><strong>Joined:</strong> {new Date(selectedWorker.createdAt).toLocaleDateString()}</p>
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

      {/* Verify Modal */}
      <Modal show={showVerifyModal} onHide={() => setShowVerifyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Verify Worker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to verify <strong>{selectedWorker?.userId?.name}</strong>?
          This will allow them to accept bookings.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerifyModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleVerify}>
            Verify Worker
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Worker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Provide a reason for rejecting <strong>{selectedWorker?.userId?.name}</strong>:</p>
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
          <Button variant="danger" onClick={handleReject}>
            Reject Worker
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default WorkerManagement;
