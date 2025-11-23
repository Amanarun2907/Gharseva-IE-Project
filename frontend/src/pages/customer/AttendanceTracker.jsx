import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const AttendanceTracker = () => {
  return (
    <>
      <Navbar />
      <Container className="py-5">
        <h2 className="mb-4">Attendance Tracker</h2>
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Worker Name</th>
                  <th>Check-in Time</th>
                  <th>Check-out Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No attendance records found
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default AttendanceTracker;
