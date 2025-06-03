import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const NewRoutine = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("principiante");

  // Para agregar ejercicios nuevos
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [exercises, setExercises] = useState([]);

  // Para seleccionar ejercicios existentes
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");

  const navigate = useNavigate();

  // Traer ejercicios existentes al montar
  useEffect(() => {
    fetch("http://localhost:3000/exercises")
      .then(res => res.json())
      .then(data => setAvailableExercises(data));
  }, []);

  // Agregar ejercicio nuevo
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

  // Agregar ejercicio existente
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

  // Eliminar ejercicio de la lista
  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  // Enviar rutina a la API
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newRoutine = {
      title,
      description,
      level,
      exercises,
    };
    try {
      const res = await fetch("http://localhost:3000/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoutine),
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        setLevel("principiante");
        setExercises([]);
        toast.success("Rutina creada con éxito");
        navigate("/dashboard");
        if (typeof window.refreshRoutines === "function") window.refreshRoutines();
      } else {
        toast.error("Error al crear rutina");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const handleGoBack = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <Card className="m-auto bg-dark p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Título de la rutina</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Full Body Principiante"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nivel</Form.Label>
                  <Form.Select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
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
                placeholder="Descripción breve de la rutina"
              />
            </Form.Group>

            <hr />
            <h5 className="mt-3">Agregar ejercicios</h5>
            {/* Selección de ejercicios existentes */}
            <Form.Group className="mb-3">
              <Form.Label>Agregar ejercicio existente</Form.Label>
              <Row>
                <Col md={8}>
                  <Form.Select
                    value={selectedExerciseId}
                    onChange={e => setSelectedExerciseId(e.target.value)}
                  >
                    <option value="">Seleccionar ejercicio...</option>
                    {availableExercises.map(ex => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} - {ex.sets}x{ex.repetitions}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Button onClick={handleAddExistingExercise} variant="info" className="w-100">
                    Agregar existente
                  </Button>
                </Col>
              </Row>
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
                <Button onClick={handleAddExercise} variant="secondary" className="mb-2 w-100">
                  Agregar nuevo
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

            <Button type="submit" variant="success" className="mb-2 w-100">
              Crear Rutina
            </Button>
            <Button variant="outline-secondary" onClick={handleGoBack} className="w-100">
              Volver
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewRoutine;