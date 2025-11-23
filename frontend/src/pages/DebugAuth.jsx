import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const DebugAuth = () => {
  const { user, token, loading, isAuthenticated } = useAuth();

  const localStorageToken = localStorage.getItem('token');
  const localStorageUser = localStorage.getItem('user');

  return (
    <Container className="py-5">
      <h2 className="mb-4">Authentication Debug Page</h2>
      
      <Card className="mb-3">
        <Card.Header>Auth Context State</Card.Header>
        <Card.Body>
          <Table bordered>
            <tbody>
              <tr>
                <td><strong>Loading</strong></td>
                <td>{loading ? 'true' : 'false'}</td>
              </tr>
              <tr>
                <td><strong>Is Authenticated</strong></td>
                <td>{isAuthenticated ? 'true' : 'false'}</td>
              </tr>
              <tr>
                <td><strong>Token (first 50 chars)</strong></td>
                <td>{token ? token.substring(0, 50) + '...' : 'null'}</td>
              </tr>
              <tr>
                <td><strong>User</strong></td>
                <td><pre>{JSON.stringify(user, null, 2)}</pre></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>LocalStorage</Card.Header>
        <Card.Body>
          <Table bordered>
            <tbody>
              <tr>
                <td><strong>Token (first 50 chars)</strong></td>
                <td>{localStorageToken ? localStorageToken.substring(0, 50) + '...' : 'null'}</td>
              </tr>
              <tr>
                <td><strong>User</strong></td>
                <td><pre>{localStorageUser || 'null'}</pre></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DebugAuth;
