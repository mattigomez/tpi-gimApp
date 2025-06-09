import { Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import Header from "../header/Header";
import { useContext } from "react";
import { AuthContext } from "../../services/authContext/Auth.context";
import { jwtDecode } from "../../services/jwtDecode";

const Home = ({ handleLogout }) => {
  const navigate = useNavigate();

  // Obtener el rol del usuario desde el token
  const { token } = useContext(AuthContext);
  let userRole = null;
  if (token) {
    const user = jwtDecode(token);
    userRole = user?.role;
  }

  return (
    <>
      <Header onLogout={handleLogout} />
      <div
        style={{
          height:"100vh",
          background: "var(--my-bg)",
        }}
      >
        <div
          style={{
            marginTop: "150px",
            padding: "100px",
            background: "#222",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              color: "#fff",
              marginBottom: "32px",
              letterSpacing: "2px",
            }}
          >
            TABLERO
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap:"32px"
            }}
          >
            <Card
              style={{
                width: "12rem",
                cursor: "pointer",
                alignItems: "center",
                display: "flex",
                gap: "32px",
              }}
              onClick={() => navigate("/account")}
            >
              <Card.Body className="d-flex flex-column align-items-center">
                <span style={{ fontSize: "48px", marginBottom: "12px" }}>
                  👤
                </span>
                <Card.Title>Cuenta</Card.Title>
              </Card.Body>
            </Card>
            {(userRole === "admin" || userRole === "trainer") && (
              <Card
                style={{
                  width: "12rem",
                  cursor: "pointer",
                  alignItems: "center",
                }}
                onClick={() => navigate("/partners")}
              >
                <Card.Body className="d-flex flex-column align-items-center">
                  <span style={{ fontSize: "48px", marginBottom: "12px" }}>
                    📈
                  </span>
                  <Card.Title>Socios</Card.Title>
                </Card.Body>
              </Card>
            )}
            <Card
              style={{
                width: "12rem",
                cursor: "pointer",
                alignItems: "center",
              }}
              onClick={() => navigate("/dashboard")}
            >
              <Card.Body className="d-flex flex-column align-items-center">
                <span style={{ fontSize: "48px", marginBottom: "12px" }}>
                  🏋️‍♂️
                </span>
                <Card.Title>Rutinas</Card.Title>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
