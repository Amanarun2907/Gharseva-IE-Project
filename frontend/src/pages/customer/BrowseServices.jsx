import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customerAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const BrowseServices = () => {
  const [searchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    city: '',
    minRating: ''
  });

  useEffect(() => {
    fetchWorkers();
  }, [filters]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.serviceCategory = filters.category;
      if (filters.city) params.city = filters.city;
      if (filters.minRating) params.minRating = filters.minRating;

      const response = await customerAPI.getWorkers(params);
      setWorkers(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load workers');
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < Math.floor(rating) ? 'text-warning' : 'text-muted'}`}
      ></i>
    ));
  };

  return (
    <>
      <Navbar />
      <Container className="py-5">
        <h2 className="mb-4">Browse Service Providers</h2>

        {/* Hero Banner */}
        <div className="text-center mb-4">
          <img 
            src="/images/cleaning-tools.jpg" 
            alt="Cleaning Services" 
            className="img-fluid rounded"
            style={{ maxWidth: '400px', maxHeight: '250px' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Filters */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Service Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Services</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="House Cleaning">House Cleaning</option>
                    <option value="Maid">Maid</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Cook">Cook</option>
                    <option value="Painter">Painter</option>
                    <option value="Driver">Driver</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={filters.city}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Minimum Rating</Form.Label>
                  <Form.Select
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Workers List */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading workers...</p>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h4>No workers found</h4>
            <p className="text-muted">Try adjusting your filters</p>
          </div>
        ) : (
          <Row>
            {workers.map((worker) => (
              <Col key={worker._id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                        style={{ width: '60px', height: '60px', fontSize: '24px' }}
                      >
                        {worker.userId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="mb-0">{worker.userId?.name}</h5>
                        <Badge bg="success" className="mt-1">
                          <i className="fas fa-check-circle me-1"></i>
                          Verified
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-2">
                      <strong>Service:</strong> {worker.serviceCategory}
                    </div>
                    <div className="mb-2">
                      <strong>Experience:</strong> {worker.experience} years
                    </div>
                    <div className="mb-2">
                      <strong>Charges:</strong> ₹{worker.serviceCharges}/day
                    </div>
                    <div className="mb-2">
                      <strong>Rating:</strong> {renderStars(worker.rating)} ({worker.rating.toFixed(1)})
                    </div>
                    <div className="mb-3">
                      <strong>Completed Jobs:</strong> {worker.completedJobs}
                    </div>

                    {worker.skills && worker.skills.length > 0 && (
                      <div className="mb-3">
                        {worker.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} bg="secondary" className="me-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="d-grid gap-2">
                      <Button
                        as={Link}
                        to={`/worker/${worker._id}`}
                        variant="outline-primary"
                        size="sm"
                      >
                        View Profile
                      </Button>
                      <Button
                        as={Link}
                        to={`/book/${worker._id}`}
                        variant="primary"
                        size="sm"
                      >
                        Book Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default BrowseServices;
