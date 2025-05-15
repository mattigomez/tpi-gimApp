import { Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import Header from "../header/Header";

const Home = ({ userType }) => {
  const navigate = useNavigate();

  const handleLogout = () => { 
    navigate("/login", { replace: true });
  }

  return (
    <div
      style={{
        marginTop: "100px",
        padding: "100px",
        background: "#222",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
       <Header onLogout={handleLogout} />
      <h2 style={{ color: "#fff", marginBottom: "32px", letterSpacing: "2px" }}>TABLERO</h2>
      <div style={{ display: "flex", gap: "32px" }}>
        <Card
          style={{ width: "12rem", cursor: "pointer", alignItems: "center" }}
          onClick={() => navigate("/cuenta")}
        >
          <Card.Body className="d-flex flex-column align-items-center">
            <span style={{ fontSize: "48px", marginBottom: "12px" }}>👤</span>
            <Card.Title>Cuenta</Card.Title>
          </Card.Body>
        </Card>
        <Card
          style={{ width: "12rem", cursor: "pointer", alignItems: "center" }}
          onClick={() => navigate("/socios")}
        >
          <Card.Body className="d-flex flex-column align-items-center">
            <span style={{ fontSize: "48px", marginBottom: "12px" }}>📈</span>
            <Card.Title>Socios</Card.Title>
          </Card.Body>
        </Card>
        <Card
          style={{ width: "12rem", cursor: "pointer", alignItems: "center" }}
          onClick={() => navigate("/dashboard")}
        >
          <Card.Body className="d-flex flex-column align-items-center">
            <span style={{ fontSize: "48px", marginBottom: "12px" }}>🏋️‍♂️</span>
            <Card.Title>Rutinas</Card.Title>
          </Card.Body>
        </Card>
        {userType === "admin" && (
          <Card
            style={{ width: "12rem", cursor: "pointer", alignItems: "center" }}
            onClick={() => navigate("/admin")}
          >
            <Card.Body className="d-flex flex-column align-items-center">
              <span style={{ fontSize: "48px", marginBottom: "12px" }}>⚙️</span>
              <Card.Title>Admin</Card.Title>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;