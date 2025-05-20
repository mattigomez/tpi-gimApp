import { useState } from "react";
import { Route, Routes } from "react-router";
import { routines as dataRoutines } from "../../data/routines";
import Routines from "../routines/Routines";
import NewRoutine from "../newRoutine/NewRoutine";
import Header from "../header/Header"

const Dashboard = () => {
  const [routines, setRoutines] = useState(dataRoutines);


  const handleAddRoutine = (newRoutine) => {
    setRoutines((prevRoutines) => [newRoutine, ...prevRoutines]);
  };

  const handleDeleteRoutine = (routineId) => {
    setRoutines((prevRoutines) =>
      prevRoutines.filter((routine) => routine.id !== routineId)
    );
  };



  return (
    <>
      <Header/>
      <h2>GYMHUB</h2>
      <Routes>
        <Route
          index
          element={
            <Routines routines={routines} onDelete={handleDeleteRoutine} />
          }
        />
        <Route
          path="/add-routine"
          element={<NewRoutine onAddRoutine={handleAddRoutine} />}
        />
      </Routes>
    </>
  );
};

export default Dashboard;
