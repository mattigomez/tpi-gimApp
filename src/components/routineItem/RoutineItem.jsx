import { Card, Button, Badge, ListGroup } from "react-bootstrap";
import './routineItem.css';

const RoutineItem = ({
    title,
    description,
    level,
    exercises,
    onRoutineSelected
}) => {

    const handleSelectRoutine = () => {
        onRoutineSelected(title);
    };

    return (
        <Card className="mx-3 mb-3 card-container">
            <Card.Body>
                <Badge bg="primary" className="mb-2">{level}</Badge>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{description}</Card.Text>

                <ListGroup className="mb-3" variant="flush">
                    {exercises.map((exercise, index) => (
                        <ListGroup.Item key={index}>
                            {exercise.name} - {exercise.sets}x{exercise.repetitions ?? exercise.reps ?? exercise.duration ?? ''}
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <Button onClick={handleSelectRoutine}>Seleccionar rutina</Button>
            </Card.Body>
        </Card>
        
    );
};

export default RoutineItem;
