import { Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../services/authContext/Auth.context";

const Header = () => {
  const navigate = useNavigate();
  const { handleUserLogout } = useContext(AuthContext);

  const handleNavigateHome = () => {
    navigate("/home", { replace: true });
  };

  const handleLogout = () => {
    handleUserLogout(); // Borra el token
    toast.success("Cierre de sesiòn exitoso", {
      onClose: () => navigate("/login")
    });
  };

  return (
    <Navbar fixed="top" expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="home">
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
            {" "}
            {}
            <Button
              variant="outline-light"
              className="me-2"
              onClick={handleNavigateHome}
            >
              Home
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
