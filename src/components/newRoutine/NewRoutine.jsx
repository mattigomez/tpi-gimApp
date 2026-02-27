import { useEffect, useState } from "react";
import { Button, Col, Form, Row, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { authFetch } from "../../services/authFetch";
import "./newRoutine.css";

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
  const [activeTab, setActiveTab] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    authFetch("/Exercises")
      .then(res => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(data => setAvailableExercises(Array.isArray(data) ? data : []))
      .catch(() => setAvailableExercises([]));
  }, []);

  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLevel(levelToInt(initialData.level));
      setExercises(initialData.exercises || []);
    }
  }, [initialData, isEditMode]);

  const handleAddExercise = async () => {
    if (!exerciseName || !sets || !repetitions) return;
    try {
      const res = await authFetch("/Exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: exerciseName,
          sets: parseInt(sets),
          repetitions: parseInt(repetitions),
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let msg = text;
        try { msg = JSON.parse(text)?.message || text; } catch { /* plain text */ }
        toast.error(msg || "Error al crear el ejercicio");
        return;
      }
      const created = await res.json();
      const newEx = { id: created.id, name: exerciseName, sets: parseInt(sets), repetitions: parseInt(repetitions) };
      setAvailableExercises(prev => [...prev, newEx]);
      setExercises(prev => [...prev, newEx]);
      setExerciseName("");
      setSets("");
      setRepetitions("");
    } catch {
      toast.error("Error de conexión al crear el ejercicio");
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
    let routinesList = [];
    try {
      const resRoutines = await authFetch("/Routines");
      if (resRoutines.ok) routinesList = await resRoutines.json();
    } catch { /* lista vacía, sin bloqueo */ }
    const titleNormalized = title.trim().toLowerCase();
    const duplicate = routinesList.find(r =>
      r.title.trim().toLowerCase() === titleNormalized &&
      (!isEditMode || r.id !== initialData?.id)
    );
    if (duplicate) {
      setDuplicateTitleError("El nombre de rutina ya está en uso");
      return;
    }
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    if (title.length > 60) {
      toast.error("El título no puede superar los 60 caracteres");
      return;
    }
    if (!description.trim()) {
      toast.error("La descripción es obligatoria");
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

    const routineData = { title, description, level };
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
      if (!res.ok) {
        toast.error(isEditMode ? "Error al actualizar rutina" : "Error al crear rutina");
        return;
      }

      // Obtener routineId para asociar ejercicios
      let routineId = initialData?.id;
      if (!isEditMode) {
        const created = await res.json();
        routineId = created.id;
      }

      // Asociar cada ejercicio de la lista a la rutina
      const alreadyAssociated = new Set((initialData?.exercises || []).map(e => e.id));
      for (const ex of exercises) {
        if (ex.id && !alreadyAssociated.has(ex.id)) {
          await authFetch(`/Exercises/${ex.id}/associate/${routineId}`, { method: "PUT" });
        }
      }

      // Desasociar ejercicios que se quitaron (solo en modo edición)
      if (isEditMode) {
        const currentIds = new Set(exercises.filter(e => e.id).map(e => e.id));
        for (const ex of (initialData?.exercises || [])) {
          if (ex.id && !currentIds.has(ex.id)) {
            await authFetch(`/Exercises/${ex.id}/disassociate/${routineId}`, { method: "DELETE" });
          }
        }
      }

      setTitle("");
      setDescription("");
      setLevel(1);
      setExercises([]);
      toast.success(isEditMode ? "Rutina actualizada con éxito" : "Rutina creada con éxito");
      if (typeof window.refreshRoutines === "function") window.refreshRoutines();
      if (onClose) onClose();
      if (!isEditMode) navigate("/dashboard");
    } catch {
      toast.error("Error de conexión");
    }
  };

  const handleGoBack = () => {
    if (onClose) onClose();
    else navigate("/dashboard", { replace: true });
  };

  return (
    <div className="new-routine-page">
      <div className="new-routine-container">
        <div className="routine-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              <span>1</span> Datos Básicos
            </button>
            <button 
              className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => setActiveTab(2)}
            >
              <span>2</span> Ejercicios
            </button>
            <button 
              className={`tab-button ${activeTab === 3 ? 'active' : ''}`}
              onClick={() => setActiveTab(3)}
            >
              <span>3</span> Revisar
            </button>
          </div>

          <Form onSubmit={handleSubmit} autoComplete="off">
            {/* TAB 1: DATOS BÁSICOS */}
            {activeTab === 1 && (
              <div className="tab-content">
                <h4>Información de la Rutina</h4>
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

                <Form.Group className="mb-4">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción breve de la rutina"
                    maxLength={200}
                    required
                  />
                  {formTriedSubmit && !description.trim() && <div className="text-danger mt-1">La descripción es obligatoria</div>}
                  <small className="text-muted">{description.length}/200</small>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={() => setActiveTab(2)}
                  >
                    Siguiente →
                  </Button>
                  <Button variant="outline-secondary" onClick={handleGoBack}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: EJERCICIOS */}
            {activeTab === 2 && (
              <div className="tab-content">
                <h4>Agregar Ejercicios</h4>

                <div className="exercise-section">
                  <h5>Ejercicio Existente</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Seleccionar ejercicio</Form.Label>
                    <Form.Select
                      value={selectedExerciseId}
                      onChange={e => setSelectedExerciseId(e.target.value)}
                      disabled={editingExerciseId !== null}
                    >
                      <option value="">Seleccionar un ejercicio...</option>
                      {availableExercises.map(ex => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} - {ex.sets}x{ex.repetitions}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <div className="d-flex gap-2 mb-3">
                    <Button
                      onClick={handleAddExistingExercise}
                      variant="info"
                      className="flex-grow-1"
                      disabled={editingExerciseId !== null}
                    >
                      ➕ Agregar
                    </Button>
                    <Button
                      onClick={() => {
                        if (!selectedExerciseId) return toast.info("Selecciona un ejercicio");
                        const ex = availableExercises.find(e => e.id === parseInt(selectedExerciseId));
                        if (!ex) return toast.error("Ejercicio no encontrado");
                        setEditingExerciseId(ex.id);
                        setEditSets(ex.sets);
                        setEditRepetitions(ex.repetitions);
                      }}
                      variant="warning"
                      disabled={editingExerciseId !== null}
                    >
                      ✏️ Modificar
                    </Button>
                    <Button
                      onClick={() => {
                        if (!selectedExerciseId) return toast.info("Selecciona un ejercicio");
                        const ex = availableExercises.find(e => e.id === parseInt(selectedExerciseId));
                        if (!ex) return toast.error("Ejercicio no encontrado");
                        setExerciseToDelete(ex);
                        setShowDeleteModal(true);
                      }}
                      variant="danger"
                      disabled={editingExerciseId !== null}
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>

                  {editingExerciseId && (
                    <div className="edit-panel mb-3">
                      <h6>Editar Series y Repeticiones</h6>
                      <Row className="g-2 mb-2">
                        <Col md={6}>
                          <Form.Label>Series</Form.Label>
                          <Form.Control
                            type="number"
                            value={editSets}
                            onChange={e => setEditSets(e.target.value)}
                            min={1}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Repeticiones</Form.Label>
                          <Form.Control
                            type="number"
                            value={editRepetitions}
                            onChange={e => setEditRepetitions(e.target.value)}
                            min={1}
                          />
                        </Col>
                      </Row>
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          className="flex-grow-1"
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
                                toast.success("Ejercicio modificado");
                                setEditingExerciseId(null);
                              } else {
                                toast.error("Error al modificar");
                              }
                            } catch {
                              toast.error("Error de conexión");
                            }
                          }}
                        >
                          Guardar
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingExerciseId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <hr />

                <div className="exercise-section">
                  <h5>Nuevo Ejercicio</h5>
                  <Row className="g-2 mb-2">
                    <Col md={6}>
                      <Form.Control
                        placeholder="Nombre"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="number"
                        placeholder="Series"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="number"
                        placeholder="Reps"
                        value={repetitions}
                        onChange={(e) => setRepetitions(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Button 
                    onClick={handleAddExercise} 
                    variant="success" 
                    className="w-100"
                  >
                    Agregar Nuevo Ejercicio
                  </Button>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <Button 
                    variant="outline-secondary" 
                    className="flex-grow-1"
                    onClick={() => setActiveTab(1)}
                  >
                    ← Anterior
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-grow-1"
                    onClick={() => setActiveTab(3)}
                  >
                    Siguiente →
                  </Button>
                  <Button variant="outline-secondary" onClick={handleGoBack}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 3: REVISAR */}
            {activeTab === 3 && (
              <div className="tab-content">
                <h4>Revisar y Crear</h4>

                <div className="review-section">
                  <h6>Datos de la Rutina</h6>
                  <div className="review-item">
                    <span className="label">Título:</span>
                    <span className="value">{title || '(no especificado)'}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Nivel:</span>
                    <span className="value">{['Principiante', 'Intermedio', 'Avanzado'][level - 1]}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Descripción:</span>
                    <span className="value">{description || '(sin descripción)'}</span>
                  </div>

                  <h6 className="mt-3">Ejercicios ({exercises.length})</h6>
                  {exercises.length > 0 ? (
                    <ListGroup>
                      {exercises.map((ex, index) => (
                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold">{ex.name}</div>
                            <small className="text-muted">{ex.sets}x{ex.repetitions}</small>
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveExercise(index)}
                          >
                            ✕
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-danger">⚠️ Debe agregar al menos un ejercicio</div>
                  )}
                </div>

                <div className="d-flex gap-2 mt-4">
                  <Button 
                    variant="outline-secondary" 
                    className="flex-grow-1"
                    onClick={() => setActiveTab(2)}
                  >
                    ← Anterior
                  </Button>
                  <Button 
                    type="submit" 
                    variant="success" 
                    className="flex-grow-1"
                  >
                    {isEditMode ? "Guardar Cambios" : "Crear Rutina"}
                  </Button>
                  <Button variant="outline-secondary" onClick={handleGoBack}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>

          {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
          {showDeleteModal && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              borderRadius: 12
            }}>
              <div style={{
                background: 'rgba(20, 22, 25, 0.95)',
                borderRadius: 8,
                padding: 32,
                minWidth: 320,
                textAlign: 'center',
                boxShadow: '0 0 24px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h5 style={{marginBottom: 24, color: '#ffffff'}}>¿Desea eliminar el ejercicio "{exerciseToDelete?.name}"?</h5>
                {deleteError && <div style={{ color: '#ff6b6b', marginBottom: 12 }}>{deleteError}</div>}
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
                    variant="outline-secondary"
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
      </div>
  );
};

export default NewRoutine;