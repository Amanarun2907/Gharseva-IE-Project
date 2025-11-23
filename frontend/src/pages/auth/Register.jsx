import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    street: '',
    city: '',
    state: '',
    pincode: '',
    // Worker specific fields
    serviceCategory: '',
    experience: '',
    serviceCharges: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      // Add worker-specific fields if role is worker
      if (formData.role === 'worker') {
        submitData.serviceCategory = formData.serviceCategory;
        submitData.experience = parseInt(formData.experience) || 0;
        submitData.serviceCharges = parseFloat(formData.serviceCharges);
        submitData.skills = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      }

      await authAPI.register(submitData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4 text-primary">Register for GharSewa</h2>
                
                <Form onSubmit={handleSubmit}>
                  {/* Role Selection */}
                  <Form.Group className="mb-3">
                    <Form.Label>Register as</Form.Label>
                    <Form.Select name="role" value={formData.role} onChange={handleChange} required>
                      <option value="customer">Customer</option>
                      <option value="worker">Worker</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Basic Information */}
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Address */}
                  <h5 className="mt-4 mb-3">Address</h5>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="street"
                      placeholder="Street Address"
                      value={formData.street}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="state"
                          placeholder="State"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* Worker Specific Fields */}
                  {formData.role === 'worker' && (
                    <>
                      <h5 className="mt-4 mb-3">Worker Information</h5>
                      <Form.Group className="mb-3">
                        <Form.Label>Service Category</Form.Label>
                        <Form.Select
                          name="serviceCategory"
                          value={formData.serviceCategory}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Service</option>
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

                      <Form.Group className="mb-3">
                        <Form.Label>Experience (Years)</Form.Label>
                        <Form.Control
                          type="number"
                          name="experience"
                          placeholder="Years of experience"
                          value={formData.experience}
                          onChange={handleChange}
                          min="0"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Service Charges (₹/day)</Form.Label>
                        <Form.Control
                          type="number"
                          name="serviceCharges"
                          placeholder="Enter your daily charges"
                          value={formData.serviceCharges}
                          onChange={handleChange}
                          required
                          min="0"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Skills (comma separated)</Form.Label>
                        <Form.Control
                          type="text"
                          name="skills"
                          placeholder="e.g., Wiring, Installation, Repair"
                          value={formData.skills}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </>
                  )}

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mt-3"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </Button>
                </Form>

                <hr />
                <p className="text-center mb-0">
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Register;
