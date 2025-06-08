import { useContext } from "react";
import { AuthContext } from "../../../services/authContext/Auth.context";
import { Navigate, Outlet } from "react-router";

const Protected = () => {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to='/login' replace />;
  }
  return <Outlet />;
};

export default Protected;