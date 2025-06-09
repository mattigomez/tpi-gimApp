import { useState, useEffect, useContext } from "react";
import RoutineItem from "../routineItem/RoutineItem";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { AuthContext } from "../../services/authContext/Auth.context";
import { jwtDecode } from "../../services/jwtDecode";
import { authFetch } from "../../services/authFetch";

const Routines = ({ routines }) => {
  const [assignedRoutine, setAssignedRoutine] = useState(null);
  const [storageFlag, setStorageFlag] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [search, setSearch] = useState("");

  const refreshRoutines =
    typeof window.refreshRoutines === "function"
      ? window.refreshRoutines
      : undefined;
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "routine-assigned-updated") {
        setStorageFlag(Date.now());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    if (!token) return;
    const user = jwtDecode(token);
    if (!user?.id) return;
    authFetch(`http://localhost:3000/partners/${user.id}`)
      .then((res) => res.json())
      .then((data) => setUserInfo(data))
      .catch(() => setUserInfo(null));
  }, [token, routines, storageFlag]);


  useEffect(() => {
    if (!userInfo?.activeRoutineId) {
      setAssignedRoutine(null);
      return;
    }
    const found = routines.find(
      (r) =>
        r.id === userInfo.activeRoutineId ||
        r.id === Number(userInfo.activeRoutineId)
    );
    setAssignedRoutine(found || null);
  }, [userInfo, routines]);

  const handleNavigateAddRoutine = () => {
    navigate("/dashboard/add-routine", { replace: true });
  };

  const showAddButton =
    userInfo && (userInfo.role === "trainer" || userInfo.role === "admin");

  const filteredRoutines = routines.filter((routine) =>
    routine.title.toLowerCase().includes(search.toLowerCase())
  );

  const routinesMapped = filteredRoutines.map((routine) => (
    <RoutineItem
      key={routine.id}
      title={routine.title}
      description={routine.description}
      level={routine.level}
      exercises={routine.exercises}
      id={routine.id}
      refreshRoutines={refreshRoutines}
    />
  ));

  return (
    <>
      {showAddButton && (
        <Button
          variant="success"
          className="me-2 mb-2"
          onClick={handleNavigateAddRoutine}
        >
          Agregar Rutina
        </Button>
      )}

      {userInfo && userInfo.role === "user" && (
        <div className="my-4 w-100 d-flex flex-column align-items-center">
          <h2>Rutina asignada</h2>
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
      )}
      <div className="w-100 d-flex flex-column align-items-center">
        <h2>Rutinas</h2>
        <Form
          className="mb-3 w-100 "
          style={{
            maxWidth: 400,
            margin: "0 auto",

          }}
        >
          <Form.Control
            className="routines-search-input"
            type="text"
            placeholder="Buscar rutina por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              color: "var(--my-text)",
              backgroundColor: "var(--my-bg)", 
              borderColor: "var(--my-primary)",
            }}
          />
        </Form>
      </div>
      <div className="d-flex justify-content-center flex-wrap">
        {routinesMapped}
      </div>
    </>
  );
};

export default Routines;
