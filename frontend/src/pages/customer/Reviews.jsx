import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaRegStar, FaUser } from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch workers
      const workersRes = await axios.get('/api/customer/workers');
      setWorkers(workersRes.data.data || []);
      
      // Create mock reviews for display
      const mockReviews = [
        {
          id: 1,
          customerName: 'Rajesh Kumar',
          workerName: 'Ramesh Singh',
          service: 'Plumber',
          rating: 5,
          comment: 'Excellent service! Very professional and punctual. Fixed my plumbing issue quickly.',
          date: '2 days ago'
        },
        {
          id: 2,
          customerName: 'Priya Sharma',
          workerName: 'Suresh Yadav',
          service: 'Electrician',
          rating: 5,
          comment: 'Outstanding! Very skilled and friendly. Highly recommended for electrical work.',
          date: '5 days ago'
        },
        {
          id: 3,
          customerName: 'Amit Patel',
          workerName: 'Vijay Carpenter',
          service: 'Carpenter',
          rating: 4,
          comment: 'Good work. Arrived on time and completed the job efficiently. Very satisfied.',
          date: '1 week ago'
        },
        {
          id: 4,
          customerName: 'Sunita Devi',
          workerName: 'Lakshmi Cleaning',
          service: 'House Cleaning',
          rating: 5,
          comment: 'Amazing experience! Will definitely book again. Very thorough and clean work.',
          date: '1 week ago'
        },
        {
          id: 5,
          customerName: 'Vikram Singh',
          workerName: 'Ravi Painter',
          service: 'Painter',
          rating: 5,
          comment: 'Best service provider I have used. Polite, skilled, and efficient.',
          date: '2 weeks ago'
        },
        {
          id: 6,
          customerName: 'Meera Reddy',
          workerName: 'Anil AC Services',
          service: 'AC Repair',
          rating: 4,
          comment: 'Professional service. Minor delay but overall satisfied with the AC repair work.',
          date: '2 weeks ago'
        },
        {
          id: 7,
          customerName: 'Karan Mehta',
          workerName: 'Ramesh Singh',
          service: 'Plumber',
          rating: 5,
          comment: 'Exceptional work! Solved the problem that others couldn\'t fix. Highly recommended.',
          date: '3 weeks ago'
        },
        {
          id: 8,
          customerName: 'Anjali Gupta',
          workerName: 'Suresh Yadav',
          service: 'Electrician',
          rating: 5,
          comment: 'Perfect! Exactly what I needed. Very satisfied with the electrical installation.',
          date: '3 weeks ago'
        },
        {
          id: 9,
          customerName: 'Rohit Sharma',
          workerName: 'Vijay Carpenter',
          service: 'Carpenter',
          rating: 4,
          comment: 'Reliable and trustworthy. Good communication throughout the carpentry service.',
          date: '1 month ago'
        },
        {
          id: 10,
          customerName: 'Deepa Iyer',
          workerName: 'Lakshmi Cleaning',
          service: 'House Cleaning',
          rating: 5,
          comment: 'Highly professional. Cleaned up perfectly and explained everything clearly.',
          date: '1 month ago'
        },
        {
          id: 11,
          customerName: 'Arjun Nair',
          workerName: 'Ravi Painter',
          service: 'Painter',
          rating: 5,
          comment: 'Superb! Very knowledgeable and experienced. Painting work is perfect.',
          date: '1 month ago'
        },
        {
          id: 12,
          customerName: 'Kavita Desai',
          workerName: 'Anil AC Services',
          service: 'AC Repair',
          rating: 4,
          comment: 'Great service. Would have been 5 stars if arrived a bit earlier. AC working great now.',
          date: '1 month ago'
        }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-warning" />);
    }
    return stars;
  };

  const topRatedWorkers = workers
    .filter(w => w.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading reviews...</p>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">Reviews & Ratings</h1>
          <p className="lead text-muted">See what our customers say about our services</p>
        </div>

        {/* Top Rated Workers */}
        <section className="mb-5">
          <h3 className="mb-4">
            <FaStar className="text-warning me-2" />
            Top Rated Workers
          </h3>
          <Row>
            {topRatedWorkers.map((worker) => (
              <Col md={4} key={worker._id} className="mb-4">
                <Card className="h-100 shadow-sm hover-shadow">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ width: '50px', height: '50px' }}>
                        <FaUser size={24} />
                      </div>
                      <div className="ms-3">
                        <h5 className="mb-0">{worker.userId?.name}</h5>
                        <small className="text-muted">{worker.serviceCategory}</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <div className="me-2">{renderStars(worker.rating)}</div>
                      <strong>{worker.rating}</strong>
                      <span className="text-muted ms-2">({worker.totalRatings} reviews)</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>{worker.completedJobs} jobs completed</span>
                      <span>{worker.experience} years exp</span>
                    </div>
                    {worker.isTopRated && (
                      <Badge bg="success" className="mt-2">Top Rated</Badge>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Recent Reviews */}
        <section>
          <h3 className="mb-4">Recent Reviews</h3>
          <Row>
            {reviews.map((review) => (
              <Col md={6} key={review.id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 className="mb-0">{review.customerName}</h6>
                        <small className="text-muted">
                          Booked: <strong>{review.workerName}</strong> ({review.service})
                        </small>
                      </div>
                      <Badge bg="light" text="dark">{review.date}</Badge>
                    </div>
                    <div className="mb-2">
                      {renderStars(review.rating)}
                      <strong className="ms-2">{review.rating}.0</strong>
                    </div>
                    <p className="text-muted mb-0">{review.comment}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Statistics */}
        <section className="mt-5">
          <Card className="shadow-sm bg-light">
            <Card.Body>
              <h4 className="mb-4 text-center">Customer Satisfaction</h4>
              <Row className="text-center">
                <Col md={3}>
                  <h2 className="text-primary">4.8</h2>
                  <p className="text-muted">Average Rating</p>
                </Col>
                <Col md={3}>
                  <h2 className="text-success">1,250+</h2>
                  <p className="text-muted">Total Reviews</p>
                </Col>
                <Col md={3}>
                  <h2 className="text-info">95%</h2>
                  <p className="text-muted">Satisfaction Rate</p>
                </Col>
                <Col md={3}>
                  <h2 className="text-warning">18</h2>
                  <p className="text-muted">Verified Workers</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </section>
      </Container>
      <Footer />
    </>
  );
};

export default Reviews;
