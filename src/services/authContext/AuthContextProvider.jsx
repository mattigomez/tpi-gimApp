import { useState } from "react";
import { AuthContext } from "./Auth.context";
import { getUserClaims, normalizeRole } from "../jwtClaims";

const tokenSaved = localStorage.getItem("GymHub-2025");

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(tokenSaved);

  const handleUserLogin = (newToken) => {
    localStorage.setItem("GymHub-2025", newToken);
    setToken(newToken);

    const claims = getUserClaims(newToken);
    localStorage.setItem("GymHub-UserRole", normalizeRole(claims?.role) || "");
    localStorage.setItem("GymHub-UserEmail", claims?.email || "");
  };

  const handleUserLogout = () => {
    localStorage.removeItem("GymHub-2025");
    localStorage.removeItem("GymHub-UserRole");
    localStorage.removeItem("GymHub-UserEmail");
    setToken("");
  };

  return (
    <AuthContext value={{ token, handleUserLogin, handleUserLogout }}>
      {children}
    </AuthContext>
  );
};

export default AuthContextProvider;
