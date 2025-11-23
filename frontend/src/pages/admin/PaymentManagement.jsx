import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaDownload, FaMoneyBillWave, FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [commissionRate, setCommissionRate] = useState(10);
  const [showCommissionModal, setShowCommissionModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchTerm, filterStatus, payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPayments();
      setPayments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
      setPayments(getMockPayments());
    } finally {
      setLoading(false);
    }
  };

  const getMockPayments = () => [
    {
      _id: '1',
      bookingId: { bookingId: 'BK1732291200001', customerId: { name: 'Rajesh Kumar' }, workerId: { userId: { name: 'Ramesh Singh' } } },
      amount: 700,
      commission: 70,
      workerAmount: 630,
      paymentMethod: 'cash',
      status: 'completed',
      transactionId: 'TXN1732291200001',
      paidAt: new Date('2025-11-20'),
      createdAt: new Date('2025-11-20')
    },
    {
      _id: '2',
      bookingId: { bookingId: 'BK1732291200002', customerId: { name: 'Priya Sharma' }, workerId: { userId: { name: 'Suresh Yadav' } } },
      amount: 800,
      commission: 80,
      workerAmount: 720,
      paymentMethod: 'online',
      status: 'completed',
      transactionId: 'TXN1732291200002',
      paidAt: new Date('2025-11-21'),
      createdAt: new Date('2025-11-21')
    },
    {
      _id: '3',
      bookingId: { bookingId: 'BK1732291200003', customerId: { name: 'Amit Patel' }, workerId: { userId: { name: 'Vijay Carpenter' } } },
      amount: 900,
      commission: 90,
      workerAmount: 810,
      paymentMethod: 'cash',
      status: 'pending',
      transactionId: null,
      paidAt: null,
      createdAt: new Date('2025-11-22')
    }
  ];

  const filterPayments = () => {
    let filtered = [...payments];

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.bookingId?.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.bookingId?.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    setFilteredPayments(filtered);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      completed: 'success',
      refunded: 'info',
      failed: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const handleProcessRefund = async () => {
    if (!refundAmount || !refundReason.trim()) {
      toast.error('Please provide refund amount and reason');
      return;
    }
    try {
      await axios.post('/api/admin/payments/refund', {
        paymentId: selectedPayment._id,
        amount: parseFloat(refundAmount),
        reason: refundReason
      });
      toast.success('Refund processed successfully');
      setShowRefundModal(false);
      setRefundAmount('');
      setRefundReason('');
      fetchPayments();
    } catch (error) {
      toast.error('Failed to process refund');
    }
  };

  const handleUpdateCommission = async () => {
    try {
      await axios.put('/api/admin/settings/commission', { commissionRate: parseFloat(commissionRate) });
      toast.success('Commission rate updated successfully');
      setShowCommissionModal(false);
    } catch (error) {
      toast.error('Failed to update commission rate');
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0);
  const totalCommission = payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.commission : 0), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading payments...</p>
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
            <h2 className="mb-1">Payment Management</h2>
            <p className="text-muted">Manage payments and transactions</p>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={() => setShowCommissionModal(true)}>
              Update Commission Rate
            </Button>
          </Col>
        </Row>

        {/* Statistics */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Revenue</h6>
                <h3 className="mb-0 text-success">₹{totalRevenue.toLocaleString()}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Commission</h6>
                <h3 className="mb-0 text-primary">₹{totalCommission.toLocaleString()}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Pending Payments</h6>
                <h3 className="mb-0 text-warning">{pendingPayments}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Commission Rate</h6>
                <h3 className="mb-0 text-info">{commissionRate}%</h3>
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
                    placeholder="Search by booking ID, transaction ID, or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text><FaFilter /></InputGroup.Text>
                  <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
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

        {/* Payments Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Worker</th>
                  <th>Amount</th>
                  <th>Commission</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      <FaMoneyBillWave size={50} className="text-muted mb-3" />
                      <p className="text-muted">No payments found</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="fw-bold">{payment.transactionId || 'N/A'}</td>
                      <td>{payment.bookingId?.bookingId}</td>
                      <td>{payment.bookingId?.customerId?.name}</td>
                      <td>{payment.bookingId?.workerId?.userId?.name}</td>
                      <td className="fw-bold">₹{payment.amount}</td>
                      <td className="text-primary">₹{payment.commission}</td>
                      <td>
                        <Badge bg={payment.paymentMethod === 'online' ? 'info' : 'secondary'}>
                          {payment.paymentMethod}
                        </Badge>
                      </td>
                      <td>{getStatusBadge(payment.status)}</td>
                      <td>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowDetailsModal(true);
                          }}
                        >
                          <FaEye />
                        </Button>
                        {payment.status === 'completed' && (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setRefundAmount(payment.amount.toString());
                              setShowRefundModal(true);
                            }}
                          >
                            <FaUndo />
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

      {/* Payment Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <Row>
              <Col md={6}>
                <h6 className="text-muted">Transaction Information</h6>
                <p><strong>Transaction ID:</strong> {selectedPayment.transactionId || 'N/A'}</p>
                <p><strong>Booking ID:</strong> {selectedPayment.bookingId?.bookingId}</p>
                <p><strong>Amount:</strong> ₹{selectedPayment.amount}</p>
                <p><strong>Commission:</strong> ₹{selectedPayment.commission}</p>
                <p><strong>Worker Amount:</strong> ₹{selectedPayment.workerAmount}</p>
                <p><strong>Method:</strong> {selectedPayment.paymentMethod}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedPayment.status)}</p>
              </Col>
              <Col md={6}>
                <h6 className="text-muted">Parties Involved</h6>
                <p><strong>Customer:</strong> {selectedPayment.bookingId?.customerId?.name}</p>
                <p><strong>Worker:</strong> {selectedPayment.bookingId?.workerId?.userId?.name}</p>
                <h6 className="text-muted mt-3">Dates</h6>
                <p><strong>Created:</strong> {new Date(selectedPayment.createdAt).toLocaleString()}</p>
                <p><strong>Paid:</strong> {selectedPayment.paidAt ? new Date(selectedPayment.paidAt).toLocaleString() : 'Not paid yet'}</p>
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

      {/* Refund Modal */}
      <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Refund</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Refund Amount (₹)</Form.Label>
            <Form.Control
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              max={selectedPayment?.amount}
              min="0"
            />
            <Form.Text>Maximum: ₹{selectedPayment?.amount}</Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Refund Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Enter reason for refund..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleProcessRefund}>
            Process Refund
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Commission Rate Modal */}
      <Modal show={showCommissionModal} onHide={() => setShowCommissionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Commission Rate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Commission Rate (%)</Form.Label>
            <Form.Control
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              min="0"
              max="100"
              step="0.1"
            />
            <Form.Text>Current rate: {commissionRate}%</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommissionModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateCommission}>
            Update Rate
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default PaymentManagement;
