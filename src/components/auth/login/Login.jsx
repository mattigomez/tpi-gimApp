import { useRef, useState, useContext } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../services/authContext/Auth.context";
import { validateEmail, validatePassword } from "../auth.services";
import { API_BASE_URL } from "../../../services/authFetch";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      const text = await res.text();

      if (res.ok && text) {
        handleUserLogin(text);
        onLogin?.();
        navigate("/home");
        return;
      }

      toast.error(text || "Credenciales incorrectas");
    } catch {
      toast.error("Error de conexión");
    }
  };

  return (
    <div className="login-container">
      <div className="login-gradient"></div>
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-icon">💪</div>
            <h1 className="login-title">GymHub</h1>
            <p className="login-subtitle">Tu compañero de entrenamiento</p>
          </div>

          <Form onSubmit={handleSubmit} className="login-form">
            <FormGroup className="form-group-custom">
              <Form.Label className="form-label">Email</Form.Label>
              <div className="input-wrapper">
                <Form.Control
                  type="text"
                  className={`input-custom ${errors.email ? "has-error" : ""}`}
                  placeholder="usuario@ejemplo.com"
                  onChange={handleEmailChange}
                  value={email}
                  ref={emailRef}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="error-text">El correo no es válido</p>}
            </FormGroup>

            <FormGroup className="form-group-custom">
              <Form.Label className="form-label">Contraseña</Form.Label>
              <div className="input-wrapper password-wrapper">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  className={`input-custom ${errors.password ? "has-error" : ""}`}
                  placeholder="••••••••"
                  onChange={handlePasswordChange}
                  value={password}
                  ref={passwordRef}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ocultar" : "Mostrar"}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="error-text">La contraseña no es válida</p>}
            </FormGroup>

            <Button type="submit" className="btn-login">
              Iniciar sesión
            </Button>
          </Form>

          <div className="login-footer">
            <p>¿No tenés cuenta? Contacta al administrador</p>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={true} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
};

export default Login;