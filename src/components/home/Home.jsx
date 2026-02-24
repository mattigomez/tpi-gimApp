import { Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import Header from "../header/Header";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../services/authContext/Auth.context";
import { authFetch } from "../../services/authFetch";
import { getUserClaims, normalizeRole } from "../../services/jwtClaims";

const Home = ({ handleLogout }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [saludo, setSaludo] = useState("Bienvenido");

  useEffect(() => {
    if (!token) return;

    const claims = getUserClaims(token);
    const email = claims?.email;

    // Para clientes existe /Users/me (si no es cliente puede dar 403)
    authFetch("/Users/me")
      .then(async (res) => {
        if (!res.ok) throw new Error("no-profile");
        return res.json();
      })
      .then((data) => {
        if (data?.name) setSaludo(`Bienvenido ${data.name}`);
        else if (data?.email) setSaludo(`Bienvenido ${data.email}`);
        else if (email) setSaludo(`Bienvenido ${email}`);
        else setSaludo("Bienvenido");
      })
      .catch(() => {
        if (email) setSaludo(`Bienvenido ${email}`);
        else setSaludo("Bienvenido");
      });
  }, [token]);



  let userRole = null;
  if (token) {
    const claims = getUserClaims(token);
    userRole = normalizeRole(claims?.role);
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
