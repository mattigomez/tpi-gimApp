import { useState, useContext } from "react";
import { Card, Button, Badge, ListGroup } from "react-bootstrap";
import { PencilSquare, XCircle } from "react-bootstrap-icons";
import NewRoutine from "../newRoutine/NewRoutine";
import { authFetch } from "../../services/authFetch";
import './routineItem.css';
import { AuthContext } from "../../services/authContext/Auth.context";
import { jwtDecode } from "../../services/jwtDecode";

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

    // Obtener el rol del usuario desde el token
    const { token } = useContext(AuthContext);
    let userRole = null;
    if (token) {
        const user = jwtDecode(token);
        userRole = user?.role;
    }

    const handleEdit = () => {
        setEditData({ id, title, description, level, exercises });
        setShowEditModal(true);
    };

    const handleDelete = async () => {
        try {
            const res = await authFetch(`http://localhost:3000/routines/${id}`, { method: "DELETE" });
            if (res.ok) {
                setShowDeleteModal(false);
                if (refreshRoutines) refreshRoutines();
            } else {
                alert("Error al eliminar la rutina");
            }
        } catch {
            alert("Error de conexión al eliminar");
        }
    };

    return (
        <>
        <Card className="mx-3 mb-3 card-container" style={{ position: 'relative' }}>
            {/* Mostrar iconos solo si el usuario es trainer o admin */}
            {(userRole === "trainer" || userRole === "admin") && (
                <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', gap: 8 }}>
                    <Button
                        variant="link"
                        style={{ color: '#333', padding: 0 }}
                        onClick={handleEdit}
                    >
                        <PencilSquare size={22} />
                    </Button>
                    <Button
                        variant="link"
                        style={{ color: '#c00', padding: 0 }}
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <XCircle size={22} />
                    </Button>
                </div>
            )}
            <Card.Body>
                <Badge bg="primary" className="mb-2">{level}</Badge>
                <Card.Title>{title}</Card.Title>
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
        {showEditModal && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}>
                <div style={{ minWidth: 400 }}>
                    <NewRoutine
                        initialData={editData}
                        isEditMode={true}
                        onClose={() => {
                          setShowEditModal(false);
                          if (refreshRoutines) refreshRoutines();
                        }}
                    />
                </div>
            </div>
        )}
        {showDeleteModal && (
            <div style={{
                background: '#fff',
                borderRadius: 8,
                padding: 32,
                minWidth: 320,
                textAlign: 'center',
                boxShadow: '0 0 24px rgba(0,0,0,0.3)',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}>
                <div>
                    <h5 style={{ marginBottom: 24 }}>¿Estás seguro que desea eliminar la rutina?</h5>
                    <div className="d-flex justify-content-center gap-3">
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                        >Eliminar</Button>
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteModal(false)}
                        >Cancelar</Button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default RoutineItem;