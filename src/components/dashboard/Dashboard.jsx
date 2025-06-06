import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Routines from "../routines/Routines";
import NewRoutine from "../newRoutine/NewRoutine";
import Header from "../header/Header";

const Dashboard = ({ onLogout }) => {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/routines")
      .then(res => res.json())
      .then(data => setRoutines(data));
  }, []);

  const refreshRoutines = () => {
    fetch("http://localhost:3000/routines")
      .then(res => res.json())
      .then(data => setRoutines(data));
  };

  useEffect(() => {
    window.refreshRoutines = refreshRoutines;
    return () => { window.refreshRoutines = null; };
  }, []);

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
            <Routines routines={routines} />
          }
        />
        <Route
          path="add-routine"
          element={
            <NewRoutine
              onAddRoutine={refreshRoutines}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default Dashboard;