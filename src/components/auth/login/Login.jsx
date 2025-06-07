import { useRef, useState, useContext } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthContext } from "../../../services/authContext/Auth.context";

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

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const validatePassword = (password) => {
    if (password.trim() === "") return "La contraseña está vacía";
    if (password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres";
    if (!/[A-Z]/.test(password))
      return "Debe tener al menos una letra mayúscula";
    if (!/[a-z]/.test(password))
      return "Debe tener al menos una letra minúscula";
    if (!/\d/.test(password)) return "Debe tener al menos un número";
    return "";
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: false,
    }));
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email.trim() === "") {
      toast.error("El correo es obligatorio");
      emailRef.current.focus();
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: true,
      }));
      return;
    } else if (!validateEmail(email)) {
      toast.error("El formato del correo no es vàlido");
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: true,
      }));
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      passwordRef.current.focus();
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: true,
      }));
      return;
    }

    // Lógica de login real
    try {
      console.log("Login request:", { email, password });
const res = await fetch("http://localhost:3000/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
      const data = await res.json();
      console.log("Login response:", data);
      if (res.ok && data.token) {
        handleUserLogin(data.token); // Guarda el token en contexto y localStorage
        onLogin();
        toast.success("Inicio de sesión exitoso", { autoClose: 3000 });
        navigate("/home");
      } else {
        toast.error(data.message || "Credenciales incorrectas");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };
  return (
    <Card className="mt-5 mx-3 p-3 px-5 shadow">
      <Card.Body>
        <Row className="mb-2">
          <h5>GimHub</h5>
        </Row>
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-4">
            <Form.Control
              type="text"
              className={`input-email ${
                errors.email ? "border border-danger" : ""
              }`}
              placeholder="Ingresar email"
              onChange={handleEmailChange}
              value={email}
              ref={emailRef}
            />
            {errors.email && (
              <p className="text-danger">El correo no es valido</p>
            )}
          </FormGroup>
          <FormGroup className="mb-4">
            <Form.Control
              type="password"
              placeholder="Ingresar contraseña"
              onChange={handlePasswordChange}
              value={password}
              ref={passwordRef}
            />
            {errors.password && (
              <p className="text-danger">La contraseña no es válida</p>
            )}
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
  );
};

export default Login;