import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBolt, FaWrench, FaBroom, FaUser, FaHammer, FaUtensils, FaPaintRoller, FaCar } from 'react-icons/fa';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const Home = () => {
  const services = [
    { name: 'Electrician', icon: <FaBolt size={40} />, description: 'Electrical repairs and installations', color: '#f59e0b' },
    { name: 'Plumber', icon: <FaWrench size={40} />, description: 'Plumbing repairs and pipe fitting', color: '#3b82f6' },
    { name: 'House Cleaning', icon: <FaBroom size={40} />, description: 'Professional house cleaning services', color: '#10b981' },
    { name: 'Maid', icon: <FaUser size={40} />, description: 'Daily household help', color: '#ec4899' },
    { name: 'Carpenter', icon: <FaHammer size={40} />, description: 'Furniture repair and woodwork', color: '#8b5cf6' },
    { name: 'Cook', icon: <FaUtensils size={40} />, description: 'Professional cooking services', color: '#ef4444' },
    { name: 'Painter', icon: <FaPaintRoller size={40} />, description: 'Interior and exterior painting', color: '#06b6d4' },
    { name: 'Driver', icon: <FaCar size={40} />, description: 'Personal driver services', color: '#f97316' }
  ];

  const features = [
    { icon: '🔒', title: 'Verified Workers', description: 'Police & ID verification for safety' },
    { icon: '💳', title: 'Secure Payments', description: 'Pay after service via UPI escrow' },
    { icon: '⏰', title: 'Attendance Tracking', description: 'Check punctuality of your worker' },
    { icon: '🌐', title: 'Local Help', description: 'Available in nearby cities & towns' }
  ];

  const testimonials = [
    { name: 'Priya Sharma', rating: 5, comment: 'Found an excellent maid through GharSewa. Very professional service!' },
    { name: 'Rajesh Kumar', rating: 5, comment: 'The electrician was skilled and punctual. Highly recommended!' },
    { name: 'Anita Desai', rating: 4, comment: 'Good platform for finding household help. Easy to use.' }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-3">Verified Help for Every Home</h1>
              <p className="lead mb-4">Find trusted maids, cooks, or maintenance workers in your area.</p>
              <Button as={Link} to="/services" variant="light" size="lg" className="btn-orange">
                Book Now <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <img 
                src="/images/workers-banner.jpg" 
                alt="Service Workers" 
                className="img-fluid rounded"
                style={{ maxHeight: '300px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Service Categories */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Our Services</h2>
        
        {/* Services Grid Image */}
        <div className="text-center mb-5">
          <img 
            src="/images/services-grid.jpg" 
            alt="All Services" 
            className="img-fluid rounded shadow"
            style={{ maxWidth: '800px' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <Row>
          {services.map((service, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <Card className="h-100 text-center border-0 shadow-sm hover-card">
                <Card.Body>
                  <div className="mb-3" style={{ color: service.color }}>
                    {service.icon}
                  </div>
                  <Card.Title>{service.name}</Card.Title>
                  <Card.Text className="text-muted small">{service.description}</Card.Text>
                  <Button 
                    as={Link} 
                    to={`/services?category=${service.name}`} 
                    variant="outline-primary" 
                    size="sm"
                  >
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Why Choose Us */}
      <div className="bg-light-gray py-5">
        <Container>
          <h2 className="text-center mb-5">Why Choose GharSewa?</h2>
          
          {/* House Services Illustration */}
          <div className="text-center mb-5">
            <img 
              src="/images/house-services.jpg" 
              alt="House Services" 
              className="img-fluid"
              style={{ maxWidth: '600px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <Row>
            {features.map((feature, index) => (
              <Col key={index} md={6} lg={3} className="mb-4">
                <div className="text-center">
                  <div style={{ fontSize: '50px' }} className="mb-3">{feature.icon}</div>
                  <h5>{feature.title}</h5>
                  <p className="text-muted small">{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Testimonials */}
      <Container className="py-5">
        <h2 className="text-center mb-5">What Our Customers Say</h2>
        <Row>
          {testimonials.map((testimonial, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-warning"></i>
                    ))}
                  </div>
                  <Card.Text className="mb-3">"{testimonial.comment}"</Card.Text>
                  <Card.Text className="text-muted small mb-0">
                    <strong>- {testimonial.name}</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="bg-primary text-white py-5">
        <Container className="text-center">
          <h2 className="mb-3">Ready to Find Your Perfect Helper?</h2>
          <p className="lead mb-4">Join thousands of satisfied customers</p>
          <Button as={Link} to="/register" variant="light" size="lg" className="me-3">
            Sign Up Now
          </Button>
          <Button as={Link} to="/services" variant="outline-light" size="lg">
            Browse Services
          </Button>
        </Container>
      </div>

      <Footer />

      <style jsx>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </>
  );
};

export default Home;
