import { Card, Button, Spinner, Modal, Form, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";
import Header from "../header/Header";
import { authFetch } from "../../services/authFetch";
import { validateEmail, validatePassword } from "../auth/auth.services";
import { AuthContext } from "../../services/authContext/Auth.context";
import { jwtDecode } from "../../services/jwtDecode";

const Partners = ({ handleLogout }) => {
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
  const [search, setSearch] = useState(""); // Nuevo estado para el buscador
  const navigate = useNavigate();

  // Obtener el rol del usuario desde el token
  const { token } = useContext(AuthContext);
  let userRole = null;
  if (token) {
    const user = jwtDecode(token);
    userRole = user?.role;
  }

  // Traer socios y rutinas
  useEffect(() => {
    authFetch("http://localhost:3000/partners")
      .then((res) => res.json())
      .then((data) => {
        setPartners(data);
        setLoading(false);
        if (Array.isArray(data)) data.forEach((p) => fetchActiveRoutine(p.id));
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // Traer todas las rutinas
    authFetch("http://localhost:3000/routines")
      .then((res) => res.json())
      .then((data) => setRoutines(data))
      .catch((err) => console.error(err));
  }, []);

  // Traer rutina activa de un socio
  const fetchActiveRoutine = (id) => {
    authFetch(`http://localhost:3000/partners/${id}/active-routine`)
      .then((res) => res.json())
      .then((routine) => {
        setActiveRoutines((prev) => ({ ...prev, [id]: routine }));
      })
      .catch((err) => console.error(err));
  };

  // Cambiar rutina activa
  const handleRoutineChange = (partnerId, routineId) => {
    authFetch(`http://localhost:3000/partners/${partnerId}/active-routine`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ routineId }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Si el backend devuelve un nuevo token, guárdalo
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        fetchActiveRoutine(partnerId);
        toast.success("Rutina activa actualizada");
        // Notificar a otras vistas que la rutina fue cambiada
        localStorage.setItem("routine-assigned-updated", Date.now());
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
    authFetch(`http://localhost:3000/partners/${selectedId}`, {
      method: "DELETE",
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
    if (!newUser.email || newUser.email.trim() === "") {
      toast.error("El correo es obligatorio");
      return;
    }
    if (!validateEmail(newUser.email)) {
      toast.error("El formato del correo no es válido");
      return;
    }
    if (!newUser.password || newUser.password.trim() === "") {
      toast.error("La contraseña es obligatoria");
      return;
    }
    const passwordError = validatePassword(newUser.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    try {
      const res = await authFetch("http://localhost:3000/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        toast.success("Usuario creado correctamente");
        setShowAddUserModal(false);
        setNewUser({ email: "", password: "", role: "user" });
        // Refrescar lista de socios
        authFetch("http://localhost:3000/partners")
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

  // Filtrado de socios según el texto de búsqueda
  const filteredPartners = partners.filter((p) => {
    const text = `${p.nombre} ${p.apellido} ${p.email} ${p.telefono}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{ marginTop: "120px" }}
    >
      <Header onLogout={handleLogout} />
      {/* Buscador centrado y de tamaño normal */}
      <div className="d-flex justify-content-center mb-3" style={{ width: "100%" }}>
        <Form.Control
          type="text"
          placeholder="Buscar socio por nombre, apellido, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>
      <Card
        className="m-auto bg-dark p-4"
        style={{ maxWidth: "1500px", width: "100%" }}
      >
        <Card.Body>
          <div className="d-flex flex-column justify-content-center align-items-center mb-4">
            <Card.Title className="mb-2 text-center" style={{fontSize: '1.6rem', fontWeight: 700}}>Lista de Socios</Card.Title>
            {userRole === "admin" && (
              <Button variant="success" onClick={() => setShowAddUserModal(true)}>
                Agregar usuario
              </Button>
            )}
          </div>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <Row className="justify-content-center">
              {filteredPartners.map((p) => (
                <Col
                  key={p.id}
                  md={
                    filteredPartners.length === 1
                      ? 12
                      : filteredPartners.length === 2
                      ? 6
                      : 4
                  }
                  className="mb-4 d-flex justify-content-center"
                  style={
                    filteredPartners.length === 1 || filteredPartners.length === 2
                      ? { maxWidth: 400 }
                      : {}
                  }
                >
                  <Card className="bg-dark text-white h-100 border rounded w-100">
                    <Card.Body>
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
                        {p.role !== "trainer" && (
                          <div className="mt-2">
                            <b>Rutina activa:</b>{" "}
                            {activeRoutines[p.id] && activeRoutines[p.id]?.title ? (
                              <span>
                                {activeRoutines[p.id].title} (
                                {activeRoutines[p.id].level})
                              </span>
                            ) : (
                              <span className="text-warning">Sin rutina activa</span>
                            )}
                            {(userRole === "admin" || userRole === "trainer") && (
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
                    </Card.Body>
                    <Card.Footer className="bg-dark border-0">
                      {(userRole === "admin") && (
                        <Button
                          variant="danger"
                          onClick={() => handleShowModal(p.id)}
                          className="w-100"
                        >
                          Eliminar
                        </Button>
                      )}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
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
