import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const WorkerProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceCharges: '',
    experience: '',
    skills: '',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/worker/profile');
      const data = response.data.data;
      setFormData({
        name: data.userId?.name || '',
        email: data.userId?.email || '',
        phone: data.userId?.phone || '',
        serviceCharges: data.serviceCharges || '',
        experience: data.experience || '',
        skills: data.skills?.join(', ') || '',
        bio: data.bio || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      
      await axios.put('/api/worker/profile', updateData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
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

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-1">My Profile</h2>
            <p className="text-muted">Update your professional information</p>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <h5 className="mb-3">Personal Information</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <hr className="my-4" />

                  <h5 className="mb-3">Professional Details</h5>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Service Charges (₹/hour) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="serviceCharges"
                          value={formData.serviceCharges}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Experience (years) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Skills *</Form.Label>
                    <Form.Control
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., Pipe Fitting, Leak Repair, Installation"
                      required
                    />
                    <Form.Text>Separate skills with commas</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell customers about yourself and your expertise..."
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="w-100"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm mb-3">
              <Card.Body>
                <h6 className="text-muted mb-3">Profile Completion</h6>
                <div className="mb-2">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Profile Strength</small>
                    <small>85%</small>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <small className="text-muted">Complete your profile to get more bookings</small>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-3">Tips</h6>
                <ul className="small">
                  <li className="mb-2">Keep your service charges competitive</li>
                  <li className="mb-2">Update your skills regularly</li>
                  <li className="mb-2">Write a detailed bio to attract customers</li>
                  <li className="mb-2">Respond quickly to booking requests</li>
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

export default WorkerProfile;
