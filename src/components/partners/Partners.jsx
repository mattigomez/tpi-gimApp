import { Card, ListGroup, Button, Spinner, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [activeRoutines, setActiveRoutines] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  // Traer socios
  useEffect(() => {
    fetch("http://localhost:3000/partners")
      .then((res) => res.json())
      .then((data) => {
        setPartners(data);
        setLoading(false);
        // Traer rutina activa para cada socio
        data.forEach((p) => fetchActiveRoutine(p.id));
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Traer rutina activa de un socio (espera un objeto rutina)
  const fetchActiveRoutine = (id) => {
    fetch(`http://localhost:3000/partners/${id}/active-routine`)
      .then((res) => res.json())
      .then((routine) => {
        setActiveRoutines((prev) => ({ ...prev, [id]: routine }));
      })
      .catch((err) => console.error(err));
  };

  // Mostrar modal de confirmación
  const handleShowModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = () => {
    fetch(`http://localhost:3000/partners/${selectedId}`, { method: "DELETE" })
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

  const handleGoBack = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <Card className="m-auto bg-dark p-4" style={{ maxWidth: '1200px', width: '100%' }}>
        <Card.Body>
          <Card.Title className="mb-4">Lista de Socios</Card.Title>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <ListGroup variant="flush">
              {partners.map((p) => (
                <ListGroup.Item key={p.id} className="bg-dark text-white mb-3 border rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div><b>Nombre:</b> {p.nombre} {p.apellido}</div>
                      <div><b>Edad:</b> {p.edad} años</div>
                      <div><b>Estatura:</b> {p.estatura} cm</div>
                      <div><b>Peso:</b> {p.peso} kg</div>
                      <div><b>Teléfono:</b> {p.telefono}</div>
                      <div><b>Email:</b> {p.email}</div>
                      {/* Mostrar rutina activa solo si el usuario NO es profesor */}
                      {p.role !== "profesor" && (
                        <div className="mt-2">
                          <b>Rutina activa:</b>{" "}
                          {activeRoutines[p.id] && activeRoutines[p.id]?.title ? (
                            <span>
                              {activeRoutines[p.id].title} ({activeRoutines[p.id].level})
                            </span>
                          ) : (
                            <span className="text-warning">Sin rutina activa</span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button variant="danger" onClick={() => handleShowModal(p.id)}>
                      Eliminar
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <Button variant="outline-secondary" onClick={handleGoBack} className="mt-3 w-100">
            Volver
          </Button>
        </Card.Body>
      </Card>

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que deseas eliminar este socio?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Partners;