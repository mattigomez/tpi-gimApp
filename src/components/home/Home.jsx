import { Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import Header from "../header/Header";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../services/authContext/Auth.context";
import { jwtDecode } from "../../services/jwtDecode";

const Home = ({ handleLogout }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [saludo, setSaludo] = useState("Bienvenido");

  useEffect(() => {
    if (token) {
      const user = jwtDecode(token);
      // Traer nombre desde la API si existe
      fetch(`http://localhost:3000/partners/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.nombre) {
            setSaludo(`Bienvenido ${data.nombre}`);
          } else if (user?.email) {
            setSaludo(`Bienvenido ${user.email}`);
          } else {
            setSaludo("Bienvenido");
          }
        })
        .catch(() => {
          if (user?.email) setSaludo(`Bienvenido ${user.email}`);
          else setSaludo("Bienvenido");
        });
    }
  }, [token]);


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
        <h3
              className="mb-4"
              style={{
                fontFamily: "Orbitron, Arial, sans-serif",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {saludo}
            </h3>
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
