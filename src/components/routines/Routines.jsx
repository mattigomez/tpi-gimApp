import { useState } from "react";
import RoutineItem from "../routineItem/RoutineItem";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const Routines = ({ routines }) => {
  const [selectedRoutine, setSelectedRoutine] = useState("");

  // Recibe la función para refrescar rutinas desde el padre si existe
  const refreshRoutines = typeof window.refreshRoutines === 'function' ? window.refreshRoutines : undefined;

  const handleRoutineSelected = (routineTitle) => {
    setSelectedRoutine(routineTitle);
  };
  const navigate = useNavigate()
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

      <div className="d-flex justify-content-center flex-wrap">
        {routinesMapped}
      </div>
      <Button
        variant="success"
        className="me-2"
        onClick={handleNavigateAddRoutine}
      >
        Agregar Rutina
      </Button>
    </>
  );
};

export default Routines;
