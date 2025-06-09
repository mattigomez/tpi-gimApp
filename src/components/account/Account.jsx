import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Card } from "react-bootstrap";
import Header from "../header/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authFetch } from "../../services/authFetch";
import { AuthContext } from "../../services/authContext/Auth.context";
import { jwtDecode } from "../../services/jwtDecode";

const Account = ({ handleLogout }) => {
  const { token } = useContext(AuthContext);
  let userId = "";
  let emailFromToken = "";
  if (token) {
    const user = jwtDecode(token);
    userId = user?.id || ""; // <-- el id debe venir en el token
    emailFromToken = user?.email || "";
  }

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    estatura: "",
    peso: "",
    telefono: "",
    correo: emailFromToken,
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Traer datos del usuario al montar
  useEffect(() => {
    if (userId) {
      authFetch(`http://localhost:3000/partners/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            edad: data.edad || "",
            estatura: data.estatura || "",
            peso: data.peso || "",
            telefono: data.telefono || "",
            correo: data.email || emailFromToken,
          }));
        })
        .catch(() => {
          toast.error("No se pudo cargar la información del usuario");
        });
    }
  }, [userId, emailFromToken]);

  // Manejar cambios en datos personales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar datos personales
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(
        `http://localhost:3000/partners/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) {
        toast.success("Datos guardados correctamente");
      } else {
        const data = await res.json();
        toast.error(data.message || "Error al guardar los datos");
      }
    } catch {
      toast.error("Error de conexión con el servidor");
    }
  };

  // Cambiar contraseña (si tenés endpoint /partners/:id/password)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (
      !passwordData.password ||
      !passwordData.newPassword ||
      !passwordData.confirmNewPassword
    ) {
      toast.error("Complete todos los campos de contraseña");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      const res = await authFetch(
        `http://localhost:3000/partners/${userId}/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: passwordData.password,
            newPassword: passwordData.newPassword,
          }),
        }
      );
      if (res.ok) {
        toast.success("Contraseña actualizada correctamente");
        setPasswordData({
          password: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        const data = await res.json();
        toast.error(data.message || "Error al cambiar la contraseña");
      }
    } catch {
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <>
      <Header onLogout={handleLogout} />
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "var(--my-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "100px",
        }}
      >
        <Card
          style={{ maxWidth: "600px", width: "100%", margin: "0 auto" }}
          className="bg-dark p-4"
        >
          <Card.Body>
            <h3
              className="mb-4"
              style={{
                fontFamily: "Orbitron, Arial, sans-serif",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Datos de la Cuenta
            </h3>
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ingrese su nombre"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Edad</Form.Label>
                    <Form.Control
                      type="number"
                      name="edad"
                      value={formData.edad}
                      onChange={handleChange}
                      placeholder="Ingrese su edad"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Peso (kg)</Form.Label>
                    <Form.Control
                      type="number"
                      name="peso"
                      value={formData.peso}
                      onChange={handleChange}
                      placeholder="Ingrese su peso"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      placeholder="Ingrese su apellido"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Estatura (cm)</Form.Label>
                    <Form.Control
                      type="number"
                      name="estatura"
                      value={formData.estatura}
                      onChange={handleChange}
                      placeholder="Ingrese su estatura"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Ingrese su teléfono"
                    />
                  </Form.Group>
                </div>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  value={formData.correo}
                  readOnly
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </Form>
            <hr />
            <h3
              className="mb-3"
              style={{
                fontFamily: "Orbitron, Arial, sans-serif",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Cambiar contraseña
            </h3>
            <Form onSubmit={handlePasswordSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña actual</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                  placeholder="Ingrese su contraseña actual"
                  autoComplete="current-password"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nueva contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Ingrese la nueva contraseña"
                  autoComplete="new-password"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Repetir nueva contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repita la nueva contraseña"
                  autoComplete="new-password"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Cambiar contraseña
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <ToastContainer />
      </div>
    </>
  );
};

export default Account;