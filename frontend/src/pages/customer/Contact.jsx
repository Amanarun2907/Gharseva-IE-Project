import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you! Our team will respond shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Navbar />
      <Container className="py-5">
        <h2 className="text-center mb-5">Contact Us</h2>
        <Row>
          <Col md={6}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-4">Get in Touch</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-4">About GharSewa</h5>
                <p>GharSewa connects you with verified domestic helpers near you. Our goal is to make household help safe, reliable, and easily accessible.</p>
                <h6 className="mt-4">Our Team</h6>
                <ul>
                  <li>Rohit Fogla</li>
                  <li>Jhalak Kapila</li>
                  <li>Khushi Hooda</li>
                  <li>Aman Jain</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Contact;
