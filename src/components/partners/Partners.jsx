import { Card, ListGroup, Button, Spinner, Modal, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Header from "../header/Header";
import { authFetch } from "../../services/authFetch";

const Partners = ({onLogout}) => {
  const [partners, setPartners] = useState([]);
  const [activeRoutines, setActiveRoutines] = useState({});
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  // Simula el usuario logueado (reemplaza por tu lógica real)
  const userRole = "admin"; // o "profesor", o traelo de tu auth

  // Traer socios y rutinas
  useEffect(() => {
    authFetch("http://localhost:3000/partners")
      .then((res) => res.json())
      .then((data) => {
        setPartners(data);
        setLoading(false);
        data.forEach((p) => fetchActiveRoutine(p.id));
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // Traer todas las rutinas
    fetch("http://localhost:3000/routines", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("GymHub-token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRoutines(data))
      .catch((err) => console.error(err));
  }, []);

  // Traer rutina activa de un socio
  const fetchActiveRoutine = (id) => {
    fetch(`http://localhost:3000/partners/${id}/active-routine`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("GymHub-token")}`,
      },
    })
      .then((res) => res.json())
      .then((routine) => {
        setActiveRoutines((prev) => ({ ...prev, [id]: routine }));
      })
      .catch((err) => console.error(err));
  };

  // Cambiar rutina activa
  const handleRoutineChange = (partnerId, routineId) => {
    fetch(`http://localhost:3000/partners/${partnerId}/active-routine`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("GymHub-token")}`,
      },
      body: JSON.stringify({ routineId }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchActiveRoutine(partnerId);
        toast.success("Rutina activa actualizada");
      })
      .catch(() => toast.error("Error al actualizar rutina"));
  };

  // Mostrar modal de confirmación
  const handleShowModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = () => {
    fetch(`http://localhost:3000/partners/${selectedId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("GymHub-token")}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Socio eliminado correctamente");
          setPartners((prev) => prev.filter((p) => p.id !== selectedId));
        } else {
          toast.error("Error al eliminar socio");
        }
        setShowModal(false);
      })
      .catch(() => {
        toast.error("Error al eliminar socio");
        setShowModal(false);
      });
  };

  // Modal para agregar usuario
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password) {
      toast.error("Email y contraseña son obligatorios");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("GymHub-token")}`,
        },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        toast.success("Usuario creado correctamente");
        setShowAddUserModal(false);
        setNewUser({ email: "", password: "", role: "user" });
        // Refrescar lista de socios
        fetch("http://localhost:3000/partners", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("GymHub-token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => setPartners(data));
      } else {
        const data = await res.json();
        toast.error(data.message || "Error al crear usuario");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const handleGoBack = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{ marginTop: "120px" }}
    >
      <Header onLogout={onLogout} />
      <Card
        className="m-auto bg-dark p-4"
        style={{ maxWidth: "1500px", width: "100%" }}
      >
        <Card.Body>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="success" onClick={() => setShowAddUserModal(true)}>
              Agregar usuario
            </Button>
          </div>
          <Card.Title className="mb-4">Lista de Socios</Card.Title>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <ListGroup variant="flush">
              {partners.map((p) => (
                <ListGroup.Item
                  key={p.id}
                  className="bg-dark text-white mb-3 border rounded"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div>
                        <b>Nombre:</b> {p.nombre} {p.apellido}
                      </div>
                      <div>
                        <b>Edad:</b> {p.edad} años
                      </div>
                      <div>
                        <b>Estatura:</b> {p.estatura} cm
                      </div>
                      <div>
                        <b>Peso:</b> {p.peso} kg
                      </div>
                      <div>
                        <b>Teléfono:</b> {p.telefono}
                      </div>
                      <div>
                        <b>Email:</b> {p.email}
                      </div>
                      {/* Mostrar rutina activa solo si el usuario NO es profesor */}
                      {p.role !== "trainer" && (
                        <div className="mt-2">
                          <b>Rutina activa:</b>{" "}
                          {activeRoutines[p.id] &&
                          activeRoutines[p.id]?.title ? (
                            <span>
                              {activeRoutines[p.id].title} (
                              {activeRoutines[p.id].level})
                            </span>
                          ) : (
                            <span className="text-warning">
                              Sin rutina activa
                            </span>
                          )}
                          {/* Desplegable solo para admin o profesor */}
                          {(userRole === "admin" ||
                            userRole === "trainer") && (
                            <div className="mt-2">
                              <select
                                value={activeRoutines[p.id]?.id || ""}
                                onChange={(e) =>
                                  handleRoutineChange(p.id, e.target.value)
                                }
                              >
                                <option value="">Seleccionar rutina</option>
                                {routines.map((r) => (
                                  <option key={r.id} value={r.id}>
                                    {r.title} ({r.level})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => handleShowModal(p.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <Button
            variant="outline-secondary"
            onClick={handleGoBack}
            className="mt-3 w-100"
          >
            Volver
          </Button>
        </Card.Body>
      </Card>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Seguro que deseas eliminar este socio?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para agregar usuario */}
      <Modal
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(false)}
        centered
      >
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>Agregar nuevo usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleNewUserChange}
                placeholder="Ingrese el email"
                className="bg-dark text-white"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={newUser.password}
                onChange={handleNewUserChange}
                placeholder="Ingrese la contraseña"
                className="bg-dark text-white"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
                className="bg-dark text-white"
              >
                <option value="user">Cliente</option>
                <option value="trainer">Profesor</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button
            variant="secondary"
            onClick={() => setShowAddUserModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="success" onClick={handleAddUser}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Partners;
