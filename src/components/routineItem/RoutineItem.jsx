import { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { Card, Button, Badge, ListGroup } from "react-bootstrap";
import { PencilSquare, XCircle } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import NewRoutine from "../newRoutine/NewRoutine";
import { authFetch } from "../../services/authFetch";
import './routineItem.css';
import { AuthContext } from "../../services/authContext/Auth.context";
import { getUserClaims, normalizeRole } from "../../services/jwtClaims";

const RoutineItem = ({
    title,
    description,
    level,
    exercises,
    id,
    refreshRoutines
}) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const { token } = useContext(AuthContext);
    let userRole = null;
    if (token) {
        userRole = normalizeRole(getUserClaims(token)?.role);
    }

    const handleEdit = () => {
        setEditData({ id, title, description, level, exercises });
        setShowEditModal(true);
    };

    const handleDelete = async () => {
        try {
            const res = await authFetch(`/Routines/${id}`, { method: "DELETE" });
            if (res.ok) {
                setShowDeleteModal(false);
                setDeleteError(null);
                toast.success("Rutina eliminada correctamente");
                if (refreshRoutines) refreshRoutines();
            } else {
                setDeleteError("Error al eliminar la rutina, está asociada a uno o más usuarios");
            }
        } catch {
            setDeleteError("Error de conexión al eliminar");
        }
    };

    return (
        <>
        <Card className="mx-3 mb-3 card-container" style={{ position: 'relative' }}>
            {/* Mostrar iconos solo si el usuario es trainer o admin */}
            {(userRole === "trainer" || userRole === "admin") && (
                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, display: 'flex', gap: 10 }}>
                    <Button
                        variant="link"
                        style={{ color: '#00d4ff', padding: 0, fontSize: '1.3rem', lineHeight: 1 }}
                        onClick={handleEdit}
                        title="Editar rutina"
                    >
                        <PencilSquare size={24} />
                    </Button>
                    <Button
                        variant="link"
                        style={{ color: '#ff6b6b', padding: 0, fontSize: '1.3rem', lineHeight: 1 }}
                        onClick={() => setShowDeleteModal(true)}
                        title="Eliminar rutina"
                    >
                        <XCircle size={24} />
                    </Button>
                </div>
            )}
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <div>
                    <span>Nivel: </span>
                    <Badge bg="primary" className="mb-2">{level}</Badge>
                </div>
                <Card.Text>{description}</Card.Text>

                <ListGroup className="mb-3" variant="flush">
                    {exercises.map((exercise, index) => (
                        <ListGroup.Item key={index}>
                            {exercise.name} - {exercise.sets}x{exercise.repetitions ?? exercise.reps ?? ''}
                        </ListGroup.Item>
                    ))}
                </ListGroup>

            </Card.Body>
        </Card>
        {createPortal(
            showEditModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9998,
                    backdropFilter: 'blur(4px)'
                }}>
                    <NewRoutine
                        initialData={editData}
                        isEditMode={true}
                        onClose={() => {
                          setShowEditModal(false);
                          if (refreshRoutines) refreshRoutines();
                        }}
                    />
                </div>
            ),
            document.body
        )}
        {createPortal(
            showDeleteModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(3px)'
              }}>
                <div style={{
                  background: 'rgba(20, 22, 25, 0.95)',
                  color: '#fff',
                  borderRadius: 12,
                  padding: 32,
                  minWidth: 320,
                  maxWidth: 420,
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(6px) saturate(120%)'
                }}>
                  <h5 style={{ marginBottom: 16, color: '#ffffff', fontWeight: 600 }}>
                    ¿Eliminar rutina?
                  </h5>
                  <div style={{ marginBottom: 24, color: '#b0b0b0', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    ¿Estás seguro que deseas eliminar la rutina <span style={{color:'#00d4ff', fontWeight:600, fontSize: '1rem'}}>{title}</span>?
                  </div>
                  {deleteError && (
                    <div style={{
                      marginBottom: 24,
                      padding: 12,
                      backgroundColor: 'rgba(255, 107, 107, 0.15)',
                      border: '1px solid #ff6b6b',
                      borderRadius: 8,
                      color: '#ff6b6b',
                      fontSize: '0.9rem'
                    }}>
                      {deleteError}
                    </div>
                  )}
                  <div className="d-flex justify-content-center gap-3">
                    <Button
                      variant="danger"
                      style={{ minWidth: 100, fontWeight: 600, padding: '8px 24px' }}
                      onClick={handleDelete}
                    >Eliminar</Button>
                    <Button
                      variant="outline-secondary"
                      style={{ minWidth: 100, fontWeight: 600, padding: '8px 24px' }}
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeleteError(null);
                      }}
                    >Cancelar</Button>
                  </div>
                </div>
              </div>
            ),
            document.body
        )}
        </>
    );
};

export default RoutineItem;