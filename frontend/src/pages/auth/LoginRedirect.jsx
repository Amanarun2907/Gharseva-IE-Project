import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const LoginRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('LoginRedirect - user:', user);
    console.log('LoginRedirect - isAuthenticated:', isAuthenticated);

    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    if (user) {
      const role = user.role;
      console.log('User role:', role);

      let redirectPath = '/';
      
      if (role === 'admin') {
        redirectPath = '/admin/dashboard';
      } else if (role === 'worker') {
        redirectPath = '/worker/dashboard';
      } else if (role === 'customer') {
        redirectPath = '/dashboard';
      }

      console.log('Redirecting to:', redirectPath);
      
      // Use window.location for guaranteed redirect
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);
    }
  }, [user, isAuthenticated, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h4>Redirecting to your dashboard...</h4>
        <p className="text-muted">Please wait</p>
      </div>
    </Container>
  );
};

export default LoginRedirect;
