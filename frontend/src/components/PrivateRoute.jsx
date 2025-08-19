// src/components/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function PrivateRoute({ children }) {
  const { token } = useContext(UserContext);

  // If no token → redirect to login (AuthScreen)
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
