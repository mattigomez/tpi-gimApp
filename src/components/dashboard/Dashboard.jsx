import { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { Route, Routes, useNavigate } from 'react-router'
import { routines as dataRoutines } from "../../data/routines"
import Routines from '../routines/Routines'
import NewRoutine from '../newRoutine/NewRoutine'

const Dashboard = ({ onLogout }) => {
  const [routines, setRoutines] = useState(dataRoutines)
  
  const navigate = useNavigate();

  const handleAddRoutine = (newRoutine) => {
    setRoutines(prevRoutines => [newRoutine, ...prevRoutines])
  }

  const handleDeleteRoutine = (routineId) => {
    setRoutines( prevRoutines => prevRoutines.filter(routine => routine.id !== routineId))
  }

  const handleNavigateAddRoutine = () => {
    navigate("/home/add-routine", { replace: true });
  }

  const handleNavigateHome = () => {
    navigate("/home", { replace: true });
  }

  return (
    <>
      <Row className='w-100 my-3'>
        <Col md={3} className="d-flex justify-content-end ">
          <Button className="me-3" variant="success" onClick={handleNavigateAddRoutine}>Agregar Rutina</Button>
          <Button onClick={onLogout}>Cerrar sesión</Button>
          <Button onClick={handleNavigateHome}>Home</Button>
        </Col>
      </Row>
        <h2>GimApp</h2>
      <Routes>
          <Route index element={<Routines routines={routines} onDelete={handleDeleteRoutine} />} />
          <Route path="/add-routine" element={<NewRoutine onAddRoutine={handleAddRoutine} />} />
      </Routes>
    </>    

  )
}

export default Dashboard


