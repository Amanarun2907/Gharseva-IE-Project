import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const SystemSettings = () => {
  return (
    <>
      <Navbar />
      <Container className="py-5">
        <h2>SystemSettings</h2>
        <p className="text-muted">Coming soon...</p>
      </Container>
      <Footer />
    </>
  );
};

export default SystemSettings;
