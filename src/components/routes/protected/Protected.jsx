import { useContext } from "react";
import { AuthContext } from "../../../services/authContext/Auth.context";
import { Navigate, Outlet } from "react-router";

const Protected = ({allowedRoles}) => {
  const { token } = useContext(AuthContext);
  const role = localStorage.getItem("GymHub-UserRole");
  if (!token) {
    return <Navigate to='/login' replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/*" replace />;
  return <Outlet />;
};

export default Protected;