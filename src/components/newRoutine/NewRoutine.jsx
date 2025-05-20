import { useState } from "react";
import { Button, Card, Col, Form, Row, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router";

const NewRoutine = ({ onAddRoutine }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("Principiante");
  const [imageUrl, setImageUrl] = useState("");

  // Para agregar ejercicios
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [exercises, setExercises] = useState([]);

  const handleAddExercise = () => {
    if (exerciseName && sets && (reps || reps === 0)) {
      setExercises([
        ...exercises,
        {
          name: exerciseName,
          sets: parseInt(sets),
          reps: parseInt(reps),
        },
      ]);
      setExerciseName("");
      setSets("");
      setReps("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newRoutine = {
      title,
      description,
      duration,
      level,
      imageUrl,
      exercises,
    };
    onAddRoutine(newRoutine);
    // Reset form
    setTitle("");
    setDescription("");
    setDuration("");
    setLevel("Principiante");
    setImageUrl("");
    setExercises([]);
  };
 const navigate = useNavigate();
  const handleGoBack = () =>{
    navigate("/dashboard", {replace : true});
  }
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
              <Form.Label>Duración</Form.Label>
              <Form.Control
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ej. 45 minutos"
              />
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
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nivel</Form.Label>
              <Form.Select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option>Principiante</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>URL de imagen</Form.Label>
              <Form.Control
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />
        <h5 className="mt-3">Agregar ejercicios</h5>
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
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="mb-2"
            />
          </Col>
            <Button onClick={handleAddExercise} variant="secondary" className="mb-2 w-100">
              Agregar
            </Button>
        </Row>

        {exercises.length > 0 && (
          <ListGroup className="mb-3 mt-3">
            {exercises.map((ex, index) => (
              <ListGroup.Item key={index}>
                {ex.name} - {ex.sets}x{ex.reps}
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
