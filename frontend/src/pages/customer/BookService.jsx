import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customerAPI, bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const BookService = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '09:00 AM',
    duration: 'one-time',
    street: '',
    city: '',
    state: '',
    pincode: '',
    additionalNotes: '',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    fetchWorkerDetails();
  }, [workerId]);

  const fetchWorkerDetails = async () => {
    try {
      const response = await customerAPI.getWorkerById(workerId);
      setWorker(response.data.data);
    } catch (error) {
      console.error('Worker details error:', error);
      toast.error('Failed to load worker details');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculatePrice = () => {
    if (!worker) return 0;
    const basePrice = worker.serviceCharges || 0;
    const multiplier = formData.duration === 'monthly' ? 20 : formData.duration === 'weekly' ? 5 : 1;
    return basePrice * multiplier;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingData = {
        workerId: workerId,
        serviceCategory: worker.serviceCategory,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        duration: formData.duration,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        additionalNotes: formData.additionalNotes,
        paymentMethod: formData.paymentMethod,
        totalPrice: calculatePrice()
      };

      console.log('📝 Creating booking:', bookingData);
      const response = await bookingAPI.create(bookingData);
      console.log('✅ Booking created:', response.data);
      toast.success('Booking created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading...</p>
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
            <h2 className="mb-1">Book Service</h2>
            <p className="text-muted">Schedule a service with {worker?.userId?.name}</p>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <h5 className="mb-3">Service Details</h5>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Service Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="scheduledDate"
                          value={formData.scheduledDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Preferred Time *</Form.Label>
                        <Form.Select
                          name="scheduledTime"
                          value={formData.scheduledTime}
                          onChange={handleChange}
                          required
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Service Duration *</Form.Label>
                    <Form.Select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                    >
                      <option value="one-time">One Time</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Form.Select>
                  </Form.Group>

                  <hr className="my-4" />

                  <h5 className="mb-3">Service Address</h5>

                  <Form.Group className="mb-3">
                    <Form.Label>Street Address *</Form.Label>
                    <Form.Control
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="House/Flat No., Street Name"
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City *</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>State *</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Pincode *</Form.Label>
                    <Form.Control
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      maxLength="6"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Additional Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      placeholder="Any specific requirements or instructions..."
                    />
                  </Form.Group>

                  <hr className="my-4" />

                  <h5 className="mb-3">Payment Method</h5>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="radio"
                      label="Cash on Service"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Online Payment"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    className="w-100"
                    size="lg"
                  >
                    {submitting ? 'Creating Booking...' : `Confirm Booking - ₹${calculatePrice()}`}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm mb-3">
              <Card.Body>
                <h6 className="text-muted mb-3">Worker Details</h6>
                <p><strong>Name:</strong> {worker?.userId?.name}</p>
                <p><strong>Service:</strong> {worker?.serviceCategory}</p>
                <p><strong>Experience:</strong> {worker?.experience} years</p>
                <p><strong>Rate:</strong> ₹{worker?.serviceCharges}/hour</p>
                <p><strong>Rating:</strong> {worker?.rating} ⭐ ({worker?.totalRatings} reviews)</p>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm bg-light">
              <Card.Body>
                <h6 className="text-muted mb-3">Price Breakdown</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Base Rate:</span>
                  <span>₹{worker?.serviceCharges}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Duration:</span>
                  <span>{formData.duration}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-primary fs-5">₹{calculatePrice()}</strong>
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

export default BookService;
