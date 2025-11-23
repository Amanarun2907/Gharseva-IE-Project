import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 className="text-primary">GharSewa</h5>
            <p className="small">Verified Help for Every Home</p>
          </Col>
          <Col md={4} className="mb-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none small">Home</Link></li>
              <li><Link to="/services" className="text-white text-decoration-none small">Services</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none small">Contact</Link></li>
              <li><Link to="/reviews" className="text-white text-decoration-none small">Reviews</Link></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h6>Connect With Us</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-white"><i className="fab fa-facebook fa-lg"></i></a>
              <a href="#" className="text-white"><i className="fab fa-instagram fa-lg"></i></a>
              <a href="#" className="text-white"><i className="fab fa-linkedin fa-lg"></i></a>
            </div>
          </Col>
        </Row>
        <hr className="bg-white" />
        <Row>
          <Col className="text-center">
            <p className="small mb-0">&copy; 2025 GharSewa. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
