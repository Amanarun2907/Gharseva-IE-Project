import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const SubmitReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`/api/bookings/${bookingId}`);
      setBooking(response.data.data);
    } catch (error) {
      toast.error('Failed to load booking details');
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/customer/reviews', {
        bookingId: bookingId,
        workerId: booking?.workerId?._id,
        rating: rating,
        comment: comment
      });

      toast.success('Review submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4">Rate Your Experience</h2>

                {booking && (
                  <Card className="bg-light mb-4">
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p className="mb-1"><strong>Booking ID:</strong> {booking.bookingId}</p>
                          <p className="mb-1"><strong>Service:</strong> {booking.serviceCategory}</p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-1"><strong>Worker:</strong> {booking.workerId?.userId?.name}</p>
                          <p className="mb-1"><strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4 text-center">
                    <Form.Label className="d-block mb-3">
                      <h5>How would you rate the service?</h5>
                    </Form.Label>
                    <div className="d-flex justify-content-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={40}
                          className="cursor-pointer"
                          style={{ cursor: 'pointer' }}
                          color={(hover || rating) >= star ? '#ffc107' : '#e4e5e9'}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                        />
                      ))}
                    </div>
                    {rating > 0 && (
                      <div className="mt-2">
                        <Badge bg="warning" text="dark">
                          {rating === 1 && 'Poor'}
                          {rating === 2 && 'Fair'}
                          {rating === 3 && 'Good'}
                          {rating === 4 && 'Very Good'}
                          {rating === 5 && 'Excellent'}
                        </Badge>
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      <h6>Share your experience (Optional)</h6>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us about your experience with the service..."
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={() => navigate('/dashboard')}
                      >
                        Skip for Now
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading || rating === 0}
                      >
                        {loading ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default SubmitReview;
