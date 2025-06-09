import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Login from "./components/auth/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import NotFound from "./components/routes/notFound/NotFound";
import Protected from "./components/routes/protected/Protected";
import { ToastContainer } from "react-toastify";
import Home from "./components/home/Home";
import Account from "./components/account/Account";
import Partners from "./components/partners/Partners";


const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  const handleLogout = () => {
    setIsSignedIn(false);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="login" />} />
          <Route path="/login" element={<Login onLogin={handleSignIn} />} />
          <Route element={<Protected isSignedIn={isSignedIn} />}>
            <Route path="/home/*" element={<Home onLogout={handleLogout} />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Route>
          <Route path="/account" element={<Account />} />
          <Route path="/partners" element={<Partners  />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
