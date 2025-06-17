import { useState } from "react";
import { AuthContext } from "./Auth.context";
import { jwtDecode } from "jwt-decode";

const tokenSaved = localStorage.getItem("GymHub-2025");

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(tokenSaved);

  const handleUserLogin = (newToken) => {
    localStorage.setItem("GymHub-2025", newToken);
    setToken(newToken);

    const decoded = jwtDecode(newToken);
    localStorage.setItem("GymHub-UserRole", decoded.role);
    localStorage.setItem("GymHub-UserId", decoded.id);
    localStorage.setItem("GymHub-UserEmail", decoded.email);
  };

  const handleUserLogout = () => {
    localStorage.removeItem("GymHub-2025");
    setToken("");
  };

  return (
    <AuthContext value={{ token, handleUserLogin, handleUserLogout }}>
      {children}
    </AuthContext>
  );
};

export default AuthContextProvider;
