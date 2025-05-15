
import { Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router"; 

export const Header = ({ onLogout }) => {
  const navigate = useNavigate(); 

  const handleNavigateAddRoutine = () => {
    navigate("/home/add-routine", { replace: true });
  };

  const handleNavigateHome = () => {
    navigate("/home", { replace: true });
  };

  return (
    <Navbar fixed="top" expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={handleNavigateHome} 
        >
          <img
            src="/src/assets/logowhite-GYMHUB.png"
            alt="GYMHUB Logo"
            height="60"
            className="d-inline-block align-top"
          />{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          <Nav className="ms-auto">
            <Button
              variant="outline-light"
              className="me-2"
              onClick={handleNavigateHome}
            >
              Home
            </Button>
            <Button
              variant="success"
              className="me-2"
              onClick={handleNavigateAddRoutine}
            >
              Agregar Rutina
            </Button>
            <Button variant="danger" onClick={onLogout}>
              Cerrar sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;