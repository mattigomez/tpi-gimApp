import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Routines from "../routines/Routines";
import NewRoutine from "../newRoutine/NewRoutine";
import Header from "../header/Header";
import { authFetch } from "../../services/authFetch";
import Protected from "../routes/protected/Protected";
import "./dashboard.css";

const Dashboard = ({ handleLogout }) => {
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    authFetch("/Routines")
      .then((res) => res.json())
      .then((data) => setRoutines(data));
  }, []);

  const refreshRoutines = () => {
    authFetch("/Routines")
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
    <>
      <Header onLogout={handleLogout} />
      <div className="dashboard-page">
        <div className="dashboard-container">
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
      </div>
    </>
  );
};

export default Dashboard;
