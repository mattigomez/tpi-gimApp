import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Routines from "../routines/Routines";
import NewRoutine from "../newRoutine/NewRoutine";
import Header from "../header/Header";
import { authFetch } from "../../services/authFetch";
import Protected from "../routes/protected/Protected";

const Dashboard = ({ handleLogout }) => {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    authFetch("http://localhost:3000/routines")
      .then((res) => res.json())
      .then((data) => setRoutines(data));
  }, []);

  const refreshRoutines = () => {
    authFetch("http://localhost:3000/routines")
      .then((res) => res.json())
      .then((data) => setRoutines(data));
  };

  useEffect(() => {
    window.refreshRoutines = refreshRoutines;
    return () => {
      window.refreshRoutines = null;
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--my-bg)",
        color: "var(--my-text)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "100px",
      }}
    >
      <Header onLogout={handleLogout} />
      <Routes>
        <Route index element={<Routines routines={routines} />} />
        <Route element={<Protected allowedRoles={["admin", "trainer"]} />}>
          <Route
            path="add-routine"
            element={<NewRoutine onAddRoutine={refreshRoutines} />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default Dashboard;
