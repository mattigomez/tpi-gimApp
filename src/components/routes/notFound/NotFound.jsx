import React from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router'

const NotFound = () => {
  const navigate = useNavigate();

  const goBackLoginHandler = () => {
    navigate("/login")
  }

  return (
    <div className="vh-100 vw-100 bg-dark text-white text-center d-flex justify-content-center align-items-center flex-column">
      <img
        src="/src/assets/logowhite-GYMHUB.png"
        height="300"
      />
      <h2> ¡Ups! La pagina solicitada no fue encontrada</h2>
      <Button className="text-center" onClick={goBackLoginHandler}>
        Volver al inicio de sesion
      </Button>
    </div>
  )
}

export default NotFound