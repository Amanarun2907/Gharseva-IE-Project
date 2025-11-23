import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const TestDashboards = () => {
  const testLogin = (role) => {
    // Simulate login by setting token and user data
    const mockToken = 'test-token-' + role;
    const mockUsers = {
      admin: { id: '1', name: 'Admin User', email: 'admin@gharsewa.com', role: 'admin' },
      worker: { id: '2', name: 'Ramesh Singh', email: 'ramesh.worker@gharsewa.com', role: 'worker' },
      customer: { id: '3', name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'customer' }
    };
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUsers[role]));
    
    // Redirect to dashboard
    const dashboards = {
      admin: '/admin/dashboard',
      worker: '/worker/dashboard',
      customer: '/dashboard'
    };
    
    window.location.href = dashboards[role];
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Test Dashboards</h1>
      <p className="lead mb-4">Click a button below to test each dashboard directly:</p>
      
      <Row>
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <h3 className="text-primary mb-3">Admin Dashboard</h3>
              <p className="text-muted mb-3">Test the admin interface</p>
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100 mb-2"
                onClick={() => testLogin('admin')}
              >
                Test Admin Dashboard
              </Button>
              <Button 
                as={Link}
                to="/admin/dashboard" 
                variant="outline-primary" 
                size="sm" 
                className="w-100"
              >
                Direct Link
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <h3 className="text-success mb-3">Worker Dashboard</h3>
              <p className="text-muted mb-3">Test the worker interface</p>
              <Button 
                variant="success" 
                size="lg" 
                className="w-100 mb-2"
                onClick={() => testLogin('worker')}
              >
                Test Worker Dashboard
              </Button>
              <Button 
                as={Link}
                to="/worker/dashboard" 
                variant="outline-success" 
                size="sm" 
                className="w-100"
              >
                Direct Link
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              <h3 className="text-info mb-3">Customer Dashboard</h3>
              <p className="text-muted mb-3">Test the customer interface</p>
              <Button 
                variant="info" 
                size="lg" 
                className="w-100 mb-2"
                onClick={() => testLogin('customer')}
              >
                Test Customer Dashboard
              </Button>
              <Button 
                as={Link}
                to="/dashboard" 
                variant="outline-info" 
                size="sm" 
                className="w-100"
              >
                Direct Link
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <hr className="my-5" />
      
      <h3 className="mb-3">Or Test Real Login:</h3>
      <Button as={Link} to="/login" variant="primary" size="lg">
        Go to Login Page
      </Button>
      
      <hr className="my-5" />
      
      <h3 className="mb-3">Clear All Data:</h3>
      <Button 
        variant="danger" 
        onClick={() => {
          localStorage.clear();
          alert('All data cleared! Refresh the page.');
        }}
      >
        Clear LocalStorage
      </Button>
    </Container>
  );
};

export default TestDashboards;
