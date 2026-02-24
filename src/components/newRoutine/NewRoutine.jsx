import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { authFetch } from "../../services/authFetch";

const levelToInt = (l) =>
  ({ Principiante: 1, Intermedio: 2, Avanzado: 3, principiante: 1, intermedio: 2, avanzado: 3 }[l] ?? 1);

const NewRoutine = ({ initialData, isEditMode = false, onClose }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [level, setLevel] = useState(levelToInt(initialData?.level));
  const [exercises, setExercises] = useState(initialData?.exercises || []);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [editSets, setEditSets] = useState("");
  const [editRepetitions, setEditRepetitions] = useState("");
  const [formTriedSubmit, setFormTriedSubmit] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [duplicateTitleError, setDuplicateTitleError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    authFetch("/Exercises")
      .then(res => res.json())
      .then(data => setAvailableExercises(data));
  }, []);

  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLevel(levelToInt(initialData.level));
      setExercises(initialData.exercises || []);
    }
  }, [initialData, isEditMode]);

  const handleAddExercise = () => {
    if (exerciseName && sets && (repetitions || repetitions === 0)) {
      setExercises([
        ...exercises,
        {
          name: exerciseName,
          sets: parseInt(sets),
          repetitions: parseInt(repetitions),
        },
      ]);
      setExerciseName("");
      setSets("");
      setRepetitions("");
    }
  };

  const handleAddExistingExercise = () => {
    if (
      selectedExerciseId &&
      !exercises.some(ex => ex.id === parseInt(selectedExerciseId))
    ) {
      const ex = availableExercises.find(e => e.id === parseInt(selectedExerciseId));
      setExercises([
        ...exercises,
        { id: ex.id, name: ex.name, sets: ex.sets, repetitions: ex.repetitions },
      ]);
      setSelectedExerciseId("");
    }
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormTriedSubmit(true);
    setDuplicateTitleError("");
    try {
      const resRoutines = await authFetch("/Routines");
      const routinesList = await resRoutines.json();
      const titleNormalized = title.trim().toLowerCase();
      const duplicate = routinesList.find(r =>
        r.title.trim().toLowerCase() === titleNormalized &&
        (!isEditMode || r.id !== initialData?.id)
      );
      if (duplicate) {
        setDuplicateTitleError("El nombre de rutina ya está en uso");
        return;
      }
    } catch {
      setDuplicateTitleError("No se pudo validar el nombre de la rutina");
      return;
    }
    if (title.length > 60) {
      toast.error("El título no puede superar los 60 caracteres");
      return;
    }
    if (description.length > 200) {
      toast.error("La descripción no puede superar los 200 caracteres");
      return;
    }
    if (!Array.isArray(exercises) || exercises.length === 0) {
      return;
    }
    for (const ex of exercises) {
      if (!ex.name || !ex.sets || !ex.repetitions) {
        toast.error("Todos los ejercicios deben tener nombre, series y repeticiones");
        return;
      }
      if (ex.name.length > 60) {
        toast.error("El nombre del ejercicio no puede superar los 60 caracteres");
        return;
      }
      if (ex.sets < 1 || ex.repetitions < 1) {
        toast.error("Las series y repeticiones deben ser mayores a 0");
        return;
      }
    }

    const routineData = {
      title,
      description,
      level,
      exercises,
    };
    try {
      let res;
      if (isEditMode && initialData?.id) {
        res = await authFetch(`/Routines/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(routineData),
        });
      } else {
        res = await authFetch("/Routines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(routineData),
        });
      }
      if (res.ok) {
        setTitle("");
        setDescription("");
        setLevel("principiante");
        setExercises([]);
        toast.success(isEditMode ? "Rutina actualizada con éxito" : "Rutina creada con éxito");
        if (typeof window.refreshRoutines === "function") window.refreshRoutines();
        if (onClose) onClose();
        if (!isEditMode) navigate("/dashboard");
      } else {
        toast.error(isEditMode ? "Error al actualizar rutina" : "Error al crear rutina");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const handleGoBack = () => {
    if (onClose) onClose();
    else navigate("/dashboard", { replace: true });
  };

  return (
    <div className="d-flex flex-column align-items-center" style={{ minHeight: '100vh', overflowY: 'auto', padding: '32px 0' }}>
      <Card className="m-auto bg-dark p-4" style={{ maxWidth: '1000px', width: '100%', minHeight: 0, maxHeight: '95vh', overflowY: 'auto' }}>
        <Card.Body>
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Row className="g-2 align-items-start">
              <Col xs={7} sm={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Título de la rutina</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setDuplicateTitleError("");
                    }}
                    placeholder="Ej. Full Body Principiante"
                    maxLength={60}
                    required
                  />
                  {formTriedSubmit && !title.trim() && <div className="text-danger mt-1">El título es obligatorio</div>}
                  {duplicateTitleError && <div className="text-danger mt-1">{duplicateTitleError}</div>}
                </Form.Group>
              </Col>
              <Col xs={5} sm={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Nivel</Form.Label>
                  <Form.Select
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                  >
                    <option value={1}>Principiante</option>
                    <option value={2}>Intermedio</option>
                    <option value={3}>Avanzado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción breve de la rutina (opcional)"
                maxLength={200}
              />
            </Form.Group>
            <hr />
            <h5 className="mt-3">Agregar ejercicios</h5>
            {/* Selección de ejercicios existentes */}
            <Form.Group className="mb-3">
              <Form.Label>Agregar ejercicio existente</Form.Label>
              <Row className="align-items-center">
                <Col md={editingExerciseId ? 5 : 8} className="align-items-center d-flex">
                  <Form.Select
                    value={selectedExerciseId}
                    onChange={e => setSelectedExerciseId(e.target.value)}
                    disabled={editingExerciseId !== null}
                  >
                    <option value="">Seleccionar ejercicio...</option>
                    {availableExercises.map(ex => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} - {ex.sets}x{ex.repetitions}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={editingExerciseId ? 7 : 4} className="d-flex gap-2 align-items-center">
                  <Button
                    onClick={handleAddExistingExercise}
                    variant="info"
                    className="w-100 py-1 px-2"
                    size="sm"
                    disabled={editingExerciseId !== null}
                  >
                    Agregar existente
                  </Button>
                  <Button
                    onClick={() => {
                      if (!selectedExerciseId) return toast.info("Selecciona un ejercicio para modificar");
                      const ex = availableExercises.find(e => e.id === parseInt(selectedExerciseId));
                      if (!ex) return toast.error("Ejercicio no encontrado");
                      setEditingExerciseId(ex.id);
                      setEditSets(ex.sets);
                      setEditRepetitions(ex.repetitions);
                    }}
                    variant="warning"
                    className="w-100 py-1 px-2"
                    size="sm"
                    disabled={editingExerciseId !== null}
                  >
                    Modificar ejercicio
                  </Button>
                  <Button
                    onClick={() => {
                      if (!selectedExerciseId) return toast.info("Selecciona un ejercicio para eliminar");
                      const ex = availableExercises.find(e => e.id === parseInt(selectedExerciseId));
                      if (!ex) return toast.error("Ejercicio no encontrado");
                      setExerciseToDelete(ex);
                      setShowDeleteModal(true);
                    }}
                    variant="danger"
                    className="w-100 py-1 px-2"
                    size="sm"
                    disabled={editingExerciseId !== null}
                  >
                    Eliminar ejercicio
                  </Button>
                </Col>
              </Row>
              {/* Edición en línea */}
              {editingExerciseId && (
                <Row className="mt-3 align-items-center">
                  <Col md={3}>
                    <Form.Label>Series</Form.Label>
                    <Form.Control
                      type="number"
                      value={editSets}
                      onChange={e => setEditSets(e.target.value)}
                      min={1}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Label>Repeticiones</Form.Label>
                    <Form.Control
                      type="number"
                      value={editRepetitions}
                      onChange={e => setEditRepetitions(e.target.value)}
                      min={1}
                    />
                  </Col>
                  <Col md={5} className="d-flex gap-2 pt-3">
                    <Button
                      variant="primary"
                      onClick={async () => {
                        try {
                          const editingEx = availableExercises.find(e => e.id === editingExerciseId);
                          const res = await authFetch(`/Exercises/${editingExerciseId}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              name: editingEx?.name ?? "",
                              sets: parseInt(editSets),
                              repetitions: parseInt(editRepetitions),
                            }),
                          });
                          if (res.ok) {
                            setAvailableExercises(prev =>
                              prev.map(e =>
                                e.id === editingExerciseId
                                  ? { ...e, sets: parseInt(editSets), repetitions: parseInt(editRepetitions) }
                                  : e
                              )
                            );
                            setExercises(prev =>
                              prev.map(e =>
                                e.id === editingExerciseId
                                  ? { ...e, sets: parseInt(editSets), repetitions: parseInt(editRepetitions) }
                                  : e
                              )
                            );
                            toast.success("Ejercicio modificado correctamente");
                            setEditingExerciseId(null);
                          } else {
                            toast.error("Error al modificar el ejercicio");
                          }
                        } catch {
                          toast.error("Error de conexión al modificar");
                        }
                      }}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditingExerciseId(null)}
                    >
                      Cancelar
                    </Button>
                  </Col>
                </Row>
              )}
            </Form.Group>

            {/* Agregar ejercicio nuevo */}
            <Row className="justify-content-center align-items-center">
              <Col md={4}>
                <Form.Control
                  placeholder="Nombre del ejercicio"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="mb-2"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  placeholder="Series"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="mb-2"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  placeholder="Repeticiones"
                  value={repetitions}
                  onChange={(e) => setRepetitions(e.target.value)}
                  className="mb-2"
                />
              </Col>
              <Col md={2}>
                <Button onClick={handleAddExercise} variant="secondary" className="mb-3 w-100 py-1 px-2" size="sm">
                  Agregar nuevo ejercicio
                </Button>
              </Col>
            </Row>

            {/* Lista de ejercicios agregados */}
            {exercises.length > 0 && (
              <ListGroup className="mb-3 mt-3">
                {exercises.map((ex, index) => (
                  <ListGroup.Item key={index}>
                    {ex.name} - {ex.sets}x{ex.repetitions}
                    <Button
                      variant="danger"
                      size="sm"
                      className="float-end"
                      onClick={() => handleRemoveExercise(index)}
                    >
                      Quitar
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
            {exercises.length === 0 && formTriedSubmit && <div className="text-danger mb-3">Debe agregar al menos un ejercicio</div>}
            <Button type="submit" variant="success" className="mb-2 w-100">
              {isEditMode ? "Guardar cambios" : "Crear Rutina"}
            </Button>
            <Button variant="outline-secondary" onClick={handleGoBack} className="w-100">
              Cancelar
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {showDeleteModal && (
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
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: 32,
            minWidth: 320,
            textAlign: 'center',
            boxShadow: '0 0 24px rgba(0,0,0,0.3)'
          }}>
            <h5 style={{marginBottom: 24, color: 'black'}}>¿Desea eliminar el ejercicio "{exerciseToDelete?.name}"?</h5>
            {deleteError && <div style={{ color: 'red', marginBottom: 12 }}>{deleteError}</div>}
            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    const res = await authFetch(`/Exercises/${exerciseToDelete.id}`, { method: "DELETE" });
                    if (res.ok) {
                      setAvailableExercises(prev => prev.filter(ej => ej.id !== exerciseToDelete.id));
                      setSelectedExerciseId("");
                      setShowDeleteModal(false);
                      setExerciseToDelete(null);
                      setDeleteError("");
                    } else {
                      setDeleteError("No se puede eliminar un ejercicio que posee rutinas asociadas");
                    }
                  } catch {
                    setDeleteError("Error de conexión al eliminar");
                  }
                }}
              >Eliminar</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setExerciseToDelete(null);
                  setDeleteError("");
                }}
              >Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRoutine;