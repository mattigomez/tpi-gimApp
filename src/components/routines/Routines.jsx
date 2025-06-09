import { useState, useEffect, useContext } from "react";
import RoutineItem from "../routineItem/RoutineItem";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { AuthContext } from "../../services/authContext/Auth.context";
import { jwtDecode } from "../../services/jwtDecode";
import { authFetch } from "../../services/authFetch";

const Routines = ({ routines }) => {
  const [selectedRoutine, setSelectedRoutine] = useState("");
  const [assignedRoutine, setAssignedRoutine] = useState(null);
  const [storageFlag, setStorageFlag] = useState(0);
  const [userInfo, setUserInfo] = useState(null);

  // Recibe la función para refrescar rutinas desde el padre si existe
  const refreshRoutines = typeof window.refreshRoutines === 'function' ? window.refreshRoutines : undefined;
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Escucha cambios en localStorage para rutina asignada
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "routine-assigned-updated") {
        setStorageFlag(Date.now());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Fetch usuario actualizado cada vez que cambia storageFlag o routines
  useEffect(() => {
    if (!token) return;
    const user = jwtDecode(token);
    if (!user?.id) return;
    authFetch(`http://localhost:3000/partners/${user.id}`)
      .then(res => res.json())
      .then(data => setUserInfo(data))
      .catch(() => setUserInfo(null));
  }, [token, routines, storageFlag]);

  // Actualiza la rutina asignada cuando cambia el usuario o las rutinas
  useEffect(() => {
    if (!userInfo?.activeRoutineId) {
      setAssignedRoutine(null);
      return;
    }
    const found = routines.find(
      r => r.id === userInfo.activeRoutineId || r.id === Number(userInfo.activeRoutineId)
    );
    setAssignedRoutine(found || null);
  }, [userInfo, routines]);

  const handleRoutineSelected = (routineTitle) => {
    setSelectedRoutine(routineTitle);
  };
  const handleNavigateAddRoutine = () => {
    navigate("/dashboard/add-routine", { replace: true });
  };

  const routinesMapped = routines.map((routine) => (
    <RoutineItem
      key={routine.id}
      title={routine.title}
      description={routine.description}
      level={routine.level}
      exercises={routine.exercises}
      id={routine.id}
      onRoutineSelected={handleRoutineSelected}
      refreshRoutines={refreshRoutines}
    />
  ));

  return (
    <>
      {selectedRoutine && (
        <p>
          Usted ha seleccionado la rutina: <b>{selectedRoutine}</b>
        </p>
      )}
      <Button
        variant="success"
        className="me-2 mb-2"
        onClick={handleNavigateAddRoutine}
      >
        Agregar Rutina
      </Button>

      {/* Rutina asignada */}
      <div className="my-4 w-100 d-flex flex-column align-items-center">
        <h4>Rutina asignada</h4>
        {assignedRoutine ? (
          <RoutineItem
            key={assignedRoutine.id}
            title={assignedRoutine.title}
            description={assignedRoutine.description}
            level={assignedRoutine.level}
            exercises={assignedRoutine.exercises}
            id={assignedRoutine.id}
            onRoutineSelected={() => {}}
            refreshRoutines={refreshRoutines}
          />
        ) : (
          <p className="text-muted">No tiene rutina asignada actualmente.</p>
        )}
      </div>

      <div className="d-flex justify-content-center flex-wrap">
        {routinesMapped}
      </div>
    </>
  );
};

export default Routines;
