// src/components/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function PrivateRoute({ children, roles }) {
  const { token, user } = useContext(UserContext);

  // If not logged in → redirect
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If route requires specific roles → check role
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default PrivateRoute;
