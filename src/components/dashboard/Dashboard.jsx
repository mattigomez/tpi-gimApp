import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { routines as dataRoutines } from "../../data/routines";
import Routines from "../routines/Routines";
import NewRoutine from "../newRoutine/NewRoutine";
import Header from "../header/Header"

const Dashboard = ({onLogout}) => {
  const [routines, setRoutines] = useState(dataRoutines);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login", { replace: true });
  }

  const handleAddRoutine = (newRoutine) => {
    setRoutines((prevRoutines) => [newRoutine, ...prevRoutines]);
  };

  const handleDeleteRoutine = (routineId) => {
    setRoutines((prevRoutines) =>
      prevRoutines.filter((routine) => routine.id !== routineId)
    );
  };



  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#6d6d65",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "100px",
    }}
  >
    <Header onLogout={onLogout} />
    <h2>Tus rutinas</h2>
    <Routes>
      <Route
        index
        element={
          <Routines routines={routines} onDelete={handleDeleteRoutine} />
        }
      />
      <Route
        path="add-routine"
        element={<NewRoutine onAddRoutine={handleAddRoutine} />}
      />
    </Routes>
  </div>
)}

export default Dashboard;
