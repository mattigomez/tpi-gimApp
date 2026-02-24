import { Card, Button, Spinner, Modal, Form, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";
import Header from "../header/Header";
import { authFetch } from "../../services/authFetch";
import { validateEmail, validatePassword } from "../auth/auth.services";
import { AuthContext } from "../../services/authContext/Auth.context";
import { getUserClaims, normalizeRole } from "../../services/jwtClaims";

const Partners = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    rolId: 3, // Client por defecto
  });

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const userRole = normalizeRole(getUserClaims(token)?.role);

  const loadUsers = () => {
    setLoading(true);
    authFetch("/Users")
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(msg || "No se pudieron cargar los usuarios");
        }
        return res.json();
      })
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("No se pudieron cargar los usuarios (¿tenés rol Admin?)");
        setLoading(false);
      });
  };

  const loadRoutines = () => {
    authFetch("/Routines")
      .then((res) => res.json())
      .then((data) => setRoutines(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadUsers();
    loadRoutines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAssignRoutine = async (userId, routineId) => {
    try {
      // Si eligen vacío, no hacemos nada (para desasignar usamos botón/acción separada)
      if (!routineId) return;

      const res = await authFetch(`/Users/${userId}/assign/${routineId}`, {
        method: "PUT",
      });

      if (res.ok) {
        toast.success("Rutina asignada correctamente");
        localStorage.setItem("routine-assigned-updated", Date.now());
        loadUsers();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Error al asignar rutina");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const handleUnassignRoutine = async (userId, routineId) => {
    try {
      if (!routineId) return;
      const res = await authFetch(`/Users/${userId}/unassign/${routineId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Rutina desasignada correctamente");
        localStorage.setItem("routine-assigned-updated", Date.now());
        loadUsers();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Error al desasignar rutina");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const handleShowDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await authFetch(`/Users/${selectedId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Usuario eliminado correctamente");
        setUsers((prev) => prev.filter((u) => u.id !== selectedId));
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Error al eliminar usuario");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: name === "rolId" ? Number(value) : value,
    }));
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
      const res = await authFetch("/Users", {
        method: "POST",
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          rolId: newUser.rolId,
        }),
      });

      if (res.ok) {
        toast.success("Usuario creado correctamente");
        setShowAddUserModal(false);
        setNewUser({ email: "", password: "", rolId: 3 });
        loadUsers();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Error al crear usuario");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const handleGoBack = () => navigate("/home", { replace: true });

  const filteredUsers = users.filter((u) => {
    const text = `${u.email} ${u.roleName} ${u.activeRoutine?.title || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <>
      <Header onLogout={handleLogout} />
      <div
        className="d-flex flex-column align-items-center"
        style={{
          minHeight: "100vh",
          paddingTop: "90px",
          background: "var(--my-bg)",
        }}
      >
        <div className="d-flex justify-content-center m-3" style={{ width: "100%" }}>
          <Form.Control
            className="routines-search-input"
            type="text"
            placeholder="Buscar por email, rol o rutina activa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              maxWidth: 400,
              color: "var(--my-text)",
              backgroundColor: "var(--my-bg)",
              borderColor: "var(--my-primary)",
            }}
          />
        </div>

        <Card className="m-auto bg-dark p-4" style={{ maxWidth: "1500px", width: "100%" }}>
          <Card.Body>
            <div className="d-flex flex-column justify-content-center align-items-center mb-4">
              <Card.Title className="mb-2 text-center" style={{ fontSize: "1.6rem", fontWeight: 700 }}>
                Lista de Usuarios
              </Card.Title>

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
                {filteredUsers.map((u) => (
                  <Col
                    key={u.id}
                    md={filteredUsers.length === 1 ? 12 : filteredUsers.length === 2 ? 6 : 4}
                    className="mb-4 d-flex justify-content-center"
                    style={filteredUsers.length <= 2 ? { maxWidth: 420 } : {}}
                  >
                    <Card className="bg-dark text-white h-100 border rounded w-100">
                      <Card.Body>
                        <div>
                          <div><b>Email:</b> {u.email}</div>
                          <div><b>Rol:</b> {u.roleName}</div>

                          <div className="mt-2">
                            <b>Rutina activa:</b>{" "}
                            {u.activeRoutine?.title ? (
                              <span>
                                {u.activeRoutine.title} ({u.activeRoutine.level})
                              </span>
                            ) : (
                              <span className="text-warning">Sin rutina activa</span>
                            )}

                            {(userRole === "admin" || userRole === "trainer") && (
                              <div className="mt-2 d-flex gap-2 align-items-center">
                                <select
                                  value={u.activeRoutine?.id || ""}
                                  onChange={(e) => handleAssignRoutine(u.id, e.target.value)}
                                >
                                  <option value="">Seleccionar rutina</option>
                                  {routines.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.title} ({r.level})
                                    </option>
                                  ))}
                                </select>

                                {u.activeRoutine?.id && (
                                  <Button
                                    size="sm"
                                    variant="outline-warning"
                                    onClick={() => handleUnassignRoutine(u.id, u.activeRoutine.id)}
                                  >
                                    Quitar
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card.Body>

                      <Card.Footer className="bg-dark border-0">
                        {userRole === "admin" && (
                          <Button
                            variant="danger"
                            onClick={() => handleShowDeleteModal(u.id)}
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

            <Button variant="outline-secondary" onClick={handleGoBack} className="mt-3 w-100">
              Volver
            </Button>
          </Card.Body>
        </Card>

        {/* Modal de confirmación */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>¿Seguro que deseas eliminar este usuario?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para agregar usuario */}
        <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)} centered>
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
                  type="password"
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
                  name="rolId"
                  value={newUser.rolId}
                  onChange={handleNewUserChange}
                  className="bg-dark text-white"
                >
                  <option value={3}>Cliente</option>
                  <option value={2}>Profesor</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="secondary" onClick={() => setShowAddUserModal(false)}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleAddUser}>
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>

        <ToastContainer />
      </div>
    </>
  );
};

export default Partners;
