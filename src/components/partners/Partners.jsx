import { Card, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/partners") // Ahora usa /partners
      .then((res) => res.json())
      .then((data) => setPartners(data))
      .catch((err) => console.error(err));
  }, []);

  const handleGoBack = () => {
    navigate("/home", { replace: true });
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <Card className="m-auto bg-dark p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <Card.Body>
          <Card.Title className="mb-4">Lista de Socios</Card.Title>
          <ListGroup variant="flush">
            {partners.map((p, idx) => (
              <ListGroup.Item key={idx} className="bg-dark text-white mb-2 border rounded">
                <div><b>Nombre:</b> {p.nombre} {p.apellido}</div>
                <div><b>Edad:</b> {p.edad} años</div>
                <div><b>Estatura:</b> {p.estatura} cm</div>
                <div><b>Peso:</b> {p.peso} kg</div>
                <div><b>Teléfono:</b> {p.telefono}</div>
                <div><b>Email:</b> {p.email}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="outline-secondary" onClick={handleGoBack} className="mt-3 w-100">
            Volver
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Partners;