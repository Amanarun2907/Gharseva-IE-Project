import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, ListGroup } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customerAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const WorkerProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkerProfile();
  }, [id]);

  const fetchWorkerProfile = async () => {
    try {
      const response = await customerAPI.getWorkerById(id);
      setWorker(response.data.data);
    } catch (error) {
      toast.error('Failed to load worker profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < Math.floor(rating) ? 'text-warning' : 'text-muted'}`}
        style={{ fontSize: '20px' }}
      ></i>
    ));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading profile...</p>
        </Container>
        <Footer />
      </>
    );
  }

  if (!worker) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <h3>Worker not found</h3>
          <Button as={Link} to="/services" variant="primary" className="mt-3">
            Browse Workers
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-5">
        <Row>
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Body className="text-center">
                {/* Worker Image based on category */}
                {worker.serviceCategory === 'Plumber' ? (
                  <img 
                    src="/images/plumber-work.jpg" 
                    alt="Plumber" 
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: '200px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : worker.serviceCategory === 'Electrician' ? (
                  <img 
                    src="/images/ac-technician.jpg" 
                    alt="Technician" 
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: '200px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : worker.serviceCategory === 'House Cleaning' ? (
                  <img 
                    src="/images/cleaner-1.jpg" 
                    alt="Cleaner" 
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: '200px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '120px', height: '120px', fontSize: '48px' }}
                  >
                    {worker.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <h4>{worker.userId?.name}</h4>
                <Badge bg="success" className="mb-3">
                  <i className="fas fa-check-circle me-1"></i>
                  Verified Worker
                </Badge>
                {worker.isTopRated && (
                  <Badge bg="warning" text="dark" className="ms-2">
                    <i className="fas fa-star me-1"></i>
                    Top Rated
                  </Badge>
                )}
                <div className="my-3">
                  {renderStars(worker.rating)}
                  <div className="mt-2">
                    <strong>{worker.rating.toFixed(1)}</strong> ({worker.totalRatings} reviews)
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <Button as={Link} to={`/book/${worker._id}`} variant="primary" size="lg">
                    Book Now
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Contact Information</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <i className="fas fa-envelope me-2 text-primary"></i>
                    {worker.userId?.email}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <i className="fas fa-phone me-2 text-primary"></i>
                    {worker.userId?.phone}
                  </ListGroup.Item>
                  {worker.userId?.address?.city && (
                    <ListGroup.Item>
                      <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                      {worker.userId.address.city}, {worker.userId.address.state}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-4">Professional Details</h4>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted">Service Category</small>
                      <h5 className="mb-0">{worker.serviceCategory}</h5>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted">Experience</small>
                      <h5 className="mb-0">{worker.experience} Years</h5>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted">Service Charges</small>
                      <h5 className="mb-0">₹{worker.serviceCharges}/day</h5>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted">Completed Jobs</small>
                      <h5 className="mb-0">{worker.completedJobs}</h5>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted">Response Time</small>
                      <h5 className="mb-0">{worker.responseTime} mins</h5>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted">Availability</small>
                      <h5 className="mb-0">
                        {worker.isAvailable ? (
                          <Badge bg="success">Available</Badge>
                        ) : (
                          <Badge bg="danger">Not Available</Badge>
                        )}
                      </h5>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {worker.skills && worker.skills.length > 0 && (
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="mb-3">Skills</h5>
                  <div>
                    {worker.skills.map((skill, index) => (
                      <Badge key={index} bg="primary" className="me-2 mb-2" style={{ fontSize: '14px' }}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Reviews & Ratings</h5>
                <div className="text-center py-4">
                  <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Reviews will be displayed here</p>
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

export default WorkerProfile;
