import "./home.css";
import { Button } from "react-bootstrap";
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
      <div className="home-page">
        <div className="home-container">
          <h3 className="home-header">{saludo}</h3>
          <div className="home-grid">
            <div className="home-tile" onClick={() => navigate("/account")} role="button" tabIndex={0}>
              <div className="icon">👤</div>
              <div className="title">Cuenta</div>
            </div>

            {(userRole === "admin" || userRole === "trainer") && (
              <div className="home-tile" onClick={() => navigate("/partners")} role="button" tabIndex={0}>
                <div className="icon">📈</div>
                <div className="title">Socios</div>
              </div>
            )}

            <div className="home-tile" onClick={() => navigate("/dashboard")} role="button" tabIndex={0}>
              <div className="icon">🏋️‍♂️</div>
              <div className="title">Rutinas</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
