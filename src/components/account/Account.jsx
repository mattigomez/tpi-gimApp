import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import Header from "../header/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authFetch } from "../../services/authFetch";

const Account = ({ userEmail, onLogout }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    estatura: "",
    peso: "",
    telefono: "",
    correo: userEmail || "usuario@ejemplo.com",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar cambio de contraseña si se completó
    if (formData.newPassword || formData.confirmNewPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error("Las contraseñas nuevas no coinciden");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("La nueva contraseña debe tener al menos 6 caracteres");
        return;
      }
    }

    // Preparar datos para enviar (no enviar campos de password vacíos)
    const payload = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      edad: formData.edad,
      estatura: formData.estatura,
      peso: formData.peso,
      telefono: formData.telefono,
      correo: formData.correo,
    };
    if (formData.newPassword) {
      payload.newPassword = formData.newPassword;
      payload.password = formData.password; // Para verificar la actual
    }

    try {
      const res = await authFetch(
        `http://localhost:3000/users/${formData.correo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        toast.success("Datos guardados correctamente");
        setFormData((prev) => ({
          ...prev,
          password: "",
          newPassword: "",
          confirmNewPassword: "",
        }));
      } else {
        const data = await res.json();
        toast.error(data.message || "Error al guardar los datos");
      }
    } catch (err) {
      toast.error(err, "Error de conexión con el servidor");
    }
  };

  return (
    <>
      <Header onLogout={onLogout} />
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "#181818",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "100px",
        }}
      >
        <Card
          style={{ maxWidth: "600px", width: "100%", margin: "0 auto" }}
          className="p-4 shadow"
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
              <Form.Group className="mb-3">
                <Form.Label>Contraseña actual</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingrese su contraseña actual"
                  autoComplete="current-password"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nueva contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Ingrese la nueva contraseña"
                  autoComplete="new-password"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Repetir nueva contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Repita la nueva contraseña"
                  autoComplete="new-password"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Guardar
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
