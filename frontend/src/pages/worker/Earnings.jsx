import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Form } from 'react-bootstrap';
import { FaMoneyBillWave, FaClock, FaCheckCircle, FaCalendar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { workerAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const WorkerEarnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchEarnings();
  }, [filterMonth, filterYear]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await workerAPI.getEarnings();
      const data = response.data.data;
      // Backend returns { payments: [], stats: {} }
      setEarnings(data.payments || []);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings');
      setEarnings(getMockEarnings());
    } finally {
      setLoading(false);
    }
  };

  const getMockEarnings = () => [
    {
      _id: '1',
      bookingId: { bookingId: 'BK1732291200001', serviceCategory: 'Plumber' },
      customerId: { name: 'Rajesh Kumar' },
      amount: 700,
      commissionAmount: 70,
      workerEarnings: 630,
      paymentMethod: 'cash',
      paymentStatus: 'completed',
      paidAt: new Date('2025-11-20'),
      createdAt: new Date('2025-11-20')
    },
    {
      _id: '2',
      bookingId: { bookingId: 'BK1732291200002', serviceCategory: 'Plumber' },
      customerId: { name: 'Priya Sharma' },
      amount: 800,
      commissionAmount: 80,
      workerEarnings: 720,
      paymentMethod: 'online',
      paymentStatus: 'completed',
      paidAt: new Date('2025-11-21'),
      createdAt: new Date('2025-11-21')
    },
    {
      _id: '3',
      bookingId: { bookingId: 'BK1732291200003', serviceCategory: 'Plumber' },
      customerId: { name: 'Amit Patel' },
      amount: 900,
      commissionAmount: 90,
      workerEarnings: 810,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      paidAt: null,
      createdAt: new Date('2025-11-22')
    }
  ];

  const totalEarned = earnings.filter(e => e.paymentStatus === 'completed').reduce((sum, e) => sum + (e.workerEarnings || 0), 0);
  const pendingAmount = earnings.filter(e => e.paymentStatus === 'pending').reduce((sum, e) => sum + (e.workerEarnings || 0), 0);
  const totalJobs = earnings.length;
  const paidJobs = earnings.filter(e => e.paymentStatus === 'completed').length;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading earnings...</p>
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
            <h2 className="mb-1">My Earnings</h2>
            <p className="text-muted">Track your income and payments</p>
          </Col>
        </Row>

        {/* Filter */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Month</Form.Label>
                  <Form.Select value={filterMonth} onChange={(e) => setFilterMonth(parseInt(e.target.value))}>
                    {months.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Select value={filterYear} onChange={(e) => setFilterYear(parseInt(e.target.value))}>
                    {[2025, 2024, 2023].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Statistics */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <FaMoneyBillWave size={30} className="text-success mb-2" />
                <h4 className="mb-0">₹{totalEarned.toLocaleString()}</h4>
                <small className="text-muted">Total Earned</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <FaClock size={30} className="text-warning mb-2" />
                <h4 className="mb-0">₹{pendingAmount.toLocaleString()}</h4>
                <small className="text-muted">Pending</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <FaCheckCircle size={30} className="text-info mb-2" />
                <h4 className="mb-0">{paidJobs}</h4>
                <small className="text-muted">Paid Jobs</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <FaCalendar size={30} className="text-primary mb-2" />
                <h4 className="mb-0">{totalJobs}</h4>
                <small className="text-muted">Total Jobs</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Earnings Table */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Payment History</h5>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Total Amount</th>
                  <th>Commission</th>
                  <th>Your Earning</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {earnings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <p className="text-muted">No earnings for this period</p>
                    </td>
                  </tr>
                ) : (
                  earnings.map((earning) => (
                    <tr key={earning._id}>
                      <td className="fw-bold">{earning.bookingId?.bookingId || 'N/A'}</td>
                      <td>{earning.customerId?.name || 'N/A'}</td>
                      <td>
                        <Badge bg="secondary">{earning.bookingId?.serviceCategory || 'Service'}</Badge>
                      </td>
                      <td>₹{earning.amount || 0}</td>
                      <td className="text-danger">-₹{earning.commissionAmount || 0}</td>
                      <td className="fw-bold text-success">₹{earning.workerEarnings || 0}</td>
                      <td>
                        {earning.paymentStatus === 'completed' ? (
                          <Badge bg="success">Paid</Badge>
                        ) : earning.paymentStatus === 'refunded' ? (
                          <Badge bg="danger">Refunded</Badge>
                        ) : (
                          <Badge bg="warning">Pending</Badge>
                        )}
                      </td>
                      <td>
                        {earning.paidAt ? 
                          new Date(earning.paidAt).toLocaleDateString() : 
                          new Date(earning.createdAt).toLocaleDateString()
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Summary */}
        <Card className="border-0 shadow-sm mt-4 bg-light">
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6 className="text-muted">Monthly Summary</h6>
                <p><strong>Period:</strong> {months[filterMonth]} {filterYear}</p>
                <p><strong>Total Jobs:</strong> {totalJobs}</p>
                <p><strong>Completed & Paid:</strong> {paidJobs}</p>
              </Col>
              <Col md={6} className="text-end">
                <h6 className="text-muted">Financial Summary</h6>
                <p><strong>Total Earned:</strong> <span className="text-success fs-5">₹{totalEarned.toLocaleString()}</span></p>
                <p><strong>Pending Payment:</strong> <span className="text-warning fs-5">₹{pendingAmount.toLocaleString()}</span></p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default WorkerEarnings;
