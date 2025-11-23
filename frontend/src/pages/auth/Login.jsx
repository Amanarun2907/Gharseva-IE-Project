import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting login with:', email);
      const response = await authAPI.login({ email, password });
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      console.log('User role:', user.role);
      
      // Set auth state and wait for it to complete
      login(token, user);
      
      // Show success message
      toast.success(`Welcome ${user.name}!`);
      
      // Determine redirect URL based on role
      let redirectUrl = '/dashboard'; // default for customer
      
      if (user.role === 'admin') {
        redirectUrl = '/admin/dashboard';
      } else if (user.role === 'worker') {
        redirectUrl = '/worker/dashboard';
      }
      
      console.log('Redirecting to:', redirectUrl, 'for role:', user.role);
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 100);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4 text-primary">Login to GharSewa</h2>
                
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <div className="alert alert-info small">
                    <strong>Demo Credentials:</strong><br/>
                    Admin: admin@gharsewa.com / Admin@123<br/>
                    Customer: rajesh@example.com / Password@123<br/>
                    Worker: ramesh.worker@gharsewa.com / Worker@123
                  </div>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Form>
                
                <hr />
                <p className="text-center mb-0">
                  Don't have an account? <Link to="/register">Register here</Link>
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

export default Login;
