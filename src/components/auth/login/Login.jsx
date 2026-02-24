import { useRef, useState, useContext } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../../services/authContext/Auth.context";
import { validateEmail, validatePassword } from "../auth.services";

import { API_BASE_URL } from "../../../services/authFetch";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const { handleUserLogin } = useContext(AuthContext);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrors((prev) => ({ ...prev, email: false }));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrors((prev) => ({ ...prev, password: false }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validaciones
    if (email.trim() === "") {
      toast.error("El correo es obligatorio");
      emailRef.current?.focus();
      setErrors((prev) => ({ ...prev, email: true }));
      return;
    }

    if (!validateEmail(email)) {
      toast.error("El formato del correo no es válido");
      setErrors((prev) => ({ ...prev, email: true }));
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      passwordRef.current?.focus();
      setErrors((prev) => ({ ...prev, password: true }));
      return;
    }

    // Login
    try {
      const res = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Tu API devuelve token en TEXT/PLAIN
      const text = await res.text();

      if (res.ok && text) {
        handleUserLogin(text); // guarda token y decodifica role/id/email
        onLogin?.();
        toast.success("Inicio de sesión exitoso", { autoClose: 3000 });
        navigate("/home");
        return;
      }

      // Si no fue ok, el backend devuelve texto tipo "Credenciales inválidas"
      toast.error(text || "Credenciales incorrectas");
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "var(--my-bg)",
      }}
    >
      <Card className="mt-5 mx-3 p-3 px-5 shadow">
        <Card.Body>
          <Row className="mb-2">
            <h5>GymHub</h5>
          </Row>

          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-4">
              <Form.Control
                type="text"
                className={`input-email ${errors.email ? "border border-danger" : ""}`}
                placeholder="Ingresar email"
                onChange={handleEmailChange}
                value={email}
                ref={emailRef}
                autoComplete="email"
              />
              {errors.email && <p className="text-danger">El correo no es válido</p>}
            </FormGroup>

            <FormGroup className="mb-4">
              <Form.Control
                type="password"
                placeholder="Ingresar contraseña"
                onChange={handlePasswordChange}
                value={password}
                ref={passwordRef}
                autoComplete="current-password"
              />
              {errors.password && <p className="text-danger">La contraseña no es válida</p>}
            </FormGroup>

            <Row>
              <Col className="mb-2">
                <Button variant="secondary" type="submit" className="w-100">
                  Iniciar sesión
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;