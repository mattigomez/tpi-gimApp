import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import Header from "../header/Header";

const Account = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    estatura: "",
    peso: "",
    telefono: "",
    correo: "usuario@ejemplo.com", // Valor predeterminado no editable
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Datos guardados correctamente");
  };

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          width: "100vw", // <-- agrega esto
          background: "black", // <-- cambia a blanco
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "100px",
        }}
      >
        <Card
          style={{ maxWidth: "500px", width: "100%", margin: "0 auto" }}
          className="p-4 shadow"
        >
          <Card.Body>
            <h3 className="mb-4">Datos de la Cuenta</h3>
            <Form onSubmit={handleSubmit}>
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
                <Form.Label>Peso (kg)</Form.Label>
                <Form.Control
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  placeholder="Ingrese su peso"
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
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Account;
