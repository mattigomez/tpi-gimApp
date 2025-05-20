import { Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={4} className="mb-3">
          <Card onClick={() => handleNavigate('/account')} className="p-3 text-center shadow">
            <Card.Body>
              <Card.Title>Cuenta</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card onClick={() => handleNavigate('/current-routine')} className="p-3 text-center shadow">
            <Card.Body>
              <Card.Title>Rutina Actual</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card onClick={() => handleNavigate('/home/dashboard')} className="p-3 text-center shadow">
            <Card.Body>
              <Card.Title>Rutinas</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
