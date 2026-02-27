import { Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../services/authContext/Auth.context";
import ToggleTheme from "../toggleTheme/ToggleTheme";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();
  const { handleUserLogout } = useContext(AuthContext);

  const handleNavigateHome = () => {
    navigate("/home", { replace: true });
  };

  const handleLogout = () => {
    handleUserLogout();
    navigate("/login");
  };

  return (
    <Navbar fixed="top" expand="lg" className="navbar-modern" data-bs-theme="dark">
      <Container>
        <Navbar.Brand onClick={handleNavigateHome} style={{cursor:'pointer'}}>
          <img
            src="/logowhite-GYMHUB.png"
            alt="GYMHUB Logo"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          <Nav className="ms-auto p-auto align-items-center nav-actions">
            {/* <div className="toggle-theme-wrapper"><ToggleTheme /></div> */}
            <Button
              variant="outline-light"
              className="header-btn header-btn-outline"
              onClick={handleNavigateHome}
            >
              Home
            </Button>
            <Button className="header-btn header-btn-danger" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
