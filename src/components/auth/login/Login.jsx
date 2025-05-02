import { useRef, useState } from "react"
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({
    email:false,
    password: false
  })
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrors(prevErrors => ({
      ...prevErrors,
      email: false
    }))
  }
  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.length){
      alert("El mail esta vacio!");
      emailRef.current.focus();
      setErrors(prevErrors => ({
        ...prevErrors,
        email: true
      }))
      return;
    }

    if (!passwordRef.current.value.length){
      alert("El password esta vacio!");
      passwordRef.current.focus();
      setErrors(prevErrors => ({
        ...prevErrors,
        password: true
      }))
      return;
    }

    onLogin();
    navigate('/home')
  }
  
  return (
    <Card className="mt-5 mx-3 p-3 px-5 shadow">
      <Card.Body>
        <Row className="mb-2">
          <h5>Bienvenidos a gimApp!</h5>
        </Row>
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-4">
            <Form.Control 
            type="text"
            className={ `input-email ${errors.email ? 'border border-danger' : ''}`}
            placeholder="Ingresar email" 
            onChange={handleEmailChange} 
            value={email}
            ref={emailRef} 
            />
            {errors.email && <p className="text-danger">El campo email es obligatorio</p>}
          </FormGroup>
          <FormGroup className="mb-4">
            <Form.Control 
            type="password" 
            placeholder="Ingresar contraseña" 
            onChange={handlePasswordChange} 
            value={password} 
            ref={passwordRef}
            />
          </FormGroup>
          <Row>
            <Col md={6} className="d-flex justify-content-end">
              <Button variant="secondary" type="submit">
                Iniciar sesión 
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default Login