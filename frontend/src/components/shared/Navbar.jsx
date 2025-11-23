import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar bg="white" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <i className="fas fa-home me-2"></i>
          GharSewa
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/services">Services</Nav.Link>
            <Nav.Link as={Link} to="/reviews">Reviews</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={toggleTheme}
              className="ms-2"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </Button>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <>
                    <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/attendance">Attendance</Nav.Link>
                  </>
                )}
                {user?.role === 'worker' && (
                  <>
                    <Nav.Link as={Link} to="/worker/dashboard">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/worker/bookings">Bookings</Nav.Link>
                    <Nav.Link as={Link} to="/worker/earnings">Earnings</Nav.Link>
                  </>
                )}
                {user?.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin/dashboard">Admin Panel</Nav.Link>
                )}
                <Button variant="outline-primary" size="sm" onClick={handleLogout} className="ms-2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" size="sm" className="ms-2">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary" size="sm" className="ms-2">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
